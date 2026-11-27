---
title: Motion
section: Foundations
order: 5
description: Three curves, a short list of durations, the flip rail and type reveal, and how grab-able things move.
tokens: [motion.*]
---

# Motion

## Overview

Motion should feel like the site is alive, not performing. It decelerates into place, moves a few pixels or one line, exits faster than it enters, and respects `prefers-reduced-motion`. Three easing curves cover everything, and the first handles almost all of it.

## Easing

<!-- ds:easing -->

| Token | Curve | Use |
| --- | --- | --- |
| `--mh-ease-snappy` | `cubic-bezier(0.16, 1, 0.3, 1)` | **Default.** Flips, reveals, hover transforms, media scale, page transitions. |
| `--mh-ease-smooth` | `cubic-bezier(0.12, 0.23, 0.5, 1)` | Symmetric state changes: row hover wash, filter color, panels, count digits, loader bar, the `/play` drawer. |
| `--mh-ease-springy` | `cubic-bezier(0.25, 1, 0.5, 1)` | Gesture-like only: rule line draw, cursor trails. Never UI state. |

## Durations

| Token | Value | Use |
| --- | --- | --- |
| `--mh-duration-instant` | 150ms | Feedback: row hover wash, count digits, panel and lightbox exit |
| `--mh-duration-fast` | 250ms | Switches: tag color, panel and lightbox entry |
| `--mh-duration-zoom` | 260ms | The live case-study lightbox zoom |
| `--mh-duration-base` | 420ms | **Every text flip** and media hover scale |
| `--mh-duration-reveal` | 900ms | Type reveal; scroll-to-top travel |
| `--mh-duration-page` | 1200ms | Boot curtain lift, page transition |
| `--mh-duration-draw` | 2000ms | Rule line draw (200ms delay) |
| `--mh-stagger-reveal` | 90ms | Between lines in a type reveal |
| `--mh-stagger-media` | 58ms | Between Index thumbnails fading in |

## Flip rail

The site's main hover. A label sits over a second line in a one-line window; on hover or keyboard focus the stack slides up one line. Every flip on the site (nav, social links, View all, Read more, Scroll to top, project titles, Index rows, Play labels) runs **420ms Snappy**. On the live site that timing is one variable, `--mh-flip-duration`, set to `0ms` under reduced motion.

- The second line repeats the label on links and actions. Project cards read **VIEW PROJECT** and Index rows **View Project →**: the hover says what the click does.
- Below 810px nothing rolls; one label stays visible inside a 44px touch target.

```html example
<div class="ds-demo-row">
  <a class="mh-link mh-label" href="#">
    <span class="mh-flip"><span class="mh-flip__track"><span>Work</span><span aria-hidden="true">Work</span></span></span>
  </a>
  <a class="mh-link mh-label" href="#">
    <span class="mh-flip"><span class="mh-flip__track"><span>View all</span><span aria-hidden="true">View all</span></span></span>
  </a>
</div>
```

## Type reveal

Display lines rise into a clipping mask: start at `translateY(115%)`, end at 0, 900ms Snappy, 90ms between lines. Add `.mh-reveal` per line and set `--i` for the order; `components.js` adds `.is-in` when the line enters the viewport. On phones the Home hero renders in place without a reveal.

```html example
<h2 class="mh-text-display-m" style="margin:0">
  <span class="mh-reveal" style="--i:0"><span>About</span></span>
  <span class="mh-reveal" style="--i:1"><span>Micah</span></span>
</h2>
```

## Hover scale

Media inside a link scales to `--mh-scale-hover` (1.02) over 420ms Snappy. The frame doesn't move; only the image does. See [Media Frame](../components/media-frame.md).

## Gesture

Most of the site is hover and scroll. The exception is `/play`, an endless two-axis archive you drag, throw and wheel through. Its physics are the reference for anything new a visitor can grab.

> **`/play` is protected.** Its drag, inertia, video pool and WebKit clamp are performance contracts in the repo `AGENTS.md`. This section describes them; don't retune them. Run `npm test` after changing `Play.tsx` or `ArchivePlayground.tsx`.

| `/play` behavior | Value |
| --- | --- |
| Tap vs drag | 18px of movement before a press becomes a drag (`--mh-gesture-tap-threshold`) |
| Tracking | Pointer capture; the world moves by the pointer delta from where it was grabbed |
| Throw | Per-axis velocity × 1.75, ignored below 220 px/s, clamped at 5200 px/s |
| Deceleration | × 0.85 per 60fps frame (≈0.990/ms); the grid wraps, so there are no edges |
| Edge scroll | Within 90px of an edge, the world drifts at up to 220 px/s |
| Video | The center video pool freezes while moving and refills after it settles; max 6 concurrent in Chromium |
| Drawer | Opens 500ms, closes 400ms, Smooth; keyboard and reduced motion skip it |

Elsewhere, mobile pill rows use native horizontal scrolling, and the case-study carousels use 44px arrows and a scrolling dot strip.

### Springs for new grab-able UI

New things a visitor can drag, swipe or throw use springs, not fixed durations, so they can be caught and reversed mid-flight. Critically damped by default; bounce only after a throw.

| Token | Damping | Response |
| --- | --- | --- |
| `motion.spring.default` | 1.0 | 0.4s |
| `motion.spring.quick` | 1.0 | 0.3s |
| `motion.spring.momentum` | 0.8 | 0.4s (after a flick only) |

```js
// Motion / Framer Motion: bounce = 1 - damping, duration = response
const s = getComputedStyle(document.documentElement)
const spring = (name, velocity = 0) => ({
  type: "spring",
  bounce: 1 - parseFloat(s.getPropertyValue(`--mh-spring-${name}-damping`)),
  duration: parseFloat(s.getPropertyValue(`--mh-spring-${name}-response`)),
  velocity,
})

// Pick the snap target from where a throw would land, then hand off the velocity.
const project = (v, d = 0.99) => (v / 1000) * d / (1 - d)
animate(card, { x: nearestSnap(x + project(v)) }, spring("momentum", v))

// Past a bound, resist progressively instead of stopping.
const rubberband = (over, dim, c = 0.55) => (over * dim * c) / (dim + c * Math.abs(over))
```

Rules: show the pressed state on pointer-down; track 1:1 from the grab offset; wait 18px before committing to a direction; decide open/close by velocity sign; leave along the path you entered; under reduced motion, cross-fade in 200ms instead of moving.

## Don't

- No bounce, elastic or overshoot curves on UI.
- No parallax, scroll-jacking or auto-playing carousels.
- No looping attention animations (the grain shimmer is the only ambient motion).
- Don't build a second page-transition system; `PageTransition` (`gmalnRr`) owns route transitions and the boot curtain.
