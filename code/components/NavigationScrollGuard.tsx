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
const MOBILE_NAV_STATE_KEY = "__mhMobileNavigation"
const MOBILE_NAV_QUERY = "(max-width: 809px)"
// Framer color styles, type.display-m (mobile), type.label, and nav spacing.
const MOBILE_NAV_CSS = `
@media (max-width: 809px) {
    @view-transition { navigation: none; }
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
    [data-mh-mobile-menu-slot] > :not(.mh-mobile-menu-button) {
        display: none !important;
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
.mh-mobile-menu-button, .mh-mobile-menu-dialog {
    --mh-menu-cream: var(--token-faf217ee-812d-4474-8131-b934f8e4dc1f, rgb(247, 245, 240));
    --mh-menu-green: var(--token-0e64c98e-2e3d-4034-8a86-e95f1a065f27, rgb(35, 51, 36));
    --mh-menu-mono: "GT Standard Mono Regular", "GT Standard Mono Trial Rg", monospace;
}
html.mh-mobile-menu-open body { overflow: hidden !important; }
.mh-mobile-menu-button {
    appearance: none;
    border: 0;
    border-radius: 0;
    margin: 0;
    padding: 0;
    width: 60px;
    min-width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: var(--mh-menu-green);
    font: 400 13px/1 var(--mh-menu-mono);
    letter-spacing: 0;
    cursor: pointer;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
}
.mh-mobile-menu-dialog {
    position: fixed;
    inset: 0;
    box-sizing: border-box;
    width: 100%;
    max-width: none;
    height: 100vh;
    height: 100dvh;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;
    background: var(--mh-menu-green);
    color: var(--mh-menu-cream);
    overflow: auto;
    overscroll-behavior: contain;
}
.mh-mobile-menu-dialog[open] {
    display: flex;
    flex-direction: column;
}
.mh-mobile-menu-dialog::backdrop { background: var(--mh-menu-green); }
.mh-mobile-menu-dialog a {
    color: inherit;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
}
.mh-mobile-menu-top {
    display: flex;
    flex: 0 0 53px;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
}
.mh-mobile-menu-name {
    display: flex;
    align-items: center;
    min-height: 44px;
    font: 400 13px/1 var(--mh-menu-mono);
    text-transform: uppercase;
}
.mh-mobile-menu-dialog .mh-mobile-menu-button { color: inherit; }
.mh-mobile-menu-routes {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 40px 20px;
}
.mh-mobile-menu-routes ul { list-style: none; margin: 0; padding: 0; width: 100%; }
.mh-mobile-menu-routes a {
    display: block;
    width: fit-content;
    min-height: 44px;
    padding: 6px 0;
    font: 400 42px/1 "GT Standard L Regular", "GT Standard Trial L Rg", sans-serif;
    letter-spacing: -0.01em;
    text-transform: uppercase;
}
.mh-mobile-menu-socials {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 0 20px max(12px, env(safe-area-inset-bottom));
    font: 400 13px/1 var(--mh-menu-mono);
}
.mh-mobile-menu-socials a { display: flex; align-items: center; min-height: 44px; }
.mh-mobile-menu-button:focus-visible,
.mh-mobile-menu-dialog a:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }
`

function installMobileNavigation() {
    const media = window.matchMedia(MOBILE_NAV_QUERY)
    let dialog: HTMLDialogElement | null = null
    let button: HTMLButtonElement | null = null
    let slot: HTMLElement | null = null
    let header: HTMLElement | null = null
    let previousTransitionExclusion: string | null = null
    let locked = false
    let frame = 0
    let currentPath = window.location.pathname

    const restoreScroll = () => {
        if (!locked) return
        document.documentElement.classList.remove("mh-mobile-menu-open")
        locked = false
    }
    const close = () => {
        dialog?.close()
        button?.setAttribute("aria-expanded", "false")
        restoreScroll()
    }
    const makeLink = (text: string, href: string) => {
        const link = document.createElement("a")
        link.textContent = text
        link.href = href
        link.setAttribute("data-no-transition", "true")
        return link
    }
    const open = () => {
        if (!media.matches || !dialog || dialog.open) return
        document.documentElement.classList.add("mh-mobile-menu-open")
        locked = true
        dialog.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
            if (link.pathname === window.location.pathname && link.origin === window.location.origin)
                link.setAttribute("aria-current", "page")
            else link.removeAttribute("aria-current")
        })
        dialog.showModal()
        button?.setAttribute("aria-expanded", "true")
        dialog.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true })
    }
    const buildDialog = () => {
        dialog = document.createElement("dialog")
        dialog.id = "mh-mobile-navigation"
        dialog.className = "mh-mobile-menu-dialog"
        dialog.setAttribute("aria-label", "Main navigation")
        dialog.setAttribute("data-lenis-prevent", "true")
        const top = document.createElement("div")
        top.className = "mh-mobile-menu-top"
        const name = makeLink("Micah Hoang", "/")
        name.className = "mh-mobile-menu-name"
        const dismiss = document.createElement("button")
        dismiss.type = "button"
        dismiss.className = "mh-mobile-menu-button"
        dismiss.textContent = "CLOSE"
        dismiss.addEventListener("click", close)
        top.append(name, dismiss)
        const nav = document.createElement("nav")
        nav.className = "mh-mobile-menu-routes"
        nav.setAttribute("aria-label", "Primary")
        const list = document.createElement("ul")
        for (const [label, path] of [["Work", "/"], ["Play", "/play"], ["Index", "/index"], ["About", "/about"]]) {
            const item = document.createElement("li")
            item.append(makeLink(label, path))
            list.append(item)
        }
        nav.append(list)
        const socials = document.createElement("div")
        socials.className = "mh-mobile-menu-socials"
        socials.append(
            makeLink("LINKEDIN", "https://www.linkedin.com/in/micah-hoang-b41028108/"),
            makeLink("EMAIL", "mailto:micah.hoang@hey.com"),
            makeLink("GITHUB", "https://github.com/ArticaVisuals")
        )
        dialog.append(top, nav, socials)
        dialog.addEventListener("keydown", (event) => {
            if (event.key !== "Tab" || !dialog) return
            const targets = Array.from(dialog.querySelectorAll<HTMLElement>("a[href], button"))
            const first = targets[0]
            const last = targets[targets.length - 1]
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        })
        dialog.addEventListener("close", () => {
            button?.setAttribute("aria-expanded", "false")
            restoreScroll()
        })
        document.body.append(dialog)
    }
    const detach = () => {
        close()
        button?.remove()
        slot?.removeAttribute("data-mh-mobile-menu-slot")
        if (header) {
            if (previousTransitionExclusion === null) header.removeAttribute("data-no-transition")
            else header.setAttribute("data-no-transition", previousTransitionExclusion)
        }
        header = null
        button = null
        slot = null
        dialog?.remove()
        dialog = null
    }
    const sync = () => {
        frame = 0
        if (!media.matches) { detach(); return }
        if (button?.isConnected) return
        if (button) detach()
        // The native Phone variant authors the label and reserves its 60×44 box.
        // Replace only that label's hit area, leaving the desktop tree intact.
        const label = Array.from(document.querySelectorAll<HTMLElement>('nav[data-framer-name="Navigation"] [data-framer-name="Text Link Black"]'))
            .find((el) => /^(MENU)+$/.test(labelText(el)) && el.getBoundingClientRect().width > 0)
        if (!label?.parentElement) return
        header = label.closest('nav[data-framer-name="Navigation"]')
        previousTransitionExclusion = header?.getAttribute("data-no-transition") ?? null
        header?.setAttribute("data-no-transition", "true")
        slot = label.parentElement
        button = document.createElement("button")
        button.type = "button"
        button.className = "mh-mobile-menu-button"
        button.textContent = "MENU"
        button.setAttribute("aria-haspopup", "dialog")
        button.setAttribute("aria-controls", "mh-mobile-navigation")
        button.setAttribute("aria-expanded", "false")
        button.addEventListener("click", open)
        slot.append(button)
        slot.setAttribute("data-mh-mobile-menu-slot", "true")
        buildDialog()
    }
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(sync) }
    // These mobile navigation links use normal browser navigation, with no
    // desktop curtain/rollover interception. Preserve modifier-click behavior.
    const onNavigate = (event: MouseEvent) => {
        if (!media.matches || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        const anchor = (event.target as Element)?.closest?.("a[href]") as HTMLAnchorElement | null
        if (!anchor || !(dialog?.contains(anchor) || anchor.closest('nav[data-framer-name="Navigation"]'))) return
        if (anchor.origin !== window.location.origin || anchor.target === "_blank") return
        close()
        // Case-study lightbox protection may already own a Framer router
        // fallback. Close the menu, then let that navigation finish.
        if (event.defaultPrevented) return
        event.stopPropagation()
        if (anchor.pathname === window.location.pathname && !anchor.hash) {
            event.preventDefault()
            window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
        }
    }
    const onRoute = () => {
        if (currentPath === window.location.pathname) return
        currentPath = window.location.pathname
        close()
        schedule()
    }
    const observer = new MutationObserver(schedule)
    observer.observe(document.body, { childList: true, subtree: true })
    media.addEventListener("change", schedule)
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
