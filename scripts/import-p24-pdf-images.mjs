import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { readArchiveEntries, slugify } from './archive-utils.mjs'

const pdfDir = process.argv[2]
const python = process.argv[3] ?? 'python3'

if (!pdfDir) {
  console.error('Usage: node scripts/import-p24-pdf-images.mjs <pdf-dir> [python]')
  process.exit(1)
}

const p24Path = 'src/archive/tr/columns/p24.ts'
const publicRoot = 'public'
const entries = readArchiveEntries().filter((entry) => entry.outlet === 'P24')
const bySlug = new Map(entries.map((entry) => [entry.slug, entry]))
const pdfFiles = fs
  .readdirSync(pdfDir)
  .filter((file) => file.toLowerCase().endsWith('.pdf'))
  .sort()

function slugFromPdfName(file) {
  const stem = path.basename(file, '.pdf')
  const withoutDate = stem.replace(/_\d{8}$/, '')
  return slugify(withoutDate.replace(/_/g, ' '))
}

const mappings = pdfFiles
  .map((file) => {
    const slug = slugFromPdfName(file)
    return {
      file,
      sourcePdf: path.join(pdfDir, file),
      slug,
      entry: bySlug.get(slug),
    }
  })
  .filter((mapping) => mapping.entry)

const tempInput = path.join('tmp', 'p24-pdf-image-input.json')
const tempOutput = path.join('tmp', 'p24-pdf-image-output.json')
fs.mkdirSync('tmp', { recursive: true })
fs.writeFileSync(
  tempInput,
  JSON.stringify(
    mappings.map((mapping) => ({
      slug: mapping.slug,
      title: mapping.entry.title,
      year: mapping.entry.date?.match(/\d{4}/)?.[0] ?? 'unknown',
      sourcePdf: mapping.sourcePdf,
      outDir: path.join(publicRoot, 'archive', 'clippings', 'p24', mapping.entry.date?.match(/\d{4}/)?.[0] ?? 'unknown', mapping.slug),
    })),
    null,
    2,
  ),
)

const extractor = `
import json
import os
import sys

try:
    import fitz
except Exception as exc:
    print(f"PyMuPDF unavailable: {exc}", file=sys.stderr)
    sys.exit(2)

with open(sys.argv[1], "r", encoding="utf-8") as handle:
    jobs = json.load(handle)

results = []
for job in jobs:
    os.makedirs(job["outDir"], exist_ok=True)
    document = fitz.open(job["sourcePdf"])
    candidates = []
    for page_index in range(len(document)):
        page = document[page_index]
        for image_index, image in enumerate(page.get_images(full=True)):
            xref = image[0]
            info = document.extract_image(xref)
            width = info.get("width", 0)
            height = info.get("height", 0)
            ext = info.get("ext", "png")
            if width < 240 or height < 160:
                continue
            candidates.append({
                "bytes": info["image"],
                "width": width,
                "height": height,
                "ext": ext,
                "page": page_index + 1,
                "area": width * height,
            })
    candidates.sort(key=lambda item: item["area"], reverse=True)
    exported = []
    for index, candidate in enumerate(candidates[:2], start=1):
        ext = "jpg" if candidate["ext"] == "jpeg" else candidate["ext"]
        filename = f"image-{index}.{ext}"
        out_path = os.path.join(job["outDir"], filename)
        with open(out_path, "wb") as image_file:
            image_file.write(candidate["bytes"])
        exported.append({
            "src": "/" + os.path.relpath(out_path, "public").replace(os.sep, "/"),
            "pageLabel": f"PDF page {candidate['page']}",
            "sourceNote": "P24 PDF",
            "width": candidate["width"],
            "height": candidate["height"],
        })
    results.append({"slug": job["slug"], "title": job["title"], "clippings": exported})

with open(sys.argv[2], "w", encoding="utf-8") as handle:
    json.dump(results, handle, ensure_ascii=False, indent=2)
`

const result = spawnSync(python, ['-c', extractor, tempInput, tempOutput], {
  encoding: 'utf8',
  stdio: 'pipe',
})

if (result.status !== 0) {
  console.error(result.stderr || result.stdout)
  process.exit(result.status ?? 1)
}

const extraction = JSON.parse(fs.readFileSync(tempOutput, 'utf8'))
const byExtractedSlug = new Map(extraction.map((item) => [item.slug, item]))

let p24Source = fs.readFileSync(p24Path, 'utf8')
let inserted = 0

for (const entry of entries) {
  const extracted = byExtractedSlug.get(entry.slug)
  if (!extracted?.clippings?.length) continue
  if (p24Source.includes(`src: '${extracted.clippings[0].src}'`)) continue

  const titleNeedle = `title: '${entry.title.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}',`
  const titleIndex = p24Source.indexOf(titleNeedle)
  if (titleIndex < 0) continue
  const urlIndex = p24Source.indexOf('url:', titleIndex)
  const lineEnd = p24Source.indexOf('\n', urlIndex)
  const clippingLines = [
    '              clippings: [',
    ...extracted.clippings.map(
      (clipping, index) =>
        `                { src: '${clipping.src}', alt: '${entry.title.replace(/'/g, "\\'")}', pageLabel: '${clipping.pageLabel}', sourceNote: '${clipping.sourceNote}${index > 0 ? ` ${index + 1}` : ''}' },`,
    ),
    '              ],',
  ].join('\n')
  p24Source = `${p24Source.slice(0, lineEnd + 1)}${clippingLines}\n${p24Source.slice(lineEnd + 1)}`
  inserted += 1
}

fs.writeFileSync(p24Path, p24Source)

const matched = mappings.length
const exported = extraction.filter((item) => item.clippings.length > 0).length
const unmatched = pdfFiles.length - matched
console.log(
  JSON.stringify(
    {
      pdfs: pdfFiles.length,
      matched,
      unmatched,
      exported,
      inserted,
    },
    null,
    2,
  ),
)
