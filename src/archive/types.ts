export type ArchiveCategory = 'columns' | 'analyses' | 'interviews' | 'academic'
export type ArchiveLang = 'tr' | 'en'

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

/** Where a piece originally ran: a print newspaper column or an
    online-only outlet (news site / blog platform such as P24). */
export type ArchiveMedium = 'print' | 'online'

/** Whether a piece is Şahin Alpay's own column or an interview he conducted
    with someone else. Distinct from ArchiveCategory (the archive section a
    piece lives in) — a column and an interview can share one section, e.g.
    Milliyet's columns list holds both. */
export type ArchivePieceKind = 'column' | 'interview'

export interface ArchiveItemSeed {
  id?: string
  slug?: string
  title: string
  date?: string
  url?: string
  /** web.archive.org snapshot — shown next to the (often defunct) source link. */
  archiveUrl?: string
  imageSrc?: string
  excerpt?: string
  subtitle?: string
  body?: string[]
  /** True when the article has full body text, even if `body` itself is
      empty on this seed because it was split into a separate lazily
      loaded module (see archive/bodyRegistry.ts). */
  hasBody?: boolean
  imageCredit?: string
  sourceNote?: string
  clippings?: ArchiveClipping[]
  /** Free-form Turkish subject tags. Rendered as badges and matched by search.
      Replaces published OCR text for scan-only items. */
  tags?: string[]
  /** Article-scoped PDF sliced out of the source volume, served from public/. */
  pdfSrc?: string
  /** Page count of `pdfSrc`, rendered next to the cover. */
  pdfPageCount?: number
  /** Column vs. interview, for outlets whose columns section mixes both
      (see ArchivePieceKind). Omitted where the distinction doesn't apply. */
  pieceKind?: ArchivePieceKind
}

export interface ArchiveItem extends ArchiveItemSeed {
  id: string
  slug: string
  lang: ArchiveLang
  outlet: string
  /** Stable machine key for this outlet (e.g. 'p24'), used to look up its
      lazy body-loader in archive/bodyRegistry.ts. Distinct from `outlet`,
      which is the display name. */
  outletKey: string
  category: ArchiveCategory
  /** See the note on OutletGroup.medium. */
  medium?: ArchiveMedium | undefined
}

export interface OutletGroup {
  outlet: string
  /** `| undefined` is deliberate under exactOptionalPropertyTypes: outlets
      with no recorded medium are built by passing the field through as
      undefined, and "absent" and "undefined" mean the same thing here. */
  medium?: ArchiveMedium | undefined
  items: ArchiveItem[]
}

export interface OutletArchiveSection {
  kicker: string
  title: string
  intro: string
  emptyLabel: string
  outlets: OutletGroup[]
}

export interface FlatArchiveSection {
  kicker: string
  title: string
  intro: string
  emptyLabel: string
  items: ArchiveItem[]
}
