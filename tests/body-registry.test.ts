import { describe, expect, it, vi } from 'vitest'
import { makeItem } from './helpers'

/* Each case re-imports the module so the per-outlet promise cache and the
   resolved-body cache start empty. */
async function freshRegistry() {
  vi.resetModules()
  return import('../src/archive/bodyRegistry')
}

describe('loadArticleBody', () => {
  it('returns an inline body without touching a loader', async () => {
    const { loadArticleBody } = await freshRegistry()
    const item = makeItem({ slug: 'inline', title: 'T', body: ['Bir paragraf.'] })
    await expect(loadArticleBody(item)).resolves.toEqual(['Bir paragraf.'])
  })

  it('loads a split body through the registered outlet loader', async () => {
    const { loadArticleBody } = await freshRegistry()
    const item = makeItem(
      { slug: 'hocam-ve-dostum-tomas-hammara-veda', title: 'T', hasBody: true },
      { outlet: 'P24', outletKey: 'p24', category: 'columns' },
    )
    const body = await loadArticleBody(item)
    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeGreaterThan(0)
  })

  /* Both of these used to resolve to `undefined`, which the reader could not
     tell apart from a slow network — the article sat on "Yazı yükleniyor…"
     with no error and no retry. */
  it('rejects when the outlet has no registered loader', async () => {
    const { loadArticleBody, MissingArticleBodyError } = await freshRegistry()
    const item = makeItem(
      { slug: 'x', title: 'T', hasBody: true },
      { outlet: 'Yeni', outletKey: 'yeni-gazete', category: 'columns' },
    )
    await expect(loadArticleBody(item)).rejects.toBeInstanceOf(MissingArticleBodyError)
  })

  it('rejects when the outlet loads but has no body for that slug', async () => {
    const { loadArticleBody, MissingArticleBodyError } = await freshRegistry()
    const item = makeItem(
      { slug: 'bu-slug-yok', title: 'T', hasBody: true },
      { outlet: 'P24', outletKey: 'p24', category: 'columns' },
    )
    await expect(loadArticleBody(item)).rejects.toBeInstanceOf(MissingArticleBodyError)
  })
})

describe('loadOutletBodies', () => {
  it('caches a successful load so a repeat call is a no-op', async () => {
    const { loadOutletBodies, getCachedBody } = await freshRegistry()
    const item = makeItem(
      { slug: 'hocam-ve-dostum-tomas-hammara-veda', title: 'T', hasBody: true },
      { outlet: 'P24', outletKey: 'p24', category: 'columns' },
    )
    expect(getCachedBody(item)).toBeUndefined()
    await loadOutletBodies([item])
    expect(getCachedBody(item)).toBeDefined()
    await expect(loadOutletBodies([item])).resolves.toBeUndefined()
  })

  it('ignores items that have no full text at all', async () => {
    const { loadOutletBodies } = await freshRegistry()
    const scanOnly = makeItem(
      { slug: 'kupur', title: 'T', clippings: [{ src: '/a.webp' }] },
      { outlet: 'Zaman', outletKey: 'zaman', category: 'columns' },
    )
    await expect(loadOutletBodies([scanOnly])).resolves.toBeUndefined()
  })
})
