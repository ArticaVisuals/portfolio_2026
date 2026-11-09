# Play arrival: apparent empty navbar

Status: fix saved in Framer draft after the user reconnected MCP and authorized
implementation. GrainOverlay version `ptTqhah7cDBxIznwLZpp`; publish pending.
The original diagnosis below preceded the implementation.

## Confirmed cause

On published `https://micahhoang.com`, the Play grain overlay starts at 53px,
matching the measured nav bottom. PageTransition gives the real nav a separate
`__pt-nav` view-transition group. At 690ms in the transition the nav snapshot
is still above the viewport, but GrainOverlay measures the underlying DOM nav
at its final position. The resulting untextured cream strip looks like an
empty duplicate navbar.

Relevant source:

- `code/components/GrainOverlay.tsx`: nav measurement at lines 120–157; grain
  inset calculation at lines 241–244.
- `code/components/PageTransitionRuntime.tsx`: nav transition naming at line
  1282 and delayed entrance at lines 1345–1346.

## Evidence

- `play-nav-diagnosis-before-2026-09-19.png`: paused Home → Play transition,
  showing the 53px strip while the real nav is offscreen.
- `play-nav-diagnosis-prototype-2026-09-19.png`: same paused transition with
  grain extended to top 0; continuous background and no strip.
- `play-nav-diagnosis-nav-entering-2026-09-19.png`: nav background and text
  descend together over the full-height grain.
- `play-nav-index-prototype-2026-09-19.txt`: independent Index → Play check.
  Browser-only CSS was installed before navigation. Grain top was 0px during
  the active transition and automatically returned to 53px after completion,
  while the prototype stylesheet remained installed. Nav height was 53px.

These are controlled paused-animation checks in desktop Chromium at
1440×1000, not a cross-browser production validation.

## Proposed focused fix

In the existing GrainOverlay component, add a marker for runtime overlays
with clearNav enabled, and render a rule with the portal:

```css
:root:active-view-transition [data-mh-grain-clear-nav="true"] {
    top: var(--mh-grain-top-inset, 0px) !important;
}
```

Preserve the configured topInset via the custom property. Leave nav DOM
measurement, drawer tracking, and the existing inline top unchanged; they
resume automatically after the transition. Keep the WebKit rendering guard.
Use a marker rather than the broad SVG selector used by the temporary probe.

## Implementation and validation

Latest Framer source matched the local mirror before editing. The focused
change adds the marker, per-instance inset variable, and runtime CSS described
above. Framer returned an empty typecheck array and source readback matched
the submitted local file exactly. `npm test` passed all 35 performance guards;
`git diff --check` passed. Independent code review found no actionable issues.

The Framer-compiled draft was downloaded and its GrainOverlay function used
in a browser-only replacement of the published Play module (existing bundle
import names were mapped). This did not publish the site. Verification:

- Home → Play at 1440×1000: grain top 0px during the active transition; the
  pre-nav screenshot has continuous texture without a flat strip.
- Transition completion: grain top and nav bottom both 53px.
- SpeedLab Screens detail open: nav bottom -67px, grain top 0px.
- Detail close: dialog removed, nav bottom and grain top both 53px.
- Zero browser JavaScript errors. Chromium reported the existing drawer
  pattern's focus/aria-hidden warning when opening a focused card; this change
  does not alter the drawer or its focus behavior.

Evidence: `play-nav-fixed-compiled-check-2026-09-19.txt`,
`play-nav-fixed-compiled-before-drop-2026-09-19.png`, and
`play-nav-fixed-compiled-settled-2026-09-19.png`. Original Framer source is saved
as `GrainOverlay.before-play-nav-2026-09-19.tsx`.
