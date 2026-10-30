---
title: Navigation
section: Components
order: 7
description: A four-zone desktop mono bar and a compact mobile name/MENU header with a full-screen navigation panel.
status: live
framer: Native Mobile Navigation (qajbM_0Ju); NavigationScrollGuard (Wnd19lx) for accessibility/scroll/Lenis
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
| Links | Work, Play, Index, About | Replaced by MENU; routes appear in the full-screen panel |

Desktop columns are fixed: name 258px, role 340px, location fills, links hug the right edge (measured identical at 1200 and 1280). Tablet uses fixed 123px / 145px columns. Links sit 31px apart. The nav gutter is 20px at every breakpoint.

## Usage

- Same bar, same copy, on every page. Only the links change state.
- Routes: Work → `/`, Play → `/play`, Index → `/index`, About → `/about`.
- The bar is 53px tall with 20px side gutters. Desktop hides on scroll down and returns on scroll up. Below 810px it stays fixed and visible.
- Grain starts below the nav, so the bar always stays crisp.
- The live site doesn't style the current link. Mark it with `aria-current="page"` for assistive tech only.

### Mobile menu

- The **Hybrid** and **Black** layout templates mount the native **Mobile Navigation** component (`qajbM_0Ju`) on Phone only. Desktop and tablet retain their existing header.
- Edit **Assets → Mobile Navigation → Closed / Open** for the layout, labels, links, and colors. The component owns its native Click interactions with an Instant transition.
- MENU and CLOSE each use one text node inside a 13px-high `Label Mask` with hidden overflow, inside a 60×44 hit area. There is no rollover duplicate and no runtime-generated replacement label.
- `NavigationScrollGuard` adds dialog semantics, keyboard controls, focus containment, background inertness, and viewport-height handling to the native component. It does not create or own the menu's visual content.
- The open panel uses Forest Green with Cream type, the existing responsive **Heading 2** text style (GT Standard, 42px on phone; `type.display-m`), 13px GT Standard Mono labels, and the existing 20px nav gutters.
- Route labels use title case: Work, Play, Index, About. Each retains the shared Heading 2 style; do not introduce a separate menu text style or uppercase the route copy. LinkedIn, Email, and GitHub sit at the bottom. CLOSE occupies the same 60×44 box as MENU; route rows fit their text line height plus 12px top and bottom padding (`--mh-space-4`). This gives 66px rows with 42px phone type and prevents larger canvas type from overlapping.
- The open variant contains keyboard focus, supports Enter/Space and Escape, locks background scrolling, and restores focus and scroll on close. It closes and cleans up when resizing to 810px or wider.
- Mobile header links use ordinary browser navigation without the desktop curtain interception. Selecting Work while already on Home closes the menu and returns to the top.
- Mobile Home name, descriptor, and Selected/work headings render in place. Their previous appear/replay effects visibly restarted after settling. Desktop motion is unchanged.

## API

| Class | Element | Notes |
| --- | --- | --- |
| `mh-nav` | `nav` | Sticky; grid `258px 340px 1fr auto` (tablet `123px 145px 1fr auto`), 53px tall |
| `mh-nav__name` | `a` | Flip link |
| `mh-nav__role`, `mh-nav__location` | `p` | Static labels, hidden on mobile |
| `mh-nav__links` | `ul` | Flip links, 31px gap |

## Accessibility

- `<nav aria-label="Primary">`, links in a list.
- Add a "Skip to content" link before the nav in real pages.
- Keep visible focus on every link (the flip triggers on focus too).

## Framer mapping

- The live bars are native layers in **Hybrid** and **Black** layout templates. Desktop links use the shared **Text Link** hover variants.
- Mobile Navigation asset: `qajbM_0Ju`; Closed `wAv2cBhhn`; Open `gdGCs2vyp`. The Phone instances are `tK8RS0JyeF6qyNICpc` (Hybrid) and `rzjQrYrtJwE5QaaCdz` (Black). Their desktop source instances remain hidden.
- [Open Mobile Navigation in Framer](https://framer.com/projects/Micah-Hoang-Portfolio--BvGjN2gCRDHG41LzAVYE-b78r3?node=qajbM_0Ju).
- Scroll behavior and global smooth scroll: `NavigationScrollGuard` (`Wnd19lx`), mounted through `ResumeAssetHost` (`xDqfenf`). It owns the single Lenis 1.3.26 instance (`lerp 0.12`, native touch) and is destroyed on `/play`.
- Exposed controls: `Smooth`, `Scroll feel`.

## Don't

- Don't add a logo, hamburger icon or CTA button to the bar.
- Don't add a new palette or decorative blur. The mobile panel uses the existing Forest Green/Cream surface pairing.
- Don't change the order of the four zones.
