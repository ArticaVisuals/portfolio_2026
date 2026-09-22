# Published About and navigation verification

Captured on **2026-09-22** from the public site using Chromium via Playwright. This is published-page evidence, not a Framer editor export.

| View | Viewport | Evidence |
| --- | --- | --- |
| About desktop | 1200 × 900 | [Full page](about-desktop.png) |
| About tablet | 810 × 1080 | [Full page](about-tablet.png) |
| About mobile | 390 × 844 | [Full page](about-mobile.png) |
| Home mobile | 390 × 844 | [Viewport](home-mobile.png) |

- Navigation displays **Work / Play / Index / About** and links About to `/about`.
- The mobile Work → home → About flow was exercised successfully.
- About uses the title **About Micah Hoang — Brand Designer** and the public description recorded in [verification.json](verification.json).
- No horizontal page overflow or broken rendered images were found on About at the three captured widths. No About browser errors or warnings were observed.
- Body and testimonial copy use `rgb(35, 51, 36)`; the checked testimonial attribution uses `rgb(82, 82, 82)`.
- The legacy `/info` URL returns **HTTP 404 / Page Not Found**, with no redirect to `/about`.

The full-page captures were taken after scrolling through the page to reveal its existing entrance animations. A fresh desktop load was used for the retained desktop screenshot after a resize following client navigation temporarily hid its portrait block. Verification covers Chromium viewport behavior; it does not claim native Safari or device-hardware coverage. No website changes were made.
