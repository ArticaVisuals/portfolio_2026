---
title: Typography
section: Foundations
order: 3
description: GT Standard for display and reading, GT Standard Mono for every label, and a scale with a huge top and a small bottom.
tokens: [font.*, type.*]
---

# Typography

## Overview

Two families do everything. **GT Standard** (L width) sets display type, headings and body. **GT Standard Mono** sets every label, nav item, tag and action, always uppercase at 12–13px. The scale is deliberately polarized: display sizes are huge and tight, everything else is small. There is almost nothing in between.

| Family | CSS variable | Weights | Framer font names |
| --- | --- | --- | --- |
| GT Standard | `--mh-font-sans` | 400, 500, 700 | GT Standard L Regular, GT Standard Trial L Md, GT Standard Trial L Bd |
| GT Standard Mono | `--mh-font-mono` | 400 | GT Standard Mono Regular, GT Standard Mono Trial Rg |

`css/fonts.css` loads the same Framer-hosted files the live site uses and folds them into the families `"MH GT Standard"` and `"MH GT Standard Mono"`, so `font-weight` works normally.

## Scale

Each style is one utility class, `.mh-text-<name>`, generated from `tokens.json`. Sizes are desktop / tablet / mobile.

<!-- ds:type-specimens -->

| Style | Class | Size | Weight | Leading | Tracking | Framer text style | Use |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Display XL | `mh-text-display-xl` | 120 / 94 / 58 | 700 | 100% | -1% | Heading 1 | Home hero name. Once per site. |
| Display L | `mh-text-display-l` | 70 / 53 / 42 | 700 | 100% | -1% | Heading 2b | Case-study title + muted continuation |
| Display M | `mh-text-display-m` | 70 / 53 / 42 | 400 | 100% | -1% | Heading 2 | Section headers: "Selected work", "About Micah" |
| Display Footer | `mh-text-display-footer` | 80 / 64 / 40 | 400 | 100% | -2% | (footer) | Uppercase footer contact links |
| Heading | `mh-text-heading` | 35 / 24 / 20 | 400 | 110% | -1% | Heading 3 | Hero descriptor, case-study section titles |
| Title | `mh-text-title` | 22 | 400 | 120% | 0 | Index Title | Index rows, uppercase |
| Body L | `mh-text-body-lg` | 22 / 22 / 18 | 400 | 120% | +1% | Body | Lead paragraphs, About, meta values |
| Body | `mh-text-body` | 18 / 18 / 16 | 400 | 140% | 0 | Paragraph Regular (18) | Case-study long-form |
| Body S | `mh-text-body-sm` | 16 | 400 | 140% | 0 | Paragraph Regular | Captions, small notes |
| Label | `mh-text-label` / `mh-label` | 13 | 400 mono | 100% | 0 | Heading 5, Body - 100% | Nav, meta, actions, eyebrows |
| Label S | `mh-text-label-sm` | 12 | 400 mono | 100% | 0 | (component) | Tags below 1200px, dense meta |

## Pairings

```html example
<div class="ds-demo-stack">
  <div>
    <p class="mh-label" style="margin-bottom:16px">/ About the project</p>
    <p class="mh-text-body-lg mh-text-strong" style="margin:0;max-width:28em">A photograph becomes a data point. A data point becomes a record. A record becomes a reason to care.</p>
  </div>
  <hr class="mh-rule">
  <div>
    <h3 class="mh-text-heading mh-text-strong" style="margin:0 0 24px">The Insight</h3>
    <p class="mh-text-body mh-text-body" style="margin:0;max-width:620px">iNaturalist lets people photograph an organism, record where they found it, and share it with a community of naturalists who help identify it.</p>
  </div>
</div>
```

## Usage

- **One display moment per view.** A page gets one Display XL or Display L; sections get Display M; everything else is Heading or smaller.
- **Display type is tight**: 100% leading and slight negative tracking. Don't loosen it.
- **Mono is always uppercase**, always 12–13px, never for sentences longer than a line.
- **Two-tone headlines.** A case-study title can continue its sentence in `--mh-text-muted` at the same size and weight ("Gaia" + "Turning noticing into a way of caring for the living world.").
- **Body color follows weight of content**: lead copy is `--mh-text-strong`, long-form is `--mh-text-body`.
- **Measure**: long-form body caps at `--mh-measure` (620px).
- **Pretty wrapping**: the live site applies `text-wrap: pretty` to paragraph-size text ≤23px (`ParagraphPrettyWrap`, `EjvkJhv`). Use `text-wrap: balance` for display lines if needed.

## Don't

- Don't use bold (700) below Display L. Weight contrast comes from size.
- Don't set body copy in mono, or labels in sentence case.
- Don't add a third typeface (the old Manrope / Diatype set is retired).
- Don't use letter-spaced uppercase sans as a label substitute; use mono.
