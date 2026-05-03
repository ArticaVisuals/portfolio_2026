# Framer Current State Audit

**Project:** Micah Hoang Portfolio 2026  
**Last audited:** May 1, 2026  
**Published URL:** `https://khaki-ship-257706.framer.app`  
**Latest observed publish:** May 1, 2026 at 12:37:50 PM PDT

This file is the quick source of truth for the current Framer document state. Use it before editing the older strategy, copy, CMS, or code-component docs.

---

## 1. Current Framer Structure

### Web Pages

- `/` - Home, page ID `R6_F7xjGZ`
- `/404` - 404, page ID `koPvme2ig`
- `/case-studies` - Case-study index, page ID `Rnw1WO1jS`
- `/case-studies/:slug` - Dynamic case-study detail route, page ID `UlQco8cYi`
- `/info` - Profile/info page, page ID `fxz_zRIyp`
- `/contact` - Contact page, page ID `gmXtVnIzJ`
- `/index` - Archive page, page ID `u2LOaBT5q`, `IndexPage` default List Type `Standard`
- `/index` - Duplicate archive page, page ID `yKKOMVNs6`, `IndexPage` default List Type `Mono 13`

There is no current web page for `/profile` or `/worldgrid-test` in the May 1 Framer project map. `/info` is the live profile route. `WorldGridTest.tsx` still exists as code file `ibj8uxT`, but it is not exposed as a web route.

### Design Pages

- `Design`, design page ID `NLQmOR3If`
- `Case Study Starter System`, design page ID `qDjep9bZD`
- `Home A/B Grid Preview`, design page ID `GIzzd0QWG`

### Key Code Components

- `IndexPage.tsx`, code file ID `rgAZFOv`
- `WorldGridTest.tsx`, code file ID `ibj8uxT`
- `HomeGridPreview.tsx`, code file ID `Z5xMt1E`
- `HomeGridVariantPreviewStyles.tsx`, code file ID `ezlLf_J`
- `IndexRuleColorOverride.tsx`, code file ID `tqQjSoH`
- `ImageMaskReveal.tsx`, code file ID `poRGCf7`
- `ProfileTextRevealFix.tsx`, code file ID `LNjgKO2`
- `FooterCopyrightYear.tsx`, code file ID `BF2H03E`

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

---

## 3. Home Visibility Nuance

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

Karuna is currently off Home because its `Is Homepage` flag is `false`. Weaponized Innocence has `Is Homepage` set to `true`, but it is not visible in the published Home set because the query stops at the first 6 homepage-flagged records by sort order.

When changing Home curation, update both the CMS flag and the sort order, then confirm the Home query limit.

---

## 4. Route And Surface Watchpoints

- Home hero XML currently shows a spacing typo in the subline: `Brand designer with a systems mind.Strategy, visual identity, motion.` The approved copy has a space after `mind.`
- National Park Playing Cards proof points are inconsistent across surfaces: CMS/copy docs still say 160 retail locations, while `/info` intro and recognition rows say 220+ stores. Verify the current number before launch copy cleanup.
- `/info` is the live profile page. Do not refer to `/profile` as a current route unless a new page is created.
- Navigation currently shows `Work`, `INDEX`, and `INFO`. Contact exists as `/contact` and through CTA/footer links, but it is not in the primary nav component.
- There are two `/index` pages in Framer. They both use `IndexPage.tsx`; one defaults to `Standard`, the other to `Mono 13`. Resolve or verify which page Framer publishes before making route-level archive changes.
- `/case-studies` still displays a `NumberCounter` ending at `12`, even though the CMS has 15 records.
- `Case Study Starter System` still contains a 12-project route map and does not include Motion Connect 2025, Seek Truth, or Independent Lens.
- `IndexPage.tsx` now has a 15-project `DEFAULT_PROJECTS` fallback synced from the CMS registry, including current thumbnail/video fields. Grid view renders the native CMS-backed `Case Studies Filter` grid when no project array is bound and no index filters are active, matching `/case-studies` for the unfiltered Grid state. Filtered Grid/List still use the local project array.
- Home selected-work CTA `VIEW ALL` now links to `/index` instead of `/case-studies`.
- `Year` is a CMS string field (`QZqSK_3OF`) and includes a non-numeric value, `2019-ongoing`. Any code that treats year as a number should coerce deliberately.

---

## 5. CMS Field Map

Core fields:

- `oeXZcmPna` - Title
- `DLBifmgp1` - Sorting Number
- `kuvJcmOFr` - Category 1
- `VV1CggU2J` - Category 2
- `E6OpH0hSs` - Category 3
- `VeDm9FjW4` - About the project
- `Jy7hBJady` - Thumbnail
- `WG62tRjG8` - Thumbnail Video Link
- `vlN2R_qnF` - Client
- `QZqSK_3OF` - Year
- `mBIilFqVM` - Industry
- `myUIfK0j7` - Is Homepage

Extended case-study fields:

- `tzVexbjWp` - Creative Director
- `Chguu3lHj` - Art Director
- `HY1X73dpT` - Designers
- `U0gx1yKeB` - Makeup
- `QF3AEVk8r` - Image 1
- `xOL69akmU` - CMS Video 1
- `FwLb0MrAN` - CMS Video Poster 1
- `fsFlSPDTa` - Image 2
- `xpyes5aGJ` - CMS Video 2
- `Y9u0naHRi` - CMS Video Poster 2
- `rm5GqyLak` - Image 3
- `rB64YNSUs` - Image 4
- `lUT9kBBwP` - Image 5
- `X4mkKflln` - Next Project 1
- `z_tutvcUx` - Next Project 2
- `OoXOWcQvg` - Next Project 3
- `vqPrQQLOM` - Content

Recommended manual additions remain:

- `Case Study URL` as a Link field
- `Build Status` as an enum field

Do not repurpose existing field IDs to create those fields.
