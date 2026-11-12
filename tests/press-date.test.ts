import { describe, expect, it } from 'vitest'
import { formatPressDate } from '../src/press/utils'

describe('formatPressDate', () => {
  it('spells out a date written in figures', () => {
    expect(formatPressDate('03.08.2016')).toBe('3 Ağustos 2016')
    expect(formatPressDate('12.4.2017')).toBe('12 Nisan 2017')
  })
  it('leaves every other form alone', () => {
    expect(formatPressDate('27 Temmuz 2016')).toBe('27 Temmuz 2016')
    expect(formatPressDate('2017')).toBe('2017')
    expect(formatPressDate('31.2.2017')).toBe('31.2.2017')
    expect(formatPressDate('1.13.2017')).toBe('1.13.2017')
  })
})
