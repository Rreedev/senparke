/* Google İşletme Profili için görseller
   Çıktı: google-profil/  (logo, kapak, mekân fotoğrafları)
   Google önerileri: logo kare ≥250px, kapak 16:9 ≥1024x576, foto ≥720px, JPG/PNG <5 MB.
   Kullanım: node scripts/make-google-assets.js */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'google-profil');
const SHOW = path.join(ROOT, 'public', 'images', 'showroom');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  /* Logo: mark centred on white with breathing room (Google shows it in a circle) */
  const mark = await sharp(path.join(ROOT, 'public', 'assets', 'logo', 'mark.png')).resize({ width: 640 }).toBuffer();
  await sharp({ create: { width: 1080, height: 1080, channels: 4, background: '#ffffff' } })
    .composite([{ input: mark, gravity: 'center' }]).flatten({ background: '#ffffff' })
    .png().toFile(path.join(OUT, '01-logo-kare.png'));

  /* Full lock-up on white, for posts or where a wide logo fits */
  const lock = await sharp(path.join(ROOT, 'public', 'assets', 'logo', 'logo.png')).resize({ width: 1500 }).toBuffer();
  await sharp({ create: { width: 1800, height: 720, channels: 4, background: '#ffffff' } })
    .composite([{ input: lock, gravity: 'center' }]).flatten({ background: '#ffffff' })
    .jpeg({ quality: 92 }).toFile(path.join(OUT, '02-logo-yatay.jpg'));

  /* Cover 16:9: a horizontal band of the real showroom (no invented content, only cropped) */
  const src = path.join(SHOW, 'showroom-genel.jpg');
  const meta = await sharp(src).metadata();
  const h = Math.round(meta.width * 9 / 16);
  const top = Math.round(meta.height * 0.40);
  await sharp(src).extract({ left: 0, top: Math.min(top, meta.height - h), width: meta.width, height: h })
    .jpeg({ quality: 90 }).toFile(path.join(OUT, '03-kapak-showroom.jpg'));

  /* Place photos as they appear on the site */
  const order = ['magaza-cephesi', 'showroom-genel', 'showroom-ofis', 'showroom-numune-standi',
    'depo-stok', 'depo-genel', 'depo-koridor-kartela', 'depo-laminat-stok', 'depo-panel-stok'];
  order.forEach((slug, i) => fs.copyFileSync(path.join(SHOW, `${slug}.jpg`), path.join(OUT, `${String(i + 4).padStart(2, '0')}-${slug}.jpg`)));

  console.log(fs.readdirSync(OUT).join('\n'));
})();
