# Info Page Promotion Snapshot

Created: 2026-07-13

This folder preserves local HTML snapshots of the current info-family Framer
routes before removing or consolidating draft pages.

## Backed Up Routes

- `/info` -> `info.html`
- `/info-draft` -> `info-draft.html`
- `/info-draft-2` -> `info-draft-2.html`
- `/info-draft-3` -> `info-draft-3.html`
- `/info-draft-4` -> `info-draft-4.html`
- `/info-draft-5` -> `info-draft-5.html`

## Intended Canonical Page

- Source route: `/info-draft-4`
- Source Framer page node: `m8MBybo0d`
- Desired canonical route: `/info`

## Framer MCP Notes

- The Navigation component primary INFO link already targets `/info`.
- The alternate navigation variants are Framer replicas and inherit from the
  primary navigation variant.
- The exposed Framer MCP tools do not provide a safe page path rename operation.
- A direct `Page path` XML update made no changes.
- The `/info-draft-4` tablet and phone roots are Framer replica breakpoint
  nodes, and Framer MCP rejected reparenting or duplicating those replicas.
- Because of those constraints, draft page deletion and canonical route
  promotion should be completed in the Framer UI, or with a page-management MCP
  operation that can rename/replace web page paths directly.
- During a later attempt to point the shared INFO nav link at `/info-draft-4`,
  Framer moved the `qgb8Pm0bn` INFO link wrapper out of its original nav stack.
  The MCP connection dropped before the wrapper could be moved back under
  `cdhMc3QIX`. Do not publish until the Navigation component is inspected and
  the INFO stack nesting is corrected.

## Recognition Content In Snapshot

- Simon & Schuster: Indigo Design, Gold; DNA Paris, Winner; Fonts In Use,
  Feature.
- Seek Truth: Young Ones ADC, Merit; Fonts In Use, Feature.
- Weaponized Innocence: Fonts In Use, Feature.
- Independent Lens: Graphis, Honorable Mention.
- Press: Hidden Characters podcast feature.
