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
    title: 'Stockholm’de Türkler: Göçmenler Üzerine Sosyal ve Siyasal Bir Araştırma',
    date: '1981',
    subtitle: 'Doktora tezi — Stockholm Üniversitesi, Siyaset Bilimi',
    sourceNote:
      'Kurum ve yıl genel biyografik kaynaklarla (Biyografya, T.C. Kültür ve Turizm Bakanlığı) teyit edilmiştir; başlık Şahin Alpay’ın kendi Kimdir metninde verdiği tez adıdır.',
    tags: ['doktora tezi', 'Stockholm Üniversitesi', 'siyaset bilimi', '1981'],
  },
  {
    slug: 'turkar-i-stockholm-1980',
    title: 'Turkar i Stockholm: en studie av invandrare, politik och samhälle',
    date: '1980',
    subtitle: 'Stockholm Studies in Politics, c. 16 — LiberFörlag, Stockholm, 1980',
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
    sourceNote: 'Crossref (DOI 10.1057/9780230277397_20) ile teyit edilmiştir.',
    url: 'https://link.springer.com/chapter/10.1057/9780230277397_20',
    tags: ['medya', 'basın özgürlüğü', 'modernleşme', 'demokrasi', '2010'],
  },
  // Makale ve bildiriler — Şahin Alpay'ın kendi akademik yayın listesinden
  // alınmıştır. Bağımsız bir ikinci kaynakla teyit edilmemiştir; sourceNote
  // bunu her kayıtta belirtir.
  {
    slug: 'cagdas-bir-sosyal-demokrasi-icin-gorusler-1987',
    title: 'Çağdaş Bir Sosyal Demokrasi İçin Görüşler',
    date: '1987',
    subtitle: 'Banka ve Ekonomik Yorumlar, Ocak 1987, s. 35-45',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['sosyal demokrasi', 'makale', '1987'],
  },
  {
    slug: '68-kusagi-uzerine-bir-deneme-1988',
    title: '’68 Kuşağı Üzerine Bir Deneme',
    date: '1988',
    subtitle: 'Toplum ve Bilim, No. 41, Bahar 1988, s. 167-185',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['1968 kuşağı', 'makale', '1988'],
  },
  {
    slug: 'turkiyede-devlet-sivil-toplum-dengesi-1991',
    title: 'Türkiye’de Devlet-Sivil Toplum Dengesi Yeniden Kurulmalı',
    date: '1991',
    subtitle: 'Sivil Toplum içinde (ed. Yurdakul Fincancı) — TÜSES, İstanbul, 1991, s. 17-26',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['sivil toplum', 'devlet', 'makale', '1991'],
  },
  {
    slug: 'bizde-sosyal-demokrasi-marksizmden-degil-1991',
    title: 'Bizde Sosyal Demokrasi Marksizm’den Değil Ona Alternatif Olarak Doğdu',
    date: '1991',
    subtitle:
      'Resmi Tarih Sivil Arayış / Sosyal Demokratlarda İdeoloji ve Politika içinde — Röportaj: Ruşen Çakır, Hıdır Göktaş, Metis Güncel, İstanbul, Ekim 1991, s. 173-186',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['sosyal demokrasi', 'söyleşi', '1991'],
  },
  {
    slug: 'sosyal-demokrat-partiler-ve-ulusal-azinliklar-sorunu-1992',
    title: 'Sosyal Demokrat Partiler ve Ulusal Azınlıklar Sorunu',
    date: '1992',
    subtitle:
      'Şahin Alpay ve diğerleri, Sosyal Demokrasi Açısından Kürt Sorunu içinde — TÜSES, İstanbul, 1992, s. 1-22',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['Kürt sorunu', 'sosyal demokrasi', 'makale', '1992'],
  },
  {
    slug: 'kurt-sorunu-nasil-asilabilir-1996',
    title: 'Kürt Sorunu Nasıl Aşılabilir?',
    date: '1996',
    subtitle:
      'Seyfettin Gürsel ve diğerleri, Türkiye’nin Kürt Sorunu içinde — TÜSES, İstanbul, 1996, s. 153-164',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['Kürt sorunu', 'Seyfettin Gürsel', 'makale', '1996'],
  },
  {
    slug: 'mukayeseli-acidan-turkiyede-laiklik-2002',
    title: 'Mukayeseli Açıdan Türkiye’de Laiklik',
    date: '2002',
    subtitle:
      'Uluslararası Atatürk ve Çağdaş Toplum Sempozyumu içinde — Demokrasi ve Gençlik Vakfı, İş Bankası Kültür Yayınları, Ankara, 2002, s. 343-368',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['laiklik', 'bildiri', '2002'],
  },
  {
    slug: 'medyanin-krizi-krizin-medyasi-2003',
    title: 'Medyanın Krizi, Krizin Medyası: Medya Nereye?',
    date: '2003',
    subtitle: 'İktisat, İşletme ve Finans, İstanbul, Ocak 2003, s. 6-11',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['medya', 'makale', '2003'],
  },
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
    slug: 'dunya-gorusu-ve-siyaset-2009',
    title: 'Dünya Görüşü ve Siyaset',
    date: '2009',
    subtitle:
      'İletişimde Mükemmellik Programı: Dünya Görüşü içinde — Oger Telecom, İstanbul, Aralık 2009, s. 92-111',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['siyaset', 'makale', '2009'],
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
  {
    slug: 'turkey-crisis-of-political-will-1998',
    title: 'Turkey: Crisis of Political Will',
    date: '1998',
    subtitle: 'Danish Institute of International Affairs, Working Papers 1998/3, 14 s.',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['siyaset', 'çalışma raporu', '1998'],
  },
  {
    slug: 'borders-of-europe-a-turkish-perspective-2003',
    title: 'Borders of Europe: A Turkish Perspective',
    date: '2003',
    subtitle:
      'Whither Europe? Borders, Boundaries, Frontiers in a Changing World içinde (ed. Rutger Lindahl) — Göteborg University, Göteborg, 2003, pp. 73-82',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['Avrupa', 'makale', '2003'],
  },
  {
    slug: 'crisis-in-the-identity-politics-of-turkey-2005',
    title: 'Crisis in the Identity Politics of Turkey',
    date: '2005',
    subtitle:
      'Politics of Group Rights: The State and Multiculturalism içinde (ed. Ishtiaq Ahmed) — University Press of America, Lanham, 2005, pp. 101-128',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['kimlik siyaseti', 'makale', '2005'],
  },
  {
    slug: 'turkey-and-westernization-2007',
    title: 'Turkey and Westernization',
    date: '2007',
    subtitle:
      'What is the West?: Perspectives from the Engelsberg Seminar 2007 içinde (ed. Kurt Almqvist) — Axel and Margaret Ax:son Johnson Foundation, Stockholm, 2007, pp. 109-122',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['batılılaşma', 'makale', '2007'],
  },
  {
    slug: 'making-sense-of-turkish-politics-2008',
    title: 'Making Sense of Turkish Politics',
    date: '2008',
    subtitle: 'The International Spectator, Vol. 43, No. 3, 2008, pp. 5-12',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['Türk siyaseti', 'makale', '2008'],
  },
  {
    slug: 'the-declining-soft-power-of-the-eu-2009',
    title: 'The Declining Soft Power of the EU Regarding Turkey and Its Consequences',
    date: '2009',
    subtitle:
      'Perceptions and Misperceptions in the EU and Turkey: Stumbling Blocks on the Road to Accession içinde (ed. Peter Wolten) — Harmonie Papers, Centre for European Security Studies, Groningen, 2009, pp. 157-178',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['Avrupa Birliği', 'makale', '2009'],
  },
  {
    slug: 'the-european-union-and-the-consolidation-of-democracy-2009',
    title: 'The European Union and the Consolidation of Democracy in Turkey',
    date: '2009',
    subtitle: 'Journal of Interdisciplinary Economics (ed. Ruth Taplin), Vol. 20, 2009, pp. 221-244',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['Avrupa Birliği', 'demokrasi', 'makale', '2009'],
  },
  {
    slug: 'will-turkey-veer-towards-authoritarianism-2011',
    title: 'Will Turkey Veer Towards Authoritarianism Without the EU Anchor?',
    date: '2011',
    subtitle: 'What Does Turkey Think? içinde — European Council on Foreign Relations, London, Haziran 2011, pp. 31-36',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['Avrupa Birliği', 'otoriterleşme', 'makale', '2011'],
  },
  {
    slug: 'toplum-bilimlerinin-mantigi-1983',
    title: 'Toplum Bilimlerinin Mantığı',
    date: '1983',
    subtitle: 'Karl R. Popper’dan çeviri — Yazko Felsefe Yazıları, 7. Kitap, İstanbul, 1983, s. 112-127',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['çeviri', 'Karl Popper', '1983'],
  },
  {
    slug: 'toplum-bilimlerinde-ondeyi-ve-kehanet-1982',
    title: 'Toplum Bilimlerinde Öndeyi ve Kehanet',
    date: '1982',
    subtitle:
      'Karl R. Popper / Bryan Magee’den çeviri, Mete Tunçay’a ek — Karl Popper’in Bilim Felsefesi ve Siyaset Kuramı içinde, Remzi Kitabevi, İstanbul, 1982, s. 135-149',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['çeviri', 'Karl Popper', '1982'],
  },
  {
    slug: 'anglosakson-bilim-felsefesi-1-1982',
    title: 'Anglosakson Bilim Felsefesi (I. Bölüm)',
    date: '1982',
    subtitle: 'Ingvar Johansson’dan çeviri — Yazko Felsefe Yazıları, 4. Kitap, İstanbul, 1982, s. 5-35',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['çeviri', 'bilim felsefesi', '1982'],
  },
  {
    slug: 'anglosakson-bilim-felsefesi-2-1983',
    title: 'Anglosakson Bilim Felsefesi (II. Bölüm)',
    date: '1983',
    subtitle: 'Ingvar Johansson’dan çeviri — Yazko Felsefe Yazıları, 5. Kitap, İstanbul, 1983, s. 87-114',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['çeviri', 'bilim felsefesi', '1983'],
  },
  {
    slug: 'piyasa-ekonomisi-ve-demokrasi-1985',
    title: 'Piyasa Ekonomisi ve Demokrasi',
    date: '1985',
    subtitle: 'Assar Lindbeck’ten çeviri — Birey ve Toplum Yayınları, İstanbul, Mart 1985, 131 s.',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['çeviri', 'ekonomi', '1985'],
  },
]
