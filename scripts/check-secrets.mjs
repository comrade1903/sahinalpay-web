#!/usr/bin/env node
/**
 * Coarse pre-flight scan for credential-shaped strings.
 *
 * NOT a replacement for GitHub's Secret Scanning and Push Protection, which
 * cover far more providers, read the index and history rather than only the
 * working tree, and run on every push — those are repository settings and
 * have to be enabled in the GitHub UI (see docs/SECURITY.md). This exists so
 * an obvious mistake fails CI even before that, and so the check runs on a
 * clone with no GitHub features at all.
 *
 * The matching and the file enumeration both live in
 * scripts/lib/secret-patterns.mjs so they can be tested against a throwaway
 * repository; this file is the command-line wrapper.
 *
 *   npm run check:secrets
 */
import { projectRoot } from './lib/load-archive.mjs'
import { scanRepository } from './lib/secret-patterns.mjs'

const { findings, scanned, skipped } = scanRepository(projectRoot, {
  /* The pattern module's own patterns are patterns, not secrets. */
  exclude: ['scripts/lib/secret-patterns.mjs'],
})

if (findings.length) {
  console.error(
    `${findings.length} possible secret(s) in tracked or stageable files:\n` +
      findings.join('\n'),
  )
  console.error(
    '\nIf a match is a false positive, narrow the pattern in scripts/lib/secret-patterns.mjs.',
  )
  process.exit(1)
}

console.log(
  `No credential-shaped strings in ${scanned} text file(s) ` +
    `(${skipped.length} of ${scanned + skipped.length} tracked and stageable files skipped as ` +
    'binary or oversized).',
)
console.log(
  'This is a coarse net over a fixed pattern list, not a substitute for ' +
    "GitHub's Secret Scanning and Push Protection — see docs/SECURITY.md.",
)
