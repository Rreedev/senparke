const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const BASE = 'https://www.agt.com.tr';
const OUT = path.join(__dirname, '..', 'data');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function get(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'tr-TR,tr;q=0.9' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      if (i === tries - 1) throw e;
      await sleep(1000 * (i + 1));
    }
  }
}

function clean(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

(async () => {
  console.log('Fetching AGT collections index...');
  const indexHtml = await get(`${BASE}/urunler/agt-parke/koleksiyonlar`);
  fs.writeFileSync(path.join(OUT, 'agt-index.html'), indexHtml);
  const $ = cheerio.load(indexHtml);

  const collections = [];
  const seen = new Set();
  $('a[href*="/urunler/agt-parke/koleksiyonlar/"]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    const m = href.match(/^\/urunler\/agt-parke\/koleksiyonlar\/([a-z0-9-]+)$/);
    if (!m) return;
    if (seen.has(m[1])) return;
    seen.add(m[1]);
    const img = $(el).find('img').first().attr('src') || '';
    const name = clean($(el).find('h3,h4,.fw-bold').first().text()) || clean($(el).text()) || m[1];
    collections.push({ slug: m[1], name, url: BASE + href, image: img.startsWith('http') ? img : BASE + img });
  });

  console.log(`Found ${collections.length} collections`);

  const productsMap = new Map();

  await mapLimit(collections, 4, async (col, i) => {
    try {
      const html = await get(col.url);
      const c = cheerio.load(html);
      c('a[href*="/urunler/agt-parke/koleksiyonlar/"]').each((_, el) => {
        const href = c(el).attr('href');
        if (!href) return;
        const m = href.match(/^\/urunler\/agt-parke\/koleksiyonlar\/([a-z0-9-]+)\/([a-z0-9-]+)$/);
        if (!m || m[1] !== col.slug) return;
        const key = m[1] + '/' + m[2];
        if (!productsMap.has(key)) {
          productsMap.set(key, {
            collectionSlug: m[1],
            slug: m[2],
            url: BASE + href,
            name: '',
            code: '',
            images: [],
            tags: []
          });
        }
      });
      // enrich from product cards
      c('.product-content').each((_, el) => {
        const card = c(el).closest('.position-relative');
        const a = card.find('a[href*="/urunler/agt-parke/koleksiyonlar/"]').first();
        const href = a.attr('href');
        if (!href) return;
        const m = href.match(/^\/urunler\/agt-parke\/koleksiyonlar\/([a-z0-9-]+)\/([a-z0-9-]+)$/);
        if (!m) return;
        const key = m[1] + '/' + m[2];
        const p = productsMap.get(key);
        if (!p) return;
        const h3 = c(el).find('h3').first();
        const lines = h3.html() ? h3.html().split(/<br\s*\/?>/i).map(x => clean(c('<div>').html(x).text())) : [];
        p.name = lines.length > 1 ? lines[lines.length - 1] : clean(h3.text());
        p.collectionName = lines.length > 1 ? lines[0] : col.name;
        p.code = clean(c(el).find('p').first().text());
        p.images = card.find('img').map((_, im) => {
          const s = c(im).attr('src') || '';
          return s.startsWith('http') ? s : BASE + s;
        }).get();
        p.tags = card.find('.tag').map((_, t) => clean(c(t).text())).get();
      });
      console.log(`  [${i + 1}/${collections.length}] ${col.name}: products so far ${productsMap.size}`);
    } catch (e) {
      console.error('collection failed', col.slug, e.message);
    }
  });

  const products = [...productsMap.values()];
  console.log(`Total AGT products found: ${products.length}`);

  let done = 0;
  await mapLimit(products, 4, async (p) => {
    try {
      const html = await get(p.url);
      const c = cheerio.load(html);
      const h1 = c('h1').first();
      const collectionName = clean(h1.find('span').first().text());
      h1.find('span').remove();
      const nameAndCode = clean(h1.text());
      const codeMatch = nameAndCode.match(/([A-Z0-9][A-Z0-9.\-+]{2,})\s*$/);
      p.name = nameAndCode.replace(codeMatch ? codeMatch[0] : '', '').trim();
      p.code = codeMatch ? codeMatch[1] : (p.code || '');
      p.collectionName = collectionName || p.collectionName || '';
      p.description = clean(c('.page-content .full-text').first().text());
      p.shortDescription = clean(c('.page-content .short-text').first().text());
      p.tags = c('.tags .tag').map((_, t) => clean(c(t).text())).get();
      p.features = c('.features-slider .box p').map((_, t) => clean(c(t).text())).get();
      const imgs = new Set();
      c('img').each((_, im) => {
        const s = c(im).attr('src') || '';
        if (!s.includes('/Product/Image/')) return;
        const full = s.startsWith('http') ? s : BASE + s;
        if (!full.includes('ProductFeature') && !full.includes('ProductCertificate')) imgs.add(full);
      });
      p.images = [...imgs];
      // specs
      const specs = {};
      c('.technichal-specifications li').each((_, li) => {
        const label = clean(c(li).find('span').first().text());
        const value = clean(c(li).find('span').eq(1).text()).replace(/\s*\(.*?\)\s*$/, '').trim();
        if (label && value) specs[label] = value;
      });
      p.specs = specs;
      const ebat = clean(c('.product-detail-box p.body-second').first().text());
      if (ebat) p.specs['Ebat'] = ebat;
      // collection image
      p.collectionImage = collections.find(x => x.slug === p.collectionSlug)?.image || '';
      done++;
      if (done % 20 === 0) console.log(`  product details ${done}/${products.length}`);
    } catch (e) {
      console.error('product failed', p.url, e.message);
    }
  });

  const out = { brand: 'AGT', source: `${BASE}/urunler/agt-parke/koleksiyonlar`, collections, products };
  fs.writeFileSync(path.join(OUT, 'agt.json'), JSON.stringify(out, null, 2));
  console.log(`Saved ${products.length} AGT products to data/agt.json`);
})();
