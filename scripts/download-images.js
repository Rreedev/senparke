const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const IMG = path.join(ROOT, 'public', 'images');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchBuf(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, Referer: url } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const ct = res.headers.get('content-type') || '';
      if (!ct.startsWith('image/')) throw new Error('not image: ' + ct);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      if (i === tries - 1) throw e;
      await sleep(600 * (i + 1));
    }
  }
}

async function save(buf, dest, width = 900, quality = 80) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await sharp(buf).rotate().resize({ width, withoutEnlargement: true }).jpeg({ quality, mozjpeg: true }).toFile(dest);
}

async function mapLimit(items, limit, fn) {
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
}

(async () => {
  // ---------- AGT ----------
  const agt = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'agt.json'), 'utf8'));
  console.log('AGT products:', agt.products.length);
  let n = 0;
  await mapLimit(agt.products, 6, async (p) => {
    const base = `agt-${p.collectionSlug}-${p.slug}`;
    const urls = (p.images || []).slice(0, 2);
    const local = [];
    for (let i = 0; i < urls.length; i++) {
      const file = path.join(IMG, 'agt', `${base}-${i + 1}.jpg`);
      try {
        if (!fs.existsSync(file)) {
          const buf = await fetchBuf(urls[i]);
          await save(buf, file, 900, 78);
        }
        local.push(`images/agt/${base}-${i + 1}.jpg`);
      } catch (e) {
        console.error('agt img fail', p.slug, i, e.message);
      }
    }
    p.localImages = local;
    n++;
    if (n % 25 === 0) console.log('  AGT', n, '/', agt.products.length);
  });
  const colSeen = new Set();
  for (const col of agt.collections) {
    if (!col.image || colSeen.has(col.slug)) continue;
    colSeen.add(col.slug);
    const file = path.join(IMG, 'agt', `collection-${col.slug}.jpg`);
    try {
      if (!fs.existsSync(file)) await save(await fetchBuf(col.image), file, 900, 80);
      col.localImage = `images/agt/collection-${col.slug}.jpg`;
    } catch (e) {
      console.error('agt collection img fail', col.slug, e.message);
    }
  }
  fs.writeFileSync(path.join(ROOT, 'data', 'agt.json'), JSON.stringify(agt, null, 2));

  // ---------- YILDIZ ----------
  const ye = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'yildiz.json'), 'utf8'));
  console.log('Yıldız products:', ye.products.length);
  n = 0;
  await mapLimit(ye.products, 6, async (p) => {
    const sku = (p.sku || p.slug).replace(/[^A-Za-z0-9_-]/g, '_');
    const sources = [
      `https://app.yildiz.com/products_render/R_${p.sku}.jpg`,
      `https://app.yildiz.com/products_render/P_${p.sku}.jpg`,
      p.cardImage && p.cardImage.startsWith('http') ? p.cardImage : (p.cardImage ? 'https://www.yildizentegre.com' + p.cardImage : '')
    ].filter(Boolean);
    const local = [];
    for (let i = 0; i < sources.length; i++) {
      const file = path.join(IMG, 'yildiz', `${sku}-${i + 1}.jpg`);
      try {
        if (!fs.existsSync(file)) {
          const buf = await fetchBuf(sources[i]);
          await save(buf, file, 900, 80);
        }
        local.push(`images/yildiz/${sku}-${i + 1}.jpg`);
      } catch (e) {
        // try next source
      }
      if (local.length >= 2) break;
    }
    p.localImages = local;
    n++;
    if (n % 25 === 0) console.log('  Yıldız', n, '/', ye.products.length);
  });
  fs.writeFileSync(path.join(ROOT, 'data', 'yildiz.json'), JSON.stringify(ye, null, 2));

  // Eski senparke.com fotoğrafları kullanılmıyor: galeri artık Avcılar showroom/depo fotoğraflarından
  // (senparkefotograf/ → node scripts/enhance-showroom.js) üretiliyor.

  // ---------- UNSplash atmosphere / kitchen ----------
  const unsplash = {
    'hero-interior': '1600585154340-be6161a56a0c',
    'hero-living': '1600210492486-724fe5c67fb0',
    'hero-kitchen': '1556911220-bff31c812dba',
    'kitchen-1': '1556228453-efd6c1ff04f6',
    'kitchen-2': '1600585152220-90363fe7e115',
    'kitchen-3': '1600607687939-ce8a6c25118c',
    'interior-1': '1600566753086-00f18fb6b3ea',
    'interior-2': '1616486338812-3dadae4b4ace',
    'interior-3': '1586023492125-27b2c045efd7',
    'interior-4': '1600573472550-8090b5e0745e',
    'interior-5': '1600566753190-17f0baa2a6c3'
  };
  for (const [name, id] of Object.entries(unsplash)) {
    const file = path.join(IMG, 'site', `${name}.jpg`);
    try {
      const buf = await fetchBuf(`https://images.unsplash.com/photo-${id}?w=1800&q=82&auto=format&fit=crop`);
      await save(buf, file, 1800, 82);
    } catch (e) {
      console.error('unsplash', name, e.message);
    }
  }

  console.log('DONE');
})();
