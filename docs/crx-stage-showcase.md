# CRX Stage Showcase

## Integration

The Optro CRX case study uses the `StageShowcase` Framer code component (`fJ_6hJp`) to present the interactive mainstage. It was inserted on `/case-studies/optro` (`MxrZKvEvR`) in the “Seeing the work in the room” section (`GH29eMWaq`) as node `drDJAwOsS`. The former placeholder node `teTeobSBk` is hidden.

The component insert URL is `https://framer.com/m/StageShowcase-9ierrL.js`. Its editable local mirror is [StageShowcase.tsx](../code/components/StageShowcase.tsx); the URL and its source hash are recorded in [manifest.json](../code/mirror/manifest.json).

## Viewer and media

The standalone Vite viewer source is in [code/tools/crx-stage-showcase](../code/tools/crx-stage-showcase/), and stage media assets are in [assets/by-project/optro-crx/stage-showcase](../assets/by-project/optro-crx/stage-showcase/). The component loads a poster first and mounts the viewer near the viewport. It stays inline: there is no bottom bar, seat picker, house-light slider, click-to-expand lightbox, or hover scale. Visitors explore the stage with drag, pan, and keyboard camera controls; ordinary scrolling still moves the page through the inline scroll bridge.

The gentle bounded orbit advances its phase at 0.12 radians per second, with a 0.08-radian angle amplitude. After interaction, it resumes from the current view after 1.8 seconds idle and eases in over 1.5 seconds. The viewer coordinates readiness, visibility, motion preference, and inline scrolling through origin- and source-checked `postMessage` events. Rendering and all four video decoders pause when the viewer is offscreen or the document is hidden. It supports drag orbit, pan, keyboard controls, reduced motion, Space to pause/play motion, loading failure, and retry. Production previs editing remains separate from the audience viewer.

Configured host: `https://micahhoang-crx-stage.netlify.app/viewer.html`. Netlify site id: `647d3838-a62b-41cf-9917-9716095ff035`; deployment id: `6adc5e1704457493689645e1`. The public `/viewer.html` endpoint returned HTTP 200. The Netlify HUD badge is disabled (`hud_enabled=false`, `built_with_badge_enabled=false`).

The center screen continues to play the existing 306-second Countdown video, and all four Vanish panels continue to share the existing 14-second Blue pixel-ramp video. These center and Vanish selections are unchanged. New native side loops show Homecoming Elastic on left screen S01 and Radial Pulse on right screen S03; each is a 24-second, 30 fps, 1040×640 web encode from a 2080×1280 master. All four video sources are muted, retain still fallbacks, and pause offscreen. Exact side-master paths and media mapping are listed in the [media README](../assets/by-project/optro-crx/stage-showcase/media/README.md).

House lighting is fixed from the original measured plot: 104 fixtures in four rings of 26, blue `#8ebdff`, audience level 0.7 and backstage level 0.35. The viewer does not add generic ambient or directional fill lights.

## Validation and release state

The production Vite build passes. Browser checks at 1070px and 390px verified direct inline interaction and the absence of dialogs, hover transforms, and bottom controls. No browser warnings or errors were reported. Framer Preview verified the existing Countdown and Blue Vanish videos playing in the case-study frame, with clicks remaining inline. The current source has no modal or hover-scale code. Physical-phone browser performance has not been measured.

From `code/tools/crx-stage-showcase/`, redeploy with:

```sh
npm ci && npm run build && npx netlify deploy --prod --dir=dist --site 647d3838-a62b-41cf-9917-9716095ff035
```

The Framer source is saved and the hosted viewer is deployed. The case-study page currently uses `/case-studies/optro` with the same page and component node IDs. The Framer page remains unpublished.
