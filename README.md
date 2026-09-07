# Şahin Alpay — Digital Archive

The official website and digital archive of Şahin Alpay (b. 1944) — Turkish political
scientist, author and journalist. The site collects his newspaper columns, political
analyses, interviews, academic articles and books in a bilingual (Turkish/English)
single-page application.

## Stack

- React 19 + TypeScript, built with Vite
- react-router-dom v7 (client-side routing; two parallel URL trees, one per language)
- `motion` for animation, hand-written CSS design system in `src/index.css`
- oxlint for linting
- vitest + happy-dom for tests
- Deployed as a fully static site on Vercel (pushing to `main` deploys production).
  Every route gets its own HTML file at build time carrying that page's title,
  canonical, language alternates and structured data, plus a `<noscript>` fallback
  with the piece's real text — so a scraper or a reader without JavaScript gets the
  right page, and an unknown address returns a real HTTP 404. The visible page is
  still rendered on the client: `#root` is empty in the generated files.
- Fonts and icons are self-hosted; the site makes no third-party requests.

## Development

Node is pinned in `.nvmrc` (and `engines` in `package.json`).

```bash
npm ci
npm run dev                # Vite dev server with HMR
npm run build              # tsc -b, vite build, then prerender every route
npm run lint               # oxlint
npm test                   # vitest (happy-dom)
npm run validate:content   # archive integrity — schema, dates, media, routes, sitemap
npm run serve:dist         # serve dist/ the way Vercel does (real 404s and headers)
npm run generate:sitemap   # regenerate public/sitemap.xml + robots.txt (committed)
npm run generate:summary   # regenerate the home page's archive summary (committed)
npm run inventory:archive  # diffable dump of every record, for before/after proofs
npm run inventory:media    # which files under public/archive the site actually links
npm run split:archive      # re-split large outlets into metadata + lazy body modules
```

A change is verified with `build` + `lint` + `test` + `validate:content`, and by
checking the running app in a browser (both languages, both themes, phone width).

Use `npm run serve:dist` rather than `npm run preview` when status codes or headers
matter: Vite's preview answers 200 for every path, which hides soft 404s.

## Content model

All archive content is **data, not JSX**:

- `src/content.ts` — bilingual UI copy, bio and books (one full copy per language).
- `src/archive/{tr,en}/` — one `ArchiveItemSeed[]` file per publication outlet
  (Cumhuriyet, Sabah, Milliyet, Zaman, P24, Today's Zaman, Forum, Aydınlık, İşçi Köylü…),
  assembled in `src/archive/index.ts`.
- Large outlets are split into eagerly-loaded metadata plus lazily-loaded
  `*.body.ts` modules so list pages stay fast (`src/archive/bodyRegistry.ts`).
- Scanned newspaper clippings live under `public/archive/clippings/`.

Every archive entry traces to a verifiable source — nothing on the site is fabricated.
Entries recovered from scanned periodicals (e.g. the TUSTAV archive) are only added
after authorship is confirmed against the issue's own table of contents.

## Documentation

- [CLAUDE.md](CLAUDE.md) — architecture notes and working conventions
- [CONTRIBUTING.md](CONTRIBUTING.md) — the content-integrity rules and the checks
- [docs/OPERATIONS.md](docs/OPERATIONS.md) — release, rollback, backup, media, monitoring
- [docs/SECURITY.md](docs/SECURITY.md) — reporting, headers, dependencies, privacy
- [PRODUCT.md](PRODUCT.md) — who the site is for and what it must never do
