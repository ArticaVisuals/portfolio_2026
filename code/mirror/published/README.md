# Published portfolio snapshot

Captured from [micahhoang.com](https://micahhoang.com) on **September 22, 2026**,
using the published site only. This snapshot records the About page and shared
navigation changes alongside every route in the production sitemap.

## Contents and provenance

- [`manifest.json`](manifest.json): capture times, source URLs, HTTP statuses,
  page titles/SEO metadata, byte counts, and SHA-256 hashes for every captured file.
- [`sitemap.xml`](sitemap.xml): the live sitemap's 20 public routes.
- `pages/`: exact HTML responses for those routes, including inline styles,
  breakpoint settings, text, media URLs, and Framer appearance configuration.
- `runtime/`: 103 Framer-hosted JS/CSS files discovered recursively from the HTML
  and literal module references, retaining their original CDN paths and bytes.
- [`qa/`](qa/): browser evidence for the published About page and navigation.

This is a reference snapshot, not an offline build or editable Framer project
export. Original TSX, unpublished editor state, source maps, third-party runtime
services, and media/font binaries are outside this capture. Media URLs remain in
the HTML/modules; the existing `assets/` tree holds reusable local media. Older
TSX mirrors and legacy compiled snapshots retain their own provenance.

## About and navigation

- The current page is [`/about`](https://micahhoang.com/about); its captured HTML
  is [`pages/about.html`](pages/about.html).
- Navigation uses **ABOUT** and points to `/about`.
- The page title is **About Micah Hoang — Brand Designer**. Its description is
  “Meet Micah Hoang, a Los Angeles brand designer working across strategy, visual
  identity, motion, product, packaging, editorial, and UX/UI.”
- `/info` returns **HTTP 404**, without a redirect. The exact response is saved
  in [`pages/legacy-info-response.html`](pages/legacy-info-response.html).

## Refresh

From the repository root, run:

```sh
python3 code/tools/snapshot-published-site.py
```

The script only reads the public website and writes the local snapshot. It checks
all sitemap pages for successful responses, follows Framer module references, and
rechecks page bytes and the sitemap before completing to detect a deployment
changing during capture. It validates in a temporary directory before replacing
the snapshot and removes obsolete files owned by the prior manifest, preserving
documentation and QA. Browser QA is a separate step; refresh its evidence and
this overview when recording a new snapshot.
