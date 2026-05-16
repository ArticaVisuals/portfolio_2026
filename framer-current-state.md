# Framer Current State Audit

**Project:** Micah Hoang Portfolio 2026
**Last audited:** May 15, 2026
**Published URL:** `https://khaki-ship-257706.framer.app`
**Latest observed deploy:** May 10, 2026 (production + staging in sync; May 15 CMS thumbnail-stroke helper saved to Framer draft, awaiting next Publish)

This file is the quick source of truth for the current Framer document state. Read this before editing the older strategy, copy, CMS, or code-component docs — they are kept reasonably current but this file leads.

---

## 1. Current Framer Structure

### Web Pages

- `/` — Home, page ID `R6_F7xjGZ`
- `/404` — 404, page ID `koPvme2ig`
- `/case-studies` — Native case-study index with `NumberCounter` and `Case Studies Filter`, page ID `Rnw1WO1jS`
- `/case-studies/:slug` — Dynamic case-study detail route, page ID `UlQco8cYi`
- `/info` — Profile/info page, page ID `fxz_zRIyp`
- `/contact` — Contact page, page ID `gmXtVnIzJ`
- `/index` — Archive page (single, not duplicated), page ID `u2LOaBT5q`

The earlier duplicate `/index` page (`yKKOMVNs6`, "Mono 13" default) **has been deleted**. There is now exactly one `/index` page in the project. The remaining page hosts a single `IndexPage` instance that exposes the List Type as a Framer property control. There is also no current web page for `/profile` or `/worldgrid-test`. `/info` is the live profile route. `WorldGridTest.tsx` still exists as a code file (`ibj8uxT`) but is unrouted.

### Design Pages

- `Design`, design page ID `NLQmOR3If`
- `Case Study Starter System`, design page ID `qDjep9bZD`
- `Home A/B Grid Preview`, design page ID `GIzzd0QWG`

### Components

- `xxIb0BkhJ` Footer
- `V3EjteYMK` Open Navigation Link
- `jRXzTKEh2` Logo Link
- `E6fn6UkLd` Case Study (native card used on Home and via code on `/index` Grid)
- `uAVxdOWKR` List View
- `EOY6MztTy` Index Component (native, not the code component)
- `gXRFeEYV5` Awards Row
- `Ze1Duiwpp` List View - Image
- `y8kvTlWMC` Case Studies Filter (used on `/case-studies`, no longer on `/index`)
- `PAvplMLSj` Article Tile
- `ZezrseH_j` Scroll More
- `J4W3qvTWk` Social Links
- `CKAXHxDqW` Line Animation
- `dVTZgYLeH` Text Link
- `yGfvD64UY` Navigation
- `iux_1P4dx` View project
- `VWOW0DGN_` Clipboard
- `IPvO3afLU` Button
- `oaoViy994` ButtonQuickTransition
- `xh1JXhHWQ` Address Link
- `Cv5erMP2Q` Contact
- `YJPJeHdWT` Image Carousel
- `IL3Yzfvr0` Other Project Card

### Code Components

- `rgAZFOv` `IndexPage.tsx` — drives `/index`. **Live Framer source is now newer than the repo copy** (see §6).
- `tqQjSoH` `IndexRuleColorOverride.tsx` — placed on `/index` and `/case-studies`. Does two things: (a) recolors `.idx-rule` / `.idx-row-divider` to its `ruleColor` prop via global CSS, and (b) when `adjustCaseStudiesGrid="true"`, runs a layout pass on `/case-studies` cards to apply the source image aspect ratio to each card.
- `poRGCf7` `ImageMaskReveal.tsx` — site-wide scroll reveal, instance present on every page.
- `Z28JYvA` `CaseStudyThumbnailStrokeStyles.tsx` — CMS-driven thumbnail-stroke helper. Reads `All Projects` field `OHdUYs6Mo` and applies a non-layout 1px Light Gray (`#979797`) overlay stroke to matching project thumbnails on Home, `/case-studies`, and `/index`.
- `hdPa_Gj` `Counter.tsx` — exports `NumberCounter` (non-default). Used on `/case-studies` `(N)` count.
- `ibj8uxT` `WorldGridTest.tsx` — unrouted reference.
- `LNjgKO2` `ProfileTextRevealFix.tsx`
- `BF2H03E` `FooterCopyrightYear.tsx`
- `Z5xMt1E` `HomeGridPreview.tsx`
- `ezlLf_J` `HomeGridVariantPreviewStyles.tsx`
- `p7tSTaD` `TextEncryptionEffect.tsx`
- `O9WTdUJ` `Test.tsx` — sandbox/scratch component.

### Code Overrides

- `cXkdXam` `Copyright_year.tsx` (exports `AutoCopyrightStatement`)
- `WHpRmeH` `External.tsx` (exports `External`, `Noop`, `withExternal`, `withOverride`, `AutoCopyrightStatement`)
- `Cm9wqQM` `Copyright.tsx` (exports `AutoCopyrightStatement`)
- `zB2BDA4` `Weather.tsx`
- `saw3Q19` `Examples_1.tsx`

---

## 2. Current CMS State

The `All Projects` CMS collection (`yTHrQWMIY`) currently contains 15 real project records. It is user-managed, so MCP cannot add or change fields automatically.

| Sort | Project | Slug | Year | Disciplines | Industry | Home flag |
|---:|---|---|---|---|---|---|
| 1 | AirPods Pro 3 | `airpods-pro-3` | 2025 | Visual Identity, 2D Motion, 3D Motion | Consumer Electronics / Technology | true |
| 2 | Simon & Schuster | `simon-schuster` | 2025 | Brand Strategy, Visual Identity, UX/UI | Publishing | true |
| 3 | Gaia | `gaia` | 2026 | Brand Strategy, UX/UI, Product | Citizen Science / Biodiversity | true |
| 4 | National Park Playing Cards | `national-park-cards` | 2019-ongoing | Product, Packaging, Visual Identity | Outdoor Retail / Consumer Goods | true |
| 5 | Motion Connect 2025 | `motion-connect-2025` | 2025 | Visual Identity, 2D Motion, Editorial | Design Education / Motion Design | true |
| 6 | Yomo | `yomo` | 2025 | Visual Identity, UX/UI, Product | Food Tech / Health & Wellness | true |
| 7 | Karuna | `karuna` | 2025 | Visual Identity, Packaging, Product | Social Enterprise / Consumer Goods | false |
| 8 | Weaponized Innocence | `weaponized-innocence` | 2024 | Editorial, UX/UI, Visual Identity | Human Rights / Editorial | true |
| 9 | Wolff Olins x ArtCenter | `wolff-olins-x-artcenter` | 2024 | Visual Identity | Design Education / Brand Consulting | false |
| 10 | Aspen Valley Landscaping | `aspen-valley-landscaping` | 2024 | Visual Identity, Brand Strategy | Landscaping / Home Services | false |
| 11 | Cellular Symphony | `cellular-symphony` | 2024 | 3D Motion | Science Communication / Experimental Motion | false |
| 12 | Neon Lights | `neon-lights` | 2024 | 2D Motion | Music / Experimental Motion | false |
| 13 | John Steinbeck | `john-steinbeck` | 2023 | Editorial, Visual Identity | Literature / Publishing / Education | false |
| 14 | Seek Truth | `seek-truth` | 2024 | Editorial, Visual Identity | Politics / Protest | false |
| 15 | Independent Lens | `independent-lens` | 2024 | Editorial, Visual Identity | Film / Documentary / Public Media | false |

The `Journal` CMS collection (`SyZTxPxeY`) still exists, but there is no visible Journal page in the current project map.

### Thumbnail Stroke Toggle

The `All Projects` collection now includes a Boolean field:

- `OHdUYs6Mo` — Thumbnail Stroke

Current verified state (May 15, 2026): `AirPods Pro 3` (`airpods-pro-3`) is `true`; the other 14 projects are `false`.

The visual stroke is not a permanent border on the `Case Study` card component. It is applied by `CaseStudyThumbnailStrokeStyles.tsx` (`Z28JYvA`) so each project can be toggled independently in CMS. The component default and placed helper instances now use the Light Gray token `#979797` / `rgb(151, 151, 151)`. The helper instances are opacity-0 code components placed on:

- Home `/`: page `R6_F7xjGZ`, instance `VXt8C11M9`
- `/case-studies`: page `Rnw1WO1jS`, instance `AfVjNDU23`
- `/index`: page `u2LOaBT5q`, instance `szF9sZNWA`

Implementation notes:

- The helper imports the CMS module for `yTHrQWMIY`, calls Framer's lazy initializer (`module.r()`) when available, and rescans records after mount so Framer preview iframes do not keep stale CMS stroke state.
- Matching is by slug when real links resolve to `/case-studies/{slug}` and by title containment when Framer preview/canvas exposes unresolved links such as `/case-studies/:slug`.
- The stroke is rendered as a real absolutely positioned overlay child inside `ImageWrapper`, `VideoWrapper`, or `.idx-grid-card-media`; it does not affect layout dimensions. This replaced the first pseudo-element approach after Framer preview did not show the stroke reliably on Home.
- `/index` had an older `.idx-grid-card-media.with-stroke` path. The helper now neutralizes that box shadow and toggles the class from CMS so turning the Boolean off removes the stroke.
- The dynamic `/case-studies/:slug` template is intentionally not using this helper; a previous attempt to insert it there caused Framer layout normalization. Related/other-project cards should be handled separately if they need per-CMS strokes later.

---

## 3. `/index` Page — Current Layout

The `/index` page (`u2LOaBT5q`) is the most custom page on the site. Live structure:

```
Desktop (root, /Cream)
├── ImageMaskReveal (qf2vKr_sV) — enabled="false" (May 10, 2026); other settings unchanged. Disabled only on /index so the archive loads without a curtain reveal.
├── IndexRuleColorOverride (p8V73bUeR) — ruleColor="rgb(20, 20, 20)",
│   adjustCaseStudiesGrid="true" (no /case-studies grid lives on /index, but
│   the prop is enabled here too because the same instance template is used
│   site-wide; the rule-color half is what /index actually uses)
├── SectionHero (rvJ2mP8SJ) — height 48vh, 150px top padding, /Cream bg
│   └── Stack → HeadingRowWrapper → "INDEX" (inlineTextStyle="/Heading 1")
└── IndexPage instance (Gk2JQ93Ss) — componentId="rgAZFOv"
    Props on the live page:
    - useCMS = true
    - defaultView = "list"
    - listTypographyVariant = "standard"
    - listHoverVariant = "flip"
```

The `IndexPage` code component owns all of: taxonomy filters, list rows, grid cards, project count, and the fixed bottom-left List/Grid toggle. The `INDEX` heading is a native Framer text element above it, not part of the code component.

### `IndexPage.tsx` architecture (live Framer file)

The live code file is `rgAZFOv`. The repo copy at `IndexPage.tsx` is now **older** than Framer (the May 3 audit's "local newer than Framer" observation has flipped). Treat the Framer file as source of truth until someone re-syncs the repo.

Property controls exposed by the live component:

```ts
{
  useCMS: Boolean (default false)
  projects: Array<{ title, category1, category2, category3, industry,
                    year, thumbnail, thumbnailVideoLink, slug, sortOrder,
                    isHomepage }>
  defaultView: Enum ["list", "grid"] (default "list")
  listTypographyVariant: Enum ["standard", "mono13"] (segmented, default "standard")
  listHoverVariant: Enum ["flip", "highlight"] (segmented, default "flip")
}
```

Project data resolution priority (in `IndexPage`'s `allProjects` memo):

1. **Window-singleton registry** — when `useCMS` is on AND at least one item has been registered.
2. **`projects` prop** — manual array bound through Framer.
3. **`DEFAULT_PROJECTS`** — a 15-item snapshot baked into the code file.

The window-singleton registry is keyed `__articaIndexProjectsRegistry` and is intended to be populated by a separate `ProjectRegistrar` code component placed inside a Framer Collection List (per Framer's "code components inside CMS-bound collection items" pattern). **This Registrar component does not exist in the current project** — there is no `ProjectRegistrar.tsx` in the code components list. With `useCMS=true` and no Registrar wired up, the page falls through to the prop, then to `DEFAULT_PROJECTS`. The published `/index` is therefore being driven by the in-code snapshot, not by live CMS values.

### Drift between live `DEFAULT_PROJECTS` and the CMS

The 15-item `DEFAULT_PROJECTS` snapshot inside the Framer code uses **simplified industry labels** that do not match the CMS strings, e.g.:

| Project | DEFAULT_PROJECTS industry | CMS industry |
|---|---|---|
| AirPods Pro 3 | `Technology` | `Consumer Electronics / Technology` |
| Gaia | `Nature & Outdoors` | `Citizen Science / Biodiversity` |
| National Park Playing Cards | `Nature & Outdoors` (year `"2019"`) | `Outdoor Retail / Consumer Goods` (year `2019-ongoing`) |
| Motion Connect 2025 | `Design Education` | `Design Education / Motion Design` |
| Yomo | `Health & Wellness` | `Food Tech / Health & Wellness` |
| Karuna | `Nature & Outdoors` | `Social Enterprise / Consumer Goods` |
| Weaponized Innocence | `Human Rights` | `Human Rights / Editorial` |
| Cellular Symphony | `Science` | `Science Communication / Experimental Motion` |
| Neon Lights | `Music` | `Music / Experimental Motion` |
| John Steinbeck | `Literature` | `Literature / Publishing / Education` |
| Seek Truth | `Human Rights` | `Politics / Protest` |
| Independent Lens | `Human Rights` | `Film / Documentary / Public Media` |

The published `/index` therefore renders the short labels above. The Industry nav rendered live is: `Technology`, `Publishing`, `Nature & Outdoors`, `Design Education`, `Health & Wellness`, `Human Rights`, `Science`, `Music`, `Literature`. When the Registrar pattern is wired up (or a manual `projects` array is bound), the visible labels will switch to whatever those data sources expose — likely the longer CMS strings.

### Taxonomy and discipline normalization

The live code does **not** hardcode a canonical `DISCIPLINE_NAV_ITEMS` list. It also does not define a `DISCIPLINE_ALIASES` map. Instead:

- `getDisciplineNavItems(projects)` derives Discipline labels by walking `[category1, category2, category3]` for each project (de-duplicated, trimmed) in `sortOrder` order.
- `getIndustryNavItems(projects)` does the same for `industry`.
- `getYearNavItems(projects)` returns `number[]`, sorted descending. `normalizeYear` coerces the CMS string `"2019-ongoing"` to `2019` via a `(?:19|20)\d{2}` regex.
- `filterProjects(projects, filters, query)` accepts a search query, but the only call site passes `""` — search is plumbed but inert.

Whatever Discipline strings come out of the data source are displayed verbatim. There is no project-side enforcement of the eight-label canonical list documented earlier (`Visual Identity`, `Brand Strategy`, `UX/UI`, `2D Motion`, `3D Motion`, `Packaging`, `Product`, `Editorial`). If you want that lock back, it has to be reintroduced in code or guaranteed by the upstream data.

### Layout grid

- Outer `idx-container`: 100% width, `padding: 0 20px`, `min-height: 60vh`.
- Taxonomy uses `repeat(6, minmax(0, 1fr))`: Discipline label/items in cols 1/2, Industry label/items in cols 3/4, Year label/items in cols 5/6.
- Year-group wrapper uses the same 6-col grid: year rule spans `1 / -1`, year label sits in col 1, list content sits in `2 / span 5`.
- List rows inside list content use a **5-col** grid: title `1 / span 2`, discipline `3 / span 2`, industry `5 / span 1`. (Earlier docs called this 6-col; that was true at the wrapper level only.)
- Grid view (rewritten May 10, 2026) uses CSS Grid with `grid-template-columns: repeat(3, minmax(0, 1fr))`, 20px column gap, 56px row gap. Each card has a uniform 16:9 thumbnail and the title sits **above** the image with the same hover-flip used in List view ("View Project" on hover when slug exists). Optional thumbnail video mounts only on `:hover`.
- Mobile (≤809px): list rows collapse to a 2-col layout (title full row, discipline + industry side-by-side beneath); grid drops to a single column with 40px row gap. Tablet (≤1199px): grid drops to 2 columns. Below 520px, list rows and taxonomy columns fully stack to a single column.
- Bottom List/Grid toggle: `position: fixed`, `bottom: 20px`, `left: 20px`, 148px wide, `rgba(215, 213, 207, 0.72)` cream surface with `backdrop-filter: blur(8px)`. Active button bg `#EAE8E3`. Both labels stay ink (`#26211f`) — defensive `!important` rules in `GLOBAL_CSS` enforce this against Framer's button cascade. On mobile, the toggle moves to bottom-center.

### Grid view source

The Grid view renders project-driven cards as native HTML inline in `IndexPage.tsx`. There is **no external module dependency** — the previous import of `https://framer.com/m/Case-Study-G9lec1.js` was removed on May 10, 2026 because the responsive-image format being passed to that module didn't hydrate when called from a code component (thumbnails rendered blank on the published site).

`GridProjectCard` now renders:

```
<a class="idx-grid-card" href="/case-studies/{slug}">
  <div class="idx-grid-card-title"> <HoverFlipText text={title} activeText="View Project" /> </div>
  <div class="idx-grid-card-media">                                     // aspect-ratio: 16/9
    <img src={thumbnail} loading="lazy" />
    {hovered && videoSrc && <video muted loop autoPlay playsInline />}
  </div>
</a>
```

The native `Case Studies Filter` is still used on `/case-studies`, just not from inside `IndexPage`.

### `IndexRuleColorOverride` interaction

The override sets:

```css
html body .idx-rule,
html body .idx-row-divider {
  background-color: <ruleColor> !important;
}
```

`IndexPage` itself colors year rules with `tokens.dividerStrong` (`#26211f`) and intra-year row dividers with `tokens.dividerSubtle` (`#979797`). With the override active and `ruleColor="rgb(20, 20, 20)"`, **all rules unify to ink** on `/index`. If you remove the override, intra-year dividers revert to the lighter gray.

The same component instance is also placed on `/case-studies` to apply per-card aspect ratios from the source image dimensions; that DOM-mutation half is a no-op on `/index` because the queried `Section Case Study (Filter)` / `Grid View Wrapper` selectors don't exist there.

---

## 4. Home Visibility Nuance

The published Home page uses a CMS-backed selected-work query that:

- filters by `Is Homepage`
- orders by `Sorting Number`
- limits the result to 6 items

The current published Home set is:

1. AirPods Pro 3
2. Simon & Schuster
3. Gaia
4. National Park Playing Cards
5. Motion Connect 2025
6. Yomo

Karuna is currently off Home because its `Is Homepage` flag is `false`. Weaponized Innocence has `Is Homepage` set to `true`, but it is not visible in the published Home set because the query stops at the first 6 homepage-flagged records by sort order. The Home selected-work `VIEW ALL` CTA links to `/index`.

---

## 5. Route And Surface Watchpoints

- Home hero subline still has the spacing typo `Brand designer with a systems mind.Strategy, visual identity, motion.` — approved copy is `mind. Strategy, visual identity, motion.` (text node `xCug18g8f` on Home, page `R6_F7xjGZ`).
- National Park Playing Cards proof points are inconsistent across surfaces: CMS/copy docs still say 160 retail locations, while `/info` intro and recognition rows say 220+ stores. Verify the current number before launch copy cleanup.
- Navigation currently shows `Work`, `INDEX`, and `INFO`. Contact exists as `/contact` and through CTA/footer links, but it is not in the primary nav component.
- `/case-studies` still displays a `NumberCounter` ending at `endNumber=12`, even though the CMS has 15 records. The component is `NumberCounter` (named export from `Counter.tsx`, code file `hdPa_Gj`); on `/case-studies` it is configured `startNumber=1, endNumber=12, fontFamily="Switzer", fontSize=30, prefix="(", suffix=")"`. Update the `endNumber` prop to `15` (or wire it to a CMS-derived count) before launch.
- `Case Study Starter System` design page still contains a 12-project route map and does not include Motion Connect 2025, Seek Truth, or Independent Lens.
- `Year` is a CMS string field (`QZqSK_3OF`) and includes a non-numeric value, `2019-ongoing`. The live `IndexPage.tsx` coerces years to numbers via a `(?:19|20)\d{2}` regex, so `"2019-ongoing"` becomes `2019` for grouping/filtering.
- The repo's `IndexPage.tsx` still imports `Case-Studies-Filter-9lC3jo.js` and hardcodes `DISCIPLINE_NAV_ITEMS`, `DISCIPLINE_NAV_SET`, and the long-string `INDUSTRY_NAV_ITEMS` list. The live Framer file does none of those things. If you push the repo file back to Framer you will silently revert the `useCMS`/registry pattern and the dynamic taxonomy.

---

## 6. Live vs. repo divergence (May 15, 2026)

Two artifacts diverge from the repo and it matters which way the next sync goes:

- **Live Framer `IndexPage.tsx` (`rgAZFOv`)** — has `useCMS` prop, window-singleton registry pattern, dynamically derived taxonomy, no `Case Study` module import, native-HTML Grid view (uniform 16:9 cards, 3/2/1 columns, title above image with hover-flip, video on hover), simplified `DEFAULT_PROJECTS` industry labels. This is what's saved in Framer (next Publish brings it live).
- **Live Framer `CaseStudyThumbnailStrokeStyles.tsx` (`Z28JYvA`)** — exists only in Framer and controls CMS thumbnail strokes across Home, `/case-studies`, and `/index`. The repo has documentation and verification artifacts, but not a local source copy of this code component.
- **Repo `IndexPage.tsx`** — older shape with hardcoded `DISCIPLINE_NAV_ITEMS`/`INDUSTRY_NAV_ITEMS`, `Case Studies Filter` import for unfiltered Grid fallback, no `useCMS` prop, weighted Grid row patterns. Do not push this back without merging the live changes in.

To resolve: pull the live code out of Framer (or use this doc's snapshot of the architecture) and reconcile before any further repo-side edits.

---

## 7. CMS Field Map

Core fields:

- `oeXZcmPna` — Title
- `DLBifmgp1` — Sorting Number
- `kuvJcmOFr` — Category 1
- `VV1CggU2J` — Category 2
- `E6OpH0hSs` — Category 3
- `VeDm9FjW4` — About the project
- `Jy7hBJady` — Thumbnail
- `WG62tRjG8` — Thumbnail Video Link
- `OHdUYs6Mo` — Thumbnail Stroke
- `vlN2R_qnF` — Client
- `QZqSK_3OF` — Year (string)
- `mBIilFqVM` — Industry
- `myUIfK0j7` — Is Homepage

Extended case-study fields:

- `tzVexbjWp` — Creative Director
- `Chguu3lHj` — Art Director
- `HY1X73dpT` — Designers
- `U0gx1yKeB` — Makeup
- `QF3AEVk8r` — Image 1
- `xOL69akmU` — CMS Video 1
- `FwLb0MrAN` — CMS Video Poster 1
- `fsFlSPDTa` — Image 2
- `xpyes5aGJ` — CMS Video 2
- `Y9u0naHRi` — CMS Video Poster 2
- `rm5GqyLak` — Image 3
- `rB64YNSUs` — Image 4
- `lUT9kBBwP` — Image 5
- `X4mkKflln` — Next Project 1
- `z_tutvcUx` — Next Project 2
- `OoXOWcQvg` — Next Project 3
- `vqPrQQLOM` — Content

Recommended manual additions remain:

- `Case Study URL` as a Link field
- `Build Status` as an enum field

Do not repurpose existing field IDs to create those fields.
