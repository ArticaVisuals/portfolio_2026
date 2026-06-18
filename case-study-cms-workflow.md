# Case Study CMS Workflow

**Project:** Micah Hoang Portfolio 2026
**Last verified:** June 18, 2026
**Framer URL:** `https://khaki-ship-257706.framer.app`
**Current-state companion:** `framer-current-state.md`

---

## 1. Working Model

Use a hybrid model:

- **CMS as registry:** `All Projects` owns project metadata, sorting, filters, thumbnails, homepage visibility, and archive/index browsing.
- **Pages as storytelling:** individual case studies should be bespoke Framer pages when they need custom editorial pacing, layout, media modules, motion, or project-specific structure.

This is intentional. The portfolio should not force AirPods, Gaia, Peak Energy, Simon & Schuster, National Park Playing Cards, Motion Connect 2025, Yomo, Karuna, Weaponized Innocence, TYPLDN, Seek Truth, Independent Lens, Rejuve, Belly Bar, WhatsApp, or the other archive projects into one generic CMS template. The CMS keeps navigation and browsing consistent; custom pages let each story breathe.

## 2. Current Structure

Verified Framer structure:

- `/` - Home page, page ID `R6_F7xjGZ`
- `/index` - Canonical archive page with `IndexPage.tsx`, page ID `u2LOaBT5q`. The earlier duplicate `yKKOMVNs6` (Mono 13 default) and temporary `/index-inline-toggle-test` A/B route have been deleted. List Type / List Hover / Default View / Use CMS are exposed as Framer property controls on this instance. The inline `GRID / LIST` toggle, responsive behavior, line/rule timing, appear motion, and grid-media hover scale are owned directly by `IndexPage.tsx`. The current mounted helper is `CaseStudyThumbnailStrokeStyles.tsx`.
- `/case-studies` - Native Framer case-study index, page ID `Rnw1WO1jS`
- `/case-studies/:slug` - dynamic case-study route, page ID `UlQco8cYi`
- `/case-studies/airpods` - bespoke AirPods pilot page, page ID `LB7pYBD3k`
- Additional bespoke case-study pages now exist for Peak Energy, Simon & Schuster, Motion Connect 2025, National Park Playing Cards, Yomo, Karuna, Gaia, Weaponized Innocence, TYPLDN, Seek Truth, Cellular Symphony, Wolff Olins x ArtCenter, Independent Lens, Rejuve, Belly Bar, and WhatsApp. As of the June 15 CMS parity update, every `All Projects` CMS slug has a matching bespoke `/case-studies/{slug}` page. Neon Lights and Aspen Valley Landscaping were deleted from Framer because their slugs are no longer in CMS. See `framer-current-state.md` for page IDs.
- `/info` - profile page, page ID `fxz_zRIyp`
- `/play` - archive media playground, page ID `KbgWr_0BN`
- `/404` - 404 page, page ID `koPvme2ig`

June 10 cleanup note: the former public editorbar guard has been removed from Framer and the local mirror. It is no longer mounted on current inventory and should not be treated as part of the public page baseline.

There is no current `/profile` web page; `/info` is the live profile route. There is also no current `/contact`, `/worldgrid-test`, `/play-2`, `/play-consolidation-draft`, or `/playground-scroll-draft` web page in the June 15 Framer project inventory.

Verified CMS structure:

- `All Projects`, collection ID `yTHrQWMIY`
- 17 real project records
- zero Jacob Turner sample/template records
- user-managed collection, so MCP cannot add new fields automatically

Current design/support pages:

- `Design`, design page ID `NLQmOR3If`

Older docs mention `Case Study Starter System` (`qDjep9bZD`), but it is not in the June 2 Framer MCP inventory.

Current project roster, field IDs, Home visibility behavior, and route watchpoints live in `framer-current-state.md`.

## 3. Canonical URL Contract

Keep all project links canonical:

```text
/case-studies/[slug]
```

Current AirPods state: the bespoke AirPods pilot page is `/case-studies/airpods`, and the CMS record slug is also `airpods`. The old `airpods-pro-3` exception is historical and should not be reintroduced.

The home page, `/case-studies` index, `/index` archive, and custom case-study pages should all resolve to the same URL pattern.

Earlier Framer staging checks returned HTTP 200 for:

- `/`
- `/case-studies`
- `/index`
- `/info`
- `/contact`
- `/play`
- `/case-studies/airpods`

`/contact`, `/play-2`, `/play-consolidation-draft`, and `/playground-scroll-draft` are no longer present in the June 15 Framer web-page inventory. Treat older references to them as historical drafts, not current route obligations. Create a fresh draft/design page before future Play experimentation rather than assuming `/play-consolidation-draft` still exists.

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
- thumbnail stroke toggle
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
   - Newly added or reshuffled records needing final depth decisions: Peak Energy, Seek Truth, Independent Lens, TYPLDN, Rejuve, Belly Bar, and WhatsApp.
   - Peak Energy, Rejuve, Belly Bar, and WhatsApp currently have WIP bespoke shells; keep them gated until public copy, credit, asset, and production-contract review clears public content.

2. Update the CMS registry.
   - Confirm title, slug, sort order, category fields, industry, year, homepage flag, thumbnail, thumbnail video, and thumbnail stroke.
   - Add `Case Study URL` and `Build Status` manually first if you want those fields.

3. Start from the design page.
   - Use the current `Design` / asset-migration pages or an existing bespoke case-study page as the structural reference.
   - Older notes about `Case Study Starter System` are historical unless that page is restored in Framer.
   - Keep new route experiments on a design page until the route decision is clear.

4. Decide the route.
   - Preferred final URL: `/case-studies/[slug]`.
   - Ask permission before creating a custom web page that shadows or replaces the dynamic route for that slug.
   - Keep `/case-studies/:slug` as the fallback route until a specific page is ready.

5. Compose the case study.
   - Build the page layout manually in Framer.
   - Use CMS metadata for cards and browsing, not as the only source of page structure.
   - Keep page-level typography, spacing, and media rhythm aligned with the portfolio design system.
   - For an image gallery/slideshow, **reuse the `ImageCarousel` component** (code file `tYFZCey`) instead of building a new one — fade carousel + lightbox + GT Standard `‹ ›` arrows. Populate it via the `manifest` prop (scriptable, one `imageUrl|alt` per line) or the `images` picker (Framer UI only). Host slide images on `framerusercontent.com`, never cargo. Full details + the de-cargo asset-ingest steps are in `framer-current-state.md` → "Reusable Image Carousel".

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
- replacing `/case-studies` native card systems or `/index` code cards without a verified parity reason

Safe changes without extra permission:

- adding or editing repo documentation
- creating non-published design-page starter layouts
- drafting a new case-study page away from live navigation
- updating copy or layout inside a clearly draft-only page

## 8. Home And Index Requirements

Home currently uses `HomeSelectedWorkGrid.tsx` (`FecepLS`) for the selected-work section. It reads the `All Projects` CMS module when available, falls back to its default project snapshot when needed, filters `Is Homepage`, sorts by `Sorting Number`, and limits to six records. The current CMS-backed six-item set is:

- Gaia
- AirPods Pro 3
- Peak Energy
- Simon & Schuster
- Motion Connect 2025
- National Park Playing Cards

WhatsApp has `Is Homepage` true but is outside the first six because its sort order is 17. Yomo, Karuna, and Weaponized Innocence are currently off Home because their `Is Homepage` flags are false. Project cards link directly to `/case-studies/[slug]`; the Home selected-work `VIEW ALL` CTA links to `/index`.

Home selected-work tag pills are CMS-bound to the same Category 1/2/3 fields used by the archive taxonomy: `kuvJcmOFr`, `VV1CggU2J`, and `E6OpH0hSs`. `HomeSelectedWorkGrid.tsx` exposes those bindings as the `Tag Fields` control, with `Show Tags` for non-destructive visibility testing and `Tags` for the pill stroke/text color. Keep the default tag color aligned to the existing Light Gray style value (`rgb(151, 151, 151)`). The pill text stays 13px on desktop, steps to 12px on tablet, and steps to 11px at the mobile/single-column breakpoint. Do not hardcode per-card Home services in Framer layers; update the CMS category values instead so Home and `/index` stay in sync.

Do not restore the old native Home `AllProjects` / `CaseStudy` grid unless it is intentionally rebuilt and verified in the Framer editor. That grid lost reliable per-item CMS bindings and showed AirPods content over every Home card after hydration. `CaseStudyLinkRepair.tsx` is not the primary Home fix; the Home instance is disabled.

Home About read-more maintenance note, updated June 16, 2026: keep the `/info` link on the native `Button Wrapper` and keep the visible `READ MORE` text as detached/native `TextLinkBlack` layers. Do not put a linked `Text Link` component inside that linked wrapper, or Framer reports a nested-link optimization warning. The flip-up interaction depends on the outer `TextLinkBlack` layer clipping to 13px and the inner text stack remaining `fit-content` with visible overflow.

`/index` uses the Framer code file `IndexPage.tsx` (`rgAZFOv`). It derives project URLs from `slug` as `/case-studies/${slug}`. That is the right behavior for the hybrid model. When bespoke pages are created at those same canonical paths, `/index` should not need link changes.

Current index data note (June 15, 2026): the live Framer `IndexPage.tsx` has a `useCMS` Boolean prop. In CMS mode it reads the mounted `ProjectRegistrar` registry first, then falls back to the generated `All Projects` CMS module (`yTHrQWMIY`), then manual `projects`; it intentionally does not use `DEFAULT_PROJECTS` in CMS mode. Registry rows are hydrated from the generated CMS module by slug/title for thumbnail, thumbnail video, and thumbnail stroke before rendering, so incomplete bridge rows do not override richer CMS rows. Thumbnail media policy is: `Thumbnail Video` wins over `Thumbnail`; `Thumbnail` is poster/fallback. The `/index` instance reads only `Thumbnail Video` (`SvOqFqdby`) via `thumbnailVideoFieldIds="SvOqFqdby"`. The older `Thumbnail Video Link` text field (`WG62tRjG8`) is retired and should not be used for thumbnail-video wiring. Grid view renders native HTML cards inline (no `Case Study` module dependency, uniform 16:9 media, 3/2/1 column responsive grid, title and metadata below media with hover-flip CTA). `/index` also keeps the existing `CaseStudyThumbnailStrokeStyles.tsx` instance (`Z28JYvA`, node `szF9sZNWA`) with `syncThumbnailVideos=true`, `videoFieldId="SvOqFqdby"`, and `slugFieldId="pdXVG_fBO"` as a backup overlay path. AirPods Pro 3, Peak Energy, Motion Connect 2025, Wolff Olins x ArtCenter, and Cellular Symphony have populated `Thumbnail Video` File values; publish/redeploy Framer after changing File-field thumbnail videos so the generated CMS bundle refreshes. Direct-child grid media hover/focus scale is consolidated inside `IndexPage.tsx`, so do not add a hidden `/index` helper for it. `IndexThumbnailVideoFallback.tsx` was deleted from Framer and should not be recreated.

Thumbnail stroke note (updated June 15, 2026): `All Projects` has `Thumbnail Stroke` (`OHdUYs6Mo`) as an individual Boolean per project. `CaseStudyThumbnailStrokeStyles.tsx` (`Z28JYvA`) reads that field and applies a 1px Light Gray stroke in native/media contexts on Home, `/case-studies`, and `/index` through invisible helper instances (`VXt8C11M9`, `AfVjNDU23`, `szF9sZNWA`). `HomeSelectedWorkGrid.tsx` mirrors the same CMS field for its Home cards. Current verified CMS state has Gaia, AirPods Pro 3, and Karuna on; Gaia item `Qw6kG4fCG` uses slug `gaia` and thumbnail `https://framerusercontent.com/images/3iHNvkSGZvQVJ7CTtlkZfzMmqmc.jpg`. The helper matches by slug when real routes resolve and by title containment when Framer preview/canvas exposes unresolved links. The June 1 fix makes the helper resolve both legacy Framer CMS exports (`module.a`) and the current published shape (`module.r`, plus scanned object exports) before calling `collectionByLocaleId.default.scanItems()`. On June 2, the helper instances were updated to use Framer item slugs directly (`slugFieldId=""`). `Case Study > Card > ImageWrapper` contains a real overlay frame (`sKJdcQrXY`) at opacity 0, which the helper toggles so the stroke can be visible directly in Framer canvas/editor. The older `/index` hardcoded `.with-stroke` class path has been removed, and the old Framer `Case Study` stroke variants (`CardStroke`, `CardStrokeHover`) were deleted so CMS is the only stroke source of truth.

Related-project card note (updated June 10, 2026): bespoke case-study "Other Projects" sections use `OtherProjectCardRestored.tsx` (`vlwa5Cz`). The card now hydrates thumbnail, thumbnail video, and thumbnail stroke from the generated `All Projects` CMS module by slug/title, with manual `thumbnailSrc` and `thumbnailVideoSrc` props as fallbacks. This fixes the AirPods related Gaia card, which had been showing an older static JPG even though the CMS/Home/Index Gaia thumbnail was the `XBEu3UkNu8Hm5CPrgksq7wtmbw.gif` file. Publish the Framer site after code-file changes before checking the public staging URL.

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
7. Seek Truth, Independent Lens, TYPLDN, Rejuve, Belly Bar, and WhatsApp, if they graduate from archive entries into dedicated showcases

Use the pilot to settle the reusable module rhythm: hero, context, role, challenge, system, media run, selected details, outcome, related work.

## 10. Verification Notes

Current CMS sync verified June 15, 2026:

- Framer MCP reports 24 web pages, 1 design page, 23 native components, 40 code components, 5 override files, and 2 CMS collections.
- `All Projects` reports 17 records in this order: Gaia, AirPods Pro 3, Peak Energy, Simon & Schuster, Motion Connect 2025, National Park Playing Cards, Yomo, Karuna, Weaponized Innocence, Wolff Olins x ArtCenter, Cellular Symphony, Seek Truth, Independent Lens, TYPLDN, Rejuve, Belly Bar, and WhatsApp.
- The Framer web-page inventory now has one bespoke case-study page for each CMS slug, plus the generic dynamic `/case-studies/:slug` fallback route.
- Peak Energy is present in CMS with slug `peak-energy`, `Is Homepage=true`, sort `3`, year `2026`, services `2D Motion`, `3D Motion`, and `Social Media`, and industry `Technology`; its bespoke route is `/case-studies/peak-energy` and is intentionally WIP-gated.
- Rejuve, Belly Bar, and WhatsApp are present in CMS and now have matching WIP-gated bespoke routes at `/case-studies/rejuve`, `/case-studies/belly-bar`, and `/case-studies/whatsapp`.
- Neon Lights and Aspen Valley Landscaping are no longer in CMS and their bespoke Framer pages were deleted.
- Local fallback snapshots in `HomeSelectedWorkGrid.tsx` and `IndexPage.tsx` were updated to match the current CMS order/roster.

Historical verification from June 2, 2026:

- Framer MCP project inventory contains `/`, `/404`, `/case-studies`, `/case-studies/:slug`, `/index`, `/play`, `/info`, `/contact`, and 15 bespoke case-study pages.
- Live Framer staging routes checked in the prior browser pass: `/`, `/index`, `/case-studies`, `/info`, `/contact`, `/play`, and `/case-studies/airpods` returned 200 at desktop and mobile widths. May 26 visual QA is recorded in the final audit response.
- No horizontal overflow was detected at 1280px desktop or 390px mobile for the checked published routes.
- Published Home hero line no longer has the old `mind.Strategy` spacing typo.
- CMS inspected with MCP: `All Projects` had 16 real records at that time.
- CMS thumbnail stroke field inspected with MCP and browser import: `AirPods Pro 3` is true with slug `airpods`; the other returned project records are false.
- `CaseStudyThumbnailStrokeStyles.tsx` updated and typechecked in Framer with no errors; final implementation toggles the real Framer overlay frame `sKJdcQrXY` inside `ImageWrapper` when available, with DOM-overlay fallback for custom HTML cards. The June 1 update specifically fixes Framer's current generated CMS module shape, where the collection is exported under `r` instead of legacy `a`.
- Local regression guard added: run `node tools/check-thumbnail-stroke-resolver.mjs` before changing or publishing the helper so the stroke does not regress to the old `module.a`-only CMS lookup.
- Published Home selected-work QA passed: six distinct cards render for AirPods Pro 3, Simon & Schuster, Gaia, National Park Playing Cards, Motion Connect 2025, and Yomo; thumbnail and text clicks land on the matching `/case-studies/{slug}` pages; image-only cards render image thumbnails; AirPods and Motion Connect render video.
- Helper instances verified on Home, `/case-studies`, and `/index`; the dynamic `/case-studies/:slug` route was left untouched to avoid layout normalization risk.
- Published `/index` inspected: the page has the Year / Service / Industry taxonomy, per-group `All` actions, no horizontal overflow, and simplified visible Industry labels. CMS module resources load, but the legacy window registry was empty during the browser check.
- `/case-studies` was configured for a `(12)` count via `NumberCounter` page props even though the CMS had 16 records. The prop was updated and published as `16` on June 2. As of June 15, the CMS roster is 17 records, so update that prop again before the next publish.
- Framer now has canonical `/index` page `u2LOaBT5q`; the older duplicate `yKKOMVNs6` and the temporary `/index-inline-toggle-test` route are gone.
- No live pages were deleted by MCP in this audit.
- No CMS fields were changed through MCP.
