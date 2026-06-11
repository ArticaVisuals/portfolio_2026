# Site-wide page transition (zitafernandez.com style)

**Status:** v6.4 · 2026-06-11 · codeFile `gmalnRr` (`PageTransition.tsx`) · insertUrl `https://framer.com/m/PageTransition-br4HFc.js` · placed on every published route

**v6.4 additions — appear restart that actually fires + /play handling:** live probing showed Framer's `startOptimizedAppearAnimation` silently no-ops when re-invoked after the hydration handoff — the v6.3 replay ran but animated nothing. v6.4 builds the WAAPI animations **directly** from the published appear definitions (`__framer__appearAnimationsContent` + breakpoint hash) with `el.animate()` — verified live on /index (6 effects restarted, correct ease/duration). Each replay dispatches a **`pt:reveal` CustomEvent** on window: the contract for custom code components to restart their own intros. `Play.tsx` now listens and replays a staggered opacity fade across the archive cards (opacity only — transforms belong to the drift/parallax engine). PageTransition also carries a **/play force-blank hold** (`data-playground-force-blank` attr + CSS, applied pre-paint by the installer script and on transitions into /play, released when the transition settles) so the play gallery never peeks mid-transition.

**v6.3 additions — appear-effect RESTART (cause and effect):** load-in animations (text fades, header slide-ups, line draws) now start only when the cover ends, even if they already ran while preloaded. New `replayAppearEffects()` re-invokes Framer's own appear runtime (`window.animator.animateAppearEffects` + the `window.__framer__appearAnimationsContent` definitions — the exact call Framer's inline starter makes) to restart every appear effect from its initial state. The **boot loader** calls it at swipe start (`window.__ptReplayAppear`), while the curtain still fully covers, so the reset is invisible and effects animate in as the page is revealed. **Page transitions** keep the frame-zero hold during the slide and replay anything the hold missed at release (held elements are skipped to avoid double-starts). Caveat: SPA-router navigations rely on the hold + the new page's natural mount animations (the appear definitions JSON belongs to the initially loaded document).

**v6.2 additions:** (1) **Zita-style first-boot gating** — the loader now plays on direct entries AND reloads, and skips internal-link arrivals (page transition owns those), back/forward, and prerender passes. Detection: navigation timing entry type (`reload` → play; `navigate` + empty/external referrer → play) — no sessionStorage at all (the old `__ptBootSeen:v2` key is cleaned up for returning visitors). `Boot mode` options are now **Auto** (this behavior, default — legacy value "once") and **Always** (every document load). (2) **Nav name dedup guard** — duplicate `view-transition-name`s on one page silently disable the whole transition per spec; the component now keeps the name on the first *rendered* nav and sets `view-transition-name: none` on any others, applied at mount, before the same-document old-state capture, and before the new-state capture.

**v6.1 additions:** (1) smoother page easing — `cubic-bezier(0.6, 0, 0.18, 1)` (softer entry, silkier landing) replaces `(0.76, 0, 0.24, 1)`. (2) **Appear-effect hold** (`Hold appear` prop, on by default): entrance animations on the incoming page are frozen at frame zero while the sheet is moving and released the moment the transition finishes — the transition visibly *causes* the load-ins. Hooks: `pagereveal.viewTransition.finished` (cross-document, plus an `:active-view-transition` polling fallback if the module evaluates late) and the same-document `vt.finished`. Loops, ambient animations (running > 1.6s), and CSS transitions are left untouched; held animations inside the nav are fast-forwarded instead of replayed (the nav has its own VT choreography). 4s hard-safety release.

## What it is

**Dual-path View Transitions.** Framer's published runtime navigates internal links two ways: its SPA router (`history.pushState` — e.g. nav links on pages without the lightbox click-guard) and real cross-document loads (e.g. on case-study pages where the guard stops the router's listener). v6 covers both:

1. **Cross-document path:** `@view-transition { navigation: auto }` CSS — the browser snapshots the outgoing page and animates between documents.
2. **Same-document path (new in v6):** a module-scope capture listener wraps qualifying internal link clicks in `document.startViewTransition()` *without* preventing default — Framer's router still performs the pushState navigation inside the transition's update phase. The update callback polls (timers, not rAF — rendering is paused) for URL change + DOM mutation/title change, then resolves; if the click turns out to be a full document load, the same-document transition is abandoned at unload and path 1 takes over; if the router never produces new content within 2.5s, `skipTransition()` fires so a stale snapshot is never animated.

Both paths share the same `::view-transition-*` pseudo-elements, so one set of keyframes animates both: the outgoing page dims to 35% and drifts up 10vh while the **actual incoming page slides up over it as a sheet** (700ms, `cubic-bezier(0.6, 0, 0.18, 1)` as of v6.1); media still loading appears on top of the moving sheet. The nav is its own transition group (`view-transition-name: __pt-nav`): it swipes up with the old page (~340ms) and swipes back down 400ms after the sheet lands (`cubic-bezier(0.22, 1, 0.36, 1)` — matched to the nav's measured scroll-hide spring).

The **first-boot loader** (carried from v5.2, re-implemented during the v6 merge): the script injects a fixed Forest Green curtain (`#233324`, Framer color style `/Forest Green`) and an 8px Cream top progress bar before hydration, animates the bar with Zita Fernandez's loader curve (`cubic-bezier(0.65, 0.01, 0.05, 0.99)`), waits for `window.load` with a 4.5s safety max, then swipes the curtain up over 1.2s to reveal the loaded page. On by default; respects `prefers-reduced-motion`. As of v6.2 it plays on direct entries and reloads (Auto mode, Zita-style) — see v6.2 additions above for the gating rules.

The component renders an SSR'd inline `<script>` that installs the CSS (`@view-transition { navigation: auto }` + keyframes + first-boot loader rules) into `<head>` during HTML parse (v5.1: script-install instead of a React `<style>`, which caused recoverable hydration warnings), plus a Speculation Rules **hover prefetch** so the swap starts promptly after a click, plus one-time cleanup of legacy (v1–v4 curtain) state for returning visitors.

For internal navigation there is **no click interception and no curtain handoff** — v1–v4's navigation curtain machinery was retired because it had an irreducible prerender-activation race (the new page could paint un-curtained for a frame → "bright flash" / "content peek"). The browser composites both documents itself, so no blank frame is possible. v5.2 uses a separate first-boot-only seed curtain and a `sessionStorage` replay guard; that guard is not part of internal route handoff.

## Props (current, v6.2)

`Enabled` · `Slide` (700ms) · `Nav swipe` (400ms) · `Old drift` (10vh) · `Old dim` (0.35) · `Nav selector` (`nav[data-framer-name="Navigation"], nav`) · `Exclude` (`[data-no-transition]`, same-document path only) · `Prefetch` (Hover/Off) · `Hold appear` (Until done/Off) · `First boot` (Show/Off) · `Boot mode` (Auto/Always) · `Boot color` (`#233324`) · `Bar color` (`#F7F5F0`) · `Bar height` (8px) · `Boot min` (1200ms) · `Max wait` (4500ms) · `Bar ease` (3000ms) · `Bar hold` (0.86) · `Boot swipe` (1200ms) · `Swipe delay` (300ms)

## Verified working (2026-06-11, user-confirmed "almost perfect" → polish applied)

The behaviors below are confirmed working on the published site and locked in by this snapshot (source: `PageTransition.tsx` at the repo root, byte-identical to the deployed Framer codeFile `gmalnRr`):

- **Page-to-page swipe** on BOTH navigation paths: SPA router clicks (home → info etc., wrapped `startViewTransition`) and full document loads (case-study pages, `@view-transition`). The incoming page slides up as a sheet over the dimming, drifting old page — the Zita layering, with media loading in on top of the sheet.
- **Nav choreography**: swipes up with the outgoing page, swipes back down after the sheet lands; no re-render flash (its VT group covers it on both paths).
- **No white/black flash, no content peek** — eliminated structurally by the View-Transitions architecture (browser composites both pages; nothing paints in between).
- **Appear-effect causality (v6.1)**: entrance animations on the incoming page hold at frame zero during the slide and play the moment the transition finishes — the transition visibly causes the load-ins. Verified in the harness: held mid-slide, released within ~100ms of `finished`, completed after.
- **First-boot loader** on direct entries and reloads (Forest Green curtain + Cream progress bar, Zita's loader curve; v6.2 Auto gating — internal-link arrivals and back/forward skip it).
- **Safety paths**: stale-content skip guard (router stalls → instant swap, never a stale-snapshot slide), hash/external/modifier-click/`[data-no-transition]` exclusions, reduced-motion instant, Firefox instant, 4s hard-safety on the appear-hold.

Local regression suites (all green at snapshot time): /tmp/ptqa — 14 curtain-era tests, 13 v4 choreography tests, 7 same-document wrapper tests, 5 appear-hold tests.

## Placement

One instance per page, **first child of the Desktop root** (1×1, opacity 0). For cross-document transitions both the outgoing AND incoming page must carry an instance; navigations involving an instance-less page are plain instant loads (graceful).

**Placed (complete as of 2026-06-11):** home, /info, /index, /play, /case-studies, /case-studies/:slug template, /404, and all 15 case studies. /contact was an unpublished draft and has been deleted from the project.

## Degradation matrix

- Firefox (no cross-document VT): instant navigation, no artifacts.
- `prefers-reduced-motion: reduce`: all transition animations disabled → instant swap.
- Back/forward: plays the same upward slide.
- Pages without the component: instant navigation.

## Gotchas

- **Stale CDN cache can hide the CSS**: the site serves `cache-control: max-age=0, must-revalidate` with `Vary: Accept-Encoding, Accept`, so different clients can hit older cached variants for a while after publish. A 2026-06-10 audit reported the CSS "missing" from yomo/weaponized-innocence/seek-truth — fresh origin fetches showed it present on all of them. Verify with a cache-busting query before concluding a page is missing coverage.
- **First-boot testing**: in Auto mode just reload the page — the loader replays on every reload by design (v6.2). It will NOT play when you arrive via an internal link (same-origin referrer): open the URL directly or hit reload to see it.
- Duplicate `view-transition-name` on one page silently **skips the whole transition** — the nav selector must match exactly one *rendered* nav per page (hidden breakpoint variants don't count; `display:none` elements aren't captured).
- Like all MCP code edits: manual **Publish** required.
- QA harnesses: /tmp/ptqa (local two-page suite), /tmp/lbqa (live-site puppeteer probes).
