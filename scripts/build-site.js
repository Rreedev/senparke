/* =========================================================
   ŞENPARKE — site builder (part 1)
   Home · Laminat kategori · Mutfak · Markalar · Galeri
   ========================================================= */
const {
  site, stats, paths, icon, esc, pageShell
} = require('./lib');
const {
  products, write, byId, laminat, laminatCollections, mdf, mdfCollections,
  pageHero, homeCategoryCard, faqList, catalogPage, productCard, collectionCard
} = require('./build-helpers');
const { buildRest } = require('./build-pages-rest');

const coll = (name) => laminatCollections.find(c => c.name === name);
const productGrid = (list) => `<div class="product-grid">${list.map(productCard).join('')}</div>`;

const { homePage } = require('./build-home');

function sectionHeadRaw(eyebrow, title, desc = '', opts = {}) {
  const link = opts.link ? `<a class="text-link" href="${opts.link.href}">${opts.link.label} ${icon('arrow', 15)}</a>` : '';
  return `<div class="section-head">
    <div>
      <span class="eyebrow">${eyebrow}</span>
      <h2 data-split>${title}</h2>
    </div>
    <div class="section-head-side" data-fade>
      ${desc ? `<p>${desc}</p>` : ''}
      ${link}
    </div>
  </div>`;
}

/* ---------------------------------------------------------
   LAMINAT KATEGORİ
   --------------------------------------------------------- */
/* Round-robin by brand so the first page of the catalogue shows every maker */
function interleave(list, key) {
  const groups = new Map();
  list.forEach(p => { if (!groups.has(p[key])) groups.set(p[key], []); groups.get(p[key]).push(p); });
  const queues = [...groups.values()];
  const out = [];
  while (queues.some(q => q.length)) queues.forEach(q => { if (q.length) out.push(q.shift()); });
  return out;
}

function laminatPage() {
  const page = catalogPage({
    items: interleave(laminat, 'brand'),
    pathName: paths.laminat,
    active: 'Parke',
    title: `Laminat Parke Modelleri ve Montajı — ${stats.laminat} Model, Avcılar`,
    description: `AGT, Çamsan ve Yıldız Entegre laminat parke koleksiyonları: ${stats.laminat} model, ${stats.laminatCollections} seri. Marka, koleksiyon, renk tonu, desen ve kalınlığa göre filtreleyin; teklif alın.`,
    hero: {
      eyebrow: 'Laminat Parke',
      title: 'Laminat <em>Parke</em>',
      desc: `AGT, Çamsan ve Yıldız Entegre’nin laminat koleksiyonları: ${stats.laminat} model, ${stats.laminatCollections} seri; açık, orta ve koyu tonlarda ahşap ve taş dokular.`,
      img: '/images/agt/agt-concept-neo-latino-1.jpg',
      crumbs: [{ label: 'Laminat Parke' }],
      meta: [['Model', String(stats.laminat)], ['Koleksiyon', String(stats.laminatCollections)], ['Marka', 'AGT, Çamsan, Yıldız Entegre'], ['Kalınlık', '7,5–12 mm']]
    },
    strips: laminatCollections,
    seoTitle: 'Laminat parke <em>rehberi.</em>',
    seoText: `<p>Laminat parke; yüksek basınçlı dekoratif kağıt ve HDF gövdenin birleşimiyle üretilen, aşınmaya ve lekeye dayanıklı, kolay temizlenen bir zemin kaplamasıdır. Klik sistemli yapısı sayesinde montajı hızlıdır; yerden ısıtma sistemleriyle uyumludur.</p>
      <p>Şen Parke’de AGT’nin Effect, Mood, Pera ve Marco Polo serilerini, Çamsan’ın Klasik’ten Diamond ve Avangard’a uzanan serilerini ve Yıldız Entegre’nin TerraClick ve VarioClic sistemlerini bir arada sunuyoruz. Darbe sesi yalıtımlı kendinden şilteli modellerden 72 saate varan su dirençli serilere kadar her ihtiyaca uygun seçenek mevcut.</p>
      <p>Fiyatlar metrekare, seri ve montaj kapsamına göre değiştiği için sitede fiyat gösterilmez; keşif ve ölçü sonrası net teklif verilir.</p>`,
    faq: [
      ['Laminat parke nereye uygundur?', 'Salon, yatak odası, koridor ve çocuk odaları başta olmak üzere tüm iç mekânlara uygundur. Islak hacimlerde 72 saat su dirençli seriler önerilir; seçimini keşif sırasında birlikte yapıyoruz.'],
      ['Laminat parke suya dayanıklı mı?', 'Koleksiyonların büyük bölümü yağmur lekelerine ve kısa süreli sıvı temasına dayanıklıdır. Effect Aqua Block gibi seriler 72 saate varan su direnci sunar; ürün sayfalarındaki teknik detayları inceleyebilirsiniz.'],
      ['Montaj ne kadar sürer?', '100 m²’lik bir alan, süpürgelik ve geçiş profilleriyle birlikte genellikle 1–2 gün içinde tamamlanır. Ölçüye göre net takvimi teklifte paylaşıyoruz.'],
      ['Fiyatlar neden gösterilmiyor?', 'Fiyat; seri, metrekare, süpürgelik ve montaj kapsamına göre değişir. Ücretsiz keşif sonrası net ve yazılı teklif sunuyoruz.']
    ]
  });
  write('kategori/laminat-parke/index.html', pageShell(page));
}

/* ---------------------------------------------------------
   MDF & PANEL KATEGORİ (Yıldız Entegre)
   --------------------------------------------------------- */
function mdfPage() {
  if (!mdf.length) return;
  const heroShot = (mdf.find(p => /kapak-panel/.test(p.id) && /-render\.jpg$/.test(p.image)) || mdf.find(p => /-render\.jpg$/.test(p.image)) || mdf[0]).image;
  const page = catalogPage({
    items: interleave(mdf, 'collectionSlug'),
    pathName: paths.mdf,
    active: 'MDF & Panel',
    title: `MDF ve Panel — ${stats.mdf} Ürün`,
    description: `Yıldız Entegre MDF ve panel ürünleri: MDFlam / Suntalam, kapak panel, lak panel, boyalı panel ve kompakt lam panel. ${stats.mdf} dekor; renk, doku ve kalınlığa göre filtreleyin.`,
    hero: {
      eyebrow: 'MDF & Panel',
      title: 'MDF ve <em>Panel</em>',
      desc: 'Yıldız Entegre’nin MDFlam / Suntalam, kapak, lak, boyalı ve kompakt panelleri. Dolap kapağından mobilyaya, duvar kaplamasına kadar iç mekânın her yüzeyi için.',
      img: '/' + String(heroShot || '').replace(/^\//, ''),
      crumbs: [{ label: 'MDF & Panel' }],
      meta: [['Ürün', String(stats.mdf)], ['Seri', String(stats.mdfCollections)], ['Marka', 'Yıldız Entegre'], ['Kalınlık', '8–25 mm']]
    },
    strips: mdfCollections,
    seoTitle: 'MDF ve panel <em>rehberi.</em>',
    seoText: `<p><strong>MDFlam / Suntalam</strong>, melamin kaplı MDF ya da yonga levhadır; dolap gövdesi ve mobilyada en yaygın kullanılan paneldir. <strong>Kapak panel</strong> mat, parlak ve dokulu yüzeyleriyle dolap kapaklarına özel üretilir. <strong>Lak panel</strong> Super Gloss ve Superior Matt yüzeyleriyle lake görünümü verir.</p>
      <p>Boyalı panel ve kompakt yoğunluklu lam panel ise düz renklerde, kenar bandı ve diğer panellerle birlikte kombinlenebilir. Plaka ebatları ve kalınlıklar ürün sayfalarında yer alır; kesim, kenar bandı ve uygulama için bize danışın.</p>`,
    faq: [
      ['MDFlam ile kapak panel arasındaki fark nedir?', 'MDFlam gövde ve mobilya için genel amaçlı melamin kaplı paneldir. Kapak panel ise dolap kapağı için daha dayanıklı ve dekoratif yüzeylerle (mat, parlak, dokulu) üretilir.'],
      ['Panelleri ölçüye kestirebilir miyim?', 'Evet. Plaka olarak alabileceğiniz gibi, mutfak dolabı ve mobilya projelerinde kesim ve kenar bandıyla birlikte de çalışıyoruz.'],
      ['Numune görebilir miyim?', 'Avcılar’daki showroomumuzda dekor numunelerini inceleyebilirsiniz. Stok ve fiyat için bize ulaşın.']
    ]
  });
  write('kategori/mdf-panel/index.html', pageShell(page));
}

/* ---------------------------------------------------------
   MUTFAK DOLABI
   --------------------------------------------------------- */
function mutfakPage() {
  const body = `
  ${pageHero({
    eyebrow: 'Mutfak Dolabı',
    title: 'Mutfak <em>Dolabı</em>',
    desc: 'Ölçüden montaja mutfağınızın tamamı: gövde, kapak, tezgâh ve donanım tek elden. Zeminle bütünlüklü, doğru malzeme ve doğru işçilikle.',
    img: '/images/site/kitchen-2.jpg',
    crumbs: [{ label: 'Mutfak Dolabı' }],
    meta: [['Üretim', 'Ölçüye özel'], ['Stiller', 'Modern · Klasik · Ahşap'], ['Teslim', 'Montaj dahil']]
  })}

  <section class="section container" id="stiller">
    ${sectionHeadRaw('Stiller', 'Üç çizgi,<br><em>tek ölçü.</em>', 'Mutfanızın mimarisine ve sizin kullanım alışkanlığınıza göre stili birlikte belirliyoruz.')}
    <div class="style-grid">
      <div class="style-card">
        <img src="/images/site/kitchen-1.jpg" alt="Modern minimal mutfak" loading="lazy">
        <div class="style-card-content">
          <span class="style-num">01</span>
          <h3>Modern &amp; Minimal</h3>
          <p>Sade çizgiler, pürüzsüz kapaklar ve gizli tutamaçlar; küçük mekânlarda bile ferah mutfaklar.</p>
          <a class="text-link" href="${paths.teklif}?konu=mutfak">Teklif al ${icon('arrow', 14)}</a>
        </div>
      </div>
      <div class="style-card">
        <img src="/images/site/kitchen-2.jpg" alt="Doğal ahşap mutfak" loading="lazy">
        <div class="style-card-content">
          <span class="style-num">02</span>
          <h3>Doğal Ahşap</h3>
          <p>Ahşap dokulu kapaklar, sıcak tonlar ve doğal taş tezgâhlarla zamansız mutfaklar.</p>
          <a class="text-link" href="${paths.teklif}?konu=mutfak">Teklif al ${icon('arrow', 14)}</a>
        </div>
      </div>
      <div class="style-card">
        <img src="/images/site/kitchen-3.jpg" alt="Açık plan mutfak" loading="lazy">
        <div class="style-card-content">
          <span class="style-num">03</span>
          <h3>Açık Plan &amp; Ada</h3>
          <p>Yaşam alanıyla bütünleşen, adalı ve fonksiyonel mutfak çözümleri.</p>
          <a class="text-link" href="${paths.teklif}?konu=mutfak">Teklif al ${icon('arrow', 14)}</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section section-tint container" id="malzemeler">
    ${sectionHeadRaw('Malzemeler', 'Görünmeyen<br><em>kısım da bizim.</em>', 'Gövdeden tezgâha, tüm bileşenlerde kaliteli malzeme; alternatifleri ve farklarını açıkça anlatıyoruz.')}
    <div class="feature-grid">
      <div class="feature-item"><span class="feature-num">01</span>${icon('layers', 30)}<h3>Kapaklar</h3><p>Lake, akrilik, laminate ve doğal ahşap kaplama; mat veya parlak yüzey seçenekleri.</p></div>
      <div class="feature-item"><span class="feature-num">02</span>${icon('grid', 30)}<h3>Gövdeler</h3><p>Nem direnci yüksek suntalam ve MDF gövde seçenekleri.</p></div>
      <div class="feature-item"><span class="feature-num">03</span>${icon('ruler', 30)}<h3>Tezgâhlar</h3><p>Kuvars, granit, kompozit ve laminat tezgâh alternatifleri.</p></div>
      <div class="feature-item"><span class="feature-num">04</span>${icon('shield', 30)}<h3>Donanım</h3><p>Yavaş kapanan menteşe ve ray sistemleri; marka tercihi size ait.</p></div>
    </div>
  </section>

  <section class="section section-forest container" id="surec">
    ${sectionHeadRaw('Süreç', 'Keşiften anahtara<br><em>teslime.</em>', 'Mutfak bir üründen çok bir projedir; adımları birlikte yürüyoruz.')}
    <div class="process-grid">
      <div class="process-item"><h3>Keşif &amp; Ölçü</h3><p>Mutfanızın ölçülerini alıyor, tesisat ve kullanım ihtiyaçlarını netleştiriyoruz.</p></div>
      <div class="process-item"><h3>Proje &amp; Seçim</h3><p>Kapak, tezgâh ve donanım seçimleriyle birlikte mutfak yerleşimini planlıyoruz.</p></div>
      <div class="process-item"><h3>Üretim</h3><p>Ölçüye özel üretim takip ediliyor; varsa söküm ve tesisat koordinasyonu yapılıyor.</p></div>
      <div class="process-item"><h3>Montaj</h3><p>Montaj, tezgâh ölçüsü ve teslimat tek elden; temiz kullanıma hazır teslim.</p></div>
    </div>
  </section>

  <section class="section container">
    ${sectionHeadRaw('Referans Görseller', 'İlham alın,<br><em>ölçüyü bize bırakın.</em>', 'Görseller stil referansıdır; kendi mutfağınız keşif sonrası projelendirilir.')}
    <div class="photo-grid">
      <figure><img src="/images/site/kitchen-1.jpg" alt="Beyaz modern mutfak" loading="lazy"><figcaption>Modern &amp; Minimal</figcaption></figure>
      <figure><img src="/images/site/kitchen-2.jpg" alt="Ahşap mutfak" loading="lazy"><figcaption>Doğal Ahşap</figcaption></figure>
      <figure><img src="/images/site/kitchen-3.jpg" alt="Açık plan mutfak" loading="lazy"><figcaption>Açık Plan</figcaption></figure>
    </div>
  </section>

  <section class="section section-tint container">
    <div class="catalog-seo">
      <div>
        <span class="eyebrow">Merak Edilenler</span>
        <h2>Sık sorulan <em>sorular.</em></h2>
      </div>
      <div>
        ${faqList([
          ['Mutfak dolabı fiyatları nasıl belirlenir?', 'Fiyat; metrekare, kapak ve tezgâh malzemesi, donanım seçimi ve söküm-montaj kapsamına göre belirlenir. Keşif sonrası kalem kalem yazılı teklif sunuyoruz.'],
          ['Teslim ne kadar sürer?', 'Onay sonrası üretim ve montaj genellikle 3–6 hafta içinde tamamlanır; net takvim teklifte belirtilir.'],
          ['Eski mutfak sökülür mü?', 'Evet. Gerekli söküm, çıkış malzemesinin uzaklaştırılması ve tesisat koordinasyonu dahilinde yürütülür.'],
          ['Parke ile birlikte düşünebilir miyim?', 'Evet — zemin ve mutfak aynı keşifte planlanırsa süpürgelik, geçiş profili ve tezgâh kotu sorunsuz hizalanır.']
        ])}
      </div>
    </div>
  </section>

  <section class="cta-band">
    <div class="container cta-band-inner">
      <div>
        <span class="eyebrow light">Ücretsiz keşif</span>
        <h2>Mutfağınızı <em>konuşalım.</em></h2>
        <p>Ölçü ve ihtiyaçlarınız için bizi arayın ya da keşif formunu doldurun.</p>
      </div>
      <div class="cta-band-actions">
        <a class="btn btn-light" href="${paths.teklif}?konu=mutfak">Keşif Talebi ${icon('arrow', 15)}</a>
        <a class="btn btn-outline-light" href="tel:${site.phoneHref}">${site.phoneName}: ${site.phone}</a>
      </div>
    </div>
  </section>`;

  write('mutfak-dolabi/index.html', pageShell({
    title: 'Mutfak Dolabı — Ölçüye Özel Mutfaklar',
    description: 'Şenparke mutfak dolabı: modern, klasik ve doğal ahşap mutfaklar; gövde, kapak, tezgâh ve montaj dahil, ölçüye özel üretim. Ücretsiz keşif.',
    pathName: paths.mutfak,
    active: 'Mutfak',
    body
  }));
}

/* ---------------------------------------------------------
   MARKALAR
   --------------------------------------------------------- */
function markalarPage() {
  const shot = (brand, coll) => '/' + String((products.find(p => p.brand === brand && (!coll || p.collection === coll)) || {}).image || '').replace(/^\//, '');
  const camsanColls = [...new Set(laminat.filter(p => p.brand === 'Çamsan').map(p => p.collection))];
  const body = `
  ${pageHero({
    eyebrow: 'Markalarımız',
    title: 'Güvenilir <em>üreticiler.</em>',
    desc: 'Laminat parkede Türkiye’nin önde gelen üç üreticisinin koleksiyonlarını ve Yıldız Entegre MDF panellerini Avcılar’daki showroomumuzda buluşturuyoruz.',
    img: '/images/agt/agt-pera-icon-erguvan-1.jpg',
    crumbs: [{ label: 'Markalar' }],
    meta: [['Marka', 'AGT, Çamsan, Yıldız Entegre'], ['Laminat model', String(stats.laminat)], ['Koleksiyon', String(stats.laminatCollections)], ['MDF ve panel', String(stats.mdf)]]
  })}

  <section class="container" style="padding-bottom:24px">
    <div class="brand-block" id="agt">
      <div class="brand-block-media"><img src="/images/agt/agt-mood-xlarge-mare-1.jpg" alt="AGT laminat parke uygulaması" loading="lazy"></div>
      <div class="brand-block-copy">
        <span class="brand-word">AGT<small>Laminat parke</small></span>
        <h2>Suya dayanıklı seriler ve <em>geniş ebatlar.</em></h2>
        <p>AGT’nin Effect, Mood, Pera, Marco Polo, Yoga, Natura ve Concept serileri; 72 saate varan su dirençli yapıları, kendinden şilteli darbe sesi yalıtımı ve gerçek ahşap dokusuyla öne çıkar.</p>
        <div class="brand-meta">
          <div><strong>${stats.agt.models}</strong><span>Model</span></div>
          <div><strong>${stats.agt.collections}</strong><span>Koleksiyon</span></div>
          <div><strong>8–12</strong><span>mm kalınlık</span></div>
        </div>
        <div class="brand-links">
          <a href="${paths.laminat}?brand=AGT">Tüm AGT modelleri</a>
          <a href="${paths.laminat}?collection=Mood+XLarge">Mood XLarge</a>
          <a href="${paths.laminat}?collection=Effect+Aqua+Block">Effect Aqua Block</a>
          <a href="${paths.laminat}?collection=Pera+Icon">Pera Icon</a>
          <a href="${paths.laminat}?collection=Marco+Polo+Premium">Marco Polo Premium</a>
        </div>
      </div>
    </div>

    <div class="brand-block reverse" id="camsan">
      <div class="brand-block-media"><img src="${shot('Çamsan', 'Diamond Seri')}" alt="Çamsan laminat parke uygulaması" loading="lazy"></div>
      <div class="brand-block-copy">
        <span class="brand-word">ÇAMSAN<small>Laminat parke</small></span>
        <h2>Klasik’ten Avangard’a <em>geniş seri yelpazesi.</em></h2>
        <p>Çamsan Entegre’nin laminat parkeleri; Klasik, Silver, Platinum, Diamond, Modern ve Avangard serilerinde derzli ve derzsiz seçenekler, alttan ısıtmaya uygun ve çizilmeye dayanıklı yüzeyler sunar.</p>
        <div class="brand-meta">
          <div><strong>${stats.camsan.models}</strong><span>Model</span></div>
          <div><strong>${stats.camsan.collections}</strong><span>Seri</span></div>
          <div><strong>AC3–AC5</strong><span>Yüzey dayanımı</span></div>
        </div>
        <div class="brand-links">
          <a href="${paths.laminat}?brand=%C3%87amsan">Tüm Çamsan modelleri</a>
          ${camsanColls.slice(0, 5).map(c => `<a href="${paths.laminat}?collection=${encodeURIComponent(c)}">${esc(c)}</a>`).join('')}
        </div>
      </div>
    </div>

    <div class="brand-block" id="yildiz">
      <div class="brand-block-media"><img src="/images/yildiz/T_01S-1.jpg" alt="Yıldız Entegre laminat parke uygulaması" loading="lazy"></div>
      <div class="brand-block-copy">
        <span class="brand-word">YILDIZ ENTEGRE<small>Laminat parke, MDF ve panel</small></span>
        <h2>Klik sistemli parkeler ve <em>MDF paneller.</em></h2>
        <p>Yıldız Entegre; TerraClick ve VarioClic klik sistemlerinde geniş bir renk ve doku yelpazesi sunar. MDFlam / Suntalam, kapak panel, lak panel ve boyalı panel serileriyle mobilya ve dolap kapağı için de tam bir yüzey kataloğu sağlar.</p>
        <div class="brand-meta">
          <div><strong>${stats.yildiz.models}</strong><span>Laminat model</span></div>
          <div><strong>${stats.mdf}</strong><span>MDF ve panel</span></div>
          <div><strong>${stats.yildiz.collections + stats.mdfCollections}</strong><span>Seri</span></div>
        </div>
        <div class="brand-links">
          <a href="${paths.laminat}?brand=Y%C4%B1ld%C4%B1z+Entegre">Laminat parkeler</a>
          <a href="${paths.mdf}">MDF ve paneller</a>
          <a href="${paths.laminat}?collection=TerraClick+8+mm">TerraClick 8 mm</a>
          <a href="${paths.laminat}?collection=Exclusive+5G">Exclusive 5G</a>
          <a href="${paths.mdf}?collection=MDFlam+%2F+Suntalam">MDFlam / Suntalam</a>
        </div>
      </div>
    </div>
    <p class="small-note" style="padding:18px 0 8px">Not: Marka ve ürün içerikleri üretici kataloglarından derlenmiştir; yetkili satış ve görsel kullanım izinleri yayın öncesinde teyit edilir.</p>
  </section>`;

  write('markalar/index.html', pageShell({
    title: 'Markalar — AGT, Çamsan ve Yıldız Entegre',
    description: `Şen Parke markaları: AGT (${stats.agt.models} model), Çamsan (${stats.camsan.models} model) ve Yıldız Entegre (${stats.yildiz.models} laminat, ${stats.mdf} MDF ve panel). Avcılar showroomunda numuneler ve teklif.`,
    pathName: paths.markalar,
    active: 'Markalar',
    body
  }));
}

/* ---------------------------------------------------------
   GALERİ
   --------------------------------------------------------- */
function galeriPage() {
  /* Real photos of the Avcılar shop, showroom and depot come first */
  const real = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', 'public', 'data', 'showroom.json'), 'utf8'))
    .map(s => ({ src: s.src, cat: s.cat === 'depo' ? 'depo' : 'showroom', cap: s.cap }));
  const inspiration = [
    ['/images/site/kitchen-1.jpg', 'Mutfak fikri'],
    ['/images/site/kitchen-2.jpg', 'Ahşap mutfak fikri'],
    ['/images/site/kitchen-3.jpg', 'Açık plan mutfak fikri'],
    ['/images/site/interior-2.jpg', 'Oturma alanı fikri'],
    ['/images/site/interior-3.jpg', 'Parke ve mobilya fikri'],
    ['/images/site/interior-5.jpg', 'Yatak odası fikri']
  ].map(([src, cap]) => ({ src, cat: 'ilham', cap }));
  const items = [...real, ...inspiration];

  const body = `
  ${pageHero({
    eyebrow: 'Galeri',
    title: 'Avcılar’dan <em>kareler.</em>',
    desc: 'Mağazamız, showroomumuz ve 1000 m² ana depomuz; fotoğraflar mekânın kendisi. Altta, mekânınız için ilham verecek örnekler.',
    img: '/images/showroom/showroom-genel.jpg',
    alt: 'Şen Parke Avcılar showroomu',
    crumbs: [{ label: 'Galeri' }]
  })}
  <section class="section container">
    <div class="gallery-filters">
      <button class="is-active" type="button" data-gallery-filter="all">Tümü</button>
      <button type="button" data-gallery-filter="showroom">Mağaza ve showroom</button>
      <button type="button" data-gallery-filter="depo">Depo</button>
      <button type="button" data-gallery-filter="ilham">İlham</button>
    </div>
    <div class="gallery-grid auto-span" data-gallery>
      ${items.map(it => `<button class="gallery-item" type="button" data-category="${it.cat}">
        <img src="${it.src}" alt="${esc(it.cap)}" loading="lazy">
        <span>${esc(it.cap)}</span>
      </button>`).join('')}
    </div>
  </section>
  <section class="cta-band">
    <div class="container cta-band-inner">
      <div>
        <span class="eyebrow light">Sıra sizde</span>
        <h2>Bir sonraki uygulama <em>sizin mekânınız.</em></h2>
        <p>Ücretsiz keşif için bizi arayın ya da formu doldurun.</p>
      </div>
      <div class="cta-band-actions">
        <a class="btn btn-light" href="${paths.teklif}">Ücretsiz Keşif ${icon('arrow', 15)}</a>
        <a class="btn btn-outline-light" href="tel:${site.phoneHref}">${site.phoneName}: ${site.phone}</a>
      </div>
    </div>
  </section>`;

  write('galeri/index.html', pageShell({
    title: 'Galeri — Avcılar Showroom ve Depo',
    description: 'Şen Parke Avcılar mağaza, showroom ve 1000 m² ana depo fotoğrafları; laminat parke, MDF ve mutfak için ilham veren mekânlar.',
    pathName: paths.galeri,
    active: 'Galeri',
    body
  }));
}

/* ---------------------------------------------------------
   RUN
   --------------------------------------------------------- */
/* vendor scripts (gsap, ScrollTrigger, lenis) are served locally */
const fs = require('fs');
const pathMod = require('path');
const vendorDir = pathMod.join(__dirname, '..', 'public', 'assets', 'vendor');
fs.mkdirSync(vendorDir, { recursive: true });
[['gsap/dist/gsap.min.js', 'gsap.min.js'], ['gsap/dist/ScrollTrigger.min.js', 'ScrollTrigger.min.js'], ['lenis/dist/lenis.min.js', 'lenis.min.js']]
  .forEach(([from, to]) => fs.copyFileSync(require.resolve(from), pathMod.join(vendorDir, to)));

homePage();
laminatPage();
mdfPage();
mutfakPage();
markalarPage();
galeriPage();
buildRest();

/* Local parke pages + Taha Şen Yapı sub-site, appended to the sitemap */
const { buildParkeAreas } = require('./build-parke-bolgeler');
const parkePaths = buildParkeAreas();
console.log(`Parke bölge sayfaları: ${parkePaths.length}`);
const { buildYapi } = require('./build-yapi');
const yapiPaths = buildYapi();
const smPath = pathMod.join(__dirname, '..', 'public', 'sitemap.xml');
const today = new Date().toISOString().slice(0, 10);
const extra = [...parkePaths, ...yapiPaths].map(p => `  <url>\n    <loc>${site.domain}${p}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${p === '/yapi/' ? '0.9' : '0.8'}</priority>\n  </url>`).join('\n');
fs.writeFileSync(smPath, fs.readFileSync(smPath, 'utf8').replace('</urlset>', extra + '\n</urlset>'));
console.log(`Taha Şen Yapı: ${yapiPaths.length} sayfa`);

/* Moved URLs. GitHub Pages has no server-side 301, so each old path gets a tiny page with a
   canonical link, noindex and an instant meta refresh: Google treats this as a redirect. */
const REDIRECTS = {
  '/parke/gulpinar/': '/parke/gurpinar/',
  '/yapi/bolgeler/gulpinar/': '/yapi/bolgeler/gurpinar/'
};
Object.entries(REDIRECTS).forEach(([from, to]) => {
  const file = pathMod.join(__dirname, '..', 'public', from, 'index.html');
  fs.mkdirSync(pathMod.dirname(file), { recursive: true });
  fs.writeFileSync(file, `<!doctype html>
<html lang="tr"><head><meta charset="utf-8">
<title>Taşındı</title>
<link rel="canonical" href="${site.domain}${to}">
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=${to}">
<script>location.replace(${JSON.stringify(to)} + location.search + location.hash);</script>
</head><body><p>Bu sayfa taşındı: <a href="${to}">${site.domain}${to}</a></p></body></html>
`);
});

/* Web app manifests (install prompt, home-screen icon, theme colour in mobile search) */
const manifest = (o) => JSON.stringify(Object.assign({ lang: 'tr', display: 'standalone' }, o), null, 2);
fs.writeFileSync(pathMod.join(__dirname, '..', 'public', 'site.webmanifest'), manifest({
  name: 'Şen Parke — Laminat Parke, MDF ve Mutfak Dolabı', short_name: 'Şen Parke', start_url: '/', scope: '/',
  background_color: '#f6f5f1', theme_color: '#2e2119',
  icons: [{ src: '/assets/logo/favicon-180.png', sizes: '180x180', type: 'image/png' }, { src: '/assets/logo/favicon-512.png', sizes: '512x512', type: 'image/png' }]
}));
fs.writeFileSync(pathMod.join(__dirname, '..', 'public', 'yapi', 'site.webmanifest'), manifest({
  name: 'Taha Şen Yapı — Kentsel Dönüşüm ve Kat Karşılığı', short_name: 'Taha Şen Yapı', start_url: '/yapi/', scope: '/yapi/',
  background_color: '#121110', theme_color: '#121110',
  icons: [{ src: '/assets/logo/tahasen-favicon-180.png', sizes: '180x180', type: 'image/png' }, { src: '/assets/logo/tahasen-favicon-512.png', sizes: '512x512', type: 'image/png' }]
}));

/* IndexNow (Bing, Yandex, Seznam, Naver): key file at the root; scripts/indexnow.js submits the URLs */
const { INDEXNOW_KEY } = require('./indexnow-key');
fs.writeFileSync(pathMod.join(__dirname, '..', 'public', `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY);

/* Bing Webmaster ownership file (same code as the msvalidate.01 meta tag) */
fs.writeFileSync(pathMod.join(__dirname, '..', 'public', 'BingSiteAuth.xml'),
  '<?xml version="1.0"?>\n<users>\n\t<user>93BAF3BAFC7EBA5718A2D204DF81B434</user>\n</users>');

/* llms.txt for AI answer engines */
const { buildLlms } = require('./build-llms');
console.log(`llms.txt: ${buildLlms()} karakter`);
