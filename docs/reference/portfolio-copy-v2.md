# Portfolio Copy — Tone of Voice & Case Study Openings

**For:** Micah Hoang
**Version:** 1.10 - June 15 CMS/page parity reflected. Home shows six CMS-limited selected-work cards with Peak Energy still visible. CMS now has 17 real projects, including Rejuve, Belly Bar, and WhatsApp, and each CMS slug has a matching bespoke case-study route. `/info` is the live profile route and includes testimonials.
**Date:** May 2026
**Last Framer structure audit:** June 15, 2026. Published/staging URL `https://khaki-ship-257706.framer.app`. Current-state companion: `framer-current-state.md`.

**Implementation note - June 2, 2026:** Active Framer web routes are tracked in `framer-current-state.md`. The AirPods bespoke page and CMS slug are both currently `/case-studies/airpods`; the older `airpods-pro-3` slug exception is historical.

---

## 01 — Tone of Voice

### The voice in three words

**Clear. Grounded. Warm.**

Not clever. Not academic. Not performatively casual. The voice reads like someone who respects your time, knows what they did, and doesn't need to impress you with how they describe it.

### What the voice sounds like

- **First person, active voice.** "I designed" not "the identity was designed." Passive voice hides authorship, and authorship is the entire point of a portfolio.
- **Short sentences for facts. Longer sentences for context.** The factual claims (what you did, where it shipped, what it achieved) stay clipped. The framing (why it matters, what the problem was) can breathe a little more.
- **No adjectives doing the work of images.** Don't write "bold, striking visual identity." Show the identity and let the viewer decide it's bold. The copy sets up the frame; the work fills it.
- **Precise credit, not humble or inflated.** "I was a primary collaborator on X" is better than both "I led X" (if you didn't) and "I helped with X" (which erases your contribution). Name the specific thing. Name your role in relation to it. Stop.
- **No design jargon as filler.** "Crafted a cohesive ecosystem" doesn't mean anything. "Designed the identity, interface, and packaging as one connected system" does.
- **Human when it earns it.** The About section can be warm and personal. The case studies stay professional. Personality comes through in *what* you chose to work on and *how* you frame the problem, not in winking asides.

### Words to use

- Designed, developed, directed, built, contributed to, collaborated on
- System, identity, language, framework
- Shipped, launched, published, deployed, placed
- Self-initiated, reimagined, renamed, repositioned

### Words to avoid

- Crafted, curated (overused to the point of meaninglessness)
- Passionate (show it, don't say it)
- Leveraged, utilized (corporate filler)
- Holistic, synergy, ecosystem (unless describing an actual ecosystem, like Gaia)
- Stunning, beautiful, bold, striking (let the work be those things)
- Spearheaded, masterminded (ego language)

### The "read it aloud" test

Every case study opening should pass this test: if you read it aloud to a friend who isn't a designer, would they understand what you did and why it mattered? If you'd feel embarrassed by a phrase, either because it sounds inflated or because it sounds like a LinkedIn post, cut it.

---

## 02 — Homepage Copy

### Header

**Name line:** Micah Hoang
**Discipline line:** Brand Designer
**Status:** Available · [static green dot]
**Location + time:** Pasadena, California · [live local time]

No tagline. No "I design brands that..." sentence. The discipline line does the positioning; the work does the rest.

**Current Framer implementation note:** the Home hero currently renders `MICAH HOANG`, the approved line `Brand designer with a systems mind. Strategy, visual identity, motion.`, an `AVAILABLE FOR WORK` mailto text link, LinkedIn/Résumé/Cosmos links, a scroll prompt, and `©2026`. The June 2 publish corrected the previous `mind.Strategy` spacing typo. Home does not currently render the static green dot or live Pasadena time; treat those as optional future polish, not current copy.

### About Zone — *Locked*

> Brand designer with a systems mind. Strategy, visual identity, motion.
>
> Based in Pasadena, California. Available for full-time roles.

No project references (the work is directly above this on the homepage). No school mention (ArtCenter lives on the `/info` page under background/experience). No "I believe" statements. Two lines of positioning, two lines of logistics.

### "Currently into" rotation — *Locked (format)*

A single rotating line below the About paragraph. Updated whenever you feel like it. Adds personality without trying hard. Three categories:

- Currently reading: [book title]
- Currently listening to: [album or artist]
- Currently exploring: [place, tool, or idea]

---

## 03 — Case Study Openings

The strategic priority set has shifted with the current CMS. The CMS-backed Framer Home query shows six selected-work cards: Gaia, AirPods Pro 3, Peak Energy, Simon & Schuster, Motion Connect 2025, and National Park Playing Cards. WhatsApp is homepage-flagged but outside the six-item query because its sort order is 17. Yomo, Karuna, and Weaponized Innocence are currently off Home because their CMS `Is Homepage` flags are false. These paragraphs live at the top of each case study page, not on the homepage. The homepage shows only: project title, media, and the "View Project" card label.

---

### 1. AirPods Pro 3 — *Locked*

**Tier:** 1 — Full case study
**Metadata line:** 2025 · Apple Marcom · Visual Identity, 2D Motion, 3D Motion
**Collaborators:** João Peres, Nadia Shireen Husain, Karlo Fuertes Francisco, J Walton, Wilson Wu, Ara Devejian, Kayla Van der Byl, Abesalom Kavelashvili, Gabriel Ferrão, Dan Solomon, Bryan Coleman, Bryan Cobonpue

> Global launch identity for AirPods Pro 3 across keynote, Apple Retail, web, and digital, developed with Apple Marcom.
>
> My hero product-angle lockup was selected as the feature image placed across global Apple retail stores. I was also a primary collaborator on the APP3 liquid-glass logo animation, the partner asset guidelines handed off to Best Buy, Amazon, and other retailers, and the "bud tip size reveal" feature animation. I additionally contributed to lighting art direction across product motion, product control angle development, and the buds + case hero lockup.

*The photo of Micah in the Apple Store sits immediately alongside this paragraph.*

**Testimonial (on this case study page only):**

> "He was collaborative, thoughtful, and took direction well."
> — Nadia Shireen Husain, Associate Creative Director, Apple

---

### Peak Energy — *WIP shell created, copy needs clearance*

**Tier:** Pending depth decision
**Metadata line:** 2026, 2D Motion, 3D Motion, Social Media, Technology

Peak Energy is now in `All Projects` with slug `peak-energy`, sort `3`, and `Is Homepage=true`. A bespoke WIP-gated page exists at `/case-studies/peak-energy` with the Peak Energy x GM handoff snapshot: hero brand film, 2D/3D motion role, 2026, Technology, and an explicit mutual-NDA note. Do not infer additional public copy from the title alone; final case-study story, studio attribution, distribution details, and responsibilities need NDA plus production-contract clearance before the page is switched from WIP to ready.

---

### Rejuve, Belly Bar, and WhatsApp - *WIP shells created*

Rejuve, Belly Bar, and WhatsApp are now in `All Projects` and each has a matching WIP-gated bespoke route: `/case-studies/rejuve`, `/case-studies/belly-bar`, and `/case-studies/whatsapp`. These pages should stay as metadata shells until public case-study copy, credits, role details, and visual assets are approved.

---

### 2. Simon & Schuster — *Revised*

**Tier:** 1 — Full case study
**Metadata line:** 2025 · Concept · Brand Strategy, Visual Identity, UX/UI
**Recognition:** Fonts in Use Feature

> A strategic rebrand concept for Simon & Schuster, grounded in the real business context of the DOJ's intervention to block Penguin Random House's acquisition.
>
> With its independence reaffirmed, I saw an opportunity to reimagine what the company's brand could signal: an identity built around editorial openness, diverse voices, and a publishing culture that treats controversy as an invitation rather than a risk. I developed a full brand strategy, visual identity system, and experience design across digital and physical touchpoints. The typographic system was recognized by Fonts in Use.

---

### 3. Gaia — *Locked*

**Tier:** 1 — Full case study
**Metadata line:** 2026 · Self-initiated · ArtCenter CD5

> A self-initiated reimagining of **iNaturalist**, the world's largest citizen science platform, with 290 million observations and 4 million users. Renamed **Gaia** and redesigned to invite more people into biodiversity conservation.
>
> The brief I set myself: iNaturalist is powerful but not welcoming. The name alone excludes anyone who doesn't self-identify as a naturalist. A million species face extinction this century, and the best tool for seeing biodiversity at scale is also the most intimidating to enter.
>
> I delivered a full brand and product system: strategic renaming and positioning (*Gaia*, the Greek personification of Earth, a name that treats every species as part of one story), a complete visual identity (logo, brand mark, typographic system across New Spirit, Neue Haas Unica, and Basier Circle Mono, color tokens across nine 50–900 scales, iconography, species badges, data and content cards), and a reimagined product experience mapped to three strategic goals: increase access, motivation, and meaning. The final iOS app was vibe-coded in XCode via Claude, Claude Code, and Codex, built to Apple accessibility guidelines.

---

### 4. National Park Playing Cards — *Approved*

**Tier:** 2 — Visual showcase + context
**Metadata line:** 2019–ongoing · Self-initiated · Product, Packaging, Visual Identity

> A personal project turned product business. I designed a deck of playing cards featuring the US National Parks, illustrated, produced, and brought to market independently.
>
> Since launch, the deck has sold over 20,000 copies across more than 160 retail locations nationwide, including REI and six National Park Visitor Centers. The project spans product design, packaging, illustration, and the logistics of manufacturing, distribution, and retail partnerships, all self-directed.

---

### 5. Motion Connect 2025 — *CMS current*

**Tier:** 2 — Visual showcase + context
**Metadata line:** 2025 · ArtCenter · Visual Identity, 2D Motion, Editorial
**Collaborators:** Concept development by Allyssa Acevedo and Michelle Theodorus

> Motion Connect is an ArtCenter event series that brings the motion design community together through talks and programming. For the FA25 season, I created a cohesive visual identity and flexible asset system across print and digital touchpoints.
>
> Inspired by the joy of 80s arcade graphics, the identity pairs monolithic, vibrant typography with bold, kinetic visuals. The system supported social media, print collateral, a motion reel, and keynote graphics for speakers including Simon Clowes, Itay Tevel, Bon Zhang, and Cathy Xiao.

---

### 6. Yomo — *Approved*

**Tier:** 2 — Visual showcase + context
**Metadata line:** 2025 · Concept · Visual Identity, UX/UI, Product

> Yomo is a personalized food navigation platform designed for people with dietary restrictions, connecting them to recipes, restaurants, and groceries that match their needs across mobile, desktop, and smart glasses.
>
> I designed the complete system: visual identity, user interface, user experience, and interactive prototype. The challenge was building a brand and product language that felt warm and human in a space dominated by clinical nutrition apps. Accessible enough for daily use, specific enough to be genuinely useful.

---

### 7. Karuna — *Approved*

**Tier:** 2 — Visual showcase + context
**Metadata line:** 2025 · Concept · Visual Identity, Packaging, Product

> Highland Harvests is a product line for Karuna, a social enterprise in the highlands of Northern Vietnam working to empower indigenous Tai Dam communities through sustainable beekeeping.
>
> I designed the brand identity and packaging for a kit of three bee-derived products: Snow Honey, a hand-poured beeswax candle, and a biodegradable food wrap. The design needed to communicate both the craft of the products and the mission behind them, the relationship between the Tai Dam people, their land, and the biodiversity they protect.

---

### 8. Weaponized Innocence — *Revised*

**Tier:** 2 — Visual showcase + context (promoted from Tier 3)
**Metadata line:** 2024 · Concept · Editorial, UX/UI, Visual Identity
**Recognition:** Fonts in Use

> *Weaponized Innocence* is a newsprint publication examining the use of children in armed conflict, from recruitment and coercion to recovery and reintegration. The publication pairs documentary research with designed information, moving from the realities of child soldiering to the work of organizations like UNICEF in rehabilitation.
>
> Alongside the editorial is *The Pinwheel Project*, an interactive companion piece featuring pinwheels printed with drawings by child survivors and excerpts from Emmanuel Jal and Betty Ejang. The typographic system was recognized by Fonts in Use.

---

### 9. Seek Truth — *CMS current*

**Tier:** Archive/editorial record pending final depth decision
**Metadata line:** 2024 · Concept · Editorial, Visual Identity
**Recognition:** Fonts in Use Feature; ADC Young Ones 2024

> *Seek Truth* is an editorial design project examining state media, surveillance, and censorship in China through a 72-page book and promotional poster system.
>
> The project combines book design, protest-driven image treatment, and public promotional assets, using altered artwork, die-cuts, red paint, tearing, and scanning to frame artists and protestors pushing back against suppression.

---

### 10. Independent Lens — *CMS current*

**Tier:** Archive/editorial record pending final depth decision
**Metadata line:** 2024 · Concept · Editorial, Visual Identity
**Recognition:** Graphis New Talent 2024 Honorable Mention

> *Independent Lens* is a poster and brochure system for the PBS documentary series, translating the program's film lineup into a compact two-color print piece.
>
> The project centers on a 22x33-inch poster that presents ten films, screening dates, and short descriptions. The same system folds into a 12-page French-fold brochure, using red bitmap imagery, blue overprinted typography, and a chronological reading path inspired by projector-like spatial depth and Piet Zwart's layered poster compositions.

---

### 11. TYPLDN — *CMS current*

**Tier:** Archive/editorial record pending final depth decision
**Metadata line:** Concept · Visual Identity, Experience Design

> TYPLDN is a branding project for an international typography and design conference hosted by ATypi.
>
> The identity uses a modified typeface by Wim Crouwel and turns the modular letterforms into a vertical typographic system for digital and physical touchpoints.

---

## 04 — Testimonials

### Placement

Testimonials live in two intended locations. One can go on the AirPods case study page (see Section 03 above). The current Framer `/info` page also includes all three proof quotes in its `WHAT PEOPLE SAY` section.

**Current Framer implementation note:** the May 1 MCP audit found Nadia, Aaron, and Angela testimonials live on `/info`. The planned "Currently" modules and colophon are still not visible in the audited desktop XML.

### /info page testimonials

> "From day one, Micah approached our projects with a thoughtful mindset, consistently delivering beautiful and sometimes surprising results. He's a clear communicator, a strong collaborator, and even helps to find efficient workflows based on the goals of each project."
> — Aaron Barry, Co-founder / ECD, Skycar Creative

> "He has a keen eye, eagerness to learn, and excellent communication skills that set him apart. He even took the time to teach our team new things and introduce new ideas."
> — Angela Wong, Designer / Art Director, Skycar Creative

### Why these excerpts

Each testimonial answers a specific hiring concern:

- **Nadia (Apple, on case study page):** Confirms collaboration and receptiveness to direction. Answers: "Can this person work on a large team at a high-stakes company?"
- **Aaron (Skycar, on `/info` page):** Confirms quality and initiative beyond expected scope. Answers: "Does this person deliver at a professional level?"
- **Angela (Skycar, on `/info` page):** Confirms teaching instinct and communication. Answers: "Will this person elevate the team, not just do their own work?"

---

## 05 — Copy Consistency Rules

Patterns to maintain across all case studies so the portfolio reads as one voice:

1. **First sentence = what the project is.** Not what you did. Not a philosophical statement. What it is, who it's for, and at what scale.
2. **Second sentence or paragraph = what you specifically did.** Clear, active voice, precise deliverables.
3. **No "we" unless the collaboration is the point** (AirPods). Default to "I."
4. **Recognition goes at the end of the opening, not the top.** It's a closing credential, not a headline.
5. **Academic and concept projects are labeled honestly in metadata.** "Concept" for school projects and speculative work. "Self-initiated" for personal projects with real outcomes (Gaia, National Park Playing Cards). The opening paragraph uses framing like "rebrand concept" or "self-initiated reimagining" rather than implying a client engagement that didn't exist.
6. **Numbers are stated flatly.** "20,000 copies across 160 retail locations," not "an impressive 20,000 copies." The number is the rhetoric.
7. **One editorial sentence per opening, maximum.** Each project gets one line where you express a design opinion or frame a tension. More than one and the copy starts performing rather than informing.
8. **No em dashes.** Use commas, periods, or colons instead.

---

## 06 — Status

Core copy decisions remain locked. Simon & Schuster is corrected to "concept." Peak Energy is part of the six-card CMS-backed Home grid and has a WIP-gated bespoke page, but still needs approved case-study copy before public launch. Rejuve, Belly Bar, and WhatsApp now have WIP-gated bespoke shells; WhatsApp is homepage-flagged but remains outside the six-card Home query because its sort order is 17. "Concept" labels are added to school/speculative project metadata. The Framer CMS currently contains 17 real projects and no sample/template projects.

Current live-copy drift to remember: Home uses `AVAILABLE FOR WORK` instead of the planned green-dot/time treatment, and `/info` currently uses a forest-green editorial profile structure with selected experience, testimonials, recognition, and CTA sections rather than the older photo/résumé/currently layout.

**Remaining before build:**
- Pick initial "currently into" items (reading, listening, exploring)
- Resolve National Park Playing Cards store-count copy: older CMS/copy says 160 retail locations, while current `/info` says 220+ stores
- Decide whether Karuna should return to Home or remain an off-Home Tier 2 showcase
- Decide whether Seek Truth, Independent Lens, TYPLDN, Rejuve, Belly Bar, and WhatsApp remain archive records or become dedicated visual showcases
