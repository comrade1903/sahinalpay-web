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

/* Forum, Aydınlık/PDA and İşçi Köylü were all removed from the archive at
   the owner's request — Forum and Aydınlık on 2026-09-22 (issue #20), İşçi
   Köylü on 2026-09-24, once Analizler itself was unlinked and a single
   surviving record there no longer served a purpose. The section stays wired
   up with zero outlets rather than deleted outright, so a restored record
   would have somewhere to go. Every page scan and PDF stays under
   public/archive so the material is not lost. */
const analyses: OutletGroup[] = []

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
