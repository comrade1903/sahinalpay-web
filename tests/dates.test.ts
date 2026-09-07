import { describe, expect, it } from 'vitest'
import {
  archiveDatePrecision,
  isRealCalendarDate,
  isoDateAtKnownPrecision,
  parseTurkishDate,
} from '../src/dateUtils'

describe('parseTurkishDate', () => {
  it('parses a full Turkish date', () => {
    expect(parseTurkishDate('7 Kasım 2017')).toBe(Date.UTC(2017, 10, 7))
  })

  it('parses a full English date (Today’s Zaman columns)', () => {
    expect(parseTurkishDate('11 January 2003')).toBe(Date.UTC(2003, 0, 11))
  })

  it('accepts ASCII spellings of Turkish months', () => {
    expect(parseTurkishDate('3 Agustos 1994')).toBe(parseTurkishDate('3 Ağustos 1994'))
  })

  it('anchors a month-only date to the 1st for sorting', () => {
    expect(parseTurkishDate('Ekim 1969')).toBe(Date.UTC(1969, 9, 1))
  })

  it('anchors a year-only date to 1 January for sorting', () => {
    expect(parseTurkishDate('1969')).toBe(Date.UTC(1969, 0, 1))
  })

  it('returns null for an unparseable string', () => {
    expect(parseTurkishDate('bilinmiyor')).toBeNull()
    expect(parseTurkishDate('7 Smarch 2017')).toBeNull()
  })

  /* parseInt reads a leading number and ignores the rest, so these used to
     parse: "7x Kasım 2017junk" as 7 November 2017, and "1969junk" as a
     timestamp that archiveDatePrecision simultaneously called not a date. */
  it('rejects a token with anything trailing after the number', () => {
    for (const value of ['7x Kasım 2017junk', 'Ekim 1969junk', '1969junk', '12abc Ocak 1990']) {
      expect(parseTurkishDate(value), value).toBeNull()
    }
  })

  it('rejects an out-of-range or wrong-width number', () => {
    for (const value of ['0 Ocak 1990', '32 Ocak 1990', '7 Kasım 17', '7 Kasım 20177']) {
      expect(parseTurkishDate(value), value).toBeNull()
    }
  })
})

describe('archiveDatePrecision', () => {
  it('reports day precision for a full date', () => {
    expect(archiveDatePrecision('7 Kasım 2017')).toBe('day')
  })

  it('reports month precision for "Ekim 1969"', () => {
    expect(archiveDatePrecision('Ekim 1969')).toBe('month')
  })

  it('reports year precision for a bare year', () => {
    expect(archiveDatePrecision('1969')).toBe('year')
  })

  it('rejects a four-digit token that is not a year-shaped date', () => {
    expect(archiveDatePrecision('sayı 12')).toBeNull()
  })

  /* The two functions share one parser precisely so they cannot disagree
     about whether a string is a date. */
  it('agrees with parseTurkishDate on every input', () => {
    const values = [
      '7 Kasım 2017',
      'Ekim 1969',
      '1969',
      '7x Kasım 2017junk',
      'Ekim 1969junk',
      '1969junk',
      'bilinmiyor',
      'sayı 12',
      '31 Şubat 2024',
      '',
    ]
    for (const value of values) {
      expect(
        archiveDatePrecision(value) === null,
        `${JSON.stringify(value)}: precision and timestamp disagree`,
      ).toBe(parseTurkishDate(value) === null)
    }
  })
})

describe('isoDateAtKnownPrecision', () => {
  it('publishes a full date at day precision', () => {
    expect(isoDateAtKnownPrecision('7 Kasım 2017')).toBe('2017-11-07')
  })

  /* The regression this guards: a month-only source date used to reach
     JSON-LD as 1969-10-01, asserting a publication day nobody knows. */
  it('never invents a day for a month-only date', () => {
    expect(isoDateAtKnownPrecision('Ekim 1969')).toBe('1969-10')
  })

  it('never invents a month for a year-only date', () => {
    expect(isoDateAtKnownPrecision('1969')).toBe('1969')
  })

  it('returns undefined when the date cannot be parsed at all', () => {
    expect(isoDateAtKnownPrecision('tarihsiz')).toBeUndefined()
  })
})

describe('isRealCalendarDate', () => {
  it('accepts a real day', () => {
    expect(isRealCalendarDate('7 Kasım 2017')).toBe(true)
    expect(isRealCalendarDate('29 Şubat 2024')).toBe(true)
  })

  /* Date.UTC rolls an impossible day into the next month instead of failing,
     so 31 February used to sort and validate as 2 or 3 March. */
  it('rejects a day the month does not have', () => {
    expect(isRealCalendarDate('31 Şubat 2024')).toBe(false)
    expect(isRealCalendarDate('31 Nisan 2010')).toBe(false)
    expect(isRealCalendarDate('29 Şubat 2023')).toBe(false)
  })

  it('has nothing to check on month- or year-only dates', () => {
    expect(isRealCalendarDate('Ekim 1969')).toBe(true)
    expect(isRealCalendarDate('1969')).toBe(true)
  })

  it('rejects a string that is not a date', () => {
    expect(isRealCalendarDate('tarihsiz')).toBe(false)
  })
})
