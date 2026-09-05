# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary audience is the family and anyone who comes to the site as a permanent
record of Şahin Alpay's public life. When needs conflict, completeness and
correctness of the record win over engagement, discovery, or visitor volume.

Real visitors arrive along three paths, all of which the record must serve without
displacing the primary one:

- Turkish readers who followed his columns and want to find or re-read a piece. The
  readership skews older, so legibility and calm navigation are functional
  requirements, not preferences.
- Researchers and journalists looking up a specific article, date, or outlet, and
  needing the citation to be trustworthy and the link to keep working.
- International readers and institutions who reach the site through the press-freedom
  case and read the English side.

## Product Purpose

A single-page bilingual (Turkish/English) personal and political archive for Şahin
Alpay (b. 1944, Ayvalık) — political scientist, author and journalist. It gathers
work that is otherwise scattered across defunct newspaper sites, paywalls, and
scanned periodicals into one durable, readable place.

The site succeeds when it:

1. Makes the whole body of writing reachable — columns, analyses, interviews,
   academic articles and books, including material that exists only as scans.
2. Is the primary result when his name is searched, and is legible to AI/search
   crawlers as the authoritative source (`public/llms.txt`, JSON-LD `Person`/
   `WebSite`/`Book` in `index.html`, committed `public/sitemap.xml`).
3. Holds the press-freedom record: detention after the July 15, 2016 coup attempt,
   roughly twenty months in custody, the Constitutional Court and European Court of
   Human Rights rulings that his fundamental rights were violated, release in 2018.
4. Keeps his published books visible and findable.

## Positioning

A first-party archive maintained by the author's own side, not a third-party index
or a news aggregator. That is what a neighbouring site cannot copy: every entry
traces to a verified source, authorship is confirmed before an entry exists, and the
record is bilingual by construction rather than machine-translated.

## Operating Context

- Fully static SPA, no server or API layer. Content lives in the repository as typed
  data and ships with the build.
- Deployed on Vercel; a push to `main` in `comrade1903/sahinalpay-web` is a
  production release.
- Archive material is recovered by hand from outside sources: markdown exports for
  Zaman/Today's Zaman, PDFs for P24, and scanned periodical volumes (TÜSTAV Süreli
  Yayınlar Arşivi) for the older analyses. Import and extraction run through scripts
  in `scripts/`, against directories that live outside the repo.
- Verification is `npm run build`, `npm run lint`, `npm run validate:content`, and
  checking the running app in a browser. There is no test suite.
- The owner communicates in Turkish. Code, comments and commit messages are English.

## Capabilities and Constraints

Present:

- Pages: Home, About/Kimdir, Columns, Analyses, Interviews, Academic Articles, Books,
  Chronicle, Cookie Policy — each with a distinct, differently-worded URL per
  language (`/about` vs `/tr/kimdir`), not a locale prefix over one route tree.
- Language is derived purely from the URL; the switcher navigates to the equivalent
  path and persists the choice to `localStorage`.
- An article either opens internally on its own reader page (when it has body text or
  scanned clippings) or links out to its original source.
- A homepage picks section that rotates weekly from a seeded shuffle keyed to the ISO
  week — no cron, no backend, identical for every visitor that week.
- Chronicle: published output per year, plotted against the events he wrote through.
- Light/dark theme following the system by default; motion respects
  `prefers-reduced-motion`.
- No cookies, no analytics, no third-party tracking. Only language and theme
  preference are stored, and the cookie/KVKK/GDPR notice states this.

Constraints:

- Columns are per-language. Analyses, interviews and academic articles are Turkish-only
  as content; English keeps hub pages that explain and link to the Turkish archive.
- Any UI string must be written in both languages in the same change. Shipping copy in
  one language only is a defect.
- Article dates are free-text Turkish or English strings; one parser turns them into
  sortable values.
- The archive must stay fast as it grows: data loads lazily and the largest outlets
  have their body text split into separately downloaded chunks.

Undecided / pending:

- The site is published on `sahinalpay.com` (registered) but the code still references
  `sahinalpay.net`, which was never registered. The switch happens only on the
  owner's confirmation, and then in every location at once.
- The books section has no external summaries link yet.

## Brand Commitments

- The name is written `Şahin Alpay`, with Turkish diacritics, in both languages.
- Book titles stay in their original Turkish in both languages.
- Contact is `contact@sahinalpay.net` (moves with the domain decision above).
- Voice: measured, plain, unsentimental. The material is serious and recent enough to
  be painful; the site states facts and lets them carry their own weight. No
  promotional register, no dramatization of the imprisonment.

## Evidence on Hand

Real, in the repository:

- 576 archive entries: Zaman (244), Milliyet (127), Today's Zaman (97), P24 (47),
  Cumhuriyet (43), analyses (7 — Aydınlık 4, Forum 2, İşçi Köylü 1), academic
  articles (6), interviews (5). Sabah has a section but no entries yet.
  `npm run inventory:archive` prints the current figures; this list is a snapshot.
- Six books: Hikâyemin Sonu (2025), Bir Hikâyem Var (2024), Gülen'in Katkısı (2004),
  Türkiye'nin Tanıkları: İçeriden Bakanlar (2003), Türkiye'nin Tanıkları: Dışarıdan
  Bakanlar (2002), Sosyal Demokrasi Açısından Kürt Sorunu (1992).
- 563 page scans under `public/archive/clippings/<outlet>/<year>/<slug>/`, and 48
  PDFs under `public/archive/pdf/`. 43 of those PDFs — one per Cumhuriyet column —
  are not referenced by any record; see docs/OPERATIONS.md.
- Biography facts, duplicated for crawlers in `public/llms.txt` and as JSON-LD in
  `index.html`; these three must stay consistent with each other.

Empty and to be filled: Sabah.

Absent — must never be invented: testimonials, visitor numbers, awards, press quotes,
retailer links that were not verified, or any article, date, quote, excerpt or link
without a traceable source.

## Product Principles

1. **The record outranks the feature.** Accuracy and completeness of the historical
   material matter more than feature velocity or visual novelty.
2. **Nothing enters the archive unverified.** Every entry traces to a source. For
   scanned periodicals, authorship must be confirmed from the issue's own table of
   contents — an OCR name match is not enough. The exact issue and page are cited and
   the source archive is credited.
3. **Bilingual is structural, not a translation layer.** Both languages are written
   together, with their own URLs and their own hub copy.
4. **Design for the empty half.** Sections that are still empty are a normal state
   for years to come, and the interface must present them as pending record rather
   than as failure — while being built for an archive several times its current size.
5. **Readable before impressive.** Older readers, long-form text, scans of varying
   quality, and reduced-motion users are the load case.

## Accessibility & Inclusion

- The readership skews older: generous type, high contrast, large touch and click
  targets, and unhurried interaction are requirements.
- Motion is optional by construction — every animation goes through a reduced-motion
  check.
- Both themes are equally supported; neither is a degraded variant.
- Scanned clippings need real alternatives: readable captions, a source note carrying
  the OCR-quality caveat, and a path to the page image itself.
