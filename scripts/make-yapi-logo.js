/* Taha Şen Yapı logosu — orijinal görselden (brand/tahasen-logo-original.png)
   Siyah zemin şeffaflığa çevrilir (black-to-alpha), altın ve krem tonlar aynen kalır.
   Çıktı (public/assets/logo/):
     tahasen-logo.png        orijinal dizilim (işaret üstte, yazı altta)
     tahasen-logo-yatay.png  header için: solda işaret, sağda TAHA ŞEN + unvan
     tahasen-mark.png        yalnızca bina işareti
     tahasen-favicon-*.png
   Kullanım: node scripts/make-yapi-logo.js */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = path.join(__dirname, '..', 'brand', 'tahasen-logo-original.png');
const OUT = path.join(__dirname, '..', 'public', 'assets', 'logo');

async function blackToAlpha(region) {
  const { data, info } = await sharp(SRC).extract(region).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, o = 0; i < data.length; i += 3, o += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const m = Math.max(r, g, b);
    let a = m < 18 ? 0 : Math.min(1, (m - 10) / 150);      // dark → transparent, gold stays opaque
    out[o] = a ? Math.min(255, Math.round(r / Math.max(a, m / 255))) : 0;
    out[o + 1] = a ? Math.min(255, Math.round(g / Math.max(a, m / 255))) : 0;
    out[o + 2] = a ? Math.min(255, Math.round(b / Math.max(a, m / 255))) : 0;
    out[o + 3] = Math.round(a * 255);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

async function bbox(region) {
  const { data, info } = await sharp(SRC).extract(region).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, x1 = 0, y0 = info.height, y1 = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 3;
    if (Math.max(data[i], data[i + 1], data[i + 2]) > 40) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  return { left: region.left + x0, top: region.top + y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const full = await bbox({ left: 0, top: 0, width: 1254, height: 1254 });
  const pad = (r, p) => ({ left: Math.max(0, r.left - p), top: Math.max(0, r.top - p), width: Math.min(1254 - Math.max(0, r.left - p), r.width + 2 * p), height: Math.min(1254 - Math.max(0, r.top - p), r.height + 2 * p) });

  /* 1. original stacked lock-up */
  await sharp(await blackToAlpha(pad(full, 8))).resize({ width: 900 }).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'tahasen-logo.png'));

  /* 2. mark only (rows 300–705) */
  const markBox = await bbox({ left: 0, top: 300, width: 1254, height: 405 });
  const mark = await blackToAlpha(pad(markBox, 6));
  await sharp(mark).resize({ height: 300 }).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'tahasen-mark.png'));

  /* 3. horizontal lock-up: mark | name over legal line */
  const nameBox = await bbox({ left: 0, top: 735, width: 1254, height: 115 });
  const legalBox = await bbox({ left: 0, top: 850, width: 1254, height: 70 });
  const H = 200;
  const markImg = await sharp(mark).resize({ height: H }).toBuffer();
  const markW = (await sharp(markImg).metadata()).width;
  const nameImg = await sharp(await blackToAlpha(pad(nameBox, 4))).resize({ height: 104 }).toBuffer();
  const nameW = (await sharp(nameImg).metadata()).width;
  const legalImg = await sharp(await blackToAlpha(pad(legalBox, 4))).resize({ width: nameW }).toBuffer();
  const legalH = (await sharp(legalImg).metadata()).height;
  const gap = 34;
  const W = markW + gap + nameW;
  const textTop = Math.round((H - (104 + 14 + legalH)) / 2) + 8;
  await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: markImg, left: 0, top: 0 },
      { input: nameImg, left: markW + gap, top: textTop },
      { input: legalImg, left: markW + gap, top: textTop + 104 + 14 }
    ]).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'tahasen-logo-yatay.png'));

  /* 4. favicons on matte black */
  for (const s of [32, 180, 512]) {
    const m = await sharp(mark).resize({ width: Math.round(s * 0.82), height: Math.round(s * 0.82), fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
    await sharp({ create: { width: s, height: s, channels: 4, background: '#121110' } })
      .composite([{ input: m, gravity: 'center' }]).png().toFile(path.join(OUT, `tahasen-favicon-${s}.png`));
  }
  const meta = await sharp(path.join(OUT, 'tahasen-logo-yatay.png')).metadata();
  console.log('yatay', meta.width + 'x' + meta.height);
})();
