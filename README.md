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
- Deployed as a fully static SPA on Vercel (pushing to `main` deploys production)

## Development

```bash
npm install
npm run dev                # Vite dev server with HMR
npm run build              # typecheck (tsc -b) + production build
npm run preview            # serve the production build locally
npm run lint               # oxlint
npm run validate:content   # archive integrity checks (unique ids/slugs, assets exist)
npm run generate:sitemap   # regenerate public/sitemap.xml (committed)
npm run split:archive      # re-split large outlets into metadata + lazy body modules
```

There is no test suite; a change is verified with `build` + `lint` + `validate:content`
and by checking the running app in a browser (both languages, both themes).

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

See [CLAUDE.md](CLAUDE.md) for the full architecture notes and contribution rules.
