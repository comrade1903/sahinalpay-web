/** "Fotoğraflarla Hikayem" — Şahin Alpay's life told through 36 photographs
 *  and his own captions, in the order of the owner's document
 *  (Foto/fotohikaye.md, supplied 2026-10-13; scans in Foto/taramalar),
 *  except 028 (the children and grandchildren), which the owner moved to
 *  the end on 2026-10-15. 029 (Fatma at the Great Wall of China, 1999) is
 *  kept with its caption but `hidden` from the page since 2026-10-25, at the
 *  owner's request; its image files moved out of the repo to Foto/hikayem,
 *  so showing it again means copying them back into public/photos/hikayem.
 *  The Turkish captions are verbatim. The English ones are translations the
 *  owner asked for on 2026-11-07; the English page shows only those.
 *
 *  Images are served from public/photos/hikayem/<id>-<800|1600>.jpg, made by
 *  resizing the scans with EXIF orientation applied and all metadata dropped
 *  (some phone photos carried location data). `width`/`height` are the
 *  1600 version's, so the page reserves each photo's space before it loads.
 *
 *  026 is made from Foto/taramalar/026.png, a restored version without the
 *  camera's date imprint that the owner supplied on 2026-10-18 to replace
 *  the scan (026.jpg); its 1600 version is upscaled slightly from the PNG's
 *  1537px width.
 *
 *  In captions, *x* marks a publication name in italics and **x** the owner's
 *  own bold, as in his document. */
import type { Lang } from './content'

export interface PhotoStoryPhoto {
  id: string
  width: number
  height: number
  /** Only where the caption does not describe the picture itself. */
  alt?: Record<Lang, string>
}

export interface PhotoStoryEntry {
  /** One photo, or two shown side by side. */
  photos: PhotoStoryPhoto[]
  caption: Record<Lang, string>
  /** Kept in the record but not shown on the page or in its prerendered
   *  fallback, at the owner's request. A hidden entry's image files need not
   *  be in public/. */
  hidden?: boolean
}

export const PHOTO_STORY_DIR = '/photos/hikayem'

export function photoSrc(id: string, width: 800 | 1600): string {
  return `${PHOTO_STORY_DIR}/${id}-${width}.jpg`
}

export const photoStoryEntries: PhotoStoryEntry[] = [
  {
    photos: [{ id: '001', width: 1600, height: 1199 }],
    caption: {
      tr: '1945\'te, ben bir yaşımdayken çekilen aile fotoğrafımız: (soldan sağa) annem Sabiha, büyük ablam Sumru, ben, ablam Olcay, babam Ahmet, ağabeyim Acar.',
      en: 'Our family photograph, taken in 1945, when I was one year old. From left to right: my mother Sabiha, my elder sister Sumru, me, my sister Olcay, my father Ahmet, and my brother Acar.',
    },
  },
  {
    photos: [{ id: '002', width: 1101, height: 1600 }],
    caption: {
      tr: 'Sumru ablam benim için yarı-anneydi. 9 Aralık 1950\'de, çok sevdiğim Özbek (Cömert) eniştemle evlendikleri gün birlikte çekilen fotoğrafımız. (Bir tek o gün frak giyip papyon taktım.)',
      en: 'My sister Sumru was like a second mother to me. This photograph of the two of us was taken on 9 December 1950, the day she married my much-loved brother-in-law Özbek (Cömert). (It was the only day in my life that I ever wore a tailcoat and bow tie.)',
    },
  },
  {
    photos: [{ id: '003', width: 1035, height: 1600 }],
    caption: {
      tr: 'Sumru ablamın kızı yeğenim Yasemin\'in 1970\'de Ayvalık\'taki düğününde kardeşler olarak annemle çekilen fotoğrafımız: (soldan sağa) Sumru ablam, ben, annem, Olcay ablam, Acar ağabeyim.',
      en: 'A photograph of us siblings with our mother at the wedding of my niece Yasemin, Sumru’s daughter, in Ayvalık in 1970. From left to right: my sister Sumru, me, my mother, my sister Olcay, and my brother Acar.',
    },
  },
  {
    photos: [{ id: '004', width: 1146, height: 1600 }],
    caption: {
      tr: 'Fatma 14 Şubat 1944\'te, Şahin 18 Nisan 1944\'te İstanbul\'da dünyaya geldikten sonra, Fatma\'nın babası Mustafa Lütfi Kaptan\'ın inşa ettirdiği Ayvalık\'ın ilk üç katlı apartmanının çatısı altında buluştular: Ev sahibi Kaptanlar üst katta oturuyordu, Alpaylar orta kattaki kiracılarıydı. Denebilir ki, Fatma\'yla hikayemiz orada başladı.',
      en: 'Fatma was born in Istanbul on 14 February 1944, and I was born on 18 April of the same year. We met in Ayvalık’s first three-storey apartment building, built by Fatma’s father, Mustafa Lütfi Kaptan. The Kaptan family, who owned the building, lived on the top floor, while the Alpays were their tenants on the middle floor. You could say that Fatma’s and my story began there.',
    },
  },
  {
    photos: [{ id: '005', width: 1072, height: 1600 }],
    caption: {
      tr: 'İstanbul Nişantaşı\'ndaki Nilüfer Hatun İlkokulu\'nu bitirdikten sonra orta okulu aynı semtteki İngiliz Erkek Lisesi\'nde okudum. Aralık 1958\'de ömürboyu arkadaşlarımdan bazılarıyla birlikte çekilen fotoğrafta yukarıdan aşağıya: Selim Razon, Duncan Jamieson, Nedim Demirelli, Marsel Erdal, Yavuz Sökmen, Mehmet Önkal, Şefik Yüksel ve ben.',
      en: 'After completing my primary education at Nilüfer Hatun Primary School in Nişantaşı, Istanbul, I attended the English High School for Boys in the same neighbourhood. This photograph, taken in December 1958, shows me with several lifelong friends. From top to bottom: Selim Razon, Duncan Jamieson, Nedim Demirelli, Marsel Erdal, Yavuz Sökmen, Mehmet Önkal, Şefik Yüksel, and me.',
    },
  },
  {
    photos: [{ id: '006', width: 1600, height: 1185 }],
    caption: {
      tr: 'Liseyi Bebek\'teki Robert Kolej\'de okudum. İkinci sınıfta American Field Service bursuyla ABD\'ye gittim ve 1961-62 ders yılında son sınıfına devam ettiğim Webb School of California\'dan mezun oldum. Yıl boyunca okulun öğrenci işleri müdürü Gordon A. Wilson ve ailesine konuk oldum. O günlerde, ailenin okulun bulunduğu Claremont\'taki kışlık evinde çekilen fotoğrafta (soldan sağa) Jackie, Gordon C., Mollie ve Gordon A. Wilson, ben, küçük Barbara, Betty ve Tom.',
      en: 'I attended high school at Robert College in Bebek. In my second year, I went to the United States on an American Field Service scholarship and graduated from the Webb School of California, where I spent my final year of high school, 1961–62. Throughout that year, I stayed with the family of the school’s dean of students, Gordon A. Wilson. This photograph was taken at the family’s winter home in Claremont, where the school was located. From left to right: Jackie, Gordon C., Mollie, Gordon A. Wilson, me, little Barbara, Betty, and Tom.',
    },
  },
  {
    photos: [{ id: '007', width: 1600, height: 1199 }],
    caption: {
      tr: 'Sınıf arkadaşım Tor Krieger ile Webb\'de başlayan dostluğumuz yazışmalar ve karşılıklı ziyaretlerle bugüne kadar devam etti. Bu fotoğrafımız Aralık 1961\'de okulun bahçesinde çekildi.',
      en: 'My friendship with my classmate Tor Krieger began at Webb and has endured to this day through letters and visits in both directions. This photograph of us was taken on the school grounds in December 1961.',
    },
  },
  {
    photos: [{ id: '008', width: 1600, height: 1180 }],
    caption: {
      tr: 'Komşu kızı Fatma\'ya duyduğum derin ilgi 1952-53 ders yılında Ayvalık, *Cumhuriyet* ilkokulunda aynı sınıfta okuduğumuz yıl başladı, giderek alevlendi ve 1965\'te evlendik. Fatma İstanbul Işık Lisesi\'nde son sınıf öğrencisiyken 1960-61\'de çekilen bu çok sevdiğim fotoğrafında hayat boyu yakın arkadaşı olan İnci ile birlikte.',
      en: 'My deep affection for Fatma, the girl next door, began during the 1952–53 school year, when we were classmates at *Cumhuriyet* Primary School in Ayvalık. Over the years, that affection blossomed into love, and we married in 1965. This photograph of Fatma, which I particularly cherish, was taken in 1960–61, during her final year at Işık High School in Istanbul. She is pictured with İnci, who would remain her close friend throughout her life.',
    },
  },
  {
    photos: [{ id: '009', width: 1600, height: 1155 }],
    caption: {
      tr: 'Robert Lisesi\'nde son sınıfı okurken Öğrenci Konseyi (Student Council) başkan yardımcısı seçildim. Başkan, ileride Türkiye\'nin en başarılı iş adamlarından biri olacak Hüsnü Özyeğin\'di. Konsey toplantılarından birinde çekilen bu fotoğrafta (baştaki sırada, soldan sağa) ABD\'de okuyup dünyanın en önemli beyin cerrahlarından biri olacak Marsel Meşulam, (yüzünü eliyle örten) ünlü romatizma uzmanı Hasan Yazıcı, Özyeğin, ben, Ali Nun ve tanınmış bir iktisatçı olacak Reşat Kayalı görülüyor.',
      en: 'In my final year of high school at Robert College, I was elected vice-president of the Student Council. Its president was Hüsnü Özyeğin, who would go on to become one of Turkey’s most successful businessmen. This photograph was taken at one of the Council’s meetings. In the front row, from left to right, are Marsel Meşulam, who would study in the United States and become one of the world’s leading neurosurgeons; the renowned rheumatologist Hasan Yazıcı (covering his face with his hand); Özyeğin; me; Ali Nun; and Reşat Kayalı, who would become a well-known economist.',
    },
  },
  {
    photos: [{ id: '010', width: 1122, height: 1600 }],
    caption: {
      tr: 'Haziran 1963\'te Robert Lisesi\'nden mezun olduğumda okul yıllığı *Reflections \'63* için çekilen fotoğrafım.',
      en: 'My photograph for the school yearbook, *Reflections ’63*, taken when I graduated from Robert College high school in June 1963.',
    },
  },
  {
    photos: [{ id: '011', width: 1600, height: 1095 }],
    caption: {
      tr: 'Yüksek öğrenimi 1963-67 arasında Ankara Üniversitesi Siyasal Bilgiler Fakültesi\'nde (SBF) yaptım ve sorunlu geçecek yıllara adım attım. Beni dört yıllık tam bursunu kazandığım New York\'taki Columbia Üniversitesi\'nde değil de SBF\'de okumaya ikna eden Robert Kolej\'den ömür boyu arkadaşım Nuri Çolakoğlu ile 1964 yazında Ayvalık\'tayız.',
      en: 'I studied at Ankara University’s Faculty of Political Sciences (SBF) from 1963 to 1967, entering what would prove to be turbulent years. Here I am in Ayvalık in the summer of 1964 with my lifelong friend from Robert College, Nuri Çolakoğlu, who persuaded me to study at SBF rather than attend Columbia University in New York, where I had been awarded a full four-year scholarship.',
    },
  },
  {
    photos: [{ id: '012', width: 1600, height: 1007 }],
    caption: {
      tr: 'SBF\'de ilk iki yılım Fatma\'yı görmek için İstanbul\'a gidip gelmekle geçti ama, İngiliz Erkek Lisesi\'nde başlayan tiyatro oyunculuğumun son aşamasında Nuri\'nin sahneye koyduğu "Harrison Fish\'in Son Saati" adlı (yabancı yazarını hatırlamadığımız) bir oyunda rol almaktan da geri durmadım. Sahne arkadaşlarım (soldan sağa, şimdi hepsi emekli ya da rahmetli) Uçman Sungur (yazar ve rejisör), Erçin Odman (Maliye Müfettişi), Hayrettin Erdemli, Sezi Ergun (TRT\'de Program Yapımcısı), ben, Nuri (Gazeteci, Yayımcı, İş Yöneticisi), Necati Utkan (Büyükelçi), Ayşe Esen Öğüt (Başkonsolos), Cenk Duatepe (Büyükelçi), Deniz Gökçe (Doç. Dr.) ve Turgut Erdemli (Maliye Müfettişi).',
      en: 'During my first two years at SBF, I travelled frequently between Ankara and Istanbul to see Fatma. Even so, I found time for one final foray into acting, which I had taken up at the English High School for Boys. I appeared in a play directed by Nuri, *Harrison Fish’in Son Saati* (*The Last Hour of Harrison Fish*), whose foreign author neither of us can now remember. My fellow cast members, from left to right, all now retired or no longer with us: Uçman Sungur (writer and director), Erçin Odman (finance inspector), Hayrettin Erdemli, Sezi Ergun (programme producer at TRT), me, Nuri (journalist, publisher, and executive), Necati Utkan (ambassador), Ayşe Esen Öğüt (consul general), Cenk Duatepe (ambassador), Deniz Gökçe (associate professor), and Turgut Erdemli (finance inspector).',
    },
  },
  {
    photos: [{ id: '013', width: 1600, height: 972 }],
    caption: {
      tr: '**29 Kasım 1965 hayatımın en mutlu günü!** **Fatma ile Ankara\'da evlendik.**',
      en: '**29 November 1965 — the happiest day of my life!** **Fatma and I were married in Ankara.**',
    },
  },
  {
    photos: [{ id: '014', width: 1156, height: 1600 }],
    caption: {
      tr: 'SBF son sınıfta okurken (1966-67) rahmetli Mahir Çayan\'ın başkanlığını yaptığı sol eğilimli Fikir Kulübü\'nün adayı olarak, tek bir oy farkla Öğrenci Derneği başkanlığına seçildim ve çetin geçecek bir döneme adım attım. Bu hayli suratsız fotoğrafım başkan olduğum günlerde çekildi.',
      en: 'In my final year at SBF (1966–67), I was elected president of the Student Association by a margin of just one vote. I stood as the candidate of the left-leaning Fikir Kulübü (Ideas Club), whose president was the late Mahir Çayan. It marked the beginning of a difficult period in my life. This rather sullen photograph of me was taken during my time as president.',
    },
  },
  {
    photos: [{ id: '015', width: 1600, height: 1155 }],
    caption: {
      tr: 'Nuri ve (ilk eşi) Sezi ile Mayıs 1970\'de iki günlük bir Antalya kaçamağı yaptık. Fatma\'yla en mutlu fotoğraflarımızdan birini orada Nuri çekti. Yoldaşımız Mustafa Kuseyri\'nin Ankara\'da öldürüldüğü haberini alınca "kaçamak" burnumuzdan gelmişti.',
      en: 'In May 1970, we took a two-day trip to Antalya with Nuri and Sezi, his first wife. There, Nuri took one of my happiest photographs with Fatma. But when we learned that our comrade Mustafa Kuseyri had been killed in Ankara, our little getaway turned bitter.',
    },
  },
  {
    photos: [{ id: '016', width: 1160, height: 1600 }],
    caption: {
      tr: '12 Mart 1971 askeri müdahalesi sonucunda "azılı solcu" olarak aranmaya başladım. Ülkeden kaçıp Suriye ve Lübnan\'daki *Filistin\'in Kurtuluşu için Demokratik Cephe* adlı örgütün kamplarında sekiz ay süreyle eğitim görüp silahlardan nefret ettikten sonra yurda döndüm. Çeşitli maceralar sonunda devrimciliğe veda etme kararı aldım ve beni kurtarmak için büyük riskleri göze alan ağabeyim Acar Alpay sayesinde Ağustos 1972\'de yurtdışına kaçmayı başardım ve İsveç\'e sığındım. Stockholm\'deki ilk yıllarımda yaptığım çeşitli işlerden biri de Türkiyeli göçmen çocuklara Türkçe öğretmenliği olmuştu.',
      en: 'Following the military intervention of 12 March 1971, I became a wanted man, labelled a “hardened leftist”. I fled the country and spent eight months undergoing training in the camps of an organisation called the *Democratic Front for the Liberation of Palestine*, in Syria and Lebanon. Having come to hate weapons, I returned home. After various adventures, I decided to turn my back on revolutionary politics. Thanks to my brother Acar Alpay, who took great risks to save me, I managed to escape abroad in August 1972 and seek refuge in Sweden. One of the various jobs I held during my early years in Stockholm was teaching Turkish to the children of immigrants from Turkey.',
    },
  },
  {
    photos: [{ id: '017', width: 1398, height: 1125 }],
    caption: {
      tr: 'Uzun ve sancılı bir bekleyişten sonra nihayet Ocak 1974\'te Fatma ve Elvan\'a kavuştum. Birlikteki ilk günlerimizden birinde, İsveçli arkadaşım Klas\'ın çektiği fotoğrafta mutluluğum yüzüme yansıyor.',
      en: 'After a long and painful wait, I was finally reunited with Fatma and Elvan in January 1974. This photograph, taken by my Swedish friend Klas during one of our first days together, shows the happiness written all over my face.',
    },
  },
  {
    photos: [{ id: '018', width: 1600, height: 1064 }],
    caption: {
      tr: 'İsveç devlet bursu kazanarak 1976-80 arasında Stockholm Üniversitesi\'nde siyaset bilimi doktorası yaptım. Beni araştırma görevlisi olarak işe alan tez hocam, daha sonra İsveç\'in ilk göç araştırmaları profesörü atanacak Doçent Tomas Hammar idi. 2016-18 arasında Silivri cezaevinde ikametim sonrasında Aralık 2022\'de pasaport almam mümkün olur olmaz, bana her zaman büyük destek veren hocam ve dostum Tomas\'ı ziyaret için Stockholm\'e gittim. 2024\'te vefat edecek olan Hammar\'la bu fotoğrafımız 2006\'da onu evindeki bir ziyaretim sırasında çekilmişti.',
      en: 'With a Swedish government scholarship, I pursued a doctorate in political science at Stockholm University between 1976 and 1980. My doctoral supervisor, who also employed me as a research assistant, was Associate Professor Tomas Hammar, who would later become Sweden’s first professor of migration studies. Following my imprisonment in Silivri from 2016 to 2018, I was finally able to obtain a passport in December 2022. As soon as I could, I travelled to Stockholm to visit Tomas, my teacher and friend, who had always been a great source of support. This photograph of me with Hammar, who passed away in 2024, was taken in 2006 during a visit to his home.',
    },
  },
  {
    photos: [{ id: '019', width: 1600, height: 1205 }],
    caption: {
      tr: '1974 yılında çıkarılan siyasi af ile yurda dönüp askerlik yapmam mümkün oldu. 1975 yazında Çanakkale 116. Er Eğitim Alayı\'nda, çoğu SBF ve Robert Lisesi\'nden arkadaş ve tanıdıklarla birlikte, tam olarak yetmiş (70) gün askerlik yaptıktan sonra yedek subay olarak terhis olduk. Birlikte çeşitli maceralar yaşadığım yakın arkadaşlarım Ömer Madra ve Cengiz Çandar ile askerlik hatırası fotoğrafı çektirmeyi ihmal etmedik.',
      en: 'The political amnesty of 1974 made it possible for me to return to Turkey and complete my military service. In the summer of 1975, at the 116th Recruit Training Regiment in Çanakkale, I served alongside friends and acquaintances, most of them from SBF and Robert College. We served exactly seventy (70) days before being discharged as reserve officers. My close friends Ömer Madra and Cengiz Çandar, with whom I had shared many adventures, and I made sure to have a commemorative photograph taken during our service.',
    },
  },
  {
    photos: [{ id: '020', width: 1600, height: 1209 }],
    caption: {
      tr: '2024\'te kaybettiğimiz çok değerli sosyal tarihçimiz Prof. Dr. Zafer Toprak ile dostluğumuz 1965\'te SBF Tiyatro Kulübü\'nde başlayıp ömür boyu sürdü. Çanakkale\'de askerlik yaparken manga komutanım olan Zafer\'le.',
      en: 'My friendship with Professor Zafer Toprak, our distinguished social historian, whom we lost in 2024, began in 1965 at the SBF Theatre Club and lasted a lifetime. Here I am with Zafer, who was my squad commander during our military service in Çanakkale.',
    },
  },
  {
    photos: [{ id: '021', width: 1600, height: 1034 }],
    caption: {
      tr: 'Benim özgür olmam için kendi özgürlüğünü tehlikeye atmaktan çekinmeyen ağabeyim Acar Alpay Mayıs 1977\'de, cinayet gibi bir trafik kazasında vefat etti, bütün ailemizi derin kedere boğdu... Ölümünden on yıl önce Ezine\'de askerliğini yaparken, fotoğraf ustası rahmetli dostumuz Teoman Madra tarafından çekilen bu fotoğrafı onun sımsıcak kişiliğini iyi yansıtır. Fatma\'nın Mart 1978\'de dünyaya getirdiği oğlumuza onun adını verdik.',
      en: 'My brother Acar Alpay, who had not hesitated to risk his own freedom to secure mine, died in May 1977 in a traffic accident that was little short of murder. His death plunged our entire family into profound grief. This photograph, taken ten years before his death while he was serving in the military in Ezine, was the work of our late friend, the master photographer Teoman Madra. It beautifully captures Acar’s warm personality. We named our son, born to Fatma in March 1978, after him.',
    },
  },
  {
    photos: [{ id: '022', width: 1600, height: 1072 }],
    caption: {
      tr: 'Fatma ve çocuklar 1978 sonunda İsveç\'ten yurda kesin dönüş yaptılar; ben de 1981 başında. Yurda döndüğümüz için çok mutluyduk. Bu mutluluk 1983 yazında Fatma\'nın rahmetli babasının Ayvalık, Çamlık\'taki yazlık evinin balkonunda çekilen fotoğrafımıza yansıyor.',
      en: 'Fatma and the children returned to Turkey from Sweden for good at the end of 1978, and I followed at the beginning of 1981. We were overjoyed to be home again. That happiness is evident in this photograph, taken in the summer of 1983 on the balcony of the summer house belonging to Fatma’s late father in Çamlık, Ayvalık.',
    },
  },
  {
    photos: [{ id: '023', width: 1042, height: 1600 }],
    caption: {
      tr: 'Solcu geçmişim nedeniyle üniversitelerde iş bulamayınca, SBF ve devrimcilikten arkadaşım Hasan Cemal\'i beni yakınlarda genel yayın müdürü atandığı *Cumhuriyet* gazetesinde (sonradan buna çok pişman olsa da) işe almaya ikna ettim. 1982-91 arası yılların çoğunda (liberal görüşlerim nedeniyle benden hiç hoşlanmayan kıdemli köşe yazarlarının gözlerinden uzak olmam için özel olarak yaptırılan) gazete arşivindeki dar bölmede çalıştım.',
      en: 'When my leftist past prevented me from finding a university position, I persuaded Hasan Cemal, my friend from SBF and our revolutionary days, to give me a job at *Cumhuriyet*, where he had recently been appointed editor-in-chief (although he would later come to regret the decision deeply). For most of the period from 1982 to 1991, I worked in a narrow cubicle in the newspaper’s archive, specially built to keep me out of sight of the senior columnists, who thoroughly disliked me because of my liberal views.',
    },
  },
  {
    photos: [{ id: '024', width: 1600, height: 1060 }],
    caption: {
      tr: '*Cumhuriyet*\'ten sonra kısa sürelerle TÜSES araştırma vakfı genel sekreterliği (1991-92), sonra Ankara\'da, Deniz Baykal\'ın başkanlığındaki CHP\'de TBMM grup danışmanlığı (1992-93) yaptım. Bir sonraki işim, BBC / Londra\'dan yakınlarda yurda dönen arkadaşım Nilüfer Kuyaş\'la birlikte *Sabah* gazetesinin "Entellektüel Bakış" sayfasını yapmak oldu.',
      en: 'After leaving *Cumhuriyet*, I briefly served as secretary-general of the TÜSES research foundation (1991–92), before becoming an adviser to the CHP parliamentary group in Ankara under the leadership of Deniz Baykal (1992–93). My next job was producing the *Entellektüel Bakış* (*Intellectual View*) page for the newspaper *Sabah*, together with my friend Nilüfer Kuyaş, who had recently returned from the BBC in London.',
    },
  },
  {
    photos: [{ id: '025', width: 1600, height: 1040 }],
    caption: {
      tr: '*Cumhuriyet\'*ten yakın arkadaşım rahmetli Ufuk Güldemir genel yayın müdürü atanınca sayfayı Nilüfer\'le birlikte *Milliyet*\'e taşıdık (1994-2001). Güldemir\'den sonraki genel yayın müdürü Derya Sazak\'la birlikte çekilen fotoğrafta, meslektaşlar (ayakta) Osman Ulagay, Ahmet Tan, Duygu Asena, Edip Öymen, Yavuz Baydar, (oturanlar) Meral Tamer, ben, Sazak ve Tayfun Ertan.',
      en: 'When my close friend from *Cumhuriyet*, the late Ufuk Güldemir, was appointed editor-in-chief, Nilüfer and I moved the page to *Milliyet* (1994–2001). In this photograph, taken with Derya Sazak, who succeeded Güldemir as editor-in-chief, are our colleagues: standing, Osman Ulagay, Ahmet Tan, Duygu Asena, Edip Öymen, and Yavuz Baydar; seated, Meral Tamer, me, Sazak, and Tayfun Ertan.',
    },
  },
  {
    photos: [{ id: '026', width: 1600, height: 1065 }],
    caption: {
      tr: 'İsveç\'ten yurda dönüş sonrasında en yakın arkadaşım ve fikirdaşım, doktora yaptığı Fransa\'dan dönen (o da önce devrimci sonra sosyal demokrat) değerli iktisatçımız Prof. Dr. Seyfettin Gürsel oldu. Onunla *DSP-SHP: Nerede Birleşiyor, Nerede ayrılıyorlar* (AFA, 1986) başlıklı bir kitapçık yazdığımız gibi uzun yıllar Bahçeşehir Üniversitesi\'nde birlikte çalıştık.',
      en: 'After my return from Sweden, my closest friend and kindred spirit was the distinguished economist Professor Seyfettin Gürsel, who had returned from France, where he had completed his doctorate. Like me, he had begun as a revolutionary before becoming a social democrat. Together, we wrote a booklet entitled *DSP-SHP: Nerede Birleşiyor, Nerede ayrılıyorlar* (*DSP–SHP: Where They Meet, Where They Part*; AFA, 1986), and we worked together for many years at Bahçeşehir University.',
    },
  },
  {
    photos: [{ id: '027', width: 1600, height: 1051 }],
    caption: {
      tr: 'Fatma\'nın en çok sevdiğim fotoğraflarından birini Haziran 1995\'te New York\'a birlikte yaptığımız ilk ziyaret sırasında *Empire State Building* adlı ünlü gökdelenin tepesinde çektim.',
      en: 'I took one of my favourite photographs of Fatma at the top of the famous *Empire State Building* during our first visit to New York together in June 1995.',
    },
  },
  {
    photos: [{ id: '029', width: 1600, height: 1081 }],
    caption: {
      tr: 'Fatma\'nın bu çok sevdiğim fotoğrafını da, 1999\'da davetli olarak gittiğimiz Çin Halk Cumhuriyeti\'nde çektim. Arka planda Çin seddi görülüyor.',
      en: 'I also took this photograph of Fatma, which I love dearly, in the People’s Republic of China, where we went as invited guests in 1999. The Great Wall of China can be seen in the background.',
    },
    hidden: true,
  },
  {
    photos: [{ id: '030', width: 1600, height: 1079 }],
    caption: {
      tr: '2001\'de *Milliyet*\'teki işime son verilince, Stockholm Üniversitesi\'nde yaptığım doktora işe yaradı. Yakın dostlarımdan biri olacak Prof. Dr. Eser Karakaş beni Bahçeşehir Üniversitesi\'nde ders vermeye davet etti. Fotoğraf Eser\'in çalışma odasında çekildi.',
      en: 'When my employment at *Milliyet* came to an end in 2001, the doctorate I had earned at Stockholm University proved invaluable. Professor Eser Karakaş, who would become one of my close friends, invited me to teach at Bahçeşehir University. This photograph was taken in Eser’s office.',
    },
  },
  {
    photos: [{ id: '031', width: 1600, height: 1045 }],
    caption: {
      tr: 'Bahçeşehir Üniversitesi en uzun süre çalıştığım işyeri oldu; 2001-15 arasında 14 yıl süreyle lisans ve yüksek lisans öğrencilerine siyaset bilimi dersleri verdim. Fotoğrafta bir konferans vermesi için davet ettiğim kıdemli dostum Prof. Dr. Haluk Şahin\'in ziyareti dolayısıyla çekilen fotoğrafta son sınıf öğrencilerimle görülüyorum.',
      en: 'Bahçeşehir University was the institution where I spent the longest period of my professional life. For 14 years, from 2001 to 2015, I taught political science to undergraduate and graduate students. In this photograph, taken during a visit by my esteemed senior colleague Professor Haluk Şahin, whom I had invited to give a lecture, I am pictured with my final-year students.',
    },
  },
  {
    photos: [{ id: '032', width: 1600, height: 1058 }],
    caption: {
      tr: 'Cumhurbaşkanı Recep Tayyip Erdoğan ile İstanbul Büyükşehir Belediye Başkanı seçildiği 1994 yılında, *Sabah* gazetesi için yaptığım mülakat dolayısıyla tanıştım. 2000\'lerin başında çekilen bu fotoğrafta, değerli meslektaşım Nazlı Ilıcak\'ın evindeki bir davette, henüz sadece AKP lideri olan Erdoğan ve değerli sosyal tarihçimiz rahmetli dostum Prof. Dr. Kemal Karpat ile birlikteyiz.',
      en: 'I first met President Recep Tayyip Erdoğan in 1994, the year he was elected Mayor of Istanbul, when I interviewed him for *Sabah*. This photograph was taken in the early 2000s at a reception at the home of my esteemed colleague Nazlı Ilıcak. I am pictured with Erdoğan, then still only the leader of the AKP, and my late friend Professor Kemal Karpat, our distinguished social historian.',
    },
  },
  {
    photos: [
      { id: '033-1', width: 1200, height: 1600 },
      {
        id: '033-2',
        width: 1200,
        height: 1600,
        alt: {
          tr: 'El yazısıyla ithaf: “Beni özgürlüğe kavuşturan değerli avukatım Aynur Tuncel Yazgan’a teşekkür ve saygılarımla”, Şahin Alpay imzası, Kasım 2024.',
          en: 'A handwritten dedication in Turkish: “To my esteemed lawyer Aynur Tuncel Yazgan, who brought me to freedom, with my thanks and respect.” Signed Şahin Alpay, November 2024.',
        },
      },
    ],
    caption: {
      tr: 'Bahçeşehir Üniversitesi\'nde tam zaman öğretim üyeliği yaparken, Kasım 2002\'den itibaren kapatılacağı 2016 yılına kadar *Zaman* gazetesinde haftada üç gün köşe yazdım. 15 Temmuz darbe girişimi üzerine "terör örgütü üyesi olduğum" iddiasıyla tutuklandım ve Mart 2018\'e kadar Silivri cezaevine konuk oldum. Savcılık hakkımda üç kez ağırlaştırılmış ömür boyu hapis cezası istediyse de yargılama sonunda 2022\'de "üye olmamakla beraber terör örgütüne destek verdiğim" gerekçesiyle 2,5 yıl hapse mahkum oldum. Avukatım Aynur Tuncel Yazgan\'ın temyiz ettiği karar halen Yargıtay\'da beklemekte. Fotoğrafta değerli avukatımla birlikte görülüyoruz.',
      en: 'While teaching full-time at Bahçeşehir University, I wrote a column three times a week for *Zaman* from November 2002 until the newspaper was shut down in 2016. Following the attempted coup of 15 July 2016, I was arrested on the allegation that I was “a member of a terrorist organisation” and remained a “guest” of Silivri Prison until March 2018. Although the prosecution sought three aggravated life sentences, at the conclusion of my trial in 2022 I was sentenced to two and a half years in prison on the grounds that, while not a member of a terrorist organisation, I had supported one. My lawyer, Aynur Tuncel Yazgan, appealed the verdict. The appeal is still pending before the Court of Cassation. In this photograph, I am pictured with my esteemed lawyer.',
    },
  },
  {
    photos: [{ id: '034', width: 1600, height: 1200 }],
    caption: {
      tr: '"Terör örgütü üyesi" olduğum iddiasıyla yargılanmam boyunca, gerek yazarak gerekse duruşmalarda yalnız bırakmayarak desteğini esirgemeyen, değerli ve kıdemli meslektaş ve dostum Hasan Cemal ile mahkeme koridorlarındayız.',
      en: 'In the courthouse corridors with my esteemed senior colleague and friend Hasan Cemal, who never wavered in his support throughout my trial on the allegation that I was a “member of a terrorist organisation”. He stood by me both through his writing and by attending the hearings.',
    },
  },
  {
    photos: [{ id: '035', width: 1600, height: 1189 }],
    caption: {
      tr: 'Robert Lisesi\'nden 1963\'te mezun olan sınıfın bir şansı da Öğrenci Konseyi başkanımız Hüsnü Özyeğin\'in giderek ülkenin en başarılı işadamlarından biri olmasıdır. Hüsnü\'nün yıllık sınıf davetlerinden birinde, 2005\'ten beri sahibi olduğu Swissotel\'in bahçesindeyiz.',
      en: 'One stroke of good fortune for the Robert College class of 1963 was that our Student Council president, Hüsnü Özyeğin, went on to become one of the country’s most successful businessmen. Here we are at one of Hüsnü’s annual class reunions, held in the garden of the Swissôtel, which he has owned since 2005.',
    },
  },
  {
    photos: [{ id: '036', width: 1600, height: 1063 }],
    caption: {
      tr: 'Robert Lisesi\'nde ömür boyu sürecek dostluklar edindim. 2020\'lerdeki bir sınıf buluşmasında çekilen bu fotoğrafta çok sevdiğim sınıf arkadaşlarım (soldan sağa) Mehmet Araslı, Kemal Dülger, (büyük iyiliklerini gördüğüm, tanınmış tıp profesörü) Hasan Yazıcı ve (kısmen görünen, Boğaziçi Üniversitesi fizik profesörü) Haluk Beker ile birlikteyiz. Ne yazık ki Hasan ve benim dışımdakiler son birkaç yıl içinde rahmetli oldular. Nur içinde yatsınlar.',
      en: 'At Robert College, I formed friendships that would last a lifetime. In this photograph, taken at a class reunion in the 2020s, I am with my dear classmates. From left to right: Mehmet Araslı, Kemal Dülger, Hasan Yazıcı (the renowned professor of medicine, to whom I owe so much), and Haluk Beker (partly visible, professor of physics at Boğaziçi University). Sadly, all of them except Hasan and me have passed away in recent years. May they rest in peace.',
    },
  },
  {
    photos: [{ id: '037', width: 1600, height: 1189 }],
    caption: {
      tr: 'Fatma\'yla bu fotoğrafımız Mayıs 2018\'de, Ayvalık Çamlık\'taki evimizin bahçesinde elele tutuşmuş olarak, artık hiç ayrılmayacağımızı konuşurken, yeğenimiz Yeşim tarafından bizden habersiz çekildi. Ne yazık ki Fatmam 6 Ekim 2018\'de aramızdan ayrılacaktı...',
      en: 'This photograph of Fatma and me was taken in May 2018, in the garden of our house in Çamlık, Ayvalık, by our niece Yeşim, without our knowing. We were holding hands and talking about never being apart again. Sadly, my beloved Fatma passed away on 6 October 2018...',
    },
  },
  {
    photos: [
      { id: '028-1', width: 1200, height: 1600 },
      { id: '028-2', width: 1600, height: 1156 },
    ],
    caption: {
      tr: 'Hiç kuşkum yok ki, hayattaki en büyük mutluluk kaynağım, Fatma gibi bir eşe, Elvan ve Acar gibi evlatlara, Defne ve Leyla gibi torunlara sahip olmam. Fotoğraflarda Elvan ile Defne yakınlarda Filibe\'de; Acar\'la Leyla birkaç yıl önce Çamlık, Ayvalık\'ta görülüyor.',
      en: 'I have no doubt that the greatest source of happiness in my life has been having a wife like Fatma, children like Elvan and Acar, and grandchildren like Defne and Leyla. The photographs show Elvan with Defne in Plovdiv recently, and Acar with Leyla in Çamlık, Ayvalık, a few years ago.',
    },
  },
]

/** The entries the page shows, in story order. */
export const visiblePhotoStoryEntries = photoStoryEntries.filter((entry) => !entry.hidden)
