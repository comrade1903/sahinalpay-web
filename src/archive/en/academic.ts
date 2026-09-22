import type { ArchiveItemSeed } from '../types'

/** The academic and analytical work Şahin Alpay published outside the Turkish
 *  press: chapters and articles in English, three pieces in German, and three
 *  Turkish-language texts that a foreign institution published (two Konrad
 *  Adenauer volumes and one from the Swedish Research Institute).
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
 */
export const enAcademicArticleSeeds: ArchiveItemSeed[] = [
  {
    slug: 'journalists-cautious-democrats-1993',
    title: 'Journalists: Cautious Democrats',
    date: '1993',
    subtitle:
      'In Turkey and the West: Changing Political and Cultural Identities (ed. Metin Heper, Ayşe Öncü, Heinz Kramer) — I.B. Tauris, London, 1993, pp. 69-91',
    sourceNote:
      'This record was supplied citing "Politics in the Third Turkish Republic" (Heper & Evin, Westview, 1994); that book holds no such chapter. The real source was confirmed by a work citing the article (Bilkent University Institutional Repository) and by an independent search.',
    tags: ['journalism', 'democracy', 'press', '1993'],
  },
  {
    slug: 'turkey-crisis-of-political-will-1998',
    title: 'Turkey: Crisis of Political Will',
    date: '1998',
    subtitle: 'Danish Institute of International Affairs, Working Papers 1998/3, 14 pp.',
    sourceNote: "From Şahin Alpay's own academic publication list.",
    tags: ['Turkish politics', 'working paper', '1998'],
  },
  {
    slug: 'after-ocalan-private-view-2000',
    title: 'After Öcalan',
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
    sourceNote: "From Şahin Alpay's own academic publication list.",
    tags: ['Europe', 'borders', 'chapter', '2003'],
  },
  {
    slug: 'crisis-in-the-identity-politics-of-turkey-2005',
    title: 'Crisis in the Identity Politics of Turkey',
    date: '2005',
    subtitle:
      'In Politics of Group Rights: The State and Multiculturalism (ed. Ishtiaq Ahmed) — University Press of America, Lanham, 2005, pp. 101-128',
    sourceNote: "From Şahin Alpay's own academic publication list.",
    tags: ['identity politics', 'multiculturalism', 'chapter', '2005'],
  },
  {
    slug: 'turkey-and-westernization-2007',
    title: 'Turkey and Westernization',
    date: '2007',
    subtitle:
      'In What is the West?: Perspectives from the Engelsberg Seminar 2007 (ed. Kurt Almqvist) — Axel and Margaret Ax:son Johnson Foundation, Stockholm, 2007, pp. 109-122',
    sourceNote: "From Şahin Alpay's own academic publication list.",
    tags: ['Westernization', 'chapter', '2007'],
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
    slug: 'making-sense-of-turkish-politics-2008',
    title: 'Making Sense of Turkish Politics',
    date: '2008',
    subtitle: 'The International Spectator, Vol. 43, No. 3, 2008, pp. 5-12',
    sourceNote: "From Şahin Alpay's own academic publication list.",
    tags: ['Turkish politics', 'article', '2008'],
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
    slug: 'the-declining-soft-power-of-the-eu-2009',
    title: 'The Declining Soft Power of the EU Regarding Turkey and Its Consequences',
    date: '2009',
    subtitle:
      'In Perceptions and Misperceptions in the EU and Turkey: Stumbling Blocks on the Road to Accession (ed. Peter Wolten) — Harmonie Papers, Centre for European Security Studies, Groningen, 2009, pp. 157-178',
    sourceNote: "From Şahin Alpay's own academic publication list.",
    tags: ['European Union', 'soft power', 'chapter', '2009'],
  },
  {
    slug: 'the-european-union-and-the-consolidation-of-democracy-2009',
    title: 'The European Union and the Consolidation of Democracy in Turkey',
    date: '2009',
    subtitle: 'Journal of Interdisciplinary Economics (ed. Ruth Taplin), Vol. 20, 2009, pp. 221-244',
    sourceNote: "From Şahin Alpay's own academic publication list.",
    tags: ['European Union', 'democracy', 'article', '2009'],
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
    sourceNote: 'Confirmed through Crossref (DOI 10.1057/9780230277397_20).',
    tags: ['media', 'press freedom', 'modernization', 'democracy', '2010'],
  },
  {
    slug: 'will-turkey-veer-towards-authoritarianism-2011',
    title: 'Will Turkey Veer Towards Authoritarianism Without the EU Anchor?',
    date: '2011',
    subtitle:
      'In What Does Turkey Think? — European Council on Foreign Relations, London, June 2011, pp. 31-36',
    sourceNote: "From Şahin Alpay's own academic publication list.",
    tags: ['European Union', 'authoritarianism', 'chapter', '2011'],
  },

  /* Turkish-language texts, published abroad or by a foreign institution's
     Turkish programme. They sit on this side of the archive at the owner's
     instruction — the section separates work published outside the Turkish
     press from the rest — so their titles, citations, source notes and tags
     stay exactly as they were written, in Turkish. */
  {
    slug: 'turk-modelinin-laikliginin-21-yuzyilda-gelecegi-2003',
    title: 'Türk Modelinin Laikliğinin 21. Yüzyılda Geleceği',
    date: '2003',
    subtitle:
      'Devlet ve Din İlişkileri - Farklı Modeller, Konseptler ve Tecrübeler Sempozyumu içinde — Konrad Adenauer Vakfı, Ankara, 2003, s. 135-138',
    sourceNote:
      'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır; listede "Türk Moddeli Laikliğin" olarak geçen başlıktaki yazım hatası düzeltilmiştir.',
    tags: ['laiklik', 'bildiri', '2003'],
  },
  {
    slug: 'turkiyedeki-laiklik-islam-ve-islamcilik-hakkinda-yanlis-anlayislar-2007',
    title: 'Türkiye’deki Laiklik, İslam ve İslamcılık Hakkında Yanlış Anlayışlar',
    date: '2007',
    subtitle:
      'Türkiye, İsveç ve Avrupa Birliği: Deneyimler ve Beklentiler içinde — İsveç Araştırma Enstitüsü, İstanbul, 2007, s. 45-52',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['laiklik', 'İslamcılık', 'makale', '2007'],
  },
  {
    slug: 'stratejik-derinlik-turkiyenin-uluslararasi-durusu-2010',
    title:
      'Stratejik Derinlik — Türkiye’nin Uluslararası Duruşu: Türkiye’nin Yeni Bir Dış Politikası Var mı?',
    date: '2010',
    subtitle:
      '23. Türk-Alman Gazetecilik Semineri: Tarihi Miras ve Güncel Beklentiler Arasındaki Türkiye içinde — Konrad Adenauer Stiftung, Ankara, 2010, s. 31-44',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['dış politika', 'bildiri', '2010'],
  },
]
