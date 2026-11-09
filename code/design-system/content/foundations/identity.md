---
title: Identity
section: Foundations
order: 7
description: The name as wordmark, the ©2026 signature, and where each appears.
---

# Identity

## Overview

There is no logo. The identity is the name set in type, plus a few repeated signatures. Consistency is what makes it work: the same words, set the same way, in the same places.

## Marks

| Mark | Setting | Where |
| --- | --- | --- |
| **Micah Hoang** (display) | Display XL, GT Standard Bold, Forest Green | Home hero, once |
| **MICAH HOANG** (label) | Mono label, uppercase | Nav, top left, every page; links home |
| **Micah Hoang ©2026** | Heading style, GT Standard Regular, Cream on Forest Green, centered | Boot loader identity |
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

```html example surface=green
<p class="mh-loader__identity" style="color:var(--mh-text-brand)">Micah Hoang ©2026</p>
```

## Descriptor

The positioning line sits under the hero name in the Heading style, broken over two lines:

> Brand designer with
> a systems mind.

The nav repeats it in short form: `BRAND DESIGNER` and `LOS ANGELES, CALIFORNIA`.

## Usage

- Write the name exactly "Micah Hoang"; uppercase only through mono labels.
- The copyright year comes from `FooterCopyrightYear` (`BF2H03E`) in Framer; don't hard-code a different year.
- Don't add a monogram, logo or favicon glyph that isn't the name.
