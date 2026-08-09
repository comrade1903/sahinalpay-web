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
]
