# About mono row wrapping — November 6, 2026

Published to https://micahhoang.com/about and reviewed in WebKit at 390, 810,
and 1440 CSS pixels.

The mobile About mono paragraph rule in NavigationScrollGuard forced paragraphs
into wrapping flex containers and each linked fragment into an inline-flex box
with a 44px minimum height. A paragraph containing separate project and award
links consequently occupied 88px and appeared to have inconsistent leading.
Removing the native two-line clamp alone did not resolve this runtime rule.

Removed those About-specific flex and link minimum-size overrides. Native rows
retain their existing 44px minimum; text links use normal inline wrapping.
The shared Small Mono style remains 13px, 130% leading, -0.01em tracking.
Updated ResumeAssetHost's pinned NavigationScrollGuard import to the corrected
compiled module (pTx162TLfxI2JDmD6Aq6), then republished.

Native Framer authoring change: 25 About-page mono text nodes changed from
textTruncation=2 to textTruncation=0, allowing natural wrapping without clipping.
These native layer settings are maintained in Framer rather than in TSX.

## Verification

- Framer typecheck: no errors for both changed code files.
- npm test: 35 Play performance checks and 56 grid continuity scenarios passed.
- Live WebKit: 390px, 810px, 1440px; no page errors or horizontal overflow.
- Mobile Simon & Schuster award text boxes: single lines 16.89px, naturally
  wrapped Fonts in Use row 33.80px (previously 88px).
- Visually reviewed mobile, tablet, and desktop captures. Desktop columns intact.
- Evidence: ../output/playwright/about-mono-wrap-2026-11-06/results.json and
  webkit-{390,810,1440}.png.

Only this fix and its evidence were staged; unrelated local changes were preserved.
