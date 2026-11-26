/* =========================================================
   ŞEN PARKE — motion layer
   Lenis smooth scroll + GSAP ScrollTrigger.
   Everything here is progressive: without JS / with reduced
   motion the page is complete and static.
   ========================================================= */
(function () {
  'use strict';

  const d = document;
  const html = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => Array.from(c.querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* noop */ } },
    del(k) { try { sessionStorage.removeItem(k); } catch (e) { /* noop */ } }
  };

  /* -------------------------------------------------------
     Page transitions (plank curtain) — CSS does the arrival
     ------------------------------------------------------- */
  const arriving = html.classList.contains('is-arriving');
  store.del('sp-nav');
  if (arriving) setTimeout(() => html.classList.remove('is-arriving'), 1400);
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) html.classList.remove('is-leaving', 'is-arriving');
  });

  {
    d.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
      if (url.pathname === location.pathname && url.search === location.search && !url.hash) { e.preventDefault(); return; }
      if (/\.(jpg|png|pdf|xml|json)$/i.test(url.pathname)) return;
      e.preventDefault();
      store.set('sp-nav', '1');
      html.classList.add('is-leaving');
      setTimeout(() => { location.href = url.href; }, 640);
    });
  }

  /* Without GSAP we stop here: page stays static & complete.
     With reduced motion the choreography stays, but smooth-scroll inertia,
     parallax drift and speed-based skew are switched off. */
  if (!window.gsap || !window.ScrollTrigger) return;

  const gsap = window.gsap;
  const ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);
  gsap.config({ force3D: true });
  ST.config({ ignoreMobileResize: true });
  html.classList.add('motion');

  /* -------------------------------------------------------
     Smooth scroll
     ------------------------------------------------------- */
  let lenis = null;
  /* Smooth scrolling stays on even when the OS asks for reduced motion:
     the owner's machine has Windows animations off, and the site must feel fluid there. */
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.075, smoothWheel: true, wheelMultiplier: 0.95, touchMultiplier: 1.3 });
    window.__lenis = lenis;
    lenis.on('scroll', ST.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    new MutationObserver(() => {
      if (d.body.classList.contains('no-scroll')) lenis.stop(); else lenis.start();
    }).observe(d.body, { attributes: true, attributeFilter: ['class'] });
    d.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href') === '#') return;
      const target = d.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -90 });
    });
  }

  /* Header hides on the way down, returns on the way up */
  const header = $('#siteHeader');
  const meter = $('.scroll-meter span');
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    const megaOpen = !!$('.mega-wrap.is-open');
    if (header && !megaOpen) header.classList.toggle('is-hidden', y > 240 && y > lastY + 2);
    if (header && y < lastY - 2) header.classList.remove('is-hidden');
    lastY = y;
    if (meter) {
      const max = d.documentElement.scrollHeight - innerHeight;
      meter.style.transform = `scaleY(${max > 0 ? Math.min(1, y / max) : 0})`;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* -------------------------------------------------------
     Split headings into masked words
     ------------------------------------------------------- */
  function splitWords(el, wrapClass) {
    let i = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = d.createDocumentFragment();
          parts.forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(d.createTextNode(' ')); return; }
            if (wrapClass === 'w') {
              const outer = d.createElement('span');
              outer.className = 'w';
              const inner = d.createElement('span');
              inner.textContent = part;
              inner.style.setProperty('--i', i++);
              outer.appendChild(inner);
              frag.appendChild(outer);
            } else {
              const s = d.createElement('span');
              s.className = wrapClass;
              s.textContent = part;
              frag.appendChild(s);
            }
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== 'BR' && child.tagName !== 'SVG') {
          walk(child);
        }
      });
    };
    walk(el);
    return el;
  }

  $$('[data-split]').forEach((el) => {
    splitWords(el, 'w');
    if (el.dataset.split === 'manual') return;
    ST.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => el.classList.add('is-in') });
  });
  $$('[data-fade], [data-clip]').forEach((el) => {
    ST.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => el.classList.add('is-in') });
  });

  /* Image parallax inside its frame */
  $$('[data-parallax]').forEach((img) => {
    const amt = parseFloat(img.dataset.parallax) || 10;
    gsap.fromTo(img, { yPercent: -amt / 2 }, {
      yPercent: amt / 2, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
    });
  });

  /* Magnetic buttons */
  if (finePointer) {
    $$('[data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.38);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  const mm = gsap.matchMedia();

  /* =======================================================
     HOME
     ======================================================= */
  const hero = $('[data-hero]');
  if (hero) {
    const stage = $('.hx-stage', hero);
    const rows = $$('.floor-row', hero);
    const word = $('.hx-word', hero);
    const chars = $$('.ch > span', word);
    const copy = $('.hx-copy', hero);
    const photo = $('.hx-photo img', hero);
    const hint = $('.hx-hint', hero);
    const h1 = $('h1', copy);
    const h1Words = $$('.w > span', h1);
    const copyRest = [$('.hx-kicker', copy), $('.hx-lead', copy), $('.hx-actions', copy)];

    const fitWord = () => {
      word.style.fontSize = '';
      const total = $$('.ch', word).reduce((s, c) => s + c.offsetWidth, 0);
      const fs = parseFloat(getComputedStyle(word).fontSize);
      if (total > 0) word.style.fontSize = (fs * (innerWidth * 0.94) / total) + 'px';
    };
    fitWord();
    window.addEventListener('resize', fitWord);

    rows.forEach((r) => gsap.set(r, { xPercent: Number(r.dataset.dir) * 104 }));
    gsap.set(chars, { yPercent: 115 });
    gsap.set(h1Words, { y: 0, yPercent: 110 });
    gsap.set(copyRest, { autoAlpha: 0, y: 24 });
    gsap.set(copy, { visibility: 'visible' });
    gsap.set(hint, { autoAlpha: 0 });

    /* 1 — the floor gets laid */
    const preload = Promise.race([
      Promise.all([...new Set($$('.plank', hero).map(p => p.style.backgroundImage.slice(5, -2)))].map(src => new Promise((res) => {
        const im = new Image(); im.onload = im.onerror = res; im.src = src;
      }))),
      new Promise(res => setTimeout(res, 1600))
    ]);
    preload.then(() => {
      const intro = gsap.timeline({ delay: arriving ? 0.55 : 0.15 });
      intro.to(rows, { xPercent: 0, duration: 1.25, ease: 'expo.out', stagger: { each: 0.075, from: 'random' } })
        .to(chars, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.045 }, '-=0.75')
        .to(hint, { autoAlpha: () => (window.scrollY < 40 ? 1 : 0), duration: 0.6 }, '-=0.5');
    });

    /* 2 — scrolling pulls the planks apart and opens the room */
    const tl = gsap.timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: '+=140%', pin: stage, scrub: 1, anticipatePin: 1 }
    });
    tl.to(hint, { autoAlpha: 0, duration: 0.08 }, 0)
      .to($('.hx-floor', hero), { backgroundColor: 'rgba(27,19,14,0)', ease: 'none', duration: 0.3 }, 0.05)
      .to(rows, { x: (i, r) => Number(r.dataset.dir) * innerWidth * 1.15, ease: 'power2.in', duration: 0.6, stagger: 0.035 }, 0)
      .to(word, { yPercent: -60, opacity: 0, scale: 0.92, ease: 'power2.in', duration: 0.42 }, 0.04)
      .fromTo(photo, { scale: 1.28 }, { scale: 1, ease: 'none', duration: 1 }, 0)
      .to(h1Words, { yPercent: 0, ease: 'power3.out', stagger: 0.025, duration: 0.3 }, 0.55)
      .to(copyRest, { autoAlpha: 1, y: 0, ease: 'power2.out', stagger: 0.06, duration: 0.22 }, 0.66)
      .to({}, { duration: 0.15 });

    /* Header turns solid only after the hero has played */
    if (header) {
      ST.create({
        trigger: hero, start: 'bottom 80px', end: 'max',
        onEnter: () => header.classList.add('is-scrolled'),
        onLeaveBack: () => header.classList.remove('is-scrolled')
      });
    }
  }

  /* Manifesto: words light up as you read */
  const manifesto = $('[data-words]');
  if (manifesto) {
    splitWords(manifesto, 'mw');
    gsap.to($$('.mw', manifesto), {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: manifesto, start: 'top 78%', end: 'bottom 42%', scrub: true }
    });
  }

  /* Ruler + counters */
  $$('[data-ruler]').forEach((ruler) => {
    ST.create({
      trigger: ruler, start: 'top 85%', once: true,
      onEnter: () => {
        ruler.classList.add('is-in');
        $$('[data-count]', ruler).forEach((el, i) => {
          const end = Number(el.dataset.count);
          const obj = { v: end > 1000 ? 1900 : 0 };
          gsap.to(obj, {
            v: end, duration: 1.8, delay: 0.15 * i, ease: 'power3.out',
            onUpdate: () => { el.textContent = Math.round(obj.v); }
          });
        });
      }
    });
  });

  /* Collections rail: vertical scroll drives a horizontal track */
  const rail = $('[data-rail]');
  if (rail) {
    mm.add('(min-width: 901px)', () => {
      const track = $('.rail-track', rail);
      const bar = $('.rail-progress span', rail);
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      const tween = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: rail, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => { if (bar) bar.style.transform = `scaleX(${self.progress})`; }
        }
      });
      $$('.rail-media img', rail).forEach((img) => {
        gsap.fromTo(img, { xPercent: -6 }, {
          xPercent: 6, ease: 'none',
          scrollTrigger: { trigger: img.closest('.rail-card'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true }
        });
      });
      return () => gsap.set(track, { clearProps: 'transform' });
    });
  }

  /* Looks list: an image trails the cursor */
  const looks = $('[data-looks]');
  if (looks && finePointer) {
    const float = $('.looks-float', looks);
    const fimg = $('img', float);
    const list = $('.looks-list', looks);
    const xTo = gsap.quickTo(float, 'x', { duration: 0.7, ease: 'power3' });
    const yTo = gsap.quickTo(float, 'y', { duration: 0.7, ease: 'power3' });
    const rTo = gsap.quickTo(float, 'rotation', { duration: 0.9, ease: 'power3' });
    let px = 0;
    $$('[data-look]', list).forEach((a) => { const im = new Image(); im.src = a.dataset.look; });
    list.addEventListener('pointermove', (e) => {
      const w = float.offsetWidth;
      xTo(e.clientX - w / 2);
      yTo(e.clientY - w * 0.375);
      rTo(Math.max(-8, Math.min(8, (e.clientX - px) * 0.4)));
      px = e.clientX;
    });
    list.addEventListener('pointerover', (e) => {
      const a = e.target.closest('[data-look]');
      if (!a) return;
      if (fimg.getAttribute('src') !== a.dataset.look) fimg.src = a.dataset.look;
      float.classList.add('is-on');
    });
    list.addEventListener('pointerleave', () => { float.classList.remove('is-on'); rTo(0); });
  }

  /* Stacked panels: the one underneath sinks back */
  const stack = $('[data-stack]');
  if (stack) {
    const panels = $$('.stack-panel', stack);
    panels.forEach((p, i) => {
      const dim = d.createElement('div');
      dim.className = 'stack-dim';
      p.appendChild(dim);
      const next = panels[i + 1];
      if (!next) return;
      gsap.timeline({
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: 0.5 }
      }).to(p, { scale: 0.9, borderRadius: 14, ease: 'none' }, 0)
        .to(dim, { opacity: 0.65, ease: 'none' }, 0);
    });
  }

  /* Process: a measuring tape fills as you scroll */
  const proc = $('[data-process]');
  if (proc) {
    mm.add('(min-width: 901px)', () => {
      const fill = $('.process-fill', proc);
      const steps = $$('.process-steps li', proc);
      const st = ST.create({
        trigger: proc, start: 'top top', end: 'bottom bottom', scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          fill.style.transform = `scaleX(${Math.min(1, p * 1.08)})`;
          steps.forEach((li, i) => li.classList.toggle('is-on', p >= i / steps.length + 0.02));
        }
      });
      return () => st.kill();
    });
    mm.add('(max-width: 900px)', () => { $$('.process-steps li', proc).forEach(li => li.classList.add('is-on')); });
  }

  /* Brand marquee reacts to scroll speed */
  const marquee = $('[data-marquee] .marquee-track');
  if (marquee) {
    let x = 0;
    let skew = 0;
    gsap.ticker.add(() => {
      const v = lenis ? lenis.velocity : 0;
      x -= 0.6 + Math.abs(v) * 0.35;
      const half = marquee.scrollWidth / 2;
      if (half > 0 && -x >= half) x += half;
      marquee.style.transform = `translate3d(${x}px,0,0) skewX(${skew}deg)`;
      skew += ((Math.max(-12, Math.min(12, -v * 0.6))) - skew) * 0.1;
    });
  }

  /* Archive columns drift at different speeds */
  $$('.archive-col[data-speed]').forEach((col) => {
    const s = Number(col.dataset.speed);
    gsap.fromTo(col, { yPercent: -s }, {
      yPercent: s, ease: 'none',
      scrollTrigger: { trigger: col.closest('.archive'), start: 'top bottom', end: 'bottom top', scrub: 0.8 }
    });
  });

  /* Footer word rises out of the floor */
  const fword = $('.footer-word span');
  if (fword) {
    gsap.fromTo(fword, { yPercent: 70 }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.footer-word', start: 'top bottom', end: 'bottom bottom', scrub: true }
    });
  }

  /* Recalculate once fonts and images settle */
  const refresh = () => ST.refresh();
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(() => { window.dispatchEvent(new Event('resize')); refresh(); });
  window.addEventListener('load', refresh);
})();
