# Editorial Reader & Typography — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the existing single-article reader with real typographic craft — a serif reading column, refined drop cap, masthead byline, micro-typography, one shared reading voice — plus copy-attribution that appends a source line to the clipboard instead of blocking copying.

**Architecture:** CSS-first polish of the existing `LoadedArticlePage` and `.prose` blocks in `src/index.css`, with minimal JSX in `src/App.tsx` only where structure is required (drop-cap guard class, brass date span, copy listener). No content edits, no new routes, no new dependencies.

**Tech Stack:** React 19, TypeScript (strict), Vite 8, hand-written CSS design system.

**Design spec:** `docs/superpowers/specs/2026-07-30-editorial-reader-typography-design.md`

## Global Constraints

Every task implicitly includes all of these:

- **No test framework in this repo — do NOT add one.** Per-task verification = `npm run build` (`tsc -b` + vite) and `npm run lint` (oxlint), plus browser checks where noted. Content is untouched, but run `npm run validate:content` once at the end since we're in the archive-reading area.
- **Styling: hand-written design system in `src/index.css` only.** No CSS framework, no utility classes. Reuse existing tokens: `--headline` (Literata), `--body` (Nunito Sans), `--measure` (68ch), `--tertiary`/`--tertiary-ink` (brass — auto-correct in dark theme), `--line`, spacing scale.
- **Typefaces do not change:** Literata (serif) + Nunito Sans (sans) only.
- **Bilingual:** any user-facing string is added in BOTH `tr` and `en` (`src/content.ts`).
- **The A-/A+ font-size control must keep working:** `.article-body p` must stay `font-size: 1em` so the inline `fontScale` multiplier on `.article-body` still scales it.
- **Verify both themes + mobile width; do not regress accessibility.** `useReducedMotion` behavior unchanged.
- **No backend, no tracking:** copy-attribution is purely client-side; nothing is sent anywhere, nothing is logged.
- **Commits:** imperative English subject; end with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`. Commit locally per task. **Do not push** — pushing `main` is a production release the owner confirms at the end.

## File Structure

- `src/index.css` — article/`.prose` typography rules (Tasks 1 & 2).
- `src/App.tsx` — `LoadedArticlePage`: drop-cap guard class + brass date span (Task 2), copy listener (Task 3).
- `src/content.ts` — `reader.copySourceLabel` string, both languages (Task 3).

---

## Task 1: Serif reading column + shared reading voice

Sets the article body and `.prose` long-form in Literata with serif-tuned rhythm and OpenType features. This is the single biggest visual change.

**Files:**
- Modify: `src/index.css` — `.article-body p` (~line 2021), `.prose p` (~line 356)

**Interfaces:**
- Produces: article body and `.prose` blocks render in Literata serif. No JS interface.

- [ ] **Step 1: Make the article body serif.** In `src/index.css`, replace the `.article-body p` rule:

```css
.article-body p {
  font-family: var(--headline);
  font-size: 1em;
  line-height: 1.72;
  color: var(--ink);
  font-feature-settings: 'kern' 1, 'liga' 1, 'onum' 1;
}
```

(`font-size: 1em` is required so the A-/A+ `fontScale` multiplier on `.article-body` keeps scaling the text. `onum` = old-style figures for numerals in running text.)

- [ ] **Step 2: Give `.prose` the same reading voice.** In `src/index.css`, update `.prose p` (it currently sets only `max-width`, so it inherits the sans body font):

```css
.prose p {
  max-width: var(--measure);
  margin-bottom: var(--space-3);
  font-family: var(--headline);
  line-height: 1.72;
  font-feature-settings: 'kern' 1, 'liga' 1, 'onum' 1;
}
```

- [ ] **Step 3: Build + lint.** Run: `npm run build && npm run lint`
  Expected: both PASS/clean.

- [ ] **Step 4: Browser-verify** (`npm run dev`, server may already be running on :5173):
  - Open a real column with body text: `/columns/:slug` (EN) and `/tr/kose-yazilari/:slug` (TR). Body now reads in Literata serif; the byline/UI stay Nunito Sans.
  - Click A- and A+: the serif body still scales.
  - Open `/about`, `/books`, and `/cookie-policy`: their `.prose` text is now serif too (one voice).
  - Check light + dark theme and a mobile-width viewport.

- [ ] **Step 5: Commit.**

```bash
git add src/index.css
git commit -m "Set the article and prose reading columns in Literata serif

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Editorial chrome — brass drop cap (guarded), standfirst, masthead byline, end-mark

Refines the reader's editorial furniture: a brass drop cap that turns off on very short openers, a standfirst rule, a small-caps masthead byline with a brass date, and an end-mark after the last paragraph.

**Files:**
- Modify: `src/index.css` — drop-cap rule (~line 2027), `.article-subtitle` (~line 1959), byline rules (~line 1991), and new `.article-body`/byline-date/no-dropcap rules
- Modify: `src/App.tsx` — `LoadedArticlePage`: compute a short-opener flag → class on `.article-body`; wrap the date in a brass span

**Interfaces:**
- Consumes (from Task 1): serif `.article-body p`.
- Produces: `.article-body` may carry a `no-dropcap` class; the byline date is wrapped in `.article-byline-date`.

- [ ] **Step 1: Recolor the drop cap to brass + add a no-dropcap escape.** In `src/index.css`, update the drop-cap rule and add a suppression rule right after it:

```css
.article-body p:first-of-type::first-letter {
  font-family: var(--headline);
  font-size: 3.4em;
  font-weight: 700;
  float: left;
  line-height: 0.82;
  margin: 0.05em 0.1em 0 0;
  color: var(--tertiary-ink);
}
.article-body.no-dropcap p:first-of-type::first-letter {
  font: inherit;
  float: none;
  margin: 0;
  color: inherit;
}
```

- [ ] **Step 2: Add the end-mark after the last body paragraph.** In `src/index.css`, add (the `:not(.article-body-loading)` guard keeps it off the loading placeholder):

```css
.article-body p:last-of-type:not(.article-body-loading)::after {
  content: ' ▪';
  color: var(--tertiary-ink);
}
```

- [ ] **Step 3: Polish the standfirst.** In `src/index.css`, update `.article-subtitle` to add breathing room and a short lede rule:

```css
.article-subtitle {
  font-family: var(--headline);
  font-size: clamp(1.1rem, 1.8vw, 1.3rem);
  font-style: italic;
  color: var(--ink-soft);
  margin: var(--space-2) 0 0;
  padding-bottom: var(--space-2);
}
.article-subtitle::after {
  content: '';
  display: block;
  width: 3rem;
  margin-top: var(--space-2);
  border-top: 2px solid var(--tertiary);
}
```

- [ ] **Step 4: Masthead byline.** In `src/index.css`, update the name to small-caps and add a brass date rule:

```css
.article-byline-name {
  display: block;
  font-family: var(--headline);
  font-weight: 700;
  color: var(--ink);
  font-size: 0.95rem;
  font-variant-caps: small-caps;
  letter-spacing: 0.03em;
}
.article-byline-date {
  color: var(--tertiary-ink);
  font-feature-settings: 'onum' 1;
}
```

- [ ] **Step 5: Wrap the date in a brass span (JSX).** In `src/App.tsx` `LoadedArticlePage`, replace the byline metadata line. Find:

```tsx
            <span className="article-byline-text">
              <span className="article-byline-name">Şahin Alpay</span>
              {[item.date, item.outlet].filter(Boolean).join(' · ')}
              {item.medium
                ? ` (${mediumLabel(item.medium, lang).toLocaleLowerCase(lang)})`
                : ''}
            </span>
```

Replace with:

```tsx
            <span className="article-byline-text">
              <span className="article-byline-name">Şahin Alpay</span>
              {item.date && (
                <>
                  <time className="article-byline-date">{item.date}</time>
                  {item.outlet ? ' · ' : ''}
                </>
              )}
              {item.outlet}
              {item.medium
                ? ` (${mediumLabel(item.medium, lang).toLocaleLowerCase(lang)})`
                : ''}
            </span>
```

- [ ] **Step 6: Add the short-opener guard (JSX).** In `src/App.tsx` `LoadedArticlePage`, find the article-body opening tag:

```tsx
        <Reveal
          as="div"
          delay={0.08}
          className="article-body"
          id="article-body"
          style={{ fontSize: `${(1.05 * fontScale).toFixed(3)}rem` }}
        >
```

Replace `className="article-body"` with a computed class. First, just above the `return (` of the rendered article (after `const scans = ...`), add:

```tsx
  const shortOpener = !body || !body[0] || body[0].length < 60
```

Then set the class:

```tsx
        <Reveal
          as="div"
          delay={0.08}
          className={`article-body${shortOpener ? ' no-dropcap' : ''}`}
          id="article-body"
          style={{ fontSize: `${(1.05 * fontScale).toFixed(3)}rem` }}
        >
```

(`body` is the already-loaded body array in scope. While the body is still lazy-loading, `shortOpener` is true so no giant cap flashes on the loading placeholder; it recomputes once the body resolves.)

- [ ] **Step 7: Build + lint.** Run: `npm run build && npm run lint`
  Expected: both PASS/clean.

- [ ] **Step 8: Browser-verify** (both languages, both themes, mobile):
  - Drop cap renders in brass on a normal column and is **absent** on an article whose first paragraph is very short (find one, or temporarily check a short piece).
  - The end-mark ▪ appears after the last paragraph (brass), not on the loading state.
  - Standfirst shows the short brass rule beneath it (on an item that has a `subtitle`).
  - Byline name is small-caps; the date is brass; layout intact.
  - Dark theme: brass reads clearly (light-brass `--tertiary-ink`), AA-legible.

- [ ] **Step 9: Commit.**

```bash
git add src/App.tsx src/index.css
git commit -m "Add brass drop cap, standfirst rule, masthead byline, and end-mark

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Copy-attribution

When a reader copies a meaningful chunk of the article body, append an author/title/source line to the clipboard instead of blocking the copy.

**Files:**
- Modify: `src/content.ts` — add `reader.copySourceLabel` to the `Content` interface and both languages
- Modify: `src/App.tsx` — `LoadedArticlePage`: a `copy` event listener on `#article-body`

**Interfaces:**
- Consumes: `item.title`, `articleUrl`, `lang`, `content[lang].reader.copySourceLabel`.
- Produces: clipboard text = selection + `\n\n— Şahin Alpay, "<title>". <label>: <url>` when the selection is ≥ 40 chars.

- [ ] **Step 1: Add the `reader` copy label to the `Content` interface.** In `src/content.ts`, add after the `cookiePolicy` member:

```ts
  reader: {
    copySourceLabel: string
  }
```

- [ ] **Step 2: Fill both languages.** In `src/content.ts`, add a `reader` block as a sibling of `cookiePolicy` in the `en` object:

```ts
    reader: {
      copySourceLabel: 'Source',
    },
```

and in the `tr` object:

```ts
    reader: {
      copySourceLabel: 'Kaynak',
    },
```

- [ ] **Step 3: Add the copy listener (JSX/hook).** In `src/App.tsx` `LoadedArticlePage`, add this effect alongside the other hooks — it MUST be above the `if (!item ...) return <Navigate .../>` early return (React hooks rule). Place it right after the `useJsonLd('breadcrumb', ...)` call:

```tsx
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
```

(`#article-body` is the reading column's id, already set on the `.article-body` element. The listener only fires for selections inside it; `item`/`articleUrl` are computed earlier in the component. Nothing is sent anywhere — pure clipboard rewrite.)

- [ ] **Step 4: Build + lint.** Run: `npm run build && npm run lint`
  Expected: both PASS/clean.

- [ ] **Step 5: Browser-verify** (both languages):
  - On an article, select and copy a full paragraph, paste into a text editor: the pasted text ends with `— Şahin Alpay, "<title>". Source: <url>` (EN) / `Kaynak: <url>` (TR).
  - Select and copy a single word: pasting shows just the word (no attribution — below the 40-char threshold).
  - Selecting/copying elsewhere on the page (nav, byline) is unaffected; selection is never blocked.

- [ ] **Step 6: Commit.**

```bash
git add src/App.tsx src/content.ts
git commit -m "Append a source-attribution line when article text is copied

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Final verification + release

- [ ] **Step 1: Full suite.** Run: `npm run build && npm run lint && npm run validate:content`
  Expected: build passes, lint clean, content valid (unchanged).

- [ ] **Step 2: Final browser pass.** One article in each language, both themes, mobile width: serif body, brass drop cap + guard, standfirst rule, masthead byline, end-mark, working A-/A+, and copy-attribution. No console errors.

- [ ] **Step 3: Hand off the push decision.** Report to the owner and, only on explicit confirmation, push:

```bash
GH_CONFIG_DIR="$HOME/.config/gh-comrade1903" git push origin main
```

---

## Self-Review

**Spec coverage:**
- Serif reading column → Task 1 Step 1. ✅
- Reading-voice consistency (`.prose`) → Task 1 Step 2. ✅
- Drop cap refinement (brass + short-opener guard) → Task 2 Steps 1, 6. ✅
- Standfirst polish → Task 2 Step 3. ✅
- Masthead byline (small-caps + brass date) → Task 2 Steps 4, 5. ✅
- Micro-typography (old-style figures, end-mark) → Task 1 (`onum`) + Task 2 Steps 2, 4. ✅
- Copy-attribution (threshold, bilingual, client-only) → Task 3. ✅
- A-/A+ still works (`font-size: 1em`) → Task 1 Step 1 note. ✅
- Both themes / brass contrast (`--tertiary-ink` auto dark override) → verification steps. ✅

**Placeholder scan:** No TBD/TODO; every step has concrete code. Brass shade resolved to `var(--tertiary-ink)` (dark-theme override confirmed). End-mark glyph fixed to `▪`.

**Type consistency:** `reader.copySourceLabel` defined in Task 3 Step 1 and used in Step 3. `shortOpener` (Task 2 Step 6) and `.no-dropcap` (Task 2 Step 1) match. `.article-byline-date` class (Task 2 Step 4 CSS) matches the `<time>` element (Task 2 Step 5 JSX). `font-size: 1em` (Task 1) preserves the `fontScale` inline multiplier (unchanged in App.tsx).

**Micro-typography note:** curly quotation marks depend on the source content already using them; `liga`/`kern` are enabled globally on reading text via `font-feature-settings`. No per-character substitution is done (that would risk altering historical quotations), consistent with the content-integrity rule.
