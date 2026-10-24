import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react"

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
}

type StageCSSProperties = CSSProperties & {
    "--crx-stage-ratio"?: string
}

const READY_TIMEOUT_MS = 20_000

/**
 * An inline interactive stage that loads shortly before it enters the viewport.
 *
 * @framerIntrinsicWidth 1600
 * @framerIntrinsicHeight 969
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
    const canRender = Boolean(normalizedViewerUrl) && !isCanvas
    const [attempt, setAttempt] = useState(0)
    const [viewerState, setViewerState] = useState<"loading" | "ready" | "error">("loading")
    const [hasEnteredViewport, setHasEnteredViewport] = useState(false)
    const [isInViewport, setIsInViewport] = useState(false)
    const viewportRef = useRef<HTMLDivElement>(null)
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const frameReadyRef = useRef(false)
    const priorViewerUrlRef = useRef(viewerUrl)

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
        canRender && inlineViewerUrl && hasEnteredViewport && viewerState !== "error",
    )

    useEffect(() => {
        const node = viewportRef.current
        if (!node || !canRender) return

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
    }, [canRender])

    const sendVisibility = useCallback(() => {
        const frame = iframeRef.current
        const origin = viewerOrigin
        if (!frame?.contentWindow || !origin) return

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
                visible: document.visibilityState === "visible" && intersectsViewport,
            },
            origin,
        )
    }, [viewerOrigin])

    useEffect(() => {
        if (!shouldRenderInline) return
        frameReadyRef.current = false
        setViewerState("loading")
    }, [shouldRenderInline])

    useEffect(() => {
        if (!shouldRenderInline) return
        const timeout = window.setTimeout(() => {
            setViewerState((current) => current === "ready" ? current : "error")
        }, READY_TIMEOUT_MS)
        return () => window.clearTimeout(timeout)
    }, [attempt, normalizedViewerUrl, shouldRenderInline])

    useEffect(() => {
        if (priorViewerUrlRef.current === viewerUrl) return
        priorViewerUrlRef.current = viewerUrl
        if (!hasEnteredViewport) return
        setViewerState(normalizedViewerUrl ? "loading" : "error")
        setAttempt((current) => current + 1)
    }, [hasEnteredViewport, normalizedViewerUrl, viewerUrl])

    useEffect(() => {
        if (!shouldRenderInline || !viewerOrigin) return

        const onMessage = (event: MessageEvent<ViewerMessage>) => {
            if (event.source !== iframeRef.current?.contentWindow) return
            if (event.origin !== viewerOrigin) return
            if (!event.data || typeof event.data !== "object") return

            if (event.data.type === "crx-stage:ready") {
                frameReadyRef.current = true
                sendVisibility()
                setViewerState("ready")
            } else if (event.data.type === "crx-stage:scroll") {
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
    }, [sendVisibility, shouldRenderInline, viewerOrigin])

    useEffect(() => {
        if (!shouldRenderInline) return

        const onVisibilityChange = () => sendVisibility()
        document.addEventListener("visibilitychange", onVisibilityChange)
        window.addEventListener("resize", onVisibilityChange)
        const needsScrollFallback = typeof IntersectionObserver === "undefined"
        if (needsScrollFallback) window.addEventListener("scroll", onVisibilityChange, { passive: true })
        sendVisibility()

        return () => {
            document.removeEventListener("visibilitychange", onVisibilityChange)
            window.removeEventListener("resize", onVisibilityChange)
            if (needsScrollFallback) window.removeEventListener("scroll", onVisibilityChange)
        }
    }, [isInViewport, sendVisibility, shouldRenderInline])

    const retryViewer = () => {
        if (!normalizedViewerUrl) return
        setViewerState("loading")
        setAttempt((current) => current + 1)
    }

    const ratio = Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : 16 / 9
    const cardStyle: StageCSSProperties = {
        ...style,
        position: "relative",
        width: style?.width ?? "100%",
        height: "auto",
        background: "transparent",
        color: style?.color ?? "#233324",
        isolation: "isolate",
        containerType: "inline-size",
        containerName: "crx-stage-showcase",
        "--crx-stage-ratio": String(ratio),
    }

    return (
        <div data-no-lightbox data-crx-stage-container style={cardStyle}>
            <div
                ref={viewportRef}
                data-crx-stage-viewport
                role="region"
                aria-label={title}
                style={{ ...viewportStyle, background }}
            >
                {poster?.src ? (
                    <img
                        src={poster.src}
                        srcSet={poster.srcSet}
                        sizes="100vw"
                        alt={shouldRenderInline && viewerState === "ready" ? "" : poster.alt ?? ""}
                        loading="lazy"
                        draggable={false}
                        style={posterImageStyle}
                    />
                ) : null}
                {shouldRenderInline && inlineViewerUrl ? (
                    <iframe
                        key={`${inlineViewerUrl}:${attempt}`}
                        ref={iframeRef}
                        src={inlineViewerUrl}
                        title={title}
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        onLoad={sendVisibility}
                        onError={() => setViewerState("error")}
                        style={{
                            ...iframeStyle,
                            opacity: viewerState === "ready" ? 1 : 0,
                            pointerEvents: viewerState === "ready" ? "auto" : "none",
                        }}
                    />
                ) : null}
            </div>
            {hasEnteredViewport && viewerState === "error" ? (
                <div style={errorRowStyle} role="alert">
                    <span>The stage could not load.</span>
                    <button type="button" onClick={retryViewer} style={retryButtonStyle}>Try again</button>
                </div>
            ) : null}
            <style>{reducedMotionStyles}</style>
        </div>
    )
}

const viewportStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    borderRadius: 0,
}

const posterImageStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
}

const iframeStyle: CSSProperties = {
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

const retryButtonStyle: CSSProperties = {
    minHeight: 36,
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

const reducedMotionStyles = `
    [data-crx-stage-viewport] { height: calc(100cqw / var(--crx-stage-ratio, 1.7778)); }
    @media (prefers-reduced-motion: reduce) {
        [data-crx-stage-viewport] iframe { transition: none !important; }
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
