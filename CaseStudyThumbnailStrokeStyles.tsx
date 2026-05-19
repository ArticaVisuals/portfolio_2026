import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Props = {
    strokeColor: string
    strokeWidth: number
    collectionId: string
    collectionModuleUrl: string
    strokeFieldId: string
    slugFieldId: string
    titleFieldId: string
    imageWrapperNames: string
}

type CMSValue = { value?: unknown }
type CMSItem = { data?: Record<string, CMSValue> }
type CMSModule = {
    a?: { collectionByLocaleId?: { default?: { scanItems?: () => Promise<CMSItem[]> } } }
    r?: () => unknown
    [key: string]: unknown
}
type StrokeRecord = { slug: string; title: string; stroke: boolean }

const STROKE_CLASS = "framer-cms-thumbnail-stroke"
const OVERLAY_ATTR = "data-framer-cms-thumbnail-stroke-overlay"
const GENERATED_ATTR = "data-framer-cms-thumbnail-stroke-generated"
const DEFAULT_STROKE_COLOR = "#979797"
const CANVAS_OVERLAY_NAMES = [
    "ThumbnailStrokeOverlay",
    "Thumbnail Stroke Overlay",
    "CMSStrokeOverlay",
    "CMS Stroke Overlay",
]
const LIVE_SCAN_PATHS = [
    "/",
    "/case-studies",
    "https://khaki-ship-257706.framer.app/",
    "https://khaki-ship-257706.framer.app/case-studies",
]

function splitNames(value: string): string[] {
    return String(value || "")
        .split(/[\n,]/)
        .map((name) => name.trim())
        .filter(Boolean)
}

function escapeAttr(value: string): string {
    return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function unique(values: Array<string | undefined | null>): string[] {
    return Array.from(new Set(values.filter((value): value is string => !!value)))
}

function nameSelector(name: string) {
    const value = escapeAttr(name)
    return `:is([data-framer-name="${value}"], [name="${value}"])`
}

function getMediaSelectors(imageWrapperNames: string): string[] {
    return [...splitNames(imageWrapperNames).map(nameSelector), ".idx-grid-card-media"]
}

function getCanvasOverlaySelector(): string {
    return CANVAS_OVERLAY_NAMES.map(nameSelector).join(",")
}

function readField(data: Record<string, CMSValue> | undefined, fieldId: string) {
    return data?.[fieldId]?.value
}

function normalizeText(value: unknown): string {
    return String(value ?? "").trim()
}

function normalizeTitle(value: string): string {
    return value.toLowerCase().replace(/\s+/g, " ").trim()
}

function getSlugFromHref(href: string | null): string {
    if (!href) return ""
    try {
        const url = new URL(href, window.location.href)
        const parts = url.pathname.split("/").filter(Boolean)
        const caseStudiesIndex = parts.lastIndexOf("case-studies")
        if (caseStudiesIndex >= 0 && parts[caseStudiesIndex + 1]) {
            return decodeURIComponent(parts[caseStudiesIndex + 1])
        }
        return decodeURIComponent(parts[parts.length - 1] || "")
    } catch {
        const parts = href.split("?")[0].split("#")[0].split("/").filter(Boolean)
        return decodeURIComponent(parts[parts.length - 1] || "")
    }
}

function getCardHref(card: HTMLElement): string | null {
    return (
        card.getAttribute("href") ||
        card.querySelector<HTMLAnchorElement>('a[href*="/case-studies/"]')?.getAttribute("href") ||
        card.closest<HTMLAnchorElement>('a[href*="/case-studies/"]')?.getAttribute("href") ||
        null
    )
}

function isCMSModuleUrl(url: string, collectionId: string): boolean {
    const collectionPattern = escapeRegExp(collectionId)
    return new RegExp(`/${collectionPattern}\\.[^/]+\\.mjs(?:[?#].*)?$`).test(url)
}

function findCMSModuleUrlInMarkup(markup: string, collectionId: string): string | undefined {
    const collectionPattern = escapeRegExp(collectionId)
    const match = markup.match(
        new RegExp(
            `https://framerusercontent\\.com/sites/[^"']+/${collectionPattern}\\.[^"']+\\.mjs`,
            "i"
        )
    )
    return match?.[0]
}

function findCMSModuleUrlInCandidates(candidates: string[], collectionId: string): string | undefined {
    return candidates.find((url) => isCMSModuleUrl(url, collectionId))
}

function getDocumentResourceUrls(): string[] {
    if (typeof document === "undefined") return []

    const elementUrls = Array.from(
        document.querySelectorAll<HTMLLinkElement | HTMLScriptElement | HTMLImageElement | HTMLSourceElement>(
            "link[href], script[src], img[src], source[src]"
        )
    ).map((element) => {
        if ("href" in element && element.href) return element.href
        if ("src" in element && element.src) return element.src
        return ""
    })

    const performanceUrls =
        typeof performance !== "undefined" && typeof performance.getEntriesByType === "function"
            ? performance.getEntriesByType("resource").map((entry) => entry.name)
            : []

    return unique([...elementUrls, ...performanceUrls])
}

function findCMSModuleUrlInDocument(collectionId: string): string | undefined {
    const fromResources = findCMSModuleUrlInCandidates(getDocumentResourceUrls(), collectionId)
    if (fromResources) return fromResources

    if (typeof document !== "undefined" && document.documentElement) {
        return findCMSModuleUrlInMarkup(document.documentElement.outerHTML, collectionId)
    }

    return undefined
}

async function resolveCMSModuleUrl(collectionId: string, explicitUrl: string) {
    const configured = explicitUrl.trim()
    if (configured) return configured

    const inDocument = findCMSModuleUrlInDocument(collectionId)
    if (inDocument) return inDocument

    for (const path of LIVE_SCAN_PATHS) {
        try {
            const response = await fetch(path, { credentials: "same-origin" })
            if (!response.ok) continue
            const html = await response.text()
            const found = findCMSModuleUrlInMarkup(html, collectionId)
            if (found) return found
        } catch {
            // Framer canvas, preview, and published URLs can live on different origins.
        }
    }

    return undefined
}

function initializeCMSModule(module: CMSModule) {
    try {
        if (typeof module.r === "function") module.r()
    } catch {
        // Some Framer module initializers are already settled; ignore safely.
    }

    try {
        Object.keys(module).forEach((key) => {
            void module[key]
        })
    } catch {
        // Live bindings may be read-only in some preview builds.
    }
}

async function loadStrokeRecords({
    collectionId,
    collectionModuleUrl,
    strokeFieldId,
    slugFieldId,
    titleFieldId,
}: Pick<
    Props,
    "collectionId" | "collectionModuleUrl" | "strokeFieldId" | "slugFieldId" | "titleFieldId"
>): Promise<StrokeRecord[]> {
    const moduleUrl = await resolveCMSModuleUrl(collectionId, collectionModuleUrl)
    if (!moduleUrl) return []

    const module = (await import(/* @vite-ignore */ moduleUrl)) as CMSModule
    initializeCMSModule(module)

    const collection = module.a?.collectionByLocaleId?.default
    if (!collection || typeof collection.scanItems !== "function") return []

    const items = (await collection.scanItems()) as CMSItem[]
    return items.map((item) => {
        const data = item.data
        return {
            slug: normalizeText(readField(data, slugFieldId)),
            title: normalizeText(readField(data, titleFieldId)),
            stroke: Boolean(readField(data, strokeFieldId)),
        }
    })
}

function matchesAnySelector(element: HTMLElement, selectors: string[]) {
    return selectors.some((selector) => {
        try {
            return element.matches(selector)
        } catch {
            return false
        }
    })
}

function findMediaElement(card: HTMLElement, imageWrapperNames: string): HTMLElement | null {
    const selectors = getMediaSelectors(imageWrapperNames)
    if (matchesAnySelector(card, selectors)) return card

    for (const selector of selectors) {
        const match = card.querySelector<HTMLElement>(selector)
        if (match) return match
    }

    return null
}

function getCardTitle(card: HTMLElement): string {
    const title = card.querySelector<HTMLElement>(
        [
            nameSelector("ProjectTitle"),
            nameSelector("Project Title"),
            nameSelector("TitleWrapper"),
            nameSelector("Title Wrapper"),
            nameSelector("ViewProject"),
            nameSelector("View project"),
            nameSelector("View project "),
        ].join(",")
    )
    return normalizeTitle(title?.textContent || card.textContent || "")
}

function titleMatches(cardTitle: string, activeTitles: string[]) {
    if (!cardTitle) return false
    return activeTitles.some((title) => title && (cardTitle === title || cardTitle.includes(title)))
}

function getCanvasOverlayByStyle(media: HTMLElement): HTMLElement | null {
    if (typeof window === "undefined" || typeof window.getComputedStyle !== "function") return null

    const children = Array.from(media.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement
    )
    return (
        children.find((child) => {
            if (child.getAttribute(GENERATED_ATTR) === "true") return false
            if (matchesAnySelector(child, CANVAS_OVERLAY_NAMES.map(nameSelector))) return true

            const style = window.getComputedStyle(child)
            const borderWidth = Number.parseFloat(style.borderTopWidth || "0")
            const hasStrokeBorder = borderWidth > 0 && style.borderTopStyle !== "none"
            const isTopOverlay = style.position === "absolute" && style.zIndex === "2147483647"
            return hasStrokeBorder && isTopOverlay
        }) || null
    )
}

function getStrokeOverlay(media: HTMLElement): HTMLElement | null {
    return (
        media.querySelector<HTMLElement>(`:scope > [${OVERLAY_ATTR}="true"]`) ||
        media.querySelector<HTMLElement>(`:scope > ${getCanvasOverlaySelector()}`) ||
        getCanvasOverlayByStyle(media)
    )
}

function styleOverlay(overlay: HTMLElement, strokeColor: string, width: number, visible: boolean) {
    Object.assign(overlay.style, {
        position: "absolute",
        inset: "0px",
        display: "block",
        boxSizing: "border-box",
        border: `${width}px solid ${strokeColor}`,
        borderRadius: "inherit",
        pointerEvents: "none",
        zIndex: "2147483647",
        opacity: visible ? "1" : "0",
        visibility: visible ? "visible" : "hidden",
        background: "transparent",
        transform: "translateZ(0)",
    })
}

function syncStrokeOverlay(media: HTMLElement, shouldStroke: boolean, strokeColor: string, width: number) {
    let overlay = getStrokeOverlay(media)

    if (!shouldStroke) {
        if (overlay?.getAttribute(GENERATED_ATTR) === "true") {
            overlay.remove()
        } else if (overlay) {
            overlay.removeAttribute(OVERLAY_ATTR)
            styleOverlay(overlay, strokeColor, width, false)
        }
        media.classList.remove(STROKE_CLASS)
        media.removeAttribute("data-thumbnail-stroke")
        if (media.classList.contains("idx-grid-card-media")) media.classList.remove("with-stroke")
        return
    }

    media.classList.add(STROKE_CLASS)
    media.setAttribute("data-thumbnail-stroke", "true")
    if (media.classList.contains("idx-grid-card-media")) media.classList.add("with-stroke")

    if (!overlay) {
        overlay = document.createElement("div")
        overlay.setAttribute(GENERATED_ATTR, "true")
        overlay.setAttribute("aria-hidden", "true")
        media.appendChild(overlay)
    }

    overlay.setAttribute(OVERLAY_ATTR, "true")
    styleOverlay(overlay, strokeColor, width, true)
}

function closestCardFromMedia(media: HTMLElement): HTMLElement {
    return (
        media.closest<HTMLElement>(
            'a[href*="/case-studies/"], a[href^="./case-studies/"], a[href^="../case-studies/"], .idx-grid-card, [data-framer-name="Card"], [name="Card"]'
        ) || media.parentElement || media
    )
}

function getCards(imageWrapperNames: string): HTMLElement[] {
    const cards = new Set<HTMLElement>()

    document
        .querySelectorAll<HTMLElement>(
            'a[href*="/case-studies/"], a[href^="./case-studies/"], a[href^="../case-studies/"], .idx-grid-card, [data-framer-name="Card"], [name="Card"]'
        )
        .forEach((card) => cards.add(card))

    getMediaSelectors(imageWrapperNames).forEach((selector) => {
        document.querySelectorAll<HTMLElement>(selector).forEach((media) => {
            cards.add(closestCardFromMedia(media))
        })
    })

    return Array.from(cards)
}

function applyCMSStrokes(records: StrokeRecord[], imageWrapperNames: string, strokeColor: string, width: number) {
    if (records.length === 0) return

    const activeRecords = records.filter((record) => record.stroke)
    const strokedSlugs = new Set(activeRecords.map((record) => record.slug).filter(Boolean))
    const activeTitles = activeRecords.map((record) => normalizeTitle(record.title)).filter(Boolean)

    getCards(imageWrapperNames).forEach((card) => {
        const media = findMediaElement(card, imageWrapperNames)
        if (!media) return

        const href = getCardHref(card)
        const slug = getSlugFromHref(href)
        const shouldStroke = strokedSlugs.has(slug) || titleMatches(getCardTitle(card), activeTitles)

        syncStrokeOverlay(media, shouldStroke, strokeColor, width)
    })
}

/**
 * CMS project thumbnail stroke helper.
 *
 * Reads the All Projects CMS `Thumbnail Stroke` Boolean and paints a non-layout
 * overlay stroke on matching project thumbnail cards across native Framer
 * collection cards, the Framer editor canvas, and the custom /index grid.
 *
 * Stroke status is intentionally CMS-only; this component does not contain any
 * project-specific allowlist or hard-coded selected-work fallback.
 *
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function CaseStudyThumbnailStrokeStyles({
    strokeColor = DEFAULT_STROKE_COLOR,
    strokeWidth = 1,
    collectionId = "yTHrQWMIY",
    collectionModuleUrl = "",
    strokeFieldId = "OHdUYs6Mo",
    slugFieldId = "pdXVG_fBO",
    titleFieldId = "oeXZcmPna",
    imageWrapperNames = "ImageWrapper\nImage Wrapper\nVideoWrapper\nVideo Wrapper",
}: Partial<Props>) {
    const width = Math.max(0, Number(strokeWidth) || 0)

    React.useEffect(() => {
        if (width <= 0 || typeof window === "undefined") return

        let disposed = false
        let frame = 0
        let records: StrokeRecord[] = []

        const scheduleApply = () => {
            window.cancelAnimationFrame(frame)
            frame = window.requestAnimationFrame(() => {
                if (!disposed) applyCMSStrokes(records, imageWrapperNames, strokeColor, width)
            })
        }

        const refreshRecords = () => {
            loadStrokeRecords({
                collectionId,
                collectionModuleUrl,
                strokeFieldId,
                slugFieldId,
                titleFieldId,
            })
                .then((loaded) => {
                    if (disposed) return
                    records = loaded
                    scheduleApply()
                })
                .catch(() => {
                    if (disposed) return
                    records = []
                })
        }

        refreshRecords()

        const timeoutIds = [100, 350, 900, 1800, 3200].map((delay) =>
            window.setTimeout(scheduleApply, delay)
        )
        const refreshIds = [1200, 3600].map((delay) => window.setTimeout(refreshRecords, delay))
        const refreshInterval = window.setInterval(refreshRecords, 8000)

        const observer = new MutationObserver(scheduleApply)
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["href", "class", "data-framer-name", "name", "style"],
        })
        window.addEventListener("resize", scheduleApply, { passive: true })

        return () => {
            disposed = true
            window.cancelAnimationFrame(frame)
            timeoutIds.forEach((id) => window.clearTimeout(id))
            refreshIds.forEach((id) => window.clearTimeout(id))
            window.clearInterval(refreshInterval)
            observer.disconnect()
            window.removeEventListener("resize", scheduleApply)
        }
    }, [
        width,
        strokeColor,
        collectionId,
        collectionModuleUrl,
        strokeFieldId,
        slugFieldId,
        titleFieldId,
        imageWrapperNames,
    ])

    if (width <= 0) return null

    return (
        <div
            aria-hidden="true"
            style={{
                width: 0,
                height: 0,
                overflow: "hidden",
                pointerEvents: "none",
            }}
        >
            <style>{`
                .idx-grid-card-media.with-stroke {
                    box-shadow: none !important;
                }

                .${STROKE_CLASS} {
                    position: relative !important;
                    overflow: hidden !important;
                    isolation: isolate !important;
                }

                .${STROKE_CLASS} > [${OVERLAY_ATTR}="true"],
                .${STROKE_CLASS} > ${getCanvasOverlaySelector()} {
                    position: absolute !important;
                    inset: 0 !important;
                    display: block !important;
                    box-sizing: border-box !important;
                    border-radius: inherit !important;
                    pointer-events: none !important;
                    z-index: 2147483647 !important;
                }
            `}</style>
        </div>
    )
}

addPropertyControls(CaseStudyThumbnailStrokeStyles, {
    strokeColor: {
        type: ControlType.Color,
        title: "Stroke",
        defaultValue: DEFAULT_STROKE_COLOR,
    },
    strokeWidth: {
        type: ControlType.Number,
        title: "Width",
        defaultValue: 1,
        min: 0,
        max: 8,
        step: 1,
        unit: "px",
        displayStepper: true,
    },
    collectionId: {
        type: ControlType.String,
        title: "Collection",
        defaultValue: "yTHrQWMIY",
    },
    collectionModuleUrl: {
        type: ControlType.String,
        title: "Module URL",
        defaultValue: "",
        placeholder: "Optional fallback",
    },
    strokeFieldId: {
        type: ControlType.String,
        title: "Stroke Field",
        defaultValue: "OHdUYs6Mo",
    },
    slugFieldId: {
        type: ControlType.String,
        title: "Slug Field",
        defaultValue: "pdXVG_fBO",
    },
    titleFieldId: {
        type: ControlType.String,
        title: "Title Field",
        defaultValue: "oeXZcmPna",
    },
    imageWrapperNames: {
        type: ControlType.String,
        title: "Media Names",
        defaultValue: "ImageWrapper\nImage Wrapper\nVideoWrapper\nVideo Wrapper",
        displayTextArea: true,
    },
})
