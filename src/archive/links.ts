import type { Lang } from '../content'
import { paths } from '../routes'
import { itemScanClippings } from './itemUtils'
import type { ArchiveItem } from './types'

/**
 * Where a record's row points, and how its provenance is labelled.
 *
 * A record opens on its own reader page when it has body text or a scanned
 * clipping; otherwise the row links straight out to the source. This rule is
 * the sitemap's and the prerenderer's too — see
 * scripts/lib/archive-model.mjs, which mirrors it for the build.
 */

export function archiveBasePath(lang: Lang, item: { category: ArchiveItem['category'] }): string {
  switch (item.category) {
    case 'analyses':
      return paths[lang].analyses ?? paths[lang].columns!
    case 'interviews':
      return paths[lang].interviews ?? paths[lang].columns!
    case 'academic':
      return paths[lang].academic ?? paths[lang].columns!
    case 'columns':
      return paths[lang].columns!
  }
}

/**
 * Where a record's canonical reader page lives — always in the record's
 * language, never the page's. This is the address the sitemap, structured data
 * and `<link rel="canonical">` use; scripts/lib/archive-model.mjs#routeForItem
 * derives the same route for the build.
 */
export function archiveItemBasePath(item: ArchiveItem): string {
  return archiveBasePath(item.lang, item)
}

/**
 * Where a row on a `pageLang` page sends the reader. Each section lists the
 * other language's records too, and linking those to their canonical page
 * used to switch the whole site's language under the reader: a Today's Zaman
 * column clicked on /tr/kose-yazilari opened at /columns/<slug> with an
 * English menu. Columns and academic articles therefore also read under the
 * page's own language (the article text stays in its own language; the page
 * points its canonical at the record's own address). Analyses and interviews
 * have no such mirror route — their English item routes redirect to Turkish —
 * so they keep their canonical address. scripts/prerender.mjs writes the
 * mirror pages from the same rule (`mirrorRouteForItem`).
 */
export const MIRRORED_CATEGORIES = ['columns', 'academic'] as const

export function hasMirrorRoute(category: ArchiveItem['category']): boolean {
  return (MIRRORED_CATEGORIES as readonly string[]).includes(category)
}

export function readerBasePath(item: ArchiveItem, pageLang: Lang): string {
  return hasMirrorRoute(item.category) ? archiveBasePath(pageLang, item) : archiveItemBasePath(item)
}

/** Whether a piece opens on a reader page of its own (full text or page
 *  scans) rather than linking out to its source. */
export function hasReaderPage(item: ArchiveItem): boolean {
  return Boolean(item.hasBody || itemScanClippings(item).length > 0)
}

export function archiveLink(
  item: ArchiveItem,
  pageLang: Lang = item.lang,
): { href: string; internal: boolean } | null {
  if (hasReaderPage(item)) {
    return { href: `${readerBasePath(item, pageLang)}/${item.slug}`, internal: true }
  }
  if (item.url) return { href: item.url, internal: false }
  if (item.imageSrc) return { href: item.imageSrc, internal: false }
  return null
}

/** User-facing label for where a piece originally ran: printed newspaper
 *  column vs. online news-blog column (e.g. P24). */
export function mediumLabel(medium: 'print' | 'online', lang: Lang): string {
  if (medium === 'print') return lang === 'tr' ? 'Gazete' : 'Print'
  return lang === 'tr' ? 'E-yayın' : 'Online'
}

/** User-facing label for whether a piece is his own column or an interview
    he conducted (see ArchivePieceKind). */
export function pieceKindLabel(pieceKind: 'column' | 'interview', lang: Lang): string {
  if (pieceKind === 'interview') return lang === 'tr' ? 'Söyleşi' : 'Interview'
  return lang === 'tr' ? 'Köşe Yazısı' : 'Column'
}
