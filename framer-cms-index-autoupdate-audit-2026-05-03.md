# Framer Index CMS Auto-Update Audit

**Date:** May 3, 2026  
**Scope:** `/index` custom `IndexPage` component and CMS auto-refresh behavior  
**Status:** Non-destructive investigation only. The live `/index` page was not replaced or published.

---

## Safety Snapshot

Before editing Framer, the local repo was initialized, committed, and pushed to GitHub.

- GitHub remote: `git@github.com:ArticaVisuals/portfolio_2026.git`
- Baseline commit: `317ceda` (`Snapshot current Framer portfolio code`)
- Rollback branch: `backup/pre-framer-cms-binding`
- Rollback tag: `pre-framer-cms-binding-2026-05-03`

The current `main` branch contains the baseline portfolio files plus this audit note.

---

## Framer Nodes Inspected

- `/index` page: `u2LOaBT5q`
- `/index` `IndexPage` instance: `rDSo8vhY0`
- `IndexPage.tsx` Framer code file: `rgAZFOv`
- `All Projects` CMS collection: `yTHrQWMIY`
- Existing native-style list component: `List View`, `uAVxdOWKR`
- Existing native-style grid component: `Case Studies Filter`, `y8kvTlWMC`
- Draft test page created for this audit: `/index-cms-test`, `QuhXOj9pq`

The current `/index` page contains:

```xml
<IndexPage
  nodeId="rDSo8vhY0"
  componentId="rgAZFOv"
  defaultView="list"
  listTypographyVariant="standard"
  listHoverVariant="flip"
/>
```

There is no `projects` prop in the page XML.

---

## Test Page

A draft-only page, `/index-cms-test`, was created as a safe variant. It currently contains:

1. The same custom `IndexPage` code component instance.
2. A linked `List View` component probe.
3. A linked `Case Studies Filter` component probe.

This page exists only for comparison and should not be published until it is intentionally reviewed.

---

## Root Cause

The custom `IndexPage` component exposes `projects` as a Framer `ControlType.Array`. In the Framer property panel, this appears as a manual list with `0 Items` and an `Add...` button. Adding an item creates a manual object with fields like Title, Category 1, Industry, Year, Thumbnail, Slug, and Sorting Number.

No CMS collection binding control appeared for this array during the test. This means the current standalone code component is not directly subscribed to the `All Projects` CMS collection. When the CMS changes, the component keeps rendering either:

- its internal fallback project data, or
- any manually added array items.

That explains the stale behavior: adding/removing projects or prompting an agent to re-run code can incidentally refresh the component state, but CMS edits are not a live data source for this code component.

Framer's current guidance is that code components should not access CMS collections directly through internal APIs. The supported live-update path is native CMS/Collection List binding, or placing code components inside CMS-bound collection items and passing item fields into each instance.

Reference: <https://www.framer.com/help/articles/issues-with-code-components-accessing-the-cms/>

---

## Important Code Drift

The local `IndexPage.tsx` in this repo is newer than the live Framer code file `rgAZFOv`.

The local version includes a native `Case Studies Filter` grid fallback for the unfiltered Grid state when no project array is bound. That improves the unfiltered grid path, but it does not solve instant CMS updates for the custom List view, taxonomy nav, index nav, or filtered states.

Do not assume pushing local `IndexPage.tsx` to Framer will fix the CMS auto-update issue by itself.

---

## Recommended Next Variants

### Variant A: Native CMS-Backed Index

Rebuild `/index-cms-test` around Framer-native CMS collection lists for the project rows/cards. This is the most likely durable fix for instant CMS updates.

Tradeoff: custom client-side filtering and automatically derived taxonomy nav may need to be simplified, rebuilt with native Framer filters, or backed by dedicated taxonomy collections.

### Variant B: Code Shell + Native CMS Sections

Keep the custom code component for layout chrome, toggles, and visual state, but render CMS-backed sections through native Framer components where possible.

Tradeoff: the code shell cannot reliably derive all unique CMS values on its own, so nav/category auto-generation may still need a native or manual source of truth.

### Variant C: Local Code Sync Only

Sync the local `IndexPage.tsx` into Framer so the live code matches the repo and gains the improved unfiltered grid fallback.

Tradeoff: this is safer and smaller, but it does not fix instant CMS refresh for List view or taxonomy nav.

### Variant D: External Data Source

Move project index data to an external JSON/API source that the code component can fetch at runtime.

Tradeoff: this adds infrastructure and should not expose private Framer CMS credentials client-side. It is heavier than the native Framer solution.

---

## Recommendation

Use `/index-cms-test` to prototype Variant A first. Keep the current `/index` untouched until the draft page proves that project rows, nav labels, category sections, and links update correctly after a CMS edit.
