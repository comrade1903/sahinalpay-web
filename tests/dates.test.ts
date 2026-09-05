import { describe, expect, it } from 'vitest'
import {
  archiveDatePrecision,
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
