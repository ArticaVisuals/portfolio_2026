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
  viewer-canvas:
    backgroundColor: "#080d12"
    textColor: "#f7f5f0"
    rounded: "{rounded.square}"
---

## Overview

**Creative North Star: The venue is the interface.** Keep the real stage geometry and its fixed CRX screen content as the focus, with the case study's restrained page design around it.

The stage appears in one inline viewer, with a poster while loading. There is no bottom bar, seat picker, house-light control, click-to-expand lightbox, or hover scaling. A gentle bounded orbit runs by default and yields immediately to drag, pan, and keyboard camera control. The orbit phase advances at 0.12 radians per second with the same bounded angle and 0.08-radian amplitude. After interaction, orbit resumes from the current view after 1.8 seconds idle, with a 1.5-second easing ramp.

**Key Characteristics:** geometry-led, dark and atmospheric in the viewer, sparse controls, responsive camera framing.

## Colors

The page inherits its paper and forest surfaces from the case study. The stage viewer uses stage-night as its canvas and backdrop. Finished screen media and the measured blue house fixtures supply the bright accents.

## Typography

The page inherits type from Framer. Loading and error messages use a simple sans-serif system stack at compact sizes, with clear contrast against the dark viewer. Keyboard instructions remain available to assistive technology.

## Layout

The poster fills a 16:9 frame. On desktop, the initial view keeps the broad stage context. On portrait screens, the camera starts centered closer to the main stage (58° field of view, distance 44, height 5), with the center screen and part of the inner Vanish visible; orbit and pan reveal the wings. The desktop camera sits at height 5.8 to keep the slow orbit below nearby rigging.

## Elevation & Depth

The venue's actual 3D geometry supplies depth. Reproduce the measured 104 house fixtures in four rings of 26, using blue `#8ebdff` light. Audience fixtures use a 0.7 level and backstage fixtures use 0.35. Do not add generic ambient or directional fill lights. Avoid extra cards or decorative shadows around the scene.

## Shapes

Keep the stage frame square-cornered. The interactive canvas has a clear keyboard focus indicator.

## Components

### Inline stage viewer

The stage remains in the page; clicking does not open another view. There is no bottom bar or audience control panel. Support drag, pan, and keyboard camera interaction, and preserve the inline scrolling bridge. Keep the stage centered in a dark canvas without hover scaling.

### Audience interaction

The viewer offers no seat selection or user-adjustable house lighting. Keep production editing and stage setup out of the audience viewer. Use the fixed measured house-light plot and prescribed fixture levels in the stage rendering.

## Do's and Don'ts

### Do:
- **Do** preserve the source stage proportions, geometry, and CRX 2026 artwork.
- **Do** keep the broad desktop framing and the closer, centered portrait framing.
- **Do** load the 3D viewer when the stage enters view, and pause all motion when it leaves view.

### Don't:
- **Don't** add construction controls, scene settings, or competing interface chrome.
- **Don't** crop the poster artwork or distort the stage screens.
