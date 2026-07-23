# Portfolio 2026 — Workspace Map

Micah Hoang's portfolio (built in Framer). This root is intentionally small.
Everything is sorted into four top-level folders. Start here to find anything.

## Top-level layout

| Folder | What's inside |
|---|---|
| **`code/`** | All code, in one place. `components/` (Framer code-component mirror `.tsx`), `mirror/` (compiled Framer snapshots + `manifest.json` mapping each component to its Framer `codeFileId`, plus `backups/`), `tools/` (scripts + the image-optimizer app), `tokens/` (design tokens). |
| **`docs/`** | Project docs read by humans and AI agents. Start with `docs/code-components-map.md`, then `docs/framer-current-state.md`. `docs/reference/` holds human-only strategy/copy. |
| **`assets/`** | All media, sorted **by project**. `by-project/<slug>/` (with `framer-staging/` + `current-site/` provenance subfolders), `shared/` (cross-project poster/optimized sets). See **`assets/INDEX.md`** to find any project's media at a glance. |
| **`archive/`** | Retired material not on the published site: `cargo-era/` + `retired-framer-routes/` media, `info-page-backups/`, old page/backups, `misc/`. |
| `output/`, `outputs/` | Generated QA / optimization / presentation batches (mostly gitignored scratch). |

Root files: `AGENTS.md` (agent entry point / Framer conventions), this `README.md`,
`workspace-organization-plan.md` (reorg history), `package.json`.

## Where to start

- **AI agents / Codex:** read `AGENTS.md`, then the docs it points to in `docs/`.
- **Finding a project's assets:** `assets/INDEX.md` → `assets/by-project/<slug>/`.
- **Which local `.tsx` maps to which Framer component:** `code/mirror/manifest.json`.
- **Reorg history & rationale:** `workspace-organization-plan.md`.

## Framer is the source of truth

The `.tsx` in `code/components/` are **local mirrors** of Framer code components
(identified by `codeFileId`), not a buildable app — Framer hosts and runs the
live site. Editing a mirror does not change the site until it's pushed to Framer.
