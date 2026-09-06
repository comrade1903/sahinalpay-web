/**
 * Credential-shaped string detection, kept apart from the CLI so it can be
 * tested directly (tests/check-secrets.test.ts).
 *
 * A coarse net over a fixed pattern list. Not a replacement for GitHub's
 * Secret Scanning and Push Protection — see docs/SECURITY.md.
 */

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
