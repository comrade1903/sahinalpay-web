/** "Silivri'den…" — pieces other people wrote *about* Şahin Alpay while he
 *  was held in Silivri and after his release.
 *
 *  Deliberately NOT part of src/archive: the archive is his own work, and
 *  these records must never reach the section counts, the archive search,
 *  the coverage strip or `allArchiveItems()`. They live here with their own
 *  types, their own page and their own reader route.
 */
export type PressList = 'turkish' | 'foreign'

export interface PressItemSeed {
  slug?: string
  /** The piece's own headline. Some entries in the source manuscript carry
   *  none; those render under their byline instead, and nothing is invented
   *  to fill the gap. */
  title?: string
  /** Who wrote it, where the manuscript names someone. Several entries are
   *  collective — an open letter, a learned society's appeal, an unsigned
   *  news item — and carry no byline; those show the publication and date
   *  alone rather than a guessed name. */
  author?: string
  /** Where it ran, as the manuscript names it (T24, Hürriyet, Die Zeit…).
   *  A few entries name no publication; those show the author and date
   *  alone rather than a guessed masthead. */
  outlet?: string
  /** Free-text Turkish date, parsed by src/dateUtils.ts like archive dates. */
  date?: string
  /** The original article's address, where the manuscript records one. Most
   *  entries have none; those simply show no source link. */
  url?: string
  /** Full text, one string per paragraph, verbatim from the manuscript. */
  body: string[]
}

export interface PressItem extends PressItemSeed {
  slug: string
  id: string
  list: PressList
}
