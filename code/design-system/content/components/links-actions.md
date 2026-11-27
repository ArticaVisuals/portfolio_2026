---
title: Links & Actions
section: Components
order: 2
description: Every clickable piece of text. Mono links and actions with the flip rail, link lists, inline links, outlined pills and Scroll to top. There is no filled button.
status: live
framer: Native Text Link (dVTZgYLeH); Text Flip Up (TextEncryptionEffect, p7tSTaD); ScrollToTopButton (gh4ngZN)
codeFileId: p7tSTaD
classes: [mh-link, mh-flip, mh-flip__track, mh-link-list, mh-action, mh-scroll-top]
tokens: [type.label, motion.duration.base, motion.ease.snappy, motion.distance.flip-gap, component.link-list.gap, layout.touch-target]
---

# Links & Actions

## Examples

### Flip links: nav, social, actions

```html example
<div class="ds-demo-stack">
  <div class="ds-demo-row">
    <a class="mh-link mh-label" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>Work</span><span aria-hidden="true">Work</span></span></span></a>
    <a class="mh-link mh-label" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>Play</span><span aria-hidden="true">Play</span></span></span></a>
    <a class="mh-link mh-label" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>Index</span><span aria-hidden="true">Index</span></span></span></a>
    <a class="mh-link mh-label" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>About</span><span aria-hidden="true">About</span></span></span></a>
  </div>
  <ul class="mh-link-list mh-label">
    <li><a class="mh-link" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>LinkedIn</span><span aria-hidden="true">LinkedIn</span></span></span></a></li>
    <li><a class="mh-link" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>Resume</span><span aria-hidden="true">Resume</span></span></span></a></li>
    <li><a class="mh-link" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>Email</span><span aria-hidden="true">Email</span></span></span></a></li>
    <li><a class="mh-link" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>Cosmos</span><span aria-hidden="true">Cosmos</span></span></span></a></li>
  </ul>
  <div class="ds-demo-row">
    <a class="mh-action" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>View all</span><span aria-hidden="true">View all</span></span></span></a>
    <a class="mh-action" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>Read more</span><span aria-hidden="true">Read more</span></span></span></a>
    <button class="mh-action mh-scroll-top" type="button"><span class="mh-flip"><span class="mh-flip__track"><span>Scroll to top</span><span aria-hidden="true">Scroll to top</span></span></span></button>
  </div>
</div>
```

### Pill and inline link

```html example
<div class="ds-demo-stack">
  <div class="ds-demo-row">
    <a class="mh-action" data-variant="pill" href="#">Resume ↗</a>
    <button class="mh-action" data-variant="pill" type="button" disabled>Unavailable</button>
  </div>
  <p class="mh-text-body-lg mh-text-strong" style="margin:0;max-width:30em">I'm a brand designer with a systems mind. Read the <a class="mh-link" data-variant="inline" href="#">full story</a>.</p>
</div>
```

## Usage

| Kind | Use for |
| --- | --- |
| Flip link (`mh-link` + `mh-flip`) | Nav, social links (LinkedIn, Resume, Email, Cosmos, GitHub) |
| Link list (`mh-link-list`) | Comma-joined social links in the hero and footer bar, 10px apart |
| Text action (`mh-action`) | View all, Read more, Scroll to top, Clear filters |
| Pill (`mh-action data-variant="pill"`) | A standalone action that needs a visible boundary. At most one per view |
| Inline link (`data-variant="inline"`) | Links inside body copy: 1px underline, green on hover |

- **One flip everywhere:** 420ms Snappy, one line up, on hover and keyboard focus. The second line repeats the label; only project cards and Index rows say what the click does (VIEW PROJECT, View Project →). Don't invent other hover copy.
- **No filled button**, no shadows, no rounded rectangles. Direction is typed into the label (↗ external, ↑ top, → next), never an icon.
- **Scroll to top** sits on the left gutter 60px below the last content on long pages (Home, About) and glides to the top in 900ms; under reduced motion it jumps.
- **Mobile (below 810px):** nothing rolls. One label stays visible in its 13px mask and the link grows to a 44px touch target (15.5px above and below), centered on the label so surrounding spacing doesn't move.

## API

| Class / attribute | Effect |
| --- | --- |
| `mh-link` | Resets link color and underline; inherits text |
| `mh-flip` › `mh-flip__track` › two `span`s | One-line window that slides up on hover/focus of the parent `a`/`button`. `--mh-flip-h` sets the window (default `1em`) |
| `mh-link-list` | Horizontal list; commas added by CSS |
| `mh-action` | Mono label, uppercase, no chrome |
| `data-variant="pill"` | 1px currentColor outline, pill radius, 24px min height, green on hover |
| `data-variant="inline"` | On `mh-link`: 1px underline at 0.18em |
| `mh-scroll-top` | On an `mh-action`; `components.js` scrolls the document (or `data-target`) to the top |
| `disabled` / `aria-disabled="true"` | 40% opacity, no pointer events |

## Accessibility

- The second span is `aria-hidden="true"`, so the label is read once.
- Focus shows the flip plus a 1px outline at 3px offset.
- Use `<a>` to navigate and `<button type="button">` for in-page actions; icon-only controls (lightbox ← → ×) need `aria-label`.

## Framer mapping

- **Native Text Link** (`dVTZgYLeH`): nav, View all and Read more. Its Link variable sits on the outer frame only (no nested links).
- **Text Flip Up** (`TextEncryptionEffect.tsx`, `p7tSTaD`): the hero and footer-bar social labels. It replaced the old letter scramble with a line-height-aware flip.
- **ScrollToTopButton** (`gh4ngZN`): label `scroll to top`, 900ms scroll, hands off to the global Lenis instance.
- The shared timing comes from `ResumeAssetHost` (`xDqfenf`): `--mh-flip-duration: 420ms` and `--mh-flip-ease`, with `0ms` under reduced motion. Code components read the same variable.
- `CaseStudyScrambleText` (`dHFQCIH`) is a plain hover-color link despite its name.
