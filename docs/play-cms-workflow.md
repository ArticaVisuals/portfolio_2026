# Play CMS Workflow

Last updated: 2026-07-01

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
| `Content` | `uhNqEiZxv` | Drawer/sidebar description |
| `Link Title` | `VfgNuQyis` | Drawer CTA label (falls back to "View project") |
| `Link` | `YTkltwLjJ` | Drawer CTA destination; the CTA only renders when this is set |

Do not manage live `/play` content from `Play.tsx` `Archive Items`, detached
image layers, local arrays, or baked snapshots. `Archive Items` remains only as
a Framer canvas/rollback authoring surface and should default to an empty list,
not a seeded copy of old archive content.

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
- `linkTitle` to `Link Title`.
- `link` to `Link`.
- `stroke` to `Stroke`.

Set the Collection List limit high enough to include every Play Archive item
(`100` is fine). Keep it visually out of the page with `opacity: 0`, `width:
1px`, `height: 1px`, off-canvas positioning, `overflow: hidden`, and locked.

`ArchivePlayground.tsx` reads sources in this live order:

1. `PlayArchiveRegistrar` registry rows.
2. A generated Framer CMS module for `EySMRbI2N`, if Framer emits one.
3. Empty state.

In canvas/thumbnail mode only, it may use manually supplied `Archive Items` for
preview. The mounted `Play.tsx` wrapper should not ship baked default items.

## Editing Workflow

1. Open Framer CMS and edit `Play Archive`.
2. Add or remove rows there. Do not add hardcoded archive rows in code.
3. For each item, set `Order`, `Title`, `Image / Poster`, optional `Video`,
   `Stroke`, optional `Content`, and optional `Link` + `Link Title`.
4. Publish the Framer site after CMS or code changes.
5. Verify the published `/play` page. If an item, video, stroke, or description
   is missing, fix the CMS row or the registrar binding, not the code fallback.

An empty `Content` field intentionally renders no description paragraph.
An empty `Link` field intentionally renders no CTA (the `Link Title` is ignored
without a `Link`). An empty category intentionally renders no category label,
because `Play Archive` does not currently have a category field.

## Drawer Styling

The drawer title, description, and CTA are visual treatments applied by
`ArchivePlayground.tsx`; they do not change the CMS source of truth.

- **Title:** off-black (`textColor`, `rgb(20,20,20)` / `/Off-Black`) with the
  `/Paragraph Medium` 22px treatment.
- **Description (body copy):** `/Text Gray` (`rgb(110,110,110)`) with an 18px
  `/Paragraph Regular` treatment.
- **CTA:** mono nav-button treatment (`GT Standard Mono Trial`, 13px, uppercase,
  `letterSpacing 0`) with a static `→` glyph to its left and a two-line vertical
  roll on hover — the same motion as the CLOSE button and the Info/Index nav
  links. It renders ONLY when `Link` is set; the label is `Link Title`, falling
  back to the `panelCtaLabel` prop ("View project"). `panelCtaNewTab` controls
  whether it opens in a new tab (default on).

Layout: the **title sits on top**, with a **full-width divider directly under it
spanning both columns**. Below the divider, on wider panels the **description +
CTA sit in the right column** (the left column is empty), keeping the body copy
aligned to the right; on the smallest breakpoint everything collapses to a single
left-aligned stack (title → divider → description → CTA), with extra padding
between the title/divider and the description/CTA group.

The drawer defaults to a wider desktop panel near half the viewport and becomes
full-width on small screens.

## Published Grid Behavior

The July 1 `/play` renderer keeps the CMS media surface visually filled while
preserving the performance pass:

- Grid thumbnails request Framer image variants at `scale-down-to=720`.
- Grid videos use `preload="none"` and only mount/decode when they are on-screen
  and within the current video budget.
- The production `Play.tsx` wrapper starts with `8` concurrent videos and ramps
  to `16` after `2400ms`; `ArchivePlayground.tsx` defaults to `16` when used
  directly.
- Grid cell spacing is capped at a `56px` row/column gap. With the default
  `190px` cell, published desktop rows/columns step at `246px`.
- Wide-screen coverage renders up to `16` columns and `12` rows so large
  desktop viewports do not show under-filled edges.
- Grid media wrappers stay visible immediately instead of waiting at
  `opacity: 0` for per-image/per-video load callbacks. The smooth fade remains
  for the detail drawer media only.
- Images in or near the viewport load eagerly; offscreen buffer cells remain
  lazy.

If random-looking blank holes reappear on the published page, first verify that
the public `ArchivePlayground` module contains `mediaReady` / `DEFAULT_GRID_GAP`
and then check the CMS row media values. The renderer should not intentionally
hide a valid grid poster while it is waiting for a load event.
