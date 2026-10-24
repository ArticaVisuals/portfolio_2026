import {
    addPropertyControls,
    ControlType,
    RenderTarget,
} from "framer"
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    useId,
    type CSSProperties,
    type SyntheticEvent,
} from "react"
import { createPortal } from "react-dom"

type ResponsiveImage = {
    src?: string
    srcSet?: string
    alt?: string
}

interface StageShowcaseProps {
    viewerUrl: string
    poster: ResponsiveImage
    title: string
    aspectRatio: number
    background: string
    style?: CSSProperties
}

type ViewerMessage = {
    type?: unknown
    playing?: unknown
    deltaX?: unknown
    deltaY?: unknown
    playing?: unknown
}

const READY_TIMEOUT_MS = 20_000

/**
 * A poster-backed inline stage that loads near the viewport and expands into
 * an accessible native dialog on request.
 *
 * @framerIntrinsicWidth 1600
 * @framerIntrinsicHeight 900
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function StageShowcase(props: StageShowcaseProps) {
    const {
        viewerUrl = "",
        poster,
        title = "Interactive stage",
        aspectRatio = 16 / 9,
        background = "#080d12",
        style,
    } = props

    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const normalizedViewerUrl = useMemo(() => {
        if (typeof window === "undefined" || !viewerUrl.trim()) return null
        try {
            const url = new URL(viewerUrl.trim(), window.location.href)
            return url.protocol === "http:" || url.protocol === "https:" ? url.href : null
        } catch {
            return null
        }
    }, [viewerUrl])
    const canOpen = Boolean(normalizedViewerUrl) && !isCanvas
    const [isOpen, setIsOpen] = useState(false)
    const [attempt, setAttempt] = useState(0)
    const [viewerState, setViewerState] = useState<"loading" | "ready" | "error">("loading")
    const [hasEnteredViewport, setHasEnteredViewport] = useState(false)
    const [isInViewport, setIsInViewport] = useState(false)
    const viewportRef = useRef<HTMLDivElement>(null)
    const dialogRef = useRef<HTMLDialogElement>(null)
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const didOpenRef = useRef(false)
    const priorViewerUrlRef = useRef(viewerUrl)
    const dialogTitleId = useId()

    const viewerOrigin = useMemo(() => {
        if (!normalizedViewerUrl) return null
        try {
            return new URL(normalizedViewerUrl).origin
        } catch {
            return null
        }
    }, [normalizedViewerUrl])

    const inlineViewerUrl = useMemo(() => {
        if (!normalizedViewerUrl) return null
        try {
            const url = new URL(normalizedViewerUrl)
            url.searchParams.set("inline", "1")
            return url.href
        } catch {
            return null
        }
    }, [normalizedViewerUrl])

    const shouldRenderInline = Boolean(
        canOpen && inlineViewerUrl && hasEnteredViewport && !isOpen && viewerState !== "error",
    )
    const activeFrameMode = isOpen ? "modal" : shouldRenderInline ? "inline" : null

    useEffect(() => {
        const node = viewportRef.current
        if (!node || !canOpen) return

        if (typeof IntersectionObserver === "undefined") {
            setHasEnteredViewport(true)
            return
        }

        const nearObserver = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setHasEnteredViewport(true)
                }
            },
            { rootMargin: "320px 0px" },
        )
        const viewportObserver = new IntersectionObserver(
            (entries) => setIsInViewport(Boolean(entries[0]?.isIntersecting)),
            { rootMargin: "0px" },
        )
        nearObserver.observe(node)
        viewportObserver.observe(node)
        return () => {
            nearObserver.disconnect()
            viewportObserver.disconnect()
        }
    }, [canOpen])

    const closeViewer = useCallback(() => setIsOpen(false), [])
    const openViewer = useCallback(() => {
        if (!canOpen) return
        setViewerState("loading")
        setIsOpen(true)
    }, [canOpen])
    const frameReadyRef = useRef(false)
    const motionPreferenceRef = useRef<boolean | null>(null)

    const sendMotion = useCallback((playing: boolean) => {
        const frame = iframeRef.current
        if (!frame?.contentWindow || !viewerOrigin) return
        frame.contentWindow.postMessage({ type: "crx-stage:motion", playing }, viewerOrigin)
    }, [viewerOrigin])

    const sendVisibility = useCallback(() => {
        const frame = iframeRef.current
        if (!frame?.contentWindow || !viewerOrigin) return
        const bounds = viewportRef.current?.getBoundingClientRect()
        const intersectsViewport = Boolean(
            bounds &&
            bounds.bottom > 0 &&
            bounds.top < window.innerHeight &&
            bounds.right > 0 &&
            bounds.left < window.innerWidth,
        )
        frame.contentWindow.postMessage(
            {
                type: "crx-stage:visibility",
                visible: document.visibilityState === "visible" && (isOpen || intersectsViewport),
            },
            viewerOrigin,
        )
    }, [isInViewport, isOpen, viewerOrigin])

    const sendFrameState = useCallback(() => {
        sendVisibility()
    }, [sendVisibility])

    useEffect(() => {
        if (!isOpen) {
            if (didOpenRef.current) {
                const frame = window.requestAnimationFrame(() => {
                    viewportRef.current?.focus({ preventScroll: true })
                })
                return () => window.cancelAnimationFrame(frame)
            }
            return
        }

        const dialog = dialogRef.current
        if (!dialog) return

        try {
            if (!dialog.open) dialog.showModal()
        } catch {
            setIsOpen(false)
            return
        }

        didOpenRef.current = true

        const body = document.body
        const previousOverflow = body.style.overflow
        const previousPaddingRight = body.style.paddingRight
        const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth)
        body.style.overflow = "hidden"
        if (scrollbarWidth > 0) {
            const currentPadding = Number.parseFloat(getComputedStyle(body).paddingRight) || 0
            body.style.paddingRight = `${currentPadding + scrollbarWidth}px`
        }

        return () => {
            if (dialog.open) dialog.close()
            body.style.overflow = previousOverflow
            body.style.paddingRight = previousPaddingRight
        }
    }, [isOpen])

    useEffect(() => {
        if (!activeFrameMode) return
        frameReadyRef.current = false
        setViewerState("loading")
        setAttempt((current) => current + 1)
    }, [activeFrameMode])

    useEffect(() => {
        if (!activeFrameMode) return
        const timeout = window.setTimeout(() => {
            setViewerState((current) => current === "ready" ? current : "error")
        }, READY_TIMEOUT_MS)
        return () => window.clearTimeout(timeout)
    }, [activeFrameMode, attempt, normalizedViewerUrl])

    useEffect(() => {
        if (priorViewerUrlRef.current === viewerUrl) return
        priorViewerUrlRef.current = viewerUrl
        if (!activeFrameMode && !(hasEnteredViewport && !isOpen)) return
        setViewerState(normalizedViewerUrl ? "loading" : "error")
        setAttempt((current) => current + 1)
    }, [activeFrameMode, hasEnteredViewport, isOpen, normalizedViewerUrl, viewerUrl])

    useEffect(() => {
        if (!activeFrameMode) return
        const onVisibilityChange = () => sendVisibility()
        document.addEventListener("visibilitychange", onVisibilityChange)
        const needsScrollFallback = typeof IntersectionObserver === "undefined"
        if (needsScrollFallback) window.addEventListener("scroll", onVisibilityChange, { passive: true })
        window.addEventListener("resize", onVisibilityChange)
        sendVisibility()
        return () => {
            document.removeEventListener("visibilitychange", onVisibilityChange)
            if (needsScrollFallback) window.removeEventListener("scroll", onVisibilityChange)
            window.removeEventListener("resize", onVisibilityChange)
        }
    }, [activeFrameMode, isInViewport, isOpen, sendVisibility])

    useEffect(() => {
        if (!activeFrameMode || !viewerOrigin) return

        const onMessage = (event: MessageEvent<ViewerMessage>) => {
            if (event.source !== iframeRef.current?.contentWindow) return
            if (event.origin !== viewerOrigin) return
            if (!event.data || typeof event.data !== "object") return

            if (event.data.type === "crx-stage:ready") {
                frameReadyRef.current = true
                sendVisibility()
                if (motionPreferenceRef.current !== null) {
                    sendMotion(motionPreferenceRef.current)
                }
                setViewerState("ready")
            } else if (event.data.type === "crx-stage:close") {
                closeViewer()
            } else if (event.data.type === "crx-stage:motion" && typeof event.data.playing === "boolean") {
                if (frameReadyRef.current) motionPreferenceRef.current = event.data.playing
            } else if (event.data.type === "crx-stage:expand" && activeFrameMode === "inline") {
                openViewer()
            } else if (event.data.type === "crx-stage:scroll" && activeFrameMode === "inline") {
                const deltaX = typeof event.data.deltaX === "number" && Number.isFinite(event.data.deltaX)
                    ? Math.max(-1200, Math.min(1200, event.data.deltaX))
                    : 0
                const deltaY = typeof event.data.deltaY === "number" && Number.isFinite(event.data.deltaY)
                    ? Math.max(-1200, Math.min(1200, event.data.deltaY))
                    : 0
                window.scrollBy({ left: deltaX, top: deltaY })
            }
        }

        window.addEventListener("message", onMessage)
        return () => window.removeEventListener("message", onMessage)
    }, [activeFrameMode, closeViewer, openViewer, sendMotion, sendVisibility, viewerOrigin])

    const retryViewer = () => {
        if (!normalizedViewerUrl) return
        setViewerState("loading")
        if (isOpen) setAttempt((current) => current + 1)
    }

    const handleDialogClick = (event: SyntheticEvent<HTMLDialogElement>) => {
        if (event.target === event.currentTarget) closeViewer()
    }

    const posterAlt = poster?.alt ?? ""
    const cardStyle: CSSProperties = {
        ...style,
        position: "relative",
        width: style?.width ?? "100%",
        height: style?.height ?? "auto",
        background: "transparent",
        color: style?.color ?? "#233324",
        isolation: "isolate",
    }

    const posterContent = (
        <>
            {poster?.src ? <img src={poster.src} srcSet={poster.srcSet} sizes="100vw" alt={posterAlt} loading="lazy" draggable={false} style={posterImageStyle} /> : null}
        </>
    )

    const dialog = isOpen && typeof document !== "undefined"
        ? createPortal(
            <dialog
                ref={dialogRef}
                data-no-lightbox
                aria-labelledby={dialogTitleId}
                onCancel={(event) => {
                    event.preventDefault()
                    closeViewer()
                }}
                onClose={closeViewer}
                onClick={handleDialogClick}
                style={dialogStyle}
            >
                <div style={viewerShellStyle}>
                    <h2 id={dialogTitleId} style={visuallyHiddenStyle}>{title}</h2>
                    <div style={modalViewportStyle}>
                        {viewerState !== "error" && normalizedViewerUrl ? (
                            <iframe
                                key={`${normalizedViewerUrl}:modal`}
                                ref={iframeRef}
                                src={normalizedViewerUrl}
                                title={`${title} interactive stage`}
                                allow="autoplay; fullscreen"
                                allowFullScreen
                                onLoad={sendFrameState}
                                onError={() => setViewerState("error")}
                                style={{
                                    ...iframeStyle,
                                    opacity: viewerState === "ready" ? 1 : 0,
                                    pointerEvents: viewerState === "ready" ? "auto" : "none",
                                }}
                            />
                        ) : null}
                    </div>
                    <div style={modalCaptionStyle}>
                        {viewerState !== "ready" ? (
                            <span role={viewerState === "error" ? "alert" : "status"} aria-live="polite">
                                {viewerState === "error" ? "The stage could not load." : "Loading stage…"}
                            </span>
                        ) : null}
                        {viewerState === "error" && normalizedViewerUrl ? (
                            <button type="button" onClick={retryViewer} style={textControlStyle}>Try again</button>
                        ) : null}
                        <button type="button" aria-label="Close interactive stage" onClick={closeViewer} style={textControlStyle}>Close</button>
                    </div>
                </div>
            </dialog>,
            document.body,
        )
        : null

    return (
        <div data-no-lightbox style={cardStyle}>
            <div
                ref={viewportRef}
                data-crx-stage-viewport
                role={canOpen ? "button" : undefined}
                tabIndex={canOpen ? 0 : undefined}
                aria-label={`${title}. Click to expand. Drag to explore. Space pauses motion within the viewer.`}
                onClick={openViewer}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        event.preventDefault()
                        openViewer()
                    }
                }}
                style={{
                    ...viewportStyle,
                    background,
                    aspectRatio: String(Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : 16 / 9),
                }}
            >
                <div data-crx-stage-media style={mediaStyle}>
                    {posterContent}
                    {shouldRenderInline && inlineViewerUrl ? (
                        <iframe
                            key={`${inlineViewerUrl}:inline`}
                            ref={iframeRef}
                            src={inlineViewerUrl}
                            title={`${title} interactive stage preview`}
                            allow="autoplay; fullscreen"
                            allowFullScreen
                            onLoad={sendFrameState}
                            onError={() => setViewerState("error")}
                            style={{
                                ...inlineIframeStyle,
                                opacity: viewerState === "ready" ? 1 : 0,
                                pointerEvents: viewerState === "ready" ? "auto" : "none",
                            }}
                        />
                    ) : null}
                </div>
            </div>
            {hasEnteredViewport && !isOpen && canOpen && viewerState === "error" ? (
                <div style={errorRowStyle} role="alert">
                    <span>The stage could not load.</span>
                    <button type="button" onClick={retryViewer} style={textControlStyle}>Try again</button>
                </div>
            ) : null}
            {dialog}
            <style>{hoverAndReducedMotionStyles}</style>
        </div>
    )
}

const viewportStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    background: "#080d12",
    borderRadius: 0,
}

const mediaStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    transformOrigin: "center",
    transition: "transform 420ms cubic-bezier(0.16, 1, 0.3, 1)",
}

const posterImageStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
}

const inlineIframeStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    width: "100%",
    height: "100%",
    border: 0,
    background: "transparent",
    transition: "opacity 180ms ease-out",
}

const errorRowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    minHeight: 34,
    marginTop: 10,
    color: "inherit",
    fontSize: 12,
    lineHeight: 1.4,
}

const textControlStyle: CSSProperties = {
    minHeight: 32,
    padding: "4px 0",
    border: 0,
    color: "inherit",
    background: "transparent",
    font: "inherit",
    fontSize: 12,
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlineOffset: 3,
}

const dialogStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    width: "100vw",
    height: "100dvh",
    maxWidth: "none",
    maxHeight: "none",
    margin: 0,
    padding: 0,
    border: 0,
    background: "#080d12",
    color: "#f5f7fa",
    overflow: "hidden",
}

const viewerShellStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: "12px 20px max(12px, env(safe-area-inset-bottom))",
    boxSizing: "border-box",
    background: "#080d12",
}

const modalViewportStyle: CSSProperties = {
    position: "relative",
    flex: "1 1 auto",
    minHeight: 0,
    width: "100%",
    overflow: "hidden",
    background: "#080d12",
}

const modalCaptionStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 18,
    minHeight: 36,
    color: "rgba(245,247,250,.74)",
    fontSize: 12,
}

const iframeStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    border: 0,
    background: "#080d12",
    transition: "opacity 180ms ease-out",
}

const visuallyHiddenStyle: CSSProperties = {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
}

const hoverAndReducedMotionStyles = `
    [data-crx-stage-media] { transform: scale(1); }
    @media (hover: hover) and (pointer: fine) {
        [data-crx-stage-viewport] [data-crx-stage-media]:hover {
            transform: scale(1.02);
        }
    }
    @media (prefers-reduced-motion: reduce) {
        [data-crx-stage-media] { transition: none !important; transform: none !important; }
        [data-no-lightbox] iframe { transition: none !important; }
    }
`

addPropertyControls<StageShowcaseProps>(StageShowcase, {
    viewerUrl: {
        type: ControlType.String,
        title: "Viewer URL",
        placeholder: "https://…",
        defaultValue: "",
    },
    poster: {
        type: ControlType.ResponsiveImage,
        title: "Poster",
    },
    title: {
        type: ControlType.String,
        title: "Accessible Title",
        defaultValue: "Interactive stage",
    },
    aspectRatio: {
        type: ControlType.Number,
        title: "Aspect Ratio",
        defaultValue: 16 / 9,
        min: 0.5,
        max: 2.4,
        step: 0.01,
    },
    background: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#080d12",
    },
})
