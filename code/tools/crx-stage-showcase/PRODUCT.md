# Stage showcase
<!-- impeccable:product-schema 1 -->

## Platform
web

## Users and purpose
Portfolio visitors explore the CRX 2026 stage within Micah Hoang's case study. The scene uses the original Vectorworks venue geometry and fixed finished screen content. In the expanded viewer, visitors can choose a preset or one of the venue's 1,504 seats and adjust the house lights. The user approved the poster-to-lightbox concept, camera interaction, minimal chrome, and Koto's Stack Overflow case study as the integration reference.

## Constraints
Load the inline viewer near the viewport. Pause rendering and video while offscreen or in a hidden tab. Keep one active renderer when switching between inline and lightbox. Keep the production previs editor separate. Visitors cannot upload media or edit stage setup; the expanded audience viewer offers seat and house-light controls only. House-light adjustment changes the lightweight venue fill while fixed screen media remains unchanged. Preserve meaningful camera movement on desktop and touch. Framer is the existing case study platform.

## Delivery
Fixed CRX production media and the optimized venue are versioned in Portfolio 2026. The HTTPS viewer is hosted at micahhoang-crx-stage.netlify.app and embedded in the Framer case-study preview.

Updated interaction: the stage is draggable inline and defaults to a gentle orbit. The embedded viewer URL uses `viewer.html?inline=1` and hides controls. Clicking the stage opens the full viewer, where a compact control bar offers Stage overview, Front row, Middle rows, Back row, Audience left, Audience right, Choose a seat, and a House lights slider (0–100%, default 35%). The seat picker maps all 1,504 seats; a seated view keeps the camera at that seat while drag looks around and wheel changes field of view. Dragging temporarily stops the automatic camera; the orbit resumes from the current view after 1.8 seconds idle and eases in over 1.5 seconds. Offscreen and hidden-tab motion pause. Reduced-motion visitors begin still.
