import type { ArchiveItemSeed } from '../types'

/** The academic and analytical work Şahin Alpay published in languages other
 *  than Turkish: chapters and articles in English and three pieces in German.
 *  The Turkish-language texts that foreign institutions published (two Konrad
 *  Adenauer volumes and one from the Swedish Research Institute) sit with the
 *  Turkish records in tr/academic.ts: the list goes by the language of the
 *  piece, not by the publisher's country (the owner asked on 2026-10-22).
 *
 *  They live on the English side of the archive so the Academic Articles page
 *  separates them from the Turkish list under its own heading, the way every
 *  section already lists the other language's records. Ten of them were filed
 *  with the Turkish records until 2026-09-22, which put English chapters under
 *  a "Turkish-Language Writing" heading; only their language and the wording
 *  of their citations changed in the move — no title, date, page range or
 *  source note lost a fact.
 *
 *  Sources: most entries come from Şahin Alpay's own publication list and say
 *  so. Two were checked further, and the APuZ title was corrected against the
 *  Bundeszentrale für politische Bildung's own page for issue 39-40/2009 (the
 *  list had "Die Politische Rolle des Militars" in "Zeitgeshichte" — both
 *  transcription slips). The Süddeutsche Zeitung and FAZ pieces predate those
 *  papers' open archives and rest on the list alone.
 *
 *  The pieces marked `hidden` exist here only as citations: neither the owner
 *  nor the scan folders hold their text, so on 2026-10-27 the owner asked for
 *  them to come off the page. They stay in the record should the originals
 *  turn up.
 */
export const enAcademicArticleSeeds: ArchiveItemSeed[] = [
  {
    slug: 'journalists-cautious-democrats-1993',
    title: 'Journalists: Cautious Democrats',
    date: '1993',
    subtitle:
      'In Turkey and the West: Changing Political and Cultural Identities (ed. Metin Heper, Ayşe Öncü, Heinz Kramer) — I.B. Tauris, London, 1993, pp. 69-91',
    sourceNote:
      'This record was supplied citing "Politics in the Third Turkish Republic" (Heper & Evin, Westview, 1994); that book holds no such chapter. The real source was confirmed by a work citing the article (Bilkent University Institutional Repository) and by an independent search, and then by the volume itself, whose chapter 4 opens under Şahin Alpay\'s name. The page images are pp. 69-91 of that volume.',
    tags: ['journalism', 'democracy', 'press', '1993'],
    clippings: [
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-1.webp', pageLabel: 'Page 1' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-2.webp', pageLabel: 'Page 2' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-3.webp', pageLabel: 'Page 3' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-4.webp', pageLabel: 'Page 4' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-5.webp', pageLabel: 'Page 5' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-6.webp', pageLabel: 'Page 6' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-7.webp', pageLabel: 'Page 7' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-8.webp', pageLabel: 'Page 8' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-9.webp', pageLabel: 'Page 9' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-10.webp', pageLabel: 'Page 10' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-11.webp', pageLabel: 'Page 11' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-12.webp', pageLabel: 'Page 12' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-13.webp', pageLabel: 'Page 13' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-14.webp', pageLabel: 'Page 14' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-15.webp', pageLabel: 'Page 15' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-16.webp', pageLabel: 'Page 16' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-17.webp', pageLabel: 'Page 17' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-18.webp', pageLabel: 'Page 18' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-19.webp', pageLabel: 'Page 19' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-20.webp', pageLabel: 'Page 20' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-21.webp', pageLabel: 'Page 21' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-22.webp', pageLabel: 'Page 22' },
      { src: '/archive/clippings/academic/1993/journalists-cautious-democrats-1993/page-23.webp', pageLabel: 'Page 23' },
    ],
  },
  {
    slug: 'turkey-crisis-of-political-will-1998',
    title: 'Turkey: Crisis of Political Will',
    date: '1998',
    subtitle: 'Danish Institute of International Affairs, Working Papers 1998/3, 14 pp.',
    sourceNote: "From Şahin Alpay's own academic publication list. The page images are from Şahin Alpay's archive.",
    tags: ['Turkish politics', 'working paper', '1998'],
    clippings: [
      { src: '/archive/clippings/academic/1998/turkey-crisis-of-political-will-1998/page-1.webp', pageLabel: 'Page 1' },
      { src: '/archive/clippings/academic/1998/turkey-crisis-of-political-will-1998/page-2.webp', pageLabel: 'Page 2' },
      { src: '/archive/clippings/academic/1998/turkey-crisis-of-political-will-1998/page-3.webp', pageLabel: 'Page 3' },
      { src: '/archive/clippings/academic/1998/turkey-crisis-of-political-will-1998/page-4.webp', pageLabel: 'Page 4' },
      { src: '/archive/clippings/academic/1998/turkey-crisis-of-political-will-1998/page-5.webp', pageLabel: 'Page 5' },
      { src: '/archive/clippings/academic/1998/turkey-crisis-of-political-will-1998/page-6.webp', pageLabel: 'Page 6' },
      { src: '/archive/clippings/academic/1998/turkey-crisis-of-political-will-1998/page-7.webp', pageLabel: 'Page 7' },
      { src: '/archive/clippings/academic/1998/turkey-crisis-of-political-will-1998/page-8.webp', pageLabel: 'Page 8' },
      { src: '/archive/clippings/academic/1998/turkey-crisis-of-political-will-1998/page-9.webp', pageLabel: 'Page 9' },
      { src: '/archive/clippings/academic/1998/turkey-crisis-of-political-will-1998/page-10.webp', pageLabel: 'Page 10' },
      { src: '/archive/clippings/academic/1998/turkey-crisis-of-political-will-1998/page-11.webp', pageLabel: 'Page 11' },
      { src: '/archive/clippings/academic/1998/turkey-crisis-of-political-will-1998/page-12.webp', pageLabel: 'Page 12' },
      { src: '/archive/clippings/academic/1998/turkey-crisis-of-political-will-1998/page-13.webp', pageLabel: 'Page 13' },
      { src: '/archive/clippings/academic/1998/turkey-crisis-of-political-will-1998/page-14.webp', pageLabel: 'Page 14' },
      { src: '/archive/clippings/academic/1998/turkey-crisis-of-political-will-1998/page-15.webp', pageLabel: 'Page 15' },
      { src: '/archive/clippings/academic/1998/turkey-crisis-of-political-will-1998/page-16.webp', pageLabel: 'Page 16' },
      { src: '/archive/clippings/academic/1998/turkey-crisis-of-political-will-1998/page-17.webp', pageLabel: 'Page 17' },
      { src: '/archive/clippings/academic/1998/turkey-crisis-of-political-will-1998/page-18.webp', pageLabel: 'Page 18' },
    ],
  },
  {
    slug: 'after-ocalan-private-view-2000',
    title: 'After Öcalan',
    hidden: true,
    date: '2000',
    subtitle: 'Private View (TÜSİAD Quarterly Review), Spring 2000, pp. 34-42',
    sourceNote: "From Şahin Alpay's own publication list.",
    tags: ['Öcalan', 'Kurdish question', 'Private View', 'TÜSİAD', '2000'],
  },
  {
    slug: 'borders-of-europe-a-turkish-perspective-2003',
    title: 'Borders of Europe: A Turkish Perspective',
    date: '2003',
    subtitle:
      'In Whither Europe? Borders, Boundaries, Frontiers in a Changing World (ed. Rutger Lindahl) — Göteborg University, Göteborg, 2003, pp. 73-82',
    sourceNote: "From Şahin Alpay's own academic publication list. The page images are from Şahin Alpay's archive.",
    tags: ['Europe', 'borders', 'chapter', '2003'],
    clippings: [
      { src: '/archive/clippings/academic/2003/borders-of-europe-a-turkish-perspective-2003/page-1.webp', pageLabel: 'Page 1' },
      { src: '/archive/clippings/academic/2003/borders-of-europe-a-turkish-perspective-2003/page-2.webp', pageLabel: 'Page 2' },
      { src: '/archive/clippings/academic/2003/borders-of-europe-a-turkish-perspective-2003/page-3.webp', pageLabel: 'Page 3' },
      { src: '/archive/clippings/academic/2003/borders-of-europe-a-turkish-perspective-2003/page-4.webp', pageLabel: 'Page 4' },
      { src: '/archive/clippings/academic/2003/borders-of-europe-a-turkish-perspective-2003/page-5.webp', pageLabel: 'Page 5' },
      { src: '/archive/clippings/academic/2003/borders-of-europe-a-turkish-perspective-2003/page-6.webp', pageLabel: 'Page 6' },
      { src: '/archive/clippings/academic/2003/borders-of-europe-a-turkish-perspective-2003/page-7.webp', pageLabel: 'Page 7' },
      { src: '/archive/clippings/academic/2003/borders-of-europe-a-turkish-perspective-2003/page-8.webp', pageLabel: 'Page 8' },
      { src: '/archive/clippings/academic/2003/borders-of-europe-a-turkish-perspective-2003/page-9.webp', pageLabel: 'Page 9' },
      { src: '/archive/clippings/academic/2003/borders-of-europe-a-turkish-perspective-2003/page-10.webp', pageLabel: 'Page 10' },
    ],
  },
  {
    slug: 'crisis-in-the-identity-politics-of-turkey-2005',
    title: 'Crisis in the Identity Politics of Turkey',
    date: '2005',
    subtitle:
      'In The Politics of Group Rights: The State and Multiculturalism (ed. Ishtiaq Ahmed) — University Press of America, Lanham, 2005, pp. 101-128',
    sourceNote: "From Şahin Alpay's own academic publication list. The page images are from Şahin Alpay's archive.",
    tags: ['identity politics', 'multiculturalism', 'chapter', '2005'],
    clippings: [
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-1.webp', pageLabel: 'Page 1' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-2.webp', pageLabel: 'Page 2' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-3.webp', pageLabel: 'Page 3' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-4.webp', pageLabel: 'Page 4' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-5.webp', pageLabel: 'Page 5' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-6.webp', pageLabel: 'Page 6' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-7.webp', pageLabel: 'Page 7' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-8.webp', pageLabel: 'Page 8' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-9.webp', pageLabel: 'Page 9' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-10.webp', pageLabel: 'Page 10' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-11.webp', pageLabel: 'Page 11' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-12.webp', pageLabel: 'Page 12' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-13.webp', pageLabel: 'Page 13' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-14.webp', pageLabel: 'Page 14' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-15.webp', pageLabel: 'Page 15' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-16.webp', pageLabel: 'Page 16' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-17.webp', pageLabel: 'Page 17' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-18.webp', pageLabel: 'Page 18' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-19.webp', pageLabel: 'Page 19' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-20.webp', pageLabel: 'Page 20' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-21.webp', pageLabel: 'Page 21' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-22.webp', pageLabel: 'Page 22' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-23.webp', pageLabel: 'Page 23' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-24.webp', pageLabel: 'Page 24' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-25.webp', pageLabel: 'Page 25' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-26.webp', pageLabel: 'Page 26' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-27.webp', pageLabel: 'Page 27' },
      { src: '/archive/clippings/academic/2005/crisis-in-the-identity-politics-of-turkey-2005/page-28.webp', pageLabel: 'Page 28' },
    ],
  },
  {
    slug: 'misconceptions-about-secularism-islam-and-islamism-in-turkey-2006',
    title: 'Misconceptions about Secularism, Islam, and Islamism in Turkey',
    date: 'April 2006',
    subtitle:
      'In Turkey, Sweden and the European Union: Experiences and Expectations — Swedish Institute for European Policy Studies (SIEPS), Stockholm, April 2006, pp. 14-17',
    url: 'https://sieps.se/en/publications/2006/turkey-sweden-and-the-european-union-experiences-and-expectations/',
    sourceNote:
      "Confirmed against the report's own table of contents and list of contributors, published by SIEPS. The page images are from Şahin Alpay's archive. A Turkish text under the same title, Türkiye’deki Laiklik, İslam ve İslamcılık Hakkında Yanlış Anlayışlar, appeared in 2007 in the Swedish Research Institute's Türkiye, İsveç ve Avrupa Birliği.",
    tags: ['secularism', 'Islam', 'Islamism', 'SIEPS', '2006'],
    clippings: [
      { src: '/archive/clippings/academic/2006/misconceptions-about-secularism-islam-and-islamism-in-turkey-2006/page-1.webp', pageLabel: 'Page 1' },
      { src: '/archive/clippings/academic/2006/misconceptions-about-secularism-islam-and-islamism-in-turkey-2006/page-2.webp', pageLabel: 'Page 2' },
      { src: '/archive/clippings/academic/2006/misconceptions-about-secularism-islam-and-islamism-in-turkey-2006/page-3.webp', pageLabel: 'Page 3' },
      { src: '/archive/clippings/academic/2006/misconceptions-about-secularism-islam-and-islamism-in-turkey-2006/page-4.webp', pageLabel: 'Page 4' },
    ],
  },
  {
    slug: 'turkey-and-westernization-2007',
    title: 'Turkey and Westernisation',
    date: '2007',
    subtitle:
      'In What is the West?: Perspectives from the Engelsberg Seminar 2007 (ed. Kurt Almqvist) — Axel and Margaret Ax:son Johnson Foundation, Stockholm, 2007, pp. 109-122',
    sourceNote:
      "From Şahin Alpay's own academic publication list; the title is spelt as printed in the chapter. The page images are from Şahin Alpay's archive.",
    tags: ['Westernization', 'chapter', '2007'],
    clippings: [
      { src: '/archive/clippings/academic/2007/turkey-and-westernization-2007/page-1.webp', pageLabel: 'Page 1' },
      { src: '/archive/clippings/academic/2007/turkey-and-westernization-2007/page-2.webp', pageLabel: 'Page 2' },
      { src: '/archive/clippings/academic/2007/turkey-and-westernization-2007/page-3.webp', pageLabel: 'Page 3' },
      { src: '/archive/clippings/academic/2007/turkey-and-westernization-2007/page-4.webp', pageLabel: 'Page 4' },
      { src: '/archive/clippings/academic/2007/turkey-and-westernization-2007/page-5.webp', pageLabel: 'Page 5' },
      { src: '/archive/clippings/academic/2007/turkey-and-westernization-2007/page-6.webp', pageLabel: 'Page 6' },
      { src: '/archive/clippings/academic/2007/turkey-and-westernization-2007/page-7.webp', pageLabel: 'Page 7' },
      { src: '/archive/clippings/academic/2007/turkey-and-westernization-2007/page-8.webp', pageLabel: 'Page 8' },
      { src: '/archive/clippings/academic/2007/turkey-and-westernization-2007/page-9.webp', pageLabel: 'Page 9' },
      { src: '/archive/clippings/academic/2007/turkey-and-westernization-2007/page-10.webp', pageLabel: 'Page 10' },
      { src: '/archive/clippings/academic/2007/turkey-and-westernization-2007/page-11.webp', pageLabel: 'Page 11' },
      { src: '/archive/clippings/academic/2007/turkey-and-westernization-2007/page-12.webp', pageLabel: 'Page 12' },
      { src: '/archive/clippings/academic/2007/turkey-and-westernization-2007/page-13.webp', pageLabel: 'Page 13' },
      { src: '/archive/clippings/academic/2007/turkey-and-westernization-2007/page-14.webp', pageLabel: 'Page 14' },
    ],
  },
  {
    slug: 'on-the-verge-of-the-west-axess-2007',
    title: 'On the Verge of the West',
    hidden: true,
    date: '2007',
    subtitle: 'Global Axess, interview — Thomas Gür',
    sourceNote: "From Şahin Alpay's own publication list.",
    tags: ['Thomas Gür', 'Global Axess', '2007'],
  },
  {
    slug: 'die-republik-der-buerokraten-sz-2007',
    title: 'Die Republik der Bürokraten',
    hidden: true,
    date: '3 May 2007',
    subtitle: 'Süddeutsche Zeitung, Nr. 101, "Thema des Tages", 3 Mai 2007, S. 2',
    sourceNote: "From Şahin Alpay's own publication list.",
    tags: ['bureaucracy', 'Turkish politics', 'Süddeutsche Zeitung', 'German', '2007'],
  },
  {
    slug: 'making-sense-of-turkish-politics-2008',
    title: 'Making Sense of Turkish Politics',
    date: '2008',
    subtitle: 'The International Spectator, Vol. 43, No. 3, 2008, pp. 5-12',
    sourceNote: "From Şahin Alpay's own academic publication list. The page images are from Şahin Alpay's archive.",
    tags: ['Turkish politics', 'article', '2008'],
    clippings: [
      { src: '/archive/clippings/academic/2008/making-sense-of-turkish-politics-2008/page-1.webp', pageLabel: 'Page 1' },
      { src: '/archive/clippings/academic/2008/making-sense-of-turkish-politics-2008/page-2.webp', pageLabel: 'Page 2' },
      { src: '/archive/clippings/academic/2008/making-sense-of-turkish-politics-2008/page-3.webp', pageLabel: 'Page 3' },
      { src: '/archive/clippings/academic/2008/making-sense-of-turkish-politics-2008/page-4.webp', pageLabel: 'Page 4' },
      { src: '/archive/clippings/academic/2008/making-sense-of-turkish-politics-2008/page-5.webp', pageLabel: 'Page 5' },
      { src: '/archive/clippings/academic/2008/making-sense-of-turkish-politics-2008/page-6.webp', pageLabel: 'Page 6' },
      { src: '/archive/clippings/academic/2008/making-sense-of-turkish-politics-2008/page-7.webp', pageLabel: 'Page 7' },
      { src: '/archive/clippings/academic/2008/making-sense-of-turkish-politics-2008/page-8.webp', pageLabel: 'Page 8' },
    ],
  },
  {
    slug: 'was-wird-aus-der-tuerkei-faz-2008',
    title: 'Was wird aus der Türkei?',
    hidden: true,
    date: '15 October 2008',
    subtitle: 'Frankfurter Allgemeine Zeitung, 15. Oktober 2008, S. 8',
    sourceNote: "From Şahin Alpay's own publication list.",
    tags: ['Turkey', 'EU accession', 'Frankfurter Allgemeine Zeitung', 'German', '2008'],
  },
  {
    slug: 'the-declining-soft-power-of-the-eu-2009',
    title: 'The Declining Soft Power of the EU Regarding Turkey and Its Consequences',
    date: '2009',
    subtitle:
      'In Perceptions and Misperceptions in the EU and Turkey: Stumbling Blocks on the Road to Accession (ed. Peter M.E. Volten) — Harmonie Papers, Centre for European Security Studies, Groningen, 2009, pp. 157-177',
    sourceNote:
      "From Şahin Alpay's own academic publication list; the editor's name and the last page (177, not 178) were corrected against the chapter itself. The page images are from Şahin Alpay's archive.",
    tags: ['European Union', 'soft power', 'chapter', '2009'],
    clippings: [
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-1.webp', pageLabel: 'Page 1' },
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-2.webp', pageLabel: 'Page 2' },
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-3.webp', pageLabel: 'Page 3' },
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-4.webp', pageLabel: 'Page 4' },
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-5.webp', pageLabel: 'Page 5' },
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-6.webp', pageLabel: 'Page 6' },
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-7.webp', pageLabel: 'Page 7' },
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-8.webp', pageLabel: 'Page 8' },
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-9.webp', pageLabel: 'Page 9' },
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-10.webp', pageLabel: 'Page 10' },
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-11.webp', pageLabel: 'Page 11' },
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-12.webp', pageLabel: 'Page 12' },
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-13.webp', pageLabel: 'Page 13' },
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-14.webp', pageLabel: 'Page 14' },
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-15.webp', pageLabel: 'Page 15' },
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-16.webp', pageLabel: 'Page 16' },
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-17.webp', pageLabel: 'Page 17' },
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-18.webp', pageLabel: 'Page 18' },
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-19.webp', pageLabel: 'Page 19' },
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-20.webp', pageLabel: 'Page 20' },
      { src: '/archive/clippings/academic/2009/the-declining-soft-power-of-the-eu-2009/page-21.webp', pageLabel: 'Page 21' },
    ],
  },
  {
    slug: 'the-european-union-and-the-consolidation-of-democracy-2009',
    title: 'The European Union and the Consolidation of Democracy in Turkey',
    date: '2009',
    subtitle: 'Journal of Interdisciplinary Economics (ed. Ruth Taplin), Vol. 20, 2009, pp. 221-244',
    sourceNote: "From Şahin Alpay's own academic publication list. The page images are from Şahin Alpay's archive.",
    tags: ['European Union', 'democracy', 'article', '2009'],
    clippings: [
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-1.webp', pageLabel: 'Page 1' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-2.webp', pageLabel: 'Page 2' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-3.webp', pageLabel: 'Page 3' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-4.webp', pageLabel: 'Page 4' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-5.webp', pageLabel: 'Page 5' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-6.webp', pageLabel: 'Page 6' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-7.webp', pageLabel: 'Page 7' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-8.webp', pageLabel: 'Page 8' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-9.webp', pageLabel: 'Page 9' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-10.webp', pageLabel: 'Page 10' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-11.webp', pageLabel: 'Page 11' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-12.webp', pageLabel: 'Page 12' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-13.webp', pageLabel: 'Page 13' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-14.webp', pageLabel: 'Page 14' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-15.webp', pageLabel: 'Page 15' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-16.webp', pageLabel: 'Page 16' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-17.webp', pageLabel: 'Page 17' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-18.webp', pageLabel: 'Page 18' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-19.webp', pageLabel: 'Page 19' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-20.webp', pageLabel: 'Page 20' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-21.webp', pageLabel: 'Page 21' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-22.webp', pageLabel: 'Page 22' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-23.webp', pageLabel: 'Page 23' },
      { src: '/archive/clippings/academic/2009/the-european-union-and-the-consolidation-of-democracy-2009/page-24.webp', pageLabel: 'Page 24' },
    ],
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
  {
    slug: 'two-faces-of-the-press-2010',
    title:
      "Two Faces of the Press in Turkey: The Role of the Media in Turkey's Modernisation and Democracy",
    date: '2010',
    subtitle:
      "In Turkey's Engagement with Modernity: Conflict and Change in the Twentieth Century (ed. Celia Kerslake, Kerem Öktem, Philip Robins) — Palgrave Macmillan, Basingstoke, 2010, pp. 370-387",
    url: 'https://link.springer.com/chapter/10.1057/9780230277397_20',
    sourceNote:
      "Confirmed through Crossref (DOI 10.1057/9780230277397_20). The page images, the whole chapter (pp. 370-387), are from Şahin Alpay's archive.",
    tags: ['media', 'press freedom', 'modernization', 'democracy', '2010'],
    clippings: [
      { src: '/archive/clippings/academic/2010/two-faces-of-the-press-2010/page-1.webp', pageLabel: 'Page 1' },
      { src: '/archive/clippings/academic/2010/two-faces-of-the-press-2010/page-2.webp', pageLabel: 'Page 2' },
      { src: '/archive/clippings/academic/2010/two-faces-of-the-press-2010/page-3.webp', pageLabel: 'Page 3' },
      { src: '/archive/clippings/academic/2010/two-faces-of-the-press-2010/page-4.webp', pageLabel: 'Page 4' },
      { src: '/archive/clippings/academic/2010/two-faces-of-the-press-2010/page-5.webp', pageLabel: 'Page 5' },
      { src: '/archive/clippings/academic/2010/two-faces-of-the-press-2010/page-6.webp', pageLabel: 'Page 6' },
      { src: '/archive/clippings/academic/2010/two-faces-of-the-press-2010/page-7.webp', pageLabel: 'Page 7' },
      { src: '/archive/clippings/academic/2010/two-faces-of-the-press-2010/page-8.webp', pageLabel: 'Page 8' },
      { src: '/archive/clippings/academic/2010/two-faces-of-the-press-2010/page-9.webp', pageLabel: 'Page 9' },
      { src: '/archive/clippings/academic/2010/two-faces-of-the-press-2010/page-10.webp', pageLabel: 'Page 10' },
      { src: '/archive/clippings/academic/2010/two-faces-of-the-press-2010/page-11.webp', pageLabel: 'Page 11' },
      { src: '/archive/clippings/academic/2010/two-faces-of-the-press-2010/page-12.webp', pageLabel: 'Page 12' },
      { src: '/archive/clippings/academic/2010/two-faces-of-the-press-2010/page-13.webp', pageLabel: 'Page 13' },
      { src: '/archive/clippings/academic/2010/two-faces-of-the-press-2010/page-14.webp', pageLabel: 'Page 14' },
      { src: '/archive/clippings/academic/2010/two-faces-of-the-press-2010/page-15.webp', pageLabel: 'Page 15' },
      { src: '/archive/clippings/academic/2010/two-faces-of-the-press-2010/page-16.webp', pageLabel: 'Page 16' },
      { src: '/archive/clippings/academic/2010/two-faces-of-the-press-2010/page-17.webp', pageLabel: 'Page 17' },
      { src: '/archive/clippings/academic/2010/two-faces-of-the-press-2010/page-18.webp', pageLabel: 'Page 18' },
    ],
  },
  {
    slug: 'will-turkey-veer-towards-authoritarianism-2011',
    title: 'Will Turkey Veer Towards Authoritarianism Without the EU Anchor?',
    date: '2011',
    subtitle:
      'In What Does Turkey Think? (ed. Dimitar Bechev) — European Council on Foreign Relations, London, June 2011, pp. 31-36',
    sourceNote: "From Şahin Alpay's own academic publication list. The page images are from Şahin Alpay's archive.",
    tags: ['European Union', 'authoritarianism', 'chapter', '2011'],
    clippings: [
      { src: '/archive/clippings/academic/2011/will-turkey-veer-towards-authoritarianism-2011/page-1.webp', pageLabel: 'Page 1' },
      { src: '/archive/clippings/academic/2011/will-turkey-veer-towards-authoritarianism-2011/page-2.webp', pageLabel: 'Page 2' },
      { src: '/archive/clippings/academic/2011/will-turkey-veer-towards-authoritarianism-2011/page-3.webp', pageLabel: 'Page 3' },
      { src: '/archive/clippings/academic/2011/will-turkey-veer-towards-authoritarianism-2011/page-4.webp', pageLabel: 'Page 4' },
      { src: '/archive/clippings/academic/2011/will-turkey-veer-towards-authoritarianism-2011/page-5.webp', pageLabel: 'Page 5' },
      { src: '/archive/clippings/academic/2011/will-turkey-veer-towards-authoritarianism-2011/page-6.webp', pageLabel: 'Page 6' },
    ],
  },

  /* Turkish-language texts, published abroad or by a foreign institution's
     Turkish programme. They sit on this side of the archive at the owner's
     instruction — the section separates work published outside the Turkish
     press from the rest — so their titles, citations, source notes and tags
     stay exactly as they were written, in Turkish. */
]
