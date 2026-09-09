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
