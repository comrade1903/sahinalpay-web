import { useEffect, useState } from 'react'
import { readStoredValue, removeStoredValue, writeStoredValue } from './storage'

/**
 * Reader preferences: theme, language, the article text size and the
 * cookie-notice acknowledgement.
 *
 * All of them are stored in the browser and never leave it. Access goes through
 * lib/storage, which tolerates browsers that block storage outright — an
 * unguarded read used to take the header down in Safari's Lockdown mode.
 */

export const CONSENT_KEY = 'cookie-consent'
export const CONSENT_VALUE = 'ok'

export const THEME_KEY = 'theme'
export const LANG_KEY = 'lang'

/** null = follow the system, which is the documented default. */
export function readStoredTheme(): 'light' | 'dark' | null {
  const stored = readStoredValue(THEME_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

export function useTheme() {
  /* The cookie notice tells visitors, in both languages, that the site stores a
     theme preference. It did not — theme lived in React state only, so an older
     reader who chose dark lost it on every reload, and the KVKK/GDPR disclosure
     described processing that never happened. */
  const [theme, setTheme] = useState<'light' | 'dark' | null>(readStoredTheme)
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  )

  useEffect(() => {
    if (theme === null) delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = theme
    if (theme === null) removeStoredValue(THEME_KEY)
    else writeStoredValue(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) =>
      setSystemTheme(event.matches ? 'dark' : 'light')
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const toggle = () =>
    setTheme((t) => {
      const current = t ?? systemTheme
      return current === 'dark' ? 'light' : 'dark'
    })
  return { toggle, isDark: (theme ?? systemTheme) === 'dark' }
}

/** The article page's text size control (A− / A+), remembered across pieces
 *  so a reader who needs larger type sets it once. Disclosed in the cookie
 *  notice and the cookie policy, in both languages. */
export const FONT_SCALE_KEY = 'reader-font-scale'
export const FONT_SCALE_MIN = 0.85
export const FONT_SCALE_MAX = 1.5
export const FONT_SCALE_STEP = 0.125

/** 1 when nothing usable is stored; otherwise the stored value clamped to [MIN, MAX]. */
export function readStoredFontScale(): number {
  const stored = readStoredValue(FONT_SCALE_KEY)
  if (stored === null) return 1
  const value = Number(stored)
  if (!Number.isFinite(value) || stored.trim() === '') return 1
  return Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, value))
}

/** Stores the scale; removes the key at exactly 1, so the default leaves nothing behind. */
export function writeStoredFontScale(scale: number): void {
  if (scale === 1) removeStoredValue(FONT_SCALE_KEY)
  else writeStoredValue(FONT_SCALE_KEY, String(scale))
}
