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
 *  Subtitles carry no editorial caveats (the owner asked on 2026-10-11). What
 *  they used to say is kept here instead: the ATV, Alp Ulagay, listener-support
 *  and Zafer Özcan entries have no direct link to the broadcast; the 1993
 *  Türkiye Günlüğü interview has no open full text; for the Dışarıdan
 *  Bakanlar interviews, 2002 is the book's publication year, not the date of
 *  the interview; the İçeriden Bakanlar list of interviewees is incomplete;
 *  and the 2024 Açık Radyo page is dated 26 December while the owner's
 *  working list gives 25 December as the broadcast date.

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
  {
    slug: 'baykal-gorbacov-olamaz-aksiyon-2008',
    interviewFormat: 'written',
    title: 'Şahin Alpay: Baykal, Gorbaçov olamaz',
    date: '15 Aralık 2008',
    subtitle:
      'Aksiyon (haftalık haber dergisi), Sayı 733, 15 Aralık 2008, s. 35-40 — Emin Akdağ',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Deniz Baykal', 'CHP', 'sosyal demokrasi', 'Emin Akdağ', 'Aksiyon', '2008'],
  },

  /* Added 2026-10-08 from the owner’s working interview bibliography (shown
     briefly as the unlisted /tr/soylesiler-new preview). Where the source gives a season or a span,
     `date` holds the nearest parseable point and `subtitle` the full span. */
  {
    slug: 'ernest-gellner-turkiye-gunlugu-1993',
    interviewFormat: 'written',
    title: 'Ernest Gellner',
    date: '1993',
    subtitle: 'Türkiye Günlüğü, sayı 24 (Güz 1993) — söyleşiyi yapan: Şahin Alpay.',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Ernest Gellner', 'Türkiye Günlüğü', '1993'],
  },
  {
    slug: 'birebir-soylesiler-acik-radyo-1995',
    interviewFormat: 'broadcast',
    title: 'Birebir Söyleşiler',
    date: '13 Kasım 1995',
    subtitle: 'Açık Radyo, program dizisi, 13 Kasım 1995 – 27 Ocak 1996 — programı yapan: Şahin Alpay',
    url: 'https://apacikradyo.com.tr/kisi/sahin-alpay',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Açık Radyo', 'radyo', '1995', '1996'],
  },
  {
    slug: 'entelektuel-bakis-cnn-turk-1999',
    interviewFormat: 'broadcast',
    title: 'Entelektüel Bakış',
    date: '1999',
    subtitle: 'CNN Türk, program dizisi, 1999–2002 — programı yapan: Şahin Alpay',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Entelektüel Bakış', 'CNN Türk', 'video', '1999', '2002'],
  },
  {
    slug: 'nur-vergin-entelektuel-bakis-2001',
    interviewFormat: 'broadcast',
    title: 'Nur Vergin',
    date: '4 Mart 2001',
    subtitle: 'CNN Türk, Entelektüel Bakış, video mülakat — mülakatı yapan: Şahin Alpay',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Nur Vergin', 'Entelektüel Bakış', 'CNN Türk', 'video', '2001'],
  },
  {
    slug: 'ahmet-evin-entelektuel-bakis-2001',
    interviewFormat: 'broadcast',
    title: 'Ahmet Evin — Türkiye–AB',
    date: '10 Haziran 2001',
    subtitle: 'CNN Türk, Entelektüel Bakış, video mülakat — mülakatı yapan: Şahin Alpay',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Ahmet Evin', 'Entelektüel Bakış', 'CNN Türk', 'video', '2001'],
  },
  {
    slug: 'kemal-kirisci-entelektuel-bakis-2001',
    interviewFormat: 'broadcast',
    title: 'Kemal Kirişçi — 11 Eylül sonrası dünya',
    date: '16 Eylül 2001',
    subtitle: 'CNN Türk, Entelektüel Bakış, video mülakat — mülakatı yapan: Şahin Alpay',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Kemal Kirişçi', 'Entelektüel Bakış', 'CNN Türk', 'video', '2001'],
  },
  {
    slug: 'ali-bulac-entelektuel-bakis-2001',
    interviewFormat: 'broadcast',
    title: 'Ali Bulaç',
    date: '30 Eylül 2001',
    subtitle: 'CNN Türk, Entelektüel Bakış, video mülakat — mülakatı yapan: Şahin Alpay',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Ali Bulaç', 'Entelektüel Bakış', 'CNN Türk', 'video', '2001'],
  },
  {
    slug: 'ahmet-sozen-entelektuel-bakis-2001',
    interviewFormat: 'broadcast',
    title: 'Ahmet Sözen — Kıbrıs',
    date: '25 Kasım 2001',
    subtitle: 'CNN Türk, Entelektüel Bakış, video mülakat — mülakatı yapan: Şahin Alpay',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Ahmet Sözen', 'Entelektüel Bakış', 'CNN Türk', 'video', '2001'],
  },
  {
    slug: 'nursin-guney-entelektuel-bakis-2001',
    interviewFormat: 'broadcast',
    title: 'Nurşin Güney — Avrupa güvenliği',
    date: '2 Aralık 2001',
    subtitle: 'CNN Türk, Entelektüel Bakış, video mülakat — mülakatı yapan: Şahin Alpay',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Nurşin Güney', 'Entelektüel Bakış', 'CNN Türk', 'video', '2001'],
  },
  {
    slug: 'ustun-erguder-entelektuel-bakis-2002',
    interviewFormat: 'broadcast',
    title: 'Üstün Ergüder — Üniversiteler',
    date: '17 Mart 2002',
    subtitle: 'CNN Türk, Entelektüel Bakış, video mülakat — mülakatı yapan: Şahin Alpay',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Üstün Ergüder', 'Entelektüel Bakış', 'CNN Türk', 'video', '2002'],
  },
  {
    slug: 'nermin-abadan-unat-entelektuel-bakis-2002',
    interviewFormat: 'broadcast',
    title: 'Nermin Abadan-Unat — Göç',
    date: '5 Mayıs 2002',
    subtitle: 'CNN Türk, Entelektüel Bakış, video mülakat — mülakatı yapan: Şahin Alpay',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Nermin Abadan-Unat', 'Entelektüel Bakış', 'CNN Türk', 'video', '2002'],
  },
  {
    slug: 'cem-duna-entelektuel-bakis-2002',
    interviewFormat: 'broadcast',
    title: 'Cem Duna — Türkiye–AB',
    date: '19 Mayıs 2002',
    subtitle: 'CNN Türk, Entelektüel Bakış, video mülakat — mülakatı yapan: Şahin Alpay',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Cem Duna', 'Entelektüel Bakış', 'CNN Türk', 'video', '2002'],
  },
  {
    slug: 'paul-kennedy-disaridan-bakanlar',
    interviewFormat: 'written',
    title: 'Paul Kennedy',
    date: '2002',
    subtitle: 'Türkiye’nin Tanıkları: Dışarıdan Bakanlar (kitap) — söyleşiyi yapan: Şahin Alpay.',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Paul Kennedy', 'Türkiye’nin Tanıkları', 'kitap', '2002'],
  },
  {
    slug: 'ernest-gellner-disaridan-bakanlar',
    interviewFormat: 'written',
    title: 'Ernest Gellner',
    date: '2002',
    subtitle: 'Türkiye’nin Tanıkları: Dışarıdan Bakanlar (kitap) — söyleşiyi yapan: Şahin Alpay.',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Ernest Gellner', 'Türkiye’nin Tanıkları', 'kitap', '2002'],
  },
  {
    slug: 'abdulkerim-sorus-disaridan-bakanlar',
    interviewFormat: 'written',
    title: 'Abdülkerim Soruş (Abdolkarim Soroush)',
    date: '2002',
    subtitle: 'Türkiye’nin Tanıkları: Dışarıdan Bakanlar (kitap) — söyleşiyi yapan: Şahin Alpay.',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Abdülkerim Soruş', 'Türkiye’nin Tanıkları', 'kitap', '2002'],
  },
  {
    slug: 'samuel-huntington-disaridan-bakanlar',
    interviewFormat: 'written',
    title: 'Samuel P. Huntington',
    date: '2002',
    subtitle: 'Türkiye’nin Tanıkları: Dışarıdan Bakanlar (kitap) — söyleşiyi yapan: Şahin Alpay.',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Samuel P. Huntington', 'Türkiye’nin Tanıkları', 'kitap', '2002'],
  },
  {
    slug: 'bernard-lewis-disaridan-bakanlar',
    interviewFormat: 'written',
    title: 'Bernard Lewis',
    date: '2002',
    subtitle: 'Türkiye’nin Tanıkları: Dışarıdan Bakanlar (kitap) — söyleşiyi yapan: Şahin Alpay.',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Bernard Lewis', 'Türkiye’nin Tanıkları', 'kitap', '2002'],
  },
  {
    slug: 'sadik-celal-el-azm-disaridan-bakanlar',
    interviewFormat: 'written',
    title: 'Sadık Celal El Azm (Sadiq al-Azm)',
    date: '2002',
    subtitle: 'Türkiye’nin Tanıkları: Dışarıdan Bakanlar (kitap) — söyleşiyi yapan: Şahin Alpay.',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Sadık Celal El Azm', 'Türkiye’nin Tanıkları', 'kitap', '2002'],
  },
  {
    slug: 'francis-fukuyama-disaridan-bakanlar',
    interviewFormat: 'written',
    title: 'Francis Fukuyama',
    date: '2002',
    subtitle: 'Türkiye’nin Tanıkları: Dışarıdan Bakanlar (kitap) — söyleşiyi yapan: Şahin Alpay.',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Francis Fukuyama', 'Türkiye’nin Tanıkları', 'kitap', '2002'],
  },
  {
    slug: 'turkiyenin-taniklari-iceriden-bakanlar-2003',
    interviewFormat: 'written',
    title: 'Türkiye’nin Tanıkları — İçeriden Bakanlar',
    date: '2003',
    subtitle: 'Timaş, söyleşi derlemesi (kitap) — söyleşileri yapan: Şahin Alpay.',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Türkiye’nin Tanıkları', 'Timaş', 'kitap', '2003'],
  },
  {
    slug: 'akil-defteri-mehtap-tv-2006',
    interviewFormat: 'broadcast',
    title: 'Akıl Defteri',
    date: '2006',
    subtitle: 'Mehtap TV, program dizisi, 2006–2016 — programın yorumcularından: Şahin Alpay',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Akıl Defteri', 'Mehtap TV', 'video', '2006', '2016'],
  },
  {
    slug: 'bilinmeyen-refah-atv-1994',
    interviewFormat: 'broadcast',
    title: 'Bilinmeyen Refah',
    date: '1994',
    subtitle: 'ATV, Güneri Cıvaoğlu belgeseli (yaklaşık 50 görüşme) — mülakatları yapan: Şahin Alpay.',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Refah Partisi', 'Güneri Cıvaoğlu', 'ATV', 'video', '1994'],
  },
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
    slug: 'alp-ulagay-acik-radyo-2006',
    interviewFormat: 'broadcast',
    title: 'Alp Ulagay – Şahin Alpay',
    date: '13 Mart 2006',
    subtitle: 'Açık Radyo, radyo mülakatı — Alp Ulagay.',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Alp Ulagay', 'Açık Radyo', 'radyo', '2006'],
  },
  {
    slug: 'sokak-guzeldir-nadire-mater-2009',
    interviewFormat: 'written',
    title: 'Sokak Güzeldir: 68’de Ne Oldu?',
    date: '2009',
    subtitle: 'Kitap söyleşisi — Nadire Mater',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['1968', 'Nadire Mater', 'kitap', '2009'],
  },
  {
    slug: 'dinleyici-destek-acik-radyo-2012',
    interviewFormat: 'broadcast',
    title: 'Dinleyici Destek yayını',
    date: '25 Mart 2012',
    subtitle: 'Açık Radyo, dinleyici destek yayını — Şahin Alpay, Elvan Alpay, Defne Güler.',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Elvan Alpay', 'Defne Güler', 'Açık Radyo', 'radyo', '2012'],
  },
  {
    slug: 'neyim-kalmis-ki-muebbetlik-oluyorum-bianet-2018',
    interviewFormat: 'written',
    title: 'Neyim Kalmış ki Müebbetlik Oluyorum',
    date: '10 Ocak 2018',
    subtitle: 'bianet, söyleşi — Pınar Türenç',
    url: 'https://bianet.org/haber/sahin-alpay-neyim-kalmis-ki-muebbetlik-oluyorum-193182',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Silivri', 'tutukluluk', 'Pınar Türenç', 'bianet', '2018'],
  },
  {
    slug: 'bir-hikayem-var-zafer-ozcan-2025',
    interviewFormat: 'broadcast',
    title: 'Bir Hikâyem Var / Hikâyemin Sonu',
    date: '17 Nisan 2025',
    subtitle: 'Zafer Özcan TV / Zaman Avustralya, video mülakat, 17–18 Nisan 2025 — Zafer Özcan.',
    sourceNote: 'Şahin Alpay’ın kendi yayın listesinden alınmıştır.',
    tags: ['Bir Hikâyem Var', 'Hikâyemin Sonu', 'anılar', 'Zafer Özcan', 'video', '2025'],
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
]
