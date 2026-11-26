/* Avcılar showroom & depo fotoğrafları — sadık rötuş.
   Kaynak: senparkefotograf/ (WhatsApp, 1536x2048)
   Çıktı:  public/images/showroom/<slug>.jpg  +  public/data/showroom.json
   Yapılan: beyaz dengesi (gri dünya, kısmi), seviye (yüzdelik) germe, yumuşak S-eğrisi
   ve gölge açma, hafif doygunluk, keskinlik; gece çekiminde hafif gürültü azaltma.
   Kadraj, perspektif ve içerik değişmez: mekân neyse o görünür.
   Kullanım: node scripts/enhance-showroom.js */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = path.join(__dirname, '..', 'senparkefotograf');
const OUT = path.join(__dirname, '..', 'public', 'images', 'showroom');

/* index = position in the alphabetically sorted source folder (1-based) */
const PICKS = [
  { n: 9, slug: 'magaza-cephesi', cap: 'Mağaza cephesi', cat: 'magaza', night: true },
  { n: 7, slug: 'showroom-genel', cap: 'Showroom ve numune alanı', cat: 'showroom' },
  { n: 2, slug: 'showroom-ofis', cap: 'Ofis ve numune duvarı', cat: 'showroom' },
  { n: 14, slug: 'showroom-numune-standi', cap: 'Numune standları', cat: 'showroom' },
  { n: 5, slug: 'depo-stok', cap: 'Ana depo, stoktaki ürünler', cat: 'depo' },
  { n: 12, slug: 'depo-genel', cap: 'Ana depo', cat: 'depo' },
  { n: 17, slug: 'depo-koridor-kartela', cap: 'Depo koridoru ve renk kartelası', cat: 'depo' },
  { n: 27, slug: 'depo-laminat-stok', cap: 'Laminat parke stokları', cat: 'depo' },
  { n: 24, slug: 'depo-panel-stok', cap: 'Panel ve parke stokları', cat: 'depo' }
];

const clamp = (v) => v < 0 ? 0 : v > 255 ? 255 : v;

function percentile(hist, total, p) {
  let acc = 0;
  for (let i = 0; i < 256; i++) { acc += hist[i]; if (acc >= total * p) return i; }
  return 255;
}

async function enhance(file, opt) {
  let base = sharp(file).rotate();
  if (opt.night) base = base.median(3);
  const { data, info } = await base.removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const n = info.width * info.height;

  /* 1. white balance: neutralise bright, low-chroma areas (ceilings, walls, signage) */
  const lumHist = new Array(256).fill(0);
  for (let i = 0; i < data.length; i += 3) lumHist[Math.round(0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2])]++;
  const wLo = percentile(lumHist, n, 0.55), wHi = percentile(lumHist, n, 0.985);
  let sr = 0, sg = 0, sb = 0, cnt = 0;
  for (let i = 0; i < data.length; i += 3) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (y < wLo || y > wHi) continue;
    if (Math.max(r, g, b) - Math.min(r, g, b) > 34) continue;
    sr += r; sg += g; sb += b; cnt++;
  }
  if (!cnt) { sr = sg = sb = 1; cnt = 1; }
  const mr = sr / cnt, mg = sg / cnt, mb = sb / cnt, m = (mr + mg + mb) / 3;
  const k = opt.night ? 0.5 : 0.85;
  const gain = [mr, mg, mb].map(c => Math.min(1.18, Math.max(0.86, 1 + (m / c - 1) * k)));

  /* blurred luminance for local contrast ("clarity") */
  const blurW = Math.round(info.width / 4), blurH = Math.round(info.height / 4);
  const small = await sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } })
    .resize(blurW, blurH).greyscale().blur(7).raw().toBuffer();
  const blurAt = (x, y) => small[Math.min(blurH - 1, y >> 2) * blurW + Math.min(blurW - 1, x >> 2)];

  /* 2. luminance histogram after WB for the level stretch */
  const hist = new Array(256).fill(0);
  for (let i = 0; i < data.length; i += 3) {
    const y = 0.2126 * data[i] * gain[0] + 0.7152 * data[i + 1] * gain[1] + 0.0722 * data[i + 2] * gain[2];
    hist[clamp(Math.round(y))]++;
  }
  const lo = percentile(hist, n, opt.night ? 0.008 : 0.005);
  const hi = percentile(hist, n, 0.997);
  const span = Math.max(80, hi - lo);
  const meanY = hist.reduce((a, c, i) => a + c * i, 0) / n;

  /* 3. tone curve: stretch → shadow lift → S, built as a LUT */
  const lift = opt.night ? 0.22 : meanY < 115 ? 0.14 : 0.08;
  const sAmt = opt.night ? 0.25 : 0.36;
  const lut = new Float32Array(256);
  for (let v = 0; v < 256; v++) {
    let x = Math.min(1, Math.max(0, (v - lo) / span));
    x = x + lift * x * (1 - x) * (1 - x) * 2.2;           // open shadows, keep highlights
    const s = x * x * (3 - 2 * x);                         // smoothstep S
    x = x * (1 - sAmt) + s * sAmt;
    lut[v] = Math.min(255, x * 255);
  }

  /* 4. apply WB + curve + clarity on luminance (hue kept), then vibrance */
  const clarity = opt.night ? 0.18 : 0.32;
  const vib = opt.night ? 0.10 : 0.2;
  const out = Buffer.alloc(data.length);
  for (let i = 0, px = 0; i < data.length; i += 3, px++) {
    const x = px % info.width, yy = (px / info.width) | 0;
    let r = data[i] * gain[0], g = data[i + 1] * gain[1], b = data[i + 2] * gain[2];
    const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    let ny = lut[clamp(Math.round(y))];
    /* clarity: push luminance away from its local average; fades out in deep shadow and highlight */
    const local = blurAt(x, yy);
    const mid = 1 - Math.abs(ny / 127.5 - 1);
    ny = ny + (y - local) * clarity * (0.35 + 0.65 * mid);
    ny = Math.max(0, Math.min(255, ny));
    const f = y > 1 ? ny / y : 1;
    r *= f; g *= f; b *= f;
    const y2 = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const chroma = (Math.max(r, g, b) - Math.min(r, g, b)) / 255;
    const sat = 1 + vib * Math.max(0, 1 - chroma * 2.2);   // vibrance: weak colours gain more
    out[i] = clamp(Math.round(y2 + (r - y2) * sat));
    out[i + 1] = clamp(Math.round(y2 + (g - y2) * sat));
    out[i + 2] = clamp(Math.round(y2 + (b - y2) * sat));
  }

  return sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
    .resize({ width: 1350 })
    .sharpen({ sigma: 0.9, m1: 0.6, m2: 1.6 })
    .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const files = fs.readdirSync(SRC).filter(f => /\.jpe?g$/i.test(f)).sort();
  const manifest = [];
  for (const p of PICKS) {
    const src = path.join(SRC, files[p.n - 1]);
    const pipe = await enhance(src, p);
    await pipe.toFile(path.join(OUT, `${p.slug}.jpg`));
    manifest.push({ src: `/images/showroom/${p.slug}.jpg`, cap: p.cap, cat: p.cat, source: files[p.n - 1] });
    console.log('✓', p.slug);
  }
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'data', 'showroom.json'), JSON.stringify(manifest, null, 2));
  console.log(`${manifest.length} fotoğraf → ${OUT}`);
})();
