/* Recompress heavy JPEGs in public/images (page speed / Core Web Vitals).
   Idempotent: only files over LIMIT are touched, and only replaced when the result is smaller.
   Usage: node scripts/optimize-images.js   (deploy.ps1 runs it before every build) */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', 'public', 'images');
const LIMIT = 250 * 1024;
const MAX_W = 1600;

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.jpe?g$/i.test(f) && fs.statSync(p).size > LIMIT) files.push(p);
  }
})(ROOT);

(async () => {
  let before = 0, after = 0, n = 0;
  for (const f of files) {
    const src = fs.readFileSync(f);
    const out = await sharp(src).rotate().resize({ width: MAX_W, withoutEnlargement: true })
      .jpeg({ quality: 74, mozjpeg: true, progressive: true }).toBuffer();
    before += src.length;
    if (out.length < src.length * 0.92) { fs.writeFileSync(f, out); after += out.length; n++; } else after += src.length;
  }
  console.log(`görsel optimizasyonu: ${n}/${files.length} dosya, ${(before / 1048576).toFixed(1)} MB → ${(after / 1048576).toFixed(1)} MB`);
})();
