# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page bilingual (Turkish/English) personal & political archive site for Şahin Alpay (sahinalpay.net) — columns, analyses, interviews, academic articles, and books. React 19 + TypeScript + Vite, client-side routed, deployed as a static SPA on Vercel.

## Commands

```bash
npm run dev       # Vite dev server with HMR
npm run build     # tsc -b (project references) then vite build
npm run lint      # oxlint (see .oxlintrc.json — react/typescript/oxc plugins)
npm run preview   # serve the production build locally
```

There is no test suite/framework configured in this repo (no test script, no `*.test.*`/`*.spec.*` files).

## Architecture

- **Everything renders from one file**: `src/App.tsx` contains every page component (Home, About, the outlet/flat archive list pages, the single-article reader, Books) plus shared chrome (Header, Footer, theme toggle, language toggle, scroll-reveal wrapper). There is no `components/` or `pages/` directory — new UI goes into this file unless it grows enough to justify splitting.
- **Content is data, not JSX**: `src/content.ts` exports `content: Record<Lang, Content>` (page copy, bio, books — one full copy per language), and archive articles live as `ArchiveItemSeed[]` files under `src/archive/{tr,en}/` (one file per outlet), assembled in `src/archive/index.ts`. Editing an article/book/bio fact means editing these files, not `App.tsx`.
  - **Columns are per-language** (`archiveData.columns.tr` / `.en`); analyses, interviews and academic articles are Turkish-only, and `App.tsx` redirects home when a section is absent for a language. Outlet groups carry a `medium` (`'print'` newspaper vs `'online'` e-publication like P24) that renders as list badges and byline labels.
  - `src/archive/tr/columns/zaman.ts` and `src/archive/en/columns/todays-zaman.ts` are **generated** by `scripts/import-zaman-md.mjs` from markdown exports outside the repo — regenerate, don't hand-edit. P24 photos come from `scripts/import-p24-pdf-images.mjs` (PDF dir outside the repo; needs `pdftoppm` from poppler).
  - An `ArchiveItem` opens **internally** (own `/…/:slug` reader page) when it has a non-empty `body`; otherwise it links **externally** to `url` (or `imageSrc` for scanned clippings). Slug comes from the seed's explicit `slug`, else the last path segment of `url`, else slugified title (`normalizeArchiveItems` in `src/archive/utils.ts`).
  - Article dates are free-text Turkish or English strings (e.g. `"7 Kasım 2017"`, `"11 January 2003"`); `src/dateUtils.ts#parseTurkishDate` is the only place that parses them into sortable timestamps — reuse it rather than re-parsing dates elsewhere.
- **Routing is two parallel trees, not locale-prefixed generic routes**: `src/routes.ts` defines `paths: Record<Lang, Partial<Record<PageKey, string>>>` mapping each `PageKey` to a real, differently-worded URL per language (e.g. `about` → `/about` in English, `/tr/kimdir` in Turkish). `App.tsx`'s `<Routes>` lists every language/page combination explicitly rather than generating them, because the English and Turkish path sets aren't structurally identical (Turkish has extra sections). When adding a page, add it to `PageKey`, both language path maps in `routes.ts`, and the route list in `App.tsx`.
- Language is derived purely from the URL (`langForPath`), not from React context/state; the language switcher just navigates to `equivalentPath(pathname, targetLang)` and persists the choice to `localStorage`.
- This is a fully static SPA: `vercel.json` rewrites everything to `/index.html` so client-side routing works on refresh/deep links; there is no server/API layer.

## Repo layout caveats

Several top-level directories are **not part of the active app** — don't treat them as source to import from or keep in sync with `src/`:
- `sahinalpay-web/` — a separate nested git repository (leftover), not referenced by this project's build.
- `şahin-alpay-arşivi/` — an earlier standalone prototype with its own `package.json`/Vite config.
- `stitch_ahin_alpay_dijital_ar_ivi/` — static HTML/design mockups (Google Stitch output), reference only.
- `agent-skills/` — a vendored third-party skills repo (has its own `.git`), unrelated to this site's code.

`.mcp.json` configures a 21st.dev MCP server that expects an `API_KEY_21ST` environment variable.
