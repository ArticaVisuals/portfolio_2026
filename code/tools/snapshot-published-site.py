#!/usr/bin/env python3
"""Capture public Framer HTML and its referenced compiled modules, without editing Framer."""

import concurrent.futures
import hashlib
import json
import re
import tempfile
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "code/mirror/published"
CAPTURE = OUTPUT
BASE = "https://micahhoang.com"
# Framer uses both quoted imports and backtick strings for lazy route chunks.
MODULE = re.compile(r"[\"'`]([^\"'`\s<>]+\.(?:m?js|css)(?:\?[^\"'`\s<>]*)?)[\"'`]")


def fetch(url):
    request = urllib.request.Request(url, headers={"User-Agent": "PortfolioSnapshot/1.0"})
    try:
        response = urllib.request.urlopen(request, timeout=45)
    except urllib.error.HTTPError as error:
        response = error
    with response:
        return response.read(), {
            "url": url,
            "finalUrl": response.url,
            "status": response.status,
            "contentType": response.headers.get("Content-Type"),
            "etag": response.headers.get("ETag"),
        }


def save(relative, data, details):
    path = CAPTURE / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    return {
        **details,
        "localPath": (OUTPUT / relative).relative_to(ROOT).as_posix(),
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }


class PageMetadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.metadata = {}
        self.in_title = False
        self.title = ""
        self.scripts = []

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == "title":
            self.in_title = True
        if tag == "meta":
            key = attrs.get("name") or attrs.get("property")
            if key in ("description", "og:title", "og:description", "og:url"):
                self.metadata[key] = attrs.get("content")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.metadata["canonical"] = attrs.get("href")
        if tag == "script" and attrs.get("src"):
            self.scripts.append(attrs["src"])

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


def modules_in(source, base):
    result = set()
    for value in MODULE.findall(source):
        if "${" in value or not value.startswith(("./", "../", "https://")):
            continue
        url = urllib.parse.urljoin(base, value)
        parsed = urllib.parse.urlparse(url)
        if parsed.hostname == "framerusercontent.com" and parsed.path.startswith(("/sites/", "/modules/")):
            result.add(url)
    return result


def capture():
    started = datetime.now(timezone.utc).isoformat()
    sitemap, details = fetch(BASE + "/sitemap.xml")
    if details["status"] != 200:
        raise RuntimeError(f"Sitemap request failed: {details}")
    sitemap_record = save("sitemap.xml", sitemap, details)
    routes = sorted(node.text for node in ET.fromstring(sitemap).iter() if node.tag.endswith("}loc"))
    if not routes or any(urllib.parse.urlparse(url).netloc != "micahhoang.com" for url in routes):
        raise RuntimeError("Unexpected sitemap routes")
    pages, pending, seen, modules, scripts = [], set(), set(), [], set()
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
        for url, (data, details) in zip(routes, executor.map(fetch, routes)):
            if details["status"] != 200:
                raise RuntimeError(f"Published route request failed: {details}")
            path = urllib.parse.urlparse(url).path.strip("/") or "home"
            source = data.decode("utf-8")
            parser = PageMetadata()
            parser.feed(source)
            pages.append(save(f"pages/{path}.html", data, {
                **details, "title": parser.title, "metadata": parser.metadata,
            }))
            scripts.update(parser.scripts)
            pending.update(modules_in(source, url))
        while pending:
            batch = sorted(pending - seen)
            if not batch:
                break
            seen.update(batch)
            pending.clear()
            for url, (data, details) in zip(batch, executor.map(fetch, batch)):
                if details["status"] != 200:
                    raise RuntimeError(f"Runtime module request failed: {details}")
                parsed = urllib.parse.urlparse(url)
                # Preserve the CDN path to avoid collisions between builds/modules.
                relative = "runtime/" + parsed.path.lstrip("/")
                if parsed.query:
                    suffix = hashlib.sha256(parsed.query.encode()).hexdigest()[:12]
                    p = Path(relative)
                    relative = str(p.with_name(p.stem + "-" + suffix + p.suffix))
                modules.append(save(relative, data, details))
                pending.update(modules_in(data.decode("utf-8"), url) - seen)

    old_info, info_details = fetch(BASE + "/info")
    legacy = save("pages/legacy-info-response.html", old_info, info_details)
    # Detect a deployment changing during capture rather than calling a mixed build current.
    for record in pages:
        data, details = fetch(record["url"])
        if details["status"] != 200 or hashlib.sha256(data).hexdigest() != record["sha256"]:
            raise RuntimeError("Published build changed during capture; run the snapshot again")
    current_sitemap, current_details = fetch(BASE + "/sitemap.xml")
    if current_details["status"] != 200 or current_sitemap != sitemap:
        raise RuntimeError("Sitemap changed during capture; run the snapshot again")

    manifest = {
        "capturedAt": started,
        "completedAt": datetime.now(timezone.utc).isoformat(),
        "baseUrl": BASE,
        "source": "published-site-only",
        "scope": {
            "included": "Every sitemap route's exact HTML, sitemap, referenced Framer JS/CSS module graph, and /info HTTP response",
            "excluded": "Unpublished editor state, original TSX, source maps, third-party runtime services, and media/font binaries",
            "media": "Published URLs remain in the captured HTML/modules; reusable media is tracked separately under assets/",
            "restoration": "Reference snapshot, not a standalone offline build or a Framer project export",
        },
        "sitemap": sitemap_record,
        "pages": pages,
        "runtime": sorted(modules, key=lambda item: item["url"]),
        "externalScripts": sorted(url for url in scripts if url not in seen),
        "legacyInfoResponse": legacy,
    }
    (CAPTURE / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    previous_path = OUTPUT / "manifest.json"
    previous = json.loads(previous_path.read_text()) if previous_path.exists() else {}
    previous_records = [previous.get("sitemap"), previous.get("legacyInfoResponse"),
                        *previous.get("pages", []), *previous.get("runtime", [])]
    records = [sitemap_record, legacy, *pages, *modules]
    current_paths = {record["localPath"] for record in records}
    # Only publish files after the complete capture validates; preserve QA and docs.
    for record in records:
        destination = ROOT / record["localPath"]
        destination.parent.mkdir(parents=True, exist_ok=True)
        (CAPTURE / destination.relative_to(OUTPUT)).replace(destination)
    for record in previous_records:
        if record and record["localPath"] not in current_paths:
            obsolete = (ROOT / record["localPath"]).resolve()
            if obsolete.is_relative_to(OUTPUT.resolve()):
                obsolete.unlink(missing_ok=True)
    (CAPTURE / "manifest.json").replace(previous_path)
    print(json.dumps({
        "pages": len(pages), "runtimeFiles": len(modules),
        "bytes": sum(item["bytes"] for item in pages + modules),
        "legacyInfoStatus": legacy["status"], "output": str(OUTPUT),
    }, indent=2))


def main():
    global CAPTURE
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=".published-capture-", dir=OUTPUT.parent) as temporary:
        CAPTURE = Path(temporary)
        capture()


if __name__ == "__main__":
    main()
