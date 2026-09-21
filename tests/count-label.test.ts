import { describe, expect, it } from 'vitest'
import { countLabel } from '../src/lib/countLabel'

describe('countLabel', () => {
  it('uses the English singular for a section down to one record', () => {
    expect(countLabel(1, 'en')).toBe('1 piece')
    expect(countLabel(0, 'en')).toBe('0 pieces')
    expect(countLabel(574, 'en')).toBe('574 pieces')
  })

  it('leaves the Turkish noun uninflected after a number', () => {
    expect(countLabel(1, 'tr')).toBe('1 yazı')
    expect(countLabel(574, 'tr')).toBe('574 yazı')
  })
})
