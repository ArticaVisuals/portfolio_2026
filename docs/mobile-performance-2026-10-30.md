# Mobile hero, video loading, and touch targets — 2026-10-30

Published to micahhoang.com through Framer. Runtime source was read before editing; the six edited local mirrors match their final live source.

## Changes

- CaseStudyControllers reserves the authored hero ratio in server-rendered mobile CSS, with sufficient specificity to beat the temporary generic 4:5 skeleton. Desktop CSS retains its existing selector and behavior.
- CaseStudyVideoManager can restore a visible, temporarily zero-height hero, while still excluding hidden breakpoint copies. Mobile lookahead is capped at 25% of the viewport; desktop retains the authored value.
- Poster refreshes no longer set preload=metadata repeatedly, avoiding conflict with offscreen source deferral.
- CaseStudyJustifiedMediaGrid keeps source URLs available to the lightbox but starts videos with preload=none and autoplay off until within 200px of the viewport. Authored aspect ratios and property controls remain intact.
- Shared mobile CSS in NavigationScrollGuard establishes 44px minimum targets for native social links, Index filter/view controls, and selected-work service pills. Pills now use 20px horizontal padding, reusing the existing mobile content inset. Existing type, colors, borders, and radii remain unchanged.
- Text Link outer targets expand while the original 13px label mask stays clipped. Mobile rolling-label translation is disabled to keep one label visible.
- ScrollToTopButton receives a 44px mobile target without changing its 16px internal animation mask.
- ResumeAssetHost pins the updated NavigationScrollGuard export so every route receives the shared mobile rules.
- Native AirPods controller instance kH0aauPmy: stableHeroRatio changed from 0 to 1.777778. Readback confirmed the value. Final desktop hero dimensions remain 1200×675.

## Verification

- Framer edits passed type checking. The existing remote Lenis import has a targeted TypeScript suppression for Framer's missing URL module declarations; dependency and runtime behavior are unchanged.
- `npm test`: 35 Play performance checks and 56 continuity scenarios passed.
- Three fresh 390px Chromium mobile contexts per case study: **zero CLS** on Gaia and AirPods. Both first videos remained 390×219.375 and resumed after scroll-away/return.
- Final repeat video resource transfer: Gaia ~7.11MB, AirPods ~5.28MB, versus ~26.39MB and ~16.52MB in the baseline. Transfer counts include partial/range requests; earlier runs varied. Native videos may still begin requests before hydration, so this is a reduction, not a claim of zero offscreen traffic.
- Home, Index, About targets checked at 320/390/430px: all selected standalone targets at least 44×44, no horizontal overflow. Index year filter and list view taps passed. View All navigates to Index. Mobile menu opens/closes after scrolling the AirPods gallery.
- AirPods deferred gallery video starts on approach (readyState 4, playing).
- Wider service pills verified at 320/390/430: Visual Identity 150×44, UX/UI 78×44, Strategy ~99.6×44. Desktop retains 10px horizontal padding and original ~26px pill height.
- Desktop Home and AirPods headline/hero geometry matched baseline. Gaia's dimensions and relative vertical positions matched; baseline capture had a scroll offset, so absolute viewport Y was not compared directly.
- About portrait/social baseline visually retained. View All screenshot confirms one visible label within a 44px link and 13px internal mask.

## Scope and limits

The Index filter list is taller to provide non-overlapping touch targets; no compact-filter redesign was introduced. Tests used Chromium touch emulation, not a physical iOS Safari device. Existing unrelated workspace changes were preserved and excluded from this commit.

Evidence and exact Framer export URLs: `output/playwright/mobile-fixes-2026-10-30/` (before/after browser JSON, final repeated-load JSON, touch results, screenshots, and live-exports.json). The shared manifest already contained unrelated edits and was left untouched.
