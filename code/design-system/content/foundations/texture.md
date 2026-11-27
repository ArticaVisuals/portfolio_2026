---
title: Texture
section: Foundations
order: 6
description: The umber film grain that sits over every page below the nav, and the one snippet that draws it.
status: live
framer: GrainOverlay (MhR7Ukl)
codeFileId: MhR7Ukl
classes: [mh-grain]
tokens: [texture.grain.*, color.primitive.grain-umber, component.nav.height, z.grain]
---

# Texture

## Overview

A faint, slowly shimmering film grain sits over the page. It warms the Cream ground and keeps large flat areas from looking like a screen: SVG `feTurbulence` noise, desaturated, tinted umber and multiplied at 10%. It starts **below the navigation bar** so the nav stays crisp.

The preview boosts opacity to 0.35 so the grain is visible; the brand value is 0.1.

```html example bleed
<div class="ds-demo-frame" style="height:220px">
  <div style="padding:40px"><p class="mh-text-display-m" style="margin:0">About Micah</p></div>
  <div class="mh-grain" data-contained data-animate style="opacity:.35">
    <svg aria-hidden="true">
      <filter id="mh-grain-demo" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="1.14" numOctaves="4" stitchTiles="stitch" seed="7"/>
        <feComponentTransfer>
          <feFuncR type="linear" slope="2.35" intercept="-0.58"/>
          <feFuncG type="linear" slope="2.35" intercept="-0.58"/>
          <feFuncB type="linear" slope="2.35" intercept="-0.58"/>
        </feComponentTransfer>
        <feColorMatrix type="saturate" values="0"/>
        <feColorMatrix type="matrix" values="0.314 0 0 0 0  0.114 0 0 0 0  0.027 0 0 0 0  0 0 0 0 1"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#mh-grain-demo)"/>
    </svg>
  </div>
</div>
```

## Page snippet

Once per page, as the last child of `body`. The last matrix multiplies the gray noise by umber `#501D07` (80/255, 29/255, 7/255).

```html
<div class="mh-grain" data-animate aria-hidden="true">
  <svg><filter id="mh-grain" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="1.14" numOctaves="4" stitchTiles="stitch" seed="7"/>
    <feComponentTransfer><feFuncR type="linear" slope="2.35" intercept="-0.58"/><feFuncG type="linear" slope="2.35" intercept="-0.58"/><feFuncB type="linear" slope="2.35" intercept="-0.58"/></feComponentTransfer>
    <feColorMatrix type="saturate" values="0"/>
    <feColorMatrix type="matrix" values="0.314 0 0 0 0  0.114 0 0 0 0  0.027 0 0 0 0  0 0 0 0 1"/>
  </filter><rect width="100%" height="100%" filter="url(#mh-grain)"/></svg>
</div>
```

## Values

| Token | Value | Framer control |
| --- | --- | --- |
| `--mh-grain-opacity` | 0.1 | Grain Opacity |
| `--mh-grain-blend` | multiply | Blend |
| `--mh-grain-color` | `#501D07` | Color |
| `--mh-grain-base-frequency` | 1.14 | Grain Size |
| `--mh-grain-octaves` | 4 | Detail |
| `--mh-grain-exposure` / `-contrast` | -0.58 / 2.35 | Exposure / Contrast |
| `--mh-grain-shimmer-fps` | 16 | Shimmer FPS |

| Attribute | Effect |
| --- | --- |
| `class="mh-grain"` | Fixed layer below the nav: opacity 0.1, multiply, `pointer-events: none` |
| `data-contained` | Absolute inside a positioned parent (previews) |
| `data-animate` | Re-seeds the noise 16 times a second; stops under reduced motion |

## Framer mapping

`GrainOverlay` (`MhR7Ukl`) portals a fixed layer to `<body>` with **Clear Nav** on, so the grain starts at the nav's bottom edge (full height during page transitions, so no blank strip shows). On `/play` it's static outside WebKit and turned off on WebKit (`disableOnWebKit`), a Play performance contract; keep it that way.

## Don't

- Don't raise opacity above 0.1 or switch the blend away from multiply; it reads as dirt.
- Don't put grain inside components or on media; it's one page-level layer.
- Don't add other textures (paper, noise PNGs, gradients).
