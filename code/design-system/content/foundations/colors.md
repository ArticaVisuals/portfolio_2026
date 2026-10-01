---
title: Colors
section: Foundations
order: 2
description: Two surfaces, Cream and Forest Green, and the semantic roles that re-map between them.
tokens: [color.primitive.*, color.cream.*, color.green.*]
---

# Colors

## Overview

The palette is deliberately small: a warm Cream ground, one Forest Green for brand and inversion, and a few neutrals for hierarchy. Project media supplies the rest of the color. Always write **semantic roles** (`--mh-text-muted`), never primitives (`--mh-color-light-gray`). Roles re-map automatically inside `data-surface="green"`.

## Primitives

<!-- ds:swatches primitive -->

| Token | Value | Framer style | Role |
| --- | --- | --- | --- |
| `--mh-color-cream` | `#F7F5F0` | `/Cream` | Page background; text on Forest Green |
| `--mh-color-forest-green` | `#233324` | `/Forest Green` | Brand: display type, nav, labels; inverse surface |
| `--mh-color-accent-green` | `#25593A` | none: set per instance (`tagHoverColor`, IndexPage hover) | Hover / active for tags, filters, toggles |
| `--mh-color-near-black` | `#141414` | `/Off-Black` | Rules, index list, lightbox chrome, strong body |
| `--mh-color-graphite` | `#525252` | `/Text Gray` | Long-form case-study body |
| `--mh-color-light-gray` | `#979797` | `/Stroke Gray` | Muted text, tags, media stroke |
| `--mh-color-white` | `#FFFFFF` | `/White` | Lightbox backdrop, media placeholder |
| `--mh-color-white-60` | `#FFFFFF99` | none (published CSS token) | Muted text on Forest Green |
| `--mh-color-grain-umber` | `#501D07` | (GrainOverlay control) | Grain tint only |

## Surfaces

Add `data-surface="cream"` (default) or `data-surface="green"` to any container. It paints `--mh-bg-page` and re-maps every role below for its children.

<!-- ds:swatches roles -->

```html example
<div class="ds-demo-row">
  <div data-surface="cream" style="padding:24px;flex:1">
    <p class="mh-label">Cream surface</p>
    <p class="mh-text-heading" style="margin:16px 0 8px">Brand designer with a systems mind.</p>
    <p class="mh-text-body-sm mh-text-muted" style="margin:0">Muted supporting line.</p>
  </div>
  <div data-surface="green" style="padding:24px;flex:1">
    <p class="mh-label">Green surface</p>
    <p class="mh-text-heading" style="margin:16px 0 8px">Brand designer with a systems mind.</p>
    <p class="mh-text-body-sm mh-text-muted" style="margin:0">Muted supporting line.</p>
  </div>
</div>
```

## Semantic roles

| CSS variable | Cream | Green | Use for |
| --- | --- | --- | --- |
| `--mh-bg-page` | Cream | Forest Green | Surface background |
| `--mh-bg-inverse` | Forest Green | Cream | A block that inverts its parent |
| `--mh-bg-media` | White | White | Placeholder behind loading media, lightbox |
| `--mh-bg-hover` | near-black 4% | cream 8% | Row hover wash, code background |
| `--mh-text-brand` | Forest Green | Cream | Display type, nav, labels, section headers |
| `--mh-text-strong` | Near Black | Cream | Lead body, meta values, index rows, H3 |
| `--mh-text-body` | Graphite | White 60% | Long-form paragraphs |
| `--mh-text-muted` | Stroke Gray | White 60% | Headline continuation, tags, tertiary meta |
| `--mh-text-interactive` | Accent Green | White | Hover / active state |
| `--mh-border-rule` | Near Black | Cream | 1px rules and dividers |
| `--mh-border-stroke` | Stroke Gray | White 60% | Tag outlines, media stroke |

## Usage

- **Forest Green is the brand color, not an accent.** It sets display type and labels on Cream and becomes the whole surface for the footer and boot loader.
- **Hierarchy comes from shifting neutrals**: brand → strong → body → muted. Don't add colors to make something stand out; change its size or position.
- **Interactive green appears only on hover/active.** A resting tag is Stroke Gray; it turns Accent Green under the pointer or when selected.
- **Rules are near-black at full opacity**, not a soft gray. The site's crispness depends on this.
- **Media placeholders are white**, so a loading thumbnail reads as a paper card, not a gray hole.

## Don't

- Don't use raw hex values; use roles.
- Don't put Accent Green on large areas or as a button fill.
- Don't introduce a third surface (no gray cards, no dark mode beyond Forest Green).
- Don't use `code/tokens/micahhoang-tokens.json`: its `#027aff` CTA blue and Manrope type are pre-2026 and not on the live site.
