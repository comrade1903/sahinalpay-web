#!/usr/bin/env node
/**
 * Re-downloads the TÜSTAV source volumes that scripts/tustav-pdf-extracts.json
 * cuts its article extracts from, and proves the recovered file is the same
 * one the committed extracts were made from.
 *
 * The volumes live under tmp/tustav-pdfs/, which is gitignored — they are
 * TÜSTAV's scans, not this archive's, and what this repository publishes is
 * the article-scoped extract. That means a clean checkout has none of them,
 * and neither does a machine where the scratch directory was cleared.
 *
 * Verification is not a checksum of the download against itself. The extracts
 * already in public/archive/ are the reference: after fetching, this re-runs
 * the extraction and compares the result with the committed files.
 *
 * The comparison is by content, not by bytes, because the extraction is not
 * byte-reproducible — `pdfunite` stamps each output with a creation time and
 * a document id, so two runs from the same volume produce two different
 * files. What is compared instead is what actually has to match: the article
 * PDF's page count and its full extracted text, and the cover's pixel
 * dimensions. A volume that reproduces those is the volume the published
 * extracts were cut from.
 *
 *   npm run recover:tustav                 fetch what is missing, then verify
 *   npm run recover:tustav -- --verify     verify what is already on disk
 *   npm run recover:tustav -- --force      re-fetch even if present
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { downloadGuarded, hostAllowlist } from './lib/net-guard.mjs'
import { ensureInside } from './lib/fs-guard.mjs'
import { projectRoot } from './lib/load-archive.mjs'

const args = new Set(process.argv.slice(2))
const verifyOnly = args.has('--verify')
const force = args.has('--force')
for (const arg of args) {
  if (!['--verify', '--force'].includes(arg)) {
    console.error(`Unknown flag ${arg}. Usage: recover-tustav-pdfs.mjs [--verify] [--force]`)
    process.exit(1)
  }
}

const cacheDir = path.join(projectRoot, 'tmp', 'tustav-pdfs')
const publicArchive = path.join(projectRoot, 'public', 'archive')
const manifest = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'scripts', 'tustav-pdf-extracts.json'), 'utf8'),
)
const { sources } = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'scripts', 'tustav-pdf-sources.json'), 'utf8'),
)

const ALLOWED_HOSTS = hostAllowlist(Object.values(sources))
const MAX_PDF_BYTES = 384 * 1024 * 1024
const TIMEOUT_MS = 15 * 60 * 1000

const sha256Text = (value) => crypto.createHash('sha256').update(value).digest('hex')

const needed = [...new Set(manifest.map((entry) => entry.source))]
const failures = []

/* ---- fetch ---- */

for (const source of needed) {
  const url = sources[source]
  if (!url) {
    failures.push(`${source}: no address recorded in scripts/tustav-pdf-sources.json`)
    continue
  }
  const target = ensureInside(cacheDir, source, 'source volume')
  if (fs.existsSync(target) && !force) {
    console.log(`present  ${source} (${(fs.statSync(target).size / 1024 / 1024).toFixed(1)} MiB)`)
    continue
  }
  if (verifyOnly) {
    failures.push(`${source}: missing, and --verify does not fetch`)
    continue
  }
  fs.mkdirSync(path.dirname(target), { recursive: true })
  process.stdout.write(`fetching ${source} … `)
  try {
    const { bytes } = await downloadGuarded(url, target, {
      allowedHosts: ALLOWED_HOSTS,
      maxBytes: MAX_PDF_BYTES,
      timeoutMs: TIMEOUT_MS,
      accept: 'application/pdf',
      label: source,
    })
    console.log(`${(bytes / 1024 / 1024).toFixed(1)} MiB`)
  } catch (error) {
    console.log('failed')
    failures.push(`${source}: ${error.message}`)
  }
}

if (failures.length) {
  console.error(`\n${failures.length} volume(s) could not be obtained:\n${failures.join('\n')}`)
  process.exit(1)
}

/* ---- verify against the committed extracts ---- */

console.log('\nVerifying against the committed extracts…')

function pdfPageCount(file) {
  const info = execFileSync('pdfinfo', [file], { encoding: 'utf8' })
  return /^Pages:\s+(\d+)$/m.exec(info)?.[1] ?? null
}

function pdfText(file) {
  return execFileSync('pdftotext', ['-q', file, '-'], { encoding: 'utf8', maxBuffer: 64e6 })
}

/** Pixel dimensions from a webp's VP8/VP8L/VP8X header. */
function webpSize(file) {
  const buffer = fs.readFileSync(file)
  if (buffer.length < 30 || buffer.toString('ascii', 0, 4) !== 'RIFF') return null
  const format = buffer.toString('ascii', 12, 16)
  if (format === 'VP8X') {
    return `${(buffer.readUIntLE(24, 3) & 0xffffff) + 1}x${(buffer.readUIntLE(27, 3) & 0xffffff) + 1}`
  }
  if (format === 'VP8 ') {
    return `${buffer.readUInt16LE(26) & 0x3fff}x${buffer.readUInt16LE(28) & 0x3fff}`
  }
  if (format === 'VP8L') {
    const bits = buffer.readUInt32LE(21)
    return `${(bits & 0x3fff) + 1}x${((bits >> 14) & 0x3fff) + 1}`
  }
  return null
}

const referenced = []
for (const entry of manifest) {
  if (entry.pdfOut) {
    referenced.push({ kind: 'pdf', slug: entry.slug, file: path.join(publicArchive, 'pdf', entry.pdfOut) })
  }
  if (entry.coverOut) {
    referenced.push({
      kind: 'cover',
      slug: entry.slug,
      file: path.join(publicArchive, 'clippings', entry.coverOut),
    })
  }
}

/* The extractor writes into public/archive/, so the published files are
   copied aside first and put back afterwards whatever the outcome — a wrong
   volume must not be able to leave the archive holding a rebuild. */
const backupDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tustav-committed-'))
const before = new Map()

for (const [index, target] of referenced.entries()) {
  if (!fs.existsSync(target.file)) {
    failures.push(`${path.relative(projectRoot, target.file)} is missing from the repository`)
    continue
  }
  before.set(target.file, {
    ...target,
    fingerprint:
      target.kind === 'pdf'
        ? { pages: pdfPageCount(target.file), text: sha256Text(pdfText(target.file)) }
        : { size: webpSize(target.file) },
  })
  fs.copyFileSync(target.file, path.join(backupDir, String(index)))
}

if (failures.length) {
  fs.rmSync(backupDir, { recursive: true, force: true })
  console.error(`\n${failures.join('\n')}`)
  process.exit(1)
}

let extractionError = null
try {
  execFileSync(process.execPath, [path.join(projectRoot, 'scripts', 'extract-tustav-pdf.mjs')], {
    cwd: projectRoot,
    stdio: 'pipe',
  })
} catch (error) {
  extractionError = error.stderr?.toString() || error.message
}

let verified = 0
if (!extractionError) {
  for (const [file, expected] of before) {
    if (!fs.existsSync(file)) {
      failures.push(`${path.relative(projectRoot, file)} was not produced by the rebuild`)
      continue
    }
    const relative = path.relative(projectRoot, file)
    if (expected.kind === 'pdf') {
      const pages = pdfPageCount(file)
      const text = sha256Text(pdfText(file))
      if (pages !== expected.fingerprint.pages) {
        failures.push(`${relative}: ${pages} pages, published file has ${expected.fingerprint.pages}`)
      } else if (text !== expected.fingerprint.text) {
        failures.push(`${relative}: the extracted text differs from the published file`)
      } else {
        verified += 1
      }
    } else {
      const size = webpSize(file)
      if (size !== expected.fingerprint.size) {
        failures.push(`${relative}: rendered ${size}, published file is ${expected.fingerprint.size}`)
      } else {
        verified += 1
      }
    }
  }
}

/* Put the published files back regardless — including after a mismatch, which
   is exactly when the working tree must not be left holding the rebuild. */
for (const [index, target] of referenced.entries()) {
  const backup = path.join(backupDir, String(index))
  if (fs.existsSync(backup)) fs.copyFileSync(backup, target.file)
}
fs.rmSync(backupDir, { recursive: true, force: true })

if (extractionError) {
  console.error(`Re-extraction failed, so the volumes could not be checked:\n${extractionError}`)
  process.exit(1)
}

if (failures.length) {
  console.error(`\n${failures.length} mismatch(es):\n${failures.join('\n')}`)
  console.error('The published extracts have been restored; nothing in public/ was changed.')
  process.exit(1)
}

const coversHeldBack = manifest.filter((entry) => entry.coverOut === null).length
console.log(
  `Verified: ${needed.length} source volume(s) reproduce all ${verified} published ` +
    'extract file(s) — same page count, same extracted text, same cover dimensions. ' +
    `public/ is unchanged.` +
    (coversHeldBack
      ? `\n${coversHeldBack} cover(s) are maintained outside this tool and were not compared ` +
        '(see coverNote in scripts/tustav-pdf-extracts.json).'
      : ''),
)
