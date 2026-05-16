# Framer Image Mask Reveal Publish Handoff

## Goal

Publish the image mask-in animation to the main Framer site URL without needing `?imageReveal=1`.

The user wants:

- Case study thumbnails on the home page to mask in from bottom to top.
- Other images across the site to get the same reveal treatment where practical.
- The reveal to be smoother and less abrupt.
- No default thumbnail strokes around project thumbnails; per-project strokes are allowed only when the CMS `Thumbnail Stroke` Boolean is enabled.
- The effect published on the normal live URL.

Current live site:

- `https://khaki-ship-257706.framer.app`

## Current Status

The image reveal behavior itself is implemented in Framer and was seen working in preview/flagged testing. The remaining blocker is publishing. Framer's Publish panel currently disables the `Update` button with:

`Error: Code Override Missing`

There is also a persistent warning:

`A/B test needs configuration.`

Do not share or copy any MCP secret URL from the Framer plugin panel.

## Completed Changes

### Image Reveal Code Component

Code component:

- File: `ImageMaskReveal.tsx`
- Framer codeFileId: `poRGCf7`

The component injects CSS/IntersectionObserver behavior to reveal images/videos on scroll.

The intended deployed instance settings are:

- `activation="always"`
- `direction="bottomToTop"`
- `duration=1200`
- `travel=0`
- `scale=1.012`
- `easing="cubic-bezier(0.65, 0, 0.35, 1)"`
- `borderDelay=1160`
- `borderDuration=260`
- include videos enabled

The reveal was originally gated by `activation="urlFlag"` and `?imageReveal=1`; it has since been changed to `activation="always"` in project XML for the relevant pages.

### Pages With ImageMaskReveal Instances Set To Always

Verified/updated pages (May 10, 2026 — only one `/index` page remains):

- Home `/`: page `R6_F7xjGZ`, root `ZVqAQ0z7x`, instance `NuMtwybm2` — `enabled="true"`
- `/case-studies`: page `Rnw1WO1jS`, root `Z_IQof75v`, instance `hv3dg3p94` — `enabled="true"`
- `/case-studies/:slug`: page `UlQco8cYi`, root `zn7ljgmof`, instance `Yizyjt62o` — `enabled="true"`
- `/index`: page `u2LOaBT5q`, root `aezamcJ1c`, instance `qf2vKr_sV` — **`enabled="false"` since May 10, 2026.** The instance was left in place (with `activation="always"` and the original tuning) but disabled on the archive page so navigation to `/index` is instant. The other settings (duration, easing, direction, border timing) are preserved so re-enabling later is a single attribute flip.
- `/info`: page `fxz_zRIyp`, instance `S4E2dnGw0` — `enabled="true"`
- `/contact`: page `gmXtVnIzJ`, instance `gwBLOZ0CH` — `enabled="true"`

### Default Thumbnail Strokes Removed; CMS Toggle Added

Component:

- `Case Study`
- nodeId: `E6fn6UkLd`

Stroke/border attributes were removed from:

- `ImageWrapper` node `LvdUb_iyY`
- overlay `Stack` node `d3z4kFOAq`

May 15, 2026 update: strokes are now available as an individual CMS toggle instead of a default card border. The controlling code component is `CaseStudyThumbnailStrokeStyles.tsx` (`Z28JYvA`), reading `All Projects` field `OHdUYs6Mo` (`Thumbnail Stroke`). Helper instances are placed on Home (`VXt8C11M9`), `/case-studies` (`AfVjNDU23`), and `/index` (`szF9sZNWA`). Current verified state: AirPods Pro 3 is on; all other projects are off. The stroke color is Light Gray `#979797`, and the stroke is a non-layout real overlay child inserted inside the thumbnail wrapper, so it should not change grid/card dimensions.

## Current Project Map

From Framer MCP `getProjectXml` (May 15, 2026), current web pages:

- `R6_F7xjGZ` path `/`
- `koPvme2ig` path `/404`
- `Rnw1WO1jS` path `/case-studies`
- `fxz_zRIyp` path `/info`
- `gmXtVnIzJ` path `/contact`
- `UlQco8cYi` path `/case-studies/:slug`
- `u2LOaBT5q` path `/index` (single page; the earlier duplicate `yKKOMVNs6` is gone)

Important components:

- `xxIb0BkhJ` Footer
- `E6fn6UkLd` Case Study
- `uAVxdOWKR` List View
- `EOY6MztTy` Index Component
- `y8kvTlWMC` Case Studies Filter
- `yGfvD64UY` Navigation

Code components:

- `poRGCf7` ImageMaskReveal
- `tqQjSoH` IndexRuleColorOverride
- `rgAZFOv` IndexPage
- `hdPa_Gj` Counter (exports `NumberCounter`)
- `ibj8uxT` WorldGridTest (unrouted)

Code overrides:

- `saw3Q19` Examples_1.tsx
- `zB2BDA4` Weather.tsx
- `cXkdXam` Copyright_year.tsx
- `WHpRmeH` External.tsx
- `Cm9wqQM` Copyright.tsx

## Publish Blocker

Framer Publish popover shows:

- `Error: Code Override Missing`
- `Update` button disabled

Changes list shown in the publish popover includes:

- Home
- `/case-studies`
- `/case-studies/:slug`
- `/contact`
- `/index`
- `/index`
- `/info`
- Footer
- CMS items `all projects/independent-lens NEW`
- CMS items `all projects/seek-truth NEW`

Clicking error rows in the publish popover focused visible page/footer layers, but did not expose a clear missing override in the normal canvas tree.

## Code Override Work Already Tried

The selected `/index` footer text layer was:

- page `u2LOaBT5q`
- node `aeye2idIn`
- visible layer name `© Studio B 2023`

The inspector initially showed Code Overrides file `External` without a selected export. It was changed to:

- File: `Copyright_year`
- Override: `AutoCopyrightStatement`

That did not clear the publish blocker.

### Copyright_year.tsx

codeFileId:

- `cXkdXam`

Recognized export:

- `AutoCopyrightStatement`

Purpose:

- replaces `YYYY` in text children with the current year.

### External.tsx

codeFileId:

- `WHpRmeH`

This file was updated to provide recognized no-op/safe override exports:

- `External`
- `Noop`
- `withExternal`
- `withOverride`
- `AutoCopyrightStatement`

Framer now recognizes those exports.

### Copyright.tsx

codeFileId:

- `Cm9wqQM`

This compatibility override file was added because local generated Framer cache still referenced an older remote `Copyright.js` override module. It exports:

- `AutoCopyrightStatement`

This also did not clear the publish blocker.

## Local Cache Evidence

Local Framer generated project cache was inspected at:

`~/Library/Application Support/Framer/Partitions/framer/blob_storage/22244b3a-9b0c-4e25-8356-8776e0460f10`

Most recent-looking blob:

- `28`

Important finding:

- The generated cache still contains stale/deleted-template references that are not listed by current Framer MCP `getProjectXml`.

Examples seen in the cache:

- `MenuOpenOverlay` imported from `../canvasComponent/SmkNoZhed`
- metadata provider `../webPageMetadata/YIWFDAfhW`
- node `GkkkbWUfe`
- scope `SmkNoZhed`
- old page/component names around the generated code such as `MenuOpenOverlay`, `Home Linn`, `Old Home`, and `Case Studies V2`

MCP `getNodeXml` could not find those stale IDs in the current project tree. This suggests the publish graph may still include old/deleted A/B or template artifacts.

The cache also contained older remote override imports like:

- `Copyright.js` from Framer's modules CDN

But current Framer-visible override files now include valid local compatibility exports.

## Likely Root Cause (May 3 diagnosis — partially resolved)

Originally suspected:

1. A stale hidden page/component from the original Turner template or A/B test is still included in Framer's publish graph.
2. That stale artifact references a code override that Framer considers missing.
3. The unfinished A/B test named `Index` may be keeping duplicate `/index` variants or old graph references alive.

May 6 update: the duplicate `/index` page (`yKKOMVNs6`) has since been deleted, and the project now contains a single `/index` (`u2LOaBT5q`). The deployment timestamp at `https://khaki-ship-257706.framer.app` advanced to May 2, 2026 18:55 UTC, indicating publish was successful at least once after this handoff was written. If the `Code Override Missing` warning has fully cleared, this section is historical context only; if it's still appearing, retry the steps below now that the duplicate `/index` is gone.

Supporting evidence (as of May 3):

- Framer shows `A/B test needs configuration.`
- Local generated cache contains stale `YIWFDAfhW`/`SmkNoZhed` artifacts that do not appear in `getProjectXml`.
- The visible/current override files all export valid overrides, but Publish still reports `Code Override Missing`.

## Recommended Next Steps

1. Reopen Framer MCP plugin and run `getProjectXml` to confirm the current project map.

2. Inspect the unfinished A/B test `Index`.
   - It currently asks for a conversion step.
   - Do not delete or disable the A/B test without user approval.
   - If acceptable, either complete the A/B test setup or remove/disable it to see whether the stale publish graph clears.

3. Inspect the (single) `/index` page.
   - Confirm it contains `ImageMaskReveal` with `activation="always"` (verified May 6: instance `qf2vKr_sV`).
   - Look for any visible Code Overrides inspector rows showing a file but no export.
   - In particular check footer/copyright text nodes on desktop/tablet/phone breakpoints.

4. Inspect the Footer component `xxIb0BkhJ`.
   - Cache showed override nodes:
     - `V2UrY_w8C`
     - `Jzuez2bns`
   - Ensure any copyright/year override on Footer is set to a valid local file/export, preferably:
     - File `Copyright_year`
     - Override `AutoCopyrightStatement`

5. If the missing override is hidden in stale A/B/template artifacts:
   - With user approval, remove or pause the unfinished A/B test.
   - With user approval, remove the duplicate or stale `/index` page if it is not needed.
   - Then retry Publish.

6. If Framer still blocks publishing:
   - Duplicate the clean current `/index` page into a new route or replace the stale route structure carefully.
   - Preserve the current working pages and components.
   - Retry publish after the stale graph is gone.

## Things Not To Do Without User Approval

- Do not delete the A/B test.
- Do not delete either duplicate `/index` page.
- Do not delete CMS items.
- Do not remove pages/components just because they appear stale.
- Do not publish if Framer shows a new warning beyond the already-known code override blocker without reviewing it.

## Verification After Publish

After publishing succeeds:

1. Open `https://khaki-ship-257706.framer.app` without query parameters.
2. Confirm the image reveal activates without `?imageReveal=1`.
3. Scroll the home page and verify case study thumbnails mask from bottom to top.
4. Confirm default thumbnail strokes are gone, and only CMS-enabled projects show the optional stroke.
5. Check `/case-studies`, `/case-studies/:slug`, `/info`, `/contact`, and `/index` for obvious image reveal regressions.
6. Confirm there is no visible image bounce outside the thumbnail container.
7. Confirm the live deployment timestamp updates in Framer.

## Short Diagnosis For Claude

The reveal implementation is done; the problem is not primarily animation code anymore. The current blocker is Framer's publish validation: `Code Override Missing`. Visible override files now export valid override functions, but Framer's generated cache still references stale/deleted Turner-template or A/B-test artifacts, especially `SmkNoZhed` and `YIWFDAfhW`. The unfinished `Index` A/B test and duplicate `/index` pages are the most suspicious places to start.
