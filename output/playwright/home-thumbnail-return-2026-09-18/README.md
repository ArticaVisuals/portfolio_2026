# Home thumbnail return flash — 2026-09-18

Published fix: HomeSelectedWorkGrid (`FecepLS`), `@ld1pjb3HJlY3xbtefUGD`.

The grid previously cleared live CMS rows on every route remount, hid cached posters,
and faded both poster and video opacity. A Gaia → Home baseline first sampled Home
at 33ms, complete-but-hidden posters at 65ms, and fully opaque first-row media at
541ms. The first visible video was also deferred behind IntersectionObservers.

The fix caches fetched CMS rows in memory (and revalidates), uses an always-opaque
poster backing, reveals ready videos without an opacity fade, and eagerly mounts
and preloads the first two video cards. Media keys still refresh changed CMS
sources. Video elements are not retained off-route. CMS controls and hover
transforms are unchanged.

## Production verification

All times below are relative to the start of the return probe, which runs just
before navigation, and describe this Chromium run, not a cross-device guarantee.

| Viewport / return | First grid + opaque posters | First ready videos | Blank grid media frames |
| --- | ---: | ---: | ---: |
| Desktop 1200px / logo | 40ms | 90ms | 0 |
| Desktop 1200px / browser Back | 10ms | 459ms | 0 |
| Mobile viewport 390px / logo | 36ms | 128ms | 0 |
| Mobile viewport 390px / browser Back | 11ms | 219ms | 0 |

All ordinary returns had zero loading-placeholder frames, opaque ready posters
throughout video startup, and no JavaScript page errors. The delayed-video probe
added 700ms before MP4 requests continued. Network interception also forced an
18–24ms poster reload on arrival; after that, posters stayed opaque throughout the
remaining video delay. This does not promise instantaneous media under an empty
browser cache or failed poster request. Mobile testing used a Chromium viewport,
not physical iOS Safari.

Fresh desktop boot recorded zero playing selected-work videos while the hold was
active and two afterward. Framer typecheck returned no diagnostics. `npm test`
passed all 35 existing Play performance guards; `git diff --check` passed.

Files: `baseline-frames.json`, `verified-frames-final.json`,
`verification-summary.json`, `verify-return.js`, `desktop-after.png`, and
`mobile-after.png`. The published component source is mirrored in
`code/components/HomeSelectedWorkGrid.tsx`.
