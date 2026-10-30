# Mobile typography, stable gutters, and footer — 2026-10-30

## Scope and design source

User authorized the earlier mobile typography recommendations along with correcting route-to-route header movement and inconsistent footer link sizes. Preserve desktop layout, typography, existing GT Standard families, colors, and pill behavior.

The installed Apple Design skill and Apple's Typography HIG informed the readability pass. Native iOS point sizes are a reference, not a CSS prescription. The portfolio's existing Body M 18px / 140% scale supplies the reading baseline; no new text style or typeface was introduced.

## Native Framer style edits

Edited the **S breakpoint only** through Framer's Assets → Text Styles controls (the MCP style tool cannot express breakpoint-specific values):

| Existing style | Before mobile | After mobile |
| --- | --- | --- |
| Body M | 14px / 140%, tracking 0 | 18px / 140%, tracking 0 |
| Body L | 15px / 130%, tracking 0.01em | 18px / 140%, tracking 0 |

Body L desktop remains 22px / 120%, tracking 0.01em; Body M desktop remains 18px / 140%. Display headings and secondary mono text styles remain unchanged. These native edits apply to paragraphs, testimonials, case-study introductions, and project details already using those styles.

## Shared responsive fixes

`NavigationScrollGuard` owns the existing SSR mobile CSS, mounted through `ResumeAssetHost`. Extended it instead of creating another helper.

- Removed the route-dependent header gutter (Home 15px, Index 14px, projects 20px). Mobile header, open-menu contents, Home content sections, Index container, CTA content, and shared footer use the existing 20px gutter. Full-bleed media and horizontal pill scrollports remain full width.
- Found older case-study CSS in CaseStudyLinkRepair and CaseStudyLightbox assigning 32px / -2px tracking to only email, LinkedIn and Cosmos; GitHub escaped the repair. A single shared SSR rule now covers all four CTA links across pages and takes precedence over those legacy patches.
- Main CTA links use the existing case-study footer 32px size / 1em line height and the existing heading -0.01em tracking. Secondary labels retain 13px / 1em and use the existing subtle 0.01em tracking value.
- CTA rows have a 44px minimum hit height and fill the available content width. At narrow widths, the email suffix can move below the name instead of clipping or shrinking the type. Other footer labels remain beside their links when space permits.
- Home and Index pills use the existing 13px mono label scale / 1.3 leading, with the existing 44px hit target, 24px horizontal padding, and nowrap horizontal scrolling preserved.
- Existing Scroll To Top / Get In Touch vertical spacing is untouched.

Pinned NavigationScrollGuard export: `https://framer.com/m/NavigationScrollGuard-yDp6tN.js@zJqPKTbdAHwVMUNxDtm6`.

## Validation

Framer code typechecks: no diagnostics. `npm test`: 35 Play performance checks and 56 continuity scenarios passed.

Browser evidence and scripts: `output/playwright/mobile-gutter-stability-2026-10-30/`.

Published checks completed:

- Home, About, Gaia, AirPods, and Index at 320, 390, 430, 809, and 1200px (25 route/viewport combinations).
- Every measured mobile body paragraph uses 18px / 25.2px leading. Mobile CTA links use 32px / -0.32px tracking; all ordinary rows are 44px high. The email row wraps its suffix at 320px and grows to 55px.
- All measured pages have document width equal to viewport width. Home and Index grid pill labels are 13px; all sampled pills share one Y position with 44px height.
- Header left edge stays 20px, right edge stays viewport minus 20px. A separate real-click journey sampled 551 rendered frames through Home → Gaia → Back → AirPods → Back → open menu → About. No horizontal edge movement, no page errors; menu remains 60×44px, open routes remain 66px high, and label mask remains 13px / overflow hidden.
- 1200px before/after comparison: typography, X positions, widths and heights unchanged within 0.05px. Y values during the existing desktop entrance animations were excluded from this comparison.
- Visually inspected published Home footer and About screenshots. Home footer optical blank gaps are 23px above and 22px below the green boundary at 390px, within the prior fractional-pixel tolerance.
- Verification used Chromium mobile viewport emulation, not a physical iPhone or native Dynamic Type test.
