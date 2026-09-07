# Digital Marketing Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a public Digital Marketing Hub with audit scoring, ROI/ROAS and UTM utilities, plus an authenticated Supabase CRM summary dashboard.

**Architecture:** Keep the public utilities as static browser functionality and isolate pure business logic in a reusable JavaScript module. Add Supabase authentication and RLS-protected summary reads only for the operator dashboard. Deploy the existing GitHub repository on Vercel without replacing the homepage.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript ES modules, Supabase JavaScript client, Node.js test runner, GitHub, Vercel.

**Spec:** `docs/superpowers/specs/2026-09-07-digital-marketing-hub-design.md`

## Global Constraints

- Preserve the existing MuniSoft homepage and existing public pages.
- Reuse `public.crm_campaigns`, `public.crm_leads`, and `public.crm_tasks`.
- Never expose a Supabase service-role key in browser code.
- Do not disable or weaken existing RLS.
- Public audit and calculators must work without login.
- Do not introduce paid external APIs.
- Deploy production from the GitHub repository's `main` branch.

---

## File Structure

- `digital-marketing-tool.html` — public UI, calculator forms, UTM form, dashboard containers.
- `assets/marketing-tool.js` — DOM wiring and feature orchestration.
- `assets/marketing-core.js` — pure scoring, ROI/ROAS, UTM and CRM aggregation functions.
- `assets/supabase-dashboard.js` — authenticated Supabase client integration and dashboard loading.
- `tests/marketing-core.test.mjs` — deterministic unit tests.
- `package.json` — test command and Supabase dependency.
- `vercel.json` — deployment configuration that preserves static routing.
- `docs/superpowers/specs/2026-09-07-digital-marketing-hub-design.md` — approved design.
- `docs/superpowers/plans/2026-09-07-digital-marketing-hub.md` — this implementation plan.

### Task 1: Establish Pure Marketing Logic

**Files:**
- Create: `assets/marketing-core.js`
- Create: `tests/marketing-core.test.mjs`
- Create: `package.json`

**Interfaces:**
- Produces: `calculateAuditScore(items)`, `buildRecommendations(categories)`, `calculateMarketingReturns({spend,revenue,profit})`, `buildUtmUrl(input)`, `aggregateCrmSummary({campaigns,leads,tasks})`.

- [ ] **Step 1: Write failing tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAuditScore, calculateMarketingReturns, buildUtmUrl } from '../assets/marketing-core.js';

test('calculates audit percentage', () => {
  assert.equal(calculateAuditScore([true, false, true, false]), 50);
});

test('calculates ROAS and ROI', () => {
  const result = calculateMarketingReturns({ spend: 100, revenue: 500, profit: 200 });
  assert.equal(result.roas, 5);
  assert.equal(result.roi, 100);
});

test('encodes UTM parameters', () => {
  const url = buildUtmUrl({ url: 'https://example.com/page', source: 'google ads', medium: 'cpc', campaign: 'launch' });
  assert.match(url, /utm_source=google%20ads/);
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test`
Expected: FAIL because `assets/marketing-core.js` does not yet exist.

- [ ] **Step 3: Implement minimal pure functions**

```js
export function calculateAuditScore(items) {
  return items.length ? Math.round(items.filter(Boolean).length / items.length * 100) : 0;
}

export function calculateMarketingReturns({ spend, revenue, profit }) {
  const safeSpend = Number(spend) || 0;
  const safeRevenue = Number(revenue) || 0;
  const safeProfit = Number(profit) || 0;
  return {
    roas: safeSpend ? Number((safeRevenue / safeSpend).toFixed(2)) : 0,
    roi: safeSpend ? Number((((safeProfit - safeSpend) / safeSpend) * 100).toFixed(2)) : 0
  };
}

export function buildUtmUrl({ url, source, medium, campaign, term = '', content = '' }) {
  const target = new URL(url);
  [['utm_source', source], ['utm_medium', medium], ['utm_campaign', campaign], ['utm_term', term], ['utm_content', content]]
    .filter(([, value]) => value)
    .forEach(([key, value]) => target.searchParams.set(key, value));
  return target.toString();
}
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json assets/marketing-core.js tests/marketing-core.test.mjs
git commit -m "feat: add marketing calculation core"
```

### Task 2: Upgrade Public Marketing Tool

**Files:**
- Modify: `digital-marketing-tool.html`
- Create: `assets/marketing-tool.js`

**Interfaces:**
- Consumes: `calculateAuditScore`, `buildRecommendations`, `calculateMarketingReturns`, `buildUtmUrl`.
- Produces: public audit results, ROI/ROAS output, and copyable UTM URL.

- [ ] **Step 1: Write browser-level acceptance checks**

Create assertions in a temporary local test harness that verify the page contains audit, ROI/ROAS, and UTM sections and the JS module is referenced.

- [ ] **Step 2: Run checks before implementation**

Run: `node --test tests/marketing-core.test.mjs`
Expected: current tests pass while UI-specific acceptance checks identify missing sections.

- [ ] **Step 3: Implement public UI**

Add dedicated sections with stable IDs:
```html
<section id="audit-tool"></section>
<section id="roi-calculator"></section>
<section id="utm-builder"></section>
```

Wire submit events through `assets/marketing-tool.js` using `textContent` for all user-derived output.

- [ ] **Step 4: Verify responsive behavior**

Open the page at desktop and mobile widths and confirm forms stack without horizontal scrolling.

- [ ] **Step 5: Commit**

```bash
git add digital-marketing-tool.html assets/marketing-tool.js
git commit -m "feat: add marketing utilities"
```

### Task 3: Add Supabase Operator Dashboard

**Files:**
- Create: `assets/supabase-dashboard.js`
- Modify: `digital-marketing-tool.html`

**Interfaces:**
- Consumes: `aggregateCrmSummary({campaigns,leads,tasks})`.
- Produces: authenticated dashboard summary with campaign count/spend, lead count/pipeline value, and open task count.

- [ ] **Step 1: Write aggregation tests**

```js
import { aggregateCrmSummary } from '../assets/marketing-core.js';
test('aggregates CRM rows', () => {
  const summary = aggregateCrmSummary({
    campaigns: [{ spend: 100 }, { spend: 25 }],
    leads: [{ value: 500 }, { value: 200 }],
    tasks: [{ status: 'Open' }, { status: 'Done' }]
  });
  assert.deepEqual(summary, { campaignCount: 2, campaignSpend: 125, leadCount: 2, pipelineValue: 700, openTaskCount: 1 });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test`
Expected: FAIL because `aggregateCrmSummary` is missing.

- [ ] **Step 3: Implement aggregation**

```js
export function aggregateCrmSummary({ campaigns, leads, tasks }) {
  return {
    campaignCount: campaigns.length,
    campaignSpend: campaigns.reduce((sum, row) => sum + Number(row.spend || 0), 0),
    leadCount: leads.length,
    pipelineValue: leads.reduce((sum, row) => sum + Number(row.value || 0), 0),
    openTaskCount: tasks.filter(row => row.status !== 'Done').length
  };
}
```

- [ ] **Step 4: Implement authenticated reads**

Use `@supabase/supabase-js` and configuration values supplied through Vercel environment variables. Query:
```js
client.from('crm_campaigns').select('spend,status')
client.from('crm_leads').select('value,stage')
client.from('crm_tasks').select('status')
```
Do not use a service-role key. If there is no authenticated user, render a sign-in prompt rather than querying privileged data.

- [ ] **Step 5: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add assets/marketing-core.js assets/supabase-dashboard.js digital-marketing-tool.html tests/marketing-core.test.mjs
git commit -m "feat: add Supabase CRM dashboard"
```

### Task 4: Configure Production Deployment

**Files:**
- Create: `vercel.json`
- Modify: `package.json`

**Interfaces:**
- Consumes: static repository content and Vercel environment configuration.
- Produces: production deployment that preserves direct access to `/digital-marketing-tool.html`.

- [ ] **Step 1: Create deployment configuration**

Use static output behavior and avoid rewrites that would intercept existing HTML pages.

- [ ] **Step 2: Configure environment variables in Vercel**

Set only browser-safe configuration values:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Never add `SUPABASE_SERVICE_ROLE_KEY` to frontend code or browser-visible configuration.

- [ ] **Step 3: Deploy from main**

Connect `MuniKumarYadav/Munikumar` and deploy the `main` branch.

- [ ] **Step 4: Verify production**

Check:
- homepage still loads,
- `/digital-marketing-tool.html` returns successfully,
- audit works without login,
- ROI/ROAS works,
- UTM output is encoded,
- unauthenticated dashboard does not expose CRM data.

- [ ] **Step 5: Commit deployment configuration**

```bash
git add vercel.json package.json
git commit -m "chore: configure Vercel deployment"
```

### Task 5: Final Verification

**Files:**
- Verify: `digital-marketing-tool.html`
- Verify: `assets/marketing-core.js`
- Verify: `assets/supabase-dashboard.js`
- Verify: production Vercel deployment

- [ ] **Step 1: Run complete test suite**

Run: `npm test`
Expected: PASS with all unit tests.

- [ ] **Step 2: Check source safety**

Confirm no occurrence of `service_role` or a Supabase secret key exists in browser files.

- [ ] **Step 3: Verify production routes**

Request the homepage and public tool URL and confirm successful responses.

- [ ] **Step 4: Review success criteria**

Confirm each item in the approved design has an implementation or explicit verification result.

- [ ] **Step 5: Commit any final fixes**

```bash
git add .
git commit -m "chore: verify digital marketing hub"
```
