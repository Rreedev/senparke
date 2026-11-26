/* =========================================================
   ŞENPARKE — interaction layer
   Sticky header · mega menu · search · catalog · gallery · forms
   ========================================================= */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const norm = (s) => String(s == null ? '' : s).toLocaleLowerCase('tr-TR').trim();
  const debounce = (fn, wait = 140) => {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  };

  const ARROW = '<svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const ARROW_UP = '<svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

  /* -------------------------------------------------------
     Reveal on scroll (defined early — used by catalog render)
     ------------------------------------------------------- */
  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px' })
    : null;

  function observeReveals(root = document) {
    const els = $$('[data-reveal]', root);
    if (!revealObserver) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }
    els.forEach(el => {
      if (!el.classList.contains('is-visible')) revealObserver.observe(el);
    });
  }

  /* -------------------------------------------------------
     Sticky header / back to top
     ------------------------------------------------------- */
  const header = $('#siteHeader');
  const backTop = $('.back-top');
  const isHome = document.body.classList.contains('is-home');
  const onScroll = () => {
    /* On the home page the motion layer decides when the header turns solid;
       without it, fall back to "past the hero". */
    const threshold = isHome ? (document.documentElement.classList.contains('motion') ? null : window.innerHeight - 80) : 16;
    if (header && threshold !== null) header.classList.toggle('is-scrolled', window.scrollY > threshold);
    if (backTop) backTop.classList.toggle('is-visible', window.scrollY > 720);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (backTop) backTop.addEventListener('click', () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* -------------------------------------------------------
     Mega menu
     ------------------------------------------------------- */
  if (header) {
    let megaTimer = null;
    const megaName = () => $$('.mega-wrap.is-open').map(el => el.dataset.mega)[0] || null;

    const openMega = (name) => {
      $$('.mega-wrap').forEach(el => el.classList.toggle('is-open', el.dataset.mega === name));
      $$('.has-mega').forEach(li => li.classList.toggle('is-open', li.dataset.mega === name));
    };
    const closeMega = () => {
      $$('.mega-wrap').forEach(el => el.classList.remove('is-open'));
      $$('.has-mega').forEach(li => li.classList.remove('is-open'));
    };
    const scheduleClose = () => {
      clearTimeout(megaTimer);
      megaTimer = setTimeout(closeMega, 160);
    };

    header.addEventListener('pointerover', (e) => {
      const li = e.target.closest('.has-mega');
      const mega = e.target.closest('.mega-wrap');
      if (li) {
        clearTimeout(megaTimer);
        openMega(li.dataset.mega);
      } else if (mega) {
        clearTimeout(megaTimer);
      } else if (megaName()) {
        scheduleClose();
      }
    });
    header.addEventListener('pointerleave', scheduleClose);
    header.addEventListener('focusin', (e) => {
      const li = e.target.closest('.has-mega');
      if (li) {
        clearTimeout(megaTimer);
        openMega(li.dataset.mega);
      }
    });
    header.addEventListener('focusout', (e) => {
      if (!header.contains(e.relatedTarget)) scheduleClose();
    });
    header.addEventListener('click', (e) => {
      const li = e.target.closest('.has-mega > a');
      if (li && window.matchMedia('(max-width: 1024px)').matches) e.preventDefault();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMega();
    });
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) closeMega();
    });
  }

  /* -------------------------------------------------------
     Mobile drawer
     ------------------------------------------------------- */
  const drawer = $('#mobileDrawer');
  if (drawer) {
    const trigger = $('.menu-trigger');
    const close = $('.drawer-close');
    const backdrop = document.createElement('div');
    backdrop.className = 'drawer-backdrop';
    document.body.appendChild(backdrop);

    const setDrawer = (open) => {
      drawer.classList.toggle('is-open', open);
      backdrop.classList.toggle('is-open', open);
      document.body.classList.toggle('no-scroll', open);
      drawer.setAttribute('aria-hidden', String(!open));
      if (trigger) trigger.setAttribute('aria-expanded', String(open));
    };
    if (trigger) trigger.addEventListener('click', () => setDrawer(true));
    if (close) close.addEventListener('click', () => setDrawer(false));
    backdrop.addEventListener('click', () => setDrawer(false));
    drawer.addEventListener('click', (e) => {
      if (e.target.closest('a')) setDrawer(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) setDrawer(false);
    });
  }

  /* -------------------------------------------------------
     Search overlay
     ------------------------------------------------------- */
  const searchOverlay = $('#searchOverlay');
  if (searchOverlay) {
    const input = $('#searchInput');
    const results = $('#searchResults');
    let catalog = null;
    let loading = false;

    const loadCatalog = () => {
      if (catalog || loading) return Promise.resolve(catalog);
      loading = true;
      return fetch('/data/catalog.json')
        .then(r => r.json())
        .then(data => { catalog = data; return data; })
        .catch(() => { catalog = []; return catalog; })
        .finally(() => { loading = false; });
    };

    const openSearch = () => {
      searchOverlay.classList.add('is-open');
      searchOverlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
      loadCatalog();
      setTimeout(() => input && input.focus(), 80);
    };
    const closeSearch = () => {
      searchOverlay.classList.remove('is-open');
      searchOverlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    };

    $$('.search-trigger').forEach(btn => btn.addEventListener('click', openSearch));
    $$('.search-close').forEach(btn => btn.addEventListener('click', closeSearch));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchOverlay.classList.contains('is-open')) closeSearch();
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !searchOverlay.classList.contains('is-open')) {
        e.preventDefault();
        openSearch();
      }
    });
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) closeSearch();
    });

    const highlight = (text, q) => {
      const safe = String(text == null ? '' : text);
      if (!q) return safe;
      const i = norm(safe).indexOf(q);
      if (i < 0) return safe;
      return `${safe.slice(0, i)}<mark>${safe.slice(i, i + q.length)}</mark>${safe.slice(i + q.length)}`;
    };

    const renderSearch = (q) => {
      if (!results) return;
      const query = norm(q);
      if (!query) {
        results.innerHTML = '<p class="search-empty">Ürün adı, kod veya koleksiyon yazmaya başlayın.</p>';
        return;
      }
      const list = (catalog || []).filter(p => {
        const hay = norm([p.name, p.code, p.brand, p.collection, p.category, p.tone, p.thickness, (p.tags || []).join(' ')].join(' '));
        return hay.includes(query);
      }).sort((a, b) => {
        const an = norm(a.name).startsWith(query) ? 0 : 1;
        const bn = norm(b.name).startsWith(query) ? 0 : 1;
        return an - bn || norm(a.name).localeCompare(norm(b.name), 'tr');
      });

      if (!list.length) {
        results.innerHTML = `<p class="search-empty">"${q}" için sonuç bulunamadı. Farklı bir kelime deneyin veya <a href="/teklif/" style="text-decoration:underline">bize ulaşın</a>.</p>`;
        return;
      }

      results.innerHTML = list.slice(0, 7).map(p => `
        <a class="search-result" href="/${p.url}">
          <img src="/${p.image}" alt="" loading="lazy">
          <span><span>${p.brand} · ${p.collection}</span>
          <strong>${highlight(p.name, query)}</strong>
          <small>${p.code ? p.code + ' · ' : ''}${p.category}</small></span>
        </a>`).join('') +
        `<a class="search-more text-link" href="/kategori/laminat-parke/?q=${encodeURIComponent(q)}">Tüm sonuçları gör (${list.length}) ${ARROW}</a>`;
    };

    const onSearch = debounce(() => {
      loadCatalog().then(() => renderSearch(input.value));
    }, 110);

    if (input) {
      input.addEventListener('input', onSearch);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const q = input.value.trim();
          if (q) window.location.href = `/kategori/laminat-parke/?q=${encodeURIComponent(q)}`;
        }
      });
    }
    $$('[data-search]').forEach(btn => btn.addEventListener('click', () => {
      if (!input) return;
      input.value = btn.dataset.search;
      renderSearch(input.value);
      input.focus();
    }));
    results && results.addEventListener('click', (e) => {
      if (e.target.closest('a')) closeSearch();
    });
  }

  /* -------------------------------------------------------
     Catalog (filters + sort + load more)
     ------------------------------------------------------- */
  const catalogRoot = $('[data-catalog]');
  if (catalogRoot) (function initCatalog(root) {
    const dataEl = $('#catalogData');
    let items = [];
    try { items = JSON.parse(dataEl ? dataEl.textContent : '[]'); } catch (err) { items = []; }

    const grid = $('#catalogGrid');
    const countEl = $('#catalogCount');
    const emptyEl = $('#catalogEmpty');
    const loadBtn = $('#loadMore');
    const progress = $('#loadProgress');
    const chipsEl = $('#activeFilters');
    const filterPanel = $('#catalogFilters');
    const filterOpen = $('#filterOpen');
    const filterClose = $('#filterClose');
    const filterSearch = $('#collectionSearch');
    const sortSelect = $('#sortSelect');
    const pageSize = 12;
    let shown = pageSize;

    const groups = ['brand', 'collection', 'tone', 'decor', 'thickness', 'joint'];
    const keyMap = { brand: 'brand', collection: 'collection', tone: 'tone', decor: 'decor', thickness: 'thickness', joint: 'joint' };
    const labels = { brand: 'Marka', collection: 'Koleksiyon', tone: 'Renk', decor: 'Desen', thickness: 'Kalınlık', joint: 'Kenar' };
    const state = { q: '', sort: 'featured' };

    const params = new URLSearchParams(window.location.search);

    groups.forEach(group => {
      params.getAll(group).forEach(value => {
        const input = $$(`input[data-filter="${group}"]`, root).find(el => el.value === value);
        if (input) input.checked = true;
      });
    });
    if (params.get('q')) state.q = params.get('q');
    if (params.get('sort')) state.sort = params.get('sort');
    if (sortSelect && state.sort) sortSelect.value = state.sort;

    const checkedValues = (group) => $$(`input[data-filter="${group}"]:checked`, root).map(el => el.value);

    const haystack = (p) => norm([p.name, p.code, p.brand, p.collection, p.category, p.tone, p.decor, p.thickness, p.size, (p.tags || []).join(' ')].join(' '));

    const matches = (p) => {
      for (const group of groups) {
        const vals = checkedValues(group);
        if (vals.length && !vals.includes(String(p[keyMap[group]] || ''))) return false;
      }
      if (state.q && !haystack(p).includes(norm(state.q))) return false;
      return true;
    };

    const sortItems = (list) => {
      const copy = list.slice();
      if (state.sort === 'name-asc') copy.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
      else if (state.sort === 'name-desc') copy.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
      else if (state.sort === 'brand') copy.sort((a, b) => a.brand.localeCompare(b.brand, 'tr') || a.name.localeCompare(b.name, 'tr'));
      else if (state.sort === 'code') copy.sort((a, b) => String(a.code).localeCompare(String(b.code), 'tr'));
      return copy;
    };

    const brandClass = (brand) => brand === 'AGT' ? 'brand-agt' : brand === 'Yıldız Entegre' ? 'brand-yildiz' : brand === 'Çamsan' ? 'brand-camsan' : 'brand-senfloor';
    const brandShort = (brand) => brand === 'Yıldız Entegre' ? 'Yıldız' : brand;

    const cardHTML = (p) => {
      const chips = [p.thickness, p.surface, p.joint, !p.thickness && p.size ? p.size : '']
        .filter(Boolean).slice(0, 3).map(v => `<span>${v}</span>`).join('');
      return `<article class="product-card" data-reveal>
        <a class="product-media" href="/${p.url}" aria-label="${p.brand} ${p.name} detay">
          <img src="/${p.image}" alt="${p.brand} ${p.name} ${p.collection}" loading="lazy">
          <span class="brand-badge ${brandClass(p.brand)}">${brandShort(p.brand)}</span>
          ${p.code ? `<span class="product-code">${p.code}</span>` : ''}
          <span class="product-hover">Ürünü incele ${ARROW_UP}</span>
        </a>
        <div class="product-body">
          <p class="product-collection">${p.collection}</p>
          <h3><a href="/${p.url}">${p.name}</a></h3>
          <div class="product-specs">${chips}</div>
          <div class="product-foot">
            <span class="tone"><i style="--tone:${p.colorHex || '#b79b7a'}"></i>${p.tone || 'Doğal'}</span>
            <span class="product-cta">Teklif al ${ARROW}</span>
          </div>
        </div>
      </article>`;
    };

    const renderChips = () => {
      if (!chipsEl) return;
      const chips = [];
      groups.forEach(group => checkedValues(group).forEach(value => {
        chips.push(`<span class="active-chip">${labels[group]}: ${value}<button type="button" data-remove="${group}" data-value="${value}" aria-label="${value} filtresini kaldır">×</button></span>`);
      }));
      if (state.q) chips.push(`<span class="active-chip">Arama: ${state.q}<button type="button" data-remove="q" aria-label="Aramayı temizle">×</button></span>`);
      chipsEl.innerHTML = chips.length ? chips.join('') + '<button type="button" class="clear-all" id="clearFilters">Tümünü temizle</button>' : '';
    };

    const syncURL = () => {
      const p = new URLSearchParams();
      groups.forEach(group => checkedValues(group).forEach(value => p.append(group, value)));
      if (state.q) p.set('q', state.q);
      if (state.sort && state.sort !== 'featured') p.set('sort', state.sort);
      const qs = p.toString();
      try {
        history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
      } catch (err) { /* noop */ }
    };

    const apply = (reset = true) => {
      if (reset) shown = pageSize;
      const filtered = sortItems(items.filter(matches));
      const visible = filtered.slice(0, shown);
      if (grid) grid.innerHTML = visible.map(cardHTML).join('');
      if (countEl) countEl.innerHTML = `<strong>${filtered.length}</strong> ürün${visible.length < filtered.length ? ` · ${visible.length} gösteriliyor` : ''}`;
      if (emptyEl) emptyEl.classList.toggle('is-visible', filtered.length === 0);
      if (loadBtn) {
        loadBtn.hidden = filtered.length <= shown;
        loadBtn.innerHTML = `Daha fazla göster ${ARROW}`;
      }
      if (progress) progress.style.width = filtered.length ? Math.min(100, Math.round(shown / filtered.length * 100)) + '%' : '0%';
      renderChips();
      syncURL();
      observeReveals(grid);
    };

    root.addEventListener('change', (e) => {
      const input = e.target.closest('input[data-filter]');
      if (!input) return;
      apply();
    });
    if (sortSelect) sortSelect.addEventListener('change', () => { state.sort = sortSelect.value; apply(); });
    if (loadBtn) loadBtn.addEventListener('click', () => { shown += pageSize; apply(false); });

    if (chipsEl) chipsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-remove]');
      const clear = e.target.closest('#clearFilters');
      if (clear) {
        $$('input[data-filter]:checked', root).forEach(el => { el.checked = false; });
        state.q = '';
        apply();
        return;
      }
      if (!btn) return;
      const group = btn.dataset.remove;
      if (group === 'q') state.q = '';
      else {
        const input = $$(`input[data-filter="${group}"]`, root).find(el => el.value === btn.dataset.value);
        if (input) input.checked = false;
      }
      apply();
    });

    if (filterSearch) {
      filterSearch.addEventListener('input', () => {
        const q = norm(filterSearch.value);
        $$('.filter-check', filterSearch.closest('.filter-group') || filterPanel).forEach(label => {
          const match = !q || norm(label.textContent).includes(q);
          label.style.display = match ? '' : 'none';
        });
      });
    }

    const setFilters = (open) => {
      if (!filterPanel) return;
      filterPanel.classList.toggle('is-open', open);
      document.body.classList.toggle('no-scroll', open);
      let backdrop = $('.filters-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'filters-backdrop';
        document.body.appendChild(backdrop);
        backdrop.addEventListener('click', () => setFilters(false));
      }
      backdrop.classList.toggle('is-open', open);
      if (filterOpen) filterOpen.setAttribute('aria-expanded', String(open));
    };
    if (filterOpen) filterOpen.addEventListener('click', () => setFilters(true));
    if (filterClose) filterClose.addEventListener('click', () => setFilters(false));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && filterPanel && filterPanel.classList.contains('is-open')) setFilters(false);
    });

    apply();
  })(catalogRoot);

  /* -------------------------------------------------------
     Product gallery + tabs
     ------------------------------------------------------- */
  const mainImage = $('.gallery-main img');
  if (mainImage) {
    const galleryMain = $('.gallery-main');
    const thumbs = $$('.gallery-thumb');
    let gallery = [];
    try { gallery = JSON.parse(galleryMain.dataset.gallery || '[]'); } catch (err) { gallery = []; }
    if (!gallery.length) gallery = [mainImage.getAttribute('src')];

    let current = 0;
    const show = (i) => {
      current = (i + gallery.length) % gallery.length;
      mainImage.src = gallery[current];
      thumbs.forEach((th, idx) => th.classList.toggle('is-active', idx === current));
    };
    thumbs.forEach((thumb, idx) => thumb.addEventListener('click', () => show(idx)));
    if (galleryMain) {
      galleryMain.addEventListener('click', () => openLightbox(gallery, current));
    }
    document.addEventListener('keydown', (e) => {
      if (!document.querySelector('.lightbox.is-open')) return;
      if (e.key === 'ArrowRight') show(current + 1);
      if (e.key === 'ArrowLeft') show(current - 1);
    });
  }

  const tabButtons = $$('.tab-btn');
  if (tabButtons.length) {
    tabButtons.forEach(btn => btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabButtons.forEach(b => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });
      $$('.tab-panel').forEach(panel => panel.classList.toggle('is-active', panel.id === target));
    }));
  }

  /* -------------------------------------------------------
     Lightbox
     ------------------------------------------------------- */
  let lightbox = null;
  let lightboxItems = [];
  let lightboxIndex = 0;

  function buildLightbox() {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Görsel galerisi');
    lightbox.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Galeriyi kapat">×</button>
      <button class="lightbox-nav lightbox-prev" type="button" aria-label="Önceki görsel">‹</button>
      <img alt="">
      <button class="lightbox-nav lightbox-next" type="button" aria-label="Sonraki görsel">›</button>
      <span class="lightbox-count"></span>`;
    document.body.appendChild(lightbox);
    const img = $('img', lightbox);
    const count = $('.lightbox-count', lightbox);
    const render = () => {
      if (!lightboxItems.length) return;
      lightboxIndex = (lightboxIndex + lightboxItems.length) % lightboxItems.length;
      img.src = lightboxItems[lightboxIndex].src;
      img.alt = lightboxItems[lightboxIndex].alt || '';
      count.textContent = `${lightboxIndex + 1} / ${lightboxItems.length}`;
    };
    $('.lightbox-close', lightbox).addEventListener('click', closeLightbox);
    $('.lightbox-prev', lightbox).addEventListener('click', (e) => { e.stopPropagation(); lightboxIndex--; render(); });
    $('.lightbox-next', lightbox).addEventListener('click', (e) => { e.stopPropagation(); lightboxIndex++; render(); });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') { lightboxIndex++; render(); }
      if (e.key === 'ArrowLeft') { lightboxIndex--; render(); }
    });
    lightbox._render = render;
  }

  function openLightbox(items, index = 0) {
    if (!items || !items.length) return;
    if (!lightbox) buildLightbox();
    lightboxItems = items;
    lightboxIndex = index;
    lightbox.classList.add('is-open');
    document.body.classList.add('no-scroll');
    lightbox._render();
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  /* -------------------------------------------------------
     Editorial gallery page
     ------------------------------------------------------- */
  const galleryGrid = $('[data-gallery]');
  if (galleryGrid) {
    const buttons = $$('[data-gallery-filter]');
    const items = $$('.gallery-item', galleryGrid);
    buttons.forEach(btn => btn.addEventListener('click', () => {
      const filter = btn.dataset.galleryFilter;
      buttons.forEach(b => b.classList.toggle('is-active', b === btn));
      items.forEach(item => {
        item.hidden = !(filter === 'all' || item.dataset.category === filter);
      });
    }));
    galleryGrid.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      const visible = items.filter(el => !el.hidden);
      const list = visible.map(el => {
        const img = $('img', el);
        return { src: img.getAttribute('src'), alt: img.getAttribute('alt') || '' };
      });
      openLightbox(list, visible.indexOf(item));
    });
  }

  /* -------------------------------------------------------
     Forms (demo → WhatsApp handoff)
     ------------------------------------------------------- */
  $$('form[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const success = form.parentElement.querySelector('.form-success') || $('.form-success', form.parentElement);
      const data = new FormData(form);
      const labels = {
        name: 'Ad Soyad', phone: 'Telefon', email: 'E-posta', city: 'İl / İlçe',
        subject: 'Konu', product: 'Ürün grubu', area: 'Metrekare', message: 'Mesaj',
        kitchen: 'Mutfak dolabı', budget: 'Bütçe', date: 'Uygun tarih'
      };
      const lines = [];
      for (const [key, value] of data.entries()) {
        if (!value || key === 'kvkk') continue;
        lines.push(`${labels[key] || key}: ${value}`);
      }
      const text = encodeURIComponent(`Merhaba Şenparke, web sitesi üzerinden bilgi almak istiyorum.\n\n${lines.join('\n')}`);
      const wa = form.dataset.whatsapp || '905537281755';

      if (success) {
        success.innerHTML = `<strong>Talebiniz hazır.</strong> Demo ortamında kayıt alınmaz; dilerseniz bilgilerinizi WhatsApp üzerinden bize iletebilirsiniz.
          <a class="btn btn-primary btn-sm" style="margin-top:12px" href="https://wa.me/${wa}?text=${text}" target="_blank" rel="noopener">WhatsApp ile gönder ${ARROW}</a>`;
        success.classList.add('is-visible');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    });
  });

  /* -------------------------------------------------------
     Quote page: preselect product / subject from URL
     ------------------------------------------------------- */
  const quoteDataEl = $('#quoteProductData');
  if (quoteDataEl) {
    try {
      const map = JSON.parse(quoteDataEl.textContent);
      const params = new URLSearchParams(window.location.search);
      const subject = $('#fieldSubject');
      const message = $('#fieldMessage');
      const id = params.get('urun');
      const p = id && map[id];
      if (p) {
        const box = $('#quoteProduct');
        if (box) {
          box.hidden = false;
          box.innerHTML = `<img src="/${(p.image || '').replace(/^\//, '')}" alt="">
            <span>
              <span>Seçilen ürün</span>
              <strong>${p.brand} ${p.name}</strong>
              <small>${p.code ? p.code + ' · ' : ''}${p.collection}</small>
            </span>`;
        }
        if (subject && p.category === 'Laminat Parke') subject.value = 'Laminat Parke';
        if (message && !message.value) message.value = `İlgilendiğim ürün: ${p.brand} ${p.name}${p.code ? ' (' + p.code + ')' : ''} — ${p.collection}`;
      } else if (params.get('konu') === 'mutfak' && subject) {
        subject.value = 'Mutfak Dolabı';
      }
    } catch (err) { /* noop */ }
  }

  /* -------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------- */
  observeReveals();
})();
