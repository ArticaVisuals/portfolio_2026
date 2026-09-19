# Info exit and Index arrival — 2026-09-18

Status: the user published on 2026-09-18 at 18:15:53 PDT. Production HTML and
compiled runtime contain both fixes; see `published-release.json`.

- Renamed the `/info` primary headline `HhA0wJbp7` from `Index` to
  `Info Heading`; Tablet and Phone replicas inherit the name. This prevents
  the Index click-time hold from hiding the outgoing Info heading.
- Created `PageTransitionRuntime.tsx` (`rdTIUkW`) from the exact original
  source embedded in the pinned v7.12 CDN source map, changing only the
  fallback condition to `active && !(onIndexPath && sdActive)` plus comments.
- Updated `PageTransition.tsx` (`gmalnRr`) to import runtime version
  `nBkdxEuAmy8SV9MpeZjc`. Framer readback matches both submitted sources.
- Both Framer typechecks returned `[]`; `npm test` passed all 35 guards.
- Native draft preview successfully navigated Info → Index and rendered
  all 16 projects. Draft layer readbacks verify Tablet and Phone names.
- Browser A/B used response interception on the published site to measure
  the same scoped guard without publishing. Home/Info/Play → Index content
  starts roughly 0.8s earlier, while the title is still moving. Mobile,
  reduced motion, and case-study return checks passed. See
  `browser-ab-evidence.json`; unrelated case-study image host connection
  failures were observed. These were the pre-publish local validation results.
  Subsequent live results are recorded separately in `published-verification.json`.
- Fresh production QA passed with no response interception: Info heading
  stayed visible in all eight outgoing samples; content began at 737–785ms
  from Info, Home, and Play while the title was still moving. Phone-size
  (390×900) and reduced-motion checks passed, with no console errors or warnings.

`PageTransition.before.tsx` preserves the original Framer wrapper. The
historical `code/mirror/backups/PageTransition.runtime-backup.tsx` is **not**
identical to the pinned dependency; `runtime-source-review.diff` confirms
the new runtime preserves the exact source-map original apart from the fix.

Both dedicated browser QA sessions were closed after verification. The
published verification session used no local response interception.

## GitHub snapshot follow-up

Pre-push review also checked the existing pending Index reveal-stamp and
case-study media-grid edits. The grid used a CSS height union in arithmetic;
its numeric `rowHeight` is now separate from `frameHeight` (`number | "auto"`).
The server-rendered aspect ratio, measured dimensions, and contain-fit behavior
are preserved. Framer accepted this correction with `typecheck: []`, and
readback matches the local mirror (`c0iPrbN`, version
`1DegeE3sRmgy9nYLpC8F`). This small grid correction is saved in the Framer draft
and has not been published. The transition fixes and browser results above
are the published release.

The mirror manifest records the new runtime and updated source hashes for the
four code files in this snapshot. Existing compiled snapshots retain their
original generation date.
