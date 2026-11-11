import type { ArchiveSummary } from '../archive/useArchiveSummary'
import type { PageKey } from '../routes'
import type { CountNoun } from './countLabel'

/** Real item counts per section — never fabricated. Returns null where a
 *  count doesn't apply (e.g. the About page) or the summary has not loaded. */
export function hubCount(key: PageKey, bookCount: number, summary: ArchiveSummary | null): number | null {
  switch (key) {
    case 'columns':
      /* The columns page lists both languages' columns, so the card that
         leads there counts both. It used to count the reader's language
         only and disagreed with the page it opened. */
      return summary ? summary.counts.columns.tr + summary.counts.columns.en : null
    case 'analyses':
      return summary?.counts.analyses ?? null
    case 'interviews':
      return summary?.counts.interviews ?? null
    case 'academic':
      return summary?.counts.academic ?? null
    case 'books':
      return bookCount
    default:
      return null
  }
}

/** The noun a section's count is read in: "11 söyleşi", not "11 yazı". */
export function hubNoun(key: PageKey): CountNoun {
  switch (key) {
    case 'books':
      return 'book'
    case 'interviews':
      return 'interview'
    case 'academic':
      return 'article'
    default:
      return 'piece'
  }
}
