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

/* History carries two known false positives, pinned to the exact blob that
   holds them and the exact string matched inside it — never to the path.

   Both live in one superseded version of the scanner's own test file, which
   wrote its fixtures whole before they were split into concatenated pieces.
   Neither is a credential: one is an OpenSSH private-key *marker line* with
   no key material after it, the other a connection string for a host that
   does not resolve. The commits holding it are pushed, so the blob cannot be
   removed without rewriting published history.

   Pinning the path instead would exempt every version of that file, in both
   directions: a real key committed to it tomorrow and removed the day after
   would sit in the history permanently invisible to the scan whose whole
   purpose is to find exactly that. A blob name is a hash of its content, so
   any edit produces a different blob that is scanned normally, and a second
   match inside this same blob has a different fingerprint and is reported. */
const HISTORY_ALLOW = [
  // tests/check-secrets.test.ts:62 — private key block
  { blob: 'd4fdeb261af4fb35f393b089640d4c6a83a648f8', match: '8ed552b24e981c79' },
  // tests/check-secrets.test.ts:67 — database URL with a password
  { blob: 'd4fdeb261af4fb35f393b089640d4c6a83a648f8', match: '7364b59777bfc1c5' },
]

const history = process.argv.includes('--history')
for (const arg of process.argv.slice(2)) {
  if (arg !== '--history') {
    console.error(`Unknown flag ${arg}. Usage: check-secrets.mjs [--history]`)
    process.exit(1)
  }
}

const result = history
  ? scanHistory(projectRoot, { allow: HISTORY_ALLOW })
  : scanRepository(projectRoot, { exclude: NOT_SECRETS })
const { findings, scanned } = result
const skipped = result.skipped ?? []

/* A pin that no longer matches anything is not harmless: it is an exemption
   whose reason has gone, and leaving it in place is how an allowlist widens
   without anyone deciding to widen it. */
for (const stale of result.staleAllows ?? []) {
  console.error(`Stale history exemption, matched nothing: ${stale}`)
}

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

if (history && result.suppressed.length) {
  console.log(
    `${result.suppressed.length} known false positive(s) suppressed by an exact ` +
      `blob+match pin:\n${result.suppressed.map((line) => `  ${line}`).join('\n')}\n`,
  )
}

console.log(
  history
    ? `No further credential-shaped strings in ${scanned} unique text blob(s) across ` +
      'every local ref. This is the scanned scope, not a guarantee that no secret ' +
      'of any kind is present.'
    : `No credential-shaped strings in ${scanned} text file(s) ` +
      `(${skipped.length} of ${scanned + skipped.length} tracked and stageable files skipped ` +
      'as binary or oversized).',
)
console.log(
  'This is a coarse net over a fixed pattern list, not a substitute for ' +
    "GitHub's Secret Scanning and Push Protection — see docs/SECURITY.md.",
)
