#!/usr/bin/env node
/**
 * Locate the pull-quote — the "spot" — in a clipping scan.
 *
 * A spot is set heavier and usually larger than the body, in its own column.
 * Neither signal alone is enough: on the Zaman pages the spot's OCR line
 * height came out one pixel above body text, because tesseract merges
 * neighbouring columns into single lines. Ink density separates them —
 * bold strokes fill more of their box than roman ones at the same size.
 *
 * Emits, per clipping: an upscaled crop of each candidate band and the OCR
 * of that crop alone. The crop is what gets read; the OCR is a lead.
 *
 * A spot is the paper's own display quote, lifted from the article and set
 * apart. It is the author's words, so it belongs in `excerpt`; a sentence
 * written *about* the piece does not, and 542 of those were removed on
 * 2026-09-09. Not every paper uses spots, and not every issue of one that
 * does: Zaman started around 2009, Sabah sets them in a ruled box, Milliyet
 * uses bold for emphasis inside paragraphs and has none at all. So this
 * script proposes; it never writes to the archive.
 *
 * **Read the crop, not the OCR.** On a multi-column page tesseract happily
 * splices a neighbouring column into the middle of a sentence, which is how
 * a transcription ends up containing words the author never wrote there.
 * The crop it emits is small and sharp enough to read directly.
 *
 *   npm run find:spots -- <slug> <clipping.webp>
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const [slug, clipping] = process.argv.slice(2)
if (!slug || !clipping) {
  console.error('usage: find-spots.mjs <slug> <clipping.webp>')
  process.exit(1)
}

const outDir = path.join('tmp/spot-ocr', slug)
fs.mkdirSync(outDir, { recursive: true })
const png = path.join(outDir, 'page.png')
execFileSync('dwebp', [clipping, '-o', png], { stdio: 'pipe' })

const tsv = execFileSync(
  'tesseract',
  [png, 'stdout', '-l', 'tur', '--psm', '3', 'tsv'],
  { encoding: 'utf8', maxBuffer: 32e6, stdio: ['ignore', 'pipe', 'ignore'] },
)

/* Words, with their boxes. Confidence below 30 is usually rule lines and
   scanner noise picked up as punctuation; it drags the density stats. */
const words = []
for (const row of tsv.split('\n').slice(1)) {
  const c = row.split('\t')
  if (c.length < 12) continue
  const [, , , , , , left, top, width, height, conf, ...rest] = c
  const text = rest.join('\t').trim()
  if (!text || Number(conf) < 30) continue
  const w = Number(width)
  const h = Number(height)
  if (w < 4 || h < 6) continue
  words.push({ left: Number(left), top: Number(top), width: w, height: h, text })
}

/* Ink density per word, measured on the page itself rather than inferred
   from the font — the scans have no font metadata to inspect. */
const py = `
from PIL import Image
import json, sys
im = Image.open(${JSON.stringify(png)}).convert('L')
boxes = json.load(sys.stdin)
out = []
for b in boxes:
    c = im.crop((b['left'], b['top'], b['left']+b['width'], b['top']+b['height']))
    h = c.point(lambda p: 255 if p < 128 else 0).histogram()
    dark = h[255]
    total = c.width * c.height
    out.append(dark / total if total else 0.0)
print(json.dumps(out))
`
const densities = JSON.parse(
  execFileSync('python3', ['-c', py], {
    input: JSON.stringify(words),
    encoding: 'utf8',
    maxBuffer: 32e6,
  }),
)
words.forEach((w, i) => {
  w.density = densities[i]
})

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b)
  return s.length ? s[Math.floor(s.length / 2)] : 0
}
const bodyDensity = median(words.map((w) => w.density))
const bodyHeight = median(words.map((w) => w.height))

/* A spot word is meaningfully darker than the body, and no smaller. The
   headline is darker still but sits alone at the top in much larger type,
   so it is excluded by height rather than by density. */
const heavy = words.filter(
  (w) =>
    w.density > bodyDensity * 1.25 &&
    w.height >= bodyHeight * 0.9 &&
    w.height <= bodyHeight * 2.2,
)

/* Group heavy words into bands: same rough column, consecutive lines. */
const bands = []
for (const w of heavy.sort((a, b) => a.top - b.top || a.left - b.left)) {
  const band = bands.find(
    (b) =>
      w.top - b.bottom < bodyHeight * 2.5 &&
      w.left < b.right + bodyHeight * 6 &&
      w.left + w.width > b.left - bodyHeight * 6,
  )
  if (band) {
    band.left = Math.min(band.left, w.left)
    band.right = Math.max(band.right, w.left + w.width)
    band.top = Math.min(band.top, w.top)
    band.bottom = Math.max(band.bottom, w.top + w.height)
    band.words.push(w)
  } else {
    bands.push({
      left: w.left,
      right: w.left + w.width,
      top: w.top,
      bottom: w.top + w.height,
      words: [w],
    })
  }
}

/* A spot runs to several lines. One or two heavy words is a bolded name in
   running text, which is not a spot. */
const candidates = bands
  .filter((b) => b.words.length >= 6 && b.bottom - b.top > bodyHeight * 2.5)
  .sort((a, b) => b.words.length - a.words.length)
  .slice(0, 3)

const report = { slug, clipping, bodyDensity, bodyHeight, candidates: [] }

candidates.forEach((band, i) => {
  const pad = Math.round(bodyHeight * 0.8)
  const cropPath = path.join(outDir, `spot-${i + 1}.png`)
  const cropPy = `
from PIL import Image
im = Image.open(${JSON.stringify(png)})
c = im.crop((${Math.max(0, band.left - pad)}, ${Math.max(0, band.top - pad)}, ${band.right + pad}, ${band.bottom + pad}))
c = c.resize((int(c.width*2.4), int(c.height*2.4)), Image.LANCZOS)
c.save(${JSON.stringify(cropPath)})
`
  execFileSync('python3', ['-c', cropPy], { stdio: 'pipe' })
  const ocr = execFileSync(
    'tesseract',
    [cropPath, 'stdout', '-l', 'tur', '--psm', '6'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
  ).trim()
  report.candidates.push({
    crop: cropPath,
    box: { left: band.left, top: band.top, right: band.right, bottom: band.bottom },
    words: band.words.length,
    ocr,
  })
})

fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2))
console.log(`${slug}: ${candidates.length} candidate band(s)`)
for (const c of report.candidates) {
  console.log(`  ${c.crop} (${c.words} words)`)
  console.log(`    ${c.ocr.replace(/\n/g, ' / ').slice(0, 160)}`)
}
