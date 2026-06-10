import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
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

type StyleSnapshot = {
    value: string
    priority: string
}

type ElementSnapshot = Map<string, StyleSnapshot>

const CASE_STUDY_NAV_LAYER_ROOT_ATTR = "data-case-study-nav-layer"
const CASE_STUDY_NAV_LAYER_STYLE_ID = "case-study-nav-layer"
const CASE_STUDY_NAV_Z = 2147482990
const CASE_STUDY_NAV_SELECTORS = [
    "nav",
    "header",
    '[data-framer-name="Navigation"]',
    '[name="Navigation"]',
    '[data-framer-name="Nav"]',
    '[name="Nav"]',
    '[data-framer-name="Navbar"]',
    '[name="Navbar"]',
    '[data-framer-name="Header"]',
    '[name="Header"]',
].join(",")
// Rules that must ALWAYS exclude an element from the lightbox, regardless of
// what an individual instance typed into its Exclude control. The name-based
// rules let you opt media out with zero code: name any frame "No Lightbox"
// (or "NoLightbox" — both spellings, case-insensitive substring) and wrap the
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
// scroll-to-top button and the gallery) — we only suppress the lightbox.
const INTERACTIVE_SELECTOR =
    'button, [role="button"], [role="link"], input, select, textarea, label, summary, a[href]'
const MOBILE_FOOTER_STYLE_ID = "case-study-mobile-footer-layout-v2"
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

function isCaseStudyDetailPage(): boolean {
    if (typeof window === "undefined") return false
    const path = window.location.pathname.replace(/\/+$/, "")
    return path.startsWith("/case-studies/") && path.length > "/case-studies/".length
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

function getScopedCaseStudyNavSelectors(): string {
    return CASE_STUDY_NAV_SELECTORS.split(",")
        .map((selector) => `html[${CASE_STUDY_NAV_LAYER_ROOT_ATTR}="true"] ${selector}`)
        .join(",\n")
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

function ensureCaseStudyNavLayerStyles() {
    if (typeof document === "undefined") return

    let style = document.getElementById(CASE_STUDY_NAV_LAYER_STYLE_ID)
    if (!style) {
        style = document.createElement("style")
        style.id = CASE_STUDY_NAV_LAYER_STYLE_ID
    }

    const css = `
${getScopedCaseStudyNavSelectors()} {
    z-index: ${CASE_STUDY_NAV_Z} !important;
    pointer-events: auto !important;
    isolation: isolate !important;
}
`

    if (style.textContent !== css) style.textContent = css
    document.head.appendChild(style)
}

function rememberStyle(
    snapshots: Map<HTMLElement, ElementSnapshot>,
    el: HTMLElement,
    property: string
) {
    let snapshot = snapshots.get(el)
    if (!snapshot) {
        snapshot = new Map<string, StyleSnapshot>()
        snapshots.set(el, snapshot)
    }

    if (snapshot.has(property)) return
    snapshot.set(property, {
        value: el.style.getPropertyValue(property),
        priority: el.style.getPropertyPriority(property),
    })
}

function setImportantStyle(
    snapshots: Map<HTMLElement, ElementSnapshot>,
    el: HTMLElement,
    property: string,
    value: string
) {
    rememberStyle(snapshots, el, property)
    el.style.setProperty(property, value, "important")
}

function restoreNavLayerStyles(snapshots: Map<HTMLElement, ElementSnapshot>) {
    snapshots.forEach((snapshot, el) => {
        snapshot.forEach(({ value, priority }, property) => {
            if (value) el.style.setProperty(property, value, priority)
            else el.style.removeProperty(property)
        })
    })
    snapshots.clear()
}

function elevateCaseStudyNavLayer(snapshots: Map<HTMLElement, ElementSnapshot>) {
    if (typeof document === "undefined" || typeof window === "undefined") return
    if (!isCaseStudyDetailPage()) return

    ensureCaseStudyNavLayerStyles()
    document.documentElement.setAttribute(CASE_STUDY_NAV_LAYER_ROOT_ATTR, "true")

    document.querySelectorAll<HTMLElement>(CASE_STUDY_NAV_SELECTORS).forEach((el) => {
        setImportantStyle(snapshots, el, "z-index", String(CASE_STUDY_NAV_Z))
        setImportantStyle(snapshots, el, "pointer-events", "auto")
        setImportantStyle(snapshots, el, "isolation", "isolate")

        if (window.getComputedStyle(el).position === "static") {
            setImportantStyle(snapshots, el, "position", "relative")
        }
    })
}

function isExcludedElement(el: Element, excludeSelector: string): boolean {
    if (el.closest(CASE_STUDY_NAV_SELECTORS)) return true
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

function useCaseStudyNavLayering(excludeSelector: string): boolean {
    const [ready, setReady] = React.useState(() => {
        if (typeof document === "undefined" || typeof window === "undefined") return true
        if (RenderTarget.current() === RenderTarget.canvas) return true
        return !isCaseStudyDetailPage()
    })

    React.useEffect(() => {
        if (RenderTarget.current() === RenderTarget.canvas) {
            setReady(true)
            return
        }
        if (typeof document === "undefined" || typeof window === "undefined") {
            setReady(true)
            return
        }
        if (!isCaseStudyDetailPage()) {
            setReady(true)
            return
        }

        const snapshots = new Map<HTMLElement, ElementSnapshot>()
        let frame = 0
        const timeouts: number[] = []

        const run = () => {
            window.cancelAnimationFrame(frame)
            frame = window.requestAnimationFrame(() => elevateCaseStudyNavLayer(snapshots))
        }

        // Guard against the lightbox opening on excluded regions. Registered on
        // WINDOW capture so it runs BEFORE the base lightbox's own document-capture
        // listener (window precedes document in the capture phase).
        //
        // For interactive controls (buttons, inputs, the scroll-to-top button, the
        // gallery, etc.) we must preserve the control's own click — so we only
        // mark the event default-prevented, which the base lightbox honors and
        // bails on, WITHOUT calling stopImmediatePropagation (which would also kill
        // the control's React handler). Links/role=link are left untouched so their
        // navigation still fires. Genuinely non-interactive excluded regions keep
        // full suppression.
        const onClick = (event: MouseEvent) => {
            if (!shouldGuardLightboxClick(event, excludeSelector)) return

            const target = event.target instanceof Element ? event.target : null
            const interactive = target?.closest(INTERACTIVE_SELECTOR) ?? null

            if (interactive) {
                if (!interactive.matches('a[href], [role="link"]')) {
                    event.preventDefault()
                }
                return
            }

            event.stopImmediatePropagation()
        }

        window.addEventListener("click", onClick, true)
        run()
        ;[75, 200, 500, 1000, 2000].forEach((delay) => {
            timeouts.push(window.setTimeout(run, delay))
        })

        const observer = new MutationObserver(run)
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["data-framer-name", "name", "style", "class"],
            childList: true,
            subtree: true,
        })

        window.addEventListener("pageshow", run)
        window.addEventListener("resize", run)
        setReady(true)

        return () => {
            window.cancelAnimationFrame(frame)
            timeouts.forEach((timeout) => window.clearTimeout(timeout))
            observer.disconnect()
            window.removeEventListener("pageshow", run)
            window.removeEventListener("resize", run)
            window.removeEventListener("click", onClick, true)
            document.documentElement.removeAttribute(CASE_STUDY_NAV_LAYER_ROOT_ATTR)
            restoreNavLayerStyles(snapshots)
        }
    }, [excludeSelector])

    return ready
}

/**
 * Case Study Lightbox wrapper.
 * Preserves the existing versioned lightbox implementation and adds tiny
 * case-study normalizers for the mobile footer and header click layer.
 *
 * The Exclude selector passed to the base engine is always merged with the
 * "always-on" rules (see ALWAYS_EXCLUDE_RULES) so that naming a frame
 * "No Lightbox" / "NoLightbox" — or tagging it [data-no-lightbox] — opts its
 * media out of the lightbox everywhere, with no per-instance configuration.
 * Tip: name the frame that WRAPS the whole media (esp. video posters, which
 * contain both an <img> and a <video>), not just the leaf image.
 *
 * The click guard preserves interactive controls (buttons, the scroll-to-top
 * button, links, the gallery) while still suppressing the lightbox on excluded
 * regions — see useCaseStudyNavLayering.
 *
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function CaseStudyLightbox(props: Config) {
    useCaseStudyMobileFooterLayout()
    const mergedExcludeSelector = getLightboxExcludeSelector(props.excludeSelector)
    const navLayerReady = useCaseStudyNavLayering(mergedExcludeSelector)

    const Base = BaseCaseStudyLightbox as unknown as React.ComponentType<Config>
    return navLayerReady ? <Base {...props} excludeSelector={mergedExcludeSelector} /> : null
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
