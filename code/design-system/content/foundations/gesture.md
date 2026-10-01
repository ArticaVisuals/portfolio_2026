---
title: Gesture
section: Foundations
order: 5.5
description: How things the visitor can grab should move. What /play already does, and the spring tokens for any new drag, swipe or sheet.
tokens: [motion.spring.*, motion.gesture.*]
---

# Gesture

## Overview

Most of the site is hover and scroll. The exception is `/play`, an endless two-axis archive you drag, throw and wheel through. This page describes its physics, so new gesture UI feels like the same material, and it defines spring tokens for that new work. See [Interaction Principles](interaction.md) for the reasoning.

> **`/play` is protected.** Its drag, inertia, video pool and WebKit clamp are performance contracts (repo `AGENTS.md`). This page describes them. It does not ask anyone to retune them. Run `npm test` after any change to `Play.tsx` or `ArchivePlayground.tsx`.

## What /play does (already true)

| Behavior | Value | Source |
| --- | --- | --- |
| Pointer capture on press | `setPointerCapture` | `ArchivePlayground.tsx` (`QNpkYp5`) |
| Grab offset respected | World moves by pointer delta from its origin, never re-centers | same |
| Tap vs drag threshold | 18px (`--mh-gesture-tap-threshold`) | `TAP_THRESHOLD` |
| Velocity | Per-axis `vx`, `vy` from the last move sample × 1.75 | `throwVelocityScale` |
| Throw range | Ignored below 220 px/s, clamped at 5200 px/s | `throwMinSpeed`, `throwMaxSpeed` |
| Deceleration | Velocity × 0.85 per 60fps frame (exponential decay, ≈0.990/ms) | `throwFriction` |
| Boundaries | None. The grid wraps infinitely, so no rubber-band is needed | n/a |
| Edge scrolling | Pointer within 90px of an edge drifts the world at up to 220 px/s | `edgeScrollZone`, `edgeScrollSpeed` |
| Smooth scroll | Lenis is destroyed on `/play`; the archive owns wheel input | `NavigationScrollGuard` (`Wnd19lx`) |
| Video during motion | The center video pool freezes during drag, throw and edge scroll and refills after settling; max 6 concurrent in Chromium/Arc | `Play.tsx` (`PN1RVOf`) |

## Springs for new work

When you build something new that the visitor can grab, such as a sheet, a swipeable gallery or a draggable comparison slider, animate it with a spring, not a fixed-duration curve. A spring starts from the current on-screen value and carries velocity, so it can be grabbed and reversed mid-flight.

| Token | Damping | Response | Use |
| --- | --- | --- | --- |
| `motion.spring.default` | 1.0 | 0.4s | Settling, snapping, repositioning. The default. |
| `motion.spring.quick` | 1.0 | 0.3s | Short moves: thumbs, toggles, small slides. |
| `motion.spring.momentum` | 0.8 | 0.4s | Only when a flick or throw preceded it. |

CSS variables: `--mh-spring-default-damping`, `--mh-spring-default-response`, and so on.

```js
// Motion / Framer Motion. bounce = 1 - damping, duration = response
import { animate } from "motion"

const s = getComputedStyle(document.documentElement)
const spring = (name, velocity = 0) => ({
  type: "spring",
  bounce: 1 - parseFloat(s.getPropertyValue(`--mh-spring-${name}-damping`)),
  duration: parseFloat(s.getPropertyValue(`--mh-spring-${name}-response`)),
  velocity,
})

animate(sheet, { y: 0 }, spring("default"))
animate(card, { x: target }, spring("momentum", releaseVelocity)) // after a flick only
```

## Rules for new gesture UI

1. **Feedback on pointer-down.** Show the pressed state immediately; commit on release.
2. **Track 1:1** with pointer capture, from the grab offset.
3. **Threshold first.** Wait for 18px of movement before committing to a drag direction; below that it's a tap.
4. **Hand off velocity.** Pass the release velocity into the spring (`velocity` option).
5. **Project, then snap.** Choose the snap target from where the throw would land, not where the finger lifted:
   ```js
   const project = (v, d = 0.99) => (v / 1000) * d / (1 - d) // d = 0.99 matches /play's feel
   const target = nearestSnap(current + project(velocity))
   ```
6. **Decide by velocity sign**, not position, when choosing open vs close.
7. **Rubber-band** past bounds instead of stopping hard:
   ```js
   const rubberband = (over, dim, c = 0.55) => (over * dim * c) / (dim + c * Math.abs(over))
   ```
8. **Same path in and out.** A sheet that rises from the bottom dismisses to the bottom.
9. **Reduced motion:** swap slides and springs for a 200ms opacity cross-fade; keep the state change.
10. **Animate only `transform` and `opacity`.**

## Don't

- Don't use springs for hover, reveal or color changes. The bezier canon covers those.
- Don't add bounce to anything that wasn't thrown.
- Don't touch `/play`'s physics to "match" these springs. They're already consistent.
