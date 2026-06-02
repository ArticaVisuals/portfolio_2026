# Index Page Code Component — Build Instructions for Claude Code

**Project:** Micah Hoang Portfolio Redesign
**Component:** `/index` page — List/Grid toggle with taxonomy filters
**Target:** Framer code component (React) injected into Jacob Turner template
**Date:** May 2026
**Last Framer structure audit:** June 2, 2026.

> **Read first:** the live behavior of `/index` is fully described in `framer-current-state.md` §3. This file is the build/maintenance brief for the code component. When the two disagree, `framer-current-state.md` wins.

**State summary (June 2, 2026):**

- One `/index` page, `u2LOaBT5q`. The earlier duplicate `yKKOMVNs6` (Mono 13 default) has been deleted.
- The original-template inline `GRID / LIST` control is now owned directly by `IndexPage.tsx` on canonical `/index`; the previous fixed/floating delegated toggle has been removed.
- The side-by-side page `/index-inline-toggle-test` (`VdRy9MV8k`) was removed after the inline version was promoted to canonical `/index`.
- Live Framer code file `rgAZFOv` powers `/index`. The published page binds `useCMS=true`, `defaultView="list"`, `listTypographyVariant="standard"`, `listHoverVariant="flip"`.
- The repo `IndexPage.tsx` mirror was reconciled against the current live direction on May 22, 2026 after the route audit.
- Current mounted `/index` code files are `IndexPage.tsx` (`rgAZFOv`), `CaseStudyThumbnailStrokeStyles.tsx` (`Z28JYvA`), and `IndexPageBreakpointsDraft.tsx` (`VwMoFWv`). `IndexListCursorPreview.tsx` and `IndexFilterNavDraftPage.tsx` were removed from Framer on May 26 because they were not mounted in current `/index` XML.
- All index list/grid rules currently render in near-black `#141414` via `IndexPage.tsx` color property controls. Do not assume older `#233324` notes are current for `/index`.
- **Taxonomy refined (May 22, 2026):** the visible order is `/ Year`, `/ Service`, `/ Industry`; each group has an `All` button that clears only that filter category. Service and Industry labels are sorted alphabetically; Year remains descending.
- **Data source refined (June 1, 2026):** `IndexPage.tsx` uses the mounted `ProjectRegistrar` registry first, then falls back to a direct import/scan of the generated Framer CMS module for `All Projects` (`yTHrQWMIY`), then manual `projects`. In CMS mode it does **not** fall back to `DEFAULT_PROJECTS`.
- **Grid view rewritten (May 10, 2026; refined May 22):** the `https://framer.com/m/Case-Study-G9lec1.js` import was removed. Grid cards now render as native HTML inside `IndexPage.tsx` (uniform 16:9 media, 3/2/1 column responsive grid, media hover scale, title below image with the same hover-flip used in List view, and metadata below title). The thumbnails were rendering blank because the responsive-image format being passed to the Framer Case Study module didn't hydrate for code-component usage; rendering directly from `<img>` fixed this.
- **ImageMaskReveal is archived:** old notes about disabled/enabled `ImageMaskReveal` instances are historical. The reveal component is stub-archived and not part of the current `/index` behavior.
- **Thumbnail stroke helper added (May 15, 2026; cleaned up May 16; canvas update May 19; CMS export fix June 1; instance prop cleanup June 2):** `CaseStudyThumbnailStrokeStyles.tsx` (`Z28JYvA`) controls per-project thumbnail strokes from the CMS Boolean `Thumbnail Stroke` (`OHdUYs6Mo`). The `/index` helper instance is `szF9sZNWA`; Home and `/case-studies` also have instances. The helper toggles a real Light Gray overlay frame in the Framer `Case Study` media wrapper when available, and falls back to a generated DOM overlay for custom HTML cards such as `/index`. It must resolve both legacy `module.a` and current `module.r` Framer CMS export shapes before scanning records. As of June 2, the helper instances use Framer item slugs directly (`slugFieldId=""`). The old `Case Study` stroke variants and the old `/index` hardcoded `with-stroke` class path have been removed.
- **Inline toggle promoted and integrated (May 16, 2026; style-aligned May 19):** `IndexPage.tsx` renders uppercase `GRID / LIST` after the taxonomy nav. `CLEAR FILTERS` remains the original left-aligned button inside `TaxonomySection`; the hidden `IndexPageBreakpointsDraft.tsx` helper only styles the toggle to match that action (13px uppercase mono, 28px line-height, weight 400, secondary text color, hover opacity, active underline). The action row uses a stable 12px top gap, 28px line, and 24px bottom gap so selecting/deselecting filters does not shift content. The former `IndexInlineToggleProxy.tsx` code file (`TexpcmJ`) and `/index` instance (`HM1pZPonP`) were deleted after this behavior moved into `IndexPage`.

---

## 1. What You're Building

A single React code component for Framer that renders the content area of the `/index` archive page. It currently exposes:

- Three taxonomy columns (Year, Service, Industry) acting as multi-select filters.
- Two view modes (List, Grid) toggled from an inline `GRID / LIST` control after the taxonomy nav.
- Two A/B variants for List view (`Standard` vs `Mono 13` typography; `Flip` vs `Highlight` hover).
- A trailing project-count footer.

Project data flows in through three priority-ranked sources (described in §3). The component **does not** include the site nav, the `INDEX` heading at 110px (that's a sibling Framer text element), or any 3D/WorldGrid surface.

**Important caveat:** the previous behavior where the unfiltered Grid view fell back to the native `Case Studies Filter` component has been removed. Grid view now renders project-driven cards as native HTML inline in `IndexPage.tsx` (no external Framer module). The native `Case Studies Filter` lives only on `/case-studies` now.

The outer `idx-container` owns the side margin (`padding: 0 20px`) and that should match the nav section. `IndexPage.tsx` owns the List/Grid view state and renders the inline `GRID / LIST` control directly.

**Home note, May 2026:** the Home selected-work grid is not owned by `IndexPage.tsx`. It is a six-item CMS-backed selected-work query using the native Framer `Case Study` component. Do not recode Home unless Micah explicitly asks.

**CMS note, June 2026:** the Framer `All Projects` CMS collection has 16 real projects. All Jacob Turner sample/template projects were permanently deleted. Do not re-add sample fallback data such as Vern Carter, Iris Wade, Orion Ventures, Echoes, Iconic, Adapting Literature, Genre Evolution, Digital Disruption, Connections, Capturing the Essence, Beyond the Frame, or Harmony in Motion.

---

## 2. Design Token Strategy — CRITICAL

The live component uses one centralized `tokens` object with hardcoded values copied from the Framer/Figma visual system. Keep values centralized there. Do not scatter colors, fonts, or spacing magic numbers throughout new code.

### Token object (live in Framer)

```ts
const DEFAULT_TOKENS = {
  textPrimary: "#26211f",
  textSecondary: "#141414",
  textTertiary: "#979797",
  bg: "#F7F5F0",
  dividerStrong: "#141414",
  dividerSubtle: "#141414",
  surfaceOverlay: "rgba(215, 213, 207, 0.72)",
  surfaceActive: "#EAE8E3",
  fontDisplay: "'GT Standard Trial', 'Inter', sans-serif",
  fontHeading: "'GT Standard Trial', 'Inter', sans-serif",
  fontProjectCta: "'GT Standard', 'GT Standard L Regular', 'GT Standard Trial', 'Inter', sans-serif",
  fontMono:    "'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace",
}
```

Note: current `/index` rules and dividers should stay at full-opacity `#141414` unless a deliberate design-system color change is made through the exposed Framer color controls. `IndexPage.tsx` normalizes `.idx-rule` / `.idx-row-divider` opacity itself; the legacy `IndexRuleColorOverride` is not a live dependency.

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
        category1:          { type: ControlType.String,  title: "Service 1" },
        category2:          { type: ControlType.String,  title: "Service 2" },
        category3:          { type: ControlType.String,  title: "Service 3" },
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

The live component also exposes color controls for `Text Primary`, `Text Secondary`, `Text Tertiary`, `Background`, `Divider Strong`, `Divider Subtle`, and `Surface Active`. Defaults should match `DEFAULT_TOKENS` unless Framer design tokens are intentionally rebound in the property panel.

### 3.A Project data resolution — registrar first, CMS module fallback

The live component picks projects in this order (inside the `allProjects` `useMemo`):

1. **Window-singleton registry** at `window.__articaIndexProjectsRegistry`, when `useCMS` is `true` and at least one item has been registered. The registry is populated by `ProjectRegistrar` instances inside the mounted CMS Collection List; `IndexPage` subscribes in a `useEffect` that runs only when `useCMS` is truthy.
2. **Direct CMS module scan**, when `useCMS` is `true` and the generated `All Projects` module (`yTHrQWMIY`) can be discovered/imported from document resources or live scan paths. The loader calls Framer's lazy initializer when present and reads `collectionByLocaleId.default.scanItems()`. Current Framer CMS bundles may expose the collection under `r` rather than legacy `a`; do not reintroduce an `a`-only resolver.
3. **`projects` prop** (manual array control), if non-empty.
4. **`DEFAULT_PROJECTS`**, only when `useCMS=false`.

The legacy Framer-side wiring for the registry is:

- A separate code component named `ProjectRegistrar` is placed inside a Framer **Collection List** bound to `All Projects`.
- Each Registrar instance receives the bound CMS row's fields as Framer `ControlType` props and calls the registry's `register(id, data)` on mount, `unregister(id)` on unmount.
- `IndexPage` (with `useCMS=true`) subscribes to the registry and re-renders when it changes.

June 1 canvas note: the CMS Collection List must stay mounted. On `/index`, `CmsLink` (`AwTGGhR7I`) is locked, `opacity="0"`, fixed off-canvas at `left="-202px"`, `width="1px"`, `height="1px"`, and `overflow="hidden"`. Do not use the Framer hidden/eye toggle on this layer or any parent, because hidden layers unmount and the registry becomes empty.

If you build the Registrar, mirror the Framer property control names exactly (`title`, `category1..3`, `industry`, `year`, `thumbnail`, `thumbnailVideoLink`, `slug`, `sortOrder`, `isHomepage`) and use the project's `slug` as the registry key.

### CMS schema and current Industry values

The Framer CMS collection is `All Projects` (`yTHrQWMIY`). See `framer-current-state.md` §2 and §7 for the full field map. Fields directly used by `/index`:

- `Title` → `title`
- `Sorting Number` → `sortOrder`
- `Category 1`/`2`/`3` in CMS → `category1`/`2`/`3` in code; Framer property controls now label these `Service 1`/`2`/`3`
- `Year` (string field; `"2019-ongoing"` is one valid value) → `year`. The live component coerces year to a number via `normalizeYear` (regex `(?:19|20)\d{2}`), so `"2019-ongoing"` becomes `2019` for grouping and filtering.
- `Industry` → `industry`
- `Is Homepage` → `isHomepage`
- `Thumbnail` → `thumbnail`
- `Thumbnail Video Link` → `thumbnailVideoLink`
- `slug` is derived from the CMS slug; project click URLs are `/case-studies/{slug}`. Do not restore the old `/work/{slug}` route.

**Service labels:** the live code does **not** hardcode a canonical eight-label list and does **not** define a `DISCIPLINE_ALIASES` map. Service strings are taken verbatim from `category1..3` per project, de-duplicated, and sorted alphabetically via `getDisciplineNavItems`. If you want to lock the navigation to the eight canonical labels (`Visual Identity`, `Brand Strategy`, `UX/UI`, `2D Motion`, `3D Motion`, `Packaging`, `Product`, `Editorial`), you must reintroduce that filter — it is not currently in the code.

**Industry labels:** `getIndustryNavItems` derives the nav from the bound projects' `industry` value, then sorts alphabetically. The May 22 published `/index` visibly renders simplified labels (`Education`, `Health`, `Human Rights`, `Literature`, `Music`, `Nature`, `Science`, `Technology`). The older CMS docs list longer values (`Consumer Electronics / Technology`, `Citizen Science / Biodiversity`, etc.), so verify the intended upstream value before changing CMS fields or code. Do not assume the long labels are live just because `useCMS=true`.

**Year labels:** `getYearNavItems` returns `number[]`, sorted descending. The non-numeric CMS string `"2019-ongoing"` is normalized to `2019`. If you want a separate "2019–ongoing" display label, that has to be reintroduced explicitly.

---

## 4. View: List (Default)

The List view has an A/B typography control in Framer named `List Type`:

- `Standard`: hierarchy with 40px GT Standard Light year labels and 22px GT Standard Medium project titles.
- `Mono 13`: Searchsystem-inspired comparison mode where year, title, service, and industry all use 13px uppercase mono. This affects List view only.

### Layout structure

```
[Taxonomy: 6-col grid, 20px gap]
  Year label (col 1)     | Year values (col 2)
  Service label (col 3)  | Service values (col 4)
  Industry label (col 5) | Industry values (col 6)

[40px spacer]

[Year Group: 6-col grid wrapper]
  ── light-gray rule (1px, idx-rule, animated draw) ── (cols 1/-1)
  Year label (col 1)  |  List content (cols 2 / span 5, 5-col inner grid)
    Inner row grid: title (1/span 2) | service (3/span 2) | industry (5/span 1)
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
- Active filter state: `text-decoration: underline; text-underline-offset: 3px`. Each group includes an `All` button that clears that group only. The global Clear Filters button appears below the columns when any real filter value is active.

### Year group headers

- Standard mode: GT Standard Trial, weight 300, 40px, line-height 1.3, color `tokens.textPrimary`. On mobile (≤809px) it drops to 28px.
- `Mono 13` mode: 13px uppercase mono, line-height 28px, color `tokens.textPrimary`.
- Year labels render `year > 0 ? year : "—"`.
- Full-opacity rule above each year group: 1px, `tokens.dividerStrong`, animated `idxRuleDraw` 700ms cubic-bezier(0.16, 1, 0.3, 1), staggered by group index up to 8.

### Project rows

- Inner row grid: `repeat(5, minmax(0, 1fr))`, 20px column gap, `align-items: center`.
- Title cell: cols 1/span 2, hover-flip stack (see §9).
- Service cell: cols 3/span 2, 13px mono.
- Industry cell: col 5/span 1, 13px mono.
- Cells use `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` on desktop/tablet so they shrink rather than wrap. Industry is **never hidden** by responsive CSS; on mobile the row reflows instead.
- Row divider between projects in a year: `idx-row-divider` (1px, full-opacity `#141414` via `tokens.dividerSubtle` and runtime normalization).
- Rows are clickable: navigate to `/case-studies/{slug}` if `slug` exists.

### Project count footer

- GT Standard Mono Trial, 13px, uppercase, color `tokens.textPrimary`.
- Format: `<count> Project` or `<count> Projects` (singular/plural is handled). With the current 16-record CMS and no filters, the live CMS-backed page should read `16 Projects` after the Framer draft is published.

### Taxonomy filter behavior

- Clicking a taxonomy item toggles it as an active filter.
- Multiple filters within a category use OR logic; filters across categories use AND logic.
- "Clear filters" button appears below the taxonomy when any filter is active.
- Search is plumbed (`filterProjects` accepts a `query` arg) but the only call site passes `""`.

### Responsive breakpoints (from the live generated CSS)

- ≤1199px: container padding 0 20px (already the desktop value, preserved as `!important` for safety).
- ≤899px: taxonomy switches to SearchSystem-style label/value rows in the order Year, Service, Industry.
- ≤809px: taxonomy uses `minmax(96px, 28%) minmax(0, 1fr)` with 18px column gap. List rows collapse to a title + Industry layout; Service metadata is hidden at tighter widths.
- ≤520px: taxonomy keeps the label/value row format with tighter `minmax(84px, 32%) minmax(0, 1fr)` columns, 16px column gap, and 26px row gap.

### Current responsive breakpoint behavior

The May 18 responsive direction is now the official published `/index`. In Framer, canonical `/index` includes a hidden `IndexPageBreakpointsDraft.tsx` style instance after the `IndexPage` instance; in the repo, the same responsive CSS is folded into `IndexPage.tsx` so the behavior is not lost if the code component is resynced.

- Keep the desktop taxonomy/index nav through wider tablet widths. It does not switch the taxonomy to the compact format until ≤899px, when the content columns start to feel tight.
- ≤899px taxonomy/index nav uses a SearchSystem-style two-column structure: labels on the left, values on the right, with Year / Service / Industry stacked vertically and a 28px category row gap.
- ≤809px refines the taxonomy columns to `minmax(96px, 28%) minmax(0, 1fr)` with 18px column gap and the same 28px row gap.
- ≤520px uses `minmax(84px, 32%) minmax(0, 1fr)`, 16px column gap, 26px row gap, and tighter 14px horizontal page padding.
- Responsive list rows follow the Phantom list-view reference structurally: Service/category metadata disappears first; Industry remains visible, right-aligned, and allowed to wrap rather than truncate. Standard year/title typography stays at the desktop 22px scale on tablet.

---

## 5. View: Grid

### Source of truth

Grid view renders project-driven cards from `filteredProjects` (the same array used by List view and the project count) as native HTML inline in `IndexPage.tsx`. There is no external module dependency. The previous import of `https://framer.com/m/Case-Study-G9lec1.js` was removed on May 10, 2026 — the responsive-image format being passed to the Framer Case Study module didn't hydrate when called from a code component, so thumbnails rendered blank. Rendering with `<img>` directly is simpler, faster, and gives full visual control.

The earlier doc claim that the unfiltered Grid uses a native `Case Studies Filter` is **stale**. That fallback path was removed before May 6, 2026.

### Card structure

Each card is rendered by `GridProjectCard` as:

```
<a class="idx-grid-card" href="/case-studies/{slug}">
  <div class="idx-grid-card-media">                          // aspect-ratio: 16/9, overflow:hidden
    <img class="idx-grid-card-img" src={thumbnail} loading="lazy" />
    {videoSrc && <video class="idx-grid-card-video" src={...} muted loop autoPlay />}
  </div>
  <div class="idx-grid-card-title">
    <HoverFlipText text={title} activeText="View Project →" /> // 22px GT Standard, uppercase
  </div>
  <div class="idx-grid-card-meta">SERVICE...<br/>INDUSTRY / YEAR</div>
</a>
```

- Title is **below** the thumbnail, matching the May 22 live route audit. The hover-flip swaps to `View Project →` on card hover (or focus-visible). `HoverFlipText` is the same helper used in List view.
- Thumbnail is a plain `<img>` with `object-fit: cover` filling a `position: relative` container locked to `aspect-ratio: 16 / 9`.
- Optional thumbnail video renders in the media slot when a video URL is present. It autoplays muted with `loop` and `playsInline`. Media scales to `1.02` on hover/focus and disables that motion under `prefers-reduced-motion: reduce`.
- The card itself is the link — no inner click handlers, no inner nav. If `slug` is empty, `href` is `undefined` and the flip-text falls back to the project title (no "View Project" copy).

### Layout grid

- Container `.idx-project-grid` is `display: grid` with `grid-template-columns: repeat(3, minmax(0, 1fr))`, `column-gap: var(--idx-grid-gap, 20px)`, `row-gap: 56px`.
- Tablet (≤1199px): 2 columns.
- Mobile (≤809px): 1 column, `row-gap: 40px`.
- All cards are uniform width — there is no longer a weighted/featured pattern. Card heights derive from the 16:9 media aspect ratio plus the title and metadata below it.

### Runtime behavior

- Empty filtered state matches List view copy: "No work matches those filters."
- View transitions: 150ms opacity fade out → swap → 250ms opacity fade in, keyed on a `renderKey` increment so React remounts cleanly.
- Cards fade up with `idxFadeUp`, capped to 12 cards via `Math.min(index, 12) * 30ms` stagger.
- The hover-flip and the video reveal both use `.idx-grid-card:hover` selectors, mirroring the List view pattern. On mobile (≤809px), the flip transform is overridden to `none` so the title remains stable.

### Filtering behavior

The taxonomy filters are source-of-truth state in `IndexPage.tsx` and drive List view, Grid view, and project count. Service filtering checks each project's `[category1, category2, category3]` (de-duplicated via `getDisciplines`). Industry filtering matches `industry` exactly. Year filtering matches the normalized numeric year.

---

## 6. Dormant Reference: 3D Inline WorldGrid Sphere

Not exposed on `/index`. The visible inline toggle is Grid/List only. Earlier inline `InlineWorldGrid` / `ThreeDPreview` helpers are gone. `WorldGridTest.tsx` is no longer present in the current Framer code-component inventory. Do not bring a 3D/gallery mode back to `/index` unless Micah explicitly asks.

---

## 7. Inline View Toggle

### Position and behavior

The fixed/floating toggle path has been removed. `IndexPage.tsx` renders the visible inline `GRID / LIST` control after the taxonomy nav. `CLEAR FILTERS` remains the original left-aligned `TaxonomySection` action; `IndexPageBreakpointsDraft.tsx` applies the style-only alignment override when filters are active.

### Visual specs

```css
.idx-view-toggle {
  justify-content: flex-end;
  align-items: baseline;
  font-family: 'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace;
  font-size: 13px;
  font-weight: 400;
  line-height: 28px;
  text-transform: uppercase;
  color: #141414;
  margin-top: 12px;
  margin-bottom: 24px;
}

.idx-taxonomy-shell + .idx-tax-item {
  display: block;
  margin-top: 12px;
  line-height: 28px;
}

.idx-container:has(.idx-tax-value[aria-pressed="true"]) .idx-view-toggle {
  margin-top: -28px;
}
```

### Inline buttons: GRID / LIST

The visible toggle is rendered by `IndexPage.tsx` as uppercase `GRID / LIST` after the taxonomy nav. It uses the same action style as `CLEAR FILTERS`: 13px uppercase mono, 28px line-height, weight 400, current color `#141414`, and a 1px underline on the active view. The clear/toggle action row must keep equal total height whether filters are active or inactive. Per-group `All` buttons are not real active filters and should not trigger the negative toggle offset. Do not move `CLEAR FILTERS` out of `TaxonomySection`, and do not add `3D` back to the toggle unless Micah explicitly asks.

---

## 8. Responsive Behavior

| Breakpoint | Taxonomy | List rows | Grid view | Toggle |
|---|---|---|---|---|
| ≥1200px | 6-col grid, 20px gap; Year / Service / Industry | 5-col inner grid; ellipsis truncation | uniform 3-column grid, 56px row gap | taxonomy footer right |
| 900–1199px | same 6-col grid (container padding pinned to 20px) | title + Industry; Service hidden | uniform 2-column grid | taxonomy footer right |
| ≤899px | label/value pairs, groups stack vertically | title + Industry; year-group label/content stack | one-column stacked cards, 48px gaps | taxonomy footer right |
| ≤520px | tighter label/value pairs | title + Industry on narrow row | one-column stacked cards | taxonomy footer right |

May 18/22 promotion note: the published breakpoint behavior delays taxonomy collapse until ≤899px and keeps the responsive list closer to Phantom's list view, with Service hidden and Industry wrapping instead of truncating.

Industry is never hidden. On desktop/tablet it truncates or wraps per breakpoint if needed; on mobile it reflows. Service metadata is the first thing hidden on tighter list rows.

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
- Service and Industry text never participates in the flip — only the title.

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

const DEFAULT_PROJECTS = [ /* local fallback snapshot, simplified industry labels */ ]

// Helpers: getDisciplines, normalizeProjectDisciplines, getDisciplineDisplay,
// collectByProjectOrder, getDisciplineNavItems, getIndustryNavItems,
// getYearNavItems, getCaseStudyUrl, normalizeYear, normalizeThumbnailUrl,
// groupByYear, filterProjects.

function buildGlobalCss() { return `/* keyframes + .idx-* selectors + responsive blocks */` }

function TaxonomySection({ filters, disciplineNavItems, industryNavItems, yearNavItems, onFilterToggle, onFilterClear, onClearFilters }) { /* ... */ }
function HoverFlipText({ text, activeText, style, height }) { /* ... */ }
function ListView({ projects, typographyVariant, hoverVariant }) { /* ... */ }
function GridProjectCard({ project, index }) { /* native <a><HoverFlipText/><img/>{hover && <video/>}</a> */ }
function GridView({ projects }) { /* uniform 3/2/1-column CSS grid */ }
function ViewToggle({ activeView, onViewChange }) { /* inline taxonomy-footer toggle */ }

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
    const source = useCMS
      ? (fromRegistry ?? fromCMSModule ?? (projectsProp?.length ? projectsProp : []))
      : (projectsProp?.length ? projectsProp : DEFAULT_PROJECTS)
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
      <style>{buildGlobalCss()}</style>
      <div className="idx-container" style={{ /* 0 20px padding, fontFamily mono, minHeight 60vh */ }}>
        <div style={{ marginBottom: 18 }}>
          <TaxonomySection ... />
        </div>
        <ViewToggle activeView={activeView} onViewChange={handleViewChange} />
        <div key={renderKey} style={{ opacity: transitioning ? 0 : 1, transition: ... }}>
          {activeView === "grid"
            ? <GridView projects={filteredProjects} />
            : <ListView projects={filteredProjects} typographyVariant={listTypographyVariant} hoverVariant={listHoverVariant} />}
        </div>
        <div style={{ marginTop: 16, paddingBottom: 160, /* mono 13px */ }}>
          {filteredProjects.length} {filteredProjects.length === 1 ? "Project" : "Projects"}
        </div>
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
- **Grid card rendering:** native `GridProjectCard` markup inside `IndexPage.tsx`; do not reimport the old `Case Study` module for `/index` Grid view.
- **Framer code file:** `IndexPage.tsx`, code file id `rgAZFOv`
- **Framer page:** `/index`, page node id `u2LOaBT5q` (single page; the earlier `yKKOMVNs6` Mono 13 duplicate is gone)
- **Inline toggle/rule owner:** `IndexPage.tsx` (`rgAZFOv`)
- **Stroke helper:** `CaseStudyThumbnailStrokeStyles.tsx`, code file id `Z28JYvA`
- **Responsive/style helper:** `IndexPageBreakpointsDraft.tsx`, code file id `VwMoFWv`
- **Removed May 26 cleanup:** `IndexListCursorPreview.tsx`, `IndexFilterNavDraftPage.tsx`, `IndexRuleColorOverride.tsx`, and `WorldGridTest.tsx` are not current `/index` dependencies.
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
- [ ] Taxonomy groups are labeled `/ Year`, `/ Service`, `/ Industry`; no `Origin` label returns.
- [ ] Year / Service / Industry nav values come from the bound projects via `getDisciplineNavItems` / `getIndustryNavItems` / `getYearNavItems`, not from a hardcoded list.
- [ ] If CMS-backed live data is needed, `useCMS=true` is set and the generated `yTHrQWMIY` CMS module loads; `ProjectRegistrar`/window registry is only a fallback.
- [ ] Three taxonomy groups stay horizontal at desktop and tablet; collapse to label/value pairs at ≤809px and a single column at ≤520px.
- [ ] Taxonomy and List year-group share `repeat(6, minmax(0, 1fr))` within `padding: 0 20px`.
- [ ] List inner rows use `repeat(5, minmax(0, 1fr))`: title cols 1/span 2, service cols 3/span 2, industry col 5/span 1.
- [ ] Industry is never hidden by responsive CSS; Service can hide at tighter breakpoints while Industry stays visible.
- [ ] Grid view renders cards as native HTML inside `IndexPage.tsx` (no `Case Study` module import, no `Case Studies Filter` fallback).
- [ ] Grid uses a uniform CSS grid: 3 columns at ≥1200px, 2 columns at 810–1199px, 1 column at ≤809px. No weighted/featured pattern.
- [ ] Each card thumbnail is locked to `aspect-ratio: 16 / 9` via `.idx-grid-card-media`. Card heights are not hardcoded.
- [ ] Card title sits below the thumbnail and uses the same `HoverFlipText` helper as List view (`View Project →` on hover when slug exists).
- [ ] Optional thumbnail video renders when a video URL exists, remains muted/looped/playsInline, and respects reduced-motion behavior.
- [ ] Per-project strokes come from CMS field `OHdUYs6Mo` via `CaseStudyThumbnailStrokeStyles.tsx`, not from hardcoded fallback classes. On `/index`, `IndexPage.tsx` should render plain `.idx-grid-card-media`; the helper applies any visible stroke as a non-layout overlay. On native Framer `Case Study` cards, the helper toggles the real overlay frame inside `ImageWrapper` so canvas/editor can show the same status. Verify the helper can read the current generated CMS module export (`r.collectionByLocaleId.default.scanItems`) before publishing stroke-related changes.
- [ ] Grid extends to the same 20px left/right margin as the nav/taxonomy section.
- [ ] Visible view toggle is inline right as `GRID / LIST`, visually bottom-aligned with the original left-aligned `CLEAR FILTERS` action when active.
- [ ] View toggle has only Grid/List, matches the `CLEAR FILTERS` action style, and underlines the active view.
- [ ] View transitions are smooth (150ms fade out → 250ms fade in, with `renderKey` remount).
- [ ] Project count updates with filters and uses singular/plural correctly.
- [ ] Year `2019-ongoing` from CMS is normalized to `2019` for grouping/filtering.
- [ ] All text is uppercase where specified; mono cells use 13px / 28px / 0 letter-spacing.
- [ ] Token object is centralized; no scattered color/font magic values.
- [ ] Component exports with the property controls listed in §3.
- [ ] Single-file output, no external dependencies beyond React + Framer runtime APIs.
- [ ] All `.idx-rule` and `.idx-row-divider` lines render full opacity in the current rule color (`#141414` unless intentionally changed through controls).

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
- Do NOT revive `ImageMaskReveal` from old handoff notes unless there is a fresh design request. It is historical and not part of the current Framer inventory.
- Do NOT hardcode `.idx-grid-card-media.with-stroke` as a permanent class in `IndexPage.tsx`. The May 15 stroke helper owns all visible stroke output from CMS so each project can be toggled individually and toggled back off.
- Do NOT remove `CaseStudyThumbnailStrokeStyles` instance `szF9sZNWA` from `/index` unless you replace the stroke system with another CMS-aware implementation.
- Do NOT reintroduce `DISCIPLINE_NAV_ITEMS` / `DISCIPLINE_ALIASES` / `INDUSTRY_NAV_ITEMS` as hardcoded constants inside `IndexPage` unless you explicitly want to lock the nav back to a fixed list. The current pattern is to derive the nav from the bound projects.
- Do NOT push an older repo-side `IndexPage.tsx` back to Framer without merging in the mounted ProjectRegistrar registry path, direct CMS module fallback, simplified visible taxonomy, color controls, and current grid card structure.
- Do NOT lose the May 18 responsive promotion: canonical `/index` depends on the hidden `IndexPageBreakpointsDraft.tsx` style instance in Framer, and the repo `IndexPage.tsx` carries the same CSS for future code-file sync.
- Do NOT restore the old "Enter WorldGrid" button or `worldGridUrl` prop unless Micah explicitly asks.
- Do NOT leave fallback data at 12 projects; the current CMS roster has 16 items. If `DEFAULT_PROJECTS` is refreshed, keep it intentionally labeled as fallback-only and do not let it render in CMS mode.
- Do NOT use Next.js patterns (no `useRouter`, no `Link` component) — Framer handles routing.
- Do NOT add `<html>`, `<head>`, or `<body>` tags — this is a component, not a page.
- Do NOT assume fonts are loaded — use the fallback stack in the tokens object.
- Do NOT rename the `Industry` field or taxonomy label to `Origin`.
- Do NOT reintroduce taxonomy responsive CSS that stacks the three groups vertically at desktop or wide tablet. The current official behavior only switches the taxonomy/index nav at ≤899px.
- Do NOT use `/work/{slug}` routes inside this component; current case study routes are `/case-studies/{slug}`.
