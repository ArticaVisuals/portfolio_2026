# Live portfolio journey audit — October 29, 2026

**Result:** Preserve the visual direction. Fix two higher-priority issues and three focused accessibility/usability issues. No production code, Framer content, or published settings were changed.

**Scope:** Home → AirPods → browser Back → Gaia → About, plus Home’s About teaser and the resume/contact destinations. Tested the published https://micahhoang.com site in Chromium 156 at 1440 × 1000 and at 390 × 664 with iPhone device emulation, coarse pointer, and synthesized taps. The mobile user agent says Safari, but the engine was Chromium; this is not an iOS Safari or physical-device certification.

## Confirmed findings

### P1 — Mobile Home “Read more” returns to Home

- **Location:** Home → About Micah teaser, mobile breakpoint.
- **Reproduction:** Scroll below the six selected projects and tap READ MORE.
- **Observed:** Its href is `./`; the URL remains `https://micahhoang.com/`. Reproduced twice. On desktop the equivalent visible link is `./about` and opens About correctly. The mobile portrait also successfully opens About.
- **Impact:** A visitor who has read the introduction cannot continue through its explicit call to action.
- **Recommendation:** Set the mobile Read More destination to `/about`, matching the portrait and desktop variant. Verify both breakpoint variants in Framer.
- **Evidence:** [Mobile teaser screenshot](mobile-home-read-more.png); `mobile-details.json` → beforeTap/afterTap/portraitDestination; `desktop-details.json` → desktopReadMore/desktopReadMoreDestination.

### P1 — Muted text fails minimum contrast

- **Location:** Home’s service pills; the gray continuation of the AirPods and Gaia hero titles, desktop and mobile.
- **Observed:** Computed text `rgb(151,151,151)` (#979797) on the cream background `rgb(247,245,240)` (#F7F5F0), with settled opacity 1. Contrast is **2.68:1**. Home pills are small mono text; the case-study subtitles are 70px desktop / 38px mobile.
- **Impact:** Important descriptors and interactive taxonomy labels are harder to read, particularly in bright conditions or with reduced contrast sensitivity.
- **Standard:** [WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) requires 4.5:1 for normal text and 3:1 for large text. These combinations miss both thresholds.
- **Recommendation:** Use a darker existing semantic text color for the pills and subtitle text. Retain the visual hierarchy and cream/forest palette. Do not globally darken decorative strokes just because their primitive color is shared.
- **Evidence:** [Desktop AirPods hero](desktop-airpods-top.png), [desktop Gaia hero](desktop-gaia-top.png), `desktop-diagnostics.json` and `desktop-details.json` → pills.

### P2 — Important mobile links have thin touch targets

- **Location:** Shared top navigation, Home’s Read More, and About’s social/resume links.
- **Observed:** Visible anchor boxes measure about **13px high** for nav and resume links, and **14px** for Read More. For example ABOUT is approximately 39 × 13px. Centered synthetic taps work.
- **Impact:** The text can remain visually compact while the current active area demands unnecessarily precise finger placement.
- **Recommendation:** Increase the hit area through native Framer link/wrapper padding, aiming for approximately 44px height where practical while preserving text size and layout. Check neighboring hit areas do not overlap.
- **Classification:** Usability recommendation, not a blanket WCAG failure. [WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) permits sufficiently spaced smaller targets; the full exception analysis was outside this audit.
- **Evidence:** `mobile-results.json` → checks[].links and `mobile-details.json` → aboutArrival.nav.

### P2 — Case-study heading structure varies with page and breakpoint

- **Location:** AirPods and Gaia title groups.
- **Observed:** AirPods has no visible H1 in either tested layout; its title and subtitle are H2s. Gaia desktop exposes three H1s (project name and two separately wrapped subtitle lines). Gaia mobile exposes the project name as H1 and subtitle lines as H2s.
- **Impact:** Heading navigation communicates visual line breaks rather than a stable document outline. AirPods has no top-level page heading.
- **Recommendation:** Use one coherent H1 for each case-study title, with subtitle spans or a paragraph. Preserve the current visual line breaks and type styles. Keep actual chapters as section headings.
- **Evidence:** `desktop-diagnostics.json` → pages[].h1/headings; `mobile-results.json` → checks[].headings.

### P2 — Gaia gallery alt text does not describe the work

- **Location:** Gaia’s Interface gallery; sampled after scrolling into view and waiting for media to settle.
- **Observed:** Three loaded images expose the identical description “Case study media,” including the interface-system artwork. Another sampled image uses the filename-like “GaiaLogoAnimation.”
- **Impact:** A screen-reader visitor receives almost no information about the visual design evidence supporting the case study.
- **Recommendation:** Author concise descriptions of informative work in Framer/media controls. Mark genuinely redundant/decorative images accordingly. Avoid filling every image with repetitive generic text.
- **Evidence:** `desktop-details.json` → gaia.images; `mobile-details.json` → gaiaMedia.images; [settled Interface gallery](desktop-gaia-interface-settled.png).

## What passed, and what should stay

- Home’s actual AirPods and Gaia card links navigated correctly on desktop and through synthesized mobile taps.
- Desktop Home Read More and the mobile Home portrait opened About. Shared About navigation worked.
- No horizontal document overflow on Home, AirPods, Gaia, or About at either tested width.
- The tested hero titles, project metadata, and About content fit their layouts without a confirmed persistent overlap or clipping defect.
- Desktop Tab traversal through the logo, navigation, LinkedIn, Resume, Email, and GitHub showed a visible browser focus outline and followed a sensible order.
- Browser Back returned from AirPods to Home. The desktop first-row poster images were loaded and opaque after return. Mobile Back returned to the selected-work area (scroll Y approximately 571).
- About’s resume destination returned HTTP 200 with `application/pdf` (176,446 bytes). The contact link is `mailto:micah.hoang@hey.com`. No email was sent and no external application was launched.
- Gaia’s Interface gallery loaded after settling on both layouts. Its actual section headings are near-black and body copy is dark gray after reveal, so they are excluded from the contrast finding.
- The monitored mobile journey recorded no uncaught page errors or HTTP responses at status 400 or above.

## Observations deliberately excluded from the defect list

- Initial scroll screenshots contain partially faded sections and blank offscreen media. The focused confirmation pass waited 2.5 seconds at Gaia’s Interface section; images and text resolved. Full-page screenshots do not establish media failures because lazy loading and visibility-dependent playback affect them.
- The desktop console logged six DNS failures for `files.catbox.moe` images. No visible broken image was tied to those requests in the inspected states. Treat this as a cleanup/diagnostic lead, not a confirmed journey blocker.
- No recommendation to add new animation, change the brand palette, restructure the project order, or redesign About follows from this audit.

## Suggested order

1. Repair the mobile Read More link.
2. Correct the specific low-contrast text roles.
3. Increase key mobile hit areas.
4. Normalize the case-study heading structure and improve informative image descriptions.
5. Run a final `$impeccable polish` verification of the same journey.

## Evidence and limits

Evidence is saved beside this report: viewport screenshots, full-page overview captures, browser scripts, and JSON measurements. `mobile-results.json`, `desktop-diagnostics.json`, `desktop-details.json`, and `mobile-details.json` contain the main reproducible observations. The first desktop capture’s console logging was not returned by the CLI; its screenshots were retained, and the separate diagnostic/confirmation passes returned structured data.

This was a focused journey audit, not a full WCAG assessment or performance benchmark. It did not certify physical iPhone gestures, Safari/WebKit, Firefox, screen-reader speech, 200% zoom, reduced-motion behavior, throttled networks, or every lightbox state. Browser Back checks establish settled return behavior, not frame-by-frame absence of flashes. No numeric site-wide health score is assigned from this limited scope. The Impeccable context launcher was unavailable due to executable permissions, so existing project documentation and live browser evidence were used directly.
