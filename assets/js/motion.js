// Decorative motion layer. Safe to remove: nothing on the site depends on it.
(function () {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    n.className = cls; n.setAttribute('aria-hidden', 'true');
    if (html) n.innerHTML = html;
    return n;
  };

  // Drifting colour background
  document.body.prepend(el('div', 'm-aurora', '<i></i><i></i><i></i>'));

  // Stagger cards in each grid so they cascade in instead of appearing together.
  // The delay is cleared once the card has appeared so hover effects stay instant.
  $$('.services, .process, .pricing').forEach((grid) => {
    $$(':scope > .reveal', grid).forEach((card, i) => {
      card.style.transitionDelay = (i % 3) * 110 + 'ms';
      const clear = (e) => {
        if (e.target !== card || e.propertyName !== 'opacity') return;
        card.style.transitionDelay = '';
        card.removeEventListener('transitionend', clear);
      };
      card.addEventListener('transitionend', clear);
    });
  });

  // Hero: constellation canvas
  const hero = $('.hero');
  const cv = hero && el('canvas', 'm-net');
  const ctx = cv && cv.getContext && cv.getContext('2d');
  if (ctx) {
    hero.prepend(cv);
    let w = 0, h = 0, pts = [], raf = 0, visible = true;
    const mouse = { x: -9999, y: -9999 };
    const LINK = 130;
    const size = () => {
      const r = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(18, Math.min(80, Math.round((w * h) / 17000)));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.4 + 0.6,
      }));
    };
    const frame = () => {
      raf = 0;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
          if (d < LINK * LINK) {
            ctx.strokeStyle = 'rgba(91,140,255,' + (0.22 * (1 - Math.sqrt(d) / LINK)).toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const mx = a.x - mouse.x, my = a.y - mouse.y, md = Math.sqrt(mx * mx + my * my);
        if (md < 190) {
          ctx.strokeStyle = 'rgba(56,217,255,' + (0.45 * (1 - md / 190)).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(150,200,255,.55)';
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832); ctx.fill();
      }
      play();
    };
    const play = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
    size(); cv.classList.add('on'); play();
    let rt;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(size, 150); });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; play(); }).observe(hero);
    document.addEventListener('visibilitychange', play);
    if (finePointer) {
      addEventListener('pointermove', (e) => {
        const r = cv.getBoundingClientRect();
        mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      }, { passive: true });
    }
  }

  if (!finePointer) return; // pointer-driven effects below are desktop only

  // Soft light that follows the cursor
  const glow = el('div', 'm-glow');
  document.body.prepend(glow);
  let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy, graf = 0;
  const follow = () => {
    gx += (tx - gx) * 0.14; gy += (ty - gy) * 0.14;
    glow.style.transform = 'translate3d(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px,0)';
    graf = Math.abs(tx - gx) + Math.abs(ty - gy) > 0.5 ? requestAnimationFrame(follow) : 0;
  };
  addEventListener('pointermove', (e) => {
    tx = e.clientX; ty = e.clientY;
    glow.classList.add('on');
    if (!graf) graf = requestAnimationFrame(follow);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => glow.classList.remove('on'));

  // Hero image tilt + parallax cards
  const visual = $('.hero-visual');
  if (visual) {
    visual.addEventListener('pointermove', (e) => {
      const r = visual.getBoundingClientRect();
      visual.style.setProperty('--tx', (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
      visual.style.setProperty('--ty', (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
    });
    visual.addEventListener('pointerleave', () => {
      visual.style.setProperty('--tx', 0); visual.style.setProperty('--ty', 0);
    });
  }

  // Magnetic buttons (delegated, so it also covers buttons added later)
  let magnet = null;
  document.addEventListener('pointermove', (e) => {
    const b = e.target.closest && e.target.closest('.btn');
    if (magnet && magnet !== b) { magnet.style.removeProperty('--bx'); magnet.style.removeProperty('--by'); }
    magnet = b && !b.disabled ? b : null;
    if (!magnet) return;
    const r = magnet.getBoundingClientRect();
    magnet.style.setProperty('--bx', ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + 'px');
    magnet.style.setProperty('--by', ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + 'px');
  }, { passive: true });
})();
