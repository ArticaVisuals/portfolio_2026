# Framer Current State Audit

**Project:** Micah Hoang Portfolio 2026  
**Last audited:** June 10, 2026, via Framer MCP, targeted page XML checks, published-route browser QA, and local repo audit
**Published/staging URL:** `https://khaki-ship-257706.framer.app`  
**Public-domain note:** `https://micahhoang.info` has historically served the Cargo site during recent audits. Treat the Framer URL above as the current redesign/build surface until domain cutover is explicitly confirmed.

This is the quick source of truth for the active Framer project and local handoff repo. Old one-off handoff/audit docs were deleted on June 2 so future agents do not follow stale repair paths. When docs disagree, this file wins.

---

## Current Framer Structure

### Web Pages

- `/` - Home, page ID `R6_F7xjGZ`
- `/404` - 404, page ID `koPvme2ig`
- `/case-studies` - Native case-study index, page ID `Rnw1WO1jS`
- `/case-studies/:slug` - Dynamic CMS fallback route, page ID `UlQco8cYi`
- `/case-studies/airpods` - Bespoke AirPods Pro 3 case-study page, page ID `LB7pYBD3k`
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
- `/case-studies/neon-lights` - Bespoke Neon Lights page, page ID `CIiMjjVXQ`
- `/case-studies/aspen-valley-landscaping` - Bespoke Aspen Valley Landscaping page, page ID `X7cKKlm88`
- `/index` - Canonical archive page, page ID `u2LOaBT5q`
- `/play` - Archive media playground, page ID `KbgWr_0BN`
- `/play-consolidation-draft` - Safe draft mirror for Play consolidation work, page ID `Ri9885Djw`
- `/info` - Editorial profile/info page, page ID `fxz_zRIyp`
- `/contact` - Contact page, page ID `gmXtVnIzJ`

No current Framer web page is exposed for `/profile`, `/worldgrid-test`, `/play-2`, `/playground`, or `/playground-scroll-draft`.

### Design Pages

- `Design`, design page ID `NLQmOR3If`
- `Asset Migration - Simon Schuster`, design page ID `AWMq0CPqb`

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
| `IndexPage.tsx` | `rgAZFOv` | Main `/index` List/Grid archive component. |
| `ProfileTextRevealFix.tsx` | `LNjgKO2` | `/info` text reveal helper. |
| `FooterCopyrightYear.tsx` | `BF2H03E` | Footer year helper. |
| `Test.tsx` | `O9WTdUJ` | Misleading filename; exports the legacy `ProjectRegistrar` CMS registry bridge. Kept as fallback. |
| `CaseStudyThumbnailStrokeStyles.tsx` | `Z28JYvA` | CMS-driven thumbnail stroke helper on Home, `/case-studies`, and `/index`. |
| `ResumeAssetHost.tsx` | `xDqfenf` | Footer/resume compatibility utility; keep because Footer still references the expected prop shape. |
| `IndexPageBreakpointsDraft.tsx` | `VwMoFWv` | Active hidden `/index` responsive/style helper. Despite the name, it is part of the current `/index` implementation. |
| `IndexGridVideoHoverFix.tsx` | `kjMWwjO` | Hidden `/index` CSS guard mounted as `JvCNoMs41`; keeps helper-generated grid videos on the same hover/focus scale path as image thumbnails and respects reduced motion. |
| `ArchivePlayground.tsx` | `QNpkYp5` | Active `/play` archive media playground as of June 8. Consolidated grid, drawer, media smoothing, footer hiding, nav passthrough, close timing, and authorable `Archive Items` content live here. |
| `ArchivePlaygroundConsolidated.tsx` | `D5YVims` | Unmounted earlier consolidation attempt. Keep only as rollback/historical material unless intentionally revived. |
| `ArchivePlaygroundConsolidatedDraft.tsx` | `aEyj7Rq` | Draft mirror mounted on `/play-consolidation-draft`; safe place for future parity experiments before promoting to `/play`. |
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
| `CaseStudyScrambleText.tsx` | `dHFQCIH` | Scramble text CTA/helper used in bespoke case-study pages. |
| `CaseStudyJustifiedMediaGrid.tsx` | `c0iPrbN` | Bespoke case-study justified media grid helper. |
| `FixedHeightMediaRows.tsx` | `IthLMt_` | Karuna fixed-height process gallery helper. |
| `SimonSchusterGuidelinesCarousel.tsx` | `tYFZCey` | **Reusable `ImageCarousel`** (default export renamed 2026-06-04; filename unchanged because MCP can't rename code files). General-purpose fade carousel + GT Standard `‹ ›` arrows — recycle for any case-study gallery. First used on Simon & Schuster. **As of June 10 it no longer ships its own lightbox** — gallery slides open in the page-level `CaseStudyLightbox` (see "Reusable Image Carousel" below). |
| `HomeSelectedWorkGrid.tsx` | `FecepLS` | Home selected-work grid. Renders the six CMS/default selected projects with direct `/case-studies/{slug}` anchors and image/video media fallback. |
| `CaseStudyLinkRepair.tsx` | `y6ny5x4` | Legacy route-repair helper. The Home instance `uxp3mYNsy` is disabled after `HomeSelectedWorkGrid.tsx` replaced the broken native Home selected-work grid; use `CaseStudyControllers.tsx` for new bespoke page controller mounts. |
| `CaseStudyLightbox.tsx` | `F2K4_SV` | Case-study lightbox subcontroller. Prefer the consolidated `CaseStudyControllers.tsx` wrapper for page-level mounts. **June 10 updates:** (1) opt media out of the lightbox by naming any wrapping frame `No Lightbox`/`NoLightbox` (force-merged into every instance's Exclude rule, so no per-instance setup; wrap the whole media, not the leaf img); (2) the lightbox-suppression logic is a single `window`-capture click listener (fires before the base engine's `document`-capture listener) — native links navigate (`stopImmediatePropagation`, no `preventDefault`), buttons/scroll-to-top keep their own React `onClick` (`preventDefault` only), other excluded regions are fully suppressed; (3) gallery slides open in this lightbox (the carousel's own overlay was removed); (4) **nav-overlay click fix** — clicking a nav item that physically overlays media now navigates instead of opening the lightbox, handled by the event guard ALONE. All nav **CSS mutation was removed** (`z-index`, `pointer-events`, `isolation:isolate`, inline style mutation, the `data-case-study-nav-layer` stylesheet): it never fixed the click (the base engine reaches media *under* the nav via `elementsFromPoint`) and it broke the nav hover/flip-text reset. **Versioning gotcha:** `CaseStudyControllers` imports this lightbox at a PINNED `@hash` — bump that hash whenever this file is republished, or controller pages keep loading the old lightbox. Current published version: `@nVgKAFqnbX7espgnGQ7p`. |
| `CaseStudyVideoManager.tsx` | `rGMwETR` | Case-study autoplay video subcontroller. Prefer the consolidated `CaseStudyControllers.tsx` wrapper for page-level mounts. |
| `CaseStudyControllers.tsx` | `z13WRHS` | Active hidden wrapper for the useful bespoke case-study controllers: lightbox, video manager, and link repair. Mounted on accessible bespoke pages where the three separate controller instances were consolidated. |
| `CaseStudyMobileDescriptorLayout.tsx` | `W62Sy75` | Aspen Valley Landscaping mobile descriptor layout helper. Mounted on `/case-studies/aspen-valley-landscaping`. |
| `NavigationScrollGuard.tsx` | `Wnd19lx` | Hidden child of the native `Navigation` component (`I0Wh3P9o8`). Keeps the nav visible/clickable at page top if Framer's scroll-hide transform gets stuck after scrolling down and returning to `scrollY=0`. |

June 8 cleanup: `CaseStudyThumbnailVideoSync.tsx` (`qONpo1v`) was removed from Home, `/case-studies`, `/index`, and `/case-studies/aspen-valley-landscaping`, then deleted from Framer after its mounted behavior was consolidated into the existing page/component thumbnail video paths. `RelatedProjectHoverZoom.tsx` was also removed from the local repo; it was a historical mirror and is not present in the current Framer MCP code-component inventory.

June 10 cleanup: the former public editorbar guard was removed from known mounted pages, deleted from the Framer code-file inventory, and removed from the local mirror. It is no longer part of the current public page baseline.

June 10 controller cleanup: the accessible bespoke case-study pages AirPods, Simon & Schuster, National Park Playing Cards, Yomo, Karuna, Gaia, Weaponized Innocence, and TYPLDN now use one hidden `CaseStudyControllers.tsx` (`z13WRHS`) instance instead of separate `CaseStudyLinkRepair.tsx`, `CaseStudyLightbox.tsx`, and `CaseStudyVideoManager.tsx` mounts. MCP returned empty XML for Motion Connect 2025, Seek Truth, Cellular Symphony, Wolff Olins x ArtCenter, Independent Lens, Neon Lights, and Aspen Valley Landscaping during this pass, so those pages were not modified.

June 10 scroll-to-top fix: `ScrollToTopButton.tsx` (`gh4ngZN`) did nothing on published case-study pages because the old `CaseStudyLightbox` click guard (`document`-capture `stopImmediatePropagation` on every excluded element, `button` included) killed the button's own React `onClick` before it ran. Fixed by the guard rewrite noted above (window-capture + preventDefault for interactive controls). Verified live on Motion Connect 2025 (scrollY → 0). This applies to every case-study page that carries the lightbox/controllers instance, so the button can be rolled out site-wide without per-page work.

June 10 build-error resolution: a leftover orphaned instance of the deleted editorbar guard (former code file `ztNOibx`) remained on `/info` (plus `/404` and `/case-studies`) and failed the publish optimizer with `ssg-module-not-found` / `MISSING_EXPORT "default"`. All three orphaned instances were removed (check every breakpoint — the `/info` one survived on a non-Desktop breakpoint); optimization status is back to `optimized`. Re-creating the code file would NOT have fixed it (a new file gets a new id, so the dangling `ztNOibx` import still wouldn't resolve) — removing the orphaned instances is the correct fix.

June 10 related-project thumbnail fix: the AirPods "Other Projects" Gaia card was rendering the static `thumbnailSrc` prop (`1a1LDlRx4V2kNoG7kX7hvWygUCg.jpg`) while the CMS/Home/Index source of truth had Gaia's thumbnail as `XBEu3UkNu8Hm5CPrgksq7wtmbw.gif`. `OtherProjectCardRestored.tsx` now resolves the generated `All Projects` CMS module (`yTHrQWMIY`) and replaces card media/stroke from CMS when a matching slug/title exists; manual props remain fallback values. Publish the Framer site after this code-file update before expecting `khaki-ship-257706.framer.app` to reflect the new component bundle.

June 10 nav scroll guard: reproduced a native Navigation bug on Home where scrolling down and back to the top left the fixed nav inline-styled as `transform: perspective(1200px) translateY(-64px)` even at `scrollY=0`, making the visible header links unhoverable/unclickable. `NavigationScrollGuard.tsx` is mounted inside the reusable `Navigation` component and only forces the nav transform back to `translate3d(0,0,0)` while the document is within 4px of the top. It intentionally skips `/play`'s temporary `playground-nav-exit-hidden` close animation class so the archive drawer reveal can still run.

#### Play page consolidation — active as of June 8, 2026

`/play` (`KbgWr_0BN`) mounts one active production archive component on the Desktop variant: `ArchivePlayground` node `kgFbinZvY`, backed by `ArchivePlayground.tsx` (`QNpkYp5`). The promoted component was copied from the working `/play-consolidation-draft` build and now owns the archive grid, detail drawer, rotating Close text, slide-down nav reveal after close, media fade/stroke behavior, footer hiding, nav passthrough behavior, and content editing controls.

Content management should happen in the Framer properties panel under `Archive Items`. Each row exposes `Title`, `Description`, `Type`, `Media / Poster`, conditional `Video`, `Category`, aspect width/height, and `Stroke`. Leave `Advanced` off for normal content edits; it hides the layout, motion, color, nav, and timing controls so the page stays easy to manage long term.

The legacy helper instances (`RBX6jsP`, `vdg69JZ`, `c2PU6kX`, `R3ZWYKl`, `iivBAHR`, `FFqrKyU`) remain on the live `/play` canvas as rollback material, but each is set to `enabled=false`. `ArchivePlaygroundConsolidated.tsx` (`D5YVims`) also remains in the Framer code-file inventory as an unmounted earlier attempt. `/play-consolidation-draft` (`Ri9885Djw`) still mounts `ArchivePlaygroundConsolidatedDraft.tsx` (`aEyj7Rq`) at node `gITHlJyGo` and should be used for future Play experiments before promotion.

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

The `All Projects` CMS collection (`yTHrQWMIY`) contains 16 real project records and no Jacob Turner sample/template records.

| Sort | Project | Slug | Year | Home flag |
|---:|---|---|---|---|
| 1 | AirPods Pro 3 | `airpods` | 2025 | true |
| 2 | Simon & Schuster | `simon-schuster` | 2025 | true |
| 3 | Gaia | `gaia` | 2026 | true |
| 4 | National Park Playing Cards | `national-park-cards` | 2019-ongoing | true |
| 5 | Motion Connect 2025 | `motion-connect-2025` | 2025 | true |
| 6 | Yomo | `yomo` | 2025 | true |
| 7 | Karuna | `karuna` | 2025 | false |
| 8 | Weaponized Innocence | `weaponized-innocence` | 2024 | true |
| 9 | Wolff Olins x ArtCenter | `wolff-olins-x-artcenter` | 2024 | false |
| 10 | Aspen Valley Landscaping | `aspen-valley-landscaping` | 2024 | false |
| 11 | Cellular Symphony | `cellular-symphony` | 2024 | false |
| 12 | Neon Lights | `neon-lights` | 2024 | false |
| 13 | John Steinbeck | `john-steinbeck` | 2023 | false |
| 14 | Seek Truth | `seek-truth` | 2024 | false |
| 15 | Independent Lens | `independent-lens` | 2024 | false |
| 16 | TYPLDN | `typldn` |  | false |

The `Journal` CMS collection still exists, but there is no visible Journal page in the current Framer project map.

### Field IDs Used By Current Workflows

- `oeXZcmPna` - Title
- `DLBifmgp1` - Sorting Number
- `kuvJcmOFr` - Category 1 / Service 1
- `VV1CggU2J` - Category 2 / Service 2
- `E6OpH0hSs` - Category 3 / Service 3
- `VeDm9FjW4` - About the project
- `Jy7hBJady` - Thumbnail
- `SvOqFqdby` - Thumbnail Video, File upload
- `OHdUYs6Mo` - Thumbnail Stroke
- `vlN2R_qnF` - Client
- `QZqSK_3OF` - Year, stored as a string
- `QF3AEVk8r` - Image 1
- `xOL69akmU` - CMS Video 1
- `FwLb0MrAN` - CMS Video Poster 1
- `fsFlSPDTa` - Image 2
- `xpyes5aGJ` - CMS Video 2
- `Y9u0naHRi` - CMS Video Poster 2
- `X4mkKflln` - Next Project 1
- `z_tutvcUx` - Next Project 2
- `OoXOWcQvg` - Next Project 3
- `vqPrQQLOM` - Content
- `mBIilFqVM` - Industry
- `myUIfK0j7` - Is Homepage

Recommended manual additions remain `Case Study URL` and `Build Status`. Add those in Framer only if the workflow needs them; do not repurpose existing field IDs.

June 1-2, 2026 thumbnail stroke and Home link/media fix: the current generated `All Projects` CMS module exports the collection under `r` with legacy `a` absent. `CaseStudyThumbnailStrokeStyles.tsx` (`Z28JYvA`) now scans `a`, `r`, `default`, and object exports for `collectionByLocaleId.default.scanItems()` before reading `OHdUYs6Mo`. On June 2, helper instances were updated to use Framer item slugs directly (`slugFieldId=""`) and the old AirPods-only URL override was cleared. The Home selected-work link/media issue was fixed by replacing the broken native Home selected-work grid with `HomeSelectedWorkGrid.tsx` and disabling the Home `CaseStudyLinkRepair.tsx` instance. Before touching or publishing the stroke helper, run `node tools/check-thumbnail-stroke-resolver.mjs` to catch regressions back to the old `module.a`-only lookup.

June 8, 2026 Gaia CMS/Home verification: Framer MCP and published-route Playwright inspection verified that Home remains linked to `All Projects`. Gaia item `Qw6kG4fCG` has slug `gaia`, `Is Homepage=true`, `Thumbnail Stroke=true`, and `Thumbnail=https://framerusercontent.com/images/XBEu3UkNu8Hm5CPrgksq7wtmbw.gif`; the hydrated published Home card rendered the same GIF and `data-thumbnail-stroke="true"`. AirPods Pro 3 and Gaia are currently the homepage-visible projects with `Thumbnail Stroke` enabled.

---

## Major Custom Systems

### Home

Home is a native Framer page whose selected-work section is now rendered by `HomeSelectedWorkGrid.tsx` (`FecepLS`), mounted as node `h0ZkBCWe1` inside the `Projects` section (`k7gSpMtLR`). The component reads `All Projects` when the generated CMS module is available, falls back to its default project snapshot when needed, filters `Is Homepage`, orders by `Sorting Number`, and shows the first six items:

1. AirPods Pro 3
2. Simon & Schuster
3. Gaia
4. National Park Playing Cards
5. Motion Connect 2025
6. Yomo

Karuna is off Home because its Home flag is false. Weaponized Innocence is homepage-flagged but outside the first six by sort order.

The old native `AllProjects` / `CaseStudy` Home grid lost reliable per-item bindings and showed AirPods data over every row after hydration. Do not restore that native Home grid unless the section is intentionally rebuilt in the Framer editor with verified CMS bindings. `HomeSelectedWorkGrid.tsx` owns direct anchors, image/video rendering, the hover label, and the `Thumbnail Stroke` visual fallback for the selected-work section.

Custom code on or affecting Home:

- `TextEncryptionEffect.tsx` for social-label scramble effects.
- `HomeSelectedWorkGrid.tsx` for selected-work card links and media.
- `CaseStudyThumbnailStrokeStyles.tsx` for CMS-driven thumbnail strokes in native/media contexts.
- `CaseStudyLinkRepair.tsx` legacy Home instance `uxp3mYNsy`, currently `enabled=false`.
- `ScrollToTopButton.tsx` for scroll return.
- Footer compatibility helpers, including the resume asset/year utilities.

June 2 published fix: the Home hero line was corrected from `mind.Strategy` to `mind. Strategy`, selected-work cards render six distinct projects, card thumbnails/text link to their canonical case-study pages, image thumbnails render for image-only projects, the profile image links to `/info`, and LinkedIn uses the external profile URL.

### `/index`

`/index` is the most custom page. Current active code files are:

- `IndexPage.tsx` (`rgAZFOv`)
- `CaseStudyThumbnailStrokeStyles.tsx` (`Z28JYvA`)
- `IndexPageBreakpointsDraft.tsx` (`VwMoFWv`)
- `IndexGridVideoHoverFix.tsx` (`kjMWwjO`, mounted as hidden node `JvCNoMs41`)

`IndexPage.tsx` owns taxonomy filters, list rows, grid cards, project count, view state, and the inline `GRID / LIST` control. The visible taxonomy is `/ Year`, `/ Service`, `/ Industry`; each group has its own `All` clear action. Grid view renders native HTML cards inside the code component rather than calling the native Framer `Case Study` module.

June 8, 2026 Motion Connect grid hover fix: live inspection showed the published `/index` CSS did not include the direct-child `.idx-grid-card-media > video` hover selector used by helper-generated thumbnail videos, so the Motion Connect video stayed visually static while the card title hover flip still worked. `IndexGridVideoHoverFix.tsx` (`kjMWwjO`) is mounted hidden on `/index` as `JvCNoMs41` to patch `.idx-grid-card-media > img/video` hover/focus scale to `1.02` and force `scale(1)` under `prefers-reduced-motion: reduce`. Publish the Framer site after this canvas edit before expecting `khaki-ship-257706.framer.app` to reflect it.

June 8, 2026 archive thumbnail video update: the live `/index` `IndexPage` instance reads `thumbnailVideoFieldIds="SvOqFqdby"`, so the `Thumbnail Video` File upload is the only active CMS thumbnail-video source. The older `Thumbnail Video Link` text field (`WG62tRjG8`) is retired and should not be used as a fallback. Thumbnail media policy is: `Thumbnail Video` wins over `Thumbnail`; `Thumbnail` is poster/fallback. The hidden `CmsLink` collection list remains mounted so Framer's generated CMS module is available. If the `ProjectRegistrar` bridge provides incomplete rows, `IndexPage` hydrates thumbnail, thumbnail video, and thumbnail stroke from the generated CMS module by slug/title before rendering the grid. The existing `CaseStudyThumbnailStrokeStyles.tsx` instance on `/index` (`szF9sZNWA`) remains configured with `syncThumbnailVideos=true`, `videoFieldId="SvOqFqdby"`, and `slugFieldId="pdXVG_fBO"` as a backup overlay path. Wolff Olins x ArtCenter, Cellular Symphony, Neon Lights, Motion Connect 2025, and AirPods Pro 3 have populated `Thumbnail Video` File values (`SvOqFqdby`) on Framer's CDN. The published site needs a Framer publish/redeploy before canvas/CMS File-field changes appear in the generated CMS bundle. `IndexThumbnailVideoFallback.tsx` (`wvucZCT`) and its hidden node (`R9kqDJO7t`) were deleted from Framer; do not recreate a hardcoded per-project fallback helper.

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

June 2 published fix: the visible `NumberCounter` end value was changed from `12` to `16` to match the current `All Projects` CMS item count. If the CMS roster changes later, update or replace this prop-driven count.

### `/play`

`/play` is the archive media playground. Active production code file:

- `ArchivePlayground.tsx`

The helper stack that used to patch nav/pointer/media/close behavior remains in the Framer project and on the live canvas with `enabled=false`. Manage archive content through the `Archive Items` array on the `ArchivePlayground` instance. Use `/play-consolidation-draft` for future component experiments before touching the production `/play` page.

### `/info`

Active code files:

- `ProfileTextRevealFix.tsx`
- `InfoScrollMoreColorOverride.tsx`
- `ScrollToTopButton.tsx`

The current page is an editorial forest-green profile page with selected experience, testimonials, recognition rows, and CTA sections.

### Bespoke Case Study Pages

Bespoke pages now exist for AirPods, Simon & Schuster, Motion Connect 2025, National Park Playing Cards, Yomo, Karuna, Gaia, Weaponized Innocence, TYPLDN, Seek Truth, Cellular Symphony, Wolff Olins x ArtCenter, Independent Lens, Neon Lights, and Aspen Valley Landscaping.

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
- Future `/play` changes should start on `/play-consolidation-draft`, pass visual parity checks, then be promoted into `ArchivePlayground.tsx` (`QNpkYp5`).
- `/case-studies` still displays a `NumberCounter` configured by page props. On June 2, the prop was updated and published as `16` to match the CMS roster; a future refactor could make this dynamic.
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

June 10 page transitions: `PageTransition.tsx` (codeFile `gmalnRr`) is live as v5.2 — cross-document View Transitions (destination page slides up as a sheet over the dimming/drifting old page; nav exits up and re-enters as its own transition group; Speculation Rules hover prefetch), plus a first-boot Forest Green curtain with a Cream top progress bar using Zita's loader curve (`cubic-bezier(0.65, 0.01, 0.05, 0.99)`) before swiping up to reveal the loaded page. Placed as first child of the Desktop root on home, /info, /index, /play, and all 15 case studies. Still unplaced: /case-studies, /case-studies/:slug, /404 (need a one-time editor open before MCP can read them); /contact is an unpublished draft. The earlier v1–v4 click-intercept curtain implementations remain retired; v5.2 installs the CSS and first-boot seed via an SSR'd head script, preserving the v5.1 hydration-warning fix. Full details: framer-page-transition.md.
