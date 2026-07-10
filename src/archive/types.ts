export type ArchiveCategory = 'columns' | 'analyses' | 'interviews' | 'academic'
export type ArchiveLang = 'tr' | 'en'

export interface ArchiveClipping {
  src: string
  thumbSrc?: string
  alt?: string
  ocrText?: string
  pageLabel?: string
  sourceNote?: string
  /** 'photo' renders as the article's lead image; 'scan' (default) goes in the
      newspaper-clipping viewer at the end. */
  kind?: 'photo' | 'scan'
}

/** Where a piece originally ran: a print newspaper column or an
    online-only outlet (news site / blog platform such as P24). */
export type ArchiveMedium = 'print' | 'online'

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
  medium?: ArchiveMedium
}

export interface OutletGroup {
  outlet: string
  medium?: ArchiveMedium
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
