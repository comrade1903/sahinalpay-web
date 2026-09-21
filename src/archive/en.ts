/**
 * The English archive: the Today's Zaman columns.
 *
 * Analyses and interviews exist only in Turkish, so there is nothing to hold
 * here for those sections. The English pages for them are not empty: every
 * section lists the other language's records under their own heading, so
 * those pages show the Turkish ones, each linking to its Turkish reader page.
 *
 * Academic articles are the exception — the four pieces published in English
 * and German live here, which is what splits that page into a Turkish list
 * and a foreign-language one.
 */
import type { LanguageArchive } from './types'
import { outletGroup, normalizeArchiveItems } from './utils'
import { todaysZamanColumnSeeds } from './en/columns/todays-zaman'
import { enAcademicArticleSeeds } from './en/academic'

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
  academicArticles: normalizeArchiveItems(
    'Academic Articles',
    'academic',
    'academic',
    enAcademicArticleSeeds,
    'en',
  ),
}
