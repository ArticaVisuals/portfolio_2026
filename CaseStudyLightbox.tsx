import * as React from "react"
// Framer's code-file type package can lag behind the published runtime.
// @ts-ignore
import { addPropertyControls, ControlType, RenderTarget, useRouter } from "framer"
// @ts-ignore - Framer resolves versioned project module URLs at bundle time.
import BaseCaseStudyLightbox from "https://framer.com/m/CaseStudyLightbox-yOYpGN.js@Wd9cFUrIcpA2FcGDV0Ys"

type Config = {
    enabled: boolean
    lightboxVideos: boolean
    videoControls: boolean
    backgroundColor: string
    chromeColor: string
    iconWeight: number
    iconSize: number
    showArrows: boolean
    showClose: boolean
    showCounter: boolean
    clickImageAdvances: boolean
    loopNavigation: boolean
    duration: number
    viewportPadding: number
    minSize: number
    excludeSelector: string
}
type FramerRoute = {
    path?: string
    pathLocalized?: Record<string, string>
    page?: { preload?: () => unknown }
}
type FramerRouter = {
    navigate?: (
        routeId: string,
        hash?: string,
        pathVariables?: Record<string, string>,
        smoothScroll?: boolean
    ) => unknown
    routes?: Record<string, FramerRoute | undefined>
}
type RouterMatch = {
    routeId: string
    hash?: string
    pathVariables?: Record<string, string>
}

// Selectors that identify the site nav layers. Used purely for hit-testing in
// the click guard now — we no longer mutate the nav's CSS (that broke the nav
// hover/flip-text reset). Raising z-index / isolation never actually fixed the
// click anyway: the base lightbox finds media UNDER the nav via
// elementsFromPoint, so the only reliable fix is the event guard below.
const CASE_STUDY_NAV_SELECTOR_LIST = [
    "nav",
    '[data-framer-name="Navigation"]',
    '[name="Navigation"]',
    '[data-framer-name="Nav"]',
    '[name="Nav"]',
    '[data-framer-name="Navbar"]',
    '[name="Navbar"]',
    '[data-framer-name*="Navigation" i]',
    '[name*="Navigation" i]',
    '[data-framer-name*="Navbar" i]',
    '[name*="Navbar" i]',
    '[data-framer-name*="Top Nav" i]',
    '[name*="Top Nav" i]',
    'header[data-framer-name*="Navigation" i]',
    'header[name*="Navigation" i]',
]
const CASE_STUDY_NAV_SELECTORS = CASE_STUDY_NAV_SELECTOR_LIST.join(",")
// Rules that must ALWAYS exclude an element from the lightbox, regardless of
// what an individual instance typed into its Exclude control. The name-based
// rules let you opt media out with zero code: name any frame "No Lightbox"
// (or "NoLightbox" - both spellings, case-insensitive substring) and wrap the
// media in it.
const ALWAYS_EXCLUDE_RULES = [
    "[data-no-lightbox]",
    '[data-framer-name*="No Lightbox" i]',
    '[data-framer-name*="NoLightbox" i]',
]
const DEFAULT_LIGHTBOX_EXCLUDE_SELECTOR =
    'nav, header, footer, a, button, video[controls], [data-no-lightbox], [data-framer-name*="No Lightbox" i], [data-framer-name*="NoLightbox" i]'
// Controls that own their own click behavior. When a click on one of these is
// guarded, we must NOT swallow the click (that previously broke the
// scroll-to-top button and the gallery) - we only suppress the lightbox.
const INTERACTIVE_SELECTOR =
    'button, [role="button"], [role="link"], input, select, textarea, label, summary, a[href]'
const MOBILE_FOOTER_STYLE_ID = "case-study-mobile-footer-layout-v2"
const SNAPPY_EASE = "cubic-bezier(0.16, 1, 0.3, 1)"
const MEDIA_SKELETON_STYLE_ID = "case-study-media-skeleton-v1"
const MEDIA_SKELETON_COLOR = "rgba(255, 255, 255, 0.6)"
const MEDIA_SKELETON_SELECTOR = "img, video, iframe"
const MEDIA_SKELETON_STATE_ATTR = "data-case-study-media-state"
// Framer's native video layer is 16:9 until metadata arrives. Most case-study
// social video rows are portrait, so this prevents first-boot row collapse.
const MEDIA_SKELETON_VIDEO_FALLBACK_RATIO = 4 / 5
const MOBILE_FOOTER_STYLE = `
@media (max-width: 809px) {
    [data-case-study-mobile-cta-section="true"] {
        max-width: 100vw !important;
        overflow-x: hidden !important;
        width: 100% !important;
    }

    [data-case-study-mobile-cta-container="true"] {
        align-items: flex-start !important;
        box-sizing: border-box !important;
        gap: 10px !important;
        height: auto !important;
        max-width: 100% !important;
        min-height: 0 !important;
        overflow: visible !important;
        padding-left: 15px !important;
        padding-right: 15px !important;
        width: 100% !important;
    }

    [data-case-study-mobile-cta-row] {
        align-items: flex-start !important;
        align-self: flex-start !important;
        box-sizing: border-box !important;
        display: flex !important;
        flex: 0 0 auto !important;
        flex-direction: row !important;
        gap: 10px !important;
        height: auto !important;
        justify-content: flex-start !important;
        max-height: none !important;
        max-width: calc(100vw - 30px) !important;
        min-height: 32px !important;
        overflow: visible !important;
        padding: 0 !important;
        width: fit-content !important;
    }

    [data-case-study-mobile-cta-row="email"] {
        min-height: 34px !important;
        padding-top: 2px !important;
    }

    [data-case-study-mobile-cta-row] > :first-child,
    [data-case-study-mobile-cta-label="true"] {
        display: block !important;
        flex: 0 0 auto !important;
        height: 32px !important;
        max-height: none !important;
        max-width: calc(100vw - 30px) !important;
        min-height: 32px !important;
        min-width: 0 !important;
        overflow: visible !important;
        width: auto !important;
    }

    [data-case-study-mobile-cta-row] > :first-child,
    [data-case-study-mobile-cta-row] > :first-child *,
    [data-case-study-mobile-cta-label="true"],
    [data-case-study-mobile-cta-label="true"] * {
        font-family: "GT Standard Trial L Md", "GT Standard Trial L Md Placeholder", "GT Standard Trial", sans-serif !important;
        font-size: 32px !important;
        font-weight: 500 !important;
        height: 32px !important;
        letter-spacing: -2px !important;
        line-height: 32px !important;
        max-height: none !important;
        overflow: visible !important;
        width: auto !important;
    }

    [data-case-study-mobile-cta-row] > :first-child > *,
    [data-case-study-mobile-cta-label="true"] > *,
    [data-case-study-mobile-cta-label="true"] span {
        display: inline-block !important;
    }

    [data-case-study-mobile-cta-row] > :not(:first-child),
    [data-case-study-mobile-cta-meta="true"] {
        flex: 0 0 auto !important;
        height: 13px !important;
        max-height: none !important;
        overflow: visible !important;
        width: auto !important;
    }

    [data-case-study-mobile-cta-row] > :not(:first-child) *,
    [data-case-study-mobile-cta-meta="true"] * {
        font-size: 13px !important;
        height: 13px !important;
        letter-spacing: -0.13px !important;
        line-height: 13px !important;
        max-height: none !important;
        overflow: visible !important;
        text-transform: uppercase !important;
        width: auto !important;
    }
}
`
const MEDIA_SKELETON_STYLE = `
[data-case-study-media-skeleton="true"]::before {
    background: var(--case-study-media-skeleton-color, ${MEDIA_SKELETON_COLOR});
    border-radius: inherit;
    box-sizing: border-box;
    content: "";
    inset: 0;
    opacity: 1;
    pointer-events: none;
    position: absolute;
    transition: opacity 420ms ${SNAPPY_EASE};
    z-index: 2147483647;
}

[data-case-study-media-skeleton="true"]:not([data-case-study-media-ready="true"]) {
    border-color: transparent !important;
}

[data-case-study-media-skeleton-ratio="true"]:not([data-case-study-media-ready="true"]) {
    aspect-ratio: var(--case-study-media-skeleton-aspect-ratio) !important;
}

[data-case-study-media-skeleton="true"][data-case-study-media-ready="true"]::before {
    opacity: 0;
}

[data-case-study-media-skeleton="true"][data-case-study-media-failed="true"]::before {
    opacity: 1;
}

[data-case-study-media-skeleton-media="true"] {
    opacity: 0 !important;
    pointer-events: none !important;
}

[data-case-study-media-skeleton-media="true"][data-case-study-media-state="failed"] {
    opacity: 0 !important;
}

@media (prefers-reduced-motion: reduce) {
    [data-case-study-media-skeleton="true"]::before {
        transition: none !important;
    }
}
`

function isCaseStudyDetailPage(): boolean {
    if (typeof window === "undefined") return false
    const path = window.location.pathname.replace(/\/+$/, "")
    return path.startsWith("/case-studies/") && path.length > "/case-studies/".length
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function stripTrailingSlash(pathname: string): string {
    if (!pathname || pathname === "/") return "/"
    return pathname.replace(/\/+$/, "") || "/"
}

function getSameOriginUrl(href: string): URL | null {
    if (!href || href === "#") return null
    if (typeof window === "undefined") return null

    try {
        const url = new URL(href, window.location.href)
        return url.origin === window.location.origin ? url : null
    } catch {
        return null
    }
}

function matchRoutePath(pattern: string, pathname: string): Record<string, string> | null {
    const normalizedPattern = stripTrailingSlash(pattern)
    const normalizedPathname = stripTrailingSlash(pathname)
    if (normalizedPattern === normalizedPathname) return {}

    const variableNames: string[] = []
    const source = normalizedPattern
        .split("/")
        .map((part) => {
            if (part.startsWith(":") && part.length > 1) {
                variableNames.push(part.slice(1))
                return "([^/]+)"
            }
            return escapeRegExp(part)
        })
        .join("/")
    const match = normalizedPathname.match(new RegExp(`^${source}$`))
    if (!match) return null

    return variableNames.reduce<Record<string, string>>((pathVariables, name, index) => {
        const value = match[index + 1]
        if (value !== undefined) pathVariables[name] = decodeURIComponent(value)
        return pathVariables
    }, {})
}

function getRoutePaths(route: FramerRoute): string[] {
    return [route.path, ...Object.values(route.pathLocalized || {})].filter(Boolean) as string[]
}

function getFramerRouteMatch(router: FramerRouter | undefined, href: string): RouterMatch | null {
    const url = getSameOriginUrl(href)
    const routes = router?.routes
    if (!url || !routes) return null

    const pathname = stripTrailingSlash(url.pathname)
    const routeEntries = Object.entries(routes)
        .filter((entry): entry is [string, FramerRoute] => Boolean(entry[1]?.path))
        .sort(([, a], [, b]) => {
            const aDepth = (a.path || "/").split("/").length
            const bDepth = (b.path || "/").split("/").length
            return bDepth - aDepth
        })

    for (const [routeId, route] of routeEntries) {
        for (const routePath of getRoutePaths(route)) {
            const pathVariables = matchRoutePath(routePath, pathname)
            if (pathVariables) {
                return {
                    routeId,
                    hash: url.hash ? decodeURIComponent(url.hash.slice(1)) : undefined,
                    pathVariables,
                }
            }
        }
    }

    return null
}

function navigateFramerRoute(router: FramerRouter | undefined, match: RouterMatch): boolean {
    if (typeof router?.navigate !== "function") return false

    try {
        router.routes?.[match.routeId]?.page?.preload?.()
        router.navigate(match.routeId, match.hash, match.pathVariables, false)
        return true
    } catch {
        return false
    }
}

function scheduleFramerRouteFallback(
    router: FramerRouter | undefined,
    match: RouterMatch,
    href: string,
    fromHref: string
) {
    const targetUrl = getSameOriginUrl(href)
    if (!targetUrl) return

    const hasArrived = () => {
        try {
            const current = new URL(window.location.href)
            return (
                stripTrailingSlash(current.pathname) === stripTrailingSlash(targetUrl.pathname) &&
                current.hash === targetUrl.hash
            )
        } catch {
            return false
        }
    }

    const fallback = () => {
        if (hasArrived() || window.location.href !== fromHref) return
        if (!navigateFramerRoute(router, match)) window.location.assign(targetUrl.href)
    }

    window.setTimeout(fallback, 180)
    window.setTimeout(fallback, 900)
}

function stabilizeTopScrollAfterRoute(href: string) {
    const targetUrl = getSameOriginUrl(href)
    if (!targetUrl || targetUrl.hash) return

    const targetPath = stripTrailingSlash(targetUrl.pathname)
    const start = performance.now()
    const duration = 700

    const tick = () => {
        try {
            if (stripTrailingSlash(window.location.pathname) === targetPath) {
                window.scrollTo(0, 0)
            }
            if (performance.now() - start < duration) {
                window.requestAnimationFrame(tick)
            }
        } catch {
            // Best-effort scroll hygiene only.
        }
    }

    window.requestAnimationFrame(tick)
}

function shouldHandleAnchorRoute(event: MouseEvent, anchor: HTMLAnchorElement): boolean {
    if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
    ) {
        return false
    }

    const target = anchor.getAttribute("target")
    return !target || target === "_self"
}

function normalizeCtaText(value: string): string {
    return String(value || "")
        .replace(/\s+/g, "")
        .toUpperCase()
}

function getMobileFooterCtaType(anchor: HTMLAnchorElement): string {
    const text = normalizeCtaText(anchor.textContent || "")

    if (text === "MICAH.HOANG@HEY.COM") return "email"
    if (text === "LINKEDINCONNECT") return "linkedin"
    if (text === "COSMOSINSPIRE") return "cosmos"

    return ""
}

function getLightboxExcludeSelector(excludeSelector: string | undefined): string {
    const base = String(excludeSelector || DEFAULT_LIGHTBOX_EXCLUDE_SELECTOR).trim()
    const parts = base.length ? base.split(",").map((part) => part.trim()).filter(Boolean) : []

    // Force the always-on rules to be present so opting media out keeps working
    // even on instances whose Exclude control still holds an older value.
    for (const rule of ALWAYS_EXCLUDE_RULES) {
        if (!parts.some((part) => part === rule)) parts.push(rule)
    }

    return parts.join(", ")
}

function closestCaseStudyNavLayer(el: Element | null): HTMLElement | null {
    if (!(el instanceof HTMLElement)) return null

    try {
        return el.closest(CASE_STUDY_NAV_SELECTORS) as HTMLElement | null
    } catch {
        return null
    }
}

function getCaseStudyNavLayerElements(): HTMLElement[] {
    if (typeof document === "undefined") return []
    const out: HTMLElement[] = []
    const seen = new Set<HTMLElement>()

    document.querySelectorAll<HTMLElement>(CASE_STUDY_NAV_SELECTORS).forEach((el) => {
        const parentMatch = closestCaseStudyNavLayer(el.parentElement)
        if (parentMatch) return
        if (seen.has(el)) return
        seen.add(el)
        out.push(el)
    })

    return out
}

function isVisibleElementAtPoint(el: HTMLElement, x: number, y: number): boolean {
    const style = window.getComputedStyle(el)
    const opacity = Number.parseFloat(style.opacity)
    if (style.display === "none" || style.visibility === "hidden") return false
    if (!Number.isNaN(opacity) && opacity <= 0.01) return false

    const r = el.getBoundingClientRect()
    if (r.width <= 0 || r.height <= 0) return false

    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
}

function hasCaseStudyNavLayerAtPoint(x: number, y: number): boolean {
    if (typeof document === "undefined" || typeof window === "undefined") return false

    if (typeof document.elementsFromPoint === "function") {
        for (const node of document.elementsFromPoint(x, y)) {
            const nav = closestCaseStudyNavLayer(node)
            if (nav && isVisibleElementAtPoint(nav, x, y)) return true
        }
    }

    return getCaseStudyNavLayerElements().some((el) => isVisibleElementAtPoint(el, x, y))
}

function isExcludedElement(el: Element, excludeSelector: string): boolean {
    if (closestCaseStudyNavLayer(el)) return true
    if (el.closest("[data-no-lightbox]")) return true
    if (!excludeSelector) return false

    try {
        return Boolean(el.closest(excludeSelector))
    } catch {
        return false
    }
}

function hasExcludedAtPoint(event: MouseEvent, excludeSelector: string): boolean {
    if (typeof document.elementsFromPoint !== "function") return false

    for (const node of document.elementsFromPoint(event.clientX, event.clientY)) {
        if (isExcludedElement(node, excludeSelector)) return true
    }

    return false
}

function shouldGuardLightboxClick(event: MouseEvent, excludeSelector: string): boolean {
    if (!isCaseStudyDetailPage()) return false
    if (hasCaseStudyNavLayerAtPoint(event.clientX, event.clientY)) return true

    const target = event.target instanceof Element ? event.target : null
    if (target && isExcludedElement(target, excludeSelector)) return true
    return hasExcludedAtPoint(event, excludeSelector)
}

function tagMobileFooterCta() {
    if (typeof document === "undefined") return

    document.querySelectorAll<HTMLAnchorElement>("a").forEach((anchor) => {
        const type = getMobileFooterCtaType(anchor)
        if (!type) return

        const section = anchor.closest<HTMLElement>(
            '[data-framer-name="Section CTA"], [name="Section CTA"]'
        )
        const container = anchor.parentElement
        const label = anchor.firstElementChild
        const meta = anchor.children.length > 1 ? anchor.children[1] : null

        if (!section || !container || !(label instanceof HTMLElement)) return

        section.setAttribute("data-case-study-mobile-cta-section", "true")
        container.setAttribute("data-case-study-mobile-cta-container", "true")
        anchor.setAttribute("data-case-study-mobile-cta-row", type)
        label.setAttribute("data-case-study-mobile-cta-label", "true")
        if (meta instanceof HTMLElement) meta.setAttribute("data-case-study-mobile-cta-meta", "true")
    })
}

function useCaseStudyMobileFooterLayout() {
    React.useEffect(() => {
        if (RenderTarget.current() === RenderTarget.canvas) return
        if (typeof document === "undefined" || typeof window === "undefined") return
        if (!isCaseStudyDetailPage()) return

        ensureMobileFooterStyles()

        let frame = 0
        const timeouts: number[] = []

        const run = () => {
            ensureMobileFooterStyles()
            window.cancelAnimationFrame(frame)
            frame = window.requestAnimationFrame(tagMobileFooterCta)
        }

        run()
        ;[75, 200, 500, 1000, 2000].forEach((delay) => {
            timeouts.push(window.setTimeout(run, delay))
        })

        const observer = new MutationObserver(run)
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["data-framer-name", "name", "style"],
            childList: true,
            subtree: true,
        })

        window.addEventListener("pageshow", run)
        window.addEventListener("resize", run)

        return () => {
            window.cancelAnimationFrame(frame)
            timeouts.forEach((timeout) => window.clearTimeout(timeout))
            observer.disconnect()
            window.removeEventListener("pageshow", run)
            window.removeEventListener("resize", run)
        }
    }, [])
}

function ensureMobileFooterStyles() {
    if (typeof document === "undefined") return

    let style = document.getElementById(MOBILE_FOOTER_STYLE_ID)
    if (!style) {
        style = document.createElement("style")
        style.id = MOBILE_FOOTER_STYLE_ID
    }

    if (style.textContent !== MOBILE_FOOTER_STYLE) {
        style.textContent = MOBILE_FOOTER_STYLE
    }

    document.head.appendChild(style)
}

function ensureMediaSkeletonStyles() {
    if (typeof document === "undefined") return

    let style = document.getElementById(MEDIA_SKELETON_STYLE_ID)
    if (!style) {
        style = document.createElement("style")
        style.id = MEDIA_SKELETON_STYLE_ID
    }

    if (style.textContent !== MEDIA_SKELETON_STYLE) {
        style.textContent = MEDIA_SKELETON_STYLE
    }

    document.head.appendChild(style)
}

function getMediaSource(media: HTMLElement): string {
    if (media instanceof HTMLImageElement) return media.currentSrc || media.src || ""
    if (media instanceof HTMLVideoElement) return media.currentSrc || media.src || media.poster || ""
    if (media instanceof HTMLIFrameElement) return media.src || ""
    return ""
}

function getMediaSignature(media: HTMLElement): string {
    const source = getMediaSource(media)
    const poster = media instanceof HTMLVideoElement ? media.poster || media.getAttribute("poster") || "" : ""
    return `${media.tagName.toLowerCase()}:${source}:${poster}`
}

function ratioFromDimensions(width: unknown, height: unknown): number {
    const safeWidth = Number(width)
    const safeHeight = Number(height)
    return Number.isFinite(safeWidth) && Number.isFinite(safeHeight) && safeWidth > 0 && safeHeight > 0
        ? safeWidth / safeHeight
        : 0
}

function getUrlRatio(src: string): number {
    if (!src) return 0

    try {
        const url = new URL(src, window.location.href)
        return ratioFromDimensions(
            url.searchParams.get("width"),
            url.searchParams.get("height")
        )
    } catch {
        const width = src.match(/[?&]width=(\d+(?:\.\d+)?)/)?.[1]
        const height = src.match(/[?&]height=(\d+(?:\.\d+)?)/)?.[1]
        return ratioFromDimensions(width, height)
    }
}

function getMediaSkeletonRatio(media: HTMLElement): number {
    if (media instanceof HTMLImageElement) {
        return (
            ratioFromDimensions(media.naturalWidth, media.naturalHeight) ||
            ratioFromDimensions(media.getAttribute("width"), media.getAttribute("height")) ||
            getUrlRatio(media.currentSrc || media.src || "")
        )
    }

    if (media instanceof HTMLVideoElement) {
        return (
            ratioFromDimensions(media.videoWidth, media.videoHeight) ||
            ratioFromDimensions(media.getAttribute("width"), media.getAttribute("height")) ||
            getUrlRatio(media.currentSrc || media.src || "")
        )
    }

    if (media instanceof HTMLIFrameElement) {
        return (
            ratioFromDimensions(media.getAttribute("width"), media.getAttribute("height")) ||
            getUrlRatio(media.src || "")
        )
    }

    return 0
}

function getMediaSkeletonFallbackRatio(media: HTMLElement): number {
    if (media instanceof HTMLVideoElement) return MEDIA_SKELETON_VIDEO_FALLBACK_RATIO
    return getMediaSkeletonRatio(media)
}

function getElementArea(element: HTMLElement): number {
    const rect = element.getBoundingClientRect()
    return Math.max(0, rect.width) * Math.max(0, rect.height)
}

function isUnsafeMediaSkeletonHost(element: HTMLElement): boolean {
    const tagName = element.tagName.toLowerCase()
    if (tagName === "html" || tagName === "body" || tagName === "nav" || tagName === "header" || tagName === "footer") {
        return true
    }

    return Boolean(element.closest("[aria-modal='true'], [role='dialog']"))
}

function hasFramePaint(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element)
    const borderWidth =
        Number.parseFloat(style.borderTopWidth) +
        Number.parseFloat(style.borderRightWidth) +
        Number.parseFloat(style.borderBottomWidth) +
        Number.parseFloat(style.borderLeftWidth)
    const hasBorder = borderWidth > 0 && style.borderTopStyle !== "none"
    const hasShadow = style.boxShadow && style.boxShadow !== "none"
    const hasClipping =
        style.overflow !== "visible" ||
        style.overflowX !== "visible" ||
        style.overflowY !== "visible" ||
        (style.clipPath && style.clipPath !== "none")
    const namedFrame = `${element.getAttribute("data-framer-name") || ""} ${element.getAttribute("name") || ""}`

    return (
        hasBorder ||
        Boolean(hasShadow) ||
        hasClipping ||
        /image|media|video|poster|wrapper|frame/i.test(namedFrame)
    )
}

function getMediaSkeletonHost(media: HTMLElement): HTMLElement | null {
    let current = media.parentElement
    if (!current) return null

    if (current.tagName.toLowerCase() === "picture") {
        current = current.parentElement || current
    }

    const mediaArea = getElementArea(media)
    let fallback: HTMLElement | null = null
    let depth = 0

    while (current && depth < 7) {
        if (isUnsafeMediaSkeletonHost(current)) break

        const area = getElementArea(current)
        if (area >= 4096) {
            const isReasonableFrame =
                mediaArea <= 0 || area <= Math.max(mediaArea * 3.5, mediaArea + 4096)
            if (!isReasonableFrame) break
            if (!fallback) fallback = current

            if (hasFramePaint(current)) return current
        }

        current = current.parentElement
        depth += 1
    }

    return fallback
}

function shouldSkipMediaSkeleton(media: HTMLElement, host: HTMLElement | null): boolean {
    if (!host || !getMediaSource(media)) return true
    if (media.closest(CASE_STUDY_NAV_SELECTORS)) return true
    if (media.closest("nav, header, footer, [aria-modal='true'], [role='dialog']")) return true
    if (media.closest("[data-no-media-skeleton], [data-no-lightbox]")) return true

    if (getElementArea(host) < 4096) return true

    return false
}

function prepareMediaSkeletonHost(host: HTMLElement) {
    host.setAttribute("data-case-study-media-skeleton", "true")
    host.style.setProperty("--case-study-media-skeleton-color", MEDIA_SKELETON_COLOR)

    if (window.getComputedStyle(host).position === "static") {
        host.style.position = "relative"
        host.setAttribute("data-case-study-media-positioned", "true")
    }
}

function setMediaSkeletonHostRatio(host: HTMLElement, mediaItems: HTMLElement[]) {
    const ratios = mediaItems
        .map((media) => getMediaSkeletonRatio(media) || getMediaSkeletonFallbackRatio(media))
        .filter((ratio) => Number.isFinite(ratio) && ratio > 0)

    if (!ratios.length) {
        host.removeAttribute("data-case-study-media-skeleton-ratio")
        host.style.removeProperty("--case-study-media-skeleton-aspect-ratio")
        return
    }

    const ratio = ratios.reduce((sum, value) => sum + value, 0) / ratios.length
    host.setAttribute("data-case-study-media-skeleton-ratio", "true")
    host.style.setProperty("--case-study-media-skeleton-aspect-ratio", `${ratio}`)
}

function getManagedHostMedia(host: HTMLElement): HTMLElement[] {
    return Array.from(host.querySelectorAll<HTMLElement>(MEDIA_SKELETON_SELECTOR)).filter(
        (media) => getMediaSkeletonHost(media) === host && !shouldSkipMediaSkeleton(media, host)
    )
}

function updateHostMediaSkeletonState(host: HTMLElement) {
    const mediaItems = getManagedHostMedia(host)
    if (!mediaItems.length) return

    const states = mediaItems.map((media) => media.getAttribute(MEDIA_SKELETON_STATE_ATTR) || "")
    if (states.includes("ready")) {
        host.setAttribute("data-case-study-media-ready", "true")
        host.removeAttribute("data-case-study-media-failed")
        host.removeAttribute("data-case-study-media-skeleton-ratio")
        host.style.removeProperty("--case-study-media-skeleton-aspect-ratio")
        return
    }

    setMediaSkeletonHostRatio(host, mediaItems)

    if (states.every((state) => state === "failed")) {
        host.removeAttribute("data-case-study-media-ready")
        host.setAttribute("data-case-study-media-failed", "true")
        return
    }

    host.removeAttribute("data-case-study-media-ready")
    host.removeAttribute("data-case-study-media-failed")
}

function markMediaSkeletonState(media: HTMLElement, state: "ready" | "failed") {
    const host = getMediaSkeletonHost(media)
    if (!host) return
    if (shouldSkipMediaSkeleton(media, host)) return

    const signature = getMediaSignature(media)
    if (!signature) return

    media.dataset.caseStudyMediaSkeletonSignature = signature
    prepareMediaSkeletonHost(host)
    media.setAttribute(MEDIA_SKELETON_STATE_ATTR, state)

    if (state === "ready") media.removeAttribute("data-case-study-media-skeleton-media")
    else media.setAttribute("data-case-study-media-skeleton-media", "true")

    updateHostMediaSkeletonState(host)
}

function preloadVideoPoster(video: HTMLVideoElement) {
    const poster = video.poster || video.getAttribute("poster") || ""
    if (!poster || typeof window === "undefined") return false
    if (video.dataset.caseStudyMediaSkeletonPoster === poster) {
        if (video.dataset.caseStudyMediaSkeletonPosterReady === poster) {
            markMediaSkeletonState(video, "ready")
        }
        return true
    }

    video.dataset.caseStudyMediaSkeletonPoster = poster
    delete video.dataset.caseStudyMediaSkeletonPosterReady
    const posterImage = new window.Image()
    posterImage.onload = () => {
        if (video.dataset.caseStudyMediaSkeletonPoster !== poster) return
        if ((video.poster || video.getAttribute("poster") || "") !== poster) return
        video.dataset.caseStudyMediaSkeletonPosterReady = poster
        markMediaSkeletonState(video, "ready")
    }
    posterImage.onerror = () => {
        if (video.dataset.caseStudyMediaSkeletonPoster !== poster) return
        if ((video.poster || video.getAttribute("poster") || "") !== poster) return
        markMediaSkeletonState(video, "failed")
    }
    posterImage.src = poster

    return true
}

function getLoadedIframeSignature(iframe: HTMLIFrameElement): string {
    const signature = getMediaSignature(iframe)

    try {
        if (iframe.contentDocument?.readyState === "complete") return signature
        void iframe.contentWindow?.location.href
    } catch {
        return signature
    }

    return ""
}

function syncMediaSkeleton(media: HTMLElement) {
    const host = getMediaSkeletonHost(media)
    if (!host) return
    if (shouldSkipMediaSkeleton(media, host)) return

    const signature = getMediaSignature(media)
    if (!signature) return

    prepareMediaSkeletonHost(host)

    if (media.dataset.caseStudyMediaSkeletonSignature !== signature) {
        media.dataset.caseStudyMediaSkeletonSignature = signature
        media.setAttribute("data-case-study-media-skeleton-media", "true")
        media.removeAttribute(MEDIA_SKELETON_STATE_ATTR)

        if (media instanceof HTMLIFrameElement) {
            delete media.dataset.caseStudyMediaSkeletonLoaded
        }

        updateHostMediaSkeletonState(host)
    } else if (media.getAttribute(MEDIA_SKELETON_STATE_ATTR) !== "ready") {
        media.setAttribute("data-case-study-media-skeleton-media", "true")
    }

    if (media instanceof HTMLImageElement) {
        if (!media.complete) return
        markMediaSkeletonState(media, media.naturalWidth > 0 ? "ready" : "failed")
        return
    }

    if (media instanceof HTMLVideoElement) {
        if (media.readyState >= 2) {
            markMediaSkeletonState(media, "ready")
            return
        }

        preloadVideoPoster(media)
        return
    }

    if (media instanceof HTMLIFrameElement) {
        if (media.dataset.caseStudyMediaSkeletonLoaded === signature) {
            markMediaSkeletonState(media, "ready")
        }
    }
}

function attachMediaSkeletonListeners(
    media: HTMLElement,
    cleanups: Map<HTMLElement, () => void>
) {
    if (cleanups.has(media)) return

    const ready = () => markMediaSkeletonState(media, "ready")
    const failed = () => {
        if (media instanceof HTMLVideoElement && preloadVideoPoster(media)) return
        markMediaSkeletonState(media, "failed")
    }
    const iframeReady = () => {
        media.dataset.caseStudyMediaSkeletonLoaded = getMediaSignature(media)
        ready()
    }

    if (media instanceof HTMLImageElement) {
        media.addEventListener("load", ready)
        media.addEventListener("error", failed)
        cleanups.set(media, () => {
            media.removeEventListener("load", ready)
            media.removeEventListener("error", failed)
        })
        return
    }

    if (media instanceof HTMLVideoElement) {
        media.addEventListener("loadeddata", ready)
        media.addEventListener("canplay", ready)
        media.addEventListener("error", failed)
        cleanups.set(media, () => {
            media.removeEventListener("loadeddata", ready)
            media.removeEventListener("canplay", ready)
            media.removeEventListener("error", failed)
        })
        return
    }

    if (media instanceof HTMLIFrameElement) {
        media.addEventListener("load", iframeReady)
        const loadedSignature = getLoadedIframeSignature(media)
        if (loadedSignature) {
            media.dataset.caseStudyMediaSkeletonLoaded = loadedSignature
        }
        cleanups.set(media, () => {
            media.removeEventListener("load", iframeReady)
        })
    }
}

function useCaseStudyMediaSkeletons() {
    React.useEffect(() => {
        if (RenderTarget.current() === RenderTarget.canvas) return
        if (typeof document === "undefined" || typeof window === "undefined") return
        if (!isCaseStudyDetailPage()) return

        ensureMediaSkeletonStyles()

        let frame = 0
        const timeouts: number[] = []
        const cleanups = new Map<HTMLElement, () => void>()

        const pruneCleanups = () => {
            cleanups.forEach((cleanup, media) => {
                if (document.contains(media)) return
                cleanup()
                cleanups.delete(media)
            })
        }

        const scan = () => {
            ensureMediaSkeletonStyles()
            pruneCleanups()

            document.querySelectorAll<HTMLElement>(MEDIA_SKELETON_SELECTOR).forEach((media) => {
                const host = getMediaSkeletonHost(media)
                if (shouldSkipMediaSkeleton(media, host)) return
                attachMediaSkeletonListeners(media, cleanups)
                syncMediaSkeleton(media)
            })
        }

        const scheduleScan = () => {
            window.cancelAnimationFrame(frame)
            frame = window.requestAnimationFrame(scan)
        }

        scheduleScan()
        ;[75, 200, 500, 1000, 2000, 3500].forEach((delay) => {
            timeouts.push(window.setTimeout(scheduleScan, delay))
        })

        const observer = new MutationObserver(scheduleScan)
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["src", "srcset", "poster"],
            childList: true,
            subtree: true,
        })

        window.addEventListener("pageshow", scheduleScan)
        window.addEventListener("resize", scheduleScan)

        return () => {
            window.cancelAnimationFrame(frame)
            timeouts.forEach((timeout) => window.clearTimeout(timeout))
            observer.disconnect()
            window.removeEventListener("pageshow", scheduleScan)
            window.removeEventListener("resize", scheduleScan)
            cleanups.forEach((cleanup) => cleanup())
            cleanups.clear()
        }
    }, [])
}

/**
 * Case-study nav click guard (no CSS).
 *
 * The nav physically overlays media at the top of case-study pages. The base
 * lightbox opens on click by finding the topmost <img>/<video> at the pointer
 * via elementsFromPoint — so clicking a nav item that sits over media used to
 * open the lightbox instead of navigating. We do NOT raise/isolate the nav in
 * CSS (that broke the nav hover/flip-text reset and never fixed the click,
 * since elementsFromPoint reaches under the nav regardless).
 *
 * Instead, a single WINDOW-capture click listener — which fires before the base
 * lightbox's own document-capture listener — suppresses the lightbox whenever
 * the click lands on/over the nav (or any excluded region):
 *   • Internal links -> preventDefault only, so the base lightbox sees a
 *     handled event and bails, while Framer/custom React link handlers still
 *     receive the click. A short router fallback catches plain anchors.
 *   • Other native links -> stopImmediatePropagation only (lightbox never sees
 *     the click; the browser still performs the default navigation).
 *   • Other controls (buttons, scroll-to-top, etc.) -> preventDefault only, so
 *     the control's own React handler still runs while the base lightbox bails
 *     on the default-prevented click.
 *   • Anything else excluded -> stopImmediatePropagation.
 */
function useCaseStudyNavClickGuard(excludeSelector: string, router: FramerRouter | undefined) {
    React.useEffect(() => {
        if (RenderTarget.current() === RenderTarget.canvas) return
        if (typeof document === "undefined" || typeof window === "undefined") return
        if (!isCaseStudyDetailPage()) return

        const onClick = (event: MouseEvent) => {
            if (!shouldGuardLightboxClick(event, excludeSelector)) return

            const target = event.target instanceof Element ? event.target : null
            const anchor = target?.closest("a[href]") as HTMLAnchorElement | null
            if (anchor) {
                const href = anchor.getAttribute("href") || ""
                const match = shouldHandleAnchorRoute(event, anchor)
                    ? getFramerRouteMatch(router, href)
                    : null
                if (match) {
                    const fromHref = window.location.href
                    event.preventDefault()
                    stabilizeTopScrollAfterRoute(href)
                    scheduleFramerRouteFallback(router, match, href, fromHref)
                    return
                }

                event.stopImmediatePropagation()
                return
            }

            const interactive = target?.closest(INTERACTIVE_SELECTOR) ?? null
            if (interactive) {
                if (!interactive.matches('[role="link"]')) {
                    event.preventDefault()
                }
                return
            }

            event.stopImmediatePropagation()
        }

        window.addEventListener("click", onClick, true)

        return () => {
            window.removeEventListener("click", onClick, true)
        }
    }, [excludeSelector, router])
}

/**
 * Case Study Lightbox wrapper.
 * Preserves the existing versioned lightbox implementation and adds tiny
 * case-study normalizers: the mobile footer layout and a nav click guard.
 *
 * The Exclude selector passed to the base engine is always merged with the
 * "always-on" rules (see ALWAYS_EXCLUDE_RULES) so that naming a frame
 * "No Lightbox" / "NoLightbox" - or tagging it [data-no-lightbox] - opts its
 * media out of the lightbox everywhere, with no per-instance configuration.
 * Tip: name the frame that WRAPS the whole media (esp. video posters, which
 * contain both an <img> and a <video>), not just the leaf image.
 *
 * The click guard (useCaseStudyNavClickGuard) keeps nav links, buttons, the
 * scroll-to-top button, and the gallery working while suppressing the lightbox
 * on the nav and other excluded regions — with NO nav CSS mutation.
 *
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function CaseStudyLightbox(props: Config) {
    useCaseStudyMobileFooterLayout()
    useCaseStudyMediaSkeletons()
    const router = useRouter() as FramerRouter
    const mergedExcludeSelector = getLightboxExcludeSelector(props.excludeSelector)
    useCaseStudyNavClickGuard(mergedExcludeSelector, router)

    const Base = BaseCaseStudyLightbox as unknown as React.ComponentType<Config>
    return <Base {...props} excludeSelector={mergedExcludeSelector} />
}

CaseStudyLightbox.defaultProps = {
    enabled: true,
    lightboxVideos: true,
    videoControls: false,
    backgroundColor: "rgb(255, 255, 255)",
    chromeColor: "rgb(20, 20, 20)",
    iconWeight: 300,
    iconSize: 24,
    showArrows: true,
    showClose: true,
    showCounter: false,
    clickImageAdvances: true,
    loopNavigation: true,
    duration: 360,
    viewportPadding: 72,
    minSize: 100,
    excludeSelector:
        'nav, header, footer, a, button, video[controls], [data-no-lightbox], [data-framer-name*="No Lightbox" i], [data-framer-name*="NoLightbox" i]',
}

addPropertyControls(CaseStudyLightbox, {
    enabled: { type: ControlType.Boolean, title: "Lightbox", defaultValue: true, enabledTitle: "On", disabledTitle: "Off" },
    lightboxVideos: { type: ControlType.Boolean, title: "Videos", defaultValue: true, enabledTitle: "On", disabledTitle: "Off" },
    videoControls: { type: ControlType.Boolean, title: "Video Controls", defaultValue: false, enabledTitle: "Show", disabledTitle: "Hide" },
    backgroundColor: { type: ControlType.Color, title: "Background", defaultValue: "rgb(255, 255, 255)" },
    chromeColor: { type: ControlType.Color, title: "Arrows / X", defaultValue: "rgb(20, 20, 20)" },
    iconWeight: { type: ControlType.Number, title: "Icon Weight", defaultValue: 300, min: 100, max: 700, step: 50 },
    iconSize: { type: ControlType.Number, title: "Icon Size", defaultValue: 24, min: 12, max: 48, step: 1, unit: "px" },
    showArrows: { type: ControlType.Boolean, title: "Arrows", defaultValue: true, enabledTitle: "Show", disabledTitle: "Hide" },
    showClose: { type: ControlType.Boolean, title: "Close X", defaultValue: true, enabledTitle: "Show", disabledTitle: "Hide" },
    showCounter: { type: ControlType.Boolean, title: "Counter", defaultValue: false, enabledTitle: "Show", disabledTitle: "Hide" },
    clickImageAdvances: { type: ControlType.Boolean, title: "Tap = Next", defaultValue: true, enabledTitle: "On", disabledTitle: "Off" },
    loopNavigation: { type: ControlType.Boolean, title: "Loop", defaultValue: true, enabledTitle: "On", disabledTitle: "Off" },
    duration: { type: ControlType.Number, title: "Zoom ms", defaultValue: 360, min: 120, max: 800, step: 10, unit: "ms" },
    viewportPadding: { type: ControlType.Number, title: "Padding", defaultValue: 72, min: 0, max: 160, step: 2, unit: "px" },
    minSize: { type: ControlType.Number, title: "Min Size", defaultValue: 100, min: 0, max: 400, step: 10, unit: "px" },
    excludeSelector: {
        type: ControlType.String,
        title: "Exclude",
        defaultValue:
            'nav, header, footer, a, button, video[controls], [data-no-lightbox], [data-framer-name*="No Lightbox" i], [data-framer-name*="NoLightbox" i]',
        displayTextArea: true,
    },
})
