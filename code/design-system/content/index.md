---
title: Introduction
section: Overview
description: The visual foundations, components and page patterns behind micahhoang.com.
---

# Introduction

This is the design system behind micahhoang.com: the foundations every page is built on, the components the site is made of, and the page patterns that put them together. It describes what is live today, measured from the published site, and maps each piece back to its Framer style or code component.

**Foundations** define the tokens for color, type, layout, motion, texture and identity. **Components** go from small pieces like the Mono Label and Tag up to the Project Card, Index List and Footer. **Patterns** show how the Home, Case Study and Index pages are put together. Each component page has live examples, usage rules, the class API and its Framer mapping.

Pick a page from the sidebar, or press ⌘K to search. Every page also exists as markdown for agents: use the **Markdown** link in its header, or start from [agents.md](../agents.md).

## The system at a glance

```html example
<div class="ds-demo-stack">
  <p class="mh-label">Micah Hoang / Brand designer / Los Angeles, California</p>
  <p class="mh-text-display-xl" style="margin:0">Micah Hoang</p>
  <p class="mh-text-heading" style="margin:0;max-width:11em">Brand designer with a systems mind.</p>
  <hr class="mh-rule">
  <ul class="mh-tags"><li class="mh-tag">Strategy</li><li class="mh-tag">Visual identity</li><li class="mh-tag">Editorial</li></ul>
</div>
```

## Principles

Five words to go back to whenever a decision is unclear: **Considered. Quiet. Alive. Specific. Shipped.** Read [Principles](foundations/principles.md) before designing anything new.

## Start here

- [Colors](foundations/colors.md): two surfaces (Cream and Forest Green) and semantic roles.
- [Typography](foundations/typography.md): GT Standard for display and body, GT Standard Mono for labels.
- [Layout](foundations/layout.md): gutters, grids, breakpoints, rules instead of boxes.
- [Motion](foundations/motion.md): the Snappy ease, flip rails and type reveals.
- [Project Card](components/project-card.md): the main way work appears on the site.
- [Case Study pattern](patterns/case-study.md): the template every project page follows.

## Files

| File | What it is |
| --- | --- |
| `tokens/tokens.json` | Token source of truth (DTCG) |
| `tokens/tokens.css` | CSS custom properties, generated |
| `css/components.css` | Component styles |
| `js/components.js` | Optional behavior (lightbox, filters, loader, reveals) |
| `components.json` | Machine-readable component manifest |
| `llms.txt` / `llms-full.txt` | Agent index / everything in one file |
