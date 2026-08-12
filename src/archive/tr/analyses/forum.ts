import type { ArchiveItemSeed } from '../../types'

/** Forum, 1968. The magazine's "Olaylar Karşısında" pages run as two
 *  standing sections — "İçte" for domestic events, "Dışta" for foreign —
 *  each carrying its own signature under the headline rather than a byline
 *  per item. The İçte section of issue 338 is signed, in that position,
 *  "doğu perinçek / şahin alpay".
 *
 *  Pages here are the printed page numbers, and they are not contiguous:
 *  the İçte section opens on page 2 and resumes on page 4 because page 3
 *  carries a piece by Aziz Nesin. Page 4 also holds a longer unsigned
 *  "Türk-İş" essay in its right-hand column that runs on to page 5; it sits
 *  outside the signed section and is not claimed for him here.
 *
 *  Scans are the full issue, so they carry other writers' work alongside
 *  his — the source PDF is linked rather than re-cut.
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
      'Forum, sayı 338, 1 Mayıs 1968. Yazı, derginin "İçte" bölümünde Doğu Perinçek ile ortak imzayla yayımlanmıştır; imza başlığın altında bölümün tamamı için verilmiştir. Kapak görüntüsü ve sayfa numaraları sayının tam taramasından alınmıştır.',
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
        src: '/archive/clippings/forum/1968/turk-is/cover.jpg',
        alt: 'Forum, sayı 338, 1 Mayıs 1968 — kapak',
        pageLabel: 'Kapak · yazı s. 2 ve 4',
      },
    ],
  },
]
