/**
 * Credential-shaped string detection and the file set it runs over, kept
 * apart from the CLI so both can be tested directly against a throwaway
 * repository (tests/check-secrets.test.ts).
 *
 * A coarse net over a fixed pattern list. Not a replacement for GitHub's
 * Secret Scanning and Push Protection — see docs/SECURITY.md.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

/** Every pattern carries the `g` flag: a line is scanned for *all* its
 *  matches, not just the first. Checking only the first meant a placeholder
 *  at the start of a line hid a real key later on the same line. */
export const SECRET_PATTERNS = [
  [/-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/g, 'private key block'],
  [/\bAKIA[0-9A-Z]{16}\b/g, 'AWS access key id'],
  [/\bgh[pousr]_[A-Za-z0-9]{36,}\b/g, 'GitHub token'],
  [/\bgithub_pat_[A-Za-z0-9_]{22,}\b/g, 'GitHub fine-grained token'],
  [/\bsk-ant-[A-Za-z0-9_-]{20,}\b/g, 'Anthropic API key'],
  [/\bsk-(?:proj-)?[A-Za-z0-9]{32,}\b/g, 'OpenAI API key'],
  [/\bxox[abposr]-[A-Za-z0-9-]{10,}\b/g, 'Slack token'],
  [/\bAIza[0-9A-Za-z_-]{35}\b/g, 'Google API key'],
  [/\bglpat-[A-Za-z0-9_-]{20,}\b/g, 'GitLab token'],
  [/\bSG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}\b/g, 'SendGrid key'],
  [
    /\b(?:postgres|postgresql|mysql|mongodb(?:\+srv)?):\/\/[^\s:@/]+:[^\s:@/]+@/g,
    'database URL with a password',
  ],
]

/** A placeholder is only a placeholder when the *matched text itself* is one.
 *  Testing the whole line meant a real key next to the word "example" — a
 *  comment, a neighbouring URL — was exempted along with it. */
const PLACEHOLDER_MATCH =
  /EXAMPLE|PLACEHOLDER|REDACTED|CHANGEME|YOUR[_-]?(KEY|TOKEN|SECRET)|X{6,}|\.{3,}/i

/** A value interpolated at run time is a reference, not a secret: the whole
 *  match has to sit inside the substitution for this to apply. */
const INTERPOLATION = /^\$\{[^}]*\}$|^<[^>]*>$/

export function isPlaceholder(matched) {
  return PLACEHOLDER_MATCH.test(matched) || INTERPOLATION.test(matched)
}

/**
 * Every credential-shaped string in `contents` that is not a placeholder.
 * Returns `{ line, column, label, matched }` per finding, one per match —
 * several on one line are several findings.
 *
 * @param {string} contents
 * @returns {{ line: number, column: number, label: string, matched: string }[]}
 */
export function findSecrets(contents) {
  const findings = []
  const lines = contents.split('\n')
  for (const [index, line] of lines.entries()) {
    for (const [pattern, label] of SECRET_PATTERNS) {
      pattern.lastIndex = 0
      for (const match of line.matchAll(pattern)) {
        if (isPlaceholder(match[0])) continue
        findings.push({
          line: index + 1,
          column: (match.index ?? 0) + 1,
          label,
          matched: match[0],
        })
      }
    }
  }
  findings.sort((a, b) => a.line - b.line || a.column - b.column)
  return findings
}

const NUL = String.fromCharCode(0)

/** True when the first block looks binary, whatever the extension claims. */
export function looksBinary(contents) {
  return contents.slice(0, 8192).includes(NUL)
}

const SKIP_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.pdf',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.otf',
])

const MAX_FILE_BYTES = 4_000_000

/**
 * Every path a `git add -A` in `root` would stage — tracked files and
 * untracked ones alike, minus what .gitignore excludes.
 *
 * Reading only tracked files meant a run before `git add` and the same run
 * after it could disagree, which is how a credential shape reached a commit
 * in this repository: the check was green while the offending file was still
 * untracked.
 *
 * Scope, stated because it is easy to assume otherwise: this reads the
 * working tree. It does not read the index, so a secret staged and then
 * edited out of the working copy is invisible to it, and it does not read
 * history, so a secret in an earlier commit stays there. Both are jobs for
 * GitHub's Secret Scanning.
 *
 * @param {string} root
 * @returns {string[]}
 */
export function listScannableFiles(root) {
  return execFileSync(
    'git',
    ['ls-files', '-z', '--cached', '--others', '--exclude-standard'],
    { cwd: root, encoding: 'utf8', maxBuffer: 64e6 },
  )
    .split('\0')
    .filter(Boolean)
}

/**
 * Scans `root` and returns `{ findings, scanned, skipped }`. A finding is
 * `<path>:<line>:<column>: possible <label>`.
 *
 * `exclude` names paths whose own contents are patterns rather than secrets —
 * scripts/lib/secret-patterns.mjs itself, in the real run.
 *
 * @param {string} root
 * @param {{ exclude?: string[] }} [options]
 * @returns {{ findings: string[], scanned: number, skipped: string[] }}
 */
export function scanRepository(root, { exclude = [] } = {}) {
  const excluded = new Set(exclude)
  const findings = []
  const skipped = []
  let scanned = 0

  for (const relative of listScannableFiles(root)) {
    if (SKIP_EXTENSIONS.has(path.extname(relative).toLowerCase())) {
      skipped.push(relative)
      continue
    }
    const absolute = path.join(root, relative)
    let contents
    try {
      const stat = fs.statSync(absolute)
      if (!stat.isFile() || stat.size > MAX_FILE_BYTES) {
        skipped.push(relative)
        continue
      }
      contents = fs.readFileSync(absolute, 'utf8')
    } catch {
      skipped.push(relative)
      continue
    }
    /* A NUL byte in the first block means binary whatever the extension
       says; reading it as text produces noise, not findings. */
    if (looksBinary(contents)) {
      skipped.push(relative)
      continue
    }
    scanned += 1
    if (excluded.has(relative)) continue

    for (const finding of findSecrets(contents)) {
      findings.push(`${relative}:${finding.line}:${finding.column}: possible ${finding.label}`)
    }
  }

  return { findings, scanned, skipped }
}
