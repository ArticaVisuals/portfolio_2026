# SEO repair verification — November 5, 2026

Published to https://micahhoang.com. Framer reports the final deployment as
optimized. The published Home source matches the local HomeSelectedWorkGrid
mirror; Framer returned no TypeScript diagnostics for the updated component.

Initial HTML (before JavaScript):

- Home contains six real selected-work anchors in the expected order: Gaia,
  AirPods Pro 3, Peak Energy, Motion Connect 2025, Simon & Schuster, and
  National Park Playing Cards. No placeholder card labels remain.
- Home contains complete `Selected work` and `About Micah` heading text.
- All 17 bespoke case studies contain the descriptive titles recorded in
  `heading-changes.json`, inside native heading elements.
- Home, About, Index, Play, and the 17 case studies expose only the current
  `VzE19p8yHmwAEjM4VvWhnIWoapM.pdf` résumé.
- Metadata checks on Home, About, Gaia, AirPods, and Simon & Schuster passed:
  HTTP 200, self-referencing canonical, descriptive title/description, Open
  Graph image and text, Twitter card/image/text, `max-image-preview:large`.

Browser checks cover desktop and mobile. The first pass found that three
native title layers used fit-content widths; Peak Energy, TYPLDN, and Optro
were changed to fill their parent so the longer titles wrap. Initial Home,
Gaia, AirPods, Simon & Schuster, and National Park checks had no horizontal
page overflow or broken loaded images. Browser console output includes the
existing Framer recoverable hydration warnings; no page errors were reported.
The final responsive matrix is recorded in `browser-final.txt`.
TYPLDN's follow-up exposed a fixed `1160px` header container as well as the
phone title override. The existing container now fills its parent with
`minWidth=0`, and the phone title fills the available width. The final focused
confirmation is recorded in `typldn-verified.txt` with phone, tablet, and
desktop screenshots.
Final result: 34/34 desktop/mobile page checks have no clipped title or
horizontal page overflow. TYPLDN also passes the focused 810px tablet check.

Outstanding: `/info` still returns HTTP 404. Settings → Hosting → Redirects
requires a plan upgrade. The requested permanent `/info` → `/about` redirect
could not be added on the current plan. No subscription or plan was changed.

Authoring tradeoff: Home's selected-work list is now the Framer instance's
editable `Projects` array rather than a runtime CMS query. Future CMS changes
must also be applied to that array to change Home. The full Index remains
CMS-driven. Static project content is stored in Framer props, not in TSX.
