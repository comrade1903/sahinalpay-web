import { describe, expect, it } from 'vitest'
import {
  normalizeArchiveItems,
  slugFromSourceUrl,
  slugify,
} from '../src/archive/utils'
import type { ArchiveItemSeed } from '../src/archive/types'
import {
  archiveSlugAliases,
  isRetiredSlug,
  resolveArchiveSlug,
} from '../src/archive/aliases'

describe('slugify', () => {
  it('folds Turkish letters to ASCII', () => {
    expect(slugify('Işık ve Gölge')).toBe('isik-ve-golge')
    expect(slugify('Çağdaş Şehir')).toBe('cagdas-sehir')
  })

  it('drops quotes rather than turning them into separators', () => {
    expect(slugify('Türkiye’nin "yolu"')).toBe('turkiyenin-yolu')
  })

  it('never leaves leading or trailing separators', () => {
    expect(slugify('  — Başlangıç —  ')).toBe('baslangic')
  })
})

describe('slugFromSourceUrl', () => {
  it('takes the last path segment', () => {
    expect(slugFromSourceUrl('https://example.org/a/b/bir-yazi')).toBe('bir-yazi')
  })

  it('ignores a trailing slash', () => {
    expect(slugFromSourceUrl('https://example.org/a/bir-yazi/')).toBe('bir-yazi')
  })
})

/* Permalinks are the whole point of the archive: a citation has to keep
   resolving. These pin the derivation rules so a future refactor cannot
   quietly re-slug anything. */
describe('normalizeArchiveItems — permalink derivation', () => {
  const normalize = (seed: ArchiveItemSeed) =>
    normalizeArchiveItems('Zaman', 'zaman', 'columns', [seed], 'tr')[0]!

  it('prefers an explicit slug over the URL and the title', () => {
    const item = normalize({
      slug: 'sabit-slug',
      title: 'Bambaşka Bir Başlık',
      url: 'https://example.org/farkli-slug',
    })
    expect(item.slug).toBe('sabit-slug')
    expect(item.id).toBe('columns-sabit-slug')
  })

  it('falls back to the source URL when no slug is given', () => {
    expect(normalize({ title: 'Başlık', url: 'https://example.org/x/url-slug' }).slug).toBe(
      'url-slug',
    )
  })

  it('falls back to the slugified title when there is neither', () => {
    expect(normalize({ title: 'Işık ve Gölge' }).slug).toBe('isik-ve-golge')
  })

  it('prefers an explicit id over the derived one', () => {
    expect(normalize({ id: 'kalici-kimlik', slug: 's', title: 'T' }).id).toBe(
      'kalici-kimlik',
    )
  })

  it('carries every seed field through untouched', () => {
    const seed: ArchiveItemSeed = {
      slug: 's',
      title: 'T',
      date: '7 Kasım 2017',
      url: 'https://example.org/s',
      archiveUrl: 'https://web.archive.org/web/2018/https://example.org/s',
      subtitle: 'Alt başlık',
      excerpt: 'Özet',
      sourceNote: 'Kaynak',
      imageCredit: 'Foto',
      tags: ['etiket'],
      pdfSrc: '/archive/pdf/s.pdf',
      pdfPageCount: 3,
      pieceKind: 'interview',
      hasBody: true,
      clippings: [{ src: '/archive/clippings/s/page-1.webp', pageLabel: 's. 5' }],
    }
    expect(normalize(seed)).toMatchObject(seed)
  })

  it('stamps language, outlet and category onto every item', () => {
    const item = normalize({ slug: 's', title: 'T' })
    expect(item).toMatchObject({
      lang: 'tr',
      outlet: 'Zaman',
      outletKey: 'zaman',
      category: 'columns',
    })
  })
})

describe('retired slug aliases', () => {
  it('resolves a live slug to itself', () => {
    expect(resolveArchiveSlug('tr', 'baslarken')).toBe('baslarken')
  })

  it('reports a live slug as not retired', () => {
    expect(isRetiredSlug('tr', 'baslarken')).toBe(false)
  })

  /* The table is empty today; these pin the contract so the first real
     rename cannot silently break a citation. */
  it('follows an alias to the current permalink', () => {
    const table = { ...archiveSlugAliases.tr }
    try {
      archiveSlugAliases.tr['eski-slug'] = 'baslarken'
      expect(resolveArchiveSlug('tr', 'eski-slug')).toBe('baslarken')
      expect(isRetiredSlug('tr', 'eski-slug')).toBe(true)
      expect(isRetiredSlug('en', 'eski-slug')).toBe(false)
    } finally {
      for (const key of Object.keys(archiveSlugAliases.tr)) delete archiveSlugAliases.tr[key]
      Object.assign(archiveSlugAliases.tr, table)
    }
  })
})
