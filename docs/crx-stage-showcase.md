# CRX Stage Showcase

## Integration

The Optro CRX case study uses the `StageShowcase` Framer code component (`fJ_6hJp`) to present the interactive mainstage. It was inserted on `/case-studies/optro` (`MxrZKvEvR`) in the “Seeing the work in the room” section (`GH29eMWaq`) as node `drDJAwOsS`. The former placeholder node `teTeobSBk` is hidden.

The component insert URL is `https://framer.com/m/StageShowcase-9ierrL.js`. Its editable local mirror is [StageShowcase.tsx](../code/components/StageShowcase.tsx); the URL and its source hash are recorded in [manifest.json](../code/mirror/manifest.json).

## Viewer and media

The standalone Vite viewer source is in [code/tools/crx-stage-showcase](../code/tools/crx-stage-showcase/), and stage media assets are in [assets/by-project/optro-crx/stage-showcase](../assets/by-project/optro-crx/stage-showcase/). The component loads a poster first and mounts the audience viewer near the viewport. The viewer and its controls stay inline; clicking the stage does not open a lightbox, and the stage has no hover scale. The inline control bar offers Stage overview, Front row, Middle rows, Back row, Audience left, Audience right, Choose a seat, and House lights. The seat picker uses the venue's 1,504-seat map; keyboard arrows move among adjacent seats and Enter selects. Selecting a seat moves the camera to that position and faces it toward the stage. When seated, the camera stays fixed while dragging looks around; Control+wheel input adjusts field of view; ordinary scrolling moves the page. House lights is a 0–100% slider, initially 35%, that changes the lightweight hemisphere and overhead directional venue fill. The fixed screen media is unaffected. Returning to Stage overview restores the overview camera and orbit behavior.

The gentle bounded orbit advances its phase at 0.12 radians per second, up from 0.075, with the same bounded angle and 0.08-radian amplitude. After interaction, it resumes from the current view after 1.8 seconds idle and eases in over 1.5 seconds. The viewer coordinates readiness, visibility, motion preference, and inline scrolling through origin- and source-checked `postMessage` events; the scroll bridge remains in place. It supports drag orbit, pan, zoom, keyboard controls, reduced motion, Space to pause/play motion, loading failure and retry. Production previs editing remains separate from the audience viewer.

Configured host: `https://micahhoang-crx-stage.netlify.app/viewer.html`. Netlify site id: `647d3838-a62b-41cf-9917-9716095ff035`; deployment id: `6adc5bc3e2584ce54a0ea52f`. The public `/viewer.html` endpoint returned HTTP 200. The Netlify HUD badge is disabled (`hud_enabled=false`, `built_with_badge_enabled=false`).

The center screen now plays the complete 306-second final Countdown master, encoded to 1840×640 at 30 fps (5.41 MB). All four Vanish panels share the current 14-second Blue pixel-ramp delivery (0.83 MB). Both are muted, use H.264 with fast start, retain still fallbacks, and pause offscreen. Source provenance is in the media README. Separate side LED screens retain the CRX hero artwork.

## Validation and release state

The production Vite build passes. Browser checks at 1070px and 390px verified direct inline interaction, absence of dialogs and hover transforms, the inline audience controls, and the compact seat map. No browser warnings or errors were reported. Framer Preview verified the final countdown and Blue Vanish videos playing in the case-study frame, with clicks remaining inline. The saved component compiles without modal or hover-scale code. Physical-phone browser performance has not been measured.

From `code/tools/crx-stage-showcase/`, redeploy with:

```sh
npm ci && npm run build && npx netlify deploy --prod --dir=dist --site 647d3838-a62b-41cf-9917-9716095ff035
```

The current source is saved in Framer and the hosted viewer is deployed. The case-study page currently uses `/case-studies/optro` with the same page and component node IDs. The Framer page has not been published.
