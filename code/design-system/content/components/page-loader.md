---
title: Page Loader
section: Components
order: 20
description: The first-visit boot curtain. Forest Green, a Cream progress bar, the name centered, then a lift.
status: live
framer: PageTransition (gmalnRr) + PageTransitionRuntime (rdTIUkW)
codeFileId: gmalnRr
classes: [mh-loader, mh-loader__bar, mh-loader__identity]
tokens: [color.primitive.forest-green, color.primitive.cream, motion.duration.page, z.loader]
---

# Page Loader

## Examples

```html example bleed
<div class="ds-demo-frame">
  <div class="mh-loader" data-contained>
    <span class="mh-loader__bar"></span>
    <p class="mh-loader__identity">Micah Hoang ©2026</p>
  </div>
  <button class="mh-action" data-variant="pill" type="button" data-play-loader style="position:absolute;right:16px;bottom:16px;color:var(--mh-text-brand)">Replay</button>
</div>
```

Press **Replay** to run the sequence.

## Sequence

| Step | What happens | Timing |
| --- | --- | --- |
| 1. Boot | Forest Green covers the viewport; "Micah Hoang ©2026" centered in Cream | Painted at parse time, before the app hydrates |
| 2. Progress | An 8px Cream bar fills from the left along the top edge | ≥ 1200ms (`bootMinMs`), Smooth |
| 3. Identity out | The name fades | 420ms, during bar completion |
| 4. Lift | The curtain slides up and off | 1200ms, Snappy |

## Usage

- **Home only, first visit only** (direct entries and reloads of `/`). Never on internal navigations, case studies or mobile ≤ the boot-disable width.
- The identity uses the Heading style: 30 / 24 / 19px, 120% leading, -1% tracking.
- `theme-color` and the page canvas are synced to Cream, so mobile browser chrome doesn't flash green afterward.
- Videos behind the curtain hold until it lifts.

## API

| Class / attribute | Notes |
| --- | --- |
| `mh-loader` | Fixed full-viewport curtain. `data-contained` makes it `position:absolute` for previews |
| `mh-loader__bar` | 8px progress bar (scaleX) |
| `mh-loader__identity` | Centered name |
| `data-state` | `idle` → `loading` → `done` → `lifted` |
| `data-autoplay` / `window.mhPlayLoader(el)` | Run the sequence (`components.js`) |

## Framer mapping

- `PageTransition` (`gmalnRr`) owns the boot loader and every route transition (view-transition curtain, prerender speculation rules, appear replay). Controls: `Boot` Show/Off, `Boot mode` Auto/Always, `Boot color` `#233324`, `Bar color` `#F7F5F0`, `Bar height` 8px, `bootMinMs` 1200.
- Read `docs/framer-page-transition.md` before changing anything here. **Don't build a second loader or transition layer.**

## Don't

- Don't show percentages, spinners or a logo animation.
- Don't run the loader on every navigation.
