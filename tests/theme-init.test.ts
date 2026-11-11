import { readFileSync } from 'node:fs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { THEME_KEY } from '../src/lib/preferences'

/* Tests run from the project root. */
const read = (path: string) => readFileSync(path, 'utf8')
const run = () => new Function(read('public/theme-init.js'))()

/* The same way tests/storage.test.ts blocks storage: every access throws. */
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
  vi.restoreAllMocks()
  window.localStorage.clear()
  delete document.documentElement.dataset.theme
})

describe('theme-init.js', () => {
  it('reads the key the app writes', () => {
    expect(read('public/theme-init.js')).toContain(`getItem('${THEME_KEY}')`)
  })
  it('applies a stored theme', () => {
    window.localStorage.setItem(THEME_KEY, 'dark')
    run()
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
  it('leaves the system theme alone when nothing valid is stored', () => {
    window.localStorage.setItem(THEME_KEY, 'sepia')
    run()
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })
  it('does not throw when storage is blocked', () => {
    blockStorage()
    expect(run).not.toThrow()
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })
  it('is loaded before the app', () => {
    const html = read('index.html')
    expect(html.indexOf('/theme-init.js')).toBeGreaterThan(-1)
    expect(html.indexOf('/theme-init.js')).toBeLessThan(html.indexOf('/src/main.tsx'))
  })
})
