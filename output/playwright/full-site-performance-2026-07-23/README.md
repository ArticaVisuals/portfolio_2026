# Full-Site Performance Audit — July 23, 2026

This was a read-only audit of all 22 sitemap routes plus three documented
case-study paths. No site, Framer, component, or media files were changed.

## Method

- Desktop Chrome: isolated cache-disabled sessions at 1440×1000, with a
  six-second settle window and Chrome DevTools Protocol transfer accounting.
- Desktop WebKit: isolated cold sessions at 1440×1000, with a four-second
  post-load observation window.
- iPhone WebKit: isolated cold sessions for Home, Play, Motion Connect,
  Highland Harvests, and Gaia at 393×659.
- Media audit: full-scroll inspection of rendered versus decoded dimensions,
  unique file sizes from response headers, local derivative availability, and
  visual-content risk.
- Chrome transfer totals include repeated range/full requests for the same URL.
  This is intentional: repeated delivery is one of the main production issues.
- WebKit transfer bytes are omitted because WebKit does not expose them
  consistently.

## Executive finding

The site does not primarily have a compression-quality problem. It has a media
lifecycle problem: several pages attach large video sources too early, fetch
the same file repeatedly, or allow paused offscreen videos to become fully
ready. Fixing source attachment, request duplication, poster coverage, and
responsive selection comes first and preserves the current media exactly.

The five heaviest cold Chrome routes were:

1. Highland Harvests / Karuna — 111.31 MiB
2. Motion Connect — 101.46 MiB
3. Gaia — 78.62 MiB
4. Seek Truth — 44.52 MiB
5. Peak Energy — 36.86 MiB

## Ranked optimization backlog

### P0 — no-quality-loss fixes

1. **Eliminate repeated requests for identical videos.**
   - Highland Harvests fetches its 23.43 MiB portrait MOV four times, producing
     93.74 MiB of weighted transfer from one file.
   - Motion Connect fetches two 6–7 MiB MP4s four times each.
   - Seek Truth fetches its 8.43 MiB promo three times.
   - Gaia fetches several large MP4s three times each.
   - Peak Energy fetches its 8.54 MiB hero twice.
   - Keep one media element/source per visible module, avoid poster/source swap
     remounts, and do not create duplicate active players for repeated modules.

2. **Defer the actual video `src`, not just playback.**
   - Pausing after hydration is too late: Chrome transferred 104.82 MiB of
     media on Highland Harvests even though all three videos were paused at the
     measurement point.
   - Gaia transferred 70.81 MiB with only one of 16 videos playing.
   - Peak Energy transferred 34.24 MiB with only one of ten playing.
   - Mount/assign sources only within a one-viewport lookahead and detach or
     return to the poster when far outside it.
   - Home currently gives every selected-work video `preload="auto"` in
     `HomeSelectedWorkGrid.tsx`, causing four videos to become ready and
     roughly 5.88 MiB of media to transfer on both Home routes.

3. **Reserve stable media geometry before hydration.**
   - Gaia CLS: 1.452.
   - Motion Connect CLS: 1.439.
   - `/index` CLS: 0.327.
   - `/case-studies` → `/index` CLS: 0.326.
   - Home CLS: 0.291.
   - Bind the final aspect ratio/height before image or video readiness; do not
     let poster-to-video swaps or CMS hydration change the card dimensions.

4. **Replace external Catbox fallbacks with Framer-hosted media.**
   - WebKit hard failures appeared on Simon & Schuster, Motion Connect, Gaia,
     Peak Energy, and WhatsApp; mobile reproduced failures on Motion Connect
     and Gaia.
   - This is a reliability fix and does not require any quality reduction.

5. **Repair runtime-controller coverage.**
   - WhatsApp and Wolff Olins have no video-manager, lightbox, or consolidated
     controller markers.
   - Cellular Symphony has the manager/lightbox but not the consolidated
     controller marker.
   - WebKit played 6/7 WhatsApp autoplay videos and all 5 Wolff Olins autoplay
     videos concurrently.

### P0 — page-specific media

6. **Motion Connect — deploy the derivatives that already exist.**
   - 101.46 MiB cold transfer: 86.19 MiB media and 14.52 MiB images.
   - 27 referenced videos total about 66 MiB of unique source files.
   - A 13.09 MiB 1920×1920 clip renders at about 335×335.
   - A 7.08 MiB 3840×2160 clip renders at about 448×252.
   - A 10.86 MiB 5850×3900 PNG renders at about 955×637.
   - Existing 720p/small-cell and higher-quality row derivatives are already
     cataloged in the local Motion Connect Web Optimized manifests.

7. **Highland Harvests / Karuna — replace MOV/M4V delivery.**
   - 111.31 MiB cold transfer; WebKit load event at 10.72 seconds desktop and
     10.67 seconds on iPhone.
   - Main file: 23.43 MiB, 2160×3840, approximately 26 Mbps, with audio and
     extra MOV streams, rendered at about 408×725.
   - Second file: 5.40 MiB, 608×1080 at 60 fps with audio.
   - Neither main video has a poster.
   - Create H.264 MP4/yuv420p `+faststart` versions, remove unused audio and
     metadata streams, preserve the intentional frame rate, and add static
     posters. A 1080×1920 master is already more than 2× the rendered width.

8. **Gaia — deploy the existing optimized set and fix CLS.**
   - 78.62 MiB cold transfer; 70.81 MiB media.
   - A 2000×2482, 8.93 MiB clip renders around 305×378.
   - A 1920×1920, 7.47 MiB clip renders around 378×378.
   - A 3872×2160, 4.13 MiB clip renders around 896×500.
   - Exact local replacements already exist in the Gaia Web Optimized folder.

9. **Seek Truth — use the prepared images, but protect typography.**
   - 44.52 MiB cold transfer: 28.48 MiB media and 15.23 MiB images.
   - 86 live images include raw 4400×3300 PNG editorial spreads.
   - The 8.43 MiB portrait promo is requested three times and lacks a live
     poster.
   - The existing upload manifest reduces 56 source images from 496.8 MiB to
     11.2 MiB. Regenerate important full-width typography spreads at
     2800–3200 px and WebP quality 88–90 before replacement; do not apply a
     blanket quality-78 preset.

10. **Peak Energy — avoid two active Vimeo players and gate self-hosted media.**
    - 36.86 MiB cold transfer; 34.24 MiB media.
    - The same Vimeo film appears twice. Keep one live player and render the
      other as a poster that creates the player on interaction.
    - The largest self-hosted clip is 8.94 MiB at 1920×1080 but renders around
      690×388.

### P1 — next asset batch

11. **Simon & Schuster and Weaponized Innocence — image-first optimization.**
    - Simon & Schuster: 21.05 MiB, almost entirely images. Replace the
      6000×4000 4.48 MiB JPEG and 3111×2333 1.89 MiB PNG with the existing
      2400 px Web Optimized derivatives. Convert the animated GIF to MP4 plus a
      poster.
    - Weaponized Innocence: 15.56 MiB and 56 mostly raw 3600×2400 images.
      Create 2400–2800 px WebP/AVIF derivatives, preserving grain with visual
      review.

12. **Fix shared related-card assets once.**
    - `EFH57…m4v` is 12.01 MiB and appears across Highland Harvests,
      Weaponized Innocence, Wolff Olins, and related sections.
    - `MwQgx…mp4` is 3.95 MiB and appears on Home, AirPods, Gaia, and Peak.
    - `6kI8…mp4` is 2.03 MiB and appears on Weaponized Innocence, Cellular
      Symphony, and Wolff Olins.
    - Related cards render around 453×271; provide a 960–1200 px H.264 MP4 and
      a responsive poster.

13. **Correct responsive image selection on Home and Index.**
    - The Home portrait decodes at 2000×2940 but renders around 175×257,
      consuming roughly 23.5 MiB of decoded RGBA memory.
    - `/index` and `/case-studies` render some thumbnails around 30×30 while
      requesting source dimensions up to 3236 px. Request 96–128 px, or 256 px
      only for thumbnails that visibly enlarge.

14. **Finish AirPods, National Park Cards, Yomo, and TYPLDN videos.**
    - AirPods: 11 videos reference about 38 MiB; a 3840×2160 clip renders at
      roughly 690×388. Posters already exist.
    - National Park Cards: preserve the small card typography at CRF 23–25;
      convert the remaining MOV to MP4.
    - Yomo: two main videos total about 10.5 MiB and lack posters.
    - TYPLDN: four project videos lack posters; several 1440 px gallery images
      render only 180–320 px wide.

15. **Treat WhatsApp as a loading-policy task, not a downscaling task.**
    - The UI-heavy videos are already only 480–768 px wide.
    - Existing local CRF-23 outputs reduced the original batch from 133.4 MiB
      to about 20.2 MiB.
    - Preserve dimensions and text sharpness; add source gating and controller
      coverage.

16. **Continue the Play archive replacement pass.**
    - 11.82 MiB cold transfer: 9.63 MiB media and 1.74 MiB images.
    - WebKit ran every mounted video: 16/16 desktop and 11/11 iPhone.
    - Desktop LCP was about 2.4 seconds in both Chrome and WebKit.
    - The prepared max-900 derivatives should replace the remaining oversized
      CMS media; then consider lowering the concurrent video budget.

17. **Fonts are a final cleanup, not the first project.**
    - Normal pages load roughly 164–175 KiB across 7–9 fonts.
    - Remove unused weights/families and retain `font-display: swap` after the
      media work.

## Quality-preserving output rules

- Apply lifecycle/deduplication/poster fixes before recompression. These have
  zero image-quality cost.
- Full-width photography around 1400 CSS px: retain 2800 px long edge; use
  WebP quality 84–88 or visually inspected AVIF.
- Fine typography, editorial spreads, cards, and UI screenshots: 2800–3200 px,
  WebP quality 88–90 or near-lossless. Inspect at 200%.
- Half-column images around 690 CSS px: retain 1400–1600 px long edge.
- Full-width video and gradients: 1600–1920 px long edge, H.264 CRF 23–25,
  slow preset.
- Half-column/card video: 900–1280 px long edge, H.264 CRF 25–27.
- Small Motion Connect cells around 335 px: the existing 720 px derivatives
  are sufficient for 2× display.
- UI-heavy WhatsApp motion: retain current dimensions and use CRF 23–25.
- Preserve original frame rate unless an A/B visual comparison proves a lower
  rate is acceptable.
- Remove unused audio, add `+faststart`, retain yuv420p and H.264 for broad
  Chrome/Safari compatibility.

## Complete live-route matrix

Chrome transfer is the cache-disabled cold-load total. WebKit timings are
included because transfer bytes are unavailable in that engine.

| Route | Chrome MiB | Chrome LCP ms | Chrome CLS | WebKit LCP ms | WebKit load ms |
|---|---:|---:|---:|---:|---:|
| `/` | 7.50 | 576 | 0.291 | 668 | 388 |
| `/home-alt` | 7.51 | 500 | 0.148 | 620 | 378 |
| `/404` | 0.48 | 408 | 0.003 | 220 | 236 |
| `/case-studies` → `/index` | 1.30 | 296 | 0.326 | 170 | 188 |
| `/index` | 0.96 | 492 | 0.327 | 295 | 311 |
| `/play` | 11.82 | 2432 | 0.000 | 2380 | 190 |
| `/info` | 0.57 | 548 | 0.000 | 352 | 371 |
| `/case-studies/airpods` | 11.29 | 884 | 0.000 | 832 | 1625 |
| `/case-studies/simon-schuster` | 21.05 | 948 | 0.000 | 768 | 786 |
| `/case-studies/motion-connect-2025` | 101.46 | 1368 | 1.439 | 1387 | 3434 |
| `/case-studies/national-park-cards` | 4.98 | 892 | 0.000 | 764 | 969 |
| `/case-studies/yomo` | 3.86 | 1104 | 0.000 | 652 | 648 |
| `/case-studies/highland-harvests` | 111.31 | 864 | 0.000 | 744 | 10716 |
| `/case-studies/gaia` | 78.62 | 1240 | 1.452 | 988 | 3243 |
| `/case-studies/weaponized-innocence` | 15.56 | 1044 | 0.001 | 664 | 11516 |
| `/case-studies/typldn` | 3.39 | 716 | 0.000 | 352 | 1246 |
| `/case-studies/seek-truth` | 44.52 | 696 | 0.000 | 532 | 1439 |
| `/case-studies/cellular-symphony` | 2.97 | 328 | 0.000 | 401 | 464 |
| `/case-studies/wolff-olins-x-artcenter` | 13.43 | 668 | 0.000 | 336 | 3143 |
| `/case-studies/independent-lens` | 2.87 | 876 | 0.000 | 732 | 1165 |
| `/case-studies/peak-energy` | 36.86 | 424 | 0.000 | 578 | 2302 |
| `/case-studies/whatsapp` | 9.02 | 1072 | 0.078 | 468 | 410 |

## Route and publishing findings

- `/case-studies` redirects to `/index`. Direct `/index` had three WebKit
  hydration warnings; the redirected route produced five hydration warnings
  and six access-control page errors.
- `/home-alt` duplicates Home and is currently in the sitemap.
- `/case-studies/karuna`, `/case-studies/rejuve`, and
  `/case-studies/belly-bar` return 404 and canonicalize to `/404`.
- The live Karuna content is `/case-studies/highland-harvests`.
- No audited route had horizontal overflow, broken DOM images, or video element
  decode errors.

## Detailed artifacts

- `chrome/README.md` — complete Chrome table, transfer rankings, failures, and
  runtime-marker coverage.
- `chrome/summary.json` — machine-readable Chrome aggregate.
- `webkit/desktop-report.md` — complete desktop WebKit table.
- `webkit/iphone-report.md` — iPhone WebKit critical-route table.
- `webkit/desktop-results.json` and `webkit/iphone-results.json` —
  machine-readable WebKit results.
