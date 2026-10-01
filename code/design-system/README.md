# Micah Hoang Design System

The foundations, components and page patterns behind [micahhoang.com](https://micahhoang.com), documented for people and for design agents. It's modeled on [design.rogo.ai/product](https://design.rogo.ai/product): every page has live examples and also exists as plain markdown.

It documents the **live** site, measured from the published pages on 2026-10-01 and mapped to Framer styles and code components. It's a local reference. Nothing here changes the Framer project.

## Open it

```bash
python3 -m http.server 4319 --directory code/design-system
```

Then visit http://localhost:4319/site/. In the Claude desktop app, the `design-system` entry in `.claude/launch.json` does the same thing.

## Layout

| Path | What it is | Edit? |
| --- | --- | --- |
| `agents.md` | Start here if you are an agent | Yes |
| `content/**/*.md` | Every page (Foundations, Components, Patterns), with front matter | Yes, the source of truth |
| `tokens/tokens.json` | Design tokens (W3C DTCG format) | Yes, the source of truth |
| `css/fonts.css`, `css/base.css`, `css/components.css` | Styles | Yes |
| `js/components.js` | Optional behavior: reveals, lightbox, filters, toggles, loader, grain | Yes |
| `assets/samples/` | A few project images used in examples | Yes |
| `site/assets/docs.css`, `docs.js` | Docs-site chrome | Yes |
| `tokens/tokens.css`, `css/type.css` | Generated | No |
| `site/**/*.html`, `site/assets/search-index.js` | Generated | No |
| `llms.txt`, `llms-full.txt`, `components.json` | Generated, for agents | No |

## Rebuild

```bash
node code/design-system/build.mjs
```

No dependencies (Node 18+).

## Notes

- `code/tokens/micahhoang-tokens.json` is the retired Manrope token set. The live type and color now come from `tokens/tokens.json` here and `code/tokens/framer-active-text-styles.tokens.json`.
- Fonts load from the Framer-hosted GT Standard files the site already uses. The Medium and Bold faces are GT Standard *Trial* files.
- `content/foundations/interaction.md` applies Apple's WWDC interface principles as a labeled lens (already true / for new work / departure). It does not change live behavior.
