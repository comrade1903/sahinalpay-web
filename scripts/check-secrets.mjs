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
import { scanHistory, scanRepository } from './lib/secret-patterns.mjs'

/* The pattern module's own patterns are patterns, not secrets. Nothing else
   is exempt from the working-tree scan: the test fixtures assemble their
   credential shapes from pieces precisely so the file can be scanned like any
   other, and exempting it would hide a real mistake made in it. */
const NOT_SECRETS = ['scripts/lib/secret-patterns.mjs']

/* History carries one more. Three commits on this branch hold an earlier
   version of the scanner's test file that wrote two fixtures whole, before
   they were split. Neither is a credential — one is an OpenSSH private-key
   *marker line* with no key material after it, the other a connection string
   for a host that does not resolve — and history cannot be rewritten to
   remove them without discarding pushed commits. */
const NOT_SECRETS_IN_HISTORY = [...NOT_SECRETS, 'tests/check-secrets.test.ts']

const history = process.argv.includes('--history')
for (const arg of process.argv.slice(2)) {
  if (arg !== '--history') {
    console.error(`Unknown flag ${arg}. Usage: check-secrets.mjs [--history]`)
    process.exit(1)
  }
}

const { findings, scanned, skipped } = history
  ? { ...scanHistory(projectRoot, { exclude: NOT_SECRETS_IN_HISTORY }), skipped: [] }
  : scanRepository(projectRoot, { exclude: NOT_SECRETS })

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
  history
    ? `No credential-shaped strings in ${scanned} unique text blob(s) across every ref — ` +
      'the whole history, not just the tip.'
    : `No credential-shaped strings in ${scanned} text file(s) ` +
      `(${skipped.length} of ${scanned + skipped.length} tracked and stageable files skipped ` +
      'as binary or oversized).',
)
console.log(
  'This is a coarse net over a fixed pattern list, not a substitute for ' +
    "GitHub's Secret Scanning and Push Protection — see docs/SECURITY.md.",
)
