import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { content } from '../src/content'

const read = (path: string) => readFileSync(path, 'utf8')
const norm = (value: string) => value.replace(/[’']/g, "'").trim()
const listed = new Set(content.tr.books.books.map((book) => norm(book.title)))

/* The site-wide JSON-LD once named "Sosyal Demokrasi Açısından Kürt Sorunu"
   (1992) as his book; it is a joint collection, not on the Books page. */
describe('the book list has one source', () => {
  it('index.html names only books the Books page lists', () => {
    const names = [...read('index.html').matchAll(/"@type":\s*"Book",\s*"name":\s*"([^"]+)"/g)].map(
      (match) => norm(match[1]!),
    )
    expect(names.length).toBeGreaterThan(0)
    for (const name of names) expect(listed.has(name), name).toBe(true)
  })

  it('llms.txt selects only books the Books page lists', () => {
    const section = read('public/llms.txt').split('## Selected works')[1]!.split('\n## ')[0]!
    const names = [...section.matchAll(/^- (.+?) \(\d{4}\)/gm)].map((match) => norm(match[1]!))
    expect(names.length).toBeGreaterThan(0)
    for (const name of names) expect(listed.has(name), name).toBe(true)
  })

  it('both languages list the same books in the same order', () => {
    expect(content.en.books.books.map((book) => book.title)).toEqual(
      content.tr.books.books.map((book) => book.title),
    )
  })
})
