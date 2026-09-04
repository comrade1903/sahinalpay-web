import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const ROOT = process.cwd()
const SOURCE_DIR = path.join(ROOT, 'tmp/tustav-pdfs')
const MANIFEST_PATH = path.join(ROOT, 'scripts/tustav-pdf-extracts.json')
const PDF_OUT_ROOT = path.join(ROOT, 'public/archive/pdf')
const CLIPPING_OUT_ROOT = path.join(ROOT, 'public/archive/clippings')
const COVER_WIDTH = 1600
const COVER_QUALITY = 82

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8' })
  if (result.error) {
    if (result.error.code === 'ENOENT') {
      throw new Error(`${command} not found. Install poppler: brew install poppler`)
    }
    throw result.error
  }
  if (result.status !== 0) {
    throw new Error(`${command} exited ${result.status}: ${result.stderr.trim()}`)
  }
  return result.stdout
}

function pdfInfo(pdfPath) {
  const stdout = run('pdfinfo', [pdfPath])
  const pages = stdout.match(/^Pages:\s+(\d+)$/m)
  if (!pages) throw new Error(`Could not read page count from ${pdfPath}`)
  return {
    pages: Number(pages[1]),
    // İşçi-Köylü and Forum volumes carry permissions-only AES encryption.
    // pdftoppm and pdfseparate cope with it; pdfunite refuses to merge.
    encrypted: /^Encrypted:\s+yes/m.test(stdout),
  }
}

function pageCount(pdfPath) {
  return pdfInfo(pdfPath).pages
}

/** pdfseparate names files by absolute page number, unpadded: p-57.pdf … p-74.pdf.
    Sort numerically — lexicographic order would give p-1, p-10, p-2. */
function orderedPagePdfs(dir) {
  return fs
    .readdirSync(dir)
    .filter((name) => /^p-\d+\.pdf$/.test(name))
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]))
    .map((name) => path.join(dir, name))
}

/** pdftoppm zero-pads the page suffix to the digit width of the source's total
    page count, so the exact filename is not predictable. Glob it instead. */
function soleFile(dir, extension) {
  const files = fs.readdirSync(dir).filter((name) => name.endsWith(extension))
  if (files.length !== 1) {
    throw new Error(`Expected exactly one ${extension} in ${dir}, found ${files.length}`)
  }
  return path.join(dir, files[0])
}

function extract(entry) {
  const sourcePath = path.join(SOURCE_DIR, entry.source)
  if (!fs.existsSync(sourcePath)) {
    throw new Error(
      `Missing source volume for "${entry.slug}": ${sourcePath}\n` +
        'TÜSTAV volumes are not in the repo. Place them under tmp/tustav-pdfs/.',
    )
  }

  const { pages: total, encrypted } = pdfInfo(sourcePath)
  if (entry.firstPage < 1 || entry.lastPage > total || entry.firstPage > entry.lastPage) {
    throw new Error(
      `"${entry.slug}": page range ${entry.firstPage}-${entry.lastPage} is outside ${entry.source} (${total} pages)`,
    )
  }
  const wholeFile = entry.firstPage === 1 && entry.lastPage === total
  if (encrypted && !wholeFile) {
    throw new Error(
      `"${entry.slug}": ${entry.source} is encrypted and only pages ` +
        `${entry.firstPage}-${entry.lastPage} of ${total} are wanted. pdfunite cannot ` +
        'merge encrypted pages. Install qpdf (brew install qpdf) and pre-decrypt the ' +
        'volume with: qpdf --decrypt in.pdf out.pdf',
    )
  }
  const coverPage = entry.coverPage ?? entry.firstPage
  if (coverPage < entry.firstPage || coverPage > entry.lastPage) {
    throw new Error(
      `"${entry.slug}": coverPage ${coverPage} is outside its own range ${entry.firstPage}-${entry.lastPage}`,
    )
  }

  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tustav-'))
  try {
    const pdfOut = path.join(PDF_OUT_ROOT, entry.pdfOut)
    fs.mkdirSync(path.dirname(pdfOut), { recursive: true })
    if (wholeFile) {
      // The article spans the entire source (İşçi-Köylü issues are 2-page
      // papers). Copying sidesteps pdfunite's encrypted-input limitation.
      fs.copyFileSync(sourcePath, pdfOut)
    } else {
      run('pdfseparate', [
        '-f', String(entry.firstPage),
        '-l', String(entry.lastPage),
        sourcePath,
        path.join(workDir, 'p-%d.pdf'),
      ])
      run('pdfunite', [...orderedPagePdfs(workDir), pdfOut])
    }

    const coverOut = path.join(CLIPPING_OUT_ROOT, entry.coverOut)
    fs.mkdirSync(path.dirname(coverOut), { recursive: true })
    const coverDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tustav-cover-'))
    try {
      // İşçi-Köylü pages are landscape two-page spreads; cropping to the half
      // that carries the article keeps the cover both on-topic and under budget.
      const crop = entry.coverCrop
      run('pdftoppm', [
        '-jpeg',
        '-jpegopt', `quality=${entry.coverQuality ?? COVER_QUALITY}`,
        '-f', String(coverPage),
        '-l', String(coverPage),
        '-scale-to-x', String(entry.coverRenderWidth ?? COVER_WIDTH),
        '-scale-to-y', '-1',
        ...(crop
          ? [
              // pdftoppm clamps the crop box to the rendered page, so a height
              // larger than the page simply means "down to the bottom edge".
              '-x', String(crop.x),
              '-y', String(crop.y),
              '-W', String(crop.width),
              '-H', String(crop.height),
            ]
          : []),
        sourcePath,
        path.join(coverDir, 'cover'),
      ])
      // The rendered page goes out as webp like every other clipping asset,
      // roughly a third of the JPEG's bytes at the same reading quality.
      run('cwebp', [
        '-quiet',
        '-q', String(entry.coverQuality ?? COVER_QUALITY),
        soleFile(coverDir, '.jpg'),
        '-o', coverOut,
      ])
    } finally {
      fs.rmSync(coverDir, { recursive: true, force: true })
    }

    return {
      slug: entry.slug,
      pdfPages: pageCount(pdfOut),
      pdfBytes: fs.statSync(pdfOut).size,
      coverBytes: fs.statSync(coverOut).size,
    }
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true })
  }
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
const results = manifest.map(extract)

for (const result of results) {
  console.log(
    `${result.slug}: pdfPageCount=${result.pdfPages} ` +
      `pdf=${(result.pdfBytes / 1024 / 1024).toFixed(1)}MB ` +
      `cover=${Math.round(result.coverBytes / 1024)}KB`,
  )
}
console.log(`Extracted ${results.length} TÜSTAV articles.`)
