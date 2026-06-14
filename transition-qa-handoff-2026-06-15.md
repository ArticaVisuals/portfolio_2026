# Portfolio 2026 Transition QA Handoff

Date prepared: 2026-06-14
Prepared for: Micah + Claude MCP QA

## Morning Summary

This pass fixes the `/index` transition regressions without layering another custom
heading reveal on top of Framer's native load-in animation.

Completed locally and uploaded to the Framer draft code files:

- `PageTransition.tsx`
  - Keeps the `/index` heading hold only as a route-level safety pin during
    same-document navigation.
  - Replaces the earlier explicit `Index` heading replay with
    `releaseIndexHeadingHold()`, which only clears the hold and returns ownership
    to Framer's native heading animation.
  - Skips the `Index` heading in generic appear replay on `/index` so it cannot
    animate twice.
  - Passes `skipIndexHeading` through same-document and cross-document fallback
    appear capture paths.
  - Preserves the Home/Work re-entry fix that captures destination appear state
    after the route commit, preventing the flash-then-disappear race above
    `Selected Work`.

- `IndexPage.tsx`
  - Smooths index nav fade timing from top row to bottom row with one consistent
    fade preset: 820ms, `cubic-bezier(0.22, 1, 0.36, 1)`, 120ms base delay, 92ms
    row stagger.
  - Moves list-row reveal from viewport-only triggering to a page-level reveal,
    so offscreen rows are already marked appeared before the user scrolls down.
  - Gives list titles/meta a deterministic top-to-bottom delay using
    `INDEX_CONTENT_REVEAL_PRESET`.
  - Adds `GridMediaFrame` so grid thumbnails fade in with case-study-like media
    timing: 620ms, `cubic-bezier(0.22, 1, 0.36, 1)`, 140ms base delay, 58ms item
    stagger.

Reference analyzed:

- `https://www.richardekwonye.com/`
- Useful takeaway: his consistency comes from a clear ownership model: one page
  transition rhythm plus repeated text/media reveal rules, without multiple
  systems fighting over the same heading.

## Current Timing Targets

- Route sheet duration: 700ms.
- Destination commit buffer before new-state capture: 90ms.
- New-state hold capture buffer: 24ms.
- General type reveal:
  - delay: 90ms
  - duration: 900ms
  - stagger: 90ms
  - easing: `cubic-bezier(0.22, 1, 0.36, 1)`
  - hidden transform: `translateY(115%)`
- `/index` heading:
  - owned by Framer's native heading appear animation.
  - transition code may temporarily hold it hidden, then release it.
  - transition code must not run a second custom heading reveal.
- `/index` nav fade:
  - duration: 820ms
  - base delay: 120ms
  - row stagger: 92ms
  - easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- `/index` list reveal:
  - base delay: 130ms
  - row stagger: 64ms
  - column stagger: 24ms
  - max row index: 34
- `/index` grid media fade:
  - duration: 620ms
  - base delay: 140ms
  - item stagger: 58ms
  - max item index: 24
  - easing: `cubic-bezier(0.22, 1, 0.36, 1)`

## Framer Draft State

Latest MCP readback showed the Framer draft code files contain the latest local
logic:

- `PageTransition.tsx`: `codeFile/gmalnRr:default`
  - latest insert wrapper seen:
    `https://framer.com/m/PageTransition-br4HFc.js@bbSlpLfHHbqvIK6OnvX4`
  - local SHA-256:
    `39a566b1c4cecadd7512c349c05d93eeeb7bf76aaa12f1bef44bcf89084aba79`
- `IndexPage.tsx`: `codeFile/rgAZFOv:default`
  - latest insert wrapper seen:
    `https://framer.com/m/IndexPage-msQHCf.js@4KN1kk4GdkWbPm8a3hJU`
  - local SHA-256:
    `6f8370ad130ca2d4e38dfc2ab39064499c4129a98b16394d805b9b44632e4e97`

Important: production did not republish after these final uploads. The published
URL still reported the earlier deployment timestamp during Codex QA:

- Published URL: `https://khaki-ship-257706.framer.app`
- Production/staging deployment time observed: `1781453167862`
  (`2026-06-14T16:06:07.862Z`)

The in-app browser was redirected to Framer login when attempting to open the
editor, and no MCP publish tool was available in this session. Claude should
publish the latest Framer draft before treating published visual QA as final.

## Verification Already Run

Static checks:

- `git diff --check -- PageTransition.tsx IndexPage.tsx` passed.
- `npx --yes esbuild PageTransition.tsx IndexPage.tsx --bundle --format=esm --platform=browser --external:react --external:framer --outdir=/tmp/portfolio-transition-index-final-owner-check --log-level=warning` passed.

Subagent/code-path review:

- Read-only subagent review confirmed the old `releaseIndexHeadingHoldWithReveal`
  path is gone locally.
- It recommended also preventing generic replay from targeting the `Index`
  heading. That guard is now implemented inside `buildAppearAnimations()` and
  passed through the active-transition fallback.

Local component harness QA:

- Artifact directory:
  `output/playwright/transition-mcp-live-2026-06-14/index-local-harness-qa/`
- Harness source:
  `output/playwright/transition-mcp-live-2026-06-14/index-local-harness/`
- Result JSON:
  `output/playwright/transition-mcp-live-2026-06-14/index-local-harness-qa/index-local-harness-qa-results.json`
- List result:
  - 66 list reveal targets.
  - 0 hidden by the settled sample.
  - 44 offscreen targets.
  - 0 offscreen hidden before scroll.
  - 0 hidden after scrolling to bottom.
- Grid result:
  - 15 grid media targets.
  - First three media animations at 100ms had delays 140ms, 198ms, 256ms.
  - All used duration 620ms and `cubic-bezier(0.22, 1, 0.36, 1)`.
  - 0 hidden by 2200ms.
  - No console/page errors captured.

Published URL QA caveat:

- Artifact directory:
  `output/playwright/transition-mcp-live-2026-06-14/index-content-grid-final-qa/`
- The published run still showed old production behavior:
  - `Index` heading animation calls included an extra custom 900ms reveal.
  - Grid media lacked `data-idx-media-appeared`.
  - Offscreen list rows did not reflect the final page-level reveal.
- Treat this as evidence that production was stale, not as a failure of the
  final draft code.

Attempted latest-module preview:

- Artifact directory:
  `output/playwright/transition-mcp-live-2026-06-14/index-latest-module-preview-qa/`
- The substitution run found the latest Framer module URLs but `swaps: []`,
  meaning the published deployment did not request those code-file module URLs
  directly. It could not preview the final draft code against production.

## Claude MCP QA Checklist

1. Confirm the Framer draft still contains the latest `PageTransition.tsx` and
   `IndexPage.tsx` code.
2. Publish the latest Framer draft to production.
3. Test with a fresh browser profile or disabled cache on
   `https://khaki-ship-257706.framer.app`.
4. Verify Home initial boot:
   - Boot loader still behaves as before.
   - Home hero reveal is not delayed or double-replayed.
5. Verify Home -> `/index`:
   - `Index` does not pop instantly.
   - `Index` animates once, not twice.
   - No late custom replay starts after the heading is already visible.
   - Header/filter/list text comes in with consistent pacing.
   - After 2.5s, `document.documentElement.hasAttribute("data-pt-index-heading-hold")` is `false`.
6. Verify direct `/index` reload:
   - No stuck hidden title.
   - No double heading animation.
   - CMS projects load normally on the clean `/index` URL.
7. Verify `/index` list view:
   - Nav fades from top row to bottom row, not arbitrary/sprinkled.
   - List rows continue their reveal sequence through the offscreen rows.
   - After the initial reveal settles, scrolling down does not trigger delayed
     first-time appearances for bottom rows.
8. Verify `/index` grid view:
   - Thumbnails fade in with the same smooth media feel as the case-study media.
   - Hover/video behavior still works; the wrapper fade should not break the
     existing media hover transform.
9. Verify `/index` -> Work/Home:
   - No one-frame flash of Home elements above `Selected Work`.
   - Hero, utility links, `Selected Work`, and project cards do not blink off
     after appearing.
10. Verify `/info` -> Work/Home and `/play` -> Work/Home:
    - They remain close to the good baseline Micah called out.
11. Verify desktop, tablet, mobile:
    - Main breakpoints: 1200px, 810px, 390px.
    - Title and nav text do not overlap or clip.
12. Verify reduced motion:
    - No trapped hidden heading or invisible content.
13. Check console:
    - No transition-related errors.

## Known Caveats

- Production needs a Framer publish before final visual QA can pass against the
  actual public URL.
- Query-string cache-busting URLs can make the Framer CMS section linger at
  `Loading Work... / 0 Projects`; verify the clean published `/index` URL after
  publish.
- The local harness validates the `IndexPage.tsx` reveal logic and timing with a
  Framer stub. It does not validate real Framer CMS media hydration.
- Framer recoverable hydration warnings `#425`/`#422` were present in earlier
  published runs and should be investigated separately only if they correlate
  with visible flicker.
- The worktree already had unrelated local changes before this pass. Do not
  revert unrelated files while QAing transitions.

## Main Files To Inspect

- `PageTransition.tsx`
- `IndexPage.tsx`

## Most Important Code Paths

- `PageTransition.tsx`
  - `armIndexHeadingHold`
  - `scheduleIndexHeadingPathRelease`
  - `releaseIndexHeadingHold`
  - `buildAppearAnimations`
  - `replayDirectTypeReveals`
  - `holdAppearAnimations`
  - `onClickCapture`
  - `installScript`

- `IndexPage.tsx`
  - `INDEX_NAV_FADE_PRESET`
  - `INDEX_CONTENT_REVEAL_PRESET`
  - `INDEX_MEDIA_FADE_PRESET`
  - `useIndexAppearTrigger`
  - `MaskedSlideText`
  - `FadeInText`
  - `GridMediaFrame`

## Suggested Claude Prompt

Use this prompt once Claude has MCP and publish access:

```
Please publish and QA the Portfolio 2026 page transitions after the latest PageTransition.tsx and IndexPage.tsx changes. Focus on Home -> /index, direct /index reload, /index list/grid views, /index -> Work/Home, /info -> Work/Home, and /play -> Work/Home. Confirm the Index heading animates once only, with no late custom replay, and confirm data-pt-index-heading-hold clears after navigation. Check that the index nav fades smoothly top row to bottom row, list rows are already revealed before scrolling to the bottom, and grid thumbnails use the new smooth media fade. Test desktop/tablet/mobile breakpoints and reduced motion. If anything is still off, make the smallest scoped fix and re-publish/retest.
```
