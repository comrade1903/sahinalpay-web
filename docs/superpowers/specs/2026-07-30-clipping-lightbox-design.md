# "Aslına Bak" — Clipping Lightbox Design

**Date:** 2026-07-30
**Status:** Approved (design), pending implementation plan
**Roadmap:** Sub-project 2 of 4 (editorial reader ✅ → **clipping mode** → Chronicle → researcher tools)

## Problem

Scanned newspaper clippings are the archive's most precious, fragile assets, but
today they render as inline images at reading-column width in the
`.clipping-viewer` section at the bottom of an article. Old newsprint is
**unreadable at that size** — the digitization effort is effectively
inaccessible. There is no way to zoom, pan, or page through a multi-page scan.

## Ground truth (verified in the codebase)

- Reader: `src/App.tsx#LoadedArticlePage`. Scans render in a
  `<Reveal as="aside" className="clipping-viewer">` block: an optional
  `item.imageSrc` figure, then `scans.map(...)` of `item.clippings` where
  `kind !== 'photo'`, each a `<figure className="clipping-frame">` with an
  `<img>`, a `<figcaption>` (page label + `sourceNote`), and an optional
  `<details className="clipping-ocr">` holding `clipping.ocrText`.
- **The scanned items are scan-only** — none have typeset `body` text.
  Aydınlık (4 items) and İşçi-Köylü (1 item) are the only items with scan
  clippings today; their "text" is the rough OCR only. So there is **no
  "typeset ↔ scan" toggle scenario** — the feature is a zoomable original-page
  viewer, not a text/scan switch.
- Multi-page scans exist (Aydınlık pieces have several `page-N.jpg`), so paging
  matters.
- `ArchiveClipping` (`src/archive/types.ts`): `{ src, thumbSrc?, alt?,
  ocrText?, pageLabel?, sourceNote?, kind? }`. `thumbSrc` is defined but unused
  in data — scans are single full-res images.
- Reusable modal pattern already exists in `src/App.tsx` (~lines 360–400):
  background elements get `inert`, `Escape` closes, focus is restored. The
  `--menu-scrim` token and `z-index: 999` (mobile nav) are the established
  top-layer conventions.

## Decision (from brainstorming)

- Build **"Aslına Bak" = a full-screen, zoomable, keyboard-accessible
  original-page lightbox**, opened from the clipping images.
- **No zoom library** — reuse the site's lean approach: zoom via buttons that
  scale the image + native scroll to pan (mirrors the A-/A+ control).
- Include an **"open original in new tab"** link (scans are public; useful for
  researchers).

## Scope

### In scope

1. **`ClippingLightbox` component** (`src/App.tsx`), controlled by reader state:
   `{ open: boolean; index: number }` over the item's scan array, plus a
   `zoom` level.
2. **Entry points:** each `.clipping-frame` scan image becomes a `<button>`
   (hover shows a zoom cursor + a visible "Aslına bak / See the original"
   label) that opens the lightbox at that scan's index. `item.imageSrc`
   (legacy single scan) is included in the same openable set.
3. **Lightbox UI:**
   - Full-screen `position: fixed` overlay using `--menu-scrim`, `z-index: 999`.
   - Image in an `overflow: auto` container; **zoom buttons** (fit / zoom-in /
     zoom-out) scale the image width via CSS; the user scrolls to pan.
     Keyboard `+` / `-` zoom, `0`/fit resets.
   - **Multi-page navigation:** prev/next buttons + Left/Right arrow keys, with
     a "2 / 5" page indicator (only when the item has more than one scan).
   - **OCR panel:** the current scan's `ocrText` is available in the lightbox
     (a toggle/panel), as the reading alternative.
   - **Page label + `sourceNote`** shown.
   - **"Open original in new tab"** link → the current scan `src`
     (`target="_blank" rel="noopener noreferrer"`).
   - Close button (×) + `Escape`.
4. **Accessibility:** `role="dialog"`, `aria-modal="true"`, an `aria-label`
   (bilingual). Reuse the existing inert-background + Escape + focus-restore
   pattern; trap Tab within the dialog. All controls have bilingual
   `aria-label`s. `useReducedMotion` respected (no open/zoom animation when
   reduced).
5. **Bilingual strings** in `src/content.ts` (a `clippingViewer` block):
   view-original label, close, zoom in/out/fit, previous/next page, page
   `x / y` format, show/hide OCR, open-in-new-tab.

### Out of scope (YAGNI)

- Custom pinch-gesture zoom (native scroll + zoom buttons cover touch).
- Rotation, download button (the new-tab link is the escape hatch).
- A typeset ↔ scan toggle (no scanned item has body text; revisit if one does).
- `thumbSrc`/progressive loading (scans are single images; keep `loading="lazy"`
  on the inline thumbnails; the lightbox loads the full `src`).

## Architecture / approach

- Single `ClippingLightbox` component in `src/App.tsx`, rendered once inside
  `LoadedArticlePage` and driven by local state. The clipping-viewer images
  become buttons that set `{ open: true, index }`.
- Zoom is a numeric state (e.g. `zoom` ∈ {fit, 1, 1.5, 2, 3}); the image gets
  `style={{ width: ... }}` or a CSS class; the container scrolls. No transforms
  needed for panning — native scrollbars handle it, which is the most reliable
  cross-device behavior.
- Reuse the modal a11y approach already in the file (inert siblings, Escape,
  focus restore). If the existing logic is a standalone effect rather than a
  reusable hook, factor the shared bits into a small helper only if it's clean;
  otherwise mirror the pattern locally (don't over-refactor unrelated code).
- New CSS in `src/index.css` (`.clipping-lightbox*`), reusing tokens
  (`--menu-scrim`, `--surface`, `--line`, `--ink`, spacing, radius). Style both
  themes (the overlay chrome must read on light and dark).

## Verification (project "Done definition")

- `npm run build` passes (`tsc -b` + vite); `npm run lint` clean;
  `npm run validate:content` passes (no content data changed structurally; new
  UI strings only).
- Browser-verified on a real scan item in **both** languages
  (`/tr/analizler/...` for the Aydınlık/İşçi-Köylü pieces; English hub
  redirects, so verify the TR reader) and **both** themes, plus mobile:
  - Clicking a scan opens the lightbox; zoom in makes the newsprint readable;
    scroll pans; fit resets.
  - Multi-page item: prev/next + arrow keys page through; indicator updates.
  - OCR panel shows the current page's text; "open in new tab" opens the raw
    scan.
  - Keyboard-only: Tab stays trapped in the dialog, Escape closes and restores
    focus to the trigger. Background is inert while open.
  - Reduced-motion: no animations.
- Committed; pushed only on owner confirmation (`main` auto-deploys).

## Open items

- Exact zoom steps (fit → 1× → 1.5× → 2.5× vs continuous) — pick sensible
  discrete steps during implementation; default {fit, 1, 1.5, 2.5}.
- Whether the OCR panel is a side drawer or a bottom sheet on mobile — pick the
  simplest that reads well; default a collapsible panel below the image.
