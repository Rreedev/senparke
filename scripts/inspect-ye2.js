const fs = require('fs');
const cheerio = require('cheerio');
const h = fs.readFileSync('data/ye-product.html', 'utf8');
const $ = cheerio.load(h);
$('script[type="application/ld+json"]').each((i, el) => {
  const txt = $(el).html();
  if (txt.includes('"Product"')) {
    console.log('--- PRODUCT JSONLD ---');
    console.log(txt.slice(0, 4000));
  }
});
console.log('--- title ---', $('title').text());
console.log('--- h1 ---', $('h1').first().text().trim());
