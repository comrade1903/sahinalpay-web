import type { Lang } from './content'

export type PageKey =
  | 'home'
  | 'about'
  | 'photos'
  | 'columns'
  | 'analyses'
  | 'interviews'
  | 'academic'
  | 'books'
  | 'trial'
  | 'press'
  | 'cookies'

/* English includes hub pages for every archive category. Full source items
   remain language-specific: only English-language articles get English readers. */
export const paths: Record<Lang, Partial<Record<PageKey, string>>> = {
  en: {
    home: '/en',
    about: '/en/about',
    /* The captions are his own and Turkish only; this page shows them
       untranslated (see src/photoStory.ts). */
    photos: '/en/my-story-in-photographs',
    columns: '/en/columns',
    analyses: '/en/analyses',
    interviews: '/en/interviews',
    academic: '/en/academic-articles',
    books: '/en/books',
    /* His full account — courtroom statements, and the Constitutional
       Court's and ECHR's rulings — is only in Turkish (see
       src/trialProcess.ts); this English page is a short factual summary,
       not a translation of that record. */
    trial: '/en/trial-process',
    /* Other people's writing about him. The pieces themselves are Turkish,
       so only the Turkish side carries item routes; this English page lists the same
       selection and links into them. */
    press: '/en/about-me-in-the-press',
    cookies: '/en/cookie-policy',
  },
  tr: {
    home: '/',
    about: '/kimdir',
    photos: '/fotograflarla-hikayem',
    columns: '/kose-yazilari',
    analyses: '/analizler',
    interviews: '/soylesiler',
    academic: '/akademik-makaleler',
    books: '/kitaplar',
    trial: '/yargilanma-surecim',
    press: '/basinda-hakkimda',
    cookies: '/cerez-politikasi',
  },
}

/** Turkish is the site's own language and lives at the root; English is the
 *  alternative under /en (switched on 2026-11-12 — the root used to be
 *  English and Turkish lived under /tr; vercel.json redirects both). */
export function langForPath(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'tr'
}

export function pageKeyForPath(pathname: string): PageKey {
  const lang = langForPath(pathname)
  const entries = Object.entries(paths[lang]) as [PageKey, string][]
  const found = entries
    .filter(([, p]) => pathname === p || pathname.startsWith(`${p}/`))
    .sort((a, b) => b[1].length - a[1].length)[0]
  return found ? found[0] : 'home'
}

/** Path to the same page in another language, falling back to that language's home.
 *  A column, interview or academic article keeps its slug: each reads under
 *  both languages' paths for its section (MIRRORED_CATEGORIES in archive/links.ts),
 *  so switching language on one stays on the piece instead of dropping back
 *  to the list. */
export function equivalentPath(pathname: string, targetLang: Lang): string {
  for (const key of ['columns', 'interviews', 'academic'] as const) {
    const base = paths[langForPath(pathname)][key]!
    if (pathname.startsWith(`${base}/`)) {
      return `${paths[targetLang][key]!}${pathname.slice(base.length)}`
    }
  }
  const key = pageKeyForPath(pathname)
  return paths[targetLang][key] ?? paths[targetLang].home!
}
