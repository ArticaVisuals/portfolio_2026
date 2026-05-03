# Index Page Code Component — Build Instructions for Claude Code

**Project:** Micah Hoang Portfolio Redesign
**Component:** `/index` page — List/Grid toggle with taxonomy filters
**Target:** Framer code component (React) injected into Jacob Turner template
**Date:** May 2026
**Last Framer MCP audit:** May 1, 2026. Framer code file `rgAZFOv` still powers `/index`. Local `IndexPage.tsx` now has a 15-project fallback synced from the CMS registry, including current thumbnail/video fields. Framer currently has two `/index` pages: `u2LOaBT5q` defaults to `Standard`, and `yKKOMVNs6` defaults to `Mono 13`.

---

## 1. What You're Building

A single React code component for Framer that renders the content area of the `/index` archive page. It currently exposes two view modes (List and Grid) and taxonomy filtering (Discipline, Industry, Year). The component receives project data as props from Framer's CMS.

**Current implementation note, May 2026:** the live implementation is Framer code file `rgAZFOv`; the local repo also has the synced `IndexPage.tsx`. The component exposes List and Grid in the bottom toggle. Older inline 3D helper code has been removed from this component. `WorldGridTest.tsx` still exists as code file `ibj8uxT`, but there is no current `/worldgrid-test` web route.

The Grid view has two data paths. In the unfiltered state, if no `projects` array is bound into `IndexPage`, it renders the native CMS-backed `Case Studies Filter` grid component (`y8kvTlWMC`, `https://framer.com/m/Case-Studies-Filter-9lC3jo.js`) so the thumbnails match `/case-studies`. When a CMS project array is bound, or when index taxonomy filters are active, it renders project-driven cards from `filteredProjects` using `title`, `category1`-`category3`, `industry`, `year`, `thumbnail`, `thumbnailVideoLink`, `slug`, and `sortOrder`.

Important caveat: the native `Case Studies Filter` component does not consume `filteredProjects`; it is used only for the unfiltered CMS-native Grid state. Filtered Grid must continue to use the project-driven path.

The outer `idx-container` owns the side margin and should stay at 20px, matching the nav section. `IndexPage.tsx` owns the single List/Grid toggle; do not restore a second component-local Grid/List toggle.

**Current CMS note, May 2026:** the Framer `All Projects` CMS collection has 15 real projects. All Jacob Turner sample/template projects were permanently deleted. Do not re-add sample fallback data such as Vern Carter, Iris Wade, Orion Ventures, Echoes, Iconic, Adapting Literature, Genre Evolution, Digital Disruption, Connections, Capturing the Essence, Beyond the Frame, or Harmony in Motion.

**Fallback data note, May 1 MCP audit:** local `IndexPage.tsx` has a 15-project `DEFAULT_PROJECTS` array synced from the current CMS registry. Treat the CMS as the live source of truth and refresh the fallback if CMS project metadata changes. The old WorldGrid fallback/sample array has been removed from `IndexPage.tsx`; standalone 3D exploration is currently unrouted.

**Home note, May 2026:** the Home selected-work grid is not owned by `IndexPage.tsx`. It is a six-item CMS-backed selected-work query using the native Framer `Case Study` component. Do not recode Home unless Micah explicitly asks.

**Current taxonomy/list note, May 2026:** the taxonomy section is mapped to Figma node `32:7531`, but implementation now uses a shared six-column grid instead of fixed pixel column widths. Keep the 20px page margin and 20px grid gaps. Do not rename the second group to `Origin`; the second group is still `Industry`. List view content must use the same column starts so Year, Title, Discipline, and Industry stay left-aligned while the screen width changes.

**Published `/index` data note:** earlier audits saw simplified Industry labels in the published page, while the CMS stores longer strings. The current CMS now includes additional longer values such as `Design Education / Motion Design`, `Politics / Protest`, and `Film / Documentary / Public Media`. If you touch data mapping, decide explicitly whether the visible UI should use simplified display labels or raw CMS strings.

**The component does NOT include:**
- The site navigation bar (that's a native Framer element shared across pages)
- The "INDEX" title at 110px (that's a native Framer text element above the component)
- Any standalone WorldGrid page. `WorldGridTest.tsx` (`ibj8uxT`) exists as a code file only in the May 1 project map and remains separate from the `/index` List/Grid experience.

**The component DOES include:**
- Taxonomy filter columns (Discipline, Industry, Year)
- Sticky view toggle (List / Grid) — floating bottom-left
- List view (year-grouped project rows)
- Grid view (project-driven filtered cards)
- Project count footer for List/Grid views

---

## 2. Design Token Strategy — CRITICAL

The current component uses one centralized `tokens` object with hardcoded values copied from the Framer/Figma visual system. Keep values centralized there. Do not scatter colors, fonts, or spacing magic numbers throughout new code.

Earlier versions of this doc said the component must use guessed Framer CSS variable names. That is stale. Only switch a token to `var(...)` after verifying the actual variable name in Framer. Until then, preserving the current centralized token object is safer and easier for future agents to maintain.

### Color tokens to use

```css
/* Primary text — near-black */
--color-text-primary: #26211f;

/* Secondary text — muted for metadata */
--color-text-secondary: #636363;

/* Tertiary text — taxonomy items, lighter metadata */
--color-text-tertiary: #979797;

/* Background */
--color-bg: #F7F5F0;

/* Divider — strong (between year groups) */
--color-divider-strong: #26211f;

/* Divider — subtle (between project rows) */
--color-divider-subtle: #979797;

/* Surface — frosted cream toggle bg */
--color-surface-overlay: rgba(215, 213, 207, 0.72);

/* Surface — toggle active button bg */
--color-surface-active: #EAE8E3;
```

### Typography tokens

The template uses specific fonts. Reference them as CSS font-family with fallbacks:

```css
/* Display — INDEX title, year headers (40px) */
--font-display: 'GT Standard Trial', 'Inter', sans-serif;
/* Weight: Light (300) for year headers */

/* Project names — 22px medium weight */
--font-heading: 'GT Standard Trial', 'Inter', sans-serif;
/* Weight: Medium (500) */

/* Mono — all metadata, taxonomy, toggle, nav */
--font-mono: 'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace;
/* Weight: Regular (400), Size: 13px, uppercase, line-height: 28px */

/* Toggle text */
--font-toggle: 'GT Standard Mono Trial', 'Azeret Mono', monospace;
/* Weight: Regular (400), Size: 14px, uppercase */
```

**Important:** Framer code components can sometimes access page CSS variables, but this project has been more reliable with a local `tokens` object. If a future agent maps these to Framer variables, do it in one place and verify visually in Framer.

### How to discover the actual token names

The component should stay structured so token names are defined in ONE place and referenced throughout. This makes it trivial to update the variable names once Micah inspects the template's actual tokens.

**Recommended pattern:**

```jsx
const tokens = {
  textPrimary: '#26211f',
  textSecondary: '#636363',
  textTertiary: '#979797',
  bg: '#F7F5F0',
  dividerStrong: '#26211f',
  dividerSubtle: '#979797',
  surfaceOverlay: 'rgba(215, 213, 207, 0.72)',
  surfaceActive: '#EAE8E3',
  fontDisplay: "'GT Standard Trial', 'Inter', sans-serif",
  fontHeading: "'GT Standard Trial', 'Inter', sans-serif",
  fontMono: "'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace",
}
```

Micah or a future agent can then update this object once to match whatever Framer exposes.

---

## 3. Component Props (Framer Property Controls)

The component receives project data from Framer's CMS. Use the current property names from `IndexPage.tsx`; do not use the older single `discipline`, `coverImage`, `coverVideo`, or `caseStudyUrl` names.

```jsx
import { addPropertyControls, ControlType } from 'framer'

// Each project is an object with these fields, usually via CMS collection binding.

addPropertyControls(IndexPage, {
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
      }
    }
  },
  defaultView: {
    type: ControlType.Enum,
    title: "Default View",
    options: ["list", "grid"],
    defaultValue: "list"
  },
  listTypographyVariant: {
    type: ControlType.Enum,
    title: "List Type",
    options: ["standard", "mono13"],
    optionTitles: ["Standard", "Mono 13"],
    defaultValue: "standard",
    displaySegmentedControl: true
  },
  listHoverVariant: {
    type: ControlType.Enum,
    title: "List Hover",
    options: ["flip", "highlight"],
    optionTitles: ["Flip", "Highlight"],
    defaultValue: "flip",
    displaySegmentedControl: true
  }
})
```

### CMS schema and current Industry values

The Framer CMS collection is `All Projects` (`yTHrQWMIY`). See `framer-current-state.md` for the full field map. Fields directly used by `/index`:

- `Title` (`oeXZcmPna`) → `title`
- `Sorting Number` (`DLBifmgp1`) → `sortOrder`
- `Category 1` (`kuvJcmOFr`) → `category1`
- `Category 2` (`VV1CggU2J`) → `category2`
- `Category 3` (`E6OpH0hSs`) → `category3`
- `Year` (`QZqSK_3OF`) → `year`. MCP reports this CMS field as type `string`; one current value is `2019-ongoing`. Local `IndexPage.tsx` still types this as a number, so update/normalize year handling before relying on CMS-bound year filters.
- `Industry` (`mBIilFqVM`) → `industry`
- `Is Homepage` (`myUIfK0j7`) → `isHomepage`
- `Thumbnail` (`Jy7hBJady`) → `thumbnail`
- `Thumbnail Video Link` (`WG62tRjG8`) → `thumbnailVideoLink`

Canonical Discipline labels are locked to exactly: `Visual Identity`, `Brand Strategy`, `UX/UI`, `2D Motion`, `3D Motion`, `Packaging`, `Product`, `Editorial`. This current index nav list is the taxonomy source of truth. Do not re-expand these back to older labels like `Brand Identity`, `UI/UX Design`, `Motion Design`, `Publication Design`, `Packaging Design`, `Product Design`, `3D / Cinematic`, or `Typography`. Those older values may appear only as legacy input keys in `DISCIPLINE_ALIASES`, where they must normalize into the eight canonical labels above. Unknown CMS category strings should not be displayed or made filterable as Discipline labels.

The second taxonomy column must be labeled `Industry`, never `Origin`. The current industry nav is derived from the normalized `allProjects` array, sorted by `sortOrder`, so CMS-bound data and fallback data cannot drift into separate nav vocabularies. In the published page those bound props may use simplified display labels; the fallback list should mirror the raw CMS-style strings:

```js
const INDUSTRY_NAV_ITEMS = [
  "Consumer Electronics / Technology",
  "Publishing",
  "Citizen Science / Biodiversity",
  "Outdoor Retail / Consumer Goods",
  "Design Education / Motion Design",
  "Food Tech / Health & Wellness",
  "Social Enterprise / Consumer Goods",
  "Human Rights / Editorial",
  "Design Education / Brand Consulting",
  "Landscaping / Home Services",
  "Science Communication / Experimental Motion",
  "Music / Experimental Motion",
  "Literature / Publishing / Education",
  "Politics / Protest",
  "Film / Documentary / Public Media",
]
```

Project click URLs are derived from `slug` as `/case-studies/{slug}`. Do not restore the old `/work/{slug}` route in this component.

Hybrid case-study workflow note: `/index` should continue linking to `/case-studies/{slug}`. When bespoke Framer pages are created at those same canonical paths, this component should not need link changes. Do not add a separate `caseStudyUrl` prop unless the canonical URL strategy changes; if one is added later, keep the slug-derived URL as the fallback.

Published `/index` SSR was not fully reverified in the May 1 pass after the latest code update. The CMS has 15 records, and local fallback data is now synced to those 15 records; still treat the live CMS and Framer project state as source of truth.

---

## 4. View: List (Default)

The List view has an A/B typography control in Framer named `List Type`:
- `Standard`: current hierarchy, with large year labels and 22px project titles.
- `Mono 13`: Searchsystem-inspired comparison mode where year, title, discipline, and industry all use the same 13px uppercase mono treatment. This affects List view only; taxonomy, Grid view, project count, and the bottom List/Grid toggle stay as-is.

### Layout structure

```
[Taxonomy Columns]
  Discipline (label + 8 canonical items)  |  Industry (label + CMS-derived items)  |  Year (label + CMS-derived/current-year items)

[40px spacer]

[Year Group: 2026]
  ── black divider (1px, full width) ──
  Year label (40px, GT Standard Light)  |  Project rows
    Row: Name (22px GT Standard Medium)  |  Discipline (13px mono)  |  Industry (13px mono)
    ── subtle divider (#979797) ──
    Row: ...

[Year Group: 2025]
  ── black divider ──
  ...

[48px spacer]
[Project count: "15 PROJECTS" in 13px mono when CMS-bound, or current filtered count]
```

### Taxonomy specs

**Taxonomy section:**
- Font: GT Standard Mono Trial, 13px, uppercase, line-height 28px
- Figma source: node `32:7531`
- Layout is a shared six-column grid inside the 20px page margin: `repeat(6, minmax(0, 1fr))` with `20px` column gaps
- Do not define taxonomy columns with fixed pixel widths. Column widths must flex with the current component/screen width.
- Desktop/tablet placement:
  - Column 1: `Discipline` label
  - Column 2: Discipline values
  - Column 3: `Industry` label
  - Column 4: Industry values
  - Column 5: `Year` label
  - Column 6: Year values
- Label text color: same as primary text (#26211f)
- Item text color: same as primary text (#26211f) — they darken/highlight on hover and when active (selected as filter)
- Active filter state: text stays same color but gets an underline or bold weight to indicate selection
- Do not restore the old fixed widths (`366px`, `540px`, `140px`, `217px`, etc.). That causes jumpiness and breaks column alignment as the viewport changes.

**Year group headers:**
- Standard mode year text: GT Standard Trial, Light weight, 40px, #26211f
- `Mono 13` mode year text: GT Standard Mono Trial, Regular, 13px, uppercase, 28px line-height, #26211f
- Year label sits in column 1 of the same six-column grid
- Black divider above each year group: 1px, #000000, full width

**Project rows:**
- Standard mode height: 56px
- Standard mode padding: 9px vertical
- `Mono 13` mode uses denser rows (`38px` min-height, `5px` vertical padding) so the comparison feels closer to a compact index.
- Project rows use the same six-column system so every column remains left-aligned as the screen width changes:
  - Column 1: Year label for the year group
  - Columns 2-3: Project name
  - Columns 4-5: Discipline
  - Column 6: Industry
- Standard mode project name: GT Standard Trial, Medium weight, 22px, uppercase, #26211f
- Standard mode Discipline/Industry: GT Standard Mono Trial, Regular, 13px, uppercase, #26211f
- `Mono 13` mode: Year, project name, Discipline, and Industry all use GT Standard Mono Trial, Regular, 13px, uppercase, 28px line-height, #26211f.
- Never hide the Industry column at tablet or mobile breakpoints. On desktop/tablet, Discipline and Industry cells may shrink with `minmax(0, 1fr)`, `overflow: hidden`, `text-overflow: ellipsis`, and `white-space: nowrap`. On mobile, prefer a readable stacked row: Year as its own group label, project title full width, and Discipline/Industry wrapping below so information is not lost to ellipses.
- Row divider between projects within a year: 1px, `tokens.dividerSubtle` / Framer `Light Gray` (`#979797`). Keep this explicit; do not let intra-year dividers render white.
- All list rules use the same left-to-right reveal as the Framer `LineAnimation` reference (`node=CE4nNCCk8`): inactive width/scale starts at zero and draws to full width on entry.
- List row hover is A/B controlled by `listHoverVariant`. Default `flip` mirrors Framer `ViewProject` reference (`node=L21w7Xq1z`): clipped vertical text stack, original title on top, active title underneath, row hover translates only the project title upward. The title flips to `View Project` when a slug exists; Discipline and Industry remain static. `highlight` preserves the older full-row background hover.
- Rows are clickable — navigate to `/case-studies/{slug}` if `slug` exists

**Project count footer:**
- GT Standard Mono Trial, Regular, 13px, uppercase, #26211f
- Shows filtered count. CMS-bound current state should show "15 PROJECTS" before filters; a "12 PROJECTS" count means the component is using stale fallback data or a stale binding.

### Taxonomy filter behavior

- Clicking a taxonomy item toggles it as an active filter
- Multiple filters can be active simultaneously within a category (OR logic within category)
- Filters across categories use AND logic (must match at least one selected discipline AND one selected industry AND one selected year)
- When no filters are active in a category, all values pass
- Filtering updates both the project list and the project count
- Active filters should have a visual indicator (underline, bold weight, or subtle background)
- Consider adding a "Clear filters" action when any filter is active

### Search behavior

Search is not currently implemented in `IndexPage.tsx`. If search returns later, keep it scoped to the List view first unless the Framer grid component is also updated to accept/search the same data.

---

## 5. View: Grid (Existing Framer Component)

### Source of truth

The unfiltered Grid view should render the native CMS-backed `Case Studies Filter` grid when no `projects` array is bound into the code component. Filtered Grid, or CMS-bound Grid, should render from `filteredProjects`, the same array used by List view and project count, preserving the Framer-inspired alternating visual hierarchy with 3-card rows.

### Runtime behavior

- Desktop/tablet renders 3-card rows with 20px column gaps and alternating weights: `2/1/1`, `1/2/1`, `1/1/2`, then repeat.
- Featured cards use an approximately `1.723` media aspect ratio; standard cards use approximately `1.273`.
- Mobile at `max-width: 809px` stacks cards into one column and uses the standard media aspect ratio.
- Empty filtered state matches List view copy: "No work matches those filters."
- `IndexPage.tsx` owns the single List/Grid toggle.

### Filtering behavior

The taxonomy filters are source-of-truth state in `IndexPage.tsx` and drive List view, Grid view, and project count. Discipline filtering uses assigned `category1`, `category2`, and `category3` tags, with aliases normalized through `DISCIPLINE_ALIASES` into only the eight canonical Discipline labels.

---

## 6. Dormant Reference: 3D Inline WorldGrid Sphere

The current `/index` UI does not expose a 3D mode. The sticky toggle is List/Grid only, with equal-width black/ink buttons. The previous inline `InlineWorldGrid` / `ThreeDPreview` helpers were removed from `IndexPage.tsx`. `WorldGridTest.tsx` remains as an unrouted code component reference unless Micah explicitly asks to bring 3D back into `/index`.

### Layout

```
[Dark frame — full width, min-height 660px desktop, min-height 520px mobile]
  background: #141414
  border-radius: 8px
  overflow: hidden

  [Interactive thumbnail sphere]
    Image size: 156x104
    Radius: 280
    Perspective: 900
    Initial rotation: x -8, y -22
    Drag to rotate
    Wheel/trackpad scroll to zoom, clamped 0.65-1.65
    Each thumbnail links to /case-studies/{slug}
    Label overlays use 12px mono uppercase cream text
```

If revived later, the 3D view should build items from bound projects that have both `slug` and `thumbnail`; do not restore the old sample/template fallback data.

---

## 7. Sticky Toggle

### Position and behavior

- Fixed to viewport bottom-left and always visible
- Position: `fixed`, `bottom: 20px`, `left: 20px`
- Do not add an IntersectionObserver or inline/top-of-page toggle behavior unless Micah explicitly asks for it. The current implementation keeps one persistent fixed control.

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
  text-transform: uppercase;
  color: #26211f;
  text-align: center;
  cursor: pointer;
  border: none;
  background: none;
  border-radius: 4px;
  transition: all 200ms ease;
}

.toggle-button.active {
  color: #26211f;
  background: #EAE8E3;
}
```

### Two equal-width buttons: LIST / GRID

The bottom toggle content must remain ink/black (`#26211f`), including inactive labels. Do not add `3D` back to the toggle unless Micah explicitly asks for it.
Because Framer/global button styles can override native button text, `IndexPage.tsx` also applies a defensive `.idx-toggle-fixed * { color: #26211f !important; -webkit-text-fill-color: #26211f !important; }` rule. Preserve that unless the fixed toggle is rebuilt.

---

## 8. Responsive Behavior

### Breakpoints

- **Desktop (>1199px):** Taxonomy and List view use the shared six-column grid with 20px gaps; Grid view uses weighted 3-card rows; full project row shows Title, Discipline, and Industry.
- **Tablet (810-1199px):** Six-column grid remains active; Grid view keeps weighted 3-card rows; project rows keep Industry visible and let Discipline/Industry text truncate with ellipses.
- **Mobile (<810px):** Grid view stacks cards into one column. List view should stop using the desktop six-column comparison grid: the Year label becomes full width, each project title spans the row, and Discipline/Industry flow below in two columns before collapsing to one column on narrow phones. Taxonomy may compress to label/value pairs or one-column groups to avoid clipped text.

### Mobile toggle

On mobile, the sticky toggle moves to bottom-center for thumb accessibility.

---

## 9. Animation & Motion

Follow the motion hierarchy from the framework doc:
1. Does this motion serve comprehension or navigation? → Keep.
2. Does it signal the brand's considered quality? → Keep.
3. Is it there because it looks cool? → Delete.

### Transitions between views

- View switch: content fades out (opacity 1→0, 150ms), view swaps, content fades in (opacity 0→1, 250ms)
- No dramatic transitions. The toggle click should feel instant and considered.

### List view entrance

- On initial load or view switch to list: rows stagger in with subtle fade-up
- Each row: `opacity: 0 → 1`, `translateY(8px) → 0`, stagger 30ms per row, duration 300ms
- Year rules and intra-year project dividers use `.idx-rule`, drawing left-to-right over 700ms with `cubic-bezier(0.16, 1, 0.3, 1)`, staggered by year/row.
- Only animate the first visible batch (don't animate 32 rows)
- Preserve the reduced-motion fallback: `.idx-row`, `.idx-grid-card`, and `.idx-rule` should disable animation under `prefers-reduced-motion: reduce`.

### List view hover

- `listHoverVariant="flip"` is the preferred/default hover treatment.
- The flip treatment mirrors the native Framer `ViewProject` component (`node=L21w7Xq1z`): a fixed-height, overflow-hidden title mask contains two stacked copies separated by a 5px gap; row hover translates only the title stack upward over 620ms with `cubic-bezier(0.16, 1, 0.3, 1)`.
- In flip mode, do not use the old row highlight background. Keep `listHoverVariant="highlight"` available for A/B comparison only.
- Respect reduced motion by disabling the flip transform/transition under `prefers-reduced-motion: reduce`.

### Grid view motion

- Grid cards fade up with the same lightweight `idxFadeUp` motion as list rows.
- `IndexPage.tsx` fades the whole content area during List/Grid view switches.

### Filter changes

- When filters change: List view, Grid view, and project count update from `filteredProjects`.

---

## 10. File Structure

Deliver as a single file (Framer code components must be single-file):

```
IndexPage.tsx
```

All styles should be inline (CSS-in-JS via style objects) or in a `<style>` tag within the component. Framer code components don't support external CSS files.

### Component skeleton

```tsx
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { addPropertyControls, ControlType } from 'framer'
import CaseStudiesFilterFramerComponent from 'https://framer.com/m/Case-Studies-Filter-9lC3jo.js'

// Token configuration (single source of truth for design variables)
const tokens = { /* ... */ }

// Default project data
const DEFAULT_PROJECTS = [ /* ... */ ]

// Taxonomy data
const DISCIPLINE_NAV_ITEMS = [
  "Visual Identity",
  "Brand Strategy",
  "UX/UI",
  "2D Motion",
  "3D Motion",
  "Packaging",
  "Product",
  "Editorial",
]
const INDUSTRY_NAV_ITEMS = [ /* CMS Industry fallback list */ ]
const YEAR_NAV_ITEMS = ["2026", "2025", "2024", "2023", "2019-ongoing"]

// Helper: group projects by year
function groupByYear(projects) { /* ... */ }

// Helper: filter projects
function filterProjects(projects, filters) { /* ... */ }

// Helper: normalize CMS-bound disciplines to the current Discipline nav source of truth
function normalizeProjectDisciplines(project) { /* ... */ }

// Helper: derive Industry nav from normalized projects in Sorting Number order
function getIndustryNavItems(projects) { /* ... */ }

// Sub-components
function TaxonomySection({ filters, industryNavItems, onFilterToggle, onClearFilters }) { /* ... */ }
function ListView({ projects, typographyVariant, hoverVariant }) { /* ... */ }
function GridProjectCard({ project, index, weight }) { /* render title + thumbnail/video card */ }
function GridView({ projects, useNativeCMSGrid }) { /* native CMS grid when unfiltered, otherwise weighted project rows */ }
function ViewToggle({ activeView, onViewChange }) { /* ... */ }

// Main component
export default function IndexPage({ projects, defaultView, listTypographyVariant, listHoverVariant }) {
  const allProjects = useMemo(() => {
    const sourceProjects = projects && projects.length > 0 ? projects : DEFAULT_PROJECTS
    return sourceProjects.map(normalizeProjectDisciplines)
  }, [projects])
  const initialView = defaultView === 'grid' ? 'grid' : 'list'
  const [activeView, setActiveView] = useState(initialView)
  const [filters, setFilters] = useState({ disciplines: [], industries: [], years: [] })
  const industryNavItems = useMemo(
    () => getIndustryNavItems(allProjects),
    [allProjects]
  )
  
  const filteredProjects = useMemo(() => 
    filterProjects(allProjects, filters),
    [allProjects, filters]
  )
  
  return (
    <div style={styles.container}>
      <TaxonomySection
        filters={filters}
        industryNavItems={industryNavItems}
        onFilterToggle={handleFilterToggle}
        onClearFilters={handleClearFilters}
      />
      
      {activeView === 'grid'
        ? <GridView projects={filteredProjects} />
        : <ListView projects={filteredProjects} typographyVariant={listTypographyVariant} hoverVariant={listHoverVariant} />}
      
      <div style={styles.projectCount}>
        {filteredProjects.length} PROJECTS
      </div>
      
      <ViewToggle activeView={activeView} onViewChange={handleViewChange} />
    </div>
  )
}

// Framer property controls
addPropertyControls(IndexPage, { /* ... */ })
```

---

## 11. Key References

- **Taxonomy/list Figma comp:** https://www.figma.com/design/XbHEqG3zBZJrcVkgmIEkZF/Micah-Hoang-Portfolio?node-id=32-7531 (node `32:7531`)
- **Grid source:** `GridView` and `GridProjectCard` inside `IndexPage.tsx`, rendering Framer `Case Study` cards from `https://framer.com/m/Case-Study-G9lec1.js`
- **Framer code file:** `IndexPage.tsx`, code file id `rgAZFOv`
- **Framer pages:** `/index`, page node ids `u2LOaBT5q` (`Standard`) and `yKKOMVNs6` (`Mono 13`)
- **WorldGrid reference:** `WorldGridTest.tsx`, code file id `ibj8uxT`; no current `/worldgrid-test` web page
- **CMS collection:** `All Projects`, collection id `yTHrQWMIY`
- **Current Framer audit:** `framer-current-state.md`
- **Taxonomy/filter reference:** https://searchsystem.co/index
- **Framework doc:** portfolio-framework.md (in project files)
- **Copy doc:** portfolio-copy-v2.md (in project files)

---

## 12. Testing Checklist

Before delivering:

- [ ] List view renders with year grouping in both `Standard` and `Mono 13` typography modes
- [ ] Taxonomy filters work: click to toggle, AND across categories, OR within
- [ ] Second taxonomy column is labeled `Industry`, not `Origin`
- [ ] Industry nav values come from CMS-bound `industry` values, sorted by `Sorting Number`
- [ ] Confirm whether the intended visible Industry labels are the current simplified labels or the longer raw CMS strings
- [ ] Three taxonomy groups stay horizontal and do not stack vertically at tablet width
- [ ] Taxonomy and List view share the same six-column grid within the 20px page margin
- [ ] List row left edges stay aligned: Year column 1, Title column 2, Discipline column 4, Industry column 6
- [ ] Industry is never hidden by responsive CSS; Discipline/Industry truncate with ellipses instead
- [ ] Grid view filters dynamically from the same `filteredProjects` array as List view
- [ ] Grid uses weighted 3-card rows above 809px and one-column stacked cards below 810px
- [ ] Grid extends to the same 20px left/right margin as the nav/taxonomy section
- [ ] View toggle is fixed bottom-left and always visible
- [ ] View toggle has only List/Grid, equal-width buttons, and black/ink text for active and inactive labels
- [ ] View transitions are smooth (fade, not instant swap)
- [ ] Project count updates with filters
- [ ] Responsive: tablet and mobile breakpoints work
- [ ] All text is uppercase where specified
- [ ] Token object is centralized; no scattered color/font magic values
- [ ] Component exports with proper Framer property controls
- [ ] Single-file output, no external dependencies beyond React

---

## 13. What NOT to Do

- Do NOT use Tailwind — Framer code components don't support it
- Do NOT use external CSS files — everything must be inline or in `<style>` tags
- Do NOT use localStorage or sessionStorage — not supported in Framer
- Do NOT import heavy libraries (no framer-motion — use CSS transitions and vanilla JS for animations)
- Do NOT scatter hardcoded colors — always go through the centralized tokens object
- Do NOT use the linked Framer `Case Studies Filter` component for filtered Grid states; it is allowed only for the unfiltered CMS-native Grid fallback.
- Do NOT restore the old "Enter WorldGrid" button or `worldGridUrl` prop unless Micah explicitly asks to turn the inline sphere back into a separate entry state.
- Do NOT leave fallback data at 12 projects; the CMS registry currently has 15 projects.
- Do NOT use Next.js patterns (no `useRouter`, no `Link` component) — Framer handles routing
- Do NOT add `<html>`, `<head>`, or `<body>` tags — this is a component, not a page
- Do NOT assume fonts are loaded — use the fallback stack in the tokens object
- Do NOT rename the `Industry` field or taxonomy label to `Origin`
- Do NOT reintroduce taxonomy responsive CSS that stacks the three groups vertically
- Do NOT use `/work/{slug}` routes inside this component; current case study routes are `/case-studies/{slug}`
