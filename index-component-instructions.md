# Index Page Code Component — Build Instructions for Claude Code

**Project:** Micah Hoang Portfolio Redesign
**Component:** `/index` page — List/Grid toggle with taxonomy filters
**Target:** Framer code component (React) injected into Jacob Turner template
**Date:** May 2026
**Last Framer MCP audit:** May 15, 2026.

> **Read first:** the live behavior of `/index` is fully described in `framer-current-state.md` §3. This file is the build/maintenance brief for the code component. When the two disagree, `framer-current-state.md` wins.

**State summary (May 10, 2026):**

- One `/index` page, `u2LOaBT5q`. The earlier duplicate `yKKOMVNs6` (Mono 13 default) has been deleted.
- Live Framer code file `rgAZFOv` powers `/index`. The published page binds `useCMS=true`, `defaultView="list"`, `listTypographyVariant="standard"`, `listHoverVariant="flip"`.
- The live Framer file is **newer than the repo `IndexPage.tsx`**. Do not push the repo file back to Framer without merging in the live changes (see §3.A).
- An `IndexRuleColorOverride` instance sits on the page and unifies all `.idx-rule` and `.idx-row-divider` colors to `rgb(20, 20, 20)`.
- **Grid view rewritten (May 10, 2026):** the `https://framer.com/m/Case-Study-G9lec1.js` import was removed. Grid cards now render as native HTML inside `IndexPage.tsx` (uniform 16:9 thumbnails, 3/2/1 column responsive grid, title above the image with the same hover-flip used in List view, optional `<video>` on hover). The thumbnails were rendering blank because the responsive-image format being passed to the Framer Case Study module didn't hydrate for code-component usage; rendering directly from `<img>` fixed this.
- **ImageMaskReveal disabled on `/index` (May 10, 2026):** the page-level instance `qf2vKr_sV` is now `enabled="false"`. The site-wide instances on `/`, `/case-studies`, `/case-studies/:slug`, `/info`, and `/contact` remain `enabled="true"` with `activation="always"`. The `/index` page intentionally skips the curtain reveal so the archive loads instantly.
- **Thumbnail stroke helper added (May 15, 2026):** `CaseStudyThumbnailStrokeStyles.tsx` (`Z28JYvA`) controls per-project thumbnail strokes from the CMS Boolean `Thumbnail Stroke` (`OHdUYs6Mo`). The `/index` helper instance is `szF9sZNWA`; Home and `/case-studies` also have instances. This helper is the source of truth for `.idx-grid-card-media.with-stroke`, so the old static class should not be treated as independent state.

---

## 1. What You're Building

A single React code component for Framer that renders the content area of the `/index` archive page. It currently exposes:

- Three taxonomy columns (Discipline, Industry, Year) acting as multi-select filters.
- Two view modes (List, Grid) toggled from a fixed bottom-left control.
- Two A/B variants for List view (`Standard` vs `Mono 13` typography; `Flip` vs `Highlight` hover).
- A trailing project-count footer.

Project data flows in through three priority-ranked sources (described in §3). The component **does not** include the site nav, the `INDEX` heading at 110px (that's a sibling Framer text element), or any 3D/WorldGrid surface.

**Important caveat:** the previous behavior where the unfiltered Grid view fell back to the native `Case Studies Filter` component has been removed. Grid view now renders project-driven cards as native HTML inline in `IndexPage.tsx` (no external Framer module). The native `Case Studies Filter` lives only on `/case-studies` now.

The outer `idx-container` owns the side margin (`padding: 0 20px`) and that should match the nav section. `IndexPage.tsx` owns the single List/Grid toggle; do not restore a second component-local Grid/List toggle.

**Home note, May 2026:** the Home selected-work grid is not owned by `IndexPage.tsx`. It is a six-item CMS-backed selected-work query using the native Framer `Case Study` component. Do not recode Home unless Micah explicitly asks.

**CMS note, May 2026:** the Framer `All Projects` CMS collection has 15 real projects. All Jacob Turner sample/template projects were permanently deleted. Do not re-add sample fallback data such as Vern Carter, Iris Wade, Orion Ventures, Echoes, Iconic, Adapting Literature, Genre Evolution, Digital Disruption, Connections, Capturing the Essence, Beyond the Frame, or Harmony in Motion.

---

## 2. Design Token Strategy — CRITICAL

The live component uses one centralized `tokens` object with hardcoded values copied from the Framer/Figma visual system. Keep values centralized there. Do not scatter colors, fonts, or spacing magic numbers throughout new code.

### Token object (live in Framer)

```ts
const tokens = {
  textPrimary: "#26211f",
  textSecondary: "#636363",
  textTertiary: "#979797",
  bg: "#F7F5F0",
  dividerStrong: "#26211f",
  dividerSubtle: "#979797",
  surfaceOverlay: "rgba(215, 213, 207, 0.72)",
  surfaceActive: "#EAE8E3",
  fontDisplay: "'GT Standard Trial', 'Inter', sans-serif",
  fontHeading: "'GT Standard Trial', 'Inter', sans-serif",
  fontMono:    "'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace",
}
```

Note: although `dividerStrong` and `dividerSubtle` differ here, the page-level `IndexRuleColorOverride` instance overwrites both at runtime to `rgb(20, 20, 20)` via `!important` global CSS. If you remove the override, the lighter intra-year dividers come back.

Earlier versions of this doc said the component must use guessed Framer CSS variable names. That is stale. Only switch a token to `var(...)` after verifying the actual variable name in Framer.

---

## 3. Component Props (Framer Property Controls)

The live `addPropertyControls` block:

```ts
addPropertyControls(IndexPage, {
  useCMS: {
    type: ControlType.Boolean,
    title: "Use CMS",
    defaultValue: false,
    enabledTitle: "On",
    disabledTitle: "Off",
  },
  projects: {
    type: ControlType.Array,
    title: "Projects",
    control: {
      type: ControlType.Object,
      controls: {
        title:              { type: ControlType.String,  title: "Title" },
        category1:          { type: ControlType.String,  title: "Category 1" },
        category2:          { type: ControlType.String,  title: "Category 2" },
        category3:          { type: ControlType.String,  title: "Category 3" },
        industry:           { type: ControlType.String,  title: "Industry" },
        year:               { type: ControlType.String,  title: "Year" },
        thumbnail:          { type: ControlType.Image,   title: "Thumbnail" },
        thumbnailVideoLink: { type: ControlType.String,  title: "Thumbnail Video Link" },
        slug:               { type: ControlType.String,  title: "Slug" },
        sortOrder:          { type: ControlType.Number,  title: "Sorting Number" },
        isHomepage:         { type: ControlType.Boolean, title: "Is Homepage" },
      },
    },
  },
  defaultView: {
    type: ControlType.Enum, title: "Default View",
    options: ["list", "grid"], defaultValue: "list",
  },
  listTypographyVariant: {
    type: ControlType.Enum, title: "List Type",
    options: ["standard", "mono13"],
    optionTitles: ["Standard", "Mono 13"],
    defaultValue: "standard", displaySegmentedControl: true,
  },
  listHoverVariant: {
    type: ControlType.Enum, title: "List Hover",
    options: ["flip", "highlight"],
    optionTitles: ["Flip", "Highlight"],
    defaultValue: "flip", displaySegmentedControl: true,
  },
})
```

### 3.A Project data resolution — the registry pattern

The live component picks projects in this order (inside the `allProjects` `useMemo`):

1. **Window-singleton registry** at `window.__articaIndexProjectsRegistry`, when `useCMS` is `true` and at least one item has been registered. The registry is a `Map<string, Project>` plus a `Set` of listeners; `IndexPage` subscribes in a `useEffect` that runs only when `useCMS` is truthy.
2. **`projects` prop** (manual array control), if non-empty.
3. **`DEFAULT_PROJECTS`** — a 15-item snapshot baked into the code file.

The intended Framer-side wiring for the registry is:

- A separate code component named `ProjectRegistrar` is placed inside a Framer **Collection List** bound to `All Projects`.
- Each Registrar instance receives the bound CMS row's fields as Framer `ControlType` props and calls the registry's `register(id, data)` on mount, `unregister(id)` on unmount.
- `IndexPage` (with `useCMS=true`) subscribes to the registry and re-renders when it changes.

This solves the "code components can't access the CMS directly" issue described in `framer-cms-index-autoupdate-audit-2026-05-03.md` (Variant B). **As of this audit, no `ProjectRegistrar.tsx` code component exists in the project**, so the published `/index` is currently rendering the in-code `DEFAULT_PROJECTS` snapshot. To make `/index` truly CMS-driven, the Registrar component still needs to be created and a Collection List instance placed on the page.

If you build the Registrar, mirror the Framer property control names exactly (`title`, `category1..3`, `industry`, `year`, `thumbnail`, `thumbnailVideoLink`, `slug`, `sortOrder`, `isHomepage`) and use the project's `slug` as the registry key.

### CMS schema and current Industry values

The Framer CMS collection is `All Projects` (`yTHrQWMIY`). See `framer-current-state.md` §2 and §7 for the full field map. Fields directly used by `/index`:

- `Title` → `title`
- `Sorting Number` → `sortOrder`
- `Category 1`/`2`/`3` → `category1`/`2`/`3`
- `Year` (string field; `"2019-ongoing"` is one valid value) → `year`. The live component coerces year to a number via `normalizeYear` (regex `(?:19|20)\d{2}`), so `"2019-ongoing"` becomes `2019` for grouping and filtering.
- `Industry` → `industry`
- `Is Homepage` → `isHomepage`
- `Thumbnail` → `thumbnail`
- `Thumbnail Video Link` → `thumbnailVideoLink`
- `slug` is derived from the CMS slug; project click URLs are `/case-studies/{slug}`. Do not restore the old `/work/{slug}` route.

**Discipline labels:** the live code does **not** hardcode a canonical eight-label list and does **not** define a `DISCIPLINE_ALIASES` map. Discipline strings are taken verbatim from `category1..3` per project, de-duplicated, and listed in `sortOrder` order via `getDisciplineNavItems`. If you want to lock the navigation to the eight canonical labels (`Visual Identity`, `Brand Strategy`, `UX/UI`, `2D Motion`, `3D Motion`, `Packaging`, `Product`, `Editorial`), you must reintroduce that filter — it is not currently in the code.

**Industry labels:** `getIndustryNavItems` derives the nav from the bound projects' `industry` value, in `sortOrder` order. The live `DEFAULT_PROJECTS` snapshot uses simplified labels (`Technology`, `Publishing`, `Nature & Outdoors`, `Design Education`, `Health & Wellness`, `Human Rights`, `Science`, `Music`, `Literature`) which is what the published `/index` shows today. The CMS itself stores longer values (`Consumer Electronics / Technology`, `Citizen Science / Biodiversity`, etc.). When the Registrar pattern is wired, the visible labels switch to whatever the data source provides — decide whether you want to pass the long CMS strings through or pre-simplify them upstream.

**Year labels:** `getYearNavItems` returns `number[]`, sorted descending. The non-numeric CMS string `"2019-ongoing"` is normalized to `2019`. If you want a separate "2019–ongoing" display label, that has to be reintroduced explicitly.

---

## 4. View: List (Default)

The List view has an A/B typography control in Framer named `List Type`:

- `Standard`: hierarchy with 40px GT Standard Light year labels and 22px GT Standard Medium project titles.
- `Mono 13`: Searchsystem-inspired comparison mode where year, title, discipline, and industry all use 13px uppercase mono. This affects List view only.

### Layout structure

```
[Taxonomy: 6-col grid, 20px gap]
  Discipline label (col 1) | Discipline values (col 2)
  Industry label (col 3)   | Industry values (col 4)
  Year label (col 5)       | Year values (col 6)

[40px spacer]

[Year Group: 6-col grid wrapper]
  ── black rule (1px, idx-rule, animated draw) ── (cols 1/-1)
  Year label (col 1)  |  List content (cols 2 / span 5, 5-col inner grid)
    Inner row grid: title (1/span 2) | discipline (3/span 2) | industry (5/span 1)
    Standard mode row: 56px min-height, 9px vertical padding
    Mono 13 mode row:  38px min-height, 5px vertical padding
    ── subtle row divider (idx-row-divider, animated) ──
    next row ...

[48px top spacer, 80px bottom padding]
[Project count: "<n> Projects" in 13px mono]
```

### Taxonomy specs

- Font: GT Standard Mono Trial, 13px, uppercase, line-height 28px.
- Figma source: node `32:7531`.
- Layout is `repeat(6, minmax(0, 1fr))` with `var(--idx-grid-gap, 20px)` column gaps.
- Do not define taxonomy columns with fixed pixel widths.
- Active filter state: `text-decoration: underline; text-underline-offset: 3px`. Clear-filters button appears below the columns when any filter is active.

### Year group headers

- Standard mode: GT Standard Trial, weight 300, 40px, line-height 1.3, color `tokens.textPrimary`. On mobile (≤809px) it drops to 28px.
- `Mono 13` mode: 13px uppercase mono, line-height 28px, color `tokens.textPrimary`.
- Year labels render `year > 0 ? year : "—"`.
- Black rule above each year group: 1px, `tokens.dividerStrong`, animated `idxRuleDraw` 700ms cubic-bezier(0.16, 1, 0.3, 1), staggered by group index up to 8.

### Project rows

- Inner row grid: `repeat(5, minmax(0, 1fr))`, 20px column gap, `align-items: center`.
- Title cell: cols 1/span 2, hover-flip stack (see §9).
- Discipline cell: cols 3/span 2, 13px mono.
- Industry cell: col 5/span 1, 13px mono.
- Cells use `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` on desktop/tablet so they shrink rather than wrap. Industry is **never hidden** by responsive CSS; on mobile the row reflows instead.
- Row divider between projects in a year: `idx-row-divider` (1px, `tokens.dividerSubtle` inline). The page-level `IndexRuleColorOverride` then forces it to ink at runtime via `!important`.
- Rows are clickable: navigate to `/case-studies/{slug}` if `slug` exists.

### Project count footer

- GT Standard Mono Trial, 13px, uppercase, color `tokens.textPrimary`.
- Format: `<count> Project` or `<count> Projects` (singular/plural is handled). With the in-code 15-project default and no filters, the live page reads `15 Projects`.

### Taxonomy filter behavior

- Clicking a taxonomy item toggles it as an active filter.
- Multiple filters within a category use OR logic; filters across categories use AND logic.
- "Clear filters" button appears below the taxonomy when any filter is active.
- Search is plumbed (`filterProjects` accepts a `query` arg) but the only call site passes `""`.

### Responsive breakpoints (from the live `GLOBAL_CSS`)

- ≤1199px: container padding 0 20px (already the desktop value, preserved as `!important` for safety).
- ≤809px: `--idx-grid-gap: 12px`. Taxonomy collapses to `max-content / 1fr` two-column pairs (Discipline pair, Industry pair, Year pair stacked). List rows collapse to a 2-col layout: title spans the full row, discipline + industry side-by-side beneath. Year-group grid collapses to a single column. Toggle pins to bottom-center.
- ≤520px: taxonomy fully stacks to one column. List rows collapse further so discipline and industry each get their own row.

---

## 5. View: Grid

### Source of truth

Grid view renders project-driven cards from `filteredProjects` (the same array used by List view and the project count) as native HTML inline in `IndexPage.tsx`. There is no external module dependency. The previous import of `https://framer.com/m/Case-Study-G9lec1.js` was removed on May 10, 2026 — the responsive-image format being passed to the Framer Case Study module didn't hydrate when called from a code component, so thumbnails rendered blank. Rendering with `<img>` directly is simpler, faster, and gives full visual control.

The earlier doc claim that the unfiltered Grid uses a native `Case Studies Filter` is **stale**. That fallback path was removed before May 6, 2026.

### Card structure

Each card is rendered by `GridProjectCard` as:

```
<a class="idx-grid-card" href="/case-studies/{slug}">
  <div class="idx-grid-card-title">
    <HoverFlipText text={title} activeText="View Project" /> // 22px GT Standard, uppercase
  </div>
  <div class="idx-grid-card-media">                          // aspect-ratio: 16/9, overflow:hidden
    <img class="idx-grid-card-img" src={thumbnail} loading="lazy" />
    {hovered && videoSrc && <video class="idx-grid-card-video" src={...} muted loop autoPlay /> }
  </div>
</a>
```

- Title is **above** the thumbnail, matching List view typography. The hover-flip swaps to "View Project" on card hover (or focus-visible). `HoverFlipText` is the same helper used in List view.
- Thumbnail is a plain `<img>` with `object-fit: cover` filling a `position: relative` container locked to `aspect-ratio: 16 / 9`.
- Optional thumbnail video is mounted only on hover (so videos aren't preloaded for off-screen cards). When mounted, it autoplays muted with `loop` and `playsInline` and fades in over 200ms via the existing CSS hover rule on `.idx-grid-card-video`.
- The card itself is the link — no inner click handlers, no inner nav. If `slug` is empty, `href` is `undefined` and the flip-text falls back to the project title (no "View Project" copy).

### Layout grid

- Container `.idx-project-grid` is `display: grid` with `grid-template-columns: repeat(3, minmax(0, 1fr))`, `column-gap: var(--idx-grid-gap, 20px)`, `row-gap: 56px`.
- Tablet (≤1199px): 2 columns.
- Mobile (≤809px): 1 column, `row-gap: 40px`.
- All cards are uniform width — there is no longer a weighted/featured pattern. Card heights derive from the 16:9 aspect ratio plus the title row above it.

### Runtime behavior

- Empty filtered state matches List view copy: "No work matches those filters."
- View transitions: 150ms opacity fade out → swap → 250ms opacity fade in, keyed on a `renderKey` increment so React remounts cleanly.
- Cards fade up with `idxFadeUp`, capped to 12 cards via `Math.min(index, 12) * 30ms` stagger.
- The hover-flip and the video reveal both use `.idx-grid-card:hover` selectors, mirroring the List view pattern. On mobile (≤809px), the flip transform is overridden to `none` so the title remains stable.

### Filtering behavior

The taxonomy filters are source-of-truth state in `IndexPage.tsx` and drive List view, Grid view, and project count. Discipline filtering checks each project's `[category1, category2, category3]` (de-duplicated via `getDisciplines`). Industry filtering matches `industry` exactly. Year filtering matches the normalized numeric year.

---

## 6. Dormant Reference: 3D Inline WorldGrid Sphere

Not exposed on `/index`. The bottom toggle is List/Grid only. Earlier inline `InlineWorldGrid` / `ThreeDPreview` helpers are gone. `WorldGridTest.tsx` (`ibj8uxT`) remains as an unrouted code component reference. Do not bring it back to `/index` unless Micah explicitly asks.

---

## 7. Sticky Toggle

### Position and behavior

- `position: fixed`, `bottom: 20px`, `left: 20px`, `z-index: 100`.
- On mobile (≤809px), pinned to bottom-center via `left: 50%; transform: translateX(-50%)`.

### Visual specs

```css
.sticky-toggle {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  width: 148px;
  padding: 3px;
  border-radius: 4px;
  color: #26211f;
  background: rgba(215, 213, 207, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  z-index: 100;
}

.toggle-button {
  padding: 6px 10px;
  width: 100%;
  font-family: var(--font-mono);
  font-size: 14px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #26211f;
  text-align: center;
  cursor: pointer;
  border: none;
  background: none;
  border-radius: 4px;
  transition: all 200ms ease;
  line-height: 1;
}

.toggle-button.active {
  color: #26211f;
  background: #EAE8E3;
}
```

### Two equal-width buttons: LIST / GRID

The bottom toggle content must remain ink/black (`#26211f`), including inactive labels. Do not add `3D` back to the toggle unless Micah explicitly asks. Because Framer/global button styles can override native button text, `IndexPage.tsx` applies a defensive `.idx-toggle-fixed *, .idx-toggle-fixed button { color: #26211f !important; -webkit-text-fill-color: #26211f !important; }` rule. Preserve that unless the fixed toggle is rebuilt.

---

## 8. Responsive Behavior

| Breakpoint | Taxonomy | List rows | Grid view | Toggle |
|---|---|---|---|---|
| ≥1200px | 6-col grid, 20px gap | 5-col inner grid; ellipsis truncation | weighted 3-card rows, 120px row gap | bottom-left |
| 810–1199px | same 6-col grid (container padding pinned to 20px) | same 5-col grid; ellipsis truncation | same weighted 3-card rows | bottom-left |
| ≤809px | label/value pairs (`max-content / 1fr`), pairs stack vertically | 2-col grid: title row, then discipline + industry; year-group label/content stack | one-column stacked cards, 48px gaps | bottom-center |
| ≤520px | one column | 1-col grid: title, discipline, industry each on own row | one-column stacked cards | bottom-center |

Industry is never hidden. On desktop/tablet it truncates with ellipses if needed; on mobile it reflows.

---

## 9. Animation & Motion

Follow the motion hierarchy from the framework doc:

1. Does this motion serve comprehension or navigation? → Keep.
2. Does it signal the brand's considered quality? → Keep.
3. Is it there because it looks cool? → Delete.

### Transitions between views

- View switch: 150ms opacity fade out → state swap + render-key bump → 250ms opacity fade in. The toggle click should feel instant and considered.

### List view entrance

- Rows: `idxFadeUp` keyframe (`opacity: 0 → 1, translateY(8px) → 0`), 300ms, capped to the first 12 rows via `Math.min(ri, 12) * 30ms` stagger delay.
- Year rules and intra-year row dividers: `idxRuleDraw` keyframe (`scaleX(0) → scaleX(1)`), 700ms, `cubic-bezier(0.16, 1, 0.3, 1)`, staggered by year/row.
- Reduced motion: `.idx-row`, `.idx-grid-card`, `.idx-rule` have animation disabled under `prefers-reduced-motion: reduce`. The flip transform is also disabled under reduced motion.

### List row hover

- `listHoverVariant="flip"` is the default. The flip mirrors the native Framer `ViewProject` reference (`node=L21w7Xq1z`):
  - Title cell wraps a `idx-flip-track` containing two stacked copies separated by a 5px gap.
  - Track height matches `--idx-flip-height` (28px in Mono 13, 27px in Standard).
  - On row hover/focus, the track translates upward by `-(height + 5px)` over 620ms `cubic-bezier(0.16, 1, 0.3, 1)`.
  - The second copy reads `"View Project"` when a slug exists (otherwise mirrors the title).
  - On mobile, the flip is disabled (track gap removed, transform forced to none) so titles stay visible.
- `listHoverVariant="highlight"` is preserved for A/B comparison and applies a faint `rgba(20, 20, 20, 0.035)` row background on hover (no flip).
- Discipline and Industry text never participates in the flip — only the title.

### Grid view motion

- Cards fade up with `idxFadeUp`, capped to 12 cards via `Math.min(index, 12) * 30ms` stagger.
- View switches still fade the whole content area (the flip-related JS on rows is independent of view-level fades).

### Filter changes

- Changes to filters update `filteredProjects` via `useMemo`; List, Grid, and the project count all re-derive from that single source.

---

## 10. File Structure

Deliver as a single file (Framer code components must be single-file):

```
IndexPage.tsx
```

All styles inline (CSS-in-JS via style objects) or in a `<style>` tag within the component. Framer code components don't support external CSS files.

### Component skeleton (matches the live Framer file)

```tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

// Window-singleton registry that ProjectRegistrar instances write into.
const REGISTRY_KEY = "__articaIndexProjectsRegistry"
function getRegistry() { /* lazy-init { items, listeners, register, unregister, subscribe } */ }

const tokens = { /* see §2 */ }
const INDEX_GRID_GAP = "var(--idx-grid-gap, 20px)"
const INDEX_GRID_TEMPLATE = "repeat(6, minmax(0, 1fr))"

const DEFAULT_PROJECTS = [ /* 15-item snapshot, simplified industry labels */ ]

// Helpers: getDisciplines, normalizeProjectDisciplines, getDisciplineDisplay,
// collectByProjectOrder, getDisciplineNavItems, getIndustryNavItems,
// getYearNavItems, getCaseStudyUrl, normalizeYear, normalizeThumbnailUrl,
// groupByYear, filterProjects.

const GLOBAL_CSS = `/* keyframes + .idx-* selectors + responsive blocks */`

function TaxonomySection({ filters, disciplineNavItems, industryNavItems, yearNavItems, onFilterToggle, onClearFilters }) { /* ... */ }
function HoverFlipText({ text, activeText, style, height }) { /* ... */ }
function ListView({ projects, typographyVariant, hoverVariant }) { /* ... */ }
function GridProjectCard({ project, index }) { /* native <a><HoverFlipText/><img/>{hover && <video/>}</a> */ }
function GridView({ projects }) { /* uniform 3/2/1-column CSS grid */ }
function ViewToggle({ activeView, onViewChange }) { /* fixed bottom toggle */ }

export default function IndexPage({
  projects: projectsProp,
  useCMS = false,
  defaultView = "list",
  listTypographyVariant = "standard",
  listHoverVariant = "flip",
}) {
  const [registeredProjects, setRegisteredProjects] = useState(() => new Map())
  useEffect(() => {
    if (!useCMS) return
    const reg = getRegistry()
    return reg?.subscribe((items) => setRegisteredProjects(new Map(items)))
  }, [useCMS])

  const allProjects = useMemo(() => {
    const fromRegistry = useCMS && registeredProjects.size > 0
      ? Array.from(registeredProjects.values()) : null
    const source = fromRegistry ?? (projectsProp?.length ? projectsProp : DEFAULT_PROJECTS)
    return source.map(normalizeProjectDisciplines)
  }, [useCMS, registeredProjects, projectsProp])

  const [activeView, setActiveView]       = useState(defaultView === "grid" ? "grid" : "list")
  const [transitioning, setTransitioning] = useState(false)
  const [renderKey, setRenderKey]         = useState(0)
  const [filters, setFilters] = useState({ disciplines: [], industries: [], years: [] })
  const transitionTimer = useRef(null)

  const disciplineNavItems = useMemo(() => getDisciplineNavItems(allProjects), [allProjects])
  const industryNavItems   = useMemo(() => getIndustryNavItems(allProjects),   [allProjects])
  const yearNavItems       = useMemo(() => getYearNavItems(allProjects),       [allProjects])
  const filteredProjects   = useMemo(() => filterProjects(allProjects, filters, ""), [allProjects, filters])

  // handleViewChange: 150ms fade out -> setActiveView + bump renderKey -> render
  // handleFilterToggle / handleClearFilters

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="idx-container" style={{ /* 0 20px padding, fontFamily mono, minHeight 60vh */ }}>
        <TaxonomySection ... />
        <div key={renderKey} style={{ opacity: transitioning ? 0 : 1, transition: ... }}>
          {activeView === "grid"
            ? <GridView projects={filteredProjects} />
            : <ListView projects={filteredProjects} typographyVariant={listTypographyVariant} hoverVariant={listHoverVariant} />}
        </div>
        <div style={{ marginTop: 48, paddingBottom: 80, /* mono 13px */ }}>
          {filteredProjects.length} {filteredProjects.length === 1 ? "Project" : "Projects"}
        </div>
      </div>
      <div className="idx-toggle-fixed" style={{ position: "fixed", bottom: 20, left: 20, zIndex: 100 }}>
        <ViewToggle activeView={activeView} onViewChange={handleViewChange} />
      </div>
    </>
  )
}

addPropertyControls(IndexPage, { /* see §3 */ })
```

---

## 11. Key References

- **Live `/index` layout:** `framer-current-state.md` §3
- **Taxonomy/list Figma comp:** https://www.figma.com/design/XbHEqG3zBZJrcVkgmIEkZF/Micah-Hoang-Portfolio?node-id=32-7531 (node `32:7531`)
- **Grid card module:** `https://framer.com/m/Case-Study-G9lec1.js` (variant `L9DRr0UT2`)
- **Framer code file:** `IndexPage.tsx`, code file id `rgAZFOv`
- **Framer page:** `/index`, page node id `u2LOaBT5q` (single page; the earlier `yKKOMVNs6` Mono 13 duplicate is gone)
- **Page-level helper:** `IndexRuleColorOverride.tsx` (`tqQjSoH`), instance `p8V73bUeR` on `/index`, `ATihJFdYD` on `/case-studies`
- **WorldGrid reference:** `WorldGridTest.tsx`, code file id `ibj8uxT`; no current `/worldgrid-test` web page
- **CMS collection:** `All Projects`, collection id `yTHrQWMIY`
- **Taxonomy/filter inspiration:** https://searchsystem.co/index
- **Framework doc:** `portfolio-framework.md`
- **Copy doc:** `portfolio-copy-v2.md`
- **CMS auto-update audit:** `framer-cms-index-autoupdate-audit-2026-05-03.md`

---

## 12. Testing Checklist

Before delivering:

- [ ] Single `/index` page in the project (`u2LOaBT5q`). No second `/index` page reintroduced.
- [ ] List view renders with year grouping in both `Standard` and `Mono 13` typography modes.
- [ ] Taxonomy filters work: click to toggle, AND across categories, OR within. Clear-filters button appears when any filter is active.
- [ ] Second taxonomy column is labeled `Industry`, not `Origin`.
- [ ] Discipline / Industry / Year nav values come from the bound projects via `getDisciplineNavItems` / `getIndustryNavItems` / `getYearNavItems`, not from a hardcoded list.
- [ ] If CMS-backed live data is needed, `useCMS=true` is set AND a `ProjectRegistrar` Collection List is wired on the page. Otherwise the page falls back to `DEFAULT_PROJECTS`.
- [ ] Three taxonomy groups stay horizontal at desktop and tablet; collapse to label/value pairs at ≤809px and a single column at ≤520px.
- [ ] Taxonomy and List year-group share `repeat(6, minmax(0, 1fr))` within `padding: 0 20px`.
- [ ] List inner rows use `repeat(5, minmax(0, 1fr))`: title cols 1/span 2, discipline cols 3/span 2, industry col 5/span 1.
- [ ] Industry is never hidden by responsive CSS; Discipline/Industry truncate with ellipses on desktop/tablet, reflow on mobile.
- [ ] Grid view renders cards as native HTML inside `IndexPage.tsx` (no `Case Study` module import, no `Case Studies Filter` fallback).
- [ ] Grid uses a uniform CSS grid: 3 columns at ≥1200px, 2 columns at 810–1199px, 1 column at ≤809px. No weighted/featured pattern.
- [ ] Each card thumbnail is locked to `aspect-ratio: 16 / 9` via `.idx-grid-card-media`. Card heights are not hardcoded.
- [ ] Card title sits above the thumbnail and uses the same `HoverFlipText` helper as List view ("View Project" on hover when slug exists).
- [ ] Optional thumbnail video mounts only on `:hover` and fades in (200ms). Off-hover the card unmounts the `<video>` so it isn't preloaded for off-screen cards.
- [ ] Per-project strokes come from CMS field `OHdUYs6Mo` via `CaseStudyThumbnailStrokeStyles.tsx`, not from hardcoded fallback classes. On `/index`, `.idx-grid-card-media.with-stroke` is allowed only because the helper toggles it from CMS.
- [ ] Grid extends to the same 20px left/right margin as the nav/taxonomy section.
- [ ] View toggle is fixed bottom-left at ≥810px and bottom-center on mobile.
- [ ] View toggle has only List/Grid, equal-width buttons, and ink text for active and inactive labels.
- [ ] View transitions are smooth (150ms fade out → 250ms fade in, with `renderKey` remount).
- [ ] Project count updates with filters and uses singular/plural correctly.
- [ ] Year `2019-ongoing` from CMS is normalized to `2019` for grouping/filtering.
- [ ] All text is uppercase where specified; mono cells use 13px / 28px / 0 letter-spacing.
- [ ] Token object is centralized; no scattered color/font magic values.
- [ ] Component exports with the property controls listed in §3.
- [ ] Single-file output, no external dependencies beyond React + Framer runtime APIs.
- [ ] `IndexRuleColorOverride` instance still placed on the page if you want unified ink rules.

---

## 13. What NOT to Do

- Do NOT use Tailwind — Framer code components don't support it.
- Do NOT use external CSS files — everything inline or in `<style>` tags.
- Do NOT use localStorage or sessionStorage — not supported in Framer.
- Do NOT import heavy libraries (no framer-motion — use CSS transitions and vanilla JS for animations).
- Do NOT scatter hardcoded colors — always go through the centralized `tokens` object.
- Do NOT reintroduce the `Case Studies Filter` fallback inside `IndexPage`. The native `Case Studies Filter` belongs to `/case-studies`.
- Do NOT reimport `https://framer.com/m/Case-Study-G9lec1.js` for Grid view rendering. The thumbnails rendered blank when called from a code component (responsive-image format mismatch). Render with native `<img>`/`<video>` instead, as `GridProjectCard` does today.
- Do NOT reintroduce weighted/featured Grid row patterns (`[2,1,1] [1,2,1] [1,1,2] [1,2,1]`) or the `weight` prop on `GridProjectCard`. The Grid is uniform — 3/2/1 columns by breakpoint.
- Do NOT hardcode pixel heights for Grid cards (e.g., 325px / 220px). Card height derives from the 16:9 aspect ratio of the media wrapper plus the title row above it.
- Do NOT re-enable the `ImageMaskReveal` instance on `/index` (`qf2vKr_sV`). It is intentionally `enabled="false"` so the archive loads without a curtain reveal. The site-wide instances on Home, `/case-studies`, `/case-studies/:slug`, `/info`, and `/contact` stay on.
- Do NOT hardcode `.idx-grid-card-media.with-stroke` as a permanent class in `IndexPage.tsx`. The May 15 stroke helper owns that class from CMS so each project can be toggled individually and toggled back off.
- Do NOT remove `CaseStudyThumbnailStrokeStyles` instance `szF9sZNWA` from `/index` unless you replace the stroke system with another CMS-aware implementation.
- Do NOT reintroduce `DISCIPLINE_NAV_ITEMS` / `DISCIPLINE_ALIASES` / `INDUSTRY_NAV_ITEMS` as hardcoded constants inside `IndexPage` unless you explicitly want to lock the nav back to a fixed list. The current pattern is to derive the nav from the bound projects.
- Do NOT push the older repo-side `IndexPage.tsx` back to Framer without merging in the live `useCMS` registry pattern, the simplified `DEFAULT_PROJECTS`, and the dynamic taxonomy.
- Do NOT restore the old "Enter WorldGrid" button or `worldGridUrl` prop unless Micah explicitly asks.
- Do NOT leave fallback data at 12 projects; the live `DEFAULT_PROJECTS` snapshot has 15 items.
- Do NOT use Next.js patterns (no `useRouter`, no `Link` component) — Framer handles routing.
- Do NOT add `<html>`, `<head>`, or `<body>` tags — this is a component, not a page.
- Do NOT assume fonts are loaded — use the fallback stack in the tokens object.
- Do NOT rename the `Industry` field or taxonomy label to `Origin`.
- Do NOT reintroduce taxonomy responsive CSS that stacks the three groups vertically at desktop or tablet.
- Do NOT use `/work/{slug}` routes inside this component; current case study routes are `/case-studies/{slug}`.
