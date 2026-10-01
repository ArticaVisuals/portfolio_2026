---
title: Filter Group
section: Components
order: 14
description: Taxonomy columns of mono toggles (year, discipline, industry) that filter the Index in place.
status: live
framer: IndexPage (rgAZFOv), IndexFilterContext + URL sync
codeFileId: rgAZFOv
classes: [mh-filter, mh-filter__group, mh-filter__heading, mh-filter__item, mh-filter__clear]
tokens: [type.label, color.*.text.interactive, motion.duration.fast]
---

# Filter Group

## Examples

```html example
<div class="mh-filter" aria-label="Filter projects">
  <fieldset class="mh-filter__group">
    <legend class="mh-filter__heading mh-label">Year</legend>
    <button class="mh-filter__item" type="button" aria-pressed="false" value="2026">2026</button>
    <button class="mh-filter__item" type="button" aria-pressed="false" value="2025">2025</button>
    <button class="mh-filter__item" type="button" aria-pressed="false" value="2024">2024</button>
  </fieldset>
  <fieldset class="mh-filter__group">
    <legend class="mh-filter__heading mh-label">Discipline</legend>
    <button class="mh-filter__item" type="button" aria-pressed="false">Packaging</button>
    <button class="mh-filter__item" type="button" aria-pressed="true">Product</button>
    <button class="mh-filter__item" type="button" aria-pressed="false">Strategy</button>
    <button class="mh-filter__item" type="button" aria-pressed="false">Visual identity</button>
  </fieldset>
  <fieldset class="mh-filter__group">
    <legend class="mh-filter__heading mh-label">Industry</legend>
    <button class="mh-filter__item" type="button" aria-pressed="false">Literature</button>
    <button class="mh-filter__item" type="button" aria-pressed="false">Nature</button>
    <button class="mh-filter__item" type="button" aria-pressed="false">Technology</button>
  </fieldset>
  <button class="mh-filter__clear mh-action" type="button">Clear filters</button>
</div>
```

Click the items to toggle. "Clear filters" appears as soon as one is active.

## Usage

- Three taxonomies, in this order: **Year**, **Discipline**, **Industry**. Values come from the CMS.
- Multiple selections combine as OR within a group and AND across groups.
- Selected items turn Accent Green and get a leading dot. Hover previews the same color.
- **Clear filters** is always rendered and only toggles `visibility`, so activating a filter never shifts the layout.
- Filter state syncs to the URL: `#service=packaging` in, `?service=` out.

## API

| Class / attribute | Element | Notes |
| --- | --- | --- |
| `mh-filter` | `div` | Grid `1fr 2fr 2fr 1fr` (2 columns on mobile). Gets `data-active` while any item is pressed |
| `mh-filter__group` | `fieldset` | One taxonomy |
| `mh-filter__heading` | `legend` | Muted mono heading |
| `mh-filter__item` | `button[aria-pressed]` | 13px mono, 28px line height |
| `mh-filter__clear` | `button` | Visible only with `data-active` |
| `mh:filter` event | n/a | Fired by `components.js` on change with `detail.values` |

## Accessibility

- Toggles are `<button aria-pressed>`, so state is announced.
- Group with `fieldset`/`legend` so each item is read with its taxonomy.

## Framer mapping

- `IndexPage` (`rgAZFOv`): taxonomy follows Figma node `32:7531`; hover/active color `#25593a`; URL sync has a kill switch (`ENABLE_URL_FILTER_SYNC`); grid tags toggle the same filters through `IndexFilterContext`.
- The nav fades in row by row on arrival (`INDEX_NAV_FADE_PRESET`).

## Don't

- Don't use checkboxes, dropdowns or a search field for these filters.
- Don't show result counts next to every item.
