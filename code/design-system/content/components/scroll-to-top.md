---
title: Scroll to Top
section: Components
order: 19
description: A mono text action at the end of long pages that glides back to the top in 900ms.
status: live
framer: ScrollToTopButton (gh4ngZN)
codeFileId: gh4ngZN
classes: [mh-scroll-top, mh-action]
tokens: [type.label, motion.duration.reveal, motion.ease.snappy]
---

# Scroll to Top

## Examples

```html example
<button class="mh-action mh-scroll-top" type="button">
  <span class="mh-flip"><span class="mh-flip__track"><span>Scroll to top ↑</span><span aria-hidden="true">Scroll to top ↑</span></span></span>
</button>
```

## Usage

- Place it at the end of long pages (Home, About), right-aligned above the footer.
- 900ms with a Snappy-like curve. Jumps instantly under reduced motion.
- Uses the same flip rail as every other text action.

## API

| Class / attribute | Notes |
| --- | --- |
| `mh-action mh-scroll-top` | Text action; `components.js` handles the scroll |
| `data-target` | Optional selector of a scroll container (default: the document) |

## Framer mapping

- `ScrollToTopButton` (`gh4ngZN`). Defaults: label `scroll to top`, color `#233324`, duration 900ms, easing `cubic-bezier(0.16, 1, 0.3, 1)`. It hands off to the global Lenis instance when available and falls back to its own rAF loop.

## Don't

- Don't make it a floating circular button.
- Don't show it on short pages.
