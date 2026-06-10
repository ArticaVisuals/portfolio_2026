import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

type LinkValue =
    | string
    | {
          href?: string
          url?: string
          path?: string
      }
    | null
    | undefined

type Props = {
    title: string
    sortingNumber: number
    projectLink: LinkValue
    link: LinkValue
    thumbnailSrc: string
    thumbnailVideoSrc: string
    useCMS: boolean
    collectionId: string
    collectionModuleUrl: string
    thumbnailVideoFieldIds: string
    textColor: string
    strokeColor: string
}

type CMSFieldValue = { value?: unknown }
type CMSItem = {
    data?: Record<string, CMSFieldValue | unknown>
    slug?: unknown
    [key: string]: unknown
}
type CMSCollection = { scanItems: () => Promise<CMSItem[]> }
type CMSCollectionExport = { collectionByLocaleId?: { default?: CMSCollection } }
type CMSModule = {
    a?: CMSCollectionExport
    r?: CMSCollectionExport | (() => unknown)
    t?: () => unknown
    default?: CMSCollectionExport | (() => unknown)
    [key: string]: unknown
}
type CMSProjectRecord = {
    title: string
    slug: string
    thumbnailSrc: string
    thumbnailVideoSrc: string
    thumbnailStroke: boolean
}

const DEFAULT_TEXT_COLOR = "#233324"
const DEFAULT_STROKE_COLOR = "#979797"
const COLLECTION_ID = "yTHrQWMIY"
const FIELD_IDS = {
    title: "oeXZcmPna",
    slug: "pdXVG_fBO",
    thumbnail: "Jy7hBJady",
    thumbnailVideo: "SvOqFqdby",
    thumbnailStroke: "OHdUYs6Mo",
} as const
const LIVE_SCAN_PATHS = [
    "/",
    "/case-studies",
    "/index",
    "https://khaki-ship-257706.framer.app/",
    "https://khaki-ship-257706.framer.app/case-studies",
    "https://khaki-ship-257706.framer.app/index",
]
const THUMBNAIL_ASPECT_RATIO = "1.674 / 1"
const TITLE_LINE_HEIGHT = 13
const HOVER_DURATION = 420
const HOVER_EASING = "cubic-bezier(.22, 1, .36, 1)"
const SECTION_NEXT_PROJECT_SELECTOR =
    ':is([data-framer-name="SectionNextProject"], [name="SectionNextProject"], [data-framer-name="Section Next Project"], [name="Section Next Project"])'
const SECTION_HEADING_SELECTOR = ':is([data-framer-name="Heading"], [name="Heading"])'
const NEXT_PROJECT_WRAPPER_SELECTOR =
    ':is([data-framer-name="NextProjectWrapper"], [name="NextProjectWrapper"], [data-framer-name="Next Project Wrapper"], [name="Next Project Wrapper"])'
const ALL_PROJECTS_SELECTOR = ':is([data-framer-name="AllProjects"], [name="AllProjects"])'
const KNOWN_PROJECT_LINKS: Record<string, string> = {
    "airpods pro 3": "/case-studies/airpods",
    "simon & schuster": "/case-studies/simon-schuster",
    gaia: "/case-studies/gaia",
    "national park playing cards": "/case-studies/national-park-cards",
    "motion connect 2025": "/case-studies/motion-connect-2025",
    yomo: "/case-studies/yomo",
    karuna: "/case-studies/karuna",
    "weaponized innocence": "/case-studies/weaponized-innocence",
    typldn: "/case-studies/typldn",
    "seek truth": "/case-studies/seek-truth",
    "cellular symphony": "/case-studies/cellular-symphony",
    "wolff olins x artcenter": "/case-studies/wolff-olins-x-artcenter",
    "independent lens": "/case-studies/independent-lens",
    "neon lights": "/case-studies/neon-lights",
    "aspen valley landscaping": "/case-studies/aspen-valley-landscaping",
}

const cmsModuleUrlCache = new Map<string, string>()
const cmsRecordCache = new Map<string, CMSProjectRecord[]>()
const cmsRecordPromiseCache = new Map<string, Promise<CMSProjectRecord[]>>()

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function readField(data: Record<string, CMSFieldValue | unknown> | undefined, fieldId: string) {
    const field = data?.[fieldId]
    if (field && typeof field === "object" && "value" in field) {
        return (field as CMSFieldValue).value
    }
    return field
}

function normalizeText(value: unknown): string {
    return String(value ?? "").trim()
}

function normalizeTitleKey(value: unknown): string {
    return normalizeText(value).toLowerCase().replace(/\s+/g, " ")
}

function normalizeSlug(value: unknown): string {
    return normalizeText(value).replace(/^\/+|\/+$/g, "")
}

function normalizeBoolean(value: unknown): boolean {
    if (typeof value === "boolean") return value
    if (typeof value === "number") return value !== 0
    const text = normalizeText(value).toLowerCase()
    return text === "true" || text === "yes" || text === "1"
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

function splitFieldIds(value: string): string[] {
    return String(value || "")
        .split(/[\n,]/)
        .map((fieldId) => fieldId.trim())
        .filter(Boolean)
}

function readFirstMediaField(
    data: Record<string, CMSFieldValue | unknown> | undefined,
    fieldIds: string
): string {
    for (const fieldId of splitFieldIds(fieldIds)) {
        const source = normalizeMediaSource(readField(data, fieldId))
        if (source) return source
    }
    return ""
}

function isUsableProjectHref(value: string): boolean {
    return Boolean(value && value !== "#" && value !== "/" && value !== ".")
}

function normalizeLinkValue(value: unknown): string {
    if (typeof value === "string") return value.trim()

    if (value && typeof value === "object") {
        const record = value as Record<string, unknown>
        const candidate = record.href || record.url || record.path
        if (typeof candidate === "string") return candidate.trim()
    }

    return ""
}

function resolveProjectHref(projectLink: unknown, link: unknown, title: unknown): string {
    const configuredHref = normalizeLinkValue(projectLink)
    if (isUsableProjectHref(configuredHref)) return configuredHref

    const legacyHref = normalizeLinkValue(link)
    if (isUsableProjectHref(legacyHref)) return legacyHref

    return KNOWN_PROJECT_LINKS[normalizeTitleKey(title)] || "#"
}

function getSlugFromHref(href: string): string {
    if (!href || typeof window === "undefined") return ""

    try {
        const url = new URL(href, window.location.href)
        const match = url.pathname.match(/\/case-studies\/([^/?#]+)/)
        return normalizeSlug(match?.[1])
    } catch {
        return ""
    }
}

function isCanvasTarget(): boolean {
    try {
        return RenderTarget.current() === RenderTarget.canvas
    } catch {
        return false
    }
}

function shouldHandleNavigation(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (
        isCanvasTarget() ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !href ||
        href === "#" ||
        href === "/"
    ) {
        return false
    }

    if (typeof window === "undefined") return false

    try {
        const url = new URL(href, window.location.href)
        return url.origin === window.location.origin && url.pathname.startsWith("/case-studies/")
    } catch {
        return false
    }
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

    return Array.from(new Set([...elementUrls, ...performanceUrls].filter(Boolean)))
}

function findCMSModuleUrlInDocument(collectionId: string): string | undefined {
    const fromResources = getDocumentResourceUrls().find((url) => isCMSModuleUrl(url, collectionId))
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
            const found = findCMSModuleUrlInMarkup(await response.text(), collectionId)
            if (found) {
                cmsModuleUrlCache.set(collectionId, found)
                return found
            }
        } catch {
            // Framer preview, canvas, and public URLs can resolve from different origins.
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

function getCMSCollection(module: CMSModule): CMSCollection | undefined {
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
            // Generated Framer CMS modules may already be initialized.
        }
    })
}

async function loadCMSRecords(
    collectionId: string,
    collectionModuleUrl: string,
    thumbnailVideoFieldIds: string
): Promise<CMSProjectRecord[]> {
    const cacheKey = `${collectionId}:${collectionModuleUrl}:${thumbnailVideoFieldIds}`
    const cached = cmsRecordCache.get(cacheKey)
    if (cached) return cached

    const pending = cmsRecordPromiseCache.get(cacheKey)
    if (pending) return pending

    const promise = (async () => {
        const moduleUrl = await resolveCMSModuleUrl(collectionId, collectionModuleUrl)
        if (!moduleUrl) return []

        const module = (await import(/* @vite-ignore */ moduleUrl)) as CMSModule
        initializeCMSModule(module)

        const collection = getCMSCollection(module)
        if (!collection) return []

        const items = (await collection.scanItems()) as CMSItem[]
        const records = items
            .map((item) => {
                const data = item.data
                const title = normalizeText(readField(data, FIELD_IDS.title))
                const slug =
                    normalizeSlug(readField(data, FIELD_IDS.slug)) || normalizeSlug(item.slug)

                return {
                    title,
                    slug,
                    thumbnailSrc: normalizeMediaSource(readField(data, FIELD_IDS.thumbnail)),
                    thumbnailVideoSrc: readFirstMediaField(data, thumbnailVideoFieldIds),
                    thumbnailStroke: normalizeBoolean(readField(data, FIELD_IDS.thumbnailStroke)),
                }
            })
            .filter((record) => record.title || record.slug)

        cmsRecordCache.set(cacheKey, records)
        return records
    })()

    cmsRecordPromiseCache.set(cacheKey, promise)
    return promise
}

function findCMSRecord(
    records: CMSProjectRecord[],
    title: string,
    href: string
): CMSProjectRecord | undefined {
    const slug = getSlugFromHref(href)
    const titleKey = normalizeTitleKey(title)

    return records.find((record) => {
        if (slug && normalizeSlug(record.slug).toLowerCase() === slug.toLowerCase()) return true
        return titleKey && normalizeTitleKey(record.title) === titleKey
    })
}

function useCMSRecord({
    enabled,
    collectionId,
    collectionModuleUrl,
    thumbnailVideoFieldIds,
    title,
    href,
}: {
    enabled: boolean
    collectionId: string
    collectionModuleUrl: string
    thumbnailVideoFieldIds: string
    title: string
    href: string
}) {
    const [record, setRecord] = React.useState<CMSProjectRecord | undefined>()

    React.useEffect(() => {
        if (!enabled || typeof window === "undefined") {
            setRecord(undefined)
            return
        }

        let disposed = false
        loadCMSRecords(collectionId, collectionModuleUrl, thumbnailVideoFieldIds)
            .then((records) => {
                if (!disposed) setRecord(findCMSRecord(records, title, href))
            })
            .catch(() => {
                if (!disposed) setRecord(undefined)
            })

        return () => {
            disposed = true
        }
    }, [enabled, collectionId, collectionModuleUrl, thumbnailVideoFieldIds, title, href])

    return record
}

/**
 * Restored template-style Other Projects card.
 *
 * @framerIntrinsicWidth 373.5
 * @framerIntrinsicHeight 250
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function OtherProjectCardRestored({
    title = "Title",
    sortingNumber = 0,
    projectLink = "",
    link = "#",
    thumbnailSrc = "",
    thumbnailVideoSrc = "",
    useCMS = true,
    collectionId = COLLECTION_ID,
    collectionModuleUrl = "",
    thumbnailVideoFieldIds = FIELD_IDS.thumbnailVideo,
    textColor = DEFAULT_TEXT_COLOR,
    strokeColor = DEFAULT_STROKE_COLOR,
}: Partial<Props>) {
    const titleText = String(title || "Title").toUpperCase()
    const numberText = Number.isFinite(Number(sortingNumber))
        ? String(Number(sortingNumber))
        : String(sortingNumber || "")
    const href = resolveProjectHref(projectLink, link, title)
    const cmsRecord = useCMSRecord({
        enabled: Boolean(useCMS),
        collectionId,
        collectionModuleUrl,
        thumbnailVideoFieldIds,
        title: String(title || ""),
        href,
    })
    const resolvedThumbnailSrc = cmsRecord?.thumbnailSrc || normalizeMediaSource(thumbnailSrc)
    const resolvedVideoSrc = cmsRecord?.thumbnailVideoSrc || normalizeMediaSource(thumbnailVideoSrc)
    const hasVideo = Boolean(resolvedVideoSrc)

    const handleClick = React.useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            if (!shouldHandleNavigation(event, href)) return

            event.preventDefault()
            event.stopPropagation()
            window.location.assign(new URL(href, window.location.href).href)
        },
        [href]
    )

    return (
        <a
            data-framer-name="Other Project Card"
            href={href}
            onClick={handleClick}
            aria-label={`${titleText} project`}
            className="mh-other-project-card"
            data-project-slug={cmsRecord?.slug || getSlugFromHref(href) || undefined}
            style={{ color: textColor }}
        >
            <style>{`
                .mh-other-project-card {
                    width: 100%;
                    height: auto;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: flex-start;
                    gap: 16px;
                    overflow: visible;
                    padding: 0;
                    text-decoration: none;
                    cursor: pointer;
                }

                .mh-other-project-title {
                    width: 100%;
                    min-height: ${TITLE_LINE_HEIGHT}px;
                    display: flex;
                    align-items: flex-start;
                    justify-content: flex-start;
                    gap: 5px;
                    overflow: visible;
                    font-family: "Azeret Mono", monospace;
                    font-size: 13px;
                    line-height: ${TITLE_LINE_HEIGHT}px;
                    letter-spacing: 0;
                    text-transform: uppercase;
                    white-space: nowrap;
                }

                .mh-other-project-title__number,
                .mh-other-project-title__slash {
                    flex: 0 0 auto;
                    line-height: ${TITLE_LINE_HEIGHT}px;
                }

                .mh-other-project-title__copy {
                    flex: 1 1 auto;
                    min-width: 0;
                    height: ${TITLE_LINE_HEIGHT}px;
                    overflow: hidden;
                }

                .mh-other-project-title__track {
                    display: flex;
                    flex-direction: column;
                    transform: translateY(0);
                    transition: transform ${HOVER_DURATION}ms ${HOVER_EASING};
                    will-change: transform;
                }

                .mh-other-project-title__line {
                    display: block;
                    height: ${TITLE_LINE_HEIGHT}px;
                    line-height: ${TITLE_LINE_HEIGHT}px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .mh-other-project-title__line--hover {
                    display: block;
                }

                .mh-other-project-card:hover .mh-other-project-title__track,
                .mh-other-project-card:focus-visible .mh-other-project-title__track,
                .mh-other-project-card:focus-within .mh-other-project-title__track {
                    transform: translateY(-${TITLE_LINE_HEIGHT}px);
                }

                .mh-other-project-media {
                    position: relative;
                    width: 100%;
                    aspect-ratio: ${THUMBNAIL_ASPECT_RATIO};
                    flex: none;
                    overflow: hidden;
                    background: transparent;
                    clip-path: inset(0);
                    contain: paint;
                    isolation: isolate;
                }

                .mh-other-project-media::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    z-index: 2;
                    pointer-events: none;
                    box-shadow: inset 0 0 0 1px var(--mh-other-project-stroke, ${DEFAULT_STROKE_COLOR});
                    opacity: 0;
                }

                .mh-other-project-media[data-thumbnail-stroke="true"]::after {
                    opacity: 1;
                }

                .mh-other-project-media img,
                .mh-other-project-media video {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    display: block;
                    object-fit: cover;
                    object-position: center;
                    scale: 1;
                    transform-origin: center center;
                    transition: scale ${HOVER_DURATION}ms ${HOVER_EASING};
                    backface-visibility: hidden;
                    will-change: scale;
                }

                .mh-other-project-card:hover .mh-other-project-media img,
                .mh-other-project-card:hover .mh-other-project-media video,
                .mh-other-project-card:focus-visible .mh-other-project-media img,
                .mh-other-project-card:focus-visible .mh-other-project-media video,
                .mh-other-project-card:focus-within .mh-other-project-media img,
                .mh-other-project-card:focus-within .mh-other-project-media video {
                    scale: 1.02;
                }

                .mh-other-project-media video {
                    pointer-events: none;
                    z-index: 1;
                }

                @media (max-width: 809px) {
                    ${SECTION_NEXT_PROJECT_SELECTOR} ${SECTION_HEADING_SELECTOR} {
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        justify-content: flex-start !important;
                        gap: 0px !important;
                    }

                    ${SECTION_NEXT_PROJECT_SELECTOR} ${NEXT_PROJECT_WRAPPER_SELECTOR} {
                        width: 100% !important;
                        box-sizing: border-box !important;
                        display: flex !important;
                        flex-direction: row !important;
                        flex-wrap: wrap !important;
                        align-items: flex-start !important;
                        justify-content: center !important;
                        gap: 20px !important;
                        padding: 0px 20px 0px 20px !important;
                        overflow: hidden !important;
                    }

                    ${SECTION_NEXT_PROJECT_SELECTOR} ${NEXT_PROJECT_WRAPPER_SELECTOR} > ${ALL_PROJECTS_SELECTOR} {
                        flex: 1 1 220px !important;
                        min-width: 220px !important;
                        max-width: none !important;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .mh-other-project-title__track,
                    .mh-other-project-media img,
                    .mh-other-project-media video {
                        transition: none;
                        will-change: auto;
                    }

                    .mh-other-project-card:hover .mh-other-project-title__track,
                    .mh-other-project-card:focus-visible .mh-other-project-title__track,
                    .mh-other-project-card:focus-within .mh-other-project-title__track {
                        transform: none;
                    }

                    .mh-other-project-card:hover .mh-other-project-media img,
                    .mh-other-project-card:hover .mh-other-project-media video,
                    .mh-other-project-card:focus-visible .mh-other-project-media img,
                    .mh-other-project-card:focus-visible .mh-other-project-media video,
                    .mh-other-project-card:focus-within .mh-other-project-media img,
                    .mh-other-project-card:focus-within .mh-other-project-media video {
                        scale: 1;
                    }
                }
            `}</style>
            <div data-framer-name="Title Wrapper" className="mh-other-project-title">
                <span className="mh-other-project-title__number">{numberText}</span>
                <span className="mh-other-project-title__slash">/</span>
                <span className="mh-other-project-title__copy">
                    <span className="mh-other-project-title__track">
                        <span className="mh-other-project-title__line">{titleText}</span>
                        <span className="mh-other-project-title__line mh-other-project-title__line--hover">
                            VIEW PROJECT
                        </span>
                    </span>
                </span>
            </div>
            <div
                data-framer-name="ImageWrapper"
                className="mh-other-project-media"
                data-thumbnail-stroke={cmsRecord?.thumbnailStroke ? "true" : undefined}
                style={
                    {
                        "--mh-other-project-stroke": strokeColor,
                    } as React.CSSProperties
                }
            >
                {resolvedThumbnailSrc ? (
                    <img
                        data-framer-name="Image"
                        src={resolvedThumbnailSrc}
                        alt=""
                        loading="lazy"
                        decoding="async"
                    />
                ) : null}
                {hasVideo ? (
                    <video
                        data-framer-name="Video"
                        src={resolvedVideoSrc}
                        poster={resolvedThumbnailSrc || undefined}
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="metadata"
                    />
                ) : null}
            </div>
        </a>
    )
}

addPropertyControls(OtherProjectCardRestored, {
    title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: "Title",
    },
    sortingNumber: {
        type: ControlType.Number,
        title: "Number",
        defaultValue: 0,
        min: 0,
        step: 1,
        displayStepper: true,
    },
    projectLink: {
        type: ControlType.Link,
        title: "Link",
    },
    link: {
        type: ControlType.Link,
        title: "Legacy Link",
        hidden: () => true,
    },
    thumbnailSrc: {
        type: ControlType.String,
        title: "Image URL",
        defaultValue: "",
    },
    thumbnailVideoSrc: {
        type: ControlType.String,
        title: "Video URL",
        defaultValue: "",
    },
    useCMS: {
        type: ControlType.Boolean,
        title: "Use CMS",
        defaultValue: true,
    },
    collectionId: {
        type: ControlType.String,
        title: "Collection",
        defaultValue: COLLECTION_ID,
        hidden: () => true,
    },
    collectionModuleUrl: {
        type: ControlType.String,
        title: "CMS Module",
        defaultValue: "",
        hidden: () => true,
    },
    thumbnailVideoFieldIds: {
        type: ControlType.String,
        title: "Video Field",
        defaultValue: FIELD_IDS.thumbnailVideo,
        hidden: () => true,
    },
    textColor: {
        type: ControlType.Color,
        title: "Text",
        defaultValue: DEFAULT_TEXT_COLOR,
    },
    strokeColor: {
        type: ControlType.Color,
        title: "Stroke",
        defaultValue: DEFAULT_STROKE_COLOR,
    },
})
