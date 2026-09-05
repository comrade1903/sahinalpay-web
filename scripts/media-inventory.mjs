#!/usr/bin/env node
/**
 * Reports which files under public/archive/ the site actually links to.
 *
 * A file stops being referenced the moment a record is edited, but it keeps
 * shipping: everything under public/ is copied into the deployment verbatim,
 * so removing a link from the UI does not stop the file being served at its
 * own URL. This does not delete anything — it tells you what is there, so
 * source scans kept for provenance can be told apart from the derivatives the
 * site publishes, and that decision can be made deliberately.
 *
 *   npm run inventory:media            summary
 *   npm run inventory:media -- --list  every unreferenced path
 *   npm run inventory:media -- --json  machine-readable
 */
import fs from 'node:fs'
import path from 'node:path'
import { readArchiveItems } from './lib/archive-model.mjs'
import { projectRoot } from './lib/load-archive.mjs'

const publicDir = path.join(projectRoot, 'public')
const archiveDir = path.join(publicDir, 'archive')

function walk(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    if (!entry.isFile()) return []
    return [full]
  })
}

const items = await readArchiveItems()

const referenced = new Set()
for (const item of items) {
  for (const assetPath of item.assetPaths) referenced.add(assetPath)
}

const files = walk(archiveDir).map((full) => ({
  route: `/${path.relative(publicDir, full).split(path.sep).join('/')}`,
  bytes: fs.statSync(full).size,
}))

const unreferenced = files.filter((file) => !referenced.has(file.route))
const missing = [...referenced].filter(
  (route) => !fs.existsSync(path.join(publicDir, route)),
)

const byExtension = {}
for (const file of unreferenced) {
  const ext = path.extname(file.route).toLowerCase() || '(none)'
  byExtension[ext] ??= { count: 0, bytes: 0 }
  byExtension[ext].count += 1
  byExtension[ext].bytes += file.bytes
}

const mib = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MiB`
const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0)
const unreferencedBytes = unreferenced.reduce((sum, file) => sum + file.bytes, 0)

if (process.argv.includes('--json')) {
  console.log(
    JSON.stringify(
      {
        total: { files: files.length, bytes: totalBytes },
        referenced: { files: files.length - unreferenced.length },
        unreferenced: unreferenced.map((file) => file.route),
        missing,
      },
      null,
      2,
    ),
  )
} else {
  console.log(`public/archive: ${files.length} files, ${mib(totalBytes)}`)
  console.log(`  referenced by a record: ${files.length - unreferenced.length}`)
  console.log(`  not referenced:         ${unreferenced.length} (${mib(unreferencedBytes)})`)
  for (const [ext, stats] of Object.entries(byExtension).sort(
    (a, b) => b[1].bytes - a[1].bytes,
  )) {
    console.log(`    ${ext.padEnd(8)} ${String(stats.count).padStart(4)} files  ${mib(stats.bytes)}`)
  }
  if (process.argv.includes('--list')) {
    console.log('\nUnreferenced:')
    for (const file of unreferenced) console.log(`  ${file.route}`)
  } else if (unreferenced.length) {
    console.log('\nRe-run with --list to see them.')
  }
  if (missing.length) {
    console.log(`\n${missing.length} referenced file(s) missing from disk:`)
    for (const route of missing) console.log(`  ${route}`)
  }
  console.log(
    '\nUnreferenced does not mean deletable: these files may be the source scans a\n' +
      'published derivative was cut from. Nothing here is removed automatically —\n' +
      'see docs/OPERATIONS.md before changing what public/ ships.',
  )
}

process.exit(missing.length ? 1 : 0)
