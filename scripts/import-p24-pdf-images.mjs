import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { readArchiveEntries, slugify } from './archive-utils.mjs'
import { ensureInside, writeFileAtomic } from './lib/fs-guard.mjs'

/* Renders the lead photo out of each P24 article PDF and wires it into
   src/archive/tr/columns/p24.ts as a 'photo' clipping.

   Everything is matched and located before a single pixel is rendered: a PDF
   that matches no archive entry, or an entry whose record cannot be found in
   p24.ts, is a loud failure, not a line in a summary. Silence there is how
   the whole run once turned into a no-op — the locator looked for
   `title: '…'` while the data file had switched to double quotes. */

const ROOT = process.cwd()
const P24_PATH = path.join(ROOT, 'src/archive/tr/columns/p24.ts')
const CLIPPING_ROOT = path.join(ROOT, 'public/archive/clippings')
const TEMP_DIR = path.join(ROOT, 'tmp/p24-pdf-images')

const pdfDir = process.argv[2]
const python = process.argv[3] ?? 'python3'
const pdftoppm = process.argv[4] ?? 'pdftoppm'

if (!pdfDir) {
  console.error('Usage: node scripts/import-p24-pdf-images.mjs <pdf-dir> [python] [pdftoppm]')
  process.exit(1)
}

if (!fs.existsSync(pdfDir)) {
  console.error(`PDF directory not found: ${pdfDir}`)
  process.exit(1)
}

const entries = readArchiveEntries().filter((entry) => entry.outlet === 'P24')
const pdfFiles = fs
  .readdirSync(pdfDir)
  .filter((file) => file.toLowerCase().endsWith('.pdf'))
  .sort()

/* PDF filenames come from article titles while entry slugs come from source
   URLs, so the two can drift apart (apostrophes dropped, decomposed accents,
   or a URL slug worded differently from the title). Match in widening rings:
   exact slug, hyphen-insensitive slug, then the same two against a slug
   derived from the entry title. Ambiguous compact keys are discarded. */
function buildLookup(keyOf) {
  const map = new Map()
  for (const entry of entries) {
    const key = keyOf(entry)
    if (!key) continue
    map.set(key, map.has(key) ? null : entry)
  }
  return map
}

const bySlug = buildLookup((entry) => entry.slug)
const byCompactSlug = buildLookup((entry) => entry.slug.replaceAll('-', ''))
const byTitleSlug = buildLookup((entry) => slugify(entry.title))
const byCompactTitleSlug = buildLookup((entry) => slugify(entry.title).replaceAll('-', ''))

function entryForPdf(file) {
  const stem = path.basename(file, '.pdf').normalize('NFC')
  const slug = slugify(stem.replace(/_\d{8}$/, '').replace(/_/g, ' '))
  const compact = slug.replaceAll('-', '')
  return (
    bySlug.get(slug) ??
    byCompactSlug.get(compact) ??
    byTitleSlug.get(slug) ??
    byCompactTitleSlug.get(compact) ??
    null
  )
}

function yearOf(entry) {
  return entry.date?.match(/\d{4}/)?.[0] ?? 'unknown'
}

/* ---- locating a record in p24.ts, whatever quote style it uses ---- */

const STRING_LITERAL = String.raw`(['"])((?:\\.|(?!\1)[\s\S])*?)\1`

const ESCAPES = { n: '\n', t: '\t', r: '\r' }

function unescapeLiteral(raw) {
  return raw.replace(/\\(.)/g, (_, char) => ESCAPES[char] ?? char)
}

/** Every `<field>: '…'` / `<field>: "…"` literal in the file, with its span.
 *  Reading the literals out and unescaping them is what makes the match
 *  quote-agnostic: the same title matches whether the data file writes it in
 *  single quotes, double quotes, or with an escaped apostrophe inside. */
function stringLiteralsOf(source, field) {
  const pattern = new RegExp(String.raw`\b${field}:\s*${STRING_LITERAL}`, 'g')
  return [...source.matchAll(pattern)].map((match) => ({
    index: match.index,
    end: match.index + match[0].length,
    value: unescapeLiteral(match[2]),
  }))
}

/** Bounds of the seed object that contains `index`, found by walking back to
 *  its opening brace and bracket-matching forward. */
function recordBoundsAt(source, index) {
  let start = -1
  for (let cursor = index; cursor >= 0; cursor -= 1) {
    if (source[cursor] === '{') {
      start = cursor
      break
    }
    if (source[cursor] === '}') return null
  }
  if (start < 0) return null

  let depth = 0
  let quote = null
  let escaped = false
  for (let cursor = start; cursor < source.length; cursor += 1) {
    const char = source[cursor]
    if (quote) {
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === quote) quote = null
      continue
    }
    if (char === "'" || char === '"' || char === '`') {
      quote = char
      continue
    }
    if (char === '{') depth += 1
    else if (char === '}') {
      depth -= 1
      if (depth === 0) return { start, end: cursor }
    }
  }
  return null
}

/** Indentation of the record's own fields, so an inserted block lines up with
 *  the file it is going into rather than with whatever the script assumed. */
function fieldIndentOf(recordSource) {
  return recordSource.match(/\n([ \t]+)\S/)?.[1] ?? '    '
}

function quoteFor(value) {
  return value.includes("'")
    ? `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
    : `'${value.replace(/\\/g, '\\\\')}'`
}

/* ---- rendering ---- */

function renderFirstPage(sourcePdf, outputPrefix) {
  const result = spawnSync(
    pdftoppm,
    ['-png', '-f', '1', '-singlefile', sourcePdf, outputPrefix],
    { encoding: 'utf8', stdio: 'pipe' },
  )

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `pdftoppm failed for ${sourcePdf}`)
  }
}

function cropHeroImage(inputPng, outputPath) {
  const cropper = `
from PIL import Image
import sys

image = Image.open(sys.argv[1]).convert("RGB")
width, height = image.size
limit_y = int(height * 0.52)
pixels = image.load()

row_counts = []
for y in range(limit_y):
    count = 0
    for x in range(width):
        r, g, b = pixels[x, y]
        if not (r > 242 and g > 242 and b > 242):
            count += 1
    row_counts.append(count)

threshold = max(80, int(width * 0.18))
bands = []
start = None
for index, count in enumerate(row_counts):
    if count >= threshold and start is None:
        start = index
    if (count < threshold or index == len(row_counts) - 1) and start is not None:
        end = index if count < threshold else index + 1
        if end - start > 80:
            bands.append((start, end))
        start = None

if not bands:
    image.save(sys.argv[2])
    sys.exit(0)

y1, y2 = max(bands, key=lambda band: band[1] - band[0])
col_counts = []
for x in range(width):
    count = 0
    for y in range(y1, y2):
        r, g, b = pixels[x, y]
        if not (r > 242 and g > 242 and b > 242):
            count += 1
    col_counts.append(count)

col_threshold = max(40, int((y2 - y1) * 0.2))
xs = [x for x, count in enumerate(col_counts) if count >= col_threshold]
if xs:
    x1 = max(0, min(xs) - 8)
    x2 = min(width, max(xs) + 9)
else:
    x1 = 0
    x2 = width

y1 = max(0, y1 - 8)
y2 = min(height, y2 + 8)
image.crop((x1, y1, x2, y2)).save(sys.argv[2])
`

  const result = spawnSync(python, ['-c', cropper, inputPng, outputPath], {
    encoding: 'utf8',
    stdio: 'pipe',
  })

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `crop failed for ${inputPng}`)
  }
}

function fail(heading, lines) {
  console.error(`${heading}\n${lines.map((line) => `  - ${line}`).join('\n')}`)
  process.exit(1)
}

/* ---- 1. match every PDF to an entry, or stop ---- */

const matches = []
const unmatchedFiles = []

for (const file of pdfFiles) {
  const entry = entryForPdf(file)
  if (entry) matches.push({ file, entry })
  else unmatchedFiles.push(file)
}

if (pdfFiles.length === 0) {
  console.error(`No PDFs found in ${pdfDir}`)
  process.exit(1)
}

if (unmatchedFiles.length > 0) {
  fail(
    `${unmatchedFiles.length} of ${pdfFiles.length} PDF(s) matched no P24 archive entry — ` +
      'nothing was written. Fix the filename or add the entry, then re-run:',
    unmatchedFiles,
  )
}

/* ---- 2. locate every record in p24.ts, or stop ---- */

let p24Source = fs.readFileSync(P24_PATH, 'utf8')
const titleLiterals = stringLiteralsOf(p24Source, 'title')

const unlocatable = []
for (const match of matches) {
  const hits = titleLiterals.filter((literal) => literal.value === match.entry.title)
  if (hits.length === 1) {
    match.titleLiteral = hits[0]
    continue
  }
  unlocatable.push(
    `${match.file}: ${hits.length === 0 ? 'no' : `${hits.length} ambiguous`} ` +
      `title: "${match.entry.title}" in src/archive/tr/columns/p24.ts`,
  )
}

if (unlocatable.length > 0) {
  fail(
    `${unlocatable.length} matched PDF(s) could not be placed in p24.ts — nothing was written:`,
    unlocatable,
  )
}

/* ---- 3. render, then insert ---- */

fs.mkdirSync(TEMP_DIR, { recursive: true })

let exported = 0
let inserted = 0
let alreadyPresent = 0
const failures = []

// Later insertions shift earlier offsets, so edit from the end of the file
// backwards and every remaining index stays valid.
matches.sort((a, b) => b.titleLiteral.index - a.titleLiteral.index)

for (const { file, entry, titleLiteral } of matches) {
  try {
    const year = yearOf(entry)
    const sourcePdf = path.join(pdfDir, file)
    // entry.slug comes from the archive data, not from a remote source, but it
    // still lands in a path — keep the output inside public/archive/clippings.
    const outDir = ensureInside(
      CLIPPING_ROOT,
      path.join('p24', year, entry.slug),
      `clipping directory for "${entry.slug}"`,
    )
    const renderPrefix = ensureInside(TEMP_DIR, entry.slug, `render path for "${entry.slug}"`)
    const rendered = `${renderPrefix}.png`
    // webp, like every other clipping asset in public/archive/clippings: PIL
    // picks the encoder from the extension, so the crop above needs no change.
    const outputDiskPath = path.join(outDir, 'image-1.webp')
    const publicPath = `/${path.relative(path.join(ROOT, 'public'), outputDiskPath).replaceAll(path.sep, '/')}`

    const bounds = recordBoundsAt(p24Source, titleLiteral.index)
    if (!bounds) throw new Error('could not find the seed object around its title')
    const recordSource = p24Source.slice(bounds.start, bounds.end + 1)

    const alreadyLinked = new RegExp(
      String.raw`\bsrc:\s*['"]${publicPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`,
    ).test(recordSource)

    fs.mkdirSync(outDir, { recursive: true })
    renderFirstPage(sourcePdf, renderPrefix)
    cropHeroImage(rendered, outputDiskPath)
    exported += 1

    if (alreadyLinked) {
      alreadyPresent += 1
      continue
    }

    const indent = fieldIndentOf(recordSource)
    const block = [
      `${indent}clippings: [`,
      `${indent}  { src: ${quoteFor(publicPath)}, alt: ${quoteFor(entry.title)}, kind: 'photo' },`,
      `${indent}],`,
      '',
    ].join('\n')

    // Insert as the record's last field, matching how the existing entries in
    // p24.ts are laid out.
    const closingLineStart = p24Source.lastIndexOf('\n', bounds.end) + 1
    p24Source = `${p24Source.slice(0, closingLineStart)}${block}${p24Source.slice(closingLineStart)}`
    inserted += 1
  } catch (error) {
    failures.push(`${file}: ${error.message}`)
  }
}

if (failures.length > 0) {
  fail(`${failures.length} PDF(s) failed while rendering — p24.ts was left untouched:`, failures)
}

writeFileAtomic(P24_PATH, p24Source)

console.log(
  JSON.stringify(
    { pdfs: pdfFiles.length, matched: matches.length, exported, inserted, alreadyPresent },
    null,
    2,
  ),
)
