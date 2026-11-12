---
title: Identity
section: Foundations
order: 7
description: The ©MH monogram, the © Micah Hoang wordmark, the name set in type, and where each appears.
---

# Identity

## Overview

The identity is the name. Two drawn marks exist, both outlined from the personal-identity Figma file: the compact **©MH monogram**, which the boot loader shows, and the full **© Micah Hoang wordmark**. Everywhere else the name is set in type. Consistency is what makes it work: the same words, set the same way, in the same places.

## Monogram

```html example surface=green
<img class="mh-monogram" src="../../assets/identity/monogram-cream.svg" alt="©MH">
```

```html example
<img class="mh-monogram" src="../../assets/identity/monogram-forest-green.svg" alt="©MH" style="--mh-monogram-size: 120px">
```

| File | Fill | Use |
| --- | --- | --- |
| `assets/identity/monogram.svg` | `currentColor` | Inline, takes the text color |
| `assets/identity/monogram-cream.svg` | Cream | `<img>` on Forest Green |
| `assets/identity/monogram-forest-green.svg` | Forest Green | `<img>` on Cream |

- **Source:** Figma personal-identity node `168:541`, saved unchanged at `assets/identity/micah-hoang-monogram.svg`. The design-system copies use the cleaned version (`micah-hoang-monogram-clean.svg`): three direct paths, with the © drawn as its filled outline plus a 4.94-unit centered stroke instead of the export's masked strokes. No masks, images or `use` elements.
- **Where:** the boot loader since 2026-11-11, at 237.5px desktop and 190px tablet (`--mh-monogram-width`). It replaced the full wordmark there.
- **Proportions:** viewBox `629.319 × 208.043` (about 3 : 1). Set width only.
- **Color:** Cream on Forest Green or Forest Green on Cream.

## Wordmark

```html example surface=green
<img class="mh-wordmark" src="../../assets/identity/wordmark-cream.svg" alt="© Micah Hoang">
```

```html example
<img class="mh-wordmark" src="../../assets/identity/wordmark-forest-green.svg" alt="© Micah Hoang" style="--mh-wordmark-width: 278px">
```

| File | Fill | Use |
| --- | --- | --- |
| `assets/identity/wordmark.svg` | `currentColor` | Inline in HTML or a code component, so it takes the text color |
| `assets/identity/wordmark-cream.svg` | Cream `#F7F5F0` | `<img>` on Forest Green |
| `assets/identity/wordmark-forest-green.svg` | Forest Green `#233324` | `<img>` on Cream |

- **Source:** Figma personal-identity node `91:521`, saved in the repo at `assets/identity/micah-hoang-copyright.svg`. The design-system copies use the live loader's corrected outline: the © is one filled and stroked path (no mask), which removes the antialiasing seams the original export showed. 11 paths, no bitmaps.
- **Proportions:** viewBox `7682.3 × 1025.01` (about 7.5 : 1). Never stretch it; set width only.
- **Size:** never wider than the viewport minus 64px (`.mh-wordmark` defaults to 556 / 444px, its old loader size). Don't render it below about 200px wide.
- **Status:** not currently placed on the live site. It was the loader identity from 2026-10-23 until the monogram replaced it on 2026-11-11; keep it for contexts that need the full name as a mark.
- **Color:** Cream on Forest Green or Forest Green on Cream. No other colors, outlines or effects.
- **Render as vector.** Inline SVG or `<img>`. The live loader moved off a CSS mask because it looked soft at small sizes.

## Marks set in type

| Mark | Setting | Where |
| --- | --- | --- |
| **Micah Hoang** (display) | Display XL, GT Standard Bold, Forest Green | Home hero, once |
| **MICAH HOANG** (label) | Mono label, uppercase | Nav, top left, every page; links home |
| **©2026** | Mono label | Right end of the hero link row and the footer bar |
| **MICAH.HOANG @HEY.COM** | Display Footer + mono superscript | Footer contact |

```html example
<div class="ds-demo-stack">
  <p class="mh-text-display-xl" style="margin:0">Micah Hoang</p>
  <div class="ds-demo-row" style="justify-content:space-between">
    <span class="mh-label">Micah Hoang</span>
    <span class="mh-label">Brand designer</span>
    <span class="mh-label">©2026</span>
  </div>
</div>
```

## Descriptor

The positioning line sits under the hero name in the Heading style, broken over two lines:

> Brand designer with
> a systems mind.

The nav repeats it in short form: `BRAND DESIGNER` and `LOS ANGELES, CALIFORNIA`.

## Usage

- Write the name exactly "Micah Hoang"; uppercase only through mono labels.
- The copyright year comes from `FooterCopyrightYear` (`BF2H03E`) in Framer; don't hard-code a different year. The wordmark's © carries no year.
- Use the drawn marks only where the name stands alone. Don't put them in the nav, footer or hero, which set the name in type.
- Don't draw new marks (another monogram, a favicon glyph, a logo). The ©MH monogram and the wordmark are the complete set.
