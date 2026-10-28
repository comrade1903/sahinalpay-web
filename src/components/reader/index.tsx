import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { content, type Lang } from '../../content'
import type { ArchiveClipping, ArchiveItem } from '../../archive/types'
import type { ArchiveData } from '../../archive/useArchiveData'
import { getCachedBody, loadArticleBody } from '../../archive/bodyRegistry'
import { isRetiredSlug, resolveArchiveSlug } from '../../archive/aliases'
import { MIRRORED_CATEGORIES, archiveBasePath, mediumLabel, pieceKindLabel, readerBasePath } from '../../archive/links'
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
import { ImageLightbox, type LightboxImage } from '../ImageLightbox'
import { Reveal } from '../Reveal'
import { AuthorAvatar } from '../AuthorAvatar'
import { DeadEnd } from '../DeadEnd'
import { useArchiveGate } from '../useArchiveGate'

/**
 * The single-article reader: body text or page scans, the citation box, the
 * reading-progress bar and the type-size control.
 *
 * Body text for split outlets is fetched on demand and can fail; the reader
 * shows that state and offers a retry rather than sitting on "loading".
 */

/* This is one language's own archive, so every section of it belongs in the
   pool: the sections that exist in Turkish only are empty arrays on the
   English side. Naming the languages here instead would go stale the moment
   a section gains a record in the other one, as academic articles did. */
function archivePool(archiveData: ArchiveData): ArchiveItem[] {
  return [
    ...archiveData.columns.flatMap((o) => o.items),
    ...archiveData.analyses.flatMap((o) => o.items),
    ...archiveData.interviews,
    ...archiveData.academicArticles,
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
  return archivePool(archiveData).find((item) => item.slug === current)
}

/* The other language's columns, interviews and academic articles also read
   under this language's path for their section (see readerBasePath in archive/links.ts),
   so the site's own language does not change under a reader who opens one
   from a mixed list. Slugs are unique across the two languages —
   validate:content checks it — so the page language's own record always
   wins. */
function findForeignItemBySlug(
  foreign: ArchiveData,
  category: (typeof MIRRORED_CATEGORIES)[number],
  slug: string,
): ArchiveItem | undefined {
  const pool =
    category === 'columns'
      ? foreign.columns.flatMap((o) => o.items)
      : category === 'interviews'
        ? foreign.interviews
        : foreign.academicArticles
  return pool.find((item) => item.slug === resolveArchiveSlug(item.lang, slug))
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
  const [requested, setRequested] = useState({ item, attempt })

  /* Moving to another article (or retrying this one) resets the text during
     render, so the previous piece's body is never shown under the new title. */
  if (requested.item !== item || requested.attempt !== attempt) {
    setRequested({ item, attempt })
    setBody(item ? (item.body ?? getCachedBody(item)) : undefined)
    setFailed(false)
  }

  useEffect(() => {
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
  const { data, foreign, fallback } = useArchiveGate(lang)
  if (!data || !foreign) return fallback
  return <LoadedArticlePage lang={lang} archiveData={data} foreignData={foreign} />
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
        title={t.citeLabel}
        aria-expanded={open}
        onClick={onClick}
      >
        <span
          className="material-symbols-outlined"
          aria-hidden="true"
          style={{ fontSize: 'var(--icon-md)' }}
        >
          content_copy
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
  foreignData,
}: {
  lang: Lang
  archiveData: ArchiveData
  foreignData: ArchiveData
}) {
  const location = useLocation()
  const { slug } = useParams<{ slug: string }>()
  const ownItem = slug ? findArchiveItemBySlug(archiveData, lang, slug) : undefined
  const mirroredCategory = MIRRORED_CATEGORIES.find((category) =>
    location.pathname.startsWith(`${archiveBasePath(lang, { category })}/`),
  )
  const foreignItem =
    slug && !ownItem && mirroredCategory
      ? findForeignItemBySlug(foreignData, mirroredCategory, slug)
      : undefined
  const item = ownItem ?? foreignItem
  /* The interface follows the page's language; everything that describes the
     piece to search engines and citations follows the piece's own, so a
     mirrored column names its canonical address, never this one. */
  const itemLang: Lang = item?.lang ?? lang
  /* The article's own text, marked up in its language when that differs. */
  const textLang = itemLang !== lang ? { lang: itemLang } : {}
  /* An old citation lands on the current permalink rather than rendering the
     piece at a second address, so canonical stays single. */
  const retired = Boolean(slug && item && isRetiredSlug(itemLang, slug))
  const { body, failed: bodyFailed, retry: retryBody } = useArticleBody(item)
  const progress = useReadingProgress()
  const [fontScale, setFontScale] = useState(1)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const t = content[lang]
  const articleCanonicalPath = item ? `${archiveBasePath(itemLang, item)}/${item.slug}` : location.pathname
  const articleDateIso = isoDateFromArchiveDate(item?.date)
  usePageMeta({
    title: item ? `${item.title} — Şahin Alpay` : t.htmlTitle,
    description: item ? (item.subtitle ?? item.excerpt ?? item.title) : t.htmlDescription,
    canonicalPath: articleCanonicalPath,
    alternates: item ? { [itemLang]: articleCanonicalPath } : pageAlternates(location.pathname),
    robots: item ? 'index,follow' : 'noindex,follow',
    type: 'article',
  })
  const articleUrl = item ? `${pageUrl(archiveBasePath(itemLang, item))}/${item.slug}` : ''
  const sectionName = item ? sectionNameFor(itemLang, item.category) : t.columns.title
  const sectionUrl = item
    ? pageUrl(archiveBasePath(itemLang, item))
    : pageUrl(paths[lang].columns!)

  useJsonLd(
    'article',
    item ? articleJsonLd({ item, lang: itemLang, articleUrl, sectionUrl, sectionName }) : null,
  )
  useJsonLd(
    'breadcrumb',
    item
      ? breadcrumbJsonLd({
          lang: itemLang,
          homeUrl: pageUrl(paths[itemLang].home!),
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
    return <Navigate to={`${readerBasePath(item, lang)}/${item.slug}`} replace />
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

  const photos = item.clippings?.filter((clipping) => clipping.kind === 'photo') ?? []
  const scans = item.clippings?.filter((clipping) => clipping.kind !== 'photo') ?? []
  const shortOpener = !body || !body[0] || body[0].length < 60
  /* A piece that survives only as a scan has no running text on the page: its
     words are inside the clipping. Rendering an empty body column for it left
     a 72px gap under the byline, and the text-size controls resized nothing.
     Both now appear only where there is text to show or to wait for. */
  const hasRunningText = Boolean(item?.hasBody || (body && body.length > 0) || bodyFailed)
  const cover: ArchiveClipping | null =
    scans[0] ?? (item.imageSrc ? { src: item.imageSrc, alt: item.title } : null)
  /* The lead photos and the clipping open in the page's own lightbox, in the
     order they appear, each captioned with the piece it belongs to. A cover
     with a PDF behind it still opens the PDF: that is a document, not an
     image to enlarge. */
  /* A multi-page scan (a journal article photographed page by page) is read
     in place, page after page, instead of through a single cover image. */
  const pageScans = !item.pdfSrc && scans.length > 1
  /* An academic record's outlet is its section's name in the record's own
     language, not a publication, so a mirrored one names the section in the
     page's language instead — the way a mirrored column's back link reads. */
  const outletLabel = item.category === 'academic' && itemLang !== lang ? sectionNameFor(lang, 'academic') : item.outlet
  const sectionLinkLabel = item.category === 'columns' ? t.columns.title : outletLabel
  /* Back to the list the reader came from — the same paper, page and search
     (the list hands its address over in the link's state). Arriving from
     anywhere else, a shelf section still opens on the piece's own paper
     rather than on the newest one. */
  const sectionPath = archiveBasePath(lang, item)
  const cameFrom = (location.state as { from?: unknown } | null)?.from
  const backTo =
    typeof cameFrom === 'string' && cameFrom.split('?')[0] === sectionPath
      ? cameFrom
      : item.category === 'columns' || item.category === 'analyses'
        ? `${sectionPath}?open=${encodeURIComponent(item.outlet)}`
        : sectionPath
  const clippingCaption = [cover?.pageLabel ?? item.subtitle, outletLabel, item.date]
    .filter(Boolean)
    .join(' · ')
  const lightboxImages: LightboxImage[] = [
    ...photos.map((clipping) => ({
      src: clipping.src,
      alt: clipping.alt ?? item.title,
      caption: (
        <>
          <strong>{item.title}</strong>
          {item.imageCredit ? ` · ${item.imageCredit}` : ''}
        </>
      ),
    })),
    ...(pageScans
      ? scans.map((clipping, i) => ({
          src: clipping.src,
          alt: clipping.alt ?? `${item.title} — ${clipping.pageLabel ?? i + 1}`,
          caption: (
            <>
              <strong>{item.title}</strong>
              {` · ${clipping.pageLabel ?? i + 1} / ${scans.length}`}
            </>
          ),
        }))
      : []),
    ...(cover && !item.pdfSrc && !pageScans
      ? [
          {
            src: cover.src,
            alt: cover.alt ?? item.title,
            caption: (
              <>
                <strong>{item.title}</strong>
                {clippingCaption ? ` · ${clippingCaption}` : ''}
              </>
            ),
          },
        ]
      : []),
  ]

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
            <Link to={backTo}>{sectionLinkLabel}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{item.title}</span>
          </nav>
          <div className="article-tools">
            <Link className="back-link" to={backTo}>
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--icon-md)' }}>
                arrow_back
              </span>
              {sectionLinkLabel}
            </Link>
            {hasRunningText && (
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
            )}
            <CiteThis item={item} articleUrl={articleUrl} lang={lang} />
          </div>
          <h1 className="section-title" {...textLang}>
            {item.title}
          </h1>
          {item.subtitle && (
            <p className="article-subtitle" {...textLang}>
              {item.subtitle}
            </p>
          )}
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
                  {outletLabel ? ' · ' : ''}
                </>
              )}
              {outletLabel}
              {item.medium
                ? ` (${mediumLabel(item.medium, lang).toLocaleLowerCase(lang)})`
                : ''}
            </span>
            {/* An interview filed among the columns says so; a column on the
                columns page does not repeat what the page already says. */}
            {item.pieceKind && !(item.pieceKind === 'column' && item.category === 'columns') && (
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
            {photos.map((clipping, i) => (
              <figure className="article-lead-photo" key={clipping.src}>
                <button
                  type="button"
                  className="article-lead-photo-open"
                  aria-haspopup="dialog"
                  aria-label={content[lang].clippingViewer.enlargePhoto}
                  onClick={() => setLightbox(i)}
                >
                  <img src={clipping.src} alt={clipping.alt ?? item.title} loading="lazy" />
                </button>
              </figure>
            ))}
          </Reveal>
        )}
        {hasRunningText && (
        <Reveal
          as="div"
          delay={0.08}
          className={`article-body${shortOpener ? ' no-dropcap' : ''}`}
          id="article-body"
          {...textLang}
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
          ) : null}
        </Reveal>
        )}
        {pageScans && (
          <Reveal as="aside" className="clipping-viewer page-scans" delay={0.12}>
            <h2>{content[lang].clippingViewer.pagesHeading}</h2>
            <ol className="page-scan-list">
              {scans.map((clipping, i) => (
                <li className="page-scan" key={clipping.src}>
                  <button
                    type="button"
                    className="clipping-open"
                    aria-haspopup="dialog"
                    aria-label={`${content[lang].clippingViewer.openPage} — ${clipping.pageLabel ?? i + 1}`}
                    onClick={() => setLightbox(photos.length + i)}
                  >
                    <img
                      src={clipping.src}
                      alt={clipping.alt ?? `${item.title} — ${clipping.pageLabel ?? i + 1}`}
                      loading="lazy"
                    />
                    <span className="clipping-open-hint">
                      <span className="material-symbols-outlined" aria-hidden="true">
                        zoom_in
                      </span>
                      {content[lang].clippingViewer.openPage}
                    </span>
                  </button>
                  <p className="page-scan-label">
                    {clipping.pageLabel ?? i + 1} / {scans.length}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        )}
        {cover && !pageScans && (
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
                   only rendering of the scan, so it opens full-size in the
                   lightbox, where it can be zoomed to read the type. */
                <button
                  type="button"
                  className="clipping-open"
                  aria-haspopup="dialog"
                  aria-label={content[lang].clippingViewer.openImage}
                  onClick={() => setLightbox(photos.length)}
                >
                  <img src={cover.src} alt={cover.alt ?? item.title} loading="lazy" />
                  <span className="clipping-open-hint">
                    <span className="material-symbols-outlined" aria-hidden="true">
                      zoom_in
                    </span>
                    {content[lang].clippingViewer.openImage}
                  </span>
                </button>
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
                aria-label={`${outletLabel} — ${
                  lang === 'tr'
                    ? 'orijinal kaynak (yeni sekmede açılır)'
                    : 'original source (opens in a new tab)'
                }`}
              >
                {outletLabel} — {lang === 'tr' ? 'orijinal kaynak' : 'original source'}
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
        <ImageLightbox
          images={lightboxImages}
          index={lightbox}
          onIndexChange={setLightbox}
          onClose={() => setLightbox(null)}
          lang={lang}
        />
      </div>
    </section>
  )
}
