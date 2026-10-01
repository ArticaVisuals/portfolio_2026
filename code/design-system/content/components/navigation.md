---
title: Navigation
section: Components
order: 7
description: The four-zone mono bar on every page (name, role, location, links) that hides on scroll and stays clear of the grain.
status: live
framer: Native "Navigation" component; NavigationScrollGuard (Wnd19lx) for scroll/Lenis
codeFileId: Wnd19lx
classes: [mh-nav, mh-nav__name, mh-nav__role, mh-nav__location, mh-nav__links]
tokens: [type.label, layout.gutter, layout.nav-height, z.nav]
---

# Navigation

## Examples

```html example bleed
<nav class="mh-nav" aria-label="Primary" style="position:relative">
  <a class="mh-nav__name mh-link mh-label" href="#">
    <span class="mh-flip"><span class="mh-flip__track"><span>Micah Hoang</span><span aria-hidden="true">Micah Hoang</span></span></span>
  </a>
  <p class="mh-nav__role mh-label">Brand designer</p>
  <p class="mh-nav__location mh-label">Los Angeles, California</p>
  <ul class="mh-nav__links mh-label">
    <li><a class="mh-link" href="#" aria-current="page"><span class="mh-flip"><span class="mh-flip__track"><span>Work</span><span aria-hidden="true">Work</span></span></span></a></li>
    <li><a class="mh-link" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>Play</span><span aria-hidden="true">Play</span></span></span></a></li>
    <li><a class="mh-link" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>Index</span><span aria-hidden="true">Index</span></span></span></a></li>
    <li><a class="mh-link" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>About</span><span aria-hidden="true">About</span></span></span></a></li>
  </ul>
</nav>
```

## Anatomy

| Zone | Content | Below 810px |
| --- | --- | --- |
| Name | "Micah Hoang", links to `/` | Kept |
| Role | "Brand designer" | Hidden |
| Location | "Los Angeles, California" | Hidden |
| Links | Work, Play, Index, About | Kept, 24px gap |

## Usage

- Same bar, same copy, on every page. Only the links change state.
- Routes: Work → `/`, Play → `/play`, Index → `/index`, About → `/about`.
- The bar sits on the page surface, 20px from the top and sides, 53px tall. It hides on scroll down and returns on scroll up.
- Grain starts below the nav, so the bar always stays crisp.
- The live site doesn't style the current link. Mark it with `aria-current="page"` for assistive tech only.

## API

| Class | Element | Notes |
| --- | --- | --- |
| `mh-nav` | `nav` | Sticky, 4-column grid `1fr 1.3fr 1.6fr auto` |
| `mh-nav__name` | `a` | Flip link |
| `mh-nav__role`, `mh-nav__location` | `p` | Static labels, hidden on mobile |
| `mh-nav__links` | `ul` | Flip links, 30px gap |

## Accessibility

- `<nav aria-label="Primary">`, links in a list.
- Add a "Skip to content" link before the nav in real pages.
- Keep visible focus on every link (the flip triggers on focus too).

## Framer mapping

- The live bar is the native **Navigation** component, with the flip implemented as hover variants.
- Scroll behavior and global smooth scroll: `NavigationScrollGuard` (`Wnd19lx`), mounted through `ResumeAssetHost` (`xDqfenf`). It owns the single Lenis 1.3.26 instance (`lerp 0.12`, native touch) and is destroyed on `/play`.
- Exposed controls: `Smooth`, `Scroll feel`.

## Don't

- Don't add a logo, hamburger icon or CTA button to the bar.
- Don't put a background color or blur behind it.
- Don't change the order of the four zones.
