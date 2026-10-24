# Stage showcase
<!-- impeccable:product-schema 1 -->

## Platform
web

## Users and purpose
Portfolio visitors explore the CRX 2026 stage within Micah Hoang's case study. The scene uses the original Vectorworks venue geometry, measured venue fixtures, and fixed finished screen content. Visitors explore with drag, pan, and keyboard controls; the viewer has no audience seat picker or house-light adjustment.

## Constraints
Load the inline viewer near the viewport. Pause rendering and all three video decoders while offscreen or in a hidden tab. There is no click-to-expand lightbox or hover scaling. Keep the production previs editor separate. Visitors cannot upload media, choose seats, change house-light levels, or edit stage setup. Preserve the inline scroll bridge and meaningful camera movement on desktop and touch. Framer is the existing case study platform.

## Delivery
Fixed CRX production media and the optimized venue are versioned in Portfolio 2026. The HTTPS viewer is hosted at micahhoang-crx-stage.netlify.app and embedded in the Framer case-study preview.

Updated interaction: the viewer stays inline with drag, pan, and keyboard camera controls; there are no bottom-bar, seat-selection, or house-light controls, click expansion, or hover scaling. The gentle bounded orbit advances at 0.12 radians/second with a 0.08-radian angle amplitude. After interaction, it resumes from the current view after 1.8 seconds idle and eases in over 1.5 seconds. Offscreen and hidden-tab rendering and video pause. Reduced-motion visitors begin still. The measured 104 house fixtures are arranged in four rings of 26 and use blue `#8ebdff` light, at 0.7 level in the audience and 0.35 backstage; generic ambient and directional fill lights are absent.

Screen media: the existing center Countdown and Blue Vanish deliveries remain unchanged. Both side screens (S01 and S03) share the same synchronized 24-second Purple Ribbons loop, center-cropped to their aspect ratio. All three video decoder sources pause when the viewer is offscreen or the document is hidden.
