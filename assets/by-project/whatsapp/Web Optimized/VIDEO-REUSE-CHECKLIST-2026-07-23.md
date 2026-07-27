# WhatsApp video reuse checklist

- [x] Audited the eight live Brand New School clips.
- [x] Confirmed that six local optimized files match their published byte sizes.
- [x] Kept the smaller published derivatives for clips 06 and 07 instead of replacing them with larger local candidates.
- [x] Confirmed all local candidates are H.264/yuv420p at appropriate UI-preserving widths.
- [x] Reused all existing posters.
- [x] Performed no re-encoding; the page’s small UI text is better protected by the current files.

For the seven clips with known source baselines, 122,155,376 bytes became 15,015,333 bytes, a verified 87.7% reduction. Including clip 09, the eight live clips total 18,167,844 bytes.

Recommended action: retain the current published URLs. In particular, do not upload the larger local 06 and 07 candidates over their smaller Framer derivatives.

## Additional requested Meta AI Group animation

- [x] Optimized `anim_B26_Meta AI Group_v001 (1).mp4` as a new asset; this
  does not replace any of the eight audited live clips above.
- [x] Reduced the video from 47,723,269 to 2,596,701 bytes (94.56%).
- [x] Preserved 24 fps and produced H.264/yuv420p, no audio, and fast-start.
- [x] Capped the delivery file at 718×900 and used CRF 22 to protect small UI
  text.
- [x] Created a 718×900 q90 WebP poster.
- [x] Passed full decode, SSIM 0.993713, and side-by-side visual review.

Links: [video](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/whatsapp/Web Optimized/videos/anim-b26-meta-ai-group-v001-max900-crf22-noaudio.mp4>) ·
[poster](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/whatsapp/Web Optimized/posters/anim-b26-meta-ai-group-v001-max900-poster-q90.webp>) ·
[manifest](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/whatsapp/Web Optimized/anim-b26-meta-ai-group-v001-optimization-2026-07-23.json>) ·
[comparison](</Users/micahhoang/My Drive/Portfolio 2026/assets/by-project/whatsapp/Web Optimized/qc/anim-b26-meta-ai-group-v001-source-left-optimized-right-frame432.jpg>)
