# Index motion experiment

Branch: `codex/index-motion-revamp`. Approved Polish baseline: `8670d0b` (pushed to main).

User authorized independent agent implementation of the previously discussed suggestions. This is an original implementation in the existing component, not an installed Pro recipe. Framer runtime has not been changed or published.

- Sliding Grid/List underline with measured alignment and resize handling.
- List/grid loading skeletons and a content reveal.
- Fixed-width count digits with brief crossfades and accessible count text.
- Interruptible mobile filter panel enter/exit motion, inert closing panels, focus return, instant keyboard dismissal, and resize settling.
- Scoped timing tokens: 150ms feedback/close, 250ms switch/open, 400ms reveal. Existing editorial easing retained. Reduced motion disables new animation.

## Review

Run `npm install` then `npm start` inside `code/review/index-motion-preview`; see its README for preview controls. The harness renders actual branch components with sample projects, a mocked CMS module, and a Framer shim. It offers the frozen approved baseline, viewport sizes, loading/empty/failure states, and reduced-motion simulation. It is not a full Framer staging site.

## Verification

- Both baseline and proposed component bundles compile with the preview build.
- Root npm test: 35 Play performance checks and 56 grid-continuity scenarios pass.
- git diff --check passes.
- Browser: desktop indicator alignment, filtering, stable count slot width, mobile filtering, Escape focus return and hidden/inert panels, loading aria-busy, and reduced-motion indicator duration of 0s checked.
- Independent review caught and resolved stale digit replay, accessible count text, and keyboard/resize dismissal edge cases.

A live Framer integration and published QA remain required after design approval.
