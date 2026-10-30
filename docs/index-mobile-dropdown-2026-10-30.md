# Mobile Index category dropdowns — 2026-10-30

Status: synced to Framer, published, and verified on the live site. User selected the category-dropdown direction from the local prototype comparison.

## Implementation

- Extend the existing CMS-backed IndexPage, sharing the existing taxonomy, multi-selection semantics, URL filter sync, result count and Grid/List state. No new Framer component or runtime dependency.
- At widths up to 809px, replace the long taxonomy columns with Year / Service / Industry disclosure buttons. One panel opens at a time. Selections update results immediately; Reset clears one category, Clear filters clears all, and Done closes the panel.
- Category triggers are at least 48px tall; option, Reset, Done, Clear and Grid/List controls are at least 44×44 CSS pixels.
- Native buttons expose expanded/pressed states and associated panel IDs. Panels use ordinary grouped toggle buttons rather than pretending to be single-select menus. Escape and Done restore trigger focus; outside pointer interaction and leaving the control group close the panel; Arrow Down enters its options. Hidden panels leave the tab order. The result count is a polite status region.
- Mobile project rows include a 13px monospaced year. Rows are native links, supporting keyboard activation and normal browser link behavior.
- Use the existing 13px mono size for Index tags and metadata on mobile and desktop. Remove the 12px Home pill exceptions at tablet/mobile breakpoints. Preserve the existing large sans-serif desktop year heading and desktop layout.
- Update the local prototype's 12px year/services/clear labels and 11px prototype note to the same 13px mono size.

## Verification

A local harness bundles the actual modified IndexPage and IndexPageGridPreview components, with Framer authoring APIs stubbed and the existing 17-project snapshot passed through the explicit manual-data mode. Production CMS loading and filtering remain intact.

- Chromium and WebKit: axe-core WCAG A/AA checks on every open category at 320, 390, 430 and 809px: no violations.
- All visible controls at least 44×44px; all dropdown mono labels 13px; no horizontal page overflow.
- Verified year selection, matching Grid result count, retained selection across view changes, Clear, outside dismissal, Enter/Space, Arrow Down, Escape and focus restoration.
- WebKit's native Mac keyboard navigation uses Option-Tab for all controls; Chromium uses Tab. Arrow Down and Escape were checked in both.
- 200% text size plus WCAG text-spacing overrides at 320px: no horizontal overflow.
- Reduced-motion mode: static disclosure feedback, no animated panel movement.
- Desktop 1200px: taxonomy, view toggle, year-heading and project-row bounds exactly match the pre-change component.
- esbuild compilation and git diff whitespace check pass. No project dependencies added.

Evidence: `output/playwright/index-dropdown-2026-10-30/local-a11y.json` and `local-webkit-a11y.json`. Local implementation preview: http://127.0.0.1:8770/.

## Published verification

Synced IndexPage (`rgAZFOv`), IndexPageGridPreview (`LgIzFjJ`) and HomeSelectedWorkGrid (`FecepLS`) through Framer MCP, then published through Framer. The main file read/update responses timed out because of the large file, so its official Framer source map was used for verification: the pre-update source matched the previous local implementation after formatting normalization, and the post-update source exactly matched the new local TSX. The smaller components returned successful updates with empty typecheck diagnostics.

Live CMS checks passed in Chromium and WebKit at 320, 390, 430 and 809px: all three panels have no scoped axe WCAG A/AA violations, controls meet 44×44px minimums, all control text is 13px, and there is no horizontal overflow. Verified year filtering (2025: 2 projects), Grid/List selection retention, Clear (17 projects), Arrow Down, Enter/Space, Escape, Done focus restoration, outside dismissal, and expanded text spacing. No runtime page errors occurred in these checks. These are targeted checks of the new controls, not a whole-site accessibility certification.

Live typography checks on Home and Index at mobile, tablet and desktop widths found only 13px visible monospaced text. Desktop taxonomy remains visible from 810px; mobile controls remain hidden there. No horizontal overflow. See `live-typography.json`.

Evidence: `live-a11y.json`, `live-webkit-a11y.json`, `live-closed.png`, and `live-open.png` under `output/playwright/index-dropdown-2026-10-30/`.

References: [WAI disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/), [WCAG target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
