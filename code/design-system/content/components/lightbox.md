---
title: Lightbox
section: Components
order: 17
description: A white full-screen viewer for case-study media, with thin near-black arrows and a quick zoom.
status: live
framer: CaseStudyLightbox (F2K4_SV) via CaseStudyControllers (z13WRHS)
codeFileId: F2K4_SV
classes: [mh-lightbox, mh-lightbox__media, mh-lightbox__btn]
tokens: [color.*.bg.media, color.primitive.near-black, motion.duration.zoom, space.11, z.overlay]
---

# Lightbox

## Examples

Click any image to open the viewer. Use ← → to step through and Esc to close.

```html example
<div class="mh-split" data-mh-lightbox>
  <div class="mh-media"><img src="../../assets/samples/gaia.jpg" alt="Gaia app on a phone in a field of daisies"></div>
  <div class="mh-media"><img src="../../assets/samples/peak-energy.jpg" alt="Peak Energy battery modules, line illustration"></div>
</div>
```

## Usage

- Opt in a gallery or section by adding `data-mh-lightbox` to its container; every `img` inside becomes openable and steppable.
- Backdrop is white, chrome is near-black at weight 300, 24px. No counter by default.
- Zoom is 260ms Snappy and starts **from the clicked thumbnail**: the live component clones the media over its source rect, keeps it opaque, and zooms it to full size while the white backdrop fades in. The `components.js` version here is a simplified center scale (0.96 → 1); match the live behavior, not the demo.
- Tapping the image advances; navigation loops.
- 72px padding around the media on desktop, 16px on mobile.

## API

| Hook | Notes |
| --- | --- |
| `data-mh-lightbox` (container) | Images inside open the lightbox (`components.js`) |
| `.mh-lightbox[data-open]` | Generated overlay; `role="dialog"` `aria-modal="true"` |
| `.mh-lightbox__btn[data-dir]` | `prev`, `next`, `close` |

## Accessibility

- Focus moves to Close on open and returns to the clicked image on close.
- Esc closes; arrow keys step. Page scroll is locked while open.
- Buttons have `aria-label`s; the image keeps its `alt`.

## Framer mapping

- `CaseStudyLightbox` (`F2K4_SV`), loaded by `CaseStudyControllers` (`z13WRHS`) at a pinned module hash. If you republish the lightbox, bump the pinned hash in the controller.
- Controls (defaults): Background `rgb(255,255,255)`, Arrows/X `rgb(20,20,20)`, Icon Weight 300, Icon Size 24px, Zoom 260ms, Padding 72px, Tap = Next on, Loop on, Counter off, Videos on.
- The lightbox sits outside Lenis smooth scrolling (`data-lenis-prevent`).

## Don't

- Don't darken the backdrop; the viewer is white like a light table.
- Don't add captions, thumbnails strips or share buttons.
