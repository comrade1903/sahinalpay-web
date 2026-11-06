/** The English view of a Turkish record — what an English-language page shows
 *  in place of the record's Turkish descriptive text.
 *
 *  Every section page lists the other language's records too, so a Turkish
 *  column appears on /columns and opens under /columns/<slug> with the
 *  English interface. Its title stays Turkish (it is the title) with an
 *  English rendering beside it; its date, citation line, source note, photo
 *  credit and page labels are given in English. Its body and the standfirst
 *  printed with it are the author's words and stay as they are.
 *
 *  Computed once, when the Turkish chunk is built, so the list pages and the
 *  reader only pick the fields (see displayItem in archive/display.ts). The
 *  translations themselves live in archive/tr/english.ts. */
import type { ArchiveClipping, ArchiveItem, ArchiveItemEnglish } from './types'
import {
  imageCreditTranslations,
  sourceNoteTranslations,
  subtitleTranslations,
  titleTranslations,
} from './tr/english'

const MONTHS: Record<string, string> = {
  Ocak: 'January',
  Şubat: 'February',
  Mart: 'March',
  Nisan: 'April',
  Mayıs: 'May',
  Haziran: 'June',
  Temmuz: 'July',
  Ağustos: 'August',
  Eylül: 'September',
  Ekim: 'October',
  Kasım: 'November',
  Aralık: 'December',
}

/* \b is ASCII-only, so it never matches beside Ş or Ğ; letter lookarounds do. */
const MONTH_PATTERN = new RegExp(`(?<!\\p{L})(${Object.keys(MONTHS).join('|')})(?!\\p{L})`, 'gu')

/** "1 Kasım 2012" → "1 November 2012"; a bare year is left alone. */
export function englishDate(date: string): string {
  return date.replace(MONTH_PATTERN, (month) => MONTHS[month] ?? month)
}

/** "s. 17" → "p. 17", "s. 17-18" → "pp. 17-18". */
function englishPages(text: string): string {
  return text.replace(/\bs\. (\d+)(\s*[-–]\s*\d+)?/gu, (_, first: string, range?: string) =>
    range ? `pp. ${first}${range.replace(/\s/g, '')}` : `p. ${first}`,
  )
}

/** A newspaper citation line, in the few fixed shapes the columns use:
 *  "Zaman, Yorum, 1 Kasım 2012, s. 17", "Milliyet, Entellektüel Bakış,
 *  3 Şubat 1999, s. 20 — Joschka Fischer ile söyleşi", "Cumhuriyet Kitap,
 *  sayı 12, …". Anything else — a P24 piece's standfirst stored as its
 *  subtitle — is returned as undefined and stays in Turkish. */
export function englishCitation(subtitle: string): string | undefined {
  const match = /^(Zaman|Milliyet|Cumhuriyet|Sabah|Cumhuriyet Kitap)(,.*)$/u.exec(subtitle)
  if (!match) return undefined
  let rest = match[2] ?? ''
  rest = rest.replace(/ — (.+) ile söyleşi$/u, ' — interview with $1')
  rest = rest.replace(/, Yorum,/u, ', Opinion,')
  rest = rest.replace(/, sayı (\d+)/u, ', no. $1')
  rest = englishPages(englishDate(rest))
  return `${match[1]}${rest}`
}

/** "Sayfa 3" → "Page 3", "s. 17" → "p. 17", and a citation-shaped alt text
 *  ("Zaman, 1 Kasım 2012, s. 17") the same way as a citation. */
function englishClipping(clipping: ArchiveClipping): ArchiveClipping {
  const pageLabel = clipping.pageLabel
    ?.replace(/^Sayfa (\d+)$/u, 'Page $1')
    .replace(/^s\. /u, 'p. ')
  const alt = clipping.alt ? (englishCitation(clipping.alt) ?? clipping.alt) : undefined
  return {
    ...clipping,
    ...(pageLabel !== undefined ? { pageLabel } : {}),
    ...(alt !== undefined ? { alt } : {}),
  }
}

/** The English names of the two Turkish "outlets" that are really sections. */
const OUTLET_NAMES: Record<string, string> = {
  Söyleşiler: 'Interviews',
  'Türkçe ve Yabancı Dilde Makaleler': 'Articles in Turkish and Other Languages',
}

export function englishViewFor(item: ArchiveItem): ArchiveItemEnglish {
  const title = titleTranslations[item.slug]
  const subtitle =
    subtitleTranslations[item.slug] ?? (item.subtitle ? englishCitation(item.subtitle) : undefined)
  const sourceNote = item.sourceNote ? sourceNoteTranslations[item.sourceNote] : undefined
  const imageCredit = item.imageCredit ? imageCreditTranslations[item.imageCredit] : undefined
  const outlet = OUTLET_NAMES[item.outlet]
  return {
    ...(title ? { title } : {}),
    ...(subtitle ? { subtitle } : {}),
    ...(item.date ? { date: englishDate(item.date) } : {}),
    ...(sourceNote ? { sourceNote } : {}),
    ...(imageCredit ? { imageCredit } : {}),
    ...(outlet ? { outlet } : {}),
    ...(item.clippings ? { clippings: item.clippings.map(englishClipping) } : {}),
  }
}

/** Attaches the English view to each Turkish record. */
export function withEnglishView(items: ArchiveItem[]): ArchiveItem[] {
  return items.map((item) => ({ ...item, en: englishViewFor(item) }))
}
