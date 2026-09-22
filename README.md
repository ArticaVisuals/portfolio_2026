# Portfolio 2026

Micah Hoang's portfolio, built in Framer. This repository preserves the site's
code mirrors, design tokens, media, documentation, and the strategy behind it.

[View the live portfolio](https://micahhoang.com) ·
[About Micah](https://micahhoang.com/about)

## Portfolio strategy: Ideal Customer Profile (ICP)

**[Read the ICP (PDF)](docs/reference/Micah-Portfolio-ICP.pdf)** ·
[Download the Word document](docs/reference/Micah-Portfolio-ICP.docx)

The ICP explains who the portfolio is designed for and how that audience shapes
project curation, copy, and design decisions. Its primary reader is a senior
brand or design lead at an in-house team with a high standard of craft. The site
should help them assess the quality of the work, understand exactly what Micah
contributed, and get a sense of his judgment and approach to collaboration.

The central idea: **a brand designer who thinks in systems, with range as the
proof.** The document also considers studio creative directors, startup founders
and design leads, and fellow designers exploring the work in more depth.

[Browse all strategy and copy references](docs/reference/README.md).

## Top-level layout

| Folder | What's inside |
|---|---|
| **`code/`** | All code, in one place. `components/` (Framer code-component mirror `.tsx`), `mirror/` (compiled Framer snapshots + `manifest.json` mapping each component to its Framer `codeFileId`, plus `backups/`), `tools/` (scripts + the image-optimizer app), `tokens/` (design tokens). |
| **`docs/`** | Project docs read by humans and AI agents. Start with `docs/code-components-map.md`, then `docs/framer-current-state.md`. [Strategy and copy references](docs/reference/README.md) include the portfolio ICP. |
| **`assets/`** | All reusable media. Case-study assets are sorted under `by-project/<slug>/`; `/play` assets are sorted separately under `Play/<slug>/`. See **`assets/INDEX.md`**. |
| **`archive/`** | Retired material, old routes/code/backups, handoffs, and preserved browser/media QA under `generated-artifacts/`. See **`archive/README.md`**. |

Root files: `AGENTS.md` (agent entry point / Framer conventions), this `README.md`,
`workspace-organization-plan.md` (reorg history), `package.json`.

## Where to start

- **Understanding the portfolio's audience and rationale:** [Ideal Customer Profile (PDF)](docs/reference/Micah-Portfolio-ICP.pdf), then [strategy and copy references](docs/reference/README.md).
- **AI agents / Codex:** read `AGENTS.md`, then the docs it points to in `docs/`.
- **Finding a project's assets:** `assets/INDEX.md` → `assets/by-project/<slug>/`.
- **Finding `/play` media:** `assets/INDEX.md` → `assets/Play/<slug>/`.
- **Finding historical QA:** `archive/generated-artifacts/`.
- **Which local `.tsx` maps to which Framer component:** `code/mirror/manifest.json`.
- **Reorg history & rationale:** `workspace-organization-plan.md`.

## Framer is the source of truth

The [published-site snapshot](code/mirror/published/README.md), captured on
September 22, 2026, includes all 20 sitemap pages and their referenced Framer
runtime modules, including the latest About page and navigation. Its manifest
records source URLs, response statuses, file sizes, and SHA-256 hashes.

The `.tsx` in `code/components/` are **local mirrors** of Framer code components
(identified by `codeFileId`), not a buildable app — Framer hosts and runs the
live site. Editing a mirror does not change the site until it's pushed to Framer.
The published snapshot does not include unpublished editor changes or refresh
the original TSX mirrors.
