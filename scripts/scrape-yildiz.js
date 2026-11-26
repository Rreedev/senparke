const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const BASE = 'https://www.yildizentegre.com';
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
      await sleep(800 * (i + 1));
    }
  }
}

const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

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

const listingPages = [
  ...Array.from({ length: 4 }, (_, i) => ({ url: `${BASE}/urunler/varioclic${i ? `?page=${i + 1}` : ''}`, group: 'VarioClic' })),
  { url: `${BASE}/urunler/terraclick`, group: 'TerraClick' },
  { url: `${BASE}/urunler/supurgelik`, group: 'Süpürgelik' }
];

(async () => {
  const productsMap = new Map();

  for (const page of listingPages) {
    console.log('Listing', page.url);
    const html = await get(page.url);
    const $ = cheerio.load(html);
    let added = 0;
    $('.product-item-wgn').each((_, el) => {
      const $el = $(el);
      const a = $el.find('a[href*="/urunler/"]').first();
      const href = a.attr('href');
      if (!href) return;
      const title = clean($el.attr('data-wgn-title') || a.find('span').last().text());
      const slug = $el.attr('data-wgn-product-slug') || href.split('/').pop();
      const key = href;
      if (productsMap.has(key)) return;
      const data = {};
      for (const [k, v] of Object.entries(el.attribs || {})) {
        if (k.startsWith('data-filter-')) data[k.replace('data-filter-', '')] = v;
      }
      productsMap.set(key, {
        group: page.group,
        url: BASE + href,
        slug,
        name: title,
        cardImage: $el.attr('data-wgn-product-image') || ($el.find('img').first().attr('src') || ''),
        tag: clean($el.find('.test-tag img').attr('alt') || $el.find('.new-product-tag').text()),
        data
      });
      added++;
    });
    console.log('  added', added, 'total', productsMap.size);
    await sleep(400);
  }

  const products = [...productsMap.values()];
  console.log('Total Yıldız products:', products.length);

  let done = 0;
  await mapLimit(products, 4, async (p) => {
    try {
      const html = await get(p.url);
      const $ = cheerio.load(html);
      let ld = null;
      $('script[type="application/ld+json"]').each((_, el) => {
        const txt = $(el).html() || '';
        if (txt.includes('"@type": "Product"') && !ld) {
          try { ld = JSON.parse(txt); } catch (e) {}
        }
      });
      if (ld) {
        p.sku = ld.sku || '';
        p.name = clean(ld.name);
        p.description = clean(ld.description);
        p.brandLine = ld.brand?.name || '';
        p.category = ld.category || '';
        p.specs = {};
        for (const prop of ld.additionalProperty || []) {
          p.specs[prop.name] = prop.value;
        }
        p.collection = p.specs['Koleksiyon'] || '';
        p.color = p.specs['Renk Tonları'] || '';
        p.decor = p.specs['Dekor'] || '';
        p.thickness = p.specs['Kalınlık (mm)'] || '';
        p.size = p.specs['Ebat (mm)'] || '';
        p.packageM2 = p.specs['Paket (m2)'] || '';
        p.surface = p.specs['Yüzey Dayanımı'] || '';
        p.joint = p.specs['Derz'] || '';
      }
      const code = (p.sku || '').replace(/[^A-Za-z0-9_-]/g, '');
      const imgs = [];
      if (code) {
        imgs.push(`https://app.yildiz.com/products_render/R_${code}.jpg`);
        imgs.push(`https://app.yildiz.com/product_textures/${code}.jpg`);
        imgs.push(`https://app.yildiz.com/products_render/P_${code}.jpg`);
      }
      p.images = imgs;
      p.localPreview = p.cardImage || '';
      p.slug = p.url.split('/').pop();
      p.title = clean($('h1').first().text()) || p.name;
      done++;
      if (done % 20 === 0) console.log('  details', done, '/', products.length);
    } catch (e) {
      console.error('product failed', p.url, e.message);
    }
  });

  const out = { brand: 'Yıldız Entegre', source: `${BASE}/urunler/parke`, products };
  fs.writeFileSync(path.join(OUT, 'yildiz.json'), JSON.stringify(out, null, 2));
  console.log('Saved', products.length, 'products to data/yildiz.json');
})();
