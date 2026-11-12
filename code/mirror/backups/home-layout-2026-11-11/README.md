# Home layout — November 11, 2026

Approved direction: retain the original Micah Hoang Heading 1 typography and hero spacing, remove the redundant Selected work label, and halve the divider-to-project spacing from the no-label preview.

## Framer changes

Home page: R6_F7xjGZ. This is a native Framer layout change; no TSX runtime change is required.

- XzikUe04m: visible=false. The original label is preserved in the editor for rollback.
- nFjim4UT5: gap 10 → 5px (phone retains its existing 0px override).
- qp7AaTYlq: bottom padding 60 → 30px.
- bJyb_ChpB: top padding 20 → 10px; explicit minHeight=0 to prevent Framer retaining the removed label's automatic minimum height.
- ZGsjsMX75qp7AaTYlq: phone bottom padding 50 → 25px.
- ZGsjsMX75bJyb_ChpB: phone heading top padding 20 → 10px.

Target divider-bottom to grid-top spacing: 45px desktop/tablet, 35px phone.

## Snapshots and rollback

- desktop-before.xml: full native Home tree before editing, including original text and layout.
- desktop-after.xml: native Home tree after editing.
- tablet-before.xml / phone-before.xml: breakpoint metadata; the MCP does not export replica children.
- original.html / original-tablet.html / original-mobile.html: rendered published DOM snapshots captured before the experiment, with runtime scripts removed. Fonts and media reference their original CDN URLs.

To restore the previous layout, show XzikUe04m, restore desktop section gap=10px, heading wrapper bottom padding=60px, heading top padding=20px, phone wrapper bottom padding=50px, and phone heading top padding=20px. Remove the explicit minimum height on bJyb_ChpB (the original height is fit-content). Keep the original hero Heading 1 unchanged.

The local A/B preview remains in output/playwright/home-name-preview in the primary workspace. The snapshots here preserve the old version independently of that running preview.

## Published verification

Published through Framer on November 11, 2026. Verified on https://micahhoang.com at 1440, 810, and 390px:
- Divider-to-grid gap: 45px desktop/tablet, 35px phone.
- Original Heading 1 retained (120px / 700 desktop).
- No Selected work heading in rendered content.
- All six project links remain present.
- No browser console errors; Framer emitted its existing warnings.
- published-after.html is the final production response, captured after the phone correction.

This change uses only native layout settings; no code components were modified.
