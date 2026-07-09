import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const SOURCES = {
  forum: 'https://www.tustav.org/sureli-yayinlar-arsivi/forum/',
  aydinlik: 'https://www.tustav.org/sureli-yayinlar-arsivi/aydinlik/',
  'isci-koylu': 'https://www.tustav.org/sureli-yayinlar-arsivi/isci-koylu/',
}

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value = 'true'] = arg.replace(/^--/, '').split('=')
    return [key, value]
  }),
)

const selectedSource = args.get('source')
const limit = args.has('limit') ? Number(args.get('limit')) : Infinity
const outPath = args.get('out') ?? 'tmp/tustav-alpay-report.json'
const cacheDir = args.get('cache') ?? 'tmp/tustav-pdfs'
const python = args.get('python') ?? '/Users/inancozgirgin/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3'
const include = args.get('include')
const noOcr = args.get('no-ocr') === 'true'
const ocrDpi = args.has('ocr-dpi') ? Number(args.get('ocr-dpi')) : 200

const SEARCH_PATTERNS = [
  'şahin alpay',
  'sahin alpay',
  'şahin',
  'sahin',
  'alpay',
  'ş. alpay',
  's. alpay',
]

function normalize(value) {
  return value
    .toLocaleLowerCase('tr')
    .replaceAll('ı', 'i')
    .replaceAll('ş', 's')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c')
}

function issueLabel(source, url) {
  const file = decodeURIComponent(url.split('/').at(-1) ?? url)
  return `${source}:${file.replace(/\.pdf$/i, '')}`
}

/* tustav.org's HTTP/2 connections occasionally drop mid-download (GOAWAY) —
   retry transient network failures a few times before giving up on an issue. */
async function withRetry(fn, { attempts = 4, baseDelayMs = 2000 } = {}) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt === attempts) break
      const delay = baseDelayMs * 2 ** (attempt - 1)
      console.error(`  retry ${attempt}/${attempts - 1} after error: ${error.message} (waiting ${delay}ms)`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  throw lastError
}

async function fetchText(url) {
  return withRetry(async () => {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`)
    return response.text()
  })
}

async function download(url, filePath) {
  if (fs.existsSync(filePath)) return
  await withRetry(async () => {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`)
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, Buffer.from(await response.arrayBuffer()))
  })
}

function isIssuePdf(source, url) {
  const normalized = url.toLocaleLowerCase('tr')

  if (source === 'forum') {
    return normalized.includes('/forum/') && normalized.includes('forum_')
  }

  if (source === 'aydinlik') {
    return normalized.includes('/aydinlik/asd/') || normalized.includes('/aydinlik/pda/')
  }

  if (source === 'isci-koylu') {
    return normalized.includes('/isci-koylu/')
  }

  return true
}

function extractPdfLinks(source, html) {
  const links = [...html.matchAll(/href=["']([^"']+\.pdf[^"']*)["']/gi)].map((match) =>
    match[1].replaceAll('&amp;', '&'),
  )
  return [...new Set(links)]
    .map((link) => new URL(link, 'https://www.tustav.org/').href)
    .filter((url) => isIssuePdf(source, url))
}

function extractPdfText(pdfPath) {
  const code = `
import json
import sys
import pdfplumber

pages = []
with pdfplumber.open(sys.argv[1]) as pdf:
    for index, page in enumerate(pdf.pages, start=1):
        pages.append({"page": index, "text": page.extract_text() or ""})
print(json.dumps(pages, ensure_ascii=False))
`

  const result = spawnSync(python, ['-c', code, pdfPath], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 128,
  })

  if (result.status !== 0) {
    return { error: result.stderr || result.stdout || 'pdfplumber failed', pages: [] }
  }

  return { pages: JSON.parse(result.stdout) }
}

/* Aydınlık and İşçi-Köylü issues are scanned images with no text layer, so
   pdfplumber returns empty/near-empty pages — fall back to rendering each
   page and running Tesseract (Turkish) over it. */
function extractPdfTextViaOcr(pdfPath, dpi) {
  const code = `
import json
import sys
import pdf2image
import pytesseract

pdf_path, dpi = sys.argv[1], int(sys.argv[2])
images = pdf2image.convert_from_path(pdf_path, dpi=dpi)
pages = []
for index, image in enumerate(images, start=1):
    text = pytesseract.image_to_string(image, lang="tur")
    pages.append({"page": index, "text": text})
print(json.dumps(pages, ensure_ascii=False))
`

  const result = spawnSync(python, ['-c', code, pdfPath, String(dpi)], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 256,
    timeout: 30 * 60 * 1000,
  })

  if (result.status !== 0) {
    return { error: result.stderr || result.stdout || 'OCR failed', pages: [] }
  }

  return { pages: JSON.parse(result.stdout) }
}

function scanPages(pages) {
  const hits = []
  let totalChars = 0

  for (const page of pages) {
    totalChars += page.text.length
    const normalized = normalize(page.text)
    const patterns = SEARCH_PATTERNS.filter((pattern) => normalized.includes(normalize(pattern)))
    if (patterns.length === 0) continue

    const firstIndex = Math.min(
      ...patterns
        .map((pattern) => normalized.indexOf(normalize(pattern)))
        .filter((index) => index >= 0),
    )
    hits.push({
      page: page.page,
      patterns,
      snippet: page.text.slice(Math.max(0, firstIndex - 180), firstIndex + 360),
    })
  }

  return { hits, totalChars }
}

const sourceEntries = Object.entries(SOURCES).filter(
  ([source]) => !selectedSource || source === selectedSource,
)

const report = []

for (const [source, pageUrl] of sourceEntries) {
  const html = await fetchText(pageUrl)
  const allPdfLinks = extractPdfLinks(source, html)
  const candidatePdfLinks = include
    ? allPdfLinks.filter((url) => decodeURIComponent(url).toLocaleLowerCase('tr').includes(include.toLocaleLowerCase('tr')))
    : allPdfLinks
  const pdfLinks = candidatePdfLinks.slice(0, limit)
  const sourceReport = {
    source,
    pageUrl,
    scannedPdfCount: pdfLinks.length,
    totalIssuePdfCount: allPdfLinks.length,
    candidatePdfCount: candidatePdfLinks.length,
    include: include ?? null,
    matches: [],
    needsOcr: [],
  }

  for (const [index, pdfUrl] of pdfLinks.entries()) {
    console.error(`[${source}] ${index + 1}/${pdfLinks.length} ${issueLabel(source, pdfUrl)}`)
    const fileName = decodeURIComponent(pdfUrl.split('/').at(-1) ?? 'issue.pdf').replaceAll('/', '-')
    const pdfPath = path.join(cacheDir, source, fileName)
    try {
      await download(pdfUrl, pdfPath)
    } catch (error) {
      sourceReport.needsOcr.push({
        label: issueLabel(source, pdfUrl),
        pdfUrl,
        reason: `download failed: ${error.message}`,
      })
      fs.writeFileSync(outPath, JSON.stringify([...report, sourceReport], null, 2))
      continue
    }
    let extracted = extractPdfText(pdfPath)
    let ocrApplied = false
    const isSparse =
      !extracted.error && scanPages(extracted.pages).totalChars < extracted.pages.length * 30

    if (!noOcr && (extracted.error || isSparse)) {
      console.error(`  -> OCR (${extracted.error ? 'no text layer' : 'sparse text'})`)
      const ocrResult = extractPdfTextViaOcr(pdfPath, ocrDpi)
      if (!ocrResult.error) {
        extracted = ocrResult
        ocrApplied = true
      } else if (extracted.error) {
        sourceReport.needsOcr.push({
          label: issueLabel(source, pdfUrl),
          pdfUrl,
          reason: ocrResult.error,
        })
        continue
      }
    }

    const scanned = scanPages(extracted.pages)
    if (!ocrApplied && scanned.totalChars < extracted.pages.length * 30) {
      sourceReport.needsOcr.push({
        label: issueLabel(source, pdfUrl),
        pdfUrl,
        reason: 'image-only or very sparse text layer',
        pages: extracted.pages.length,
        chars: scanned.totalChars,
      })
    }
    if (scanned.hits.length > 0) {
      sourceReport.matches.push({
        label: issueLabel(source, pdfUrl),
        pdfUrl,
        pages: extracted.pages.length,
        ocrApplied,
        hits: scanned.hits,
      })
    }

    // Persist progress after every issue so a crash doesn't lose completed work.
    fs.mkdirSync(path.dirname(outPath), { recursive: true })
    fs.writeFileSync(outPath, JSON.stringify([...report, sourceReport], null, 2))
  }

  report.push(sourceReport)
}

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
