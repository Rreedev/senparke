# ŞENPARKE — Yeni Web Sitesi Teklifi ve Teslim Dokümanı

> Hazırlanan sistem: **Laminat parke (AGT + Yıldız Entegre, 290 model) + Mutfak dolabı** odaklı,
> Çamsan Entegre laminat kategorisi referans alınarak baştan tasarlanmış, tamamen çalışan bir site prototipi.
> Tasarım referansı: `https://www.camsanentegre.com/kategori/laminat-parke`

---

## 1. Ne yapıldı? (Özet)

| Kale | Durum |
|---|---|
| Eski site (senparke.com) incelendi | ✅ Tüm sayfalar okundu, iletişim/kuruluş bilgileri alındı |
| AGT laminat koleksiyonları çekildi | ✅ 23 koleksiyon · **194 model** (isim, kod, açıklama, teknik özellik, görsel) |
| Yıldız Entegre laminat parkeler çekildi | ✅ 11 koleksiyon · **96 model** (VarioClic + TerraClick; süpürgelik kapsam dışı bırakıldı) |
| Görseller indirildi + optimize edildi | ✅ ~630 görsel, ~22 MB (yerel, hızlı yüklenir) |
| Ürün kataloğu birleştirildi | ✅ **290 model / 34 koleksiyon / 2 marka** — tamamı Şenparke adı altında |
| Site baştan tasarlandı ve üretildi | ✅ **301 sayfa** (ana sayfa, kategori, 290 ürün sayfası, mutfak, markalar, galeri, hakkımızda, iletişim, teklif, KVKK, çerez, 404) |
| Arama, filtre, sıralama, teklif akışı | ✅ Çalışır durumda (canlı önizlemede test edildi) |
| SEO altyapısı | ✅ sitemap.xml, robots.txt, canonical, JSON-LD (Organization + Product), meta açıklamalar |

Kapsam kararı (müşteri talebi): **yalnızca laminat parke ürünleri + mutfak dolabı** yer alır.
Masif, lamine, süpürgelik ve dış mekân ürünleri bu sürüme dahil edilmedi (verileri `data/` klasöründe duruyor, istenirse sonradan eklenebilir).

---

## 2. Eski siteden ne korundu?

- **Kuruluş kimliği:** 1978, kurucu Muhsin Şen — ana sayfa ve hakkımızda sayfasında.
- **İletişim bilgileri (Google İşletme kaydı):** Taha ŞEN 0553 728 17 55 (telefon ve WhatsApp) · Muhsin ŞEN 0544 211 95 48 · e-posta sitede yok
- **Adres:** Cihangir Mah. Ormanlı Cad. Fırat Sk. No: 1/A, 34310 Avcılar — showroom, ofis ve 1000 m² ana depo aynı yerde. Sitede yalnızca Avcılar geçer.
- **Özgün fotoğraflar:** eski siteden 16 galeri fotoğrafı ve dükkân fotoğrafı yeni galeride kullanıldı.

> Çalışma saatleri: hafta içi ve Cumartesi 08:00–21:00, Pazar kapalı (Google İşletme kaydı).
> Yayın öncesi güncel adres ve çalışma saatlerinin **teyidi gerekir** (iletişim sayfasında bu not ayrıca belirtiliyor).

---

## 3. Site yapısı (sitemap)

```
/                              Ana sayfa (hero, kategoriler, koleksiyonlar, öne çıkanlar,
                               mutfak, markalar, süreç, galeri, hikâye, CTA)
/kategori/laminat-parke/       290 model · 34 koleksiyon · filtre + sıralama + sayfalama
/urun/<urun-id>/               290 ürün detay sayfası (galeri, teknik özellik, benzer ürünler)
/mutfak-dolabi/                Stiller, malzemeler, süreç, SSS
/markalar/                     AGT ve Yıldız Entegre tanıtım + koleksiyon kısayolları
/galeri/                       Uygulama / mutfak / ilham filtreli galeri + lightbox
/hakkimizda/                   1978 hikâyesi, değerler, kilometre taşları
/iletisim/                     Showroom/depo kartları, form, harita
/teklif/                       Keşif & teklif formu (ürün ön-seçimli)
/kvkk/  /cerez-politikasi/     Yasal taslak sayfalar
/404.html                      Hata sayfası
/sitemap.xml  /robots.txt
```

### Kategori sayfası özellikleri (Çamsan referansı)
- Marka, **koleksiyon (34)**, renk tonu (açık/orta/koyu), desen (ahşap/taş-beton), kalınlık (8–12 mm) ve kenar tipi filtreleri
- İsim / marka / kod sıralaması, "daha fazla göster" ile sayfalama (12'li gruplar)
- Aktif filtre çipleri, tek tıkla temizleme
- URL ile filtre senkronu: `/kategori/laminat-parke/?collection=Mood+XLarge&brand=AGT` gibi paylaşılabilir bağlantılar
- Üstte yatay kaydırmalı koleksiyon şeridi (karta tıklayınca filtreler)
- Altta SEO rehberi + SSS

### Ürün detay sayfası
- Görsel galeri + lightbox (yakınlaştırma)
- Marka/koleksiyon etiketi, ürün kodu, renk tonu
- Anahtar teknik özellikler (kalınlık, ebat, yüzey, paket) + tam teknik tablo
- Öne çıkan özellikler (su direnci, yerden ısıtma uyumu vb.)
- "Teklif Al" (ürün bilgisi teklif formuna taşınır) + WhatsApp butonu
- Benzer ürünler (aynı koleksiyon/marka)

### Mutfak dolabı
- Üç stil: Modern & Minimal · Doğal Ahşap · Açık Plan & Ada
- Malzeme rehberi: kapak, gövde, tezgâh, donanım
- Keşif → proje → üretim → montaj süreci
- SSS ve teklif CTA'ları

---

## 4. Tasarım sistemi

| Öğe | Seçim |
|---|---|
| Kavram | **"Döşeme"** — ana sayfa açılışında ekran parke tahtalarıyla döşenir, kaydırınca tahtalar ayrılıp mekân görünür |
| Logo | Şen Parke elmas parke işareti + "**Şen** Parke" yazısı (SVG, `scripts/lib.js` → `logoMark()`) |
| Renk paleti | Kireç `#ecebe6` · ceviz `#2e2119` · meşe `#b7834f` · ölçü şeridi sarısı `#f0c02f` (yalnızca vurgu) |
| Yazı tipi | Archivo (tek aile, genişlik ekseni): başlıklar genişletilmiş 112–125%, metin normal; italik yok |
| Hareket | GSAP + ScrollTrigger + Lenis (yerel: `public/assets/vendor/`), `public/assets/js/motion.js` |
| Efektler | Tahta döşeme intro'su · sabitlenip yatay kayan koleksiyonlar · imleci takip eden görselli doku listesi · üst üste binen paneller · ölçü cetveli süreç · hıza tepki veren marka bandı · manyetik butonlar · tahta perdeli sayfa geçişi · özel imleç |
| Tahta dokuları | `node scripts/make-planks.js` AGT dekor görsellerini 90° çevirip `public/images/planks/` altına yazar |
| Marka rozetleri | AGT (siyah) · Yıldız (bakır) — her ürün kartında marka görünür |
| Mobil | 1024px altı çekmece menü + filtre paneli, 780px altı tekli/sütunsal düzen |
| Erişilebilirlik | Klavye ile gezilebilir menü/arama, `Esc` kısayolları, skip-link, `prefers-reduced-motion` desteği |

Çamsan'ın kategori deneyimi (filtre + ızgara + koleksiyon şeridi) birebir örnek alındı;
görsel kimlik Şenparke'ye ait (yeşil-bakır editoryal dil) ve tüm sayfalar yeni üretildi.

---

## 5. Veri modeli

`public/data/` altında:
- `products.json` — 290 ürünün tam kaydı (teknik özellikler, açıklamalar, görseller, kaynak URL)
- `catalog.json` — arama/filtre için hafif sürüm (~136 KB)
- `collections.json` — 34 koleksiyon (marka, görsel, ürün sayısı)

Her ürün kaydında: `id, brand, category, name, code, collection, description, images[],
tone (açık/orta/koyu + hex), decor, thickness, size, joint, specs{}, tags[], url`.

Ek kaynaklar (Kasım 2026): `node scripts/scrape-camsan.js` (Çamsan laminat parke) ve
`node scripts/scrape-yildiz-mdf.js` (Yıldız Entegre MDFlam / Suntalam, kapak, lak, boyalı ve kompakt panel) →
yeni kategori `/kategori/mdf-panel/`. Logo: `brand/senparke-logo-original.png` → `node scripts/make-logo.js`.
İletişim bilgileri Google İşletme kaydından alındı: Avcılar, Cihangir Mah. Ormanlı Cad. Fırat Sk. No: 1/A
(showroom + ofis + 1000 m² ana depo), Taha ŞEN 0553 728 17 55, Muhsin ŞEN 0544 211 95 48, Pzt–Cmt 08:00–21:00, Pazar kapalı. Kurucu: Muhsin Şen.

Google İşletme Profili (Kasım 2026): açıklama yenilendi, ek kategoriler (Zemin Döşeme Mağazası, Mutfak
Mobilyası Mağazası) eklendi, logo/kapak ve 9 mekân fotoğrafı `google-profil/` klasöründen yüklendi, Şubat 2025'teki
14 eski fotoğraf silindi. Web sitesi alanı http://senparke.com/ olarak girildi (Google bir ara kendiliğinden
senparke.com.tr'ye çevirmişti — o alan adı yok; kontrol edin). Sitedeki harita/yol tarifi bağlantıları profile
(cid=6902869844658238653) gider. Hesapta ayrıca eski No: 47 adresli, doğrulanmamış "Kopya" bir kayıt var.

Taha Şen Yapı alt sitesi (/yapi/, 17 sayfa): `scripts/build-yapi.js` (içerik + sayfalar), `public/assets/css/yapi.css`,
`public/assets/js/yapi.js`. Palet: fırçalanmış pirinç #b08d57, mat siyah #121110, kırık beyaz #efe9de. Logo: brand/tahasen-logo-original.png → `node scripts/make-yapi-logo.js`. Görseller yalnızca CC0 / kamu malı
(Openverse) → `node scripts/fetch-yapi-photos.js` (lisans kaydı: brand/yapi-src/kaynaklar.json) →
`node scripts/grade-yapi-photos.js` (palete göre renklendirme). Sitede "örnek görsel" notu var; gerçek proje
fotoğrafları geldikçe değiştirilmeli. Şen Parke header'ında siyah "Taha Şen Yapı" butonu bu siteye gider.

Mekân fotoğrafları: `senparkefotograf/` içindeki Avcılar çekimlerinden 9 kare seçildi ve
`node scripts/enhance-showroom.js` ile sadık rötuşlandı (beyaz dengesi, ton eğrisi, netlik, canlılık;
kadraj ve içerik değişmedi) → `public/images/showroom/`. Eski senparke.com fotoğrafları siteden kaldırıldı.

Güncelleme: `node scripts/scrape-agt.js` → `node scripts/scrape-yildiz.js` →
`node scripts/download-images.js` → `node scripts/build-data.js` → `node scripts/make-planks.js` → `node scripts/build-site.js`
(Ana sayfa: `scripts/build-home.js` · tasarım: `public/assets/css/style.css` · hareket: `public/assets/js/motion.js`)

---

## 6. SEO

- Tüm sayfalarda özgün `title` + `meta description`, canonical URL
- `sitemap.xml` (301 URL) + `robots.txt`
- JSON-LD: Organization (her sayfa) + Product (290 ürün sayfası)
- Temiz URL yapısı: `/kategori/laminat-parke/`, `/urun/agt-mood-xlarge-mare/`
- Statik HTML → hızlı ilk boyama; görseller lazy-load
- Fiyat gösterilmediği için Product şemasında fiyat yerine "teklif alın" eylemi var
  (e-ticaret'e geçilirse fiyat + stok eklenmeli)

---

## 7. Teknoloji ve yayın

Mevcut sistem: **%100 statik site** (Framework yok). `public/` klasörü herhangi bir
statik hosting'e (Netlify, Vercel, cPanel, nginx…) olduğu gibi yüklenir.

Önerilen yayın senaryosu:
1. **Domain + hosting** tarafınızdan sağlandığında → `public/` klasörü olduğu gibi yüklenir.
2. SSL (https) aktif edilir; `scripts/lib.js` içindeki `domain` alanı güncellenir.
3. Formlar şu an demo: gönderim **WhatsApp'a** aktarılıyor (çalışır durumda).
   Gerçek kayıt istenirse: Netlify Forms / bir PHP form / küçük bir API eklenebilir.
4. İleride e-ticaret (fiyat, sepet) istenirse aynı veri modeli bir headless CMS'e
   (ör. Directus/Strapi) taşınabilir; site yapısı buna uygun.

Yerel önizleme: `node scripts/serve.js 4173` → `http://localhost:4173`

### Canlı yayın (26.11.2026)
- **Depo:** https://github.com/Rreedev/senparke (`main` = kaynak, `gh-pages` = `public/` içeriği).
- **Hosting:** GitHub Pages, `gh-pages` dalından. HTTPS zorunlu.
- **Şu anki adres:** https://senparke.rree.site (Cloudflare'de rree.site → CNAME `senparke` → `rreedev.github.io`, DNS only).
- **Güncelleme:** `powershell -File scripts\deploy.ps1 "not"` → derler, `main`'e push eder, `gh-pages`'i yeniler.
- **Ana alan adı: senparke.com.tr** (Natro hesabında kayıtlı; NS → `dawn` + `jeremy.ns.cloudflare.com`).
  Cloudflare kayıtları: apex A → 185.199.108–111.153, `www` → `rreedev.github.io`, hepsi "DNS only".
- **senparke.xyz** (Natro; NS → `karina` + `venkat.ns.cloudflare.com`): Cloudflare Redirect Rule ile
  tüm istekler 301 → `https://senparke.com.tr/<yol>`.
- **Durum (26.11.2026):** Natro panelinde NS değişti; .xyz registry'e geçti ve 301 yönlendirme çalışıyor.
  .com.tr için TRABIS henüz eski Natro NS'lerini gösteriyor (whois.trabis.gov.tr ile kontrol edildi).

### SEO / GEO (alan adından bağımsız, yayında)
- Her sayfada tek `@graph`: Şen Parke (`HomeAndConstructionBusiness` + `HomeGoodsStore`, `@id` …/#sen-parke),
  WebSite, WebPage; Taha Şen Yapı sayfalarında ayrıca `GeneralContractor` (…/yapi/#taha-sen-yapi, `parentOrganization` → Şen Parke).
- BreadcrumbList (765 sayfa), FAQPage (20 sayfa: ana sayfa, laminat, MDF, mutfak, yapı ana sayfa, 5 hizmet, 10 bölge),
  Service (5 hizmet sayfası), Product (739 ürün).
- Bölge sayfalarına bölgeye özel SSS; Türkçe bulunma eki düzeltildi (Avcılar’da, Esenyurt’ta, Beylikdüzü’nde).
- `robots.txt`: arama ve yapay zekâ botları (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended…) açıkça izinli.
- `llms.txt`: işletme bilgileri, ürünler, süreç, Taha Şen Yapı hizmet ve bölgeleri (llmstxt.org formatı).
- Sitemap'e eksik olan `/kategori/mdf-panel/` eklendi. og:locale, twitter:card, sayfa bazlı og:image.
- **Yerel SEO:** `/parke/` + 10 bölge sayfası (`/parke/<bölge>/`, `scripts/build-parke-bolgeler.js`): bölgenin konut yapısına göre
  ayrı metin, mahalle adları, bölgeye özel seri önerisi (4 koleksiyon + 8 ürün), 5 SSS, Service şeması, Taha Şen Yapı'nın aynı bölge
  sayfasına çapraz bağlantı. Tüm sayfaların footer'ında ve ana sayfada bölge bağlantıları. Yapı bölge sayfalarına "müteahhit seçimi" SSS'i.
  Başlıklar: "Avcılar Laminat Parke…", "Avcılar Kentsel Dönüşüm, Kat Karşılığı ve Müteahhitlik".
- "Gülpınar" → **Gürpınar** olarak düzeltildi (kullanıcı onayı); eski `/…/gulpinar/` adresleri yönlendirme sayfası.
- **Canlı (26.11.2026 19:31):** https://senparke.com.tr, HTTPS zorunlu, http → https 301, senparke.xyz → 301.
- Site haritası görselli (1640 görsel), `site.webmanifest` (Şen Parke ve /yapi/), `<link rel="sitemap">`.
- **Search Console:** `sc-domain:senparke.com.tr` DNS TXT ile doğrulandı (rreemanvalo hesabı); sitemap gönderildi
  (ilk okuma "Getirilemedi"; DNS geçişinden hemen sonra normal, birkaç gün içinde tekrar okunur — gerekirse yeniden gönder).
- **IndexNow:** 778 URL kabul edildi (HTTP 200).
- **Bekleyen:** Google İşletme Profili web sitesi alanı → `https://senparke.com.tr/` (Brave'deki Google hesabının profile erişimi yok);
  Bing Webmaster (Microsoft/Google hesabıyla giriş gerekiyor, sonra Search Console'dan içe aktar).
- **Ahşap/masif parke ve sistre (26.11.2026):** Çamsan, AGT ve Yıldız Entegre yalnızca laminat parke üretiyor (siteleri kontrol edildi);
  bu yüzden `/ahsap-masif-parke/` ve `/parke-sistre-cila/` marka kataloğu değil, hizmet sayfası (karşılaştırma tablosu, süreç, SSS, Service şeması).
  Görseller CC0/PD: `scripts/fetch-ahsap-photos.js`, lisans kaydı `brand/ahsap-src/kaynaklar.json`. Ağaç türü/stok bilgisi teyit edilince eklenebilir.
- **Bing Webmaster:** Site eklendi; doğrulama için meta etiket, `BingSiteAuth.xml` ve CNAME hazır, ama Bing'in "Verify" butonu üç yöntemde de
  "Unexpected error" veriyor (Bing tarafı). Daha sonra tekrar denenecek. IndexNow ile Bing'e URL'ler zaten iletiliyor.
- **Search Console (26.11.2026):** sitemap "Başarılı", 778 sayfa keşfedildi. Ürün başlık/açıklamaları tekilleştirildi, görseller sıkıştırıldı.
- **Beklemede (kullanıcı "şimdilik bırak" dedi):** senparke.com 2006'dan beri Natro'da (NICS), sahip bilgisi gizli, bitiş 19.04.2027.
  Natro'dan alan adı sahibi belgeleriyle geri alınırsa NS → karina/venkat.ns.cloudflare.com ve .com.tr'ye 301 kurulacak.
  Google İşletme Profili web sitesi hâlâ senparke.com (rreemanvalo hesabının profile erişimi yok). Yandex Business sahiplenme önerildi.
- **IndexNow** (Bing/Yandex): anahtar `scripts/indexnow-key.js`, gönderim `node scripts/indexnow.js` (her büyük güncellemeden sonra).

### Alan adı gelince yapılacaklar (sırayla)
1. TRABIS NS'i Cloudflare gösterdiğinde: GitHub Pages sertifikası → `https_enforced = true`.
2. **Google Search Console**: "Alan adı" mülkü `senparke.com.tr` eklendi (doğrulanmadı).
   Cloudflare'e TXT eklenecek: `google-site-verification=YKi15HAmqhIbqiUXCG11xcmn0fIP286PhWjWH9lO6Kg` → Doğrula.
   Sonra: Site haritası gönder (`https://senparke.com.tr/sitemap.xml`), ana sayfa + /yapi/ için dizine ekleme iste.
3. **Bing Webmaster Tools**: Search Console'dan içe aktar (ChatGPT/Copilot aramaları Bing dizinini kullanır); sitemap gönder.
4. **Google İşletme Profili**: Web sitesi → `https://senparke.com.tr/`.
5. Rich Results Test ile ana sayfa, bir ürün, bir hizmet ve bir bölge sayfası kontrolü.

- **senparke.com** bu Natro hesabında değil (eski siteyi yapanın hesabında). Cloudflare'de hazır bir zone var
  (A → GitHub, e-posta kayıtları Natro'da); sahibi NS'i `karina` + `venkat.ns.cloudflare.com` yaparsa .com.tr'ye yönlendirilebilir.

---

## 8. Sizden gerekenler (yayın öncesi kontrol listesi)

| # | Gereken | Neden |
|---|---|---|
| 1 | **Domain ve hosting erişimi** | Siteyi yayına almak için |
| 2 | **Güncel adres(ler) ve çalışma saatleri** | Eski sitede adresler tutarsızdı |
| 3 | **AGT ve Yıldız Entegre bayilik/izin durumu** | Ürün içerik ve görselleri üretici kataloglarından derlendi; yayında kullanım için yetki/izin teyidi önerilir |
| 4 | **Kendi mutfak proje fotoğraflarınız** | Mutfak sayfasındaki görseller şu an stok (Unsplash) referans |
| 5 | **Fiyat gösterecek miyiz?** | Şu an "teklif al" modeli; e-ticaret istenirse fiyat/stok ve altyapı eklenir |
| 6 | **Instagram/social hesapları** | Footer'daki sosyal linkler şimdilik boş hedefli |
| 7 | **Logo tercihi** | Şu an vektörel bir "ŞENPARKE" işareti kullanılıyor; kurumsal logo varsa eklenir |

---

## 9. Yol haritası (öneri)

1. **Onay** — tasarım ve içerik yapısı onayı (şu anki önizleme)
2. **Bilgi topla** — yukarıdaki 7 kalem
3. **İçerik revizyonu** — adres/mesai/social güncellemeleri, mutfak fotoğrafları
4. **Yayın** — domain + SSL + yükleme; Search Console kaydı, sitemap gönderimi
5. **Ölçüm** — Google Analytics/Search Console; arama terimlerine göre içerik büyütme
6. **Aşama 2 (opsiyonel)** — e-ticaret, süpürgelik/masif kategorileri (verisi hazır), blog/rehber içeriği

---

## 10. Yasal notlar

- AGT ve Yıldız Entegre ürün bilgi/görselleri üretici sitelerinden derlendi ve **yalnızca prototipte**
  kullanılıyor. Yayın öncesi bayilik/izin teyidi önerilir; izin alınamayan görseller için
  kendi fotoğraflarınızla değiştirme planı yapılmalı.
- Mutfak ve bazı atmosfer görselleri Unsplash kaynaklıdır → yayın öncesi kendi proje
  fotoğraflarınızla değiştirilmeli.
- KVKK ve Çerez sayfaları **taslaktır**; yayın öncesinde hukuk danışmanıyla güncellenmeli.
- Çamsan Entegre yalnızca tasarım referansıdır; hiçbir içeriği kopyalanmadı.

---

*Dosya yapısı: `public/` (yayınlanacak site) · `scripts/` (veri + site üretimi) · `data/` (ham kaynak veriler)*
*Toplam: 301 sayfa · ~630 yerel görsel · tek CSS tasarım sistemi · bağımlılıksız vanilla JS (~25 KB)*
