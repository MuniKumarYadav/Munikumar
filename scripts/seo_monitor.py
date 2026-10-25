#!/usr/bin/env python3
"""Read-only technical SEO monitor for the public Munikumar website."""
import json, os, sys, time, urllib.error, urllib.parse, urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

BASE_URL = os.getenv("SEO_BASE_URL", "https://munikumar.vercel.app").rstrip("/")
MAX_PAGES = int(os.getenv("SEO_MAX_PAGES", "100"))
UA = "Munikumar-SEO-Monitor/1.0 (read-only technical audit)"

class Parser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title, self.description, self.canonical, self.robots = "", "", "", ""
        self.in_title, self.h1_count, self.links = False, 0, []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title": self.in_title = True
        elif tag == "h1": self.h1_count += 1
        elif tag == "meta":
            name = (a.get("name") or "").lower()
            if name == "description": self.description = (a.get("content") or "").strip()
            if name == "robots": self.robots = (a.get("content") or "").lower()
        elif tag == "link" and "canonical" in (a.get("rel") or "").lower().split():
            self.canonical = (a.get("href") or "").strip()
        elif tag == "a" and a.get("href"): self.links.append(a["href"])
    def handle_endtag(self, tag):
        if tag == "title": self.in_title = False
    def handle_data(self, data):
        if self.in_title: self.title += data.strip()

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.status, r.geturl(), r.headers.get_content_type(), r.read(2_000_000)

def clean_url(url):
    p = urllib.parse.urlsplit(url)
    return urllib.parse.urlunsplit((p.scheme, p.netloc, p.path or "/", "", ""))

def main():
    issues, pages, links_to_check = [], [], set()
    host = urllib.parse.urlsplit(BASE_URL).netloc
    sitemap = BASE_URL + "/sitemap.xml"
    try:
        _, _, _, body = fetch(sitemap)
        root = ET.fromstring(body)
        urls = [clean_url(e.text.strip()) for e in root.iter()
                if e.tag.rsplit("}", 1)[-1] == "loc" and e.text
                and urllib.parse.urlsplit(e.text.strip()).netloc == host]
        if not urls: raise ValueError("Sitemap contains no same-host URLs")
    except Exception as exc:
        issues.append({"severity":"warning","url":sitemap,"message":f"Sitemap unavailable: {exc}; checking homepage only."})
        urls = [BASE_URL + "/"]
    urls = list(dict.fromkeys(urls))[:MAX_PAGES]
    for url in urls:
        row = {"url":url, "status":None}
        try:
            status, final_url, content_type, body = fetch(url)
            row["status"] = status
            if status >= 400: issues.append({"severity":"error","url":url,"message":f"HTTP {status}"})
            if "html" not in content_type.lower():
                pages.append(row); continue
            p = Parser(); p.feed(body.decode("utf-8", errors="replace"))
            row.update(title=p.title.strip(), description=p.description, canonical=p.canonical, h1_count=p.h1_count)
            if not row["title"]: issues.append({"severity":"error","url":url,"message":"Missing page title"})
            elif len(row["title"]) > 65: issues.append({"severity":"warning","url":url,"message":f"Title is {len(row['title'])} characters; review length"})
            if not p.description: issues.append({"severity":"warning","url":url,"message":"Missing meta description"})
            elif len(p.description) > 170: issues.append({"severity":"info","url":url,"message":f"Meta description is {len(p.description)} characters"})
            if not p.canonical: issues.append({"severity":"warning","url":url,"message":"Missing canonical URL"})
            elif urllib.parse.urlsplit(urllib.parse.urljoin(final_url,p.canonical)).netloc != host:
                issues.append({"severity":"error","url":url,"message":"Canonical points to another host"})
            if p.h1_count == 0: issues.append({"severity":"warning","url":url,"message":"No H1 heading found"})
            if "noindex" in p.robots: issues.append({"severity":"warning","url":url,"message":"Page has noindex directive"})
            for href in p.links:
                target = urllib.parse.urljoin(final_url, href)
                parsed = urllib.parse.urlsplit(target)
                if parsed.scheme in ("http","https") and parsed.netloc == host:
                    target = clean_url(target)
                    if target not in urls: links_to_check.add(target)
        except urllib.error.HTTPError as exc:
            row["status"] = exc.code
            issues.append({"severity":"error","url":url,"message":f"HTTP {exc.code}"})
        except Exception as exc:
            issues.append({"severity":"error","url":url,"message":f"Fetch/parse failed: {exc}"})
        pages.append(row)
        time.sleep(.05)
    for url in sorted(links_to_check - {p["url"] for p in pages})[:200]:
        try:
            status, _, _, _ = fetch(url)
            if status >= 400: issues.append({"severity":"error","url":url,"message":f"Internal link HTTP {status}"})
        except urllib.error.HTTPError as exc:
            issues.append({"severity":"error","url":url,"message":f"Internal link HTTP {exc.code}"})
        except Exception as exc:
            issues.append({"severity":"warning","url":url,"message":f"Internal link check failed: {exc}"})
        time.sleep(.03)
    counts = {s:sum(i["severity"]==s for i in issues) for s in ("error","warning","info")}
    report = {"site":BASE_URL,"generated_at":datetime.now(timezone.utc).isoformat(),"pages_checked":len(pages),"issue_count":len(issues),"counts":counts,"issues":issues,"pages":pages,"note":"Read-only checks; rankings and search performance are not measured."}
    folder = Path("seo-reports"); folder.mkdir(exist_ok=True)
    date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    (folder/f"seo-report-{date}.json").write_text(json.dumps(report,indent=2),encoding="utf-8")
    lines = [f"# Automated SEO report — {date}","",f"- Site: {BASE_URL}",f"- Pages checked: {len(pages)}",f"- Errors: {counts['error']} · Warnings: {counts['warning']} · Notes: {counts['info']}","","## Findings",""]
    lines += [f"- **{i['severity'].upper()}** — {i['url']}: {i['message']}" for i in issues] or ["No issues detected by these basic checks."]
    lines += ["","> Read-only technical checks only; this does not measure rankings or guarantee search performance."]
    markdown = "\n".join(lines) + "\n"
    (folder/f"seo-report-{date}.md").write_text(markdown,encoding="utf-8")
    summary = os.getenv("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary,"a",encoding="utf-8") as f: f.write(markdown)
    print(markdown)
    return 1 if counts["error"] else 0

if __name__ == "__main__": sys.exit(main())
