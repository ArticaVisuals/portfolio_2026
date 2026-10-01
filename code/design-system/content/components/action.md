---
title: Action
section: Components
order: 3
description: The brand's button. Mono text with a flip rail, or an outlined pill. There is no filled button.
status: live
framer: Native text/pill components; ScrollToTopButton (gh4ngZN) for the text action pattern
classes: [mh-action]
tokens: [type.label, radius.pill, border.hairline, color.*.text.interactive]
---

# Action

## Examples

```html example
<div class="ds-demo-row">
  <a class="mh-action" href="#">
    <span class="mh-flip"><span class="mh-flip__track"><span>View all</span><span aria-hidden="true">View all</span></span></span>
  </a>
  <button class="mh-action" type="button">
    <span class="mh-flip"><span class="mh-flip__track"><span>Read more</span><span aria-hidden="true">Read more</span></span></span>
  </button>
  <a class="mh-action" data-variant="pill" href="#">Resume ↗</a>
  <button class="mh-action" data-variant="pill" type="button" disabled>Unavailable</button>
</div>
```

```html example surface=green
<div class="ds-demo-row">
  <a class="mh-action" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>Get in touch</span><span aria-hidden="true">Get in touch</span></span></span></a>
  <a class="mh-action" data-variant="pill" href="#">Email</a>
</div>
```

## Usage

The site never uses a filled, colored button. A call to action is either a mono text action (the default) or, when it needs a visible hit area, an outlined pill. Both are quiet on purpose: the work, not the UI, should pull the eye.

| Variant | Use it for |
| --- | --- |
| Text (default) | "View all", "Read more", "Scroll to top", "Clear filters", dialog controls |
| `pill` | A standalone action that needs a visible boundary: Resume, Email, the docs "Markdown" button |

- **Write the variant explicitly** when it's a pill; the default is text.
- At most one pill per view. If everything is a pill, nothing is.
- Direction characters (↗ external, ↑ top, → next) go at the end of the label as text.

## API

| Attribute | Values | Effect |
| --- | --- | --- |
| `class="mh-action"` | n/a | Mono label, uppercase, inline-flex, no chrome |
| `data-variant` | `pill` | 1px currentColor outline, pill radius, 24px min height, green on hover |
| `disabled` / `aria-disabled="true"` | n/a | 40% opacity, no pointer events |

Use `<a>` for navigation and `<button type="button">` for in-page actions.

## Accessibility

- Focus ring: 1px currentColor, 3px offset.
- Pill hit area is 24px tall; on touch layouts keep at least 8px of space around it, or wrap it in a larger tap target.
- Icon-only actions (lightbox ← → ×) need `aria-label`.

## Framer mapping

- Text actions: the native "View All" and "Read More" components (two-layer flip variant).
- Scroll to top: `ScrollToTopButton` (`gh4ngZN`). Label `scroll to top`, color `#233324`, 900ms Snappy scroll, delegates to the global Lenis instance.

## Don't

- Don't fill a button with Forest Green, Accent Green or the retired `#027aff`.
- Don't add drop shadows or rounded-rectangle buttons.
- Don't use sentence-case sans for button labels.
