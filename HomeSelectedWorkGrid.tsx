import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Props = {
    useCMS: boolean
    collectionId: string
    collectionModuleUrl: string
    maxItems: number
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
type Project = {
    title: string
    number: number
    slug: string
    thumbnail?: ImageValue
    thumbnailVideoLink?: string
    thumbnailStroke?: boolean
    isHomepage?: boolean
}
type ImageValue = {
    src: string
    srcSet?: string
    alt?: string
}

const COLLECTION_ID = "yTHrQWMIY"
const FIELD_IDS = {
    title: "oeXZcmPna",
    slug: "pdXVG_fBO",
    number: "DLBifmgp1",
    thumbnail: "Jy7hBJady",
    thumbnailVideoLink: "WG62tRjG8",
    thumbnailStroke: "OHdUYs6Mo",
    isHomepage: "myUIfK0j7",
} as const
const LIVE_SCAN_PATHS = [
    "/",
    "/case-studies",
    "https://khaki-ship-257706.framer.app/",
    "https://khaki-ship-257706.framer.app/case-studies",
]
const cmsModuleUrlCache = new Map<string, string>()
const DEFAULT_PROJECTS: Project[] = [
    {
        title: "AirPods Pro 3",
        number: 1,
        slug: "airpods",
        thumbnail: {
            src: "https://framerusercontent.com/images/JITjBIRyOd5DdC7juV7X5RwU9I.jpg",
        },
        thumbnailVideoLink:
            "https://freight.cargo.site/i/V2732716404789921262344304055829/AirPods-Pro-3-Introduction-1.mp4",
        thumbnailStroke: true,
        isHomepage: true,
    },
    {
        title: "Simon & Schuster",
        number: 2,
        slug: "simon-schuster",
        thumbnail: {
            src: "https://framerusercontent.com/images/ZViKn9ASVVsE90tOfnWU7sW0U.png",
        },
        isHomepage: true,
    },
    {
        title: "Gaia",
        number: 3,
        slug: "gaia",
        thumbnail: {
            src: "https://framerusercontent.com/images/oCdgMnyGzAZv1HcI8JKkYeNiSVk.png",
        },
        isHomepage: true,
    },
    {
        title: "National Park Playing Cards",
        number: 4,
        slug: "national-park-cards",
        thumbnail: {
            src: "https://framerusercontent.com/images/YdGKidrUlzOXfODfaQNqfCx5dM.png",
        },
        isHomepage: true,
    },
    {
        title: "Motion Connect 2025",
        number: 5,
        slug: "motion-connect-2025",
        thumbnail: {
            src: "https://framerusercontent.com/images/W592y16ERqrZ1qFuxRe3dcsv8I.jpg",
        },
        thumbnailVideoLink:
            "https://freight.cargo.site/i/K2717924145885630584799912777237/Motion-Connect_1.mp4",
        isHomepage: true,
    },
    {
        title: "Yomo",
        number: 6,
        slug: "yomo",
        thumbnail: {
            src: "https://framerusercontent.com/images/PXsrzy7ezkkjSfUrVHhUuP2sk4k.jpg",
        },
        isHomepage: true,
    },
]

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

function normalizeSlug(value: unknown): string {
    return normalizeText(value).replace(/^\/+|\/+$/g, "")
}

function normalizeNumber(value: unknown, fallback: number): number {
    const next = Number(value)
    return Number.isFinite(next) && next > 0 ? next : fallback
}

function normalizeBoolean(value: unknown): boolean {
    if (typeof value === "boolean") return value
    if (typeof value === "number") return value !== 0
    const text = normalizeText(value).toLowerCase()
    return text === "true" || text === "yes" || text === "1"
}

function normalizeImage(value: unknown): ImageValue | undefined {
    if (!value) return undefined
    if (typeof value === "string") return value ? { src: value } : undefined
    if (typeof value === "object") {
        const image = value as Record<string, unknown>
        const src = normalizeText(image.src || image.url)
        if (!src) return undefined
        return {
            src,
            srcSet: normalizeText(image.srcSet) || undefined,
            alt: normalizeText(image.alt) || undefined,
        }
    }
    return undefined
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
            // Framer preview/canvas/public URLs can resolve from different origins.
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
    const collectionExport = candidates.find(isCMSCollectionExport)
    return collectionExport?.collectionByLocaleId?.default
}

function initializeCMSModule(module: CMSModule) {
    const maybeInitializers = [module.t, module.r, module.default, ...Object.values(module)]

    try {
        maybeInitializers.forEach((initializer) => {
            if (typeof initializer === "function") initializer()
        })
    } catch {
        // Generated Framer CMS modules may already be initialized.
    }
}

function sortProjects(projects: Project[]): Project[] {
    return [...projects].sort((a, b) => {
        return a.number - b.number || a.title.localeCompare(b.title)
    })
}

async function loadProjects(collectionId: string, collectionModuleUrl: string): Promise<Project[]> {
    const moduleUrl = await resolveCMSModuleUrl(collectionId, collectionModuleUrl)
    if (!moduleUrl) return []

    const module = (await import(/* @vite-ignore */ moduleUrl)) as CMSModule
    initializeCMSModule(module)

    const collection = getCMSCollection(module)
    if (!collection) return []

    const items = (await collection.scanItems()) as CMSItem[]
    return items
        .map((item, index) => {
            const data = item.data
            const slug = normalizeSlug(readField(data, FIELD_IDS.slug)) || normalizeSlug(item.slug)
            const title = normalizeText(readField(data, FIELD_IDS.title))
            return {
                title,
                number: normalizeNumber(readField(data, FIELD_IDS.number), index + 1),
                slug,
                thumbnail: normalizeImage(readField(data, FIELD_IDS.thumbnail)),
                thumbnailVideoLink: normalizeText(readField(data, FIELD_IDS.thumbnailVideoLink)),
                thumbnailStroke: normalizeBoolean(readField(data, FIELD_IDS.thumbnailStroke)),
                isHomepage: normalizeBoolean(readField(data, FIELD_IDS.isHomepage)),
            }
        })
        .filter((project) => project.title && project.slug)
}

function getVisibleProjects(projects: Project[], maxItems: number): Project[] {
    const source = projects.length > 0 ? projects : DEFAULT_PROJECTS
    const homepage = source.filter((project) => project.isHomepage)
    return sortProjects(homepage.length > 0 ? homepage : source).slice(0, maxItems)
}

function getProjectHref(project: Project): string {
    return `/case-studies/${project.slug}`
}

function ProjectCard({
    project,
}: {
    project: Project
}) {
    const href = getProjectHref(project)
    const hasVideo = Boolean(project.thumbnailVideoLink)
    const mediaAlt = project.thumbnail?.alt || project.title

    return (
        <a className="selected-work-card" href={href} aria-label={`${project.title} case study`}>
            <div className="selected-work-card-meta">
                <span className="selected-work-card-number">{project.number}</span>
                <span aria-hidden="true">/</span>
                <span className="selected-work-title-frame">
                    <span className="selected-work-title-stack">
                        <span>{project.title}</span>
                        <span aria-hidden="true">VIEW PROJECT</span>
                    </span>
                </span>
            </div>
            <div
                className="selected-work-media"
                data-thumbnail-stroke={project.thumbnailStroke ? "true" : undefined}
            >
                {hasVideo ? (
                    <video
                        src={project.thumbnailVideoLink}
                        poster={project.thumbnail?.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                    />
                ) : project.thumbnail?.src ? (
                    <img
                        src={project.thumbnail.src}
                        srcSet={project.thumbnail.srcSet}
                        alt={mediaAlt}
                        loading="lazy"
                    />
                ) : null}
            </div>
        </a>
    )
}

/**
 * Selected Work grid driven by the All Projects CMS collection.
 *
 * @framerIntrinsicWidth 1160
 * @framerIntrinsicHeight 790
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function HomeSelectedWorkGrid({
    useCMS = true,
    collectionId = COLLECTION_ID,
    collectionModuleUrl = "",
    maxItems = 6,
    textColor = "rgb(35, 51, 36)",
    strokeColor = "rgb(151, 151, 151)",
}: Partial<Props>) {
    const [projects, setProjects] = React.useState<Project[]>(DEFAULT_PROJECTS)

    React.useEffect(() => {
        if (!useCMS || typeof window === "undefined") {
            setProjects(DEFAULT_PROJECTS)
            return
        }

        let disposed = false
        loadProjects(collectionId, collectionModuleUrl)
            .then((loaded) => {
                if (!disposed && loaded.length > 0) setProjects(loaded)
            })
            .catch(() => {
                if (!disposed) setProjects(DEFAULT_PROJECTS)
            })

        return () => {
            disposed = true
        }
    }, [useCMS, collectionId, collectionModuleUrl])

    const visibleProjects = React.useMemo(
        () => getVisibleProjects(projects, Math.max(1, Math.floor(Number(maxItems) || 6))),
        [projects, maxItems]
    )

    return (
        <div
            className="selected-work-grid"
            style={
                {
                    "--selected-work-text": textColor,
                    "--selected-work-stroke": strokeColor,
                } as React.CSSProperties
            }
        >
            {visibleProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
            ))}
            <style>{`
                .selected-work-grid {
                    display: grid;
                    gap: 50px 20px;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    width: 100%;
                }

                .selected-work-card {
                    color: var(--selected-work-text);
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    min-width: 0;
                    text-decoration: none;
                }

                .selected-work-card-meta {
                    align-items: start;
                    color: var(--selected-work-text);
                    display: grid;
                    font-family: "GT Standard Mono Trial", "GT Standard Mono", "Azeret Mono", monospace;
                    font-size: 13px;
                    font-weight: 400;
                    grid-template-columns: 24px 11px minmax(0, 1fr);
                    letter-spacing: 0;
                    line-height: 100%;
                    min-height: 13px;
                    overflow: hidden;
                    text-transform: uppercase;
                    white-space: nowrap;
                    width: 100%;
                }

                .selected-work-title-frame {
                    display: block;
                    height: 13px;
                    min-width: 0;
                    overflow: hidden;
                }

                .selected-work-title-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    transform: translateY(0);
                    transition: transform 420ms cubic-bezier(.22, 1, .36, 1);
                }

                .selected-work-card:hover .selected-work-title-stack,
                .selected-work-card:focus-visible .selected-work-title-stack {
                    transform: translateY(-18px);
                }

                .selected-work-media {
                    aspect-ratio: 1.777 / 1;
                    display: block;
                    overflow: hidden;
                    position: relative;
                    width: 100%;
                }

                .selected-work-media[data-thumbnail-stroke="true"]::after {
                    border: 1px solid var(--selected-work-stroke);
                    box-sizing: border-box;
                    content: "";
                    inset: 0;
                    pointer-events: none;
                    position: absolute;
                    z-index: 1;
                }

                .selected-work-media img,
                .selected-work-media video {
                    display: block;
                    height: 100%;
                    object-fit: cover;
                    left: 50%;
                    max-width: none;
                    position: absolute;
                    top: 0;
                    transform: translateX(-50%) scale(1);
                    transition: transform 420ms cubic-bezier(.22, 1, .36, 1);
                    width: 101%;
                }

                .selected-work-card:hover .selected-work-media img,
                .selected-work-card:focus-visible .selected-work-media img,
                .selected-work-card:hover .selected-work-media video,
                .selected-work-card:focus-visible .selected-work-media video {
                    transform: translateX(-50%) scale(1.02);
                }

                @media (max-width: 809px) {
                    .selected-work-grid {
                        grid-template-columns: minmax(0, 1fr);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .selected-work-title-stack,
                    .selected-work-media img,
                    .selected-work-media video {
                        transition: none;
                    }

                    .selected-work-card:hover .selected-work-title-stack,
                    .selected-work-card:focus-visible .selected-work-title-stack {
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    )
}

addPropertyControls(HomeSelectedWorkGrid, {
    useCMS: {
        type: ControlType.Boolean,
        title: "Use CMS",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    collectionId: {
        type: ControlType.String,
        title: "Collection",
        defaultValue: COLLECTION_ID,
    },
    collectionModuleUrl: {
        type: ControlType.String,
        title: "Module URL",
        defaultValue: "",
        placeholder: "Optional fallback",
    },
    maxItems: {
        type: ControlType.Number,
        title: "Max Items",
        defaultValue: 6,
        min: 1,
        max: 12,
        step: 1,
        displayStepper: true,
    },
    textColor: {
        type: ControlType.Color,
        title: "Text",
        defaultValue: "rgb(35, 51, 36)",
    },
    strokeColor: {
        type: ControlType.Color,
        title: "Stroke",
        defaultValue: "rgb(151, 151, 151)",
    },
})
