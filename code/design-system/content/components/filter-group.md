---
title: Filter Group
section: Components
order: 14
description: Taxonomy columns of mono toggles (year, service, industry) that filter the Index in place; disclosure buttons on mobile.
status: live
framer: IndexPage (rgAZFOv), IndexFilterContext + URL sync
codeFileId: rgAZFOv
classes: [mh-filter, mh-filter__group, mh-filter__heading, mh-filter__toggle, mh-filter__options, mh-filter__item, mh-filter__done, mh-filter__clear]
tokens: [type.label, color.*.text.interactive, motion.duration.fast]
---

# Filter Group

## Examples

```html example
<div class="mh-filter" role="group" aria-label="Filter projects">
  <fieldset class="mh-filter__group">
    <legend class="mh-filter__heading mh-label">Year</legend>
    <button class="mh-filter__toggle" type="button" aria-expanded="false" aria-controls="filter-year">Year</button>
    <div class="mh-filter__options" id="filter-year">
      <button class="mh-filter__item" type="button" aria-pressed="false">2026</button>
      <button class="mh-filter__item" type="button" aria-pressed="false">2025</button>
      <button class="mh-filter__item" type="button" aria-pressed="false">2024</button>
      <button class="mh-filter__done" type="button">Done</button>
    </div>
  </fieldset>
  <fieldset class="mh-filter__group">
    <legend class="mh-filter__heading mh-label">Service</legend>
    <button class="mh-filter__toggle" type="button" aria-expanded="false" aria-controls="filter-service">Service</button>
    <div class="mh-filter__options" id="filter-service">
      <button class="mh-filter__item" type="button" aria-pressed="false">Packaging</button>
      <button class="mh-filter__item" type="button" aria-pressed="true">Product</button>
      <button class="mh-filter__item" type="button" aria-pressed="false">Strategy</button>
      <button class="mh-filter__item" type="button" aria-pressed="false">Visual identity</button>
      <button class="mh-filter__done" type="button">Done</button>
    </div>
  </fieldset>
  <fieldset class="mh-filter__group">
    <legend class="mh-filter__heading mh-label">Industry</legend>
    <button class="mh-filter__toggle" type="button" aria-expanded="false" aria-controls="filter-industry">Industry</button>
    <div class="mh-filter__options" id="filter-industry">
      <button class="mh-filter__item" type="button" aria-pressed="false">Literature</button>
      <button class="mh-filter__item" type="button" aria-pressed="false">Nature</button>
      <button class="mh-filter__item" type="button" aria-pressed="false">Technology</button>
      <button class="mh-filter__done" type="button">Done</button>
    </div>
  </fieldset>
  <button class="mh-filter__clear mh-action" type="button">Clear filters</button>
</div>
```

Click the items to toggle. "Clear filters" appears as soon as one is active. Below 810px the three groups collapse into Year / Service / Industry disclosure buttons.

## Mobile (below 810px)

Since 2026-10-30 the long taxonomy columns become three disclosure buttons, **Year / Service / Industry**, in equal columns 12px apart between two 1px rules.

- Triggers are 48px tall, 13px mono with 1.3 leading, uppercase, with a chevron on the right that flips when open.
- One panel opens at a time, full width under the triggers. Options, Done and Clear filters are 44px targets.
- Selections apply immediately. Done, Escape and a tap outside close the panel and return focus to its trigger. The live site also offers a per-category Reset and moves into the options with Arrow Down.
- The result count below ("17 projects") is a polite live region; the Grid / List buttons are 44×44px.

## Usage

- Three taxonomies, in this order: **Year**, **Service** (disciplines), **Industry**. Values come from the CMS.
- Multiple selections combine as OR within a group and AND across groups.
- Selected items turn Accent Green and get a leading dot. Hover previews the same color.
- **Clear filters** is always rendered and only toggles `visibility`, so activating a filter never shifts the layout.
- Filter state syncs to the URL: `#service=packaging` in, `?service=` out.

## API

| Class / attribute | Element | Notes |
| --- | --- | --- |
| `mh-filter` | `div` | Grid `1fr 2fr 2fr 1fr`; on mobile three equal trigger columns between rules. Gets `data-active` while any item is pressed |
| `mh-filter__group` | `fieldset` | One taxonomy |
| `mh-filter__heading` | `legend` | Muted mono heading |
| `mh-filter__toggle` | `button[aria-expanded][aria-controls]` | Mobile disclosure trigger; hidden on desktop/tablet |
| `mh-filter__options` | `div` | The group's items (+ Done on mobile) |
| `mh-filter__item` | `button[aria-pressed]` | 13px mono, 28px line height; 44px min height on mobile |
| `mh-filter__done` | `button` | Mobile only: closes the panel |
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
