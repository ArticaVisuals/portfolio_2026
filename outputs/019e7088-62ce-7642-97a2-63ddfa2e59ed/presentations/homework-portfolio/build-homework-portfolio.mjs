import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const WORKSPACE = "/Users/micahhoang/My Drive/Portfolio 2026/outputs/019e7088-62ce-7642-97a2-63ddfa2e59ed/presentations/homework-portfolio";
const ROOT = "/Users/micahhoang/My Drive/Portfolio 2026";
const SLIDES_DIR = path.join(WORKSPACE, "slides");
const PREVIEW_DIR = path.join(WORKSPACE, "preview");
const LAYOUT_DIR = path.join(WORKSPACE, "layout", "final");
const ASSET_DIR = path.join(WORKSPACE, "assets");
const QA_DIR = path.join(WORKSPACE, "qa");
const OUTPUT_DIR = path.join(WORKSPACE, "output");
const FINAL_PPTX = path.join(OUTPUT_DIR, "micah-portfolio-homework-draft.pptx");
const FINAL_PDF = path.join(OUTPUT_DIR, "micah-portfolio-homework-draft.pdf");
const SKILL_DIR = "/Users/micahhoang/.codex/plugins/cache/openai-primary-runtime/presentations/26.521.10419/skills/presentations";
const NODE = "/Users/micahhoang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node";
const PYTHON = "/Users/micahhoang/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
const FFMPEG = "/opt/homebrew/bin/ffmpeg";

const rel = (p) => path.join(ROOT, p);

const theme = {
  bg: "#f4f0e7",
  ink: "#12110f",
  muted: "#5f5a51",
  hairline: "#d7d0c3",
  dark: "#151515",
  light: "#fffaf1",
  projects: {
    gaia: { name: "Gaia", accent: "#337657", bg: "#eef3e7" },
    motion: { name: "Motion Connect", accent: "#3f4bff", bg: "#f1f0ff" },
    simon: { name: "Simon & Schuster", accent: "#f05b34", bg: "#fff0e8" },
    karuna: { name: "Karuna", accent: "#9f681f", bg: "#f7efd8" },
    yomo: { name: "Yomo", accent: "#e54f55", bg: "#fff0ed" },
  },
};

const copy = {
  gaia: {
    metadata: "2026 · Self-initiated · ArtCenter CD5",
    oneLine: "A reimagining of iNaturalist into a more welcoming brand and product system for biodiversity conservation.",
    brief: "iNaturalist is powerful but intimidating. The challenge was to preserve the depth of a citizen-science platform while making the invitation broader, warmer, and easier to enter.",
    strategy: "Rename and reposition the platform as Gaia: a living system where every species, observation, and person belongs to one larger story. The design strategy focused on access, motivation, and meaning.",
    outcome: "Full brand identity, product system, iOS app direction, species/data cards, UI flows, and application touchpoints.",
  },
  motion: {
    metadata: "2025 · ArtCenter · Visual Identity, 2D Motion, Editorial",
    oneLine: "A kinetic event identity for ArtCenter's Motion Connect speaker series.",
    brief: "Motion Connect needed a cohesive identity system that could stretch across talks, social assets, print collateral, speaker graphics, and motion reels.",
    strategy: "Use the joy of 80s arcade graphics as a visual engine: monolithic typography, electric color, bold pacing, and modular motion behaviors that could scale across many deliverables.",
    outcome: "Flexible motion and editorial system supporting social, keynote graphics, print, event photography, and a final motion reel.",
  },
  simon: {
    metadata: "2025 · Concept · Brand Strategy, Visual Identity, UX/UI · Fonts in Use Feature",
    oneLine: "A strategic rebrand concept for Simon & Schuster rooted in independence, editorial openness, and diverse voices.",
    brief: "After the DOJ blocked Penguin Random House's acquisition, Simon & Schuster's independence became a strategic opportunity rather than a neutral business fact.",
    strategy: "Build an identity around editorial openness: a publishing culture that treats controversy as an invitation. The system needed to work across imprints, authors, campaigns, physical touchpoints, and digital experiences.",
    outcome: "Brand strategy, identity system, publication/touchpoint design, motion studies, division and imprint marks, and campaign applications.",
  },
  karuna: {
    metadata: "2025 · Concept · Visual Identity, Packaging, Product",
    oneLine: "A product-line identity for Karuna's Highland Harvests bee-derived goods.",
    brief: "Karuna supports Tai Dam communities in Northern Vietnam through sustainable beekeeping. The product line needed to communicate craft, land, biodiversity, and social enterprise without becoming generic impact branding.",
    strategy: "Center the relationship between people, landscape, bees, and material craft. The visual system balances warm packaging, tactile product photography, pattern, and restrained identity elements.",
    outcome: "Identity, typography, pattern system, packaging, product mockups, and photographic documentation for honey, beeswax candle, and biodegradable wrap.",
  },
  yomo: {
    metadata: "2025 · Concept · Visual Identity, UX/UI, Product",
    oneLine: "A personalized food-navigation platform for people with dietary restrictions.",
    brief: "Dietary restriction tools often feel clinical or fragmented. Yomo needed to connect recipes, restaurants, groceries, and wearable contexts in a way that felt usable every day.",
    strategy: "Create a warm, specific product language: accessible enough for daily food decisions, structured enough to be genuinely useful across mobile, desktop, and smart glasses.",
    outcome: "Visual identity, research framing, personas, wireframes, design system, UI screens, desktop and mobile flows, smart-glasses scenarios, and prototype assets.",
  },
};

const assets = {
  gaia: {
    hero: rel("assets/by-project/gaia/selected/hero-app-overview.png"),
    logo: rel("assets/by-project/gaia/selected/brand-logo.png"),
    system: rel("assets/by-project/gaia/selected/logo-system.png"),
    typeA: rel("assets/by-project/gaia/selected/type-new-spirit.png"),
    typeB: rel("assets/by-project/gaia/selected/type-neue-haas.png"),
    colorsA: rel("assets/by-project/gaia/selected/color-primary.png"),
    colorsB: rel("assets/by-project/gaia/selected/color-secondary.png"),
    icons: rel("assets/by-project/gaia/selected/iconography.png"),
    uiSplash: rel("assets/by-project/gaia/selected/ui-splash.png"),
    uiFind: rel("assets/by-project/gaia/selected/ui-find-expanded.png"),
    uiLog: rel("assets/by-project/gaia/selected/ui-log-grid.png"),
    uiStory: rel("assets/by-project/gaia/selected/ui-story.png"),
    uiImpact: rel("assets/by-project/gaia/selected/ui-profile-impact.png"),
    appBook: rel("assets/by-project/gaia/selected/application-book.png"),
    appFlag: rel("assets/by-project/gaia/selected/application-flag.png"),
    appBillboard: rel("assets/by-project/gaia/selected/application-billboard.png"),
    processA: rel("assets/by-project/gaia/figma-export/gaia-final-deck/contact-sheets/range-01-23.jpg"),
    processB: rel("assets/by-project/gaia/figma-export/gaia-final-deck/contact-sheets/range-24-39.jpg"),
    processC: rel("assets/by-project/gaia/figma-export/gaia-final-deck/contact-sheets/range-40-52.jpg"),
    videoMap: rel("assets/by-project/gaia/selected/map-demo.mp4"),
    videoIdentify: rel("assets/by-project/gaia/selected/identify-demo.mp4"),
    videoSplash: rel("assets/by-project/gaia/selected/splash-demo.mp4"),
  },
  motion: {
    heroVideo: rel("assets/by-project/motion-connect-2025/current-site/022-motion-connect_1.mp4"),
    horizontal: rel("assets/by-project/motion-connect-2025/current-site/023-motionconnect_horizontalmockup_mini.png"),
    vertical: rel("assets/by-project/motion-connect-2025/current-site/024-motionconnect_verticalmockup_mini.png"),
    eventA: rel("assets/by-project/motion-connect-2025/current-site/025-event-photos-469a1844-edit.png"),
    eventB: rel("assets/by-project/motion-connect-2025/current-site/027-469a1919.png"),
    eventC: rel("assets/by-project/motion-connect-2025/current-site/028-469a1724.png"),
    eventD: rel("assets/by-project/motion-connect-2025/current-site/029-469a1874-edit.png"),
    process: rel("assets/by-project/motion-connect-2025/current-site/030-after-effects-process-video.mp4"),
    social: rel("assets/by-project/motion-connect-2025/current-site/031-social-articavisuals-zoom_1_1.mp4"),
    typeMotion: rel("assets/by-project/motion-connect-2025/current-site/032-monolithic-metallic-text-animation.mp4"),
    screenshot: rel("assets/by-project/motion-connect-2025/current-site/033-screenshot-2026-01-07-at-10.36.35pm.png"),
    clip1: rel("assets/by-project/motion-connect-2025/current-site/001-clip1.mp4"),
    clip4: rel("assets/by-project/motion-connect-2025/current-site/004-clip4.mp4"),
    clip8: rel("assets/by-project/motion-connect-2025/current-site/008-clip8.mp4"),
    slide2: rel("assets/by-project/motion-connect-2025/current-site/011-slide-2_2.mp4"),
  },
  simon: {
    hero: rel("assets/by-project/simon-schuster/current-site/001-s-s-thumbnail-image.png"),
    research: rel("assets/by-project/simon-schuster/current-site/002-research.png"),
    cover: rel("assets/by-project/simon-schuster/current-site/003-simon_and_schuster_cover.png"),
    frame2: rel("assets/by-project/simon-schuster/current-site/004-frame-2.png"),
    frame3: rel("assets/by-project/simon-schuster/current-site/005-frame-3.png"),
    manifestoA: rel("assets/by-project/simon-schuster/current-site/006-brand-manifesto-mockup.png"),
    manifestoB: rel("assets/by-project/simon-schuster/current-site/007-brand-manifesto-mockup.png"),
    logoMotion: rel("assets/by-project/simon-schuster/current-site/008-s-s-logo-animation-2.mp4"),
    layer: rel("assets/by-project/simon-schuster/current-site/009-layer-1.png"),
    authorMarks: rel("assets/by-project/simon-schuster/current-site/010-author-marks.png"),
    bookA: rel("assets/by-project/simon-schuster/current-site/011-cd4-book_0063__dsc4205.jpg"),
    bookB: rel("assets/by-project/simon-schuster/current-site/034-cd4-book_0003__dsc4596.jpg"),
    postcard: rel("assets/by-project/simon-schuster/current-site/081-postcard.png"),
    tape: rel("assets/by-project/simon-schuster/current-site/082-simon-schuster-tape.png"),
    banner: rel("assets/by-project/simon-schuster/current-site/085-simon-schuster-banner.png"),
    hierarchy: rel("assets/by-project/simon-schuster/current-site/089-brand-hierarchy.mp4"),
    divisions: rel("assets/by-project/simon-schuster/current-site/090-division-marks.png"),
    imprints: rel("assets/by-project/simon-schuster/current-site/091-imprint-marks.png"),
    voyager: rel("assets/by-project/simon-schuster/current-site/093-voyager-imprint.png"),
    banned: rel("assets/by-project/simon-schuster/current-site/095-banned-books-posters.png"),
    forbidden: rel("assets/by-project/simon-schuster/current-site/096-uncover-forbidden-stories.png"),
    release: rel("assets/by-project/simon-schuster/current-site/098-book-release-posters.mp4"),
    poster100: rel("assets/by-project/simon-schuster/current-site/099-100-years-poster.png"),
  },
  karuna: {
    hero: rel("assets/by-project/karuna/current-site/001-untitled-1.png"),
    backgroundA: rel("assets/by-project/karuna/current-site/002-background-1.png"),
    backgroundB: rel("assets/by-project/karuna/current-site/003-background-2.png"),
    backgroundC: rel("assets/by-project/karuna/current-site/004-background-3.png"),
    backgroundD: rel("assets/by-project/karuna/current-site/005-background-4.png"),
    wordmark: rel("assets/by-project/karuna/current-site/006-wordmark.png"),
    logomark: rel("assets/by-project/karuna/current-site/007-logomark.png"),
    type: rel("assets/by-project/karuna/current-site/008-typography.png"),
    patterns: rel("assets/by-project/karuna/current-site/009-patterns.png"),
    honeyA: rel("assets/by-project/karuna/current-site/011-honey-2.png"),
    honeyB: rel("assets/by-project/karuna/current-site/012-honey-3.png"),
    candle: rel("assets/by-project/karuna/current-site/015-candle-2.png"),
    wrapA: rel("assets/by-project/karuna/current-site/016-bees-wrap-1.png"),
    wrapB: rel("assets/by-project/karuna/current-site/017-bees-wrap-2.png"),
    wrapC: rel("assets/by-project/karuna/current-site/018-bees-wrap-3.png"),
    photoA: rel("assets/by-project/karuna/current-site/020-_dsc0406-edit-2.jpg"),
    photoB: rel("assets/by-project/karuna/current-site/021-_dsc0443-2.jpg"),
    photoC: rel("assets/by-project/karuna/current-site/026-_dsc0453-edit-4.jpg"),
    photoD: rel("assets/by-project/karuna/current-site/027-_dsc0335-edit-2.jpg"),
    productA: rel("assets/by-project/karuna/current-site/028-untitled-7.png"),
    processVideo: rel("assets/by-project/karuna/current-site/030-img_0581.mov"),
    deviceVideo: rel("assets/by-project/karuna/current-site/031-img_0694-apple-devices-hd-best-quality.m4v"),
    docA: rel("assets/by-project/karuna/current-site/032-img_0587.jpg"),
    docB: rel("assets/by-project/karuna/current-site/033-img_0591.jpg"),
    docC: rel("assets/by-project/karuna/current-site/034-img_0586.jpg"),
  },
  yomo: {
    hero: rel("assets/by-project/yomo/current-site/001-yomo-hero-image-2.jpg"),
    research: rel("assets/by-project/yomo/current-site/002-research.png"),
    persona: rel("assets/by-project/yomo/current-site/003-persona.png"),
    desktopVideo: rel("assets/by-project/yomo/current-site/004-desktop-interaction-1_1.mp4"),
    phoneA: rel("assets/by-project/yomo/current-site/005-yomo-phone-mockup.png"),
    cava: rel("assets/by-project/yomo/current-site/006-cava-flat-phone.png"),
    frame: rel("assets/by-project/yomo/current-site/007-frame-1171276399.png"),
    phoneB: rel("assets/by-project/yomo/current-site/008-yomo-phone-mockup-2.png"),
    eatOut: rel("assets/by-project/yomo/current-site/009-eat-out-flat-phone.png"),
    recipes: rel("assets/by-project/yomo/current-site/010-recipe-list-ui.png"),
    glassesA: rel("assets/by-project/yomo/current-site/011-smart-glasses-1.png"),
    glassesB: rel("assets/by-project/yomo/current-site/012-smart-glasses-2.png"),
    glassesC: rel("assets/by-project/yomo/current-site/013-smart-glasses-3.png"),
    compVideo: rel("assets/by-project/yomo/current-site/014-comp-1.mp4"),
    phoneC: rel("assets/by-project/yomo/current-site/015-phone-mockup-3.png"),
    systemA: rel("assets/by-project/yomo/current-site/016-design-system.png"),
    logo: rel("assets/by-project/yomo/current-site/017-logo.png"),
    type: rel("assets/by-project/yomo/current-site/018-retail-typeface.png"),
    systemB: rel("assets/by-project/yomo/current-site/019-design-system-2.png"),
    scenario: rel("assets/by-project/yomo/current-site/020-scenario.png"),
    structure: rel("assets/by-project/yomo/current-site/021-structure-research.png"),
    wireframes: rel("assets/by-project/yomo/current-site/022-wireframes.png"),
    logoMock: rel("assets/by-project/yomo/current-site/023-yomo-logo-mockup.png"),
    ad: rel("assets/by-project/yomo/current-site/024-yomo-ad.png"),
  },
};

const projectOrder = ["gaia", "motion", "simon", "karuna", "yomo"];

function slide(type, spec) {
  return { type, ...spec };
}

const slides = [
  slide("cover", {
    title: "Selected Projects",
    subtitle: "Portfolio PDF draft · 5 projects · Introduction, process, and outcomes",
    images: [assets.gaia.hero, assets.simon.hero, assets.yomo.hero],
  }),
  slide("contents", {
    title: "Project Map",
    items: projectOrder.map((id, index) => ({ index: index + 1, id, ...copy[id] })),
  }),
  slide("statement", {
    title: "Editorial Spine",
    body: [
      "This submission is structured as a portfolio process book rather than a loose compilation of final boards.",
      "Each project opens with the brief and strategic approach, moves through evidence of exploration and development, and closes with outcomes or current-state documentation.",
      "The draft uses existing case-study copy and local project assets so the Figma refinement pass can focus on curation, pacing, and visual polish.",
    ],
  }),
];

function addProject(id, list) {
  const p = theme.projects[id];
  const c = copy[id];
  const a = assets[id];
  list.push(
    slide("projectDivider", {
      id,
      project: p.name,
      title: p.name,
      subtitle: c.oneLine,
      metadata: c.metadata,
      image: a.hero || a.heroVideo,
    }),
    slide("split", {
      id,
      stage: "Introduction",
      title: "Brief / Challenge",
      body: c.brief,
      image: introImage(id, a),
    }),
    slide("split", {
      id,
      stage: "Introduction",
      title: "Conceptual / Strategic Approach",
      body: c.strategy,
      image: strategyImage(id, a),
      reverse: true,
    }),
    ...projectProcessSlides(id, a),
    ...projectOutcomeSlides(id, a),
    slide("reflection", {
      id,
      stage: "Outcomes",
      title: "Outcome + Documentation",
      body: c.outcome,
      bullets: reflectionBullets(id),
      image: finalImage(id, a),
    }),
  );
}

function introImage(id, a) {
  return ({
    gaia: a.processA,
    motion: a.eventA,
    simon: a.research,
    karuna: a.backgroundA,
    yomo: a.research,
  })[id];
}

function strategyImage(id, a) {
  return ({
    gaia: a.logo,
    motion: a.screenshot,
    simon: a.frame2,
    karuna: a.wordmark,
    yomo: a.persona,
  })[id];
}

function finalImage(id, a) {
  return ({
    gaia: a.appBillboard,
    motion: a.heroVideo,
    simon: a.poster100,
    karuna: a.productA,
    yomo: a.ad,
  })[id];
}

function reflectionBullets(id) {
  return ({
    gaia: ["Renaming and identity system tied to product strategy", "UI work mapped to access, motivation, and meaning", "Prototype/app documentation can be expanded in Figma"],
    motion: ["System designed for repeated speaker/event use", "Motion stills stand in for video in the PDF", "Figma pass should choose whether to embed original clips"],
    simon: ["Concept framed honestly as speculative academic work", "Strongest evidence is the breadth of brand-system applications", "Recognition note can be moved earlier if needed"],
    karuna: ["Packaging and product photography carry the outcome section", "Process can be expanded with sketches or material tests", "Social-impact context should stay concise and specific"],
    yomo: ["Clear UX arc from research to wearable scenarios", "Design-system slides support maintainability", "Current draft works as mid-term / in-progress documentation"],
  })[id];
}

function projectProcessSlides(id, a) {
  if (id === "gaia") {
    return [
      slide("mosaic", { id, stage: "Process", title: "Research + Exploration Evidence", body: "The Gaia source deck already contains a long exploration arc. These contact sheets preserve breadth while keeping the assignment PDF under 100 pages.", images: [a.processA, a.processB, a.processC] }),
      slide("mosaic", { id, stage: "Process", title: "Identity System Development", body: "Logo, typography, color, and iconography become the connective tissue between brand story and product behavior.", images: [a.system, a.typeA, a.typeB, a.colorsA, a.colorsB, a.icons] }),
      slide("mosaic", { id, stage: "Process", title: "Prototype Behaviors", body: "Motion-heavy app moments are represented as still frames here; the source videos remain available for a Figma Slides refinement pass.", images: [a.videoSplash, a.videoIdentify, a.videoMap] }),
    ];
  }
  if (id === "motion") {
    return [
      slide("mosaic", { id, stage: "Process", title: "Kinetic Language Tests", body: "The system is built from motion studies, typographic weight, and fast color shifts rather than a static logo-first identity.", images: [a.clip1, a.clip4, a.clip8, a.slide2] }),
      slide("mosaic", { id, stage: "Process", title: "After Effects + Social Development", body: "Process evidence includes working files, zoomed social artifacts, and typographic animation tests.", images: [a.process, a.social, a.typeMotion, a.screenshot] }),
      slide("mosaic", { id, stage: "Process", title: "Event Environment", body: "The identity had to survive outside the screen: speaker graphics, venue photography, and social recap material all had to feel related.", images: [a.eventA, a.eventB, a.eventC, a.eventD] }),
    ];
  }
  if (id === "simon") {
    return [
      slide("mosaic", { id, stage: "Process", title: "Strategic Context + Early Framing", body: "The project begins with the business context and uses that opening to build a sharper argument for independence and editorial openness.", images: [a.research, a.cover, a.frame2, a.frame3] }),
      slide("mosaic", { id, stage: "Process", title: "Manifesto + Mark System", body: "The system moves from core idea to typographic tone, identity language, and author-facing expression.", images: [a.manifestoA, a.manifestoB, a.logoMotion, a.layer, a.authorMarks] }),
      slide("mosaic", { id, stage: "Process", title: "Hierarchy + Imprints", body: "Development extends into division, imprint, and author marks so the identity can support a complex publishing house.", images: [a.hierarchy, a.divisions, a.imprints, a.voyager] }),
    ];
  }
  if (id === "karuna") {
    return [
      slide("mosaic", { id, stage: "Process", title: "Material + Place", body: "The direction is grounded in landscape, warm materiality, and product photography rather than generic social-enterprise cues.", images: [a.backgroundA, a.backgroundB, a.backgroundC, a.backgroundD] }),
      slide("mosaic", { id, stage: "Process", title: "Identity Ingredients", body: "Typography, logomark, wordmark, and pattern studies establish the kit-of-parts for the product line.", images: [a.wordmark, a.logomark, a.type, a.patterns] }),
      slide("mosaic", { id, stage: "Process", title: "Product Set Development", body: "The product family covers honey, beeswax candle, and food wrap, with a visual system flexible enough for each format.", images: [a.honeyA, a.honeyB, a.candle, a.wrapA, a.wrapB, a.wrapC] }),
    ];
  }
  return [
    slide("mosaic", { id, stage: "Process", title: "Research + User Model", body: "Yomo's process starts with restrictions, persona needs, and the structure of food decisions across contexts.", images: [a.research, a.persona, a.structure, a.scenario] }),
    slide("mosaic", { id, stage: "Process", title: "Wireframes + System", body: "The product language becomes useful when research turns into repeatable UI patterns and interaction states.", images: [a.wireframes, a.systemA, a.systemB, a.logo, a.type] }),
    slide("mosaic", { id, stage: "Process", title: "Prototype + Interaction Studies", body: "Desktop and mobile motion tests are reduced to stills for the PDF; the videos remain source material for the Figma deck.", images: [a.desktopVideo, a.compVideo, a.frame] }),
  ];
}

function projectOutcomeSlides(id, a) {
  if (id === "gaia") {
    return [
      slide("mosaic", { id, stage: "Outcomes", title: "Core App Screens", body: "The final product direction combines onboarding, finding, logging, storytelling, and profile impact into one coherent iOS experience.", images: [a.uiSplash, a.uiFind, a.uiLog, a.uiStory, a.uiImpact] }),
      slide("mosaic", { id, stage: "Outcomes", title: "Brand Applications", body: "The system expands beyond the app into print and environmental applications.", images: [a.appBook, a.appFlag, a.appBillboard] }),
    ];
  }
  if (id === "motion") {
    return [
      slide("mosaic", { id, stage: "Outcomes", title: "Campaign Deliverables", body: "Horizontal and vertical mockups show how the identity translates into campaign-facing assets.", images: [a.horizontal, a.vertical, a.heroVideo] }),
      slide("mosaic", { id, stage: "Outcomes", title: "Documentation + Live Context", body: "Event photos document the identity in use and give the final system a community context.", images: [a.eventA, a.eventB, a.eventC, a.eventD] }),
    ];
  }
  if (id === "simon") {
    return [
      slide("mosaic", { id, stage: "Outcomes", title: "Publication + Physical Touchpoints", body: "The identity is tested across books, postcards, tape, banners, apparel, and environment.", images: [a.bookA, a.bookB, a.postcard, a.tape, a.banner] }),
      slide("mosaic", { id, stage: "Outcomes", title: "Campaign Applications", body: "Poster systems and campaign work show how the brand can participate in cultural conversation.", images: [a.banned, a.forbidden, a.release, a.poster100] }),
    ];
  }
  if (id === "karuna") {
    return [
      slide("mosaic", { id, stage: "Outcomes", title: "Packaging + Product Family", body: "The final family needs to read as one ecosystem while letting each product remain clear.", images: [a.honeyA, a.candle, a.wrapA, a.wrapB, a.productA] }),
      slide("mosaic", { id, stage: "Outcomes", title: "Photographic Documentation", body: "Final photography provides scale, tactility, and the proof that the packaging can live in the world.", images: [a.photoA, a.photoB, a.photoC, a.photoD, a.docA, a.docB, a.docC] }),
    ];
  }
  return [
    slide("mosaic", { id, stage: "Outcomes", title: "Mobile + Desktop Product", body: "Yomo connects food restrictions to recipes, restaurants, grocery decisions, and cross-device use.", images: [a.hero, a.phoneA, a.phoneB, a.phoneC, a.eatOut, a.recipes, a.cava] }),
    slide("mosaic", { id, stage: "Outcomes", title: "Smart Glasses + Brand Applications", body: "The concept extends into wearable guidance and brand-facing touchpoints.", images: [a.glassesA, a.glassesB, a.glassesC, a.logoMock, a.ad] }),
  ];
}

for (const id of projectOrder) addProject(id, slides);

slides.push(
  slide("closing", {
    title: "Submission Notes",
    body: [
      "This draft is intentionally editable: text is live in PowerPoint, and image placements are separated by slide.",
      "For Figma Slides, import the PPTX, review type conversion, then replace still frames with the original videos where motion is essential.",
      "The final PDF can be exported from Figma Slides once the visual refinement pass is complete.",
    ],
  }),
);

function isVideo(filePath) {
  return /\.(mp4|mov|m4v|gif)$/i.test(filePath);
}

function slugAsset(filePath, index, ext = ".jpg") {
  const base = path.basename(filePath).replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${String(index + 1).padStart(3, "0")}-${base}${ext}`;
}

function collectAssets(value, out = []) {
  if (!value) return out;
  if (typeof value === "string" && fsSync.existsSync(value)) {
    out.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectAssets(item, out));
  } else if (typeof value === "object") {
    Object.values(value).forEach((item) => collectAssets(item, out));
  }
  return out;
}

async function prepareAssets() {
  const sourceAssets = Array.from(new Set(collectAssets(slides)));
  const frameDir = path.join(ASSET_DIR, "frames");
  const preparedDir = path.join(ASSET_DIR, "prepared");
  await fs.mkdir(frameDir, { recursive: true });
  await fs.mkdir(preparedDir, { recursive: true });
  const frameInputs = [];

  sourceAssets.forEach((asset, index) => {
    if (!isVideo(asset)) return;
    const out = path.join(frameDir, slugAsset(asset, index, ".jpg"));
    if (!fsSync.existsSync(out)) {
      const result = spawnSync(
        FFMPEG,
        [
          "-y",
          "-hide_banner",
          "-loglevel",
          "error",
          "-ss",
          "00:00:01.000",
          "-i",
          asset,
          "-frames:v",
          "1",
          "-vf",
          "scale='min(2200,iw)':-2",
          out,
        ],
        { encoding: "utf8" },
      );
      if (result.status !== 0) {
        console.warn(`ffmpeg failed for ${asset}: ${result.stderr || result.stdout}`);
      }
    }
    if (fsSync.existsSync(out)) frameInputs.push({ source: asset, frame: out });
  });

  const normalAssets = sourceAssets.map((asset) => {
    const frame = frameInputs.find((entry) => entry.source === asset)?.frame;
    return { source: asset, input: frame || asset };
  });

  const manifestPath = path.join(ASSET_DIR, "prepare-input.json");
  await fs.writeFile(manifestPath, JSON.stringify(normalAssets, null, 2));
  const py = String.raw`
import json, os, sys
from PIL import Image, ImageOps

manifest_path, out_dir = sys.argv[1], sys.argv[2]
with open(manifest_path, "r", encoding="utf-8") as f:
    rows = json.load(f)

result = {}
for idx, row in enumerate(rows):
    src = row["source"]
    inp = row["input"]
    name = os.path.splitext(os.path.basename(inp))[0]
    safe = "".join(ch.lower() if ch.isalnum() else "-" for ch in name).strip("-")
    out = os.path.join(out_dir, f"{idx+1:03d}-{safe}.jpg")
    try:
        im = Image.open(inp)
        im = ImageOps.exif_transpose(im)
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA")
        if im.mode == "RGBA":
            bg = Image.new("RGBA", im.size, (244, 240, 231, 255))
            bg.alpha_composite(im)
            im = bg.convert("RGB")
        else:
            im = im.convert("RGB")
        im.thumbnail((2200, 2200), Image.Resampling.LANCZOS)
        im.save(out, "JPEG", quality=88, optimize=True, progressive=True)
        result[src] = out
    except Exception as exc:
        print(f"prepare failed for {inp}: {exc}", file=sys.stderr)
        result[src] = inp

print(json.dumps(result, indent=2))
`;

  const prep = spawnSync(PYTHON, ["-c", py, manifestPath, preparedDir], { encoding: "utf8" });
  if (prep.status !== 0) {
    throw new Error(`Asset preparation failed:\n${prep.stdout}\n${prep.stderr}`);
  }
  return JSON.parse(prep.stdout);
}

function mapAssets(value, assetMap) {
  if (!value) return value;
  if (typeof value === "string") return assetMap[value] || value;
  if (Array.isArray(value)) return value.map((item) => mapAssets(item, assetMap));
  if (typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, mapAssets(item, assetMap)]));
  }
  return value;
}

async function writeSlideModules(preparedSlides) {
  await fs.rm(SLIDES_DIR, { recursive: true, force: true });
  await fs.mkdir(SLIDES_DIR, { recursive: true });

  const specsSource = `export const theme = ${JSON.stringify(theme, null, 2)};\nexport const specs = ${JSON.stringify(preparedSlides, null, 2)};\n`;
  await fs.writeFile(path.join(SLIDES_DIR, "specs.mjs"), specsSource, "utf8");

  const helperSource = String.raw`
import fs from "node:fs/promises";
import { theme } from "./specs.mjs";

const W = 1280;
const H = 720;
const margin = 58;
const font = "Inter";

async function dataUrl(filePath) {
  const ext = filePath.toLowerCase().endsWith(".png") ? "png" : "jpeg";
  const buf = await fs.readFile(filePath);
  return "data:image/" + ext + ";base64," + buf.toString("base64");
}

function projectTheme(id) {
  return theme.projects[id] || { accent: theme.ink, bg: theme.bg, name: "" };
}

function shape(slide, position, fill = { type: "none" }, line = { width: 0, fill: theme.bg }) {
  return slide.shapes.add({ geometry: "rect", position, fill, line });
}

function addText(slide, text, position, style = {}) {
  const s = shape(slide, position, { type: "none" }, { width: 0, fill: theme.bg });
  s.text.style = {
    typeface: font,
    fontSize: style.size ?? 28,
    color: style.color ?? theme.ink,
    bold: style.bold ?? false,
    italic: style.italic ?? false,
    alignment: style.align ?? "left",
    verticalAlignment: style.valign ?? "top",
  };
  s.text = Array.isArray(text) ? text.join("\n") : String(text || "");
  return s;
}

function addPill(slide, text, x, y, color, textColor = theme.light) {
  shape(slide, { left: x, top: y, width: 220, height: 34 }, { type: "solid", color }, { width: 0, fill: color });
  addText(slide, text, { left: x + 14, top: y + 7, width: 192, height: 20 }, { size: 13, color: textColor, bold: true });
}

function bg(slide, color = theme.bg) {
  shape(slide, { left: 0, top: 0, width: W, height: H }, { type: "solid", color }, { width: 0, fill: color });
}

function header(slide, spec) {
  const pt = projectTheme(spec.id);
  const label = [pt.name, spec.stage].filter(Boolean).join(" / ");
  addText(slide, label, { left: margin, top: 26, width: 600, height: 22 }, { size: 13, color: theme.muted, bold: true });
  shape(slide, { left: margin, top: 55, width: W - margin * 2, height: 1 }, { type: "solid", color: theme.hairline }, { width: 0, fill: theme.hairline });
  shape(slide, { left: margin, top: 55, width: 138, height: 3 }, { type: "solid", color: pt.accent }, { width: 0, fill: pt.accent });
}

async function addImage(slide, filePath, position, fit = "cover", alt = "") {
  if (!filePath) return null;
  try {
    const image = slide.images.add({
      dataUrl: await dataUrl(filePath),
      alt,
      position,
      fit,
    });
    return image;
  } catch {
    const box = shape(slide, position, { type: "solid", color: "#e5e0d6" }, { width: 0, fill: "#e5e0d6" });
    box.text.style = { typeface: font, fontSize: 14, color: theme.muted, alignment: "center", verticalAlignment: "middle" };
    box.text = "Missing asset";
    return box;
  }
}

function bullets(slide, items, x, y, width, color = theme.ink) {
  const text = items.map((item) => "• " + item).join("\n");
  return addText(slide, text, { left: x, top: y, width, height: Math.max(80, items.length * 36) }, { size: 22, color });
}

async function cover(slide, spec) {
  bg(slide, theme.dark);
  const frames = [
    { left: 692, top: 62, width: 236, height: 596 },
    { left: 940, top: 116, width: 248, height: 238 },
    { left: 940, top: 374, width: 248, height: 238 },
  ];
  for (let i = 0; i < Math.min(spec.images.length, frames.length); i++) {
    await addImage(slide, spec.images[i], frames[i], "cover", "portfolio project image");
  }
  shape(slide, { left: 58, top: 70, width: 110, height: 6 }, { type: "solid", color: "#f05b34" }, { width: 0, fill: "#f05b34" });
  addText(slide, spec.title, { left: 58, top: 138, width: 560, height: 154 }, { size: 72, color: theme.light, bold: true });
  addText(slide, spec.subtitle, { left: 62, top: 333, width: 540, height: 80 }, { size: 23, color: "#d4cab8" });
  addText(slide, "Micah Hoang", { left: 62, top: 596, width: 300, height: 36 }, { size: 24, color: theme.light, bold: true });
  addText(slide, "Homework compilation draft", { left: 62, top: 632, width: 360, height: 28 }, { size: 15, color: "#a99f91" });
}

async function contents(slide, spec) {
  bg(slide);
  addText(slide, spec.title, { left: margin, top: 64, width: 480, height: 62 }, { size: 52, bold: true });
  addText(slide, "Five selected projects, each organized by introduction, process, and outcomes.", { left: margin, top: 134, width: 540, height: 48 }, { size: 20, color: theme.muted });
  const startY = 225;
  for (let i = 0; i < spec.items.length; i++) {
    const item = spec.items[i];
    const pt = projectTheme(item.id);
    const y = startY + i * 78;
    addText(slide, String(item.index).padStart(2, "0"), { left: 64, top: y, width: 54, height: 34 }, { size: 21, color: pt.accent, bold: true });
    addText(slide, pt.name, { left: 130, top: y - 4, width: 270, height: 34 }, { size: 26, bold: true });
    addText(slide, item.metadata, { left: 410, top: y + 1, width: 530, height: 26 }, { size: 15, color: theme.muted });
    addText(slide, item.oneLine, { left: 130, top: y + 33, width: 870, height: 28 }, { size: 16, color: theme.muted });
    shape(slide, { left: 1060, top: y + 10, width: 96, height: 16 }, { type: "solid", color: pt.accent }, { width: 0, fill: pt.accent });
  }
}

async function statement(slide, spec) {
  bg(slide, "#f8f5ef");
  addText(slide, spec.title, { left: margin, top: 64, width: 520, height: 66 }, { size: 54, bold: true });
  let y = 188;
  for (const paragraph of spec.body) {
    addText(slide, paragraph, { left: margin, top: y, width: 810, height: 74 }, { size: 26, color: theme.ink });
    y += 116;
  }
  shape(slide, { left: 972, top: 100, width: 140, height: 500 }, { type: "solid", color: "#151515" }, { width: 0, fill: "#151515" });
  addText(slide, "Intro\nProcess\nOutcomes", { left: 1000, top: 172, width: 110, height: 280 }, { size: 28, color: theme.light, bold: true });
}

async function projectDivider(slide, spec) {
  const pt = projectTheme(spec.id);
  bg(slide, pt.bg);
  shape(slide, { left: 0, top: 0, width: 32, height: H }, { type: "solid", color: pt.accent }, { width: 0, fill: pt.accent });
  await addImage(slide, spec.image, { left: 690, top: 0, width: 590, height: 720 }, "cover", spec.project);
  addText(slide, spec.project, { left: 70, top: 96, width: 530, height: 90 }, { size: 68, bold: true, color: theme.ink });
  addText(slide, spec.metadata, { left: 76, top: 198, width: 560, height: 26 }, { size: 15, bold: true, color: pt.accent });
  addText(slide, spec.subtitle, { left: 76, top: 288, width: 520, height: 132 }, { size: 28, color: theme.ink });
  addPill(slide, "Introduction", 76, 564, pt.accent);
  addPill(slide, "Process", 306, 564, pt.accent);
  addPill(slide, "Outcomes", 536, 564, pt.accent);
}

async function split(slide, spec) {
  const pt = projectTheme(spec.id);
  bg(slide);
  header(slide, spec);
  const imagePos = spec.reverse
    ? { left: margin, top: 112, width: 498, height: 530 }
    : { left: 724, top: 112, width: 498, height: 530 };
  const textX = spec.reverse ? 638 : margin;
  await addImage(slide, spec.image, imagePos, "cover", spec.title);
  addText(slide, spec.title, { left: textX, top: 122, width: 540, height: 86 }, { size: 46, bold: true });
  addText(slide, spec.body, { left: textX + 2, top: 236, width: 520, height: 260 }, { size: 25, color: theme.ink });
  shape(slide, { left: textX + 2, top: 540, width: 132, height: 6 }, { type: "solid", color: pt.accent }, { width: 0, fill: pt.accent });
}

async function mosaic(slide, spec) {
  const pt = projectTheme(spec.id);
  bg(slide);
  header(slide, spec);
  addText(slide, spec.title, { left: margin, top: 84, width: 550, height: 94 }, { size: 35, bold: true });
  addText(slide, spec.body, { left: margin, top: 190, width: 486, height: 128 }, { size: 18, color: theme.muted });
  shape(slide, { left: margin, top: 344, width: 120, height: 5 }, { type: "solid", color: pt.accent }, { width: 0, fill: pt.accent });
  const images = spec.images || [];
  const layout = imageLayout(images.length);
  for (let i = 0; i < images.length; i++) {
    await addImage(slide, images[i], layout[i], i === 0 && images.length <= 3 ? "cover" : "contain", spec.title);
  }
}

function imageLayout(count) {
  if (count <= 3) {
    return [
      { left: 584, top: 96, width: 638, height: 392 },
      { left: 584, top: 506, width: 306, height: 126 },
      { left: 916, top: 506, width: 306, height: 126 },
    ].slice(0, count);
  }
  if (count <= 5) {
    return [
      { left: 552, top: 96, width: 314, height: 250 },
      { left: 886, top: 96, width: 314, height: 250 },
      { left: 552, top: 366, width: 204, height: 266 },
      { left: 774, top: 366, width: 204, height: 266 },
      { left: 996, top: 366, width: 204, height: 266 },
    ].slice(0, count);
  }
  return [
    { left: 536, top: 92, width: 220, height: 168 },
    { left: 774, top: 92, width: 220, height: 168 },
    { left: 1012, top: 92, width: 220, height: 168 },
    { left: 536, top: 282, width: 220, height: 168 },
    { left: 774, top: 282, width: 220, height: 168 },
    { left: 1012, top: 282, width: 220, height: 168 },
    { left: 536, top: 472, width: 220, height: 168 },
    { left: 774, top: 472, width: 220, height: 168 },
    { left: 1012, top: 472, width: 220, height: 168 },
  ].slice(0, count);
}

async function reflection(slide, spec) {
  const pt = projectTheme(spec.id);
  bg(slide, pt.bg);
  header(slide, spec);
  addText(slide, spec.title, { left: margin, top: 96, width: 520, height: 62 }, { size: 42, bold: true });
  addText(slide, spec.body, { left: margin, top: 182, width: 520, height: 122 }, { size: 22, color: theme.ink });
  bullets(slide, spec.bullets || [], margin, 352, 514, theme.ink);
  await addImage(slide, spec.image, { left: 690, top: 96, width: 488, height: 516 }, "contain", spec.title);
  shape(slide, { left: 646, top: 96, width: 10, height: 516 }, { type: "solid", color: pt.accent }, { width: 0, fill: pt.accent });
}

async function closing(slide, spec) {
  bg(slide, theme.dark);
  addText(slide, spec.title, { left: margin, top: 86, width: 600, height: 70 }, { size: 54, bold: true, color: theme.light });
  let y = 206;
  for (const paragraph of spec.body) {
    addText(slide, paragraph, { left: margin, top: y, width: 780, height: 76 }, { size: 25, color: "#e8dfcf" });
    y += 108;
  }
  shape(slide, { left: 956, top: 102, width: 166, height: 470 }, { type: "solid", color: "#f05b34" }, { width: 0, fill: "#f05b34" });
  addText(slide, "PDF\nPPTX\nFigma", { left: 988, top: 170, width: 120, height: 240 }, { size: 36, bold: true, color: theme.light });
}

export async function buildSlide(presentation, ctx, spec) {
  const slide = presentation.slides.add();
  if (spec.type === "cover") await cover(slide, spec);
  else if (spec.type === "contents") await contents(slide, spec);
  else if (spec.type === "statement") await statement(slide, spec);
  else if (spec.type === "projectDivider") await projectDivider(slide, spec);
  else if (spec.type === "split") await split(slide, spec);
  else if (spec.type === "mosaic") await mosaic(slide, spec);
  else if (spec.type === "reflection") await reflection(slide, spec);
  else if (spec.type === "closing") await closing(slide, spec);
  return slide;
}
`;
  await fs.writeFile(path.join(SLIDES_DIR, "helpers.mjs"), helperSource, "utf8");

  for (let i = 0; i < preparedSlides.length; i++) {
    const n = String(i + 1).padStart(2, "0");
    const moduleSource = `import { specs } from "./specs.mjs";\nimport { buildSlide } from "./helpers.mjs";\n\nexport async function slide${n}(presentation, ctx) {\n  return buildSlide(presentation, ctx, specs[${i}]);\n}\n`;
    await fs.writeFile(path.join(SLIDES_DIR, `slide-${n}.mjs`), moduleSource, "utf8");
  }
}

async function writePlanningFiles() {
  const sourceNotes = [
    "Task mode: create",
    "Primary deck profile: consumer-retail / image-led portfolio process book",
    "Deliverable: editable PPTX source plus raster PDF submission draft",
    "",
    "Source materials:",
    "- portfolio-copy-v2.md for locked case-study copy",
    "- assets/by-project/<slug>/current-site for current portfolio imagery",
    "- assets/by-project/gaia/selected and figma-export/gaia-final-deck for Gaia source material",
    "",
    "Known constraints:",
    "- Figma write/create tools were not exposed in this session.",
    "- Figma Slides can import PPTX, but Figma may convert fonts to Inter and omit videos.",
    "- Video assets are represented by still frames in this PDF draft.",
  ].join("\n");
  const contactSheetPlan = [
    "Contact sheet plan:",
    "- Cover with image rail",
    "- Project map list",
    "- Editorial statement",
    "- Project divider with full-height image",
    "- Split text/image intro slides",
    "- Mosaic process slides",
    "- Mosaic outcome slides",
    "- Reflection / documentation slide",
    "- Closing import/export notes",
  ].join("\n");
  await fs.writeFile(path.join(WORKSPACE, "source-notes.txt"), sourceNotes + "\n", "utf8");
  await fs.writeFile(path.join(WORKSPACE, "contact-sheet-plan.txt"), contactSheetPlan + "\n", "utf8");
  await fs.writeFile(path.join(WORKSPACE, "profile-plan.txt"), sourceNotes + "\n\n" + contactSheetPlan + "\n", "utf8");
}

async function buildDeck() {
  const result = spawnSync(
    NODE,
    [
      path.join(SKILL_DIR, "scripts", "build_artifact_deck.mjs"),
      "--workspace",
      WORKSPACE,
      "--slides-dir",
      SLIDES_DIR,
      "--out",
      FINAL_PPTX,
      "--preview-dir",
      PREVIEW_DIR,
      "--layout-dir",
      LAYOUT_DIR,
      "--contact-sheet",
      path.join(PREVIEW_DIR, "contact-sheet.png"),
      "--slide-count",
      String(slides.length),
      "--slide-size",
      "1280x720",
      "--scale",
      "1",
    ],
    {
      cwd: ROOT,
      env: { ...process.env, PYTHON },
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 50,
    },
  );
  if (result.status !== 0) {
    throw new Error(`Deck build failed:\n${result.stdout}\n${result.stderr}`);
  }
  await fs.writeFile(path.join(QA_DIR, "build-output.json"), result.stdout, "utf8");
}

async function makePdf() {
  const py = String.raw`
import os, sys
from PIL import Image

preview_dir, out_pdf = sys.argv[1], sys.argv[2]
paths = sorted(
    os.path.join(preview_dir, p)
    for p in os.listdir(preview_dir)
    if p.startswith("slide-") and p.endswith(".png")
)
if not paths:
    raise SystemExit("No rendered slide PNGs found")
images = []
for p in paths:
    im = Image.open(p).convert("RGB")
    images.append(im)
first, rest = images[0], images[1:]
first.save(out_pdf, "PDF", resolution=144.0, save_all=True, append_images=rest)
print(out_pdf)
`;
  const result = spawnSync(PYTHON, ["-c", py, PREVIEW_DIR, FINAL_PDF], { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`PDF build failed:\n${result.stdout}\n${result.stderr}`);
  }
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(QA_DIR, { recursive: true });
  await writePlanningFiles();
  const assetMap = await prepareAssets();
  const preparedSlides = slides.map((item) => mapAssets(item, assetMap));
  await writeSlideModules(preparedSlides);
  await buildDeck();
  await makePdf();

  const pptxStat = await fs.stat(FINAL_PPTX);
  const pdfStat = await fs.stat(FINAL_PDF);
  const manifest = {
    slideCount: slides.length,
    pptx: FINAL_PPTX,
    pptxBytes: pptxStat.size,
    pdf: FINAL_PDF,
    pdfBytes: pdfStat.size,
    contactSheet: path.join(PREVIEW_DIR, "contact-sheet.png"),
  };
  await fs.writeFile(path.join(OUTPUT_DIR, "deliverable-manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(JSON.stringify(manifest, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
