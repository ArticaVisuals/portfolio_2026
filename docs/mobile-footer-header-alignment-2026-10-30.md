# Mobile footer and header alignment — 2026-10-30

Published to micahhoang.com. Desktop layout rules were not changed.

## Footer optical spacing

ScrollToTopButton's mobile 44px target was laid out at the top of a 16px Framer instance slot. Its centered 16px label therefore sat 14px too low, close to the green CTA edge; the hit target also extended into the green section.

The component now offsets the mobile button by `(ROW_HEIGHT - 44) / 2` (-14px), centering the enlarged target on the original authored label slot. This preserves the existing layout spacing, 44px touch height, and internal animation mask. The target now ends before the green section.

Published screenshot pixel analysis compared clear cream rows below the visible SCROLL TO TOP glyphs with clear green rows above GET IN TOUCH, excluding the antialiased boundary row:

| Viewport | Above green edge | Below green edge |
|---|---:|---:|
| 320px | 23px | 23px |
| 390px | 22px | 22px |
| 430px | 23px | 23px |

Scroll-to-top tap verification returned scrollY=0.

## Header visible-label alignment

Native Mobile Navigation Menu Button `TolXtgnKs` changed `stackDistribution` from center to end. Its 60×44px touch target and 13px label mask are unchanged. Open variant inherits the alignment.

NavigationScrollGuard matches the native Header, Routes, and Social Links insets to the existing page gutters so opening the menu does not move the header edge:

- Home: 15px.
- Index: 14px at widths through 520px, 20px above that.
- Other pages: existing 20px default.

MENU right-edge measurements matched those gutters exactly on Home, Index, About, and Gaia at 320, 390, 430, and 809px. CLOSE matched on all four pages at 390px. No horizontal page overflow. Menu open/close and label masks verified.

Final guard export pinned in ResumeAssetHost: `https://framer.com/m/NavigationScrollGuard-yDp6tN.js@bOhkvrBt2lgAfHSHhSMH`.

Framer typechecks passed. `npm test` passed the 35 Play performance checks and 56 continuity scenarios. Evidence: `output/playwright/footer-gap-2026-10-30/`. Measurements are from Chromium touch emulation, not physical iPhone Safari.
