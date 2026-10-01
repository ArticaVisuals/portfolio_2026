---
title: Index List
section: Components
order: 13
description: The complete archive as a ruled table. Year groups, uppercase titles, discipline and industry columns, with a hover wash and a flip.
status: live
framer: IndexPage (rgAZFOv) via IndexPageGridPreview (LgIzFjJ)
codeFileId: rgAZFOv
classes: [mh-index, mh-index__group, mh-index__year, mh-index__rows, mh-index__row, mh-index__title, mh-index__discipline, mh-index__industry]
tokens: [type.title, type.label, color.*.text.strong, color.*.border.rule, color.*.bg.hover, motion.duration.slow]
---

# Index List

## Examples

```html example
<ol class="mh-index" reversed>
  <li class="mh-index__group">
    <h3 class="mh-index__year">2026</h3>
    <ul class="mh-index__rows">
      <li><a class="mh-index__row" href="#">
        <span class="mh-index__title"><span class="mh-flip"><span class="mh-flip__track"><span>Caliper Sans</span><span aria-hidden="true">Caliper Sans</span></span></span></span>
        <span class="mh-index__discipline mh-label">Type design</span>
        <span class="mh-index__industry mh-label">Technology</span>
      </a></li>
      <li><a class="mh-index__row" href="#">
        <span class="mh-index__title"><span class="mh-flip"><span class="mh-flip__track"><span>Gaia</span><span aria-hidden="true">Gaia</span></span></span></span>
        <span class="mh-index__discipline mh-label">Visual identity, UX/UI</span>
        <span class="mh-index__industry mh-label">Nature</span>
      </a></li>
      <li><a class="mh-index__row" href="#">
        <span class="mh-index__title"><span class="mh-flip"><span class="mh-flip__track"><span>Peak Energy</span><span aria-hidden="true">Peak Energy</span></span></span></span>
        <span class="mh-index__discipline mh-label">Visual identity</span>
        <span class="mh-index__industry mh-label">Technology</span>
      </a></li>
    </ul>
  </li>
  <li class="mh-index__group">
    <h3 class="mh-index__year">2025</h3>
    <ul class="mh-index__rows">
      <li><a class="mh-index__row" href="#">
        <span class="mh-index__title"><span class="mh-flip"><span class="mh-flip__track"><span>AirPods Pro 3</span><span aria-hidden="true">AirPods Pro 3</span></span></span></span>
        <span class="mh-index__discipline mh-label">2D motion, 3D motion</span>
        <span class="mh-index__industry mh-label">Technology</span>
      </a></li>
      <li><a class="mh-index__row" href="#">
        <span class="mh-index__title"><span class="mh-flip"><span class="mh-flip__track"><span>Motion Connect 2025</span><span aria-hidden="true">Motion Connect 2025</span></span></span></span>
        <span class="mh-index__discipline mh-label">Event identity</span>
        <span class="mh-index__industry mh-label">Education</span>
      </a></li>
    </ul>
  </li>
</ol>
```

## Anatomy

| Column | Content | Type | Below 1200px | Below 810px |
| --- | --- | --- | --- | --- |
| Year | Group label, first column, once per group | Title, 22px | Kept | Stacked above rows |
| Title | Project name, uppercase, flips on hover | Title, 22px | Kept | 16px |
| Discipline | Comma-joined disciplines | Mono label | Hidden | Hidden |
| Industry | One industry | Mono label, right-aligned | Kept | Kept |

## Usage

- Groups are years, newest first. A full-width rule opens each group; rules separate rows inside it; a final rule closes the list.
- Text is near-black (`--mh-text-strong`), not Forest Green. This is the one dense, data-like surface on the site.
- Row hover: a 4% near-black wash (150ms Smooth) plus the title flip (620ms Snappy).
- The list sits under the [Filter Group](filter-group.md) and the [View Toggle](view-toggle.md); filtering hides rows and empty groups without moving the filters.

## API

| Class | Element | Notes |
| --- | --- | --- |
| `mh-index` | `ol` | Wrapper; `reversed` if numbering matters |
| `mh-index__group` | `li` | Grid `1fr 5fr`, top rule |
| `mh-index__year` | `h3` | Year label |
| `mh-index__rows` | `ul` | Rows, divided by rules |
| `mh-index__row` | `a` | Grid `2fr 2fr 1fr`; hover wash, 2px radius |
| `mh-index__title` | `span` | Holds a flip rail (`--mh-flip-h: 1.2em`) |
| `mh-index__discipline`, `mh-index__industry` | `span.mh-label` | Ellipsis on overflow |

## Data model (CMS)

```json
{ "title": "Gaia", "slug": "gaia", "year": 2026, "category1": "Visual identity", "category2": "UX/UI", "category3": "Strategy", "industry": "Nature", "sortOrder": 2 }
```

Fields map to `All Projects` (`yTHrQWMIY`). Years come from the CMS; never hard-code groups.

## Accessibility

- Year headings make the groups navigable by heading.
- Each row is a single link whose name is the project title (duplicate flip span is hidden).

## Framer mapping

- `IndexPage` (`rgAZFOv`), mounted through `IndexPageGridPreview` (`LgIzFjJ`). Text and dividers render `#141414` through color property controls.
- Content arrives progressively on first load (6 rows, then +12 per frame); filter toggles never unmount the list.
- Read `docs/index-component-instructions.md` before editing. The CMS mode is generated-module only; there are no manual rows or `DEFAULT_PROJECTS`.

## Don't

- Don't add thumbnails to list rows (grid view exists for that).
- Don't color rows by discipline or industry.
- Don't use zebra striping.
