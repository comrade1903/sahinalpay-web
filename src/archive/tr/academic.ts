import type { ArchiveItemSeed } from '../types'

/** His Turkish-language academic output: books and book chapters, articles,
 *  conference papers, magazine essays and translations. The work he published
 *  in English and German sits in archive/en/academic.ts, which is what gives
 *  the Academic Articles page its foreign-language half.
 *
 *  The doctoral dissertation and the Swedish-period study it grew out of
 *  (Turkar i Stockholm, 1980) are not
 *  listed here — Şahin Alpay confirmed the two are the same work, published
 *  as a book, so it lives under Books rather than being duplicated here.
 *  Books are not repeated here at all. Türkiye'nin Tanıkları: İçeriden
 *  Bakanlar (2002) and Dışarıdan Bakanlar (2003) never were; DSP-SHP (1986)
 *  and 2020 Yılında Türkiye (1991) were listed as articles until 2026-09-23
 *  and now sit under Books, where the owner placed them.
 *
 *  The entries seeded from his publication list were checked against an
 *  independent bibliographic source before being added, rather than taken on
 *  trust. One needed real correction, not just confirmation (the correction
 *  to "Journalists: Cautious Democrats" travelled with it to the English
 *  file):
 *
 *  - "2000 Yılında Türkiye" does not exist under that title; three independent
 *    bookseller/library listings agree the 1991 Afa Yayınları book is titled
 *    "2020 Yılında Türkiye". Corrected.
 *
 *  Smaller correction: the DSP-SHP book is co-authored with Seyfettin Gürsel
 *  and catalogued as "DSP-SHP", not "SHP-DSP" (Atatürk Kültür, Dil ve Tarih
 *  Yüksek Kurumu library catalogue).
 */
export const academicArticleSeeds: ArchiveItemSeed[] = [
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
    slug: 'dunya-gorusu-ve-siyaset-2009',
    title: 'Dünya Görüşü ve Siyaset',
    date: '2009',
    subtitle:
      'İletişimde Mükemmellik Programı: Dünya Görüşü içinde — Oger Telecom, İstanbul, Aralık 2009, s. 92-111',
    sourceNote: 'Şahin Alpay’ın kendi akademik yayın listesinden alınmıştır.',
    tags: ['siyaset', 'makale', '2009'],
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
  {
    slug: 'siyasal-islamin-basari-sansi-1997',
    title: "Siyasal İslam'ın Başarı Şansı",
    date: 'Kasım 1997',
    subtitle: 'Sözleşme (aylık dergi), Yıl 1, Sayı 1, Kasım 1997, s. 20-22',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['siyasal İslam', 'din ve siyaset', 'Sözleşme', '1997'],
  },
  {
    slug: 'iskandinav-sosyal-demokrasisi-ornek-olabilir-mi-1988',
    title: "İskandinav sosyal demokrasisi Türkiye'ye örnek olabilir mi?",
    date: 'Mart 1988',
    subtitle: 'Sosyal Demokrat (aylık siyasi kültürel dergi), Mart 1988, s. 18-19',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['sosyal demokrasi', 'İskandinavya', 'İsveç', 'Sosyal Demokrat', '1988'],
  },
  {
    slug: 'shpnin-sorunu-liderlik-mi-1988',
    title: "SHP'nin sorunu liderlik mi?",
    date: 'Nisan 1988',
    subtitle: 'Sosyal Demokrat, Nisan 1988, s. 26-27',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['SHP', 'sosyal demokrasi', 'liderlik', 'Sosyal Demokrat', '1988'],
  },
  {
    slug: 'shp-programi-yenilensin-1991',
    title: 'SHP programı yenilensin',
    date: 'Temmuz 1991',
    subtitle: 'Sosyal Demokrat, Temmuz 1991, s. 28-30',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['SHP', 'parti programı', 'sosyal demokrasi', 'Sosyal Demokrat', '1991'],
  },
  {
    slug: 'gelecegi-bilmek-ve-secmek-1992',
    title: 'Geleceği bilmek ve seçmek',
    date: '1992',
    subtitle:
      'Türkiye Günlüğü (üç aylık fikir ve kültür dergisi), Yaz 1992, s. 53-56',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['gelecek', 'siyaset felsefesi', 'Türkiye Günlüğü', '1992'],
  },
  {
    slug: 'turkiyede-reform-ihtiyaci-ve-sol-1993',
    title: "Türkiye'de reform ihtiyacı ve sol",
    date: '1993',
    subtitle: 'Türkiye Günlüğü, Bahar 1993, s. 75-83',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['sol', 'reform', 'Türkiye Günlüğü', '1993'],
  },
  {
    slug: 'milliyetcilik-ozgurlukcu-demokrasiyle-nasil-bagdasir-1993',
    title: 'Milliyetçilik özgürlükçü demokrasiyle nasıl bağdaşır?',
    date: '1993',
    subtitle: 'Türkiye Günlüğü, Yaz 1993, s. 14-16',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['milliyetçilik', 'özgürlükçü demokrasi', 'Türkiye Günlüğü', '1993'],
  },
  {
    slug: 'medyada-ifade-ozgurlugunun-engelleri-2001',
    title: 'Medyada ifade özgürlüğünün engelleri',
    date: '2001',
    subtitle:
      'Karizma (üç aylık düşünce dergisi), Temmuz-Ağustos-Eylül 2001 sayısı, s. 63-67',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['ifade özgürlüğü', 'medya', 'basın', 'Karizma', '2001'],
  },
  {
    slug: '11-eylul-ve-uygarlik-savasi-2002',
    title: '11 Eylül ve uygarlık savaşı',
    date: '2002',
    subtitle: 'Karizma, Ocak-Şubat-Mart 2002 sayısı, s. 65-69',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['11 Eylül', 'uygarlıklar çatışması', 'terör', 'Karizma', '2002'],
  },
]
