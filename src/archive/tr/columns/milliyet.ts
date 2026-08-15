import type { ArchiveItemSeed } from '../../types'

/** Milliyet, 1994-2001. Şahin Alpay's signed column ran under the masthead
 *  "3. Göz" ("Üçüncü Göz"). Alongside the column, the outlet also carries
 *  interviews he conducted for the paper ("Gazete Söyleşisi") — both share
 *  this file since Milliyet is organized as one outlet on the site, and are
 *  told apart by `pieceKind` ('column' vs 'interview').
 *
 *  Every entry here is a single cropped clipping of his own piece, not a
 *  full broadsheet page — there is no full-page scan behind it.
 */
export const milliyetColumnSeeds: ArchiveItemSeed[] = [
  {
    slug: 'abd-ve-refah',
    title: 'ABD ve Refah',
    date: '29 Kasım 1994',
    subtitle: 'Milliyet, 3. Göz, 29 Kasım 1994, s. 20',
    excerpt:
      "Refah Partisi'nin tek başına ya da koalisyon ortağı olarak iktidara gelme olasılığı belirince, ABD'nin bir RP iktidarına nasıl bakacağı sorusunu ele alır; İslamcı akımların barışçı demokratik süreçte temsiline izin vermenin, onları şiddete iten tıkanmadan daha güvenli olduğunu savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Refah Partisi', 'ABD', 'İslamcılık', 'demokrasi', '3. Göz', '1994'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1994/abd-ve-refah/cover.png',
        alt: 'Milliyet, 29 Kasım 1994, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'medya-egemenligi-surmeyecek',
    title: 'Medya egemenliği sürmeyecek',
    date: '1 Aralık 1994',
    subtitle: 'Milliyet, 3. Göz, 1 Aralık 1994, s. 18',
    excerpt:
      'Tarım, sanayi ve bilgi toplumlarında halkın temel bilgi kaynağının sırasıyla din adamları, siyasi partiler ve medya olduğunu anlatır; internet ve elektronik iletişim ağlarının yakın gelecekte gazetecilerin bugünkü egemenliğini de sona erdireceğini öngörür.',
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['medya', 'internet', 'gazetecilik', 'iletişim', '3. Göz', '1994'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1994/medya-egemenligi-surmeyecek/cover.png',
        alt: 'Milliyet, 1 Aralık 1994, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'egitimde-somuru',
    title: "Eğitimde 'sömürü'",
    date: '3 Aralık 1994',
    subtitle: 'Milliyet, 3. Göz, 3 Aralık 1994, s. 19',
    excerpt:
      "Yapı Kredi Kültür Merkezi'nin gelenek sahibi okulları konu alan toplantı dizisi vesilesiyle, devletin eğitime ayırdığı kaynağın hızla eridiğini; kademeli olarak paralı yükseköğretime geçilmesinin, herkese aynı ücretsiz hizmeti sağlamaktan doğan gizli 'sömürü'den daha adil olacağını savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['eğitim', 'yükseköğretim', 'Milli Eğitim Bakanlığı', '3. Göz', '1994'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1994/egitimde-somuru/cover.png',
        alt: 'Milliyet, 3 Aralık 1994, s. 19',
        pageLabel: 's. 19',
      },
    ],
  },
  {
    slug: 'sansasyon-promosyon',
    title: "'Sansasyon + promosyon'",
    date: '6 Aralık 1994',
    subtitle: 'Milliyet, 3. Göz, 6 Aralık 1994, s. 20',
    excerpt:
      "İsveç'te tanık olduğu bir tartışmadan yola çıkarak, hükümetin gazetecilerin daha iyi eğitilmesini bir reform önceliği saydığını; siyaset bilimci Olof Pettersson'un ağzından, çoğulcu toplumların iktidarı denetleyecek bağımsız ve bilgili bir basına ihtiyaç duyduğunu; Türk basınının ise teknolojide ilerlerken 'insana yatırım'ı ihmal ettiğini anlatır.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['basın', 'gazetecilik', 'İsveç', '3. Göz', '1994'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1994/sansasyon-promosyon/cover.png',
        alt: 'Milliyet, 6 Aralık 1994, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'bir-numarali-sorunumuz',
    title: 'Bir numaralı sorunumuz',
    date: '8 Aralık 1994',
    subtitle: 'Milliyet, 3. Göz, 8 Aralık 1994, s. 18',
    excerpt:
      "PKK'nın vahşi bir terör örgütü olduğunu, ama Kürt kökenli yurttaşların kimlik ve kültürlerini koruma taleplerinin barışçı ve demokratik yollardan karşılanmamasının, temsil iddiasını PKK'ya terk ettiğini savunur; Kürt sorununu Türkiye'nin demokratikleşmesi, ekonomisi ve dış politikası önündeki 'bir numaralı sorun' olarak tanımlar.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Kürt sorunu', 'PKK', 'demokratikleşme', '3. Göz', '1994'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1994/bir-numarali-sorunumuz/cover.png',
        alt: 'Milliyet, 8 Aralık 1994, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'ic-islerimiz',
    title: 'İç işlerimiz...',
    date: '13 Aralık 1994',
    subtitle: 'Milliyet, 3. Göz, 13 Aralık 1994, s. 18',
    excerpt:
      "Batılı hükümetlerin eski DEP milletvekillerinin yargılandığı davaya ilgi göstermesine yönelik 'içişlerimize karışıyorlar' tepkilerine karşı, Türkiye'nin AGİK'in Paris Şartı ve Moskova belgesi gibi imzaladığı uluslararası anlaşmalarla egemenliğini zaten sınırladığını; Avrupa'yla bütünleşmenin bunu daha da ileri götüreceğini anlatır.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['DEP davası', 'AGİK', 'insan hakları', 'Avrupa Birliği', '3. Göz', '1994'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1994/ic-islerimiz/cover.png',
        alt: 'Milliyet, 13 Aralık 1994, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'entellektuel',
    title: 'Entellektüel',
    date: '27 Aralık 1994',
    subtitle: 'Milliyet, 3. Göz, 27 Aralık 1994, s. 20',
    excerpt:
      "Sabah gazetesinde yönettiği, sonra Milliyet'e taşınan 'Entellektüel Bakış' sayfasının adının yazılışı üzerine okurlardan gelen tartışmayı anlatır; 'entellektüel' yazımının, Türkçenin sözcükleri söylendiği gibi yazma kuralına ve Marx/Marks gibi özel adların özgün biçimiyle yazılması ilkesine uygun olduğunu savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Entellektüel Bakış', 'Sabah', 'dil tartışması', '3. Göz', '1994'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1994/entellektuel/cover.png',
        alt: 'Milliyet, 27 Aralık 1994, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'uygarligin-dili',
    title: 'Uygarlığın dili',
    date: '31 Aralık 1994',
    subtitle: 'Milliyet, 3. Göz, 31 Aralık 1994, s. 20',
    excerpt:
      "17 Eylül 1994'te ölen Karl Popper'i anar; Ankara Üniversitesi'nde öğrenciyken Popper'in Marx eleştirisine sosyalist inancıyla nasıl tepki gösterdiğini, Stockholm'de doktora yaparken Açık Toplum ve Düşmanları'nı yeniden okuyunca görüşünün nasıl değiştiğini anlatır; 1995'e şiddet yerine akılcı tartışmanın egemen olması dileğiyle girer.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Karl Popper', 'Açık Toplum ve Düşmanları', 'felsefe', '3. Göz', '1994'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1994/uygarligin-dili/cover.png',
        alt: 'Milliyet, 31 Aralık 1994, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'sag-ve-solun-anlami',
    title: "Sağ ve sol'un anlamı",
    date: '3 Ocak 1995',
    subtitle: 'Milliyet, 3. Göz, 3 Ocak 1995, s. 20',
    excerpt:
      "Refah Devleti'nin aşırı büyümesinin, Batı'da hem sağda liberallerle muhafazakarları, hem solda çoğulcu liberal solla geleneksel Refah Devleti solunu birbirinden ayırdığını; Türkiye'de de benzer bir ayrışmanın yaşandığını anlatır, sağ ve sol'u Fransız Devrimi'nden beri geçerli tutuculuk/reformculuk tanımına döndürmeyi önerir.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['sağ-sol', 'siyaset', 'Refah Devleti', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/sag-ve-solun-anlami/cover.png',
        alt: 'Milliyet, 3 Ocak 1995, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'entel',
    title: "'Entel'",
    date: '5 Ocak 1995',
    subtitle: 'Milliyet, 3. Göz, 5 Ocak 1995, s. 20',
    excerpt:
      "'Entellektüel Bakış' sayfasının adının, toplumda 'entel' kısaltmasıyla anlamı aşınmış 'entellektüel' kavramına bir meydan okuma olduğunu anlatır; Alvin Gouldner'in entellektüel/intelligentsia ayrımından yola çıkarak, entellektüeli kendi düşüncelerini de sorgulayabilen, eleştirel ve özgürleştirici kişi olarak tanımlar.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Entellektüel Bakış', 'Alvin Gouldner', 'entellektüel', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/entel/cover.png',
        alt: 'Milliyet, 5 Ocak 1995, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'pkk-meselesi',
    title: 'PKK meselesi',
    date: '26 Ocak 1995',
    subtitle: 'Milliyet, 3. Göz, 26 Ocak 1995, s. 18',
    excerpt:
      "PKK'nın Marksist-Leninist söylemine rağmen esas gücünü Kürt milliyetçiliğinden aldığını savunur; sorunun çözümünün, Kürt kimlik ve kültür taleplerinin özgürlükçü, çoğulcu demokratik düzen içinde karşılanmasından ve Kürt milliyetçi temsil iddiasının PKK'nın elinden alınmasından geçtiğini anlatır.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['PKK', 'Kürt milliyetçiliği', 'Abdullah Öcalan', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/pkk-meselesi/cover.png',
        alt: 'Milliyet, 26 Ocak 1995, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'sosyal-demokrasi-ve-kemalizm',
    title: 'Sosyal demokrasi ve Kemalizm',
    date: '11 Şubat 1995',
    subtitle: 'Milliyet, 3. Göz, 11 Şubat 1995, s. 18',
    excerpt:
      "Tek parti dönemi CHP'sinin 'Altıok felsefesi'yle çağdaş sosyal demokrasinin aynı şey sayılmasına itiraz eder; sosyal demokrasinin milliyetçi değil yurtsever, devletçi değil piyasa temelli, devrimci değil reformcu olduğunu; Atatürk'e duyulan saygının onun döneminin hatalarından ders çıkarmaya engel olmaması gerektiğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['sosyal demokrasi', 'Kemalizm', 'CHP', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/sosyal-demokrasi-ve-kemalizm/cover.png',
        alt: 'Milliyet, 11 Şubat 1995, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'dusunce-ozgurlugu',
    title: 'Düşünce özgürlüğü',
    date: '28 Şubat 1995',
    subtitle: 'Milliyet, 3. Göz, 28 Şubat 1995, s. 18',
    excerpt:
      "Düşünce özgürlüğünün yasal kısıtlamalarından daha vahim olanın, Türkiye'nin seçkinleri arasında bile bu özgürlüğün anlamının kavranamaması olduğunu savunur; demokrasinin değerinin, toplumlara hatalardan dönme ve kendini düzeltme imkânı vermesinden geldiğini anlatır.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['düşünce özgürlüğü', 'demokratikleşme', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/dusunce-ozgurlugu/cover.png',
        alt: 'Milliyet, 28 Şubat 1995, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'kulturel-relativizm',
    title: 'Kültürel relativizm',
    date: '9 Mart 1995',
    subtitle: 'Milliyet, 3. Göz, 9 Mart 1995, s. 18',
    excerpt:
      "TRT'de izlediği bir açıkoturumdan yola çıkarak, kültürel relativizmin insan haklarını 'Batılı bir dayatma' sayan söylemine karşı çıkar; insan hakları ve demokrasi fikrinin kaynağı Batı olsa da artık bütün insanlığın paylaştığı ortak bir değer olduğunu savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['kültürel relativizm', 'insan hakları', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/kulturel-relativizm/cover.png',
        alt: 'Milliyet, 9 Mart 1995, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'turkiyenin-realiteleri',
    title: "Türkiye'nin 'realite'leri",
    date: '16 Mart 1995',
    subtitle: "Milliyet, 3. Göz, 16 Mart 1995, s. 20",
    excerpt:
      "Berlin'de tanıştığı Alevi göçmen gençlerin anlattıklarından yola çıkarak, Anadolu Aleviliğinin Cumhuriyet'in laikleşme ve demokratikleşme hareketlerinin arkasındaki temel toplumsal güç olduğunu; Gazi olaylarının, Alevileri devletle karşı karşıya getirmeyi amaçlayan bir kumpas olduğunu savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Alevilik', 'Gazi olayları', 'kimlik siyaseti', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/turkiyenin-realiteleri/cover.png',
        alt: 'Milliyet, 16 Mart 1995, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'guvenligimiz',
    title: 'Güvenliğimiz',
    date: '25 Mart 1995',
    subtitle: 'Milliyet, 3. Göz, 25 Mart 1995, s. 20',
    excerpt:
      "Türk Silahlı Kuvvetleri'nin Kuzey Irak'a düzenlediği büyük çaplı harekatı desteklerken, PKK'nın köklerinin sınır ötesinde değil içeride olduğunu; terörün ancak demokratikleşmeyle, şiddeti dışlayan herkese ifade ve örgütlenme özgürlüğü tanınarak altedilebileceğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Kuzey Irak harekatı', 'PKK', 'güvenlik', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/guvenligimiz/cover.png',
        alt: 'Milliyet, 25 Mart 1995, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'yeni-demokrasi',
    title: 'Yeni Demokrasi',
    date: '4 Nisan 1995',
    subtitle: 'Milliyet, 3. Göz, 4 Nisan 1995, s. 18',
    excerpt:
      "Cem Boyner liderliğindeki Yeni Demokrasi Hareketi'nin siyaset sahnesine yenilik getirdiğini takdir ederken, hareketin liderinden bağımsız kurumlaşıp kurumlaşamayacağını ve özgürlük anlayışının tavizsiz bir liberalizme mi yoksa kültürel relativizme mi yöneleceğini sorgular.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Yeni Demokrasi Hareketi', 'Cem Boyner', 'liberalizm', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/yeni-demokrasi/cover.png',
        alt: 'Milliyet, 4 Nisan 1995, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'kurtler-kardeslerimizdir',
    title: 'Kürtler kardeşlerimizdir',
    date: '13 Nisan 1995',
    subtitle: 'Milliyet, 3. Göz, 13 Nisan 1995, s. 18',
    excerpt:
      "The Sunday Times'ın Türkiye ile Irak'ın Kürtleri ezmek için gizlice anlaştığı iddiasını aktarıp, böyle bir stratejinin Türkiye'yi Batı ittifakından uzaklaştıracağını ve PKK'ya en büyük hizmeti yapacağını savunur; doğru stratejinin Irak Kürtleriyle hem PKK'ya hem Saddam'a karşı güçbirliği olduğunu anlatır.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Kürt sorunu', 'Kuzey Irak', 'Saddam Hüseyin', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/kurtler-kardeslerimizdir/cover.png',
        alt: 'Milliyet, 13 Nisan 1995, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'fundamentalistler-ve-islamcilar',
    title: 'Fundamentalistler ve İslamcılar',
    date: '20 Nisan 1995',
    subtitle: 'Milliyet, 3. Göz, 20 Nisan 1995, s. 18',
    excerpt:
      "El Ezher ulemasının birbiriyle çelişen fetvalarından yola çıkarak, dinin yorumuyla ilgilenen geleneksel fundamentalizm ile dini bir siyasi ideoloji olarak kullanıp iktidar peşinde koşan İslamcılık arasındaki ayrımı; İslamcı önderlerin genellikle laik eğitimli modern meslek sahipleri olduğunu anlatır.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['fundamentalizm', 'İslamcılık', 'El Ezher', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/fundamentalistler-ve-islamcilar/cover.png',
        alt: 'Milliyet, 20 Nisan 1995, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'tartisma-adabi',
    title: 'Tartışma adabı',
    date: '22 Nisan 1995',
    subtitle: 'Milliyet, 3. Göz, 22 Nisan 1995, s. 20',
    excerpt:
      "Sağlıklı bir tartışmanın önce yasaklarla sınırlanmamayı, sonra da bir adap meselesini gerektirdiğini savunur; karşı tarafı dinlemeyi, fikirlerine saygı göstermeyi, görüşlerini tahrif etmemeyi ve -Karl Popper'in önerdiği gibi- eleştirmeden önce en güçlü haline getirmeyi tartışma adabının gerekleri sayar.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['tartışma adabı', 'ifade özgürlüğü', 'Karl Popper', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/tartisma-adabi/cover.png',
        alt: 'Milliyet, 22 Nisan 1995, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'ahmet-altan-olayi',
    title: 'Ahmet Altan Olayı',
    date: '29 Nisan 1995',
    subtitle: 'Milliyet, 3. Göz, 29 Nisan 1995, s. 18',
    excerpt:
      "Ahmet Altan'ın Kürt sorunu üzerine yazısı yüzünden Milliyet'teki işine son verilmesini tartışır; yazarların özgürce yazabilmesi kadar patronların dilediği yazarla çalışma hakkının da meşru olduğunu, ama bu vakanın ifade özgürlüğü mücadelesine zarar verdiğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Ahmet Altan', 'Milliyet', 'ifade özgürlüğü', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/ahmet-altan-olayi/cover.png',
        alt: 'Milliyet, 29 Nisan 1995, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'muhtesem-donek',
    title: 'Muhteşem dönek',
    date: '2 Mayıs 1995',
    subtitle: 'Milliyet, 3. Göz, 2 Mayıs 1995, s. 18',
    excerpt:
      "Türkiye'yi ziyaret eden Gorbaçov'u protesto eden solcu gençlere karşı, onu Marksizm-Leninizm'i terk ederek Sovyet totaliter rejiminin çöküşünün ve Doğu Avrupa halklarının bağımsızlığının yolunu açtığı için 'muhteşem bir dönek' olarak savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Mihail Gorbaçov', 'Sovyetler Birliği', 'sosyalizm', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/muhtesem-donek/cover.png',
        alt: 'Milliyet, 2 Mayıs 1995, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'uc-tarz-i-siyaset',
    title: 'Üç tarz-ı siyaset',
    date: '4 Mayıs 1995',
    subtitle: 'Milliyet, 3. Göz, 4 Mayıs 1995, s. 18',
    excerpt:
      "Yusuf Akçura'nın 1904 tarihli 'Üç Tarz-ı Siyaset' çözümlemesinden yola çıkarak, 1995 Türkiyesi'nin siyasi rekabetinin esas eksenini, bireyin hak ve özgürlüklerini savunan Batıcılarla, milletin/cemaatin/sınıfın haklarını savunan Türkçüler, Kürtçüler, İslamcılar ve komünistler arasındaki ayrım olarak tanımlar.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Yusuf Akçura', 'siyasi ideolojiler', 'Batıcılık', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/uc-tarz-i-siyaset/cover.png',
        alt: 'Milliyet, 4 Mayıs 1995, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'rp-ve-osmanli-mirasi',
    title: 'RP ve Osmanlı mirası',
    date: '1 Haziran 1995',
    subtitle: 'Milliyet, 3. Göz, 1 Haziran 1995, s. 18',
    excerpt:
      "Kanal 7'deki bir tartışma programı vesilesiyle, RP saflarındaki antisemitizm ve Ermeni düşmanlığı eğiliminin İslamcı çevreleri dahi tedirgin ettiğini; Osmanlı'nın farklı din ve kültür gruplarını barış içinde yaşatma mirasının, bu düşmanlıkları besleyenlere yabancı olduğunu savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Refah Partisi', 'antisemitizm', 'Osmanlı mirası', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/rp-ve-osmanli-mirasi/cover.png',
        alt: 'Milliyet, 1 Haziran 1995, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'aleviligin-ayaga-kalkisi',
    title: "'Aleviliğin ayağa kalkışı'",
    date: '29 Haziran 1995',
    subtitle: 'Milliyet, 3. Göz, 29 Haziran 1995, s. 16',
    excerpt:
      "CEM Vakfı'nın kuruluş toplantısını, İzzettin Doğan'ın sözleriyle 'Aleviliğin yeniden ayağa kalkışı' olarak aktarır; Alevilerin Diyanet'te temsilini ve okullarda Alevilikle ilgili bilgilerin okutulmasını talep ettiğini, devletin ihtiyaç duymadıkları camileri vergileriyle finanse etmek zorunda bırakılmalarının demokratikleşmenin gerçek ölçütlerinden biri olacağını yazar.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Alevilik', 'CEM Vakfı', 'İzzettin Doğan', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/aleviligin-ayaga-kalkisi/cover.png',
        alt: 'Milliyet, 29 Haziran 1995, s. 16',
        pageLabel: 's. 16',
      },
    ],
  },
  {
    slug: 'guleryuzlu-sosyalist',
    title: 'Güleryüzlü sosyalist',
    date: '13 Temmuz 1995',
    subtitle: 'Milliyet, 3. Göz, 13 Temmuz 1995, s. 16',
    excerpt:
      "Aziz Nesin ile birlikte kaybettiği Mehmet Ali Aybar'ı anar; Aybar'ın Leninizmi ve proletarya diktatörlüğünü reddeden, çok partili demokrasiye ve insan haklarına bağlı 'güleryüzlü sosyalizm' anlayışının, TİP'ten ve partisinin başkanlığından ayrılmasına mal olduğunu anlatır.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Mehmet Ali Aybar', 'TİP', 'sosyalizm', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/guleryuzlu-sosyalist/cover.png',
        alt: 'Milliyet, 13 Temmuz 1995, s. 16',
        pageLabel: 's. 16',
      },
    ],
  },
  {
    slug: 'islamin-martin-lutheri',
    title: "İslam'ın Martin Luther'i",
    date: '12 Ağustos 1995',
    subtitle: 'Milliyet, 3. Göz, 12 Ağustos 1995, s. 20',
    excerpt:
      "İstanbul'da görüştüğü İranlı düşünür Abdülkerim Soruş'u aktarır; Soruş'un, dinin her zaman ve yerde geçerli tek bir yorumu olmadığı, İslam ile çoğulcu demokrasinin bağdaşabileceği görüşleri yüzünden 'İslam'ın Martin Luther'i' olarak anıldığını ve İran'da mollalarca engellenmeye çalışıldığını anlatır.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Abdülkerim Soruş', 'İslam', 'reform', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/islamin-martin-lutheri/cover.png',
        alt: 'Milliyet, 12 Ağustos 1995, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'firtinalar',
    title: 'Fırtınalar',
    date: '2 Eylül 1995',
    subtitle: 'Milliyet, 3. Göz, 2 Eylül 1995, s. 20',
    excerpt:
      "Ebru Gündeş'in 'Fırtınalar' şarkısının evlilik dışı bir aşkı anlatan sözlerinden ve klibinden yola çıkarak, Türk toplumunun modernleşen kesiminde kadınların evlilik ve aşk hakkındaki değerlerinin değiştiğini; kadın-erkek ilişkilerinde asıl önemli olanın seçme özgürlüğü olduğunu savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['popüler kültür', 'toplumsal değerler', 'Ebru Gündeş', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/firtinalar/cover.png',
        alt: 'Milliyet, 2 Eylül 1995, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'yarim-demokrasimiz',
    title: 'Yarım demokrasimiz',
    date: '31 Ekim 1995',
    subtitle: 'Milliyet, 3. Göz, 31 Ekim 1995, s. 18',
    excerpt:
      "Türkiye'nin rejimini 'göstermelik demokrasi' ya da 'örtülü faşizm' diyenlere karşı, Avrupa İnsan Hakları Sözleşmesi standartlarına henüz ulaşmamış ama bir yarı-demokrasi olduğunu savunur; seçmen kütükleri yenilenmeden yapılan seçimleri ve yüksek barajları bu yarımlığın en güncel örneği sayar.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['demokrasi', 'seçim yasası', 'AİHS', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/yarim-demokrasimiz/cover.png',
        alt: 'Milliyet, 31 Ekim 1995, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'kurt-kimligini-taniyoruz',
    title: 'Kürt kimliğini tanıyoruz',
    date: '2 Kasım 1995',
    subtitle: 'Milliyet, 3. Göz, 2 Kasım 1995, s. 22',
    excerpt:
      "Türkiye İnsan Hakları Vakfı davasındaki beraat kararı ve Kürt Kültür Vakfı'nın tescili gibi gelişmeleri, Türkiye'nin Kürt kimliğini fiilen değil resmen tanımaya doğru attığı ilk ciddi yasal adımlar olarak yorumlar; sırada Lozan Antlaşması'nın 39. maddesinin hayata geçirilmesinin olduğunu savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Kürt kimliği', 'Lozan Antlaşması', 'TMK 8. madde', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/kurt-kimligini-taniyoruz/cover.png',
        alt: 'Milliyet, 2 Kasım 1995, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'refahin-iki-yuzu',
    title: "Refah'ın iki yüzü",
    date: '25 Kasım 1995',
    subtitle: 'Milliyet, 3. Göz, 25 Kasım 1995, s. 20',
    excerpt:
      "Bir televizyon tartışmasının ardından RP hakkındaki görüşlerini özetler: bir yüzüyle İslamcı muhalefeti demokratik düzenin bir parçası haline getirmiş modern bir parti, öteki yüzüyle 'çok hukuklu toplum' projesiyle demokrasinin sonunu getirebilecek bir kuşku kaynağı.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Refah Partisi', 'çok hukukluluk', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/refahin-iki-yuzu/cover.png',
        alt: 'Milliyet, 25 Kasım 1995, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'kaos-teorisi-ve-siyasetimiz',
    title: 'Kaos teorisi ve siyasetimiz',
    date: '5 Aralık 1995',
    subtitle: 'Milliyet, 3. Göz, 5 Aralık 1995, s. 18',
    excerpt:
      "Kaos teorisinin küçük değişikliklerin büyük etkiler doğurabileceği fikrinden yola çıkarak, seçim öncesi belirsizlik ortamında RP'ye karşı oy vermek isteyen okurlarına yüzde 10 barajını aşma ihtimali olan CHP'ye oy vermelerini önerir.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['1995 seçimleri', 'seçim barajı', 'CHP', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/kaos-teorisi-ve-siyasetimiz/cover.png',
        alt: 'Milliyet, 5 Aralık 1995, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'feodalizmmis',
    title: "'feodalizm'miş...",
    date: '12 Aralık 1995',
    subtitle: 'Milliyet, 3. Göz, 12 Aralık 1995, s. 20',
    excerpt:
      "Bülent Ecevit'in Güneydoğu sorununu 'feodalizm ve emperyalizm'e bağlayan görüşüne karşı çıkar; sorunun esasının Kürt milliyetçiliğinin canlanması olduğunu, PKK'nın feodal değil çağının ürünü modern bir örgüt olduğunu ve çözümün kültürel milliyetçilikle ayrılıkçı milliyetçiliği ayırt edebilmekten geçtiğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Bülent Ecevit', 'Kürt milliyetçiliği', 'PKK', '3. Göz', '1995'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/feodalizmmis/cover.png',
        alt: 'Milliyet, 12 Aralık 1995, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'isciler-neden-solcu-degil',
    title: 'İşçiler neden solcu değil?',
    date: '4 Ocak 1996',
    subtitle: 'Milliyet, 3. Göz, 4 Ocak 1996, s. 16',
    excerpt:
      "İşçilerin ve yoksulların oylarını sol partilerde toplamadıklarına duyulan şaşkınlığı sorgular; sınıf esasına göre oy verme eğiliminin Batı demokrasilerinde bile hiçbir zaman çok güçlü olmadığını, Türkiye'de dinsel inanç ve etnik kökenin parti tercihinde sınıftan daha etkili olduğunu savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['sınıf siyaseti', 'seçmen davranışı', '3. Göz', '1996'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/isciler-neden-solcu-degil/cover.png',
        alt: 'Milliyet, 4 Ocak 1996, s. 16',
        pageLabel: 's. 16',
      },
    ],
  },
  {
    slug: 'siddetin-kaynagi',
    title: 'Şiddetin kaynağı',
    date: '16 Ocak 1996',
    subtitle: 'Milliyet, 3. Göz, 16 Ocak 1996, s. 18',
    excerpt:
      "Türkiye'de şiddet ve terörün yayılmasında, sorunları yasaklarla ve baskıyla 'çözme' politikalarının devlete ait birincil sorumluluğunu vurgular; ama toplumdaki şiddet kültürünün de -Metin Göktepe'nin adının anılmaması gibi örneklerle- bu sorumluluğu paylaştığını savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['şiddet', 'hukuk devleti', 'Metin Göktepe', '3. Göz', '1996'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/siddetin-kaynagi/cover.png',
        alt: 'Milliyet, 16 Ocak 1996, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'demokrasiler-savasmaz',
    title: 'Demokrasiler savaşmaz',
    date: '1 Şubat 1996',
    subtitle: 'Milliyet, 3. Göz, 1 Şubat 1996, s. 18',
    excerpt:
      "Siyaset biliminin 'demokratik barış' bulgusunu -1816-1980 arası 416 savaştan yalnızca yüzde 2.8'inin demokrasiler arasında çıktığını- aktarır; Kardak krizini örnek göstererek Türkiye ile Yunanistan'ın demokrasi oldukları ölçüde savaşmayacağını, ama bunun bir garanti olmadığını savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['demokratik barış', 'Kardak krizi', 'Türk-Yunan ilişkileri', '3. Göz', '1996'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/demokrasiler-savasmaz/cover.png',
        alt: 'Milliyet, 1 Şubat 1996, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'asker-sivil-iliskileri',
    title: 'Asker - sivil ilişkileri',
    date: '8 Şubat 1996',
    subtitle: 'Milliyet, 3. Göz, 8 Şubat 1996, s. 18',
    excerpt:
      "Samuel Huntington'un asker-sivil ilişkileri reformu üzerine makalesini aktarır; yeni demokrasilerde 'nesnel sivil denetim'e geçişin hem askerin hem sivillerin yararına görülmesiyle başarıldığını, sorunların çoğunlukla sivil yöneticilerin ekonomik başarısızlığından ve zayıf siyasi kurumlardan kaynaklandığını anlatır.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Samuel Huntington', 'asker-sivil ilişkileri', 'demokratikleşme', '3. Göz', '1996'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/asker-sivil-iliskileri/cover.png',
        alt: 'Milliyet, 8 Şubat 1996, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'pkk-ve-demokrasi',
    title: 'PKK ve demokrasi',
    date: '9 Mart 1996',
    subtitle: 'Milliyet, 3. Göz, 9 Mart 1996, s. 18',
    excerpt:
      "Erdal İnönü'nün PKK terörünü demokratikleşmenin en büyük engeli sayan görüşünü tartışır; PKK'nın hem demokratikleşme davasını kundakladığını hem de Kürt sorununun 'askere havale' edilmesi gibi resmi politikaların PKK'yı büyüttüğünü, çözümün çok kültürlülüğü kabullenmekten geçtiğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['PKK', 'Erdal İnönü', 'Kürt sorunu', '3. Göz', '1996'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/pkk-ve-demokrasi/cover.png',
        alt: 'Milliyet, 9 Mart 1996, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'kurt-politikasi-degismeli',
    title: 'Kürt politikası değişmeli',
    date: '18 Nisan 1996',
    subtitle: 'Milliyet, 3. Göz, 18 Nisan 1996, s. 22',
    excerpt:
      "Hasan Cemal'in eski Genelkurmay Başkanı Doğan Güreş'le söyleşisini aktarır; Güreş'in PKK ile 1993 ateşkesindeki gizli sevincini anlattığını, Türkiye'nin şiddeti dışlayan her akıma ifade ve örgütlenme özgürlüğü tanıyarak hem terörü bitirebileceğini hem demokrasisini pekiştirebileceğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Doğan Güreş', 'PKK', 'Kürt politikası', '3. Göz', '1996'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/kurt-politikasi-degismeli/cover.png',
        alt: 'Milliyet, 18 Nisan 1996, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'niye-sinif-degil-de-kimlik',
    title: 'Niye sınıf değil de kimlik?',
    date: '27 Nisan 1996',
    subtitle: 'Milliyet, 3. Göz, 27 Nisan 1996, s. 18',
    excerpt:
      "1960-70'lerin sınıf mücadelesi merkezli düşüncesinin yerini 1990'larda etnik köken ve dinsel inanç temelli kimlik tartışmalarının aldığını; bu değişimin arkasında globalleşme ve yerelleşme gibi küresel eğilimlerin yattığını savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['kimlik siyaseti', 'globalleşme', 'sınıf siyaseti', '3. Göz', '1996'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/niye-sinif-degil-de-kimlik/cover.png',
        alt: 'Milliyet, 27 Nisan 1996, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'sevr-sendromu',
    title: "'Sevr sendromu'",
    date: '9 Mayıs 1996',
    subtitle: 'Milliyet, 3. Göz, 9 Mayıs 1996, s. 20',
    excerpt:
      "Genelkurmay Başkanlığı'nca yayımlanan bir kitaptan, Batılıların Türkiye'yi bölmek istediğine dair 'Sevr sendromu' söylemini aktarır; bu inanışın en 'Batıcı' kurumlardan siyasetçilere kadar yaygınlaştığını, Kürt sorunu tartışmalarında sık sık karşılarına çıktığını anlatır.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Sevr sendromu', 'Genelkurmay', 'dış politika', '3. Göz', '1996'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/sevr-sendromu/cover.png',
        alt: 'Milliyet, 9 Mayıs 1996, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'erbakan-irkciliktan-yargilanmali',
    title: 'Erbakan ırkçılıktan yargılanmalı',
    date: '25 Mayıs 1996',
    subtitle: 'Milliyet, 3. Göz, 25 Mayıs 1996, s. 20',
    excerpt:
      "Necmettin Erbakan'ın seçim mitinglerinde sarf ettiği Yahudi düşmanı sözleri aktarır; Türkiye gerçek bir hukuk devleti olsaydı bu ırkçı beyanlardan dolayı yargılanması gerektiğini, ama fiilen ırkçılığın serbest kaldığını savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Necmettin Erbakan', 'antisemitizm', 'Refah Partisi', '3. Göz', '1996'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/erbakan-irkciliktan-yargilanmali/cover.png',
        alt: 'Milliyet, 25 Mayıs 1996, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'islamcilari-taniyalim',
    title: 'İslamcıları tanıyalım',
    date: '22 Haziran 1996',
    subtitle: 'Milliyet, 3. Göz, 22 Haziran 1996, s. 18',
    excerpt:
      "İslamcılığın Türkiye'nin yükselen siyasi akımı olduğunu kabullenip, İslamcılığı fundamentalizmden ayıran temel özellikleri sıralar: modern eğitimli liderler, modern örgütlenme, globalleşme ve demokratikleşmeye karşı bir tepki hareketi olması, ve Refah Partisi'nin bu akımı yasal ve ılımlı bir çizgiye taşıması.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['İslamcılık', 'fundamentalizm', 'Refah Partisi', '3. Göz', '1996'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/islamcilari-taniyalim/cover.png',
        alt: 'Milliyet, 22 Haziran 1996, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'turkun-dostu-yoktur',
    title: "'Türkün dostu yoktur'",
    date: '6 Temmuz 1996',
    subtitle: 'Milliyet, 3. Göz, 6 Temmuz 1996, s. 18',
    excerpt:
      "TÜSES'in 'Türkiye'nin Politik Kültürü' araştırmasının dış politika bulgularını aktarır: halkın yarısının Avrupa bütünleşmesini istediğini, ama yüzde 29'unun 'Türkiye'nin dostu yoktur' dediğini; bu kutuplaşmanın Batı ve İslam alemine eğilimliler arasında olduğunu anlatır.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['TÜSES', 'kamuoyu araştırması', 'dış politika', '3. Göz', '1996'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/turkun-dostu-yoktur/cover.png',
        alt: 'Milliyet, 6 Temmuz 1996, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'sehitlerimiz',
    title: 'Şehitlerimiz',
    date: '31 Ağustos 1996',
    subtitle: 'Milliyet, 3. Göz, 31 Ağustos 1996, s. 18',
    excerpt:
      "PKK'yla mücadelede verilen 2762 şehidi ve PKK'nın dağlara sürüklediği binlerce genci birlikte anar; ölenlerin kökeninin önemi olmadığını, Kürt kimliği taleplerine parlamenter düzen içinde temsil kanalları açılmadıkça bu kaybın süreceğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['PKK', 'şehitler', 'Kürt sorunu', '3. Göz', '1996'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/sehitlerimiz/cover.png',
        alt: 'Milliyet, 31 Ağustos 1996, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'laiklik-ve-demokrasi',
    title: 'Laiklik ve demokrasi',
    date: '3 Eylül 1996',
    subtitle: 'Milliyet, 3. Göz, 3 Eylül 1996, s. 18',
    excerpt:
      "Cumhuriyet, laiklik ve demokrasi arasında bir öncelik ilişkisi bulunduğu görüşünü sorgular; birçok gelişmiş demokrasinin cumhuriyet olmadığını, birçok cumhuriyetin ise demokratik olmadığını örnekleyerek, demokrasiyi savunmanın laikliği savunmak anlamına geldiğini ama tersinin geçerli olmadığını savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['laiklik', 'cumhuriyet', 'demokrasi', '3. Göz', '1996'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/laiklik-ve-demokrasi/cover.png',
        alt: 'Milliyet, 3 Eylül 1996, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'apoletli-medya',
    title: "'Apoletli medya'",
    date: '9 Kasım 1996',
    subtitle: 'Milliyet, 3. Göz, 9 Kasım 1996, s. 22',
    excerpt:
      "Ragıp Duran'ın medyanın devletten bağımsızlığını kazanamayışını eleştiren kitapçığından yola çıkar; medyaya yönelik eleştirilerin çoğunun haklı olabileceğini kabul ederken, medyanın yine de Türkiye demokrasisinin en önemli kurumlarından biri olduğunu savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['medya', 'Ragıp Duran', 'basın özgürlüğü', '3. Göz', '1996'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/apoletli-medya/cover.png',
        alt: 'Milliyet, 9 Kasım 1996, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'islamcilar-ve-laikciler',
    title: 'İslamcılar ve laikçiler',
    date: '14 Kasım 1996',
    subtitle: 'Milliyet, 3. Göz, 14 Kasım 1996, s. 20',
    excerpt:
      "Radikal İslamcılarla radikal laikçileri simetrik iki bağnazlık olarak tarif eder: biri dini bir siyasi ideolojiye, öteki toplumu dinden tümüyle arındırmaya çalışıyor; düşünce ve ifade özgürlüğüne inanan demokratların her ikisine karşı da tavır alması gerektiğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['İslamcılık', 'laiklik', 'radikalizm', '3. Göz', '1996'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/islamcilar-ve-laikciler/cover.png',
        alt: 'Milliyet, 14 Kasım 1996, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'diyarbakirdan-bakinca-susurluk',
    title: "Diyarbakır'dan bakınca Susurluk",
    date: '28 Kasım 1996',
    subtitle: 'Milliyet, 3. Göz, 28 Kasım 1996, s. 20',
    excerpt:
      "Aynı hafta katıldığı İstanbul ve Diyarbakır'daki iki akşam yemeğindeki karşıt görüşleri aktarır; Susurluk kazasının açtığı tartışmanın devlet içindeki suç şebekelerinin Güneydoğu'daki savaştaki payını aydınlatabileceğine dair küçük bir umut uyandırdığını yazar.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Susurluk', 'Diyarbakır', 'Güneydoğu', '3. Göz', '1996'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/diyarbakirdan-bakinca-susurluk/cover.png',
        alt: 'Milliyet, 28 Kasım 1996, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'ab-kandiriyor-mu',
    title: "AB 'kandırıyor' mu?",
    date: '10 Aralık 1996',
    subtitle: 'Milliyet, 3. Göz, 10 Aralık 1996, s. 18',
    excerpt:
      "Türkiye'nin AB'ye tam üyeliğinin önündeki engelleri sıralar: yüksek enflasyon ve işsizlik, Diyarbakır Cezaevi'ndeki işkence iddiaları gibi insan hakları sorunları, Güneydoğu'daki düşük yoğunluklu savaş ve Yunanistan'la ilişkiler; Erbakan'ın 'Avrupa bizi kandırıyor' sözünün ne kadar anlamlı olduğunu sorgular.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Avrupa Birliği', 'insan hakları', 'AB üyeliği', '3. Göz', '1996'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/ab-kandiriyor-mu/cover.png',
        alt: 'Milliyet, 10 Aralık 1996, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'islamin-yildizi-ne-alemde',
    title: "'İslam'ın Yıldızı' ne alemde?",
    date: '8 Şubat 1997',
    subtitle: 'Milliyet, 3. Göz, 8 Şubat 1997, s. 18',
    excerpt:
      "The Economist'in eski dış haberler editörü Brian Beedham'la Londra'da yaptığı görüşmeyi aktarır; Beedham'ın 1991'de yazdığı 'İslam'ın Yıldızı' makalesini beş yıl sonra nasıl değerlendirdiğini sorar; Refahyol hükümetine rağmen Türkiye'nin demokrasi açısından hâlâ 'İslam'ın Yıldızı' olmayı sürdürdüğü cevabını aktarır.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Brian Beedham', 'The Economist', 'Refahyol', '3. Göz', '1997'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/islamin-yildizi-ne-alemde/cover.png',
        alt: 'Milliyet, 8 Şubat 1997, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'seriat-ne-demek',
    title: "'Şeriat' ne demek?",
    date: '18 Şubat 1997',
    subtitle: 'Milliyet, 3. Göz, 18 Şubat 1997, s. 20',
    excerpt:
      "'Şeriata karşı kadın yürüyüşü'ne verilen tepkiler vesilesiyle, şeriatın geniş anlamda inanç ve ibadet kurallarını, dar anlamda İslam hukukunu ifade ettiğini; Türkiye'nin bu iki anlamı ayıran ilk İslam ülkesi olduğunu, RP seçmenlerinin çoğunluğunun İslam hukuku istediği için oy vermediğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['şeriat', 'laiklik', 'Refah Partisi', '3. Göz', '1997'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/seriat-ne-demek/cover.png',
        alt: 'Milliyet, 18 Şubat 1997, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'muhtesem-revizyonist',
    title: 'Muhteşem revizyonist',
    date: '22 Şubat 1997',
    subtitle: 'Milliyet, 3. Göz, 22 Şubat 1997, s. 20',
    excerpt:
      "Deng Siyaoping'in ölümü vesilesiyle, öğrencilik yıllarında Kültür Devrimi'nin coşkusuyla nefret ettiği Deng'i, ekonomik reformla Çin'de kapitalizmi ihya eden ve otoriter partiyi ayakta tutarak bunu başaran 'muhteşem bir revizyonist' olarak yeniden değerlendirir.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Deng Siyaoping', 'Çin', 'Kültür Devrimi', '3. Göz', '1997'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/muhtesem-revizyonist/cover.png',
        alt: 'Milliyet, 22 Şubat 1997, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'kibrisin-kimligi',
    title: "Kıbrıs'ın kimliği",
    date: '1 Nisan 1997',
    subtitle: 'Milliyet, 3. Göz, 1 Nisan 1997, s. 22',
    excerpt:
      "KKTC ziyaretinden izlenimlerini aktarır; iktidar ve muhalefetin Kıbrıs Türklerinin ayrı bir kimliği olup olmadığı ve Türkiye'nin garantörlüğü ile AB üyeliği konularında nasıl ayrıştığını; KKTC ekonomisinin Türkiye'ye bağımlılığının çözümü zorlaştırdığını anlatır.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['KKTC', 'Kıbrıs sorunu', 'kimlik', '3. Göz', '1997'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/kibrisin-kimligi/cover.png',
        alt: 'Milliyet, 1 Nisan 1997, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'imam-hatip-meselesi',
    title: 'İmam-Hatip meselesi',
    date: '5 Nisan 1997',
    subtitle: 'Milliyet, 3. Göz, 5 Nisan 1997, s. 22',
    excerpt:
      "Bülent Tanör'ün İmam-Hatip liselerini dogmatik zihniyetle ilişkilendiren TÜSİAD raporunu tartışır; laik okulların da otoriter zihniyet yetiştirebildiğini, İslamcı liderlerin çoğunun laik okullardan mezun olduğunu hatırlatarak sorumluluğun tek başına İmam-Hatip'lere yüklenemeyeceğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['İmam-Hatip', 'din eğitimi', 'Bülent Tanör', '3. Göz', '1997'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/imam-hatip-meselesi/cover.png',
        alt: 'Milliyet, 5 Nisan 1997, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'bilim-ve-yanilgi-1997',
    title: "'Bilim ve yanılgı'",
    date: '26 Nisan 1997',
    subtitle: 'Milliyet, 3. Göz, 26 Nisan 1997, s. 20',
    excerpt:
      "Işığın hızının sabit olmayabileceğine dair yeni bulgulardan yola çıkarak, bilimin ebedi doğrular değil, aksi ispatlanana kadar geçerli teoriler bütünü olduğunu; din ile bilimin birbirinin yerini tutamayacak ayrı alanlar olduğunu, Taha Akyol'un Bilim ve Yanılgı kitabını referans göstererek anlatır.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['bilim felsefesi', 'Taha Akyol', 'pozitivizm', '3. Göz', '1997'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/bilim-ve-yanilgi-1997/cover.png',
        alt: 'Milliyet, 26 Nisan 1997, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'millet-ve-kimlik',
    title: 'Millet ve kimlik',
    date: '13 Mayıs 1997',
    subtitle: 'Milliyet, 3. Göz, 13 Mayıs 1997, s. 22',
    excerpt:
      "Bonn yakınlarındaki bir Türk-Alman sempozyumundan yola çıkarak, hem Almanya'nın hem Türkiye'nin milleti etnik kökenle değil vatandaşlıkla tanımlamaya geçme sancısı çektiğini; Demirel'in Lizbon konuşmasındaki 'yurttaşlar topluluğu' tanımını bu dönüşümün en iyi ifadesi sayar.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['millet tanımı', 'Almanya', 'vatandaşlık', '3. Göz', '1997'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/millet-ve-kimlik/cover.png',
        alt: 'Milliyet, 13 Mayıs 1997, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'rp-pragmatizm-ya-da-ideoloji',
    title: 'RP: Pragmatizm ya da İdeoloji',
    date: '5 Haziran 1997',
    subtitle: 'Milliyet, 3. Göz, 5 Haziran 1997, s. 22',
    excerpt:
      "Amerikalı antropolog Jenny B. White'ın 'siyasi sisteme dahil edilmek radikal İslamcıları ılımlılaştırır mı?' sorusundan yola çıkarak, Refahyol tecrübesinin RP yönetimini söylem ve pratikte eskiye göre daha gerçekçi ve ılımlı hale getirdiğini, ama bunun hükümeti krizden kurtarmadığını savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Refah Partisi', 'Refahyol', 'Jenny B. White', '3. Göz', '1997'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/rp-pragmatizm-ya-da-ideoloji/cover.png',
        alt: 'Milliyet, 5 Haziran 1997, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'islamin-protestanlasmasi',
    title: "'İslam'ın Protestanlaşması'",
    date: '14 Haziran 1997',
    subtitle: 'Milliyet, 3. Göz, 14 Haziran 1997, s. 22',
    excerpt:
      "Nakşibendiliğin dönüşümü üzerine İstanbul'daki bir akademik konferansı aktarır; Şerif Mardin'in tarikat ve cemaatlerin ibadetle zenginleşmeyi birleştiren evrimini 'İslam'ın Protestanlaşması' olarak yorumladığını; RP'yi tümüyle 'irtica partisi' ilan etmenin nüansları gözardı ettiğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Nakşibendilik', 'Şerif Mardin', 'irtica', '3. Göz', '1997'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/islamin-protestanlasmasi/cover.png',
        alt: 'Milliyet, 14 Haziran 1997, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'refahin-uyarisi',
    title: "Refah'ın uyarısı",
    date: '26 Haziran 1997',
    subtitle: 'Milliyet, 3. Göz, 26 Haziran 1997, s. 20',
    excerpt:
      "RP'nin demokratik ve otoriter iki yüzü olduğunu yinelerken, partinin 'Batı taklitçiliği' eleştirisinin ve dini bastırma çabalarına yönelttiği eleştirilerin bazı gerçek payı olabileceğini; RP'nin büyümesinin, laik partilerin temel sorunları çözmedeki başarısızlığına da bir uyarı olduğunu savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Refah Partisi', 'laiklik', 'siyasi partiler', '3. Göz', '1997'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/refahin-uyarisi/cover.png',
        alt: 'Milliyet, 26 Haziran 1997, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'sol-din-ve-devlet',
    title: 'Sol, din ve devlet',
    date: '28 Ağustos 1997',
    subtitle: 'Milliyet, 3. Göz, 28 Ağustos 1997, s. 22',
    excerpt:
      "Hilmi Yavuz'un Türk aydınlarının İslam konusundaki cehaletine dair eleştirisinden yola çıkarak, İttihatçı-Kemalist ve Marksist gelenekten gelen solun 19. yüzyıl pozitivizminin etkisiyle dini genel olarak gericilikle özdeşleştirdiğini; asıl meselenin devlet-toplum dengesini kurabilmek olduğunu savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['sol', 'laiklik', 'Hilmi Yavuz', '3. Göz', '1997'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/sol-din-ve-devlet/cover.png',
        alt: 'Milliyet, 28 Ağustos 1997, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'ataturk-kultu',
    title: "'Atatürk kültü'",
    date: '18 Ekim 1997',
    subtitle: 'Milliyet, 3. Göz, 18 Ekim 1997, s. 22',
    excerpt:
      "The New York Times'ta Stephen Kinzer'in Atatürk kültü üzerine haberini ve Andrew Mango'nun hazırladığı biyografiyi aktarır; Türkiye'nin 50 yıllık demokrasi tecrübesinden sonra Atatürk'ü yasak ve tabulardan kurtarıp serbestçe tartışabilmesi gerektiğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Atatürk', 'Andrew Mango', 'demokratikleşme', '3. Göz', '1997'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/ataturk-kultu/cover.png',
        alt: 'Milliyet, 18 Ekim 1997, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'kurtleri-turk-yapmak',
    title: 'Kürtleri Türk yapmak',
    date: '8 Ocak 1998',
    subtitle: 'Milliyet, 3. Göz, 8 Ocak 1998, s. 18',
    excerpt:
      "MGK ve Genelkurmay brifinglerinde Kürtleri 'aslında Türk' saydırma yaklaşımının hâlâ sürdüğünü aktarır; Kürt kimliğini tanımadan onların sadakatini kazanmanın mümkün olmadığını, tersine Kürtleri Türklüğe bağlamanın yolunun da Kürt kimliğini tanımaktan geçtiğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Kürt kimliği', 'MGK', 'PKK', '3. Göz', '1998'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1998/kurtleri-turk-yapmak/cover.png',
        alt: 'Milliyet, 8 Ocak 1998, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'refah-karari',
    title: 'Refah kararı',
    date: '20 Ocak 1998',
    subtitle: 'Milliyet, 3. Göz, 20 Ocak 1998, s. 22',
    excerpt:
      "Anayasa Mahkemesi'nin RP'yi kapatma kararını değerlendirir; RP'nin temsil ettiği siyasi akımın demokrasiden dışlanamayacağını, partinin toplu cezalandırılmasının hukuken tartışmalı ve siyaseten sakıncalı olduğunu, asıl gereken adımın Siyasi Partiler Kanunu'nun özgürlükçü demokrasiye uygun hale getirilmesi olduğunu savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Refah Partisi', 'Anayasa Mahkemesi', 'parti kapatma', '3. Göz', '1998'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1998/refah-karari/cover.png',
        alt: 'Milliyet, 20 Ocak 1998, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'tsknin-siyasi-ozerkligi',
    title: "TSK'nın 'siyasi özerkliği'",
    date: '10 Mart 1998',
    subtitle: 'Milliyet, 3. Göz, 10 Mart 1998, s. 22',
    excerpt:
      "Princeton'da verdiği dersten yola çıkarak, Türkiye'de askerlerin doğrudan yönetime el koymasa da Ümit Cizre Sakallıoğlu'nun tabiriyle geniş bir 'siyasi özerkliğe' sahip olduğunu; 28 Şubat sürecini örnek göstererek bunun ancak liberal demokrasinin temel ilkeleri üzerinde mutabakatla değişebileceğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['TSK', 'asker-sivil ilişkileri', '28 Şubat', '3. Göz', '1998'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1998/tsknin-siyasi-ozerkligi/cover.png',
        alt: 'Milliyet, 10 Mart 1998, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'din-ve-bilim',
    title: 'Din ve bilim',
    date: '8 Ağustos 1998',
    subtitle: 'Milliyet, 3. Göz, 8 Ağustos 1998, s. 20',
    excerpt:
      "Evrim teorisi tartışmaları vesilesiyle, bilimin ve dinin aynı köke sahip ama zamanla alanlarını ayırmış iki farklı bilgi biçimi olduğunu; bilimin akla, dinin vicdana hitap ettiğini, her birinin diğerinin alanına saygı gösterdiği ölçüde bağdaşabildiğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['din', 'bilim felsefesi', 'evrim teorisi', '3. Göz', '1998'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1998/din-ve-bilim/cover.png',
        alt: 'Milliyet, 8 Ağustos 1998, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'devletin-ceteleri',
    title: 'Devletin çeteleri',
    date: '27 Ağustos 1998',
    subtitle: 'Milliyet, 3. Göz, 27 Ağustos 1998, s. 20',
    excerpt:
      "Alaaddin Çakıcı'nın Fransa'da yakalanmasıyla açılan 'Susurluk skandalının ikinci perdesi'ni değerlendirir; devlet için adam öldürmesi istenen çetelerin sonunda kişisel çıkarları için suç işlemeye başladığını, devletin bu 'canavarı' kendi doğurduğunu savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Susurluk', 'Alaaddin Çakıcı', 'derin devlet', '3. Göz', '1998'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1998/devletin-ceteleri/cover.png',
        alt: 'Milliyet, 27 Ağustos 1998, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'milliyet-onemlidir',
    title: 'Milliyet önemlidir',
    date: '15 Ekim 1998',
    subtitle: 'Milliyet, 3. Göz, 15 Ekim 1998, s. 22',
    excerpt:
      "Basın özgürlüğünün ve bağımsız medyanın demokrasinin 'olmazsa olmaz' koşullarından biri olduğunu anlatır; Türk medyasının eksik ve kusurlarına rağmen Türkiye'de demokrasinin belki en önemli gücü olduğunu, Milliyet gazetesinin de bu kurumların başında geldiğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['basın özgürlüğü', 'medya', 'Milliyet', '3. Göz', '1998'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1998/milliyet-onemlidir/cover.png',
        alt: 'Milliyet, 15 Ekim 1998, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'muasir-medeniyet',
    title: "'Muasır medeniyet'",
    date: '29 Ekim 1998',
    subtitle: 'Milliyet, 3. Göz, 29 Ekim 1998, s. 22',
    excerpt:
      "Cumhuriyet'in 75. yıldönümünde, 1950'de İsmet İnönü öncülüğünde çok partili demokrasiye geçişi Türkiye'nin en büyük başarısı sayar; bugünkü siyasi sıkıntıların demokrasiden değil demokrasinin bütün kurum ve kurallarıyla uygulanamayışından kaynaklandığını savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Cumhuriyet', 'demokratikleşme', 'Atatürk', '3. Göz', '1998'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1998/muasir-medeniyet/cover.png',
        alt: 'Milliyet, 29 Ekim 1998, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'gazeteci',
    title: 'Gazeteci',
    date: '3 Kasım 1998',
    subtitle: 'Milliyet, 3. Göz, 3 Kasım 1998, s. 20',
    excerpt:
      "Antakya'daki bir AB-Türkiye gazeteciler konferansında bir Yunanlı meslektaşının resmi görüşleri tekrarlamasından yola çıkarak, bir gazetecinin görevinin resmi söylemi papağan gibi tekrarlamak değil, sorunlara objektif yaklaşıp çözüme ufuk açmak olduğunu savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['gazetecilik', 'Türk-Yunan ilişkileri', 'AB', '3. Göz', '1998'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1998/gazeteci/cover.png',
        alt: 'Milliyet, 3 Kasım 1998, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'kurt-sorunu-ve-pkk',
    title: 'Kürt sorunu ve PKK',
    date: '3 Aralık 1998',
    subtitle: 'Milliyet, 3. Göz, 3 Aralık 1998, s. 22',
    excerpt:
      "Okurlardan sık gelen sorulara cevap verir: Türkiye'nin liberal demokrasiye hazır olduğunu, Kürt sorununun PKK'dan ayrı bir gerçeklik olduğunu ve Kürt sorunundan söz etmenin PKK'ya meşruiyet kazandırmadığını, PKK'nın Kürtleri temsil etmediğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Kürt sorunu', 'PKK', 'demokrasi', '3. Göz', '1998'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1998/kurt-sorunu-ve-pkk/cover.png',
        alt: 'Milliyet, 3 Aralık 1998, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'talihsiz-bir-karar',
    title: 'Talihsiz bir karar',
    date: '2 Mart 1999',
    subtitle: 'Milliyet, 3. Göz, 2 Mart 1999, s. 20',
    excerpt:
      "Anayasa Mahkemesi'nin, Şerafettin Elçi'nin genel başkanlığını yaptığı Demokratik Kitle Partisi'ni kapatma kararını, Öcalan'ın yakalanmasının ardından açılan tarihi fırsatı değerlendirmeme iradesinin en açık ifadesi olarak eleştirir; kararın kıl payı (11 üyeden 5 muhalefetle) alındığını hatırlatır.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Demokratik Kitle Partisi', 'Şerafettin Elçi', 'Anayasa Mahkemesi', '3. Göz', '1999'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1999/talihsiz-bir-karar/cover.png',
        alt: 'Milliyet, 2 Mart 1999, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'kktcyi-taniyin',
    title: "KKTC'yi tanıyın",
    date: '3 Nisan 1999',
    subtitle: 'Milliyet, 3. Göz, 3 Nisan 1999, s. 20',
    excerpt:
      "İsveçli akademisyen Bertil Duner'in 'Kuzey Kıbrıs neden tanınmıyor?' başlıklı makalesini aktarır; enosis peşindeki Rum tarafının 1974 öncesi krizin sorumlusu olduğunu, KKTC'nin tanınmasının adanın AB çatısı altında birleşmesini kolaylaştırabileceğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['KKTC', 'Kıbrıs sorunu', 'Bertil Duner', '3. Göz', '1999'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1999/kktcyi-taniyin/cover.png',
        alt: 'Milliyet, 3 Nisan 1999, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'tarafsiz-gazeteci',
    title: 'Tarafsız gazeteci',
    date: '15 Nisan 1999',
    subtitle: 'Milliyet, 3. Göz, 15 Nisan 1999, s. 24',
    excerpt:
      "Oy vereceği partiyi açıklamasının eleştirilmesi üzerine, habercilikle yorumculuğun farklı sorumlulukları olduğunu savunur: habercinin tarafsız olması gerekirken, yorumcunun objektif olması yeterlidir; bir görüşü olmayan 'tarafsız yorumcu' diye bir şeyin mümkün olmadığını yazar.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['gazetecilik etiği', 'yorum yazarlığı', '3. Göz', '1999'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1999/tarafsiz-gazeteci/cover.png',
        alt: 'Milliyet, 15 Nisan 1999, s. 24',
        pageLabel: 's. 24',
      },
    ],
  },
  {
    slug: 'milliyetcilik-ve-yurtseverlik',
    title: 'Milliyetçilik ve yurtseverlik',
    date: '6 Mayıs 1999',
    subtitle: 'Milliyet, 3. Göz, 6 Mayıs 1999, s. 22',
    excerpt:
      "18 Nisan seçimleri sonrası yükselen milliyetçilik tartışmalarını, Umut Özkırımlı'nın kitabına dayanarak çözümler; ırkçı-saldırgan faşist milliyetçilik ile herkesi millete dahil sayan liberal milliyetçiliği ayırır, 'yurtseverliğin' bu ikinciye yakın, kapsayıcı bir tavır olduğunu savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['milliyetçilik', 'yurtseverlik', 'Umut Özkırımlı', '3. Göz', '1999'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1999/milliyetcilik-ve-yurtseverlik/cover.png',
        alt: 'Milliyet, 6 Mayıs 1999, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'mao-ve-dengin-kenti',
    title: "Mao ve Deng'in kenti",
    date: '8 Haziran 1999',
    subtitle: 'Milliyet, 3. Göz, 8 Haziran 1999, s. 18',
    excerpt:
      "Pekin'den yazdığı ilk yazısında, otuz yıl önce Mao'nun sosyalizminin Türkiye'nin derdine deva olabileceğine kısaca inandığı gençlik yıllarını hatırlar; Deng Siyaoping'in 1978'den beri başlattığı reformlarla Çin ekonomisinin geçirdiği çarpıcı dönüşümü çarpıcı büyüme rakamlarıyla anlatır.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Çin', 'Deng Siyaoping', 'Mao Zedung', '3. Göz', '1999'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1999/mao-ve-dengin-kenti/cover.png',
        alt: 'Milliyet, 8 Haziran 1999, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'islam-ve-iran',
    title: 'İslam ve İran',
    date: '22 Temmuz 1999',
    subtitle: 'Milliyet, 3. Göz, 22 Temmuz 1999, s. 20',
    excerpt:
      "İslam'ın laikliğe elverişsiz olduğu görüşünü, Sünni İslam tarihinde dinin hep devlete tabi olduğunu, 'İslam devleti' fikrinin ancak 20. yüzyıl sonu İslamcı akımlarının icadı olduğunu hatırlatarak çürütmeye çalışır; İran'da bile din-devlet ayrılığı yanlısı mollaların güçlü bir muhalefet oluşturduğunu anlatır.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['İslam', 'İran', 'laiklik', '3. Göz', '1999'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1999/islam-ve-iran/cover.png',
        alt: 'Milliyet, 22 Temmuz 1999, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'aponun-cagrisi',
    title: "Apo'nun çağrısı",
    date: '10 Ağustos 1999',
    subtitle: 'Milliyet, 3. Göz, 10 Ağustos 1999, s. 20',
    excerpt:
      "Abdullah Öcalan'ın militanlarını silahlı mücadeleyi bırakıp ülke dışına çıkmaya çağırmasını, PKK'nın askeri ve ideolojik iflasının itirafı olarak yorumlar; Ankara'nın bunu görmezden gelemeyeceğini, af yasaları, Güneydoğu'da kalkınma hamlesi ve demokratikleşmeyle bu fırsatı değerlendirmesi gerektiğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Abdullah Öcalan', 'PKK', 'Kürt sorunu', '3. Göz', '1999'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1999/aponun-cagrisi/cover.png',
        alt: 'Milliyet, 10 Ağustos 1999, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'kibrisi-cozelim',
    title: "Kıbrıs'ı çözelim",
    date: '9 Eylül 1999',
    subtitle: 'Milliyet, 3. Göz, 9 Eylül 1999, s. 20',
    excerpt:
      "17 Ağustos depreminin ardından Türk-Yunan toplumları arasında doğan dayanışma dalgasını, Kıbrıs sorununu çözmek için değerlendirilmesi gereken bir fırsat olarak yorumlar; Ankara'nın uzlaşmaz tutumunu terk edip Kıbrıs'ın AB çatısı altında iki kesimli bir federasyon olarak çözülmesine adım atması gerektiğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Kıbrıs sorunu', 'Türk-Yunan ilişkileri', '1999 depremi', '3. Göz', '1999'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1999/kibrisi-cozelim/cover.png',
        alt: 'Milliyet, 9 Eylül 1999, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'islamin-yildizi',
    title: "İslam'ın yıldızı",
    date: '30 Kasım 1999',
    subtitle: 'Milliyet, 3. Göz, 30 Kasım 1999, s. 20',
    excerpt:
      "İngiltere'deki bir Wilton Park konferansından, '21. Yüzyılda İslam ve Batı' tartışmalarını aktarır; Türkiye'nin, mükemmel olmaktan uzak demokrasisi ve laikliği sayesinde İslam dünyasının tartışılmaz yıldızı olmaya devam ettiğini, Kopenhag kriterlerinin bu konumu daha da pekiştireceğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['İslam dünyası', 'Wilton Park', 'demokratikleşme', '3. Göz', '1999'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1999/islamin-yildizi/cover.png',
        alt: 'Milliyet, 30 Kasım 1999, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'helsinki',
    title: 'Helsinki',
    date: '11 Aralık 1999',
    subtitle: 'Milliyet, 3. Göz, 11 Aralık 1999, s. 24',
    excerpt:
      "Türkiye'nin AB'ye aday ilan edileceği Helsinki zirvesi öncesinde, üyeliğin ekonomik, stratejik ve kültürel çıkarlar açısından neden istendiğini satırbaşlarıyla özetler; İsmail Cem'in 'girmesek de yolumuza devam ederiz' sözünü aktararak Lüksemburg'daki hatanın tekrarlanmamasını umar.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Avrupa Birliği', 'Helsinki zirvesi', 'İsmail Cem', '3. Göz', '1999'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1999/helsinki/cover.png',
        alt: 'Milliyet, 11 Aralık 1999, s. 24',
        pageLabel: 's. 24',
      },
    ],
  },
  {
    slug: 'temkinli-iyimser',
    title: 'Temkinli iyimser',
    date: '4 Ocak 2000',
    subtitle: 'Milliyet, 3. Göz, 4 Ocak 2000, s. 22',
    excerpt:
      "21. yüzyılın ilk yazısında, Helsinki zirvesiyle açılan AB üyelik ufkunu Osmanlı'dan Cumhuriyet'e uzanan Batılılaşma ve demokratikleşme çizgisinin devamı olarak yorumlar; Türkiye'nin yarı-demokrasi olduğunu ama 'sahte demokrasi' sayılamayacağını, geleceğe temkinli bir iyimserlikle bakılabileceğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Avrupa Birliği', 'Helsinki zirvesi', 'demokratikleşme', '3. Göz', '2000'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/2000/temkinli-iyimser/cover.png',
        alt: 'Milliyet, 4 Ocak 2000, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'islam-ve-siddet',
    title: 'İslam ve şiddet',
    date: '3 Şubat 2000',
    subtitle: 'Milliyet, 3. Göz, 3 Şubat 2000, s. 22',
    excerpt:
      "Bosna Müslümanlarının dini lideri Mustafa Çeriç'in 'Saddam Hüseyin ne kadar Müslümansa Hitler de o kadar Hıristiyandır' sözünü aktararak, İslam'ı İslamcı terörle özdeşleştirmenin yanlışlığını; radikal İslamcıların son yirmi yılda işlediği cinayetlerin de İslam'a mal edilemeyeceğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['İslam', 'terörizm', 'Mustafa Çeriç', '3. Göz', '2000'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/2000/islam-ve-siddet/cover.png',
        alt: 'Milliyet, 3 Şubat 2000, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'fazilet-paradoksu',
    title: 'Fazilet paradoksu',
    date: '18 Mart 2000',
    subtitle: 'Milliyet, 3. Göz, 18 Mart 2000, s. 20',
    excerpt:
      "Fazilet Partisi'nin TCK 312. maddeye karşı çıkışını haklı bulurken, partinin iki yıl önce aynı maddenin değiştirilmesine karşı çıktığını hatırlatarak paradoksunu eleştirir; FP içindeki 'Yenilikçi' kanadın kazanmasının Türkiye'nin demokratikleşmesine katkı sağlayabileceğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Fazilet Partisi', 'TCK 312', 'ifade özgürlüğü', '3. Göz', '2000'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/2000/fazilet-paradoksu/cover.png',
        alt: 'Milliyet, 18 Mart 2000, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'fpnin-iki-yuzu',
    title: "FP'nin iki yüzü",
    date: '11 Mayıs 2000',
    subtitle: 'Milliyet, 3. Göz, 11 Mayıs 2000',
    excerpt:
      "1995'teki 'Refah'ın iki yüzü' yazısına dönerek, Milli Görüş hareketinin RP'den FP'ye geçişte nasıl değiştiğini değerlendirir; FP'deki 'Yenilikçi' kanadın kongreyi kazanması halinde partinin Türkiye'nin özlemini duyduğu bir Müslüman Demokrat Parti'ye dönüşebileceğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Fazilet Partisi', 'Milli Görüş', 'Recai Kutan', '3. Göz', '2000'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/2000/fpnin-iki-yuzu/cover.jpg',
        alt: 'Milliyet, 11 Mayıs 2000',
      },
    ],
  },
  {
    slug: 'inkar-kulturu',
    title: "'İnkâr kültürü'",
    date: '3 Ağustos 2000',
    subtitle: 'Milliyet, 3. Göz, 3 Ağustos 2000, s. 24',
    excerpt:
      "The New York Times'ın eski İstanbul büro şefi Stephen Kinzer'in 'inkâr kültürü' gözlemini, Alevilik, Kürt kimliği ve 1915 Ermeni tehciri örnekleriyle genişletir; toplumun rahatsız eden gerçeklerle giderek daha fazla yüzleşmeye başladığını ama bundan tam kurtulamadığını savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['inkâr kültürü', 'Stephen Kinzer', 'kimlik siyaseti', '3. Göz', '2000'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/2000/inkar-kulturu/cover.png',
        alt: 'Milliyet, 3 Ağustos 2000, s. 24',
        pageLabel: 's. 24',
      },
    ],
  },
  {
    slug: 'soykirim-somurusu',
    title: "'Soykırım sömürüsü'",
    date: '8 Ağustos 2000',
    subtitle: 'Milliyet, 3. Göz, 8 Ağustos 2000, s. 24',
    excerpt:
      "Norman Finkelstein'ın bazı Amerikalı Yahudi kuruluşlarının Soykırım'ı sömürdüğünü iddia eden kitabını tartışır; Yahudi Soykırımı'nın önemini azaltmadan, Finkelstein'a Kudüs ve Filistin meselesinde ABD'nin taraflılığı konusunda hak verir.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Norman Finkelstein', 'Soykırım', 'İsrail-Filistin', '3. Göz', '2000'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/2000/soykirim-somurusu/cover.png',
        alt: 'Milliyet, 8 Ağustos 2000, s. 24',
        pageLabel: 's. 24',
      },
    ],
  },
  {
    slug: '1915-tabusu',
    title: '1915 tabusu',
    date: '30 Eylül 2000',
    subtitle: 'Milliyet, 3. Göz, 30 Eylül 2000',
    excerpt:
      "1915'teki Ermeni tehcirinin tarihsel arka planını ve ölü sayısına dair farklı tahminleri özetler; 1915 olayları Türkiye'de tabu olmaya devam ettiği sürece toplumun konu hakkında sağlıklı düşünüp kalıcı bir çözüme ulaşamayacağını, çarenin serbest araştırma ve tartışmada olduğunu savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['1915', 'Ermeni tehciri', 'tarih tartışması', '3. Göz', '2000'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/2000/1915-tabusu/cover.jpg',
        alt: 'Milliyet, 30 Eylül 2000',
      },
    ],
  },
  {
    slug: 'seytana-uymak',
    title: "'Şeytan'a uymak'",
    date: '30 Kasım 2000',
    subtitle: 'Milliyet, 3. Göz, 30 Kasım 2000',
    excerpt:
      "Şerif Mardin'in 'özgün, aykırı fikir üretebilen yazar' kıtlığını iç sansüre bağlayan sözlerinden yola çıkarak, Türkiye'de resmi görüşleri sorgulayanların ağır ceza ve 'vatan hainliği' suçlamasıyla karşılaştığını; buna rağmen 'Şeytan'a uyup uçan' aydınların var olduğunu savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['Şerif Mardin', 'iç sansür', 'ifade özgürlüğü', '3. Göz', '2000'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/2000/seytana-uymak/cover.jpg',
        alt: 'Milliyet, 30 Kasım 2000',
      },
    ],
  },
  {
    slug: 'din-ile-bilim',
    title: 'Din ile bilim',
    date: '28 Aralık 2000',
    subtitle: 'Milliyet, 3. Göz, 28 Aralık 2000, s. 18',
    excerpt:
      "Jeolog Celal Şengör'ün Grönland'da yaşadığı bir deneyimden yola çıkarak dinin açıklayıcı, düzenleyici ve psikolojik işlevlerini tartışır; bilimin bulgularıyla çelişen dinsel açıklamaların geçersiz olduğunu, ama bilimin de insanın Tanrı'ya sığınma ihtiyacını hiçbir zaman gideremeyeceğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['din', 'bilim felsefesi', 'Celal Şengör', '3. Göz', '2000'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/2000/din-ile-bilim/cover.png',
        alt: 'Milliyet, 28 Aralık 2000, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'batidaki-catlak',
    title: "Batı'daki çatlak",
    date: '18 Ocak 2001',
    subtitle: 'Milliyet, 3. Göz, 18 Ocak 2001, s. 18',
    excerpt:
      "AB'nin kuracağı Acil Müdahale Gücü etrafında NATO içinde ABD, AB ve Türkiye arasında yaşanan güven bunalımını anlatır; Türkiye'nin güvenlik ihtiyacının da Kopenhag kriterlerini yerine getirip Avrupalı kimliğini kazanmayı gerektirdiğini savunur.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, 3. Göz köşesinden kupür.",
    tags: ['NATO', 'Avrupa Birliği', 'güvenlik politikası', '3. Göz', '2001'],
    pieceKind: 'column',
    clippings: [
      {
        src: '/archive/clippings/milliyet/2001/batidaki-catlak/cover.png',
        alt: 'Milliyet, 18 Ocak 2001, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'herkes-baskasinin-teroristini-hosgorme-egiliminde',
    title: "'Herkes başkasının teröristini hoşgörme eğiliminde'",
    date: '5 Nisan 1995',
    subtitle: "Milliyet, Entellektüel Bakış, 5 Nisan 1995, s. 18 — Andrew Mango ile söyleşi",
    excerpt:
      "Türkiye uzmanı İngiliz gazeteci ve yazar Andrew Mango ile PKK terörü, Kuzey Irak harekatı ve Türkiye'nin Kürt siyaseti üzerine söyleşi; Mango, herkesin başkasının teröristine karşı daha hoşgörülü davranma eğiliminde olduğunu, ama Türkiye'nin de Kürt meselesinde belirli bir politikadan yoksun olduğunu söylüyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Andrew Mango', 'PKK', 'Kuzey Irak', 'söyleşi', '1995'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/herkes-baskasinin-teroristini-hosgorme-egiliminde/cover.png',
        alt: 'Milliyet, 5 Nisan 1995, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'hizli-kalkinma-ozgurlukle-olur',
    title: "'Hızlı kalkınma özgürlükle olur'",
    date: '21 Nisan 1995',
    subtitle: "Milliyet, Entellektüel Bakış, 21 Nisan 1995, s. 20 — Cem Kozlu ile söyleşi",
    excerpt:
      "ANAP İstanbul milletvekili Cem Kozlu ile Asya kalkınma modelleri, ANAP'ın kimliği ve Kürt sorununa yaklaşımı üzerine söyleşi; Kozlu, Asya kaplanlarının başarısını girişim özgürlüğüne, TBMM'yi ise 'Türkiye'nin en verimsiz KİT'i' haline geldiğine bağlıyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Cem Kozlu', 'ANAP', 'kalkınma', 'söyleşi', '1995'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/hizli-kalkinma-ozgurlukle-olur/cover.png',
        alt: 'Milliyet, 21 Nisan 1995, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'cesitlilik-icinde-mumkun-birlik',
    title: "'Çeşitlilik içinde mümkün birlik'",
    date: '10 Temmuz 1995',
    subtitle: "Milliyet, Entellektüel Bakış, 10 Temmuz 1995, s. 16 — Dankwart A. Rustow ile söyleşi",
    excerpt:
      "Siyaset bilimci ve Ortadoğu uzmanı Dankwart A. Rustow ile Türk-Amerikan ilişkileri ve Avrupa bütünleşmesi üzerine söyleşi; Rustow, dünyayı birleştirenin Avrupalılar olduğunu, Avrupa kültürünün gücünün farklı kültürler arasındaki alışverişi kabul etmesinde yattığını anlatıyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Dankwart Rustow', 'Türk-Amerikan ilişkileri', 'söyleşi', '1995'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/cesitlilik-icinde-mumkun-birlik/cover.png',
        alt: 'Milliyet, 10 Temmuz 1995, s. 16',
        pageLabel: 's. 16',
      },
    ],
  },
  {
    slug: 'haklar-inanctan-once-gelir',
    title: "'Haklar, inançtan önce gelir'",
    date: '14 Ağustos 1995',
    subtitle: "Milliyet, Entellektüel Bakış, 14 Ağustos 1995, s. 20 — Abdülkerim Soruş ile söyleşi",
    excerpt:
      "'İslam'ın Martin Luther'i' diye anılan İranlı ilahiyatçı Abdülkerim Soruş ile İslam ve demokrasinin bağdaşabilirliği üzerine söyleşi; Soruş, insan haklarının dinsel metinlerden çıkarılamayacağını, bir mümin olabilmek için önce inanma hakkına sahip olunması gerektiğini savunuyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Abdülkerim Soruş', 'İslam', 'demokrasi', 'söyleşi', '1995'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/haklar-inanctan-once-gelir/cover.png',
        alt: 'Milliyet, 14 Ağustos 1995, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'etnik-ayristirma-tehlikeli-bir-oyun',
    title: "'Etnik ayrıştırma tehlikeli bir oyun'",
    date: '27 Kasım 1995',
    subtitle: "Milliyet, Entellektüel Bakış, 27 Kasım 1995, s. 22 — Göran Therborn ile söyleşi",
    excerpt:
      "Avrupa'nın önde gelen sosyal bilimcilerinden Göran Therborn ile modernizmin krizi, Yugoslavya'nın dağılması ve etnik siyaset üzerine söyleşi; Therborn, Yugoslavya ve SSCB'nin dağılmasından çıkarılacak dersin, azınlık haklarının barışçı müzakereyle tanınması, etnik ayrıştırmanın ise herkesin kaybettiği tehlikeli bir oyun olduğunu anlatıyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Göran Therborn', 'etnik siyaset', 'Avrupa', 'söyleşi', '1995'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1995/etnik-ayristirma-tehlikeli-bir-oyun/cover.png',
        alt: 'Milliyet, 27 Kasım 1995, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'duzeltmelerin-zamani-geldi',
    title: "'Düzeltmelerin zamanı geldi'",
    date: '22 Nisan 1996',
    subtitle: "Milliyet, Entellektüel Bakış, 22 Nisan 1996, s. 20 — Ahmet Arslan ile söyleşi",
    excerpt:
      "'Cumhuriyet, demokrasi ve kimlik' sempozyumu vesilesiyle Prof. Dr. Ahmet Arslan ile söyleşi; Arslan, Cumhuriyet'in temel değerlerinin yıkıcı bir eleştiriyle değil, ne ölçüde gerçekleştirilebildiği sorusuyla karşılaştığını, İslami kimlik, Kürt kimliği ve Alevi kimliği sorunlarının kaynağının Cumhuriyet dönemi uygulamalarında aranabileceğini anlatıyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Ahmet Arslan', 'kimlik siyaseti', 'söyleşi', '1996'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/duzeltmelerin-zamani-geldi/cover.png',
        alt: 'Milliyet, 22 Nisan 1996, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'turkiye-islamin-lideri-olmali',
    title: "'Türkiye İslam'ın lideri olmalı'",
    date: '9 Eylül 1996',
    subtitle: "Milliyet, Entellektüel Bakış, 9 Eylül 1996, s. 20 — Samuel P. Huntington ile söyleşi",
    excerpt:
      "'Uygarlıklar çatışması' kuramcısı Samuel P. Huntington ile söyleşi; Huntington, İslam uygarlığının hâlâ 'savaşan devletler' aşamasında olduğunu, bir lider ülkeden yoksun kaldığını, Türkiye'nin ekonomik gelişmişliği ve stratejik konumuyla bu lideri olabileceğini savunuyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Samuel Huntington', 'uygarlıklar çatışması', 'söyleşi', '1996'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/turkiye-islamin-lideri-olmali/cover.png',
        alt: 'Milliyet, 9 Eylül 1996, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'islam-laiklesebilir-mi',
    title: "'İslam laikleşebilir mi?'",
    date: '2 Aralık 1996',
    subtitle: "Milliyet, Entellektüel Bakış, 2 Aralık 1996, s. 20 — Sadık Celal El Azm ile söyleşi",
    excerpt:
      "Suriyeli filozof Sadık Celal El Azm ile söyleşi; El Azm, 'İslam laikleşebilir mi?' sorusunun 1798'de Napolyon'un Mısır'ı işgalinden bu yana Arap ve İslam düşüncesinin gündeminde olduğunu, dogma açısından cevabın 'hayır', tarih açısından ise 'evet' olduğunu anlatıyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Sadık Celal El Azm', 'İslam', 'laiklik', 'söyleşi', '1996'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/islam-laiklesebilir-mi/cover.png',
        alt: 'Milliyet, 2 Aralık 1996, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'mgk-anayasadan-cikmali',
    title: "'MGK anayasadan çıkmalı'",
    date: '30 Aralık 1996',
    subtitle: "Milliyet, Entellektüel Bakış, 30 Aralık 1996, s. 20 — Bülent Tanör ile söyleşi",
    excerpt:
      "Anayasa profesörü Bülent Tanör ile insan hakları üzerine söyleşi; Tanör, idam cezasını kaldıran Avrupa protokolünün onaylanması, yargısız infazların önlenmesi ve CMUK'un DGM suçlarına da uygulanması gerektiğini savunuyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Bülent Tanör', 'insan hakları', 'söyleşi', '1996'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1996/mgk-anayasadan-cikmali/cover.png',
        alt: 'Milliyet, 30 Aralık 1996, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'avrupa-turkiyenin-kadrini-bilmiyor',
    title: "'Avrupa Türkiye'nin kadrini bilmiyor'",
    date: '20 Ocak 1997',
    subtitle: "Milliyet, Entellektüel Bakış, 20 Ocak 1997, s. 20 — Francis Fukuyama ile söyleşi",
    excerpt:
      "'Tarihin Sonu' tezinin yazarı Francis Fukuyama ile söyleşi; Fukuyama, Avrupalıların Türkiye'nin Batı savunmasına ve demokrasiye katkısının kadrini bilmediğini, AB'nin tam üyelik konusunda açık bir niyet beyan etmemesinin Türkiye'ye kültürel açıdan güvenilmediğinin bir ifadesi olduğunu söylüyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Francis Fukuyama', 'Avrupa Birliği', 'söyleşi', '1997'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/avrupa-turkiyenin-kadrini-bilmiyor/cover.png',
        alt: 'Milliyet, 20 Ocak 1997, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'gelecege-umutla-bakiyorum',
    title: "'Geleceğe umutla bakıyorum'",
    date: '10 Şubat 1997',
    subtitle: "Milliyet, Entellektüel Bakış, 10 Şubat 1997, s. 18 — Şerafettin Elçi ile söyleşi",
    excerpt:
      "Demokratik Kitle Partisi genel başkanı Şerafettin Elçi ile Kürt sorunu üzerine söyleşi; Elçi, sorunun çözümünün Kürt kimliğinin yasal güvenceye kavuşturulması ve adem-i merkeziyetçi bir yönetim modelinden geçtiğini, HADEP'ten ideolojik olarak ayrıldıklarını anlatıyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Şerafettin Elçi', 'Kürt sorunu', 'Demokratik Kitle Partisi', 'söyleşi', '1997'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/gelecege-umutla-bakiyorum/cover.png',
        alt: 'Milliyet, 10 Şubat 1997, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'federasyon-disinda-cozum-olamaz',
    title: "'Federasyon dışında çözüm olamaz'",
    date: '10 Mart 1997',
    subtitle: "Milliyet, Entellektüel Bakış, 10 Mart 1997, s. 20 — Mehmet Ali Talat ile söyleşi",
    excerpt:
      "KKTC ana muhalefet partisi (CTP) lideri Mehmet Ali Talat ile Kıbrıs sorunu üzerine söyleşi; Talat, iki kesimli federasyon dışında bir çözümün mümkün olmadığını, Denktaş'ı desteklemeseler de onu Kıbrıs Türklerinin seçilmiş lideri olarak tanıdıklarını anlatıyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Mehmet Ali Talat', 'Kıbrıs sorunu', 'KKTC', 'söyleşi', '1997'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/federasyon-disinda-cozum-olamaz/cover.png',
        alt: 'Milliyet, 10 Mart 1997, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'turkiye-habercinin-cenneti',
    title: "'Türkiye habercinin cenneti'",
    date: '11 Nisan 1997',
    subtitle: "Milliyet, Entellektüel Bakış, 11 Nisan 1997, s. 22 — Stephen Kinzer ile söyleşi",
    excerpt:
      "The New York Times'ın İstanbul büro şefi Stephen Kinzer ile Türkiye'de gazetecilik üzerine söyleşi; Kinzer, Türk basınında köşe yazarlarının rolünün ABD'ye kıyasla çok daha büyük olduğunu, Türkiye'nin dünyada sesini duyurabilmiş bir ülke olmadığını anlatıyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Stephen Kinzer', 'The New York Times', 'gazetecilik', 'söyleşi', '1997'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/turkiye-habercinin-cenneti/cover.png',
        alt: 'Milliyet, 11 Nisan 1997, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'demokrasi-batili-degildir',
    title: "Demokrasi, Batılı değildir",
    date: '29 Mayıs 1997',
    subtitle: "Milliyet, Entellektüel Bakış, 29 Mayıs 1997, s. 20 — Leonard Binder ile söyleşi",
    excerpt:
      "İslam toplumları üzerine araştırmalarıyla tanınan Leonard Binder ile İslam ve demokrasi üzerine söyleşi; Binder, demokrasinin evrensel bir kavram olduğunu, İslam'ın liberal ya da otoriter yorumlarına göre demokratik ya da otoriter bir topluma varılabileceğini anlatıyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Leonard Binder', 'İslam', 'demokrasi', 'söyleşi', '1997'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/demokrasi-batili-degildir/cover.png',
        alt: 'Milliyet, 29 Mayıs 1997, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'cogulcu-islama-donmeliyiz',
    title: "'Çoğulcu İslam'a dönmeliyiz'",
    date: '6 Haziran 1997',
    subtitle: "Milliyet, Entellektüel Bakış, 6 Haziran 1997, s. 20 — Hassan Hanafi ile söyleşi",
    excerpt:
      "'Liberal İslam' akımının temsilcilerinden Mısırlı felsefeci Hassan Hanafi ile söyleşi; Hanafi, İslam'ın çoğulcu bir din olduğunu, İslamcılığın temellerinin 11. yüzyılda ortaya çıkan tekçi ve dogmatik bir anlayışa dayandığını, büyük bir tarihi reform hareketi başlatılması gerektiğini savunuyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Hassan Hanafi', 'İslam', 'liberal İslam', 'söyleşi', '1997'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/cogulcu-islama-donmeliyiz/cover.png',
        alt: 'Milliyet, 6 Haziran 1997, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'ekonomik-dev-siyasi-cuce',
    title: "'Ekonomik dev siyasi cüce'",
    date: '16 Haziran 1997',
    subtitle: "Milliyet, Entellektüel Bakış, 16 Haziran 1997, s. 20 — Nicole ve Hugh Pope ile söyleşi",
    excerpt:
      "'Örtünün Altındaki Türkiye' kitabının yazarları Nicole ve Hugh Pope ile söyleşi; Pope çifti, çok farklılaşmış bir toplum olan Türkiye'nin herhangi bir ideolojik gücün egemenliği altına girebileceğine ihtimal vermediklerini, Türkiye'nin ekonomik dev ama siyasi cüce olduğunu anlatıyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Nicole Pope', 'Hugh Pope', 'Türkiye siyaseti', 'söyleşi', '1997'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/ekonomik-dev-siyasi-cuce/cover.png',
        alt: 'Milliyet, 16 Haziran 1997, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'avrupa-kaplani-olurduk',
    title: "'Avrupa kaplanı' olurduk",
    date: '23 Haziran 1997',
    subtitle: "Milliyet, Entellektüel Bakış, 23 Haziran 1997, s. 22 — Asım Erdilek ile söyleşi",
    excerpt:
      "İktisatçı Prof. Dr. Asım Erdilek ile Türkiye ekonomisi üzerine söyleşi; Erdilek, Türk ekonomisinin devlet kıskacından kurtulabilseydi 'Avrupa kaplanı' olabileceğini, kronik enflasyonun hiperenflasyona dönüşmemesinin bile Türkiye için köklü bir istikrar programını geciktirdiği için kötü olduğunu savunuyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Asım Erdilek', 'Türkiye ekonomisi', 'söyleşi', '1997'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/avrupa-kaplani-olurduk/cover.png',
        alt: 'Milliyet, 23 Haziran 1997, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'kalkinmanin-sarti-hukuk-devleti',
    title: "'Kalkınmanın şartı hukuk devleti'",
    date: '7 Temmuz 1997',
    subtitle: "Milliyet, Entellektüel Bakış, 7 Temmuz 1997, s. 16 — Jeffrey Sachs ile söyleşi",
    excerpt:
      "Harvard Üniversitesi Uluslararası Kalkınma Enstitüsü direktörü Jeffrey Sachs ile kalkınma iktisadı üzerine söyleşi; Sachs, gümrük birliğinin Türkiye için yararlı olduğunu ama ekonomisini tümüyle AB'yle uyumlu hale getirmesinin gerekmediğini, kalkınmanın şartının hukuk devleti olduğunu savunuyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Jeffrey Sachs', 'kalkınma iktisadı', 'söyleşi', '1997'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/kalkinmanin-sarti-hukuk-devleti/cover.png',
        alt: 'Milliyet, 7 Temmuz 1997, s. 16',
        pageLabel: 's. 16',
      },
    ],
  },
  {
    slug: 'refah-kapatilmamali',
    title: "'Refah kapatılmamalı'",
    date: '14 Temmuz 1997',
    subtitle: "Milliyet, Entellektüel Bakış, 14 Temmuz 1997, s. 20 — Binnaz Toprak ile söyleşi",
    excerpt:
      "Milli Görüş hareketi üzerine araştırmalarıyla tanınan Prof. Dr. Binnaz Toprak ile söyleşi; Toprak, RP'nin bir İslam devleti kurmak istemediğini, Türkiye'nin yetmiş yıllık laik yaşam tarzı tecrübesinin buna zaten elverişli olmadığını, RP'nin yükselişinin dinin değil sınıfsal dışlanmışlığın bir göstergesi olduğunu savunuyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Binnaz Toprak', 'Refah Partisi', 'Milli Görüş', 'söyleşi', '1997'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/refah-kapatilmamali/cover.png',
        alt: 'Milliyet, 14 Temmuz 1997, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'sol-islamla-barismali',
    title: "'Sol, İslam'la barışmalı'",
    date: '4 Ağustos 1997',
    subtitle: "Milliyet, Entellektüel Bakış, 4 Ağustos 1997, s. 18 — Ziya Öniş ile söyleşi",
    excerpt:
      "Prof. Dr. Ziya Öniş ile Refah Partisi'nin yükselişi üzerine söyleşi; Öniş, RP'nin yükselişinin globalleşmenin bir ürünü olduğunu, globalleşmeden hem kazanan hem kaybeden kesimleri İslam çatısı altında birleştirdiğini anlatıyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Ziya Öniş', 'Refah Partisi', 'globalleşme', 'söyleşi', '1997'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/sol-islamla-barismali/cover.png',
        alt: 'Milliyet, 4 Ağustos 1997, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'biyografik-politika',
    title: "'Biyografik' politika",
    date: '7 Kasım 1997',
    subtitle: 'Milliyet, Entellektüel Bakış, 7 Kasım 1997, s. 22',
    excerpt:
      "Polonya'da eski komünistlerin oy artışına rağmen son seçimleri kaybetmesini konu alan bir analiz; Polonya'daki ana siyasi bölünmenin 'Katolikler-Laikler' değil, anti-komünistlerle reforme olmuş eski komünistler arasındaki 'biyografik politika' olduğunu, muhalif Adam Michnik'in Polonya'yı artık 'tam anlamıyla bir demokrasi' saydığını anlatır.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Polonya', 'Adam Michnik', 'demokratikleşme', 'söyleşi', '1997'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/biyografik-politika/cover.png',
        alt: 'Milliyet, 7 Kasım 1997, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'nufus-tespiti-kaynak-israfi',
    title: "Nüfus tespiti kaynak israfı",
    date: '8 Aralık 1997',
    subtitle: "Milliyet, Entellektüel Bakış, 8 Aralık 1997, s. 22 — Cem Behar ile söyleşi",
    excerpt:
      "Demograf Prof. Dr. Cem Behar ile 30 Kasım'da yapılan 'nüfus tespiti' üzerine söyleşi; Behar, bunun gerçek bir sayım olmadığını, yalnızca seçim çevrelerine milletvekilliği sayısı belirlemeye yarayacağını, nüfus hakkında anlamlı bilgi toplama amacı açısından bir kaynak israfı olduğunu savunuyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Cem Behar', 'nüfus sayımı', 'demografi', 'söyleşi', '1997'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1997/nufus-tespiti-kaynak-israfi/cover.png',
        alt: 'Milliyet, 8 Aralık 1997, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'ronesans-bize-de-gerekli',
    title: 'Rönesans bize de gerekli',
    date: '9 Ekim 1998',
    subtitle: "Milliyet, Entellektüel Bakış, 9 Ekim 1998, s. 22 — Ümit Cizre Sakallıoğlu ile söyleşi",
    excerpt:
      "Sivil-asker ilişkileri araştırmacısı Ümit Cizre Sakallıoğlu ile söyleşi; Sakallıoğlu, Soğuk Savaş'ın ardından dünyada orduların misyonunun yeniden tartışmaya açıldığı bir 'mini rönesans' yaşandığını, bu rönesansın Türkiye'ye de gerekli olduğunu anlatıyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Ümit Cizre Sakallıoğlu', 'asker-sivil ilişkileri', 'söyleşi', '1998'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1998/ronesans-bize-de-gerekli/cover.png',
        alt: 'Milliyet, 9 Ekim 1998, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'uzlasma-esitliktedir',
    title: 'Uzlaşma eşitliktedir',
    date: '25 Ocak 1999',
    subtitle: "Milliyet, Entellektüel Bakış, 25 Ocak 1999, s. 18 — Rauf Denktaş ile söyleşi",
    excerpt:
      "KKTC Cumhurbaşkanı Rauf Denktaş ile Lefkoşa'daki Cumhurbaşkanlığı konutunda yapılan söyleşi; Denktaş, Kıbrıs sorununun çözümünün ancak iki toplum arasında eşitlik temelinde bir uzlaşmayla mümkün olduğunu, konfederasyon koşuluyla AB üyeliğine hazır olduklarını anlatıyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Rauf Denktaş', 'Kıbrıs sorunu', 'KKTC', 'söyleşi', '1999'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1999/uzlasma-esitliktedir/cover.png',
        alt: 'Milliyet, 25 Ocak 1999, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'bizim-icin-turkiye-adaydir',
    title: "'Bizim için Türkiye adaydır'",
    date: '3 Şubat 1999',
    subtitle: "Milliyet, Entellektüel Bakış, 3 Şubat 1999, s. 20 — Joschka Fischer ile söyleşi",
    excerpt:
      "AB dönem başkanı Almanya Dışişleri Bakanı Joschka Fischer'in Milliyet'e verdiği özel mülakat; Fischer, Türkiye'yi bölgesindeki en önemli ortaklarından biri olarak gördüklerini, Lüksemburg zirvesinde Türkiye'nin adaylar dışında bırakılmasının büyük bir hata olduğunu söylüyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Joschka Fischer', 'Avrupa Birliği', 'Almanya', 'söyleşi', '1999'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1999/bizim-icin-turkiye-adaydir/cover.png',
        alt: 'Milliyet, 3 Şubat 1999, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'turkler-alman-olmasin',
    title: "'Türkler Alman olmasın'",
    date: '10 Şubat 1999',
    subtitle: "Milliyet, Entellektüel Bakış, 10 Şubat 1999, s. 22 — Theo Sommer ile söyleşi",
    excerpt:
      "Die Zeit'ın başyazarı Theo Sommer ile Almanya'daki Türkler üzerine söyleşi; Sommer, Hıristiyan Demokratların çifte vatandaşlığa değil Türklerin Alman olmasına karşı olduğunu, Türklerin kendi kültürleriyle Almanya'yı zenginleştirdiğini savunuyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Theo Sommer', 'Almanya', 'göç', 'söyleşi', '1999'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1999/turkler-alman-olmasin/cover.png',
        alt: 'Milliyet, 10 Şubat 1999, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'isi-strasbourga-birakmayin',
    title: "'İşi Strasbourg'a bırakmayın'",
    date: '9 Mart 1999',
    subtitle: "Milliyet, Entellektüel Bakış, 9 Mart 1999, s. 20 — Luzius Wildhaber ile söyleşi",
    excerpt:
      "Avrupa İnsan Hakları Mahkemesi'nin yeni başkanı Yargıç Luzius Wildhaber ile söyleşi; Wildhaber, Loizidou kararının siyasi değil hukuki olduğunu savunuyor, Türkiye'nin insan hakları sorunlarını Strasbourg'a bırakmadan kendi içinde çözmesi gerektiğini anlatıyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Luzius Wildhaber', 'AİHM', 'Loizidou davası', 'söyleşi', '1999'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1999/isi-strasbourga-birakmayin/cover.png',
        alt: 'Milliyet, 9 Mart 1999, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'ayni-bakis-farkli-tavir',
    title: 'Aynı bakış, farklı tavır',
    date: '31 Mart 1999',
    subtitle: "Milliyet, Entellektüel Bakış, 31 Mart 1999, s. 18 — Eric Rouleau ile söyleşi",
    excerpt:
      "Fransız gazeteci ve eski Ankara büyükelçisi Eric Rouleau ile ABD ve AB'nin Türkiye'ye yaklaşımı üzerine söyleşi; Rouleau, Amerikalılarla Avrupalıların Türkiye'nin demokratikleşmesi gerektiği konusunda hemfikir olduğunu, ama bunu farklı tavırlarla ifade ettiklerini anlatıyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Eric Rouleau', 'ABD', 'Avrupa Birliği', 'söyleşi', '1999'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1999/ayni-bakis-farkli-tavir/cover.png',
        alt: 'Milliyet, 31 Mart 1999, s. 18',
        pageLabel: 's. 18',
      },
    ],
  },
  {
    slug: 'ataturk-demokrasinin-kurumlarini-getirdi',
    title: 'Atatürk demokrasinin kurumlarını getirdi',
    date: '20 Ekim 1999',
    subtitle: "Milliyet, Entellektüel Bakış, 20 Ekim 1999, s. 20 — Andrew Mango ile söyleşi",
    excerpt:
      "Yeni yayımlanan 'Atatürk' biyografisinin yazarı Andrew Mango ile söyleşi; Mango, Atatürk'ün muhaliflerinin aslında demokrasiden çok oligarşi peşinde olduğunu, reformların o dönemde seçimle yapılamayacağını, Atatürk'ün buna rağmen demokrasinin kurumlarını getirdiğini savunuyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Andrew Mango', 'Atatürk', 'söyleşi', '1999'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1999/ataturk-demokrasinin-kurumlarini-getirdi/cover.png',
        alt: 'Milliyet, 20 Ekim 1999, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'ders-kitaplari-ayiklanmali',
    title: 'Ders kitapları ayıklanmalı',
    date: '27 Ekim 1999',
    subtitle: "Milliyet, Entellektüel Bakış, 27 Ekim 1999, s. 22 — Richard Clogg ile söyleşi",
    excerpt:
      "Oxford Üniversitesi'nden tarihçi Richard Clogg ile Türk-Yunan ilişkileri üzerine söyleşi; Clogg, kalıcı dostluğun yolunun her iki ülkede de milliyetçi önyargılar taşıyan ders kitaplarının ayıklanmasından geçtiğini anlatıyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Richard Clogg', 'Türk-Yunan ilişkileri', 'söyleşi', '1999'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1999/ders-kitaplari-ayiklanmali/cover.png',
        alt: 'Milliyet, 27 Ekim 1999, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'ataturkun-dusu-bati-uyeligiydi',
    title: "Atatürk'ün düşü, Batı üyeliğiydi...",
    date: '10 Kasım 1999',
    subtitle: "Milliyet, Entellektüel Bakış, 10 Kasım 1999, s. 20 — Orhan Pamuk ile söyleşi",
    excerpt:
      "Yazar Orhan Pamuk'la Atatürk, siyaset ve Avrupa üzerine söyleşi; Pamuk, Türk modernleşmesinin son 200 yılını olumlu değerlendirdiğini, Atatürk'ün büyük düşünün Türkiye'nin Batı uygarlığının bir parçası olması olduğunu, bugünkü AB üyeliği çabasının da bu düşün devamı sayılabileceğini anlatıyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Orhan Pamuk', 'Atatürk', 'Avrupa Birliği', 'söyleşi', '1999'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/1999/ataturkun-dusu-bati-uyeligiydi/cover.png',
        alt: 'Milliyet, 10 Kasım 1999, s. 20',
        pageLabel: 's. 20',
      },
    ],
  },
  {
    slug: 'ekonomide-devlet-gerekli',
    title: 'Ekonomide devlet gerekli',
    date: '11 Şubat 2000',
    subtitle: "Milliyet, Entellektüel Bakış, 11 Şubat 2000, s. 22 — Ayşe Buğra ile söyleşi",
    excerpt:
      "Kişisel ilişki ağlarının ekonomideki rolünü araştıran Prof. Dr. Ayşe Buğra ile söyleşi; Buğra, Türkiye'de devletin konut ve tüketici kredisi gibi alanları düzenlemeyişinin, aile ve hemşehri dayanışmasından gecekondu mafyasına uzanan gayrı resmi ilişki ağlarının yerini doldurduğunu, herkesin uyması gereken kuralları koyan bir devletin gerekli olduğunu anlatıyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Ayşe Buğra', 'devlet-piyasa ilişkisi', 'söyleşi', '2000'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/2000/ekonomide-devlet-gerekli/cover.png',
        alt: 'Milliyet, 11 Şubat 2000, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'ab-yuruyecegine-kosuyor',
    title: "AB yürüyeceğine koşuyor",
    date: '22 Mart 2000',
    subtitle: "Milliyet, Entellektüel Bakış, 22 Mart 2000, s. 22 — Norman Stone ile söyleşi",
    excerpt:
      "Oxford'dan Bilkent'e taşınan Rusya tarihçisi Norman Stone ile Rusya, Avrupa ve Türkiye üzerine söyleşi; Stone, Türkiye'nin AB dışındaki seçenekleri de açık tutması gerektiğini, AB bütünleşmesinin kendi yapısı gereği yürüyeceğine koşacak kadar hızlı ilerleyemeyeceğini savunuyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Norman Stone', 'Rusya', 'Avrupa Birliği', 'söyleşi', '2000'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/2000/ab-yuruyecegine-kosuyor/cover.png',
        alt: 'Milliyet, 22 Mart 2000, s. 22',
        pageLabel: 's. 22',
      },
    ],
  },
  {
    slug: 'siddet-tesvik-edilemez',
    title: 'Şiddet teşvik edilemez',
    date: '31 Mart 2000',
    subtitle: "Milliyet, Entellektüel Bakış, 31 Mart 2000, s. 24 — Rıza Türmen ile söyleşi",
    excerpt:
      "AİHM Türk yargıcı Dr. Rıza Türmen ile ifade özgürlüğünün sınırları üzerine söyleşi; Türmen, AİHM içtihadına göre ifade özgürlüğünün sınırının iftira, hakaret, şiddete teşvik ve tahrik olduğunu, 'Kürt devleti' ya da 'din devleti' savunmanın tek başına bu sınırı aşmadığını anlatıyor.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Rıza Türmen', 'AİHM', 'ifade özgürlüğü', 'söyleşi', '2000'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/2000/siddet-tesvik-edilemez/cover.png',
        alt: 'Milliyet, 31 Mart 2000, s. 24',
        pageLabel: 's. 24',
      },
    ],
  },
  {
    slug: 'mikrasiates',
    title: "'Mikrasiates'",
    date: '4 Kasım 2000',
    subtitle: 'Milliyet, Entellektüel Bakış, 4 Kasım 2000, s. 26',
    excerpt:
      "Oxford antropoloji profesörü Renée Hirschon'un Pire'ye yerleşmiş Anadolu Rumları ('Mikrasiates') üzerine araştırmasının Türkçe çevirisini ('Mübadele Çocukları') tanıtan bir yazı; Hirschon'un araştırmasına göre Anadolu'daki yaşamlarına dair anıları olumlu olan mültecilerin, sorunların halklar arası nefretten değil politikacılardan kaynaklandığını düşündüklerini aktarır.",
    sourceNote: "Şahin Alpay'ın kişisel arşivinden, Entellektüel Bakış sayfasından kupür.",
    tags: ['Renée Hirschon', 'mübadele', 'Anadolu Rumları', 'söyleşi', '2000'],
    pieceKind: 'interview',
    clippings: [
      {
        src: '/archive/clippings/milliyet/2000/mikrasiates/cover.png',
        alt: 'Milliyet, 4 Kasım 2000, s. 26',
        pageLabel: 's. 26',
      },
    ],
  },
]
