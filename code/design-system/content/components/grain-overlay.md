---
title: Grain Overlay
section: Components
order: 21
description: The page-level SVG film grain, fixed under the nav, multiplied at 10%, with an optional 16fps shimmer.
status: live
framer: GrainOverlay (MhR7Ukl)
codeFileId: MhR7Ukl
classes: [mh-grain]
tokens: [texture.grain.*, layout.nav-height, z.grain]
---

# Grain Overlay

## Examples

The preview below boosts opacity to 0.35 so the grain is visible; the brand value is 0.1.

```html example bleed
<div class="ds-demo-frame" style="height:220px">
  <div style="padding:40px"><p class="mh-text-display-m" style="margin:0">Selected work</p></div>
  <div class="mh-grain" data-contained data-animate style="opacity:.35">
    <svg aria-hidden="true">
      <filter id="mh-grain-filter" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="1.14" numOctaves="4" stitchTiles="stitch" seed="7"/>
        <feComponentTransfer>
          <feFuncR type="linear" slope="2.35" intercept="-0.58"/>
          <feFuncG type="linear" slope="2.35" intercept="-0.58"/>
          <feFuncB type="linear" slope="2.35" intercept="-0.58"/>
        </feComponentTransfer>
        <feColorMatrix type="saturate" values="0"/>
        <feColorMatrix type="matrix" values="0.314 0 0 0 0  0.114 0 0 0 0  0.027 0 0 0 0  0 0 0 0 1"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#mh-grain-filter)"/>
    </svg>
  </div>
</div>
```

## Page snippet

Place once, as the last child of `body`:

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

The last matrix multiplies the grey noise by the umber `#501D07` (80/255, 29/255, 7/255).

## Usage

- One per page. Fixed, `pointer-events: none`, starting at `--mh-nav-height` so the nav stays clean.
- `data-animate` re-seeds the noise at 16fps; it stops under reduced motion.
- During page transitions the live site runs the grain full height so no blank strip shows before the nav arrives.

## API

| Attribute | Notes |
| --- | --- |
| `class="mh-grain"` | Fixed layer: opacity 0.1, multiply, `z-index: var(--mh-z-grain)` |
| `data-contained` | Absolute inside a positioned parent (previews) |
| `data-animate` | 16fps shimmer (`components.js`) |

## Framer mapping

- `GrainOverlay` (`MhR7Ukl`) portals a fixed layer to `<body>`. Controls: Grain on, Clear Nav on, Grain Opacity 0.1, Blend multiply, Color `#501d07`, Exposure -0.58, Contrast 2.35, Grain Size 1.14, Detail 4, Animate on, Shimmer FPS 16, Z-Index 10.
- On `/play` and `/play-hover-preview` the instance is static outside WebKit and `disableOnWebKit=true`. Keep it that way (Play performance contract).

## Don't

- Don't add grain to individual components or images.
- Don't use a PNG noise texture instead.
