from flask import Flask, jsonify, render_template, request
import re
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

LABELS = ("Informational", "Commercial", "Transactional", "Navigational")
_MODEL = None

def get_model():
    global _MODEL
    if _MODEL is None:
        import tensorflow as tf
        _MODEL = {
            "tf": tf,
            "centroids": tf.constant([
                [0.90, 0.15, 0.10, 0.05, 0.25],
                [0.55, 0.80, 0.30, 0.15, 0.65],
                [0.15, 0.65, 0.95, 0.10, 0.45],
                [0.20, 0.25, 0.10, 0.95, 0.35],
            ], dtype=tf.float32),
        }
    return _MODEL

def predict_intent(text):
    import numpy as np
    model = get_model()
    tf = model["tf"]
    t = text.lower()
    words = max(len(re.findall(r"\w+", t)), 1)
    x = np.asarray([
        1.0 if any(x in t for x in ("what","why","how","guide","learn","meaning")) else 0.0,
        1.0 if any(x in t for x in ("buy","price","pricing","cost","service","agency","hire")) else 0.0,
        1.0 if any(x in t for x in ("book","order","quote","demo","sign up","subscribe")) else 0.0,
        1.0 if any(x in t for x in ("login","official","homepage","near me")) else 0.0,
        len(t) / min(words * 18, 400),
    ], dtype=np.float32)
    x = tf.convert_to_tensor(x, dtype=tf.float32)
    distance = tf.reduce_sum(tf.square(model["centroids"] - x), axis=1)
    scores = tf.nn.softmax(-distance * 2.5).numpy()
    idx = int(np.argmax(scores))
    return {
        "intent": LABELS[idx],
        "confidence": round(float(scores[idx]) * 100, 1),
        "scores": {k: round(float(v) * 100, 1) for k, v in zip(LABELS, scores)},
    }

def keyword_variations(k):
    k = re.sub(r"\s+", " ", k.strip().lower())
    return list(dict.fromkeys([
        k, f"{k} strategy", f"{k} services", f"{k} agency",
        f"best {k}", f"{k} checklist", f"{k} guide",
        f"{k} audit", f"{k} tools", f"{k} pricing"
    ]))

PAGES = {
    "about": {"title":"About Munikumar AI","headline":"Marketing strategy for the search era after search.","copy":"Munikumar combines digital marketing fundamentals with SEO, AEO, GEO and lightweight AI workflows so teams can move from channel reporting to useful decisions."},
    "services": {"title":"AI Marketing Services","headline":"A practical growth stack built around discovery and conversion.","copy":"SEO, AEO, GEO, paid acquisition, content intelligence, technical audits, CRO and analytics—connected into one operating system."},
    "faq": {"title":"SEO, AEO & GEO FAQ","headline":"Answers for modern search and AI discovery.","copy":"SEO improves traditional search visibility. AEO focuses on useful direct answers. GEO focuses on making entities, expertise, evidence and content easier for generative systems to understand."},
    "insights": {"title":"Marketing Insights","headline":"Search intelligence, AI discovery and growth experiments.","copy":"Use the toolkit to turn questions, content, technical signals and intent into repeatable marketing decisions."},
    "seo-report": {"title":"Instant SEO Report","headline":"Run a fast technical search check.","copy":"Enter a public URL to inspect its title, meta description, H1 structure and canonical setup with the Python audit API."},
}

@app.get("/healthz")
def healthz():
    import platform
    return jsonify({"status":"ok","python":platform.python_version()})

@app.get("/")
def home():
    return render_template("index.html")

@app.get("/<page>/")
def page(page):
    if page in PAGES:
        return render_template("page.html", page=PAGES[page], slug=page)
    return render_template("index.html"), 404

@app.post("/api/intent")
def intent():
    data = request.get_json(silent=True) or {}
    q = str(data.get("query","")).strip()
    if not q:
        return jsonify({"error":"query is required"}), 400
    try:
        return jsonify(predict_intent(q))
    except Exception as exc:
        return jsonify({"error":f"TensorFlow inference failed: {exc}"}), 500

@app.post("/api/keyword-ideas")
def keyword_ideas():
    data = request.get_json(silent=True) or {}
    k = str(data.get("keyword","")).strip()
    if not k:
        return jsonify({"error":"keyword is required"}), 400
    return jsonify({"keyword":k, "ideas":[{"keyword":x,"intent":predict_intent(x)["intent"]} for x in keyword_variations(k)]})

@app.post("/api/content-score")
def content_score():
    data = request.get_json(silent=True) or {}
    content = str(data.get("content",""))
    if not content.strip():
        return jsonify({"error":"content is required"}), 400
    plain = re.sub(r"\s+", " ", BeautifulSoup(content, "html.parser").get_text(" ")).strip()
    words = re.findall(r"\b[a-zA-Z0-9][a-zA-Z0-9'-]*\b", plain)
    questions = len(re.findall(r"\b(what|why|how|when|where|which|who)\b", plain.lower()))
    entities = len(set(re.findall(r"\b[A-Z][a-zA-Z0-9&.-]{2,}\b", plain)))
    readability = max(0, min(100, 100 - len(words)/55 - max(0,len(words)-1600)/30))
    q = min(100, questions*12); e = min(100, entities*6)
    s = min(100, len(re.findall(r"\b(h[1-6]|title|meta description)\b", content.lower()))*10)
    overall = round(readability*.2 + q*.25 + e*.25 + s*.3, 1)
    return jsonify({"word_count":len(words),"question_coverage":q,"entity_signal":e,"structure_signal":s,"readability":round(readability,1),"overall_score":overall})

@app.post("/api/url-audit")
def url_audit():
    data = request.get_json(silent=True) or {}
    url = str(data.get("url","")).strip()
    if not re.match(r"^https?://", url):
        return jsonify({"error":"Enter a full http(s) URL"}), 400
    try:
        r = requests.get(url, timeout=8, headers={"User-Agent":"Munikumar-AI-Auditor/1.0"})
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "html.parser")
        title = soup.title.get_text(" ", strip=True) if soup.title else ""
        meta = soup.find("meta", attrs={"name":"description"})
        description = meta.get("content","").strip() if meta else ""
        h1s = [h.get_text(" ", strip=True) for h in soup.find_all("h1")]
        canonical = bool(soup.find("link", rel="canonical"))
        score = 100
        rec = []
        if not title: score -= 15; rec.append("Add a unique title tag.")
        elif len(title) < 25 or len(title) > 60: score -= 5; rec.append("Tighten the title around a clear search intent.")
        if not description: score -= 15; rec.append("Add a compelling meta description.")
        if len(h1s) != 1: score -= 10; rec.append("Use one primary H1 aligned to page intent.")
        if not canonical: score -= 5; rec.append("Add a canonical URL.")
        return jsonify({"url":url,"status_code":r.status_code,"title":title,"description":description,"h1s":h1s,"canonical":canonical,"seo_score":max(0,score),"recommendations":rec})
    except Exception as exc:
        return jsonify({"error":f"Audit failed: {exc}"}), 502

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=True)
