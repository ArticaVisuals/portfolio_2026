# Mobile case-study heading reveals — 2026-10-30

Published native Framer fixes for Weaponized Innocence, Cellular Symphony, Wolff Olins × ArtCenter, and Independent Lens. Mobile only (0–809px); Desktop and Tablet keep their original content, line wrapping, geometry, and motion.

## Native rows

Each visible line now has its own clipped native frame. Rows enter at 0.1s, 0.3s, 0.5s, etc., keeping the existing 2s duration and `[0.16, 1, 0.3, 1]` easing. The new mobile text uses the existing 40px entrance offset. Heading 2 Bold remains 38px/38px; colors, 20px content gutters, and authored mask padding remain unchanged (3px on the first three pages, 6px on Independent Lens).

Line breaks fit the 280px content width of a 320px phone without shrinking the type. This adds a line to Cellular Symphony and two to Independent Lens at 390px; it prevents those titles and subtitles from wrapping together inside one animated mask on narrower phones. Copy is unchanged.

| Page | Mobile lines, in order | Mobile breakpoint | Native heading parent |
| --- | --- | --- | --- |
| Weaponized Innocence | Weaponized / Innocence / Some / childhoods are / taken. | `aIDeKtJXX` | `bRkl_AI9G` |
| Cellular Symphony | Cellular / Symphony / Organelles in / concert. | `eXbDRlE28` | `ffds1EuiW` |
| Wolff Olins × ArtCenter | Wolff Olins / x ArtCenter / A studio walks / into a school. | `MnvXiffGC` | `PZDN499ae` |
| Independent Lens | Independent / Lens / The issues, / through / the people / living them. | `oAPasiKQz` | `hY7JM4ZP0` |

New native frame/text pairs (prefix with the mobile breakpoint ID for mobile replicas):

- Weaponized Innocence: `BvOceZBnc`/`kphROtN3K`, `kfvkXRwGR`/`rercHp4XH`, `nBVp5DIWO`/`NdTmJCmBH`.
- Cellular Symphony: `MiXiDhRL1`/`QrOxUzZoH`, `MuVXqtwfs`/`hI25PUxl_`.
- Wolff Olins × ArtCenter: `nS2qeKTJD`/`aW8jDBc4r`, `Y4KFWJ6Jr`/`Dyuq_IC8L`.
- Independent Lens: `EGftCeME8`/`WjVTssvN2`, `ky6VmvheA`/`HVPZaR0cz`, `pXusfAHLl`/`VPe_w7lwn`.

New rows duplicate the existing styled native frames. They are hidden in the primary variant and visible only in the mobile replica. Existing text changes and animation delays are mobile overrides. MCP performed structural edits; Framer UI edited native appear effects, which are not exposed by the MCP XML schema.

## Reduce Motion

Framer Site Settings → Code → **Mobile Case Study Reduce Motion**:

- Placement: **Start of `<head>`**.
- Pages: **All**; selector limits behavior to canonical `/case-studies/` pages.
- Run: Once (the content is a stylesheet, no JavaScript).
- Exact source: `code/mirror/custom-code/MobileCaseStudyReducedMotion.html`.

The combined mobile-width and `prefers-reduced-motion: reduce` media query renders native animated case-study text in its final position without translation, opacity hiding, blur, or entrance transitions. It covers Seek Truth and other case-study text entrances, and responds immediately when the OS preference changes. Normal-motion mobile animation and all desktop/tablet animation remain native.

The stylesheet is deliberately in the document head: a footer-mounted style can arrive after the first paint on slow responses. The final implementation adds no helper component, observer, dependency, or duplicate runtime CSS. NavigationScrollGuard and ResumeAssetHost remain identical to their pre-task sources.

## Verification

Evidence folder: `output/playwright/mobile-case-heading-fixes-2026-10-30/`.

- Chromium and WebKit: all four pages at 320, 390, and 430px; every heading row is a single 38px line in its own mask; no page-width overflow.
- Published native effect definitions: consecutive delays increase by 0.2s on all rows. Final Weaponized Innocence timing is in `final-chromium.json` and `final-webkit.json`; the earlier `after-chromium.json` records an intermediate timing error corrected before final verification.
- Desktop 1200px and Tablet 810px: all eight before/after heading comparisons match, allowing only subpixel rounding below 0.1px. Original copy, typography, colors, dimensions, and positions retained.
- Reduce Motion: first-frame sampling on all five affected pages, including Seek Truth, reports zero moving/hidden heading samples in final Chromium and WebKit checks. The first Chromium Seek Truth response during deployment was stale; `seek-reduced-chromium-final.json` confirms the fully deployed page with 100 clean samples. WebKit final result contains 100 clean samples on every page.
- Published head stylesheet matches the local source exactly and precedes `<body>` (`head-style-check.json`).
- Preference toggling restores native transform ownership on normal-motion mobile; the reduce rule does not match desktop.
- Framer code type checks passed during the temporary helper verification; `npm test` passed (35 Play performance checks and 56 grid-continuity scenarios). Final source changes are native canvas settings plus the head stylesheet.
- Visual review: four mobile screenshots inspected. WebKit showed a Vimeo connection-verification restriction on Cellular Symphony's existing embed; this is separate from the header change and was not modified.
