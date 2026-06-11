import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

type Kind = "image" | "video" | "gif"
type RawItem = [string, string, Kind, number, number, string, string?]
type ImageValue = { src?: string; srcSet?: string; alt?: string } | string | null | undefined
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
type Item = {
    id: string
    title: string
    category: string
    description: string
    kind: Kind
    width: number
    height: number
    thumbnail: string
    videoUrl: string
    accessibilityLabel: string
    stroke?: boolean
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
    style?: React.CSSProperties
}

type Motion = { x: number; y: number; mx: number; my: number; dragging: boolean }

type InternalState = {
    x: number
    y: number
    vx: number
    vy: number
    mx: number
    my: number
    targetMx: number
    targetMy: number
    edgeX: number
    edgeY: number
    inside: boolean
    down: boolean
    dragging: boolean
    startX: number
    startY: number
    originX: number
    originY: number
    lastX: number
    lastY: number
    lastT: number
    suppressClick: boolean
    tapIndex: number
    tapElement: HTMLElement | null
    lastFrameT: number
}

const RAW_ITEMS: RawItem[] = [
    ["001", "Untitled 2", "image", 1219, 1566, "https://freight.cargo.site/t/original/i/P2188739791288083579115147613717/Untitled-2.png"],
    ["002", "RootGrwoth", "video", 1920, 1080, "https://freight.cargo.site/t/original/i/X2649446305161701741114404623893/RootGrwoth.jpg", "https://freight.cargo.site/t/original/i/W2649446300365548281949921203733/RootGrwoth.mp4"],
    ["003", "AirPods Pro 3 Hero", "image", 1306, 1306, "https://freight.cargo.site/t/original/i/B2558373790970332005928259540501/AirPods-Pro-3-Hero.jpg"],
    ["004", "Untitled 1", "image", 3000, 2000, "https://freight.cargo.site/t/original/i/C2283847322832324823936936433173/Untitled-1.png"],
    ["005", "Untitled 1", "image", 1588, 1059, "https://freight.cargo.site/t/original/i/F2250541485363637417331537466901/Untitled-1.png"],
    ["006", "VisArt Com FA24 Poster Mockup", "image", 2986, 4478, "https://freight.cargo.site/t/original/i/G2196608913004046629699366147605/VisArt-Com-FA24-Poster-Mockup.jpg"],
    ["007", "AVL Truck Mockup Min 1", "image", 4000, 2250, "https://freight.cargo.site/t/original/i/C2250533449076475193912795059733/AVL-Truck-Mockup-min-1.png"],
    ["008", "IMG 2522", "image", 2316, 1510, "https://freight.cargo.site/t/original/i/Y1655438473919868746064881505813/IMG_2522.png"],
    ["009", "Christmas Card 2020 Copy", "image", 2000, 1333, "https://freight.cargo.site/t/original/i/X2283837639287810306402653820437/Christmas-Card-2020-copy.png"],
    ["010", "IMG 4680", "image", 1600, 998, "https://freight.cargo.site/t/original/i/N2408686988067186379802246632981/IMG_4680.PNG"],
    ["011", "MD2 WK03 RotatingCube MH", "video", 1920, 1080, "https://freight.cargo.site/t/original/i/R2626186471525519680749229561365/MD2_WK03_RotatingCube_MH.jpg", "https://freight.cargo.site/t/original/i/H2626186461822532297978005411349/MD2_WK03_RotatingCube_MH.mp4"],
    ["012", "Original A4a05ca89b58af473aa281505ed92b89", "image", 1024, 1024, "https://freight.cargo.site/t/original/i/U2251593566395153013662831334933/original-a4a05ca89b58af473aa281505ed92b89.png"],
    ["013", "Il 794xN.4695296984 Lxnq", "image", 794, 529, "https://freight.cargo.site/t/original/i/K2251597109295266554393024255509/il_794xN.4695296984_lxnq.jpg"],
    ["014", "Flower", "video", 1920, 1080, "https://freight.cargo.site/t/original/i/N2649449445627646569797019489813/Flower.jpg", "https://freight.cargo.site/t/original/i/D2649449436570295229605629646357/Flower.mp4"],
    ["015", "Gazelle Final", "image", 1012, 1800, "https://freight.cargo.site/t/original/i/G2283853859952596176980419008021/Gazelle-Final.png"],
    ["016", "DSC9572 1", "image", 1062, 739, "https://freight.cargo.site/t/original/i/Y2250529952735943695225510417941/_DSC9572-1.png"],
    ["017", "Independent Lens Poster Mockup", "image", 3227, 4760, "https://freight.cargo.site/t/original/i/M1547656418279722570375177164309/Independent-Lens-Poster-Mockup.png"],
    ["018", "AB Bag", "image", 793, 818, "https://freight.cargo.site/t/original/i/B2251633459471460770528832509461/AB-Bag.png"],
    ["019", "Seek Truth Thumbnail", "image", 4800, 3784, "https://freight.cargo.site/t/original/i/N1547679404841299796142284068373/Seek-Truth-Thumbnail.png"],
    ["020", "Teacaps Billboard Mockup", "image", 1800, 1354, "https://freight.cargo.site/t/original/i/G2283816417286430939470125848085/Teacaps-billboard-mockup.jpg"],
    ["021", "MicahHoang 3 Final Online Video Cutter.Com", "video", 1920, 1080, "https://freight.cargo.site/t/original/i/X1525933261254490830714347705877/MicahHoang_3_Final-online-video-cutter.jpg", "https://freight.cargo.site/t/original/i/S1525933248544684163928466642453/MicahHoang_3_Final-online-video-cutter.com.mp4"],
    ["022", "DevWars Ranking System", "image", 2400, 1801, "https://freight.cargo.site/t/original/i/T2283821659445268318103084979733/DevWars-Ranking-System.png"],
    ["023", "MicahHoangMotionFinalFinal 1 Ezgif.Com Video To Gif Converter", "gif", 600, 338, "https://freight.cargo.site/t/original/i/I2244538183317969342209712182805/MicahHoangMotionFinalFinal_1-ezgif.com-video-to-gif-converter.gif"],
    ["024", "DSC03254", "image", 5299, 3693, "https://freight.cargo.site/t/original/i/Q2244531664958036712128843601429/DSC03254.png"],
    ["025", "Untitled 1", "image", 1598, 2000, "https://freight.cargo.site/t/original/i/U2244551962150348687706710857237/Untitled-1.png"],
    ["026", "HMCTEmailBlast", "gif", 1920, 1080, "https://freight.cargo.site/t/original/i/G2250544389785045078826729854485/HMCTEmailBlast.gif"],
    ["027", "IMG 5149 Edit 2", "image", 3648, 2432, "https://freight.cargo.site/t/original/i/N2752991907198854043636255151637/IMG_5149-Edit-2.jpg"],
    ["028", "Process Book Mockup 1", "image", 933, 700, "https://freight.cargo.site/t/original/i/P2244537370775786383451382601237/Process-Book-Mockup-1.png"],
    ["029", "Slide 1", "video", 1920, 1920, "https://freight.cargo.site/t/original/i/O2292210683679695964626181412373/Slide-1.jpg", "https://freight.cargo.site/t/original/i/F2292210670065998838228532319765/Slide-1.mp4"],
    ["030", "TrackBeast First Look", "image", 2401, 1801, "https://freight.cargo.site/t/original/i/O2283835809112543777383199790613/TrackBeast-First-Look.png"],
    ["031", "Slide 1", "video", 1080, 1080, "https://freight.cargo.site/t/original/i/F2335206701381019332535229077013/Slide-1.jpg", "https://freight.cargo.site/t/original/i/P2335206683026508979194225219093/Slide-1.mp4"],
    ["032", "Cellular Symphony Apple Devices HD Best Quality", "video", 1920, 1080, "https://freight.cargo.site/t/original/i/X1779235248420239436213479790101/cellular-symphony-Apple-Devices-HD-Best-Quality.jpg", "https://freight.cargo.site/t/original/i/K1779235211065582686951637767701/cellular-symphony-Apple-Devices-HD-Best-Quality.m4v"],
    ["033", "Il 1588xN.4553485979 A78d", "image", 1588, 1196, "https://freight.cargo.site/t/original/i/S2250538151022412373961535116821/il_1588xN.4553485979_a78d.jpg"],
]

const AUTO_STROKE_MATCHERS = [
    "B2558373790970332005928259540501",
    "G2196608913004046629699366147605",
    "Y1655438473919868746064881505813",
    "U2251593566395153013662831334933",
    "G2283853859952596176980419008021",
    "B2251633459471460770528832509461",
    "N1547679404841299796142284068373",
    "S1525933248544684163928466642453",
    "X1525933261254490830714347705877",
    "Q2244531664958036712128843601429",
    "U2244551962150348687706710857237",
    "S2250538151022412373961535116821",
]

const CREAM = "rgb(247, 245, 240)"
const BLACK = "rgb(20, 20, 20)"
const MUTED = "rgb(85, 85, 85)"
const LABEL = "rgb(151, 151, 151)"
const RULE = "rgb(35, 51, 36)"
const MONO = "'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace"
const DISPLAY = "'GT Standard Trial', 'Inter', system-ui, sans-serif"
const MODAL_Z = 2147483646
const TAP_THRESHOLD = 18
const NAV_REVEAL_MS = 560
const DEFAULT_NAV_SELECTOR = "header, nav, [data-framer-name*='Navigation' i], [data-framer-name*='Nav' i]"
const INTERACTIVE_SELECTOR = "a, a *, button, button *, [href], [href] *, [role='link'], [role='link'] *, [role='button'], [role='button'] *"
const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
].join(", ")
const NAV_EXIT_MANAGED_CLASS = "playground-nav-exit-managed"
const NAV_EXIT_HIDDEN_CLASS = "playground-nav-exit-hidden"
const NAV_EXIT_STYLE_ID = "playground-nav-exit-reveal-style"
const DRAFT_ANIMATION_STYLE_ID = "playground-animation-style"
const LOAD_IN_DELAY_MS = 70
const LOAD_IN_FADE_MS = 1280
const LOAD_IN_STAGGER_MS = 58
const LOAD_IN_STAGGER_SLOTS = 15
const LOAD_IN_LIFT_PX = 12
const LOAD_IN_EASE = "cubic-bezier(0.16, 1, 0.3, 1)"
const LOAD_IN_MAX_WAIT_MS = 2600

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
const mod = (value: number, length: number) => ((value % length) + length) % length
const canUseDOM = () => typeof window !== "undefined" && typeof document !== "undefined"
const now = () => (typeof performance !== "undefined" ? performance.now() : Date.now())
const defaultCategory = (kind: Kind) => (kind === "video" ? "Archive Video" : kind === "gif" ? "Archive GIF" : "Archive Image")

function imageSource(value: ImageValue) {
    if (!value) return ""
    if (typeof value === "string") return value
    return value.src || ""
}

function imageAlt(value: ImageValue) {
    if (!value || typeof value === "string") return ""
    return (value.alt || "").trim()
}

function isAssetLikeTitle(value: string) {
    const normalized = value.trim()
    if (!normalized) return true
    return [
        /^untitled(?:\s+\d+)?$/i,
        /^img[\s_-]?\d+/i,
        /^_?dsc[\s_-]?\d+/i,
        /^slide\s+\d+$/i,
        /^original[\s_-]+[a-f0-9]{12,}$/i,
        /^il[\s_-]?\d+x/i,
        /ezgif/i,
        /online video cutter/i,
        /video to gif converter/i,
    ].some((pattern) => pattern.test(normalized))
}

function accessibleItemLabel(title: string, category: string, kind: Kind, index: number, explicitLabel = "") {
    const explicit = explicitLabel.trim()
    if (explicit) return explicit
    if (!isAssetLikeTitle(title)) return title

    const readableKind = kind === "gif" ? "GIF" : kind.charAt(0).toUpperCase() + kind.slice(1)
    const readableCategory = category || defaultCategory(kind)
    return `${readableCategory} ${index + 1}, ${readableKind.toLowerCase()}`
}

function isFocusableElement(element: HTMLElement) {
    if (element.hasAttribute("disabled") || element.getAttribute("aria-hidden") === "true") return false
    if (!canUseDOM()) return true
    const style = window.getComputedStyle(element)
    return style.display !== "none" && style.visibility !== "hidden"
}

function stableHash(value: string) {
    let hash = 5381
    for (let index = 0; index < value.length; index++) hash = (hash * 33) ^ value.charCodeAt(index)
    return (hash >>> 0).toString(36)
}

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
    stroke: "auto",
}))

function normalizeItem(entry: ManagedItem, index: number): Item | null {
    const requestedKind = entry.mediaType === "video" || entry.mediaType === "gif" ? entry.mediaType : "image"
    const image = imageSource(entry.image)
    const poster = imageSource(entry.poster)
    const videoUrl = typeof entry.video === "string" ? entry.video : ""
    const thumbnail = image || poster
    const safeKind: Kind = requestedKind === "video" && videoUrl ? "video" : requestedKind === "gif" && thumbnail ? "gif" : thumbnail ? "image" : videoUrl ? "video" : "image"
    const fallbackTitle = `Archive Item ${index + 1}`
    const title = (entry.title || fallbackTitle).trim() || fallbackTitle
    const fallbackCategory = defaultCategory(safeKind)
    const category = (entry.category || fallbackCategory).trim() || fallbackCategory
    const width = Math.max(1, Math.round(entry.width || 1600))
    const height = Math.max(1, Math.round(entry.height || 1000))
    const fallbackDescription = `${width} x ${height} ${safeKind.toUpperCase()} from the archive.`
    const description = (entry.description || fallbackDescription).trim() || fallbackDescription
    const explicitAccessibilityLabel = (entry.accessibilityLabel || imageAlt(entry.image) || imageAlt(entry.poster)).trim()
    const accessibilityLabel = accessibleItemLabel(title, category, safeKind, index, explicitAccessibilityLabel)
    const stroke = entry.stroke === "on" ? true : entry.stroke === "off" ? false : typeof entry.stroke === "boolean" ? entry.stroke : undefined
    const identity = (entry.id || `${title}-${thumbnail || videoUrl}`).trim()
    const id = entry.id ? `archive-${slugify(entry.id) || stableHash(identity)}` : `archive-${slugify(title) || "item"}-${stableHash(identity)}`

    if (!thumbnail && !videoUrl) return null

    return {
        id,
        title,
        category,
        description,
        kind: safeKind,
        width,
        height,
        thumbnail,
        videoUrl: safeKind === "video" ? videoUrl : "",
        accessibilityLabel,
        stroke,
    }
}

function normalizeItems(input?: ManagedItem[]): Item[] {
    const source = Array.isArray(input) && input.length ? input : DEFAULT_CONTENT_ITEMS
    const items = source
        .map(normalizeItem)
        .filter((item): item is Item => Boolean(item))

    return items.length ? items : DEFAULT_CONTENT_ITEMS.map(normalizeItem).filter((item): item is Item => Boolean(item))
}

function cargoWidthUrl(url: string, width = 900) {
    return url.includes("/t/original/i/") ? url.replace("/t/original/i/", `/w/${width}/i/`) : url
}

function shouldStroke(item: Item) {
    if (typeof item.stroke === "boolean") return item.stroke
    const source = `${item.thumbnail} ${item.videoUrl}`
    return AUTO_STROKE_MATCHERS.some((matcher) => source.includes(matcher))
}

function scopedSelectors(selector: string, className: string) {
    return selector
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => `body.${className} ${part}`)
}

function useFooterHider(enabled: boolean) {
    React.useEffect(() => {
        if (!enabled || !canUseDOM()) return
        const hidden = new Map<HTMLElement, string>()
        const selector = "footer, [data-framer-name*='Footer' i], [aria-label*='Footer' i]"
        const hide = () => {
            document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
                if (element.closest("[data-playground-root='true']")) return
                if (!hidden.has(element)) hidden.set(element, element.style.display || "")
                element.style.setProperty("display", "none", "important")
                element.setAttribute("aria-hidden", "true")
            })
        }
        hide()
        const observer = new MutationObserver(hide)
        observer.observe(document.body, { childList: true, subtree: true })
        return () => {
            observer.disconnect()
            hidden.forEach((display, element) => {
                display ? (element.style.display = display) : element.style.removeProperty("display")
                element.removeAttribute("aria-hidden")
            })
        }
    }, [enabled])
}

function useNavPassthrough(enabled: boolean, selector: string) {
    React.useEffect(() => {
        if (!enabled || !canUseDOM()) return
        const className = "playground-nav-passthrough"
        const styleId = "playground-nav-passthrough-style"
        const scoped = scopedSelectors(selector, className)
        if (!scoped.length) return
        document.body.classList.add(className)
        let styleEl = document.getElementById(styleId) as HTMLStyleElement | null
        if (!styleEl) {
            styleEl = document.createElement("style")
            styleEl.id = styleId
            document.head.appendChild(styleEl)
        }
        styleEl.textContent = `
            ${scoped.join(",\n")} { pointer-events: none !important; }
            ${scoped.map((part) => `${part} :where(${INTERACTIVE_SELECTOR})`).join(",\n")} { pointer-events: auto !important; }
        `
        return () => {
            document.body.classList.remove(className)
            if (styleEl?.parentNode) styleEl.parentNode.removeChild(styleEl)
        }
    }, [enabled, selector])
}

function useDraftAnimationStyles(enabled: boolean) {
    React.useEffect(() => {
        if (!enabled || !canUseDOM()) return
        let styleEl = document.getElementById(DRAFT_ANIMATION_STYLE_ID) as HTMLStyleElement | null
        if (!styleEl) {
            styleEl = document.createElement("style")
            styleEl.id = DRAFT_ANIMATION_STYLE_ID
            document.head.appendChild(styleEl)
        }
        styleEl.textContent = "@keyframes playgroundRuleDraw { from { transform: scaleX(0); } to { transform: scaleX(1); } }"

        return () => {
            if (styleEl?.parentNode) styleEl.parentNode.removeChild(styleEl)
        }
    }, [enabled])
}

function useNavExitReveal(enabled: boolean, selector: string, holdMs: number) {
    const timersRef = React.useRef({ release: 0, cleanup: 0 })

    const clearTimers = React.useCallback(() => {
        if (!canUseDOM()) return
        window.clearTimeout(timersRef.current.release)
        window.clearTimeout(timersRef.current.cleanup)
        timersRef.current.release = 0
        timersRef.current.cleanup = 0
    }, [])

    const cancel = React.useCallback(() => {
        if (!canUseDOM()) return
        clearTimers()
        document.body.classList.remove(NAV_EXIT_MANAGED_CLASS, NAV_EXIT_HIDDEN_CLASS)
    }, [clearTimers])

    React.useEffect(() => {
        if (!enabled || !canUseDOM()) return
        const managed = scopedSelectors(selector, NAV_EXIT_MANAGED_CLASS)
        const hidden = scopedSelectors(selector, NAV_EXIT_HIDDEN_CLASS)
        if (!managed.length || !hidden.length) return

        let styleEl = document.getElementById(NAV_EXIT_STYLE_ID) as HTMLStyleElement | null
        if (!styleEl) {
            styleEl = document.createElement("style")
            styleEl.id = NAV_EXIT_STYLE_ID
            document.head.appendChild(styleEl)
        }
        styleEl.textContent = `
            ${managed.join(",\n")} {
                transition: transform ${NAV_REVEAL_MS}ms cubic-bezier(.22,1,.36,1) !important;
                will-change: transform !important;
            }
            ${hidden.join(",\n")} {
                transform: translate3d(0, -120px, 0) !important;
                pointer-events: none !important;
            }
            ${hidden.map((part) => `${part} :where(${INTERACTIVE_SELECTOR})`).join(",\n")} { pointer-events: none !important; }
        `

        return () => {
            cancel()
            if (styleEl?.parentNode) styleEl.parentNode.removeChild(styleEl)
        }
    }, [enabled, selector, cancel])

    const start = React.useCallback(() => {
        if (!enabled || !canUseDOM()) return
        clearTimers()
        document.body.classList.add(NAV_EXIT_MANAGED_CLASS, NAV_EXIT_HIDDEN_CLASS)
        timersRef.current.release = window.setTimeout(() => {
            document.body.classList.remove(NAV_EXIT_HIDDEN_CLASS)
            timersRef.current.cleanup = window.setTimeout(() => {
                document.body.classList.remove(NAV_EXIT_MANAGED_CLASS)
                timersRef.current.cleanup = 0
            }, NAV_REVEAL_MS + 120)
            timersRef.current.release = 0
        }, Math.max(0, holdMs))
    }, [clearTimers, enabled, holdMs])

    return React.useMemo(() => ({ start, cancel }), [start, cancel])
}

function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(() => (
        canUseDOM() && typeof window.matchMedia === "function"
            ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
            : false
    ))

    React.useEffect(() => {
        if (!canUseDOM() || typeof window.matchMedia !== "function") return
        const query = window.matchMedia("(prefers-reduced-motion: reduce)")
        const update = () => setPrefersReducedMotion(query.matches)
        update()
        if (typeof query.addEventListener === "function") {
            query.addEventListener("change", update)
            return () => query.removeEventListener("change", update)
        }
        query.addListener(update)
        return () => query.removeListener(update)
    }, [])

    return prefersReducedMotion
}

function reducedMotionNow() {
    try {
        return canUseDOM() && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    } catch (error) {
        return false
    }
}

function viewTransitionActive() {
    try {
        return canUseDOM() && document.documentElement.matches(":active-view-transition")
    } catch (error) {
        return false
    }
}

function useTransitionAwareLoadIn(enabled: boolean, delayMs: number, maxWaitMs: number) {
    const [ready, setReady] = React.useState(() => !enabled)
    const startedRef = React.useRef(false)

    React.useEffect(() => {
        if (!enabled || !canUseDOM()) {
            setReady(true)
            return
        }
        if (startedRef.current) return
        startedRef.current = true
        setReady(false)

        let disposed = false
        let released = false
        let delayTimer = 0
        let safetyTimer = 0
        let pollTimer = 0
        let rafA = 0
        let rafB = 0

        const clearPending = () => {
            window.clearTimeout(delayTimer)
            window.clearTimeout(safetyTimer)
            window.clearTimeout(pollTimer)
            window.cancelAnimationFrame(rafA)
            window.cancelAnimationFrame(rafB)
        }

        const release = () => {
            if (disposed || released) return
            released = true
            window.clearTimeout(safetyTimer)
            window.clearTimeout(pollTimer)

            if (reducedMotionNow()) {
                setReady(true)
                return
            }

            delayTimer = window.setTimeout(() => {
                rafA = window.requestAnimationFrame(() => {
                    rafB = window.requestAnimationFrame(() => {
                        if (!disposed) setReady(true)
                    })
                })
            }, Math.max(0, delayMs))
        }

        const pollForTransitionEnd = () => {
            if (disposed || released) return
            if (viewTransitionActive()) {
                pollTimer = window.setTimeout(pollForTransitionEnd, 50)
                return
            }
            release()
        }

        const onPageReveal = (event: Event) => {
            const vt = (event as any).viewTransition
            if (vt && vt.finished && typeof vt.finished.then === "function") {
                vt.finished.then(release, release)
            }
        }

        window.addEventListener("pagereveal", onPageReveal)
        safetyTimer = window.setTimeout(release, Math.max(400, maxWaitMs))
        pollForTransitionEnd()

        return () => {
            disposed = true
            window.removeEventListener("pagereveal", onPageReveal)
            clearPending()
        }
    }, [enabled])

    return ready
}

function MediaFrame({
    item,
    detail,
    hot,
    zoom,
    strokeColor,
    strokeWidth,
    fadeMs,
}: {
    item: Item
    detail?: boolean
    hot?: boolean
    zoom: number
    strokeColor: string
    strokeWidth: number
    fadeMs: number
}) {
    const [ready, setReady] = React.useState(false)
    const videoRef = React.useRef<HTMLVideoElement>(null)
    const prefersReducedMotion = usePrefersReducedMotion()
    const source = item.kind === "video" && item.videoUrl ? item.videoUrl : item.thumbnail
    const poster = item.thumbnail ? (detail ? item.thumbnail : cargoWidthUrl(item.thumbnail, 900)) : undefined
    const imageSrc = item.kind === "gif" ? item.thumbnail : detail ? cargoWidthUrl(item.thumbnail, 1800) : cargoWidthUrl(item.thumbnail, 900)
    const wide = item.width / item.height >= 1
    const drawStroke = shouldStroke(item) && strokeWidth > 0

    React.useEffect(() => {
        setReady(false)
        if (!canUseDOM() || item.kind !== "video" || !item.videoUrl) return
        const timer = window.setTimeout(() => setReady(true), 2500)
        return () => window.clearTimeout(timer)
    }, [source, item.kind, item.videoUrl])

    React.useEffect(() => {
        const video = videoRef.current
        if (!video) return
        video.muted = true
        if (prefersReducedMotion) {
            video.pause()
            setReady(true)
            return
        }
        if (!video.paused) return
        const play = video.play()
        if (play && typeof play.catch === "function") play.catch(() => {})
    }, [source, prefersReducedMotion])

    const innerStyle: React.CSSProperties = detail
        ? {
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              boxSizing: "border-box",
              border: drawStroke ? `${strokeWidth}px solid ${strokeColor}` : undefined,
          }
        : {
              position: "absolute",
              top: "50%",
              left: "50%",
              width: wide ? "100%" : "auto",
              height: wide ? "auto" : "100%",
              maxWidth: "100%",
              maxHeight: "100%",
              aspectRatio: `${item.width} / ${item.height}`,
              overflow: "hidden",
              boxSizing: "border-box",
              border: drawStroke ? `${strokeWidth}px solid ${strokeColor}` : undefined,
              transform: `translate(-50%, -50%) scale(${hot ? 1 + zoom / 100 : 1})`,
              transition: "transform 420ms cubic-bezier(.22,1,.36,1)",
              willChange: hot ? "transform" : "auto",
          }

    const mediaStyle: React.CSSProperties = {
        width: "100%",
        height: "100%",
        display: "block",
        objectFit: "cover",
        opacity: ready ? 1 : 0,
        transition: `opacity ${fadeMs}ms cubic-bezier(.22,1,.36,1)`,
        pointerEvents: "none",
    }

    return (
        <div style={innerStyle}>
            {item.kind === "video" && item.videoUrl ? (
                <video
                    ref={videoRef}
                    src={item.videoUrl}
                    poster={poster}
                    autoPlay={!prefersReducedMotion}
                    loop
                    muted
                    playsInline
                    preload={detail ? "auto" : "metadata"}
                    controls={false}
                    width={item.width}
                    height={item.height}
                    aria-hidden={detail ? undefined : true}
                    aria-label={detail ? `${item.accessibilityLabel}, video` : undefined}
                    onLoadedData={() => setReady(true)}
                    onLoadedMetadata={() => setReady(true)}
                    onCanPlay={() => setReady(true)}
                    onStalled={() => setReady(true)}
                    onError={() => setReady(true)}
                    style={mediaStyle}
                />
            ) : (
                <img
                    src={imageSrc}
                    alt={detail ? item.accessibilityLabel : ""}
                    draggable={false}
                    loading={detail ? "eager" : "lazy"}
                    decoding="async"
                    width={item.width}
                    height={item.height}
                    onLoad={() => setReady(true)}
                    onError={() => setReady(true)}
                    style={mediaStyle}
                />
            )}
        </div>
    )
}

/**
 * Archive Playground
 *
 * Consolidated archive playground with authorable Framer content controls.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 800
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function ArchivePlayground(props: Props) {
    const target = RenderTarget.current()
    const isCanvas = target === RenderTarget.canvas || target === RenderTarget.thumbnail
    const isInteractive = !isCanvas
    const rootRef = React.useRef<HTMLDivElement>(null)
    const galleryRef = React.useRef<HTMLDivElement>(null)
    const panelRef = React.useRef<HTMLDivElement>(null)
    const closeButtonRef = React.useRef<HTMLButtonElement>(null)
    const openerRef = React.useRef<HTMLElement | null>(null)
    const focusReturnTimerRef = React.useRef<number | null>(null)
    const cfgRef = React.useRef(props)
    cfgRef.current = props

    const managedItems = props.archiveItems ?? props.items
    const items = React.useMemo(() => normalizeItems(managedItems), [managedItems])
    const [viewport, setViewport] = React.useState({ w: 1200, h: 800 })
    const [motion, setMotion] = React.useState<Motion>({ x: 0, y: 0, mx: 0, my: 0, dragging: false })
    const [hovered, setHovered] = React.useState("")
    const [selected, setSelected] = React.useState<Item | null>(null)
    const [panelItem, setPanelItem] = React.useState<Item | null>(null)
    const [closeHover, setCloseHover] = React.useState(false)
    const panelOpen = Boolean(selected)
    const panelVisible = Boolean(panelItem)
    const panelTitleId = React.useId()
    const panelDescriptionId = React.useId()

    const closeTimerRef = React.useRef<number | null>(null)
    const selectedRef = React.useRef<Item | null>(null)
    selectedRef.current = selected

    const state = React.useRef<InternalState>({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        mx: 0,
        my: 0,
        targetMx: 0,
        targetMy: 0,
        edgeX: 0,
        edgeY: 0,
        inside: false,
        down: false,
        dragging: false,
        startX: 0,
        startY: 0,
        originX: 0,
        originY: 0,
        lastX: 0,
        lastY: 0,
        lastT: 0,
        suppressClick: false,
        tapIndex: -1,
        tapElement: null,
        lastFrameT: 0,
    })

    const backgroundColor = props.backgroundColor || CREAM
    const panelColor = props.panelColor || CREAM
    const textColor = props.textColor || BLACK
    const mutedTextColor = props.mutedTextColor || MUTED
    const labelColor = props.labelColor || LABEL
    const ruleColor = props.ruleColor || RULE
    const strokeColor = props.strokeColor || LABEL
    const strokeWidth = props.strokeWidth ?? 0.5
    const cellSize = props.cellSize ?? 190
    const columnGap = props.columnGap ?? 72
    const rowGap = props.rowGap ?? 88
    const hoverScale = props.hoverScale ?? 1.035
    const hoverImageZoom = props.hoverImageZoom ?? 4
    const panelWidth = props.panelWidth ?? 500
    const panelExitMs = props.panelExitMs ?? 950
    const mediaFadeMs = props.mediaFadeMs ?? 700
    const loadInDelayMs = props.loadInDelayMs ?? LOAD_IN_DELAY_MS
    const loadInFadeMs = props.loadInFadeMs ?? LOAD_IN_FADE_MS
    const loadInStaggerMs = props.loadInStaggerMs ?? LOAD_IN_STAGGER_MS
    const loadInMaxWaitMs = props.loadInMaxWaitMs ?? LOAD_IN_MAX_WAIT_MS
    const navSelector = props.navSelector || DEFAULT_NAV_SELECTOR
    const navExitReveal = useNavExitReveal(isInteractive, navSelector, panelExitMs)
    const prefersReducedMotion = usePrefersReducedMotion()
    const loadInReady = useTransitionAwareLoadIn(isInteractive, loadInDelayMs, loadInMaxWaitMs)
    const [loadInSettled, setLoadInSettled] = React.useState(() => !isInteractive)

    useDraftAnimationStyles(isInteractive)
    useFooterHider(isInteractive && (props.hideFooter ?? true))
    useNavPassthrough(isInteractive && (props.navPassthrough ?? true), navSelector)

    React.useEffect(() => {
        if (!isInteractive || prefersReducedMotion) {
            setLoadInSettled(true)
            return
        }
        if (!loadInReady) {
            setLoadInSettled(false)
            return
        }

        setLoadInSettled(false)
        const totalMs =
            Math.max(0, loadInFadeMs) +
            Math.max(0, loadInStaggerMs) * (LOAD_IN_STAGGER_SLOTS - 1) +
            160
        const timer = window.setTimeout(() => setLoadInSettled(true), totalMs)
        return () => window.clearTimeout(timer)
    }, [isInteractive, loadInReady, loadInFadeMs, loadInStaggerMs, prefersReducedMotion])

    React.useEffect(() => {
        return () => {
            if (closeTimerRef.current !== null && canUseDOM()) {
                window.clearTimeout(closeTimerRef.current)
                closeTimerRef.current = null
            }
            if (focusReturnTimerRef.current !== null && canUseDOM()) {
                window.clearTimeout(focusReturnTimerRef.current)
                focusReturnTimerRef.current = null
            }
        }
    }, [])

    React.useEffect(() => {
        if (!panelItem) setCloseHover(false)
    }, [panelItem])

    React.useEffect(() => {
        if (selected && !items.some((item) => item.id === selected.id)) {
            setSelected(null)
            setPanelItem(null)
        }
    }, [items, selected])

    React.useEffect(() => {
        const element = rootRef.current
        if (!element || !canUseDOM()) return
        const resize = () => {
            const rect = element.getBoundingClientRect()
            setViewport({ w: Math.max(1, rect.width), h: Math.max(1, rect.height) })
        }
        resize()
        const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null
        observer?.observe(element)
        window.addEventListener("resize", resize)
        return () => {
            observer?.disconnect()
            window.removeEventListener("resize", resize)
        }
    }, [])

    React.useEffect(() => {
        const gallery = galleryRef.current
        if (!gallery || !canUseDOM()) return
        if (panelOpen || !loadInReady) {
            gallery.setAttribute("inert", "")
            gallery.setAttribute("aria-hidden", "true")
        } else {
            gallery.removeAttribute("inert")
            gallery.removeAttribute("aria-hidden")
        }

        return () => {
            gallery.removeAttribute("inert")
            gallery.removeAttribute("aria-hidden")
        }
    }, [panelOpen, loadInReady])

    const queueFocusReturn = React.useCallback(() => {
        if (!canUseDOM()) return
        if (focusReturnTimerRef.current !== null) window.clearTimeout(focusReturnTimerRef.current)
        focusReturnTimerRef.current = window.setTimeout(() => {
            focusReturnTimerRef.current = null
            const opener = openerRef.current
            if (opener?.isConnected && opener.getAttribute("aria-hidden") !== "true" && opener.tabIndex >= 0 && typeof opener.focus === "function") {
                opener.focus({ preventScroll: true })
                return
            }
            const firstCard = galleryRef.current?.querySelector<HTMLElement>("[data-playground-card='true']:not([aria-hidden='true'])")
            firstCard?.focus({ preventScroll: true })
        }, 0)
    }, [])

    const closePanel = React.useCallback(() => {
        navExitReveal.start()
        if (closeTimerRef.current !== null && canUseDOM()) {
            window.clearTimeout(closeTimerRef.current)
            closeTimerRef.current = null
        }
        const shouldReturnFocus = Boolean(selectedRef.current)
        setSelected(null)
        if (shouldReturnFocus) queueFocusReturn()
        if (canUseDOM()) {
            closeTimerRef.current = window.setTimeout(() => {
                closeTimerRef.current = null
                if (!selectedRef.current) setPanelItem(null)
            }, panelExitMs)
        } else {
            setPanelItem(null)
        }
    }, [navExitReveal, panelExitMs, queueFocusReturn])

    const openItem = React.useCallback((item: Item, opener?: HTMLElement | null) => {
        navExitReveal.cancel()
        if (closeTimerRef.current !== null && canUseDOM()) {
            window.clearTimeout(closeTimerRef.current)
            closeTimerRef.current = null
        }
        if (focusReturnTimerRef.current !== null && canUseDOM()) {
            window.clearTimeout(focusReturnTimerRef.current)
            focusReturnTimerRef.current = null
        }
        if (opener?.isConnected) {
            openerRef.current = opener
        } else if (canUseDOM() && document.activeElement instanceof HTMLElement) {
            openerRef.current = document.activeElement
        }
        const s = state.current
        s.down = false
        s.dragging = false
        s.suppressClick = false
        s.tapIndex = -1
        s.tapElement = null
        s.vx = 0
        s.vy = 0
        setHovered("")
        setCloseHover(false)
        setPanelItem(item)
        setSelected(item)
    }, [navExitReveal])

    React.useEffect(() => {
        if (!panelOpen || !canUseDOM()) return
        const timer = window.setTimeout(() => {
            closeButtonRef.current?.focus({ preventScroll: true })
        }, 0)
        return () => window.clearTimeout(timer)
    }, [panelOpen, panelItem?.id])

    React.useEffect(() => {
        if (!panelOpen || !canUseDOM()) return
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault()
                event.stopPropagation()
                closePanel()
                return
            }
            if (event.key !== "Tab") return

            const panel = panelRef.current
            if (!panel) return
            const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isFocusableElement)
            const first = focusable[0] || panel
            const last = focusable[focusable.length - 1] || panel
            const active = document.activeElement

            if (!panel.contains(active)) {
                event.preventDefault()
                first.focus({ preventScroll: true })
                return
            }
            if (!(active instanceof HTMLElement) || !focusable.includes(active)) {
                event.preventDefault()
                first.focus({ preventScroll: true })
                return
            }

            if (event.shiftKey && active === first) {
                event.preventDefault()
                last.focus({ preventScroll: true })
            } else if (!event.shiftKey && active === last) {
                event.preventDefault()
                first.focus({ preventScroll: true })
            }
        }
        window.addEventListener("keydown", onKeyDown, true)
        return () => window.removeEventListener("keydown", onKeyDown, true)
    }, [panelOpen, closePanel])

    const updatePointer = React.useCallback((clientX: number, clientY: number) => {
        const element = rootRef.current
        if (!element) return
        const rect = element.getBoundingClientRect()
        const x = clientX - rect.left
        const y = clientY - rect.top
        const s = state.current
        const edgeScrollZone = cfgRef.current.edgeScrollZone ?? 90
        const edgeScrollSpeed = cfgRef.current.edgeScrollSpeed ?? 220
        const parallaxStrength = cfgRef.current.parallaxStrength ?? 0.06

        s.inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
        s.targetMx = (rect.width / 2 - x) * parallaxStrength
        s.targetMy = (rect.height / 2 - y) * parallaxStrength

        const zone = Math.max(1, edgeScrollZone)
        const left = 1 - clamp(x / zone, 0, 1)
        const right = 1 - clamp((rect.width - x) / zone, 0, 1)
        const top = 1 - clamp(y / zone, 0, 1)
        const bottom = 1 - clamp((rect.height - y) / zone, 0, 1)
        s.edgeX = (left - right) * edgeScrollSpeed * 0.016
        s.edgeY = (top - bottom) * edgeScrollSpeed * 0.016
    }, [])

    React.useEffect(() => {
        if (!isInteractive || !canUseDOM()) return
        const onGlobalPointerMove = (event: PointerEvent) => updatePointer(event.clientX, event.clientY)
        window.addEventListener("pointermove", onGlobalPointerMove, true)
        return () => window.removeEventListener("pointermove", onGlobalPointerMove, true)
    }, [isInteractive, updatePointer])

    React.useEffect(() => {
        const current = state.current
        if (!isInteractive || !canUseDOM()) {
            setMotion({ x: current.x, y: current.y, mx: 0, my: 0, dragging: false })
            return
        }

        let raf = 0
        const tick = (time: number) => {
            const s = state.current
            const c = cfgRef.current
            const dt = s.lastFrameT ? Math.min(0.05, (time - s.lastFrameT) / 1000) : 1 / 60
            s.lastFrameT = time

            const panelOpen = Boolean(selectedRef.current)
            if (!panelOpen || c.driftWhilePanelOpen !== false) {
                if (!s.down) {
                    const speed = Math.hypot(s.vx, s.vy)
                    if ((c.inertiaEnabled ?? true) && speed > 1 && !panelOpen) {
                        s.x += s.vx * dt
                        s.y += s.vy * dt
                        const friction = Math.pow(c.throwFriction ?? 0.85, dt * 60)
                        s.vx *= friction
                        s.vy *= friction
                    } else {
                        s.vx = 0
                        s.vy = 0
                        s.x += (panelOpen ? c.panelDriftSpeedX ?? 0.5 : c.driftSpeedX ?? 0.5) * dt * 60
                        s.y += (panelOpen ? c.panelDriftSpeedY ?? 0.5 : c.driftSpeedY ?? 0.5) * dt * 60
                    }
                }
                if ((c.edgeScrollEnabled ?? true) && s.inside && !s.dragging && !panelOpen) {
                    s.x += s.edgeX
                    s.y += s.edgeY
                }
            }

            const ease = clamp(c.parallaxEase ?? 0.5, 0.01, 1)
            if ((c.parallaxWhileDragging ?? true) || !s.dragging) {
                s.mx += (s.targetMx - s.mx) * ease
                s.my += (s.targetMy - s.my) * ease
            } else {
                s.mx += (0 - s.mx) * ease
                s.my += (0 - s.my) * ease
            }

            setMotion({ x: s.x, y: s.y, mx: s.mx, my: s.my, dragging: s.dragging })
            raf = window.requestAnimationFrame(tick)
        }
        raf = window.requestAnimationFrame(tick)
        return () => window.cancelAnimationFrame(raf)
    }, [isInteractive])

    const getCardIndexFromTarget = React.useCallback((target: EventTarget | null) => {
        const element = target as HTMLElement | null
        const card = element?.closest?.("[data-playground-card='true']") as HTMLElement | null
        const raw = card?.dataset?.playgroundIndex
        const index = raw ? Number(raw) : -1
        return Number.isFinite(index) ? index : -1
    }, [])

    const getCardElementFromTarget = React.useCallback((target: EventTarget | null) => {
        const element = target as HTMLElement | null
        return element?.closest?.("[data-playground-card='true']") as HTMLElement | null
    }, [])

    const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
        if (!isInteractive || selectedRef.current) return
        const deltaUnit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? Math.max(viewport.w, viewport.h) : 1
        const dx = event.deltaX * deltaUnit
        const dy = event.deltaY * deltaUnit
        if (Math.abs(dx) + Math.abs(dy) < 0.1) return

        event.preventDefault()
        const s = state.current
        const currentTime = now()
        const dt = s.lastT ? Math.max(0.016, (currentTime - s.lastT) / 1000) : 0.016
        const velocityScale = props.throwVelocityScale ?? 1.75
        const maxSpeed = props.throwMaxSpeed ?? 5200

        s.down = false
        s.dragging = false
        s.suppressClick = false
        s.x -= dx
        s.y -= dy
        s.vx = clamp((-dx / dt) * velocityScale, -maxSpeed, maxSpeed)
        s.vy = clamp((-dy / dt) * velocityScale, -maxSpeed, maxSpeed)
        s.lastT = currentTime
        setMotion({ x: s.x, y: s.y, mx: s.mx, my: s.my, dragging: false })
    }

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!isInteractive || selectedRef.current || (event.pointerType === "mouse" && event.button !== 0)) return
        const s = state.current
        s.down = true
        s.dragging = false
        s.suppressClick = false
        s.tapIndex = getCardIndexFromTarget(event.target)
        s.tapElement = getCardElementFromTarget(event.target)
        s.startX = event.clientX
        s.startY = event.clientY
        s.originX = s.x
        s.originY = s.y
        s.lastX = event.clientX
        s.lastY = event.clientY
        s.lastT = now()
        s.vx = 0
        s.vy = 0
        try {
            event.currentTarget.setPointerCapture(event.pointerId)
        } catch (error) {}
        updatePointer(event.clientX, event.clientY)
    }

    const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!isInteractive) return
        updatePointer(event.clientX, event.clientY)
        const s = state.current
        if (!s.down) return
        const currentTime = now()
        const dt = Math.max(0.001, (currentTime - s.lastT) / 1000)
        const velocityScale = props.throwVelocityScale ?? 1.75
        const maxSpeed = props.throwMaxSpeed ?? 5200
        s.vx = clamp(((event.clientX - s.lastX) / dt) * velocityScale, -maxSpeed, maxSpeed)
        s.vy = clamp(((event.clientY - s.lastY) / dt) * velocityScale, -maxSpeed, maxSpeed)
        s.lastX = event.clientX
        s.lastY = event.clientY
        s.lastT = currentTime
        const dx = event.clientX - s.startX
        const dy = event.clientY - s.startY
        if (!s.dragging && Math.hypot(dx, dy) > TAP_THRESHOLD) {
            s.dragging = true
            s.suppressClick = true
            s.tapIndex = -1
            s.tapElement = null
        }
        if (s.dragging) {
            s.x = s.originX + dx
            s.y = s.originY + dy
            setMotion({ x: s.x, y: s.y, mx: s.mx, my: s.my, dragging: true })
        }
    }

    const finishPointer = (event: React.PointerEvent<HTMLDivElement>, allowOpen: boolean) => {
        if (!isInteractive) return
        const s = state.current
        const minSpeed = props.throwMinSpeed ?? 220
        const maxSpeed = props.throwMaxSpeed ?? 5200
        const itemToOpen = allowOpen && s.down && !s.dragging && !s.suppressClick && s.tapIndex >= 0 ? items[s.tapIndex] : null
        const speed = Math.hypot(s.vx, s.vy)
        if (speed < minSpeed) {
            s.vx = 0
            s.vy = 0
        } else if (speed > maxSpeed) {
            const ratio = maxSpeed / speed
            s.vx *= ratio
            s.vy *= ratio
        }
        s.down = false
        s.dragging = false
        s.tapIndex = -1
        const opener = s.tapElement
        s.tapElement = null
        setMotion({ x: s.x, y: s.y, mx: s.mx, my: s.my, dragging: false })
        try {
            event.currentTarget.releasePointerCapture(event.pointerId)
        } catch (error) {}
        if (itemToOpen) openItem(itemToOpen, opener)
        if (canUseDOM()) window.setTimeout(() => { s.suppressClick = false }, 140)
        else s.suppressClick = false
    }

    const count = items.length
    const cellX = cellSize + columnGap
    const cellY = cellSize + rowGap
    const centerX = viewport.w / 2
    const centerY = viewport.h / 2
    const extra = isCanvas ? 3 : 5
    const visibleCols = clamp(Math.ceil(viewport.w / Math.max(1, cellX)) + extra, 5, isCanvas ? 9 : 12)
    const visibleRows = clamp(Math.ceil(viewport.h / Math.max(1, cellY)) + extra, 5, isCanvas ? 8 : 10)
    const startX = Math.floor((-motion.x - centerX) / cellX) - Math.ceil(extra / 2)
    const startY = Math.floor((-motion.y - centerY) / cellY) - Math.ceil(extra / 2)
    const cells: React.ReactNode[] = []

    for (let row = 0; row < visibleRows; row++) {
        const gy = startY + row
        for (let col = 0; col < visibleCols; col++) {
            const gx = startX + col
            const index = mod(gx * 5 + gy * 7, count)
            const item = items[index]
            const left = gx * cellX + motion.x + motion.mx + centerX
            const top = gy * cellY + motion.y + motion.my + centerY
            const key = `${item.id}-${gx}-${gy}`
            const isHot = hovered === key
            const cardIsKeyboardReachable = loadInReady && isInteractive && !panelOpen && left >= 0 && top >= 0 && left < viewport.w && top < viewport.h
            const introActive = loadInReady && !loadInSettled && !prefersReducedMotion
            const introDelayMs = introActive ? mod(gx * 37 + gy * 61 + index * 17, LOAD_IN_STAGGER_SLOTS) * Math.max(0, loadInStaggerMs) : 0
            const introTransformMs = Math.max(620, Math.round(loadInFadeMs * 0.82))
            const cardTransition =
                !loadInReady || prefersReducedMotion || motion.dragging
                    ? "none"
                    : introActive
                      ? `opacity ${loadInFadeMs}ms ${LOAD_IN_EASE} ${introDelayMs}ms, transform ${introTransformMs}ms ${LOAD_IN_EASE} ${introDelayMs}ms`
                      : "transform 300ms cubic-bezier(.22,1,.36,1)"

            cells.push(
                <button
                    key={key}
                    type="button"
                    data-playground-card="true"
                    data-playground-index={index}
                    aria-hidden={cardIsKeyboardReachable ? undefined : true}
                    aria-label={`Open ${item.accessibilityLabel} details`}
                    tabIndex={cardIsKeyboardReachable ? 0 : -1}
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered("")}
                    onFocus={() => setHovered(key)}
                    onBlur={() => setHovered("")}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault()
                            openItem(item, event.currentTarget)
                        }
                    }}
                    onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        if (!isInteractive || state.current.suppressClick || state.current.dragging) return
                        openItem(item, event.currentTarget)
                    }}
                    style={{
                        position: "absolute",
                        left,
                        top,
                        width: cellSize,
                        height: cellSize,
                        padding: 0,
                        border: 0,
                        borderRadius: 0,
                        background: "transparent",
                        boxShadow: "none",
                        overflow: "visible",
                        appearance: "none",
                        cursor: motion.dragging ? "grabbing" : "pointer",
                        opacity: loadInReady ? 1 : 0,
                        transform: `translate3d(0, ${loadInReady ? 0 : LOAD_IN_LIFT_PX}px, 0) scale(${isHot ? hoverScale : 1})`,
                        transition: cardTransition,
                        willChange: introActive || !loadInReady || isHot || motion.dragging ? "opacity, transform" : "auto",
                        WebkitTapHighlightColor: "transparent",
                    }}
                >
                    <MediaFrame item={item} hot={isHot} zoom={hoverImageZoom} strokeColor={strokeColor} strokeWidth={strokeWidth} fadeMs={mediaFadeMs} />
                </button>,
            )
        }
    }

    const closeTextRolled = closeHover || (panelVisible && !panelOpen)
    const modalPosition = isCanvas ? "absolute" : "fixed"
    const panelPadding = "clamp(22px, 2.8vw, 40px)"
    const stackPanelText = panelWidth < 430 || viewport.w < 560

    return (
        <div
            ref={rootRef}
            data-playground-root="true"
            data-playground-load-in={loadInReady ? "ready" : "blank"}
            role="main"
            aria-label="Play archive"
            aria-busy={loadInReady ? undefined : true}
            style={{
                ...props.style,
                width: "100%",
                height: "100%",
                minHeight: isCanvas ? "100%" : "100vh",
                position: "relative",
                zIndex: panelOpen || panelVisible ? MODAL_Z : "auto",
                overflow: "hidden",
                isolation: "isolate",
                background: backgroundColor,
                color: textColor,
                cursor: !loadInReady || panelOpen ? "default" : motion.dragging ? "grabbing" : "grab",
                userSelect: "none",
                touchAction: "none",
                fontFamily: DISPLAY,
            }}
        >
            <div
                ref={galleryRef}
                data-playground-gallery="true"
                onWheel={onWheel}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={(event) => finishPointer(event, true)}
                onPointerCancel={(event) => finishPointer(event, false)}
                style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                    perspective: 1000,
                    perspectiveOrigin: "50% 50%",
                    transformStyle: "preserve-3d",
                    opacity: loadInReady ? 1 : 0,
                    pointerEvents: loadInReady && !panelOpen ? "auto" : "none",
                    transition: loadInReady && !prefersReducedMotion ? `opacity 140ms ${LOAD_IN_EASE}` : "none",
                }}
            >
                <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>{cells}</div>
            </div>

            <div
                aria-hidden="true"
                onPointerDown={closePanel}
                style={{
                    position: modalPosition,
                    inset: 0,
                    zIndex: MODAL_Z,
                    opacity: panelOpen ? 1 : 0,
                    pointerEvents: panelOpen ? "auto" : "none",
                    WebkitBackdropFilter: panelOpen ? "blur(25px)" : "blur(0px)",
                    backdropFilter: panelOpen ? "blur(25px)" : "blur(0px)",
                    transition: panelOpen ? "opacity .8s cubic-bezier(.22,1,.36,1), backdrop-filter .8s cubic-bezier(.22,1,.36,1)" : "opacity .45s cubic-bezier(.84,0,.16,1), backdrop-filter .45s cubic-bezier(.84,0,.16,1)",
                }}
            >
                <div style={{ position: "absolute", inset: 0, background: "#212121", opacity: 0.05 }} />
                <div style={{ position: "absolute", inset: 0, background: "hsla(35,17%,86%,.2)", opacity: 0.85 }} />
            </div>

            <div
                ref={panelRef}
                data-playground-panel="true"
                role={panelOpen ? "dialog" : undefined}
                aria-modal={panelOpen ? true : undefined}
                aria-labelledby={panelOpen ? panelTitleId : undefined}
                aria-describedby={panelOpen ? panelDescriptionId : undefined}
                aria-hidden={panelOpen ? undefined : true}
                tabIndex={-1}
                onPointerDown={(event) => event.stopPropagation()}
                style={{
                    position: modalPosition,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: MODAL_Z + 1,
                    width: `min(${panelWidth}px, 100vw)`,
                    maxWidth: "100%",
                    background: panelColor,
                    color: textColor,
                    overflow: "hidden",
                    transform: panelOpen ? "translateX(0)" : "translateX(100%)",
                    transition: panelOpen ? "transform 1s cubic-bezier(.22,1,.36,1)" : "transform .8s cubic-bezier(.84,0,.16,1)",
                    pointerEvents: panelOpen ? "auto" : "none",
                    boxSizing: "border-box",
                }}
            >
                {panelItem && (
                    <div style={{ height: "100%", overflowY: "auto", padding: `calc(env(safe-area-inset-top, 0px) + clamp(84px, 11vh, 108px)) ${panelPadding} clamp(84px, 17vh, 140px)` }}>
                        <button
                            ref={closeButtonRef}
                            type="button"
                            aria-label="Close detail"
                            tabIndex={panelOpen ? 0 : -1}
                            onClick={() => {
                                setCloseHover(true)
                                closePanel()
                            }}
                            onMouseEnter={() => setCloseHover(true)}
                            onMouseLeave={() => setCloseHover(false)}
                            onFocus={() => setCloseHover(true)}
                            onBlur={() => setCloseHover(false)}
                            style={{
                                position: "absolute",
                                top: "calc(env(safe-area-inset-top, 0px) + clamp(34px, 5vh, 48px))",
                                right: panelPadding,
                                zIndex: 4,
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 5,
                                width: "fit-content",
                                height: 13,
                                padding: 0,
                                border: 0,
                                background: "transparent",
                                color: textColor,
                                fontFamily: MONO,
                                fontSize: 13,
                                lineHeight: "13px",
                                letterSpacing: 0,
                                textTransform: "uppercase",
                                cursor: "pointer",
                                overflow: "visible",
                                appearance: "none",
                                WebkitTapHighlightColor: "transparent",
                            }}
                        >
                            <span aria-hidden="true" style={{ display: "inline-block", flex: "0 0 auto", height: 13, lineHeight: "13px" }}>&times;</span>
                            <span aria-hidden="true" style={{ display: "inline-block", height: 13, lineHeight: "13px", overflow: "hidden" }}>
                                <span
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-end",
                                        transform: closeTextRolled ? "translateY(-13px)" : "translateY(0)",
                                        transition: "transform 360ms cubic-bezier(.22,1,.36,1)",
                                        willChange: "transform",
                                    }}
                                >
                                    <span style={{ height: 13, lineHeight: "13px", whiteSpace: "nowrap" }}>CLOSE</span>
                                    <span style={{ height: 13, lineHeight: "13px", whiteSpace: "nowrap" }}>CLOSE</span>
                                </span>
                            </span>
                        </button>

                        <figure style={{ margin: 0, position: "relative", width: "100%", aspectRatio: `${panelItem.width} / ${panelItem.height}`, background: "transparent", overflow: "hidden" }}>
                            <MediaFrame item={panelItem} detail zoom={0} strokeColor={strokeColor} strokeWidth={strokeWidth} fadeMs={mediaFadeMs} />
                        </figure>

                        <div
                            aria-hidden="true"
                            style={{
                                width: "100%",
                                height: 1,
                                background: ruleColor,
                                margin: "clamp(28px, 4vw, 54px) 0 clamp(12px, 1.5vw, 18px)",
                                transformOrigin: "left center",
                                animation: panelOpen ? "playgroundRuleDraw 700ms cubic-bezier(0.16, 1, 0.3, 1) both" : undefined,
                            }}
                        />

                        <div style={{ display: "grid", gridTemplateColumns: stackPanelText ? "minmax(0, 1fr)" : "minmax(0, 1.08fr) minmax(0, .92fr)", gap: stackPanelText ? 18 : 28, alignItems: "start", width: "100%" }}>
                            <div style={{ minWidth: 0, overflow: "hidden" }}>
                                <div style={{ fontFamily: MONO, fontSize: 11, lineHeight: 1.2, letterSpacing: ".04em", textTransform: "uppercase", color: labelColor, marginBottom: 12 }}>{panelItem.category}</div>
                                <h2 id={panelTitleId} style={{ margin: 0, fontFamily: DISPLAY, fontSize: "clamp(24px, 2.2vw, 34px)", lineHeight: 1.06, fontWeight: 500, letterSpacing: 0, color: textColor, overflowWrap: "anywhere" }}>{panelItem.title}</h2>
                            </div>
                            <p id={panelDescriptionId} style={{ margin: 0, minWidth: 0, fontFamily: DISPLAY, fontSize: 16, lineHeight: 1.45, letterSpacing: 0, color: mutedTextColor, overflowWrap: "break-word" }}>{panelItem.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const hideAdvanced = ({ advancedControls }: Partial<Props>) => !advancedControls
const hideInternal = () => true
const hideUnlessVideo = ({ mediaType }: any) => mediaType !== "video"

addPropertyControls<Props>(ArchivePlayground, {
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
                mediaType: {
                    type: ControlType.Enum,
                    title: "Type",
                    options: ["image", "video", "gif"],
                    optionTitles: ["Image", "Video", "GIF"],
                    defaultValue: "image",
                },
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
})

ArchivePlayground.displayName = "Archive Playground"
