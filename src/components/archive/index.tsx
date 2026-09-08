import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { content, type Lang } from '../../content'
import type {
  ArchiveItem,
  FlatArchiveSection,
  OutletArchiveSection,
  OutletGroup,
} from '../../archive/types'
import { getCachedBody, loadOutletBodies } from '../../archive/bodyRegistry'
import { itemScanClippings } from '../../archive/itemUtils'
import { archiveItemBasePath, archiveLink, mediumLabel, pieceKindLabel } from '../../archive/links'
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
} from '../../archive/query'
import { parseTurkishDate } from '../../dateUtils'
import { pageAlternates, pageUrl, usePageMeta, useJsonLd } from '../../lib/seo'
import { collectionJsonLd } from '../../lib/structuredData'
import { Reveal } from '../Reveal'
import logoAydinlik from '../../assets/logos/aydinlik.webp'
import logoCumhuriyet from '../../assets/logos/cumhuriyet.webp'
import logoForum from '../../assets/logos/forum.webp'
import logoIsciKoylu from '../../assets/logos/isci-koylu.webp'
import logoMilliyet from '../../assets/logos/milliyet.svg'
import logoP24 from '../../assets/logos/p24.webp'
import logoSabah from '../../assets/logos/sabah.webp'
import logoTodaysZaman from '../../assets/logos/todays-zaman.webp'
import logoZaman from '../../assets/logos/zaman.webp'

/**
 * The archive list pages: the newsstand shelf that fronts the per-outlet
 * columns archive, the flat list used by the other sections, and the search,
 * filter, sort and pagination controls they share.
 *
 * Filter state lives in the URL, so a filtered view is a shareable address.
 * Pagination bounds the DOM; it does not bound what is downloaded — the
 * archive index arrives as one chunk, and full body text only when someone
 * searches. See docs/OPERATIONS.md.
 */

export function ArchiveRow({
  item,
  outlet,
  lang,
}: {
  item: ArchiveItem
  outlet?: string
  lang: Lang
}) {
  const link = archiveLink(item)
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
  const link = archiveLink(item)
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
  foreignOutletNames,
  selectedName,
  onSelect,
  currentPage,
  totalPages,
  onPageChange,
  reduce,
}: {
  entries: NewsstandOutlet[]
  lang: Lang
  foreignOutletNames: ReadonlySet<string>
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
  /* Two shelves, not one row with a rule through it: the reader is choosing a
     newspaper, and which language it published in is part of that choice.

     Which shelf a group belongs on comes from the list it arrived in, not
     from reading its first item's language: an outlet whose archive is still
     empty — it renders as an "coming soon" spine — has no item to read, so
     inferring the language put every empty outlet on the foreign shelf. */
  const own = ordered.filter((entry) => !foreignOutletNames.has(entry.outlet.outlet))
  const foreign = ordered.filter((entry) => foreignOutletNames.has(entry.outlet.outlet))
  const t = content[lang]

  const shelf = (shelfEntries: NewsstandOutlet[], label: string) => (
    <div className="newsstand-stack-shelf" role="group" aria-label={label}>
      {shelfEntries.map((entry) => (
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
  )

  return (
    <div className="newsstand-stack">
      {/* One column holding both shelves, so .newsstand-stack keeps exactly
          two children — from 900px it is a row, shelves left and the
          contents panel filling the rest beside them. */}
      <div className="newsstand-shelves">
        {own.length > 0 && shelf(own, lang === 'tr' ? 'Gazete seç' : 'Choose a newspaper')}
        {foreign.length > 0 && (
          <div className="newsstand-foreign">
            <h2 className="newsstand-foreign-title">{t.foreignArchiveLabel}</h2>
            <p className="newsstand-foreign-note">{t.foreignArchiveNote}</p>
            {shelf(foreign, t.foreignArchiveLabel)}
          </div>
        )}
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

export function NewsstandArchivePage({
  data,
  lang,
  foreignOutlets = [],
}: {
  data: OutletArchiveSection
  lang: Lang
  /* The other language's outlets for this section. Folded into the same
     working set so search, the year range and pagination cover them like any
     other outlet; split apart again only at the shelf, which labels them. */
  foreignOutlets?: OutletGroup[]
}) {
  const location = useLocation()
  const outlets = useMemo(
    () => [...data.outlets, ...foreignOutlets],
    [data.outlets, foreignOutlets],
  )
  const foreignOutletNames = useMemo(
    () => new Set(foreignOutlets.map((group) => group.outlet)),
    [foreignOutlets],
  )
  usePageMeta({
    title: `${data.title} — Şahin Alpay`,
    description: data.intro,
    alternates: pageAlternates(location.pathname),
  })
  useJsonLd(
    'collection',
    collectionJsonLd({
      name: data.title,
      description: data.intro,
      lang,
      url: pageUrl(location.pathname),
      items: outlets.flatMap((group) => group.items),
      itemUrl: (item) => `${pageUrl(archiveItemBasePath(item))}/${item.slug}`,
    }),
  )

  const [searchParams, setSearchParams] = useSearchParams()
  const reduce = useReducedMotion()
  const search = searchParams.get('q') ?? ''
  const activeOutlet = searchParams.get('outlet') ?? 'all'
  const fromYear = searchParams.get('from') ?? ''
  const toYear = searchParams.get('to') ?? ''
  const openOutletName = searchParams.get('open')
  const requestedPage = positivePage(searchParams.get('page'))

  const sectionItems = useMemo(() => outlets.flatMap((o) => o.items), [outlets])
  const bodySearch = useBodySearchIndex(sectionItems, search)
  const { bodyIndex } = bodySearch

  const newsstandOutlets = useMemo(
    () => deriveNewsstandOutlets(outlets, activeOutlet, search, fromYear, toYear, bodyIndex),
    [outlets, activeOutlet, search, fromYear, toYear, bodyIndex],
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
        {!outlets.some((o) => o.items.length > 0) ? (
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
            {...(reduce ? {} : { exit: { opacity: 0 } })}
            transition={{ duration: reduce ? 0 : 0.25 }}
          >
            <NewsstandStack
              entries={newsstandOutlets}
              lang={lang}
              foreignOutletNames={foreignOutletNames}
              selectedName={
                effectiveOpenName ??
                orderNewsstandOutlets(newsstandOutlets)[0]?.outlet.outlet ??
                ''
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

export function FlatArchivePage({
  data,
  lang,
  foreignItems = [],
}: {
  data: FlatArchiveSection
  lang: Lang
  /* The other language's records for this section. Merged into one dated list
     rather than shown as a second block: interviews and academic articles
     exist in Turkish only, so on the English pages `data.items` is empty and
     these are the whole list. Should a section ever hold both, the merged
     list stays honest — every row names its outlet, and the outlets do not
     overlap between languages — and the note below says what is here. */
  foreignItems?: ArchiveItem[]
}) {
  const location = useLocation()
  const items = useMemo(() => [...data.items, ...foreignItems], [data.items, foreignItems])
  usePageMeta({
    title: `${data.title} — Şahin Alpay`,
    description: data.intro,
    alternates: pageAlternates(location.pathname),
  })
  useJsonLd(
    'collection',
    collectionJsonLd({
      name: data.title,
      description: data.intro,
      lang,
      url: pageUrl(location.pathname),
      items,
      itemUrl: (item) => `${pageUrl(archiveItemBasePath(item))}/${item.slug}`,
    }),
  )
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

  const bodySearch = useBodySearchIndex(items, search)
  const { bodyIndex } = bodySearch
  const filtered = useMemo(
    () =>
      sortItems(
        items.filter((item) =>
          matchesFilters(item, search, fromYear, toYear, sourceKind, bodyIndex),
        ),
        sort,
      ),
    [items, search, fromYear, toYear, sourceKind, sort, bodyIndex],
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
          {foreignItems.length > 0 && (
            <p className="archive-foreign-note">
              <strong>{content[lang].foreignArchiveLabel}.</strong>{' '}
              {content[lang].foreignArchiveNote}
            </p>
          )}
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
              {items.length === 0 ? (
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
