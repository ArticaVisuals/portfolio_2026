---
title: Text Link
section: Components
order: 2
description: Mono links with the flip-rail hover, inline underlined links for running text, and comma-joined link lists.
status: live
framer: Native Link + "Text Link Black" hover variants; Case Study Header Link (dHFQCIH)
codeFileId: dHFQCIH
classes: [mh-link, mh-flip, mh-flip__track, mh-link-list]
tokens: [type.label, motion.duration.base, motion.ease.snappy, motion.distance.flip-gap]
---

# Text Link

## Examples

### Flip link (nav, actions)

```html example
<div class="ds-demo-row">
  <a class="mh-link mh-label" href="#">
    <span class="mh-flip"><span class="mh-flip__track"><span>Work</span><span aria-hidden="true">Work</span></span></span>
  </a>
  <a class="mh-link mh-label" href="#">
    <span class="mh-flip"><span class="mh-flip__track"><span>Play</span><span aria-hidden="true">Play</span></span></span>
  </a>
  <a class="mh-link mh-label" href="#">
    <span class="mh-flip"><span class="mh-flip__track"><span>Index</span><span aria-hidden="true">Index</span></span></span>
  </a>
  <a class="mh-link mh-label" href="#">
    <span class="mh-flip"><span class="mh-flip__track"><span>About</span><span aria-hidden="true">About</span></span></span>
  </a>
</div>
```

### Link list

```html example
<ul class="mh-link-list mh-label">
  <li><a class="mh-link" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>LinkedIn</span><span aria-hidden="true">LinkedIn</span></span></span></a></li>
  <li><a class="mh-link" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>Resume</span><span aria-hidden="true">Resume</span></span></span></a></li>
  <li><a class="mh-link" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>Email</span><span aria-hidden="true">Email</span></span></span></a></li>
  <li><a class="mh-link" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>Cosmos</span><span aria-hidden="true">Cosmos</span></span></span></a></li>
</ul>
```

### Inline link

```html example
<p class="mh-text-body-lg mh-text-strong" style="margin:0;max-width:30em">I'm a brand designer with a systems mind. Read the <a class="mh-link" data-variant="inline" href="#">full story</a> or see the <a class="mh-link" data-variant="inline" href="#">index</a>.</p>
```

## Usage

| Variant | Use for |
| --- | --- |
| Flip link | Navigation, standalone actions ("View all", "Scroll to top"), social links |
| Link list | Social and document links in the hero and footer: "LinkedIn, Resume, Email, Cosmos" |
| Inline link | Links inside body copy |

- The flip copy must match the label exactly; the motion is the feedback, not a text change.
- Inline links inherit color, underline at 1px, and turn interactive green on hover.

## API

| Class / attribute | Effect |
| --- | --- |
| `mh-link` | Resets link color/underline, inherits text |
| `mh-link` + `data-variant="inline"` | 1px underline, 0.18em offset, green on hover |
| `mh-flip` › `mh-flip__track` › two `span`s | One-line window; slides up on hover/focus of the parent `a` or `button` |
| `--mh-flip-h` (custom property on `.mh-flip`) | Window height; default `1em`. Set to the line height for larger text, e.g. `1.2em` |
| `mh-link-list` | Comma-joined horizontal list (commas added by CSS) |

## Accessibility

- The duplicate span carries `aria-hidden="true"` so the label is read once.
- Hover and focus both trigger the flip; focus also shows a 1px outline at 3px offset.
- External links: add `target="_blank" rel="noopener"` and let the label say where it goes (e.g. "LinkedIn").

## Framer mapping

- Nav and footer links on the live site are native Framer components with a two-text "flip" variant (two stacked text layers in a clipped frame, hover variant offsets them by 18px, 420ms Snappy).
- The Home about-section link uses the "Text Link Black" layer; its flip is driven from `HomeSelectedWorkGrid` (`FecepLS`).
- `CaseStudyScrambleText` (`dHFQCIH`) is a plain hover-color link (the name is misleading; it does not scramble).
- `TextEncryptionEffect` (`p7tSTaD`) is the real scramble on Home social labels. Use it only where it's already used.

## Don't

- Don't underline mono links.
- Don't change the text on hover (no "View all →" turning into "Go").
- Don't add arrow icons from an icon set; if direction is needed, type the character (↗, ↑, →) in the label.
