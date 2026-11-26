/* =========================================================
   TAHA ŞEN YAPI — alt site (/yapi/)
   Kentsel dönüşüm · kat karşılığı · sıfırdan yapı · renovasyon & restorasyon · mimari dokunuşlar ve yaşam alanı dizaynı
   Palet: #000000 · #1F150C · #412D15 · #E1DCC9
   Görseller: kamu malı (CC0/PD) fotoğraflar, marka paletine göre renklendirildi
   (scripts/fetch-yapi-photos.js → scripts/grade-yapi-photos.js). Örnek görseldir; proje fotoğrafı değildir.
   ========================================================= */
const fs = require('fs');
const path = require('path');
const { PUB, site, icon, esc, IDS, OPENING, ldScript, faqLd, breadcrumbLd, businessNode, websiteNode } = require('./lib');

const Y = {
  name: 'Taha Şen Yapı',
  legal: 'Taha Şen Yapı İnş. San. ve Tic. Ltd. Şti.',
  phone: '0553 728 17 55',
  phoneHref: '+905537281755',
  person: 'Taha ŞEN',
  whatsapp: 'https://wa.me/905537281755?text=Merhaba%2C%20Taha%20%C5%9Een%20Yap%C4%B1%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.',
  domain: site.domain + '/yapi'
};

const imgs = JSON.parse(fs.readFileSync(path.join(PUB, 'data', 'yapi-images.json'), 'utf8'));
const im = (slug) => (imgs.find(i => i.slug === slug) || imgs[0]).src;

const written = [];
function write(rel, html) {
  const file = path.join(PUB, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  written.push(rel);
}

/* ---------------------------------------------------------
   Content
   --------------------------------------------------------- */
const SERVICES = [
  {
    slug: 'kentsel-donusum', name: 'Kentsel dönüşüm', img: 'kentsel-donusum-yikim', alt: 'Eski bir binanın yıkım çalışması',
    tag: 'Riskli yapıdan güvenli binaya',
    lead: 'Riskli yapınızı, hak kaybı yaşamadan güvenli ve değerli bir binaya dönüştürüyoruz.',
    body: [
      '6306 sayılı Kanun kapsamında süreç, binanın Bakanlıkça lisanslandırılmış bir kuruluş tarafından yapılan riskli yapı tespitiyle başlar. Tespitin ardından kat malikleriyle birlikte dönüşüm modelini belirliyor, proje ve ruhsat sürecini yürütüyor, tahliyeden iskâna kadar şantiyeyi kendi ekibimizle yönetiyoruz.',
      'Her malikin bugünkü hakkını ve yeni binadaki karşılığını baştan, yazılı olarak netleştiriyoruz. Kira yardımı ve kredi destekleri gibi devlet desteklerine başvuru sürecinde de yol gösteriyoruz.'
    ],
    steps: ['Riskli yapı tespiti', 'Malik toplantısı ve karar', 'Proje ve ruhsat', 'Tahliye ve yıkım', 'İnşaat', 'İskân ve tapu'],
    faq: [
      ['Riskli yapı tespitini kim yapar?', 'Tespiti, Çevre, Şehircilik ve İklim Değişikliği Bakanlığı tarafından lisanslandırılmış kuruluşlar yapar; başvuruyu malik ya da kat malikleri yapar. Hangi belgelerin gerektiğini ilk görüşmede birlikte çıkarıyoruz.'],
      ['Tüm kat maliklerinin onayı gerekir mi?', 'Kanun, riskli yapılarda belirli bir çoğunlukla karar alınmasına imkân tanır. Güncel oranları ve sizin binanıza nasıl uygulanacağını ilk malik toplantısında, gerekirse hukuk danışmanıyla birlikte anlatıyoruz.'],
      ['İnşaat sürerken nerede oturacağız?', 'Tahliye tarihinden itibaren kira yardımı başvurusunu birlikte yapıyoruz. Teslim süresi ve gecikme koşulları sözleşmede açıkça yazılır.']
    ]
  },
  {
    slug: 'kat-karsiligi', name: 'Kat karşılığı inşaat', img: 'kat-karsiligi-karkas', alt: 'İskeleli betonarme karkas bina',
    tag: 'Arsa payı karşılığı yeni bina',
    lead: 'Arsanızı ya da eski binanızı, size en adil paylaşımla yeni bir yapıya dönüştürüyoruz.',
    body: [
      'Kat karşılığı modelde arsa sahibi arsasını, yüklenici ise projeyi, malzemeyi ve işçiliği koyar; ortaya çıkan bağımsız bölümler sözleşmede belirlenen oranda paylaşılır.',
      'Paylaşım oranı imar durumuna, emsale, konuma ve inşaat maliyetine göre değişir. Önceden sabit bir oran vaat etmiyoruz; fizibiliteyi sizinle birlikte hesaplıyor, teklifi yazılı veriyoruz. Sözleşme noterde düzenlenir; teslim süresi, daire dağılımı, malzeme listesi ve gecikme koşulları açıkça yazılır.'
    ],
    steps: ['Arsa ve imar incelemesi', 'Fizibilite ve paylaşım teklifi', 'Noter sözleşmesi', 'Proje ve ruhsat', 'İnşaat', 'Teslim ve tapu'],
    faq: [
      ['Paylaşım oranı neye göre belirlenir?', 'Arsanın imar durumu ve emsali, çıkabilecek bağımsız bölüm sayısı, konum ve güncel inşaat maliyetleri belirler. Bu hesabı şeffaf biçimde sizinle paylaşıyoruz.'],
      ['Sözleşmede nelere dikkat etmeliyim?', 'Daire numaraları ve metrekareleri, malzeme ve marka listesi, teslim tarihi, gecikme cezası ve teminatlar mutlaka yazılı olmalı. Sözleşme noterde düzenleme şeklinde yapılır.']
    ]
  },
  {
    slug: 'sifirdan-yapi', name: 'Sıfırdan yapı', img: 'sifirdan-bina-vinc', alt: 'Vinçli bir şantiyede yükselen konut binaları',
    tag: 'Arsadan anahtar teslime',
    lead: 'Arsanızdan anahtar teslim binaya: proje, ruhsat, inşaat ve iskân tek elden.',
    body: [
      'Zemin etüdü ve imar durumuyla başlıyor, mimari ve statik projeyi lisanslı mimar ve mühendislerle hazırlıyoruz. Ruhsat sürecini yürütüyor, yapı denetim aşamalarını takip ediyoruz.',
      'Kaba inşaattan ince işlere, tesisattan cepheye kadar şantiyeyi kendi ekibimizle yönetiyoruz. Her aşamayı fotoğraflı raporla paylaşıyoruz; ne aşamada olduğunuzu her zaman bilirsiniz.'
    ],
    steps: ['Zemin etüdü ve imar', 'Mimari ve statik proje', 'Ruhsat', 'Kaba inşaat', 'İnce işler ve cephe', 'İskân ve teslim'],
    faq: [
      ['Projeyi kim çiziyor?', 'Mimari, statik, elektrik ve mekanik projeleri lisanslı mimar ve mühendislerle birlikte hazırlıyoruz; istersen kendi mimarınızla da çalışabiliriz.'],
      ['Süreç ne kadar sürer?', 'Bina büyüklüğüne, ruhsat süresine ve mevsime göre değişir. Net takvimi teklifle birlikte yazılı olarak veriyoruz.']
    ]
  },
  {
    slug: 'renovasyon-restorasyon', name: 'Renovasyon ve restorasyon', img: 'restorasyon-iskele', alt: 'İskele kurulmuş tarihi bir bina cephesi',
    tag: 'Yıkmadan yenilemek',
    lead: 'Mevcut binanızı yıkmadan yeniliyoruz: cephe, ortak alanlar, daire içleri ve tarihi dokular.',
    body: [
      'Cephe yenileme ve ısı yalıtımı, çatı, ortak alan ve giriş holü yenilemesi, daire içi tadilatlar yapıyoruz. Eski ve tarihi yapılarda özgün dokuyu koruyarak restorasyon uyguluyoruz.',
      'Taşıyıcı sistemi ilgilendiren her işte önce statik değerlendirme yaptırıyor, gerekli izinleri alıyoruz. Tescilli yapılarda koruma kurulu süreçlerini de planın içine katıyoruz.'
    ],
    steps: ['Yerinde inceleme', 'Statik ve teknik değerlendirme', 'Tasarım ve teklif', 'İzinler', 'Uygulama', 'Teslim'],
    faq: [
      ['Binada otururken renovasyon yapılabilir mi?', 'Cephe ve ortak alan işlerinin çoğu, iş programı doğru kurulursa binada oturulurken yapılabilir. Daire içi işlerde süreyi ve etkiyi önceden konuşuyoruz.'],
      ['Restorasyon ile renovasyon farkı nedir?', 'Renovasyon yenileme ve iyileştirmedir. Restorasyon ise yapının özgün malzeme ve detaylarını koruyarak onarmaktır; tarihi ve tescilli yapılarda ayrıca izin gerekir.']
    ]
  },
  {
    slug: 'mimari-dokunuslar', name: 'Mimari Dokunuşlar ve Yaşam Alanı Dizaynı', short: 'Mimari Dokunuşlar', img: 'mimari-dokunus-cephe', alt: 'Ahşap lamelli balkonlara sahip modern bir cephe',
    tag: 'Cepheden salona, ayrıntıda karakter',
    lead: 'Binanın dışındaki karakteri ve dairenin içindeki yaşamı birlikte tasarlıyoruz: cephe dili, giriş, ışık, plan ve malzeme.',
    body: [
      'Cephe kaplaması, balkon korkulukları, giriş kapısı ve holü, aydınlatma ve peyzaj gibi mimari dokunuşlarla mevcut ya da yeni binaya karakter kazandırıyoruz.',
      'Yaşam alanı dizaynında daire planını, mutfak ve salon ilişkisini, depolama, aydınlatma ve malzeme seçimini sizin günlük kullanımınıza göre kurguluyoruz. Zemin, MDF panel ve mutfak dolabı için Şen Parke’nin seçeneklerini aynı projede planlıyor, uygulamayı tek ekipten yürütüyoruz.'
    ],
    steps: ['Keşif ve ihtiyaç', 'Konsept ve plan', 'Malzeme ve görselleştirme', 'Teklif', 'Uygulama', 'Teslim'],
    faq: [
      ['Sadece giriş holünü yeniletebilir miyiz?', 'Evet. Giriş holü, merdiven ve aydınlatma gibi tek bir alana odaklanan küçük ölçekli işleri de üstleniyoruz.'],
      ['Yaşam alanı dizaynı neleri kapsar?', 'Plan ve yerleşim, mutfak ve ıslak hacimler, zemin ve duvar malzemeleri, aydınlatma ve depolama çözümleri. İsterseniz yalnızca tasarımı, isterseniz tasarım ve uygulamayı birlikte üstleniyoruz.']
    ]
  }
];

const DISTRICTS = [
  { slug: 'buyukcekmece', name: 'Büyükçekmece', parent: '', kind: 'new', img: 'konut-yesil',
    note: 'Müstakil yapıların ve yeni konut alanlarının yoğun olduğu Büyükçekmece’de en çok sıfırdan yapı ile mimari dokunuşlar ve yaşam alanı dizaynı projelerinde çalışıyoruz.' },
  { slug: 'gulpinar', name: 'Gülpınar', parent: 'Beylikdüzü', kind: 'new', img: 'konut-cephe',
    note: 'Beylikdüzü’nün Gülpınar Mahallesi’nde arsa ve eski yapı sahipleriyle kat karşılığı ve sıfırdan yapı projeleri planlıyoruz.' },
  { slug: 'yakuplu', name: 'Yakuplu', parent: 'Beylikdüzü', kind: 'mixed', img: 'santiye-vinc',
    note: 'Yakuplu’da eski yapıların yenilenmesi ile yeni bina projeleri bir arada; kat karşılığı ve kentsel dönüşüm görüşmelerini yerinde yapıyoruz.' },
  { slug: 'beylikduzu', name: 'Beylikdüzü', parent: '', kind: 'new', img: 'konut-kule',
    note: 'Görece yeni yapı stokuna sahip Beylikdüzü’nde renovasyon, cephe yenileme ile mimari dokunuşlar ve yaşam alanı dizaynı öne çıkıyor; arsa sahipleriyle sıfırdan yapı da yapıyoruz.' },
  { slug: 'esenyurt', name: 'Esenyurt', parent: '', kind: 'mixed', img: 'sifirdan-bina-vinc',
    note: 'Hızlı büyüyen Esenyurt’ta hem yeni bina hem de mevcut binaların revizyonu için çalışıyoruz; ortak alan ve cephe yenilemeleri sık talep ediliyor.' },
  { slug: 'avcilar', name: 'Avcılar', parent: '', kind: 'transform', img: 'kentsel-donusum-yikim', hub: true,
    note: 'Merkezimiz Avcılar. 1999 depreminin etkilerini en çok hisseden ilçelerden biri olan Avcılar’da kentsel dönüşüm ve kat karşılığı projelerinde mahalleyi, binaları ve süreçleri yakından tanıyoruz.' },
  { slug: 'kucukcekmece', name: 'Küçükçekmece', parent: '', kind: 'transform', img: 'kat-karsiligi-karkas',
    note: 'Geniş ve çeşitli yapı stokuyla Küçükçekmece’de bina bazlı kentsel dönüşüm, kat karşılığı ve renovasyon projeleri yürütüyoruz.' },
  { slug: 'sefakoy', name: 'Sefaköy', parent: 'Küçükçekmece', kind: 'transform', img: 'hafriyat',
    note: 'Küçükçekmece’nin Sefaköy semtindeki eski apartmanlarda kat karşılığı ve kentsel dönüşüm görüşmelerini malik toplantılarıyla başlatıyoruz.' },
  { slug: 'sirinevler', name: 'Şirinevler', parent: 'Bahçelievler', kind: 'transform', img: 'restorasyon-cephe',
    note: 'Bahçelievler’in yoğun yapılaşmış Şirinevler Mahallesi’nde bina bazında kentsel dönüşüm ve cephe yenileme projelerine odaklanıyoruz.' },
  { slug: 'bakirkoy', name: 'Bakırköy', parent: '', kind: 'transform', img: 'restorasyon-iskele',
    note: 'Köklü yapı stokuyla Bakırköy’de kentsel dönüşümün yanında, eski binaların özgün dokusunu koruyan restorasyon ile mimari dokunuşlar ve yaşam alanı dizaynı işleri yapıyoruz.' }
];

const KIND_SERVICES = {
  transform: ['kentsel-donusum', 'kat-karsiligi', 'renovasyon-restorasyon'],
  mixed: ['kat-karsiligi', 'sifirdan-yapi', 'renovasyon-restorasyon'],
  new: ['sifirdan-yapi', 'mimari-dokunuslar', 'renovasyon-restorasyon']
};

const P = {
  home: '/yapi/',
  svc: (s) => `/yapi/hizmetler/${s}/`,
  dist: (d) => `/yapi/bolgeler/${d}/`,
  contact: '/yapi/iletisim/'
};

/* ---------------------------------------------------------
   Chrome
   --------------------------------------------------------- */
function yMark() {
  /* an elevation: slab lines over a black block, one lit column */
  return `<svg class="y-mark" viewBox="0 0 32 32" aria-hidden="true">
    <rect width="32" height="32" fill="#1F150C"/>
    <path d="M7 27V7h18v20" fill="none" stroke="#E1DCC9" stroke-width="1.6"/>
    <path d="M7 12h18M7 17h18M7 22h18" stroke="#E1DCC9" stroke-width="1"/>
    <rect x="14" y="22" width="4" height="5" fill="#E1DCC9"/>
    <path d="M4 27h24" stroke="#E1DCC9" stroke-width="1.6"/>
  </svg>`;
}

function yLogo() {
  return `<a class="y-logo" href="${P.home}" aria-label="${Y.name} ana sayfa"><img src="/assets/logo/tahasen-logo-yatay.png" alt="${Y.legal}" width="1264" height="200"></a>`;
}

function yHeader(active) {
  const links = [
    ['Hizmetler', `${P.home}#hizmetler`, 'hizmetler'],
    ['Kentsel dönüşüm', P.svc('kentsel-donusum'), 'kentsel-donusum'],
    ['Kat karşılığı', P.svc('kat-karsiligi'), 'kat-karsiligi'],
    ['Bölgeler', `${P.home}#bolgeler`, 'bolgeler'],
    ['İletişim', P.contact, 'iletisim']
  ];
  return `
  <header class="site-header y-header" id="siteHeader">
    <div class="header-inner">
      <div class="y-brandrow">
        ${yLogo()}
        <a class="y-switch" href="/" title="Şen Parke: laminat parke, MDF ve mutfak dolabı">Şen Parke</a>
      </div>
      <nav class="main-nav" aria-label="Taha Şen Yapı menüsü">
        <ul>${links.map(([l, h, k]) => `<li class="${active === k ? 'is-active' : ''}"><a href="${h}">${l}</a></li>`).join('')}</ul>
      </nav>
      <div class="header-actions">
        <a class="header-phone" href="tel:${Y.phoneHref}"><span class="phone-name">${Y.person}</span> ${Y.phone}</a>
        <a class="btn btn-y btn-sm header-cta" href="${P.contact}" data-magnetic>Ön görüşme</a>
        <button class="icon-btn menu-trigger" type="button" aria-label="Menüyü aç" aria-expanded="false"><span class="burger"><i></i><i></i></span></button>
      </div>
    </div>
  </header>
  <div class="mobile-drawer" id="mobileDrawer" aria-hidden="true" data-lenis-prevent>
    <div class="drawer-head">${yLogo()}<button class="icon-btn drawer-close" type="button" aria-label="Menüyü kapat">${icon('close', 24)}</button></div>
    <div class="drawer-body">
      ${SERVICES.map(s => `<a href="${P.svc(s.slug)}">${s.name}</a>`).join('')}
      <a href="${P.home}#bolgeler">Bölgeler</a>
      <a href="${P.contact}">İletişim</a>
      <a href="/">Şen Parke</a>
    </div>
    <div class="drawer-foot">
      <a class="btn btn-y" href="${P.contact}">Ön görüşme talebi</a>
      <a class="drawer-phone" href="tel:${Y.phoneHref}">${icon('phone', 18)} ${Y.person}: ${Y.phone}</a>
      <p>Avcılar merkezli; İstanbul’un batısında</p>
    </div>
  </div>`;
}

function yFooter() {
  return `
  <footer class="site-footer y-footer">
    <div class="container footer-top">
      <div class="footer-lead">
        <p class="footer-claim">Binanızı birlikte<br>yeniden kuralım.</p>
        <a class="btn btn-y" href="${P.contact}" data-magnetic>Ön görüşme talebi</a>
      </div>
      <div class="footer-cols">
        <div class="footer-col">
          <span class="footer-title">Hizmetler</span>
          ${SERVICES.map(s => `<a href="${P.svc(s.slug)}">${s.name}</a>`).join('')}
        </div>
        <div class="footer-col">
          <span class="footer-title">Bölgeler</span>
          ${DISTRICTS.slice().reverse().map(d => `<a href="${P.dist(d.slug)}">${d.name}</a>`).join('')}
        </div>
        <div class="footer-col footer-contact">
          <span class="footer-title">İletişim</span>
          <a href="tel:${Y.phoneHref}"><span class="phone-name">${Y.person}</span> ${Y.phone}</a>
          <a href="${Y.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
          <p>Avcılar merkezli</p>
          <p>${site.hours}<br>${site.hoursNote}</p>
          <a href="/">Bir Şen Parke kuruluşu</a>
        </div>
      </div>
    </div>
    <div class="footer-word" aria-hidden="true"><span>Taha Şen Yapı</span></div>
    <div class="container footer-bottom">
      <p>© ${new Date().getFullYear()} ${Y.legal} Görseller örnek amaçlıdır.</p>
      <div>
        <a href="/kvkk/">KVKK aydınlatma metni</a>
        <a href="/cerez-politikasi/">Çerez politikası</a>
        <a href="${site.google}" target="_blank" rel="noopener">Google profilimiz</a>
      </div>
      <a class="footer-credit" href="https://saviasora.dev" target="_blank" rel="noopener">Made by egsu</a>
    </div>
  </footer>
  <a class="whatsapp-float" href="${Y.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp ile yazın">${icon('whatsapp', 22)}</a>
  <button class="back-top" type="button" aria-label="Yukarı çık">${icon('arrowUp', 18)}</button>`;
}

function contractorNode() {
  return {
    '@type': 'GeneralContractor',
    '@id': IDS.yapi,
    name: Y.name,
    legalName: Y.legal,
    description: 'Avcılar merkezli yapı firması: kentsel dönüşüm, kat karşılığı inşaat, sıfırdan yapı, renovasyon ve restorasyon, mimari dokunuşlar ve yaşam alanı dizaynı. İstanbul’un batısında Büyükçekmece’den Bakırköy’e.',
    url: `${Y.domain}/`,
    logo: `${site.domain}/assets/logo/tahasen-logo.png`,
    image: `${site.domain}${im('hero-vinc-gece')}`,
    telephone: Y.phoneHref,
    address: { '@type': 'PostalAddress', addressLocality: 'Avcılar', addressRegion: 'İstanbul', addressCountry: 'TR' },
    openingHoursSpecification: OPENING,
    areaServed: DISTRICTS.map(d => ({ '@type': 'Place', name: `${d.name}${d.parent ? ', ' + d.parent : ''}, İstanbul` })),
    knowsAbout: ['Kentsel dönüşüm', '6306 sayılı Kanun', 'Riskli yapı tespiti', 'Kat karşılığı inşaat', 'Anahtar teslim bina', 'Renovasyon', 'Restorasyon', 'Cephe yenileme', 'İç mimari ve yaşam alanı dizaynı'],
    hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Hizmetler', itemListElement: SERVICES.map(s => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, url: site.domain + P.svc(s.slug) } })) },
    parentOrganization: { '@id': IDS.business },
    employee: { '@type': 'Person', name: 'Taha Şen', telephone: Y.phoneHref }
  };
}

function yShell({ title, description, pathName, active = '', body, bodyClass = '', ld = [], ogImage }) {
  const fullTitle = title ? `${title} | ${Y.name}` : `${Y.name} | Kentsel Dönüşüm, Kat Karşılığı ve İnşaat | Avcılar`;
  const desc = description || 'Taha Şen Yapı: Avcılar merkezli kentsel dönüşüm, kat karşılığı inşaat, sıfırdan yapı, renovasyon ve restorasyon. Beylikdüzü, Esenyurt, Küçükçekmece, Bakırköy ve çevresi.';
  const canonical = site.domain + pathName;
  const og = site.domain + (ogImage || im('hero-vinc-gece'));
  const graph = ldScript({
    '@context': 'https://schema.org',
    '@graph': [
      contractorNode(),
      businessNode(),
      websiteNode(),
      { '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: fullTitle, description: desc, inLanguage: 'tr-TR', isPartOf: { '@id': IDS.website }, about: { '@id': IDS.yapi }, primaryImageOfPage: { '@type': 'ImageObject', url: og } },
      ...ld
    ]
  });
  return `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <link rel="canonical" href="${esc(canonical)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:site_name" content="${Y.name}">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${esc(og)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="geo.region" content="TR-34">
  <meta name="geo.placename" content="Avcılar, İstanbul">
  <meta name="theme-color" content="#121110">
  <link rel="icon" href="/assets/logo/tahasen-favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/assets/logo/tahasen-favicon-180.png">
  <script>(function(d){d.classList.add('js');try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('reduced');if(sessionStorage.getItem('sp-nav'))d.classList.add('is-arriving')}catch(e){}})(document.documentElement);</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="stylesheet" href="/assets/css/yapi.css">
  ${graph}
</head>
<body class="yapi ${bodyClass}">
  <a class="skip-link" href="#main">İçeriğe geç</a>
  <div class="curtain" aria-hidden="true">${Array.from({ length: 6 }, (_, i) => `<i style="--r:${i}"></i>`).join('')}</div>
  <div class="scroll-meter" aria-hidden="true"><span></span></div>
  ${yHeader(active)}
  <main id="main">${body}</main>
  ${yFooter()}
  <script src="/assets/vendor/gsap.min.js" defer></script>
  <script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
  <script src="/assets/vendor/lenis.min.js" defer></script>
  <script src="/assets/js/app.js" defer></script>
  <script src="/assets/js/motion.js" defer></script>
  <script src="/assets/js/yapi.js" defer></script>
</body>
</html>`;
}

/* ---------------------------------------------------------
   Pieces
   --------------------------------------------------------- */
function faqHTML(items) {
  return `<div class="faq-list">${items.map(([q, a]) => `
    <details class="faq-item"><summary>${esc(q)} ${icon('plus', 18)}</summary><p>${esc(a)}</p></details>`).join('')}</div>${ldScript(faqLd(items))}`;
}

function stepsHTML(steps) {
  return `<section class="process y-process" data-process style="--n:${steps.length}">
    <div class="process-pin">
      <div class="container">
        <div class="process-head">
          <h2 data-split>İlk toplantıdan anahtara</h2>
          <p>Her projede aynı sırayı izliyoruz; nerede olduğunuzu her zaman bilirsiniz.</p>
        </div>
        <div class="process-ruler" aria-hidden="true"><span class="process-fill"></span></div>
        <ol class="process-steps">${steps.map((s, i) => `<li><span class="step-num">${i + 1}</span><h3>${esc(s)}</h3></li>`).join('')}</ol>
      </div>
    </div>
  </section>`;
}

function ctaBand(title = 'Binanız için ilk adım: ücretsiz ön görüşme.') {
  return `<section class="y-cta">
    <div class="container y-cta-inner">
      <h2 data-split>${title}</h2>
      <div class="y-cta-actions">
        <a class="btn btn-y" href="${P.contact}" data-magnetic>Ön görüşme talebi</a>
        <a class="btn btn-y-ghost" href="tel:${Y.phoneHref}" data-magnetic>${Y.person}: ${Y.phone}</a>
      </div>
    </div>
  </section>`;
}

function photoNote() {
  return '<p class="y-photonote">Görseller örnek amaçlıdır; kamu malı (CC0) fotoğraflardan seçilmiş ve renklendirilmiştir.</p>';
}

/* ---------------------------------------------------------
   HOME
   --------------------------------------------------------- */
function home() {
  const line = DISTRICTS.map((d, i) => `
      <li class="${d.hub ? 'is-hub' : ''}" style="--i:${i}">
        <a href="${P.dist(d.slug)}">
          <i class="stop" aria-hidden="true"></i>
          <span class="st-name">${esc(d.name)}</span>
          <span class="st-sub">${d.hub ? 'Merkez' : esc(d.parent || 'İlçe')}</span>
        </a>
      </li>`).join('');

  const body = `
  <section class="yh" data-yhero>
    <div class="yh-stage">
      <div class="yh-photo"><img src="${im('hero-vinc-gece')}" alt="Gece gökyüzünde bir kule vinç" fetchpriority="high"></div>
      <div class="yh-shade"></div>
      <div class="yh-word" aria-hidden="true">${'Taha Şen Yapı'.split('').map(ch => ch === ' ' ? '<span class="ch ch-gap"></span>' : `<span class="ch"><span>${ch}</span></span>`).join('')}</div>
      <div class="yh-copy">
        <p class="yh-kicker">Avcılar merkezli yapı ve kentsel dönüşüm</p>
        <h1 data-split="manual">Eski binanız, yeni bir başlangıç.</h1>
        <p class="yh-lead">Kentsel dönüşüm, kat karşılığı, sıfırdan yapı, renovasyon, restorasyon ve yaşam alanı dizaynı. Büyükçekmece’den Bakırköy’e, İstanbul’un batısında projeyi ilk toplantıdan tapuya kadar biz yürütüyoruz.</p>
        <div class="hx-actions">
          <a class="btn btn-y" href="${P.contact}" data-magnetic>Ücretsiz ön görüşme</a>
          <a class="btn btn-y-ghost" href="#hizmetler" data-magnetic>Hizmetler</a>
        </div>
      </div>
      <p class="hx-corner hx-corner-l">Avcılar, İstanbul<br>Bir Şen Parke kuruluşu</p>
      <p class="hx-corner hx-corner-r">${Y.person} <a href="tel:${Y.phoneHref}">${Y.phone}</a><br>${site.hours}</p>
      <div class="hx-hint" aria-hidden="true"><span>Kaydırın</span><i></i></div>
    </div>
  </section>

  <section class="manifesto y-manifesto">
    <div class="container">
      <p class="manifesto-text" data-words>Şen ailesi 1978’den beri İstanbul’un zeminlerini döşüyor. Taha Şen Yapı aynı titizliği binanın tamamına taşıyor: temelden çatıya, ilk malik toplantısından tapuya kadar tek muhatap, yazılı söz ve takvim.</p>
      <div class="ruler" data-ruler>
        <div class="ruler-ticks" aria-hidden="true"></div>
        <dl class="ruler-marks">
          <div><dt>Aile tecrübesi</dt><dd data-count="1978">1978</dd></div>
          <div><dt>Hizmet alanı</dt><dd data-count="${SERVICES.length}">${SERVICES.length}</dd></div>
          <div><dt>Bölge</dt><dd data-count="${DISTRICTS.length}">${DISTRICTS.length}</dd></div>
          <div><dt>Muhatap</dt><dd>1</dd></div>
        </dl>
      </div>
    </div>
  </section>

  <section class="stack" data-stack id="hizmetler">
    ${SERVICES.map((s) => `
    <article class="stack-panel">
      <div class="stack-media"><img src="${im(s.img)}" alt="${esc(s.alt)}" loading="lazy" data-parallax="10"></div>
      <div class="stack-body container">
        <div class="stack-title">
          <span class="stack-tag">${esc(s.tag)}</span>
          <h2 data-split class="${s.name.length > 30 ? 'is-long' : ''}">${esc(s.name)}</h2>
        </div>
        <div class="stack-text">
          <p>${esc(s.lead)}</p>
          <a class="btn btn-y" href="${P.svc(s.slug)}" data-magnetic>${esc(s.short || s.name)} süreci</a>
        </div>
      </div>
    </article>`).join('')}
  </section>

  ${stepsHTML(['Ön görüşme ve yerinde inceleme', 'Fizibilite ve yazılı teklif', 'Sözleşme', 'Proje ve ruhsat', 'İnşaat', 'Teslim ve tapu'])}

  <section class="y-line" id="bolgeler" data-yline>
    <div class="container">
      <div class="looks-head">
        <h2 data-split>Çalıştığımız bölgeler</h2>
        <p>Merkezimiz Avcılar; E-5 hattı boyunca batıda Büyükçekmece’ye, doğuda Bakırköy’e kadar projeleri yerinde takip ediyoruz.</p>
      </div>
      <div class="y-line-wrap">
        <span class="y-axis" aria-hidden="true"><i></i></span>
        <span class="y-axis-label" aria-hidden="true">E-5 / D-100</span>
        <ol class="y-stops">${line}</ol>
      </div>
      <p class="y-compass" aria-hidden="true"><span>← Batı</span><span>Doğu →</span></p>
    </div>
  </section>

  <section class="y-light y-faqsec">
    <div class="container catalog-seo">
      <div>
        <h2 data-split>Kentsel dönüşümde sık sorulanlar</h2>
        <p class="y-faq-lead">Daha fazlası ve süreç ayrıntıları için <a class="link-line" href="${P.svc('kentsel-donusum')}">kentsel dönüşüm</a> sayfasına bakın.</p>
      </div>
      <div>${faqHTML(SERVICES[0].faq)}</div>
    </div>
  </section>

  <section class="y-sister">
    <div class="container y-sister-inner">
      <div>
        <p class="y-sister-kicker">Bir Şen Parke kuruluşu</p>
        <h2 data-split>Zemin ve mutfak, aynı projede.</h2>
        <p>Dairelerin laminat parkesini, MDF panellerini ve mutfak dolaplarını Şen Parke’nin Avcılar showroomundan, aynı takvimle planlıyoruz.</p>
      </div>
      <a class="btn btn-y-ghost" href="/" data-magnetic>Şen Parke’ye git</a>
    </div>
  </section>

  ${ctaBand()}`;

  write('yapi/index.html', yShell({ title: '', pathName: '/yapi/', body, bodyClass: 'is-home y-home' }));
}

/* ---------------------------------------------------------
   Service pages
   --------------------------------------------------------- */
function yPageHero({ kicker, title, lead, img, alt, crumbs }) {
  return `<section class="y-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Sayfa yolu"><ol><li><a href="${P.home}">Taha Şen Yapı</a></li>${crumbs.map((c, i) => `<li>${i === crumbs.length - 1 ? `<span>${esc(c.label)}</span>` : `<a href="${c.href}">${esc(c.label)}</a>`}</li>`).join('')}</ol></nav>
      ${ldScript(breadcrumbLd([{ label: 'Taha Şen Yapı', href: P.home }, ...crumbs]))}
      <p class="y-hero-kicker">${esc(kicker)}</p>
      <h1 data-split>${esc(title)}</h1>
      <p class="y-hero-lead" data-fade>${esc(lead)}</p>
    </div>
    <div class="y-hero-media" data-clip><img src="${im(img)}" alt="${esc(alt)}" fetchpriority="high" data-parallax="12"></div>
  </section>`;
}

function servicePages() {
  SERVICES.forEach((s, idx) => {
    const others = SERVICES.filter(o => o.slug !== s.slug);
    const body = `
    ${yPageHero({ kicker: s.tag, title: s.name, lead: s.lead, img: s.img, alt: s.alt, crumbs: [{ label: 'Hizmetler', href: `${P.home}#hizmetler` }, { label: s.name }] })}
    <section class="y-light y-article">
      <div class="container y-article-grid">
        <div class="y-article-body">${s.body.map(p => `<p>${esc(p)}</p>`).join('')}
          ${photoNote()}
        </div>
        <aside class="y-article-aside" data-fade>
          <p class="y-aside-title">Bu hizmeti verdiğimiz bölgeler</p>
          <div class="y-chips">${DISTRICTS.filter(d => KIND_SERVICES[d.kind].includes(s.slug)).map(d => `<a href="${P.dist(d.slug)}">${esc(d.name)}</a>`).join('')}</div>
          <a class="btn btn-y-dark" href="${P.contact}?konu=${encodeURIComponent(s.name)}">Bu konuda görüşelim</a>
        </aside>
      </div>
    </section>
    ${stepsHTML(s.steps)}
    <section class="y-light y-faqsec">
      <div class="container catalog-seo">
        <div><h2 data-split>Sık sorulanlar</h2></div>
        <div>${faqHTML(s.faq)}</div>
      </div>
    </section>
    <section class="y-more">
      <div class="container">
        <h2 data-split>Diğer hizmetler</h2>
        <div class="y-more-grid">${others.map(o => `
          <a class="y-more-card" href="${P.svc(o.slug)}">
            <img src="${im(o.img)}" alt="${esc(o.alt)}" loading="lazy">
            <span>${esc(o.name)}</span>
          </a>`).join('')}</div>
      </div>
    </section>
    ${ctaBand()}`;
    write(`yapi/hizmetler/${s.slug}/index.html`, yShell({
      title: `${s.name} — Avcılar ve İstanbul’un batısı`,
      description: `${Y.name}: ${s.lead} Avcılar, Beylikdüzü, Esenyurt, Küçükçekmece, Bakırköy ve çevresinde ${s.name.toLocaleLowerCase('tr-TR')}.`,
      pathName: P.svc(s.slug), active: s.slug, body, ogImage: im(s.img),
      ld: [{
        '@type': 'Service',
        '@id': `${site.domain}${P.svc(s.slug)}#service`,
        name: s.name,
        serviceType: s.name,
        description: [s.lead, ...s.body].join(' '),
        url: site.domain + P.svc(s.slug),
        image: site.domain + im(s.img),
        provider: { '@id': IDS.yapi },
        areaServed: DISTRICTS.filter(d => KIND_SERVICES[d.kind].includes(s.slug) || d.hub).map(d => ({ '@type': 'Place', name: `${d.name}${d.parent ? ', ' + d.parent : ''}, İstanbul` })),
        hasOfferCatalog: { '@type': 'OfferCatalog', name: `${s.name} süreci`, itemListElement: s.steps.map((st, i) => ({ '@type': 'Offer', position: i + 1, itemOffered: { '@type': 'Service', name: st } })) }
      }]
    }));
  });
}

/* ---------------------------------------------------------
   District pages
   --------------------------------------------------------- */
/* Turkish locative/dative suffix helpers for place names (Avcılar’da, Bakırköy’de, Esenyurt’ta) */
const HARD = 'çfhkpsştÇFHKPSŞT';
const lastVowel = (w) => (w.toLocaleLowerCase('tr-TR').match(/[aeıioöuü]/g) || ['a']).pop();
const LOC_EXCEPT = { 'Beylikdüzü': 'Beylikdüzü’nde' };   /* possessive ending takes the buffer n */
const loc = (w) => LOC_EXCEPT[w] || `${w}’${HARD.includes(w.slice(-1)) ? 't' : 'd'}${'aıou'.includes(lastVowel(w)) ? 'a' : 'e'}`;

function districtFaq(d, svc, label) {
  const names = svc.map(s => s.name.toLocaleLowerCase('tr-TR'));
  const first = {
    transform: [`${loc(d.name)} kentsel dönüşüm süreci nasıl başlar?`, `Süreç, binanın Bakanlıkça lisanslandırılmış bir kuruluşa yaptırılan riskli yapı tespitiyle başlar. Ardından kat malikleriyle toplantı yapılır, dönüşüm modeli ve paylaşım yazılı olarak netleşir; proje ve ruhsattan sonra tahliye ve inşaata geçilir. ${label} için ilk görüşmeyi binanızda, ücretsiz yapıyoruz.`],
    mixed: [`${loc(d.name)} kat karşılığı inşaat nasıl işler?`, `Arsa sahibi arsasını, yüklenici proje, malzeme ve işçiliği koyar; ortaya çıkan bağımsız bölümler noterde yapılan sözleşmedeki oranla paylaşılır. ${label} için imar durumunu ve fizibiliteyi binanıza özel çıkarıyor, teklifi yazılı veriyoruz.`],
    new: [`${loc(d.name)} arsama sıfırdan bina yaptırmak için nereden başlamalıyım?`, `İlk adım imar durumu ve zemin etüdüdür; bunlar binanın kaç kat ve kaç bağımsız bölüm olabileceğini belirler. Ardından mimari ve statik projeyi lisanslı mimar ve mühendislerle hazırlıyor, ruhsattan iskâna kadar süreci tek elden yürütüyoruz.`]
  }[d.kind];
  return [
    first,
    [`${loc(d.name)} kat karşılığı paylaşım oranı ne kadar?`, 'Sabit bir oran yoktur. Oran; parselin imar durumu ve emsali, çıkabilecek bağımsız bölüm sayısı, konum ve güncel inşaat maliyetine göre hesaplanır. Önceden oran vaat etmiyor, hesabı sizinle şeffaf biçimde paylaşıyoruz.'],
    [`Taha Şen Yapı ${d.hub ? `${loc(d.name)} hangi hizmetleri veriyor` : `${d.name} için hangi hizmetleri veriyor`}?`, `${label} için öne çıkan hizmetlerimiz ${names.slice(0, -1).join(', ')} ve ${names.slice(-1)[0]}. ${d.hub ? 'Merkezimiz Avcılar’da; ilçedeki şantiyeleri her gün yerinde takip ediyoruz.' : `Merkezimiz Avcılar’da olduğu için ${loc(d.name)} şantiyeyi yakından takip ediyoruz.`}`],
    ['Ön görüşme ve yerinde inceleme ücretli mi?', 'Hayır, ön görüşme ve yerinde inceleme ücretsizdir. Görüşmeden sonra fizibiliteyi ve teklifi yazılı olarak paylaşıyoruz.']
  ];
}

function districtPages() {
  DISTRICTS.forEach(d => {
    const svc = KIND_SERVICES[d.kind].map(k => SERVICES.find(s => s.slug === k));
    const label = d.parent ? `${d.name}, ${d.parent}` : d.name;
    const faq = districtFaq(d, svc, label);
    const body = `
    ${yPageHero({ kicker: d.parent ? `${d.parent}, İstanbul` : 'İstanbul', title: `${loc(d.name)} yapı ve kentsel dönüşüm`, lead: d.note, img: d.img, alt: `${d.name} için örnek yapı görseli`, crumbs: [{ label: 'Bölgeler', href: `${P.home}#bolgeler` }, { label: d.name }] })}
    <section class="y-light y-article">
      <div class="container">
        <h2 data-split>${esc(loc(d.name))} öne çıkan hizmetlerimiz</h2>
        <div class="y-svc-grid">${svc.map(s => `
          <a class="y-svc-card" href="${P.svc(s.slug)}">
            <img src="${im(s.img)}" alt="${esc(s.alt)}" loading="lazy">
            <div><h3>${esc(s.name)}</h3><p>${esc(s.lead)}</p><span class="link-line">Süreci inceleyin</span></div>
          </a>`).join('')}</div>
        <div class="y-local">
          <p>${esc(label)} için ilk görüşmeyi yerinde yapıyoruz: binayı ya da arsayı birlikte geziyor, malik toplantısına katılıyor, ardından fizibiliteyi yazılı olarak paylaşıyoruz. Merkezimiz Avcılar’da olduğu için şantiyeyi yakından takip ediyoruz.</p>
          <a class="btn btn-y-dark" href="${P.contact}?bolge=${encodeURIComponent(d.name)}">${esc(d.name)} için görüşme talebi</a>
        </div>
        ${photoNote()}
      </div>
    </section>
    <section class="y-light y-faqsec">
      <div class="container catalog-seo">
        <div><h2 data-split>${esc(d.name)} için sık sorulanlar</h2></div>
        <div>${faqHTML(faq)}</div>
      </div>
    </section>
    <section class="y-more">
      <div class="container">
        <h2 data-split>Diğer bölgeler</h2>
        <div class="y-chips y-chips-dark">${DISTRICTS.filter(o => o.slug !== d.slug).map(o => `<a href="${P.dist(o.slug)}">${esc(o.name)}</a>`).join('')}</div>
      </div>
    </section>
    ${ctaBand(`${loc(d.name)}ki binanız için ücretsiz ön görüşme.`)}`;
    write(`yapi/bolgeler/${d.slug}/index.html`, yShell({
      title: `${d.name} Kentsel Dönüşüm ve Kat Karşılığı`,
      description: `${label}: kentsel dönüşüm, kat karşılığı inşaat, sıfırdan yapı ve renovasyon. ${Y.name}, Avcılar merkezli; ücretsiz ön görüşme.`,
      pathName: P.dist(d.slug), active: 'bolgeler', body, ogImage: im(d.img)
    }));
  });
}

/* ---------------------------------------------------------
   Contact
   --------------------------------------------------------- */
function contactPage() {
  const body = `
  ${yPageHero({ kicker: 'Ücretsiz ön görüşme', title: 'Binanızı konuşalım', lead: 'Binanızın ya da arsanızın adresini, kat ve malik sayısını yazın; ilk görüşme için sizi arayalım. Ön görüşme ve yerinde inceleme ücretsizdir.', img: 'santiye-vinc', alt: 'Vinçli bir şantiye ve yeni konutlar', crumbs: [{ label: 'İletişim' }] })}
  <section class="y-light section">
    <div class="container form-layout">
      <div class="form-aside">
        <h2>Doğrudan ulaşın</h2>
        <ul class="contact-block">
          <li>${icon('phone', 17)}<span><strong>${Y.person}</strong><a href="tel:${Y.phoneHref}">${Y.phone}</a></span></li>
          <li>${icon('whatsapp', 17)}<span><strong>WhatsApp</strong><a href="${Y.whatsapp}" target="_blank" rel="noopener">Hemen yazın</a></span></li>
          <li>${icon('clock', 17)}<span><strong>Çalışma saatleri</strong>${site.hours}. ${site.hoursNote}.</span></li>
          <li>${icon('pin', 17)}<span><strong>Merkez</strong>Avcılar, İstanbul. Görüşmeleri yerinde, binanızda yapıyoruz.</span></li>
        </ul>
      </div>
      <form class="form-card" data-form data-whatsapp="905537281755" novalidate>
        <h3>Ön görüşme talebi</h3>
        <p>Birkaç bilgi yeterli; gerisini ilk görüşmede netleştiririz.</p>
        <div class="form-grid">
          <div class="field"><label for="yName">Ad Soyad *</label><input id="yName" name="name" type="text" required autocomplete="name"></div>
          <div class="field"><label for="yPhone">Telefon *</label><input id="yPhone" name="phone" type="tel" required autocomplete="tel" placeholder="0(5xx) xxx xx xx"></div>
          <div class="field">
            <label for="ySubject">Konu *</label>
            <select id="ySubject" name="subject" required>
              <option value="">Seçin…</option>
              ${SERVICES.map(s => `<option value="${esc(s.name)}">${esc(s.name)}</option>`).join('')}
              <option value="Diğer">Diğer</option>
            </select>
          </div>
          <div class="field">
            <label for="yDistrict">Bölge *</label>
            <select id="yDistrict" name="city" required>
              <option value="">Seçin…</option>
              ${DISTRICTS.map(d => `<option value="${esc(d.name)}">${esc(d.name)}${d.parent ? ' (' + esc(d.parent) + ')' : ''}</option>`).join('')}
              <option value="Diğer">Diğer</option>
            </select>
          </div>
          <div class="field full"><label for="yMsg">Bina / arsa bilgisi</label><textarea id="yMsg" name="message" placeholder="Adres, kat sayısı, bağımsız bölüm ve malik sayısı, yapım yılı…"></textarea></div>
          <div class="field full"><label class="checkbox"><input type="checkbox" name="kvkk" required> <span><a href="/kvkk/">KVKK Aydınlatma Metni</a>’ni okudum, kişisel verilerimin bu amaçla işlenmesine onay veriyorum.</span></label></div>
          <div class="field full"><button class="btn btn-y-dark" type="submit">Talebi gönder</button></div>
        </div>
        <div class="form-success"></div>
        <p class="form-note">* Zorunlu alanlar. Talebiniz WhatsApp üzerinden ${Y.person}’e iletilir.</p>
      </form>
    </div>
  </section>`;
  write('yapi/iletisim/index.html', yShell({ title: 'İletişim ve Ön Görüşme', description: `${Y.name} ile ücretsiz ön görüşme: kentsel dönüşüm, kat karşılığı, sıfırdan yapı ve renovasyon. ${Y.person} ${Y.phone}.`, pathName: P.contact, active: 'iletisim', body }));
}

/* Preselect subject / district from the URL */
function favicon() {
  fs.writeFileSync(path.join(PUB, 'assets', 'yapi-favicon.svg'), yMark().replace('<svg class="y-mark"', '<svg xmlns="http://www.w3.org/2000/svg"'));
}

function buildYapi() {
  home();
  servicePages();
  districtPages();
  contactPage();
  return written.map(r => '/' + r.replace(/index\.html$/, ''));
}

module.exports = { buildYapi, YAPI_PATHS: () => written.map(r => '/' + r.replace(/index\.html$/, '')), SERVICES, DISTRICTS, YP: P, Y };
