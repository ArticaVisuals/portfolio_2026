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

The stage and audience controls appear together in one inline viewer, with a poster while loading. There is no click-to-expand lightbox or hover scaling. A gentle bounded orbit runs by default and yields immediately to dragging. The inline control bar provides overview and audience-seat views plus house-light adjustment. The orbit phase advances at 0.12 radians per second with the same bounded angle and 0.08-radian amplitude. After interaction, orbit resumes from the current view after 1.8 seconds idle, with a 1.5-second easing ramp.

**Key Characteristics:** geometry-led, dark and atmospheric in the viewer, sparse controls, responsive camera framing.

## Colors

The page inherits its paper and forest surfaces from the case study. The stage viewer uses stage-night as its canvas and backdrop. Finished screen media supplies the bright accents.

## Typography

The page inherits type from Framer. Viewer hints and controls use a simple sans-serif system stack at compact sizes, with clear contrast against the dark viewer.

## Layout

The poster fills a 16:9 frame. On desktop, the initial view keeps the broad stage context. On portrait screens, the camera starts centered closer to the main stage (58° field of view, distance 44, height 5), with the center screen and part of the inner Vanish visible; orbit and pan reveal the wings. The desktop camera sits at height 5.8 to keep the slow orbit below nearby rigging.

## Elevation & Depth

The venue's actual 3D geometry supplies depth. The viewer uses a dark backdrop and soft stage lighting. The inline House lights slider adjusts lightweight venue fill from 0–100% (default 35%); fixed screen media does not change. Avoid extra cards or decorative shadows around the scene.

## Shapes

Keep the stage frame square-cornered. Controls use clear, generously sized hit areas.

## Components

### Inline stage viewer

The stage remains in the page; clicking does not open another view. The stage stays draggable while the audience control bar is available inline. Space pauses motion. Preserve the inline scrolling bridge and keep the stage centered in a dark canvas without hover scaling.

### Audience controls

The inline control bar offers Stage overview and Front row, Middle rows, Back row, Audience left, and Audience right presets, plus a Choose a seat picker. The picker shows the actual 1,504-seat map; keyboard arrows move through adjacent seats and Enter selects. A seated camera stays fixed at the chosen seat while drag changes the look direction and wheel adjusts field of view. The House lights slider adjusts venue fill while keeping finished screen media fixed. Keep production editing and stage setup out of the audience viewer.

## Do's and Don'ts

### Do:
- **Do** preserve the source stage proportions, geometry, and CRX 2026 artwork.
- **Do** keep the broad desktop framing and the closer, centered portrait framing.
- **Do** load the 3D viewer when the stage enters view, and pause all motion when it leaves view.

### Don't:
- **Don't** add construction controls, scene settings, or competing interface chrome.
- **Don't** crop the poster artwork or distort the stage screens.
