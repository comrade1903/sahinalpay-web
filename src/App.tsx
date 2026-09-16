import { useEffect, useRef, useState, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Routes, Route, Link, useLocation, useNavigate, useParams, Navigate } from 'react-router-dom'
import { content, type Content, type Lang, type BooksSection } from './content'
import { useArchiveSummary, type ArchiveSummary } from './archive/useArchiveSummary'
import { Reveal } from './components/Reveal'
import { FlatArchivePage, NewsstandArchivePage } from './components/archive'
import { AuthorAvatar, PORTRAIT } from './components/AuthorAvatar'
import { DeadEnd } from './components/DeadEnd'
import { ArchiveInlineFailure } from './components/ArchiveGate'
import { useArchiveGate } from './components/useArchiveGate'
import { ArticlePage } from './components/reader'
import { PressPage, PressArticlePage } from './components/press'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { CookieConsent } from './components/CookieConsent'
import { paths, langForPath, type PageKey } from './routes'
import { pageAlternates, pageUrl, usePageMeta, useJsonLd } from './lib/seo'
import { aboutJsonLd, booksJsonLd, profileJsonLd } from './lib/structuredData'
import { LANG_KEY } from './lib/preferences'
import { readStoredValue } from './lib/storage'

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

const HUB_ICONS: Record<PageKey, string> = {
  home: 'home',
  about: 'person',
  columns: 'article',
  analyses: 'analytics',
  interviews: 'forum',
  academic: 'school',
  books: 'menu_book',
  trial: 'timeline',
  press: 'format_quote',
  cookies: 'cookie',
}

/** Real item counts per section — never fabricated. Returns null where a
 *  count doesn't apply (e.g. the About page). */
function hubCount(
  key: PageKey,
  t: Content,
  lang: Lang,
  summary: ArchiveSummary | null,
): number | null {
  switch (key) {
    case 'columns':
      return summary?.counts.columns[lang] ?? null
    case 'analyses':
      return summary?.counts.analyses ?? null
    case 'interviews':
      return summary?.counts.interviews ?? null
    case 'academic':
      return summary?.counts.academic ?? null
    case 'books':
      return t.books.books.length
    default:
      return null
  }
}

function HubGrid({
  t,
  lang,
  summary,
}: {
  t: Content
  lang: Lang
  summary: ArchiveSummary | null
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
            const count = hubCount(h.key, t, lang, summary)
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

/* One band per outlet that actually has material, placed on a shared year axis.
   Everything here is derived from the archive itself — no span is asserted for an
   outlet we have not recovered yet, so the empty stretches are honest gaps rather
   than a claim about when he did or didn't write. */
function CoverageStrip({
  summary,
  lang,
}: {
  summary: ArchiveSummary
  lang: Lang
}) {
  /* Every outlet, in both languages. The strip answers "what does this archive
     hold", and the archive is bilingual — filtering it by UI language would show
     an English reader 411 pieces from one paper instead of the real body of work.
     Outlet names are proper nouns, so they read the same either way. Academic
     Articles is the one row that isn't a named outlet — it groups a doctoral
     dissertation, book chapters and books rather than one publication, so its
     label is translated like any other UI string instead of staying fixed. */
  const bands = summary.coverage
    .map((band) => ({
      ...band,
      outlet:
        band.outlet ?? (lang === 'tr' ? 'Akademik Makaleler' : 'Academic Articles'),
    }))
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
  summary,
}: {
  lang: Lang
  summary: ArchiveSummary | null
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
          {summary && <CoverageStrip summary={summary} lang={lang} />}
        </Reveal>
      </div>
    </section>
  )
}

function HomePage({ lang }: { lang: Lang }) {
  const t = content[lang]
  /* Only the summary: the four hub counts, the coverage bands and the pick
     pool. The full archive index stays behind the archive pages that need
     it. */
  const { status: archiveStatus, data: summary, reload: reloadArchive } =
    useArchiveSummary()
  const navigate = useNavigate()
  const location = useLocation()
  usePageMeta({
    title: t.htmlTitle,
    description: t.htmlDescription,
    alternates: pageAlternates(location.pathname),
  })
  /* Every page that ships static JSON-LD builds the same object here, so the
     block survives a client navigation back to it instead of the prerendered
     one being dropped and nothing taking its place. */
  useJsonLd(
    'profile',
    profileJsonLd({
      name: t.htmlTitle,
      description: t.htmlDescription,
      lang,
      url: pageUrl(paths[lang].home!),
    }),
  )

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
      <HubGrid t={t} lang={lang} summary={summary} />
      <AcademicHeritage lang={lang} summary={summary} />
    </>
  )
}

/** Shape shared by every long-form narrative page (About, Trial Process):
 *  a title/subtitle/lead intro beside a jump-to-section control, followed by
 *  the sections themselves. */
interface NarrativeCopy {
  kicker: string
  title: string
  subtitle: string
  lead: string
  editorialNote: string
  contentsLabel: string
  sections: { id: string; title: string; paragraphs: string[] }[]
}

/** The jump-to-section control and the section text that follows it. A
 *  plain link list stopped being usable once a page (Trial Process) grew to
 *  47 sections, so this is a "list of values" — a single select, styled
 *  like the archive's own sort control — that jumps on choice. A page this
 *  long also gets a back-to-top link fixed to the side, shown only once
 *  there are enough sections that scrolling back up by hand is a chore. */
function NarrativeBody({ lang, copy }: { lang: Lang; copy: NarrativeCopy }) {
  const hasContents = copy.sections.length > 1 && copy.sections.every((section) => section.title)
  return (
    <>
      <section className="section section-solo" id="top">
        <div className="container bio-grid">
          <Reveal className="bio-aside">
            <AuthorAvatar className="about-avatar" />
            <h1 className="section-title">{copy.title}</h1>
            {copy.subtitle && <p className="bio-subtitle">{copy.subtitle}</p>}
          </Reveal>

          <Reveal className="prose" delay={0.1}>
            {copy.lead && <p className="lead">{copy.lead}</p>}
            {copy.editorialNote && <p className="bio-editorial-note">{copy.editorialNote}</p>}
            {hasContents && (
              <nav className="bio-contents" aria-label={copy.contentsLabel}>
                <label className="bio-contents-label" htmlFor="bio-contents-select">
                  {copy.contentsLabel}
                </label>
                <select
                  id="bio-contents-select"
                  className="sort-select bio-contents-select"
                  defaultValue=""
                  onChange={(e) => {
                    const id = e.target.value
                    if (id) window.location.hash = id
                  }}
                >
                  <option value="" disabled>
                    {lang === 'tr' ? 'Bir bölüm seçin' : 'Choose a section'}
                  </option>
                  {copy.sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.title}
                    </option>
                  ))}
                </select>
              </nav>
            )}
          </Reveal>
        </div>
      </section>

      <article className="section bio-story" aria-label={copy.kicker}>
        <div className="container container-narrow prose">
          {copy.sections.map((section) => (
            <section className="bio-chapter" id={section.id} key={section.id}>
              {section.title && <h2>{section.title}</h2>}
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
        </div>
      </article>

      {hasContents && (
        <a href="#top" className="back-to-top">
          {lang === 'tr' ? 'Başa dön ↑' : 'Back to top ↑'}
        </a>
      )}
    </>
  )
}

function AboutPage({ lang }: { lang: Lang }) {
  const t = content[lang]
  const location = useLocation()
  const metaDescription = t.about.lead || t.about.sections[0]?.paragraphs[0] || t.about.title
  usePageMeta({
    title: `${t.about.title} — Şahin Alpay`,
    description: metaDescription,
    alternates: pageAlternates(location.pathname),
  })
  useJsonLd(
    'about',
    aboutJsonLd({
      name: t.about.title,
      description: metaDescription,
      lang,
      url: pageUrl(paths[lang].about!),
    }),
  )
  return <NarrativeBody lang={lang} copy={t.about} />
}

/** Buy-button copy per retailer, keyed by hostname — pre-formatted so the
 *  Turkish ablative suffix (’dan/’tan) gets the right consonant for each
 *  name rather than being concatenated blindly. */
const RETAILER_LABELS: Record<string, { tr: string; en: string }> = {
  'kitapyurdu.com': { tr: 'Kitapyurdu’dan satın al', en: 'Buy on Kitapyurdu' },
  'nadirkitap.com': { tr: 'Nadir Kitap’tan satın al', en: 'Buy on Nadir Kitap' },
}

function buyButtonLabel(url: string, lang: Lang): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    const known = RETAILER_LABELS[host]
    if (known) return known[lang]
  } catch {
    /* fall through to the default below */
  }
  return lang === 'tr' ? 'Kitapyurdu’dan satın al' : 'Buy on Kitapyurdu'
}

/** Where a row should link: internally to the full-article page when we
 *  have real body text or scanned clippings to show, externally to the
 *  source otherwise. Body/clippings win over a bare `url` so a scanned
 *  piece opens its own reader page instead of jumping straight to the
 *  (often third-party, sometimes defunct) source link. */
function BooksPage({ data, lang }: { data: BooksSection; lang: Lang }) {
  const location = useLocation()
  usePageMeta({
    title: `${data.title} — Şahin Alpay`,
    description: data.intro,
    alternates: pageAlternates(location.pathname),
  })
  useJsonLd(
    'books',
    booksJsonLd({
      name: data.title,
      description: data.intro,
      lang,
      url: pageUrl(paths[lang].books!),
      books: data.books,
    }),
  )
  return (
    <section className="section section-solo">
      <div className="container">
        <Reveal>
          <p className="kicker">{data.kicker}</p>
          <h1 className="section-title">{data.title}</h1>
          <p className="archive-intro">{data.intro}</p>
        </Reveal>

        {data.externalUrl && (
          <Reveal delay={0.05} className="books-cta">
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
          </Reveal>
        )}

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
                    aria-label={`${b.title}: ${buyButtonLabel(b.purchaseUrl, lang)} ${
                      lang === 'tr' ? '(yeni sekmede açılır)' : '(opens in a new tab)'
                    }`}
                  >
                    {buyButtonLabel(b.purchaseUrl, lang)}
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

/** The case brought against Şahin Alpay after the 2016 coup attempt. The
 *  Turkish page is his own full account — courtroom statements and the
 *  Constitutional Court's and ECHR's rulings, transferred verbatim from his
 *  own document; the English page is a short factual summary rather than a
 *  translation of that record (see the note on `trial` in routes.ts). */
function TrialProcessPage({ lang }: { lang: Lang }) {
  const t = content[lang]
  const location = useLocation()
  const trial = t.trialProcess!
  const metaDescription = trial.lead || trial.sections[0]?.paragraphs[0] || trial.title
  usePageMeta({
    title: `${trial.title} — Şahin Alpay`,
    description: metaDescription,
    alternates: pageAlternates(location.pathname),
  })
  useJsonLd(
    'trial',
    aboutJsonLd({
      name: trial.title,
      description: metaDescription,
      lang,
      url: pageUrl(paths[lang].trial!),
    }),
  )
  return <NarrativeBody lang={lang} copy={trial} />
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

/* Every section lists the other language's records under their own heading,
   so a reader looking for a piece never has to switch language to find it.
   This is also what replaced the English explainer pages for analyses,
   interviews and academic articles: those sections exist only in Turkish, so
   the English page used to be a title and a button pointing across. It now
   shows the records themselves, each opening on its Turkish page. */
function ArchiveRoutePage({ pageKey, lang }: { pageKey: PageKey; lang: Lang }) {
  const { data: archiveData, foreign, fallback } = useArchiveGate(lang)
  const t = content[lang]

  if (!archiveData || !foreign) return fallback

  switch (pageKey) {
    case 'columns':
      return (
        <NewsstandArchivePage
          data={{ ...t.columns, outlets: archiveData.columns }}
          foreignOutlets={foreign.columns}
          lang={lang}
        />
      )
    case 'analyses':
      return t.analyses ? (
        <NewsstandArchivePage
          data={{ ...t.analyses, outlets: archiveData.analyses }}
          foreignOutlets={foreign.analyses}
          lang={lang}
        />
      ) : (
        <Navigate to={paths[lang].home!} replace />
      )
    case 'interviews':
      return t.interviews ? (
        <FlatArchivePage
          data={{ ...t.interviews, items: archiveData.interviews }}
          foreignItems={foreign.interviews}
          lang={lang}
        />
      ) : (
        <Navigate to={paths[lang].home!} replace />
      )
    case 'academic':
      return t.academicArticles ? (
        <FlatArchivePage
          data={{ ...t.academicArticles, items: archiveData.academicArticles }}
          foreignItems={foreign.academicArticles}
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
          <Route path="/trial-process" element={<TrialProcessPage lang="en" />} />
          <Route path="/from-silivri" element={<PressPage lang="en" />} />
          <Route
            path="/from-silivri/:slug"
            element={<TurkishItemRedirect pageKey="press" />}
          />
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
          <Route
            path="/tr/yargilanma-surecim"
            element={<TrialProcessPage lang="tr" />}
          />
          <Route path="/tr/silivriden" element={<PressPage lang="tr" />} />
          <Route
            path="/tr/silivriden/:slug"
            element={<PressArticlePage lang="tr" />}
          />
          <Route
            path="/tr/cerez-politikasi"
            element={<CookiePolicyPage lang="tr" />}
          />

          <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
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
