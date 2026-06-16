# Portfolio Redesign — Strategic Framework & Information Architecture

**For:** Micah Hoang
**Version:** 1.11 - June 15 CMS/page parity reflected. CMS has 17 real projects and each CMS slug has a matching bespoke `/case-studies/{slug}` page. Home renders a six-item selected-work grid through `HomeSelectedWorkGrid.tsx`; the current CMS-limited set is Gaia, AirPods Pro 3, Peak Energy, Simon & Schuster, Motion Connect 2025, and National Park Playing Cards. `/play` uses the `Play.tsx` production wrapper around `ArchivePlayground.tsx` with protected authorable `Archive Items` controls. Current Framer web routes are documented in `framer-current-state.md`.
**Date:** May 2026
**Last Framer structure audit:** June 15, 2026. Published/staging URL `https://khaki-ship-257706.framer.app`. `https://micahhoang.info` has historically served the Cargo site during recent audits, so treat the Framer URL as the current build surface until domain cutover. Current-state companion: `framer-current-state.md`.

**Maintenance note, May 26, 2026:** The current Framer project no longer includes `/play-2`, `/playground-scroll-draft`, `/worldgrid-test`, `WorldGridTest.tsx`, `ImageMaskReveal.tsx`, `IndexRuleColorOverride.tsx`, `IndexListCursorPreview.tsx`, `IndexFilterNavDraftPage.tsx`, or `CaseStudyRevealTuner.tsx`. Those names may appear in older historical notes, but they are not active current inventory.

**Play authoring lock, June 11, 2026; route note updated June 15:** `/play` media is a Framer-authorable content surface, not hardcoded decoration. The production wrapper `Play.tsx` (`PN1RVOf`) must expose `Archive Items` / `archiveItems` with media upload, reorder, title, description, category, aspect, and stroke controls, then pass those managed items into `ArchivePlayground.tsx` (`QNpkYp5`). Default `RAW_ITEMS` are fallback/seed data only; do not remove the authorable array or replace it with static media. The earlier `/play-consolidation-draft` route is no longer in the current Framer page inventory; create a fresh draft/design page for future interaction refactors before promoting to production.

**Cleanup note, June 10, 2026:** The former public editorbar guard was removed from Framer and the local mirror after it was no longer needed. Do not remount that guard as current inventory.

---

## 01 — Positioning

### The one-line statement

**Micah Hoang — Brand designer making considered systems for the world's most ambitious companies.**

This is the read a hiring manager should walk away with after ten seconds. Not "brand + UI + motion designer." Brand designer, full stop. The technical range is revealed through the work, not declared in the headline.

### The full positioning argument

Micah is a brand designer whose work spans from global product launches at Apple to a self-produced card deck sold through REI and National Park retail, with digital products and motion systems in between. That range is unusual, and it is the argument. It signals a designer who thinks in systems — identities that live across print, product, interface, and motion — rather than a specialist trapped in one medium.

The site's job is to make this read effortless. The work itself is strong enough; the portfolio's only job is to present it in a way that doesn't dilute or over-explain.

### Why this positioning wins across all three targets

| Target | What they need to see | How the positioning serves them |
|---|---|---|
| **Apple Identity, Anthropic, Google** | High craft, systemic thinking, clear point of view | "Brand designer" is the right category; the AirPods work, Simon & Schuster, and Karuna prove the craft bar; Yomo and Gaia quietly show the technical range they care about |
| **High-craft, high-speed startups** | Range, velocity, AI fluency, shipping ability | Gaia + National Park Playing Cards + AI side projects demonstrate the ship-things-in-the-world sensibility; the site itself being AI-native built is a second proof |
| **Studios (Mouthwash, Koto, Some Days, New Co.)** | Clear categorical fit, craft, taste | "Brand designer" is the hire box they staff for; Simon & Schuster, Karuna, Weaponized Innocence prove the editorial/craft sensibility |

The portfolio prioritizes Target 1 in the curation order, because work that lands Target 1 also satisfies 2 and 3. The reverse isn't true.

---

## 02 — Guiding Principles

Five words to return to whenever a design decision feels unclear:

**Considered. Quiet. Alive. Specific. Shipped.**

- **Considered** — every element earning its place. No features because they're cool.
- **Quiet** — the work is loud enough. The site doesn't need to be.
- **Alive** — small, intentional moments of motion and response. Not decoration.
- **Specific** — "I did X" rather than "we did Y." Credit is precise.
- **Shipped** — work that exists in the world is weighted over work that lives in Figma.

### What this portfolio is **not**

- Not an archive. (That's what the Index page is for.)
- Not a UX case-study deep-dive site. (Those live inside individual projects.)
- Not a showcase of interaction patterns. (The site is restrained; the delight is curated.)
- Not multi-disciplinary positioning. (One category, range revealed through work.)

---

## 03 — Content Strategy

### Homepage curation (current Framer Home: 6 visible cards)

The order is a deliberate argument. Each visible Home card earns its slot and reinforces the one before it. Current Framer Home uses `HomeSelectedWorkGrid.tsx` to render a CMS-backed selected-work set: `Is Homepage = true`, ordered by `Sorting Number`, limited to 6 records, with direct `/case-studies/{slug}` links and image/video thumbnail handling.

| # | Project | Strategic job | Primary targets |
|---|---|---|---|
| 1 | **Gaia** | Full-scope rebrand + product redesign, AI-native build. Signals where design is going. | 1, 2 |
| 2 | **AirPods Pro 3** | Highest credential. Reframes everything below. | 1, 2 |
| 3 | **Peak Energy** | Newly added homepage project. WIP-gated bespoke shell exists with NDA-safe Peak Energy x GM handoff details; final public story still needs clearance. | TBD |
| 4 | **Simon & Schuster** | Concept rebrand grounded in real strategic context. Proves brand craft and systemic thinking. Fonts in Use. | 1, 3 |
| 5 | **Motion Connect 2025** | Event identity and motion system. Adds current ArtCenter/community signal and kinetic range. | 2, 3 |
| 6 | **National Park Playing Cards** | Entrepreneurial, shipped, human. 20K copies, REI/National Park retail. Store-count copy needs final confirmation. | 2, 3 |

**Home query nuance:** WhatsApp has `Is Homepage` set to `true`, but it is not visible in the first six Home cards because the query stops at the first six homepage-flagged records by sort order. Yomo, Karuna, and Weaponized Innocence are currently off Home because their `Is Homepage` flags are `false`. To change Home curation, update both the CMS flag and sort order, then verify the six-item query.

**Explicitly off the current Home grid:** Yomo, Karuna, Weaponized Innocence, Wolff Olins x ArtCenter, Cellular Symphony, Seek Truth, Independent Lens, TYPLDN, Rejuve, Belly Bar, and WhatsApp. Neon Lights, Aspen Valley Landscaping, and John Steinbeck are no longer in CMS; Neon/Aspen's old bespoke Framer routes were deleted during the June 15 parity pass. Current Home visibility is governed by the CMS/query state above.

**Deleted from CMS:** all Jacob Turner sample/template records, including Vern Carter, Iris Wade, Orion Ventures, Echoes, Iconic, Adapting Literature, Genre Evolution, Digital Disruption, Connections, Capturing the Essence, Beyond the Frame, and Harmony in Motion.

### Case study depth — three tiers

Not every homepage project needs the same depth. A uniform depth requirement is why most portfolios die on the vine.

- **Tier 1 — Full case study pages** (3 projects): AirPods Pro 3, Simon & Schuster, Gaia.
  These earn the hire. Editorial scroll, process, decisions, specific contribution, outcome. 1500–2500 words per page, heavily image-led.

- **Tier 2 — Visual showcase + context** (5 projects): National Park Playing Cards, Motion Connect 2025, Yomo, Karuna, Weaponized Innocence.
  One rich page, minimal copy, lots of imagery, a clear frame of the problem and outcome. The work carries the weight. Weaponized Innocence remains Tier 2 due to Fonts in Use recognition and editorial depth that serves Target 3 (studios).

- **Archive/editorial records needing a final depth decision**: Seek Truth, Independent Lens, TYPLDN, Rejuve, Belly Bar, and WhatsApp.
  These now exist in CMS and/or bespoke Framer pages. Decide whether they remain archive entries or become dedicated visual showcase pages before adding them to the primary case-study build order.

### Locked case study openings

**AirPods Pro 3** — *Approved*

> Global launch identity for AirPods Pro 3 across keynote, Apple Retail, web, and digital — developed with Apple Marcom.
>
> My hero product-angle lockup was selected as the feature image placed across global Apple retail stores. I was also a primary collaborator on the APP3 liquid-glass logo animation, the partner asset guidelines handed off to Best Buy, Amazon, and other retailers, and the "bud tip size reveal" feature animation. I additionally contributed to lighting art direction across product motion, product control angle development, and the buds + case hero lockup.

*Note: The photo of Micah in the Apple Store next to his hero lockup should sit immediately alongside this paragraph. The image carries the emotional weight — the copy stays factual.*

**Simon & Schuster** — *Revised (concept, not client engagement)*

> A strategic rebrand concept for Simon & Schuster, grounded in the real business context of the DOJ's intervention to block Penguin Random House's acquisition.
>
> With its independence reaffirmed, I saw an opportunity to reimagine what the company's brand could signal: an identity built around editorial openness, diverse voices, and a publishing culture that treats controversy as an invitation rather than a risk. I developed a full brand strategy, visual identity system, and experience design across digital and physical touchpoints. The typographic system was recognized by Fonts in Use.

*Note: "Concept" in metadata line. "Rebrand concept" in opening sentence. "I saw an opportunity to reimagine" rather than implying the company commissioned the work.*

**Gaia** — *Approved*

> A self-initiated reimagining of **iNaturalist** — the world's largest citizen science platform, with 290 million observations and 4 million users — renamed **Gaia** and redesigned to invite more people into biodiversity conservation.
>
> The brief I set myself: iNaturalist is powerful but not welcoming. The name alone excludes anyone who doesn't self-identify as a naturalist. A million species face extinction this century, and the best tool for seeing biodiversity at scale is also the most intimidating to enter.
>
> I delivered a full brand and product system: strategic renaming and positioning (*Gaia* — the Greek personification of Earth, a name that treats every species as part of one story), a complete visual identity (logo, brand mark, typographic system across New Spirit, Neue Haas Unica, and Basier Circle Mono, color tokens across nine 50–900 scales, iconography, species badges, data and content cards), and a reimagined product experience mapped to three strategic goals — increase access, motivation, and meaning. The final iOS app was vibe-coded in XCode via Claude, Claude Code, and Codex, built to Apple accessibility guidelines.

*Note: Academic origin goes in metadata ("2026 · Self-initiated · ArtCenter CD5"), not in the opening paragraph. "Self-initiated reimagining" handles the school context without apology.*

### Current Framer CMS state

As of the June 15 audit, the `All Projects` CMS collection contains 17 real projects and zero sample/template projects.

- **Hybrid case-study workflow:** use `All Projects` as the registry for metadata, browsing, sorting, filters, thumbnails, and homepage/index visibility. Use bespoke Framer pages for individual case-study storytelling when a project needs custom layout, pacing, or media. See `case-study-cms-workflow.md`.
- **CMS collection:** `All Projects`, collection ID `yTHrQWMIY`
- **Secondary CMS collection still present:** `Journal`, collection ID `SyZTxPxeY`. No visible Journal page exists in the current project structure; ignore it unless Micah explicitly asks to revive journal content.
- **Visible on CMS-backed Home:** Gaia, AirPods Pro 3, Peak Energy, Simon & Schuster, Motion Connect 2025, National Park Playing Cards
- **Homepage-flagged but not visible because of the six-item query limit:** WhatsApp
- **Strategic Tier 2 but currently off Home:** Yomo, Karuna, Weaponized Innocence
- **Archive/off-Home:** Wolff Olins x ArtCenter, Cellular Symphony, Seek Truth, Independent Lens, TYPLDN, Rejuve, Belly Bar
- **Removed from CMS and deleted from Framer bespoke routes:** Neon Lights, Aspen Valley Landscaping
- **Live `/case-studies` route:** page ID `Rnw1WO1jS`, a case-study index rendered with the native Framer `Case Studies Filter` component. The `NumberCounter` prop should be updated to `17` before publishing the current CMS roster.
- **Full roster and field map:** see `framer-current-state.md`.

Important field IDs for future CMS agents:

- `oeXZcmPna` Title
- `DLBifmgp1` Sorting Number
- `kuvJcmOFr` Category 1
- `VV1CggU2J` Category 2
- `E6OpH0hSs` Category 3
- `Jy7hBJady` Thumbnail
- `WG62tRjG8` Thumbnail Video Link, retired text field
- `SvOqFqdby` Thumbnail Video
- `OHdUYs6Mo` Thumbnail Stroke
- `QZqSK_3OF` Year. MCP reports this CMS field as a string field even though `IndexPage.tsx` currently types the bound prop as a number; preserve the field ID and coerce carefully if touching data plumbing.
- `fsFlSPDTa` Image 2
- `mBIilFqVM` Industry
- `myUIfK0j7` Is Homepage

Framer MCP did not report the older client, credits, videos, next-project, or body-content fields in the June 15 schema. Use `framer-current-state.md` for the full field map before editing CMS data.

Recommended manual fields for the hybrid workflow: add `Case Study URL` as a Link field and optionally `Build Status` as an enum in Framer. The collection is user-managed, so future agents cannot add these fields through MCP. Do not repurpose existing field IDs to make room for them.

Index taxonomy/list rule: the current `/index` taxonomy order is `/ Year`, `/ Service`, `/ Industry`, not the older Discipline/Industry/Year sequence. Taxonomy and the List year-group wrapper share a six-column grid inside the 20px page margin, with flexible column widths. Taxonomy alignment: Year label/values columns 1/2, Service label/values columns 3/4, Industry label/values columns 5/6. Each taxonomy group has an `All` action that clears only that category. The List year-group puts the Year label in column 1 and the row content in `2 / span 5`; inside that content area, list rows use a five-column grid (title cols 1/span 2, service cols 3/span 2, industry col 5/span 1). Industry must stay visible at every breakpoint; Service/Industry cells shrink and truncate with ellipses on desktop and reflow responsively. Intra-year project dividers and year rules currently render in near-black `#141414` through `IndexPage.tsx` color controls. The `/index` component has a Framer `List Type` A/B control: `Standard` preserves the large-year/22px-title hierarchy, while `Mono 13` makes year, title, service, and industry all 13px uppercase mono for a Searchsystem-style comparison. It also has a `List Hover` A/B control: `Flip` is the default and mirrors Framer `ViewProject` reference `node=L21w7Xq1z` with a clipped upward title-only text flip; `Highlight` preserves the older full-row hover background for comparison.

Year / Service / Industry nav values are no longer hardcoded lists — the live `IndexPage.tsx` derives and alphabetizes Service/Industry from whatever projects are in scope, while years sort descending. The earlier "eight canonical Discipline labels" lock and the `DISCIPLINE_ALIASES` normalization map are not present in the current code; if you want them back, you must reintroduce that filter explicitly. The May 22 published `/index` visibly renders simplified industry labels (`Education`, `Health`, `Human Rights`, `Literature`, `Music`, `Nature`, `Science`, `Technology`), not the longer CMS strings. Verify the intended label source before changing CMS fields or copy docs.

The Archive/Index page houses work that strengthens the picture without crowding the main narrative. Current `/index` interaction is intentionally simple: taxonomy filters plus List/Grid browsing. The **WorldGrid 3D gallery interaction** should stay out of `/index` unless Micah explicitly asks to bring it back; it is no longer part of the current Framer code-component inventory.

Current implementation note (June 11, 2026; motion updated June 14): Framer code file `rgAZFOv` owns the `/index` archive component. Keep responsive/index styling, inline-toggle alignment, rule/line timing, masked slide-in reveals for large list/grid year/title text, mono fade-in reveals for taxonomy/nav/meta text, full-list page-level reveal timing, `GridMediaFrame` thumbnail fades, and direct `.idx-grid-card-media > img/video` hover/focus scale in `IndexPage.tsx` rather than hidden companion helpers. The removed `IndexThumbnailVideoFallback.tsx` hardcoded per-project media and should not be recreated. Thumbnail media policy is: `Thumbnail Video` wins over `Thumbnail`; `Thumbnail` acts as poster/fallback. With `useCMS=true`, `IndexPage.tsx` reads the live `ProjectRegistrar` registry first, then falls back to Framer's generated `All Projects` CMS module, then manual `projects`; it intentionally does not use `DEFAULT_PROJECTS` in CMS mode. Before rendering, registry rows are hydrated from the generated CMS module by slug/title for thumbnail, thumbnail video, and thumbnail stroke so an incomplete bridge row cannot erase richer CMS media/stroke data. The older `Thumbnail Video Link` text field (`WG62tRjG8`) is retired; do not wire new thumbnail-video behavior to it. Publish/redeploy Framer after editing File-field thumbnail videos so the generated CMS module refreshes. `IndexPage.tsx` keeps direct `.idx-grid-card-media > img/video` children on the same hover/focus `scale(1.02)` path and resets them under reduced motion.

Current `/index` XML shows the footer using `AVAILABLE FOR WORK`, LinkedIn, Résumé linking to `/info`, Cosmos, and `©2026`. Continue checking shared footer instances before launch, but the older placeholder destination warning is no longer current.

---

## 04 — Information Architecture

### Top-level site map

```
micahhoang.info
│
├── / (Home)
│   ├── Hero — current Framer desktop is a 60vh cream hero with large name, discipline statement, bottom status/social/copyright row
│   ├── Work — 6 visible curated projects, mixed grid image/video cards with visual hierarchy
│   │   ├── Current CMS-limited set: Gaia, AirPods Pro 3, Peak Energy
│   │   ├── Simon & Schuster, Motion Connect 2025, National Park Playing Cards
│   │   └── All cards link to /case-studies/[slug] through HomeSelectedWorkGrid.tsx
│   ├── About — portrait + two-column bio copy with "read more" link to /info
│   └── Contact CTA — full-viewport forest-green section with email, LinkedIn, Cosmos
│
├── /case-studies
│   └── Native Framer case-study index: Case Studies Filter component + prop-driven count that needs `17` for the current CMS roster
│
├── /case-studies/[slug]
│   ├── /case-studies/airpods               [Tier 1 — full case study]
│   ├── /case-studies/simon-schuster        [Tier 1 — full case study]
│   ├── /case-studies/gaia                  [Tier 1 — full case study]
│   ├── /case-studies/peak-energy           [WIP-gated bespoke shell — pending public copy/depth decision]
│   ├── /case-studies/national-park-cards   [Tier 2 — visual showcase]
│   ├── /case-studies/motion-connect-2025   [Tier 2 — visual showcase]
│   ├── /case-studies/yomo                  [Tier 2 — visual showcase]
│   ├── /case-studies/karuna                [Tier 2 — visual showcase]
│   ├── /case-studies/weaponized-innocence  [Tier 2 — visual showcase]
│   ├── /case-studies/seek-truth            [Archive/editorial pending depth decision]
│   ├── /case-studies/independent-lens      [Archive/editorial pending depth decision]
│   ├── /case-studies/typldn                [Archive/editorial pending depth decision]
│   ├── /case-studies/rejuve                [WIP-gated bespoke shell — pending public copy/depth decision]
│   ├── /case-studies/belly-bar             [WIP-gated bespoke shell — pending public copy/depth decision]
│   ├── /case-studies/whatsapp              [WIP-gated bespoke shell — pending public copy/depth decision]
│   ├── /case-studies/cellular-symphony     [Archive]
│   └── /case-studies/wolff-olins-x-artcenter [Archive]
│
├── /index (Archive) — canonical page (`u2LOaBT5q`)
│   ├── Header: "INDEX" title (in a SectionHero above the code component) + original-template inline `GRID / LIST` view toggle
│   ├── Temporary side-by-side comparison route `/index-inline-toggle-test` was removed after the inline-toggle version was promoted
│   ├── List Type / List Hover / Default View / Use CMS exposed as Framer property controls on the IndexPage instance
│   ├── List view (default): year-grouped all-project archive with taxonomy filters
│   │   ├── Taxonomy source: Figma node 32:7531
│   │   ├── Taxonomy groups stay horizontal at desktop/tablet: Year, Service, Industry
│   │   ├── Year/Service/Industry nav items derived dynamically from in-scope projects
│   │   ├── Each group includes `All` as a per-category clear action
│   │   ├── Each row: title, service tags, industry
│   │   ├── Near-black `#141414` year dividers and row rules
│   │   └── Project count updates with filters (singular/plural)
│   ├── Grid view: project-driven native HTML cards rendered inside `IndexPage.tsx`
│   │   ├── Uses the same filteredProjects array as List view (no native Case Studies Filter fallback)
│   │   ├── Uniform 3/2/1 column responsive grid
│   │   ├── 16:9 thumbnails with subtle hover scale
│   │   ├── Title and two-line metadata below the image
│   │   ├── 56px row gap on desktop, 40px on mobile
│   │   ├── One-column stacked cards on mobile
│   │   └── Fills the index content width with the same 20px side margin as nav
│   ├── 3D preview
│   │   └── Not exposed on `/index`; keep List/Grid only unless Micah asks to bring it back
│   ├── WorldGrid
│   │   └── Not present in current Framer inventory; keep 3D/gallery experiments out of `/index` unless explicitly revived
│   ├── Project source priority in CMS mode: mounted ProjectRegistrar registry > direct CMS module scan > projects prop > empty state; DEFAULT_PROJECTS only when Use CMS is off
│   └── Click through to case study pages at `/case-studies/{slug}`
│
├── /info
    ├── Current Framer desktop is a forest-green editorial profile page
    ├── 64vh heading: "HEY, / I'M MICAH. / Brand designer with a systems mind."
    ├── Sticky video, intro copy, selected experience, testimonials, recognition rows
    └── CTA links to email/contact actions, Project Index, AirPods Pro 3, and Gaia
```

### Navigation model

Three primary nav items currently appear in the Framer Navigation component.

**Work · Index · Info**

- **Work** → scrolls to the Work section on home (if on home) or navigates home and scrolls
- **Index** → the archive / taxonomy browsing page
- **Info** → `/info`, the editorial profile/background page
- **Contact** → handled through CTA/footer email, LinkedIn, and Cosmos links; `/contact` is not in the current Framer page inventory

No hamburger on mobile unless absolutely necessary. The current three-item nav fits.

### The homepage as a single considered document

The homepage is a one-page scroll with five zones:

1. **Nav bar** — "Micah Hoang" left, "Work · Index · Info" right. Contact exists through CTA/footer links, but is not currently in the primary nav component or page inventory.
2. **Hero zone** — current Framer desktop uses a 60vh cream hero with display-scale "MICAH HOANG", the discipline statement, `AVAILABLE FOR WORK`, LinkedIn/Résumé/Cosmos links, scroll prompt, and copyright. The June 2 publish confirmed the hero line now uses the approved spacing: `mind. Strategy`. The earlier green-dot/live-time idea is not currently implemented.
3. **Work zone** — current Framer implementation uses `HomeSelectedWorkGrid.tsx` for the six-item selected-work section. It preserves the intended card visuals while using direct `/case-studies/[slug]` anchors, image/video thumbnail handling, and a CMS/default data fallback. The `VIEW ALL` CTA links to `/index`. Do not reintroduce the broken native Home `AllProjects` / `CaseStudy` grid or a hydration `LinkRepair` as the primary Home mechanism.
4. **About zone** — current Framer Home uses a portrait plus two columns of bio copy and a `read more` link to `/info`. Preserve the June 16 Framer layer contract: the `Button Wrapper` owns the `/info` link, while the visible `READ MORE` flip text is detached native `TextLinkBlack` content, not a linked `Text Link` component. This avoids Framer nested-link optimizer warnings while keeping the portrait/text hover flip interaction.
5. **Contact zone** — current Framer Home ends in a full-viewport forest-green CTA with email, LinkedIn, and Cosmos links.

The Home route gives the full story in one scroll. `/info` exists for people who specifically want to go deeper on background. Contact is handled through direct CTA and footer links rather than a current standalone route.

### Why keep the Index page separate

Because it serves a different user:

- **Homepage user** = someone evaluating Micah as a hire. They need curation and confidence.
- **Index user** = someone who already likes the work and wants to go deeper, or a fellow designer who wants to see the full body. They reward exploration.

Giving them separate homes means neither gets diluted. The Index is also where you can be a little more playful through archive density and browsing behavior without undermining the restraint of the homepage. Keep the WorldGrid 3D interaction unrouted until it is intentionally promoted.

### What gets eliminated from the current site

Latest MCP audit could inspect the live Framer project. The cleanup rule still applies: any page or feature that doesn't fit the core route map above gets collapsed, merged, or archived. Specifically worth auditing before launch:

- Any dedicated landing/splash page → merge into home header
- Standalone About page → merge into home About zone + `/info` for depth
- Any filter or search UI on the main work view → removed
- Social-style feeds or blog indexes (Journal CMS still exists, but no visible Journal page currently exists) → Archive or `/info`
- Any navigation nested deeper than two levels → flatten

---

## 05 — Interaction & Motion Principles

The three interactions you selected each earn their place by serving a specific purpose. None exist for decoration.

### Custom cursor — the tactile signal

**Purpose:** Instant signal that this site is considered. Felt within the first second.

Small circle, minimal, near-earthtone color (warm charcoal or muted terracotta). Morphs on hover: expands over project cards, adds label text ("View →"), contracts over copy. Changes subtly between light and dark page contexts.

Not flashy. Just present. The cursor is the site's heartbeat.

### Page transitions — the cinematic signal

**Purpose:** Reinforce that moving between work and case studies is a considered moment, not a page load.

Full-bleed warm-neutral color wipe between homepage and case study pages. 600–800ms. Content on the new page enters with a staggered fade-up after the wipe lands. Exit/entrance timing should feel cinematic, not fast-fade.

The transition is where "editorial" and "interactive" meet. It's the moment that makes case study pages feel like chapters, not subpages.

### Scroll-triggered animations — the editorial signal

**Purpose:** Guide the eye through case studies as a narrative, not a scroll dump.

On the **homepage**, scroll animations stay quiet: subtle fade-ups on project cards, mild parallax on hero imagery. Nothing that slows the scan.

On **case study pages**, scroll earns more: parallax image layers, pin-and-scrub reveals for process sections, horizontal scroll moments for frame sequences or multi-asset reveals. This is where Zita's storytelling model lives.

### The motion hierarchy

Quick reference for every motion decision on the site:

1. Does this motion serve comprehension or navigation? → Keep.
2. Does it signal the brand's considered quality? → Keep.
3. Is it there because it looks cool? → Delete.

---

## 06 — Resolved Decisions

These are resolved decisions and current implementation notes. Treat them as source-of-truth unless Micah explicitly updates direction.

- ~~**Gaia framing.**~~ ✅ Resolved. Self-initiated reimagining of iNaturalist. Full brand + product + shipped iOS app. Scope statement locked.
- ~~**Babel inclusion.**~~ ✅ Resolved. Previously considered archive-only, but not part of the current Framer CMS set.
- ~~**AirPods scope statement.**~~ ✅ Resolved. Blended A/B variant locked — collaborative framing with hero lockup as lead credential.
- ~~**Open-to-work status.**~~ ✅ Resolved. Current Framer Home uses `AVAILABLE FOR WORK` as a bottom-row mailto link. The older static green-dot/live-time treatment is not implemented and should be treated as optional future polish, not current state.
- ~~**Tone of voice.**~~ ✅ Resolved. Clear, grounded, warm. Full tone guide and current case study openings live in `portfolio-copy-v2.md`.
- ~~**Simon & Schuster scope statement.**~~ ✅ Resolved, then revised. Originally framed as a professional rebrand. Corrected to "concept rebrand" with honest metadata ("2025 · Concept"). Opening uses "rebrand concept" and "I saw an opportunity to reimagine" rather than implying a client engagement.
- ~~**Concept labeling.**~~ ✅ Resolved. All school projects labeled "Concept" in metadata. Self-initiated projects with real outcomes (Gaia, NPPC) labeled "Self-initiated." Only AirPods carries a client name in metadata.
- ~~**Weaponized Innocence tier.**~~ ✅ Promoted from Tier 3 (inline expand) to Tier 2 (dedicated visual showcase page). Fonts in Use recognition and editorial depth earn a full page, especially for Target 3.
- ~~**Homepage layout.**~~ ✅ Resolved. Current Framer Home work section is `HomeSelectedWorkGrid.tsx`, rendering six selected projects from CMS order: Gaia, AirPods Pro 3, Peak Energy, Simon & Schuster, Motion Connect 2025, and National Park Playing Cards. This replaced the broken native Home selected-work grid whose CMS bindings collapsed to AirPods. Current hero is 60vh, not full viewport.
- ~~**Template direction.**~~ ✅ Resolved. Jacob Turner Framer template as structural base. Reskin colors, type, spacing to natural/minimal direction. Journal CMS collection still exists but no Journal page appears in current project structure. `/index`, `/case-studies`, and `/info` are live routes; `/contact` is no longer in the current Framer page inventory. `/worldgrid-test` is no longer a web route.
- ~~**ArtCenter placement.**~~ ✅ Resolved. Education/background context lives on `/info`, not on the homepage. "Self-initiated" framing for school projects in case study copy.
- ~~**Testimonials.**~~ ✅ Copy resolved and now visible on `/info`: Nadia, Aaron, and Angela appear in the `WHAT PEOPLE SAY` section. The AirPods detail page can still carry the Nadia quote if the case-study page needs the credential in context.
- ~~**Profile page layout.**~~ ✅ Current Framer state differs from older wireframe v2 notes. `/info` is now a forest-green editorial page with a `HEY, / I'M MICAH.` hero, sticky video, intro copy, selected experience list, `WHAT PEOPLE SAY` testimonials, recognition rows, and CTA links. Résumé/currently/colophon modules are not visible in the audited desktop XML.
- ~~**Index page layout.**~~ ✅ Resolved (May 26 update; consolidated June 11). Canonical `/index` is `u2LOaBT5q`; the old duplicate `yKKOMVNs6` and temporary `/index-inline-toggle-test` route are gone. `/index` uses the original-template uppercase `GRID / LIST` control rendered directly by `IndexPage.tsx` after the taxonomy nav. `CLEAR FILTERS` stays as the original left-aligned `TaxonomySection` action; `IndexPage.tsx` applies the style-only matching and keeps a stable 12px/28px/24px action-row rhythm so filters can be selected/deselected without shifting content. The selected view is underlined, and there is no delegated fixed/floating or DOM-mutating toggle helper. List view (default): year-grouped projects with taxonomy filters and near-black `#141414` rules/dividers. Taxonomy follows Figma node `32:7531` at desktop/wide tablet with a flexible six-column grid: Year label/value cols 1/2, Service label/value cols 3/4, Industry label/value cols 5/6. At <=899px the taxonomy/index nav switches to SearchSystem-style label/value rows. The List year-group wrapper shares the 6-col grid; inside it, list rows use a 5-col inner grid on desktop. At <=1199px Standard list year/title type stays at the desktop 22px scale, Service metadata/tags disappear, and Industry stays visible/right-aligned with wrapping instead of truncation. `List Type` A/B: `Standard` keeps large year + 22px title; `Mono 13` makes all list typography 13px uppercase mono. `List Hover` A/B: `Flip` is default (title-only upward flip mirroring `ViewProject` reference `node=L21w7Xq1z`); `Highlight` preserves the older full-row hover. Grid view renders project-driven cards with media, title, and metadata; the unfiltered `Case Studies Filter` fallback was removed. Year / Service / Industry nav values are derived dynamically from the in-scope projects; the previous "eight canonical Discipline labels" lock is not enforced in code. Do not expose 3D mode in `/index` unless Micah explicitly asks. `IndexListCursorPreview.tsx` and `IndexFilterNavDraftPage.tsx` were removed on May 26 because they were not active in the current Framer page structure.
- ~~**Domain and URL.**~~ ✅ Resolved. Keep the portfolio oriented around `micahhoang.info`. Framer staging may appear as `khaki-ship-257706.framer.app`, but the public portfolio target is `micahhoang.info`.
- ~~**CMS cleanup.**~~ ✅ Resolved. The Jacob Turner sample projects were permanently deleted from the `All Projects` CMS collection. The collection now contains 17 real Micah projects after the June 15 roster update.
- ~~**Per-project thumbnail stroke.**~~ ✅ Resolved. `All Projects` has a `Thumbnail Stroke` Boolean (`OHdUYs6Mo`), currently on for Gaia, AirPods Pro 3, and Karuna. `CaseStudyThumbnailStrokeStyles.tsx` (`Z28JYvA`) owns the visible 1px Light Gray stroke from CMS in native/media contexts, while `HomeSelectedWorkGrid.tsx` mirrors that field for the Home selected-work cards. The native Framer `Case Study` component also has a real overlay frame inside `ImageWrapper` so the CMS-driven stroke can be visible in the editor canvas; no `CardStroke` variants should be reintroduced. June 1-15 note: the helper and Home grid handle Framer's current generated CMS module export shape (`r` instead of legacy `a`) and function-shaped exports.

---

## 07 — Build Phases (recap, for reference)

- **Phase 1 — Foundation** (current status): Jacob Turner Framer template is the structural base. `All Projects` CMS has been cleaned to 17 real projects, sample/template records deleted, and Home uses `HomeSelectedWorkGrid.tsx` for the six-item selected-work section. Preserve the existing Home selected-work setup unless there is an explicit redesign request.
- **Phase 2 — Layout & identity** (current): Continue refining hero zone, project cards, Home about/CTA, `/info` editorial profile page, `/case-studies` index, and `/index` List/Grid views. `/index` Grid view now renders project-driven native HTML cards from the same `filteredProjects` path used by List view, with no native CMS grid fallback.
- **Phase 3 — Native motion** (Week 2): Framer-native scroll reveals, hover states on project cards (lift/scale), link transitions, and light grid/list motion. The site should feel alive without overcomplicating the code component.
- **Phase 4 — Custom components** (Week 2-3): Cursor, page transitions, and scroll-scrub on case studies should be built only when they serve the portfolio. The old WorldGrid reference is no longer active in the current Framer inventory; keep 3D/gallery experiments out of `/index` unless Micah explicitly asks to reintroduce them.
- **Phase 5 — Polish & launch** (Week 3): Mobile audit, performance pass, SEO meta, domain cutover, private preview to 3–5 trusted reviewers before public launch.

---

## 08 — Success Criteria

The portfolio has succeeded when:

1. A hiring manager at Apple Identity, Anthropic, or Google can identify Micah's discipline and craft level within 10 seconds of landing.
2. A creative director at Koto or New Company can place Micah in the "brand designer" hire box without hesitation, while noticing the range.
3. A founder at a well-funded startup sees evidence of shipping velocity and AI fluency within 60 seconds.
4. A fellow designer who goes deep finds a reward in the Index, the case-study depth, and the R&D work.
5. The site itself is something Micah could submit as a portfolio piece. It's not separate from the work; it is one of the projects.

The inverse — what failure looks like:

- The site reads as "UI designer" or "generalist" rather than "brand designer with range."
- Reviewers can't tell what Micah specifically did on AirPods. *(Mitigated — scope statement locked with hero-lockup-first structure and collaborative framing.)*
- A recruiter feels misled about the professional vs. concept distinction on any project. *(Mitigated — "Concept" in metadata, honest framing in openings, no implied client relationships that didn't exist.)*
- The interactions feel like a pattern showcase rather than a cohesive sensibility.
- The case studies look polished but don't show the process behind them.
