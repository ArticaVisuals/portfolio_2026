# Micah Hoang Design System: for agents

The foundations, components and page patterns behind micahhoang.com, the portfolio of brand designer Micah Hoang. Everything is plain markdown; you never need to render the HTML site to read it.

## Where things are

| What | Where |
| --- | --- |
| Every page, one line each | `llms.txt` |
| Everything in one file (pages + tokens) | `llms-full.txt` |
| One page | `content/<section>/<slug>.md` |
| Components: classes, tokens, Framer ids | `components.json` |
| Tokens (source of truth, W3C DTCG) | `tokens/tokens.json` → `tokens/tokens.css` (generated) |
| Styles and behavior | `css/components.css`, `js/components.js` |
| What changed and when | `content/reference/changelog.md` |

Pages describe the current live site only. Component pages share one order: examples (```` ```html example ```` blocks you can copy), usage, API, accessibility, Framer mapping, don'ts.

## The brand in ten lines

1. Two surfaces: **Cream** `#F7F5F0` (default) and **Forest Green** `#233324` (footer, loader, mobile menu).
2. Two typefaces: **GT Standard** for display and reading, **GT Standard Mono** for every label, always uppercase, always 13px.
3. Display type is huge and tight (120px hero, 70px sections, 100% leading, -1% tracking); everything else is small. Phone reading text is 18px.
4. Flat: no shadows, gradients or rounded cards. Square media. The only radius is the tag pill.
5. Structure comes from **1px near-black rules** (`#141414`) and space, never boxes.
6. No filled button. Links and actions are mono text with a **flip** (420ms Snappy, one line up); pills are outlined.
7. Accent green `#25593A` is for hover/active only; Stroke Gray `#848484` (3.43:1) never for text someone must read.
8. Motion decelerates, moves a line or a few pixels, exits faster than it enters, and respects reduced motion.
9. A faint umber film grain sits over every page below the nav.
10. Voice: considered, quiet, alive, specific, shipped. "I did X", not "we did Y".

## Rules

- **Use what exists.** If a page documents it, reuse it. Most pieces already exist in Framer; check the page's Framer mapping (`codeFileId`, style name) before building anything.
- **Tokens, never raw values.** `var(--mh-…)` in code, the token's Framer style in Framer. Missing a value? Add it to `tokens.json` and run `node build.mjs`. Global values live in `layout`; per-component measurements in `component.<name>` (CSS `--mh-<name>-<key>`).
- **Semantic roles, not primitives.** `var(--mh-text-muted)`, not `var(--mh-color-light-gray)`; roles re-map inside `data-surface="green"`.
- **Breakpoints** 1200 / 810 / 390. **One 20px gutter** everywhere; **44px touch targets** below 810px (grow padding, not type).
- **Don't invent brand.** No new colors, fonts, radii, shadows, gradients, emoji or icon sets. Too plain? Use scale, space or real project media.
- **Don't change the live site from here.** [Principles](content/foundations/principles.md#interaction-rules) labels each interaction rule Already true / New work / Departure. Changing micahhoang.com needs Micah's approval, a pushed dated rollback branch (repo `AGENTS.md`) and a Framer publish.
- **`/play` is protected.** Its drag, inertia and video budget are performance contracts in the repo `AGENTS.md`.

## Quick start

HTML:

```html
<link rel="stylesheet" href="css/fonts.css">
<link rel="stylesheet" href="tokens/tokens.css">
<link rel="stylesheet" href="css/type.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/components.css">
<body data-surface="cream">
  …
  <script src="js/components.js"></script>
</body>
```

Framer:

- Colors: `/Colors/` Cream, Forest Green, Off-Black, Text Gray, Stroke Gray, White. Accent green is set per component instance, not a style.
- Type: `/Text Styles/` Heading 1, Heading 2, Heading 2 Bold, Heading 3, Heading 4, Body XL, Body L, Body M, Small Mono, Small Mono Footers.
- Layout: Stacks and Grids with the gutter and gap tokens; desktop-first with tablet and phone overrides.
- Code components: `components.json` and the repo's `code/mirror/manifest.json`.

## Maintaining

- Edit `tokens/tokens.json` or `content/**/*.md`, then run `node code/design-system/build.mjs` (regenerates tokens.css, type.css, the site, llms files and components.json). Hand-written: `css/fonts.css`, `css/base.css`, `css/components.css`, `js/components.js`, `site/assets/docs.*`, this file.
- Desktop values come from the Framer project; tablet and phone values are measured on the published site. `qa/home.html` + `qa/compare.js` check Home against the live page at 1200 / 810 / 390.
- When the live site changes, update the affected page in the present tense and add a dated entry to the changelog.
- `code/tokens/micahhoang-tokens.json` (Manrope, `#027aff`) is a retired pre-2026 set. Don't use it.
