import type { ArchiveItemSeed } from '../../types'

/** Medyascope, 2025- . Where he writes now. The pieces are published
 *  here in full, as the P24 ones are, with the photographs they ran
 *  with and a link back to the original.
 *
 *  Medyascope titles his pieces "Şahin Alpay yazdı: …"; that prefix is
 *  the site's own byline convention, not part of the title, so it is
 *  dropped here as it is for the rest of the archive. The pieces carry
 *  no dek on medyascope.tv, so these entries carry none either.
 *
 *  Body text lives in ./medyascope.body.ts (see bodyRegistry.ts).
 */
export const medyascopeColumnSeeds: ArchiveItemSeed[] = [
  {
    slug: '20-yuzyilda-rusyada-ne-oldu-ve-bitti',
    title: '20. yüzyılda Rusya’da ne oldu ve bitti?',
    date: '16 Mart 2026',
    url: 'https://medyascope.tv/2026/03/16/sahin-alpay-yazdi-20-yuzyilda-rusyada-ne-oldu-ve-bitti/',
    tags: ['Taha Akyol', 'Sovyetler Birliği', 'Marxizm-Leninizm', 'kitap tanıtımı', '2026'],
    pieceKind: 'column',
    hasBody: true,
    clippings: [
      {
        src: '/archive/clippings/medyascope/2026/20-yuzyilda-rusyada-ne-oldu-ve-bitti/image-1.webp',
        alt: 'Lenin, 20. yüzyılda Rusya\'da ne oldu ve bitti?',
        kind: 'photo',
      },
    ],
  },
  {
    slug: 'bir-turk-ermeni-ask-hikayesi',
    title: 'Bir Türk-Ermeni aşk hikâyesi',
    date: '5 Mart 2026',
    url: 'https://medyascope.tv/2026/03/05/bir-turk-ermeni-ask-hikayesi-sahin-alpay-yazdi/',
    tags: ['Ahmet Altan', 'Ermeni meselesi', 'Tehcir', 'Türkiye-Ermenistan ilişkileri', 'milliyetçilik', '2026'],
    pieceKind: 'column',
    hasBody: true,
    clippings: [
      {
        src: '/archive/clippings/medyascope/2026/bir-turk-ermeni-ask-hikayesi/image-1.webp',
        alt: 'Bir Türk-Ermeni aşk hikâyesi',
        kind: 'photo',
      },
    ],
  },
  {
    slug: 'cesur-yeni-dunya',
    title: 'Cesur Yeni Dünya',
    date: '1 Haziran 2025',
    url: 'https://medyascope.tv/2025/06/01/sahin-alpay-yazdi-cesur-yeni-dunya/',
    tags: ['liberal demokrasi', 'Francis Fukuyama', 'globalleşme', 'Dördüncü Sanayi Devrimi', 'determinizm', '2025'],
    pieceKind: 'column',
    hasBody: true,
    clippings: [
      {
        src: '/archive/clippings/medyascope/2025/cesur-yeni-dunya/image-1.webp',
        alt: 'Cesur Yeni Dünya',
        kind: 'photo',
      },
      {
        src: '/archive/clippings/medyascope/2025/cesur-yeni-dunya/image-2.webp',
        alt: 'Cesur Yeni Dünya',
        kind: 'photo',
      },
      {
        src: '/archive/clippings/medyascope/2025/cesur-yeni-dunya/image-3.webp',
        alt: 'Cesur Yeni Dünya',
        kind: 'photo',
      },
      {
        src: '/archive/clippings/medyascope/2025/cesur-yeni-dunya/image-4.webp',
        alt: 'Cesur Yeni Dünya',
        kind: 'photo',
      },
      {
        src: '/archive/clippings/medyascope/2025/cesur-yeni-dunya/image-5.webp',
        alt: 'Cesur Yeni Dünya',
        kind: 'photo',
      },
    ],
  },
]
