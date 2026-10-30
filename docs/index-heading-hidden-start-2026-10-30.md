# Index heading hidden start — 2026-10-30

The native Index heading's Appear → Enter effect started at Y=93px inside a 113px-tall clipping wrapper. At mobile size the first-paint screenshot showed two thin letter fragments before animation began.

Changed the existing native Framer effect's Y offset from **93px to 120px** on Index text layer `M_Ry0NG_m`, page `u2LOaBT5q`. The phone and tablet instances inherit the effect. The native animation remains the owner; no helper, text style, duration, easing, opacity, mask size, or final layout was changed. Used Framer's editor because MCP's node XML does not expose appear effects.

Published and verified:

- Initial server-rendered state at 320, 390, 430, 809, and 1200px places the entire title box 7px below the mask's bottom edge.
- Mobile direct load and Home → Menu → Index both begin with the title fully hidden (Y=120px), then settle at Y=0.
- Desktop direct load begins fully hidden and settles normally. Desktop navigation retains its existing transition/rise behavior and settles normally; its earliest sampled frame was already in motion.
- Mobile final title top remains 101px; desktop remains 151px. Before/after screenshots confirm removal of the sliver without changing the final heading layout.
- This was a native effect-only edit; no application code changed. Verification used the published Chromium browser, including JavaScript-disabled capture of the initial HTML to isolate first paint.

Evidence: `output/playwright/index-heading-2026-10-30/`.
