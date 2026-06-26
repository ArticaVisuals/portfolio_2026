# Framer Current State Audit

**Project:** Micah Hoang Portfolio 2026  
**Last audited:** June 25, 2026, via Framer MCP, CMS item inspection, targeted page inventory checks, and local repo audit
**Published/staging URL:** `https://khaki-ship-257706.framer.app`  
**Public-domain note:** `https://micahhoang.info` has historically served the Cargo site during recent audits. Treat the Framer URL above as the current redesign/build surface until domain cutover is explicitly confirmed.

This is the quick source of truth for the active Framer project and local handoff repo. Old one-off handoff/audit docs were deleted on June 2 so future agents do not follow stale repair paths. When docs disagree, this file wins.

---

## 2026-06-25 Update

- **`/play` CMS-only contract.** `ArchivePlayground.tsx` no longer contains or
  renders the baked 32-item Play snapshot. Live mode now resolves Play data in
  this order only: `window.__articaPlayArchiveRegistry` rows from
  `PlayArchiveRegistrar`, then a generated Framer CMS module for `Play Archive`
  (`EySMRbI2N`) if Framer emits one, then empty state. The Framer `Archive Items`
  array remains available through `Play.tsx` for canvas preview/rollback and
  now defaults to empty; it is not a published content fallback. CMS rows also no longer generate
  fallback drawer copy such as "Image from the archive"; empty `Content`
  renders no description paragraph.
- **`PlayArchiveRegistrar.tsx` added** (`jDwcdGN`, insert URL
  `https://framer.com/m/PlayArchiveRegistrar-uZVoh9.js`; current `/play`
  scaffold node `jHFyFgJNt`). This invisible bridge should be mounted
  inside a hidden-but-mounted `Play Archive` Collection List and bound to
  `Title`, `Order`, `Image / Poster`, `Video`, `Stroke`, and `Content`. The list
  must not be hidden with Framer's eye toggle and its limit must include every
  CMS row. Full workflow: `play-cms-workflow.md`.
- **Radial reveal preserved.** The repo-side `/play` load-in still uses the
  June 24 center-out radial fade pattern (`LOAD_IN_LIFT_PX = 0`,
  `LOAD_IN_STAGGER_MS = 90`, Smooth ease, and `pt:reveal` WAAPI replay by card
  distance from viewport center). Do not replace it with random/hash scatter or
  a vertical lift.
- **`/play` detail drawer style update.** The drawer now defaults to a wider
  Ashfall-style panel (`50vw` on desktop, capped by the `Panel` control at
  `960px`, full-width below `700px`). Drawer title uses `/Text Gray`
  `rgb(110,110,110)` with the `/Paragraph Medium` 22px treatment; drawer
  `Content`/description uses the same gray with an 18px `/Paragraph Regular`
  treatment. This is a visual treatment only; source content still comes from
  the Play Archive CMS fields documented below.

## 2026-06-24 Update

- **Motion Connect controller consolidation.** `/case-studies/motion-connect-2025`
  (`ZYKsxrq7a`) now uses one hidden `CaseStudyControllers` instance on Desktop
  (`eHJ5dzLyY`) before `PageTransition` (`rVW2qgeah`) and `Main` (`cnnVXlYFT`).
  Removed the older standalone `CaseStudyLinkRepair` (`QaiMmRLMA`),
  `CaseStudyLightbox` (`wL6vLw1rT`), `CaseStudyVideoManager` (`bwRzDn0Jf`), and
  the ready-only `CaseStudyWorkInProgressGate` (`EM3WDlf0K`) from that page.
- **Controller import pin refreshed.** `CaseStudyControllers.tsx` now imports the
  current `CaseStudyLightbox` export
  `CaseStudyLightbox-yOYpGN.js@Cphhu4ZJ1CxHLPy7kC6e`; live Framer typecheck
  passed after the code-file update.
- **`/play` reveal reworked to soft / smooth / cinematic** (`Play.tsx` `PN1RVOf`,
  `ArchivePlayground.tsx` `QNpkYp5`):
  - **No more upward bounce** — `LOAD_IN_LIFT_PX` 12 → 0; the load-in is pure
    opacity now (no `translateY`).
  - **Ordered radial stagger** (center-out ripple) replaces the random
    `Math.random()` / hash scatter, in both the CSS load-in (`introDelayMs` by
    grid ring) and the `pt:reveal` WAAPI replay (by each card's distance from
    viewport center). Stagger bumped `LOAD_IN_STAGGER_MS` 58 → 90 (more
    pronounced).
  - **Canonical smooth ease** `cubic-bezier(0.12,0.23,0.5,1)` for the load-in +
    replay (was the snappy `0.16,1,0.3,1`). Interactions (hover/panel) keep
    `SNAPPY_EASE`.
  - **Stroke fades in WITH the media** — the per-card stroke `border` now lives
    on a container that holds at opacity 0 until the media is `ready`, so there
    are no blank stroke skeletons; stroke + media reveal as one unit.
  - **Media fade is smoother + slower** — switched to `SMOOTH_EASE`, floored to
    `Math.max(1000, mediaFadeMs)`; `mediaFadeMs` default 700 → 1100.
  - Verified live (published) via Playwright: zero card `translateY` across the
    whole reveal, ordered ripple (~99→6 not-started while mid-fade ramps to 80
    over ~1.6s), 0 console errors, panel open/close intact. **Stroke/media-fade
    changes pushed 2026-06-24, pending Publish.**
- **New `GrainOverlay` component (`MhR7Ukl`) for `/play` texture.** Subtle film
  grain locked in via a local "grain lab" sandbox (HTML + sliders over a real
  3200×2000 `/play` screenshot). Recipe: SVG `feTurbulence`, oxblood `#501d07`,
  multiply, `grainOpacity` 0.10, exposure −0.58, contrast 2.35, baseFrequency
  1.14, 4 octaves, animated 16fps. Portals a `position:fixed`,
  `pointer-events:none` layer to `<body>` (immune to transformed ancestors;
  mount-guarded for SSR; reduced-motion aware). **`clearNav`** (default on) starts
  the grain at the nav's live bottom edge and tracks it during the panel
  open/close slide, so the header stays clean with no exposed seam. Placed on
  `/play` Desktop (instance `JSrIX4EmY`); inherited across breakpoints. Mirror:
  `GrainOverlay.tsx`. Pending Publish.

## 2026-06-23 Update

- **New code component `TestimonialLineReveal` (`tpDdaaJ`).** Osmo-style line-mask
  testimonial built on the project system: GT Standard type, `/Off-Black` +
  `/Light Gray`, canonical `cubic-bezier(0.12, 0.23, 0.5, 1)` ease. Quote reveals
  line-by-line on scroll-into-view; name + role, **no profile photo**. Toggles for
  arrows (GT Standard ← → glyphs), counter, autoplay; blank eyebrow hides it; an
  `Advanced` switch hides colors/ease/sizing. **Responsive:** quote scales down at
  tablet/mobile from its own measured width (18px floor); long quotes get a mobile
  **Read more** collapse for legibility/a11y. Placed as a one-off on
  `/case-studies/airpods` (instance `fJKupkZPa`, arrows/counter off) carrying the
  real Nadia Shireen Husain (ACD, Apple) recommendation. Intended for reuse on
  `/info` with arrows on. Mirror: `TestimonialLineReveal.tsx`.
- **Case-study share/OG thumbnails.** Goal: every `/case-studies/:slug` share
  preview defaults to the CMS **Thumbnail** image (the hero/card thumbnail). All
  17 `All Projects` items now have a Thumbnail image **except** `rejuve`,
  `belly-bar`, `whatsapp` (WIP, no image and no thumbnail video to derive one).
  `peak-energy` had only a thumbnail video → a poster frame was generated from it
  (frame ~1.8s of `h3NSQj4n…mp4`) and set as its Thumbnail
  (`framerusercontent.com/images/JcoGr4ds2RlrOT9CCbYE5gnkvpY.jpg`). **OG image is
  still NOT set, verified 2026-06-23 against published HTML: no `og:image` on any
  page (no site-wide default either).** The case studies are bespoke shadow pages,
  not the `:slug` CMS template, so OG can't bind to the Thumbnail field — each needs
  a static per-page OG image (or a site default), set manually in Framer (MCP can't).
  Thumbnail URLs to paste are in `case-study-cms-workflow.md` §4b. CMS Thumbnail data
  is done; the OG binding is the outstanding half.
- **`DoubleStackGalleryGrid`** mirror added (new case-study gallery layout: two
  stacked media left + one tall right). Confirm its Framer codeFileId on import.

### A11y audit (Gaia, Simon & Schuster, AirPods, Peak Energy — published, 3 breakpoints)

Method: Playwright (system Chrome) at 1440/810/390 + axe-core (WCAG 2.1 AA) + DOM
metrics (tap targets, overflow, headings, alt, color). No horizontal overflow, no
broken layouts, no missing `<img alt>`, `lang=en`, no console errors anywhere.

**Fixed 2026-06-23:**
- **New `/Text Gray` color token = `rgb(110,110,110)` (#6E6E6E, ~4.6:1 on `/Cream`).**
  Applied to the **`/Paragraph Regular`** text style (the 18px case-study section
  body copy), which was `/Light Gray #979797` = **2.68:1 (fails AA)** across all case
  studies. The dark 22px `/Body` intro copy was left as-is (already passes). Done via
  `manageTextStyle` color-only update (custom-font gotcha only blocks font changes).
- **`TestimonialLineReveal`**: role/counter default → `#6E6E6E`; Read-more button now
  44px min hit area (Apple HIG); `aria-roledescription="carousel"` dropped for a
  single static quote (now `role=figure`). AirPods instance role/counter → Text Gray.

**Outstanding (Framer-side, design-system decisions):**
- **No `<h1>` on any page** — hero title is `/Heading 2` (h2), nav wordmark is h5;
  order skips h1. Make each case-study hero title an h1.
- **Sub-44px tap targets**: nav links (~13px tall), footer social links, carousel
  ‹ › arrows (30×30), scroll-to-top (16px tall). Pad hit areas to ≥44.
- **`link-name`**: the logo/icon link (empty 19×27 `<a>`) has no accessible name on
  Gaia + Simon — add `aria-label`.
- **Peak Energy hero text** runs words together ("GM,Announcing", "newera") because
  the line breaks ate the spaces — fix so SR/SEO read "new era", "GM, Announcing".
- **AirPods testimonial quote truncates** when set via MCP XML (~310 char cap, cuts at
  "…high quality work."). Paste the full Nadia quote in the Testimonials panel.
- OG image (see above).

---

## Current Framer Structure

### Web Pages

- `/` - Home, page ID `R6_F7xjGZ`
- `/404` - 404, page ID `koPvme2ig`
- `/case-studies` - Native case-study index, page ID `Rnw1WO1jS`
- `/case-studies/:slug` - Dynamic CMS fallback route, page ID `UlQco8cYi`
- `/case-studies/airpods` - Bespoke AirPods Pro 3 case-study page, page ID `LB7pYBD3k`
- `/case-studies/peak-energy` - Bespoke Peak Energy WIP case-study page, page ID `fgNnSwTVX`
- `/case-studies/simon-schuster` - Bespoke Simon & Schuster page, page ID `izKMx6JM4`
- `/case-studies/motion-connect-2025` - Bespoke Motion Connect page, page ID `ZYKsxrq7a`
- `/case-studies/national-park-cards` - Bespoke National Park Playing Cards page, page ID `Bt_XoCbyE`
- `/case-studies/yomo` - Bespoke Yomo page, page ID `FLIR8tPnz`
- `/case-studies/karuna` - Bespoke Karuna page, page ID `vrGS_iCmo`
- `/case-studies/gaia` - Bespoke Gaia page, page ID `AxmIWTuqB`
- `/case-studies/weaponized-innocence` - Bespoke Weaponized Innocence page, page ID `t5ZqCVgXQ`
- `/case-studies/typldn` - Bespoke TYPLDN page, page ID `uZgIX0d9O`
- `/case-studies/seek-truth` - Bespoke Seek Truth page, page ID `ghVZemnYZ`
- `/case-studies/cellular-symphony` - Bespoke Cellular Symphony page, page ID `F4kVWqVcV`
- `/case-studies/wolff-olins-x-artcenter` - Bespoke Wolff Olins x ArtCenter page, page ID `LrmGxP3EV`
- `/case-studies/independent-lens` - Bespoke Independent Lens page, page ID `N3bZoqp15`
- `/case-studies/rejuve` - Bespoke Rejuve WIP case-study page, page ID `NZ3DSAXip`
- `/case-studies/belly-bar` - Bespoke Belly Bar WIP case-study page, page ID `n740YSYm1`
- `/case-studies/whatsapp` - Bespoke WhatsApp WIP case-study page, page ID `UpcNhW2Dy`
- `/index` - Canonical archive page, page ID `u2LOaBT5q`
- `/play` - Archive media playground, page ID `KbgWr_0BN`
- `/info` - Editorial profile/info page, page ID `fxz_zRIyp`

No current Framer web page is exposed for `/profile`, `/contact`, `/worldgrid-test`, `/play-2`, `/play-consolidation-draft`, `/playground`, or `/playground-scroll-draft`.

June 15 CMS parity update: the `All Projects` CMS roster has 17 items and each CMS slug now has a matching bespoke `/case-studies/{slug}` web page. `/case-studies/peak-energy` was created as a WIP case-study shell with the cleared Peak Energy x GM handoff details; `/case-studies/rejuve`, `/case-studies/belly-bar`, and `/case-studies/whatsapp` were added as CMS-metadata WIP shells. The non-CMS orphan routes `/case-studies/neon-lights` and `/case-studies/aspen-valley-landscaping` were deleted in the earlier June 15 parity pass. The dynamic `/case-studies/:slug` route remains as the generic CMS fallback/template route, not as an additional project.

### Design Pages

- `Design`, design page ID `NLQmOR3If`

Older docs mention `Case Study Starter System` (`qDjep9bZD`), but it is not in the June 2 Framer MCP project inventory.

### Native Components

Current reusable component inventory from Framer MCP:

- Footer
- Open Navigation Link
- Logo Link
- Case Study
- List View
- Index Component
- Awards Row
- List View - Image
- Case Studies Filter
- Article Tile
- Scroll More
- Social Links
- Line Animation
- Text Link
- Navigation
- View project
- Clipboard
- Button
- ButtonQuickTransition
- Address Link
- Contact
- Image Carousel
- Other Project Card

### Code Components

Framer code components relevant to this handoff include:

| Code file | ID | Current role |
|---|---|---|
| `TextEncryptionEffect.tsx` | `p7tSTaD` | Home social-label scramble effect. |
| `Counter.tsx` | `hdPa_Gj` | `NumberCounter` used on `/case-studies`; implementation was hardened May 26, but the page prop still controls the visible count. |
| `IndexPage.tsx` | `rgAZFOv` | Base CMS-backed `/index` List/Grid archive component, imported by the mounted wrapper. Keep as the archive data/rendering source. |
| `IndexPageGridPreview.tsx` | `LgIzFjJ` | Mounted `/index` wrapper, exported/displayed as `IndexPage` despite the filename. Imports `IndexPage.tsx`, exposes the Framer `View` control, forces List/Grid remounts for canvas preview, and pins the Figma grid/list responsive overrides. |
| `ProfileTextRevealFix.tsx` | `LNjgKO2` | `/info` text reveal helper. |
| `FooterCopyrightYear.tsx` | `BF2H03E` | Footer year helper. |
| `Test.tsx` | `O9WTdUJ` | Misleading filename; exports the legacy `ProjectRegistrar` CMS registry bridge. Kept as fallback. |
| `CaseStudyThumbnailStrokeStyles.tsx` | `Z28JYvA` | CMS-driven thumbnail stroke helper on Home, `/case-studies`, and `/index`. |
| `ResumeAssetHost.tsx` | `xDqfenf` | Footer/resume compatibility utility; keep because Footer still references the expected prop shape. |
| `Play.tsx` | `PN1RVOf` | Active `/play` production wrapper. Keeps protected Framer authoring controls through `Archive Items` / `archiveItems` as fallback/rollback, and passes managed media plus load-in timing to `ArchivePlayground.tsx`. Do not remove this authoring surface or replace it with unrelated static media. |
| `ArchivePlayground.tsx` | `QNpkYp5` | Underlying `/play` archive renderer as of June 8. Consolidated grid, drawer, media smoothing, footer hiding, nav passthrough, close timing, attempted Play Archive CMS loading, fallback panel items, and baked snapshot rendering live here. Must continue accepting authorable item arrays from the production wrapper. |
| `ArchivePlaygroundConsolidated.tsx` | `D5YVims` | Unmounted earlier consolidation attempt. Keep only as rollback/historical material unless intentionally revived. |
| `ArchivePlaygroundConsolidatedDraft.tsx` | `aEyj7Rq` | Legacy draft mirror code file. The `/play-consolidation-draft` web page is not present in the June 15 Framer inventory. |
| `PlaygroundNavPassthrough.tsx` | `RBX6jsP` | Legacy `/play` helper. Instance remains on the live `/play` canvas with `enabled=false` after the June 8 promotion. |
| `PlaygroundRuleExitGuard.tsx` | `vdg69JZ` | Legacy `/play` helper. Instance remains on the live `/play` canvas with `enabled=false` after the June 8 promotion. |
| `OtherProjectCardRestored.tsx` | `vlwa5Cz` | Related-project card restoration helper. As of June 10, it hydrates thumbnail, thumbnail video, and thumbnail stroke from `All Projects` by slug/title, with the author-entered image/video props retained as fallback. |
| `PlaygroundInstantExitSnapshot.tsx` | `c2PU6kX` | Legacy `/play` helper. Instance remains on the live `/play` canvas with `enabled=false` after the June 8 promotion. |
| `PlaygroundSidebarColumnGuard.tsx` | `R3ZWYKl` | Legacy `/play` helper. Instance remains on the live `/play` canvas with `enabled=false` after the June 8 promotion. |
| `PlaygroundNavExitHold.tsx` | `iivBAHR` | Legacy `/play` helper. Instance remains on the live `/play` canvas with `enabled=false` after the June 8 promotion. |
| `PlaygroundMediaLoadSmoother.tsx` | `FFqrKyU` | Legacy `/play` helper. Instance remains on the live `/play` canvas with `enabled=false` after the June 8 promotion. |
| `ScrollToTopButton.tsx` | `gh4ngZN` | Scroll-to-top helper used on Home and `/info`. |
| `InfoScrollMoreColorOverride.tsx` | `AZDGWx7` | `/info` Scroll More color override. |
| `ResponsiveCaseStudyVideo.tsx` | `bsTLKCt` | Case-study media helper for responsive video blocks. |
| `ResponsiveCaseStudyImage.tsx` | `vIFnGmg` | Case-study media helper for responsive image blocks. |
| `SeekTruthCargoSlideshow.tsx` | `BgeH0il` | Seek Truth slideshow/media helper. |
| `TypldnProcessGallery.tsx` | `jFSLix7` | TYPLDN process/gallery helper. |
| `CaseStudyScrambleText.tsx` | `dHFQCIH` | **Misnomer — NOT a scramble effect.** A plain hover-color text link (color→hoverColor) for case-study CTAs; display name set to "Case Study Header Link" (2026-06-18). `characters`/`interval` props are vestigial/hidden. Real scramble = `TextEncryptionEffect.tsx` (`p7tSTaD`). Rename file in UI if desired (binding is componentId-based). |
| `CaseStudyJustifiedMediaGrid.tsx` | `c0iPrbN` | Bespoke case-study justified media grid helper. |
| `FixedHeightMediaRows.tsx` | `IthLMt_` | Karuna fixed-height process gallery helper. |
| `SimonSchusterGuidelinesCarousel.tsx` | `tYFZCey` | **Reusable `ImageCarousel`** (default export renamed 2026-06-04; filename unchanged because MCP can't rename code files). General-purpose fade carousel + GT Standard `‹ ›` arrows — recycle for any case-study gallery. First used on Simon & Schuster. **As of June 10 it no longer ships its own lightbox** — gallery slides open in the page-level `CaseStudyLightbox` (see "Reusable Image Carousel" below). |
| `HomeSelectedWorkGrid.tsx` | `FecepLS` | Home selected-work grid. Renders the six CMS/default selected projects with direct `/case-studies/{slug}` anchors, image/video media fallback, CMS-driven thumbnail strokes, and Category 1/2/3 tag pills. |
| `CaseStudyLinkRepair.tsx` | `y6ny5x4` | Legacy route-repair helper. The Home instance `uxp3mYNsy` is disabled after `HomeSelectedWorkGrid.tsx` replaced the broken native Home selected-work grid; use `CaseStudyControllers.tsx` for new bespoke page controller mounts. |
| `CaseStudyLightbox.tsx` | `F2K4_SV` | Case-study lightbox subcontroller. Prefer the consolidated `CaseStudyControllers.tsx` wrapper for page-level mounts. **June 10 updates:** (1) opt media out of the lightbox by naming any wrapping frame `No Lightbox`/`NoLightbox` (force-merged into every instance's Exclude rule, so no per-instance setup; wrap the whole media, not the leaf img); (2) the lightbox-suppression logic is a single `window`-capture click listener (fires before the base engine's `document`-capture listener) — native links navigate (`stopImmediatePropagation`, no `preventDefault`), buttons/scroll-to-top keep their own React `onClick` (`preventDefault` only), other excluded regions are fully suppressed; (3) gallery slides open in this lightbox (the carousel's own overlay was removed); (4) **nav-overlay click fix** — clicking a nav item that physically overlays media now navigates instead of opening the lightbox, handled by the event guard ALONE. All nav **CSS mutation was removed** (`z-index`, `pointer-events`, `isolation:isolate`, inline style mutation, the `data-case-study-nav-layer` stylesheet): it never fixed the click (the base engine reaches media *under* the nav via `elementsFromPoint`) and it broke the nav hover/flip-text reset. **Versioning gotcha:** `CaseStudyControllers` imports this lightbox at a PINNED `@hash` — bump that hash whenever this file is republished, or controller pages keep loading the old lightbox. Current published version: `@Cphhu4ZJ1CxHLPy7kC6e`. |
| `CaseStudyVideoManager.tsx` | `rGMwETR` | Case-study autoplay video subcontroller. Prefer the consolidated `CaseStudyControllers.tsx` wrapper for page-level mounts. |
| `CaseStudyControllers.tsx` | `z13WRHS` | Active hidden wrapper for the useful bespoke case-study controllers: lightbox, video manager, and link repair. Mounted on accessible bespoke pages where the three separate controller instances were consolidated. |
| `CaseStudyMobileDescriptorLayout.tsx` | `W62Sy75` | Case-study mobile descriptor layout helper. Mounted on bespoke case-study pages that need the compact descriptor rhythm, including the Peak Energy WIP shell. |
| `NavigationScrollGuard.tsx` | `Wnd19lx` | Hidden child of the native `Navigation` component (`I0Wh3P9o8`). Keeps the nav visible/clickable at page top if Framer's scroll-hide transform gets stuck after scrolling down and returning to `scrollY=0`. |

June 8 cleanup: `CaseStudyThumbnailVideoSync.tsx` (`qONpo1v`) was removed from Home, `/case-studies`, `/index`, and `/case-studies/aspen-valley-landscaping`, then deleted from Framer after its mounted behavior was consolidated into the existing page/component thumbnail video paths. `RelatedProjectHoverZoom.tsx` was also removed from the local repo; it was a historical mirror and is not present in the current Framer MCP code-component inventory.

June 10 cleanup: the former public editorbar guard was removed from known mounted pages, deleted from the Framer code-file inventory, and removed from the local mirror. It is no longer part of the current public page baseline.

June 11 post-publish QA note: Framer's own `#__framer-editorbar-container` / `#__framer-editorbar-label` overlay still appeared on anonymous public routes after publishing the boot identity update. `PageTransition.tsx` now suppresses that Framer-injected editorbar in its globally installed CSS, instead of recreating the removed guard component.

June 10/24 controller cleanup: the bespoke case-study pages AirPods, Simon & Schuster, Motion Connect 2025, National Park Playing Cards, Yomo, Karuna, Gaia, Weaponized Innocence, and TYPLDN now use one hidden `CaseStudyControllers.tsx` (`z13WRHS`) instance instead of separate `CaseStudyLinkRepair.tsx`, `CaseStudyLightbox.tsx`, and `CaseStudyVideoManager.tsx` mounts. Motion Connect's consolidated instance is `eHJ5dzLyY`; its old standalone helper layers and ready-only WIP gate were deleted on June 24. Seek Truth, Cellular Symphony, Wolff Olins x ArtCenter, and Independent Lens still need verification/migration if they should use the wrapper.

June 10 scroll-to-top fix: `ScrollToTopButton.tsx` (`gh4ngZN`) did nothing on published case-study pages because the old `CaseStudyLightbox` click guard (`document`-capture `stopImmediatePropagation` on every excluded element, `button` included) killed the button's own React `onClick` before it ran. Fixed by the guard rewrite noted above (window-capture + preventDefault for interactive controls). Verified live on Motion Connect 2025 (scrollY → 0). This applies to every case-study page that carries the lightbox/controllers instance, so the button can be rolled out site-wide without per-page work.

June 10 build-error resolution: a leftover orphaned instance of the deleted editorbar guard (former code file `ztNOibx`) remained on `/info` (plus `/404` and `/case-studies`) and failed the publish optimizer with `ssg-module-not-found` / `MISSING_EXPORT "default"`. All three orphaned instances were removed (check every breakpoint — the `/info` one survived on a non-Desktop breakpoint); optimization status is back to `optimized`. Re-creating the code file would NOT have fixed it (a new file gets a new id, so the dangling `ztNOibx` import still wouldn't resolve) — removing the orphaned instances is the correct fix.

June 10 related-project thumbnail fix: the AirPods "Other Projects" Gaia card was rendering the static `thumbnailSrc` prop (`1a1LDlRx4V2kNoG7kX7hvWygUCg.jpg`) while the CMS/Home/Index source of truth had Gaia's thumbnail as `XBEu3UkNu8Hm5CPrgksq7wtmbw.gif`. `OtherProjectCardRestored.tsx` now resolves the generated `All Projects` CMS module (`yTHrQWMIY`) and replaces card media/stroke from CMS when a matching slug/title exists; manual props remain fallback values. Publish the Framer site after this code-file update before expecting `khaki-ship-257706.framer.app` to reflect the new component bundle.

June 10 nav scroll guard: reproduced a native Navigation bug on Home where scrolling down and back to the top left the fixed nav inline-styled as `transform: perspective(1200px) translateY(-64px)` even at `scrollY=0`, making the visible header links unhoverable/unclickable. `NavigationScrollGuard.tsx` is mounted inside the reusable `Navigation` component and only forces the nav transform back to `translate3d(0,0,0)` while the document is within 4px of the top. It intentionally skips `/play`'s temporary `playground-nav-exit-hidden` close animation class so the archive drawer reveal can still run.

#### Play page consolidation — active as of June 8, 2026

`/play` (`KbgWr_0BN`) currently uses the production wrapper `Play.tsx` (`PN1RVOf`) around `ArchivePlayground.tsx` (`QNpkYp5`). The promoted archive was copied from the working `/play-consolidation-draft` build and now owns the archive grid, detail drawer, rotating Close text, slide-down nav reveal after close, media fade/stroke behavior, footer hiding, nav passthrough behavior, and content editing controls.

The fallback/rollback authoring surface is non-negotiable. `Archive Items` must remain editable in Framer with upload, reorder, title, description, category, aspect, and stroke controls. Do not remove the `archiveItems` / `items` managed-item path, replace the archive with unrelated hardcoded-only media, hide these controls behind `Advanced`, or route future edits through detached static JSX/media layers. If the prop name changes, preserve legacy `items` as a runtime fallback and migrate the visible Framer control so existing page overrides cannot blank the archive.

June 11 Play load-in update: `ArchivePlayground.tsx` intentionally paints the root as blank Cream first, keeps the gallery inert/transparent while a browser View Transition is active, then releases the archive grid after a short Cream hold. `PageTransition.tsx` also sets `data-playground-force-blank` before navigating to `/play`, so the incoming snapshot stays blank even if the archive grid was already preloaded. The advanced controls `Load Hold`, `Load Fade`, and `Load Max` tune the archive intro timing; do not remove the hidden first frame unless the site-wide page transition model changes.

June 11 authorability repair, updated June 25 for CMS-only cleanup: `Play.tsx` uses visible `Archive Items` controls backed by the `archiveItems` prop as the Framer editor surface while still accepting legacy `items` so stale page-instance props cannot erase content. The old baked default `RAW_ITEMS` seed path has been removed; `Archive Items` now defaults to an empty array and should not contain live content unless someone is intentionally using it for canvas preview or emergency rollback. Publish Framer after code-file changes before checking staging, because the public route can keep serving the previous component bundle until publish completes.

June 13 detail nav behavior: `ArchivePlayground.tsx` owns the `/play` detail-drawer nav state. Opening an item must call the existing nav exit hook to apply `playground-nav-exit-hidden` and slide the native nav above the viewport so the drawer Close button is unobstructed; closing the drawer must release that class immediately and let the nav transition back in. Keep the `Nav Hide`/`navHideOffset` control wired through `Play.tsx` to `ArchivePlayground.tsx` instead of adding another helper component.

June 18, 2026 motion-ease follow-up: Framer readback showed `ProfileTextRevealFix.tsx` (`LNjgKO2`) and `PlaygroundMediaLoadSmoother.tsx` (`FFqrKyU`) still had the legacy `cubic-bezier(0.22, 1, 0.36, 1)` decel curve. Both live Framer code files now use local `SNAPPY_EASE` constants plus runtime normalization for saved legacy prop values. Current readback insert URLs are `https://framer.com/m/ProfileTextRevealFix-Rb9wbB.js@Uvy5PFTO3rssTlXNLk9w` and `https://framer.com/m/PlaygroundMediaLoadSmoother-wfvXvN.js@INAsxIPMxQsSK86hCQNv`. Local editable TSX mirrors were also normalized for legacy decel, symmetric/generic ease, and panel-close curves; generated `framer-code-mirror` compiled snapshots remain reference-only until regenerated. The broader live-Framer ease canon is Snappy for decel, Smooth for symmetric/UI, and Springy `cubic-bezier(0.25, 1, 0.5, 1)` only for Image Trail's gestural cursor animation.

June 24 Play Archive CMS audit, superseded June 25 by CMS-only bridge work: the target content source is the user-managed `Play Archive` CMS collection (`EySMRbI2N`). Editable fields are `Title` (`XwW7XD5jI`), `Order` (`c2qQhVGwP`), `Image / Poster` (`uqRtTdRM1`), `Video` (`KWCosE6Ef`), `Stroke` (`vq9I0excy`), and drawer/sidebar copy from `Content` (`vxCKd8ka_`). The June 24 published `/play` matched CMS title/media for the 32-row snapshot but did not prove live CMS loading: the page did not load a separate `EySMRbI2N` module, the hidden native list was capped at 10, and drawer copy was generated fallback text. The June 25 contract removes the baked snapshot and requires the `PlayArchiveRegistrar` bridge or generated CMS module before live content appears.

The legacy helper instances (`RBX6jsP`, `vdg69JZ`, `c2PU6kX`, `R3ZWYKl`, `iivBAHR`, `FFqrKyU`) remain on the live `/play` canvas as rollback material, but each is set to `enabled=false`. The earlier `/play-consolidation-draft` web page is not present in the June 15 inventory; create a new draft/design page before future Play experiments.

**June 18, 2026 framework-audit Phase 1 retirement:** the four unmounted Play draft/consolidation code files were deleted from the Framer code-file inventory — `ArchivePlaygroundConsolidated.tsx` (`D5YVims`), `ArchivePlaygroundConsolidatedDraft.tsx` (`aEyj7Rq`), `PlayAccessibilityDraftPatch.tsx` (`IPugK6y`), and `PlayDraftViewportFix.tsx` (`uO7AzzY`). The six `Playground*` Gen-1 helpers were ALSO deleted (`RBX6jsP`, `vdg69JZ`, `c2PU6kX`, `R3ZWYKl`, `iivBAHR`, `FFqrKyU`) — their previously-disabled `/play` instances were already gone (confirmed in the Framer UI on June 18), so the orphaned code files were removed. Faithful backups of all 10 (compiled snapshots + editable `ArchivePlaygroundConsolidated.tsx` + README with insert-URL/version-history rollback paths) are committed at `_archive/retired-play-helpers-2026-06-18/`. **Publish Framer to apply;** if the optimizer ever throws `ssg-module-not-found`, a stray instance survived on a breakpoint — hunt it or restore from backup.

#### Reusable Image Carousel — recycle this for new case studies (added 2026-06-04)

`SimonSchusterGuidelinesCarousel.tsx` (code file `tYFZCey`, default export **`ImageCarousel`**) is a **general-purpose, reusable** component despite its filename — the filename is misleading because Framer MCP cannot rename code files (rename in the Framer UI if wanted; safe, since instances bind to componentId `codeFile/tYFZCey:default`). **For any future case study that needs an image gallery/slideshow, reuse this instead of writing a new helper.**

Features: cross-fade autoplay (pause on hover), optional dots/counter, media-height layout, explicit height controls, optional manual crop controls, and prev/next arrows set in the site typeface (GT Standard `‹ ›` guillemets via `"GT Standard L Regular"` — verified that webfont carries U+2039/203A; the *Trial* weights do not). The `Height` control can be `Fit Media` (default; component creates its own measurable height from the current media/crop ratio), `Layer Height` (fills the Framer layer height), or `Custom Ratio`. The component uses a normal-flow ratio spacer in fit/custom modes so the Framer canvas does not collapse around absolutely positioned slides. By default (`Crop = None`), the carousel height comes from the slide media at the current responsive width, with the `Aspect` value used only as the pre-load/empty-state fallback so wide image sets do not sit inside a taller fixed-ratio frame. For uploaded mockups with baked-in canvas/whitespace, set `Crop = Manual`; use `Crop Tightness` as the quick vertical crop-height control, then tune `Crop Top`, `Crop Bottom`, `Crop Left`, and `Crop Right` for fine positioning. Gaia's Visual Identity carousel (`uTgsxFYA0`) uses `sourceMode="manifest"` with the 15 Framer-hosted slide URLs in `slidesData`, plus manual top/bottom crop because its 7200x4400 book mockups have tan canvas baked above and below the book.

**Lightbox behavior (changed June 10):** the carousel no longer renders its own fullscreen overlay — that was colliding with the page-level `CaseStudyLightbox`. Instead, only the *visible* slide is hit-testable (`pointer-events:auto`; inactive slides are `pointer-events:none` but stay in the DOM), so a single click opens the on-screen slide in the same lightbox as any other image, and the lightbox's ‹ › cycle the whole gallery (all slides are collected) before flowing into the rest of the page's media. Set the instance's `Lightbox` control to **Off** to mark slides `[data-no-lightbox]` and opt the gallery out entirely. Requires a `CaseStudyLightbox`/`CaseStudyControllers` instance on the page. Verified live on Gaia + Simon & Schuster.

Two ways to supply slides (instance props):
- **`sourceMode="manifest"` + `slidesData`**: one slide per line, `imageUrl|alt`. **Scriptable via MCP** — set the entire list in a single `updateXmlForNode` call. Use this when an agent is populating images.
- **`sourceMode="images"` + `slides` array**: native image-picker with drag-to-reorder thumbnails. **Cannot be set via MCP** (Framer silently drops Array/ResponsiveImage instance props); must be filled in the Framer UI. The component falls back to the manifest while the array is empty, so both can coexist during migration.

**Image hosting / de-cargo rule:** host slide images on Framer's own CDN (`framerusercontent.com`), never cargo. To move local/external images onto Framer's CDN via MCP: optimize (`sips -Z 1800 -s format jpeg -s formatOptions 82`), upload to litterbox (`litterbox.catbox.moe`, catbox returns 500s) for a temp URL, then set that URL as a throwaway frame's `backgroundImage` — Framer rehosts it and the `updateXmlForNode` response returns the permanent `framerusercontent.com/images/HASH.jpg` URL to harvest. Batch ≤16 frames per call (more times out at 30s); Framer dedupes identical bytes; the CDN URLs persist after the temp frames are deleted.

Code files removed from the Framer project on May 26 because they were not mounted in the current page/component structure:

- `IndexFilterNavDraftPage.tsx` (`f7taGoh`)
- `IndexListCursorPreview.tsx` (`MRqxy_8`)
- `CaseStudyRevealTuner.tsx` (`fo5zjFT`)

### Code Overrides

Framer still lists five code override files:

- `Examples_1.tsx`
- `Weather.tsx`
- `Copyright_year.tsx`
- `External.tsx`
- `Copyright.tsx`

Treat these as legacy/template compatibility files unless a future Framer inspector pass proves an active override dependency. Do not delete them casually; Framer publish validation can still care about old override export names even when the visual canvas does not.

---

## Current CMS State

The `All Projects` CMS collection (`yTHrQWMIY`) contains 17 real project records and no Jacob Turner sample/template records.

| Sort | Project | Slug | Year | Home flag |
|---:|---|---|---|---|
| 1 | Gaia | `gaia` | 2026 | true |
| 2 | AirPods Pro 3 | `airpods` | 2025 | true |
| 3 | Peak Energy | `peak-energy` | 2026 | true |
| 4 | Simon & Schuster | `simon-schuster` | 2025 | true |
| 5 | Motion Connect 2025 | `motion-connect-2025` | 2025 | true |
| 6 | National Park Playing Cards | `national-park-cards` | 2019 | true |
| 7 | Yomo | `yomo` | 2024 | false |
| 8 | Karuna | `karuna` | 2025 | false |
| 9 | Weaponized Innocence | `weaponized-innocence` | 2024 | false |
| 10 | Wolff Olins x ArtCenter | `wolff-olins-x-artcenter` | 2024 | false |
| 11 | Cellular Symphony | `cellular-symphony` | 2024 | false |
| 12 | Seek Truth | `seek-truth` | 2024 | false |
| 13 | Independent Lens | `independent-lens` | 2023 | false |
| 14 | TYPLDN | `typldn` | 2023 | false |
| 15 | Rejuve | `rejuve` | 2025 | false |
| 16 | Belly Bar | `belly-bar` | 2025 | false |
| 17 | WhatsApp | `whatsapp` | - | true |

The `Journal` CMS collection still exists, but there is no visible Journal page in the current Framer project map.

### Field IDs Used By Current Workflows

- `oeXZcmPna` - Title
- `DLBifmgp1` - Sorting Number
- `kuvJcmOFr` - Category 1 / Service 1
- `VV1CggU2J` - Category 2 / Service 2
- `E6OpH0hSs` - Category 3 / Service 3
- `Jy7hBJady` - Thumbnail
- `WG62tRjG8` - Thumbnail Video Link, retired text field
- `QZqSK_3OF` - Year, stored as a string
- `fsFlSPDTa` - Image 2
- `mBIilFqVM` - Industry
- `myUIfK0j7` - Is Homepage
- `SvOqFqdby` - Thumbnail Video, File upload
- `OHdUYs6Mo` - Thumbnail Stroke

June 15 schema note: Framer MCP no longer reports the older expanded content/credits/next-project fields in `All Projects`, and current CMS items expose the canonical slug as `item.slug` rather than a field value. Existing code can keep the old optional slug field fallback (`pdXVG_fBO`) as long as it falls back to `item.slug`.

Recommended manual additions remain `Case Study URL` and `Build Status`. Add those in Framer only if the workflow needs them; do not repurpose existing field IDs.

June 1-2, 2026 thumbnail stroke and Home link/media fix: the current generated `All Projects` CMS module exports the collection under `r` with legacy `a` absent. `CaseStudyThumbnailStrokeStyles.tsx` (`Z28JYvA`) now scans `a`, `r`, `default`, and object exports for `collectionByLocaleId.default.scanItems()` before reading `OHdUYs6Mo`. On June 2, helper instances were updated to use Framer item slugs directly (`slugFieldId=""`) and the old AirPods-only URL override was cleared. The Home selected-work link/media issue was fixed by replacing the broken native Home selected-work grid with `HomeSelectedWorkGrid.tsx` and disabling the Home `CaseStudyLinkRepair.tsx` instance. Before touching or publishing the stroke helper, run `node tools/check-thumbnail-stroke-resolver.mjs` to catch regressions back to the old `module.a`-only lookup.

June 18, 2026 Home tag-pill update: `HomeSelectedWorkGrid.tsx` reads Category 1/2/3 from `kuvJcmOFr`, `VV1CggU2J`, and `E6OpH0hSs` by default, exposed through the Framer `Tag Fields` property control. The visible pills are enabled by `Show Tags`, use the `Tags` color control defaulting to the existing Light Gray value (`rgb(151, 151, 151)`), and render in the same uppercase GT Standard Mono pill treatment used by the list/grid taxonomy surfaces: 13px on desktop, 12px on tablet, and 11px on the mobile/single-column breakpoint. Blank or duplicate category values are skipped, so CMS edits to project categories automatically update the Home selected-work pills after the generated CMS bundle refreshes.

June 15, 2026 Gaia CMS/Home verification: Framer MCP verified that Gaia item `Qw6kG4fCG` has slug `gaia`, `Is Homepage=true`, `Thumbnail Stroke=true`, and `Thumbnail=https://framerusercontent.com/images/3iHNvkSGZvQVJ7CTtlkZfzMmqmc.jpg`. AirPods Pro 3, Gaia, and Karuna currently have `Thumbnail Stroke` enabled; only Gaia and AirPods are in the first six homepage-visible projects.

---

## Major Custom Systems

### Home

Home is a native Framer page whose selected-work section is now rendered by `HomeSelectedWorkGrid.tsx` (`FecepLS`), mounted as node `h0ZkBCWe1` inside the `Projects` section (`k7gSpMtLR`). The component reads `All Projects` when the generated CMS module is available, falls back to its default project snapshot when needed, filters `Is Homepage`, orders by `Sorting Number`, and shows the first six items:

1. Gaia
2. AirPods Pro 3
3. Peak Energy
4. Simon & Schuster
5. Motion Connect 2025
6. National Park Playing Cards

WhatsApp is homepage-flagged but outside the first six by sort order. Yomo, Karuna, and Weaponized Innocence are off Home because their Home flags are false.

The old native `AllProjects` / `CaseStudy` Home grid lost reliable per-item bindings and showed AirPods data over every row after hydration. Do not restore that native Home grid unless the section is intentionally rebuilt in the Framer editor with verified CMS bindings. `HomeSelectedWorkGrid.tsx` owns direct anchors, image/video rendering, the hover label, the `Thumbnail Stroke` visual fallback, and the CMS Category 1/2/3 tag-pill row for the selected-work section.

Home About read-more contract, updated June 16, 2026: the `/info` click target is `SectionAbout > Paragraph > ButtonWrapper` node `TvfJmt1e6`. That wrapper may carry `link="/info"`, but it must not contain a linked `Text Link` component instance. Its visible child is a detached/native `TextLinkBlack` layer (`UpLdtDkH8`) created from the reusable `Text Link` component and then unlinked. `TextLinkBlack` is the 13px clipping window; its inner stack `uHhvuxijx` must remain `height="fit-content"` and `overflow="visible"` so the second `READ MORE` row can slide into view. The two text rows are `gtUBNGFea` and `FodWCgmfK`, both reading `READ MORE`. Do not replace this with a linked `TextLink` carrying `bwVWMSt6G="/info"` inside the linked wrapper, because Framer's optimizer reports that as a nested link. Do not add a new custom code component for this interaction; the existing `HomeSelectedWorkGrid.tsx` CSS targets the `Button Wrapper` / `Text Link Black` names and preserves the flip-up text plus portrait hover behavior. After edits, verify three states: Framer optimizer has no nested-link warning for Home, hovering the portrait still flips `READ MORE`, and hovering the text does not disappear.

Custom code on or affecting Home:

- `TextEncryptionEffect.tsx` for social-label scramble effects.
- `HomeSelectedWorkGrid.tsx` for selected-work card links and media.
- `CaseStudyThumbnailStrokeStyles.tsx` for CMS-driven thumbnail strokes in native/media contexts.
- `CaseStudyLinkRepair.tsx` legacy Home instance `uxp3mYNsy`, currently `enabled=false`.
- `ScrollToTopButton.tsx` for scroll return.
- Footer compatibility helpers, including the resume asset/year utilities.

June 2 published fix: the Home hero line was corrected from `mind.Strategy` to `mind. Strategy`, selected-work cards render six distinct projects, card thumbnails/text link to their canonical case-study pages, image thumbnails render for image-only projects, the profile image links to `/info`, and LinkedIn uses the external profile URL.

### `/index`

`/index` is the most custom page. Current active archive component stack is:

- `IndexPageGridPreview.tsx` (`LgIzFjJ`) - mounted on canonical `/index`, exported as `IndexPage`.
- `IndexPage.tsx` (`rgAZFOv`) - base archive component imported by the wrapper from `https://framer.com/m/IndexPage-msQHCf.js`.

`IndexPage.tsx` owns taxonomy filters, list rows, grid cards, project count, view state, and the inline `GRID / LIST` control. `IndexPageGridPreview.tsx` is the Framer-facing production wrapper: it passes `defaultView` through from the wrapper `View` property control, remounts the base component when the selected view changes so the Framer canvas can preview Grid and List, and applies the Figma layout overrides without duplicating CMS/data logic. The visible taxonomy is `/ Year`, `/ Service`, `/ Industry`; each group has its own `All` clear action. Grid view renders native HTML cards inside the base component rather than calling the native Framer `Case Study` module.

June 18, 2026 Figma grid promotion: canonical `/index` now uses the `IndexPageGridPreview.tsx` wrapper on the real page, not a separate preview page. The old `/index-grid-preview` page was deleted. The wrapper keeps `useCMS=true`, defaults the instance to Grid, and imports the same CMS-backed base component. It locks the Figma grid to 3 columns on desktop, 2 columns below 1200px, and 1 column at the same 899px container breakpoint where the index taxonomy/nav stacks. Cards stretch to the full content width with `max-width:none`, grid titles stay at the homepage-style 13px mono treatment above thumbnails, and CMS Category 1/2/3 tags render as Light Gray 12px uppercase mono pills under each thumbnail.

June 18, 2026 responsive alignment: list-view simplification now switches at the same 899px container breakpoint as the single-column grid. At and below that point, the list hides the left year indicator and service/industry/category columns, titles become left-aligned full-width rows, and year/row/bottom rules span the full content width. This keeps the List and Grid breakpoints visually connected with the index nav's single-column/tablet collapse.

June 11, 2026 index motion/style consolidation, updated June 18 for the Snappy/Smooth index ease canon: `IndexPage.tsx` now owns the responsive CSS, inline-toggle alignment, direct `.idx-grid-card-media > img/video` hover/focus scale, and the on-appear motion presets. The current Framer code file is the source of truth if the local mirror drifts. Snappy `cubic-bezier(0.16, 1, 0.3, 1)` owns decelerating reveals, fades, masks, hover transforms, and media scale; Smooth `cubic-bezier(0.12, 0.23, 0.5, 1)` owns symmetric rule draws and small UI state transitions. The top mono index nav (`/ Year`, taxonomy values, `GRID / LIST`, and `CLEAR FILTERS`) fades row-by-row with `INDEX_NAV_FADE_PRESET` (820ms, 120ms base delay, 92ms row stagger, Snappy) so labels/`All` actions enter first and values continue top to bottom. Larger index title/year surfaces such as list years (`2026`) and project titles (`Gaia`) use `INDEX_MASK_REVEAL_PRESET`: an overflow-hidden wrapper, inner text animated with WAAPI from `translateY(115px)` to `0`, 900ms, 90ms base delay, 90ms stagger, and Snappy, matching the shared Info-style type reveal rhythm enforced by `PageTransition.tsx`. Smaller mono metadata such as Service/Industry and grid meta fades in rather than masking. List titles/meta now use `INDEX_CONTENT_REVEAL_PRESET` so reveal timing continues through offscreen rows and bottom content is already animated when the user scrolls down. Grid thumbnails are wrapped by `GridMediaFrame` and fade with `INDEX_MEDIA_FADE_PRESET` (620ms, 140ms base delay, 58ms item stagger, Snappy) to match the case-study media feel. Rule/line drawing is viewport-triggered with WAAPI and slowed to 2200ms with Smooth so lines do not visually finish too early. Each fade, mask, and rule element uses `useIndexAppearTrigger`, which defers reveal by two animation frames so the hidden state paints before WAAPI starts, waits for `pt:reveal` during page transitions, and includes a page-level fallback reveal for offscreen list content. Already-revealed elements do not restart on `pt:reveal`, which prevents the `/play` -> `/index` double animation glitch. Reduced motion forces items visible and disables the animation. Keep this behavior inside `IndexPage.tsx`; do not add a hidden helper for it.

June 8, 2026 Motion Connect grid hover fix: live inspection showed the published `/index` CSS did not include the direct-child `.idx-grid-card-media > video` hover selector used by helper-generated thumbnail videos, so the Motion Connect video stayed visually static while the card title hover flip still worked. The current source keeps the direct `.idx-grid-card-media > img/video` hover/focus scale path in `IndexPage.tsx` and forces `scale(1)` under `prefers-reduced-motion: reduce`.

June 15, 2026 archive thumbnail video update: the live `/index` `IndexPage` instance reads `thumbnailVideoFieldIds="SvOqFqdby"`, so the `Thumbnail Video` File upload is the only active CMS thumbnail-video source. The older `Thumbnail Video Link` text field (`WG62tRjG8`) is retired and should not be used as a fallback. Thumbnail media policy is: `Thumbnail Video` wins over `Thumbnail`; `Thumbnail` is poster/fallback. The hidden `CmsLink` collection list remains mounted so Framer's generated CMS module is available. If the `ProjectRegistrar` bridge provides incomplete rows, `IndexPage` hydrates thumbnail, thumbnail video, and thumbnail stroke from the generated CMS module by slug/title before rendering the grid. The existing `CaseStudyThumbnailStrokeStyles.tsx` instance on `/index` (`szF9sZNWA`) remains configured with `syncThumbnailVideos=true`, `videoFieldId="SvOqFqdby"`, and `slugFieldId="pdXVG_fBO"` as a backup overlay path. AirPods Pro 3, Peak Energy, Motion Connect 2025, Wolff Olins x ArtCenter, and Cellular Symphony have populated `Thumbnail Video` File values (`SvOqFqdby`) on Framer's CDN. The published site needs a Framer publish/redeploy before canvas/CMS File-field changes appear in the generated CMS bundle. `IndexThumbnailVideoFallback.tsx` (`wvucZCT`) and its hidden node (`R9kqDJO7t`) were deleted from Framer; do not recreate a hardcoded per-project fallback helper.

June 1, 2026 CMS bridge note, revised June 8: `/index` includes a hidden-by-position CMS bridge layer, `CmsLink` (`AwTGGhR7I`), containing the `AllProject` collection item. Keep this collection layer **visible/mounted** in Framer's layer panel, but fixed off-canvas at `left="-202px"`, `width="1px"`, `height="1px"`, `opacity="0"`, `overflow="hidden"`, and locked, because it keeps Framer's generated CMS module available to `IndexPage`. If `ProjectRegistrar` (`I063adJ_h`) remains mounted, bind/pass the `Thumbnail`, `Thumbnail Video`, and `Thumbnail Stroke` fields or rely on `IndexPage`'s CMS-module hydration so registry rows cannot override richer CMS rows with stale media/stroke data.

Data priority with `useCMS=true` is:

1. Live `window.__articaIndexProjectsRegistry` data from `ProjectRegistrar`
2. Direct generated CMS module scan for `All Projects`
3. Manual `projects` prop

In CMS mode, `IndexPage.tsx` intentionally falls through to an empty array rather than the in-code `DEFAULT_PROJECTS` snapshot, so stale fallback labels cannot appear as live CMS content. `DEFAULT_PROJECTS` is only used when `useCMS=false`.

The previously mounted cursor-preview helper, `IndexListCursorPreview.tsx`, was removed May 26 because it was no longer present in the current `/index` page XML.

### `/case-studies`

`/case-studies` is the native Framer case-study index page with the `Case Studies Filter` native component and the following mounted code helpers:

- `Counter.tsx` (`NumberCounter`)
- `CaseStudyThumbnailStrokeStyles.tsx`
- `CaseStudyLinkRepair.tsx`

June 15 CMS sync: `All Projects` now contains 17 items. The visible `NumberCounter` on `/case-studies` is prop-driven; update it to `17` in Framer or replace it with a dynamic CMS count before publishing this CMS roster.

### `/play`

`/play` is the archive media playground. Active production code files:

- `Play.tsx` wrapper
- `ArchivePlayground.tsx` renderer

The helper stack that used to patch nav/pointer/media/close behavior remains in the Framer project and on the live canvas with `enabled=false`. Manage target content in the `Play Archive` CMS collection. The published site should not use baked/fallback snapshots; if content is missing after publish, inspect the `PlayArchiveRegistrar` bindings and the hidden Collection List limit before touching code. Create a fresh draft/design page for future component experiments before touching the production `/play` page.

### `/info`

Active code files:

- `ProfileTextRevealFix.tsx`
- `InfoScrollMoreColorOverride.tsx`
- `ScrollToTopButton.tsx`

The current page is an editorial forest-green profile page with selected experience, testimonials, recognition rows, and CTA sections.

### Bespoke Case Study Pages

Bespoke pages currently exist for all 17 CMS projects: Gaia, AirPods Pro 3, Peak Energy, Simon & Schuster, Motion Connect 2025, National Park Playing Cards, Yomo, Karuna, Weaponized Innocence, Wolff Olins x ArtCenter, Cellular Symphony, Seek Truth, Independent Lens, TYPLDN, Rejuve, Belly Bar, and WhatsApp. Peak Energy, Rejuve, Belly Bar, and WhatsApp are currently WIP shells behind `CaseStudyWorkInProgressGate`; Peak carries the source-of-truth snapshot content from the June 15 handoff, while the three newer shells carry CMS metadata only. Neon Lights and Aspen Valley Landscaping were removed from Framer because they are no longer in CMS.

Case-study media row rule (June 7, 2026): when a desktop case-study body row has one, two, or three media items, keep those items in a single row at tablet and phone breakpoints. Prefer native Framer layout controls: horizontal Stack/Grid, wrapping off, and no large mobile `minWidth` on the media wrappers. For existing media-grid code component instances that expose a stacking threshold, keep `forceSingleRow` enabled and lower `stackBelow` to the minimum allowed value (`240`) instead of creating a new component.

Common/custom helpers seen in the checked pages include:

- `OtherProjectCardRestored.tsx`
- `CaseStudyControllers.tsx`
- `CaseStudyJustifiedMediaGrid.tsx`
- `CaseStudyScrambleText.tsx`
- project-specific media/gallery helpers such as `FixedHeightMediaRows.tsx`, `TypldnProcessGallery.tsx`, and `SeekTruthCargoSlideshow.tsx` (note: `SimonSchusterGuidelinesCarousel.tsx` / code file `tYFZCey` is **no longer project-specific** — it is now the reusable `ImageCarousel`; recycle it for new galleries rather than writing a new helper. See "Reusable Image Carousel" in Code Components.)

The removed `CaseStudyRevealTuner.tsx` is no longer mounted in current XML and should not be described as part of the active AirPods page. `RelatedProjectHoverZoom.tsx` was also absent from the Framer code-component inventory and has been removed from the local repo.

---

## May 26 Cleanup

Safe cleanup completed without intended visual or interaction changes:

- Removed three unmounted Framer code components:
  - `IndexFilterNavDraftPage.tsx`
  - `IndexListCursorPreview.tsx`
  - `CaseStudyRevealTuner.tsx`
- Removed obsolete local-only/draft mirrors:
  - `CaseStudyRevealTuner.tsx`
  - `IndexFilterNavDraftPage.tsx`
  - `IndexListCursorPreview.tsx`
  - `IndexPageFilterNavDraft.tsx`
  - `IndexRuleColorOverride.tsx`
- Removed local `.DS_Store` artifacts.
- Hardened `Counter.tsx` in Framer without changing the visible design: bounded interval cleanup, safer IntersectionObserver cleanup, state reset on prop changes, and corrected property-control option labels.

No web pages, native Framer components, CMS records, text styles, color styles, or visible layout/motion settings were intentionally changed in this cleanup.

---

## Performance And Maintenance Notes

Safe to keep:

- `/play` legacy helper files should remain for rollback context, but their live instances are disabled after the June 8 consolidation promotion.
- `ResumeAssetHost.tsx` should remain because the Footer expects its prop/control shape.
- The five legacy override files should remain unless a Framer publish check proves they are fully unused.

Good future cleanup candidates:

- `CaseStudyThumbnailStrokeStyles.tsx` still has heavier CMS refresh/rescan behavior than ideal. It intentionally keeps a robust CMS export resolver for both legacy `a` and current `r` Framer module shapes. Optimize only after reading the live Framer file and confirming the canvas/editor stroke behavior remains identical.
- Future `/play` changes should start on a fresh draft/design page, pass visual parity checks, then be promoted into `ArchivePlayground.tsx` (`QNpkYp5`).
- `/case-studies` still displays a `NumberCounter` configured by page props. As of the June 15 CMS sync, the prop needs to be updated to `17` or replaced with a dynamic count before publish.
- Local TSX mirrors are partial. Framer is the source of truth for code files that exist only in the Framer project, especially `Counter.tsx` and any unmirrored rollback helpers.
- No tracked local TSX or `tools/*` file met the "100% safe to remove" bar in the June 2 stale-code audit. Framer code files often have no local import graph because they are mounted by Framer code-file ID.

---

## Verification Notes

For future audits, verify both surfaces:

- Framer MCP project inventory, because it reflects editor/project structure and code-file cleanup.
- Published/staging URL, because it reflects the currently published build and catches visual regressions.

May 26 visual QA against `https://khaki-ship-257706.framer.app` checked `/`, `/case-studies`, `/index`, `/play`, `/info`, `/contact`, and `/case-studies/airpods` at desktop `1440x1000` and mobile `390x900`. Browser diagnostics found no suspicious route issues: no horizontal overflow, no visibly broken loaded images, and no blank pages. Manual screenshot spot-checks covered Home, `/index`, `/play`, `/case-studies`, and the AirPods page on desktop/mobile. `/index` still showed the `GRID / LIST` control and Year/Service/Industry taxonomy, and `/play` still opened a visible detail sidebar when clicking a visible archive card.

June 1 stroke audit: published Home loaded `CaseStudyThumbnailStrokeStyles.DLdW5YsD.mjs` and `yTHrQWMIY.DrLdZk2a.mjs`; browser inspection showed the AirPods thumbnail had no generated overlay because the published helper looked only for `module.a`. Direct browser import of the same CMS module returned keys `n`, `r`, `t`, with AirPods `{ slug: "airpods", title: "AirPods Pro 3", stroke: true }` under `module.r`. The June 2 publish corrected the resolver shape and the Home selected-work rendering path.

June 2 final MCP/browser verification: Framer project inventory reports 23 web pages, 2 design pages, 23 native components, 29 code components, 5 override files, and 2 CMS collections. `All Projects` reports 16 records. Targeted page XML checks covered Home, `/case-studies`, `/index`, `/case-studies/airpods`, and `/case-studies/karuna`. Published browser QA against `https://khaki-ship-257706.framer.app/` confirmed Home renders six distinct selected-work hrefs (`airpods`, `simon-schuster`, `gaia`, `national-park-cards`, `motion-connect-2025`, `yomo`), thumbnail and text clicks land on the correct case-study pages, image-only thumbnails render as images, AirPods and Motion Connect render video, the Home profile image links to `/info`, and LinkedIn links externally.

Use `node tools/check-thumbnail-stroke-resolver.mjs` as the quick local regression guard for the stroke helper. It confirms the helper still uses Light Gray `#979797`, the CMS `Thumbnail Stroke` field, the current `module.r` CMS export shape, the legacy `module.a` fallback, and the shared resolver call.

Known non-blocking console noise remains: Framer logged recoverable React hydration warnings (`#422` / `#425`) and some aborted analytics/media requests during route changes. No page errors were recorded in this pass.

June 8 Play promotion QA: Framer MCP verified `/play` Desktop node `pRc4v8wUe` now mounts `ArchivePlayground` node `kgFbinZvY` backed by `ArchivePlayground.tsx` (`QNpkYp5`), with all six legacy helper instances set to `enabled=false`. Published-route browser QA at `https://khaki-ship-257706.framer.app/play` confirmed the production marker `data-playground-root`, 15 visible desktop cards with no broken visible images, 8 visible mobile cards with no broken visible images, no console errors, the rolling Close text structure, and the post-close off-canvas panel/nav passthrough state. Framer emitted only its own tree-mode fallback warnings.

June 11 page transitions, updated June 17 (and June 26): `PageTransition.tsx` (codeFile `gmalnRr`) is a thin wrapper over the compiled v7.12 runtime module, now pushed as `https://framer.com/m/PageTransition-br4HFc.js@6rhw21HPDnortGIQEN9n`; `/index` code file `rgAZFOv` is pushed as `https://framer.com/m/IndexPage-msQHCf.js@TTjkvY4y86uWzgMbhCgf`. **2026-06-26 update — supersedes the "native heading owns the title" note below:** the wrapper now drives the `/index` hero title and the home hero (`Micah Hoang` headline + tagline) UP on every nav arrival via `useIndexHeadingRiseOnArrival` / `useHomeHeroRise` (manual setInterval rise that cancels Framer's late native appear each frame), because v7.12's `data-pt-index-heading-hold` released the title only after the view transition, making it read as "coming in late." The companion `IndexPage.tsx` change un-gates `revealForPageTransition` from `indexViewTransitionActive()` and adds a `__ptRevealedAt` race-catch + a `deferHeavyContentReady` grid defer. The full v7.12 runtime source is preserved as `PageTransition.runtime-backup.tsx`. Full details: framer-page-transition.md. The normal public URL still needs a Framer Publish before the final current-draft timing can be verified live. Cross-document View Transitions and same-document router transitions still share the same sheet animation for normal routes (destination page slides up over the dimming/drifting old page; nav exits up and re-enters as its own transition group; Speculation Rules document prefetch). v7.9/v7.10 deliberately disables page transitions for every navigation entering or leaving `/case-studies` / `/case-studies/*`: same-document case-study clicks return before `preventDefault()` / `document.startViewTransition()`, case-study documents install `@view-transition { navigation: none; }`, and `pageswap` skips any remaining cross-document transition fallback. v7.12 keeps the `/index` `data-pt-index-heading-hold` only as a route-level safety pin, releases it without running another custom heading animation, and skips the top `Index` heading from generic appear replay so Framer's native heading animation owns the title. The first-boot home loader uses a Forest Green curtain with an 8px Cream top progress bar and centered `Micah Hoang ©2026` identity before the curtain swipes up to reveal the loaded page. The identity text matches the Home hero descriptor's `/Heading 3` style: GT Standard L Regular, 400 weight, 120% line height, -0.01em tracking, and responsive sizes of 30px desktop / 24px tablet / 19px mobile. The earlier v1-v4 click-intercept curtain implementations remain retired. Placed as first child of the Desktop root on every published route: home, `/info`, `/index`, `/play`, `/case-studies`, `/case-studies/:slug`, `/404`, and all 17 bespoke case studies. `/contact` was an unpublished draft and has been deleted from the project. Full details: framer-page-transition.md.

June 12 transition investigation: published staging was initially serving v7.6-style Speculation Rules with `prerender` for `/case-studies/*` from Home and `prerender` for `/`, `/index`, `/play`, `/info`, plus sibling case studies from case-study pages. That matched the likely footer/white-flash artifact: prerender activation can expose a not-yet-settled Framer page. `PageTransition.tsx` first moved to the v7.7 prefetch-only correction, then v7.9/v7.10 removed the page-transition choreography from case-study legs entirely. Final in-app retest clicked the actual Home AirPods card and the case-study Work nav link on the live bundle: Home had `navigation:auto` and no eager `/case-studies/*` rule; AirPods had `data-pt-case-study-transition="off"` and `navigation:none`; returning Home restored `navigation:auto`. Rapid samples during both clicks reported `:active-view-transition === false`, and every return sample reported `footerVisible === false`. Screenshots: `output/playwright/case-study-transition-bypass-2026-06-12/iab-real-01-home-before.png`, `iab-real-02-airpods-after.png`, and `iab-real-03-home-after.png`. `OtherProjectCardRestored.tsx` was also pushed earlier so its CSS `<style>` no longer lives inside the card `<a>` and now uses `suppressHydrationWarning`; remaining React #422/#425 hydration warnings still point at generated style tags in multiple Framer code components and should be handled as a separate cleanup pass.

June 11 home re-entry timing, updated June 17: `PageTransition.tsx` v7.12 still releases Home appears earlier (`HOME_RELEASE_AT`), but long masked type reveals are no longer Home-only special cases. `Micah Hoang`, the Home descriptor, and other long native type masks share the Info-style 900ms / 90ms Snappy type reveal profile. Direct Home arrivals replay those type reveals when no active View Transition exists, which covers plain case-study returns where the previous Home title/descriptor felt about a second behind `Selected Work`. The top `/index` heading is now intentionally excluded from generic replay so it cannot animate twice.

June 11 page-transition refresh gating: `PageTransition.tsx` v6.5 keeps the Forest Green/Cream first-boot loader home-only. In Auto mode, direct home entries and home reloads play the loader; refreshing `/work`, `/play`, `/index`, case studies, or other non-home routes skips the site-level boot curtain and lets page-local load-in animations run. `/play` still gets its pre-paint blank-gallery hold, with an explicit direct-refresh release path.

June 11 page-transition load-in gating: `PageTransition.tsx` v6.6 arms the global appear hold during same-document route changes before the incoming View Transition state is captured. Native Framer appear effects and custom page intros should stay frozen while the sheet moves and start only after `viewTransition.finished` / `pt:reveal`. Custom components that detect `:active-view-transition` should defer their own reveal until `pt:reveal` or the active-transition fallback clears.

June 11 boot identity QA: the published site at `https://khaki-ship-257706.framer.app/` was verified after the v6.7 publish with `output/playwright/boot-hero-style-qa/qa-hero-style-final-result.json` (46/46 checks). The live boot identity is centered, uses the responsive `/Heading 3` GT Standard L Regular styling above, fades out before the homepage swipe begins, removes the boot curtain after the reveal, shows the Home hero cleanly afterward, hides Framer's public editorbar overlay, and still skips the boot curtain on direct non-home entries.
