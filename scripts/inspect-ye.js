const fs = require('fs');
const h = fs.readFileSync('data/ye-product.html', 'utf8');
const keys = ['ÜRÜN', 'RENZO', 'Kalınlık', 'Ebat', 'Ambalaj', 'product-detail', 'product-spec', 'Teknik Özellikler', 'özellik'];
for (const k of keys) {
  const i = h.indexOf(k);
  console.log('---', k, i);
  if (i > -1) console.log(h.slice(Math.max(0, i - 700), i + 2200).replace(/\s+/g, ' ').slice(0, 2900));
}
