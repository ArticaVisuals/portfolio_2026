---
title: Motion
section: Foundations
order: 5
description: Three curves, a short list of durations, and the two signature moves, the flip rail and the type reveal.
tokens: [motion.*]
---

# Motion

## Overview

Motion should feel like the site is alive, not performing. It decelerates into place, moves only a few pixels, and respects `prefers-reduced-motion`. There are three easing curves, and the first one handles almost everything.

## Easing

<!-- ds:easing -->

| Token | Curve | Use |
| --- | --- | --- |
| `--mh-ease-snappy` | `cubic-bezier(0.16, 1, 0.3, 1)` | **Default.** Reveals, hover transforms, media scale, fades, page transitions. |
| `--mh-ease-smooth` | `cubic-bezier(0.12, 0.23, 0.5, 1)` | Symmetric changes: row hover wash, filter color, loader bar. |
| `--mh-ease-springy` | `cubic-bezier(0.25, 1, 0.5, 1)` | Gesture-like only: rule line draw, cursor trails. Never UI state. |

## Durations

| Token | Value | Use |
| --- | --- | --- |
| `--mh-duration-instant` | 150ms | Row hover wash |
| `--mh-duration-fast` | 250ms | Color changes (tag hover) |
| `--mh-duration-zoom` | 260ms | Lightbox open / close |
| `--mh-duration-base` | 420ms | Hover transforms: flip rail, media scale |
| `--mh-duration-slow` | 620ms | Index flip rail, media fade-in |
| `--mh-duration-reveal` | 900ms | Type reveal; scroll-to-top travel |
| `--mh-duration-page` | 1200ms | Boot curtain lift, page transition |
| `--mh-duration-draw` | 2000ms | Rule line draw (200ms delay) |
| `--mh-stagger-reveal` | 90ms | Between lines in a type reveal |
| `--mh-stagger-media` | 58ms | Between thumbnails fading in |

## Springs

Hovers and reveals use the curves above. Anything the visitor can **grab** (drag, swipe, sheets) uses spring tokens instead: critically damped by default, bounce only after a throw. See [Gesture](gesture.md) and [Interaction Principles](interaction.md).

| Token | Damping | Response |
| --- | --- | --- |
| `motion.spring.default` | 1.0 | 0.4s |
| `motion.spring.quick` | 1.0 | 0.3s |
| `motion.spring.momentum` | 0.8 | 0.4s |

## Flip rail

The site's main hover. A label is stacked over a copy of itself in a one-line window; on hover the stack slides up by one line plus `--mh-distance-flip-gap` (5px). Used on nav links, project titles, index rows and text actions. It works with CSS alone.

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

Display lines rise into a clipping mask: start at `translateY(115%)`, end at 0, 900ms Snappy, 90ms between lines. Add `.mh-reveal` per line and set `--i` for the order; `components.js` adds `.is-in` when it enters the viewport.

```html example
<h2 class="mh-text-display-m" style="margin:0">
  <span class="mh-reveal" style="--i:0"><span>Selected</span></span>
  <span class="mh-reveal" style="--i:1"><span>work</span></span>
</h2>
```

## Hover scale

Media inside a link scales to `--mh-scale-hover` (1.02) over 420ms Snappy. The frame doesn't move; only the image does, clipped by the frame. See [Media Frame](../components/media-frame.md).

## Usage

- Default to Snappy + 420ms. Reach for anything else only if the table above says so.
- Move things a few pixels or one line. Don't fly elements in from off-screen.
- Animate `transform` and `opacity` only.
- Under `prefers-reduced-motion: reduce`, transitions collapse to 1ms and reveals render in place (`css/base.css`).
- **Framer**: use the same curves in Appear/Hover effects (Framer "Custom bezier"). Page transitions and the boot curtain belong to `PageTransition` (`gmalnRr`); don't build a second transition system.

## Don't

- No bounce, elastic or overshoot curves on UI (the `momentum` spring is only for thrown gestures).
- No parallax, scroll-jacking or auto-playing carousels.
- No looping attention animations on UI (the grain shimmer is the only ambient motion).
