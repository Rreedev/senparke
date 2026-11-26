/* =========================================================
   ŞENPARKE — site builder (part 2)
   Hakkımızda · İletişim · Teklif · Ürün sayfaları · 404 ·
   KVKK/Çerez · robots · sitemap
   ========================================================= */
const fs = require('fs');
const path = require('path');
const { PUB, site, stats, paths, icon, esc, pageShell } = require('./lib');
const {
  products, pages, write, jsonInline, pageHero, faqList, productPage
} = require('./build-helpers');

/* ---------------------------------------------------------
   HAKKIMIZDA
   --------------------------------------------------------- */
function hakkimizdaPage() {
  const body = `
  ${pageHero({
    eyebrow: 'Hakkımızda',
    title: 'Kırk yılı aşkın <em>ustalık.</em>',
    desc: 'Şen Parke, 1978’den beri parke ve zemin işinde. Bugün Avcılar’daki showroom ve 1000 m² depomuzdan laminat parke, MDF ve mutfak dolabı; keşiften montaja tek elden.',
    img: '/images/site/interior-3.jpg',
    crumbs: [{ label: 'Hakkımızda' }],
    meta: [['Kuruluş', '1978'], ['Kurucu', site.founder], ['Merkez', 'Avcılar, İstanbul'], ['Depo ve showroom', '1000 m²']]
  })}

  <section class="section container">
    <div class="editorial">
      <div class="editorial-media">
        <img src="/images/showroom/showroom-ofis.jpg" alt="Şen Parke Avcılar showroomu, ofis ve numune duvarı" loading="lazy">
        <span class="badge-stamp"><strong>1978</strong>Kuruluş</span>
      </div>
      <div class="editorial-copy">
        <span class="eyebrow">Hikâyemiz</span>
        <h2>Bir dükkânla başladı,<br><em>ustalıkla sürdü.</em></h2>
        <p>Şen Parke, 1978’de ${site.founder} tarafından kuruldu. İlk yıllarda parke ticareti ve uygulamasıyla başlayan yolculuk, yıllar içinde kendi uygulama ekibi ve stok alanıyla büyüdü.</p>
        <p>Bugün Avcılar’da showroom, ofis ve 1000 m² ana depomuz aynı adreste. AGT, Çamsan ve Yıldız Entegre’nin laminat koleksiyonlarını ve Yıldız Entegre MDF panellerini burada sergiliyor, stok ve sevkiyatı da buradan yönetiyoruz.</p>
        <p>Müşterimize ürün satmaktan çok, doğru zemini seçmesine yardım etmeyi görev edindik: ölçü, numune, teklif ve montaj — hepsi tek elden, hepsi söz verdiğimiz günde.</p>
      </div>
    </div>
    <div class="about-stats">
      <div class="about-stat"><strong>1978</strong><span>Kuruluş</span></div>
      <div class="about-stat"><strong>${stats.laminat}</strong><span>Laminat model</span></div>
      <div class="about-stat"><strong>${stats.mdf}</strong><span>MDF ve panel</span></div>
      <div class="about-stat"><strong>1000 m²</strong><span>Showroom ve depo</span></div>
    </div>
  </section>

  <section class="section section-tint container">
    <div class="section-head" data-reveal>
      <div>
        <span class="eyebrow">Değerlerimiz</span>
        <h2>Neye <em>bağlıyız?</em></h2>
      </div>
      <p>Dört değer, kırk yıldır değişmedi.</p>
    </div>
    <div class="feature-grid">
      <div class="feature-item"><span class="feature-num">01</span>${icon('shield', 30)}<h3>Güven</h3><p>Kırk yıldır aynı iş, aynı özen. Söz verdiğimiz günde, söz verdiğimiz işçilikle.</p></div>
      <div class="feature-item"><span class="feature-num">02</span>${icon('ruler', 30)}<h3>Ustalık</h3><p>Uygulama ekibimiz kendi işinin ustası; süpürgelikten geçiş profiline son detay kadar.</p></div>
      <div class="feature-item"><span class="feature-num">03</span>${icon('layers', 30)}<h3>Çeşitlilik</h3><p>Üç marka, ${stats.laminatCollections} laminat koleksiyonu ve ${stats.mdf} MDF ve panel; her bütçeye ve her mekâna uygun seçenek.</p></div>
      <div class="feature-item"><span class="feature-num">04</span>${icon('spark', 30)}<h3>Süreklilik</h3><p>Bir kez değil, her seferinde. Montaj sonrası da yanınızdayız.</p></div>
    </div>
  </section>

  <section class="section container">
    <div class="section-head" data-reveal>
      <div>
        <span class="eyebrow">Kilometre Taşları</span>
        <h2>Yolculuğumuzdan <em>kareler.</em></h2>
      </div>
    </div>
    <ul class="timeline">
      <li><strong>1978</strong><span>${site.founder}, Şen Parke’yi kurar; parke ticareti ve uygulaması başlar.</span></li>
      <li><strong>1990’lar</strong><span>Uygulama ekibi ve stok alanı büyür; işin kapsamı ölçü ve projeye genişler.</span></li>
      <li><strong>2000’ler</strong><span>AGT, Çamsan ve Yıldız Entegre koleksiyonları Şen Parke çatısı altında bir araya gelir.</span></li>
      <li><strong>Bugün</strong><span>Avcılar’da 1000 m² showroom, ofis ve ana depo; laminat parke, MDF ve mutfak dolabında keşiften montaja tek elden.</span></li>
    </ul>
    <div style="margin-top:44px">
      <a class="btn btn-primary" href="${paths.teklif}">Ücretsiz Keşif ${icon('arrow', 15)}</a>
      <a class="btn btn-outline" href="${paths.iletisim}" style="margin-left:10px">İletişim</a>
    </div>
  </section>`;

  write('hakkimizda/index.html', pageShell({
    title: 'Hakkımızda — 1978’den Beri',
    description: `Şen Parke: 1978’de ${site.founder} tarafından kurulan, Avcılar’da laminat parke, MDF ve mutfak dolabı hizmeti veren aile işletmesi.`,
    pathName: paths.hakkimizda,
    active: 'Hakkımızda',
    body
  }));
}

/* ---------------------------------------------------------
   İLETİŞİM
   --------------------------------------------------------- */
function iletisimPage() {
  const body = `
  ${pageHero({
    eyebrow: 'İletişim',
    title: 'Bir kahve,<br><em>bir zemin sohbeti.</em>',
    desc: 'Showroomumuzda modelleri yerinde görün, numuneleri elleyin; mekânınızı birlikte değerlendirelim.',
    img: '/images/showroom/magaza-cephesi.jpg',
    alt: 'Şen Parke mağaza cephesi, Avcılar',
    crumbs: [{ label: 'İletişim' }]
  })}

  <section class="section-sm container">
    <div class="contact-cards">
      <div class="contact-card">
        ${icon('pin', 28)}
        <h3>Avcılar showroom</h3>
        <strong>${site.address}</strong>
        <p>${site.facility}.</p>
        <a class="text-link" href="${site.maps}" target="_blank" rel="noopener">Yol tarifi ${icon('arrowUp', 13)}</a>
      </div>
      <div class="contact-card">
        ${icon('clock', 28)}
        <h3>Çalışma saatleri</h3>
        <strong>${site.hours}</strong>
        <p>${site.hoursNote}. Keşif randevuları için önceden aramanız yeterli.</p>
        <a class="text-link" href="tel:${site.phoneHref}">Bizi arayın ${icon('arrow', 13)}</a>
      </div>
      <div class="contact-card">
        ${icon('phone', 28)}
        <h3>Telefon</h3>
        ${site.phones.map(p => `<strong><a href="tel:${p.href}">${p.number}</a></strong><p class="phone-person">${p.name}</p>`).join('')}
        <p>WhatsApp: ${site.phone} (${site.phoneName})</p>
        <a class="text-link" href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp ${icon('arrow', 13)}</a>
      </div>
    </div>
  </section>

  <section class="section container" style="padding-top:0">
    <div class="form-layout">
      <div class="form-aside">
        <span class="eyebrow">Bize Yazın</span>
        <h2>Sorunuz mu var?</h2>
        <p>Ürün, fiyat veya montaj konusunda aklınıza takılan her şeyi sorabilirsiniz; bir iş günü içinde dönüş yapıyoruz.</p>
        <ul class="contact-block">
          ${site.phones.map(p => `<li>${icon('phone', 17)}<span><strong>${p.name}</strong><a href="tel:${p.href}">${p.number}</a></span></li>`).join('')}
          <li>${icon('clock', 17)}<span><strong>Çalışma saatleri</strong>${site.hours}. ${site.hoursNote}.</span></li>
        </ul>
      </div>
      <form class="form-card" data-form data-whatsapp="${site.waNumber}" novalidate>
        <h3>İletişim formu</h3>
        <p>Bilgilerinizi bırakın, sizinle iletişime geçelim.</p>
        <div class="form-grid">
          <div class="field"><label for="cName">Ad Soyad *</label><input id="cName" name="name" type="text" required autocomplete="name"></div>
          <div class="field"><label for="cPhone">Telefon *</label><input id="cPhone" name="phone" type="tel" required autocomplete="tel" placeholder="0(5xx) xxx xx xx"></div>
          <div class="field full"><label for="cEmail">E-posta</label><input id="cEmail" name="email" type="email" autocomplete="email"></div>
          <div class="field full">
            <label for="cSubject">Konu</label>
            <select id="cSubject" name="subject">
              <option value="Laminat Parke">Laminat Parke</option>
              <option value="Ahşap ve Masif Parke">Ahşap ve Masif Parke</option>
              <option value="Parke Sistre ve Cila">Parke Sistre ve Cila</option>
              <option value="MDF ve Panel">MDF ve Panel</option>
              <option value="Mutfak Dolabı">Mutfak Dolabı</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>
          <div class="field full"><label for="cMessage">Mesajınız *</label><textarea id="cMessage" name="message" required></textarea></div>
          <div class="field full">
            <label class="checkbox"><input type="checkbox" name="kvkk" required> <span><a href="/kvkk/">KVKK Aydınlatma Metni</a>’ni okudum, kişisel verilerimin bu amaçla işlenmesine onay veriyorum.</span></label>
          </div>
          <div class="field full"><button class="btn btn-primary" type="submit">Gönder ${icon('arrow', 15)}</button></div>
        </div>
        <div class="form-success"></div>
        <p class="form-note">* Zorunlu alanlar. Demo ortamında kayıt alınmaz; gönderim WhatsApp üzerinden iletilir.</p>
      </form>
    </div>
  </section>

  <section class="container" style="padding-bottom:clamp(72px,8vw,110px)">
    <div class="map-wrap">
      <iframe src="${site.mapsEmbed}" title="Şen Parke Avcılar showroom haritası" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
    
  </section>`;

  write('iletisim/index.html', pageShell({
    title: 'İletişim — Showroom ve Depo',
    description: `Şenparke iletişim: ${site.address}. Telefon: ${site.phones.map(p => `${p.name} ${p.number}`).join(', ')}. Showroom, depo ve iletişim formu.`,
    pathName: paths.iletisim,
    active: 'İletişim',
    body
  }));
}

/* ---------------------------------------------------------
   TEKLİF
   --------------------------------------------------------- */
function teklifPage() {
  const productMap = {};
  products.forEach(p => {
    productMap[p.id] = {
      name: p.name, brand: p.brand, collection: p.collection,
      code: p.code, image: p.cardImage || p.image, category: p.category
    };
  });

  const body = `
  ${pageHero({
    eyebrow: 'Ücretsiz Keşif',
    title: 'Teklif <em>alın.</em>',
    desc: 'Formu doldurun; ölçü ve ihtiyacınıza uygun seçeneklerle bir iş günü içinde size dönelim. Keşif ve ölçü İstanbul içi ücretsizdir.',
    img: '/images/agt/agt-natura-select-patara-1.jpg',
    crumbs: [{ label: 'Teklif' }]
  })}

  <section class="section container">
    <div class="form-layout form-layout-reverse">
      <form class="form-card" data-form data-whatsapp="${site.waNumber}" novalidate>
        <h3>Keşif &amp; teklif talebi</h3>
        <p>Mekânınız ve ihtiyacınız hakkında birkaç satır yeterli; gerisini keşifte birlikte netleştiririz.</p>
        <div class="form-grid">
          <div class="field"><label for="qName">Ad Soyad *</label><input id="qName" name="name" type="text" required autocomplete="name"></div>
          <div class="field"><label for="qPhone">Telefon *</label><input id="qPhone" name="phone" type="tel" required autocomplete="tel" placeholder="0(5xx) xxx xx xx"></div>
          <div class="field"><label for="qEmail">E-posta</label><input id="qEmail" name="email" type="email" autocomplete="email"></div>
          <div class="field"><label for="qCity">İl / İlçe *</label><input id="qCity" name="city" type="text" required placeholder="İstanbul / …"></div>
          <div class="field">
            <label for="fieldSubject">Konu *</label>
            <select id="fieldSubject" name="subject" required>
              <option value="">Seçin…</option>
              <option value="Laminat Parke">Laminat Parke</option>
              <option value="Ahşap ve Masif Parke">Ahşap ve Masif Parke</option>
              <option value="Parke Sistre ve Cila">Parke Sistre ve Cila</option>
              <option value="MDF ve Panel">MDF ve Panel</option>
              <option value="Mutfak Dolabı">Mutfak Dolabı</option>
              <option value="Laminat + Mutfak">Laminat Parke + Mutfak Dolabı</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>
          <div class="field"><label for="qArea">Yaklaşık alan (m²)</label><input id="qArea" name="area" type="text" inputmode="decimal" placeholder="örn. 85"></div>
          <div class="field full"><label for="fieldMessage">Mesajınız</label><textarea id="fieldMessage" name="message" placeholder="Mekânınız, beğendiğiniz seriler, zamanlama…"></textarea></div>
          <div class="field full">
            <label class="checkbox"><input type="checkbox" name="kvkk" required> <span><a href="/kvkk/">KVKK Aydınlatma Metni</a>’ni okudum, kişisel verilerimin bu amaçla işlenmesine onay veriyorum.</span></label>
          </div>
          <div class="field full"><button class="btn btn-primary" type="submit">Teklif Talebi Gönder ${icon('arrow', 15)}</button></div>
        </div>
        <div class="quote-product" id="quoteProduct" hidden></div>
        <div class="form-success"></div>
        <p class="form-note">* Zorunlu alanlar. Demo ortamında kayıt alınmaz; gönderim WhatsApp üzerinden iletilir.</p>
      </form>
      <div class="form-aside">
        <span class="eyebrow">Nasıl ilerliyor?</span>
        <h2>Dört adımda<br>net cevap.</h2>
        <ul class="check-list">
          <li>${icon('check', 16)} Formu doldurun — bir iş günü içinde dönüş yapıyoruz.</li>
          <li>${icon('check', 16)} Ücretsiz keşif ve ölçü için randevulaşıyoruz.</li>
          <li>${icon('check', 16)} Numunelerle birlikte doğru seriyi seçiyoruz.</li>
          <li>${icon('check', 16)} Yazılı teklif: malzeme, süpürgelik ve montaj dahil.</li>
        </ul>
        <ul class="contact-block" style="margin-top:34px">
          ${site.phones.map(p => `<li>${icon('phone', 17)}<span><strong>${p.name}</strong><a href="tel:${p.href}">${p.number}</a></span></li>`).join('')}
          <li>${icon('clock', 17)}<span><strong>Çalışma saatleri</strong>${site.hours}. ${site.hoursNote}.</span></li>
          <li>${icon('whatsapp', 17)}<span><strong>WhatsApp</strong><a href="${site.whatsapp}" target="_blank" rel="noopener">Hemen yazın</a></span></li>
        </ul>
      </div>
    </div>
    <script type="application/json" id="quoteProductData">${jsonInline(productMap)}</script>
  </section>`;

  write('teklif/index.html', pageShell({
    title: 'Ücretsiz Keşif ve Teklif',
    description: 'Şenparke’dan ücretsiz keşif ve teklif: laminat parke ve mutfak dolabı için formu doldurun, bir iş günü içinde net teklifle dönüş yapalım.',
    pathName: paths.teklif,
    active: '',
    body
  }));
}

/* ---------------------------------------------------------
   ÜRÜN SAYFALARI
   --------------------------------------------------------- */
function productPages() {
  for (const p of products) {
    const page = productPage(p);
    write(path.join(p.url, 'index.html').replace(/\\/g, '/'), pageShell(page));
  }
}

/* ---------------------------------------------------------
   404
   --------------------------------------------------------- */
function notFoundPage() {
  const body = `
  <section class="notfound container">
    <strong>404</strong>
    <h1>Bu sayfa taşınmış<br>ya da hiç var olmamış olabilir.</h1>
    <p>Aradığınız sayfayı bulamadık. Koleksiyonlarımıza göz atabilir ya da bize yazabilirsiniz.</p>
    <div>
      <a class="btn btn-primary" href="/">Ana Sayfa ${icon('arrow', 15)}</a>
      <a class="btn btn-outline" href="${paths.laminat}" style="margin-left:10px">Laminat Parke</a>
    </div>
  </section>`;
  write('404.html', pageShell({
    title: 'Sayfa Bulunamadı (404)',
    description: 'Aradığınız sayfa bulunamadı.',
    pathName: '/404.html',
    body
  }));
}

/* ---------------------------------------------------------
   YASAL SAYFALAR
   --------------------------------------------------------- */
function legalPages() {
  const kvkk = `
  ${pageHero({ eyebrow: 'Yasal', title: 'KVKK Aydınlatma <em>Metni</em>', desc: 'Kişisel verilerinizin işlenmesine ilişkin bilgilendirme.', img: '/images/site/interior-3.jpg', crumbs: [{ label: 'KVKK' }] })}
  <section class="legal-page container">
    <p class="legal-note">Bu metin taslak niteliğindedir; yayın öncesinde hukuk danışmanınızla güncellenip onaylanmalıdır.</p>
    <div class="prose">
      <h2>1. Veri sorumlusu</h2>
      <p>6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca kişisel verileriniz, veri sorumlusu olarak Şen Parke (“Şenparke”) tarafından aşağıda açıklanan kapsamda işlenmektedir.</p>
      <h2>2. İşlenen kişisel veriler</h2>
      <ul>
        <li>Kimlik ve iletişim verileri (ad-soyad, telefon, e-posta, il/ilçe)</li>
        <li>Talep ve tercihlerinize ilişkin bilgiler (ilgilendiğiniz ürün, mesaj içeriği)</li>
        <li>Site kullanımına ilişkin teknik veriler (çerezler, IP, tarayıcı bilgisi)</li>
      </ul>
      <h2>3. İşleme amaçları</h2>
      <p>Talep ve sorularınızı yanıtlamak, teklif sürecini yürütmek, keşif randevuları organize etmek, sunduğumuz hizmetleri iyileştirmek ve yasal yükümlülükleri yerine getirmek.</p>
      <h2>4. Aktarım</h2>
      <p>Kişisel verileriniz; yalnızca sürecin yürütülmesi için gerekli hizmet sağlayıcılara (barındırma, iletişim) ve yasal zorunluluk halinde yetkili kurumlara aktarılabilir.</p>
      <h2>5. Haklarınız</h2>
      <p>KVKK m.11 kapsamında; verilerinize erişme, düzeltilmesini veya silinmesini isteme, işlemeye itiraz etme haklarınıza ilişkin taleplerinizi ${site.phone} numaralı telefondan ya da Avcılar’daki showroomumuza yazılı olarak iletebilirsiniz.</p>
    </div>
  </section>`;
  write('kvkk/index.html', pageShell({ title: 'KVKK Aydınlatma Metni', description: 'Kişisel verilerin korunması ve işlenmesine ilişkin aydınlatma metni.', pathName: '/kvkk/', body: kvkk }));

  const cerez = `
  ${pageHero({ eyebrow: 'Yasal', title: 'Çerez <em>Politikası</em>', desc: 'Web sitemizde kullanılan çerezler hakkında bilgilendirme.', img: '/images/site/interior-3.jpg', crumbs: [{ label: 'Çerez Politikası' }] })}
  <section class="legal-page container">
    <p class="legal-note">Bu metin taslak niteliğindedir; yayın öncesinde hukuk danışmanınızla güncellenip onaylanmalıdır.</p>
    <div class="prose">
      <h2>Çerez nedir?</h2>
      <p>Çerezler, web sitelerinin tarayıcınıza kaydettiği küçük metin dosyalarıdır; siteyi çalıştırmak ve kullanım deneyimini iyileştirmek için kullanılır.</p>
      <h2>Kullandığımız çerezler</h2>
      <ul>
        <li><strong>Zorunlu çerezler:</strong> Sitenin temel işlevleri için gereklidir.</li>
        <li><strong>İşlevsel çerezler:</strong> Filtre ve arama tercihlerinizi hatırlamak için kullanılabilir.</li>
        <li><strong>Analitik çerezler:</strong> (varsa) Sitenin kullanım istatistiklerini anonim olarak ölçer.</li>
      </ul>
      <h2>Çerezleri yönetme</h2>
      <p>Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz; ancak zorunlu çerezlerin engellenmesi sitenin bazı bölümlerini kullanılamaz hale getirebilir.</p>
    </div>
  </section>`;
  write('cerez-politikasi/index.html', pageShell({ title: 'Çerez Politikası', description: 'Web sitemizde kullanılan çerezlere ilişkin politika.', pathName: '/cerez-politikasi/', body: cerez }));
}

/* ---------------------------------------------------------
   ROBOTS & SITEMAP
   --------------------------------------------------------- */
function robotsSitemap() {
  fs.writeFileSync(path.join(PUB, 'robots.txt'),
`# Şen Parke ve Taha Şen Yapı: tüm içerik arama motorlarına ve yapay zekâ asistanlarına açıktır.
User-agent: *
Allow: /
Disallow: /404.html

# Arama ve yapay zekâ yanıt motorları (açıkça izinli)
User-agent: Googlebot
User-agent: Bingbot
User-agent: YandexBot
User-agent: Applebot
User-agent: Google-Extended
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Applebot-Extended
User-agent: CCBot
Allow: /

Sitemap: ${site.domain}/sitemap.xml
`);

  const showroom = ['magaza-cephesi', 'showroom-genel', 'showroom-numune-standi', 'showroom-ofis'].map(n => `/images/showroom/${n}.jpg`);
  const urls = [
    { loc: '/', priority: '1.0', changefreq: 'weekly', images: showroom },
    { loc: paths.laminat, priority: '0.9', changefreq: 'weekly' },
    { loc: paths.mdf, priority: '0.8', changefreq: 'weekly' },
    { loc: paths.mutfak, priority: '0.9', changefreq: 'monthly' },
    { loc: paths.markalar, priority: '0.7', changefreq: 'monthly' },
    { loc: paths.galeri, priority: '0.6', changefreq: 'monthly' },
    { loc: paths.hakkimizda, priority: '0.6', changefreq: 'yearly' },
    { loc: paths.iletisim, priority: '0.7', changefreq: 'yearly' },
    { loc: paths.teklif, priority: '0.8', changefreq: 'yearly' },
    { loc: '/kvkk/', priority: '0.2', changefreq: 'yearly' },
    { loc: '/cerez-politikasi/', priority: '0.2', changefreq: 'yearly' },
    ...products.map(p => ({ loc: '/' + p.url, priority: '0.6', changefreq: 'monthly', images: (p.images || []).slice(0, 4) }))
  ];
  urls.find(u => u.loc === paths.galeri).images = showroom;
  const today = new Date().toISOString().slice(0, 10);
  const x = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const abs = (src) => site.domain + '/' + String(src).replace(/^\//, '');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(u => `  <url>
    <loc>${x(site.domain + u.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${(u.images || []).map(i => `
    <image:image><image:loc>${x(abs(i))}</image:loc></image:image>`).join('')}
  </url>`).join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(PUB, 'sitemap.xml'), xml);
}

/* ---------------------------------------------------------
   RUN
   --------------------------------------------------------- */
function buildRest() {
  hakkimizdaPage();
  iletisimPage();
  teklifPage();
  productPages();
  notFoundPage();
  legalPages();
  robotsSitemap();
  console.log(`Site built: ${pages.length} sayfa (+ ${products.length} ürün sayfası dahil), sitemap ve robots.txt.`);
}

module.exports = { buildRest };
