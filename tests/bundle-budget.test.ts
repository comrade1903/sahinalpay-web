import { describe, expect, it } from 'vitest'
import { gzipKb, initialScripts } from '../scripts/lib/bundle-budget.mjs'

const html = `<head>
<script type="module" crossorigin src="/assets/index-AAAAAAAA.js"></script>
<link rel="modulepreload" crossorigin href="/assets/vendor-BBBBBBBB.js">
<link rel="stylesheet" crossorigin href="/assets/index-CCCCCCCC.css">
<link rel="modulepreload" crossorigin href="/assets/motion-DDDDDDDD.js">
</head>`

describe('bundle budget', () => {
  it('finds the entry and its preloaded modules, not the stylesheet', () => {
    expect(initialScripts(html)).toEqual([
      'assets/index-AAAAAAAA.js',
      'assets/vendor-BBBBBBBB.js',
      'assets/motion-DDDDDDDD.js',
    ])
  })
  /* The theme script in <head> is a classic script, not part of the bundle. */
  it('ignores classic scripts and structured data', () => {
    const page = `<script src="/theme-init.js"></script><script type="application/ld+json">{}</script>${html}`
    expect(initialScripts(page)).toHaveLength(3)
  })
  it('measures gzip size in kB', () => {
    expect(gzipKb(Buffer.alloc(1024 * 100))).toBeLessThan(1)
    expect(gzipKb(Buffer.from('a'))).toBeGreaterThan(0)
  })
})
