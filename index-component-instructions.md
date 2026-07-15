# Index Page Code Component — Build Instructions for Claude Code

**Project:** Micah Hoang Portfolio Redesign
**Component:** `/index` page — List/Grid toggle with taxonomy filters
**Target:** Framer code component (React) injected into Jacob Turner template
**Date:** May 2026
**Last Framer structure audit:** June 18, 2026.

> **Read first:** the live behavior of `/index` is fully described in `framer-current-state.md` §3. This file is the build/maintenance brief for the code component. When the two disagree, `framer-current-state.md` wins.

**State summary (June 18, 2026):**

- One `/index` page, `u2LOaBT5q`. The earlier duplicate `yKKOMVNs6` (Mono 13 default) has been deleted.
- The old `/index-grid-preview` page was deleted. The Figma grid layout is now promoted to canonical `/index`.
- The mounted Framer-facing component is `IndexPageGridPreview.tsx` (`LgIzFjJ`), exported/displayed as `IndexPage`. It imports the CMS-backed base component from `IndexPage.tsx` (`rgAZFOv`, insert URL `https://framer.com/m/IndexPage-msQHCf.js`).
- `IndexPageGridPreview.tsx` exposes the authoring `View` segmented control (`Grid` / `List`) and remounts the base component with a keyed wrapper so changing the property panel control updates the Framer canvas. The base component's own inline `GRID / LIST` control remains the runtime visitor control.
- The original-template inline `GRID / LIST` control is now owned directly by `IndexPage.tsx` on canonical `/index`; the previous fixed/floating delegated toggle has been removed.
- The side-by-side page `/index-inline-toggle-test` (`VdRy9MV8k`) was removed after the inline version was promoted to canonical `/index`.
- Live Framer code file `LgIzFjJ` powers the mounted `/index` instance, with `useCMS=true`, wrapper `view="grid"` as the current instance default, and `thumbnailVideoFieldIds="SvOqFqdby"`. The base archive code still lives in `rgAZFOv`.
- The repo `IndexPage.tsx` mirror was reconciled against the current live direction on May 22, 2026 after the route audit.
- Current `/index` XML mounts `IndexPageGridPreview.tsx` (`LgIzFjJ`) as the archive component, alongside the site `PageTransition` and hidden CMS bridge. Responsive/index styling, direct grid-media hover scale, line-draw timing, and index nav/list/grid appear motion are consolidated in the base component plus the wrapper's Figma-specific CSS overrides; do not split them back into hidden `/index` CSS helper components. Large year/title text uses the masked slide-in preset, while smaller mono nav/meta text fades in. `IndexListCursorPreview.tsx` and `IndexFilterNavDraftPage.tsx` were removed from Framer on May 26 because they were not mounted in current `/index` XML. `IndexThumbnailVideoFallback.tsx` was deleted on June 8; do not recreate hardcoded per-project thumbnail helpers.
- All index list/grid rules currently render in near-black `#141414` via `IndexPage.tsx` color property controls. Do not assume older `#233324` notes are current for `/index`.
- **Taxonomy refined (May 22, 2026):** the visible order is `/ Year`, `/ Service`, `/ Industry`; each group has an `All` button that clears only that filter category. Service and Industry labels are sorted alphabetically; Year remains descending.
- **Data source refined (June 1, 2026; revised June 8):** `IndexPage.tsx` can use the mounted `ProjectRegistrar` registry first, then fall back to a direct import/scan of the generated Framer CMS module for `All Projects` (`yTHrQWMIY`), then manual `projects`. In CMS mode it does **not** fall back to `DEFAULT_PROJECTS`. Registry rows are hydrated from the generated CMS module by slug/title for thumbnail, thumbnail video, and thumbnail stroke so incomplete bridge rows cannot override richer CMS media/stroke data.
- **Grid view rewritten (May 10, 2026; refined May 22):** the `https://framer.com/m/Case-Study-G9lec1.js` import was removed. Grid cards now render as native HTML inside `IndexPage.tsx` (uniform 16:9 media, 3/2/1 column responsive grid, media hover scale, title below image with the same hover-flip used in List view, and metadata below title). The thumbnails were rendering blank because the responsive-image format being passed to the Framer Case Study module didn't hydrate for code-component usage; rendering directly from `<img>` fixed this.
- **Figma grid/card treatment promoted (June 18, 2026):** `IndexPageGridPreview.tsx` locks the active Grid layout to the Figma node direction: 3 columns on desktop, 2 columns below 1200px, and 1 column at 899px; cards stretch to the full content width with no max-width choke point; grid headings use the same 13px uppercase mono treatment as the homepage selected-work titles, with the order number above the thumbnail; CMS Category 1/2/3 tags render under thumbnails as 12px Light Gray mono pills.
- **List/Grid responsive alignment (June 18, 2026):** the single-column grid and mobile list simplification now share the same 899px container breakpoint. At and below that point, List view hides the year indicator and service/industry/category columns, keeps titles left-aligned to the page margin, and stretches row/year/bottom rules full width.
- **ImageMaskReveal is archived:** old notes about disabled/enabled `ImageMaskReveal` instances are historical. The reveal component is stub-archived and not part of the current `/index` behavior.
- **Thumbnail stroke helper added (May 15, 2026; cleaned up May 16; canvas update May 19; CMS export fix June 1; instance prop cleanup June 2):** `CaseStudyThumbnailStrokeStyles.tsx` (`Z28JYvA`) controls per-project thumbnail strokes from the CMS Boolean `Thumbnail Stroke` (`OHdUYs6Mo`). The `/index` helper instance is `szF9sZNWA`; Home and `/case-studies` also have instances. The helper toggles a real Light Gray overlay frame in the Framer `Case Study` media wrapper when available, and falls back to a generated DOM overlay for custom HTML cards such as `/index`. It must resolve both legacy `module.a` and current `module.r` Framer CMS export shapes before scanning records. As of June 2, the helper instances use Framer item slugs directly (`slugFieldId=""`). The old `Case Study` stroke variants and the old `/index` hardcoded `with-stroke` class path have been removed.
- **Inline toggle promoted and integrated (May 16, 2026; style-aligned May 19; consolidated June 11):** `IndexPage.tsx` renders uppercase `GRID / LIST` after the taxonomy nav and styles the toggle to match `CLEAR FILTERS` (13px uppercase mono, 28px line-height, weight 400, secondary text color, hover opacity, active underline). `CLEAR FILTERS` remains the original left-aligned button inside `TaxonomySection`. The action row uses a stable 12px top gap, 28px line, and 24px bottom gap so selecting/deselecting filters does not shift content. The former `IndexInlineToggleProxy.tsx` code file (`TexpcmJ`) and `/index` instance (`HM1pZPonP`) were deleted after this behavior moved into `IndexPage`.

---

## 1. What You're Building

The `/index` archive is maintained as a base Framer code component plus a mounted wrapper. `IndexPage.tsx` (`rgAZFOv`) owns the CMS/data rendering; `IndexPageGridPreview.tsx` (`LgIzFjJ`) is the production Framer-facing wrapper that previews/publishes the Figma Grid/List layout. Together they expose:

- Three taxonomy columns (Year, Service, Industry) acting as multi-select filters.
- Two view modes (List, Grid) toggled from an inline `GRID / LIST` control after the taxonomy nav.
- Two A/B variants for List view (`Standard` vs `Mono 13` typography; `Flip` vs `Highlight` hover).
- A trailing project-count footer.

Project data flows in through three priority-ranked sources (described in §3). The component **does not** include the site nav, the `INDEX` heading at 110px (that's a sibling Framer text element), or any 3D/WorldGrid surface.

**Important caveat:** the previous behavior where the unfiltered Grid view fell back to the native `Case Studies Filter` component has been removed. Grid view now renders project-driven cards as native HTML inline in `IndexPage.tsx` (no external Framer module). The native `Case Studies Filter` lives only on `/case-studies` now.

The outer `idx-container` owns the side margin (`padding: 0 20px`) and that should match the nav section. `IndexPage.tsx` owns the runtime List/Grid view state and renders the inline `GRID / LIST` control directly. `IndexPageGridPreview.tsx` owns the Framer authoring `View` property control and remounts the base component when that control changes so the Framer canvas can preview both modes.

**Home note, updated July 15, 2026:** the Home selected-work grid is not owned by `IndexPage.tsx`. It now uses `HomeSelectedWorkGrid.tsx` (`FecepLS`) because the native Home `CaseStudy` grid lost reliable link/image/video bindings and collapsed to AirPods content after hydration. Keep Home and `/index` separate; do not reimport the old native Home grid or use `CaseStudyLinkRepair.tsx` as the primary Home mechanism. Home and `/index` share the same thumbnail media policy: `Thumbnail Video` wins over `Thumbnail`, and `Thumbnail` is poster/fallback only.

**CMS note, June 2026:** the Framer `All Projects` CMS collection has 17 real projects. All Jacob Turner sample/template projects were permanently deleted. Do not re-add sample fallback data such as Vern Carter, Iris Wade, Orion Ventures, Echoes, Iconic, Adapting Literature, Genre Evolution, Digital Disruption, Connections, Capturing the Essence, Beyond the Frame, or Harmony in Motion.

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
        thumbnailVideoLink: { type: ControlType.File,    title: "Thumbnail Video" },
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
- `Thumbnail Video` → `thumbnailVideoLink`
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

- Standard mode in the base component: GT Standard Trial, weight 300, 40px, line-height 1.3, color `tokens.textPrimary`; its internal mobile style drops to 28px. In the mounted wrapper's current Figma layout, the year indicator is hidden at the shared ≤899px single-column/list-simplification breakpoint.
- `Mono 13` mode: 13px uppercase mono, line-height 28px, color `tokens.textPrimary`.
- Year labels render `year > 0 ? year : "—"`.
- Full-opacity rule above each year group: 1px, `tokens.dividerStrong`, viewport-triggered WAAPI `scaleX(0) → scaleX(1)` over 2200ms Smooth `cubic-bezier(0.12, 0.23, 0.5, 1)`, staggered by group index up to 8.

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
- Format: `<count> Project` or `<count> Projects` (singular/plural is handled). With the current 17-record CMS and no filters, the live CMS-backed page should read `17 Projects`.

### Taxonomy filter behavior

- Clicking a taxonomy item toggles it as an active filter.
- Multiple filters within a category use OR logic; filters across categories use AND logic.
- "Clear filters" button appears below the taxonomy when any filter is active.
- Search is plumbed (`filterProjects` accepts a `query` arg) but the only call site passes `""`.

### Responsive breakpoints (from the live generated CSS)

- ≤1199px: container padding 0 20px (already the desktop value, preserved as `!important` for safety).
- ≤899px: taxonomy switches to SearchSystem-style label/value rows in the order Year, Service, Industry.
- ≤899px: taxonomy/nav stacks into label/value rows and the Grid switches to one column. List view switches at the same point: year indicators and service/industry/category columns are hidden, titles align to the left page margin, and all row rules span full width.
- ≤809px: taxonomy uses `minmax(96px, 28%) minmax(0, 1fr)` with 18px column gap while preserving the simplified one-column List/Grid behavior.
- ≤520px: taxonomy keeps the label/value row format with tighter `minmax(84px, 32%) minmax(0, 1fr)` columns, 16px column gap, and 26px row gap.

### Current responsive breakpoint behavior

The May 18 responsive direction is now the official published `/index`. As of June 11, canonical `/index` keeps that responsive CSS directly inside `IndexPage.tsx`; there is no hidden breakpoint helper component to preserve.

- Keep the desktop taxonomy/index nav through wider tablet widths. It does not switch the taxonomy to the compact format until ≤899px, when the content columns start to feel tight.
- ≤899px taxonomy/index nav uses a SearchSystem-style two-column structure: labels on the left, values on the right, with Year / Service / Industry stacked vertically and a 28px category row gap.
- ≤899px also activates the wrapper's list simplification: no year indicator, no service/industry/category columns, left-aligned full-width titles, and full-width rules.
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
- Single-column (≤899px in the mounted wrapper): 1 column, `row-gap: 52px` for the Figma layout.
- All cards are uniform width — there is no longer a weighted/featured pattern. Card heights derive from the 16:9 media aspect ratio plus the title and metadata below it.

### Runtime behavior

- Empty filtered state matches List view copy: "No work matches those filters."
- View transitions: toggle click swaps the view and bumps `renderKey` so incoming large year/title text remounts with the masked slide-in and incoming mono metadata remounts with fade-in. Do not add a parent opacity fade around List/Grid content, because that would flatten the individual text motion.
- Grid card title uses the same `.idx-mask-appear` masked slide preset as List year/title text; grid metadata uses `.idx-fade-appear`.
- The hover-flip and the video reveal both use `.idx-grid-card:hover` selectors, mirroring the List view pattern. On mobile (≤809px), the flip transform is overridden to `none` so the title remains stable.

### Filtering behavior

The taxonomy filters are source-of-truth state in `IndexPage.tsx` and drive List view, Grid view, and project count. Service filtering checks each project's `[category1, category2, category3]` (de-duplicated via `getDisciplines`). Industry filtering matches `industry` exactly. Year filtering matches the normalized numeric year.

---

## 6. Dormant Reference: 3D Inline WorldGrid Sphere

Not exposed on `/index`. The visible inline toggle is Grid/List only. Earlier inline `InlineWorldGrid` / `ThreeDPreview` helpers are gone. `WorldGridTest.tsx` is no longer present in the current Framer code-component inventory. Do not bring a 3D/gallery mode back to `/index` unless Micah explicitly asks.

---

## 7. Inline View Toggle

### Position and behavior

The fixed/floating toggle path has been removed. `IndexPage.tsx` renders the visible inline `GRID / LIST` control after the taxonomy nav and applies the style-only alignment override when filters are active. `CLEAR FILTERS` remains the original left-aligned `TaxonomySection` action.

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
| ≤899px | label/value pairs, groups stack vertically | year indicator and metadata columns hidden; title full-width and left-aligned | one-column stacked cards, 52px row gap | taxonomy footer right |
| ≤520px | tighter label/value pairs | same simplified full-width title rows | one-column stacked cards | taxonomy footer right |

May 18/22 promotion note, revised June 18: the published breakpoint behavior delays taxonomy collapse until ≤899px. At that same 899px point, the mounted wrapper now switches Grid to one column and List to the simplified mobile structure so both views break at the same visual moment.

On desktop/tablet, Industry stays visible after Service is hidden and can wrap or truncate per breakpoint. At and below the shared 899px single-column breakpoint, the simplified mobile List hides year, service, and industry/category columns so project titles sit directly on the left margin.

---

## 9. Animation & Motion

Follow the motion hierarchy from the framework doc:

1. Does this motion serve comprehension or navigation? → Keep.
2. Does it signal the brand's considered quality? → Keep.
3. Is it there because it looks cool? → Delete.

Canonical coded easing is intentionally narrow after the June 18 consolidation:

- **Snappy:** `cubic-bezier(0.16, 1, 0.3, 1)` for decelerating ease-out motion, including reveals, fades, masks, hover transforms, and media scale.
- **Smooth:** `cubic-bezier(0.12, 0.23, 0.5, 1)` for symmetric in/out motion, including rule draws, small UI state changes, and old bare `ease` transitions.
- **Springy:** `cubic-bezier(0.25, 1, 0.5, 1)` only for Image Trail's punchy gestural cursor animation in the live Framer source; keep index/list/page-transition motion on Snappy or Smooth.
- Legacy decel `cubic-bezier(0.22, 1, 0.36, 1)` maps to Snappy. Legacy symmetric `cubic-bezier(0.33, 0, 0.67, 1)` maps to Smooth.

### Transitions between views

- View switch: state swap + render-key bump, then incoming large title/year text masks in and incoming mono metadata fades in on appear. The toggle click should feel instant and considered; do not wrap the view in a parent opacity fade.

### Index nav and List view entrance

- The taxonomy nav, inline `GRID / LIST`, Clear Filters, and smaller mono metadata use `.idx-fade-appear`. The nav uses `INDEX_NAV_FADE_PRESET` with Snappy easing so labels/`All` actions enter first and values fade top row to bottom row rather than sprinkling in arbitrarily.
- List year labels such as `2026`, List project titles such as `Gaia`, and Grid titles use `INDEX_MASK_REVEAL_PRESET`. The wrapper is `.idx-mask-appear`; the inner `.idx-mask-reveal-text` animates from `translateY(115px)` to `0` inside an overflow-hidden mask, mirroring the Framer top `Index` heading node (`M_Ry0NG_m`) inside `HeadingRowWrapper` (`height=113px`, `overflow=hidden`).
- Mask timing follows the shared Info-style site type rhythm: 900ms, 90ms base delay, 90ms stagger, and Snappy `cubic-bezier(0.16, 1, 0.3, 1)`. `PageTransition.tsx` v7.12 also normalizes existing `.idx-mask-reveal-text` WAAPI calls at runtime while skipping the top `Index` heading so it remains owned by Framer's native heading animation.
- `.idx-fade-appear`, `.idx-mask-appear`, and `.idx-rule` elements are triggered by the local `useIndexAppearTrigger` hook, with reveal deferred by two animation frames so the hidden state is painted before WAAPI begins. If an element is mounted while a browser View Transition is active, the hook waits for `pt:reveal` from `PageTransition.tsx` or the transition-active fallback to clear, then reveals once after the page cover ends. The hook also has a page-level fallback reveal so list rows below the fold are already animated by the time the user scrolls down. Do not restart already-revealed elements on `pt:reveal`; that causes the `/play` → `/index` double animation glitch.
- List titles/meta use deterministic row delays from `INDEX_CONTENT_REVEAL_PRESET` (130ms base, 64ms row stagger, 24ms column stagger, max row index 34), so the reveal continues through all rows instead of clamping only to visible rows.
- Year rules and intra-year row dividers: WAAPI transform (`scaleX(0) → scaleX(1)`), 2200ms, Smooth `cubic-bezier(0.12, 0.23, 0.5, 1)`, staggered by year/row.
- Reduced motion: `.idx-fade-appear`, `.idx-mask-appear`, `.idx-row`, `.idx-grid-card`, and `.idx-rule` have animation disabled under `prefers-reduced-motion: reduce`, with appear items forced visible. The flip transform is also disabled under reduced motion.

### List row hover

- `listHoverVariant="flip"` is the default. The flip mirrors the native Framer `ViewProject` reference (`node=L21w7Xq1z`):
  - Title cell wraps a `idx-flip-track` containing two stacked copies separated by a 5px gap.
  - Track height matches `--idx-flip-height` (28px in Mono 13, 27px in Standard).
  - On row hover/focus, the track translates upward by `-(height + 5px)` over 620ms Snappy `cubic-bezier(0.16, 1, 0.3, 1)`.
  - The second copy reads `"View Project"` when a slug exists (otherwise mirrors the title).
  - On mobile, the flip is disabled (track gap removed, transform forced to none) so titles stay visible.
- `listHoverVariant="highlight"` is preserved for A/B comparison and applies a faint `rgba(20, 20, 20, 0.035)` row background on hover (no flip).
- Service and Industry text never participates in the flip — only the title.

### Grid view motion

- Grid title uses `.idx-mask-appear`; grid metadata uses `.idx-fade-appear`.
- Grid thumbnails are wrapped in `GridMediaFrame`, which owns the `.idx-grid-card-media` fade-in state and uses `INDEX_MEDIA_FADE_PRESET` (620ms, 140ms base delay, 58ms item stagger, Snappy `cubic-bezier(0.16, 1, 0.3, 1)`) to match the smoother case-study media feel.
- Media hover scale applies to `.idx-grid-card-img`, `.idx-grid-card-video`, and direct `.idx-grid-card-media > img/video` children at `scale(1.02)` on hover/focus. The direct-child selectors are required because `CaseStudyThumbnailStrokeStyles.tsx` can inject CMS videos such as Motion Connect after `IndexPage` renders. `IndexPage.tsx` owns those selectors and the index appear presets for nav, list rows, and grid media.
- `/index` currently reads only `Thumbnail Video` (`SvOqFqdby`) via the `IndexPage` instance `Video Fields` prop when it is using CMS-module data. Thumbnail media policy is: `Thumbnail Video` wins over `Thumbnail`; `Thumbnail` is poster/fallback. Registry rows are hydrated from the generated CMS module by slug/title for thumbnail, thumbnail video, and thumbnail stroke before rendering, so an incomplete `ProjectRegistrar` bridge row cannot erase CMS media/stroke values. The older `Thumbnail Video Link` text field (`WG62tRjG8`) is retired and should not be used for thumbnail-video wiring. The existing `CaseStudyThumbnailStrokeStyles.tsx` instance on `/index` is configured with `syncThumbnailVideos=true`, `videoFieldId="SvOqFqdby"`, and `slugFieldId="pdXVG_fBO"` as a backup CMS video overlay path. Publish/redeploy Framer after editing File-field thumbnail videos so the generated CMS module refreshes.
- Reduced motion forces all index grid media back to `scale(1)` and removes transitions.
- View switches remount the content so masked and faded text can reveal again; the flip-related JS on rows remains independent of the appear animation.

### Filter changes

- Changes to filters update `filteredProjects` via `useMemo`; List, Grid, and the project count all re-derive from that single source.

---

## 10. File Structure

The base archive renderer remains a single Framer code file:

```
IndexPage.tsx
```

The production `/index` page currently mounts a second single-file wrapper:

```
IndexPageGridPreview.tsx
```

Keep both files single-file Framer code components. All styles should stay inline (CSS-in-JS via style objects) or in a `<style>` tag within the component. Framer code components don't support external CSS files. Do not remove the wrapper unless its Figma grid/list overrides and the Framer authoring `View` preview behavior have been migrated into the base component and verified on `/index`.

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

  const [activeView, setActiveView] = useState(defaultView === "grid" ? "grid" : "list")
  const [renderKey, setRenderKey]   = useState(0)
  const [filters, setFilters] = useState({ disciplines: [], industries: [], years: [] })

  const disciplineNavItems = useMemo(() => getDisciplineNavItems(allProjects), [allProjects])
  const industryNavItems   = useMemo(() => getIndustryNavItems(allProjects),   [allProjects])
  const yearNavItems       = useMemo(() => getYearNavItems(allProjects),       [allProjects])
  const filteredProjects   = useMemo(() => filterProjects(allProjects, filters, ""), [allProjects, filters])

  // handleViewChange: setActiveView + bump renderKey so masked/faded text remounts/reveals
  // handleFilterToggle / handleClearFilters

  return (
    <>
      <style>{buildGlobalCss()}</style>
      <div className="idx-container" style={{ /* 0 20px padding, fontFamily mono, minHeight 60vh */ }}>
        <div style={{ marginBottom: 18 }}>
          <TaxonomySection ... />
        </div>
        <ViewToggle activeView={activeView} onViewChange={handleViewChange} />
        <div key={renderKey}>
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
- **Mounted Framer wrapper:** `IndexPageGridPreview.tsx`, code file id `LgIzFjJ`, exported as `IndexPage`
- **Framer page:** `/index`, page node id `u2LOaBT5q` (single page; the earlier `yKKOMVNs6` Mono 13 duplicate is gone)
- **Inline toggle, responsive, line/rule, and grid-hover owner:** `IndexPage.tsx` (`rgAZFOv`)
- **Removed May 26 cleanup:** `IndexListCursorPreview.tsx`, `IndexFilterNavDraftPage.tsx`, `IndexRuleColorOverride.tsx`, and `WorldGridTest.tsx` are not current `/index` dependencies.
- **CMS collection:** `All Projects`, collection id `yTHrQWMIY`
- **Taxonomy/filter inspiration:** https://searchsystem.co/index
- **Framework doc:** `portfolio-framework.md`
- **Copy doc:** `portfolio-copy-v2.md`
- **CMS workflow:** `case-study-cms-workflow.md`

---

## 12. Testing Checklist

Before delivering:

- [ ] Single `/index` page in the project (`u2LOaBT5q`). No second `/index` page reintroduced.
- [ ] List view renders with year grouping in both `Standard` and `Mono 13` typography modes.
- [ ] Taxonomy filters work: click to toggle, AND across categories, OR within. Clear-filters button appears when any filter is active.
- [ ] Taxonomy groups are labeled `/ Year`, `/ Service`, `/ Industry`; no `Origin` label returns.
- [ ] Year / Service / Industry nav values come from the bound projects via `getDisciplineNavItems` / `getIndustryNavItems` / `getYearNavItems`, not from a hardcoded list.
- [ ] If CMS-backed live data is needed, `useCMS=true` is set and the generated `yTHrQWMIY` CMS module loads; `ProjectRegistrar`/window registry is only a fallback.
- [ ] Three taxonomy groups stay horizontal at desktop and wide tablet; collapse to label/value pairs at ≤899px, with tighter column values at ≤809px and ≤520px.
- [ ] Taxonomy and List year-group share `repeat(6, minmax(0, 1fr))` within `padding: 0 20px`.
- [ ] List inner rows use `repeat(5, minmax(0, 1fr))`: title cols 1/span 2, service cols 3/span 2, industry col 5/span 1.
- [ ] Industry stays visible on desktop/tablet after Service hides, then hides together with year/service at the shared ≤899px single-column breakpoint.
- [ ] Grid view renders cards as native HTML inside `IndexPage.tsx` (no `Case Study` module import, no `Case Studies Filter` fallback).
- [ ] Grid uses a uniform CSS grid: 3 columns at ≥1200px, 2 columns at 900–1199px, 1 column at ≤899px. No weighted/featured pattern and no max-width choke point.
- [ ] Each card thumbnail is locked to `aspect-ratio: 16 / 9` via `.idx-grid-card-media`. Card heights are not hardcoded.
- [ ] Card title sits below the thumbnail and uses the same `HoverFlipText` helper as List view (`View Project →` on hover when slug exists).
- [ ] Optional thumbnail video renders when a video URL exists, remains muted/looped/playsInline, uses the same hover/focus `scale(1.02)` as images, and respects reduced-motion behavior.
- [ ] Per-project strokes come from CMS field `OHdUYs6Mo` via `CaseStudyThumbnailStrokeStyles.tsx`, not from hardcoded fallback classes. On `/index`, `IndexPage.tsx` should render plain `.idx-grid-card-media`; the helper applies any visible stroke as a non-layout overlay. On native Framer `Case Study` cards, the helper toggles the real overlay frame inside `ImageWrapper` so canvas/editor can show the same status. Verify the helper can read the current generated CMS module export (`r.collectionByLocaleId.default.scanItems`) before publishing stroke-related changes.
- [ ] Grid extends to the same 20px left/right margin as the nav/taxonomy section.
- [ ] In Framer, the mounted `IndexPage` wrapper `View` control can preview both Grid and List; changing it remounts the base component so canvas state does not get stuck.
- [ ] Visible view toggle is inline right as `GRID / LIST`, visually bottom-aligned with the original left-aligned `CLEAR FILTERS` action when active.
- [ ] View toggle has only Grid/List, matches the `CLEAR FILTERS` action style, and underlines the active view.
- [ ] View switches are immediate, bump `renderKey`, and let incoming large title/year text remount with masked slide-in while mono metadata fades in on appear. Do not add a parent opacity fade around List/Grid content.
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
- Do NOT lose the May 18 responsive promotion: canonical `/index` depends on the responsive CSS now consolidated directly inside `IndexPage.tsx`. Do not re-split breakpoint, toggle, appear-motion, line-draw, or direct grid-media hover CSS into hidden helper components.
- Do NOT restore the old "Enter WorldGrid" button or `worldGridUrl` prop unless Micah explicitly asks.
- Do NOT leave fallback data at 12 projects; the current CMS roster has 17 items. If `DEFAULT_PROJECTS` is refreshed, keep it intentionally labeled as fallback-only and do not let it render in CMS mode.
- Do NOT use Next.js patterns (no `useRouter`, no `Link` component) — Framer handles routing.
- Do NOT add `<html>`, `<head>`, or `<body>` tags — this is a component, not a page.
- Do NOT assume fonts are loaded — use the fallback stack in the tokens object.
- Do NOT rename the `Industry` field or taxonomy label to `Origin`.
- Do NOT reintroduce taxonomy responsive CSS that stacks the three groups vertically at desktop or wide tablet. The current official behavior only switches the taxonomy/index nav at ≤899px.
- Do NOT use `/work/{slug}` routes inside this component; current case study routes are `/case-studies/{slug}`.
