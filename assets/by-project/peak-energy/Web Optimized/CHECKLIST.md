# Peak Energy optimization checklist

- [x] Nine remote-only live originals archived in `../current-site/source/`.
- [x] Originals preserved; no source files overwritten.
- [x] H.264, `yuv420p`, fast-start MP4 derivatives generated.
- [x] Muted autoplay audio removed where present.
- [x] Intentional 24 fps clips preserved at 24 fps.
- [x] Quality-88 WebP posters generated from clean 25% frames.
- [x] `ffprobe` codec, dimensions, duration, frame rate, and audio checks passed.
- [x] Three-frame source-versus-optimized contact sheets reviewed for all nine clips.
- [ ] Upload derivatives and posters to Framer.
- [ ] Replace current case-study media references without changing layout behavior.
- [ ] Run published desktop and mobile visual QA after replacement.

| Asset ID | Before | After | Savings | SSIM | Visual risk |
| --- | ---: | ---: | ---: | ---: | --- |
| `QAYMhu4B0xdHJxnySBuabHtks` | 269,245 B | 218,258 B | 18.94% | 0.997460 | Very low; cadence normalized to 30 fps. |
| `ebURoH5YNfEa6FCrcr6l6QFS68Q` | 132,560 B | 107,483 B | 18.92% | 0.998733 | Very low. |
| `HHTkUi7SKOAAtY1MmzC0Q1b54Q` | 1,905,311 B | 1,608,891 B | 15.56% | 0.993785 | Very low; cadence normalized to 30 fps. |
| `o0EK9YezE48hWm1UC3BcEme8ifY` | 383,983 B | 310,074 B | 19.25% | 0.997129 | Very low. |
| `9Z12PCxBfwmh6gJITSSks4qYGLM` | 965,147 B | 347,010 B | 64.05% | 0.999261 | Very low; 24 fps preserved. |
| `7MFleSRgo8r2lOEcs94tDjD41TI` | 1,043,132 B | 403,094 B | 61.36% | 0.999020 | Very low; 24 fps preserved. |
| `YTha6qQtYqtUuIUE9g1ffdEVKc` | 8,942,572 B | 5,309,518 B | 40.63% | 0.985060 | Low; high-motion detail retained with CRF 23. |
| `vkN4eGEAUSjfMw2lXOgnL5wcSo` | 970,399 B | 827,273 B | 14.75% | 0.994452 | Very low. |
| `qmBGS9TepzZYV60oqT58TCaPs` | 1,313,344 B | 237,931 B | 81.88% | 0.995993 | Very low; unused AAC track removed. |

The nine videos total 15,925,693 bytes before and 9,369,532 bytes after, a 41.17% reduction. Contact sheets are in `verification/`; upload-ready videos and posters are in `videos/` and `posters/`.
