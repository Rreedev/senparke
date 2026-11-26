/* =========================================================
   ŞEN PARKE — Ahşap ve masif parke · Parke sistre ve cila
   AGT, Çamsan ve Yıldız Entegre yalnızca laminat parke üretir; bu yüzden
   bu iki sayfa marka kataloğu değil, Şen Parke'nin hizmet sayfasıdır.
   Görseller: kamu malı (CC0/PD), scripts/fetch-ahsap-photos.js
   ========================================================= */
const fs = require('fs');
const path = require('path');
const { PUB, site, stats, paths, icon, esc, pageShell, IDS, ldScript, AREAS } = require('./lib');
const { write, pageHero, faqList } = require('./build-helpers');

const imgs = JSON.parse(fs.readFileSync(path.join(PUB, 'data', 'ahsap-images.json'), 'utf8'));
const I = (slug) => imgs.find(i => i.slug === slug) || imgs[0];
const fig = (slug, cap) => `<figure><img src="${I(slug).src}" alt="${esc(I(slug).alt)}" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
const photoNote = '<p class="small-note">Görseller örnek amaçlıdır; kamu malı (CC0) fotoğraflardan seçilmiştir.</p>';

function sectionHead(eyebrow, title, desc = '') {
  return `<div class="section-head">
    <div><span class="eyebrow">${eyebrow}</span><h2 data-split>${title}</h2></div>
    ${desc ? `<div class="section-head-side" data-fade><p>${desc}</p></div>` : ''}
  </div>`;
}

function cta(title, text, konu) {
  return `<section class="cta-band">
    <div class="container cta-band-inner">
      <div>
        <span class="eyebrow light">Ücretsiz keşif</span>
        <h2>${title}</h2>
        <p>${text}</p>
      </div>
      <div class="cta-band-actions">
        <a class="btn btn-light" href="${paths.teklif}?konu=${konu}">Keşif Talebi ${icon('arrow', 15)}</a>
        <a class="btn btn-outline-light" href="tel:${site.phoneHref}">${site.phoneName}: ${site.phone}</a>
      </div>
    </div>
  </section>`;
}

const areaLinks = () => `<nav class="area-chips" aria-label="Hizmet bölgeleri">${AREAS.map(a => `<a href="${paths.parkeArea(a.slug)}">${esc(a.name)}</a>`).join('')}</nav>`;

function serviceLd(pathName, name, serviceType, description, image) {
  return ldScript({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${site.domain}${pathName}#service`,
    name, serviceType, description,
    url: site.domain + pathName,
    image: site.domain + image,
    provider: { '@id': IDS.business },
    areaServed: [{ '@type': 'City', name: 'İstanbul' }, ...AREAS.map(a => ({ '@type': 'Place', name: `${a.name}${a.parent ? ', ' + a.parent : ''}, İstanbul` }))],
    offers: { '@type': 'Offer', name: 'Ücretsiz keşif ve ölçü', price: '0', priceCurrency: 'TRY' }
  });
}

/* ---------------------------------------------------------
   AHŞAP VE MASİF PARKE
   --------------------------------------------------------- */
const AHSAP_FAQ = [
  ['Masif parke ile lamine (çok katmanlı) ahşap parke arasındaki fark nedir?', 'Masif parke baştan sona tek parça ağaçtır. Lamine ahşap parke ise üstte gerçek ağaç katmanı, altta birbirine çapraz yapıştırılmış katmanlardan oluşur; bu yapı sayesinde nem ve ısı değişimlerinde daha az çalışır. İkisi de gerçek ahşaptır ve sistre edilebilir.'],
  ['Laminat parke ile ahşap parke arasındaki fark nedir?', 'Laminat parke HDF gövde üzerine ahşap görünümlü dekor kağıdı ve aşınma katmanıyla üretilir; gerçek ağaç içermez. Ahşap parkenin yüzeyi gerçek ağaçtır, zımparalanıp yeniden cilalanabilir. Laminat ise yıprandığında sistre edilemez, değiştirilir.'],
  ['Ahşap parke yerden ısıtmaya uygun mu?', 'Lamine (çok katmanlı) ahşap parke yerden ısıtmaya genellikle uygundur. Masif parkede ağaç türüne ve kalınlığa göre değişir; keşifte ısıtma sisteminizi görüp uygun ürünü öneriyoruz.'],
  ['Hangi ağaç türleri ve desenler var?', 'En sık meşe tercih ediliyor; dişbudak ve ceviz gibi türler de uygulanıyor. Düz döşeme, balıksırtı ve Macar (chevron) desenleri yapıyoruz. Güncel ağaç türü, ebat ve stok bilgisini keşifte ya da showroomumuzda veriyoruz.'],
  ['Ahşap parke fiyatı neye göre değişir?', 'Ağaç türü, masif ya da lamine oluşu, kalınlık ve ebat, desen, metrekare ve yüzey işlemi (cila veya yağ) fiyatı belirler. Keşiften sonra kalem kalem yazılı teklif veriyoruz.']
];

function ahsapPage() {
  const pathName = paths.ahsap;
  const body = `
  ${pageHero({
    eyebrow: 'Ahşap ve masif parke',
    title: 'Ahşap ve <em>masif parke.</em>',
    desc: 'Gerçek ağaçtan zemin: masif ve lamine (çok katmanlı) ahşap parke satışı, döşemesi ve sistresi. Ağaç türünü, deseni ve yüzey işlemini mekânınıza göre birlikte seçiyoruz.',
    img: I('masif-salon').src,
    alt: I('masif-salon').alt,
    crumbs: [{ label: 'Ahşap ve masif parke' }],
    meta: [['Tür', 'Masif · Lamine ahşap'], ['Desen', 'Düz · Balıksırtı · Macar'], ['Keşif', 'Ücretsiz'], ['Bakım', 'Sistre ve cila']]
  })}

  <section class="section container">
    <div class="catalog-seo">
      <div>
        <span class="eyebrow">Gerçek ağaç</span>
        <h2 data-split>Yıllarca yenilenebilen <em>zemin.</em></h2>
      </div>
      <div class="area-copy" data-fade>
        <p>Ahşap parkenin yüzeyi gerçek ağaçtır. Zamanla çizilse ya da matlaşsa bile zımparalanıp yeniden cilalanabilir; doğru bakımla onlarca yıl kullanılır. Bu yüzden özellikle klasik dairelerde, villalarda ve uzun yıllar oturulacak evlerde tercih ediliyor.</p>
        <p>Şen Parke olarak 1978’den beri İstanbul’da parke döşüyoruz. Ahşap ve masif parkede ağaç türü, ebat ve deseni keşifte birlikte seçiyor, döşemeyi kendi ekibimizle yapıyor, yıllar sonra gereken <a class="link-line" href="${paths.sistre}">sistre ve cila</a> işini de üstleniyoruz.</p>
        <p class="area-hoods"><strong>Not:</strong> Kataloğumuzdaki AGT, Çamsan ve Yıldız Entegre ürünleri laminat parkedir. Ahşap ve masif parkede güncel ağaç türü, ebat ve stok bilgisini keşifte ya da showroomumuzda veriyoruz.</p>
      </div>
    </div>
  </section>

  <section class="section container">
    ${sectionHead('Karşılaştırma', 'Masif, lamine ahşap <em>ya da laminat?</em>', 'Üçü de iyi bir zemin; doğru olanı mekâna, bütçeye ve beklentiye göre seçiyoruz.')}
    <div class="compare-wrap" data-fade>
      <table class="compare-table">
        <thead><tr><th scope="col"></th><th scope="col">Masif parke</th><th scope="col">Lamine ahşap parke</th><th scope="col">Laminat parke</th></tr></thead>
        <tbody>
          <tr><th scope="row">Yapı</th><td>Baştan sona tek parça ağaç</td><td>Üstte gerçek ağaç, altta çapraz katmanlar</td><td>HDF gövde, ahşap görünümlü dekor kağıdı</td></tr>
          <tr><th scope="row">Sistre ve cila</th><td>Defalarca yapılabilir</td><td>Üst ağaç katmanının kalınlığına göre yapılabilir</td><td>Yapılamaz; yıprandığında değiştirilir</td></tr>
          <tr><th scope="row">Nem ve ısı</th><td>Daha çok çalışır; ortam koşullarına dikkat ister</td><td>Daha dengeli; daha az çalışır</td><td>Su dirençli seriler mevcut</td></tr>
          <tr><th scope="row">Yerden ısıtma</th><td>Ağaç türü ve kalınlığa bağlı</td><td>Genellikle uygun</td><td>Uygun</td></tr>
          <tr><th scope="row">Montaj</th><td>Yapıştırma veya çivileme</td><td>Yapıştırma veya yüzer döşeme</td><td>Klik sistem, yüzer döşeme</td></tr>
          <tr><th scope="row">Kimin için</th><td>Uzun vadeli, klasik ve karakterli mekânlar</td><td>Gerçek ahşap isteyen, ısıtmalı ya da yeni daireler</td><td>Hızlı, dayanıklı ve bütçe dostu yenileme</td></tr>
        </tbody>
      </table>
    </div>
    <p class="area-more"><a class="link-line" href="${paths.laminat}">Laminat parke kataloğu: ${stats.laminat} model</a></p>
  </section>

  <section class="section container">
    ${sectionHead('Desenler', 'Düz, balıksırtı <em>ve Macar.</em>', 'Aynı ağaç, farklı desenle bambaşka bir mekân olur. Deseni odanın ölçüsüne ve ışığına göre öneriyoruz.')}
    <div class="photo-grid">
      ${fig('baliksirti', 'Balıksırtı')}
      ${fig('masif-tahta', 'Geniş tahta, düz döşeme')}
      ${fig('ahsap-oda', 'Klasik mekânda sıcak tonlar')}
    </div>
    ${photoNote}
  </section>

  <section class="section section-forest container">
    ${sectionHead('Süreç', 'Keşiften <em>ilk cilaya.</em>')}
    <div class="process-grid">
      <div class="process-item"><h3>Keşif ve nem ölçümü</h3><p>Zemini yerinde görüyor, şapın düzgünlüğünü ve nemini kontrol ediyor, ölçüyü alıyoruz.</p></div>
      <div class="process-item"><h3>Ağaç ve desen seçimi</h3><p>Ağaç türü, ebat, desen ve yüzey işlemini (cila ya da yağ) numunelerle birlikte seçiyoruz.</p></div>
      <div class="process-item"><h3>Yazılı teklif</h3><p>Malzeme, süpürgelik, döşeme ve yüzey işlemi kalem kalem yazılı olarak.</p></div>
      <div class="process-item"><h3>Döşeme ve teslim</h3><p>Kendi ekibimiz döşer; gerekiyorsa zımpara ve cilayla teslim eder.</p></div>
    </div>
  </section>

  <section class="section section-tint container">
    <div class="catalog-seo">
      <div>
        <span class="eyebrow">Merak edilenler</span>
        <h2>Ahşap parke hakkında sık sorulan <em>sorular.</em></h2>
        <p class="eyebrow home-areas-title">Hizmet bölgeleri</p>
        ${areaLinks()}
      </div>
      <div>${faqList(AHSAP_FAQ)}</div>
    </div>
  </section>

  ${cta('Ahşap parkenizi <em>birlikte seçelim.</em>', 'Mekânınızı görüp ağaç türü, desen ve yüzey işlemi için numunelerle gelelim.', 'ahsap')}`;

  write('ahsap-masif-parke/index.html', pageShell({
    title: 'Ahşap ve Masif Parke Satış ve Döşeme, Avcılar',
    description: 'Masif ve lamine ahşap parke satışı ve döşemesi: meşe ve diğer ağaç türleri, düz, balıksırtı ve Macar desen. Ücretsiz keşif, kendi ekibimizle montaj, sistre ve cila. Şen Parke, Avcılar, 1978’den beri.',
    pathName,
    active: 'Parke',
    body,
    ogImage: I('masif-salon').src,
    extraHead: serviceLd(pathName, 'Ahşap ve masif parke satışı ve döşemesi', 'Ahşap parke döşeme', 'Masif ve lamine (çok katmanlı) ahşap parke satışı, keşif, döşeme, sistre ve cila. Düz, balıksırtı ve Macar desen.', I('masif-salon').src)
  }));
}

/* ---------------------------------------------------------
   PARKE SİSTRE VE CİLA
   --------------------------------------------------------- */
const SISTRE_FAQ = [
  ['Parke sistre nedir?', 'Sistre, ahşap parkenin yüzeyindeki eski cilanın, çiziklerin ve lekelerin zımpara makinesiyle alınması, ardından yüzeyin yeniden cilalanması ya da yağlanmasıdır. Zemin ilk döşendiği günkü görünümüne yakın hale gelir.'],
  ['Laminat parke sistre edilebilir mi?', 'Hayır. Laminat parkede gerçek ağaç katmanı yoktur; zımparalanırsa dekor katmanı aşınır. Yıpranmış laminat parke değiştirilir. Masif ve lamine (çok katmanlı) ahşap parke ise sistre edilebilir.'],
  ['Parke kaç yılda bir sistre edilmeli?', 'Kullanıma göre değişir. Cila matlaşıp aşınmaya başladığında, ahşaba ulaşmadan yeniden cilalamak zemini korur. Çizik ve lekeler derinleştiyse tam sistre gerekir; hangisinin yeterli olduğunu keşifte söylüyoruz.'],
  ['Sistre ne kadar sürer, evde oturulabilir mi?', 'Süre metrekareye, zeminin durumuna ve cila katlarının kuruma süresine bağlıdır. İşlem yapılan odaların cila kuruyana kadar kullanılmaması gerekir; işi odalara bölerek planlayabiliyoruz. Net süreyi keşifte veriyoruz.'],
  ['Sistre fiyatı neye göre değişir?', 'Metrekare, parkenin durumu (derin çizik, boşluk, onarım ihtiyacı), cila ya da yağ türü ve kat sayısı fiyatı belirler. Keşiften sonra yazılı teklif veriyoruz.'],
  ['Eski parkede kopan ya da sallanan tahtalar ne olur?', 'Sistreden önce zemini kontrol ediyor, gevşeyen tahtaları sabitliyor, gerekiyorsa değiştiriyoruz. Derzleri dolguyla kapatıp öyle zımparaya geçiyoruz.']
];

function sistrePage() {
  const pathName = paths.sistre;
  const body = `
  ${pageHero({
    eyebrow: 'Parke sistre ve cila',
    title: 'Parke sistre ve <em>cila.</em>',
    desc: 'Çizilmiş, matlaşmış ya da lekelenmiş ahşap parkeyi değiştirmeden yeniliyoruz: zımpara, onarım, dolgu ve yeni cila.',
    img: I('sistre-cilali').src,
    alt: I('sistre-cilali').alt,
    crumbs: [{ label: 'Parke sistre ve cila' }],
    meta: [['Uygun zemin', 'Masif · Lamine ahşap'], ['Yüzey', 'Cila · Yağ'], ['Keşif', 'Ücretsiz'], ['Uygulama', 'Kendi ekibimiz']]
  })}

  <section class="section container">
    <div class="catalog-seo">
      <div>
        <span class="eyebrow">Yenile, değiştirme</span>
        <h2 data-split>Eski parke, <em>yeni yüzey.</em></h2>
      </div>
      <div class="area-copy" data-fade>
        <p>Ahşap parkenin en büyük avantajı yenilenebilmesidir. Sistrede zemindeki eski cila, çizikler ve lekeler zımparayla alınır; gevşeyen tahtalar sabitlenir, derzler doldurulur ve yüzey yeniden cilalanır ya da yağlanır. Sonuç, sökmeden ve yeni malzeme almadan neredeyse yeni bir zemindir.</p>
        <p>Masif ve lamine (çok katmanlı) ahşap parkeye sistre yapılır. Laminat parke ise gerçek ağaç içermediği için sistre edilemez; yıprandığında <a class="link-line" href="${paths.laminat}">yeni bir laminat seriyle</a> değiştirilir.</p>
      </div>
    </div>
  </section>

  <section class="section container">
    ${sectionHead('Önce ve sonra', 'Matlaşmış zeminden <em>parlak yüzeye.</em>')}
    <div class="photo-grid photo-grid-2">
      ${fig('sistre-oncesi', 'Önce: çizilmiş ve matlaşmış cila')}
      ${fig('sistre-cilali', 'Sonra: zımpara ve yeni cila')}
    </div>
    ${photoNote}
  </section>

  <section class="section section-forest container">
    ${sectionHead('Süreç', 'Sistre <em>adım adım.</em>')}
    <div class="process-grid">
      <div class="process-item"><h3>Keşif ve kontrol</h3><p>Parkenin türünü, üst ağaç katmanının kalınlığını, çizik ve boşlukları yerinde görüyoruz.</p></div>
      <div class="process-item"><h3>Onarım ve dolgu</h3><p>Gevşeyen tahtaları sabitliyor, gerekiyorsa değiştiriyor, derzleri dolguyla kapatıyoruz.</p></div>
      <div class="process-item"><h3>Zımpara</h3><p>Kabadan inceye zımparayla eski cilayı ve çizikleri alıp yüzeyi düzlüyoruz.</p></div>
      <div class="process-item"><h3>Cila ya da yağ</h3><p>Seçtiğiniz yüzey işlemini katlar halinde uyguluyor, kuruma süresine göre teslim ediyoruz.</p></div>
    </div>
  </section>

  <section class="section container">
    <div class="sistre-history" data-fade>
      <figure><img src="${I('sistre-caillebotte').src}" alt="${esc(I('sistre-caillebotte').alt)}" loading="lazy"></figure>
      <div>
        <span class="eyebrow">Eski bir zanaat</span>
        <h2>Parke yenilemek <em>yeni bir iş değil.</em></h2>
        <p>Gustave Caillebotte 1875’te Paris’te bir dairenin ahşap zeminini elle rendeleyen ustaları resmetti. Bugün aynı işi zımpara makineleriyle çok daha hızlı yapıyoruz, ama amaç değişmedi: ahşabı atmadan yeniden yaşatmak.</p>
        <p class="small-note">Gustave Caillebotte, “Les raboteurs de parquet” (1875), Musée d’Orsay. Kamu malı.</p>
      </div>
    </div>
  </section>

  <section class="section section-tint container">
    <div class="catalog-seo">
      <div>
        <span class="eyebrow">Merak edilenler</span>
        <h2>Sistre hakkında sık sorulan <em>sorular.</em></h2>
        <p class="eyebrow home-areas-title">Hizmet bölgeleri</p>
        ${areaLinks()}
      </div>
      <div>${faqList(SISTRE_FAQ)}</div>
    </div>
  </section>

  ${cta('Parkenizi <em>yenileyelim.</em>', 'Zemininizi görüp sistrenin mi yoksa yalnızca yeni cilanın mı yeteceğini söyleyelim.', 'sistre')}`;

  write('parke-sistre-cila/index.html', pageShell({
    title: 'Parke Sistre ve Cila, Avcılar',
    description: 'Ahşap ve masif parke sistre ve cila: zımpara, onarım, derz dolgu ve yeni cila ya da yağ. Avcılar, Beylikdüzü, Esenyurt, Bakırköy ve çevresinde ücretsiz keşif. Şen Parke, 1978’den beri.',
    pathName,
    active: 'Parke',
    body,
    ogImage: I('sistre-cilali').src,
    extraHead: serviceLd(pathName, 'Parke sistre ve cila', 'Parke sistre, zımpara ve cila', 'Masif ve lamine ahşap parkede zımpara, onarım, derz dolgu ve yeniden cila ya da yağ uygulaması.', I('sistre-cilali').src)
  }));
}

function buildAhsapSistre() {
  ahsapPage();
  sistrePage();
  return [paths.ahsap, paths.sistre];
}

module.exports = { buildAhsapSistre };
