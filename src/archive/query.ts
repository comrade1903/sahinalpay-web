import { parseTurkishDate } from '../dateUtils'
import { foldSearchText } from '../textUtils'
import { archiveItemText, itemHasSourceKind } from './itemUtils'
import type { ArchiveItem } from './types'

export type SourceKind = 'all' | 'digital' | 'clipping'
export type SortOrder = 'newest' | 'oldest'

/** Rows rendered per archive page. Pagination bounds the DOM, not the
 *  amount of metadata downloaded — see docs/OPERATIONS.md. */
export const ARCHIVE_PAGE_SIZE = 20

export function archiveItemKey(item: ArchiveItem): string {
  return `${item.lang}:${item.id}`
}

/* Folding costs ~5x a plain toLowerCase, and this runs over every item on every
   keystroke — with the bodies loaded that is several megabytes of text. The folded
   form is cached per item and recomputed only when its body arrives, so correct
   Turkish matching doesn't buy itself a typing lag on the archive's slowest page. */
const foldedItemText = new Map<string, string>()

export function foldedTextFor(item: ArchiveItem, body: string[] | undefined): string {
  const cacheKey = `${archiveItemKey(item)}:${body ? 'body' : 'meta'}`
  const cached = foldedItemText.get(cacheKey)
  if (cached !== undefined) return cached
  const folded = foldSearchText(archiveItemText(item, body))
  foldedItemText.set(cacheKey, folded)
  return folded
}

/** Test seam: the fold cache is process-wide and keyed by item id, so a
 *  suite that reuses ids across cases has to reset it. */
export function clearFoldedTextCache(): void {
  foldedItemText.clear()
}

export function matchesFilters(
  item: ArchiveItem,
  search: string,
  fromYear: string,
  toYear: string,
  sourceKind: SourceKind,
  bodyIndex: ReadonlyMap<string, string[]>,
): boolean {
  if (!itemHasSourceKind(item, sourceKind)) return false

  if (
    search &&
    !foldedTextFor(item, bodyIndex.get(archiveItemKey(item))).includes(
      foldSearchText(search),
    )
  ) {
    return false
  }
  if (fromYear || toYear) {
    const ts = item.date ? parseTurkishDate(item.date) : null
    if (ts === null) return false
    const year = new Date(ts).getUTCFullYear()
    if (fromYear && year < parseInt(fromYear, 10)) return false
    if (toYear && year > parseInt(toYear, 10)) return false
  }
  return true
}

export function sortByDate<T>(
  entries: T[],
  dateOf: (entry: T) => string | undefined,
  sort: SortOrder,
): T[] {
  return [...entries]
    .map((entry) => {
      const date = dateOf(entry)
      return { entry, ts: date ? parseTurkishDate(date) : null }
    })
    .sort((a, b) => {
      if (a.ts === null && b.ts === null) return 0
      if (a.ts === null) return 1
      if (b.ts === null) return -1
      return sort === 'newest' ? b.ts - a.ts : a.ts - b.ts
    })
    .map((w) => w.entry)
}

export function sortItems(items: ArchiveItem[], sort: SortOrder): ArchiveItem[] {
  return sortByDate(items, (item) => item.date, sort)
}

export function validSourceKind(value: string | null): SourceKind {
  return value === 'digital' || value === 'clipping' ? value : 'all'
}

export function validSort(value: string | null): SortOrder {
  return value === 'oldest' ? 'oldest' : 'newest'
}

export function positivePage(value: string | null): number {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

export function totalPagesFor(count: number, pageSize = ARCHIVE_PAGE_SIZE): number {
  return Math.max(1, Math.ceil(count / pageSize))
}

/** Clamps a requested page into range, so a stale `?page=` deep link lands
 *  on the last real page instead of an empty list. */
export function clampPage(
  requested: number,
  count: number,
  pageSize = ARCHIVE_PAGE_SIZE,
): number {
  return Math.min(Math.max(1, requested), totalPagesFor(count, pageSize))
}

export function pageSlice<T>(
  items: T[],
  page: number,
  pageSize = ARCHIVE_PAGE_SIZE,
): T[] {
  const current = clampPage(page, items.length, pageSize)
  return items.slice((current - 1) * pageSize, current * pageSize)
}
