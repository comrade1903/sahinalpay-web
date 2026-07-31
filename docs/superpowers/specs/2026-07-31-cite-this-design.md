# Alıntıla / Cite this — Design

**Date:** 2026-07-31
**Status:** Approved (design), pending implementation plan
**Roadmap:** Sub-project 4 of 4 (researcher tools) — only "Cite this" is being built; global Cmd-K search and a theme lens were deferred (search already exists on list pages; a theme lens would require tagging 1080 items, a content-integrity/labor risk).

## Problem

For an academic/journalistic legacy archive, researchers and journalists will
want to cite pieces. There is no one-click way to get a formatted citation
today. Copy-attribution (added in the editorial-reader pass) appends a source
line when text is copied, but there's no deliberate "give me the citation for
this piece" action.

## Ground truth (verified)

- Reader: `App.tsx#LoadedArticlePage`. It already exposes `item.title`,
  `item.outlet`, `item.date` (free-text), and `articleUrl` (built from
  `pageUrl(archiveBasePath(lang,item))/slug`; currently on the not-yet-live
  `sahinalpay.net` domain — the copy-attribution feature already emits this same
  URL, and both update together at the domain switch).
- The top **article-tools row** holds the A-/A+ font-size controls
  (`.article-tools` / `.article-tools-group`, using `.icon-btn`). Placement A =
  add the Cite control here.
- Bilingual reader strings live in `content[lang].reader` (currently
  `copySourceLabel`). Add the cite strings there.
- No citation/export code exists.

## Decision (from brainstorming)

- A **"Alıntıla / Cite"** control in the top article-tools row (placement A).
- On activation: build a single plain-text citation, copy it to the clipboard,
  AND reveal it in a small selectable box (fallback if clipboard write fails),
  with an `aria-live` "copied" confirmation.
- One clean format only (no BibTeX/RIS/APA variants, no download).

## Scope

### In scope

1. A `CiteThis` control rendered in the article-tools row (next to A-/A+).
2. Citation string built from real fields, bilingual:
   - TR: `Şahin Alpay, "<title>", <outlet>, <date>. <articleUrl> (Erişim: <today>).`
   - EN: `Şahin Alpay, "<title>", <outlet>, <date>. <articleUrl> (Accessed <today>).`
   - `<date>` is the item's existing free-text date; omit the `, <date>` segment
     gracefully if the item has no date. Omit outlet segment if absent.
   - `<today>` formatted per language (`toLocaleDateString('tr-TR' | 'en-GB')`).
3. Behavior: on click, `navigator.clipboard.writeText(citation)` in try/catch;
   reveal a `.cite-box` containing the citation text (selectable) and an
   `aria-live="polite"` status showing "Kopyalandı ✓ / Copied ✓" on success (or
   a "select and copy" prompt if the clipboard API is unavailable). A second
   activation (or navigating away) hides the box.
4. Bilingual strings in `content[lang].reader`: `citeLabel`, `copied`,
   `copyManual`, `accessed`.
5. Accessibility: the control is a `<button>` with an `aria-label` and
   `aria-expanded`; the status uses `aria-live`; `useReducedMotion` respected
   (box appears without animation when reduced).

### Out of scope (YAGNI)

- Multiple citation styles / BibTeX / RIS / download.
- Any change to archive content or the domain (URL reuses existing `articleUrl`).
- Citation on non-reader pages.

## Architecture / approach

- A small `CiteThis({ item, articleUrl, lang })` component in `src/App.tsx`,
  rendered inside the `.article-tools-group` (or beside it) in
  `LoadedArticlePage`. Local `useState` for the open/copied state.
- Build the citation in a pure helper from the item fields + `articleUrl` +
  `new Date()`.
- New CSS `.cite-*` in `src/index.css`, reusing tokens and `.icon-btn`.

## Verification

- `npm run build`, `npm run lint`, `npm run validate:content` pass (UI strings
  only; no content data change; sitemap unaffected).
- Browser-verified in both languages, both themes, mobile:
  - Cite control appears in the article-tools row; clicking copies the citation
    and reveals the selectable box with the correct bilingual format, real
    fields, and today's access date.
  - Works on an item with a date and on one without (graceful omission).
  - Keyboard accessible; `aria-live` announces the copy.
- Committed; pushed only on owner confirmation.

## Open items

- Access-date locale format — default `tr-TR` / `en-GB` (day-month-year); adjust
  in implementation if a different style is preferred.
