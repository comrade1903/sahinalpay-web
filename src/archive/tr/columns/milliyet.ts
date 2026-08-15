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
]
