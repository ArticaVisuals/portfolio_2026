# Stage showcase media

Current selections follow the requested final Countdown center video and final Blue Vanish screens. All web videos are muted H.264/yuv420p with fast start; the source production masters remain untouched.

- `countdown.mp4` — Full 306-second, 9,180-frame final Countdown, resized to 1840×640 at 30 fps, CRF 25. Source: `/Users/micahhoang/Desktop/Optro/CRX_Countdown/_RENDERS/CRX_Countdown_RollUp_3680x1280_MASTER_ProRes.mov` (3680×1280). The Countdown README names it as the current delivery; this replaces the prior center still-only presentation.
- `center.jpg` — Frame extracted from the countdown at 10 seconds for loading, autoplay-blocked, and reduced-motion fallback.
- `vanish.mp4` — Full 14-second final Blue pixel ramp, 1568×560 at 30 fps, CRF 25. Source: `/Users/micahhoang/Desktop/Optro/CRX_Vanish/_RENDERS/OUTPUT 08 - Vanish - Pixel ramp - Blue_1.mov`. The current CRX Vanish delivery README names this output. Its entire canvas is shared across Vanish V1–V4 with the original column mapping. This replaces the earlier original-colorway v04 clip.
- `vanish.jpg` — Frame extracted at 4 seconds from the Blue video for still fallback.
- `side.jpg` — Existing CRX hero artwork remains on the separate side LED screens and confidence monitors. It retains the complete logo at 1040×640 with a Midnight background. `side_source.jpg` is the source hero asset: https://framerusercontent.com/images/YVYRaESfisWWvTu8cJZSv2fAY.jpg.

The countdown repeats after its complete end sequence. One decoder serves the center screen and a second shared decoder serves all four Vanish panels. Both pause when the stage is outside the viewport or the document is hidden.
