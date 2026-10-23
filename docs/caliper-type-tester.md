# Caliper Sans interactive type specimen

Created October 22, 2026. Paper is the selected direction. The user placed its existing instance within the Design section; code updates preserve that placement. No publishing action was made by this task.

## References and direction

The interaction reference is [Koto's Stack Sans deep dive](https://koto.com/projects/stack-overflow/deep-dive/stack-sans) and its embedded [type tester](https://stacksans-typer.vercel.app/). Its large editable specimen, automatic fitting, metric guides, mirrored numbers, and idle typing informed this component. Its public client code was inspected for behavior, not reused.

Visual direction comes from the [Caliper editorial](https://www.figma.com/design/CjxwFrCZtV1GEM83oZOEDG/Caliper-Sans?node-id=216-13189), especially Specs (`217:40422`), Settings (`216:38875`), and [Teardown (`216:38939`)](https://www.figma.com/design/CjxwFrCZtV1GEM83oZOEDG/Caliper-Sans?node-id=216-38939). Navy uses `#1C2440` with `#EEEEEE` ink. Paper uses the Teardown palette: `#EEEEEE` with `#191919` ink, plus a 1px outer border matching the inner rules. All detail colors blend 40% ink with 60% paper (approximately #999999 in Paper). The original Figma registration SVG is preserved; `registration-mark-ui.svg` normalizes its stroke to 1px and aligns it to the pixel grid. Unrelated iPhone imagery and tables are not part of the requested tester.

The Claude artifact reference returned “Page not found” twice and was not used as visual evidence.

## Current behavior

- The field starts empty. A placeholder types and deletes “Type here”, “Caliper Sans”, and “Hamburgefontsiv” while idle and visible. Each complete phrase is measured in advance so its size stays steady while letters appear.
- The placeholder and demo use 28% opacity. Actual user text uses full ink opacity.
- Pointer interaction, keyboard focus, or editing stops the demo for that mounted instance. It never resumes over user text, including after the field is cleared. Reduced-motion preference uses a static “Type here” prompt. Timers stop offscreen and clean up on unmount.
- Native input supplies selection, caret movement, paste, editing, and composition. Type fits automatically with a 20px minimum, normal input scrolling for long text, and a 160-character limit.
- Four dashed metric lines remain: 740, 510, 0, and -230. The 800 ascender line is omitted. Numeric values repeat on both left and right, with no descriptive labels. All numbers use 12px Caliper Regular in the same muted detail color as the rules and registration marks.
- All numeric values disappear when the closest gap is below 18px, before their 15.6px line boxes overlap. The guides stay visible.
- Text selection uses the ink color for the highlight and paper color for the selected glyphs: charcoal and off-white in Paper.
- No visitor size slider, samples, guide switch, reset, count, editing instruction, or corner copy remains.
- Clicking or tapping the input or blank specimen area adds no outline; keyboard navigation retains a focus indicator.

Local comparison buttons sit outside the component and are not included in the portfolio instances. This is a visual A/B comparison, not a randomized analytics experiment.

## Font and metrics

The user confirmed `/Users/micahhoang/Library/Fonts/CaliperSans-Regular.otf`, version 1.003, Regular, weight 400. Its 11.3 KB lossless WOFF export is embedded and saved at `assets/by-project/caliper/fonts/CaliperSans-Regular.woff`. No external font service or new production dependency is required. The original has 120 glyphs and 109 mapped Unicode values; unsupported characters may fall back.

Font metrics are declared OS/2 font units: 1000 UPM, ascender 800, cap height 740, x-height 510, baseline 0, descender -230. The 800 ascender guide is intentionally omitted; 740 is the top visible guide. These are reference metrics, not per-string ink bounds. CSS hhea overrides (97% ascent, 23% descent, zero line gap) align the input baseline with the guides.

## Framer integration

- Source: `code/components/CaliperTypeTester.tsx`; code file `avtpt1Q`.
- Insert URL: `https://framer.com/m/CaliperTypeTester-yhGXgO.js`.
- Page: `/case-studies/caliper`, `G1hGP6jY8`; Paper is now inside Design, `W1AV_RZef`, within SectionImages, `Dy5x2Ew0Z`.
- Navy instance: `SE0xVgA7j`; paper instance: `NhCmBtZpq`.
- Paper placement is user-managed. No node moves or layout mutations were made during the final color/stroke refinement. The instance fills width and uses automatic height.
- Inspector: Starting Text (blank enables demo), Max Type Size (320px), Guides, Paper, Ink, Outer Border.

Source read-back matches the local TSX. The selected Paper instance and its Design parent were read before editing; only the shared code file was changed. Framer MCP cannot expand replica breakpoint descendants, so inherited placement must still be checked in Framer Preview before publishing. No manual replica overrides or live deployment were made.

## Verification and preview

Framer typecheck passed with `[]`. Chromium checks passed for both palettes at 320, 390, 810, 1200, and 1440px: font loading, native editing, auto fitting, no page overflow, demo progression and permanent takeover, reduced motion, 28% placeholder opacity, mirrored numeric values, collision hiding, consistent micro type, light border, and no runtime errors. Long text retains the guide lines while hiding numbers. The final four-guide revision was checked at desktop and mobile widths, with mirrored 740/510/0/-230 values and no overlapping numeric labels.

Screenshots and the browser check are in `output/playwright/caliper-sans-preview/`. The preview is `http://127.0.0.1:4193/`; use A — Navy / B — Paper above the specimen to compare. Paper is the preview default. Switching colors preserves entered text. Restart from the repository root:

```sh
node output/playwright/caliper-sans-preview/build.mjs
python3 -m http.server 4193 --bind 127.0.0.1 --directory output/playwright/caliper-sans-preview
```

Verification used desktop Chromium with resized viewports. Physical touch devices, mobile keyboards, Safari, and the unpublished Framer page preview have not been validated. Local screenshots do not validate the deployed route.

Final Paper refinement: browser checks verified equal computed detail colors across the outer border, inner borders, guides, plus marks, and metric values; 1px border widths; actual native text selection with the monochrome colors; no desktop/mobile overflow or runtime errors. Desktop, selected-text, and mobile screenshots are saved as `caliper-paper-refined-*.png`.

## Typing timing correction — October 23, 2026

Text measurement now runs in a browser layout effect, so the fitted size is committed before paint. Previously, a normal effect allowed the new input value to appear at the previous size for a frame and temporarily scroll horizontally. The server uses an ordinary effect to avoid server-render layout-effect warnings. The existing composition guard is preserved.

A requestAnimationFrame sampler compared the displayed font size with the independently measured expected fit while typing and deleting: before, 49 mismatches and 44 temporarily scrolled samples out of 154; after, zero of either across 156 samples. This is a targeted Chromium timing check, not a cross-browser frame-rate guarantee. The existing demo, takeover, reduced-motion, metric hiding, native editing, and 320–1440px checks also passed with no runtime errors.

Evidence: `output/playwright/caliper-sans-preview/caliper-frame-check.cjs`, `caliper-frame-before.txt`, and `caliper-frame-after.txt`. The preview build now versions its bundle URL with a content hash so refreshing cannot reuse an older script. No Framer layer placement or visual styling changed.

## Published selection styling — October 23, 2026

The component is now published on `/case-studies/caliper`. The site's new green
text-selection style is mirrored in `code/mirror/custom-code/TextSelection.html`
and installed through Framer Settings > Code on all pages. Its `body ::selection`
rule intentionally lets the component's more specific `.caliper-tester ::selection`
rule retain the designed ink highlight and paper-colored glyphs.

Published browser checks confirmed the tester uses `rgb(25, 25, 25)` behind
`rgb(238, 238, 238)` selected text, while the page heading still uses the green
selection. Screenshot: `output/text-selection/caliper-restored-selection.png`.
