import type { ArchiveItemSeed } from '../types'

/** Interviews published in a language other than Turkish. They live on the
 *  English side of the archive so the Söyleşiler page lists them under their
 *  own heading after the Turkish ones, as the academic articles page does.
 *
 *  The Global Axess interview moved here from the Turkish file on 2026-10-08;
 *  only the wording of its citation changed (Global Axess was the
 *  English-language edition of the Swedish magazine Axess). */
export const enInterviewSeeds: ArchiveItemSeed[] = [
  {
    slug: 'on-the-verge-of-the-west-axess-2007',
    title: 'On the Verge of the West',
    date: '2007',
    subtitle: 'Global Axess, interview — Thomas Gür',
    sourceNote: "From Şahin Alpay's own publication list.",
    tags: ['Thomas Gür', 'Global Axess', '2007'],
  },
]
