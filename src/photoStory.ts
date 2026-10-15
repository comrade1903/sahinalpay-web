/** "Fotoğraflarla Hikayem" — Şahin Alpay's life told through 37 photographs
 *  and his own captions, in the order of the owner's document
 *  (Foto/fotohikaye.md, supplied 2026-10-13; scans in Foto/taramalar),
 *  except 028 (the children and grandchildren), which the owner moved to
 *  the end on 2026-10-15.
 *  Captions are verbatim and Turkish only; the English page shows them
 *  untranslated, never machine-translated.
 *
 *  Images are served from public/photos/hikayem/<id>-<800|1600>.jpg, made by
 *  resizing the scans with EXIF orientation applied and all metadata dropped
 *  (some phone photos carried location data). `width`/`height` are the
 *  1600 version's, so the page reserves each photo's space before it loads.
 *
 *  026 is the one retouched image: the camera's yellow date imprint
 *  ("26/02/2003") in its lower right was painted out at the owner's request
 *  on 2026-10-13 (OpenCV inpainting over the imprint's pixels only, with the
 *  print's grain restored); the scan in Foto/taramalar is untouched.
 *
 *  In captions, *x* marks a publication name in italics and **x** the owner's
 *  own bold, as in his document. */
export interface PhotoStoryPhoto {
  id: string
  width: number
  height: number
  /** Only where the caption does not describe the picture itself. */
  alt?: string
}

export interface PhotoStoryEntry {
  /** One photo, or two shown side by side. */
  photos: PhotoStoryPhoto[]
  caption: string
}

export const PHOTO_STORY_DIR = '/photos/hikayem'

export function photoSrc(id: string, width: 800 | 1600): string {
  return `${PHOTO_STORY_DIR}/${id}-${width}.jpg`
}

export const photoStoryEntries: PhotoStoryEntry[] = [
  {
    photos: [{ id: '001', width: 1600, height: 1199 }],
    caption:
      '1945\'te, ben bir yaşımdayken çekilen aile fotoğrafımız: (soldan sağa) annem Sabiha, büyük ablam Sumru, ben, ablam Olcay, babam Ahmet, ağabeyim Acar.',
  },
  {
    photos: [{ id: '002', width: 1101, height: 1600 }],
    caption:
      'Sumru ablam benim için yarı-anneydi. 9 Aralık 1950\'de, çok sevdiğim Özbek (Cömert) eniştemle evlendikleri gün birlikte çekilen fotoğrafımız. (Bir tek o gün frak giyip papyon taktım.)',
  },
  {
    photos: [{ id: '003', width: 1035, height: 1600 }],
    caption:
      'Sumru ablamın kızı yeğenim Yasemin\'in 1970\'de Ayvalık\'taki düğününde kardeşler olarak annemle çekilen fotoğrafımız: (soldan sağa) Sumru ablam, ben, annem, Olcay ablam, Acar ağabeyim.',
  },
  {
    photos: [{ id: '004', width: 1146, height: 1600 }],
    caption:
      'Fatma 14 Şubat 1944\'te, Şahin 18 Nisan 1944\'te İstanbul\'da dünyaya geldikten sonra, Fatma\'nın babası Mustafa Lütfi Kaptan\'ın inşa ettirdiği Ayvalık\'ın ilk üç katlı apartmanının çatısı altında buluştular: Ev sahibi Kaptanlar üst katta oturuyordu, Alpaylar orta kattaki kiracılarıydı. Denebilir ki, Fatma\'yla hikayemiz orada başladı.',
  },
  {
    photos: [{ id: '005', width: 1072, height: 1600 }],
    caption:
      'İstanbul Nişantaşı\'ndaki Nilüfer Hatun İlkokulu\'nu bitirdikten sonra orta okulu aynı semtteki İngiliz Erkek Lisesi\'nde okudum. Aralık 1958\'de ömürboyu arkadaşlarımdan bazılarıyla birlikte çekilen fotoğrafta yukarıdan aşağıya: Selim Razon, Duncan Jamieson, Nedim Demirelli, Marsel Erdal, Yavuz Sökmen, Mehmet Önkal, Şefik Yüksel ve ben.',
  },
  {
    photos: [{ id: '006', width: 1600, height: 1185 }],
    caption:
      'Liseyi Bebek\'teki Robert Kolej\'de okudum. İkinci sınıfta American Field Service bursuyla ABD\'ye gittim ve 1961-62 ders yılında son sınıfına devam ettiğim Webb School of California\'dan mezun oldum. Yıl boyunca okulun öğrenci işleri müdürü Gordon A. Wilson ve ailesine konuk oldum. O günlerde, ailenin okulun bulunduğu Claremont\'taki kışlık evinde çekilen fotoğrafta (soldan sağa) Jackie, Gordon C., Mollie ve Gordon A. Wilson, ben, küçük Barbara, Betty ve Tom.',
  },
  {
    photos: [{ id: '007', width: 1600, height: 1199 }],
    caption:
      'Sınıf arkadaşım Tor Krieger ile Webb\'de başlayan dostluğumuz yazışmalar ve karşılıklı ziyaretlerle bugüne kadar devam etti. Bu fotoğrafımız Aralık 1961\'de okulun bahçesinde çekildi.',
  },
  {
    photos: [{ id: '008', width: 1600, height: 1180 }],
    caption:
      'Komşu kızı Fatma\'ya duyduğum derin ilgi 1952-53 ders yılında Ayvalık, *Cumhuriyet* ilkokulunda aynı sınıfta okuduğumuz yıl başladı, giderek alevlendi ve 1965\'te evlendik. Fatma İstanbul Işık Lisesi\'nde son sınıf öğrencisiyken 1960-61\'de çekilen bu çok sevdiğim fotoğrafında hayat boyu yakın arkadaşı olan İnci ile birlikte.',
  },
  {
    photos: [{ id: '009', width: 1600, height: 1155 }],
    caption:
      'Robert Lisesi\'nde son sınıfı okurken Öğrenci Konseyi (Student Council) başkan yardımcısı seçildim. Başkan, ileride Türkiye\'nin en başarılı iş adamlarından biri olacak, yakın arkadaşım Hüsnü Özyeğin\'di. Konsey toplantılarından birinde çekilen bu fotoğrafta (baştaki sırada, soldan sağa) ABD\'de okuyup dünyanın en önemli beyin cerrahlarından biri olacak Prof. Dr. Marsel Meşulam, (yüzünü eliyle örten) ünlü romatizma uzmanı Prof. Dr. Hasan Yazıcı, Özyeğin, ben, (Yunus Nadi\'nin torunu) Ali Nun ve tanınmış bir iktisatçı olacak Prof. Dr. Reşat Kayalı görülüyor.',
  },
  {
    photos: [{ id: '010', width: 1122, height: 1600 }],
    caption:
      'Haziran 1963\'te Robert Lisesi\'nden mezun olduğumda okul yıllığı *Reflections \'63* için çekilen fotoğrafım.',
  },
  {
    photos: [{ id: '011', width: 1600, height: 1095 }],
    caption:
      'Yüksek öğrenimi 1963-67 arasında Ankara Üniversitesi Siyasal Bilgiler Fakültesi\'nde (SBF) yaptım ve sorunlu geçecek yıllara adım attım. Beni dört yıllık tam bursunu kazandığım New York\'taki Columbia Üniversitesi\'ne değil de SBF\'de okumaya ikna eden Robert Kolej\'den ömür boyu arkadaşım Nuri Çolakoğlu ile 1964 yazında Ayvalık\'tayız.',
  },
  {
    photos: [{ id: '012', width: 1600, height: 1007 }],
    caption:
      'SBF\'de ilk iki yılım Fatma\'yı görmek için İstanbul\'a gidip gelmekle geçti ama, İngiliz Erkek Lisesi\'nde başlayan tiyatro oyunculuğumun son aşamasında Nuri\'nin sahneye koyduğu "Harrison Fish\'in Son Saati" adlı (yabancı yazarını hatırlamadığımız) bir oyunda rol almaktan da geri durmadım. Sahne arkadaşlarım (soldan sağa, şimdi hepsi emekli ya da rahmetli) Uçman Sungur (yazar ve rejisör), Erçin Odman (Maliye Müfettişi), Hayrettin Erdemli, Sezi Ergun (TRT\'de Program Yapımcısı), ben, Nuri (Gazeteci, Yayımcı, İş Yöneticisi), Necati Utkan (Büyükelçi), Ayşe Esen Öğüt (Başkonsolos), Cenk Duatepe (Büyükelçi), Deniz Gökçe (Doç. Dr.) ve Turgut Erdemli (Maliye Müfettişi).',
  },
  {
    photos: [{ id: '013', width: 1600, height: 972 }],
    caption:
      '**29 Kasım 1965 hayatımın en mutlu günü!** **Fatma ile Ankara\'da evlendik.**',
  },
  {
    photos: [{ id: '014', width: 1156, height: 1600 }],
    caption:
      'SBF son sınıfta okurken (1966-67) rahmetli Mahir Çayan\'ın başkanlığını yaptığı sol eğilimli Fikir Kulübü\'nün adayı olarak, tek bir oy farkla Öğrenci Derneği başkanlığına seçildim ve sıkıntılı geçecek bir döneme adım attım. Bu hayli suratsız fotoğrafım başkan olduğum günlerde çekildi.',
  },
  {
    photos: [{ id: '015', width: 1600, height: 1155 }],
    caption:
      'Nuri ve (ilk eşi) Sezi ile Mayıs 1970\'de iki günlük bir Antalya kaçamağı yaptık. Fatma\'yla en mutlu fotoğraflarımızdan birini orada Nuri çekti. Yoldaşımız Mustafa Kuseyri\'nin Ankara\'da öldürüldüğü haberini alınca "kaçamak" burnumuzdan gelmişti.',
  },
  {
    photos: [{ id: '016', width: 1160, height: 1600 }],
    caption:
      '12 Mart 1971 askeri müdahalesi sonucunda "azılı solcu" olarak aranmaya başladım. Ülkeden kaçıp Suriye ve Lübnan\'daki *Filistin\'in Kurtuluşu için Demokratik Cephe* adlı örgütün kamplarında sekiz ay süreyle eğitim gördükten sonra yurda döndüm. Çeşitli maceralar sonunda devrimciliğe veda etme kararı aldım ve beni kurtarmak için büyük riskleri göze alan ağabeyim Acar Alpay sayesinde Ağustos 1972\'de yurtdışına kaçmayı başardım ve İsveç\'e sığındım. Stockholm\'deki ilk yıllarımda yaptığım çeşitli işlerden biri de Türkiyeli göçmen çocuklara Türkçe öğretmenliği olmuştu.',
  },
  {
    photos: [{ id: '017', width: 1398, height: 1125 }],
    caption:
      'Uzun ve sancılı bir bekleyişten sonra nihayet Ocak 1974\'te Fatma ve Elvan\'a kavuştum. Birlikteki ilk günlerimizden birinde, İsveçli arkadaşım Klas\'ın çektiği fotoğraf ta mutluluğum yüzüme yansıyor.',
  },
  {
    photos: [{ id: '018', width: 1600, height: 1064 }],
    caption:
      'İsveç devlet bursu kazanarak 1976-80 arasında Stockholm Üniversitesi\'nde siyaset bilimi doktorası yaptım. Beni araştırma görevlisi olarak işe alan tez hocam, daha sonra İsveç\'in ilk göç araştırmaları profesörü atanacak Doçent Tomas Hammar idi. 2016-18 arasında Silivri cezaevinde ikametim sonrasında Aralık 2022\'de pasaport almam mümkün olur olmaz, bana her zaman büyük destek veren hocam ve dostum Tomas\'ı ziyaret için Stockholm\'e gittim. 2024\'te vefat edecek olan Hammar\'la bu fotoğrafımız 2006\'da onu evindeki bir ziyaretim sırasında çekilmişti.',
  },
  {
    photos: [{ id: '019', width: 1600, height: 1205 }],
    caption:
      '1974 yılında çıkarılan siyasi af ile yurda dönüp askerlik yapmam mümkün oldu. 1975 yazında Çanakkale 116. Er Eğitim Alayı\'nda, çoğu SBF ve Robert Lisesi\'nden arkadaş ve tanıdıklarla birlikte, tam olarak yetmiş (70) gün askerlik yaptıktan sonra yedek subay olarak terhis olduk. Birlikte çeşitli maceralar yaşadığım yakın arkadaşlarım Ömer Madra ve Cengiz Çandar ile askerlik hatırası fotoğrafı çektirmeyi ihmal etmedik.',
  },
  {
    photos: [{ id: '020', width: 1600, height: 1209 }],
    caption:
      '2024\'te kaybettiğimiz çok değerli sosyal tarihçimiz Prof. Dr. Zafer Toprak ile dostluğumuz 1965\'te SBF Tiyatro Kulübü\'nde başlayıp ömür boyu sürdü. Çanakkale\'de askerlik yaparken manga komutanım olan Zafer\'le fotoğraf çektirmeyi ihmal etmedik.',
  },
  {
    photos: [{ id: '021', width: 1600, height: 1034 }],
    caption:
      'Benim özgür olmam için kendi özgürlüğünü tehlikeye atmaktan çekinmeyen ağabeyim Acar Alpay Mayıs 1977\'de, cinayet gibi bir trafik kazasında vefat etti, bütün ailemizi derin kedere boğdu... Ölümünden on yıl önce Ezine\'de askerliğini yaparken, fotoğraf ustası rahmetli dostumuz Teoman Madra tarafından çekilen bu fotoğrafı onun sımsıcak kişiliğini iyi yansıtır. Fatma\'nın Mart 1978\'de dünyaya getirdiği oğlumuza onun adını verdik.',
  },
  {
    photos: [{ id: '022', width: 1600, height: 1072 }],
    caption:
      'Fatma ve çocuklar 1978 sonunda İsveç\'ten yurda kesin dönüş yaptılar; ben de 1981 başında. Yurda döndüğümüz için çok mutluyduk. Bu mutluluk 1983 yazında Fatma\'nın rahmetli babasının Ayvalık, Çamlık\'taki yazlık evinin balkonunda çekilen fotoğrafımıza yansıyor.',
  },
  {
    photos: [{ id: '023', width: 1042, height: 1600 }],
    caption:
      'Solcu geçmişim nedeniyle üniversitelerde iş bulamayınca, SBF ve devrimcilikten arkadaşım Hasan Cemal\'i beni yakınlarda genel yayın müdürü atandığı *Cumhuriyet* gazetesinde (sonradan buna çok pişman olsa da) işe almaya ikna ettim. 1982-91 arası yılların çoğunda (benden hiç hoşlanmayan kıdemli köşe yazarlarının gözlerinden uzak olmam için özel olarak yaptırılan) gazete arşivindeki dar bölmede çalıştım.',
  },
  {
    photos: [{ id: '024', width: 1600, height: 1060 }],
    caption:
      '*Cumhuriyet*\'ten sonra kısa sürelerle TÜSES araştırma vakfı genel sekreterliği (1991-92), sonra Ankara\'da, Deniz Baykal\'ın başkanlığındaki CHP\'de TBMM grup danışmanlığı (1992-93) yaptım. Bir sonraki işim, BBC / Londra\'dan yakınlarda yurda dönen arkadaşım Nilüfer Kuyaş\'la birlikte *Sabah* gazetesinin "Entellektüel Bakış" sayfasını yapmak oldu.',
  },
  {
    photos: [{ id: '025', width: 1600, height: 1040 }],
    caption:
      '*Cumhuriyet\'*ten yakın arkadaşım rahmetli Ufuk Güldemir genel yayın müdürü atanınca sayfayı Nilüfer\'le birlikte *Milliyet*\'e taşıdık (1994-2001). Güldemir\'den sonraki genel yayın müdürü Derya Sazak\'la birlikte çekilen fotoğrafta, meslektaşlar (ayakta) Osman Ulagay, Ahmet Tan, Duygu Asena, Edip Öymen, Yavuz Baydar, (oturanlar) Meral Tamer, ben, Sazak ve Tayfun Ertan.',
  },
  {
    photos: [{ id: '026', width: 1600, height: 1064 }],
    caption:
      'İsveç\'ten yurda dönüş sonrasında en yakın arkadaşım ve fikirdaşım, doktora yaptığı Fransa\'dan dönen (o da önce devrimci sonra sosyal demokrat) değerli iktisatçımız Prof. Dr. Seyfettin Gürsel oldu. Onunla *DSP-SHP: Nerede Birleşiyor, Nerede ayrılıyorlar* (AFA, 1986) başlıklı bir kitapçık yazdığımız gibi uzun yıllar Bahçeşehir Üniversitesi\'nde birlikte çalıştık.',
  },
  {
    photos: [{ id: '027', width: 1600, height: 1051 }],
    caption:
      'Fatma\'nın en çok sevdiğim fotoğraflarından birini Haziran 1995\'te New York\'a birlikte yaptığımız ilk ziyaret sırasında *Empire State Building* adlı ünlü gökdelenin tepesinde çektim.',
  },
  {
    photos: [{ id: '029', width: 1600, height: 1081 }],
    caption:
      'Fatma\'nın bu çok sevdiğim fotoğrafını da, 1999\'da davetli olarak gittiğimiz Çin Halk Cumhuriyeti\'nde çektim. Arka planda Çin seddi görülüyor.',
  },
  {
    photos: [{ id: '030', width: 1600, height: 1079 }],
    caption:
      '2001\'de *Milliyet*\'teki işime son verilince, Stockholm Üniversitesi\'nde yaptığım doktora işe yaradı. Yakın dostlarımdan biri olacak Prof. Dr. Eser Karakaş beni Bahçeşehir Üniversitesi\'nde ders vermeye davet etti. Fotoğraf Eser\'in çalışma odasında çekildi.',
  },
  {
    photos: [{ id: '031', width: 1600, height: 1045 }],
    caption:
      'Bahçeşehir Üniversitesi en uzun süre çalıştığım işyeri oldu; 2001-15 arasında 14 yıl süreyle lisans ve yüksek lisans öğrencilerine siyaset bilimi dersleri verdim. Fotoğrafta bir konferans vermesi için davet ettiğim kıdemli dostum Prof. Dr. Haluk Şahin\'in ziyareti dolayısıyla çekilen fotoğrafta son sınıf öğrencilerimle görülüyorum.',
  },
  {
    photos: [{ id: '032', width: 1600, height: 1058 }],
    caption:
      'Cumhurbaşkanı Recep Tayyip Erdoğan ile İstanbul Büyükşehir Belediye Başkanı seçildiği 1994 yılında, *Sabah* gazetesi için yaptığım mülakat dolayısıyla tanıştım. 2000\'lerin başında çekilen bu fotoğrafta, değerli meslektaşım Nazlı Ilıcak\'ın evindeki bir davette, henüz sadece AKP lideri olan Erdoğan ve değerli sosyal tarihçimiz rahmetli dostum Prof. Dr. Kemal Karpat ile birlikteyiz.',
  },
  {
    photos: [
      { id: '033-1', width: 1200, height: 1600 },
      {
        id: '033-2',
        width: 1200,
        height: 1600,
        alt: 'El yazısıyla ithaf: “Beni özgürlüğe kavuşturan değerli avukatım Aynur Tuncel Yazgan’a teşekkür ve saygılarımla”, Şahin Alpay imzası, Kasım 2024.',
      },
    ],
    caption:
      'Bahçeşehir Üniversitesi\'nde tam zaman öğretim üyeliği yaparken, Kasım 2002\'den itibaren kapatılacağı 2016 yılına kadar *Zaman* gazetesinde haftada üç gün köşe yazdım. 15 Temmuz darbe girişimi üzerine "terör örgütü üyesi olduğum" iddiasıyla tutuklandım ve Mart 2018\'e kadar Silivri cezaevine konuk oldum. Savcılık hakkımda üç kez ağırlaştırılmış ömür boyu hapis cezası istediyse de yargılama sonunda 2022\'de "üye olmamakla beraber terör örgütüne destek verdiğim" gerekçesiyle 2,5 yıl hapse mahkum oldum. Avukatım Aynur Tuncel Yazgan\'ın temyiz ettiği karar halen Yargıtay\'da beklemekte. Fotoğrafta değerli avukatımla birlikte görülüyoruz.',
  },
  {
    photos: [{ id: '034', width: 1600, height: 1200 }],
    caption:
      '"Terör örgütü üyesi" olduğum iddiasıyla yargılanmam boyunca, gerek yazarak gerekse duruşmalarda yalnız bırakmayarak desteğini esirgemeyen, değerli ve kıdemli meslektaş ve dostum Hasan Cemal ile mahkeme koridorlarındayız.',
  },
  {
    photos: [{ id: '035', width: 1600, height: 1189 }],
    caption:
      'Robert Lisesi\'nden 1963\'te mezun olan sınıfın bir şansı da Öğrenci Konseyi başkanımız Hüsnü Özyeğin\'in giderek ülkenin en başarılı işadamlarından biri olmasıdır. Hüsnü\'nün yıllık sınıf davetlerinden birinde, 2005\'ten beri sahibi olduğu Swissotel\'in bahçesindeyiz.',
  },
  {
    photos: [{ id: '036', width: 1600, height: 1063 }],
    caption:
      'Robert Lisesi\'nde ömür boyu sürecek dostluklar edindim. 2020\'lerdeki bir sınıf buluşmasında çekilen bu fotoğrafta çok sevdiğim sınıf arkadaşlarım (soldan sağa) Mehmet Araslı, Kemal Dülger, (büyük iyiliklerini gördüğüm, tanınmış tıp profesörü) Hasan Yazıcı ve (kısmen görünen, Boğaziçi Üniversitesi fizik profesörü) Haluk Beker ile birlikteyiz. Ne yazık ki Hasan ve benim dışımdakiler son birkaç yıl içinde rahmetli oldular. Nur içinde yatsınlar.',
  },
  {
    photos: [{ id: '037', width: 1600, height: 1189 }],
    caption:
      'Fatma\'yla bu fotoğrafımız Mayıs 2018\'de, Ayvalık Çamlık\'taki evimizin bahçesinde elele tutuşmuş olarak, artık hiç ayrılmayacağımızı konuşurken, yeğenimiz Yeşim tarafından bizden habersiz çekildi. Ne yazık ki Fatmam 6 Ekim 2018\'de aramızdan ayrılacaktı...',
  },
  {
    photos: [
      { id: '028-1', width: 1200, height: 1600 },
      { id: '028-2', width: 1600, height: 1156 },
    ],
    caption:
      'Hiç kuşkum yok ki, hayattaki en büyük mutluluk kaynağım, Fatma gibi bir eşe, Elvan ve Acar gibi evlatlara, Defne ve Leyla gibi torunlara sahip olmam. Fotoğraflarda Elvan ile Defne yakınlarda Filibe\'de; Acar\'la Leyla birkaç yıl önce Çamlık, Ayvalık\'ta görülüyor.',
  },
]
