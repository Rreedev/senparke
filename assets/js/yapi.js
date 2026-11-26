/* =========================================================
   TAHA ŞEN YAPI — page-specific motion
   Hero: the elevation draws itself line by line, then the
   drawing hands over to the photograph as you scroll.
   Runs after motion.js (gsap, ScrollTrigger, Lenis ready).
   ========================================================= */
(function () {
  'use strict';
  const d = document;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => Array.from(c.querySelectorAll(s));

  /* Contact form: preselect subject / district from ?konu= / ?bolge= */
  const params = new URLSearchParams(location.search);
  const setSel = (id, v) => {
    const el = d.getElementById(id);
    if (!el || !v) return;
    const opt = Array.from(el.options).find(o => o.value.toLocaleLowerCase('tr-TR') === v.toLocaleLowerCase('tr-TR'));
    if (opt) el.value = opt.value;
  };
  setSel('ySubject', params.get('konu'));
  setSel('yDistrict', params.get('bolge'));

  if (!window.gsap || !window.ScrollTrigger || !d.documentElement.classList.contains('motion')) return;
  const gsap = window.gsap;
  const ST = window.ScrollTrigger;
  const arriving = d.documentElement.classList.contains('is-arriving');

  /* ---------- Hero ---------- */
  const hero = $('[data-yhero]');
  if (hero) {
    const stage = $('.yh-stage', hero);
    const photo = $('.yh-photo', hero);
    const word = $('.yh-word', hero);
    const copy = $('.yh-copy', hero);
    const h1Words = $$('h1 .w > span', copy);
    const rest = [$('.yh-kicker', copy), $('.yh-lead', copy), $('.hx-actions', copy)];
    const hint = $('.hx-hint', hero);
    const header = $('#siteHeader');
    const chars = $$('.ch > span', word);

    gsap.set(photo, { opacity: 0, scale: 1.18 });
    gsap.set(chars, { yPercent: 115 });
    gsap.set(h1Words, { y: 0, yPercent: 110 });
    gsap.set(rest, { autoAlpha: 0, y: 24 });
    gsap.set(copy, { visibility: 'visible' });
    gsap.set(hint, { autoAlpha: 0 });

    /* 1 — the night photograph surfaces, the name rises letter by letter */
    const intro = gsap.timeline({ delay: arriving ? 0.6 : 0.2 });
    intro.to(photo, { opacity: 0.55, scale: 1.08, duration: 2.4, ease: 'power2.out' })
      .to(chars, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.04 }, 0.35)
      .to(hint, { autoAlpha: () => (window.scrollY < 40 ? 1 : 0), duration: 0.6 }, '-=0.6');

    /* 2 — scroll: the name steps aside, the photograph opens up, copy arrives */
    const tl = gsap.timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: '+=120%', pin: stage, scrub: 1, anticipatePin: 1 }
    });
    tl.to(hint, { autoAlpha: 0, duration: 0.06 }, 0)
      .to(chars, { yPercent: -110, ease: 'power2.in', stagger: 0.012, duration: 0.35 }, 0.02)
      .to(photo, { opacity: 1, scale: 1, ease: 'none', duration: 0.8 }, 0)
      .to(h1Words, { yPercent: 0, ease: 'power3.out', stagger: 0.025, duration: 0.3 }, 0.42)
      .to(rest, { autoAlpha: 1, y: 0, ease: 'power2.out', stagger: 0.06, duration: 0.22 }, 0.55)
      .to({}, { duration: 0.15 });

    if (header) {
      ST.create({
        trigger: hero, start: 'bottom 80px', end: 'max',
        onEnter: () => header.classList.add('is-scrolled'),
        onLeaveBack: () => header.classList.remove('is-scrolled')
      });
    }
  }

  /* ---------- District line: the axis draws, stops arrive ---------- */
  const line = $('[data-yline]');
  if (line) {
    const axis = $('.y-axis i', line);
    const vertical = window.matchMedia('(max-width: 900px)').matches;
    ST.create({ trigger: line, start: 'top 70%', once: true, onEnter: () => line.classList.add('is-in') });
    gsap.to(axis, {
      [vertical ? 'scaleY' : 'scaleX']: 1, ease: 'none',
      scrollTrigger: { trigger: line, start: 'top 75%', end: 'bottom 60%', scrub: true }
    });
  }
})();
