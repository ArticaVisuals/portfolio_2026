# Portfolio Assets

This is the single home for all portfolio media, reorganized by site section
and project on 2026-07-22.

## Current layout (2026-07-22)

- `by-project/<slug>/` — case-study media, grouped by project. Provenance is kept
  in subfolders: `framer-staging/` (Framer redesign scrape), `current-site/`
  (older Cargo `micahhoang.info` scrape), plus project-specific sets like
  `gaia/figma-export`, `gaia/selected`, `karuna/process`,
  and `seek-truth/main`. Redundant single-child provenance wrappers were
  flattened for Typldn and WhatsApp; their manifests retain the source details.
  `Web Optimized/` folders sit beside their source media when a project has
  generated web-ready derivatives.
- `Play/<slug>/` — media shown on `/play`, separated from case-study media even
  when the same project also has a case study. Each work keeps its `source/`,
  `optimized/`, and `qc/` sets where applicable.
- Project-specific generated media also stays with its project: poster stills
  use `video-posters/`, and Motion Connect's combined optimization package uses
  `optimized-media/`. Cross-project batch records live in
  `../archive/generated-artifacts/media-optimization/`, not in `assets/`.
- `scrape-manifest.json`, `external-embeds.json`, `ARCHIVE_NOTES.md` — scrape
  metadata (see the per-slug map in `ARCHIVE_NOTES.md`).
- Retired Cargo-era and retired-route media moved to `../archive/` (`cargo-era/`,
  `retired-framer-routes/`).
- Browser screenshots, contact sheets, and other QA evidence live in
  `../archive/generated-artifacts/`; they are not reusable project media.

Tooling note: the `tools/` scrapers (`scrape-case-study-assets.cjs`,
`download-external-embeds.cjs`, `scrape-archive-playground-assets.cjs`) predate
this reorg and still write the old flat `case-study-assets/{current-site,framer-staging}`
layout. Re-run them only to intentionally regenerate a raw scrape, then re-sort.

---

_The sections below are the original 2026-05-16 scrape record. Folder paths in
them describe the pre-2026-07-22 flat layout and are kept for historical counts._

## Case Study Asset Scrape

Generated: 2026-05-16T05:26:59.133Z

- Current site: https://micahhoang.info
- Framer staging: https://khaki-ship-257706.framer.app
- May 22, 2026 note: `micahhoang.info` still served the Cargo site during the latest audit; Framer staging is the current redesign/build surface until domain cutover.
- May 26, 2026 note: this folder is a preservation/staging archive, not the live Framer runtime. The local asset set includes the original 555 downloaded media files plus archive/playground media captured for `/play` work, for 595 local media files in `current-site` and `framer-staging` total. Do not infer that a local asset can be deleted from Framer just because it is unused here.
- June 2, 2026 note: the `555` summary below is the original generated scrape summary; the verified current media-file count for `case-study-assets/current-site` plus `case-study-assets/framer-staging` is 595. Untracked Gaia/Figma export folders may exist locally and are separate from this scrape count.
- June 15, 2026 note: `framer-staging/brand-new-school` is a newer staging
  media batch for the `/case-studies/whatsapp` WIP shell, with optimized MP4s,
  poster frames, a contact sheet, and a manifest. It is separate from the
  original scrape-count summary above.
- June 18, 2026 note: `current-site/simon-schuster` has been organized beyond
  the original scrape shape. The long 011-072 book photo sequence now lives in
  `current-site/simon-schuster/Book/`, with a nested
  `current-site/simon-schuster/Book/Web Optimized/` batch. Other web-ready
  derivatives live in `current-site/simon-schuster/Web Optimized/`. Treat the
  generated scrape counts below as historical, not as an exact count after this
  organization pass.
- Pages: 35
- Assets in original generated scrape: 555
- Downloaded media files in original generated scrape: 555
- External embeds documented: 3
- External embeds downloaded: 0 (Vimeo/YouTube access blocked without private/authenticated context)
- Failed: 0

## Folders

- current-site/mini-projects — 8 assets
- current-site/cellular-symphony — 19 assets
- current-site/wolff-olins-x-artcenter — 21 assets
- current-site/track-field-animations — 5 assets
- current-site/fuzzybrain — 63 assets
- current-site/the-kind-warrior — 6 assets
- current-site/john-steinbeck — 9 assets
- current-site/coin-talk-too-much — 9 assets
- current-site/independent-lens — 14 assets
- current-site/meihao — 7 assets
- current-site/projects — 8 assets
- current-site/simon-schuster — 99 assets
- current-site/airpods-pro-3 — 15 assets
- current-site/weaponized-innocence — 56 assets
- current-site/motion-connect-2025 — 33 assets
- current-site/karuna — 36 assets
- current-site/yomo — 25 assets
- current-site/aspen-valley-landscaping — 21 assets
- current-site/national-park-playing-cards — 34 assets
- current-site/typldn — 16 assets
- framer-staging/independent-lens — 4 assets
- framer-staging/seek-truth — 4 assets
- framer-staging/motion-connect-2025 — 5 assets
- framer-staging/john-steinbeck — 3 assets
- framer-staging/cellular-symphony — 4 assets
- framer-staging/neon-lights — 3 assets
- framer-staging/aspen-valley-landscaping — 2 assets
- framer-staging/wolff-olins-x-artcenter — 2 assets
- framer-staging/weaponized-innocence — 2 assets
- framer-staging/karuna — 2 assets
- framer-staging/gaia — 4 assets
- framer-staging/yomo — 3 assets
- framer-staging/national-park-cards — 4 assets
- framer-staging/airpods-pro-3 — 5 assets
- framer-staging/simon-schuster — 4 assets

## External Embeds

- current-site/cellular-symphony — Vimeo embed `947718033` is documented in `external-embeds.json`; Vimeo returned 401 without an authenticated/private context.
- current-site/motion-connect-2025 — YouTube embed `je6WMia3n5E` is documented in `external-embeds.json`; yt-dlp exposed a 360p format but the video bytes returned 403. The direct Cargo MP4 clips on the page were downloaded.
- framer-staging/neon-lights — Vimeo embed `903963136` is documented in `external-embeds.json`; Vimeo returned 401 without an authenticated/private context.

## Organization Notes - 2026-06-15

This folder is a preservation/staging archive. It is not the live Framer runtime,
and files here should not be deleted just because the current Framer project no
longer exposes a matching page.

Current active Framer/CMS project slugs are:

`gaia`, `airpods`, `peak-energy`, `simon-schuster`,
`motion-connect-2025`, `national-park-cards`, `yomo`, `karuna`,
`weaponized-innocence`, `wolff-olins-x-artcenter`, `cellular-symphony`,
`seek-truth`, `independent-lens`, `typldn`, `rejuve`, `belly-bar`,
`whatsapp`.

Folder meanings:

- `current-site/` is the older `micahhoang.info` Cargo/current-public scrape.
- `framer-staging/` is a Framer staging scrape plus newer staging batches. It
  contains active project folders, `brand-new-school` working media for the
  `/case-studies/whatsapp` WIP shell, and historical route folders such as
  `neon-lights`, `aspen-valley-landscaping`, and `john-steinbeck`.
- `optimized/` stores generated optimization batches for rehosting/upload.
- `video-posters/` stores poster stills and a manifest for manual Framer video
  poster work.
- `figma-export/` and `gaia-selected/` are Gaia/Figma-derived working material.

For the full active/retired folder map, see `ARCHIVE_NOTES.md`. Before moving
media, check manifests and docs for path references. For the broader cleanup
plan, see `../workspace-organization-plan.md`.
