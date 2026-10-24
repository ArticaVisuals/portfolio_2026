# Stage showcase
<!-- impeccable:product-schema 1 -->

## Platform
web

## Users and purpose
Portfolio visitors explore the CRX 2026 stage within Micah Hoang's case study. The scene uses the original Vectorworks venue geometry and fixed finished screen content. The user approved the poster-to-lightbox concept, camera interaction, minimal chrome, and Koto's Stack Overflow case study as the integration reference.

## Constraints
Load the inline viewer near the viewport. Pause rendering and video while offscreen or in a hidden tab. Keep one active renderer when switching between inline and lightbox. Keep the production previs editor separate. Visitors cannot upload, change media, change lighting, or edit stage setup. Preserve meaningful camera movement on desktop and touch. Framer is the existing case study platform.

## Delivery
Fixed CRX production media and the optimized venue are versioned in Portfolio 2026. The HTTPS viewer is hosted at micahhoang-crx-stage.netlify.app and embedded in the Framer case-study preview.

Updated interaction: the stage is draggable inline and defaults to a gentle orbit. Dragging temporarily stops the automatic camera; the orbit resumes from the current view after 1.8 seconds idle. Clicking the stage opens the lightbox. There are no visible inline controls; offscreen and hidden-tab motion pause. Reduced-motion visitors begin still.
