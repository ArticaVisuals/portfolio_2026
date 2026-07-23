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
- Prefer native Framer capabilities before creating custom code components. Do
  not create a new component when the task can be handled cleanly with Framer's
  built-in layout, styling, CMS, effects, or interaction tools.
- When custom helper code is needed, extend an existing helper component before
  adding a new helper component. Create a new helper only when the task truly
  requires a separate abstraction.
- Before extensive layout generation or broad structural changes, outline a
  short plan and wait for approval.
- Prevent design drift. If the work starts to look too plain, do not invent new
  brand styling. Inspect the main landing page, existing components, token files,
  Framer exports, or ask for the original brand guidelines.
- Keep edits scoped to the Portfolio 2026 system and preserve existing project
  architecture.

## Protected Framer Authoring Contracts

- `/play` media must remain authorable through Framer property controls. Do not
  replace the managed archive with hardcoded-only arrays, static JSX, detached
  image layers, or a helper that hides or removes the `Archive Items` /
  `archiveItems` control.
- The `/play` production wrapper is `Play.tsx` (`PN1RVOf`). It must expose an
  `Archive Items` array backed by `archiveItems`, including media/poster,
  optional video, title, description, category, aspect dimensions, and stroke
  controls. `ArchivePlayground.tsx` (`QNpkYp5`) must continue accepting managed
  item arrays for runtime rendering and fallback.
- If refactoring `/play`, preserve or migrate existing authorable content first,
  verify the Framer inspector still exposes the media controls, then run
  published visual QA after Framer publish.

## Documentation References

When structural layout references are needed, use the main Framer page exports,
the project `.md` documents in `docs/`, or the Framer MCP when available.

Agent-read project documentation lives in `docs/`. Human-only strategy and copy
reference lives in `docs/reference/`. Start with:

- `docs/code-components-map.md` — at-a-glance map of every custom code component,
  the two recurring patterns, Framer gotchas, and the consolidation backlog. Read
  this first to orient on the custom TSX.
- `docs/framer-current-state.md`
- `docs/portfolio-framework.md`
- `docs/index-component-instructions.md`
- `docs/case-study-cms-workflow.md`
- `code/tokens/micahhoang-tokens.json`
