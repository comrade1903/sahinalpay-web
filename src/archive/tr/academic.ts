import type { ArchiveItemSeed } from '../types'

/** Academic output: the doctoral dissertation, the Swedish-period study it grew
 *  out of, and Turkish/English books and book chapters. Two further titles from
 *  the original list this file was seeded from — Türkiye'nin Tanıkları: İçeriden
 *  Bakanlar (2002) and Dışarıdan Bakanlar (2003) — are not repeated here because
 *  they already have full entries under Books.
 *
 *  Every entry below was checked against an independent bibliographic source
 *  before being added, not taken on trust from the list it was seeded from.
 *  Two of the six needed real correction, not just confirmation:
 *
 *  - "Journalists: Cautious Democrats" was seeded with the wrong book entirely
 *    (Politics in the Third Turkish Republic, Heper & Evin, Westview, 1994).
 *    The chapter is not in that book. A citing article (Bilkent repository PDF)
 *    and a second independent search both place it in Turkey and the West:
 *    Changing Political and Cultural Identities (Heper, Öncü, Kramer, eds.,
 *    I.B. Tauris, 1993), pp. 69-91 — corrected here accordingly.
 *  - "2000 Yılında Türkiye" does not exist under that title; three independent
 *    bookseller/library listings agree the 1991 Afa Yayınları book is titled
 *    "2020 Yılında Türkiye". Corrected.
 *
 *  Smaller corrections: the DSP-SHP book is co-authored with Seyfettin Gürsel
 *  and catalogued as "DSP-SHP", not "SHP-DSP" (Atatürk Kültür, Dil ve Tarih
 *  Yüksek Kurumu library catalogue). The Stockholm study's Swedish subtitle
 *  word order was "politik och samhälle", not "samhälle och politik" (Google
 *  Books, matching the LIBRIS/Stockholm Studies in Politics record).
 *
 *  The dissertation's exact title could not be confirmed from any source
 *  reached — general biographical accounts agree only on institution and year.
 *  It is listed with that gap stated rather than guessed at.
 */
export const academicArticleSeeds: ArchiveItemSeed[] = [
  {
    slug: 'doktora-tezi-stockholm-1981',
    title: 'Doktora Tezi (başlık teyit edilemedi)',
    date: '1981',
    subtitle: 'Stockholm Üniversitesi, Siyaset Bilimi',
    excerpt:
      'Stockholm Üniversitesi Siyaset Bilimi Bölümü\'nde 1981\'de tamamlanan doktora tezi. Genel biyografik kaynaklar kurumu ve yılı doğruluyor; tezin resmî başlığı hiçbir kaynakta doğrulanamadı.',
    sourceNote:
      'Kurum ve yıl genel biyografik kaynaklarla (Biyografya, T.C. Kültür ve Turizm Bakanlığı) teyit edilmiştir. Resmî tez başlığı doğrulanamadığı için buraya yazılmamıştır; CV veya Stockholm Üniversitesi kayıtlarından kesinleşince güncellenecektir.',
    tags: ['doktora tezi', 'Stockholm Üniversitesi', 'siyaset bilimi', '1981'],
  },
  {
    slug: 'turkar-i-stockholm-1980',
    title: 'Turkar i Stockholm: en studie av invandrare, politik och samhälle',
    date: '1980',
    subtitle: 'Stockholm Studies in Politics, c. 16 — LiberFörlag, Stockholm, 1980',
    excerpt:
      'İsveççe: "Stockholm\'de Türkler: Göçmenler, Siyaset ve Toplum Üzerine Bir İnceleme". İsveç\'e göç eden Türklerin siyasete ve topluma bakışını inceleyen, doktora dönemine ait akademik çalışma.',
    sourceNote:
      'Google Books ve LIBRIS (İsveç Ulusal Kütüphane Kataloğu) kayıtlarıyla teyit edilmiştir. ISBN 978-91-38-05635-6.',
    url: 'https://books.google.com/books/about/Turkar_i_Stockholm.html?id=X9HPAAAAIAAJ',
    tags: ['göç', 'İsveç', 'Stockholm', 'doktora dönemi', '1980'],
  },
  {
    slug: 'dsp-shp-nerede-birlesiyor-1986',
    title: 'DSP-SHP: Nerede Birleşiyor, Nerede Ayrılıyorlar?',
    date: '1986',
    subtitle: 'Şahin Alpay, Seyfettin Gürsel — Afa Yayınları, İstanbul, 1986, 172 s.',
    excerpt:
      'Demokratik Sol Parti (DSP) ile Sosyaldemokrat Halkçı Parti (SHP) arasındaki ideolojik yakınlaşma ve ayrılık noktalarını mülakatlarla inceleyen, Seyfettin Gürsel ile birlikte yazılmış kitap.',
    sourceNote:
      'Atatürk Kültür, Dil ve Tarih Yüksek Kurumu Kütüphanesi kataloğuyla teyit edilmiştir.',
    tags: ['DSP', 'SHP', 'sosyal demokrasi', 'Seyfettin Gürsel', '1986'],
  },
  {
    slug: '2020-yilinda-turkiye-1991',
    title: '2020 Yılında Türkiye',
    date: '1991',
    subtitle: 'Afa Yayınları, İstanbul, 1991, 182 s.',
    sourceNote:
      'Üç bağımsız ikinci el kitap kaydıyla (Nadir Kitap, Janus Mezat) teyit edilmiştir.',
    tags: ['Türkiye', 'gelecek öngörüsü', '1991'],
  },
  {
    slug: 'journalists-cautious-democrats-1993',
    title: 'Journalists: Cautious Democrats',
    date: '1993',
    subtitle:
      'Turkey and the West: Changing Political and Cultural Identities içinde (ed. Metin Heper, Ayşe Öncü, Heinz Kramer) — I.B. Tauris, London, 1993, s. 69-91',
    excerpt:
      'Türk gazetecilerin demokratik ilkelere bağlılığını ve bu bağlılığın sağlamlığına yönelik kendi aralarındaki kuşkuyu inceleyen akademik makale.',
    sourceNote:
      'Bu kayıt "Politics in the Third Turkish Republic" (Heper & Evin, Westview, 1994) kaynak gösterilerek iletilmişti; o kitapta böyle bir bölüm yok. Gerçek kaynak, makaleye atıf yapan bir çalışma (Bilkent Üniversitesi Kurumsal Arşivi) ile bağımsız bir aramada teyit edilmiştir.',
    tags: ['gazetecilik', 'demokrasi', 'basın', '1993'],
  },
  {
    slug: 'two-faces-of-the-press-2010',
    title:
      "Two Faces of the Press in Turkey: The Role of the Media in Turkey's Modernisation and Democracy",
    date: '2010',
    subtitle:
      "Turkey's Engagement with Modernity: Conflict and Change in the Twentieth Century içinde (ed. Celia Kerslake, Kerem Öktem, Philip Robins) — Palgrave Macmillan, Basingstoke, 2010, s. 370-387",
    excerpt:
      "Türkiye'nin modernleşme ve demokratikleşme sürecinde medyanın oynadığı çelişkili rolü inceleyen kitap bölümü.",
    sourceNote: 'Crossref (DOI 10.1057/9780230277397_20) ile teyit edilmiştir.',
    url: 'https://link.springer.com/chapter/10.1057/9780230277397_20',
    tags: ['medya', 'basın özgürlüğü', 'modernleşme', 'demokrasi', '2010'],
  },
]
