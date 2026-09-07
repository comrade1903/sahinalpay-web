import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  isStorageAvailable,
  readStoredValue,
  removeStoredValue,
  writeStoredValue,
} from '../src/lib/storage'

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
})

describe('storage helpers with working storage', () => {
  it('round-trips a value', () => {
    writeStoredValue('sa-test', 'tr')
    expect(readStoredValue('sa-test')).toBe('tr')
    removeStoredValue('sa-test')
    expect(readStoredValue('sa-test')).toBeNull()
  })

  it('reports storage as available', () => {
    expect(isStorageAvailable()).toBe(true)
  })
})

/* Safari Lockdown mode, Firefox with dom.storage.enabled=false and
   "block all site data" enterprise policies throw on *every* access,
   reads included — an unguarded getItem used to take the header down. */
describe('storage helpers when the browser blocks storage', () => {
  it('reads as "no preference" instead of throwing', () => {
    blockStorage()
    expect(() => readStoredValue('lang')).not.toThrow()
    expect(readStoredValue('lang')).toBeNull()
  })

  it('swallows writes instead of throwing', () => {
    blockStorage()
    expect(() => writeStoredValue('lang', 'tr')).not.toThrow()
  })

  it('swallows removals instead of throwing', () => {
    blockStorage()
    expect(() => removeStoredValue('theme')).not.toThrow()
  })

  it('reports storage as unavailable', () => {
    blockStorage()
    expect(isStorageAvailable()).toBe(false)
  })
})
