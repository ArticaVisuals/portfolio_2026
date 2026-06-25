# Play CMS Workflow

Last updated: 2026-06-25

`/play` is managed from the Framer CMS collection `Play Archive`
(`EySMRbI2N`). Published content should be exactly the CMS content. If a value
is not in this collection, the published Play page should not invent it.

## Source Of Truth

Edit these fields in `Play Archive`:

| CMS field | Field ID | Published use |
|---|---|---|
| `Title` | `XwW7XD5jI` | Drawer title and accessibility label source |
| `Order` | `c2qQhVGwP` | Sort order |
| `Image / Poster` | `uqRtTdRM1` | Image item or video poster |
| `Video` | `KWCosE6Ef` | Optional video source |
| `Stroke` | `vq9I0excy` | Per-item media stroke |
| `Content` | `vxCKd8ka_` | Drawer/sidebar description |

Do not manage live `/play` content from `Play.tsx` `Archive Items`, detached
image layers, local arrays, or baked snapshots. `Archive Items` remains only as
a Framer canvas/rollback authoring surface.

## Required Bridge

The `/play` page needs a hidden-but-mounted Framer Collection List bound to
`Play Archive`. That list must stay visible in the layer panel and must not use
Framer's hidden/eye toggle, because hidden layers unmount.

Inside the Collection List item, mount `PlayArchiveRegistrar.tsx`
(`jDwcdGN`, insert URL `https://framer.com/m/PlayArchiveRegistrar-uZVoh9.js`;
current `/play` scaffold node `jHFyFgJNt`) and bind:

- `id` to the CMS item id if available, otherwise leave blank.
- `slug` to the CMS item slug if available.
- `title` to `Title`.
- `order` to `Order`.
- `image` to `Image / Poster`.
- `video` to `Video`.
- `content` to `Content`.
- `stroke` to `Stroke`.

Set the Collection List limit high enough to include every Play Archive item
(`100` is fine). Keep it visually out of the page with `opacity: 0`, `width:
1px`, `height: 1px`, off-canvas positioning, `overflow: hidden`, and locked.

`ArchivePlayground.tsx` reads sources in this live order:

1. `PlayArchiveRegistrar` registry rows.
2. A generated Framer CMS module for `EySMRbI2N`, if Framer emits one.
3. Empty state.

In canvas/thumbnail mode only, it may use `Archive Items` for preview.

## Editing Workflow

1. Open Framer CMS and edit `Play Archive`.
2. Add or remove rows there. Do not add hardcoded archive rows in code.
3. For each item, set `Order`, `Title`, `Image / Poster`, optional `Video`,
   `Stroke`, and optional `Content`.
4. Publish the Framer site after CMS or code changes.
5. Verify the published `/play` page. If an item, video, stroke, or description
   is missing, fix the CMS row or the registrar binding, not the code fallback.

An empty `Content` field intentionally renders no description paragraph.
An empty category intentionally renders no category label, because `Play
Archive` does not currently have a category field.
