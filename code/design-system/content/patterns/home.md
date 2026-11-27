---
title: Home
section: Patterns
order: 1
description: Name, descriptor, six selected projects, a short About, then the footer. The ten-second read.
status: live
framer: Page "/" (Home)
---

# Home

## Goal

A senior design lead should get the read in ten seconds: **brand designer, systems thinker, high craft, real shipped work.** Home shows six projects, not all of them.

## Structure

| # | Section | Components | Notes |
| --- | --- | --- | --- |
| 0 | Boot (first visit) | [Page Loader](../components/page-loader.md) | Home only |
| 1 | Nav | [Navigation](../components/navigation.md) | Same as every page |
| 2 | Hero | [Hero](../components/hero.md) (home) | Name, two-line descriptor, link list + ©2026 |
| 3 | Selected work | Rule-only [Section Header](../components/section-header.md), [Project Grid](../components/project-card.md) | No title since 2026-11-11; 6 projects, 2 columns, "View all" right-aligned below |
| 4 | About Micah | Section Header, portrait [Media Frame](../components/media-frame.md), Body L, [Action](../components/links-actions.md) "Read more" | Portrait left, copy right. Hovering the image or the link triggers both (image scale + link flip) |
| 5 | Scroll to top | [Scroll to Top](../components/links-actions.md) | Left gutter, 60px below the About content |
| 6 | Footer | [Footer](../components/footer.md) | Forest Green |
| n/a | Texture | [Grain Overlay](../foundations/texture.md) | Page-level |

## Example (condensed)

```html example bleed
<div class="mh-container" style="padding-bottom:var(--mh-section-padding-y)">
  <header class="mh-hero">
    <h1 class="mh-hero__name mh-text-display-xl">Micah Hoang</h1>
    <p class="mh-hero__descriptor mh-text-heading">Brand designer with a systems mind.</p>
    <div class="mh-hero__bar">
      <ul class="mh-link-list mh-label"><li><a class="mh-link" href="#">LinkedIn</a></li><li><a class="mh-link" href="#">Resume</a></li><li><a class="mh-link" href="#">Email</a></li><li><a class="mh-link" href="#">Cosmos</a></li></ul>
      <span class="mh-label">©2026</span>
    </div>
  </header>
  <section>
    <header class="mh-section-header" data-variant="rule">
      <hr class="mh-rule">
    </header>
    <ul class="mh-project-grid">
      <li class="mh-project-card"><a class="mh-project-card__link" href="#"><div class="mh-project-card__meta mh-label"><span>1</span><span>/</span><span class="mh-flip"><span class="mh-flip__track"><span>Gaia</span><span aria-hidden="true">View project</span></span></span></div><div class="mh-media"><img src="../../assets/samples/gaia.jpg" alt=""></div></a><ul class="mh-tags"><li class="mh-tag">Visual identity</li><li class="mh-tag">UX/UI</li></ul></li>
      <li class="mh-project-card"><a class="mh-project-card__link" href="#"><div class="mh-project-card__meta mh-label"><span>2</span><span>/</span><span class="mh-flip"><span class="mh-flip__track"><span>AirPods Pro 3</span><span aria-hidden="true">View project</span></span></span></div><div class="mh-media" data-stroke><img src="../../assets/samples/airpods.jpg" alt=""></div></a><ul class="mh-tags"><li class="mh-tag">2D motion</li><li class="mh-tag">3D motion</li></ul></li>
    </ul>
    <div style="display:flex;justify-content:flex-end;margin-top:var(--mh-project-grid-to-action)"><a class="mh-action" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>View all</span><span aria-hidden="true">View all</span></span></span></a></div>
  </section>
</div>
```

## Rules

- **Selected-work order** is a curation decision (current: Gaia, AirPods Pro 3, Peak Energy, Motion Connect 2025, Simon & Schuster, National Park Playing Cards). It comes from the CMS, not code.
- Six projects, never more. Everything else lives in the Index.
- No hero image. The first image a visitor sees is project 1.
- Vertical rhythm (from the Framer page): hero padding 100px top and bottom (name at 101px and ~126px bottom on phone); Selected work rule 6px into its section (1px phone), rule → grid 45px (35px phone); grid → View all 30px (20 mobile); 100px section bottom padding before About; About rule → title 20px, title → content 30px (20 mobile); content → Scroll to top 60px.
- Selected work has no title; the label layer is hidden in Framer (node `XzikUe04m`). Rollback recipe: `code/mirror/backups/home-layout-2026-11-11/README.md`.
- About: 175px portrait (170 tablet/mobile), 20px gap, copy max 600px in Body L, 40px to Read more (30 tablet/mobile). On mobile the portrait stacks above the copy.

## Framer mapping

- Selected work: `HomeSelectedWorkGrid` (`FecepLS`), which also owns the About portrait/link linked hover.
- Boot and transitions: `PageTransition` (`gmalnRr`).
- Hero and footer-bar social labels: Text Flip Up (`TextEncryptionEffect.tsx`, `p7tSTaD`).
