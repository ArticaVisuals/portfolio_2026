# Framer Index CMS Auto-Update Audit

**Date:** May 3, 2026
**Last status check:** June 2, 2026
**Scope:** `/index` custom `IndexPage` component and CMS auto-refresh behavior
**Status:** Non-destructive investigation only. The live `/index` page was not replaced or published. The temporary `/index-cms-test` route was deleted during restore.

---

## Status Update - June 2, 2026

This file is historical. Do not revive `/index-cms-test` as a default next step just because the original recommendation below says to prototype it. Current `/index` is maintained by `IndexPage.tsx` (`rgAZFOv`) with the mounted `ProjectRegistrar` registry first, then direct CMS-module scan, then manual `projects`; `DEFAULT_PROJECTS` is only used when `useCMS=false`.

The May 26 Framer cleanup removed unused/draft helpers that were not mounted in current page XML: `IndexFilterNavDraftPage.tsx`, `IndexListCursorPreview.tsx`, and `CaseStudyRevealTuner.tsx`. Local-only mirrors `IndexPageFilterNavDraft.tsx` and `IndexRuleColorOverride.tsx` were also removed from the repo. The active `/index` helper stack is now just `IndexPage.tsx`, `CaseStudyThumbnailStrokeStyles.tsx`, and `IndexPageBreakpointsDraft.tsx`.

Open watchpoint: verify the visible Industry labels after any CMS schema or binding change. Older checks saw simplified labels on published `/index`; do not assume long CMS industry strings are live without checking the current route.

---

## Status Update — May 22, 2026

The May 3 root cause is still useful historical context, but the implementation has moved again:

- Current `IndexPage.tsx` (`rgAZFOv`) attempts to discover/import the generated Framer CMS module for `All Projects` (`yTHrQWMIY`) and call `scanItems()` directly when `useCMS=true`.
- The older window-singleton registry (`window.__articaIndexProjectsRegistry`) remains as a fallback path, followed by manual `projects`, then the in-code `DEFAULT_PROJECTS` snapshot.
- The May 22 browser audit confirmed `yTHrQWMIY` CMS resources load on `/index`; `window.__articaIndexProjectsRegistry` existed but had `items.size === 0`.
- The published `/index` visibly renders the simplified industry taxonomy (`Education`, `Health`, `Human Rights`, `Literature`, `Music`, `Nature`, `Science`, `Technology`), not the longer CMS strings documented elsewhere.
- The UI is now `/ Year / Service / Industry`, with per-group `All` buttons, near-black rules, and grid cards that place media above title/metadata.

Net behavior to remember: do not tell future agents the Registrar component is still missing or that CMS edits categorically cannot reach `/index`. Also do not assume the long CMS industry strings are visible on `/index` until a live check confirms that exact label source.

---

## Status Update — May 16, 2026

Later design changes after this audit: canonical `/index` now renders the inline uppercase `GRID / LIST` toggle directly inside `IndexPage.tsx` (`rgAZFOv`) instead of using a visible fixed floating control or helper proxy. The temporary side-by-side `/index-inline-toggle-test` route (`VdRy9MV8k`) has been removed. This May 16 color note was later superseded by the May 22 state, where `/index` rules/dividers default to `#141414` through color controls.

## Status Update — May 6, 2026

Variant B from §"Recommended Next Variants" was **partially implemented in the live Framer code**, not from this repo:

- `IndexPage.tsx` (Framer code file `rgAZFOv`) now has a `useCMS` Boolean property control (default `false`) and a window-singleton registry (`window.__articaIndexProjectsRegistry`). When `useCMS=true`, `IndexPage` subscribes to the registry's `Map<string, Project>` and re-renders on changes.
- The live `/index` page (`u2LOaBT5q`) currently has `useCMS="true"` set on the `IndexPage` instance.
- Discipline / Industry / Year nav lists were derived dynamically from whatever projects were in scope (registry → prop → `DEFAULT_PROJECTS` snapshot, in that priority order). Superseded May 22 by `/ Year / Service / Industry` and direct CMS-module scan before registry fallback.
- The `IndexPage` Grid view no longer falls back to the native `Case Studies Filter`; later May 2026 work also removed the old `Case Study` module import and now renders project-driven cards as native HTML inside `IndexPage.tsx`.

**Historical missing piece (superseded May 22, then superseded again by the June 2 current-state docs).** At this May 6 checkpoint, a separate `ProjectRegistrar` code component had not been created, so `/index` fell through to the in-code 15-project `DEFAULT_PROJECTS` snapshot. Later work added the misleadingly named `Test.tsx`/`ProjectRegistrar` bridge. For the current data priority, use `framer-current-state.md`.

**Net behavior at the May 6 checkpoint:** the published page rendered the in-code snapshot, with simplified industry labels (`Technology`, `Publishing`, `Nature & Outdoors`, `Design Education`, `Health & Wellness`, `Human Rights`, `Science`, `Music`, `Literature`). Current behavior is summarized in the May 22 status update above.

**Other state changes since this audit:**

- The duplicate `/index` page `yKKOMVNs6` (Mono 13 default) has been **deleted**. There is now exactly one `/index` page (`u2LOaBT5q`).
- The old note that `IndexRuleColorOverride` unified `/index` rules to light gray is stale. This was `#233324` in the May 19 pass and is `#141414` in the May 22 `/index` defaults.
- `/index-cms-test` (`QuhXOj9pq`) remains deleted; no equivalent draft exists today.
- Historical May 6 drift note: the repo's `IndexPage.tsx` was then older than the live Framer file. As of the May 22 snapshot, the repo has been reconciled again, but agents should still read live Framer source before pushing.

---

## Original Audit (May 3, 2026)

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
- Draft test page created for this audit, then deleted during restore: `/index-cms-test`, `QuhXOj9pq`

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

A draft-only page, `/index-cms-test`, was created as a safe variant, then deleted during restore after it disrupted the Framer layout view. It contained:

1. The same custom `IndexPage` code component instance.
2. A linked `List View` component probe.
3. A linked `Case Studies Filter` component probe.

This page no longer exists in the Framer project.

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

> **As of May 22, 2026 this drift warning is historical.** The repo mirror has been reconciled through the direct CMS-module loader, registry fallback, dynamic taxonomy, and native Grid view. Still read the live Framer file before pushing, because canvas edits can make Framer newer again without touching git.

Original May 3 drift note: the local `IndexPage.tsx` in this repo was newer than the live Framer code file `rgAZFOv`. That specific warning is superseded by the May 22 reconciliation above.

The local version includes a native `Case Studies Filter` grid fallback for the unfiltered Grid state when no project array is bound. That improves the unfiltered grid path, but it does not solve instant CMS updates for the custom List view, taxonomy nav, index nav, or filtered states.

Do not reuse this May 3 conclusion as current guidance. For current `/index` behavior, start from `framer-current-state.md` and recheck the live Framer file before publishing.

---

## Recommended Next Variants

### Variant A: Native CMS-Backed Index

Rebuild `/index-cms-test` around Framer-native CMS collection lists for the project rows/cards. This is the most likely durable fix for instant CMS updates.

Tradeoff: custom client-side filtering and automatically derived taxonomy nav may need to be simplified, rebuilt with native Framer filters, or backed by dedicated taxonomy collections.

### Variant B: Code Shell + Native CMS Sections

Keep the custom code component for layout chrome, toggles, and visual state, but render CMS-backed sections through native Framer components where possible.

Tradeoff: the code shell cannot reliably derive all unique CMS values on its own, so nav/category auto-generation may still need a native or manual source of truth.

### Variant C: Local Code Sync Only

Historical May 3 recommendation: sync the local `IndexPage.tsx` into Framer so the live code matches the repo and gains the improved unfiltered grid fallback. This is no longer the active recommendation after the May 22 direct CMS-module reconciliation.

Tradeoff: this is safer and smaller, but it does not fix instant CMS refresh for List view or taxonomy nav.

### Variant D: External Data Source

Move project index data to an external JSON/API source that the code component can fetch at runtime.

Tradeoff: this adds infrastructure and should not expose private Framer CMS credentials client-side. It is heavier than the native Framer solution.

---

## Recommendation

Historical May 3 recommendation: use `/index-cms-test` to prototype Variant A first. Current May 26 guidance: do not recreate that test route unless Micah explicitly wants a native-CMS rewrite experiment. Start from `framer-current-state.md`, read live `IndexPage.tsx` through Framer MCP, and preserve the current visual/motion behavior unless a new design decision says otherwise.
