import type { ArchiveItemSeed } from '../../types'

/** Sabah, 1993-1994. Şahin Alpay's signed column, alongside the
 *  interviews he conducted for the paper — told apart by `pieceKind`,
 *  as in the Milliyet file.
 *
 *  The scans behind these entries are photographs from his own archive.
 *  Eight are loose clippings of a single piece. The other five are whole
 *  pages of "Entellektüel Bakış", the section he edited ("Yöneten: Şahin
 *  Alpay"), each given over entirely to his own piece — so those carry the
 *  masthead, and with it the printed date and page number. The 5 and 6
 *  January 1994 entries are one interview run over two days; the first
 *  page closes with "YARIN: Aleviler ve sol".
 */
export const sabahColumnSeeds: ArchiveItemSeed[] = [
  {
    slug: 'solculuk-neden-tutuculuk-oldu',
    title: 'Solculuk neden tutuculuk oldu',
    date: '28 Ekim 1993',
    subtitle: 'Sabah, 28 Ekim 1993',
    excerpt: 'Türkiye\'de solun neden reformların öncüsü olmak yerine tutucu bir güce dönüştüğünü sorar; bunun temel kaynağı olarak solda yaygın devletçiliği ve milliyetçiliği gösterir, farklı dil ve kültür gruplarının haklarının tanınmasını ve dışa kapalı ekonomik milliyetçiliğin terk edilmesini savunur.',
    sourceNote: 'Şahin Alpay\'ın kişisel arşivinden, Sabah kupürü.',
    tags: ['sol siyaset', 'devletçilik', 'milliyetçilik', 'Kürt sorunu', 'demokrasi', '1993'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/sabah/1993/solculuk-neden-tutuculuk-oldu/cover.webp',
        alt: 'Sabah, 28 Ekim 1993',
      },
    ],
  },
  {
    slug: 'ataturk-ve-zeitgeist',
    title: 'Atatürk ve ‘Zeitgeist’',
    date: '10 Kasım 1993',
    subtitle: 'Sabah, 10 Kasım 1993',
    excerpt: 'Atatürk\'ün ölümünün 55. yıldönümünde, onun yaptıklarının çağının "zeitgeist"ına uygun olduğunu, kalıcılığını da devleti zamanın ruhuna uydurmasına borçlu olduğunu anlatır; günümüz Atatürkçülüğünün 1930\'ların çözümlerini tekrarlamak değil, özgürlükçü demokrasi ve insan haklarını yerleştirecek reformları savunmak olduğunu ileri sürer.',
    sourceNote: 'Şahin Alpay\'ın kişisel arşivinden, Sabah kupürü.',
    tags: ['Mustafa Kemal Atatürk', 'İsmet İnönü', 'Turgut Özal', 'Atatürkçülük', 'reformculuk', '1993'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/sabah/1993/ataturk-ve-zeitgeist/cover.webp',
        alt: 'Sabah, 10 Kasım 1993',
      },
    ],
  },
  {
    slug: 'turkiyeye-ozgurlukcu-ve-reformcu-bir-sol-gerekiyor',
    title: 'Türkiye’ye özgürlükçü ve reformcu bir sol gerekiyor',
    date: '17 Kasım 1993',
    subtitle: 'Sabah, 17 Kasım 1993',
    excerpt: 'SHP ile CHP arasındaki birleşmenin sonuçsuz kalması üzerine, solun asıl sorununun birlik değil kendine geçerli bir rota çizmek olduğunu savunur; Türkiye\'nin özgürlükçü ve reformcu bir sola ihtiyacı olduğunu söyleyerek demokrasi, halkların barış içinde birlikteliği, gerçek laiklik, sosyal adalet, kadın hakları ve çevre başlıklarından oluşan bir program önerir.',
    sourceNote: 'Şahin Alpay\'ın kişisel arşivinden, Sabah kupürü.',
    tags: ['SHP', 'CHP', 'Deniz Baykal', 'Felipe Gonzalez', 'sol siyaset', '1993'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/sabah/1993/turkiyeye-ozgurlukcu-ve-reformcu-bir-sol-gerekiyor/cover.webp',
        alt: 'Sabah, 17 Kasım 1993',
      },
    ],
  },
  {
    slug: 'komplo-teorisi-ve-tarihten-cektigimiz',
    title: 'Komplo teorisi ve tarihten çektiğimiz',
    date: '6 Aralık 1993',
    subtitle: 'Sabah, 6 Aralık 1993',
    excerpt: 'Devlet İstatistik Enstitüsü\'nde katıldığı bir panelden yola çıkarak Türkiye\'de bilimin ne ölçüde bilincinde olunduğunu tartışır; aydınlar arasında bilimsel düşünme alışkanlığı yerine komplo teorilerinin yaygınlığını Karl Popper\'e dayanarak eleştirir ve tarihin tekerrür etmediğini, bugünü ve yarını açıklayamayacağını vurgular.',
    sourceNote: 'Şahin Alpay\'ın kişisel arşivinden, Sabah kupürü.',
    tags: ['Karl Popper', 'Devlet İstatistik Enstitüsü', 'komplo teorileri', 'bilim politikası', '1993'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/sabah/1993/komplo-teorisi-ve-tarihten-cektigimiz/cover.webp',
        alt: 'Sabah, 6 Aralık 1993',
      },
    ],
  },
  {
    slug: 'din-ile-bilim-rakip-midir',
    title: 'Din ile bilim rakip midir?',
    date: '7 Aralık 1993',
    subtitle: 'Sabah, 7 Aralık 1993',
    excerpt: 'Bilim tartışmasını sürdürerek aydınlar arasında yaygın pozitivist bilim anlayışını eleştirir, bilimsel teorilerin ancak geçici olarak doğru sayıldığını hatırlatır; bilimle dinin alanlarının ayrı olduğunu, "köktenbilimcilik" ile köktendinciliğin aynı bağnazlıkta buluştuğunu ve bilimin gelişmesi için düşünce ve ifade özgürlüğünün şart olduğunu savunur.',
    sourceNote: 'Şahin Alpay\'ın kişisel arşivinden, Sabah kupürü.',
    tags: ['Thomas Kuhn', 'din ve bilim', 'pozitivizm', 'sosyal bilimler', 'düşünce özgürlüğü', '1993'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/sabah/1993/din-ile-bilim-rakip-midir/cover.webp',
        alt: 'Sabah, 7 Aralık 1993',
      },
    ],
  },
  {
    slug: 'demokrasi-icin-iki-turlu-secim',
    title: 'Demokrasi için iki turlu seçim!',
    date: '21 Aralık 1993',
    subtitle: 'Sabah, 21 Aralık 1993',
    excerpt: '1990\'larda Türk parti sisteminde yaşanan dağılmanın nedenlerini ele alır; seçmen-parti bağlarının zayıflamasından yararlanan ideoloji partilerinin, özellikle Refah Partisi\'nin, halk içindeki desteğinin çok üstünde bir etkinlik kazanma tehlikesine dikkat çeker ve çözüm olarak belediye başkanlığı ile milletvekili seçimlerinde iki turlu çoğunluk sistemine geçilmesini önerir.',
    sourceNote: 'Şahin Alpay\'ın kişisel arşivinden, Sabah kupürü.',
    tags: ['Refah Partisi', 'seçim sistemi', 'parti sistemi', 'demokrasi', '1993'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/sabah/1993/demokrasi-icin-iki-turlu-secim/cover.webp',
        alt: 'Sabah, 21 Aralık 1993',
      },
    ],
  },
  {
    slug: '1984-on-yil-geride-kaldi',
    title: '1984 on yıl geride kaldı!',
    date: '1 Ocak 1994',
    subtitle: 'Sabah, 1 Ocak 1994',
    excerpt: 'Yeni yıl vesilesiyle iyimserlikle karamsarlığın iç içe geçtiği bir dönemi değerlendirir: Soğuk Savaş\'ın bitmesini, Orwell\'in 1984 korkularının gerçekleşmemesini ve özgürlük fikrinin yayılmasını umut verici bulurken, nüfus baskısı, çevre kirliliği ile milliyetçi ve dinci bağnazlıkları kaygı verici sayar; ayrıca "Entellektüel Bakış" sayfasının okurlarına teşekkür eder.',
    sourceNote: 'Şahin Alpay\'ın kişisel arşivinden, Sabah kupürü.',
    tags: ['George Orwell', 'Soğuk Savaş', 'Entellektüel Bakış', 'demokrasi', '1994'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/sabah/1994/1984-on-yil-geride-kaldi/cover.webp',
        alt: 'Sabah, 1 Ocak 1994',
      },
    ],
  },
  {
    slug: 'seriat-gelsin-diyen-tek-koyluye-rastlamadim',
    title: 'Şeriat gelsin diyen tek köylüye rastlamadım',
    date: '5 Ocak 1994',
    subtitle: 'Sabah, Entellektüel Bakış, 5 Ocak 1994, s. 17',
    excerpt: 'Antropolog David Shankland ile İç Anadolu\'nun Sünni ve Alevi köylerinde yaşayarak yürüttüğü alan araştırmasını konuşur. Shankland, Cumhuriyet\'in Alevileri dedelerin otoritesi ile devlet mahkemeleri arasında seçim yapmaya zorladığını, Sünni köylülerin ise devlet otoritesiyle hiçbir zaman sorun yaşamadığını anlatır ve araştırması boyunca şeriat gelsin diyen tek bir köylüye rastlamadığını söyler.',
    sourceNote: 'Şahin Alpay\'ın kişisel arşivinden, Sabah kupürü.',
    tags: ['David Shankland', 'Aleviler', 'Sünniler', 'şeriat', 'antropoloji', '1994'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/sabah/1994/seriat-gelsin-diyen-tek-koyluye-rastlamadim/cover.webp',
        alt: 'Sabah, 5 Ocak 1994, s. 17',
        pageLabel: 's. 17',
      },
    ],
  },
  {
    slug: 'alevi-kulturu-cumhuriyetci-ideolojiyle-uyum-halinde',
    title: 'Alevi kültürü Cumhuriyetçi ideolojiyle uyum halinde…',
    date: '6 Ocak 1994',
    subtitle: 'Sabah, 6 Ocak 1994',
    excerpt: 'Söyleşinin ikinci bölümünde David Shankland, Alevi köylerinin bir odak noktasından yoksun oluşunun kentlere göçü neden Sünnilere göre yaygınlaştırdığını açıklar. Alevilerin sol partilere verdiği güçlü desteği kültürlerinin Cumhuriyetçi ideolojiyle uyumuna bağlar, kapalı topluluk yapısının ise ekonomik başarı için gereken ilişki ağlarından yoksun bıraktığını söyler.',
    sourceNote: 'Şahin Alpay\'ın kişisel arşivinden, Sabah kupürü.',
    tags: ['David Shankland', 'Aleviler', 'CHP', 'SHP', 'kentleşme', '1994'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/sabah/1994/alevi-kulturu-cumhuriyetci-ideolojiyle-uyum-halinde/cover.webp',
        alt: 'Sabah, 6 Ocak 1994',
      },
    ],
  },
  {
    slug: 'bilimsiz-arastirmasiz-politika-coktan-tikandi',
    title: 'Bilimsiz, araştırmasız politika çoktan tıkandı!',
    date: '28 Ocak 1994',
    subtitle: 'Sabah, 28 Ocak 1994',
    excerpt: 'Türkiye\'nin siyaset sınıfını iyi araştırılmış, tutarlı politikalar üretememekle eleştirir ve bunun demokrasiden değil seçim sisteminden ve bilgiye dayanmayan siyaset alışkanlığından kaynaklandığını savunur. Batı\'daki "think tank" geleneğini tanıtarak SİSAV, Türk Demokrasi Vakfı ve TÜSES gibi kuruluşların vergi muafiyeti ve mali kaynak yokluğunda emekleme çağında kaldığını anlatır.',
    sourceNote: 'Şahin Alpay\'ın kişisel arşivinden, Sabah kupürü.',
    tags: ['think tank', 'TÜSES', 'SİSAV', 'Türk Demokrasi Vakfı', 'siyaset', '1994'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/sabah/1994/bilimsiz-arastirmasiz-politika-coktan-tikandi/cover.webp',
        alt: 'Sabah, 28 Ocak 1994',
      },
    ],
  },
  {
    slug: 'siyasal-katilim-arttikca-teror-azaldi',
    title: 'Siyasal katılım arttıkça, terör azaldı',
    date: '18 Şubat 1994',
    subtitle: 'Sabah, Entellektüel Bakış, 18 Şubat 1994, s. 21',
    excerpt: 'İspanya Anayasa Mahkemesi Başkan Yardımcısı Prof. Luis Lopez Guerra ile milliyetçi ve ayrılıkçı akımların çoğulcu demokratik düzene nasıl entegre edildiğini konuşur. Guerra, Bask ve Katalan milliyetçi partilerinin bağımsızlık hedefini bırakıp meşru siyasete katıldığını, Herri Batasuna\'nın parlamentoda temsil edilmesinin önemini ve siyasal katılım yükseldikçe şiddetin azaldığını anlatır.',
    sourceNote: 'Şahin Alpay\'ın kişisel arşivinden, Sabah kupürü.',
    tags: ['Luis Lopez Guerra', 'İspanya', 'ETA', 'Herri Batasuna', 'terörle mücadele', '1994'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/sabah/1994/siyasal-katilim-arttikca-teror-azaldi/cover.webp',
        alt: 'Sabah, 18 Şubat 1994, s. 21',
        pageLabel: 's. 21',
      },
    ],
  },
  {
    slug: 'turkiye-neden-islamin-yildizi',
    title: 'Türkiye neden ‘İslam’ın yıldızı’?',
    date: '4 Mart 1994',
    subtitle: 'Sabah, Entellektüel Bakış, 4 Mart 1994, s. 29',
    excerpt: 'The Economist\'in "İslam\'ın yıldızı" nitelemesinden yola çıkarak Türkiye\'nin nüfusu Müslüman ülkeler arasında hem laik hem demokratik olma özelliğini neye borçlu olduğunu tartışır. Dinsel akımların, özellikle Refah Partisi çizgisinin, çok partili düzene katılarak demokrasiye hizmet ettiğini; bu akımları sistemin dışına itmenin Türkiye\'yi Cezayir ve Mısır\'a benzetebileceğini savunur.',
    sourceNote: 'Şahin Alpay\'ın kişisel arşivinden, Sabah kupürü.',
    tags: ['Refah Partisi', 'Necmettin Erbakan', 'laiklik', 'demokrasi', 'Cezayir', '1994'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/sabah/1994/turkiye-neden-islamin-yildizi/cover.webp',
        alt: 'Sabah, 4 Mart 1994, s. 29',
        pageLabel: 's. 29',
      },
    ],
  },
  {
    slug: 'halk-degisme-ve-uzlasmaya-siyasilerden-daha-yatkin',
    title: 'Halk değişme ve uzlaşmaya siyasilerden daha yatkın',
    date: '12 Mart 1994',
    subtitle: 'Sabah, Entellektüel Bakış, 12 Mart 1994, s. 24',
    excerpt: 'Le Monde\'un ve The Independent\'ın Türkiye temsilcileri Nicole ve Hugh Pope ile altı yıllık Türkiye gözlemlerini konuşur. Pope çifti Kürt sorununda bölge halkının ne istediğine dair büyük bir yanlış anlama bulunduğunu, Refah Partisi\'ne ilişkin korkuların oy oranlarına bakınca abartılı göründüğünü, Türk basınının köşe yazarlarına yatırım yaparken muhabirliği ihmal ettiğini ve toplumun değişmeye siyasilerden daha yatkın olduğunu anlatır.',
    sourceNote: 'Şahin Alpay\'ın kişisel arşivinden, Sabah kupürü.',
    tags: ['Nicole Pope', 'Hugh Pope', 'Le Monde', 'The Independent', 'basın', '1994'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/sabah/1994/halk-degisme-ve-uzlasmaya-siyasilerden-daha-yatkin/cover.webp',
        alt: 'Sabah, 12 Mart 1994, s. 24',
        pageLabel: 's. 24',
      },
    ],
  },
]
