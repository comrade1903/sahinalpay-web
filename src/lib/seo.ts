import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import type { Lang } from '../content'
import { paths, pageKeyForPath, langForPath } from '../routes'
import { siteUrl } from '../siteConfig'
import { isoDateAtKnownPrecision } from '../dateUtils'

/**
 * Per-page document metadata and structured data.
 *
 * These hooks update the head after the SPA mounts. The same values are also
 * written into each page's static HTML at build time by
 * scripts/prerender.mjs, which is what a crawler or a reader without
 * JavaScript sees — the two must agree, so anything added here belongs there
 * too.
 */

export type PageMeta = {
  title: string
  description: string
  canonicalPath?: string
  alternates?: Partial<Record<Lang, string>>
  robots?: string
  type?: 'website' | 'article'
}

export function upsertMeta(selector: string, attrs: Record<string, string>) {
  let tag = document.querySelector(selector) as HTMLMetaElement | null
  if (!tag) {
    tag = document.createElement('meta')
    document.head.appendChild(tag)
  }
  Object.entries(attrs).forEach(([key, value]) => tag?.setAttribute(key, value))
}

export function usePageMeta(titleOrMeta: string | PageMeta, description?: string) {
  const location = useLocation()
  const meta =
    typeof titleOrMeta === 'string'
      ? { title: titleOrMeta, description: description ?? '' }
      : titleOrMeta
  const title = meta.title
  const metaDescription = meta.description
  const canonicalPath = meta.canonicalPath
  const robots = meta.robots
  const type = meta.type
  const alternatesKey = JSON.stringify(meta.alternates ?? {})

  useEffect(() => {
    const canonical = pageUrl(canonicalPath ?? location.pathname)
    const pageLang = langForPath(canonicalPath ?? location.pathname)
    document.title = title
    upsertMeta('meta[name="description"]', {
      name: 'description',
      content: metaDescription,
    })
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: robots ?? 'index,follow',
    })
    upsertMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: title,
    })
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: metaDescription,
    })
    upsertMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: type ?? 'website',
    })
    upsertMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: canonical,
    })
    upsertMeta('meta[property="og:locale"]', {
      property: 'og:locale',
      content: pageLang === 'tr' ? 'tr_TR' : 'en_US',
    })
    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary',
    })
    upsertMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: title,
    })
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: metaDescription,
    })

    let canonicalTag = document.querySelector('link[rel="canonical"]')
    if (!canonicalTag) {
      canonicalTag = document.createElement('link')
      canonicalTag.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalTag)
    }
    canonicalTag.setAttribute('href', canonical)

    document
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((tag) => tag.remove())
    const alternateEntries = Object.entries(
      JSON.parse(alternatesKey) as Partial<Record<Lang, string>>,
    )
    document
      .querySelectorAll('meta[property="og:locale:alternate"]')
      .forEach((tag) => tag.remove())
    alternateEntries
      .filter(([langCode]) => langCode !== pageLang)
      .forEach(([langCode]) => {
        const tag = document.createElement('meta')
        tag.setAttribute('property', 'og:locale:alternate')
        tag.setAttribute('content', langCode === 'tr' ? 'tr_TR' : 'en_US')
        document.head.appendChild(tag)
      })
    alternateEntries.forEach(([langCode, path]) => {
      const tag = document.createElement('link')
      tag.setAttribute('rel', 'alternate')
      tag.setAttribute('hreflang', langCode)
      tag.setAttribute('href', pageUrl(path))
      tag.setAttribute('data-route-alternate', 'true')
      document.head.appendChild(tag)
    })
    const englishPath = alternateEntries.find(([langCode]) => langCode === 'en')?.[1]
    if (englishPath) {
      const tag = document.createElement('link')
      tag.setAttribute('rel', 'alternate')
      tag.setAttribute('hreflang', 'x-default')
      tag.setAttribute('href', pageUrl(englishPath))
      tag.setAttribute('data-route-alternate', 'true')
      document.head.appendChild(tag)
    }
  }, [alternatesKey, canonicalPath, location.pathname, metaDescription, robots, title, type])
}

export function useJsonLd(id: string, data: Record<string, unknown> | null) {
  useEffect(() => {
    const scriptId = `jsonld-${id}`
    let tag = document.getElementById(scriptId) as HTMLScriptElement | null

    if (!data) {
      tag?.remove()
      return
    }

    if (!tag) {
      tag = document.createElement('script')
      tag.id = scriptId
      tag.type = 'application/ld+json'
      document.head.appendChild(tag)
    }
    tag.textContent = JSON.stringify(data)

    return () => {
      tag?.remove()
    }
  }, [id, data])
}

export function pageUrl(pathname: string) {
  return siteUrl(pathname)
}

/* Truncated to the precision the source actually carries: a piece dated only
   "Ekim 1969" publishes as `1969-10`, never as `1969-10-01` — the 1st is a
   sorting anchor, not something the archive knows. */
export function isoDateFromArchiveDate(date?: string): string | undefined {
  if (!date) return undefined
  return isoDateAtKnownPrecision(date)
}

export function pageAlternates(pathname: string): Partial<Record<Lang, string>> {
  const key = pageKeyForPath(pathname)
  const alternates: Partial<Record<Lang, string>> = {}
  if (paths.tr[key]) alternates.tr = paths.tr[key]
  if (paths.en[key]) alternates.en = paths.en[key]
  return alternates
}
