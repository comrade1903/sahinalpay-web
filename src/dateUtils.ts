const MONTHS: Record<string, number> = {
  // Turkish
  ocak: 0,
  şubat: 1,
  subat: 1,
  mart: 2,
  nisan: 3,
  mayıs: 4,
  mayis: 4,
  haziran: 5,
  temmuz: 6,
  ağustos: 7,
  agustos: 7,
  eylül: 8,
  eylul: 8,
  ekim: 9,
  kasım: 10,
  kasim: 10,
  aralık: 11,
  aralik: 11,
  // English (Today's Zaman columns carry English date strings)
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
}

/** How much of a free-text archive date is actually known.
 *
 *  Archive dates are the strings printed on the source itself, and TÜSTAV
 *  periodicals are often dated only to the month or the year. Sorting needs
 *  a timestamp, so `parseTurkishDate` anchors those to the 1st of January /
 *  of the month — a sorting convenience, never a fact. Anything that
 *  publishes a date (JSON-LD `datePublished`, `<time datetime>`) has to ask
 *  for the precision first and emit only the part that is known, otherwise
 *  "Ekim 1969" goes out to search engines as 1 October 1969. */
export type DatePrecision = 'day' | 'month' | 'year'

export function archiveDatePrecision(dateStr: string): DatePrecision | null {
  const parts = dateStr.trim().toLowerCase().split(/\s+/)
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const month = MONTHS[parts[1]]
    const year = parseInt(parts[2], 10)
    if (!Number.isNaN(day) && month !== undefined && !Number.isNaN(year)) return 'day'
    return null
  }
  if (parts.length === 2) {
    const month = MONTHS[parts[0]]
    const year = parseInt(parts[1], 10)
    if (month !== undefined && !Number.isNaN(year)) return 'month'
    return null
  }
  if (parts.length === 1) {
    const year = parseInt(parts[0], 10)
    if (!Number.isNaN(year) && /^\d{4}$/.test(parts[0])) return 'year'
  }
  return null
}

/** ISO 8601 truncated to the precision actually known: `1969-10` for a date
 *  given only as "Ekim 1969", `1969` for a bare year. Schema.org accepts
 *  reduced-precision ISO dates, so nothing is lost by not guessing. */
export function isoDateAtKnownPrecision(dateStr: string): string | undefined {
  const precision = archiveDatePrecision(dateStr)
  if (!precision) return undefined
  const ts = parseTurkishDate(dateStr)
  if (ts === null) return undefined
  const iso = new Date(ts).toISOString()
  if (precision === 'year') return iso.slice(0, 4)
  if (precision === 'month') return iso.slice(0, 7)
  return iso.slice(0, 10)
}

/** Parses a Turkish ("7 Kasım 2017") or English ("7 November 2017") date
 *  string into a sortable timestamp. Returns null when it doesn't match.
 *  Also accepts a bare "Ay Yıl" / "Month Year" (e.g. "Aralık 1968", the
 *  granularity TÜSTAV periodicals are dated at) and a bare year, both
 *  anchored to the 1st of the month so they still sort correctly against
 *  full dates in the same year. */
export function parseTurkishDate(dateStr: string): number | null {
  const parts = dateStr.trim().toLowerCase().split(/\s+/)
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const month = MONTHS[parts[1]]
    const year = parseInt(parts[2], 10)
    if (!Number.isNaN(day) && month !== undefined && !Number.isNaN(year)) {
      return Date.UTC(year, month, day)
    }
  }
  if (parts.length === 2) {
    const month = MONTHS[parts[0]]
    const year = parseInt(parts[1], 10)
    if (month !== undefined && !Number.isNaN(year)) {
      return Date.UTC(year, month, 1)
    }
  }
  if (parts.length === 1) {
    const year = parseInt(parts[0], 10)
    if (!Number.isNaN(year)) return Date.UTC(year, 0, 1)
  }
  return null
}
