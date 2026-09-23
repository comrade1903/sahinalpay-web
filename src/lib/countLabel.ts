import type { Lang } from '../content'

/** "3 pieces", but "1 piece". English needs the singular; Turkish does not
 *  inflect the noun after a number, so it stays "1 yazı". A section that
 *  shrinks to a single record used to read "1 pieces". Books are counted as
 *  books — the home card used to call seven books "7 yazı". */
export function countLabel(count: number, lang: Lang, noun: 'piece' | 'book' = 'piece'): string {
  if (noun === 'book') {
    if (lang === 'tr') return `${count} kitap`
    return count === 1 ? '1 book' : `${count} books`
  }
  if (lang === 'tr') return `${count} yazı`
  return count === 1 ? '1 piece' : `${count} pieces`
}
