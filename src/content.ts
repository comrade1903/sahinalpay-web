/* ------------------------------------------------------------------
   Bilingual content for sahinalpay.net — English and Turkish.

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
  hub: { key: PageKey; title: string; description: string }[]
  about: {
    kicker: string
    title: string
    quote: string
    lead: string
    paragraphs: string[]
    /** One short headline per paragraph, same length/order — used as the
     *  personal-history timeline's era labels. */
    eras: string[]
    facts: { num: string; label: string }[]
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
  }
}

const BOOKS: Record<Lang, Book[]> = {
  en: [
    {
      year: '2025',
      title: 'Hikâyemin Sonu',
      desc: 'The closing volume of his memoirs — reflections on exile, conviction, and the price of dissent.',
      cover: coverHikayeminSonu,
      purchaseUrl: 'https://www.kitapyurdu.com/kitap/hikayemin-sonu-anilar-ikinci-kitap/710333.html',
    },
    {
      year: '2024',
      title: 'Bir Hikâyem Var',
      desc: 'A life recounted: from a boyhood in Ayvalık to the newsrooms, lecture halls, and cells that shaped a public voice.',
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
      desc: 'Anılarının son cildi — sürgün, inanç ve muhalefetin bedeli üzerine düşünceler.',
      cover: coverHikayeminSonu,
      purchaseUrl: 'https://www.kitapyurdu.com/kitap/hikayemin-sonu-anilar-ikinci-kitap/710333.html',
    },
    {
      year: '2024',
      title: 'Bir Hikâyem Var',
      desc: 'Anlatılan bir hayat: Ayvalık’taki çocukluktan, kamusal bir sesi biçimlendiren yazı işlerine, dersliklere ve hücrelere.',
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
      'Şahin Alpay — political scientist, author and journalist. Columns, books, and the story of a life spent defending a free press.',
    nav: [
      { key: 'about', label: 'About' },
      { key: 'columns', label: 'Columns' },
      { key: 'analyses', label: 'Analyses' },
      { key: 'interviews', label: 'Interviews' },
      { key: 'academic', label: 'Academic Articles' },
      { key: 'books', label: 'Books' },
    ],
    contactLabel: 'Contact',
    themeToggleLabel: 'Toggle light and dark theme',
    langToggleLabel: 'Türkçe sürüme geç',
    hero: {
      eyebrow: 'Political Scientist · Author · Journalist',
      intro:
        'A life spent in ideas and letters — and in the unyielding defence of a free press.',
      ctaStory: 'Who is Şahin Alpay?',
      ctaWorks: 'Read his columns',
      portraitAlt: 'Portrait of Şahin Alpay',
      portraitCaption: 'Şahin Alpay · b. 1944, Ayvalık',
    },
    hubKicker: 'Explore',
    hubTitle: 'All sections',
    hub: [
      {
        key: 'about',
        title: 'Who is Şahin Alpay?',
        description: 'His life, education and public career.',
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
        description: 'Published books and memoirs.',
      },
    ],
    about: {
      kicker: 'The Life',
      title: 'Who is Şahin Alpay?',
      quote:
        'To write honestly is not a privilege of good times. It is a duty in bad ones.',
      lead:
        'For more than half a century, Şahin Alpay has read Turkey to itself and to the world — as scholar, columnist, and stubborn democrat.',
      paragraphs: [
        'Born in Ayvalık in 1944, he studied at the Ankara University Faculty of Political Sciences before completing a doctorate in political science at Stockholm University. His years abroad, part study and part exile, shaped a conviction he never surrendered: that open debate is the oxygen of a healthy republic.',
        'He carried that conviction into the newsrooms of Cumhuriyet, Sabah, Milliyet and Zaman, and into lecture halls at Bahçeşehir, Boğaziçi and Princeton. His columns became a fixed point for readers seeking clarity amid noise — measured, comparative, and unafraid of inconvenient conclusions.',
        'After the July 15, 2016 coup attempt, he was detained and held for roughly twenty months. Turkey’s Constitutional Court and the European Court of Human Rights later ruled that his detention had violated his fundamental rights, and he was released in 2018 — a case that became emblematic of press freedom in Turkey.',
      ],
      eras: ['Education & Exile', 'Journalism & Academia', 'Detention & Vindication'],
      facts: [
        { num: '50+', label: 'Years in public life' },
        { num: '5', label: 'Newspapers & outlets' },
        { num: '3', label: 'Universities taught' },
        { num: '∞', label: 'Columns written' },
      ],
    },
    columns: {
      kicker: 'Columns',
      title: 'Columns',
      intro:
        'Five decades of newspaper columns. This archive is being assembled outlet by outlet — links and clippings are added as they are recovered.',
      emptyLabel: 'No items yet. Links and archived clippings will be added here.',
      outlets: [
        { outlet: 'Cumhuriyet', items: [] },
        { outlet: 'Sabah', items: [] },
        { outlet: 'Milliyet', items: [] },
        { outlet: 'Zaman', items: [] },
        { outlet: 'P24', items: [] },
      ],
    },
    analyses: {
      kicker: 'Analyses',
      title: 'Analyses',
      intro:
        'Magazine and newspaper analyses, grouped by source as the archive is expanded.',
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
      intro: 'Published interviews and conversations with Şahin Alpay.',
      emptyLabel: 'No items yet. Links and archived clippings will be added here.',
      items: [],
    },
    academicArticles: {
      kicker: 'Academic Articles',
      title: 'Academic Articles',
      intro: 'Academic articles and research publications.',
      emptyLabel: 'No items yet. Links will be added here.',
      items: [],
    },
    books: {
      kicker: 'Selected Works',
      title: 'Kitaplar',
      intro:
        'His published books, in the original Turkish. Full texts and summaries are hosted externally.',
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
      tagline: 'A personal & political legacy.',
    },
  },

  tr: {
    htmlTitle: 'Şahin Alpay — Siyaset Bilimci ve Yazar',
    htmlDescription:
      'Şahin Alpay — siyaset bilimci, yazar ve gazeteci. Köşe yazıları, analizler, söyleşiler, akademik makaleler ve kitapları.',
    nav: [
      { key: 'about', label: 'Kimdir?' },
      { key: 'columns', label: 'Köşe Yazıları' },
      { key: 'analyses', label: 'Analizler' },
      { key: 'interviews', label: 'Söyleşiler' },
      { key: 'academic', label: 'Akademik Makaleler' },
      { key: 'books', label: 'Kitaplar' },
    ],
    contactLabel: 'İletişim',
    themeToggleLabel: 'Açık ve koyu tema arasında geçiş yap',
    langToggleLabel: 'Switch to English version',
    hero: {
      eyebrow: 'Siyaset Bilimci · Yazar · Gazeteci',
      intro:
        'Fikirlere ve yazıya adanmış — ve özgür basının ödünsüz savunusuna vakfedilmiş bir ömür.',
      ctaStory: 'Şahin Alpay Kimdir?',
      ctaWorks: 'Köşe yazılarını okuyun',
      portraitAlt: 'Şahin Alpay’ın portresi',
      portraitCaption: 'Şahin Alpay · d. 1944, Ayvalık',
    },
    hubKicker: 'Keşfet',
    hubTitle: 'Tüm Bölümler',
    hub: [
      {
        key: 'about',
        title: 'Şahin Alpay Kimdir?',
        description: 'Hayatı, eğitimi ve kamusal kariyeri.',
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
        description: 'Kendisiyle yapılan söyleşi ve röportajlar.',
      },
      {
        key: 'academic',
        title: 'Akademik Makaleler',
        description: 'Akademik dergilerde yayımlanmış makaleleri.',
      },
      {
        key: 'books',
        title: 'Kitaplar',
        description: 'Yayımlanmış kitapları ve kitap özetleri.',
      },
    ],
    about: {
      kicker: 'Hayatı',
      title: 'Şahin Alpay Kimdir?',
      quote:
        'Dürüstçe yazmak iyi zamanların ayrıcalığı değil, kötü zamanların görevidir.',
      lead:
        'Şahin Alpay, yarım yüzyılı aşkın süredir Türkiye’yi hem kendisine hem dünyaya okuyor — bir bilim insanı, bir köşe yazarı ve inatçı bir demokrat olarak.',
      paragraphs: [
        '1944’te Ayvalık’ta doğdu. Ankara Üniversitesi Siyasal Bilgiler Fakültesi’ni bitirdikten sonra Stockholm Üniversitesi’nde siyaset bilimi doktorasını tamamladı. Yarısı öğrenim, yarısı sürgün geçen yurtdışı yılları, hiç vazgeçmediği bir inancı biçimlendirdi: Açık tartışma, sağlıklı bir cumhuriyetin oksijenidir.',
        'Bu inancı Cumhuriyet, Sabah, Milliyet ve Zaman’ın yazı işlerine; Bahçeşehir, Boğaziçi ve Princeton’ın dersliklerine taşıdı. Köşe yazıları, gürültünün ortasında berraklık arayan okurlar için sabit bir nokta oldu — ölçülü, karşılaştırmalı ve rahatsız edici sonuçlardan korkmayan.',
        '15 Temmuz 2016 darbe girişiminin ardından gözaltına alındı ve yaklaşık yirmi ay tutuklu kaldı. Türkiye Anayasa Mahkemesi ve Avrupa İnsan Hakları Mahkemesi, tutukluluğunun temel haklarını ihlal ettiğine hükmetti; 2018’de serbest bırakıldı. Dava, Türkiye’de basın özgürlüğünün önemli bir simgesi hâline geldi.',
      ],
      eras: ['Eğitim ve Sürgün Yılları', 'Gazetecilik ve Akademi', 'Gözaltı ve Adalet Mücadelesi'],
      facts: [
        { num: '50+', label: 'Kamusal hayatta yıl' },
        { num: '8', label: 'Gazete ve dergi' },
        { num: '3', label: 'Ders verdiği üniversite' },
        { num: '∞', label: 'Köşe yazısı' },
      ],
    },
    columns: {
      kicker: 'Köşe Yazıları',
      title: 'Köşe Yazıları',
      intro:
        'Beş on yılı aşkın gazete yazılarından bir arşiv. Bağlantılar ve gazete küpürleri, yayın bazında eklenmektedir.',
      emptyLabel: 'Bu bölümde henüz içerik yok. Bağlantılar ve gazete küpürleri eklenecek.',
      outlets: [
        { outlet: 'Cumhuriyet', items: [] },
        { outlet: 'Sabah', items: [] },
        { outlet: 'Milliyet', items: [] },
        { outlet: 'Zaman', items: [] },
        {
          outlet: 'P24',
          items: [],
        },
      ],
    },
    analyses: {
      kicker: 'Analizler',
      title: 'Analizler',
      intro:
        'Dergi ve gazetelerde yayımlanmış analiz yazıları. İçerikler kaynak yayın bazında eklenmektedir.',
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
      intro: 'Kendisiyle yapılan söyleşi ve röportajlar.',
      emptyLabel: 'Bu bölümde henüz içerik yok. Bağlantılar ve gazete küpürleri eklenecek.',
      items: [],
    },
    academicArticles: {
      kicker: 'Akademik Makaleler',
      title: 'Akademik Makaleler',
      intro: 'Akademik dergilerde yayımlanmış makaleler.',
      emptyLabel: 'Bu bölümde henüz içerik yok. Bağlantılar eklenecek.',
      items: [],
    },
    books: {
      kicker: 'Seçme Eserler',
      title: 'Kitaplar',
      intro: 'Yayımlanmış kitapları. Tam metinler ve kitap özetleri dış bağlantı olarak sunulmaktadır.',
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
      tagline: 'Kişisel ve siyasi bir miras.',
    },
  },
}
