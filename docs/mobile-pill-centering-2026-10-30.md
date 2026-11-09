# Mobile pill optical centering — 2026-10-30

Published Home and Index grid pills now share mobile vertical padding of 8px top / 7px bottom. This gives the existing mono capitals a half-pixel optical bias within their existing 44px targets. Previously Index retained 5px / 6px padding while Home used 7px / 7px.

The existing mobile media query in NavigationScrollGuard owns the correction; ResumeAssetHost pins its verified Framer export. Horizontal padding, scrolling, typography, colors, and desktop styling remain unchanged.

## Verification

- Framer typechecks returned no diagnostics for both updated components; published output contains the correction.
- Published Home and Index checked at 320, 390, 430, and 1200px. Mobile targets remain 44px with 24px horizontal padding, single-line rows, and no document overflow. Desktop retains its previous padding and sizes.
- At 390px/DPR2, diagnostic captures with integer positioning measured matching capital ink bounds at raster rows 35–53 inside 88px targets: optical offset +0.25 CSS px in both Home and Index. Diagnostic positioning/background changes existed only in the measurement browser.
- npm test passed all 35 Play performance guards and 56 continuity scenarios.
- Evidence: output/playwright/mobile-pill-centering-2026-10-30/published.json, verify.js, and published pill PNGs.

The separate mobile Index navigation prototypes are local review artifacts and are not part of this production change or commit.
