import { useEffect, useState } from 'react'
import { readStoredValue, removeStoredValue, writeStoredValue } from './storage'

/**
 * Reader preferences: theme, language and the cookie-notice acknowledgement.
 *
 * All three are stored in the browser and never leave it. Access goes through
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
