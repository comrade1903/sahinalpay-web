import type { ArchiveItemSeed } from '../../types'

/** Cumhuriyet, 1982-1992. Two distinct periods sit in this file.
 *
 *  1982-1989: he ran the paper's book-and-ideas page — "düşünce inceleme
 *  araştırma" from January 1982, later titled "Yayın Dünyasında İnceleme
 *  Araştırma", with "Yöneten Şahin Alpay" in its masthead. The output is
 *  review essays (most signed Ş.A. at the foot) and long interviews with
 *  social scientists.
 *
 *  1991-1992: he wrote a signed column, "Ortam".
 *
 *  Alongside both runs sit signed pieces from elsewhere in the paper:
 *  dispatches filed from New Orleans, Prague, Tokyo and Bonn, one sports-page
 *  essay, and a review for the paper's book supplement, Cumhuriyet Kitap,
 *  whose inner pages carry an issue number but no printed date.
 *
 *  Every entry is a full broadsheet page, so the scan carries other
 *  writers' work alongside his — on 4 July 1987 his Şerif Mardin interview
 *  runs beside Mehmed Kemal's own column. Titles here were read off the
 *  page rather than extracted from the OCR layer for exactly that reason.
 */
export const cumhuriyetColumnSeeds: ArchiveItemSeed[] = [
  {
    slug: 'baslarken',
    title: 'Başlarken',
    date: '28 Ocak 1982',
    subtitle: 'Cumhuriyet, 28 Ocak 1982, s. 5',
    excerpt:
      'Cumhuriyet\'in "düşünce inceleme araştırma" sayfasını açan ilk yazı. Ülkede iktisat, sosyoloji, siyaset bilimi, psikoloji, sosyal antropoloji, tarih, hukuk ve felsefe dallarında küçümsenmeyecek boyutlara ulaşan yayın hayatının izleneceğini, her hafta öncelikle yeni yayınların ele alınacağını duyurur.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['düşünce inceleme araştırma', 'sosyal bilimler', 'yayın hayatı', '1982'],
    pdfSrc: '/archive/pdf/cumhuriyet/1982/baslarken.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1982/baslarken/cover.jpg',
        alt: 'Cumhuriyet, 28 Ocak 1982, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'sabri-ulgenerle-sohbet',
    title: "Sabri Ülgener'le Sohbet",
    date: '25 Mart 1982',
    subtitle: 'Cumhuriyet, 25 Mart 1982, s. 5',
    excerpt:
      '"Sosyal Bilim Dünyamızda iki Başyapıt" başlığı altında, İktisadi Çözülmenin Ahlak ve Zihniyet Dünyası ile Zihniyet ve Din üzerine Sabri Ülgener\'le söyleşi. Çözülme devri zihniyeti, iktisadi ahlak ve Weber tartışması.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Sabri Ülgener', 'iktisat ahlakı', 'Max Weber', 'zihniyet', 'söyleşi', '1982'],
    pdfSrc: '/archive/pdf/cumhuriyet/1982/sabri-ulgenerle-sohbet.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1982/sabri-ulgenerle-sohbet/cover.jpg',
        alt: 'Cumhuriyet, 25 Mart 1982, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'ideoloji-uzerine-serif-mardinle-sohbet',
    title: '"İdeoloji" Üzerine Şerif Mardin\'le Sohbet',
    date: '29 Nisan 1982',
    subtitle: 'Cumhuriyet, 29 Nisan 1982, s. 5',
    excerpt:
      'Şerif Mardin\'in İdeoloji kitabının ikinci baskısı vesilesiyle yapılan söyleşi. İdeoloji kavramının bilimsel olarak tanımlanabilirliği, "sert" ve "yumuşak" ideoloji ayrımı, Türkiye\'de siyasal düşüncenin kalıpları.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Şerif Mardin', 'ideoloji', 'siyaset sosyolojisi', 'söyleşi', '1982'],
    pdfSrc: '/archive/pdf/cumhuriyet/1982/ideoloji-uzerine-serif-mardinle-sohbet.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1982/ideoloji-uzerine-serif-mardinle-sohbet/cover.jpg',
        alt: 'Cumhuriyet, 29 Nisan 1982, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'turkiyede-milli-iktisat',
    title: 'Türkiye\'de "Milli İktisat" (1908-1918)',
    date: '6 Mayıs 1982',
    subtitle: 'Cumhuriyet, 6 Mayıs 1982, s. 5',
    excerpt:
      'Zafer Toprak\'ın Türkiye\'de "Milli İktisat" (1908-1918) adlı kitabı üzerine inceleme. II. Meşrutiyet döneminde Osmanlı liberalizmi, İttihat ve Terakki\'nin iktisat politikaları ve "milli iktisat" programının ulusçu kaynakları.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Zafer Toprak', 'milli iktisat', 'II. Meşrutiyet', 'İttihat ve Terakki', 'iktisat tarihi', '1982'],
    pdfSrc: '/archive/pdf/cumhuriyet/1982/turkiyede-milli-iktisat.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1982/turkiyede-milli-iktisat/cover.jpg',
        alt: 'Cumhuriyet, 6 Mayıs 1982, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'mete-tuncayla-sohbet',
    title: "Mete Tunçay'la sohbet",
    date: '1 Temmuz 1982',
    subtitle: 'Cumhuriyet, 1 Temmuz 1982, s. 5',
    excerpt:
      '"Yeni yayınlar üzerine" başlığıyla Mete Tunçay\'la söyleşi. Türkiye\'de Sol Akımlar çalışması, tek parti dönemi yönetiminin kuruluşu ve Türkiye\'de siyaset biliminin gelişimi.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Mete Tunçay', 'tek parti dönemi', 'sol akımlar', 'siyaset bilimi', 'söyleşi', '1982'],
    pdfSrc: '/archive/pdf/cumhuriyet/1982/mete-tuncayla-sohbet.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1982/mete-tuncayla-sohbet/cover.jpg',
        alt: 'Cumhuriyet, 1 Temmuz 1982, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'bilimsel-devrimlerin-yapisi',
    title: 'Bilimsel Devrimlerin Yapısı',
    date: '4 Kasım 1982',
    subtitle: 'Cumhuriyet, 4 Kasım 1982, s. 5',
    excerpt:
      'Thomas S. Kuhn\'un The Structure of Scientific Revolutions (1962) adlı eserinin Nilüfer Kuyaş çevirisiyle Türkçeye kazandırılması üzerine inceleme. Kuhn\'un "paradigma" ve "olağan bilim" kavramları ile bilimin kesintisiz biriken doğrularla ilerlediği görüşüne getirdiği eleştiri.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Thomas Kuhn', 'bilim felsefesi', 'paradigma', 'Karl Popper', '1982'],
    pdfSrc: '/archive/pdf/cumhuriyet/1982/bilimsel-devrimlerin-yapisi.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1982/bilimsel-devrimlerin-yapisi/cover.jpg',
        alt: 'Cumhuriyet, 4 Kasım 1982, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'karl-popperin-bilim-felsefesi-ve-siyaset-kurami',
    title: "Karl Popper'in Bilim Felsefesi ve Siyaset Kuramı",
    date: '11 Kasım 1982',
    subtitle: 'Cumhuriyet, 11 Kasım 1982, s. 5',
    excerpt:
      'Bryan Magee\'nin Karl Popper\'i tanıtan kitabı (Çev. Mete Tunçay, Remzi Kitabevi, 1982) üzerine inceleme. Popper\'in mantıkçı pozitivizm eleştirisi, "deneme ve yanılma" olarak bilimsel yöntem ve totaliter düşüncenin eleştirisi.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Karl Popper', 'Bryan Magee', 'bilim felsefesi', 'açık toplum', 'totalitarizm', '1982'],
    pdfSrc: '/archive/pdf/cumhuriyet/1982/karl-popperin-bilim-felsefesi-ve-siyaset-kurami.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1982/karl-popperin-bilim-felsefesi-ve-siyaset-kurami/cover.jpg',
        alt: 'Cumhuriyet, 11 Kasım 1982, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'saglikli-bir-bilim-anlayisi',
    title: 'Sağlıklı bir bilim anlayışı',
    date: '7 Nisan 1983',
    subtitle: 'Cumhuriyet, 7 Nisan 1983, s. 5',
    excerpt:
      'Sabri F. Ülgener\'in Zihniyet, Aydınlar ve İzm\'ler adlı kitabı üzerine inceleme. Ülgener\'in iktisadi ahlak ve zihniyet araştırmaları, aydın ile bürokrat arasındaki ilişki ve bilim ile ideolojiyi birbirinden ayırma çabası.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Sabri Ülgener', 'zihniyet', 'aydınlar', 'ideoloji', 'iktisat', '1983'],
    pdfSrc: '/archive/pdf/cumhuriyet/1983/saglikli-bir-bilim-anlayisi.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1983/saglikli-bir-bilim-anlayisi/cover.jpg',
        alt: 'Cumhuriyet, 7 Nisan 1983, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'bilim-demokrasi-iliskisi',
    title: 'Bilim-demokrasi ilişkisi',
    date: '2 Şubat 1984',
    subtitle: 'Cumhuriyet, 2 Şubat 1984, s. 5',
    excerpt:
      'YAZKO\'nun Felsefe Yazıları dizisinin 7. kitabı üzerine inceleme. Popper\'in eleştirel akılcılığından hareketle bilimin neden ancak eleştirme özgürlüğünün bulunduğu demokratik bir ortamda gelişebileceği ve bilimsel nesnelliğin toplumsal koşulları.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Karl Popper', 'bilim felsefesi', 'demokrasi', 'Felsefe Yazıları', '1984'],
    pdfSrc: '/archive/pdf/cumhuriyet/1984/bilim-demokrasi-iliskisi.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1984/bilim-demokrasi-iliskisi/cover.jpg',
        alt: 'Cumhuriyet, 2 Şubat 1984, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'zor-zamanda-konusmak',
    title: 'Zor zamanda konuşmak',
    date: '1 Mart 1984',
    subtitle: 'Cumhuriyet, 1 Mart 1984, s. 5',
    excerpt:
      'İsmet Özel\'in Yeni Devir gazetesinde 1977-79 ve 1981-82 yıllarında çıkan günlük fıkralarından seçmeleri kapsayan kitabı üzerine inceleme. Özel\'in bilimin "bir despotluk aracına dönüşmesi" eleştirisine hak verirken, 1960\'ların Mülkiye\'sinden tanıdığı eski dostuyla düşünce özgürlüğünde buluştuklarını yazar.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['İsmet Özel', 'düşünce özgürlüğü', 'bilim eleştirisi', 'Yeni Devir', '1984'],
    pdfSrc: '/archive/pdf/cumhuriyet/1984/zor-zamanda-konusmak.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1984/zor-zamanda-konusmak/cover.jpg',
        alt: 'Cumhuriyet, 1 Mart 1984, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'sosyal-demokrasi-ve-marksizm-iliskisi',
    title: 'Sosyal demokrasi ve Marksizm ilişkisi',
    date: '5 Temmuz 1984',
    subtitle: 'Cumhuriyet, 5 Temmuz 1984, s. 5',
    excerpt:
      'Haluk Özdalga\'nın Çağdaş Sosyal Demokrasinin Oluşumu adlı kitabı üzerine inceleme. Sosyal demokrasi ile Marksizm arasındaki tarihsel bağ, Marksist sosyalizm ile Metternich sosyalizmi ayrımı ve İsveç sosyal demokrasisinin deneyimi.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Haluk Özdalga', 'sosyal demokrasi', 'Marksizm', 'İsveç', 'Sosyalist Enternasyonal', '1984'],
    pdfSrc: '/archive/pdf/cumhuriyet/1984/sosyal-demokrasi-ve-marksizm-iliskisi.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1984/sosyal-demokrasi-ve-marksizm-iliskisi/cover.jpg',
        alt: 'Cumhuriyet, 5 Temmuz 1984, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'fkonun-seruveni',
    title: "FKÖ'nün serüveni",
    date: '19 Temmuz 1984',
    subtitle: 'Cumhuriyet, 19 Temmuz 1984, s. 5',
    excerpt:
      'Cengiz Çandar\'ın Tarihle Randevu: Beyrut\'un Ateş Çemberinde FKÖ adlı kitabı üzerine inceleme. 1981 yazından 1983 sonbaharına Filistin Kurtuluş Örgütü\'nün "talihsiz serüveni" ve Çandar\'ın olayı içinde yaşayarak izleyen dış politika muhabirliğinin bizde pek örneği bulunmayan yeri.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Cengiz Çandar', 'FKÖ', 'Filistin', 'Ortadoğu', 'gazetecilik', '1984'],
    pdfSrc: '/archive/pdf/cumhuriyet/1984/fkonun-seruveni.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1984/fkonun-seruveni/cover.jpg',
        alt: 'Cumhuriyet, 19 Temmuz 1984, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'siyasetin-kendine-ozgu-yasalari-var-midir',
    title: 'Siyasetin kendine özgü yasaları var mıdır?',
    date: '13 Eylül 1984',
    subtitle: 'Cumhuriyet, 13 Eylül 1984, s. 5',
    excerpt:
      'Machiavelli\'nin Hükümdar\'ının Selahattin Bağdatlı çevirisiyle yayımlanması üzerine inceleme. Machiavelli\'nin güçlü devlet kuramı, adı "Makyavelizm"e çıkan değer yargıları ve Floransa\'nın tarihsel ortamının bu düşünceye katkısı.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Machiavelli', 'Hükümdar', 'siyaset felsefesi', 'devlet', '1984'],
    pdfSrc: '/archive/pdf/cumhuriyet/1984/siyasetin-kendine-ozgu-yasalari-var-midir.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1984/siyasetin-kendine-ozgu-yasalari-var-midir/cover.jpg',
        alt: 'Cumhuriyet, 13 Eylül 1984, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'toplumu-bicimlendiren-doga-midir',
    title: 'Toplumu biçimlendiren doğa mıdır?',
    date: '8 Kasım 1984',
    subtitle: 'Cumhuriyet, 8 Kasım 1984, s. 5',
    excerpt:
      'İlkay Sunar\'ın Düşün ve Toplum adlı kitabı üzerine inceleme. Toplumsal gerçekliğin doğa tarafından mı yoksa insan tarafından mı kurulduğu sorusu çevresinde pozitivist ve hümanist gelenekler ile bilgi, ideoloji ve özgürlük arasındaki ilişki.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['İlkay Sunar', 'pozitivizm', 'sosyal bilimler', 'ideoloji', '1984'],
    pdfSrc: '/archive/pdf/cumhuriyet/1984/toplumu-bicimlendiren-doga-midir.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1984/toplumu-bicimlendiren-doga-midir/cover.jpg',
        alt: 'Cumhuriyet, 8 Kasım 1984, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'weber-ilk-kez-dilimize-cevrildi',
    title: 'Weber ilk kez dilimize çevrildi',
    date: '14 Şubat 1985',
    subtitle: 'Cumhuriyet, 14 Şubat 1985, s. 5',
    excerpt:
      'Max Weber\'in Protestan Ahlakı ve Kapitalizmin Ruhu ile Donald MacRae\'nin Weber\'i tanıtan kitabının üst üste Türkçeye çevrilmesi üzerine inceleme. Weber\'e duyulan ilginin Marx ve Durkheim\'ın gerisinde kalışı ve Sabri Ülgener\'in Weber okuması.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Max Weber', 'Protestan Ahlakı', 'sosyoloji', 'Sabri Ülgener', 'kapitalizm', '1985'],
    pdfSrc: '/archive/pdf/cumhuriyet/1985/weber-ilk-kez-dilimize-cevrildi.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1985/weber-ilk-kez-dilimize-cevrildi/cover.jpg',
        alt: 'Cumhuriyet, 14 Şubat 1985, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'mspnin-gelisimi-ve-ideolojisi',
    title: "MSP'nin gelişimi ve ideolojisi",
    date: '11 Nisan 1985',
    subtitle: 'Cumhuriyet, 11 Nisan 1985, s. 5',
    excerpt:
      'Ali Yaşar Sarıbay\'ın Türkiye\'de Modernleşme, Din ve Parti Politikası: "MSP Örnek Olayı" adlı kitabı üzerine inceleme. Çok partili parlamenter rejime sahip tek Müslüman ülkede dinin politik bir güç olarak rolü ve MSP üzerine yapılmış akademik çalışmaların dökümü.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Ali Yaşar Sarıbay', 'Milli Selamet Partisi', 'modernleşme', 'din ve siyaset', '1985'],
    pdfSrc: '/archive/pdf/cumhuriyet/1985/mspnin-gelisimi-ve-ideolojisi.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1985/mspnin-gelisimi-ve-ideolojisi/cover.jpg',
        alt: 'Cumhuriyet, 11 Nisan 1985, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'enerji-teknik-bir-sorun-mudur',
    title: 'Enerji, teknik bir sorun mudur?',
    date: '18 Temmuz 1985',
    subtitle: 'Cumhuriyet, 18 Temmuz 1985, s. 5',
    excerpt:
      'Stephen Croall ve Kaianders\'in Nükleer Enerji mi? adlı kitabı üzerine inceleme. Nükleer enerji tartışmasının teknik değil politik bir sorun olduğu, enerji üretim biçiminin toplumsal örgütlenmeyle ilişkisi.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['nükleer enerji', 'enerji politikası', 'çevre', 'teknoloji', '1985'],
    pdfSrc: '/archive/pdf/cumhuriyet/1985/enerji-teknik-bir-sorun-mudur.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1985/enerji-teknik-bir-sorun-mudur/cover.jpg',
        alt: 'Cumhuriyet, 18 Temmuz 1985, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'ceyrek-asir-sonra-abd',
    title: 'Çeyrek asır sonra ABD',
    date: '29 Eylül 1985',
    subtitle: 'Cumhuriyet, 29 Eylül 1985, s. 12',
    excerpt:
      'New Orleans\'tan izlenimler. "Milletlerden oluşan bir millet" olarak Amerikan toplumu, kentin Creole ve Cajun köklerinden bugüne kalanlar ve ABD\'nin bir türlü çözemediği ırk sorunu.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['ABD', 'New Orleans', 'ırk sorunu', 'göçmenlik', 'izlenim', '1985'],
    pdfSrc: '/archive/pdf/cumhuriyet/1985/ceyrek-asir-sonra-abd.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1985/ceyrek-asir-sonra-abd/cover.jpg',
        alt: 'Cumhuriyet, 29 Eylül 1985, s. 12',
        pageLabel: 's. 12',
      },
    ],
  },
  {
    slug: 'kalkinmada-bir-strateji-arayisi-mi',
    title: '"Kalkınmada bir strateji arayışı" mı?',
    date: '9 Ocak 1987',
    subtitle: 'Cumhuriyet, 9 Ocak 1987, s. 5',
    excerpt:
      'Hikmet Özdemir\'in Kalkınmada Bir Strateji Arayışı: YÖN Hareketi adlı kitabı üzerine inceleme. 1961-1967 arasında çıkan YÖN dergisinin çevresinde toplanan akım, "yeni devletçilik" ve Türk solunda YÖN\'ün mirası.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Hikmet Özdemir', 'YÖN hareketi', 'Doğan Avcıoğlu', 'kalkınma', 'Türk solu', '1987'],
    pdfSrc: '/archive/pdf/cumhuriyet/1987/kalkinmada-bir-strateji-arayisi-mi.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1987/kalkinmada-bir-strateji-arayisi-mi/cover.jpg',
        alt: 'Cumhuriyet, 9 Ocak 1987, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'islami-hayat-tarzi-amaclaniyor',
    title: 'İslami hayat tarzı amaçlanıyor',
    date: '4 Temmuz 1987',
    subtitle: 'Cumhuriyet, 4 Temmuz 1987, s. 8',
    excerpt:
      '"Prof. Şerif Mardin\'e göre İslami canlanış, modernleşmenin sonucu" üst başlığıyla söyleşi. Mardin, İslami canlanışın siyasetçilerce tezgâhlanan yapay bir gelişme olmadığını, eğitimin yaygınlaşması ve ekonomik gelişmenin kolaylaştırdığı köklü bir dönüşüm olduğunu anlatır.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Şerif Mardin', 'İslami canlanış', 'modernleşme', 'din ve toplum', 'söyleşi', '1987'],
    pdfSrc: '/archive/pdf/cumhuriyet/1987/islami-hayat-tarzi-amaclaniyor.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1987/islami-hayat-tarzi-amaclaniyor/cover.jpg',
        alt: 'Cumhuriyet, 4 Temmuz 1987, s. 8',
        pageLabel: 's. 8',
      },
    ],
  },
  {
    slug: 'pragda-bahar',
    title: "Prag'da Bahar",
    date: '27 Eylül 1987',
    subtitle: 'Cumhuriyet, 27 Eylül 1987, s. 7',
    excerpt:
      'Çekoslovakya\'dan izlenimler. Prag Kalesi\'ndeki yaşlı rehberin sözlerinden yola çıkarak glasnost beklentisinin toplumdaki karşılığı, 18 Temmuz 1987\'de kamuoyuna açıklanan ekonomik reform yasa tasarısı ve devlet işletmelerine özerklik tartışması.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Çekoslovakya', 'Prag', 'glasnost', 'ekonomik reform', 'sosyalizm', '1987'],
    pdfSrc: '/archive/pdf/cumhuriyet/1987/pragda-bahar.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1987/pragda-bahar/cover.jpg',
        alt: 'Cumhuriyet, 27 Eylül 1987, s. 7',
        pageLabel: 's. 7',
      },
    ],
  },
  {
    slug: 'japonlarin-calisma-hastaligi',
    title: 'Japonların çalışma hastalığı',
    date: '15 Kasım 1987',
    subtitle: 'Cumhuriyet, 15 Kasım 1987, s. 13',
    excerpt:
      'Tokyo\'dan izlenimler. Kişi başına yıllık çalışma saatlerinin ülkelere göre dökümü, Japon eğitim sisteminin yaratıcılığı boğduğu yolundaki eleştiriler ve Japonları daha az çalışıp daha çok eğlenmeye ikna etme tartışması.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Japonya', 'Tokyo', 'çalışma hayatı', 'eğitim', 'izlenim', '1987'],
    pdfSrc: '/archive/pdf/cumhuriyet/1987/japonlarin-calisma-hastaligi.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1987/japonlarin-calisma-hastaligi/cover.jpg',
        alt: 'Cumhuriyet, 15 Kasım 1987, s. 13',
        pageLabel: 's. 13',
      },
    ],
  },
  {
    slug: 'turk-tarihinin-sifir-noktasi',
    title: 'Türk tarihinin sıfır noktası',
    date: '3 Aralık 1987',
    subtitle: 'Cumhuriyet, 3 Aralık 1987, s. 5',
    excerpt:
      '"Sencer Divitçioğlu\'na göre Kök Türkler" üst başlığıyla söyleşi. Divitçioğlu, Kök Türk toplumunun sosyal yapısını antropolojik bir model ışığında ve Orhun yazıtlarına dayanarak yorumlar.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Sencer Divitçioğlu', 'Kök Türkler', 'Orhun yazıtları', 'tarih', 'söyleşi', '1987'],
    pdfSrc: '/archive/pdf/cumhuriyet/1987/turk-tarihinin-sifir-noktasi.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1987/turk-tarihinin-sifir-noktasi/cover.jpg',
        alt: 'Cumhuriyet, 3 Aralık 1987, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'mehmet-ali-aybarin-anilari',
    title: "Mehmet Ali Aybar'ın anıları",
    date: '14 Nisan 1988',
    subtitle: 'Cumhuriyet, 14 Nisan 1988, s. 5',
    excerpt:
      'Mehmet Ali Aybar\'ın beş cilt olarak tasarlanan TİP Tarihi\'nin birinci cildi üzerine inceleme. 1960\'lar Türkiye\'si, Türkiye İşçi Partisi\'nin kuruluşu ve Aybar\'ın "güler yüzlü sosyalizm" ile "devlete sahip olanlar" kavramları.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Mehmet Ali Aybar', 'Türkiye İşçi Partisi', '1960\'lar', 'sosyalizm', 'anı', '1988'],
    pdfSrc: '/archive/pdf/cumhuriyet/1988/mehmet-ali-aybarin-anilari.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1988/mehmet-ali-aybarin-anilari/cover.jpg',
        alt: 'Cumhuriyet, 14 Nisan 1988, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'sair-ismet-ozelin-masali',
    title: "Şair İsmet Özel'in masalı",
    date: '11 Ağustos 1988',
    subtitle: 'Cumhuriyet, 11 Ağustos 1988, s. 5',
    excerpt:
      'İsmet Özel\'in Waldo Sen Neden Burada Değilsin? adlı kitabı üzerine inceleme. Şairin komünistlikten Müslümanlığa uzanan öyküsü, "İslami değerlerin belirleyici olduğu düzen" arayışı ve Batı kültürüne karşı tutumu.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['İsmet Özel', 'şiir', 'İslamcılık', 'aydın', 'düşünce', '1988'],
    pdfSrc: '/archive/pdf/cumhuriyet/1988/sair-ismet-ozelin-masali.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1988/sair-ismet-ozelin-masali/cover.jpg',
        alt: 'Cumhuriyet, 11 Ağustos 1988, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'kadro-ve-kadrocular',
    title: "'Kadro' ve Kadrocular",
    date: '25 Ağustos 1988',
    subtitle: 'Cumhuriyet, 25 Ağustos 1988, s. 5',
    excerpt:
      'Merdan Yanardağ\'ın Türk Siyasal Yaşamında Kadro Hareketi adlı kitabı üzerine inceleme. 1932-1935 arasında çıkan Kadro dergisi çevresinde toplanan aydınların "ideolojisini" geliştirme iddiası ve Kadro\'nun devletçiliği.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Merdan Yanardağ', 'Kadro dergisi', 'devletçilik', 'tek parti dönemi', '1988'],
    pdfSrc: '/archive/pdf/cumhuriyet/1988/kadro-ve-kadrocular.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1988/kadro-ve-kadrocular/cover.jpg',
        alt: 'Cumhuriyet, 25 Ağustos 1988, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'demokrasinin-gelecegi',
    title: 'Demokrasinin geleceği',
    date: '3 Kasım 1988',
    subtitle: 'Cumhuriyet, 3 Kasım 1988, s. 5',
    excerpt:
      'Norberto Bobbio\'nun demokrasi ile sosyalizm ilişkisini konu alan eserleri üzerine inceleme. Servetin, siyasi gücün ve bilginin dağılımındaki eşitsizlikler liberal demokrasiyi yetersiz bırakır; ancak bu eşitsizlikler de yine liberal demokratik çerçeve içinde giderilebilir. Yazı sayfanın yedinci yılını da anıyor.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Norberto Bobbio', 'demokrasi', 'sosyalizm', 'liberalizm', '1988'],
    pdfSrc: '/archive/pdf/cumhuriyet/1988/demokrasinin-gelecegi.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1988/demokrasinin-gelecegi/cover.jpg',
        alt: 'Cumhuriyet, 3 Kasım 1988, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'bilim-iktisat-ve-piyasa',
    title: 'Bilim, iktisat ve piyasa',
    date: '6 Nisan 1989',
    subtitle: 'Cumhuriyet, 6 Nisan 1989, s. 5',
    excerpt:
      'Ayşe Buğra\'nın İktisatçılar ve İnsanlar adlı kitabı üzerine inceleme. İktisadın bir bilim olarak kabul edilmesinin koşulları, "kurulmuş toplum" eleştirisi ve insan hakları ile piyasa arasındaki ilişki.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Ayşe Buğra', 'iktisat', 'bilim felsefesi', 'piyasa', 'insan hakları', '1989'],
    pdfSrc: '/archive/pdf/cumhuriyet/1989/bilim-iktisat-ve-piyasa.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1989/bilim-iktisat-ve-piyasa/cover.jpg',
        alt: 'Cumhuriyet, 6 Nisan 1989, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'sosyalizmin-gelecegi',
    title: 'Sosyalizmin geleceği',
    date: '15 Haziran 1989',
    subtitle: 'Cumhuriyet, 15 Haziran 1989, s. 5',
    excerpt:
      'Murat Belge\'nin Sosyalizm, Türkiye ve Gelecek adlı kitabı üzerine inceleme. Belge\'nin özgürlükçü, çoğulcu ve özyönetimci bir sosyalizm arayışı, Türkiye\'de egemen ideoloji saydığı korporatizm çözümlemesi ve kavramlarını tanımlamayışının doğurduğu güçlükler.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Murat Belge', 'sosyalizm', 'çoğulculuk', 'korporatizm', 'Türk solu', '1989'],
    pdfSrc: '/archive/pdf/cumhuriyet/1989/sosyalizmin-gelecegi.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1989/sosyalizmin-gelecegi/cover.jpg',
        alt: 'Cumhuriyet, 15 Haziran 1989, s. 5',
        pageLabel: 's. 5',
      },
    ],
  },
  {
    slug: 'demokrasi-olmadan-sosyalizm-olamaz',
    title: "'Demokrasi olmadan sosyalizm olamaz'",
    date: '22 Haziran 1989',
    subtitle: 'Cumhuriyet, 22 Haziran 1989, s. 16',
    excerpt:
      '"Sosyalist Enternasyonal\'den Notlar" başlığıyla Stockholm\'den izlenimler. Enternasyonal\'in 18. kongresinde kabul edilen yeni ilkeler bildirgesi, Willy Brandt\'ın konuşması ve kongrede gündeme gelen Kürt sorunu.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Sosyalist Enternasyonal', 'Willy Brandt', 'Stockholm', 'sosyal demokrasi', '1989'],
    pdfSrc: '/archive/pdf/cumhuriyet/1989/demokrasi-olmadan-sosyalizm-olamaz.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1989/demokrasi-olmadan-sosyalizm-olamaz/cover.jpg',
        alt: 'Cumhuriyet, 22 Haziran 1989, s. 16',
        pageLabel: 's. 16',
      },
    ],
  },
  {
    slug: 'inonu-stadinda-pazar-keyfi',
    title: "İnönü Stadı'nda pazar keyfi",
    date: '24 Kasım 1989',
    subtitle: 'Cumhuriyet, 24 Kasım 1989, s. 18',
    excerpt:
      'Beşiktaş-Ankaragücü maçını, ABD\'den on iki yıl sonra gelen dostu Prof. Timur Kuran ile İnönü Stadı\'nda izlerken yaşadıkları. Numaralı koltuk düzenine yeni geçen stadyumda direğin arkasına düşen koltuklar üzerinden seyirciye gösterilen özeni sorgular.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['futbol', 'İnönü Stadı', 'Beşiktaş', 'Timur Kuran', 'gündelik hayat', '1989'],
    pdfSrc: '/archive/pdf/cumhuriyet/1989/inonu-stadinda-pazar-keyfi.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1989/inonu-stadinda-pazar-keyfi/cover.jpg',
        alt: 'Cumhuriyet, 24 Kasım 1989, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'turkler-icin-ne-getirecek-ne-goturecek',
    title: 'Türkler için ne getirecek, ne götürecek?',
    date: '26 Şubat 1990',
    subtitle: 'Cumhuriyet, 26 Şubat 1990, s. 16',
    excerpt:
      '"Birleşmenin Işığında Almanya" üst başlığıyla Bonn\'dan izlenimler. Doğu Avrupa\'dan gelen kitlesel göçün Batı Almanya\'daki iş ve konut piyasasına etkisi ile Alman birliğinin ülkedeki Türkler açısından olası sonuçları; Essen, Duisburg, Bonn ve Batı Berlin\'de yapılan görüşmeler.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Almanya', 'Bonn', 'Alman birleşmesi', 'göç', 'gurbetçiler', '1990'],
    pdfSrc: '/archive/pdf/cumhuriyet/1990/turkler-icin-ne-getirecek-ne-goturecek.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1990/turkler-icin-ne-getirecek-ne-goturecek/cover.jpg',
        alt: 'Cumhuriyet, 26 Şubat 1990, s. 16',
        pageLabel: 's. 16',
      },
    ],
  },
  {
    slug: 'ayet-mi-slogan-mi',
    title: 'Ayet mi, Slogan mı?',
    date: '20 Aralık 1990',
    subtitle: 'Cumhuriyet Kitap, sayı 44, 20 Aralık 1990, s. 17',
    excerpt:
      'Ruşen Çakır\'ın Ayet ve Slogan adlı kitabı üzerine inceleme. İslamcı hareketlerin 1980\'lerde gösterdiği gelişmenin nedenleri, "sıradan Müslümanlar" ile İslamcılar arasındaki ayrım ve şeriat düzenini hedefleyen gelenekçi ile radikal çizgilerin ayrışması.',
    sourceNote:
      'Cumhuriyet Kitap ekinden alınan tam sayfa taraması. Sayfa künyesinde yalnızca sayı numarası var; tarih arşiv kaydından alındı. Cumhuriyet Gazetesi Arşivi.',
    tags: ['Ruşen Çakır', 'İslamcılık', 'laiklik', 'şeriat', 'Cumhuriyet Kitap', '1990'],
    pdfSrc: '/archive/pdf/cumhuriyet/1990/ayet-mi-slogan-mi.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1990/ayet-mi-slogan-mi/cover.jpg',
        alt: 'Cumhuriyet Kitap, sayı 44, 20 Aralık 1990, s. 17',
        pageLabel: 's. 17',
      },
    ],
  },
  {
    slug: 'pkk-yuzyilin-ilk-yillarini-yasiyor',
    title: 'PKK yüzyılın ilk yıllarını yaşıyor',
    date: '13 Haziran 1991',
    subtitle: 'Cumhuriyet, 13 Haziran 1991, s. 3',
    excerpt:
      '"Iraklı Kürt lider Celal Talabani Cumhuriyet\'in sorularını yanıtladı" üst başlığıyla söyleşi. Talabani, PKK\'yı terörist bir örgüt olarak nitelemediğini, örgütün olgunlaşmaya ihtiyacı olduğunu ve Türkiye\'nin demokratikleşmesiyle Kürt sorununun çözülebileceğini söyler.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Celal Talabani', 'PKK', 'Kürt sorunu', 'Irak', 'söyleşi', '1991'],
    pdfSrc: '/archive/pdf/cumhuriyet/1991/pkk-yuzyilin-ilk-yillarini-yasiyor.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1991/pkk-yuzyilin-ilk-yillarini-yasiyor/cover.jpg',
        alt: 'Cumhuriyet, 13 Haziran 1991, s. 3',
        pageLabel: 's. 3',
      },
    ],
  },
  {
    slug: 'parlamentoda-deprem',
    title: 'Parlamentoda Deprem',
    date: '9 Kasım 1991',
    subtitle: 'Cumhuriyet, 9 Kasım 1991, s. 4',
    excerpt:
      'TBMM\'deki yemin töreninde yaşanan Leyla Zana olayı üzerine. Yazıya göre parlamentoda yaşanan, "Ne Mutlu Türküm Diyene" sloganıyla ifade edilen politikanın geçirdiği depremdir; Türkiye Cumhuriyeti\'nin çoğul etnik yapısını bu slogan ile tek potada eritme politikası iflas etmiştir.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Leyla Zana', 'TBMM', 'Kürt sorunu', 'etnik kimlik', 'demokrasi', '1991'],
    pdfSrc: '/archive/pdf/cumhuriyet/1991/parlamentoda-deprem.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1991/parlamentoda-deprem/cover.jpg',
        alt: 'Cumhuriyet, 9 Kasım 1991, s. 4',
        pageLabel: 's. 4',
      },
    ],
  },
  {
    slug: 'dis-dusmanlar-ic-dusmanlar',
    title: 'Dış Düşmanlar, İç Düşmanlar',
    date: '27 Kasım 1991',
    subtitle: 'Cumhuriyet, 27 Kasım 1991, s. 4',
    excerpt:
      'Milli paranoya ve kötülüklerin ardında hep dış güçler arama alışkanlığı üzerine. Yazıya göre Türkiye uluslararası politikanın hatırı sayılır, sözüne güvenilir bir aktörüdür; kaderi dış güçlerin elinde değildir, geleceğini seçmek büyük ölçüde kendi elindedir.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['komplo teorisi', 'emperyalizm', 'dış politika', 'milliyetçilik', '1991'],
    pdfSrc: '/archive/pdf/cumhuriyet/1991/dis-dusmanlar-ic-dusmanlar.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1991/dis-dusmanlar-ic-dusmanlar/cover.jpg',
        alt: 'Cumhuriyet, 27 Kasım 1991, s. 4',
        pageLabel: 's. 4',
      },
    ],
  },
  {
    slug: 'sosyalizm-oldu-mu',
    title: 'Sosyalizm Öldü mü?',
    date: '4 Aralık 1991',
    subtitle: 'Cumhuriyet, 4 Aralık 1991, s. 4',
    excerpt:
      'Sovyetler Birliği\'nin çözülüşünün ardından sosyalizmin akıbeti üzerine. Yazıya göre sosyalizm fikri, ne sosyalizmin totaliter-devletçi yorumuyla başladı ne de onunla sona erecek; sosyalizm Marx\'tan önce de vardı, Marksizmden sonra da var olacak.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['sosyalizm', 'Marksizm', 'Sovyetler Birliği', 'sosyal demokrasi', '1991'],
    pdfSrc: '/archive/pdf/cumhuriyet/1991/sosyalizm-oldu-mu.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1991/sosyalizm-oldu-mu/cover.jpg',
        alt: 'Cumhuriyet, 4 Aralık 1991, s. 4',
        pageLabel: 's. 4',
      },
    ],
  },
  {
    slug: 'ayrilikci-teror-ve-ispanya',
    title: 'Ayrılıkçı Terör ve İspanya',
    date: '11 Aralık 1991',
    subtitle: 'Cumhuriyet, 11 Aralık 1991, s. 4',
    excerpt:
      'Prof. Arango\'nun "Franko\'dan Demokrasiye Geçiş" konuşmasından hareketle İspanya\'nın bölgesel özerklik modeli. Katalonya, Bask ve Galicia\'ya tanınan yarı federal özerkliğin ayrılıkçı akımları ve terör örgütlerini nasıl tecrit ettiği.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['İspanya', 'Bask', 'Katalonya', 'özerklik', 'terör', 'Kürt sorunu', '1991'],
    pdfSrc: '/archive/pdf/cumhuriyet/1991/ayrilikci-teror-ve-ispanya.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1991/ayrilikci-teror-ve-ispanya/cover.jpg',
        alt: 'Cumhuriyet, 11 Aralık 1991, s. 4',
        pageLabel: 's. 4',
      },
    ],
  },
  {
    slug: 'turki-halklar-ve-biz',
    title: 'Türki Halklar ve Biz',
    date: '20 Aralık 1991',
    subtitle: 'Cumhuriyet, 20 Aralık 1991, s. 4',
    excerpt:
      'Özbekistan Cumhurbaşkanı İslam Kerimov onuruna verilen davetten izlenimler. Kerimov\'un iki halk arasındaki dil, kültür, soy ve din bağlarına yaptığı vurgu ile koskoca Türki halklar dünyasının varlığına Türkiye\'nin ancak yeni yeni uyanıyor oluşu.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Özbekistan', 'İslam Kerimov', 'Türki cumhuriyetler', 'dış politika', '1991'],
    pdfSrc: '/archive/pdf/cumhuriyet/1991/turki-halklar-ve-biz.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1991/turki-halklar-ve-biz/cover.jpg',
        alt: 'Cumhuriyet, 20 Aralık 1991, s. 4',
        pageLabel: 's. 4',
      },
    ],
  },
  {
    slug: 'kurt-aydinlara-dusen-gorev',
    title: 'Kürt Aydınlara Düşen Görev',
    date: '27 Aralık 1991',
    subtitle: 'Cumhuriyet, 27 Aralık 1991, s. 4',
    excerpt:
      '20 Ekim 1991 seçimlerinin ardından kurulan DYP-SHP koalisyonunun Kürt sorununda 12 Eylül\'ün yasakçı politikalarına son verme kararlılığı üzerine. Bu ortamda Kürt kökenli politikacılara, bürokratlara, işadamlarına ve aydınlara düşen özel sorumluluk.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Kürt sorunu', 'aydınlar', 'DYP-SHP koalisyonu', 'demokratikleşme', '1991'],
    pdfSrc: '/archive/pdf/cumhuriyet/1991/kurt-aydinlara-dusen-gorev.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1991/kurt-aydinlara-dusen-gorev/cover.jpg',
        alt: 'Cumhuriyet, 27 Aralık 1991, s. 4',
        pageLabel: 's. 4',
      },
    ],
  },
  {
    slug: 'batiyi-nasil-yargilamali',
    title: "Batı'yı Nasıl Yargılamalı?",
    date: '8 Ocak 1992',
    subtitle: 'Cumhuriyet, 8 Ocak 1992, s. 4',
    excerpt:
      'İçişleri Bakanı İsmet Sezgin\'in Suriye, Irak, İran ve İngiltere\'nin PKK\'ya yardım ettiğini söylemesi üzerine. Batı\'nın Kürt sorunundaki çifte standardı ile Türkiye\'nin kendi eksikleri arasında ayrım yapmayı ve öfkeyle değil demokratikleşmeyle karşılık vermeyi savunur.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Batı', 'Kürt sorunu', 'PKK', 'dış politika', 'demokratikleşme', '1992'],
    pdfSrc: '/archive/pdf/cumhuriyet/1992/batiyi-nasil-yargilamali.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1992/batiyi-nasil-yargilamali/cover.jpg',
        alt: 'Cumhuriyet, 8 Ocak 1992, s. 4',
        pageLabel: 's. 4',
      },
    ],
  },
  {
    slug: 'ah-su-emperyalizm',
    title: 'Ah Şu Emperyalizm!...',
    date: '15 Şubat 1992',
    subtitle: 'Cumhuriyet, 15 Şubat 1992, s. 14',
    excerpt:
      'MÇP lideri Alparslan Türkeş\'in teröristleri "emperyalizmin uşakları" olarak nitelemesi üzerine. Sağ ve solun emperyalizm söylemine sarılarak kendi eksiklerinden kaçtığını, Popper\'in "toplumsal komplo teorisi" kavramıyla tartışır.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['emperyalizm', 'Alparslan Türkeş', 'Karl Popper', 'komplo teorisi', 'kapitalizm', '1992'],
    pdfSrc: '/archive/pdf/cumhuriyet/1992/ah-su-emperyalizm.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1992/ah-su-emperyalizm/cover.jpg',
        alt: 'Cumhuriyet, 15 Şubat 1992, s. 14',
        pageLabel: 's. 14',
      },
    ],
  },
  {
    slug: 'marxi-kesfediyoruz',
    title: "Marx'ı Keşfediyoruz",
    date: '19 Şubat 1992',
    subtitle: 'Cumhuriyet, 19 Şubat 1992, s. 14',
    excerpt:
      'Sovyetler Birliği\'nin çöküşünden sonra Batı\'nın muhafazakâr yayın organlarının bile Marx\'ın büyüklüğünü teslim etmesi üzerine. Bilim adamı Marx ile siyaset adamı Marx\'ı birbirinden ayırmayı önerir; Popper\'in ve Jon Elster\'in eleştirileri ışığında hangi teorilerinin savunulabilir kaldığını tartışır.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taraması.',
    tags: ['Karl Marx', 'Marksizm', 'Karl Popper', 'Jon Elster', 'sosyalizm', '1992'],
    pdfSrc: '/archive/pdf/cumhuriyet/1992/marxi-kesfediyoruz.pdf',
    pdfPageCount: 1,
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1992/marxi-kesfediyoruz/cover.jpg',
        alt: 'Cumhuriyet, 19 Şubat 1992, s. 14',
        pageLabel: 's. 14',
      },
    ],
  },
]
