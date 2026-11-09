# Framer optimization warning — 2026-10-30

## Cause and native correction

Framer reported `Nested link detected on layer Stack due to parent layer Text Link` across 23 routes. Shared native Text Link component `dVTZgYLeH` had the `Link` variable (`bwVWMSt6G`) attached both to its outer frame and its inner animated Stack in the black and black-hover variants.

Removed the inner Link-variable assignments using the Framer inspector in `fYjqF5g84` and `ny4XsDWk_`. The outer frame retains the Link variable. Primary inner Stack `fKuOqu6WY` has no URL; a temporary inspection URL was cleared before publishing. Typography, layout, clipping, interactions and breakpoint styling were retained. No custom code components changed.

## Verification

- Published to micahhoang.com. Framer publish panel now shows No changes with no Optimization warning and no errors.
- Published Home at 390px: View all has zero nested links, retains its 44px target height, and clicking it reaches `/index`.
- Published Home at 1440px: Work, Play, Index, About and View all have zero nested links and retain their 13px desktop height and original destinations.
- Desktop View all switches to Text Link Black Hover, retains hidden overflow and has no nested links.
- Browser reported recoverable React hydration warnings during navigation. These are separate runtime diagnostics, not the resolved Framer publish optimization warning; no runtime component changes were made in this fix.

Framer is the runtime source of truth for this native component. This record documents the authored change; the component is not a local TSX mirror.

## Mobile clipping follow-up

Removing the nested link also removed `data-nested-link`, which the existing mobile mask CSS incorrectly depended on. This exposed both rolling labels inside the enlarged 44px target. Updated NavigationScrollGuard to select the Text Link's first child (the existing 13px mask) independently of link markup, and pinned ResumeAssetHost to guard revision `XPltTJtwijtjpUIZBAiN`.

Published verification at 320, 390 and 430px: hidden inner overflow, 13px mask, 44px target, no nested anchors, and exactly one label inside the mask at rest. Mobile touch navigation reaches `/index`. At 1440px the original 13px target, visible inner overflow and hover variant remain unchanged. Framer type checks and `npm test` pass; publish panel still has no optimization warning. Screenshot: `output/playwright/view-all-clip-2026-10-30/mobile-published.png`.
