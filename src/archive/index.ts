import type {
  ArchiveItem,
  ArchiveLang,
  FlatArchiveSection,
  LanguageArchive,
  OutletArchiveSection,
  OutletGroup,
} from './types'
import { trArchive } from './tr'
import { enArchive } from './en'

/* The whole archive, both languages. The browser does NOT load this: each
   page loads one language through archive/loadLanguageArchive.ts, so a
   Turkish reader never downloads the English metadata and vice versa. This
   module is for the content scripts (scripts/lib/archive-model.mjs), the
   generators and the test suite, which all want the complete picture. */
export const archiveData = {
  columns: {
    tr: trArchive.columns,
    en: enArchive.columns,
  } satisfies Record<ArchiveLang, OutletGroup[]>,
  analyses: trArchive.analyses,
  interviews: trArchive.interviews,
  academicArticles: trArchive.academicArticles,
}

export function withOutletSectionItems(
  section: Omit<OutletArchiveSection, 'outlets'>,
  outlets: OutletGroup[],
): OutletArchiveSection {
  return { ...section, outlets }
}

export function withFlatSectionItems(
  section: Omit<FlatArchiveSection, 'items'>,
  items: ArchiveItem[],
): FlatArchiveSection {
  return { ...section, items }
}

export function allArchiveItems(): ArchiveItem[] {
  return [
    ...archiveData.columns.tr.flatMap((group) => group.items),
    ...archiveData.columns.en.flatMap((group) => group.items),
    ...archiveData.analyses.flatMap((group) => group.items),
    ...archiveData.interviews,
    ...archiveData.academicArticles,
  ]
}

export function findArchiveItem(slug: string): ArchiveItem | undefined {
  return allArchiveItems().find((item) => item.slug === slug)
}

export type { LanguageArchive }
export type {
  ArchiveLang,
  ArchiveMedium,
  ArchiveClipping,
  ArchiveItem,
  ArchiveItemSeed,
  FlatArchiveSection,
  OutletArchiveSection,
  OutletGroup,
} from './types'
