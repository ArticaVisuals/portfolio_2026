# CRX stage viewer

From this directory run `npm ci`, then `npm run dev` or `npm run build`. Requires Node 22.12+ (Vite 8). The generated `dist/` is a standalone static site; `viewer.html` is the Framer embed.

Source is self-contained in this folder, including the original stage screen shader in `src/screens.js`. Vite copies the optimized model, scene data, poster, and media from `../../../assets/by-project/optro-crx/stage-showcase/`. Media provenance is recorded there. `npm run optimize -- /path/to/original-stage.glb` regenerates the smaller model without changing the original.

The source is preserved in Portfolio 2026. See [integration and deployment](../../../docs/crx-stage-showcase.md) for the Framer instance, HTTPS viewer, release details, and validation.
