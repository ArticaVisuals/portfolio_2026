# Cellular Symphony optimization checklist

- [x] Original preserved and matched byte-for-byte to the live Framer asset.
- [x] Related-card video resized to 960x540 with 60 fps preserved.
- [x] H.264, `yuv420p`, fast-start MP4 generated without muted autoplay audio.
- [x] Quality-88 WebP poster generated.
- [x] `ffprobe`, atom-order, SSIM, and three-frame visual checks passed.
- [ ] Upload the derivative and poster to Framer.
- [ ] Verify the related-project card after publishing.

The video is 941,276 bytes versus 12,010,831 bytes before, a 92.16% reduction. SSIM is 0.989494 and visual risk is low.
