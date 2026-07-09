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
import { zamanColumnSeeds } from './tr/columns/zaman'
import { p24ColumnSeeds } from './tr/columns/p24'
import { todaysZamanColumnSeeds } from './en/columns/todays-zaman'
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
  medium?: ArchiveMedium,
): OutletGroup {
  return {
    outlet: outletName,
    medium,
    items: normalizeArchiveItems(outletName, outletKey, category, seeds, medium),
  }
}

/* Columns are per-language: the Turkish page lists the Turkish-press
   outlets, the English page lists Today's Zaman. 'print' columns ran in
   the physical newspaper; P24 pieces are online news-blog columns. */
export const archiveData = {
  columns: {
    tr: [
      outlet('Cumhuriyet', 'cumhuriyet', 'columns', cumhuriyetColumnSeeds, 'print'),
      outlet('Sabah', 'sabah', 'columns', sabahColumnSeeds, 'print'),
      outlet('Milliyet', 'milliyet', 'columns', milliyetColumnSeeds, 'print'),
      outlet('Zaman', 'zaman', 'columns', zamanColumnSeeds, 'print'),
      outlet('P24', 'p24', 'columns', p24ColumnSeeds, 'online'),
    ],
    en: [outlet("Today's Zaman", 'todays-zaman', 'columns', todaysZamanColumnSeeds, 'print')],
  } satisfies Record<ArchiveLang, OutletGroup[]>,
  analyses: [
    outlet('Forum', 'forum', 'analyses', forumAnalysisSeeds),
    outlet('Aydınlık (Sosyalist Dergi/Proleter Devrimci)', 'aydinlik', 'analyses', aydinlikAnalysisSeeds),
    outlet('İşçi Köylü', 'isci-koylu', 'analyses', isciKoyluAnalysisSeeds),
  ],
  interviews: normalizeArchiveItems('Söyleşiler', 'interviews', 'interviews', interviewSeeds),
  academicArticles: normalizeArchiveItems('Akademik Makaleler', 'academic', 'academic', academicArticleSeeds),
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

/** Scanned newspaper clippings only — article photos (kind 'photo') don't
    make an item a "clipping". */
export function itemScanClippings(item: ArchiveItem) {
  return (item.clippings ?? []).filter((clipping) => clipping.kind !== 'photo')
}

export function itemHasSourceKind(item: ArchiveItem, kind: 'all' | 'digital' | 'clipping') {
  if (kind === 'all') return true
  if (kind === 'digital') return Boolean(item.url || item.hasBody)
  return Boolean(itemScanClippings(item).length || item.imageSrc)
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
