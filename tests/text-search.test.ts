import { describe, expect, it, beforeEach } from 'vitest'
import { foldSearchText } from '../src/textUtils'
import { clearFoldedTextCache, matchesFilters } from '../src/archive/query'
import { makeItem } from './helpers'

const NO_BODIES: ReadonlyMap<string, string[]> = new Map()

describe('foldSearchText', () => {
  it('folds the dotted capital İ so "İstanbul" contains "istanbul"', () => {
    expect(foldSearchText('İstanbul')).toBe('istanbul')
  })

  it('folds the dotless capital I so "IŞIK" contains "isik"', () => {
    expect(foldSearchText('IŞIK')).toBe('isik')
  })

  it('lets a keyboard without Turkish letters match "Gülen"', () => {
    expect(foldSearchText('Gülen')).toContain(foldSearchText('gulen'))
  })

  it('strips the circumflex in "Hikâyem"', () => {
    expect(foldSearchText('Hikâyem')).toBe('hikayem')
  })

  it('leaves no combining marks behind', () => {
    expect(foldSearchText('İzmir').normalize('NFD')).toBe(foldSearchText('İzmir'))
  })
})

describe('matchesFilters — Turkish search', () => {
  beforeEach(() => {
    clearFoldedTextCache()
  })

  it('matches a title typed without Turkish characters', () => {
    const item = makeItem({ slug: 'a', title: 'Işık ve Gölge', date: '1 Ocak 2001' })
    expect(matchesFilters(item, 'isik', '', '', NO_BODIES)).toBe(true)
  })

  it('matches tags, not just the title', () => {
    const item = makeItem({
      slug: 'b',
      title: 'Bir yazı',
      date: '1 Ocak 2001',
      tags: ['darbe', 'anayasa'],
    })
    expect(matchesFilters(item, 'anayasa', '', '', NO_BODIES)).toBe(true)
  })

  it('does not match a word that appears nowhere in the item', () => {
    const item = makeItem({ slug: 'c', title: 'Bir yazı', date: '1 Ocak 2001' })
    expect(matchesFilters(item, 'zeplin', '', '', NO_BODIES)).toBe(false)
  })

  it('matches body text only once the body index carries it', () => {
    const item = makeItem({ slug: 'd', title: 'Başlık', date: '1 Ocak 2001', hasBody: true })
    expect(matchesFilters(item, 'müzakere', '', '', NO_BODIES)).toBe(false)

    clearFoldedTextCache()
    const withBody = new Map([[`${item.lang}:${item.id}`, ['Uzun bir müzakere süreci.']]])
    expect(matchesFilters(item, 'müzakere', '', '', withBody)).toBe(true)
  })
})

describe('matchesFilters — year range', () => {
  const item = makeItem({ slug: 'y', title: 'Yazı', date: '7 Kasım 2017' })

  it('keeps an item inside the range', () => {
    expect(matchesFilters(item, '', '2010', '2020', NO_BODIES)).toBe(true)
  })

  it('drops an item before the range', () => {
    expect(matchesFilters(item, '', '2018', '', NO_BODIES)).toBe(false)
  })

  it('drops an item after the range', () => {
    expect(matchesFilters(item, '', '', '2016', NO_BODIES)).toBe(false)
  })

  it('drops an undated item whenever a year filter is active', () => {
    const undated = makeItem({ slug: 'u', title: 'Tarihsiz' })
    expect(matchesFilters(undated, '', '1990', '', NO_BODIES)).toBe(false)
    expect(matchesFilters(undated, '', '', '', NO_BODIES)).toBe(true)
  })
})
