import type { ArchiveItemSeed } from '../types'

/** Söyleşiler. Conversations published by someone else — radio and video
 *  programmes plus web interviews — so each entry links out to the
 *  publisher's own page: the recording (or the interviewer's text) is theirs
 *  and is not mirrored here.
 *
 *  `interviewFormat` splits the page in two, as the owner asked on
 *  2026-10-11: written pieces (print, web text, books) are "söyleşi", radio,
 *  TV and video ones are "mülakat", and the broadcast entries' subtitles say
 *  so. The 2003 bianet entry is a radio programme's transcript but is read as
 *  text, so it counts as written, by the owner's call.
 *
 *  Subtitles carry no editorial caveats (the owner asked on 2026-10-11). The
 *  2024 Açık Radyo page is dated 26 December while the owner's working list
 *  gives 25 December as the broadcast date.
 *
 *  On 2026-10-14 the owner asked to keep only what a reader can actually
 *  follow: written pieces whose text is online and broadcasts whose recording
 *  is. Entries known only from the publication list (the Dışarıdan/İçeriden
 *  Bakanlar books, Entelektüel Bakış, Akıl Defteri, the ATV documentary, the
 *  Aksiyon and Türkiye Günlüğü interviews, among others) were removed, as was
 *  the 1995 Birebir Söyleşiler series, whose link was Açık Radyo's profile
 *  page rather than a recording. The Global Axess interview moved to the
 *  English academic articles.
 *
 *  The 2018 bianet interview by Pınar Türenç was removed at the owner's
 *  request on 2026-10-18.
 *
 *  The NEWSROOM MEDIA video (added 2026-10-13) carries only what Vimeo shows:
 *  its title is just "Şahin Alpay", it has no description or credited
 *  interviewer, and 13 April 2026 is its upload date, not a known recording
 *  date. The link is Vimeo's unlisted share link; the owner asked for it to be
 *  listed as is.
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
    interviewFormat: 'written',
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
    interviewFormat: 'broadcast',
    title: 'Bir Hikâyem Var',
    date: '25 Kasım 2024',
    subtitle:
      'Medyascope, video mülakat — Ruşen Çakır. Spotify’da Medyascope kanalında (bölüm bağlantısı değil): https://open.spotify.com/show/0eMOSpamqoKAY6WwqWdeR6',
    url: 'https://medyascope.tv/2024/11/25/sahin-alpay-ile-soylesi-bir-hikayem-var-video/',
    tags: ['Bir Hikâyem Var', 'anılar', 'gazetecilik', 'Ruşen Çakır', 'video', '2024'],
  },
  {
    slug: 'olmek-icin-gonullu-oldum-serbestiyet-2024',
    interviewFormat: 'broadcast',
    title: 'Şahin Alpay: “Ölmek için, İsrail’e karşı yapılacak operasyona gönüllü oldum”',
    date: '22 Aralık 2024',
    subtitle: 'Serbestiyet, video mülakat — “Bir Hikâyem Var” üzerine',
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
    interviewFormat: 'broadcast',
    title: 'Bir Hikâyem Var',
    date: '26 Aralık 2024',
    subtitle:
      'Açık Radyo, Açık Gazete — Ömer Madra, Özdeş Özbay. Spotify’da Açık Gazete kanalı: https://open.spotify.com/show/4DS9QcZ6GoWNUVmwiKDuT6',
    url: 'https://apacikradyo.com.tr/acik-gazete/sahin-alpay-bir-hikayem-var',
    tags: ['Bir Hikâyem Var', 'anılar', 'Ömer Madra', 'Açık Gazete', 'radyo', '2024'],
  },
  {
    slug: 'hikayemin-sonu-medyascope-2025',
    interviewFormat: 'broadcast',
    title: 'Hikâyemin Sonu',
    date: '17 Mart 2025',
    subtitle:
      'Medyascope, video mülakat — Ruşen Çakır. Spotify bölümü: https://open.spotify.com/episode/2NtvyM0pFJ6kZ3I35rHRNM',
    url: 'https://medyascope.tv/2025/03/17/hikayemin-sonu-sahin-alpay-anlatti/',
    tags: ['Hikâyemin Sonu', 'Silivri', 'tutukluluk', 'Ruşen Çakır', 'video', '2025'],
  },
  {
    slug: 'liberal-demokratlikta-israrciyim-k24-2025',
    interviewFormat: 'written',
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
    interviewFormat: 'broadcast',
    title: 'Sol devrimcilikten liberal demokratlığa: sürgün ve tutukluluk hikâyesi',
    date: '10 Ekim 2025',
    subtitle: 'KHK TV, video mülakat',
    url: 'https://www.youtube.com/watch?v=pBVn6047yB8',
    tags: ['sürgün', 'İsveç', 'Silivri', 'tutukluluk', 'KHK TV', 'video', '2025'],
  },
  {
    slug: 'ahmet-turan-alkana-veda-khktv-2026',
    interviewFormat: 'broadcast',
    title: "'Çok üzülüyor, yaşıyor olmaktan hicap duyuyorum'",
    date: '6 Şubat 2026',
    subtitle: 'KHK TV, video (anma yazısı) — Ahmet Turan Alkan için',
    url: 'https://www.youtube.com/watch?v=UGrAaipn1DQ',
    tags: ['Ahmet Turan Alkan', 'KHK', 'anma', 'KHK TV', 'video', '2026'],
  },
  {
    slug: 'sahin-alpay-newsroom-media-2026',
    interviewFormat: 'broadcast',
    title: 'Şahin Alpay',
    date: '13 Nisan 2026',
    subtitle: 'NEWSROOM MEDIA, video mülakat',
    url: 'https://vimeo.com/1182593301/cdf038ee1f',
    tags: ['NEWSROOM MEDIA', 'video', '2026'],
  },

  /* Added 2026-10-08 from the owner’s working interview bibliography. */
  {
    slug: 'medya-konusmalari-acik-radyo-2006',
    interviewFormat: 'broadcast',
    title: 'Medya Konuşmaları IV: Açık Toplum ve İfade Özgürlüğü',
    date: '12 Haziran 2006',
    subtitle: 'Açık Radyo, radyo mülakatı — Ömer Madra, Avi Haligua',
    url: 'https://apacikradyo.com.tr/arsiv-icerigi/medya-konusmalari-iv-acik-toplum-ve-ifade-ozgurlugu',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['ifade özgürlüğü', 'Ömer Madra', 'Avi Haligua', 'Açık Radyo', 'radyo', '2006'],
  },
  {
    slug: 'turk-solu-ve-filistin-sorunu-medyascope-2026',
    interviewFormat: 'broadcast',
    title: 'Türk solu ve Filistin sorunu',
    date: '16 Şubat 2026',
    subtitle: 'Medyascope, video mülakat — Emir Berke Yaşar',
    url: 'https://medyascope.tv/2026/02/16/turk-solu-ve-filistin-sorunu/',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Filistin', 'sol', 'Emir Berke Yaşar', 'Medyascope', '2026'],
  },

  /* Referans Alanlar — pieces by other writers that refer to Şahin Alpay or
     his work, added at the owner's request on 2026-10-18 from his own
     clippings. Taha Akyol's column mentions his translation of a chapter of
     Popper's "The Poverty of Historicism", appended to Mete Tunçay's Turkish
     edition of Bryan Magee's book on Popper. The date is the one handwritten
     on the sheet the clippings are pasted on; the scan is the owner's phone
     photo, straightened and cropped, with its metadata dropped. */
  {
    slug: 'karl-popper-tartismasi-tercuman-1984',
    interviewFormat: 'reference',
    author: 'Taha Akyol',
    title: 'Karl Popper tartışması',
    date: '18 Aralık 1984',
    subtitle: 'Tercüman, “Objektif” köşesi — Taha Akyol',
    sourceNote:
      'Şahin Alpay’ın kendi kupür arşivinden. Tarih, kupürlerin yapıştırıldığı kâğıda elle yazılmış nottan alınmıştır.',
    tags: ['Karl Popper', 'Taha Akyol', 'Tercüman', 'çeviri', 'açık toplum', '1984'],
    clippings: [
      {
        src: '/archive/clippings/tercuman/1984/karl-popper-tartismasi/cover.webp',
        alt: 'Tercüman, 18 Aralık 1984: Taha Akyol, “Karl Popper tartışması” — yazının başı, 10. sayfadaki devamı ve “Türkçe’de Popper” ara başlıklı bölüm',
        pageLabel: 'Kupür',
      },
    ],
  },
]
