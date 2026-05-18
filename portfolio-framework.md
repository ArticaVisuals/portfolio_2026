# Portfolio Redesign — Strategic Framework & Information Architecture

**For:** Micah Hoang
**Version:** 1.1 — May 6 Framer audit reflected. CMS is still 15 real projects. Home is a six-item CMS-limited selected-work query. `/info` is the live profile route, `/worldgrid-test` is unrouted, and the previous duplicate `/index` page has been deleted (single `/index` now).
**Date:** May 2026
**Last Framer MCP audit:** May 6, 2026. Published/staging URL `https://khaki-ship-257706.framer.app`. Current-state companion: `framer-current-state.md`.

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

The order is a deliberate argument. Each visible Home card earns its slot and reinforces the one before it. Current Framer Home is a CMS-backed selected-work query: `Is Homepage = true`, ordered by `Sorting Number`, limited to 6 records, rendered with the native `Case Study` component rather than a custom code component.

| # | Project | Strategic job | Primary targets |
|---|---|---|---|
| 1 | **AirPods Pro 3** | Opens with the highest credential. Reframes everything below. | 1, 2 |
| 2 | **Simon & Schuster** | Concept rebrand grounded in real strategic context. Proves brand craft and systemic thinking. Fonts in Use. | 1, 3 |
| 3 | **Gaia** | Full-scope rebrand + product redesign, AI-native build. Signals where design is going. | 1, 2 |
| 4 | **National Park Playing Cards** | Entrepreneurial, shipped, human. 20K copies, REI/National Park retail. Store-count copy needs final confirmation. | 2, 3 |
| 5 | **Motion Connect 2025** | Event identity and motion system. Adds current ArtCenter/community signal and kinetic range. | 2, 3 |
| 6 | **Yomo** | Brand + UI + UX in one project. Range, without declaring it. | 1, 2 |

**Home query nuance:** Karuna is currently off Home because its `Is Homepage` flag is `false`. Weaponized Innocence has `Is Homepage` set to `true`, but it is not visible in the published Home grid because the query stops at the first six homepage-flagged records by sort order. To change Home curation, update both the CMS flag and sort order, then verify the six-item query.

**Explicitly off the published Home grid:** Karuna, Weaponized Innocence, Wolff Olins x ArtCenter, Aspen Valley Landscaping, Cellular Symphony, Neon Lights, John Steinbeck, Seek Truth, and Independent Lens. Karuna and Weaponized are strategic Tier 2 work, but current Home visibility is governed by the CMS/query state above.

**Deleted from CMS:** all Jacob Turner sample/template records, including Vern Carter, Iris Wade, Orion Ventures, Echoes, Iconic, Adapting Literature, Genre Evolution, Digital Disruption, Connections, Capturing the Essence, Beyond the Frame, and Harmony in Motion.

### Case study depth — three tiers

Not every homepage project needs the same depth. A uniform depth requirement is why most portfolios die on the vine.

- **Tier 1 — Full case study pages** (3 projects): AirPods Pro 3, Simon & Schuster, Gaia.
  These earn the hire. Editorial scroll, process, decisions, specific contribution, outcome. 1500–2500 words per page, heavily image-led.

- **Tier 2 — Visual showcase + context** (5 projects): National Park Playing Cards, Motion Connect 2025, Yomo, Karuna, Weaponized Innocence.
  One rich page, minimal copy, lots of imagery, a clear frame of the problem and outcome. The work carries the weight. Weaponized Innocence remains Tier 2 due to Fonts in Use recognition and editorial depth that serves Target 3 (studios).

- **Archive/editorial records needing a final depth decision**: Seek Truth and Independent Lens.
  Both now exist in CMS with richer `Content` field copy and recognition. Decide whether they remain archive entries or become dedicated visual showcase pages before adding them to case-study build order.

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

As of the May 1 audit, the `All Projects` CMS collection contains 15 real projects and zero sample/template projects.

- **Hybrid case-study workflow:** use `All Projects` as the registry for metadata, browsing, sorting, filters, thumbnails, and homepage/index visibility. Use bespoke Framer pages for individual case-study storytelling when a project needs custom layout, pacing, or media. See `case-study-cms-workflow.md`.
- **CMS collection:** `All Projects`, collection ID `yTHrQWMIY`
- **Secondary CMS collection still present:** `Journal`, collection ID `SyZTxPxeY`. No visible Journal page exists in the current project structure; ignore it unless Micah explicitly asks to revive journal content.
- **Visible on published Home:** AirPods Pro 3, Simon & Schuster, Gaia, National Park Playing Cards, Motion Connect 2025, Yomo
- **Homepage-flagged but not visible because of the six-item query limit:** Weaponized Innocence
- **Strategic Tier 2 but currently off Home:** Karuna
- **Archive/off-Home:** Wolff Olins x ArtCenter, Aspen Valley Landscaping, Cellular Symphony, Neon Lights, John Steinbeck, Seek Truth, Independent Lens
- **Live `/case-studies` route:** page ID `Rnw1WO1jS`, a case-study index currently headed `CASE STUDIES (12)` and rendered with the native Framer `Case Studies Filter` component. The count is stale against the 15-record CMS and should be updated or made dynamic.
- **Full roster and field map:** see `framer-current-state.md`.

Important field IDs for future CMS agents:

- `oeXZcmPna` Title
- `DLBifmgp1` Sorting Number
- `kuvJcmOFr` Category 1
- `VV1CggU2J` Category 2
- `E6OpH0hSs` Category 3
- `Jy7hBJady` Thumbnail
- `WG62tRjG8` Thumbnail Video Link
- `vlN2R_qnF` Client
- `QZqSK_3OF` Year. MCP reports this CMS field as a string field even though `IndexPage.tsx` currently types the bound prop as a number; preserve the field ID and coerce carefully if touching data plumbing.
- `mBIilFqVM` Industry
- `myUIfK0j7` Is Homepage

Additional case-study content fields now exist for credits, images, videos, next-project links, and body content. Use `framer-current-state.md` for the full field map before editing CMS data.

Recommended manual fields for the hybrid workflow: add `Case Study URL` as a Link field and optionally `Build Status` as an enum in Framer. The collection is user-managed, so future agents cannot add these fields through MCP. Do not repurpose existing field IDs to make room for them.

Index taxonomy/list rule: the second nav column is `Industry`, not `Origin`. Taxonomy and the List year-group wrapper share a six-column grid inside the 20px page margin, with 20px gaps and flexible column widths. Taxonomy alignment: Discipline label/values columns 1/2, Industry label/values columns 3/4, Year label/values columns 5/6. The List year-group puts the Year label in column 1 and the row content in `2 / span 5`; inside that content area, list rows use a five-column grid (title cols 1/span 2, discipline cols 3/span 2, industry col 5/span 1). Industry must stay visible at every breakpoint; Discipline/Industry cells shrink and truncate with ellipses. Intra-year project dividers and year rules should render full-opacity Light Gray `#979797`; the inline `GRID / LIST` helper normalizes `.idx-rule` and `.idx-row-divider` on `/index`. Year rules and intra-year project dividers animate with the same left-to-right reveal as Framer `LineAnimation` reference `node=CE4nNCCk8`. The `/index` component has a Framer `List Type` A/B control: `Standard` preserves the large-year/22px-title hierarchy, while `Mono 13` makes year, title, discipline, and industry all 13px uppercase mono for a Searchsystem-style comparison. It also has a `List Hover` A/B control: `Flip` is the default and mirrors Framer `ViewProject` reference `node=L21w7Xq1z` with a clipped upward title-only text flip; `Highlight` preserves the older full-row hover background for comparison.

Discipline / Industry / Year nav values are no longer hardcoded — the live `IndexPage.tsx` derives all three from whatever projects are in scope (`getDisciplineNavItems`, `getIndustryNavItems`, `getYearNavItems`). The earlier "eight canonical Discipline labels" lock and the `DISCIPLINE_ALIASES` normalization map are not present in the current code; if you want them back, you must reintroduce that filter explicitly. The CMS `Industry` field stores longer values (`Consumer Electronics / Technology`, `Citizen Science / Biodiversity`, `Outdoor Retail / Consumer Goods`, `Design Education / Motion Design`, `Politics / Protest`, `Film / Documentary / Public Media`, etc.), but the in-code 15-project `DEFAULT_PROJECTS` snapshot uses simplified labels (`Technology`, `Publishing`, `Nature & Outdoors`, `Design Education`, `Health & Wellness`, `Human Rights`, `Science`, `Music`, `Literature`). Whichever data source is in scope drives the visible labels.

The Archive/Index page houses work that strengthens the picture without crowding the main narrative. Current `/index` interaction is intentionally simple: taxonomy filters plus List/Grid browsing. The **WorldGrid 3D gallery interaction** should stay out of `/index` unless Micah explicitly asks to bring it back. `WorldGridTest.tsx` still exists as a code component, but there is no current `/worldgrid-test` web route.

Current implementation note (May 6, 2026): Framer code file `rgAZFOv` owns the `/index` archive component, and the live Framer file is **newer than the repo `IndexPage.tsx`**. The live file adds a `useCMS` Boolean prop and a window-singleton registry (`window.__articaIndexProjectsRegistry`) intended to be populated by a separate `ProjectRegistrar` code component placed inside a Framer Collection List bound to `All Projects`. The Registrar component does not yet exist in the project, so with `useCMS=true` set on `/index` the page falls through to the in-code `DEFAULT_PROJECTS` snapshot. The CMS remains the source of truth; until the Registrar is built, CMS edits do not flow into `/index` automatically.

Current `/index` XML shows the footer using `AVAILABLE FOR WORK`, LinkedIn, Resume linking to `/info`, Cosmos, and `©2026`. Continue checking shared footer instances before launch, but the older placeholder destination warning is no longer current.

---

## 04 — Information Architecture

### Top-level site map

```
micahhoang.info
│
├── / (Home)
│   ├── Hero — current Framer desktop is a 70vh cream hero with large name, discipline statement, bottom status/social/copyright row
│   ├── Work — 6 visible curated projects, mixed grid image/video cards with visual hierarchy
│   │   ├── Current CMS-limited set: AirPods Pro 3, Simon & Schuster, Gaia
│   │   ├── National Park Playing Cards, Motion Connect 2025, Yomo
│   │   └── All cards link to /case-studies/[slug]
│   ├── About — portrait + two-column bio copy with "read more" link to /info
│   └── Contact CTA — full-viewport forest-green section with email, LinkedIn, Cosmos
│
├── /case-studies
│   └── Native Framer case-study index: "CASE STUDIES (12)" + Case Studies Filter component; count is stale vs 15 CMS records
│
├── /case-studies/[slug]
│   ├── /case-studies/airpods-pro-3         [Tier 1 — full case study]
│   ├── /case-studies/simon-schuster        [Tier 1 — full case study]
│   ├── /case-studies/gaia                  [Tier 1 — full case study]
│   ├── /case-studies/national-park-cards   [Tier 2 — visual showcase]
│   ├── /case-studies/motion-connect-2025   [Tier 2 — visual showcase]
│   ├── /case-studies/yomo                  [Tier 2 — visual showcase]
│   ├── /case-studies/karuna                [Tier 2 — visual showcase]
│   ├── /case-studies/weaponized-innocence  [Tier 2 — visual showcase]
│   ├── /case-studies/seek-truth            [Archive/editorial pending depth decision]
│   └── /case-studies/independent-lens      [Archive/editorial pending depth decision]
│
├── /index (Archive) — canonical page (`u2LOaBT5q`)
│   ├── Header: "INDEX" title (in a SectionHero above the code component) + original-template inline `GRID / LIST` view toggle
│   ├── Temporary side-by-side comparison route `/index-inline-toggle-test` was removed after the inline-toggle version was promoted
│   ├── List Type / List Hover / Default View / Use CMS exposed as Framer property controls on the IndexPage instance
│   ├── List view (default): year-grouped all-project archive with taxonomy filters
│   │   ├── Taxonomy source: Figma node 32:7531
│   │   ├── Taxonomy groups stay horizontal at desktop/tablet: Discipline, Industry, Year
│   │   ├── Discipline/Industry/Year nav items derived dynamically from in-scope projects
│   │   ├── Each row: title, discipline tags, industry
│   │   ├── Full-opacity Light Gray `#979797` year dividers and row rules
│   │   └── Project count updates with filters (singular/plural)
│   ├── Grid view: project-driven native HTML cards rendered inside `IndexPage.tsx`
│   │   ├── Uses the same filteredProjects array as List view (no native Case Studies Filter fallback)
│   │   ├── Uniform 3/2/1 column responsive grid
│   │   ├── 16:9 thumbnails with titles above the image
│   │   ├── 56px row gap on desktop, 40px on mobile
│   │   ├── One-column stacked cards on mobile
│   │   └── Fills the index content width with the same 20px side margin as nav
│   ├── 3D preview
│   │   └── Not exposed on `/index`; keep List/Grid only unless Micah asks to bring it back
│   ├── WorldGrid
│   │   └── `WorldGridTest.tsx` exists as code file `ibj8uxT`, but no `/worldgrid-test` web route exists
│   ├── Project source priority: window registry (when useCMS=true and registrars exist) > projects prop > in-code DEFAULT_PROJECTS snapshot
│   └── Click through to case study pages at `/case-studies/{slug}`
│
├── /info
    ├── Current Framer desktop is a forest-green editorial profile page
    ├── 64vh heading: "HEY, / I'M MICAH. / Brand designer with a systems mind."
    ├── Sticky video, intro copy, selected experience, testimonials, recognition rows
    └── CTA links to Contact, Project Index, AirPods Pro 3, and Gaia
│
└── /contact
    └── Forest-green contact page with sticky hero image, email, LinkedIn, and Cosmos rows
```

### Navigation model

Three primary nav items currently appear in the Framer Navigation component.

**Work · Index · Info**

- **Work** → scrolls to the Work section on home (if on home) or navigates home and scrolls
- **Index** → the archive / taxonomy browsing page
- **Info** → `/info`, the editorial profile/background page
- **Contact** → exists as `/contact` and through CTA/footer links, but is not currently in the primary nav component

No hamburger on mobile unless absolutely necessary. The current three-item nav fits.

### The homepage as a single considered document

The homepage is a one-page scroll with five zones:

1. **Nav bar** — "Micah Hoang" left, "Work · Index · Info" right. Contact exists through `/contact` and CTA/footer links, but is not currently in the primary nav component.
2. **Hero zone** — current Framer desktop uses a 70vh cream hero with display-scale "MICAH HOANG", the discipline statement, `AVAILABLE FOR WORK`, LinkedIn/Resume/Cosmos links, scroll prompt, and copyright. The May 1 XML shows a spacing typo in the subline (`mind.Strategy`); approved copy includes a space. The earlier green-dot/live-time idea is not currently implemented.
3. **Work zone** — current Framer implementation uses the native `Case Study` component inside a CMS-backed six-item selected-work query. Cards link to `/case-studies/[slug]`, and the `VIEW ALL` CTA links to `/index`. Do not replace this section with a custom code component unless Micah explicitly asks.
4. **About zone** — current Framer Home uses a portrait plus two columns of bio copy and a `read more` link to `/info`.
5. **Contact zone** — current Framer Home ends in a full-viewport forest-green CTA with email, LinkedIn, and Cosmos links.

The Home route gives the full story in one scroll. `/info` exists for people who specifically want to go deeper on background. `/contact` exists as a simple direct destination.

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
- ~~**Babel inclusion.**~~ ✅ Resolved. Previously considered archive-only, but not part of the current 15-item Framer CMS set.
- ~~**AirPods scope statement.**~~ ✅ Resolved. Blended A/B variant locked — collaborative framing with hero lockup as lead credential.
- ~~**Open-to-work status.**~~ ✅ Resolved. Current Framer Home uses `AVAILABLE FOR WORK` as a bottom-row mailto link. The older static green-dot/live-time treatment is not implemented and should be treated as optional future polish, not current state.
- ~~**Tone of voice.**~~ ✅ Resolved. Clear, grounded, warm. Full tone guide and current case study openings live in `portfolio-copy-v2.md`.
- ~~**Simon & Schuster scope statement.**~~ ✅ Resolved, then revised. Originally framed as a professional rebrand. Corrected to "concept rebrand" with honest metadata ("2025 · Concept"). Opening uses "rebrand concept" and "I saw an opportunity to reimagine" rather than implying a client engagement.
- ~~**Concept labeling.**~~ ✅ Resolved. All school projects labeled "Concept" in metadata. Self-initiated projects with real outcomes (Gaia, NPPC) labeled "Self-initiated." Only AirPods carries a client name in metadata.
- ~~**Weaponized Innocence tier.**~~ ✅ Promoted from Tier 3 (inline expand) to Tier 2 (dedicated visual showcase page). Fonts in Use recognition and editorial depth earn a full page, especially for Target 3.
- ~~**Homepage layout.**~~ ✅ Resolved. Current Framer Home work section is a six-item CMS-backed selected-work query: AirPods Pro 3, Simon & Schuster, Gaia, National Park Playing Cards, Motion Connect 2025, and Yomo. Do not recode this section as a custom component unless Micah explicitly asks. Current hero is 70vh, not full viewport.
- ~~**Template direction.**~~ ✅ Resolved. Jacob Turner Framer template as structural base. Reskin colors, type, spacing to natural/minimal direction. Journal CMS collection still exists but no Journal page appears in current project structure. `/index`, `/case-studies`, `/info`, and `/contact` are live routes. `/worldgrid-test` is no longer a web route.
- ~~**ArtCenter placement.**~~ ✅ Resolved. Education/background context lives on `/info`, not on the homepage. "Self-initiated" framing for school projects in case study copy.
- ~~**Testimonials.**~~ ✅ Copy resolved and now visible on `/info`: Nadia, Aaron, and Angela appear in the `WHAT PEOPLE SAY` section. The AirPods detail page can still carry the Nadia quote if the case-study page needs the credential in context.
- ~~**Profile page layout.**~~ ✅ Current Framer state differs from older wireframe v2 notes. `/info` is now a forest-green editorial page with a `HEY, / I'M MICAH.` hero, sticky video, intro copy, selected experience list, `WHAT PEOPLE SAY` testimonials, recognition rows, and CTA links. Resume/currently/colophon modules are not visible in the audited desktop XML.
- ~~**Index page layout.**~~ ✅ Resolved (May 6 update; inline toggle promoted and integrated May 16; breakpoint promotion published May 18). Canonical `/index` is `u2LOaBT5q`; the old duplicate `yKKOMVNs6` and temporary `/index-inline-toggle-test` route are gone. `/index` now uses the original-template uppercase `GRID / LIST` control at the top-right of the project content, rendered directly by `IndexPage.tsx`. The selected view is underlined, inactive options shift to Light Gray `#979797` on hover, and there is no delegated fixed/floating toggle helper. List view (default): year-grouped projects with taxonomy filters and full-opacity `#979797` rules/dividers. Taxonomy follows Figma node `32:7531` at desktop/wide tablet with a flexible six-column grid: Discipline label/value cols 1/2, Industry label/value cols 3/4, Year label/value cols 5/6. At ≤899px the taxonomy/index nav switches to SearchSystem-style label/value rows. The List year-group wrapper shares the 6-col grid; inside it, list rows use a 5-col inner grid on desktop. At ≤1199px list type scales to 16px/20px, Discipline metadata/tags disappear, and Industry stays visible/right-aligned with wrapping instead of truncation. `List Type` A/B: `Standard` keeps large year + 22px title; `Mono 13` makes all list typography 13px uppercase mono. `List Hover` A/B: `Flip` is default (title-only upward flip mirroring `ViewProject` reference `node=L21w7Xq1z`); `Highlight` preserves the older full-row hover. The second group is `Industry`, not `Origin`. Grid view renders project-driven cards; the unfiltered `Case Studies Filter` fallback was removed. Discipline / Industry / Year nav values are derived dynamically from the in-scope projects; the previous "eight canonical Discipline labels" lock is not enforced in code. Do not expose 3D mode in `/index` unless Micah explicitly asks; `WorldGridTest.tsx` is unrouted. The old `/index-breakpoints-draft` route remains a Framer draft and is not published.
- ~~**Domain and URL.**~~ ✅ Resolved. Keep the portfolio oriented around `micahhoang.info`. Framer staging may appear as `khaki-ship-257706.framer.app`, but the public portfolio target is `micahhoang.info`.
- ~~**CMS cleanup.**~~ ✅ Resolved. The Jacob Turner sample projects were permanently deleted from the `All Projects` CMS collection. The collection now contains 15 real Micah projects.

---

## 07 — Build Phases (recap, for reference)

- **Phase 1 — Foundation** (current status): Jacob Turner Framer template is the structural base. `All Projects` CMS has been cleaned to 15 real projects, sample/template records deleted, and Home uses the native `Case Study` card system through a six-item CMS query. Preserve the existing Home component setup unless there is an explicit redesign request.
- **Phase 2 — Layout & identity** (current): Continue refining hero zone, project cards, Home about/CTA, `/info` editorial profile page, `/case-studies` index, and `/index` List/Grid views. `/index` Grid view now renders project-driven native HTML cards from the same `filteredProjects` path used by List view, with no native CMS grid fallback.
- **Phase 3 — Native motion** (Week 2): Framer-native scroll reveals, hover states on project cards (lift/scale), link transitions, and light grid/list motion. The site should feel alive without overcomplicating the code component.
- **Phase 4 — Custom components** (Week 2–3): Cursor → page transitions → scroll-scrub on case studies. Built with Claude/Cursor, injected as React components in Framer. WorldGrid currently exists only as `WorldGridTest.tsx`; keep it unrouted and out of the `/index` toggle unless Micah explicitly asks to reintroduce 3D.
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
