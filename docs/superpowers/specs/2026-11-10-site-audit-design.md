# Site Denetimi — Yazılım ve UI/UX Değerlendirmesi

**Tarih:** 2026-11-10 · **Denetlenen sürüm:** `main` @ `8636e5a` (canlı: sahinalpay.com.tr)
**Uygulama planı:** `docs/superpowers/plans/2026-11-10-site-audit-remediation.md`

Bu belge bir değerlendirmedir; hiçbir kod değişikliği içermez. Her bulgunun bir
kimliği vardır (`PERF-1`, `A11Y-2`, `UX-3`, `ENG-4`, `DEL-5`); uygulama planındaki
görevler bu kimliklere atıf yapar.

## 1. Kapsam ve yöntem

- **Kod:** `src/`, `scripts/`, `tests/`, yapılandırma dosyaları, CI iş akışları, derleme
  çıktısı (`npm run build`), bağımlılık durumu (`npm audit`, `npm outdated`).
- **Canlı site:** `curl` ile yanıt başlıkları, sıkıştırma, önbellek, yönlendirmeler, 404.
- **Arayüz:** `npm run serve:dist` üzerinde başsız Chrome (DevTools protokolü) ile
  **77 ölçüm**: 15 Türkçe sayfa × (telefon açık tema, telefon koyu tema, masaüstü açık
  tema) + 9 İngilizce sayfa × 2 + 5 masaüstü koyu tema + 6 ölçüm 320px genişlikte +
  3 tablet. Her ölçümde: yatay taşma, dokunma hedefi boyutu, yazı boyutları, kontrast
  (WCAG formülü), başlık sırası, etiketsiz denetimler, görsel öznitelikleri, yerleşim
  kayması (CLS), ağ istekleri. Ayrıca 15 etkileşim senaryosu (menü, arama, yayın
  seçimi, okuyucu, ışık kutusu, yazdırma, metin büyütme) ve yaklaşık 40 ekran görüntüsü
  gözle incelendi.
- **Tasarım denetleyicisi:** `impeccable detect` (tek uyarı: `src/index.css:601`).
- Ham veriler ve betikler: `tmp/site-audit-2026-11-10/` (git dışı).

**Ölçülmeyenler:** gerçek cihazda dokunma hareketleri, ekran okuyucu ile uçtan uca
kullanım, gerçek mobil ağda yükleme süreleri (yerel sunucuda ölçüldü; ağ gecikmesi
yok), Safari ve Firefox. Lighthouse çalıştırılmadı (yeni araç indirmek gerekiyordu).

## 2. Genel sonuç

Site, kişisel bir arşiv için alışılmadık derecede özenli kurulmuş: tip güvenliği,
CI kapıları, güvenlik başlıkları ve erişilebilirlik temeli çok iyi. Zayıf taraf
**performans mimarisi** (tek büyük giriş paketi, her sayfada indirilen gereksiz
ağırlık) ve **arşivin büyük kısmının yalnızca görüntü olması**. Kullanılabilirlikte en
önemli sorun **aramanın sonuçları yayın yayın bölmesi**.

### Teknik denetim puanı (0–4)

| # | Boyut | Puan | Ana bulgu |
|---|---|---|---|
| 1 | Erişilebilirlik | 3 | Temel çok iyi; 12–13px yazılar, px kök yazı boyutu, 320px taşma, 44px altı hedefler |
| 2 | Performans | 2 | Sayfa bazlı kod bölme yok; giriş paketi 181 kB (gzip); masaüstünde CLS 0,20–0,40 |
| 3 | Tema | 3 | Belirteç sistemi örnek düzeyde; kayıtlı tema JS'ten sonra uygulanıyor (parlama) |
| 4 | Duyarlı tasarım | 3 | 390/820/1440px temiz; 320px'te yatay taşma; metin büyütmede menü taşıyor |
| 5 | Uygulama bütünlüğü | 3 | Tutarlı ve ürüne özgü; birkaç yerde kendi tasarım kuralından sapma |
| | **Toplam** | **14/20** | **İyi — zayıf boyutlar ele alınmalı** |

### Kullanılabilirlik sezgileri (Nielsen, 0–4)

| Sezgi | Puan | Not |
|---|---|---|
| Sistem durumunun görünürlüğü | 2 | Arama "19 yazı" der, 1 sonuç gösterir (UX-1); seçili yayın telefonda görünmez (UX-5) |
| Gerçek dünyayla uyum | 4 | Gazete bayii, kupür, künye dili yerinde |
| Kullanıcı denetimi | 3 | Geri bağlantıları, filtre temizleme var; yazı boyutu hatırlanmıyor (UX-4) |
| Tutarlılık | 3 | 522/660 sayı farkı (UX-3), tıklanmayan "çip" etiketler (UX-7) |
| Hata önleme | 3 | — |
| Hatırlamak yerine tanıma | 3 | Yalnızca simgeden oluşan kaynak düğmesi; bölüm seçici yalnızca sayfa başında |
| Esneklik ve verim | 2 | Site geneli arama yok (UX-2); arama yayın yayın geziliyor |
| Yalın tasarım | 3 | Güçlü; her satırda yinelenen etiket ve rozetler (UX-6) |
| Hatadan kurtulma | 3 | İki dilli hata ekranları ve "yeniden dene" var; eski paket sorunu açık (ENG-2) |
| Yardım | 3 | Çerez politikası açık ve dürüst |
| **Toplam** | **29/40** | |

## 3. İyi olanlar (korunmalı)

- **Tip güvenliği:** `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`;
  kaynakta tek bir `any`, `@ts-ignore` veya lint bastırması yok.
- **CI:** tip denetimi, lint, 207 test, gizli anahtar taraması, içerik doğrulama, üretilen
  dosyaların güncelliği, derleme, ön-işleme doğrulaması. Eylemler SHA ile sabitlenmiş,
  izinler en aza indirilmiş, Dependabot gruplanmış.
- **Güvenlik:** CSP (`script-src 'self'`), HSTS, `X-Frame-Options`, `nosniff`, COOP/CORP,
  `Permissions-Policy` canlıda doğrulandı. Üçüncü taraf isteği yok. `npm audit`: 0 açık.
- **Erişilebilirlik temeli:** 24 rotanın tamamında tek `h1`, başlık atlaması yok,
  etiketsiz düğme/bağlantı/girdi yok; "ana içeriğe geç" bağlantısı, odak tuzağı olan
  mobil menü, `aria-current`, `inert`; her iki temada ölçülen tüm metinler WCAG AA
  kontrastını geçiyor (en düşük 4,87:1 açık, 5,56:1 koyu).
- **Tasarım sistemi:** 272 CSS sınıfından yalnızca 5'i kullanılmıyor; belirteç dışı 4
  renk var; hareketlerin tümü "azaltılmış hareket" tercihine uyuyor.
- **SEO ve kayıt bütünlüğü:** 1.446 statik HTML dosyası, rota başına başlık/canonical/
  hreflang/JSON-LD, gerçek 404, `<noscript>` metni, `www`/`.com`/`http` yönlendirmeleri.
- **Hata durumları:** kök hata sınırı, arşiv yükleme hatasında yeniden deneme, depolama
  engelli tarayıcılara dayanıklı tercih katmanı.
- **Belgelenmiş kararlar:** kod yorumları "ne" değil "neden" anlatıyor.

## 4. Eksikler

Öncelik: **P1** kullanıcıyı doğrudan etkiler veya kaydın doğruluğuna dokunur · **P2**
belirgin iyileşme · **P3** cila.

### 4.1 Performans ve mimari

**PERF-1 [P1] Sayfa yüklenirken alt bilgi sıçrıyor (CLS).** Arşiv verisi gelene kadar
`<main>` kısa kalıyor, alt bilgi ekranda görünüyor; veri gelince aşağı itiliyor.
Ölçüm (1440×900, kaydırma yok): köşe yazıları 0,37 · söyleşiler 0,40 · makaleler 0,40 ·
yazı sayfası 0,20. "İyi" eşiği 0,10; 0,25 üstü "kötü". Sitenin URL'lerinin çoğu bu
sayfa türlerinden. Kaynak: `footer.site-footer y255→0`.

**PERF-2 [P1] Sayfa bazlı kod bölme yok.** Giriş paketi `index-*.js` 567,5 kB (gzip
181 kB). İçinde yalnızca tek bir sayfanın kullandığı 453 kB metin var:
`trialProcess.ts` 148 kB, `press/turkish.ts` 134 kB, `press/foreign.ts` 73 kB,
`bookForewords.ts` 64 kB, `photoStory.ts` 34 kB. Kodda `React.lazy` hiç kullanılmıyor.
Ana sayfayı açan herkes yargılanma metnini ve basın yazılarını indiriyor.
İlk yükleme (canlı, sıkıştırılmış): JS ≈ 313 kB.

**PERF-3 [P2] Görseller gösterildikleri boyuta göre çok büyük.**
- 262 kB'lik portre (960×1200) hemen her sayfada **40–88px**'lik avatar için indiriliyor.
- Kitap kapakları 96px genişlikte gösteriliyor, toplam 665 kB (940×1410'a kadar).
- Yayın logoları 2000px genişliğe kadar, ~150px gösteriliyor.
- Statik görsellerde `width`/`height` yok; okuyucunun ilk fotoğrafı `loading="lazy"`.

**PERF-4 [P2] Yazı tipi dilimleri amacına hizmet etmiyor.** `latin` / `latin-ext`
ayrımı "İngilizce sayfa Türkçe glifleri indirmesin" diye yapılmış; ama her sayfada
"**Ş**ahin Alpay" yazdığı için İngilizce sayfalar dahil her sayfa iki dilimi de
indiriyor: 5 dosya / 267 kB; yazı sayfasında 6 / 379 kB; kitaplar ve fotoğraflarda
7 / 471 kB. Ön-yükleme yalnızca `latin` dilimleri için tanımlı; Türkçe harfler geç
geliyor.

**PERF-5 [P2] `motion` kütüphanesi 141 kB (gzip 47 kB)**, dört basit efekt için
kullanılıyor: kaydırınca belirme, giriş animasyonu, çerez bandı, görünüm geçişi.

**PERF-6 [P2] Tek bir yazıyı göstermek için tüm arşiv iniyor.** Yazı sayfası iki dilin
arşiv dizinini birlikte yüklüyor: 7 dosya, 1.421 kB ham JS. Arama motorundan gelen
okurun en sık indiği sayfa türü bu.

**PERF-7 [P3] Gövde ön-işlenmiyor.** `#root` boş; ilk boyama JS'in inip çalışmasını
bekliyor. (Büyük, ayrı proje — bkz. §7.)

**PERF-8 [P3] `/photos/` ve `/books/` için önbellek başlığı yok** (4 saat, Cloudflare
varsayılanı); `/archive/` için 1 gün + SWR tanımlı.

### 4.2 Erişilebilirlik

**A11Y-1 [P1, stratejik] Arşivin %88'i yalnızca görüntü.** 695 kaydın 609'u yalnızca
taranmış kupür (Zaman 289, Milliyet 127, Today's Zaman 114, Cumhuriyet 43, Sabah 13,
makaleler 23); tam metin 74 kayıtta var. Sonuç: ekran okuyucu bu yazıları okuyamaz,
telefonda yakınlaştırmadan okunmaz, site araması yalnızca başlık ve etiketlerde
arar, arama motorları ve yapay zekâ tarayıcıları metni göremez. (Ayrı proje — §7.)

**A11Y-2 [P2] 14px altı yazılar.** Telefonda tarih, sayı, rozet ve üst etiketler
12,2px ve 13,3px; masaüstünde 13px. Tasarım belgesi "hiçbir şey küçük değil" diyor ve
okur kitlesi yaşlı. Kaynak: `--text-label-sm: 0.72rem`, `--text-label: 0.78rem` ve
telefonda kök boyutun 17px'e düşmesi.

**A11Y-3 [P2] Kök yazı boyutu px.** `:root { font-size: 18px }` tarayıcıda "daha büyük
yazı" ayarını yok sayıyor. Kırılma noktaları da px olduğu için varsayılan yazı boyutu
büyütüldüğünde masaüstü menü sağa taşıyor (1280px'te 1695px genişlik).

**A11Y-4 [P2] 320px'te yatay taşma (WCAG 1.4.10).** Üst bant (ad + üç düğme) 320px'e
sığmıyor; sayfa 348px genişliyor, tema düğmesi kesiliyor. %400 yakınlaştırmada da
aynı durum oluşur.

**A11Y-5 [P2] 44px'ten küçük dokunma hedefleri.** Kitaplar sayfasında 13–16 bağlantı
21–27px yüksekliğinde (`.book-buy`); 6'sı 24px'in de altında. Ayrıca site adı 40px,
yıl girdileri 42px. Tasarım belgesi "her denetimde 44px taban" diyor.

**A11Y-6 [P3] Fotoğraflarla Hikayem: 38 görselin 37'sinde `alt=""`.** Açıklama metni
altta var; ama görselin kendisi ekran okuyucuya hiç bildirilmiyor.

**A11Y-7 [P2] Yazdırma stili yok.** Yazdırınca üst bant, menü, düğmeler ve lila zemin
de çıkıyor; ekrana girmemiş "belirme" blokları boş basılabilir. Atıf yapan
araştırmacı için yazdırma gerçek bir kullanım.

**A11Y-8 [P2] Tema parlaması.** Kayıtlı tema React yüklendikten sonra uygulanıyor.
Sistem açık, tercih koyu ise her tam sayfa yüklemesinde önce açık zemin görünüyor.

### 4.3 Kullanılabilirlik

**UX-1 [P1] Arama sonuçları yayınlara bölünüyor.** "ermeni" araması "19 yazı" diyor,
ama yalnızca seçili yayının (Medyascope) 1 sonucunu listeliyor; kalan 18 sonuç için
P24 (4), Zaman (13), Milliyet (1) kartlarına tek tek tıklamak gerekiyor. Telefonda
diğer kartlar yatay kaydırmanın arkasında.

**UX-2 [P2] Site geneli arama yok.** Ana sayfadaki "Yazı veya konu ara…" kutusu
yalnızca köşe yazılarında arıyor; söyleşiler, makaleler, basın yazıları ve
yargılanma metni kapsam dışı ve bu belirtilmiyor.

**UX-3 [P2] Sayılar tutarsız.** Ana sayfa kartı "522 yazı", köşe yazıları sayfası
"660 yazı" diyor (522 Türkçe + 138 İngilizce). Söyleşiler ve makaleler için de birim
"yazı" ("11 söyleşi", "24 makale" olmalı).

**UX-4 [P2] Yazı boyutu tercihi hatırlanmıyor.** A−/A+ her yazıda sıfırlanıyor; yaşlı
okur her yazıda yeniden büyütmek zorunda.

**UX-5 [P2] Gazete bayii görünümü.** (a) Varsayılan seçim en yeni yayın (Medyascope,
3 yazı): 660 yazılık arşivin ilk görünümü 3 satır ve büyük boş panel. (b) Telefonda
seçili yayın yatay şeritte görünmüyor ve içindekiler listesi "Yabancı Dilde" bloğunun
altında, şeritten uzakta. (c) Telefonda tarih satırı hizasız.

**UX-6 [P3] Her satırda yinelenen etiketler.** Köşe yazıları listesinde her satırda
"KÖŞE YAZISI" + kırmızı "KUPÜR"; makalelerde her satırda "TARAMA". Tasarım belgesi:
"kırmızıyı her satırda görünen bir şeye harcama".

**UX-7 [P3] Okuyucu sayfası.** Rakamla başlayan paragrafta süslü ilk harf yılı bölüyor
("**1** 972'nin"); masaüstünde kupür ~450px genişlikte kalıyor, iki yanı boş; dokunmatik
ekranda "tam boyutunda aç" etiketi kupürün son satırlarını örtüyor; tarih ve yayın alt
başlıkta ve imza satırında iki kez; ışık kutusu alt yazısında yayın ve tarih yineleniyor;
etiketler tıklanabilir çip gibi görünüyor ama tıklanmıyor; kaynak göster düğmesi
yalnızca simge.

**UX-8 [P2] Yargılanma sayfası telefonda 114.178px** (≈135 ekran). Bölüm seçici yalnızca
sayfanın başında; okur derindeyken bölüm değiştirmek için başa dönmek zorunda.

**UX-9 [P3] Çerez bandı** ilk ziyarette telefon ekranının %22'sini kaplıyor; içeriği
"çerez kullanmıyoruz" bildirimi. (Sahibinin kararı — §6.)

**UX-10 [P3] Küçük yerleşim sorunları.** 404 sayfasında başlık–metin–düğme aralıkları
dar; Kimdir sayfasında başlık altında ~100px boşluk; kırıntı yolu telefonda "/" ile
biten satıra bölünüyor; basın listesinde tarih biçimleri karışık ("27 Temmuz 2016",
"12.4.2017").

**UX-11 [P3] Söyleşiler** listesindeki 11 kaydın tamamı dış siteye/videoya gidiyor;
satırda bunu belirten bir işaret yok.

**UX-12 [P2] Google Translate sayfayı bozuyor** (sahibi 2026-11-09'da bildirdi,
ertelendi). Simge yazı tipi sözcükleri çevriliyor; Translate'in eklediği `<font>`
etiketleri React güncellemelerini çökertebiliyor. Kodda hiç `translate="no"` yok.

### 4.4 Yazılım hijyeni

**ENG-1 [P1] Aynı veri birden çok yerde ve biri yanlış.** `index.html`'deki sabit
JSON-LD her sayfada "Sosyal Demokrasi Açısından Kürt Sorunu (1992)" kitabını Şahin
Alpay'ın kitabı olarak bildiriyor; bu kitap Kitaplar sayfasında yok (ortak bir derleme,
makaleler bölümünde geçiyor). Kitap listesi ayrıca `content.ts` içinde iki dil için iki
kez yazılmış (yeni bir alan iki yere eklenmek zorunda).

**ENG-2 [P2] Yayın sonrası eski paket hatasından kurtulma yok.** Açık sekmedeki eski
sayfa, yeni yayından sonra silinmiş paketi isterse "yeniden dene" de başarısız olur;
`vite:preloadError` dinlenmiyor.

**ENG-3 [P2] Arayüz için otomatik güvence zayıf.** 207 testin çoğu veri ve araç
katmanında. Rotaların açıldığını sınayan test, paket boyutu bütçesi ve tekrarlanabilir
arayüz ölçümü yok; "tarayıcıda elle bak" adımına dayanılıyor.

**ENG-4 [P3] Büyük dosyalar.** `index.css` 4.018 satır, `components/archive/index.tsx`
1.362, `App.tsx` 1.019, `components/reader/index.tsx` 702.

**ENG-5 [P3] Ölü kod.** `AppV1` sarmalayıcısı; hiç kullanılmayan `withOutletSectionItems`,
`withFlatSectionItems`, `findArchiveItem` (`archive/index.ts`), `slugFromUrl`
(`routes.ts`); `Content.contactLabel`; CSS'te `btn-disabled`, `chip-row`,
`kicker-center`, `section-title-center`, `works-grid`.

**ENG-6 [P3] Kullanımdan kalkan derleme seçeneği.** Her derlemede uyarı:
"`advancedChunks` option is deprecated, please use `codeSplitting`".

**ENG-7 [P3] Belgeler güncel değil.** `PRODUCT.md`: "test paketi yok", "576 kayıt",
"altı kitap", artık olmayan Chronicle ve haftalık seçkiler. `CLAUDE.md`: `index.css`
"~2.200 satır" (4.018), "583 HTML" (1.446), `docs/superpowers/` "üçüncü taraf" (projenin
kendi plan ve tasarım belgeleri). `ArchiveInlineFailure` metni artık olmayan "seçkiler"den
söz ediyor.

**ENG-8 [P2] CI'daki `claude-review` işi başarısız** (2 saniyede, sıfır maliyetle hata;
büyük olasılıkla `CLAUDE_CODE_OAUTH_TOKEN`). Zorunlu denetim değil ama her PR'da kırmızı.

**ENG-9 [P3] Eksik küçük dosyalar.** `/favicon.ico` ve `/apple-touch-icon.png` 404;
`theme-color` yok.

**ENG-10 [P3] Depo ağırlığı.** Paket 878 MiB; geçmişteki 564 MB artık `HEAD`'de olmayan
eski kupür sürümleri. `public/archive` içinde hiçbir kayda bağlı olmayan 56 dosya
(84,7 MiB) canlıya gidiyor (`docs/OPERATIONS.md` bilinçli tutulduğunu söylüyor).

**ENG-11 [P3] Biçimlendirici yok; 11 farklı px kırılma noktası** (419, 559, 560, 640,
700, 767, 768, 800, 900, 1000, 1080).

## 5. Gereksiz olanlar

| Kimlik | Ne | Neden gereksiz | Öneri |
|---|---|---|---|
| DEL-1 | `motion` bağımlılığı | 47 kB (gzip), dört basit efekt | CSS + küçük bir kanca (PERF-5) |
| DEL-2 | `latin-ext` dilimine bağımlılık | Her sayfa zaten indiriyor | Türkçe harfleri ana dilime al (PERF-4) |
| DEL-3 | `index.html`'deki sabit kitap JSON-LD kaydı | Yanlış ve yinelenen | Hatalı kaydı çıkar, testle koru (ENG-1) |
| DEL-4 | `AppV1`, 4 ölü dışa aktarım, `contactLabel`, 5 CSS sınıfı | Kullanılmıyor | Sil (ENG-5) |
| DEL-5 | `<meta name="keywords">`, `geo.region`, `geo.placename` | Arama motorları yok sayıyor | Sil |
| DEL-6 | Her satırdaki "KÖŞE YAZISI" etiketi ve tümüne aynı rozet | Bilgi taşımıyor | Kaldır (UX-6) |
| DEL-7 | İmza satırı ve ışık kutusunda yinelenen tarih/yayın | Aynı bilgi iki kez | Tekilleştir (UX-7) |
| DEL-8 | 11 ve 24 kayıtlı listelerde açılır "Filtreler" paneli | Tek filtre için ek adım | Yıl aralığını doğrudan göster |
| DEL-9 | `.gitignore`'daki Java/Maven satırları, `.oxlintrc.json`'da üç kez yinelenen desen | Kalıntı | Temizle |
| DEL-10 | `advancedChunks` | Kullanımdan kalktı | `codeSplitting`'e geç (ENG-6) |
| DEL-11 | Çerez bandının büyüklüğü | Rıza gerektirmeyen bildirim | Sahibinin kararı (§6) |
| DEL-12 | Canlıya giden 84,7 MiB bağlantısız dosya | Hiçbir sayfa kullanmıyor | Sahibinin kararı (§6) |

Depoda olmayan ama proje klasöründe duran, uygulamayla ilgisiz dizinler
(`agent-skills/`, `awesome-claude-code-subagents/`, `stitch_…/`, `şahin-alpay-arşivi/`,
`.codex/`, 1 GB'lık `tmp/`) git tarafından yok sayılıyor; zararsız, isterseniz klasör
dışına taşınabilir.

## 6. Sahibinin kararını bekleyen konular

1. **Yazı boyutu tabanı (A11Y-2):** küçük etiketlerin 14px'e çıkarılması görünümü
   değiştirir ve `DESIGN.md`'deki ölçeği günceller.
2. **`motion`'ın kaldırılması (PERF-5):** `CLAUDE.md`'deki "animasyonlar `motion` ile
   yapılır" kuralını değiştirir.
3. **Yazı tiplerinin yeniden üretilmesi (PERF-4):** kaynak TTF dosyalarının
   GitHub'dan indirilmesini gerektirir.
4. **Arama sonuçlarının tek liste olması (UX-1):** onaylanmış gazete bayii
   davranışını arama sırasında değiştirir.
5. **Yazı boyutunun saklanması (UX-4):** çerez politikası metnine dördüncü bir öğe ekler.
6. **Çerez bandı (UX-9):** küçültmek ya da yalnızca alt bilgi bağlantısına indirmek.
7. **"Sosyal Demokrasi Açısından Kürt Sorunu" (ENG-1):** yapılandırılmış veriden
   çıkarılması; ya da Kitaplar sayfasına eklenmesi.
8. **Gazete bayiinin varsayılan seçimi (UX-5a):** en yeni yayın yerine en çok yazısı olan.
9. **Bağlantısız 84,7 MiB dosya (ENG-10):** `public/` dışına alınması.
10. **`claude-review` (ENG-8):** GitHub'da gizli anahtarın yenilenmesi — yalnızca sahibi
    yapabilir.

## 7. Ayrı tasarım belgesi gerektiren büyük işler

Bu plan kapsamında değildir; her biri için önce ayrı bir tasarım konuşması gerekir.

- **Taramalar için metin katmanı (A11Y-1).** `npm run ocr:scans` ile makine okuması,
  "düzeltilmemiş makine okuması" uyarısıyla; arama dizinine ve `<noscript>`'e girer.
  İçerik bütünlüğü kuralları nedeniyle pilot (örn. Milliyet, 127 yazı) ve sahibin
  kalite onayı şart.
- **Gövdenin ön-işlenmesi ve yazı başına veri (PERF-6, PERF-7).** Okuyucu sayfası
  tüm arşiv yerine yalnızca kendi kaydını yüklesin; görünür gövde derlemede üretilsin.
- **Site geneli arama (UX-2).**
- **Yargılanma sayfasının bölümlere ayrılması (UX-8)** veya yapışkan bölüm gezinmesi.
- **Depo geçmişinin hafifletilmesi (ENG-10).** Geçmişi yeniden yazmak geri alınamaz;
  yalnızca klonlama gerçek bir sorun olursa.
- **Biçimlendirici benimsenmesi ve `index.css`'in bölünmesi (ENG-4, ENG-11).**

## 8. Ölçüm özeti

**İlk yükleme, Türkçe ana sayfa (yerel, sıkıştırmasız):** 15 istek, 1.559 kB —
JS 942 kB (6 dosya), yazı tipi 267 kB (5), portre 256 kB, CSS 65 kB.
**Canlıda sıkıştırılmış:** `index` 181 kB, `vendor` 82 kB, `motion` 49 kB, CSS 13 kB.

| Sayfa (1440×900) | Yükseklik | CLS (yükleme) | JS ham | Yazı tipi |
|---|---|---|---|---|
| Ana sayfa | 2.650px | 0,00 | 942 kB | 267 kB |
| Köşe yazıları | 1.945px | 0,37 | 1.421 kB | 267 kB |
| Yazı (kupür) | 4.362px | 0,20 | 1.421 kB | 379 kB |
| Söyleşiler | 2.166px | 0,40 | 1.421 kB | 267 kB |
| Makaleler | 3.688px | 0,40 | 1.421 kB | 267 kB |
| Kitaplar | 2.422px | 0,00 | 942 kB | 471 kB |
| Yargılanma | 67.333px | 0,00 | 942 kB | 267 kB |

| Denetim | Sonuç |
|---|---|
| Yatay taşma (390 / 820 / 1440px) | Yok |
| Yatay taşma (320px) | Var — 348px (A11Y-4) |
| Kontrast hatası (77 ölçüm) | 0 |
| Etiketsiz düğme / bağlantı / girdi | 0 |
| Başlık atlaması · birden çok `h1` | 0 · 0 |
| 44px altı hedef | Kitaplar 13–16; diğer sayfalar 0–2 |
| En küçük yazı | 12,2px (telefon), 13px (masaüstü) |
| Konsol hatası | Yok (404 sayfasındaki beklenen 404 dışında) |

## 9. Yeniden ölçüm

Betikler `tmp/site-audit-2026-11-10/` altındadır: `cdp.mjs` (ölçüm), `mkjobs.mjs`
(77 ölçümlük matris), `mk2.mjs` (CLS ve 320px), `mk3.mjs` (etkileşimler), `summ.mjs` ve
`detail.mjs` (özet), `deadcode.mjs` (kullanılmayan CSS ve dışa aktarımlar). Planın 1.
görevi bunu `npm run audit:ui` olarak depoya alır; sonraki görevlerin doğrulama adımları
bu komuta dayanır.
