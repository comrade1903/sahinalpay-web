import type { Lang } from '../content'

export type CountNoun = 'piece' | 'book' | 'interview' | 'article'

const NOUNS: Record<CountNoun, { tr: string; en: [singular: string, plural: string] }> = {
  piece: { tr: 'yazı', en: ['piece', 'pieces'] },
  book: { tr: 'kitap', en: ['book', 'books'] },
  interview: { tr: 'söyleşi', en: ['interview', 'interviews'] },
  article: { tr: 'makale', en: ['article', 'articles'] },
}

/** "3 pieces", but "1 piece". English needs the singular; Turkish does not
 *  inflect the noun after a number, so it stays "1 yazı". A section that
 *  shrinks to a single record used to read "1 pieces". Each section is counted
 *  in its own noun — the home card used to call seven books "7 yazı", and the
 *  interviews page called its interviews "yazı" too. */
export function countLabel(count: number, lang: Lang, noun: CountNoun = 'piece'): string {
  const words = NOUNS[noun]
  if (lang === 'tr') return `${count} ${words.tr}`
  return `${count} ${count === 1 ? words.en[0] : words.en[1]}`
}
