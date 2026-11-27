---
title: Principles
section: Foundations
order: 1
description: Five words that settle design decisions, the voice the site writes in, and the interaction rules behind its behavior.
---

# Principles

The portfolio presents a brand designer who thinks in systems, with range as the proof. Its main reader is a senior brand or design lead with a high craft bar. The site's job is to make the work easy to read without diluting or over-explaining it.

## Five words

| Principle | Means | In practice |
| --- | --- | --- |
| **Considered** | Every element earns its place. | No feature because it's cool. If a component isn't on this site, don't add it. |
| **Quiet** | The work is loud enough. The site doesn't need to be. | Cream ground, one green, small mono labels, no decoration. Media carries the color. |
| **Alive** | Small, intentional moments of motion and response. | Flip-rail hovers, type that rises in, a faint moving grain. Never motion for its own sake. |
| **Specific** | "I did X", not "we did Y". Credit is precise. | Meta grids name the client, role and scope. Copy names real outcomes. |
| **Shipped** | Work that exists in the world outweighs work that lives in Figma. | Lead with launched work; show it in context (product, retail, motion). |

What the site is not: an archive (the [Index](../patterns/index-archive.md) holds everything; Home shows six projects), a UX deep-dive site (process lives inside case studies), or a template.

## Voice and copy

- **Plain, first person, present tense.** "I'm a brand designer with a systems mind."
- **Short declaratives.** Case-study intros chain cause and effect: "A photograph becomes a data point. A data point becomes a record."
- **Title Case only for project names**; headings are sentence case ("About Micah").
- **Mono labels are nouns, not sentences**: `/ INDUSTRY`, `VIEW ALL`, `AVAILABLE FOR WORK`.
- **The slash is structural.** Meta labels start with `/ ` and numbered titles read `1 / GAIA`.
- **Credits are exact**: "Client: Self-Initiated Proposal", "Designer: Micah Hoang".
- No exclamation marks, no emoji, no "passionate", "innovative", "pixel-perfect".

## Interaction rules

Apple's interface guidance (WWDC *Designing Fluid Interfaces*, *The Details of UI Typography*, *Principles of Great Design*) applied to this site as a lens, not a redesign. Each rule is labeled:

- **Already true**: the live site behaves this way. Preserve it.
- **New work**: follow it for components that don't exist yet. Don't retrofit live components.
- **Departure**: the brand deliberately does something else. Don't "fix" it.

| Rule | Label | Here |
| --- | --- | --- |
| Motion is interruptible, reverses from the current value, and never overshoots | Already true | Flips, media scale and color are CSS transitions on the decelerating Snappy curve. |
| Enter and exit along the same path; anchor overlays to their source | Already true | Flips go up and back down; the lightbox zooms out of the clicked thumbnail; mobile filter panels grow from their trigger; the boot curtain lifts. |
| Exits are faster than entries | Already true | Panels and the lightbox demo open in 250ms and close in 150ms. |
| Reduced motion is gentler, not absent | Already true | Flips run at 0ms, reveals render in place, the grain stops, scroll-to-top jumps. Color and opacity feedback stays. |
| 44px minimum touch targets | Already true | Every mobile link, pill, filter, toggle, menu button and footer row; labels keep their size inside larger hit areas. |
| Show that a row scrolls; use native scrolling | Already true | Mobile pill rows run edge to edge so a cut-off pill signals more; the browser supplies momentum. |
| Direct manipulation: 1:1 tracking, drag threshold, per-axis momentum | Already true | `/play` (see [Motion](motion.md#gesture)). |
| Type: tracking tightens and leading shrinks as size grows; hierarchy from size, not weight | Already true | Display -1% / 100%, body 0 / 140%; bold only on the two display titles. |
| Respond on pointer-down; springs for anything grab-able; rubber-band at edges | New work | Use the `motion.spring.*` tokens. Hover and reveal motion keeps its bezier curves. |
| Text scales with the user's text size | New work | Body-size text should survive 200% browser zoom without overlap. |
| New forms validate inline | New work | Mono labels in `--mh-text-strong`. Don't add a red without asking. |
| Translucent, blurred chrome; scroll-edge fades; depth from shadow | Departure | The brand is flat: opaque surfaces, 1px rules, no shadows. |
| System font | Departure | GT Standard is the brand; `system-ui` is only a fallback. |
| Sound and haptics | Departure | None. |

## Accessibility

- Stroke Gray `#848484` on Cream is **3.43:1**: fine for tags, outlines and secondary meta, below 4.5:1 for small text. Don't use it for anything a visitor must read to use the page; use `--mh-text-body` (Graphite, ~7.2:1) or stronger.
- Forest Green on Cream ≈ 12:1; near-black on Cream ≈ 17:1; Cream on Forest Green ≈ 12:1.
- The nav has no visible current-page state by design; mark the current link with `aria-current="page"`.

## Decision checklist for agents

1. Does an existing component or pattern already cover this? Use it.
2. Does every color, size and duration resolve to a token?
3. Is there one clear display moment per view, with everything else small?
4. Would removing this element lose anything? If not, remove it.
5. Does it work at 390px, with 44px targets and reduced motion?

## Changing the live site

The design system documents micahhoang.com; it doesn't change it. To move a live behavior (for example a touch press state or a current-page nav marker): write it up with the Framer component or style it touches, get Micah's approval, push a dated rollback branch of the affected source (repo `AGENTS.md`), change it in Framer, publish, run published QA (`npm test` for Play files), then update the page here.
