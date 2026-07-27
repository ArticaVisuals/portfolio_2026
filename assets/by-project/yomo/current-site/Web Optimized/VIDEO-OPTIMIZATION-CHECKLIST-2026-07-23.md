# Yomo video optimization checklist

- [x] Resolved both published videos to local sources.
- [x] Encoded conservative H.264/yuv420p variants at CRF 23, slow preset.
- [x] Preserved source frame rate and removed unused audio/metadata.
- [x] Added missing q88 WebP posters at 1600 px maximum long edge.
- [x] Verified both outputs with `ffprobe`: H.264, yuv420p, zero audio streams.
- [x] Inspected side-by-side UI frames. SSIM scores were 0.996640 and 0.997930, with no visible loss in small labels, controls, or red accents.

Batch result: 10,519,312 bytes to 1,819,208 bytes, saving 8,700,104 bytes (82.7%). Posters add 113,092 bytes total.
