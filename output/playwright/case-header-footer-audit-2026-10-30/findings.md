# Case-study mobile header and footer audit — October 30, 2026

Read-only review of all 17 currently published bespoke case-study routes on micahhoang.com. No Framer, source-code, publish, commit or push changes were made. Local audit evidence only.

## Scope

Chromium mobile layout checks and screenshots at 320×844 and 390×844; WebKit hero structure and reduced-motion checks at both widths. Checked hero text bounds and native reveal configuration, “Other Projects” frames, the four-contact CTA, and bottom social links. This is not a general media/performance or whole-site accessibility audit.

Routes: AirPods, Simon & Schuster, Motion Connect, Caliper, National Park Playing Cards, Yomo, Highland Harvests, Gaia, Weaponized Innocence, TYPLDN, Seek Truth, Cellular Symphony, Wolff Olins × ArtCenter, Independent Lens, Peak Energy, WhatsApp, and Optro/CRX.

## Confirmed findings

1. **TYPLDN, 320px:** “Where letters meet.” is approximately 328px wide inside a 280px content allowance. Its surrounding layout still measures 1160px, so the right end leaves the viewport instead of wrapping. Fits at 390px.
2. **Peak Energy, 320px:** “Peak Energy & GM” and “Announcing a new” are approximately 309px and 308px wide inside 280px clipping frames. Their right ends are cut off. Fits at 390px.
3. **Independent Lens, 320px:** “OTHER PROJECTS” stays horizontal instead of stacking like the other case studies. PROJECTS ends at x≈366, beyond the 320px screen. Its hero is correctly split and clipped; this issue is near the bottom of the page.
4. **Optro/CRX, both widths:** The hero fix is intact, but the separate “OTHER PROJECTS” frames still use overflow visible. An early reduced-motion scroll sample retained the native 100px starting offset, but a later settled check returned to zero. This is not evidence of a permanent reduced-motion failure. The confirmed defect is the missing clipping masks, separate from the corrected hero.
5. **Several older hero rows become two-line animated blocks at 320px.** They are 76px high at a 38px line height, inside 79–82px masks. They reveal as grouped text instead of the desired independently staggered lines:
   - Simon & Schuster: title and “made to look like it.”
   - Motion Connect: “Amping up the world” and “of moving design.”
   - Highland Harvests: title and “better for people.” Its mobile initial Y offset is 40px against a 79px mask, so the starting state is not fully below the mask.
   - Gaia: “into a way of caring” and “for the living world.”
   - WhatsApp: “WhatsApp In-App”.
   These rows fit one line per frame at 390px. This is a narrow-screen reveal consistency issue; the settled text is readable.

## Checks that passed

- All 17 four-contact footers match at each viewport: existing GT Standard Medium 500, cream text on forest green, 28px labels at 320px / 35px at 390px, 13px mono suffixes, zero added vertical row gap, 10px horizontal label/suffix gap, minimum 44px targets. All stay on one line and within their content width.
- All 17 green CTA sections measure approximately 370.2px high at these widths. Bottom social links share the same 13px mono type, cream color and 44px target height.
- All sampled hero RichText containers have no computed transform with Reduce Motion enabled in WebKit at both widths.
- The recent CRX, Seek Truth, Weaponized Innocence, Cellular Symphony, Wolff Olins and Independent Lens hero corrections remain intact.
- No document-level horizontal scroll overflow. This does not imply no clipping: hidden overflow conceals the text cutoffs listed above.

## Evidence notes

`audit-compact.json` contains the Chromium footer and heading measurements for all 34 route/width combinations. `richtext-webkit.json` covers all large hero RichText rows, including subtitle rows authored as paragraphs rather than headings. `other-projects-motion.json` records reduced-motion scroll sampling.

The initial normal-motion screenshot pass completed; its oversized CLI result was not retained. Measurements were then collected in a compact result with reduced motion for stable layout. Some first-pass 390px header screenshots retained a previous scroll position; use measured bounds and the named focused confirmation screenshots for findings, rather than treating those images as top-of-page proof. A WebKit screenshot attempt timed out waiting for unrelated fonts, so WebKit conclusions use live DOM measurements rather than screenshots.
