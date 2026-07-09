import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { readArchiveEntries, slugify } from './archive-utils.mjs'

const pdfDir = process.argv[2]
const python = process.argv[3] ?? 'python3'
const pdftoppm = process.argv[4] ?? 'pdftoppm'

if (!pdfDir) {
  console.error('Usage: node scripts/import-p24-pdf-images.mjs <pdf-dir> [python] [pdftoppm]')
  process.exit(1)
}

const p24Path = 'src/archive/tr/columns/p24.ts'
const tempDir = path.join('tmp', 'p24-pdf-images')
const entries = readArchiveEntries().filter((entry) => entry.outlet === 'P24')
const bySlug = new Map(entries.map((entry) => [entry.slug, entry]))
const pdfFiles = fs
  .readdirSync(pdfDir)
  .filter((file) => file.toLowerCase().endsWith('.pdf'))
  .sort()

function slugFromPdfName(file) {
  const stem = path.basename(file, '.pdf')
  return slugify(stem.replace(/_\d{8}$/, '').replace(/_/g, ' '))
}

function yearOf(entry) {
  return entry.date?.match(/\d{4}/)?.[0] ?? 'unknown'
}

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

function cropHeroImage(inputPng, outputPng) {
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

  const result = spawnSync(python, ['-c', cropper, inputPng, outputPng], {
    encoding: 'utf8',
    stdio: 'pipe',
  })

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `crop failed for ${inputPng}`)
  }
}

fs.mkdirSync(tempDir, { recursive: true })

const exportsBySlug = new Map()
let matched = 0
let exported = 0

for (const file of pdfFiles) {
  const slug = slugFromPdfName(file)
  const entry = bySlug.get(slug)
  if (!entry) continue

  matched += 1
  const year = yearOf(entry)
  const sourcePdf = path.join(pdfDir, file)
  const outDir = path.join('public', 'archive', 'clippings', 'p24', year, slug)
  const renderPrefix = path.join(tempDir, slug)
  const rendered = `${renderPrefix}.png`
  const outputDiskPath = path.join(outDir, 'image-1.png')

  fs.mkdirSync(outDir, { recursive: true })
  renderFirstPage(sourcePdf, renderPrefix)
  cropHeroImage(rendered, outputDiskPath)

  const publicPath = `/${path.relative('public', outputDiskPath).replaceAll(path.sep, '/')}`
  exportsBySlug.set(slug, {
    src: publicPath,
    alt: entry.title,
    pageLabel: 'Article image',
    sourceNote: 'P24 PDF',
  })
  exported += 1
}

let p24Source = fs.readFileSync(p24Path, 'utf8')
let inserted = 0

for (const entry of entries) {
  const clipping = exportsBySlug.get(entry.slug)
  if (!clipping) continue
  if (p24Source.includes(`src: '${clipping.src}'`)) continue

  const escapedTitle = entry.title.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  const titleNeedle = `title: '${escapedTitle}',`
  const titleIndex = p24Source.indexOf(titleNeedle)
  if (titleIndex < 0) continue
  const urlIndex = p24Source.indexOf('url:', titleIndex)
  const lineEnd = p24Source.indexOf('\n', urlIndex)
  const clippingBlock = [
    '              clippings: [',
    `                { src: '${clipping.src}', alt: '${escapedTitle}', pageLabel: '${clipping.pageLabel}', sourceNote: '${clipping.sourceNote}' },`,
    '              ],',
  ].join('\n')

  p24Source = `${p24Source.slice(0, lineEnd + 1)}${clippingBlock}\n${p24Source.slice(lineEnd + 1)}`
  inserted += 1
}

fs.writeFileSync(p24Path, p24Source)

console.log(
  JSON.stringify(
    {
      pdfs: pdfFiles.length,
      matched,
      unmatched: pdfFiles.length - matched,
      exported,
      inserted,
    },
    null,
    2,
  ),
)
