# Mobile audit — October 29, 2026

Read-only audit of the published Home, About, Gaia, AirPods, Index, and Play pages. No Framer or application code changes made.

## Assessment

The design system is coherent: the new menu uses the same Heading 2 preset as Home, the existing palette is retained, and the latest About alignment is sound. Implementation integrity passes with remaining lifecycle and loading problems. The bounded source detector returned no findings for NavigationScrollGuard, IndexPage, and HomeSelectedWorkGrid; it cannot inspect native Framer layout or prove runtime quality.

| Dimension | Score / 4 | Evidence |
|---|---:|---|
| Accessibility | 2 | Navigation keyboard support works; remaining standalone touch targets are very small. This was not a full accessibility conformance audit. |
| Performance | 1 | Case-study videos transfer tens of MB before scroll; repeated first-load shifts. |
| Theming | 3 | Existing color and text styles are used on the inspected surfaces. Full token coverage was not re-audited. |
| Responsive design | 3 | No horizontal overflow at tested widths; portrait and landscape menu pass; Index and small targets need attention. |
| Implementation integrity | 3 | Shared system preserved; native layouts plus runtime layout corrections need coordination. |
| Total | 12 / 20 | Scoped audit: significant loading improvements available; no redesign needed. |

## Prioritized findings

### P1 — Gaia hero video collapses

Location: `/case-studies/gaia`, hero media, with CaseStudyVideoManager involved in source deferral.

On two fresh loads at 390×844, the hero video ended up 390×0px, paused, readyState 0, and marked `data-video-source-deferred="true"`. The saved screenshot shows the heading followed by project information, with no hero media. Four seconds after navigation the condition remained. AirPods' hero retained its 390×219px box.

Impact: the opening work is missing and its disappearing space contributes to movement below it. Reserve an intrinsic/aspect-ratio box before media metadata arrives and verify the source manager does not classify a temporarily zero-height hero as permanently offscreen. The manager's local source requires both width and height >=4px before restoring a source; this is a plausible contributor, not a proven sole cause.

### P1 — Case-study content jumps during initial load

Location: Gaia and AirPods, Credits & Info / Left Column; inspect hero sizing and the mobile descriptor-layout lifecycle together.

Two independent fresh loads reproduced layout-shift totals of approximately 0.543 for Gaia and 0.264 for AirPods, before any scroll or viewport resize. Gaia's Credits & Info top moved 464 → 801.5 → 314px; AirPods moved about 493.4 → 761.5 → 493.4px. The affected content temporarily left and re-entered the viewport around 1.7–1.9s into the confirmation load.

Impact: reading position visibly changes even though the header is now stable. Establish final mobile geometry before first paint, preferably in the native responsive layout, and avoid late layout corrections fighting the media dimensions. The local CaseStudyMobileDescriptorLayout injects styles after mount and scans style mutations; investigate it alongside the hero rather than assuming it alone causes the shift.

### P1 — Large video transfers happen before scrolling

Location: Gaia and AirPods initial media loading and source deferral.

In the unthrottled fresh-context confirmation, four seconds after navigation with no scroll, Gaia recorded approximately **29.1 MB** across 37 video resource entries; AirPods recorded **16.5 MB** across 18 entries. Entries can include partial/range requests, so these are measured transfer totals, not distinct file counts. Several downloaded videos were thousands of pixels below the viewport. Gaia's manager had deferred most sources by measurement time, after network transfers had already occurred. AirPods had three videos playing, including two below the initial viewport.

Impact: unnecessary mobile data, bandwidth competition, and potential battery cost. Defer offscreen source assignment before the browser can request the files; pausing or removing sources after mount is too late to avoid these transfers. Keep the visible hero prioritized and reserve poster/aspect-ratio geometry. Consider smaller mobile encodes after fixing request timing.

### P2 — Index filters dominate the initial mobile page

Location: `/index`, year/service/industry controls.

At 390×844 the expanded filters occupy the first screen and beyond. Grid/list controls appear around y=918px, with projects below them. Hydrating the CMS taxonomy also causes a reproduced initial shift of about 0.301: filter groups grow after initial render and push the project area down. The controls work: a synthesized tap on 2026 updates `?year=2026` and aria-pressed; list mode also responds.

Impact: visitors must scroll through the filter inventory before seeing work. A compact Filters disclosure with a clear active-filter summary could expose projects sooner and avoid expanding the entire taxonomy on load. Keep desktop layout intact. This is a proposed interaction improvement requiring implementation scope, not a change made by this audit.

### P2 — Small touch targets remain outside the repaired navigation

Location: Home social strip, shared footer, View All, Scroll to Top, and Index filters.

Measured standalone link/button heights:

- Home top social links and footer social links: **13px**.
- Home View All: **13px**.
- Scroll to Top on Home and case studies: **16px**.
- Index filter options: **24px**, packed into consecutive rows.
- Index grid/list buttons: approximately **31×28px**.

Impact: precise taps are required, particularly on the dense Index list. Extend invisible hit areas to the project's 44px target where feasible, without changing type size or visual baseline. For Index, combine larger rows with the compact filter treatment rather than making the already-long filter block taller.

The scan also found inline prose/recognition links and 40–42px large footer CTAs. These are lower priority and were not treated as automatic accessibility violations. Off-canvas Index registrar links were excluded from actionable findings. Empty image alt attributes were also not automatically called bugs because their parent links may supply the accessible name.

## Passing checks

- No horizontal page overflow on all six routes at 320, 390, 430, and 699px.
- No observed JavaScript page errors, failed HTTP responses, or broken loaded image resources in the sampled runs.
- Home and About had no measured initial layout shifts in the first pass.
- Mobile menu fits 320×568 and 667×375, with all links and Close visible and usable.
- Home Read More reaches About using a touch tap.
- Index 2026 filtering and list switching respond to touch.
- Play responds to a CDP-synthesized touch drag; the world transform changes, and Menu opens afterward.
- Heading 2 menu labels and 66px rows remain intact from the preceding verification.

## Recommended order

1. `$impeccable harden`: restore Gaia hero geometry and stabilize case-study loading.
2. `$impeccable optimize`: prevent offscreen video requests before they start.
3. `$impeccable adapt`: enlarge remaining standalone touch targets and compact Index filtering.
4. `$impeccable polish`: verify preserved hierarchy, spacing, and visual alignment after functional fixes.

## Evidence and limitations

`results.json` contains the six-route scan; `confirmation.json` contains the fresh-load repeat, video transfers, short-screen menu measurements, and interaction checks. Screenshots are in this directory. Scripts are included for reproduction.

Chromium with mobile viewport and touch emulation, on the current unthrottled connection. Play received synthesized touch events through CDP; this is stronger than a viewport-only check but not a physical-device test. Physical iPhone Safari, constrained cellular networks, 200% text zoom, and extended drag cancellation were not tested. Layout-shift values here are lab observations, not field Core Web Vitals. No claim of universal bug-free behavior or formal WCAG compliance.
