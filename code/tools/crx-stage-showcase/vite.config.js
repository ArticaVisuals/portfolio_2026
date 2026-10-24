import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({
  base: './',
  publicDir: resolve(import.meta.dirname, '../../../assets/by-project/optro-crx/stage-showcase'),
  resolve: { dedupe: ['three'] },
  build: {
    target: 'es2022',
    // The renderer is isolated in viewer.html and loaded only when the stage enters view.
    chunkSizeWarningLimit: 700,
    rolldownOptions: { output: { codeSplitting: { groups: [{ name: 'three', test: /node_modules\/three/ }] } }, input: { index: resolve(import.meta.dirname, 'index.html'), viewer: resolve(import.meta.dirname, 'viewer.html') } },
  },
});
