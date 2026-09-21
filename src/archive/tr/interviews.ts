import type { ArchiveItemSeed } from '../types'

/** Söyleşiler. Conversations published by someone else — radio and video
 *  programmes plus web interviews — so each entry links out to the
 *  publisher's own page: the recording (or the interviewer's text) is theirs
 *  and is not mirrored here.
 *
 *  The interviewer is named in `subtitle` because the archive has no separate
 *  field for one. Where a piece isn't credited to a named interviewer (or,
 *  for the KHK TV piece below, isn't an interview at all but a tribute essay
 *  presented on video), `subtitle` names only the venue rather than inventing
 *  one. No `excerpt` here: the list row shows `excerpt` in place of `subtitle`
 *  (see components/archive), and since these rows link out rather than open a
 *  reader page, a standfirst would only hide the venue credit.
 */
export const interviewSeeds: ArchiveItemSeed[] = [
  {
    slug: 'kamusalin-siyasal-topografisi-bianet-2003',
    title: 'Alpay: Kamusalın Siyasal Topografisi',
    date: '8 Kasım 2003',
    subtitle:
      'bianet — Açık Radyo “Açık Gazete / Üçüncü Göz”, 4 Kasım 2003 yayınının dökümü — Ömer Madra, Mustafa Arslantunalı',
    url: 'https://bianet.org/haber/alpay-kamusalin-siyasal-topografisi-26100',
    tags: [
      'başörtüsü',
      'kamusal alan',
      'laiklik',
      'Ömer Madra',
      'Mustafa Arslantunalı',
      'Açık Gazete',
      'bianet',
      'radyo',
      '2003',
    ],
  },
  {
    slug: 'bir-hikayem-var-medyascope-2024',
    title: 'Bir Hikâyem Var',
    date: '25 Kasım 2024',
    subtitle: 'Medyascope, video söyleşi — Ruşen Çakır',
    url: 'https://medyascope.tv/2024/11/25/sahin-alpay-ile-soylesi-bir-hikayem-var-video/',
    tags: ['Bir Hikâyem Var', 'anılar', 'gazetecilik', 'Ruşen Çakır', 'video', '2024'],
  },
  {
    slug: 'olmek-icin-gonullu-oldum-serbestiyet-2024',
    title: 'Şahin Alpay: “Ölmek için, İsrail’e karşı yapılacak operasyona gönüllü oldum”',
    date: '22 Aralık 2024',
    subtitle: 'Serbestiyet, video söyleşi — “Bir Hikâyem Var” üzerine',
    url: 'https://serbestiyet.com/roportaj/roportaj-sahin-alpay-olmek-icin-israile-karsi-yapilacak-operasyona-gonullu-oldum-191639/',
    tags: [
      'Bir Hikâyem Var',
      'anılar',
      'Filistin Kurtuluş Örgütü',
      'devrimcilik',
      'Serbestiyet',
      'video',
      '2024',
    ],
  },
  {
    slug: 'bir-hikayem-var-acik-radyo-2024',
    title: 'Bir Hikâyem Var',
    date: '26 Aralık 2024',
    subtitle: 'Açık Radyo, Açık Gazete — Ömer Madra, Özdeş Özbay',
    url: 'https://apacikradyo.com.tr/acik-gazete/sahin-alpay-bir-hikayem-var',
    tags: ['Bir Hikâyem Var', 'anılar', 'Ömer Madra', 'Açık Gazete', 'radyo', '2024'],
  },
  {
    slug: 'hikayemin-sonu-medyascope-2025',
    title: 'Hikâyemin Sonu',
    date: '17 Mart 2025',
    subtitle: 'Medyascope, video söyleşi — Ruşen Çakır',
    url: 'https://medyascope.tv/2025/03/17/hikayemin-sonu-sahin-alpay-anlatti/',
    tags: ['Hikâyemin Sonu', 'Silivri', 'tutukluluk', 'Ruşen Çakır', 'video', '2025'],
  },
  {
    slug: 'liberal-demokratlikta-israrciyim-k24-2025',
    title: 'Şahin Alpay’la söyleşi: “Liberal demokratlıkta ısrarcıyım.”',
    date: '9 Ekim 2025',
    subtitle: 'K24, söyleşi — İştar Gözaydın',
    url: 'https://www.k24kitap.org/sahin-alpayla-soylesi-liberal-demokratlikta-israrciyim-5386',
    tags: [
      'liberal demokrasi',
      'Kemalizm',
      'sosyalizm',
      'anılar',
      'İştar Gözaydın',
      'K24',
      '2025',
    ],
  },
  {
    slug: 'sol-devrimcilikten-liberal-demokratliga-khktv-2025',
    title: 'Sol devrimcilikten liberal demokratlığa: sürgün ve tutukluluk hikâyesi',
    date: '10 Ekim 2025',
    subtitle: 'KHK TV, video söyleşi',
    url: 'https://www.youtube.com/watch?v=pBVn6047yB8',
    tags: ['sürgün', 'İsveç', 'Silivri', 'tutukluluk', 'KHK TV', 'video', '2025'],
  },
  {
    slug: 'ahmet-turan-alkana-veda-khktv-2026',
    title: "'Çok üzülüyor, yaşıyor olmaktan hicap duyuyorum'",
    date: '6 Şubat 2026',
    subtitle: 'KHK TV, video (anma yazısı) — Ahmet Turan Alkan için',
    url: 'https://www.youtube.com/watch?v=UGrAaipn1DQ',
    tags: ['Ahmet Turan Alkan', 'KHK', 'anma', 'KHK TV', 'video', '2026'],
  },
  {
    slug: 'baykal-gorbacov-olamaz-aksiyon-2008',
    title: 'Şahin Alpay: Baykal, Gorbaçov olamaz',
    date: '15 Aralık 2008',
    subtitle:
      'Aksiyon (haftalık haber dergisi), Sayı 733, 15 Aralık 2008, s. 35-40 — Emin Akdağ',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Deniz Baykal', 'CHP', 'sosyal demokrasi', 'Emin Akdağ', 'Aksiyon', '2008'],
  },
]
