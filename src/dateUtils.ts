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

interface ParsedArchiveDate {
  precision: DatePrecision
  /** UTC timestamp, with unknown parts anchored to the 1st — sortable only. */
  timestamp: number
  /** The day as written, so a caller can tell 31 February from 3 March. */
  day?: number
}

/* Every token has to match in full.
   `parseInt` reads a leading number and ignores whatever follows, so
   "7x Kasım 2017junk" parsed as 7 November 2017 and "1969junk" produced a
   timestamp from parseTurkishDate while archiveDatePrecision called it not a
   date at all — the two disagreeing on the same string, which is exactly what
   sharing one parser was meant to prevent. */
const DAY_PATTERN = /^\d{1,2}$/
const YEAR_PATTERN = /^\d{4}$/

function parseDay(value: string): number | null {
  if (!DAY_PATTERN.test(value)) return null
  const day = Number(value)
  return day >= 1 && day <= 31 ? day : null
}

function parseYear(value: string): number | null {
  return YEAR_PATTERN.test(value) ? Number(value) : null
}

/* One parser behind both parseTurkishDate() and archiveDatePrecision(): they
   used to repeat the same three shapes, which is how they could disagree. */
function parseArchiveDate(dateStr: string): ParsedArchiveDate | null {
  const parts = dateStr.trim().toLowerCase().split(/\s+/)

  if (parts.length === 3) {
    const [dayText, monthText, yearText] = parts
    if (dayText === undefined || monthText === undefined || yearText === undefined) return null
    const day = parseDay(dayText)
    const month = MONTHS[monthText]
    const year = parseYear(yearText)
    if (day === null || month === undefined || year === null) return null
    return { precision: 'day', timestamp: Date.UTC(year, month, day), day }
  }

  if (parts.length === 2) {
    const [monthText, yearText] = parts
    if (monthText === undefined || yearText === undefined) return null
    const month = MONTHS[monthText]
    const year = parseYear(yearText)
    if (month === undefined || year === null) return null
    return { precision: 'month', timestamp: Date.UTC(year, month, 1) }
  }

  if (parts.length === 1) {
    const [yearText] = parts
    if (yearText === undefined) return null
    const year = parseYear(yearText)
    if (year === null) return null
    return { precision: 'year', timestamp: Date.UTC(year, 0, 1) }
  }

  return null
}

/** How much of a free-text archive date is actually known. Returns null for a
 *  string that is not a date at all — including a bare token that merely
 *  contains digits, which is why a year has to be exactly four of them. */
export function archiveDatePrecision(dateStr: string): DatePrecision | null {
  return parseArchiveDate(dateStr)?.precision ?? null
}

/** True when a day-precision date names a day that month really has —
 *  Date.UTC rolls 31 February over into March rather than rejecting it. */
export function isRealCalendarDate(dateStr: string): boolean {
  const parsed = parseArchiveDate(dateStr)
  if (!parsed) return false
  if (parsed.precision !== 'day') return true
  return new Date(parsed.timestamp).getUTCDate() === parsed.day
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
 *  full dates in the same year. That anchor is for ordering only — see
 *  isoDateAtKnownPrecision() before publishing a date anywhere. */
export function parseTurkishDate(dateStr: string): number | null {
  return parseArchiveDate(dateStr)?.timestamp ?? null
}
