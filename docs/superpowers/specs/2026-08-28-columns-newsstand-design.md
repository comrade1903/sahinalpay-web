# Columns Newsstand Redesign

## Goal

Replace the `/columns` archive page's visual presentation with a
vintage-newspaper "newsstand" concept — outlets shown as newspapers on a
wood shelf (or a CSS-3D carousel), opening into a per-outlet article list —
while keeping every other outlet-archive page (`/analyses`, `/interviews`,
`/academic`) on the current `OutletArchivePage` list view untouched.

## Scope

- **In scope**: `/columns` and `/tr/koseler` (whatever the TR path key
  resolves to) only. A new component, `NewsstandArchivePage`, replaces
  `OutletArchivePage` for `pageKey === 'columns'` in `LoadedArchiveRoutePage`
  (`src/App.tsx`).
- **Out of scope**: analyses/interviews/academic pages (stay on
  `OutletArchivePage`), a real 3D/WebGL library, new topic-category
  taxonomy (politics/economy/culture — not present in the data model, will
  not be invented per the content-integrity rule in `CLAUDE.md`), a new
  inline PDF/clipping viewer (the existing per-article reader page already
  renders clippings and "original source" links — reused, not duplicated),
  real newspaper logos (none exist in `public/`).

## Data reuse (no new data model)

Sourced from `archiveData.columns[lang]` (`OutletArchiveGroup[]`), same as
today. Per outlet, derive at render time (no seed changes):

- `outlet` name, `items.length`, and date range (`min`/`max` via
  `parseTurkishDate` over `items.map(i => i.date)`).
- Cover image: if `itemScanClippings(item).length > 0` for any item in the
  outlet, use that item's first clipping page image as a cropped/masked
  cover photo; otherwise render the typographic cover (outlet name in
  `--display` font, date range, item count) — no new asset pipeline.
- Filtering/sorting logic (`matchesFilters`, `sortByDate`,
  `useBodySearchIndex`) is reused as-is from the existing file; only the
  category filter is dropped (not applicable — every item here is already
  `category: 'columns'`).

## Component structure (all inside `src/App.tsx`, per repo convention)

- `NewsstandArchivePage({ data, lang })` — top-level, replaces
  `OutletArchivePage` for this route. Owns `searchParams` state (`q`,
  `outlet`, `from`, `to`, `view`, `open`) the same way `OutletArchivePage`
  does today, so filtered/opened state is shareable/bookmarkable and
  survives refresh.
- `NewsstandControlBar` — sticky top bar: search input (reuses
  `ArchiveSearchRow` pattern), outlet chip filter, year-range filter
  (reuses `YearRangeFilter`), and the Shelf/Carousel `view` toggle.
- `NewsstandShelf` — desktop: CSS grid of `NewspaperCover` cards on a
  wood-textured strip (CSS `repeating-linear-gradient`, no image asset).
  Mobile (`<640px` per existing breakpoint variables): the same cards in a
  horizontally scrollable, `scroll-snap-type: x mandatory` strip,
  regardless of `view` — carousel 3D effect is desktop-only, since
  `rotateY` perspective on a narrow touch viewport is illegible and
  fighting scroll-snap gestures is a known bad pattern for this
  older-skewing audience.
- `NewsstandCarousel` — desktop only: same cards, center card at
  `rotateY(0) scale(1)`, neighbors at `rotateY(±28deg) scale(0.85)` with
  reduced opacity, driven by `motion`'s `animate` on index change; falls
  back to the shelf's flat grid when `useReducedMotion()` is true.
- `NewspaperCover` — one outlet's card; `onClick` sets `open=<outlet>` in
  search params.
- `OpenedNewspaper` — renders when `open` is set: masthead-style header
  (outlet name, date range), "Back to All Newspapers" button (clears
  `open`), and the outlet's articles as a list reusing `ArchiveRow` (drop
  the `outlet` sub-label since it's now implied by the open newspaper).
  Clicking an `ArchiveRow` behaves exactly as it does today
  (`archiveLink`) — internal reader page or external link — no new
  preview surface.
- Transition between grid/carousel and `OpenedNewspaper`: `motion`
  `AnimatePresence` — non-selected cards fade+slide out, selected card
  scales/flips (`rotateY` 0→180 half-flip swapped for a cross-fade under
  `prefers-reduced-motion`) into the full-width opened view.

## Styling

- New CSS custom properties in `src/index.css`: `--wood-base`,
  `--wood-grain` (sepia/brown tones) for the shelf background;
  reuse existing `--paper`/background and `--ink`/`--display` tokens for
  cards and typography — no new font import.
- New classes: `.newsstand-*` namespace (`.newsstand-shelf`,
  `.newsstand-carousel`, `.newsstand-cover`, `.newsstand-cover-photo`,
  `.newsstand-cover-typographic`, `.newsstand-opened`), following the
  existing semantic-class convention. No Tailwind, no utility classes.
- Hover: `box-shadow` + slight `rotate`/`translateY` for a "paper lift"
  feel — no page-curl shader.
- Both light and dark theme, and both languages, checked manually in
  browser before calling this done (per `CLAUDE.md` UI-verification rule).

## Edge cases

- `useArchiveData()` still loading → existing loading skeleton pattern,
  unchanged.
- Outlet with a single item → cover still renders (count = 1), opened
  view shows one row.
- Search/date filters narrow the shelf to zero outlets → empty-state
  message (bilingual), same tone as the existing
  `'No pieces match these filters.'` string.
- `open` param referencing an outlet no longer in the filtered set (e.g.
  user filtered after opening) → falls back to the shelf view instead of
  rendering an empty `OpenedNewspaper`.

## i18n

Every new UI string (toggle labels, "Back to All Newspapers", empty
states) added to `content.ts` for both `tr` and `en` — none hardcoded
inline, per the existing convention in this file.

## Verification

`npm run build`, `npm run lint`, `npm run validate:content` (route/import
change only, no data change, but run for safety), then manual check in a
running browser: `/columns` and `/tr/koseler`(-equivalent), light+dark
theme, desktop shelf, desktop carousel toggle, mobile-width scroll strip,
opening/closing a newspaper, clicking through to an article.
