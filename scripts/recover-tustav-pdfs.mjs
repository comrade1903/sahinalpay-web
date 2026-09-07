#!/usr/bin/env node
/**
 * Re-fetches the TÜSTAV source volumes that scripts/tustav-pdf-extracts.json
 * cuts its article extracts from, and proves they are the volumes the
 * published extracts were cut from.
 *
 * The volumes live under tmp/tustav-pdfs/, which is gitignored — they are
 * TÜSTAV's scans, not this archive's, and what this repository publishes is
 * the article-scoped extract. A clean checkout has none of them, and neither
 * does a machine where the scratch directory was cleared.
 *
 * Two independent proofs, because either alone has a gap:
 *
 *   Digest.   scripts/tustav-pdf-sources.json records the SHA-256 of each
 *             volume as verified. A match settles it outright.
 *
 *   Content.  The extraction is re-run into a temporary directory and the
 *             result compared with the published extracts. This is what
 *             covers a volume whose digest is not yet recorded, and what
 *             proves the recorded digest still corresponds to what the
 *             archive publishes.
 *
 * The content comparison looks at page images, not at bytes and not at text:
 *
 *   - Bytes are wrong because pdfunite stamps every output with a creation
 *     time and a document id, so two runs from one volume differ.
 *   - Extracted text is worse than wrong, it is vacuous: these are image-only
 *     scans, and `pdftotext` returns one form feed per page and zero readable
 *     characters. An earlier version of this script compared that, which
 *     amounted to comparing the page count twice — a different scan with the
 *     same number of pages would have passed.
 *
 * So each article PDF is compared by the SHA-256 of its embedded image
 * streams (`pdfimages -all`), which pdfunite copies through verbatim, and
 * each cover by its decoded pixels with a tolerance, since webp is lossy and
 * encoder versions differ.
 *
 * public/ is never written to. The extraction goes to a temp directory via
 * --out-root, so a failure anywhere in this script cannot leave the published
 * archive holding a rebuild.
 *
 *   npm run recover:tustav                 fetch what is missing, then verify
 *   npm run recover:tustav -- --verify     verify what is already on disk
 *   npm run recover:tustav -- --force      re-fetch even if present
 *   npm run recover:tustav -- --record     accept the volumes on disk as the
 *                                          source of record and write their
 *                                          digests (only after verifying)
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { downloadGuarded, hostAllowlist } from './lib/net-guard.mjs'
import { ensureInside } from './lib/fs-guard.mjs'
import { projectRoot } from './lib/load-archive.mjs'

const KNOWN_FLAGS = ['--verify', '--force', '--record']
const args = new Set(process.argv.slice(2))
for (const arg of args) {
  if (!KNOWN_FLAGS.includes(arg)) {
    console.error(`Unknown flag ${arg}. Usage: recover-tustav-pdfs.mjs [${KNOWN_FLAGS.join('] [')}]`)
    process.exit(1)
  }
}
const verifyOnly = args.has('--verify')
const force = args.has('--force')
const record = args.has('--record')

const cacheDir = path.join(projectRoot, 'tmp', 'tustav-pdfs')
const publicArchive = path.join(projectRoot, 'public', 'archive')
const sourcesPath = path.join(projectRoot, 'scripts', 'tustav-pdf-sources.json')
const manifest = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'scripts', 'tustav-pdf-extracts.json'), 'utf8'),
)
const sourcesDoc = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'))
const { sources } = sourcesDoc

const ALLOWED_HOSTS = hostAllowlist(Object.values(sources).map((entry) => entry.url))
const MAX_PDF_BYTES = 384 * 1024 * 1024
const TIMEOUT_MS = 15 * 60 * 1000

/* Same image, different webp encoder: mean per-sample difference 0.43-0.54
   and nothing at all above 32. Two different covers of the same periodical,
   at the same dimensions: mean 6.96 with 5.7% of samples above 32. The gate
   sits in the gap, well clear of both. */
const COVER_MEAN_TOLERANCE = 2
const COVER_OUTLIER_TOLERANCE = 0.005

const failures = []
const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex')
const sha256File = (file) => sha256(fs.readFileSync(file))

function tool(command, commandArgs, options = {}) {
  return execFileSync(command, commandArgs, { encoding: 'utf8', maxBuffer: 256e6, ...options })
}

/* ---- fetch ---- */

const needed = [...new Set(manifest.map((entry) => entry.source))]

for (const source of needed) {
  const entry = sources[source]
  if (!entry?.url) {
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
    const { bytes } = await downloadGuarded(entry.url, target, {
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

/* ---- proof one: the recorded digest ---- */

console.log('\nChecking digests…')
const digests = new Map()
let digestMatches = 0

for (const source of needed) {
  const file = ensureInside(cacheDir, source, 'source volume')
  const digest = sha256File(file)
  digests.set(source, digest)
  const recorded = sources[source]?.sha256
  if (!recorded) {
    console.log(`  ${source}: no digest recorded yet`)
  } else if (recorded === digest) {
    console.log(`  ${source}: matches the recorded digest`)
    digestMatches += 1
  } else {
    failures.push(
      `${source}: sha256 ${digest.slice(0, 16)}… does not match the recorded ` +
        `${recorded.slice(0, 16)}…. The upstream file has changed, or this is a different ` +
        'scan. The content comparison below is what decides whether it is still usable.',
    )
  }
}

/* ---- proof two: the published extracts ---- */

console.log('\nRebuilding the extracts in a temporary directory…')

/* The extractor writes wherever --out-root says. public/ is opened read-only
   from here on, so nothing this script does — including a crash in the
   comparison itself — can touch the published archive. */
const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tustav-verify-'))

function pdfPageCount(file) {
  return /^Pages:\s+(\d+)$/m.exec(tool('pdfinfo', [file]))?.[1] ?? null
}

/** SHA-256 over every image stream the PDF embeds, in page order. pdfunite
 *  copies these through unchanged, so this is the page content itself rather
 *  than the container it arrived in. */
function pdfImageDigest(file) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tustav-img-'))
  try {
    tool('pdfimages', ['-all', file, path.join(dir, 'i')], { stdio: 'pipe' })
    const names = fs.readdirSync(dir).sort()
    if (names.length === 0) return null
    const hash = crypto.createHash('sha256')
    for (const name of names) hash.update(sha256File(path.join(dir, name)))
    return `${names.length}:${hash.digest('hex')}`
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
}

/** Decodes a webp to a raw PAM raster so the pixels can be compared. */
function decodeCover(file) {
  const raw = execFileSync('dwebp', ['-quiet', file, '-pam', '-o', '/dev/stdout'], {
    maxBuffer: 512e6,
  })
  const headerEnd = raw.indexOf(Buffer.from('ENDHDR\n'))
  if (headerEnd < 0) return null
  const header = raw.toString('ascii', 0, headerEnd)
  const field = (key) => Number(new RegExp(`^${key} (\\d+)$`, 'm').exec(header)?.[1])
  return {
    width: field('WIDTH'),
    height: field('HEIGHT'),
    depth: field('DEPTH'),
    data: raw.subarray(headerEnd + 'ENDHDR\n'.length),
  }
}

function compareCovers(publishedFile, rebuiltFile) {
  const a = decodeCover(publishedFile)
  const b = decodeCover(rebuiltFile)
  if (!a || !b) return { ok: false, reason: 'could not be decoded' }
  if (a.width !== b.width || a.height !== b.height || a.depth !== b.depth) {
    return {
      ok: false,
      reason: `published is ${a.width}x${a.height}, rebuild is ${b.width}x${b.height}`,
    }
  }
  const length = Math.min(a.data.length, b.data.length)
  let total = 0
  let outliers = 0
  for (let index = 0; index < length; index += 1) {
    const delta = Math.abs(a.data[index] - b.data[index])
    total += delta
    if (delta > 32) outliers += 1
  }
  const mean = total / length
  const outlierShare = outliers / length
  if (mean > COVER_MEAN_TOLERANCE || outlierShare > COVER_OUTLIER_TOLERANCE) {
    return {
      ok: false,
      reason:
        `pixels differ too much to be a re-encode of the same image ` +
        `(mean ${mean.toFixed(2)}, ${(outlierShare * 100).toFixed(2)}% of samples off by >32)`,
    }
  }
  return { ok: true, detail: `mean ${mean.toFixed(2)}` }
}

let verified = 0

try {
  tool(process.execPath, [
    path.join(projectRoot, 'scripts', 'extract-tustav-pdf.mjs'),
    `--out-root=${workDir}`,
  ])

  for (const entry of manifest) {
    if (entry.pdfOut) {
      const published = path.join(publicArchive, 'pdf', entry.pdfOut)
      const rebuilt = path.join(workDir, 'pdf', entry.pdfOut)
      if (!fs.existsSync(published)) {
        failures.push(`${entry.pdfOut}: missing from the repository`)
      } else if (!fs.existsSync(rebuilt)) {
        failures.push(`${entry.pdfOut}: the rebuild did not produce it`)
      } else {
        const publishedPages = pdfPageCount(published)
        const rebuiltPages = pdfPageCount(rebuilt)
        const publishedImages = pdfImageDigest(published)
        const rebuiltImages = pdfImageDigest(rebuilt)
        if (publishedPages !== rebuiltPages) {
          failures.push(
            `${entry.pdfOut}: rebuild has ${rebuiltPages} pages, published has ${publishedPages}`,
          )
        } else if (publishedImages === null) {
          failures.push(`${entry.pdfOut}: the published file embeds no images to compare`)
        } else if (publishedImages !== rebuiltImages) {
          failures.push(`${entry.pdfOut}: the page images differ from the published file`)
        } else {
          verified += 1
        }
      }
    }

    if (entry.coverOut) {
      const published = path.join(publicArchive, 'clippings', entry.coverOut)
      const rebuilt = path.join(workDir, 'clippings', entry.coverOut)
      if (!fs.existsSync(published)) {
        failures.push(`${entry.coverOut}: missing from the repository`)
      } else if (!fs.existsSync(rebuilt)) {
        failures.push(`${entry.coverOut}: the rebuild did not produce it`)
      } else {
        const result = compareCovers(published, rebuilt)
        if (result.ok) verified += 1
        else failures.push(`${entry.coverOut}: ${result.reason}`)
      }
    }
  }
} catch (error) {
  failures.push(`the rebuild could not be checked: ${error.stderr?.toString() || error.message}`)
} finally {
  fs.rmSync(workDir, { recursive: true, force: true })
}

if (failures.length) {
  console.error(`\n${failures.length} problem(s):\n${failures.join('\n')}`)
  console.error('\npublic/ was not written to at any point.')
  process.exit(1)
}

/* ---- record ---- */

if (record) {
  for (const [source, digest] of digests) {
    sources[source] = { ...sources[source], sha256: digest, bytes: fs.statSync(ensureInside(cacheDir, source, 'source volume')).size }
  }
  fs.writeFileSync(sourcesPath, `${JSON.stringify(sourcesDoc, null, 2)}\n`)
  console.log('\nRecorded the digests in scripts/tustav-pdf-sources.json.')
}

const coversHeldBack = manifest.filter((entry) => entry.coverOut === null).length
console.log(
  `\nVerified: ${needed.length} source volume(s), ${digestMatches} matching a recorded digest, ` +
    `reproducing all ${verified} published extract file(s) — same page count, same embedded ` +
    'page images, same cover pixels within re-encoding tolerance. public/ was read only.' +
    (coversHeldBack
      ? `\n${coversHeldBack} cover(s) are maintained outside this tool and were not compared ` +
        '(see coverNote in scripts/tustav-pdf-extracts.json).'
      : ''),
)
