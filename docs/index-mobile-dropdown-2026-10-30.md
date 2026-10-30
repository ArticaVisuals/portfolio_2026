# Mobile Index category dropdowns — 2026-10-30

Status: implemented and verified locally; awaiting Framer MCP reconnection before syncing and publishing. The live site is unchanged by this work. User selected the category-dropdown direction from the local prototype comparison.

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

## Remaining deployment work

Framer MCP readCodeFile timed out, then reported the plugin disconnected. Closing/relaunching Tommy's MCP and force-reloading Framer left its launch stuck at “Tommy's MCP is working…”. No live code was overwritten. Before syncing, read the current Framer sources, reconcile any newer edits, update IndexPage (`rgAZFOv`), IndexPageGridPreview (`LgIzFjJ`) and HomeSelectedWorkGrid (`FecepLS`), check Framer diagnostics, publish, and repeat the targeted checks on `/index` using live CMS data.

References: [WAI disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/), [WCAG target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
