import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/* Tests run from the project root; `import.meta.url` is not a file URL here. */
const css = readFileSync('src/index.css', 'utf8')

describe('layout guards', () => {
  /* Measured 2026-11-10: the footer started inside the first viewport and was
     pushed out when the archive arrived — CLS 0.37 on the columns page. */
  it('keeps the footer below the fold while a page loads', () => {
    expect(css).toMatch(/#main-content\s*\{[^}]*min-height:\s*100dvh/)
  })

  /* Measured 2026-11-10: the book links were 21–27px high on a phone. */
  it('gives a book link a full-height touch target', () => {
    expect(css).toMatch(/\.book-buy\s*\{[^}]*min-height:\s*var\(--control-hit-size\)/)
  })

  it('has a print stylesheet that drops the site chrome', () => {
    const print = css.slice(css.lastIndexOf('@media print'))
    expect(css).toContain('@media print')
    for (const selector of ['.site-header', '.site-footer', '.cookie-notice', '.article-tools'])
      expect(print).toContain(selector)
  })
})
