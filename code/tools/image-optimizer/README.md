# Portfolio Image Optimizer

Internal web tool for preparing Portfolio 2026 image assets before they move into
Framer, case-study manifests, or CDN re-hosting workflows.

## Run

```bash
cd "code/tools/image-optimizer"
npm install
npm start
```

Open `http://localhost:4177`.

## Workflow

- Scan `assets/by-project` (all projects) or a narrower project folder such as `assets/by-project/<slug>`.
- Choose a preset:
  - `Case` keeps case-study media under 1800px wide at quality 82.
  - `Thumb` keeps index/home thumbnails under 1600px wide at quality 82.
  - `Poster` exports JPEG stills under 1800px wide at quality 80.
  - `Detail` keeps hero/detail media under 2400px wide at quality 85.
- Optimize the batch.
- Download the ZIP or use the local output folder:

```text
code/tools/image-optimizer/output/{session}/optimized
```

Each run writes:

- `manifest.json`
- `manifest.tsv`
- optimized files with source folder structure preserved

## Notes

- Images are resized without cropping and never upscaled.
- `Auto` exports JPEG for opaque images and preserves PNG for alpha images.
- WebP and AVIF are available as explicit options.
- Metadata is stripped by default.
- `Keep smaller original` prevents larger converted files from replacing the
  source.
- Animated GIFs are left untouched unless `Convert animated GIFs` is enabled.
- Manifest rows include a `framerManifestLine` field in `imageUrl|alt` form for
  Framer carousel-style manifests after the files have a final hosted URL.
