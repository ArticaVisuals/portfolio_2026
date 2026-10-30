# Pill spacing and shared gray refinement — 2026-10-30

Follow-up to `mobile-performance-2026-10-30.md`, published through Framer.

- Mobile Home service pills and Index grid pills now use 24px horizontal padding and 44px minimum height. Existing typography, borders, and radii are retained.
- Both mobile pill rows use nowrap and horizontal overflow scrolling. Pills do not shrink or wrap; the page itself does not overflow. Scrollbars are hidden to retain the existing visual treatment. Desktop pill layout/padding remains unchanged.
- `/Colors/Stroke Gray`: rgb(112,112,112) → rgb(132,132,132), #848484. This is the rounded midpoint between current #707070 and original #979797, applied globally through the shared Framer style.
- Home code component instance `h0ZkBCWe1` stores separate `tagColor` and `strokeColor` controls; both were synchronized to rgb(132,132,132).
- Index wrapper instance `LpHsIkKp7` stores a separate `advanced.textTertiary` color; it was synchronized to rgb(132,132,132). Other advanced settings were preserved.
- Body `/Colors/Text Gray` stays #525252, and selected/hover brand green is unchanged.
- Contrast tradeoff explicitly communicated: #848484 on cream #F7F5F0 is 3.43:1, improved over the original 2.68:1, but below 4.5:1 for small text. This follows the user's explicit request to lighten the prior contrast adjustment.
- Shared responsive CSS remains in NavigationScrollGuard; ResumeAssetHost pins the final export `NavigationScrollGuard-yDp6tN.js@9aBhproytxLWMVh3IyVp`. Index wrapper's more-specific pill declarations are overridden only within the mobile query.

Validation: Framer typechecks passed; `npm test` passed all 35 performance checks and 56 continuity scenarios. Published Home and Index grid rows were checked at 320, 390, 430, and 1200px. Exact browser evidence is under `output/playwright/pill-refinement-2026-10-30/`.
