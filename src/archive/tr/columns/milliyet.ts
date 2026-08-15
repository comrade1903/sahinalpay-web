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
]
