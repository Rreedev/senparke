/* Çamsan Entegre — laminat parke kataloğu
   Kaynak: https://www.camsanentegre.com/kategori/laminat-parke
   Çıktı: data/camsan.json + public/images/camsan/*.jpg
   Kullanım: node scripts/scrape-camsan.js */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const sharp = require('sharp');

const BASE = 'https://www.camsanentegre.com';
const OUT = path.join(__dirname, '..', 'data');
const IMG = path.join(__dirname, '..', 'public', 'images', 'camsan');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

async function get(url, tries = 3, binary = false) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'tr-TR,tr;q=0.9' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return binary ? Buffer.from(await res.arrayBuffer()) : await res.text();
    } catch (e) {
      if (i === tries - 1) throw e;
      await sleep(800 * (i + 1));
    }
  }
}

async function mapLimit(items, limit, fn) {
  let idx = 0;
  async function worker() { while (idx < items.length) { const i = idx++; await fn(items[i], i); } }
  await Promise.all(Array.from({ length: limit }, worker));
}

const abs = (u) => !u ? '' : u.startsWith('//') ? 'https:' + u : u.startsWith('/') ? BASE + u : u;

(async () => {
  fs.mkdirSync(IMG, { recursive: true });
  const urls = new Set();
  for (let page = 1; page <= 20; page++) {
    const html = await get(`${BASE}/kategori/laminat-parke${page > 1 ? `?tp=${page}` : ''}`);
    const before = urls.size;
    [...html.matchAll(/href="(\/urun\/[^"#?]+)"/g)].forEach(m => urls.add(m[1]));
    console.log('listing page', page, 'total', urls.size);
    if (urls.size === before) break;
    await sleep(350);
  }

  const products = [];
  await mapLimit([...urls], 4, async (rel) => {
    try {
      const html = await get(BASE + rel);
      const $ = cheerio.load(html);
      const title = clean($('h1').first().text());
      const m = title.match(/^(.*?)\s*-\s*([\w.-]+)$/);
      const name = m ? clean(m[1]) : title;
      const code = m ? m[2] : '';
      const crumbs = [...new Set($('.breadcrumbs-container a, .breadcrumbs-container span').map((_, e) => clean($(e).text())).get())].filter(Boolean);
      const collection = crumbs.find(c => /seri/i.test(c)) || '';
      const specs = {};
      $('.product-extraInfo-row').each((_, e) => {
        const k = clean($(e).find('.product-extraInfo-label').text()).replace(/:$/, '');
        const v = clean($(e).find('.product-extraInfo-value').text());
        if (k && v) specs[k] = v;
      });
      const features = [];
      $('img[src*="product-extra-detail-field"]').each((_, e) => {
        const t = clean($(e).closest('div').parent().text()) || clean($(e).attr('alt'));
        if (t && t.length < 60) features.push(t);
      });
      const description = clean($('meta[name="description"]').attr('content'));
      const imgs = [];
      const primary = $('#product-primary-image img').first().attr('src');
      if (primary) imgs.push(abs(primary));
      $('.product-image-group a.fancybox').each((_, e) => {
        const href = $(e).attr('href') || $(e).find('img').attr('src');
        if (href && /\.(jpe?g|png|webp)/i.test(href)) imgs.push(abs(href));
      });
      const uniq = [...new Set(imgs.map(u => u.split('?')[0]))].filter(u => !/img\d+\.png$/i.test(u));
      const slug = rel.split('/').pop();
      const localImages = [];
      for (let i = 0; i < Math.min(uniq.length, 3); i++) {
        try {
          const buf = await get(uniq[i], 2, true);
          const file = `${slug}-${i + 1}.jpg`;
          await sharp(buf).resize({ width: 1200, withoutEnlargement: true }).flatten({ background: '#ffffff' })
            .jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(IMG, file));
          localImages.push(`images/camsan/${file}`);
        } catch (e) { console.warn('  image failed', uniq[i], e.message); }
      }
      products.push({ url: BASE + rel, slug, name, code, collection, specs, features: [...new Set(features)], description, localImages });
      if (products.length % 10 === 0) console.log('  details', products.length, '/', urls.size);
    } catch (e) {
      console.error('product failed', rel, e.message);
    }
  });

  products.sort((a, b) => a.collection.localeCompare(b.collection, 'tr') || a.name.localeCompare(b.name, 'tr'));
  fs.writeFileSync(path.join(OUT, 'camsan.json'), JSON.stringify({ brand: 'Çamsan', source: `${BASE}/kategori/laminat-parke`, products }, null, 2));
  console.log('Saved', products.length, 'Çamsan products');
})();
