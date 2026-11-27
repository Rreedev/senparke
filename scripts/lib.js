const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUB = path.join(ROOT, 'public');

const site = {
  name: 'Şenparke',
  legal: 'Şen Parke',
  since: 1978,
  founder: 'Muhsin Şen',
  phone: '0553 728 17 55',
  phoneHref: '+905537281755',
  waNumber: '905537281755',
  phoneName: 'Taha ŞEN',
  phones: [
    { name: 'Taha ŞEN', number: '0553 728 17 55', href: '+905537281755' },
    { name: 'Muhsin ŞEN', number: '0544 211 95 48', href: '+905442119548' }
  ],
  street: 'Cihangir Mah. Ormanlı Cad. Fırat Sk. No: 1/A',
  district: 'Avcılar',
  postal: '34310',
  address: 'Cihangir Mah. Ormanlı Cad. Fırat Sk. No: 1/A, 34310 Avcılar / İstanbul',
  facility: 'Showroom, ofis ve 1000 m² ana depo aynı adreste',
  hours: 'Hafta içi ve Cumartesi, 08:00 – 21:00',
  hoursNote: 'Pazar kapalı',
  rating: '5,0',
  whatsapp: 'https://wa.me/905537281755?text=Merhaba%2C%20%C5%9Een%20Parke%20%C3%BCr%C3%BCnleri%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.',
  /* Google İşletme Profili (Şen Parke, Avcılar) */
  google: 'https://www.google.com/maps?cid=6902869844658238653',
  maps: 'https://www.google.com/maps?cid=6902869844658238653',
  mapsEmbed: 'https://maps.google.com/maps?cid=6902869844658238653&hl=tr&z=17&output=embed',
  domain: 'https://senparke.com.tr'
};

/* Catalogue figures, computed from the data so copy never goes stale */
const stats = (() => {
  let all = [];
  try { all = JSON.parse(fs.readFileSync(path.join(PUB, 'data', 'products.json'), 'utf8')); } catch (e) { all = []; }
  const lam = all.filter(p => p.category === 'Laminat Parke');
  const mdf = all.filter(p => p.category === 'MDF & Panel');
  const brand = (b) => {
    const items = lam.filter(p => p.brand === b);
    return { models: items.length, collections: new Set(items.map(p => p.collection)).size };
  };
  return {
    laminat: lam.length,
    laminatCollections: new Set(lam.map(p => p.brand + '|' + p.collection)).size,
    mdf: mdf.length,
    mdfCollections: new Set(mdf.map(p => p.collection)).size,
    agt: brand('AGT'),
    yildiz: brand('Yıldız Entegre'),
    camsan: brand('Çamsan')
  };
})();

/* Service areas, west to east along the E-5. Shared by Şen Parke (/parke/<slug>/)
   and Taha Şen Yapı (/tahasenyapi/bolgeler/<slug>/) so the two sites cross-link. */
const AREAS = [
  { slug: 'buyukcekmece', name: 'Büyükçekmece', parent: '' },
  { slug: 'gurpinar', name: 'Gürpınar', parent: 'Beylikdüzü' },
  { slug: 'yakuplu', name: 'Yakuplu', parent: 'Beylikdüzü' },
  { slug: 'beylikduzu', name: 'Beylikdüzü', parent: '' },
  { slug: 'esenyurt', name: 'Esenyurt', parent: '' },
  { slug: 'avcilar', name: 'Avcılar', parent: '', hub: true },
  { slug: 'kucukcekmece', name: 'Küçükçekmece', parent: '' },
  { slug: 'sefakoy', name: 'Sefaköy', parent: 'Küçükçekmece' },
  { slug: 'sirinevler', name: 'Şirinevler', parent: 'Bahçelievler' },
  { slug: 'bakirkoy', name: 'Bakırköy', parent: '' }
];

/* Turkish case suffixes for place names: Avcılar’da / Esenyurt’ta / Beylikdüzü’nde, …’dan / …’tan / …’nden */
const HARD = 'çfhkpsştÇFHKPSŞT';
const lastVowel = (w) => (w.toLocaleLowerCase('tr-TR').match(/[aeıioöuü]/g) || ['a']).pop();
const LOC_EXCEPT = { 'Beylikdüzü': 'Beylikdüzü’nde' };   /* possessive ending takes the buffer n */
const loc = (w) => LOC_EXCEPT[w] || `${w}’${HARD.includes(w.slice(-1)) ? 't' : 'd'}${'aıou'.includes(lastVowel(w)) ? 'a' : 'e'}`;
const abl = (w) => loc(w) + 'n';

const paths = {
  parke: '/parke/',
  parkeArea: (slug) => `/parke/${slug}/`,
  ahsap: '/ahsap-masif-parke/',
  sistre: '/parke-sistre-cila/',
  laminat: '/kategori/laminat-parke/',
  mdf: '/kategori/mdf-panel/',
  mutfak: '/mutfak-dolabi/',
  markalar: '/markalar/',
  galeri: '/galeri/',
  hakkimizda: '/hakkimizda/',
  iletisim: '/iletisim/',
  teklif: '/teklif/'
};

const nav = [
  { label: 'Parke', href: paths.laminat, mega: 'parke' },
  { label: 'MDF & Panel', href: paths.mdf },
  { label: 'Mutfak', href: paths.mutfak, mega: 'mutfak' },
  { label: 'Markalar', href: paths.markalar },
  { label: 'Galeri', href: paths.galeri },
  { label: 'Hakkımızda', href: paths.hakkimizda },
  { label: 'İletişim', href: paths.iletisim }
];

const icons = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowUp: '<path d="M7 17 17 7M8 7h9v9"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  whatsapp: '<path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.1-5.4A8.5 8.5 0 1 1 21 11.5z"/><path d="M8.5 8.8c0 4 3.2 7.2 7.2 7.2l1.3-1.8-2.4-1.1-1 1a6.4 6.4 0 0 1-2.6-2.6l1-1-1.1-2.4-1.8 1.3z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  ruler: '<path d="M3 15 15 3l6 6L9 21l-6-6z"/><path d="m7 11 2 2M10 8l2 2M13 5l2 2"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5 9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-5"/>',
  spark: '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/>',
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10z"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  facebook: '<path d="M15 3h-3a4 4 0 0 0-4 4v3H5v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2V3z"/>',
  pinterest: '<path d="M9 20c1-3 2-7 2-7s-1-2 0-4c1-2 4-1 3 2-1 3-2 4-1 6 1 2 4 1 5-1 2-3 1-8-3-10-4-2-9 0-9 5 0 2 1 4 2 4"/><circle cx="12" cy="12" r="9"/>',
  play: '<path d="m8 5 11 7-11 7V5z"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  filters: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  quote: '<path d="M7 7h4v6H5V9a2 2 0 0 1 2-2zM17 7h4v6h-6V9a2 2 0 0 1 2-2z"/>'
};

function icon(name, size = 20, cls = '') {
  const body = icons[name] || '';
  return `<svg class="icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function img(src) {
  if (!src) return '/images/site/interior-3.jpg';
  return src.startsWith('http') || src.startsWith('/') ? src : '/' + src;
}

/* Logo: the original artwork (brand/senparke-logo-original.png → scripts/make-logo.js).
   logo.png for light backgrounds, logo-light.png for dark ones. */
function logoMark(cls = '') {
  return `<img class="sp-mark ${cls}" src="/assets/logo/mark.png" alt="" width="160" height="155" loading="lazy">`;
}

function logo(light = false) {
  return `<a class="logo ${light ? 'logo-light' : ''}" href="/" aria-label="Şen Parke ana sayfa">
    <img class="logo-img logo-on-light" src="/assets/logo/logo.png" alt="Şen Parke" width="900" height="257">
    <img class="logo-img logo-on-dark" src="/assets/logo/logo-light.png" alt="" aria-hidden="true" width="900" height="257">
  </a>`;
}
function brandClass(brand) {
  if (brand === 'AGT') return 'brand-agt';
  if (brand === 'Yıldız Entegre') return 'brand-yildiz';
  if (brand === 'Çamsan') return 'brand-camsan';
  return 'brand-senfloor';
}

function brandShort(brand) {
  if (brand === 'Yıldız Entegre') return 'Yıldız';
  if (brand === 'Şen Floor') return 'Şen Floor';
  return brand;
}

function megaMenu() {
  return `
  <div class="mega-wrap" data-mega="parke">
    <div class="mega-inner">
      <div class="mega-intro">
        <span class="eyebrow">Laminat Parke</span>
        <h3>Doğanın dokusunu<br>yaşam alanınıza taşıyın.</h3>
        <p>AGT, Çamsan ve Yıldız Entegre koleksiyonlarından ${stats.laminat} model; 7,5–12 mm, suya dayanıklı ve geniş ebatlı seriler.</p>
        <a class="text-link" href="${paths.laminat}">Tüm modelleri keşfedin ${icon('arrow', 16)}</a>
      </div>
      <div class="mega-links">
        <div>
          <span class="mega-label">Öne Çıkan Koleksiyonlar</span>
          <a href="${paths.laminat}?collection=Mood+XLarge">Mood XLarge <em>AGT</em></a>
          <a href="${paths.laminat}?collection=Avangard+Seri">Avangard Seri <em>Çamsan</em></a>
          <a href="${paths.laminat}?collection=Effect+Aqua+Block">Effect Aqua Block <em>AGT</em></a>
          <a href="${paths.laminat}?collection=Diamond+Seri">Diamond Seri <em>Çamsan</em></a>
          <a href="${paths.laminat}?collection=TerraClick+8+mm">TerraClick 8 mm <em>Yıldız</em></a>
          <a href="${paths.laminat}">Tüm koleksiyonlar <em>${stats.laminatCollections} seri</em></a>
        </div>
        <div>
          <span class="mega-label">Parke türleri ve hizmetler</span>
          <a href="${paths.laminat}">Laminat parke <em>${stats.laminat} model</em></a>
          <a href="${paths.ahsap}">Ahşap ve masif parke <em>Satış · montaj</em></a>
          <a href="${paths.sistre}">Parke sistre ve cila <em>Yenileme</em></a>
          <a href="${paths.mdf}">MDF &amp; Panel <em>${stats.mdf} ürün</em></a>
          <a href="/markalar/">Markalar <em>AGT · Çamsan · Yıldız</em></a>
        </div>
      </div>
      <a class="mega-feature" href="${paths.laminat}?collection=Mood+XLarge">
        <img src="/images/agt/agt-mood-xlarge-mare-1.jpg" alt="Mood XLarge laminat parke" loading="lazy">
        <span>Öne çıkan koleksiyon</span>
        <strong>Mood XLarge</strong>
        <em>Taş ve ahşap dokular · 10 mm</em>
      </a>
    </div>
  </div>
  <div class="mega-wrap" data-mega="mutfak">
    <div class="mega-inner mega-inner-kitchen">
      <div class="mega-intro">
        <span class="eyebrow">Mutfak Dolabı</span>
        <h3>Ölçüden montaja,<br>mutfağınızın tamamı.</h3>
        <p>Modern, klasik ve lake mutfaklar; tezgâh, kapak ve montaj tek elden.</p>
        <a class="text-link" href="${paths.mutfak}">Mutfak çözümlerini keşfedin ${icon('arrow', 16)}</a>
      </div>
      <div class="mega-links">
        <div>
          <span class="mega-label">Mutfak</span>
          <a href="${paths.mutfak}">Mutfak Dolabı</a>
          <a href="${paths.mutfak}#stiller">Modern &amp; Minimal</a>
          <a href="${paths.mutfak}#stiller">Klasik &amp; Lake</a>
          <a href="${paths.mutfak}#malzemeler">Kapak &amp; Tezgâh</a>
          <a href="${paths.mutfak}#surec">Keşif &amp; Montaj</a>
        </div>
        <div>
          <span class="mega-label">Birlikte Düşünelim</span>
          <a href="${paths.teklif}">Ücretsiz keşif talebi</a>
          <a href="${paths.galeri}">Proje galerisi</a>
          <a href="${paths.iletisim}">Showroom &amp; iletişim</a>
        </div>
      </div>
      <a class="mega-feature" href="${paths.mutfak}">
        <img src="/images/site/kitchen-2.jpg" alt="Ahşap mutfak dolabı" loading="lazy">
        <span>Mutfakta yeni dönem</span>
        <strong>Ahşap &amp; taş</strong>
        <em>Doğal malzeme, sade çizgi</em>
      </a>
    </div>
  </div>`;
}

function header(active = '') {
  const navHtml = nav.map(item => {
    const isActive = active && active.toLocaleLowerCase('tr-TR') === item.label.toLocaleLowerCase('tr-TR');
    if (item.mega) {
      return `<li class="has-mega ${isActive ? 'is-active' : ''}" data-mega="${item.mega}">
        <a href="${item.href}" aria-haspopup="true">${item.label} ${icon('chevronDown', 14)}</a>
      </li>`;
    }
    return `<li class="${isActive ? 'is-active' : ''}"><a href="${item.href}">${item.label}</a></li>`;
  }).join('');

  return `
  <header class="site-header" id="siteHeader">
    <div class="header-inner">
      <div class="brand-row">
        ${logo()}
        <a class="yapi-switch" href="/tahasenyapi/" title="Taha Şen Yapı: kentsel dönüşüm, kat karşılığı ve inşaat">Taha Şen Yapı</a>
      </div>
      <nav class="main-nav" aria-label="Ana menü">
        <ul>${navHtml}</ul>
      </nav>
      <div class="header-actions">
        <button class="icon-btn search-trigger" type="button" aria-label="Ürün ara">${icon('search', 19)}</button>
        <a class="header-phone" href="tel:${site.phoneHref}"><span class="phone-name">${site.phoneName}</span> ${site.phone}</a>
        <a class="btn btn-solid btn-sm header-cta" href="${paths.teklif}" data-magnetic>Keşif randevusu</a>
        <button class="icon-btn menu-trigger" type="button" aria-label="Menüyü aç" aria-expanded="false"><span class="burger"><i></i><i></i></span></button>
      </div>
    </div>
    ${megaMenu()}
  </header>
  <div class="mobile-drawer" id="mobileDrawer" aria-hidden="true" data-lenis-prevent>
    <div class="drawer-head">${logo(true)}<button class="icon-btn drawer-close" type="button" aria-label="Menüyü kapat">${icon('close', 24)}</button></div>
    <div class="drawer-body">
      <details open>
        <summary>Parke ${icon('chevronDown', 16)}</summary>
        <div class="drawer-sub">
          <a href="${paths.laminat}">Tüm Laminat Parke <em>${stats.laminat} model</em></a>
          <a href="${paths.laminat}?brand=AGT">AGT</a>
          <a href="${paths.laminat}?brand=%C3%87amsan">Çamsan</a>
          <a href="${paths.laminat}?brand=Y%C4%B1ld%C4%B1z+Entegre">Yıldız Entegre</a>
          <a href="${paths.markalar}">Markalar</a>
        </div>
      </details>
      <a href="${paths.mdf}">MDF &amp; Panel</a>
      <details>
        <summary>Mutfak ${icon('chevronDown', 16)}</summary>
        <div class="drawer-sub">
          <a href="${paths.mutfak}">Mutfak Dolabı</a>
          <a href="${paths.mutfak}#stiller">Modern &amp; Klasik</a>
          <a href="${paths.mutfak}#malzemeler">Kapak &amp; Tezgâh</a>
          <a href="${paths.teklif}">Ücretsiz Keşif</a>
        </div>
      </details>
      <a href="${paths.markalar}">Markalar</a>
      <a href="${paths.galeri}">Galeri</a>
      <a href="${paths.hakkimizda}">Hakkımızda</a>
      <a href="${paths.iletisim}">İletişim</a>
    </div>
    <div class="drawer-foot">
      <a class="btn btn-primary" href="${paths.teklif}">Ücretsiz Keşif ${icon('arrow', 16)}</a>
      ${site.phones.map(p => `<a class="drawer-phone" href="tel:${p.href}">${icon('phone', 18)} ${p.name}: ${p.number}</a>`).join('')}
      <p>${site.address}</p>
    </div>
  </div>
  <div class="search-overlay" id="searchOverlay" aria-hidden="true" data-lenis-prevent>
    <div class="search-panel" role="dialog" aria-modal="true" aria-label="Ürün arama">
      <button class="icon-btn search-close" type="button" aria-label="Aramayı kapat">${icon('close', 24)}</button>
      <h2>${stats.laminat + stats.mdf} ürün içinde arayın</h2>
      <div class="search-field">
        ${icon('search', 22)}
        <input type="search" id="searchInput" placeholder="Ürün, kod veya koleksiyon yazın…" autocomplete="off">
      </div>
      <div class="search-hints">
        <span>Popüler:</span>
        <button type="button" data-search="meşe">Meşe</button>
        <button type="button" data-search="taş">Taş</button>
        <button type="button" data-search="aqua">Aqua</button>
        <button type="button" data-search="8 mm">8 mm</button>
      </div>
      <div class="search-results" id="searchResults"></div>
    </div>
  </div>`;
}

function footer() {
  return `
  <footer class="site-footer">
    <div class="container footer-top">
      <div class="footer-lead">
        <p class="footer-claim">Ölçüyü biz alırız,<br>montajı biz yaparız.</p>
        <a class="btn btn-tape" href="${paths.teklif}" data-magnetic>Keşif randevusu al</a>
      </div>
      <div class="footer-cols">
        <div class="footer-col">
          <span class="footer-title">Ürünler</span>
          <a href="${paths.laminat}">Laminat parke</a>
          <a href="${paths.laminat}?brand=AGT">AGT</a>
          <a href="${paths.laminat}?brand=%C3%87amsan">Çamsan</a>
          <a href="${paths.laminat}?brand=Y%C4%B1ld%C4%B1z+Entegre">Yıldız Entegre</a>
          <a href="${paths.ahsap}">Ahşap ve masif parke</a>
          <a href="${paths.sistre}">Parke sistre ve cila</a>
          <a href="${paths.mdf}">MDF &amp; Panel</a>
        </div>
        <div class="footer-col">
          <span class="footer-title">Şen Parke</span>
          <a href="${paths.mutfak}">Mutfak dolabı</a>
          <a href="${paths.markalar}">Markalar</a>
          <a href="${paths.galeri}">Galeri</a>
          <a href="${paths.hakkimizda}">Hakkımızda</a>
          <a href="${paths.iletisim}">İletişim</a>
        </div>
        <div class="footer-col footer-contact">
          <span class="footer-title">Avcılar showroom ve depo</span>
          <p>${site.address}</p>
          <p>${site.hours}<br>${site.hoursNote}</p>
          ${site.phones.map(p => `<a href="tel:${p.href}"><span class="phone-name">${p.name}</span> ${p.number}</a>`).join('')}
        </div>
      </div>
    </div>
    <div class="container footer-areas">
      <a class="footer-title" href="${paths.parke}">Parke hizmet bölgeleri</a>
      <nav aria-label="Parke hizmet bölgeleri">${AREAS.map(a => `<a href="${paths.parkeArea(a.slug)}">${esc(a.name)} parke</a>`).join('')}</nav>
    </div>
    <div class="footer-word" aria-hidden="true"><span>Şen Parke</span></div>
    <div class="container footer-bottom">
      <p>© ${new Date().getFullYear()} ${site.legal}. İstanbul, 1978'den beri.</p>
      <div>
        <a href="/kvkk/">KVKK aydınlatma metni</a>
        <a href="/cerez-politikasi/">Çerez politikası</a>
        <a href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
        <a href="${site.google}" target="_blank" rel="noopener">Google profilimiz (${site.rating} ★)</a>
      </div>
      <a class="footer-credit" href="https://saviasora.dev" target="_blank" rel="noopener">Made by egsu</a>
    </div>
  </footer>
  <a class="whatsapp-float" href="${site.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp ile yazın">${icon('whatsapp', 22)}</a>
  <button class="back-top" type="button" aria-label="Yukarı çık">${icon('arrowUp', 18)}</button>`;
}

function chrome() {
  const rows = Array.from({ length: 6 }, (_, i) => `<i style="--r:${i}"></i>`).join('');
  return `
  <div class="curtain" aria-hidden="true">${rows}</div>
  <div class="scroll-meter" aria-hidden="true"><span></span></div>`;
}

/* ---------------------------------------------------------
   Structured data (schema.org JSON-LD)
   Every page carries one @graph: the business, the website and the page itself.
   Stable @id anchors let Google and AI answer engines tie pages to one entity.
   --------------------------------------------------------- */
const IDS = {
  business: `${site.domain}/#sen-parke`,
  website: `${site.domain}/#website`,
  yapi: `${site.domain}/tahasenyapi/#taha-sen-yapi`
};

const OPENING = [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '21:00' }];
const ADDRESS = { '@type': 'PostalAddress', streetAddress: site.street, addressLocality: site.district, postalCode: site.postal, addressRegion: 'İstanbul', addressCountry: 'TR' };

function ldScript(data) {
  /* "<" is escaped so no string inside the data can close the script tag */
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

const stripTags = (s) => String(s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

function faqLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: stripTags(q), acceptedAnswer: { '@type': 'Answer', text: stripTags(a) } }))
  };
}

function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => Object.assign(
      { '@type': 'ListItem', position: i + 1, name: stripTags(it.label) },
      it.href ? { item: site.domain + it.href.replace(/#.*$/, '') } : {}
    ))
  };
}

function businessNode() {
  return {
    '@type': ['HomeAndConstructionBusiness', 'HomeGoodsStore'],
    '@id': IDS.business,
    name: 'Şen Parke',
    alternateName: ['Şenparke', 'Sen Parke', 'Şen Parke Avcılar'],
    /* A separately owned business uses the same name; this line tells search engines which one this is */
    disambiguatingDescription: 'Avcılar Cihangir Mahallesi’ndeki Şen Parke: showroom, ofis ve 1000 m² depo aynı adreste; web sitesi senparke.com.tr.',
    legalName: site.legal,
    description: `1978’den beri İstanbul Avcılar’da laminat parke, MDF panel ve mutfak dolabı satışı ve montajı. AGT, Çamsan ve Yıldız Entegre’den ${stats.laminat} laminat parke modeli ve ${stats.mdf} MDF ürünü; showroom, ofis ve 1000 m² depo aynı adreste.`,
    url: `${site.domain}/`,
    logo: `${site.domain}/assets/logo/logo.png`,
    image: ['magaza-cephesi', 'showroom-genel', 'showroom-numune-standi'].map(n => `${site.domain}/images/showroom/${n}.jpg`),
    telephone: site.phones[0].href,
    foundingDate: String(site.since),
    founder: { '@type': 'Person', name: site.founder },
    address: ADDRESS,
    hasMap: site.maps,
    openingHoursSpecification: OPENING,
    areaServed: [{ '@type': 'City', name: 'İstanbul' }, ...AREAS.map(a => ({ '@type': 'Place', name: `${a.name}${a.parent ? ', ' + a.parent : ''}, İstanbul`, url: site.domain + paths.parkeArea(a.slug) }))],
    contactPoint: site.phones.map(p => ({ '@type': 'ContactPoint', telephone: p.href, name: p.name, contactType: 'customer service', areaServed: 'TR', availableLanguage: 'Turkish' })),
    brand: ['AGT', 'Çamsan', 'Yıldız Entegre'].map(b => ({ '@type': 'Brand', name: b })),
    knowsAbout: ['Laminat parke', 'MDF panel', 'Mutfak dolabı', 'Parke montajı', 'Süpürgelik ve geçiş profili', 'Zemin kaplama'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Ürün ve hizmetler',
      itemListElement: [
        ['Laminat parke', paths.laminat], ['MDF ve panel', paths.mdf], ['Mutfak dolabı', paths.mutfak], ['Ücretsiz keşif, ölçü ve montaj', paths.teklif]
      ].map(([name, href]) => ({ '@type': 'OfferCatalog', name, url: site.domain + href }))
    },
    subOrganization: { '@id': IDS.yapi },
    sameAs: [site.google]
  };
}

function websiteNode() {
  return { '@type': 'WebSite', '@id': IDS.website, url: `${site.domain}/`, name: 'Şen Parke', alternateName: 'Şenparke', inLanguage: 'tr-TR', publisher: { '@id': IDS.business } };
}

function pageGraph({ canonical, name, description, about = IDS.business, image, extra = [] }) {
  return ldScript({
    '@context': 'https://schema.org',
    '@graph': [
      businessNode(),
      websiteNode(),
      Object.assign({ '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name, description, inLanguage: 'tr-TR', isPartOf: { '@id': IDS.website }, about: { '@id': about } },
        image ? { primaryImageOfPage: { '@type': 'ImageObject', url: image } } : {}),
      ...extra
    ]
  });
}

function pageShell({ title, description, pathName = '/', active = '', body = '', bodyClass = '', bodyAttrs = '', extraHead = '', ogImage = '/images/showroom/showroom-genel.jpg' }) {
  const fullTitle = title ? `${title} | Şen Parke` : 'Şen Parke | Avcılar Laminat Parke, Ahşap Parke ve Mutfak Dolabı';
  const desc = description || `1978’den beri Avcılar’da laminat parke, MDF ve mutfak dolabı. AGT, Çamsan ve Yıldız Entegre koleksiyonlarından ${stats.laminat} laminat model; keşiften montaja tek elden.`;
  const canonical = `${site.domain}${pathName}`;
  const ogAbs = /^https?:/.test(ogImage) ? ogImage : site.domain + ogImage;
  return `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  ${pathName === '/' ? '<meta name="msvalidate.01" content="93BAF3BAFC7EBA5718A2D204DF81B434">' : ''}
  <link rel="canonical" href="${esc(canonical)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:site_name" content="Şen Parke">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${esc(ogAbs)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="geo.region" content="TR-34">
  <meta name="geo.placename" content="Avcılar, İstanbul">
  <meta name="theme-color" content="#2e2119">
  <link rel="icon" href="/assets/logo/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/assets/logo/favicon-180.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <script>(function(d){d.classList.add('js');try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('reduced');if(sessionStorage.getItem('sp-nav'))d.classList.add('is-arriving')}catch(e){}})(document.documentElement);</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/style.css">
  ${pageGraph({ canonical, name: fullTitle, description: desc, image: ogAbs })}
  ${extraHead}
</head>
<body class="${bodyClass}" ${bodyAttrs}>
  <a class="skip-link" href="#main">İçeriğe geç</a>
  ${chrome()}
  ${header(active)}
  <main id="main">${body}</main>
  ${footer()}
  <script src="/assets/vendor/gsap.min.js" defer></script>
  <script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
  <script src="/assets/vendor/lenis.min.js" defer></script>
  <script src="/assets/js/app.js" defer></script>
  <script src="/assets/js/motion.js" defer></script>
</body>
</html>`;
}

function productCard(p, opts = {}) {
  const href = '/' + p.url;
  const chips = [
    p.thickness ? `<span>${esc(p.thickness)}</span>` : '',
    p.surface ? `<span>${esc(p.surface)}</span>` : '',
    p.joint ? `<span>${esc(p.joint)}</span>` : '',
    !p.thickness && p.size ? `<span>${esc(p.size)}</span>` : ''
  ].filter(Boolean).slice(0, 3).join('');
  return `<article class="product-card ${opts.className || ''}" data-reveal>
    <a class="product-media" href="${href}" aria-label="${esc(p.brand)} ${esc(p.name)} detay">
      <img src="${img(p.cardImage || p.image)}" alt="${esc(p.brand)} ${esc(p.name)} ${esc(p.collection)} ${p.category === 'MDF & Panel' ? 'panel' : 'parke'}" loading="lazy">
      <span class="brand-badge ${brandClass(p.brand)}">${esc(brandShort(p.brand))}</span>
      ${p.code ? `<span class="product-code">${esc(p.code)}</span>` : ''}
      <span class="product-hover">Ürünü incele ${icon('arrowUp', 15)}</span>
    </a>
    <div class="product-body">
      <p class="product-collection">${esc(p.collection)}</p>
      <h3><a href="${href}">${esc(p.name)}</a></h3>
      <div class="product-specs">${chips}</div>
      <div class="product-foot">
        <span class="tone"><i style="--tone:${p.colorHex || '#b79b7a'}"></i>${esc(p.tone || 'Doğal')}</span>
        <span class="product-cta">Teklif al ${icon('arrow', 14)}</span>
      </div>
    </div>
  </article>`;
}

function collectionCard(c, opts = {}) {
  const href = opts.href || `/kategori/laminat-parke/?collection=${encodeURIComponent(c.name)}`;
  return `<a class="collection-card ${opts.className || ''}" href="${href}" data-reveal>
    <img src="${img(c.image)}" alt="${esc(c.name)} koleksiyonu" loading="lazy">
    <div class="collection-overlay">
      <span class="brand-badge ${brandClass(c.brand)}">${esc(brandShort(c.brand))}</span>
      <h3>${esc(c.name)}</h3>
      <p>${c.count} model ${icon('arrow', 15)}</p>
    </div>
  </a>`;
}

function breadcrumb(items) {
  return `<nav class="breadcrumb" aria-label="Sayfa yolu"><ol>${items.map((it, i) => {
    const last = i === items.length - 1;
    return `<li>${last ? `<span>${esc(it.label)}</span>` : `<a href="${it.href}">${esc(it.label)}</a>`}</li>`;
  }).join('')}</ol></nav>${ldScript(breadcrumbLd(items))}`;
}

function sectionHead(eyebrow, title, desc = '', opts = {}) {
  return `<div class="section-head ${opts.center ? 'is-center' : ''}">
    <div>
      <span class="eyebrow">${esc(eyebrow)}</span>
      <h2 data-split>${title}</h2>
    </div>
    ${desc ? `<div class="section-head-side" data-fade><p>${desc}</p></div>` : ''}
  </div>`;
}

function productJsonLd(p) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${p.brand} ${p.name}`,
    sku: p.code,
    brand: { '@type': 'Brand', name: p.brand },
    category: p.category,
    description: p.description,
    image: p.images.map(x => `${site.domain}/${x}`),
    url: `${site.domain}/${p.url}`,
    additionalProperty: Object.entries(p.specs || {}).map(([k, v]) => ({ '@type': 'PropertyValue', name: k, value: v })),
    potentialAction: {
      '@type': 'AskAction',
      name: 'Fiyat ve stok bilgisi için teklif alın',
      target: `${site.domain}/teklif/?urun=${encodeURIComponent(p.id)}`
    }
  });
}

module.exports = {
  ROOT, PUB, site, stats, paths, nav, icon, esc, img, logo, logoMark, brandClass, brandShort,
  header, footer, pageShell, productCard, collectionCard, breadcrumb, sectionHead, productJsonLd,
  IDS, OPENING, ADDRESS, ldScript, faqLd, breadcrumbLd, businessNode, websiteNode, stripTags,
  AREAS, loc, abl
};
