# Stage showcase
<!-- impeccable:product-schema 1 -->

## Platform
web

## Users and purpose
Portfolio visitors explore the CRX 2026 stage within Micah Hoang's case study. The scene uses the original Vectorworks venue geometry and fixed finished screen content. Visitors can choose a stage overview, audience-seat preset, or one of the venue's 1,504 seats, and adjust the house lights directly in the inline viewer. Keep the interface compact so the stage remains the focus.

## Constraints
Load the inline viewer near the viewport. Pause rendering and video while offscreen or in a hidden tab. There is no click-to-expand lightbox. Keep the production previs editor separate. Visitors cannot upload media or edit stage setup; the audience viewer offers seat and house-light controls only. House-light adjustment changes the lightweight venue fill while fixed screen media remains unchanged. Preserve the inline scroll bridge, meaningful camera movement on desktop and touch. Framer is the existing case study platform.

## Delivery
Fixed CRX production media and the optimized venue are versioned in Portfolio 2026. The HTTPS viewer is hosted at micahhoang-crx-stage.netlify.app and embedded in the Framer case-study preview.

Updated interaction: the stage viewer and its compact audience controls appear inline; there is no click-to-expand or hover scaling. Controls offer Stage overview, Front row, Middle rows, Back row, Audience left, Audience right, Choose a seat, and a House lights slider (0–100%, default 35%). The seat picker maps all 1,504 seats; a seated view keeps the camera at that seat while drag looks around and wheel changes field of view. The gentle bounded orbit advances at 0.12 radians/second with the same 0.08-radian angle amplitude. Dragging temporarily stops the automatic camera; the orbit resumes from the current view after 1.8 seconds idle and eases in over 1.5 seconds. Offscreen and hidden-tab motion pause. Reduced-motion visitors begin still.
