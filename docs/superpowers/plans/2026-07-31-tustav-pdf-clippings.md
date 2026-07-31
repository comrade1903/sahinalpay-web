# TÜSTAV Clippings as Extracted PDFs + Tags — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the five TÜSTAV items' published OCR text and multi-page scan galleries with curated Turkish tags plus a single cover image that opens an extracted, article-scoped PDF in a new tab.

**Architecture:** A Node script (`scripts/extract-tustav-pdf.mjs`) reads a committed manifest, slices the article's pages out of the gitignored source volume in `tmp/tustav-pdfs/` with `pdfseparate` + `pdfunite`, and renders a size-controlled `cover.jpg` with `pdftoppm`. The seed data gains `tags`, `pdfSrc`, and `pdfPageCount` and loses `ocrText`; search swaps OCR text for tags. The reader renders tag badges and one cover image linked to the PDF, and the bespoke `ClippingLightbox` is deleted.

**Tech Stack:** React 19 + TypeScript (strict unused-checks, `verbatimModuleSyntax`, `erasableSyntaxOnly`), Vite 8, react-router-dom v7, oxlint, poppler CLI (`pdfinfo`, `pdfseparate`, `pdfunite`, `pdftoppm`).

**Spec:** `docs/superpowers/specs/2026-07-31-tustav-pdf-clippings-design.md`

## Global Constraints

- **There is no test framework in this repo** — no test script, no `*.test.*` / `*.spec.*` files. Do NOT add one. Every task's verification step uses the project's real commands: `npm run build` (runs `tsc -b` first), `npm run lint` (oxlint), `npm run validate:content`, and a browser check.
- **Never fabricate archive content.** No invented dates, quotes, titles, page numbers, or tags. Every tag must be traceable to text visible on a page scan that was actually read.
- **Every UI string must be added in both languages at once** (`src/content.ts` has one full copy per `Lang`). Never ship a string in one language only.
- **Do not push to `main`.** Pushing auto-deploys production via Vercel. Commit locally only; the owner decides when to push.
- All styling extends the hand-written design system in `src/index.css`. No CSS framework, no utility classes. Reuse existing custom properties (`--ink`, `--ink-soft`, `--line`, `--surface`, `--space-*`, `--measure`) and semantic class names.
- Icons are Material Symbols Outlined ligatures via `<span className="material-symbols-outlined">`.
- Visual changes must be checked in both light and dark themes (`data-theme` on `<html>`).
- Code, comments, and commit messages in English. Commit subject lines are imperative and describe the user-visible outcome.
- Source PDFs live in gitignored `tmp/tustav-pdfs/` and are NOT in the repo. Scripts that need them must fail loudly with the expected path.

## Verified Ground Truth

These facts were confirmed by inspecting the repo and rendering the source PDFs. Do not re-derive them by guesswork.

**Source mapping** — each seed's existing `url` already names the correct source volume, and each was visually confirmed by rendering the first page and reading the "şahin alpay" byline and headline:

| slug | source volume | pages | cover page | printed page |
|---|---|---|---|---|
| `aydinlik-devrimci-teorik-egitim` | `aydinlik/asd_02.pdf` | 57–74 | 57 | 144 |
| `aydinlik-osmanli-ticaret-sozlesmeleri` | `aydinlik/asd_06.pdf` | 24–51 | 24 | 438 |
| `aydinlik-turkiyenin-duzeni-uzerine` | `aydinlik/asd_12.pdf` | 36–65 | 36 | 448 |
| `pda-isci-sinifi-milli-demokratik-devrim` | `aydinlik/pda_3_17.pdf` | 19–42 | 19 | 353 |
| `isci-koylu-1-mayis-1970` | `isci-koylu/isci-koylu-16_1970.pdf` | 1–2 | **2** | 2 |

- **`asd_15` is a decoy.** Page 36 of `asd_15` also matches "şahin alpay" in OCR, but it is a different author's article ("OBJEKTİF ŞARTLAR ve SAĞ SAPMA") that merely cites Alpay in a footnote. `asd_12` is the correct volume for `turkiyenin-duzeni-uzerine`. Never pick a source volume by OCR hit count.
- **İşçi-Köylü's cover is PDF page 2, not page 1.** The issue is scanned as two-page spreads: PDF page 1 is the spread of newspaper pages 4+1, PDF page 2 is the spread of newspaper pages 2+1. Alpay's piece is at the top-left of newspaper page **2**. PDF page 1 does not show it.
- **Three İşçi-Köylü metadata errors confirmed from the scan** (headline and byline plainly legible, issue dated 3 Mayıs 1970):
  - `subtitle` says `s. 3` — the piece is on newspaper page **2**.
  - `title` is `"1 Mayıs"` — the printed headline is **"1 Mayıs Bayramı Halkımıza Kutlu Olsun"**.
  - `date` is `"1970"` — the issue is dated **3 Mayıs 1970**.
- **Encryption differs by outlet and dictates two code paths.** `pdfinfo` reports
  Aydınlık (`asd_*`, `pda_*`) as `Encrypted: no`, but **all 28 İşçi-Köylü volumes
  and all 149 Forum volumes** as `Encrypted: yes (print:no copy:no change:no
  addNotes:no algorithm:AES)` — permissions-only, no user password. Verified
  behaviour:
  - `pdftoppm` renders encrypted volumes fine → the cover path works everywhere.
  - `pdfseparate` succeeds on encrypted volumes.
  - **`pdfunite` refuses encrypted inputs**: `Unimplemented Feature: Could not
    merge encrypted files`.

  So the four Aydınlık entries use separate+unite, and İşçi-Köylü — whose range
  is the entire two-page file — is handled by copying the source verbatim.
  `qpdf` is not installed and is not needed for this plan.
- **Measured extraction sizes** (do not estimate; these are actual):
  `devrimci-teorik-egitim` 18 s. / 2.9 MB · `osmanli-ticaret-sozlesmeleri` 28 s. /
  3.8 MB · `turkiyenin-duzeni-uzerine` 30 s. / 4.3 MB ·
  `isci-sinifi-milli-demokratik-devrim` 24 s. / 3.6 MB · `1-mayis` 2 s. / 7.9 MB
  (whole-issue copy). Total 22.5 MB.
- **Poppler output naming** (confirmed empirically, must be globbed not predicted):
  - `pdfseparate -f 57 -l 74 src.pdf p-%d.pdf` emits `p-57.pdf` … `p-74.pdf` — the **absolute** page number, unpadded.
  - `pdftoppm -f N -l N src.pdf cover` emits `cover-<N>.jpg` where the number is zero-padded to the digit width of the source's **total** page count (89-page volume → `cover-57.jpg`; 2-page issue → `cover-2.jpg`).
- **Only these five items use scan clippings.** All P24 clippings are `kind: "photo"`; `imageSrc` appears in zero archive seeds. Deleting `ClippingLightbox` affects nothing else.
- Verified sizes: `asd_02` pages 57–74 → 3.0 MB PDF; cover at `-scale-to-x 1600` → 199 KB, 1600×2204.
- Existing asset weight to be deleted: 47 MB across `public/archive/clippings/{aydinlik,isci-koylu}`. `public/archive/clippings/p24/` (2.8 MB) is untouched.

## File Structure

**Create:**
- `scripts/extract-tustav-pdf.mjs` — manifest-driven PDF slicing + cover rendering. Sole responsibility: turn source volumes into published assets.
- `scripts/tustav-pdf-extracts.json` — the committed source→output mapping.
- `public/archive/pdf/aydinlik/{1968,1969,1970}/*.pdf`, `public/archive/pdf/isci-koylu/1970/*.pdf` — generated.
- `public/archive/clippings/{aydinlik,isci-koylu}/<year>/<slug>/cover.jpg` — generated.

**Modify:**
- `src/archive/types.ts` — add `tags`, `pdfSrc`, `pdfPageCount`; remove `ocrText`.
- `src/archive/itemUtils.ts:4-22` — `archiveItemText` swaps `clipping.ocrText` for `item.tags`.
- `src/archive/tr/analyses/aydinlik.ts` — rewrite four seeds.
- `src/archive/tr/analyses/isci-koylu.ts` — rewrite one seed, correcting title/date/subtitle.
- `scripts/archive-utils.mjs:~185` — collect `pdfSrc` into `assetPaths`.
- `src/content.ts` — `clippingViewer` copy: drop lightbox-only keys, add `openPdf`/`pages`.
- `src/App.tsx` — tag badges, cover-to-PDF link, delete lightbox + OCR details.
- `src/index.css` — add `.tag-list`/`.tag`; delete `.clipping-ocr*` and `.clipping-lightbox*`.

**Delete:**
- `public/archive/clippings/{aydinlik,isci-koylu}/**/page-*.jpg`.

---

### Task 1: Extraction script, manifest, and generated assets

**Files:**
- Create: `scripts/extract-tustav-pdf.mjs`
- Create: `scripts/tustav-pdf-extracts.json`
- Modify: `package.json` (add `extract:tustav-pdf` script)
- Generates: `public/archive/pdf/**/*.pdf`, `public/archive/clippings/**/cover.jpg`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: asset paths consumed by Task 2's seeds — `/archive/pdf/<outlet>/<year>/<slug>.pdf` and `/archive/clippings/<outlet>/<year>/<slug>/cover.jpg`. Also prints each output's page count, which Task 2 writes into `pdfPageCount`.

- [ ] **Step 1: Write the manifest**

Create `scripts/tustav-pdf-extracts.json`. `coverPage` is optional and defaults to `firstPage`; İşçi-Köylü needs it because Alpay's piece is on the second spread.

```json
[
  {
    "slug": "aydinlik-devrimci-teorik-egitim",
    "source": "aydinlik/asd_02.pdf",
    "firstPage": 57,
    "lastPage": 74,
    "pdfOut": "aydinlik/1968/devrimci-teorik-egitim.pdf",
    "coverOut": "aydinlik/1968/devrimci-teorik-egitim/cover.jpg"
  },
  {
    "slug": "aydinlik-osmanli-ticaret-sozlesmeleri",
    "source": "aydinlik/asd_06.pdf",
    "firstPage": 24,
    "lastPage": 51,
    "pdfOut": "aydinlik/1969/osmanli-ticaret-sozlesmeleri.pdf",
    "coverOut": "aydinlik/1969/osmanli-ticaret-sozlesmeleri/cover.jpg"
  },
  {
    "slug": "aydinlik-turkiyenin-duzeni-uzerine",
    "source": "aydinlik/asd_12.pdf",
    "firstPage": 36,
    "lastPage": 65,
    "pdfOut": "aydinlik/1969/turkiyenin-duzeni-uzerine.pdf",
    "coverOut": "aydinlik/1969/turkiyenin-duzeni-uzerine/cover.jpg"
  },
  {
    "slug": "pda-isci-sinifi-milli-demokratik-devrim",
    "source": "aydinlik/pda_3_17.pdf",
    "firstPage": 19,
    "lastPage": 42,
    "pdfOut": "aydinlik/1970/isci-sinifi-milli-demokratik-devrim.pdf",
    "coverOut": "aydinlik/1970/isci-sinifi-milli-demokratik-devrim/cover.jpg"
  },
  {
    "slug": "isci-koylu-1-mayis-1970",
    "source": "isci-koylu/isci-koylu-16_1970.pdf",
    "firstPage": 1,
    "lastPage": 2,
    "coverPage": 2,
    "pdfOut": "isci-koylu/1970/1-mayis.pdf",
    "coverOut": "isci-koylu/1970/1-mayis/cover.jpg"
  }
]
```

- [ ] **Step 2: Write the extraction script**

Create `scripts/extract-tustav-pdf.mjs`:

```js
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const ROOT = process.cwd()
const SOURCE_DIR = path.join(ROOT, 'tmp/tustav-pdfs')
const MANIFEST_PATH = path.join(ROOT, 'scripts/tustav-pdf-extracts.json')
const PDF_OUT_ROOT = path.join(ROOT, 'public/archive/pdf')
const CLIPPING_OUT_ROOT = path.join(ROOT, 'public/archive/clippings')
const COVER_WIDTH = 1600
const COVER_QUALITY = 82

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8' })
  if (result.error) {
    if (result.error.code === 'ENOENT') {
      throw new Error(`${command} not found. Install poppler: brew install poppler`)
    }
    throw result.error
  }
  if (result.status !== 0) {
    throw new Error(`${command} exited ${result.status}: ${result.stderr.trim()}`)
  }
  return result.stdout
}

function pdfInfo(pdfPath) {
  const stdout = run('pdfinfo', [pdfPath])
  const pages = stdout.match(/^Pages:\s+(\d+)$/m)
  if (!pages) throw new Error(`Could not read page count from ${pdfPath}`)
  return {
    pages: Number(pages[1]),
    // İşçi-Köylü and Forum volumes carry permissions-only AES encryption.
    // pdftoppm and pdfseparate cope with it; pdfunite refuses to merge.
    encrypted: /^Encrypted:\s+yes/m.test(stdout),
  }
}

function pageCount(pdfPath) {
  return pdfInfo(pdfPath).pages
}

/** pdfseparate names files by absolute page number, unpadded: p-57.pdf … p-74.pdf.
    Sort numerically — lexicographic order would give p-1, p-10, p-2. */
function orderedPagePdfs(dir) {
  return fs
    .readdirSync(dir)
    .filter((name) => /^p-\d+\.pdf$/.test(name))
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]))
    .map((name) => path.join(dir, name))
}

/** pdftoppm zero-pads the page suffix to the digit width of the source's total
    page count, so the exact filename is not predictable. Glob it instead. */
function soleFile(dir, extension) {
  const files = fs.readdirSync(dir).filter((name) => name.endsWith(extension))
  if (files.length !== 1) {
    throw new Error(`Expected exactly one ${extension} in ${dir}, found ${files.length}`)
  }
  return path.join(dir, files[0])
}

function extract(entry) {
  const sourcePath = path.join(SOURCE_DIR, entry.source)
  if (!fs.existsSync(sourcePath)) {
    throw new Error(
      `Missing source volume for "${entry.slug}": ${sourcePath}\n` +
        'TÜSTAV volumes are not in the repo. Place them under tmp/tustav-pdfs/.',
    )
  }

  const { pages: total, encrypted } = pdfInfo(sourcePath)
  if (entry.firstPage < 1 || entry.lastPage > total || entry.firstPage > entry.lastPage) {
    throw new Error(
      `"${entry.slug}": page range ${entry.firstPage}-${entry.lastPage} is outside ${entry.source} (${total} pages)`,
    )
  }
  const wholeFile = entry.firstPage === 1 && entry.lastPage === total
  if (encrypted && !wholeFile) {
    throw new Error(
      `"${entry.slug}": ${entry.source} is encrypted and only pages ` +
        `${entry.firstPage}-${entry.lastPage} of ${total} are wanted. pdfunite cannot ` +
        'merge encrypted pages. Install qpdf (brew install qpdf) and pre-decrypt the ' +
        'volume with: qpdf --decrypt in.pdf out.pdf',
    )
  }
  const coverPage = entry.coverPage ?? entry.firstPage
  if (coverPage < entry.firstPage || coverPage > entry.lastPage) {
    throw new Error(
      `"${entry.slug}": coverPage ${coverPage} is outside its own range ${entry.firstPage}-${entry.lastPage}`,
    )
  }

  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tustav-'))
  try {
    const pdfOut = path.join(PDF_OUT_ROOT, entry.pdfOut)
    fs.mkdirSync(path.dirname(pdfOut), { recursive: true })
    if (wholeFile) {
      // The article spans the entire source (İşçi-Köylü issues are 2-page
      // papers). Copying sidesteps pdfunite's encrypted-input limitation.
      fs.copyFileSync(sourcePath, pdfOut)
    } else {
      run('pdfseparate', [
        '-f', String(entry.firstPage),
        '-l', String(entry.lastPage),
        sourcePath,
        path.join(workDir, 'p-%d.pdf'),
      ])
      run('pdfunite', [...orderedPagePdfs(workDir), pdfOut])
    }

    const coverOut = path.join(CLIPPING_OUT_ROOT, entry.coverOut)
    fs.mkdirSync(path.dirname(coverOut), { recursive: true })
    const coverDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tustav-cover-'))
    try {
      run('pdftoppm', [
        '-jpeg',
        '-jpegopt', `quality=${COVER_QUALITY}`,
        '-f', String(coverPage),
        '-l', String(coverPage),
        '-scale-to-x', String(COVER_WIDTH),
        '-scale-to-y', '-1',
        sourcePath,
        path.join(coverDir, 'cover'),
      ])
      fs.copyFileSync(soleFile(coverDir, '.jpg'), coverOut)
    } finally {
      fs.rmSync(coverDir, { recursive: true, force: true })
    }

    return {
      slug: entry.slug,
      pdfPages: pageCount(pdfOut),
      pdfBytes: fs.statSync(pdfOut).size,
      coverBytes: fs.statSync(coverOut).size,
    }
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true })
  }
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
const results = manifest.map(extract)

for (const result of results) {
  console.log(
    `${result.slug}: pdfPageCount=${result.pdfPages} ` +
      `pdf=${(result.pdfBytes / 1024 / 1024).toFixed(1)}MB ` +
      `cover=${Math.round(result.coverBytes / 1024)}KB`,
  )
}
console.log(`Extracted ${results.length} TÜSTAV articles.`)
```

- [ ] **Step 3: Register the npm script**

In `package.json`, add to `"scripts"` alongside the other `import:`/`split:` entries:

```json
"extract:tustav-pdf": "node scripts/extract-tustav-pdf.mjs"
```

- [ ] **Step 4: Verify the failure path first**

Temporarily rename the source dir so the script must fail cleanly, confirming the error message names the missing path rather than throwing a raw stack trace:

```bash
mv tmp/tustav-pdfs tmp/tustav-pdfs-hidden
npm run extract:tustav-pdf; echo "exit=$?"
mv tmp/tustav-pdfs-hidden tmp/tustav-pdfs
```

Expected: non-zero exit, message containing `Missing source volume for "aydinlik-devrimci-teorik-egitim": …/tmp/tustav-pdfs/aydinlik/asd_02.pdf`.

- [ ] **Step 5: Run the extraction**

```bash
npm run extract:tustav-pdf
```

Expected output (page counts and PDF sizes were measured on these exact
sources and must match; cover sizes are approximate):

```
aydinlik-devrimci-teorik-egitim: pdfPageCount=18 pdf=2.9MB cover=199KB
aydinlik-osmanli-ticaret-sozlesmeleri: pdfPageCount=28 pdf=3.8MB cover=~200KB
aydinlik-turkiyenin-duzeni-uzerine: pdfPageCount=30 pdf=4.3MB cover=~200KB
pda-isci-sinifi-milli-demokratik-devrim: pdfPageCount=24 pdf=3.6MB cover=~200KB
isci-koylu-1-mayis-1970: pdfPageCount=2 pdf=7.9MB cover=~250KB
Extracted 5 TÜSTAV articles.
```

**Record the five `pdfPageCount` values — Task 2 writes them into the seeds.**

If any cover exceeds 400 KB, stop and report it rather than proceeding.

- [ ] **Step 6: Verify the İşçi-Köylü cover shows Alpay's piece**

This is the one entry where the cover is not the first page. Open it and confirm the top-left headline reads "1 Mayıs Bayramı Halkımıza Kutlu Olsun" with the "Şahin ALPAY" byline beneath it:

```bash
open public/archive/clippings/isci-koylu/1970/1-mayis/cover.jpg
```

If it instead shows the front page with the "İŞÇİ-KÖYLÜ" masthead and the red banner illustration, `coverPage` is wrong — do not proceed.

- [ ] **Step 7: Spot-check one extracted PDF**

```bash
pdfinfo public/archive/pdf/aydinlik/1969/turkiyenin-duzeni-uzerine.pdf | grep -E '^Pages'
open public/archive/pdf/aydinlik/1969/turkiyenin-duzeni-uzerine.pdf
```

Expected: `Pages: 30`, and page 1 shows the "şahin alpay" byline with the title «"türkiye'nin düzeni" üzerine» and printed page number 448.

Then confirm the İşçi-Köylü output really is the verbatim source copy (the encrypted whole-file path):

```bash
cmp tmp/tustav-pdfs/isci-koylu/isci-koylu-16_1970.pdf public/archive/pdf/isci-koylu/1970/1-mayis.pdf && echo identical
```

Expected: `identical`.

- [ ] **Step 8: Commit**

```bash
git add scripts/extract-tustav-pdf.mjs scripts/tustav-pdf-extracts.json package.json public/archive/pdf public/archive/clippings
git commit -m "Extract article-scoped PDFs and covers from TUSTAV volumes"
```

---

### Task 2: Data model, seeds, and content validation

**Files:**
- Modify: `src/archive/types.ts`
- Modify: `src/archive/itemUtils.ts:4-22`
- Modify: `src/archive/tr/analyses/aydinlik.ts` (full rewrite)
- Modify: `src/archive/tr/analyses/isci-koylu.ts` (full rewrite)
- Modify: `scripts/archive-utils.mjs` (`assetPaths` in `readArchiveEntries`)
- Delete: `public/archive/clippings/{aydinlik,isci-koylu}/**/page-*.jpg`

**Interfaces:**
- Consumes: from Task 1, the generated asset paths and the printed `pdfPageCount` values.
- Produces: `ArchiveItemSeed.tags?: string[]`, `ArchiveItemSeed.pdfSrc?: string`, `ArchiveItemSeed.pdfPageCount?: number`; `ArchiveClipping` no longer has `ocrText`. Task 3's UI reads `item.tags`, `item.pdfSrc`, `item.pdfPageCount`, and `itemScanClippings(item)[0]`.

- [ ] **Step 1: Update the types**

In `src/archive/types.ts`, delete the `ocrText?: string` line from `ArchiveClipping`, and add three fields to `ArchiveItemSeed` after `clippings`:

```ts
export interface ArchiveClipping {
  src: string
  thumbSrc?: string
  alt?: string
  pageLabel?: string
  sourceNote?: string
  /** 'photo' renders as the article's lead image; 'scan' (default) is the
      newspaper cover that links to the full PDF. */
  kind?: 'photo' | 'scan'
}
```

```ts
  clippings?: ArchiveClipping[]
  /** Free-form Turkish subject tags. Rendered as badges and matched by search.
      Replaces published OCR text for scan-only items. */
  tags?: string[]
  /** Article-scoped PDF sliced out of the source volume, served from public/. */
  pdfSrc?: string
  /** Page count of `pdfSrc`, rendered next to the cover. */
  pdfPageCount?: number
```

- [ ] **Step 2: Point search at tags instead of OCR**

In `src/archive/itemUtils.ts`, replace the body of `archiveItemText` so it reads `item.tags` and no longer reads `clipping.ocrText`:

```ts
export function archiveItemText(item: ArchiveItem, loadedBody?: string[]): string {
  const body = loadedBody ?? item.body ?? getCachedBody(item)
  return [
    item.title,
    item.subtitle,
    item.excerpt,
    item.sourceNote,
    item.imageCredit,
    ...(item.tags ?? []),
    ...(body ?? []),
    ...(item.clippings ?? []).flatMap((clipping) => [
      clipping.alt,
      clipping.sourceNote,
      clipping.pageLabel,
    ]),
  ]
    .filter(Boolean)
    .join(' ')
}
```

- [ ] **Step 3: Read the scans and propose tags for owner approval**

**This step gates the commit. Do not invent tags.**

Before deleting the `page-*.jpg` files, open each article's pages and read them. Draw tags only from what the pages actually say — subject matter, named people, named works, key concepts, and the year.

The following starting set was derived from the first page of each article, which was read directly during design. Extend it by reading the remaining pages; drop anything you cannot see on a page.

```
aydinlik-devrimci-teorik-egitim
  ["devrimci teori", "Lenin", "ideolojik mücadele", "sosyalist aydınlar", "27 Mayıs", "1968"]
  (page 1 carries the Lenin epigraph "Devrimci teori olmadan devrimci hareket
   olamaz" and discusses 27 Mayıs, işçi sınıfı ideolojisi, sosyalist aydınlar)

aydinlik-osmanli-ticaret-sozlesmeleri
  ["Osmanlı İmparatorluğu", "Balta Limanı Antlaşması", "kapitülasyonlar",
   "yarı-sömürgeleşme", "ticaret sözleşmeleri", "iktisat tarihi", "1969"]
  (page 1 names the 1838 Balta Limanı sözleşmesi, the 1842 Nanking Sözleşmesi,
   kapitülasyonlar, and yarı-feodal / yarı-sömürge)

aydinlik-turkiyenin-duzeni-uzerine
  ["Şefik Hüsnü", "milli demokratik devrim", "Kemalizm", "sınıf mücadelesi", "1969"]
  (page 1 cites Dr. Şefik Hüsnü and discusses the Kemalist devrim and the three
   sınıf hareketi currents. NOTE: do NOT add "Doğan Avcıoğlu" unless his name is
   actually visible on a page — the title's quotation marks suggest his book but
   that is an inference, not evidence.)

pda-isci-sinifi-milli-demokratik-devrim
  ["milli demokratik devrim", "işçi sınıfı", "1961 Anayasası",
   "Aybar-Aren oportünizmi", "proleter devrimci hareket", "1970"]
  (page 1 names the 1961 Anayasası and "sağ teslimiyetçi Aybar-Aren
   oportünizmi" verbatim)

isci-koylu-1-mayis-1970
  ["1 Mayıs", "işçi bayramı", "sendikal mücadele", "emperyalizm",
   "işçi sınıfı", "1970"]
  (page 2 of the PDF carries the headline and the sendikalar / patronlar /
   bağımsız ve demokratik Türkiye argument)
```

Present the final list to the owner in Turkish and wait for approval before continuing.

- [ ] **Step 4: Rewrite the İşçi-Köylü seed**

Replace the whole array body in `src/archive/tr/analyses/isci-koylu.ts`. This corrects three confirmed metadata errors (title, date, page number) and drops the OCR caveat from `sourceNote`:

```ts
import type { ArchiveItemSeed } from '../../types'

export const isciKoyluAnalysisSeeds: ArchiveItemSeed[] = [
  {
    slug: "isci-koylu-1-mayis-1970",
    title: "1 Mayıs Bayramı Halkımıza Kutlu Olsun",
    date: "3 Mayıs 1970",
    subtitle: "İşçi Köylü, sayı 16, s. 2",
    excerpt: "1 Mayıs İşçi Bayramı vesilesiyle kaleme alınmış, işçi sınıfının uluslararası dayanışması ve sendikal mücadelesi üzerine kısa bir yazı.",
    sourceNote: "TÜSTAV Süreli Yayınlar Arşivi taramasından tespit edilmiştir.",
    url: "https://tustav.org/yayinlar/sureli_yayinlar/isci-koylu/isci-koylu-16_1970.pdf",
    tags: ["1 Mayıs", "işçi bayramı", "sendikal mücadele", "emperyalizm", "işçi sınıfı", "1970"],
    pdfSrc: "/archive/pdf/isci-koylu/1970/1-mayis.pdf",
    pdfPageCount: 2,
    clippings: [
      {
        src: "/archive/clippings/isci-koylu/1970/1-mayis/cover.jpg",
        alt: "İşçi Köylü, sayı 16, 3 Mayıs 1970, sayfa 2",
        pageLabel: "Sayfa 2",
      },
    ],
  },
]
```

- [ ] **Step 5: Rewrite the Aydınlık seeds**

Replace the whole array body in `src/archive/tr/analyses/aydinlik.ts`. Keep every existing `slug`, `title`, `date`, `subtitle`, `excerpt`, and `url` exactly as they are — only `sourceNote` loses its OCR caveat, and `tags` / `pdfSrc` / `pdfPageCount` / the single cover clipping are new. Substitute the approved tag lists from Step 3.

```ts
import type { ArchiveItemSeed } from '../../types'

export const aydinlikAnalysisSeeds: ArchiveItemSeed[] = [
  {
    slug: "aydinlik-devrimci-teorik-egitim",
    title: "Devrimci Teorik Eğitim",
    date: "Aralık 1968",
    subtitle: "Aydınlık, sayı 2, s. 144",
    excerpt: "Marksist klasiklerden oluşan bir okuma programı sunan, \"Devrimci Kitap, Devrimci Bir Silâhtır\" alt başlığını taşıyan pedagojik bir deneme.",
    sourceNote: "TÜSTAV Süreli Yayınlar Arşivi taramasından tespit edilmiştir.",
    url: "https://tustav.org/yayinlar/sureli_yayinlar/aydinlik/asd/asd_02.pdf",
    tags: ["devrimci teori", "Lenin", "ideolojik mücadele", "sosyalist aydınlar", "27 Mayıs", "1968"],
    pdfSrc: "/archive/pdf/aydinlik/1968/devrimci-teorik-egitim.pdf",
    pdfPageCount: 18,
    clippings: [
      {
        src: "/archive/clippings/aydinlik/1968/devrimci-teorik-egitim/cover.jpg",
        alt: "Aydınlık, sayı 2, s. 144",
        pageLabel: "s. 144",
      },
    ],
  },
  {
    slug: "aydinlik-osmanli-ticaret-sozlesmeleri",
    title: "XIX. Yüzyıl Ticaret Sözleşmeleri ve Osmanlı Toplum Yapısı Üzerine Etkileri",
    date: "Nisan 1969",
    subtitle: "Aydınlık, sayı 6, s. 438",
    excerpt: "19. yüzyılda Osmanlı Devleti'nin imzaladığı ticaret sözleşmelerinin toplum yapısı üzerindeki etkilerini inceleyen tarihsel-teorik bir inceleme.",
    sourceNote: "TÜSTAV Süreli Yayınlar Arşivi taramasından tespit edilmiştir.",
    url: "https://tustav.org/yayinlar/sureli_yayinlar/aydinlik/asd/asd_06.pdf",
    tags: ["Osmanlı İmparatorluğu", "Balta Limanı Antlaşması", "kapitülasyonlar", "yarı-sömürgeleşme", "ticaret sözleşmeleri", "iktisat tarihi", "1969"],
    pdfSrc: "/archive/pdf/aydinlik/1969/osmanli-ticaret-sozlesmeleri.pdf",
    pdfPageCount: 28,
    clippings: [
      {
        src: "/archive/clippings/aydinlik/1969/osmanli-ticaret-sozlesmeleri/cover.jpg",
        alt: "Aydınlık, sayı 6, s. 438",
        pageLabel: "s. 438",
      },
    ],
  },
  {
    slug: "aydinlik-turkiyenin-duzeni-uzerine",
    title: "\"Türkiye'nin Düzeni\" Üzerine",
    date: "Ekim 1969",
    subtitle: "Aydınlık, sayı 12, s. 448",
    excerpt: "Türkiye'nin toplumsal ve siyasal düzeni, milli demokratik devrim ve proletaryanın öncülüğü meseleleri üzerine kapsamlı bir teorik yazı. Sonraki sayılarda başka yazarlar tarafından sıkça alıntılanıp tartışılmıştır.",
    sourceNote: "TÜSTAV Süreli Yayınlar Arşivi taramasından tespit edilmiştir.",
    url: "https://tustav.org/yayinlar/sureli_yayinlar/aydinlik/asd/asd_12.pdf",
    tags: ["Şefik Hüsnü", "milli demokratik devrim", "Kemalizm", "sınıf mücadelesi", "1969"],
    pdfSrc: "/archive/pdf/aydinlik/1969/turkiyenin-duzeni-uzerine.pdf",
    pdfPageCount: 30,
    clippings: [
      {
        src: "/archive/clippings/aydinlik/1969/turkiyenin-duzeni-uzerine/cover.jpg",
        alt: "Aydınlık, sayı 12, s. 448",
        pageLabel: "s. 448",
      },
    ],
  },
  {
    slug: "pda-isci-sinifi-milli-demokratik-devrim",
    title: "İşçi Sınıfı ve Milli Demokratik Devrim",
    date: "Mart 1970",
    subtitle: "Proleter Devrimci Aydınlık (PDA), sayı 3-17, s. 353",
    excerpt: "İşçi sınıfının milli demokratik devrimdeki öncülüğünün objektif ve sübjektif şartları üzerine bir teorik tartışma yazısı.",
    sourceNote: "TÜSTAV Süreli Yayınlar Arşivi taramasından tespit edilmiştir.",
    url: "https://tustav.org/yayinlar/sureli_yayinlar/aydinlik/pda/pda_3_17.pdf",
    tags: ["milli demokratik devrim", "işçi sınıfı", "1961 Anayasası", "Aybar-Aren oportünizmi", "proleter devrimci hareket", "1970"],
    pdfSrc: "/archive/pdf/aydinlik/1970/isci-sinifi-milli-demokratik-devrim.pdf",
    pdfPageCount: 24,
    clippings: [
      {
        src: "/archive/clippings/aydinlik/1970/isci-sinifi-milli-demokratik-devrim/cover.jpg",
        alt: "Proleter Devrimci Aydınlık, sayı 3-17, s. 353",
        pageLabel: "s. 353",
      },
    ],
  },
]
```

Note the PDA entry gains `s. 353` in its `subtitle` (the printed page number is legible on the scan) and its `excerpt` drops the "burada aktarılan sayfalar makalenin tamamını kapsamayabilir" hedge, which existed because the old scan set was a partial render; the PDF now carries pages 19–42 contiguously.

- [ ] **Step 6: Teach the validator about `pdfSrc`**

In `scripts/archive-utils.mjs`, extend the `assetPaths` array inside `readArchiveEntries`:

```js
        assetPaths: [
          ...stringFields(objectSource, 'src'),
          ...stringFields(objectSource, 'thumbSrc'),
          ...stringFields(objectSource, 'imageSrc'),
          ...stringFields(objectSource, 'pdfSrc'),
        ].filter((assetPath) => assetPath.startsWith('/archive/')),
```

- [ ] **Step 7: Delete the superseded page scans**

Only after Step 3's tagging is done, since those files are the evidence:

```bash
find public/archive/clippings/aydinlik public/archive/clippings/isci-koylu -name 'page-*.jpg' -delete
find public/archive/clippings -name '*.jpg' | wc -l
du -sh public/archive/clippings/*
```

Expected: 52 jpgs remain (47 P24 photos + 5 covers), `aydinlik` and `isci-koylu` down to roughly 0.6 MB and 0.25 MB.

- [ ] **Step 8: Verify**

```bash
npm run validate:content
npm run build
npm run lint
```

Expected: `Content validation passed for 1080 archive entries.` — the count is unchanged from before this plan, since no items are added or removed. A different number means a seed was accidentally dropped or duplicated. Also expect `tsc -b` clean (the removal of `ocrText` from the type would fail the build if any seed still carried it); oxlint clean.

- [ ] **Step 9: Commit**

```bash
git add src/archive scripts/archive-utils.mjs public/archive/clippings
git commit -m "Replace TUSTAV OCR text with curated tags and article PDFs"
```

---

### Task 3: Reader UI — tag badges, PDF cover link, lightbox removal

**Files:**
- Modify: `src/content.ts` (`clippingViewer` type at ~line 115, English at ~402, Turkish at ~606)
- Modify: `src/App.tsx` (imports ~38-42; `lightboxIndex` at 2116; `openableScans` at 2200; byline block ending ~2290; clipping viewer 2316-2372; lightbox render 2423-2432; `LightboxScan` at 2529; `ClippingLightbox` from ~2536 to end of component; `ZOOM_STEPS` const)
- Modify: `src/index.css` (`.clipping-ocr*` at 2142-2160; `.clipping-lightbox*` at 2206-2271)

**Interfaces:**
- Consumes: `item.tags`, `item.pdfSrc`, `item.pdfPageCount` from Task 2. The cover comes from the existing local `scans` array (`src/App.tsx:2198`, `item.clippings` filtered to `kind !== 'photo'`), not from a new helper.
- Produces: no new exports. `content[lang].clippingViewer` narrows to `{ heading: string; openPdf: string; pagesSuffix: string }` — `src/App.tsx` is its only reader.

- [ ] **Step 1: Replace the `clippingViewer` copy**

In `src/content.ts`, replace the type block (currently `dialogLabel` / `viewOriginal` / `close` / `zoomIn` / `zoomOut` / `fit` / `prevPage` / `nextPage` / `showOcr` / `openNewTab`) with:

```ts
  clippingViewer: {
    heading: string
    openPdf: string
    pagesSuffix: string
  }
```

English (`~line 402`):

```ts
    clippingViewer: {
      heading: 'Newspaper Clipping',
      openPdf: 'Read the full scan as a PDF',
      pagesSuffix: 'pages',
    },
```

Turkish (`~line 606`):

```ts
    clippingViewer: {
      heading: 'Gazete Kupürü',
      openPdf: 'Tamamını PDF olarak oku',
      pagesSuffix: 'sayfa',
    },
```

- [ ] **Step 2: Add the tag styles**

In `src/index.css`, immediately before `.clipping-viewer` (line 2113), add:

```css
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: var(--space-2);
  padding: 0;
  list-style: none;
}
.tag {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
  color: var(--ink-soft);
  font-family: var(--body);
  font-size: 0.78rem;
  line-height: 1.5;
  letter-spacing: 0.01em;
}
```

- [ ] **Step 3: Delete the obsolete styles**

In `src/index.css`, delete the `.clipping-ocr`, `.clipping-ocr summary`, and `.clipping-ocr p` rules (lines ~2142-2160) and every `.clipping-lightbox*` rule (lines ~2206-2271, from `.clipping-lightbox {` through the end of `.clipping-lightbox-ocr p { … }`). Stop before `.related-articles`.

Keep `.clipping-viewer`, `.clipping-frame`, `.clipping-open`, and `.clipping-open-hint` — the cover link still uses them.

- [ ] **Step 4: Render the tag badges**

In `src/App.tsx`, directly after the `</div>` that closes `<div className="article-byline">` (just before the `</Reveal>` at ~line 2290), insert:

```tsx
          {item.tags && item.tags.length > 0 && (
            <ul className="tag-list">
              {item.tags.map((tag) => (
                <li className="tag" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          )}
```

- [ ] **Step 5: Replace the clipping viewer with a single cover link**

In `src/App.tsx`, replace the entire `{(item.imageSrc || scans.length > 0) && ( … )}` block (lines ~2316-2372) with:

```tsx
        {cover && (
          <Reveal as="aside" className="clipping-viewer" delay={0.12}>
            <h2>{content[lang].clippingViewer.heading}</h2>
            <figure className="clipping-frame">
              {item.pdfSrc ? (
                <a
                  className="clipping-open"
                  href={item.pdfSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={cover.src} alt={cover.alt ?? item.title} loading="lazy" />
                  <span className="clipping-open-hint">
                    <span className="material-symbols-outlined" aria-hidden="true">
                      picture_as_pdf
                    </span>
                    {content[lang].clippingViewer.openPdf}
                  </span>
                </a>
              ) : (
                <img src={cover.src} alt={cover.alt ?? item.title} loading="lazy" />
              )}
              <figcaption>
                {cover.pageLabel ?? item.subtitle}
                {item.pdfPageCount
                  ? ` · ${item.pdfPageCount} ${content[lang].clippingViewer.pagesSuffix}`
                  : ''}
              </figcaption>
            </figure>
          </Reveal>
        )}
```

- [ ] **Step 6: Replace `openableScans` with `cover`**

In `src/App.tsx`, replace the `openableScans` declaration (lines ~2200-2203) with:

```tsx
  const cover: ArchiveClipping | null =
    scans[0] ?? (item.imageSrc ? { src: item.imageSrc, alt: item.title } : null)
```

Add `ArchiveClipping` to the existing type import at lines 38-42:

```tsx
import type {
  ArchiveClipping,
  ArchiveItem,
  FlatArchiveSection,
  OutletArchiveSection,
} from './archive/types'
```

- [ ] **Step 7: Delete the lightbox**

In `src/App.tsx`:

1. Delete the `const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)` line (~2116).
2. Delete the `{lightboxIndex !== null && openableScans[lightboxIndex] && ( <ClippingLightbox … /> )}` block (~2423-2432).
3. Delete the `ZOOM_STEPS` const, the `LightboxScan` interface (~2529), and the entire `ClippingLightbox` function component.

`tsc -b` runs with strict unused checks, so any leftover reference or now-unused import (e.g. `useState` if nothing else needs it — it does, so keep it) will fail the build. Let the compiler find them.

- [ ] **Step 8: Verify build and lint**

```bash
npm run build
npm run lint
```

Expected: both clean. If `tsc` reports an unused import or symbol, delete it — do not suppress it.

- [ ] **Step 9: Commit**

```bash
git add src/App.tsx src/content.ts src/index.css
git commit -m "Open TUSTAV clippings as article PDFs and show subject tags"
```

---

### Task 4: End-to-end verification

**Files:** none modified unless a defect is found.

**Interfaces:**
- Consumes: everything from Tasks 1-3.
- Produces: a verified, committed state ready for the owner to push.

- [ ] **Step 1: Run the full gate**

```bash
npm run build && npm run lint && npm run validate:content
```

All three must pass. Do not proceed on a failure — fix it and re-run.

- [ ] **Step 2: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 3: Check a long Aydınlık article in Turkish**

Open `http://localhost:5173/tr/analizler/aydinlik-turkiyenin-duzeni-uzerine` and confirm:

- Tag badges render under the byline: Şefik Hüsnü, milli demokratik devrim, Kemalizm, sınıf mücadelesi, 1969.
- Exactly **one** cover image appears under "Gazete Kupürü" — not 30.
- The caption reads `s. 448 · 30 sayfa`.
- No "OCR metnini göster" disclosure anywhere on the page.
- Clicking the cover opens `/archive/pdf/aydinlik/1969/turkiyenin-duzeni-uzerine.pdf` in a **new tab**, showing a 30-page PDF whose first page is Alpay's article.
- Toggle the theme; check the tag badges and the cover frame in both light and dark.
- Narrow the viewport to 375px; confirm the tag list wraps and the cover scales without horizontal page scroll.

- [ ] **Step 4: Check the İşçi-Köylü article**

Open `http://localhost:5173/tr/analizler/isci-koylu-1-mayis-1970` and confirm:

- Title reads "1 Mayıs Bayramı Halkımıza Kutlu Olsun", date "3 Mayıs 1970", subtitle "İşçi Köylü, sayı 16, s. 2".
- The cover is the spread whose top-left headline matches the title — **not** the front page with the masthead and red banner.
- Caption reads `Sayfa 2 · 2 sayfa`.

- [ ] **Step 5: Confirm search still finds these items via tags**

On `http://localhost:5173/tr/analizler`, type `Kemalizm` into the search box. Expected: `"Türkiye'nin Düzeni" Üzerine` appears. Then search `Balta Limanı`. Expected: the Osmanlı ticaret sözleşmeleri piece appears. Both terms exist only in `tags`, proving the `archiveItemText` swap works.

Also set the source filter to "Gazete kupürü" and confirm all five TÜSTAV items still appear — `itemHasSourceKind` keys off the clippings array, which still has one entry each.

- [ ] **Step 6: Regression-check P24 (lightbox removal)**

Open a P24 column that has a lead photo, e.g. `http://localhost:5173/tr/kose-yazilari/hayatin-ironisi`, and confirm the lead photo still renders, no console errors appear, and nothing tries to open a lightbox.

- [ ] **Step 7: Check the English side**

Open `http://localhost:5173/analyses`. Expected: the English `TurkishArchiveHub` explainer still renders and links to the Turkish archive. Open `http://localhost:5173/analyses/aydinlik-turkiyenin-duzeni-uzerine`. Expected: redirect home, as before — English item routes for Turkish-only content are intentional redirects.

- [ ] **Step 8: Confirm the repo got lighter**

```bash
du -sh public/archive/clippings public/archive/pdf
git status --short
```

Expected: clippings roughly 3.9 MB total (P24 2.8 MB + ~1.1 MB of covers), pdf 22.5 MB, working tree clean. Compared with the 47 MB of page scans deleted in Task 2, the net change is about **−23 MB**.

- [ ] **Step 9: Report to the owner**

Summarize in Turkish: what changed, the three İşçi-Köylü metadata corrections and the evidence for them, the final tag lists, and the size delta. State explicitly that nothing has been pushed and ask whether to push to `main` (which deploys production).

---

## Notes for the implementer

- **`npm run generate:sitemap` is not needed.** No routes, slugs, or items were added or removed — only fields within existing items changed.
- **`public/llms.txt` is not affected.** It duplicates the biography, not archive item metadata.
- If a tag you want to add cannot be found on a page you actually read, leave it out. A thin but true tag list is correct; a rich invented one is a content-integrity failure and the whole point of this change is accuracy.
- The 149 unprocessed Forum volumes in `tmp/tustav-pdfs/forum/` are explicitly out of scope. `src/archive/tr/analyses/forum.ts` stays an empty array.
- When the Forum sub-project starts, it will hit the encrypted-partial-range guard this script raises: every Forum volume is AES-encrypted and Forum articles are a few pages inside a large issue. That work needs `brew install qpdf` and a `qpdf --decrypt` pre-pass (permissions-only encryption strips without a password). Do not weaken the guard now to make that case pass silently.
