# Initial loader diagnosis — 2026-09-17

User checkpoint: diagnose and confirm the intended behavior before fixing. No application source or Framer settings were changed. Two read-only subagents reviewed label timing and curtain performance. The current Framer PageTransition source exactly matches the local mirror, including existing unrelated modifications.

## Confirmed identity issue

- Production custom head script `#mh-head-first-paint-guard` installs an empty green `html::before` through style `#__pt-first-paint`.
- PageTransition.tsx line 76 contains a second, also text-free, fallback guard. Updating only the wrapper would leave the earlier custom head guard unchanged.
- The pinned runtime creates `#__pt-boot` and its `Micah Hoang ©2026` child later; the early shield is then removed. There is no identity fade-in to disable. The runtime only fades the label OUT before the sweep.
- The loader font uses `font-display: swap`, and production has no font preload. In the unthrottled cold capture, visible text changed from 269.578px to 277.742px wide when GT Standard L Regular loaded around 513ms. The slower-network capture repeated the same shift around 2411ms.
- The visual capture confirms a completely blank green first surface, then the identity on the next loader surface.

## Sweep evidence and limits

- Two foreground Chromium captures showed ~8.3ms frame callbacks at first, dropping to ~33.3ms during much of the 1200ms sweep. This is an observed callback cadence, not a universal FPS guarantee or proof of a specific cause.
- An isolated page with the same green layer, transform, duration, and easing stayed near 8.3ms throughout. The behavior requires something in the full page/browser interaction; the transform alone did not reproduce it.
- The runtime already uses a compositor-eligible transform and `will-change: transform`. It calls `__ptReplayAppear()` synchronously immediately before starting the curtain transform.
- Home Header Bottom recovery redundantly replaces identical stylesheet text, reads element animations, and reapplies styles through a rAF loop, an 80ms interval, and a body-wide mutation observer. The cold capture recorded 520 stylesheet replacements. This is avoidable work, but not a proven explanation for the regular 30Hz cadence.
- The trace saw 164 style recalculations, 1 layout, and 8 paint events during the sweep, with no >50ms long tasks. The measured callback costs were small; do not claim a demonstrated long main-thread stall.
- The loader curve `cubic-bezier(0.65,0.01,0.05,0.99)` moves only about 3.3% of the curtain in the first 200ms, then accelerates sharply. That shape makes a cadence dip look more abrupt.

## Proposed repair scope after the user checkpoint

Make the earliest cover and runtime curtain visually continuous, including identity and stable typography. Cover both the custom Framer head code and the wrapper fallback. Remove redundant recovery work without losing Home/nav reveal protections, then compare before/after in a real browser. Isolate any remaining compositor/page workload before attributing it to a specific helper. Keep changes scoped; the workspace already has unrelated modifications.

## Evidence

- `curtain-diagnosis-2026-09-17-raw.json`: cold live timings, font-width swap, mutation counts.
- `curtain-trace-2026-09-17-raw.json`: foreground trace summary and relevant events.
- `curtain-control-2026-09-17-raw.json`: isolated curtain control.
- `curtain-visual-2026-09-17-raw.json`: slower-network visual capture timings.
- `curtain-2026-09-17-01-early-green.png` and `curtain-2026-09-17-02-runtime-label.png`: screenshots of the separate visible surfaces.

Source references: `code/components/PageTransition.tsx:76,302,326,385`; `code/mirror/backups/PageTransition.runtime-backup.tsx:117,1365,1534,1545,1580,1587`. The custom production head guard has no maintained local source mirror yet.
