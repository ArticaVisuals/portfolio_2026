# TYPLDN video optimization checklist

- [x] Resolved all four published project videos to local sources.
- [x] Encoded H.264/yuv420p variants at conservative CRF 23, slow preset.
- [x] Kept the photography-heavy full-width film at 1920 px to protect small environmental typography.
- [x] Preserved source frame rates and removed unused audio/metadata.
- [x] Added q88 WebP posters for all four previously posterless clips.
- [x] Verified all outputs with `ffprobe`: H.264, yuv420p, zero audio streams.
- [x] Inspected side-by-side frames for the subway poster and logo-variant animation. SSIM scores were 0.996416 and 0.999787; fine typography and geometric edges remain intact.

Batch result: 4,891,002 bytes to 1,691,487 bytes, saving 3,199,515 bytes (65.4%). Posters add 201,686 bytes total.
