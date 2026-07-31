# TÜSTAV Kupürleri: Ayıklanmış PDF + Etiketler — Design

**Date:** 2026-07-31
**Status:** Approved (design), pending implementation plan
**Supersedes:** `2026-07-30-clipping-lightbox-design.md` (see "Superseded work")

## Problem

The archive's five TÜSTAV-sourced pieces (4 Aydınlık, 1 İşçi-Köylü) are
scan-only. They carry no typeset body — their only machine-readable text is
low-quality OCR of 1968–1970 newsprint, which is unfit to publish and barely
usable for search. Three concrete failures today:

1. **Bad text is on the site.** Each scan carries an `ocrText` blob rendered in
   a "OCR metnini göster" `<details>`. The output is garbled ("İşçi — RöyLO EN
   8 Ans 1"), which reads as carelessness on a legacy archive where accuracy is
   the point.
2. **Reading the original is awkward.** Aydınlık pieces run 18–30 pages, and the
   reader stacks every page as a separate `<img>` at reading-column width. The
   lightbox added on 2026-07-30 mitigates this but reimplements zoom, paging,
   and download that a PDF viewer already provides.
3. **Search has nothing good to match on.** With OCR removed there is only
   `title`, `subtitle`, and `excerpt` — too thin for a researcher looking for
   "Doğan Avcıoğlu" or "toplumsal yapı".

## Ground truth (verified in the codebase)

- **Encryption differs by outlet, and this constrains the pipeline.**
  `pdfinfo` reports:
  - Aydınlık (`asd_*.pdf`, `pda_*.pdf`): `Encrypted: no`.
  - İşçi-Köylü (all 28 volumes) and Forum (all 149 volumes):
    `Encrypted: yes (print:no copy:no change:no addNotes:no algorithm:AES)` —
    permissions-only encryption with no user password, so the files open and
    render fine but carry restriction flags.

  Consequences, verified by running the tools: `pdftoppm` renders pages from
  encrypted volumes without complaint (the cover pipeline works everywhere).
  `pdfseparate` also succeeds. **`pdfunite` refuses encrypted inputs** with
  `Unimplemented Feature: Could not merge encrypted files`. So a *partial* page
  range cannot be reassembled out of an encrypted volume with the tools on
  hand.

  Text cannot be copied from any of these volumes primarily because they are
  pure image scans with no text layer; the restriction flags are a second,
  independent lock on İşçi-Köylü and Forum.
- `pdfinfo`, `pdfseparate`, `pdfunite`, and `pdftoppm` (poppler) are installed;
  `qpdf`, `pdftk`, and `gs` are not. A verified extraction of Aydınlık
  `asd_02.pdf` pages 57–74 produced a valid 18-page, **2.9 MB** PDF.
- **Page mappings already exist and are trustworthy.**
  `tmp/tustav-*-strong-hits.json` holds `{label: "aydinlik:asd_02", pdfUrl,
  pages: [...]}`; `tmp/tustav-rendered-articles.json` and
  `tmp/tustav-rendered-devrimci-teorik.json` hold `{slug, pages: [{pdfPage,
  imgPath}]}`. Every existing `page-N.jpg` traces to a specific source PDF and
  page number. No page number needs to be invented.
- **Only these five items use scan clippings.** `grep` over `src/archive/`
  shows P24's clippings are all `kind: "photo"`, and `imageSrc` appears in zero
  archive seeds. So `ClippingLightbox` serves nothing else.
- Current asset weight: `public/archive/clippings/aydinlik` 32 MB,
  `isci-koylu` 15 MB, `p24` 2.8 MB. Page counts per piece: Osmanlı Ticaret
  Sözleşmeleri 28, Türkiye'nin Düzeni Üzerine 30, İşçi Sınıfı ve MDD 24,
  Devrimci Teorik Eğitim 18, 1 Mayıs 2.
- **The existing page JPEGs are not uniform and cannot be reused as covers
  as-is.** Aydınlık pages are 1700×2342 at ~200–244 KB, but İşçi-Köylü
  `1970/1-mayis/page-1.jpg` is a 6720×4720 broadsheet weighing **7.8 MB**.
  Keeping raw first pages as covers would leave one article carrying a 7.8 MB
  image. Covers must be regenerated at a controlled size.
- `pdftoppm` (poppler) is installed and already a project dependency via
  `scripts/import-p24-pdf-images.mjs`. macOS-only `sips` is available but is
  not used, to keep the pipeline portable.
- `src/archive/itemUtils.ts#archiveItemText` feeds search and currently
  concatenates `clipping.ocrText`.
- `src/App.tsx#LoadedArticlePage` renders the `.clipping-viewer` aside;
  `ClippingLightbox` lives at roughly `src/App.tsx:2539`+ and is opened via
  `lightboxIndex` state.
- `src/archive/tr/analyses/forum.ts` exports an **empty** seed array; 149
  unprocessed Forum volumes sit in `tmp/tustav-pdfs/forum/`. Out of scope here.

## Decision

Replace published OCR with **curated Turkish tags**, and replace the in-page
scan gallery with a **single cover image linking to an extracted per-article
PDF** that opens in a new tab.

Chosen in brainstorming, with the rejected alternatives:

| Decision | Chosen | Rejected |
|---|---|---|
| PDF delivery | Extracted per-article PDF hosted by us | Deep link to TÜSTAV volume with `#page=N` (16 MB download, unreliable anchor, breaks if TÜSTAV moves); hosting both |
| Tag behaviour | Visible badges + searchable | Hidden-but-searchable; clickable tag filter |
| Existing assets | Keep a scan image as the cover, delete `ocrText` | Delete images too (no visual preview); keep both |
| Cover source | Regenerate from the source PDF with `pdftoppm -scale-to-x 1600` | Reuse the existing `page-1.jpg` (İşçi-Köylü's is 7.8 MB); downscale it with `sips` (macOS-only) |
| Click target | PDF opens directly in a new tab | Keep lightbox with a PDF button inside; embed PDF in the page (mobile viewers frequently render a blank box, and this audience skews older) |
| Image count | First page only, as a cover | All pages stacked; hero + thumbnail strip |
| Scope | Infrastructure + the existing 5 records | Also ingest the 149 Forum volumes; tags-only with no PDF work |

## Scope

### In scope

- `tags` and `pdfSrc` / `pdfPageCount` on `ArchiveItemSeed`; `ocrText` removed
  from `ArchiveClipping`.
- `scripts/extract-tustav-pdf.mjs` plus a committed manifest.
- Extracted PDFs for the five existing items under `public/archive/pdf/`, plus
  a regenerated `cover.jpg` for each.
- Reader UI: tag badges, cover-image-to-PDF link, removal of the lightbox and
  the OCR `<details>`.
- Deletion of all existing `page-N.jpg` files for the five items.
- Curated tags for the five items, owner-approved before commit.
- `validate:content` check that every `pdfSrc` exists on disk.

### Out of scope

- The 149 Forum volumes and any further Aydınlık / İşçi-Köylü discovery. A
  separate sub-project, gated on authorship confirmation per item.
- Clickable tag filtering / a tag index page.
- Tags on non-TÜSTAV items (P24, Zaman, Today's Zaman).
- Any OCR, re-OCR, or text-layer generation.
- Domain switch, sitemap changes (no routes added or removed).

## Design

### 1. Data model — `src/archive/types.ts`

```ts
export interface ArchiveClipping {
  src: string
  thumbSrc?: string
  alt?: string
  pageLabel?: string
  sourceNote?: string
  kind?: 'photo' | 'scan'
  // ocrText removed
}

export interface ArchiveItemSeed {
  // …existing fields
  /** Free-form Turkish subject tags. Rendered as badges; matched by search. */
  tags?: string[]
  /** Extracted article PDF: /archive/pdf/<outlet>/<year>/<slug>.pdf */
  pdfSrc?: string
  /** Page count of that PDF, rendered as "30 sayfa". */
  pdfPageCount?: number
}
```

`pdfPageCount` is stored rather than derived because the app is a static SPA
with no build-time asset introspection; the extraction script reports the count
and it is written into the seed.

### 2. Extraction pipeline — `scripts/extract-tustav-pdf.mjs`

Follows the established `scripts/import-p24-pdf-images.mjs` pattern: source
material lives in gitignored `tmp/`, the mapping is committed, the output lands
in `public/`.

Manifest, committed at `scripts/tustav-pdf-extracts.json`:

```json
[
  {
    "slug": "aydinlik-devrimci-teorik-egitim",
    "source": "aydinlik/asd_02.pdf",
    "firstPage": 57,
    "lastPage": 74,
    "out": "aydinlik/1968/devrimci-teorik-egitim.pdf"
  }
]
```

Behaviour:

- Resolves `source` against `tmp/tustav-pdfs/`. If the file is missing, exits
  non-zero with a message naming the expected path — the source volumes are not
  in the repo and a contributor without them must get a clear diagnosis, not a
  stack trace.
- Builds the article PDF by one of two paths, chosen from the source's
  encryption state and the requested range:
  - **Whole-file range** (`firstPage === 1 && lastPage === pageCount`): copy the
    source verbatim. No merge, so encryption is irrelevant. This is what
    İşçi-Köylü issue 16 needs — the issue is two pages and the article is in it.
  - **Partial range on an unencrypted source:** `pdfseparate -f <firstPage>
    -l <lastPage>` into a temp dir, then `pdfunite` in numeric page order.
    Numeric ordering matters: `pdfseparate` emits `p-1.pdf`…`p-10.pdf`, which
    sort lexicographically as `p-1, p-10, p-2`. This covers all four Aydınlık
    pieces.
  - **Partial range on an encrypted source:** not supported by the installed
    tools. The script must detect this up front and exit with a message naming
    the file and suggesting `brew install qpdf` plus a `qpdf --decrypt` pre-pass,
    rather than letting `pdfunite` fail obscurely deep in the run. No current
    manifest entry hits this path; the Forum sub-project will.
- Renders the cover from the same source volume:
  `pdftoppm -jpeg -jpegopt quality=82 -f <firstPage> -l <firstPage>
  -scale-to-x 1600 -scale-to-y -1`, written to
  `public/archive/clippings/<outlet>/<year>/<slug>/cover.jpg`.
  `-scale-to-y -1` preserves aspect ratio, which matters because İşçi-Köylü is
  landscape broadsheet while Aydınlık is portrait. Regenerating from the PDF
  rather than resizing the existing JPEG keeps every cover to a predictable
  ~200–350 KB regardless of the source scan's resolution.
- Cleans the temp dir on both success and failure.
- Prints each output's page count and byte size so `pdfPageCount` can be filled
  in accurately.
- Idempotent: re-running overwrites and produces identical output.

Manifest entries are derived from `tmp/tustav-*-strong-hits.json` and
`tmp/tustav-rendered-*.json`, which already record the source volume and exact
page range for every existing item. Source filenames differ in shape between
outlets — Aydınlık volumes are `asd_NN.pdf`, İşçi-Köylü issues are
`isci-koylu-16_1970.pdf` — so the manifest stores an explicit relative path per
entry rather than deriving one from a label.

**Granularity caveat.** For the four Aydınlık pieces the extract is exactly the
article, so the PDF opens on Şahin Alpay's text. İşçi-Köylü issue 16 is a
two-page newspaper in total, so its "extract" is the whole issue and the reader
lands on the front page with his piece on it. This is inherent to the source
and is not worth engineering around; the caption states the page reference
either way.

### 3. Reader UI — `src/App.tsx`, `src/index.css`

**Tag badges.** Rendered under the article's subtitle/meta line as a
`.tag-list` of `.tag` spans. Non-interactive. Styled from existing tokens in the
`.kicker` / badge family rather than a new colour scale. Omitted entirely when
`tags` is absent, so untagged items are visually unchanged.

**Clipping section.** The `.clipping-viewer` aside keeps its "Gazete Kupürü /
Newspaper Clipping" heading but renders **one** figure: the first scan as a
cover image wrapped in

```
<a href={item.pdfSrc} target="_blank" rel="noopener noreferrer">
```

replacing the current `<button onClick={() => setLightboxIndex(...)}>`. The
hover/focus hint switches from the `zoom_in` icon to `picture_as_pdf`, with
label "Tamamını PDF olarak oku" / "Read the full scan as a PDF". The caption
carries the source line plus the page count ("Aydınlık, sayı 7 · 30 sayfa").

If an item has `clippings` but no `pdfSrc`, the cover renders as a plain
non-linked figure rather than a dead link.

**Removals.** `ClippingLightbox`, the `lightboxIndex` state and its
`openableScans` input, the `<details className="clipping-ocr">` block, and the
associated CSS (`.clipping-lightbox*`, `.clipping-ocr`). This is roughly 200
lines out of `App.tsx` — welcome, given CLAUDE.md already flags the file's size.

**Bilingual copy.** New UI strings go into `src/content.ts` for both languages
in the same change, per CLAUDE.md. The obsolete `clippingViewer.viewOriginal`
usage is retired or repurposed.

### 4. Assets

- Delete every `page-N.jpg` under
  `public/archive/clippings/{aydinlik,isci-koylu}/`; the script writes one
  `cover.jpg` per item in the same directory. `public/archive/clippings/p24/`
  is untouched.
- Add five PDFs under `public/archive/pdf/{aydinlik,isci-koylu}/<year>/<slug>.pdf`.
  Measured sizes: Devrimci Teorik Eğitim 2.9 MB (18 s.), Osmanlı Ticaret
  Sözleşmeleri 3.8 MB (28 s.), Türkiye'nin Düzeni 4.3 MB (30 s.), İşçi Sınıfı ve
  MDD 3.6 MB (24 s.), 1 Mayıs 7.9 MB (2 s., whole-issue copy) — **22.5 MB** total.
- Net effect: 47 MB of TÜSTAV page scans becomes ~1 MB of covers plus 22.5 MB of
  PDFs — roughly **−23 MB** in the working tree. Git history retains the deleted
  blobs; no history rewrite.
- The İşçi-Köylü PDF is republished verbatim, restriction flags and all. The
  site already hosts full-resolution page scans of the same issues and credits
  TÜSTAV in `sourceNote`, so this does not change the archive's posture toward
  the source; it re-hosts the same material in a better format.
- Each item's `clippings` array is reduced to a single `kind: 'scan'` entry
  pointing at `cover.jpg`. Keeping the array (rather than introducing a
  separate `coverSrc`) means `itemHasSourceKind(item, 'clipping')` and
  `archiveLink()`'s internal-open rule keep working unchanged.
- `sourceNote` strings lose the "OCR metni düşük kaliteli olabilir" caveat,
  which no longer applies once no OCR is published. The TÜSTAV Süreli Yayınlar
  Arşivi credit and the issue/page citation stay.

### 5. Tags and content integrity

Tags are **not** generated from OCR output and are **not** guessed from titles.
For each of the five pieces the page scans are read directly — this happens
**before** the old `page-N.jpg` files are deleted, so the full text of every
page is available while tagging — and tags are drawn only from what the page
actually says: subject, named people, key concepts, publication year.

The proposed tag list is presented to the owner for approval **before** it is
committed. This follows CLAUDE.md's rule that archive content must trace to a
verifiable source and must never be fabricated. Tags are Turkish, matching the
Turkish-only content of these items; the English hub pages link through to the
Turkish archive as they do today.

### 6. Verification

- `npm run build` (includes `tsc -b`) passes.
- `npm run lint` clean.
- `npm run validate:content` passes, extended so every seed with `pdfSrc` has a
  matching file under `public/`. Its existing clipping-asset check now covers
  the `cover.jpg` paths.
- Every generated cover is under 400 KB, confirmed by listing
  `public/archive/clippings/*/*/*/cover.jpg` after the script runs.
- Sitemap untouched: no route or slug changes.
- Browser check of an Aydınlık article and the İşçi-Köylü article in both
  themes and at mobile width, confirming the cover links to the right PDF, the
  PDF opens at the article, tags render, and no OCR block remains. English
  routes checked for the hub-page redirect behaviour.
- Removal of the lightbox verified by loading a P24 article with photo
  clippings and confirming nothing regressed there.

## Superseded work

`2026-07-30-clipping-lightbox-design.md` built `ClippingLightbox` to solve
"old newsprint is unreadable at reading-column width" with a bespoke zoom/pan
viewer. The PDF approach solves the same problem using the browser's native PDF
viewer, which supplies zoom, pan, paging, text-free navigation, download, and
print with no code to maintain. That spec's premise still holds; its
implementation is retired.

## Risks

- **Extracted PDFs are large.** 3–5 MB per Aydınlık article. Acceptable for an
  intentional "open the original" action, and smaller than the 8–10 MB of JPEGs
  they replace. Not acceptable to embed or preload — hence the new-tab link.
- **Search coverage narrows.** Removing OCR removes a large (if noisy) text
  body from `archiveItemText`. Curated tags are the deliberate replacement; if
  the owner later finds specific searches failing, tags can be extended without
  a schema change.
- **Source volumes are not in the repo.** Anyone regenerating PDFs needs
  `tmp/tustav-pdfs/`. The script fails loudly and names the missing path.
- **The Forum sub-project will hit the encryption wall.** All 149 Forum volumes
  are AES-encrypted, and Forum articles are a few pages inside a large issue —
  exactly the partial-range-on-encrypted-source case `pdfunite` refuses. That
  work will need `qpdf --decrypt` (permissions-only encryption strips without a
  password) as a pre-pass, adding a dependency. Nothing in this sub-project is
  blocked by it, but the Forum plan should budget for it rather than discover
  it late.
