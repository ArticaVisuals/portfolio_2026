---
title: Rule
section: Components
order: 5
description: The 1px near-black line that does the work boxes and cards do elsewhere, with an optional draw-in.
status: live
framer: 1px Frame (fill /Near Black) or native "Line Animation"; LineAnimationBorder (j7WYIMf)
codeFileId: j7WYIMf
classes: [mh-rule]
tokens: [border.hairline, color.*.border.rule, motion.duration.draw, motion.ease.springy]
---

# Rule

## Examples

```html example
<div class="ds-demo-stack">
  <hr class="mh-rule">
  <div class="ds-demo-row" style="justify-content:space-between">
    <span class="mh-label">LinkedIn, Resume, Email, Cosmos</span>
    <span class="mh-label">©2026</span>
  </div>
  <hr class="mh-rule">
</div>
```

### Line draw

Scroll it into view (or reload) to see it draw from the left.

```html example
<hr class="mh-rule" data-draw>
```

## Usage

- A full-width rule separates **sections** (above a Section Header), **groups** (index year groups) and **rows** (index rows).
- Rules are always 1px, full opacity, `--mh-border-rule`. On Forest Green they turn Cream.
- Rules span the content width (gutter to gutter), never a fraction of it.
- Line draw is for the first appearance of a major rule (hero base, section starts). Don't animate row dividers.

## API

| Attribute | Effect |
| --- | --- |
| `<hr class="mh-rule">` | 1px full-width rule |
| `data-draw` | Starts at `scaleX(0)`; draws over 2000ms Springy with a 200ms delay once `components.js` adds `.is-in` |

## Accessibility

- Use `<hr>` when the rule marks a thematic break; use a CSS border (`border-top: var(--mh-border-hairline) solid var(--mh-border-rule)`) when it's purely visual, as in index rows.

## Framer mapping

- Static: a 1px-tall Frame filled with near-black `#141414`.
- Animated: native **Line Animation** (0.2s delay, 2s, `[0.25, 1, 0.5, 1]`) or `LineAnimationBorder` (`j7WYIMf`) for a non-destructive border frame with a `Viewport Once` trigger.
- Index dividers are controlled by `IndexPage` (`rgAZFOv`) `dividerSubtle` and stay full-opacity `#141414`.

## Don't

- Don't use gray or semi-transparent rules.
- Don't use 2px or dashed rules.
- Don't box content with four rules; a rule only ever runs horizontally.
