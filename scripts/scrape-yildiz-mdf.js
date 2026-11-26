/* Yıldız Entegre — MDF ve panel ürünleri
   Gruplar: MDFlam / Suntalam, Kapak Panel, Lak Panel, Boyalı Panel, Kompakt Lam Panel
   Çıktı: data/yildiz-mdf.json + public/images/yildiz-mdf/*.jpg
   Kullanım: node scripts/scrape-yildiz-mdf.js */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const sharp = require('sharp');

const BASE = 'https://www.yildizentegre.com';
const OUT = path.join(__dirname, '..', 'data');
const IMG = path.join(__dirname, '..', 'public', 'images', 'yildiz-mdf');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

const GROUPS = [
  { slug: 'mdflam-suntalam', name: 'MDFlam / Suntalam' },
  { slug: 'kapak-panel', name: 'Kapak Panel' },
  { slug: 'lak-panel', name: 'Lak Panel' },
  { slug: 'boyali-panel', name: 'Boyalı Panel' },
  { slug: 'kompakt-yogunluklu-lam-panel', name: 'Kompakt Lam Panel' }
];

async function get(url, tries = 3, binary = false) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'tr-TR,tr;q=0.9' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return binary ? Buffer.from(await res.arrayBuffer()) : await res.text();
    } catch (e) {
      if (i === tries - 1) throw e;
      await sleep(700 * (i + 1));
    }
  }
}

async function mapLimit(items, limit, fn) {
  let idx = 0;
  async function worker() { while (idx < items.length) { const i = idx++; await fn(items[i], i); } }
  await Promise.all(Array.from({ length: limit }, worker));
}

(async () => {
  fs.mkdirSync(IMG, { recursive: true });
  const list = new Map();
  for (const g of GROUPS) {
    for (let page = 1; page <= 15; page++) {
      const html = await get(`${BASE}/urunler/${g.slug}${page > 1 ? `?page=${page}` : ''}`);
      const $ = cheerio.load(html);
      let added = 0;
      $('.product-item-wgn').each((_, el) => {
        const href = $(el).find(`a[href*="/urunler/${g.slug}/"]`).first().attr('href');
        if (!href || list.has(href)) return;
        list.set(href, { group: g.name, groupSlug: g.slug, href, title: clean($(el).attr('data-wgn-title')) });
        added++;
      });
      console.log(g.slug, 'page', page, '+', added);
      if (!added) break;
      await sleep(300);
    }
  }

  const products = [];
  await mapLimit([...list.values()], 4, async (item) => {
    try {
      const html = await get(BASE + item.href);
      const $ = cheerio.load(html);
      let ld = null;
      $('script[type="application/ld+json"]').each((_, e) => {
        const t = $(e).html() || '';
        if (t.includes('"Product"') && !ld) { try { ld = JSON.parse(t); } catch (x) { /* noop */ } }
      });
      if (!ld) return;
      const specs = {};
      for (const p of ld.additionalProperty || []) {
        const v = clean(String(p.value || '').replace(/<br\s*\/?>/gi, ' / '));
        if (v) specs[p.name] = v;
      }
      const sku = String(ld.sku || '').trim();
      const code = sku.replace(/[^A-Za-z0-9_-]/g, '');
      const candidates = [
        `https://app.yildiz.com/products_render/R_${code}.jpg`,
        `https://app.yildiz.com/product_textures/${code}.jpg`,
        `https://app.yildiz.com/products_render/P_${code}.jpg`
      ];
      const slug = item.href.split('/').pop();
      const localImages = [];
      const imageKinds = [];
      const kinds = ['render', 'texture', 'plan'];
      for (let i = 0; i < candidates.length; i++) {
        try {
          const buf = await get(candidates[i], 1, true);
          const file = `${slug}-${kinds[i]}.jpg`;
          await sharp(buf).resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
            .flatten({ background: '#ffffff' }).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(IMG, file));
          localImages.push(`images/yildiz-mdf/${file}`);
          imageKinds.push(kinds[i]);
        } catch (e) { /* image not published for this product */ }
      }
      products.push({
        url: BASE + item.href, slug, group: item.group, groupSlug: item.groupSlug,
        sku, name: clean(ld.name), title: item.title, description: clean(ld.description),
        specs, localImages, imageKinds
      });
      if (products.length % 25 === 0) console.log('  details', products.length, '/', list.size);
    } catch (e) {
      console.error('product failed', item.href, e.message);
    }
  });

  fs.writeFileSync(path.join(OUT, 'yildiz-mdf.json'), JSON.stringify({ brand: 'Yıldız Entegre', products }, null, 2));
  console.log('Saved', products.length, 'Yıldız MDF/panel products');
})();
