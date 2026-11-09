import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
// Framer resolves this module URL to the project's card component at bundle
// time. Refresh this pin when the shared card implementation changes.
// @ts-ignore
import OtherProjectCardRestored from "https://framer.com/m/OtherProjectCardRestored-tjEcQr.js@HDV1gDpNYjzVWggvXh2q"

/**
 * Next Projects Section
 *
 * Drop-in "Other Projects" grid for case-study pages. Instead of hand-picking
 * three cards per page, this looks up the current project's "Sorting Number" in
 * the All Projects CMS, sorts every project by that number, and renders the
 * next N in sequence (wrapping past the end). So a project with order #2
 * automatically shows #3, #4, #5 — and editing the CMS order updates every
 * case study at once.
 *
 * IMPORTANT — set `currentSlug` per page (e.g. "gaia"). Framer statically
 * renders each case study as its own HTML file, and at that server render there
 * is no window/URL to detect which page we're on. Without the prop the server
 * renders the first N projects and the client then swaps to the correct set
 * after mount — a visible relabel/flash plus a hydration mismatch, and the
 * current project can list itself. The prop is read on BOTH server and client,
 * so the correct next-N renders immediately with no flip. (If the prop is left
 * blank it still self-heals on the client via window.location as a fallback.)
 *
 * It renders the existing OtherProjectCardRestored for each card, so thumbnails,
 * hover video, stroke, and the flip-title interaction are identical to before.
 *
 * FALLBACK_RECORDS is a baked snapshot of the collection order so the section
 * renders correct content on the server and on the very first client paint —
 * and never blanks even if the runtime CMS scan is unavailable in a given
 * bundle. When the live scan succeeds it transparently replaces the snapshot,
 * so CMS reordering still flows through. Keep the snapshot in sync when adding
 * or reordering projects.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 260
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */

const COLLECTION_ID = "yTHrQWMIY"
const FIELD_IDS = {
    title: "oeXZcmPna",
    slug: "pdXVG_fBO",
    order: "DLBifmgp1",
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
const DEFAULT_TEXT_COLOR = "rgb(35, 51, 36)"
const DEFAULT_STROKE_COLOR = "rgb(151, 151, 151)"

type Props = {
    count: number
    gap: number
    textColor: string
    strokeColor: string
    currentSlug: string
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
type ProjectRecord = {
    title: string
    slug: string
    order: number
    thumbnailSrc: string
    thumbnailVideoSrc: string
    thumbnailStroke: boolean
}

// Snapshot of published All Projects records, including media. The canvas
// cannot always resolve the generated CMS module, so cards need usable media
// on first paint. A successful live scan remains authoritative.
const FALLBACK_RECORDS: ProjectRecord[] = [
    {
        "title": "Gaia",
        "slug": "gaia",
        "order": 1,
        "thumbnailSrc": "https://framerusercontent.com/images/I8gYcpaNfASGUI6TqjkW8OpxW8I.png",
        "thumbnailVideoSrc": "https://framerusercontent.com/assets/UbkFFOnZrDDwQdrF7N6r3CEjeo.mp4",
        "thumbnailStroke": false
    },
    {
        "title": "AirPods Pro 3",
        "slug": "airpods",
        "order": 2,
        "thumbnailSrc": "https://framerusercontent.com/images/JITjBIRyOd5DdC7juV7X5RwU9I.jpg",
        "thumbnailVideoSrc": "https://framerusercontent.com/assets/VrXHwbJMGEUusCn1OzkDuUYE4FE.mp4",
        "thumbnailStroke": true
    },
    {
        "title": "Peak Energy",
        "slug": "peak-energy",
        "order": 3,
        "thumbnailSrc": "https://framerusercontent.com/images/JcoGr4ds2RlrOT9CCbYE5gnkvpY.jpg",
        "thumbnailVideoSrc": "https://framerusercontent.com/assets/h3NSQj4n1g74pvOIvpgW19h1Qk.mp4",
        "thumbnailStroke": false
    },
    {
        "title": "Motion Connect 2025",
        "slug": "motion-connect-2025",
        "order": 4,
        "thumbnailSrc": "https://framerusercontent.com/images/W592y16ERqrZ1qFuxRe3dcsv8I.jpg",
        "thumbnailVideoSrc": "https://framerusercontent.com/assets/MwQgxBbaiEE9PyqwTShCkltEUY.mp4",
        "thumbnailStroke": false
    },
    {
        "title": "Simon & Schuster",
        "slug": "simon-schuster",
        "order": 5,
        "thumbnailSrc": "https://framerusercontent.com/images/ZViKn9ASVVsE90tOfnWU7sW0U.png",
        "thumbnailVideoSrc": "",
        "thumbnailStroke": false
    },
    {
        "title": "National Park Playing Cards",
        "slug": "national-park-cards",
        "order": 6,
        "thumbnailSrc": "https://framerusercontent.com/images/YdGKidrUlzOXfODfaQNqfCx5dM.png",
        "thumbnailVideoSrc": "",
        "thumbnailStroke": false
    },
    {
        "title": "Yomo",
        "slug": "yomo",
        "order": 7,
        "thumbnailSrc": "https://framerusercontent.com/images/PXsrzy7ezkkjSfUrVHhUuP2sk4k.jpg",
        "thumbnailVideoSrc": "",
        "thumbnailStroke": false
    },
    {
        "title": "Highland Harvests",
        "slug": "highland-harvests",
        "order": 8,
        "thumbnailSrc": "https://framerusercontent.com/images/jJW0KifU2kfkhlHdh7akkmu0XU.jpg",
        "thumbnailVideoSrc": "",
        "thumbnailStroke": false
    },
    {
        "title": "Weaponized Innocence",
        "slug": "weaponized-innocence",
        "order": 9,
        "thumbnailSrc": "https://framerusercontent.com/images/BRh73XzVlRBoYNh03pKXVIYYPw.png",
        "thumbnailVideoSrc": "",
        "thumbnailStroke": false
    },
    {
        "title": "Wolff Olins x ArtCenter",
        "slug": "wolff-olins-x-artcenter",
        "order": 10,
        "thumbnailSrc": "https://framerusercontent.com/images/8fV7L1MlzeOAlHSxXchHzUHO7c.jpg",
        "thumbnailVideoSrc": "",
        "thumbnailStroke": true
    },
    {
        "title": "Cellular Symphony",
        "slug": "cellular-symphony",
        "order": 11,
        "thumbnailSrc": "https://framerusercontent.com/images/j9uS8SZ6aEBOUihZfXOWVeSrVs8.jpg",
        "thumbnailVideoSrc": "https://framerusercontent.com/assets/EFH57Xrk0gMJ5lTzBoOuGYJqifI.m4v",
        "thumbnailStroke": false
    },
    {
        "title": "Seek Truth",
        "slug": "seek-truth",
        "order": 12,
        "thumbnailSrc": "https://framerusercontent.com/images/ZUrXNdcJocPWJF6jCmu0QBr2yEs.webp",
        "thumbnailVideoSrc": "https://framerusercontent.com/assets/6kI8ukCrbvBwM7zCO08wjY5pyo.mp4",
        "thumbnailStroke": true
    },
    {
        "title": "Independent Lens",
        "slug": "independent-lens",
        "order": 13,
        "thumbnailSrc": "https://framerusercontent.com/images/xgjosOS16LZVpd3huScx2lW1g.jpg",
        "thumbnailVideoSrc": "",
        "thumbnailStroke": false
    },
    {
        "title": "TYPLDN",
        "slug": "typldn",
        "order": 14,
        "thumbnailSrc": "https://framerusercontent.com/images/jchJlOWt16iY8J0NEXEfm3G8cTE.png",
        "thumbnailVideoSrc": "",
        "thumbnailStroke": false
    },
    {
        "title": "WhatsApp",
        "slug": "whatsapp",
        "order": 17,
        "thumbnailSrc": "https://framerusercontent.com/images/mkLySgu9nIi7dlpTac2Q3InIU.png",
        "thumbnailVideoSrc": "",
        "thumbnailStroke": false
    },
    {
        "title": "Caliper Sans",
        "slug": "caliper",
        "order": 18,
        "thumbnailSrc": "https://framerusercontent.com/images/03ONMMvWNiSZ9RkcgL2UNqKiYQE.png",
        "thumbnailVideoSrc": "",
        "thumbnailStroke": true
    }
]

const moduleUrlCache = new Map<string, string>()
const recordsCache = new Map<string, ProjectRecord[]>()
const recordsPromiseCache = new Map<string, Promise<ProjectRecord[]>>()

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

function normalizeSlug(value: unknown): string {
    return normalizeText(value).replace(/^\/+|\/+$/g, "")
}

function sortRecords(records: ProjectRecord[]): ProjectRecord[] {
    return [...records].sort((a, b) => a.order - b.order)
}

function isCMSModuleUrl(url: string, collectionId: string): boolean {
    const collectionPattern = escapeRegExp(collectionId)
    return new RegExp(`/${collectionPattern}(?:\\.[^/?#]+)?\\.(?:js|mjs)(?:[?#].*)?$`).test(url)
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
        document.querySelectorAll<HTMLLinkElement | HTMLScriptElement>("link[href], script[src]")
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

async function resolveCMSModuleUrl(collectionId: string): Promise<string | undefined> {
    const cached = moduleUrlCache.get(collectionId)
    if (cached) return cached

    const inDocument = findCMSModuleUrlInDocument(collectionId)
    if (inDocument) {
        moduleUrlCache.set(collectionId, inDocument)
        return inDocument
    }

    for (const path of LIVE_SCAN_PATHS) {
        try {
            const response = await fetch(path, { credentials: "same-origin" })
            if (!response.ok) continue
            const found = findCMSModuleUrlInMarkup(await response.text(), collectionId)
            if (found) {
                moduleUrlCache.set(collectionId, found)
                return found
            }
        } catch {
            // Preview / canvas / public URLs can resolve from different origins.
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

async function loadProjectRecords(collectionId: string): Promise<ProjectRecord[]> {
    const cached = recordsCache.get(collectionId)
    if (cached) return cached

    const pending = recordsPromiseCache.get(collectionId)
    if (pending) return pending

    const promise = (async () => {
        try {
            const moduleUrl = await resolveCMSModuleUrl(collectionId)
            if (!moduleUrl) return sortRecords(FALLBACK_RECORDS)

            const module = (await import(/* @vite-ignore */ moduleUrl)) as CMSModule
            initializeCMSModule(module)

            const collection = getCMSCollection(module)
            if (!collection) return sortRecords(FALLBACK_RECORDS)

            const items = (await collection.scanItems()) as CMSItem[]
            const records = items
                .map((item) => {
                    const data = item.data
                    const orderRaw = Number(readField(data, FIELD_IDS.order))
                    const slug =
                        normalizeSlug(readField(data, FIELD_IDS.slug)) ||
                        normalizeSlug(item.slug)
                    return {
                        title: normalizeText(readField(data, FIELD_IDS.title)),
                        slug,
                        order: Number.isFinite(orderRaw) ? orderRaw : Number.POSITIVE_INFINITY,
                        thumbnailSrc: normalizeMediaSource(readField(data, FIELD_IDS.thumbnail)),
                        thumbnailVideoSrc: normalizeMediaSource(readField(data, FIELD_IDS.thumbnailVideo)),
                        thumbnailStroke: normalizeBoolean(readField(data, FIELD_IDS.thumbnailStroke)),
                    }
                })
                .filter((record) => record.slug)

            // Scan produced nothing usable — keep the baked snapshot rather
            // than render an empty section.
            const resolved = records.length > 0 ? sortRecords(records) : sortRecords(FALLBACK_RECORDS)
            recordsCache.set(collectionId, resolved)
            return resolved
        } catch {
            return sortRecords(FALLBACK_RECORDS)
        }
    })()

    recordsPromiseCache.set(collectionId, promise)
    return promise
}

function resolveCurrentSlug(explicitSlug: string): string {
    const explicit = normalizeSlug(explicitSlug)
    if (explicit) return explicit
    if (typeof window === "undefined") return ""
    const match = window.location.pathname.match(/\/case-studies\/([^/?#]+)/)
    return normalizeSlug(match?.[1])
}

function pickNextRecords(records: ProjectRecord[], currentSlug: string, count: number): ProjectRecord[] {
    if (records.length === 0 || count <= 0) return []

    const currentIndex = records.findIndex(
        (record) => record.slug.toLowerCase() === currentSlug.toLowerCase()
    )

    // Unknown current page (server render without the currentSlug prop): fall
    // back to the lowest-order N. The client re-render corrects this once the
    // URL is known, but setting the currentSlug prop avoids that flip entirely.
    if (currentIndex === -1) return records.slice(0, count)

    const next: ProjectRecord[] = []
    const total = records.length
    for (let step = 1; step <= count && step < total; step += 1) {
        next.push(records[(currentIndex + step) % total])
    }
    return next
}

function useNextProjects(explicitSlug: string, count: number): ProjectRecord[] {
    const currentSlug = resolveCurrentSlug(explicitSlug)
    // Seed with the cached live records if present, otherwise the baked
    // snapshot — so the section renders correct content on first paint (incl.
    // SSR) and never flashes empty.
    const [records, setRecords] = React.useState<ProjectRecord[]>(
        () => recordsCache.get(COLLECTION_ID) ?? sortRecords(FALLBACK_RECORDS)
    )

    React.useEffect(() => {
        if (typeof window === "undefined") return
        let disposed = false
        loadProjectRecords(COLLECTION_ID)
            .then((loaded) => {
                if (!disposed && loaded.length > 0) setRecords(loaded)
            })
            .catch(() => {
                // Keep whatever we already have (baked snapshot).
            })
        return () => {
            disposed = true
        }
    }, [])

    return React.useMemo(
        () => pickNextRecords(records, currentSlug, count),
        [records, currentSlug, count]
    )
}

export default function NextProjectsSection(props: Partial<Props>) {
    const count = Math.max(1, Math.round(Number(props.count ?? 3)))
    const gap = Number.isFinite(Number(props.gap)) ? Number(props.gap) : 20
    const textColor = props.textColor || DEFAULT_TEXT_COLOR
    const strokeColor = props.strokeColor || DEFAULT_STROKE_COLOR
    const currentSlug = props.currentSlug || ""

    const nextProjects = useNextProjects(currentSlug, count)

    const Card = OtherProjectCardRestored as unknown as React.ComponentType<Record<string, unknown>>

    return (
        <>
            <style suppressHydrationWarning>{`
                .mh-next-projects-row {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    align-items: flex-start;
                    justify-content: center;
                    width: 100%;
                    box-sizing: border-box;
                }

                .mh-next-projects-col {
                    flex: 1 1 220px;
                    min-width: 220px;
                    max-width: none;
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                }
            `}</style>
            <div
                data-framer-name="NextProjectsSection"
                className="mh-next-projects-row"
                style={{ gap }}
            >
                {nextProjects.map((project) => (
                    <div
                        key={project.slug}
                        data-framer-name="AllProjects"
                        className="mh-next-projects-col"
                    >
                        <Card
                            title={project.title}
                            sortingNumber={project.order}
                            projectLink={`/case-studies/${project.slug}`}
                            thumbnailSrc={project.thumbnailSrc}
                            thumbnailVideoSrc={project.thumbnailVideoSrc}
                            thumbnailStroke={project.thumbnailStroke}
                            useCMS
                            collectionId={COLLECTION_ID}
                            thumbnailVideoFieldIds={FIELD_IDS.thumbnailVideo}
                            textColor={textColor}
                            strokeColor={strokeColor}
                        />
                    </div>
                ))}
            </div>
        </>
    )
}

NextProjectsSection.defaultProps = {
    count: 3,
    gap: 20,
    textColor: DEFAULT_TEXT_COLOR,
    strokeColor: DEFAULT_STROKE_COLOR,
    currentSlug: "",
} as Partial<Props>

addPropertyControls(NextProjectsSection, {
    currentSlug: {
        type: ControlType.String,
        title: "Page Slug",
        defaultValue: "",
        placeholder: "e.g. gaia — set to THIS page's slug",
    },
    count: {
        type: ControlType.Number,
        title: "Count",
        defaultValue: 3,
        min: 1,
        max: 6,
        step: 1,
        displayStepper: true,
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        defaultValue: 20,
        min: 0,
        max: 80,
        step: 1,
        unit: "px",
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

NextProjectsSection.displayName = "Next Projects Section"
