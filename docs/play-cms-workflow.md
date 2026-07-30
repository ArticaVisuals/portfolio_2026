# Play CMS Workflow

Last updated: 2026-07-30

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

The production `/play` page needs a hidden-but-mounted Framer Collection List
bound to `Play Archive`. That list must stay visible in the layer panel and
must not use Framer's hidden/eye toggle, because hidden layers unmount. The
current bridge container node is `kV3Za9Pze`.

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

## Current Runtime Behavior

The published `/play` renderer keeps the CMS media surface visually filled while
preserving the performance pass:

- Grid thumbnails request Framer image variants at `scale-down-to=600`.
- Grid videos use `preload="none"` and only mount/decode when they are on-screen
  and within the current video budget.
- The production `Play.tsx` wrapper starts with `4` concurrent videos. Desktop
  Chromium browsers, including Arc, ramp to a dedicated cap of `6` after
  `2400ms`; other non-WebKit desktop browsers may use the general `10`-video
  ceiling. Desktop Safari stays at `4`, iOS/iPadOS stays at `2`, small
  non-WebKit viewports cap at `8`, and hidden pages drop to `0`.
- Center-mode allocation retains already-active videos while their cards remain
  inside the buffered viewport and fills only vacated slots by center distance.
  The pool freezes during dragging, throw inertia, and edge scrolling, then
  reconciles once motion settles. Posters remain mounted throughout, preventing
  video decoder attach/release work from entering the pan loop.
- Preview route `/play-hover-preview` uses the same protected wrapper and CMS
  data in hover-only mode. It intentionally has no second hand-maintained CMS
  list: when the page registry is empty, `ArchivePlayground` resolves the
  generated `EySMRbI2N` CMS module from the same-origin `/play` markup and scans
  it directly. Videos remain paused/unmounted until hover or keyboard focus,
  with `0.28` resting opacity and `0.12` saturation. Safari keeps the opacity
  treatment but skips the full-grid saturation filter.
- Grid cell spacing is capped at a `56px` row/column gap. With the default
  `190px` cell, published desktop rows/columns step at `246px`.
- Wide-screen coverage renders up to `20` columns and `12` rows so large
  desktop viewports do not show under-filled edges.
- Continuous drift, parallax, drag, and inertia update one GPU-transformed world
  layer. React only recycles cards after crossing a grid-cell boundary; video
  state remains frozen during user-driven motion and stable visible slots are
  retained during background drift.
- The detail drawer freezes the obscured grid. Chrome retains the backdrop blur.
  Safari/iOS avoid `backdrop-filter` and instead ease a `14px` blur directly on
  the gallery over `560ms`. Closing still eases the blur back to `0px` over
  `450ms`, but grid motion, interaction, and the bounded video allocator resume
  as soon as Close is triggered, matching Chrome's immediate background return.
  The outgoing detail video pauses and releases its source at that same moment,
  so Safari never runs the drawer decoder on top of the resumed grid budget.
  Both Play grain instances are static outside WebKit and completely disabled
  on Safari/iOS.
- Grid media wrappers stay visible immediately instead of waiting at
  `opacity: 0` for per-image/per-video load callbacks. The smooth fade remains
  for the detail drawer media only.
- Images in or near the viewport load eagerly; offscreen buffer cells remain
  lazy.
- At `1440×1000`, the bounded pool is `56` cards. A committed-window coverage
  clamp keeps those cards covering every viewport edge during fast wheel/pan
  bursts while React recycles the next cell window.
- Poster images remain mounted beneath active videos. Video opacity is promoted
  imperatively only after playback readiness, and deactivated videos pause,
  clear their source, and release the decoder.
- The world animation loop stops while the page is hidden and while the Safari
  drawer is open. It restarts immediately when close begins, even though the
  blur continues easing out. Duplicate viewport measurements and redundant
  post-render media/grid reconciliations are suppressed.
- WebKit is detected before runtime effects mount. Safari therefore receives
  its video/effect caps immediately, and the disabled grain SVG plus its nav
  measurement loop never mount.

If random-looking blank holes reappear on the published page, first verify that
the public `ArchivePlayground` module contains `mediaReady` / `DEFAULT_GRID_GAP`
and then check the CMS row media values. The renderer should not intentionally
hide a valid grid poster while it is waiting for a load event.

The Safari coverage/blur version was published on July 23. The Arc/Chromium
video-pool stabilization was published and browser-verified on July 30:
`ArchivePlayground@RQxOdG36GiZaGiMevepS` and
`Play@n4IOpd8V71GwZw9ZvFrX`. Production held the Chromium pool at `6`, mounted
no new video sources during an active drag, restored the full pool after
inertia settled, and emitted no warnings or errors. The matching local
`ArchivePlayground.tsx` snapshot is `133085` bytes with SHA-256
`e507c940991389031df20b6f96c3b3ab3105cfb4cbf9328a248d1d896085c276`.
