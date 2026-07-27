# Simon & Schuster web optimization checklist

- [x] Existing 2400px derivatives reused for the flagged 3111×2333 PNG and 6000×4000 JPEG.
- [x] Three live animated GIFs converted to max-900 H.264 High CRF22 MP4 files.
- [x] Three matching max-900 WebP q88 posters generated from the first frames.
- [x] All MP4 files use yuv420p and fast-start metadata.
- [x] Sharp and ffprobe metadata recorded in `optimization-manifest.json`.
- [x] Source files and existing derivatives left untouched.
- [x] Representative poster and mid-video visual inspection completed; text, marks, textures, and animation states remain intact.

Animated GIFs before: 11,139,613 bytes

MP4 files after: 499,404 bytes

MP4 reduction: 95.5%

Poster overhead: 115,570 bytes

Audited set including reused stills and new posters: 42,443,432 → 2,064,589 bytes (95.1% reduction)
