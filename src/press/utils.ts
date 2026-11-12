import { slugify } from '../archive/utils'
import type { PressItem, PressItemSeed, PressList } from './types'

/** A piece is addressed by author + headline, falling back to whichever of
 *  the two the manuscript gives, plus the date, so every entry gets a stable
 *  and readable URL even when it is unsigned or untitled. */
export function normalizePressItems(list: PressList, seeds: PressItemSeed[]): PressItem[] {
  return seeds.map((seed) => {
    const slug =
      seed.slug ??
      slugify(
        [seed.author, seed.title, seed.author && seed.title ? '' : seed.date]
          .filter(Boolean)
          .join(' '),
      )
    return { ...seed, slug, id: `press-${slug}`, list }
  })
}

const TURKISH_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
]

/** Display only: "03.08.2016" → "3 Ağustos 2016", so the few dates the
 *  manuscripts wrote in figures read like the rest of the list. Turkish on
 *  both language pages, because the pieces and every other date in the list
 *  are Turkish. Anything that is not a real day.month.year comes back
 *  unchanged, and the stored date is never touched. */
export function formatPressDate(date: string): string {
  const match = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(date.trim())
  if (!match) return date
  const [day, month, year] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const probe = new Date(Date.UTC(year, month - 1, day))
  if (month < 1 || month > 12 || probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) return date
  return `${day} ${TURKISH_MONTHS[month - 1]} ${year}`
}
