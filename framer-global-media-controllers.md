# Framer Global Media Controllers — Case Studies

_Last updated: 2026-06-10_

Two **invisible, page-level controller components** add Cargo-style media behavior
to case-study pages without per-element wiring. Drop ONE instance of each on a
page (absolute, 1×1, opacity 0) and it manages all qualifying media on that page
via event delegation / scroll reconcile. Both are gated to run only outside the
Framer canvas (`RenderTarget.current() !== canvas`) — **test in Preview, not the
editor** — and both carry a `window`-level singleton guard so a duplicate
instance can't double-run.

Source of truth for the code lives in this repo:
`CaseStudyLightbox.tsx`, `CaseStudyVideoManager.tsx`.

---

## 1. CaseStudyLightbox — `CaseStudyLightbox.tsx`

- **Framer codeFile:** `F2K4_SV`
- **Insert URL:** `https://framer.com/m/CaseStudyLightbox-yOYpGN.js`
- **Marker element:** `[data-casestudy-lightbox]`; overlay marker `[data-cslb-overlay]`

A full-screen image/video zoom, modeled on Cargo's lightbox.

- **Catches every content image AND video** via a capture-phase `document` click
  listener + `document.elementsFromPoint` hit-testing (so images sitting under
  Framer's border/overlay wrapper divs are still caught). Native Framer images
  expose only `srcset` (no `src`) — opens with the loaded `currentSrc`, then
  upgrades to the largest `srcset` variant.
- **FLIP zoom** from the thumbnail's rect → centered, white backdrop, uniform
  scale (no warp on `object-fit:cover` thumbs).
- **Controls** use the site typeface: GT Standard `‹ › ×` glyphs
  (`"GT Standard L Regular"`), small + light by default. Keyboard (Esc / ← / →),
  tap-to-advance, touch swipe, neighbor preloading, prefers-reduced-motion.
- **Vanilla-DOM overlay appended to `<body>`** — Framer code files cannot import
  `react-dom`, and appending to body avoids transform-ancestor clipping.
- **Race-hardened:** session `token` bumped on every open AND close; every
  deferred callback bails if stale (a late close can't clobber a new open).
  Navigation is synchronous via `showOnly()` (single source of truth).
  Animations use `fill:"none"` so no transform ever persists; a `recenterSoon()`
  watchdog forces identity transform for a few frames after each transition.
- **Videos:** shown without controls by default (`videoControls`), looping,
  muted. The hero video (has `controls`) and any image in an `<a>` are excluded
  by default so they keep their own behavior.

Key props (panel): `enabled`, `lightboxVideos`, `videoControls`,
`backgroundColor` (default white), `chromeColor` (default near-black),
`iconWeight` (300), `iconSize` (24), `showArrows/Close/Counter`,
`clickImageAdvances`, `loopNavigation`, `duration` (360ms),
`viewportPadding` (72 → responsive `clamp(20px,5vw,72px)`), `minSize` (100),
`excludeSelector` (default now `nav, header, footer, a, button,
video[controls], [data-no-lightbox], [data-framer-name*="No Lightbox" i],
[data-framer-name*="NoLightbox" i]`).

**Opt media out (no code):** add `data-no-lightbox` to any element/ancestor, OR
name any wrapping frame `No Lightbox` / `NoLightbox` (case-insensitive
substring). The wrapper force-merges these "always-on" rules into whatever
`excludeSelector` an instance carries, so it works regardless of an instance's
baked value — no per-instance setup. Name the frame that WRAPS the whole media
(video posters render BOTH an `<img>` and a `<video>`), not the leaf image.

**Nav click guard (2026-06-10).** The nav physically overlays media at the top
of case-study pages; the base engine opens on click by finding the topmost
`<img>`/`<video>` at the pointer via `elementsFromPoint`, so clicking a nav item
over media used to open the lightbox instead of navigating. Fixed with a single
**`window`-capture** click listener (fires before the base's `document`-capture
listener): native links → `stopImmediatePropagation` only (lightbox never sees
the click; the browser still navigates); buttons / the scroll-to-top button →
`preventDefault` only (their React `onClick` still runs, the base bails on the
default-prevented click); anything else excluded → `stopImmediatePropagation`.
This is **event-only — NO nav CSS mutation.** An earlier attempt raised the nav
(`z-index` + `pointer-events:auto` + `isolation:isolate`, plus inline mutation
re-applied by a `MutationObserver`); it never fixed the click (`elementsFromPoint`
reaches under the nav) and it broke the nav hover/flip-text reset, so all of it
was removed.

**Gallery unification (2026-06-10).** The reusable `ImageCarousel`
(`SimonSchusterGuidelinesCarousel.tsx`, `tYFZCey`) no longer ships its own
overlay — only its visible slide is hit-testable, so gallery slides open in THIS
lightbox and the ‹ › arrows cycle the whole gallery. See `framer-current-state.md`.

**Versioning gotcha:** `CaseStudyControllers` imports this lightbox at a PINNED
`@hash`. Bump that hash in `CaseStudyControllers.tsx` whenever this file is
republished, or controller pages keep bundling the old lightbox. Current
published lightbox: `CaseStudyLightbox-yOYpGN.js@nVgKAFqnbX7espgnGQ7p`.

---

## 2. CaseStudyVideoManager — `CaseStudyVideoManager.tsx`

- **Framer codeFile:** `rGMwETR`
- **Insert URL:** `https://framer.com/m/CaseStudyVideoManager-L3xgEc.js`
- **Marker element:** `[data-casestudy-videomanager]`

Pauses off-screen autoplay videos to cut the lag on media-heavy pages
(motion-connect has ~25 autoplay videos, many from slow `freight.cargo.site`).

- On every scroll frame (rAF-coalesced) it reconciles each `autoplay` video
  against the viewport with a **generous lookahead margin** (`lookahead`, default
  100% of viewport height). A video plays while within one viewport-height of
  entering view and pauses once farther away (above OR below). So **nothing
  visible is ever frozen** — only far-off videos pause.
- Uses a direct scroll-reconcile, NOT IntersectionObserver (IO's upward "leave"
  callbacks proved unreliable, leaving scrolled-past videos playing). Read phase
  (rect reads) then write phase (play/pause) — no layout thrash.
- Read-only play/pause; never mutates the DOM. Skips the lightbox's own video,
  `video[controls]` (unless `manageControlsVideos`), `[data-no-autopause]`, and
  the exclude selector.

Key props: `enabled`, `lookahead` (%vh, default 100), `manageControlsVideos`
(default No), `excludeSelector` (default `[data-no-autopause]`).

Verified on motion-connect: 0 frozen-in-view at every scroll position; playing
dropped to 1/25 (top) and 3/25 (bottom) vs 25 always-on before. The only place
many play is the dense grid where ~13 are genuinely on screen (unavoidable).

---

## Removed: CaseStudyMediaReveal (do not rebuild as a global controller)

A third controller (`CaseStudyMediaReveal`) attempted Cargo-style fade-in of
media on load. It was **built and then removed 2026-06-05.** Findings:

- The page has **no real layout-shift problem** — measured CLS ≈ 0.008 (Google's
  "good" bar is <0.1); `scrollHeight` stays constant as media loads. Framer
  already reserves media space. The perceived "jump" was the abrupt pop-in.
- A global controller **cannot fix the actual issues**: (a) it mounts after
  images are already in the DOM, so fast/cached images load before it can hide
  them → it can't prevent their pop-in; (b) hiding a slow video until it loads
  just makes the blank last *longer* — no JS can paint a frame that hasn't
  downloaded.
- The blank / wrong-sized tiles are **slow `freight.cargo.site` videos without
  poster frames**, not a fade problem.

Decision: lean on **posters** (the justified grid already supports a `poster`
per item — a still shows instantly at the correct size, video plays over it) and
**de-cargoing** for speed. If a soft image fade is still wanted, bake it into the
grid component (`CaseStudyJustifiedMediaGrid`, race-free via React + ref-`complete`
check), not a global controller.

---

## Consolidated wrapper: CaseStudyControllers — `CaseStudyControllers.tsx`

- **Framer codeFile:** `z13WRHS`
- **Insert URL:** `https://framer.com/m/CaseStudyControllers-0q1sTD.js`

One component that renders all three controllers (Lightbox + VideoManager +
LinkRepair) from a single instance, so a page only needs ONE drop-in instead of
three. It imports the others via their Framer module URLs (the documented
component-in-code-file pattern; the "cannot find module" typecheck note is just
the linter not resolving URL imports — it bundles at runtime). Per-controller
toggles + key props (lightbox videos, video lookahead, link-repair CMS
collection/title field) are exposed; the rest use each sub-controller's
defaults. Each sub-controller keeps its own singleton guard, so this is safe to
run alongside leftover standalone instances during migration — only one of each
ever activates. **Status (2026-06-10):** deployed on 8 pages — AirPods, Simon &
Schuster, National Park Cards, Yomo, Karuna, Gaia, Weaponized Innocence, TYPLDN —
which now use ONE `CaseStudyControllers` instance instead of three separate
mounts. The other 7 (Motion Connect 2025, Seek Truth, Cellular Symphony, Wolff
Olins x ArtCenter, Independent Lens, Neon Lights, Aspen Valley Landscaping) still
carry the three separate instances (MCP returned empty page XML for them during
the migration pass). Both paths get lightbox fixes: wrapper pages via the pinned
import (bump the `@hash` on republish), separate-instance pages via the live code
file directly.

## Placement & rollout (historical 15-page pass, 2026-06-06)

Both `CaseStudyLightbox` and `CaseStudyVideoManager` were placed (one instance
each, absolute 1×1 opacity-0) on the **Desktop root of the 15 bespoke
case-study pages active at that time**, alongside the pre-existing
`CaseStudyLinkRepair`:
motion-connect-2025, simon-schuster, airpods, national-park-cards, yomo, karuna,
gaia, weaponized-innocence, typldn, seek-truth, cellular-symphony,
wolff-olins-x-artcenter, independent-lens, neon-lights, aspen-valley-landscaping.

June 15 CMS/page parity changed the active route set: Neon Lights and Aspen
Valley Landscaping were removed, and Peak Energy, Rejuve, Belly Bar, and
WhatsApp now exist as WIP-gated bespoke CMS routes. Verify controller placement
in Framer before assuming lightbox/video-manager coverage on those newer WIP
pages; use `CaseStudyControllers.tsx` for any new page-level controller mount.

It was done **per-page**, not via a shared Footer: the Footer component
introspects empty over MCP (`<Footer nodeId="xxIb0BkhJ" />`), so appending to it
is unsafe. The `CaseStudyControllers` wrapper (above) exists to consolidate the
three into one instance "for later" — swap each page's three instances for one
when convenient; the singleton guards make that migration safe.

Insert pattern: `getNodeXml(pageId)` → first nodeId = Desktop root, second =
first child → `updateXmlForNode(root, <Desktop nodeId=ROOT><FirstChild nodeId=.. />
<CaseStudyLightbox insertUrl=.. position=absolute ... /><CaseStudyVideoManager ... />
</Desktop>)`. **Gotcha:** `updateXmlForNode` keeps unreferenced children but places
them before the listed ones, so on pages whose Desktop has multiple sibling
content stacks (independent-lens, neon-lights, aspen-valley-landscaping —
header + body as siblings, not one wrapper) you must reference ALL top-level
content stacks in order, or the header gets pushed below the body.

Each page must be **published** for instances to go live. Exclude selectors
(notably `a`) protect linked listing/home thumbnails from being hijacked.

## Posters & de-cargo (2026-06-06)

The `freight.cargo.site` videos (~42) plus 6 on expiring temp hosts (gaia,
wolff-olins) are slow/at-risk. Decision: **posters now, user re-uploads the
video files into Framer later** (Framer's API can't ingest video, only images).

- 47 poster stills were generated (ffmpeg, 25%-seek frames) and committed to
  `case-study-assets/video-posters/` (poster01–47.jpg + `manifest.tsv` + README).
- **API limitation:** native Framer `<Video>` nodes expose only `posterEnabled`
  (boolean) — no poster-image attribute — so the ~40 native VideoWrappers
  (incl. motion-connect's Hype-Reel blank tiles) can only be postered in the
  Framer UI / during re-upload. Use the staged stills (match by URL in the
  manifest) for those.
- Videos in custom poster-aware components CAN be set via the API: grid
  `c0iPrbN` (poster = 5th `|` field of `itemsData`; motion-connect's `tbZz127bk`,
  3 videos, done), `ResponsiveCaseStudyVideo` `bsTLKCt` (`poster` prop). The
  applied poster URLs are interim (catbox); re-point to Framer-CDN copies for
  permanence if kept.

## QA harness

Headless-Chrome scripts (puppeteer-core, uses the installed Chrome — no browser
download) live under `/tmp/lbqa/` during sessions and measure objectively
(centering offsets, frozen-in-view counts, CLS): `qa3/qa4` (navigation),
`qa6` (throttled rapid open/close races), `qavideo` (scroll pause coverage),
`cls` (layout-shift sources). Always re-publish before QA — the harness tests the
published `khaki-ship-257706.framer.app` site.
