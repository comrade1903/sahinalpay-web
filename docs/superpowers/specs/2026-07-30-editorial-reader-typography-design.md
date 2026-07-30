# Editorial Reader & Typography — Design

**Date:** 2026-07-30
**Status:** Approved (design), pending implementation plan
**Roadmap:** Sub-project 1 of 4 (Editorial reader + typography → clipping mode → Chronicle → researcher tools)

## Problem

The single-article reader (`LoadedArticlePage` in `src/App.tsx`) is already
structurally strong — it has a reading-progress bar, A-/A+ font-size controls,
a drop cap, an italic standfirst, a byline, lead photos, a framed clipping
viewer with OCR `<details>`, and related articles. What it lacks is
**typographic craft**: the reading column is set in the UI sans-serif
(Nunito Sans), which reads like a blog rather than the newspaper-of-record
legacy this archive is. This sub-project is a **craft/polish pass**, not a
rebuild — it elevates the existing reader through CSS and small JSX, with **no
archive content edits**, so every article benefits immediately.

## Ground truth (verified in the codebase)

- Reader: `src/App.tsx#LoadedArticlePage`. Font-size controls already exist
  (`fontScale` state, `FONT_SCALE_MIN/MAX/STEP`), applied as inline
  `fontSize` on `.article-body`.
- Type tokens (`src/index.css`): `--display`/`--headline` = Literata (serif),
  `--body`/`--label` = Nunito Sans. Brass accent tokens
  (`--tertiary`, `--tertiary-ink`, `--tertiary-soft`) exist but are barely
  used. `--measure: 68ch` is defined. `.pullquote` styles already exist
  (used only by the About page today).
- Current reader CSS of note:
  - `.article-body p` → `font-family: var(--body)` (sans), `line-height: 1.8`.
  - `.article-body p:first-of-type::first-letter` → drop cap, `3.2em`,
    `color: var(--accent-ink)` (blue).
  - `.article-subtitle` → italic Literata standfirst.
  - `.article-byline` → monogram avatar + name + `date · outlet · (medium)`,
    top hairline rule.
  - `.prose` → shared long-form block used by About/Books/CookiePolicy.

## Decision (from brainstorming)

- **Article body set in Literata (serif); UI/labels/byline stay Nunito Sans.**
- Editorial craft pass, no content changes.
- **Pull-quotes are explicitly deferred** to a later pass (they would require an
  optional `pullQuote` seed field and per-article content editing).

## Scope

### In scope

1. **Serif reading column.** `.article-body p` → `var(--headline)` (Literata).
   Retune for serif: `line-height` ~1.72 (from 1.8), constrain the reading
   measure to `--measure` (68ch), enable OpenType features
   (`font-feature-settings: "kern", "liga", "onum"` — kerning, ligatures,
   old-style figures) via a reading-text rule.
2. **Drop cap refinement.** Resize relative to the serif body; recolor to brass
   (`--tertiary` / `--tertiary-ink`) for archival warmth; suppress it on very
   short first paragraphs (guard so a 1–2 word opener doesn't get a giant cap).
3. **Standfirst polish.** Keep italic Literata; refine size/spacing/color and
   add a thin lede rule beneath it.
4. **Byline as masthead.** Name in small-caps; date rendered with the brass
   accent; keep the monogram; keep the top hairline. Nunito Sans retained for
   the metadata line.
5. **Micro-typography.** Old-style figures for the byline/date numerals,
   small-caps kicker where a kicker appears in the reading flow, curly
   quotation marks, tuned paragraph rhythm, and a small end-mark (▪) after the
   last body paragraph.
6. **Reading-voice consistency.** Align `.prose` long-form (About/Books/Cookie
   policy) with the same serif reading treatment so the site reads in one voice.
7. **Copy-attribution ("watermark done right").** When a reader copies a
   meaningful chunk of an article body, append a short attribution/provenance
   line to the clipboard instead of blocking the copy. This turns copying into
   free attribution + source-of-record, aligns with the archive's mission
   (be read and cited) and with the just-shipped "no tracking" privacy stance
   (purely client-side, nothing sent anywhere).
   - Attach a `copy` event listener scoped to the article body
     (`#article-body`) in `LoadedArticlePage`.
   - Only append when the selection is meaningful — threshold ~40+ characters
     (a couple of words shouldn't get a full citation footer).
   - Appended line (bilingual, from `content.ts`), e.g.:
     - TR: `\n\n— Şahin Alpay, "<title>". Kaynak: <full-url>`
     - EN: `\n\n— Şahin Alpay, "<title>". Source: <full-url>`
   - Use `event.clipboardData.setData('text/plain', selection + attribution)`
     plus `event.preventDefault()`; guard for missing `clipboardData`.
   - Title and canonical URL are already available in `LoadedArticlePage`
     (`item.title`, `articleUrl`). No new data or backend.
   - Explicitly NOT doing: disabling selection/right-click, truncating visible
     content, or logging copy attempts (a static, no-backend, no-tracking site).

### Content-protection decisions (from brainstorming)

The owner chose **copy-attribution only**. Explicitly rejected, with reasons:
- **Disable selection / right-click** — trivially bypassed, harms
  accessibility, older readers, and SEO; against the archive's read-and-cite
  mission.
- **Copy logging** — needs a backend the static site doesn't have and directly
  contradicts the live "no tracking / no analytics" KVKK notice.
- **Clipping image watermark** and **footer copyright/usage line** — not now
  (may revisit later; not part of this pass).

### Out of scope (deferred / not this pass)

- **Pull-quotes** (inline large quotes) — needs a content field + per-article
  editing. Deferred to a later pass.
- Signature wordmark / brand mark changes (site-wide brand, not the reader).
- Replacing Material Symbols icons (site-wide iconography, a separate concern).
- Any change to article content, dates, or archive data.
- Changing the chosen typefaces (Literata + Nunito Sans stay).

## Architecture / approach

- **CSS-first.** The overwhelming majority of changes live in `src/index.css`
  in the existing article/`.prose` rule blocks. Reuse existing tokens
  (`--headline`, `--measure`, `--tertiary*`, `--line`, spacing scale). No new
  framework, no utility classes.
- **Minimal JSX.** Only touch `src/App.tsx` where structure is needed that CSS
  cannot express — e.g. an end-mark element after the body, or a class hook on
  the reading column. Keep the drop-cap guard in CSS if possible; if a very
  short opener needs suppressing and CSS `:first-letter` can't detect length,
  handle it with a data attribute / class computed from the first paragraph's
  length in `LoadedArticlePage`.
- **Theme + a11y.** Every change verified in light and dark themes and at a
  mobile width. `useReducedMotion` behavior is unchanged. Brass tones must
  keep AA contrast against paper/ink surfaces in both themes — verify the dark
  theme brass (`--tertiary` dark value) reads clearly.
- The existing font-size (A-/A+) control keeps working: body font-size is still
  driven by the inline `fontScale` multiplier, so `.article-body p` must set
  `font-size: 1em` (inheriting the scaled root) rather than a fixed rem.

## Verification (project "Done definition")

- `npm run build` passes (`tsc -b` + vite).
- `npm run lint` clean.
- `npm run validate:content` still passes (no content touched, but run it since
  we're in the archive area). Sitemap unaffected (no routes added).
- Browser-verified on a real article in **both** languages (`/columns/:slug`
  and `/tr/kose-yazilari/:slug`), **both** themes, and a mobile-width viewport:
  - Body reads in Literata serif; UI/byline stay sans.
  - Drop cap renders correctly (brass), and is suppressed on a short opener.
  - A-/A+ font-size control still scales the serif body.
  - Standfirst, masthead byline, end-mark, and micro-typography look correct.
  - `.prose` pages (About/Books/Cookie policy) share the reading voice.
  - Copy a full paragraph from an article body and paste it: the attribution
    line (author, title, URL) is appended, in the correct language. Copying a
    single word does NOT append it (below threshold). Selecting text is still
    freely allowed everywhere.
- Committed with a descriptive message; pushed only on owner confirmation
  (`main` auto-deploys).

## Open items

- Exact brass shade for the drop cap in dark theme — pick the value that holds
  AA contrast; confirm visually during implementation.
- End-mark glyph (▪ vs ❧ vs a hairline) — pick during implementation; default ▪.
