# Seek Truth mobile heading reveal — 2026-10-30

Published native Framer change, limited to the Phone breakpoint (0–809px).

## Change

The subtitle previously wrapped across two visual lines inside one clipped animated frame. The mobile hero now contains three vertically stacked clipped frames:

| Text | Native frame | Native text | Entrance delay |
| --- | --- | --- | --- |
| Seek Truth | `TaoWJPxgCOUcx88gMd` | `TaoWJPxgCKQ8MYoBvt` | 0.1s |
| The visual art of | `TaoWJPxgCUAWs23Au5` | `TaoWJPxgChO1VHXAsp` | 0.3s |
| protest. | `TaoWJPxgCvqlqewwAR` | `TaoWJPxgCb5iJNjp6g` | 0.5s |

Page: `ghVZemnYZ`; Phone breakpoint: `TaoWJPxgC`; vertical parent: `TaoWJPxgCIPALaBzUO`.

The new frame was duplicated from the existing subtitle frame, preserving the existing Heading 2 Bold style, Text Gray token, and native appear effect. Its primary node `vqlqewwAR` is hidden; visibility is enabled only on Phone. The original subtitle has a Phone-only content override. Desktop and Tablet retain the full original subtitle and two-frame layout.

All mobile text rows remain 38px high, with the existing 3px bottom mask padding (41px frames), full content width, and 20px gutters. The third subtitle uses h2 to match the existing subtitle. Existing reveal easing `[0.16, 1, 0.3, 1]` and 2s duration are preserved; the new line uses the existing mobile subtitle Y offset of 39px. Native effects were edited through Framer UI because the MCP XML schema does not expose appear effects. No code components or dependencies were added.

## Verification

- Framer preview: three separate native rows; published change list contained only `/case-studies/seek-truth`.
- Chromium: 320/390/430px, three single-line text rows; no horizontal overflow. Published animation configuration confirms 0.1/0.3/0.5s delays.
- Desktop 1200px and Tablet 810px: before/after text, heading positions, widths, heights, colors, font sizes, and line heights match exactly. Third row absent.
- WebKit: 320/390/430px, three clipped 41px rows; no horizontal overflow.
- Evidence: `output/playwright/seek-truth-mobile-heading-2026-10-30/`.
- No build/tests required: changes are native canvas properties only.

## Follow-up findings, not changed

At 390px, the same multi-line-in-one-animated-block structure appears on:

- Weaponized Innocence: title and subtitle each wrap to two lines.
- Cellular Symphony: subtitle wraps to two lines.
- Wolff Olins × ArtCenter: title and subtitle each wrap to two lines.
- Independent Lens: final subtitle block wraps to two lines.

The sample inspected all other 16 case-study pages. Gaia, AirPods, Simon & Schuster, Motion Connect, Caliper, National Park, Yomo, Highland Harvests, and Peak Energy already separate their visible mobile hero lines. WhatsApp/Optro use different or incomplete hero content in this sample; no all-clear claimed for them.

Reduced-motion check found an existing limitation: native Framer appear transforms still animate when `prefers-reduced-motion: reduce` is active. This also affects the existing first and second Seek Truth rows; it was not changed as part of the requested native row/stagger fix.
