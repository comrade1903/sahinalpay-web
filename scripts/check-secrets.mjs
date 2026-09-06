#!/usr/bin/env node
/**
 * Coarse pre-flight scan of tracked files for credential-shaped strings.
 *
 * NOT a replacement for GitHub's Secret Scanning and Push Protection, which
 * cover far more providers and run on every push — those are repository
 * settings and have to be enabled in the GitHub UI (see docs/SECURITY.md).
 * This exists so an obvious mistake fails CI even before that, and so the
 * check runs on a clone with no GitHub features at all.
 *
 *   npm run check:secrets
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { projectRoot } from './lib/load-archive.mjs'
import { findSecrets, looksBinary } from './lib/secret-patterns.mjs'

const SKIP_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.pdf', '.ico', '.woff', '.woff2', '.ttf', '.otf',
])

const files = execFileSync('git', ['ls-files', '-z'], { cwd: projectRoot, encoding: 'utf8' })
  .split('\0')
  .filter(Boolean)

const findings = []
const skipped = []
let scanned = 0

for (const relative of files) {
  if (SKIP_EXTENSIONS.has(path.extname(relative).toLowerCase())) {
    skipped.push(relative)
    continue
  }
  const absolute = path.join(projectRoot, relative)
  let contents
  try {
    const stat = fs.statSync(absolute)
    if (!stat.isFile() || stat.size > 4_000_000) {
      skipped.push(relative)
      continue
    }
    contents = fs.readFileSync(absolute, 'utf8')
  } catch {
    skipped.push(relative)
    continue
  }
  /* A file with a NUL byte in the first block is binary whatever its
     extension says; reading it as text produces noise, not findings. */
  if (looksBinary(contents)) {
    skipped.push(relative)
    continue
  }
  scanned += 1
  /* The pattern module's own patterns are patterns, not secrets. */
  if (relative === 'scripts/lib/secret-patterns.mjs') continue

  for (const finding of findSecrets(contents)) {
    findings.push(`${relative}:${finding.line}:${finding.column}: possible ${finding.label}`)
  }
}

if (findings.length) {
  console.error(`${findings.length} possible secret(s) in tracked files:\n${findings.join('\n')}`)
  console.error(
    '\nIf a match is a false positive, narrow the pattern in scripts/lib/secret-patterns.mjs.',
  )
  process.exit(1)
}

console.log(
  `No credential-shaped strings in ${scanned} text file(s) ` +
    `(${skipped.length} of ${files.length} tracked files skipped as binary or oversized).`,
)
console.log(
  'This is a coarse net over a fixed pattern list, not a substitute for ' +
    "GitHub's Secret Scanning and Push Protection — see docs/SECURITY.md.",
)
