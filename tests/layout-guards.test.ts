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

  /* Measured 2026-11-10: dates, counts and kickers were 12.2px on a phone.
     A root in px also ignored the reader's own browser font size. */
  it('sets the root size in percent so a larger browser default is honoured', () => {
    expect(css).toMatch(/font-size:\s*112\.5%/)
    expect(css).not.toMatch(/^\s*font-size:\s*1[78]px;/m)
  })
  it('keeps the smallest label at 14px or more', () => {
    expect(css).toMatch(/--text-label-sm:\s*0\.78rem/)
  })
  /* The audience skews older: nothing may move when the system asks for
     reduced motion, and nothing may stay hidden either. */
  it('shows revealed content without animation under reduced motion', () => {
    expect(css).toMatch(
      /prefers-reduced-motion: reduce\)\s*\{\s*\.reveal\s*\{[^}]*opacity:\s*1;[^}]*transition:\s*none/,
    )
  })
})
