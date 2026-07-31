# Kronik / Chronicle — Design

**Date:** 2026-07-31
**Status:** Approved (design), pending implementation plan
**Roadmap:** Sub-project 3 of 4 (editorial reader ✅ → clipping lightbox ✅ → **Chronicle** → researcher tools)

## Problem

The archive is organized by outlet ("where it ran"), but Şahin Alpay's story is
one of **time and testimony** — a political columnist writing through Turkey's
ruptures, whose pen fell silent during his 2016–2018 imprisonment. A Chronicle
page reframes the corpus along a time axis: his published output visualized
against the national events he wrote through. The article-volume data itself is
biography — the swell of 2008–2012, the collapse to near-silence in 2016, the
quiet return — and none of it is fabricated.

## Ground truth (verified in the codebase)

- Dated items: 1080 across the archive. Year distribution (from `date` fields):
  sparse 1968–1970 (5), gap, then 2003–2015 dense (peak 2008 176, 2009 169,
  2010 169, 2011 169, 2012 134), **2016 collapses to 9, 2017 to 5**, then a
  thin return (2018–2024).
- `src/dateUtils.ts#parseTurkishDate(dateStr): number | null` returns a UTC
  timestamp; year = `new Date(ts).getUTCFullYear()`. It is the ONLY date parser —
  reuse it.
- Archive loads lazily via `App.tsx#useArchiveData()` (returns `null` until
  resolved); columns are per-language (`archiveData.columns[lang]`), analyses are
  TR-only (`archiveData.analyses`). Consumers must handle the `null`/loading
  state.
- Nav renders from `content[lang].nav` (`t.nav.map`, desktop + mobile). Hub cards
  render from `content[lang].hub` (`t.hub.map`). `HUB_ICONS` is a full
  `Record<PageKey, string>` — a new PageKey REQUIRES an entry there or the build
  fails.
- Routing: `src/routes.ts` `PageKey` union + per-language `paths`. Nav-active
  state comes from `pageKeyForPath`. `PageForKey`'s `default` case renders
  `ArchiveRoutePage`, so a dedicated page must be routed directly (like
  `CookiePolicyPage`), not through `RouteFor`.
- Deterministic pick pattern already exists: `mulberry32` + `isoWeekKey`
  (`WeeklyPicks`) — reuse the seeded-shuffle approach for representative picks.
- Brass accent tokens (`--tertiary`, `--tertiary-ink`) and the design system are
  in place; the reader pass established brass as the archival-highlight color.

## Decision (from brainstorming)

Chronicle includes three layers (life-eras track explicitly excluded to avoid
fabricating undated milestones):
1. **Article-volume arc** — real per-year counts.
2. **Selected articles per period** — deterministic representative real pieces.
3. **National-events track** — an owner-approved curated set.

Nav placement: **in the nav** (both languages), plus a hub card.

Approved national events (owner-confirmed), bilingual, `kind: 'national'`
except the two personal markers (`kind: 'personal'`):

| Year | tr | en | kind |
|---|---|---|---|
| 1971 | 12 Mart Muhtırası | March 12 memorandum | national |
| 1980 | 12 Eylül askerî darbesi | September 12 coup | national |
| 1997 | 28 Şubat süreci ("postmodern darbe") | February 28 "postmodern coup" | national |
| 2002 | AK Parti ilk seçim zaferi | AK Party's first election win | national |
| 2005 | Türkiye–AB üyelik müzakereleri başladı | Turkey–EU accession talks begin | national |
| 2007 | Cumhurbaşkanlığı krizi ve e-muhtıra | Presidential crisis & e-memorandum | national |
| 2013 | Gezi Parkı protestoları | Gezi Park protests | national |
| 2016 | 15 Temmuz darbe girişimi | July 15 coup attempt | national |
| 2016 | Şahin Alpay tutuklandı | Şahin Alpay detained | personal |
| 2018 | AYM ve AİHM hak ihlali kararı; tahliye | Constitutional Court & ECtHR rulings; release | personal |

## Scope

### In scope

1. **New Chronicle page** — `PageKey: 'chronicle'`, `/chronicle` (en) +
   `/tr/kronik` (tr), routed directly to a `ChroniclePage` component; added to
   `PageKey`, both `paths` maps, `HUB_ICONS`, `content[lang].nav`,
   `content[lang].hub`, the route list, and the sitemap.
2. **Vertical timeline spine**, one row per year that has articles or an event,
   spanning the corpus range (≈1968–2024):
   - **Volume bar** — length proportional to that year's real article count
     (that language's `columns` + TR `analyses`), forming the arc. The 2016
     collapse is visible by construction.
   - **Event markers** — national + personal events for that year, brass-marked,
     with the bilingual label.
   - **Representative articles** — 1–2 real pieces from that year (deterministic
     pick, `hasBody` preferred), linking directly to their reader pages; plus a
     count ("that year: N pieces"). Years with events but no articles (1971,
     1980, 1997) show the event marker alone.
3. **Factual hero** — computed real figures only: total dated pieces (live from
   the archive), the covered span, and the 2016 rupture. No invented numbers.
4. **Events data** — new bilingual `src/chronicle.ts` exporting the approved
   list as `{ year: number; tr: string; en: string; kind: 'national' | 'personal' }[]`.
5. **Computation** — volume-by-year computed client-side from `useArchiveData()`
   via `parseTurkishDate`; loading/`null` state handled (no fabricated zero).

### Out of scope (YAGNI)

- No new "articles filtered by year" archive view (archive is by outlet;
  representative picks link straight to readers).
- No life-eras track (owner's choice).
- No month-level granularity (year level suffices).
- No new date parsing (reuse `parseTurkishDate`).
- Events list stays exactly the approved set — no additions without owner sign-off
  (content-integrity).

## Architecture / approach

- `ChroniclePage({ lang })` in `src/App.tsx` (single-file convention). Uses
  `useArchiveData()`; while `null`, render `ArchiveLoading`.
- Volume map: reduce the language's items to `Record<year, count>` using
  `parseTurkishDate(item.date)`; ignore items whose date won't parse.
- Merge years from the volume map and the events list into a sorted year axis;
  render each as a spine row. Bar width = `count / maxCount` (percentage).
- Representative picks: a deterministic seeded shuffle (reuse `mulberry32`, seed
  by year) over that year's `hasBody` items; take 1–2.
- Events from `src/chronicle.ts`, filtered by year, labelled `event[lang]`,
  styled by `kind` (personal markers visually distinct but same track).
- New CSS in `src/index.css` (`.chronicle*`), reusing tokens (brass accent,
  `--line`, spacing) and `Reveal` for scroll-in. Style both themes.
- Accessibility: the volume bars are decorative visualizations — provide a
  text equivalent per row (the count as readable text, not color/length alone);
  events and articles are real text/links. `useReducedMotion` respected.

## Verification (project "Done definition")

- `npm run build` (`tsc -b` + vite), `npm run lint`, `npm run validate:content`
  all pass; `npm run generate:sitemap` re-run (routes added) and committed.
- Browser-verified in **both** languages (`/chronicle`, `/tr/kronik`), **both**
  themes, mobile:
  - The volume arc renders from real data; 2008–2012 swell and the 2016 collapse
    are visible; counts match the archive.
  - Events (incl. the two personal markers) appear on their years with correct
    bilingual labels.
  - Representative articles link to working reader pages; counts are real.
  - Nav shows Chronicle and highlights it when active; hub card links to it.
  - Loading state shows while the archive resolves (no fabricated zeros).
- Committed; pushed only on owner confirmation (`main` auto-deploys).

## Open items

- Visual treatment of the arc (horizontal bars vs an area sparkline in the hero
  plus per-row bars) — decide in implementation; default: per-row horizontal
  bars forming the spine, with a small summary sparkline in the hero.
- Exact hero copy (bilingual) — draft in implementation from real figures;
  owner can adjust wording later (no fabricated numbers).
