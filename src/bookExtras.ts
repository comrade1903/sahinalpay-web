import type { Book, Lang } from './content'
import {
  birHikayemVarForeword,
  hikayeminSonuForeword,
  iHaveAStoryTranslation,
  turkarIStockholmSummary,
  turksInStockholmSummary,
  type BookForeword,
  type BookTranslation,
} from './bookForewords'
import { birHikayemVarPress, type BookPressItem } from './bookPress'

/** What a book's card opens beyond its cover and description. Kept out of
 *  content.ts so the forewords and the translation's details download with the
 *  Books page alone; imported only by BooksPage and scripts/prerender.mjs. */
export interface BookExtras {
  /** The book's own foreword or summaries, each opened in a dialog from its
   *  card; the reader's own language comes first. */
  forewords?: BookForeword[]
  /** What others wrote about the book, listed in a dialog from its card. */
  press?: BookPressItem[]
  /** A full translation, read in a dialog and offered as a PDF. */
  translation?: BookTranslation
}

export type BookWithExtras = Book & BookExtras

/** Keyed by `Book.title`, which is the same in both languages. */
export const bookExtras: Record<Lang, Record<string, BookExtras>> = {
  en: {
    'Hikâyemin Sonu': { forewords: [hikayeminSonuForeword] },
    'Bir Hikâyem Var': {
      forewords: [birHikayemVarForeword],
      press: birHikayemVarPress,
      translation: iHaveAStoryTranslation,
    },
    'Turkar i Stockholm: en studie av invandrare, politik och samhälle': {
      forewords: [turksInStockholmSummary, turkarIStockholmSummary],
    },
  },
  tr: {
    'Hikâyemin Sonu': { forewords: [hikayeminSonuForeword] },
    'Bir Hikâyem Var': {
      forewords: [birHikayemVarForeword],
      press: birHikayemVarPress,
      translation: iHaveAStoryTranslation,
    },
    'Turkar i Stockholm: en studie av invandrare, politik och samhälle': {
      forewords: [turkarIStockholmSummary, turksInStockholmSummary],
    },
  },
}

export function withExtras(books: Book[], lang: Lang): BookWithExtras[] {
  return books.map((book) => ({ ...book, ...bookExtras[lang][book.title] }))
}
