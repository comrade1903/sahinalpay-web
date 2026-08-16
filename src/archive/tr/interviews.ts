import type { ArchiveItemSeed } from '../types'

/** Söyleşiler. Broadcast conversations rather than print interviews, so each
 *  entry links out to the publisher's own page — the recording is theirs and
 *  is not mirrored here.
 *
 *  The first three below all follow the two volumes of his memoirs (Bir
 *  Hikâyem Var, Hikâyemin Sonu); the interviewer is named in `subtitle`
 *  because the archive has no separate field for one. Where a video isn't
 *  credited to a named interviewer (or, for the KHK TV piece below, isn't an
 *  interview at all but a tribute essay presented on video), `subtitle`
 *  names only the venue rather than inventing one.
 */
export const interviewSeeds: ArchiveItemSeed[] = [
  {
    slug: 'bir-hikayem-var-medyascope-2024',
    title: 'Bir Hikâyem Var',
    date: '25 Kasım 2024',
    subtitle: 'Medyascope, video söyleşi — Ruşen Çakır',
    excerpt:
      'İlk anı cildi üzerine video söyleşi; gazetecilik yılları ve anıları konuşuluyor.',
    url: 'https://medyascope.tv/2024/11/25/sahin-alpay-ile-soylesi-bir-hikayem-var-video/',
    tags: ['Bir Hikâyem Var', 'anılar', 'gazetecilik', 'Ruşen Çakır', 'video', '2024'],
  },
  {
    slug: 'bir-hikayem-var-acik-radyo-2024',
    title: 'Bir Hikâyem Var',
    date: '26 Aralık 2024',
    subtitle: 'Açık Radyo, Açık Gazete — Ömer Madra, Özdeş Özbay',
    excerpt: 'Kitabı ve hayat hikâyesi üzerine radyo söyleşisi.',
    url: 'https://apacikradyo.com.tr/acik-gazete/sahin-alpay-bir-hikayem-var',
    tags: ['Bir Hikâyem Var', 'anılar', 'Ömer Madra', 'Açık Gazete', 'radyo', '2024'],
  },
  {
    slug: 'hikayemin-sonu-medyascope-2025',
    title: 'Hikâyemin Sonu',
    date: '17 Mart 2025',
    subtitle: 'Medyascope, video söyleşi — Ruşen Çakır',
    excerpt:
      "İkinci cilt üzerine söyleşi; Silivri'deki tutukluluk günleri ve dava süreci ağırlıklı.",
    url: 'https://medyascope.tv/2025/03/17/hikayemin-sonu-sahin-alpay-anlatti/',
    tags: ['Hikâyemin Sonu', 'Silivri', 'tutukluluk', 'Ruşen Çakır', 'video', '2025'],
  },
  {
    slug: 'sol-devrimcilikten-liberal-demokratliga-khktv-2025',
    title: 'Sol devrimcilikten liberal demokratlığa: sürgün ve tutukluluk hikâyesi',
    date: '10 Ekim 2025',
    subtitle: 'KHK TV, video söyleşi',
    excerpt:
      "Marksist-Leninist görüşleri savunduğu, silahlı mücadeleyi de içine alan devrimci gençlik yıllarından; FKÖ kamplarında aldığı gerilla eğitiminden; İsveç'te geçirdiği yaklaşık on yıllık sürgünden; dönüşünde Cumhuriyet, Milliyet, Sabah ve 2002'den itibaren Zaman'da liberal demokrasiyi savunan bir yazar olarak çalışmasından; terör örgütü üyeliği ve anayasal düzeni değiştirmeye teşebbüs suçlamasıyla yargılanıp Silivri'de yaklaşık iki yıl tutuklu kalışından anlattığı hayat hikâyesi söyleşisi.",
    url: 'https://www.youtube.com/watch?v=pBVn6047yB8',
    tags: ['sürgün', 'İsveç', 'Silivri', 'tutukluluk', 'KHK TV', 'video', '2025'],
  },
  {
    slug: 'ahmet-turan-alkana-veda-khktv-2026',
    title: "'Çok üzülüyor, yaşıyor olmaktan hicap duyuyorum'",
    date: '6 Şubat 2026',
    subtitle: 'KHK TV, video (anma yazısı) — Ahmet Turan Alkan için',
    excerpt:
      "Yakın dostu, vefat eden yazar Ahmet Turan Alkan için kaleme aldığı bir anma/veda yazısının video sunumu; Zaman gazetesindeki ortak yıllarını, 15 Temmuz sonrası tutuklamaları, Silivri'deki tutukluluklarını ve KHK'ların aydınlar üzerindeki etkisini anlatıyor. Bir söyleşi değil, Şahin Alpay'ın kendi kaleme aldığı bir metnin video kaydı.",
    url: 'https://www.youtube.com/watch?v=UGrAaipn1DQ',
    tags: ['Ahmet Turan Alkan', 'KHK', 'anma', 'KHK TV', 'video', '2026'],
  },
]
