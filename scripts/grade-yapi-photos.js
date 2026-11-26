/* Taha Şen Yapı — kamu malı fotoğrafları marka paletine göre renklendirir.
   Palet: fırçalanmış pirinç · mat siyah · kırık beyaz
   Yöntem: ışıklılığı paletin gradyanına eşle (gradient map), orijinalle karıştır, hafif kontrast.
   Çıktı: public/images/yapi/<slug>.jpg + public/data/yapi-images.json
   Kullanım: node scripts/grade-yapi-photos.js */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = path.join(__dirname, '..', 'brand', 'yapi-src');
const OUT = path.join(__dirname, '..', 'public', 'images', 'yapi');

const PICKS = [
  { id: '386184d2', slug: 'hero-vinc-gece', mix: 0.55, w: 2400 },
  { id: '5a4d1a18', slug: 'kentsel-donusum-yikim', mix: 0.6, w: 2000 },
  { id: '52a20e24', slug: 'kat-karsiligi-karkas', mix: 0.55, w: 1500 },
  { id: '21a0f0f3', slug: 'sifirdan-bina-vinc', mix: 0.55, w: 2200 },
  { id: 'dc597d23', slug: 'restorasyon-iskele', mix: 0.6, w: 2000 },
  { id: '0ad6f5f2', slug: 'restorasyon-cephe', mix: 0.55, w: 2000 },
  { id: '0f8aad32', slug: 'mimari-dokunus-cephe', mix: 0.5, w: 1400 },
  { id: '330da6e6', slug: 'mimari-dokunus-merdiven', mix: 0.55, w: 1400 },
  { id: '902b84e2', slug: 'konut-cephe', mix: 0.5, w: 1500 },
  { id: '448e61e4', slug: 'konut-yesil', mix: 0.5, w: 1500 },
  { id: '27fe4109', slug: 'konut-kule', mix: 0.5, w: 1400 },
  { id: 'e37302fb', slug: 'hafriyat', mix: 0.6, w: 2000 },
  { id: 'c1b50270', slug: 'santiye-vinc', mix: 0.55, w: 2000 }
];

/* mat siyah → koyu grafit → fırçalanmış pirinç → kırık beyaz */
const STOPS = [[0, [0x0e, 0x0d, 0x0c]], [0.34, [0x2a, 0x27, 0x22]], [0.66, [0xa8, 0x86, 0x52]], [1, [0xf1, 0xec, 0xe2]]];
function gradient(t) {
  for (let i = 1; i < STOPS.length; i++) {
    if (t <= STOPS[i][0]) {
      const [t0, c0] = STOPS[i - 1], [t1, c1] = STOPS[i];
      const k = (t - t0) / (t1 - t0);
      return c0.map((v, j) => v + (c1[j] - v) * k);
    }
  }
  return STOPS[STOPS.length - 1][1];
}
const LUT = Array.from({ length: 256 }, (_, v) => gradient(v / 255));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const sources = JSON.parse(fs.readFileSync(path.join(SRC, 'kaynaklar.json'), 'utf8'));
  const manifest = [];
  for (const p of PICKS) {
    const file = path.join(SRC, `${p.id}.jpg`);
    const { data, info } = await sharp(file).resize({ width: p.w, withoutEnlargement: true })
      .removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const out = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i += 3) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      let y = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      y = y * y * (3 - 2 * y) * 0.3 + y * 0.7;             // gentle S for contrast
      const m = LUT[Math.round(y * 255)];
      /* the original, desaturated by 55% and warmed, keeps the photo's detail and life */
      const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const o = [l + (r - l) * 0.45 + 6, l + (g - l) * 0.45, l + (b - l) * 0.45 - 8];
      for (let k = 0; k < 3; k++) out[i + k] = Math.max(0, Math.min(255, Math.round(m[k] * p.mix + o[k] * (1 - p.mix))));
    }
    await sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
      .sharpen({ sigma: 0.7 }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(OUT, `${p.slug}.jpg`));
    const s = sources.find(x => x.id === p.id) || {};
    manifest.push({ slug: p.slug, src: `/images/yapi/${p.slug}.jpg`, width: info.width, height: info.height,
      license: s.license, source: s.source, landing: s.landing, title: s.title });
    console.log('ok', p.slug, info.width + 'x' + info.height);
  }
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'data', 'yapi-images.json'), JSON.stringify(manifest, null, 2));
})();
