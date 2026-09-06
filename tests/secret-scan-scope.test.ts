/**
 * @vitest-environment node
 *
 * Integration coverage for the file set `npm run check:secrets` runs over,
 * against a throwaway Git repository rather than this one — so the tracked,
 * untracked and ignored cases can each be arranged deliberately.
 *
 * The literal below is synthetic and assembled from pieces, because this file
 * is itself scanned by the real run: a complete credential shape in the
 * source would be a finding. Exempting the file would hide a real mistake
 * made in it.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { listScannableFiles, scanRepository } from '../scripts/lib/secret-patterns.mjs'

const KEY = 'ghp_' + 'A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8'

let repo: string

function git(...args: string[]) {
  execFileSync('git', args, { cwd: repo, stdio: 'pipe' })
}

function write(relative: string, contents: string) {
  const target = path.join(repo, relative)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, contents)
}

beforeEach(() => {
  repo = fs.mkdtempSync(path.join(os.tmpdir(), 'secret-scan-'))
  git('init', '-q')
  git('config', 'user.email', 'test@example.invalid')
  git('config', 'user.name', 'Test')
})

afterEach(() => {
  fs.rmSync(repo, { recursive: true, force: true })
})

const found = (paths: string[]) => paths.map((p) => p.split(':')[0])

describe('scanRepository', () => {
  it('finds a key in a committed file', () => {
    write('committed.md', `token: ${KEY}\n`)
    git('add', '-A')
    git('commit', '-qm', 'add')
    expect(found(scanRepository(repo).findings)).toEqual(['committed.md'])
  })

  it('finds a key in a staged file', () => {
    write('staged.md', `token: ${KEY}\n`)
    git('add', '-A')
    expect(found(scanRepository(repo).findings)).toEqual(['staged.md'])
  })

  /* The regression this file exists for: the scan read `git ls-files`, so a
     run before `git add` was green and the same run after it failed. That is
     how a credential shape reached a commit in this repository. */
  it('finds a key in a file that has never been added', () => {
    write('untracked.md', `token: ${KEY}\n`)
    expect(found(scanRepository(repo).findings)).toEqual(['untracked.md'])
  })

  it('gives the same answer before and after staging', () => {
    write('same.md', `token: ${KEY}\n`)
    const before = scanRepository(repo).findings
    git('add', '-A')
    const after = scanRepository(repo).findings
    expect(before).toEqual(after)
    expect(before).toHaveLength(1)
  })

  it('leaves a gitignored file alone', () => {
    write('.gitignore', 'secrets/\n')
    write('secrets/key.md', `token: ${KEY}\n`)
    git('add', '.gitignore')
    git('commit', '-qm', 'ignore')
    expect(scanRepository(repo).findings).toEqual([])
  })

  it('skips binary content whatever the extension claims', () => {
    write('fake.txt', `${String.fromCharCode(0)}binary ${KEY}\n`)
    const result = scanRepository(repo)
    expect(result.findings).toEqual([])
    expect(result.skipped).toContain('fake.txt')
  })

  it('skips files by extension without reading them', () => {
    write('scan.webp', `not really an image ${KEY}\n`)
    const result = scanRepository(repo)
    expect(result.findings).toEqual([])
    expect(result.skipped).toContain('scan.webp')
  })

  it('honours the exclude list, and still counts the file as scanned', () => {
    write('patterns.mjs', `const p = '${KEY}'\n`)
    const result = scanRepository(repo, { exclude: ['patterns.mjs'] })
    expect(result.findings).toEqual([])
    expect(result.scanned).toBe(1)
  })

  it('reports every offending file, not the first', () => {
    write('a.md', `token: ${KEY}\n`)
    write('b.md', `token: ${KEY}\n`)
    expect(found(scanRepository(repo).findings).sort()).toEqual(['a.md', 'b.md'])
  })

  it('finds nothing in a clean repository', () => {
    write('readme.md', 'Şahin Alpay — 576 kayıt\n')
    git('add', '-A')
    git('commit', '-qm', 'clean')
    const result = scanRepository(repo)
    expect(result.findings).toEqual([])
    expect(result.scanned).toBe(1)
  })
})

describe('listScannableFiles', () => {
  it('lists tracked and untracked files, but not ignored ones', () => {
    write('.gitignore', 'ignored.md\n')
    write('tracked.md', 'a\n')
    git('add', '.gitignore', 'tracked.md')
    git('commit', '-qm', 'init')
    write('untracked.md', 'b\n')
    write('ignored.md', 'c\n')
    expect(listScannableFiles(repo).sort()).toEqual([
      '.gitignore',
      'tracked.md',
      'untracked.md',
    ])
  })
})
