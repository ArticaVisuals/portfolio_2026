---
title: Section Header
section: Components
order: 6
description: A full-width rule followed by a Display M title. This is how every major section on the site starts.
status: live
framer: Rule frame + text style "Heading 2"
classes: [mh-section-header, mh-section-header__title]
tokens: [type.display-m, border.hairline, space.7]
---

# Section Header

## Examples

```html example
<header class="mh-section-header">
  <hr class="mh-rule">
  <h2 class="mh-section-header__title">Selected work</h2>
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

## Usage

- Use for top-level page sections: Selected work, About Micah, Other projects, Index.
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
| `data-spacing="compact"` | `header` | 30px (20px mobile) below instead of 70px |

## Framer mapping

- Text style **Heading 2** (GT Standard L Regular). The live site renders the title at 70px with -1% tracking.
- The rule is a 1px frame or Line Animation above the title in a vertical Stack; the title row has 20px top padding.
- The reveal is Framer's native Appear effect, normalized by `PageTransition` (`gmalnRr`) to 900ms / 90ms stagger / Snappy / 115% start.

## Don't

- Don't use bold for section titles; bold is reserved for the hero and case-study titles.
- Don't add eyebrows or numbers ("01 / Work") above section titles.
