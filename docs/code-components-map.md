# Custom Code Map — Portfolio 2026 (handoff reference)

Last updated: 2026-07-15 (Home selected-work video-first + About hover folded back into HomeSelectedWorkGrid). Plain-English map of every custom
Framer **code component** so a new dev can orient fast. For chronological history
and gotchas see `framer-current-state.md`; for strategy/IA see
`portfolio-framework.md`; for codeFileId↔localPath see
`workspace-organization-plan.md` + `framer/mirror/manifest.json`.

After the 2026-06-18 audit: **34 code components + 5 overrides** (down from 44).
2026-06-23 additions: **`TestimonialLineReveal`** (`tpDdaaJ`, live) and
**`DoubleStackGalleryGrid`** (new case-study gallery layout; local mirror present,
confirm its Framer codeFileId on import).
2026-06-25 addition: **`PlayArchiveRegistrar`** (`jDwcdGN`)
is the Play Archive CMS bridge. See `play-cms-workflow.md`.
2026-07-15 note: the Home About portrait/read-more linked hover CSS lives back
inside **`HomeSelectedWorkGrid`** (`FecepLS`), where git showed the interaction
originally lived. The same component is also the current Home selected-work
media source of truth: `Thumbnail Video` (`SvOqFqdby`) renders as the preferred
video layer, while `Thumbnail` (`Jy7hBJady`) stays underneath as the poster/image
fallback. The selected-work number/title treatment is the original 13px mono
style.

---

## Two patterns to recognize first

Almost every "invisible" component is one of these. Learn them once and most of
the codebase reads quickly.

1. **Invisible DOM-patch controller.** Renders a 1×1 hidden node, then in a
   `useEffect` injects a `<style id>` tag and runs a `MutationObserver` + rAF +
   a `[75,200,500,1000,2000]ms` timeout ladder that tags elements with
   `data-*` attributes and fixes layout/behavior the Framer canvas can't express.
   Examples: `NavigationScrollGuard`, `CaseStudyMobileDescriptorLayout`,
   `CaseStudyLinkRepair`, `InfoScrollMoreColorOverride`,
   `CaseStudyThumbnailStrokeStyles`, the controllers inside `CaseStudyControllers`.
2. **CMS scraper.** Resolves a generated Framer CMS collection module,
   dynamically `import()`s it, calls `scanItems()`, and reads fields by ID. Most
   existing helpers read `All Projects` (`yTHrQWMIY`); `/play` now also reads the
   `Play Archive` collection (`EySMRbI2N`). The resolve→import→scan boilerplate is
   copy-pasted across multiple files (see Consolidation backlog → C1).

Shared field IDs (All Projects, `yTHrQWMIY`): title `oeXZcmPna`, slug
`pdXVG_fBO`, thumbnail `Jy7hBJady`, thumbnail video `SvOqFqdby`, stroke `OHdUYs6Mo`.

`/index` CMS mode is generated-module only. Do not use `ProjectRegistrar`,
manual `projects`, `DEFAULT_PROJECTS`, or hardcoded media URLs as fallback rows;
see `index-component-instructions.md` §3.B before touching index media or grid
hover CSS.

---

## Inventory by function

### Page engines
| Component | id | What it does |
|---|---|---|
| `IndexPage` | `rgAZFOv` | Base CMS-backed `/index` List/Grid archive (taxonomy filters, rows, cards, count). Imported by the wrapper below. |
| `IndexPageGridPreview` | `LgIzFjJ` | **Mounted** `/index` wrapper (exported as `IndexPage`). Adds the `View` control, Grid/List remount preview, Figma responsive overrides. |
| `Play` | `PN1RVOf` | **Mounted** `/play` wrapper. Keeps authorable `Archive Items` as an empty-by-default canvas/rollback surface, folds in viewport-fix/editor-guard/card-hover/reveal-replay, passes controls to the engine below. Current video budget ramps from `8` initial concurrent videos to `16` after `2400ms`. Do not strip the authoring surface or seed it with live content. |
| `ArchivePlayground` | `QNpkYp5` | `/play` archive renderer: live mode renders Play Archive CMS rows only (`PlayArchiveRegistrar` registry first, generated `EySMRbI2N` module second, otherwise empty). Owns grid + media smoothing + nav passthrough + close timing, and the detail drawer: **off-black** title, `/Text Gray` description, **divider directly under the title**, and a **Link-gated CTA** (renders only when CMS `Link` is set; label from `Link Title`, nav-mono `→` glyph + hover roll). On wide panels: title on top, a full-width divider under it (spanning both columns), then description+CTA in the right column below it (empty left column); collapses to a single left-aligned stack on the smallest breakpoint. Grid performance/no-gap behavior: `720px` Framer thumbnail requests, grid videos `preload="none"`, default/capped gap `56px` (`246px` step with `190px` cells), up to `16 × 12` rendered wide-screen coverage, and grid media wrappers stay visible immediately instead of waiting at `opacity:0` for load callbacks. |
| `PlayArchiveRegistrar` | `jDwcdGN` | Invisible bridge mounted inside the hidden `Play Archive` Collection List. Registers Title/Order/Image/Video/Stroke/Content/**LinkTitle/Link** rows into `window.__articaPlayArchiveRegistry`. |
| `PlayLinkBlock` | `gPwlq_8` | Standalone, CMS-bindable nav-styled link block (linked title + muted description + optional CTA, `GT Standard Mono` hover-roll). Not wired into `/play`; for CMS-template/list contexts. Property controls. |
| `Test` | `O9WTdUJ` | **Misnomer** — legacy `ProjectRegistrar` CMS bridge. Retained for canvas compatibility only; not a `/index` render fallback. (Rename file in UI.) |

### Case-study media
| Component | id | What it does |
|---|---|---|
| `CaseStudyJustifiedMediaGrid` | `c0iPrbN` | Cargo-style justified rows, per-item contain/cover + stroke. Primary case-study gallery component. |
| `FixedHeightMediaRows` | `IthLMt_` | Deprecated compatibility bridge only. Legacy instances now delegate into `CaseStudyJustifiedMediaGrid`; do not add new instances. |
| `SimonSchusterGuidelinesCarousel` | `tYFZCey` | **Reusable `ImageCarousel`** (filename legacy). Fade carousel + GT Standard ‹ › arrows; slides open in the page lightbox. Reuse for any gallery. |
| `ResponsiveCaseStudyVideo` | `bsTLKCt` | Responsive video/iframe block (YouTube/Vimeo/native + auto-detects images). |
| `ResponsiveCaseStudyImage` | `vIFnGmg` | Responsive image block — **strict subset of the video one.** |
| `SeekTruthCargoSlideshow` | `BgeH0il` | One-off slideshow (Seek Truth). |
| `TypldnProcessGallery` | `jFSLix7` | One-off process gallery (TYPLDN). |
| `VimeoPrivateEmbed` | `lDvvMS2` | Private/unlisted Vimeo iframe (Peak Energy brand film). |
| `TestimonialLineReveal` | `tpDdaaJ` | Osmo-style line-mask testimonial: quote reveals line-by-line (per-line clip + staggered translateY), then name + role, **no photo**. System GT Standard type + `SITE_EASE`. Arrow/counter toggles, optional autoplay, blank-eyebrow-hides, `Advanced` toggle gating colors/ease/sizes. **Responsive:** quote scales down at tablet/mobile (own-width measured) with an 18px floor; long quotes get a mobile **Read more** collapse. One-off on AirPods (instance `fJKupkZPa`, arrows/counter off); reusable on `/info` with arrows on. |
| `DoubleStackGalleryGrid` | _(new — confirm id)_ | Case-study gallery layout: two stacked media on the left + one tall media on the right, responsive `mobileBelow` stack, per-slot image/video/poster/fit. Mirror added 2026-06-23. |

### Case-study page controllers (invisible)
| Component | id | What it does |
|---|---|---|
| `CaseStudyControllers` | `z13WRHS` | **Preferred** single mount that bundles the three below. Lightbox import is PINNED `@hash` — bump it when the lightbox is republished. Mounted on Motion Connect as `eHJ5dzLyY` after the June 24 cleanup. |
| `CaseStudyLightbox` | `F2K4_SV` | Cargo-style zoom + nav-click guard. Opt out by naming a wrapper `No Lightbox`. |
| `CaseStudyVideoManager` | `rGMwETR` | Pauses off-screen autoplay videos. |
| `CaseStudyLinkRepair` | `y6ny5x4` | Repairs unresolved CMS card links + mobile CTA footer layout. (CMS scraper.) |
| `CaseStudyMobileDescriptorLayout` | `W62Sy75` | Mobile descriptor column rhythm (DOM-patch). |
| `CaseStudyWorkInProgressGate` | `Vu82U8E` | WIP gate shell for unfinished case studies (6 Ready / 9 WIP). |

### Home / index CMS helpers
| Component | id | What it does |
|---|---|---|
| `HomeSelectedWorkGrid` | `FecepLS` | Home's 6 selected projects with direct slug anchors, no baked project fallback rows, `Thumbnail Video` preferred over CMS poster images, CMS thumbnail strokes, 13px selected-work number/title text, Category 1/2/3 tag pills, plus the Home About portrait zoom + `READ MORE` flip CSS. |
| `CaseStudyThumbnailStrokeStyles` | `Z28JYvA` | CMS thumbnail stroke + hover zoom + CMS video sync + link repair on Home/`/case-studies`/`/index`. (CMS scraper.) |
| `OtherProjectCardRestored` | `vlwa5Cz` | Related-project card; hydrates thumbnail/video/stroke from CMS by slug/title. (CMS scraper.) |

### Site chrome
| Component | id | What it does |
|---|---|---|
| `PageTransition` | `gmalnRr` | Thin wrapper over the compiled v7.12 runtime module. Adds: site-wide curtain transition + boot identity + Framer editorbar suppression (runtime), Home Header Bottom appear recovery, `/index` hero-title rise-on-arrival, and home hero rise-on-arrival (2026-06-26). Runtime source preserved in `framer/code-components/backups/PageTransition.runtime-backup.tsx`. See `framer-page-transition.md`. |
| `PageTransition_v7_12_Backup` | `Uv2k27l` | **Rollback wrapper** to the pre-v7.13 module. Retire candidate (keep frozen URL in a note). |
| `NavigationScrollGuard` | `Wnd19lx` | Keeps native nav clickable when its scroll-hide transform gets stranded at top. Lives inside `Navigation`. |
| `ScrollToTopButton` | `gh4ngZN` | Scroll-to-top mono button (Home, `/info`). Shares the flip-rail cadence of the `Scroll More` design component. |
| `InfoScrollMoreColorOverride` | `AZDGWx7` | `/info` hero Scroll-More arrow color fix (DOM-patch). |
| `LineAnimationBorder` | `j7WYIMf` | Nondestructive border-frame replacement for native `Line Animation`; keeps the same 0.2s delay, 2s duration, and `[0.25, 1, 0.5, 1]` draw easing, with a `Viewport Once` self-trigger for copy-page swaps. |
| `FooterCopyrightYear` | `BF2H03E` | Auto current-year in footer. |
| `ResumeAssetHost` | `xDqfenf` | **Archived no-op** stub kept so the Footer instance resolves. |

### Effects / misc
| Component | id | What it does |
|---|---|---|
| `TextEncryptionEffect` | `p7tSTaD` | **The real scramble/dencrypt effect** (Home social labels). |
| `CaseStudyScrambleText` | `dHFQCIH` | **Misnomer — NOT a scramble.** Plain hover-color link; relabeled "Case Study Header Link" 2026-06-18. |
| `ProfileTextRevealFix` | `LNjgKO2` | `/info` masked text reveal (DOM-patch). |
| `Counter` | `hdPa_Gj` | `NumberCounter` — **live** project count on `/case-studies` (keep at 17). |
| `GrainOverlay` | `MhR7Ukl` | Toggleable SVG `feTurbulence` film-grain overlay; portals a `position:fixed`, `pointer-events:none` layer to `<body>` (immune to transformed ancestors; mount-guarded for SSR). Tunable `grainOpacity`/blend/color/exposure/contrast/size/octaves + animated shimmer. **`clearNav`** (default on) starts the grain at the nav's LIVE bottom edge and tracks it (MutationObserver on body class → rAF burst) so the header stays clean AND there's no seam when the `/play` detail panel opens and the nav slides away. Default recipe = oxblood `#501d07`, multiply, 0.10, animated 16fps (locked in the local "grain lab"). **Placed on `/play`** Desktop (instance `JSrIX4EmY`). |

### Overrides (5) — all archived no-op pass-throughs
`Examples_1`, `Weather`, `Copyright_year`, `Copyright`, `External`. Kept because
Framer publish validation can still care about old override export names. Do not
delete casually.

---

## Framer gotchas (bite a new dev fast)
- **MCP can't rename code files** — only the Framer UI can. Renames are safe because
  instances bind to `componentId` (`codeFile/<id>:default`), not the filename.
- **MCP edits/deletes don't auto-publish** — you must click Publish; then QA.
- **MCP can't expand breakpoint nodes** (Desktop/Tablet/Phone return "not found"),
  so nested instances are UI-only to find/detach. Stray instances on a non-Desktop
  breakpoint have failed the publish optimizer (`ssg-module-not-found`).
- **Cross-file imports use versioned module URLs** — a republished dependency needs
  its importers' pinned `@hash` bumped (see `CaseStudyControllers`→lightbox).
- **CMS-module resolution must anchor to the CURRENT route, never the session
  resource buffer** — `IndexPage` (`rgAZFOv`) and `HomeSelectedWorkGrid` (`FecepLS`)
  both import the same `All Projects` collection (`yTHrQWMIY`) by resolving its
  hashed module URL at runtime. Framer SPA navigation does **not** clear
  `performance.getEntriesByType("resource")`, so a module hash one route loaded
  stays visible to the other. If a resolver takes the *first* `yTHrQWMIY.*.mjs` it
  finds in that shared buffer, a client-side nav (e.g. home → `/index`) can import
  a **stale hash** and render thumbnails no longer in the CMS — intermittently, and
  "fixed" only by a hard refresh (which clears the buffer). Fix (2026-07-20):
  `resolveCMSModuleUrl` now fetches the **current route's own HTML first**
  (`fetch(location.pathname, {cache:"no-store"})` + live-scan paths), which only
  ever names this page's current module; the in-document/resource-buffer scan is a
  demoted fallback for the Framer editor preview only. The hardcoded
  `KNOWN_CMS_MODULE_URLS` pin (`…C4v6sro0.mjs`) goes stale every republish and must
  stay **last-resort**, below all live discovery, or it re-poisons the buffer. Never
  reorder the buffer scan back above the current-route fetch. See
  `index-component-instructions.md` §3.C.

---

## Consolidation backlog (deferred — all touch LIVE components)
Do each as: migrate one → Publish → QA `/`, `/index`, `/play`, `/info`,
`/case-studies`, one bespoke case study.

- **M1 — media gallery consolidation.** `CaseStudyJustifiedMediaGrid` is the
  canonical gallery. `FixedHeightMediaRows` has been reduced to a deprecated
  bridge for any legacy mounted instances; delete it only after Framer XML
  confirms no instances remain.
- **M2 — merge responsive media.** `ResponsiveCaseStudyImage` is a subset of
  `ResponsiveCaseStudyVideo`; repoint instances to the video one (auto-handles images); retire the image one.
- **C1 — shared CMS helper.** The resolve→import→scan boilerplate is triplicated in
  `CaseStudyThumbnailStrokeStyles`, `CaseStudyLinkRepair`, `OtherProjectCardRestored`.
  ⚠️ In Framer a shared module is imported by versioned URL, which adds pinned-hash
  upkeep — weigh that against the dedup before extracting.
- **N1 — UI renames** (safe, componentId-bound): `Test`→`ProjectRegistrar`,
  `CaseStudyScrambleText`→`CaseStudyHeaderLink`, carousel→`ImageCarousel`.
- **N2 — retire** `PageTransition_v7_12_Backup` once the frozen module URL is noted elsewhere.
