# Framer Code Mirror

Latest published-site capture: 2026-09-22. Legacy code inventory generated on
2026-06-15, with later per-file updates recorded in `manifest.json`.

This folder preserves Framer reference snapshots. Editable TSX mirrors live in
`../components/`; Framer remains the runtime and editor source of truth.

## Contents

- `manifest.json` - full Framer code inventory, codeFileIds, local paths, hashes,
  insert URLs, and source-kind notes.
- [`published/`](published/README.md) - current published HTML and referenced
  runtime modules, with a separate manifest and About/navigation browser evidence.
  This is the September 22 snapshot; it does not refresh original editor source.
- `code-components/compiled-js/` - compiled Framer module snapshots downloaded
  from each missing code component's insert URL. These are reference snapshots,
  not editable TypeScript source.
- `code-components/wrappers/` - small Framer wrapper modules from `framer.com/m`.
- `code-overrides/` - override compatibility files saved as source
  from Framer MCP `readCodeFile`.

Use `code/components/` TSX files for active editing. Use this mirror when you need to inspect
legacy helpers, draft Play files, or override compatibility exports that still
exist in Framer but are not active working files.
