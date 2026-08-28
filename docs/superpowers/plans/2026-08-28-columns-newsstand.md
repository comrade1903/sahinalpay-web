# Columns Newsstand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `/columns` (`/tr/kose-yazilari`) archive page's list view with a vintage-newspaper "newsstand": outlets rendered as newspapers on a wood shelf or a CSS-3D carousel, opening into a per-outlet, paginated article list.

**Architecture:** One new top-level component, `NewsstandArchivePage`, replaces `OutletArchivePage` for `pageKey === 'columns'` only (`analyses`/`interviews`/`academic` keep the existing list view). Built as four vertical slices inside `src/App.tsx` — each slice leaves the page fully working and wired into the live route, because this file's strict unused-checks (`noUnusedLocals`) reject any function that exists but isn't called yet, so "build the pieces, wire them at the end" isn't viable here. All new markup/styling lives in `src/index.css` under a new `.newsstand-*` class namespace plus new `--wood-*` custom properties, following the file's existing token/class conventions exactly.

**Tech Stack:** React 19 + TypeScript, `motion/react` (`AnimatePresence`, `useReducedMotion` — already a dependency, no new packages), hand-written CSS (no Tailwind, no new CSS/animation/3D library).

**Spec:** `docs/superpowers/specs/2026-08-28-columns-newsstand-design.md`

## Global Constraints

- Scope is `/columns` only. Do not touch `OutletArchivePage`, `FlatArchivePage`, or the analyses/interviews/academic routes.
- No new dependencies. "3D" is CSS `perspective`/`rotateY` driven by a `data-offset` attribute plus CSS `transition`; `motion`'s `AnimatePresence` is used only for the shelf/carousel ↔ opened-newspaper mount/unmount swap.
- No new topic-category filter (politics/economy/culture) — not present in the data model, not invented. No new "source kind" filter and no sort control in the newsstand UI (YAGNI — the original prompt's filter list is Newspaper Name + Date Range only; items inside an opened paper are always shown newest-first via the existing `sortByDate`).
- Date filtering stays **year-only** (reuses the existing `YearRangeFilter` component as-is). The original prompt mentions "Year/Month," but there is no month-picker anywhere else in this codebase and article dates are free-text strings of inconsistent precision — adding one would be new UI surface the rest of the site doesn't have. Documented here rather than silently dropped.
- No real newspaper logos or a new "category badge" on article rows — `public/` has no logo assets, and every item on this page is already `category: 'columns'`. Cover art is: a real clipping scan image where `itemScanClippings()` finds one, otherwise a typographic card (outlet name in `--display` font). Article rows reuse `ArchiveRow` unchanged, which already renders date, medium/piece-kind badges, clipping badge, title, and excerpt.
- Clicking an article never opens a new inline PDF/clipping preview — it reuses the existing `archiveLink()`/`ArchiveRow` navigation (internal reader page or external link), exactly as today.
- **No automated test suite exists in this repo** (confirmed in `CLAUDE.md` — no test script, no `*.test.*` files). Per-step verification is `npx tsc -b` (fast typecheck) for every code step; each task's final steps are `npm run build` + `npm run lint`, plus a live-browser check for every task that changes visible behavior. This replaces the "write failing test" step from the standard task template.
- Every UI string added here already exists bilingually via `data.kicker`/`data.title`/`data.intro`/`data.emptyLabel` (from `content.ts`'s existing `t.columns`) or is a new `lang === 'tr' ? … : …` inline ternary — matching how `OutletArchivePage` and its helper components already do every one of their UI strings today. No edits to `content.ts` are needed.
- No route, `PageKey`, or sitemap changes — `/columns` and `/tr/kose-yazilari` keep their existing URLs; only the rendered component changes. `npm run generate:sitemap` is **not** required for this work (it's only needed when routes or archive items are added/removed).
- Both languages (`/columns`, `/tr/kose-yazilari`), both themes (light/dark), and a mobile-width viewport must be manually checked in a running browser before any task is considered done, per `CLAUDE.md`'s Done definition.

---

## File Structure

- **Modify `src/App.tsx`**: add newsstand helpers/components (`outletDateRangeLabel`, `outletCoverClipping`, `NewspaperCover`, `NewsstandShelf`, `NewsstandCarousel`, `OpenedNewspaper`, `NewsstandControlBar`, `deriveNewsstandOutlets`, `NewsstandArchivePage`) directly above the existing `function OutletArchivePage(...)`, matching this file's existing convention of one flat file with every page/component in it. Add `OutletGroup` to the existing `./archive/types` type import. Change one call site in `LoadedArchiveRoutePage` to use `NewsstandArchivePage` for `case 'columns'`. Add `AnimatePresence` to the existing `motion/react` import.
- **Modify `src/index.css`**: add `--wood-surface` / `--wood-grain` / `--wood-edge` custom properties (base + two dark-theme blocks, matching the existing `--mark-*` token pattern), and a new `/* ---------- Newsstand (columns page) ---------- */` section with all `.newsstand-*` classes, inserted immediately after the existing `.archive-loading { … }` rule.

No new files. No changes to `src/content.ts`, `src/routes.ts`, `src/archive/**`, or any script.

---

## Task 1: Static newsstand shell (shelf + open/close, no filters, no motion)

Ships the core mechanic end to end: outlets on a wood shelf, click a cover to open its article list (reusing `ArchiveRow`), a back button to return. No search/filter/URL state yet (local `useState`), no carousel, no animation yet — those are later tasks. This is already what a visitor sees and can use.

**Files:**
- Modify: `src/App.tsx` (new code inserted immediately above `function OutletArchivePage`; one import edit; one call-site edit in `LoadedArchiveRoutePage`)
- Modify: `src/index.css` (new tokens + new `.newsstand-*` section)

**Interfaces:**
- Consumes: `OutletGroup`, `ArchiveItem`, `ArchiveClipping`, `OutletArchiveSection` (from `./archive/types`), `Lang` (from `./content`), `parseTurkishDate` (from `./dateUtils`), `itemScanClippings` (from `./archive/itemUtils`), and in-file `ArchiveRow`, `sortItems`, `Reveal`, `usePageMeta`, `useJsonLd`, `archiveBasePath`, `pageAlternates`, `pageUrl`, `isoDateFromArchiveDate` (all already defined earlier in `App.tsx`, used exactly as `OutletArchivePage` already uses them).
- Produces: `outletDateRangeLabel(items: ArchiveItem[]): string | null`, `outletCoverClipping(outlet: OutletGroup): ArchiveClipping | null`, `NewspaperCover`, `NewsstandShelf`, `OpenedNewspaper`, `NewsstandArchivePage({ data: OutletArchiveSection; lang: Lang })` — the last is what Task 2 onward keep modifying and what gets wired into the route.

- [ ] **Step 1: Add `OutletGroup` to the archive/types import**

In `src/App.tsx`, find:

```tsx
import type {
  ArchiveClipping,
  ArchiveItem,
  FlatArchiveSection,
  OutletArchiveSection,
} from './archive/types'
```

Replace with:

```tsx
import type {
  ArchiveClipping,
  ArchiveItem,
  FlatArchiveSection,
  OutletArchiveSection,
  OutletGroup,
} from './archive/types'
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b`
Expected: passes (this alone doesn't change behavior — `OutletGroup` isn't used yet, but it's a type-only import so `noUnusedLocals` doesn't flag it until step 3 makes it moot anyway; if it errors, the import path/name is wrong).

- [ ] **Step 3: Add the newsstand helpers and components**

In `src/App.tsx`, immediately above `function OutletArchivePage({ data, lang }: { data: OutletArchiveSection; lang: Lang }) {`, insert:

```tsx
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

/** First real clipping scan found among an outlet's items, used as the
    newsstand cover photo. Scans the outlet's full item list (not a
    filtered subset) so the cover doesn't flicker between photo and
    typographic as filters change. */
function outletCoverClipping(outlet: OutletGroup): ArchiveClipping | null {
  for (const item of outlet.items) {
    const [first] = itemScanClippings(item)
    if (first) return first
  }
  return null
}

function NewspaperCover({
  outlet,
  count,
  lang,
  onOpen,
}: {
  outlet: OutletGroup
  count: number
  lang: Lang
  onOpen: () => void
}) {
  const cover = outletCoverClipping(outlet)
  const dateRange = outletDateRangeLabel(outlet.items)
  return (
    <button type="button" className="newsstand-cover" onClick={onOpen}>
      {cover ? (
        <span
          className="newsstand-cover-photo"
          style={{ backgroundImage: `url(${cover.src})` }}
          role="img"
          aria-label={cover.alt ?? outlet.outlet}
        />
      ) : (
        <span className="newsstand-cover-typographic">
          <span className="newsstand-cover-name">{outlet.outlet}</span>
        </span>
      )}
      <span className="newsstand-cover-meta">
        <span className="newsstand-cover-outlet">{outlet.outlet}</span>
        {dateRange && <span className="newsstand-cover-dates">{dateRange}</span>}
        <span className="newsstand-cover-count">
          {lang === 'tr' ? `${count} yazı` : `${count} pieces`}
        </span>
      </span>
    </button>
  )
}

function NewsstandShelf({
  outlets,
  lang,
  onOpen,
}: {
  outlets: OutletGroup[]
  lang: Lang
  onOpen: (outletName: string) => void
}) {
  return (
    <div className="newsstand-shelf">
      <div className="newsstand-cards">
        {outlets.map((outlet) => (
          <NewspaperCover
            key={outlet.outlet}
            outlet={outlet}
            count={outlet.items.length}
            lang={lang}
            onOpen={() => onOpen(outlet.outlet)}
          />
        ))}
      </div>
    </div>
  )
}

function OpenedNewspaper({
  outlet,
  lang,
  onClose,
}: {
  outlet: OutletGroup
  lang: Lang
  onClose: () => void
}) {
  const dateRange = outletDateRangeLabel(outlet.items)
  const items = sortItems(outlet.items, 'newest')
  return (
    <div className="newsstand-opened">
      <div className="newsstand-opened-header">
        <button type="button" className="newsstand-back" onClick={onClose}>
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_back
          </span>
          {lang === 'tr' ? 'Tüm Gazetelere Dön' : 'Back to All Newspapers'}
        </button>
        <h2 className="newsstand-opened-title">{outlet.outlet}</h2>
        {dateRange && <p className="newsstand-opened-dates">{dateRange}</p>}
      </div>
      <ul className="archive-list">
        {items.map((item) => (
          <ArchiveRow item={item} lang={lang} key={item.id} />
        ))}
      </ul>
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

  const [openOutletName, setOpenOutletName] = useState<string | null>(null)
  const openedOutlet = data.outlets.find((o) => o.outlet === openOutletName) ?? null

  return (
    <section className="section section-solo">
      <div className="container">
        <Reveal>
          <p className="kicker">{data.kicker}</p>
          <h1 className="section-title">{data.title}</h1>
          <p className="archive-intro">{data.intro}</p>
        </Reveal>

        {openedOutlet ? (
          <OpenedNewspaper
            outlet={openedOutlet}
            lang={lang}
            onClose={() => setOpenOutletName(null)}
          />
        ) : data.outlets.length === 0 ? (
          <p className="archive-empty">{data.emptyLabel}</p>
        ) : (
          <NewsstandShelf outlets={data.outlets} lang={lang} onOpen={setOpenOutletName} />
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc -b`
Expected: passes. (If it fails with "declared but never read" for any of the new functions, it means step 5 wasn't applied — every new function here must be reachable from `NewsstandArchivePage`, which itself must be reachable from the route table, which is step 5.)

- [ ] **Step 5: Wire `NewsstandArchivePage` into the `/columns` route**

In `src/App.tsx`, inside `LoadedArchiveRoutePage`, find:

```tsx
    case 'columns':
      return (
        <OutletArchivePage
          data={{ ...t.columns, outlets: archiveData.columns[lang] }}
          lang={lang}
        />
      )
```

Replace with:

```tsx
    case 'columns':
      return (
        <NewsstandArchivePage
          data={{ ...t.columns, outlets: archiveData.columns[lang] }}
          lang={lang}
        />
      )
```

- [ ] **Step 6: Typecheck**

Run: `npx tsc -b`
Expected: passes with no unused-declaration errors.

- [ ] **Step 7: Add the wood tokens to `src/index.css`**

Three insertions. All three add the same three lines; values differ because dark mode should look like the same shelf under weaker light, not an inverted palette.

7a. In the base `:root` block, find:

```css
  --mark-600: #a32b22;
  --mark-700: #7d1f18;

  /* Semantic light theme (default) */
```

Replace with:

```css
  --mark-600: #a32b22;
  --mark-700: #7d1f18;
  --wood-surface: #c9a877;
  --wood-grain: #9c7248;
  --wood-edge: #5c3f27;

  /* Semantic light theme (default) */
```

7b. In the `@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) { … } }` block (4-space indent), find:

```css
    --mark-600: #e2796c;
    --mark-700: #f0968c;

    --bg: var(--paper-50);
```

Replace with:

```css
    --mark-600: #e2796c;
    --mark-700: #f0968c;
    --wood-surface: #4d3a26;
    --wood-grain: #3a2c1e;
    --wood-edge: #26190f;

    --bg: var(--paper-50);
```

7c. In the `:root[data-theme='dark'] { … }` explicit-override block (2-space indent — this text is otherwise identical to 7b, use the indentation to find the right one), find:

```css
  --mark-600: #e2796c;
  --mark-700: #f0968c;

  --bg: var(--paper-50);
```

Replace with:

```css
  --mark-600: #e2796c;
  --mark-700: #f0968c;
  --wood-surface: #4d3a26;
  --wood-grain: #3a2c1e;
  --wood-edge: #26190f;

  --bg: var(--paper-50);
```

- [ ] **Step 8: Add the newsstand CSS section**

In `src/index.css`, find:

```css
.archive-loading {
  color: var(--muted);
  font-style: italic;
}
```

Replace with:

```css
.archive-loading {
  color: var(--muted);
  font-style: italic;
}

/* ---------- Newsstand (columns page) ---------- */
.newsstand-shelf {
  margin-top: var(--space-4);
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  border: 1px solid var(--wood-edge);
  background: repeating-linear-gradient(
    180deg,
    var(--wood-surface) 0px,
    var(--wood-surface) 22px,
    var(--wood-grain) 22px,
    var(--wood-grain) 24px
  );
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.25);
}

.newsstand-cards {
  display: flex;
  gap: var(--space-3);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-block: var(--space-2);
  -webkit-overflow-scrolling: touch;
}

.newsstand-cover {
  scroll-snap-align: start;
  flex: 0 0 160px;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface-raised);
  box-shadow: var(--shadow-soft);
  cursor: pointer;
  padding: 0;
  overflow: hidden;
  text-align: left;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.newsstand-cover:hover,
.newsstand-cover:focus-visible {
  transform: translateY(-4px) rotate(-1deg);
  box-shadow: var(--shadow-lift);
}

.newsstand-cover-photo {
  display: block;
  width: 100%;
  aspect-ratio: 3 / 4;
  background-size: cover;
  background-position: top center;
}
.newsstand-cover-typographic {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 3 / 4;
  background: var(--surface-low);
  padding: var(--space-2);
}
.newsstand-cover-name {
  font-family: var(--display);
  font-size: 1.1rem;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.02em;
  color: var(--ink);
}
.newsstand-cover-meta {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: var(--space-1) var(--space-2) var(--space-2);
  border-top: 1px solid var(--line);
}
.newsstand-cover-outlet {
  font-family: var(--display);
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--ink);
}
.newsstand-cover-dates,
.newsstand-cover-count {
  font-family: var(--body);
  font-size: 0.78rem;
  color: var(--muted);
}

.newsstand-opened {
  margin-top: var(--space-4);
}
.newsstand-opened-header {
  margin-bottom: var(--space-3);
}
.newsstand-back {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: none;
  background: none;
  color: var(--accent-ink);
  font-family: var(--body);
  font-weight: 600;
  cursor: pointer;
  padding: var(--space-1) 0;
  margin-bottom: var(--space-2);
}
.newsstand-back:hover,
.newsstand-back:focus-visible {
  text-decoration: underline;
}
.newsstand-opened-title {
  font-family: var(--display);
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  color: var(--ink);
  margin: 0;
}
.newsstand-opened-dates {
  color: var(--muted);
  margin: 0.2rem 0 0;
}

@media (min-width: 768px) {
  .newsstand-cards {
    overflow: visible;
    scroll-snap-type: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  }
  .newsstand-cover {
    flex: initial;
  }
}
```

- [ ] **Step 9: Build and lint**

Run: `npm run build`
Expected: passes (`tsc -b` then `vite build`).

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 10: Manual browser check**

Run: `npm run dev`, then in a browser:
- Visit `/columns`: a wood-textured shelf of newspaper covers renders (outlets that have a clipping scan show that photo, e.g. Milliyet/Cumhuriyet/P24; others show a typographic card). Click a cover — it's replaced by an article list (reusing the existing row styling) with a working "Back to All Newspapers" button.
- Visit `/tr/kose-yazilari`: same check, Turkish strings ("Tüm Gazetelere Dön", "N yazı").
- Toggle dark mode (theme toggle in the header): shelf and cards remain legible, wood tones read as wood (not a jarring bright orange).
- Narrow the browser to a mobile width (~375px): the shelf becomes a horizontally swipeable strip.

- [ ] **Step 11: Commit**

```bash
git add src/App.tsx src/index.css
git commit -m "$(cat <<'EOF'
Add static newsstand shelf to the columns archive page

EOF
)"
```

---

## Task 2: URL-driven state, filters, and pagination

Replaces Task 1's local `useState` with the existing `useSearchParams` pattern (search, outlet filter, year range, which outlet is open, page), reusing `matchesFilters`/`sortByDate`/`useBodySearchIndex`/`updateSearchParams`/`ActiveFilterSummary`/`ArchiveSearchRow`/`YearRangeFilter`/`Pagination` — all already defined earlier in `App.tsx` for `OutletArchivePage`. No new dependency, no new filter concepts beyond what Task 1 already declared out of scope.

**Files:**
- Modify: `src/App.tsx` (replace `NewsstandArchivePage`'s body; replace `OpenedNewspaper`'s and `NewsstandShelf`'s signatures; add `NewsstandControlBar`, `NewsstandOutlet`, `deriveNewsstandOutlets`)
- Modify: `src/index.css` (control bar layout)

**Interfaces:**
- Consumes: `useSearchParams` (react-router-dom, already imported), and in-file `matchesFilters`, `sortByDate`, `useBodySearchIndex`, `updateSearchParams`, `positivePage`, `ActiveFilter`, `ActiveFilterSummary`, `ArchiveSearchRow`, `YearRangeFilter`, `Pagination`, `ARCHIVE_PAGE_SIZE` (all defined above `OutletArchivePage` in the same file, unchanged).
- Produces: `interface NewsstandOutlet { outlet: OutletGroup; matchingItems: ArchiveItem[] }`, `deriveNewsstandOutlets(outlets: OutletGroup[], activeOutlet: string, search: string, fromYear: string, toYear: string, bodyIndex: ReadonlyMap<string, string[]>): NewsstandOutlet[]` — Task 4 (carousel) consumes this same type and helper.

- [ ] **Step 1: Replace `NewsstandShelf` to work off filtered entries**

Find the `NewsstandShelf` function added in Task 1 and replace it entirely with:

```tsx
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
    .filter((entry) => entry.matchingItems.length > 0)
}

function NewsstandShelf({
  entries,
  lang,
  onOpen,
}: {
  entries: NewsstandOutlet[]
  lang: Lang
  onOpen: (outletName: string) => void
}) {
  return (
    <div className="newsstand-shelf">
      <div className="newsstand-cards">
        {entries.map(({ outlet, matchingItems }) => (
          <NewspaperCover
            key={outlet.outlet}
            outlet={outlet}
            count={matchingItems.length}
            lang={lang}
            onOpen={() => onOpen(outlet.outlet)}
          />
        ))}
      </div>
    </div>
  )
}
```

(`matchesFilters` is called with `sourceKind` hard-coded to `'all'` — the newsstand doesn't expose a source-kind filter, per Global Constraints, but the shared helper still requires the parameter.)

- [ ] **Step 2: Replace `OpenedNewspaper` to accept a pre-paginated item list**

Find the `OpenedNewspaper` function from Task 1 and replace it entirely with:

```tsx
function OpenedNewspaper({
  outlet,
  items,
  lang,
  onClose,
  currentPage,
  totalPages,
  onPageChange,
}: {
  outlet: OutletGroup
  items: ArchiveItem[]
  lang: Lang
  onClose: () => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const dateRange = outletDateRangeLabel(outlet.items)
  return (
    <div className="newsstand-opened">
      <div className="newsstand-opened-header">
        <button type="button" className="newsstand-back" onClick={onClose}>
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_back
          </span>
          {lang === 'tr' ? 'Tüm Gazetelere Dön' : 'Back to All Newspapers'}
        </button>
        <h2 className="newsstand-opened-title">{outlet.outlet}</h2>
        {dateRange && <p className="newsstand-opened-dates">{dateRange}</p>}
      </div>
      {items.length === 0 ? (
        <p className="archive-empty">
          {lang === 'tr' ? 'Filtreyle eşleşen yazı yok.' : 'No pieces match these filters.'}
        </p>
      ) : (
        <ul className="archive-list">
          {items.map((item) => (
            <ArchiveRow item={item} lang={lang} key={item.id} />
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
```

`dateRange` is computed from `outlet.items` (the full, unfiltered list) deliberately — the header states the newspaper's whole archive span, not the currently filtered subset.

- [ ] **Step 3: Typecheck**

Run: `npx tsc -b`
Expected: fails — `NewsstandArchivePage` (not yet updated) still calls the old signatures. This confirms steps 1–2 actually changed the contract; step 4 fixes the caller.

- [ ] **Step 4: Add the control bar component**

Immediately above `function NewsstandArchivePage`, insert:

```tsx
function NewsstandControlBar({
  lang,
  search,
  setSearch,
  searchingBody,
  outlets,
  activeOutlet,
  setActiveOutlet,
  fromYear,
  toYear,
  setFromYear,
  setToYear,
}: {
  lang: Lang
  search: string
  setSearch: (value: string) => void
  searchingBody: boolean
  outlets: OutletGroup[]
  activeOutlet: string
  setActiveOutlet: (value: string | null) => void
  fromYear: string
  toYear: string
  setFromYear: (value: string) => void
  setToYear: (value: string) => void
}) {
  return (
    <div className="newsstand-controlbar">
      <ArchiveSearchRow
        lang={lang}
        search={search}
        setSearch={setSearch}
        searchingBody={searchingBody}
      />
      <div className="newsstand-controlbar-filters">
        <div className="chip-row">
          <button
            type="button"
            className="chip"
            data-active={activeOutlet === 'all'}
            aria-pressed={activeOutlet === 'all'}
            onClick={() => setActiveOutlet(null)}
          >
            {lang === 'tr' ? 'Tümü' : 'All'}
          </button>
          {outlets.map((o) => (
            <button
              type="button"
              key={o.outlet}
              className="chip"
              data-active={activeOutlet === o.outlet}
              aria-pressed={activeOutlet === o.outlet}
              onClick={() => setActiveOutlet(o.outlet)}
            >
              {o.outlet}
            </button>
          ))}
        </div>
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
```

- [ ] **Step 5: Replace `NewsstandArchivePage`'s body**

Replace the whole `NewsstandArchivePage` function (from Task 1) with:

```tsx
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
  const search = searchParams.get('q') ?? ''
  const activeOutlet = searchParams.get('outlet') ?? 'all'
  const fromYear = searchParams.get('from') ?? ''
  const toYear = searchParams.get('to') ?? ''
  const openOutletName = searchParams.get('open')
  const requestedPage = positivePage(searchParams.get('page'))

  const sectionItems = useMemo(() => data.outlets.flatMap((o) => o.items), [data.outlets])
  const { bodyIndex, searchingBody } = useBodySearchIndex(sectionItems, search)

  const newsstandOutlets = useMemo(
    () => deriveNewsstandOutlets(data.outlets, activeOutlet, search, fromYear, toYear, bodyIndex),
    [data.outlets, activeOutlet, search, fromYear, toYear, bodyIndex],
  )

  const openedEntry = openOutletName
    ? newsstandOutlets.find((entry) => entry.outlet.outlet === openOutletName) ?? null
    : null

  const totalPages = openedEntry
    ? Math.max(1, Math.ceil(openedEntry.matchingItems.length / ARCHIVE_PAGE_SIZE))
    : 1
  const currentPage = Math.min(requestedPage, totalPages)
  const paginatedItems = openedEntry
    ? openedEntry.matchingItems.slice(
        (currentPage - 1) * ARCHIVE_PAGE_SIZE,
        currentPage * ARCHIVE_PAGE_SIZE,
      )
    : []

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
          searchingBody={searchingBody}
          outlets={data.outlets}
          activeOutlet={activeOutlet}
          setActiveOutlet={(value) => setParam('outlet', value)}
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

        {openedEntry ? (
          <OpenedNewspaper
            outlet={openedEntry.outlet}
            items={paginatedItems}
            lang={lang}
            onClose={() => setParam('open', null)}
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
        ) : data.outlets.length === 0 ? (
          <p className="archive-empty">{data.emptyLabel}</p>
        ) : newsstandOutlets.length === 0 ? (
          <p className="archive-empty">
            {lang === 'tr' ? 'Filtreyle eşleşen gazete yok.' : 'No newspapers match these filters.'}
          </p>
        ) : (
          <NewsstandShelf
            entries={newsstandOutlets}
            lang={lang}
            onOpen={(outletName) => setParam('open', outletName)}
          />
        )}
      </div>
    </section>
  )
}
```

Note the edge case from the spec is now automatic: if `open` names an outlet that isn't in `newsstandOutlets` (filtered out by outlet/search/date), `openedEntry` is `null` and the page falls back to the shelf/empty-state branch — no special-case code needed.

- [ ] **Step 6: Typecheck**

Run: `npx tsc -b`
Expected: passes.

- [ ] **Step 7: Style the control bar**

In `src/index.css`, inside the `/* ---------- Newsstand (columns page) ---------- */` section added in Task 1, after the closing brace of the `@media (min-width: 768px) { … }` block, append:

```css
.newsstand-controlbar {
  position: sticky;
  top: 72px;
  z-index: 90;
  background: color-mix(in srgb, var(--surface) 92%, transparent);
  backdrop-filter: saturate(1.2) blur(8px);
  border-bottom: 1px solid var(--line);
  padding-block: var(--space-2);
  margin-bottom: var(--space-3);
}
.newsstand-controlbar-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: flex-start;
  margin-top: var(--space-2);
}
.newsstand-controlbar-filters .filter-card {
  margin: 0;
}
```

(`top: 72px` and `z-index: 90` match the existing convention for a secondary sticky bar sitting directly under the 72px-tall `.site-header`, which is `z-index: 100` — see `.reading-progress` in this same file.)

- [ ] **Step 8: Build and lint**

Run: `npm run build`
Expected: passes.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 9: Manual browser check**

`npm run dev`, then:
- `/columns`: search box and outlet chips and year-range inputs appear in a sticky bar under the header; typing a search term or narrowing the year range shrinks the shelf to matching outlets, and the count above updates. Clearing all filters restores the full shelf.
- Pick an outlet with many items (Milliyet) and open it — pagination controls appear at the bottom of its article list; paging works and scrolls back to the top of the list.
- With a newspaper open, refresh the page — it reopens the same newspaper (state is in the URL). Apply a filter that excludes every item in the currently open outlet — the page falls back to the shelf/empty state instead of showing a blank opened newspaper.
- Repeat on `/tr/kose-yazilari` and in dark mode.

- [ ] **Step 10: Commit**

```bash
git add src/App.tsx src/index.css
git commit -m "$(cat <<'EOF'
Wire newsstand filters, search, and pagination to the URL

EOF
)"
```

---

## Task 3: Motion transitions between shelf and opened newspaper

Layers `AnimatePresence` on top of the now-final conditional structure from Task 2, respecting `useReducedMotion()`, matching the animation idiom already used elsewhere in this file (e.g. `CookieConsent`, `Reveal`): `initial={reduce ? false : {...}}`, real `animate` values, `transition={{ duration: reduce ? 0 : n }}`.

**Files:**
- Modify: `src/App.tsx` (import `AnimatePresence`; wrap the opened/shelf conditional in `NewsstandArchivePage`)

**Interfaces:**
- Consumes: `AnimatePresence`, `motion`, `useReducedMotion` (all from `motion/react`).
- Produces: no new exports; `NewsstandArchivePage`'s rendered output gains enter/exit animation, unchanged prop signature.

- [ ] **Step 1: Import `AnimatePresence`**

Find:

```tsx
import { motion, useReducedMotion } from 'motion/react'
```

Replace with:

```tsx
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b`
Expected: passes (`AnimatePresence` imported but not yet used is a type-only concern only for values — this is a value import, so if it's genuinely unused after this step, `tsc` **will** flag it; step 3 immediately consumes it, so run these two steps together before checking rather than treating step 2 as a real gate. If you do check between steps, expect a "declared but never read" error here — that's expected and resolved by step 3.)

- [ ] **Step 3: Wrap the conditional render in `AnimatePresence`**

In `NewsstandArchivePage`, add `const reduce = useReducedMotion()` right after the `useSearchParams()` line:

```tsx
  const [searchParams, setSearchParams] = useSearchParams()
  const reduce = useReducedMotion()
```

Then find the closing render block (from Task 2):

```tsx
        {openedEntry ? (
          <OpenedNewspaper
            outlet={openedEntry.outlet}
            items={paginatedItems}
            lang={lang}
            onClose={() => setParam('open', null)}
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
        ) : data.outlets.length === 0 ? (
          <p className="archive-empty">{data.emptyLabel}</p>
        ) : newsstandOutlets.length === 0 ? (
          <p className="archive-empty">
            {lang === 'tr' ? 'Filtreyle eşleşen gazete yok.' : 'No newspapers match these filters.'}
          </p>
        ) : (
          <NewsstandShelf
            entries={newsstandOutlets}
            lang={lang}
            onOpen={(outletName) => setParam('open', outletName)}
          />
        )}
```

Replace with:

```tsx
        <AnimatePresence mode="wait" initial={false}>
          {openedEntry ? (
            <motion.div
              key={`opened-${openedEntry.outlet.outlet}`}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <OpenedNewspaper
                outlet={openedEntry.outlet}
                items={paginatedItems}
                lang={lang}
                onClose={() => setParam('open', null)}
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
            </motion.div>
          ) : data.outlets.length === 0 ? (
            <p className="archive-empty" key="empty">
              {data.emptyLabel}
            </p>
          ) : newsstandOutlets.length === 0 ? (
            <p className="archive-empty" key="empty-filtered">
              {lang === 'tr' ? 'Filtreyle eşleşen gazete yok.' : 'No newspapers match these filters.'}
            </p>
          ) : (
            <motion.div
              key="stage"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
            >
              <NewsstandShelf
                entries={newsstandOutlets}
                lang={lang}
                onOpen={(outletName) => setParam('open', outletName)}
              />
            </motion.div>
          )}
        </AnimatePresence>
```

- [ ] **Step 4: Typecheck, build, lint**

Run: `npx tsc -b && npm run build && npm run lint`
Expected: all pass.

- [ ] **Step 5: Manual browser check**

`npm run dev`, then on `/columns`: opening a newspaper now fades/scales in while the shelf fades out (and vice versa on "Back to All Newspapers"). In Chrome DevTools → Rendering tab → "Emulate CSS media feature prefers-reduced-motion: reduce", repeat the same interaction — the swap should be instant (no animation), never a layout jump or flash of both states at once. Repeat in dark mode.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx
git commit -m "$(cat <<'EOF'
Animate the shelf/opened-newspaper transition, respecting reduced motion

EOF
)"
```

---

## Task 4: Carousel view and Shelf/Carousel toggle

Adds the second display mode from the original brief: a center-focused, CSS-3D card carousel as an alternative to the flat shelf grid, with a toggle in the control bar. Positioning is driven entirely by a `data-offset` attribute and CSS `transition` (not `motion`, not per-frame JS) so it degrades cleanly: `prefers-reduced-motion` collapses it back to the same flat grid as the shelf, and a mobile media query collapses it to the same horizontal scroll strip as the shelf — both are CSS-only overrides, matching how the rest of this file's responsive/motion behavior works.

**Files:**
- Modify: `src/App.tsx` (add `NewsstandView` type and `NewsstandCarousel`; add view toggle to `NewsstandControlBar`; wire `view` state into `NewsstandArchivePage`)
- Modify: `src/index.css` (carousel 3D positioning, mobile fallback, reduced-motion fallback)

**Interfaces:**
- Consumes: `NewsstandOutlet`, `NewspaperCover`, `useReducedMotion` (all already defined).
- Produces: `type NewsstandView = 'shelf' | 'carousel'`, `NewsstandCarousel({ entries: NewsstandOutlet[]; lang: Lang; onOpen: (outletName: string) => void })`.

- [ ] **Step 1: Add `NewsstandCarousel`**

Immediately above `function NewsstandControlBar`, insert:

```tsx
type NewsstandView = 'shelf' | 'carousel'

function NewsstandCarousel({
  entries,
  lang,
  onOpen,
}: {
  entries: NewsstandOutlet[]
  lang: Lang
  onOpen: (outletName: string) => void
}) {
  const reduce = useReducedMotion()
  const [centerIndex, setCenterIndex] = useState(0)
  const clampedCenter = Math.min(centerIndex, Math.max(0, entries.length - 1))

  return (
    <div className="newsstand-carousel" data-reduced={reduce}>
      <button
        type="button"
        className="newsstand-carousel-nav newsstand-carousel-prev"
        onClick={() => setCenterIndex((i) => Math.max(0, i - 1))}
        disabled={clampedCenter === 0}
        aria-label={lang === 'tr' ? 'Önceki gazete' : 'Previous newspaper'}
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          chevron_left
        </span>
      </button>
      <div className="newsstand-cards">
        {entries.map(({ outlet, matchingItems }, index) => (
          <div
            className="newsstand-cover-wrap"
            data-offset={index - clampedCenter}
            key={outlet.outlet}
          >
            <NewspaperCover
              outlet={outlet}
              count={matchingItems.length}
              lang={lang}
              onOpen={() =>
                index === clampedCenter ? onOpen(outlet.outlet) : setCenterIndex(index)
              }
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        className="newsstand-carousel-nav newsstand-carousel-next"
        onClick={() => setCenterIndex((i) => Math.min(entries.length - 1, i + 1))}
        disabled={clampedCenter === entries.length - 1}
        aria-label={lang === 'tr' ? 'Sonraki gazete' : 'Next newspaper'}
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          chevron_right
        </span>
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b`
Expected: fails with "declared but never read" for `NewsstandCarousel`/`NewsstandView` — expected, fixed in step 3.

- [ ] **Step 3: Add the view toggle to `NewsstandControlBar`**

Replace the `NewsstandControlBar` function signature and body (from Task 2) with:

```tsx
function NewsstandControlBar({
  lang,
  search,
  setSearch,
  searchingBody,
  outlets,
  activeOutlet,
  setActiveOutlet,
  fromYear,
  toYear,
  setFromYear,
  setToYear,
  view,
  setView,
  carouselDisabled,
}: {
  lang: Lang
  search: string
  setSearch: (value: string) => void
  searchingBody: boolean
  outlets: OutletGroup[]
  activeOutlet: string
  setActiveOutlet: (value: string | null) => void
  fromYear: string
  toYear: string
  setFromYear: (value: string) => void
  setToYear: (value: string) => void
  view: NewsstandView
  setView: (value: NewsstandView) => void
  carouselDisabled: boolean
}) {
  return (
    <div className="newsstand-controlbar">
      <div className="newsstand-controlbar-top">
        <ArchiveSearchRow
          lang={lang}
          search={search}
          setSearch={setSearch}
          searchingBody={searchingBody}
        />
        <div
          className="newsstand-view-toggle chip-row"
          role="group"
          aria-label={lang === 'tr' ? 'Görünüm' : 'View'}
        >
          <button
            type="button"
            className="chip"
            data-active={view === 'shelf'}
            aria-pressed={view === 'shelf'}
            onClick={() => setView('shelf')}
          >
            {lang === 'tr' ? 'Raf' : 'Shelf'}
          </button>
          <button
            type="button"
            className="chip"
            data-active={view === 'carousel'}
            aria-pressed={view === 'carousel'}
            onClick={() => setView('carousel')}
            disabled={carouselDisabled}
            title={
              carouselDisabled
                ? lang === 'tr'
                  ? 'Azaltılmış hareket ayarında kullanılamaz'
                  : 'Unavailable with reduced motion enabled'
                : undefined
            }
          >
            {lang === 'tr' ? '3D Vitrin' : '3D Carousel'}
          </button>
        </div>
      </div>
      <div className="newsstand-controlbar-filters">
        <div className="chip-row">
          <button
            type="button"
            className="chip"
            data-active={activeOutlet === 'all'}
            aria-pressed={activeOutlet === 'all'}
            onClick={() => setActiveOutlet(null)}
          >
            {lang === 'tr' ? 'Tümü' : 'All'}
          </button>
          {outlets.map((o) => (
            <button
              type="button"
              key={o.outlet}
              className="chip"
              data-active={activeOutlet === o.outlet}
              aria-pressed={activeOutlet === o.outlet}
              onClick={() => setActiveOutlet(o.outlet)}
            >
              {o.outlet}
            </button>
          ))}
        </div>
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
```

- [ ] **Step 4: Wire `view` state into `NewsstandArchivePage`**

Add these two lines right after the existing `const reduce = useReducedMotion()` line:

```tsx
  const requestedView: NewsstandView = searchParams.get('view') === 'carousel' ? 'carousel' : 'shelf'
  const view: NewsstandView = reduce ? 'shelf' : requestedView
```

Update the `<NewsstandControlBar …>` call to pass the three new props:

```tsx
        <NewsstandControlBar
          lang={lang}
          search={search}
          setSearch={(value) => setParam('q', value)}
          searchingBody={searchingBody}
          outlets={data.outlets}
          activeOutlet={activeOutlet}
          setActiveOutlet={(value) => setParam('outlet', value)}
          fromYear={fromYear}
          toYear={toYear}
          setFromYear={(value) => setParam('from', value)}
          setToYear={(value) => setParam('to', value)}
          view={view}
          setView={(value) => setParam('view', value === 'shelf' ? null : value)}
          carouselDisabled={Boolean(reduce)}
        />
```

(`useReducedMotion()` types as `boolean | null` in `framer-motion`'s declarations — `carouselDisabled` is declared as a plain `boolean`, so the call site must coerce with `Boolean(...)` or `tsc -b` rejects the assignment.)

Finally, inside the `AnimatePresence`'s `key="stage"` branch, replace:

```tsx
              <NewsstandShelf
                entries={newsstandOutlets}
                lang={lang}
                onOpen={(outletName) => setParam('open', outletName)}
              />
```

with:

```tsx
              {view === 'carousel' ? (
                <NewsstandCarousel
                  entries={newsstandOutlets}
                  lang={lang}
                  onOpen={(outletName) => setParam('open', outletName)}
                />
              ) : (
                <NewsstandShelf
                  entries={newsstandOutlets}
                  lang={lang}
                  onOpen={(outletName) => setParam('open', outletName)}
                />
              )}
```

- [ ] **Step 5: Typecheck, build, lint**

Run: `npx tsc -b && npm run build && npm run lint`
Expected: all pass.

- [ ] **Step 6: Add carousel CSS**

In `src/index.css`, at the end of the `/* ---------- Newsstand (columns page) ---------- */` section (after the `.newsstand-controlbar-filters .filter-card { margin: 0; }` rule added in Task 2), append:

```css
.newsstand-controlbar-top {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
  justify-content: space-between;
}

.newsstand-carousel {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
}
.newsstand-carousel .newsstand-cards {
  position: relative;
  flex: 1;
  min-height: 280px;
  overflow: visible;
}
.newsstand-carousel-nav {
  flex: 0 0 auto;
  border: 1px solid var(--line);
  background: var(--surface-raised);
  border-radius: var(--radius-full);
  width: var(--control-hit-size);
  height: var(--control-hit-size);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.newsstand-carousel-nav:disabled {
  opacity: var(--control-disabled-opacity);
  cursor: not-allowed;
}

@media (min-width: 768px) {
  .newsstand-cover-wrap {
    position: absolute;
    top: 0;
    left: 50%;
    transition: transform 0.4s ease, opacity 0.4s ease;
    transform: translateX(-50%) scale(0.4);
    opacity: 0;
    pointer-events: none;
  }
  .newsstand-cover-wrap[data-offset='0'] {
    transform: translateX(-50%) rotateY(0deg) scale(1);
    opacity: 1;
    pointer-events: auto;
    z-index: 5;
  }
  .newsstand-cover-wrap[data-offset='1'] {
    transform: translateX(calc(-50% + 150px)) rotateY(-28deg) scale(0.85);
    opacity: 0.85;
    pointer-events: auto;
    z-index: 4;
  }
  .newsstand-cover-wrap[data-offset='-1'] {
    transform: translateX(calc(-50% - 150px)) rotateY(28deg) scale(0.85);
    opacity: 0.85;
    pointer-events: auto;
    z-index: 4;
  }
  .newsstand-cover-wrap[data-offset='2'] {
    transform: translateX(calc(-50% + 260px)) rotateY(-42deg) scale(0.68);
    opacity: 0.5;
    pointer-events: auto;
    z-index: 3;
  }
  .newsstand-cover-wrap[data-offset='-2'] {
    transform: translateX(calc(-50% - 260px)) rotateY(42deg) scale(0.68);
    opacity: 0.5;
    pointer-events: auto;
    z-index: 3;
  }
}

@media (max-width: 767px) {
  .newsstand-carousel {
    flex-direction: column;
  }
  .newsstand-carousel .newsstand-cards {
    display: flex;
    position: static;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    min-height: 0;
    width: 100%;
  }
  .newsstand-cover-wrap {
    scroll-snap-align: start;
    flex: 0 0 160px;
  }
  .newsstand-carousel-nav {
    display: none;
  }
}

.newsstand-carousel[data-reduced='true'] .newsstand-cards {
  position: static;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  min-height: 0;
  overflow: visible;
}
.newsstand-carousel[data-reduced='true'] .newsstand-cover-wrap {
  position: static;
  transform: none !important;
  opacity: 1 !important;
  pointer-events: auto !important;
}
.newsstand-carousel[data-reduced='true'] .newsstand-carousel-nav {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .newsstand-cover-wrap {
    transition: none !important;
  }
}
```

- [ ] **Step 7: Build and lint**

Run: `npm run build && npm run lint`
Expected: both pass.

- [ ] **Step 8: Manual browser check**

`npm run dev`, then on `/columns`:
- Click "3D Carousel" — the shelf is replaced by a center-focused stack of covers with side cards angled and scaled down. Use the ‹ › buttons and clicking a side card to move the center; clicking the centered card opens it.
- Shrink the window below ~767px width — the carousel becomes the same flat horizontal strip as the shelf (no 3D transforms).
- Enable "Emulate CSS prefers-reduced-motion: reduce" in DevTools — the "3D Carousel" toggle button becomes disabled, and if `?view=carousel` is in the URL directly, the page still renders the flat grid.
- Repeat on `/tr/kose-yazilari` and in dark mode.

- [ ] **Step 9: Commit**

```bash
git add src/App.tsx src/index.css
git commit -m "$(cat <<'EOF'
Add 3D carousel view with a shelf/carousel toggle

EOF
)"
```

---

## Task 5: Final verification pass

No new code expected — this task is the full `CLAUDE.md` "Done" checklist applied specifically to this feature, run fresh after Tasks 1–4. If any check below turns up a real problem, fix it in this task (small, targeted fixes only — do not use this task to add scope) and re-run the full checklist before committing.

**Files:**
- Possibly modify: `src/App.tsx`, `src/index.css` (only if a check below fails)

**Interfaces:** none new.

- [ ] **Step 1: Full verification suite**

Run, in order:
```bash
npm run build
npm run lint
npm run validate:content
```
Expected: all three pass. (`validate:content` isn't expected to be affected — no archive data or route changed — but it's part of the repo's Done definition whenever `/columns` behavior changes, so run it as a safety net.)

- [ ] **Step 2: Full manual QA matrix**

`npm run dev`, then work through this matrix on both `/columns` and `/tr/kose-yazilari`, in both light and dark theme (four passes total; note anything that fails):

| Check | Expected |
|---|---|
| Initial load | Shelf view, wood texture visible, covers show real clippings where available (Milliyet, Cumhuriyet, P24, Aydınlık, Forum, İşçi-Köylü) and typographic cards elsewhere (Sabah, Zaman, Today's Zaman) |
| Search | Typing narrows the shelf to outlets with a matching piece; clearing restores it |
| Outlet chip filter | Selecting one outlet leaves only that cover on the shelf |
| Year range filter | Narrowing the range removes outlets with nothing in range |
| Clear all | Restores full shelf and clears the URL query string |
| Open a newspaper | Article list appears with working "Back to All Newspapers"; URL gets `?open=<outlet>` |
| Pagination inside an opened newspaper | Appears for outlets with >20 matching pieces (e.g. Milliyet); paging updates the list and scrolls to the top of it |
| Refresh while open | Same newspaper stays open (state survives reload) |
| Click an article | Navigates exactly as it does today (internal reader page or external link) — no regression, no new inline preview |
| Carousel toggle | Switches to the center-focused 3D stack; prev/next and side-card clicks re-center; center-card click opens it |
| Mobile width (~375px, both views) | Horizontal swipeable strip, no 3D transforms, no horizontal page overflow |
| `prefers-reduced-motion: reduce` | Carousel toggle disabled and forced to shelf; open/close transition is instant, never a stuck half-state |
| Theme toggle | Wood shelf and covers stay legible and "wood-like" in dark mode, not just an inverted light palette |

- [ ] **Step 3: Fix anything the matrix surfaced**

If a row failed, make the minimal fix in `src/App.tsx`/`src/index.css`, re-run Step 1, and re-check the specific failing row (not the whole matrix) before moving on.

- [ ] **Step 4: Commit (only if Step 3 made changes)**

```bash
git add src/App.tsx src/index.css
git commit -m "$(cat <<'EOF'
Fix issues found in newsstand QA pass

EOF
)"
```

If Step 3 made no changes, skip this commit — there's nothing to record.
