import type { ArchiveCategory, ArchiveItem } from '../archive/types'
import { content, type Lang } from '../content'
import { isoDateAtKnownPrecision } from '../dateUtils'
import { PERSON_ID, SITE_ORIGIN, WEBSITE_ID, siteUrl } from '../siteConfig'

/**
 * The site's JSON-LD, built in one place.
 *
 * Two producers emit it: `scripts/prerender.mjs` writes it into each static
 * HTML file, and `useJsonLd` writes it after the SPA mounts. They used to
 * build their own objects, so the same article could be described two
 * different ways in the same document — and, because the prerendered block
 * was not the element the client managed, navigating from one article to
 * another left the first one's description behind in the head.
 *
 * Both now call these builders, so the two cannot describe a page
 * differently, and both mark their output with ROUTE_JSONLD_ATTR so exactly
 * one route-scoped block exists at a time (see lib/seo.ts).
 *
 * The site-wide Person, WebSite and Book graphs live in index.html and are
 * not route-scoped — nothing here touches them.
 */

/** Marks the one JSON-LD block that describes the current route. */
export const ROUTE_JSONLD_ATTR = 'data-route-jsonld'

export type JsonLd = Record<string, unknown>

const person = { '@id': PERSON_ID }

const authorRef = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Şahin Alpay',
}

const publisherRef = {
  '@type': 'Organization',
  name: 'Şahin Alpay',
  url: `${SITE_ORIGIN}/`,
}

/** A listed article, as it appears inside a collection's `mainEntity`. */
function articleStub(item: ArchiveItem, url: string): JsonLd {
  const published = item.date ? isoDateAtKnownPrecision(item.date) : undefined
  return {
    '@type': 'Article',
    headline: item.title,
    ...(published ? { datePublished: published } : {}),
    url,
    author: person,
  }
}

/** The section an article belongs to, named the way that section's own page
 *  names itself. Shared so the static and client blocks cannot disagree —
 *  and so an analysis is not filed under "Köşe Yazıları", which is what the
 *  client's hard-coded `t.columns.title` used to say for every category. */
export function sectionNameFor(lang: Lang, category: ArchiveCategory): string {
  const copy = content[lang]
  if (category === 'analyses') return copy.analyses?.title ?? copy.columns.title
  if (category === 'interviews') return copy.interviews?.title ?? copy.columns.title
  if (category === 'academic') return copy.academicArticles?.title ?? copy.columns.title
  return copy.columns.title
}

export interface ArticleJsonLdInput {
  item: ArchiveItem
  lang: Lang
  /** Absolute URL of the article's own page. */
  articleUrl: string
  /** Absolute URL of the section the article belongs to. */
  sectionUrl: string
  /** Display name of that section. */
  sectionName: string
}

export function articleJsonLd({
  item,
  lang,
  articleUrl,
  sectionUrl,
  sectionName,
}: ArticleJsonLdInput): JsonLd {
  const published = item.date ? isoDateAtKnownPrecision(item.date) : undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    ...(item.subtitle ? { alternativeHeadline: item.subtitle } : {}),
    description: item.subtitle ?? item.excerpt ?? item.title,
    ...(published ? { datePublished: published } : {}),
    inLanguage: lang,
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    author: authorRef,
    publisher: publisherRef,
    isPartOf: {
      '@type': 'CollectionPage',
      name: sectionName,
      url: sectionUrl,
    },
  }
}

export interface BreadcrumbJsonLdInput {
  lang: Lang
  homeUrl: string
  sectionUrl: string
  sectionName: string
  articleUrl: string
  articleName: string
}

export function breadcrumbJsonLd({
  lang,
  homeUrl,
  sectionUrl,
  sectionName,
  articleUrl,
  articleName,
}: BreadcrumbJsonLdInput): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: lang === 'tr' ? 'Ana sayfa' : 'Home',
        item: homeUrl,
      },
      { '@type': 'ListItem', position: 2, name: sectionName, item: sectionUrl },
      { '@type': 'ListItem', position: 3, name: articleName, item: articleUrl },
    ],
  }
}

export interface CollectionJsonLdInput {
  name: string
  description: string
  lang: Lang
  url: string
  items: ArchiveItem[]
  /** Resolves an item's own page URL — the two languages word it differently. */
  itemUrl: (item: ArchiveItem) => string
}

/** Cap on how many listed pieces a collection page enumerates. */
export const COLLECTION_ITEM_LIMIT = 25

export function collectionJsonLd({
  name,
  description,
  lang,
  url,
  items,
  itemUrl,
}: CollectionJsonLdInput): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    inLanguage: lang,
    url,
    about: person,
    mainEntity: items
      .slice(0, COLLECTION_ITEM_LIMIT)
      .map((item) => articleStub(item, itemUrl(item))),
  }
}

export function profileJsonLd({
  name,
  description,
  lang,
  url,
}: {
  name: string
  description: string
  lang: Lang
  url: string
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${url}#page`,
    url,
    name,
    description,
    inLanguage: lang,
    isPartOf: { '@id': WEBSITE_ID },
    about: person,
    mainEntity: person,
  }
}

export function aboutJsonLd({
  name,
  description,
  lang,
  url,
}: {
  name: string
  description: string
  lang: Lang
  url: string
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url,
    name,
    description,
    inLanguage: lang,
    about: person,
  }
}

export function booksJsonLd({
  name,
  description,
  lang,
  url,
  books,
}: {
  name: string
  description: string
  lang: Lang
  url: string
  books: { title: string; year: string }[]
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url,
    name,
    description,
    inLanguage: lang,
    about: person,
    mainEntity: books.map((book) => ({
      '@type': 'Book',
      name: book.title,
      datePublished: book.year,
      inLanguage: 'tr',
      author: person,
    })),
  }
}

export { siteUrl }
