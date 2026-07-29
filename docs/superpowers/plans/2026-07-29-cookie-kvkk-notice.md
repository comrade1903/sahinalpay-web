# Cookie / KVKK Notice + Policy Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an honest, KVKK-compliant informational cookie/storage notice (single "acknowledge" action) plus a bilingual cookie/privacy policy page, matching what the site actually does (no cookies, no tracking).

**Architecture:** Follows the existing conventions exactly — UI lives in `src/App.tsx`, all copy lives in `src/content.ts` (both languages), routing is the two parallel per-language trees in `src/routes.ts`, styling reuses the hand-written design system in `src/index.css`. A `CookieConsent` banner renders once at the app layout level; a `CookiePolicyPage` is reachable at `/cookie-policy` (en) and `/tr/cerez-politikasi` (tr).

**Tech Stack:** React 19, TypeScript (strict), Vite 8, react-router-dom v7, `motion` (with `useReducedMotion`).

**Design spec:** `docs/superpowers/specs/2026-07-29-cookie-kvkk-notice-design.md`

## Global Constraints

Every task implicitly includes all of these:

- **No test framework in this repo — do NOT add one.** Verification per task = `npm run build` (runs `tsc -b` typecheck + vite build) and `npm run lint` (oxlint), plus browser checks where noted. Content/route tasks also run `npm run validate:content` and `npm run generate:sitemap`.
- **All UI copy must be added in BOTH languages (tr + en) in the same change.** Never ship a string in one language only.
- **Styling: hand-written design system in `src/index.css` only.** No CSS framework, no Tailwind, no utility classes. Reuse existing CSS custom properties (`--surface`, `--line`, `--ink`, `--ink-soft`, `--accent`, `--shadow-lift`, `--radius-lg`, …) and existing classes (`.container`, `.section`, `.kicker`, `.btn`, `.btn-primary`). Theme (light/dark) inherits automatically through these variables — no per-theme code needed.
- **All new UI goes in `src/App.tsx`** (no `components/`/`pages/` directories).
- **Content is data in `src/content.ts`, not JSX.** Page/banner components read from `content[lang]`.
- **Adding a page requires all four:** add to `PageKey` (`routes.ts`), both language maps in `paths` (`routes.ts`), the route list in `App.tsx`, and the static-routes list in `scripts/generate-sitemap.mjs`.
- **localStorage keys (verbatim):** `CONSENT_KEY = 'cookie-consent'`, `CONSENT_VALUE = 'ok'`.
- **Data controller contact (verbatim):** `contact@sahinalpay.net`.
- **Do NOT change any `sahinalpay.net` domain references** anywhere — the domain switch is a separate, owner-gated task.
- **`motion` animations must respect `useReducedMotion`.** No motion that cannot be turned off.
- **Commits:** imperative English subject describing the user-visible outcome; end the message with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`. Commit locally per task. **Do not `git push` during the plan** — pushing to `main` is a production release; the final step confirms with the owner first. (When pushing, prefix with `GH_CONFIG_DIR="$HOME/.config/gh-comrade1903"`.)

---

## File Structure

- `src/routes.ts` — add `'cookies'` to `PageKey`, and `cookies` paths to both `paths.en` and `paths.tr`.
- `src/content.ts` — extend the `Content` interface with `cookieNotice` and `cookiePolicy` blocks, add `cookieLabel` to the `footer` block, and fill all three for `en` and `tr`.
- `src/App.tsx` — add `CookiePolicyPage`, two routes, a footer link, and the `CookieConsent` banner (rendered in `AppV1`).
- `src/index.css` — add `.cookie-notice*` styles.
- `scripts/generate-sitemap.mjs` — add the two new static routes.
- `public/sitemap.xml` — regenerated (committed).

---

## Task 1: Routing + content data foundation

Adds the `cookies` page key, its per-language URLs, and all bilingual copy (banner + policy page + footer link). No visible UI yet — this is the data/type foundation later tasks consume.

**Files:**
- Modify: `src/routes.ts` (PageKey union ~line 3–11; `paths` object ~line 16–34)
- Modify: `src/content.ts` (`Content` interface ~line 51–95; `en` block ~line 307–317 footer; `tr` footer block; add new blocks to both language objects)

**Interfaces:**
- Produces: `PageKey` now includes `'cookies'`; `paths.en.cookies === '/cookie-policy'`, `paths.tr.cookies === '/cerez-politikasi'`.
- Produces on `Content`:
  ```ts
  footer: { …; cookieLabel: string }
  cookieNotice: {
    ariaLabel: string
    text: string
    policyLinkLabel: string
    acceptLabel: string
  }
  cookiePolicy: {
    kicker: string
    title: string
    intro: string
    sections: { heading: string; body: string[] }[]
  }
  ```

- [ ] **Step 1: Add `'cookies'` to the `PageKey` union** in `src/routes.ts`:

```ts
export type PageKey =
  | 'home'
  | 'about'
  | 'columns'
  | 'analyses'
  | 'interviews'
  | 'academic'
  | 'books'
  | 'cookies'
```

- [ ] **Step 2: Add the `cookies` path to both language maps** in `src/routes.ts` (`paths`). Add to `en` after `books`:

```ts
    books: '/books',
    cookies: '/cookie-policy',
```

and to `tr` after `books`:

```ts
    books: '/tr/kitaplar',
    cookies: '/tr/cerez-politikasi',
```

- [ ] **Step 3: Extend the `Content` interface** in `src/content.ts`. Add `cookieLabel` to the `footer` member and add the two new members after `footer`:

```ts
  footer: {
    kicker: string
    navLabel: string
    email: string
    columnsLabel: string
    booksLabel: string
    backToTop: string
    rights: string
    tagline: string
    cookieLabel: string
  }
  cookieNotice: {
    ariaLabel: string
    text: string
    policyLinkLabel: string
    acceptLabel: string
  }
  cookiePolicy: {
    kicker: string
    title: string
    intro: string
    sections: { heading: string; body: string[] }[]
  }
```

- [ ] **Step 4: Fill the English copy** in `src/content.ts`. Add `cookieLabel` inside the `en` `footer` object, and add the `cookieNotice` + `cookiePolicy` blocks as siblings of `footer` in the `en` object:

```ts
    footer: {
      kicker: 'Keep in touch',
      navLabel: 'Footer',
      email: 'Email',
      columnsLabel: 'Columns',
      booksLabel: 'Books',
      backToTop: 'Back to top ↑',
      rights: 'All rights reserved.',
      tagline: 'A personal & political legacy.',
      cookieLabel: 'Cookie Policy',
    },
    cookieNotice: {
      ariaLabel: 'Cookie notice',
      text: 'This site uses no tracking or advertising cookies. It only stores your language and theme preference in your browser to remember your choices.',
      policyLinkLabel: 'Cookie Policy',
      acceptLabel: 'Got it',
    },
    cookiePolicy: {
      kicker: 'Privacy',
      title: 'Cookie & Data Notice',
      intro:
        "This page explains, under Turkey's Personal Data Protection Law (KVKK) and the GDPR, what this website stores in your browser and what data leaves your device. In short: this site uses no cookies and does not track you.",
      sections: [
        {
          heading: 'No cookies, no tracking',
          body: [
            'This website sets no cookies. There is no analytics, advertising, or third-party profiling of any kind — your visits are not measured or shared.',
          ],
        },
        {
          heading: 'What we store in your browser',
          body: [
            "To remember your choices, the site saves two functional items in your browser's local storage: your language preference and your light/dark theme preference. These are strictly necessary for the site to work the way you set it and, under KVKK and the GDPR, require disclosure but not prior consent.",
            'When you dismiss the notice at the bottom of the page, that acknowledgement is also stored locally (under the key "cookie-consent") so the notice is not shown again. You can remove all of these at any time by clearing your browser\'s site data.',
          ],
        },
        {
          heading: 'Fonts loaded from Google',
          body: [
            "The site's typefaces are loaded from Google Fonts. When your browser requests them, your IP address may be transmitted to Google's servers. This is the only third-party request the site makes; no other data about you is sent.",
          ],
        },
        {
          heading: 'Your rights and contact',
          body: [
            'Because the only personal data involved is the browser storage described above, there is very little to access, correct, or delete beyond clearing your own browser data. For any question about this notice or your rights under KVKK, you can reach the data controller at contact@sahinalpay.net.',
          ],
        },
      ],
    },
```

- [ ] **Step 5: Fill the Turkish copy** in `src/content.ts`. Add `cookieLabel` inside the `tr` `footer` object, and add the `cookieNotice` + `cookiePolicy` blocks as siblings of `footer` in the `tr` object:

```ts
      cookieLabel: 'Çerez Politikası',
```

```ts
    cookieNotice: {
      ariaLabel: 'Çerez bildirimi',
      text: 'Bu site izleme veya reklam çerezi kullanmaz. Yalnızca tercihlerinizi hatırlamak için dil ve tema seçiminizi tarayıcınızda saklar.',
      policyLinkLabel: 'Çerez Politikası',
      acceptLabel: 'Anladım',
    },
    cookiePolicy: {
      kicker: 'Gizlilik',
      title: 'Çerez ve Veri Aydınlatma Metni',
      intro:
        'Bu sayfa, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve GDPR kapsamında, bu web sitesinin tarayıcınızda ne sakladığını ve cihazınızdan hangi verilerin çıktığını açıklar. Kısacası: bu site çerez kullanmaz ve sizi izlemez.',
      sections: [
        {
          heading: 'Çerez yok, izleme yok',
          body: [
            'Bu web sitesi hiçbir çerez kullanmaz. Hiçbir analitik, reklam veya üçüncü taraf profilleme yoktur — ziyaretleriniz ölçülmez ya da paylaşılmaz.',
          ],
        },
        {
          heading: 'Tarayıcınızda ne saklıyoruz',
          body: [
            'Tercihlerinizi hatırlamak için site, tarayıcınızın yerel deposunda (localStorage) iki işlevsel öğe saklar: dil tercihiniz ve açık/koyu tema tercihiniz. Bunlar sitenin sizin ayarladığınız gibi çalışması için zorunludur ve KVKK ile GDPR kapsamında önceden onay değil, yalnızca bilgilendirme gerektirir.',
            'Sayfanın altındaki bildirimi kapattığınızda, bu onay da ("cookie-consent" anahtarıyla) yerel olarak saklanır; böylece bildirim size tekrar gösterilmez. Bunların tümünü, tarayıcınızın site verilerini temizleyerek istediğiniz zaman silebilirsiniz.',
          ],
        },
        {
          heading: "Google'dan yüklenen yazı tipleri",
          body: [
            "Sitenin yazı tipleri Google Fonts üzerinden yüklenir. Tarayıcınız bunları talep ederken IP adresiniz Google'ın sunucularına iletilebilir. Bu, sitenin yaptığı tek üçüncü taraf isteğidir; hakkınızda başka hiçbir veri gönderilmez.",
          ],
        },
        {
          heading: 'Haklarınız ve iletişim',
          body: [
            'İşlenen tek kişisel veri yukarıda açıklanan tarayıcı depolaması olduğundan, kendi tarayıcı verinizi temizlemenin ötesinde erişilecek, düzeltilecek veya silinecek çok az şey vardır. Bu metin veya KVKK kapsamındaki haklarınızla ilgili her türlü soru için veri sorumlusuna contact@sahinalpay.net adresinden ulaşabilirsiniz.',
          ],
        },
      ],
    },
```

- [ ] **Step 6: Verify it compiles.** Run: `npm run build`
  Expected: PASS (no `tsc` errors — the new `Content` members are present in both languages, so the `Record<Lang, Content>` object typechecks).

- [ ] **Step 7: Verify lint is clean.** Run: `npm run lint`
  Expected: clean (no new findings in `src/`).

- [ ] **Step 8: Commit.**

```bash
git add src/routes.ts src/content.ts
git commit -m "Add cookie-notice and cookie-policy copy and the cookies route key

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Cookie policy page + routes + footer link + sitemap

Renders the bilingual policy page, wires both language routes, links it from the footer, and adds it to the sitemap.

**Files:**
- Modify: `src/App.tsx` — add `CookiePolicyPage` (near the other page components, e.g. before `Footer` at ~line 2392); add two `<Route>`s inside `<Routes>` (~lines 2588 and 2630); add a footer `<Link>` (~line 2408)
- Modify: `scripts/generate-sitemap.mjs` — `staticRoutes` array (lines 12–27)
- Regenerate: `public/sitemap.xml`

**Interfaces:**
- Consumes (from Task 1): `paths[lang].cookies`, `content[lang].cookiePolicy`, `content[lang].footer.cookieLabel`.
- Produces: `CookiePolicyPage({ lang }: { lang: Lang })` React component; reachable routes `/cookie-policy` and `/tr/cerez-politikasi`.

- [ ] **Step 1: Add the `CookiePolicyPage` component** in `src/App.tsx` (place it just above `function Footer()` at ~line 2392). It reads all copy from `content[lang].cookiePolicy` and reuses existing page chrome classes:

```tsx
function CookiePolicyPage({ lang }: { lang: Lang }) {
  const t = content[lang].cookiePolicy
  return (
    <section className="section">
      <div className="container container-narrow">
        <p className="kicker">{t.kicker}</p>
        <h1 className="section-title">{t.title}</h1>
        <p className="lead">{t.intro}</p>
        {t.sections.map((section) => (
          <div key={section.heading} className="policy-block">
            <h2>{section.heading}</h2>
            {section.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
```

  Note: if `.container-narrow`, `.lead`, or `.section-title` are not existing classes, drop `container-narrow` (use plain `.container`) and reuse whatever the About page uses for its intro paragraph and title — check `AboutPage` for the exact class names before inventing any. `.policy-block` is a new, optional wrapper; if you add styles for it, they go in Task 3's CSS step or here in `src/index.css`, but plain `<h2>`/`<p>` already inherit the design system, so no new CSS is strictly required.

- [ ] **Step 2: Add the English route** in `src/App.tsx` inside `<Routes>`, right after the `/books` route (~line 2588):

```tsx
          <Route path="/books" element={<RouteFor lang="en" pageKey="books" />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage lang="en" />} />
```

- [ ] **Step 3: Add the Turkish route** in `src/App.tsx` inside `<Routes>`, right after the `/tr/kitaplar` route (~line 2630):

```tsx
          <Route
            path="/tr/kitaplar"
            element={<RouteFor lang="tr" pageKey="books" />}
          />
          <Route
            path="/tr/cerez-politikasi"
            element={<CookiePolicyPage lang="tr" />}
          />
```

  (Route directly via `CookiePolicyPage`, NOT through `RouteFor`/`PageForKey` — `PageForKey`'s `default` case renders `ArchiveRoutePage`, which is wrong for this page.)

- [ ] **Step 4: Add the footer link** in `src/App.tsx` `Footer` (~line 2408), after the "Back to top" link:

```tsx
            <Link to={paths[lang].home!}>{t.footer.backToTop}</Link>
            <Link to={paths[lang].cookies!}>{t.footer.cookieLabel}</Link>
```

- [ ] **Step 5: Add both routes to the sitemap** in `scripts/generate-sitemap.mjs` `staticRoutes` (add `/cookie-policy` after the `/books` line and `/tr/cerez-politikasi` after the `/tr/kitaplar` line):

```js
  ['/books', 'monthly', '0.8'],
  ['/cookie-policy', 'yearly', '0.3'],
  ['/tr', 'monthly', '1.0'],
```

```js
  ['/tr/kitaplar', 'monthly', '0.8'],
  ['/tr/cerez-politikasi', 'yearly', '0.3'],
]
```

- [ ] **Step 6: Regenerate the sitemap and validate content.** Run:

```bash
npm run generate:sitemap && npm run validate:content
```

Expected: sitemap regenerates reporting two more URLs than before; `validate:content` passes.

- [ ] **Step 7: Build and lint.** Run: `npm run build && npm run lint`
  Expected: both PASS/clean.

- [ ] **Step 8: Browser-verify the page** (dev server: `npm run dev`). Check all of:
  - `/cookie-policy` renders the English policy with all four sections and the `contact@sahinalpay.net` line.
  - `/tr/cerez-politikasi` renders the Turkish policy.
  - The footer link appears and works in both languages (`/` and `/tr`).
  - The language toggle on the policy page switches between the two URLs (this works automatically because both share the `cookies` PageKey via `equivalentPath`).
  - Looks correct in both light and dark theme.

- [ ] **Step 9: Commit.**

```bash
git add src/App.tsx scripts/generate-sitemap.mjs public/sitemap.xml
git commit -m "Add the bilingual cookie policy page, footer link, and sitemap entries

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Cookie consent notice banner

Adds the fixed-bottom informational banner shown until the visitor acknowledges it.

**Files:**
- Modify: `src/App.tsx` — add `CONSENT_KEY`/`CONSENT_VALUE` constants and the `CookieConsent` component (place near the other layout components, above `AppV1`); render it inside `AppV1` (~line 2638)
- Modify: `src/index.css` — add `.cookie-notice*` styles (append near the footer styles)

**Interfaces:**
- Consumes (from Task 1): `content[lang].cookieNotice`, `paths[lang].cookies`.
- Produces: `CookieConsent()` React component rendered once at app root.

- [ ] **Step 1: Add the constants and component** in `src/App.tsx` (just above `export function AppV1()` at ~line 2638):

```tsx
const CONSENT_KEY = 'cookie-consent'
const CONSENT_VALUE = 'ok'

function readConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === CONSENT_VALUE
  } catch {
    return false
  }
}

function CookieConsent() {
  const location = useLocation()
  const lang = langForPath(location.pathname)
  const t = content[lang].cookieNotice
  const reduce = useReducedMotion()
  const [acknowledged, setAcknowledged] = useState(() => readConsent())

  if (acknowledged) return null

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, CONSENT_VALUE)
    } catch {
      // Storage unavailable (private mode); dismiss for this session only.
    }
    setAcknowledged(true)
  }

  return (
    <motion.aside
      className="cookie-notice"
      role="region"
      aria-label={t.ariaLabel}
      initial={reduce ? false : { y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.25 }}
    >
      <div className="container cookie-notice-inner">
        <p className="cookie-notice-text">
          {t.text}{' '}
          <Link to={paths[lang].cookies!}>{t.policyLinkLabel}</Link>
        </p>
        <div className="cookie-notice-actions">
          <button type="button" className="btn btn-primary" onClick={accept}>
            {t.acceptLabel}
          </button>
        </div>
      </div>
    </motion.aside>
  )
}
```

  Note: confirm `useState` is already imported from `react` at the top of `App.tsx` (it is used elsewhere); `motion`, `useReducedMotion`, `Link`, `useLocation`, `langForPath`, `content`, `paths` are all already imported.

- [ ] **Step 2: Render the banner** in `AppV1` (`src/App.tsx` ~line 2638). The banner sits alongside the other layout chrome so it shows on every page:

```tsx
export function AppV1() {
  return (
    <>
      <Header />
      <MainShell />
      <Footer />
      <CookieConsent />
    </>
  )
}
```

- [ ] **Step 3: Add the banner styles** in `src/index.css` (append after the `.site-footer` block). Uses existing variables so both themes work automatically:

```css
.cookie-notice {
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: 95;
  padding: 0.85rem 0;
  background: var(--surface);
  border-top: 1px solid var(--line);
  box-shadow: var(--shadow-lift);
}

.cookie-notice-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1.25rem;
}

.cookie-notice-text {
  flex: 1 1 22rem;
  margin: 0;
  color: var(--ink-soft);
  font-size: 0.9rem;
  line-height: 1.5;
}

.cookie-notice-text a {
  color: var(--accent);
  text-decoration: underline;
}

.cookie-notice-actions {
  flex: 0 0 auto;
}

@media (max-width: 560px) {
  .cookie-notice-actions,
  .cookie-notice-actions .btn {
    width: 100%;
  }
}
```

  (z-index 95 sits above page content and below the sticky header (100) and the mobile-nav overlay (999) — so an open mobile menu correctly covers the banner rather than the banner poking through. Confirm this layering in Step 5.)

- [ ] **Step 4: Build and lint.** Run: `npm run build && npm run lint`
  Expected: both PASS/clean.

- [ ] **Step 5: Browser-verify the banner** (`npm run dev`). In a browser where `localStorage['cookie-consent']` is not set (or run `localStorage.removeItem('cookie-consent')` in the console and reload), check ALL of:
  - Banner appears at the bottom on first load, on both `/` (English text) and `/tr` (Turkish text).
  - The "Cookie Policy / Çerez Politikası" link navigates to the correct policy page.
  - Clicking "Got it / Anladım" hides the banner; after a reload it stays hidden.
  - After `localStorage.removeItem('cookie-consent')` + reload, it reappears.
  - The banner does not block scrolling or clicking the page underneath.
  - Correct in both light and dark theme, and at a mobile-width viewport (button goes full-width, text wraps cleanly).
  - With OS "reduce motion" enabled, the banner appears with no slide animation.
  - Open the mobile nav menu (mobile width) and confirm the overlay covers the banner (no z-index bleed-through).

- [ ] **Step 6: Commit.**

```bash
git add src/App.tsx src/index.css
git commit -m "Add the cookie/KVKK notice banner with local acknowledgement

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Final full verification + release

Runs the complete "Done definition" suite once more across the whole change, then hands the push decision to the owner (pushing `main` is a production deploy).

**Files:** none (verification + push only).

- [ ] **Step 1: Full verification suite.** Run:

```bash
npm run build && npm run lint && npm run validate:content
```

Expected: build passes (typecheck + build), lint clean, content valid.

- [ ] **Step 2: Confirm the sitemap is committed and current.** Run:

```bash
npm run generate:sitemap && git status --short
```

Expected: `public/sitemap.xml` shows no uncommitted diff (already regenerated in Task 2). If it changed, commit it.

- [ ] **Step 3: Final cross-language / cross-theme browser pass.** Confirm on a fresh browser profile (no `cookie-consent` key): banner → acknowledge → policy page reachable from both banner and footer, in both `/` and `/tr`, both themes, and mobile width. No console errors.

- [ ] **Step 4: Hand off the push decision.** Report completion to the owner and ask whether to push to `main` (production deploy). Only on explicit confirmation:

```bash
GH_CONFIG_DIR="$HOME/.config/gh-comrade1903" git push origin main
```

---

## Self-Review

**Spec coverage:**
- Informational banner + single acknowledge → Task 3. ✅
- Bilingual policy page at `/cookie-policy` + `/tr/cerez-politikasi` → Tasks 1 (routes/copy) + 2 (page/routes). ✅
- Google Fonts disclosed, no self-hosting → policy copy "Fonts loaded from Google" section (Task 1). ✅
- Data-controller line = `contact@sahinalpay.net` → policy "Your rights and contact" section (Task 1). ✅
- `localStorage` persistence, key `cookie-consent` → Task 3 constants + `readConsent`. ✅
- `localStorage` unavailable → try/catch in `readConsent`/`accept` (Task 3). ✅
- Footer link → Task 2 Step 4. ✅
- Sitemap updated + committed → Task 2 Steps 5–6, Task 4 Step 2. ✅
- Non-blocking / no focus trap → `role="region"`, no focus management (Task 3). ✅
- `useReducedMotion` respected → Task 3 `initial`/`transition` gating. ✅
- Both themes, both languages, mobile → verification steps in Tasks 2–4. ✅
- No new cookies, no domain changes, no test framework → Global Constraints. ✅

**Placeholder scan:** No TBD/TODO; all code blocks are concrete. The only conditional is Task 2 Step 1's note to confirm `.container-narrow`/`.lead`/`.section-title` class names against `AboutPage` before use — this is a real "reuse existing classes" check, not a deferred decision, with an explicit fallback.

**Type consistency:** `cookieNotice` fields (`ariaLabel`, `text`, `policyLinkLabel`, `acceptLabel`) and `cookiePolicy` fields (`kicker`, `title`, `intro`, `sections[].heading`, `sections[].body[]`) defined in Task 1 match their uses in Tasks 2–3. `CONSENT_KEY`/`CONSENT_VALUE` consistent across Task 3. `paths[lang].cookies` and `footer.cookieLabel` consistent across Tasks 1–2.
