---
title: Changelog
section: Reference
order: 1
description: How the live site and this design system have changed, newest first. Every other page describes the current state only.
---

# Changelog

Dates are when the change was published on micahhoang.com. Each entry names where the detail lives in the repo.

## 2026-11-27: design system consolidation

- Pages merged, 34 → 27 (plus this changelog): Principles absorbs Interaction Principles; Motion absorbs Gesture; Texture absorbs Grain Overlay; **Links & Actions** replaces Text Link, Action and Scroll to Top; Project Card absorbs Project Grid; **Index Controls** replaces Filter Group and View Toggle.
- Tokens: per-component values moved from `layout` into a `component` group. Renamed: `heading-word-gap` → `section-header-word-gap`, `section-rule-after` → `section-header-rule-after`, `card-grid-to-action` → `project-grid-to-action`, `cta-row-gap` / `cta-suffix-gap` → `footer-row-gap` / `footer-suffix-gap`, `pill-scroll-clearance` → `tag-scroll-clearance`, `nav-gutter` → `gutter`. Removed (unused or retired): `about-image-width`, `about-copy-width`, `space-13`, `duration-slow`, `type.label-sm`, `bg-inverse`.
- History moved here; pages are present tense.
- Found on the live site while syncing: footer "Get in touch" now keeps its 130% leading on tablet and phone (it used to drop to 100%), so the contact rows sit 4px lower there.

## 2026-11-23: one flip timing, social flip-ups, responsive case-study media

- Every text flip (nav, links, project titles, Index rows, Scroll to top, Play labels) runs 420ms Snappy through one variable, `--mh-flip-duration`, set in `ResumeAssetHost` and `0ms` under reduced motion. Index rows were 620ms.
- Hero and footer-bar social labels flip up one line instead of scrambling (`TextEncryptionEffect.tsx`, `p7tSTaD`, now "Text Flip Up").
- Case-study images serve responsive sizes; offscreen Simon & Schuster spreads load late (`code/mirror/case-media-2026-11-23.json`).

## 2026-11-11: Home simplification, monogram, Index refinements

- Home: the Selected work title was removed (Framer node `XzikUe04m` hidden; rollback in `code/mirror/backups/home-layout-2026-11-11/`). The rule now sits 45px above the grid (35px phone).
- Home hero name moved into normal flow with a phone-fluid size, `min(58px, (100vw − 40px) / 6.2)`, so it can't overflow narrow screens. Before, it was absolutely positioned 10px up and 6px left.
- The boot loader shows the ©MH monogram (Figma `168:541`) at 237.5 / 190px, replacing the full wordmark.
- Index: the project count cross-fades changed digits in fixed slots; mobile filter panels grow from their trigger (250ms in, 150ms out).
- Nav rollover labels both use 100% leading, so the replacement lands exactly on the resting label.

## 2026-10-30: mobile pass

- Mobile gutter unified to 20px on every route (was 15px, 14px on Index).
- 44px minimum touch targets for every mobile link, pill, filter, toggle, menu button and footer row.
- Phone reading text 18px / 140% (Body L was 15px / 130%, Body M 14px); Heading 3 is 28px on tablet and 24px on phone.
- Every mono label is 13px; the 12px tablet/mobile tag size is gone. Mobile pills are 44px tall with 24px side padding, in a single row that scrolls edge to edge.
- Stroke Gray lightened from `#707070` to `#848484` (3.43:1), the midpoint between the darker contrast fix and the original `#979797`.
- Native mobile navigation: name + MENU, full-screen Forest Green panel.
- Index: Year / Service / Industry disclosure buttons on mobile; rows carry their own year.
- Footer: GitHub added as a fourth contact; phone contact labels are fluid (28–38px).
- Case-study headings on mobile reveal line by line; a head stylesheet renders them in place under reduced motion.
- Detail: the dated notes in `docs/` (e.g. `mobile-type-gutters-footer-2026-10-30.md`).

## 2026-10-23: vector loader identity, Play drawer

- The boot loader showed an outlined © Micah Hoang wordmark (Figma `91:521`) instead of text. The monogram replaced it on 2026-11-11.
- `/play` drawer: 500ms open / 400ms close on the Smooth curve; Safari idle-drift fix.

## 2026-10-01: first version

- Design system created from the published site and the Framer project: tokens, docs site, agent files and the QA fixture.
