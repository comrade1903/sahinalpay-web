import type { ArchiveItemSeed } from '../types'

/** Academic and analytical articles Şahin Alpay published in languages other
 *  than Turkish: a TÜSİAD quarterly in English and three German outlets.
 *
 *  They live on the English side of the archive so the Academic Articles page
 *  separates them from the Turkish list under its own heading, the way every
 *  section already lists the other language's records.
 *
 *  Every entry comes from Şahin Alpay's own publication list and says so in
 *  `sourceNote`. One was checked further: the list gave the APuZ piece as
 *  "Die Politische Rolle des Militars in der Türkei" in "Aus Politik und
 *  Zeitgeshichte". The Bundeszentrale für politische Bildung's own page for
 *  issue 39-40/2009 has it as "Die politische Rolle des Militärs in der
 *  Türkei", which is used here; the two slips were transcription, not a
 *  different article. The Süddeutsche Zeitung and FAZ pieces predate those
 *  papers' open archives and could not be confirmed outside the list.
 */
export const enAcademicArticleSeeds: ArchiveItemSeed[] = [
  {
    slug: 'after-ocalan-private-view-2000',
    title: 'After Öcalan',
    date: '2000',
    subtitle: 'Private View (TÜSİAD Quarterly Review), Spring 2000, pp. 34-42',
    sourceNote: "From Şahin Alpay's own publication list.",
    tags: ['Öcalan', 'Kurdish question', 'Private View', 'TÜSİAD', '2000'],
  },
  {
    slug: 'die-republik-der-buerokraten-sz-2007',
    title: 'Die Republik der Bürokraten',
    date: '3 May 2007',
    subtitle: 'Süddeutsche Zeitung, Nr. 101, "Thema des Tages", 3 Mai 2007, S. 2',
    sourceNote: "From Şahin Alpay's own publication list.",
    tags: ['bureaucracy', 'Turkish politics', 'Süddeutsche Zeitung', 'German', '2007'],
  },
  {
    slug: 'was-wird-aus-der-tuerkei-faz-2008',
    title: 'Was wird aus der Türkei?',
    date: '15 October 2008',
    subtitle: 'Frankfurter Allgemeine Zeitung, 15. Oktober 2008, S. 8',
    sourceNote: "From Şahin Alpay's own publication list.",
    tags: ['Turkey', 'EU accession', 'Frankfurter Allgemeine Zeitung', 'German', '2008'],
  },
  {
    slug: 'die-politische-rolle-des-militaers-apuz-2009',
    title: 'Die politische Rolle des Militärs in der Türkei',
    date: '21 September 2009',
    subtitle: 'Aus Politik und Zeitgeschichte, Nr. 39-40/2009, 21. September 2009, S. 9-14',
    url: 'https://www.bpb.de/shop/zeitschriften/apuz/31728/die-politische-rolle-des-militaers-in-der-tuerkei/',
    sourceNote:
      "From Şahin Alpay's own publication list; the title and issue were confirmed against the Bundeszentrale für politische Bildung's own page for APuZ 39-40/2009.",
    tags: ['military', 'Ergenekon', 'civil-military relations', 'APuZ', 'German', '2009'],
  },
]
