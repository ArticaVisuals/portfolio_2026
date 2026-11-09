# Final mobile review — 30 October 2026

Read-only review of the published site. No source, Framer, publishing, or Git changes.

Scope: Home, Index, About and all 17 linked case studies. Chromium mobile emulation at 320, 390 and 430 CSS pixels; targeted WebKit playback check. This is not a physical iPhone test or a complete assistive-technology certification.

## Confirmed findings

1. **Index divider appearance (polish).** Navigation borders and project rules are both 1 CSS pixel. The navigation uses rgb(132,132,132); project dividers use rgb(20,20,20). Color, rather than stroke width, creates the visual mismatch. Reuse the project divider token in the navigation if they should appear identical.
2. **Optro / CRX footer differs (consistency and touch).** Footer primary labels compute to 40px, versus 32px on Home, About, Gaia and AirPods. LinkedIn/Cosmos/GitHub rows are only 40px high versus the shared 44px target. The email row wraps taller. Apply the same shared footer treatment to this route.
3. **Gray text contrast (accessibility).** Home service pills measure 3.43:1; About testimonial metadata 3.34:1, below the 4.5:1 threshold for this small text. Seek Truth's gray subtitle on black is 2.68:1, below the 3:1 large-text threshold. Caliper metric labels also produce contrast failures (2.45:1). Adjust existing context-appropriate text tokens while retaining hierarchy.
4. **Remaining small touch areas (usability).** Carousel arrows on Simon & Schuster, Weaponized Innocence and Seek Truth measure 30×30px. Simon's hit-test confirms there is no invisible expansion past those bounds. Seek Truth's dot targets measure approximately 5px high. About awards/press links have 15–33px text-line bounds; the mobile menu Email link is 39×44px. Enlarge interactive boxes while preserving visual text sizes. Small inline links are not automatically WCAG failures; these measurements are against the requested comfortable 44px target.
5. **Heading semantics differ (accessibility).** Simon & Schuster has no H1: the project title is H2. Several other case studies likewise have no visible H1. Optro and Independent Lens expose the title and individual subtitle lines as multiple H1s. Use one project-title H1 and appropriate subtitle semantics.
6. **Link semantics (accessibility).** The Simon & Schuster strategy-poster PDF and National Park Playing Cards TikTok/image link have no accessible names. Home View All contains an extra nested focusable link; axe flags overlapping/obscured hit areas. Give linked media descriptive accessible names and make View All a single focusable target.

## Confirmed strengths

- All 20 routes loaded. No horizontal page overflow at 320/390/430px.
- Every sampled MENU text endpoint aligned to the 20px right content gutter at 390px. Actual navigation Home → Index → Gaia → Back → About preserved the menu bounds (60×44px, right edge 370px), with no page overflow. Escape closes the menu.
- Case-study body paragraphs measured full content width (350px at a 390px viewport); no remaining narrow side-by-side case-study media was detected.
- Main menu route targets are 350×66px. New Index disclosure controls remain usable and compact.
- Shared mono interface text on Home, Index and About remains 13px.
- Initial video stalls/errors from the broad scan did not reproduce in isolated checks: Home's Peak thumbnail and Gaia/AirPods heroes played muted, inline, without controls; Gaia also played in WebKit. A second sequential pass confirmed all 15 Gaia, 11 AirPods and 3 Simon & Schuster videos played automatically with no native controls or media errors. Do not classify the earlier transient samples as confirmed playback regressions.

Evidence is recorded in batch-0 through batch-3.json, mobile-targeted.json, carousel-recheck.json, mobile-journey-final.json and associated screenshots in this folder. Early screenshots can catch reveal transitions; confirmed findings above rely on settled measurements and targeted rechecks.
