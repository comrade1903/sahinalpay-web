import { describe, expect, it } from 'vitest'
import { skipsDropCap } from '../src/components/reader/dropCap'

const long = (start: string) => start + ' ' + 'x'.repeat(80)

describe('skipsDropCap', () => {
  it('skips a missing or short opener', () => {
    expect(skipsDropCap(undefined)).toBe(true)
    expect(skipsDropCap('Kısa giriş.')).toBe(true)
  })
  /* "1972'nin Kasım ayıydı" was set as a red 1 followed by "972'nin". */
  it('skips an opener that starts with a digit or a quotation mark', () => {
    expect(skipsDropCap(long("1972'nin Kasım ayıydı."))).toBe(true)
    expect(skipsDropCap(long('“Sayın Başkan,'))).toBe(true)
    expect(skipsDropCap(long('"Sayın Başkan,'))).toBe(true)
  })
  it('keeps the drop cap for a letter, Turkish ones included', () => {
    expect(skipsDropCap(long('Türkiye'))).toBe(false)
    expect(skipsDropCap(long('İlk günlerden'))).toBe(false)
    expect(skipsDropCap(long('Şahin'))).toBe(false)
  })
})
