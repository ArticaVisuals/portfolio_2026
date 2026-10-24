# Stage showcase media

Current selections use the existing Countdown center video and Blue Vanish screens plus native Homecoming Elastic and Radial Pulse side loops. The center Countdown and Blue Vanish selections are unchanged by the side-loop update. All web videos are muted H.264/yuv420p with fast start; source production masters remain untouched.

- `countdown.mp4` — Full 306-second, 9,180-frame final Countdown, resized to 1840×640 at 30 fps, CRF 25. Source: `/Users/micahhoang/Desktop/Optro/CRX_Countdown/_RENDERS/CRX_Countdown_RollUp_3680x1280_MASTER_ProRes.mov` (3680×1280). The Countdown README names it as the current delivery; this replaces the prior center still-only presentation.
- `center.jpg` — Frame extracted from the countdown at 10 seconds for loading, autoplay-blocked, and reduced-motion fallback.
- `vanish.mp4` — Full 14-second final Blue pixel ramp, 1568×560 at 30 fps, CRF 25. Source: `/Users/micahhoang/Desktop/Optro/CRX_Vanish/_RENDERS/OUTPUT 08 - Vanish - Pixel ramp - Blue_1.mov`. The current CRX Vanish delivery README names this output. Its entire canvas is shared across Vanish V1–V4 with the original column mapping. This replaces the earlier original-colorway v04 clip.
- `vanish.jpg` — Frame extracted at 4 seconds from the Blue video for still fallback.
- `side-elastic.mp4` / `side-elastic.jpg` — Left side screen S01 plays the native final Homecoming Elastic loop. The web loop is 24 seconds, 30 fps, 1040×640, encoded from the 2080×1280 master at `/Users/micahhoang/Desktop/Optro/CRX_Homescoming_Party/CRX_Homecoming_Party/_RENDERS/04 - Side - Elastic - Loop 24s_ProRes422.mov`. The JPEG is its still fallback.
- `side-radial.mp4` / `side-radial.jpg` — Right side screen S03 plays the native final Radial Pulse loop. The web loop is 24 seconds, 30 fps, 1040×640, encoded from the 2080×1280 master at `/Users/micahhoang/Desktop/Optro/CRX_Homescoming_Party/CRX_Homecoming_Party/_RENDERS/05 - Side - Radial Pulse - Loop 24s_ProRes422.mov`. The JPEG is its still fallback.
- `side.jpg` — Existing CRX hero artwork remains as the fallback on separate side LED screens and confidence monitors. It retains the complete logo at 1040×640 with a Midnight background. `side_source.jpg` is the source hero asset: https://framerusercontent.com/images/YVYRaESfisWWvTu8cJZSv2fAY.jpg.

The countdown repeats after its complete end sequence. Four muted web-video decoder sources serve the center Countdown, all four shared Vanish panels, and the two independent side loops. All pause when the stage is outside the viewport or the document is hidden.
