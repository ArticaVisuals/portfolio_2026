# AGENTS.md - Framer And Codex Integration

## Project Overview

This is a modern portfolio website built in Framer. When generating code,
structure, or content, align work with Framer's layout mechanics and the
existing project system instead of defaulting to generic web app patterns.

Prefer Framer-native concepts such as Stacks, Columns, responsive layout
constraints, CMS collections, component overrides, and design tokens.

## Framer-To-Codex Conversion Rules

- Layouts should use CSS Flexbox or Grid when translating Framer structure into
  React or override code.
- Avoid magic numbers and strict pixel widths unless an existing Framer export
  or token requires them.
- Prefer percentages, `fr`, `minmax()`, fluid constraints, and existing layout
  primitives for responsive sizing.
- Maintain the project's main breakpoint intent:
  - Desktop: `1200px`
  - Tablet: `810px`
  - Mobile: `390px`
- Follow the defined Framer token system for typography, color, spacing, radius,
  and motion.
- Do not hardcode raw hex colors when an existing token, CSS variable, or Framer
  style is available.
- If generating dynamic content, structure arrays and data models to map cleanly
  to the Framer CMS collections.

## Workflow Constraints

- Use semantic HTML such as `header`, `main`, `section`, and `footer` when
  producing page structure or React components.
- Use reusable modern React patterns and Framer Motion principles when motion or
  interaction is required.
- Before extensive layout generation or broad structural changes, outline a
  short plan and wait for approval.
- Prevent design drift. If the work starts to look too plain, do not invent new
  brand styling. Inspect the main landing page, existing components, token files,
  Framer exports, or ask for the original brand guidelines.
- Keep edits scoped to the Portfolio 2026 system and preserve existing project
  architecture.

## Documentation References

When structural layout references are needed, use the main Framer page exports,
local `.md` project documents, or the Framer MCP when available.

Start with nearby project documentation such as:

- `framer-current-state.md`
- `portfolio-framework.md`
- `index-component-instructions.md`
- `case-study-cms-workflow.md`
- `micahhoang-tokens.json`
