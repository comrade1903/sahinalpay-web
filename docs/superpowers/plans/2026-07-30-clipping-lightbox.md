# "Aslına Bak" — Clipping Lightbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make scanned newspaper clippings readable with a full-screen, zoomable, keyboard-accessible original-page lightbox opened from the article's clipping images.

**Architecture:** A single `ClippingLightbox` component in `src/App.tsx`, portaled to `document.body` and driven by local state in `LoadedArticlePage`. Zoom is button-driven (image scaled by CSS, native scroll to pan) — no zoom library. Modal a11y mirrors the site's existing inert-background + Escape + focus-trap pattern.

**Tech Stack:** React 19 (`createPortal` from `react-dom`), TypeScript (strict), Vite 8, hand-written CSS.

**Design spec:** `docs/superpowers/specs/2026-07-30-clipping-lightbox-design.md`

## Global Constraints

- **No test framework — do NOT add one.** Per-task verification = `npm run build` (`tsc -b` + vite) + `npm run lint` (oxlint), plus browser checks where noted. Run `npm run validate:content` at the end.
- **No new dependencies / no zoom library.** `createPortal` comes from `react-dom` (already a dependency).
- **Bilingual:** every user-facing string added in BOTH `tr` and `en` (`src/content.ts`).
- **Styling: `src/index.css` only**, reusing tokens (`--menu-scrim`, `--surface`, `--line`, `--ink`, `--ink-soft`, `--muted`, `--shadow-lift`, spacing/radius) and the existing `.icon-btn` control class. Style for BOTH themes.
- **Accessibility:** `role="dialog"`, `aria-modal="true"`, bilingual `aria-label`s on all controls; inert background while open; Escape closes and restores focus to the trigger; Tab trapped inside the dialog. `useReducedMotion` respected (this design uses no open/zoom animation, so reduced-motion is satisfied by construction).
- **Commits:** imperative English subject; end with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`. Commit locally per task. **Do not push** — the owner confirms the production release at the end.

## File Structure

- `src/content.ts` — a `clippingViewer` bilingual string block (Task 1).
- `src/App.tsx` — `ClippingLightbox` component + `createPortal` import (Task 2); wiring in `LoadedArticlePage` (Task 3).
- `src/index.css` — `.clipping-lightbox*` styles (Task 2).

---

## Task 1: Bilingual strings

**Files:**
- Modify: `src/content.ts` — `Content` interface + both language objects.

**Interfaces:**
- Produces on `Content`:
  ```ts
  clippingViewer: {
    dialogLabel: string
    viewOriginal: string
    close: string
    zoomIn: string
    zoomOut: string
    fit: string
    prevPage: string
    nextPage: string
    showOcr: string
    openNewTab: string
  }
  ```

- [ ] **Step 1: Extend the `Content` interface.** In `src/content.ts`, add after the `reader` member:

```ts
  clippingViewer: {
    dialogLabel: string
    viewOriginal: string
    close: string
    zoomIn: string
    zoomOut: string
    fit: string
    prevPage: string
    nextPage: string
    showOcr: string
    openNewTab: string
  }
```

- [ ] **Step 2: Fill English.** In the `en` object, add after the `reader` block:

```ts
    clippingViewer: {
      dialogLabel: 'Newspaper clipping viewer',
      viewOriginal: 'See the original',
      close: 'Close',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      fit: 'Fit to screen',
      prevPage: 'Previous page',
      nextPage: 'Next page',
      showOcr: 'OCR text',
      openNewTab: 'Open original in new tab',
    },
```

- [ ] **Step 3: Fill Turkish.** In the `tr` object, add after the `reader` block:

```ts
    clippingViewer: {
      dialogLabel: 'Gazete küpürü görüntüleyici',
      viewOriginal: 'Aslına bak',
      close: 'Kapat',
      zoomIn: 'Yakınlaştır',
      zoomOut: 'Uzaklaştır',
      fit: 'Ekrana sığdır',
      prevPage: 'Önceki sayfa',
      nextPage: 'Sonraki sayfa',
      showOcr: 'OCR metni',
      openNewTab: 'Orijinali yeni sekmede aç',
    },
```

- [ ] **Step 4: Build + lint.** Run: `npm run build && npm run lint` — Expected: PASS/clean (both languages have the new block, so `Record<Lang, Content>` typechecks).

- [ ] **Step 5: Commit.**

```bash
git add src/content.ts
git commit -m "Add bilingual strings for the clipping lightbox

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: `ClippingLightbox` component + styles

Builds the modal itself, standalone and controlled by props. Not yet wired into the reader (Task 3).

**Files:**
- Modify: `src/App.tsx` — add `createPortal` import; add the `ClippingLightbox` component (place it just above `function CookiePolicyPage`).
- Modify: `src/index.css` — add `.clipping-lightbox*` styles (append near the `.clipping-*` block, ~line 2078+).

**Interfaces:**
- Consumes (from Task 1): `content[lang].clippingViewer`.
- Produces:
  ```ts
  interface LightboxScan {
    src: string
    alt?: string
    ocrText?: string
    pageLabel?: string
    sourceNote?: string
  }
  function ClippingLightbox(props: {
    scans: LightboxScan[]
    index: number
    lang: Lang
    title: string
    onIndex: (i: number) => void
    onClose: () => void
  }): React.ReactPortal | null
  ```
  `ArchiveClipping` structurally satisfies `LightboxScan`.

- [ ] **Step 1: Import `createPortal`.** At the top of `src/App.tsx`, add the import (near the other imports):

```tsx
import { createPortal } from 'react-dom'
```

- [ ] **Step 2: Add the component.** In `src/App.tsx`, just above `function CookiePolicyPage(`, add:

```tsx
interface LightboxScan {
  src: string
  alt?: string
  ocrText?: string
  pageLabel?: string
  sourceNote?: string
}

const ZOOM_STEPS = ['fit', 1, 1.5, 2.5] as const

function ClippingLightbox({
  scans,
  index,
  lang,
  title,
  onIndex,
  onClose,
}: {
  scans: LightboxScan[]
  index: number
  lang: Lang
  title: string
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const t = content[lang].clippingViewer
  const dialogRef = useRef<HTMLDivElement>(null)
  const [zoomIdx, setZoomIdx] = useState(0)
  const [showOcr, setShowOcr] = useState(false)
  const scan = scans[index]
  const total = scans.length

  // Reset zoom/OCR when the page changes.
  useEffect(() => {
    setZoomIdx(0)
    setShowOcr(false)
  }, [index])

  // Modal a11y: inert the app root behind the portal, trap Tab, Escape closes,
  // restore focus to the trigger on unmount. Mirrors the mobile-nav pattern.
  useEffect(() => {
    const dialog = dialogRef.current
    const appRoot = document.getElementById('root')
    const previouslyFocused = document.activeElement as HTMLElement | null
    appRoot?.setAttribute('inert', '')
    const focusFrame = window.requestAnimationFrame(() => {
      dialog?.querySelector<HTMLElement>('button, a, [tabindex]')?.focus()
    })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key === 'ArrowLeft' && index > 0) onIndex(index - 1)
      else if (event.key === 'ArrowRight' && index < total - 1) onIndex(index + 1)
      else if (event.key === '+' || event.key === '=') {
        setZoomIdx((z) => Math.min(ZOOM_STEPS.length - 1, z + 1))
      } else if (event.key === '-' || event.key === '_') {
        setZoomIdx((z) => Math.max(0, z - 1))
      } else if (event.key === '0') {
        setZoomIdx(0)
      } else if (event.key === 'Tab') {
        const focusables = Array.from(
          dialog?.querySelectorAll<HTMLElement>('button, a[href], [tabindex]') ?? [],
        ).filter((el) => !el.hasAttribute('disabled'))
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables.at(-1)!
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      appRoot?.removeAttribute('inert')
      document.removeEventListener('keydown', onKeyDown)
      window.requestAnimationFrame(() => previouslyFocused?.focus())
    }
  }, [index, total, onIndex, onClose])

  if (!scan) return null

  const zoom = ZOOM_STEPS[zoomIdx]
  const imgStyle =
    zoom === 'fit'
      ? { maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }
      : { width: `${zoom * 100}%`, maxWidth: 'none' }

  return createPortal(
    <div
      className="clipping-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={t.dialogLabel}
      ref={dialogRef}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="clipping-lightbox-bar">
        {total > 1 && (
          <>
            <button
              type="button"
              className="icon-btn"
              aria-label={t.prevPage}
              disabled={index <= 0}
              onClick={() => onIndex(index - 1)}
            >
              <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
            </button>
            <span className="clipping-lightbox-page">{index + 1} / {total}</span>
            <button
              type="button"
              className="icon-btn"
              aria-label={t.nextPage}
              disabled={index >= total - 1}
              onClick={() => onIndex(index + 1)}
            >
              <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
            </button>
          </>
        )}
        <span className="clipping-lightbox-spacer" />
        <button
          type="button"
          className="icon-btn"
          aria-label={t.zoomOut}
          disabled={zoomIdx <= 0}
          onClick={() => setZoomIdx((z) => Math.max(0, z - 1))}
        >
          <span className="material-symbols-outlined" aria-hidden="true">zoom_out</span>
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-label={t.fit}
          onClick={() => setZoomIdx(0)}
        >
          <span className="material-symbols-outlined" aria-hidden="true">fit_screen</span>
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-label={t.zoomIn}
          disabled={zoomIdx >= ZOOM_STEPS.length - 1}
          onClick={() => setZoomIdx((z) => Math.min(ZOOM_STEPS.length - 1, z + 1))}
        >
          <span className="material-symbols-outlined" aria-hidden="true">zoom_in</span>
        </button>
        {scan.ocrText && (
          <button
            type="button"
            className={`icon-btn${showOcr ? ' is-active' : ''}`}
            aria-label={t.showOcr}
            aria-pressed={showOcr}
            onClick={() => setShowOcr((v) => !v)}
          >
            <span className="material-symbols-outlined" aria-hidden="true">description</span>
          </button>
        )}
        <a
          className="icon-btn"
          href={scan.src}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.openNewTab}
        >
          <span className="material-symbols-outlined" aria-hidden="true">open_in_new</span>
        </a>
        <button type="button" className="icon-btn" aria-label={t.close} onClick={onClose}>
          <span className="material-symbols-outlined" aria-hidden="true">close</span>
        </button>
      </div>

      <div className="clipping-lightbox-stage">
        <img src={scan.src} alt={scan.alt ?? title} style={imgStyle} />
      </div>

      {(scan.pageLabel || scan.sourceNote) && (
        <p className="clipping-lightbox-caption">
          {scan.pageLabel}
          {scan.pageLabel && scan.sourceNote ? ' · ' : ''}
          {scan.sourceNote}
        </p>
      )}

      {showOcr && scan.ocrText && (
        <div className="clipping-lightbox-ocr">
          <p>{scan.ocrText}</p>
        </div>
      )}
    </div>,
    document.body,
  )
}
```

- [ ] **Step 3: Confirm the app mount id.** Open `index.html` and confirm the mount node is `<div id="root">`. If it is a different id, update the `document.getElementById('root')` line in Step 2 to match. (Vite's default is `root`.)

- [ ] **Step 4: Add styles.** In `src/index.css`, after the existing `.clipping-ocr` rules (~line 2097), add:

```css
/* ---------- Clipping lightbox ---------- */
.clipping-lightbox {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: var(--menu-scrim);
  display: flex;
  flex-direction: column;
}
.clipping-lightbox-bar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
  padding: 0.55rem 0.9rem;
  background: var(--surface);
  border-bottom: 1px solid var(--line);
}
.clipping-lightbox-spacer {
  flex: 1 1 auto;
}
.clipping-lightbox-page {
  font-size: 0.85rem;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
  min-width: 3.5ch;
  text-align: center;
}
.clipping-lightbox .icon-btn.is-active {
  color: var(--accent-ink);
  background: var(--accent-soft);
}
.clipping-lightbox-stage {
  flex: 1 1 auto;
  overflow: auto;
  display: grid;
  place-items: start center;
  padding: 1rem;
}
.clipping-lightbox-stage img {
  display: block;
  background: var(--surface-lowest);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-lift);
}
.clipping-lightbox-caption {
  margin: 0;
  padding: 0.5rem 0.9rem;
  background: var(--surface);
  border-top: 1px solid var(--line);
  font-size: 0.8rem;
  color: var(--muted);
}
.clipping-lightbox-ocr {
  background: var(--surface);
  border-top: 1px solid var(--line);
  max-height: 30vh;
  overflow: auto;
  padding: 0.75rem 0.9rem;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--ink-soft);
}
.clipping-lightbox-ocr p {
  margin: 0;
  max-width: var(--measure);
}
```

- [ ] **Step 5: Build + lint.** Run: `npm run build && npm run lint`
  Expected: PASS/clean. (The component is defined but not yet rendered — TypeScript may warn it is unused; it will be used in Task 3. If oxlint flags it as unused, proceed to Task 3 in the same session so it becomes used before committing; commit Task 2 and Task 3 together if needed to avoid an unused-symbol lint error. See Task 2 Step 6.)

- [ ] **Step 6: Commit (only if lint is clean standalone).** If `npm run lint` is clean:

```bash
git add src/App.tsx src/index.css
git commit -m "Add the ClippingLightbox modal component and styles

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

If lint fails because `ClippingLightbox` is unused, skip this commit and do Task 3 next, then commit Tasks 2+3 together with the Task 3 message.

---

## Task 3: Wire the lightbox into the reader

Makes the clipping images open the lightbox.

**Files:**
- Modify: `src/App.tsx` — `LoadedArticlePage`: lightbox state, an openable-scan list, buttons around the clipping images, and render `<ClippingLightbox>`.

**Interfaces:**
- Consumes (Task 2): `ClippingLightbox`, `LightboxScan`; (Task 1): `content[lang].clippingViewer.viewOriginal`.

- [ ] **Step 1: Add state + openable list.** In `LoadedArticlePage`, near the other derived values (right after `const shortOpener = ...`), add:

```tsx
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const openableScans: LightboxScan[] = [
    ...(item.imageSrc ? [{ src: item.imageSrc, alt: item.title }] : []),
    ...scans,
  ]
```

- [ ] **Step 2: Make the `imageSrc` figure open the lightbox.** In the clipping-viewer JSX, replace:

```tsx
            {item.imageSrc && (
              <figure className="clipping-frame">
                <img src={item.imageSrc} alt={item.title} loading="lazy" />
              </figure>
            )}
```

with:

```tsx
            {item.imageSrc && (
              <figure className="clipping-frame">
                <button
                  type="button"
                  className="clipping-open"
                  aria-label={content[lang].clippingViewer.viewOriginal}
                  onClick={() => setLightboxIndex(0)}
                >
                  <img src={item.imageSrc} alt={item.title} loading="lazy" />
                  <span className="clipping-open-hint">
                    <span className="material-symbols-outlined" aria-hidden="true">zoom_in</span>
                    {content[lang].clippingViewer.viewOriginal}
                  </span>
                </button>
              </figure>
            )}
```

- [ ] **Step 3: Make each scan figure open the lightbox.** Replace the scan `<img>` in `scans.map(...)`:

```tsx
                <img
                  src={clipping.src}
                  alt={clipping.alt ?? item.title}
                  loading="lazy"
                />
```

with a button wrapper (note the index offset: openable list is `[imageSrc?, ...scans]`, so a scan at map-index `index` is at lightbox index `index + (item.imageSrc ? 1 : 0)`):

```tsx
                <button
                  type="button"
                  className="clipping-open"
                  aria-label={content[lang].clippingViewer.viewOriginal}
                  onClick={() => setLightboxIndex(index + (item.imageSrc ? 1 : 0))}
                >
                  <img
                    src={clipping.src}
                    alt={clipping.alt ?? item.title}
                    loading="lazy"
                  />
                  <span className="clipping-open-hint">
                    <span className="material-symbols-outlined" aria-hidden="true">zoom_in</span>
                    {content[lang].clippingViewer.viewOriginal}
                  </span>
                </button>
```

- [ ] **Step 4: Render the lightbox.** At the very end of the returned JSX of `LoadedArticlePage`, just before the closing `</section>`, add:

```tsx
        {lightboxIndex !== null && openableScans[lightboxIndex] && (
          <ClippingLightbox
            scans={openableScans}
            index={lightboxIndex}
            lang={lang}
            title={item.title}
            onIndex={setLightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
```

- [ ] **Step 5: Add the button/hint styles.** In `src/index.css`, in the clipping-lightbox block you added in Task 2, also add:

```css
.clipping-open {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  cursor: zoom-in;
  position: relative;
}
.clipping-open img {
  width: 100%;
  border-radius: var(--radius);
  background: var(--surface-mid);
  display: block;
}
.clipping-open-hint {
  position: absolute;
  right: 0.6rem;
  bottom: 0.6rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.6rem;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--surface) 88%, transparent);
  border: 1px solid var(--line);
  color: var(--ink);
  font-family: var(--label);
  font-size: 0.8rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.clipping-open:hover .clipping-open-hint,
.clipping-open:focus-visible .clipping-open-hint {
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .clipping-open-hint {
    transition: none;
    opacity: 1;
  }
}
```

- [ ] **Step 6: Build + lint.** Run: `npm run build && npm run lint` — Expected: PASS/clean.

- [ ] **Step 7: Browser-verify** (`npm run dev`; open a scan item — the Aydınlık/İşçi-Köylü pieces under `/tr/analizler/...`):
  - Clicking a scan opens the lightbox; zoom in makes the newsprint legible; scrolling pans; Fit resets.
  - Multi-page item: prev/next buttons and Left/Right arrows page through; "2 / 5" indicator updates; zoom/OCR reset per page.
  - OCR button toggles the text panel; "open in new tab" opens the raw scan.
  - Keyboard: `+`/`-`/`0` zoom; Tab is trapped in the dialog; Escape closes and focus returns to the clicked image; background is inert while open.
  - Both themes + mobile width; reduced-motion (hint always visible, no animation).

- [ ] **Step 8: Commit** (include Task 2's files if they were not committed separately):

```bash
git add src/App.tsx src/index.css
git commit -m "Open scanned clippings in a zoomable original-page lightbox

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Final verification + release

- [ ] **Step 1: Full suite.** Run: `npm run build && npm run lint && npm run validate:content` — Expected: all pass/clean.
- [ ] **Step 2: Final browser pass.** A scan item in TR, both themes, mobile; full keyboard walkthrough; no console errors.
- [ ] **Step 3: Hand off the push decision.** Report to the owner; only on explicit confirmation:

```bash
GH_CONFIG_DIR="$HOME/.config/gh-comrade1903" git push origin main
```

---

## Self-Review

**Spec coverage:**
- Zoomable original-page lightbox → Task 2 (component) + Task 3 (wiring). ✅
- No zoom library (button zoom + native scroll) → Task 2 `ZOOM_STEPS`/`imgStyle`. ✅
- Entry from clipping images with "Aslına bak" label → Task 3 Steps 2–3, 5. ✅
- Multi-page nav (buttons + arrows + indicator) → Task 2 bar + keydown. ✅
- OCR panel → Task 2 `showOcr`. ✅
- Open-in-new-tab link → Task 2 `open_in_new` anchor. ✅
- Modal a11y (dialog/aria-modal, inert, Escape, Tab trap, focus restore) → Task 2 effect. ✅
- `item.imageSrc` included in openable set → Task 3 Step 1 + index offset (Steps 2–3). ✅
- Reduced motion → no animations; hint forced visible under reduced-motion (Task 3 Step 5). ✅
- Bilingual strings → Task 1. ✅

**Placeholder scan:** No TBD/TODO. Two spec "open items" resolved: zoom steps fixed to `['fit', 1, 1.5, 2.5]`; OCR is a collapsible panel below the image. One explicit check (Task 2 Step 3: confirm `#root` mount id) — a real verification with a stated default, not a deferred decision.

**Type consistency:** `LightboxScan` (Task 2) is consumed in Task 3's `openableScans`; `ArchiveClipping` satisfies it structurally. `ClippingLightbox` prop names (`scans`, `index`, `lang`, `title`, `onIndex`, `onClose`) match the render site (Task 3 Step 4). The lightbox index offset for scans (`index + (item.imageSrc ? 1 : 0)`) matches the `openableScans` construction order (`[imageSrc?, ...scans]`). `content[lang].clippingViewer` fields match Task 1's interface.

**Portal/inert correctness:** The lightbox is portaled to `document.body` (outside `#root`), so inert-ing `#root` disables the app chrome without disabling the dialog — avoiding the trap of inert-ing an ancestor of the dialog.
