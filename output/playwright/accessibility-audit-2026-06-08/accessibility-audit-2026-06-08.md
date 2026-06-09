# Micah Hoang Portfolio Accessibility Audit

Date: June 8, 2026  
Audited URL: https://khaki-ship-257706.framer.app  
Scope: Read-only review. No app/source files were changed.  
Viewports: desktop 1440x1000, tablet 834x1112, mobile 390x844.

The repo identifies the Framer staging URL above as the current redesign/build surface. I did not use `micahhoang.info` because the repo notes that it has recently served the older Cargo site.

## Reference Standard

Judgment was based on Apple Human Interface Guidelines accessibility guidance:

- [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility): accessible interfaces should be intuitive, perceivable, and adaptable; support larger text; meet contrast minimums; provide captions/text alternatives; offer sufficiently sized controls; support simple gestures and alternatives; reduce time-boxed or motion-heavy interactions.
- [VoiceOver](https://developer.apple.com/design/human-interface-guidelines/voiceover): key interface elements need alternative labels so screen reader users can understand content and controls.
- [Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons): buttons need a hit region of at least 44x44 pt to be easy to select.
- [Motion](https://developer.apple.com/design/human-interface-guidelines/motion): custom motion should account for accessibility settings such as Reduce Motion.

## Coverage

Routes audited:

- `/`
- `/case-studies`
- `/case-studies/airpods`
- `/case-studies/simon-schuster`
- `/case-studies/gaia`
- `/case-studies/national-park-cards`
- `/case-studies/motion-connect-2025`
- `/case-studies/yomo`
- `/case-studies/karuna`
- `/case-studies/weaponized-innocence`
- `/case-studies/seek-truth`
- `/case-studies/independent-lens`
- `/case-studies/typldn`
- `/case-studies/cellular-symphony`
- `/case-studies/wolff-olins-x-artcenter`
- `/case-studies/neon-lights`
- `/case-studies/aspen-valley-landscaping`
- `/case-studies/john-steinbeck`
- `/index`
- `/play`
- `/play-consolidation-draft`
- `/info`
- `/contact`
- `/404`

Methods used:

- Playwright browser pass across all routes and three viewports.
- Axe checks on representative route families.
- Keyboard/focus checks on key interaction surfaces.
- Reduced-motion emulation on `/`, `/index`, `/play`, `/case-studies/airpods`, and `/info`.
- Subagent viewport sweeps for desktop and tablet.
- Screenshot spot checks saved in this folder.

## Ranked Findings

### 1. Critical: `/play` is not keyboard or assistive-tech accessible

Affected pages: `/play`, likely `/play-consolidation-draft`.

Evidence:

- Desktop keyboard pass found Tab moving into gallery buttons positioned far offscreen, for example `x=-821, y=-875`.
- Main scan under reduced motion found `/play` focusable buttons at negative coordinates such as `x=-843, y=-958`.
- Opening a visible gallery tile does not move focus into the detail panel.
- Focus is not trapped in the `role="dialog"` panel, and background/offscreen tiles remain tabbable.
- Axe flags the dialog markup: `role="dialog"` is applied to an `aside`, which is not a valid role/element pairing in this context.

Why it matters:

Apple emphasizes that interfaces should be intuitive and adaptable for people who navigate through assistive technologies. A keyboard or screen reader user can get sent to invisible controls and may not be able to operate the detail view.

Recommendation:

- Keep only visible, actionable gallery cards in the tab order.
- When opening the detail panel, move focus to the panel title or close control.
- Trap focus inside the panel while open, mark the background inert, support Escape to close, and return focus to the opener.
- Use valid dialog semantics, for example a `div role="dialog"` with `aria-modal="true"`, labelled by a visible title.

### 2. Critical: Project navigation is broken or misleading at tablet size

Affected pages: `/case-studies`, `/index`, `/case-studies/john-steinbeck`.

Evidence:

- Tablet subagent found `/case-studies` cards that announce "VIEW PROJECT" but resolve to `/`.
- Tablet subagent found `/index` project links focusable offscreen at `x=-202` and also resolving to `/`.
- `/case-studies/john-steinbeck` returns HTTP `404`.

Why it matters:

This blocks all users, but it is especially damaging for keyboard and screen reader users because the accessible name promises a project link while the destination is wrong.

Recommendation:

- Wire project cards and index rows to the correct `/case-studies/{slug}` routes at every breakpoint.
- Remove offscreen focusable clones from tab order with `tabindex="-1"` and `aria-hidden="true"` when they are purely visual.
- Restore, redirect, or remove the John Steinbeck route from the project inventory.

### 3. High: Meaningful portfolio imagery is mostly unavailable to screen readers

Affected pages: Most case-study pages, `/case-studies`, `/index`, `/play`, home image link.

Evidence:

- Desktop subagent found 307 of 379 visible images with empty or missing alt text.
- Tablet examples: `/case-studies/seek-truth` had 44 of 53 images missing alt, `/play` had 30 of 30, `/case-studies/yomo` had 26 of 26, `/case-studies/gaia` had 20 of 20, and `/case-studies` had 11 of 11.
- Home has an image-only link to `/info` with no accessible text.
- Gaia has an external Figma deck link with no discernible text.
- `/play` labels are often asset names like `IMG 4680`, `Untitled 1`, or generated filenames.

Why it matters:

The portfolio is highly visual. If imagery that carries the project story is not described, VoiceOver users miss the core content.

Recommendation:

- Add concise, content-specific alt text for meaningful project images.
- Use empty alt plus `aria-hidden="true"` only for decorative duplicates or purely atmospheric images.
- Label image-only links by destination or action, for example "Read more about Micah" or "Open Gaia Figma deck".
- Replace asset filenames in `/play` accessible labels with human-readable project/media titles.

### 4. High: Video and motion content lacks adequate alternatives and control

Affected pages: `/`, `/case-studies`, most case-study pages, `/play`.

Evidence:

- Desktop subagent found 90 visible videos; 90 had no caption/subtitle tracks, 89 had no controls, and 44 autoplayed.
- Tablet subagent found `/motion-connect-2025` with 24 of 24 videos lacking text alternatives and `/play` with 18 of 18 visible videos lacking tracks/labels.
- Under `prefers-reduced-motion: reduce`, `/play` still had autoplaying/playing looped videos.
- Home has autoplaying muted loop videos with no controls or text alternative.

Why it matters:

Apple calls out captions/text alternatives for media and Reduce Motion support. Motion-heavy pages can become unusable for people with vestibular sensitivity, attention limitations, or people who need more time to process content.

Recommendation:

- Pause or replace autoplaying decorative motion when `prefers-reduced-motion: reduce` is active.
- Provide a pause/play control for meaningful looping media.
- Add captions, transcripts, or nearby text alternatives when videos communicate content.
- Hide decorative muted loops from assistive tech if the same information is already conveyed elsewhere.

### 5. High: Color contrast failures occur across core pages and case studies

Affected pages: `/`, `/index`, `/contact`, `/case-studies/gaia`, `/case-studies/karuna`, `/case-studies/weaponized-innocence`, `/case-studies/seek-truth`, `/case-studies/independent-lens`, `/case-studies/typldn`, `/case-studies/cellular-symphony`, `/case-studies/wolff-olins-x-artcenter`, `/case-studies/neon-lights`, `/case-studies/aspen-valley-landscaping`.

Evidence:

- Axe measured home scramble text around `1.86-1.97:1` on the cream background.
- `/index` scramble/footer-like text measured as low as `1.44:1`.
- `/case-studies/gaia` body/supporting text `#979797` on `#f7f5f0` measured `2.68:1`.
- `/contact` dark text `#141414` on green `#233324` measured `1.37:1`.
- `/contact` supporting copy on green measured around `2.21-2.25:1`.

Why it matters:

Apple points to WCAG AA contrast minimums as a baseline: normal text should meet `4.5:1`, and large/bold text can use `3:1`. These samples fall below both thresholds.

Recommendation:

- Revisit the gray, cream, and green token pairs.
- Preserve editorial hierarchy through scale, spacing, and weight instead of low contrast.
- Check both static and animated/scrambled text states, because several failures appear during the animation state.

### 6. High: Tap targets are too small across desktop, tablet, and mobile

Affected pages: Sitewide navigation/footer, `/index`, `/case-studies/seek-truth`, `/play`, `/404`.

Evidence:

- Header links commonly measure about `31x13` or `38x13`.
- Footer social links are about `13px` tall.
- Mobile/tablet scans flagged nav/footer links against a `44x44` target expectation.
- Tablet subagent found `/index` with about 50 undersized targets and `/case-studies/seek-truth` with about 53.
- `/seek-truth` carousel dots were reported around `6x6`.

Why it matters:

Apple recommends sufficiently sized controls; buttons generally need at least a `44x44` hit region. Small text can remain visually compact, but the interactive hit area needs to be larger.

Recommendation:

- Add invisible padding or larger link wrappers around nav/footer links.
- Increase carousel dot hit areas while keeping visual dots small if needed.
- Ensure focus rings match the enlarged hit area, not only the visible glyph.

### 7. Medium: Page structure is weak for VoiceOver navigation

Affected pages: Most case-study detail pages, `/index`, `/play`, `/`, `/info`, `/404`.

Evidence:

- Many case-study detail pages have no `h1`; project titles are often lower-level headings.
- `/index` has no main landmark in Axe checks.
- `/404` has no main landmark in the mobile scan.
- Home and `/info` have heading order jumps, including `h1` to `h3`.
- Axe reports `region`, `landmark-one-main`, and `page-has-heading-one` on representative pages.

Why it matters:

Landmarks and headings are the map for screen reader navigation. Without them, users must traverse content linearly and cannot easily jump to the page's main content or project title.

Recommendation:

- Add exactly one meaningful `h1` per page.
- Wrap page-specific content in a `main` landmark.
- Keep heading levels sequential where practical.
- Keep repeated nav/footer outside `main`.

### 8. Medium: Accessible names and ARIA are noisy or invalid

Affected pages: Sitewide nav, `/index`, `/play`, home, Gaia.

Evidence:

- Header links announce duplicated labels such as `WORK WORK`, `PLAY PLAY`, `INDEX INDEX`, and `INFO INFO`.
- `/index` has 15 Axe `aria-prohibited-attr` violations from `aria-label` on plain spans without roles.
- `/play` uses many filename-like labels.
- Home and Gaia have unlabeled links.

Why it matters:

Apple VoiceOver guidance depends on concise, accurate labels. Duplicate or invalid names make navigation noisy and reduce trust.

Recommendation:

- Hide duplicated animated text rails from the accessibility tree.
- Put accessible labels on real interactive elements, not decorative spans.
- Avoid ARIA attributes unless the element role supports them.
- Use human-readable media/control names.

### 9. Medium: Mobile body text is sometimes too small for comfortable reading

Affected pages: `/info`, `/contact`, `/404`, case-study descriptor/supporting copy.

Evidence:

- `/info` mobile body paragraphs measured around `10px`.
- `/contact` mobile labels measured around `12px`; footer copyright measured `8px`.
- Footer/nav text is commonly `13px`.
- Some Gaia mobile supporting text measured as `10px` in Axe samples.

Why it matters:

Apple recommends supporting larger text and notes iOS/iPadOS default text at 17 pt with 11 pt as a minimum. Thin, small, low-contrast text compounds legibility issues.

Recommendation:

- Raise mobile body/supporting copy to a more comfortable baseline.
- Avoid using 8-10px text for meaningful content.
- If tiny copyright text remains, ensure it does not become the only way to access or understand important information.

### 10. Medium: Framer editor control is visible on public pages

Affected pages: All inspected pages.

Evidence:

- A fixed "Edit Content" control appears on screenshots at the right edge of the page.
- It is about `30x30`, below Apple's preferred `44x44` touch target.
- It contributes to Axe `region` issues as `#__framer-editorbar-label`.
- It overlays content visually on mobile and desktop.

Why it matters:

Even if authorization prevents edits, the control adds an unlabeled/undersized overlay to every page and may confuse visitors or assistive-tech users.

Recommendation:

- Confirm whether this appears to non-owner visitors.
- Remove it from production/public output if possible.
- If it must exist for authenticated editors, hide it from public visitors and from assistive tech when inactive.

### 11. Low: Horizontal/offscreen content appears in scans

Affected pages: `/case-studies`, `/play`, `/contact`, `/info`.

Evidence:

- `/case-studies` had elements extending slightly beyond viewport bounds in desktop scans.
- `/play` intentionally positions many gallery controls offscreen, but they remain focusable, which is covered under Finding 1.
- `/contact` mobile hero image extends beyond both sides of the viewport; this may be visually intentional but should not create hidden focus or reading-order issues.

Recommendation:

- Audit offscreen elements for focusability and accessibility-tree exposure.
- Keep purely visual overflow `aria-hidden` where appropriate.

### 12. Low: `/case-studies/john-steinbeck` currently returns 404

Affected page: `/case-studies/john-steinbeck`.

Evidence:

- The route returned HTTP `404`.
- The CMS docs list a John Steinbeck project record, so this may be an intended project route.

Recommendation:

- Restore the route if the project should be public.
- Otherwise remove it from the expected route inventory and any generated project lists.

## Suggested Fix Order

1. Fix `/play` keyboard, focus, dialog, and reduced-motion behavior.
2. Fix tablet project routing on `/case-studies` and `/index`.
3. Remove or hide the public Framer editor control.
4. Add alt text and accessible labels for portfolio imagery and image-only links.
5. Add video controls/reduced-motion handling and text alternatives for meaningful media.
6. Repair contrast tokens for gray-on-cream and dark-on-green text.
7. Increase nav/footer/carousel/filter hit areas.
8. Add `main` landmarks and one `h1` per page.
9. Clean up duplicate labels and invalid ARIA.
10. Increase mobile body/supporting type sizes.

## Screenshot Artifacts

Top-level screenshots were saved in:

`output/playwright/accessibility-audit-2026-06-08/`

Files include desktop, tablet, and mobile captures for:

- home
- case studies
- index
- play
- info
- contact

