# Claude MCP Handoff: Case Study WIP Gate

Date: June 14, 2026

## Objective

Ship a launch-safe way to keep unfinished bespoke case studies reachable from
the portfolio structure while hiding their unfinished content behind a simple
404-style placeholder.

## Completed In Codex

- Added `CaseStudyWorkInProgressGate.tsx`.
- Added Framer property controls with `Status: Ready / Work in Progress`.
- Default `Ready` mode renders a hidden 1px helper.
- `Work in Progress` mode renders a full-viewport Cream overlay with centered
  Forest Green `Work in progress` text.
- The centered text is a button:
  - same-origin referrals use `history.back()`;
  - direct visits fall back to `/case-studies`.
- WIP mode locks scroll, uses `100dvh` plus `100vh` fallback sizing, and makes
  background page content inert/`aria-hidden` so keyboard focus cannot reach the
  unfinished case study behind the overlay.
- Added `tools/case-study-wip-gate-visual-qa.mjs`, a repeatable local browser QA
  runner.
- Added `case-study-wip-gate.md` as the working implementation note.

## Files To Review

- `CaseStudyWorkInProgressGate.tsx`
- `case-study-wip-gate.md`
- `tools/case-study-wip-gate-visual-qa.mjs`
- `output/playwright/case-study-wip-gate-qa-2026-06-14/visual-qa-result.json`

## Local QA Already Passed

Command:

```bash
node tools/case-study-wip-gate-visual-qa.mjs
```

Artifacts:

`output/playwright/case-study-wip-gate-qa-2026-06-14/`

Screenshots:

- `wip-desktop-1200.png`
- `wip-tablet-810.png`
- `wip-mobile-390.png`
- `ready-desktop-1200.png`
- `focus-desktop-1200.png`

Automated checks passed:

- WIP overlay covers the exact viewport at `1200x900`, `810x900`, and `390x900`.
- WIP text is centered horizontally and vertically.
- WIP colors match local tokens: Cream `#f6f6f6`, Forest Green `#233324`.
- Responsive text sizes match `30px`, `24px`, and `19px`.
- WIP mode locks scroll; wheel input does not reveal hidden content.
- Ready mode does not render the overlay and leaves content visible/scrollable.
- Direct WIP click reaches `/case-studies`.
- Same-origin WIP click returns to the referrer page.
- Tab focus lands on the WIP action and shows a visible focus outline.
- No page errors or console errors in the final local QA pass.

## Framer MCP Steps

1. Create a new Framer code file from `CaseStudyWorkInProgressGate.tsx`.
2. Place one instance near the top of every bespoke case-study page root, next
   to page-level helpers such as `PageTransition` and `CaseStudyControllers`.
3. Keep completed case studies at `Status: Ready`.
4. Set unfinished pages to `Status: Work in Progress`.
5. Leave defaults unless the live `/404` page differs:
   - `Label`: `Work in progress`
   - `Fallback`: `/case-studies`
   - `BG`: `#f6f6f6`
   - `Text`: `#233324`
   - `Desktop`: `30`
   - `Tablet`: `24`
   - `Mobile`: `19`
   - `Scroll`: `Lock`
   - `Canvas`: `Preview`
6. Publish to the Framer staging URL.

## Required Published QA

Run against staging after publish:

- Compare one WIP page against `/404` for typography, color, and centered layout.
- Visit one finished case study and confirm no overlay appears.
- Visit one WIP case study directly and confirm only the WIP screen appears.
- Click the WIP text after direct entry and confirm it lands on `/case-studies`.
- Click into a WIP case study from Home or `/case-studies`, then click the WIP
  text and confirm it returns to the previous page.
- On desktop `1200px`, tablet `810px`, and mobile `390px`, confirm no page
  content, nav, footer, media, or lightbox controls appear above the WIP overlay.
- Keyboard QA: press Tab on a WIP page and confirm focus goes to the centered WIP
  action, not hidden page links behind it.
- Check console for new errors, especially hydration, module import, or inert
  warnings.
- Confirm case-study page transitions remain skipped as documented in
  `PageTransition.tsx`; the WIP gate should not reintroduce transition flashes.

## Known Caveat

Local screenshots use browser fallback fonts because Framer-hosted fonts are not
loaded in the standalone harness. Final typography must be judged in Framer
staging against the actual `/404` page.

## If Bugs Appear

- If hidden page content can receive keyboard focus, inspect whether the gate is
  portaling to `document.body`; the background inert logic depends on the overlay
  being a body child after mount.
- If the overlay sits under nav or Framer chrome, raise the `Layer` control above
  the conflicting element.
- If a direct click does not land on `/case-studies`, check the `Fallback` prop.
- If the page flashes unfinished content before the gate appears, keep the
  component instance as high in the page root as Framer allows and verify
  `Status` is set to `Work in Progress` on every breakpoint.
