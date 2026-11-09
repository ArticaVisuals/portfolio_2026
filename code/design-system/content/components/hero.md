---
title: Hero
section: Components
order: 9
description: The opening of a page. A huge name and descriptor on Home; a bold title continuing in Stroke Gray on case studies.
status: live
framer: Home "Header" section (Heading 1 + Heading 3); case-study hero (Heading 2b, two colors)
classes: [mh-hero, mh-hero__name, mh-hero__descriptor, mh-hero__bar, mh-hero__continuation]
tokens: [type.display-xl, type.display-l, type.heading, space.13]
---

# Hero

## Examples

### Home

```html example
<header class="mh-hero">
  <h1 class="mh-hero__name mh-text-display-xl">
    <span class="mh-reveal" style="--i:0"><span>Micah Hoang</span></span>
  </h1>
  <p class="mh-hero__descriptor mh-text-heading">
    <span class="mh-reveal" style="--i:1"><span>Brand designer with</span></span>
    <span class="mh-reveal" style="--i:2"><span>a systems mind.</span></span>
  </p>
  <div class="mh-hero__bar">
    <ul class="mh-link-list mh-label">
      <li><a class="mh-link" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>LinkedIn</span><span aria-hidden="true">LinkedIn</span></span></span></a></li>
      <li><a class="mh-link" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>Resume</span><span aria-hidden="true">Resume</span></span></span></a></li>
      <li><a class="mh-link" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>Email</span><span aria-hidden="true">Email</span></span></span></a></li>
      <li><a class="mh-link" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>Cosmos</span><span aria-hidden="true">Cosmos</span></span></span></a></li>
    </ul>
    <span class="mh-label">©2026</span>
  </div>
</header>
```

### Case study

```html example
<header class="mh-hero" data-variant="case-study">
  <h1 class="mh-hero__name">
    Gaia
    <span class="mh-hero__continuation">Turning noticing into a way of caring for the living world.</span>
  </h1>
</header>
```

## Usage

| Variant | Title | Supporting text | Where |
| --- | --- | --- | --- |
| Home | Display XL, bold, the name | Heading, two lines, Forest Green | `/` only |
| Case study | Display L, bold, project name | Same size and weight, continues in Stroke Gray | `/case-studies/*` |

- **Home**: the name's line box 90px from the top (97 mobile) under the fixed nav, with a 6px optical overhang to the left (5 tablet, 3 mobile); the descriptor 220 / 186 / 162px from the top, a two-line descriptor at a fixed width (382 / 218 / 181px), then the link row pinned 10px from the bottom of the 100px bottom padding, on the 20px nav gutter. There is no rule here: the rule that follows belongs to the Selected work [Section Header](section-header.md).
- **Case study**: the project name is the start of a sentence that continues in muted gray: name, then one line of what the project does for people. Up to three lines on desktop. The full-bleed hero media and the [Meta Grid](meta-grid.md) follow.
- Hero copy rises in with the type reveal (900ms, 90ms stagger).

## API

| Class / attribute | Notes |
| --- | --- |
| `mh-hero` | Column stack, 144px top padding |
| `data-variant="case-study"` | Applies Display L to `.mh-hero__name` |
| `mh-hero__name` | The `h1`. Add `mh-text-display-xl` for Home |
| `mh-hero__descriptor` | Heading style, `max-width: 11em` to force the two-line break |
| `mh-hero__continuation` | Muted continuation inside the case-study `h1` |
| `mh-hero__bar` | Base row with bottom rule |

## Accessibility

- One `h1` per page: the name on Home, the project name + continuation on case studies (read as one sentence).
- Reveal spans don't change reading order.

## Framer mapping

- Home: text styles **Heading 1** (name) and **Heading 3** (descriptor). Appear effects: name `translateY 110px → 0`, descriptor `90px → 0`, Snappy; replays are coordinated by `PageTransition` (`gmalnRr`).
- Case study: **Heading 2b** in two text layers (`/Forest Green` then `/Stroke Gray`) or one rich-text layer with a color span.

## Don't

- Don't add a hero image to Home; the selected-work grid is the imagery.
- Don't put a subtitle under a case-study title. The continuation is the subtitle.
