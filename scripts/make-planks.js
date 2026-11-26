/* Builds horizontal plank textures for the home hero from AGT decor swatches.
   The swatches have vertical grain; rotating them 90° gives long horizontal boards.
   Usage: node scripts/make-planks.js */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = path.join(__dirname, '..', 'public', 'images', 'agt');
const OUT = path.join(__dirname, '..', 'public', 'images', 'planks');

const DECORS = [
  'concept-neo-vieste', 'concept-neo-scala', 'concept-neo-moderna', 'concept-neo-portello',
  'concept-neo-dorino', 'effect-premium-altay', 'effect-premium-solaro', 'natura-line-liva',
  'natura-line-mira', 'pera-icon-erguvan', 'pera-icon-gerbera', 'effect-premium-ural'
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const name of DECORS) {
    const src = path.join(SRC, `agt-${name}-2.jpg`);
    if (!fs.existsSync(src)) { console.warn('missing', src); continue; }
    await sharp(src).rotate(90).modulate({ saturation: 0.92 }).jpeg({ quality: 84, mozjpeg: true })
      .toFile(path.join(OUT, `${name}.jpg`));
  }
  console.log(`Plank textures → ${OUT}`);
})();

module.exports = { DECORS };
