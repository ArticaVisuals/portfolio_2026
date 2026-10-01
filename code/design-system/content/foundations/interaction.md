---
title: Interaction Principles
section: Foundations
order: 1.5
description: Apple's fluid-interface and design principles from its WWDC talks, applied to this brand. Each rule is labeled as already true, for new work, or a deliberate departure.
---

# Interaction Principles

## How to read this page

This page applies Apple's interface guidance (WWDC *Designing Fluid Interfaces*, *The Details of UI Typography*, *Principles of Great Design*) to micahhoang.com. It is a **lens, not a redesign**. Every rule carries one of three labels:

| Label | Meaning | What an agent may do |
| --- | --- | --- |
| **Already true** | The live site already behaves this way. | Preserve it. Use it as the reason the behavior exists. |
| **For new work** | Applies to components and pages that don't exist yet. | Follow it when building something new. **Don't retrofit live components.** |
| **Departure** | The brand deliberately does something else. | Follow the brand. Don't "fix" it toward Apple's guidance. |

**Changing a live behavior is out of scope for this page.** Any change to how micahhoang.com looks or behaves needs Micah's explicit approval and a Framer publish. See [Changing the live site](#changing-the-live-site). The protected `/play` performance contracts in the repo's `AGENTS.md` always take precedence.

## Eight principles, five words

Apple's eight design principles line up with the site's own five words ([Principles](principles.md)). Use the site's words in copy and reviews; the Apple names are there to clarify the reasoning.

| Apple principle | Site word | How it shows up here |
| --- | --- | --- |
| Purpose | Considered | Six projects on Home, not all of them. Every element earns its place. |
| Simplicity (not minimalism) | Quiet | Cream, one green, small labels. Hierarchy from order, size and space. The Index adds context instead of hiding it. |
| Craft | Considered | Every spacing, timing and color is a token you can defend. |
| Familiarity | Specific | Nav labels name their contents (Work, Play, Index, About). Same component, same behavior, same place on every page. |
| Agency | Specific | Filters are reversible ("Clear filters"); nothing traps the visitor; no confirmation dialogs because nothing is destructive. |
| Flexibility | Shipped | Three breakpoints, touch and pointer both supported, reduced motion respected. |
| Responsibility | Specific | Credits are exact; testimonials are real; no tracking-for-its-own-sake. |
| Delight | Alive | The result of the other seven: flip rails, rising type, a moving grain. Never confetti. |

## Motion and response

| Rule | Label | Here |
| --- | --- | --- |
| Animations are interruptible and reverse from the current on-screen value | **Already true** | Flip rails, media scale and tag color are CSS transitions; leaving mid-hover reverses from the live position. |
| Enter and exit along the same path | **Already true** | Flip rail goes up and comes back down; lightbox zooms from and back to the clicked thumbnail; the boot curtain lifts up and off. |
| Anchor overlays to their source | **Already true** | `CaseStudyLightbox` zooms out of the thumbnail rather than the screen center. |
| Default motion doesn't overshoot | **Already true** | The Snappy curve is a deceleration with no overshoot. No bounce anywhere in the UI. |
| Reduced motion means gentler, not none | **Already true** | Transitions collapse, reveals render in place, the grain stops shimmering, scroll-to-top jumps. Color and opacity feedback stays. |
| Respond on pointer-down, not release | **For new work** | New controls show their pressed state on `:active` / `pointerdown`. Live components keep their hover-led feedback. |
| Use springs for anything the user can grab | **For new work** | Use `motion.spring.*` tokens (damping 1.0, response 0.3–0.4s). Bounce (damping 0.8) only after a flick. See [Gesture](gesture.md). |
| Hand release velocity to the animation; project momentum | **For new work** | See [Gesture](gesture.md). |
| Rubber-band at edges instead of hard stops | **For new work** | For any new bounded drag. (`/play` wraps infinitely, so it has no edges.) |
| Fixed-duration, CSS-only motion for hover and reveal | **Departure, kept** | Hovers and reveals aren't gestures, so the bezier canon (Snappy / Smooth / Springy) stays. Springs are for grab-able things only. |

## Gesture

| Rule | Label | Here |
| --- | --- | --- |
| 1:1 tracking with pointer capture, respecting the grab offset | **Already true** | `/play` captures the pointer and moves the world from its origin plus the pointer delta. |
| Movement threshold before committing to a drag | **Already true** | `/play` uses 18px before a press becomes a drag; below that, it's a tap that opens the item. |
| Decompose 2D motion into independent X and Y | **Already true** | `/play` tracks `vx` and `vy` separately with exponential decay. |
| Momentum continues after release | **Already true** | `/play` throws with friction 0.85 per frame (≈0.990/ms, Apple's "snappy" deceleration). |

## Typography

| Rule | Label | Here |
| --- | --- | --- |
| Tracking is size-specific: tighter as type grows | **Already true** | Display -1% (footer -2%), body 0 to +1%, mono 0. Keep new styles on this curve. |
| Leading is inverse to size | **Already true** | Display 100%, Heading 110%, Body L 120%, Body 140%. |
| Hierarchy from size, weight and leading together | **Already true** | Bold is reserved for the two display titles; everything else is Regular. |
| Default to the system font | **Departure** | GT Standard is the brand. Never substitute `system-ui` except as a fallback in the stack. |
| Scale with the user's text-size setting (`rem`) | **For new work** | New body-size text should survive 200% browser zoom without overlap. Display sizes stay in px, matching Framer. |

## Materials and depth

| Rule | Label | Here |
| --- | --- | --- |
| Translucent, blurred bars with content scrolling underneath | **Departure** | The brand is flat. The nav sits on the opaque page surface; no `backdrop-filter`. |
| Scroll-edge fades instead of 1px dividers | **Departure** | 1px near-black rules are core to the identity. Keep them. |
| Shadows that thicken with surface size | **Departure** | No shadows. Depth comes from surface (Cream vs Forest Green), scale and order. |
| Dim to focus for modal tasks | **Departure (adapted)** | The lightbox replaces the page with a white surface instead of dimming it; it is the only modal. |
| `prefers-reduced-transparency` | n/a | There is no translucency to reduce. |

## Feedback and wayfinding

| Rule | Label | Here |
| --- | --- | --- |
| Four feedback kinds: status, completion, warning, error | **For new work** | The site has no forms today. A new form validates inline, in mono labels, using `--mh-text-strong`. Don't add a red; ask first. |
| Where am I / where can I go / how do I get out | **Already true (partly)** | Persistent nav on every page; logo link home; lightbox closes with Esc. The nav has no visible current-page state; that's a live decision, not something to add. |
| Proximity implies relationship | **Already true** | Tags sit under their card; the view toggle shares a line with the list it controls. |
| Multimodal feedback (sound, haptics) | **Departure** | None. A portfolio isn't the place for it. |

## Accessibility notes

- Stroke Gray `#979797` on Cream measures about **2.7:1**. It's used for tags, muted meta and the gray continuation of case-study titles. That's below WCAG AA for small text, and below 3:1 even for large text. It's a known property of the live design. Don't use Stroke Gray for anything new that a visitor must read to understand the page; use `--mh-text-body` (Graphite, ~7.2:1) or stronger.
- Forest Green on Cream ≈ 12:1; near-black on Cream ≈ 17:1; Cream on Forest Green ≈ 12:1.

## Changing the live site

Nothing on this page asks for a change to micahhoang.com. If a future task wants to move a live behavior toward one of these principles (for example a press state on touch, a current-page nav marker, or darker muted text):

1. Write it up as a proposal: what changes, which Framer component or style (`codeFileId`), and the visual difference.
2. Get Micah's explicit approval.
3. Make the change in Framer behind a kill switch where possible, publish, then run published QA. `npm test` too if any Play-related file changes.
4. Update the relevant page here, and move the rule's label to **Already true**.

**Proposed live-site changes:** none currently open.
