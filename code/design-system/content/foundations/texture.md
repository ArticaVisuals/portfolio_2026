---
title: Texture
section: Foundations
order: 6
description: The umber film grain that sits over every page, and how to keep it out of the way.
tokens: [texture.grain.*, color.primitive.grain-umber]
---

# Texture

## Overview

A faint, slowly shimmering film grain sits over the page. It warms the Cream ground and keeps large flat areas from looking like a screen. It's an SVG `feTurbulence` noise, desaturated, tinted umber, and multiplied at 10% opacity. It starts **below the navigation bar** so the nav stays crisp.

| Token | Value | Framer control (GrainOverlay) |
| --- | --- | --- |
| `--mh-grain-opacity` | 0.1 | Grain Opacity |
| `--mh-grain-blend` | multiply | Blend |
| `--mh-grain-color` | `#501D07` | Color |
| `--mh-grain-base-frequency` | 1.14 | Grain Size |
| `--mh-grain-octaves` | 4 | Detail |
| `--mh-grain-exposure` | -0.58 | Exposure |
| `--mh-grain-contrast` | 2.35 | Contrast |
| `--mh-grain-shimmer-fps` | 16 | Shimmer FPS |

## Example

Here the grain is shown at full strength on the left and at the brand's 10% on the right.

```html example bleed
<div class="ds-demo-row" style="gap:0">
  <div class="ds-demo-frame" style="flex:1;height:200px">
    <div class="mh-grain" data-contained style="opacity:1">
      <svg aria-hidden="true"><filter id="grain-demo-a" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="1.14" numOctaves="4" stitchTiles="stitch" seed="7"/><feComponentTransfer><feFuncR type="linear" slope="2.35" intercept="-0.58"/><feFuncG type="linear" slope="2.35" intercept="-0.58"/><feFuncB type="linear" slope="2.35" intercept="-0.58"/></feComponentTransfer><feColorMatrix type="saturate" values="0"/><feColorMatrix type="matrix" values="0.314 0 0 0 0 0.114 0 0 0 0 0.027 0 0 0 0 0 0 0 0 1"/></filter><rect width="100%" height="100%" filter="url(#grain-demo-a)"/></svg>
    </div>
  </div>
  <div class="ds-demo-frame" style="flex:1;height:200px">
    <div class="mh-grain" data-contained>
      <svg aria-hidden="true"><rect width="100%" height="100%" filter="url(#grain-demo-a)"/></svg>
    </div>
  </div>
</div>
```

The full snippet lives on the [Grain Overlay](../components/grain-overlay.md) page.

## Usage

- One grain layer per page, fixed to the viewport, `pointer-events: none`.
- Keep the nav clear: the layer starts at `--mh-nav-height`.
- The shimmer re-seeds the noise 16 times a second. It turns off under reduced motion, and the live site disables it on WebKit `/play` for performance.
- Don't put grain inside components or on media. It's a single page-level layer.

## Don't

- Don't raise opacity above 0.1 or switch the blend away from multiply; it starts reading as dirt.
- Don't add other textures (paper, noise PNGs, gradients).
