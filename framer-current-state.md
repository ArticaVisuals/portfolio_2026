# Framer Current State Audit

**Project:** Micah Hoang Portfolio 2026
**Last audited:** May 20, 2026 (deep framework audit — see §8; `/play` polish notes added same day)
**Published URL:** `https://khaki-ship-257706.framer.app`
**Latest observed deploy:** May 18, 2026 (published `/index` breakpoint promotion; Framer reported No Changes after publish)

This file is the quick source of truth for the current Framer document state. Read this before editing the older strategy, copy, CMS, or code-component docs — they are kept reasonably current but this file leads.

**Maintenance strategy (confirmed 2026-05-20):** every published project gets its own bespoke `/case-studies/{slug}` page. Only the header/metadata block is CMS-bound (Title, Disciplines, Industry, Year, Client). Everything below the header is hand-designed per project. The dynamic `/case-studies/:slug` template stays in place as a working fallback but is not the primary delivery surface.

---

## 1. Current Framer Structure

### Web Pages

- `/` — Home, page ID `R6_F7xjGZ`
- `/404` — 404, page ID `koPvme2ig`
- `/case-studies` — Native case-study index with `NumberCounter` and `Case Studies Filter`, page ID `Rnw1WO1jS`
- `/case-studies/:slug` — Dynamic case-study detail route (CMS-bound, kept as fallback only), page ID `UlQco8cYi`
- `/info` — Profile/info page, page ID `fxz_zRIyp`
- `/contact` — Contact page, page ID `gmXtVnIzJ`
- `/index` — Archive page with the original-template inline `GRID / LIST` toggle, page ID `u2LOaBT5q`
- `/play` — Archive media playground (renamed from `/playground` since the prior audit), page ID `KbgWr_0BN`
- `/play-2` — Draft optimized playground v2 test page, page ID `xzxF41ECb`. Desktop uses `PlaygroundPageV2.tsx`; Tablet/Phone are replica breakpoints and rejected direct MCP child insertion.
- `/playground-scroll-draft` — Draft alternate playground using a marketplace `ScrollGallery` component, page ID `GU8t_uC2U`. Not promoted; not in the production nav.
- `/case-studies/airpods` — AirPods Pro 3 bespoke detail page, page ID `LB7pYBD3k`. This is the active pilot for the bespoke-per-project model (the doc previously described this slot as Gaia; AirPods replaced it).

The earlier duplicate `/index` page (`yKKOMVNs6`, "Mono 13" default) **has been deleted**. The temporary `/index-inline-toggle-test` A/B route (`VdRy9MV8k`) is also gone; the preferred inline-toggle version has been promoted into canonical `/index`. There is no current web page for `/profile` or `/worldgrid-test`. `/info` is the live profile route. `WorldGridTest.tsx` still exists as a code file (`ibj8uxT`) but is unrouted.

### Design Pages

- `Design`, design page ID `NLQmOR3If`
- `Case Study Starter System`, design page ID `qDjep9bZD`

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

- `rgAZFOv` `IndexPage.tsx` — drives `/index`. As of May 19, 2026, it owns the inline uppercase `GRID / LIST` toggle and normalizes archive rules/dividers to the full-opacity site rule color `#233324`; the repo mirror has been resynced to the live Framer source.
- `VwMoFWv` `IndexPageBreakpointsDraft.tsx` — hidden `/index` style helper (`ATfvwee86`) for the official responsive breakpoint promotion. It also applies the style-only `GRID / LIST` refinement: matching `CLEAR FILTERS` typography/color, keeping a stable 12px/28px/24px action-row rhythm, and nudging only the toggle upward when a filter is active. It does not move DOM nodes or touch filter behavior.
- `tqQjSoH` `IndexRuleColorOverride.tsx` — legacy rule/aspect-ratio helper. Its default rule color is now the site rule color `#233324` and it forces rule opacity to 1; when `adjustCaseStudiesGrid="true"`, it can also run a layout pass on `/case-studies` cards to apply the source image aspect ratio to each card.
- `poRGCf7` `ImageMaskReveal.tsx` — site-wide scroll reveal, instance present on every page.
- `Z28JYvA` `CaseStudyThumbnailStrokeStyles.tsx` — CMS-driven thumbnail-stroke helper. Reads `All Projects` field `OHdUYs6Mo` and applies a non-layout 1px Light Gray overlay stroke to matching project thumbnails on Home, `/case-studies`, `/index`, and Framer canvas/editor card renders.
- `QNpkYp5` `ArchivePlayground.tsx` — archive-backed draggable media playground placed on `/play` (`Vm_TSe0rX`). Uses original Cargo `/t/original/` image/GIF URLs and video poster/original video pairs scraped from `https://micahhoang.info/archive`.
- `RBX6jsP` `PlaygroundNavPassthrough.tsx` — invisible `/play` helper (`NPcuvJ4mA`) that lets pointer movement pass through the nav/header shell while preserving clicks on actual nav links/buttons; it also keeps the archive grid drifting while the detail sidebar is open, normalizes sidebar media to natural full-width sizing, and owns archive media gray-stroke controls. Current `/play` setting is `Gray Stroke = Auto` with `strokeWidth=0.5`.
- `vdg69JZ` `PlaygroundRuleExitGuard.tsx` — invisible `/play` helper (`sQ55vcG1S`) that preserves the sidebar detail rule inside the close-exit snapshot so the typography spacing stays stable while the panel slides away.
- `c2PU6kX` `PlaygroundInstantExitSnapshot.tsx` — invisible `/play` helper (`VrJ1jUew6`) that snapshots the sidebar content immediately on outside click, close-button click, or Escape so the panel never slides out as an empty cream frame.
- `R3ZWYKl` `PlaygroundSidebarColumnGuard.tsx` — invisible `/play` helper (`CzORbuWUR`) that enforces non-overlapping sidebar title/description columns, wraps long unbroken titles inside the title column, and stacks the metadata below narrow panel widths.
- `qKgyy0t` `PlaygroundPageV2.tsx` — optimized draft playground placed on `/play-2` (`My7p7oQST`). Uses the same archive Cargo media as built-in defaults, moves the tiled gallery with DOM `requestAnimationFrame` transforms instead of per-frame React state, keeps media `object-fit: contain`, and uses `AnimatePresence` so detail content remains mounted through close without the helper snapshot/observer path.
- `hdPa_Gj` `Counter.tsx` — exports `NumberCounter` (non-default). Used on `/case-studies` `(N)` count. Currently `endNumber=12` on the live page; CMS has 15 records.
- `ibj8uxT` `WorldGridTest.tsx` — unrouted reference; orphaned. Its `DEFAULT_ITEMS` array references placeholder projects (`Vern Carter`, `Iris Wade`, `Orion Ventures`, `Echoes`, `Iconic`, `Adapting Literature`) that do not exist in CMS.
- `LNjgKO2` `ProfileTextRevealFix.tsx` — placed on `/info` to mask-reveal selected text layers.
- `BF2H03E` `FooterCopyrightYear.tsx` — small `©YYYY` helper that resolves the current year. Used inside the `Footer` component (`xxIb0BkhJ`).
- `Z5xMt1E` `HomeGridPreview.tsx` — review-only "Even vs. Mosaic" Home grid explorer. Orphaned (no live instance).
- `ezlLf_J` `HomeGridVariantPreviewStyles.tsx` — companion CSS helper for the explorer above. Orphaned.
- `p7tSTaD` `TextEncryptionEffect.tsx` — text-scramble effect carried over from the original template; used for the Home `LINKEDIN / RESUMÉ / COSMOS` social labels.
- `xDqfenf` `ResumeAssetHost.tsx` — invisible utility component that rewires any `RESUME` link to a Framer-hosted PDF. Currently orphaned (no live instance); the live RESUMÉ link on Home is a plain Framer link, not via this helper.
- `GTEGUfN` `RelatedProjectHoverZoom.tsx` — scoped hover-zoom for related-project cards inside `NextProjectWrapper`. Placed on `/case-studies/airpods` (`wwubqAWHG`).
- `CS95xv7` `Playground.tsx` — original playground implementation, superseded by `ArchivePlayground.tsx` on `/play`. Orphaned.
- `O9WTdUJ` `Test.tsx` — file name is misleading; its default export is **`ProjectRegistrar`**, the CMS-to-`IndexPage` bridge component. **Re-wired 2026-05-20:** an instance is now placed inside a hidden `CMS Link` wrapper bound to `All Projects` on `/index`, populating the registry that `IndexPage` reads.

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

Current verified state (May 19, 2026): `AirPods Pro 3` (`airpods-pro-3`) is `true`; the other 14 projects are `false`.

The visual stroke is not driven by `Case Study` variants. It is applied by `CaseStudyThumbnailStrokeStyles.tsx` (`Z28JYvA`) so each project can be toggled independently in CMS. The helper instances are opacity-0 code components placed on:

- Home `/`: page `R6_F7xjGZ`, instance `VXt8C11M9`
- `/case-studies`: page `Rnw1WO1jS`, instance `AfVjNDU23`
- `/index`: page `u2LOaBT5q`, instance `szF9sZNWA`

Implementation notes:

- The helper now has no `strokeVariants` / `allSelectedWorks` mode and no project allowlist. Stroke status comes only from CMS field `OHdUYs6Mo`; `strokeWidth` and `strokeColor` control appearance only.
- The helper imports the CMS module for `yTHrQWMIY`, calls Framer's lazy initializer (`module.r()`) when available, and rescans records after mount so Framer preview/canvas iframes do not keep stale CMS stroke state.
- Matching is by slug when real links resolve to `/case-studies/{slug}` and by title containment when Framer preview/canvas exposes unresolved links such as `/case-studies/:slug`.
- As of May 19, 2026, `Case Study > Card > ImageWrapper` includes a real Light Gray overlay frame (`sKJdcQrXY`) at opacity 0. The helper toggles that real Framer layer when available so stroke status is visible in Framer canvas/editor, and falls back to creating a DOM overlay for custom HTML cards such as `/index`. The overlay does not affect layout dimensions.
- `/index` no longer has the older hardcoded `.idx-grid-card-media.with-stroke` path; the helper applies the overlay directly from the CMS Boolean.
- The old Framer `Case Study` component stroke variants (`CardStroke` / `CardStrokeHover`, node IDs `JO57Rf2Tb` / `CLK6SxWxs`) were deleted on May 16, 2026. The remaining variants are `Card` and `CardHover`; CMS is the only source of thumbnail-stroke state.
- The dynamic `/case-studies/:slug` template still does not use the CMS Boolean helper for related cards.

---

## 3. `/index` Page — Current Layout

The `/index` page (`u2LOaBT5q`) is the most custom page on the site. Live structure:

```
Desktop (root, /Cream)
├── CaseStudyThumbnailStrokeStyles (szF9sZNWA) — CMS field `Thumbnail Stroke`
├── SectionHero (rvJ2mP8SJ) — height 48vh, 150px top padding, /Cream bg
│   └── Stack → HeadingRowWrapper → "INDEX" (inlineTextStyle="/Heading 1")
└── IndexPage instance (rStOhD3Ex) — componentId="rgAZFOv"
    Props on the live page:
    - useCMS = true
    - defaultView = "list"
    - listTypographyVariant = "standard"
    - listHoverVariant = "flip"
```

The `IndexPage` code component owns taxonomy filters, list rows, grid cards, project count, view state, the inline `GRID / LIST` control, and the `#233324` rule/divider styling. The older `IndexInlineToggleProxy.tsx` helper and its `/index` instance (`HM1pZPonP`) were removed after this behavior was folded into `IndexPage`. The `INDEX` heading is a native Framer text element above it, not part of the code component.

### `IndexPage.tsx` architecture (live Framer file)

The live code file is `rgAZFOv`. The repo copy at `IndexPage.tsx` was resynced from Framer on May 16, 2026 after the inline toggle and rule styling were folded in.

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

The window-singleton registry is keyed `__articaIndexProjectsRegistry` and is populated by a `ProjectRegistrar` code component placed inside a Framer Collection List bound to the `All Projects` CMS. The `ProjectRegistrar` source is the default export of `Test.tsx` (codeFileId `O9WTdUJ`), kept under the misleading template filename. **Status as of 2026-05-20:** the bridge has been re-wired. The `/index` Desktop variant now has a hidden `CMS Link` wrapper bound to `All Projects` (`yTHrQWMIY`) with a `ProjectRegistrar` instance inside its template card; the 12 registrar props are bound to the corresponding CMS fields. With this in place, `/index` reads project metadata from CMS at render time rather than from the in-code `DEFAULT_PROJECTS` snapshot. `DEFAULT_PROJECTS` is retained as a fallback for canvas previews and the case where Framer cannot iterate the Collection (for example, if it's set to Draft). Adding a new project to the `All Projects` CMS now propagates to `/index` automatically on next publish — no code edit required.

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
- Mobile/tablet breakpoint promotion (published May 18, 2026; type adjusted May 19): list rows keep the desktop 22px Standard year/title type at ≤1199px, hide Discipline metadata, and keep Industry visible/right-aligned with wrapping instead of ellipsizing. The taxonomy/index nav stays in the desktop 6-column format through 900px and switches to the SearchSystem-style label/value rows at ≤899px. Tablet/nav row gap is 28px; phone row gap is 26px.
- Visible Grid/List toggle on canonical `/index`: `IndexPage.tsx` renders uppercase `GRID / LIST` after the taxonomy nav. `CLEAR FILTERS` remains the original left-aligned button inside `TaxonomySection`; the hidden `IndexPageBreakpointsDraft.tsx` helper only styles the toggle to match that action (13px uppercase mono, 28px line-height, weight 400, secondary `#636363`, active underline). The action row reserves 12px above and 24px below; when filters are active, only `GRID / LIST` gets a `-28px` top offset so selecting/deselecting filters does not shift the content below. There is no fixed/floating or DOM-mutating delegated toggle on the page now.

### `/index` responsive breakpoint promotion

On May 18, 2026, the breakpoint draft was promoted to canonical `/index` (`u2LOaBT5q`) and published. The live `/index` page now includes a hidden `IndexPageBreakpointsDraft.tsx` style instance (`ATfvwee86`, code file `VwMoFWv`) after the `IndexPage` instance, making the draft behavior the official published route. The old `/index-breakpoints-draft` page (`lJsyxVMvO`) remains a Framer draft and returns 404 on the published staging URL.

Current official `/index` behavior:

- ≤1199px: Standard year/title typography stays at desktop size (22px/1.2 with 27px flip height); Discipline metadata is hidden; list rows become a title + Industry two-column row; category/tag metadata does not truncate.
- Industry metadata stays visible on tablet/mobile and can wrap instead of ellipsizing. It remains right-aligned and constrained with responsive max-widths (`180px`/`150px`/`132px` caps by breakpoint).
- ≤899px taxonomy: SearchSystem-style label/value rows, with the label column on the left and values on the right. Discipline, Industry, and Year stack vertically with a 28px row gap.
- ≤809px taxonomy refines to `minmax(96px, 28%) minmax(0, 1fr)` with 18px column gap and 28px row gap.
- ≤520px taxonomy uses `minmax(84px, 32%) minmax(0, 1fr)`, 16px column gap, 26px row gap, and 14px page padding.
- The promoted behavior references Phantom's list-view behavior for the tablet/mobile list: Discipline/category metadata disappears rather than truncating, Industry stays visible, and mobile metadata closes in without overlapping.
- Published verification on May 18 checked `/index` at 1200, 1024, 900, 810, and 390px widths: no horizontal overflow, no taxonomy overlaps, and no list-cell overlaps. `/index-breakpoints-draft` and `/playground` remained unpublished drafts (404 on staging).

### `/play` archive media pass

On May 19, 2026, `/play` (`KbgWr_0BN`) was updated from the previous placeholder `Playground.tsx` instance to `ArchivePlayground.tsx` (`QNpkYp5`) on the Desktop breakpoint. The archive scraper stored 33 original-resolution items from `https://micahhoang.info/archive` in `case-study-assets/current-site/archive/` with `manifest.json`, including 24 images, 7 videos, 2 GIFs, and 7 video poster frames. Framer uses Cargo URLs directly; local downloads are kept as verification/staging copies. `ArchivePlayground.tsx` is now a self-contained archive-backed version of the original Playground interaction: it preserves the drag/parallax/inertia/edge-scroll feel, detail panel, close-button flip interaction, and footer-hider while rendering archive media inside equal square cells with `object-fit: contain` so uploads are not cropped. Grid images request lighter Cargo width variants for smoothness, GIFs use the original animated source, and videos autoplay as muted loops with no visible controls in both thumbnail and detail states. The placed instance `Vm_TSe0rX` uses the same motion values as the prior `/playground` component instance (`driftSpeedX/Y=0.5`, `throwFriction=0.85`, `throwVelocityScale=1.75`, `throwMinSpeed=220`, `throwMaxSpeed=5200`, `parallaxEase=0.5`, `arcEnabled=false`) and has `advancedControls=true` again. The component also listens to global capture-phase pointer movement for visual tracking, so hovering actual nav links does not make the background ease back to neutral. A 1px invisible `PlaygroundNavPassthrough` instance (`NPcuvJ4mA`) is also on Desktop to apply page-scoped CSS: nav/header wrappers use `pointer-events: none`, while anchors, buttons, Framer `LogoLink`, and Framer `TextLink` descendants remain clickable. That helper keeps the grid wrapper drifting at the same `0.5 / 0.5` rate while the detail sidebar is open, then preserves the accumulated offset when the sidebar closes so the background does not snap. It also sets detail/sidebar media frames to transparent, full-width natural aspect ratios based on loaded image/video dimensions, so gray letterbox borders disappear and the text below is pushed naturally by the media height. The helper hides the archive media category label in the sidebar and inserts the same `#233324` left-origin scaleX rule animation used by the index/home rule treatment between the media content and typography; the rule is now recreated only while the detail sidebar is open so it redraws after a media click, and its bottom margin is half the previous value to pull typography closer.

May 20, 2026 `/play` polish: `PlaygroundNavPassthrough` (`NPcuvJ4mA`) is back to `Gray Stroke = Auto` with `strokeWidth=0.5`, applying half-pixel gray strokes only to grid thumbnails and sidebar media whose sampled media/poster edges need contrast against the cream/white background. The overlay is positioned on the actual rendered `object-fit: contain` media bounds, not the surrounding square cell, and stroked media is clipped to those same bounds so hover zoom cannot spill outside the stroke. Two additional invisible helpers were added on Desktop: `PlaygroundInstantExitSnapshot.tsx` (`c2PU6kX`, instance `VrJ1jUew6`) snapshots sidebar content immediately on outside click, close-button click, or Escape so the closing panel does not flash to an empty cream frame; `PlaygroundSidebarColumnGuard.tsx` (`R3ZWYKl`, instance `CzORbuWUR`) enforces `minmax(0, ...)` title/description columns, wraps long unbroken titles such as `HMCTEmailBlast`, and stacks the metadata below `430px` panel width. Tablet and Phone breakpoints are replica nodes and rejected direct MCP child insertion, so they still need a Framer-canvas responsive pass if `/play` is expanded beyond the current Desktop implementation.

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
  border-color: <ruleColor> !important;
  opacity: 1 !important;
}
```

`IndexPage` itself colors year rules with `tokens.dividerStrong` and intra-year row dividers with `tokens.dividerSubtle`; both are now the site rule color `#233324`. The component also normalizes `.idx-rule` / `.idx-row-divider` to full opacity in its own CSS, so `/index` does not depend on the older rule override or the removed inline-toggle proxy.

An earlier note said this component was also placed on `/case-studies` to apply per-card aspect ratios. As of 2026-05-20, the `/case-studies` page XML contains no `IndexRuleColorOverride` instance — so the helper is currently orphaned (no live placement anywhere).

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
- The repo's `IndexPage.tsx` has been resynced with the live Framer file after the May 16 cleanup. Continue to read the live Framer file before pushing code back, because Framer may still drift ahead during canvas edits.

---

## 6. Live vs. repo sync notes (May 19, 2026)

Important sync points:

- **Live Framer `IndexPage.tsx` (`rgAZFOv`)** — has `useCMS` prop, window-singleton registry pattern, dynamically derived taxonomy, no `Case Study` module import, native-HTML Grid view (uniform 16:9 cards, 3/2/1 columns, title above image with hover-flip, video on hover), simplified `DEFAULT_PROJECTS` industry labels. Canonical `/index` also includes the hidden `IndexPageBreakpointsDraft` style helper (`ATfvwee86`) to apply the May 18 responsive breakpoint promotion on the published route.
- **Live Framer `CaseStudyThumbnailStrokeStyles.tsx` (`Z28JYvA`)** — controls CMS thumbnail strokes across Home, `/case-studies`, `/index`, and Framer canvas/editor. The repo now includes a local mirror at `CaseStudyThumbnailStrokeStyles.tsx`; resync from Framer before editing if the live file changes again.
- **Repo `IndexPage.tsx`** — mirrors the live `/index` code path after the May 16 cleanup, while Framer also has `IndexPageBreakpointsDraft.tsx` (`VwMoFWv`) as a hidden style helper on `/index` for the May 18 breakpoint promotion.

Before any future code-file push to Framer, read the live code file first and reconcile against the local mirror.

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

---

## 8. Framework audit findings (2026-05-20)

Full deep walk of every page (XML) and every code component (source). Goal was to identify maintenance debt without proposing functional or visual changes.

### 8.1 Code component placement matrix

Verified by reading each page's primary-variant XML on 2026-05-20.

| Code component | codeFileId | Where it lives | State |
|---|---|---|---|
| `IndexPage.tsx` | `rgAZFOv` | `/index` | Active |
| `IndexPageBreakpointsDraft.tsx` | `VwMoFWv` | `/index` | Active |
| `CaseStudyThumbnailStrokeStyles.tsx` | `Z28JYvA` | Home, `/case-studies`, `/index` | Active |
| `ImageMaskReveal.tsx` | `poRGCf7` | **No placement** | Stub-archived 2026-05-20 — see §8.4 (removed at user request across Home, `/case-studies`, `/contact`) |
| `ArchivePlayground.tsx` | `QNpkYp5` | `/play` | Active |
| `PlaygroundNavPassthrough.tsx` | `RBX6jsP` | `/play` | Active |
| `PlaygroundRuleExitGuard.tsx` | `vdg69JZ` | `/play` | Active |
| `PlaygroundInstantExitSnapshot.tsx` | `c2PU6kX` | `/play` | Active — same-frame sidebar exit snapshot to prevent empty-panel flash while closing |
| `PlaygroundSidebarColumnGuard.tsx` | `R3ZWYKl` | `/play` | Active — prevents sidebar title/description overlap and wraps long titles inside their column |
| `PlaygroundPageV2.tsx` | `qKgyy0t` | `/play-2` Desktop | Draft performance test |
| `RelatedProjectHoverZoom.tsx` | `GTEGUfN` | `/case-studies/airpods` | Active (pilot) |
| `Counter.tsx` (`NumberCounter`) | `hdPa_Gj` | `/case-studies` (`endNumber=12`, stale) | Active but stale |
| `TextEncryptionEffect.tsx` | `p7tSTaD` | Home (3 instances: LinkedIn, Resumé, Cosmos) | Active |
| `ProfileTextRevealFix.tsx` | `LNjgKO2` | `/info` | Active |
| `FooterCopyrightYear.tsx` | `BF2H03E` | Inside `Footer` component (`xxIb0BkhJ`) | Active |
| `Test.tsx` (`ProjectRegistrar`) | `O9WTdUJ` | `/index` (inside hidden `CMS Link` wrapper bound to `All Projects`) | **Re-wired 2026-05-20** — CMS bridge is now active; `/index` reads project data from CMS rather than the in-code `DEFAULT_PROJECTS` snapshot |
| `PlaygroundPageV2.tsx` | `qKgyy0t` | `/play-2` (`My7p7oQST`) | **Active draft.** Performance rewrite of ArchivePlayground using rAF + refs and `AnimatePresence`. Maintenance concern: carries its own copy of the 33-item archive media array (identical to `ArchivePlayground.RAW_ITEMS`) — adding media means editing both files. Exposes `items` as a property control. |
| `PlaygroundRuleExitGuard.tsx` | `vdg69JZ` | `/play` (`sQ55vcG1S`) | **Active.** Keeps sidebar detail-divider mounted in the panel-close snapshot. Monkey-patches `Element.prototype.remove` (restored on unmount). |
| `IndexRuleColorOverride.tsx` | `tqQjSoH` | **No placement** | Stub-archived 2026-05-20 — see §8.4 |
| `ResumeAssetHost.tsx` | `xDqfenf` | **No placement** | Stub-archived 2026-05-20 — see §8.4 |
| `Playground.tsx` | `CS95xv7` | **No placement** | Stub-archived 2026-05-20 — see §8.4 (superseded by `ArchivePlayground`) |
| `WorldGridTest.tsx` | `ibj8uxT` | **No placement** | Stub-archived 2026-05-20 — see §8.4 |
| `HomeGridPreview.tsx` | `Z5xMt1E` | **No placement** | Stub-archived 2026-05-20 — see §8.4 (review-only) |
| `HomeGridVariantPreviewStyles.tsx` | `ezlLf_J` | **No placement** | Stub-archived 2026-05-20 — see §8.4 (review-only) |

The 5 Code Overrides (`Examples_1.tsx`, `Weather.tsx`, `Copyright_year.tsx`, `External.tsx`, `Copyright.tsx`) all appear to be remnants of the original Framer template (Mono 13 / Cargo theme). All 5 were stub-archived 2026-05-20 with no-op pass-through bodies and ARCHIVED banners — see §8.4.

### 8.2 Recommended cleanup waves

**Wave A — orphan stub-archive (shipped 2026-05-20).** 6 orphan code components + 5 Code Overrides converted to ARCHIVED no-op stubs. See §8.4.

**Wave B — `/index` CMS bridge (shipped 2026-05-20).** Re-wired the hidden Collection List on `/index` bound to `All Projects` with `ProjectRegistrar` inside the template card. `/index` now sources project data from CMS rather than in-code snapshot. Adding new project = add CMS row + publish.

**Wave C — small hardening.**

Shipped 2026-05-20:
- ✅ Color hex literals in `IndexPage.tsx`, `ArchivePlayground.tsx`, and `PlaygroundNavPassthrough.tsx` are now `ControlType.Color` property controls with the original hex as `defaultValue`. The new props are visible in Framer's property panel and can be bound to project color styles (`/Cream`, `/Forest Green`, etc.) so brand-color tweaks cascade without code edits.
- ✅ GT Standard licensed Regular fonts replaced Trial in `FooterCopyrightYear.tsx`, `IndexPageBreakpointsDraft.tsx`, and `Test.tsx` (ProjectRegistrar canvas badge). Each `fontFamily` chain leads with the licensed `GT Standard Mono` / `GT Standard`, then falls back to `Trial`, then system mono. User only purchased Regular weight; `IndexPage.tsx` and `ArchivePlayground.tsx` were intentionally left on `'GT Standard Trial'` because their inline styles reference `fontWeight: 500` (Medium) — swapping the family would force a faux-bold synthesis on Medium-weight text.
- ✅ ScrollMore component's two `↓` arrow nodes (`DZ5DcIK9N`, `BnvBsgWfa`) swapped from `GF;Azeret Mono-regular` to `inlineTextStyle="/Body - 100%"` so the arrow now renders in GT Standard Mono Regular (consistent with surrounding "scroll to view more" text). Cascades automatically to both ScrollMore instances on Home (`BgaGMMs_k`) and `/info` (`a3ZTPNPEH`).

Still open (defer until ready for visible change OR manual UI fix):
- `NumberCounter` `endNumber` on `/case-studies` is `12`; CMS has 15. Visible fix; needs the user's go-ahead since it changes the rendered `(12)` to `(15)`.
- ~~Decide whether `ImageMaskReveal` is site-wide or `/contact`-only; remove the inactive Home / `/case-studies` instances if the latter.~~ Resolved 2026-05-20 — user removed it everywhere; instances deleted, source stub-archived.
- Consolidate the duplicate `/Heading 2` text-style definitions (two entries with the same path, different `transform`). Requires Framer's Text Styles panel — no MCP path.
- 3 text styles still point at Trial Regular fonts (`/Heading 3`, `/Index Title`, `/Heading 5`). `manageTextStyle` over MCP rejects the licensed `CUSTOMV2;GT Standard L Regular` / `CUSTOMV2;GT Standard Mono Regular` selectors with "Font with selector not found" — the validator only indexes built-in Framer fonts (Google/Fontshare), not project-uploaded customs. Must be swapped manually in Framer's Text Styles panel.
- `ArchivePlayground.tsx` still has a 33-item `RAW_ITEMS` constant; `PlaygroundNavPassthrough.tsx` has 12-item `AUTO_STROKE_MATCHERS`. Move to JSON assets or a CMS collection once playground content grows.

### 8.3 Verified contradictions resolved

The pre-audit version of this doc said several things that the live state contradicts. All of these are now corrected in the sections above:
- `Test.tsx` was described as "sandbox/scratch"; it is actually the `ProjectRegistrar` source.
- `/playground` was listed; the current page is `/play` (renamed).
- `LB7pYBD3k` was described as the Gaia pilot; it is now `/case-studies/airpods`, the AirPods pilot.
- `/playground-scroll-draft`, `ResumeAssetHost.tsx`, and `RelatedProjectHoverZoom.tsx` were missing from the inventory entirely.
- `IndexRuleColorOverride` was described as placed on `/case-studies`; the live page XML does not include it.

Re-audit recommended after any major page-structure change.

### 8.4 Stub-archived files (2026-05-20)

Framer has no native concept of archived/recycled code files, so the 6 orphaned code components and 5 unreferenced Code Overrides identified in this audit were **stub-archived in place**: their source was replaced with a clear `ARCHIVED 2026-05-20 (framework audit)` banner comment plus a minimal no-op body. The files remain in the project so that:

1. Anyone (or any future AI agent) reading the file sees ARCHIVED immediately and won't trust it as useful
2. If a layer or another file unexpectedly references one of them, it falls through to a no-op rather than erroring
3. The original source can be recovered from Framer's version history if ever needed

Stub-archived code components (8 — 6 original orphans + `PlaygroundPageV2.tsx` after `/play-2` removal + `ImageMaskReveal.tsx` after instance removal):
- `Playground.tsx` (`CS95xv7`)
- `WorldGridTest.tsx` (`ibj8uxT`)
- `HomeGridPreview.tsx` (`Z5xMt1E`)
- `HomeGridVariantPreviewStyles.tsx` (`ezlLf_J`)
- `IndexRuleColorOverride.tsx` (`tqQjSoH`)
- `ResumeAssetHost.tsx` (`xDqfenf`)
- `PlaygroundPageV2.tsx` (`qKgyy0t`)
- `ImageMaskReveal.tsx` (`poRGCf7`)

Stub-archived Code Overrides (5) — exports preserved as no-op pass-throughs in case any layer references them:
- `Examples_1.tsx` (`saw3Q19`)
- `Weather.tsx` (`zB2BDA4`)
- `Copyright_year.tsx` (`cXkdXam`)
- `External.tsx` (`WHpRmeH`)
- `Copyright.tsx` (`Cm9wqQM`)

To fully delete any of these later, just delete the file from Framer's code panel — by then it'll be obvious nothing is wired up.

**Critical syntactic constraint for archived Code Overrides** (learned 2026-05-20 when stub-archive triggered a publish error): Framer's static analyzer only registers a function as an override when the inner-component body uses an **explicit `return` block**, not a single-expression arrow. This works:

```ts
export function withRotate(Component): ComponentType {
    return (props) => {
        return <Component {...props} />
    }
}
```

This **does not** (`exports: []` and "Code Override Missing" at publish):

```ts
export function withRotate(Component): ComponentType {
    return (props) => <Component {...props} />
}
```

Any future override stub must use the explicit-block form so Framer's analyzer registers it.

**Special case: `ResumeAssetHost.tsx`.** Initially stub-archived with a zero-prop signature, which triggered "Footer Missing" at publish because the Footer component (`xxIb0BkhJ`) instance (`qqMNYKIQ0`) had `resumeFile` and `style` props bound. Re-archived 2026-05-20 with the original `ResumeAssetHostProps` shape and `addPropertyControls` preserved — the side effect (`wireResumeLinks`) is gone, but the prop signature matches so the Footer resolves at publish.

### 8.5 New post-audit additions

The following files appeared after the initial 2026-05-20 audit was written. They are active, in use on production pages, and have been folded into the §8.1 placement matrix above.

- `PlaygroundPageV2.tsx` (`qKgyy0t`) — placed on `/play-2`. Performance-optimized draft of the playground using `requestAnimationFrame` + DOM transforms and `AnimatePresence`. Carries its own copy of the 33-item archive media array, which duplicates `ArchivePlayground.RAW_ITEMS`. Consolidation candidate once `/play-2` either replaces `/play` or is removed.
- `PlaygroundRuleExitGuard.tsx` (`vdg69JZ`) — placed on `/play`. Keeps the sidebar detail-divider mounted inside the panel-close snapshot. Monkey-patches `Element.prototype.remove` and restores it on unmount.
- `PlaygroundInstantExitSnapshot.tsx` (`c2PU6kX`) — placed on `/play`. Captures sidebar content on close intent before React unmounts the selected detail, keeping content visible inside the panel throughout the close animation.
- `PlaygroundSidebarColumnGuard.tsx` (`R3ZWYKl`) — placed on `/play`. Hardens the sidebar detail grid so title and description text keep separate columns, with long unbroken titles wrapping instead of overlapping adjacent text.
