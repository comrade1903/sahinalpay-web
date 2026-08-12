import type { ArchiveItemSeed } from '../types'

/** Söyleşiler. Broadcast conversations rather than print interviews, so each
 *  entry links out to the publisher's own page — the recording is theirs and
 *  is not mirrored here.
 *
 *  The three below all follow the two volumes of his memoirs (Bir Hikâyem Var,
 *  Hikâyemin Sonu); the interviewer is named in `subtitle` because the archive
 *  has no separate field for one.
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
]
