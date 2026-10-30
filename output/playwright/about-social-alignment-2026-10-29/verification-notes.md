# About social alignment — 2026-10-29

Published a native Framer layout edit on `/about` (`m8MBybo0d`). The four portrait-side Social Link frames (LinkedIn, Resume, Cosmos, GitHub) now use Stack Align End. The Desktop primary setting inherits through the breakpoints; Phone explicitly uses End as well. Desktop text-height links retain their existing appearance and location below the portrait.

Phone links retain fixed 44px height and 44px minimum width. Their 13px labels now sit at the bottom of each touch target, rather than centered 15.5px above its bottom. This aligns the GitHub text line with the bottom edge of the portrait while retaining a 44px row rhythm and each existing link destination. No fonts, colors, spacing tokens, header components, or code components changed.

Framer MCP failed to connect after plugin relaunch and editor reload, so the edit was completed using the native Framer inspector. Publish listed only `/about` as changed, with no new errors (existing optimization warning retained).

## Published browser checks

Fresh Chromium context at widths 320, 390, 430, and 699px: exact 0px difference between portrait bottom and final text-line bottom; every target at least 44px wide and 44px high; no horizontal overflow. The four labels remain 44px apart.

At 810 and 1440px, verified the existing layout with socials below the portrait; alignment-to-image is not applicable to that layout. No horizontal overflow. Screenshots saved at 390 and 1440px. `results.json` contains measured geometry and destinations; `verify.js` reproduces the check. Physical iOS Safari was not tested.
