# Index motion review

Branch: `codex/index-motion-review`.
Base: `ee00f15` (published fixes pushed to main).
Status: proposal and scan only; no new motion applied or published.

## Requested scope

1. Grid/List: move the existing underline between options, roughly 250ms; stable on first paint and resize.
2. Loading: reserve list/grid space with quiet skeletons; reveal real CMS content when ready. No fixture data or manual fallback in production CMS mode.
3. Result count: cross-fade changed digits with a stable-width slot; avoid announcing intermediate animated copies.
4. Mobile filters: trigger-anchored entry and faster dismissal; preserve outside-click, Escape, focus restoration, resizing and multi-select behavior. Closing surfaces must become noninteractive immediately.
5. Timing: map relevant Index interaction timings by purpose to existing tokens, with reduced-motion handling. Preserve custom hero/nav choreography and Play performance contracts.

## Review and rollout

- Keep changes on this branch. Do not publish to the production Framer project before approval.
- Primary implementation target: `code/components/IndexPage.tsx`; preserve the mounted `IndexPageGridPreview.tsx` wrapper and CMS authoring controls.
- Verify rapid toggling, repeat open/close, keyboard operation, narrow/mobile layouts, loading/empty/success states and reduced motion.
- Include a runnable isolated preview before asking for design approval.
- Run npm test and targeted component/browser checks.
- The supplied global AGENTS.md requires choosing Polish or Revamp before running hosted fixes and stopping if a proposed fix touches component logic. A generic scan/fix does not guarantee implementation of the requested new stateful features.

[Full grouped scan](scan.md) · [Raw scan](scan.json)
