---
title: Meta Grid
section: Components
order: 16
description: The case-study fact sheet. "/ LABEL" mono headings over Body L values, in two columns.
status: live
framer: Case-study "Descriptor" section; CaseStudyMobileDescriptorLayout (W62Sy75)
codeFileId: W62Sy75
classes: [mh-meta-grid, mh-meta-grid__col, mh-meta-grid__item]
tokens: [type.label, type.body-lg, layout.split-gap, space.9, space.5]
---

# Meta Grid

## Examples

```html example
<div class="mh-meta-grid">
  <dl class="mh-meta-grid__col">
    <div class="mh-meta-grid__item">
      <dt class="mh-label" data-leading="relaxed">/ About the project</dt>
      <dd class="mh-text-body-lg">A photograph becomes a data point. A data point becomes a record. A record becomes a reason to care. Gaia is a rebrand and redesign of iNaturalist, turning the world's largest biodiversity platform from a tool for experts into an open invitation to notice and protect the living world.</dd>
    </div>
    <div class="mh-meta-grid__item">
      <dt class="mh-label" data-leading="relaxed">/ Industry</dt>
      <dd class="mh-text-body-lg">Nature</dd>
    </div>
  </dl>
  <dl class="mh-meta-grid__col">
    <div class="mh-meta-grid__item">
      <dt class="mh-label" data-leading="relaxed">/ Scope</dt>
      <dd class="mh-text-body-lg">Visual Identity, UX/UI, Strategy</dd>
    </div>
    <div class="mh-meta-grid__item">
      <dt class="mh-label" data-leading="relaxed">/ Credits</dt>
      <dd class="mh-text-body-lg">Client: Self-Initiated Proposal<br>Designer: Micah Hoang</dd>
    </div>
    <div class="mh-meta-grid__item">
      <dt class="mh-label" data-leading="relaxed">/ Year</dt>
      <dd class="mh-text-body-lg">2026</dd>
    </div>
  </dl>
</div>
```

## Usage

- Sits directly under the case-study hero media.
- **Left column**: About the project (the lead paragraph), then Industry.
- **Right column**: Scope, Credits, Year.
- Labels start with `/ `. Values are Body L in near-black.
- Credits are exact and one per line: `Role: Name`. Name collaborators; say "Designer: Micah Hoang" only if that's true.

## API

| Class | Element | Notes |
| --- | --- | --- |
| `mh-meta-grid` | `div` | Two columns, 30px gap; stacks below 810px |
| `mh-meta-grid__col` | `dl` | 40px between items (36px mobile) |
| `mh-meta-grid__item` | `div` | `dt` label (`/Small Mono`) + `dd` value (`/Body L`: 22 / 18 / 15px), 15px gap |

## Data model (CMS)

```json
{ "about": "A photograph becomes a data point…", "industry": "Nature", "scope": ["Visual Identity", "UX/UI", "Strategy"], "credits": [{ "role": "Client", "name": "Self-Initiated Proposal" }, { "role": "Designer", "name": "Micah Hoang" }], "year": 2026 }
```

## Framer mapping

- Native case-study "Descriptor" section on each bespoke `/case-studies/{slug}` page.
- On mobile, `CaseStudyMobileDescriptorLayout` (`W62Sy75`) reorders the descriptor columns. Keep the same DOM order (About, Industry, Scope, Credits, Year) so it works.

## Don't

- Don't render the meta as a table with borders.
- Don't add icons or pills to values.
