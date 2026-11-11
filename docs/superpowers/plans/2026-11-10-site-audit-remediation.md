# Site Audit Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> Every task is its own branch and its own pull request; never batch two tasks into one PR. The owner picks which tasks run and in what order — do not start the next one unasked.

**Goal:** Fix what the November 2026 audit found: layout shift, an oversized first load, sub-14px type, small touch targets, split search results, stale duplicated data, and the dead code around them — without changing a word of archive content.

**Architecture:** The site stays a static, client-rendered React SPA with prerendered heads. The work is twenty-eight tasks in six phases: a measurement tool and a test net first, then correctness fixes, accessibility and robustness, performance (route-level code splitting, right-sized images, one font file per face, CSS animation instead of the `motion` library), reading and search UX, and cleanup. Each task ships alone and leaves `main` deployable; where one needs another, its header says "Depends on".

**Tech Stack:** React 19, TypeScript 7 (strict), Vite 8, react-router-dom 7, vitest 5 + happy-dom + @testing-library/react, oxlint, hand-written CSS in `src/index.css`, Vercel static hosting. No new npm dependencies.

**Spec:** `docs/superpowers/specs/2026-11-10-site-audit-design.md` (Turkish). Finding IDs such as `PERF-1` and `UX-3` refer to it; read the finding before starting its task.

---

## Sahibi için özet (Türkçe)

Her görev ayrı bir PR'dır. "Onay" sütununda **Evet** yazan görevlere siz açıkça "yap" demeden başlanmaz.

| # | Görev | Bulgu | Öncelik | Onay |
|---|---|---|---|---|
| 0 | Denetim raporu ve planı depoya al | — | — | Hayır |
| 1 | `npm run audit:ui` ölçüm komutu | ENG-3 | P2 | Hayır |
| 2 | Her rotanın açıldığını sınayan testler | ENG-3 | P2 | Hayır |
| 3 | Alt bilginin sıçramasını durdur (CLS) | PERF-1 | P1 | Hayır |
| 4 | Yapılandırılmış veriden yanlış kitabı çıkar, testle koru | ENG-1 | P1 | **Evet** |
| 5 | Ana sayfa sayıları bölüm sayfalarıyla aynı olsun | UX-3 | P2 | Hayır |
| 6 | Kitap bağlantıları ve site adı 44px dokunma alanı | A11Y-5 | P2 | Hayır |
| 7 | En küçük yazı 14px; tarayıcı yazı boyutuna uy | A11Y-2, A11Y-3 | P2 | **Evet** |
| 8 | 320px ekranda yatay taşmayı gider | A11Y-4 | P2 | Hayır |
| 9 | Kayıtlı temayı ilk boyamadan önce uygula | A11Y-8 | P2 | Hayır |
| 10 | Okuyucuda yazı boyutunu hatırla | UX-4 | P2 | **Evet** (politika metni) |
| 11 | Eski paket hatasında sayfayı bir kez yenile | ENG-2 | P2 | Hayır |
| 12 | Google Translate altında bozulmayı önle | UX-12 | P2 | Hayır |
| 13 | Portre, avatar, kapak ve logoları doğru boyutta sun | PERF-3 | P2 | Hayır |
| 14 | Türkçe harfleri ana yazı tipi dosyasına al | PERF-4 | P2 | **Evet** (indirme) |
| 15 | Paket boyutu bütçesi (CI kapısı) | ENG-3 | P2 | Hayır |
| 16 | Sayfaları ayrı paketlere böl | PERF-2 | P1 | Hayır |
| 17 | Ağır metinleri `content.ts` dışına al | PERF-2 | P1 | Hayır |
| 18 | `motion` yerine CSS animasyonu | PERF-5 | P2 | **Evet** |
| 19 | Yazdırma stili | A11Y-7 | P2 | Hayır |
| 20 | Arama sonuçlarını tek listede göster | UX-1 | P1 | **Evet** |
| 21 | Okuyucu sayfası düzeltmeleri | UX-7 | P3 | Hayır |
| 22 | Gazete bayii ve liste düzeltmeleri | UX-5, UX-6 | P3 | **Evet** (varsayılan yayın) |
| 23 | 404, Kimdir boşluğu, basın tarihleri | UX-10 | P3 | Hayır |
| 24 | Fotoğraf alt metni; dış bağlantı işareti | A11Y-6, UX-11 | P3 | Hayır |
| 25 | Ölü kod, eski etiketler, eksik simgeler, önbellek kuralları | ENG-5, ENG-6, ENG-9, PERF-8 | P3 | Hayır |
| 26 | Kırılma noktalarını `em`'e çevir | A11Y-3 | P3 | Hayır |
| 27 | Belgeleri güncelle | ENG-7 | P3 | Hayır |

Bu planda **olmayan** büyük işler (ayrı tasarım gerekir): taramalar için metin katmanı, gövdenin ön-işlenmesi, site geneli arama, yargılanma sayfasının bölünmesi, çerez bandı, depo geçmişi. `claude-review` CI hatası yalnızca sizin GitHub'da düzeltebileceğiniz bir konudur (bkz. en altta).

---

## Global Constraints

- **One task, one branch, one PR.** Never push to `main`. Branch name is given per task. Opening and merging a PR are outward-facing: ask the owner first each time.
- Prefix every `git push` and `gh` command with `GH_CONFIG_DIR="$HOME/.config/gh-comrade1903"`.
- Run `git branch --show-current` immediately before committing and before pushing; push with an explicit refspec: `git push -u origin <branch>:<branch>`. Another session can switch the working tree.
- Reply to the owner in **Turkish**. Code, comments and commit messages are **English**; commit subjects are imperative and describe the user-visible outcome.
- A task marked **Owner approval** is not started until the owner says so in the session.
- Any UI string is added or changed in **both** languages in the same change.
- No CSS framework, no utility classes. Reuse tokens and classes in `src/index.css`; add a token on purpose, never a literal.
- No new npm dependencies. No downloads without the owner's explicit yes (Task 14 is the only task that needs one).
- Never invent, reword or re-date archive content. Display formatting may change; source strings may not.
- Never hand-edit generated files: `src/archive/tr/columns/zaman.ts`, `src/archive/en/columns/todays-zaman.ts`, `src/archive/summary.generated.ts`, `public/sitemap.xml`, `public/robots.txt`, `scripts/sitemap-lastmod.json`, the `redirects` array of `vercel.json`.
- Visual changes are checked in both themes, both languages (`/` and `/tr`) and at phone width.
- Use `npm run serve:dist`, never `npm run preview`, for anything about status codes or built output.

### Closing checklist (run at the end of every task, before the commit)

```bash
npm run build && npm run lint && npm test && npm run validate:content && npm run verify:prerender
npm run generate:sitemap && npm run generate:summary && npm run generate:redirects
git status --short        # a generated file that changed belongs in this commit
```

Expected: every command exits 0. Then commit, push, ask the owner to open the PR, wait for the `Typecheck, lint, test, validate, build` check, and merge (squash) only on the owner's word. Afterwards: `git checkout main && git pull`, delete the branch.

`index.html` feeds every prerendered page, so a task that edits it changes every page's sitemap fingerprint: a large `public/sitemap.xml` and `scripts/sitemap-lastmod.json` diff is expected there.

## Review Focus

The inputs no task's happy path exercises and that are most likely to bite a reader:

1. **A lazy page chunk that fails to load** (offline, or a deploy replaced it): the reader sees a recovery screen with a reload, never a blank page — Task 11 (reload once) and Task 16 (Step 6 test).
2. **Browser storage blocked** (Safari Lockdown, private mode): the theme script and the stored text size must not throw — Task 9 and Task 10 each carry a "storage throws" test.
3. **Reduced motion, or no `IntersectionObserver`**: content is fully visible with no animation — Task 18 tests both.
4. **A Turkish record opened under an English path** (`/columns/<turkish-slug>`): still renders after the page split — Task 2 includes this route and Tasks 16–17 must keep it green.
5. **A search that matches both languages' newspapers**: one list, each row naming its outlet, foreign-language rows included — Task 20 test.

---

## Phase 1 — Measurement and safety net

### Task 0: Land the audit documents

**Branch:** `docs/site-audit-2026-11`

**Files:**
- Create (already written, untracked): `docs/superpowers/specs/2026-11-10-site-audit-design.md`, `docs/superpowers/plans/2026-11-10-site-audit-remediation.md`
- Modify: `CLAUDE.md` — the "Repo layout caveats" bullet for `docs/superpowers/`

- [ ] **Step 1:** `git checkout main && git pull && git checkout -b docs/site-audit-2026-11`
- [ ] **Step 2:** In `CLAUDE.md`, replace the bullet `` `docs/superpowers/` — vendored skill docs, not project documentation. `` with: `` `docs/superpowers/` — this project's own design specs (`specs/`) and implementation plans (`plans/`), one pair per feature. They record why a feature is the way it is; they are not vendored. ``
- [ ] **Step 3:** Run `npm run check:secrets && npm run lint && npm test`. Expected: all pass.
- [ ] **Step 4:** Commit only these three files:

```bash
git add docs/superpowers/specs/2026-11-10-site-audit-design.md docs/superpowers/plans/2026-11-10-site-audit-remediation.md CLAUDE.md
git commit -m "Record the November 2026 site audit and its remediation plan"
```

### Task 1: `npm run audit:ui`

**Branch:** `chore/ui-audit-command` · **Finding:** ENG-3

**Files:**
- Create: `scripts/ui-audit.mjs`
- Modify: `package.json` (add script `"audit:ui": "node scripts/ui-audit.mjs"`), `CLAUDE.md` (three lines under "Working conventions")

**Interfaces:**
- Produces the command every later task verifies with:
  `npm run audit:ui -- [--base http://localhost:4180] [--only <substring>] [--out tmp/ui-audit] [--shots] [--scheme light|dark] [--media print] [--default-font-size <px>]`
- Needs `npm run serve:dist` running. Chrome path: `process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'`.
- Job name: `<lang>-<viewport>-<scheme>-<page>`. Viewports: `m` 390×844 touch, `d` 1440×900, `s` 320×640 touch.
- Pages (Turkish path / key): `/tr` home, `/tr/kimdir` about, `/tr/kose-yazilari` columns, `/tr/kose-yazilari/1915-tabusu` article, `/tr/kose-yazilari/hocam-ve-dostum-tomas-hammara-veda` reader, `/tr/soylesiler` interviews, `/tr/akademik-makaleler` academic, `/tr/akademik-makaleler/68-kusagi-uzerine-bir-deneme-1988` scan, `/tr/kitaplar` books, `/tr/yargilanma-surecim` trial, `/tr/basinda-hakkimda` press, `/tr/fotograflarla-hikayem` photos, `/tr/cerez-politikasi` cookies, `/tr/yok-boyle-bir-sayfa` notfound. English: `/` home, `/columns` columns, `/books` books.
- Default matrix: every Turkish page at `m` and `d`; the three English pages at `m` and `d`; `s` for home, columns, article, books.
- Printed columns, one row per job: `hscroll` (document wider than the viewport), `clsLoad` (layout shift summed over the 1.8 s after load, **before any scrolling**), `under44` (visible, non-inline interactive elements less than 44px **high**), `minFont` (smallest computed font size, px, of visible text), `contrastFails`, `h1`, `fonts` (font files requested), `jsKb`, `imgKb`. Also writes `<out>/results.json`; `--shots` writes `<out>/<job>.png` (full page, capped at 4,000px).
- Exit code is 0 unless Chrome cannot be started: this is a report, not a gate.

- [ ] **Step 1:** Build the script from the audit's harness in `tmp/site-audit-2026-11-10/`: `cdp.mjs` (DevTools-protocol driver and the in-page metrics), `mkjobs.mjs` (matrix), `mk2.mjs` (the `layout-shift` observer with sources), `summ.mjs` (table). If that folder is gone, write it from the Interfaces block: launch Chrome with `--headless=new --remote-debugging-port`, one `Target.createBrowserContext` per job, `Emulation.setDeviceMetricsOverride`, `Emulation.setEmulatedMedia` (`prefers-color-scheme`, `media`), `Page.addScriptToEvaluateOnNewDocument` to set `localStorage['cookie-consent'] = 'ok'` and start a buffered `layout-shift` `PerformanceObserver`, a 45 s timeout on every protocol call, results written after every job.
- [ ] **Step 2:** Differences from the harness: measure `clsLoad` before the scroll pass; `under44` tests height only; add `minFont`; `--default-font-size n` calls `Page.setFontSizes({ fontSizes: { standard: n, fixed: n } })`.
- [ ] **Step 3:** Verify against the audit's numbers on `main`:

Run: `npm run build && npm run serve:dist` in one shell, `npm run audit:ui` in another.
Expected: `tr-d-light-columns` `clsLoad` 0.35–0.40; `tr-s-light-home` `hscroll` yes; `tr-m-light-books` `under44` ≥ 13; `tr-m-light-home` `minFont` 12.2 and five font files.

- [ ] **Step 4:** Add to `CLAUDE.md` under "Working conventions": "`npm run audit:ui` (with `npm run serve:dist` running) measures layout shift, horizontal overflow, touch-target height, smallest type and contrast on every page at phone and desktop widths. Run it before and after layout work; it complements the browser check, it does not replace it."
- [ ] **Step 5:** Closing checklist, then commit: `Add a repeatable interface audit command`

### Task 2: Route smoke tests

**Branch:** `test/route-smoke` · **Finding:** ENG-3

**Files:**
- Create: `tests/routes-smoke.test.tsx`
- Modify (only if a browser API is missing in happy-dom): `tests/setup.ts`

**Interfaces:**
- Produces the regression net Tasks 16, 17 and 18 rely on. It characterises today's behaviour, so it must pass on `main` unchanged.

- [ ] **Step 1: Write the test**

```tsx
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'
import { paths } from '../src/routes'
import type { Lang } from '../src/content'

const staticRoutes = (['en', 'tr'] as Lang[]).flatMap((lang) =>
  Object.entries(paths[lang]).map(([key, path]) => ({ lang, key, path: path! })),
)

async function open(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
  await waitFor(() => expect(document.querySelectorAll('h1')).toHaveLength(1), { timeout: 15000 })
  return document.querySelector('h1')!.textContent!.trim()
}

afterEach(() => vi.restoreAllMocks())

/* React's own "not wrapped in act" notice is test plumbing, not a page error. */
const realErrors = (spy: { mock: { calls: unknown[][] } }) =>
  spy.mock.calls.filter((call) => !String(call[0]).includes('not wrapped in act'))

describe('every route renders', () => {
  it.each(staticRoutes)('$path shows one heading and logs no error', async ({ path }) => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect((await open(path)).length).toBeGreaterThan(0)
    expect(document.title).toContain('Şahin Alpay')
    expect(realErrors(errors)).toEqual([])
  })

  it('opens a column on its own page', async () => {
    expect(await open('/tr/kose-yazilari/demokrasinin-zaferi')).toContain('Demokrasinin zaferi')
  })

  /* The English page may add a bracketed translation after the title. */
  it('opens a Turkish column under the English columns path', async () => {
    expect(await open('/columns/demokrasinin-zaferi')).toContain('Demokrasinin zaferi')
  })

  it('opens a press piece', async () => {
    expect((await open('/tr/basinda-hakkimda/ali-bayramoglu-28-temmuz-2016')).length).toBeGreaterThan(0)
  })

  it('answers an unknown address with the not-found page', async () => {
    const { content } = await import('../src/content')
    expect(await open('/tr/yok-boyle-bir-sayfa')).toBe(content.tr.notFound.title)
  })
})
```

- [ ] **Step 2:** Run `npx vitest run tests/routes-smoke.test.tsx`. Expected: PASS. If happy-dom lacks an API the app calls (`window.scrollTo`, `IntersectionObserver`, `HTMLDialogElement.prototype.showModal`), stub it in `tests/setup.ts` — never in a component.
- [ ] **Step 3:** Closing checklist, then commit: `Test that every route renders`

---

## Phase 2 — Correctness

### Task 3: Stop the footer jumping (CLS)

**Branch:** `fix/footer-layout-shift` · **Finding:** PERF-1 · **Depends on:** Task 1

**Files:**
- Modify: `src/index.css` (next to the `main:focus` rule, around line 438)
- Create: `tests/layout-guards.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')

describe('layout guards', () => {
  /* Measured 2026-11-10: the footer started inside the first viewport and was
     pushed out when the archive arrived — CLS 0.37 on the columns page. */
  it('keeps the footer below the fold while a page loads', () => {
    expect(css).toMatch(/#main-content\s*\{[^}]*min-height:\s*100dvh/)
  })
})
```

- [ ] **Step 2:** Run `npx vitest run tests/layout-guards.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Add to `src/index.css`:

```css
/* An archive page renders a one-line loading state first and its content a
   moment later. Without a floor under <main> the footer sat inside the first
   viewport and was pushed down when the content arrived. */
#main-content {
  min-height: 100vh;
  min-height: 100dvh;
}
```

- [ ] **Step 4:** Run the test. Expected: PASS.
- [ ] **Step 5:** Run `npm run build && npm run serve:dist`, then `npm run audit:ui -- --only -d-light-`. Expected: `clsLoad` ≤ 0.02 for columns, interviews, academic, article and scan (were 0.37, 0.40, 0.40, 0.20, 0.40). Repeat with `--only -m-light-`.
- [ ] **Step 6:** Closing checklist, then commit: `Stop the footer jumping when an archive page finishes loading`

### Task 4: Structured data names only real books — Owner approval

**Branch:** `fix/books-structured-data` · **Finding:** ENG-1 (owner decision 7 in the spec)

**Files:**
- Modify: `index.html` — the `Book` node named "Sosyal Demokrasi Açısından Kürt Sorunu" in the third JSON-LD block
- Create: `tests/books-consistency.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { content } from '../src/content'

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const norm = (value: string) => value.replace(/[’']/g, "'").trim()
const listed = new Set(content.tr.books.books.map((book) => norm(book.title)))

describe('the book list has one source', () => {
  it('index.html names only books the Books page lists', () => {
    const names = [...read('index.html').matchAll(/"@type":\s*"Book",\s*"name":\s*"([^"]+)"/g)].map(
      (match) => norm(match[1]!),
    )
    expect(names.length).toBeGreaterThan(0)
    for (const name of names) expect(listed.has(name), name).toBe(true)
  })

  it('llms.txt selects only books the Books page lists', () => {
    const section = read('public/llms.txt').split('## Selected works')[1]!.split('\n## ')[0]!
    const names = [...section.matchAll(/^- (.+?) \(\d{4}\)/gm)].map((match) => norm(match[1]!))
    expect(names.length).toBeGreaterThan(0)
    for (const name of names) expect(listed.has(name), name).toBe(true)
  })

  it('both languages list the same books in the same order', () => {
    expect(content.en.books.books.map((book) => book.title)).toEqual(
      content.tr.books.books.map((book) => book.title),
    )
  })
})
```

- [ ] **Step 2:** Run `npx vitest run tests/books-consistency.test.ts`. Expected: the first test FAILS on `Sosyal Demokrasi Açısından Kürt Sorunu`; the other two pass.
- [ ] **Step 3:** Delete that one `Book` object (and the comma before it) from the `@graph` array in `index.html`. Change nothing else in the block.
- [ ] **Step 4:** Run the test. Expected: PASS.
- [ ] **Step 5:** Closing checklist (large sitemap diff expected), then commit: `Stop the site-wide structured data naming a book the Books page does not list`

### Task 5: Home counts match the section pages

**Branch:** `fix/hub-counts` · **Finding:** UX-3

**Files:**
- Modify: `src/lib/countLabel.ts`, `src/App.tsx` (`hubCount` at line 128, `HubGrid`, `ArchiveRoutePage` at line 766), `src/components/archive/index.tsx` (`ActiveFilterSummary` at line 288, `FlatArchivePage` at line 1127), `tests/count-label.test.ts`
- Create: `src/lib/hubCount.ts`, `tests/hub-count.test.ts`

**Interfaces:**
- Produces:

```ts
// src/lib/countLabel.ts
export type CountNoun = 'piece' | 'book' | 'interview' | 'article'
export function countLabel(count: number, lang: Lang, noun?: CountNoun): string
// tr: yazı · kitap · söyleşi · makale (never inflected)
// en: piece(s) · book(s) · interview(s) · article(s)

// src/lib/hubCount.ts — moved out of App.tsx unchanged except for `columns`
export function hubCount(key: PageKey, bookCount: number, summary: ArchiveSummary | null): number | null
export function hubNoun(key: PageKey): CountNoun   // books→book, interviews→interview, academic→article, else piece
```

- `FlatArchivePage` and `ActiveFilterSummary` gain an optional `noun?: CountNoun` (default `'piece'`); `ArchiveRoutePage` passes `'interview'` and `'article'`.

- [ ] **Step 1: Write the failing tests.** Add to `tests/count-label.test.ts`:

```ts
it('names interviews and articles by their own noun', () => {
  expect(countLabel(11, 'tr', 'interview')).toBe('11 söyleşi')
  expect(countLabel(1, 'en', 'interview')).toBe('1 interview')
  expect(countLabel(11, 'en', 'interview')).toBe('11 interviews')
  expect(countLabel(24, 'tr', 'article')).toBe('24 makale')
  expect(countLabel(24, 'en', 'article')).toBe('24 articles')
})
```

`tests/hub-count.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { hubCount, hubNoun } from '../src/lib/hubCount'

const summary = {
  counts: { columns: { tr: 522, en: 138 }, analyses: 0, interviews: 11, academic: 24 },
  coverage: [],
}

describe('hubCount', () => {
  /* The columns page lists both languages, so its card must count both:
     the home page said 522 where the page itself said 660. */
  it('counts the columns of both languages', () => {
    expect(hubCount('columns', 8, summary)).toBe(660)
  })
  it('passes the other sections through', () => {
    expect(hubCount('interviews', 8, summary)).toBe(11)
    expect(hubCount('books', 8, summary)).toBe(8)
    expect(hubCount('about', 8, summary)).toBeNull()
    expect(hubCount('columns', 8, null)).toBeNull()
  })
  it('names each section by its own noun', () => {
    expect(hubNoun('interviews')).toBe('interview')
    expect(hubNoun('academic')).toBe('article')
    expect(hubNoun('books')).toBe('book')
    expect(hubNoun('columns')).toBe('piece')
  })
})
```

- [ ] **Step 2:** Run `npx vitest run tests/count-label.test.ts tests/hub-count.test.ts`. Expected: FAIL (module and nouns missing).
- [ ] **Step 3:** Implement the two modules; make `HubGrid` call `hubCount(h.key, t.books.books.length, summary)` and `countLabel(count, lang, hubNoun(h.key))`; thread `noun` through `ArchiveRoutePage` → `FlatArchivePage` → `ActiveFilterSummary`.
- [ ] **Step 4:** Run the tests. Expected: PASS.
- [ ] **Step 5:** Browser check: `/tr` and `/` show "660 yazı" / "660 pieces" on the columns card; `/tr/soylesiler` shows "11 söyleşi"; `/tr/akademik-makaleler` shows "24 makale".
- [ ] **Step 6:** Closing checklist, then commit: `Make the home page counts match the section pages`

---

## Phase 3 — Accessibility and robustness

### Task 6: 44px touch targets

**Branch:** `fix/touch-targets` · **Finding:** A11Y-5 · **Depends on:** Tasks 1, 3 (shares `tests/layout-guards.test.ts`)

**Files:**
- Modify: `src/index.css` (`.book-buy` at line 1680, `.book-actions`, `.book-actions-row`, `.wordmark` at line 647, the year-range inputs' rule), `tests/layout-guards.test.ts`

- [ ] **Step 1: Add the failing test**

```ts
it('gives a book link a full-height touch target', () => {
  expect(css).toMatch(/\.book-buy\s*\{[^}]*min-height:\s*var\(--control-hit-size\)/)
})
```

- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** In `src/index.css`:
  - `.book-buy`: add `min-height: var(--control-hit-size);` and remove `margin-top`, `border-bottom` and `transition`. The hover rule would otherwise draw at the bottom of a 44px box, far from the words, so it moves to the words: wrap the label text in `<span className="book-buy-label">` in the five places a `.book-buy` is rendered (four in `BooksPage` in `src/App.tsx`, one in `src/components/BookTranslationDialog.tsx`) and give that span `border-bottom: 1px solid transparent; transition: border-color 0.2s var(--ease-out);`, turning `var(--action)` under `.book-buy:hover .book-buy-label`.
  - `.book-actions`: `margin-top: 0; gap: 0;`. `.book-actions-row`: `gap: 0 1.5rem;`. Remove the now-redundant `.book-actions .book-buy` and `.translation-tools .book-buy` margin resets.
  - `.wordmark`: add `display: inline-flex; align-items: center; min-height: var(--control-hit-size);`.
  - Year inputs: read `YearRangeFilter` (`src/components/archive/index.tsx:346`) for the input's class and give it `min-height: var(--control-hit-size);` (it measured 42px).
- [ ] **Step 4:** Run the test. Expected: PASS.
- [ ] **Step 5:** `npm run audit:ui -- --only books` and `--only columns`. Expected: `under44` 0 on every row (books were 13–16).
- [ ] **Step 6:** Browser check of `/tr/kitaplar` and `/books` in both themes: links still read as text links, rows evenly spaced, hover underline sits under the words.
- [ ] **Step 7:** Closing checklist, then commit: `Give the book links and the wordmark a full-size touch target`

### Task 7: 14px type floor; follow the browser's font size — Owner approval

**Branch:** `fix/type-floor` · **Finding:** A11Y-2, A11Y-3

**Files:**
- Modify: `src/index.css` (`--text-label-sm` at line 59; the `:root` `font-size` at line 207 and its nested `@media (max-width: 768px)` block), `DESIGN.md` (front-matter `typography.label` and `label-sm`, and the sentence about the 18px base), `tests/layout-guards.test.ts`

- [ ] **Step 1: Add the failing tests**

```ts
it('sets the root size in percent so a larger browser default is honoured', () => {
  expect(css).toMatch(/font-size:\s*112\.5%/)
  expect(css).not.toMatch(/^\s*font-size:\s*1[78]px;/m)
})
it('keeps the smallest label at 14px or more', () => {
  expect(css).toMatch(/--text-label-sm:\s*0\.78rem/)
})
```

- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** In `:root`: `--text-label-sm: 0.78rem;` (was `0.72rem`); `font-size: 112.5%;` (18px at the browser default). In the nested phone block: `font-size: 106.25%;` (17px) and, so nothing is under 14px at that root, `--text-label: 0.83rem; --text-label-sm: 0.83rem;`.
- [ ] **Step 4:** Update `DESIGN.md` to the new values in the same change, so the design detector does not report them as off-ramp.
- [ ] **Step 5:** Run the tests. Expected: PASS.
- [ ] **Step 6:** `npm run audit:ui`. Expected: `minFont` ≥ 14 on every row (was 12.2 on phones, 13 on desktop); no row gains `hscroll`.
- [ ] **Step 7:** `npm run audit:ui -- --shots --only home` and `--only columns`, in `--scheme light` and `--scheme dark`; show the owner the before/after of the kicker, dates and count badges.
- [ ] **Step 8:** Closing checklist, then commit: `Raise the smallest type to 14px and follow the reader's own font size`

### Task 8: Fit a 320px screen

**Branch:** `fix/reflow-320` · **Finding:** A11Y-4 · **Depends on:** Task 1

**Files:**
- Modify: `src/index.css` (after the `.header-actions` rule at line 731)

- [ ] **Step 1:** `npm run audit:ui -- --only -s-`. Expected (before): `hscroll` yes on all four rows.
- [ ] **Step 2:** Add:

```css
/* 320px phones and 400% zoom: the wordmark and the three header controls
   did not fit on one row, which widened the whole page to 348px. */
@media (max-width: 359px) {
  .container {
    padding-inline: var(--space-2);
  }
  .header-inner {
    gap: var(--space-1);
  }
  .header-actions {
    gap: 0.25rem;
  }
  .wordmark {
    font-size: 1.2rem;
  }
}
```

- [ ] **Step 3:** Rebuild, `npm run audit:ui -- --only -s- --shots`. Expected: `hscroll` no on all four; the theme toggle is fully inside the screenshot.
- [ ] **Step 4:** Closing checklist, then commit: `Fit the header on a 320px screen`

### Task 9: Apply the saved theme before the first paint

**Branch:** `fix/theme-flash` · **Finding:** A11Y-8

**Files:**
- Create: `public/theme-init.js`, `tests/theme-init.test.ts`
- Modify: `index.html` (a classic `<script src="/theme-init.js"></script>` directly after the viewport `<meta>`), `vercel.json` (`headers` array only: `/theme-init.js` → `Cache-Control: public, max-age=86400, stale-while-revalidate=604800`)

**Interfaces:**
- Consumes: `THEME_KEY` (`'theme'`) from `src/lib/preferences.ts`. The script is plain ES5, self-invoking, served from `public/` so the `script-src 'self'` policy allows it.

- [ ] **Step 1: Write the failing test**

```ts
import { readFileSync } from 'node:fs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { THEME_KEY } from '../src/lib/preferences'

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const run = () => new Function(read('public/theme-init.js'))()

/* The same way tests/storage.test.ts blocks storage: every access throws. */
const realStorage = Object.getOwnPropertyDescriptor(window, 'localStorage')
function blockStorage() {
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    get() {
      throw new DOMException('The operation is insecure.', 'SecurityError')
    },
  })
}

afterEach(() => {
  if (realStorage) Object.defineProperty(window, 'localStorage', realStorage)
  vi.restoreAllMocks()
  window.localStorage.clear()
  delete document.documentElement.dataset.theme
})

describe('theme-init.js', () => {
  it('reads the key the app writes', () => {
    expect(read('public/theme-init.js')).toContain(`getItem('${THEME_KEY}')`)
  })
  it('applies a stored theme', () => {
    window.localStorage.setItem(THEME_KEY, 'dark')
    run()
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
  it('leaves the system theme alone when nothing valid is stored', () => {
    window.localStorage.setItem(THEME_KEY, 'sepia')
    run()
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })
  it('does not throw when storage is blocked', () => {
    blockStorage()
    expect(run).not.toThrow()
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })
  it('is loaded before the app', () => {
    const html = read('index.html')
    expect(html.indexOf('/theme-init.js')).toBeGreaterThan(-1)
    expect(html.indexOf('/theme-init.js')).toBeLessThan(html.indexOf('/src/main.tsx'))
  })
})
```

- [ ] **Step 2:** Run `npx vitest run tests/theme-init.test.ts`. Expected: FAIL (file missing).
- [ ] **Step 3:** Write `public/theme-init.js`: an IIFE that reads `window.localStorage.getItem('theme')` inside `try`/`catch` and, only for `'light'` or `'dark'`, sets `document.documentElement.dataset.theme`. Add the script tag and the header rule.
- [ ] **Step 4:** Run the test. Expected: PASS.
- [ ] **Step 5:** Browser check on `npm run serve:dist`: choose the theme opposite to the system's, reload with the network throttled to "Slow 4G" — the first paint is already the chosen theme.
- [ ] **Step 6:** Closing checklist (large sitemap diff expected), then commit: `Apply the saved theme before the first paint`

### Task 10: Remember the reader's text size — Owner approval (policy wording)

**Branch:** `feat/remember-text-size` · **Finding:** UX-4

**Files:**
- Modify: `src/lib/preferences.ts`, `src/components/reader/index.tsx` (constants at lines 99–101, `useState(1)` at line 254, the two handlers at lines 437 and 453), `src/content.ts` (the cookie notice text at lines 517 and 760; the cookie policy sentences at lines 536 and 779 and any other sentence in `cookiePolicy` that enumerates stored items)
- Create: `tests/font-scale.test.ts`

**Interfaces:**
- Produces, in `src/lib/preferences.ts`:

```ts
export const FONT_SCALE_KEY = 'reader-font-scale'
export const FONT_SCALE_MIN = 0.85
export const FONT_SCALE_MAX = 1.5
export const FONT_SCALE_STEP = 0.125
/** 1 when nothing usable is stored; otherwise the stored value clamped to [MIN, MAX]. */
export function readStoredFontScale(): number
/** Stores the scale; removes the key at exactly 1, so the default leaves nothing behind. */
export function writeStoredFontScale(scale: number): void
```

- [ ] **Step 1: Write the failing test**

```ts
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FONT_SCALE_KEY, readStoredFontScale, writeStoredFontScale } from '../src/lib/preferences'

const realStorage = Object.getOwnPropertyDescriptor(window, 'localStorage')
function blockStorage() {
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    get() {
      throw new DOMException('The operation is insecure.', 'SecurityError')
    },
  })
}

afterEach(() => {
  if (realStorage) Object.defineProperty(window, 'localStorage', realStorage)
  vi.restoreAllMocks()
  window.localStorage.clear()
})

describe('stored reader text size', () => {
  it('defaults to 1', () => expect(readStoredFontScale()).toBe(1))
  it('reads a stored step', () => {
    window.localStorage.setItem(FONT_SCALE_KEY, '1.25')
    expect(readStoredFontScale()).toBe(1.25)
  })
  it('falls back to 1 on a value that is not a number', () => {
    window.localStorage.setItem(FONT_SCALE_KEY, 'large')
    expect(readStoredFontScale()).toBe(1)
  })
  it('clamps to the control range', () => {
    window.localStorage.setItem(FONT_SCALE_KEY, '9')
    expect(readStoredFontScale()).toBe(1.5)
    window.localStorage.setItem(FONT_SCALE_KEY, '0.1')
    expect(readStoredFontScale()).toBe(0.85)
  })
  it('stores a chosen size and forgets the default', () => {
    writeStoredFontScale(1.375)
    expect(window.localStorage.getItem(FONT_SCALE_KEY)).toBe('1.375')
    writeStoredFontScale(1)
    expect(window.localStorage.getItem(FONT_SCALE_KEY)).toBeNull()
  })
  it('does not throw when storage is blocked', () => {
    blockStorage()
    expect(readStoredFontScale()).toBe(1)
    expect(() => writeStoredFontScale(1.25)).not.toThrow()
  })
})
```

- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement on top of `readStoredValue` / `writeStoredValue` / `removeStoredValue` from `src/lib/storage.ts`. In the reader: delete the three local constants, import them, `useState(readStoredFontScale)`, and call `writeStoredFontScale(next)` in each handler.
- [ ] **Step 4:** Update the disclosure in both languages — the notice now names language, theme **and text size**; the policy says **three** functional items and names the third ("the text size you chose in the article reader" / "yazı okuyucusunda seçtiğiniz yazı boyutu"). Grep `docs/` for the same enumeration and update it. Show the owner the four changed sentences before committing.
- [ ] **Step 5:** Run the tests. Expected: PASS.
- [ ] **Step 6:** Browser check: enlarge on one article, open another, reload — the size holds; `A−` back to 100% removes the key.
- [ ] **Step 7:** Closing checklist, then commit: `Remember the reader's text size between articles`

### Task 11: Reload once on a replaced script

**Branch:** `fix/stale-chunk-reload` · **Finding:** ENG-2

**Files:**
- Create: `src/lib/chunkReload.ts`, `tests/chunk-reload.test.ts`
- Modify: `src/main.tsx` (call `installStaleChunkReload()` before `createRoot`)

**Interfaces:**

```ts
export const CHUNK_RELOAD_KEY = 'chunk-reload-at'
/** True when a failed script load should trigger a full reload: never reloaded
 *  this session, or the last reload was more than a minute ago. */
export function shouldReloadForStaleChunk(now: number, lastReloadAt: string | null): boolean
/** Listens for Vite's `vite:preloadError`; when allowed, records the time in
 *  sessionStorage, calls event.preventDefault() and location.reload(). */
export function installStaleChunkReload(): void
```

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest'
import { shouldReloadForStaleChunk } from '../src/lib/chunkReload'

describe('shouldReloadForStaleChunk', () => {
  const now = 1_800_000_000_000
  it('reloads the first time', () => expect(shouldReloadForStaleChunk(now, null)).toBe(true))
  it('reloads again after a minute', () =>
    expect(shouldReloadForStaleChunk(now, String(now - 61_000))).toBe(true))
  /* A chunk that is really gone must not loop: the second failure falls
     through to the error screen. */
  it('does not reload twice in a row', () =>
    expect(shouldReloadForStaleChunk(now, String(now - 5_000))).toBe(false))
  it('treats an unreadable timestamp as never', () =>
    expect(shouldReloadForStaleChunk(now, 'x')).toBe(true))
})
```

- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement both functions; guard every `sessionStorage` access with `try`/`catch`.
- [ ] **Step 4:** Run the test. Expected: PASS.
- [ ] **Step 5:** Manual check: `npm run build && npm run serve:dist`, open `/tr`, delete `dist/assets/archive-tr-*.js`, click "Köşe Yazıları". Expected: one reload, then the existing "Arşiv yüklenemedi" screen — no loop.
- [ ] **Step 6:** Closing checklist, then commit: `Reload once when a page asks for a script an update has replaced`

### Task 12: Survive Google Translate

**Branch:** `fix/google-translate` · **Finding:** UX-12

**Files:**
- Create: `src/lib/translateGuard.ts`, `tests/translate-guard.test.ts`
- Modify: every `.tsx` under `src/` containing a `material-symbols-outlined` span (29 at the time of the audit — `grep -rn "material-symbols-outlined" src --include="*.tsx"`), `src/components/Header.tsx` (`.wordmark` and `.lang-toggle`), `src/main.tsx`, `scripts/validate-content.mjs` (next to the existing icon check at line 426)

**Interfaces:**

```ts
/** Lets React survive a translator that wraps text nodes in <font> elements:
 *  removeChild and insertBefore return quietly, instead of throwing
 *  NotFoundError, when the node is no longer where React left it. Idempotent. */
export function installTranslateGuard(): void
```

Algorithm (the signature does not determine it): wrap `Node.prototype.removeChild` so that `child.parentNode !== this` returns `child`; wrap `Node.prototype.insertBefore` so that a `referenceNode` whose `parentNode !== this` returns `newNode`; otherwise delegate to the original. Mark the prototype so a second call does nothing.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest'
import { installTranslateGuard } from '../src/lib/translateGuard'

describe('installTranslateGuard', () => {
  installTranslateGuard()
  installTranslateGuard()

  it('ignores removal of a node that was moved away', () => {
    const parent = document.createElement('div')
    const stray = document.createElement('span')
    expect(() => parent.removeChild(stray)).not.toThrow()
    expect(parent.removeChild(stray)).toBe(stray)
  })
  it('ignores an insert before a node that was moved away', () => {
    const parent = document.createElement('div')
    const stray = document.createElement('span')
    expect(() => parent.insertBefore(document.createElement('b'), stray)).not.toThrow()
  })
  it('still removes and inserts real children', () => {
    const parent = document.createElement('div')
    const first = parent.appendChild(document.createElement('i'))
    const added = parent.insertBefore(document.createElement('b'), first)
    expect(parent.firstChild).toBe(added)
    parent.removeChild(first)
    expect(parent.childNodes).toHaveLength(1)
  })
})
```

- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement; call `installTranslateGuard()` first thing in `src/main.tsx`.
- [ ] **Step 4:** Add `translate="no"` to every icon span, to the wordmark link and to the language toggle. The icon check's regex (`material-symbols-outlined[^>]*>`) still matches a span with an extra attribute.
- [ ] **Step 5:** In `scripts/validate-content.mjs`, fail when any `<span … material-symbols-outlined …>` opening tag in `src/**/*.tsx` lacks `translate="no"`, naming the file. Run `npm run validate:content`. Expected: PASS.
- [ ] **Step 6:** Browser check with Chrome's built-in translation (Turkish page → English, and English page → German): icons stay icons; opening a newspaper, paging, opening a book dialog and switching language do not blank the page. Ask the owner which page they saw break and repeat there.
- [ ] **Step 7:** Closing checklist, then commit: `Keep the icons and the page intact under Google Translate`

---

## Phase 4 — Performance

### Task 13: Right-sized images

**Branch:** `perf/image-variants` · **Finding:** PERF-3 · **Depends on:** Task 1

**Files:**
- Create: `scripts/generate-image-variants.sh`, `src/assets/originals/` (the current `portrait.jpg`, `covers/*.jpg`, `logos/*.webp`, moved with `git mv`), `src/assets/portrait.webp`, `src/assets/portrait-avatar.webp`, `src/assets/covers/*.webp`, `tests/assets-budget.test.ts`
- Modify: `src/components/AuthorAvatar.tsx`, `src/App.tsx` (the hero `<img>`, lines 95–112, and the cover `<img>` in `BooksPage`), `src/content.ts` (cover imports and the `Book.cover` type), `src/components/reader/index.tsx` (lead photo at line 529), `scripts/generate-og-image.py` (if it reads `src/assets/portrait.jpg`)

**Interfaces:**
- `Book.cover` becomes `{ src: string; width: number; height: number }` (was `string`), so the `<img>` carries its intrinsic size.
- `AuthorAvatar.tsx` exports `PORTRAIT` (hero, `portrait.webp`, 960×1200) and uses a module-private `portrait-avatar.webp` (192×240) for the avatar.
- Produces `sh scripts/generate-image-variants.sh` — regenerates every variant from `src/assets/originals/` with `cwebp`: portrait at quality 82; avatar `-resize 192 0` at 80; each cover `-resize 288 0` at 80; each logo wider than 480px `-resize 480 0` at 85, narrower ones copied.

- [ ] **Step 1: Write the failing test**

```ts
import { readdirSync, statSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const assets = new URL('../src/assets/', import.meta.url)
const kb = (path: string) => statSync(new URL(path, assets)).size / 1024

describe('image budgets', () => {
  /* The 262 kB portrait was downloaded on every article to draw a 40px avatar. */
  it('keeps the avatar small', () => expect(kb('portrait-avatar.webp')).toBeLessThan(15))
  it('keeps the hero portrait under 140 kB', () => expect(kb('portrait.webp')).toBeLessThan(140))
  it('keeps every cover under 30 kB', () => {
    const covers = readdirSync(new URL('covers/', assets)).filter((name) => name.endsWith('.webp'))
    expect(covers).toHaveLength(8)
    for (const name of covers) expect(kb(`covers/${name}`), name).toBeLessThan(30)
  })
  /* The largest masthead that is already narrower than 480px (Sabah) is 46 kB. */
  it('keeps every masthead under 50 kB', () => {
    for (const name of readdirSync(new URL('logos/', assets))) expect(kb(`logos/${name}`), name).toBeLessThan(50)
  })
})
```

- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** `grep -rn "portrait.jpg\|covers/\|logos/" scripts src` to find every reader of the files; then `git mv` the sources into `src/assets/originals/`, write the script, run it, and commit the outputs.
- [ ] **Step 4:** Point the imports at the `.webp` files; give the hero, avatar and cover `<img>`s `width` and `height`; set `loading="eager"` and `fetchPriority="high"` on the reader's first lead photo only.
- [ ] **Step 5:** Run the test. Expected: PASS.
- [ ] **Step 6:** `npm run audit:ui -- --only article` and `--only books`. Expected: `imgKb` on `tr-m-light-books` ≤ 160 (was 665); the article page no longer requests `portrait-*.jpg`.
- [ ] **Step 7:** Browser check, both themes: hero portrait, the 88px avatar on About/Trial/Press, the 40px byline avatar, all eight covers and the newsstand mastheads are sharp on a 2× display.
- [ ] **Step 8:** Closing checklist, then commit: `Serve right-sized images for the portrait, avatar, book covers and mastheads`

### Task 14: Turkish letters in the main font file — Owner approval (downloads)

**Branch:** `perf/font-subset` · **Finding:** PERF-4 · **Depends on:** Task 1

**Files:**
- Modify: `scripts/generate-fonts.py` (`LATIN`, `LATIN_EXT` at lines 46–55), `src/fonts.css` (the `unicode-range` of all six text faces, every text-face `url()`, the header comment), `index.html` (the two preload `href`s), `public/fonts/*.woff2` (the six text files, regenerated)
- Create: `tests/fonts-coverage.test.ts`

**Interfaces:**
- `LATIN` gains `U+011E-011F,U+0130,U+015E-015F` (Ğ ğ İ Ş ş; `U+0131` ı is already there).
- `LATIN_EXT`: `U+0100-02BA` becomes `U+0100-011D,U+0120-012F,U+0132-015D,U+0160-02BA`, so the later-declared face no longer claims those letters.
- Every text-face URL and both preloads gain `?v=2`. The files are cached `immutable` for a year under their old content; without a new address a returning reader would keep a `latin` file that has no Ş.

- [ ] **Step 1: Write the failing test**

```ts
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const css = read('src/fonts.css')
const faces = [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((match) => match[1]!)
const face = (file: string) => faces.find((block) => block.includes(file))!
const covers = (block: string, char: string) => {
  const cp = char.codePointAt(0)!
  const range = /unicode-range:\s*([^;]+);/.exec(block)![1]!
  return range.split(',').some((part) => {
    const [from, to] = part.trim().replace('U+', '').split('-')
    return cp >= parseInt(from!, 16) && cp <= parseInt(to ?? from!, 16)
  })
}

describe('font slices', () => {
  /* Every page draws "Şahin Alpay", so a split that left Ş in the second file
     made every page download both. */
  it.each([...'ğĞıİşŞçÇöÖüÜâîû'])('draws %s from the main file', (char) => {
    for (const stem of ['literata', 'literata-italic', 'nunito-sans']) {
      expect(covers(face(`${stem}-latin.woff2`), char)).toBe(true)
      expect(covers(face(`${stem}-latin-ext.woff2`), char)).toBe(false)
    }
  })
  it('preloads exactly the addresses the stylesheet uses', () => {
    const preloads = [...read('index.html').matchAll(/href="(\/fonts\/[^"]+)"/g)].map((m) => m[1]!)
    expect(preloads.length).toBe(2)
    for (const href of preloads) expect(css).toContain(`url('${href}')`)
  })
})
```

- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Ask the owner for permission to download the four upstream fonts named in the header of `scripts/generate-fonts.py` (Literata, Literata Italic, Nunito Sans, Material Symbols — from `github.com/google/fonts` and `github.com/google/material-design-icons`) and to `pip install 'fonttools[woff]' brotli`. Do not proceed without it.
- [ ] **Step 4:** Edit the two constants, run `python3 scripts/generate-fonts.py --src /tmp/fonts`, then restore the icon font untouched: `git checkout -- public/fonts/material-symbols.woff2 public/fonts/icons.json`.
- [ ] **Step 5:** Edit `src/fonts.css` (ranges, `?v=2`, and replace the "an English page never downloads the Turkish glyphs" paragraph with why the Turkish letters live in the main file) and the two preloads.
- [ ] **Step 6:** Run the test. Expected: PASS.
- [ ] **Step 7:** `npm run audit:ui -- --only -home`. Expected: `fonts` lists three files on Turkish and English home (`literata-latin`, `nunito-sans-latin`, `material-symbols`) — was five.
- [ ] **Step 8:** Browser check: Ş, ğ, ı, İ render in Literata and Nunito (not a fallback face) in headings, body, italics and the wordmark, both languages.
- [ ] **Step 9:** Closing checklist, then commit: `Load Turkish letters with the main font file instead of a second download`

### Task 15: Bundle budget

**Branch:** `chore/bundle-budget` · **Finding:** ENG-3

**Files:**
- Create: `scripts/lib/bundle-budget.mjs`, `scripts/check-bundle-budget.mjs`, `scripts/bundle-budget.json`, `tests/bundle-budget.test.ts`
- Modify: `package.json` (`"check:bundle": "node scripts/check-bundle-budget.mjs"`), `.github/workflows/ci.yml` (a step `npm run check:bundle` directly after "Build")

**Interfaces:**

```js
// scripts/lib/bundle-budget.mjs
/** The scripts a first visit downloads: the entry module and every
 *  modulepreload, as paths relative to dist/. */
export function initialScripts(indexHtml)        // → string[]
/** gzip size in kB, one decimal (zlib.gzipSync, level 9). */
export function gzipKb(buffer)                   // → number
```

- `scripts/bundle-budget.json`: `{ "entryGzipKb": 190, "initialJsGzipKb": 325 }` — today's sizes (181 and ≈310) plus headroom. Tasks 16, 17 and 18 lower it.
- CLI prints one row per file with its gzip size, the two totals against their limits, and exits 1 when either is exceeded.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest'
import { gzipKb, initialScripts } from '../scripts/lib/bundle-budget.mjs'

const html = `<head>
<script type="module" crossorigin src="/assets/index-AAAAAAAA.js"></script>
<link rel="modulepreload" crossorigin href="/assets/vendor-BBBBBBBB.js">
<link rel="stylesheet" crossorigin href="/assets/index-CCCCCCCC.css">
<link rel="modulepreload" crossorigin href="/assets/motion-DDDDDDDD.js">
</head>`

describe('bundle budget', () => {
  it('finds the entry and its preloaded modules, not the stylesheet', () => {
    expect(initialScripts(html)).toEqual([
      'assets/index-AAAAAAAA.js',
      'assets/vendor-BBBBBBBB.js',
      'assets/motion-DDDDDDDD.js',
    ])
  })
  it('measures gzip size in kB', () => {
    expect(gzipKb(Buffer.alloc(1024 * 100))).toBeLessThan(1)
    expect(gzipKb(Buffer.from('a'))).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement the library, the CLI and the CI step.
- [ ] **Step 4:** Run the test, then `npm run build && npm run check:bundle`. Expected: both pass; the CLI reports entry ≈ 181 kB.
- [ ] **Step 5:** Closing checklist, then commit: `Fail the build when the first-load script grows past its budget`

### Task 16: One chunk per page

**Branch:** `perf/route-splitting` · **Finding:** PERF-2 · **Depends on:** Tasks 2, 3, 15

**Files:**
- Create: `src/pages/HomePage.tsx`, `src/pages/AboutPage.tsx`, `src/pages/BooksPage.tsx`, `src/pages/TrialProcessPage.tsx`, `src/pages/CookiePolicyPage.tsx`, `src/pages/ArchiveRoutePage.tsx`, `src/pages/NotFound.tsx`, `src/pages/NarrativeBody.tsx`, `src/components/PageLoading.tsx`, `tmp/compare-prerender.mjs` (scratch, not committed)
- Modify: `src/App.tsx` (becomes the shell: `Header`, `MainShell` with the route table, `Footer`, `CookieConsent`), `scripts/bundle-budget.json`, `tests/routes-smoke.test.tsx`

**Interfaces:**
- Each new page module default-exports its component with today's props. `NarrativeBody` (today `App.tsx:409`) is shared by About and Trial.
- Eager: `HomePage` (the default landing — no extra request hop). Lazy via `React.lazy`: every other page, plus `components/reader` (`ArticlePage`, `LoadedArticlePage`), `components/press` (`PressPage`, `PressArticlePage`) and `components/PhotoStoryPage`. For a named export: `lazy(() => import('./components/press').then((m) => ({ default: m.PressPage })))`.
- `PageLoading({ lang })` renders the same markup as `ArchiveLoading` (`role="status"`, "Yükleniyor…" / "Loading…") and is the `<Suspense>` fallback **inside** `<main id="main-content">`, so Task 3's floor keeps the footer still.
- `MainShell`'s scroll-and-focus effect stays keyed on `location.pathname`, unchanged.
- This task moves code; it must not change one byte of prerendered HTML.

- [ ] **Step 1:** On `main`, before any change: `npm run build && rm -rf tmp/dist-before && cp -R dist tmp/dist-before`.
- [ ] **Step 2:** Write `tmp/compare-prerender.mjs`: walk every `*.html` under `tmp/dist-before`, read its twin under `dist`, normalise both by replacing `/assets/<name>-<8 chars>.(js|css)` with `/assets/<name>.$2` and dropping `<link rel="modulepreload" …>` and `<script type="module" …></script>` tags, print each path that differs, exit 1 if any does.
- [ ] **Step 3:** Move the page components out of `src/App.tsx` one at a time, running `npx tsc -b` after each. Delete `AppV1`; `App` returns the fragment directly.
- [ ] **Step 4:** Wrap `<Routes>` in `<Suspense fallback={<PageLoading lang={langForPath(location.pathname)} />}>` and switch the imports to `lazy`.
- [ ] **Step 5:** Run `npx vitest run tests/routes-smoke.test.tsx`. Expected: PASS, unchanged.
- [ ] **Step 6:** Create `tests/lazy-route-failure.test.tsx` — its own file, because `React.lazy` remembers a module once any earlier test has loaded it:

```tsx
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ErrorBoundary } from '../src/components/ErrorBoundary'

afterEach(() => {
  vi.restoreAllMocks()
  vi.doUnmock('../src/pages/BooksPage')
  window.history.pushState({}, '', '/')
})

describe('a page whose code cannot be loaded', () => {
  /* Offline, or a deploy replaced the file: the reader must get a way back,
     never a blank page. */
  it('shows the recovery screen', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.resetModules()
    vi.doMock('../src/pages/BooksPage', () => {
      throw new Error('chunk gone')
    })
    const { default: App } = await import('../src/App')
    // The boundary reads its language from the address bar.
    window.history.pushState({}, '', '/tr/kitaplar')
    render(
      <ErrorBoundary>
        <MemoryRouter initialEntries={['/tr/kitaplar']}>
          <App />
        </MemoryRouter>
      </ErrorBoundary>,
    )
    expect(await screen.findByText('Sayfayı yenile')).toBeTruthy()
  })
})
```

Run: `npx vitest run tests/lazy-route-failure.test.tsx`. Expected: PASS.
- [ ] **Step 7:** `npm run build && node tmp/compare-prerender.mjs`. Expected: "prerendered HTML identical".
- [ ] **Step 8:** Lower `scripts/bundle-budget.json` to `{ "entryGzipKb": 120, "initialJsGzipKb": 255 }`; `npm run check:bundle`. Expected: PASS. If the entry is still above 120 kB, find what it holds with `grep -c` for a distinctive string from `src/press/turkish.ts` and `src/photoStory.ts` in `dist/assets/index-*.js` — neither may appear.
- [ ] **Step 9:** `npm run audit:ui -- --only -d-light-`. Expected: `jsKb` on home falls from 942; `clsLoad` stays ≤ 0.02 everywhere.
- [ ] **Step 10:** Browser check, both languages: every nav item, an article, a press piece, the photo page, back and forward, and a hard reload on each.
- [ ] **Step 11:** Closing checklist, then commit: `Load each page's code only when that page is opened`

### Task 17: Heavy text out of `content.ts`

**Branch:** `perf/content-diet` · **Finding:** PERF-2 · **Depends on:** Tasks 13, 16

**Files:**
- Create: `src/trialCopy.ts`, `src/bookExtras.ts`
- Modify: `src/content.ts` (drop the imports of `./trialProcess`, `./bookForewords`, `./bookPress`; `Content.trialProcess` loses `sections`; `Book` loses `forewords`, `press`, `translation`), `src/pages/TrialProcessPage.tsx`, `src/pages/BooksPage.tsx`, `scripts/prerender.mjs` (the trial branch at line 345 and the books branch at line 315), `scripts/verify-prerender.mjs` (if it reads either field), `scripts/bundle-budget.json`, `tests/books-consistency.test.ts`

**Interfaces:**

```ts
// src/trialCopy.ts — imported only by TrialProcessPage and the prerender script
export const trialSections: Record<Lang, TrialProcessSection[]>
//   tr: trialProcessSections from ./trialProcess
//   en: the short English sections that are in content.ts today, moved verbatim

// src/bookExtras.ts — imported only by BooksPage and the prerender script
export interface BookExtras {
  forewords?: BookForeword[]
  press?: BookPressItem[]
  translation?: BookTranslation
}
/** Keyed by Book.title. */
export const bookExtras: Record<string, BookExtras>
```

- Why: `content.ts` is imported by the header and footer, so everything it imports is in the entry chunk — 148 kB of trial record and 64 kB of forewords today.
- `scripts/prerender.mjs` loads the two new modules with its existing `loadModule(…)` helper and must produce the same HTML as before.

- [ ] **Step 1:** Refresh the baseline on the Task 16 result: `npm run build && rm -rf tmp/dist-before && cp -R dist tmp/dist-before`.
- [ ] **Step 2: Add the failing test** to `tests/books-consistency.test.ts`:

```ts
it('attaches forewords and translations only to books that exist', async () => {
  const { bookExtras } = await import('../src/bookExtras')
  expect(Object.keys(bookExtras).length).toBeGreaterThan(0)
  for (const title of Object.keys(bookExtras)) expect(listed.has(norm(title)), title).toBe(true)
})
```

- [ ] **Step 3:** Run it. Expected: FAIL (module missing).
- [ ] **Step 4:** Move the data, update the two pages and the prerender script.
- [ ] **Step 5:** Run `npm test`. Expected: PASS, including the route smoke tests.
- [ ] **Step 6:** `npm run build && node tmp/compare-prerender.mjs`. Expected: "prerendered HTML identical".
- [ ] **Step 7:** Lower the budget to `{ "entryGzipKb": 60, "initialJsGzipKb": 195 }`; `npm run check:bundle`. Expected: PASS.
- [ ] **Step 8:** Browser check: `/tr/yargilanma-surecim` (jump menu, a deep section, the PDF buttons), `/trial-process`, `/tr/kitaplar` (every foreword, the press dialog, the English translation dialog and its PDF link).
- [ ] **Step 9:** Closing checklist, then commit: `Keep the trial record and the forewords out of the first download`

### Task 18: CSS animation instead of the `motion` library — Owner approval

**Branch:** `perf/css-motion` · **Finding:** PERF-5 · **Depends on:** Tasks 2, 15, 16

**Files:**
- Create: `src/lib/useReducedMotion.ts`, `src/lib/useInView.ts`, `tests/reveal.test.tsx`
- Modify: `src/components/Reveal.tsx`, `src/pages/HomePage.tsx` (the two hero `motion.div`s), `src/components/CookieConsent.tsx`, `src/components/Footer.tsx`, `src/components/archive/index.tsx` (the `AnimatePresence` block at line 1080), every other importer of `motion/react` (`grep -rn "motion/react" src`), `src/index.css`, `package.json` + `package-lock.json` (`npm uninstall motion`), `vite.config.ts` (the `motion` chunk group), `scripts/bundle-budget.json`, `README.md`, `CLAUDE.md`, `DESIGN.md` (each says animation goes through `motion`)

**Interfaces:**

```ts
// src/lib/useReducedMotion.ts
export function useReducedMotion(): boolean          // live matchMedia('(prefers-reduced-motion: reduce)')
// src/lib/useInView.ts
/** True once the element has entered the viewport, and from the first render
 *  where IntersectionObserver does not exist. */
export function useInView<T extends Element>(rootMargin?: string): [RefObject<T | null>, boolean]
// src/components/Reveal.tsx — same props as today, except `style?: CSSProperties`
```

- `Reveal` renders `<Tag className="reveal …" data-inview={inView} style={{ '--reveal-delay': `${delay}s`, …style }}>`, observing with `rootMargin: '-60px'`.
- CSS, with today's timings and the `--ease-out` curve:

```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.55s var(--ease-out), transform 0.55s var(--ease-out);
  transition-delay: var(--reveal-delay, 0s);
}
.reveal[data-inview='true'] {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

- Hero: two `@keyframes` (`translateY(20px)` over 0.7 s; `scale(0.97)` over 0.8 s with a 0.1 s delay), both `animation-fill-mode: both`. Cookie notice: `translateY(24px)` over 0.25 s. The archive view swap keeps a 0.25 s fade-in and drops the exit animation. All three are `animation: none` under reduced motion.

- [ ] **Step 1: Write the failing test**

```tsx
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, render } from '@testing-library/react'
import { Reveal } from '../src/components/Reveal'

afterEach(() => vi.unstubAllGlobals())

describe('Reveal', () => {
  it('shows its content at once where IntersectionObserver does not exist', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    const { container } = render(<Reveal>metin</Reveal>)
    expect(container.firstElementChild!.getAttribute('data-inview')).toBe('true')
    expect(container.textContent).toBe('metin')
  })
  it('reveals when the element enters the viewport', () => {
    let enter = (_entries: { isIntersecting: boolean }[]) => {}
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: typeof enter) {
          enter = callback
        }
        observe() {}
        disconnect() {}
      },
    )
    const { container } = render(<Reveal>metin</Reveal>)
    expect(container.firstElementChild!.getAttribute('data-inview')).toBe('false')
    act(() => enter([{ isIntersecting: true }]))
    expect(container.firstElementChild!.getAttribute('data-inview')).toBe('true')
  })
  it('keeps the tag, class and id it is given', () => {
    const { container } = render(
      <Reveal as="section" className="prose" id="x">
        metin
      </Reveal>,
    )
    const element = container.firstElementChild!
    expect(element.tagName).toBe('SECTION')
    expect(element.classList.contains('prose')).toBe(true)
    expect(element.id).toBe('x')
  })
})
```

Add to `tests/layout-guards.test.ts`:

```ts
it('shows revealed content without animation under reduced motion', () => {
  expect(css).toMatch(
    /prefers-reduced-motion: reduce\)\s*\{\s*\.reveal\s*\{[^}]*opacity:\s*1;[^}]*transition:\s*none/,
  )
})
```

- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement the two hooks and the new `Reveal`; convert the hero, cookie notice, footer and archive swap; `npm uninstall motion`; remove the `motion` group from `vite.config.ts`.
- [ ] **Step 4:** Run `npm test`. Expected: PASS. `grep -rn "motion/react" src` prints nothing; `ls dist/assets | grep motion` prints nothing after a build.
- [ ] **Step 5:** Lower the budget to `{ "entryGzipKb": 60, "initialJsGzipKb": 150 }`; `npm run check:bundle`. Expected: PASS.
- [ ] **Step 6:** Update the three documents: animation is CSS, gated by `prefers-reduced-motion` and `useReducedMotion` from `src/lib`.
- [ ] **Step 7:** Browser check, both themes: hero entrance, sections revealing on scroll, the cookie band on a first visit, switching newspapers. Repeat with the system "Reduce motion" setting on — everything is visible immediately and nothing moves.
- [ ] **Step 8:** Closing checklist, then commit: `Animate with CSS so the animation library no longer ships`

---

## Phase 5 — Reading and search

### Task 19: Print stylesheet

**Branch:** `feat/print-styles` · **Finding:** A11Y-7 · **Depends on:** Task 1

**Files:**
- Modify: `src/index.css` (a final `@media print` block), `src/components/reader/index.tsx` (a print-only source line after the body), `tests/layout-guards.test.ts`

**Interfaces:**
- `.print-only` is `display: none` on screen and `display: block` in print.
- In print: hidden — `.site-header`, `.site-footer`, `.cookie-notice`, `.skip-link`, `.breadcrumb`, `.article-tools`, `.reading-progress`, `.back-to-top`, `.bio-contents`, `.tag-list`, `.clipping-open-hint`, `.mobile-nav`, `.mobile-nav-backdrop`. Forced visible — `.reveal` and any element with an inline `opacity` (`[style*='opacity']`): `opacity: 1 !important; transform: none !important`. Colours — black on white whatever the theme (the overrides must also beat `:root[data-theme='dark']` and the `prefers-color-scheme: dark` block). Layout — `.container` and `.container-narrow` lose their max width and padding; headings `break-after: avoid`; figures and images `break-inside: avoid`.
- The reader prints `{lang === 'tr' ? 'Kaynak' : 'Source'}: {articleUrl}` in a `<p className="print-only article-print-source">`.

- [ ] **Step 1: Add the failing test**

```ts
it('has a print stylesheet that drops the site chrome', () => {
  const print = css.slice(css.lastIndexOf('@media print'))
  expect(css).toContain('@media print')
  for (const selector of ['.site-header', '.site-footer', '.cookie-notice', '.article-tools'])
    expect(print).toContain(selector)
})
```

- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Write the block and the reader line.
- [ ] **Step 4:** Run the test. Expected: PASS.
- [ ] **Step 5:** `npm run audit:ui -- --only reader --media print --shots`, once with `--scheme light` and once with `--scheme dark`. Expected in both PNGs: no header, menu, buttons or footer; black text on white; the title, byline, photo, full body and the source address.
- [ ] **Step 6:** Print preview in the browser for a text article, a scanned clipping and the trial page.
- [ ] **Step 7:** Closing checklist, then commit: `Print an article as clean text with its address`

### Task 20: One list of search results — Owner approval

**Branch:** `feat/unified-search-results` · **Finding:** UX-1

**Files:**
- Modify: `src/components/archive/index.tsx` (`NewsstandArchivePage` at line 944)
- Create: `tests/columns-search.test.tsx`

**Interfaces:**
- In `NewsstandArchivePage`: `const filtering = search.trim() !== '' || fromYear !== '' || toYear !== ''`.
- When `filtering` and something matches, render — instead of `NewsstandStack` — a flat list: `sortByDate(newsstandOutlets.flatMap((entry) => entry.matchingItems.map((item) => ({ item, outlet: entry.outlet.outlet }))), (row) => row.item.date, 'newest')`, cut with `pageSlice`, each row an `<ArchiveRow item={…} outlet={…} lang={lang} />`, followed by the existing `<Pagination>`. `currentPage` and `totalPages` come from this list's length in this mode.
- Not filtering: the newsstand, exactly as today.
- Nothing matches: "Aramayla eşleşen yazı yok." / "No pieces match this search." (replaces the "newspapers" wording).
- The count line and the filter chips above are unchanged.

- [ ] **Step 1: Write the failing test.** Read `OutletGroup` and `OutletArchiveSection` in `src/archive/types.ts` for the exact shape, then:

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NewsstandArchivePage } from '../src/components/archive'
import { content } from '../src/content'
import { makeItem } from './helpers'

const outlet = (name: string, titles: string[]) => ({
  outlet: name,
  items: titles.map((title, i) =>
    makeItem({ title, date: `${i + 1} Ocak 2010`, url: `https://example.org/${name}-${i}` }, { outlet: name, outletKey: name.toLowerCase() }),
  ),
})

function open(query: string) {
  render(
    <MemoryRouter initialEntries={[`/tr/kose-yazilari${query}`]}>
      <NewsstandArchivePage
        lang="tr"
        data={{ ...content.tr.columns, outlets: [outlet('Zaman', ['Ermeni sorunu', 'Seçim sistemi'])] }}
        foreignOutlets={[outlet('Todays', ['Ermeni açılımı'])]}
      />
    </MemoryRouter>,
  )
}

describe('columns search', () => {
  /* "19 yazı" used to list one: the rest sat behind the other newspapers. */
  it('lists matches from every newspaper together', async () => {
    open('?q=ermeni')
    expect(await screen.findByText('Ermeni sorunu')).toBeTruthy()
    expect(screen.getByText('Ermeni açılımı')).toBeTruthy()
    expect(screen.queryByText('Seçim sistemi')).toBeNull()
    expect(document.querySelector('.newsstand-stack-paper')).toBeNull()
  })
  it('keeps the newsstand when nothing is being searched', async () => {
    open('')
    expect(await screen.findByText('Seçim sistemi')).toBeTruthy()
    expect(document.querySelector('.newsstand-stack-paper')).not.toBeNull()
  })
})
```

`OutletGroup` is `{ outlet: string; medium?: ArchiveMedium; items: ArchiveItem[] }`; `.newsstand-stack-paper` is the button each newspaper renders as (line 600).

- [ ] **Step 2:** Run it. Expected: the first test FAILS.
- [ ] **Step 3:** Implement the branch.
- [ ] **Step 4:** Run the test and `npx vitest run tests/pagination.test.ts tests/text-search.test.ts`. Expected: PASS.
- [ ] **Step 5:** Browser check, both languages, phone and desktop: `/tr/kose-yazilari?q=ermeni` lists all 19 with outlet and date on each row; paging works; clearing the search restores the newsstand; a year range alone also lists; the home page search lands on this list.
- [ ] **Step 6:** Closing checklist, then commit: `List search results from every newspaper together`

### Task 21: Article page polish

**Branch:** `fix/reader-polish` · **Finding:** UX-7 · **Depends on:** Task 20 (for the tag links)

**Files:**
- Create: `src/components/reader/dropCap.ts`, `tests/drop-cap.test.ts`
- Modify: `src/components/reader/index.tsx`, `src/components/ImageLightbox.tsx` (or wherever the caption is composed — `grep -n "caption" src/components/reader/index.tsx src/components/ImageLightbox.tsx`), `src/index.css` (`.tag` at line 3620, `.clipping-open-hint` at line 3818, `.breadcrumb`, the clipping figure's width)

**Interfaces:**

```ts
// src/components/reader/dropCap.ts
/** True when the opening paragraph should not get a drop cap: missing, shorter
 *  than 60 characters, or not starting with a letter (a year, a quotation mark). */
export function skipsDropCap(first: string | undefined): boolean
```

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest'
import { skipsDropCap } from '../src/components/reader/dropCap'

const long = (start: string) => start + ' '.repeat(1) + 'x'.repeat(80)

describe('skipsDropCap', () => {
  it('skips a missing or short opener', () => {
    expect(skipsDropCap(undefined)).toBe(true)
    expect(skipsDropCap('Kısa giriş.')).toBe(true)
  })
  /* "1972'nin Kasım ayıydı" was set as a red 1 followed by "972'nin". */
  it('skips an opener that starts with a digit or a quotation mark', () => {
    expect(skipsDropCap(long("1972'nin Kasım ayıydı."))).toBe(true)
    expect(skipsDropCap(long('“Sayın Başkan,'))).toBe(true)
  })
  it('keeps the drop cap for a letter, Turkish ones included', () => {
    expect(skipsDropCap(long('Türkiye'))).toBe(false)
    expect(skipsDropCap(long('İlk günlerden'))).toBe(false)
  })
})
```

- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement with `/^\p{L}/u`; replace the `shortOpener` expression at `reader/index.tsx:326` with `skipsDropCap(body?.[0])`. Run the test. Expected: PASS.
- [ ] **Step 4:** Clipping width: from 900px up, let the scanned-clipping figure be `min(52rem, 100vw - 2 * var(--space-4))` wide, centred on the narrow text column. Verify with `npm run audit:ui -- --only tr-d-light-article --shots`: the scan is at least 700px wide (was ≈450).
- [ ] **Step 5:** Touch devices: inside the existing `@media (hover: none)` rule make `.clipping-open-hint` `position: static` with `margin-top: 0.5rem`, so it sits under the scan instead of over its last lines.
- [ ] **Step 6:** Lightbox caption: when the piece has a `subtitle`, the caption is `title · subtitle`; only without one is it `title · outlet · date`. ("Milliyet, 3. Göz, 30 Eylül 2000 · Milliyet · 30 Eylül 2000" becomes the first half.)
- [ ] **Step 7:** Tags become links to the piece's own section list filtered by the tag: `<Link className="tag" to={`${backTo}?q=${encodeURIComponent(tag)}`}>` inside each `<li>`; `.tag` becomes `display: inline-flex; align-items: center; min-height: var(--control-hit-size); padding: 0 0.8rem;` with an underline on hover.
- [ ] **Step 8:** The cite button shows its label beside the icon: render `{t.citeLabel}` as visible text and drop the `title` attribute.
- [ ] **Step 9:** Below 560px hide the last two breadcrumb children (the separator and the current title, which the `h1` repeats).
- [ ] **Step 10:** Byline: when the piece's `subtitle` already contains its `date` string ("Milliyet, 3. Göz, 30 Eylül 2000" directly above "30 Eylül 2000 · Milliyet"), the byline shows the name and the medium only. Keep the `<time dateTime>` in the DOM with the `sr-only` class, so the machine-readable date is not lost.
- [ ] **Step 11:** `npm run audit:ui -- --only article` and `--only reader`. Expected: `under44` 0, `hscroll` no. Browser check on a phone-width window in both themes.
- [ ] **Step 12:** Closing checklist, then commit: `Polish the article page: drop caps, wider clippings, working tags`

### Task 22: Newsstand and list polish — Owner approval for Step 1

**Branch:** `fix/newsstand-polish` · **Finding:** UX-5, UX-6

**Files:**
- Modify: `src/components/archive/index.tsx` (`effectiveOpenName` at line 1003, `NewsstandTOCRow` at line 668, `NewsstandTOC` at line 737, `NewsstandStack` at line 810, `ArchiveRow` at line 64), `src/index.css` (`.newsstand-toc-row-date` at line 3339)

- [ ] **Step 1 (owner decision 8):** The default open newspaper is the one with the most matching pieces, not the newest: replace the `orderNewsstandOutlets(newsstandOutlets)[0]` fallback with the entry whose `matchingItems.length` is largest (ties: the newer). An explicit `?open=` still wins.
- [ ] **Step 2:** In `NewsstandTOC`, compute once whether the open paper's rows differ in piece kind and in scan/text; pass both flags to `NewsstandTOCRow`. A row shows the "KÖŞE YAZISI" label only when kinds differ, and the "KUPÜR" badge only when the list mixes scans and text. Apply the same rule to the "TARAMA" badge in `ArchiveRow` via a prop from `FlatArchivePage`.
- [ ] **Step 3:** Below 900px, after a newspaper is chosen: scroll that paper into view inside the strip (`scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'instant' })`) and move the table of contents to the top of the viewport (give its container an `id` and a `scroll-margin-top` equal to the header height).
- [ ] **Step 4:** In the ≤640px block set `.newsstand-toc-row-date { justify-self: start; }` and confirm the meta line sits above the headline, as the comment at line 3327 says it should.
- [ ] **Step 5:** Flat lists (`FlatArchivePage`, line 1127): when the "Filtreler" panel would hold only the year range, show the year range inline under the search field and render no toggle. Expected on `/tr/soylesiler` and `/tr/akademik-makaleler` at phone width: both year inputs visible without a tap, no "Filtreler" button. A list that has a second filter keeps the panel.
- [ ] **Step 6:** `npm run audit:ui -- --only columns --shots` at `m` and `d`; browser check of choosing each newspaper on a phone-width window in both languages.
- [ ] **Step 7:** Closing checklist, then commit: `Tidy the newspaper index: fewer repeated labels, clearer selection on phones`

### Task 23: Not-found spacing, the About gap, press dates

**Branch:** `fix/small-layout` · **Finding:** UX-10

**Files:**
- Modify: `src/components/DeadEnd.tsx` and its CSS, `src/components/NarrativeHeader.tsx` (line 80), `src/press/utils.ts`, `src/components/press/index.tsx`
- Create: `tests/press-date.test.ts`

**Interfaces:**

```ts
// src/press/utils.ts
/** Display only: "12.4.2017" → "12 Nisan 2017" / "12 April 2017". Anything
 *  that is not day.month.year is returned unchanged. The stored date is not touched. */
export function formatPressDate(date: string, lang: Lang): string
```

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest'
import { formatPressDate } from '../src/press/utils'

describe('formatPressDate', () => {
  it('spells out a numeric date', () => {
    expect(formatPressDate('12.4.2017', 'tr')).toBe('12 Nisan 2017')
    expect(formatPressDate('12.04.2017', 'en')).toBe('12 April 2017')
  })
  it('leaves every other form alone', () => {
    expect(formatPressDate('27 Temmuz 2016', 'tr')).toBe('27 Temmuz 2016')
    expect(formatPressDate('2017', 'tr')).toBe('2017')
    expect(formatPressDate('31.2.2017', 'tr')).toBe('31.2.2017')
  })
})
```

- [ ] **Step 2:** Run it. Expected: FAIL. Implement (reject impossible calendar dates with `isRealCalendarDate` from `src/dateUtils.ts`), use it where the press list and the press article render a date. Run. Expected: PASS.
- [ ] **Step 3:** `DeadEnd` renders `.kicker`, `h1.section-title`, `p.lead` and `div.hero-actions` with no space between them. Add the class `dead-end` to its `.container` and, in `src/index.css`: `.dead-end .lead { margin-top: var(--space-2); }` and `.dead-end .hero-actions { margin-top: var(--space-3); }`.
- [ ] **Step 4:** `NarrativeHeader`: render the second column only when it has children or more than one jump target, so the About page loses its ~100px empty band.
- [ ] **Step 5:** `npm run audit:ui -- --only notfound --shots` and `--only about --shots`; browser check in both languages.
- [ ] **Step 6:** Closing checklist, then commit: `Fix spacing on the not-found and About pages and spell out press dates`

### Task 24: Photograph names; links that leave the site

**Branch:** `fix/photo-alt-external-links` · **Finding:** A11Y-6, UX-11

**Files:**
- Modify: `src/components/PhotoStoryPage.tsx` (line 57), `src/components/archive/index.tsx` (`ArchiveRow`), `tests/photo-story.test.ts`

- [ ] **Step 1: Add the failing test** — render `PhotoStoryPage` for `tr` inside a `MemoryRouter` and assert `document.querySelectorAll('figure img[alt=""]')` is empty.
- [ ] **Step 2:** Run it. Expected: FAIL (37 empty).
- [ ] **Step 3:** Where a photograph has no written `alt`, use its position: `Fotoğraf 3` / `Photograph 3` (1-based, among the visible photographs). A real description stays the owner's to write — do not derive one from the caption.
- [ ] **Step 4:** In `ArchiveRow`, when `archiveLink(item, lang)` is external, end the title with `↗` (`aria-hidden`) and add "(yeni sekmede açılır)" / "(opens in a new tab)" to the link's accessible name, as the book links already do.
- [ ] **Step 5:** Run the tests. Expected: PASS. Browser check of `/tr/soylesiler` and the photo page with VoiceOver's rotor (images list).
- [ ] **Step 6:** Closing checklist, then commit: `Name each photograph for screen readers and mark links that leave the site`

---

## Phase 6 — Cleanup

### Task 25: Dead code, stale head tags, missing icons, cache rules

**Branch:** `chore/cleanup-2026-11` · **Finding:** ENG-5, ENG-6, ENG-9, PERF-8

**Files:**
- Modify: `src/archive/index.ts`, `src/routes.ts`, `src/content.ts`, `src/index.css`, `src/components/ArchiveGate.tsx`, `index.html`, `vercel.json` (`headers` only), `vite.config.ts`, `.gitignore`, `.oxlintrc.json`
- Create: `public/favicon.ico`, `public/apple-touch-icon.png`

- [ ] **Step 1:** For each name, confirm zero references with `grep -rn "<name>" src scripts tests`, then delete: `withOutletSectionItems`, `withFlatSectionItems`, `findArchiveItem` (`src/archive/index.ts`); `slugFromUrl` (`src/routes.ts`); `contactLabel` (the `Content` interface and both language objects); the CSS rules for `.btn-disabled`, `.chip-row`, `.kicker-center`, `.section-title-center`, `.works-grid`. (`AppV1` went in Task 16.)
- [ ] **Step 2:** `ArchiveInlineFailure`: the home page has no "picks" any more — the two sentences say only that the counts are missing.
- [ ] **Step 3:** `index.html`: remove `<meta name="keywords">`, `geo.region` and `geo.placename`. Add `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />` and two `theme-color` metas (`media="(prefers-color-scheme: light)"` and `dark`) whose values are the light and dark `--bg` colours in `src/index.css`.
- [ ] **Step 4:** Render `public/favicon.svg` to `public/apple-touch-icon.png` (180×180) and `public/favicon.ico` (32×32) with a tool already on the machine (`sips -s format png`, `qlmanage -t`); if none can read the SVG, extend `scripts/generate-favicon.py`. Confirm both are the Ş on the masthead plate.
- [ ] **Step 5:** `vercel.json`: add `/photos/(.*)` and `/books/(.*)` with `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` (the `/archive/` rule's value).
- [ ] **Step 6:** `vite.config.ts`: replace `advancedChunks` with the option the build warning names. Read its shape from the installed types — `grep -rn "codeSplitting" node_modules/rolldown/dist --include="*.d.*ts" | head` — rather than from memory. Before and after, record `ls dist/assets | sed -E 's/-[A-Za-z0-9_-]{8}\./-HASH./' | sort`; the two lists must be identical and the build must print no deprecation warning.
- [ ] **Step 7:** `.gitignore`: remove the Java, Maven and duplicate `node_modules/`, `dist/`, `.DS_Store`, `.idea` lines. `.oxlintrc.json`: keep one pattern for the prototype directory. `git status --short` must show no newly untracked file.
- [ ] **Step 8:** `npm run check:bundle`, then the closing checklist (large sitemap diff expected), then commit: `Remove dead code and stale head tags; add the missing icons and cache rules`

### Task 26: Breakpoints in `em`

**Branch:** `fix/em-breakpoints` · **Finding:** A11Y-3 · **Depends on:** Tasks 1, 7, 8

**Files:**
- Modify: `src/index.css` (every `min-width` / `max-width` media query), any `matchMedia('(min-width…` in `src/` (`grep -rn "matchMedia" src`)

**Interfaces:**
- `em = px / 16`: 359→22.4375, 419→26.1875, 559→34.9375, 560→35, 640→40, 700→43.75, 767→47.9375, 768→48, 800→50, 900→56.25, 1000→62.5, 1080→67.5.
- Why: a media query in `em` follows the reader's default font size; the section bar stops overflowing when that default is enlarged.

- [ ] **Step 1:** `npm run audit:ui -- --only -d-light- --default-font-size 32`. Expected (before): `hscroll` yes on desktop rows.
- [ ] **Step 2:** Convert every query; change no value inside a rule.
- [ ] **Step 3:** `npm run audit:ui`. Expected: identical to the run before this task at the default font size (same `hscroll`, `under44`, `minFont`).
- [ ] **Step 4:** `npm run audit:ui -- --only -d-light- --default-font-size 32 --shots`. Expected: `hscroll` no; the page shows the drawer menu instead of an overflowing section bar.
- [ ] **Step 5:** Closing checklist, then commit: `Let the layout follow the reader's default font size`

### Task 27: Bring the documents up to date

**Branch:** `docs/refresh-2026-11` · **Finding:** ENG-7 · **Depends on:** every task the owner chose to run

**Files:**
- Modify: `PRODUCT.md`, `CLAUDE.md`, `README.md`, `DESIGN.md`, `docs/OPERATIONS.md`

- [ ] **Step 1:** `PRODUCT.md`: remove "There is no test suite"; replace the entry and book counts with the output of `npm run inventory:archive` and the Books page; remove Chronicle and the weekly picks from "Present"; list today's pages (About, Photographs, Columns, Interviews, Articles, Books, Trial, Press, Cookie Policy).
- [ ] **Step 2:** `CLAUDE.md`: the line count of `src/index.css` and the number of prerendered files (take both from a fresh `wc -l` and a fresh build); the page-split architecture from Tasks 16–17; `npm run check:bundle` and `npm run audit:ui` in the Done definition; animation and font notes if Tasks 14 and 18 ran.
- [ ] **Step 3:** `README.md`: the stack list (no `motion` if Task 18 ran) and the commands.
- [ ] **Step 4:** Tell the owner that `.impeccable/design.json` is older than `DESIGN.md` and is refreshed with `/impeccable document`.
- [ ] **Step 5:** Closing checklist, then commit: `Bring the project documents in line with the site`

---

## Not in this plan

Each needs its own design conversation with the owner (spec §7): a text layer for the 609 scan-only pieces; prerendering the visible body and loading one record instead of the whole archive; site-wide search; splitting the trial record into pages; the cookie notice; rewriting the repository history; adopting a formatter and splitting `src/index.css`.

Also left alone: the book list is still written once per language in `src/content.ts`. Task 4's test keeps the two copies in the same order and Task 17 makes each copy small; merging them into one list with a per-language description is a refactor to do when a book is next added.

## Owner actions (cannot be done from a session)

- **`claude-review` check (ENG-8):** it fails in two seconds without reviewing anything, which points at the `CLAUDE_CODE_OAUTH_TOKEN` repository secret. Re-create it (in Claude Code: `/install-github-app` for `comrade1903/sahinalpay-web`) or disable `.github/workflows/claude-code-review.yml`.
- **Decisions 1–9** in spec §6.
