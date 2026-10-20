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


# --- AEO Answer Preview ---

def detect_question_type(question):
    low = question.lower().strip()
    if any(k in low for k in (" vs ", " versus ", "compare", "difference between", "better than", " or ")):
        return "comparison"
    if any(k in low for k in ("best ", "top ", "examples of", "types of", "tools for", "ways to", "list of", "ideas")):
        return "list"
    if low.startswith("how ") or " how to " in low:
        return "how"
    for prefix in ("why ", "when ", "where ", "who "):
        if low.startswith(prefix):
            return prefix.strip()
    if low.startswith(("what ", "which ")):
        return "what"
    return "what"


def clean_topic(question):
    cleaned = re.sub(
        r"^(what|why|how|when|where|who|which)\s+(is|are|do|does|can|to|should|would|will)\s+",
        "", question.strip(), flags=re.I
    )
    return cleaned.rstrip("?.! ").strip() or question.strip().rstrip("?.! ")


def build_aeo_answer(question, question_type):
    topic = clean_topic(question)
    templates = {
        "how": f"To successfully execute {topic}, begin by defining clear, measurable objectives and auditing your current baseline performance. Next, implement structured workflows using proven industry frameworks, align your content with user search intent, and track key conversion metrics weekly to refine your strategy for sustainable long-term growth.",
        "why": f"Understanding {topic} is essential because it directly impacts organic visibility, user engagement, and long-term conversion rates. Organizations that prioritize this approach build stronger topical authority, reduce customer acquisition costs, and adapt faster to evolving search engine and AI answer algorithms than competitors relying on outdated tactics.",
        "comparison": f"When evaluating {topic}, the right choice depends on your budget, team bandwidth, and growth stage. While one approach typically offers faster initial deployment and lower upfront complexity, the alternative provides deeper customization, stronger scalability, and higher long-term return on investment for established marketing teams.",
        "list": f"The most effective options for {topic} combine technical reliability, ease of implementation, and measurable return on investment. Top-performing teams prioritize solutions that integrate cleanly with existing analytics workflows, support automated reporting, and align directly with high-intent customer acquisition and retention goals across primary channels.",
        "when": f"The optimal timing for {topic} is once your foundational analytics and core conversion tracking are fully validated. Launching at this stage ensures you capture accurate baseline data, identify early performance bottlenecks quickly, and scale winning campaigns efficiently without wasting budget on unverified traffic sources.",
        "where": f"You should focus {topic} on high-intent channels where your target audience actively researches solutions and compares providers. Prioritize authoritative search results, structured resource hubs, and conversion-optimized landing pages to capture qualified demand and guide prospects smoothly through your marketing and sales funnel.",
        "who": f"Responsibility for {topic} typically sits with growth marketers, SEO strategists, and content leads who manage organic acquisition. Cross-functional collaboration between technical developers, subject-matter experts, and analytics specialists ensures that every initiative meets both technical search standards and real-world customer expectations.",
        "what": f"{topic.capitalize()} is a strategic methodology used to improve digital visibility, audience engagement, and measurable business outcomes. By combining structured data, clear user-focused content, and continuous performance optimization, it helps brands capture high-intent traffic and convert prospects across both traditional search and AI answer engines."
    }
    words = templates.get(question_type, templates["what"]).split()
    filler = ["This", "structured", "approach", "ensures", "consistent", "visibility", "across", "modern", "AI", "search", "platforms."]
    idx = 0
    while len(words) < 40:
        words.append(filler[idx % len(filler)])
        idx += 1
    if len(words) > 60:
        words = words[:60]
        if not words[-1].endswith("."):
            words[-1] = words[-1].rstrip(",;:") + "."
    return " ".join(words)


@app.post("/api/answer-preview")
def answer_preview():
    data = request.get_json(silent=True) or {}
    question = str(data.get("question", "")).strip()
    if not question:
        return jsonify({"error": "Please enter a question."}), 400
    question_type = detect_question_type(question)
    fmt = "list/steps" if question_type in ("how", "list") else ("table" if question_type == "comparison" else "paragraph")
    answer = build_aeo_answer(question, question_type)
    try:
        intent = predict_intent(question).get("intent", "Informational")
    except Exception:
        intent = "Informational"
    formatted_question = question if question.endswith("?") else question + "?"
    schema_obj = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": formatted_question,
            "acceptedAnswer": {"@type": "Answer", "text": answer}
        }]
    }
    return jsonify({"question_type": question_type, "answer": answer, "format": fmt, "intent": intent, "schema": schema_obj})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=True)
