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
  /* Per-language like columns: the interviews and articles he published in
     English and German live on the English side, which is what splits those
     pages into a Turkish list and a foreign-language one. Analyses stay a
     Turkish-only array because there is nothing else to hold. */
  interviews: {
    tr: trArchive.interviews,
    en: enArchive.interviews,
  } satisfies Record<ArchiveLang, ArchiveItem[]>,
  academicArticles: {
    tr: trArchive.academicArticles,
    en: enArchive.academicArticles,
  } satisfies Record<ArchiveLang, ArchiveItem[]>,
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
    ...archiveData.interviews.tr,
    ...archiveData.interviews.en,
    ...archiveData.academicArticles.tr,
    ...archiveData.academicArticles.en,
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
