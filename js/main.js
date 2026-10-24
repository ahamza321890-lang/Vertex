/* =========================================================
   Vertex Dispatch Services — site behaviour
   ========================================================= */
(function () {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const root = document.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const CFG = window.VERTEX_CONFIG || {};

  /* ---------- Icons ---------- */
  const wheel = (cx, cy = 32) => `M${cx - 4} ${cy}a4 4 0 108 0a4 4 0 10-8 0`;
  const TRUCK = {
    box: `<path d="M4 8h34v22H4z"/><path d="M38 14h11l9 9v7H38z"/><path class="hl" d="M42 17h6l6 6H42z"/><path d="${wheel(14)}"/><path d="${wheel(49)}"/>`,
    spr: `<path d="M5 11h35c7 0 11 4 15 11l4 2v8H5z"/><path class="hl" d="M43 14h6l6 8H43z"/><path d="M5 22h54"/><path d="${wheel(16)}"/><path d="${wheel(48)}"/>`,
    hot: `<path d="M34 30V17h11l6 7h8v6"/><path class="hl" d="M38 19h6l4 5H38z"/><path d="M2 24h32v4H2z"/><path class="hl" d="M6 15h20v9H6z"/><path d="${wheel(12)}"/><path d="${wheel(22)}"/><path d="${wheel(52)}"/>`,
    dry: `<path d="M2 6h40v24H2z"/><path d="M44 13h10l7 8v9H44z"/><path class="hl" d="M47 16h6l4 5H47z"/><path d="${wheel(10)}"/><path d="${wheel(19)}"/><path d="${wheel(52)}"/>`,
    reef: `<path d="M2 6h40v24H2z"/><path class="hl" d="M38 9h4v8h-4z"/><path d="M44 13h10l7 8v9H44z"/><path class="hl" d="M20 12v12M14 18h12M16 14l8 8M24 14l-8 8"/><path d="${wheel(10)}"/><path d="${wheel(19)}"/><path d="${wheel(52)}"/>`
  };
  const truckSvg = k => `<svg viewBox="0 0 64 40" aria-hidden="true">${TRUCK[k]}</svg>`;

  const IC = {
    search: '<circle cx="11" cy="11" r="7"/><path class="hl" d="M21 21l-5-5"/>',
    dollar: '<path class="hl" d="M12 2v20"/><path d="M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>',
    doc: '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/><path class="hl" d="M9 15l2 2 4-4"/>',
    people: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><path class="hl" d="M15 14.5c3 0 6 1.7 6 5.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path class="hl" d="M12 7v5l3 2"/>',
    invoice: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path class="hl" d="M7 15h4"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/><path class="hl" d="M15 3a6 6 0 016 6"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle class="hl" cx="12" cy="12" r="3"/>',
    wheel: '<circle cx="12" cy="12" r="9"/><circle class="hl" cx="12" cy="12" r="2.5"/><path d="M12 14.5V21M9.6 11.2L3.5 9.5M14.4 11.2l6.1-1.7"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle class="hl" cx="12" cy="12" r="1.5"/>'
  };
  const icon = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${IC[k]}</svg>`;

  /* ---------- Content ---------- */
  const SERVICES = [
    ['search', 'Load sourcing', 'We work the load boards and broker relationships daily to find freight that fits your lanes.'],
    ['dollar', 'Rate negotiation', 'We push for the rate you deserve and never book below the minimum you set.'],
    ['doc', 'Rate confirmations', 'Every load is confirmed in writing, with the details checked before you roll.'],
    ['people', 'Broker setup', 'Carrier packets and broker onboarding handled, so you can start hauling faster.'],
    ['clock', 'Detention and TONU', 'We follow up on detention and truck-ordered-not-used claims so you get paid for your time.'],
    ['invoice', 'Invoicing support', 'Paperwork submitted cleanly and on time, so payments are not delayed.']
  ];
  const PILLARS = [
    ['phone', 'Reliable', 'Same dispatcher, always reachable, predictable process.'],
    ['eye', 'Transparent', 'Clear rates and a clear fee. Nothing hidden.'],
    ['wheel', 'Driver-first', 'We work for the driver, never the broker.'],
    ['target', 'Precise', 'Rate cons, detention and paperwork done right.']
  ];
  const EQUIP = {
    box: { name: 'Box truck', rate: 2.1, title: 'Box trucks', text: 'Local and regional freight for 16 to 26 ft straight trucks, with or without a liftgate.',
      grid: [['Typical freight', 'Palletized LTL, retail, furniture, appliances'], ['We look for', 'Liftgate-friendly loads and short regional runs'], ['Common setups', 'Expedited, partials, final mile'], ['Your win', 'Paying loads close to home, fewer empty miles']] },
    spr: { name: 'Sprinter van', rate: 1.9, title: 'Sprinter vans', text: 'Fast, time-critical freight for cargo vans, where speed is what the shipper is paying for.',
      grid: [['Typical freight', 'Expedited parcels, auto parts, medical supplies'], ['We look for', 'Hot shipments that pay for speed'], ['Common setups', 'Direct, expedited, team runs'], ['Your win', 'Short notice loads priced like they should be']] },
    hot: { name: 'Hotshot', rate: 2.2, title: 'Hotshots', text: 'Flatbed freight for pickup and trailer setups, matched to your deck length and weight limits.',
      grid: [['Typical freight', 'Machinery, building materials, oilfield equipment'], ['We look for', 'Loads that fit your deck and stay under your weight'], ['Common setups', 'Gooseneck, bumper pull, CDL and non-CDL'], ['Your win', 'Fewer wasted calls on loads that don’t fit']] },
    dry: { name: 'Dry van', rate: 2.4, title: 'Dry vans', text: 'General freight for 53 ft vans, built around consistent lanes and low deadhead.',
      grid: [['Typical freight', 'Consumer goods, packaged food, paper, retail'], ['We look for', 'Consistent lanes and drop-and-hook when possible'], ['Common setups', 'Regional, OTR, dedicated lanes'], ['Your win', 'A steady schedule that gets you home']] },
    reef: { name: 'Reefer', rate: 2.7, title: 'Reefers', text: 'Temperature-controlled freight, where clean paperwork and on-time delivery protect the rate.',
      grid: [['Typical freight', 'Produce, meat, dairy, frozen foods'], ['We look for', 'Strong lanes, clear temp requirements, fair detention terms'], ['Common setups', 'Regional, OTR, multi-stop'], ['Your win', 'Premium rates without the paperwork headaches']] }
  };
  const LOADS = [
    ['Dallas, TX', 'Atlanta, GA', 780, 'dry', 2.35, '42,000 lb', 'Today'],
    ['Chicago, IL', 'Nashville, TN', 470, 'reef', 2.85, '38,500 lb', 'Tomorrow'],
    ['Atlanta, GA', 'Charlotte, NC', 245, 'box', 2.6, '9,800 lb', 'Today'],
    ['Houston, TX', 'Memphis, TN', 585, 'hot', 2.45, '12,400 lb', 'Tomorrow'],
    ['Denver, CO', 'Kansas City, MO', 600, 'dry', 2.3, '40,000 lb', 'Mon'],
    ['Phoenix, AZ', 'Los Angeles, CA', 370, 'spr', 2.75, '2,600 lb', 'Today'],
    ['Columbus, OH', 'Indianapolis, IN', 175, 'box', 2.9, '8,200 lb', 'Tomorrow'],
    ['Fresno, CA', 'Portland, OR', 720, 'reef', 3.05, '41,000 lb', 'Today'],
    ['Laredo, TX', 'Oklahoma City, OK', 530, 'dry', 2.4, '36,000 lb', 'Tomorrow'],
    ['Jacksonville, FL', 'Orlando, FL', 140, 'spr', 3.1, '1,900 lb', 'Today'],
    ['Louisville, KY', 'St. Louis, MO', 265, 'hot', 2.7, '14,000 lb', 'Mon'],
    ['Salt Lake City, UT', 'Boise, ID', 340, 'reef', 2.8, '39,000 lb', 'Tomorrow']
  ];
  const FAQ = [
    ['How much does dispatch cost?', 'Our fee is a clear percentage or flat rate, agreed upfront in writing. No hidden deductions, ever.'],
    ['Which equipment do you dispatch?', 'Box trucks, sprinter vans, hotshots, dry vans and reefers, for owner-operators and small fleets.'],
    ['Do I need my own authority?', 'Yes. You operate under your own authority and insurance. We handle finding and booking loads and the related paperwork.'],
    ['Are you a broker or a carrier?', 'Neither. Vertex is a dispatch service. You haul under your own authority, and we work on your behalf with brokers and shippers.'],
    ['Can I choose my loads and lanes?', 'Always. You set your minimum rate and preferred lanes, and nothing is booked without your approval.'],
    ['What do I need to get started?', 'Your MC authority, certificate of insurance and W-9. If you use a factoring company, send the notice of assignment too.'],
    ['Do you work with new authorities?', 'Yes. We help new carriers get set up with brokers that work with new authorities, and walk you through how the load boards work.'],
    ['How do I reach my dispatcher?', 'Call or text anytime. You get the same dispatcher, and they know your truck and your lanes.'],
    ['How fast can I start?', 'Once your documents are in, most carriers are set up and ready to be dispatched quickly.']
  ];

  /* ---------- Helpers ---------- */
  const money = n => (n < 0 ? '-' : '') + '$' + Math.abs(Math.round(n)).toLocaleString('en-US');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3800);
  }
  function tween(el, to, fmt = money, dur = 600) {
    const from = +el.dataset.v || 0;
    el.dataset.v = to;
    if (RM) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    (function step(t) {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ---------- Config ---------- */
  function applyConfig() {
    const set = (sel, val) => val && $$(sel).forEach(el => { el.textContent = val; });
    set('[data-phone]', CFG.phoneDisplay || CFG.phone);
    set('[data-email]', CFG.email);
    set('[data-hours]', CFG.hours);
    set('[data-address]', CFG.address);
    set('[data-legal]', CFG.legalName);
    set('[data-mcdot]', CFG.mcdot);
    if (CFG.phone) $$('[data-phone-link]').forEach(a => { a.href = 'tel:' + CFG.phone; });
    if (CFG.email) $$('[data-email-link]').forEach(a => { a.href = 'mailto:' + CFG.email; });
    if (!CFG.mcdot) $$('[data-mcdot-wrap]').forEach(el => el.remove());
    if (!CFG.hours) $$('[data-hours]').forEach(el => { el.textContent = 'Call or text anytime'; });
    $('#year').textContent = new Date().getFullYear();
  }

  /* ---------- Loader & hero intro ---------- */
  function splitHero() {
    const h = $('[data-split]');
    if (!h) return;
    let i = 0;
    const wrap = (text, parent) => {
      text.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { parent.appendChild(document.createTextNode(' ')); return; }
        const w = document.createElement('span'), inner = document.createElement('span');
        w.className = 'w'; inner.textContent = part; inner.style.transitionDelay = (0.15 + i++ * 0.09) + 's';
        w.appendChild(inner); parent.appendChild(w);
      });
    };
    Array.from(h.childNodes).forEach(node => {
      if (node.nodeType === 3) { const frag = document.createDocumentFragment(); wrap(node.textContent, frag); h.replaceChild(frag, node); }
      else if (node.nodeType === 1) { const txt = node.textContent; node.textContent = ''; wrap(txt, node); }
    });
    h.setAttribute('aria-label', 'Always moving. Always paid.');
  }
  function intro() {
    const start = performance.now();
    let done = false;
    const go = () => {
      if (done) return; done = true;
      const wait = Math.max(0, 650 - (performance.now() - start));
      setTimeout(() => { root.classList.add('loaded'); setTimeout(() => $('#loader')?.remove(), 900); }, RM ? 0 : wait);
    };
    if (document.readyState === 'complete') go(); else window.addEventListener('load', go);
    setTimeout(go, 2500);
  }

  /* ---------- Header, progress, nav ---------- */
  function chrome() {
    const hdr = $('#hdr'), prog = $('#progress'), top = $('#totop'), mcta = $('#mcta'), hero = $('.hero');
    let lastY = 0, ticking = false;
    const update = () => {
      const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
      prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
      hdr.classList.toggle('scrolled', y > 20);
      const menuOpen = root.classList.contains('menu-open');
      hdr.classList.toggle('hide', !menuOpen && y > 700 && y > lastY + 4);
      if (y < lastY - 4) hdr.classList.remove('hide');
      top.classList.toggle('show', y > 900);
      const contact = $('#contact').getBoundingClientRect();
      mcta.classList.toggle('show', y > hero.offsetHeight * .6 && !(contact.top < innerHeight && contact.bottom > 0));
      lastY = y; ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    update();
    top.addEventListener('click', () => scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }));

    // Active section in nav
    const links = $$('#nav a');
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { links.forEach(a => a.classList.remove('active')); map.get(e.target.id)?.classList.add('active'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });

    // Mobile menu
    const burger = $('#burger'), drawer = $('#drawer');
    const setMenu = open => {
      root.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      drawer.setAttribute('aria-hidden', !open);
      if (open) hdr.classList.remove('hide');
    };
    burger.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
    $$('a', drawer).forEach(a => a.addEventListener('click', () => setMenu(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    addEventListener('resize', () => { if (innerWidth > 1100) setMenu(false); });

    // Theme
    $('#theme').addEventListener('click', () => {
      const cur = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = cur === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('vx-theme', next); } catch (e) {}
    });
  }

  /* ---------- Hero network canvas ---------- */
  function heroCanvas() {
    const cv = $('#heroGrid');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    let W, H, nodes = [], edges = [], packets = [], raf, visible = true;
    const build = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.offsetWidth; H = cv.offsetHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(46, W * H / 26000));
      nodes = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H * .92, r: Math.random() * 1.6 + .8 }));
      edges = [];
      nodes.forEach((a, i) => {
        nodes.map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) })).filter(o => o.j !== i)
          .sort((p, q) => p.d - q.d).slice(0, 2)
          .forEach(o => { if (!edges.some(e => (e[0] === o.j && e[1] === i))) edges.push([i, o.j]); });
      });
      packets = Array.from({ length: Math.round(n / 3) }, spawn);
    };
    function spawn() { const e = edges[Math.random() * edges.length | 0]; return { e, t: 0, s: .002 + Math.random() * .004, dir: Math.random() > .5 }; }
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.setLineDash([4, 6]);
      ctx.beginPath();
      edges.forEach(([a, b]) => { ctx.moveTo(nodes[a].x, nodes[a].y); ctx.lineTo(nodes[b].x, nodes[b].y); });
      ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(211,212,214,0.35)';
      nodes.forEach(n => { ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.283); ctx.fill(); });
      packets.forEach((p, i) => {
        if (!p.e) return;
        let [a, b] = p.e; if (p.dir) [a, b] = [b, a];
        const A = nodes[a], B = nodes[b];
        const x = A.x + (B.x - A.x) * p.t, y = A.y + (B.y - A.y) * p.t;
        const tx = A.x + (B.x - A.x) * Math.max(0, p.t - .18), ty = A.y + (B.y - A.y) * Math.max(0, p.t - .18);
        const g = ctx.createLinearGradient(tx, ty, x, y);
        g.addColorStop(0, 'rgba(245,166,35,0)'); g.addColorStop(1, 'rgba(245,166,35,0.75)');
        ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke();
        ctx.fillStyle = '#F5A623'; ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 6.283); ctx.fill();
        p.t += p.s;
        if (p.t >= 1) packets[i] = spawn();
      });
    };
    const loop = () => { draw(); if (visible) raf = requestAnimationFrame(loop); };
    build();
    if (RM) { draw(); return; }
    loop();
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting; cancelAnimationFrame(raf); if (visible) loop();
    }).observe(cv);
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); });
  }

  /* ---------- Hero parallax ---------- */
  function parallax() {
    if (RM || !FINE) return;
    const hero = $('.hero'), floats = $$('.float'), badge = $('.hero-badge');
    let mx = 0, my = 0, cx = 0, cy = 0, raf;
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5;
      if (!raf) raf = requestAnimationFrame(step);
    });
    function step() {
      cx += (mx - cx) * .08; cy += (my - cy) * .08;
      floats.forEach(f => { const d = +f.dataset.depth; f.style.transform = `translate3d(${cx * d}px, ${cy * d}px, 0)`; });
      badge.style.translate = `${cx * -10}px ${cy * -10}px`;
      raf = Math.abs(mx - cx) + Math.abs(my - cy) > .001 ? requestAnimationFrame(step) : null;
    }
  }

  /* ---------- Reveal on scroll ---------- */
  function reveal() {
    $$('.rv').forEach(el => {
      const sibs = Array.from(el.parentElement.children).filter(c => c.classList.contains('rv'));
      const i = sibs.indexOf(el);
      if (i > 0) el.style.setProperty('--d', Math.min(i * 0.08, .5) + 's');
    });
    if (!('IntersectionObserver' in window)) { $$('.rv').forEach(el => el.classList.add('in')); return; }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    $$('.rv:not(.in)').forEach(el => io.observe(el));
  }

  /* ---------- Stats counters ---------- */
  function counters() {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, to = +el.dataset.count, suf = el.dataset.suffix || '';
      el.dataset.v = el.dataset.from || 0;
      tween(el, to, n => Math.round(n) + suf, 1400);
      io.unobserve(el);
    }), { threshold: .6 });
    $$('[data-count]').forEach(el => io.observe(el));
  }

  /* ---------- Cards ---------- */
  function cards() {
    $('#svc').innerHTML = SERVICES.map(([ic, h, p], i) =>
      `<article class="card rv"><span class="card-n">0${i + 1}</span><div class="card-ic">${icon(ic)}</div><h3>${h}</h3><p>${p}</p><span class="card-line"></span></article>`).join('');
    $('#pillars').innerHTML = PILLARS.map(([ic, h, p]) =>
      `<article class="card pillar rv"><div class="card-ic">${icon(ic)}</div><h3>${h}</h3><p>${p}</p><span class="card-line"></span></article>`).join('');
    if (RM || !FINE) return;
    $$('.card').forEach(c => {
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%');
        c.style.transform = `perspective(900px) rotateX(${(.5 - y) * 6}deg) rotateY(${(x - .5) * 8}deg) translateY(-4px)`;
      });
      c.addEventListener('mouseleave', () => { c.style.transform = ''; });
    });
  }

  /* ---------- Equipment tabs ---------- */
  function equipment() {
    const tabs = $('#eqTabs'), panel = $('#eqPanel'), keys = Object.keys(EQUIP);
    tabs.innerHTML = keys.map((k, i) =>
      `<button class="eq-tab" role="tab" id="tab-${k}" data-k="${k}" aria-selected="${i === 0}" aria-controls="eqPanel" tabindex="${i === 0 ? 0 : -1}">${truckSvg(k)}${EQUIP[k].name}</button>`).join('');
    const show = k => {
      const d = EQUIP[k];
      $$('.eq-tab', tabs).forEach(t => { const on = t.dataset.k === k; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
      panel.setAttribute('aria-labelledby', 'tab-' + k);
      panel.innerHTML = `<div class="eq-art">${truckSvg(k)}</div><div class="eq-body"><p class="eyebrow eyebrow-amber">We dispatch</p><h3>${d.title}</h3><p>${d.text}</p>
        <div class="eq-grid">${d.grid.map(([s, b]) => `<div><small>${s}</small><b>${b}</b></div>`).join('')}</div>
        <a class="btn btn-amber" href="#contact" data-eq="${k}">Get loads for my ${d.name.toLowerCase()} <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div>`;
      $('[data-eq]', panel).addEventListener('click', () => preselectEquip(d.name));
    };
    tabs.addEventListener('click', e => { const b = e.target.closest('.eq-tab'); if (b) show(b.dataset.k); });
    tabs.addEventListener('keydown', e => {
      const i = keys.indexOf(document.activeElement.dataset.k);
      if (i < 0) return;
      let n = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % keys.length;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i - 1 + keys.length) % keys.length;
      if (n !== null) { e.preventDefault(); show(keys[n]); $('#tab-' + keys[n]).focus(); }
    });
    show(keys[0]);
  }

  /* ---------- Revenue calculator ---------- */
  function calculator() {
    const box = $('#calcEq'), keys = Object.keys(EQUIP);
    box.innerHTML = keys.map((k, i) => `<button type="button" data-k="${k}" class="${i ? '' : 'on'}" aria-pressed="${!i}">${EQUIP[k].name}</button>`).join('');
    const v = id => +$('#' + id).value;
    const fill = r => r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min) * 100) + '%');
    function calc() {
      const mi = v('mi'), dh = v('dh') / 100, cr = v('cr'), tr = v('tr'), fu = v('fu'), fe = v('fe') / 100;
      const loaded = mi * (1 - dh);
      const n0 = loaded * cr - mi * fu, n1 = loaded * tr * (1 - fe) - mi * fu, d = n1 - n0, mx = Math.max(n0, n1, 1);
      $('#o-mi').textContent = mi.toLocaleString('en-US') + ' mi';
      $('#o-dh').textContent = Math.round(dh * 100) + '%';
      $('#o-cr').textContent = '$' + cr.toFixed(2);
      $('#o-tr').textContent = '$' + tr.toFixed(2);
      $('#o-fu').textContent = '$' + fu.toFixed(2);
      $('#o-fe').textContent = +(fe * 100).toFixed(1) + '%';
      tween($('#r-d'), d); tween($('#r-m'), d * 52 / 12); tween($('#r-y'), d * 52);
      tween($('#r-p'), loaded * .1 * (1 - fe)); tween($('#r-n0'), n0); tween($('#r-n1'), n1);
      $('#r-d').classList.toggle('neg', d < 0);
      $('#b0').style.width = Math.max(2, n0 / mx * 100) + '%';
      $('#b1').style.width = Math.max(2, n1 / mx * 100) + '%';
      $('#r-note').textContent = d < 0 ? 'At these numbers the fee outweighs the rate gain. Try a higher target rate.' : '';
      $$('.panel input[type=range]').forEach(fill);
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      $$('button', box).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
      const r = EQUIP[b.dataset.k].rate;
      $('#cr').value = r; $('#tr').value = (r + .35).toFixed(2);
      calc();
    });
    $$('.panel input[type=range]').forEach(i => i.addEventListener('input', calc));
    $('[data-calc-cta]').addEventListener('click', () => {
      const k = $('#calcEq .on')?.dataset.k;
      if (k) preselectEquip(EQUIP[k].name);
    });
    calc();
  }

  /* ---------- Load feed ---------- */
  function loadFeed() {
    const feed = $('#feed'), filt = $('#feedFilter');
    let filter = 'all', offset = 0, timer, inView = false;
    const booked = new Set();
    filt.innerHTML = `<button type="button" class="on" data-k="all" aria-pressed="true">All</button>` +
      Object.keys(EQUIP).map(k => `<button type="button" data-k="${k}" aria-pressed="false">${EQUIP[k].name}</button>`).join('');
    const list = () => LOADS.map((l, i) => ({ l, i })).filter(o => filter === 'all' || o.l[3] === filter);
    const card = ({ l, i }, j, fresh) => {
      const total = Math.round(l[2] * l[4]), isB = booked.has(i);
      return `<article class="ld${isB ? ' booked' : ''}${fresh && j === 0 ? ' new' : ''}" style="animation-delay:${j * .07}s" data-i="${i}">
        <div class="ld-top"><span class="ld-tag">${EQUIP[l[3]].name}</span><span>Pickup ${l[6]}</span></div>
        <div class="ld-route"><span class="pin"></span><h3>${esc(l[0])}</h3><span class="lane"></span><span></span><span class="pin end"></span><h3>${esc(l[1])}</h3></div>
        <div class="ld-meta"><span>${l[2].toLocaleString('en-US')} mi</span><span>${l[5]}</span><span>Sample</span></div>
        <div class="ld-money"><div><small>Total</small><b>$${total.toLocaleString('en-US')}</b></div><div style="text-align:right"><small>Per mile</small><b class="rpm">$${l[4].toFixed(2)}</b></div></div>
        <button class="btn btn-amber" type="button">${isB ? 'Booked' : 'Book this load'}</button></article>`;
    };
    const render = fresh => {
      const all = list(), n = Math.min(6, all.length), out = [];
      for (let j = 0; j < n; j++) out.push(all[(offset + j) % all.length]);
      feed.innerHTML = out.map((o, j) => card(o, j, fresh)).join('');
    };
    filt.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      filter = b.dataset.k; offset = 0;
      $$('button', filt).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
      render(false);
    });
    feed.addEventListener('click', e => {
      const b = e.target.closest('.ld .btn'); if (!b) return;
      const ld = b.closest('.ld'), i = +ld.dataset.i;
      booked.add(i); ld.classList.add('booked'); b.textContent = 'Booked';
      toast('Sample load booked. With Vertex, your rate con lands in your inbox.');
    });
    const tick = () => {
      const all = list();
      if (all.length > 6 && inView && !document.hidden) { offset = (offset - 1 + all.length) % all.length; render(true); }
    };
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; }).observe(feed);
    render(false);
    if (!RM) timer = setInterval(tick, 6500);
  }

  /* ---------- Steps progress ---------- */
  function steps() {
    const wrap = $('#steps'), fill = $('#stepsFill'), items = $$('.step', wrap);
    const update = () => {
      const r = wrap.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * .75 - r.top) / (r.height + innerHeight * .2)));
      fill.style.width = p * 100 + '%';
      items.forEach((s, i) => s.classList.toggle('lit', p >= i / items.length + .02 || (innerWidth <= 900 && s.getBoundingClientRect().top < innerHeight * .7)));
    };
    addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    update();
  }

  /* ---------- Statement words ---------- */
  function statement() {
    const el = $('#statement'); if (!el) return;
    const hl = ['top', 'load', 'board,'];
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="sw${hl.includes(w.toLowerCase()) ? ' hl' : ''}">${esc(w)}</span>`).join(' ');
    const words = $$('.sw', el);
    if (RM) { words.forEach(w => w.classList.add('on')); return; }
    const update = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height + innerHeight * .35)));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    };
    addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    update();
  }

  /* ---------- FAQ ---------- */
  function faq() {
    const box = $('#faqList');
    box.innerHTML = FAQ.map(([q, a], i) =>
      `<div class="qa rv"><button type="button" aria-expanded="false" aria-controls="qa-${i}" id="qb-${i}">${q}<span class="pm" aria-hidden="true"></span></button>
       <div class="qa-a" id="qa-${i}" role="region" aria-labelledby="qb-${i}"><div><p>${a}</p></div></div></div>`).join('');
    box.addEventListener('click', e => {
      const b = e.target.closest('.qa button'); if (!b) return;
      const qa = b.parentElement, open = !qa.classList.contains('open');
      $$('.qa', box).forEach(x => { x.classList.remove('open'); $('button', x).setAttribute('aria-expanded', 'false'); });
      if (open) { qa.classList.add('open'); b.setAttribute('aria-expanded', 'true'); }
    });
  }

  /* ---------- Quote form ---------- */
  const EQ_NAMES = Object.values(EQUIP).map(e => e.name);
  let pickEquip = () => {};
  function preselectEquip(name) { pickEquip(name); }

  function form() {
    const f = $('#form'), sets = $$('.fs', f), labels = $$('.form-steps li', f);
    const prev = $('#prev'), next = $('#next'), submit = $('#submit'), bar = $('#formBar');
    const pick = $('#f-equip');
    let step = 0, equip = '';

    pick.innerHTML = Object.keys(EQUIP).map(k =>
      `<button type="button" role="radio" aria-checked="false" data-name="${EQUIP[k].name}">${truckSvg(k)}${EQUIP[k].name}</button>`).join('');
    pickEquip = name => {
      if (!EQ_NAMES.includes(name)) return;
      equip = name;
      $$('button', pick).forEach(b => b.setAttribute('aria-checked', b.dataset.name === name));
      $('#equipErr').classList.remove('show');
    };
    pick.addEventListener('click', e => { const b = e.target.closest('button'); if (b) pickEquip(b.dataset.name); });

    const phoneOk = v => v.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '').length === 10;
    const emailOk = v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    $('#f-phone').addEventListener('input', e => {
      const d = e.target.value.replace(/\D/g, '').replace(/^1/, '').slice(0, 10);
      if (e.inputType && e.inputType.startsWith('delete')) return;
      e.target.value = d.length > 6 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : d.length > 3 ? `(${d.slice(0, 3)}) ${d.slice(3)}` : d;
    });
    const mark = (id, ok) => { $('#' + id).closest('.fld').classList.toggle('bad', !ok); return ok; };
    const validate = s => {
      if (s === 0) {
        const a = mark('f-name', $('#f-name').value.trim().length > 1);
        const b = mark('f-phone', phoneOk($('#f-phone').value));
        const c = mark('f-email', emailOk($('#f-email').value.trim()));
        return a && b && c;
      }
      if (s === 1) { $('#equipErr').classList.toggle('show', !equip); return !!equip; }
      if (s === 2) { const ok = $('#f-consent').checked; $('#consentErr').classList.toggle('show', !ok); return ok; }
      return true;
    };
    $$('input', f).forEach(i => i.addEventListener('input', () => i.closest('.fld')?.classList.remove('bad')));
    $('#f-consent').addEventListener('change', () => $('#consentErr').classList.remove('show'));

    const go = s => {
      step = s;
      sets.forEach((fs, i) => fs.classList.toggle('on', i === s));
      labels.forEach((l, i) => { l.classList.toggle('on', i === s); l.classList.toggle('done', i < s); });
      bar.style.width = ((s + 1) / sets.length * 100) + '%';
      prev.hidden = s === 0; next.hidden = s === sets.length - 1; submit.hidden = s !== sets.length - 1;
      const first = $('input, select, textarea, button', sets[s]);
      if (first && f.dataset.touched) first.focus({ preventScroll: true });
    };
    next.addEventListener('click', () => { f.dataset.touched = 1; if (validate(step)) go(step + 1); else f.classList.add('shake'); });
    prev.addEventListener('click', () => go(step - 1));
    f.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'checkbox' && step < sets.length - 1) { e.preventDefault(); next.click(); }
    });

    f.addEventListener('submit', async e => {
      e.preventDefault();
      for (let s = 0; s < sets.length; s++) if (!validate(s)) { go(s); return; }
      if (f.elements._gotcha.value) return; // spam bot
      const data = {
        name: $('#f-name').value.trim(), phone: $('#f-phone').value.trim(), email: $('#f-email').value.trim(),
        company: $('#f-company').value.trim(), equipment: equip, fleet_size: $('#f-trucks').value, authority: $('#f-auth').value,
        home_base: $('#f-base').value.trim(), min_rate_per_mile: $('#f-min').value.trim(), message: $('#f-msg').value.trim(),
        _subject: 'New quote request: ' + equip + ' - ' + $('#f-name').value.trim()
      };
      submit.classList.add('loading'); submit.disabled = true;
      let ok = true, demo = !CFG.formEndpoint;
      if (!demo) {
        try {
          const res = await fetch(CFG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
          ok = res.ok;
        } catch (err) { ok = false; }
      } else {
        await new Promise(r => setTimeout(r, 900));
      }
      submit.classList.remove('loading'); submit.disabled = false;
      if (!ok) {
        toast(CFG.phoneDisplay ? 'Something went wrong. Please call or text ' + CFG.phoneDisplay + '.' : 'Something went wrong. Please try again.');
        return;
      }
      const first = data.name.split(' ')[0];
      $('#doneTitle').textContent = `Thanks, ${first}. Request received.`;
      $('#doneText').textContent = demo
        ? 'Demo mode: add your form endpoint in js/config.js so requests reach a dispatcher.'
        : `A dispatcher will reach out at ${data.phone} to talk through your ${equip.toLowerCase()} and lanes.`;
      sets.forEach(s => s.classList.remove('on'));
      $$('.form-nav, .form-steps', f).forEach(el => { el.hidden = true; });
      $('.form-steps', f).style.display = 'none';
      bar.style.width = '100%';
      $('#done').hidden = false;
      toast('Request received.');
    });

    $('#again').addEventListener('click', () => {
      f.reset(); equip = ''; delete f.dataset.touched;
      $$('button', pick).forEach(b => b.setAttribute('aria-checked', 'false'));
      $('#done').hidden = true; $('.form-nav', f).hidden = false; $('.form-steps', f).style.display = '';
      go(0);
    });
    f.addEventListener('animationend', () => f.classList.remove('shake'));
    go(0);

    // Hero quick form → prefill main form
    const q = $('#quick');
    q.addEventListener('submit', e => {
      e.preventDefault();
      const ph = $('#qPhone').value, eqv = $('#qEquip').value;
      if (ph && !phoneOk(ph)) { q.classList.remove('shake'); void q.offsetWidth; q.classList.add('shake'); toast('Please enter a valid US phone number.'); return; }
      if (ph) { $('#f-phone').value = ph; $('#f-phone').dispatchEvent(new Event('input')); }
      if (eqv) pickEquip(eqv);
      $('#contact').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
      setTimeout(() => $('#f-name').focus({ preventScroll: true }), RM ? 0 : 700);
    });
    q.addEventListener('animationend', () => q.classList.remove('shake'));
  }

  /* ---------- Button ripple ---------- */
  function ripple() {
    document.addEventListener('pointerdown', e => {
      const b = e.target.closest('.btn'); if (!b || RM) return;
      const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), el = document.createElement('span');
      el.className = 'ripple';
      el.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
      b.appendChild(el); setTimeout(() => el.remove(), 650);
    });
  }

  /* ---------- Init ---------- */
  applyConfig();
  splitHero();
  cards();
  equipment();
  calculator();
  loadFeed();
  faq();
  form();
  chrome();
  heroCanvas();
  parallax();
  steps();
  statement();
  counters();
  reveal();
  ripple();
  intro();
})();
