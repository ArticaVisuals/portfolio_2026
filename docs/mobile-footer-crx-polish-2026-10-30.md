# Mobile footer density and CRX heading clipping — 2026-10-30

Published through Framer. Changes apply only below the existing 810px tablet breakpoint.

## Footer

The four large contact links now sit in a compact stack with no extra gap between their existing 44px hit areas. Previously their parent added 10–12px between targets. The existing 10px horizontal label/suffix gap, fonts, tracking, colors and 13px mono suffixes are retained.

Main labels scale fluidly toward the existing 38px mobile heading size: 35px at a 390px viewport and 38px at 430px (previously 32px). On narrow 320px phones they use 28px so the complete email remains on one line inside the existing 20px page gutters. All four contacts use the same size at a given viewport. Wrapping is disabled; there is no text truncation or horizontal scrolling.

The existing shared footer rules in `NavigationScrollGuard.tsx` cover both `CTA Row` and Optro's legacy linked `Row` layers. `ResumeAssetHost.tsx` pins the saved guard revision `ayEkYQn1DT4JnfS0lBqr`. No component, font, color or dependency was added.

## CRX hero

Optro's last mobile hero line had overflow visible and no bottom mask padding. It could appear below the heading before entering. The three native Phone frames now all use hidden overflow and the existing 6px bottom padding, producing matching 44px masks around 38px type.

Phone breakpoint: `n_LGzNYlT`; hero parent: `n_LGzNYlTnb8N1ll5l`.

| Native mask | Text node | Text |
| --- | --- | --- |
| `n_LGzNYlTHF6ex84JZ` | `n_LGzNYlTNArGwHoVG` | CRX 2026 |
| `n_LGzNYlTvshSO_Fy9` | `n_LGzNYlTI1ZBZQMl0` | Transform risk |
| `n_LGzNYlTHd7_fnmKV` | `n_LGzNYlTozpklkMCZ` | into opportunity. |

Moving “into” to the last line also fixes the previous 307px-wide subtitle overflowing the 280px content area on 320px phones. Font size and wording are preserved. Existing native entrance delays of 0.1/0.3/0.5s, 120px offset, 2s duration and `[0.16, 1, 0.3, 1]` easing remain. The existing head-level reduced-motion rule makes the text visible immediately.

Desktop and Tablet native attributes were not edited. The footer CSS remains inside the existing mobile media query.

## Verification

- Framer returned empty typecheck diagnostics for both saved code files, and rereads match the local mirrors.
- esbuild compiled the guard; `git diff --check` passed.
- Required `npm test` passed: 35 Play panning checks and 56 grid continuity scenarios, including Safari and Chromium guards.
- Published Chromium footer checks at 320/390/430px on Home, About, Optro, Motion Connect and Seek Truth: single-line labels and suffixes, equal sizes across all four contacts, 44px minimum targets and no horizontal page overflow.
- Published WebKit footer checks at 320/390/430px on Home and Optro also pass the same single-line, fit and 44px target assertions.
- Desktop footer bounds, typography and gaps match the pre-change measurements on Home, About, Optro and Motion Connect. Index has no matching large contact section in the sample. CRX desktop heading wording, fonts and dimensions remain unchanged; transient viewport Y coordinates differ between captures because the existing reveal was still running during the footer scroll.
- Published Chromium and WebKit CRX checks at 320/390/430px confirm all three lines fit their 44px masks. Native animation data confirms the preserved stagger. Reduced Motion frame sampling checks for visible text with no computed transform.

Evidence: `output/playwright/mobile-footer-crx-2026-10-30/`.
