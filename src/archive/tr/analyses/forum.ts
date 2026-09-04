import type { ArchiveItemSeed } from '../../types'

/** Forum, 1968. The magazine's "Olaylar Karşısında" pages run as two
 *  standing sections — "İçte" for domestic events, "Dışta" for foreign —
 *  each carrying its own signature under the headline rather than a byline
 *  per item. In both issues here the İçte section is signed, in that
 *  position, "doğu perinçek / şahin alpay".
 *
 *  Pages are the printed page numbers, and they are not always contiguous:
 *  in issue 338 the section opens on page 2 and resumes on page 4, because
 *  page 3 carries a piece by Aziz Nesin.
 *
 *  Each issue's pages also carry other writers' work that the section
 *  signature does not cover, and which is therefore not claimed for him:
 *  the unsigned "Türk-İş" essay in the right-hand column of 338's page 4
 *  (running on to page 5), and Hamdi Konur's boxed "Seçim Güvenliği" in the
 *  middle of 339's page 3.
 *
 *  Scans are the full issue, so the source PDF is linked rather than re-cut.
 */
export const forumAnalysisSeeds: ArchiveItemSeed[] = [
  {
    slug: 'forum-338-turk-is',
    title: 'Türk-iş',
    date: '1 Mayıs 1968',
    subtitle: 'Forum, sayı 338, 1 Mayıs 1968, s. 2 ve 4',
    excerpt:
      'Derginin "Olaylar Karşısında" bölümünün yurtiçi kısmı: Türk-İş\'in Yedinci Genel Kurulu ve "partilerüstü sendikacılık" tutumu, 29 Nisan\'ın sekizinci yılında Devrimciler Güçbirliği, yabancı sermayede monopolleşme eğilimleri, Ordu Yardımlaşma Kurumu\'nun yabancı sermayeyle ortaklıkları ve milli savaş sanayii tartışması.',
    sourceNote:
      'Orijinal kaynak: TÜSTAV — Türkiye Sosyal Tarih Araştırma Vakfı, Forum, sayı 338, 1 Mayıs 1968. Yazı, derginin "İçte" bölümünde Doğu Perinçek ile ortak imzayla yayımlanmıştır; imza başlığın altında bölümün tamamı için verilmiştir. Kapak görüntüsü ve sayfa numaraları sayının tam taramasından alınmıştır.',
    url: 'https://filedn.eu/lpwTKmJuSKCLNjzDCWvh2dm/forum/Forum_Say%C4%B1.338_1.May%C4%B1s.1968.pdf',
    pdfSrc:
      'https://filedn.eu/lpwTKmJuSKCLNjzDCWvh2dm/forum/Forum_Say%C4%B1.338_1.May%C4%B1s.1968.pdf',
    tags: [
      'Türk-İş',
      'sendikacılık',
      'işçi sınıfı',
      'Devrimciler Güçbirliği',
      'yabancı sermaye',
      'Ordu Yardımlaşma Kurumu',
      'milli savaş sanayii',
      '1968',
    ],
    clippings: [
      {
        src: '/archive/clippings/forum/1968/turk-is/cover.webp',
        alt: 'Forum, sayı 338, 1 Mayıs 1968 — kapak',
        pageLabel: 'Kapak · yazı s. 2 ve 4',
      },
    ],
  },
  {
    slug: 'forum-339-gucbirligine-dogru-ilk-adim',
    title: 'Güçbirliğine Doğru İlk Adım',
    date: '15 Mayıs 1968',
    subtitle: 'Forum, sayı 339, 15 Mayıs 1968, s. 2 ve 3',
    excerpt:
      'Derginin "Olaylar Karşısında" bölümünün yurtiçi kısmı: Türkiye Devrimci Güçbirliği\'nin 29 Nisan Mitingi ve güçbirliğinin sınıflararası ittifak olarak yanlış tanımlanma tehlikesi, yaklaşan seçimler ve anti-emperyalist cephe tartışması, Anayasa Mahkemesi\'nin barajlı d\'Hondt sistemini iptal eden 7 Mayıs 1968 kararı, 27 Mayıs ile 1961 Anayasası\'nın değerlendirmesi ve toplumculara düşen görev.',
    sourceNote:
      'Orijinal kaynak: TÜSTAV — Türkiye Sosyal Tarih Araştırma Vakfı, Forum, sayı 339, 15 Mayıs 1968. Yazı, derginin "İçte" bölümünde Doğu Perinçek ile ortak imzayla yayımlanmıştır; imza başlığın altında bölümün tamamı için verilmiştir. Kapak görüntüsü ve sayfa numaraları sayının tam taramasından alınmıştır.',
    url: 'https://filedn.eu/lpwTKmJuSKCLNjzDCWvh2dm/forum/Forum_Say%C4%B1.339_15.May%C4%B1s.1968.pdf',
    pdfSrc:
      'https://filedn.eu/lpwTKmJuSKCLNjzDCWvh2dm/forum/Forum_Say%C4%B1.339_15.May%C4%B1s.1968.pdf',
    tags: [
      'Devrimciler Güçbirliği',
      '29 Nisan Mitingi',
      'anti-emperyalist cephe',
      'seçimler',
      'Anayasa Mahkemesi',
      "d'Hondt",
      '27 Mayıs',
      '1968',
    ],
    clippings: [
      {
        src: '/archive/clippings/forum/1968/gucbirligine-dogru-ilk-adim/cover.webp',
        alt: 'Forum, sayı 339, 15 Mayıs 1968 — kapak',
        pageLabel: 'Kapak · yazı s. 2 ve 3',
      },
    ],
  },
]
