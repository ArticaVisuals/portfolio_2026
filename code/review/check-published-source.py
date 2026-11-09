"""Read-only, single-pass source QA. Run only after Framer publication is ready."""
import argparse
import hashlib
import json
import re
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

ORIGIN = "https://micahhoang.com"
REVIEW = ["/dive", "/dive/about"] + ["/dive/case-studies/" + slug for slug in (
    "gaia", "airpods", "peak-energy", "motion-connect-2025", "simon-schuster", "national-park-cards")]
PUBLIC = ["/", "/about", "/case-studies/gaia"]
WIDGET = '<script src="https://inflight.co/widget.js" data-org="aius9qpt" data-path="/dive" async></script>'


class HeadParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.in_head = False
        self.scripts = []
        self.robots = []
        self.current = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "head":
            self.in_head = True
        if tag == "script":
            self.current = {"head": self.in_head, "attrs": attrs,
                            "raw": self.get_starttag_text(), "source": ""}
            self.scripts.append(self.current)
        if tag == "meta" and self.in_head and attrs.get("name", "").lower() == "robots":
            self.robots.append(attrs.get("content", ""))

    def handle_endtag(self, tag):
        if tag == "head":
            self.in_head = False
        if tag == "script":
            self.current = None

    def handle_data(self, data):
        if self.current is not None:
            self.current["source"] += data


def fetch(path):
    request = Request(ORIGIN + path, headers={"User-Agent": "PortfolioDiveSourceQA/1.0", "Cache-Control": "no-cache"})
    with urlopen(request, timeout=45) as response:
        return path, response.status, response.url, response.read()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="output/dive-qa/published-source")
    args = parser.parse_args()
    out = Path(args.output)
    out.mkdir(parents=True, exist_ok=True)
    # Never leave an older build's candidate available after a failed extraction.
    for filename in ("published-navigation.js", "published-head.html"):
        (out / filename).unlink(missing_ok=True)
    results, bridges, failures = [], [], []
    with ThreadPoolExecutor(max_workers=4) as pool:
        responses = list(pool.map(fetch, REVIEW + PUBLIC + ["/sitemap.xml"]))
    for path, status, final_url, raw in responses:
        filename = (path.strip("/").replace("/", "__") or "home") + ("" if path.endswith(".xml") else ".html")
        (out / filename).write_bytes(raw)
        result = {"path": path, "status": status, "final_url": final_url,
                  "sha256": hashlib.sha256(raw).hexdigest(), "bytes": len(raw)}
        if path == "/sitemap.xml":
            urls = [item.text for item in ET.fromstring(raw).iter() if item.tag.endswith("loc")]
            result["review_urls"] = [url for url in urls if re.search(r"/dive(?:/|$)", url)]
            if result["review_urls"]:
                failures.append("Sitemap contains review routes")
        else:
            html = raw.decode("utf-8")
            parsed = HeadParser()
            parsed.feed(html)
            widget = [script for script in parsed.scripts if script["attrs"].get("src") == "https://inflight.co/widget.js"]
            inflight = [script for script in parsed.scripts if "inflight.co/" in script["attrs"].get("src", "")]
            bridge = [script for script in parsed.scripts if script["attrs"].get("id") == "mh-dive-navigation"]
            result.update(widget_count=len(widget), inflight_script_count=len(inflight), bridge_count=len(bridge), robots=parsed.robots)
            if path in REVIEW:
                result["widget_in_head"] = len(widget) == 1 and widget[0]["head"]
                result["widget_exact_tag"] = len(widget) == 1 and widget[0]["raw"] + "</script>" == WIDGET
                result["noindex"] = any("noindex" in re.split(r"[\s,]+", value.lower()) for value in parsed.robots)
                if not all([status == 200, result["widget_in_head"], result["widget_exact_tag"], result["noindex"], len(inflight) == 1, len(bridge) == 1 and bridge[0]["head"]]):
                    failures.append(path + " failed initial-head checks")
                if len(bridge) == 1:
                    bridges.append(bridge[0]["source"])
                    result["bridge_sha256"] = hashlib.sha256(bridge[0]["source"].encode()).hexdigest()
                    if path == "/dive":
                        (out / "published-navigation.js").write_text(bridge[0]["source"])
                        (out / "published-head.html").write_text(bridge[0]["raw"] + bridge[0]["source"] + "</script>\n" + (widget[0]["raw"] + "</script>\n" if widget else ""))
            elif status != 200 or inflight or bridge:
                failures.append(path + " has unexpected status or review scripts")
        results.append(result)
    if len(set(bridges)) != 1 or len(bridges) != len(REVIEW):
        failures.append("Review pages do not all contain the same navigation bridge")
    report = {"origin": ORIGIN, "results": results, "failures": failures}
    (out / "source-audit.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))
    raise SystemExit(bool(failures))


if __name__ == "__main__":
    main()
