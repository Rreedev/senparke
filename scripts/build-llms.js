/* =========================================================
   llms.txt: a plain-language map of the site for AI assistants
   (ChatGPT, Claude, Perplexity, Gemini). Facts only, each line quotable,
   every figure taken from the same data the pages are built from.
   Spec: https://llmstxt.org
   ========================================================= */
const fs = require('fs');
const path = require('path');
const { PUB, site, stats, paths, AREAS } = require('./lib');
const { collections } = require('./build-helpers');
const { SERVICES, DISTRICTS, YP, Y } = require('./build-yapi');

function buildLlms() {
  const d = site.domain;
  const lam = collections.filter(c => c.category === 'Laminat Parke');
  const byBrand = (b) => lam.filter(c => c.brand === b).map(c => c.name).join(', ');

  const txt = `# Şen Parke

> Şen Parke, 1978’de ${site.founder} tarafından kurulan, İstanbul Avcılar’da laminat parke, MDF panel ve mutfak dolabı satışı ve montajı yapan aile işletmesidir. Showroom, ofis ve 1000 m² ana depo aynı adrestedir. Kardeş kuruluşu Taha Şen Yapı; kentsel dönüşüm, kat karşılığı inşaat, sıfırdan yapı, renovasyon ve restorasyon hizmeti verir.

## Temel bilgiler

- Adres: ${site.address}
- Çalışma saatleri: Hafta içi ve cumartesi 08:00–21:00; pazar kapalı
- Telefon: ${site.phones.map(p => `${p.name} ${p.number}`).join(' · ')}
- WhatsApp: ${site.phones[0].number}
- Kuruluş: ${site.since}, kurucu ${site.founder}
- Google İşletme Profili: ${site.google}
- Hizmet alanı: İstanbul (keşif ve ölçü İstanbul içinde ücretsiz)
- Fiyatlar: Sitede fiyat yayımlanmaz; marka, seri, metrekare, süpürgelik ve montaj kapsamına göre keşif sonrası yazılı teklif verilir.

## Ürünler

- [Laminat parke](${d}${paths.laminat}): AGT, Çamsan ve Yıldız Entegre markalarından ${stats.laminat} model, ${stats.laminatCollections} koleksiyon.
  - AGT (${stats.agt.models} model): ${byBrand('AGT')}
  - Çamsan (${stats.camsan.models} model): ${byBrand('Çamsan')}
  - Yıldız Entegre (${stats.yildiz.models} model): ${byBrand('Yıldız Entegre')}
- [MDF ve panel](${d}${paths.mdf}): Yıldız Entegre’den ${stats.mdf} ürün (MDFlam, kapak, lak ve boyalı paneller).
- [Mutfak dolabı](${d}${paths.mutfak}): Ölçüye özel üretim; gövde, kapak, tezgâh, donanım ve montaj dahil. Onaydan sonra genellikle 3–6 haftada teslim.
- [Markalar](${d}${paths.markalar}): AGT, Çamsan, Yıldız Entegre (üçü de laminat parke üreticisidir).
- [Ahşap ve masif parke](${d}${paths.ahsap}): Masif ve lamine (çok katmanlı) ahşap parke satışı ve döşemesi; düz, balıksırtı ve Macar desen. Ağaç türü ve stok bilgisi keşifte verilir.
- [Parke sistre ve cila](${d}${paths.sistre}): Masif ve lamine ahşap parkede zımpara, onarım, derz dolgu, yeniden cila veya yağ. Laminat parke sistre edilemez.

## Hizmet süreci

1. Keşif ve ölçü: Mekân yerinde görülür, ölçü alınır (İstanbul içi ücretsiz).
2. Numune ve seçim: Showroomda ya da evde numunelerle seri seçilir.
3. Yazılı teklif: Malzeme, süpürgelik ve işçilik kalem kalem.
4. Montaj ve teslim: Kendi ekibimiz döşer; 100 m² genellikle 1–2 gün sürer.

## Parke hizmet bölgeleri

Merkez Avcılar; İstanbul içinde keşif ve ölçü ücretsiz. Bölge sayfaları:
${AREAS.map(a => `- [${a.name} parke${a.parent ? ` (${a.parent})` : ''}](${d}${paths.parkeArea(a.slug)})${a.hub ? ': showroom ve depo burada' : ''}`).join('\n')}

## Sayfalar

- [Ana sayfa](${d}/)
- [Hakkımızda](${d}${paths.hakkimizda}): 1978’den bugüne Şen Parke
- [Galeri](${d}${paths.galeri}): Avcılar showroom, mağaza ve depo fotoğrafları
- [İletişim](${d}${paths.iletisim}): Adres, harita, telefonlar
- [Ücretsiz keşif ve teklif](${d}${paths.teklif})

## Taha Şen Yapı (${Y.legal})

Avcılar merkezli yapı firması. İletişim: ${Y.person} ${Y.phone}. Ön görüşme ve yerinde inceleme ücretsizdir.

### Hizmetler

${SERVICES.map(s => `- [${s.name}](${d}${YP.svc(s.slug)}): ${s.lead}`).join('\n')}

### Bölgeler

${DISTRICTS.map(x => `- [${x.name}${x.parent ? ` (${x.parent})` : ''}](${d}${YP.dist(x.slug)})${x.hub ? ': merkez' : ''}`).join('\n')}

### Önemli notlar

- Kentsel dönüşüm 6306 sayılı Kanun kapsamında, lisanslı kuruluşun yaptığı riskli yapı tespitiyle başlar.
- Kat karşılığında sabit paylaşım oranı vaat edilmez; oran imar durumu, emsal, konum ve inşaat maliyetine göre hesaplanır ve yazılı teklif verilir. Sözleşme noterde yapılır.
- Taha Şen Yapı sayfalarındaki görseller örnek amaçlıdır (kamu malı fotoğraflar); proje fotoğrafı değildir.

## İsteğe bağlı

- [Site haritası](${d}/sitemap.xml)
- [Ürün verisi (JSON)](${d}/data/products.json)
`;
  fs.writeFileSync(path.join(PUB, 'llms.txt'), txt);
  return txt.length;
}

module.exports = { buildLlms };
