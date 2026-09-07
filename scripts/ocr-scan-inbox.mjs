import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

import { ensureInside, writeFileAtomic } from './lib/fs-guard.mjs'

/** Batch-OCRs incoming clipping scans so an archive entry can be written from
 *  text instead of from the image. Reading a full-page scan visually is by far
 *  the most expensive way to learn what is on it; this produces, per scan:
 *
 *    text.txt   — the OCR transcription, page by page
 *    report.json — headline candidates ranked by type size, date candidates,
 *                  and every place the byline appears
 *    crops/     — small JPEGs of the headline and byline regions, so the few
 *                 things that genuinely need a human eye (authorship
 *                 confirmation above all) can be checked without opening the
 *                 whole page
 *
 *  Nothing here decides what is true. OCR on newsprint mangles names and dates,
 *  and the archive's rule is that authorship must be confirmed against the page
 *  itself — this only narrows down where to look. Treat every field in
 *  report.json as a lead, not a fact.
 *
 *  Usage: node scripts/ocr-scan-inbox.mjs [sourceDir] [--force] [--lang=tur] [--psm=3]
 */

const ROOT = process.cwd()
const DEFAULT_SOURCE_DIR = path.join(ROOT, 'tmp/scan-inbox')
const OUT_ROOT = path.join(ROOT, 'tmp/ocr')

/** Tesseract wants roughly 300 DPI on newsprint; below that, body type on a
 *  broadsheet degrades badly. Word boxes come back in this pixel space, and
 *  pdftoppm's crop flags read the same space, so crops need no rescaling. */
const RENDER_DPI = 300
const CROP_PADDING = 28
const CROP_QUALITY = 80
const HEADLINE_LIMIT = 8
const MIN_LINE_CONFIDENCE = 40
const BYLINE_CROP_LIMIT = 4
/** Biggest type on the page is regularly an advert or a neighbouring article,
 *  so the top candidate alone misleads. Cropping the leading few costs a few KB
 *  and lets the real headline be picked by eye without opening the full scan. */
const HEADLINE_CROP_LIMIT = 3
const RASTER_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.webp', '.bmp'])

const args = process.argv.slice(2)
const positional = args.filter((arg) => !arg.startsWith('--'))
const force = args.includes('--force')
const lang = args.find((arg) => arg.startsWith('--lang='))?.split('=')[1] ?? 'tur'
const psm = args.find((arg) => arg.startsWith('--psm='))?.split('=')[1] ?? '3'
const sourceDir = path.resolve(ROOT, positional[0] ?? DEFAULT_SOURCE_DIR)

/* Both go to tesseract as argv, never through a shell, but they arrive from
   the command line and are worth pinning to their real shapes anyway: a
   traineddata code (optionally +-joined) and a page-segmentation number. */
if (!/^[a-z]{3}(\+[a-z]{3})*$/.test(lang)) {
  console.error(`--lang must be one or more 3-letter tesseract codes (e.g. tur, tur+eng), got "${lang}"`)
  process.exit(1)
}
if (!/^(1[0-3]|[0-9])$/.test(psm)) {
  console.error(`--psm must be a tesseract page-segmentation mode 0-13, got "${psm}"`)
  process.exit(1)
}

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  if (result.error) {
    if (result.error.code === 'ENOENT') {
      const hint =
        command === 'tesseract'
          ? 'Install it: brew install tesseract tesseract-lang'
          : 'Install poppler: brew install poppler'
      throw new Error(`${command} not found. ${hint}`)
    }
    throw result.error
  }
  if (result.status !== 0) {
    throw new Error(`${command} exited ${result.status}: ${result.stderr.trim()}`)
  }
  return result.stdout
}

const TURKISH_FOLD = {
  ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g', ı: 'i', I: 'i', İ: 'i', ö: 'o', Ö: 'o',
  ş: 's', Ş: 's', ü: 'u', Ü: 'u', â: 'a', Â: 'a', î: 'i', Î: 'i', û: 'u', Û: 'u',
}

/** Length-preserving fold to lowercase ASCII: every substitution is one
 *  character for one character, so an index into the folded string still points
 *  at the same character in the original. That is what lets a pattern run
 *  against the folded copy while the report quotes the untouched text.
 *  slugify() in archive-utils.mjs cannot stand in — it collapses character runs
 *  and destroys that alignment. */
function fold(value) {
  return value.replace(/[çÇğĞıIİöÖşŞüÜâÂîÎûÛ]/g, (char) => TURKISH_FOLD[char] ?? char).toLowerCase()
}

const MONTHS = 'ocak|subat|mart|nisan|mayis|haziran|temmuz|agustos|eylul|ekim|kasim|aralik'

/** Ordered most to least trustworthy; the first pattern that claims a stretch
 *  of text wins it, so a full "28 Ocak 1982" is never also reported as a bare
 *  year. Confidence is about the shape of the match, not OCR quality — a
 *  high-confidence date read off a smudged column is still worth re-checking. */
const DATE_PATTERNS = [
  { kind: 'fullDate', confidence: 'high', regex: new RegExp(String.raw`\b(\d{1,2})\s+(${MONTHS})\s+(\d{4})\b`, 'g') },
  { kind: 'monthYear', confidence: 'medium', regex: new RegExp(String.raw`\b(${MONTHS})\s+(\d{4})\b`, 'g') },
  { kind: 'numeric', confidence: 'medium', regex: /\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/g },
  { kind: 'bareYear', confidence: 'low', regex: /\b(?:19[2-9]\d|20[0-2]\d)\b/g },
]

/** The initials form is deliberately marked low: folded "Ş.A." is "s.a.", which
 *  also matches company abbreviations and mid-sentence OCR noise. It is a place
 *  to look, nothing more. */
const BYLINE_PATTERNS = [
  { kind: 'fullName', confidence: 'high', regex: /\bsahin\s+alpay\b/g },
  { kind: 'initials', confidence: 'low', regex: /\bs\s*\.\s*a\s*\./g },
]

/** Repo-relative when the path is inside the repo, absolute when it is not.
 *  Scans are often kept outside the working tree, and a bare path.relative()
 *  turns those into a wall of "../../.." that tells the reader nothing. */
function displayPath(target) {
  const relative = path.relative(ROOT, target)
  return relative.startsWith('..') ? target : relative
}

function median(values) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 1 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

/** pdftoppm zero-pads the page suffix to the digit width of the page count, so
 *  the exact filename is not predictable. Glob and sort numerically —
 *  lexicographic order would give page-1, page-10, page-2. */
function orderedFiles(dir, extension) {
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(extension) && /\d+/.test(name))
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]))
    .map((name) => path.join(dir, name))
}

function soleFile(dir, extension) {
  const files = fs.readdirSync(dir).filter((name) => name.endsWith(extension))
  if (files.length !== 1) {
    throw new Error(`Expected exactly one ${extension} in ${dir}, found ${files.length}`)
  }
  return path.join(dir, files[0])
}

/** Rebuilds text lines from Tesseract's word-level TSV. The plain-text output
 *  would be simpler to read but carries no geometry, and geometry is the whole
 *  point: type size is what separates a headline from body copy, and the word
 *  boxes are what the byline crops are cut from. */
function linesFromTsv(tsv, page) {
  const grouped = new Map()

  for (const row of tsv.split('\n').slice(1)) {
    const cell = row.split('\t')
    if (cell.length < 12) continue
    if (Number(cell[0]) !== 5) continue // level 5 = word; the rest are containers
    const text = cell[11].trim()
    if (!text) continue
    const confidence = Number(cell[10])
    if (!Number.isFinite(confidence) || confidence < 0) continue

    const left = Number(cell[6])
    const top = Number(cell[7])
    const right = left + Number(cell[8])
    const bottom = top + Number(cell[9])
    const key = `${cell[2]}:${cell[3]}:${cell[4]}` // block:paragraph:line

    const line = grouped.get(key)
    if (!line) {
      grouped.set(key, {
        words: [text], confidences: [confidence], left, top, right, bottom,
        capHeight: Number(cell[9]),
      })
      continue
    }
    line.words.push(text)
    line.confidences.push(confidence)
    line.left = Math.min(line.left, left)
    line.top = Math.min(line.top, top)
    line.right = Math.max(line.right, right)
    line.bottom = Math.max(line.bottom, bottom)
    // Tallest word in the line stands in for cap height. A mean would be
    // dragged down by commas and hyphens, blunting the very signal that
    // headline ranking depends on.
    line.capHeight = Math.max(line.capHeight, Number(cell[9]))
  }

  return [...grouped.values()].map((line) => ({
    page,
    text: line.words.join(' '),
    capHeight: line.capHeight,
    confidence: Math.round(line.confidences.reduce((sum, value) => sum + value, 0) / line.confidences.length),
    box: { x: line.left, y: line.top, width: line.right - line.left, height: line.bottom - line.top },
  }))
}

function headlineCandidates(lines) {
  const bodyHeight = median(lines.map((line) => line.capHeight))
  return lines
    .filter(
      (line) =>
        line.confidence >= MIN_LINE_CONFIDENCE &&
        /\p{L}/u.test(line.text) &&
        line.text.replace(/\s/g, '').length >= 3,
    )
    .map((line) => ({
      page: line.page,
      text: line.text,
      confidence: line.confidence,
      // How many times taller than body copy. More useful than raw pixels,
      // which mean nothing without knowing the scan's resolution.
      sizeVsBody: bodyHeight > 0 ? Number((line.capHeight / bodyHeight).toFixed(2)) : null,
      box: line.box,
    }))
    .sort((a, b) => (b.sizeVsBody ?? 0) - (a.sizeVsBody ?? 0))
    .slice(0, HEADLINE_LIMIT)
}

/** Runs the patterns line by line, so every hit carries the line it sits on —
 *  a date is far easier to judge next to its surrounding words. Earlier
 *  patterns claim their span first, and repeats collapse into a count. */
function findMatches(lines, patterns) {
  const found = new Map()

  for (const line of lines) {
    const folded = fold(line.text)
    const claimed = []

    for (const pattern of patterns) {
      pattern.regex.lastIndex = 0
      for (const match of folded.matchAll(pattern.regex)) {
        const start = match.index
        const end = start + match[0].length
        if (claimed.some((span) => start < span.end && end > span.start)) continue
        claimed.push({ start, end })

        const value = line.text.slice(start, end)
        const key = `${pattern.kind}:${fold(value).replace(/\s+/g, ' ')}`
        const existing = found.get(key)
        if (existing) {
          existing.occurrences += 1
          continue
        }
        found.set(key, {
          kind: pattern.kind,
          confidence: pattern.confidence,
          value,
          context: line.text,
          page: line.page,
          box: line.box,
          occurrences: 1,
        })
      }
    }
  }

  return [...found.values()]
}

function cropRegion(pdfPath, page, box, outPath) {
  const x = Math.max(0, Math.round(box.x - CROP_PADDING))
  const y = Math.max(0, Math.round(box.y - CROP_PADDING))
  const width = Math.round(box.width + CROP_PADDING * 2)
  const height = Math.round(box.height + CROP_PADDING * 2)

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ocr-crop-'))
  try {
    // pdftoppm clamps the crop box to the rendered page, so a region running
    // past an edge simply stops there rather than erroring.
    run('pdftoppm', [
      '-jpeg',
      '-jpegopt', `quality=${CROP_QUALITY}`,
      '-r', String(RENDER_DPI),
      '-f', String(page),
      '-l', String(page),
      '-x', String(x),
      '-y', String(y),
      '-W', String(width),
      '-H', String(height),
      pdfPath,
      path.join(dir, 'crop'),
    ])
    fs.mkdirSync(path.dirname(outPath), { recursive: true })
    fs.copyFileSync(soleFile(dir, '.jpg'), outPath)
    return path.relative(ROOT, outPath)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
}

/** Only real files and real subdirectories are followed: a symlink reports
 *  neither isFile() nor isDirectory() here, so a link planted in the inbox
 *  cannot walk the OCR out of the directory it was pointed at. */
function collectSources(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = ensureInside(sourceDir, path.join(dir, entry.name), 'scan path')
      if (entry.isDirectory()) return collectSources(fullPath)
      if (!entry.isFile()) return []
      const extension = path.extname(entry.name).toLowerCase()
      if (extension !== '.pdf' && !RASTER_EXTENSIONS.has(extension)) return []
      return [fullPath]
    })
    .sort()
}

function ocrPages(sourcePath, isPdf) {
  if (!isPdf) {
    // Tesseract reads JPEG/PNG/TIFF directly, so a raster clipping needs no
    // rendering step. It also means there is no PDF to cut crops from.
    return linesFromTsv(run('tesseract', [sourcePath, 'stdout', '-l', lang, '--psm', psm, 'tsv']), 1)
  }

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ocr-pages-'))
  try {
    run('pdftoppm', ['-png', '-r', String(RENDER_DPI), sourcePath, path.join(dir, 'page')])
    return orderedFiles(dir, '.png').flatMap((imagePath, index) =>
      linesFromTsv(run('tesseract', [imagePath, 'stdout', '-l', lang, '--psm', psm, 'tsv']), index + 1),
    )
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
}

function processScan(sourcePath) {
  const relative = path.relative(sourceDir, sourcePath)
  const slug = relative
    .replace(/\.[^.]+$/, '')
    .split(path.sep)
    .join('/')
  // `slug` is built from the scan's path under sourceDir; keep the derived
  // output inside tmp/ocr whatever that path turns out to look like.
  const outDir = ensureInside(OUT_ROOT, slug, `output directory for ${relative}`)
  const reportPath = path.join(outDir, 'report.json')

  if (!force && fs.existsSync(reportPath)) {
    return { ...JSON.parse(fs.readFileSync(reportPath, 'utf8')), skipped: true }
  }

  const isPdf = path.extname(sourcePath).toLowerCase() === '.pdf'
  const lines = ocrPages(sourcePath, isPdf)
  const pages = lines.length > 0 ? Math.max(...lines.map((line) => line.page)) : 0

  const headlines = headlineCandidates(lines)
  const dates = findMatches(lines, DATE_PATTERNS)
  const bylines = findMatches(lines, BYLINE_PATTERNS)

  fs.mkdirSync(outDir, { recursive: true })

  const transcript = []
  for (let page = 1; page <= pages; page += 1) {
    transcript.push(`--- page ${page} ---`)
    transcript.push(...lines.filter((line) => line.page === page).map((line) => line.text))
    transcript.push('')
  }
  writeFileAtomic(path.join(outDir, 'text.txt'), transcript.join('\n'))

  const crops = {}
  if (isPdf) {
    crops.headlines = headlines.slice(0, HEADLINE_CROP_LIMIT).map((headline, index) =>
      cropRegion(sourcePath, headline.page, headline.box, path.join(outDir, `crops/headline-${index + 1}.jpg`)),
    )
    // Full-name hits first: those are the ones worth actually looking at.
    const ranked = [...bylines].sort((a, b) => (a.confidence === 'high' ? -1 : 1) - (b.confidence === 'high' ? -1 : 1))
    crops.bylines = ranked.slice(0, BYLINE_CROP_LIMIT).map((byline, index) =>
      cropRegion(sourcePath, byline.page, byline.box, path.join(outDir, `crops/byline-${index + 1}.jpg`)),
    )
  }

  const report = {
    slug,
    source: displayPath(sourcePath),
    sourceBytes: fs.statSync(sourcePath).size,
    pages,
    ocr: { lang, psm, dpi: RENDER_DPI, engine: run('tesseract', ['--version']).split('\n')[0].trim() },
    cropsAvailable: isPdf,
    headlineCandidates: headlines,
    dateCandidates: dates,
    bylineHits: bylines,
    crops,
    lineCount: lines.length,
    generatedAt: new Date().toISOString(),
  }
  writeFileAtomic(reportPath, `${JSON.stringify(report, null, 2)}\n`)
  return report
}

if (!fs.existsSync(sourceDir)) {
  console.error(
    `Source directory not found: ${displayPath(sourceDir)}\n` +
      'Drop the scans there (tmp/ is gitignored), or pass a directory: ' +
      'node scripts/ocr-scan-inbox.mjs path/to/scans',
  )
  process.exitCode = 1
} else {
  const sources = collectSources(sourceDir)
  if (sources.length === 0) {
    console.error(`No PDF or image scans found under ${displayPath(sourceDir)}`)
    process.exitCode = 1
  } else {
    const reports = []
    for (const source of sources) {
      try {
        reports.push(processScan(source))
      } catch (error) {
        console.error(`✗ ${path.relative(sourceDir, source)}: ${error.message}`)
        process.exitCode = 1
      }
    }

    writeFileAtomic(
      path.join(OUT_ROOT, 'index.json'),
      `${JSON.stringify(reports.map(({ skipped: _skipped, ...report }) => report), null, 2)}\n`,
    )

    for (const report of reports) {
      const date =
        report.dateCandidates.find((candidate) => candidate.confidence === 'high') ??
        report.dateCandidates[0]
      const named = report.bylineHits.filter((hit) => hit.kind === 'fullName').length
      const initials = report.bylineHits.filter((hit) => hit.kind === 'initials').length
      const headlines = report.headlineCandidates.slice(0, HEADLINE_CROP_LIMIT)

      console.log(
        [
          `${report.skipped ? '·' : '✓'} ${report.slug}`,
          `  pages=${report.pages} lines=${report.lineCount}`,
          `  date?     ${date ? `${date.value} [${date.confidence}]` : '—'}`,
          `  byline?   ${named} full-name, ${initials} initials`,
          headlines.length > 0 ? '  headline candidates (largest type first):' : '  headline? —',
          ...headlines.map(
            (headline, index) => `    ${index + 1}. ${headline.sizeVsBody}× body — "${headline.text}"`,
          ),
        ].join('\n'),
      )
    }

    const skipped = reports.filter((report) => report.skipped).length
    console.log(
      `\n${reports.length} scan(s) in ${path.relative(ROOT, OUT_ROOT)}/` +
        (skipped > 0 ? ` (${skipped} already done — pass --force to redo)` : '') +
        '\nEvery field above is an OCR lead. Confirm authorship against the page before adding anything.',
    )
  }
}
