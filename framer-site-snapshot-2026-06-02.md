# Framer Site Snapshot - 2026-06-02

**Project:** Micah Hoang Portfolio 2026
**Framer URL:** `https://khaki-ship-257706.framer.app`
**Production/staging deployment reported by MCP:** `2026-06-02T01:39:16Z`
**Primary current-state doc:** `framer-current-state.md`

## Live Project Inventory

Framer MCP reported:

- 23 web pages
- 2 design pages
- 23 native components
- 28 code components
- 5 code override files
- 2 CMS collections

The current web-page inventory includes the core routes (`/`, `/404`, `/case-studies`, `/case-studies/:slug`, `/index`, `/play`, `/info`, `/contact`) plus bespoke case-study pages for AirPods, Simon & Schuster, Motion Connect 2025, National Park Playing Cards, Yomo, Karuna, Gaia, Weaponized Innocence, TYPLDN, Seek Truth, Cellular Symphony, Wolff Olins x ArtCenter, Independent Lens, Neon Lights, and Aspen Valley Landscaping.

## CMS Snapshot

`All Projects` (`yTHrQWMIY`) currently has 16 real records and no Jacob Turner sample/template records. `TYPLDN` is now present as sort `16` with slug `typldn`.

The `Journal` collection still exists, but no visible Journal page is present in the current Framer project map.

## Framer Draft Changes Made

Applied through Framer MCP on June 2:

- Fixed Home hero text from `mind.Strategy` to `mind. Strategy`.
- Updated `/case-studies` `NumberCounter` from `12` to `16`.
- Cleared old `slugFieldId="pdXVG_fBO"` props on Home, `/case-studies`, and `/index` helper instances so helpers use Framer item slugs directly.
- Cleared old `airpods-pro-3=/case-studies/airpods` URL overrides on Home and `/case-studies` `CaseStudyLinkRepair` instances.

These are Framer draft/editor changes. Publish from the Framer UI is still required before the public URL reflects them.

## Documentation Updates

Updated repo docs to remove drift around:

- 15 vs 16 CMS records
- older core-only route inventory vs current bespoke case-study pages
- `/index` data priority
- `RelatedProjectHoverZoom.tsx` being a local historical mirror, not current Framer inventory
- `/case-studies` count
- Home hero typo status
- asset README 555 original scrape vs 595 current media-file count

## Cleanup Decision

No tracked local TSX file or `tools/*` script met the "100% safe to remove" bar.

Preserve for now:

- Root Framer TSX mirrors, including files with no local imports, because Framer mounts code by code-file ID.
- Historical audit/handoff markdown files, because they are useful forensic context and now point back to `framer-current-state.md`.
- Scraper and QA tools, because they may still be useful for asset recovery or visual regression checks.

Potential future cleanup should start with user confirmation for generated/untracked output folders, especially `outputs/`, `output/playwright/`, `case-study-assets/figma-export/`, and `case-study-assets/gaia-selected/`.
