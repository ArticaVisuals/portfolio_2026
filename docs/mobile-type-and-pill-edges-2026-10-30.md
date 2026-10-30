# Mobile type audit and pill scroll edges — 2026-10-30

## Apple guidance applied to this portfolio

The installed `apple-design` skill was consulted, together with Apple's current [Typography](https://developer.apple.com/design/human-interface-guidelines/typography) and [Scroll views](https://developer.apple.com/design/human-interface-guidelines/scroll-views) guidance.

Apple recommends making additional scrollable content apparent; a partial item at the edge is one suggested cue. The portfolio-specific interpretation is a viewport-wide horizontal scroll area, with its first item aligned to the existing content gutter at rest. Apple does not prescribe this exact chip layout. Native browser scrolling supplies momentum and interruption without a custom gesture engine. Decorative edge gradients were not added.

Apple's native iOS typography reference uses 17pt as the default and 11pt as the minimum. Its default text-style examples include body 17/22, footnote 13/18, and caption 12/16. Those are native point-size benchmarks, not a requirement to mechanically substitute the same number of CSS pixels or adopt SF Pro. The existing GT Standard typography remains the design source of truth.

## Measured published type at 390px

| Surface | Current size / line height | Assessment and recommendation |
|---|---:|---|
| Home introductory paragraph | 15 / 19.5px | Small for sustained reading. Consider the existing 18px Body M value as the mobile reading baseline. |
| About paragraphs and testimonials | 14 / 19.6px | Highest-priority readability improvement. Raise the mobile value of the existing body style toward 18px, retaining its 1.4 leading (25.2px). |
| Gaia main narrative | 14 / 19.6px | Same issue as About. Use the same body-style adjustment rather than a new one-off style. |
| Gaia opening project paragraph | 15 / 19.5px | Bring it into the same mobile reading scale as the rest of the case study. |
| AirPods opening paragraph and project details | 15 / 19.5px | Same small reading scale as Gaia’s introduction. Include in a shared mobile body-style pass. |
| Home and Index service pills | 12 / 12px | Caption-sized and above Apple's minimum, but small for interactive labels. Optional improvement: existing 13px mono size and roughly 16–18px leading, retaining the 44px target. |
| Header, social links, taxonomy filters | 13px; 13–24px leading depending on control | Reasonable secondary/UI scale. Keep the target size independent from the glyph size. |
| Home headline | 58 / 66.12px | Intentional portfolio display type. No reason to shrink it simply to match a native app title. |
| Home section and menu headings | 42 / 42px | Clear hierarchy; menu links have 66px targets. Keep. |
| About and Gaia titles | 38 / 38px | Comfortable display size. Keep. |
| Gaia section headings | 20 / 22px | Useful existing secondary heading scale. Recheck relative emphasis if body type increases. |
| Index title | 72 / 82.08px | Large editorial display; not an Apple compliance failure. Lower priority than body readability. |

No typography changes were made: this was an evaluation. Recommended next work is a focused mobile body-style pass first, then an optional 12→13px pill-label change. Increasing small-label font size alone would not resolve the current #848484-on-cream contrast of 3.43:1; that color tradeoff was requested and documented separately. The published viewport meta is `width=device-width`, with no maximum-scale restriction. Physical iPhone text-size / Larger Text behavior remains unverified; browser checks do not establish native Dynamic Type support.

## Implemented pill fixes

- Home and Index mobile pill scroll viewports extend across the screen. The content inset is calculated from the actual parent width, retaining Home's 15px and Index's 14px gutters at 390px without a duplicated hardcoded inset.
- Pill labels and the 44px hit targets remain unchanged, with 24px horizontal padding and no wrapping.
- Added 4px vertical clearance on both sides of the row for fractional-pixel borders and existing focus outlines. Compensating vertical margins preserve the authored card spacing.
- Removed clipping only from the two Home content wrappers that blocked the viewport-wide row. Image masks stay intact; the full-width outer section continues to bound the content.
- Desktop rules remain outside this mobile-only change.
- Final NavigationScrollGuard export: `https://framer.com/m/NavigationScrollGuard-yDp6tN.js@63lmIUnLNs932UGT05Vq`, pinned by ResumeAssetHost.

Evidence: `output/playwright/pill-edges-type-2026-10-30/`. Framer typechecks passed; npm test passed 35 performance checks and 56 continuity scenarios. Published geometry checks cover 320, 390, 430, 809, and 1200px, with edge hit-testing and scroll-to-last-item checks on Home and Index.
