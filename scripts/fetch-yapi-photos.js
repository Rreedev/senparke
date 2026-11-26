/* Taha Şen Yapı — kamu malı (CC0 / Public Domain) aday fotoğraflar
   Kaynak: Openverse (api.openverse.org) üzerinden yalnızca license=cc0,pdm
   Çıktı: brand/yapi-src/<id>.jpg + brand/yapi-src/kaynaklar.json (lisans kaydı)
   Kullanım: node scripts/fetch-yapi-photos.js */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const OUT = path.join(__dirname, '..', 'brand', 'yapi-src');
const UA = 'senparke-site-builder/1.0';

/* Openverse id prefix → search query used to resolve the full record */
const PICKS = [
  ['c1b50270', 'construction crane city'], ['5beb7810', 'building under construction'],
  ['e66102dc', 'construction crane city'], ['e37302fb', 'building under construction'],
  ['21a0f0f3', 'building under construction'], ['386184d2', 'construction crane city'],
  ['5a4d1a18', 'demolition building'], ['0ad6f5f2', 'renovated facade'],
  ['e23d39f6', 'modern apartment building'], ['60f48e46', 'modern residential building'],
  ['52a20e24', 'scaffolding building'], ['902b84e2', 'modern residential building'],
  ['0f8aad32', 'modern apartment building'], ['27fe4109', 'modern residential building'],
  ['448e61e4', 'modern apartment building'], ['aa217614', 'modern residential building'],
  ['330da6e6', 'residential building balcony'], ['7861e654', 'tower crane'],
  ['dc597d23', 'scaffolding building']
];

async function json(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const cache = {};
  const records = [];
  for (const [prefix, q] of PICKS) {
    try {
      if (!cache[q]) {
        const a = await json(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license=cc0,pdm&page_size=20&size=large`);
        const b = await json(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license=cc0,pdm&page_size=20&source=wikimedia,wordpress&size=large`);
        cache[q] = [...(a.results || []), ...(b.results || [])];
      }
      const rec = cache[q].find(r => r.id.startsWith(prefix));
      if (!rec) { console.warn('not found', prefix); continue; }
      if (!/^(cc0|pdm)$/.test(rec.license)) { console.warn('skip license', prefix, rec.license); continue; }
      let src = rec.url;
      if (rec.source === 'wikimedia') {
        const file = decodeURIComponent(src.split('/').pop().split('?')[0]);
        src = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=2400`;
      }
      const res = await fetch(src, { headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error('img HTTP ' + res.status);
      const buf = Buffer.from(await res.arrayBuffer());
      await sharp(buf).rotate().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 88 }).toFile(path.join(OUT, `${prefix}.jpg`));
      records.push({ id: prefix, title: rec.title, license: rec.license, license_url: rec.license_url,
        creator: rec.creator || '', source: rec.source, landing: rec.foreign_landing_url, file: `${prefix}.jpg` });
      console.log('✓', prefix, rec.source, (rec.title || '').slice(0, 50));
    } catch (e) { console.warn('✗', prefix, e.message); }
  }
  fs.writeFileSync(path.join(OUT, 'kaynaklar.json'), JSON.stringify(records, null, 2));
  console.log(records.length, 'görsel indirildi');
})();
