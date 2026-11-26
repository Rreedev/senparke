/* =========================================================
   ŞEN PARKE — local landing pages: /parke/ and /parke/<bölge>/
   One page per service area, each written for that area's housing stock
   (not a template with the name swapped), with its own series picks,
   neighbourhoods, FAQ and a cross-link to Taha Şen Yapı's page for the same area.
   ========================================================= */
const {
  site, stats, paths, icon, esc, pageShell, AREAS, loc, abl, IDS, ldScript
} = require('./lib');
const { write, laminat, laminatCollections, pageHero, faqList, productCard, collectionCard } = require('./build-helpers');

/* Series picks by housing profile. Names must match collections.json. */
const PICKS = {
  hub: ['Effect', 'Klasik Seri', 'TerraClick 8 mm', 'Pera Collection'],
  newflat: ['Pera Icon', 'Platinum Seri', 'Premium XL', 'Mood XLarge'],
  rental: ['Concept Neo', 'Gloria Seri', 'Premium Plus', 'Effect Elegance'],
  fresh: ['Pruva XLarge', 'Belanda Seri', 'Premium Medium', 'Pera Collection 8 mm'],
  compact: ['Yoga Collection Premium', 'Serenza Seri', 'TerraClick 4V', 'Luna'],
  varied: ['Natura Select', 'Silver Plus Seri', 'Vista', 'Bella Neo'],
  mixed: ['Effect Premium', 'Silver Seri', 'Exclusive 5G', 'Natura Line'],
  villa: ['Effect Aqua Block', 'Aqua Special', 'Diamond Seri', 'Foresta XLarge'],
  oldflat: ['Effect 8+2', 'Modern Seri', 'Standard', 'Yoga Collection'],
  classic: ['Marco Polo Premium', 'Avangard Seri', 'Natural Sense', 'Armonia Large']
};

const CONTENT = {
  avcilar: {
    profile: 'hub',
    hoods: ['Cihangir', 'Ambarlı', 'Denizköşkler', 'Firuzköy', 'Gümüşpala', 'Merkez', 'Mustafa Kemal Paşa', 'Tahtakale', 'Üniversite', 'Yeşilkent'],
    lead: 'Showroomumuz, ofisimiz ve 1000 m² depomuz Avcılar Cihangir Mahallesi’nde. Numuneyi mağazada görüp ölçüyü evinizde aldırabilir, montajı kendi ekibimize bırakabilirsiniz.',
    body: [
      'Avcılar, 1999 depreminden sonra yapı stoğu en hızlı yenilenen ilçelerden biri. Kentsel dönüşümle yeni teslim edilen dairelerde müteahhit parkesinin yenilenmesi, eski apartmanlarda ise yıpranmış zeminin tamamen değiştirilmesi en sık gelen iki iş.',
      'Depomuz showroomla aynı adreste olduğu için malzemeyi kendi depomuzdan sevk ediyoruz. Avcılar’da parkeci arıyorsanız 1978’den beri aynı ailenin işletmesiyle, mahallenizdeki bir ekiple çalışırsınız.'
    ],
    tip: 'Avcılar’daki apartman dairelerinde en çok AGT Effect, Çamsan Klasik ve Yıldız Entegre TerraClick 8 mm serilerini döşüyoruz: günlük kullanıma dayanıklı, renk seçeneği geniş ve stokta bulunması kolay seriler. Islak hacme yakın alanlarda su dirençli bir seri öneriyoruz.'
  },
  beylikduzu: {
    profile: 'newflat',
    hoods: ['Adnan Kahveci', 'Barış', 'Büyükşehir', 'Cumhuriyet', 'Dereağzı', 'Kavaklı', 'Marmara', 'Sahil', 'Yakuplu'],
    lead: 'Beylikdüzü’nün site dairelerinde teslimde döşenen standart parkeyi, daha geniş ve daha dayanıklı bir seriyle değiştiriyoruz. Avcılar’daki showroomumuz E-5 üzerinden hemen yanı başınızda.',
    body: [
      'Beylikdüzü görece yeni bir yapı stoğuna sahip; dairelerin çoğu site içinde ve teslimde temel bir laminat parkeyle geliyor. Sık gelen talep, bu parkeyi daha uzun ve geniş tahtalı, daha sessiz bir seriyle yenilemek.',
      'Site yönetimlerinin çalışma saatlerine ve asansör kullanım kurallarına göre montaj gününü planlıyor, ortak alanları koruyarak çalışıyoruz.'
    ],
    tip: 'Beylikdüzü’ndeki yeni dairelerde uzun ve geniş tahtalı serileri öneriyoruz: AGT Pera Icon ve Mood XLarge, Çamsan Platinum, Yıldız Entegre Premium XL. Geniş tahta, salon ve koridor gibi uzun mekânları daha ferah gösterir.'
  },
  gurpinar: {
    profile: 'fresh',
    hoods: ['Gürpınar', 'Beylikdüzü'],
    lead: 'Beylikdüzü Gürpınar’daki yeni konut ve sitelerde laminat parke seçimi, keşfi ve montajı. Showroomumuz Avcılar’da, E-5 üzerinden kısa bir yol.',
    body: [
      'Gürpınar’da yeni yapılan konutlar ve siteler ağırlıkta. Taşınmadan önce zemini yenilemek isteyen ev sahipleriyle, anahtar teslim alınır alınmaz keşfe gelip ölçüyü alıyoruz.',
      'Yeni binalarda şapın kuruluğunu ve düzgünlüğünü keşifte ölçüyor, gerekiyorsa montajdan önce yapılması gerekenleri yazılı olarak bildiriyoruz.'
    ],
    tip: 'Gürpınar’daki yeni dairelerde açık ve orta tonlarda serileri öneriyoruz: AGT Pruva XLarge ve Pera Collection 8 mm, Çamsan Belanda, Yıldız Entegre Premium Medium. Açık tonlar yeni daireyi aydınlık gösterir ve mobilya seçimini kolaylaştırır.'
  },
  yakuplu: {
    profile: 'mixed',
    hoods: ['Yakuplu', 'Beylikdüzü'],
    lead: 'Yakuplu’da eski müstakil evlerden yeni sitelere kadar her tür konutta laminat parke. Numuneleri Avcılar showroomumuzda ya da evinizde birlikte inceliyoruz.',
    body: [
      'Yakuplu’da eski yapılarla yeni siteler yan yana. Eski evlerde zemin seviyesi ve kapı altı boşlukları farklı olabildiği için keşifte her odayı ayrı ölçüyor, geçiş profillerini buna göre planlıyoruz.',
      'Yeni sitelerde ise daha çok mevcut parkenin daha kaliteli bir seriyle değiştirilmesi isteniyor.'
    ],
    tip: 'Yakuplu’da hem eski hem yeni evlere uyan dayanıklı serileri öneriyoruz: AGT Effect Premium ve Natura Line, Çamsan Silver, Yıldız Entegre Exclusive 5G.'
  },
  esenyurt: {
    profile: 'rental',
    hoods: ['Akçaburgaz', 'Saadetdere', 'Pınar', 'Fatih', 'Cumhuriyet', 'İncirtepe'],
    lead: 'Esenyurt’un yeni konut projelerinde ve site dairelerinde laminat parke satışı ve montajı. Showroomumuz Avcılar’da, Esenyurt’a komşu.',
    body: [
      'Esenyurt İstanbul’un en hızlı büyüyen ilçelerinden biri; yeni teslim daireler ve kiralık konutlar çok. Ev sahiplerinin sık sorduğu soru, kiracı değişimlerinde dayanıklı kalacak ve kolay temizlenen bir zemin.',
      'Birden fazla daireyi aynı anda yenileyen ev sahipleri ve yatırımcılar için daireleri tek keşifte ölçüp tek teklifte topluyoruz.'
    ],
    tip: 'Esenyurt’ta kiracılı ya da yoğun kullanılan dairelerde kolay temizlenen, dayanıklı serileri öneriyoruz: AGT Concept Neo ve Effect Elegance, Çamsan Gloria, Yıldız Entegre Premium Plus.'
  },
  kucukcekmece: {
    profile: 'varied',
    hoods: ['Atakent', 'Halkalı', 'Cennet', 'Kanarya', 'Fevzi Çakmak', 'İnönü', 'Sefaköy'],
    lead: 'Küçükçekmece’nin Atakent ve Halkalı sitelerinden eski apartmanlarına kadar laminat parke keşfi, ölçü ve montaj. Showroomumuz Avcılar’da, göl kıyısının hemen batısında.',
    body: [
      'Küçükçekmece geniş ve çeşitli bir ilçe: Halkalı ve Atakent’te yeni siteler, Cennet ve Kanarya’da eski apartmanlar ağırlıkta. Bu yüzden keşifte önce binanın yaşını ve zeminin durumunu görüyor, seriyi buna göre öneriyoruz.',
      'Kentsel dönüşüm sürecindeki binalarda, yeni dairelerin parkesini müteahhitten bağımsız olarak kendiniz seçmek istiyorsanız teslim tarihine göre planlama yapıyoruz.'
    ],
    tip: 'Küçükçekmece’de çok yönlü serileri öneriyoruz: AGT Natura Select ve Bella Neo, Çamsan Silver Plus, Yıldız Entegre Vista. Hem site dairelerinde hem eski apartmanlarda iyi sonuç veriyorlar.'
  },
  sefakoy: {
    profile: 'oldflat',
    hoods: ['Sefaköy', 'Küçükçekmece'],
    lead: 'Sefaköy’ün E-5 çevresindeki apartman dairelerinde eski zemini yenileyen laminat parke montajı. Avcılar showroomumuzdan Sefaköy’e E-5 üzerinden geliyoruz.',
    body: [
      'Sefaköy’de 1980’ler ve 90’lardan kalma apartmanlar çok. Bu dairelerde zemin genellikle yıpranmış eski parke, karo ya da PVC; keşifte mevcut zemini ve seviye farklarını görüp yapılması gerekenleri teklife yazıyoruz.',
      'Eski apartmanlarda alt kat komşuları için darbe sesi önemli; şilte seçimini buna göre yapıyoruz.'
    ],
    tip: 'Sefaköy’deki eski apartman dairelerinde kalın ve darbe sesi yalıtımlı serileri öneriyoruz: AGT Effect 8+2 ve Yoga Collection, Çamsan Modern, Yıldız Entegre Standard. Bütçe ile dayanıklılık arasında iyi bir denge sunuyorlar.'
  },
  sirinevler: {
    profile: 'compact',
    hoods: ['Şirinevler', 'Bahçelievler'],
    lead: 'Bahçelievler Şirinevler’in yoğun apartman dokusunda laminat parke yenileme. Ölçü, teklif ve montaj tek ekipten; showroomumuz Avcılar’da.',
    body: [
      'Şirinevler’in yoğun yapılaşmış sokaklarında daireler genellikle eski ve zemin değişimi çoğu zaman tadilatın bir parçası. Boya, kapı ve mutfak işleriyle aynı takvime oturacak şekilde montaj gününü planlıyoruz.',
      'Dar merdivenli eski binalarda malzeme taşımayı keşifte planlıyor, montaj gününü apartman yönetimine önceden bildiriyoruz.'
    ],
    tip: 'Şirinevler’deki eski ve görece küçük dairelerde mekânı geniş gösteren açık tonlu serileri öneriyoruz: AGT Yoga Collection Premium ve Luna, Çamsan Serenza, Yıldız Entegre TerraClick 4V.'
  },
  bakirkoy: {
    profile: 'classic',
    hoods: ['Ataköy', 'Yeşilköy', 'Florya', 'Kartaltepe', 'Zeytinlik', 'Osmaniye', 'Şenlikköy'],
    lead: 'Bakırköy’ün köklü apartmanlarında ve Ataköy, Yeşilköy, Florya’nın geniş dairelerinde klasik ve karakterli laminat parke. Showroomumuz Avcılar’da, sahil yolu ve E-5 üzerinden.',
    body: [
      'Bakırköy’de daireler genellikle geniş ve yüksek tavanlı; çoğunda eski masif ya da lamine parke var. Bu evlerde zemin, binanın klasik karakterine uyan tonlar ve desenlerle yenileniyor.',
      'Balıksırtı ve klasik ahşap görünümlü desenleri numunelerle evinizde, kendi ışığınızda gösteriyoruz.'
    ],
    tip: 'Bakırköy’ün klasik dairelerinde karakterli desen ve tonları öneriyoruz: AGT Marco Polo Premium ve Armonia Large, Çamsan Avangard, Yıldız Entegre Natural Sense.'
  },
  buyukcekmece: {
    profile: 'villa',
    hoods: ['Mimarsinan', 'Kumburgaz', 'Tepecik', 'Kamiloba', 'Celaliye', 'Kumburgaz', 'Alkent 2000'],
    lead: 'Büyükçekmece’nin müstakil evlerinde, villalarında ve yazlık sitelerinde geniş alan laminat parke. Keşif ve ölçü için yerinize geliyoruz.',
    body: [
      'Büyükçekmece’de müstakil evler, villalar ve sahil siteleri çok; alanlar geniş, zemin katlar toprağa ve nemli havaya yakın. Bu evlerde su ve nem direnci yüksek serileri, doğru şilteyle birlikte öneriyoruz.',
      'Geniş alanlarda malzemeyi tek partiden ve tek seferde çıkarıyor, renk ve doku farkı oluşmasının önüne geçiyoruz.'
    ],
    tip: 'Büyükçekmece’deki villa ve müstakil evlerde su dirençli ve geniş tahtalı serileri öneriyoruz: AGT Effect Aqua Block ve Foresta XLarge, Yıldız Entegre Aqua Special, Çamsan Diamond.'
  }
};

const SHOWROOM_SHOTS = ['/images/showroom/showroom-genel.jpg', '/images/showroom/showroom-numune-standi.jpg', '/images/showroom/showroom-ofis.jpg', '/images/showroom/magaza-cephesi.jpg'];

function areaFaq(a, c) {
  const isHub = !!a.hub;
  return [
    [`${loc(a.name)} parke keşfi ve ölçüsü ücretli mi?`, `Hayır. ${loc(a.name)} dahil İstanbul içinde keşif ve ölçü ücretsizdir. Ölçüden sonra malzeme, süpürgelik ve işçiliği kalem kalem içeren yazılı teklif veriyoruz.`],
    [`${loc(a.name)} hangi laminat parkeyi önerirsiniz?`, c.tip],
    [`${loc(a.name)} laminat parke fiyatları neye göre değişir?`, 'Fiyat; seçilen marka ve seri, metrekare, süpürgelik ve geçiş profilleri ile montaj kapsamına göre değişir. Sitede fiyat yazmıyoruz; keşiften sonra net ve yazılı teklif veriyoruz.'],
    [`${loc(a.name)} parke montajı ne kadar sürer?`, '100 m²’lik bir daire, süpürgelik ve geçiş profilleriyle birlikte genellikle 1–2 günde tamamlanır. Montajı kendi ekibimiz yapar; net tarihi teklifte yazıyoruz.'],
    isHub
      ? ['Avcılar’daki showroomunuz nerede?', `Showroom, ofis ve 1000 m² depomuz ${site.address} adresinde. Hafta içi ve cumartesi 08:00–21:00 arası açığız, pazar kapalıyız.`]
      : [`${abl(a.name)} showroomunuza nasıl gelirim?`, `Showroomumuz ${site.address} adresinde. ${abl(a.name)} E-5 (D-100) üzerinden Avcılar’a gelebilirsiniz; Google Haritalar’da “Şen Parke Avcılar” yazmanız yeterli. Gelmeniz gerekmiyorsa numuneleri keşifte evinize getiriyoruz.`]
  ];
}

function areaPage(a, idx) {
  const c = CONTENT[a.slug];
  const picks = PICKS[c.profile].map(n => laminatCollections.find(x => x.name === n)).filter(Boolean);
  const prods = picks.flatMap(col => laminat.filter(p => p.collection === col.name && p.brand === col.brand).slice(0, 2));
  const label = a.parent ? `${a.name}, ${a.parent}` : a.name;
  const others = AREAS.filter(o => o.slug !== a.slug);
  const hoods = [...new Set(c.hoods)];
  const faq = areaFaq(a, c);
  const heroImg = '/' + String((picks[0] || {}).image || SHOWROOM_SHOTS[0]).replace(/^\//, '');

  const body = `
  ${pageHero({
    eyebrow: `${label} · İstanbul`,
    title: `${esc(loc(a.name))} laminat <em>parke.</em>`,
    desc: esc(c.lead),
    img: heroImg,
    alt: `${a.name} için önerilen laminat parke serisi`,
    crumbs: [{ label: 'Parke hizmet bölgeleri', href: paths.parke }, { label: a.name }],
    meta: [['Showroom', 'Avcılar'], ['Keşif ve ölçü', 'Ücretsiz'], ['Montaj', 'Kendi ekibimiz'], ['Model', String(stats.laminat)]]
  })}

  <section class="section container">
    <div class="catalog-seo">
      <div>
        <span class="eyebrow">${esc(a.name)}</span>
        <h2 data-split>${esc(a.name)} için <em>doğru zemin.</em></h2>
      </div>
      <div class="area-copy" data-fade>
        ${c.body.map(p => `<p>${esc(p)}</p>`).join('')}
        <p class="area-hoods"><strong>Hizmet verdiğimiz mahalleler:</strong> ${hoods.map(esc).join(', ')} ve çevresi.</p>
        <ul class="check-list">
          <li>${icon('check', 16)} Ücretsiz keşif ve ölçü</li>
          <li>${icon('check', 16)} AGT, Çamsan ve Yıldız Entegre’den ${stats.laminat} model</li>
          <li>${icon('check', 16)} Malzeme, süpürgelik ve işçilik dahil yazılı teklif</li>
          <li>${icon('check', 16)} Montaj kendi ekibimizle</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="section container">
    <div class="section-head">
      <div>
        <span class="eyebrow">Önerilen seriler</span>
        <h2 data-split>${esc(loc(a.name))} <em>sık seçilenler.</em></h2>
      </div>
      <div class="section-head-side" data-fade><p>${esc(c.tip)}</p></div>
    </div>
    <div class="collection-strip">${picks.map(col => collectionCard(col, { href: `${paths.laminat}?collection=${encodeURIComponent(col.name)}` })).join('')}</div>
    ${prods.length ? `<div class="product-grid area-products">${prods.map(p => productCard(p)).join('')}</div>` : ''}
    <p class="area-more"><a class="link-line" href="${paths.laminat}">Tüm ${stats.laminat} laminat parke modelini inceleyin</a></p>
  </section>

  <section class="section section-tint container">
    <div class="catalog-seo">
      <div>
        <span class="eyebrow">Merak edilenler</span>
        <h2>${esc(a.name)} için sık sorulan <em>sorular.</em></h2>
      </div>
      <div>${faqList(faq)}</div>
    </div>
  </section>

  <section class="section container area-links">
    <div class="area-sibling">
      <p class="eyebrow">Binanız dönüşümde mi?</p>
      <p>${esc(loc(a.name))} kentsel dönüşüm, kat karşılığı ve renovasyon için kardeş kuruluşumuz <a class="link-line" href="/yapi/bolgeler/${a.slug}/">Taha Şen Yapı ${esc(a.name)}</a> sayfasına bakın.</p>
    </div>
    <div>
      <p class="eyebrow">Diğer bölgeler</p>
      <nav class="area-chips" aria-label="Diğer parke hizmet bölgeleri">${others.map(o => `<a href="${paths.parkeArea(o.slug)}">${esc(o.name)} parke</a>`).join('')}</nav>
    </div>
  </section>

  <section class="cta-band">
    <div class="container cta-band-inner">
      <div>
        <span class="eyebrow light">Ücretsiz keşif</span>
        <h2>${esc(a.name)} için <em>keşif randevusu.</em></h2>
        <p>Adresinizi ve metrekareyi yazın; numunelerle gelip ölçüyü alalım, ardından yazılı teklifimizi iletelim.</p>
      </div>
      <div class="cta-band-actions">
        <a class="btn btn-light" href="${paths.teklif}?konu=parke">Keşif Talebi ${icon('arrow', 15)}</a>
        <a class="btn btn-outline-light" href="tel:${site.phoneHref}">${site.phoneName}: ${site.phone}</a>
      </div>
    </div>
  </section>`;

  const canonical = site.domain + paths.parkeArea(a.slug);
  const serviceLd = ldScript({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${canonical}#service`,
    name: `${a.name} laminat parke satışı ve montajı`,
    serviceType: 'Laminat parke satışı, keşif, ölçü ve montaj',
    description: `${c.lead} ${c.body.join(' ')}`,
    url: canonical,
    provider: { '@id': IDS.business },
    areaServed: { '@type': 'Place', name: `${label}, İstanbul`, containsPlace: hoods.map(h => ({ '@type': 'Place', name: `${h}, ${a.parent || a.name}` })) },
    brand: ['AGT', 'Çamsan', 'Yıldız Entegre'].map(b => ({ '@type': 'Brand', name: b })),
    offers: { '@type': 'Offer', name: 'Ücretsiz keşif ve ölçü', price: '0', priceCurrency: 'TRY', areaServed: `${label}, İstanbul` }
  });

  write(`parke/${a.slug}/index.html`, pageShell({
    title: `${a.name} Parke — Laminat Parke Satış ve Montaj`,
    description: `${loc(a.name)} laminat parke: AGT, Çamsan ve Yıldız Entegre’den ${stats.laminat} model, ücretsiz keşif ve ölçü, kendi ekibimizle montaj. Şen Parke, 1978’den beri Avcılar’da.`,
    pathName: paths.parkeArea(a.slug),
    active: 'Parke',
    body,
    ogImage: heroImg,
    extraHead: serviceLd
  }));
}

function hubPage() {
  const body = `
  ${pageHero({
    eyebrow: 'Hizmet bölgeleri',
    title: 'Parke hizmet <em>bölgelerimiz.</em>',
    desc: `Merkezimiz Avcılar. E-5 hattı boyunca batıda Büyükçekmece’ye, doğuda Bakırköy’e kadar laminat parke keşfi, ölçüsü ve montajı yapıyoruz; İstanbul içinde keşif ücretsizdir.`,
    img: SHOWROOM_SHOTS[0],
    alt: 'Şen Parke Avcılar showroom',
    crumbs: [{ label: 'Parke hizmet bölgeleri' }],
    meta: [['Merkez', 'Avcılar'], ['Bölge', String(AREAS.length)], ['Keşif', 'Ücretsiz'], ['Montaj', 'Kendi ekibimiz']]
  })}
  <section class="section container">
    <div class="area-grid">${AREAS.map(a => `
      <a class="area-card ${a.hub ? 'is-hub' : ''}" href="${paths.parkeArea(a.slug)}">
        <span class="area-card-sub">${a.hub ? 'Merkez · showroom ve depo' : esc(a.parent || 'İlçe')}</span>
        <h2>${esc(a.name)} parke</h2>
        <p>${esc(CONTENT[a.slug].lead)}</p>
        <span class="link-line">Bölge sayfası</span>
      </a>`).join('')}
    </div>
    <p class="area-more">Listede olmayan bir İstanbul ilçesindeyseniz de <a class="link-line" href="${paths.teklif}">keşif talebi</a> bırakın; İstanbul içinde keşif ve ölçü ücretsizdir.</p>
  </section>`;

  write('parke/index.html', pageShell({
    title: 'Parke Hizmet Bölgeleri — Avcılar, Beylikdüzü, Esenyurt, Bakırköy',
    description: 'Şen Parke laminat parke hizmet bölgeleri: Avcılar, Beylikdüzü, Gürpınar, Yakuplu, Esenyurt, Küçükçekmece, Sefaköy, Şirinevler, Bakırköy ve Büyükçekmece. Ücretsiz keşif, ölçü ve montaj.',
    pathName: paths.parke,
    active: 'Parke',
    body,
    ogImage: SHOWROOM_SHOTS[0]
  }));
}

function buildParkeAreas() {
  const missing = AREAS.filter(a => !CONTENT[a.slug]);
  if (missing.length) throw new Error('Bölge içeriği eksik: ' + missing.map(a => a.slug).join(', '));
  hubPage();
  AREAS.forEach(areaPage);
  return [paths.parke, ...AREAS.map(a => paths.parkeArea(a.slug))];
}

module.exports = { buildParkeAreas, AREA_CONTENT: CONTENT };
