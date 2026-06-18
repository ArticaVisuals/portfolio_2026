# Case Study Asset Archive Notes

Prepared: 2026-06-15

This directory is a preservation and staging archive for portfolio media. It is
not the live Framer runtime. Do not delete, rename, or move media folders just
because a matching project is no longer active in Framer.

## Current Active Framer/CMS Projects

These are the active `All Projects` CMS slugs and bespoke Framer route targets
from the June 15 Framer MCP inventory:

| CMS slug | Framer route | Local asset notes |
|---|---|---|
| `gaia` | `/case-studies/gaia` | `framer-staging/gaia`, `figma-export/gaia`, `figma-export/gaia-final-deck`, `gaia-selected` |
| `airpods` | `/case-studies/airpods` | `framer-staging/airpods-pro-3`, `current-site/airpods-pro-3` use the older descriptive folder name |
| `peak-energy` | `/case-studies/peak-energy` | no obvious local asset folder yet |
| `simon-schuster` | `/case-studies/simon-schuster` | `framer-staging/simon-schuster`, `current-site/simon-schuster`; book photo sequence lives in `current-site/simon-schuster/Book/`, book derivatives in `current-site/simon-schuster/Book/Web Optimized/`, and other web-ready derivatives in `current-site/simon-schuster/Web Optimized/` |
| `motion-connect-2025` | `/case-studies/motion-connect-2025` | `framer-staging/motion-connect-2025`, `current-site/motion-connect-2025` |
| `national-park-cards` | `/case-studies/national-park-cards` | `framer-staging/national-park-cards`, `current-site/national-park-playing-cards` |
| `yomo` | `/case-studies/yomo` | `framer-staging/yomo`, `current-site/yomo` |
| `karuna` | `/case-studies/karuna` | `framer-staging/karuna`, `current-site/karuna` |
| `weaponized-innocence` | `/case-studies/weaponized-innocence` | `framer-staging/weaponized-innocence`, `current-site/weaponized-innocence` |
| `wolff-olins-x-artcenter` | `/case-studies/wolff-olins-x-artcenter` | `framer-staging/wolff-olins-x-artcenter`, `current-site/wolff-olins-x-artcenter` |
| `cellular-symphony` | `/case-studies/cellular-symphony` | `framer-staging/cellular-symphony`, `current-site/cellular-symphony` |
| `seek-truth` | `/case-studies/seek-truth` | `framer-staging/seek-truth`; no Cargo/current-site folder seen |
| `independent-lens` | `/case-studies/independent-lens` | `framer-staging/independent-lens`, `current-site/independent-lens` |
| `typldn` | `/case-studies/typldn` | `current-site/typldn`; no Framer staging folder seen |
| `rejuve` | `/case-studies/rejuve` | WIP shell; no obvious local asset folder yet |
| `belly-bar` | `/case-studies/belly-bar` | WIP shell; no obvious local asset folder yet |
| `whatsapp` | `/case-studies/whatsapp` | WIP shell; `framer-staging/brand-new-school` stores the current optimized video batch and posters |

## Folder Groups

### Framer Staging Scrape

`framer-staging/` contains assets scraped from the Framer staging/redesign
surface. Treat active-project folders here as the closest local media reference
for Framer work, but remember they are still scraped copies, not the Framer CDN
source of truth.

Active or active-adjacent folders:

- `airpods-pro-3` - maps to current CMS slug `airpods`
- `brand-new-school` - working media batch for current CMS slug `whatsapp`
- `cellular-symphony`
- `gaia`
- `independent-lens`
- `karuna`
- `motion-connect-2025`
- `national-park-cards`
- `seek-truth`
- `simon-schuster`
- `weaponized-innocence`
- `wolff-olins-x-artcenter`
- `yomo`

Retired Framer staging route folders:

- `aspen-valley-landscaping`
- `john-steinbeck`
- `neon-lights`

These retired folders are historical references. The June 15 Framer inventory no
longer exposes them as active CMS-backed bespoke routes.

### Current-Site Cargo Scrape

`current-site/` is the older `micahhoang.info` Cargo/current-public scrape. It
contains both projects that still matter to the Framer redesign and older
portfolio material.

Active or active-adjacent folders:

- `airpods-pro-3` - maps to current CMS slug `airpods`
- `cellular-symphony`
- `independent-lens`
- `karuna`
- `motion-connect-2025`
- `national-park-playing-cards` - maps to current CMS slug `national-park-cards`
- `simon-schuster`
- `typldn`
- `weaponized-innocence`
- `wolff-olins-x-artcenter`
- `yomo`

Cargo-era or retired/reference-only folders:

- `archive`
- `aspen-valley-landscaping`
- `coin-talk-too-much`
- `fuzzybrain`
- `john-steinbeck`
- `meihao`
- `mini-projects`
- `projects`
- `the-kind-warrior`
- `track-field-animations`

### Generated And Working Asset Sets

- `optimized/` - generated optimization batches for upload/rehosting workflows.
- `video-posters/` - generated still frames plus `manifest.tsv` for manual or
  scripted video poster assignment.
- `figma-export/` - Figma/Gaia export material.
- `gaia-selected/` - selected Gaia asset URL working files.

## Path Stability Notes

- `case-study-assets/manifest.json` records the original scrape folders and
  routes. Keep it stable unless regenerating the scrape manifest intentionally.
- `current-site/simon-schuster/Book/` preserves the 011-072 book photo sequence
  that previously sat at the Simon & Schuster folder root. Update any direct
  path references if using those files in scripts or uploads.
- `current-site/simon-schuster/Book/Web Optimized/` stores optimized derivatives
  for the book sequence. `current-site/simon-schuster/Web Optimized/` stores
  optimized derivatives for the broader Simon & Schuster asset set. Prefer
  these for web transfer when the exact original-resolution files are not
  required.
- `case-study-assets/external-embeds.json` documents private/blocked embeds from
  the scrape and should stay beside the scrape archive.
- `tools/image-optimizer` defaults to scanning `case-study-assets/current-site`,
  so do not move that folder without updating the tool README, UI default, and
  server default.
- `framer-global-media-controllers.md` references `case-study-assets/video-posters`.

## Retirement Rule

For this workspace, "retired" means "moved out of the active mental model," not
"safe to delete." Keep retired assets available until Micah explicitly asks for
a destructive storage cleanup.
