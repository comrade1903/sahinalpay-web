# Kronik / Chronicle — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A `/chronicle` (+ `/tr/kronik`) timeline page that plots Şahin Alpay's real per-year article volume against an owner-approved set of national events, with representative pieces per year — the corpus reframed as testimony over time.

**Architecture:** A new `ChroniclePage` in `src/App.tsx` driven by `useArchiveData()`; per-year article counts computed client-side with `parseTurkishDate`; events from a new static `src/chronicle.ts`; representative picks via the existing `mulberry32` seeded shuffle. Wired into routing, nav, hub, and sitemap like any page.

**Tech Stack:** React 19, TypeScript (strict), Vite 8, hand-written CSS.

**Design spec:** `docs/superpowers/specs/2026-07-31-chronicle-design.md`

## Global Constraints

- **No test framework — do NOT add one.** Per-task verification = `npm run build` + `npm run lint`; run `npm run validate:content` and `npm run generate:sitemap` at the routing task (routes added) and at the end.
- **Content integrity:** the events list is EXACTLY the owner-approved set below — no additions/edits. Volume/counts are computed from real data only; never fabricate a count or a zero — while the archive is loading, show `ArchiveLoading`.
- **Bilingual:** every user-facing string in BOTH `tr` and `en`.
- **New PageKey plumbing (all required):** `PageKey` union + both `paths` maps (`routes.ts`); `HUB_ICONS` entry (`App.tsx`) — a full `Record<PageKey,string>`, build fails without it; `content[lang].nav` and `content[lang].hub` (both langs); the route list (`App.tsx`); the sitemap static routes.
- **Styling: `src/index.css` only**, reuse tokens (`--tertiary`/`--tertiary-ink` brass, `--line`, `--surface*`, spacing, radius) and `Reveal`. Style both themes; respect `useReducedMotion`.
- **Route the page directly** (dedicated `<Route element={<ChroniclePage .../>}>`), NOT via `RouteFor`/`PageForKey` (whose default renders `ArchiveRoutePage`).
- **Commits:** imperative English subject; end with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`. Commit locally per task; **do not push** (owner confirms release at the end).

## File Structure

- `src/chronicle.ts` — new: `ChronicleEvent` type + `chronicleEvents` data.
- `src/routes.ts` — `chronicle` PageKey + paths.
- `src/content.ts` — nav + hub entries (both langs).
- `src/App.tsx` — `HUB_ICONS` entry, `ChroniclePage` + `LoadedChronicle`, two routes.
- `src/index.css` — `.chronicle*` styles.
- `scripts/generate-sitemap.mjs` + `public/sitemap.xml` — two new routes.

---

## Task 1: Data file + routing/nav/hub scaffold + stub page

Adds the events data, all the PageKey plumbing, and a minimal page so nav works and the build is green. The real visualization comes in Task 2.

**Files:**
- Create: `src/chronicle.ts`
- Modify: `src/routes.ts`, `src/content.ts`, `src/App.tsx`, `scripts/generate-sitemap.mjs`
- Regenerate: `public/sitemap.xml`

**Interfaces:**
- Produces: `chronicleEvents: ChronicleEvent[]`; `PageKey` includes `'chronicle'`; `paths.en.chronicle='/chronicle'`, `paths.tr.chronicle='/tr/kronik'`; a `ChroniclePage({lang})` component.

- [ ] **Step 1: Create `src/chronicle.ts`** with the approved events (exactly this set):

```ts
export type ChronicleEventKind = 'national' | 'personal'

export interface ChronicleEvent {
  year: number
  tr: string
  en: string
  kind: ChronicleEventKind
}

/** Owner-approved historical markers. National = Turkey's political ruptures;
    personal = documented, public facts about Şahin Alpay. Do not add entries
    without owner sign-off (content-integrity rule). */
export const chronicleEvents: ChronicleEvent[] = [
  { year: 1971, tr: '12 Mart Muhtırası', en: 'March 12 memorandum', kind: 'national' },
  { year: 1980, tr: '12 Eylül askerî darbesi', en: 'September 12 coup', kind: 'national' },
  { year: 1997, tr: '28 Şubat süreci ("postmodern darbe")', en: 'February 28 "postmodern coup"', kind: 'national' },
  { year: 2002, tr: 'AK Parti ilk seçim zaferi', en: "AK Party's first election win", kind: 'national' },
  { year: 2005, tr: 'Türkiye–AB üyelik müzakereleri başladı', en: 'Turkey–EU accession talks begin', kind: 'national' },
  { year: 2007, tr: 'Cumhurbaşkanlığı krizi ve e-muhtıra', en: 'Presidential crisis & e-memorandum', kind: 'national' },
  { year: 2013, tr: 'Gezi Parkı protestoları', en: 'Gezi Park protests', kind: 'national' },
  { year: 2016, tr: '15 Temmuz darbe girişimi', en: 'July 15 coup attempt', kind: 'national' },
  { year: 2016, tr: 'Şahin Alpay tutuklandı', en: 'Şahin Alpay detained', kind: 'personal' },
  { year: 2018, tr: 'AYM ve AİHM hak ihlali kararı; tahliye', en: 'Constitutional Court & ECtHR rulings; release', kind: 'personal' },
]
```

- [ ] **Step 2: Add the PageKey + paths** in `src/routes.ts`:

```ts
  | 'books'
  | 'cookies'
  | 'chronicle'
```

en map (after `books`):
```ts
    books: '/books',
    chronicle: '/chronicle',
    cookies: '/cookie-policy',
```
tr map (after `books`):
```ts
    books: '/tr/kitaplar',
    chronicle: '/tr/kronik',
    cookies: '/tr/cerez-politikasi',
```

- [ ] **Step 3: Add the `HUB_ICONS` entry** in `src/App.tsx`:

```ts
  books: 'menu_book',
  chronicle: 'timeline',
  cookies: 'cookie',
```

- [ ] **Step 4: Add nav + hub entries** in `src/content.ts`, BOTH languages. In `en.nav` (after the `books` entry):
```ts
      { key: 'chronicle', label: 'Chronicle' },
```
In `en.hub` (after the `books` hub entry):
```ts
      {
        key: 'chronicle',
        title: 'Chronicle',
        description: 'His published voice, year by year, against the events he wrote through.',
      },
```
In `tr.nav`:
```ts
      { key: 'chronicle', label: 'Kronik' },
```
In `tr.hub`:
```ts
      {
        key: 'chronicle',
        title: 'Kronik',
        description: 'Yayımlanmış sesi, yıl yıl, içinde yazdığı olayların karşısında.',
      },
```

- [ ] **Step 5: Add a stub `ChroniclePage`** in `src/App.tsx` (just above `function CookiePolicyPage`). Replaced with the real one in Task 2:

```tsx
function ChroniclePage({ lang }: { lang: Lang }) {
  const location = useLocation()
  usePageMeta({
    title: `${lang === 'tr' ? 'Kronik' : 'Chronicle'} — Şahin Alpay`,
    description:
      lang === 'tr'
        ? 'Şahin Alpay’ın yayımlanmış sesi, yıl yıl, Türkiye’nin olaylarının karşısında.'
        : "Şahin Alpay's published voice, year by year, against Turkey's events.",
    alternates: pageAlternates(location.pathname),
  })
  return (
    <section className="section section-solo">
      <div className="container">
        <p className="kicker">{lang === 'tr' ? 'Zaman Çizgisi' : 'Timeline'}</p>
        <h1 className="section-title">{lang === 'tr' ? 'Kronik' : 'Chronicle'}</h1>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Add the two routes** in `src/App.tsx` `<Routes>` — en after `/books`, tr after `/tr/kitaplar`:

```tsx
          <Route path="/chronicle" element={<ChroniclePage lang="en" />} />
```
```tsx
          <Route path="/tr/kronik" element={<ChroniclePage lang="tr" />} />
```

- [ ] **Step 7: Add the sitemap routes** in `scripts/generate-sitemap.mjs` `staticRoutes` (after `/books` and after `/tr/kitaplar`):
```js
  ['/chronicle', 'monthly', '0.7'],
```
```js
  ['/tr/kronik', 'monthly', '0.7'],
```

- [ ] **Step 8: Regenerate + verify.** Run:
```bash
npm run generate:sitemap && npm run validate:content && npm run build && npm run lint
```
Expected: sitemap +2 URLs; validate passes; build passes (HUB_ICONS complete, nav/hub typed); lint clean.

- [ ] **Step 9: Browser sanity** (`npm run dev`): nav shows "Kronik/Chronicle" and highlights when active; `/chronicle` and `/tr/kronik` render the heading; hub card links to it.

- [ ] **Step 10: Commit.**
```bash
git add src/chronicle.ts src/routes.ts src/content.ts src/App.tsx scripts/generate-sitemap.mjs public/sitemap.xml
git commit -m "Scaffold the Chronicle page: route, nav, hub, and events data

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: The timeline — volume arc, events, representative picks

Replaces the stub with the real visualization.

**Files:**
- Modify: `src/App.tsx` — replace `ChroniclePage`, add `LoadedChronicle` + `yearPicks` helper; import `chronicleEvents`.
- Modify: `src/index.css` — `.chronicle*` styles.

**Interfaces:**
- Consumes: `useArchiveData()`, `ArchiveLoading`, `parseTurkishDate`, `mulberry32`, `ArchiveRow`, `chronicleEvents`, `content[lang]`.

- [ ] **Step 1: Import the events** at the top of `src/App.tsx` (with the other local imports):
```tsx
import { chronicleEvents } from './chronicle'
```

- [ ] **Step 2: Replace `ChroniclePage`** (the Task 1 stub) with the data-driven version + a loaded child + a pick helper:

```tsx
function yearPicks(items: ArchiveItem[], year: number, n: number): ArchiveItem[] {
  const pool = items.filter((i) => i.hasBody)
  const src = pool.length ? pool : items
  const random = mulberry32(year)
  const shuffled = [...src]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, n)
}

function ChroniclePage({ lang }: { lang: Lang }) {
  const location = useLocation()
  usePageMeta({
    title: `${lang === 'tr' ? 'Kronik' : 'Chronicle'} — Şahin Alpay`,
    description:
      lang === 'tr'
        ? 'Şahin Alpay’ın yayımlanmış sesi, yıl yıl, Türkiye’nin olaylarının karşısında.'
        : "Şahin Alpay's published voice, year by year, against Turkey's events.",
    alternates: pageAlternates(location.pathname),
  })
  const archiveData = useArchiveData()
  if (!archiveData) return <ArchiveLoading lang={lang} />
  return <LoadedChronicle lang={lang} archiveData={archiveData} />
}

function LoadedChronicle({
  lang,
  archiveData,
}: {
  lang: Lang
  archiveData: ArchiveData
}) {
  const items: ArchiveItem[] = [
    ...archiveData.columns[lang].flatMap((o) => o.items),
    ...(lang === 'tr' ? archiveData.analyses.flatMap((o) => o.items) : []),
  ]

  const byYear = new Map<number, ArchiveItem[]>()
  for (const it of items) {
    const ts = it.date ? parseTurkishDate(it.date) : null
    if (ts == null) continue
    const y = new Date(ts).getUTCFullYear()
    const bucket = byYear.get(y)
    if (bucket) bucket.push(it)
    else byYear.set(y, [it])
  }

  const counts = [...byYear.entries()].map(([y, arr]) => [y, arr.length] as const)
  const maxCount = Math.max(1, ...counts.map(([, c]) => c))
  const total = counts.reduce((n, [, c]) => n + c, 0)
  const dataYears = counts.map(([y]) => y)
  const firstYear = dataYears.length ? Math.min(...dataYears) : 0
  const lastYear = dataYears.length ? Math.max(...dataYears) : 0

  const years = Array.from(
    new Set([...byYear.keys(), ...chronicleEvents.map((e) => e.year)]),
  ).sort((a, b) => a - b)

  return (
    <section className="section section-solo chronicle">
      <div className="container container-narrow">
        <Reveal>
          <p className="kicker">{lang === 'tr' ? 'Zaman Çizgisi' : 'Timeline'}</p>
          <h1 className="section-title">{lang === 'tr' ? 'Kronik' : 'Chronicle'}</h1>
          <p className="lead">
            {lang === 'tr'
              ? `${firstYear}–${lastYear} arasında ${total.toLocaleString('tr')} yazı. 2016’da bir kalem susturuldu; grafik bunu gösteriyor.`
              : `${total.toLocaleString('en')} pieces between ${firstYear} and ${lastYear}. In 2016 a pen was silenced — the chart shows it.`}
          </p>
        </Reveal>

        <div className="chronicle-spine">
          {years.map((year) => {
            const yearItems = byYear.get(year) ?? []
            const count = yearItems.length
            const events = chronicleEvents.filter((e) => e.year === year)
            const picks = count > 0 ? yearPicks(yearItems, year, 2) : []
            return (
              <Reveal as="div" className="chronicle-row" key={year}>
                <div className="chronicle-year">{year}</div>
                <div className="chronicle-body">
                  {count > 0 && (
                    <div className="chronicle-bar" aria-hidden="true">
                      <span
                        className="chronicle-bar-fill"
                        style={{ width: `${Math.max(4, (count / maxCount) * 100)}%` }}
                      />
                    </div>
                  )}
                  {count > 0 && (
                    <p className="chronicle-count">
                      {lang === 'tr' ? `${count} yazı` : `${count} pieces`}
                    </p>
                  )}
                  {events.map((e) => (
                    <p
                      className={`chronicle-event chronicle-event-${e.kind}`}
                      key={`${e.year}-${e.en}`}
                    >
                      <span className="material-symbols-outlined" aria-hidden="true">
                        {e.kind === 'personal' ? 'person' : 'flag'}
                      </span>
                      {e[lang]}
                    </p>
                  ))}
                  {picks.length > 0 && (
                    <ul className="archive-list chronicle-picks">
                      {picks.map((p) => (
                        <ArchiveRow item={p} lang={lang} key={p.id} />
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Add styles** in `src/index.css` (append near the other page blocks, e.g. after `.related-articles`):

```css
/* ---------- Chronicle ---------- */
.chronicle-spine {
  margin-top: var(--space-5);
  border-left: 2px solid var(--line);
  padding-left: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.chronicle-row {
  display: grid;
  grid-template-columns: 4rem 1fr;
  gap: var(--space-2);
  align-items: start;
}
.chronicle-year {
  font-family: var(--headline);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--tertiary-ink);
  font-feature-settings: 'onum' 1;
}
.chronicle-body {
  min-width: 0;
}
.chronicle-bar {
  height: 0.5rem;
  background: var(--surface-mid);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.chronicle-bar-fill {
  display: block;
  height: 100%;
  background: var(--accent);
  border-radius: var(--radius-full);
}
.chronicle-count {
  margin: 0.35rem 0 0;
  font-family: var(--label);
  font-size: 0.8rem;
  color: var(--muted);
}
.chronicle-event {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0.5rem 0 0;
  font-family: var(--label);
  font-size: 0.9rem;
  color: var(--ink-soft);
}
.chronicle-event .material-symbols-outlined {
  font-size: 18px;
  color: var(--tertiary-ink);
}
.chronicle-event-personal {
  font-weight: 700;
  color: var(--ink);
}
.chronicle-picks {
  margin-top: var(--space-2);
}
@media (max-width: 560px) {
  .chronicle-row {
    grid-template-columns: 3rem 1fr;
  }
}
```

- [ ] **Step 4: Build + lint.** Run: `npm run build && npm run lint` — Expected: PASS/clean.

- [ ] **Step 5: Browser-verify** (`npm run dev`), both languages, both themes, mobile:
  - `/chronicle` (EN) and `/tr/kronik` (TR): the spine renders; bars grow toward 2008–2012 and visibly collapse at 2016; counts match the archive distribution (2008 ≈ highest).
  - Event rows appear on 1971/1980/1997 (no bar, event only), and 2002/2005/2007/2013/2016/2018; the two personal markers (2016 detained, 2018 release) are visually distinct; labels are in the right language.
  - Representative pieces under a year link to working reader pages.
  - Hero shows real total + span.
  - Loading state appears briefly before the archive resolves.

- [ ] **Step 6: Commit.**
```bash
git add src/App.tsx src/index.css
git commit -m "Build the Chronicle timeline: volume arc, events, and year picks

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Final verification + release

- [ ] **Step 1: Full suite.** `npm run build && npm run lint && npm run validate:content && npm run generate:sitemap` — all pass; if the sitemap changed, commit it.
- [ ] **Step 2: Final browser pass.** Both languages, both themes, mobile; verify counts against the known distribution (peak 2008–2012, 2016 collapse); no console errors.
- [ ] **Step 3: Hand off the push decision.** Report to the owner; only on explicit confirmation:
```bash
GH_CONFIG_DIR="$HOME/.config/gh-comrade1903" git push origin main
```

---

## Self-Review

**Spec coverage:**
- Volume arc from real data → Task 2 `byYear`/bars. ✅
- Events track (approved set, national + personal) → `src/chronicle.ts` (Task 1) + row rendering (Task 2). ✅
- Representative picks per year (deterministic, hasBody-preferred) → `yearPicks` (Task 2). ✅
- Factual hero (computed total + span + 2016 note) → Task 2 lead. ✅
- New page in nav + hub + routes + sitemap + HUB_ICONS → Task 1. ✅
- Loading/`null` handling → `ChroniclePage` returns `ArchiveLoading`. ✅
- Bilingual, both themes, reduced-motion (no bar animations; `Reveal` already honors it) → Task 2/3 verification. ✅
- No year-filtered archive view; no life-eras track → not built (YAGNI). ✅

**Placeholder scan:** No TBD/TODO; all code concrete. Hero copy is real-figure-driven; `HUB_ICONS` uses `timeline`. Events are the exact approved set.

**Type consistency:** `ChronicleEvent`/`chronicleEvents` (Task 1) consumed in Task 2. `ArchiveData`/`ArchiveItem` shapes match existing `WeeklyPicks` usage (`archiveData.columns[lang].flatMap(o=>o.items)`, `archiveData.analyses`). `ArchiveRow` prop shape (`item`,`lang`) matches its use in related-articles. `PageKey 'chronicle'` added everywhere a full `Record<PageKey,...>`/paths/nav/hub is required (HUB_ICONS in Task 1 Step 3 prevents the build break seen when the cookies key was added).

**Content-integrity:** events are a fixed owner-approved list in a data file; counts/hero are computed from real archive data; loading state prevents fabricated zeros. No archive content is edited.
