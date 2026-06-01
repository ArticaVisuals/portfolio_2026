# Framer Current State Audit

**Project:** Micah Hoang Portfolio 2026  
**Last audited:** May 26, 2026, via Framer MCP plus local repo audit  
**Published/staging URL:** `https://khaki-ship-257706.framer.app`  
**Public-domain note:** `https://micahhoang.info` has historically served the Cargo site during recent audits. Treat the Framer URL above as the current redesign/build surface until domain cutover is explicitly confirmed.

This is the quick source of truth for the active Framer project and local handoff repo. Older audit docs are retained for history, but this file wins when docs disagree.

---

## Current Framer Structure

### Web Pages

- `/` - Home, page ID `R6_F7xjGZ`
- `/404` - 404, page ID `koPvme2ig`
- `/case-studies` - Native case-study index, page ID `Rnw1WO1jS`
- `/case-studies/:slug` - Dynamic CMS fallback route, page ID `UlQco8cYi`
- `/case-studies/airpods` - Bespoke AirPods Pro 3 case-study page, page ID `LB7pYBD3k`
- `/index` - Canonical archive page, page ID `u2LOaBT5q`
- `/play` - Archive media playground, page ID `KbgWr_0BN`
- `/info` - Editorial profile/info page, page ID `fxz_zRIyp`
- `/contact` - Contact page, page ID `gmXtVnIzJ`

No current Framer web page is exposed for `/profile`, `/worldgrid-test`, `/play-2`, `/playground`, or `/playground-scroll-draft`.

### Design Pages

- `Design`, design page ID `NLQmOR3If`
- `Case Study Starter System`, design page ID `qDjep9bZD`

`Case Study Starter System` is a design-page reference only. It does not publish or affect live navigation.

### Native Components

Current reusable component inventory from Framer MCP:

- Footer
- Open Navigation Link
- Logo Link
- Case Study
- List View
- Index Component
- Awards Row
- List View - Image
- Case Studies Filter
- Article Tile
- Scroll More
- Social Links
- Line Animation
- Text Link
- Navigation
- View project
- Clipboard
- Button
- ButtonQuickTransition
- Address Link
- Contact
- Image Carousel
- Other Project Card

### Code Components

Framer currently has 20 code components:

| Code file | ID | Current role |
|---|---|---|
| `TextEncryptionEffect.tsx` | `p7tSTaD` | Home social-label scramble effect. |
| `Counter.tsx` | `hdPa_Gj` | `NumberCounter` used on `/case-studies`; implementation was hardened May 26, but the page prop still controls the visible count. |
| `IndexPage.tsx` | `rgAZFOv` | Main `/index` List/Grid archive component. |
| `ProfileTextRevealFix.tsx` | `LNjgKO2` | `/info` text reveal helper. |
| `FooterCopyrightYear.tsx` | `BF2H03E` | Footer year helper. |
| `Test.tsx` | `O9WTdUJ` | Misleading filename; exports the legacy `ProjectRegistrar` CMS registry bridge. Kept as fallback. |
| `CaseStudyThumbnailStrokeStyles.tsx` | `Z28JYvA` | CMS-driven thumbnail stroke helper on Home, `/case-studies`, and `/index`. |
| `ResumeAssetHost.tsx` | `xDqfenf` | Footer/resume compatibility utility; keep because Footer still references the expected prop shape. |
| `IndexPageBreakpointsDraft.tsx` | `VwMoFWv` | Active hidden `/index` responsive/style helper. Despite the name, it is part of the current `/index` implementation. |
| `ArchivePlayground.tsx` | `QNpkYp5` | Main `/play` archive media playground. |
| `PlaygroundNavPassthrough.tsx` | `RBX6jsP` | `/play` nav pointer pass-through, sidebar media sizing, and archive stroke helper. |
| `RelatedProjectHoverZoom.tsx` | `GTEGUfN` | AirPods related-project hover zoom. |
| `PlaygroundRuleExitGuard.tsx` | `vdg69JZ` | `/play` sidebar close-rule preservation. |
| `OtherProjectCardRestored.tsx` | `vlwa5Cz` | AirPods related-project card restoration helper. |
| `PlaygroundInstantExitSnapshot.tsx` | `c2PU6kX` | `/play` same-frame sidebar exit snapshot. |
| `PlaygroundSidebarColumnGuard.tsx` | `R3ZWYKl` | `/play` sidebar title/description column guard. |
| `PlaygroundNavExitHold.tsx` | `iivBAHR` | `/play` nav/exit timing helper. |
| `PlaygroundMediaLoadSmoother.tsx` | `FFqrKyU` | `/play` media-load smoothing helper. |
| `ScrollToTopButton.tsx` | `gh4ngZN` | Scroll-to-top helper used on Home and `/info`. |
| `InfoScrollMoreColorOverride.tsx` | `AZDGWx7` | `/info` Scroll More color override. |

Code files removed from the Framer project on May 26 because they were not mounted in the current page/component structure:

- `IndexFilterNavDraftPage.tsx` (`f7taGoh`)
- `IndexListCursorPreview.tsx` (`MRqxy_8`)
- `CaseStudyRevealTuner.tsx` (`fo5zjFT`)

### Code Overrides

Framer still lists five code override files:

- `Examples_1.tsx`
- `Weather.tsx`
- `Copyright_year.tsx`
- `External.tsx`
- `Copyright.tsx`

Treat these as legacy/template compatibility files unless a future Framer inspector pass proves an active override dependency. Do not delete them casually; Framer publish validation can still care about old override export names even when the visual canvas does not.

---

## Current CMS State

The `All Projects` CMS collection (`yTHrQWMIY`) contains 15 real project records and no Jacob Turner sample/template records.

| Sort | Project | Slug | Year | Home flag |
|---:|---|---|---|---|
| 1 | AirPods Pro 3 | `airpods-pro-3` | 2025 | true |
| 2 | Simon & Schuster | `simon-schuster` | 2025 | true |
| 3 | Gaia | `gaia` | 2026 | true |
| 4 | National Park Playing Cards | `national-park-cards` | 2019-ongoing | true |
| 5 | Motion Connect 2025 | `motion-connect-2025` | 2025 | true |
| 6 | Yomo | `yomo` | 2025 | true |
| 7 | Karuna | `karuna` | 2025 | false |
| 8 | Weaponized Innocence | `weaponized-innocence` | 2024 | true |
| 9 | Wolff Olins x ArtCenter | `wolff-olins-x-artcenter` | 2024 | false |
| 10 | Aspen Valley Landscaping | `aspen-valley-landscaping` | 2024 | false |
| 11 | Cellular Symphony | `cellular-symphony` | 2024 | false |
| 12 | Neon Lights | `neon-lights` | 2024 | false |
| 13 | John Steinbeck | `john-steinbeck` | 2023 | false |
| 14 | Seek Truth | `seek-truth` | 2024 | false |
| 15 | Independent Lens | `independent-lens` | 2024 | false |

The `Journal` CMS collection still exists, but there is no visible Journal page in the current Framer project map.

### Field IDs Used By Current Workflows

- `oeXZcmPna` - Title
- `DLBifmgp1` - Sorting Number
- `kuvJcmOFr` - Category 1 / Service 1
- `VV1CggU2J` - Category 2 / Service 2
- `E6OpH0hSs` - Category 3 / Service 3
- `VeDm9FjW4` - About the project
- `Jy7hBJady` - Thumbnail
- `WG62tRjG8` - Thumbnail Video Link
- `OHdUYs6Mo` - Thumbnail Stroke
- `vlN2R_qnF` - Client
- `QZqSK_3OF` - Year, stored as a string
- `mBIilFqVM` - Industry
- `myUIfK0j7` - Is Homepage

Recommended manual additions remain `Case Study URL` and `Build Status`. Add those in Framer only if the workflow needs them; do not repurpose existing field IDs.

---

## Major Custom Systems

### Home

Home is a native Framer page using a CMS-backed selected-work query. It filters `Is Homepage`, orders by `Sorting Number`, and shows the first six items:

1. AirPods Pro 3
2. Simon & Schuster
3. Gaia
4. National Park Playing Cards
5. Motion Connect 2025
6. Yomo

Karuna is off Home because its Home flag is false. Weaponized Innocence is homepage-flagged but outside the first six by sort order.

Custom code on or affecting Home:

- `TextEncryptionEffect.tsx` for social-label scramble effects.
- `CaseStudyThumbnailStrokeStyles.tsx` for CMS-driven thumbnail strokes.
- `ScrollToTopButton.tsx` for scroll return.
- Footer compatibility helpers, including the resume asset/year utilities.

### `/index`

`/index` is the most custom page. Current active code files are:

- `IndexPage.tsx` (`rgAZFOv`)
- `CaseStudyThumbnailStrokeStyles.tsx` (`Z28JYvA`)
- `IndexPageBreakpointsDraft.tsx` (`VwMoFWv`)

`IndexPage.tsx` owns taxonomy filters, list rows, grid cards, project count, view state, and the inline `GRID / LIST` control. The visible taxonomy is `/ Year`, `/ Service`, `/ Industry`; each group has its own `All` clear action. Grid view renders native HTML cards inside the code component rather than calling the native Framer `Case Study` module.

June 1, 2026 CMS bridge note: `/index` includes a hidden-by-position CMS bridge layer, `CmsLink` (`AwTGGhR7I`), containing the `AllProject` collection item and `ProjectRegistrar` (`I063adJ_h`). Keep this layer **visible/mounted** in Framer's layer panel, but fixed off-canvas at `left="-202px"`, `width="1px"`, `height="1px"`, `opacity="0"`, `overflow="hidden"`, and locked. Do not use the Framer hidden/eye toggle on this collection or any parent, because that unmounts the collection and stops the registrar from populating `/index`.

Data priority with `useCMS=true` is:

1. Live `window.__articaIndexProjectsRegistry` data from `ProjectRegistrar`
2. Direct generated CMS module scan for `All Projects`
3. Manual `projects` prop

In CMS mode, `IndexPage.tsx` intentionally falls through to an empty array rather than the in-code `DEFAULT_PROJECTS` snapshot, so stale fallback labels cannot appear as live CMS content. `DEFAULT_PROJECTS` is only used when `useCMS=false`.

The previously mounted cursor-preview helper, `IndexListCursorPreview.tsx`, was removed May 26 because it was no longer present in the current `/index` page XML.

### `/play`

`/play` is the archive media playground. Active code files:

- `ArchivePlayground.tsx`
- `PlaygroundNavPassthrough.tsx`
- `PlaygroundRuleExitGuard.tsx`
- `PlaygroundInstantExitSnapshot.tsx`
- `PlaygroundSidebarColumnGuard.tsx`
- `PlaygroundNavExitHold.tsx`
- `PlaygroundMediaLoadSmoother.tsx`

These helpers are intentionally kept because they preserve the current pointer, sidebar, close animation, media sizing, and nav interaction behavior. Consolidating them into fewer files is possible later, but should only happen behind visual parity checks.

### `/info`

Active code files:

- `ProfileTextRevealFix.tsx`
- `InfoScrollMoreColorOverride.tsx`
- `ScrollToTopButton.tsx`

The current page is an editorial forest-green profile page with selected experience, testimonials, recognition rows, and CTA sections.

### `/case-studies/airpods`

Active custom helpers:

- `RelatedProjectHoverZoom.tsx`
- `OtherProjectCardRestored.tsx`

The removed `CaseStudyRevealTuner.tsx` is no longer mounted in current XML and should not be described as part of the active AirPods page.

---

## May 26 Cleanup

Safe cleanup completed without intended visual or interaction changes:

- Removed three unmounted Framer code components:
  - `IndexFilterNavDraftPage.tsx`
  - `IndexListCursorPreview.tsx`
  - `CaseStudyRevealTuner.tsx`
- Removed obsolete local-only/draft mirrors:
  - `CaseStudyRevealTuner.tsx`
  - `IndexFilterNavDraftPage.tsx`
  - `IndexListCursorPreview.tsx`
  - `IndexPageFilterNavDraft.tsx`
  - `IndexRuleColorOverride.tsx`
- Removed local `.DS_Store` artifacts.
- Hardened `Counter.tsx` in Framer without changing the visible design: bounded interval cleanup, safer IntersectionObserver cleanup, state reset on prop changes, and corrected property-control option labels.

No web pages, native Framer components, CMS records, text styles, color styles, or visible layout/motion settings were intentionally changed in this cleanup.

---

## Performance And Maintenance Notes

Safe to keep:

- `/play` helper files are mounted and currently protect interaction polish.
- `ResumeAssetHost.tsx` should remain because the Footer expects its prop/control shape.
- The five legacy override files should remain unless a Framer publish check proves they are fully unused.

Good future cleanup candidates:

- `CaseStudyThumbnailStrokeStyles.tsx` still has heavier CMS refresh/rescan behavior than ideal. Optimize only after reading the live Framer file and confirming the canvas/editor stroke behavior remains identical.
- `/play` helper consolidation could reduce code-file count, but it is interaction-sensitive and should be treated as a parity refactor, not casual cleanup.
- `/case-studies` still displays a `NumberCounter` configured by page props. If the visible count should match the 15 CMS records, update the page prop or wire a dynamic count. This is a visible content change, so it was not changed during the no-visual-drift cleanup.
- Local TSX mirrors are partial. Framer is the source of truth for code files that exist only in the Framer project, especially the `/play` helper stack and `Counter.tsx`.

---

## Verification Notes

For future audits, verify both surfaces:

- Framer MCP project inventory, because it reflects editor/project structure and code-file cleanup.
- Published/staging URL, because it reflects the currently published build and catches visual regressions.

May 26 visual QA against `https://khaki-ship-257706.framer.app` checked `/`, `/case-studies`, `/index`, `/play`, `/info`, `/contact`, and `/case-studies/airpods` at desktop `1440x1000` and mobile `390x900`. Browser diagnostics found no suspicious route issues: no horizontal overflow, no visibly broken loaded images, and no blank pages. Manual screenshot spot-checks covered Home, `/index`, `/play`, `/case-studies`, and the AirPods page on desktop/mobile. `/index` still showed the `GRID / LIST` control and Year/Service/Industry taxonomy, and `/play` still opened a visible detail sidebar when clicking a visible archive card.

Known non-blocking console noise remains: Framer logged recoverable React hydration warnings (`#422` / `#425`) and some aborted analytics/media requests during route changes. No page errors were recorded in this pass.
