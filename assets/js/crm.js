(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const KEY = 'munikumar.crm.v1';

  const STAGES = [
    { id: 'new', label: 'New', color: '#38d9ff' },
    { id: 'contacted', label: 'Contacted', color: '#5b8cff' },
    { id: 'qualified', label: 'Qualified', color: '#9b7cff' },
    { id: 'proposal', label: 'Proposal', color: '#ffb454' },
    { id: 'won', label: 'Won', color: '#55e6a5' },
    { id: 'lost', label: 'Lost', color: '#ff6b6b' },
  ];
  const SOURCES = ['Organic search', 'Google Ads', 'Meta Ads', 'Instagram', 'WhatsApp', 'Referral', 'Email', 'Website form', 'Other'];
  const SERVICES = ['SEO', 'Paid ads', 'Social media', 'Content', 'WhatsApp marketing', 'Website / CRO', 'Analytics', 'Other'];
  const FIELDS = ['name', 'company', 'email', 'phone', 'source', 'service', 'value', 'stage', 'followUp', 'notes', 'createdAt'];
  const stageOf = (id) => STAGES.find((s) => s.id === id) || STAGES[0];
  const stageIdx = (id) => STAGES.findIndex((s) => s.id === id);

  // ---------- helpers ----------
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => '₹' + Math.round(n || 0).toLocaleString('en-IN');
  const moneyShort = (n) => {
    n = Math.round(n || 0);
    if (n >= 1e7) return '₹' + +(n / 1e7).toFixed(2) + ' Cr';
    if (n >= 1e5) return '₹' + +(n / 1e5).toFixed(2) + ' L';
    return money(n);
  };
  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const today = () => iso(new Date());
  const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
  const validDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '') && !isNaN(new Date(s + 'T00:00:00'));
  const fmtDate = (s) => new Date(s + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
  const digits = (s) => String(s || '').replace(/\D/g, '');
  const isOpen = (l) => l.stage !== 'won' && l.stage !== 'lost';
  const plural = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');

  function dueInfo(l) {
    if (!l.followUp || !isOpen(l)) return null;
    const t = today();
    if (l.followUp < t) return { cls: 'late', text: 'Overdue · ' + fmtDate(l.followUp) };
    if (l.followUp === t) return { cls: 'today', text: 'Follow up today' };
    return { cls: '', text: 'Follow up ' + fmtDate(l.followUp) };
  }

  function normalise(raw) {
    const value = Math.max(0, Math.round(Number(String(raw.value == null ? '' : raw.value).replace(/[₹,\s]/g, '')) || 0));
    const stageRaw = String(raw.stage || '').trim().toLowerCase();
    const stage = (STAGES.find((s) => s.id === stageRaw || s.label.toLowerCase() === stageRaw) || STAGES[0]).id;
    const pick = (list, v) => list.find((x) => x.toLowerCase() === String(v || '').trim().toLowerCase()) || 'Other';
    const fu = String(raw.followUp || '').trim();
    const created = String(raw.createdAt || '').trim();
    return {
      id: raw.id ? String(raw.id) : uid(),
      name: String(raw.name || '').trim().slice(0, 80),
      company: String(raw.company || '').trim().slice(0, 80),
      email: String(raw.email || '').trim().slice(0, 120),
      phone: String(raw.phone || '').trim().slice(0, 20),
      source: pick(SOURCES, raw.source),
      service: pick(SERVICES, raw.service),
      value,
      stage,
      followUp: validDate(fu) ? fu : '',
      notes: String(raw.notes || '').trim().slice(0, 1000),
      createdAt: validDate(created) ? created : today(),
    };
  }

  // ---------- state ----------
  let leads = [];
  let storageOk = true;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (Array.isArray(saved)) leads = saved.map(normalise).filter((l) => l.name);
  } catch (e) { storageOk = false; }

  let view = 'board';
  let sort = { key: 'createdAt', dir: -1 };
  let editingId = null;

  const statusEl = $('#status');
  function say(msg, kind) {
    statusEl.textContent = msg;
    statusEl.className = 'form-status' + (kind ? ' ' + kind : '');
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(leads)); }
    catch (e) {
      storageOk = false;
      say('Could not save to this browser (storage is blocked or full). Export a CSV so you don\'t lose your changes.', 'err');
    }
  }

  // ---------- selects ----------
  const opts = (list) => list.map((x) => `<option>${esc(x)}</option>`).join('');
  const stageOpts = (sel) => STAGES.map((s) => `<option value="${s.id}"${s.id === sel ? ' selected' : ''}>${s.label}</option>`).join('');
  $('#fSource').insertAdjacentHTML('beforeend', opts(SOURCES));
  $('#fStage').insertAdjacentHTML('beforeend', stageOpts());
  $('#lSource').innerHTML = opts(SOURCES);
  $('#lService').innerHTML = opts(SERVICES);
  $('#lStage').innerHTML = stageOpts('new');

  // ---------- rendering ----------
  function filtered() {
    const q = $('#q').value.trim().toLowerCase();
    const src = $('#fSource').value, st = $('#fStage').value;
    return leads.filter((l) =>
      (!src || l.source === src) && (!st || l.stage === st) &&
      (!q || [l.name, l.company, l.email, l.phone, l.notes].some((v) => v.toLowerCase().includes(q))));
  }

  function contactLinks(l) {
    let h = '';
    if (l.email) h += `<a class="ia" href="mailto:${encodeURIComponent(l.email)}" title="Email" aria-label="Email ${esc(l.name)}">✉</a>`;
    const p = digits(l.phone);
    if (p.length >= 8) h += `<a class="ia" href="https://wa.me/${p}" target="_blank" rel="noopener noreferrer" title="WhatsApp" aria-label="WhatsApp ${esc(l.name)}">💬</a>`;
    return h;
  }

  function cardHTML(l) {
    const s = stageOf(l.stage), d = dueInfo(l);
    return `<article class="lead" draggable="true" data-id="${esc(l.id)}" style="--c:${s.color}">
<button type="button" class="lead-name" data-edit="${esc(l.id)}" title="Edit lead">${esc(l.name)}</button>
${l.company ? `<div class="lead-co">${esc(l.company)}</div>` : ''}
<div class="lead-meta"><span class="chip">${esc(l.source)}</span><strong>${l.value ? moneyShort(l.value) : '—'}</strong></div>
${d ? `<div class="due ${d.cls}">${esc(d.text)}</div>` : ''}
<div class="lead-foot"><select data-stage="${esc(l.id)}" aria-label="Stage for ${esc(l.name)}">${stageOpts(l.stage)}</select>${contactLinks(l)}</div>
</article>`;
  }

  function renderBoard(list) {
    $('#board').innerHTML = STAGES.map((s) => {
      const items = list.filter((l) => l.stage === s.id);
      const total = items.reduce((a, l) => a + l.value, 0);
      return `<div class="col" data-col="${s.id}" style="--c:${s.color}">
<div class="col-head"><h3><i></i>${s.label}<b>${items.length}</b></h3><small>${money(total)}</small></div>
<div class="col-body">${items.map(cardHTML).join('') || '<div class="col-empty">Drop a lead here</div>'}</div>
</div>`;
    }).join('');
  }

  function renderTable(list) {
    const k = sort.key;
    const val = (l) => (k === 'stage' ? stageIdx(l.stage) : k === 'value' ? l.value : String(l[k] || '').toLowerCase());
    const rows = [...list].sort((a, b) => {
      const x = val(a), y = val(b);
      // keep leads with no follow-up date at the bottom whichever way we sort
      if (k === 'followUp' && (!x || !y) && x !== y) return x ? -1 : 1;
      return (x < y ? -1 : x > y ? 1 : 0) * sort.dir;
    });
    $('#rows').innerHTML = rows.map((l) => {
      const s = stageOf(l.stage), d = dueInfo(l);
      return `<tr>
<td><button type="button" class="lead-name" data-edit="${esc(l.id)}">${esc(l.name)}</button><small>${esc(l.company || l.email || l.phone)}</small></td>
<td>${esc(l.source)}</td><td>${esc(l.service)}</td>
<td><span class="stage-pill" style="--c:${s.color}"><i></i>${s.label}</span></td>
<td class="num">${l.value ? money(l.value) : '—'}</td>
<td>${d ? `<span class="due ${d.cls}">${esc(d.text.replace(/^Follow up /, '').replace(/^today$/, 'Today'))}</span>` : (l.followUp ? esc(fmtDate(l.followUp)) : '—')}</td>
<td><div class="row-actions">${contactLinks(l)}<button type="button" class="ia" data-edit="${esc(l.id)}" aria-label="Edit ${esc(l.name)}" title="Edit">✎</button></div></td>
</tr>`;
    }).join('');
    $('#noMatch').hidden = rows.length > 0;
    $$('.crm-table th').forEach((th) => {
      const b = $('button', th);
      if (!b) return;
      if (b.dataset.sort === k) th.setAttribute('aria-sort', sort.dir === 1 ? 'ascending' : 'descending');
      else th.removeAttribute('aria-sort');
    });
  }

  function renderKpis() {
    const open = leads.filter(isOpen), won = leads.filter((l) => l.stage === 'won'), lost = leads.filter((l) => l.stage === 'lost');
    const sum = (a) => a.reduce((t, l) => t + l.value, 0);
    const t = today();
    const monthStart = t.slice(0, 8) + '01';
    const fresh = leads.filter((l) => l.createdAt >= monthStart).length;
    const overdue = open.filter((l) => l.followUp && l.followUp < t).length;
    const dueToday = open.filter((l) => l.followUp === t).length;
    const closed = won.length + lost.length;
    $('#kTotal').textContent = leads.length;
    $('#kTotalSub').textContent = fresh + ' added this month';
    $('#kPipeline').textContent = moneyShort(sum(open));
    $('#kPipelineSub').textContent = plural(open.length, 'open deal');
    $('#kWon').textContent = moneyShort(sum(won));
    $('#kWonSub').textContent = plural(won.length, 'deal') + ' won';
    $('#kRate').textContent = closed ? Math.round((won.length / closed) * 100) + '%' : '—';
    $('#kDue').textContent = overdue + dueToday;
    const ds = $('#kDueSub');
    ds.textContent = overdue ? overdue + ' overdue' : dueToday ? 'Due today' : 'All caught up';
    ds.className = overdue ? 'warn' : '';
  }

  function renderSources() {
    const map = {};
    leads.forEach((l) => {
      const m = map[l.source] || (map[l.source] = { n: 0, won: 0, rev: 0 });
      m.n++;
      if (l.stage === 'won') { m.won++; m.rev += l.value; }
    });
    const rows = Object.entries(map).sort((a, b) => b[1].n - a[1].n);
    const max = rows.length ? rows[0][1].n : 1;
    $('#sources').innerHTML = rows.length ? rows.map(([name, m]) => `<div>
<div class="src-top"><b>${esc(name)}</b><span>${plural(m.n, 'lead')} · ${m.won} won · ${moneyShort(m.rev)}</span></div>
<div class="src-bar"><i style="width:${Math.max(4, (m.n / max) * 100)}%"></i></div></div>`).join('')
      : '<p class="muted">Add leads to see which channels perform.</p>';
  }

  function renderFollowups() {
    const limit = addDays(7);
    const list = leads.filter((l) => isOpen(l) && l.followUp && l.followUp <= limit)
      .sort((a, b) => (a.followUp < b.followUp ? -1 : a.followUp > b.followUp ? 1 : 0)).slice(0, 8);
    $('#followups').innerHTML = list.length ? list.map((l) => {
      const d = dueInfo(l);
      return `<li><div><button type="button" class="lead-name" data-edit="${esc(l.id)}">${esc(l.name)}</button><div class="due ${d.cls}">${esc(d.text)}</div></div>
<div class="row-actions">${contactLinks(l)}<button type="button" class="ia" data-done="${esc(l.id)}" title="Mark follow-up done" aria-label="Mark follow-up done for ${esc(l.name)}">✓</button></div></li>`;
    }).join('') : '<li class="muted">Nothing due in the next 7 days.</li>';
  }

  function render() {
    const list = filtered();
    const none = leads.length === 0;
    $('#empty').hidden = !none;
    $('#board').hidden = none || view !== 'board';
    $('#tableWrap').hidden = none || view !== 'table';
    if (!none) (view === 'board' ? renderBoard : renderTable)(list);
    $('#exportBtn').disabled = none;
    renderKpis(); renderSources(); renderFollowups();
  }

  // ---------- mutations ----------
  function setStage(id, stage) {
    const l = leads.find((x) => x.id === id);
    if (!l || l.stage === stage || stageIdx(stage) < 0) return;
    l.stage = stage;
    save(); render();
    if (storageOk) say(`${l.name} moved to ${stageOf(stage).label}.`, 'ok');
  }

  // ---------- dialog ----------
  const dlg = $('#leadDialog'), form = $('#leadForm');
  function openDialog(id) {
    const l = id ? leads.find((x) => x.id === id) : null;
    editingId = l ? l.id : null;
    $('#dlgTitle').textContent = l ? 'Edit lead' : 'Add lead';
    $('#dlgDelete').hidden = !l;
    $('#dlgErr').textContent = '';
    $('#lName').value = l ? l.name : '';
    $('#lCompany').value = l ? l.company : '';
    $('#lEmail').value = l ? l.email : '';
    $('#lPhone').value = l ? l.phone : '';
    $('#lSource').value = l ? l.source : SOURCES[0];
    $('#lService').value = l ? l.service : SERVICES[0];
    $('#lValue').value = l && l.value ? l.value : '';
    $('#lStage').value = l ? l.stage : 'new';
    $('#lFollow').value = l ? l.followUp : '';
    $('#lNotes').value = l ? l.notes : '';
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    $('#lName').focus();
  }
  function closeDialog() { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const err = $('#dlgErr');
    const name = $('#lName').value.trim(), email = $('#lEmail').value.trim();
    if (!name) { err.textContent = 'Please enter a name.'; $('#lName').focus(); return; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = 'That email address doesn\'t look right.'; $('#lEmail').focus(); return; }
    if (Number($('#lValue').value) < 0) { err.textContent = 'Deal value can\'t be negative.'; $('#lValue').focus(); return; }
    const prev = editingId ? leads.find((x) => x.id === editingId) : null;
    const lead = normalise({
      id: prev ? prev.id : undefined, createdAt: prev ? prev.createdAt : today(),
      name, email, company: $('#lCompany').value, phone: $('#lPhone').value, source: $('#lSource').value,
      service: $('#lService').value, value: $('#lValue').value, stage: $('#lStage').value,
      followUp: $('#lFollow').value, notes: $('#lNotes').value,
    });
    if (prev) leads[leads.indexOf(prev)] = lead; else leads.unshift(lead);
    closeDialog(); save(); render();
    if (storageOk) say(prev ? 'Lead updated.' : 'Lead added.', 'ok');
  });
  $('#dlgCancel').addEventListener('click', closeDialog);
  $('#dlgClose').addEventListener('click', closeDialog);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) closeDialog(); });
  $('#dlgDelete').addEventListener('click', () => {
    const l = leads.find((x) => x.id === editingId);
    if (!l || !confirm(`Delete ${l.name}? This can't be undone.`)) return;
    leads = leads.filter((x) => x !== l);
    closeDialog(); save(); render();
    if (storageOk) say('Lead deleted.', 'ok');
  });

  // ---------- events ----------
  $('#addBtn').addEventListener('click', () => openDialog());
  $('#emptyAdd').addEventListener('click', () => openDialog());
  ['q', 'fSource', 'fStage'].forEach((id) => $('#' + id).addEventListener('input', render));

  function setView(v) {
    view = v;
    $('#vBoard').setAttribute('aria-pressed', v === 'board');
    $('#vTable').setAttribute('aria-pressed', v === 'table');
    render();
  }
  $('#vBoard').addEventListener('click', () => setView('board'));
  $('#vTable').addEventListener('click', () => setView('table'));

  document.addEventListener('click', (e) => {
    const ed = e.target.closest('[data-edit]');
    if (ed) return openDialog(ed.dataset.edit);
    const done = e.target.closest('[data-done]');
    if (done) {
      const l = leads.find((x) => x.id === done.dataset.done);
      if (l) { l.followUp = ''; save(); render(); if (storageOk) say(`Follow-up cleared for ${l.name}. Open the lead to schedule the next one.`, 'ok'); }
      return;
    }
    const sb = e.target.closest('[data-sort]');
    if (sb) {
      const k = sb.dataset.sort;
      sort = { key: k, dir: sort.key === k ? -sort.dir : (k === 'value' ? -1 : 1) };
      render();
    }
  });
  document.addEventListener('change', (e) => {
    if (e.target.matches('[data-stage]')) setStage(e.target.dataset.stage, e.target.value);
  });

  // Drag and drop between columns
  const board = $('#board');
  let dragId = null;
  board.addEventListener('dragstart', (e) => {
    const card = e.target.closest && e.target.closest('.lead');
    if (!card) return;
    dragId = card.dataset.id;
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragId);
  });
  board.addEventListener('dragend', () => {
    dragId = null;
    $$('.dragging,.over', board).forEach((el) => el.classList.remove('dragging', 'over'));
  });
  board.addEventListener('dragover', (e) => {
    const col = e.target.closest('.col');
    if (!col || !dragId) return;
    e.preventDefault();
    $$('.col.over', board).forEach((c) => c !== col && c.classList.remove('over'));
    col.classList.add('over');
  });
  board.addEventListener('drop', (e) => {
    const col = e.target.closest('.col');
    if (!col || !dragId) return;
    e.preventDefault();
    const id = dragId; dragId = null;
    setStage(id, col.dataset.col);
  });

  // ---------- CSV ----------
  function csvCell(v) {
    let s = String(v == null ? '' : v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // stop spreadsheets treating text as a formula
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  $('#exportBtn').addEventListener('click', () => {
    if (!leads.length) return;
    const lines = [FIELDS.join(',')].concat(leads.map((l) => FIELDS.map((f) => csvCell(f === 'value' ? String(l.value) : l[f])).join(',')));
    const blob = new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'crm-leads-' + today() + '.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    say(`Exported ${plural(leads.length, 'lead')}.`, 'ok');
  });

  function parseCSV(text) {
    const rows = []; let row = [], cell = '', q = false;
    text = text.replace(/^\ufeff/, '');
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows.filter((r) => r.some((x) => x.trim() !== ''));
  }
  const ALIASES = {
    name: ['name', 'lead', 'leadname', 'fullname', 'contact', 'contactname'], company: ['company', 'business', 'organisation', 'organization'],
    email: ['email', 'emailaddress', 'mail'], phone: ['phone', 'mobile', 'phonenumber', 'whatsapp', 'contactnumber'],
    source: ['source', 'channel', 'leadsource'], service: ['service', 'interest', 'interestedin'],
    value: ['value', 'dealvalue', 'amount', 'budget'], stage: ['stage', 'status'],
    followUp: ['followup', 'nextfollowup', 'followupdate'], notes: ['notes', 'note', 'comments', 'message'], createdAt: ['createdat', 'created', 'date'],
  };
  $('#importBtn').addEventListener('click', () => $('#importFile').click());
  $('#importFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return say('That file is larger than 2 MB. Split it into smaller files and try again.', 'err');
    let rows;
    try { rows = parseCSV(await file.text()); } catch (err) { return say('Could not read that file.', 'err'); }
    if (rows.length < 2) return say('That CSV has no data rows.', 'err');
    const head = rows[0].map((h) => h.toLowerCase().replace(/[^a-z]/g, ''));
    const col = {};
    Object.keys(ALIASES).forEach((f) => { const i = head.findIndex((h) => ALIASES[f].includes(h)); if (i >= 0) col[f] = i; });
    if (col.name == null) return say('Import needs a "name" column in the first row. Export a CSV to see the expected format.', 'err');
    const seen = new Set(leads.map((l) => (l.name + '|' + l.email + '|' + digits(l.phone)).toLowerCase()));
    let added = 0, skipped = 0;
    rows.slice(1).forEach((r) => {
      const raw = {};
      Object.keys(col).forEach((f) => { raw[f] = (r[col[f]] || '').replace(/^'(?=[=+\-@])/, ''); });
      const l = normalise(raw);
      const sig = (l.name + '|' + l.email + '|' + digits(l.phone)).toLowerCase();
      if (!l.name || seen.has(sig)) { skipped++; return; }
      seen.add(sig); leads.push(l); added++;
    });
    save(); render();
    if (storageOk || !added) say(`Imported ${plural(added, 'lead')}` + (skipped ? `, skipped ${skipped} (duplicate or missing name).` : '.'), added ? 'ok' : 'err');
  });

  // ---------- example data (only on request) ----------
  $('#sampleBtn').addEventListener('click', () => {
    const S = [
      ['Example: Anita Rao', 'Lakshmi Textiles', 'anita@example.com', '', 'Organic search', 'SEO', 45000, 'new', addDays(1), 'Wants more local search enquiries.'],
      ['Example: Kiran Reddy', 'Reddy Dental Care', 'kiran@example.com', '', 'Google Ads', 'Paid ads', 60000, 'contacted', addDays(-1), 'Called once, asked for a call back.'],
      ['Example: Farah Sheikh', 'Bloom Boutique', 'farah@example.com', '', 'Instagram', 'Social media', 30000, 'qualified', today(), 'Budget confirmed. Needs content calendar.'],
      ['Example: Vijay Kumar', 'VK Coaching Centre', 'vijay@example.com', '', 'WhatsApp', 'WhatsApp marketing', 25000, 'proposal', addDays(3), 'Proposal sent, waiting on reply.'],
      ['Example: Meena Iyer', 'Iyer Sweets', 'meena@example.com', '', 'Referral', 'Website / CRO', 80000, 'won', '', 'Signed for a website refresh.'],
      ['Example: Arjun Das', 'Das Electronics', 'arjun@example.com', '', 'Meta Ads', 'Paid ads', 40000, 'lost', '', 'Went with an in-house hire.'],
    ];
    leads = S.map((r) => normalise({ name: r[0], company: r[1], email: r[2], phone: r[3], source: r[4], service: r[5], value: r[6], stage: r[7], followUp: r[8], notes: r[9] }));
    save(); render();
    if (storageOk) say('Loaded 6 example leads. Edit or delete them whenever you like.', 'ok');
  });

  // ---------- header behaviour (this page doesn't load site.js) ----------
  const header = $('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const toggle = $('.mobile-toggle'), nav = $('.navlinks');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.textContent = open ? '✕' : '☰';
  });

  render();
  if (!storageOk) say('This browser is blocking local storage, so leads won\'t be saved after you close the page. Export a CSV before leaving.', 'err');
})();
