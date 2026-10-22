/** Turns a folder of numbered page photos (`<anything>_p1.jpg`, `_p2.jpg`, …)
 *  into the web-sized page scans an article's reader page shows in order, and
 *  prints the `clippings` array to paste into the record.
 *
 *    node scripts/import-article-scans.mjs <sourceDir> <destDir> <label>
 *
 *  <destDir> is relative to public/archive/clippings, e.g. academic/1987/<slug>;
 *  <label> is the page-label prefix, normally "Sayfa". Pages are written as
 *  page-N.webp (1600 px wide, so type stays legible in the lightbox) in the
 *  order of the `_pN` numbers, not of the file names — "_p10" sorts before
 *  "_p2" alphabetically. Needs `cwebp` (brew install webp).
 *
 *  The photographs come off the scanner with some pages upside down (the
 *  pixels themselves, no EXIF flag), so each page's orientation is read with
 *  Tesseract's OSD (`tesseract --psm 0`) and corrected before conversion.
 *  Pages OSD cannot read are reported, never guessed at: check them by eye.
 *
 *  Never writes into the source folder. */
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const [sourceDir, destRel, label = 'Sayfa'] = process.argv.slice(2)
if (!sourceDir || !destRel) {
  console.error('usage: node scripts/import-article-scans.mjs <sourceDir> <destDir> [label]')
  process.exit(1)
}

const pageOf = (name) => Number(/_p(\d+)\.jpe?g$/i.exec(name)?.[1])
const files = fs
  .readdirSync(sourceDir)
  .filter((name) => Number.isFinite(pageOf(name)))
  .sort((a, b) => pageOf(a) - pageOf(b))

if (!files.length) {
  console.error(`no *_pN.jpg pages in ${sourceDir}`)
  process.exit(1)
}
files.forEach((name, index) => {
  if (pageOf(name) !== index + 1) {
    console.error(`${sourceDir}: expected page ${index + 1}, found ${name}`)
    process.exit(1)
  }
})

/** Degrees clockwise needed to make the page upright, or null if unreadable. */
function detectRotation(file) {
  const result = spawnSync('tesseract', [file, '-', '--psm', '0', '-l', 'osd'], { encoding: 'utf8' })
  const match = /Rotate:\s*(\d+)/.exec(`${result.stdout}${result.stderr}`)
  return match ? Number(match[1]) : null
}

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'article-scans-'))
const dest = path.join('public/archive/clippings', destRel)
fs.mkdirSync(dest, { recursive: true })
for (const name of files) {
  const out = path.join(dest, `page-${pageOf(name)}.webp`)
  let input = path.join(sourceDir, name)
  const rotation = detectRotation(input)
  if (rotation === null) {
    console.error(`  page ${pageOf(name)}: orientation unreadable, left as photographed`)
  } else if (rotation !== 0) {
    const rotated = path.join(workDir, `rotated-${pageOf(name)}.jpg`)
    execFileSync('sips', ['-r', String(rotation), input, '--out', rotated], { stdio: 'ignore' })
    input = rotated
    console.error(`  page ${pageOf(name)}: rotated ${rotation}°`)
  }
  execFileSync('cwebp', ['-quiet', '-q', '80', '-resize', '1600', '0', input, '-o', out])
}
fs.rmSync(workDir, { recursive: true, force: true })

const lines = files.map(
  (name) =>
    `      { src: '/archive/clippings/${destRel}/page-${pageOf(name)}.webp', pageLabel: '${label} ${pageOf(name)}' },`,
)
console.log(`    clippings: [\n${lines.join('\n')}\n    ],`)
console.error(`${files.length} pages -> ${dest}`)
