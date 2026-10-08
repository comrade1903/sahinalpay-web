/**
 * The English archive: the Today's Zaman columns.
 *
 * Analyses exist only in Turkish, so there is nothing to hold here for that
 * section. The English pages are not empty: every section lists the other
 * language's records under their own heading, so those pages show the Turkish
 * ones, each linking to its Turkish reader page.
 *
 * Academic articles and interviews published in English or German live here,
 * which is what splits those pages into a Turkish list and a foreign-language
 * one.
 */
import type { LanguageArchive } from './types'
import { outletGroup, normalizeArchiveItems } from './utils'
import { todaysZamanColumnSeeds } from './en/columns/todays-zaman'
import { enAcademicArticleSeeds } from './en/academic'
import { enInterviewSeeds } from './en/interviews'

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
  interviews: normalizeArchiveItems(
    'Interviews',
    'interviews',
    'interviews',
    enInterviewSeeds,
    'en',
  ),
  academicArticles: normalizeArchiveItems(
    'Articles in Turkish and Other Languages',
    'academic',
    'academic',
    enAcademicArticleSeeds,
    'en',
  ),
}
