# Portfolio 2026 Workspace Organization Plan

Prepared: 2026-06-15

Purpose: make this folder easier for Micah and future AI agents to read without
breaking Framer MCP, published-site QA, or active code-file mirrors.

## Current Truth Sources

- Framer project URL: `https://khaki-ship-257706.framer.app`
- Public domain check: `https://micahhoang.info` still appears to be the older
  Cargo/current-public site, not the active Framer redesign surface.
- Framer MCP reports production/staging both on the same optimized deployment.
- Local source of truth doc: `framer-current-state.md`
- Project contracts: `AGENTS.md`, `case-study-cms-workflow.md`,
  `portfolio-framework.md`, `index-component-instructions.md`

## Do Not Move Without Updating Contracts

Keep these at the workspace root unless there is a deliberate migration with
docs updated in the same change:

- `AGENTS.md`
- `framer-current-state.md`
- `portfolio-framework.md`
- `case-study-cms-workflow.md`
- `index-component-instructions.md`
- `micahhoang-tokens.json`
- `framer-active-text-styles.tokens.json`
- Active Framer code-file mirrors listed below

The project-local `AGENTS.md` points future agents to these nearby files by
name, so moving them would make the workflow less reliable.

## Active Local Framer Code Mirrors

These local files match current Framer code-component paths and should stay
easy to find. If they are reorganized later, keep a manifest at root mapping the
Framer path, codeFileId, and local path.

| Local file | Framer codeFileId | Role |
|---|---:|---|
| `IndexPage.tsx` | `rgAZFOv` | `/index` archive component |
| `IndexPageGridPreview.tsx` | `LgIzFjJ` | Mounted `/index` wrapper exported as `IndexPage`; Framer Grid/List preview and Figma responsive overrides |
| `CaseStudyThumbnailStrokeStyles.tsx` | `Z28JYvA` | CMS thumbnail stroke/helper |
| `ArchivePlayground.tsx` | `QNpkYp5` | `/play` archive renderer |
| `OtherProjectCardRestored.tsx` | `vlwa5Cz` | Related-project card helper |
| `ScrollToTopButton.tsx` | `gh4ngZN` | Scroll-to-top helper |
| `InfoScrollMoreColorOverride.tsx` | `AZDGWx7` | `/info` Scroll More color override |
| `CaseStudyJustifiedMediaGrid.tsx` | `c0iPrbN` | Case-study media grid |
| `SimonSchusterGuidelinesCarousel.tsx` | `tYFZCey` | Reusable image carousel |
| `CaseStudyLinkRepair.tsx` | `y6ny5x4` | Legacy/case-study link repair |
| `HomeSelectedWorkGrid.tsx` | `FecepLS` | Home selected-work grid |
| `CaseStudyLightbox.tsx` | `F2K4_SV` | Page-level case-study lightbox |
| `CaseStudyVideoManager.tsx` | `rGMwETR` | Case-study autoplay manager |
| `CaseStudyControllers.tsx` | `z13WRHS` | Consolidated hidden controller wrapper |
| `CaseStudyMobileDescriptorLayout.tsx` | `W62Sy75` | Mobile descriptor layout helper |
| `Play.tsx` | `PN1RVOf` | Protected `/play` authoring wrapper |
| `NavigationScrollGuard.tsx` | `Wnd19lx` | Native navigation scroll guard |
| `PageTransition.tsx` | `gmalnRr` | Site-wide page transition |
| `CaseStudyWorkInProgressGate.tsx` | `Vu82U8E` | WIP-gated case-study shell helper |

## Framer Code Files Missing Locally

Framer has these code files that are not mirrored in the root folder. This may
be intentional, but future cleanup should not assume the local folder is a full
Framer backup.

- `TextEncryptionEffect.tsx`
- `Counter.tsx`
- `ProfileTextRevealFix.tsx`
- `FooterCopyrightYear.tsx`
- `Test.tsx`
- `ResumeAssetHost.tsx`
- `PlaygroundNavPassthrough.tsx`
- `PlaygroundRuleExitGuard.tsx`
- `PlaygroundInstantExitSnapshot.tsx`
- `PlaygroundSidebarColumnGuard.tsx`
- `PlaygroundNavExitHold.tsx`
- `PlaygroundMediaLoadSmoother.tsx`
- `ResponsiveCaseStudyVideo.tsx`
- `ResponsiveCaseStudyImage.tsx`
- `SeekTruthCargoSlideshow.tsx`
- `TypldnProcessGallery.tsx`
- `CaseStudyScrambleText.tsx`
- `FixedHeightMediaRows.tsx`
- `ArchivePlaygroundConsolidated.tsx`
- `ArchivePlaygroundConsolidatedDraft.tsx`
- `PlayAccessibilityDraftPatch.tsx`
- `PlayDraftViewportFix.tsx`

## Archived Local-Only Candidates

These files were not listed in the current Framer code-component inventory and
were moved during Phase 2 on 2026-06-15.

- `_archive/local-only-drafts/IndexGridVideoHoverFix.tsx` - local helper;
  current docs say grid hover is consolidated into `IndexPage.tsx`.
- `_archive/local-only-drafts/IndexPageBreakpointsDraft.tsx` - draft breakpoint
  helper, not a live Framer code file.
- `_archive/bundled-framer-app/app.js` - bundled/minified Electron or Framer app
  artifact, not project source.
- `_archive/bundled-framer-app/main.js` - bundled/minified Electron or Framer
  app artifact, not project source.
- `_archive/bundled-framer-app/preload.js` - bundled/minified Electron or Framer
  app artifact, not project source.
- `_archive/handoffs/claude-mcp-handoff-case-study-wip-gate.md` - one-off
  handoff after the WIP gate work. Keep `case-study-wip-gate.md` active for now.

## Root Reference Artifacts

- `Micah-Portfolio-ICP.pdf` - six-page ICP/strategy reference artifact for the
  portfolio positioning work. Keep at root unless a broader references folder is
  introduced and linked from `portfolio-framework.md`.

## Asset Folders

`case-study-assets/` is a preservation and staging archive, not the live Framer
runtime. Do not delete files from it just because they are no longer active in
Framer.

Suggested labels:

- `case-study-assets/current-site/` - older Cargo/public-site scrape.
- `case-study-assets/framer-staging/` - Framer staging scrape and staging media
  batches. Contains active project folders, `brand-new-school` working media for
  the `/case-studies/whatsapp` WIP shell, plus retired route folders.
- `case-study-assets/optimized/` - optimized batches for upload/rehosting.
- `case-study-assets/video-posters/` - poster stills and manifest for manual
  Framer video poster work.
- `case-study-assets/figma-export/` and `case-study-assets/gaia-selected/` -
  Gaia/Figma-derived working material.

Current Framer/CMS active project slugs:

`gaia`, `airpods`, `peak-energy`, `simon-schuster`,
`motion-connect-2025`, `national-park-cards`, `yomo`, `karuna`,
`weaponized-innocence`, `wolff-olins-x-artcenter`, `cellular-symphony`,
`seek-truth`, `independent-lens`, `typldn`, `rejuve`, `belly-bar`,
`whatsapp`

Archive/retired local asset folders include:

- `case-study-assets/framer-staging/neon-lights`
- `case-study-assets/framer-staging/aspen-valley-landscaping`
- `case-study-assets/framer-staging/john-steinbeck`
- Cargo-era-only folders such as `fuzzybrain`, `the-kind-warrior`,
  `coin-talk-too-much`, `meihao`, `track-field-animations`, and `projects`

## Generated Output Folders

- `output/` is mostly Playwright/browser QA and scraped frames.
- `outputs/` includes generated presentation/deliverable artifacts.
- `.playwright-cli/` is ignored already and can remain generated scratch.
- `.framer-inspect/` is useful inspection cache; do not delete during active
  Framer parity work.

Because docs reference many paths under `output/playwright/...`, move old output
only in a deliberate archive pass or leave the paths stable and add README files.

## Recommended Reorganization

Phase 1, safe documentation:

- Keep active root docs and TSX mirrors at root.
- Add this plan as the workspace map.
- Add short READMEs to `output/`, `outputs/`, and possibly
  `case-study-assets/` instead of moving referenced artifacts immediately.

Phase 2, low-risk retirement: completed 2026-06-15

- Created `_archive/local-only-drafts/`.
- Moved `IndexGridVideoHoverFix.tsx` and `IndexPageBreakpointsDraft.tsx` there.
- Created `_archive/bundled-framer-app/`.
- Moved `app.js`, `main.js`, and `preload.js` there.
- Created `_archive/handoffs/`.
- Moved `claude-mcp-handoff-case-study-wip-gate.md` there.

Phase 3, asset labeling: completed 2026-06-15

- Added `case-study-assets/ARCHIVE_NOTES.md` listing active CMS slugs, retired
  Framer route folders, Cargo-era-only folders, generated asset sets, and path
  stability notes.
- Did not move media because manifests, docs, and upload workflows still
  reference existing paths.

Phase 4, optional mirror completion: completed 2026-06-15

- Added `framer-code-mirror/manifest.json` with all current Framer code
  components and override files.
- Kept active/editable root TSX files as the working set.
- Mirrored 22 non-root Framer code components as compiled Framer module
  snapshots under `framer-code-mirror/code-components/compiled-js/`, with their
  `framer.com/m` wrappers under `framer-code-mirror/code-components/wrappers/`.
- Saved 5 Framer override compatibility files as source snapshots under
  `framer-code-mirror/code-overrides/source-tsx/`.
- The mirror manifest records source kind, codeFileId, Framer path, local path,
  hashes, insert URLs, and any download errors.

## Verification After Any Move

- `git status --short`
- `rg` for each moved filename to catch broken references
- For TSX touched or moved: targeted `esbuild` bundle/type smoke check when
  appropriate
- For Framer helper changes: run the relevant local guard, especially
  `node tools/check-thumbnail-stroke-resolver.mjs` before thumbnail helper work
- For published parity after Framer publish: check `/`, `/index`, `/play`,
  `/info`, `/case-studies`, and at least one bespoke case-study route

## Phase 5, framework-audit code retirement (2026-06-18, in progress)

Backup committed first at `_archive/retired-play-helpers-2026-06-18/` (10 compiled
snapshots + editable `ArchivePlaygroundConsolidated.tsx` + README with rollback
paths) and pushed to GitHub `main`.

Done (all 10 deleted from Framer via MCP; PUBLISH to apply):
- `ArchivePlaygroundConsolidated.tsx` (`D5YVims`)
- `ArchivePlaygroundConsolidatedDraft.tsx` (`aEyj7Rq`)
- `PlayAccessibilityDraftPatch.tsx` (`IPugK6y`)
- `PlayDraftViewportFix.tsx` (`uO7AzzY`)
- `PlaygroundNavPassthrough.tsx` (`RBX6jsP`)
- `PlaygroundRuleExitGuard.tsx` (`vdg69JZ`)
- `PlaygroundInstantExitSnapshot.tsx` (`c2PU6kX`)
- `PlaygroundSidebarColumnGuard.tsx` (`R3ZWYKl`)
- `PlaygroundNavExitHold.tsx` (`iivBAHR`)
- `PlaygroundMediaLoadSmoother.tsx` (`FFqrKyU`)

The six `Playground*` helpers' previously-disabled `/play` instances were already
gone (confirmed in Framer UI June 18), so the orphaned code files were safe to delete.

Phase 4 clarity edit done via MCP: `CaseStudyScrambleText.tsx` (`dHFQCIH`) display
name set to "Case Study Header Link" + header rewritten (it is a hover-color link,
NOT a scramble). File rename still needs the Framer UI.

Not retired (kept deliberately): the 5 code overrides (publish-validation safety),
`Counter.tsx`/`NumberCounter` (LIVE on `/case-studies`), `IndexPageGridPreview.tsx`
(LIVE `/index` wrapper). Phase 2/3 (gallery + responsive-media + CMS-scraper
consolidation) deferred — those are live components, not drafts.
