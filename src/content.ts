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
import coverGuleninKatkisi from './assets/covers/gulenin-katkisi.jpg'
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
  externalLabel: string
  externalUrl: string
  externalPendingNote: string
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
    ctaWorks: string
    portraitAlt: string
    portraitCaption: string
  }
  hubKicker: string
  hubTitle: string
  chronicleIntro: string
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
    summaryLabel: string
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
      year: '2004',
      title: 'Gülen’in Katkısı',
      desc: 'An essay on faith, civil society, and the contested currents of modern Turkish politics.',
      cover: coverGuleninKatkisi,
      purchaseUrl: 'https://www.kitapyurdu.com/kitap/gulenin-katkisi/63179.html',
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
      year: '2004',
      title: 'Gülen’in Katkısı',
      desc: 'İnanç, sivil toplum ve modern Türkiye siyasetinin çekişmeli akımları üzerine bir deneme.',
      cover: coverGuleninKatkisi,
      purchaseUrl: 'https://www.kitapyurdu.com/kitap/gulenin-katkisi/63179.html',
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
        'Trying to understand Turkey led me to question my own ideas. These pages bring together my writing and the life behind it.',
      ctaStory: 'Who is Şahin Alpay?',
      ctaWorks: 'Read my columns',
      portraitAlt: 'Portrait of Şahin Alpay',
      portraitCaption: 'Şahin Alpay · b. 1944, Istanbul',
    },
    hubKicker: 'Explore',
    hubTitle: 'All sections',
    chronicleIntro: 'My writing alongside the events of its time. Gaps in this archive do not necessarily mean that I stopped writing.',
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
      "subtitle": "Looking back, I wanted to write about the people I shared my life with as well as the ideas I held.",
      "lead": "Şahin Alpay’s life from Istanbul and Ayvalık to Sweden, journalism and teaching; his changing ideas, imprisonment in Silivri and life with Fatma.",
      "editorialNote": "Written for this website in the first person, drawing on Şahin Alpay’s memoirs and essays. It contains no quotations from his books.",
      "contentsLabel": "On this page",
      "sections": [
        {
          "id": "a-life-in-writing",
          "title": "The life behind my writing",
          "paragraphs": [
            "Some readers know me through my newspaper columns. Others met me in a university classroom; some first heard my name when I was arrested. All of these belong to my life. But if I introduce myself only by listing the newspapers I worked for and the ideas I defended, much of the story will be missing. I also need to speak of Fatma, my family and friends, and what my decisions meant for them.",
            "For many years I concerned myself with Turkey’s problems. I wanted it to become a freer, fairer country, where people could live without the constant struggle to make ends meet. My views on how to achieve that changed. I moved away from ideas I had once considered beyond doubt. Looking back, I can understand my youthful enthusiasm without approving of every decision it led me to make. I tried to keep that distance while writing my memoirs. The things I find uncomfortable to say about myself belong in the story too."
          ]
        },
        {
          "id": "istanbul-ayvalik",
          "title": "Born in Istanbul, rooted in Ayvalık",
          "paragraphs": [
            "I was born in Istanbul on 18 April 1944, to Sabiha and Ahmet Alpay. My family’s history reaches through Ayvalık to the other side of the Aegean, to Lesbos and Serres. Ayvalık became my hometown. My ties to it lasted while I was at school in Istanbul and, later, living abroad. Migration, displacement and the effort to establish a new life were part of the family history I inherited.",
            "Our childhood was not free of difficulties. My father’s illness deeply affected our family life. My mother worked hard to keep us together and took great care over our education. My sisters and brother helped bring me up too. My love of reading and my confidence owe much to them. The help my brother would later give me at a difficult moment taught me still more about family loyalty. I cannot describe the course of my life without acknowledging what these people made possible."
          ]
        },
        {
          "id": "education",
          "title": "School and a wider world",
          "paragraphs": [
            "I attended Nilüfer Hatun Primary School in Nişantaşı, the English High School for Boys and then Robert College. An AFS scholarship took me to the Webb School in California for the 1961–1962 school year. I was seventeen. Joining the everyday life of people outside my familiar surroundings widened my understanding of the world. When I returned, Turkey’s poverty and lack of freedom occupied my thoughts more than before.",
            "I gave up the opportunity to study at Columbia University on a scholarship and went to Ankara’s Faculty of Political Sciences, known as Mülkiye. Fatma had much to do with that choice. I began in 1963 and graduated in 1967. Those years were about more than lectures. I acted in plays, served in the student association and became involved in politics. I met many friends whose lives would later take different directions from mine. We had our adult lives ahead of us, and considerable confidence in our ability to change our country."
          ]
        },
        {
          "id": "youth",
          "title": "The certainties of youth",
          "paragraphs": [
            "My search for an explanation of Turkey’s underdevelopment drew me towards the left. I was first influenced by the Workers’ Party of Turkey. In time I adopted more rigid interpretations of Marxism and came to believe that revolution would solve society’s problems. I joined the Aydınlık circle and worked with Doğu Perinçek. How much of our argument reflected the realities of the country, and how much the theories we had read? I would often ask myself that later.",
            "In 1971 I joined the Palestinian resistance movement and spent time in camps in Syria and Lebanon. I had left my wife and our young daughter behind. Facing the pain that decision caused my family was difficult. I had doubts about the movement I belonged to, yet struggled to leave it. Eventually I returned to Turkey. Deciding to withdraw from revolutionary politics also meant questioning the role I had assigned myself. When I remember those years, I consider both my own responsibility and the political circumstances. Leaving either out would make the account incomplete."
          ]
        },
        {
          "id": "sweden",
          "title": "Starting again in Sweden",
          "paragraphs": [
            "I was wanted during the military rule that followed the March 1971 intervention. With my brother’s help, I left Turkey in 1972 and sought refuge in Sweden, a country where I had never imagined living. I needed to learn a language, find work and discover whether I could continue my studies. Above all, I wanted to be reunited with Fatma and Elvan. We had been apart for a long time. Their arrival in Stockholm in 1974 remains one of the great joys of my life.",
            "I joined political science research at Stockholm University. The opportunity my teacher Tomas Hammar gave me changed my future. I studied the social and political lives of migrants from Turkey and completed my doctorate in 1981. While doing research, I was also getting to know the country around me. I saw how social protections, democratic institutions and personal freedoms could work together. That experience contributed greatly to my reconsideration of the ideas I had adopted when I was young.",
            "During those years my thinking moved towards social liberalism. Reducing inequality still mattered to me; I was looking for a political order that would do so while protecting individual freedom. Returning to Turkey was a new beginning in that sense too. I brought home a doctorate and a changed outlook. Not all my old friends would welcome the change."
          ]
        },
        {
          "id": "journalism",
          "title": "Finding my place in journalism",
          "paragraphs": [
            "When I returned in 1981, I hoped to work at a university. That did not happen immediately. I first worked on encyclopedias, then joined Cumhuriyet at Hasan Cemal’s invitation towards the end of 1982. Working with books, research and intellectual debates from abroad, and bringing them to newspaper readers, suited me. But finding a place in a newsroom does not mean agreeing with everyone in it. My years at Cumhuriyet taught me that as well.",
            "I left the newspaper in 1992. I worked at TÜSES and briefly advised the Republican People’s Party. Sabah and Milliyet followed. On the Entellektüel Bakış page I gave space to scholars, writers and thinkers from different countries. Interviews offered a chance to learn how someone else thought. I was interested in what observers of Turkey could see, and what they missed, depending on whether they looked from within the country or from outside. Some of these conversations later appeared in the Türkiye’nin Tanıkları books.",
            "There were times in my journalism career when I lost my job and had to find another. Setting the names of my employers beside one another may suggest an orderly professional path. It did not look that way while I was living it. Help from a friend, an unexpected offer, a disagreement or the need to earn a living could determine what came next."
          ]
        },
        {
          "id": "teaching",
          "title": "In the classroom and on the page",
          "paragraphs": [
            "I never entirely lost touch with academic work. I taught at Boğaziçi and was a visiting professor at Princeton in 1998. In 2001 I joined Bahçeşehir University, where I taught politics until 2015. Comparing Turkey’s political life with other countries’ experiences was a way of thinking I used in both my teaching and my writing. Discovering how an apparently distinctively Turkish problem had been addressed elsewhere could open up a discussion.",
            "I began writing columns for Zaman in 2002. I worked at the university and contributed from outside the newspaper. My English columns later appeared in Today’s Zaman. Television programmes also allowed me to reach different audiences. In my memoirs I discuss my reasons for writing for Zaman. I thought I could engage a religious readership in a conversation about liberal democracy and wanted to share my views. I needed to explain both the expectations behind that choice and the problems I came to see."
          ]
        },
        {
          "id": "ideas",
          "title": "Accounting for hopes and mistakes",
          "paragraphs": [
            "I placed great importance on Turkey’s aim of joining the European Union. I believed it would strengthen the rule of law and extend rights and freedoms. That was why I supported the AKP’s early reforms. My support rested on the prospect of a more democratic Turkey. As the government moved away from that course, my criticism grew. I argued that winning an election did not exempt those in power from legal restraint or public scrutiny.",
            "My view of the Gülen movement was also influenced by a search for an interpretation of religion compatible with pluralist democracy. But my opportunities to know the movement were limited. Beyond the impressions I gained from the people I encountered, I did not know its internal workings. That limit needs to be stated in any account of my earlier judgments. I try to distinguish what I knew at the time, what I did not know, and how much my hopes shaped my assessment.",
            "Looking back over my public life, I cannot say that the Turkey I wished for has come into being. Some of my expectations were disappointed. Pretending that I had never held them would not be honest either. My columns record what I thought at different times. My memoirs gave me room to explain the circumstances in which those views developed and how experience changed them. Examining oneself does not prevent every mistake; I still believe it is necessary for an honest account of the past."
          ]
        },
        {
          "id": "silivri",
          "title": "Silivri and the return home",
          "paragraphs": [
            "I was taken into custody on 27 July 2016 and remanded in prison on 31 July. I was seventy-two. I spent roughly twenty months in Silivri. Freedom, a subject I had written about for so long, now meant a personal deprivation that shaped every hour. I was separated from my family. My health, my loved ones outside and the uncertainty of the proceedings occupied my thoughts.",
            "I read, kept notes and wrote letters when I was allowed to do so. The support of my family and friends mattered enormously in sustaining me. I have not forgotten the kindness of people whose views differed from mine. Those experiences informed my later writing about friendship. More than once in my life I have seen that standing by someone in difficulty and agreeing with their politics are separate things.",
            "Turkey’s Constitutional Court and the European Court of Human Rights found violations of my rights in connection with my detention. I left prison in March 2018 and spent a further period under house arrest. Being with my family again brought great happiness. But coming home did not remove all the consequences of what had happened. The proceedings continued, while we tried to resume everyday life together after the long separation."
          ]
        },
        {
          "id": "fatma-memoirs",
          "title": "Fatma and what I wanted to remember",
          "paragraphs": [
            "I met Fatma as a child. We married in 1965. Our daughter Elvan and son Acar were born; years later our granddaughters Defne and Leyla joined the family. While my political views changed and my working life moved between institutions, Fatma had her own judgments and convictions. She did not agree with everything I thought. That is one reason she has such a large place in my memoirs: I wanted to make room for her distinct personality, the times she challenged me, and what she did for our family.",
            "Our marriage contained difficulties as well as happiness. My decisions affected others; Fatma and the children bore some of the costs. Thinking about this is one of the hardest parts of recounting the past. After my release from Silivri, Fatma and I had only about six more months together. She died on 6 October 2018. My wish to complete my memoirs grew stronger. I wanted to write for our family, so that our children and grandchildren could know us more closely.",
            "In Bir Hikâyem Var I describe the world I grew up in, my youth, Sweden and my earlier years in journalism. Hikâyemin Sonu returns to the 2000s, Zaman, Silivri and my last months with Fatma. Behind the people and decisions mentioned briefly here are long relationships, conversations and doubts. Much of my life is in those details. I would like readers to know the person behind the columns, including the people he loved, the mistakes he made and what he learned."
          ]
        }
      ],
    },
    columns: {
      kicker: 'Columns',
      title: 'Columns',
      intro:
        "My English columns for Today's Zaman, on Turkey and the wider world. These articles record the questions I asked and the judgments I reached between 2007 and 2012; my Turkish columns are in the Turkish archive.",
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
      externalPendingNote: 'External link to be added.',
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
            'Because the only personal data involved is the browser storage described above, there is very little to access, correct, or delete beyond clearing your own browser data. For any question about this notice or your rights under KVKK, you can reach the data controller at contact@sahinalpay.com.',
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
      summaryLabel: 'About this piece',
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
        'Türkiye’yi anlamaya çalışırken kendi fikirlerimi de sorguladım. Bu sayfalarda o yılların yazıları ve hayatımdan izler var.',
      ctaStory: 'Şahin Alpay Kimdir?',
      ctaWorks: 'Yazılarımı okuyun',
      portraitAlt: 'Şahin Alpay’ın portresi',
      portraitCaption: 'Şahin Alpay · d. 1944, İstanbul',
    },
    hubKicker: 'Keşfet',
    hubTitle: 'Tüm Bölümler',
    chronicleIntro: 'Yazılarım, yazıldıkları yılların olaylarıyla yan yana. Arşivdeki boşluklar, o yıllarda yazmadığım anlamına gelmiyor.',
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
      "subtitle": "Geçmişime bakarken fikirlerim kadar, hayatımı paylaştığım insanları da anlatmak istedim.",
      "lead": "Şahin Alpay’ın İstanbul ve Ayvalık’tan İsveç’e, gazetecilikten üniversiteye uzanan hayatı; değişen düşünceleri, Silivri yılları ve Fatma’yla beraberliği.",
      "editorialNote": "Bu sayfa için Şahin Alpay’ın anı kitapları ve yazıları temel alınarak birinci tekil şahısla hazırlanmıştır. Kitaplarından alıntı içermez.",
      "contentsLabel": "Bu sayfada",
      "sections": [
        {
          "id": "a-life-in-writing",
          "title": "Yazılarımın gerisindeki hayat",
          "paragraphs": [
            "Beni gazete yazılarımdan tanıyanlar var. Bazılarıyla bir üniversite dersliğinde karşılaştık; bazıları adımı ilk kez tutuklandığımda duydu. Bunların hepsi benim hayatıma ait. Fakat kendimi anlatmaya yalnızca çalıştığım gazeteleri ve savunduğum fikirleri sıralayarak başlarsam, hikâyenin önemli bir kısmı eksik kalır. Fatma’yı, ailemi, dostlarımı, kararlarımın onlara neler yaşattığını da anlatmam gerekir.",
            "Uzun yıllar ülkenin meseleleriyle uğraştım. Türkiye’nin daha özgür, daha adil, insanların geçim sıkıntısından kurtulduğu bir yer olmasını istedim. Bunun nasıl gerçekleşeceğine dair kanaatlerim ise aynı kalmadı. Bir zamanlar bütün açıklığıyla doğru sandığım düşüncelerden uzaklaştım. Bugün geçmişime bakarken gençliğimin heyecanını anlayabiliyorum; o heyecanla verdiğim her kararı haklı bulamıyorum. Anılarımı yazarken bu mesafeyi korumaya çalıştım. Kendim hakkında söylemekten hoşlanmadığım şeylerin de hikâyede yeri var."
          ]
        },
        {
          "id": "istanbul-ayvalik",
          "title": "İstanbul’da doğdum, Ayvalık’ta kök saldım",
          "paragraphs": [
            "18 Nisan 1944’te İstanbul’da dünyaya geldim. Annem Sabiha, babam Ahmet’ti. Ailemizin geçmişi Ayvalık’a, oradan da Ege’nin öte yakasına, Midilli’ye ve Serez’e uzanıyordu. Ayvalık benim memleketim oldu. İstanbul’da okula giderken de, yıllar sonra başka ülkelerde yaşarken de orayla bağım sürdü. Ailemin hikâyesinde göçün, yer değiştirmek zorunda kalmanın ve yeniden bir hayat kurmanın geniş bir yeri vardı.",
            "Çocukluğumuz sorunsuz geçmedi. Babamın rahatsızlığı aile düzenimizi derinden etkiledi. Annem bizi bir arada tutmak için büyük çaba gösterdi; eğitimimiz üzerinde titizlikle durdu. Ablalarım ve ağabeyim de yetişmemde pay sahibiydi. Okumaya merakımda, kendime duyduğum güvende onların izleri var. Daha sonra hayatımın zor bir döneminde ağabeyimden göreceğim yardım, aile bağının ne demek olduğunu bana bir kez daha gösterecekti. Bugün nerelerden geçtiğimi anlatırken bu insanların katkısını bir kenara koyamam."
          ]
        },
        {
          "id": "education",
          "title": "Okullar ve açılan dünya",
          "paragraphs": [
            "İlkokulu Nişantaşı’ndaki Nilüfer Hatun’da, ortaokulu İngiliz Erkek Lisesi’nde okudum. Ardından Robert Kolej geldi. 1961–1962 öğretim yılında AFS bursuyla Kaliforniya’daki Webb School’a gittim. Henüz on yedi yaşındaydım. O güne kadar bildiğim çevrenin dışında, başka insanların gündelik hayatına katılmak, dünyaya bakışımı genişletti. Amerika’dan dönerken Türkiye’nin yoksulluğu ve özgürlük sorunları zihnimi eskisinden daha fazla meşgul ediyordu.",
            "Columbia Üniversitesi’nde burslu öğrenim görme imkânından vazgeçip Ankara’ya, Mülkiye’ye gittim. Bu tercihimde Fatma’nın yeri büyüktü. 1963’te başladığım Siyasal Bilgiler Fakültesi’nden 1967’de mezun oldum. Mülkiye yıllarım derslerle sınırlı kalmadı. Tiyatro yaptım, öğrenci derneğinde görev aldım, siyasetin içine girdim. Sonraki yıllarda birbirimizden farklı yollara sapacağımız pek çok dostumu orada tanıdım. O yaşlarda önümüzde uzun bir hayat vardı; memleketi değiştirebileceğimize duyduğumuz güven de hayli büyüktü."
          ]
        },
        {
          "id": "youth",
          "title": "Gençliğin kesin cevapları",
          "paragraphs": [
            "Sol düşünceye yaklaşmamda, Türkiye’nin neden geri kaldığına bir açıklama aramamın payı vardı. Önce Türkiye İşçi Partisi’nin görüşlerinden etkilendim. Zamanla Marksizmin daha katı yorumlarını benimsedim; devrimin toplumun sorunlarını çözeceğine inandım. Aydınlık çevresinde yer aldım, Doğu Perinçek’le birlikte çalıştım. O yıllardaki tartışmalarımızın ne kadarını ülkenin gerçekleri, ne kadarını okuduğumuz teoriler belirliyordu? Sonradan kendime bu soruyu çok sordum.",
            "1971’de Filistin direniş hareketine katıldım; Suriye ve Lübnan’daki kamplarda bulundum. Geride eşimi ve küçük kızımızı bırakmıştım. Bu kararın aileme verdiği acıyla yüzleşmek kolay olmadı. İçinde yer aldığım hareketten kuşkulanıyor, buna rağmen ondan kopmakta zorlanıyordum. Bir süre sonra Türkiye’ye döndüm. Devrimci mücadeleden ayrılmaya karar vermem, o güne kadar kendime biçtiğim rolü de sorgulamamı gerektirdi. Bu yılları hatırlarken hem kendi sorumluluğumu hem de içinde bulunduğumuz siyasi ortamı düşünürüm. Birini anlatıp ötekini görmezden gelmek, olanları anlamaya yetmez."
          ]
        },
        {
          "id": "sweden",
          "title": "İsveç’te yeniden başlamak",
          "paragraphs": [
            "12 Mart döneminde aranıyordum. 1972’de ağabeyimin yardımıyla Türkiye’den ayrıldım ve İsveç’e sığındım. Daha önce orada yaşayacağımı düşünmemiştim. Yeni bir dil öğrenmem, iş bulmam, eğitimime nasıl devam edebileceğimi araştırmam gerekiyordu. En çok da Fatma’yla Elvan’a kavuşmak istiyordum. Ayrılık uzamıştı. Onların 1974’te Stockholm’e gelişi, hayatımda büyük sevinçle hatırladığım olaylardan biridir.",
            "Stockholm Üniversitesi’nde siyaset bilimi çalışmalarına katıldım. Hocam Tomas Hammar’ın bana açtığı imkân, hayatımın yönünü değiştirdi. Türkiye’den İsveç’e göç eden insanların toplumsal ve siyasi hayatını araştırdım; doktoramı 1981’de tamamladım. Bir yandan araştırma yapıyor, bir yandan içinde yaşadığım ülkeyi tanıyordum. Sosyal güvencelerin, demokratik kurumların ve kişisel özgürlüklerin bir arada nasıl işleyebildiğini yakından gördüm. Gençliğimde benimsediğim fikirleri yeniden tartmamda bu tecrübenin büyük payı oldu.",
            "İsveç yıllarında düşüncelerim giderek sosyal liberal bir anlayışa yaklaştı. Eşitsizliklerin giderilmesini önemsemeye devam ediyordum; bunu yaparken bireyin özgürlüğünü koruyacak bir düzen arıyordum. Türkiye’ye dönüşüm bu bakımdan da bir başlangıçtı. Yanımda bir doktora diplomasıyla birlikte değişmiş kanaatler getiriyordum. Eski arkadaşlarımın hepsi bu değişimi hoş karşılamayacaktı."
          ]
        },
        {
          "id": "journalism",
          "title": "Gazetecilikte yerimi ararken",
          "paragraphs": [
            "1981’de yurda döndüğümde üniversitede çalışmak istiyordum. Bu isteğim hemen gerçekleşmedi. Önce ansiklopedicilik yaptım; 1982’nin sonlarında, Hasan Cemal’in çağrısı üzerine Cumhuriyet kadrosuna katıldım. Kitaplarla, araştırmalarla, dış dünyadaki düşünce tartışmalarıyla uğraşmak ve bunları gazete okuruna ulaştırmak bana uygundu. Fakat bir gazetede kendinize yer bulmak, oradaki herkesle aynı fikirde olduğunuz anlamına gelmiyor. Cumhuriyet’te geçen yıllarımda bunu da öğrendim.",
            "1992’de gazeteden ayrıldım. TÜSES’te çalıştım, bir süre CHP’de danışmanlık yaptım. Ardından Sabah ve Milliyet geldi. Entellektüel Bakış sayfasında bilim insanlarının, yazarların, farklı ülkelerden düşünürlerin söylediklerine yer verdim. Söyleşiler benim için başkasının düşüncesini öğrenme imkânıydı. Türkiye üzerine konuşan birinin ülkeye içeriden mi dışarıdan mı baktığı, neleri görebildiği, neleri gözden kaçırdığı ilgimi çekiyordu. Bu görüşmeler daha sonra Türkiye’nin Tanıkları kitaplarında da bir araya geldi.",
            "Gazetecilik hayatımda işimi kaybettiğim, yeniden iş aradığım zamanlar oldu. Çalıştığım kurumların adlarını yan yana yazınca düzgün bir meslek çizgisi görünebilir. O yılları yaşarken önümde böyle hazır bir çizgi yoktu. Dostların yardımı, beklenmedik bir teklif, bir anlaşmazlık, geçinme zorunluluğu sonraki adımda etkili olabiliyordu."
          ]
        },
        {
          "id": "teaching",
          "title": "Derslikte ve gazete sayfasında",
          "paragraphs": [
            "Akademik çalışmayla bağım hiçbir zaman bütünüyle kopmadı. Boğaziçi’nde ders verdim; 1998’de Princeton Üniversitesi’nde konuk öğretim üyesi olarak bulundum. 2001’de Bahçeşehir Üniversitesi’nde çalışmaya başladım ve 2015’e kadar orada siyaset dersleri verdim. Türkiye’nin siyasi hayatını başka ülkelerin tecrübeleriyle karşılaştırarak düşünmek, hem derslerimde hem yazılarımda başvurduğum bir yoldu. Türkiye’ye özgü görünen bir meselenin başka bir yerde nasıl ele alındığını bilmek, tartışmayı genişletebiliyordu.",
            "2002’de Zaman’da köşe yazmaya başladım. Üniversitede çalışıyor, yazılarımı dışarıdan gönderiyordum. Daha sonra İngilizce yazılarım Today’s Zaman’da da yayımlandı. Televizyonda yaptığım programlarla birlikte, farklı okur ve dinleyicilere ulaşma imkânım oldu. Zaman’da yazmamın gerekçelerini anılarımda ayrıca ele aldım. Dindar bir okur çevresiyle özgürlükçü demokrasi üzerine konuşabileceğimi düşünüyor, görüşlerimi paylaşmak istiyordum. Bu tercihin bende uyandırdığı beklentileri de, sonradan gördüğüm sorunları da anlatmam gerekiyordu."
          ]
        },
        {
          "id": "ideas",
          "title": "Umutlarımı da yanılgılarımı da yazmak",
          "paragraphs": [
            "Türkiye’nin Avrupa Birliği’ne katılma hedefini önemsedim. Bu hedefin hukuk devletini güçlendireceğini, hak ve özgürlükleri genişleteceğini düşünüyordum. AKP’nin ilk yıllarındaki reformlarını bu nedenle destekledim. Desteğimin gerekçesi, Türkiye’nin daha demokratik bir ülke olabileceğine dair beklentimdi. İktidar bu yönden uzaklaştıkça eleştirilerim arttı. Seçim kazanmanın, iktidarı denetimden ve hukuktan bağımsız kılmayacağını yazdım.",
            "Gülen hareketine bakışımda da, dinle çoğulcu demokrasinin bağdaşabileceği bir yorum arayışım etkiliydi. Ancak hareketi tanıma imkânım sınırlıydı. Temas ettiğim çevrelerden edindiğim izlenimlerin ötesinde, iç işleyişini bilmiyordum. Geçmişteki değerlendirmelerimi anlatırken bu sınırı belirtmek gerekiyor. O gün neyi bildiğimi, neyi bilmediğimi, hangi umuda ne kadar pay verdiğimi birbirinden ayırmaya çalışıyorum.",
            "Siyasi hayatıma dönüp baktığımda, istediğim Türkiye’ye ulaşılmış olduğunu söyleyemem. Bazı beklentilerim boşa çıktı. Bunları sonradan hiç taşımamışım gibi davranmak da bana doğru gelmiyor. Yazılarım farklı yıllarda ne düşündüğümü gösteriyor. Anılarımda ise bu düşüncelerin hangi şartlarda oluştuğunu, yaşadıklarımın onları nasıl etkilediğini anlatma fırsatı buldum. Kendini sorgulamak insanı her yanlıştan korumuyor; yine de geçmişe dürüstçe bakabilmenin buna bağlı olduğunu düşünüyorum."
          ]
        },
        {
          "id": "silivri",
          "title": "Silivri ve eve dönüş",
          "paragraphs": [
            "Gözaltına alındığım tarih 27 Temmuz 2016’ydı. Dört gün sonra, 31 Temmuz’da tutuklanarak cezaevine gönderildim. Yetmiş iki yaşındaydım. Yaklaşık yirmi ay Silivri’de kaldım. Uzun süre üzerine yazdığım özgürlük meselesi, şimdi günün her saatini belirleyen kişisel bir yoksunluktu. Ailemden ayrıydım. Sağlığım, dışarıdaki yakınlarım, yargılamanın ne zaman ve nasıl sonuçlanacağı zihnimi meşgul ediyordu.",
            "Cezaevinde okudum, notlar tuttum, mektup yazma imkânı doğunca yazdım. Ailemin ve dostlarımın desteği, içerideki hayatı sürdürebilmemde çok önemliydi. Aynı düşünceleri paylaşmadığımız insanların gösterdiği yakınlığı da unutmadım. Dostluk üzerine daha sonra yazdıklarımda bu tecrübelerin yeri var. Bir insanın zor zamanında yanında bulunmakla onun siyasi görüşlerine katılmanın ayrı şeyler olduğunu hayatım boyunca birkaç kez gördüm.",
            "Anayasa Mahkemesi ve Avrupa İnsan Hakları Mahkemesi, tutukluluğumla ilgili hak ihlali kararları verdi. Mart 2018’de cezaevinden çıktım; bir süre ev hapsinde kaldım. Aileme kavuşmak büyük bir sevinçti. Fakat eve dönmek, yaşananların bütün sonuçlarının ortadan kalkması demek değildi. Yargılama sürüyordu; biz de uzun ayrılıktan sonra gündelik hayatımızı yeniden birlikte yaşamaya çalışıyorduk."
          ]
        },
        {
          "id": "fatma-memoirs",
          "title": "Fatma ve hatırlamak istediklerim",
          "paragraphs": [
            "Fatma’yı çocukken tanıdım. 1965’te evlendik. Kızımız Elvan ve oğlumuz Acar doğdu; yıllar sonra torunlarımız Defne ve Leyla hayatımıza katıldı. Benim siyasi tercihlerim değişirken, iş hayatım bir kurumdan ötekine taşınırken Fatma’nın kendi yargıları, kendi duruşu vardı. Her düşünceme katılmıyordu. Anılarımda ona bu kadar yer vermemin bir nedeni de bu: Hayatımı anlatırken onun ayrı kişiliğini, bana karşı çıktığı zamanları, ailemiz için yaptıklarını da görünür kılmak istedim.",
            "Evliliğimizin içinde mutluluk kadar sıkıntı da vardı. Kararlarımdan yalnız ben etkilenmedim; bazı bedelleri Fatma ve çocuklarım da ödedi. Bunu düşünmek, geçmişi anlatmanın en zor taraflarından biri. Silivri’den döndükten sonra Fatma’yla ancak altı ay kadar birlikte olabildik. Onu 6 Ekim 2018’de kaybettim. Ardından anılarımı tamamlama isteğim daha da güçlendi. Ailemiz için, çocuklarımızın ve torunlarımızın bizi daha yakından tanıyabilmesi için yazmak istiyordum.",
            "Bir Hikâyem Var’da yetiştiğim çevreyi, gençliğimi, İsveç yıllarını ve gazeteciliğimin ilk dönemlerini anlattım. Hikâyemin Sonu’nda 2000’li yıllara, Zaman’a, Silivri’ye ve Fatma’yla son aylarımıza döndüm. Burada birkaç cümleyle geçtiğim insanların ve kararların arkasında uzun beraberlikler, konuşmalar, tereddütler var. Benim hayatım biraz da o ayrıntılarda. Okurlarımın yazılarımın gerisindeki insanı tanımasını isterim; sevdikleriyle, yanılgılarıyla, öğrendikleriyle."
          ]
        }
      ],
    },
    columns: {
      kicker: 'Köşe Yazıları',
      title: 'Köşe Yazıları',
      intro:
        'Türkiye’de ve dünyada olup bitenleri anlamak için yazdım. Cumhuriyet’ten P24’e uzanan bu arşivde, farklı yıllarda sorduğum sorular ve vardığım sonuçlar bir arada.',
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
      externalPendingNote: 'Dış bağlantı eklenecek.',
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
            'İşlenen tek kişisel veri yukarıda açıklanan tarayıcı depolaması olduğundan, kendi tarayıcı verinizi temizlemenin ötesinde erişilecek, düzeltilecek veya silinecek çok az şey vardır. Bu metin veya KVKK kapsamındaki haklarınızla ilgili her türlü soru için veri sorumlusuna contact@sahinalpay.com adresinden ulaşabilirsiniz.',
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
      summaryLabel: 'Bu yazı hakkında',
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
