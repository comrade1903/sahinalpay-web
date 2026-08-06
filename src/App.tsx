import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from 'react'
import { motion, useReducedMotion } from 'motion/react'
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
import {
  archiveItemText,
  itemHasSourceKind,
  itemScanClippings,
} from './archive/itemUtils'
import {
  getCachedBody,
  loadArticleBody,
  loadOutletBodies,
} from './archive/bodyRegistry'
import type {
  ArchiveClipping,
  ArchiveItem,
  FlatArchiveSection,
  OutletArchiveSection,
} from './archive/types'
import {
  paths,
  langForPath,
  pageKeyForPath,
  equivalentPath,
  type PageKey,
} from './routes'
import { parseTurkishDate } from './dateUtils'
import { chronicleEvents } from './chronicle'

/* ------------------------------------------------------------------
   Şahin Alpay — a personal & political legacy site. Bilingual (EN/TR),
   multi-page (each archive category is its own route — see routes.ts).
   To use a real portrait: drop a photo in src/assets (e.g. portrait.jpg),
   `import portrait from './assets/portrait.jpg'` and set PORTRAIT below.
------------------------------------------------------------------ */
const PORTRAIT: string | null = null

type ArchiveData = (typeof import('./archive'))['archiveData']

let archiveDataPromise: Promise<ArchiveData> | null = null

function useArchiveData(): ArchiveData | null {
  const [data, setData] = useState<ArchiveData | null>(null)

  useEffect(() => {
    let active = true
    archiveDataPromise ??= import('./archive').then((module) => module.archiveData)
    archiveDataPromise.then((loaded) => {
      if (active) setData(loaded)
    })
    return () => {
      active = false
    }
  }, [])

  return data
}

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
  return `https://sahinalpay.net${pathname}`
}

function isoDateFromArchiveDate(date?: string): string | undefined {
  if (!date) return undefined
  const ts = parseTurkishDate(date)
  if (ts === null) return undefined
  return new Date(ts).toISOString().slice(0, 10)
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

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null)
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  )

  useEffect(() => {
    if (theme === null) delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = theme
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
    localStorage.setItem('lang', target)
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
                <Link to={paths[lang][h.key]!} className={`hub-card hub-card-${h.key}`}>
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
                      <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '18px' }}>
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
          <div className="recent-panel-glow" aria-hidden="true" />
          <Reveal className="recent-panel-inner">
            <p className="kicker kicker-center">{lang === 'tr' ? 'Haftalık' : 'Weekly'}</p>
            <h2 className="section-title section-title-center">
              {lang === 'tr' ? 'Benden Seçkiler' : 'My Picks'}
            </h2>
          </Reveal>
          <div className="recent-grid">
            {items.map((item, i) => (
              <Reveal as="div" key={item.title} delay={i * 0.06}>
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
                    <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '16px' }}>
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
     Outlet names are proper nouns, so they read the same either way. */
  const groups = [
    ...archiveData.columns.tr,
    ...archiveData.columns.en,
    ...archiveData.analyses,
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
            <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '16px' }}>
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
                <h4>{lang === 'tr' ? 'Gerçek Kaynaklar' : 'Real Sources'}</h4>
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
                <h4>{lang === 'tr' ? 'Büyüyen Bir Arşiv' : 'A Growing Archive'}</h4>
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
  const archiveData = useArchiveData()
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
    const saved = localStorage.getItem('lang')
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
            <span className="about-avatar" aria-hidden="true">
              ŞA
            </span>
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
              <Reveal as="li" key={b.title} className="book" delay={i * 0.06}>
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
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '18px' }}>
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
        {itemScanClippings(item).length ? (
          <span className="archive-row-badge">
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

function archiveItemKey(item: ArchiveItem): string {
  return `${item.lang}:${item.id}`
}

/** Lazily loads full body text once the user searches. The returned map is
 *  both the search input and the state change that triggers re-filtering. */
function useBodySearchIndex(
  items: ArchiveItem[],
  search: string,
): { bodyIndex: ReadonlyMap<string, string[]>; searchingBody: boolean } {
  const debouncedSearch = useDebouncedValue(search, 400)
  const [bodyIndex, setBodyIndex] = useState<ReadonlyMap<string, string[]>>(
    () => new Map(),
  )
  const [searchingBody, setSearchingBody] = useState(false)

  useEffect(() => {
    if (!debouncedSearch) {
      setSearchingBody(false)
      return
    }
    let cancelled = false
    setSearchingBody(true)
    loadOutletBodies(items)
      .then(() => {
        if (cancelled) return
        setSearchingBody(false)
        setBodyIndex(
          new Map(
            items.flatMap((item) => {
              const body = getCachedBody(item)
              return body ? [[archiveItemKey(item), body] as const] : []
            }),
          ),
        )
      })
      .catch((error) => {
        if (cancelled) return
        setSearchingBody(false)
        console.error('Failed to load body text for search', error)
      })
    return () => {
      cancelled = true
    }
  }, [debouncedSearch, items])

  return { bodyIndex, searchingBody }
}

function matchesFilters(
  item: ArchiveItem,
  search: string,
  fromYear: string,
  toYear: string,
  sourceKind: 'all' | 'digital' | 'clipping',
  bodyIndex: ReadonlyMap<string, string[]>,
): boolean {
  if (!itemHasSourceKind(item, sourceKind)) return false

  if (
    search &&
    !archiveItemText(item, bodyIndex.get(archiveItemKey(item)))
      .toLowerCase()
      .includes(search.toLowerCase())
  ) {
    return false
  }
  if (fromYear || toYear) {
    const ts = item.date ? parseTurkishDate(item.date) : null
    if (ts === null) return false
    const year = new Date(ts).getUTCFullYear()
    if (fromYear && year < parseInt(fromYear, 10)) return false
    if (toYear && year > parseInt(toYear, 10)) return false
  }
  return true
}

function sortByDate<T>(
  entries: T[],
  dateOf: (entry: T) => string | undefined,
  sort: 'newest' | 'oldest',
): T[] {
  return [...entries]
    .map((entry) => {
      const date = dateOf(entry)
      return { entry, ts: date ? parseTurkishDate(date) : null }
    })
    .sort((a, b) => {
      if (a.ts === null && b.ts === null) return 0
      if (a.ts === null) return 1
      if (b.ts === null) return -1
      return sort === 'newest' ? b.ts - a.ts : a.ts - b.ts
    })
    .map((w) => w.entry)
}

function sortItems(items: ArchiveItem[], sort: 'newest' | 'oldest'): ArchiveItem[] {
  return sortByDate(items, (item) => item.date, sort)
}

type SourceKind = 'all' | 'digital' | 'clipping'
type SortOrder = 'newest' | 'oldest'

function validSourceKind(value: string | null): SourceKind {
  return value === 'digital' || value === 'clipping' ? value : 'all'
}

function validSort(value: string | null): SortOrder {
  return value === 'oldest' ? 'oldest' : 'newest'
}

function positivePage(value: string | null): number {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
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
  searchingBody,
}: {
  lang: Lang
  search: string
  setSearch: (value: string) => void
  searchingBody: boolean
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
      {searchingBody && (
        <p className="search-status" role="status" aria-live="polite" aria-atomic="true">
          {lang === 'tr' ? 'İçerik aranıyor…' : 'Searching full text…'}
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

const ARCHIVE_PAGE_SIZE = 20

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
        onClick={() => onPageChange(currentPage - 1)}
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
                onClick={() => onPageChange(page)}
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
        onClick={() => onPageChange(currentPage + 1)}
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

function OutletArchivePage({ data, lang }: { data: OutletArchiveSection; lang: Lang }) {
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
    about: { '@id': 'https://sahinalpay.net/#person' },
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
  /* Arriving on a filtered URL opens the panel, so the controls that produced the
     result are visible rather than hidden behind a button. Search is excluded —
     it has its own always-visible row and shouldn't force the panel open. */
  const [filtersOpen, setFiltersOpen] = useState(() =>
    ['outlet', 'from', 'to', 'source'].some((key) => searchParams.get(key)),
  )
  const search = searchParams.get('q') ?? ''
  const activeOutlet = searchParams.get('outlet') ?? 'all'
  const fromYear = searchParams.get('from') ?? ''
  const toYear = searchParams.get('to') ?? ''
  const sort = validSort(searchParams.get('sort'))
  const sourceKind = validSourceKind(searchParams.get('source'))
  const requestedPage = positivePage(searchParams.get('page'))

  const sectionItems = useMemo(() => data.outlets.flatMap((o) => o.items), [data.outlets])
  const { bodyIndex, searchingBody } = useBodySearchIndex(sectionItems, search)
  const visibleOutlets = data.outlets.filter(
    (o) => activeOutlet === 'all' || o.outlet === activeOutlet,
  )
  const hasAnyItems = visibleOutlets.some((o) => o.items.length > 0)
  const flatEntries = useMemo(
    () =>
      sortByDate(
        visibleOutlets.flatMap((o) =>
          o.items
            .filter((item) =>
              matchesFilters(item, search, fromYear, toYear, sourceKind, bodyIndex),
            )
            .map((item) => ({ item, outlet: o.outlet })),
        ),
        (entry) => entry.item.date,
        sort,
      ),
    [visibleOutlets, search, fromYear, toYear, sourceKind, sort, bodyIndex],
  )
  const totalPages = Math.max(1, Math.ceil(flatEntries.length / ARCHIVE_PAGE_SIZE))
  const currentPage = Math.min(requestedPage, totalPages)
  const paginatedEntries = flatEntries.slice(
    (currentPage - 1) * ARCHIVE_PAGE_SIZE,
    currentPage * ARCHIVE_PAGE_SIZE,
  )

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
          searchingBody={searchingBody}
        />

        <div className="archive-layout">
          <aside className="archive-sidebar">
            <button
              type="button"
              className="archive-filter-toggle"
              aria-expanded={filtersOpen}
              aria-controls="archive-filters-outlet"
              onClick={() => setFiltersOpen((open) => !open)}
            >
              <span>{lang === 'tr' ? 'Filtreler' : 'Filters'}</span>
              <span className="material-symbols-outlined" aria-hidden="true">
                tune
              </span>
            </button>
            <div
              id="archive-filters-outlet"
              className="archive-filter-panel"
              data-open={filtersOpen}
            >
              <div className="filter-card">
                <h3>{lang === 'tr' ? 'Yayın Kuruluşu' : 'Outlet'}</h3>
                <div className="chip-row">
                  <button
                    type="button"
                    className="chip"
                    data-active={activeOutlet === 'all'}
                    aria-pressed={activeOutlet === 'all'}
                    onClick={() => setParam('outlet', null)}
                  >
                    {lang === 'tr' ? 'Tümü' : 'All'}
                  </button>
                  {data.outlets.map((o) => (
                    <button
                      type="button"
                      key={o.outlet}
                      className="chip"
                      data-active={activeOutlet === o.outlet}
                      aria-pressed={activeOutlet === o.outlet}
                      onClick={() => setParam('outlet', o.outlet)}
                    >
                      {o.outlet}
                    </button>
                  ))}
                </div>
              </div>
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

          <div className="archive-main" aria-busy={searchingBody}>
            {/* The count and the active-filter chips sit above the list at every
                breakpoint. They used to live inside the collapsed panel, so on a
                phone the archive silently showed a filtered subset with nothing
                on screen saying so. */}
            <div className="archive-toolbar">
              <ActiveFilterSummary
                lang={lang}
                filters={activeFilters}
                count={flatEntries.length}
                onClearAll={resetFilters}
              />
              <SortSelect lang={lang} sort={sort} setSort={(value) => setParam('sort', value)} />
            </div>

            <Reveal delay={0.1}>
              {!hasAnyItems ? (
                <p className="archive-empty">{data.emptyLabel}</p>
              ) : flatEntries.length === 0 ? (
                <p className="archive-empty">
                  {lang === 'tr'
                    ? 'Filtreyle eşleşen yazı yok.'
                    : 'No pieces match these filters.'}
                </p>
              ) : (
                <ul className="archive-list">
                  {paginatedEntries.map(({ item, outlet }) => (
                    <ArchiveRow item={item} outlet={outlet} lang={lang} key={item.title} />
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
    about: { '@id': 'https://sahinalpay.net/#person' },
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

  const { bodyIndex, searchingBody } = useBodySearchIndex(data.items, search)
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
  const totalPages = Math.max(1, Math.ceil(filtered.length / ARCHIVE_PAGE_SIZE))
  const currentPage = Math.min(requestedPage, totalPages)
  const paginated = filtered.slice(
    (currentPage - 1) * ARCHIVE_PAGE_SIZE,
    currentPage * ARCHIVE_PAGE_SIZE,
  )

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
          searchingBody={searchingBody}
        />

        <div className="archive-layout">
          <aside className="archive-sidebar">
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

          <div className="archive-main" aria-busy={searchingBody}>
            {/* See OutletArchivePage: count and active filters are always visible. */}
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
                    <ArchiveRow item={item} lang={lang} key={item.title} />
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

function useArticleBody(item: ArchiveItem | undefined): string[] | undefined {
  const [body, setBody] = useState<string[] | undefined>(
    item ? (item.body ?? getCachedBody(item)) : undefined,
  )
  useEffect(() => {
    setBody(item ? (item.body ?? getCachedBody(item)) : undefined)
    if (!item || item.body || !item.hasBody) return
    if (getCachedBody(item)) return
    let cancelled = false
    loadArticleBody(item)
      .then((loaded) => {
        if (!cancelled) setBody(loaded)
      })
      .catch((error) => {
        if (!cancelled) console.error('Failed to load article body', error)
      })
    return () => {
      cancelled = true
    }
  }, [item])
  return body
}

function ArticlePage({ lang }: { lang: Lang }) {
  const archiveData = useArchiveData()
  if (!archiveData) return <ArchiveLoading lang={lang} />
  return <LoadedArticlePage lang={lang} archiveData={archiveData} />
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
          style={{ fontSize: '18px' }}
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
  const body = useArticleBody(item)
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
      '@id': 'https://sahinalpay.net/#person',
      name: 'Şahin Alpay',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Şahin Alpay',
      url: 'https://sahinalpay.net/',
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
    return <Navigate to={paths[lang].columns!} replace />
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
        <div className="reading-progress-bar" style={{ width: `${progress}%` }} />
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
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '18px' }}>
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
                <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '18px' }}>
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
                <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '18px' }}>
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
            <span className="article-byline-avatar" aria-hidden="true">
              ŞA
            </span>
            <span className="article-byline-text">
              <span className="article-byline-name">Şahin Alpay</span>
              {item.date && (
                <>
                  <time className="article-byline-date">{item.date}</time>
                  {item.outlet ? ' · ' : ''}
                </>
              )}
              {item.outlet}
              {item.medium
                ? ` (${mediumLabel(item.medium, lang).toLocaleLowerCase(lang)})`
                : ''}
            </span>
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
          style={{ fontSize: `${(1.05 * fontScale).toFixed(3)}rem` }}
        >
          {body && body.length > 0 ? (
            body.map((paragraph, i) => <p key={i}>{paragraph}</p>)
          ) : item.hasBody ? (
            <p className="article-body-loading" role="status" aria-live="polite">
              {lang === 'tr' ? 'Yazı yükleniyor…' : 'Loading article…'}
            </p>
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
                <img src={cover.src} alt={cover.alt ?? item.title} loading="lazy" />
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
                <ArchiveRow item={r} lang={lang} key={r.title} />
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
            <Reveal as="li" key={b.title} className="book-card" delay={(i % 2) * 0.08}>
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
                <h3 className="book-title">
                  <em lang="tr">{b.title}</em>
                </h3>
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
                      style={{ fontSize: '16px' }}
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

function yearPicks(items: ArchiveItem[], year: number, n: number): ArchiveItem[] {
  const pool = items.filter((i) => i.hasBody)
  const src = pool.length ? pool : items
  const random = mulberry32(year)
  const shuffled = [...src]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, n)
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
  const archiveData = useArchiveData()
  if (!archiveData) return <ArchiveLoading lang={lang} />
  return <LoadedChronicle lang={lang} archiveData={archiveData} />
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
                <div className="chronicle-year">{year}</div>
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
            <a href="mailto:contact@sahinalpay.net">{t.footer.email}</a>
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
  const archiveData = useArchiveData()
  const t = content[lang]

  if (!archiveData) return <ArchiveLoading lang={lang} />

  switch (pageKey) {
    case 'columns':
      return (
        <OutletArchivePage
          data={{ ...t.columns, outlets: archiveData.columns[lang] }}
          lang={lang}
        />
      )
    case 'analyses':
      return t.analyses ? (
        <OutletArchivePage
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
          <Route path="/analyses/:slug" element={<Navigate to="/" replace />} />
          <Route
            path="/interviews"
            element={<RouteFor lang="en" pageKey="interviews" />}
          />
          <Route path="/interviews/:slug" element={<Navigate to="/" replace />} />
          <Route
            path="/academic-articles"
            element={<RouteFor lang="en" pageKey="academic" />}
          />
          <Route
            path="/academic-articles/:slug"
            element={<Navigate to="/" replace />}
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
  try {
    return localStorage.getItem(CONSENT_KEY) === CONSENT_VALUE
  } catch {
    return false
  }
}

function CookieConsent() {
  const location = useLocation()
  const lang = langForPath(location.pathname)
  const t = content[lang].cookieNotice
  const reduce = useReducedMotion()
  const [acknowledged, setAcknowledged] = useState(() => readConsent())

  if (acknowledged) return null

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, CONSENT_VALUE)
    } catch {
      // Storage unavailable (private mode); dismiss for this session only.
    }
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

function NotFound() {
  const location = useLocation()
  const lang = langForPath(location.pathname)
  return <Navigate to={paths[lang].home!} replace />
}
