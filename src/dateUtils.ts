const TR_MONTHS: Record<string, number> = {
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
}

/** Parses a Turkish date string like "7 Kasım 2017" into a sortable
 *  timestamp. Returns null when the string doesn't match. */
export function parseTurkishDate(dateStr: string): number | null {
  const parts = dateStr.trim().toLowerCase().split(/\s+/)
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const month = TR_MONTHS[parts[1]]
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
