# National Park Cards video optimization checklist

- [x] Resolved all seven published project videos to local sources.
- [x] Converted the remaining MOV/HEVC path to browser-safe H.264 MP4.
- [x] Reused already-efficient H.264 video streams for the reel, SnapTik, and published NPPC clip; removed unused audio and added fast-start without generational loss.
- [x] Encoded card and typography motion at conservative CRF 23.
- [x] Preserved all intended frame rates, including the 59.94 fps SnapTik source.
- [x] Reused all seven existing project posters.
- [x] Verified every output with `ffprobe`: H.264, yuv420p, zero audio streams.
- [x] Inspected three side-by-side representative frames, including the fine card illustration and the “20000 DECKS SOLD” typography. SSIM scores were 0.999206, 0.991092, and 0.999608; no visible text or line-art degradation was found.

Batch result: 23,178,824 bytes to 13,987,022 bytes, saving 9,191,802 bytes (39.7%).

The fetched published NPPC source is retained in `current-site/` for the lossless video-stream remux. Inferior CRF test encodes were removed and remain reproducible from the preserved originals.
