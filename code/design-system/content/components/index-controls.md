---
title: Index Controls
section: Components
order: 14
description: The controls above the Index. Year / Service / Industry filters (disclosure buttons on mobile), the project count and the GRID / LIST toggle.
status: live
framer: IndexPage (rgAZFOv) via IndexPageGridPreview (LgIzFjJ)
codeFileId: rgAZFOv
classes: [mh-filter, mh-filter__group, mh-filter__heading, mh-filter__toggle, mh-filter__options, mh-filter__item, mh-filter__done, mh-filter__clear, mh-count, mh-view-toggle]
tokens: [type.label, color.*.text.interactive, color.*.text.strong, motion.duration.instant, motion.duration.fast, motion.ease.smooth, layout.touch-target]
---

# Index Controls

## Filters

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

Click items to toggle; "Clear filters" appears once one is active. Below 810px the groups collapse into disclosure buttons; resize to see them.

- Three taxonomies in this order: **Year**, **Service** (disciplines), **Industry**, all from the CMS. Selections combine as OR within a group and AND across groups, and apply immediately.
- Selected items turn Accent Green with a leading dot; hover previews the color.
- **Clear filters** is always rendered and only toggles `visibility`, so filtering never shifts the layout.
- Filter state lives in the URL: `#service=packaging` in, `?service=` out.
- **Mobile:** three equal disclosure buttons, 12px apart between two 1px rules. Triggers are 48px tall with a chevron that flips when open. One panel opens at a time, full width, growing out of its trigger (4px drop, 0.97 scale, 250ms Smooth) and closing in 150ms. Options, Done and Clear filters are 44px targets. Done, Escape and a tap outside close the panel and return focus to its trigger.

## Count

A polite live region under the filters ("17 Projects"). Digits sit in fixed-width tabular slots so the line never shifts; when the count changes, only the changed digits cross-fade (150ms Smooth). Screen readers hear the plain number once.

```html example
<p class="mh-label" role="status" aria-live="polite"><span class="mh-count" data-total="17" data-value="17"></span></p>
<div class="ds-demo-row" style="margin-top:16px">
  <button class="mh-action" data-variant="pill" type="button" onclick="mhSetCount(this.closest('.ds-preview').querySelector('.mh-count'), 5)">Filter to 5</button>
  <button class="mh-action" data-variant="pill" type="button" onclick="mhSetCount(this.closest('.ds-preview').querySelector('.mh-count'), 17)">Clear</button>
</div>
```

## View toggle

```html example
<div class="mh-view-toggle" role="group" aria-label="View">
  <button type="button" value="grid" aria-pressed="false">Grid</button>
  <span aria-hidden="true">/</span>
  <button type="button" value="list" aria-pressed="true">List</button>
</div>
```

Right-aligned on the line above the list or grid. Two options; the active one is underlined (1px, 3px offset). Switching keeps the filters and scroll position. 44×44px buttons on mobile. No icons, no third view.

## API

| Class / attribute | Element | Notes |
| --- | --- | --- |
| `mh-filter` | `div` | Grid `1fr 2fr 2fr 1fr`; `data-active` while any item is pressed |
| `mh-filter__group` | `fieldset` | One taxonomy; `legend.mh-filter__heading` names it |
| `mh-filter__toggle` | `button[aria-expanded][aria-controls]` | Mobile disclosure trigger |
| `mh-filter__options` | `div` | The group's items, plus `mh-filter__done` on mobile |
| `mh-filter__item` | `button[aria-pressed]` | 13px mono, 28px line height |
| `mh-filter__clear` | `button.mh-action` | Visible only with `data-active` |
| `mh-count` | `span[data-total]` | `mhSetCount(el, n)` updates it (`components.js`) |
| `mh-view-toggle` | `div[role=group]` | `data-target` receives `data-view` from the pressed `value` |
| `mh:filter` | event | Fired on change with `detail.values` |

## Framer mapping

- All three live inside `IndexPage` (`rgAZFOv`), mounted through `IndexPageGridPreview` (`LgIzFjJ`), which also exposes the default **View** control. Taxonomy follows Figma node `32:7531`; hover/active color `#25593a`; URL sync has a kill switch (`ENABLE_URL_FILTER_SYNC`); grid tags toggle the same filters through `IndexFilterContext`.
- Interaction timing inside IndexPage: `--idx-motion-feedback` 150ms and `--idx-motion-switch` 250ms on the Smooth curve.
- Read `docs/index-component-instructions.md` before editing.

## Don't

- No checkboxes, select menus or search field for these filters.
- No per-item counts.
