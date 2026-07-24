# Performance media deployment checklist — 2026-07-23

## Outcome

- The remaining critical local media batch is optimized in each asset's existing
  per-project folder. No catch-all media output folder was created.
- 130 new delivery derivatives were created, plus 2 existing Simon & Schuster
  still derivatives were retained for reuse.
- The newly processed source set is 1,162,513,219 bytes (1,108.66 MiB). The
  optimized videos, images, and posters are 175,123,310 bytes (167.01 MiB):
  987,389,909 bytes, or 84.94%, smaller.
- The earlier `/play` pass remains a separate, complete set: 70 recommended
  derivatives and a 70.6% reduction. Every recommended Play video is H.264,
  yuv420p, audio-free, and no larger than 900 px on either axis.
- Originals remain beside the project source archives for rollback. Replace the
  live Framer references; do not delete originals yet.

Every exact optimized file is enumerated in the linked JSON manifest for its
project. The folder links open the delivery-ready media directly.

## Step 1 — publish the lifecycle code before swapping media

- [x] The `/play` lifecycle, Safari coverage clamp, persistent-poster video
  handoff, and frozen-gallery blur were published on July 23.
- [ ] In Framer, review the synced draft versions of:
  - [`HomeSelectedWorkGrid.tsx`](</Users/micahhoang/My Drive/Portfolio 2026/code/components/HomeSelectedWorkGrid.tsx>)
  - [`CaseStudyVideoManager.tsx`](</Users/micahhoang/My Drive/Portfolio 2026/code/components/CaseStudyVideoManager.tsx>)
  - [`CaseStudyControllers.tsx`](</Users/micahhoang/My Drive/Portfolio 2026/code/components/CaseStudyControllers.tsx>)
  - [`IndexPage.tsx`](</Users/micahhoang/My Drive/Portfolio 2026/code/components/IndexPage.tsx>)
  - [`Play.tsx`](</Users/micahhoang/My Drive/Portfolio 2026/code/components/Play.tsx>)
  - [`ArchivePlayground.tsx`](</Users/micahhoang/My Drive/Portfolio 2026/code/components/ArchivePlayground.tsx>)
- [ ] Confirm the WhatsApp page still contains the new consolidated
  `CaseStudyControllers` instance.
- [ ] Publish the Framer draft. The code files are synced and typecheck clean,
  but the local tooling cannot press Framer's production Publish button.
- [ ] Confirm one viewport of video lookahead: visible/near videos should load;
  far videos should retain posters without downloading or decoding.

Implemented behavior:

- Home work-card videos mount near the viewport, use `preload="metadata"`, and
  have responsive image `sizes`.
- Case-study videos release far/hidden sources and safely restore direct
  `video[src]` and child `<source>` URLs. The manager is hardened for Safari
  visibility/page restoration, Framer remounts, rapid source updates, and
  detach/reinsert cycles.
- Hidden Index CMS fallback media has `src`/`srcset` removed.
- `/play` starts with `4` videos and can ramp to `10` on non-WebKit desktop.
  Desktop Safari stays at `4`, iOS/iPadOS stays at `2`, small non-WebKit
  viewports cap at `8`, and hidden/reduced-motion pages use `0`. The authorable
  Framer `Archive Items` / `archiveItems` contract is preserved as an
  empty-by-default canvas/rollback surface.

## Step 2 — P0 media replacements, in this order

### 1. Highland Harvests / Karuna

- [ ] Replace the two live MOV/M4V sources with the optimized H.264 MP4 files.
- [ ] Attach the paired native WebP posters.
- [ ] Verify the 1080×1920 portrait crops and the device loop on desktop and
  iPhone Safari.

Links: [media folder](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/karuna/Web Optimized>) ·
[manifest](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/karuna/Web Optimized/manifest.json>) ·
[replacement checklist](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/karuna/Web Optimized/CHECKLIST.md>)

### 2. Motion Connect

- [ ] Deploy the existing optimized row and stack derivatives.
- [ ] Replace the shared featured-card source and add its poster.
- [ ] Confirm only the visible responsive copy attaches a source.

Links: [row HQ manifest](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/motion-connect-2025/current-site/Web Optimized/row-assets/manifest-hq.json>) ·
[stack HQ manifest](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/motion-connect-2025/current-site/Web Optimized/stack-XPejo4InG-assets/manifest-hq.json>) ·
[featured-card folder](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/motion-connect-2025/current-site/Web Optimized/featured-card>) ·
[featured-card manifest](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/motion-connect-2025/current-site/Web Optimized/featured-card/manifest.json>) ·
[image/poster manifest](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/motion-connect-2025/optimized-media/manifest.json>)

### 3. Gaia

- [ ] Replace the live case-study videos and oversized images with the existing
  optimized set.
- [ ] Preserve the final aspect ratio before media hydration to prevent the
  previous 1.452 CLS.
- [ ] Verify the square/UI videos at 200% zoom in Safari.

Links: [all optimized Gaia media](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/gaia/framer-staging/Web Optimized/optimized>) ·
[videos](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/gaia/framer-staging/Web Optimized/optimized/videos>) ·
[images](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/gaia/framer-staging/Web Optimized/optimized/images>)

### 4. Seek Truth

- [ ] Replace the promo with the new max-900 MP4 and paired q90 poster.
- [ ] Replace the 22 critical editorial spreads with the 3200 px q90
  near-lossless WebP versions.
- [ ] Inspect fine typography at 200% after upload; do not substitute a lower
  quality bulk preset.
- [ ] Replace the shared related-card source and poster.

Links: [main optimized media](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/seek-truth/main/Web Optimized>) ·
[main manifest](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/seek-truth/main/Web Optimized/optimization-manifest.json>) ·
[main checklist](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/seek-truth/main/Web Optimized/CHECKLIST.md>) ·
[related-card media](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/seek-truth/Web Optimized>) ·
[related-card manifest](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/seek-truth/Web Optimized/manifest.json>)

### 5. Peak Energy

- [ ] Replace all nine self-hosted clips and attach their paired posters.
- [ ] Keep only one Vimeo player alive. Render the second occurrence as a
  poster/button and create or reveal the player only after interaction.
- [ ] Check gradient banding in Safari before publishing.

Links: [media folder](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/peak-energy/Web Optimized>) ·
[manifest](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/peak-energy/Web Optimized/manifest.json>) ·
[replacement checklist](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/peak-energy/Web Optimized/CHECKLIST.md>)

## Step 3 — P1 case-study replacements

### Simon & Schuster

- [ ] Replace the three animated GIFs with max-900 H.264 MP4s and their WebP
  posters.
- [ ] Keep the two already-optimized 2400 px stills referenced by the manifest.

Links: [media folder](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/simon-schuster/current-site/Web Optimized>) ·
[manifest](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/simon-schuster/current-site/Web Optimized/optimization-manifest.json>) ·
[checklist](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/simon-schuster/current-site/Web Optimized/CHECKLIST.md>)

### Weaponized Innocence

- [ ] Replace the 44 critical raw photographs with the 2800 px q88 WebP set.
- [ ] Spot-check grain, dark gradients, and small book typography at 200%.

Links: [media folder](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/weaponized-innocence/current-site/Web Optimized>) ·
[manifest](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/weaponized-innocence/current-site/Web Optimized/optimization-manifest.json>) ·
[checklist](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/weaponized-innocence/current-site/Web Optimized/CHECKLIST.md>)

### AirPods

- [ ] Replace all nine audited video sources.
- [ ] Attach the generated posters where the live component lacks one.

Links: [media folder](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/airpods/current-site/Web Optimized>) ·
[manifest](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/airpods/current-site/Web Optimized/video-optimization-2026-07-23.json>) ·
[checklist](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/airpods/current-site/Web Optimized/VIDEO-OPTIMIZATION-CHECKLIST-2026-07-23.md>)

### National Park Cards

- [ ] Replace all seven audited videos.
- [ ] Inspect small card typography and line art at 200% in Safari.

Links: [media folder](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/national-park-cards/current-site/Web Optimized>) ·
[manifest](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/national-park-cards/current-site/Web Optimized/video-optimization-2026-07-23.json>) ·
[checklist](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/national-park-cards/current-site/Web Optimized/VIDEO-OPTIMIZATION-CHECKLIST-2026-07-23.md>)

### Yomo

- [ ] Replace both main videos and attach both generated posters.

Links: [media folder](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/yomo/current-site/Web Optimized>) ·
[manifest](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/yomo/current-site/Web Optimized/video-optimization-2026-07-23.json>) ·
[checklist](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/yomo/current-site/Web Optimized/VIDEO-OPTIMIZATION-CHECKLIST-2026-07-23.md>)

### TYPLDN

- [ ] Replace the four project videos and attach the four generated posters.
- [ ] Use the existing optimized gallery images in the same folder.

Links: [media folder](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/typldn/Web Optimized>) ·
[video manifest](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/typldn/Web Optimized/video-optimization-2026-07-23.json>) ·
[video checklist](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/typldn/Web Optimized/VIDEO-OPTIMIZATION-CHECKLIST-2026-07-23.md>) ·
[image manifest](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/typldn/Web Optimized/manifest.json>)

## Step 4 — shared cards and reuse-only projects

### Shared related cards

- [ ] Replace the shared Cellular, Seek, and Motion card sources everywhere
  they appear; do not upload page-specific duplicates.
- [ ] Attach the corresponding poster to each card instance.

Links: [Cellular card folder](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/cellular-symphony/Web Optimized>) ·
[Cellular manifest](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/cellular-symphony/Web Optimized/manifest.json>) ·
[Seek card folder](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/seek-truth/Web Optimized>) ·
[Motion card folder](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/motion-connect-2025/current-site/Web Optimized/featured-card>)

### WhatsApp

- [ ] Reuse the existing dimension-preserving CRF-23 files; do not downscale
  the UI-heavy videos further.
- [ ] Upload the additional Meta AI Group animation from the new max-900 CRF-22
  video and attach its q90 WebP poster.
- [ ] Upload them to Framer and replace Catbox URLs.
- [ ] Verify the new page controller limits offscreen playback.

Links: [reuse audit](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/whatsapp/Web Optimized/video-reuse-audit-2026-07-23.json>) ·
[reuse checklist](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/whatsapp/Web Optimized/VIDEO-REUSE-CHECKLIST-2026-07-23.md>) ·
[new Meta AI animation manifest](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/whatsapp/Web Optimized/anim-b26-meta-ai-group-v001-optimization-2026-07-23.json>) ·
[original optimization manifest](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/whatsapp/manifest.json>)

### Wolff Olins × ArtCenter

- [ ] Reuse the existing optimized video derivatives and thumbnail.
- [ ] Replace the remaining 2.69 MB Cargo `Slide 10` source with the existing
  142 KB optimized derivative.
- [ ] Confirm the existing controller remains enabled after publish.

Links: [reuse audit](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/wolff-olins-x-artcenter/current-site/Web Optimized/video-reuse-audit-2026-07-23.json>) ·
[reuse checklist](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/wolff-olins-x-artcenter/current-site/Web Optimized/VIDEO-REUSE-CHECKLIST-2026-07-23.md>) ·
[media manifest](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/wolff-olins-x-artcenter/current-site/Web Optimized/manifest.json>)

## Step 5 — finish the `/play` CMS swap

- [ ] In Framer CMS, replace each live `Play Archive` `Image / Poster` and
  optional `Video` field using the recommended path in the results file.
- [ ] Use only the recommended `*-max900-*` videos. Larger legacy MP4s remain
  in some `optimized/` folders as rollback material and are not the deployment
  choice.
- [ ] Keep title, `Content`, order, link fields, and stroke attached to the same
  CMS row. Do not move published media into `Archive Items`; that property
  remains empty except for canvas preview or emergency rollback.
- [ ] Confirm the current budgets: `10` non-WebKit desktop after ramp, `4`
  desktop Safari, `2` iOS/iPadOS, `8` small non-WebKit, and `0` while hidden or
  under reduced motion. The initial batch is `4`.

Links: [complete Play results with every exact recommended path](</Users/micahhoang/My Drive/Portfolio 2026/assets/Play/optimization-results-2026-07-23.md>) ·
[machine-readable results](</Users/micahhoang/My Drive/Portfolio 2026/assets/Play/optimization-results-2026-07-23.json>) ·
[Play media root](</Users/micahhoang/My Drive/Portfolio 2026/assets/Play>)

## Step 6 — remove fragile external fallbacks

- [ ] Upload all selected MP4s and posters to Framer's native asset system.
- [ ] Replace every Catbox/Cargo fallback URL covered by the project manifests.
- [ ] Confirm a native poster is present before removing a fallback mapping;
  do not leave a blank first frame.
- [ ] In Safari's Network panel, filter for `catbox`, `cargo`, `.mov`, `.m4v`,
  and `.gif`. The migrated critical pages should make no request to those
  legacy media endpoints.

## Step 7 — post-publish Chrome and Safari verification

- [ ] Test the 22 sitemap routes and the documented case-study aliases from the
  [baseline audit](</Users/micahhoang/My Drive/Portfolio 2026/output/playwright/full-site-performance-2026-07-23/README.md>).
- [ ] Run one cold/cache-disabled desktop pass in Chrome at 1440×1000.
- [ ] Run one cold desktop Safari pass at 1440×1000 and one iPhone-sized Safari
  pass at 393×659.
- [ ] On each case study, scroll from top to bottom and back to top. Confirm:
  - nearby videos start without a blank flash;
  - far videos pause and release their source;
  - posters and video boxes never change geometry;
  - text and UI screenshots remain crisp at 200%;
  - no duplicate requests for an identical video URL;
  - no audio streams or accidental controls appear;
  - no console errors, hydration warnings, or failed media requests appear.
- [ ] Re-measure the original five heavy routes. Target a substantial drop from:
  Highland 111.31 MiB, Motion 101.46 MiB, Gaia 78.62 MiB, Seek 44.52 MiB, and
  Peak 36.86 MiB.
- [ ] Keep originals until this post-publish pass is complete, then archive
  them through the normal project workflow.

Play-specific Safari checks:

- [x] Rapid wheel/pan bursts expose no blank strips while the virtual window
  catches up.
- [x] Center-near videos retain their slots; edge-near videos return to the
  persistent poster and release their source.
- [x] Posters remain visible while a video attaches, decodes, stalls, or
  detaches.
- [x] The drawer uses no `backdrop-filter` or resting saturation filter on
  WebKit.
- [x] The frozen-gallery blur eases to `14px` over `560ms` and back to `0px`
  over `450ms`. The world remains fixed while the drawer is open, then starts
  moving and reallocating its bounded videos as soon as close begins instead of
  waiting for the blur-out.
- [ ] Publish and recheck the final neutral follow-up modules
  `ArchivePlayground@ljLx3RPT8ZO2PxnHUl6X`,
  `Play@AEtiSt4JIdInX6LGx9Bk`, and
  `GrainOverlay@IU8jp598NHIsGsyeDMB5`.
- [ ] After that publish, open `/play-hover-preview` in a fresh private window
  and confirm the generated-CMS-module fallback loads all Play Archive rows
  before testing hover playback.

## Completed local QA

- The published `/play` pool holds `56` cards at `1440×1000`, one transformed
  world layer, and the expected `4` Safari videos.
- A real WebKit close sample reached `0px` blur at `468ms` with an unchanged
  world transform and zero mounted videos.
- The current four sampled Safari-center MP4 responses are byte-range enabled,
  immutable, and `212–723 KB`, in the same sub-megabyte payload class as the
  representative files sampled from Alan Xu's gallery.
- 40 newly generated critical videos: H.264, yuv420p, zero audio streams,
  fast-start atom before media data, and full decode pass.
- 168 images/posters/QC sheets: readable dimensions and no corrupt files.
- 17 JSON manifests: valid JSON.
- Zero zero-byte files in the optimized/reuse folders.
- Representative AirPods, Highland, National Park typography, TYPLDN, Seek,
  Simon & Schuster, and Weaponized Innocence visuals passed manual or
  comparison-sheet inspection.
- Six modified code components bundle as browser ESM and pass
  `git diff --check`; all synced Framer code files reported a clean typecheck.
- Independent browser-harness review passed late/rapid source changes,
  source-element replacement, detach/reinsert, hidden/unmanaged transitions,
  and source-unload toggling.
