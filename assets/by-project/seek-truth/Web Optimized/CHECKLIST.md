# Seek Truth optimization checklist

- [x] Original preserved and matched byte-for-byte to the live Framer asset.
- [x] Related-card video resized to 960x540.
- [x] H.264, `yuv420p`, fast-start MP4 generated.
- [x] Quality-88 WebP poster generated.
- [x] `ffprobe`, atom-order, SSIM, and three-frame visual checks passed.
- [ ] Upload the derivative and poster to Framer.
- [ ] Verify the related-project card after publishing.

The video is 1,341,282 bytes versus 2,034,449 bytes before, a 34.07% reduction. SSIM is 0.995126 and visual risk is very low.
