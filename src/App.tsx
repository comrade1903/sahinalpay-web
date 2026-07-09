import {
  useEffect,
  useMemo,
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
  archiveData,
  archiveItemText,
  findArchiveItem,
  itemHasSourceKind,
  withFlatSectionItems,
  withOutletSectionItems,
  type ArchiveItem,
  type FlatArchiveSection,
  type OutletArchiveSection,
} from './archive'
import {
  paths,
  langForPath,
  pageKeyForPath,
  equivalentPath,
  type PageKey,
} from './routes'
import { parseTurkishDate } from './dateUtils'

/* ------------------------------------------------------------------
   Şahin Alpay — a personal & political legacy site. Bilingual (EN/TR),
   multi-page (each archive category is its own route — see routes.ts).
   To use a real portrait: drop a photo in src/assets (e.g. portrait.jpg),
   `import portrait from './assets/portrait.jpg'` and set PORTRAIT below.
------------------------------------------------------------------ */
const PORTRAIT: string | null = null

function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title
    let tag = document.querySelector('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'description')
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', description)
  }, [title, description])
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
  }, [id, data])
}

function pageUrl(pathname: string) {
  return `https://sahinalpay.net${pathname}`
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
  style,
}: {
  children: ReactNode
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article' | 'aside'
  className?: string
  style?: CSSProperties
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
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
  useEffect(() => {
    if (theme === null) delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = theme
  }, [theme])
  const toggle = () =>
    setTheme((t) => {
      const system = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      const current = t ?? system
      return current === 'dark' ? 'light' : 'dark'
    })
  return { toggle }
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

function CanonicalSync() {
  const location = useLocation()
  useEffect(() => {
    const url = `https://sahinalpay.net${location.pathname}`
    let tag = document.querySelector('link[rel="canonical"]')
    if (!tag) {
      tag = document.createElement('link')
      tag.setAttribute('rel', 'canonical')
      document.head.appendChild(tag)
    }
    tag.setAttribute('href', url)
  }, [location.pathname])
  return null
}

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const lang = langForPath(location.pathname)
  const t = content[lang]
  const { toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const onToggleLang = () => {
    const target: Lang = lang === 'tr' ? 'en' : 'tr'
    localStorage.setItem('lang', target)
    navigate(equivalentPath(location.pathname, target))
  }

  return (
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
          >
            <SunMoon />
          </button>
        </div>
      </div>
    </header>
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
}

/** Real item counts per section — never fabricated. Returns null where a
 *  count doesn't apply (e.g. the About page). */
function hubCount(key: PageKey, t: Content): number | null {
  switch (key) {
    case 'columns':
      return archiveData.columns.reduce((sum, o) => sum + o.items.length, 0)
    case 'analyses':
      return archiveData.analyses.reduce((sum, o) => sum + o.items.length, 0)
    case 'interviews':
      return archiveData.interviews.length
    case 'academic':
      return archiveData.academicArticles.length
    case 'books':
      return t.books.books.length
    default:
      return null
  }
}

function HubGrid({ t, lang }: { t: Content; lang: Lang }) {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <p className="kicker">{t.hubKicker}</p>
          <h2 className="section-title">{t.hubTitle}</h2>
        </Reveal>
        <div className="hub-grid">
          {t.hub.map((h, i) => {
            const count = hubCount(h.key, t)
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

/** Real, most-recently-dated full articles across every outlet — used
 *  instead of fabricated "featured" picks. */
function recentArticles(count: number): ArchiveItem[] {
  const pool: ArchiveItem[] = [
    ...archiveData.columns.flatMap((o) => o.items),
    ...archiveData.analyses.flatMap((o) => o.items),
  ].filter((item) => item.body && item.body.length > 0)

  pool.sort((a, b) => {
    const da = a.date ? parseTurkishDate(a.date) : null
    const db = b.date ? parseTurkishDate(b.date) : null
    if (da === null && db === null) return 0
    if (da === null) return 1
    if (db === null) return -1
    return db - da
  })

  return pool.slice(0, count)
}

function RecentArticles({ lang }: { lang: Lang }) {
  const items = recentArticles(3)
  if (items.length === 0) return null

  return (
    <section className="section">
      <div className="container">
        <div className="recent-panel">
          <div className="recent-panel-glow" aria-hidden="true" />
          <Reveal className="recent-panel-inner">
            <p className="kicker kicker-center">{lang === 'tr' ? 'Güncel' : 'Latest'}</p>
            <h2 className="section-title section-title-center">
              {lang === 'tr' ? 'Son Eklenenler' : 'Recently Added'}
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

/* Slots for real photos once available — kept null rather than filled
   with stock imagery standing in for people/places that aren't ours. */
const HERITAGE_PHOTOS: [string | null, string | null, string | null, string | null] = [
  null,
  null,
  null,
  null,
]

function AcademicHeritage({ t, lang }: { t: Content; lang: Lang }) {
  return (
    <section className="section">
      <div className="container heritage-grid">
        <Reveal className="heritage-copy">
          <span className="badge-pill">
            <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '16px' }}>
              school
            </span>
            {lang === 'tr' ? 'Akademik Katkı' : 'Academic Contribution'}
          </span>
          <h2 className="section-title">
            {lang === 'tr'
              ? 'Fikir Mirası ve Akademik Araştırmalar'
              : 'A Legacy of Ideas and Academic Research'}
          </h2>
          <p className="lead">{t.about.lead}</p>
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
        <Reveal className="heritage-photos" delay={0.1}>
          {HERITAGE_PHOTOS.map((src, i) => (
            <div className="heritage-photo" key={i}>
              {src ? (
                <img src={src} alt="" />
              ) : (
                <span className="material-symbols-outlined" aria-hidden="true">
                  image
                </span>
              )}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

function HomePage({ lang }: { lang: Lang }) {
  const t = content[lang]
  const navigate = useNavigate()
  const location = useLocation()
  usePageMeta(t.htmlTitle, t.htmlDescription)

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
      <HubGrid t={t} lang={lang} />
      <RecentArticles lang={lang} />
      <AcademicHeritage t={t} lang={lang} />
    </>
  )
}

function AboutPage({ lang }: { lang: Lang }) {
  const t = content[lang]
  usePageMeta(`${t.about.title} — Şahin Alpay`, t.about.lead)
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
 *  have real body text, externally to the source otherwise. */
function archiveLink(
  item: ArchiveItem,
  lang: Lang,
): { href: string; internal: boolean } | null {
  if (item.url && item.body && item.body.length > 0) {
    return { href: `${archiveBasePath(lang, item)}/${item.slug}`, internal: true }
  }
  if (item.body && item.body.length > 0) {
    return { href: `${archiveBasePath(lang, item)}/${item.slug}`, internal: true }
  }
  if (item.url) return { href: item.url, internal: false }
  if (item.imageSrc) return { href: item.imageSrc, internal: false }
  if (item.clippings?.[0]?.src) return { href: `${archiveBasePath(lang, item)}/${item.slug}`, internal: true }
  return null
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
  const preview = item.excerpt ?? item.subtitle ?? item.body?.[0]
  const inner = (
    <>
      <div className="archive-row-meta">
        {item.date && <span className="archive-row-date">{item.date}</span>}
        {outlet && <span className="archive-row-outlet">{outlet}</span>}
        {item.clippings?.length ? (
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
        <a href={link.href} target="_blank" rel="noreferrer" className="archive-row">
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

function matchesFilters(
  item: ArchiveItem,
  search: string,
  fromYear: string,
  toYear: string,
  sourceKind: 'all' | 'digital' | 'clipping',
): boolean {
  if (!itemHasSourceKind(item, sourceKind)) return false

  if (search && !archiveItemText(item).toLowerCase().includes(search.toLowerCase())) {
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
  sort: 'newest' | 'oldest'
  setSort: (v: 'newest' | 'oldest') => void
}) {
  return (
    <select
      className="sort-select"
      value={sort}
      onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
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
  sourceKind: 'all' | 'digital' | 'clipping'
  setSourceKind: (v: 'all' | 'digital' | 'clipping') => void
}) {
  const options: { value: 'all' | 'digital' | 'clipping'; label: string }[] = [
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
      >
        {lang === 'tr' ? 'Sonraki' : 'Next'}
      </button>
    </nav>
  )
}

function OutletArchivePage({ data, lang }: { data: OutletArchiveSection; lang: Lang }) {
  usePageMeta(`${data.title} — Şahin Alpay`, data.intro)
  const location = useLocation()
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
        datePublished: item.date,
        url: `${pageUrl(archiveBasePath(lang, item))}/${item.slug}`,
      })),
    ),
  })
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [activeOutlet, setActiveOutlet] = useState('all')
  const [fromYear, setFromYear] = useState('')
  const [toYear, setToYear] = useState('')
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest')
  const [sourceKind, setSourceKind] = useState<'all' | 'digital' | 'clipping'>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const visibleOutlets = data.outlets.filter(
    (o) => activeOutlet === 'all' || o.outlet === activeOutlet,
  )
  const hasAnyItems = visibleOutlets.some((o) => o.items.length > 0)
  const flatEntries = useMemo(
    () =>
      sortByDate(
        visibleOutlets.flatMap((o) =>
          o.items
            .filter((item) => matchesFilters(item, search, fromYear, toYear, sourceKind))
            .map((item) => ({ item, outlet: o.outlet })),
        ),
        (entry) => entry.item.date,
        sort,
      ),
    [visibleOutlets, search, fromYear, toYear, sourceKind, sort],
  )
  const totalPages = Math.max(1, Math.ceil(flatEntries.length / ARCHIVE_PAGE_SIZE))
  const paginatedEntries = flatEntries.slice(
    (currentPage - 1) * ARCHIVE_PAGE_SIZE,
    currentPage * ARCHIVE_PAGE_SIZE,
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [search, activeOutlet, fromYear, toYear, sourceKind, sort])

  const resetFilters = () => {
    setSearch('')
    setActiveOutlet('all')
    setFromYear('')
    setToYear('')
    setSourceKind('all')
    setSort('newest')
    setCurrentPage(1)
  }

  return (
    <section className="section section-solo">
      <div className="container">
        <Reveal>
          <p className="kicker">{data.kicker}</p>
          <h1 className="section-title">{data.title}</h1>
          <p className="archive-intro">{data.intro}</p>
        </Reveal>

        <div className="archive-layout">
          <aside className="archive-sidebar">
            <div className="filter-card">
              <h3>{lang === 'tr' ? 'Ara' : 'Search'}</h3>
              <div className="search-field">
                <span className="material-symbols-outlined" aria-hidden="true">
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={lang === 'tr' ? 'Metin, konu veya OCR ara…' : 'Search text, topic or OCR…'}
                  aria-label={lang === 'tr' ? 'Arşivde ara' : 'Search archive'}
                />
              </div>
            </div>
            <div className="filter-card">
              <h3>{lang === 'tr' ? 'Yayın Kuruluşu' : 'Outlet'}</h3>
              <div className="chip-row">
                <button
                  type="button"
                  className="chip"
                  data-active={activeOutlet === 'all'}
                  onClick={() => setActiveOutlet('all')}
                >
                  {lang === 'tr' ? 'Tümü' : 'All'}
                </button>
                {data.outlets.map((o) => (
                  <button
                    type="button"
                    key={o.outlet}
                    className="chip"
                    data-active={activeOutlet === o.outlet}
                    onClick={() => setActiveOutlet(o.outlet)}
                  >
                    {o.outlet}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-card">
              <YearRangeFilter
                lang={lang}
                fromYear={fromYear}
                toYear={toYear}
                setFromYear={setFromYear}
                setToYear={setToYear}
              />
            </div>
            <SourceKindFilter
              lang={lang}
              sourceKind={sourceKind}
              setSourceKind={setSourceKind}
            />
            <button type="button" className="filter-reset" onClick={resetFilters}>
              {lang === 'tr' ? 'Filtreleri Temizle' : 'Reset filters'}
            </button>
          </aside>

          <div className="archive-main">
            <div className="archive-toolbar">
              <span className="archive-count">
                {lang === 'tr' ? `${flatEntries.length} yazı` : `${flatEntries.length} pieces`}
              </span>
              <SortSelect lang={lang} sort={sort} setSort={setSort} />
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
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function FlatArchivePage({ data, lang }: { data: FlatArchiveSection; lang: Lang }) {
  usePageMeta(`${data.title} — Şahin Alpay`, data.intro)
  const location = useLocation()
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
      datePublished: item.date,
      url: `${pageUrl(location.pathname)}/${item.slug}`,
    })),
  })
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [fromYear, setFromYear] = useState('')
  const [toYear, setToYear] = useState('')
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest')
  const [sourceKind, setSourceKind] = useState<'all' | 'digital' | 'clipping'>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = useMemo(
    () =>
      sortItems(
        data.items.filter((item) =>
          matchesFilters(item, search, fromYear, toYear, sourceKind),
        ),
        sort,
      ),
    [data.items, search, fromYear, toYear, sourceKind, sort],
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / ARCHIVE_PAGE_SIZE))
  const paginated = filtered.slice(
    (currentPage - 1) * ARCHIVE_PAGE_SIZE,
    currentPage * ARCHIVE_PAGE_SIZE,
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [search, fromYear, toYear, sourceKind, sort])

  const resetFilters = () => {
    setSearch('')
    setFromYear('')
    setToYear('')
    setSourceKind('all')
    setSort('newest')
    setCurrentPage(1)
  }

  return (
    <section className="section section-solo">
      <div className="container">
        <Reveal>
          <p className="kicker">{data.kicker}</p>
          <h1 className="section-title">{data.title}</h1>
          <p className="archive-intro">{data.intro}</p>
        </Reveal>

        <div className="archive-layout">
          <aside className="archive-sidebar">
            <div className="filter-card">
              <h3>{lang === 'tr' ? 'Ara' : 'Search'}</h3>
              <div className="search-field">
                <span className="material-symbols-outlined" aria-hidden="true">
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={lang === 'tr' ? 'Metin, konu veya OCR ara…' : 'Search text, topic or OCR…'}
                  aria-label={lang === 'tr' ? 'Arşivde ara' : 'Search archive'}
                />
              </div>
            </div>
            <div className="filter-card">
              <YearRangeFilter
                lang={lang}
                fromYear={fromYear}
                toYear={toYear}
                setFromYear={setFromYear}
                setToYear={setToYear}
              />
            </div>
            <SourceKindFilter
              lang={lang}
              sourceKind={sourceKind}
              setSourceKind={setSourceKind}
            />
            <button type="button" className="filter-reset" onClick={resetFilters}>
              {lang === 'tr' ? 'Filtreleri Temizle' : 'Reset filters'}
            </button>
          </aside>

          <div className="archive-main">
            <div className="archive-toolbar">
              <span className="archive-count">
                {lang === 'tr' ? `${filtered.length} yazı` : `${filtered.length} pieces`}
              </span>
              <SortSelect lang={lang} sort={sort} setSort={setSort} />
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
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function archivePool(lang: Lang): ArchiveItem[] {
  void lang
  return [
    ...archiveData.columns.flatMap((o) => o.items),
    ...archiveData.analyses.flatMap((o) => o.items),
    ...archiveData.interviews,
    ...archiveData.academicArticles,
  ]
}

function findArchiveItemBySlug(lang: Lang, slug: string): ArchiveItem | undefined {
  void lang
  return findArchiveItem(slug)
}

/** Other full articles (real body text, not the current one) — used for
 *  "related pieces" instead of a fabricated recommendation engine. */
function relatedArticles(lang: Lang, current: ArchiveItem, count: number): ArchiveItem[] {
  return archivePool(lang)
    .filter((item) => item !== current && item.body && item.body.length > 0)
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

function ArticlePage({ lang }: { lang: Lang }) {
  const { slug } = useParams<{ slug: string }>()
  const item = slug ? findArchiveItemBySlug(lang, slug) : undefined
  const progress = useReadingProgress()
  const [fontScale, setFontScale] = useState(1)
  const t = content[lang]
  usePageMeta(
    item ? `${item.title} — Şahin Alpay` : t.htmlTitle,
    item ? (item.subtitle ?? item.title) : t.htmlDescription,
  )
  const articleUrl = item ? `${pageUrl(archiveBasePath(lang, item))}/${item.slug}` : ''
  useJsonLd('article', item ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    description: item.subtitle ?? item.excerpt ?? item.title,
    datePublished: item.date,
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

  if (!item || (!item.body?.length && !item.clippings?.length && !item.imageSrc)) {
    return <Navigate to={paths[lang].columns!} replace />
  }

  const related = relatedArticles(lang, item, 3)

  return (
    <section className="section section-solo article-page">
      <div className="reading-progress" aria-hidden="true">
        <div className="reading-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="container container-narrow">
        <Reveal>
          <div className="article-tools">
            <Link className="back-link" to={archiveBasePath(lang, item)}>
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '18px' }}>
                arrow_back
              </span>
              {item.category === 'columns' ? t.columns.title : item.outlet}
            </Link>
            <div className="article-tools-group">
              <button
                type="button"
                className="icon-btn"
                aria-label={lang === 'tr' ? 'Yazı tipini küçült' : 'Decrease font size'}
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
            </div>
          </div>
          <h1 className="section-title">{item.title}</h1>
          {item.subtitle && <p className="article-subtitle">{item.subtitle}</p>}
          <div className="article-byline">
            <span className="article-byline-avatar" aria-hidden="true">
              ŞA
            </span>
            <span className="article-byline-text">
              <span className="article-byline-name">Şahin Alpay</span>
              {item.date}
            </span>
          </div>
        </Reveal>
        <Reveal
          as="div"
          delay={0.08}
          className="article-body"
          style={{ fontSize: `${(1.05 * fontScale).toFixed(3)}rem` }}
        >
          {(item.body ?? []).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </Reveal>
        {(item.imageSrc || item.clippings?.length) && (
          <Reveal as="aside" className="clipping-viewer" delay={0.12}>
            <h2>{lang === 'tr' ? 'Gazete Kupürü' : 'Newspaper Clipping'}</h2>
            {item.imageSrc && (
              <figure className="clipping-frame">
                <img src={item.imageSrc} alt={item.title} loading="lazy" />
              </figure>
            )}
            {item.clippings?.map((clipping, index) => (
              <figure className="clipping-frame" key={clipping.src}>
                <img
                  src={clipping.src}
                  alt={clipping.alt ?? item.title}
                  loading="lazy"
                />
                <figcaption>
                  {clipping.pageLabel ??
                    (lang === 'tr' ? `${index + 1}. sayfa` : `Page ${index + 1}`)}
                  {clipping.sourceNote ? ` · ${clipping.sourceNote}` : ''}
                </figcaption>
                {clipping.ocrText && (
                  <details className="clipping-ocr">
                    <summary>{lang === 'tr' ? 'OCR metnini göster' : 'Show OCR text'}</summary>
                    <p>{clipping.ocrText}</p>
                  </details>
                )}
              </figure>
            ))}
          </Reveal>
        )}
        {item.imageCredit && (
          <p className="article-image-credit">{item.imageCredit}</p>
        )}
        {item.sourceNote && <p className="article-image-credit">{item.sourceNote}</p>}
        {item.url && (
          <p className="article-source">
            <a href={item.url} target="_blank" rel="noreferrer">
              P24 — orijinal kaynak
            </a>
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
  usePageMeta(`${data.title} — Şahin Alpay`, data.intro)
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
                  <a className="book-buy" href={b.purchaseUrl} target="_blank" rel="noreferrer">
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

function PageForKey({ pageKey, lang }: { pageKey: PageKey; lang: Lang }) {
  const t = content[lang]
  switch (pageKey) {
    case 'home':
      return <HomePage lang={lang} />
    case 'about':
      return <AboutPage lang={lang} />
    case 'columns':
      return (
        <OutletArchivePage
          data={withOutletSectionItems(t.columns, archiveData.columns)}
          lang={lang}
        />
      )
    case 'analyses':
      return t.analyses ? (
        <OutletArchivePage
          data={withOutletSectionItems(t.analyses, archiveData.analyses)}
          lang={lang}
        />
      ) : (
        <Navigate to={paths[lang].home!} replace />
      )
    case 'interviews':
      return t.interviews ? (
        <FlatArchivePage
          data={withFlatSectionItems(t.interviews, archiveData.interviews)}
          lang={lang}
        />
      ) : (
        <Navigate to={paths[lang].home!} replace />
      )
    case 'academic':
      return t.academicArticles ? (
        <FlatArchivePage
          data={withFlatSectionItems(t.academicArticles, archiveData.academicArticles)}
          lang={lang}
        />
      ) : (
        <Navigate to={paths[lang].home!} replace />
      )
    case 'books':
      return <BooksPage data={t.books} lang={lang} />
  }
}

function RouteFor({ lang, pageKey }: { lang: Lang; pageKey: PageKey }) {
  return <PageForKey pageKey={pageKey} lang={lang} />
}

export function AppV1() {
  return (
    <>
      <CanonicalSync />
      <Header />
      <main>
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
          <Route path="/analyses/:slug" element={<ArticlePage lang="en" />} />
          <Route
            path="/interviews"
            element={<RouteFor lang="en" pageKey="interviews" />}
          />
          <Route path="/interviews/:slug" element={<ArticlePage lang="en" />} />
          <Route
            path="/academic-articles"
            element={<RouteFor lang="en" pageKey="academic" />}
          />
          <Route path="/academic-articles/:slug" element={<ArticlePage lang="en" />} />
          <Route path="/books" element={<RouteFor lang="en" pageKey="books" />} />

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

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
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
