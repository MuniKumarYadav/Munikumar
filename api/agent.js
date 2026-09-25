export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const message = String(body.message || '').trim();
    if (!message) return res.status(400).json({ error: 'message is required' });
    if (message.length > 4000) return res.status(413).json({ error: 'message too long' });

    const token = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
    if (!token) {
      return res.status(200).json({
        text: 'Local agent mode: I can help structure the marketing decision, but the live AI model is not connected on this deployment yet.\n\nStart with: 1) define the business objective, 2) identify the primary metric and guardrails, 3) inspect the funnel and data quality, 4) form a falsifiable hypothesis, 5) design an experiment, and 6) require human approval before execution.',
        model: 'local-fallback'
      });
    }

    const response = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-5.6-sol',
        messages: [
          {
            role: 'system',
            content: [
              'You are Muni Kumar Intelligence Lab, an expert tutor and decision-support agent for digital marketing.',
              'Teach through data, AI, experimentation and decision science.',
              'Separate facts, assumptions, simulations and recommendations.',
              'Do not fabricate sources, metrics, research findings or platform capabilities.',
              'When evidence is missing, say what should be verified.',
              'Prefer concise structured answers with equations, assumptions and next actions when useful.',
              'Never execute a consequential marketing action without explicit human approval.'
            ].join(' ')
          },
          { role: 'user', content: message }
        ],
        temperature: 0.2,
        max_tokens: 1200
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.message || 'AI Gateway request failed' });
    }
    const text = data?.choices?.[0]?.message?.content || 'No response generated.';
    return res.status(200).json({ text, model: data?.model || 'gateway' });
  } catch (error) {
    return res.status(500).json({ error: 'Agent request failed safely.', detail: error instanceof Error ? error.message : 'Unknown error' });
  }
}