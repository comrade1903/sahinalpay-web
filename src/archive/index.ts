import type {
  ArchiveCategory,
  ArchiveLang,
  ArchiveMedium,
  ArchiveItem,
  ArchiveItemSeed,
  FlatArchiveSection,
  OutletArchiveSection,
  OutletGroup,
} from './types'
import { normalizeArchiveItems } from './utils'
import { cumhuriyetColumnSeeds } from './tr/columns/cumhuriyet'
import { milliyetColumnSeeds } from './tr/columns/milliyet'
import { sabahColumnSeeds } from './tr/columns/sabah'
import { p24ColumnSeeds } from './tr/columns/p24'
import { forumAnalysisSeeds } from './tr/analyses/forum'
import { aydinlikAnalysisSeeds } from './tr/analyses/aydinlik'
import { isciKoyluAnalysisSeeds } from './tr/analyses/isci-koylu'
import { interviewSeeds } from './tr/interviews'
import { academicArticleSeeds } from './tr/academic'

function outlet(
  outletName: string,
  outletKey: string,
  category: ArchiveCategory,
  seeds: ArchiveItemSeed[],
  lang: ArchiveLang,
  medium?: ArchiveMedium,
): OutletGroup {
  return {
    outlet: outletName,
    medium,
    items: normalizeArchiveItems(outletName, outletKey, category, seeds, lang, medium),
  }
}

/* Columns are per-language: the Turkish page lists the Turkish-press
   outlets, the English page lists Today's Zaman. 'print' columns ran in
   the physical newspaper; P24 pieces are online news-blog columns. */
export const archiveData = {
  columns: {
    tr: [
      outlet('Cumhuriyet', 'cumhuriyet', 'columns', cumhuriyetColumnSeeds, 'tr', 'print'),
      outlet('Sabah', 'sabah', 'columns', sabahColumnSeeds, 'tr', 'print'),
      outlet('Milliyet', 'milliyet', 'columns', milliyetColumnSeeds, 'tr', 'print'),
      outlet('P24', 'p24', 'columns', p24ColumnSeeds, 'tr', 'online'),
    ],
    en: [] as OutletGroup[],
  } satisfies Record<ArchiveLang, OutletGroup[]>,
  analyses: [
    outlet('Forum', 'forum', 'analyses', forumAnalysisSeeds, 'tr'),
    outlet(
      'Aydınlık (Sosyalist Dergi/Proleter Devrimci)',
      'aydinlik',
      'analyses',
      aydinlikAnalysisSeeds,
      'tr',
    ),
    outlet('İşçi Köylü', 'isci-koylu', 'analyses', isciKoyluAnalysisSeeds, 'tr'),
  ],
  interviews: normalizeArchiveItems(
    'Söyleşiler',
    'interviews',
    'interviews',
    interviewSeeds,
    'tr',
  ),
  academicArticles: normalizeArchiveItems(
    'Akademik Makaleler',
    'academic',
    'academic',
    academicArticleSeeds,
    'tr',
  ),
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
