# Retired /play helpers & draft consolidations — 2026-06-18
Framework-audit Phase 1 retirement. These 10 Framer code files are superseded by the
current `/play` stack (`Play.tsx` `PN1RVOf` → `ArchivePlayground.tsx` `QNpkYp5`), which
folds in viewport-fix, editor-guard, card-hover, reveal-replay, nav passthrough, media
smoothing, sidebar/exit behavior, etc. The six `Playground*` helpers were kept only as
disabled (`enabled=false`) rollback instances on `/play`; the four `*Consolidated*/*Draft*`
files were unmounted historical attempts.

## Backup contents (this folder)
- `ArchivePlaygroundConsolidated.tsx` — editable TSX source (78 KB).
- `compiled-snapshots/*.js` — faithful compiled Framer module snapshots of all 10 (functional re-insert rollback).

## Rollback paths (in order of fidelity)
1. **Framer version history** — restores the EXACT editable TSX of any deleted code file. Primary editable-restore path.
2. **Compiled module URL** — re-insert the live module via the insert URL below (functional, not editable).
3. **`compiled-snapshots/`** here — offline copy of those compiled modules.

## Files
| File | codeFileId | Status / why retired | Insert URL (rollback) |
|---|---|---|---|
| `PlaygroundNavPassthrough.tsx` | `RBX6jsP` | Disabled instance on /play (rollback). Gen-1 helper; behavior now inside ArchivePlayground. | `https://framer.com/m/PlaygroundNavPassthrough-aU5mxf.js@NeQoqMVxiWZiAQp8tjph` |
| `PlaygroundRuleExitGuard.tsx` | `vdg69JZ` | Disabled instance on /play (rollback). Monkey-patched Element.prototype.remove. | `https://framer.com/m/PlaygroundRuleExitGuard-IXnV9j.js@As7flaoY1JILXat84vkr` |
| `PlaygroundInstantExitSnapshot.tsx` | `c2PU6kX` | Disabled instance on /play (rollback). | `https://framer.com/m/PlaygroundInstantExitSnapshot-WmySwq.js@b0yDTTQ1fEnLN9iQHDrT` |
| `PlaygroundSidebarColumnGuard.tsx` | `R3ZWYKl` | Disabled instance on /play (rollback). | `https://framer.com/m/PlaygroundSidebarColumnGuard-LLAoaQ.js@dPNnGZA9xtrxOAHbxLIr` |
| `PlaygroundNavExitHold.tsx` | `iivBAHR` | Disabled instance on /play (rollback). | `https://framer.com/m/PlaygroundNavExitHold-CYFOZy.js@nm6uBYjn9bBFlnmVSj3B` |
| `PlaygroundMediaLoadSmoother.tsx` | `FFqrKyU` | Disabled instance on /play (rollback). | `https://framer.com/m/PlaygroundMediaLoadSmoother-wfvXvN.js@INAsxIPMxQsSK86hCQNv` |
| `ArchivePlaygroundConsolidated.tsx` | `D5YVims` | Unmounted earlier consolidation attempt (no instance). Editable .tsx saved here. | `see framer-code-mirror/manifest.json` |
| `ArchivePlaygroundConsolidatedDraft.tsx` | `aEyj7Rq` | Unmounted legacy draft mirror (no instance). /play-consolidation-draft page no longer exists. | `https://framer.com/m/ArchivePlaygroundConsolidatedDraft-vOvUdP.js@RcN3sdsL3wrX95ceMQNx` |
| `PlayAccessibilityDraftPatch.tsx` | `IPugK6y` | Unmounted Gen-2 draft patch (no instance). | `https://framer.com/m/PlayAccessibilityDraftPatch-UnUooF.js@7RLmFzgQQDvocNdSxtiR` |
| `PlayDraftViewportFix.tsx` | `uO7AzzY` | Unmounted Gen-2 draft (no instance). Literal subset of Play.tsx internals. | `https://framer.com/m/PlayDraftViewportFix-wrOT3S.js@njgZmPrnzR1a6Fv4psXP` |

## Deletion checklist (must be done in Framer, then Publish)
- [ ] Detach the 6 disabled `Playground*` instances from `/play` — CHECK EVERY breakpoint (Desktop/Tablet/Phone); stray non-Desktop instances have broken the publish optimizer before.
- [ ] Delete the 10 code files.
- [ ] Publish Framer; QA `/`, `/index`, `/play`, `/info`, `/case-studies`, one bespoke case study.
