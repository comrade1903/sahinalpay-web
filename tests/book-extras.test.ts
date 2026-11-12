import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { bookExtras, withExtras } from '../src/bookExtras'
import { content } from '../src/content'
import { trialSections } from '../src/trialCopy'

/* The trial record and the forewords used to sit in content.ts, which the
   header and footer import, so every visitor downloaded them on every page. */
describe('heavy copy stays out of content.ts', () => {
  it('content.ts imports neither the trial record nor the forewords', () => {
    const source = readFileSync('src/content.ts', 'utf8')
    for (const module of ['./trialProcess', './bookForewords', './bookPress'])
      expect(source).not.toMatch(new RegExp(`from '${module.replace('.', '\\.')}'`))
  })

  it('attaches forewords and translations only to books that exist', () => {
    for (const lang of ['tr', 'en'] as const) {
      const titles = new Set(content[lang].books.books.map((book) => book.title))
      expect(Object.keys(bookExtras[lang]).length).toBeGreaterThan(0)
      for (const title of Object.keys(bookExtras[lang])) expect(titles.has(title), title).toBe(true)
    }
  })

  it('gives both languages the same extras, forewords in the reader’s order', () => {
    expect(Object.keys(bookExtras.en)).toEqual(Object.keys(bookExtras.tr))
    const [tr] = withExtras(content.tr.books.books, 'tr').filter((b) => b.title.startsWith('Turkar'))
    const [en] = withExtras(content.en.books.books, 'en').filter((b) => b.title.startsWith('Turkar'))
    expect(tr!.forewords!.map((f) => f.lang)).toEqual([...en!.forewords!.map((f) => f.lang)].reverse())
  })

  it('keeps the trial sections for both languages', () => {
    expect(trialSections.tr.length).toBeGreaterThan(20)
    expect(trialSections.en).toHaveLength(1)
  })
})
