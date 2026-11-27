---
title: Section Header
section: Components
order: 6
description: A full-width rule followed by a Display M title. This is how every major section on the site starts.
status: live
framer: Rule frame + text style "Heading 2"
classes: [mh-section-header, mh-section-header__title]
tokens: [type.display-m, border.hairline, space.7, component.section-header.*]
---

# Section Header

## Examples

```html example
<header class="mh-section-header">
  <hr class="mh-rule">
  <h2 class="mh-section-header__title">Other projects</h2>
</header>
```

### With an action

```html example
<header class="mh-section-header">
  <hr class="mh-rule">
  <h2 class="mh-section-header__title">Other projects</h2>
  <a class="mh-action" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>View all</span><span aria-hidden="true">View all</span></span></span></a>
</header>
```

### With reveal

```html example
<header class="mh-section-header">
  <hr class="mh-rule" data-draw>
  <h2 class="mh-section-header__title">
    <span class="mh-reveal" style="--i:0"><span>About Micah</span></span>
  </h2>
</header>
```

### Rule only

```html example
<header class="mh-section-header" data-variant="rule">
  <hr class="mh-rule">
</header>
<ul class="mh-project-grid">
  <li class="mh-project-card"><a class="mh-project-card__link" href="#"><div class="mh-project-card__meta mh-label"><span>1</span><span>/</span><span class="mh-flip"><span class="mh-flip__track"><span>Gaia</span><span aria-hidden="true">View project</span></span></span></div><div class="mh-media"><img src="../../assets/samples/gaia.jpg" alt=""></div></a></li>
  <li class="mh-project-card"><a class="mh-project-card__link" href="#"><div class="mh-project-card__meta mh-label"><span>2</span><span>/</span><span class="mh-flip"><span class="mh-flip__track"><span>AirPods Pro 3</span><span aria-hidden="true">View project</span></span></span></div><div class="mh-media" data-stroke><img src="../../assets/samples/airpods.jpg" alt=""></div></a></li>
</ul>
```

## Usage

- Use for top-level page sections: About Micah, Other projects, Index.
- **Rule only** (`data-variant="rule"`): Home's Selected work has no title, because the six numbered cards already say what they are. The rule sits 6px into the section (1px on phone) and the grid starts 45px below it (35px on phone).
- Titles are sentence case, two or three words. They label the section; they aren't headlines.
- Spacing (Framer): the previous section ends with 100px bottom padding; rule → title 20px; title → content 70px (50px mobile) via the header's own bottom padding. Use `data-spacing="compact"` for About (30px, 20px mobile).
- Multi-word titles reveal word by word: wrap each word in a `span`; words sit 15px apart (8px mobile).
- An optional action (View all) sits on the title's baseline at the right edge.

## API

| Class | Element | Notes |
| --- | --- | --- |
| `mh-section-header` | `header` | Grid: title left, optional action right |
| `mh-rule` | `hr` | First child; spans both columns |
| `mh-section-header__title` | `h2` | Display M (70 / 53 / 42px, regular, Forest Green); word spans 15px apart |
| `data-variant="rule"` | `header` | Rule only, no title; 45px (35px phone) to the content |
| `data-spacing="compact"` | `header` | 30px (20px mobile) below instead of 70px |

## Framer mapping

- Text style **Heading 2** (GT Standard L Regular). The live site renders the title at 70px with -1% tracking.
- The rule is a 1px frame or Line Animation above the title in a vertical Stack; the title row has 20px top padding.
- The reveal is Framer's native Appear effect, normalized by `PageTransition` (`gmalnRr`) to 900ms / 90ms stagger / Snappy / 115% start.

## Don't

- Don't use bold for section titles; bold is reserved for the hero and case-study titles.
- Don't add eyebrows or numbers ("01 / Work") above section titles.
