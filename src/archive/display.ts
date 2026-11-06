import type { ArchiveItem, ArchiveLang } from './types'

/** A record as a page in `pageLang` shows it. */
export interface DisplayItem extends ArchiveItem {
  /** The English rendering of a Turkish title, shown beside the title on
   *  English pages. */
  titleTranslation?: string
}

/** On an English page a Turkish record shows its English view (see
 *  archive/english.ts): the descriptive fields are swapped for their English
 *  versions and the title gains a translation beside it. Everything else —
 *  and every record on a page of its own language — passes through as is.
 *  Use it for what the page shows; head tags, structured data and citations
 *  describe the piece in its own language and keep using the record. */
export function displayItem(item: ArchiveItem, pageLang: ArchiveLang): DisplayItem {
  if (pageLang !== 'en' || item.lang !== 'tr' || !item.en) return item
  const { title, ...fields } = item.en
  return {
    ...item,
    ...fields,
    ...(title ? { titleTranslation: title } : {}),
  }
}
