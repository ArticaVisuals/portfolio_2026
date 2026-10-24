# CRX Stage Showcase

## Integration

The Optro CRX case study uses the `StageShowcase` Framer code component (`fJ_6hJp`) to present the interactive mainstage. It was inserted on `/case-studies/optro-crx` (`MxrZKvEvR`) in the “Seeing the work in the room” section (`GH29eMWaq`) as node `drDJAwOsS`. The former placeholder node `teTeobSBk` is hidden.

The component insert URL is `https://framer.com/m/StageShowcase-9ierrL.js`. Its editable local mirror is [StageShowcase.tsx](../code/components/StageShowcase.tsx); the URL and its source hash are recorded in [manifest.json](../code/mirror/manifest.json).

## Viewer and media

The standalone Vite viewer source is in [code/tools/crx-stage-showcase](../code/tools/crx-stage-showcase/), and fixed media assets are in [assets/by-project/optro-crx/stage-showcase](../assets/by-project/optro-crx/stage-showcase/). The component loads a poster first, mounts its inline viewer near the viewport, and expands to a native modal dialog. The embedded URL uses `viewer.html?inline=1`, which hides the audience control bar. Clicking the stage opens the full viewer; dragging continues to orbit inline. The iframe distinguishes a click from a drag (8px movement threshold, under 700ms) before requesting expansion. Idle orbit resumes 1.8 seconds after interaction and eases in over 1.5 seconds from the current camera angle. It coordinates readiness, visibility, motion preference, closing, expansion, and inline scrolling through origin- and source-checked `postMessage` events. The viewer supports drag orbit, pan, zoom, keyboard controls, reduced motion, Space to pause/play motion, loading failure and retry. The component has no visible inline caption, Pause, or Expand controls.

In the expanded viewer, the compact control bar offers Stage overview, Front row, Middle rows, Back row, Audience left, and Audience right presets, plus Choose a seat and House lights. The seat picker uses the venue's 1,504-seat map; keyboard arrows move among adjacent seats and Enter selects. Selecting a seat moves the camera to that seat and faces it toward the stage. Once seated, the camera remains at that position while dragging looks around; wheel input adjusts field of view. House lights is a 0–100% slider, initially 35%, that changes the lightweight hemisphere and overhead directional venue fill. Fixed stage-screen media is unaffected. Returning to Stage overview restores the overview camera and its orbit behavior. These are audience viewing controls; production previs editing remains separate.

Configured host: `https://micahhoang-crx-stage.netlify.app/viewer.html`. Netlify site id: `647d3838-a62b-41cf-9917-9716095ff035`; deployment id: `6adc3349bc08560dd9dc0507`. The public `/viewer.html` endpoint returned HTTP 200. The Netlify HUD badge is disabled (`hud_enabled=false`, `built_with_badge_enabled=false`).

## Validation and release state

The Vite `8.3.5` build and audit passed with zero vulnerabilities. Local QA passed drag, wheel page scrolling, lightbox operation and Escape, and the 1.02 hover scale at 420ms using `cubic-bezier(0.16, 1, 0.3, 1)`. Targeted Node assertions confirmed angle continuity at azimuth limits `-0.75` and `+0.75`, reduced-motion and explicit-pause gates, idle/resume timing, and click-vs-drag thresholds. Audience-control QA passed at phone and desktop widths: seat presets, keyboard map selection, Escape closing the map without closing the lightbox, lighting at 0% and 100%, seated drag, return to overview, and clean inline presentation after closing. No browser warnings or errors were reported. Targeted Node assertions confirmed seat transitions land at actual seat coordinates, eye position stays fixed during seated pan, reset restores orbit controls, and seated arrow handling stays scoped to the canvas. The current hosted build returned HTTP 200 without Netlify badge injection; its seat controls were verified in the browser. Physical-phone browser performance has not been measured.

From `code/tools/crx-stage-showcase/`, redeploy with:

```sh
npm ci && npm run build && npx netlify deploy --prod --dir=dist --site 647d3838-a62b-41cf-9917-9716095ff035
```

The configured Netlify host is publicly reachable. The current component source is saved in Framer. Preview verified the badge-free presentation, drag without expansion, click-to-expand, and Escape with focus restored to the inline stage. The Framer page has not been published.
