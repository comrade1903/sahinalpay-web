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
})
