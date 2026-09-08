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
 * Where a record's own reader page lives — always in the record's language,
 * never the page's.
 *
 * These differ now that each section lists the other language's records too:
 * a Turkish column shown on /columns still reads at /tr/kose-yazilari/<slug>,
 * because that is the only place it was prerendered and the only language its
 * body exists in. scripts/lib/archive-model.mjs#routeForItem has always
 * derived the route this way for the sitemap and the prerenderer, so this is
 * the client agreeing with the build rather than a new rule.
 *
 * `archiveBasePath` keeps taking an explicit language for the home page's
 * weekly picks, which come from a per-language pool of seeds carrying no
 * `lang` of their own.
 */
export function archiveItemBasePath(item: ArchiveItem): string {
  return archiveBasePath(item.lang, item)
}

export function archiveLink(item: ArchiveItem): { href: string; internal: boolean } | null {
  if (item.hasBody || itemScanClippings(item).length > 0) {
    return { href: `${archiveItemBasePath(item)}/${item.slug}`, internal: true }
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
