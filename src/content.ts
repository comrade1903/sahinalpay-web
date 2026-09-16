/* ------------------------------------------------------------------
   Bilingual content for sahinalpay.com — English and Turkish.

   Site is organized as a writing archive:
   Kimdir? / About → Köşe Yazıları / Columns → Analizler → Söyleşiler →
   Akademik Makaleler → Kitaplar / Books.

   This file holds bilingual UI copy only. Archive entries live under
   src/archive so hundreds of articles and clipping images can scale by outlet.

   Book titles remain in Turkish in both languages (original works).
------------------------------------------------------------------ */

import type { PageKey } from './routes'
import type {
  FlatArchiveSection,
  OutletArchiveSection,
  ArchiveItem,
  OutletGroup,
} from './archive'
import coverHikayeminSonu from './assets/covers/hikayemin-sonu.jpg'
import coverBirHikayemVar from './assets/covers/bir-hikayem-var.jpg'
import coverTaniklariIceriden from './assets/covers/turkiyenin-taniklari-iceriden.jpg'
import coverTaniklariDisaridan from './assets/covers/turkiyenin-taniklari-disaridan.jpg'

export type Lang = 'en' | 'tr'

export type { ArchiveItem, FlatArchiveSection, OutletArchiveSection, OutletGroup }

export interface Book {
  year: string
  title: string
  desc: string
  /** Cover thumbnail (imported image), when available. */
  cover?: string
  /** Real retailer product page (e.g. Kitapyurdu) — never a fabricated link. */
  purchaseUrl?: string
}

export interface BooksSection {
  kicker: string
  title: string
  intro: string
  /** Rendered only when `externalUrl` is set; empty today, so the Books page
   *  shows no call to action rather than a disabled one. */
  externalLabel: string
  externalUrl: string
  books: Book[]
}

export interface Content {
  htmlTitle: string
  htmlDescription: string
  nav: { key: PageKey; label: string }[]
  contactLabel: string
  themeToggleLabel: string
  langToggleLabel: string
  hero: {
    eyebrow: string
    intro: string
    ctaStory: string
    portraitAlt: string
    portraitCaption: string
  }
  hubKicker: string
  hubTitle: string
  chronicleIntro: string
  /** Heading for the other language's records, which every archive section
   *  lists after its own so a reader never has to switch language to find a
   *  piece. Named from the reader's side: a Turkish reader sees "foreign
   *  language", an English reader sees "Turkish". */
  foreignArchiveLabel: string
  hub: { key: PageKey; title: string; description: string }[]
  about: {
    kicker: string
    title: string
    subtitle: string
    lead: string
    editorialNote: string
    contentsLabel: string
    sections: { id: string; title: string; paragraphs: string[] }[]
  }
  columns: OutletArchiveSection
  analyses?: OutletArchiveSection
  interviews?: FlatArchiveSection
  academicArticles?: FlatArchiveSection
  books: BooksSection
  footer: {
    kicker: string
    navLabel: string
    email: string
    columnsLabel: string
    booksLabel: string
    backToTop: string
    rights: string
    tagline: string
    cookieLabel: string
  }
  cookieNotice: {
    ariaLabel: string
    text: string
    policyLinkLabel: string
    acceptLabel: string
  }
  cookiePolicy: {
    kicker: string
    title: string
    intro: string
    sections: { heading: string; body: string[] }[]
  }
  reader: {
    copySourceLabel: string
    citeLabel: string
    copied: string
    copyManual: string
    accessed: string
    bodyError: string
    bodyRetry: string
    /* Heads the archive's own summary of a piece that exists only as a
       page scan. Without this label the summary could be mistaken for the
       author's text, which the record must never allow. */
  }
  /* Shown instead of silently redirecting home. A citation that resolves to the
     wrong page with no warning is worse for the record than an honest dead end. */
  notFound: {
    kicker: string
    title: string
    body: string
    missingTitle: string
    missingBody: string
    backHome: string
    browseArchive: string
  }
  clippingViewer: {
    heading: string
    openPdf: string
    openPdfHint: string
    openImage: string
    openImageHint: string
    pagesSuffix: string
  }
}

const BOOKS: Record<Lang, Book[]> = {
  en: [
    {
      year: '2025',
      title: 'Hikâyemin Sonu',
      desc: 'The second memoir follows my years at Zaman, the hopes and disappointments of the 2000s, my imprisonment in Silivri and my last months with Fatma. It returns to the decisions whose consequences reached into our family life.',
      cover: coverHikayeminSonu,
      purchaseUrl: 'https://www.kitapyurdu.com/kitap/hikayemin-sonu-anilar-ikinci-kitap/710333.html',
    },
    {
      year: '2024',
      title: 'Bir Hikâyem Var',
      desc: 'From my childhood in Istanbul and Ayvalık through revolutionary politics and refuge in Sweden to life in the newsroom. The first memoir traces how my ideas changed, with Fatma, family and friends at the heart of the account.',
      cover: coverBirHikayemVar,
      purchaseUrl: 'https://www.kitapyurdu.com/kitap/bir-hikayem-var-anilar-birinci-kitap/698652.html',
    },
    {
      year: '2003',
      title: 'Türkiye’nin Tanıkları: İçeriden Bakanlar',
      desc: 'Conversations with those who shaped Turkey from within — a portrait of a country in argument with itself.',
      cover: coverTaniklariIceriden,
      purchaseUrl: 'https://www.kitapyurdu.com/kitap/turkiyenin-taniklari-iceriden-bakanlar/54111.html',
    },
    {
      year: '2002',
      title: 'Türkiye’nin Tanıkları: Dışarıdan Bakanlar',
      desc: 'Outside observers on Turkey: how the republic has been read, admired, and misunderstood abroad.',
      cover: coverTaniklariDisaridan,
      purchaseUrl: 'https://www.kitapyurdu.com/kitap/turkiyenin-taniklari-disaridan-bakanlar/46443.html',
    },
    {
      year: '1992',
      title: 'Sosyal Demokrasi Açısından Kürt Sorunu',
      desc: 'An early, unflinching study of the Kurdish question through the lens of social democracy.',
    },
  ],
  tr: [
    {
      year: '2025',
      title: 'Hikâyemin Sonu',
      desc: 'Zaman’da geçen yıllar, 2000’lerin umutları ve hayal kırıklıkları, Silivri, Fatma’yla son aylarımız. İkinci kitapta, sonuçları aile hayatımıza kadar uzanan tercihlerime ve yaşadıklarıma yeniden bakıyorum.',
      cover: coverHikayeminSonu,
      purchaseUrl: 'https://www.kitapyurdu.com/kitap/hikayemin-sonu-anilar-ikinci-kitap/710333.html',
    },
    {
      year: '2024',
      title: 'Bir Hikâyem Var',
      desc: 'İstanbul ve Ayvalık’taki çocukluğumdan devrimci gençliğime, İsveç’e sığınışımdan gazete yıllarına. İlk kitapta, fikirlerimin nasıl değiştiğini anlatırken Fatma’nın, ailemin ve dostlarımın hayatımdaki yerini de arıyorum.',
      cover: coverBirHikayemVar,
      purchaseUrl: 'https://www.kitapyurdu.com/kitap/bir-hikayem-var-anilar-birinci-kitap/698652.html',
    },
    {
      year: '2003',
      title: 'Türkiye’nin Tanıkları: İçeriden Bakanlar',
      desc: 'Türkiye’yi içeriden biçimlendirenlerle söyleşiler — kendisiyle tartışan bir ülkenin portresi.',
      cover: coverTaniklariIceriden,
      purchaseUrl: 'https://www.kitapyurdu.com/kitap/turkiyenin-taniklari-iceriden-bakanlar/54111.html',
    },
    {
      year: '2002',
      title: 'Türkiye’nin Tanıkları: Dışarıdan Bakanlar',
      desc: 'Türkiye’ye dışarıdan bakanlar: Cumhuriyet yurtdışında nasıl okundu, hayranlık duyuldu ve yanlış anlaşıldı.',
      cover: coverTaniklariDisaridan,
      purchaseUrl: 'https://www.kitapyurdu.com/kitap/turkiyenin-taniklari-disaridan-bakanlar/46443.html',
    },
    {
      year: '1992',
      title: 'Sosyal Demokrasi Açısından Kürt Sorunu',
      desc: 'Kürt sorununu sosyal demokrasi merceğinden ele alan erken tarihli, gözünü kaçırmayan bir inceleme.',
    },
  ],
}

export const content: Record<Lang, Content> = {
  en: {
    htmlTitle: 'Şahin Alpay — Political Scientist & Author',
    htmlDescription:
      'Şahin Alpay’s writing archive, memoirs and life story: from Istanbul and Ayvalık to Sweden, journalism and teaching.',
    nav: [
      { key: 'about', label: 'About' },
      { key: 'columns', label: 'Columns' },
      { key: 'analyses', label: 'Analyses' },
      { key: 'interviews', label: 'Interviews' },
      { key: 'academic', label: 'Academic Articles' },
      { key: 'books', label: 'Books' },
      { key: 'chronicle', label: 'Chronicle' },
    ],
    contactLabel: 'Contact',
    themeToggleLabel: 'Toggle light and dark theme',
    langToggleLabel: 'Türkçe sürüme geç',
    hero: {
      eyebrow: 'Political Scientist · Author · Journalist',
      intro:
        'Starting with my student years in the early 1960s, I have sought to understand and interpret politics in Turkey and the world. From the 1980s on, I have done so as a political scientist and journalist, and I am gathering a selection of what I wrote and said here in the hope that it may help future generations understand the period I lived through.',
      ctaStory: 'Who is Şahin Alpay?',
      portraitAlt: 'Portrait of Şahin Alpay',
      portraitCaption: 'Şahin Alpay · b. 1944, Istanbul',
    },
    hubKicker: 'Explore',
    hubTitle: 'All sections',
    chronicleIntro: 'My writing alongside the events of its time. Gaps in this archive do not necessarily mean that I stopped writing.',
    foreignArchiveLabel: 'Turkish-Language Writing',
    hub: [
      {
        key: 'about',
        title: 'Who is Şahin Alpay?',
        description: 'The people, experiences and changing ideas behind my writing.',
      },
      {
        key: 'columns',
        title: 'Columns',
        description: 'A newspaper-columns archive, organized by outlet.',
      },
      {
        key: 'analyses',
        title: 'Analyses',
        description: 'Long-form political and intellectual essays, organized by publication.',
      },
      {
        key: 'interviews',
        title: 'Interviews',
        description: 'Conversations, profiles, and published interviews.',
      },
      {
        key: 'academic',
        title: 'Academic Articles',
        description: 'Academic publications and research writing.',
      },
      {
        key: 'books',
        title: 'Books',
        description: 'Two volumes of memoirs, interviews and studies of politics.',
      },
      {
        key: 'chronicle',
        title: 'Chronicle',
        description: 'My writing alongside the events of its time, year by year.',
      },
    ],
    about: {
      "kicker": "Life story",
      "title": "Who is Şahin Alpay?",
      "subtitle": "",
      "lead": "",
      "editorialNote": "",
      "contentsLabel": "On this page",
      "sections": [
        {
          "id": "my-life",
          "title": "",
          "paragraphs": [
            "I was born in Istanbul on 18 April 1944, the fourth child — after Sumru, Olcay and Acar — of Sabiha and Ahmet Alpay, a family from Ayvalık. Under the compulsory population exchange agreed between Turkey and Greece in 1923, my father’s family had settled in Ayvalık from Serres and my mother’s from Lesbos.",
            "I attended primary school at Nilüfer Hatun Primary School in Nişantaşı, Istanbul (1950–55), middle school at the English High School for Boys in Nişantaşı (1955–60), and high school at Robert College in Bebek (1960–63). I spent third grade at Ayvalık Cumhuriyet Primary School (1952–53). In my second year of high school, on an American Field Service (AFS) scholarship, I went to the United States and completed my final year (1961–62) at the Webb School of California, a private school, earning an American high school diploma.",
            "I won a four-year scholarship to study at Columbia University in New York, but chose not to use it. I completed my higher education between 1963 and 1967 at the Faculty of Political Sciences (SBF) of Ankara University. In 1965 I married my sweetheart, Fatma Nur (Kaptan), a neighbor’s daughter from Ayvalık; our daughter Elvan was born in 1968 and our son Acar in 1978. I have two grandchildren, Defne through Elvan and Leyla through Acar.",
            "While a student at SBF I joined the revolutionary youth movement. My writing appeared in journals such as Dönüşüm, Forum, Aydınlık, İşçi-Köylü and Türk Solu. Between 1968 and 1971 I worked as a teaching assistant in constitutional law at the Faculty of Education of Ankara University. After the 12 March 1971 military intervention, when martial law authorities sought my arrest, I joined the Revolutionary Workers and Peasants’ Party of Turkey (TİİKP), led by Doğu Perinçek, and received guerrilla training in the camps of the Popular Democratic Front for the Liberation of Palestine, led by Nayef Hawatmeh, in Syria and Lebanon; it was during this period that I ended my ties with the TİİKP.",
            "In 1972 I obtained political asylum in Sweden, and between 1974 and 1981 I completed a doctorate in the Department of Political Science at Stockholm University, with a thesis titled “Turks in Stockholm: A Social and Political Study of Immigrants.” On returning to Turkey, I worked as an editor and columnist at Cumhuriyet (1982–92), Sabah (1993–94) and Milliyet (1994–2001). Between 1992 and 1993 I served as Secretary-General of TÜSES, and in 1993 as a parliamentary group adviser to the Republican People’s Party. Following an invitation in the winter of 1998, I taught courses on Turkish political life as a visiting faculty member at Princeton University in the United States. Between 1999 and 2002 I hosted a weekly interview program called “An Intellectual’s View” on the CNN-Türk television channel.",
            "Between 2001 and 2015 I taught courses on Turkish political life and comparative politics in the Department of Political Science at Bahçeşehir University. I wrote columns for Zaman between 2002 and 2016, and for Today’s Zaman between 2007 and 2016. Between 2006 and 2016 I was one of the commentators on the program “Notebook of the Mind” on Mehtap TV.",
            "Although I had opposed military coups throughout my career as a writer, following the coup attempt of 15 July 2016 I was arrested on the charge of “membership in the FETÖ/PDY terrorist organization” and imprisoned in Silivri Prison until my release on 17 March 2018. At the conclusion of the trial, in 2022 I was sentenced to 2 years and 6 months in prison on the finding that, while not a member, I had “aided a terrorist organization.” My case is currently awaiting the outcome of my appeal before the Court of Cassation.",
            "My beloved wife, Fatma Nur Alpay, passed away on 6 October 2018. I have written about our life together in the books Bir Hikayem Var (Lejand, 2024) and Hikayemin Sonu (Lejand, 2025)."
          ]
        }
      ],
    },
    columns: {
      kicker: 'Columns',
      title: 'Columns',
      intro:
        "My English columns for Today's Zaman, on Turkey and the wider world. These articles record the questions I asked and the judgments I reached between 2007 and 2012. My Turkish columns are listed below them.",
      emptyLabel: 'No items yet. Links and archived clippings will be added here.',
      outlets: [{ outlet: "Today's Zaman", items: [] }],
    },
    analyses: {
      kicker: 'Analyses',
      title: 'Analyses',
      intro:
        'These early essays show the ideas I argued for at the time. Read together, they also offer a way into how my political thinking changed.',
      emptyLabel: 'No items yet. Links and archived clippings will be added here.',
      outlets: [
        { outlet: 'Forum', items: [] },
        { outlet: 'Aydınlık (Sosyalist Dergi/Proleter Devrimci)', items: [] },
        { outlet: 'İşçi Köylü', items: [] },
      ],
    },
    interviews: {
      kicker: 'Interviews',
      title: 'Interviews',
      intro: 'In these interviews, questions about my writing open into conversations about my life, political choices and what experience taught me.',
      emptyLabel: 'No items yet. Links and archived clippings will be added here.',
      items: [],
    },
    academicArticles: {
      kicker: 'Academic Articles',
      title: 'Academic Articles',
      intro:
        'Research into migration, political participation and democracy, beginning with my work on migrants from Turkey in Stockholm.',
      emptyLabel: 'No items yet. Links will be added here.',
      items: [],
    },
    books: {
      kicker: 'Selected Works',
      title: 'Books',
      intro:
        'In my memoirs I return to the life behind the columns. Alongside them are interviews and studies of the political questions that occupied me over the years. All books are in Turkish.',
      externalLabel: 'View book summaries ↗',
      externalUrl: '',
      books: BOOKS.en,
    },
    footer: {
      kicker: 'Keep in touch',
      navLabel: 'Footer',
      email: 'Email',
      columnsLabel: 'Columns',
      booksLabel: 'Books',
      backToTop: 'Back to top ↑',
      rights: 'All rights reserved.',
      tagline: 'A life remembered, a body of writing shared.',
      cookieLabel: 'Cookie Policy',
    },
    cookieNotice: {
      ariaLabel: 'Cookie notice',
      text: 'This site uses no tracking or advertising cookies. It only stores your language and theme preference in your browser to remember your choices.',
      policyLinkLabel: 'Cookie Policy',
      acceptLabel: 'Got it',
    },
    cookiePolicy: {
      kicker: 'Privacy',
      title: 'Cookie & Data Notice',
      intro:
        "This page explains, under Turkey's Personal Data Protection Law (KVKK) and the GDPR, what this website stores in your browser and what data leaves your device. In short: this site uses no cookies and does not track you.",
      sections: [
        {
          heading: 'No cookies, no tracking',
          body: [
            'This website sets no cookies. There is no analytics, advertising, or third-party profiling of any kind — your visits are not measured or shared.',
          ],
        },
        {
          heading: 'What we store in your browser',
          body: [
            "To remember your choices, the site saves two functional items in your browser's local storage: your language preference and your light/dark theme preference. These are strictly necessary for the site to work the way you set it and, under KVKK and the GDPR, require disclosure but not prior consent.",
            'When you dismiss the notice at the bottom of the page, that acknowledgement is also stored locally (under the key "cookie-consent") so the notice is not shown again. You can remove all of these at any time by clearing your browser\'s site data.',
          ],
        },
        {
          heading: 'No third-party requests',
          body: [
            'Every file this site loads — pages, images, page scans and typefaces — comes from this site\u2019s own address. The typefaces used to be requested from Google Fonts, which sent your IP address to Google on every page view; they are now served from here, so that no longer happens.',
            'The site has no analytics, no advertising, no tracking pixels and no embedded third-party content. Your reading is not measured.',
            'The site is hosted by Vercel, which like any web host receives the requests your browser makes in order to answer them. That is outside this site\u2019s control and is not something it can describe on Vercel\u2019s behalf.',
          ],
        },
        {
          heading: 'Your rights and contact',
          body: [
            'Because the only personal data involved is the browser storage described above, there is very little to access, correct, or delete beyond clearing your own browser data. For any question about this notice or your rights under KVKK, you can reach the data controller at sahinalpay44@gmail.com.',
          ],
        },
      ],
    },
    reader: {
      copySourceLabel: 'Source',
      citeLabel: 'Cite',
      copied: 'Copied ✓',
      copyManual: 'Select and copy the text below',
      accessed: 'Accessed',
      bodyError: 'The full text could not be loaded. Your connection may have dropped.',
      bodyRetry: 'Try again',
    },
    notFound: {
      kicker: 'Not found',
      title: 'This address does not resolve',
      body: 'The page you asked for is not part of this site. It may have been mistyped, or a link may have carried an old address.',
      missingTitle: 'This piece is not in the archive under that address',
      missingBody:
        'The article may be filed under a different address, or it may not have been added yet. Searching for its title is usually the fastest way to find it.',
      backHome: 'Go to the homepage',
      browseArchive: 'Browse the columns',
    },
    clippingViewer: {
      heading: 'Newspaper Clipping',
      openPdf: 'Read the full scan as a PDF',
      openPdfHint: '(opens in a new tab)',
      openImage: 'Open the full-size clipping',
      openImageHint: '(opens in a new tab)',
      pagesSuffix: 'pages',
    },
  },

  tr: {
    htmlTitle: 'Şahin Alpay — Siyaset Bilimci ve Yazar',
    htmlDescription:
      'Şahin Alpay’ın yazı arşivi, anı kitapları ve yaşam öyküsü: İstanbul ve Ayvalık’tan İsveç’e, gazeteciliğe ve üniversiteye.',
    nav: [
      { key: 'about', label: 'Kimdir?' },
      { key: 'columns', label: 'Köşe Yazıları' },
      { key: 'analyses', label: 'Analizler' },
      { key: 'interviews', label: 'Söyleşiler' },
      { key: 'academic', label: 'Akademik Makaleler' },
      { key: 'books', label: 'Kitaplar' },
      { key: 'chronicle', label: 'Kronik' },
    ],
    contactLabel: 'İletişim',
    themeToggleLabel: 'Açık ve koyu tema arasında geçiş yap',
    langToggleLabel: 'Switch to English version',
    hero: {
      eyebrow: 'Siyaset Bilimci · Yazar · Gazeteci',
      intro:
        '1960’ların başlarındaki öğrencilik yıllarımdan başlayarak Türkiye’de ve dünyada siyaseti anlama ve yorumlama çabasında oldum. Bu çabada 1980’lerden itibaren siyaset bilimci ve gazeteci olarak yazıp söylediklerimden seçmeleri yaşadığım dönemin gelecek kuşaklar tarafından anlaşılmasına katkı olabilir umuduyla bu sayfada topluyorum.',
      ctaStory: 'Şahin Alpay Kimdir?',
      portraitAlt: 'Şahin Alpay’ın portresi',
      portraitCaption: 'Şahin Alpay · d. 1944, İstanbul',
    },
    hubKicker: 'Keşfet',
    hubTitle: 'Tüm Bölümler',
    chronicleIntro: 'Yazılarım, yazıldıkları yılların olaylarıyla yan yana. Arşivdeki boşluklar, o yıllarda yazmadığım anlamına gelmiyor.',
    foreignArchiveLabel: 'Yabancı Dilde Yayınlar',
    hub: [
      {
        key: 'about',
        title: 'Şahin Alpay Kimdir?',
        description: 'Yazılarımın gerisindeki insanlar, yaşadıklarım ve değişen düşüncelerim.',
      },
      {
        key: 'columns',
        title: 'Köşe Yazıları',
        description: 'Gazete yazıları arşivi, yayın bazında düzenlenmiştir.',
      },
      {
        key: 'analyses',
        title: 'Analizler',
        description: 'Dergilerde yayımlanmış analiz yazıları.',
      },
      {
        key: 'interviews',
        title: 'Söyleşiler',
        description: 'Bana sorulan sorular, yazılarımdan hayatıma ve siyasi tercihlerime uzanıyor. Bu söyleşilerde yaşadıklarımı ve zamanla değişen kanaatlerimi anlattım.',
      },
      {
        key: 'academic',
        title: 'Akademik Makaleler',
        description: 'Akademik dergilerde yayımlanmış makaleleri.',
      },
      {
        key: 'books',
        title: 'Kitaplar',
        description: 'İki cilt anı, söyleşiler ve siyaset üzerine çalışmalar.',
      },
      {
        key: 'chronicle',
        title: 'Kronik',
        description: 'Yazılarım ve yazıldıkları dönemin olayları, yıl yıl.',
      },
    ],
    about: {
      "kicker": "Yaşam öyküsü",
      "title": "Şahin Alpay Kimdir?",
      "subtitle": "",
      "lead": "",
      "editorialNote": "",
      "contentsLabel": "Bu sayfada",
      "sections": [
        {
          "id": "hayatim",
          "title": "",
          "paragraphs": [
            "18 Nisan 1944’te Ayvalıklı bir ailenin, Sabiha ve Ahmet Alpay’ın (Sumru, Olcay ve Acar’dan sonraki dördüncü) çocuğu olarak İstanbul’da dünyaya geldim. Türkiye ile Yunanistan arasında 1923 tarihli zorunlu nüfus mübadelesi anlaşması uyarınca babam Serez’den, annem ailesi ise Midilli’den gelip Ayvalık’a yerleşti.",
            "İlkokulu İstanbul Nişantaşı’ndaki Nilüfer Hatun İlkokulu’nda (1950 - 55), ortaokulu Nişantaşı’ndaki İngiliz Erkek Lisesi’nde (1955 - 60), liseyi Bebek’teki Robert Kolej’de (1960 - 63) okudum. İlkokul üçüncü sınıfa Ayvalık Cumhuriyet İlkokulu’nda (1952-53) devam ettim. Lise ikinci sınıfta, bir American Field Service (AFS) bursu ile gittiğim ABD’de özel bir okul olan Webb School of California’da son sınıfı okudum (1961-62) ve Amerikan lise diploması aldım.",
            "ABD’nin New York kentindeki Columbia Üniversitesi’nden dört yıllık öğrenim bursu kazandım, ancak kullanmaktan vazgeçtim. Yüksek öğrenimi 1963-67 arasında Ankara Üniversitesi Siyasal Bilgiler Fakültesi’nde (SBF) yaptım. 1965’te aşkım, Ayvalıklı komşu kızı Fatma Nur (Kaptan) ile evlendik; 1968’de kızımız (Elvan), 1978’de oğlumuz (Acar) dünyaya geldi. Elvan’dan Defne, Acar’dan Leyla adında iki torunum var.",
            "SBF’de okurken devrimci gençlik hareketine katıldım. Dönüşüm, Forum, Aydınlık, İşçi-Köylü, Türk Solu gibi dergilerde yazılarım çıktı. 1968-1971 yılları arasında Ankara Üniversitesi Eğitim Fakültesi’nde Anayasa Hukuku kürsüsünde asistan olarak çalıştım. 12 Mart 1971 askeri müdahalesi sonrasında Sıkıyönetim tarafından aranmam üzerine Doğu Perinçek’in liderliğini yaptığı Türkiye İhtilalci İşçi Köylü Partisi’ne katıldım ve Nayif Hawatme liderliğindeki Filistin Demokratik Halk Kurtuluş Cephesi örgütünün Suriye ve Lübnan’daki kamplarında gerilla eğitimi gördüm; bu sırada TİİKP örgütü ile ilişkimi kestim.",
            "1972’de İsveç’ten siyasi iltica aldım ve 1974-1981 yılları arasında Stockholm Üniversitesi’nin Siyaset Bilimi Bölümü’nde, “Stockholm’de Türkler: Göçmenler Üzerine Sosyal ve Siyasal Bir Araştırma” başlıklı tezle doktora yaptım. Yurda dönüşte 1982-92 arasında Cumhuriyet, 1993-94 arasında Sabah, 1994-2001 arasında Milliyet gazetelerinde editörlük ve yazarlık yaptım. 1992-1993 arasında TÜSES Genel Sekreteri, 1993 yılında Cumhuriyet Halk Partisi TBMM grup danışmanı oldum. 1998 Kış döneminde aldığım davet üzerine ABD’nin Princeton Üniversitesi’nde konuk öğretim üyesi olarak Türk Siyasi Hayatı üzerine dersler verdim. 1999-2002 arasında CNN-Türk televizyon kanalında “Entelektüel Bakış” adlı haftalık mülakat programını sundum.",
            "2001-2015 arasında Bahçeşehir Üniversitesi Siyaset Bilimi Bölümü’nde Türk Siyasi Hayatı ve Mukayeseli Politika dersleri verdim. 2002 - 2016 arasında Zaman, 2007-2016 arasında Today’s Zaman gazetelerinde köşe yazıları yazdım. 2006-2016 arasında Mehtap TV’de “Akıl Defteri” adlı programın yorumcuları arasında yer aldım.",
            "Bütün yazarlık hayatım boyunca askeri darbelere karşı tavır aldığım halde 15 Temmuz 2016’daki darbe girişimi üzerine “FETÖ/PDY terör örgütüne üye” olduğum iddiasıyla tutuklandım ve 17 Mart 2018’de tahliye edilene kadar Silivri cezaevinde hapis yattım. Yargılama sonucunda 2022’de “üye olmamakla beraber terör örgütüne yardım” ettiğim gerekçesiyle 2 yıl 6 ay hapse mahkûm edildim. Hakkımdaki dava Yargıtay’da temyiz başvurumun sonucunu beklemekte.",
            "Çok sevdiğim eşim Fatma Nur Alpay 6 Ekim 2018’de vefat etti. Birlikte yaşadıklarımızı Bir Hikayem Var (Lejand, 2024) ve Hikayemin Sonu (Lejand, 2025) başlıklı kitaplarda anlattım."
          ]
        }
      ],
    },
    columns: {
      kicker: 'Köşe Yazıları',
      title: 'Köşe Yazıları',
      intro:
        'Lise yıllarından başlayarak Türkiye ve dünya siyasetinde olup bitenleri anlama çabası içinde oldum. Bu çabam 1960’lardan itibaren çeşitli dergilerde çıkan makalelere, 1980’lerden itibaren çeşitli gazetelerde çıkan köşe yazılarına yansıdı. Aşağıda köşe yazılarımdan seçmeler yer alıyor.',
      emptyLabel: 'Bu bölümde henüz içerik yok. Bağlantılar ve gazete küpürleri eklenecek.',
      outlets: [
        { outlet: 'Cumhuriyet', items: [] },
        { outlet: 'Sabah', items: [] },
        { outlet: 'Milliyet', items: [] },
        { outlet: 'Zaman', items: [] },
        { outlet: 'P24', items: [] },
      ],
    },
    analyses: {
      kicker: 'Analizler',
      title: 'Analizler',
      intro:
        'Bu yazılarda, kaleme alındıkları dönemde savunduğum fikirler var. Bugün geriye baktığımda, düşüncemin nerelerden geçtiğini de burada görüyorum.',
      emptyLabel: 'Bu bölümde henüz içerik yok. Bağlantılar ve gazete küpürleri eklenecek.',
      outlets: [
        { outlet: 'Forum', items: [] },
        { outlet: 'Aydınlık (Sosyalist Dergi/Proleter Devrimci)', items: [] },
        { outlet: 'İşçi Köylü', items: [] },
      ],
    },
    interviews: {
      kicker: 'Söyleşiler',
      title: 'Söyleşiler',
      intro: 'Bana sorulan sorular, yazılarımdan hayatıma ve siyasi tercihlerime uzanıyor. Bu söyleşilerde yaşadıklarımı ve zamanla değişen kanaatlerimi anlattım.',
      emptyLabel: 'Bu bölümde henüz içerik yok. Bağlantılar ve gazete küpürleri eklenecek.',
      items: [],
    },
    academicArticles: {
      kicker: 'Akademik Makaleler',
      title: 'Akademik Makaleler',
      intro: 'Stockholm’deki Türkiyeli göçmenler üzerine doktora çalışmamdan başlayarak göç, siyasi katılım ve demokrasiyi anlamak için yaptığım araştırmalar.',
      emptyLabel: 'Bu bölümde henüz içerik yok. Bağlantılar eklenecek.',
      items: [],
    },
    books: {
      kicker: 'Seçme Eserler',
      title: 'Kitaplar',
      intro: 'Anılarımda, gazete yazılarıma sığmayan hayatıma dönüyorum. Söyleşiler ve diğer çalışmalarımda ise yıllar boyunca üzerinde durduğum sorular var.',
      externalLabel: 'Kitap özetlerini görüntüle ↗',
      externalUrl: '',
      books: BOOKS.tr,
    },
    footer: {
      kicker: 'İletişim',
      navLabel: 'Alt menü',
      email: 'E-posta',
      columnsLabel: 'Köşe Yazıları',
      booksLabel: 'Kitaplar',
      backToTop: 'Başa dön ↑',
      rights: 'Tüm hakları saklıdır.',
      tagline: 'Hatırladıklarım ve yazdıklarım.',
      cookieLabel: 'Çerez Politikası',
    },
    cookieNotice: {
      ariaLabel: 'Çerez bildirimi',
      text: 'Bu site izleme veya reklam çerezi kullanmaz. Yalnızca tercihlerinizi hatırlamak için dil ve tema seçiminizi tarayıcınızda saklar.',
      policyLinkLabel: 'Çerez Politikası',
      acceptLabel: 'Anladım',
    },
    cookiePolicy: {
      kicker: 'Gizlilik',
      title: 'Çerez ve Veri Aydınlatma Metni',
      intro:
        'Bu sayfa, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve GDPR kapsamında, bu web sitesinin tarayıcınızda ne sakladığını ve cihazınızdan hangi verilerin çıktığını açıklar. Kısacası: bu site çerez kullanmaz ve sizi izlemez.',
      sections: [
        {
          heading: 'Çerez yok, izleme yok',
          body: [
            'Bu web sitesi hiçbir çerez kullanmaz. Hiçbir analitik, reklam veya üçüncü taraf profilleme yoktur — ziyaretleriniz ölçülmez ya da paylaşılmaz.',
          ],
        },
        {
          heading: 'Tarayıcınızda ne saklıyoruz',
          body: [
            'Tercihlerinizi hatırlamak için site, tarayıcınızın yerel deposunda (localStorage) iki işlevsel öğe saklar: dil tercihiniz ve açık/koyu tema tercihiniz. Bunlar sitenin sizin ayarladığınız gibi çalışması için zorunludur ve KVKK ile GDPR kapsamında önceden onay değil, yalnızca bilgilendirme gerektirir.',
            'Sayfanın altındaki bildirimi kapattığınızda, bu onay da ("cookie-consent" anahtarıyla) yerel olarak saklanır; böylece bildirim size tekrar gösterilmez. Bunların tümünü, tarayıcınızın site verilerini temizleyerek istediğiniz zaman silebilirsiniz.',
          ],
        },
        {
          heading: 'Üçüncü taraf isteği yok',
          body: [
            'Bu sitenin yüklediği her dosya — sayfalar, görseller, gazete kupürleri ve yazı tipleri — sitenin kendi adresinden gelir. Yazı tipleri önceden Google Fonts üzerinden isteniyordu ve bu, her sayfa görüntülemesinde IP adresinizin Google\u2019a iletilmesi anlamına geliyordu; artık buradan sunuluyorlar, dolayısıyla böyle bir istek yapılmıyor.',
            'Sitede analitik, reklam, takip pikseli ve gömülü üçüncü taraf içerik bulunmuyor. Ne okuduğunuz ölçülmüyor.',
            'Site Vercel üzerinde barındırılıyor; her web barındırıcısı gibi Vercel de tarayıcınızın yaptığı istekleri yanıtlayabilmek için alır. Bu, sitenin denetiminde değildir ve site Vercel adına bunu tarif edemez.',
          ],
        },
        {
          heading: 'Haklarınız ve iletişim',
          body: [
            'İşlenen tek kişisel veri yukarıda açıklanan tarayıcı depolaması olduğundan, kendi tarayıcı verinizi temizlemenin ötesinde erişilecek, düzeltilecek veya silinecek çok az şey vardır. Bu metin veya KVKK kapsamındaki haklarınızla ilgili her türlü soru için veri sorumlusuna sahinalpay44@gmail.com adresinden ulaşabilirsiniz.',
          ],
        },
      ],
    },
    reader: {
      copySourceLabel: 'Kaynak',
      citeLabel: 'Alıntıla',
      copied: 'Kopyalandı ✓',
      copyManual: 'Aşağıdaki metni seçip kopyalayın',
      accessed: 'Erişim:',
      bodyError: 'Yazının tam metni yüklenemedi. Bağlantınız kesilmiş olabilir.',
      bodyRetry: 'Yeniden dene',
    },
    notFound: {
      kicker: 'Bulunamadı',
      title: 'Bu adres bir sayfaya karşılık gelmiyor',
      body: 'İstediğiniz sayfa bu sitede yok. Adres yanlış yazılmış ya da bir bağlantı eski bir adresi taşıyor olabilir.',
      missingTitle: 'Bu yazı arşivde bu adreste değil',
      missingBody:
        'Yazı başka bir adrese kayıtlı olabilir ya da henüz arşive eklenmemiş olabilir. Başlığıyla aramak genellikle en hızlı yol.',
      backHome: 'Ana sayfaya git',
      browseArchive: 'Köşe yazılarına göz at',
    },
    clippingViewer: {
      heading: 'Gazete Kupürü',
      openPdf: 'Tamamını PDF olarak oku',
      openPdfHint: '(yeni sekmede açılır)',
      openImage: 'Kupürü tam boyutunda aç',
      openImageHint: '(yeni sekmede açılır)',
      pagesSuffix: 'sayfa',
    },
  },
}
