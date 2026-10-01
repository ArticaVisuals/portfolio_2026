# Micah Hoang Design System: for agents

The brand foundations, components and page patterns behind micahhoang.com, the portfolio of brand designer Micah Hoang. Everything here is plain markdown, so you never need to render the HTML site to read it.

## How to read this system

| What you want | Where it is |
| --- | --- |
| This guide | `agents.md` |
| Index of every page, one line each | `llms.txt` |
| The whole system in one file (pages + tokens) | `llms-full.txt` |
| One page | `content/<section>/<slug>.md` |
| Machine-readable component list (classes, tokens, Framer ids) | `components.json` |
| Token source of truth | `tokens/tokens.json` (W3C DTCG format) |
| Tokens as CSS custom properties | `tokens/tokens.css` (generated) |
| Component styles / behavior | `css/components.css`, `js/components.js` |
| The rendered docs site | `site/index.html` (open in a browser) |

Every page opens with YAML front matter: `title`, `section`, `description`, and, for components, `status`, `classes`, `tokens`, `framer` and `codeFileId`. Each component page has the same sections in the same order: examples (fenced ```` ```html example ```` blocks you can copy verbatim), usage, API, accessibility, Framer mapping, don'ts.

## The brand in ten lines

1. Two surfaces only: **Cream** `#F7F5F0` (default) and **Forest Green** `#233324` (footer, loader, inverted blocks).
2. Two typefaces only: **GT Standard** (display + body) and **GT Standard Mono** (labels, always uppercase, 12-13px).
3. Display type is huge and tight (120px hero, 70px sections, 100% leading, -1% tracking). Everything else is small.
4. Flat. No shadows, no gradients, no rounded cards. Media is square-cornered. The only radius is the tag pill.
5. Structure comes from **1px rules** in near-black `#141414` and from space, never from boxes.
6. There is no filled button. Actions are mono text with a **flip-rail hover**, or an outlined pill.
7. Interactive green `#25593A` is for hover/active states only, never a fill.
8. Motion is quiet, decelerating and interruptible: Snappy `cubic-bezier(0.16, 1, 0.3, 1)` for nearly everything (420ms hovers, 900ms type reveals); critically damped springs only for new things the user can grab.
9. A subtle umber film grain sits over the page (10% multiply).
10. Voice: considered, quiet, alive, specific, shipped. "I did X", not "we did Y".

## Rules

- **Use what exists.** If a page here documents it, reuse it. The live site is Framer; most components already exist there as code components. Read the "Framer mapping" section and use the named `codeFileId` or Framer style before building anything new (see the repo's `AGENTS.md`).
- **Tokens, never raw values.** Use `var(--mh-…)` from `tokens/tokens.css`, or the token path from `tokens.json` in Framer. If a value is missing, add it to `tokens.json` and run `node build.mjs`; don't inline a hex.
- **Semantic color roles, not primitives.** Write `var(--mh-text-muted)`, not `var(--mh-color-light-gray)`. Roles re-map on `data-surface="green"`; primitives don't.
- **Respect the breakpoints**: desktop ≥1200px, tablet 810–1199px, mobile <810px (Framer frames: 1200 / 810 / 390).
- **Don't invent brand.** No new colors, fonts, radii, shadows, gradients, emoji or icon sets. If a design feels too plain, the answer is better type scale, more space, or real project media, not decoration.
- **Mono is always uppercase** and never used for paragraphs.
- **One H1 per page.** Display XL is reserved for the home hero name.
- **Don't change live behavior.** `content/foundations/interaction.md` applies Apple's interface principles. Each rule is labeled **Already true** (preserve it), **For new work** (follow it only when building something new) or **Departure** (the brand wins; don't "fix" it). Changing how micahhoang.com looks or behaves needs Micah's explicit approval and a Framer publish.
- **Hover and reveal motion use the bezier tokens; only grab-able UI uses springs** (`motion.spring.*`, see `content/foundations/gesture.md`).
- **`/play` is protected.** Its drag, inertia and video-pool behavior are performance contracts in the repo `AGENTS.md`; they override anything here.

## Quick start (HTML)

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

## Quick start (Framer)

- Colors: use the project color styles `/Cream`, `/Forest Green`, `Light Gray`; others are listed on the Colors page with their tokens.
- Type: use the Framer text styles named on the Typography page (`Heading 1`, `Heading 2`, `Heading 3`, `Heading 5`, `Body`, ...).
- Layout: Stacks and Grids with the gutter and gap tokens; desktop-first with tablet and phone breakpoint overrides.
- Code components: look up the `codeFileId` in `components.json` and the repo's `code/mirror/manifest.json`.

## Maintaining this system

- Edit `tokens/tokens.json` or `content/**/*.md`, then run `node code/design-system/build.mjs`. It regenerates `tokens.css`, `css/type.css`, the HTML site, `llms.txt`, `llms-full.txt` and `components.json`.
- Hand-written files: `css/fonts.css`, `css/base.css`, `css/components.css`, `js/components.js`, `site/assets/docs.*`, this file.
- Values were measured from the published site on 2026-10-01. Framer is the runtime source of truth; if the live site and this system disagree, check the site and update the token here.
- `code/tokens/micahhoang-tokens.json` (Manrope, `#027aff`) is a stale pre-2026 token set. Do not use it.
