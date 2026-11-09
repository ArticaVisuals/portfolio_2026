---
title: Index
section: Patterns
order: 3
description: The complete archive. Filters across the top, a grid/list toggle, and a ruled year-by-year list.
status: live
framer: Page "/index"; IndexPageGridPreview (LgIzFjJ) wrapping IndexPage (rgAZFOv)
---

# Index

## Goal

Everything Micah has made, scannable in seconds and filterable by year, discipline and industry. Home curates; the Index is the full record.

## Structure

| # | Section | Components | Notes |
| --- | --- | --- | --- |
| 1 | Nav | [Navigation](../components/navigation.md) | |
| 2 | Title | Display M "Index" | Rises in on arrival |
| 3 | Filters | [Filter Group](../components/filter-group.md) | Year / Discipline / Industry; "Clear filters" reserved space |
| 4 | View | [View Toggle](../components/view-toggle.md) | Right-aligned: GRID / LIST |
| 5a | List view | [Index List](../components/index-list.md) | Year groups, ruled rows |
| 5b | Grid view | [Project Grid](../components/project-grid.md) `data-columns="3"` | Cards with tags; tags toggle filters |
| 6 | Footer | [Footer](../components/footer.md) | |

## Example (condensed)

```html example bleed
<div class="mh-container" style="padding-block:40px 72px">
  <h1 class="mh-text-display-m" style="margin:0 0 72px">Index</h1>
  <div class="mh-filter" style="margin-bottom:40px">
    <fieldset class="mh-filter__group"><legend class="mh-filter__heading mh-label">Year</legend><button class="mh-filter__item" type="button" aria-pressed="false">2026</button><button class="mh-filter__item" type="button" aria-pressed="false">2025</button></fieldset>
    <fieldset class="mh-filter__group"><legend class="mh-filter__heading mh-label">Discipline</legend><button class="mh-filter__item" type="button" aria-pressed="false">Visual identity</button><button class="mh-filter__item" type="button" aria-pressed="false">2D motion</button></fieldset>
    <fieldset class="mh-filter__group"><legend class="mh-filter__heading mh-label">Industry</legend><button class="mh-filter__item" type="button" aria-pressed="false">Nature</button><button class="mh-filter__item" type="button" aria-pressed="false">Technology</button></fieldset>
    <button class="mh-filter__clear mh-action" type="button">Clear filters</button>
  </div>
  <div style="display:flex;justify-content:flex-end;margin-bottom:16px">
    <div class="mh-view-toggle" role="group" aria-label="View"><button type="button" value="grid" aria-pressed="false">Grid</button><span aria-hidden="true">/</span><button type="button" value="list" aria-pressed="true">List</button></div>
  </div>
  <ol class="mh-index" reversed>
    <li class="mh-index__group"><h2 class="mh-index__year">2026</h2><ul class="mh-index__rows">
      <li><a class="mh-index__row" href="#"><span class="mh-index__title"><span class="mh-flip"><span class="mh-flip__track"><span>Gaia</span><span aria-hidden="true">Gaia</span></span></span></span><span class="mh-index__discipline mh-label">Visual identity, UX/UI</span><span class="mh-index__industry mh-label">Nature</span></a></li>
      <li><a class="mh-index__row" href="#"><span class="mh-index__title"><span class="mh-flip"><span class="mh-flip__track"><span>Peak Energy</span><span aria-hidden="true">Peak Energy</span></span></span></span><span class="mh-index__discipline mh-label">Visual identity</span><span class="mh-index__industry mh-label">Technology</span></a></li>
    </ul></li>
  </ol>
</div>
```

## Rules

- List is the default view; Grid is one click away. Both read from the same CMS rows.
- Filters never move the layout: "Clear filters" is always rendered and only toggles visibility; the list doesn't remount on filter changes.
- Filter state lives in the URL (`#service=…` in, `?service=…` out) so filtered views can be shared.
- First arrival reveals content progressively (6 rows, then +12 per frame); later filter changes are instant.
- Every project in the CMS appears here, including ones not on Home.

## Framer mapping

- `IndexPageGridPreview` (`LgIzFjJ`) is the mounted wrapper and supplies `gridLayoutVariant="figma"`. Overwriting it silently breaks the grid. It wraps `IndexPage` (`rgAZFOv`).
- Read `docs/index-component-instructions.md` before any change. CMS mode is generated-module only; no `ProjectRegistrar`, manual `projects`, `DEFAULT_PROJECTS` or hard-coded media.
