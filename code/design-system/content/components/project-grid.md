---
title: Project Grid
section: Components
order: 12
description: The grid that holds project cards. Two columns for Selected work, three for Other projects and the index grid.
status: live
framer: HomeSelectedWorkGrid (FecepLS); IndexPageGridPreview (LgIzFjJ)
codeFileId: LgIzFjJ
classes: [mh-project-grid]
tokens: [layout.column-gap, layout.card-row-gap]
---

# Project Grid

## Examples

### Two columns (Selected work)

```html example
<ul class="mh-project-grid">
  <li class="mh-project-card">
    <a class="mh-project-card__link" href="#">
      <div class="mh-project-card__meta mh-label"><span>5</span><span>/</span><span class="mh-flip"><span class="mh-flip__track"><span>Simon &amp; Schuster</span><span aria-hidden="true">Simon &amp; Schuster</span></span></span></div>
      <div class="mh-media"><img src="../../assets/samples/simon-schuster.jpg" alt="Uncover Forbidden Stories poster on a city building"></div>
    </a>
    <ul class="mh-tags"><li class="mh-tag">Strategy</li><li class="mh-tag">Visual identity</li><li class="mh-tag">Editorial</li></ul>
  </li>
  <li class="mh-project-card">
    <a class="mh-project-card__link" href="#">
      <div class="mh-project-card__meta mh-label"><span>6</span><span>/</span><span class="mh-flip"><span class="mh-flip__track"><span>National Park Playing Cards</span><span aria-hidden="true">National Park Playing Cards</span></span></span></div>
      <div class="mh-media"><img src="../../assets/samples/national-park-cards.jpg" alt="Hands dealing National Park playing cards on a wooden table"></div>
    </a>
    <ul class="mh-tags"><li class="mh-tag">Product</li><li class="mh-tag">Packaging</li></ul>
  </li>
</ul>
```

### Three columns (Other projects)

```html example
<ul class="mh-project-grid" data-columns="3">
  <li class="mh-project-card"><a class="mh-project-card__link" href="#"><div class="mh-project-card__meta mh-label"><span>2</span><span>/</span><span class="mh-flip"><span class="mh-flip__track"><span>AirPods Pro 3</span><span aria-hidden="true">AirPods Pro 3</span></span></span></div><div class="mh-media" data-stroke><img src="../../assets/samples/airpods.jpg" alt=""></div></a></li>
  <li class="mh-project-card"><a class="mh-project-card__link" href="#"><div class="mh-project-card__meta mh-label"><span>3</span><span>/</span><span class="mh-flip"><span class="mh-flip__track"><span>Peak Energy</span><span aria-hidden="true">Peak Energy</span></span></span></div><div class="mh-media"><img src="../../assets/samples/peak-energy.jpg" alt=""></div></a></li>
  <li class="mh-project-card"><a class="mh-project-card__link" href="#"><div class="mh-project-card__meta mh-label"><span>4</span><span>/</span><span class="mh-flip"><span class="mh-flip__track"><span>Gaia</span><span aria-hidden="true">Gaia</span></span></span></div><div class="mh-media"><img src="../../assets/samples/gaia.jpg" alt=""></div></a></li>
</ul>
```

## Usage

| Columns | Desktop | Tablet | Mobile | Where |
| --- | --- | --- | --- | --- |
| 2 (default) | 2 | 2 | 1 | Home selected work |
| `data-columns="3"` | 3 | 2 | 1 | Case-study "Other projects", `/index` grid view |

- Gaps: 20px between columns, 50px between rows.
- Home shows exactly six projects (three rows of two), followed by a right-aligned "View all" action.
- "Other projects" shows three and drops tags.

## API

| Attribute | Effect |
| --- | --- |
| `class="mh-project-grid"` | 2-column grid, use on `ul`/`div` |
| `data-columns="3"` | 3 columns on desktop |

## Framer mapping

- Home: `HomeSelectedWorkGrid` (`FecepLS`) renders the grid itself (`gap: 50px 20px`).
- `/index` grid view: `IndexPage` (`rgAZFOv`) with the `figma` layout variant supplied by `IndexPageGridPreview` (`LgIzFjJ`): 3 columns, 56px row gap, 20px column gap.
- In native Framer layouts, use a Grid with `1fr` columns and the gap tokens; set column count on the tablet and phone breakpoints.

## Don't

- Don't use masonry or mixed card sizes in these grids. Galleries inside case studies have their own components.
- Don't paginate; use the Index for the full list.
