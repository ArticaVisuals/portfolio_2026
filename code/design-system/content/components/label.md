---
title: Mono Label
section: Components
order: 1
description: The uppercase 13px mono line that carries every piece of metadata, navigation and UI text on the site.
status: live
framer: Text styles "Heading 5", "Body - 100%", "On Green Label", "Footer Mono White/Dark"
classes: [mh-label]
tokens: [type.label, type.label-sm, color.*.text.brand, color.*.text.muted]
---

# Mono Label

## Examples

```html example
<div class="ds-demo-stack">
  <p class="mh-label">Los Angeles, California</p>
  <p class="mh-label" data-tone="muted">2D motion</p>
  <p class="mh-label" data-leading="relaxed">/ About the project</p>
  <p class="mh-label" data-size="sm">Available for work</p>
</div>
```

```html example surface=green
<p class="mh-label">Get in touch</p>
```

## Usage

The Mono Label is the site's second voice. Display type makes the statement; labels carry everything else: nav, meta, eyebrows, counts, years, actions.

- **Always uppercase.** The class sets `text-transform`, so write the source in natural case ("Los Angeles, California") and let CSS uppercase it. Screen readers then read words, not letters.
- **One line.** If it wraps into a sentence, it should be body text.
- **The slash is a structural mark.** Meta headings start with `/ ` (`/ Scope`), and numbered titles read `1 / Gaia`.
- **Tone follows role.** Brand (default) for nav and headings, `muted` for tertiary meta, `strong` for list data.

## API

| Attribute | Values | Effect |
| --- | --- | --- |
| `class="mh-label"` | n/a | 13px GT Standard Mono, 100% leading, uppercase |
| `data-size` | `sm` | 12px |
| `data-tone` | `muted`, `strong` | `--mh-text-muted` / `--mh-text-strong` |
| `data-leading` | `relaxed` | 130% leading for labels stacked over values |

Or use the plain utility `mh-text-label` / `mh-text-label-sm` on any element.

## Accessibility

- Use real elements: `<p>` for standalone labels, `<dt>` in meta lists, `<span>` inline.
- Don't type the text in capitals; let CSS do it.

## Framer mapping

- Text styles: **Heading 5** (13px, 100%, -1%, uppercase) for general labels; **On Green Label** / **Nav On Green Label** on Forest Green; **Footer Mono White / Dark** in the footer.
- Font: GT Standard Mono Regular (falls back to GT Standard Mono Trial Rg).

## Don't

- Don't use mono for paragraphs or headings.
- Don't letter-space it; tracking is 0.
- Don't bold it.
