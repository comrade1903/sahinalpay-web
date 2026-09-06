import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

import { ensureInside, PathGuardError } from './lib/fs-guard.mjs'

/* Slices one article out of a TÜSTAV volume: an article-scoped PDF under
   public/archive/pdf plus a webp cover under public/archive/clippings, both
   named by scripts/tustav-pdf-extracts.json.

   Every path in that manifest is checked against the root it belongs to
   before anything is written — the manifest is hand-edited, and a stray "../"
   in pdfOut/coverOut would otherwise write straight into the source tree. */

const ROOT = process.cwd()
const SOURCE_DIR = path.join(ROOT, 'tmp/tustav-pdfs')
const MANIFEST_PATH = path.join(ROOT, 'scripts/tustav-pdf-extracts.json')
const COVER_WIDTH = 1600
const COVER_QUALITY = 82

const args = process.argv.slice(2)
const force = args.includes('--force')

/* --out-root sends the output somewhere other than public/, which is how
   scripts/recover-tustav-pdfs.mjs verifies a recovered volume without ever
   writing into the published archive. */
let outRoot = path.join(ROOT, 'public/archive')
for (const arg of args) {
  if (arg === '--force') continue
  if (arg.startsWith('--out-root=')) {
    const value = arg.slice('--out-root='.length)
    if (!value) {
      console.error('--out-root needs a directory')
      process.exit(1)
    }
    outRoot = path.resolve(ROOT, value)
    continue
  }
  console.error(`Unknown flag ${arg}. Usage: extract-tustav-pdf.mjs [--force] [--out-root=DIR]`)
  process.exit(1)
}

const PDF_OUT_ROOT = path.join(outRoot, 'pdf')
const CLIPPING_OUT_ROOT = path.join(outRoot, 'clippings')

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

/** Reads a webp's pixel dimensions from its VP8/VP8L/VP8X header. */
function webpSize(file) {
  const buffer = fs.readFileSync(file)
  if (buffer.length < 30 || buffer.toString('ascii', 0, 4) !== 'RIFF') return null
  const format = buffer.toString('ascii', 12, 16)
  if (format === 'VP8X') {
    return {
      width: (buffer.readUIntLE(24, 3) & 0xffffff) + 1,
      height: (buffer.readUIntLE(27, 3) & 0xffffff) + 1,
    }
  }
  if (format === 'VP8 ') {
    return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff }
  }
  if (format === 'VP8L') {
    const bits = buffer.readUInt32LE(21)
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
  }
  return null
}

function assertCoverReplaceable(existingPath, pendingPath, slug) {
  if (force || !fs.existsSync(existingPath)) return
  const existing = webpSize(existingPath)
  const pending = webpSize(pendingPath)
  if (!existing || !pending) return
  if (existing.width === pending.width && existing.height === pending.height) return
  fs.rmSync(pendingPath, { force: true })
  throw new Error(
    `"${slug}": the published cover is ${existing.width}x${existing.height}, but this run ` +
      `renders ${pending.width}x${pending.height}. That cover was not produced by this tool — ` +
      'overwriting it would replace a prepared image with a different one. Set "coverOut": null ' +
      'on the manifest entry if the cover is maintained separately, or pass --force if you ' +
      'really mean to replace it.',
  )
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

const REQUIRED_STRING_FIELDS = ['slug', 'source', 'pdfOut']
const REQUIRED_PAGE_FIELDS = ['firstPage', 'lastPage']

/** The manifest is hand-written, so a missing or misspelt field should stop
 *  the run with the entry named rather than surface later as an undefined
 *  path or a NaN page number. */
function validateEntry(entry, index) {
  const where = `tustav-pdf-extracts.json[${index}]`
  if (!entry || typeof entry !== 'object') throw new Error(`${where}: not an object`)
  /* coverOut is required to be either a path or an explicit null — null means
     the published cover is maintained outside this tool, and omitting the
     field entirely would look like an oversight rather than a decision. */
  if (!('coverOut' in entry)) {
    throw new Error(
      `${where}: "coverOut" is required — a path, or null if the cover is maintained separately`,
    )
  }
  if (entry.coverOut !== null && (typeof entry.coverOut !== 'string' || entry.coverOut.trim() === '')) {
    throw new Error(`${where}: "coverOut" must be a non-empty string or null`)
  }
  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof entry[field] !== 'string' || entry[field].trim() === '') {
      throw new Error(`${where}: "${field}" must be a non-empty string`)
    }
  }
  for (const field of [...REQUIRED_PAGE_FIELDS, 'coverPage']) {
    const value = entry[field]
    if (value === undefined && field === 'coverPage') continue
    if (!Number.isInteger(value) || value < 1) {
      throw new Error(`${where} ("${entry.slug}"): "${field}" must be a positive integer`)
    }
  }
}

function extract(entry, index) {
  validateEntry(entry, index)
  const sourcePath = ensureInside(SOURCE_DIR, entry.source, `"${entry.slug}" source`)
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
    const pdfOut = ensureInside(PDF_OUT_ROOT, entry.pdfOut, `"${entry.slug}" pdfOut`)
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

    if (entry.coverOut === null) {
      /* An explicit null means the published cover did not come from this
         volume — see the note on that manifest entry. */
      return {
        slug: entry.slug,
        pdfPages: pageCount(pdfOut),
        pdfBytes: fs.statSync(pdfOut).size,
        coverBytes: null,
      }
    }

    const coverOut = ensureInside(CLIPPING_OUT_ROOT, entry.coverOut, `"${entry.slug}" coverOut`)
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
      const pending = `${coverOut}.pending`
      run('cwebp', [
        '-quiet',
        '-q', String(entry.coverQuality ?? COVER_QUALITY),
        soleFile(coverDir, '.jpg'),
        '-o', pending,
      ])
      /* A published cover may have been prepared by hand after extraction —
         recropped, rescanned, recompressed — in which case re-running this
         tool would quietly replace it with a different image. Re-encoding the
         same render is fine (encoder versions differ); different dimensions
         are not, and stop the run. */
      assertCoverReplaceable(coverOut, pending, entry.slug)
      fs.renameSync(pending, coverOut)
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

try {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
  if (!Array.isArray(manifest)) {
    throw new Error(`${path.relative(ROOT, MANIFEST_PATH)} must contain an array of entries`)
  }
  const results = manifest.map(extract)

  for (const result of results) {
    console.log(
      `${result.slug}: pdfPageCount=${result.pdfPages} ` +
        `pdf=${(result.pdfBytes / 1024 / 1024).toFixed(1)}MB ` +
        `cover=${Math.round(result.coverBytes / 1024)}KB`,
    )
  }
  console.log(`Extracted ${results.length} TÜSTAV articles.`)
} catch (error) {
  console.error(
    error instanceof PathGuardError || error instanceof Error ? error.message : String(error),
  )
  process.exit(1)
}
