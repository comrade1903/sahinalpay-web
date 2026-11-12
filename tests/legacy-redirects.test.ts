import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { paths } from '../src/routes'

type Redirect = { source: string; destination: string; permanent: boolean }
const redirects: Redirect[] = JSON.parse(readFileSync('vercel.json', 'utf8')).redirects
const find = (source: string) => redirects.find((r) => r.source === source)

/* Until 2026-11-12 English was at the root and Turkish under /tr. Those
   addresses are in citations and search indexes and must keep working. */
describe('addresses of the old layout', () => {
  it('sends /tr and everything under it to the root', () => {
    expect(find('/tr')).toMatchObject({ destination: '/', permanent: true })
    expect(find('/tr/:path*')).toMatchObject({ destination: '/:path*', permanent: true })
  })

  it('sends every old English page to the same page under /en', () => {
    for (const [key, current] of Object.entries(paths.en)) {
      if (key === 'home') continue
      const old = current.replace(/^\/en/, '')
      expect(find(old), old).toMatchObject({ destination: current, permanent: true })
    }
    expect(find('/columns/:slug')).toMatchObject({ destination: '/en/columns/:slug' })
  })

  /* Vercel applies redirects before files, so a rule whose source is a live
     page would make that page unreachable. */
  /* Their English item routes have no page of their own: they redirect. */
  const TURKISH_ONLY = new Set(['/en/analyses/:slug', '/en/about-me-in-the-press/:slug'])

  it('sends the English address of a Turkish-only piece to the Turkish page', () => {
    expect(find('/en/about-me-in-the-press/:slug')).toMatchObject({ destination: '/basinda-hakkimda/:slug' })
    expect(find('/about-me-in-the-press/:slug')).toMatchObject({ destination: '/basinda-hakkimda/:slug' })
    expect(find('/analyses/:slug')).toMatchObject({ destination: '/analizler/:slug' })
  })

  it('never shadows a current page', () => {
    const live = new Set([...Object.values(paths.tr), ...Object.values(paths.en)])
    for (const { source } of redirects) expect(live.has(source), source).toBe(false)
    const sections = [...Object.values(paths.tr), ...Object.values(paths.en)].filter((p) => p !== '/')
    for (const { source } of redirects.filter((r) => r.source.endsWith('/:slug')))
      expect(
        sections.includes(source.replace(/\/:slug$/, '')) && !TURKISH_ONLY.has(source),
        source,
      ).toBe(false)
  })
})
