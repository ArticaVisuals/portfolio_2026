# AirPods video optimization checklist

- [x] Resolved all nine published project videos to local sources.
- [x] Encoded eight conservative H.264/yuv420p variants at CRF 23–24, slow preset.
- [x] Reused the better published H.264 stream for the 48-second Apple film, removed its unused audio, and added fast-start without re-encoding the video.
- [x] Preserved source frame rates and removed unused audio/metadata.
- [x] Reused all nine existing project posters.
- [x] Verified all outputs with `ffprobe`: H.264, yuv420p, zero audio streams.
- [x] Compared representative frames for the reveal and large-animation clips. SSIM scores were 0.992501 and 0.990562, with no visible gradient banding or edge degradation.

Batch result: 51,084,940 bytes to 14,485,420 bytes, saving 36,599,520 bytes (71.6%).

The fetched published source is retained in `current-site/` because it is the best source for the lossless video-stream remux. Inferior test encodes were removed; they are fully regenerable from the preserved originals.
