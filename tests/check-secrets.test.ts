/**
 * @vitest-environment node
 *
 * scripts/lib/secret-patterns.mjs is the matching half of `npm run
 * check:secrets`. Every literal below is synthetic — a shape, not a key.
 *
 * They are assembled from pieces rather than written whole, because this file
 * is itself scanned: a complete credential shape in the source would be a
 * finding, and the run would fail on its own test data. The value each test
 * actually matches against is unchanged. Exempting the whole file instead
 * would leave a real mistake here invisible.
 */
import { describe, expect, it } from 'vitest'
import { findSecrets, isPlaceholder, looksBinary } from '../scripts/lib/secret-patterns.mjs'

const REAL_GITHUB = 'ghp_' + 'A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8'
const PLACEHOLDER_GITHUB = 'ghp_' + 'EXAMPLE'.repeat(5) + '0'
const REAL_AWS = 'AKIA' + 'QRSTUVWX23456789'
const PLACEHOLDER_AWS = 'AKIA' + 'ZZ7QQ3EXAMPLE9AB'

describe('findSecrets', () => {
  it('finds a credential-shaped string on its own', () => {
    const found = findSecrets(`token: ${REAL_GITHUB}`)
    expect(found).toHaveLength(1)
    expect(found[0]?.label).toBe('GitHub token')
    expect(found[0]?.line).toBe(1)
  })

  /* The regression: only the first match per pattern per line was examined,
     so a placeholder at the start of a line hid a real key further along it. */
  it('finds a real key that follows a placeholder on the same line', () => {
    const found = findSecrets(`see ${PLACEHOLDER_GITHUB} for the format, real: ${REAL_GITHUB}`)
    expect(found).toHaveLength(1)
    expect(found[0]?.matched).toBe(REAL_GITHUB)
  })

  it('finds every real key on a line, not just one', () => {
    const second = 'ghp_' + 'Z9y8X7w6V5u4T3s2R1q0P9o8N7m6L5k4J3i2'
    const found = findSecrets(`${REAL_GITHUB} and ${second}`)
    expect(found.map((f) => f.matched)).toEqual([REAL_GITHUB, second])
  })

  it('reports the column, so two matches on a line are distinguishable', () => {
    const found = findSecrets(`x ${REAL_GITHUB} y ${REAL_AWS}`)
    expect(found).toHaveLength(2)
    expect(found[0]?.column).toBeLessThan(found[1]?.column ?? 0)
  })

  it('ignores a placeholder on its own', () => {
    expect(findSecrets(`template: ${PLACEHOLDER_GITHUB}`)).toEqual([])
    expect(findSecrets(`aws: ${PLACEHOLDER_AWS}`)).toEqual([])
  })

  /* The exemption applies to the matched text, not the line: a comment
     mentioning "example" must not excuse a real key beside it. */
  it('does not let the word "example" elsewhere on the line excuse a key', () => {
    const found = findSecrets(`# example configuration\nexport TOKEN=${REAL_GITHUB}`)
    expect(found).toHaveLength(1)
    expect(found[0]?.line).toBe(2)
  })

  it('ignores an interpolated reference', () => {
    expect(findSecrets('token: ${GITHUB_TOKEN}')).toEqual([])
  })

  it('recognises the other shapes it claims to', () => {
    const cases: [string, string][] = [
      ['-----BEGIN ' + 'OPENSSH PRIVATE KEY' + '-----', 'private key block'],
      [REAL_AWS, 'AWS access key id'],
      ['sk-ant-' + 'a1b2c3d4e5f6g7h8i9j0k1l2', 'Anthropic API key'],
      ['xoxb-' + '1234567890-abcdefghij', 'Slack token'],
      ['glpat-' + 'abcdefghij1234567890', 'GitLab token'],
      ['postgres://' + 'user:hunter2@' + 'db.internal:5432/app', 'database URL with a password'],
    ]
    for (const [text, label] of cases) {
      const found = findSecrets(`value=${text}`)
      expect(found.map((f) => f.label), text).toContain(label)
    }
  })

  it('finds nothing in ordinary prose or code', () => {
    expect(
      findSecrets('const slug = item.slug ?? slugify(item.title)\n// Şahin Alpay, 1944'),
    ).toEqual([])
  })

  it('reports line numbers over a multi-line file', () => {
    const found = findSecrets(`a\nb\nc\n${REAL_GITHUB}`)
    expect(found[0]?.line).toBe(4)
  })
})

describe('isPlaceholder', () => {
  it('recognises the markers it documents', () => {
    for (const value of ['ghp_EXAMPLE', 'PLACEHOLDER', 'redacted', 'YOUR_TOKEN', 'xxxxxxxx']) {
      expect(isPlaceholder(value), value).toBe(true)
    }
  })

  it('does not treat a plausible key as one', () => {
    expect(isPlaceholder(REAL_GITHUB)).toBe(false)
  })
})

describe('looksBinary', () => {
  it('spots a NUL byte in the first block', () => {
    expect(looksBinary(`PNG${String.fromCharCode(0)}data`)).toBe(true)
  })

  it('passes text through', () => {
    expect(looksBinary('Köşe Yazıları — 576 kayıt')).toBe(false)
  })
})
