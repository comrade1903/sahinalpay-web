/**
 * The Turkish archive: the Turkish-press columns plus the analyses,
 * interviews and academic articles, all of which exist only in Turkish.
 *
 * Split from the English archive so a page loads one language's metadata, not
 * both. Nothing at runtime needs both at once — the home page's cross-language
 * coverage strip reads the generated summary instead (see summary.generated.ts).
 */
import type { LanguageArchive, OutletGroup } from './types'
import { outletGroup, normalizeArchiveItems } from './utils'
import { cumhuriyetColumnSeeds } from './tr/columns/cumhuriyet'
import { milliyetColumnSeeds } from './tr/columns/milliyet'
import { sabahColumnSeeds } from './tr/columns/sabah'
import { zamanColumnSeeds } from './tr/columns/zaman'
import { p24ColumnSeeds } from './tr/columns/p24'
import { medyascopeColumnSeeds } from './tr/columns/medyascope'
import { isciKoyluAnalysisSeeds } from './tr/analyses/isci-koylu'
import { interviewSeeds } from './tr/interviews'
import { academicArticleSeeds } from './tr/academic'

/* 'print' columns ran in the physical newspaper; P24 and Medyascope pieces
   are online columns. */
const columns: OutletGroup[] = [
  outletGroup('Cumhuriyet', 'cumhuriyet', 'columns', cumhuriyetColumnSeeds, 'tr', 'print'),
  outletGroup('Sabah', 'sabah', 'columns', sabahColumnSeeds, 'tr', 'print'),
  outletGroup('Milliyet', 'milliyet', 'columns', milliyetColumnSeeds, 'tr', 'print'),
  outletGroup('Zaman', 'zaman', 'columns', zamanColumnSeeds, 'tr', 'print'),
  outletGroup('P24', 'p24', 'columns', p24ColumnSeeds, 'tr', 'online'),
  outletGroup('Medyascope', 'medyascope', 'columns', medyascopeColumnSeeds, 'tr', 'online'),
]

/* Forum and Aydınlık/PDA were removed from the archive on 2026-09-22 at the
   owner's request in issue #20: İşçi Köylü is the analyses record he wants
   kept. Their page scans and article PDFs stay under public/archive so
   the material is not lost if any of it is restored later. */
const analyses: OutletGroup[] = [
  outletGroup('İşçi Köylü', 'isci-koylu', 'analyses', isciKoyluAnalysisSeeds, 'tr'),
]

export const trArchive: LanguageArchive = {
  columns,
  analyses,
  interviews: normalizeArchiveItems(
    'Söyleşiler',
    'interviews',
    'interviews',
    interviewSeeds,
    'tr',
  ),
  academicArticles: normalizeArchiveItems(
    'Makale ve Bildiriler',
    'academic',
    'academic',
    academicArticleSeeds,
    'tr',
  ),
}
