import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
// @ts-ignore Framer resolves the existing pinned ESM dependency at runtime.
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
const MOBILE_NAV_STATE_KEY = "__mhMobileNavigation"
const MOBILE_NAV_QUERY = "(max-width: 809px)"
// Framer color styles, type.display-m (mobile), type.label, and nav spacing.
const MOBILE_NAV_CSS = `
@media (max-width: 809px) {
    @view-transition { navigation: none; }
    /* Shared mobile accessibility floor. Preserve each control's authored typography. */
    a[data-framer-name="Social Link"] {
        min-height: 44px !important;
        min-width: 44px !important;
    }
    .idx-tax-item, .idx-view-toggle-option, .selected-work-tag, html body .idx-grid-preview-locked .idx-grid-card-tag {
        min-height: 44px !important;
        min-width: 44px !important;
        box-sizing: border-box !important;
    }
    /* Keep content aligned at rest, while the scroll viewport reaches both screen edges. */
    [data-framer-name="Section Selected Works"] [data-framer-name="Projects"],
    [data-framer-name="Section Selected Works"] > div:has([data-framer-name="Projects"]) {
        overflow: visible !important;
    }
    .selected-work-tags, .idx-grid-card-tags {
        width: 100vw !important;
        max-width: none !important;
        box-sizing: border-box !important;
        margin-inline: calc((100% - 100vw) / 2) !important;
        padding-inline: calc((100vw - 100%) / 2) !important;
        /* Clear fractional-pixel border clipping and the existing focus outline. */
        padding-block: 4px !important;
        margin-block: -4px !important;
        flex-wrap: nowrap !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        scrollbar-width: none;
        min-width: 0;
    }
    .selected-work-tags::-webkit-scrollbar,
    .idx-grid-card-tags::-webkit-scrollbar {
        display: none;
    }
    .selected-work-tag, html body .idx-grid-preview-locked .idx-grid-card-tag {
        padding-inline: 24px !important;
        flex: 0 0 auto !important;
        max-width: none !important;
        white-space: nowrap !important;
    }
    /* Keep the rolling text's existing mask; enlarge only its outer link. */
    a[data-framer-name^="Text Link"] {
        padding-top: 15.5px !important;
        padding-bottom: 15.5px !important;
        min-width: 44px !important;
        box-sizing: content-box !important;
    }
    a[data-framer-name^="Text Link"] > [data-nested-link] {
        overflow: hidden !important;
        transform: none !important;
    }
    nav[data-framer-name="Navigation"] {
        transform: none !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
    }
    nav[data-framer-name="Navigation"] a,
    nav[data-framer-name="Navigation"] a * {
        transform: none !important;
        transition: none !important;
    }
    nav[data-framer-name="Navigation"] [data-framer-name="Open"] {
        height: 100vh !important;
        height: 100dvh !important;
        max-height: 100dvh;
        overflow-y: auto !important;
        overscroll-behavior: contain;
    }
    nav[data-framer-name="Navigation"] [data-framer-name="Menu Button"] {
        touch-action: manipulation;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
    }
    nav[data-framer-name="Navigation"] [data-framer-name="Social Links"] {
        padding-bottom: max(12px, env(safe-area-inset-bottom)) !important;
    }
    nav[data-framer-name="Navigation"] [data-framer-name="Menu Button"]:focus-visible,
    nav[data-framer-name="Navigation"] a:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 4px;
    }
    /* Mobile has no boot curtain: show these headings once, in place.
       The desktop appear/replay choreography keeps its existing ownership. */
    [data-framer-name="Section Hero"]:has([data-framer-name="art"]) [data-framer-appear-id],
    [data-framer-name="Section Selected Works"] [data-framer-name="SELECTED"],
    [data-framer-name="Section Selected Works"] [data-framer-name="WORK"] {
        transform: none !important;
        opacity: 1 !important;
        visibility: visible !important;
        animation: none !important;
        transition: none !important;
    }
}
@media (max-width: 809px) {
    /* One existing page gutter across routes, including open-menu contents. */
    html body nav[data-framer-name="Navigation"] [data-framer-name="Mobile Navigation"] :is(
        [data-framer-name="Header"], [data-framer-name="Routes"], [data-framer-name="Social Links"]
    ),
    body:has(.selected-work-grid) :is(
        [data-framer-name="Section Hero"], [data-framer-name="Header Bottom"],
        [data-framer-name="Section Selected Works"], [data-framer-name="Section About"]
    ),
    html body .idx-grid-preview-locked .idx-container,
    html body [data-framer-name="Section CTA"] > :is([data-framer-name="Tag Wrapper"], [data-framer-name="Container"]),
    [data-framer-name="FooterBlackPhone"], [data-framer-name="FooterWhitePhone"] {
        padding-inline: 20px !important;
    }
    /* The existing case-study footer scale, shared by every route and all four links.
       Override older per-link patches before hydration, including the omitted GitHub row. */
    html body [data-framer-name="Section CTA"] [data-framer-name="CTA Row"] {
        align-items: flex-start !important;
        flex-wrap: wrap !important;
        justify-content: flex-start !important;
        width: 100% !important;
        gap: 10px !important;
        height: auto !important;
        min-height: 44px !important;
        max-width: 100% !important;
        padding: 0 !important;
    }
    html body [data-framer-name="Section CTA"] [data-framer-name="CTA Row"] > :first-child,
    html body [data-framer-name="Section CTA"] [data-framer-name="CTA Row"] > :first-child * {
        font-size: 32px !important;
        line-height: 1em !important;
        letter-spacing: -0.01em !important;
        height: 32px !important;
        min-height: 0 !important;
        max-width: 100% !important;
    }
    html body [data-framer-name="Section CTA"] [data-framer-name="CTA Row"] > :not(:first-child) * {
        font-size: 13px !important;
        line-height: 1em !important;
        letter-spacing: 0.01em !important;
    }
    html body .selected-work-tag,
    html body .idx-grid-preview-locked .idx-grid-card-tag {
        font-size: 13px !important;
        line-height: 1.3 !important;
        /* Center the visible mono capitals, including the Index button's anonymous text.
           The 1px padding bias gives a half-pixel optical correction inside the 44px target. */
        padding-block: 8px 7px !important;
    }
}
/* Canonical route scoping also covers legacy case studies without the bundled controller.
   Unnamed native rows retain their stable Framer export classes; named rows use their authoring names. */
@media (max-width: 809px) {
    /* Legacy intro/credits columns must also release their 320px minimum. */
    html:has(link[rel="canonical"][href*="/case-studies/"]) body :is(.framer-16emxs8, .framer-18ggn3t, .framer-1a3mxks, .framer-1bwccjy, .framer-1dnsfeb, .framer-1ph9pfe, .framer-1pn08we, .framer-1pye8rg, .framer-1t0l1i0, .framer-gula0y, .framer-oqp0w2) {
        flex-direction: column !important;
        align-items: stretch !important;
    }
    html:has(link[rel="canonical"][href*="/case-studies/"]) body :is(.framer-16emxs8, .framer-18ggn3t, .framer-1a3mxks, .framer-1bwccjy, .framer-1dnsfeb, .framer-1ph9pfe, .framer-1pn08we, .framer-1pye8rg, .framer-1t0l1i0, .framer-gula0y, .framer-oqp0w2) > * {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        flex: 0 0 auto !important;
        box-sizing: border-box !important;
    }
    html:has(link[rel="canonical"][href*="/case-studies/"]) body div:has(> [data-framer-component-type="RichTextContainer"] > [data-mh-paragraph-pretty="true"]),
    html:has(link[rel="canonical"][href*="/case-studies/"]) body [data-framer-component-type="RichTextContainer"]:has([data-mh-paragraph-pretty="true"]) {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
    }
    html:has(link[rel="canonical"][href*="/case-studies/"]) body [data-mh-paragraph-pretty="true"] {
        text-wrap: wrap !important;
        text-wrap-style: auto !important;
    }
    html:has(link[rel="canonical"][href*="/case-studies/"]) body :is(
        [data-framer-name="Image Row"],
        [data-framer-name="Social Media"] > div:has(> [data-framer-name="Video Wrapper"]),
        .framer-197d4ih, .framer-tcsjdq, .framer-1m0v5w7, .framer-1iks8es,
        .framer-efd54j, .framer-1l3xtqa, .framer-1aejlgb, .framer-1ghoceu, .framer-j9c4ta, .framer-1fc3kwa,
        .framer-16kn0aq, .framer-1nj99ab, .framer-uelx8v, .framer-116sj3z,
        .framer-f1nm24, .framer-2zyixz, .framer-15v9q1u, .framer-1k2ixaf,
        .framer-5ckims, .framer-mqvrdn, .framer-ch7tr0, .framer-mypv6
    ) {
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
        gap: 10px !important;
    }
    html:has(link[rel="canonical"][href*="/case-studies/"]) body :is(
        [data-framer-name="Image Row"],
        [data-framer-name="Social Media"] > div:has(> [data-framer-name="Video Wrapper"]),
        .framer-197d4ih, .framer-tcsjdq, .framer-1m0v5w7, .framer-1iks8es,
        .framer-efd54j, .framer-1l3xtqa, .framer-1aejlgb, .framer-1ghoceu, .framer-j9c4ta, .framer-1fc3kwa,
        .framer-16kn0aq, .framer-1nj99ab, .framer-uelx8v, .framer-116sj3z,
        .framer-f1nm24, .framer-2zyixz, .framer-15v9q1u, .framer-1k2ixaf,
        .framer-5ckims, .framer-mqvrdn, .framer-ch7tr0, .framer-mypv6
    ) > * {
        width: 100% !important;
        max-width: 100% !important;
        flex: 0 0 auto !important;
        height: auto !important;
    }
    html:has(link[rel="canonical"][href*="/case-studies/"]) body .framer-mypv6 > .ssr-variant > * {
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
    }
    html:has(link[rel="canonical"][href*="/case-studies/"]) body .mh-next-projects-row {
        flex-direction: column !important;
        align-items: stretch !important;
    }
    html:has(link[rel="canonical"][href*="/case-studies/"]) body .mh-next-projects-col {
        width: 100% !important;
        min-width: 0 !important;
        flex: 0 0 auto !important;
    }
    html:has(link[rel="canonical"][href*="/case-studies/"]) body .framer-1nn7mg1-container {
        width: 100% !important;
        height: auto !important;
    }
    html:has(link[rel="canonical"][href*="/case-studies/"]) body :is(
        [data-double-stack-gallery-grid], .double-stack-gallery-left,
        [data-matched-stack-media-pair] .matched-stack-media-pair-grid
    ) {
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 10px !important;
    }
}
html.mh-mobile-menu-open body { overflow: hidden !important; }
`

// Layout, labels, links, and click variants belong to the native Mobile
// Navigation component. This helper only supplies modal keyboard/scroll behavior.
function installMobileNavigation() {
    const media = window.matchMedia(MOBILE_NAV_QUERY)
    let header: HTMLElement | null = null
    let root: HTMLElement | null = null
    let button: HTMLElement | null = null
    let previousTransitionExclusion: string | null = null
    let expanded = false
    let frame = 0
    let currentPath = window.location.pathname
    const inertSiblings = new Map<HTMLElement, boolean>()

    const restoreBackground = () => {
        document.documentElement.classList.remove("mh-mobile-menu-open")
        inertSiblings.forEach((value, element) => { element.inert = value })
        inertSiblings.clear()
    }
    const lockBackground = () => {
        document.documentElement.classList.add("mh-mobile-menu-open")
        // Inert siblings at each ancestor level, retaining any pre-existing lock.
        for (let branch: HTMLElement | null = header; branch?.parentElement; branch = branch.parentElement) {
            for (const sibling of Array.from(branch.parentElement.children)) {
                if (!(sibling instanceof HTMLElement) || sibling === branch || /^(SCRIPT|STYLE|LINK)$/.test(sibling.tagName)) continue
                if (!inertSiblings.has(sibling)) inertSiblings.set(sibling, sibling.inert)
                sibling.inert = true
            }
            if (branch.parentElement === document.body) break
        }
    }
    const activateToggle = () => {
        // Native Framer interactions listen for pointer taps, not HTMLElement.click().
        for (const type of ["pointerdown", "pointerup"]) {
            button?.dispatchEvent(new PointerEvent(type, {
                bubbles: true, pointerId: 1, pointerType: "mouse", isPrimary: true, button: 0,
            }))
        }
    }
    const close = () => {
        if (root?.getAttribute("data-framer-name") === "Open") activateToggle()
        restoreBackground()
    }
    const detach = () => {
        close()
        if (header) {
            if (previousTransitionExclusion === null) header.removeAttribute("data-no-transition")
            else header.setAttribute("data-no-transition", previousTransitionExclusion)
        }
        header = root = button = null
        expanded = false
    }
    const sync = () => {
        frame = 0
        if (!media.matches) { detach(); return }
        const nextRoot = Array.from(document.querySelectorAll<HTMLElement>(
            'nav[data-framer-name="Navigation"] [data-framer-name="Closed"], nav[data-framer-name="Navigation"] [data-framer-name="Open"]'
        )).find((element) => element.getBoundingClientRect().width > 0) || null
        if (!nextRoot) { if (root) detach(); return }
        const nextHeader = nextRoot.closest<HTMLElement>('nav[data-framer-name="Navigation"]')
        if (header !== nextHeader) {
            detach()
            header = nextHeader
            previousTransitionExclusion = header?.getAttribute("data-no-transition") ?? null
            header?.setAttribute("data-no-transition", "true")
        }
        root = nextRoot
        button = root.querySelector<HTMLElement>('[data-framer-name="Menu Button"]')
        const isOpen = root.getAttribute("data-framer-name") === "Open"
        button?.setAttribute("role", "button")
        button?.setAttribute("tabindex", "0")
        button?.setAttribute("aria-label", isOpen ? "Close menu" : "Menu")
        button?.setAttribute("aria-expanded", String(isOpen))
        button?.setAttribute("aria-haspopup", "dialog")
        root.setAttribute("data-lenis-prevent", "true")
        if (isOpen) {
            root.setAttribute("role", "dialog")
            root.setAttribute("aria-modal", "true")
            root.setAttribute("aria-label", "Main navigation")
        } else {
            root.removeAttribute("role")
            root.removeAttribute("aria-modal")
            root.removeAttribute("aria-label")
        }
        root.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((link) => {
            if (link.origin === window.location.origin && link.pathname === window.location.pathname) link.setAttribute("aria-current", "page")
            else link.removeAttribute("aria-current")
        })
        if (isOpen !== expanded) {
            expanded = isOpen
            if (isOpen) lockBackground()
            else restoreBackground()
            button?.focus({ preventScroll: true })
        }
    }
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(sync) }
    const onKeyDown = (event: KeyboardEvent) => {
        if (!media.matches || !root) return
        if (event.target === button && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault()
            event.stopImmediatePropagation()
            activateToggle()
        } else if (expanded && event.key === "Escape") {
            event.preventDefault()
            close()
        } else if (expanded && event.key === "Tab") {
            const targets = Array.from(root.querySelectorAll<HTMLElement>('a[href], [data-framer-name="Menu Button"]'))
            const first = targets[0], last = targets[targets.length - 1]
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault(); last?.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault(); first?.focus()
            }
        }
    }
    const onNavigate = (event: MouseEvent) => {
        if (!media.matches || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        const anchor = (event.target as Element)?.closest?.("a[href]") as HTMLAnchorElement | null
        if (!anchor || !header?.contains(anchor) || anchor.origin !== window.location.origin || anchor.target === "_blank") return
        close()
        // A document navigation also clears the case-study guard's delayed
        // router fallbacks, which otherwise can replay after a quick Back.
        event.preventDefault()
        event.stopImmediatePropagation()
        if (anchor.pathname === window.location.pathname && !anchor.hash) {
            window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
        } else {
            window.location.assign(anchor.href)
        }
    }
    const onRoute = () => {
        if (currentPath === window.location.pathname) return
        currentPath = window.location.pathname
        close()
        schedule()
    }
    const observer = new MutationObserver(schedule)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-framer-name"] })
    media.addEventListener("change", schedule)
    window.addEventListener("keydown", onKeyDown, true)
    window.addEventListener("click", onNavigate, true)
    window.addEventListener("pagehide", close)
    window.addEventListener("popstate", close)
    window.addEventListener("mh:locationchange", onRoute)
    window.addEventListener("framer:pageLoad", onRoute)
    sync()
    return () => {
        observer.disconnect()
        window.cancelAnimationFrame(frame)
        media.removeEventListener("change", schedule)
        window.removeEventListener("keydown", onKeyDown, true)
        window.removeEventListener("click", onNavigate, true)
        window.removeEventListener("pagehide", close)
        window.removeEventListener("popstate", close)
        window.removeEventListener("mh:locationchange", onRoute)
        window.removeEventListener("framer:pageLoad", onRoute)
        detach()
    }
}

function useMobileNavigation(enabled: boolean) {
    React.useEffect(() => {
        if (!enabled || !canUseDOM() || RenderTarget.current() === RenderTarget.canvas) return
        const win = window as any
        const state = win[MOBILE_NAV_STATE_KEY] || (win[MOBILE_NAV_STATE_KEY] = {
            refs: 0, timer: 0, destroy: installMobileNavigation(),
        })
        window.clearTimeout(state.timer)
        state.refs += 1
        return () => {
            state.refs -= 1
            state.timer = window.setTimeout(() => {
                if (state.refs === 0) {
                    state.destroy()
                    delete win[MOBILE_NAV_STATE_KEY]
                }
            }, 0)
        }
    }, [enabled])
}
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
            // The link lives on the outer hit area; its one-line roll mask
            // may be the sole child. Retain support for older inner links.
            const labelContainer =
                anchor.children.length === 1
                    ? anchor.firstElementChild!
                    : anchor
            const lines = Array.from(labelContainer.children).filter(
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
    useMobileNavigation(enabled)

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
        <>
            {enabled && (
                <style
                    data-mh-mobile-navigation-style="true"
                    dangerouslySetInnerHTML={{ __html: MOBILE_NAV_CSS }}
                />
            )}
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
        </>
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
