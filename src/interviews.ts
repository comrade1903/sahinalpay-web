import type { Lang } from './content'
import { interviewSeeds } from './archive/tr/interviews'

export interface InterviewRecord {
  id: string
  group: 'by' | 'with'
  date: string
  sort: number
  title: string
  person: string
  outlet: string
  kind: 'text' | 'radio' | 'video' | 'book'
  status: 'open' | 'bibliographic' | 'reference'
  links: { label: string; url: string }[]
  note?: Record<Lang, string>
}

/** The supplied working bibliography is not a claim of full-text availability.
 * Exact dates and upper bounds stay visible; programme series are not episode counts.
 * Existing source records remain the authority where their dates differ.
 */
const bibliography: InterviewRecord[] = [
  {
    "id": "gellner-1993",
    "group": "by",
    "date": "Güz 1993",
    "sort": 19930901,
    "title": "Ernest Gellner",
    "person": "Ernest Gellner",
    "outlet": "Türkiye Günlüğü, sayı 24",
    "kind": "text",
    "status": "bibliographic",
    "links": [],
    "note": {
      "tr": "Bibliyografyadaki künye; açık tam metin bağlantısı bulunmuyor.",
      "en": "Citation from the working bibliography; no open full-text link is available."
    }
  },
  {
    "id": "birebir",
    "group": "by",
    "date": "13 Kasım 1995 – 27 Ocak 1996",
    "sort": 19951113,
    "title": "Birebir Söyleşiler",
    "person": "Program dizisi",
    "outlet": "Açık Radyo",
    "kind": "radio",
    "status": "bibliographic",
    "links": [
      {
        "label": "Apaçık Radyo",
        "url": "https://apacikradyo.com.tr/kisi/sahin-alpay"
      }
    ]
  },
  {
    "id": "ucuncu",
    "group": "by",
    "date": "3 Mayıs 1999 – Nisan 2003",
    "sort": 19990503,
    "title": "Üçüncü Göz",
    "person": "Programcı / yorumcu",
    "outlet": "Açık Radyo",
    "kind": "radio",
    "status": "bibliographic",
    "links": [
      {
        "label": "Apaçık Radyo",
        "url": "https://apacikradyo.com.tr/program/ucuncu-goz"
      }
    ],
    "note": {
      "tr": "Yorum programı. Program arşivi mevcut; dönem içindeki bütün kayıtlar bölüm bazında listelenmiyor.",
      "en": "Commentary programme. A programme archive exists, but individual episodes are not fully indexed."
    }
  },
  {
    "id": "entelektuel",
    "group": "by",
    "date": "1999–2002",
    "sort": 19990901,
    "title": "Entelektüel Bakış",
    "person": "Program dizisi",
    "outlet": "CNN Türk",
    "kind": "video",
    "status": "bibliographic",
    "links": []
  },
  {
    "id": "cnn-0",
    "group": "by",
    "date": "4 Mart 2001",
    "sort": 20010304,
    "title": "Nur Vergin",
    "person": "Nur Vergin",
    "outlet": "CNN Türk — Entelektüel Bakış",
    "kind": "video",
    "status": "bibliographic",
    "links": []
  },
  {
    "id": "cnn-1",
    "group": "by",
    "date": "10 Haziran 2001",
    "sort": 20010610,
    "title": "Ahmet Evin — Türkiye–AB",
    "person": "Ahmet Evin",
    "outlet": "CNN Türk — Entelektüel Bakış",
    "kind": "video",
    "status": "bibliographic",
    "links": []
  },
  {
    "id": "cnn-2",
    "group": "by",
    "date": "16 Eylül 2001",
    "sort": 20010916,
    "title": "Kemal Kirişçi — 11 Eylül sonrası dünya",
    "person": "Kemal Kirişçi",
    "outlet": "CNN Türk — Entelektüel Bakış",
    "kind": "video",
    "status": "bibliographic",
    "links": []
  },
  {
    "id": "cnn-3",
    "group": "by",
    "date": "30 Eylül 2001",
    "sort": 20010930,
    "title": "Ali Bulaç",
    "person": "Ali Bulaç",
    "outlet": "CNN Türk — Entelektüel Bakış",
    "kind": "video",
    "status": "bibliographic",
    "links": []
  },
  {
    "id": "cnn-4",
    "group": "by",
    "date": "25 Kasım 2001",
    "sort": 20011125,
    "title": "Ahmet Sözen — Kıbrıs",
    "person": "Ahmet Sözen",
    "outlet": "CNN Türk — Entelektüel Bakış",
    "kind": "video",
    "status": "bibliographic",
    "links": []
  },
  {
    "id": "cnn-5",
    "group": "by",
    "date": "2 Aralık 2001",
    "sort": 20011202,
    "title": "Nurşin Güney — Avrupa güvenliği",
    "person": "Nurşin Güney",
    "outlet": "CNN Türk — Entelektüel Bakış",
    "kind": "video",
    "status": "bibliographic",
    "links": []
  },
  {
    "id": "cnn-6",
    "group": "by",
    "date": "17 Mart 2002",
    "sort": 20020317,
    "title": "Üstün Ergüder — Üniversiteler",
    "person": "Üstün Ergüder",
    "outlet": "CNN Türk — Entelektüel Bakış",
    "kind": "video",
    "status": "bibliographic",
    "links": []
  },
  {
    "id": "cnn-7",
    "group": "by",
    "date": "5 Mayıs 2002",
    "sort": 20020505,
    "title": "Nermin Abadan-Unat — Göç",
    "person": "Nermin Abadan-Unat",
    "outlet": "CNN Türk — Entelektüel Bakış",
    "kind": "video",
    "status": "bibliographic",
    "links": []
  },
  {
    "id": "cnn-8",
    "group": "by",
    "date": "19 Mayıs 2002",
    "sort": 20020519,
    "title": "Cem Duna — Türkiye–AB",
    "person": "Cem Duna",
    "outlet": "CNN Türk — Entelektüel Bakış",
    "kind": "video",
    "status": "bibliographic",
    "links": []
  },
  {
    "id": "disaridan-0",
    "group": "by",
    "date": "2002 veya öncesi",
    "sort": 20021231,
    "title": "Paul Kennedy",
    "person": "Paul Kennedy",
    "outlet": "Türkiye’nin Tanıkları — Dışarıdan Bakanlar",
    "kind": "book",
    "status": "bibliographic",
    "links": [
      {
        "label": "Kitaplar / Books",
        "url": "/tr/kitaplar"
      }
    ],
    "note": {
      "tr": "2002 kitap basım yılıdır; söyleşinin kesin tarihi belirtilmemiştir. ",
      "en": "2002 is the publication year; the interview date is unspecified. "
    }
  },
  {
    "id": "disaridan-1",
    "group": "by",
    "date": "2002 veya öncesi",
    "sort": 20021231,
    "title": "Ernest Gellner",
    "person": "Ernest Gellner",
    "outlet": "Türkiye’nin Tanıkları — Dışarıdan Bakanlar",
    "kind": "book",
    "status": "bibliographic",
    "links": [
      {
        "label": "Kitaplar / Books",
        "url": "/tr/kitaplar"
      }
    ],
    "note": {
      "tr": "2002 kitap basım yılıdır; söyleşinin kesin tarihi belirtilmemiştir. ",
      "en": "2002 is the publication year; the interview date is unspecified. "
    }
  },
  {
    "id": "disaridan-2",
    "group": "by",
    "date": "2002 veya öncesi",
    "sort": 20021231,
    "title": "Abdülkerim Soruş (Abdolkarim Soroush)",
    "person": "Abdülkerim Soruş (Abdolkarim Soroush)",
    "outlet": "Türkiye’nin Tanıkları — Dışarıdan Bakanlar",
    "kind": "book",
    "status": "bibliographic",
    "links": [
      {
        "label": "Kitaplar / Books",
        "url": "/tr/kitaplar"
      }
    ],
    "note": {
      "tr": "2002 kitap basım yılıdır; söyleşinin kesin tarihi belirtilmemiştir. ",
      "en": "2002 is the publication year; the interview date is unspecified. "
    }
  },
  {
    "id": "disaridan-3",
    "group": "by",
    "date": "2002 veya öncesi",
    "sort": 20021231,
    "title": "Samuel P. Huntington",
    "person": "Samuel P. Huntington",
    "outlet": "Türkiye’nin Tanıkları — Dışarıdan Bakanlar",
    "kind": "book",
    "status": "bibliographic",
    "links": [
      {
        "label": "Kitaplar / Books",
        "url": "/tr/kitaplar"
      }
    ],
    "note": {
      "tr": "2002 kitap basım yılıdır; söyleşinin kesin tarihi belirtilmemiştir. ",
      "en": "2002 is the publication year; the interview date is unspecified. "
    }
  },
  {
    "id": "disaridan-4",
    "group": "by",
    "date": "2002 veya öncesi",
    "sort": 20021231,
    "title": "Bernard Lewis",
    "person": "Bernard Lewis",
    "outlet": "Türkiye’nin Tanıkları — Dışarıdan Bakanlar",
    "kind": "book",
    "status": "bibliographic",
    "links": [
      {
        "label": "Kitaplar / Books",
        "url": "/tr/kitaplar"
      }
    ],
    "note": {
      "tr": "2002 kitap basım yılıdır; söyleşinin kesin tarihi belirtilmemiştir. ",
      "en": "2002 is the publication year; the interview date is unspecified. "
    }
  },
  {
    "id": "disaridan-5",
    "group": "by",
    "date": "2002 veya öncesi",
    "sort": 20021231,
    "title": "Sadık Celal El Azm (Sadiq al-Azm)",
    "person": "Sadık Celal El Azm (Sadiq al-Azm)",
    "outlet": "Türkiye’nin Tanıkları — Dışarıdan Bakanlar",
    "kind": "book",
    "status": "bibliographic",
    "links": [
      {
        "label": "Kitaplar / Books",
        "url": "/tr/kitaplar"
      }
    ],
    "note": {
      "tr": "2002 kitap basım yılıdır; söyleşinin kesin tarihi belirtilmemiştir. ",
      "en": "2002 is the publication year; the interview date is unspecified. "
    }
  },
  {
    "id": "disaridan-6",
    "group": "by",
    "date": "2002 veya öncesi",
    "sort": 20021231,
    "title": "Francis Fukuyama",
    "person": "Francis Fukuyama",
    "outlet": "Türkiye’nin Tanıkları — Dışarıdan Bakanlar",
    "kind": "book",
    "status": "bibliographic",
    "links": [
      {
        "label": "Kitaplar / Books",
        "url": "/tr/kitaplar"
      }
    ],
    "note": {
      "tr": "2002 kitap basım yılıdır; söyleşinin kesin tarihi belirtilmemiştir. ",
      "en": "2002 is the publication year; the interview date is unspecified. "
    }
  },
  {
    "id": "iceriden",
    "group": "by",
    "date": "2003",
    "sort": 20030101,
    "title": "Türkiye’nin Tanıkları — İçeriden Bakanlar",
    "person": "Söyleşi derlemesi",
    "outlet": "Timaş",
    "kind": "book",
    "status": "bibliographic",
    "links": [
      {
        "label": "Kitaplar / Books",
        "url": "/tr/kitaplar"
      }
    ],
    "note": {
      "tr": "Kişi listesi bu çalışma bibliyografyasında tamamlanmamıştır.",
      "en": "The list of interviewees is incomplete in this working bibliography."
    }
  },
  {
    "id": "akil",
    "group": "by",
    "date": "2006–2016",
    "sort": 20060101,
    "title": "Akıl Defteri",
    "person": "Program dizisi",
    "outlet": "Mehtap TV",
    "kind": "video",
    "status": "bibliographic",
    "links": []
  },
  {
    "id": "medya-2006",
    "group": "with",
    "date": "12 Haziran 2006",
    "sort": 20060612,
    "title": "Medya Konuşmaları IV: Açık Toplum ve İfade Özgürlüğü",
    "person": "Ömer Madra, Avi Haligua",
    "outlet": "Açık Radyo",
    "kind": "radio",
    "status": "open",
    "links": [
      {
        "label": "Apaçık Radyo",
        "url": "https://apacikradyo.com.tr/arsiv-icerigi/medya-konusmalari-iv-acik-toplum-ve-ifade-ozgurlugu"
      }
    ]
  },
  {
    "id": "axess",
    "group": "with",
    "date": "2007",
    "sort": 20070101,
    "title": "On the Verge of the West",
    "person": "Thomas Gür",
    "outlet": "Global Axess",
    "kind": "text",
    "status": "bibliographic",
    "links": []
  },
  {
    "id": "mater",
    "group": "with",
    "date": "2009",
    "sort": 20090101,
    "title": "Sokak Güzeldir: 68’de Ne Oldu?",
    "person": "Nadire Mater",
    "outlet": "Kitap söyleşisi",
    "kind": "book",
    "status": "bibliographic",
    "links": []
  },
  {
    "id": "turenc",
    "group": "with",
    "date": "10 Ocak 2018",
    "sort": 20180110,
    "title": "Neyim Kalmış ki Müebbetlik Oluyorum",
    "person": "Pınar Türenç",
    "outlet": "bianet",
    "kind": "text",
    "status": "open",
    "links": [
      {
        "label": "bianet",
        "url": "https://bianet.org/haber/sahin-alpay-neyim-kalmis-ki-muebbetlik-oluyorum-193182"
      }
    ]
  },
  {
    "id": "filistin",
    "group": "with",
    "date": "16 Şubat 2026",
    "sort": 20260216,
    "title": "Türk solu ve Filistin sorunu",
    "person": "Emir Berke Yaşar",
    "outlet": "Medyascope",
    "kind": "text",
    "status": "open",
    "links": [
      {
        "label": "Medyascope",
        "url": "https://medyascope.tv/2026/02/16/turk-solu-ve-filistin-sorunu/"
      }
    ]
  },
  {
    "id": "refah",
    "group": "by",
    "date": "1994",
    "sort": 19940101,
    "title": "Bilinmeyen Refah",
    "person": "Güneri Cıvaoğlu belgeseli; yaklaşık 50 görüşme",
    "outlet": "ATV",
    "kind": "video",
    "status": "reference",
    "links": [],
    "note": {
      "tr": "Çalışma bibliyografyasında yer alıyor; doğrudan yayın bağlantısı bu derlemede bulunmuyor.",
      "en": "Listed in the working bibliography; a direct publication link is not available in this collection."
    }
  },
  {
    "id": "ulagay",
    "group": "with",
    "date": "13 Mart 2006",
    "sort": 20060313,
    "title": "Alp Ulagay – Şahin Alpay",
    "person": "Alp Ulagay",
    "outlet": "Açık Radyo",
    "kind": "radio",
    "status": "reference",
    "links": [],
    "note": {
      "tr": "Çalışma bibliyografyasında yer alıyor; doğrudan yayın bağlantısı bu derlemede bulunmuyor.",
      "en": "Listed in the working bibliography; a direct publication link is not available in this collection."
    }
  },
  {
    "id": "destek",
    "group": "with",
    "date": "25 Mart 2012",
    "sort": 20120325,
    "title": "Dinleyici Destek yayını",
    "person": "Şahin Alpay, Elvan Alpay, Defne Güler",
    "outlet": "Açık Radyo",
    "kind": "radio",
    "status": "reference",
    "links": [],
    "note": {
      "tr": "Çalışma bibliyografyasında yer alıyor; doğrudan yayın bağlantısı bu derlemede bulunmuyor.",
      "en": "Listed in the working bibliography; a direct publication link is not available in this collection."
    }
  },
  {
    "id": "ozcan",
    "group": "with",
    "date": "17–18 Nisan 2025",
    "sort": 20250417,
    "title": "Bir Hikâyem Var / Hikâyemin Sonu",
    "person": "Zafer Özcan",
    "outlet": "Zafer Özcan TV / Zaman Avustralya",
    "kind": "video",
    "status": "reference",
    "links": [],
    "note": {
      "tr": "Çalışma bibliyografyasında yer alıyor; doğrudan yayın bağlantısı bu derlemede bulunmuyor.",
      "en": "Listed in the working bibliography; a direct publication link is not available in this collection."
    }
  }
]

const existing: InterviewRecord[] = interviewSeeds
  .filter(item => item.slug !== 'ahmet-turan-alkana-veda-khktv-2026')
  .map(item => {
    const date = item.date ?? ''
    const year = Number(date.match(/\d{4}/)?.[0] ?? 0)
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
    const month = months.findIndex(value => date.includes(value)) + 1
    const slug = item.slug ?? item.title
    const links = item.url ? [{ label: new URL(item.url).hostname.replace(/^www\./, ''), url: item.url }] : []
    if (slug === 'hikayemin-sonu-medyascope-2025') links.push({label: 'Spotify', url: 'https://open.spotify.com/episode/2NtvyM0pFJ6kZ3I35rHRNM'})
    if (slug === 'bir-hikayem-var-medyascope-2024') links.push({label: 'Spotify — Medyascope', url: 'https://open.spotify.com/show/0eMOSpamqoKAY6WwqWdeR6'})
    if (slug === 'bir-hikayem-var-acik-radyo-2024') links.push({label: 'Spotify — Açık Gazete', url: 'https://open.spotify.com/show/4DS9QcZ6GoWNUVmwiKDuT6'})
    return {
      id: slug, group: 'with', date, sort: year * 10000 + month * 100 + Number(date.match(/^\d+/)?.[0] ?? 1),
      title: item.title, person: slug === 'olmek-icin-gonullu-oldum-serbestiyet-2024' ? 'Berka Yaroğlu' : slug === 'sol-devrimcilikten-liberal-demokratliga-khktv-2025' ? 'KHK TV' : item.subtitle?.split(' — ').at(-1) ?? '', outlet: item.subtitle?.split(/[,—]/)[0]?.trim() ?? '',
      kind: item.subtitle?.includes('Radyo') ? 'radio' : item.subtitle?.includes('video') ? 'video' : 'text',
      status: item.url ? 'open' : 'bibliographic', links,
      ...(slug === 'bir-hikayem-var-acik-radyo-2024' ? {note: {tr: 'Kaynak sayfasının tarihi 26 Aralık 2024’tür; çalışma listesinde yayın tarihi 25 Aralık olarak geçer. Spotify bağlantısı program kanalına gider.', en: 'The source page is dated 26 December 2024; the working list gives 25 December as the broadcast date. Spotify links to the programme feed.'}} : {}),
      ...(slug === 'kamusalin-siyasal-topografisi-bianet-2003' ? {note: {tr: '4 Kasım 2003 radyo yayını; yazılı döküm 8 Kasım 2003’te yayımlandı.', en: 'Broadcast on 4 November 2003; transcript published on 8 November.'}} : {}),
      ...(slug === 'bir-hikayem-var-medyascope-2024' ? {note: {tr: 'Spotify bağlantısı Medyascope kanalına gider; bölüm bağlantısı değildir.', en: 'The Spotify link opens the Medyascope feed, not an individual episode.'}} : {}),
    } satisfies InterviewRecord
  })

export const interviewRecords = [...bibliography, ...existing].filter(item => item.id !== 'ucuncu').sort((a, b) => a.sort - b.sort || a.id.localeCompare(b.id))
