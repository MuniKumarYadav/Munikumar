document.documentElement.classList.add('js');
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const money = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

  // Hero word rotator: keeps rotating even when reduced-motion is enabled.
  // Reduced-motion users get instant text changes without transition effects.
  const rot = $('.rotator');
  if (rot) {
    const words = (rot.dataset.words || 'grow|rank|be found|scale')
      .split('|').map((word) => word.trim()).filter(Boolean);
    let current = Math.max(0, words.indexOf(rot.textContent.trim()));
    if (words.length > 1) {
      window.setInterval(() => {
        if (document.hidden) return;
        const next = (current + 1) % words.length;
        if (reduceMotion) {
          current = next;
          rot.textContent = words[current];
          return;
        }
        rot.classList.add('is-changing');
        window.setTimeout(() => {
          current = next;
          rot.textContent = words[current];
          rot.classList.remove('is-changing');
        }, 180);
      }, 2800);
    }
  }

  // Scroll progress, sticky header, back-to-top
  const progress = document.createElement('div');
  progress.className = 'progress';
  document.body.appendChild(progress);
  const header = $('.site-header'), toTop = $('.to-top');
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
    header && header.classList.toggle('scrolled', scrollY > 10);
    toTop && toTop.classList.toggle('show', scrollY > 700);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop && toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  // Mobile nav
  const toggle = $('.mobile-toggle'), nav = $('.navlinks');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.textContent = open ? '✕' : '☰';
    });
    $$('a', nav).forEach((a) => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
    }));
  }

  // Active nav link by section
  const sectionLinks = $$('.navlinks a[href^="#"]');
  const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    sectionLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  sectionLinks.forEach((a) => { const t = $(a.getAttribute('href')); t && spy.observe(t); });

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  $$('.reveal').forEach((el) => io.observe(el));


  // Dedicated, reliable entrance trigger for the "What does Muni Kumar do?" section
  const servicesSection = $('#services');
  if (servicesSection) {
    const motionTargets = $('.section-head, .answer-block, .service', servicesSection);
    if (reduceMotion || !('IntersectionObserver' in window)) {
      motionTargets.forEach((el) => el.classList.add('services-motion-in'));
    } else {
      const servicesObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('services-motion-in');
          servicesObserver.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
      motionTargets.forEach((el) => servicesObserver.observe(el));
    }
  }

  // Card spotlight
  $$('.service').forEach((card) => card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', e.clientX - r.left + 'px');
    card.style.setProperty('--my', e.clientY - r.top + 'px');
  }));

  // Counters
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
    const prefix = el.dataset.prefix || '', suffix = el.dataset.suffix || '';
    const fmt = (v) => prefix + v.toFixed(dec) + suffix;
    if (reduceMotion) { el.textContent = fmt(target); return; }
    const start = performance.now(), dur = 1300;
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const cio = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { animateCounter(e.target); cio.unobserve(e.target); }
  }), { threshold: 0.6 });
  $$('[data-count]').forEach((c) => cio.observe(c));

  // Accessible tab groups
  const setupTabs = (group, onChange) => {
    const tabs = $$('[role=tab]', group);
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        const panel = t.getAttribute('aria-controls') && document.getElementById(t.getAttribute('aria-controls'));
        if (panel) { panel.classList.toggle('active', on); panel.hidden = !on; }
      });
      onChange && onChange(tab);
    };
    tabs.forEach((t, idx) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        const next = tabs[(idx + d + tabs.length) % tabs.length];
        next.focus(); select(next);
      });
    });
  };

  // Growth simulator
  const channels = {
    blended: { cpc: 15, cvrMult: 1, growth: 0.06, note: 'Blended acquisition balances high-intent search with creative social reach and continuous testing.' },
    search: { cpc: 22, cvrMult: 1.45, growth: 0.04, note: 'Search-led plans capture existing demand: higher click cost, stronger intent and conversion.' },
    social: { cpc: 8, cvrMult: 0.45, growth: 0.09, note: 'Social-led plans buy cheaper attention and compound through creative velocity and retargeting.' },
    seo: { cpc: 13, cvrMult: 1.1, growth: 0.15, note: 'SEO-led plans invest in content and authority: slower start, compounding organic returns.' }
  };
  let channel = 'blended';
  const budget = $('#budget'), cvr = $('#cvr'), aov = $('#aov');
  const bars = $$('.bar');
  const calc = () => {
    if (!budget) return;
    const c = channels[channel], b = +budget.value, rate = (+cvr.value / 100) * c.cvrMult, value = +aov.value;
    const clicks = Math.round(b / c.cpc), conv = Math.round(clicks * rate), rev = conv * value, roas = b ? rev / b : 0;
    $('#budgetOut').textContent = money(b);
    $('#cvrOut').textContent = (+cvr.value).toFixed(1) + '%';
    $('#aovOut').textContent = money(value);
    $('#clicksOut').textContent = clicks.toLocaleString('en-IN');
    $('#convOut').textContent = conv.toLocaleString('en-IN');
    $('#revOut').textContent = money(rev);
    $('#roasOut').textContent = roas.toFixed(2) + '×';
    $('#channelNote').textContent = c.note;
    const months = bars.map((_, m) => rev * Math.pow(1 + c.growth, m));
    const max = Math.max(...months, 1);
    bars.forEach((bar, m) => {
      bar.style.height = Math.max(6, (months[m] / max) * 100) + '%';
      bar.title = 'Month ' + (m + 1) + ': ' + money(months[m]);
    });
    $('#sixMonthOut').textContent = money(months.reduce((a, v) => a + v, 0));
  };
  [budget, cvr, aov].forEach((x) => x && x.addEventListener('input', calc));
  const chTabs = $('#channelTabs');
  chTabs && setupTabs(chTabs, (t) => { channel = t.dataset.channel; calc(); });
  calc();

  // Case studies
  const caseTabs = $('#caseTabs');
  caseTabs && setupTabs(caseTabs);

  // Pricing toggle
  let billing = 'Monthly';
  $$('.billing button').forEach((btn) => btn.addEventListener('click', () => {
    $$('.billing button').forEach((b) => b.setAttribute('aria-pressed', b === btn));
    const yearly = btn.dataset.billing === 'yearly';
    billing = yearly ? 'Yearly' : 'Monthly';
    $$('[data-monthly]').forEach((p) => {
      const v = yearly ? Math.round(+p.dataset.monthly * 0.85) : +p.dataset.monthly;
      p.firstChild.textContent = money(v);
    });
  }));
  $$('.plan .btn').forEach((btn) => btn.addEventListener('click', () => {
    const sel = $('#leadService');
    if (sel && btn.dataset.plan) sel.value = btn.dataset.plan;
  }));

  // Contact form
  const form = $('#leadForm'), status = $('#formStatus');
  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = ['leadName', 'leadEmail', 'leadGoal'].map((id) => $('#' + id));
    let ok = true;
    fields.forEach((f) => { const bad = !f.value.trim(); f.classList.toggle('invalid', bad); if (bad) ok = false; });
    const email = $('#leadEmail');
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { email.classList.add('invalid'); ok = false; }
    status.className = 'form-status ' + (ok ? 'ok' : 'err');
    if (!ok) { status.textContent = 'Please complete the highlighted fields with a valid email.'; return; }
    const v = (id) => $('#' + id).value.trim();
    const subject = encodeURIComponent('Growth brief — ' + v('leadName') + (v('leadCompany') ? ' (' + v('leadCompany') + ')' : ''));
    const body = encodeURIComponent(
      'Name: ' + v('leadName') + '\nEmail: ' + v('leadEmail') + '\nCompany / website: ' + v('leadCompany') +
      '\nService: ' + v('leadService') + (/plan$/.test(v('leadService')) ? ' (' + billing + ' billing)' : '') + '\nMonthly budget: ' + v('leadBudget') + '\n\nGoal:\n' + v('leadGoal'));
    status.textContent = 'Thanks! Opening your email app with your brief…';
    location.href = 'mailto:hello@munikumar.com?subject=' + subject + '&body=' + body;
  });

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
