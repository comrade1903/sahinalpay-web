/**
 * The English archive: the Today's Zaman columns.
 *
 * Analyses, interviews and academic articles exist only in Turkish. English
 * still has hub pages for them (TurkishArchiveHub), which link across to the
 * Turkish archive rather than duplicating it — so there is nothing to hold
 * here for those sections.
 */
import type { LanguageArchive } from './types'
import { outletGroup } from './utils'
import { todaysZamanColumnSeeds } from './en/columns/todays-zaman'

export const enArchive: LanguageArchive = {
  columns: [
    outletGroup(
      "Today's Zaman",
      'todays-zaman',
      'columns',
      todaysZamanColumnSeeds,
      'en',
      'print',
    ),
  ],
  analyses: [],
  interviews: [],
  academicArticles: [],
}
