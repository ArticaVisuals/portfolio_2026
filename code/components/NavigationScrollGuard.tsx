import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import Lenis from "https://esm.sh/lenis@1.3.26"

// Apply Lenis globally while preserving native touch, reduced-motion,
// hash-based Index filters, and the custom two-axis /play interaction.

type Props = {
    enabled?: boolean
    selector?: string
    topThreshold?: number
    smoothScroll?: boolean
    scrollLerp?: number
    style?: React.CSSProperties
}

const DEFAULT_SELECTOR =
    'nav[data-framer-name="Navigation"], nav[name="Navigation"], [data-framer-name="Navigation"], [name="Navigation"]'
const ROOT_CLASS = "mh-nav-at-page-top"
const STYLE_ID = "mh-navigation-scroll-guard-style"
const INFO_ROUTE = "/info"
// Nav text links use a hover "roll": each link holds a visible label line plus
// an identical duplicate line stacked one line-height below, inside a
// one-line-tall overflow:hidden mask. On touch devices (no hover) the roll
// never plays, yet the duplicate line's font content-area overshoots ~1px into
// the mask and leaks a sliver. We tag the duplicate line(s) so CSS can hide
// them where there is no hover. Desktop hover behavior is untouched.
const ROLL_DUPE_ATTR = "data-mh-roll-dupe"
const LENIS_STYLE_ID = "mh-lenis-style"
const LENIS_STATE_KEY = "__mhGlobalLenisState"
const LENIS_PUBLIC_KEY = "__mhLenis"
const LENIS_DEFAULT_LERP = 0.12
const LENIS_EXCLUDED_PATHS = new Set(["/play", "/play-hover-preview"])
const LENIS_PREVENT_SELECTOR = [
    "[data-playground-root='true']",
    "[data-cslb-overlay]",
    "[data-case-study-work-in-progress='true']",
    "[data-lenis-prevent]",
    "[role='dialog']",
].join(", ")
const LENIS_ROUTE_EVENTS = [
    "pageshow",
    "popstate",
    "hashchange",
    "mh:locationchange",
    "framer:pageLoad",
    "pt:reveal",
]
const LENIS_CSS = `
html.lenis,
html.lenis body {
    height: auto;
}

.lenis:not(.lenis-autoToggle).lenis-stopped {
    overflow: clip;
}

.lenis [data-lenis-prevent],
.lenis [data-lenis-prevent-wheel],
.lenis [data-lenis-prevent-touch],
.lenis [data-lenis-prevent-vertical],
.lenis [data-lenis-prevent-horizontal] {
    overscroll-behavior: contain;
}

.lenis.lenis-smooth iframe {
    pointer-events: none;
}

.lenis.lenis-autoToggle {
    transition-property: overflow;
    transition-duration: 1ms;
    transition-behavior: allow-discrete;
}
`

type GlobalLenisState = {
    refs: number
    lenis: any
    lerp: number
    cleanupTimer: number
    resizeFrame: number
    resizeFrame2: number
    anchorListening: boolean
    syncRoute: () => void
    onAnchorClick: (event: MouseEvent) => void
    destroy: () => void
}

function canUseDOM() {
    return typeof window !== "undefined" && typeof document !== "undefined"
}

function normalizedPath() {
    return (window.location.pathname || "/").replace(/\/+$/, "") || "/"
}

function isLenisExcludedRoute() {
    return LENIS_EXCLUDED_PATHS.has(normalizedPath())
}

function clampLenisLerp(value: number | undefined) {
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) return LENIS_DEFAULT_LERP
    return Math.min(0.3, Math.max(0.05, parsed))
}

function ensureLenisStyle() {
    let style = document.getElementById(LENIS_STYLE_ID) as HTMLStyleElement | null
    if (!style) {
        style = document.createElement("style")
        style.id = LENIS_STYLE_ID
        ;(document.head || document.documentElement).appendChild(style)
    }
    if (style.textContent !== LENIS_CSS) style.textContent = LENIS_CSS
}

function removeLenisStyle() {
    const style = document.getElementById(LENIS_STYLE_ID)
    if (style?.parentNode) style.parentNode.removeChild(style)
}

function useGlobalSmoothScroll(enabled: boolean, lerp: number) {
    React.useEffect(() => {
        if (!enabled || !canUseDOM()) return
        const renderTarget = RenderTarget.current()
        if (
            renderTarget === RenderTarget.canvas ||
            renderTarget === RenderTarget.thumbnail
        ) {
            return
        }

        const win = window as any
        let state = win[LENIS_STATE_KEY] as GlobalLenisState | undefined

        if (!state) {
            const createLenis = () => {
                if (state?.lenis || isLenisExcludedRoute()) return
                ensureLenisStyle()

                const instance = new Lenis({
                    autoRaf: true,
                    autoResize: true,
                    autoToggle: true,
                    anchors: false,
                    lerp: state?.lerp || LENIS_DEFAULT_LERP,
                    smoothWheel: true,
                    syncTouch: false,
                    stopInertiaOnNavigate: true,
                    respectReducedMotion: true,
                    prevent: (node: HTMLElement) =>
                        Boolean(node?.closest?.(LENIS_PREVENT_SELECTOR)),
                })

                if (!state) return
                state.lenis = instance
                win[LENIS_PUBLIC_KEY] = instance
                if (!state.anchorListening) {
                    window.addEventListener("click", onAnchorClick, true)
                    state.anchorListening = true
                }
            }

            const destroyLenis = () => {
                if (state?.lenis) {
                    try {
                        state.lenis.destroy()
                    } catch (error) {}
                    state.lenis = null
                }
                if (state?.anchorListening) {
                    window.removeEventListener("click", onAnchorClick, true)
                    state.anchorListening = false
                }
                if (win[LENIS_PUBLIC_KEY]) delete win[LENIS_PUBLIC_KEY]
                removeLenisStyle()
            }

            const scheduleResize = () => {
                if (!state?.lenis) return
                window.cancelAnimationFrame(state.resizeFrame)
                window.cancelAnimationFrame(state.resizeFrame2)
                state.resizeFrame = window.requestAnimationFrame(() => {
                    if (!state) return
                    state.resizeFrame2 = window.requestAnimationFrame(() => {
                        if (!state?.lenis) return
                        try {
                            state.lenis.resize()
                        } catch (error) {}
                    })
                })
            }

            const syncRoute = () => {
                if (isLenisExcludedRoute()) {
                    destroyLenis()
                    return
                }
                createLenis()
                scheduleResize()
            }

            // Lenis's built-in anchor handling would mistake
            // /index#service=... filter transport for a scroll target. Own only
            // real, same-page fragment anchors and leave filter hashes to Index.
            const onAnchorClick = (event: MouseEvent) => {
                if (event.defaultPrevented || event.button !== 0 || !state?.lenis)
                    return
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
                    return

                const target = event.target as Element | null
                const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null
                if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download"))
                    return

                let url: URL
                try {
                    url = new URL(anchor.href, window.location.href)
                } catch (error) {
                    return
                }

                const current = new URL(window.location.href)
                if (
                    url.origin !== current.origin ||
                    url.pathname !== current.pathname ||
                    !url.hash ||
                    url.hash.includes("=")
                ) {
                    return
                }

                let id = ""
                try {
                    id = decodeURIComponent(url.hash.slice(1))
                } catch (error) {
                    return
                }
                const destination = id ? document.getElementById(id) : null
                if (!destination) return

                event.preventDefault()
                state.lenis.scrollTo(destination, {
                    duration: 0.9,
                    onComplete: () => {
                        try {
                            window.history.pushState(null, "", url.hash)
                        } catch (error) {}
                    },
                })
            }

            const destroy = () => {
                destroyLenis()
                window.cancelAnimationFrame(state?.resizeFrame || 0)
                window.cancelAnimationFrame(state?.resizeFrame2 || 0)
                LENIS_ROUTE_EVENTS.forEach((name) =>
                    window.removeEventListener(name, syncRoute)
                )
                if (win[LENIS_STATE_KEY] === state) delete win[LENIS_STATE_KEY]
            }

            state = {
                refs: 0,
                lenis: null,
                lerp: clampLenisLerp(lerp),
                cleanupTimer: 0,
                resizeFrame: 0,
                resizeFrame2: 0,
                anchorListening: false,
                syncRoute,
                onAnchorClick,
                destroy,
            }
            win[LENIS_STATE_KEY] = state
            LENIS_ROUTE_EVENTS.forEach((name) =>
                window.addEventListener(name, syncRoute, { passive: true })
            )
        }

        window.clearTimeout(state.cleanupTimer)
        state.cleanupTimer = 0
        state.refs += 1
        state.lerp = clampLenisLerp(lerp)
        if (state.lenis?.options) state.lenis.options.lerp = state.lerp
        state.syncRoute()

        return () => {
            state.refs = Math.max(0, state.refs - 1)
            if (state.refs > 0) return
            state.cleanupTimer = window.setTimeout(() => {
                if (state.refs === 0) state.destroy()
            }, 0)
        }
    }, [enabled, lerp])
}

function scopedSelector(selector: string) {
    return selector
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => `html.${ROOT_CLASS} body:not(.playground-nav-exit-hidden) ${part}`)
}

function ensureStyle(selector: string) {
    const scoped = scopedSelector(selector)
    if (!scoped.length) return

    let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null
    if (!style) {
        style = document.createElement("style")
        style.id = STYLE_ID
        document.head.appendChild(style)
    }

    const navParts = selector
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
    const dupeSelectors = navParts
        .map((part) => `${part} [${ROLL_DUPE_ATTR}]`)
        .join(",\n")

    style.textContent = `
${scoped.join(",\n")} {
    transform: translate3d(0, 0, 0) !important;
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: auto !important;
}

${scoped
    .map(
        (part) =>
            `${part} :where(a, button, [href], [role="link"], [role="button"], [tabindex])`
    )
    .join(",\n")} {
    pointer-events: auto !important;
}

@media (hover: none), (pointer: coarse) {
${dupeSelectors} {
    visibility: hidden !important;
}
}
`
}

function labelText(element: Element) {
    return (element.textContent || "").replace(/\s+/g, "").toUpperCase()
}

function isInfoLink(anchor: HTMLAnchorElement) {
    return /^(INFO)+$/.test(labelText(anchor))
}

function normalizeInfoLinks(selector: string) {
    document.querySelectorAll(selector).forEach((root) => {
        root.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((anchor) => {
            if (!isInfoLink(anchor)) return
            if (anchor.getAttribute("href") === INFO_ROUTE) return

            anchor.setAttribute("href", INFO_ROUTE)
        })
    })
}

function markNavRollDuplicates(selector: string) {
    document.querySelectorAll(selector).forEach((root) => {
        root.querySelectorAll<HTMLAnchorElement>("a").forEach((anchor) => {
            const lines = Array.from(anchor.children).filter(
                (el) => (el.textContent || "").trim().length > 0
            )
            if (lines.length < 2) return
            const first = (lines[0].textContent || "").trim()
            const identical = lines.every(
                (el) => (el.textContent || "").trim() === first
            )
            if (!identical) return
            lines.slice(1).forEach((el) => {
                if (!el.hasAttribute(ROLL_DUPE_ATTR))
                    el.setAttribute(ROLL_DUPE_ATTR, "1")
            })
        })
    })
}

/**
 * Navigation Scroll Guard
 *
 * Keeps the native Framer navigation hit-testable when its scroll-hide
 * transform gets stranded after returning to the top of the page.
 *
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function NavigationScrollGuard({
    enabled = true,
    selector = DEFAULT_SELECTOR,
    topThreshold = 4,
    smoothScroll = true,
    scrollLerp = LENIS_DEFAULT_LERP,
    style,
}: Props) {
    useGlobalSmoothScroll(smoothScroll, scrollLerp)

    React.useEffect(() => {
        if (!enabled || !canUseDOM()) return
        if (RenderTarget.current() === RenderTarget.canvas) return

        ensureStyle(selector)
        normalizeInfoLinks(selector)
        markNavRollDuplicates(selector)

        let frame = 0
        let linkFrame = 0
        const update = () => {
            frame = 0
            const scrollY =
                window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
            document.documentElement.classList.toggle(
                ROOT_CLASS,
                scrollY <= Math.max(0, topThreshold)
            )
        }
        const schedule = () => {
            if (!frame) frame = window.requestAnimationFrame(update)
        }
        const scheduleLinkNormalize = () => {
            if (!linkFrame) {
                linkFrame = window.requestAnimationFrame(() => {
                    linkFrame = 0
                    normalizeInfoLinks(selector)
                    markNavRollDuplicates(selector)
                })
            }
        }

        const observer =
            typeof MutationObserver !== "undefined"
                ? new MutationObserver(scheduleLinkNormalize)
                : null
        observer?.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["href"],
        })

        update()
        window.addEventListener("scroll", schedule, { passive: true })
        window.addEventListener("resize", schedule)
        window.addEventListener("pageshow", schedule)
        window.addEventListener("popstate", schedule)
        window.addEventListener("pageshow", scheduleLinkNormalize)
        window.addEventListener("popstate", scheduleLinkNormalize)

        return () => {
            window.cancelAnimationFrame(frame)
            window.cancelAnimationFrame(linkFrame)
            observer?.disconnect()
            window.removeEventListener("scroll", schedule)
            window.removeEventListener("resize", schedule)
            window.removeEventListener("pageshow", schedule)
            window.removeEventListener("popstate", schedule)
            window.removeEventListener("pageshow", scheduleLinkNormalize)
            window.removeEventListener("popstate", scheduleLinkNormalize)
            document.documentElement.classList.remove(ROOT_CLASS)

            const style = document.getElementById(STYLE_ID)
            if (style?.parentNode) style.parentNode.removeChild(style)
        }
    }, [enabled, selector, topThreshold])

    return (
        <div
            aria-hidden="true"
            style={{
                ...style,
                width: 1,
                height: 1,
                opacity: 0,
                pointerEvents: "none",
            }}
        />
    )
}

addPropertyControls<Partial<Props>>(NavigationScrollGuard, {
    enabled: {
        type: ControlType.Boolean,
        title: "Enabled",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    selector: {
        type: ControlType.String,
        title: "Selector",
        defaultValue: DEFAULT_SELECTOR,
    },
    topThreshold: {
        type: ControlType.Number,
        title: "Top",
        defaultValue: 4,
        min: 0,
        max: 64,
        step: 1,
        unit: "px",
    },
    smoothScroll: {
        type: ControlType.Boolean,
        title: "Smooth",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    scrollLerp: {
        type: ControlType.Number,
        title: "Scroll feel",
        defaultValue: LENIS_DEFAULT_LERP,
        min: 0.05,
        max: 0.3,
        step: 0.01,
        hidden: (props) => props.smoothScroll === false,
    },
})

NavigationScrollGuard.displayName = "Navigation Scroll Guard"
