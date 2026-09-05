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

const PATTERNS = [
  [/-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/, 'private key block'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key id'],
  [/\bgh[pousr]_[A-Za-z0-9]{36,}\b/, 'GitHub token'],
  [/\bgithub_pat_[A-Za-z0-9_]{22,}\b/, 'GitHub fine-grained token'],
  [/\bsk-ant-[A-Za-z0-9_-]{20,}\b/, 'Anthropic API key'],
  [/\bsk-(?:proj-)?[A-Za-z0-9]{32,}\b/, 'OpenAI API key'],
  [/\bxox[abposr]-[A-Za-z0-9-]{10,}\b/, 'Slack token'],
  [/\bAIza[0-9A-Za-z_-]{35}\b/, 'Google API key'],
  [/\bglpat-[A-Za-z0-9_-]{20,}\b/, 'GitLab token'],
  [/\bSG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}\b/, 'SendGrid key'],
  [/\b(?:postgres|postgresql|mysql|mongodb(?:\+srv)?):\/\/[^\s:@/]+:[^\s:@/]+@/, 'database URL with a password'],
]

const SKIP_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.pdf', '.ico', '.woff', '.woff2', '.ttf', '.otf',
])

const files = execFileSync('git', ['ls-files', '-z'], { cwd: projectRoot, encoding: 'utf8' })
  .split('\0')
  .filter(Boolean)

const findings = []

for (const relative of files) {
  if (SKIP_EXTENSIONS.has(path.extname(relative).toLowerCase())) continue
  const absolute = path.join(projectRoot, relative)
  let contents
  try {
    const stat = fs.statSync(absolute)
    if (!stat.isFile() || stat.size > 4_000_000) continue
    contents = fs.readFileSync(absolute, 'utf8')
  } catch {
    continue
  }
  const lines = contents.split('\n')
  for (const [pattern, label] of PATTERNS) {
    for (const [index, line] of lines.entries()) {
      if (!pattern.test(line)) continue
      /* Placeholders and the patterns in this file itself are not secrets. */
      if (/EXAMPLE|PLACEHOLDER|REDACTED|\$\{|<your|xxxx/i.test(line)) continue
      if (relative === 'scripts/check-secrets.mjs') continue
      findings.push(`${relative}:${index + 1}: possible ${label}`)
    }
  }
}

if (findings.length) {
  console.error(`${findings.length} possible secret(s) in tracked files:\n${findings.join('\n')}`)
  console.error('\nIf a match is a false positive, narrow the pattern in scripts/check-secrets.mjs.')
  process.exit(1)
}

console.log(`No credential-shaped strings in ${files.length} tracked files.`)
