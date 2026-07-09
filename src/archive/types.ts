export type ArchiveCategory = 'columns' | 'analyses' | 'interviews' | 'academic'

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

export interface ArchiveItemSeed {
  id?: string
  slug?: string
  title: string
  date?: string
  url?: string
  imageSrc?: string
  excerpt?: string
  subtitle?: string
  body?: string[]
  imageCredit?: string
  sourceNote?: string
  clippings?: ArchiveClipping[]
}

export interface ArchiveItem extends ArchiveItemSeed {
  id: string
  slug: string
  outlet: string
  category: ArchiveCategory
}

export interface OutletGroup {
  outlet: string
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
