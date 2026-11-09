---
title: Layout
section: Foundations
order: 4
description: Edge-to-edge content inside a 20px gutter, two- and three-column grids, rules instead of boxes, three breakpoints.
tokens: [space.*, layout.*, radius.*, border.*, elevation.*]
---

# Layout

## Overview

Pages run edge to edge inside a small gutter, with no max-width container. Structure comes from a few grids, 1px rules and a lot of vertical space, never from cards or boxes. The system is flat: no shadows, and the only radius is the pill.

## Breakpoints

Desktop-first, matching the Framer frames.

| Name | Range | Framer frame | Media query |
| --- | --- | --- | --- |
| Desktop | ≥ 1200px | 1200 | (default) |
| Tablet | 810–1199px | 810 | `@media (max-width: 1199px)` |
| Mobile | < 810px | 390 | `@media (max-width: 809px)` |

## Gutter and grids

| Token | Desktop | Tablet | Mobile | Use |
| --- | --- | --- | --- | --- |
| `--mh-gutter` | 20px | 20px | 15px | Page side padding (`.mh-container`) |
| `--mh-column-gap` | 20px | 20px | 20px | Card grids, index columns |
| `--mh-split-gap` | 30px | 30px | n/a (stacks) | Two-column text splits (`.mh-split`, meta grid) |
| `--mh-card-row-gap` | 50px | 50px | 50px | Between project-card rows |
| `--mh-measure` | 580px | 580px | 100% | Long-form body |
| `--mh-nav-gutter` | 20px | 20px | 20px | Nav and hero link row (doesn't drop to 15 on mobile) |
| `--mh-section-padding-y` | 100px | 100px | 100px | Hero bottom, section bottom |
| `--mh-hero-name-top` | 90px | 90px | 97px | Hero top → name line box (nav overlays it) |
| `--mh-hero-descriptor-top` | 220px | 186px | 162px | Hero top → descriptor |
| `--mh-section-header-after` | 70px | 70px | 50px | Section title → content |
| `--mh-footer-min-height` | 50vh | 40vh | 50vh | Home CTA/footer block |
| `--mh-nav-height` | 53px | 53px | 53px | Sticky nav; grain starts below it |

Grids in use on the live site:

| Grid | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| Selected work | 2 columns | 2 columns | 1 column |
| Other projects / index grid | 3 columns | 2 columns | 1 column |
| Case-study meta / split | 2 columns | 2 columns | 1 column |
| Index list | year + 5fr content | year + content | stacked |
| Navigation | 4 zones (name, role, location, links) | 4 zones | name + links |

```html example
<div class="mh-split">
  <div style="background:var(--mh-bg-hover);height:120px"></div>
  <div style="background:var(--mh-bg-hover);height:120px"></div>
</div>
```

## Space scale

<!-- ds:space-scale -->

| Token | Value | Typical use |
| --- | --- | --- |
| `--mh-space-1` | 4px | Optical nudges |
| `--mh-space-2` | 6px | Tag gap |
| `--mh-space-3` | 8px | Inline groups |
| `--mh-space-4` | 12px | Row padding |
| `--mh-space-5` | 16px | Card internal stack (meta → media → tags) |
| `--mh-space-6` | 20px | Gutter, small blocks |
| `--mh-space-7` | 24px | Small blocks |
| `--mh-space-8` | 30px | Nav link gap, split gap |
| `--mh-space-9` | 40px | Between meta items |
| `--mh-space-10` | 50px | Card row gap |
| `--mh-space-11` | 72px | Inside sections; lightbox padding |
| `--mh-space-12` | 100px | Section padding (Framer) |
| `--mh-space-13` | 144px | Extra-large breaks (docs only) |

## Shape and elevation

| Token | Value | Use |
| --- | --- | --- |
| `--mh-radius-none` | 0 | Everything by default: media, sections, surfaces |
| `--mh-radius-hairline` | 2px | Index row hover wash only |
| `--mh-radius-pill` | 250px | Tags, pill actions |
| `--mh-border-hairline` | 1px | The only border width |
| `--mh-elevation-none` | none | The brand is flat |

## Where these numbers come from

Desktop values are read from the Framer project (Home page layers via the Framer MCP): section padding `100px 20px`, rule → title `20px`, title → grid `60px` + `10px` stack gap, grid → View all `30px`, About title → content `30px`, content → Scroll to top `60px`. Tablet and mobile values were measured on micahhoang.com at 810px and 390px, because the MCP can't open breakpoint frames. Re-check them after any Framer layout change.

## Usage

- **Rules, not boxes.** Separate sections with a full-width [Rule](../components/rule.md); separate rows with rules; never wrap content in a bordered or shadowed card.
- **Space is the main tool.** When a layout feels busy, add vertical space between sections before anything else.
- **Align to the gutter.** Every left edge on a page (nav, hero, headings, grid) sits on `--mh-gutter`.
- **Framer**: build with Stacks (vertical, gap = space token) and Grids (`1fr` columns, gap = column-gap token); set tablet and phone overrides on the breakpoint frames rather than using fixed pixel widths.

## Don't

- Don't cap content with a centered max-width container.
- Don't add drop shadows, rounded media or card backgrounds.
- Don't use borders other than 1px.
