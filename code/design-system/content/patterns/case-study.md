---
title: Case Study
section: Patterns
order: 2
description: The template every project page follows. Two-tone title, full-bleed media, fact sheet, then titled chapters of media and short text.
status: live
framer: Bespoke pages /case-studies/{slug} (one per CMS item)
---

# Case Study

## Goal

Show the work in context and say exactly what Micah did. The media carries the story; text is short, specific and in the first person.

## Structure

| # | Section | Components | Notes |
| --- | --- | --- | --- |
| 1 | Nav | [Navigation](../components/navigation.md) | |
| 2 | Title | [Hero](../components/hero.md) (case-study) | Bold project name + Stroke Gray continuation, Display L |
| 3 | Hero media | [Media Frame](../components/media-frame.md) | Full bleed (edge to edge, no gutter), 16:9 or wider, video preferred |
| 4 | Fact sheet | [Meta Grid](../components/meta-grid.md) | About, Industry / Scope, Credits, Year |
| 5…n | Chapters | Heading (35px, near-black) + galleries + Body (18px, Graphite, ≤620px) | e.g. The Insight, Strategy, Visual Identity, Brand in the World, Interface, Designed to Ship |
| | Testimonial | [Testimonial](../components/testimonial.md) | Optional, real quotes only |
| n+1 | Other projects | [Section Header](../components/section-header.md), [Project Grid](../components/project-grid.md) `data-columns="3"` | Three projects, no tags |
| n+2 | Footer | [Footer](../components/footer.md) | |

Every image on the page is [Lightbox](../components/lightbox.md)-enabled.

## Example (condensed)

```html example bleed
<article>
  <header class="mh-hero mh-container" data-variant="case-study" style="padding-bottom:72px">
    <h1 class="mh-hero__name">Gaia <span class="mh-hero__continuation">Turning noticing into a way of caring for the living world.</span></h1>
  </header>
  <div class="mh-media" data-ratio="16:9" data-mh-lightbox><img src="../../assets/samples/gaia.jpg" alt="Gaia app on a phone resting on a mirror in a field of daisies"></div>
  <div class="mh-container" style="padding-block:40px 72px">
    <div class="mh-meta-grid">
      <dl class="mh-meta-grid__col"><div class="mh-meta-grid__item"><dt class="mh-label" data-leading="relaxed">/ About the project</dt><dd class="mh-text-body-lg">A photograph becomes a data point. A data point becomes a record. A record becomes a reason to care.</dd></div></dl>
      <dl class="mh-meta-grid__col"><div class="mh-meta-grid__item"><dt class="mh-label" data-leading="relaxed">/ Scope</dt><dd class="mh-text-body-lg">Visual Identity, UX/UI, Strategy</dd></div><div class="mh-meta-grid__item"><dt class="mh-label" data-leading="relaxed">/ Year</dt><dd class="mh-text-body-lg">2026</dd></div></dl>
    </div>
    <section style="margin-top:96px">
      <h2 class="mh-text-heading mh-text-strong" style="margin:0 0 40px">The Insight</h2>
      <p class="mh-text-body mh-text-body mh-measure" style="margin:0">iNaturalist lets people photograph an organism, record where they found it, and share it with a community that helps identify it.</p>
    </section>
  </div>
</article>
```

## Rules

- **Title**: the project name plus one line of what it does for people, in the visitor's terms. Under about 12 words in the continuation.
- **Chapters**: 4–7 chapters, each a Heading (sentence or Title Case as on the live pages), one gallery, and 1–3 short paragraphs. Paragraphs sit beside or under media, max 620px.
- **Text color**: chapter headings near-black (`--mh-text-strong`), body Graphite (`--mh-text-body`), meta values near-black.
- **Media first**: lead each chapter with media. Galleries use the case-study gallery components (justified grid, double stack, matched pair); don't invent new layouts.
- **Credits**: name collaborators and agencies precisely.
- **Work in progress**: unfinished case studies are gated by `CaseStudyWorkInProgressGate` (`Vu82U8E`); see `docs/case-study-wip-gate.md`.

## Framer mapping

- Each case study is a bespoke page per CMS item (`All Projects`, `yTHrQWMIY`); see `docs/case-study-cms-workflow.md` and `docs/case-study-seo-settings.md`.
- Page-wide controllers: `CaseStudyControllers` (`z13WRHS`, lightbox + link repair), `CaseStudyVideoManager` (`rGMwETR`), `CaseStudyMobileDescriptorLayout` (`W62Sy75`).
- Galleries: `CaseStudyJustifiedMediaGrid` (`c0iPrbN`), `DoubleStackGalleryGrid`, `MatchedStackMediaPair`, `FixedHeightMediaRows` (`IthLMt_`).
- Other projects: `OtherProjectCardRestored` (`vlwa5Cz`).
