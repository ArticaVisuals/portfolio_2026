---
title: Footer
section: Components
order: 8
description: A Forest Green block with oversized uppercase contact links and a mono base bar.
status: live
framer: Native "Footer" (FooterWhiteDesktop variants); FooterCopyrightYear (BF2H03E); TextEncryptionEffect (p7tSTaD); ResumeAssetHost (xDqfenf)
codeFileId: BF2H03E
classes: [mh-footer, mh-footer__contacts, mh-footer__contact, mh-footer__bar]
tokens: [type.display-footer, type.label, color.green.*, space.13]
---

# Footer

## Examples

```html example bleed surface=green
<footer class="mh-footer" data-surface="green">
  <p class="mh-label" data-leading="relaxed">Get in touch</p>
  <ul class="mh-footer__contacts">
    <li><a class="mh-footer__contact" href="#">micah.hoang<sup>@hey.com</sup></a></li>
    <li><a class="mh-footer__contact" href="#">LinkedIn<sup>Connect</sup></a></li>
    <li><a class="mh-footer__contact" href="#">Cosmos<sup>Inspire</sup></a></li>
  </ul>
  <div class="mh-footer__bar">
    <p class="mh-label">Available for work</p>
    <ul class="mh-link-list mh-label">
      <li><a class="mh-link" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>LinkedIn</span><span aria-hidden="true">LinkedIn</span></span></span></a></li>
      <li><a class="mh-link" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>Resume</span><span aria-hidden="true">Resume</span></span></span></a></li>
      <li><a class="mh-link" href="#"><span class="mh-flip"><span class="mh-flip__track"><span>Cosmos</span><span aria-hidden="true">Cosmos</span></span></span></a></li>
    </ul>
    <p class="mh-label">©2026</p>
  </div>
</footer>
```

## Anatomy

1. **Eyebrow**: "Get in touch", mono.
2. **Contacts**: three Display Footer links (80 / 64 / 40px, uppercase, -2%), each with a mono superscript saying what it is for: `@HEY.COM`, `CONNECT`, `INSPIRE`.
3. **Base bar**: availability, link list (LinkedIn, Resume, Cosmos), ©year, laid out across a 3-column grid.

## Usage

- The footer is the only large Forest Green block outside the boot loader. Always `data-surface="green"`.
- The email reads as `MICAH.HOANG` with `@HEY.COM` as its superscript, so the display line stays one word.
- Keep exactly three contact lines. Availability text reflects real status; change it when it changes.

## API

| Class | Element | Notes |
| --- | --- | --- |
| `mh-footer` | `footer` | Add `data-surface="green"`; 144px top padding |
| `mh-footer__contacts` | `ul` | Vertical list |
| `mh-footer__contact` | `a` | Display Footer type; `sup` child is the mono tag |
| `mh-footer__bar` | `div` | 3 columns; the link list moves to its own row on mobile |

## Accessibility

- The `sup` text is part of the link name ("micah.hoang @hey.com"). Make sure the `href` matches (`mailto:`).
- Cream on Forest Green is about 12:1 contrast, fine at every size.

## Framer mapping

- Native **Footer** component with desktop/tablet/phone variants (`FooterWhiteDesktop`, ...).
- The display links use `TextEncryptionEffect` (`p7tSTaD`) for the per-letter scramble on hover. Keep it on these three links only.
- Year: `FooterCopyrightYear` (`BF2H03E`).
- `ResumeAssetHost` (`xDqfenf`) is mounted invisibly inside the footer. It supplies the resume file and hosts the global helpers (`ParagraphPrettyWrap`, `NavigationScrollGuard`). **Never remove it from the footer.**

## Don't

- Don't add a sitemap, newsletter form or social icons.
- Don't put the footer on Cream.
