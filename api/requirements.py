import json
import os
import urllib.request
from datetime import datetime, timezone

def _response(status, payload):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
        "body": json.dumps(payload),
    }

def _read_json(request):
    body = getattr(request, "body", b"")
    if isinstance(body, bytes):
        body = body.decode("utf-8")
    return json.loads(body or "{}")

def _recommend(data):
    goal = str(data.get("goal", "")).lower()
    services = data.get("services") or []
    recommendations = []
    if "lead" in goal or "sale" in goal:
        recommendations += ["Conversion landing pages", "Lead tracking and CRM", "Campaign attribution"]
    if any("SEO" in str(x) for x in services) or "visibility" in goal:
        recommendations += ["SEO technical audit", "Keyword and content strategy", "Search performance tracking"]
    if any("Paid" in str(x) for x in services):
        recommendations += ["Campaign structure", "Conversion tracking", "Cost-per-lead reporting"]
    if any("AI" in str(x) for x in services):
        recommendations += ["Marketing workflow automation", "AI-assisted content operations"]
    return recommendations[:5] or ["Digital marketing audit", "Growth strategy", "Measurement framework"]

def handler(request):
    method = getattr(request, "method", "POST")
    if method == "OPTIONS":
        return _response(204, {})
    if method != "POST":
        return _response(405, {"error": "Method not allowed"})

    try:
        data = _read_json(request)
    except Exception:
        return _response(400, {"error": "Invalid JSON"})

    contact = data.get("contact") or {}
    name = str(contact.get("name") or data.get("name") or "").strip()
    email = str(contact.get("email") or data.get("email") or "").strip()
    if len(name) < 2 or "@" not in email:
        return _response(400, {"error": "Please provide a valid name and email."})

    brief = {
        "business": data.get("business", ""),
        "goal": data.get("goal", ""),
        "services": data.get("services", []),
        "audience": data.get("audience", ""),
        "channels": data.get("channels", ""),
        "budget": data.get("budget", ""),
        "recommendations": _recommend(data),
        "submitted_at": datetime.now(timezone.utc).isoformat(),
    }

    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        return _response(503, {"error": "Marketing backend is not configured yet.", "brief": brief})

    lead = {
        "name": name,
        "email": email,
        "phone": str(contact.get("phone") or "").strip() or None,
        "company": str(contact.get("company") or "").strip() or None,
        "service_interest": ", ".join(map(str, data.get("services") or [])) or None,
        "message": json.dumps(brief),
        "source": "munibot",
        "landing_page": data.get("landing_page"),
        "referrer": data.get("referrer"),
        "utm_source": data.get("utm_source"),
        "utm_medium": data.get("utm_medium"),
        "utm_campaign": data.get("utm_campaign"),
        "utm_term": data.get("utm_term"),
        "utm_content": data.get("utm_content"),
    }

    req = urllib.request.Request(
        url.rstrip("/") + "/rest/v1/leads",
        data=json.dumps(lead).encode("utf-8"),
        headers={
            "apikey": key,
            "Authorization": "Bearer " + key,
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            rows = json.loads(resp.read().decode("utf-8"))
    except Exception:
        return _response(502, {"error": "Unable to save your requirements right now.", "brief": brief})

    return _response(201, {"ok": True, "leadId": rows[0].get("id") if rows else None, "brief": brief})
