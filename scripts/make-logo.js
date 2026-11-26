/* Produces web logo files from the original artwork (brand/senparke-logo-original.png).
   White is converted to transparency (colour-to-alpha), so the S/P cut stays true
   negative space exactly as in the original: the page background shows through it.
   Outputs (public/assets/logo/):
     logo.png        dark wordmark, for light backgrounds
     logo-light.png  same artwork, wordmark recoloured for dark backgrounds
     mark.png        diamond mark only
     favicon-*.png   icons
   Usage: node scripts/make-logo.js */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = path.join(__dirname, '..', 'brand', 'senparke-logo-original.png');
const OUT = path.join(__dirname, '..', 'public', 'assets', 'logo');

const BOX = { left: 229, top: 276, right: 1462, bottom: 628 }; // whole lock-up, 2–3px air
const MARK_RIGHT = 592;          // diamond ends at x=589
const SEN = [640, 990];          // "Şen" columns
const PARKE = [990, 1470];       // "Parke" columns
const LIGHT_SEN = [241, 235, 226];
const LIGHT_PARKE = [217, 182, 142];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const w = BOX.right - BOX.left;
  const h = BOX.bottom - BOX.top;
  const dark = Buffer.alloc(w * h * 4);
  const light = Buffer.alloc(w * h * 4);
  const BG = 253;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const sx = x + BOX.left, sy = y + BOX.top;
      const i = (sy * W + sx) * 3;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const mn = Math.min(r, g, b);
      let a, un;
      if (sx < MARK_RIGHT) {
        /* mark: wood stays opaque, only near-white (the S/P cut + outside) clears */
        a = Math.max(0, Math.min(1, (248 - mn) / (248 - 178)));
        un = (c) => a ? Math.max(0, Math.min(255, Math.round(255 - (255 - c) / Math.max(a, (255 - mn) / 255 || 1)))) : 0;
      } else {
        /* wordmark: classic colour-to-alpha keeps the antialiasing clean */
        a = Math.max(0, BG - mn) / BG;
        if (a < 0.035) a = 0;
        a = Math.min(1, a * 1.04);
        un = (c) => a ? Math.max(0, Math.min(255, Math.round(255 - (255 - c) / a))) : 0;
      }
      const o = (y * w + x) * 4;
      const A = Math.round(a * 255);
      dark[o] = un(r); dark[o + 1] = un(g); dark[o + 2] = un(b); dark[o + 3] = A;
      /* inside the diamond the light variant keeps the S/P cut light, like the original */
      const inDiamond = Math.abs(sx - 410) / 178 + Math.abs(sy - 451.5) / 172.5 <= 0.995;
      if (sx >= SEN[0] && sx < PARKE[1]) {
        const c = sx < SEN[1] ? LIGHT_SEN : LIGHT_PARKE;
        light[o] = c[0]; light[o + 1] = c[1]; light[o + 2] = c[2];
        light[o + 3] = A;
      } else if (inDiamond) {
        const t = A / 255;
        for (let k = 0; k < 3; k++) light[o + k] = Math.round(dark[o + k] * t + LIGHT_SEN[k] * (1 - t));
        light[o + 3] = 255;
      } else {
        light[o] = dark[o]; light[o + 1] = dark[o + 1]; light[o + 2] = dark[o + 2];
        light[o + 3] = A;
      }
    }
  }

  const raw = { raw: { width: w, height: h, channels: 4 } };
  const TARGET_W = 900;
  await sharp(dark, raw).resize({ width: TARGET_W }).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'logo.png'));
  await sharp(light, raw).resize({ width: TARGET_W }).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'logo-light.png'));

  const markW = MARK_RIGHT - BOX.left;
  const markBuf = await sharp(dark, raw).extract({ left: 0, top: 0, width: markW, height: h }).png().toBuffer();
  await sharp(markBuf).resize({ width: 320 }).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'mark.png'));
  for (const s of [32, 180, 512]) {
    await sharp(markBuf).resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png().toFile(path.join(OUT, `favicon-${s}.png`));
  }
  const meta = await sharp(path.join(OUT, 'logo.png')).metadata();
  console.log('logo', meta.width + 'x' + meta.height, '→', OUT);
})();
