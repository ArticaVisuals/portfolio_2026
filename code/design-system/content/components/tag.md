---
title: Tag
section: Components
order: 4
description: Outlined mono pills that name a project's disciplines and double as filters.
status: live
framer: Rendered by HomeSelectedWorkGrid (FecepLS) and IndexPage (rgAZFOv) from CMS discipline fields
codeFileId: FecepLS
classes: [mh-tags, mh-tag]
tokens: [type.label, type.label-sm, radius.pill, color.*.border.stroke, color.*.text.muted, color.*.text.interactive, motion.duration.fast]
---

# Tag

## Examples

```html example
<ul class="mh-tags">
  <li class="mh-tag">Strategy</li>
  <li class="mh-tag">Visual identity</li>
  <li class="mh-tag">Editorial</li>
</ul>
```

### Interactive (links or filter toggles)

```html example
<div class="mh-tags">
  <a class="mh-tag" href="#">2D motion</a>
  <a class="mh-tag" href="#">3D motion</a>
  <button class="mh-tag" type="button" aria-pressed="true">Social media</button>
  <button class="mh-tag" type="button" aria-pressed="false">Packaging</button>
</div>
```

```html example surface=green
<ul class="mh-tags"><li class="mh-tag">Product</li><li class="mh-tag">Packaging</li></ul>
```

## Usage

- Tags list a project's **disciplines** (Strategy, Visual identity, UX/UI, 2D motion, Packaging...). Industry goes in the index row, not a tag.
- Up to three per card, in CMS order.
- At rest a tag is Stroke Gray text with a Stroke Gray outline. Interactive tags (links or toggle buttons) turn Accent Green on hover; a pressed toggle stays green.
- On the live site, clicking a grid tag on `/index` toggles that discipline filter in place.

## API

| Class / attribute | Effect |
| --- | --- |
| `mh-tags` | Wrapping flex row, 6px gap (5px below 1200px); use on `ul` or `div` |
| `mh-tag` | 13px mono pill, 24px min height, `5px 10px 6px` padding |
| `a.mh-tag` / `button.mh-tag` | Hover → `--mh-text-interactive`, 250ms Snappy |
| `aria-pressed="true"` | Selected state (green), for filter toggles |
| `data-size="sm"` | 12px, 23px height (applied automatically below 1200px) |

## Accessibility

- Static tags: `li` elements in a `ul`.
- Filter tags: `<button type="button" aria-pressed>`; `components.js` toggles the state.
- Long labels truncate with an ellipsis; keep labels to two words.

## Framer mapping

- Home cards: `HomeSelectedWorkGrid` (`FecepLS`). Tag color comes from a property control (default `#25593a` for hover); Show Tags toggle.
- `/index` grid: `IndexPage` (`rgAZFOv`) via `IndexPageGridPreview` (`LgIzFjJ`). Tags are `<button>`s that toggle disciplines through `IndexFilterContext`.
- Values come from CMS `All Projects` (`yTHrQWMIY`) category fields; never hard-code tag lists.

## Don't

- Don't fill tags with color or use them as status badges.
- Don't mix tag sizes in one row.
- Don't use tags as primary navigation.
