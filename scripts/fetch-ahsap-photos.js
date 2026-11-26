/* Ahşap / masif parke ve sistre sayfaları için kamu malı (CC0 / PD) fotoğraflar.
   Çamsan, AGT ve Yıldız Entegre masif/ahşap parke üretmediği için marka görseli yoktur.
   Kaynak: Openverse (yalnızca license=cc0,pdm). Lisans kaydı: brand/ahsap-src/kaynaklar.json
   Çıktı: public/images/ahsap/<slug>.jpg + public/data/ahsap-images.json
   Kullanım: node scripts/fetch-ahsap-photos.js */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = path.join(__dirname, '..', 'brand', 'ahsap-src');
const OUT = path.join(__dirname, '..', 'public', 'images', 'ahsap');
const UA = 'senparke-site-builder/1.0';

const PICKS = [
  { id: '5bd8dc08-8e80-434c-92cc-4cdaaa0145c2', slug: 'masif-salon', alt: 'Cilalı masif ahşap parkeli geniş, boş bir salon' },
  { id: '99c7b292-cabb-4609-9374-bf76210e861e', slug: 'baliksirti', alt: 'Balıksırtı desenli meşe ahşap parke' },
  { id: 'f6c0ec36-8f6e-4b24-a09b-4e8a5c0d0347', slug: 'masif-tahta', alt: 'Koyu tonlu, geniş masif ahşap parke tahtaları' },
  { id: '68f12845-75a0-4092-b2be-bcdac82af7b5', slug: 'ahsap-oda', alt: 'Kızıl tonlu ahşap parkeli klasik bir oda' },
  { id: 'cb26aa2e-5ae7-4be8-a59f-19ef6dd767b3', slug: 'ahsap-yasam', alt: 'Ahşap zeminli, aydınlık bir oturma ve yemek alanı' },
  /* Public-domain painting (1875); the Wikimedia Commons scan is far sharper than the Openverse copy */
  { id: '8e8015d0-e8fc-47d4-874c-41bac67d9625', slug: 'sistre-caillebotte', alt: 'Gustave Caillebotte, Parke Rendeleyenler (1875): ahşap zemini rendeleyen ustalar',
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent('Gustave Caillebotte - The Floor Planers - Google Art Project.jpg') + '?width=2400' },
  { id: 'b4d95a78-2f4b-41be-8524-d3105cda6bc5', slug: 'sistre-cilali', alt: 'Sistre ve cila sonrası parlayan hasır desen ahşap parke' },
  { id: '78919718-0fbc-4c72-be16-d5c3935c7548', slug: 'sistre-oncesi', alt: 'Zamanla çizilmiş ve matlaşmış eski ahşap parke' }
];

async function json(url) {
  for (let i = 0; i < 4; i++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    const t = await r.text();
    if (t.startsWith('{')) return JSON.parse(t);
    await new Promise(z => setTimeout(z, 6000 * (i + 1)));
  }
  throw new Error('API limit');
}

(async () => {
  fs.mkdirSync(SRC, { recursive: true });
  fs.mkdirSync(OUT, { recursive: true });
  const records = [], manifest = [];
  for (const p of PICKS) {
    try {
      const rec = await json(`https://api.openverse.org/v1/images/${p.id}/`);
      if (!/^(cc0|pdm)$/.test(rec.license)) { console.warn('skip license', p.slug, rec.license); continue; }
      let src = p.src || rec.url;
      /* Openverse returns rawpixel's 1024 px preview; the same public-domain file is served at 1300 px */
      if (rec.source === 'rawpixel') src = src.replace('/editor_1024/', '/image_1300/');
      if (!p.src && rec.source === 'wikimedia') {
        const file = decodeURIComponent(src.split('/').pop().split('?')[0]);
        src = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=2400`;
      }
      const res = await fetch(src, { headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error('img HTTP ' + res.status);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(path.join(SRC, `${p.slug}.orig`), buf);
      /* natural look: no brand grading, only size, a touch of contrast and sharpening */
      const info = await sharp(buf).rotate().resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
        .linear(1.04, -4).sharpen({ sigma: 0.6 }).jpeg({ quality: 82, mozjpeg: true })
        .toFile(path.join(OUT, `${p.slug}.jpg`));
      records.push({ slug: p.slug, id: rec.id, title: rec.title, license: rec.license, license_url: rec.license_url,
        creator: rec.creator || '', source: rec.source, landing: rec.foreign_landing_url });
      manifest.push({ slug: p.slug, src: `/images/ahsap/${p.slug}.jpg`, alt: p.alt, width: info.width, height: info.height, license: rec.license, landing: rec.foreign_landing_url });
      console.log('✓', p.slug, rec.source, info.width + 'x' + info.height);
    } catch (e) { console.warn('✗', p.slug, e.message); }
    await new Promise(z => setTimeout(z, 1500));
  }
  fs.writeFileSync(path.join(SRC, 'kaynaklar.json'), JSON.stringify(records, null, 2));
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'data', 'ahsap-images.json'), JSON.stringify(manifest, null, 2));
  console.log(manifest.length, 'görsel hazır');
})();
