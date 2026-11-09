// Vercel serverless endpoint for the WhatsApp Cloud API.
// Configure WA_ACCESS_TOKEN, WA_PHONE_NUMBER_ID, WA_VERIFY_TOKEN,
// META_APP_SECRET and (optionally) WA_GRAPH_VERSION in Vercel Project Settings.
import crypto from "node:crypto";

const graphVersion = process.env.WA_GRAPH_VERSION || "v23.0";
const json = (res, status, body) => res.status(status).setHeader("Content-Type", "application/json").json(body);
const safeEqual = (a, b) => {
  const aa = Buffer.from(String(a || ""));
  const bb = Buffer.from(String(b || ""));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
};

export default async function handler(req, res) {
  // Meta webhook challenge verification
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    if (mode === "subscribe" && safeEqual(token, process.env.WA_VERIFY_TOKEN)) {
      return res.status(200).send(String(challenge || ""));
    }
    return res.status(403).send("Webhook verification failed");
  }

  if (req.method === "POST" && req.query.webhook === "1") {
    const signature = req.headers["x-hub-signature-256"];
    const appSecret = process.env.META_APP_SECRET;
    if (!appSecret || !signature || !req.body) return res.status(401).end();
    const expected = "sha256=" + crypto.createHmac("sha256", appSecret)
      .update(JSON.stringify(req.body)).digest("hex");
    if (!safeEqual(signature, expected)) return res.status(401).end();
    // Acknowledge verified Meta webhook events. Persist/process them in a database
    // before using this endpoint for production campaign analytics.
    return res.status(200).json({ received: true });
  }

  if (req.method === "GET") {
    const configured = Boolean(process.env.WA_ACCESS_TOKEN && process.env.WA_PHONE_NUMBER_ID && process.env.WA_VERIFY_TOKEN);
    return json(res, 200, { configured, channel: "WhatsApp Cloud API" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return json(res, 405, { error: "Method not allowed" });
  }

  const token = process.env.WA_ACCESS_TOKEN;
  const phoneNumberId = process.env.WA_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) return json(res, 503, { error: "WhatsApp API is not configured. Add the required environment variables in Vercel." });

  const { to, templateName, language = "en_US", parameters = [], consentConfirmed } = req.body || {};
  const recipient = String(to || "").replace(/[^0-9]/g, "");
  if (!/^\d{8,15}$/.test(recipient)) return json(res, 400, { error: "Enter a valid recipient number with country code." });
  if (consentConfirmed !== true) return json(res, 400, { error: "Confirm that this recipient opted in to receive WhatsApp messages." });
  if (!/^[a-z0-9_]{1,512}$/.test(String(templateName || ""))) return json(res, 400, { error: "Use an approved WhatsApp message template name." });
  const components = parameters.length ? [{ type: "body", parameters: parameters.slice(0, 20).map(text => ({ type: "text", text: String(text).slice(0, 1024) })) }] : [];
  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: recipient,
    type: "template",
    template: { name: templateName, language: { code: language }, ...(components.length ? { components } : {}) }
  };
  try {
    const response = await fetch(`https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) return json(res, response.status, { error: data?.error?.message || "Meta rejected the message.", details: data?.error?.code });
    return json(res, 200, { success: true, messageId: data?.messages?.[0]?.id || null });
  } catch {
    return json(res, 502, { error: "Could not reach Meta Graph API." });
  }
}
