import { describe, expect, it } from 'vitest'
import { hubCount, hubNoun } from '../src/lib/hubCount'

const summary = {
  counts: { columns: { tr: 522, en: 138 }, analyses: 0, interviews: 11, academic: 24 },
  coverage: [],
}

describe('hubCount', () => {
  /* The columns page lists both languages, so its card must count both:
     the home page said 522 where the page itself said 660. */
  it('counts the columns of both languages', () => {
    expect(hubCount('columns', 8, summary)).toBe(660)
  })
  it('passes the other sections through', () => {
    expect(hubCount('interviews', 8, summary)).toBe(11)
    expect(hubCount('books', 8, summary)).toBe(8)
    expect(hubCount('about', 8, summary)).toBeNull()
    expect(hubCount('columns', 8, null)).toBeNull()
  })
  it('names each section by its own noun', () => {
    expect(hubNoun('interviews')).toBe('interview')
    expect(hubNoun('academic')).toBe('article')
    expect(hubNoun('books')).toBe('book')
    expect(hubNoun('columns')).toBe('piece')
  })
})
