import type { ArchiveItemSeed } from '../../types'

/** Medyascope, 2025- . An online outlet, so these entries link out to the
 *  piece on medyascope.tv rather than reproducing it: no body text and no
 *  clipping, which is what makes `archiveLink()` send a reader to the source.
 *
 *  Medyascope titles his pieces "Şahin Alpay yazdı: …"; that prefix is the
 *  site's own byline convention, not part of the title, so it is dropped here
 *  as it is for the rest of the archive.
 */
export const medyascopeColumnSeeds: ArchiveItemSeed[] = [
  {
    slug: '20-yuzyilda-rusyada-ne-oldu-ve-bitti',
    title: '20. yüzyılda Rusya’da ne oldu ve bitti?',
    date: '16 Mart 2026',
    url: 'https://medyascope.tv/2026/03/16/sahin-alpay-yazdi-20-yuzyilda-rusyada-ne-oldu-ve-bitti/',
    excerpt:
      'Taha Akyol’un Dünyayı Bölen Devrim: Sovyet Sosyalizminin Yükselişi ve Çöküşü kitabını tanıtır; Lenin ve yandaşlarının Çarlık Rusyası’nda iktidarı nasıl ele geçirdiğini, Doğu Avrupa’da Marxist-Leninist rejimlerin nasıl kurulduğunu ve refah ile eşitlik vaatlerini yerine getiremeyen bu rejimlerin neden içten çöktüğünü sorar.',
    tags: ['Taha Akyol', 'Sovyetler Birliği', 'Marxizm-Leninizm', 'kitap tanıtımı', '2026'],
    pieceKind: 'column',
  },
  {
    slug: 'bir-turk-ermeni-ask-hikayesi',
    title: 'Bir Türk-Ermeni aşk hikâyesi',
    date: '5 Mart 2026',
    url: 'https://medyascope.tv/2026/03/05/bir-turk-ermeni-ask-hikayesi-sahin-alpay-yazdi/',
    excerpt:
      'Ahmet Altan’ın O Yıl romanından yola çıkar: Tehcir’in ortasında yaralı Osmanlı subayı Ragıp ile Ermeni hemşire Efronya arasında geçen aşk hikâyesini anlatır, milliyetçilikler çağının geride kalmasını savunur ve 2021’den bu yana Türkiye-Ermenistan ilişkilerinde atılan adımları sıralayarak uzlaşma umudunu tazelediğini yazar.',
    tags: ['Ahmet Altan', 'Ermeni meselesi', 'Tehcir', 'Türkiye-Ermenistan ilişkileri', 'milliyetçilik', '2026'],
    pieceKind: 'column',
  },
  {
    slug: 'cesur-yeni-dunya',
    title: 'Cesur Yeni Dünya',
    date: '1 Haziran 2025',
    url: 'https://medyascope.tv/2025/06/01/sahin-alpay-yazdi-cesur-yeni-dunya/',
    excerpt:
      'Önce sosyalizmin, sonra liberal demokrasinin er geç bütün dünyada benimseneceğine duyduğu inancın 2010’lardan itibaren nasıl dağıldığını anlatır; liberal demokrasinin en iyi yönetim biçimi olduğu kanaatini koruduğunu ama artık determinizme itibar etmediğini, Dördüncü Sanayi Devrimi ile çok kutuplulaşan dünyanın gidişatının öngörülemez olduğunu savunur.',
    tags: ['liberal demokrasi', 'Francis Fukuyama', 'globalleşme', 'Dördüncü Sanayi Devrimi', 'determinizm', '2025'],
    pieceKind: 'column',
  },
]
