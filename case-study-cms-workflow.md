# Case Study CMS Workflow

**Project:** Micah Hoang Portfolio 2026
**Last verified:** May 1, 2026
**Framer URL:** `https://khaki-ship-257706.framer.app`
**Current-state companion:** `framer-current-state.md`

---

## 1. Working Model

Use a hybrid model:

- **CMS as registry:** `All Projects` owns project metadata, sorting, filters, thumbnails, homepage visibility, and archive/index browsing.
- **Pages as storytelling:** individual case studies should be bespoke Framer pages when they need custom editorial pacing, layout, media modules, motion, or project-specific structure.

This is intentional. The portfolio should not force AirPods, Gaia, Simon & Schuster, National Park Playing Cards, Motion Connect 2025, Yomo, Karuna, Weaponized Innocence, Seek Truth, or Independent Lens into one generic CMS template. The CMS keeps navigation and browsing consistent; custom pages let each story breathe.

## 2. Current Structure

Verified Framer structure:

- `/` - Home page, page ID `R6_F7xjGZ`
- `/index` - Archive page with `IndexPage.tsx`, page ID `u2LOaBT5q`, default List Type `Standard`
- `/index` - Duplicate archive page with `IndexPage.tsx`, page ID `yKKOMVNs6`, default List Type `Mono 13`
- `/case-studies` - Native Framer case-study index, page ID `Rnw1WO1jS`
- `/case-studies/:slug` - dynamic case-study route, page ID `UlQco8cYi`
- `/info` - profile page, page ID `fxz_zRIyp`
- `/contact` - contact page, page ID `gmXtVnIzJ`
- `/404` - 404 page, page ID `koPvme2ig`

There is no current `/profile` web page; `/info` is the live profile route. There is also no current `/worldgrid-test` web page. `WorldGridTest.tsx` still exists as a code file, but it is not routed.

Verified CMS structure:

- `All Projects`, collection ID `yTHrQWMIY`
- 15 real project records
- zero Jacob Turner sample/template records
- user-managed collection, so MCP cannot add new fields automatically

Created non-published support page:

- `Case Study Starter System`, design page ID `qDjep9bZD`
- Purpose: starter layout, workflow notes, route map, module examples, and permission gates
- This is a design page only. It does not publish or affect live navigation.
- Current watchpoint: its route map still lists the older 12-project roster. Add Motion Connect 2025, Seek Truth, and Independent Lens before using it as a literal migration checklist.

Current project roster, field IDs, Home visibility behavior, and route watchpoints live in `framer-current-state.md`.

## 3. Canonical URL Contract

Keep all project links canonical:

```text
/case-studies/[slug]
```

The home page, `/case-studies` index, `/index` archive, and custom case-study pages should all resolve to the same URL pattern.

Current verified live checks returned HTTP 200 for:

- `/`
- `/case-studies`

The May 1 audit also observed the published Home deployment metadata and `/case-studies` HTML, but did not re-run a full clickthrough/status-code matrix for every slug.

The dynamic `/case-studies/:slug` page currently handles individual project routes. When creating bespoke case-study pages, only create or move a page into a canonical `/case-studies/[slug]` path after confirming how Framer will resolve that path against the existing dynamic route. Ask Micah before deleting, renaming, or shadowing the dynamic page.

## 4. CMS Responsibilities

The `All Projects` CMS should own:

- project title
- slug
- sorting number
- categories and taxonomy
- industry
- year
- client/status metadata
- thumbnail image
- thumbnail video link
- homepage visibility
- short index/list copy if added later

Recommended manual CMS additions in Framer:

- `Case Study URL` - Link field. Use for future-proofing if a case study ever needs a non-canonical destination.
- `Build Status` - Enum field with values like `Stub`, `Draft`, `Ready`, `Published`.

Because `All Projects` is user-managed, add these fields manually in Framer if you want them. Do not repurpose existing field IDs casually because `/index`, Home, and case-study card components already depend on the current field bindings.

## 5. Page Responsibilities

Custom Framer pages should own:

- bespoke editorial sequence
- hero composition
- process and decision narrative
- custom image/video rhythm
- project-specific motion
- large galleries or interleaved media
- credits, role, team, and outcomes when the page needs richer treatment
- related-project sections and hand-authored next steps

Do not put all of this into CMS fields unless the page can genuinely share the same structure as every other case study.

## 6. Build Workflow

1. Choose the project and depth tier.
   - Tier 1 full case studies: AirPods Pro 3, Simon & Schuster, Gaia.
   - Tier 2 visual showcases: National Park Playing Cards, Motion Connect 2025, Yomo, Karuna, Weaponized Innocence.
   - Newly added archive/editorial records needing final depth decisions: Seek Truth and Independent Lens.

2. Update the CMS registry.
   - Confirm title, slug, sort order, category fields, industry, year, homepage flag, thumbnail, and thumbnail video.
   - Add `Case Study URL` and `Build Status` manually first if you want those fields.

3. Start from the design page.
   - Open `Case Study Starter System`.
   - Duplicate or adapt the starter layout modules for the project.
   - Keep it on a design page until the route decision is clear.

4. Decide the route.
   - Preferred final URL: `/case-studies/[slug]`.
   - Ask permission before creating a custom web page that shadows or replaces the dynamic route for that slug.
   - Keep `/case-studies/:slug` as the fallback route until a specific page is ready.

5. Compose the case study.
   - Build the page layout manually in Framer.
   - Use CMS metadata for cards and browsing, not as the only source of page structure.
   - Keep page-level typography, spacing, and media rhythm aligned with the portfolio design system.

6. Preserve index/home links.
   - Home cards should continue linking to `/case-studies/[slug]`.
   - `/index` should continue deriving click URLs from `slug`.
   - Only introduce per-project `Case Study URL` overrides if the canonical URL strategy changes.

7. Verify before publishing.
   - Open Home and click the project card.
   - Open `/index` and click the same project row/card.
   - Open `/case-studies` and click the same project card.
   - Confirm all three routes land on the intended page.
   - Confirm desktop and mobile layouts do not clip text or hide important media.

## 7. Permission Gates

Ask Micah before:

- deleting the dynamic `/case-studies/:slug` page
- renaming live URLs
- creating a bespoke page that shadows a dynamic slug route
- bulk-changing Home, `/index`, or `/case-studies` links
- changing CMS field IDs or repurposing existing fields
- replacing native Framer case-study card components with custom code

Safe changes without extra permission:

- adding or editing repo documentation
- creating non-published design-page starter layouts
- drafting a new case-study page away from live navigation
- updating copy or layout inside a clearly draft-only page

## 8. Home And Index Requirements

Home currently uses a CMS-backed selected-work query that filters `Is Homepage`, sorts by `Sorting Number`, and limits to six records. The current published set is:

- AirPods Pro 3
- Simon & Schuster
- Gaia
- National Park Playing Cards
- Motion Connect 2025
- Yomo

Karuna is currently off Home because its `Is Homepage` flag is false. Weaponized Innocence has `Is Homepage` true but is outside the published first six because its sort order is 8. Project cards link to `/case-studies/[slug]`; the Home selected-work `VIEW ALL` CTA now links to `/index`.

`/index` uses the Framer code file `IndexPage.tsx` (`rgAZFOv`). It derives project URLs from `slug` as `/case-studies/${slug}`. That is the right behavior for the hybrid model. When bespoke pages are created at those same canonical paths, `/index` should not need link changes.

Current index data note: local `IndexPage.tsx` has a 15-project fallback synced from the CMS registry, including current thumbnail/video fields. Unfiltered Grid uses the native CMS-backed `Case Studies Filter` grid if no project array is bound; filtered Grid/List use the local/bound project array. The live CMS remains the source of truth.

## 9. Recommended Starting Order

Start with one pilot case study before rolling the system across everything.

Recommended pilot:

- **Gaia** if you want to prove the richest end-to-end brand/product storytelling system.
- **AirPods Pro 3** if you want the highest-impact hiring signal online first.

Then build:

1. Simon & Schuster
2. National Park Playing Cards
3. Motion Connect 2025
4. Yomo
5. Karuna
6. Weaponized Innocence
7. Seek Truth and Independent Lens, if they graduate from archive entries into dedicated showcases

Use the pilot to settle the reusable module rhythm: hero, context, role, challenge, system, media run, selected details, outcome, related work.

## 10. Verification Notes

Last verified May 1, 2026:

- Framer project map inspected with MCP.
- CMS inspected with MCP: `All Projects` now has 15 real records.
- Published Home SSR inspected: selected-work query is limited to six homepage-flagged records and currently includes Motion Connect 2025.
- `/case-studies` still displays a 12-count even though the CMS has 15 records.
- Framer has duplicate `/index` pages: `u2LOaBT5q` and `yKKOMVNs6`.
- No live pages were deleted, renamed, or replaced.
- No CMS fields were changed through MCP.
