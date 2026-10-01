---
title: Project Card
section: Components
order: 11
description: The main way work appears on the site. A numbered mono title that flips on hover, a 16:9 media frame, and discipline tags.
status: live
framer: HomeSelectedWorkGrid (FecepLS); OtherProjectCardRestored (vlwa5Cz); IndexPage grid (rgAZFOv)
codeFileId: FecepLS
classes: [mh-project-card, mh-project-card__link, mh-project-card__meta]
tokens: [type.label, space.5, motion.duration.base, motion.scale.hover]
---

# Project Card

## Examples

```html example
<div class="mh-project-grid">
  <article class="mh-project-card">
    <a class="mh-project-card__link" href="#">
      <div class="mh-project-card__meta mh-label">
        <span>1</span><span>/</span>
        <span class="mh-flip"><span class="mh-flip__track"><span>Gaia</span><span aria-hidden="true">Gaia</span></span></span>
      </div>
      <div class="mh-media"><img src="../../assets/samples/gaia.jpg" alt="Gaia app on a phone resting on a mirror in a field of daisies"></div>
    </a>
    <ul class="mh-tags"><li class="mh-tag">Visual identity</li><li class="mh-tag">UX/UI</li><li class="mh-tag">Strategy</li></ul>
  </article>
  <article class="mh-project-card">
    <a class="mh-project-card__link" href="#">
      <div class="mh-project-card__meta mh-label">
        <span>2</span><span>/</span>
        <span class="mh-flip"><span class="mh-flip__track"><span>AirPods Pro 3</span><span aria-hidden="true">AirPods Pro 3</span></span></span>
      </div>
      <div class="mh-media" data-stroke><img src="../../assets/samples/airpods.jpg" alt="AirPods Pro 3 earbuds on a white background"></div>
    </a>
    <ul class="mh-tags"><li class="mh-tag">2D motion</li><li class="mh-tag">3D motion</li><li class="mh-tag">Social media</li></ul>
  </article>
</div>
```

## Anatomy

1. **Meta row**: mono label in a `24px 11px 1fr` grid: number, slash, title. The title is a flip rail.
2. **Media**: [Media Frame](media-frame.md), 16:9, optional stroke.
3. **Tags**: up to three [Tags](tag.md), outside the link.

The meta row and media share one link; tags sit outside it so they can be their own links or filters.

## Usage

- Number cards in display order starting at 1, without zero padding.
- The title is the CMS project title, set by CSS in uppercase mono.
- Hover/focus on the link triggers two moves together: the title flips (18px, 420ms Snappy) and the image scales to 1.02.
- Use a poster image under a thumbnail video, so a returning visitor never sees an empty frame.

## API

| Class | Element | Notes |
| --- | --- | --- |
| `mh-project-card` | `article` | Column, 16px gap |
| `mh-project-card__link` | `a` | Wraps meta + media; hover host |
| `mh-project-card__meta` | `div` + `mh-label` | `24px 11px 1fr` grid; flip window is 13px |
| `mh-media` | `div` | See Media Frame |
| `mh-tags` | `ul` | Optional |

## Data model (CMS)

Map cards to the Framer CMS `All Projects` collection (`yTHrQWMIY`):

| Card field | CMS field | Field id |
| --- | --- | --- |
| Title | Title | `oeXZcmPna` |
| href | `/case-studies/{slug}` | `pdXVG_fBO` |
| Poster image | Thumbnail | `Jy7hBJady` |
| Video | Thumbnail Video | `SvOqFqdby` |
| `data-stroke` | Thumbnail Stroke | `OHdUYs6Mo` |
| Tags | Category 1–3 | (discipline fields) |

```json
{ "title": "Gaia", "slug": "gaia", "thumbnail": "…/gaia.jpg", "thumbnailVideo": "…/gaia.mp4", "thumbnailStroke": false, "tags": ["Visual identity", "UX/UI", "Strategy"] }
```

## Accessibility

- The link's accessible name is "1 / Gaia" (the duplicate flip span is `aria-hidden`).
- Card media `alt` describes the image, not the project name.

## Framer mapping

- Home: `HomeSelectedWorkGrid` (`FecepLS`). Six CMS-limited items, 2 columns, `Thumbnail Video` preferred with `Thumbnail` as poster, first-row videos `preload="auto"`, live CMS row reuse on return navigation. Read `docs/framer-current-state.md` before editing it.
- Case-study "Other projects": `OtherProjectCardRestored` (`vlwa5Cz`), 3 columns.
- `/index` grid: `IndexPage` (`rgAZFOv`) through `IndexPageGridPreview` (`LgIzFjJ`), which supplies `gridLayoutVariant="figma"`. Never overwrite the wrapper.
- Never add baked fallback rows or hard-coded media URLs; cards come from the CMS only.

## Don't

- Don't put the description or year on the card.
- Don't add a background, border or shadow around the card.
- Don't truncate titles with "..." inside the meta row; let the grid ellipsis handle overflow.
