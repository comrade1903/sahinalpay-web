import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { resetRouteJsonLdState, usePageMeta, useJsonLd } from '../src/lib/seo'
import {
  ROUTE_JSONLD_ATTR,
  articleJsonLd,
  sectionNameFor,
  type JsonLd,
} from '../src/lib/structuredData'
import { makeItem } from './helpers'

function routeBlocks() {
  return [...document.querySelectorAll(`script[${ROUTE_JSONLD_ATTR}]`)]
}

function parsedBlocks() {
  return routeBlocks().map((block) => JSON.parse(block.textContent ?? '{}') as JsonLd)
}

/** Stands in for a prerendered page: the block scripts/prerender.mjs writes,
 *  with no id, describing the URL the document was served for. */
function plantPrerenderedBlock(data: JsonLd) {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.setAttribute(ROUTE_JSONLD_ATTR, 'true')
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

function Article({ slug, title }: { slug: string; title: string }) {
  const item = makeItem({ slug, title, date: '7 Kasım 2017', hasBody: true })
  usePageMeta({ title: `${title} — Şahin Alpay`, description: title })
  useJsonLd(
    'article',
    articleJsonLd({
      item,
      lang: 'tr',
      articleUrl: `https://sahinalpay.com/tr/kose-yazilari/${slug}`,
      sectionUrl: 'https://sahinalpay.com/tr/kose-yazilari',
      sectionName: sectionNameFor('tr', 'columns'),
    }),
  )
  return <p>{title}</p>
}

function PlainPage() {
  usePageMeta({ title: 'Çerez Politikası', description: 'x' })
  return <p>plain</p>
}

beforeEach(() => {
  resetRouteJsonLdState('/served-from-here')
})

afterEach(() => {
  for (const block of routeBlocks()) block.remove()
})

describe('route-scoped JSON-LD', () => {
  /* The regression: the prerendered block was a different element from the one
     the client created, so a freshly loaded article carried two Article
     descriptions with different fields. */
  it('adopts the prerendered block instead of adding a second one', () => {
    plantPrerenderedBlock({ '@type': 'Article', headline: 'A', description: 'static' })
    render(
      <MemoryRouter initialEntries={['/tr/kose-yazilari/a']}>
        <Routes>
          <Route path="/tr/kose-yazilari/:slug" element={<Article slug="a" title="A" />} />
        </Routes>
      </MemoryRouter>,
    )
    const blocks = parsedBlocks()
    expect(blocks).toHaveLength(1)
    expect(blocks[0]?.headline).toBe('A')
    expect(blocks[0]?.['@context']).toBe('https://schema.org')
  })

  /* And nothing removed it on a client navigation, so after moving from
     article A to article B the head still described A. */
  it('describes only the current article after navigating between two', () => {
    plantPrerenderedBlock({ '@type': 'Article', headline: 'A', description: 'static' })
    const view = render(<Article slug="a" title="A" />, { wrapper: MemoryRouter })
    expect(parsedBlocks().map((b) => b.headline)).toEqual(['A'])

    view.rerender(<Article slug="b" title="B" />)
    const blocks = parsedBlocks()
    expect(blocks).toHaveLength(1)
    expect(blocks[0]?.headline).toBe('B')
  })

  it('removes a stale prerendered block on a page that has none of its own', () => {
    plantPrerenderedBlock({ '@type': 'Article', headline: 'A' })
    render(
      <MemoryRouter initialEntries={['/tr/cerez-politikasi']}>
        <PlainPage />
      </MemoryRouter>,
    )
    expect(routeBlocks()).toHaveLength(0)
  })

  it('leaves the site-wide graphs in index.html alone', () => {
    const siteWide = document.createElement('script')
    siteWide.type = 'application/ld+json'
    siteWide.textContent = JSON.stringify({ '@type': 'Person', name: 'Şahin Alpay' })
    document.head.appendChild(siteWide)
    try {
      render(<Article slug="a" title="A" />, { wrapper: MemoryRouter })
      expect(document.head.contains(siteWide)).toBe(true)
      expect(routeBlocks()).toHaveLength(1)
    } finally {
      siteWide.remove()
    }
  })
})

describe('sectionNameFor', () => {
  it('names each section the way its own page does', () => {
    expect(sectionNameFor('tr', 'columns')).toBe('Köşe Yazıları')
    expect(sectionNameFor('tr', 'analyses')).toBe('Analizler')
    expect(sectionNameFor('tr', 'interviews')).toBe('Söyleşiler')
    expect(sectionNameFor('en', 'columns')).toBe('Columns')
  })

  /* The client used to file every article under the columns title, so an
     analysis said it was part of "Köşe Yazıları". */
  it('does not file an analysis under the columns section', () => {
    expect(sectionNameFor('tr', 'analyses')).not.toBe(sectionNameFor('tr', 'columns'))
  })
})

describe('articleJsonLd', () => {
  it('publishes a date only at the precision the source carries', () => {
    const item = makeItem({ slug: 'a', title: 'A', date: 'Ekim 1969' })
    const data = articleJsonLd({
      item,
      lang: 'tr',
      articleUrl: 'https://x/a',
      sectionUrl: 'https://x',
      sectionName: 'S',
    })
    expect(data.datePublished).toBe('1969-10')
  })

  it('omits datePublished entirely for an undated piece', () => {
    const item = makeItem({ slug: 'a', title: 'A' })
    const data = articleJsonLd({
      item,
      lang: 'tr',
      articleUrl: 'https://x/a',
      sectionUrl: 'https://x',
      sectionName: 'S',
    })
    expect('datePublished' in data).toBe(false)
  })
})
