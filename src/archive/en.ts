/**
 * The English archive: the Today's Zaman columns.
 *
 * Analyses, interviews and academic articles exist only in Turkish, so there
 * is nothing to hold here for those sections. The English pages for them are
 * not empty: every section lists the other language's records under their own
 * heading, so those pages show the Turkish ones, each linking to its Turkish
 * reader page.
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
