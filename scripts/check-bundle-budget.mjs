#!/usr/bin/env node
/**
 * Fails when the scripts a first visit downloads grow past their budget.
 * Run after `npm run build`. Limits live in scripts/bundle-budget.json and
 * are lowered as the splitting work lands; raising one is a decision to
 * make on purpose, in review, not a way to make CI pass.
 *
 *   npm run check:bundle
 */
import fs from 'node:fs'
import path from 'node:path'
import { projectRoot } from './lib/load-archive.mjs'
import { gzipKb, initialScripts } from './lib/bundle-budget.mjs'

const dist = path.join(projectRoot, 'dist')
const indexPath = path.join(dist, 'index.html')
if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html is missing — run "npm run build" first.')
  process.exit(1)
}
const budget = JSON.parse(fs.readFileSync(path.join(projectRoot, 'scripts', 'bundle-budget.json'), 'utf8'))
const scripts = initialScripts(fs.readFileSync(indexPath, 'utf8'))
if (scripts.length === 0) {
  console.error('No entry script found in dist/index.html.')
  process.exit(1)
}

let total = 0
for (const file of scripts) {
  const size = gzipKb(fs.readFileSync(path.join(dist, file)))
  total += size
  console.log(`${String(size).padStart(7)} kB  ${file}`)
}
total = Math.round(total * 10) / 10
const entry = gzipKb(fs.readFileSync(path.join(dist, scripts[0])))

const rows = [
  ['entry script', entry, budget.entryGzipKb],
  ['first-load scripts', total, budget.initialJsGzipKb],
]
let failed = false
console.log('')
for (const [label, size, limit] of rows) {
  const over = size > limit
  failed ||= over
  console.log(`${over ? 'OVER' : 'ok  '} ${label}: ${size} kB gzip (budget ${limit} kB)`)
}
if (failed) {
  console.error('\nThe first-load scripts grew past scripts/bundle-budget.json.')
  process.exit(1)
}
