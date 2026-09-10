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
 *  Every source scan is a full broadsheet page, so it carries other writers'
 *  work alongside his — on 4 July 1987 his Şerif Mardin interview runs
 *  beside Mehmed Kemal's own column. Titles here were read off the page
 *  rather than extracted from the OCR layer for exactly that reason.
 *
 *  The clipping each entry shows is cropped to his own piece — full pages
 *  read as noise next to a signed column, and the crop is what the reader
 *  actually came for. There is no full-page PDF behind it; the crop is the
 *  only rendering of the scan this archive carries for Cumhuriyet.
 */
export const cumhuriyetColumnSeeds: ArchiveItemSeed[] = [
  {
    slug: 'baslarken',
    title: 'Başlarken',
    date: '28 Ocak 1982',
    subtitle: 'Cumhuriyet, 28 Ocak 1982, s. 5',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['düşünce inceleme araştırma', 'sosyal bilimler', 'yayın hayatı', '1982'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1982/baslarken/cover.webp',
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
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Sabri Ülgener', 'iktisat ahlakı', 'Max Weber', 'zihniyet', 'söyleşi', '1982'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1982/sabri-ulgenerle-sohbet/cover.webp',
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
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Şerif Mardin', 'ideoloji', 'siyaset sosyolojisi', 'söyleşi', '1982'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1982/ideoloji-uzerine-serif-mardinle-sohbet/cover.webp',
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
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Zafer Toprak', 'milli iktisat', 'II. Meşrutiyet', 'İttihat ve Terakki', 'iktisat tarihi', '1982'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1982/turkiyede-milli-iktisat/cover.webp',
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
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Mete Tunçay', 'tek parti dönemi', 'sol akımlar', 'siyaset bilimi', 'söyleşi', '1982'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1982/mete-tuncayla-sohbet/cover.webp',
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
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Thomas Kuhn', 'bilim felsefesi', 'paradigma', 'Karl Popper', '1982'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1982/bilimsel-devrimlerin-yapisi/cover.webp',
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
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Karl Popper', 'Bryan Magee', 'bilim felsefesi', 'açık toplum', 'totalitarizm', '1982'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1982/karl-popperin-bilim-felsefesi-ve-siyaset-kurami/cover.webp',
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
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Sabri Ülgener', 'zihniyet', 'aydınlar', 'ideoloji', 'iktisat', '1983'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1983/saglikli-bir-bilim-anlayisi/cover.webp',
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
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Karl Popper', 'bilim felsefesi', 'demokrasi', 'Felsefe Yazıları', '1984'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1984/bilim-demokrasi-iliskisi/cover.webp',
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
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['İsmet Özel', 'düşünce özgürlüğü', 'bilim eleştirisi', 'Yeni Devir', '1984'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1984/zor-zamanda-konusmak/cover.webp',
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
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Haluk Özdalga', 'sosyal demokrasi', 'Marksizm', 'İsveç', 'Sosyalist Enternasyonal', '1984'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1984/sosyal-demokrasi-ve-marksizm-iliskisi/cover.webp',
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
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Cengiz Çandar', 'FKÖ', 'Filistin', 'Ortadoğu', 'gazetecilik', '1984'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1984/fkonun-seruveni/cover.webp',
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
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Machiavelli', 'Hükümdar', 'siyaset felsefesi', 'devlet', '1984'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1984/siyasetin-kendine-ozgu-yasalari-var-midir/cover.webp',
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
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['İlkay Sunar', 'pozitivizm', 'sosyal bilimler', 'ideoloji', '1984'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1984/toplumu-bicimlendiren-doga-midir/cover.webp',
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
    excerpt: 'Karl Marx ve Emile Durkheim’ın yanı sıra sosyolojinin “üç büyükleri”nden biri sayılan Max Weber’in bugün de tartışılan ünlü eseri Türkçe yayımlandı.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Max Weber', 'Protestan Ahlakı', 'sosyoloji', 'Sabri Ülgener', 'kapitalizm', '1985'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1985/weber-ilk-kez-dilimize-cevrildi/cover.webp',
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
    excerpt: 'Ali Yaşar Sarıbay’ın Türkiye’de modernleşme, din ve partileşme bağlamında Milli Selamet Partisi’ni konu alan incelemesi, çağdaş Türkiye’de politik hayatın araştırılmasına yararlı bir katkı oluşturuyor.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Ali Yaşar Sarıbay', 'Milli Selamet Partisi', 'modernleşme', 'din ve siyaset', '1985'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1985/mspnin-gelisimi-ve-ideolojisi/cover.webp',
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
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['nükleer enerji', 'enerji politikası', 'çevre', 'teknoloji', '1985'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1985/enerji-teknik-bir-sorun-mudur/cover.webp',
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
    excerpt: 'Zevk ve sefaya düşkünlüğü ile ünlü “günahkâr şehir” New Orleans. Tennessee Williams’ın, William Faulkner’ın ve Luis Armstrong’un şehri, Amerikan edebiyatı ve müziğinin candamarlarından biri olan New Orleans. Ama ne gerçek Fransız yemeklerinin o eski tadı kalmış, ne de cazın.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['ABD', 'New Orleans', 'ırk sorunu', 'göçmenlik', 'izlenim', '1985'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1985/ceyrek-asir-sonra-abd/cover.webp',
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
    excerpt: 'Bu kitapta yakın tarihimizin en önemli fikir hareketlerinden birinin mükemmel denebilecek bir anatomisinin çizildiğini söyleyebiliriz. YÖN fikriyatının eleştirilmesi açısından bakıldığında ise, Özdemir’in çalışmasının doyurucu olduğunu söylemek güç.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Hikmet Özdemir', 'YÖN hareketi', 'Doğan Avcıoğlu', 'kalkınma', 'Türk solu', '1987'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1987/kalkinmada-bir-strateji-arayisi-mi/cover.webp',
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
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Şerif Mardin', 'İslami canlanış', 'modernleşme', 'din ve toplum', 'söyleşi', '1987'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1987/islami-hayat-tarzi-amaclaniyor/cover.webp',
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
    excerpt: 'Bir Praglıya göre, Çekoslovak halkı, kentlisiyle köylüsüyle 8 saat çalışmaya alıştı. Oysa bir aile işletmesi kurup para kazanmak için çok çalışmak gerek. Bu zahmete kim katlanacak? Öte yandan daha iyi yaşamak için bazılarının iki ayrı işte, 8’erden 16 saat çalıştıkları biliniyor.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Çekoslovakya', 'Prag', 'glasnost', 'ekonomik reform', 'sosyalizm', '1987'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1987/pragda-bahar/cover.webp',
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
    excerpt: 'Japonları daha az çalışıp daha çok eğlenmeye ikna etmek için “çalışma hastalıkları”nın tedavi edilmesi gerekiyor.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Japonya', 'Tokyo', 'çalışma hayatı', 'eğitim', 'izlenim', '1987'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1987/japonlarin-calisma-hastaligi/cover.webp',
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
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Sencer Divitçioğlu', 'Kök Türkler', 'Orhun yazıtları', 'tarih', 'söyleşi', '1987'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1987/turk-tarihinin-sifir-noktasi/cover.webp',
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
    excerpt: 'Aybar’ın sekiz yıl başkanlığını yaptığı ve yakın siyasal tarihimizde, aldığı oyların oranı ile ölçülemeyecek ağırlıkta bir rol oynamış olan TİP’in tarihini kendine özgü bir yaklaşımla kaleme alması, bu tarihin anlaşılmasına çok değerli bir katkı.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Mehmet Ali Aybar', 'Türkiye İşçi Partisi', '1960\'lar', 'sosyalizm', 'anı', '1988'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1988/mehmet-ali-aybarin-anilari/cover.webp',
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
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['İsmet Özel', 'şiir', 'İslamcılık', 'aydın', 'düşünce', '1988'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1988/sair-ismet-ozelin-masali/cover.webp',
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
    excerpt: 'Merdan Yanardağ’ın çalışması, Kadro dergisine duyulan akademik ilginin yeni bir ürünü. Kadro akımı ve Kadrocular hakkında derli toplu bilgi vermesi açısından dikkate ve okunmaya değer bir kitap.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Merdan Yanardağ', 'Kadro dergisi', 'devletçilik', 'tek parti dönemi', '1988'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1988/kadro-ve-kadrocular/cover.webp',
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
    excerpt: 'Norberto Bobbio, Giovanni Sartori’nin yanında İtalya’nın siyaset bilimine yaptığı en büyük katkı. Bobbio’nun demokrasi ve demokrasiyle sosyalizm ilişkisini konu alan eserlerinin dilimize çevrilmesi çok önemli bir kazanç olacak.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Norberto Bobbio', 'demokrasi', 'sosyalizm', 'liberalizm', '1988'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1988/demokrasinin-gelecegi/cover.webp',
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
    excerpt: 'Ayşe Buğra’nın iktisat biliminin öyküsünü temel alan bir bilim tarihi niteliğindeki çalışması, son derece bilgilendirici ve düşündürücü bir kitap. Buğra, konusunu iyi bilen bir yazarın sahip olduğu rahatlıkla, hayli karmaşık ve çetin konuları ustalıkla açıklıyor.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Ayşe Buğra', 'iktisat', 'bilim felsefesi', 'piyasa', 'insan hakları', '1989'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1989/bilim-iktisat-ve-piyasa/cover.webp',
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
    excerpt: 'Türkiye’de Marxizm açısından Mao’yu, Stalin’i ve Lenin’i eleştiren birçok yazar çıktı. Ama genelde Marxist olarak nitelenebilecek bir bakış açısından, Marx’ın ve Marxizm’in öğretilerinin eleştirilmesini de içeren bir çalışma ülkemizde ilk kez kaleme alınıyor.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Murat Belge', 'sosyalizm', 'çoğulculuk', 'korporatizm', 'Türk solu', '1989'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1989/sosyalizmin-gelecegi/cover.webp',
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
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Sosyalist Enternasyonal', 'Willy Brandt', 'Stockholm', 'sosyal demokrasi', '1989'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1989/demokrasi-olmadan-sosyalizm-olamaz/cover.webp',
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
    excerpt: 'Biletlerin numaralı olduğu konusunda uyarıldık. Yerimizi aradık bulduk. 17. sırada 124 ve 126 numaralı koltuklar. Keyfimiz kaçtı zira 124 ve 126 numaralı koltuklar bir direğin tam arkasına düşüyordu ve oraya oturulursa direkten başka bir şey görmeye imkân yoktu.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['futbol', 'İnönü Stadı', 'Beşiktaş', 'Timur Kuran', 'gündelik hayat', '1989'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1989/inonu-stadinda-pazar-keyfi/cover.webp',
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
    excerpt: 'Federal Almanya’da yeşiller, doğudan gelen göçün özellikle Türkler açısından olumsuz sonuçlar doğurabileceğine inanıyorlar. Sosyal demokratlar ise o denli karamsar değiller. Sosyal demokratlara göre göçün Türkler üzerindeki etkisi en çok konut sorununda görülebilir.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Almanya', 'Bonn', 'Alman birleşmesi', 'göç', 'gurbetçiler', '1990'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1990/turkler-icin-ne-getirecek-ne-goturecek/cover.webp',
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
    excerpt: 'Ruşen Çakır yapıtında, İslamcı hareketlerin 1980’lerde gösterdiği çarpıcı gelişmenin nedenlerini, İslamcılığın bağımsız politik çizgi geliştirme olasılığını, Türkiye’ye şeriat düzeni getirip getiremeyeceğini, Türkiye’de laiklik, insan hakları ve demokrasi sorunlarıyla ilgilenenlerin zihinlerindeki daha birçok temel soruya yanıt getirmeye çalışıyor.',
    sourceNote:
      'Cumhuriyet Kitap ekinden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür. Sayfa künyesinde yalnızca sayı numarası var; tarih arşiv kaydından alındı. Cumhuriyet Gazetesi Arşivi.',
    tags: ['Ruşen Çakır', 'İslamcılık', 'laiklik', 'şeriat', 'Cumhuriyet Kitap', '1990'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1990/ayet-mi-slogan-mi/cover.webp',
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
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Celal Talabani', 'PKK', 'Kürt sorunu', 'Irak', 'söyleşi', '1991'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1991/pkk-yuzyilin-ilk-yillarini-yasiyor/cover.webp',
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
    excerpt: 'Sanıyorum parlamentoda yaşanan, ‘Ne Mutlu Türküm Diyene’ sloganıyla ifade edilen politikanın geçirdiği deprem. Türkiye Cumhuriyeti bugüne değin bu slogan ile çoğul etnik yapısını bir potada eritme politikası izledi.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Leyla Zana', 'TBMM', 'Kürt sorunu', 'etnik kimlik', 'demokrasi', '1991'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1991/parlamentoda-deprem/cover.webp',
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
    excerpt: 'Türkiye, uluslararası politikanın hatırı sayılır güçte, sözüne güvenilir bir aktörüdür. Türkiye’nin kaderi dış güçlerin elinde değildir. Kendimize güvenebiliriz. Geleceğimizi seçmek büyük ölçüde kendi elimizde.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['komplo teorisi', 'emperyalizm', 'dış politika', 'milliyetçilik', '1991'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1991/dis-dusmanlar-ic-dusmanlar/cover.webp',
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
    excerpt: 'Sosyalizm fikri, ne sosyalizmin totaliter devletçi yorumuyla başladı ne de onunla sona erecek. Sosyalizm, Marx’tan önce de vardı; Marksizmden sonra da var olacak.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['sosyalizm', 'Marksizm', 'Sovyetler Birliği', 'sosyal demokrasi', '1991'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1991/sosyalizm-oldu-mu/cover.webp',
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
    excerpt: 'İspanya, Kürt sorununun çözümü konusunda Türkiye’ye örnek olabilir mi? Kuşkusuz Türkiye ile İspanya arasında önemli farklar var. Ama bu farklar İspanyol modelinden ders çıkarılmasına engel değil.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['İspanya', 'Bask', 'Katalonya', 'özerklik', 'terör', 'Kürt sorunu', '1991'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1991/ayrilikci-teror-ve-ispanya/cover.webp',
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
    excerpt: 'Uzak Orta Asya’daki “ana yurdumuzda” yaşayan insanlar, köken bakımından Türk olmayan yurttaşlarımızdan bize daha mı yakındırlar?',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Özbekistan', 'İslam Kerimov', 'Türki cumhuriyetler', 'dış politika', '1991'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1991/turki-halklar-ve-biz/cover.webp',
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
    excerpt: 'Bugün ana sorun, demokrasiyi genişleterek terör uygulayanları tecrit etmek. Bütün aklı başında insanların bu yolda DYP-SHP hükümetine destek olmaları gerekiyor.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Kürt sorunu', 'aydınlar', 'DYP-SHP koalisyonu', 'demokratikleşme', '1991'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1991/kurt-aydinlara-dusen-gorev/cover.webp',
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
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Batı', 'Kürt sorunu', 'PKK', 'dış politika', 'demokratikleşme', '1992'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1992/batiyi-nasil-yargilamali/cover.webp',
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
    excerpt: 'Emperyalizm kapitalizmin en yüksek aşaması değil. Kapitalizmden önce de vardı, kapitalizmden sonra sosyalizmle birlikte de görüldü.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['emperyalizm', 'Alparslan Türkeş', 'Karl Popper', 'komplo teorisi', 'kapitalizm', '1992'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1992/ah-su-emperyalizm/cover.webp',
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
    excerpt: 'Marx, 19. ve 20. yüzyılların en önemli sosyal bilimcisi. Ama politikacıların bir anlamda en talihsizi.',
    sourceNote: 'Cumhuriyet Gazetesi Arşivi\'nden alınan tam sayfa taramasından, dikkat dağıtmaması için kırpılmış kupür.',
    tags: ['Karl Marx', 'Marksizm', 'Karl Popper', 'Jon Elster', 'sosyalizm', '1992'],
    clippings: [
      {
        src: '/archive/clippings/cumhuriyet/1992/marxi-kesfediyoruz/cover.webp',
        alt: 'Cumhuriyet, 19 Şubat 1992, s. 14',
        pageLabel: 's. 14',
      },
    ],
  },
]
