# Cookie / KVKK Notice + Policy Page — Design

**Date:** 2026-07-29
**Status:** Approved (design), pending implementation plan

## Problem

KVKK (and GDPR) practice expects a public-facing site to inform visitors about
what browser storage / third-party data transfer happens. The site currently has
no such notice. We need a lightweight, honest notice that matches what the site
actually does.

## Ground truth (verified against the codebase)

- **No cookies at all** — there is no `document.cookie` usage anywhere in `src/`.
- **No analytics / tracking / ads** — no Google Analytics, Vercel Analytics,
  pixels, or ad scripts. No such packages in `package.json`.
- **Only client storage:** `localStorage` for the `lang` preference (and theme).
  These are strictly-necessary / functional. KVKK & GDPR do **not** require prior
  opt-in consent for functional storage — only disclosure.
- **One third party:** Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`),
  which transmits the visitor's IP to Google. This is the only data-transfer point
  and must be disclosed. (Self-hosting the fonts to remove it is explicitly out of
  scope here — tracked as a possible later task.)

Because the site sets no consent-requiring cookies, the correct control is an
**informational (aydınlatma) notice with a single "Anladım / Got it"
acknowledgement**, not an accept/reject consent manager (which would be
functionless and misleading here).

## Decisions (from brainstorming)

1. **Banner type:** Informational notice + single acknowledge button. No
   accept/reject, no category toggles.
2. **Policy page:** Add a new bilingual "Çerez Politikası / KVKK Aydınlatma
   Metni" page. The banner links to it.
3. **Google Fonts:** Leave as-is (remote), but disclose it explicitly in the
   policy text.
4. **Data controller line:** Include an İletişim / veri sorumlusu line using the
   existing footer contact address `contact@sahinalpay.net`.

## Scope (YAGNI — explicitly NOT building)

- No accept/reject buttons or category on/off switches.
- No cookie-scanning / consent-gating of scripts.
- No self-hosting of Google Fonts (possible separate later task).
- No cross-session/server storage — acknowledgement lives only in `localStorage`.

## Architecture

Everything follows the existing single-file (`src/App.tsx`) + data-in-`content.ts`
+ two-parallel-route-trees (`routes.ts`) conventions.

### 1. `CookieConsent` banner component (`src/App.tsx`)

- Fixed-position banner at the bottom of the viewport.
- Styling uses the existing hand-written design system only: `.container`,
  `.btn btn-primary`, and existing CSS custom properties. A small set of new
  semantic classes (e.g. `.cookie-notice`, `.cookie-notice-inner`) is added to
  `src/index.css`. **No new framework, no utility classes.** Theme (light/dark)
  inherits automatically through the CSS variables.
- Language comes from the URL via the existing `langForPath(location.pathname)`
  mechanism (not React state/context). Text is read from `content.ts`.
- Visibility: renders only when `localStorage.getItem(CONSENT_KEY) !== CONSENT_VALUE`.
  - `CONSENT_KEY = 'cookie-consent'`, `CONSENT_VALUE = 'ok'`.
  - Reads once into component state on mount; SSR is not a concern (static SPA).
- Acknowledge button ("Anladım" / "Got it"): writes
  `localStorage.setItem(CONSENT_KEY, CONSENT_VALUE)` and hides the banner.
- Contains a `<Link>` to the cookie-policy page for the current language.
- Rendered once at the app layout level (the same level as `Header`/`Footer`,
  around `MainShell`), so it appears on every page and does not re-open on route
  changes.
- Accessibility:
  - Wrapped in `role="region"` with an `aria-label` (bilingual, from `content.ts`).
  - **Not a focus trap** — it is non-blocking/dismissible information, so it must
    not steal focus or trap keyboard navigation.
  - Entrance animation (if any) goes through `motion` and respects
    `useReducedMotion`.

### 2. Cookie policy page (new `PageKey: 'cookies'`)

- `src/routes.ts`:
  - Add `'cookies'` to the `PageKey` union.
  - `paths.en.cookies = '/cookie-policy'`
  - `paths.tr.cookies = '/cerez-politikasi'`
- `src/App.tsx`:
  - Add two routes: `/cookie-policy` (en) and `/tr/cerez-politikasi` (tr), each
    rendering a new `CookiePolicyPage` for its language.
  - `CookiePolicyPage` reads all copy from `content.ts` — no hardcoded prose in JSX.
  - Reuses existing page chrome/classes (`.section`, `.container`, `.kicker`,
    section title classes) so it looks like the rest of the site.
- `src/content.ts`:
  - Extend the `Content` interface with a `cookiePolicy` block and fill it for
    **both** languages (never one language only).
  - Also add the banner strings (body text, acknowledge-button label, policy-link
    label, aria-label) — either inside `cookiePolicy` or a sibling `cookieNotice`
    block; final shape decided in the plan.
  - Add the footer link label for both languages.
- `src/App.tsx` `Footer`: add a `<Link to={paths[lang].cookies!}>` entry to the
  footer nav, both languages.
- `scripts/generate-sitemap.mjs`: add `/cookie-policy` and `/tr/cerez-politikasi`
  to the static-routes list; regenerate `public/sitemap.xml` (committed).

### 3. Policy page content (bilingual, honest — must match ground truth)

The page states, in TR and EN:

- This site **does not use cookies**. It stores only your **language and theme
  preference** in the browser's `localStorage` (functional/strictly-necessary —
  no consent required, only this disclosure).
- Your acknowledgement of this notice is also stored in `localStorage` under the
  `cookie-consent` key so the banner is not shown again.
- **Google Fonts:** typefaces are loaded from Google's servers; in doing so your
  IP address may be transmitted to Google.
- There is **no tracking, analytics, advertising, or third-party profiling**.
- Personal data processed under KVKK is limited to the browser-storage items above.
- **İletişim / veri sorumlusu:** `contact@sahinalpay.net`.

## Data flow

1. First visit → `localStorage` has no `cookie-consent` → banner shows.
2. Visitor clicks "Anladım / Got it" → `localStorage['cookie-consent'] = 'ok'` →
   banner hides for that browser thereafter.
3. Visitor may open the policy page any time from the banner link or the footer,
   regardless of acknowledgement state.

## Error / edge handling

- `localStorage` unavailable (privacy mode / disabled): wrap read/write in
  try/catch. On failure, default to showing the banner and treat acknowledge as a
  no-op persist (banner reappears next load — acceptable, never crashes).
- The banner must not block scrolling or interaction with the page underneath.

## Verification (per project "Done definition")

- `npm run build` passes (includes `tsc -b`).
- `npm run lint` clean.
- `npm run validate:content` passes and `npm run generate:sitemap` re-run
  (routes added) with the updated `public/sitemap.xml` committed.
- Browser-verified in **both** languages (`/` and `/tr`) and **both** themes,
  plus a mobile-width viewport:
  - Banner appears on first visit, dismisses on acknowledge, stays dismissed on
    reload, and reappears after clearing the `cookie-consent` key.
  - Policy page renders correctly and is reachable from the banner and footer in
    both languages.
- Committed with a descriptive message; pushed only when production-ready
  (`main` auto-deploys).

## Open items

- None blocking. Data-controller line uses `contact@sahinalpay.net` per owner's
  decision. (Note: this address currently uses the not-yet-live `sahinalpay.net`
  domain; it will be updated together with all other domain references when the
  owner confirms the `sahinalpay.com` switch — out of scope for this change.)
