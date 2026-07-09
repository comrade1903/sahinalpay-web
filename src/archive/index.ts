import type {
  ArchiveCategory,
  ArchiveLang,
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
import { zamanColumnSeeds } from './tr/columns/zaman'
import { p24ColumnSeeds } from './tr/columns/p24'
import { forumAnalysisSeeds } from './tr/analyses/forum'
import { aydinlikAnalysisSeeds } from './tr/analyses/aydinlik'
import { isciKoyluAnalysisSeeds } from './tr/analyses/isci-koylu'
import { interviewSeeds } from './tr/interviews'
import { academicArticleSeeds } from './tr/academic'

function outlet(
  outletName: string,
  category: ArchiveCategory,
  seeds: ArchiveItemSeed[],
): OutletGroup {
  return {
    outlet: outletName,
    items: normalizeArchiveItems(outletName, category, seeds),
  }
}

export const archiveData = {
  columns: {
    tr: [
      outlet('Cumhuriyet', 'columns', cumhuriyetColumnSeeds),
      outlet('Sabah', 'columns', sabahColumnSeeds),
      outlet('Milliyet', 'columns', milliyetColumnSeeds),
      outlet('Zaman', 'columns', zamanColumnSeeds),
      outlet('P24', 'columns', p24ColumnSeeds),
    ],
    en: [] as OutletGroup[],
  } satisfies Record<ArchiveLang, OutletGroup[]>,
  analyses: [
    outlet('Forum', 'analyses', forumAnalysisSeeds),
    outlet('Aydınlık (Sosyalist Dergi/Proleter Devrimci)', 'analyses', aydinlikAnalysisSeeds),
    outlet('İşçi Köylü', 'analyses', isciKoyluAnalysisSeeds),
  ],
  interviews: normalizeArchiveItems('Söyleşiler', 'interviews', interviewSeeds),
  academicArticles: normalizeArchiveItems('Akademik Makaleler', 'academic', academicArticleSeeds),
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

export function archiveItemText(item: ArchiveItem): string {
  return [
    item.title,
    item.subtitle,
    item.excerpt,
    item.sourceNote,
    item.imageCredit,
    ...(item.body ?? []),
    ...(item.clippings ?? []).flatMap((clipping) => [
      clipping.alt,
      clipping.ocrText,
      clipping.sourceNote,
      clipping.pageLabel,
    ]),
  ]
    .filter(Boolean)
    .join(' ')
}

export function itemHasSourceKind(item: ArchiveItem, kind: 'all' | 'digital' | 'clipping') {
  if (kind === 'all') return true
  if (kind === 'digital') return Boolean(item.url || item.body?.length)
  return Boolean(item.clippings?.length || item.imageSrc)
}

export type {
  ArchiveLang,
  ArchiveClipping,
  ArchiveItem,
  ArchiveItemSeed,
  FlatArchiveSection,
  OutletArchiveSection,
  OutletGroup,
} from './types'
