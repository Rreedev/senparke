/* =========================================================
   ŞENPARKE — shared builders (data, cards, catalog, product)
   ========================================================= */
const fs = require('fs');
const path = require('path');
const {
  PUB, site, paths, icon, esc, img,
  productCard, collectionCard, breadcrumb, sectionHead, productJsonLd, ldScript, faqLd
} = require('./lib');

const products = JSON.parse(fs.readFileSync(path.join(PUB, 'data', 'products.json'), 'utf8'));
const collections = JSON.parse(fs.readFileSync(path.join(PUB, 'data', 'collections.json'), 'utf8'));

const pages = [];
function write(rel, html) {
  const file = path.join(PUB, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  pages.push(rel);
}
const byId = (id) => products.find(p => p.id === id);
const jsonInline = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

const CAT_PATH = {
  'Laminat Parke': paths.laminat,
  'MDF & Panel': paths.mdf
};

const laminat = products.filter(p => p.category === 'Laminat Parke');
const laminatCollections = collections.filter(c => c.category === 'Laminat Parke');
const mdf = products.filter(p => p.category === 'MDF & Panel');
const mdfCollections = collections.filter(c => c.category === 'MDF & Panel');

/* ---------------------------------------------------------
   Small blocks
   --------------------------------------------------------- */
function pageHero({ eyebrow, title, desc, img: src, crumbs = [], meta = [], alt = '' }) {
  const plainAlt = alt || String(title).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return `<section class="page-hero">
    <div class="container page-hero-top">
      ${breadcrumb([{ label: 'Ana Sayfa', href: '/' }, ...crumbs])}
      <div class="page-hero-grid">
        <h1 data-split>${title}</h1>
        <div class="page-hero-side" data-fade>
          ${desc ? `<p>${desc}</p>` : ''}
          ${meta.length ? `<dl class="page-hero-meta">${meta.map(m => `<div><dt>${esc(m[0])}</dt><dd>${esc(m[1])}</dd></div>`).join('')}</dl>` : ''}
        </div>
      </div>
    </div>
    <div class="page-hero-media" data-clip><img src="${src}" alt="${esc(plainAlt)}" fetchpriority="high" data-parallax="12"></div>
  </section>`;
}

function homeCategoryCard({ kicker, title, desc, img: src, href }) {
  return `<a class="category-card" href="${href}">
    <img src="${src}" alt="${esc(title)}" loading="lazy">
    <span class="category-kicker">${esc(kicker)}</span>
    <h3>${esc(title)}</h3>
    <p>${esc(desc)}</p>
    <span class="category-link">Keşfet ${icon('arrowUp', 14)}</span>
  </a>`;
}

function faqList(items) {
  return `<div class="faq-list">${items.map(([q, a]) => `
    <details class="faq-item">
      <summary>${esc(q)} ${icon('plus', 18)}</summary>
      <p>${a}</p>
    </details>`).join('')}</div>${ldScript(faqLd(items))}`;
}

/* ---------------------------------------------------------
   Catalog page (client-side filters)
   --------------------------------------------------------- */
function filterOptions(items, key) {
  const map = new Map();
  items.forEach(p => {
    const v = String(p[key] || '').trim();
    if (!v) return;
    map.set(v, (map.get(v) || 0) + 1);
  });
  return [...map.entries()];
}

function checkGroup(name, label, options, open = true) {
  if (!options.length) return '';
  return `<details class="filter-group" ${open ? 'open' : ''}>
    <summary>${esc(label)} ${icon('chevronDown', 14)}</summary>
    <div class="filter-list">
      ${options.map(([value, count]) => `
      <label class="filter-check"><input type="checkbox" data-filter="${esc(name)}" value="${esc(value)}"><span>${esc(value)}</span><em>${count}</em></label>`).join('')}
    </div>
  </details>`;
}

function swatchGroup(name, label, options) {
  if (!options.length) return '';
  return `<details class="filter-group" open>
    <summary>${esc(label)} ${icon('chevronDown', 14)}</summary>
    <div class="filter-swatches">
      ${options.map(([value, count]) => `
      <label class="filter-swatch"><input type="checkbox" data-filter="${esc(name)}" value="${esc(value)}"><i style="--sw:${toneHex(value)}"></i>${esc(value)} <em>${count}</em></label>`).join('')}
    </div>
  </details>`;
}

function toneHex(tone) {
  return tone === 'Açık' ? '#e8dcc8' : tone === 'Koyu' ? '#5d4a38' : '#b79b7a';
}

function catalogPage({ items, hero, strips = [], seoTitle, seoText, faq = [], pathName, active = 'Parke', title, description }) {
  const catalogData = items.map(p => ({
    id: p.id, name: p.name, code: p.code, brand: p.brand, category: p.category,
    collection: p.collection, collectionSlug: p.collectionSlug, tone: p.tone,
    colorHex: p.colorHex, decor: p.decor, thickness: p.thickness, size: p.size,
    surface: p.surface, joint: p.joint, image: p.cardImage || p.image,
    url: p.url, tags: (p.tags || []).slice(0, 4)
  }));

  const brandOpts = filterOptions(items, 'brand');
  const collOpts = filterOptions(items, 'collection').sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'tr'));
  const toneOpts = filterOptions(items, 'tone');
  const decorOpts = filterOptions(items, 'decor');
  const thickOpts = filterOptions(items, 'thickness').sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
  const jointOpts = filterOptions(items, 'joint');

  const initial = items.slice(0, 12).map(productCard).join('');

  const filtersHtml = `<aside class="filters" id="catalogFilters" aria-label="Ürün filtreleri" data-lenis-prevent>
    <div class="filter-head">
      <strong>Filtreler</strong>
      <button id="filterClose" class="filter-close" type="button">Kapat ×</button>
    </div>
    ${checkGroup('brand', 'Marka', brandOpts)}
    <details class="filter-group" open>
      <summary>Koleksiyon ${icon('chevronDown', 14)}</summary>
      <div class="filter-search">${icon('search', 15)}<input type="search" id="collectionSearch" placeholder="Koleksiyon ara…" autocomplete="off"></div>
      <div class="filter-list">
        ${collOpts.map(([value, count]) => `
        <label class="filter-check"><input type="checkbox" data-filter="collection" value="${esc(value)}"><span>${esc(value)}</span><em>${count}</em></label>`).join('')}
      </div>
    </details>
    ${swatchGroup('tone', 'Renk Tonu', toneOpts)}
    ${checkGroup('decor', 'Desen', decorOpts, false)}
    ${checkGroup('thickness', 'Kalınlık', thickOpts, false)}
    ${checkGroup('joint', 'Kenar', jointOpts, false)}
  </aside>`;

  const body = `
  ${pageHero(hero)}
  ${strips.length ? `<div class="catalog-top container">
    <div class="collection-strip">${strips.map(c => collectionCard(c, { href: `${pathName}?collection=${encodeURIComponent(c.name)}` })).join('')}</div>
    <p class="collection-note">${icon('grid', 15)} Koleksiyon kartına tıklayarak o serinin modellerini filtreleyebilirsiniz.</p>
  </div>` : ''}
  <section class="catalog-section container" data-catalog>
    <script type="application/json" id="catalogData">${jsonInline(catalogData)}</script>
    <div class="catalog-layout">
      ${filtersHtml}
      <div class="catalog-main">
        <div class="catalog-toolbar">
          <p class="catalog-count" id="catalogCount"><strong>${items.length}</strong> ürün</p>
          <div class="catalog-tools">
            <button id="filterOpen" class="filter-open btn btn-outline btn-sm" type="button" aria-expanded="false">Filtreler ${icon('filters', 15)}</button>
            <div class="sort-select">
              <select id="sortSelect" aria-label="Sıralama">
                <option value="featured">Sıralama: Öne çıkanlar</option>
                <option value="name-asc">İsim (A–Z)</option>
                <option value="name-desc">İsim (Z–A)</option>
                <option value="brand">Marka</option>
                <option value="code">Ürün kodu</option>
              </select>
              ${icon('chevronDown', 14)}
            </div>
          </div>
        </div>
        <div class="active-filters" id="activeFilters"></div>
        <div class="catalog-grid product-grid" id="catalogGrid">${initial}</div>
        <div class="no-results" id="catalogEmpty">
          <h3>Sonuç bulunamadı</h3>
          <p>Seçtiğiniz filtrelerle eşleşen ürün yok. Filtreleri temizleyip tekrar deneyin.</p>
          <a class="btn btn-outline btn-sm" href="${pathName}">Filtreleri sıfırla</a>
        </div>
        <div class="load-more-wrap">
          <button class="btn btn-outline" id="loadMore" type="button" hidden>Daha fazla göster ${icon('arrow', 15)}</button>
          <div class="load-progress" id="loadProgress"><span></span></div>
          <p><span id="loadInfo">${Math.min(12, items.length)} / ${items.length} ürün gösteriliyor</span></p>
        </div>
      </div>
    </div>
  </section>
  ${faq.length || seoText ? `<section class="section container">
    <div class="catalog-seo">
      <div>
        <span class="eyebrow">Rehber</span>
        <h2>${seoTitle}</h2>
      </div>
      <div>
        ${seoText}
        ${faq.length ? faqList(faq) : ''}
      </div>
    </div>
  </section>` : ''}`;

  return { body, title, description, pathName, active };
}

/* ---------------------------------------------------------
   Product detail page
   --------------------------------------------------------- */
function productPage(p) {
  const catHref = CAT_PATH[p.category] || paths.laminat;
  const gallery = [p.cardImage || p.image, ...p.images.filter(i => i !== (p.cardImage || p.image))].filter(Boolean);
  const waText = encodeURIComponent(`Merhaba, ${p.brand} ${p.name} (${p.code || p.collection}) ürünü hakkında fiyat ve stok bilgisi almak istiyorum.`);

  const related = [
    ...products.filter(x => x.id !== p.id && x.collection === p.collection),
    ...products.filter(x => x.id !== p.id && x.brand === p.brand && x.collection !== p.collection)
  ].slice(0, 4);

  const keySpecs = [
    ['Kalınlık', p.thickness || p.specs['Kalınlık']],
    ['Ebat', p.size || p.specs['Ebat']],
    ['Yüzey', p.specs['Yüzey'] || p.surface],
    ['Paket', p.package || p.specs['Paket'] || p.specs['Paket (m2)']]
  ].filter(s => s[1]);

  const specRows = Object.entries(p.specs || {});
  const tags = (p.tags || []).filter(Boolean);

  const body = `
  <div class="product-page container">
    ${breadcrumb([
      { label: 'Ana Sayfa', href: '/' },
      { label: p.category, href: catHref },
      { label: p.collection, href: `${catHref}?collection=${encodeURIComponent(p.collection)}` },
      { label: p.name }
    ])}
    <div class="product-hero">
      <div class="product-gallery">
        <div class="gallery-main" data-gallery='${jsonInline(gallery.map(g => '/' + g.replace(/^\//, '')))}'>
          <img src="/${gallery[0].replace(/^\//, '')}" alt="${esc(p.brand)} ${esc(p.name)} ${esc(p.collection)} parke" id="productMainImg">
          <span class="zoom-hint">Büyüt ${icon('plus', 13)}</span>
        </div>
        ${gallery.length > 1 ? `<div class="gallery-thumbs">
          ${gallery.map((g, i) => `<button class="gallery-thumb ${i === 0 ? 'is-active' : ''}" type="button" aria-label="Görsel ${i + 1}"><img src="/${g.replace(/^\//, '')}" alt="" loading="lazy"></button>`).join('')}
        </div>` : ''}
      </div>
      <div class="product-info">
        <div class="product-brand-row">
          <span class="brand-badge ${p.brand === 'AGT' ? 'brand-agt' : p.brand === 'Yıldız Entegre' ? 'brand-yildiz' : 'brand-senfloor'}">${esc(p.brand)}</span>
          <span>${esc(p.collection)} · ${esc(p.category)}</span>
        </div>
        <h1>${esc(p.name)}</h1>
        <p class="product-code-line">${p.code ? `Ürün kodu: <strong>${esc(p.code)}</strong>` : esc(p.collection)} · Renk tonu: <strong>${esc(p.tone)}</strong></p>
        <p class="product-lead">${esc(p.shortDescription || p.description || `${p.brand} ${p.collection} koleksiyonundan ${p.name}.`)}</p>
        ${keySpecs.length ? `<div class="key-specs">
          ${keySpecs.map(([k, v]) => `<div class="key-spec"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('')}
        </div>` : ''}
        <div class="product-actions">
          <a class="btn btn-primary" href="/teklif/?urun=${encodeURIComponent(p.id)}">Teklif Al ${icon('arrow', 15)}</a>
          <a class="btn btn-outline" href="https://wa.me/${site.waNumber}?text=${waText}" target="_blank" rel="noopener">${icon('whatsapp', 16)} WhatsApp</a>
        </div>
        <ul class="product-assurance">
          <li>${icon('check', 16)} Ücretsiz keşif ve ölçü hizmeti</li>
          <li>${icon('check', 16)} İstanbul içi teslim ve montaj</li>
          <li>${icon('check', 16)} Showroomda numune inceleme</li>
          <li>${icon('check', 16)} Fiyat ve stok için hızlı teklif</li>
        </ul>
      </div>
    </div>
    <div class="product-tabs">
      <div class="tab-nav" role="tablist">
        <button class="tab-btn is-active" type="button" data-tab="tab-desc" role="tab" aria-selected="true">Açıklama</button>
        <button class="tab-btn" type="button" data-tab="tab-spec" role="tab" aria-selected="false">Teknik Özellikler</button>
        ${tags.length ? `<button class="tab-btn" type="button" data-tab="tab-tags" role="tab" aria-selected="false">Öne Çıkanlar</button>` : ''}
      </div>
      <div class="tab-panel is-active" id="tab-desc" role="tabpanel">
        <h3>Ürün hakkında</h3>
        <p>${esc(p.description || p.shortDescription || '')}</p>
        <p class="small-note">Ürün bilgileri üretici kataloglarından derlenmiştir; ölçü ve stok bilgisi için teklif talep edin.</p>
      </div>
      <div class="tab-panel" id="tab-spec" role="tabpanel">
        <h3>Teknik özellikler</h3>
        ${specRows.length ? `<div class="spec-table">
          ${specRows.map(([k, v]) => `<div class="spec-row"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('')}
        </div>` : '<p>Bu ürün için detaylı teknik bilgi için bize ulaşın.</p>'}
      </div>
      ${tags.length ? `<div class="tab-panel" id="tab-tags" role="tabpanel">
        <h3>Öne çıkan özellikler</h3>
        <div class="tag-list">${tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
      </div>` : ''}
    </div>
    ${related.length ? `<div class="related-section">
      ${sectionHead('Benzer Ürünler', 'Benzer <em>dokular.</em>', '', {})}
      <div class="product-grid">${related.map(productCard).join('')}</div>
    </div>` : ''}
  </div>`;

  return {
    body,
    title: `${p.brand} ${p.name} — ${p.collection}`,
    description: (p.shortDescription || p.description || `${p.brand} ${p.name}, ${p.collection} koleksiyonu ${p.category.toLowerCase()}`).slice(0, 300),
    pathName: '/' + p.url,
    active: 'Parke',
    extraHead: `<script type="application/ld+json">${productJsonLd(p).replace(/</g, '\\u003c')}</script>`,
    ogImage: '/' + gallery[0].replace(/^\//, '')
  };
}

module.exports = {
  products, collections, pages, write, byId, jsonInline, CAT_PATH,
  laminat, laminatCollections, mdf, mdfCollections, productCard, collectionCard,
  pageHero, homeCategoryCard, faqList, catalogPage, productPage
};
