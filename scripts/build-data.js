const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const PUB = path.join(ROOT, 'public');
const DATA = path.join(ROOT, 'data');

const AGT_COLLECTION_NAMES = {
  'effect-aqua-block': 'Effect Aqua Block',
  'mood-xlarge': 'Mood XLarge',
  'pera-icon': 'Pera Icon',
  'effect-elegance': 'Effect Elegance',
  'marco-polo-premium': 'Marco Polo Premium',
  'effect-premium': 'Effect Premium',
  'yoga-collection-premium': 'Yoga Collection Premium',
  'pera': 'Pera Collection',
  'concept-neo': 'Concept Neo',
  'armonia-slim': 'Armonia Slim',
  'foresta-xlarge': 'Foresta XLarge',
  'pruva-xl': 'Pruva XLarge',
  'pera-collection-8-mm': 'Pera Collection 8 mm',
  'effect': 'Effect',
  'armonia-large': 'Armonia Large',
  'yoga': 'Yoga Collection',
  'marco-polo': 'Marco Polo',
  'natura-line': 'Natura Line',
  'luna': 'Luna',
  'natura-select': 'Natura Select',
  'bella-neo': 'Bella Neo',
  'corvina': 'Corvina',
  'effect-8-2': 'Effect 8+2'
};

const trTitle = (s) => (s || '')
  .toLocaleLowerCase('tr-TR')
  .replace(/(^|[\s(])([a-zçğıöşü])/g, (m, a, b) => a + b.toLocaleUpperCase('tr-TR'));

const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

function cleanMeasure(s) {
  if (!s) return '';
  return clean(String(s)
    .replace(/\s*x\s*\d+[.,]?\d*\s*in(ch)?\b/gi, '')
    .replace(/\s*\d+[.,]?\d*\s*in(ch)?\b/gi, '')
    .replace(/\s*x\s*$/i, '')
    .replace(/\s+/g, ' '));
}

function parseThickness(s) {
  const m = String(s || '').match(/(\d+(?:[.,]\d+)?(?:\s*\+\s*\d+)?)\s*mm/i);
  return m ? m[1].replace(/\s+/g, ' ') + ' mm' : '';
}

function parseJoint(s) {
  const v = String(s || '').toLocaleLowerCase('tr-TR');
  if (v.includes('micro') || v.includes('mikro')) return 'Mikro Derz';
  if (v.includes('derzsiz')) return 'Derzsiz';
  if (v.includes('derzli')) return 'Derzli';
  return '';
}

function parseSurface(s) {
  const m = String(s || '').match(/AC\s*3|AC\s*4|AC\s*5/i);
  if (!m) return '';
  return m[0].replace(/\s+/g, '').toUpperCase().replace('AC', 'AC');
}

function parseSize(s) {
  const v = cleanMeasure(s);
  return v.replace(/\s*x\s*/gi, ' x ');
}

function decorNormalize(s) {
  const v = String(s || '').toLocaleLowerCase('tr-TR');
  if (v.includes('taş') || v.includes('beton') || v.includes('mermer')) return 'Taş & Beton';
  if (v.includes('ahşap') || v.includes('meşe') || v.includes('çam') || v.includes('ceviz') || v.includes('kestane') || v.includes('akça')) return 'Ahşap';
  if (v.includes('tasarım') || v.includes('desen')) return 'Tasarım';
  return '';
}

function cleanAgtName(n) {
  return clean(n).replace(/\s+/g, ' ');
}

function cleanYildizName(name, group) {
  let n = String(name || '');
  n = n.replace(/\s+Parke\s+[A-Z0-9_]+$/i, '');
  n = n.replace(/\s+Süpürgelik\s+[A-Z0-9_]+$/i, '');
  n = trTitle(n);
  return clean(n);
}

async function imageInfo(rel) {
  if (!rel) return { tone: '', hex: '' };
  const file = path.join(PUB, rel.replace(/^\//, ''));
  if (!fs.existsSync(file)) return { tone: '', hex: '' };
  try {
    let img = sharp(file).trim({ threshold: 8 });
    const buf = await img.resize(64, 64, { fit: 'cover' }).raw().toBuffer({ resolveWithObject: true });
    const { data, info } = buf;
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += info.channels) {
      r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
    }
    r = Math.round(r / count); g = Math.round(g / count); b = Math.round(b / count);
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const tone = lum > 168 ? 'Açık' : lum > 108 ? 'Orta' : 'Koyu';
    const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    return { tone, hex };
  } catch (e) {
    return { tone: '', hex: '' };
  }
}

function idFor(brand, collectionSlug, slug) {
  return `${brand}-${collectionSlug}-${slug}`.toLocaleLowerCase('tr-TR')
    .replace(/[çğıöşü]/g, c => ({ 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' }[c]))
    .replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

(async () => {
  const agt = JSON.parse(fs.readFileSync(path.join(DATA, 'agt.json'), 'utf8'));
  const ye = JSON.parse(fs.readFileSync(path.join(DATA, 'yildiz.json'), 'utf8'));
  const products = [];

  // ---- AGT ----
  for (const p of agt.products) {
    const collection = AGT_COLLECTION_NAMES[p.collectionSlug] || trTitle(p.collectionName || p.collectionSlug);
    const specs = p.specs || {};
    const thickness = parseThickness(specs['Kalınlık'] || p.tags.find(t => /mm/i.test(t)) || '');
    const size = parseSize(specs['Ebat'] || [specs['En'], specs['Boy']].filter(Boolean).join(' x '));
    const joint = parseJoint(specs['Kenar'] || p.tags.find(t => /derz/i.test(t)) || '');
    const surface = parseSurface(specs['Yüzey Dayanımı'] || '');
    const decor = decorNormalize(specs['Desen']) || 'Ahşap';
    const localImages = p.localImages || [];
    const info = await imageInfo(localImages[1] || localImages[0]);
    const tone = specs['Renk'] || info.tone;
    const specClean = {};
    for (const [k, v] of Object.entries(specs)) {
      specClean[k] = cleanMeasure(v);
    }
    products.push({
      id: idFor('agt', p.collectionSlug, p.slug),
      brand: 'AGT',
      brandSlug: 'agt',
      category: 'Laminat Parke',
      name: cleanAgtName(p.name),
      code: p.code || '',
      collection,
      collectionSlug: p.collectionSlug,
      description: p.description || p.shortDescription || '',
      shortDescription: p.shortDescription || '',
      images: localImages,
      image: localImages[0] || '',
      cardImage: localImages[1] || localImages[0] || '',
      tone: tone || 'Orta',
      colorHex: info.hex || '#b79b7a',
      decor,
      thickness,
      size,
      surface,
      joint,
      package: specClean['Paket'] || '',
      specs: specClean,
      tags: Array.from(new Set([...(p.tags || []), ...(p.features || [])])).filter(Boolean),
      sourceUrl: p.url,
      url: `urun/${idFor('agt', p.collectionSlug, p.slug)}/`
    });
  }

  // ---- Yıldız ----
  for (const p of ye.products) {
    const isSkirting = p.group === 'Süpürgelik';
    if (isSkirting) continue; // kapsam: yalnızca laminat parke
    const collection = (p.collection || p.group || '').replace(/TerraClick 8mm/i, 'TerraClick 8 mm');
    const localImages = p.localImages || [];
    const info = await imageInfo(localImages[0]);
    const tone = p.specs?.['Renk Tonları'] || info.tone;
    const specs = {};
    for (const [k, v] of Object.entries(p.specs || {})) {
      specs[k] = cleanMeasure(String(v).replace(/<br\s*\/?>/gi, ' / '));
    }
    const id = idFor('yildiz', isSkirting ? 'supurgelik' : p.group, p.slug);
    products.push({
      id,
      brand: 'Yıldız Entegre',
      brandSlug: 'yildiz',
      category: isSkirting ? 'Süpürgelik & Aksesuar' : 'Laminat Parke',
      name: cleanYildizName(p.name, p.group),
      code: p.sku || '',
      collection: isSkirting ? 'Süpürgelik' : collection,
      collectionSlug: isSkirting ? 'supurgelik' : (p.group || '').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9]+/g, '-'),
      description: p.description || '',
      shortDescription: (p.description || '').slice(0, 180),
      images: localImages,
      image: localImages[0] || '',
      cardImage: localImages[0] || '',
      tone: tone || 'Orta',
      colorHex: info.hex || '#b79b7a',
      decor: isSkirting ? '' : (decorNormalize(p.decor) || 'Ahşap'),
      thickness: isSkirting ? '' : parseThickness(p.thickness),
      size: isSkirting ? (specs['Ebat (mm)'] || '') : parseSize(p.size),
      surface: isSkirting ? '' : parseSurface(p.surface),
      joint: isSkirting ? '' : parseJoint(p.joint),
      package: specs['Paket (m2)'] || '',
      specs,
      tags: [p.tag, p.collection, p.decor, p.color, p.thickness, p.size].filter(Boolean),
      sourceUrl: p.url,
      url: `urun/${id}/`
    });
  }

  // ---- Çamsan (laminat parke) ----
  const camsanFile = path.join(DATA, 'camsan.json');
  if (fs.existsSync(camsanFile)) {
    const cs = JSON.parse(fs.readFileSync(camsanFile, 'utf8'));
    for (const p of cs.products) {
      const specs = { ...p.specs };
      const collection = p.collection || 'Klasik Seri';
      const collectionSlug = 'camsan-' + collection.toLocaleLowerCase('tr-TR')
        .replace(/[çğıöşü]/g, c => ({ 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' }[c])).replace(/[^a-z0-9]+/g, '-');
      const localImages = p.localImages || [];
      const info = await imageInfo(localImages[1] || localImages[0]);
      const size = [specs['En'], specs['Boy']].filter(Boolean).join(' x ');
      if (size) specs['Ebat'] = size;
      const id = idFor('camsan', collectionSlug.replace(/^camsan-/, ''), p.slug);
      products.push({
        id,
        brand: 'Çamsan',
        brandSlug: 'camsan',
        category: 'Laminat Parke',
        name: p.name,
        code: p.code || '',
        collection,
        collectionSlug,
        description: p.description || '',
        shortDescription: p.description || '',
        images: localImages,
        image: localImages[0] || '',
        cardImage: localImages[1] || localImages[0] || '',
        tone: specs['Renk'] || info.tone || 'Orta',
        colorHex: info.hex || '#b79b7a',
        decor: decorNormalize(p.name) || 'Ahşap',
        thickness: parseThickness(specs['Kalınlık']),
        size: parseSize(size),
        surface: parseSurface(specs['Yüzey Dayanımı']),
        joint: parseJoint(specs['Kenar']),
        package: specs['Paket'] || '',
        specs,
        tags: [specs['Yüzey Dayanımı'], specs['Kenar'], specs['Kalınlık'], ...(p.features || [])].filter(Boolean),
        sourceUrl: p.url,
        url: `urun/${id}/`
      });
    }
  }

  // ---- Yıldız Entegre MDF & panel ----
  const mdfFile = path.join(DATA, 'yildiz-mdf.json');
  if (fs.existsSync(mdfFile)) {
    const md = JSON.parse(fs.readFileSync(mdfFile, 'utf8'));
    for (const p of md.products) {
      const specs = {};
      for (const [k, v] of Object.entries(p.specs || {})) specs[k] = clean(v);
      const raw = clean(p.title || p.name);
      let name = raw.split(/\s+(?:MDFlam|KAPAK PANEL|LAK PANEL|Boyalı Panel|Kompakt)/i)[0];
      name = trTitle(clean(name.replace(/\b[A-Z]{1,4}_[A-Z0-9]+\b/g, '')));
      let collection = p.group;
      const kp = raw.match(/KAPAK PANEL\s+(.+)$/i);
      const lp = raw.match(/LAK PANEL\s+(.+)$/i);
      /* finish names are English ("HIGH GLOSS"), so title-case them with the English locale */
      const enTitle = (s) => s.replace(/İ/g, 'i').toLowerCase().replace(/(^|\s)([a-zçğıöşü])/g, (m, a, b) => a + b.toUpperCase())
        .replace(/\bLüks\b/i, 'Lüks');
      if (p.groupSlug === 'kapak-panel' && kp) collection = `Kapak Panel ${enTitle(kp[1].replace(/\s+[A-Z]{2,4}_[A-Z0-9]+$/, ''))}`;
      if (p.groupSlug === 'lak-panel' && lp) collection = `Lak Panel ${enTitle(lp[1].replace(/\s+[A-Z]{2,4}_[A-Z0-9]+$/, ''))}`;
      const kinds = p.imageKinds || [];
      const imgs = p.localImages || [];
      const texture = imgs[kinds.indexOf('texture')] || imgs[0] || '';
      const render = imgs[kinds.indexOf('render')] || '';
      const ordered = [render, texture, ...imgs].filter((v, i, a) => v && a.indexOf(v) === i);
      const info = await imageInfo(texture);
      const cat = [specs['Kategori'], specs['Taş ve Beton Renkler'], specs['Ahşap Renkler'], specs['Yüzey Görünümü'], name].join(' ');
      const decor = decorNormalize(cat) || (/düz|renk/i.test(cat) ? 'Düz Renk' : /tekstil|keten|kumaş/i.test(cat) ? 'Tekstil' : 'Düz Renk');
      const thicknessList = (specs['Kalınlık (mm)'] || '').match(/\d+(?:[.,]\d+)?/g) || [];
      const thickness = thicknessList.length ? `${thicknessList.join(' / ')} mm` : '';
      const size = (specs['Ebat (mm)'] || '').replace(/\s*\(mm\)/g, '').replace(/\s*mm/g, '').replace(/x/g, ' x ') ;
      const id = idFor('yildiz', p.groupSlug, p.slug);
      products.push({
        id,
        brand: 'Yıldız Entegre',
        brandSlug: 'yildiz',
        category: 'MDF & Panel',
        name,
        code: p.sku || '',
        collection,
        collectionSlug: 'mdf-' + p.groupSlug,
        description: p.description || '',
        shortDescription: (p.description || '').slice(0, 200),
        images: ordered,
        image: ordered[0] || '',
        cardImage: texture || ordered[0] || '',
        tone: (specs['Renk Tonları'] || '').split(' / ')[0] || info.tone || 'Orta',
        colorHex: info.hex || '#b79b7a',
        decor,
        thickness,
        size: size ? size + ' mm' : '',
        surface: specs['Yüzey Dokusu'] || specs['Yüzey Dokuları'] || '',
        joint: '',
        package: '',
        specs,
        tags: [collection, specs['Yüzey Dokusu'] || specs['Yüzey Dokuları'], thickness].filter(Boolean),
        sourceUrl: p.url,
        url: `urun/${id}/`
      });
    }
  }

  // Ensure unique ids/urls
  const ids = new Set();
  for (const p of products) {
    let id = p.id, n = 2;
    while (ids.has(id)) { id = p.id + '-' + n++; }
    if (id !== p.id) { p.id = id; p.url = `urun/${id}/`; }
    ids.add(p.id);
  }

  // Collections
  const collectionMap = new Map();
  for (const p of products) {
    if (p.category === 'Masif Parke' || p.category === 'Lamine Parke' || p.category === 'Süpürgelik & Aksesuar') continue;
    const key = p.brand + '|' + p.collection;
    if (!collectionMap.has(key)) {
      collectionMap.set(key, {
        brand: p.brand, brandSlug: p.brandSlug, name: p.collection,
        slug: p.collectionSlug, category: p.category,
        image: p.image, count: 0, description: ''
      });
    }
    const c = collectionMap.get(key);
    c.count++;
  }
  const collections = [...collectionMap.values()].sort((a, b) => b.count - a.count);

  const catalog = products.map(p => ({
    id: p.id, name: p.name, code: p.code, brand: p.brand, brandSlug: p.brandSlug,
    category: p.category, collection: p.collection, collectionSlug: p.collectionSlug,
    tone: p.tone, colorHex: p.colorHex, decor: p.decor, thickness: p.thickness,
    size: p.size, surface: p.surface, joint: p.joint, image: p.cardImage || p.image,
    url: p.url, tags: p.tags.slice(0, 4)
  }));

  fs.mkdirSync(path.join(PUB, 'data'), { recursive: true });
  fs.writeFileSync(path.join(PUB, 'data', 'products.json'), JSON.stringify(products, null, 2));
  fs.writeFileSync(path.join(PUB, 'data', 'catalog.json'), JSON.stringify(catalog));
  fs.writeFileSync(path.join(PUB, 'data', 'collections.json'), JSON.stringify(collections, null, 2));

  console.log('Products:', products.length);
  console.log('Catalog size:', Math.round(fs.statSync(path.join(PUB, 'data', 'catalog.json')).size / 1024), 'KB');
  console.log('Collections:', collections.length);
  console.log('By category:', products.reduce((a, p) => (a[p.category] = (a[p.category] || 0) + 1, a), {}));
  console.log('By brand:', products.reduce((a, p) => (a[p.brand] = (a[p.brand] || 0) + 1, a), {}));
  console.log('Tones:', products.reduce((a, p) => (a[p.tone] = (a[p.tone] || 0) + 1, a), {}));
})();
