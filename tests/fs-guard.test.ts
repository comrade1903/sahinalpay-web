/**
 * @vitest-environment node
 *
 * scripts/lib/fs-guard.mjs guards the output paths the content tools build
 * from data they do not control — a manifest entry, a filename taken from a
 * remote URL, a CLI flag.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  PathGuardError,
  ensureInside,
  openAtomicTarget,
  safeFileName,
  safeJoin,
  writeFileAtomic,
} from '../scripts/lib/fs-guard.mjs'

let base: string

beforeEach(() => {
  base = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-guard-'))
})

afterEach(() => {
  fs.rmSync(base, { recursive: true, force: true })
})

describe('ensureInside', () => {
  it('accepts a path inside the base, and the base itself', () => {
    expect(ensureInside(base, 'a/b.txt')).toBe(path.join(base, 'a/b.txt'))
    expect(ensureInside(base, '.')).toBe(path.resolve(base))
  })

  it('refuses traversal out of the base', () => {
    for (const target of ['../x', 'a/../../x', '../../../etc/passwd', '/etc/passwd']) {
      expect(() => ensureInside(base, target), target).toThrow(PathGuardError)
    }
  })

  /* A sibling whose name merely starts with the base's is outside it:
     /tmp/base-evil is not under /tmp/base. */
  it('refuses a sibling whose name shares the base as a prefix', () => {
    expect(() => ensureInside(base, `${base}-evil/x`)).toThrow(PathGuardError)
  })

  it('safeJoin refuses the same escapes', () => {
    expect(safeJoin(base, 'a', 'b.txt')).toBe(path.join(base, 'a/b.txt'))
    expect(() => safeJoin(base, '..', 'x')).toThrow(PathGuardError)
  })
})

describe('safeFileName', () => {
  it('keeps an ordinary name', () => {
    expect(safeFileName('asd_02.pdf')).toBe('asd_02.pdf')
  })

  it('reduces a remote path to its last segment', () => {
    expect(safeFileName('../../../etc/passwd')).toBe('passwd')
    expect(safeFileName('a/b/c/report.pdf')).toBe('report.pdf')
    expect(safeFileName('a\\b\\c\\report.pdf')).toBe('report.pdf')
  })

  it('refuses names that resolve to nothing usable', () => {
    for (const name of ['', '   ', '.', '..', '/', '...', null, undefined]) {
      expect(() => safeFileName(name as string), JSON.stringify(name)).toThrow(PathGuardError)
    }
  })

  it('strips control characters', () => {
    expect(safeFileName(`re${String.fromCharCode(1)}port${String.fromCharCode(127)}.pdf`)).toBe(
      'report.pdf',
    )
  })

  it('bounds the length but keeps the extension', () => {
    const name = safeFileName(`${'a'.repeat(400)}.pdf`)
    expect(name.length).toBeLessThanOrEqual(180)
    expect(name.endsWith('.pdf')).toBe(true)
  })
})

describe('atomic writes', () => {
  it('writes through a temp file and leaves none behind', () => {
    const target = path.join(base, 'out.txt')
    writeFileAtomic(target, 'content')
    expect(fs.readFileSync(target, 'utf8')).toBe('content')
    expect(fs.readdirSync(base).filter((f) => f.includes('.tmp-'))).toEqual([])
  })

  it('leaves the previous content in place when a write is discarded', () => {
    const target = path.join(base, 'out.txt')
    writeFileAtomic(target, 'original')
    const pending = openAtomicTarget(target)
    fs.writeFileSync(pending.tempPath, 'half-written')
    pending.discard()
    expect(fs.readFileSync(target, 'utf8')).toBe('original')
    expect(fs.readdirSync(base).filter((f) => f.includes('.tmp-'))).toEqual([])
  })

  it('replaces the file only on commit', () => {
    const target = path.join(base, 'out.txt')
    writeFileAtomic(target, 'original')
    const pending = openAtomicTarget(target)
    fs.writeFileSync(pending.tempPath, 'replacement')
    expect(fs.readFileSync(target, 'utf8')).toBe('original')
    pending.commit()
    expect(fs.readFileSync(target, 'utf8')).toBe('replacement')
  })
})
