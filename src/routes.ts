import type { Lang } from './content'

export type PageKey =
  | 'home'
  | 'about'
  | 'columns'
  | 'analyses'
  | 'interviews'
  | 'academic'
  | 'books'

/* English has three archive categories; Turkish has all six (Analizler /
   Söyleşiler / Akademik Makaleler are Turkish-only, per the source material). */
export const paths: Record<Lang, Partial<Record<PageKey, string>>> = {
  en: {
    home: '/',
    about: '/about',
    columns: '/columns',
    analyses: '/analyses',
    interviews: '/interviews',
    academic: '/academic-articles',
    books: '/books',
  },
  tr: {
    home: '/tr',
    about: '/tr/kimdir',
    columns: '/tr/kose-yazilari',
    analyses: '/tr/analizler',
    interviews: '/tr/soylesiler',
    academic: '/tr/akademik-makaleler',
    books: '/tr/kitaplar',
  },
}

export function langForPath(pathname: string): Lang {
  return pathname === '/tr' || pathname.startsWith('/tr/') ? 'tr' : 'en'
}

export function pageKeyForPath(pathname: string): PageKey {
  const lang = langForPath(pathname)
  const entries = Object.entries(paths[lang]) as [PageKey, string][]
  const found = entries.find(([, p]) => p === pathname)
  return found ? found[0] : 'home'
}

/** Path to the same page in another language, falling back to that language's home. */
export function equivalentPath(pathname: string, targetLang: Lang): string {
  const key = pageKeyForPath(pathname)
  return paths[targetLang][key] ?? paths[targetLang].home!
}

/** Last non-empty path segment of a source URL, used as the slug for full-article pages. */
export function slugFromUrl(url: string): string {
  const trimmed = url.replace(/\/$/, '')
  return trimmed.slice(trimmed.lastIndexOf('/') + 1)
}
