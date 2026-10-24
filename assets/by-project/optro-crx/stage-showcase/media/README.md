# Showcase media (first pass)

These are first-pass selections for the stage viewer. They have not been confirmed by the user.

- `vanish.mp4` — Encoded the full 70-second original-colorway Vanish master at 1568×560, 30 fps, H.264/yuv420p, CRF 25, with fast start and no audio. Source: `/Users/micahhoang/Desktop/Optro/CRX_Widescreen_Test/_RENDERS/CRX_Vanish_Original_Colorway_20pct_1568x560_v04_MASTER.mov`. The CRX Widescreen Test README identifies this root-level file as the current original-colorway master.
- `vanish.jpg` — One frame extracted at 10 seconds from `vanish.mp4` for the still fallback (1568×560).
- `center.jpg` — A 1840×640 resize of `side_source.jpg` used as a still center-screen fallback. The full 1800×626 CRX 2026 hero artwork is retained with no cropping. A suitable resident finished 3680×1280 loop was not available: the current Countdown master and Keynote Backplates loop were cloud-only, and the locally resident Countdown review was a non-looping opening/ending compilation with construction guides. The viewer manifest should disable center video until a suitable final motion asset is available.
- `side.jpg` — A 1040×640 still made from `side_source.jpg`. The full 1800×626 hero artwork is scaled to 1040×362 and centered vertically over its Midnight background color (#0F2230); the CRX 2026 logo is not cropped. `side_source.jpg` was downloaded from the provided verified hero asset: https://framerusercontent.com/images/YVYRaESfisWWvTu8cJZSv2fAY.jpg.
