import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

import { ensureInside, PathGuardError, safeFileName, writeFileAtomic } from './lib/fs-guard.mjs'
import {
  downloadGuarded,
  fetchTextGuarded,
  hostAllowlist,
  isAllowedUrl,
  NetGuardError,
} from './lib/net-guard.mjs'

/* Sweeps TÜSTAV's periodical archive for pages naming Şahin Alpay.

   The PDF list comes off a remote index page, so the URLs this script
   requests are chosen by that page. Every request therefore goes through
   net-guard: https only, host fixed to the allowlist derived from SOURCES
   below (redirects included), a byte cap, a timeout, and a redirect cap. The
   filenames come from the same untrusted place and are sanitised before they
   are joined onto the cache directory. */

const ROOT = process.cwd()

const SOURCES = {
  forum: 'https://www.tustav.org/sureli-yayinlar-arsivi/forum/',
  aydinlik: 'https://www.tustav.org/sureli-yayinlar-arsivi/aydinlik/',
  'isci-koylu': 'https://www.tustav.org/sureli-yayinlar-arsivi/isci-koylu/',
}

/* The index pages live on www.tustav.org, but the PDFs they link do not all
   sit on that exact host: TÜSTAV serves the periodical scans from the
   apex `tustav.org`, and the İşçi Köylü issues from a filedn.eu bucket the
   archive uses as a mirror. Deriving the allowlist from SOURCES alone
   therefore rejected the very files the tool exists to fetch — including all
   five volumes the article extractor needs.

   These are additions to the allowlist, not a widening of the rule: a link
   discovered on an index page still cannot introduce a host of its own, and
   every redirect hop is checked against this same set. */
const EXTRA_DOWNLOAD_HOSTS = [
  'tustav.org',
  // TÜSTAV's own file mirror, cited in src/archive/tr/analyses/*.ts as the
  // published source of the İşçi Köylü and Forum scans.
  'filedn.eu',
]

const ALLOWED_HOSTS = new Set([
  ...hostAllowlist(Object.values(SOURCES)),
  ...EXTRA_DOWNLOAD_HOSTS,
])
const INDEX_MAX_BYTES = 8 * 1024 * 1024
const INDEX_TIMEOUT_MS = 60_000

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value = 'true'] = arg.replace(/^--/, '').split('=')
    return [key, value]
  }),
)

function numberArg(name, fallback) {
  if (!args.has(name)) return fallback
  const value = Number(args.get(name))
  if (!Number.isFinite(value) || value <= 0) {
    console.error(`--${name} must be a positive number, got "${args.get(name)}"`)
    process.exit(1)
  }
  return value
}

const selectedSource = args.get('source')
if (selectedSource && !(selectedSource in SOURCES)) {
  console.error(`Unknown --source "${selectedSource}". Known: ${Object.keys(SOURCES).join(', ')}`)
  process.exit(1)
}

const limit = args.has('limit') ? numberArg('limit', Infinity) : Infinity
const python = args.get('python') ?? '/Users/inancozgirgin/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3'
const include = args.get('include')
const noOcr = args.get('no-ocr') === 'true'
const ocrDpi = numberArg('ocr-dpi', 200)
/* A scanned volume runs to a few hundred MB; anything past this is either a
   different file than we asked for or a server misbehaving. */
const pdfMaxBytes = numberArg('max-pdf-mb', 384) * 1024 * 1024
const pdfTimeoutMs = numberArg('download-timeout-sec', 15 * 60) * 1000

/* --out and --cache land straight in fs writes, so keep both inside the repo
   working tree rather than wherever a stray "../" points. */
let outPath
let cacheDir
try {
  outPath = ensureInside(ROOT, args.get('out') ?? 'tmp/tustav-alpay-report.json', '--out')
  cacheDir = ensureInside(ROOT, args.get('cache') ?? 'tmp/tustav-pdfs', '--cache')
} catch (error) {
  console.error(error instanceof PathGuardError ? error.message : error)
  process.exit(1)
}

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
   retry transient network failures a few times before giving up on an issue.
   A guard refusal (off-allowlist host, oversize body, redirect loop) is not
   transient: retrying it just repeats the refusal, so it goes straight up. */
async function withRetry(fn, { attempts = 4, baseDelayMs = 2000 } = {}) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn()
    } catch (error) {
      if (error instanceof NetGuardError && error.permanent) throw error
      lastError = error
      if (attempt === attempts) break
      const delay = baseDelayMs * 2 ** (attempt - 1)
      console.error(`  retry ${attempt}/${attempts - 1} after error: ${error.message} (waiting ${delay}ms)`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  throw lastError
}

function fetchText(url) {
  return withRetry(() =>
    fetchTextGuarded(url, {
      allowedHosts: ALLOWED_HOSTS,
      maxBytes: INDEX_MAX_BYTES,
      timeoutMs: INDEX_TIMEOUT_MS,
      label: 'index page',
    }),
  )
}

async function download(url, filePath) {
  if (fs.existsSync(filePath)) return
  await withRetry(() =>
    downloadGuarded(url, filePath, {
      allowedHosts: ALLOWED_HOSTS,
      maxBytes: pdfMaxBytes,
      timeoutMs: pdfTimeoutMs,
      accept: 'application/pdf',
      label: 'issue PDF',
    }),
  )
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

/** Links are read off a page we do not control, so an off-allowlist or
 *  non-https href is dropped here and reported rather than requested. */
function extractPdfLinks(source, pageUrl, html) {
  const links = [...html.matchAll(/href=["']([^"']+\.pdf[^"']*)["']/gi)].map((match) =>
    match[1].replaceAll('&amp;', '&'),
  )
  const resolved = []
  const rejected = []
  for (const link of new Set(links)) {
    let href
    try {
      href = new URL(link, pageUrl).href
    } catch {
      rejected.push(link)
      continue
    }
    if (!isAllowedUrl(href, { allowedHosts: ALLOWED_HOSTS, label: 'pdf link' })) {
      rejected.push(href)
      continue
    }
    if (isIssuePdf(source, href)) resolved.push(href)
  }
  return { pdfLinks: resolved, rejectedLinks: rejected }
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

function saveProgress(snapshot) {
  writeFileAtomic(outPath, JSON.stringify(snapshot, null, 2))
}

let failed = false

for (const [source, pageUrl] of sourceEntries) {
  let html
  try {
    html = await fetchText(pageUrl)
  } catch (error) {
    console.error(`[${source}] index page failed: ${error.message}`)
    failed = true
    continue
  }
  const { pdfLinks: allPdfLinks, rejectedLinks } = extractPdfLinks(source, pageUrl, html)
  if (rejectedLinks.length > 0) {
    console.error(
      `[${source}] ignored ${rejectedLinks.length} off-allowlist or unusable link(s):\n` +
        rejectedLinks.map((link) => `  - ${link}`).join('\n'),
    )
  }
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
    rejectedLinkCount: rejectedLinks.length,
    include: include ?? null,
    matches: [],
    needsOcr: [],
  }

  for (const [index, pdfUrl] of pdfLinks.entries()) {
    console.error(`[${source}] ${index + 1}/${pdfLinks.length} ${issueLabel(source, pdfUrl)}`)
    // The filename comes from the remote URL: strip it down to a single
    // harmless name and assert the result still sits inside the cache dir.
    let pdfPath
    try {
      const fileName = safeFileName(
        decodeURIComponent(new URL(pdfUrl).pathname.split('/').at(-1) ?? ''),
        `filename for ${pdfUrl}`,
      )
      pdfPath = ensureInside(cacheDir, path.join(source, fileName), `cache path for ${pdfUrl}`)
    } catch (error) {
      sourceReport.needsOcr.push({
        label: issueLabel(source, pdfUrl),
        pdfUrl,
        reason: `unusable filename: ${error.message}`,
      })
      saveProgress([...report, sourceReport])
      continue
    }
    try {
      await download(pdfUrl, pdfPath)
    } catch (error) {
      sourceReport.needsOcr.push({
        label: issueLabel(source, pdfUrl),
        pdfUrl,
        reason: `download failed: ${error.message}`,
      })
      saveProgress([...report, sourceReport])
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
    saveProgress([...report, sourceReport])
  }

  report.push(sourceReport)
}

saveProgress(report)
console.log(JSON.stringify(report, null, 2))

if (failed) {
  console.error('\nOne or more sources could not be read — the report above is incomplete.')
  process.exit(1)
}
