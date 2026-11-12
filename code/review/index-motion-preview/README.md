# Index motion component preview

This isolated harness bundles the **actual** local `IndexPageGridPreview.tsx` and `IndexPage.tsx`; it does not recreate their interaction code. The approved Polish baseline is frozen to commit `8670d0b`. Each browser load rebuilds the selected bundle, so updates to the current component source are immediately reviewable after Replay load.

```sh
cd code/review/index-motion-preview
npm ci
npm start
```

Open http://127.0.0.1:8766. Use `PORT=8767 npm start` if needed.

`npm run build` compiles both versions without running a server. Dependencies and generated bundles are local development-only and ignored by Git. No root package or production Framer dependency is changed.

## Scenarios

- **Ready:** passes clearly labeled preview fixtures through the component's existing `useCMS=false` property controls.
- **Loading:** runs the real `useCMS=true` path against a local module with the generated CMS export shape and a selectable 1.8-second / 8-second `scanItems()` delay. No manual projects are passed in CMS mode.
- **Empty / failure:** exercise the existing CMS result/failure paths with the same delay.
- **Viewport:** fit-window, 1440, 810, and 390px iframe widths run the actual media/container queries. Fixed desktop width may require horizontal scrolling on a narrow host window.
- **Reduced motion:** defaults to the operating-system preference. The explicit preview-only emulation control overrides only the reduced-motion matchMedia query and activates the existing component reduced-motion CSS blocks in the development bundle. Unrelated media queries and production files remain unchanged. Changing the test mode reloads the iframe.

The small Framer shim supplies no-op property-control registration and reports the **preview** render target, ensuring real browser effects and progressive mounting execute. The external Framer base-component import is redirected only by the development bundler to the local TSX. Production imports and CMS logic are untouched.

The hero and toolbar are review scaffolding. Preview fixtures reuse local design-system sample images; they are not the full current CMS collection. Case-study links are prevented from navigating away from the harness. Filter links/buttons retain their behavior.
