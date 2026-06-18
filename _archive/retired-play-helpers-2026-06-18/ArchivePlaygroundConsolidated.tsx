import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

type ProjectKind = "image" | "video" | "gif"
type StrokeMode = "auto" | "on" | "off"

type ImageValue =
    | string
    | {
          src?: string
          srcSet?: string
          alt?: string
      }

interface EditableProject {
    title?: string
    description?: string
    category?: string
    kind?: ProjectKind
    image?: ImageValue
    video?: string
    poster?: ImageValue
    stroke?: StrokeMode
    width?: number
    height?: number
}

interface ProjectItem {
    id: string
    title: string
    description: string
    category: string
    kind: ProjectKind
    image: string
    imageSrcSet?: string
    poster: string
    posterSrcSet?: string
    video?: string
    alt: string
    width: number
    height: number
    stroke: StrokeMode
}

interface GridSettings {
    cellSize?: number
    columnGap?: number
    rowGap?: number
    hoverScale?: number
    hoverImageZoom?: number
    showLabelsOnHover?: boolean
    useNaturalSize?: boolean
    sizeVariation?: number
}

interface PanelSettings {
    panelWidth?: number
    columnGap?: number
    stackBelow?: number
    exitDurationMs?: number
    maxMediaHeight?: number
}

interface MotionSettings {
    driftSpeedX?: number
    driftSpeedY?: number
    driftWhilePanelOpen?: boolean
    panelDriftSpeedX?: number
    panelDriftSpeedY?: number
    inertiaEnabled?: boolean
    throwFriction?: number
    throwVelocityScale?: number
    throwMinSpeed?: number
    throwMaxSpeed?: number
    edgeScrollEnabled?: boolean
    edgeScrollSpeed?: number
    edgeScrollZone?: number
    parallaxStrength?: number
    parallaxEase?: number
    parallaxWhileDragging?: boolean
}

interface StyleSettings {
    backgroundColor?: string
    panelColor?: string
    textColor?: string
    mutedTextColor?: string
    labelColor?: string
    ruleColor?: string
    strokeColor?: string
    strokeWidth?: number
    mediaFadeMs?: number
    mediaFadeEasing?: string
}

interface EffectSettings {
    hideFooter?: boolean
    navPassthrough?: boolean
    navSelector?: string
    mediaStrokeMode?: StrokeMode
}

interface ArchivePlaygroundConsolidatedProps {
    projects?: EditableProject[]
    grid?: GridSettings
    panel?: PanelSettings
    motion?: MotionSettings
    visual?: StyleSettings
    effects?: EffectSettings
    style?: React.CSSProperties
}

const DEFAULT_NAV_SELECTOR =
    "header, nav, [data-framer-name*='Navigation' i], [data-framer-name*='Nav' i]"
const SMOOTH_EASE = "cubic-bezier(0.12, 0.23, 0.5, 1)"
const SNAPPY_EASE = "cubic-bezier(0.16, 1, 0.3, 1)"

const DEFAULT_GRID: Required<GridSettings> = {
    cellSize: 190,
    columnGap: 72,
    rowGap: 88,
    hoverScale: 1.035,
    hoverImageZoom: 4,
    showLabelsOnHover: false,
    useNaturalSize: true,
    sizeVariation: 45,
}

const DEFAULT_PANEL: Required<PanelSettings> = {
    panelWidth: 500,
    columnGap: 28,
    stackBelow: 430,
    exitDurationMs: 950,
    maxMediaHeight: 660,
}

const DEFAULT_MOTION: Required<MotionSettings> = {
    driftSpeedX: 0.2,
    driftSpeedY: 0.2,
    driftWhilePanelOpen: true,
    panelDriftSpeedX: 0.5,
    panelDriftSpeedY: 0.5,
    inertiaEnabled: true,
    throwFriction: 0.85,
    throwVelocityScale: 1.75,
    throwMinSpeed: 220,
    throwMaxSpeed: 5200,
    edgeScrollEnabled: true,
    edgeScrollSpeed: 220,
    edgeScrollZone: 90,
    parallaxStrength: 0.06,
    parallaxEase: 0.5,
    parallaxWhileDragging: true,
}

const DEFAULT_VISUAL: Required<StyleSettings> = {
    backgroundColor: "rgb(247, 245, 240)",
    panelColor: "rgb(247, 245, 240)",
    textColor: "rgb(20, 20, 20)",
    mutedTextColor: "rgb(85, 85, 85)",
    labelColor: "rgb(151, 151, 151)",
    ruleColor: "rgb(35, 51, 36)",
    strokeColor: "rgb(151, 151, 151)",
    strokeWidth: 0.5,
    mediaFadeMs: 700,
    mediaFadeEasing: SNAPPY_EASE,
}

const DEFAULT_EFFECTS: Required<EffectSettings> = {
    hideFooter: true,
    navPassthrough: true,
    navSelector: DEFAULT_NAV_SELECTOR,
    mediaStrokeMode: "auto",
}

const image = (src: string, alt: string): ImageValue => ({ src, alt })

const DEFAULT_PROJECTS: EditableProject[] = [
    {
        title: "Meihao",
        category: "Packaging",
        description:
            "Sparkling sour plum drink packaging and product photography for yuzu and hibiscus flavors, built around bilingual labels and bright color cues.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/da9eb2c714e0dfa07719c58c69829e6665e3814a2c63c862a90e06d9d6f465d0/Untitled-2.png",
            "Meihao packaging and product photography",
        ),
        width: 1219,
        height: 1566,
        stroke: "auto",
    },
    {
        title: "Root Growth",
        category: "Motion Study",
        description:
            "Abstract motion study using glowing root-like paths, light particles, and slow organic movement.",
        kind: "video",
        image: image(
            "https://freight.cargo.site/t/original/i/9c292d296d519993fb38490cbef9b94d59cb5fb20c46592a50894984583f5592/RootGrwoth1.jpg",
            "Root Growth motion poster frame",
        ),
        video: "https://freight.cargo.site/t/original/i/54016e0df8d236ba5444f601e51db8b47a8e31a8d525f040045deae20bf11566/Root-growth_1.mp4",
        width: 2352,
        height: 1640,
        stroke: "auto",
    },
    {
        title: "AirPods Pro 3 Hero",
        category: "Product Launch",
        description:
            "Hero image from the AirPods Pro 3 launch identity system, connected to keynote, retail, web, and digital work.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/9f5146448636afd49c1ab4502a254af1458fef6fbcbbf1c6f34455b67e00b62a/1.png",
            "AirPods Pro 3 launch hero image",
        ),
        width: 1096,
        height: 1697,
        stroke: "auto",
    },
    {
        title: "Kingdom Principles Playing Cards",
        category: "Cards",
        description:
            "Faith-based playing-card deck where each card pairs a Kingdom Principle with a related Bible verse.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/1be6e3c7a73b35f6bdc5e536e2611794cfa8685a2385624a75596e94930785d1/Frame-2608526.jpg",
            "Kingdom Principles playing card deck",
        ),
        width: 1500,
        height: 1200,
        stroke: "auto",
    },
    {
        title: "RunCenter",
        category: "Brand Concept",
        description:
            "ArtCenter running-club concept connecting the student experience to the discipline, community, and life lessons of running.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/658f1e75f752dc555b485588967d145399d6b0da023b0d4b6d0b51b83117992e/runcenter.jpg",
            "RunCenter brand concept poster",
        ),
        width: 4000,
        height: 3000,
        stroke: "auto",
    },
    {
        title: "Visual & Communication Arts Speaker Series",
        category: "Poster System",
        description:
            "Fall 2024 ArtCenter Visual & Communication Arts speaker lineup poster and collateral system.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/415a82e480bb98077e7852017a9f8159ad193ae176159b8e0d9a5876a1fa5399/Frame-2608525.jpg",
            "Visual and Communication Arts speaker series poster",
        ),
        width: 2048,
        height: 1366,
        stroke: "auto",
    },
    {
        title: "Aspen Valley Landscaping",
        category: "Brand Identity",
        description:
            "Brand identity and strategy system for a landscaping business, shown here through vehicle mockup application.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/1a1dcd26011b729e9e69d5a365b2c679929fae9bf5c06f9438a3c112a25d4551/Car-Mockup.png",
            "Aspen Valley Landscaping vehicle mockup",
        ),
        width: 1398,
        height: 934,
        stroke: "auto",
    },
    {
        title: "Wolff Olins x ArtCenter",
        category: "Identity & Motion",
        description:
            "Visual identity, motion, and social media work created for an ArtCenter education context.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/0f7cf60752da366b46631a338756a56b12e4e72f19831331b363cf45530f948e/Untitled-9.png",
            "Wolff Olins x ArtCenter visual identity image",
        ),
        width: 2901,
        height: 1997,
        stroke: "auto",
    },
    {
        title: "Christmas Card 2020",
        category: "Illustration",
        description:
            "Seasonal greeting-card illustration and physical card composition.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/b301fa3805d2714720a1e66e685cc2314e670b6e9a7dac1cde6d06572234ddff/Christmas-Card2020.jpg",
            "Christmas Card 2020 illustration",
        ),
        width: 1948,
        height: 1256,
        stroke: "auto",
    },
    {
        title: "Skycar Creative",
        category: "Identity Exploration",
        description:
            "Visual identity exploration for Skycar Creative, shown through logo, color, and brand-system elements.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/02a6af247cb97205f9b1c8d937d519c9705f4d86c95fcb60d5e897603d49c9f6/Artboard-1.jpg",
            "Skycar Creative identity exploration",
        ),
        width: 1400,
        height: 966,
        stroke: "auto",
    },
    {
        title: "Rotating Cube",
        category: "3D Motion",
        description:
            "Motion design exercise focused on material, lighting, and rotation in a minimal 3D cube animation.",
        kind: "video",
        image: image(
            "https://freight.cargo.site/t/original/i/5f7888042aaefef2c171349f26ff32c5ad1e0582ee06ad508c19fb603cc22455/CUBE.jpg",
            "Rotating cube motion poster frame",
        ),
        video: "https://freight.cargo.site/t/original/i/ee88d6195df7a48d1ce013dbd86ef436e529d6d2f87c3bf8248554c53bdf36b4/Cube_1.mp4",
        width: 1400,
        height: 1400,
        stroke: "auto",
    },
    {
        title: "SpeedLab",
        category: "App Prototype",
        description:
            "Mobile interval-training UI prototype for runners, covering workouts, splits, rep timing, and athlete lists.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/6166d998b3c121570052eec78ba72783d03288f5ee2f78d17d168829b66a9ed9/SpeedLab-interval-page.jpg",
            "SpeedLab mobile interval training interface",
        ),
        width: 1600,
        height: 1200,
        stroke: "auto",
    },
    {
        title: "Live Happy Be Healthy",
        category: "Badge Concept",
        description:
            "Sticker or badge concept using a camper illustration and wellness-focused slogan.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/00eef5d9ed90a16b3218acf6414de1b5065afcbfa16e8376cb4d4648a29dc6b2/Be-Healthy-and-Live-Happy.jpg",
            "Live Happy Be Healthy camper badge",
        ),
        width: 1400,
        height: 1400,
        stroke: "auto",
    },
    {
        title: "Flower",
        category: "Motion Study",
        description:
            "Minimal motion study built around a small blooming light form in a dark environment.",
        kind: "video",
        image: image(
            "https://freight.cargo.site/t/original/i/df26c8e3ec3fe872193f76151ced76424dabd7af4c72105d708c26fa03eb16a0/Flower.jpg",
            "Flower motion poster frame",
        ),
        video: "https://freight.cargo.site/t/original/i/b76de8b53d6a85a6778750f3fc142e36552a4a5ab19d2c66614deba738e3a38f/Comp-1_6.mp4",
        width: 1400,
        height: 1400,
        stroke: "auto",
    },
    {
        title: "Gazelle",
        category: "Illustration",
        description:
            "Geometric animal illustration exploring shape, symmetry, color, and simplified form.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/7a940959e76c116fb6fd71e02112de4014f9c2e2650cddbe1658c43eb2836b21/Gazelle.jpg",
            "Geometric gazelle illustration",
        ),
        width: 1400,
        height: 1400,
        stroke: "auto",
    },
    {
        title: "Koru: The Wake Up",
        category: "Packaging",
        description:
            "Performance snack packaging concept with cacao, almonds, and coffee as the core flavor and energy story.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/e695f11c490b013a9410bfe4d2a1a55d49789bed02fa03dd219251ca852486d5/Wake-Up-Project.jpg",
            "Koru The Wake Up packaging concept",
        ),
        width: 1400,
        height: 1400,
        stroke: "auto",
    },
    {
        title: "Independent Lens",
        category: "Editorial System",
        description:
            "Poster and brochure system for the PBS documentary series, translating the film lineup into a compact two-color print piece.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/360d8e0a61072d7b615583ae945bda61bc85e80b9c86a7d38af43ba095f6e3d1/Brochure_Mockup_1-copy-3.jpg",
            "Independent Lens brochure and poster system",
        ),
        width: 2048,
        height: 1365,
        stroke: "auto",
    },
    {
        title: "Audit Beyond",
        category: "Event Merchandise",
        description:
            "Conference tote-bag concept for AuditBoard, using a blue city-at-night illustration system.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/138ae18ebd5415d4bc06e87c9b751c707da1f6058e29f6224237d0c4f3fcacfc/Tote-Bag-Mockup-copy.jpg",
            "Audit Beyond tote bag mockup",
        ),
        width: 2048,
        height: 1365,
        stroke: "auto",
    },
    {
        title: "Seek Truth",
        category: "Editorial Design",
        description:
            "Editorial project examining state media, surveillance, and censorship in China through a 72-page book and poster system.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/f8372f2548d65406b0a7fd8a2081015707e108b7b82a6f67d298fe2034848dd0/7a648511566703.5626b7cccf9d2-copy.jpg",
            "Seek Truth editorial book and poster system",
        ),
        width: 600,
        height: 401,
        stroke: "auto",
    },
    {
        title: "Teacaps",
        category: "Brand Concept",
        description:
            "Billboard mockup for a tea or capsule-based morning ritual brand concept.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/6e4b4476d3c665b9d7117233fae88b29d63a70336b8c253d740e272bfb884378/Teacaps-Billboard.jpg",
            "Teacaps billboard mockup",
        ),
        width: 1950,
        height: 1459,
        stroke: "auto",
    },
    {
        title: "The Kind Warrior",
        category: "Character Motion",
        description:
            "Character-led motion piece using a stylized big-cat face and warm geometric visual language.",
        kind: "video",
        image: image(
            "https://freight.cargo.site/t/original/i/979f80b02bb53749af2213b51aebd3b6ff740c00456e417c6bd3bf6c59215b4f/Kind-Warrior.jpg",
            "The Kind Warrior motion poster frame",
        ),
        video: "https://freight.cargo.site/t/original/i/615be16cf3c98250c91fef20676b0c62aa2327bbd4eb491f54a9d6a4def4f69/kind-warrior_1.mp4",
        width: 1400,
        height: 1400,
        stroke: "auto",
    },
    {
        title: "DevWars Ranking System",
        category: "Icon System",
        description:
            "Badge and ranking-system design for DevWars, using gem-like icons and tiered progression visuals.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/f2a684699b8ddd4a4e5b817295976e3fa69ac2d5ad831c1ccd508057b7397d3d/DevWars-Ranking-System-copy.jpg",
            "DevWars ranking badge system",
        ),
        width: 2048,
        height: 1365,
        stroke: "auto",
    },
    {
        title: "Neon Lights",
        category: "AI Motion",
        description:
            "AI and Warpfusion experiment remixing a Kraftwerk Neon Lights music visualizer into a layered motion piece.",
        kind: "gif",
        image: image(
            "https://freight.cargo.site/t/original/i/2553d0d7bc95724c5e502be36d763e142e09cc124af1c2f68c0d4b93fe029f7d/NeonLights.gif",
            "Neon Lights animated visualizer",
        ),
        width: 1376,
        height: 1376,
        stroke: "auto",
    },
    {
        title: "John Steinbeck",
        category: "Book Design",
        description:
            "Editorial and identity system for John Steinbeck, shown through book-spread and process documentation.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/8ac07094623c368c79d46c3309d143c3fc36bd6f529621dfbd568e02d489fb90/Screen-Shot-2022-12-14-at-2.22.22-AM.png",
            "John Steinbeck book design spread",
        ),
        width: 2366,
        height: 1630,
        stroke: "auto",
    },
    {
        title: "Art Week",
        category: "Event Poster",
        description:
            "Poster or event-identity piece for Art Week, using blurred gradient color and bold vertical typography.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/0a51e8e5676de5f883afdb361674369da5e5375a4d465d1d75ae3be5ad9a215c/1-100.jpg",
            "Art Week poster artwork",
        ),
        width: 1400,
        height: 1400,
        stroke: "auto",
    },
    {
        title: "HMCT Email Blast",
        category: "Announcement Graphic",
        description:
            "Typography resources and opportunities email blast for students, built as a punchy announcement graphic.",
        kind: "gif",
        image: image(
            "https://freight.cargo.site/t/original/i/a50dd2c6b0c8212f328c51934a79e24688ea132b18c6957132e5e4642604a32c/HMCT-EmailBlast-V2.gif",
            "HMCT email blast animated graphic",
        ),
        width: 1500,
        height: 843,
        stroke: "auto",
    },
    {
        title: "Utah Playing Cards",
        category: "Cards",
        description:
            "Playing-card deck concept celebrating Utah natural wonders through stamp-like card illustrations and desert-toned packaging.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/1f6d49e1bdd0c5c58b7cbdb2cd30a8606c627d68b9d4ba831403af705975a679/Utah-Cards-2.jpg",
            "Utah natural wonders playing-card deck",
        ),
        width: 1500,
        height: 1200,
        stroke: "auto",
    },
    {
        title: "Narrative Imaging Process Book",
        category: "Photography Book",
        description:
            "Photography process book documenting weekly shoots, sequencing, composition, lighting, and visual storytelling exercises.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/0d81d2c5d3b4970803120fcc043e51a8c9a567f20eb04950f33f3676df1b827f/Photo-Process-Book.jpg",
            "Narrative Imaging process book spread",
        ),
        width: 1500,
        height: 1130,
        stroke: "auto",
    },
    {
        title: "Google: Unpacking the Future",
        category: "Motion Concept",
        description:
            "Motion or presentation graphic for a Google Unpacking the Future concept.",
        kind: "video",
        image: image(
            "https://freight.cargo.site/t/original/i/8d19e8d799d5a6ddd0869b45f183a2764e38b7c7ac71c16efa17f844324bb4b2/Google_-Unpacking-the-Future.jpg",
            "Google Unpacking the Future motion poster frame",
        ),
        video: "https://freight.cargo.site/t/original/i/9cfe39cd0e298101c095ea652ebc0a52b893aa0bce5e3db0605a39f9aa16bddf/Micah-Hoang_Google_-Unpacking-the-Future-1.mp4",
        width: 1400,
        height: 1400,
        stroke: "auto",
    },
    {
        title: "TrackBeast",
        category: "Brand / App Concept",
        description:
            "First-look brand and app concept for a track performance product, with logo, app icon, and red-black identity system.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/bf3b4547653243b3abeb5a7faf868f92b5f0c433a4b2ad487e2dbfc1e5163b97/First-Look.png",
            "TrackBeast brand and app concept",
        ),
        width: 1944,
        height: 1296,
        stroke: "auto",
    },
    {
        title: "ArtCenter MDes BDS Faculty Card",
        category: "Social Motion",
        description:
            "Social or motion graphic for ArtCenter's MDes Brand Design and Strategy program, featuring faculty and course information.",
        kind: "video",
        image: image(
            "https://freight.cargo.site/t/original/i/eb30f1bcfbba426e407f9cb79570e436f341ef799fe6a2ce3b820f8509ad2b86/D2-Elliott-Earls-poster.jpg",
            "ArtCenter MDes BDS faculty card poster frame",
        ),
        video: "https://freight.cargo.site/t/original/i/d58dc392f0aa0866ce6c76a896b82fd81f1c0dde55ad59c70f3b59ac4f4cfb56/D2-Elliott-Earls_1.mp4",
        width: 1400,
        height: 1400,
        stroke: "auto",
    },
    {
        title: "Cellular Symphony",
        category: "3D Motion",
        description:
            "3D motion project visualizing cellular biology through colorful organelle-like forms and animated science imagery.",
        kind: "video",
        image: image(
            "https://freight.cargo.site/t/original/i/bc67e34122bc906b3402d9b9f613a12d0fd49171a56f93013919e72c86411593/CellularSymphony1.jpg",
            "Cellular Symphony motion poster frame",
        ),
        video: "https://freight.cargo.site/t/original/i/423ca2c963fcb4ddce9d1a6dd959a9e3849f80a57c9aad47c16d70ff338ec71b/CellularSymphony1_1.mp4",
        width: 1080,
        height: 1080,
        stroke: "auto",
    },
    {
        title: "Civic Stamp Pattern Study",
        category: "Pattern Study",
        description:
            "Repeating typographic stamp or pattern study using civic words like education, cities, estates, and figures.",
        kind: "image",
        image: image(
            "https://freight.cargo.site/t/original/i/575555e92cd7a6fe700b4c1e2502ced9d75b099daed6ccae2a4c2b5f656028e8/CJ-4.png",
            "Civic stamp pattern study",
        ),
        width: 958,
        height: 1402,
        stroke: "auto",
    },
]

const AUTO_STROKE_MATCHERS = [
    "RootGrwoth1.jpg",
    "Root-growth_1.mp4",
    "Frame-2608526.jpg",
    "runcenter.jpg",
    "Frame-2608525.jpg",
    "Car-Mockup.png",
    "Untitled-9.png",
    "Christmas-Card2020.jpg",
    "Artboard-1.jpg",
    "CUBE.jpg",
    "Cube_1.mp4",
    "SpeedLab-interval-page.jpg",
    "Be-Healthy-and-Live-Happy.jpg",
    "Flower.jpg",
    "Comp-1_6.mp4",
    "Gazelle.jpg",
    "Wake-Up-Project.jpg",
    "Brochure_Mockup_1-copy-3.jpg",
    "Tote-Bag-Mockup-copy.jpg",
    "7a648511566703.5626b7cccf9d2-copy.jpg",
    "Teacaps-Billboard.jpg",
    "Kind-Warrior.jpg",
    "kind-warrior_1.mp4",
    "DevWars-Ranking-System-copy.jpg",
    "NeonLights.gif",
    "Screen-Shot-2022-12-14-at-2.22.22-AM.png",
    "HMCT-EmailBlast-V2.gif",
    "Utah-Cards-2.jpg",
    "Photo-Process-Book.jpg",
    "Google_-Unpacking-the-Future.jpg",
    "Micah-Hoang_Google_-Unpacking-the-Future-1.mp4",
    "First-Look.png",
    "D2-Elliott-Earls-poster.jpg",
    "D2-Elliott-Earls_1.mp4",
    "CellularSymphony1.jpg",
    "CellularSymphony1_1.mp4",
]

const canUseDOM = () =>
    typeof window !== "undefined" && typeof document !== "undefined"

const useIsoLayoutEffect = canUseDOM()
    ? React.useLayoutEffect
    : React.useEffect

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max)
}

function mod(value: number, base: number) {
    return ((value % base) + base) % base
}

function numberOr(value: unknown, fallback: number) {
    return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function imageInfo(value: ImageValue | undefined) {
    if (typeof value === "string") {
        return { src: value, srcSet: undefined, alt: undefined }
    }

    return {
        src: value?.src || "",
        srcSet: value?.srcSet,
        alt: value?.alt,
    }
}

function slugify(value: string) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
}

function cargoWidthUrl(src: string, width: number) {
    if (!src.includes("/t/original/i/")) return src
    return src.replace("/t/original/i/", `/t/w${Math.round(width)}/i/`)
}

function normalizeProjects(projects: EditableProject[] | undefined): ProjectItem[] {
    const source = Array.isArray(projects) && projects.length > 0 ? projects : DEFAULT_PROJECTS

    return source.map((project, index) => {
        const fallback = DEFAULT_PROJECTS[index % DEFAULT_PROJECTS.length]
        const projectImage = imageInfo(project.image)
        const fallbackImage = imageInfo(fallback.image)
        const projectPoster = imageInfo(project.poster)
        const fallbackPoster = imageInfo(fallback.poster)
        const title = project.title || fallback.title || `Archive ${index + 1}`
        const kind = project.kind || fallback.kind || "image"
        const imageSrc = projectImage.src || projectPoster.src || fallbackImage.src
        const posterSrc = projectPoster.src || imageSrc || fallbackPoster.src
        const video = kind === "video" ? project.video || fallback.video : undefined

        return {
            id: `${String(index + 1).padStart(2, "0")}-${slugify(title)}`,
            title,
            description:
                project.description ||
                fallback.description ||
                "Short archive project shown as part of the play collection.",
            category: project.category || fallback.category || "Archive",
            kind,
            image: imageSrc,
            imageSrcSet: projectImage.srcSet || fallbackImage.srcSet,
            poster: posterSrc,
            posterSrcSet: projectPoster.srcSet || fallbackPoster.srcSet,
            video,
            alt: projectImage.alt || fallbackImage.alt || title,
            width: numberOr(project.width, numberOr(fallback.width, 1600)),
            height: numberOr(project.height, numberOr(fallback.height, 1000)),
            stroke: project.stroke || fallback.stroke || "auto",
        }
    })
}

function projectHasAutoStroke(item: ProjectItem) {
    const haystack = `${item.image} ${item.poster} ${item.video || ""}`
    return AUTO_STROKE_MATCHERS.some((matcher) => haystack.includes(matcher))
}

function shouldDrawStroke(item: ProjectItem, mode: StrokeMode) {
    if (mode === "off" || item.stroke === "off") return false
    if (mode === "on" || item.stroke === "on") return true
    return projectHasAutoStroke(item)
}

function useViewport() {
    const [viewport, setViewport] = React.useState({ width: 1200, height: 900 })

    React.useEffect(() => {
        if (!canUseDOM()) return

        const update = () => {
            setViewport({
                width: window.innerWidth || 1200,
                height: window.innerHeight || 900,
            })
        }

        update()
        window.addEventListener("resize", update)
        return () => window.removeEventListener("resize", update)
    }, [])

    return viewport
}

function useBodyClass(className: string, enabled: boolean) {
    React.useEffect(() => {
        if (!canUseDOM() || !enabled) return
        document.body.classList.add(className)
        return () => document.body.classList.remove(className)
    }, [className, enabled])
}

function useDetailBodyClass(enabled: boolean) {
    React.useEffect(() => {
        if (!canUseDOM()) return
        document.body.classList.toggle("playground-detail-open", enabled)
        return () => document.body.classList.remove("playground-detail-open")
    }, [enabled])
}

function useNavExitHold(durationMs: number) {
    const timerRef = React.useRef<number | undefined>(undefined)

    React.useEffect(() => {
        return () => {
            if (!canUseDOM()) return
            if (timerRef.current) window.clearTimeout(timerRef.current)
            document.body.classList.remove("playground-sidebar-nav-exit-hold")
        }
    }, [])

    return React.useCallback(() => {
        if (!canUseDOM()) return
        if (timerRef.current) window.clearTimeout(timerRef.current)
        document.body.classList.add("playground-sidebar-nav-exit-hold")
        timerRef.current = window.setTimeout(() => {
            document.body.classList.remove("playground-sidebar-nav-exit-hold")
        }, durationMs)
    }, [durationMs])
}

function buildGlobalCss(navSelector: string) {
    const safeSelector = navSelector || DEFAULT_NAV_SELECTOR

    return `
body.playground-hide-footer footer,
body.playground-hide-footer [data-framer-name*="Footer" i],
body.playground-hide-footer [aria-label*="footer" i] {
    display: none !important;
}
body.playground-nav-passthrough ${safeSelector} {
    pointer-events: none !important;
}
body.playground-nav-passthrough ${safeSelector} a,
body.playground-nav-passthrough ${safeSelector} button,
body.playground-nav-passthrough ${safeSelector} [role="button"],
body.playground-nav-passthrough ${safeSelector} [data-framer-component-type="RichTextContainer"],
body.playground-nav-passthrough ${safeSelector} [data-framer-name*="Link" i] {
    pointer-events: auto !important;
}
body.playground-sidebar-nav-exit-hold ${safeSelector} {
    opacity: 0 !important;
    pointer-events: none !important;
    transition: none !important;
}
@keyframes archive-playground-rule-in {
    from { transform: scaleX(0); opacity: 0; }
    to { transform: scaleX(1); opacity: 1; }
}
`
}

function MediaFrame({
    item,
    detail,
    stroke,
    strokeColor,
    strokeWidth,
    fadeMs,
    fadeEasing,
    zoomPercent,
}: {
    item: ProjectItem
    detail: boolean
    stroke: boolean
    strokeColor: string
    strokeWidth: number
    fadeMs: number
    fadeEasing: string
    zoomPercent: number
}) {
    const frameRef = React.useRef<HTMLDivElement>(null)
    const [frame, setFrame] = React.useState({ width: 0, height: 0 })
    const [natural, setNatural] = React.useState({ width: item.width, height: item.height })

    useIsoLayoutEffect(() => {
        const element = frameRef.current
        if (!element || !canUseDOM()) return

        const update = () => {
            const rect = element.getBoundingClientRect()
            setFrame({ width: rect.width, height: rect.height })
        }

        update()
        const observer = new ResizeObserver(update)
        observer.observe(element)
        return () => observer.disconnect()
    }, [])

    const ratio = natural.width > 0 && natural.height > 0 ? natural.width / natural.height : 1
    const containerRatio = frame.width > 0 && frame.height > 0 ? frame.width / frame.height : ratio
    let mediaBox = { left: 0, top: 0, width: frame.width, height: frame.height }

    if (frame.width > 0 && frame.height > 0 && ratio > 0) {
        if (containerRatio > ratio) {
            mediaBox.height = frame.height
            mediaBox.width = frame.height * ratio
            mediaBox.left = (frame.width - mediaBox.width) / 2
        } else {
            mediaBox.width = frame.width
            mediaBox.height = frame.width / ratio
            mediaBox.top = (frame.height - mediaBox.height) / 2
        }
    }

    return (
        <div
            ref={frameRef}
            data-playground-media-frame="true"
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
            }}
        >
            <MediaAsset
                item={item}
                detail={detail}
                fadeMs={fadeMs}
                fadeEasing={fadeEasing}
                zoomPercent={zoomPercent}
                onNaturalSize={(width, height) => setNatural({ width, height })}
            />
            {stroke && frame.width > 0 && frame.height > 0 && (
                <div
                    aria-hidden="true"
                    data-playground-media-stroke="true"
                    style={{
                        position: "absolute",
                        left: mediaBox.left,
                        top: mediaBox.top,
                        width: mediaBox.width,
                        height: mediaBox.height,
                        border: `${strokeWidth}px solid ${strokeColor}`,
                        pointerEvents: "none",
                        boxSizing: "border-box",
                    }}
                />
            )}
        </div>
    )
}

function MediaAsset({
    item,
    detail,
    fadeMs,
    fadeEasing,
    zoomPercent,
    onNaturalSize,
}: {
    item: ProjectItem
    detail: boolean
    fadeMs: number
    fadeEasing: string
    zoomPercent: number
    onNaturalSize: (width: number, height: number) => void
}) {
    const [ready, setReady] = React.useState(false)
    const isStatic = RenderTarget.current() === RenderTarget.canvas
    const imageWidth = detail ? 1800 : 620
    const src = detail ? item.image : cargoWidthUrl(item.image, imageWidth)
    const poster = detail ? item.poster : cargoWidthUrl(item.poster, imageWidth)
    const showVideo = item.kind === "video" && Boolean(item.video)

    React.useEffect(() => setReady(false), [item.id, detail])

    const mediaStyle: React.CSSProperties = {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        objectFit: "contain",
        opacity: ready || isStatic ? 1 : 0,
        transition: `opacity ${fadeMs}ms ${fadeEasing}, transform 360ms ${SNAPPY_EASE}`,
        transform: detail ? "none" : `scale(${1 + zoomPercent / 100})`,
    }

    if (showVideo) {
        return (
            <video
                data-playground-media="video"
                data-playground-media-source={item.video}
                src={item.video}
                poster={poster}
                muted
                loop
                playsInline
                autoPlay={!isStatic}
                preload={detail ? "auto" : "metadata"}
                style={mediaStyle}
                onLoadedMetadata={(event) => {
                    const video = event.currentTarget
                    if (video.videoWidth > 0 && video.videoHeight > 0) {
                        onNaturalSize(video.videoWidth, video.videoHeight)
                    }
                    setReady(true)
                }}
                onCanPlay={() => setReady(true)}
            />
        )
    }

    return (
        <img
            data-playground-media="image"
            data-playground-media-source={src}
            src={src}
            srcSet={item.imageSrcSet}
            alt={item.alt}
            loading={detail ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            style={mediaStyle}
            onLoad={(event) => {
                const img = event.currentTarget
                if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                    onNaturalSize(img.naturalWidth, img.naturalHeight)
                }
                setReady(true)
            }}
        />
    )
}

function ArchiveCard({
    item,
    x,
    y,
    width,
    height,
    grid,
    visual,
    effects,
    onOpen,
    suppressOpen,
}: {
    item: ProjectItem
    x: number
    y: number
    width: number
    height: number
    grid: Required<GridSettings>
    visual: Required<StyleSettings>
    effects: Required<EffectSettings>
    onOpen: (item: ProjectItem) => void
    suppressOpen: () => boolean
}) {
    const [hovered, setHovered] = React.useState(false)
    const stroke = shouldDrawStroke(item, effects.mediaStrokeMode)

    return (
        <button
            type="button"
            data-playground-card="true"
            data-project-id={item.id}
            aria-label={`Open ${item.title}`}
            onClick={() => {
                if (!suppressOpen()) onOpen(item)
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                width,
                height,
                transform: `translate3d(${x}px, ${y}px, 0) scale(${
                    hovered ? grid.hoverScale : 1
                })`,
                transformOrigin: "center",
                border: 0,
                padding: 0,
                margin: 0,
                background: "transparent",
                cursor: "pointer",
                appearance: "none",
                WebkitAppearance: "none",
                transition: `transform 280ms ${SNAPPY_EASE}`,
                color: visual.textColor,
                touchAction: "none",
            }}
        >
            <MediaFrame
                item={item}
                detail={false}
                stroke={stroke}
                strokeColor={visual.strokeColor}
                strokeWidth={visual.strokeWidth}
                fadeMs={visual.mediaFadeMs}
                fadeEasing={visual.mediaFadeEasing}
                zoomPercent={hovered ? grid.hoverImageZoom : 0}
            />
            {grid.showLabelsOnHover && (
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: "100%",
                        width: "100%",
                        paddingTop: 8,
                        color: visual.labelColor,
                        fontFamily:
                            "GT Standard Mono Regular, SFMono-Regular, ui-monospace, monospace",
                        fontSize: 11,
                        lineHeight: 1.1,
                        textTransform: "uppercase",
                        textAlign: "left",
                        opacity: hovered ? 1 : 0,
                        transition: `opacity 180ms ${SMOOTH_EASE}`,
                        pointerEvents: "none",
                    }}
                >
                    {item.title}
                </div>
            )}
        </button>
    )
}

/**
 * Archive Playground Consolidated
 *
 * A single editable Framer component for the Play archive grid, detail drawer, media polish, and page-level interaction helpers.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 1080
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function ArchivePlaygroundConsolidated(
    props: ArchivePlaygroundConsolidatedProps,
) {
    const grid = { ...DEFAULT_GRID, ...(props.grid || {}) }
    const panel = { ...DEFAULT_PANEL, ...(props.panel || {}) }
    const motion = { ...DEFAULT_MOTION, ...(props.motion || {}) }
    const visual = { ...DEFAULT_VISUAL, ...(props.visual || {}) }
    const effects = { ...DEFAULT_EFFECTS, ...(props.effects || {}) }
    const projects = React.useMemo(
        () => normalizeProjects(props.projects),
        [props.projects],
    )
    const viewport = useViewport()
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const rootRef = React.useRef<HTMLDivElement>(null)
    const movementRef = React.useRef({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        parallaxX: 0,
        parallaxY: 0,
        targetParallaxX: 0,
        targetParallaxY: 0,
        edgeX: 0,
        edgeY: 0,
        dragging: false,
        dragMoved: false,
        pointerId: -1,
        lastX: 0,
        lastY: 0,
        lastTime: 0,
        suppressClickUntil: 0,
        tapId: null as string | null,
    })
    const [view, setView] = React.useState({ x: 0, y: 0, px: 0, py: 0 })
    const [selectedId, setSelectedId] = React.useState<string | null>(null)
    const [closingItem, setClosingItem] = React.useState<ProjectItem | null>(null)
    const closingTimerRef = React.useRef<number | undefined>(undefined)
    const selected = projects.find((item) => item.id === selectedId) || null
    const panelItem = selected || closingItem
    const panelOpen = Boolean(selected)
    const panelVisible = Boolean(panelItem)
    const holdNav = useNavExitHold(panel.exitDurationMs)

    useBodyClass("playground-hide-footer", Boolean(effects.hideFooter))
    useBodyClass(
        "playground-nav-passthrough",
        Boolean(effects.navPassthrough && !isCanvas),
    )
    useDetailBodyClass(panelVisible)

    React.useEffect(() => {
        return () => {
            if (closingTimerRef.current) window.clearTimeout(closingTimerRef.current)
        }
    }, [])

    const publishView = React.useCallback(() => {
        const state = movementRef.current
        setView({
            x: state.x,
            y: state.y,
            px: state.parallaxX,
            py: state.parallaxY,
        })
    }, [])

    const openItem = React.useCallback((item: ProjectItem) => {
        if (closingTimerRef.current) window.clearTimeout(closingTimerRef.current)
        setClosingItem(null)
        setSelectedId(item.id)
    }, [])

    const closePanel = React.useCallback(() => {
        if (!selected) return
        if (closingTimerRef.current) window.clearTimeout(closingTimerRef.current)
        setClosingItem(selected)
        setSelectedId(null)
        holdNav()
        closingTimerRef.current = window.setTimeout(() => {
            setClosingItem(null)
        }, panel.exitDurationMs)
    }, [holdNav, panel.exitDurationMs, selected])

    React.useEffect(() => {
        if (!panelOpen || isCanvas || !canUseDOM()) return

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") closePanel()
        }

        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [closePanel, isCanvas, panelOpen])

    React.useEffect(() => {
        if (isCanvas) return

        let frame = 0
        let last = performance.now()

        const tick = (now: number) => {
            const state = movementRef.current
            const dt = clamp((now - last) / 1000, 0, 0.05)
            last = now

            if (!state.dragging) {
                if (panelOpen) {
                    if (motion.driftWhilePanelOpen) {
                        state.x += motion.panelDriftSpeedX * dt * 60
                        state.y += motion.panelDriftSpeedY * dt * 60
                    }
                } else {
                    state.x += motion.driftSpeedX * dt * 60
                    state.y += motion.driftSpeedY * dt * 60

                    if (motion.edgeScrollEnabled) {
                        state.x += state.edgeX * motion.edgeScrollSpeed * dt
                        state.y += state.edgeY * motion.edgeScrollSpeed * dt
                    }

                    if (motion.inertiaEnabled) {
                        state.x += state.vx * dt
                        state.y += state.vy * dt
                        const friction = Math.pow(
                            clamp(motion.throwFriction, 0.01, 0.99),
                            dt * 60,
                        )
                        state.vx *= friction
                        state.vy *= friction

                        if (Math.hypot(state.vx, state.vy) < 5) {
                            state.vx = 0
                            state.vy = 0
                        }
                    }
                }
            }

            state.parallaxX +=
                (state.targetParallaxX - state.parallaxX) * motion.parallaxEase
            state.parallaxY +=
                (state.targetParallaxY - state.parallaxY) * motion.parallaxEase

            publishView()
            frame = requestAnimationFrame(tick)
        }

        frame = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frame)
    }, [
        isCanvas,
        motion.driftSpeedX,
        motion.driftSpeedY,
        motion.driftWhilePanelOpen,
        motion.edgeScrollEnabled,
        motion.edgeScrollSpeed,
        motion.inertiaEnabled,
        motion.panelDriftSpeedX,
        motion.panelDriftSpeedY,
        motion.parallaxEase,
        motion.throwFriction,
        panelOpen,
        publishView,
    ])

    const updateEdgeAndParallax = React.useCallback(
        (clientX: number, clientY: number) => {
            const root = rootRef.current
            if (!root || panelVisible) return
            const rect = root.getBoundingClientRect()
            const x = clientX - rect.left
            const y = clientY - rect.top
            const centerX = x / Math.max(rect.width, 1) - 0.5
            const centerY = y / Math.max(rect.height, 1) - 0.5
            const state = movementRef.current
            const zone = motion.edgeScrollZone

            state.targetParallaxX = centerX * grid.cellSize * motion.parallaxStrength
            state.targetParallaxY = centerY * grid.cellSize * motion.parallaxStrength

            state.edgeX =
                x < zone
                    ? (zone - x) / zone
                    : x > rect.width - zone
                      ? -((x - (rect.width - zone)) / zone)
                      : 0
            state.edgeY =
                y < zone
                    ? (zone - y) / zone
                    : y > rect.height - zone
                      ? -((y - (rect.height - zone)) / zone)
                      : 0
        },
        [grid.cellSize, motion.edgeScrollZone, motion.parallaxStrength, panelVisible],
    )

    const onPointerDown = React.useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            if (isCanvas || panelVisible) return
            const target = event.target as HTMLElement
            if (target.closest("[data-playground-detail-panel='true']")) return

            const state = movementRef.current
            state.dragging = true
            state.dragMoved = false
            state.tapId =
                target
                    .closest("[data-playground-card='true']")
                    ?.getAttribute("data-project-id") || null
            state.pointerId = event.pointerId
            state.lastX = event.clientX
            state.lastY = event.clientY
            state.lastTime = performance.now()
            state.vx = 0
            state.vy = 0
            rootRef.current?.setPointerCapture?.(event.pointerId)
        },
        [isCanvas, panelVisible],
    )

    const onPointerMove = React.useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            if (isCanvas) return
            updateEdgeAndParallax(event.clientX, event.clientY)
            const state = movementRef.current
            if (!state.dragging || state.pointerId !== event.pointerId) return

            const now = performance.now()
            const dx = event.clientX - state.lastX
            const dy = event.clientY - state.lastY
            const dt = Math.max((now - state.lastTime) / 1000, 0.001)

            if (Math.hypot(dx, dy) > 2) {
                state.dragMoved = true
                state.tapId = null
            }
            state.x += dx
            state.y += dy

            if (motion.inertiaEnabled) {
                const speed = Math.hypot(dx / dt, dy / dt) * motion.throwVelocityScale
                const clampedSpeed = clamp(
                    speed,
                    motion.throwMinSpeed,
                    motion.throwMaxSpeed,
                )
                const angle = Math.atan2(dy, dx)
                state.vx = Math.cos(angle) * clampedSpeed
                state.vy = Math.sin(angle) * clampedSpeed
            }

            if (motion.parallaxWhileDragging) {
                state.targetParallaxX += dx * 0.02
                state.targetParallaxY += dy * 0.02
            }

            state.lastX = event.clientX
            state.lastY = event.clientY
            state.lastTime = now
            publishView()
        },
        [
            isCanvas,
            motion.inertiaEnabled,
            motion.parallaxWhileDragging,
            motion.throwMaxSpeed,
            motion.throwMinSpeed,
            motion.throwVelocityScale,
            publishView,
            updateEdgeAndParallax,
        ],
    )

    const onPointerUp = React.useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            const state = movementRef.current
            if (!state.dragging || state.pointerId !== event.pointerId) return
            state.dragging = false
            state.pointerId = -1

            if (state.dragMoved) {
                state.suppressClickUntil = performance.now() + 180
            }

            rootRef.current?.releasePointerCapture?.(event.pointerId)

            // Open the tapped card here: pointer capture on the root retargets the
            // synthesized click to the root, so the card's own onClick never fires.
            if (!state.dragMoved && state.tapId) {
                const item = projects.find((p) => p.id === state.tapId)
                state.suppressClickUntil = performance.now() + 320
                if (item) openItem(item)
            }
            state.tapId = null
        },
        [openItem, projects],
    )

    const onWheel = React.useCallback(
        (event: React.WheelEvent<HTMLDivElement>) => {
            if (isCanvas || panelVisible) return
            event.preventDefault()
            const state = movementRef.current
            state.x -= event.deltaX
            state.y -= event.deltaY
            publishView()
        },
        [isCanvas, panelVisible, publishView],
    )

    const suppressOpen = React.useCallback(
        () => performance.now() < movementRef.current.suppressClickUntil,
        [],
    )

    const stepX = grid.cellSize + grid.columnGap
    const stepY = grid.cellSize + grid.rowGap
    const visibleCols = Math.ceil(viewport.width / stepX) + 8
    const visibleRows = Math.ceil(viewport.height / stepY) + 8
    const startCol = Math.floor((-view.x - view.px) / stepX) - 4
    const startRow = Math.floor((-view.y - view.py) / stepY) - 4
    const panelWidth = Math.min(panel.panelWidth, viewport.width)
    const stackPanelText = panelWidth < panel.stackBelow || viewport.width < 560

    const cards: React.ReactNode[] = []
    for (let row = 0; row < visibleRows; row += 1) {
        for (let col = 0; col < visibleCols; col += 1) {
            const gridCol = startCol + col
            const gridRow = startRow + row
            const item = projects[mod(gridCol * 11 + gridRow * 7, projects.length)]
            const ratio = item.width > 0 && item.height > 0 ? item.width / item.height : 1
            const seed = mod(gridCol * 17 + gridRow * 31, 100) / 100
            const variation = (seed - 0.5) * grid.sizeVariation
            const baseWidth = grid.useNaturalSize
                ? clamp(
                      grid.cellSize * (ratio >= 1 ? Math.min(ratio, 1.24) : 0.82) +
                          variation,
                      grid.cellSize * 0.64,
                      grid.cellSize + grid.sizeVariation,
                  )
                : grid.cellSize
            const baseHeight = grid.useNaturalSize
                ? clamp(baseWidth / ratio, grid.cellSize * 0.62, grid.cellSize + grid.sizeVariation)
                : grid.cellSize
            const x = gridCol * stepX + view.x + view.px
            const y = gridRow * stepY + view.y + view.py

            cards.push(
                <ArchiveCard
                    key={`${gridCol}:${gridRow}`}
                    item={item}
                    x={x}
                    y={y}
                    width={baseWidth}
                    height={baseHeight}
                    grid={grid}
                    visual={visual}
                    effects={effects}
                    onOpen={openItem}
                    suppressOpen={suppressOpen}
                />,
            )
        }
    }

    return (
        <div
            ref={rootRef}
            data-playground-root="true"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onMouseMove={(event) => updateEdgeAndParallax(event.clientX, event.clientY)}
            onWheel={onWheel}
            style={{
                ...props.style,
                position: "relative",
                width: "100%",
                height: "100%",
                minHeight: "100vh",
                overflow: "hidden",
                background: visual.backgroundColor,
                color: visual.textColor,
                fontFamily: "GT Standard L Regular, Inter, system-ui, sans-serif",
                letterSpacing: 0,
                cursor: isCanvas || panelVisible ? "default" : "grab",
                userSelect: "none",
                touchAction: "none",
            }}
        >
            <style>{buildGlobalCss(effects.navSelector)}</style>
            <div
                data-playground-grid="true"
                aria-hidden={panelOpen ? "true" : undefined}
                style={{
                    position: "absolute",
                    inset: 0,
                    transform: "translateZ(0)",
                    willChange: "transform",
                }}
            >
                {cards}
            </div>

            {panelVisible && (
                <button
                    type="button"
                    data-playground-backdrop="true"
                    aria-label="Close project details"
                    onClick={closePanel}
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 20,
                        border: 0,
                        padding: 0,
                        margin: 0,
                        background: "rgba(20, 20, 20, 0.02)",
                        opacity: panelOpen ? 1 : 0,
                        transition: `opacity 280ms ${SMOOTH_EASE}`,
                        pointerEvents: panelOpen ? "auto" : "none",
                        cursor: "default",
                    }}
                />
            )}

            <aside
                data-playground-detail-panel="true"
                data-playground-detail-open={panelOpen ? "true" : "false"}
                aria-hidden={!panelVisible}
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 30,
                    width: panelWidth,
                    maxWidth: "100vw",
                    background: visual.panelColor,
                    color: visual.textColor,
                    transform: panelOpen ? "translate3d(0,0,0)" : "translate3d(100%,0,0)",
                    transition: `transform ${panel.exitDurationMs}ms ${SNAPPY_EASE}`,
                    boxShadow: "-1px 0 0 rgba(35, 51, 36, 0.22)",
                    pointerEvents: panelVisible ? "auto" : "none",
                    display: "flex",
                    flexDirection: "column",
                    padding: viewport.width < 520 ? "22px 18px 28px" : "30px 32px 34px",
                    boxSizing: "border-box",
                    overflow: "auto",
                    WebkitOverflowScrolling: "touch",
                }}
            >
                {panelItem && (
                    <>
                        <button
                            type="button"
                            data-playground-detail-close="true"
                            aria-label="Close project details"
                            onClick={closePanel}
                            style={{
                                alignSelf: "flex-end",
                                width: 34,
                                height: 34,
                                border: 0,
                                borderRadius: 0,
                                padding: 0,
                                margin: "0 0 22px",
                                background: "transparent",
                                color: visual.textColor,
                                fontFamily:
                                    "GT Standard Mono Regular, SFMono-Regular, ui-monospace, monospace",
                                fontSize: 18,
                                lineHeight: "34px",
                                textAlign: "center",
                                cursor: "pointer",
                            }}
                        >
                            x
                        </button>

                        <figure
                            data-playground-detail-figure="true"
                            style={{
                                position: "relative",
                                width: "100%",
                                aspectRatio: `${panelItem.width} / ${panelItem.height}`,
                                maxHeight: `min(${panel.maxMediaHeight}px, calc(100vh - 260px))`,
                                minHeight: 180,
                                margin: 0,
                                flex: "0 0 auto",
                            }}
                        >
                            <MediaFrame
                                item={panelItem}
                                detail={true}
                                stroke={shouldDrawStroke(panelItem, effects.mediaStrokeMode)}
                                strokeColor={visual.strokeColor}
                                strokeWidth={visual.strokeWidth}
                                fadeMs={visual.mediaFadeMs}
                                fadeEasing={visual.mediaFadeEasing}
                                zoomPercent={0}
                            />
                        </figure>

                        <div
                            data-playground-detail-rule="true"
                            aria-hidden="true"
                            style={{
                                width: "100%",
                                height: 1,
                                margin: "28px 0 24px",
                                background: visual.ruleColor,
                                opacity: panelOpen ? 1 : 0.9,
                                transformOrigin: "left center",
                                animation: panelOpen
                                    ? `archive-playground-rule-in 520ms ${SNAPPY_EASE} both`
                                    : undefined,
                            }}
                        />

                        <div
                            data-playground-detail-copy="true"
                            style={{
                                display: "grid",
                                gridTemplateColumns: stackPanelText
                                    ? "1fr"
                                    : "minmax(0, 0.85fr) minmax(0, 1.15fr)",
                                columnGap: panel.columnGap,
                                rowGap: 18,
                                alignItems: "start",
                            }}
                        >
                            <div style={{ minWidth: 0 }}>
                                <div
                                    style={{
                                        color: visual.labelColor,
                                        fontFamily:
                                            "GT Standard Mono Regular, SFMono-Regular, ui-monospace, monospace",
                                        fontSize: 12,
                                        lineHeight: 1.2,
                                        textTransform: "uppercase",
                                        marginBottom: 12,
                                    }}
                                >
                                    {panelItem.category}
                                </div>
                                <h2
                                    style={{
                                        margin: 0,
                                        color: visual.textColor,
                                        fontSize: viewport.width < 520 ? 28 : 34,
                                        lineHeight: 1.02,
                                        fontWeight: 400,
                                        letterSpacing: 0,
                                        overflowWrap: "break-word",
                                    }}
                                >
                                    {panelItem.title}
                                </h2>
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <p
                                    style={{
                                        margin: 0,
                                        color: visual.mutedTextColor,
                                        fontSize: 15,
                                        lineHeight: 1.42,
                                        letterSpacing: 0,
                                        overflowWrap: "break-word",
                                    }}
                                >
                                    {panelItem.description}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </aside>
        </div>
    )
}

addPropertyControls<ArchivePlaygroundConsolidatedProps>(
    ArchivePlaygroundConsolidated,
    {
        projects: {
            type: ControlType.Array,
            title: "Projects",
            maxCount: 80,
            defaultValue: DEFAULT_PROJECTS,
            control: {
                type: ControlType.Object,
                buttonTitle: "Project",
                controls: {
                    title: {
                        type: ControlType.String,
                        title: "Title",
                        defaultValue: "Untitled Project",
                    },
                    category: {
                        type: ControlType.String,
                        title: "Label",
                        defaultValue: "Archive",
                    },
                    description: {
                        type: ControlType.String,
                        title: "Description",
                        defaultValue: "Brief project description.",
                        displayTextArea: true,
                    },
                    image: {
                        type: ControlType.ResponsiveImage,
                        title: "Image",
                    },
                    kind: {
                        type: ControlType.Enum,
                        title: "Type",
                        options: ["image", "video", "gif"],
                        optionTitles: ["Image", "Video", "GIF"],
                        defaultValue: "image",
                        displaySegmentedControl: true,
                    },
                    video: {
                        type: ControlType.File,
                        title: "Video",
                        allowedFileTypes: ["mp4", "mov", "m4v", "webm"],
                    },
                    poster: {
                        type: ControlType.ResponsiveImage,
                        title: "Poster",
                    },
                    stroke: {
                        type: ControlType.Enum,
                        title: "Stroke",
                        options: ["auto", "on", "off"],
                        optionTitles: ["Auto", "On", "Off"],
                        defaultValue: "auto",
                        displaySegmentedControl: true,
                    },
                    width: {
                        type: ControlType.Number,
                        title: "W",
                        defaultValue: 1600,
                        min: 1,
                        max: 8000,
                        hidden: () => true,
                    },
                    height: {
                        type: ControlType.Number,
                        title: "H",
                        defaultValue: 1000,
                        min: 1,
                        max: 8000,
                        hidden: () => true,
                    },
                },
            },
        },
        grid: {
            type: ControlType.Object,
            title: "Grid",
            icon: "object",
            controls: {
                cellSize: {
                    type: ControlType.Number,
                    title: "Cell",
                    defaultValue: DEFAULT_GRID.cellSize,
                    min: 80,
                    max: 360,
                    step: 1,
                    unit: "px",
                },
                columnGap: {
                    type: ControlType.Number,
                    title: "Columns",
                    defaultValue: DEFAULT_GRID.columnGap,
                    min: 0,
                    max: 180,
                    step: 1,
                    unit: "px",
                },
                rowGap: {
                    type: ControlType.Number,
                    title: "Rows",
                    defaultValue: DEFAULT_GRID.rowGap,
                    min: 0,
                    max: 220,
                    step: 1,
                    unit: "px",
                },
                hoverScale: {
                    type: ControlType.Number,
                    title: "Hover",
                    defaultValue: DEFAULT_GRID.hoverScale,
                    min: 1,
                    max: 1.15,
                    step: 0.005,
                },
                hoverImageZoom: {
                    type: ControlType.Number,
                    title: "Zoom",
                    defaultValue: DEFAULT_GRID.hoverImageZoom,
                    min: 0,
                    max: 12,
                    step: 0.5,
                    unit: "%",
                },
                showLabelsOnHover: {
                    type: ControlType.Boolean,
                    title: "Labels",
                    defaultValue: DEFAULT_GRID.showLabelsOnHover,
                    enabledTitle: "Show",
                    disabledTitle: "Hide",
                },
                useNaturalSize: {
                    type: ControlType.Boolean,
                    title: "Ratios",
                    defaultValue: DEFAULT_GRID.useNaturalSize,
                    enabledTitle: "Natural",
                    disabledTitle: "Square",
                },
                sizeVariation: {
                    type: ControlType.Number,
                    title: "Variation",
                    defaultValue: DEFAULT_GRID.sizeVariation,
                    min: 0,
                    max: 90,
                    step: 1,
                    unit: "px",
                },
            },
        },
        panel: {
            type: ControlType.Object,
            title: "Panel",
            icon: "object",
            controls: {
                panelWidth: {
                    type: ControlType.Number,
                    title: "Width",
                    defaultValue: DEFAULT_PANEL.panelWidth,
                    min: 300,
                    max: 760,
                    step: 1,
                    unit: "px",
                },
                columnGap: {
                    type: ControlType.Number,
                    title: "Gap",
                    defaultValue: DEFAULT_PANEL.columnGap,
                    min: 12,
                    max: 64,
                    step: 1,
                    unit: "px",
                },
                stackBelow: {
                    type: ControlType.Number,
                    title: "Stack",
                    defaultValue: DEFAULT_PANEL.stackBelow,
                    min: 260,
                    max: 700,
                    step: 1,
                    unit: "px",
                },
                exitDurationMs: {
                    type: ControlType.Number,
                    title: "Close",
                    defaultValue: DEFAULT_PANEL.exitDurationMs,
                    min: 200,
                    max: 1400,
                    step: 10,
                    unit: "ms",
                },
                maxMediaHeight: {
                    type: ControlType.Number,
                    title: "Media H",
                    defaultValue: DEFAULT_PANEL.maxMediaHeight,
                    min: 240,
                    max: 900,
                    step: 1,
                    unit: "px",
                },
            },
        },
        motion: {
            type: ControlType.Object,
            title: "Motion",
            icon: "effect",
            controls: {
                driftSpeedX: {
                    type: ControlType.Number,
                    title: "Drift X",
                    defaultValue: DEFAULT_MOTION.driftSpeedX,
                    min: -4,
                    max: 4,
                    step: 0.05,
                },
                driftSpeedY: {
                    type: ControlType.Number,
                    title: "Drift Y",
                    defaultValue: DEFAULT_MOTION.driftSpeedY,
                    min: -4,
                    max: 4,
                    step: 0.05,
                },
                driftWhilePanelOpen: {
                    type: ControlType.Boolean,
                    title: "Panel Drift",
                    defaultValue: DEFAULT_MOTION.driftWhilePanelOpen,
                    enabledTitle: "On",
                    disabledTitle: "Off",
                },
                panelDriftSpeedX: {
                    type: ControlType.Number,
                    title: "Panel X",
                    defaultValue: DEFAULT_MOTION.panelDriftSpeedX,
                    min: -3,
                    max: 3,
                    step: 0.05,
                },
                panelDriftSpeedY: {
                    type: ControlType.Number,
                    title: "Panel Y",
                    defaultValue: DEFAULT_MOTION.panelDriftSpeedY,
                    min: -3,
                    max: 3,
                    step: 0.05,
                },
                inertiaEnabled: {
                    type: ControlType.Boolean,
                    title: "Inertia",
                    defaultValue: DEFAULT_MOTION.inertiaEnabled,
                    enabledTitle: "On",
                    disabledTitle: "Off",
                },
                throwFriction: {
                    type: ControlType.Number,
                    title: "Friction",
                    defaultValue: DEFAULT_MOTION.throwFriction,
                    min: 0.4,
                    max: 0.98,
                    step: 0.01,
                },
                throwVelocityScale: {
                    type: ControlType.Number,
                    title: "Throw",
                    defaultValue: DEFAULT_MOTION.throwVelocityScale,
                    min: 0.2,
                    max: 4,
                    step: 0.05,
                },
                throwMinSpeed: {
                    type: ControlType.Number,
                    title: "Min V",
                    defaultValue: DEFAULT_MOTION.throwMinSpeed,
                    min: 0,
                    max: 1200,
                    step: 10,
                },
                throwMaxSpeed: {
                    type: ControlType.Number,
                    title: "Max V",
                    defaultValue: DEFAULT_MOTION.throwMaxSpeed,
                    min: 400,
                    max: 9000,
                    step: 50,
                },
                edgeScrollEnabled: {
                    type: ControlType.Boolean,
                    title: "Edges",
                    defaultValue: DEFAULT_MOTION.edgeScrollEnabled,
                    enabledTitle: "On",
                    disabledTitle: "Off",
                },
                edgeScrollSpeed: {
                    type: ControlType.Number,
                    title: "Edge V",
                    defaultValue: DEFAULT_MOTION.edgeScrollSpeed,
                    min: 0,
                    max: 800,
                    step: 10,
                },
                edgeScrollZone: {
                    type: ControlType.Number,
                    title: "Zone",
                    defaultValue: DEFAULT_MOTION.edgeScrollZone,
                    min: 30,
                    max: 220,
                    step: 1,
                    unit: "px",
                },
                parallaxStrength: {
                    type: ControlType.Number,
                    title: "Parallax",
                    defaultValue: DEFAULT_MOTION.parallaxStrength,
                    min: 0,
                    max: 0.2,
                    step: 0.005,
                },
                parallaxEase: {
                    type: ControlType.Number,
                    title: "Ease",
                    defaultValue: DEFAULT_MOTION.parallaxEase,
                    min: 0.05,
                    max: 1,
                    step: 0.05,
                },
                parallaxWhileDragging: {
                    type: ControlType.Boolean,
                    title: "Drag Para",
                    defaultValue: DEFAULT_MOTION.parallaxWhileDragging,
                    enabledTitle: "On",
                    disabledTitle: "Off",
                },
            },
        },
        visual: {
            type: ControlType.Object,
            title: "Style",
            icon: "color",
            controls: {
                backgroundColor: {
                    type: ControlType.Color,
                    title: "BG",
                    defaultValue: DEFAULT_VISUAL.backgroundColor,
                },
                panelColor: {
                    type: ControlType.Color,
                    title: "Panel",
                    defaultValue: DEFAULT_VISUAL.panelColor,
                },
                textColor: {
                    type: ControlType.Color,
                    title: "Text",
                    defaultValue: DEFAULT_VISUAL.textColor,
                },
                mutedTextColor: {
                    type: ControlType.Color,
                    title: "Muted",
                    defaultValue: DEFAULT_VISUAL.mutedTextColor,
                },
                labelColor: {
                    type: ControlType.Color,
                    title: "Label",
                    defaultValue: DEFAULT_VISUAL.labelColor,
                },
                ruleColor: {
                    type: ControlType.Color,
                    title: "Rule",
                    defaultValue: DEFAULT_VISUAL.ruleColor,
                },
                strokeColor: {
                    type: ControlType.Color,
                    title: "Stroke",
                    defaultValue: DEFAULT_VISUAL.strokeColor,
                },
                strokeWidth: {
                    type: ControlType.Number,
                    title: "Stroke W",
                    defaultValue: DEFAULT_VISUAL.strokeWidth,
                    min: 0,
                    max: 4,
                    step: 0.25,
                    unit: "px",
                },
                mediaFadeMs: {
                    type: ControlType.Number,
                    title: "Fade",
                    defaultValue: DEFAULT_VISUAL.mediaFadeMs,
                    min: 0,
                    max: 1600,
                    step: 10,
                    unit: "ms",
                },
                mediaFadeEasing: {
                    type: ControlType.String,
                    title: "Easing",
                    defaultValue: DEFAULT_VISUAL.mediaFadeEasing,
                },
            },
        },
        effects: {
            type: ControlType.Object,
            title: "Effects",
            icon: "effect",
            controls: {
                hideFooter: {
                    type: ControlType.Boolean,
                    title: "Footer",
                    defaultValue: DEFAULT_EFFECTS.hideFooter,
                    enabledTitle: "Hide",
                    disabledTitle: "Show",
                },
                navPassthrough: {
                    type: ControlType.Boolean,
                    title: "Nav Fix",
                    defaultValue: DEFAULT_EFFECTS.navPassthrough,
                    enabledTitle: "On",
                    disabledTitle: "Off",
                },
                navSelector: {
                    type: ControlType.String,
                    title: "Nav Sel",
                    defaultValue: DEFAULT_EFFECTS.navSelector,
                },
                mediaStrokeMode: {
                    type: ControlType.Enum,
                    title: "Strokes",
                    options: ["auto", "on", "off"],
                    optionTitles: ["Auto", "On", "Off"],
                    defaultValue: DEFAULT_EFFECTS.mediaStrokeMode,
                    displaySegmentedControl: true,
                },
            },
        },
    },
)

ArchivePlaygroundConsolidated.displayName = "Archive Playground"
