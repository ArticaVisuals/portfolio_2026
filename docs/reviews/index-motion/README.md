# Index motion review

Branch: `codex/index-motion-review`.
Base: `ee00f15` (published fixes pushed to main).
Status: Polish applied on the review branch; live Framer site unchanged.

## Polish result (2026-11-11)

transitions-agent 0.11.2 completed one hosted Polish run (reported monthly usage 4/10). Source-only rescan: **33 → 35**, same 283 files.

- Index view-toggle transition now includes opacity and uses the quick duration token. Opacity remains 1 in the current states, so this is defensive coverage rather than a visible redesign.
- Scroll-to-top label rollover: 500ms → 400ms via a duration token.
- Design-system media hover explicitly declares its transform transition.
- Design-system lightbox: 250ms opening / 150ms closing. This does not change the production Framer lightbox.

Two generated patches initially targeted compiled mirrors. Their exact declaration changes were transferred to the corresponding IndexPage and ScrollToTopButton source declarations; compiled snapshots were restored. No component logic changed.

The previously requested new features below remain deferred: Polish does not add them.

### Preview

Run `python3 code/review/polish-preview/build.py`, then `python3 -m http.server 8765 --bind 127.0.0.1` from the repo root. Open http://127.0.0.1:8765/code/review/polish-preview/index.html. This is an isolated comparison of the affected interactions, not a full-site Framer staging deployment.

Verification: npm test and git diff --check passed. Browser confirmed lightbox opening at 250ms, closing at 150ms, Escape dismissal and focus restoration. Preview copies are omitted from the comparable scan because including before/after fixtures changes the denominator.


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
