# Operations

How this site is built, released, checked and recovered. Written for whoever
maintains the archive next, including the author's family.

## What the site is

A fully static bilingual archive: no application server, no database, no user
accounts, no sessions, no upload endpoint, no API. The build produces a folder
of files; Vercel serves them from its CDN. That is the whole runtime.

That shape removes the categories of failure that dominate web security —
there is no SQL to inject, no session to hijack, no authorisation check to get
wrong. What remains, and what the checks below cover, is the browser code, the
dependencies, the content-production tooling, the hosting configuration and
the release process.

## Release

`main` deploys to production automatically. **Every push to `main` is a
release.** There is no staging step in the repository; a pull request gets a
Vercel preview deployment.

Before pushing:

```bash
npm ci
npm run build          # tsc -b, vite build, prerender
npm run lint
npm test
npm run validate:content
npm run check:secrets
npm run verify:prerender   # after the build
```

CI (`.github/workflows/ci.yml`) runs the same sequence on pushes to `main` and
on pull requests, plus an audit of production dependencies and a check that
the committed generated files match what the generators produce:
`public/sitemap.xml`, `public/robots.txt`, `scripts/sitemap-lastmod.json`,
`src/archive/summary.generated.ts` and `vercel.json`.

### Proving the archive is intact

The archive is the product. Before and after any refactor:

```bash
npm run inventory:archive > /tmp/before.json
# ... make the change ...
npm run inventory:archive > /tmp/after.json
diff /tmp/before.json /tmp/after.json
```

This compares every record field by field — id, slug, every seed field, media
references and a hash of the body text. Equal record *counts* prove nothing.

### Rollback

Vercel keeps every deployment. To undo a bad release, promote the previous
deployment in the Vercel dashboard (Deployments → the last good one →
"Promote to Production"); this is instant and needs no rebuild. Then revert
the commit on `main` so the next push does not re-deploy the same problem.

`git revert <sha>` is the right tool. Do not force-push `main`.

### Backup and restore

Everything the site is — content, images, page scans, configuration — is in
this Git repository. A clone is a complete backup:

```bash
git clone --mirror git@github.com:comrade1903/sahinalpay-web.git
```

Keep at least one mirror off GitHub. `public/` is ~235 MiB and the object
store is ~900 MiB, so a clone is not instant but is entirely self-contained.

To restore from a clone: push the mirror to a new remote, point a Vercel
project at it, and the next build reproduces the site. Nothing lives outside
the repository except the domain registration and the Vercel project settings.

**What is not backed up:** the source PDF volumes some records were cut from
live outside the repository, and the OCR working files under `tmp/` are
scratch. The volumes are recoverable rather than backed up — see below.

### The TÜSTAV source volumes

`scripts/tustav-pdf-extracts.json` cuts the published Aydınlık and İşçi Köylü
extracts out of five scanned volumes that live under `tmp/tustav-pdfs/`,
which is gitignored: they are TÜSTAV's scans, not this archive's, and what
this repository publishes is the article-scoped extract.

A clean checkout therefore has none of them:

```bash
npm run recover:tustav            # fetch what is missing, then verify
npm run recover:tustav -- --verify  # verify what is already on disk
```

Two independent proofs, because either alone has a gap:

- **Digest.** `scripts/tustav-pdf-sources.json` records the SHA-256 of each
  volume as verified. A match settles it outright.
- **Content.** The extraction is re-run and compared with the published
  extracts. This covers a volume whose digest is not yet recorded, and proves
  the recorded digest still corresponds to what the archive publishes.

The content comparison looks at **page images**. Two things it deliberately
does not compare, and why:

- *Bytes.* `pdfunite` stamps every output with a creation time and a document
  id, so two runs from one volume produce different files.
- *Extracted text.* These are image-only scans: `pdftotext` returns one form
  feed per page and **zero** readable characters. An earlier version of this
  script compared exactly that, which amounted to comparing the page count
  twice — a different scan with the same number of pages would have passed.

So each article PDF is compared by the SHA-256 of its embedded image streams
(`pdfimages -all`), which `pdfunite` copies through verbatim, and each cover
by its decoded pixels with a tolerance, since webp is lossy and encoder
versions differ. The tolerance sits in a measured gap: the same image through
a different encoder gives a mean per-sample difference of 0.43–0.54 with
nothing above 32, while two different covers of the same periodical at the
same dimensions give 6.96 with 5.7% of samples above 32.

**`public/` is never written to.** The rebuild goes to a temporary directory
via the extractor's `--out-root`, so nothing this script does — including a
crash in the comparison itself — can leave the published archive holding a
rebuild.

The İşçi Köylü cover is deliberately not compared: the published image is a
3400x2172 hand-prepared scan of the spread, not the 900x1267 strip the tool
renders, so that manifest entry carries `"coverOut": null`. The extractor
refuses to overwrite any cover whose dimensions differ from what it renders,
which is what surfaced this.

## Local verification

```bash
npm run serve:dist -- --port 4180
```

Serves `dist/` the way Vercel does: an exact file, then `<path>/index.html`,
then `<path>.html`, otherwise `404.html` with a real 404 status. It also
applies the redirects and headers from `vercel.json`.

Use this rather than `npm run preview` whenever status codes or headers
matter. Vite's preview rewrites every unmatched path to `index.html` and
answers 200, which is what hid the site's soft 404s.

**Limits of local verification.** This server approximates Vercel; it is not
Vercel. It does not reproduce the CDN, compression, HTTP/2, edge caching, or
any header Vercel adds on its own. Header and status behaviour in production
must be confirmed against a real deployment:

```bash
curl -sI https://<deployment>/tr/kose-yazilari/<slug> | head -20
curl -s -o /dev/null -w '%{http_code}\n' https://<deployment>/bir-adres-yok
```

## Media

`npm run inventory:media` reports which files under `public/archive/` the
site actually links.

At the time of writing: 611 files, 235.0 MiB, of which **43 PDFs (60.7 MiB)
are referenced by no record** — one per Cumhuriyet column. Each Cumhuriyet
record links its `cover.webp` clipping; the matching
`/archive/pdf/cumhuriyet/<year>/<slug>.pdf` is on disk, ships in the
deployment, and is reachable by URL, but nothing on the site points at it.

Everything under `public/` is copied into the deployment verbatim. Removing a
link from the UI does not stop the file being served.

Two coherent options, both the owner's call:

1. **Publish them.** Add `pdfSrc` (and `pdfPageCount`) to those 43 records.
   The reader already renders a PDF link for the seven records that have one,
   so this needs no UI work — readers would gain the full printed page.
2. **Stop shipping them.** Move the PDFs out of `public/` into a source
   archive kept in the repository but excluded from the build, so the
   provenance is preserved without publishing 60 MiB nobody links.

Do not simply delete them: they are source scans, and the archive's rule is
that nothing traceable is discarded. Whichever option is chosen, published
derivatives and retained sources should live in separate directories so the
distinction is visible.

## Content production tools

These run on a maintainer's machine, never in production.

| Command | What it does |
| --- | --- |
| `npm run ocr:scans` | OCRs incoming clipping scans into `tmp/ocr/` |
| `npm run split:archive -- --dry-run <file>` | Reports what a metadata/body split would change |
| `npm run generate:sitemap` | Rewrites `public/sitemap.xml` and `public/robots.txt` |
| `npm run generate:summary` | Rewrites `src/archive/summary.generated.ts` |
| `npm run generate:redirects` | Rewrites `vercel.json`'s redirects from the alias table |
| `npm run recover:tustav` | Re-fetches and verifies the TÜSTAV source volumes |
| `npm run verify:prerender` | Checks `dist/` against what the app builds |
| `python3 scripts/generate-fonts.py --src <dir>` | Rebuilds the subsetted web fonts |
| `python3 scripts/generate-og-image.py` | Rebuilds the social-preview card |

Rules these follow, and that any new tool should:

- **Lossless.** A tool that rewrites a data file preserves every field,
  derived from `ArchiveItemSeed` rather than a hand-written list.
- **Idempotent.** Running it twice changes nothing the second time.
- **Atomic.** Writes go through a temp file and a rename, so an interrupted
  run cannot leave a truncated source file.
- **Loud.** Anything ambiguous is a non-zero exit, never a silent skip.

`scripts/import-zaman-md.mjs` refuses to run against the current
clipping-based Zaman and Today's Zaman files, because it only knows how to
emit the older full-text model and would replace 341 real records.
`--force-overwrite` is the deliberate override.

### Reproducing content from a clean checkout

Not everything can be. `scripts/import-zaman-md.mjs`,
`scripts/import-p24-pdf-images.mjs` and `scripts/extract-tustav-pdf.mjs`
read source directories that live outside the repository (markdown exports,
P24 PDFs, TÜSTAV volumes). The *committed* archive data is the record; those
tools exist to add to it, not to regenerate it. The generated files that
**can** be reproduced from a clean checkout are the sitemap, robots.txt, the
archive summary, the fonts and the OG image, and CI proves the first three.

## Performance, and where it stops

Measured on the Turkish home page in the browser, first visit, uncompressed
transfer: **5.29 MB before, 0.93 MB after** — 4.3 MB of it was the Google
Fonts payload, and 468 kB the archive metadata the home page loaded to show
four counts.

What is still true, and what a next step would be:

- **Search loads every body of an outlet.** Searching the Turkish columns
  fetches `archive-tr-p24` — 410 kB raw, 153 kB gzip — because the search
  matches substrings across full text and there is no index to match against
  instead. It is lazy (only on search) and cached for the session. A
  build-time search index would avoid it, but a token index cannot answer the
  partial-word matches the current search supports, so it would change what
  the archive finds. That is a content decision, not just a performance one.
- **Opening one P24 article loads all 47 bodies**, for the same reason: they
  share one module. Splitting to one module per article would make the reader
  fetch ~8 kB instead of 410 kB, at the cost of 47 requests when someone
  searches. Worth doing if more full-text outlets are added.
- **Archive metadata is per language, not per outlet.** A Turkish list page
  fetches all 461 Turkish records (90 kB gzip) even to show one outlet. Going
  finer would mean per-outlet chunks and a loader per outlet.

## Fonts

`public/fonts/` holds subsets built by `scripts/generate-fonts.py` from the
upstream variable fonts. Licences are in `public/fonts/LICENSES.md`.

To add an icon: add its name to `ICONS` in that script, re-run it, and commit
the regenerated `material-symbols.woff2` and `icons.json`.
`npm run validate:content` fails if the app renders an icon the subset lacks,
because it would appear as the literal word.

## Monitoring

There is deliberately **no analytics and no visitor tracking**, and none
should be added — the audience is a family and researchers reading a
memorial record, not a funnel.

That is separate from knowing whether the site is up and correct. What exists
today, all privacy-preserving:

- CI catches build, type, lint, test, content, sitemap and structured-data
  regressions before a release.
- `npm run serve:dist` plus `curl` reproduces status codes and headers.
- Vercel's own deployment logs show build failures.

What does not exist yet, and needs a decision because each costs money or
adds an external service:

- Uptime checking. A single external HTTP check on the home page would catch
  a DNS or hosting outage. Any provider works; none is configured.
- Error reporting. Client-side render errors currently reach the browser
  console and the root error boundary, and nowhere else.
- Scheduled link checking for the external source URLs, many of which point
  at defunct newspaper sites. `archiveUrl` already carries a Wayback snapshot
  where one exists; a periodic check would show which records still need one.

## Deployment settings that live outside this repository

These cannot be set from the codebase. Checked against the live account on
2026-09-06; each entry says what was found, not what is assumed.

### Vercel deployment protection — already on

A preview deployment answers `302` with `content-type: text/plain` to an
unauthenticated request, which is Vercel's protection page. Previews are not
publicly readable. Nothing to change.

The consequence for verification: `curl` alone cannot read a preview's real
headers. Use the Vercel CLI, which sends the caller's own credentials:

```bash
npx vercel login          # once, interactively — a person has to do this
npx vercel curl https://<preview-url>/tr/kose-yazilari/<slug> -I
```

### Branch protection on `main` — not available on this plan

`main` is unprotected, and it cannot be protected as things stand: the
repository is **private on a free GitHub plan**, and both branch protection
and rulesets return

```
403  Upgrade to GitHub Pro or make this repository public to enable this feature.
```

Since every push to `main` is a production release, this matters. Three ways
out, all decisions for the owner:

1. **GitHub Pro** (a few dollars a month) — enables branch protection and
   rulesets on private repositories. Then require the `Typecheck, lint, test,
   validate, build` check and disallow force pushes.
2. **Make the repository public.** The archive is a public record and the code
   contains no secrets, so this is defensible on its own terms — but it is a
   publishing decision about the owner's working notes, not a technical one.
   Protection and secret scanning both become free.
3. **Accept the risk and rely on the discipline instead**: work on a branch,
   open a pull request, let CI run, merge only when green. That is what this
   change did. It is a convention, not an enforced rule.

### GitHub Secret Scanning and Push Protection — not available on this plan

The API reports no secret-scanning configuration for this repository. On a
private repository these are part of GitHub Secret Protection, a paid add-on;
they are free on public repositories.

Until one of those applies, `npm run check:secrets` in CI is the only net, and
it is a coarse one that reads the working tree rather than history — see
docs/SECURITY.md for exactly what it does not cover.

### If the repository is made public

Do these together, in this order:

1. Confirm nothing sensitive is in the history: `npm run check:secrets`, then
   a manual pass over `.env*`, `.vercel/` and `tmp/` — all gitignored today,
   so they should not appear in `git log --all --name-only`.
2. Flip visibility in **Settings → General → Danger Zone**.
3. Enable **Settings → Code security → Secret scanning** and **Push
   protection**.
4. Add a ruleset in **Settings → Rules** targeting `main`: require a pull
   request, require the status check named `Typecheck, lint, test, validate,
   build`, and block force pushes.
5. Re-check that the Vercel project is still linked and that previews stay
   protected — public repository does not imply public previews.

### Still outside all of the above

- **The production domain and its DNS.** `sahinalpay.net` is a placeholder;
  the registered domain is `sahinalpay.com`, and the switch is one edit to
  `SITE_ORIGIN` in `src/siteConfig.ts` once the owner confirms.
- **Whether the Vercel Toolbar is enabled on previews.** The
  Content-Security-Policy here is strict (`script-src 'self'`) and will block
  it. If the toolbar is wanted, `https://vercel.live` has to be allowed in
  `script-src`, `connect-src` and `frame-src` — which weakens the policy for
  production too, so it is a trade-off to make deliberately.
