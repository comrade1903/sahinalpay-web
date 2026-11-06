/** Writing about a book by other people — reviews, columns and interviews
 *  prompted by it — listed in a dialog from the book's card.
 *
 *  Each entry was given by the owner as a link (2026-11-06). Headline,
 *  author and date are copied from the page's own metadata as read that day;
 *  where a page could not be reached, only what its address itself names
 *  (the author and the publication) is shown, and `title`/`date` are left
 *  out rather than guessed. */

/** The card's button and the dialog's heading. */
export const bookPressLabels = {
  tr: { open: 'Kitap hakkında yazılanlar', title: 'Kitap Hakkında Yazılanlar' },
  en: { open: 'Written about the book', title: 'Written About the Book' },
} as const

export interface BookPressItem {
  /** The headline as the page gives it. */
  title?: string
  author: string
  outlet: string
  /** ISO date (YYYY-MM-DD) of publication, as the page gives it. */
  date?: string
  url: string
}

export const birHikayemVarPress: BookPressItem[] = [
  {
    // Odatv's reprint, introduced on the page as "Ertuğrul Özkök yazdı".
    title:
      'Özkök, dönekliğinden gurur duyan Şahin Alpay örneğini verip noktayı koyuyor: Aldatmış, aldatılmış aydınlar enkazı',
    author: 'Ertuğrul Özkök',
    outlet: 'Odatv',
    date: '2024-11-23',
    url: 'https://www.odatv.com/guncel/ozkok-donekliginden-gurur-duyan-sahin-alpay-ornegini-verip-noktayi-koyuyor-aldatmis-aldatilmis-aydinlar-enkazi-120073324',
  },
  {
    title: 'Şahin Alpay’ın anıları',
    author: 'Bilgehan Uçak',
    outlet: 'Yeni Arayış',
    date: '2024-11-30',
    url: 'https://yeniarayis.com/yazi/sahin-alpayin-anilari-9085',
  },
  {
    title: 'ABD’nin en seçkin köşesinden Filistin direnişine yolculuk: Şahin Alpay’ın sıra dışı yaşam hikayesi',
    author: 'Haluk Özdalga',
    outlet: 'Haber3',
    date: '2024-12-14',
    url: 'https://www.haber3.com/kose-yazisi/abdnin-en-seckin-kosesinden-filistin-direnisine-yolculuk-sahin-alpayin-sira-disi-yasam-hikayesi/6212014',
  },
  {
    title: 'Şahin Alpay ne diyor?',
    author: 'Taha Akyol',
    outlet: 'Karar',
    date: '2024-12-17',
    url: 'https://www.karar.com/yazarlar/taha-akyol/sahin-alpay-ne-diyor-1602190',
  },
  {
    // Also listed under Interviews.
    title: 'Şahin Alpay’la söyleşi: “Liberal demokratlıkta ısrarcıyım.”',
    author: 'İştar Gözaydın',
    outlet: 'K24',
    date: '2025-10-09',
    url: 'https://www.k24kitap.org/sahin-alpayla-soylesi-liberal-demokratlikta-israrciyim-5386',
  },
  {
    // The page could not be reached on 2026-11-06; author and outlet are
    // from its address.
    author: 'H. Agah Kalender',
    outlet: 'Turkish Post',
    url: 'https://www.turkishpost.net/h-agah-kalender-yazdi-i-sahin-alpayin-hikayesi-burada-bitmez/',
  },
  {
    // The page could not be reached on 2026-11-06; author and outlet are
    // from its address.
    author: 'Hasan Cemal',
    outlet: 'T24',
    url: 'https://t24.com.tr/yazarlar/hasan-cemal/dostluklar-insani-ayakta-tutar,47423',
  },
]
