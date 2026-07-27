# Highland Harvests / Karuna optimization checklist

- [x] Originals preserved.
- [x] Live Framer assets matched to byte-identical local sources.
- [x] H.264, `yuv420p`, fast-start MP4 derivatives generated.
- [x] Muted autoplay audio tracks removed.
- [x] Intentional frame rates preserved.
- [x] Quality-88 WebP posters generated from clean 25% frames.
- [x] `ffprobe` codec, dimensions, duration, frame rate, and audio checks passed.
- [x] Three-frame source-versus-optimized contact sheets reviewed.
- [ ] Upload derivatives to Framer and replace the current video/poster references.
- [ ] Run published desktop and mobile visual QA after replacement.

| Asset | Before | After | Savings | SSIM | Visual risk |
| --- | ---: | ---: | ---: | ---: | --- |
| Main process video | 24,545,086 B | 3,848,133 B | 84.32% | 0.986692 | Low; fine wood-dust micro-detail is slightly reduced. |
| Device loop | 5,666,993 B | 947,101 B | 83.29% | 0.975678 | Low; native size and 60 fps are preserved. |

Contact sheets are in `verification/`; upload-ready videos and posters are in `videos/` and `posters/`.
