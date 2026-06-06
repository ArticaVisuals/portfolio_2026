# Framer Global Media Controllers — Case Studies

_Last updated: 2026-06-05_

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
`excludeSelector` (default `nav, header, footer, a, button, video[controls],
[data-no-lightbox]`).

Per-element opt-out: add `data-no-lightbox` to any element/ancestor.

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

## Placement & rollout

Each page needs one instance of each controller. To cover **all case studies at
once**, embed both inside the shared **Footer** component (so every page that
renders the footer gets them automatically). The singleton guards make duplicate
instances harmless. Exclude selectors (notably `a`) protect linked listing/home
thumbnails from being hijacked.

## QA harness

Headless-Chrome scripts (puppeteer-core, uses the installed Chrome — no browser
download) live under `/tmp/lbqa/` during sessions and measure objectively
(centering offsets, frozen-in-view counts, CLS): `qa3/qa4` (navigation),
`qa6` (throttled rapid open/close races), `qavideo` (scroll pause coverage),
`cls` (layout-shift sources). Always re-publish before QA — the harness tests the
published `khaki-ship-257706.framer.app` site.
