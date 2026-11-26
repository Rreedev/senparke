const fs = require('fs');
const cheerio = require('cheerio');
const h = fs.readFileSync('data/ye-product.html', 'utf8');
const $ = cheerio.load(h);
console.log('og:image', $('meta[property="og:image"]').attr('content'));
const imgs = new Set();
$('img').each((i, el) => {
  const s = $(el).attr('src') || $(el).attr('data-src') || '';
  if (s) imgs.add(s);
});
console.log([...imgs].filter(x => !x.includes('svg') && !x.includes('logo') && !x.includes('icon')).slice(0, 40).join('\n'));
