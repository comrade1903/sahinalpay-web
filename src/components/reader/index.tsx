import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { content, type Lang } from '../../content'
import type { ArchiveClipping, ArchiveItem } from '../../archive/types'
import type { ArchiveData } from '../../archive/useArchiveData'
import { getCachedBody, loadArticleBody } from '../../archive/bodyRegistry'
import { isRetiredSlug, resolveArchiveSlug } from '../../archive/aliases'
import { archiveBasePath, mediumLabel, pieceKindLabel } from '../../archive/links'
import { parseTurkishDate } from '../../dateUtils'
import {
  isoDateFromArchiveDate,
  pageAlternates,
  pageUrl,
  usePageMeta,
  useJsonLd,
} from '../../lib/seo'
import {
  articleJsonLd,
  breadcrumbJsonLd,
  sectionNameFor,
} from '../../lib/structuredData'
import { paths } from '../../routes'
import { Reveal } from '../Reveal'
import { AuthorAvatar } from '../AuthorAvatar'
import { DeadEnd } from '../DeadEnd'
import { useArchiveGate } from '../useArchiveGate'
import { ArchiveRow } from '../archive'

/**
 * The single-article reader: body text or page scans, the citation box, the
 * reading-progress bar and the type-size control.
 *
 * Body text for split outlets is fetched on demand and can fail; the reader
 * shows that state and offers a retry rather than sitting on "loading".
 */

function archivePool(archiveData: ArchiveData, lang: Lang): ArchiveItem[] {
  return [
    ...archiveData.columns.flatMap((o) => o.items),
    ...(lang === 'tr'
      ? [
          ...archiveData.analyses.flatMap((o) => o.items),
          ...archiveData.interviews,
          ...archiveData.academicArticles,
        ]
      : []),
  ]
}

/* Retired slugs resolve to the piece they were renamed from, so an old
   citation keeps working. The reader redirects to the current permalink
   rather than serving the piece at two addresses. */
function findArchiveItemBySlug(
  archiveData: ArchiveData,
  lang: Lang,
  slug: string,
): ArchiveItem | undefined {
  const current = resolveArchiveSlug(lang, slug)
  return archivePool(archiveData, lang).find((item) => item.slug === current)
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

export function ArticlePage({ lang }: { lang: Lang }) {
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

export function LoadedArticlePage({
  lang,
  archiveData,
}: {
  lang: Lang
  archiveData: ArchiveData
}) {
  const location = useLocation()
  const { slug } = useParams<{ slug: string }>()
  const item = slug ? findArchiveItemBySlug(archiveData, lang, slug) : undefined
  /* An old citation lands on the current permalink rather than rendering the
     piece at a second address, so canonical stays single. */
  const retired = Boolean(slug && item && isRetiredSlug(lang, slug))
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
  const sectionName = item ? sectionNameFor(lang, item.category) : t.columns.title
  const sectionUrl = item
    ? pageUrl(archiveBasePath(lang, item))
    : pageUrl(paths[lang].columns!)

  useJsonLd(
    'article',
    item ? articleJsonLd({ item, lang, articleUrl, sectionUrl, sectionName }) : null,
  )
  useJsonLd(
    'breadcrumb',
    item
      ? breadcrumbJsonLd({
          lang,
          homeUrl: pageUrl(paths[lang].home!),
          sectionUrl,
          sectionName: item.category === 'columns' ? sectionName : item.outlet,
          articleUrl,
          articleName: item.title,
        })
      : null,
  )

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

  if (retired && item) {
    return <Navigate to={`${archiveBasePath(lang, item)}/${item.slug}`} replace />
  }

  if (!item || (!item.hasBody && !item.clippings?.length && !item.imageSrc)) {
    return (
      <DeadEnd
        lang={lang}
        title={t.notFound.missingTitle}
        body={t.notFound.missingBody}
        {...(slug ? { searchTerm: slug.replace(/-/g, ' ') } : {})}
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
