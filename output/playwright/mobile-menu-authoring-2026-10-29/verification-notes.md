# Native mobile navigation — 2026-10-29

## Published

- Native Framer asset **Mobile Navigation** (`qajbM_0Ju`), with Closed (`wAv2cBhhn`) and Open (`gdGCs2vyp`) variants and native Click → variant interactions.
- Phone instances in Hybrid and Black layout templates; original desktop/tablet headers retained.
- One MENU/CLOSE text node, a 13px hidden-overflow label mask, and a 60×44 hit area. No generated replacement label or duplicate rollover line.
- Existing Cream / Forest Green and responsive GT Standard styles. Native route links: Work, Play, Index, About; social links: LinkedIn, Email, GitHub.
- NavigationScrollGuard now provides accessibility, focus, inert background, scroll lock, and dynamic viewport height only. Its visual menu construction was removed.
- Published helper pin: `NavigationScrollGuard-yDp6tN.js@BMP2hvRtTNaw5GxWguHx`.

[Edit the native component](https://framer.com/projects/Micah-Hoang-Portfolio--BvGjN2gCRDHG41LzAVYE-b78r3?node=qajbM_0Ju)

## Verified in published Chromium

- 320, 390, 430, 809px: exactly one MENU text node, 13px mask with hidden overflow, 53px closed header, no horizontal overflow.
- JavaScript disabled at 390px: exactly one MENU and correct clipping before hydration. Saved `mobile-before-hydration.png`.
- Initial Home header name, hero name, descriptor, Selected and Work headings: zero measured x/y movement.
- Open panel fills the viewport, 42px route text line on phone, 66px route rows (12px padding above and below, using the existing spacing token); name, toggle and social links have 44px targets.
- Enter and Space toggle; Escape closes; focus remains within the open panel; closing restores toggle focus and scroll position.
- Work on Home closes and scrolls to top. About, Play, Index and Work routes arrive with menu closed and scroll unlocked.
- Gaia → About → immediate Back and AirPods → About → immediate Back pass; both remain on the original case study after waiting and resizing across the 810px breakpoint.
- At 810px, mobile controls/dialog disappear and background scrolling is restored; returning to mobile restores the closed header.
- Desktop 1440px header crop (top 53px) is pixel-identical to the earlier baseline.
- `npm test`: 35 Play performance checks and 56 grid scenarios pass. `git diff --check` passes.
- No new page errors. Framer retains the pre-existing Lenis remote import declaration warning.

## Back-navigation correction and final verification

- CaseStudyLightbox cancels both fallback timers on popstate, pagehide, successful arrival, and exhausted retries. CaseStudyControllers pins `CaseStudyLightbox-yOYpGN.js@ho2rRUp5oQKLHLwaQPIW`.
- Mobile menu route links use document navigation; the same-page Work link closes the panel and scrolls Home to the top.
- `test-route-fallback.cjs` verifies timer cancellation and listener cleanup on Back, page exit, arrival, and exhausted retries.
- Final published checks ran in a fresh browser context without earlier injected audit scripts. `final-results.json` records passing route, keyboard, clipping, spacing, overflow, and desktop pixel-comparison checks.
- Native link rows use intrinsic height with 12px top and bottom padding, so larger canvas typography also fits without overlap.
- An earlier cold Gaia load exceeded a 15s readiness budget; the targeted retry with a 45s budget passed. Historical raw runs remain local; final results are recorded separately.

Physical iOS Safari was not tested. These results cover published Chromium with mobile viewport and touch emulation.
