import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
  Navigate,
} from 'react-router-dom'
import {
  content,
  type Content,
  type Lang,
  type BooksSection,
} from './content'
import { itemScanClippings } from './archive/itemUtils'
import {
  archiveItemKey,
  clampPage,
  matchesFilters,
  pageSlice,
  positivePage,
  sortByDate,
  sortItems,
  totalPagesFor,
  validSort,
  validSourceKind,
  type SortOrder,
  type SourceKind,
} from './archive/query'
import {
  getCachedBody,
  loadArticleBody,
  loadOutletBodies,
} from './archive/bodyRegistry'
import { useArchiveData, type ArchiveData } from './archive/useArchiveData'
import { CONTACT_EMAIL, PERSON_ID, SITE_ORIGIN, siteUrl } from './siteConfig'
import { readStoredValue, writeStoredValue, removeStoredValue } from './lib/storage'
import type {
  ArchiveClipping,
  ArchiveItem,
  FlatArchiveSection,
  OutletArchiveSection,
  OutletGroup,
} from './archive/types'
import {
  paths,
  langForPath,
  pageKeyForPath,
  equivalentPath,
  type PageKey,
} from './routes'
import portrait from './assets/portrait.jpg'
import logoAydinlik from './assets/logos/aydinlik.webp'
import logoCumhuriyet from './assets/logos/cumhuriyet.webp'
import logoForum from './assets/logos/forum.webp'
import logoIsciKoylu from './assets/logos/isci-koylu.webp'
import logoMilliyet from './assets/logos/milliyet.svg'
import logoZaman from './assets/logos/zaman.webp'
import logoTodaysZaman from './assets/logos/todays-zaman.webp'
import logoP24 from './assets/logos/p24.webp'
import logoSabah from './assets/logos/sabah.webp'
import { isoDateAtKnownPrecision, parseTurkishDate } from './dateUtils'
import { chronicleEvents } from './chronicle'

/* ------------------------------------------------------------------
   Şahin Alpay — a personal & political legacy site. Bilingual (EN/TR),
   multi-page (each archive category is its own route — see routes.ts).
   The hero portrait lives in src/assets; setting PORTRAIT to null falls
   back to the ŞA monogram, which is what the hero showed before a photo
   existed.
------------------------------------------------------------------ */
/* Source: expressioninterrupted.com (P24), the only size that site
   publishes — 670×310, so the 4/5 frame crops it to roughly 248×310 and
   upscales from there. Replace this file with a taller, larger original
   when one is available; nothing else needs to change. */
const PORTRAIT: string | null = portrait


type PageMeta = {
  title: string
  description: string
  canonicalPath?: string
  alternates?: Partial<Record<Lang, string>>
  robots?: string
  type?: 'website' | 'article'
}

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let tag = document.querySelector(selector) as HTMLMetaElement | null
  if (!tag) {
    tag = document.createElement('meta')
    document.head.appendChild(tag)
  }
  Object.entries(attrs).forEach(([key, value]) => tag?.setAttribute(key, value))
}

function usePageMeta(titleOrMeta: string | PageMeta, description?: string) {
  const location = useLocation()
  const meta =
    typeof titleOrMeta === 'string'
      ? { title: titleOrMeta, description: description ?? '' }
      : titleOrMeta
  const title = meta.title
  const metaDescription = meta.description
  const canonicalPath = meta.canonicalPath
  const robots = meta.robots
  const type = meta.type
  const alternatesKey = JSON.stringify(meta.alternates ?? {})

  useEffect(() => {
    const canonical = pageUrl(canonicalPath ?? location.pathname)
    const pageLang = langForPath(canonicalPath ?? location.pathname)
    document.title = title
    upsertMeta('meta[name="description"]', {
      name: 'description',
      content: metaDescription,
    })
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: robots ?? 'index,follow',
    })
    upsertMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: title,
    })
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: metaDescription,
    })
    upsertMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: type ?? 'website',
    })
    upsertMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: canonical,
    })
    upsertMeta('meta[property="og:locale"]', {
      property: 'og:locale',
      content: pageLang === 'tr' ? 'tr_TR' : 'en_US',
    })
    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary',
    })
    upsertMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: title,
    })
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: metaDescription,
    })

    let canonicalTag = document.querySelector('link[rel="canonical"]')
    if (!canonicalTag) {
      canonicalTag = document.createElement('link')
      canonicalTag.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalTag)
    }
    canonicalTag.setAttribute('href', canonical)

    document
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((tag) => tag.remove())
    const alternateEntries = Object.entries(
      JSON.parse(alternatesKey) as Partial<Record<Lang, string>>,
    )
    document
      .querySelectorAll('meta[property="og:locale:alternate"]')
      .forEach((tag) => tag.remove())
    alternateEntries
      .filter(([langCode]) => langCode !== pageLang)
      .forEach(([langCode]) => {
        const tag = document.createElement('meta')
        tag.setAttribute('property', 'og:locale:alternate')
        tag.setAttribute('content', langCode === 'tr' ? 'tr_TR' : 'en_US')
        document.head.appendChild(tag)
      })
    alternateEntries.forEach(([langCode, path]) => {
      const tag = document.createElement('link')
      tag.setAttribute('rel', 'alternate')
      tag.setAttribute('hreflang', langCode)
      tag.setAttribute('href', pageUrl(path))
      tag.setAttribute('data-route-alternate', 'true')
      document.head.appendChild(tag)
    })
    const englishPath = alternateEntries.find(([langCode]) => langCode === 'en')?.[1]
    if (englishPath) {
      const tag = document.createElement('link')
      tag.setAttribute('rel', 'alternate')
      tag.setAttribute('hreflang', 'x-default')
      tag.setAttribute('href', pageUrl(englishPath))
      tag.setAttribute('data-route-alternate', 'true')
      document.head.appendChild(tag)
    }
  }, [alternatesKey, canonicalPath, location.pathname, metaDescription, robots, title, type])
}

function useJsonLd(id: string, data: Record<string, unknown> | null) {
  useEffect(() => {
    const scriptId = `jsonld-${id}`
    let tag = document.getElementById(scriptId) as HTMLScriptElement | null

    if (!data) {
      tag?.remove()
      return
    }

    if (!tag) {
      tag = document.createElement('script')
      tag.id = scriptId
      tag.type = 'application/ld+json'
      document.head.appendChild(tag)
    }
    tag.textContent = JSON.stringify(data)

    return () => {
      tag?.remove()
    }
  }, [id, data])
}

function pageUrl(pathname: string) {
  return siteUrl(pathname)
}

/* Truncated to the precision the source actually carries: a piece dated only
   "Ekim 1969" publishes as `1969-10`, never as `1969-10-01` — the 1st is a
   sorting anchor, not something the archive knows. */
function isoDateFromArchiveDate(date?: string): string | undefined {
  if (!date) return undefined
  return isoDateAtKnownPrecision(date)
}

function pageAlternates(pathname: string): Partial<Record<Lang, string>> {
  const key = pageKeyForPath(pathname)
  const alternates: Partial<Record<Lang, string>> = {}
  if (paths.tr[key]) alternates.tr = paths.tr[key]
  if (paths.en[key]) alternates.en = paths.en[key]
  return alternates
}

function archiveBasePath(lang: Lang, item: ArchiveItem): string {
  switch (item.category) {
    case 'analyses':
      return paths[lang].analyses ?? paths[lang].columns!
    case 'interviews':
      return paths[lang].interviews ?? paths[lang].columns!
    case 'academic':
      return paths[lang].academic ?? paths[lang].columns!
    case 'columns':
      return paths[lang].columns!
  }
}

function Reveal({
  children,
  delay = 0,
  as = 'div',
  className,
  id,
  style,
}: {
  children: ReactNode
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article' | 'aside'
  className?: string
  id?: string
  style?: CSSProperties
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      id={id}
      style={style}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </MotionTag>
  )
}

const THEME_KEY = 'theme'
const LANG_KEY = 'lang'

/** null = follow the system, which is the documented default. */
function readStoredTheme(): 'light' | 'dark' | null {
  const stored = readStoredValue(THEME_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

function useTheme() {
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

function SunMoon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const lang = langForPath(location.pathname)
  const t = content[lang]
  const { toggle, isDark } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement | null>(null)
  const mobileNavRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return undefined
    const background = [
      ...document.querySelectorAll<HTMLElement>(
        '.wordmark, .nav, .lang-toggle, .theme-toggle',
      ),
      document.getElementById('main-content'),
      document.querySelector('footer'),
    ].filter(Boolean) as HTMLElement[]
    background.forEach((element) => element.setAttribute('inert', ''))

    const firstLink = mobileNavRef.current?.querySelector<HTMLAnchorElement>('a')
    const focusFrame = window.requestAnimationFrame(() => firstLink?.focus())

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        window.requestAnimationFrame(() => menuButtonRef.current?.focus())
        return
      }
      if (event.key !== 'Tab') return

      const links = Array.from(
        mobileNavRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [],
      )
      const focusables = [menuButtonRef.current, ...links].filter(Boolean) as HTMLElement[]
      const first = focusables[0]
      const last = focusables.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      background.forEach((element) => element.removeAttribute('inert'))
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const onToggleLang = () => {
    const target: Lang = lang === 'tr' ? 'en' : 'tr'
    writeStoredValue(LANG_KEY, target)
    navigate(equivalentPath(location.pathname, target))
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        {lang === 'tr' ? 'Ana içeriğe geç' : 'Skip to main content'}
      </a>
      <header className="site-header" data-scrolled={scrolled}>
        <div className="container header-inner">
          <Link to={paths[lang].home!} className="wordmark">
            Şahin <span>Alpay</span>
          </Link>
          <nav className="nav" aria-label={lang === 'tr' ? 'Ana menü' : 'Primary'}>
            {t.nav.map((n) => (
              <Link
                key={n.key}
                to={paths[lang][n.key]!}
                aria-current={
                  pageKeyForPath(location.pathname) === n.key ? 'page' : undefined
                }
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button
              type="button"
              className="mobile-menu-toggle"
              ref={menuButtonRef}
              aria-label={lang === 'tr' ? 'Menüyü aç veya kapat' : 'Open or close menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          <button
            type="button"
            className="lang-toggle"
            onClick={onToggleLang}
            aria-label={t.langToggleLabel}
            lang={lang === 'tr' ? 'en' : 'tr'}
          >
            {lang === 'tr' ? 'EN' : 'TR'}
          </button>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggle}
            aria-label={t.themeToggleLabel}
            aria-pressed={isDark}
          >
            <SunMoon />
          </button>
          </div>
        </div>
        <div
          className="mobile-nav-backdrop"
          data-open={menuOpen}
          onClick={() => {
            setMenuOpen(false)
            window.requestAnimationFrame(() => menuButtonRef.current?.focus())
          }}
          aria-hidden="true"
        />
        <nav
          id="mobile-nav"
          className="mobile-nav"
          ref={mobileNavRef}
          data-open={menuOpen}
          aria-label={lang === 'tr' ? 'Mobil menü' : 'Mobile menu'}
        >
          {t.nav.map((n) => (
            <Link
              key={n.key}
              to={paths[lang][n.key]!}
              aria-current={
                pageKeyForPath(location.pathname) === n.key ? 'page' : undefined
              }
              onClick={() => setMenuOpen(false)}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  )
}

function Hero({ t, lang }: { t: Content; lang: Lang }) {
  const reduce = useReducedMotion()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `${paths[lang].columns}?q=${encodeURIComponent(q)}` : paths[lang].columns!)
  }

  return (
    <section className="hero">
      <div className="container hero-grid">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="hero-eyebrow">{t.hero.eyebrow}</p>
          <h1 className="hero-name">
            Şahin <em>Alpay</em>
          </h1>
          <p className="hero-intro">{t.hero.intro}</p>
          <div className="hero-actions">
            <Link to={paths[lang].about!} className="btn btn-primary">
              {t.hero.ctaStory}
            </Link>
            <Link to={paths[lang].columns!} className="btn btn-ghost">
              {t.hero.ctaWorks}
            </Link>
          </div>
          <form className="hero-search" onSubmit={onSearch} role="search">
            <div className="hero-search-field">
              <span className="material-symbols-outlined" aria-hidden="true">
                search
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  lang === 'tr' ? 'Yazı veya konu ara…' : 'Search columns…'
                }
                aria-label={lang === 'tr' ? 'Arşivde ara' : 'Search the archive'}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {lang === 'tr' ? 'Ara' : 'Search'}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <div className="portrait-frame">
            <div className="portrait-echo" aria-hidden="true" />
            <figure className="portrait">
              {PORTRAIT ? (
                <img src={PORTRAIT} alt={t.hero.portraitAlt} />
              ) : (
                <div className="portrait-placeholder">
                  <span className="portrait-monogram">ŞA</span>
                </div>
              )}
              <figcaption className="portrait-caption">
                {t.hero.portraitCaption}
              </figcaption>
            </figure>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/** His avatar wherever the page already names him in adjacent text — the
 *  About aside and the article byline. Decorative in both cases, hence the
 *  empty alt. Falls back to the ŞA lettermark the site carried before a
 *  photo existed, so clearing PORTRAIT restores the old look everywhere at
 *  once rather than leaving one lone letterform behind. The frames are
 *  circles; `object-fit: cover` takes the centre square of the source,
 *  which lands on head and shoulders. */
function AuthorAvatar({ className }: { className: string }) {
  if (PORTRAIT) {
    return <img className={className} src={PORTRAIT} alt="" aria-hidden="true" />
  }
  return (
    <span className={className} aria-hidden="true">
      ŞA
    </span>
  )
}

const HUB_ICONS: Record<PageKey, string> = {
  home: 'home',
  about: 'person',
  columns: 'article',
  analyses: 'analytics',
  interviews: 'forum',
  academic: 'school',
  books: 'menu_book',
  chronicle: 'timeline',
  cookies: 'cookie',
}

/** Real item counts per section — never fabricated. Returns null where a
 *  count doesn't apply (e.g. the About page). */
function hubCount(
  key: PageKey,
  t: Content,
  lang: Lang,
  archiveData: ArchiveData | null,
): number | null {
  switch (key) {
    case 'columns':
      return archiveData
        ? archiveData.columns[lang].reduce((sum, o) => sum + o.items.length, 0)
        : null
    case 'analyses':
      return archiveData
        ? archiveData.analyses.reduce((sum, o) => sum + o.items.length, 0)
        : null
    case 'interviews':
      return archiveData?.interviews.length ?? null
    case 'academic':
      return archiveData?.academicArticles.length ?? null
    case 'books':
      return t.books.books.length
    default:
      return null
  }
}

function HubGrid({
  t,
  lang,
  archiveData,
}: {
  t: Content
  lang: Lang
  archiveData: ArchiveData | null
}) {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <p className="kicker">{t.hubKicker}</p>
          <h2 className="section-title">{t.hubTitle}</h2>
        </Reveal>
        <div className="hub-grid">
          {t.hub.map((h, i) => {
            const count = hubCount(h.key, t, lang, archiveData)
            const wide = h.key === 'columns' || h.key === 'books'
            return (
              <Reveal
                as="div"
                key={h.key}
                delay={(i % 4) * 0.06}
                className={wide ? 'hub-card-wide' : undefined}
              >
                <Link
                  to={paths[lang][h.key]!}
                  className={`hub-card hub-card-${h.key}`}
                  data-state={count === 0 ? 'pending' : 'filled'}
                >
                  <div className="hub-card-top">
                    <span
                      className="material-symbols-outlined hub-card-icon"
                      aria-hidden="true"
                    >
                      {HUB_ICONS[h.key]}
                    </span>
                    {count !== null &&
                      (count > 0 ? (
                        <span className="hub-card-count">
                          {count} {lang === 'tr' ? 'yazı' : 'pieces'}
                        </span>
                      ) : (
                        <span className="hub-card-count-empty">
                          {lang === 'tr' ? 'Yakında' : 'Coming soon'}
                        </span>
                      ))}
                  </div>
                  <div>
                    <h3>{h.title}</h3>
                    <p>{h.description}</p>
                    <span className="hub-arrow" aria-hidden="true">
                      {lang === 'tr' ? 'İncele' : 'Explore'}
                      <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--icon-md)' }}>
                        arrow_forward
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/** Deterministic mulberry32 PRNG — same seed always produces the same
 *  sequence, so every visitor sees the same picks during a given week. */
function mulberry32(seed: number): () => number {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** ISO-8601 week number combined with its year (e.g. 2026 week 3 -> 202603),
 *  so the seed — and therefore the picks below — changes once a week. */
function isoWeekKey(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = (d.getUTCDay() + 6) % 7
  d.setUTCDate(d.getUTCDate() - dayNum + 3)
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4))
  const firstThursdayDayNum = (firstThursday.getUTCDay() + 6) % 7
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstThursdayDayNum + 3)
  const week = 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 86400000))
  return d.getUTCFullYear() * 100 + week
}

/** A random-but-stable set of full articles, reshuffled once a week (not a
 *  fabricated "featured" pick — every item is real, just chosen by a seed
 *  that only changes on ISO week boundaries). */
function weeklyPicks(archiveData: ArchiveData, lang: Lang, count: number): ArchiveItem[] {
  const pool: ArchiveItem[] = [
    ...archiveData.columns[lang].flatMap((o) => o.items),
    ...(lang === 'tr' ? archiveData.analyses.flatMap((o) => o.items) : []),
  ].filter((item) => item.hasBody)

  const random = mulberry32(isoWeekKey(new Date()))
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, count)
}

function WeeklyPicks({
  lang,
  archiveData,
}: {
  lang: Lang
  archiveData: ArchiveData | null
}) {
  if (!archiveData) return null
  const items = weeklyPicks(archiveData, lang, 3)
  if (items.length === 0) return null

  return (
    <section className="section">
      <div className="container">
        <div className="recent-panel">
          <Reveal className="recent-panel-inner">
            <p className="kicker kicker-center">{lang === 'tr' ? 'Haftalık' : 'Weekly'}</p>
            <h2 className="section-title section-title-center">
              {lang === 'tr' ? 'Benden Seçkiler' : 'My Picks'}
            </h2>
          </Reveal>
          <div className="recent-grid">
            {items.map((item, i) => (
              <Reveal as="div" key={item.id} delay={i * 0.06}>
                <Link
                  to={`${archiveBasePath(lang, item)}/${item.slug}`}
                  className="recent-card"
                >
                  <div className="recent-card-media" aria-hidden="true">
                    <span className="material-symbols-outlined">article</span>
                  </div>
                  <span className="recent-card-meta">
                    {item.outlet}
                    {item.date ? ` · ${item.date}` : ''}
                  </span>
                  <h3>{item.title}</h3>
                  <span className="recent-card-cta">
                    {lang === 'tr' ? 'Oku' : 'Read'}
                    <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--icon-sm)' }}>
                      arrow_forward
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* One band per outlet that actually has material, placed on a shared year axis.
   Everything here is derived from the archive itself — no span is asserted for an
   outlet we have not recovered yet, so the empty stretches are honest gaps rather
   than a claim about when he did or didn't write. */
function CoverageStrip({
  archiveData,
  lang,
}: {
  archiveData: ArchiveData
  lang: Lang
}) {
  /* Every outlet, in both languages. The strip answers "what does this archive
     hold", and the archive is bilingual — filtering it by UI language would show
     an English reader 411 pieces from one paper instead of the real body of work.
     Outlet names are proper nouns, so they read the same either way. Academic
     Articles is the one row that isn't a named outlet — it groups a doctoral
     dissertation, book chapters and books rather than one publication, so its
     label is translated like any other UI string instead of staying fixed. */
  const groups = [
    ...archiveData.columns.tr,
    ...archiveData.columns.en,
    ...archiveData.analyses,
    {
      outlet: lang === 'tr' ? 'Akademik Makaleler' : 'Academic Articles',
      items: archiveData.academicArticles,
    },
  ]

  const bands = groups
    .map((group) => {
      const years = group.items
        .map((it) => (it.date ? parseTurkishDate(it.date) : null))
        .filter((ts): ts is number => ts != null)
        .map((ts) => new Date(ts).getUTCFullYear())
      if (!years.length) return null
      return {
        outlet: group.outlet,
        from: Math.min(...years),
        to: Math.max(...years),
        count: group.items.length,
      }
    })
    .filter((b): b is NonNullable<typeof b> => b != null)
    .sort((a, b) => a.from - b.from)

  if (!bands.length) return null

  const axisStart = Math.min(...bands.map((b) => b.from))
  const axisEnd = Math.max(...bands.map((b) => b.to))
  const span = Math.max(1, axisEnd - axisStart)

  /* Decade gridlines, so a band's position reads as a date and not just a shape. */
  const firstTick = Math.ceil(axisStart / 10) * 10
  const ticks: number[] = []
  for (let year = firstTick; year <= axisEnd; year += 10) ticks.push(year)

  return (
    <figure className="coverage">
      <figcaption className="sr-only">
        {lang === 'tr'
          ? `Yayın organlarına göre arşiv kapsamı, ${axisStart}–${axisEnd}`
          : `Archive coverage by publication, ${axisStart}–${axisEnd}`}
      </figcaption>
      <div className="coverage-rows">
        {bands.map((band) => (
          <div className="coverage-row" key={band.outlet}>
            <span className="coverage-outlet">{band.outlet}</span>
            <span className="coverage-track">
              <span
                className="coverage-band"
                style={{
                  left: `${((band.from - axisStart) / span) * 100}%`,
                  width: `${Math.max(1.5, ((band.to - band.from) / span) * 100)}%`,
                }}
              />
            </span>
            <span className="coverage-years">
              {band.from === band.to ? band.from : `${band.from}–${band.to}`}
            </span>
          </div>
        ))}
      </div>
      <div className="coverage-axis" aria-hidden="true">
        {ticks.map((year) => (
          <span
            className="coverage-tick"
            key={year}
            style={{ left: `${((year - axisStart) / span) * 100}%` }}
          >
            {year}
          </span>
        ))}
      </div>
    </figure>
  )
}

function AcademicHeritage({
  lang,
  archiveData,
}: {
  lang: Lang
  archiveData: ArchiveData | null
}) {
  return (
    <section className="section">
      <div className="container heritage-grid">
        <Reveal className="heritage-copy">
          <span className="badge-pill">
            <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--icon-sm)' }}>
              school
            </span>
            {lang === 'tr' ? 'Arşivin Kapsamı' : 'Archive Coverage'}
          </span>
          <h2 className="section-title">
            {lang === 'tr'
              ? 'Arşivde ne var, ne yok'
              : "What the archive holds — and what it doesn't"}
          </h2>
          <p className="lead">
            {lang === 'tr'
              ? 'Yarım yüzyıldan uzun bir yazı hayatı, hangi yayında hangi yıllara ulaşabildiğimizle birlikte. Boşluklar, henüz çıkaramadığımız dönemler.'
              : "More than half a century of writing, shown as the years we have reached in each publication. The gaps are periods we have not recovered yet."}
          </p>
          <div className="heritage-features">
            <div className="heritage-feature">
              <span className="material-symbols-outlined" aria-hidden="true">
                link
              </span>
              <div>
                <h3>{lang === 'tr' ? 'Gerçek Kaynaklar' : 'Real Sources'}</h3>
                <p>
                  {lang === 'tr'
                    ? 'Her yazı, orijinal yayınına doğrudan bağlantılıdır.'
                    : 'Every piece links directly back to its original publication.'}
                </p>
              </div>
            </div>
            <div className="heritage-feature">
              <span className="material-symbols-outlined" aria-hidden="true">
                update
              </span>
              <div>
                <h3>{lang === 'tr' ? 'Büyüyen Bir Arşiv' : 'A Growing Archive'}</h3>
                <p>
                  {lang === 'tr'
                    ? 'İçerik, zaman içinde yeni gazete küpürleri ve bağlantılarla genişletilmektedir.'
                    : 'Content keeps expanding over time with new clippings and links.'}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          {archiveData && <CoverageStrip archiveData={archiveData} lang={lang} />}
        </Reveal>
      </div>
    </section>
  )
}

function HomePage({ lang }: { lang: Lang }) {
  const t = content[lang]
  const { status: archiveStatus, data: archiveData, reload: reloadArchive } =
    useArchiveData()
  const navigate = useNavigate()
  const location = useLocation()
  usePageMeta({
    title: t.htmlTitle,
    description: t.htmlDescription,
    alternates: pageAlternates(location.pathname),
  })

  /* On a bare "/" visit (not a deep link), honour a previously chosen
     language so returning Turkish readers land on /tr automatically. */
  useEffect(() => {
    if (lang !== 'en' || location.pathname !== '/') return
    const saved = readStoredValue(LANG_KEY)
    const preferred: Lang =
      saved === 'tr' || saved === 'en'
        ? saved
        : navigator.language.toLowerCase().startsWith('tr')
          ? 'tr'
          : 'en'
    if (preferred === 'tr') navigate(paths.tr.home!, { replace: true })
  }, [lang, location.pathname, navigate])

  return (
    <>
      <Hero t={t} lang={lang} />
      {archiveStatus === 'error' && (
        <ArchiveInlineFailure lang={lang} onRetry={reloadArchive} />
      )}
      <HubGrid t={t} lang={lang} archiveData={archiveData} />
      <WeeklyPicks lang={lang} archiveData={archiveData} />
      <AcademicHeritage lang={lang} archiveData={archiveData} />
    </>
  )
}

function AboutPage({ lang }: { lang: Lang }) {
  const t = content[lang]
  const location = useLocation()
  usePageMeta({
    title: `${t.about.title} — Şahin Alpay`,
    description: t.about.lead,
    alternates: pageAlternates(location.pathname),
  })
  const previewBooks = t.books.books.slice(0, 3)
  return (
    <>
      <section className="section section-solo">
        <div className="container bio-grid">
          <Reveal className="bio-aside">
            <AuthorAvatar className="about-avatar" />
            <p className="kicker">{t.about.kicker}</p>
            <h1 className="section-title">{t.about.title}</h1>
            <blockquote className="pullquote">
              {t.about.quote}
              <cite>Şahin Alpay</cite>
            </blockquote>
          </Reveal>

          <Reveal className="prose" delay={0.1}>
            <p className="lead">{t.about.lead}</p>
            <div className="facts" role="list">
              {t.about.facts.map((f) => (
                <div role="listitem" key={f.label}>
                  <div className="fact-num">{f.num}</div>
                  <div className="fact-label">{f.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <p className="kicker">{lang === 'tr' ? 'Kişisel Tarih' : 'Personal History'}</p>
            <h2 className="section-title">
              {lang === 'tr' ? 'Bir Hayatın İzinde' : 'A Life in Stages'}
            </h2>
          </Reveal>
          <div className="timeline">
            {t.about.paragraphs.map((p, i) => (
              <Reveal as="div" key={t.about.eras[i]} className="timeline-item" delay={i * 0.08}>
                <span className="timeline-marker" aria-hidden="true" />
                <div className="timeline-card">
                  <span className="timeline-era">{t.about.eras[i]}</span>
                  <p>{p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <p className="kicker">{t.books.kicker}</p>
            <h2 className="section-title">
              {lang === 'tr' ? 'Seçili Bibliyografya' : 'Selected Bibliography'}
            </h2>
          </Reveal>
          <ul className="works-grid" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {previewBooks.map((b, i) => (
              <Reveal as="li" key={`${b.year}-${b.title}`} className="book" delay={i * 0.06}>
                <span className="book-spine" aria-hidden="true" />
                <span className="book-year">{b.year}</span>
                <h3 className="book-title">
                  <em lang="tr">{b.title}</em>
                </h3>
                <p className="book-desc">{b.desc}</p>
              </Reveal>
            ))}
          </ul>
          <div className="books-preview-cta">
            <Link to={paths[lang].books!} className="btn btn-primary">
              {lang === 'tr' ? 'Tüm Eserleri Görüntüle' : 'View all works'}
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--icon-md)' }}>
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

/** Where a row should link: internally to the full-article page when we
 *  have real body text or scanned clippings to show, externally to the
 *  source otherwise. Body/clippings win over a bare `url` so a scanned
 *  piece opens its own reader page instead of jumping straight to the
 *  (often third-party, sometimes defunct) source link. */
function archiveLink(
  item: ArchiveItem,
  lang: Lang,
): { href: string; internal: boolean } | null {
  if (item.hasBody || itemScanClippings(item).length > 0) {
    return { href: `${archiveBasePath(lang, item)}/${item.slug}`, internal: true }
  }
  if (item.url) return { href: item.url, internal: false }
  if (item.imageSrc) return { href: item.imageSrc, internal: false }
  return null
}

/** User-facing label for where a piece originally ran: printed newspaper
 *  column vs. online news-blog column (e.g. P24). */
function mediumLabel(medium: 'print' | 'online', lang: Lang): string {
  if (medium === 'print') return lang === 'tr' ? 'Gazete' : 'Print'
  return lang === 'tr' ? 'E-yayın' : 'Online'
}

/** User-facing label for whether a piece is his own column or an interview
    he conducted (see ArchivePieceKind). */
function pieceKindLabel(pieceKind: 'column' | 'interview', lang: Lang): string {
  if (pieceKind === 'interview') return lang === 'tr' ? 'Söyleşi' : 'Interview'
  return lang === 'tr' ? 'Köşe Yazısı' : 'Column'
}

function ArchiveRow({
  item,
  outlet,
  lang,
}: {
  item: ArchiveItem
  outlet?: string
  lang: Lang
}) {
  const link = archiveLink(item, lang)
  const preview = item.excerpt ?? item.subtitle
  const inner = (
    <>
      <div className="archive-row-meta">
        {item.date && <span className="archive-row-date">{item.date}</span>}
        {outlet && <span className="archive-row-outlet">{outlet}</span>}
        {item.medium && (
          <span className="archive-row-badge">{mediumLabel(item.medium, lang)}</span>
        )}
        {item.pieceKind && (
          <span className="archive-row-badge">{pieceKindLabel(item.pieceKind, lang)}</span>
        )}
        {itemScanClippings(item).length ? (
          <span className="archive-row-badge archive-row-badge-scan">
            {lang === 'tr' ? 'Kupür' : 'Clipping'}
          </span>
        ) : null}
      </div>
      <div className="archive-row-body">
        <h3 className="archive-row-title">{item.title}</h3>
        {preview && <p className="archive-row-excerpt">{preview}</p>}
      </div>
      {link && (
        <span className="archive-row-arrow material-symbols-outlined" aria-hidden="true">
          arrow_forward
        </span>
      )}
    </>
  )
  if (link?.internal) {
    return (
      <li>
        <Link to={link.href} className="archive-row">
          {inner}
        </Link>
      </li>
    )
  }
  if (link) {
    return (
      <li>
        <a
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="archive-row"
          aria-label={`${item.title} ${
            lang === 'tr' ? '(yeni sekmede açılır)' : '(opens in a new tab)'
          }`}
        >
          {inner}
        </a>
      </li>
    )
  }
  return (
    <li>
      <div className="archive-row archive-row-static">{inner}</div>
    </li>
  )
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timeout)
  }, [value, delayMs])
  return debounced
}

/** Lazily loads full body text once the user searches. The returned map is
 *  both the search input and the state change that triggers re-filtering. */
interface BodySearchState {
  bodyIndex: ReadonlyMap<string, string[]>
  /** Bodies are being fetched; results so far cover metadata only. */
  searching: boolean
  /** The fetch failed, so results are metadata-only and possibly incomplete. */
  failed: boolean
  retry: () => void
}

function useBodySearchIndex(items: ArchiveItem[], search: string): BodySearchState {
  const debouncedSearch = useDebouncedValue(search, 400)
  const [bodyIndex, setBodyIndex] = useState<ReadonlyMap<string, string[]>>(
    () => new Map(),
  )
  const [searching, setSearching] = useState(false)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!debouncedSearch) {
      setSearching(false)
      setFailed(false)
      return
    }
    let cancelled = false
    setSearching(true)
    setFailed(false)
    loadOutletBodies(items)
      .then(() => {
        if (cancelled) return
        setSearching(false)
        setBodyIndex(
          new Map(
            items.flatMap((item) => {
              const body = getCachedBody(item)
              return body ? [[archiveItemKey(item), body] as const] : []
            }),
          ),
        )
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setSearching(false)
        /* Results still render, but only from titles, excerpts and tags.
           Saying so beats returning a confidently short list. */
        setFailed(true)
        console.error('Failed to load body text for search', error)
      })
    return () => {
      cancelled = true
    }
  }, [debouncedSearch, items, attempt])

  return {
    bodyIndex,
    searching,
    failed,
    retry: () => setAttempt((value) => value + 1),
  }
}

function sourceKindLabel(kind: SourceKind, lang: Lang) {
  if (kind === 'digital') return lang === 'tr' ? 'Dijital metin' : 'Digital text'
  if (kind === 'clipping') return lang === 'tr' ? 'Gazete kupürü' : 'Clipping'
  return lang === 'tr' ? 'Tüm kaynaklar' : 'All sources'
}

function updateSearchParams(
  searchParams: URLSearchParams,
  setSearchParams: ReturnType<typeof useSearchParams>[1],
  patch: Record<string, string | null>,
  options: { replace?: boolean; keepPage?: boolean } = {},
) {
  const next = new URLSearchParams(searchParams)
  Object.entries(patch).forEach(([key, value]) => {
    if (!value || value === 'all' || (key === 'sort' && value === 'newest') || (key === 'page' && value === '1')) {
      next.delete(key)
    } else {
      next.set(key, value)
    }
  })
  if (!options.keepPage && !('page' in patch)) next.delete('page')
  setSearchParams(next, { replace: options.replace ?? true })
}

type ActiveFilter = {
  key: string
  label: string
  value: string
  onClear: () => void
}

/* Search is the primary task on an archive page, not one filter among several.
   It lives outside the collapsible panel so a phone user can always see what
   they searched for and change it without opening anything. */
function ArchiveSearchRow({
  lang,
  search,
  setSearch,
  bodySearch,
}: {
  lang: Lang
  search: string
  setSearch: (value: string) => void
  bodySearch: BodySearchState
}) {
  return (
    <div className="archive-search-row">
      <div className="search-field">
        <span className="material-symbols-outlined" aria-hidden="true">
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={lang === 'tr' ? 'Ara…' : 'Search…'}
          aria-label={lang === 'tr' ? 'Arşivde ara' : 'Search archive'}
        />
      </div>
      {bodySearch.searching && (
        <p className="search-status" role="status" aria-live="polite" aria-atomic="true">
          {lang === 'tr' ? 'İçerik aranıyor…' : 'Searching full text…'}
        </p>
      )}
      {bodySearch.failed && (
        <p className="search-status search-status-warning" role="alert">
          <span className="material-symbols-outlined" aria-hidden="true">
            warning
          </span>
          {lang === 'tr'
            ? 'Tam metin yüklenemedi; sonuçlar yalnızca başlık, özet ve etiketlere göre.'
            : 'Full text could not be loaded; results cover titles, summaries and tags only.'}{' '}
          <button type="button" className="link-button" onClick={bodySearch.retry}>
            {lang === 'tr' ? 'Yeniden dene' : 'Try again'}
          </button>
        </p>
      )}
    </div>
  )
}

function ActiveFilterSummary({
  lang,
  filters,
  count,
  onClearAll,
}: {
  lang: Lang
  filters: ActiveFilter[]
  count: number
  onClearAll: () => void
}) {
  return (
    <div className="active-filter-summary" aria-live="polite">
      <span className="archive-count">
        {lang === 'tr' ? `${count} yazı` : `${count} pieces`}
      </span>
      {filters.length > 0 && (
        <div className="active-filter-chips">
          {filters.map((filter) => (
            <button
              type="button"
              className="active-filter-chip"
              key={filter.key}
              onClick={filter.onClear}
              aria-label={
                lang === 'tr'
                  ? `${filter.label} filtresini kaldır`
                  : `Remove ${filter.label} filter`
              }
            >
              <span>
                {filter.label}: {filter.value}
              </span>
              <span className="material-symbols-outlined" aria-hidden="true">
                close
              </span>
            </button>
          ))}
          <button type="button" className="filter-reset filter-reset-inline" onClick={onClearAll}>
            {lang === 'tr' ? 'Tümünü temizle' : 'Clear all'}
          </button>
        </div>
      )}
    </div>
  )
}

function YearRangeFilter({
  lang,
  fromYear,
  toYear,
  setFromYear,
  setToYear,
}: {
  lang: Lang
  fromYear: string
  toYear: string
  setFromYear: (v: string) => void
  setToYear: (v: string) => void
}) {
  return (
    <div className="filter-card">
      <h3>{lang === 'tr' ? 'Yıl Aralığı' : 'Year range'}</h3>
      <div className="date-range">
        <label>
          {lang === 'tr' ? 'Başlangıç' : 'From'}
          <input
            type="number"
            inputMode="numeric"
            placeholder="1970"
            value={fromYear}
            onChange={(e) => setFromYear(e.target.value)}
          />
        </label>
        <label>
          {lang === 'tr' ? 'Bitiş' : 'To'}
          <input
            type="number"
            inputMode="numeric"
            placeholder="2026"
            value={toYear}
            onChange={(e) => setToYear(e.target.value)}
          />
        </label>
      </div>
    </div>
  )
}

function SortSelect({
  lang,
  sort,
  setSort,
}: {
  lang: Lang
  sort: SortOrder
  setSort: (v: SortOrder) => void
}) {
  return (
    <select
      className="sort-select"
      value={sort}
      onChange={(e) => setSort(e.target.value as SortOrder)}
      aria-label={lang === 'tr' ? 'Sırala' : 'Sort'}
    >
      <option value="newest">{lang === 'tr' ? 'En Yeni' : 'Newest'}</option>
      <option value="oldest">{lang === 'tr' ? 'En Eski' : 'Oldest'}</option>
    </select>
  )
}

function SourceKindFilter({
  lang,
  sourceKind,
  setSourceKind,
}: {
  lang: Lang
  sourceKind: SourceKind
  setSourceKind: (v: SourceKind) => void
}) {
  const options: { value: SourceKind; label: string }[] = [
    { value: 'all', label: lang === 'tr' ? 'Tüm kaynaklar' : 'All sources' },
    { value: 'digital', label: lang === 'tr' ? 'Dijital metin' : 'Digital text' },
    { value: 'clipping', label: lang === 'tr' ? 'Gazete kupürü' : 'Clipping' },
  ]

  return (
    <div className="filter-card">
      <h3>{lang === 'tr' ? 'Kaynak Türü' : 'Source type'}</h3>
      <div className="chip-row">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className="chip"
            data-active={sourceKind === option.value}
            aria-pressed={sourceKind === option.value}
            onClick={() => setSourceKind(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Pagination({
  lang,
  currentPage,
  totalPages,
  onPageChange,
}: {
  lang: Lang
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  /* Paginating changes only the query string, so MainShell's pathname-keyed scroll
     reset never fires: the reader stays where they were and ends up looking at the
     tail of the new page, with the count and controls off-screen above. It reads as
     "the button did nothing". Scrolling here rather than on a location.search effect
     is deliberate — search updates the query string on every keystroke, and that
     effect would yank the page around while someone is typing. */
  const goToPage = (page: number) => {
    onPageChange(page)
    const main = document.querySelector('.archive-main')
    if (!main) return
    // 'instant' is required: index.css sets html { scroll-behavior: smooth }.
    main.scrollIntoView({ block: 'start', behavior: 'instant' })
    const heading = main.querySelector<HTMLElement>('#archive-results')
    heading?.focus({ preventScroll: true })
  }

  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= 1,
  )

  return (
    <nav className="pagination" aria-label={lang === 'tr' ? 'Sayfalama' : 'Pagination'}>
      <button
        type="button"
        className="pagination-btn"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={
          lang === 'tr'
            ? `Önceki sayfaya git, şu an ${currentPage}. sayfa`
            : `Go to previous page, currently page ${currentPage}`
        }
      >
        {lang === 'tr' ? 'Önceki' : 'Previous'}
      </button>
      <div className="pagination-pages">
        {pages.map((page, index) => {
          const previous = pages[index - 1]
          const hasGap = previous && page - previous > 1
          return (
            <span className="pagination-page-wrap" key={page}>
              {hasGap && <span className="pagination-gap">…</span>}
              <button
                type="button"
                className="pagination-page"
                data-active={currentPage === page}
                aria-current={currentPage === page ? 'page' : undefined}
                aria-label={
                  lang === 'tr' ? `${page}. sayfaya git` : `Go to page ${page}`
                }
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            </span>
          )
        })}
      </div>
      <button
        type="button"
        className="pagination-btn"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label={
          lang === 'tr'
            ? `Sonraki sayfaya git, şu an ${currentPage}. sayfa`
            : `Go to next page, currently page ${currentPage}`
        }
      >
        {lang === 'tr' ? 'Sonraki' : 'Next'}
      </button>
    </nav>
  )
}

function outletDateRangeLabel(items: ArchiveItem[]): string | null {
  const years = items
    .map((item) => (item.date ? parseTurkishDate(item.date) : null))
    .filter((ts): ts is number => ts !== null)
    .map((ts) => new Date(ts).getUTCFullYear())
  if (years.length === 0) return null
  const min = Math.min(...years)
  const max = Math.max(...years)
  return min === max ? String(min) : `${min}–${max}`
}

/** Real mastheads the owner supplied for the outlets that currently have
    one on disk. Outlets with no entry here fall back to a typographic
    wordmark — on the shelf's upright spines (NewsstandStackPaper) as
    rotated text, in the İçindekiler header (NewsstandTOC) as plain text —
    rather than a fabricated logo. Shown upright (never rotated) on the
    spine face: these are wide wordmark scans that go illegible sideways. */
const outletLogos: Partial<Record<string, string>> = {
  'Aydınlık (Sosyalist Dergi/Proleter Devrimci)': logoAydinlik,
  Cumhuriyet: logoCumhuriyet,
  Forum: logoForum,
  'İşçi Köylü': logoIsciKoylu,
  Milliyet: logoMilliyet,
  Zaman: logoZaman,
  "Today's Zaman": logoTodaysZaman,
  P24: logoP24,
  Sabah: logoSabah,
}

/** Most recent year an outlet was written for, used to order the rack
    top-to-bottom (most recent era first, matching this file's newest-first
    convention elsewhere). 0 for an outlet with no parseable dates, so it
    sorts last rather than throwing off real ones. */
function outletSortYear(items: ArchiveItem[]): number {
  const years = items
    .map((item) => (item.date ? parseTurkishDate(item.date) : null))
    .filter((ts): ts is number => ts !== null)
    .map((ts) => new Date(ts).getUTCFullYear())
  return years.length ? Math.max(...years) : 0
}

/** Shared ordering for the shelf: newest era first, both for the stack of
    spines and for which one is selected by default — kept as one function
    so the two never drift apart. */
function orderNewsstandOutlets(entries: NewsstandOutlet[]): NewsstandOutlet[] {
  return [...entries].sort(
    (a, b) => outletSortYear(b.outlet.items) - outletSortYear(a.outlet.items),
  )
}

/** Brand colors for the outlets we actually have (matched to their real
    mastheads where known); an unbranded outlet falls back to the site's
    wood-edge tone rather than a guessed color. */
const outletAccent: Partial<Record<string, string>> = {
  'Aydınlık (Sosyalist Dergi/Proleter Devrimci)': '#a44e8c',
  Milliyet: '#b3241c',
  Cumhuriyet: '#e30512',
  Forum: '#9c1c22',
  /* The masthead red as it survives on the newsprint scan, darkened just
     enough for the white band label to clear contrast. */
  'İşçi Köylü': '#b34435',
  Sabah: '#da251c',
  Zaman: '#8a6a1f',
  "Today's Zaman": '#6d5518',
  P24: '#231f21',
}
const defaultOutletAccent = '#5c3f27'

function outletAccentFor(outletName: string): string {
  return outletAccent[outletName] ?? defaultOutletAccent
}

/** One upright spine standing on the shelf rail — clicking it lifts it
    forward (see NewsstandStack). Text-only (accent strip + rotated outlet
    name/count), matching the reference design's book-spine treatment. */
function NewsstandStackPaper({
  outlet,
  count,
  dateRange,
  lang,
  active,
  reduce,
  onSelect,
}: {
  outlet: OutletGroup
  count: number
  dateRange: string | null
  lang: Lang
  active: boolean
  reduce: boolean
  onSelect: () => void
}) {
  const accent = outletAccentFor(outlet.outlet)
  const logo = outletLogos[outlet.outlet]
  /* A real outlet the owner is going to write into (Sabah, Zaman, Today's
     Zaman today) but that has no pieces yet — still stood on the shelf
     with its real branding, rather than hidden, so the rack doesn't read
     as sparsely stocked; "Yakında" instead of a "0 yazı" that would read
     as broken. */
  const isEmpty = outlet.items.length === 0
  const style: CSSProperties = {
    zIndex: active ? 2 : 1,
    ...(reduce
      ? {}
      : {
          transform: active ? 'translate3d(8px, 0, 0) scale(1.03)' : 'translate3d(0, 0, 0) scale(1)',
          filter: active ? 'brightness(1.05)' : 'brightness(.86)',
        }),
  }
  return (
    <button
      type="button"
      className="newsstand-stack-paper"
      data-active={active}
      data-empty={isEmpty}
      style={style}
      onClick={onSelect}
      aria-pressed={active}
    >
      <span className="newsstand-stack-paper-inner">
        <span className="newsstand-stack-paper-strip" style={{ background: accent }}>
          <span className="newsstand-stack-paper-strip-text">
            {dateRange ?? (lang === 'tr' ? 'Arşiv' : 'Archive')}
          </span>
        </span>
        <span className="newsstand-stack-paper-face" data-has-logo={Boolean(logo)}>
          {logo ? (
            <span className="newsstand-stack-paper-logo-wrap">
              <img src={logo} alt={outlet.outlet} className="newsstand-stack-paper-logo" />
            </span>
          ) : (
            <span className="newsstand-stack-paper-name">{outlet.outlet}</span>
          )}
          <span className={logo ? 'newsstand-stack-paper-count-h' : 'newsstand-stack-paper-count'}>
            {isEmpty ? (lang === 'tr' ? 'Yakında' : 'Coming soon') : lang === 'tr' ? `${count} yazı` : `${count} pieces`}
          </span>
        </span>
      </span>
      <span className="newsstand-stack-paper-clip" aria-hidden="true" />
    </button>
  )
}

interface NewsstandOutlet {
  outlet: OutletGroup
  matchingItems: ArchiveItem[]
}

function deriveNewsstandOutlets(
  outlets: OutletGroup[],
  activeOutlet: string,
  search: string,
  fromYear: string,
  toYear: string,
  bodyIndex: ReadonlyMap<string, string[]>,
): NewsstandOutlet[] {
  return outlets
    .filter((o) => activeOutlet === 'all' || o.outlet === activeOutlet)
    .map((o) => ({
      outlet: o,
      matchingItems: sortByDate(
        o.items.filter((item) =>
          matchesFilters(item, search, fromYear, toYear, 'all', bodyIndex),
        ),
        (item) => item.date,
        'newest',
      ),
    }))
    .filter((entry) => entry.outlet.items.length === 0 || entry.matchingItems.length > 0)
}

/** A single row inside the open paper's "İçindekiler" (table of contents)
    panel — reuses ArchiveRow's link-resolution rules (internal reader page
    when we have body/clippings, external source otherwise) but in the
    design's three-column masthead-index layout instead of ArchiveRow's
    card shape. */
function NewsstandTOCRow({ item, lang }: { item: ArchiveItem; lang: Lang }) {
  const link = archiveLink(item, lang)
  const section = item.pieceKind
    ? pieceKindLabel(item.pieceKind, lang)
    : item.medium
      ? mediumLabel(item.medium, lang)
      : lang === 'tr'
        ? 'Yazı'
        : 'Piece'
  const preview = item.excerpt ?? item.subtitle
  const isScan = itemScanClippings(item).length > 0
  const inner = (
    <>
      <span className="newsstand-toc-row-section">
        {section}
        {/* Provenance, not decoration: on a first-party archive the reader
            has to be able to tell a full-text piece from one that survives
            only as a page scan — the same badge the other archive lists
            carry (see ArchiveRow). */}
        {isScan && (
          <span className="archive-row-badge archive-row-badge-scan">
            {lang === 'tr' ? 'Kupür' : 'Clipping'}
          </span>
        )}
      </span>
      <span className="newsstand-toc-row-body">
        <span className="newsstand-toc-row-title">{item.title}</span>
        {preview && <span className="newsstand-toc-row-dek">{preview}</span>}
      </span>
      {item.date && <span className="newsstand-toc-row-date">{item.date}</span>}
    </>
  )
  if (link?.internal) {
    return (
      <li>
        <Link to={link.href} className="newsstand-toc-row">
          {inner}
        </Link>
      </li>
    )
  }
  if (link) {
    return (
      <li>
        <a
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="newsstand-toc-row"
          aria-label={`${item.title} ${
            lang === 'tr' ? '(yeni sekmede açılır)' : '(opens in a new tab)'
          }`}
        >
          {inner}
        </a>
      </li>
    )
  }
  return (
    <li>
      <div className="newsstand-toc-row newsstand-toc-row-static">{inner}</div>
    </li>
  )
}

function NewsstandTOC({
  outlet,
  matchingCount,
  items,
  lang,
  currentPage,
  totalPages,
  onPageChange,
}: {
  outlet: OutletGroup
  matchingCount: number
  items: ArchiveItem[]
  lang: Lang
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const dateRange = outletDateRangeLabel(outlet.items)
  const logo = outletLogos[outlet.outlet]
  return (
    <div className="newsstand-toc archive-main">
      {/* Focus target for pagination, so a page change is announced and not
          just scrolled to (see Pagination's goToPage). */}
      <h2 className="sr-only" id="archive-results" tabIndex={-1}>
        {lang === 'tr' ? 'Sonuçlar' : 'Results'}
      </h2>
      <div className="newsstand-toc-header">
        <div className="newsstand-toc-heading">
          <span className="newsstand-toc-kicker">
            {lang === 'tr' ? 'İçindekiler' : 'Contents'}
          </span>
          {logo ? (
            <img src={logo} alt={outlet.outlet} className="newsstand-toc-logo" />
          ) : (
            <span className="newsstand-toc-name">{outlet.outlet}</span>
          )}
        </div>
        <div className="newsstand-toc-meta">
          {dateRange && <span>{dateRange}</span>}
          <span>{lang === 'tr' ? `${matchingCount} yazı` : `${matchingCount} pieces`}</span>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="archive-empty">
          {outlet.items.length === 0
            ? lang === 'tr'
              ? 'Bu yayının yazıları yakında eklenecek.'
              : "This outlet's pieces are coming soon."
            : lang === 'tr'
              ? 'Filtreyle eşleşen yazı yok.'
              : 'No pieces match these filters.'}
        </p>
      ) : (
        <ul className="newsstand-toc-list">
          {items.map((item) => (
            <NewsstandTOCRow item={item} lang={lang} key={item.id} />
          ))}
        </ul>
      )}
      <Pagination
        lang={lang}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )
}

/** The newsstand shelf: upright paper spines standing on a rail (click one
    to lift it forward) with a table-of-contents panel below for whichever
    paper is selected — always one, defaulting to the newest, rather than
    an empty rack waiting for a click. */
function NewsstandStack({
  entries,
  lang,
  selectedName,
  onSelect,
  currentPage,
  totalPages,
  onPageChange,
  reduce,
}: {
  entries: NewsstandOutlet[]
  lang: Lang
  selectedName: string
  onSelect: (outletName: string) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  reduce: boolean
}) {
  const ordered = orderNewsstandOutlets(entries)
  const selected = ordered.find((entry) => entry.outlet.outlet === selectedName) ?? ordered[0]
  const activeItems = selected ? pageSlice(selected.matchingItems, currentPage) : []

  return (
    <div className="newsstand-stack">
      <div
        className="newsstand-stack-shelf"
        role="group"
        aria-label={lang === 'tr' ? 'Gazete seç' : 'Choose a newspaper'}
      >
        {ordered.map((entry) => (
          <NewsstandStackPaper
            key={entry.outlet.outlet}
            outlet={entry.outlet}
            count={entry.matchingItems.length}
            dateRange={outletDateRangeLabel(entry.outlet.items)}
            lang={lang}
            active={selected?.outlet.outlet === entry.outlet.outlet}
            reduce={reduce}
            onSelect={() => onSelect(entry.outlet.outlet)}
          />
        ))}
      </div>
      {selected && (
        <NewsstandTOC
          outlet={selected.outlet}
          matchingCount={selected.matchingItems.length}
          items={activeItems}
          lang={lang}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}

function NewsstandControlBar({
  lang,
  search,
  setSearch,
  bodySearch,
  fromYear,
  toYear,
  setFromYear,
  setToYear,
}: {
  lang: Lang
  search: string
  setSearch: (value: string) => void
  bodySearch: BodySearchState
  fromYear: string
  toYear: string
  setFromYear: (value: string) => void
  setToYear: (value: string) => void
}) {
  return (
    <div className="newsstand-controlbar">
      <div className="newsstand-controlbar-top">
        <ArchiveSearchRow
          lang={lang}
          search={search}
          setSearch={setSearch}
          bodySearch={bodySearch}
        />
      </div>
      <div className="newsstand-controlbar-filters">
        {/* No outlet chips here: the shelf's own spines are the outlet
            selector, and they carry the masthead, count and date range a
            chip cannot. Two controls with the same labels and different
            meanings (chips filtered the rack away, spines opened it) was
            the page's worst consistency defect. */}
        <YearRangeFilter
          lang={lang}
          fromYear={fromYear}
          toYear={toYear}
          setFromYear={setFromYear}
          setToYear={setToYear}
        />
      </div>
    </div>
  )
}

function NewsstandArchivePage({ data, lang }: { data: OutletArchiveSection; lang: Lang }) {
  const location = useLocation()
  usePageMeta({
    title: `${data.title} — Şahin Alpay`,
    description: data.intro,
    alternates: pageAlternates(location.pathname),
  })
  useJsonLd('collection', {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: data.title,
    description: data.intro,
    inLanguage: lang,
    url: pageUrl(location.pathname),
    about: { '@id': PERSON_ID },
    mainEntity: data.outlets.flatMap((group) =>
      group.items.slice(0, 25).map((item) => ({
        '@type': 'Article',
        headline: item.title,
        ...(isoDateFromArchiveDate(item.date)
          ? { datePublished: isoDateFromArchiveDate(item.date) }
          : {}),
        url: `${pageUrl(archiveBasePath(lang, item))}/${item.slug}`,
      })),
    ),
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const reduce = useReducedMotion()
  const search = searchParams.get('q') ?? ''
  const activeOutlet = searchParams.get('outlet') ?? 'all'
  const fromYear = searchParams.get('from') ?? ''
  const toYear = searchParams.get('to') ?? ''
  const openOutletName = searchParams.get('open')
  const requestedPage = positivePage(searchParams.get('page'))

  const sectionItems = useMemo(() => data.outlets.flatMap((o) => o.items), [data.outlets])
  const bodySearch = useBodySearchIndex(sectionItems, search)
  const { bodyIndex } = bodySearch

  const newsstandOutlets = useMemo(
    () => deriveNewsstandOutlets(data.outlets, activeOutlet, search, fromYear, toYear, bodyIndex),
    [data.outlets, activeOutlet, search, fromYear, toYear, bodyIndex],
  )

  /* The shelf always shows a table of contents — defaulting to the newest
     paper — rather than an empty rack waiting for a click, so it needs a
     selection even with no `open` param, and one that's still valid if a
     filter just dropped the outlet it pointed at. */
  const effectiveOpenName =
    openOutletName && newsstandOutlets.some((entry) => entry.outlet.outlet === openOutletName)
      ? openOutletName
      : (orderNewsstandOutlets(newsstandOutlets)[0]?.outlet.outlet ?? null)

  const openedEntry = effectiveOpenName
    ? newsstandOutlets.find((entry) => entry.outlet.outlet === effectiveOpenName) ?? null
    : null

  const totalPages = openedEntry
    ? totalPagesFor(openedEntry.matchingItems.length)
    : 1
  const currentPage = clampPage(requestedPage, openedEntry?.matchingItems.length ?? 0)

  const setParam = (
    key: string,
    value: string | null,
    options?: { replace?: boolean; keepPage?: boolean },
  ) => updateSearchParams(searchParams, setSearchParams, { [key]: value }, options)

  const activeFilters: ActiveFilter[] = [
    search && {
      key: 'q',
      label: lang === 'tr' ? 'Arama' : 'Search',
      value: search,
      onClear: () => setParam('q', null),
    },
    activeOutlet !== 'all' && {
      key: 'outlet',
      label: lang === 'tr' ? 'Yayın' : 'Outlet',
      value: activeOutlet,
      onClear: () => setParam('outlet', null),
    },
    fromYear && {
      key: 'from',
      label: lang === 'tr' ? 'Başlangıç' : 'From',
      value: fromYear,
      onClear: () => setParam('from', null),
    },
    toYear && {
      key: 'to',
      label: lang === 'tr' ? 'Bitiş' : 'To',
      value: toYear,
      onClear: () => setParam('to', null),
    },
  ].filter(Boolean) as ActiveFilter[]

  return (
    <section className="section section-solo">
      <div className="container">
        <Reveal>
          <p className="kicker">{data.kicker}</p>
          <h1 className="section-title">{data.title}</h1>
          <p className="archive-intro">{data.intro}</p>
        </Reveal>

        <NewsstandControlBar
          lang={lang}
          search={search}
          setSearch={(value) => setParam('q', value)}
          bodySearch={bodySearch}
          fromYear={fromYear}
          toYear={toYear}
          setFromYear={(value) => setParam('from', value)}
          setToYear={(value) => setParam('to', value)}
        />

        <ActiveFilterSummary
          lang={lang}
          filters={activeFilters}
          count={newsstandOutlets.reduce((sum, entry) => sum + entry.matchingItems.length, 0)}
          onClearAll={() => setSearchParams(new URLSearchParams(), { replace: true })}
        />
      {/* The shelf stays inside .container like every other page's content:
          its identity comes from the real mastheads, not from touching the
          viewport edge. */}
      <AnimatePresence mode="wait" initial={false}>
        {!data.outlets.some((o) => o.items.length > 0) ? (
          <p className="archive-empty" key="empty">
            {data.emptyLabel}
          </p>
        ) : newsstandOutlets.length === 0 ? (
          <p className="archive-empty" key="empty-filtered">
            {lang === 'tr' ? 'Filtreyle eşleşen gazete yok.' : 'No newspapers match these filters.'}
          </p>
        ) : (
          <motion.div
            key="stage-stack"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
          >
            <NewsstandStack
              entries={newsstandOutlets}
              lang={lang}
              selectedName={
                effectiveOpenName ?? orderNewsstandOutlets(newsstandOutlets)[0].outlet.outlet
              }
              onSelect={(outletName) => setParam('open', outletName, { replace: false })}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) =>
                updateSearchParams(
                  searchParams,
                  setSearchParams,
                  { page: String(page) },
                  { replace: false, keepPage: true },
                )
              }
              reduce={Boolean(reduce)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </section>
  )
}

function FlatArchivePage({ data, lang }: { data: FlatArchiveSection; lang: Lang }) {
  const location = useLocation()
  usePageMeta({
    title: `${data.title} — Şahin Alpay`,
    description: data.intro,
    alternates: pageAlternates(location.pathname),
  })
  useJsonLd('collection', {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: data.title,
    description: data.intro,
    inLanguage: lang,
    url: pageUrl(location.pathname),
    about: { '@id': PERSON_ID },
    mainEntity: data.items.slice(0, 25).map((item) => ({
      '@type': 'Article',
      headline: item.title,
      ...(isoDateFromArchiveDate(item.date)
        ? { datePublished: isoDateFromArchiveDate(item.date) }
        : {}),
      url: `${pageUrl(location.pathname)}/${item.slug}`,
    })),
  })
  const [searchParams, setSearchParams] = useSearchParams()
  /* Arriving on a filtered URL opens the panel, so the controls that produced the
     result are visible rather than hidden behind a button. Search is excluded —
     it has its own always-visible row and shouldn't force the panel open. */
  const [filtersOpen, setFiltersOpen] = useState(() =>
    ['outlet', 'from', 'to', 'source'].some((key) => searchParams.get(key)),
  )
  const search = searchParams.get('q') ?? ''
  const fromYear = searchParams.get('from') ?? ''
  const toYear = searchParams.get('to') ?? ''
  const sort = validSort(searchParams.get('sort'))
  const sourceKind = validSourceKind(searchParams.get('source'))
  const requestedPage = positivePage(searchParams.get('page'))

  const bodySearch = useBodySearchIndex(data.items, search)
  const { bodyIndex } = bodySearch
  const filtered = useMemo(
    () =>
      sortItems(
        data.items.filter((item) =>
          matchesFilters(item, search, fromYear, toYear, sourceKind, bodyIndex),
        ),
        sort,
      ),
    [data.items, search, fromYear, toYear, sourceKind, sort, bodyIndex],
  )
  const totalPages = totalPagesFor(filtered.length)
  const currentPage = clampPage(requestedPage, filtered.length)
  const paginated = pageSlice(filtered, currentPage)

  const setParam = (key: string, value: string | null, options?: { replace?: boolean; keepPage?: boolean }) =>
    updateSearchParams(searchParams, setSearchParams, { [key]: value }, options)

  const resetFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }

  const activeFilters: ActiveFilter[] = [
    search && {
      key: 'q',
      label: lang === 'tr' ? 'Arama' : 'Search',
      value: search,
      onClear: () => setParam('q', null),
    },
    fromYear && {
      key: 'from',
      label: lang === 'tr' ? 'Başlangıç' : 'From',
      value: fromYear,
      onClear: () => setParam('from', null),
    },
    toYear && {
      key: 'to',
      label: lang === 'tr' ? 'Bitiş' : 'To',
      value: toYear,
      onClear: () => setParam('to', null),
    },
    sourceKind !== 'all' && {
      key: 'source',
      label: lang === 'tr' ? 'Kaynak' : 'Source',
      value: sourceKindLabel(sourceKind, lang),
      onClear: () => setParam('source', null),
    },
    sort !== 'newest' && {
      key: 'sort',
      label: lang === 'tr' ? 'Sıralama' : 'Sort',
      value: lang === 'tr' ? 'En eski' : 'Oldest',
      onClear: () => setParam('sort', null),
    },
  ].filter(Boolean) as ActiveFilter[]

  return (
    <section className="section section-solo">
      <div className="container">
        <Reveal>
          <p className="kicker">{data.kicker}</p>
          <h1 className="section-title">{data.title}</h1>
          <p className="archive-intro">{data.intro}</p>
        </Reveal>

        <ArchiveSearchRow
          lang={lang}
          search={search}
          setSearch={(value) => setParam('q', value)}
          bodySearch={bodySearch}
        />

        <div className="archive-layout">
          <aside className="archive-sidebar">
            {/* Named landmarks so the filter and outlet headings below sit at h3
                under a real h2, instead of skipping a level from the page h1. */}
            <h2 className="sr-only">{lang === 'tr' ? 'Filtreler' : 'Filters'}</h2>
            <button
              type="button"
              className="archive-filter-toggle"
              aria-expanded={filtersOpen}
              aria-controls="archive-filters-flat"
              onClick={() => setFiltersOpen((open) => !open)}
            >
              <span>{lang === 'tr' ? 'Filtreler' : 'Filters'}</span>
              <span className="material-symbols-outlined" aria-hidden="true">
                tune
              </span>
            </button>
            <div
              id="archive-filters-flat"
              className="archive-filter-panel"
              data-open={filtersOpen}
            >
              <YearRangeFilter
                lang={lang}
                fromYear={fromYear}
                toYear={toYear}
                setFromYear={(value) => setParam('from', value)}
                setToYear={(value) => setParam('to', value)}
              />
              <SourceKindFilter
                lang={lang}
                sourceKind={sourceKind}
                setSourceKind={(value) => setParam('source', value)}
              />
            </div>
          </aside>

          <div className="archive-main" aria-busy={bodySearch.searching}>
            {/* Focus target for pagination, so a page change is announced and not
                just scrolled to. */}
            <h2 className="sr-only" id="archive-results" tabIndex={-1}>
              {lang === 'tr' ? 'Sonuçlar' : 'Results'}
            </h2>
            {/* Count and active filters stay above the list at every breakpoint, so a
                phone never shows a filtered subset with nothing on screen saying so. */}
            <div className="archive-toolbar">
              <ActiveFilterSummary
                lang={lang}
                filters={activeFilters}
                count={filtered.length}
                onClearAll={resetFilters}
              />
              <SortSelect lang={lang} sort={sort} setSort={(value) => setParam('sort', value)} />
            </div>
            <Reveal delay={0.1}>
              {data.items.length === 0 ? (
                <p className="archive-empty">{data.emptyLabel}</p>
              ) : filtered.length === 0 ? (
                <p className="archive-empty">
                  {lang === 'tr'
                    ? 'Filtreyle eşleşen yazı yok.'
                    : 'No pieces match these filters.'}
                </p>
              ) : (
                <ul className="archive-list">
                  {paginated.map((item) => (
                    <ArchiveRow item={item} lang={lang} key={item.id} />
                  ))}
                </ul>
              )}
            </Reveal>
            <Pagination
              lang={lang}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) =>
                updateSearchParams(
                  searchParams,
                  setSearchParams,
                  { page: String(page) },
                  { replace: false, keepPage: true },
                )
              }
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function archivePool(archiveData: ArchiveData, lang: Lang): ArchiveItem[] {
  return [
    ...archiveData.columns[lang].flatMap((o) => o.items),
    ...(lang === 'tr'
      ? [
          ...archiveData.analyses.flatMap((o) => o.items),
          ...archiveData.interviews,
          ...archiveData.academicArticles,
        ]
      : []),
  ]
}

function findArchiveItemBySlug(
  archiveData: ArchiveData,
  lang: Lang,
  slug: string,
): ArchiveItem | undefined {
  return archivePool(archiveData, lang).find((item) => item.slug === slug)
}

/** Other full articles (real body text, not the current one) — used for
 *  "related pieces" instead of a fabricated recommendation engine. */
function relatedArticles(
  archiveData: ArchiveData,
  lang: Lang,
  current: ArchiveItem,
  count: number,
): ArchiveItem[] {
  const currentTs = current.date ? parseTurkishDate(current.date) : null
  return archivePool(archiveData, lang)
    .filter((item) => item !== current && item.hasBody)
    .map((item) => {
      const ts = item.date ? parseTurkishDate(item.date) : null
      const dateScore =
        currentTs !== null && ts !== null
          ? Math.max(0, 12 - Math.abs(currentTs - ts) / (1000 * 60 * 60 * 24 * 365))
          : 0
      const score =
        (item.category === current.category ? 50 : 0) +
        (item.outlet === current.outlet ? 35 : 0) +
        dateScore
      return { item, score, ts }
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (a.ts === null && b.ts === null) return 0
      if (a.ts === null) return 1
      if (b.ts === null) return -1
      return b.ts - a.ts
    })
    .map(({ item }) => item)
    .slice(0, count)
}

function useReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const scrolled = document.documentElement.scrollTop
      const height =
        document.documentElement.scrollHeight - document.documentElement.clientHeight
      setProgress(height > 0 ? Math.min(100, (scrolled / height) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return progress
}

const FONT_SCALE_MIN = 0.85
const FONT_SCALE_MAX = 1.5
const FONT_SCALE_STEP = 0.125

/* A failed body fetch used to log to the console and leave "Yazı yükleniyor…" on
   screen forever, because `body` stayed undefined and the render fell through to
   the loading branch. The failure is now a state the reader can see and retry. */
function useArticleBody(item: ArchiveItem | undefined): {
  body: string[] | undefined
  failed: boolean
  retry: () => void
} {
  const [body, setBody] = useState<string[] | undefined>(
    item ? (item.body ?? getCachedBody(item)) : undefined,
  )
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    setBody(item ? (item.body ?? getCachedBody(item)) : undefined)
    setFailed(false)
    if (!item || item.body || !item.hasBody) return
    if (getCachedBody(item)) return
    let cancelled = false
    loadArticleBody(item)
      .then((loaded) => {
        if (!cancelled) setBody(loaded)
      })
      .catch((error) => {
        if (cancelled) return
        console.error('Failed to load article body', error)
        setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [item, attempt])
  return { body, failed, retry: () => setAttempt((n) => n + 1) }
}

function ArticlePage({ lang }: { lang: Lang }) {
  const { data, fallback } = useArchiveGate(lang)
  if (!data) return fallback
  return <LoadedArticlePage lang={lang} archiveData={data} />
}

function buildCitation(item: ArchiveItem, articleUrl: string, lang: Lang): string {
  const parts = [`Şahin Alpay, "${item.title}"`]
  if (item.outlet) parts.push(item.outlet)
  if (item.date) parts.push(item.date)
  const today = new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return `${parts.join(', ')}. ${articleUrl} (${content[lang].reader.accessed} ${today}).`
}

function CiteThis({
  item,
  articleUrl,
  lang,
}: {
  item: ArchiveItem
  articleUrl: string
  lang: Lang
}) {
  const t = content[lang].reader
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState<'ok' | 'manual' | null>(null)
  const citation = buildCitation(item, articleUrl, lang)

  const onClick = async () => {
    if (open) {
      setOpen(false)
      setCopied(null)
      return
    }
    setOpen(true)
    try {
      await navigator.clipboard.writeText(citation)
      setCopied('ok')
    } catch {
      setCopied('manual')
    }
  }

  return (
    <>
      <button
        type="button"
        className="icon-btn"
        aria-label={t.citeLabel}
        aria-expanded={open}
        onClick={onClick}
      >
        <span
          className="material-symbols-outlined"
          aria-hidden="true"
          style={{ fontSize: 'var(--icon-md)' }}
        >
          format_quote
        </span>
      </button>
      {open && (
        <div className="cite-box">
          <p className="cite-status" role="status" aria-live="polite">
            {copied === 'ok' ? t.copied : t.copyManual}
          </p>
          <p className="cite-text">{citation}</p>
        </div>
      )}
    </>
  )
}

function LoadedArticlePage({
  lang,
  archiveData,
}: {
  lang: Lang
  archiveData: ArchiveData
}) {
  const location = useLocation()
  const { slug } = useParams<{ slug: string }>()
  const item = slug ? findArchiveItemBySlug(archiveData, lang, slug) : undefined
  const { body, failed: bodyFailed, retry: retryBody } = useArticleBody(item)
  const progress = useReadingProgress()
  const [fontScale, setFontScale] = useState(1)
  const t = content[lang]
  const articleCanonicalPath = item ? `${archiveBasePath(lang, item)}/${item.slug}` : location.pathname
  const articleDateIso = isoDateFromArchiveDate(item?.date)
  usePageMeta({
    title: item ? `${item.title} — Şahin Alpay` : t.htmlTitle,
    description: item ? (item.subtitle ?? item.excerpt ?? item.title) : t.htmlDescription,
    canonicalPath: articleCanonicalPath,
    alternates: item ? { [lang]: articleCanonicalPath } : pageAlternates(location.pathname),
    robots: item ? 'index,follow' : 'noindex,follow',
    type: 'article',
  })
  const articleUrl = item ? `${pageUrl(archiveBasePath(lang, item))}/${item.slug}` : ''
  useJsonLd('article', item ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    description: item.subtitle ?? item.excerpt ?? item.title,
    ...(articleDateIso ? { datePublished: articleDateIso } : {}),
    inLanguage: lang,
    url: articleUrl,
    author: {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Şahin Alpay',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Şahin Alpay',
      url: `${SITE_ORIGIN}/`,
    },
    isPartOf: {
      '@type': 'CollectionPage',
      name: t.columns.title,
      url: item ? pageUrl(archiveBasePath(lang, item)) : pageUrl(paths[lang].columns!),
    },
  } : null)
  useJsonLd('breadcrumb', item ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: lang === 'tr' ? 'Ana sayfa' : 'Home',
        item: pageUrl(paths[lang].home!),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: item.category === 'columns' ? t.columns.title : item.outlet,
        item: pageUrl(archiveBasePath(lang, item)),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: item.title,
        item: articleUrl,
      },
    ],
  } : null)

  useEffect(() => {
    const el = document.getElementById('article-body')
    if (!el || !item) return
    const onCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection()?.toString() ?? ''
      if (selection.length < 40 || !e.clipboardData) return
      const attribution = `\n\n— Şahin Alpay, "${item.title}". ${content[lang].reader.copySourceLabel}: ${articleUrl}`
      e.clipboardData.setData('text/plain', selection + attribution)
      e.preventDefault()
    }
    el.addEventListener('copy', onCopy)
    return () => el.removeEventListener('copy', onCopy)
  }, [item, lang, articleUrl])

  if (!item || (!item.hasBody && !item.clippings?.length && !item.imageSrc)) {
    return (
      <DeadEnd
        lang={lang}
        title={t.notFound.missingTitle}
        body={t.notFound.missingBody}
        searchTerm={slug ? slug.replace(/-/g, ' ') : undefined}
      />
    )
  }

  const related = relatedArticles(archiveData, lang, item, 3)
  const photos = item.clippings?.filter((clipping) => clipping.kind === 'photo') ?? []
  const scans = item.clippings?.filter((clipping) => clipping.kind !== 'photo') ?? []
  const shortOpener = !body || !body[0] || body[0].length < 60
  const cover: ArchiveClipping | null =
    scans[0] ?? (item.imageSrc ? { src: item.imageSrc, alt: item.title } : null)

  return (
    <section className="section section-solo article-page">
      <div className="reading-progress" aria-hidden="true">
        <div
          className="reading-progress-bar"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>
      <div className="container container-narrow">
        <Reveal>
          <nav className="breadcrumb" aria-label={lang === 'tr' ? 'Kırıntı yolu' : 'Breadcrumb'}>
            <Link to={paths[lang].home!}>{lang === 'tr' ? 'Ana sayfa' : 'Home'}</Link>
            <span aria-hidden="true">/</span>
            <Link to={archiveBasePath(lang, item)}>
              {item.category === 'columns' ? t.columns.title : item.outlet}
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{item.title}</span>
          </nav>
          <div className="article-tools">
            <Link className="back-link" to={archiveBasePath(lang, item)}>
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--icon-md)' }}>
                arrow_back
              </span>
              {item.category === 'columns' ? t.columns.title : item.outlet}
            </Link>
            <div
              className="article-tools-group"
              role="group"
              aria-label={lang === 'tr' ? 'Yazı boyutu' : 'Text size'}
            >
              <button
                type="button"
                className="icon-btn"
                aria-label={lang === 'tr' ? 'Yazı tipini küçült' : 'Decrease font size'}
                aria-controls="article-body"
                disabled={fontScale <= FONT_SCALE_MIN}
                onClick={() =>
                  setFontScale((s) =>
                    Math.max(FONT_SCALE_MIN, +(s - FONT_SCALE_STEP).toFixed(3)),
                  )
                }
              >
                <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--icon-md)' }}>
                  text_decrease
                </span>
              </button>
              <button
                type="button"
                className="icon-btn"
                aria-label={lang === 'tr' ? 'Yazı tipini büyüt' : 'Increase font size'}
                aria-controls="article-body"
                disabled={fontScale >= FONT_SCALE_MAX}
                onClick={() =>
                  setFontScale((s) =>
                    Math.min(FONT_SCALE_MAX, +(s + FONT_SCALE_STEP).toFixed(3)),
                  )
                }
              >
                <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--icon-md)' }}>
                  text_increase
                </span>
              </button>
              <output className="sr-only" aria-live="polite">
                {lang === 'tr' ? 'Yazı boyutu' : 'Text size'}{' '}
                {Math.round(fontScale * 100)}%
              </output>
            </div>
            <CiteThis item={item} articleUrl={articleUrl} lang={lang} />
          </div>
          <h1 className="section-title">{item.title}</h1>
          {item.subtitle && <p className="article-subtitle">{item.subtitle}</p>}
          <div className="article-byline">
            <AuthorAvatar className="article-byline-avatar" />
            <span className="article-byline-text">
              <span className="article-byline-name">Şahin Alpay</span>
              {item.date && (
                <>
                  <time
                    className="article-byline-date"
                    {...(articleDateIso ? { dateTime: articleDateIso } : {})}
                  >
                    {item.date}
                  </time>
                  {item.outlet ? ' · ' : ''}
                </>
              )}
              {item.outlet}
              {item.medium
                ? ` (${mediumLabel(item.medium, lang).toLocaleLowerCase(lang)})`
                : ''}
            </span>
            {item.pieceKind && (
              <span className="archive-row-badge">{pieceKindLabel(item.pieceKind, lang)}</span>
            )}
          </div>
          {item.tags && item.tags.length > 0 && (
            <ul className="tag-list">
              {item.tags.map((tag) => (
                <li className="tag" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </Reveal>
        {photos.length > 0 && (
          <Reveal as="div" delay={0.08} className="article-lead-photos">
            {photos.map((clipping) => (
              <figure className="article-lead-photo" key={clipping.src}>
                <img src={clipping.src} alt={clipping.alt ?? item.title} loading="lazy" />
              </figure>
            ))}
          </Reveal>
        )}
        <Reveal
          as="div"
          delay={0.08}
          className={`article-body${shortOpener ? ' no-dropcap' : ''}`}
          id="article-body"
          style={{ fontSize: `calc(var(--text-reading) * ${fontScale})` }}
        >
          {body && body.length > 0 ? (
            body.map((paragraph, i) => <p key={i}>{paragraph}</p>)
          ) : bodyFailed ? (
            <div className="article-body-error" role="alert">
              <p>{content[lang].reader.bodyError}</p>
              <div className="article-body-error-actions">
                <button type="button" className="btn btn-ghost" onClick={retryBody}>
                  {content[lang].reader.bodyRetry}
                </button>
                {item.url && (
                  <a
                    className="text-link"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content[lang].reader.copySourceLabel} ↗
                  </a>
                )}
              </div>
            </div>
          ) : item.hasBody ? (
            <p className="article-body-loading" role="status" aria-live="polite">
              {lang === 'tr' ? 'Yazı yükleniyor…' : 'Loading article…'}
            </p>
          ) : item.excerpt ? (
            /* Scan-only piece: the text lives in the PDF, so the archive's own
               summary stands in its place — labelled, because it is not the
               author's prose and must never be read as such. */
            <div className="article-summary">
              <p className="kicker">{content[lang].reader.summaryLabel}</p>
              <p>{item.excerpt}</p>
            </div>
          ) : null}
        </Reveal>
        {cover && (
          <Reveal as="aside" className="clipping-viewer" delay={0.12}>
            <h2>{content[lang].clippingViewer.heading}</h2>
            <figure className="clipping-frame">
              {item.pdfSrc ? (
                <a
                  className="clipping-open"
                  href={item.pdfSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${content[lang].clippingViewer.openPdf} ${content[lang].clippingViewer.openPdfHint}`}
                >
                  <img src={cover.src} alt={cover.alt ?? item.title} loading="lazy" />
                  <span className="clipping-open-hint">
                    <span className="material-symbols-outlined" aria-hidden="true">
                      picture_as_pdf
                    </span>
                    {content[lang].clippingViewer.openPdf}
                  </span>
                </a>
              ) : (
                /* No PDF behind this one — the clipping image itself is the
                   only rendering of the scan, so opening it full-size in a
                   new tab is the only way to read past what the thumbnail
                   shows. */
                <a
                  className="clipping-open"
                  href={cover.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${content[lang].clippingViewer.openImage} ${content[lang].clippingViewer.openImageHint}`}
                >
                  <img src={cover.src} alt={cover.alt ?? item.title} loading="lazy" />
                  <span className="clipping-open-hint">
                    <span className="material-symbols-outlined" aria-hidden="true">
                      zoom_in
                    </span>
                    {content[lang].clippingViewer.openImage}
                  </span>
                </a>
              )}
              <figcaption>
                {cover.pageLabel ?? item.subtitle}
                {item.pdfPageCount
                  ? ` · ${item.pdfPageCount} ${content[lang].clippingViewer.pagesSuffix}`
                  : ''}
              </figcaption>
            </figure>
          </Reveal>
        )}
        {item.imageCredit && (
          <p className="article-image-credit">{item.imageCredit}</p>
        )}
        {item.sourceNote && <p className="article-image-credit">{item.sourceNote}</p>}
        {(item.url || item.archiveUrl) && (
          <p className="article-source">
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${item.outlet} — ${
                  lang === 'tr'
                    ? 'orijinal kaynak (yeni sekmede açılır)'
                    : 'original source (opens in a new tab)'
                }`}
              >
                {item.outlet} — {lang === 'tr' ? 'orijinal kaynak' : 'original source'}
              </a>
            )}
            {item.url && item.archiveUrl && <span className="article-source-sep"> · </span>}
            {item.archiveUrl && (
              <a
                href={item.archiveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={
                  lang === 'tr'
                    ? 'Arşiv kopyası (yeni sekmede açılır)'
                    : 'Archived copy (opens in a new tab)'
                }
              >
                {lang === 'tr'
                  ? 'arşiv kopyası (web.archive.org)'
                  : 'archived copy (web.archive.org)'}
              </a>
            )}
          </p>
        )}
        {related.length > 0 && (
          <aside className="related-articles">
            <h2>{lang === 'tr' ? 'Benzer Yazılar' : 'Related pieces'}</h2>
            <ul className="archive-list">
              {related.map((r) => (
                <ArchiveRow item={r} lang={lang} key={r.id} />
              ))}
            </ul>
          </aside>
        )}
      </div>
    </section>
  )
}

function BooksPage({ data, lang }: { data: BooksSection; lang: Lang }) {
  const location = useLocation()
  usePageMeta({
    title: `${data.title} — Şahin Alpay`,
    description: data.intro,
    alternates: pageAlternates(location.pathname),
  })
  return (
    <section className="section section-solo">
      <div className="container">
        <Reveal>
          <p className="kicker">{data.kicker}</p>
          <h1 className="section-title">{data.title}</h1>
          <p className="archive-intro">{data.intro}</p>
        </Reveal>

        <Reveal delay={0.05} className="books-cta">
          {data.externalUrl ? (
            <a
              className="btn btn-primary"
              href={data.externalUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${data.externalLabel} ${
                lang === 'tr' ? '(yeni sekmede açılır)' : '(opens in a new tab)'
              }`}
            >
              {data.externalLabel}
            </a>
          ) : (
            <>
              <span className="btn btn-ghost btn-disabled" aria-disabled="true">
                {data.externalLabel}
              </span>
              <span className="archive-empty">{data.externalPendingNote}</span>
            </>
          )}
        </Reveal>

        <ul className="books-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {data.books.map((b, i) => (
            <Reveal as="li" key={`${b.year}-${b.title}`} className="book-card" delay={(i % 2) * 0.08}>
              <div className="book-cover">
                {b.cover ? (
                  <img
                    src={b.cover}
                    alt={lang === 'tr' ? `${b.title} kapağı` : `${b.title} cover`}
                    loading="lazy"
                  />
                ) : (
                  <span className="book-cover-placeholder" aria-hidden="true">
                    <span className="material-symbols-outlined">menu_book</span>
                  </span>
                )}
              </div>
              <div className="book-card-body">
                <span className="book-year">{b.year}</span>
                <h2 className="book-title">
                  <em lang="tr">{b.title}</em>
                </h2>
                <p className="book-desc">{b.desc}</p>
                {b.purchaseUrl && (
                  <a
                    className="book-buy"
                    href={b.purchaseUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${b.title}: ${
                      lang === 'tr'
                        ? 'Kitapyurdu’ndan satın al (yeni sekmede açılır)'
                        : 'Buy on Kitapyurdu (opens in a new tab)'
                    }`}
                  >
                    {lang === 'tr' ? 'Kitapyurdu’ndan satın al' : 'Buy on Kitapyurdu'}
                    <span
                      className="material-symbols-outlined"
                      aria-hidden="true"
                      style={{ fontSize: 'var(--icon-sm)' }}
                    >
                      arrow_forward
                    </span>
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Academic output (dissertation, book chapters, books) is rarer than a column
 *  and outranks it: a year that has one always leads with it, then fills the
 *  remaining slot(s) with a column/analysis piece from the same year if one
 *  exists. Both picks still come from the same year-seeded shuffle, so the
 *  choice among several academic or several ordinary pieces stays stable for
 *  every visitor in a given year, as it did before academic pieces existed. */
function yearPicks(items: ArchiveItem[], year: number, n: number): ArchiveItem[] {
  const random = mulberry32(year)
  const shuffle = <T,>(arr: T[]): T[] => {
    const out = [...arr]
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1))
      ;[out[i], out[j]] = [out[j], out[i]]
    }
    return out
  }

  const academic = items.filter((i) => i.outletKey === 'academic')
  const rest = items.filter((i) => i.outletKey !== 'academic')

  const picks: ArchiveItem[] = academic.length ? [shuffle(academic)[0]] : []

  const pool = rest.filter((i) => i.hasBody)
  const src = pool.length ? pool : rest
  for (const item of shuffle(src)) {
    if (picks.length >= n) break
    picks.push(item)
  }
  return picks
}

function ChroniclePage({ lang }: { lang: Lang }) {
  const location = useLocation()
  usePageMeta({
    title: `${lang === 'tr' ? 'Kronik' : 'Chronicle'} — Şahin Alpay`,
    description:
      lang === 'tr'
        ? 'Şahin Alpay’ın yayımlanmış sesi, yıl yıl, Türkiye’nin olaylarının karşısında.'
        : "Şahin Alpay's published voice, year by year, against Turkey's events.",
    alternates: pageAlternates(location.pathname),
  })
  const { data, fallback } = useArchiveGate(lang)
  if (!data) return fallback
  return <LoadedChronicle lang={lang} archiveData={data} />
}

function LoadedChronicle({
  lang,
  archiveData,
}: {
  lang: Lang
  archiveData: ArchiveData
}) {
  const items: ArchiveItem[] = [
    ...archiveData.columns[lang].flatMap((o) => o.items),
    ...(lang === 'tr' ? archiveData.analyses.flatMap((o) => o.items) : []),
    ...(lang === 'tr' ? archiveData.academicArticles : []),
  ]

  const byYear = new Map<number, ArchiveItem[]>()
  for (const it of items) {
    const ts = it.date ? parseTurkishDate(it.date) : null
    if (ts == null) continue
    const y = new Date(ts).getUTCFullYear()
    const bucket = byYear.get(y)
    if (bucket) bucket.push(it)
    else byYear.set(y, [it])
  }

  const counts = [...byYear.entries()].map(([y, arr]) => [y, arr.length] as const)
  const maxCount = Math.max(1, ...counts.map(([, c]) => c))
  const total = counts.reduce((n, [, c]) => n + c, 0)
  const dataYears = counts.map(([y]) => y)
  const firstYear = dataYears.length ? Math.min(...dataYears) : 0
  const lastYear = dataYears.length ? Math.max(...dataYears) : 0

  const years = Array.from(
    new Set([...byYear.keys(), ...chronicleEvents.map((e) => e.year)]),
  ).sort((a, b) => a - b)

  return (
    <section className="section section-solo chronicle">
      <div className="container container-narrow">
        <Reveal>
          <p className="kicker">{lang === 'tr' ? 'Zaman Çizgisi' : 'Timeline'}</p>
          <h1 className="section-title">{lang === 'tr' ? 'Kronik' : 'Chronicle'}</h1>
          <p className="lead">
            {lang === 'tr'
              ? `${firstYear}–${lastYear} arasında ${total.toLocaleString('tr')} yazı. 2016’da bir kalem susturuldu; grafik bunu gösteriyor.`
              : `${total.toLocaleString('en')} pieces between ${firstYear} and ${lastYear}. In 2016 a pen was silenced — the chart shows it.`}
          </p>
        </Reveal>

        <div className="chronicle-spine">
          {years.map((year) => {
            const yearItems = byYear.get(year) ?? []
            const count = yearItems.length
            const events = chronicleEvents.filter((e) => e.year === year)
            const picks = count > 0 ? yearPicks(yearItems, year, 2) : []
            return (
              <Reveal as="div" className="chronicle-row" key={year}>
                {/* The year is this row's heading, so it closes the h1 → h3 gap
                    that the article rows below would otherwise skip into. */}
                <h2 className="chronicle-year">{year}</h2>
                <div className="chronicle-body">
                  {count > 0 && (
                    <div className="chronicle-bar" aria-hidden="true">
                      <span
                        className="chronicle-bar-fill"
                        style={{ width: `${Math.max(4, (count / maxCount) * 100)}%` }}
                      />
                    </div>
                  )}
                  {count > 0 && (
                    <p className="chronicle-count">
                      {lang === 'tr' ? `${count} yazı` : `${count} pieces`}
                    </p>
                  )}
                  {events.map((e) => (
                    <p
                      className={`chronicle-event chronicle-event-${e.kind}`}
                      key={`${e.year}-${e.en}`}
                    >
                      <span className="material-symbols-outlined" aria-hidden="true">
                        {e.kind === 'personal' ? 'person' : 'flag'}
                      </span>
                      {e[lang]}
                    </p>
                  ))}
                  {picks.length > 0 && (
                    <ul className="archive-list chronicle-picks">
                      {picks.map((p) => (
                        <ArchiveRow item={p} lang={lang} key={p.id} />
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CookiePolicyPage({ lang }: { lang: Lang }) {
  const t = content[lang].cookiePolicy
  const location = useLocation()
  usePageMeta({
    title: `${t.title} — Şahin Alpay`,
    description: t.intro,
    alternates: pageAlternates(location.pathname),
  })
  return (
    <section className="section section-solo">
      <div className="container container-narrow">
        <p className="kicker">{t.kicker}</p>
        <h1 className="section-title">{t.title}</h1>
        <div className="prose">
          <p className="lead">{t.intro}</p>
          {t.sections.map((section) => (
            <div key={section.heading} className="policy-block">
              <h2>{section.heading}</h2>
              {section.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const location = useLocation()
  const lang = langForPath(location.pathname)
  const t = content[lang]
  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div>
            <p className="kicker">{t.footer.kicker}</p>
            <p className="footer-name">Şahin Alpay</p>
          </div>
          <nav className="footer-links" aria-label={t.footer.navLabel}>
            <a href={`mailto:${CONTACT_EMAIL}`}>{t.footer.email}</a>
            <Link to={paths[lang].columns!}>{t.footer.columnsLabel}</Link>
            <Link to={paths[lang].books!}>{t.footer.booksLabel}</Link>
            <Link to={paths[lang].home!}>{t.footer.backToTop}</Link>
            <Link to={paths[lang].cookies!}>{t.footer.cookieLabel}</Link>
          </nav>
        </div>
        <div className="footer-meta">
          <span>
            © {new Date().getFullYear()} Şahin Alpay. {t.footer.rights}
          </span>
          <span>{t.footer.tagline}</span>
        </div>
      </div>
    </footer>
  )
}

function ArchiveLoading({ lang }: { lang: Lang }) {
  return (
    <section className="section section-solo archive-loading" aria-busy="true">
      <div className="container" role="status" aria-live="polite">
        {lang === 'tr' ? 'Arşiv yükleniyor…' : 'Loading archive…'}
      </div>
    </section>
  )
}

/* The archive index is a lazily fetched chunk, so a dropped connection or a
   stale cache after a deploy can fail it. Without this the page sat on
   "Arşiv yükleniyor…" indefinitely, with nothing to retry. */
function ArchiveLoadFailure({ lang, onRetry }: { lang: Lang; onRetry: () => void }) {
  return (
    <section className="section section-solo">
      <div className="container error-screen" role="alert">
        <p className="kicker">{lang === 'tr' ? 'Bağlantı hatası' : 'Loading failed'}</p>
        <h1 className="section-title">
          {lang === 'tr' ? 'Arşiv yüklenemedi' : 'The archive could not load'}
        </h1>
        <p className="lead">
          {lang === 'tr'
            ? 'Arşiv verisi alınamadı. Bağlantınızı kontrol edip yeniden deneyebilirsiniz.'
            : 'The archive data could not be fetched. Check your connection and try again.'}
        </p>
        <div className="error-screen-actions">
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            {lang === 'tr' ? 'Yeniden dene' : 'Try again'}
          </button>
          <Link className="btn btn-ghost" to={paths[lang].home!}>
            {lang === 'tr' ? 'Ana sayfa' : 'Home'}
          </Link>
        </div>
      </div>
    </section>
  )
}

/* The home page still has a hero, a bio and book covers without the archive,
   so a failed load is a band inside the page rather than a full takeover —
   but it must be visible, not a silently missing "Benden Seçkiler". */
function ArchiveInlineFailure({ lang, onRetry }: { lang: Lang; onRetry: () => void }) {
  return (
    <section className="section section-solo">
      <div className="container error-screen" role="alert">
        <p className="lead">
          {lang === 'tr'
            ? 'Arşiv listesi şu anda yüklenemedi, bu yüzden sayaçlar ve seçkiler eksik görünüyor.'
            : 'The archive index could not be loaded, so the counts and picks below are missing.'}
        </p>
        <div className="error-screen-actions">
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            {lang === 'tr' ? 'Yeniden dene' : 'Try again'}
          </button>
        </div>
      </div>
    </section>
  )
}

/** Renders loading / failure screens for the three pages that cannot show
 *  anything at all without the archive, and hands `data` to the caller once
 *  it is there. */
function useArchiveGate(lang: Lang): { data: ArchiveData | null; fallback: ReactNode } {
  const { status, data, reload } = useArchiveData()
  if (status === 'error') {
    return { data: null, fallback: <ArchiveLoadFailure lang={lang} onRetry={reload} /> }
  }
  if (!data) return { data: null, fallback: <ArchiveLoading lang={lang} /> }
  return { data, fallback: null }
}

type TurkishOnlyArchiveKey = 'analyses' | 'interviews' | 'academic'

function TurkishArchiveHub({ pageKey }: { pageKey: TurkishOnlyArchiveKey }) {
  const location = useLocation()
  const t = content.en
  const section =
    pageKey === 'analyses'
      ? t.analyses!
      : pageKey === 'interviews'
        ? t.interviews!
        : t.academicArticles!

  usePageMeta({
    title: `${section.title} — Şahin Alpay`,
    description: section.intro,
    alternates: pageAlternates(location.pathname),
  })

  return (
    <section className="section section-solo">
      <div className="container container-narrow">
        <Reveal>
          <p className="kicker">{section.kicker}</p>
          <h1 className="section-title">{section.title}</h1>
          <p className="archive-intro">{section.intro}</p>
          <p className="archive-language-note">
            Source material for this section is currently available in Turkish.
          </p>
          <Link className="btn btn-primary" to={paths.tr[pageKey]!} lang="tr">
            Türkçe arşivi görüntüle
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function ArchiveRoutePage({ pageKey, lang }: { pageKey: PageKey; lang: Lang }) {
  if (
    lang === 'en' &&
    (pageKey === 'analyses' || pageKey === 'interviews' || pageKey === 'academic')
  ) {
    return <TurkishArchiveHub pageKey={pageKey} />
  }
  return <LoadedArchiveRoutePage pageKey={pageKey} lang={lang} />
}

function LoadedArchiveRoutePage({ pageKey, lang }: { pageKey: PageKey; lang: Lang }) {
  const { data: archiveData, fallback } = useArchiveGate(lang)
  const t = content[lang]

  if (!archiveData) return fallback

  switch (pageKey) {
    case 'columns':
      return (
        <NewsstandArchivePage
          data={{ ...t.columns, outlets: archiveData.columns[lang] }}
          lang={lang}
        />
      )
    case 'analyses':
      return t.analyses ? (
        <NewsstandArchivePage
          data={{ ...t.analyses, outlets: archiveData.analyses }}
          lang={lang}
        />
      ) : (
        <Navigate to={paths[lang].home!} replace />
      )
    case 'interviews':
      return t.interviews ? (
        <FlatArchivePage
          data={{ ...t.interviews, items: archiveData.interviews }}
          lang={lang}
        />
      ) : (
        <Navigate to={paths[lang].home!} replace />
      )
    case 'academic':
      return t.academicArticles ? (
        <FlatArchivePage
          data={{ ...t.academicArticles, items: archiveData.academicArticles }}
          lang={lang}
        />
      ) : (
        <Navigate to={paths[lang].home!} replace />
      )
    default:
      return <Navigate to={paths[lang].home!} replace />
  }
}

function PageForKey({ pageKey, lang }: { pageKey: PageKey; lang: Lang }) {
  switch (pageKey) {
    case 'home':
      return <HomePage lang={lang} />
    case 'about':
      return <AboutPage lang={lang} />
    case 'books':
      return <BooksPage data={content[lang].books} lang={lang} />
    default:
      return <ArchiveRoutePage pageKey={pageKey} lang={lang} />
  }
}

function RouteFor({ lang, pageKey }: { lang: Lang; pageKey: PageKey }) {
  return <PageForKey pageKey={pageKey} lang={lang} />
}

function MainShell() {
  const location = useLocation()
  const mainRef = useRef<HTMLElement | null>(null)
  const didMount = useRef(false)

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }
    // A route change is a new page, not a scroll within the old one — start
    // at the top regardless of where the previous page had scrolled to.
    // Explicit 'instant' overrides the site-wide smooth scroll-behavior,
    // which would otherwise animate all the way up from the old position.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    mainRef.current?.focus({ preventScroll: true })
  }, [location.pathname])

  return (
    <main id="main-content" tabIndex={-1} ref={mainRef}>
      <Routes>
          <Route path="/" element={<RouteFor lang="en" pageKey="home" />} />
          <Route path="/about" element={<RouteFor lang="en" pageKey="about" />} />
          <Route
            path="/columns"
            element={<RouteFor lang="en" pageKey="columns" />}
          />
          <Route path="/columns/:slug" element={<ArticlePage lang="en" />} />
          <Route
            path="/analyses"
            element={<RouteFor lang="en" pageKey="analyses" />}
          />
          <Route
            path="/analyses/:slug"
            element={<TurkishItemRedirect pageKey="analyses" />}
          />
          <Route
            path="/interviews"
            element={<RouteFor lang="en" pageKey="interviews" />}
          />
          <Route
            path="/interviews/:slug"
            element={<TurkishItemRedirect pageKey="interviews" />}
          />
          <Route
            path="/academic-articles"
            element={<RouteFor lang="en" pageKey="academic" />}
          />
          <Route
            path="/academic-articles/:slug"
            element={<TurkishItemRedirect pageKey="academic" />}
          />
          <Route path="/books" element={<RouteFor lang="en" pageKey="books" />} />
          <Route path="/chronicle" element={<ChroniclePage lang="en" />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage lang="en" />} />

          <Route path="/tr" element={<RouteFor lang="tr" pageKey="home" />} />
          <Route
            path="/tr/kimdir"
            element={<RouteFor lang="tr" pageKey="about" />}
          />
          <Route
            path="/tr/kose-yazilari"
            element={<RouteFor lang="tr" pageKey="columns" />}
          />
          <Route
            path="/tr/kose-yazilari/:slug"
            element={<ArticlePage lang="tr" />}
          />
          <Route
            path="/tr/analizler"
            element={<RouteFor lang="tr" pageKey="analyses" />}
          />
          <Route
            path="/tr/analizler/:slug"
            element={<ArticlePage lang="tr" />}
          />
          <Route
            path="/tr/soylesiler"
            element={<RouteFor lang="tr" pageKey="interviews" />}
          />
          <Route
            path="/tr/soylesiler/:slug"
            element={<ArticlePage lang="tr" />}
          />
          <Route
            path="/tr/akademik-makaleler"
            element={<RouteFor lang="tr" pageKey="academic" />}
          />
          <Route
            path="/tr/akademik-makaleler/:slug"
            element={<ArticlePage lang="tr" />}
          />
          <Route
            path="/tr/kitaplar"
            element={<RouteFor lang="tr" pageKey="books" />}
          />
          <Route path="/tr/kronik" element={<ChroniclePage lang="tr" />} />
          <Route
            path="/tr/cerez-politikasi"
            element={<CookiePolicyPage lang="tr" />}
          />

          <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  )
}

const CONSENT_KEY = 'cookie-consent'
const CONSENT_VALUE = 'ok'

function readConsent(): boolean {
  return readStoredValue(CONSENT_KEY) === CONSENT_VALUE
}

function CookieConsent() {
  const location = useLocation()
  const lang = langForPath(location.pathname)
  const t = content[lang].cookieNotice
  const reduce = useReducedMotion()
  const [acknowledged, setAcknowledged] = useState(() => readConsent())

  if (acknowledged) return null

  const accept = () => {
    // Storage may be unavailable (private mode); the notice still dismisses
    // for this session, it just reappears on the next visit.
    writeStoredValue(CONSENT_KEY, CONSENT_VALUE)
    setAcknowledged(true)
  }

  return (
    <motion.aside
      className="cookie-notice"
      role="region"
      aria-label={t.ariaLabel}
      initial={reduce ? false : { y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.25 }}
    >
      <div className="container cookie-notice-inner">
        <p className="cookie-notice-text">
          {t.text} <Link to={paths[lang].cookies!}>{t.policyLinkLabel}</Link>
        </p>
        <div className="cookie-notice-actions">
          <button type="button" className="btn btn-primary" onClick={accept}>
            {t.acceptLabel}
          </button>
        </div>
      </div>
    </motion.aside>
  )
}

export function AppV1() {
  return (
    <>
      <Header />
      <MainShell />
      <Footer />
      <CookieConsent />
    </>
  )
}

export default function App() {
  return <AppV1 />
}

/* One layout for both dead ends: a URL that resolves to nothing, and an article
   slug that no longer matches an entry. Both used to <Navigate> home, which hands
   the reader a 200 OK page showing the wrong thing with no signal that anything
   went wrong — worse for a citable record than an honest dead end. */
function DeadEnd({
  lang,
  title,
  body,
  searchTerm,
}: {
  lang: Lang
  title: string
  body: string
  searchTerm?: string
}) {
  const t = content[lang]
  const columnsPath = paths[lang].columns!
  return (
    <section className="section section-solo">
      <div className="container container-narrow">
        <Reveal>
          <p className="kicker">{t.notFound.kicker}</p>
          <h1 className="section-title">{title}</h1>
          <p className="lead">{body}</p>
          <div className="hero-actions">
            <Link
              className="btn btn-primary"
              to={
                searchTerm
                  ? `${columnsPath}?q=${encodeURIComponent(searchTerm)}`
                  : columnsPath
              }
            >
              {t.notFound.browseArchive}
            </Link>
            <Link className="btn btn-ghost" to={paths[lang].home!}>
              {t.notFound.backHome}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* Analyses, interviews and academic articles are Turkish-only content, but their
   English URLs are real addresses that appear in citations. Sending them to the
   homepage threw away a link that points at an article we actually have; send the
   reader to the piece itself instead. */
function TurkishItemRedirect({ pageKey }: { pageKey: PageKey }) {
  const { slug } = useParams<{ slug: string }>()
  const base = paths.tr[pageKey]!
  return <Navigate to={slug ? `${base}/${slug}` : base} replace />
}

function NotFound() {
  const location = useLocation()
  const lang = langForPath(location.pathname)
  const t = content[lang]
  usePageMeta({
    title: `${t.notFound.title} — Şahin Alpay`,
    description: t.notFound.body,
    robots: 'noindex, follow',
  })
  return <DeadEnd lang={lang} title={t.notFound.title} body={t.notFound.body} />
}
