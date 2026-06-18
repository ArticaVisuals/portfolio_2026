import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Props = {
    strokeColor: string
    strokeWidth: number
    enableHoverZoom: boolean
    hoverImageScale: number
    applyHoverZoomToIndexGrid: boolean
    collectionId: string
    collectionModuleUrl: string
    strokeFieldId: string
    videoFieldId: string
    thumbnailFieldId: string
    slugFieldId: string
    titleFieldId: string
    syncThumbnailVideos: boolean
    imageWrapperNames: string
}

type CMSValue = { value?: unknown }
type CMSItem = { slug?: string; title?: string; data?: Record<string, CMSValue | unknown> }
type CMSScanCollection = { scanItems?: () => Promise<CMSItem[]> }
type CMSCollectionExport = { collectionByLocaleId?: { default?: CMSScanCollection } }
type CMSModule = {
    a?: CMSCollectionExport
    r?: CMSCollectionExport | (() => unknown)
    t?: () => unknown
    default?: CMSCollectionExport | (() => unknown)
    [key: string]: unknown
}
type StrokeRecord = {
    slug: string
    title: string
    stroke: boolean
    thumbnailVideoSrc: string
    posterSrc: string
}

const STROKE_CLASS = "framer-cms-thumbnail-stroke"
const OVERLAY_ATTR = "data-framer-cms-thumbnail-stroke-overlay"
const GENERATED_ATTR = "data-framer-cms-thumbnail-stroke-generated"
const HOVER_CARD_ATTR = "data-case-study-thumbnail-hover-card"
const HOVER_FRAME_ATTR = "data-case-study-thumbnail-hover-frame"
const HOVER_MEDIA_ATTR = "data-case-study-thumbnail-hover-media"
const HOVER_BG_ATTR = "data-case-study-thumbnail-hover-background"
const HOVER_OWNER_ATTR = "data-case-study-thumbnail-hover-owner"
const HOVER_SCALE_VAR = "--case-study-thumbnail-hover-scale"
const HOVER_BG_IMAGE_VAR = "--case-study-thumbnail-hover-bg-image"
const HOVER_BG_POSITION_VAR = "--case-study-thumbnail-hover-bg-position"
const HOVER_BG_SIZE_VAR = "--case-study-thumbnail-hover-bg-size"
const HOVER_BG_REPEAT_VAR = "--case-study-thumbnail-hover-bg-repeat"
const INVALID_VIDEO_ATTR = "data-case-study-invalid-video"
const GENERATED_VIDEO_ATTR = "data-framer-cms-thumbnail-video"
const GENERATED_VIDEO_FRAME_ATTR = "data-framer-cms-thumbnail-video-frame"
const LEGACY_GENERATED_VIDEO_ATTR = "data-cms-thumbnail-video-sync"
const LEGACY_GENERATED_VIDEO_FRAME_ATTR = "data-cms-thumbnail-video-frame"
const DEFAULT_STROKE_COLOR = "#979797"
const DEFAULT_HOVER_IMAGE_SCALE = 1.02
const HOVER_DURATION_MS = 420
const HOVER_EASING = "cubic-bezier(0.16, 1, 0.3, 1)"
const CANVAS_OVERLAY_NAMES = [
    "ThumbnailStrokeOverlay",
    "Thumbnail Stroke Overlay",
    "CMSStrokeOverlay",
    "CMS Stroke Overlay",
]
const LIVE_SCAN_PATHS = [
    "/",
    "/case-studies",
    "/index",
    "https://khaki-ship-257706.framer.app/",
    "https://khaki-ship-257706.framer.app/case-studies",
    "https://khaki-ship-257706.framer.app/index",
]
const cmsModuleUrlCache = new Map<string, string>()

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

const CANVAS_OVERLAY_SELECTORS = CANVAS_OVERLAY_NAMES.map(nameSelector)
const CANVAS_OVERLAY_SELECTOR = CANVAS_OVERLAY_SELECTORS.join(",")
const CARD_SELECTOR =
    'a[href*="/case-studies/"], a[href^="./case-studies/"], a[href^="../case-studies/"], .idx-grid-card, .selected-work-card, .mh-other-project-card, [data-framer-name="Card"], [name="Card"]'
const HOVER_MEDIA_SELECTOR = [
    "img",
    "video",
    "[data-framer-background-image-wrapper=\"true\"]",
    "[style*=\"background-image\"]",
    nameSelector("Image"),
    nameSelector("Video"),
    nameSelector("Img"),
    nameSelector("ThumbnailVideo"),
    nameSelector("Thumbnail Video"),
].join(",")
const mediaSelectorsCache = new Map<string, string[]>()

function getMediaSelectors(imageWrapperNames: string): string[] {
    const key = String(imageWrapperNames || "")
    const cached = mediaSelectorsCache.get(key)
    if (cached) return cached

    const selectors = [
        ...splitNames(imageWrapperNames).map(nameSelector),
        ".idx-grid-card-media",
        ".selected-work-media",
        ".mh-other-project-media",
    ]
    mediaSelectorsCache.set(key, selectors)
    return selectors
}

function getCanvasOverlaySelector(): string {
    return CANVAS_OVERLAY_SELECTOR
}

function readField(data: Record<string, CMSValue | unknown> | undefined, fieldId: string) {
    if (!fieldId) return undefined

    const field = data?.[fieldId]
    if (typeof field === "object" && field !== null && "value" in field) {
        return (field as CMSValue).value
    }

    return field
}

function readFirstMediaField(
    data: Record<string, CMSValue | unknown> | undefined,
    fieldIds: string
): string {
    for (const fieldId of splitNames(fieldIds)) {
        const source = normalizeMediaSource(readField(data, fieldId))
        if (source) return source
    }
    return ""
}

function normalizeText(value: unknown): string {
    return String(value ?? "").trim()
}

function normalizeMediaSource(value: unknown): string {
    if (!value) return ""
    if (typeof value === "string") return value.trim()
    if (Array.isArray(value)) {
        return value.map(normalizeMediaSource).find(Boolean) || ""
    }
    if (typeof value === "object") {
        const record = value as Record<string, unknown>
        if ("value" in record) return normalizeMediaSource(record.value)

        for (const key of ["src", "url", "href", "file"]) {
            const source = normalizeMediaSource(record[key])
            if (source) return source
        }
    }
    return ""
}

function normalizeTitle(value: string): string {
    return value.toLowerCase().replace(/\s+/g, " ").trim()
}

function normalizeSlug(value: string): string {
    return value.trim().replace(/^\/+|\/+$/g, "")
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
    return new RegExp(
        `/${collectionPattern}(?:\\.[^/?#]+)?\\.(?:js|mjs)(?:[?#].*)?$`
    ).test(url)
}

function findCMSModuleUrlInMarkup(markup: string, collectionId: string): string | undefined {
    const collectionPattern = escapeRegExp(collectionId)
    const match = markup.match(
        new RegExp(
            `https://framerusercontent\\.com/(?:sites|modules)/[^"']+/${collectionPattern}(?:\\.[^"'/]+)?\\.(?:js|mjs)`,
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

    const cached = cmsModuleUrlCache.get(collectionId)
    if (cached) return cached

    const inDocument = findCMSModuleUrlInDocument(collectionId)
    if (inDocument) {
        cmsModuleUrlCache.set(collectionId, inDocument)
        return inDocument
    }

    for (const path of LIVE_SCAN_PATHS) {
        try {
            const response = await fetch(path, { credentials: "same-origin" })
            if (!response.ok) continue
            const html = await response.text()
            const found = findCMSModuleUrlInMarkup(html, collectionId)
            if (found) {
                cmsModuleUrlCache.set(collectionId, found)
                return found
            }
        } catch {
            // Framer canvas, preview, and published URLs can live on different origins.
        }
    }

    return undefined
}

function isCMSCollectionExport(value: unknown): value is CMSCollectionExport {
    return (
        typeof value === "object" &&
        value !== null &&
        typeof (value as CMSCollectionExport).collectionByLocaleId?.default?.scanItems === "function"
    )
}

function getCMSCollection(module: CMSModule): CMSScanCollection | undefined {
    const candidates = [module.a, module.r, module.default, ...Object.values(module)]
    for (const candidate of candidates) {
        let resolved = candidate
        if (typeof resolved === "function") {
            try {
                resolved = resolved()
            } catch {
                resolved = undefined
            }
        }

        if (isCMSCollectionExport(resolved)) {
            return resolved.collectionByLocaleId?.default
        }
    }

    return undefined
}

function initializeCMSModule(module: CMSModule) {
    const maybeInitializers = [module.t, module.r, module.default, ...Object.values(module)]

    maybeInitializers.forEach((initializer) => {
        try {
            if (typeof initializer === "function") initializer()
        } catch {
            // Some Framer module initializers are already settled; ignore safely.
        }
    })

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
    videoFieldId,
    thumbnailFieldId,
    slugFieldId,
    titleFieldId,
}: Pick<
    Props,
    | "collectionId"
    | "collectionModuleUrl"
    | "strokeFieldId"
    | "videoFieldId"
    | "thumbnailFieldId"
    | "slugFieldId"
    | "titleFieldId"
>): Promise<StrokeRecord[]> {
    const moduleUrl = await resolveCMSModuleUrl(collectionId, collectionModuleUrl)
    if (!moduleUrl) return []

    const module = (await import(/* @vite-ignore */ moduleUrl)) as CMSModule
    initializeCMSModule(module)

    const collection = getCMSCollection(module)
    if (!collection || typeof collection.scanItems !== "function") return []

    const items = (await collection.scanItems()) as CMSItem[]
    return items.map((item) => {
        const data = item.data
        const slug = normalizeSlug(
            normalizeText(readField(data, slugFieldId)) || normalizeText(item.slug)
        )
        return {
            slug,
            title: normalizeText(readField(data, titleFieldId)) || normalizeText(item.title),
            stroke: Boolean(readField(data, strokeFieldId)),
            thumbnailVideoSrc: readFirstMediaField(data, videoFieldId),
            posterSrc: normalizeMediaSource(readField(data, thumbnailFieldId)),
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

function isStrokeOverlayElement(element: HTMLElement): boolean {
    return (
        element.getAttribute(OVERLAY_ATTR) === "true" ||
        element.getAttribute(GENERATED_ATTR) === "true" ||
        matchesAnySelector(element, CANVAS_OVERLAY_SELECTORS)
    )
}

function findHoverMediaElements(frame: HTMLElement): HTMLElement[] {
    return Array.from(frame.querySelectorAll<HTMLElement>(HOVER_MEDIA_SELECTOR)).filter(
        (media) =>
            media !== frame &&
            !isStrokeOverlayElement(media) &&
            media.getAttribute(INVALID_VIDEO_ATTR) !== "true"
    )
}

function hasUsableBackgroundImage(element: HTMLElement): boolean {
    if (typeof window === "undefined" || typeof window.getComputedStyle !== "function") return false

    const style = window.getComputedStyle(element)
    return Boolean(style.backgroundImage && style.backgroundImage !== "none")
}

function storeBackgroundImageVars(element: HTMLElement) {
    const style = window.getComputedStyle(element)
    element.style.setProperty(HOVER_BG_IMAGE_VAR, style.backgroundImage)
    element.style.setProperty(HOVER_BG_POSITION_VAR, style.backgroundPosition)
    element.style.setProperty(HOVER_BG_SIZE_VAR, style.backgroundSize)
    element.style.setProperty(HOVER_BG_REPEAT_VAR, style.backgroundRepeat)
}

function clearHoverZoom(owner: string) {
    document.querySelectorAll<HTMLElement>(`[${HOVER_OWNER_ATTR}="${owner}"]`).forEach((element) => {
        element.removeAttribute(HOVER_OWNER_ATTR)
        element.removeAttribute(HOVER_CARD_ATTR)
        element.removeAttribute(HOVER_FRAME_ATTR)
        element.removeAttribute(HOVER_MEDIA_ATTR)
        element.removeAttribute(HOVER_BG_ATTR)
        element.style.removeProperty(HOVER_BG_IMAGE_VAR)
        element.style.removeProperty(HOVER_BG_POSITION_VAR)
        element.style.removeProperty(HOVER_BG_SIZE_VAR)
        element.style.removeProperty(HOVER_BG_REPEAT_VAR)
    })
}

function isIndexGridTarget(card: HTMLElement, media: HTMLElement): boolean {
    return card.classList.contains("idx-grid-card") || media.classList.contains("idx-grid-card-media")
}

function applyHoverZoom(
    owner: string,
    cards: HTMLElement[],
    imageWrapperNames: string,
    applyToIndexGrid: boolean
) {
    clearHoverZoom(owner)

    cards.forEach((card) => {
        const frame = findMediaElement(card, imageWrapperNames)
        if (!frame) return
        if (!applyToIndexGrid && isIndexGridTarget(card, frame)) return

        const mediaElements = findHoverMediaElements(frame)
        const shouldUseBackgroundProxy = mediaElements.length === 0 && hasUsableBackgroundImage(frame)
        if (mediaElements.length === 0 && !shouldUseBackgroundProxy) return

        card.setAttribute(HOVER_CARD_ATTR, "true")
        card.setAttribute(HOVER_OWNER_ATTR, owner)

        frame.setAttribute(HOVER_FRAME_ATTR, "true")
        frame.setAttribute(HOVER_OWNER_ATTR, owner)

        if (shouldUseBackgroundProxy) {
            frame.setAttribute(HOVER_BG_ATTR, "true")
            storeBackgroundImageVars(frame)
        }

        mediaElements.forEach((media) => {
            media.setAttribute(HOVER_MEDIA_ATTR, "true")
            media.setAttribute(HOVER_OWNER_ATTR, owner)
        })
    })
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

type StrokeRecordLookup = {
    bySlug: Map<string, StrokeRecord>
    byTitle: Array<{ title: string; record: StrokeRecord }>
}

function buildStrokeRecordLookup(records: StrokeRecord[]): StrokeRecordLookup {
    return {
        bySlug: new Map(
            records
                .filter((record) => record.slug)
                .map((record): [string, StrokeRecord] => [record.slug, record])
        ),
        byTitle: records
            .map((record) => ({ title: normalizeTitle(record.title), record }))
            .filter(({ title }) => Boolean(title)),
    }
}

function findRecordForCard(card: HTMLElement, lookup: StrokeRecordLookup): StrokeRecord | undefined {
    const slug = normalizeSlug(getSlugFromHref(getCardHref(card)))
    if (slug && slug !== ":slug") {
        const bySlug = lookup.bySlug.get(slug)
        if (bySlug) return bySlug
    }

    const title = getCardTitle(card)
    return lookup.byTitle.find(({ title: recordTitle }) => titleMatches(title, [recordTitle]))?.record
}

function getProjectRoute(record: StrokeRecord): string {
    return record.slug ? `/case-studies/${normalizeSlug(record.slug)}` : ""
}

function getCardAnchor(card: HTMLElement): HTMLAnchorElement | null {
    if (card instanceof HTMLAnchorElement) return card
    return (
        card.querySelector<HTMLAnchorElement>("a[href]") ||
        card.closest<HTMLAnchorElement>("a[href]") ||
        null
    )
}

function getSameOriginPath(href: string | null): string {
    if (!href) return ""

    try {
        const url = new URL(href, window.location.href)
        if (url.origin !== window.location.origin) return url.href
        return url.pathname.replace(/\/+$/, "") || "/"
    } catch {
        return href.split("?")[0].split("#")[0].replace(/\/+$/, "") || href
    }
}

function shouldRepairHref(href: string | null, expectedRoute: string): boolean {
    if (!expectedRoute) return false

    const value = String(href || "").trim()
    if (!value || value === "#" || value === "." || value === "./") return true
    if (value.includes(":slug")) return true

    const currentPath = window.location.pathname.replace(/\/+$/, "") || "/"
    const path = getSameOriginPath(value)
    if (path === "/" || path === currentPath) return true

    return path.startsWith("/case-studies/") && path !== expectedRoute
}

function repairCardLink(card: HTMLElement, record: StrokeRecord) {
    const route = getProjectRoute(record)
    if (!route) return

    const anchor = getCardAnchor(card)
    if (!anchor) return
    if (!shouldRepairHref(anchor.getAttribute("href"), route)) return

    anchor.setAttribute("href", route)
}

function isUsableMediaUrl(value: string): boolean {
    if (!value) return false

    try {
        const url = new URL(value, window.location.href)
        const current = new URL(window.location.href)
        const samePage =
            url.origin === current.origin &&
            url.pathname.replace(/\/+$/, "") === current.pathname.replace(/\/+$/, "")
        if (samePage) return false
        return /\.(mp4|m4v|mov|webm|ogg)(?:[?#].*)?$/i.test(url.pathname) || url.origin !== current.origin
    } catch {
        return /\.(mp4|m4v|mov|webm|ogg)(?:[?#].*)?$/i.test(value)
    }
}

function hasUsableVideoSource(video: HTMLVideoElement): boolean {
    const sourceUrls = [
        video.currentSrc,
        video.src,
        video.getAttribute("src"),
        ...Array.from(video.querySelectorAll("source")).map(
            (source) => source.src || source.getAttribute("src")
        ),
    ]

    return sourceUrls.some((url) => isUsableMediaUrl(String(url || "")))
}

function syncInvalidCardVideos(card: HTMLElement) {
    card.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
        const invalid = !hasUsableVideoSource(video)

        if (!invalid) {
            video.removeAttribute(INVALID_VIDEO_ATTR)
            video.style.removeProperty("display")
            video.style.removeProperty("visibility")
            video.style.removeProperty("pointer-events")
            return
        }

        video.setAttribute(INVALID_VIDEO_ATTR, "true")
        video.setAttribute("aria-hidden", "true")
        video.style.setProperty("display", "none", "important")
        video.style.setProperty("visibility", "hidden", "important")
        video.style.setProperty("pointer-events", "none", "important")
    })
}

function getCurrentVideoSource(video: HTMLVideoElement): string {
    return normalizeText(
        video.currentSrc ||
            video.src ||
            video.getAttribute("src") ||
            video.querySelector("source")?.getAttribute("src") ||
            ""
    )
}

function syncThumbnailVideoElement(
    video: HTMLVideoElement,
    source: string,
    poster: string
) {
    const currentSource = getCurrentVideoSource(video)
    const changed = currentSource !== source

    if (changed) {
        video.setAttribute("src", source)
        video.querySelectorAll("source").forEach((sourceElement) => sourceElement.remove())
    }

    if (poster) {
        video.setAttribute("poster", poster)
    } else {
        video.removeAttribute("poster")
    }

    video.autoplay = true
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.preload = "metadata"
    video.setAttribute("autoplay", "")
    video.setAttribute("muted", "")
    video.setAttribute("loop", "")
    video.setAttribute("playsinline", "")
    video.removeAttribute(INVALID_VIDEO_ATTR)
    video.removeAttribute("aria-hidden")
    video.style.removeProperty("display")
    video.style.removeProperty("visibility")
    video.style.removeProperty("pointer-events")

    if (changed) {
        try {
            video.load()
            const play = video.play()
            if (play && typeof play.catch === "function") play.catch(() => {})
        } catch {
            // Autoplay can be denied in editor/canvas; published muted video will retry naturally.
        }
    }
}

function removeGeneratedThumbnailVideo(media: HTMLElement) {
    media
        .querySelectorAll<HTMLVideoElement>(
            `video[${GENERATED_VIDEO_ATTR}="true"], video[${LEGACY_GENERATED_VIDEO_ATTR}="true"]`
        )
        .forEach((video) => video.remove())
    media.removeAttribute(GENERATED_VIDEO_FRAME_ATTR)
    media.removeAttribute(LEGACY_GENERATED_VIDEO_FRAME_ATTR)
}

function getExistingThumbnailVideo(media: HTMLElement): HTMLVideoElement | null {
    return (
        Array.from(media.querySelectorAll<HTMLVideoElement>("video")).find(
            (video) =>
                video.getAttribute(GENERATED_VIDEO_ATTR) !== "true" &&
                video.getAttribute(LEGACY_GENERATED_VIDEO_ATTR) !== "true" &&
                video.getAttribute(INVALID_VIDEO_ATTR) !== "true"
        ) || null
    )
}

function createGeneratedThumbnailVideo(media: HTMLElement): HTMLVideoElement {
    const video = document.createElement("video")
    video.setAttribute(GENERATED_VIDEO_ATTR, "true")
    video.setAttribute("data-framer-name", "CMS Thumbnail Video")
    video.setAttribute("aria-hidden", "true")
    Object.assign(video.style, {
        position: "absolute",
        inset: "0px",
        width: "100%",
        height: "100%",
        display: "block",
        objectFit: "cover",
        objectPosition: "center center",
        pointerEvents: "none",
        zIndex: "1",
    })

    if (typeof window !== "undefined" && window.getComputedStyle(media).position === "static") {
        media.style.position = "relative"
    }

    media.setAttribute(GENERATED_VIDEO_FRAME_ATTR, "true")
    media.appendChild(video)
    return video
}

function syncCMSVideoForMedia(media: HTMLElement, record: StrokeRecord | undefined) {
    const source = normalizeMediaSource(record?.thumbnailVideoSrc)
    const poster = normalizeMediaSource(record?.posterSrc)

    if (!source) {
        removeGeneratedThumbnailVideo(media)
        return
    }

    const existing = getExistingThumbnailVideo(media)
    if (existing) {
        syncThumbnailVideoElement(existing, source, poster)
        removeGeneratedThumbnailVideo(media)
        return
    }

    const generated =
        media.querySelector<HTMLVideoElement>(`video[${GENERATED_VIDEO_ATTR}="true"]`) ||
        createGeneratedThumbnailVideo(media)
    syncThumbnailVideoElement(generated, source, poster)
}

function applyProjectCardRepairs(records: StrokeRecord[], cards: HTMLElement[]) {
    const lookup = buildStrokeRecordLookup(records)

    cards.forEach((card) => {
        syncInvalidCardVideos(card)

        const record = findRecordForCard(card, lookup)
        if (!record) return

        repairCardLink(card, record)
    })
}

function applyCMSVideos(
    records: StrokeRecord[],
    cards: HTMLElement[],
    imageWrapperNames: string
) {
    if (records.length === 0) return

    const lookup = buildStrokeRecordLookup(records)
    cards.forEach((card) => {
        const media = findMediaElement(card, imageWrapperNames)
        if (!media) return

        syncCMSVideoForMedia(media, findRecordForCard(card, lookup))
    })
}

function getStrokeRecordSignature(records: StrokeRecord[]): string {
    return records
        .map((record) =>
            [
                record.slug,
                record.title,
                record.stroke ? "1" : "0",
                record.thumbnailVideoSrc,
                record.posterSrc,
            ].join("\u0001")
        )
        .join("\u0002")
}

function getCanvasOverlayByStyle(media: HTMLElement): HTMLElement | null {
    if (typeof window === "undefined" || typeof window.getComputedStyle !== "function") return null

    const children = Array.from(media.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement
    )
    return (
        children.find((child) => {
            if (child.getAttribute(GENERATED_ATTR) === "true") return false
            if (matchesAnySelector(child, CANVAS_OVERLAY_SELECTORS)) return true

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
        media.closest<HTMLElement>(CARD_SELECTOR) || media.parentElement || media
    )
}

function getCards(imageWrapperNames: string): HTMLElement[] {
    const cards = new Set<HTMLElement>()

    document
        .querySelectorAll<HTMLElement>(CARD_SELECTOR)
        .forEach((card) => cards.add(card))

    getMediaSelectors(imageWrapperNames).forEach((selector) => {
        document.querySelectorAll<HTMLElement>(selector).forEach((media) => {
            cards.add(closestCardFromMedia(media))
        })
    })

    return Array.from(cards)
}

function applyCMSStrokes(
    records: StrokeRecord[],
    cards: HTMLElement[],
    imageWrapperNames: string,
    strokeColor: string,
    width: number
) {
    if (records.length === 0) return

    const activeLookup = buildStrokeRecordLookup(records.filter((record) => record.stroke))

    cards.forEach((card) => {
        const media = findMediaElement(card, imageWrapperNames)
        if (!media) return

        const shouldStroke = Boolean(findRecordForCard(card, activeLookup))
        syncStrokeOverlay(media, shouldStroke, strokeColor, width)
    })
}

/**
 * CMS project thumbnail stroke helper.
 *
 * Reads the All Projects CMS `Thumbnail Stroke` Boolean and paints a non-layout
 * overlay stroke on matching project thumbnail cards across native Framer
 * collection cards, the Framer editor canvas, and the custom /index grid. It
 * also repairs selected-work card anchors when Framer exports unresolved CMS
 * page links and hides blank CMS videos that resolve to the current page.
 *
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function CaseStudyThumbnailStrokeStyles({
    strokeColor = DEFAULT_STROKE_COLOR,
    strokeWidth = 1,
    enableHoverZoom = true,
    hoverImageScale = DEFAULT_HOVER_IMAGE_SCALE,
    applyHoverZoomToIndexGrid = false,
    collectionId = "yTHrQWMIY",
    collectionModuleUrl = "",
    strokeFieldId = "OHdUYs6Mo",
    videoFieldId = "SvOqFqdby",
    thumbnailFieldId = "Jy7hBJady",
    slugFieldId = "pdXVG_fBO",
    titleFieldId = "oeXZcmPna",
    syncThumbnailVideos = true,
    imageWrapperNames = "ImageWrapper\nImage Wrapper\nVideoWrapper\nVideo Wrapper",
}: Partial<Props>) {
    const width = Math.max(0, Number(strokeWidth) || 0)
    const owner = React.useId().replace(/[^a-zA-Z0-9_-]/g, "")
    const hoverScale = Math.max(1, Number(hoverImageScale) || 1)
    const shouldApplyHoverZoom = enableHoverZoom && hoverScale > 1

    React.useEffect(() => {
        if (typeof window === "undefined") return

        let disposed = false
        let frame = 0
        let records: StrokeRecord[] = []
        let recordsSignature: string | null = null

        const scheduleApply = () => {
            window.cancelAnimationFrame(frame)
            frame = window.requestAnimationFrame(() => {
                if (disposed) return
                const cards = getCards(imageWrapperNames)
                if (syncThumbnailVideos) {
                    applyCMSVideos(records, cards, imageWrapperNames)
                } else {
                    cards.forEach((card) => {
                        const media = findMediaElement(card, imageWrapperNames)
                        if (media) removeGeneratedThumbnailVideo(media)
                    })
                }
                applyProjectCardRepairs(records, cards)
                if (width > 0) {
                    applyCMSStrokes(records, cards, imageWrapperNames, strokeColor, width)
                }
                if (shouldApplyHoverZoom) {
                    applyHoverZoom(owner, cards, imageWrapperNames, applyHoverZoomToIndexGrid)
                } else {
                    clearHoverZoom(owner)
                }
            })
        }

        const refreshRecords = () => {
            if (document.visibilityState === "hidden") return

            loadStrokeRecords({
                collectionId,
                collectionModuleUrl,
                strokeFieldId,
                videoFieldId,
                thumbnailFieldId,
                slugFieldId,
                titleFieldId,
            })
                .then((loaded) => {
                    if (disposed) return
                    const nextSignature = getStrokeRecordSignature(loaded)
                    if (recordsSignature === nextSignature) return
                    recordsSignature = nextSignature
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
            attributeFilter: ["href", "class", "data-framer-name", "name", "src", "poster"],
        })
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") refreshRecords()
        }
        window.addEventListener("resize", scheduleApply, { passive: true })
        document.addEventListener("visibilitychange", handleVisibilityChange)

        return () => {
            disposed = true
            window.cancelAnimationFrame(frame)
            timeoutIds.forEach((id) => window.clearTimeout(id))
            refreshIds.forEach((id) => window.clearTimeout(id))
            window.clearInterval(refreshInterval)
            observer.disconnect()
            window.removeEventListener("resize", scheduleApply)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
            clearHoverZoom(owner)
        }
    }, [
        width,
        strokeColor,
        owner,
        shouldApplyHoverZoom,
        applyHoverZoomToIndexGrid,
        collectionId,
        collectionModuleUrl,
        strokeFieldId,
        videoFieldId,
        thumbnailFieldId,
        slugFieldId,
        titleFieldId,
        syncThumbnailVideos,
        imageWrapperNames,
    ])

    if (width <= 0 && !shouldApplyHoverZoom) return null

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

                [${HOVER_FRAME_ATTR}="true"] {
                    overflow: hidden !important;
                    clip-path: inset(0);
                    contain: paint;
                    isolation: isolate;
                }

                [${HOVER_CARD_ATTR}="true"] {
                    ${HOVER_SCALE_VAR}: ${hoverScale};
                }

                [${HOVER_MEDIA_ATTR}="true"] {
                    transform: scale(1) !important;
                    transform-origin: center center !important;
                    transition: transform ${HOVER_DURATION_MS}ms ${HOVER_EASING} !important;
                    backface-visibility: hidden !important;
                    will-change: transform !important;
                }

                [${HOVER_FRAME_ATTR}="true"][${HOVER_MEDIA_ATTR}="true"] {
                    transform: none !important;
                    transition: none !important;
                    will-change: auto !important;
                }

                [${HOVER_BG_ATTR}="true"] {
                    position: relative !important;
                }

                [${HOVER_BG_ATTR}="true"]::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    pointer-events: none;
                    border-radius: inherit;
                    background-image: var(${HOVER_BG_IMAGE_VAR});
                    background-position: var(${HOVER_BG_POSITION_VAR}, center center);
                    background-size: var(${HOVER_BG_SIZE_VAR}, cover);
                    background-repeat: var(${HOVER_BG_REPEAT_VAR}, no-repeat);
                    transform: scale(1);
                    transform-origin: center center;
                    transition: transform ${HOVER_DURATION_MS}ms ${HOVER_EASING};
                    backface-visibility: hidden;
                    will-change: transform;
                }

                [${HOVER_CARD_ATTR}="true"]:hover [${HOVER_MEDIA_ATTR}="true"],
                [${HOVER_CARD_ATTR}="true"]:focus-visible [${HOVER_MEDIA_ATTR}="true"],
                [${HOVER_CARD_ATTR}="true"]:focus-within [${HOVER_MEDIA_ATTR}="true"],
                [${HOVER_CARD_ATTR}="true"]:hover [${HOVER_BG_ATTR}="true"]::before,
                [${HOVER_CARD_ATTR}="true"]:focus-visible [${HOVER_BG_ATTR}="true"]::before,
                [${HOVER_CARD_ATTR}="true"]:focus-within [${HOVER_BG_ATTR}="true"]::before {
                    transform: scale(var(${HOVER_SCALE_VAR}, ${DEFAULT_HOVER_IMAGE_SCALE})) !important;
                }

                @media (prefers-reduced-motion: reduce) {
                    [${HOVER_MEDIA_ATTR}="true"],
                    [${HOVER_CARD_ATTR}="true"]:hover [${HOVER_MEDIA_ATTR}="true"],
                    [${HOVER_CARD_ATTR}="true"]:focus-visible [${HOVER_MEDIA_ATTR}="true"],
                    [${HOVER_CARD_ATTR}="true"]:focus-within [${HOVER_MEDIA_ATTR}="true"],
                    [${HOVER_CARD_ATTR}="true"]:hover [${HOVER_BG_ATTR}="true"]::before,
                    [${HOVER_CARD_ATTR}="true"]:focus-visible [${HOVER_BG_ATTR}="true"]::before,
                    [${HOVER_CARD_ATTR}="true"]:focus-within [${HOVER_BG_ATTR}="true"]::before,
                    [${HOVER_BG_ATTR}="true"]::before {
                        transform: scale(1) !important;
                        transition: none !important;
                        will-change: auto !important;
                    }
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
    enableHoverZoom: {
        type: ControlType.Boolean,
        title: "Hover Zoom",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    hoverImageScale: {
        type: ControlType.Number,
        title: "Zoom Scale",
        defaultValue: DEFAULT_HOVER_IMAGE_SCALE,
        min: 1,
        max: 1.12,
        step: 0.005,
        hidden: ({ enableHoverZoom }) => !enableHoverZoom,
    },
    applyHoverZoomToIndexGrid: {
        type: ControlType.Boolean,
        title: "Index Grid",
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
        hidden: ({ enableHoverZoom }) => !enableHoverZoom,
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
    syncThumbnailVideos: {
        type: ControlType.Boolean,
        title: "CMS Videos",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    videoFieldId: {
        type: ControlType.String,
        title: "Video Field",
        defaultValue: "SvOqFqdby",
        hidden: ({ syncThumbnailVideos }) => !syncThumbnailVideos,
    },
    thumbnailFieldId: {
        type: ControlType.String,
        title: "Poster Field",
        defaultValue: "Jy7hBJady",
        hidden: ({ syncThumbnailVideos }) => !syncThumbnailVideos,
    },
    slugFieldId: {
        type: ControlType.String,
        title: "Slug Field",
        defaultValue: "pdXVG_fBO",
        placeholder: "Uses item slug",
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
