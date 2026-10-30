# Case-study mobile text, media and autoplay — 2026-10-30

Scope: all 17 case-study routes, using the existing 809px mobile breakpoint, 20px content gutters, typography, colors and media-gap tokens. Desktop layouts retain their authored columns and text widths. Mobile Index navigation prototypes remain local and are not part of this change.

## Text and media

The 390px audit found all 117 long paragraphs already occupied the content width, but `text-wrap: pretty` shortened some lines. Wider mobile checks exposed 680px text caps and older half-width intro/credits columns; 320px checks also exposed minimum-width constraints that exceeded the available 280px column.

NavigationScrollGuard's parser-time mobile stylesheet now uses normal wrapping for case-study body text, full-width rich-text containers, and single-column legacy intro/credits layouts. Canonical-route scoping includes older pages without a bundled CaseStudyControllers instance. Named media rows use their Framer names; unnamed legacy rows use their inspected stable export classes. If those native sections are rebuilt, review the class mappings in this stylesheet.

CaseStudyJustifiedMediaGrid stacks every item below 810px regardless of an older instance's 240px Stack Below value. Server-rendered mobile CSS reserves each item's aspect ratio before measurement; authored desktop row calculation is preserved. DoubleStackGalleryGrid also stacks its two smaller items. Native media rows and Yomo's nested video frame fill the existing content column.

## Autoplay

Lazy gallery videos retain their authored autoplay intent for CaseStudyVideoManager. Muted clips also set their default muted state, remain inline, and retry on loaded-data/can-play after source restoration. Pending play requests are deduplicated; far-away clips still release their sources. Native controls are suppressed only for muted autoplay videos on mobile and restored on desktop. Manual films and lightbox videos retain their existing ownership.

The existing Wolff Olins CaseStudyControllers was outside the page; it is now mounted inside its Desktop breakpoint and inherited on mobile. National Park Playing Cards' joker clip returned HTTP 403 from Cargo; the node now uses the project's correct existing optimized H.264 clip. The node's dormant srcFile was a different HEVC video, so it was deliberately not selected. Two WhatsApp clips also referenced an unavailable external host. Clip 04 was uploaded from the matching existing optimized asset; clip 03 reuses its verified Framer-hosted derivative. Native edit IDs and source details are recorded in the QA folder's native-edits.json.

## Verification

Evidence is in `output/playwright/case-study-mobile-flow-2026-10-30/`. The `verified-*.json` files consolidate the latest passing checks, including rechecks of repaired sources:

- All 17 routes checked at 320, 390, 430, 809 and 1200px for paragraph width, single-column media and document overflow.
- Published checks use fresh contexts, with a hydration-settled recheck where the initial resize happened during loading.
- Chromium scroll-through of 139 rendered native video instances across all 17 routes. The Cargo joker and two WhatsApp source failures found in this pass were repaired and rechecked.
- WebKit scroll-through on Gaia, AirPods, Motion Connect, Peak Energy, National Park Playing Cards Wolff Olins and WhatsApp. Gaia's joyful-discovery clip plays without a tap; AirPods' autoplay clip has no native controls on mobile.
- Framer typechecks returned no diagnostics for changed code components.
- npm test: 35 Play performance checks and 56 continuity scenarios passed.

Browser/device restrictions can still reject autoplay; the checks above use normal browser playback policy without a user gesture. Manual YouTube/Vimeo films remain manual.
