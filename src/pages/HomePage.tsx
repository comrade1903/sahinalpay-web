import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { content, type Content, type Lang } from '../content'
import { useArchiveSummary, type ArchiveSummary } from '../archive/useArchiveSummary'
import { Reveal } from '../components/Reveal'
import { countLabel } from '../lib/countLabel'
import { hubCount, hubNoun } from '../lib/hubCount'
import { PORTRAIT } from '../components/AuthorAvatar'
import { ArchiveInlineFailure } from '../components/ArchiveGate'
import { paths } from '../routes'
import { pageAlternates, pageUrl, usePageMeta, useJsonLd } from '../lib/seo'
import { profileJsonLd } from '../lib/structuredData'
import { LANG_KEY } from '../lib/preferences'
import { readStoredValue } from '../lib/storage'

/* ------------------------------------------------------------------
   Şahin Alpay — a personal & political legacy site. Bilingual (EN/TR),
   multi-page (each archive category is its own route — see routes.ts).
   The hero portrait lives in src/assets; setting PORTRAIT to null falls
   back to the ŞA monogram, which is what the hero showed before a photo
   existed.
------------------------------------------------------------------ */
/* Source: the same photograph expressioninterrupted.com (P24) publishes
   at 670×310, supplied by the owner on 2026-11-06 as a corrected 1280×770
   copy, cropped to the 4/5 frame (600×750) and enlarged to 960×1200.
   Replace this file with a larger camera original when one is available;
   nothing else needs to change. */
function Hero({ t, lang }: { t: Content; lang: Lang }) {
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
        {/* Entrance animations live in index.css (.hero-enter-*), off under
            reduced motion. */}
        <div className="hero-enter-text">
          <p className="hero-eyebrow">{t.hero.eyebrow}</p>
          <h1 className="hero-name">
            <span className="hero-name-first">Şahin</span> Alpay
          </h1>
          <p className="hero-intro">{t.hero.intro}</p>
          <div className="hero-actions">
            <Link to={paths[lang].about!} className="btn btn-primary">
              {t.hero.ctaStory}
            </Link>
          </div>
          <form className="hero-search" onSubmit={onSearch} role="search">
            <div className="hero-search-field">
              <span translate="no" className="material-symbols-outlined" aria-hidden="true">
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
        </div>

        <div className="hero-enter-portrait">
          <div className="portrait-frame">
            <div className="portrait-echo" aria-hidden="true" />
            <figure className="portrait">
              {PORTRAIT ? (
                <img src={PORTRAIT} width={960} height={1200} alt={t.hero.portraitAlt} />
              ) : (
                <div className="portrait-placeholder">
                  <span className="portrait-monogram">ŞA</span>
                </div>
              )}
            </figure>
          </div>
        </div>
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
        {/* One entrance for the heading and the whole grid, not a stagger
            per card: the cards are one index, so they arrive together. */}
        <Reveal>
          <h2 className="section-title">{t.hubTitle}</h2>
          <div className="hub-grid">
            {t.hub.map((h) => {
              const count = hubCount(h.key, t.books.books.length, summary)
              const wide = h.key === 'columns'
              return (
                <div key={h.key} className={wide ? 'hub-card-wide' : undefined}>
                  <Link
                    to={paths[lang][h.key]!}
                    className={`hub-card hub-card-${h.key}`}
                    data-state={count === 0 ? 'pending' : 'filled'}
                  >
                    {count !== null && (
                      <div className="hub-card-top">
                        {count > 0 ? (
                          <span className="hub-card-count">
                            {countLabel(count, lang, hubNoun(h.key))}
                          </span>
                        ) : (
                          <span className="hub-card-count-empty">
                            {lang === 'tr' ? 'Yakında' : 'Coming soon'}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="hub-card-body">
                      <h3>{h.title}</h3>
                      <span className="hub-arrow" aria-hidden="true">
                        {lang === 'tr' ? 'İncele' : 'Explore'}
                        <span translate="no" className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--icon-md)' }}>
                          arrow_forward
                        </span>
                      </span>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </Reveal>
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
     Outlet names are proper nouns, so they read the same either way. Türkçe ve
     Yabancı Dilde Makaleler is the one row that isn't a named outlet — it groups a doctoral
     dissertation, book chapters and books rather than one publication, so its
     label is translated like any other UI string instead of staying fixed. */
  const bands = summary.coverage
    .map((band) => ({
      ...band,
      outlet:
        band.outlet ?? (lang === 'tr' ? 'Türkçe ve Yabancı Dilde Makaleler' : 'Articles in Turkish and Other Languages'),
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

function ArchiveCoverage({
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
          <h2 className="section-title">
            {lang === 'tr'
              ? 'Arşivde ne var, ne yok'
              : "What the archive holds — and what it doesn't"}
          </h2>
          <p className="lead">
            {lang === 'tr'
              ? 'Yarım yüzyıldan uzun süren bir yazı hayatım oldu. Bu sayfada yazarlık hayatımdan ulaşabildiğim seçmeleri bulacaksınız.'
              : 'My writing life has spanned more than half a century. On this page you will find the selections from it that I have been able to gather.'}
          </p>
          <div className="heritage-features">
            <div className="heritage-feature">
              <h3>{lang === 'tr' ? 'Kaynaklar' : 'Sources'}</h3>
              <p>
                {lang === 'tr'
                  ? 'Her yazının kaynağı belirtilmiştir.'
                  : 'The source of every piece is given.'}
              </p>
            </div>
            <div className="heritage-feature">
              <h3>{lang === 'tr' ? 'Büyüyen bir arşiv' : 'A growing archive'}</h3>
              <p>
                {lang === 'tr'
                  ? 'İçerik zaman içinde eklerle genişleyecektir.'
                  : 'The content will grow over time with new additions.'}
              </p>
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

export default function HomePage({ lang }: { lang: Lang }) {
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

  /* On a bare "/" visit (not a deep link), a reader who chose English with the
     language switch lands on /en again. Only an explicit choice counts: going
     by the browser's language would also send search crawlers, which report
     English, away from the Turkish home page the root is meant to be. */
  useEffect(() => {
    if (lang !== 'tr' || location.pathname !== '/') return
    if (readStoredValue(LANG_KEY) === 'en') navigate(paths.en.home!, { replace: true })
  }, [lang, location.pathname, navigate])

  return (
    <>
      <Hero t={t} lang={lang} />
      {archiveStatus === 'error' && (
        <ArchiveInlineFailure lang={lang} onRetry={reloadArchive} />
      )}
      <HubGrid t={t} lang={lang} summary={summary} />
      <ArchiveCoverage lang={lang} summary={summary} />
    </>
  )
}
