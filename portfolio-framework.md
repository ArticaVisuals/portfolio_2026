# Portfolio Redesign — Strategic Framework & Information Architecture

**For:** Micah Hoang
**Version:** 1.0 — May 1 Framer audit reflected. CMS is now 15 real projects. Home is a six-item CMS-limited selected-work query. `/info` is the live profile route, `/worldgrid-test` is no longer a web route, and duplicate `/index` pages exist.
**Date:** May 2026
**Last Framer MCP audit:** May 1, 2026. Published/staging URL `https://khaki-ship-257706.framer.app`, deployed May 1, 2026 at 12:37 PM PDT. Current-state companion: `framer-current-state.md`.

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

Index taxonomy/list rule: the second nav column is `Industry`, not `Origin`. The current index Discipline nav is the taxonomy source of truth. Discipline labels are locked to exactly `Visual Identity`, `Brand Strategy`, `UX/UI`, `2D Motion`, `3D Motion`, `Packaging`, `Product`, and `Editorial`; older category names may exist only as legacy aliases that normalize into those eight labels, and unknown CMS category strings should not display or become filterable as Discipline labels. The taxonomy and List view share a six-column grid inside the 20px page margin, with 20px gaps and flexible column widths. Taxonomy alignment is: Discipline label/value columns 1/2, Industry label/value columns 3/4, Year label/value columns 5/6. List alignment is: Year column 1, Title columns 2-3, Discipline columns 4-5, Industry column 6. Industry must stay visible at every breakpoint; Discipline/Industry cells shrink and truncate with ellipses. Project dividers within each year use the Framer `Light Gray` token value `#979797`, not white. Year rules and intra-year project dividers animate with the same left-to-right reveal as Framer `LineAnimation` reference `node=CE4nNCCk8`. The `/index` component has a Framer `List Type` A/B control: `Standard` preserves the current large-year/22px-title hierarchy, while `Mono 13` makes year, title, discipline, and industry all 13px uppercase mono for a Searchsystem-style comparison. It also has a `List Hover` A/B control: `Flip` is the default and mirrors Framer `ViewProject` reference `node=L21w7Xq1z` with a clipped upward title-only text flip, while `Highlight` preserves the older full-row hover background for comparison.

Important taxonomy distinction from earlier audits: the CMS `Industry` field contains longer values like `Consumer Electronics / Technology`, `Citizen Science / Biodiversity`, `Outdoor Retail / Consumer Goods`, `Design Education / Motion Design`, `Politics / Protest`, and `Film / Documentary / Public Media`. Do not assume older simplified visible `/index` labels and raw CMS field values are identical. If future agents want exact CMS-backed labels, update the Framer binding/data mapping deliberately.

The Archive/Index page houses work that strengthens the picture without crowding the main narrative. Current `/index` interaction is intentionally simple: taxonomy filters plus List/Grid browsing. The **WorldGrid 3D gallery interaction** should stay out of `/index` unless Micah explicitly asks to bring it back. `WorldGridTest.tsx` still exists as a code component, but there is no current `/worldgrid-test` web route.

Current implementation note: Framer code file `rgAZFOv` still owns the `/index` archive component. Local `IndexPage.tsx` has a 15-project fallback synced from the CMS registry, including current thumbnail/video fields. The CMS remains the source of truth for live data; refresh the fallback if CMS project metadata changes.

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
├── /index (Archive)
│   ├── Header: "Index" title + List/Grid view toggle
│   ├── Current Framer watchpoint: two web pages share `/index`
│   │   ├── u2LOaBT5q — Standard list typography
│   │   └── yKKOMVNs6 — Mono 13 list typography
│   ├── List view (default): year-grouped all-project archive with taxonomy filters
│   │   ├── Taxonomy source: Figma node 32:7531
│   │   ├── Taxonomy groups stay horizontal: Discipline, Industry, Year
│   │   ├── Each row: title, discipline tags, industry
│   │   ├── Strong year dividers
│   │   └── Project count updates with filters
│   ├── Grid view: project-driven filtered Case Study cards
│   │   ├── Uses the same filteredProjects array as List view
│   │   ├── Alternating weighted 3-card rows on desktop/tablet
│   │   ├── One-column stacked cards on mobile
│   │   └── Fills the index content width with the same 20px side margin as nav
│   ├── 3D preview
│   │   └── Not exposed on `/index`; keep List/Grid only unless Micah asks to bring it back
│   ├── WorldGrid
│   │   └── `WorldGridTest.tsx` exists as code file `ibj8uxT`, but no `/worldgrid-test` web route exists
│   ├── All homepage projects + archive-only work from one CMS collection
│   └── Click through to case study pages where they exist
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
- ~~**Index page layout.**~~ ✅ Resolved, with one route watchpoint. List/Grid toggle only. The sticky bottom-left toggle uses two equal-width buttons and black/ink text for both active and inactive states. List view (default): year-grouped/all projects with taxonomy filters. Taxonomy follows Figma node `32:7531` but uses a flexible six-column grid, not fixed pixel columns: Discipline label/value start in columns 1/2, Industry label/value start in columns 3/4, and Year label/value start in columns 5/6. List rows use the same grid so Year, Title, Discipline, and Industry stay left-aligned as the viewport changes; Industry is never hidden, while Discipline/Industry text truncates with ellipses as columns shrink. The List view has a `List Type` A/B control: `Standard` keeps the current hierarchy, and `Mono 13` makes all list typography 13px uppercase mono for comparison. Framer currently contains two `/index` pages with different List Type defaults, so resolve/verify the published one before changing route-level behavior. The second group must be `Industry`, sourced from the CMS Industry property, not `Origin`. Unfiltered Grid uses the native CMS-backed `Case Studies Filter` grid when no project array is bound, matching `/case-studies`; filtered/CMS-bound Grid uses the project-driven `filteredProjects` path. Do not expose the old 3D mode in `/index` unless Micah explicitly asks; `WorldGridTest.tsx` exists only as an unrouted code component.
- ~~**Domain and URL.**~~ ✅ Resolved. Keep the portfolio oriented around `micahhoang.info`. Framer staging may appear as `khaki-ship-257706.framer.app`, but the public portfolio target is `micahhoang.info`.
- ~~**CMS cleanup.**~~ ✅ Resolved. The Jacob Turner sample projects were permanently deleted from the `All Projects` CMS collection. The collection now contains 15 real Micah projects.

---

## 07 — Build Phases (recap, for reference)

- **Phase 1 — Foundation** (current status): Jacob Turner Framer template is the structural base. `All Projects` CMS has been cleaned to 15 real projects, sample/template records deleted, and Home uses the native `Case Study` card system through a six-item CMS query. Preserve the existing Home component setup unless there is an explicit redesign request.
- **Phase 2 — Layout & identity** (current): Continue refining hero zone, project cards, Home about/CTA, `/info` editorial profile page, `/case-studies` index, and `/index` List/Grid views. `/index` Grid view uses the native CMS grid for the unfiltered default and the project-driven `filteredProjects` path when filters or bound data are active.
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
