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
- **Content is data, not JSX**: `src/content.ts` (~1400 lines) exports `content: Record<Lang, Content>`, one full copy of every string/section per language. Adding or editing an article/book/bio fact means editing this file, not `App.tsx`. See the header comment in `content.ts` for the exact shape of an `ArchiveItem` entry.
  - English only has Columns + Books; Turkish has all six sections (Analizler, Söyleşiler, Akademik Makaleler are Turkish-only per the source material) — `Content.analyses`/`interviews`/`academicArticles` are optional and `App.tsx` falls back to redirecting home when absent for a given language.
  - An `ArchiveItem` opens **internally** (own `/…/:slug` reader page) when it has a non-empty `body`; otherwise it links **externally** to `url` (or `imageSrc` for scanned clippings). The slug is derived from the last path segment of the source `url` (`slugFromUrl` in `routes.ts`).
  - Article dates are free-text Turkish strings (e.g. `"7 Kasım 2017"`); `src/dateUtils.ts#parseTurkishDate` is the only place that parses them into sortable timestamps — reuse it rather than re-parsing dates elsewhere.
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
