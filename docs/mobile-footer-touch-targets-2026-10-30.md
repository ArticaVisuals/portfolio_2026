# Mobile footer and touch-target corrections — 2026-10-30

Published through Framer. All visual changes are scoped to the existing mobile breakpoint (max-width: 809px); no new components, fonts, colors, or runtime dependencies.

## Changes

- Extend the existing mobile CTA rules to the legacy linked `Row` layers inside `Section CTA`, used on Optro. They now share the 32px main labels, 13px secondary labels, existing tracking, 10px gap and minimum 44px target height used by the other footers.
- Give About's mono awards/press links minimum 44px hit areas. Separate destinations remain separate links and wrap when needed. Preserve the original font, color, content, and destinations.
- Give mobile menu social links a 44px minimum width as well as height, including Email.
- Make rolling text links such as Home's View All a single interactive target on mobile. Remove the redundant inner span's link role/tab stop and pointer handling, while retaining its text and existing clipping mask. Restore original attributes when returning to desktop.
- Extend the existing ImageCarousel component used by Simon & Schuster, Weaponized Innocence and Seek Truth. Mobile arrows have 44×44px boxes, preserving the existing glyphs and colors. Pagination keeps its 5px dots/16px selected marker inside distinct 44×44px buttons. The single dot row scrolls horizontally, and selecting/advancing a slide brings its dot into view without scrolling the page.
- Preserve the live carousel's pre-existing easing constant while reconciling its local mirror. Update ResumeAssetHost's pinned NavigationScrollGuard import to the newly saved Framer revision.

## Verification

- Framer MCP returned empty typecheck diagnostics for all three saved files.
- esbuild compiled the two implementation files; `git diff --check` passed.
- Required `npm test` passed: 35 Play panning checks, 56 grid continuity scenarios, Safari burst guard and Chromium raw-transform checks.
- Live measurements at 320/390/430px on Home, About, Optro, Simon & Schuster, Weaponized Innocence and Seek Truth: targeted buttons/links at least 44×44px, with no horizontal page overflow. Optro's footer now matches Home's font family, weight and 32px/13px sizes.
- Chromium and WebKit synthesized touch checks passed for menu Email dimensions, View All navigation, carousel next-arrow activation, selecting the final dot among 35 slides, and hit-testing all About awards/press links. The dot strip remains 44px high and keeps the selected dot visible.
- axe target-size checks passed on Home, About, Optro and Seek Truth. This is a scoped target-size check, not a whole-site accessibility certification.
- Desktop 1200px comparisons: affected footer/link/arrow bounds and font sizes match the pre-change measurements on all six pages. Dot dimensions also match; the selected dot index can differ between captures because the existing autoplay continues.

Evidence: `output/playwright/mobile-target-fixes-2026-10-30/`, particularly `live.json`, `chromium-interactions.json`, `webkit-interactions.json`, `desktop-comparison.json`, and `target-size-audit.json`.
