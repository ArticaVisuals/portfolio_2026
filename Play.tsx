import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

// @ts-ignore Framer code files can import project code components by module URL.
import ArchivePlayground from "https://framer.com/m/ArchivePlayground-hjPIIx.js"

type Kind = "image" | "video" | "gif"
type ImageValue = { src?: string; srcSet?: string; alt?: string } | string | null | undefined
type RawItem = [string, string, Kind, number, number, string, string?]
type ManagedItem = {
    id?: string
    title?: string
    category?: string
    description?: string
    accessibilityLabel?: string
    mediaType?: Kind
    image?: ImageValue
    poster?: ImageValue
    video?: string
    width?: number
    height?: number
    stroke?: boolean | "auto" | "on" | "off"
}

type Props = {
    archiveItems?: ManagedItem[]
    items?: ManagedItem[]
    advancedControls?: boolean
    backgroundColor?: string
    panelColor?: string
    textColor?: string
    mutedTextColor?: string
    labelColor?: string
    ruleColor?: string
    strokeColor?: string
    strokeWidth?: number
    cellSize?: number
    columnGap?: number
    rowGap?: number
    hoverScale?: number
    hoverImageZoom?: number
    panelWidth?: number
    panelExitMs?: number
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
    mediaFadeMs?: number
    loadInDelayMs?: number
    loadInFadeMs?: number
    loadInStaggerMs?: number
    loadInMaxWaitMs?: number
    hideFooter?: boolean
    navPassthrough?: boolean
    navSelector?: string
    patchEnabled?: boolean
    viewportFixEnabled?: boolean
    editorControlGuard?: boolean
    ancestorDepth?: number
    navHideOffset?: number
    style?: React.CSSProperties
}

type Snapshot = Partial<Pick<CSSStyleDeclaration, "position" | "top" | "right" | "bottom" | "left" | "width" | "height" | "minHeight" | "transform" | "zIndex">>

const RAW_ITEMS: RawItem[] = [
    ["001", "Untitled 2", "image", 1219, 1566, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/001-001-untitled-2.webp"],
    ["002", "RootGrwoth", "video", 1920, 1080, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/002-poster-002-poster-rootgrwoth.jpg", "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/002-002-rootgrwoth.mp4"],
    ["003", "AirPods Pro 3 Hero", "image", 1306, 1306, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/003-003-airpods-pro-3-hero.jpg"],
    ["004", "Untitled 1", "image", 3000, 2000, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/004-004-untitled-1.webp"],
    ["005", "Untitled 1", "image", 1588, 1059, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/005-005-untitled-1.webp"],
    ["006", "VisArt Com FA24 Poster Mockup", "image", 2986, 4478, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/006-006-visart-com-fa24-poster-mockup.jpg"],
    ["007", "AVL Truck Mockup Min 1", "image", 4000, 2250, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/007-007-avl-truck-mockup-min-1.png"],
    ["008", "IMG 2522", "image", 2316, 1510, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/008-008-img_2522.webp"],
    ["009", "Christmas Card 2020 Copy", "image", 2000, 1333, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/009-009-christmas-card-2020-copy.webp"],
    ["010", "IMG 4680", "image", 1600, 998, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/010-010-img_4680.png"],
    ["011", "MD2 WK03 RotatingCube MH", "video", 1920, 1080, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/011-poster-011-poster-md2_wk03_rotatingcube_mh.jpg", "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/011-011-md2_wk03_rotatingcube_mh.mp4"],
    ["012", "Original A4a05ca89b58af473aa281505ed92b89", "image", 1024, 1024, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/012-012-original-a4a05ca89b58af473aa281505ed92b89.png"],
    ["013", "Il 794xN.4695296984 Lxnq", "image", 794, 529, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/013-013-il_794xn.4695296984_lxnq.jpg"],
    ["014", "Flower", "video", 1920, 1080, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/014-poster-014-poster-flower.jpg", "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/014-014-flower.mp4"],
    ["015", "Gazelle Final", "image", 1012, 1800, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/015-015-gazelle-final.webp"],
    ["016", "DSC9572 1", "image", 1062, 739, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/016-016-_dsc9572-1.webp"],
    ["017", "Independent Lens Poster Mockup", "image", 3227, 4760, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/017-017-independent-lens-poster-mockup.webp"],
    ["018", "AB Bag", "image", 793, 818, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/018-018-ab-bag.png"],
    ["019", "Seek Truth Thumbnail", "image", 4800, 3784, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/019-019-seek-truth-thumbnail.webp"],
    ["020", "Teacaps Billboard Mockup", "image", 1800, 1354, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/020-020-teacaps-billboard-mockup.jpg"],
    ["021", "MicahHoang 3 Final Online Video Cutter.Com", "video", 1920, 1080, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/021-poster-021-poster-micahhoang_3_final-online-video-cutter.jpg", "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/021-021-micahhoang_3_final-online-video-cutter.com.mp4"],
    ["022", "DevWars Ranking System", "image", 2400, 1801, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/022-022-devwars-ranking-system.png"],
    ["023", "MicahHoangMotionFinalFinal 1 Ezgif.Com Video To Gif Converter", "gif", 600, 338, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/023-023-micahhoangmotionfinalfinal_1-ezgif.com-video-to-gif-converter.gif"],
    ["024", "DSC03254", "image", 5299, 3693, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/024-024-dsc03254.webp"],
    ["025", "Untitled 1", "image", 1598, 2000, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/025-025-untitled-1.jpg"],
    ["026", "HMCTEmailBlast", "gif", 1920, 1080, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/026-026-hmctemailblast.gif"],
    ["027", "IMG 5149 Edit 2", "image", 3648, 2432, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/027-027-img_5149-edit-2.jpg"],
    ["028", "Process Book Mockup 1", "image", 933, 700, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/028-028-process-book-mockup-1.png"],
    ["029", "Slide 1", "video", 1920, 1920, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/029-poster-029-poster-slide-1.jpg", "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/029-029-slide-1.mp4"],
    ["030", "TrackBeast First Look", "image", 2401, 1801, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/030-030-trackbeast-first-look.png"],
    ["031", "Slide 1", "video", 1080, 1080, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/031-poster-031-poster-slide-1.jpg", "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/031-031-slide-1.mp4"],
    ["032", "Cellular Symphony Apple Devices HD Best Quality", "video", 1920, 1080, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/032-poster-032-poster-cellular-symphony-apple-devices-hd-best-quality.webp", "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/032-032-cellular-symphony-apple-devices-hd-best-quality.mp4"],
    ["033", "Il 1588xN.4553485979 A78d", "image", 1588, 1196, "https://raw.githubusercontent.com/ArticaVisuals/portfolio_2026/b2cd6f7c07a8680e7190e1cc58972fd294311d55/case-study-assets/optimized/play-archive-under-1mb-2026-06-12/media/033-033-il_1588xn.4553485979_a78d.jpg"],
]

const CREAM = "rgb(247, 245, 240)"
const BLACK = "rgb(20, 20, 20)"
const MUTED = "rgb(85, 85, 85)"
const LABEL = "rgb(151, 151, 151)"
const RULE = "rgb(35, 51, 36)"
const DEFAULT_NAV_SELECTOR = "header, nav, [data-framer-name*='Navigation' i], [data-framer-name*='Nav' i]"
const ROOT_SELECTOR = "[data-playground-root='true']"
const CARD_SELECTOR = "[data-playground-card='true']"
const EDITOR_LABEL_ID = "__framer-editorbar-label"
const LOAD_IN_DELAY_MS = 70
const LOAD_IN_FADE_MS = 1280
const LOAD_IN_STAGGER_MS = 58
const LOAD_IN_MAX_WAIT_MS = 2600

const canUseDOM = () => typeof window !== "undefined" && typeof document !== "undefined"
const isCanvas = () => RenderTarget.current() === RenderTarget.canvas || RenderTarget.current() === RenderTarget.thumbnail
const defaultCategory = (kind: Kind) => (kind === "video" ? "Archive Video" : kind === "gif" ? "Archive GIF" : "Archive Image")
const DEFAULT_STROKE_ON_IDS = new Set(["003", "006", "008", "012", "015", "018", "019", "021", "024", "025", "033"])
const defaultStroke = (order: string) => (DEFAULT_STROKE_ON_IDS.has(order) ? "on" : "auto")

const DEFAULT_CONTENT_ITEMS: ManagedItem[] = RAW_ITEMS.map(([order, title, kind, width, height, thumbnail, video = ""]) => ({
    id: order,
    title,
    category: defaultCategory(kind),
    description: `${width} x ${height} ${kind.toUpperCase()} from the archive.`,
    mediaType: kind,
    image: { src: thumbnail },
    poster: { src: thumbnail },
    video,
    width,
    height,
    stroke: defaultStroke(order),
}))

function imageSource(value: ImageValue) {
    if (!value) return ""
    if (typeof value === "string") return value
    return value.src || ""
}

function hasMedia(item: ManagedItem) {
    return Boolean(imageSource(item.image) || imageSource(item.poster) || item.video)
}

function resolveItems(items?: ManagedItem[]) {
    if (!Array.isArray(items) || !items.length) return DEFAULT_CONTENT_ITEMS
    return items.some(hasMedia) ? items : DEFAULT_CONTENT_ITEMS
}

function useViewportFix(enabled: boolean, containerRef: React.RefObject<HTMLDivElement>, ancestorDepth: number) {
    React.useEffect(() => {
        if (!enabled || !canUseDOM() || isCanvas()) return
        let raf = 0
        const touched = new Map<HTMLElement, Snapshot>()
        const remember = (element: HTMLElement) => {
            if (touched.has(element)) return
            touched.set(element, {
                position: element.style.position,
                top: element.style.top,
                right: element.style.right,
                bottom: element.style.bottom,
                left: element.style.left,
                width: element.style.width,
                height: element.style.height,
                minHeight: element.style.minHeight,
                transform: element.style.transform,
                zIndex: element.style.zIndex,
            })
        }
        const forceViewport = () => {
            const root = containerRef.current?.querySelector<HTMLElement>(ROOT_SELECTOR)
            if (!root) return
            remember(root)
            root.style.width = "100%"
            root.style.height = "100%"
            root.style.minHeight = "100vh"
            let element: HTMLElement | null = root.parentElement
            for (let index = 0; element && element !== document.body && index < ancestorDepth; index += 1) {
                remember(element)
                element.style.position = "fixed"
                element.style.top = "0px"
                element.style.right = "0px"
                element.style.bottom = "0px"
                element.style.left = "0px"
                element.style.width = "100vw"
                element.style.height = "100vh"
                element.style.minHeight = "100vh"
                element.style.transform = "none"
                if (index === 0) element.style.zIndex = "0"
                element = element.parentElement
            }
        }
        const loop = () => {
            forceViewport()
            raf = window.requestAnimationFrame(loop)
        }
        raf = window.requestAnimationFrame(loop)
        forceViewport()
        return () => {
            window.cancelAnimationFrame(raf)
            touched.forEach((style, element) => {
                Object.entries(style).forEach(([key, value]) => {
                    ;(element.style as any)[key] = value || ""
                })
            })
        }
    }, [ancestorDepth, containerRef, enabled])
}

function usePublicEditorControlGuard(enabled: boolean) {
    React.useEffect(() => {
        if (!enabled || !canUseDOM() || isCanvas()) return
        let styleEl = document.getElementById("play-editor-guard-style") as HTMLStyleElement | null
        if (!styleEl) {
            styleEl = document.createElement("style")
            styleEl.id = "play-editor-guard-style"
            document.head.appendChild(styleEl)
        }
        styleEl.textContent = `
            #${EDITOR_LABEL_ID},
            #${EDITOR_LABEL_ID} *,
            [aria-labelledby~='${EDITOR_LABEL_ID}'],
            :where(button, a, div, aside, section):has(> #${EDITOR_LABEL_ID}) {
                display: none !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }
        `
        return () => {
            if (styleEl?.parentNode) styleEl.parentNode.removeChild(styleEl)
        }
    }, [enabled])
}

function useCardStrokeHoverPatch(enabled: boolean) {
    React.useEffect(() => {
        if (!enabled || !canUseDOM() || isCanvas()) return
        let styleEl = document.getElementById("play-card-hover-style") as HTMLStyleElement | null
        if (!styleEl) {
            styleEl = document.createElement("style")
            styleEl.id = "play-card-hover-style"
            document.head.appendChild(styleEl)
        }
        styleEl.textContent = `
            [data-play-root='true'] ${CARD_SELECTOR} {
                overflow: visible !important;
            }
        `
        return () => {
            if (styleEl?.parentNode) styleEl.parentNode.removeChild(styleEl)
        }
    }, [enabled])
}

function usePtRevealReplay(enabled: boolean, containerRef: React.RefObject<HTMLDivElement>, fadeMs: number, staggerMs: number) {
    React.useEffect(() => {
        if (!enabled || !canUseDOM() || isCanvas()) return
        const onReveal = () => {
            try {
                if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
                const root = containerRef.current?.querySelector<HTMLElement>(ROOT_SELECTOR)
                if (!root) return
                const cards = Array.from(root.querySelectorAll<HTMLElement>(CARD_SELECTOR))
                cards.forEach((card, index) => {
                    try {
                        const fadeDuration = Math.max(1200, Math.round(fadeMs * 1.05))
                        const staggerUnit = Math.max(1, staggerMs)
                        const randomSpread = Math.max(850, staggerUnit * 20)
                        const gridOffset = (index % 13) * Math.max(10, staggerUnit * 0.55)
                        const anim = card.animate([{ opacity: 0 }, { opacity: 1 }], {
                            duration: fadeDuration,
                            delay: Math.min(Math.random() * randomSpread + gridOffset, randomSpread + staggerUnit * 8),
                            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                            fill: "both",
                        })
                        anim.onfinish = () => {
                            try {
                                anim.cancel()
                            } catch (error) {}
                        }
                    } catch (error) {}
                })
            } catch (error) {}
        }
        window.addEventListener("pt:reveal", onReveal)
        return () => window.removeEventListener("pt:reveal", onReveal)
    }, [containerRef, enabled, fadeMs, staggerMs])
}

export default function Play(props: Props) {
    const {
        patchEnabled = true,
        viewportFixEnabled = true,
        editorControlGuard = true,
        ancestorDepth = 4,
        navHideOffset = 120,
        style,
        navSelector = DEFAULT_NAV_SELECTOR,
        archiveItems,
        items,
        ...archiveProps
    } = props
    const containerRef = React.useRef<HTMLDivElement>(null)
    const active = !isCanvas()
    const managedItems = archiveItems ?? items
    const resolvedItems = React.useMemo(() => resolveItems(managedItems), [managedItems])
    const loadInDelayMs = props.loadInDelayMs ?? LOAD_IN_DELAY_MS
    const loadInFadeMs = props.loadInFadeMs ?? LOAD_IN_FADE_MS
    const loadInStaggerMs = props.loadInStaggerMs ?? LOAD_IN_STAGGER_MS
    const loadInMaxWaitMs = props.loadInMaxWaitMs ?? LOAD_IN_MAX_WAIT_MS

    useViewportFix(active && viewportFixEnabled, containerRef, ancestorDepth)
    useCardStrokeHoverPatch(active)
    usePtRevealReplay(active && patchEnabled, containerRef, loadInFadeMs, loadInStaggerMs)
    usePublicEditorControlGuard(active && editorControlGuard)

    return (
        <div ref={containerRef} data-play-root="true" data-play-nav-hide-offset={navHideOffset} style={{ width: "100%", height: "100%", minHeight: "100vh", ...style }}>
            <ArchivePlayground
                {...archiveProps}
                items={resolvedItems}
                navSelector={navSelector}
                loadInDelayMs={loadInDelayMs}
                loadInFadeMs={loadInFadeMs}
                loadInStaggerMs={loadInStaggerMs}
                loadInMaxWaitMs={loadInMaxWaitMs}
            />
        </div>
    )
}

const hideAdvanced = ({ advancedControls }: Partial<Props>) => !advancedControls
const hideInternal = () => true
const hideUnlessVideo = ({ mediaType }: any) => mediaType !== "video"

addPropertyControls<Props>(Play, {
    archiveItems: {
        type: ControlType.Array,
        title: "Archive Items",
        maxCount: 120,
        defaultValue: DEFAULT_CONTENT_ITEMS,
        control: {
            type: ControlType.Object,
            controls: {
                id: { type: ControlType.String, title: "ID", defaultValue: "", hidden: hideInternal },
                title: { type: ControlType.String, title: "Title", defaultValue: "Archive Item" },
                accessibilityLabel: { type: ControlType.String, title: "A11y Label", defaultValue: "" },
                description: { type: ControlType.String, title: "Description", defaultValue: "", displayTextArea: true },
                mediaType: { type: ControlType.Enum, title: "Type", options: ["image", "video", "gif"], optionTitles: ["Image", "Video", "GIF"], defaultValue: "image" },
                image: { type: ControlType.ResponsiveImage, title: "Media / Poster" },
                video: { type: ControlType.File, title: "Video", allowedFileTypes: ["mp4", "mov", "m4v", "webm"], hidden: hideUnlessVideo },
                category: { type: ControlType.String, title: "Category", defaultValue: "Archive Image" },
                width: { type: ControlType.Number, title: "Aspect W", defaultValue: 1600, min: 1, max: 8000, step: 1 },
                height: { type: ControlType.Number, title: "Aspect H", defaultValue: 1000, min: 1, max: 8000, step: 1 },
                stroke: { type: ControlType.Enum, title: "Stroke", options: ["auto", "on", "off"], optionTitles: ["Auto", "On", "Off"], defaultValue: "auto" },
            },
        },
    },
    advancedControls: { type: ControlType.Boolean, title: "Advanced", defaultValue: false, enabledTitle: "Show", disabledTitle: "Hide" },
    cellSize: { type: ControlType.Number, title: "Cell", defaultValue: 190, min: 100, max: 360, step: 1, unit: "px", hidden: hideAdvanced },
    columnGap: { type: ControlType.Number, title: "Column", defaultValue: 72, min: 0, max: 200, step: 1, unit: "px", hidden: hideAdvanced },
    rowGap: { type: ControlType.Number, title: "Row", defaultValue: 88, min: 0, max: 220, step: 1, unit: "px", hidden: hideAdvanced },
    hoverScale: { type: ControlType.Number, title: "Hover", defaultValue: 1.035, min: 1, max: 1.15, step: 0.005, hidden: hideAdvanced },
    hoverImageZoom: { type: ControlType.Number, title: "Zoom", defaultValue: 4, min: 0, max: 12, step: 0.5, unit: "%", hidden: hideAdvanced },
    panelWidth: { type: ControlType.Number, title: "Panel", defaultValue: 500, min: 300, max: 760, step: 1, unit: "px", hidden: hideAdvanced },
    panelExitMs: { type: ControlType.Number, title: "Close", defaultValue: 950, min: 200, max: 1400, step: 10, unit: "ms", hidden: hideAdvanced },
    driftSpeedX: { type: ControlType.Number, title: "Drift X", defaultValue: 0.5, min: -3, max: 3, step: 0.05, hidden: hideAdvanced },
    driftSpeedY: { type: ControlType.Number, title: "Drift Y", defaultValue: 0.5, min: -3, max: 3, step: 0.05, hidden: hideAdvanced },
    driftWhilePanelOpen: { type: ControlType.Boolean, title: "Panel Drift", defaultValue: true, enabledTitle: "On", disabledTitle: "Off", hidden: hideAdvanced },
    panelDriftSpeedX: { type: ControlType.Number, title: "Panel X", defaultValue: 0.5, min: -3, max: 3, step: 0.05, hidden: hideAdvanced },
    panelDriftSpeedY: { type: ControlType.Number, title: "Panel Y", defaultValue: 0.5, min: -3, max: 3, step: 0.05, hidden: hideAdvanced },
    inertiaEnabled: { type: ControlType.Boolean, title: "Inertia", defaultValue: true, enabledTitle: "On", disabledTitle: "Off", hidden: hideAdvanced },
    throwFriction: { type: ControlType.Number, title: "Friction", defaultValue: 0.85, min: 0.4, max: 0.98, step: 0.01, hidden: hideAdvanced },
    throwVelocityScale: { type: ControlType.Number, title: "Throw", defaultValue: 1.75, min: 0.2, max: 4, step: 0.05, hidden: hideAdvanced },
    throwMinSpeed: { type: ControlType.Number, title: "Min V", defaultValue: 220, min: 0, max: 1200, step: 10, hidden: hideAdvanced },
    throwMaxSpeed: { type: ControlType.Number, title: "Max V", defaultValue: 5200, min: 400, max: 9000, step: 50, hidden: hideAdvanced },
    edgeScrollEnabled: { type: ControlType.Boolean, title: "Edges", defaultValue: true, enabledTitle: "On", disabledTitle: "Off", hidden: hideAdvanced },
    edgeScrollSpeed: { type: ControlType.Number, title: "Edge V", defaultValue: 220, min: 0, max: 800, step: 10, hidden: hideAdvanced },
    edgeScrollZone: { type: ControlType.Number, title: "Zone", defaultValue: 90, min: 30, max: 220, step: 1, unit: "px", hidden: hideAdvanced },
    parallaxStrength: { type: ControlType.Number, title: "Parallax", defaultValue: 0.06, min: 0, max: 0.2, step: 0.005, hidden: hideAdvanced },
    parallaxEase: { type: ControlType.Number, title: "Ease", defaultValue: 0.5, min: 0.05, max: 1, step: 0.05, hidden: hideAdvanced },
    parallaxWhileDragging: { type: ControlType.Boolean, title: "Drag Para", defaultValue: true, enabledTitle: "On", disabledTitle: "Off", hidden: hideAdvanced },
    mediaFadeMs: { type: ControlType.Number, title: "Fade", defaultValue: 700, min: 0, max: 1600, step: 10, unit: "ms", hidden: hideAdvanced },
    loadInDelayMs: { type: ControlType.Number, title: "Load Hold", defaultValue: LOAD_IN_DELAY_MS, min: 0, max: 1000, step: 10, unit: "ms", hidden: hideAdvanced },
    loadInFadeMs: { type: ControlType.Number, title: "Load Fade", defaultValue: LOAD_IN_FADE_MS, min: 0, max: 2600, step: 10, unit: "ms", hidden: hideAdvanced },
    loadInStaggerMs: { type: ControlType.Number, title: "Load Stagger", defaultValue: LOAD_IN_STAGGER_MS, min: 0, max: 180, step: 1, unit: "ms", hidden: hideAdvanced },
    loadInMaxWaitMs: { type: ControlType.Number, title: "Load Max", defaultValue: LOAD_IN_MAX_WAIT_MS, min: 400, max: 5500, step: 50, unit: "ms", hidden: hideAdvanced },
    backgroundColor: { type: ControlType.Color, title: "BG", defaultValue: CREAM, hidden: hideAdvanced },
    panelColor: { type: ControlType.Color, title: "Panel", defaultValue: CREAM, hidden: hideAdvanced },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: BLACK, hidden: hideAdvanced },
    mutedTextColor: { type: ControlType.Color, title: "Muted", defaultValue: MUTED, hidden: hideAdvanced },
    labelColor: { type: ControlType.Color, title: "Label", defaultValue: LABEL, hidden: hideAdvanced },
    ruleColor: { type: ControlType.Color, title: "Rule", defaultValue: RULE, hidden: hideAdvanced },
    strokeColor: { type: ControlType.Color, title: "Stroke", defaultValue: LABEL, hidden: hideAdvanced },
    strokeWidth: { type: ControlType.Number, title: "Stroke W", defaultValue: 0.5, min: 0, max: 4, step: 0.25, unit: "px", hidden: hideAdvanced },
    hideFooter: { type: ControlType.Boolean, title: "Footer", defaultValue: true, enabledTitle: "Hide", disabledTitle: "Show", hidden: hideAdvanced },
    navPassthrough: { type: ControlType.Boolean, title: "Nav Fix", defaultValue: true, enabledTitle: "On", disabledTitle: "Off", hidden: hideAdvanced },
    navSelector: { type: ControlType.String, title: "Nav Sel", defaultValue: DEFAULT_NAV_SELECTOR, hidden: hideAdvanced },
    patchEnabled: { type: ControlType.Boolean, title: "Replay", defaultValue: true, enabledTitle: "On", disabledTitle: "Off", hidden: hideAdvanced },
    viewportFixEnabled: { type: ControlType.Boolean, title: "Viewport", defaultValue: true, enabledTitle: "On", disabledTitle: "Off", hidden: hideAdvanced },
    editorControlGuard: { type: ControlType.Boolean, title: "Editor UI", defaultValue: true, enabledTitle: "Hide", disabledTitle: "Show", hidden: hideAdvanced },
    ancestorDepth: { type: ControlType.Number, title: "Depth", defaultValue: 4, min: 1, max: 8, step: 1, hidden: hideAdvanced },
    navHideOffset: { type: ControlType.Number, title: "Nav Hide", defaultValue: 120, min: 60, max: 240, step: 1, unit: "px", hidden: hideAdvanced },
})

Play.displayName = "Play"
