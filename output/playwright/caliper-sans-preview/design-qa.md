# Caliper type specimen — design QA

final result: passed (simplified revision)

## Final guide simplification

Removed the 800 ascender line and its values from both sides. Four guides remain (740, 510, 0, -230). Desktop and mobile browser checks confirmed the guide count, matching left/right values, and no numeric label overlap. Visual evidence: `caliper-four-guides.png`. Framer typecheck passed.

## Current typing timing correction

The fitted size is measured in a browser layout effect and committed before paint. A controlled typing/deletion run recorded 49 stale-size samples and 44 temporary horizontal scroll samples before the fix; after the fix both counts were zero across 156 requestAnimationFrame samples. The existing responsive interaction checks passed. Visual styling and the user-managed Framer placement are unchanged. See `caliper-frame-before.txt` and `caliper-frame-after.txt` for the captured data. No new device/browser compatibility claim is made.

## Current Paper refinement

Paper is selected and its existing Framer placement is user-owned. The code update makes outer/inner borders, dashed guides, registration marks, and metric values use the same opaque 40%-ink/60%-paper mix (approximately #999999 in Paper). Rules and the UI registration asset use 1px strokes. The original Figma SVG is preserved alongside the normalized UI derivative. Native text selection is charcoal with off-white glyphs.

Evidence: `caliper-paper-refined-desktop.png`, `caliper-paper-refined-selection.png`, and `caliper-paper-refined-mobile.png`, reviewed together. Browser checks verified matching computed detail colors, equal 1px border widths, actual text selection using the chosen colors, preserved input font, and no mobile overflow/runtime errors. Only the shared code source was updated in Framer; no node mutation was made.

The following sections retain the earlier comparison and initial build history.

## Current revision: idle demo and color comparison

The specimen begins with a typing/deleting placeholder demo at 28% opacity. It stops on the first interaction and never resumes over visitor input. Reduced-motion preference uses a static prompt. Both sides show matching numeric metric values; crowded labels are removed before their line boxes overlap, without displacing the values or removing the guide lines.

Variant A retains navy #1C2440 and paper-white ink #EEEEEE. Variant B uses the Figma Teardown sheet's #EEEEEE paper and #191919 ink with a solid 1px outer border. Comparison buttons exist only in the local harness; Framer has two adjacent draft instances sharing the same code.

Current evidence: `caliper-ab-demo-navy.png`, `caliper-ab-demo-paper.png`, `caliper-ab-navy-390.png`, `caliper-ab-navy-1440.png`, `caliper-ab-paper-390.png`, `caliper-ab-paper-1440.png`. Both desktop demo palettes and the mobile paper state were reviewed together. The mobile capture includes keyboard/programmatic focus; actual pointer clicks retain no outline.

Browser checks passed for both variants at 320/390/810/1200/1440, including animation progression, dimmed placeholder, permanent user takeover, reduced motion, matching numbers on both sides, no overlapping values across progressive text lengths, long-text number hiding, unchanged guide count, native editing, no page overflow, font loading, color/border values, and no runtime errors. Framer typecheck returned []; source and instance settings were read back. Sibling order is navy, paper, Design, Process, Tooling, ScrollToTop.

The sections below record the initial version's reference and verification history. Its controls, corner copy, and descriptive labels are superseded by this revision.

## Visual evidence

- Source: `reference-editorial-specs.png`, Figma `217:40422`, 958×1224 native print-frame pixels. Read with structured design context from the Specs, Settings, and Teardown sheets.
- Interaction reference: `stack-sans-default.png` and `stack-sans-typing.png`, 1440×900 CSS pixels at screenshot scale 1.
- Implementation: `caliper-final-desktop.png`, 1440×1000 CSS pixels at screenshot scale 1; `caliper-verified-320.png`, `caliper-verified-390.png`, `caliper-verified-810.png`, `caliper-verified-1200.png`, `caliper-verified-1440.png`; `caliper-short-text.png` at 390×900.
- The editorial reference and final implementation screenshots were opened together in one review input. This comparison evaluates the requested palette, font, rules, marks, and editorial hierarchy. Different print/web aspect ratios are intentional; no pixel-for-pixel layout claim is made.
- State: default text with guides on, plus short mobile text with focused field. Full-size images made guide placement and controls readable; a separate magnified crop was unnecessary.

## Findings and comparison history

1. Initial wide specimen crowded the left guide labels. Added 136px text gutters on wide layouts; final desktop image shows labels clear of the letterforms.
2. Closely spaced mobile metric lines could not carry readable individual labels. Moved values into a compact upper readout while preserving all five guide lines. Final mobile images show the values and type separately.
3. At 320px, the sample selector truncated its selected value. Stacked sample and size rows at the narrow breakpoint. Final 320px image shows the full default sample and visible controls.
4. A very short mobile string could expand into the metric readout. Capped compact specimen height using the readout boundary. `caliper-short-text.png` shows Hpg clear of the readout; measured gap between its bottom and ascender guide exceeds 14px.

No remaining actionable P0/P1/P2 issues in this component scope.

## Required fidelity surfaces

- Typography: the confirmed Caliper Sans 1.003 export is embedded; regular weight throughout; native text selection/editing; labels remain fixed size while specimen type fits. Unsupported glyphs may fall back because the original font has limited coverage.
- Layout: squared frames, generous open specimen area, thin border rhythm, lower control band, and small corner labels retain the editorial character. Print dimensions are intentionally replaced by responsive web dimensions.
- Colors: actual Figma Blue `#1C2440` and White `#EEEEEE`; muted rules and control fills derive from those values. Container stays opaque on the light portfolio background.
- Assets: registration mark is the downloaded Figma SVG used as a mask. No fabricated illustration, approximate font, screenshot-as-interface, or replacement icon set.
- Copy: Caliper-specific samples and technical metric labels; internal font version correctly reads v1.003. Framer implementation details are not exposed to visitors.

## Interaction checks

Passed: typing, native keyboard editing, sample selection, empty input, reset, guide toggle, keyboard size control, long text without document overflow, idle text persistence, font readiness, and responsive widths 320/390/810/1200/1440. The browser check ran with no assertion failures or runtime errors. Framer's own typecheck returned `[]`; source read-back matched.

## Limits

The Claude reference returned Page not found. No screenshot comparison to it was possible. Local responsive checks are not physical mobile keyboard tests. The installed Framer instance was verified via MCP read-back; page Preview and post-publish verification were not available through that tool. These limits do not imply that the live site has been updated or verified.
