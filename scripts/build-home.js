/* =========================================================
   ŞENPARKE — home page ("Döşeme")
   The floor lays itself, then pulls apart to reveal the room.
   ========================================================= */
const { site, stats, paths, icon, esc, pageShell, logoMark } = require('./lib');
const { write, products, laminat, laminatCollections, faqList } = require('./build-helpers');

/* Answer-first questions: the first sentence of every answer stands on its own,
   so search snippets and AI answer engines can quote it directly. */
const HOME_FAQ = () => [
  ['Şen Parke nerede, çalışma saatleri nedir?', `Şen Parke, ${site.address} adresindedir; showroom, ofis ve 1000 m² ana depo aynı binadadır. Hafta içi ve cumartesi 08:00–21:00 arası açığız, pazar kapalıyız.`],
  ['Hangi markaların laminat parkelerini satıyorsunuz?', `AGT, Çamsan ve Yıldız Entegre’nin toplam ${stats.laminat} laminat parke modelini satıyor ve monte ediyoruz. Yıldız Entegre’nin ${stats.mdf} MDF ve panel ürünü de kataloğumuzda.`],
  ['Keşif ve ölçü ücretli mi?', 'Hayır, İstanbul içinde keşif ve ölçü ücretsizdir. Mekânı yerinde görüp ölçüyü alıyor, ardından malzeme, süpürgelik ve işçiliği kalem kalem içeren yazılı teklif veriyoruz.'],
  ['Laminat parke fiyatı neye göre değişir?', 'Fiyat; seçilen marka ve seri, metrekare, süpürgelik ve geçiş profilleri ile montaj kapsamına göre değişir. Bu yüzden sitede fiyat yazmıyor, keşiften sonra net ve yazılı teklif veriyoruz.'],
  ['Parke montajını kim yapıyor, ne kadar sürer?', 'Montajı kendi ekibimiz yapıyor. 100 m²’lik bir alan, süpürgelik ve geçiş profilleriyle birlikte genellikle 1–2 günde tamamlanır.'],
  ['Parke ve mutfak dolabını birlikte yaptırabilir miyim?', 'Evet. Zemin ve mutfak aynı keşifte planlandığında süpürgelik, geçiş profili ve tezgâh kotu ilk seferde doğru hizalanır; ikisini tek ekiple, tek takvimle yürütüyoruz.'],
  ['Şen Parke ne zamandan beri faaliyette?', `Şen Parke ${site.since}’de ${site.founder} tarafından kuruldu; aile işletmesi olarak yaklaşık yarım asırdır İstanbul’da parke ve zemin işi yapıyor.`]
];

const coll = (name) => laminatCollections.find(c => c.name === name);
const url = (src) => '/' + String(src || '').replace(/^\//, '');

/* Deterministic pseudo-random so every build lays the same floor */
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/* Warm oak decors (rotated swatches from scripts/make-planks.js).
   One dominant tone with a few neighbours, like a real laid floor. */
const PLANK_TEXTURES = [
  'concept-neo-vieste', 'effect-premium-altay', 'concept-neo-moderna', 'natura-line-liva',
  'concept-neo-vieste', 'pera-icon-erguvan', 'effect-premium-solaro', 'concept-neo-moderna',
  'natura-line-liva', 'effect-premium-altay', 'concept-neo-scala', 'pera-icon-erguvan'
].map(n => `/images/planks/${n}.jpg`);

function floorRows(count = 9) {
  const rand = rng(1986);
  const widths = [38, 46, 54, 62];
  let t = 0;
  const rows = [];
  for (let r = 0; r < count; r++) {
    let x = -Math.round(rand() * 40) - 6;
    const planks = [];
    while (x < 104) {
      const w = widths[Math.floor(rand() * widths.length)];
      const tex = PLANK_TEXTURES[Math.floor(rand() * PLANK_TEXTURES.length)];
      const by = Math.round(rand() * 100);
      planks.push(`<span class="plank" style="left:${x}%;width:${w}%;background-image:url(${tex});background-position:50% ${by}%"></span>`);
      x += w;
      t++;
    }
    rows.push(`<div class="floor-row" data-dir="${r % 2 ? 1 : -1}">${planks.join('')}</div>`);
  }
  return rows.join('');
}

function thicknessOf(name) {
  const set = [...new Set(laminat.filter(p => p.collection === name).map(p => p.thickness).filter(t => /mm/.test(t) && parseFloat(t) < 20))];
  set.sort((a, b) => parseFloat(a.replace(',', '.')) - parseFloat(b.replace(',', '.')));
  if (!set.length) return '';
  return set.length === 1 ? set[0] : `${set[0].replace(' mm', '')}–${set[set.length - 1]}`;
}

function homePage() {
  const word = 'Şen Parke'.split('').map(ch => ch === ' '
    ? '<span class="ch ch-gap"></span>'
    : `<span class="ch"><span>${ch}</span></span>`).join('');

  /* Collections for the horizontal rail */
  const railNames = ['Mood XLarge', 'Avangard Seri', 'Effect Aqua Block', 'Diamond Seri', 'Pera Icon', 'TerraClick 8 mm', 'Platinum Seri', 'Marco Polo Premium', 'Modern Long Seri', 'Exclusive 5G'];
  const rail = railNames.map(coll).filter(Boolean).map((c, i) => `
      <a class="rail-card" href="${paths.laminat}?collection=${encodeURIComponent(c.name)}">
        <div class="rail-media"><img src="${url(c.image)}" alt="${esc(c.name)} koleksiyonundan bir uygulama" loading="lazy"></div>
        <div class="rail-info">
          <h3>${esc(c.name)}</h3>
          <p>${esc(c.brand)}</p>
          <dl>
            <div><dt>Model</dt><dd>${c.count}</dd></div>
            ${thicknessOf(c.name) ? `<div><dt>Kalınlık</dt><dd>${esc(thicknessOf(c.name))}</dd></div>` : ''}
          </dl>
        </div>
        <span class="rail-index">${String(i + 1).padStart(2, '0')}</span>
      </a>`).join('');

  /* Browse-by-look index */
  const countBy = (fn) => laminat.filter(fn).length;
  const looks = [
    { label: 'Açık meşe tonları', href: `${paths.laminat}?tone=A%C3%A7%C4%B1k&decor=Ah%C5%9Fap`, n: countBy(p => p.tone === 'Açık' && p.decor === 'Ahşap'), img: '/images/agt/agt-pera-icon-papatya-1.jpg', note: 'Küçük odaları ferah gösterir' },
    { label: 'Orta tonda ahşap', href: `${paths.laminat}?tone=Orta&decor=Ah%C5%9Fap`, n: countBy(p => p.tone === 'Orta' && p.decor === 'Ahşap'), img: '/images/agt/agt-pera-icon-erguvan-1.jpg', note: 'Her mobilyayla uyum sağlar' },
    { label: 'Koyu ceviz ve füme', href: `${paths.laminat}?tone=Koyu&decor=Ah%C5%9Fap`, n: countBy(p => p.tone === 'Koyu' && p.decor === 'Ahşap'), img: '/images/agt/agt-effect-aqua-block-rosso-1.jpg', note: 'Geniş ve aydınlık mekânlar için' },
    { label: 'Taş ve mermer dokusu', href: `${paths.laminat}?decor=Ta%C5%9F+%26+Beton`, n: countBy(p => p.decor === 'Taş & Beton'), img: '/images/agt/agt-mood-xlarge-mare-1.jpg', note: 'Seramik görünümü, laminat sıcaklığı' },
    { label: 'Desenli tasarımlar', href: `${paths.laminat}?decor=Tasar%C4%B1m`, n: countBy(p => p.decor === 'Tasarım'), img: '/images/agt/agt-pruva-xl-arya-1.jpg', note: 'Balıksırtı ve geometrik dizilimler' },
    { label: '12 mm kalın gövde', href: `${paths.laminat}?thickness=12+mm`, n: countBy(p => p.thickness === '12 mm'), img: '/images/agt/agt-marco-polo-premium-novaya-1.jpg', note: 'Daha sessiz, daha sağlam zemin' }
  ];
  const lookRows = looks.map(l => `
      <li><a href="${l.href}" data-look="${l.img}">
        <span class="look-name">${esc(l.label)}</span>
        <span class="look-note">${esc(l.note)}</span>
        <span class="look-count">${l.n} model</span>
        <img class="look-thumb" src="${l.img}" alt="" loading="lazy">
      </a></li>`).join('');

  /* Archive strip: the original shop and early jobs */
  /* Avcılar: real photos of the shop, showroom and depot (scripts/enhance-showroom.js) */
  const shots = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', 'public', 'data', 'showroom.json'), 'utf8'));
  const shot = (slug) => shots.find(s => s.src.includes(slug)) || shots[0];
  const archiveCols = [
    ['magaza-cephesi', 'depo-stok', 'showroom-numune-standi'],
    ['showroom-genel', 'depo-koridor-kartela', 'depo-panel-stok'],
    ['showroom-ofis', 'depo-genel', 'depo-laminat-stok']
  ].map((col, i) => `<div class="archive-col" data-speed="${[-6, 8, -10][i]}">${col.map(slug => {
      const s = shot(slug);
      return `<figure><img src="${s.src}" alt="${esc(s.cap)}, Şen Parke Avcılar" loading="lazy"><figcaption>${esc(s.cap)}</figcaption></figure>`;
    }).join('')}</div>`).join('');

  const marqueeItem = `<span>AGT</span><i class="mq-mark">${logoMark()}</i><span>Çamsan</span><i class="mq-mark">${logoMark()}</i><span>Yıldız Entegre</span><i class="mq-mark">${logoMark()}</i><span>MDF &amp; Panel</span><i class="mq-mark">${logoMark()}</i>`;

  /* MDF panel: prefer a rendered interior from Yıldız Entegre */
  const mdfItems = products.filter(p => p.category === 'MDF & Panel');
  const mdfShot = (mdfItems.find(p => /kapak-panel/.test(p.id) && /-render\.jpg$/.test(p.image))
    || mdfItems.find(p => /-render\.jpg$/.test(p.image)) || mdfItems[0] || {}).image;

  const body = `
  <section class="hx" data-hero>
    <div class="hx-stage">
      <div class="hx-photo"><img src="/images/site/interior-1.jpg" alt="Açık renk laminat parke döşenmiş, merdivenli ferah bir oturma alanı" fetchpriority="high"></div>
      <div class="hx-shade"></div>
      <div class="hx-floor" aria-hidden="true">${floorRows(9)}</div>
      <div class="hx-word" aria-hidden="true">${word}</div>
      <div class="hx-copy">
        <p class="hx-kicker">Avcılar'da 1978'den beri laminat parke, MDF ve mutfak dolabı</p>
        <h1 data-split="manual">Zemininiz ve mutfağınız, tek ekipten.</h1>
        <p class="hx-lead">AGT, Çamsan ve Yıldız Entegre'nin ${stats.laminat} laminat modelini ve Yıldız Entegre MDF panellerini Avcılar'daki showroomumuzda sergiliyor, ölçüyü alıp montajı kendi ekibimizle yapıyoruz.</p>
        <div class="hx-actions">
          <a class="btn btn-light" href="${paths.laminat}" data-magnetic>Modelleri incele</a>
          <a class="btn btn-ghost-light" href="${paths.teklif}" data-magnetic>Keşif randevusu al</a>
        </div>
      </div>
      <p class="hx-corner hx-corner-l">Avcılar, İstanbul<br>Showroom, ofis ve ana depo</p>
      <p class="hx-corner hx-corner-r">${site.phones.map(p => `${p.name} <a href="tel:${p.href}">${p.number}</a>`).join('<br>')}<br>${site.hours}</p>
      <div class="hx-hint" aria-hidden="true"><span>Kaydırın</span><i></i></div>
    </div>
  </section>

  <section class="manifesto">
    <div class="container">
      <p class="manifesto-text" data-words>${site.founder} 1978'de ilk parke dükkânını açtığında kural basitti: doğru tahtayı seç, düzgün döşe, verdiğin sözü tut. Bugün üç üreticinin ${stats.laminatCollections} laminat koleksiyonunu, Yıldız Entegre MDF panellerini ve ölçüye özel mutfak dolaplarını Avcılar'daki showroom ve depomuzda sunuyoruz. Kural hâlâ aynı.</p>
      <div class="ruler" data-ruler>
        <div class="ruler-ticks" aria-hidden="true"></div>
        <dl class="ruler-marks">
          <div><dt>İlk dükkân</dt><dd data-count="1978">1978</dd></div>
          <div><dt>Laminat model</dt><dd data-count="${stats.laminat}">${stats.laminat}</dd></div>
          <div><dt>MDF ve panel</dt><dd data-count="${stats.mdf}">${stats.mdf}</dd></div>
          <div><dt>m² showroom ve depo</dt><dd data-count="1000">1000</dd></div>
        </dl>
      </div>
    </div>
  </section>

  <section class="rail" data-rail>
    <div class="rail-pin">
      <div class="rail-head container">
        <h2 data-split>Koleksiyonlar</h2>
        <p>AGT, Çamsan ve Yıldız Entegre'nin ${stats.laminatCollections} serisi arasından showroomda en çok sorulanlar. Bir seriyi seçin, tüm modellerini görün.</p>
        <div class="rail-progress" aria-hidden="true"><span></span></div>
      </div>
      <div class="rail-track">
        ${rail}
        <a class="rail-card rail-end" href="${paths.laminat}">
          <span class="rail-end-num">${stats.laminatCollections}</span>
          <span class="rail-end-text">koleksiyonun tamamı ve ${stats.laminat} model katalogda</span>
          <span class="rail-end-link">Kataloğu aç ${icon('arrow', 18)}</span>
        </a>
      </div>
    </div>
  </section>

  <section class="looks" data-looks>
    <div class="container">
      <div class="looks-head">
        <h2 data-split>Görünüme göre seçin</h2>
        <p>Aklınızda bir renk ya da doku varsa buradan başlayın; liste katalogda o filtreyle açılır.</p>
      </div>
      <ul class="looks-list">${lookRows}</ul>
    </div>
    <div class="looks-float" aria-hidden="true"><div class="looks-float-inner"><img alt="" src="${looks[0].img}"></div></div>
  </section>

  <section class="stack" data-stack>
    <article class="stack-panel">
      <div class="stack-media"><img src="/images/agt/agt-marco-polo-premium-novaya-1.jpg" alt="Gri tonlu geniş bir salonda laminat parke" loading="lazy" data-parallax="10"></div>
      <div class="stack-body container">
        <div class="stack-title">
          <span class="stack-tag">Laminat parke</span>
          <h2 data-split>${stats.laminat} model,<br>numunesi elinizde.</h2>
        </div>
        <div class="stack-text">
          <p>Suya dayanıklı Aqua serilerinden Çamsan'ın Diamond ve Avangard serilerine kadar AGT, Çamsan ve Yıldız Entegre koleksiyonlarının tamamı. Kararı fotoğraftan değil, numuneyi elinize alarak verin.</p>
          <a class="btn btn-light" href="${paths.laminat}" data-magnetic>Parke kataloğu</a>
        </div>
      </div>
    </article>
    <article class="stack-panel">
      <div class="stack-media"><img src="${url(mdfShot)}" alt="Yıldız Entegre MDF panellerle döşenmiş bir iç mekân" loading="lazy" data-parallax="10"></div>
      <div class="stack-body container">
        <div class="stack-title">
          <span class="stack-tag">MDF ve panel</span>
          <h2 data-split>Yıldız Entegre<br>MDF panelleri.</h2>
        </div>
        <div class="stack-text">
          <p>MDFlam / Suntalam, mat ve parlak kapak panel, Super Gloss lak panel ve boyalı panel seçenekleriyle ${stats.mdf} ürün. Mobilya, dolap kapağı ve iç mekân uygulamaları için.</p>
          <a class="btn btn-light" href="${paths.mdf}" data-magnetic>MDF kataloğu</a>
        </div>
      </div>
    </article>
    <article class="stack-panel">
      <div class="stack-media"><img src="/images/site/kitchen-2.jpg" alt="Ahşap kapaklı, adalı modern mutfak" loading="lazy" data-parallax="10"></div>
      <div class="stack-body container">
        <div class="stack-title">
          <span class="stack-tag">Mutfak dolabı</span>
          <h2 data-split>Ölçüye göre üretilir,<br>zeminle birlikte planlanır.</h2>
        </div>
        <div class="stack-text">
          <p>Gövde, kapak, tezgâh ve donanımı birlikte seçiyoruz. Parke ve mutfak aynı keşifte planlandığında süpürgelik, tezgâh kotu ve geçişler ilk seferde doğru oturur.</p>
          <a class="btn btn-light" href="${paths.mutfak}" data-magnetic>Mutfak çözümleri</a>
        </div>
      </div>
    </article>
    <article class="stack-panel stack-panel-showroom">
      <div class="stack-media stack-media-real"><img src="${shot('showroom-genel').src}" alt="Şen Parke Avcılar showroomu" loading="lazy" data-parallax="10"></div>
      <div class="stack-body container">
        <div class="stack-title">
          <span class="stack-tag">Avcılar</span>
          <h2 data-split>1000 m²,<br>tek adres.</h2>
        </div>
        <div class="stack-text">
          <figure class="stack-inset"><img src="${shot('magaza-cephesi').src}" alt="Şen Parke mağaza cephesi, Avcılar" loading="lazy"><figcaption>Mağaza cephemiz</figcaption></figure>
          <dl class="stack-facts">
            <div><dt>Adres</dt><dd>${site.address}</dd></div>
            <div><dt>Çalışma saatleri</dt><dd>${site.hours}. ${site.hoursNote}.</dd></div>
          </dl>
          <p>Showroom, ofis ve ana depomuz aynı yerde: modelleri yerinde görün, numune alın; stoktaki ürünleri doğrudan depomuzdan sevk ediyoruz.</p>
          <div class="stack-links">
            <a class="btn btn-light" href="${site.maps}" target="_blank" rel="noopener" data-magnetic>Yol tarifi</a>
            <a class="btn btn-ghost-light" href="${paths.iletisim}" data-magnetic>İletişim</a>
          </div>
        </div>
      </div>
    </article>
  </section>

  <section class="process" data-process>
    <div class="process-pin">
      <div class="container">
        <div class="process-head">
          <h2 data-split>Keşiften teslime dört adım</h2>
          <p>Her işte aynı sırayı izliyoruz; nerede olduğunuzu her zaman bilirsiniz.</p>
        </div>
        <div class="process-ruler" aria-hidden="true"><span class="process-fill"></span></div>
        <ol class="process-steps">
          <li><span class="step-num">1</span><h3>Keşif ve ölçü</h3><p>Mekânı yerinde görüp ölçüyü alıyoruz. İstanbul içinde ücretsiz.</p></li>
          <li><span class="step-num">2</span><h3>Numune ve seçim</h3><p>Showroomda ya da evinizde, numunelerle doğru seriyi seçiyoruz.</p></li>
          <li><span class="step-num">3</span><h3>Yazılı teklif</h3><p>Malzeme, süpürgelik ve işçilik kalem kalem, yazılı olarak.</p></li>
          <li><span class="step-num">4</span><h3>Montaj ve teslim</h3><p>Kendi ekibimiz döşer, alanı temiz ve kullanıma hazır bırakır.</p></li>
        </ol>
      </div>
    </div>
  </section>

  <section class="brands-band">
    <div class="marquee" data-marquee aria-hidden="true">
      <div class="marquee-track">${marqueeItem.repeat(6)}</div>
    </div>
    <div class="container brands-grid">
      <a class="brand-col" href="${paths.markalar}#agt">
        <h3>AGT</h3>
        <p>Effect, Mood, Pera ve Marco Polo dahil ${stats.agt.collections} koleksiyon. 72 saate varan su direnci, kendinden şilteli seriler.</p>
        <span class="brand-count">${stats.agt.models} model</span>
      </a>
      <a class="brand-col" href="${paths.markalar}#camsan">
        <h3>Çamsan</h3>
        <p>Klasik'ten Silver, Platinum, Diamond ve Avangard'a ${stats.camsan.collections} seri; derzli ve derzsiz seçenekler.</p>
        <span class="brand-count">${stats.camsan.models} model</span>
      </a>
      <a class="brand-col" href="${paths.markalar}#yildiz">
        <h3>Yıldız Entegre</h3>
        <p>TerraClick ve VarioClic laminat parkeler; MDFlam, kapak, lak ve boyalı panellerle ${stats.mdf} MDF ürünü.</p>
        <span class="brand-count">${stats.yildiz.models + stats.mdf} ürün</span>
      </a>
    </div>
  </section>

  <section class="archive">
    <div class="container archive-grid">
      <div class="archive-copy">
        <h2 data-split>Avcılar'dan kareler</h2>
        <p>Mağazamız, showroomumuz ve 1000 m² ana depomuz. Fotoğraflar mekânın kendisi; geldiğinizde aynısını göreceksiniz.</p>
        <a class="link-line" href="${site.maps}" target="_blank" rel="noopener">Yol tarifi al</a>
        <a class="link-line" href="${paths.galeri}">Galerinin tamamı</a>
      </div>
      <div class="archive-cols">${archiveCols}</div>
    </div>
  </section>

  <section class="section container home-faq" id="sss">
    <div class="catalog-seo">
      <div>
        <h2 data-split>Sık sorulan <em>sorular.</em></h2>
        <p>Aklınıza takılan başka bir şey varsa <a class="link-line" href="tel:${site.phones[0].href}">${esc(site.phones[0].name)}: ${esc(site.phones[0].number)}</a> numarasından ya da WhatsApp’tan sorabilirsiniz.</p>
      </div>
      <div>${faqList(HOME_FAQ())}</div>
    </div>
  </section>`;

  write('index.html', pageShell({
    title: '',
    description: `Şen Parke — 1978’den beri Avcılar’da laminat parke, MDF ve mutfak dolabı. AGT, Çamsan ve Yıldız Entegre’den ${stats.laminat} laminat model, ${stats.mdf} MDF ve panel; ücretsiz keşif, ölçü ve montaj.`,
    pathName: '/',
    bodyClass: 'is-home',
    body
  }));
}

module.exports = { homePage };
