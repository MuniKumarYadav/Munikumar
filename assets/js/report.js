(() => {
  'use strict';
  // Optional Google PageSpeed Insights API key (restrict it to your domain in Google Cloud).
  const PSI_KEY = '';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = (n) => Math.round(n).toLocaleString('en-IN');
  const band = (s) => (s >= 90 ? 'good' : s >= 50 ? 'avg' : 'poor');
  const grade = (s) => (s >= 90 ? 'A' : s >= 75 ? 'B' : s >= 60 ? 'C' : s >= 40 ? 'D' : 'E');

  // nav
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const toggle = $('.mobile-toggle'), nav = $('.navlinks');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.textContent = open ? '✕' : '☰';
  });
  $('#year').textContent = new Date().getFullYear();

  // checklists
  const seoChecks = [
    ['Every page has a unique title (50–60 characters) with the main keyword', 'Write unique, keyword-led page titles of 50–60 characters.'],
    ['Every page has a meta description (120–160 characters)', 'Add compelling meta descriptions of 120–160 characters to every page.'],
    ['One clear H1 heading per page', 'Use exactly one descriptive H1 per page and structure content with H2/H3.'],
    ['Site uses HTTPS everywhere', 'Move the whole site to HTTPS and redirect HTTP to HTTPS.'],
    ['XML sitemap submitted in Google Search Console', 'Create an XML sitemap and submit it in Google Search Console.'],
    ['Images have descriptive alt text and are compressed (WebP)', 'Compress images (WebP) and add descriptive alt text.'],
    ['Google Business Profile is verified and updated weekly', 'Verify your Google Business Profile and post updates, photos and offers weekly.'],
    ['Name, address and phone (NAP) are the same on site, Google and directories', 'Keep name, address and phone identical on your site, Google, JustDial, IndiaMART and other listings.'],
    ['Pages link to each other with keyword-rich internal links', 'Add internal links between related pages using descriptive anchor text.'],
    ['New blog / content published at least twice a month', 'Publish helpful, keyword-targeted content at least twice a month.'],
    ['Schema markup (Organization / LocalBusiness / FAQ) is added', 'Add schema markup (LocalBusiness, FAQ, Product) for rich results.'],
    ['Earning backlinks from relevant Indian sites / directories', 'Build backlinks from relevant Indian publications, associations and directories.']
  ];
  const smoChecks = [
    ['Same logo, name and handle on every platform', 'Use one consistent logo, brand name and handle on all platforms.'],
    ['Bio explains what you do, for whom, and where (city)', 'Rewrite bios to say what you do, who it is for and your city.'],
    ['Website / WhatsApp link in every bio', 'Add a website or WhatsApp link (with UTM tags) to every bio.'],
    ['Business / creator account with insights enabled', 'Switch to business accounts so you can track insights.'],
    ['Posting follows a monthly content calendar', 'Plan posts with a monthly content calendar mixing reels, carousels and stories.'],
    ['Short videos (Reels / Shorts) every week', 'Publish short-form video (Reels / Shorts) every week; it gets the most reach.'],
    ['Replying to comments and DMs within 24 hours', 'Reply to every comment and DM within 24 hours to lift engagement.'],
    ['Highlights / pinned posts show offers, reviews and FAQs', 'Use highlights and pinned posts for offers, testimonials and FAQs.'],
    ['Using relevant hashtags and location tags', 'Use 5–10 relevant hashtags plus location tags on each post.'],
    ['Running retargeting ads to website visitors', 'Run small retargeting campaigns to people who visited your site or engaged.']
  ];
  const renderChecks = (el, list, key) => {
    el.innerHTML = list.map(([t], i) => `<label><input type="checkbox" data-${key}="${i}"> <span>${esc(t)}</span></label>`).join('');
  };
  renderChecks($('#seoChecklist'), seoChecks, 'seo');
  renderChecks($('#smoChecklist'), smoChecks, 'smo');

  // SMO rows: benchmark engagement rate (%) and recommended posts per week
  const platforms = [
    { id: 'instagram', name: 'Instagram', er: 1.5, posts: 4 },
    { id: 'facebook', name: 'Facebook', er: 0.5, posts: 4 },
    { id: 'youtube', name: 'YouTube', er: 2, posts: 1 },
    { id: 'linkedin', name: 'LinkedIn', er: 2, posts: 3 },
    { id: 'x', name: 'X (Twitter)', er: 0.5, posts: 7 }
  ];
  const fields = ['followers', 'posts', 'likes', 'comments', 'shares'];
  $('#smoRows').innerHTML = platforms.map((p) => `<tr><td>${p.name}</td>${fields.map((f) =>
    `<td><input type="number" min="0" step="any" inputmode="decimal" id="${p.id}-${f}" aria-label="${p.name} ${f}" placeholder="0"></td>`).join('')}</tr>`).join('');

  // SEO via PageSpeed Insights
  let psi = null;
  const seoForm = $('#seoForm'), seoStatus = $('#seoStatus'), seoBtn = $('#seoBtn');
  const setStatus = (el, msg, cls = '') => { el.textContent = msg; el.className = 'form-status ' + cls; };
  const normaliseUrl = (v) => {
    v = v.trim();
    if (!v) return null;
    if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
    try { const u = new URL(v); return /\./.test(u.hostname) ? u.href : null; } catch { return null; }
  };

  seoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = normaliseUrl($('#siteUrl').value);
    if (!url) { setStatus(seoStatus, 'Please enter a valid website address, e.g. https://yourbusiness.in', 'err'); $('#siteUrl').classList.add('invalid'); return; }
    $('#siteUrl').classList.remove('invalid');
    const strategy = $('#strategy').value;
    const q = new URLSearchParams({ url, strategy });
    ['performance', 'seo', 'accessibility', 'best-practices'].forEach((c) => q.append('category', c));
    if (PSI_KEY) q.set('key', PSI_KEY);
    seoBtn.disabled = true; seoBtn.textContent = 'Analysing…';
    setStatus(seoStatus, 'Running Google Lighthouse on ' + url + ' — this usually takes 20–60 seconds.');
    try {
      const res = await fetch('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?' + q);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = res.status === 429
          ? 'Google\'s free analysis limit is busy right now. Please try again in a minute — meanwhile, fill in the checklist below.'
          : (data.error && data.error.message) || 'Google could not analyse this page.';
        throw new Error(msg);
      }
      psi = parsePsi(data, url, strategy);
      renderPsi(psi);
      setStatus(seoStatus, 'Analysis complete for ' + psi.url + ' (' + strategy + ').', 'ok');
    } catch (err) {
      psi = null; $('#seoResults').hidden = true;
      setStatus(seoStatus, err.message === 'Failed to fetch' ? 'Could not reach Google PageSpeed Insights. Check your connection and try again.' : err.message, 'err');
    } finally {
      seoBtn.disabled = false; seoBtn.textContent = 'Analyse website →';
    }
  });

  function parsePsi(data, url, strategy) {
    const lh = data.lighthouseResult || {};
    const cats = lh.categories || {}, audits = lh.audits || {};
    const score = (k) => (cats[k] && cats[k].score != null ? Math.round(cats[k].score * 100) : null);
    const vit = [['first-contentful-paint', 'FCP'], ['largest-contentful-paint', 'LCP'], ['total-blocking-time', 'TBT'], ['cumulative-layout-shift', 'CLS'], ['speed-index', 'Speed Index']]
      .filter(([k]) => audits[k]).map(([k, label]) => ({ label, value: audits[k].displayValue || '–', score: Math.round((audits[k].score || 0) * 100) }));
    const seoIssues = ((cats.seo && cats.seo.auditRefs) || [])
      .map((r) => audits[r.id]).filter((a) => a && a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'manual' && a.scoreDisplayMode !== 'notApplicable')
      .map((a) => ({ title: a.title, detail: a.displayValue || '' }));
    const speedIssues = Object.values(audits)
      .filter((a) => a.details && a.details.type === 'opportunity' && a.details.overallSavingsMs > 100)
      .sort((a, b) => b.details.overallSavingsMs - a.details.overallSavingsMs).slice(0, 6)
      .map((a) => ({ title: a.title, detail: 'Potential saving ~' + (a.details.overallSavingsMs / 1000).toFixed(1) + ' s' }));
    return {
      url: lh.finalDisplayedUrl || lh.finalUrl || url, strategy,
      scores: { Performance: score('performance'), SEO: score('seo'), Accessibility: score('accessibility'), 'Best practices': score('best-practices') },
      vitals: vit, seoIssues, speedIssues
    };
  }

  function renderPsi(r) {
    $('#gauges').innerHTML = Object.entries(r.scores).map(([k, v]) => v == null ? '' :
      `<div class="gauge"><div class="ring ${band(v)}" style="--p:${v}"><span>${v}</span></div><small>${k}</small></div>`).join('');
    $('#vitals').innerHTML = r.vitals.map((v) => `<div class="vital"><small>${v.label}</small><strong class="${band(v.score)}">${esc(v.value)}</strong></div>`).join('');
    const list = (items, okMsg) => items.length
      ? items.map((i) => `<li>${esc(i.title)}${i.detail ? `<span>${esc(i.detail)}</span>` : ''}</li>`).join('')
      : `<li class="ok">${okMsg}</li>`;
    $('#seoIssues').innerHTML = list(r.seoIssues, 'No technical SEO issues found by Lighthouse.');
    $('#speedIssues').innerHTML = list(r.speedIssues, 'No major speed opportunities found.');
    $('#seoResults').hidden = false;
  }

  // SMO scoring
  function smoResults() {
    return platforms.map((p) => {
      const v = Object.fromEntries(fields.map((f) => [f, Math.max(0, +$(`#${p.id}-${f}`).value || 0)]));
      if (!v.followers) return null;
      const er = ((v.likes + v.comments + v.shares) / v.followers) * 100;
      const score = Math.round(Math.min(er / p.er, 1.5) / 1.5 * 60 + Math.min(v.posts / p.posts, 1) * 40);
      return { ...p, ...v, erRate: er, score };
    }).filter(Boolean);
  }

  // Report
  $('#genBtn').addEventListener('click', () => {
    const smo = smoResults();
    const seoDone = $$('[data-seo]').filter((c) => c.checked).map((c) => +c.dataset.seo);
    const smoDone = $$('[data-smo]').filter((c) => c.checked).map((c) => +c.dataset.smo);
    const anySeoInput = psi || seoDone.length;
    if (!anySeoInput && !smo.length && !smoDone.length) {
      setStatus($('#genStatus'), 'Run the website audit, tick some checklist items or enter social media numbers first.', 'err');
      return;
    }
    setStatus($('#genStatus'), '');
    const checklistSeo = Math.round((seoDone.length / seoChecks.length) * 100);
    const lhSeo = psi && psi.scores.SEO != null ? psi.scores.SEO : null;
    const lhPerf = psi && psi.scores.Performance != null ? psi.scores.Performance : null;
    const seoParts = [lhSeo, lhPerf, checklistSeo].filter((x) => x != null);
    const seoScore = Math.round(seoParts.reduce((a, b) => a + b, 0) / seoParts.length);
    const checklistSmo = Math.round((smoDone.length / smoChecks.length) * 100);
    const platformAvg = smo.length ? smo.reduce((a, p) => a + p.score, 0) / smo.length : null;
    const smoScore = Math.round(platformAvg == null ? checklistSmo : platformAvg * 0.7 + checklistSmo * 0.3);
    const overall = Math.round((seoScore + smoScore) / 2);

    const seoRecs = [], smoRecs = [];
    if (psi) {
      if (lhPerf != null && lhPerf < 90) seoRecs.push(`<b>Speed up your site</b> — ${psi.strategy} performance is ${lhPerf}/100. ${psi.speedIssues[0] ? esc(psi.speedIssues[0].title) + '.' : ''}`);
      psi.seoIssues.slice(0, 4).forEach((i) => seoRecs.push(`<b>Fix SEO issue:</b> ${esc(i.title)}.`));
    } else {
      seoRecs.push('<b>Run the website audit</b> to get Google Lighthouse SEO and speed scores.');
    }
    seoChecks.forEach(([, fix], i) => { if (!seoDone.includes(i)) seoRecs.push(`<b>SEO:</b> ${esc(fix)}`); });
    smo.filter((p) => p.erRate < p.er).forEach((p) => smoRecs.push(`<b>${p.name}:</b> engagement is ${p.erRate.toFixed(2)}% vs a ${p.er}% benchmark — post more interactive content (polls, questions, reels) and reply faster.`));
    smo.filter((p) => p.posts < platforms.find((x) => x.id === p.id).posts).forEach((p) => smoRecs.push(`<b>${p.name}:</b> you post ${p.posts}× a week; aim for at least ${platforms.find((x) => x.id === p.id).posts}× a week.`));
    smoChecks.forEach(([, fix], i) => { if (!smoDone.includes(i)) smoRecs.push(`<b>SMO:</b> ${esc(fix)}`); });
    const recs = [];
    for (let i = 0; recs.length < 12 && (i < seoRecs.length || i < smoRecs.length); i++) {
      if (seoRecs[i]) recs.push(seoRecs[i]);
      if (smoRecs[i] && recs.length < 12) recs.push(smoRecs[i]);
    }

    const name = $('#bizName').value.trim();
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const scoreCard = (label, s) => `<div class="rep-score"><small>${label}</small><strong class="${band(s)}">${s}</strong><em class="${band(s)}">Grade ${grade(s)}</em></div>`;
    const rep = $('#report');
    rep.innerHTML = `
      <div class="rep-head">
        <div><span class="kicker">SEO &amp; SMO Report</span><h2>${name ? esc(name) : 'Your digital marketing report'}</h2>
        <p>${psi ? esc(psi.url) + ' · ' : ''}Generated ${date} by Munikumar Growth Marketing Studio</p></div>
        <div class="rep-actions"><button class="btn" type="button" id="printBtn">Download PDF</button><button class="btn alt" type="button" id="editBtn">Edit inputs</button></div>
      </div>
      <div class="rep-scores">${scoreCard('Overall score', overall)}${scoreCard('SEO score', seoScore)}${scoreCard('SMO score', smoScore)}</div>
      ${psi ? `<div class="rep-section"><h3>Google Lighthouse (${psi.strategy})</h3>
        <table class="rep-table"><tr>${Object.keys(psi.scores).map((k) => `<th>${k}</th>`).join('')}</tr>
        <tr>${Object.values(psi.scores).map((v) => `<td class="${v == null ? '' : band(v)}"><b>${v == null ? '–' : v}</b></td>`).join('')}</tr></table>
        <table class="rep-table"><tr>${psi.vitals.map((v) => `<th>${v.label}</th>`).join('')}</tr><tr>${psi.vitals.map((v) => `<td class="${band(v.score)}">${esc(v.value)}</td>`).join('')}</tr></table></div>` : ''}
      <div class="rep-section"><h3>SEO checklist</h3><p class="note">${seoDone.length} of ${seoChecks.length} on-page and local SEO best practices in place (${checklistSeo}%).</p></div>
      ${smo.length ? `<div class="rep-section"><h3>Social media performance</h3>
        <table class="rep-table"><tr><th>Platform</th><th>Followers</th><th>Posts / week</th><th>Engagement rate</th><th>Benchmark</th><th>Score</th></tr>
        ${smo.map((p) => `<tr><td>${p.name}</td><td>${num(p.followers)}</td><td>${p.posts}</td><td class="${p.erRate >= p.er ? 'good' : 'avg'}">${p.erRate.toFixed(2)}%</td><td>${p.er}%</td><td class="${band(p.score)}"><b>${p.score}</b></td></tr>`).join('')}
        </table></div>` : ''}
      <div class="rep-section"><h3>SMO checklist</h3><p class="note">${smoDone.length} of ${smoChecks.length} profile optimisation best practices in place (${checklistSmo}%).</p></div>
      <div class="rep-section"><h3>Priority action plan</h3><ol class="recs">${recs.slice(0, 12).map((r) => `<li>${r}</li>`).join('') || '<li>Great work — keep monitoring monthly.</li>'}</ol></div>
      <div class="rep-cta"><p><b>Want us to fix this for you?</b> Get a free 30-minute growth audit call · munikumar.onrender.com</p><a class="btn" href="/#contact">Get my free audit →</a></div>`;
    rep.hidden = false;
    $('#printBtn').addEventListener('click', () => print());
    $('#editBtn').addEventListener('click', () => $('#seo').scrollIntoView());
    rep.scrollIntoView();
  });
})();
