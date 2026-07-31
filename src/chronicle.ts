export type ChronicleEventKind = 'national' | 'personal'

export interface ChronicleEvent {
  year: number
  tr: string
  en: string
  kind: ChronicleEventKind
}

/** Owner-approved historical markers. National = Turkey's political ruptures;
    personal = documented, public facts about Şahin Alpay. Do not add entries
    without owner sign-off (content-integrity rule). */
export const chronicleEvents: ChronicleEvent[] = [
  { year: 1971, tr: '12 Mart Muhtırası', en: 'March 12 memorandum', kind: 'national' },
  { year: 1980, tr: '12 Eylül askerî darbesi', en: 'September 12 coup', kind: 'national' },
  {
    year: 1997,
    tr: '28 Şubat süreci ("postmodern darbe")',
    en: 'February 28 "postmodern coup"',
    kind: 'national',
  },
  { year: 2002, tr: 'AK Parti ilk seçim zaferi', en: "AK Party's first election win", kind: 'national' },
  {
    year: 2005,
    tr: 'Türkiye–AB üyelik müzakereleri başladı',
    en: 'Turkey–EU accession talks begin',
    kind: 'national',
  },
  {
    year: 2007,
    tr: 'Cumhurbaşkanlığı krizi ve e-muhtıra',
    en: 'Presidential crisis & e-memorandum',
    kind: 'national',
  },
  { year: 2013, tr: 'Gezi Parkı protestoları', en: 'Gezi Park protests', kind: 'national' },
  { year: 2016, tr: '15 Temmuz darbe girişimi', en: 'July 15 coup attempt', kind: 'national' },
  { year: 2016, tr: 'Şahin Alpay tutuklandı', en: 'Şahin Alpay detained', kind: 'personal' },
  {
    year: 2018,
    tr: 'AYM ve AİHM hak ihlali kararı; tahliye',
    en: 'Constitutional Court & ECtHR rulings; release',
    kind: 'personal',
  },
]
