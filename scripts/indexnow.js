/* Submit every URL in public/sitemap.xml to IndexNow (Bing, Yandex, Seznam, Naver share submissions).
   Run after deploy:  node scripts/indexnow.js
   Requires the key file https://<domain>/<key>.txt to be live. */
const fs = require('fs');
const path = require('path');
const { site } = require('./lib');
const { INDEXNOW_KEY } = require('./indexnow-key');

(async () => {
  const xml = fs.readFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), 'utf8');
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(/&amp;/g, '&'));
  const host = new URL(site.domain).host;
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: `${site.domain}/${INDEXNOW_KEY}.txt`, urlList })
  });
  console.log(`IndexNow: ${urlList.length} URL gönderildi → HTTP ${res.status} ${res.statusText}`);
  if (res.status >= 400) console.log(await res.text());
})();
