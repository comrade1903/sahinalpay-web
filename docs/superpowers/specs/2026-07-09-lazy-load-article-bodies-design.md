# Lazy-load article body text out of the main bundle

## Problem

`src/archive/index.ts` statically imports every outlet's seed data (`ArchiveItemSeed[]`), including the full `body: string[]` paragraph text, and `App.tsx` imports `archiveData` eagerly for the home page, hub counters, and list pages. Everything ends up in the single main JS chunk regardless of whether the current page needs full article text.

Today the only outlet with real body content is `src/archive/tr/columns/p24.ts` (440KB source, 1098 lines), and it alone pushes the production bundle to 834KB raw / 284KB gzip — already past Vite's 500KB warning threshold. The task anticipates much larger outlets (Zaman, Today's Zaman) landing later; without a fix, every visitor pays for every outlet's full text on every page, including the home page.

Confirmed with the user: this repo currently has no Zaman/Today's Zaman content and no existing `manualChunks` config — P24 is the real, present-day stand-in for the problem, and the design should generalize automatically to future outlets rather than being P24-specific.

## Goals

- Home page, hub counters ("N columns", "N analyses" etc.), and "Recently Added" never need full article body text — metadata (title/date/slug/excerpt/outlet) is enough.
- `ArticlePage` (the single-article reader) is the only place that needs one article's full body, and only for the article being read.
- List/archive pages (`/columns`, `/analyses`, etc.) keep their existing full-text search behavior ("Metin, konu veya OCR ara…"), but don't pay for it until a user actually searches.
- The approach generalizes to new outlets (Zaman, Today's Zaman) without redesign — just re-running the same split when that content is imported.
- `npm run build` main bundle measurably shrinks; verify with a before/after size comparison.

## Non-goals

- `src/content.ts` (site copy, not archive articles) is untouched.
- No change to `ArticlePage`'s rendering of body paragraphs, clippings, or reading-progress UI.
- No per-article (per-slug) file splitting — splitting stays at the outlet-file granularity, matching the existing one-file-per-outlet organization.

## Design

### 1. Split each populated outlet file into metadata + body modules

Currently `src/archive/tr/columns/p24.ts` exports `p24ColumnSeeds: ArchiveItemSeed[]` with `body` inline per item. After the split:

- `src/archive/tr/columns/p24.ts` — same items, **without** `body`. Every item is guaranteed either an explicit `excerpt`/`subtitle`, or (for items that had neither) an auto-derived `excerpt` truncated from the original `body[0]` (~200 chars, word-boundary trimmed, `…` suffix). Adds `hasBody: true` for any item that had body content. This file is imported eagerly, same as today.
- `src/archive/tr/columns/p24.body.ts` — new file exporting `Record<string, string[]>` keyed by the item's `slug`, holding just the paragraph arrays. Never imported eagerly — only through dynamic `import()`.

Outlets with no content yet (Cumhuriyet, Milliyet, Sabah, Zaman, the analyses outlets, interviews, academic) are left as-is (empty seed arrays); they get a `.body.ts` sibling and `hasBody`/split treatment only once real content is added to them, using the same migration script.

`ArchiveItemSeed`/`ArchiveItem` types (`src/archive/types.ts`) gain:
- `hasBody?: boolean` — explicit flag, set by the split (or by hand for future small hand-authored items), replacing today's `item.body && item.body.length > 0` boolean checks.
- `outletKey: string` on `ArchiveItem` (assigned in `index.ts`'s `outlet()` helper, e.g. `'p24'`, `'cumhuriyet'`) — a stable machine key distinct from the display name (`outlet`, e.g. `"Aydınlık (Sosyalist Dergi/Proleter Devrimci)"` isn't usable as a lookup key). Flat sections (interviews, academic) get a fixed key equal to their category.

`body?: string[]` remains on the type — it's simply `undefined` on items coming out of `archiveData` until something lazily loads and merges it in.

### 2. Body-loading registry (`src/archive/bodyRegistry.ts`, new file)

A manifest of loaders, keyed by `` `${category}:${outletKey}` ``:

```ts
type BodyMap = Record<string, string[]>
type BodyLoader = () => Promise<BodyMap>

const bodyLoaders: Record<string, BodyLoader> = {
  'columns:p24': () => import('./tr/columns/p24.body').then((m) => m.p24Bodies),
  // more entries added as outlets get real content
}
```

Two entry points, both memoizing in-flight/resolved promises so repeat calls (re-navigating to the same outlet, or search re-triggering) don't re-fetch:

- `loadArticleBody(item: ArchiveItem): Promise<string[] | undefined>` — resolves one outlet's loader, returns `bodies[item.slug]`, also stashes the result into a shared cache keyed by `item.id`.
- `loadOutletBodies(keys: { category: ArchiveCategory; outletKey: string }[]): Promise<void>` — resolves multiple loaders in parallel, populates the same shared cache for every item across those outlets.
- `getCachedBody(itemId: string): string[] | undefined` — synchronous cache read.

### 3. `ArticlePage` lazy-loads its one article's body

On mount (and when the route's `item` changes), if `item.body` isn't already present and `item.hasBody` is true, call `loadArticleBody(item)` and hold the result in local state. Render the existing loading/skeleton state meanwhile (same pattern already used elsewhere for async UI); once resolved, render paragraphs exactly as today by merging into a local `{ ...item, body }` view object — the shared `archiveData` item objects are never mutated.

### 4. Boolean-only body checks switch to `hasBody`

Three spots in `App.tsx` currently test `item.body && item.body.length > 0` purely to decide *whether* an item has a reader page, without touching body content: `recentArticles` (home page "Recently Added" filter), `archiveLink` (decide internal vs. external link), and `itemHasSourceKind` in `archive/index.ts` (the "digital" source-kind filter on list pages). All three switch to `item.hasBody`, so none of them ever trigger a body load.

`ArchiveRow`'s preview text (`item.excerpt ?? item.subtitle ?? item.body?.[0]`) drops the `body?.[0]` fallback — no longer needed since the split guarantees every item has an `excerpt` or `subtitle`.

### 5. Search lazy-loads on first keystroke

`OutletArchivePage` and `FlatArchivePage` already compute their visible item set client-side via `matchesFilters`/`archiveItemText`. Both pages know their outlet keys up front (`data.outlets` for outlet-grouped sections, or the flat section's fixed category key).

Add a debounced effect (~400ms after the search input stops changing): when the search string is non-empty, call `loadOutletBodies` for the page's outlet keys. `archiveItemText` (in `archive/index.ts`) changes to fall back to the shared cache: `const body = item.body ?? getCachedBody(item.id)`. Once the load resolves, a state bump forces `matchesFilters`'s `useMemo` to recompute, and body-text matches appear. While the fetch is in flight, show a small "İçerik aranıyor…" / "Searching full text…" hint near the search field. Before the first search (or while it's still loading), results are metadata-only (title/subtitle/excerpt/OCR) — same fields already searched today via `archiveItemText`, just without body until it resolves.

### 6. Migration script

A one-time Node script, `scripts/split-archive-body.mjs`, that:
1. Dynamically imports a given outlet seed module (Node 26 runs `.ts` directly — no extra build tooling needed).
2. For each item with `body`, writes it into the new `<outlet>.body.ts` map keyed by the same slug logic `normalizeArchiveItems` uses (`seed.slug ?? slugFromSourceUrl(seed.url) ?? slugify(seed.title)`).
3. Rewrites the original `<outlet>.ts` with `body` stripped, `hasBody: true` added, and `excerpt` backfilled where missing.

Run once now against `p24.ts`. Reused later for Zaman/Today's Zaman (or any future outlet) instead of hand-splitting.

## Data flow summary

- **Home page / hub counters / Recently Added**: reads `archiveData` (metadata only, eager) → zero body bytes ever loaded.
- **List/archive page, no search**: same, metadata only.
- **List/archive page, user searches**: metadata instant, body-text matches for that page's outlets arrive ~1 fetch later, cached for the session.
- **Article reader page**: metadata renders instantly (title, date, tools), body arrives via one outlet-scoped fetch, cached for the session.

## Verification plan

1. `npm run build` before and after — compare `dist/assets/index-*.js` raw/gzip size (baseline: 834KB / 284KB gzip) and confirm the new `p24.body` chunk appears separately and isn't pulled into the main chunk or the initial HTML's module preload.
2. Dev server: visit home page, confirm "Recently Added" and hub counts render with no network fetch of `p24.body`.
3. Visit `/columns` (or the Turkish equivalent), confirm P24 rows render with excerpts and no body fetch until searching.
4. Type a search term that only appears inside a P24 article body (not in its title/excerpt) — confirm the article appears after a brief delay, and the "searching full text" hint appears/disappears correctly.
5. Open a P24 article directly (deep link) — confirm body renders after a brief load state, reading-progress bar and font-size controls still work.
6. Confirm outlets with no content (Cumhuriyet, Zaman, etc.) are unaffected — no crashes on empty seed arrays, no dead loader entries.

## Results

Mid-implementation, `main` independently gained English-language support (`archiveData.columns` split into `{tr, en}`), a `manualChunks` Vite config, and ~700 lines of other `App.tsx` changes. This branch was rebased onto that `main` (one conflict in `src/archive/index.ts`, resolved by combining the `tr`/`en` structure with this project's `outletKey` threading). That also meant the pre-existing `manualChunks` attempt could be measured directly: it does **not** solve the problem on its own — see below.

**Home-page-equivalent initial JS payload** (`index` + `archive-data` chunks — the two chunks that load on every page, including home):

| | raw | gzip |
|---|---|---|
| `main` tip, **with** its own `manualChunks` config but **without** this project's lazy-loading (baseline) | 488.03 kB (57.32 + 430.71) | 173.05 kB (15.64 + 157.41) |
| This branch, with lazy-loading complete | 82.92 kB (58.31 + 24.61) | 24.33 kB (15.96 + 8.37) |
| **Reduction** | **~405 kB (−83%)** | **~149 kB (−86%)** |

`main`'s `manualChunks` config does correctly produce a separate `archive-data` chunk by name, but since `src/archive/index.ts` still statically imports every outlet's seed data (including full body text) and `App.tsx` imports `archiveData` at module scope for the home page/hub counts, that chunk is still referenced directly from `index.html` and loads on every single page — chunk naming alone doesn't defer anything. Confirmed via `grep -o 'assets/[^"]*\.js' dist/index.html`: `main`'s baseline lists `archive-data-*.js` directly; this branch's `index.html` does not list `archive-tr-p24-*.js` at all — it's a true on-demand `import()` chunk (410.39 kB raw / 153.16 kB gzip), fetched only when a P24 article is opened or a list-page search actually runs.

**Manual verification** (dev server, network tab):
- Home page and `/tr/kose-yazilari` (columns list) load with no `p24.body.ts` request.
- Typing "Stina" (a body-only term, not in any title/excerpt) into the columns search triggers the "İçerik aranıyor…" hint, fetches `p24.body.ts`, and narrows results to the 3 matching articles (confirmed via network log and accessibility snapshot).
- Typing a title-only term resolves instantly, no `p24.body.ts` fetch.
- Opening a P24 article directly renders full body text correctly; reading-progress bar and font-size controls work.
- Outlets with empty seed arrays (Cumhuriyet, Sabah, Milliyet, Zaman) render without error.
