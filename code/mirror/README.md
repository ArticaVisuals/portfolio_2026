# Framer Code Mirror

Generated: 2026-06-15

This folder completes the local Framer code inventory without moving active root
working files. Current/editable TSX mirrors stay at the repository root because
project docs and Framer workflows expect them there.

## Contents

- `manifest.json` - full Framer code inventory, codeFileIds, local paths, hashes,
  insert URLs, and source-kind notes.
- `code-components/compiled-js/` - compiled Framer module snapshots downloaded
  from each missing code component's insert URL. These are reference snapshots,
  not editable TypeScript source.
- `code-components/wrappers/` - small Framer wrapper modules from `framer.com/m`.
- `code-overrides/source-tsx/` - override compatibility files saved as source
  from Framer MCP `readCodeFile`.

Use root TSX files for active editing. Use this mirror when you need to inspect
legacy helpers, draft Play files, or override compatibility exports that still
exist in Framer but are not active root working files.
