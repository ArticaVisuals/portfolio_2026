# Case Study Work In Progress Gate

Use `CaseStudyWorkInProgressGate.tsx` when a bespoke case-study page should be
reachable from the site but hidden behind a simple launch-safe placeholder.

## What It Does

- Defaults to `Status: Ready`, rendering as a hidden 1px helper.
- When switched to `Status: Work in Progress`, portals a full-viewport overlay
  over the published page.
- Matches the 404-style direction: Cream background `#f6f6f6`, Forest Green text
  `#233324`, centered message.
- The centered `Work in progress` text is a real button. It calls browser back
  for same-origin referrals and falls back to `/case-studies` for direct visits.
- Locks document scroll while active so unfinished content cannot be reached
  behind the overlay.
- Sets the background page inert while active, so keyboard focus cannot tab into
  hidden unfinished content.

## Framer MCP One-Shot Steps

1. Create a new Framer code file from `CaseStudyWorkInProgressGate.tsx`.
2. Add one instance near the top of every bespoke case-study page root.
3. Keep finished pages at `Status: Ready`.
4. Set unfinished pages to `Status: Work in Progress`.
5. Leave the default copy/colors unless the live `/404` page has drifted.
6. Publish, then browser-check one finished case study and one WIP case study.

## Local QA

Run:

```bash
node tools/case-study-wip-gate-visual-qa.mjs
```

The runner builds the actual TSX component into a local browser harness and
captures artifacts in:

`output/playwright/case-study-wip-gate-qa-2026-06-14/`

Current pass covers:

- WIP overlay at `1200x900`, `810x900`, and `390x900`.
- Ready mode leaves page content visible and scrollable.
- WIP mode locks scroll and covers the viewport exactly.
- Direct WIP click falls back to `/case-studies`.
- Same-origin WIP click goes back to the referrer page.
- Keyboard Tab lands on the WIP action and shows a visible focus outline.

## Controls

- `Status`: `Ready` or `Work in Progress`.
- `Label`: defaults to `Work in progress`.
- `Fallback`: defaults to `/case-studies`.
- `BG`: defaults to Cream.
- `Text`: defaults to Forest Green.
- `Font`: defaults to the GT Standard / Manrope stack used elsewhere.
- `Desktop`, `Tablet`, `Mobile`: responsive text sizes.
- `Layer`: high z-index for sitting above page content and nav.
- `Scroll`: locks or allows page scroll while active.
- `Canvas`: shows or hides a small authoring preview in Framer canvas.

## Placement Notes

Place it once per case-study page, ideally beside the other page-level helpers
like `PageTransition` and `CaseStudyControllers`. It is intentionally a separate
drop-in component instead of being merged into those controllers so WIP status
can be toggled per bespoke page without changing shared case-study behavior.
