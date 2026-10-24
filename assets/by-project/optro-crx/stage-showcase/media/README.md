# Stage showcase media

Current selections use the existing Countdown center video and Blue Vanish screens plus a shared Homecoming Purple Ribbons side loop. The center Countdown and Blue Vanish selections are unchanged by the side-loop update. All web videos are muted H.264/yuv420p with fast start; source production masters remain untouched.

- `countdown.mp4` — Full 306-second, 9,180-frame final Countdown, resized to 1840×640 at 30 fps, CRF 25. Source: `/Users/micahhoang/Desktop/Optro/CRX_Countdown/_RENDERS/CRX_Countdown_RollUp_3680x1280_MASTER_ProRes.mov` (3680×1280). The Countdown README names it as the current delivery; this replaces the prior center still-only presentation.
- `center.jpg` — Frame extracted from the countdown at 10 seconds for loading, autoplay-blocked, and reduced-motion fallback.
- `vanish.mp4` — Full 14-second final Blue pixel ramp, 1568×560 at 30 fps, CRF 25. Source: `/Users/micahhoang/Desktop/Optro/CRX_Vanish/_RENDERS/OUTPUT 08 - Vanish - Pixel ramp - Blue_1.mov`. The current CRX Vanish delivery README names this output. Its entire canvas is shared across Vanish V1–V4 with the original column mapping. This replaces the earlier original-colorway v04 clip.
- `vanish.jpg` — Frame extracted at 4 seconds from the Blue video for still fallback.
- `side-purple-ribbons.mp4` / `side-purple-ribbons.jpg` — Both side screens S01 and S03 share a single muted, looping video and stay synchronized. Source: `/Users/micahhoang/Desktop/Optro/CRX_Homescoming_Party/CRX_Homecoming_Party/_RENDERS/01 - Center - Purple Ribbons - Loop 24s_ProResLT.mov`. The 3680×1280 source is cropped to its central 2080×1280 region (x=800). The full 24-second loop is center-cropped to the side-screen aspect ratio, resized to 1040×640 at 30 fps, and encoded as H.264 CRF 25 using the veryslow preset with fast start. The JPEG is the four-second still fallback.
- `side.jpg` — Existing CRX hero artwork remains as the fallback on separate side LED screens and confidence monitors. It retains the complete logo at 1040×640 with a Midnight background. `side_source.jpg` is the source hero asset: https://framerusercontent.com/images/YVYRaESfisWWvTu8cJZSv2fAY.jpg.

The countdown repeats after its complete end sequence. Three muted web-video decoder sources serve the center Countdown, all four shared Vanish panels, and both synchronized side screens. All pause when the stage is outside the viewport or the document is hidden.

Optimization check (2026-10-24): Purple Ribbons is 3,787,000 bytes, down from 4,381,583 (13.6% smaller), at the same 1040×640 / 30 fps / 24 seconds. Sampled VMAF against the cropped/resized ProRes source (every fourth frame) was 88.76 versus 89.62 for the prior encode. This is a compression tradeoff, not a lossless change.
