import { afterEach, describe, expect, it } from 'vitest'
import { FONT_SCALE_KEY, readStoredFontScale, writeStoredFontScale } from '../src/lib/preferences'
import { content } from '../src/content'

const realStorage = Object.getOwnPropertyDescriptor(window, 'localStorage')
function blockStorage() {
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    get() {
      throw new DOMException('The operation is insecure.', 'SecurityError')
    },
  })
}

afterEach(() => {
  if (realStorage) Object.defineProperty(window, 'localStorage', realStorage)
  window.localStorage.clear()
})

describe('stored reader text size', () => {
  it('defaults to 1', () => expect(readStoredFontScale()).toBe(1))
  it('reads a stored step', () => {
    window.localStorage.setItem(FONT_SCALE_KEY, '1.25')
    expect(readStoredFontScale()).toBe(1.25)
  })
  it('falls back to 1 on a value that is not a number', () => {
    window.localStorage.setItem(FONT_SCALE_KEY, 'large')
    expect(readStoredFontScale()).toBe(1)
    window.localStorage.setItem(FONT_SCALE_KEY, '')
    expect(readStoredFontScale()).toBe(1)
  })
  it('clamps to the control range', () => {
    window.localStorage.setItem(FONT_SCALE_KEY, '9')
    expect(readStoredFontScale()).toBe(1.5)
    window.localStorage.setItem(FONT_SCALE_KEY, '0.1')
    expect(readStoredFontScale()).toBe(0.85)
  })
  it('stores a chosen size and forgets the default', () => {
    writeStoredFontScale(1.375)
    expect(window.localStorage.getItem(FONT_SCALE_KEY)).toBe('1.375')
    writeStoredFontScale(1)
    expect(window.localStorage.getItem(FONT_SCALE_KEY)).toBeNull()
  })
  it('does not throw when storage is blocked', () => {
    blockStorage()
    expect(readStoredFontScale()).toBe(1)
    expect(() => writeStoredFontScale(1.25)).not.toThrow()
  })
})

/* KVKK/GDPR: what the site stores must be what the notice says it stores. */
describe('the cookie notice discloses the text size', () => {
  it('names it in both languages, in the notice and the policy', () => {
    expect(content.tr.cookieNotice.text).toMatch(/yazı boyutu/)
    expect(content.en.cookieNotice.text).toMatch(/text size/)
    const policy = (lang: 'tr' | 'en') =>
      content[lang].cookiePolicy.sections.flatMap((section) => section.body).join(' ')
    expect(policy('tr')).toMatch(/yazı boyutu/)
    expect(policy('en')).toMatch(/text size/)
  })
})
