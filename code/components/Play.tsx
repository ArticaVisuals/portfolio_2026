import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

// @ts-ignore Framer code files can import project code components by module URL.
import ArchivePlayground from "https://framer.com/m/ArchivePlayground-hjPIIx.js"

type Kind = "image" | "video" | "gif"
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
    // Optional external per-item backup, used only when no Framer upload exists.
    // Framer uploads remain the source of truth for this canvas/rollback surface.
    backupImage?: string
    backupVideo?: string
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
    edgeScrollEase?: number
    parallaxStrength?: number
    parallaxEase?: number
    parallaxWhileDragging?: boolean
    mediaFadeMs?: number
    maxConcurrentVideos?: number
    safariMaxConcurrentVideos?: number
    iosMaxConcurrentVideos?: number
    videoPlaybackMode?: "center" | "hover"
    restingMediaOpacity?: number
    restingMediaSaturation?: number
    initialMaxConcurrentVideos?: number
    videoRampDelayMs?: number
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
    gridGap?: number
    surfaceColor?: string
    labelStrokeColor?: string
    style?: React.CSSProperties
}

type Snapshot = Partial<Pick<CSSStyleDeclaration, "position" | "top" | "right" | "bottom" | "left" | "width" | "height" | "minHeight" | "transform" | "zIndex">>

const CREAM = "rgb(247, 245, 240)"
const BLACK = "rgb(20, 20, 20)"
const LABEL = "rgb(151, 151, 151)"
const RULE = "rgb(35, 51, 36)"
const TEXT_GRAY = "rgb(110, 110, 110)"
const DEFAULT_NAV_SELECTOR = "header, nav, [data-framer-name*='Navigation' i], [data-framer-name*='Nav' i]"
const ROOT_SELECTOR = "[data-playground-root='true']"
const CARD_SELECTOR = "[data-playground-card='true']"
const EDITOR_LABEL_ID = "__framer-editorbar-label"
const LOAD_IN_DELAY_MS = 70
const LOAD_IN_FADE_MS = 1280
const LOAD_IN_STAGGER_MS = 90
const LOAD_IN_MAX_WAIT_MS = 2600
// Keep Safari's decoder/GPU workload bounded without reducing encoded quality.
// Remaining cards continue to show their crisp poster until a video slot opens.
const MAX_CONCURRENT_VIDEOS = 10
const INITIAL_MAX_CONCURRENT_VIDEOS = 4
const SAFARI_MAX_CONCURRENT_VIDEOS = 4
const IOS_MAX_CONCURRENT_VIDEOS = 2
const VIDEO_RAMP_DELAY_MS = 2400
const DEFAULT_CELL_SIZE = 190
const DEFAULT_GRID_GAP = 56
const DEFAULT_PANEL_WIDTH = 960
// Canonical site smooth ease (see framer-current-state.md "motion ease canon").
const SMOOTH_EASE = "cubic-bezier(0.12, 0.23, 0.5, 1)"

const canUseDOM = () => typeof window !== "undefined" && typeof document !== "undefined"
const isCanvas = () => RenderTarget.current() === RenderTarget.canvas || RenderTarget.current() === RenderTarget.thumbnail
const isIOSWebKit = () => {
    if (!canUseDOM()) return false
    const ua = navigator.userAgent || ""
    return (
        /iP(?:ad|hone|od)/.test(ua) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    )
}
const isDesktopSafari = () => {
    if (!canUseDOM()) return false
    const ua = navigator.userAgent || ""
    return (
        /Safari\//.test(ua) &&
        !/(?:Chrome|Chromium|CriOS|Edg|EdgiOS|OPR|FxiOS)\//.test(ua) &&
        !isIOSWebKit()
    )
}

function imageSource(value: ImageValue) {
    if (!value) return ""
    if (typeof value === "string") return value
    return value.src || ""
}

function hasMedia(item: ManagedItem) {
    return Boolean(
        imageSource(item.image) ||
            imageSource(item.poster) ||
            item.video ||
            (item.backupImage || "").trim() ||
            (item.backupVideo || "").trim()
    )
}

function resolveItems(items?: ManagedItem[]) {
    // Archive Items is retained for canvas previews and emergency rollback.
    // Published /play content is resolved by ArchivePlayground from Play Archive
    // CMS only, so stale panel/default rows cannot leak onto the live site.
    return Array.isArray(items) ? items : []
}

function useViewportFix(enabled: boolean, containerRef: React.RefObject<HTMLDivElement>, ancestorDepth: number) {
    React.useEffect(() => {
        if (!enabled || !canUseDOM() || isCanvas()) return
        let raf = 0
        let scheduled = false
        let rebindObserver = () => {}
        let observedChain: HTMLElement[] = []
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
            if (root.style.width !== "100%") root.style.width = "100%"
            if (root.style.height !== "100%") root.style.height = "100%"
            if (root.style.minHeight !== "100vh") root.style.minHeight = "100vh"
            let element: HTMLElement | null = root.parentElement
            for (let index = 0; element && element !== document.body && index < ancestorDepth; index += 1) {
                remember(element)
                const values: Partial<CSSStyleDeclaration> = {
                    position: "fixed",
                    top: "0px",
                    right: "0px",
                    bottom: "0px",
                    left: "0px",
                    width: "100vw",
                    height: "100vh",
                    minHeight: "100vh",
                    transform: "none",
                }
                if (index === 0) values.zIndex = "0"
                Object.entries(values).forEach(([key, value]) => {
                    if ((element!.style as any)[key] !== value)
                        (element!.style as any)[key] = value
                })
                element = element.parentElement
            }
        }
        const schedule = () => {
            if (scheduled) return
            scheduled = true
            raf = window.requestAnimationFrame(() => {
                scheduled = false
                forceViewport()
                rebindObserver()
            })
        }
        forceViewport()
        const observer =
            typeof MutationObserver !== "undefined"
                ? new MutationObserver(schedule)
                : null
        rebindObserver = () => {
            const nextChain: HTMLElement[] = []
            let observedElement: HTMLElement | null =
                containerRef.current?.querySelector<HTMLElement>(
                    ROOT_SELECTOR
                ) || null
            for (
                let index = 0;
                observedElement &&
                observedElement !== document.body &&
                index <= ancestorDepth;
                index += 1
            ) {
                nextChain.push(observedElement)
                observedElement = observedElement.parentElement
            }
            const chainChanged =
                nextChain.length !== observedChain.length ||
                nextChain.some(
                    (element, index) => element !== observedChain[index]
                )
            if (!chainChanged) return
            observer?.disconnect()
            nextChain.forEach((element) => {
                observer?.observe(element, {
                    attributes: true,
                    attributeFilter: ["class", "style"],
                    childList: true,
                })
            })
            observedChain = nextChain
        }
        rebindObserver()
        const timers = [50, 200, 500, 1000].map((delay) =>
            window.setTimeout(schedule, delay)
        )
        window.addEventListener("resize", schedule, { passive: true })
        window.addEventListener("pt:reveal", schedule)
        return () => {
            window.cancelAnimationFrame(raf)
            timers.forEach((timer) => window.clearTimeout(timer))
            observer?.disconnect()
            window.removeEventListener("resize", schedule)
            window.removeEventListener("pt:reveal", schedule)
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
                // Soft / smooth / cinematic: pure opacity fade on the canonical
                // smooth ease, with an ORDERED radial stagger that ripples out
                // from the viewport center (no random scatter, no upward lift).
                const fadeDuration = Math.max(1200, Math.round(fadeMs * 1.05))
                const maxSpread = Math.max(1, staggerMs) * 14
                const vw = window.innerWidth || 1
                const vh = window.innerHeight || 1
                const cx = vw / 2
                const cy = vh / 2
                const maxDist = Math.hypot(cx, cy) || 1
                cards.forEach((card) => {
                    try {
                        const r = card.getBoundingClientRect()
                        const dx = r.left + r.width / 2 - cx
                        const dy = r.top + r.height / 2 - cy
                        const delay = Math.round((Math.hypot(dx, dy) / maxDist) * maxSpread)
                        const anim = card.animate([{ opacity: 0 }, { opacity: 1 }], {
                            duration: fadeDuration,
                            delay,
                            easing: SMOOTH_EASE,
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
        gridGap,
        surfaceColor,
        labelStrokeColor,
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
    const maxConcurrentVideos = props.maxConcurrentVideos ?? MAX_CONCURRENT_VIDEOS
    const safariMaxConcurrentVideos =
        props.safariMaxConcurrentVideos ?? SAFARI_MAX_CONCURRENT_VIDEOS
    const iosMaxConcurrentVideos =
        props.iosMaxConcurrentVideos ?? IOS_MAX_CONCURRENT_VIDEOS
    const [pageVisible, setPageVisible] = React.useState(
        () => !canUseDOM() || document.visibilityState !== "hidden"
    )
    const [runtimeMaxConcurrentVideos, setRuntimeMaxConcurrentVideos] =
        React.useState(() => {
            if (!active || !canUseDOM()) return maxConcurrentVideos
            if (document.visibilityState === "hidden") return 0
            const smallViewportBudget =
                window.innerWidth <= 810 ? 8 : maxConcurrentVideos
            const browserBudget = isIOSWebKit()
                ? iosMaxConcurrentVideos
                : isDesktopSafari()
                  ? safariMaxConcurrentVideos
                  : smallViewportBudget
            return Math.min(maxConcurrentVideos, browserBudget)
        })

    React.useEffect(() => {
        if (!active || !canUseDOM()) return
        const updateVisibility = () =>
            setPageVisible(document.visibilityState !== "hidden")
        const hide = () => setPageVisible(false)
        const show = () => setPageVisible(true)
        updateVisibility()
        document.addEventListener("visibilitychange", updateVisibility)
        window.addEventListener("pagehide", hide)
        window.addEventListener("pageshow", show)
        return () => {
            document.removeEventListener("visibilitychange", updateVisibility)
            window.removeEventListener("pagehide", hide)
            window.removeEventListener("pageshow", show)
        }
    }, [active])

    React.useEffect(() => {
        if (!active || !canUseDOM()) {
            setRuntimeMaxConcurrentVideos(maxConcurrentVideos)
            return
        }
        const updateBudget = () => {
            if (!pageVisible) {
                setRuntimeMaxConcurrentVideos(0)
                return
            }
            const smallViewportBudget =
                window.innerWidth <= 810 ? 8 : maxConcurrentVideos
            const browserBudget = isIOSWebKit()
                ? iosMaxConcurrentVideos
                : isDesktopSafari()
                  ? safariMaxConcurrentVideos
                  : smallViewportBudget
            setRuntimeMaxConcurrentVideos(
                Math.min(maxConcurrentVideos, browserBudget)
            )
        }
        updateBudget()
        window.addEventListener("resize", updateBudget, { passive: true })
        return () => window.removeEventListener("resize", updateBudget)
    }, [
        active,
        iosMaxConcurrentVideos,
        maxConcurrentVideos,
        pageVisible,
        safariMaxConcurrentVideos,
    ])

    const initialMaxConcurrentVideos = Math.min(
        runtimeMaxConcurrentVideos,
        props.initialMaxConcurrentVideos ?? INITIAL_MAX_CONCURRENT_VIDEOS
    )
    const videoRampDelayMs = props.videoRampDelayMs ?? VIDEO_RAMP_DELAY_MS
    const [currentMaxConcurrentVideos, setCurrentMaxConcurrentVideos] = React.useState(
        active ? initialMaxConcurrentVideos : runtimeMaxConcurrentVideos
    )

    React.useEffect(() => {
        if (!active || !canUseDOM()) {
            setCurrentMaxConcurrentVideos(runtimeMaxConcurrentVideos)
            return
        }
        setCurrentMaxConcurrentVideos(initialMaxConcurrentVideos)
        if (initialMaxConcurrentVideos >= runtimeMaxConcurrentVideos) return
        const timer = window.setTimeout(
            () => setCurrentMaxConcurrentVideos(runtimeMaxConcurrentVideos),
            Math.max(0, videoRampDelayMs)
        )
        return () => window.clearTimeout(timer)
    }, [
        active,
        initialMaxConcurrentVideos,
        runtimeMaxConcurrentVideos,
        videoRampDelayMs,
    ])

    useViewportFix(active && viewportFixEnabled, containerRef, ancestorDepth)
    useCardStrokeHoverPatch(active)
    usePtRevealReplay(active && patchEnabled, containerRef, loadInFadeMs, loadInStaggerMs)
    usePublicEditorControlGuard(active && editorControlGuard)

    return (
        <div ref={containerRef} data-play-root="true" data-play-nav-hide-offset={navHideOffset} style={{ width: "100%", height: "100%", minHeight: "100vh", ...style }}>
            <ArchivePlayground
                {...archiveProps}
                items={resolvedItems}
                columnGap={props.columnGap ?? gridGap}
                rowGap={props.rowGap ?? gridGap}
                backgroundColor={props.backgroundColor ?? surfaceColor}
                panelColor={props.panelColor ?? surfaceColor}
                labelColor={props.labelColor ?? labelStrokeColor}
                strokeColor={props.strokeColor ?? labelStrokeColor}
                navSelector={navSelector}
                navHideOffset={navHideOffset}
                loadInDelayMs={loadInDelayMs}
                loadInFadeMs={loadInFadeMs}
                loadInStaggerMs={loadInStaggerMs}
                loadInMaxWaitMs={loadInMaxWaitMs}
                maxConcurrentVideos={currentMaxConcurrentVideos}
                driftWhilePanelOpen={props.driftWhilePanelOpen ?? false}
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
        defaultValue: [],
        control: {
            type: ControlType.Object,
            controls: {
                id: { type: ControlType.String, title: "ID", defaultValue: "", hidden: hideInternal },
                title: { type: ControlType.String, title: "Title", defaultValue: "Archive Item" },
                accessibilityLabel: { type: ControlType.String, title: "A11y Label", defaultValue: "" },
                description: { type: ControlType.String, title: "Description", defaultValue: "", displayTextArea: true },
                mediaType: { type: ControlType.Enum, title: "Type", options: ["image", "video", "gif"], optionTitles: ["Image", "Video", "GIF"], defaultValue: "image" },
                image: { type: ControlType.ResponsiveImage, title: "Image / Poster" },
                video: { type: ControlType.File, title: "Video", allowedFileTypes: ["mp4", "mov", "m4v", "webm"], hidden: hideUnlessVideo },
                backupImage: { type: ControlType.String, title: "Backup Image URL", defaultValue: "", placeholder: "fallback if no upload" },
                backupVideo: { type: ControlType.String, title: "Backup Video URL", defaultValue: "", placeholder: "fallback if no upload", hidden: hideUnlessVideo },
                category: { type: ControlType.String, title: "Category", defaultValue: "Archive Image" },
                width: { type: ControlType.Number, title: "Aspect W", defaultValue: 1600, min: 1, max: 8000, step: 1 },
                height: { type: ControlType.Number, title: "Aspect H", defaultValue: 1000, min: 1, max: 8000, step: 1 },
                stroke: { type: ControlType.Enum, title: "Stroke", options: ["auto", "on", "off"], optionTitles: ["Auto", "On", "Off"], defaultValue: "auto" },
            },
        },
    },
    advancedControls: {
        type: ControlType.Boolean,
        title: "Customize",
        defaultValue: false,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
    cellSize: {
        type: ControlType.Number,
        title: "Item Size",
        defaultValue: DEFAULT_CELL_SIZE,
        min: 100,
        max: 360,
        step: 1,
        unit: "px",
        hidden: hideAdvanced,
    },
    gridGap: {
        type: ControlType.Number,
        title: "Item Gap",
        description: "Sets both horizontal and vertical spacing.",
        defaultValue: DEFAULT_GRID_GAP,
        min: 0,
        max: 56,
        step: 1,
        unit: "px",
        hidden: hideAdvanced,
    },
    hoverScale: {
        type: ControlType.Number,
        title: "Hover Size",
        defaultValue: 1.035,
        min: 1,
        max: 1.15,
        step: 0.005,
        hidden: hideAdvanced,
    },
    videoPlaybackMode: {
        type: ControlType.Enum,
        title: "Video Playback",
        options: ["center", "hover"],
        optionTitles: ["Near Center", "Hover Only"],
        defaultValue: "center",
        hidden: hideAdvanced,
    },
    maxConcurrentVideos: {
        type: ControlType.Number,
        title: "Max Videos",
        defaultValue: MAX_CONCURRENT_VIDEOS,
        min: 0,
        max: 30,
        step: 1,
        hidden: hideAdvanced,
    },
    initialMaxConcurrentVideos: {
        type: ControlType.Number,
        title: "Initial Videos",
        defaultValue: INITIAL_MAX_CONCURRENT_VIDEOS,
        min: 0,
        max: 30,
        step: 1,
        hidden: hideAdvanced,
    },
    safariMaxConcurrentVideos: {
        type: ControlType.Number,
        title: "Safari Videos",
        defaultValue: SAFARI_MAX_CONCURRENT_VIDEOS,
        min: 0,
        max: 12,
        step: 1,
        hidden: hideAdvanced,
    },
    iosMaxConcurrentVideos: {
        type: ControlType.Number,
        title: "iOS Videos",
        defaultValue: IOS_MAX_CONCURRENT_VIDEOS,
        min: 0,
        max: 8,
        step: 1,
        hidden: hideAdvanced,
    },
    restingMediaOpacity: {
        type: ControlType.Number,
        title: "Resting Opacity",
        defaultValue: 1,
        min: 0.05,
        max: 1,
        step: 0.05,
        hidden: (props) =>
            hideAdvanced(props) || props.videoPlaybackMode !== "hover",
    },
    restingMediaSaturation: {
        type: ControlType.Number,
        title: "Resting Saturation",
        defaultValue: 1,
        min: 0,
        max: 1,
        step: 0.05,
        hidden: (props) =>
            hideAdvanced(props) || props.videoPlaybackMode !== "hover",
    },
    panelWidth: {
        type: ControlType.Number,
        title: "Panel Width",
        defaultValue: DEFAULT_PANEL_WIDTH,
        min: 300,
        max: 1200,
        step: 1,
        unit: "px",
        hidden: hideAdvanced,
    },
    panelExitMs: {
        type: ControlType.Number,
        title: "Close Speed",
        description: "How long the detail panel takes to close.",
        defaultValue: 950,
        min: 200,
        max: 1400,
        step: 10,
        unit: "ms",
        hidden: hideAdvanced,
    },
    inertiaEnabled: {
        type: ControlType.Boolean,
        title: "Drag Momentum",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
        hidden: hideAdvanced,
    },
    throwVelocityScale: {
        type: ControlType.Number,
        title: "Drag Throw",
        description: "How far the grid carries after a drag.",
        defaultValue: 1.75,
        min: 0.2,
        max: 4,
        step: 0.05,
        hidden: hideAdvanced,
    },
    edgeScrollEnabled: {
        type: ControlType.Boolean,
        title: "Mouse Move",
        description: "Moves the grid when the pointer approaches an edge.",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
        hidden: hideAdvanced,
    },
    edgeScrollSpeed: {
        type: ControlType.Number,
        title: "Mouse Speed",
        description: "Maximum grid speed near page edges and corners.",
        defaultValue: 220,
        min: 0,
        max: 800,
        step: 10,
        hidden: hideAdvanced,
    },
    edgeScrollZone: {
        type: ControlType.Number,
        title: "Mouse Area",
        description: "Distance from an edge where mouse movement begins.",
        defaultValue: 90,
        min: 30,
        max: 220,
        step: 1,
        unit: "px",
        hidden: hideAdvanced,
    },
    edgeScrollEase: {
        type: ControlType.Number,
        title: "Mouse Accel",
        description: "Lower values start slower and ramp up longer.",
        defaultValue: 0.08,
        min: 0.01,
        max: 0.5,
        step: 0.01,
        hidden: hideAdvanced,
    },
    surfaceColor: {
        type: ControlType.Color,
        title: "Surface",
        description: "Sets both the page and detail-panel background.",
        defaultValue: CREAM,
        hidden: hideAdvanced,
    },
    textColor: {
        type: ControlType.Color,
        title: "Text",
        defaultValue: BLACK,
        hidden: hideAdvanced,
    },
    mutedTextColor: {
        type: ControlType.Color,
        title: "Muted Text",
        defaultValue: TEXT_GRAY,
        hidden: hideAdvanced,
    },
    labelStrokeColor: {
        type: ControlType.Color,
        title: "Labels + Lines",
        description: "Sets small labels and media outlines together.",
        defaultValue: LABEL,
        hidden: hideAdvanced,
    },
    ruleColor: {
        type: ControlType.Color,
        title: "Divider",
        defaultValue: RULE,
        hidden: hideAdvanced,
    },
})

Play.displayName = "Play"
