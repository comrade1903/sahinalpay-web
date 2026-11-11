import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/* Tests run from the project root. */
const read = (path: string) => readFileSync(path, 'utf8')
const css = read('src/fonts.css')
const faces = [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((match) => match[1]!)
const face = (file: string) => faces.find((block) => block.includes(file))!
const covers = (block: string, char: string) => {
  const cp = char.codePointAt(0)!
  const range = /unicode-range:\s*([^;]+);/.exec(block)![1]!
  return range.split(',').some((part) => {
    const [from, to] = part.trim().replace('U+', '').split('-')
    return cp >= parseInt(from!, 16) && cp <= parseInt(to ?? from!, 16)
  })
}

describe('font slices', () => {
  /* Every page draws "Şahin Alpay", so a split that left Ş in the second file
     made every page download both. */
  it.each([...'ğĞıİşŞçÇöÖüÜâîû'])('draws %s from the main file', (char) => {
    for (const stem of ['literata', 'literata-italic', 'nunito-sans']) {
      expect(covers(face(`${stem}-latin.woff2`), char)).toBe(true)
      expect(covers(face(`${stem}-latin-ext.woff2`), char)).toBe(false)
    }
  })
  it('preloads exactly the addresses the stylesheet uses', () => {
    const preloads = [...read('index.html').matchAll(/href="(\/fonts\/[^"]+)"/g)].map((m) => m[1]!)
    expect(preloads.length).toBe(2)
    for (const href of preloads) expect(css).toContain(`url('${href}')`)
  })
})
