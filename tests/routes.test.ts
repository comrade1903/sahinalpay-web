import { describe, expect, it } from 'vitest'
import { equivalentPath, langForPath, pageKeyForPath, paths } from '../src/routes'
import { readerBasePath } from '../src/archive/links'
import type { ArchiveItem } from '../src/archive/types'

describe('readerBasePath', () => {
  const item = (category: ArchiveItem['category'], lang: 'tr' | 'en') =>
    ({ category, lang }) as ArchiveItem

  it('keeps a column, interview or academic article under the page language', () => {
    expect(readerBasePath(item('academic', 'en'), 'tr')).toBe('/akademik-makaleler')
    expect(readerBasePath(item('academic', 'tr'), 'en')).toBe('/en/academic-articles')
    expect(readerBasePath(item('interviews', 'tr'), 'en')).toBe('/en/interviews')
    expect(readerBasePath(item('columns', 'en'), 'tr')).toBe('/kose-yazilari')
  })

  it('sends analyses to their own language', () => {
    expect(readerBasePath(item('analyses', 'tr'), 'en')).toBe('/analizler')
  })
})

describe('langForPath', () => {
  /* Turkish is at the root since 2026-11-12; English lives under /en. */
  it('treats the root and everything outside /en as Turkish', () => {
    expect(langForPath('/')).toBe('tr')
    expect(langForPath('/kose-yazilari')).toBe('tr')
    expect(langForPath('/kose-yazilari/bir-yazi')).toBe('tr')
  })

  it('treats /en and its children as English', () => {
    expect(langForPath('/en')).toBe('en')
    expect(langForPath('/en/columns')).toBe('en')
  })

  it('does not mistake a path that merely starts with the letters "en"', () => {
    expect(langForPath('/english')).toBe('tr')
    expect(langForPath('/enstitu')).toBe('tr')
  })
})

describe('pageKeyForPath', () => {
  it('maps each language’s own wording to the same page key', () => {
    expect(pageKeyForPath('/en/columns')).toBe('columns')
    expect(pageKeyForPath('/kose-yazilari')).toBe('columns')
    expect(pageKeyForPath('/akademik-makaleler')).toBe('academic')
  })

  it('maps an article route to its section', () => {
    expect(pageKeyForPath('/kose-yazilari/bir-yazi')).toBe('columns')
  })

  it('falls back to home for an unknown path', () => {
    expect(pageKeyForPath('/nope')).toBe('home')
  })
})

describe('equivalentPath', () => {
  it('switches language while staying on the same page', () => {
    expect(equivalentPath('/en/columns', 'tr')).toBe('/kose-yazilari')
    expect(equivalentPath('/kimdir', 'en')).toBe('/en/about')
  })

  it('is an involution across the two languages for every shared page', () => {
    for (const [key, enPath] of Object.entries(paths.en)) {
      if (!paths.tr[key as keyof typeof paths.tr]) continue
      const trPath = equivalentPath(enPath, 'tr')
      expect(equivalentPath(trPath, 'en')).toBe(enPath)
    }
  })

  it('keeps a column open across languages', () => {
    expect(equivalentPath('/en/columns/a-new-victory-for-democracy', 'tr')).toBe(
      '/kose-yazilari/a-new-victory-for-democracy',
    )
    expect(equivalentPath('/kose-yazilari/baslarken', 'en')).toBe('/en/columns/baslarken')
  })

  it('keeps an interview open across languages', () => {
    expect(equivalentPath('/soylesiler/bir-soylesi', 'en')).toBe('/en/interviews/bir-soylesi')
  })

  it('keeps an academic article open across languages', () => {
    expect(equivalentPath('/en/academic-articles/making-sense-of-turkish-politics-2008', 'tr')).toBe(
      '/akademik-makaleler/making-sense-of-turkish-politics-2008',
    )
    expect(equivalentPath('/akademik-makaleler/mukayeseli-acidan-turkiyede-laiklik-2002', 'en')).toBe(
      '/en/academic-articles/mukayeseli-acidan-turkiyede-laiklik-2002',
    )
  })

  it('falls back to the target language home for an unknown path', () => {
    expect(equivalentPath('/nope', 'tr')).toBe('/')
  })
})

describe('path table integrity', () => {
  it('gives every page key a distinct path within a language', () => {
    for (const lang of ['tr', 'en'] as const) {
      const values = Object.values(paths[lang])
      expect(new Set(values).size).toBe(values.length)
    }
  })

  it('prefixes every English path with /en and no Turkish one', () => {
    for (const path of Object.values(paths.en)) {
      expect(path === '/en' || path.startsWith('/en/')).toBe(true)
    }
    for (const path of Object.values(paths.tr)) {
      expect(path === '/en' || path.startsWith('/en/')).toBe(false)
    }
  })
})
