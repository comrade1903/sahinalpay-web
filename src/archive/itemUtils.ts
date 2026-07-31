import { getCachedBody } from './bodyRegistry'
import type { ArchiveItem } from './types'

export function archiveItemText(item: ArchiveItem, loadedBody?: string[]): string {
  const body = loadedBody ?? item.body ?? getCachedBody(item)
  return [
    item.title,
    item.subtitle,
    item.excerpt,
    item.sourceNote,
    item.imageCredit,
    ...(item.tags ?? []),
    ...(body ?? []),
    ...(item.clippings ?? []).flatMap((clipping) => [
      clipping.alt,
      clipping.sourceNote,
      clipping.pageLabel,
    ]),
  ]
    .filter(Boolean)
    .join(' ')
}

/** Scanned newspaper clippings only; article photos do not make an item a clipping. */
export function itemScanClippings(item: ArchiveItem) {
  return (item.clippings ?? []).filter((clipping) => clipping.kind !== 'photo')
}

export function itemHasSourceKind(
  item: ArchiveItem,
  kind: 'all' | 'digital' | 'clipping',
) {
  if (kind === 'all') return true
  if (kind === 'digital') return Boolean(item.url || item.hasBody)
  return Boolean(itemScanClippings(item).length || item.imageSrc)
}
