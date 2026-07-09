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

/** Parses a Turkish ("7 Kasım 2017") or English ("7 November 2017") date
 *  string into a sortable timestamp. Returns null when it doesn't match. */
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
  if (parts.length === 1) {
    const year = parseInt(parts[0], 10)
    if (!Number.isNaN(year)) return Date.UTC(year, 0, 1)
  }
  return null
}
