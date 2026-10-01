---
title: View Toggle
section: Components
order: 15
description: A mono "GRID / LIST" switch that changes how the Index renders, with an underline on the active view.
status: live
framer: IndexPageGridPreview (LgIzFjJ) "View" control
codeFileId: LgIzFjJ
classes: [mh-view-toggle]
tokens: [type.label, color.*.text.strong]
---

# View Toggle

## Examples

```html example
<div class="mh-view-toggle" role="group" aria-label="View" data-target="#index-demo">
  <button type="button" value="grid" aria-pressed="false">Grid</button>
  <span aria-hidden="true">/</span>
  <button type="button" value="list" aria-pressed="true">List</button>
</div>
```

## Usage

- Right-aligned on the line above the list or grid it controls.
- Two options only. The active one is underlined (1px, 3px offset); there's no pill or background.
- Changing views keeps the filters and scroll position.

## API

| Class / attribute | Notes |
| --- | --- |
| `mh-view-toggle` | `div role="group"`; mono label with 28px line height |
| `data-target` | Selector of the element whose `data-view` is set to the pressed button's `value` |
| `button[aria-pressed]` | One pressed at a time (`components.js`) |

## Framer mapping

- The live toggle sits inside `IndexPage` (`rgAZFOv`, `.idx-view-toggle`) with a -46px offset so it shares a line with the filters; `IndexPageGridPreview` (`LgIzFjJ`) exposes the default **View** control.

## Don't

- Don't use icons (grid/list glyphs) for this toggle.
- Don't add a third view.
