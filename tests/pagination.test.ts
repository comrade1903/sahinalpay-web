import { describe, expect, it } from 'vitest'
import {
  ARCHIVE_PAGE_SIZE,
  clampPage,
  pageSlice,
  positivePage,
  sortItems,
  totalPagesFor,
  validSort,
  validSourceKind,
} from '../src/archive/query'
import { makeItem } from './helpers'

describe('URL parameter parsing', () => {
  it('falls back to page 1 for junk, zero and negative values', () => {
    for (const value of [null, '', 'abc', '0', '-3', '1.5e400']) {
      expect(positivePage(value)).toBe(1)
    }
  })

  it('keeps a valid page number', () => {
    expect(positivePage('7')).toBe(7)
  })

  it('normalises unknown sort and source values', () => {
    expect(validSort('sideways')).toBe('newest')
    expect(validSort('oldest')).toBe('oldest')
    expect(validSourceKind('paper')).toBe('all')
    expect(validSourceKind('clipping')).toBe('clipping')
  })
})

describe('pagination bounds', () => {
  const items = Array.from({ length: 45 }, (_, i) => `item-${i}`)

  it('reports the right number of pages', () => {
    expect(totalPagesFor(0)).toBe(1)
    expect(totalPagesFor(ARCHIVE_PAGE_SIZE)).toBe(1)
    expect(totalPagesFor(ARCHIVE_PAGE_SIZE + 1)).toBe(2)
    expect(totalPagesFor(45)).toBe(3)
  })

  it('caps a page number past the end onto the last real page', () => {
    expect(clampPage(99, items.length)).toBe(3)
  })

  it('never returns an empty slice for an over-large ?page= deep link', () => {
    expect(pageSlice(items, 99).length).toBe(5)
    expect(pageSlice(items, 99)[0]).toBe('item-40')
  })

  it('slices exactly one page worth of rows', () => {
    expect(pageSlice(items, 1)).toHaveLength(ARCHIVE_PAGE_SIZE)
    expect(pageSlice(items, 2)[0]).toBe(`item-${ARCHIVE_PAGE_SIZE}`)
  })

  it('handles an empty list', () => {
    expect(pageSlice([], 1)).toEqual([])
    expect(clampPage(1, 0)).toBe(1)
  })
})

describe('sortItems', () => {
  const items = [
    makeItem({ slug: 'b', title: 'B', date: '3 Mart 1990' }),
    makeItem({ slug: 'a', title: 'A', date: '7 Kasım 2017' }),
    makeItem({ slug: 'x', title: 'X' }),
    makeItem({ slug: 'c', title: 'C', date: 'Ekim 1969' }),
  ]

  it('orders newest first by default', () => {
    expect(sortItems(items, 'newest').map((i) => i.slug)).toEqual(['a', 'b', 'c', 'x'])
  })

  it('orders oldest first when asked', () => {
    expect(sortItems(items, 'oldest').map((i) => i.slug)).toEqual(['c', 'b', 'a', 'x'])
  })

  it('always sinks undated items to the end, in both directions', () => {
    expect(sortItems(items, 'newest').at(-1)?.slug).toBe('x')
    expect(sortItems(items, 'oldest').at(-1)?.slug).toBe('x')
  })

  it('does not mutate its input', () => {
    const before = items.map((i) => i.slug)
    sortItems(items, 'oldest')
    expect(items.map((i) => i.slug)).toEqual(before)
  })
})
