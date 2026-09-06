export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const body = req.body || {};
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  if (name.length < 2 || !email.includes('@')) return res.status(400).json({ error: 'Please provide a valid name and email.' });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(503).json({ error: 'Lead system is not configured yet.' });

  const payload = {
    name, email,
    phone: String(body.phone || '').trim() || null,
    company: String(body.company || '').trim() || null,
    service_interest: String(body.service_interest || '').trim() || null,
    message: String(body.message || '').trim() || null,
    source: 'website',
    utm_source: body.utm_source || null, utm_medium: body.utm_medium || null,
    utm_campaign: body.utm_campaign || null, utm_term: body.utm_term || null,
    utm_content: body.utm_content || null, landing_page: body.landing_page || null,
    referrer: body.referrer || null
  };

  const response = await fetch(url + '/rest/v1/leads', {
    method: 'POST',
    headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) return res.status(502).json({ error: 'Unable to save your request right now.' });
  const rows = await response.json();
  return res.status(201).json({ ok: true, leadId: rows[0]?.id });
}
