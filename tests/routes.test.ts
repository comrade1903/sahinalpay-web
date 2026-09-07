import { describe, expect, it } from 'vitest'
import { equivalentPath, langForPath, pageKeyForPath, paths } from '../src/routes'

describe('langForPath', () => {
  it('treats /tr and its children as Turkish', () => {
    expect(langForPath('/tr')).toBe('tr')
    expect(langForPath('/tr/kose-yazilari')).toBe('tr')
    expect(langForPath('/tr/kose-yazilari/bir-yazi')).toBe('tr')
  })

  it('treats everything else as English', () => {
    expect(langForPath('/')).toBe('en')
    expect(langForPath('/columns')).toBe('en')
  })

  /* "/translations" starts with "/tr" as a string but is not the Turkish tree. */
  it('does not mistake a path that merely starts with the letters "tr"', () => {
    expect(langForPath('/translations')).toBe('en')
  })
})

describe('pageKeyForPath', () => {
  it('maps each language’s own wording to the same page key', () => {
    expect(pageKeyForPath('/columns')).toBe('columns')
    expect(pageKeyForPath('/tr/kose-yazilari')).toBe('columns')
    expect(pageKeyForPath('/tr/akademik-makaleler')).toBe('academic')
  })

  it('maps an article route to its section', () => {
    expect(pageKeyForPath('/tr/kose-yazilari/bir-yazi')).toBe('columns')
  })

  it('falls back to home for an unknown path', () => {
    expect(pageKeyForPath('/nope')).toBe('home')
  })
})

describe('equivalentPath', () => {
  it('switches language while staying on the same page', () => {
    expect(equivalentPath('/columns', 'tr')).toBe('/tr/kose-yazilari')
    expect(equivalentPath('/tr/kimdir', 'en')).toBe('/about')
  })

  it('is an involution across the two languages for every shared page', () => {
    for (const [key, enPath] of Object.entries(paths.en)) {
      if (!paths.tr[key as keyof typeof paths.tr]) continue
      const trPath = equivalentPath(enPath, 'tr')
      expect(equivalentPath(trPath, 'en')).toBe(enPath)
    }
  })

  it('falls back to the target language home for an unknown path', () => {
    expect(equivalentPath('/nope', 'tr')).toBe('/tr')
  })
})

describe('path table integrity', () => {
  it('gives every page key a distinct path within a language', () => {
    for (const lang of ['tr', 'en'] as const) {
      const values = Object.values(paths[lang])
      expect(new Set(values).size).toBe(values.length)
    }
  })

  it('prefixes every Turkish path with /tr', () => {
    for (const path of Object.values(paths.tr)) {
      expect(path === '/tr' || path.startsWith('/tr/')).toBe(true)
    }
  })
})
