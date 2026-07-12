# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page bilingual (Turkish/English) personal & political archive site for Şahin Alpay (b. 1944) — his columns, analyses, interviews, academic articles, and books. The site is his public legacy record: accuracy of the historical material matters more than feature velocity.

**Stack**: React 19 + TypeScript ~6.0 (strict unused-checks, `verbatimModuleSyntax`, `erasableSyntaxOnly`), Vite 8, react-router-dom **v7**, `motion` for animation (with `useReducedMotion` respected). Linting is **oxlint** (not ESLint). Deployed as a fully static SPA on Vercel.

**Domain**: code currently references `sahinalpay.net` (index.html metas, `scripts/generate-sitemap.mjs`'s `SITE` constant, `public/llms.txt`), but that domain was never registered. The plan is to publish on **sahinalpay.com** (registered, not yet connected to Vercel). Do NOT change domain references until the owner confirms the switch; when he does, update all of the locations listed above together.

**Deployment**: pushing to `main` on GitHub (`comrade1903/sahinalpay-web`) auto-deploys production via Vercel (team `comrade1905`; local link lives in gitignored `.vercel/`). Treat every push to `main` as a production release — don't push half-finished work.

**GitHub account switching**: this repo authenticates as `comrade1903` (not the machine's default `iozgirgin` account) via a gitignored `.envrc` that exports `GH_CONFIG_DIR=~/.config/gh-comrade1903`, loaded by direnv in interactive shells only. Non-interactive shells (including Claude Code's Bash tool) never trigger direnv — prefix `git push`/`gh` commands with `GH_CONFIG_DIR="$HOME/.config/gh-comrade1903"`, otherwise the push fails with `Repository not found` (a 404 from authenticating as the wrong account, not a missing repo).

## Commands

```bash
npm run dev                # Vite dev server with HMR
npm run build              # tsc -b (project references) then vite build
npm run lint               # oxlint (see .oxlintrc.json — react/typescript/oxc plugins)
npm run preview            # serve the production build locally
npm run validate:content   # archive integrity: unique id/slug, date sanity, clipping assets exist on disk
npm run generate:sitemap   # regenerate public/sitemap.xml (committed to the repo)
npm run split:archive      # re-split large outlets into metadata + .body.ts modules
```

There is no test suite/framework configured in this repo (no test script, no `*.test.*`/`*.spec.*` files). Verification is `build` + `lint` + `validate:content` + checking the running app in a browser.

## Architecture

- **Everything renders from one file**: `src/App.tsx` (~2,650 lines) contains every page component (Home, About, the outlet/flat archive list pages, the single-article reader, Books) plus shared chrome (Header, Footer, theme toggle, language toggle, scroll-reveal wrapper). There is no `components/` or `pages/` directory — new UI goes into this file unless it grows enough to justify splitting.
- **Content is data, not JSX**: `src/content.ts` exports `content: Record<Lang, Content>` (page copy, bio, books — one full copy per language), and archive articles live as `ArchiveItemSeed[]` files under `src/archive/{tr,en}/` (one file per outlet), assembled in `src/archive/index.ts`. Editing an article/book/bio fact means editing these files, not `App.tsx`. Any change to UI copy must be made in **both** languages at once — never ship a string in one language only.
  - **Columns are per-language** (`archiveData.columns.tr` / `.en`); analyses, interviews and academic articles are Turkish-only **content**, but English still has hub pages for them (`ArchiveRoutePage` renders `TurkishArchiveHub`, an English explainer linking to the Turkish archive). Only the English *item* routes (`/analyses/:slug` etc.) redirect home. Outlet groups carry a `medium` (`'print'` newspaper vs `'online'` e-publication like P24) that renders as list badges and byline labels.
  - `src/archive/tr/columns/zaman.ts` and `src/archive/en/columns/todays-zaman.ts` are **generated** by `scripts/import-zaman-md.mjs` from markdown exports outside the repo — regenerate, don't hand-edit. P24 photos come from `scripts/import-p24-pdf-images.mjs` (PDF dir outside the repo; needs `pdftoppm` from poppler).
  - An `ArchiveItem` opens **internally** (own `/…/:slug` reader page) when it has a non-empty `body` (or a `clippings` array — see `archiveLink()` in `App.tsx`), otherwise it links **externally** to `url` (or `imageSrc` for scanned clippings). Slug comes from the seed's explicit `slug`, else the last path segment of `url`, else slugified title (`normalizeArchiveItems` in `src/archive/utils.ts`).
  - Article dates are free-text Turkish or English strings (e.g. `"7 Kasım 2017"`, `"11 January 2003"`); `src/dateUtils.ts#parseTurkishDate` is the only place that parses them into sortable timestamps — reuse it rather than re-parsing dates elsewhere.
- **Archive data loads lazily, article bodies lazier still**: `App.tsx#useArchiveData()` dynamically `import()`s `src/archive/index.ts` on mount and returns `null` until it resolves — every consumer (home page, hub/list pages, the article reader) must handle that `null`/loading state rather than fabricating a zero-count. Full body text for the largest outlets (P24, Zaman, Today's Zaman) is split further: `scripts/split-archive-body.mjs` generates metadata-only `<outlet>.ts` (imported eagerly) plus body-only `<outlet>.body.ts` (imported on demand via `src/archive/bodyRegistry.ts#loadOutletBodies()`, cached by `${lang}:${id}`). Split items have `hasBody: true` with an empty `body` on the seed — check `hasBody`, never `body.length`, to decide whether an item has full text. `src/archive/itemUtils.ts` holds the lightweight helpers (`archiveItemText`, `itemScanClippings`, `itemHasSourceKind`) that work off eagerly-loaded metadata plus an optional already-loaded body, so search/filtering doesn't force-load every body. `vite.config.ts`'s `manualChunks` keys off the `.body.ts` filename suffix to give each split outlet its own real download chunk; when splitting a new outlet, also register its loader in `bodyRegistry.ts` and add a `manualChunks` entry.
- **Routing is two parallel trees, not locale-prefixed generic routes**: `src/routes.ts` defines `paths: Record<Lang, Partial<Record<PageKey, string>>>` mapping each `PageKey` to a real, differently-worded URL per language (e.g. `about` → `/about` in English, `/tr/kimdir` in Turkish). `App.tsx`'s `<Routes>` lists every language/page combination explicitly rather than generating them, because the English and Turkish path sets aren't structurally identical. When adding a page, add it to `PageKey`, both language path maps in `routes.ts`, the route list in `App.tsx`, and the static-routes list in `scripts/generate-sitemap.mjs`.
- Language is derived purely from the URL (`langForPath`: `/tr` prefix → Turkish, everything else → English), not from React context/state; the language switcher just navigates to `equivalentPath(pathname, targetLang)` and persists the choice to `localStorage`.
- **Homepage "Benden Seçkiler" / "My Picks"** (`App.tsx#WeeklyPicks`): 3 real articles chosen by a seeded shuffle (`mulberry32` PRNG keyed by `isoWeekKey()`, the ISO-8601 year+week number), not curated or server-driven — the pick set changes automatically once a week and is identical for every visitor within that week, with no cron/backend needed.
- **`MainShell`'s route-change effect resets scroll with `window.scrollTo({ top: 0, left: 0, behavior: 'instant' })`, not a bare `scrollTo(0, 0)`** — `src/index.css` sets `html { scroll-behavior: smooth }` site-wide, which silently makes a plain `scrollTo` animate instead of jump, so a bare call looks like a scroll-position bug when navigating from a scrolled-down list to an article. Any other programmatic scroll reset should pass `behavior: 'instant'` explicitly for the same reason.
- This is a fully static SPA: `vercel.json` rewrites everything to `/index.html` so client-side routing works on refresh/deep links; there is no server/API layer.

## Styling

- All styling is a **hand-written design system in `src/index.css`** (~2,200 lines): CSS custom properties (`--display`, `--ink`, …) plus semantic class names (`.section`, `.container`, `.kicker`, `.btn btn-primary`, `.filter-card`, …). Extend this system; reuse existing classes and variables before inventing new ones.
- **There is no CSS framework** — Tailwind was removed after sitting unused; don't (re)introduce one or start writing utility classes. Keep the semantic-class approach.
- Fonts are Literata (display/headline) + Nunito Sans (body/label) from Google Fonts; icons are **Material Symbols Outlined** ligatures (`<span className="material-symbols-outlined">`), not an icon component library.
- Dark/light theme sets `data-theme` on `<html>` (`null` = follow system preference). Visual changes must be checked in both themes.
- Animations go through `motion` and must respect `useReducedMotion` — the site's audience skews older; never add motion that can't be turned off.

## Content integrity (hard rules)

- **Never fabricate archive content**: no invented articles, dates, quotes, excerpts, or links. `Book.purchaseUrl` must be a real retailer product page. Every archive entry must trace to a verifiable source.
- Entries recovered from scanned periodicals (TUSTAV etc.) require **authorship confirmation** before being added (e.g. the issue's own table of contents naming Şahin Alpay) — a name match in OCR text alone is not enough (falcon metaphors, other Şahins, masthead lists, and citations of his work are all false positives). Cite the exact issue/page in `subtitle`, credit the source archive in `sourceNote` with an OCR-quality caveat, and put page scans under `public/archive/clippings/<outlet>/<year>/<slug>/page-N.jpg`.
- `public/llms.txt` duplicates the bio for AI crawlers — keep it consistent when biography facts change.
- `tmp/` is a gitignored scratch area for research artifacts (OCR output, scan reports); nothing in it is part of the app.

## Working conventions

- The owner communicates in **Turkish**; reply in Turkish. Code, comments, and commit messages are in **English**.
- Commit messages: imperative English subject line describing the user-visible outcome (see `git log` for the established style); commit directly to `main` for routine work — branches/PRs only for large or risky changesets.
- When browser-verifying, check both languages (`/` and `/tr`), and for layout work both themes and a mobile-width viewport.

## Done definition

A change is complete only when all of the following hold:

1. `npm run build` passes (this includes the `tsc -b` typecheck).
2. `npm run lint` is clean.
3. If archive/content data was touched: `npm run validate:content` passes, and `npm run generate:sitemap` was re-run when items or routes were added/removed (the sitemap is committed).
4. UI-visible changes were verified in a running browser (not just a successful build) in both languages.
5. The change is committed with a descriptive message — and pushed only if it is production-ready, since `main` deploys automatically.

## Repo layout caveats

Several top-level directories are **not part of the active app** — don't treat them as source to import from or keep in sync with `src/`:
- `şahin-alpay-arşivi/` — an earlier standalone prototype with its own `package.json`/Vite config.
- `stitch_ahin_alpay_dijital_ar_ivi/` — static HTML/design mockups (Google Stitch output), reference only.
- `agent-skills/`, `awesome-claude-code-subagents/` — vendored third-party skill/agent repos, unrelated to this site's code.
- `docs/superpowers/` — vendored skill docs, not project documentation.

`.mcp.json` configures a 21st.dev MCP server that expects an `API_KEY_21ST` environment variable.
