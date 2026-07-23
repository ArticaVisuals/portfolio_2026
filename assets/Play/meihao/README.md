# Meihao Play Archive Video

Generated July 15, 2026 for the `micahhoang.com/play` Play Archive CMS row.

## Identified CMS Row

- Collection: `Play Archive` (`EySMRbI2N`)
- Item: `Meihao Drink Packaging`
- Slug: `play-001`
- Item ID: `U6mAV8puR`
- Order: `7`
- Poster: `https://framerusercontent.com/images/qFtiO5xwy51sMflzxQajxyHZw.png`
- Poster dimensions: `1219 x 1566`

## Generated Video

- Local file: `optimized/meihao-drink-packaging-flip-1220x1568-1000ms-bottom-preserved-crf25.mp4`
- Framer asset: `https://framerusercontent.com/assets/lBRT0UlFXfxADjTkxI0643mxaQ.mp4`
- Dimensions: `1220 x 1568`
- Duration: `3.000000s`
- Codec: H.264 High Profile, `yuv420p`, 24 fps, no audio, fast-start MP4
- Size: `1,047,094 bytes`
- SHA-256: `459df45e806121e52b8400b142bb8401ba197eaa4a0afc055f00c8a5be883604`

Sequence: current poster -> `_DSC9286-Edit-2-Edit 1.png` -> `IMG_9382 1.png`, each held for exactly 1000ms with hard cuts and no fade transition. The HTML video loop returns directly to the current poster frame. The DSC9286 crop is bottom-aligned with a light cover zoom so the bottle bases remain visible while avoiding letterbox bars.

## CMS Updates Applied

- `Video` (`KWCosE6Ef`) set to `https://framerusercontent.com/assets/lBRT0UlFXfxADjTkxI0643mxaQ.mp4`
- `Stroke` (`vq9I0excy`) set to `true`
- `Link Title` (`VfgNuQyis`) set to `READ MORE`
- `Link` (`YTkltwLjJ`) set to `https://www.figma.com/deck/ayBis8Rvugd01MsAlTYOTc`
- `Content` (`uhNqEiZxv`) set to:

> Meihao means "Good Plum" and sounds like "wonderful" in Chinese. This sparkling suan mei tang concept reframes sour plum juice for a modern global audience, pairing traditional herbal wellness cues with yuzu, hibiscus, turmeric, and ginger for bright, gut-friendly refreshment.

The poster field was intentionally left unchanged.

## Verification

- `ffprobe` confirmed the local MP4 metadata above.
- `qc/meihao-flip-bottom-preserved-contact-sheet.jpg` previews the loop frames.
- Framer CMS readback confirmed the updated video and content fields.
- `https://framerusercontent.com/assets/lBRT0UlFXfxADjTkxI0643mxaQ.mp4` returned `200`, `video/mp4`, byte ranges, and the expected `1,047,094` byte size.
- A cache-busted `https://micahhoang.com/play` fetch confirmed the public serialized row now includes the updated video/copy.
- Framer CMS readback confirmed the `READ MORE` CTA and Figma deck link. A cache-busted public fetch did not include the CTA immediately after the CMS update, so the public route may need the next Framer rebuild/cache refresh before the drawer CTA appears.
