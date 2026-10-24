---
name: CRX Stage Showcase
description: An interactive, geometry-faithful view of the CRX 2026 stage.
colors:
  page-paper: "#f7f5f0"
  page-forest: "#233324"
  stage-night: "#080d12"
rounded:
  square: "0px"
components:
  poster-action:
    backgroundColor: "#080d12e6"
    textColor: "#f7f5f0"
    rounded: "{rounded.square}"
    padding: "12px 16px"
---

## Overview

**Creative North Star: The venue is the interface.** Keep the real stage geometry and its fixed CRX screen content as the focus, with the case study's restrained page design around it.

The stage appears as an interactive inline viewport, with a poster while loading. A gentle bounded orbit runs by default and yields immediately to dragging. Clicking opens a larger native dialog; only one viewer is mounted at a time. There are no visible inline controls or drag captions. After interaction, slow orbit resumes from the current view after 1.8 seconds idle, with a 1.5-second easing ramp.

**Key Characteristics:** geometry-led, dark and atmospheric in the viewer, sparse controls, responsive camera framing.

## Colors

The page inherits its paper and forest surfaces from the case study. The stage viewer and dialog use stage-night as the canvas and backdrop. Finished screen media supplies the bright accents.

## Typography

The page inherits type from Framer. Viewer hints and controls use a simple sans-serif system stack at compact sizes, with clear contrast against the dark viewer.

## Layout

The poster fills a 16:9 frame. On desktop, the initial view keeps the broad stage context. On portrait screens, the camera starts centered closer to the main stage (58° field of view, distance 44, height 5), with the center screen and part of the inner Vanish visible; orbit and pan reveal the wings. The desktop camera sits at height 5.8 to keep the slow orbit below nearby rigging.

## Elevation & Depth

The venue's actual 3D geometry supplies depth. The viewer uses a dark backdrop and soft stage lighting; the dialog darkens the page behind it. Avoid extra cards or decorative shadows around the scene.

## Shapes

Keep the stage frame and dialog square-cornered. Controls use clear, generously sized hit areas; the close button is 48×48 pixels.

## Components

### Poster action

The stage itself opens the lightbox on click or Enter. A drag stays inline. Space pauses motion within the viewer. The image has no overlaid controls or caption controls. Hover scales only the clipped media contents to 1.02 over 420ms with cubic-bezier(0.16, 1, 0.3, 1), exactly matching HomeSelectedWorkGrid.tsx (Framer FecepLS). Use this for fine-pointer hover and disable it under reduced motion.

### Viewer dialog

Use a single close affordance and a restrained loading or retry state. The viewer supports orbit, pan, zoom, keyboard controls, and reduced-motion behavior. Do not add visitor-facing editing controls.

## Do's and Don'ts

### Do:
- **Do** preserve the source stage proportions, geometry, and CRX 2026 artwork.
- **Do** keep the broad desktop framing and the closer, centered portrait framing.
- **Do** load the 3D viewer when the stage enters view, and pause all motion when it leaves view.

### Don't:
- **Don't** add construction controls, scene settings, or competing interface chrome.
- **Don't** crop the poster artwork or distort the stage screens.
