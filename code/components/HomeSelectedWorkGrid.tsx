import * as React from "react"
import * as Framer from "framer"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

type Props = {
    useCMS: boolean
    collectionId: string
    collectionModuleUrl: string
    sortFieldIds: string
    thumbnailVideoFieldIds: string
    tagFieldIds: string
    maxItems: number
    showTags: boolean
    textColor: string
    strokeColor: string
    tagColor: string
}

type CMSFieldValue = { value?: unknown }
type CMSItem = {
    data?: Record<string, CMSFieldValue | unknown>
    fieldData?: Record<string, CMSFieldValue | unknown>
    slug?: unknown
    [key: string]: unknown
}
type CMSCollection = { scanItems: () => Promise<CMSItem[]> }
type CMSCollectionExport = { collectionByLocaleId?: { default?: CMSCollection } }
type ResolvedCMSCollectionExport = { collectionByLocaleId: { default: CMSCollection } }
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
    category1?: string
    category2?: string
    category3?: string
    isHomepage?: boolean
}
type ImageValue = {
    src: string
    srcSet?: string
    alt?: string
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

const COLLECTION_ID = "yTHrQWMIY"
const KNOWN_CMS_MODULE_URLS: Record<string, string> = {
    yTHrQWMIY:
        "https://framerusercontent.com/sites/Qw9YlQnLg7aytImZPPgM1/yTHrQWMIY.C4v6sro0.mjs",
}
const FIELD_IDS = {
    title: "oeXZcmPna",
    slug: "pdXVG_fBO",
    number: "DLBifmgp1",
    thumbnail: "Jy7hBJady",
    thumbnailVideoLink: "SvOqFqdby",
    thumbnailStroke: "OHdUYs6Mo",
    category1: "kuvJcmOFr",
    category2: "VV1CggU2J",
    category3: "E6OpH0hSs",
    isHomepage: "myUIfK0j7",
} as const
const SNAPPY_EASE = "cubic-bezier(0.16, 1, 0.3, 1)"
const DEFAULT_SORT_FIELD_IDS = FIELD_IDS.number
const LIVE_SCAN_PATHS = [
    "/",
    "/case-studies",
]
const cmsModuleUrlCache = new Map<string, string>()
const DEFAULT_THUMBNAIL_VIDEO_FIELD_IDS = FIELD_IDS.thumbnailVideoLink
const DEFAULT_TAG_FIELD_IDS = [
    FIELD_IDS.category1,
    FIELD_IDS.category2,
    FIELD_IDS.category3,
].join("\n")

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function unwrapField(value: unknown): unknown {
    let current = value
    for (let index = 0; index < 5; index++) {
        if (current && typeof current === "object" && "value" in current) {
            current = (current as CMSFieldValue).value
            continue
        }
        break
    }
    return current
}

function readField(data: Record<string, CMSFieldValue | unknown> | undefined, fieldId: string) {
    return unwrapField(data?.[fieldId])
}

function normalizeText(value: unknown): string {
    return String(value ?? "").trim()
}

function normalizeTagText(value: unknown): string {
    return normalizeText(value).replace(/\s+/g, " ")
}

function hasCMSValue(value: unknown): boolean {
    if (value === null || value === undefined) return false
    if (typeof value === "string") return value.trim().length > 0
    return true
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

function readFirstField(
    data: Record<string, CMSFieldValue | unknown> | undefined,
    fieldIds: string
): unknown {
    for (const fieldId of splitFieldIds(fieldIds)) {
        const value = readField(data, fieldId)
        if (hasCMSValue(value)) return value
    }
    return undefined
}

function readTagFields(
    data: Record<string, CMSFieldValue | unknown> | undefined,
    fieldIds: string
): Pick<Project, "category1" | "category2" | "category3"> {
    const tags: string[] = []
    const seen = new Set<string>()

    for (const fieldId of splitFieldIds(fieldIds || DEFAULT_TAG_FIELD_IDS)) {
        const value = normalizeTagText(readField(data, fieldId))
        const key = value.toLowerCase()
        if (!value || seen.has(key)) continue
        seen.add(key)
        tags.push(value)
    }

    return {
        category1: tags[0] || "",
        category2: tags[1] || "",
        category3: tags[2] || "",
    }
}

function normalizeSlug(value: unknown): string {
    return normalizeText(value).replace(/^\/+|\/+$/g, "")
}

function normalizeNumber(value: unknown, fallback: number): number {
    if (!hasCMSValue(value)) return fallback
    const next = Number(value)
    return Number.isFinite(next) ? next : fallback
}

function normalizeBoolean(value: unknown): boolean {
    if (typeof value === "boolean") return value
    if (typeof value === "number") return value !== 0
    const text = normalizeText(value).toLowerCase()
    return text === "true" || text === "yes" || text === "1"
}

function addFramerImageCandidates(src: string, srcSet: string): string {
    if (!srcSet) return srcSet

    try {
        const url = new URL(src)
        if (
            url.hostname !== "framerusercontent.com" ||
            !url.pathname.startsWith("/images/")
        ) {
            return srcSet
        }

        const width = Number(url.searchParams.get("width"))
        const height = Number(url.searchParams.get("height"))
        const longestEdge = Math.max(width, height)
        if (
            !Number.isFinite(width) ||
            !Number.isFinite(height) ||
            width <= 0 ||
            height <= 0
        ) {
            return srcSet
        }

        const descriptors = new Set(
            srcSet
                .split(",")
                .map((candidate) => candidate.trim().split(/\s+/).pop())
                .filter(Boolean)
        )
        const candidates: string[] = []

        for (const maxEdge of [640, 672, 768, 1152, 1200]) {
            if (maxEdge >= longestEdge) continue
            const candidateWidth = Math.max(
                1,
                Math.round(width * (maxEdge / longestEdge))
            )
            const descriptor = `${candidateWidth}w`
            if (descriptors.has(descriptor)) continue

            const candidate = new URL(url.href)
            candidate.searchParams.set("scale-down-to", String(maxEdge))
            candidates.push(`${candidate.href} ${descriptor}`)
            descriptors.add(descriptor)
        }

        return candidates.length > 0
            ? `${srcSet}, ${candidates.join(", ")}`
            : srcSet
    } catch {
        return srcSet
    }
}

function normalizeImage(value: unknown): ImageValue | undefined {
    if (!value) return undefined
    if (typeof value === "string") return value ? { src: value } : undefined
    if (typeof value === "object") {
        const image = value as Record<string, unknown>
        const src = normalizeText(image.src || image.url)
        if (!src) return undefined
        const srcSet = normalizeText(image.srcSet)
        return {
            src,
            srcSet: srcSet
                ? addFramerImageCandidates(src, srcSet)
                : undefined,
            alt: normalizeText(image.alt) || undefined,
        }
    }
    return undefined
}

function isCMSModuleUrl(url: string, collectionId: string): boolean {
    const collectionPattern = escapeRegExp(collectionId)
    return new RegExp(
        `/${collectionPattern}(?:\\.[^/?#]+)?\\.(?:js|mjs)(?:[?#].*)?$`
    ).test(url)
}

function normalizeModuleUrl(url: string, baseUrl?: string): string | undefined {
    if (!url) return undefined
    let resolvedBaseUrl = baseUrl
    if (!resolvedBaseUrl && typeof document !== "undefined") {
        resolvedBaseUrl = document.baseURI
    }
    if (!resolvedBaseUrl && typeof window !== "undefined") {
        resolvedBaseUrl = window.location.href
    }

    try {
        return new URL(url, resolvedBaseUrl).href
    } catch {
        return undefined
    }
}

function findCMSModuleUrlInMarkup(
    markup: string,
    collectionId: string,
    baseUrl?: string
): string | undefined {
    const collectionPattern = escapeRegExp(collectionId)
    const absoluteMatch = markup.match(
        new RegExp(
            `https://framerusercontent\\.com/(?:sites|modules)/[^"']+/${collectionPattern}(?:\\.[^"'/]+)?\\.(?:js|mjs)`,
            "i"
        )
    )
    if (absoluteMatch?.[0]) return absoluteMatch[0]

    const relativeMatch = markup.match(
        new RegExp(
            `["'\`]((?:\\./|/)[^"'\`]*/?${collectionPattern}(?:\\.[^"'\`/]+)?\\.(?:js|mjs))["'\`]`,
            "i"
        )
    )
    return relativeMatch?.[1] ? normalizeModuleUrl(relativeMatch[1], baseUrl) : undefined
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
        return findCMSModuleUrlInMarkup(
            document.documentElement.outerHTML,
            collectionId,
            document.baseURI
        )
    }

    return undefined
}

function isScriptResourceUrl(url: string): boolean {
    return /\.(?:js|mjs)(?:[?#].*)?$/.test(url)
}

function getScriptSearchRank(url: string, collectionId: string): number {
    const lowerUrl = url.toLowerCase()
    const lowerCollectionId = collectionId.toLowerCase()
    if (lowerUrl.includes(`/${lowerCollectionId}`)) return 0
    if (lowerUrl.includes("/script_main.")) return 1
    if (lowerUrl.includes("framerusercontent.com/sites/")) return 2
    return 3
}

async function findCMSModuleUrlInLoadedScripts(collectionId: string): Promise<string | undefined> {
    const scriptUrls = getDocumentResourceUrls()
        .filter(isScriptResourceUrl)
        .sort(
            (a, b) =>
                getScriptSearchRank(a, collectionId) -
                getScriptSearchRank(b, collectionId)
        )

    for (const scriptUrl of scriptUrls) {
        try {
            const response = await fetch(scriptUrl, { credentials: "omit" })
            if (!response.ok) continue
            const found = findCMSModuleUrlInMarkup(
                await response.text(),
                collectionId,
                response.url || scriptUrl
            )
            if (found) return found
        } catch {
            // Some Framer/CDN resources are intentionally opaque in preview.
        }
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

    const inLoadedScripts = await findCMSModuleUrlInLoadedScripts(collectionId)
    if (inLoadedScripts) {
        cmsModuleUrlCache.set(collectionId, inLoadedScripts)
        return inLoadedScripts
    }

    const currentPath =
        typeof window !== "undefined" && window.location
            ? window.location.pathname || ""
            : ""
    const scanPaths = Array.from(
        new Set([currentPath, ...LIVE_SCAN_PATHS].filter(Boolean))
    )
    for (const path of scanPaths) {
        try {
            // no-store: read the freshly-served HTML so we resolve the current
            // published collection-module hash, not a superseded one from cache.
            const response = await fetch(path, {
                credentials: "same-origin",
                cache: "no-store",
            })
            if (!response.ok) continue
            const found = findCMSModuleUrlInMarkup(
                await response.text(),
                collectionId,
                response.url || path
            )
            if (found) {
                cmsModuleUrlCache.set(collectionId, found)
                return found
            }
        } catch {
            // Framer preview/canvas/public URLs can resolve from different origins.
        }
    }

    // Last-resort hardcoded pin. This is a *fixed* published hash that goes stale
    // on every republish, so it must rank below every live-discovery path above.
    // If it wins, the home grid loads an old collection version AND — because the
    // module lands in the shared session resource buffer — poisons the /index
    // resolver on a later client-side navigation.
    const knownModuleUrl = KNOWN_CMS_MODULE_URLS[collectionId]
    if (knownModuleUrl) {
        cmsModuleUrlCache.set(collectionId, knownModuleUrl)
        return knownModuleUrl
    }

    return undefined
}

function isCMSCollectionExport(value: unknown): value is ResolvedCMSCollectionExport {
    return (
        typeof value === "object" &&
        value !== null &&
        typeof (value as CMSCollectionExport).collectionByLocaleId?.default?.scanItems === "function"
    )
}

function getCMSCollection(module: CMSModule): CMSCollection | undefined {
    const candidates = [module.a, module.r, module.default, ...Object.values(module)]
    for (const candidate of candidates) {
        let resolved: unknown = candidate
        if (typeof candidate === "function") {
            try {
                resolved = (candidate as () => unknown)()
            } catch {
                continue
            }
        }

        if (isCMSCollectionExport(resolved)) return resolved.collectionByLocaleId.default
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

function sortProjects(projects: Project[]): Project[] {
    return [...projects].sort((a, b) => {
        return a.number - b.number || a.title.localeCompare(b.title)
    })
}

async function loadProjects(
    collectionId: string,
    collectionModuleUrl: string,
    sortFieldIds: string,
    thumbnailVideoFieldIds: string,
    tagFieldIds: string
): Promise<Project[]> {
    const moduleUrl = await resolveCMSModuleUrl(collectionId, collectionModuleUrl)
    if (!moduleUrl) return []

    const module = (await import(/* @vite-ignore */ moduleUrl)) as CMSModule
    initializeCMSModule(module)

    const collection = getCMSCollection(module)
    if (!collection) return []

    const items = (await collection.scanItems()) as CMSItem[]
    return items
        .map((item, index) => {
            const data = item.data || item.fieldData
            const slug = normalizeSlug(readField(data, FIELD_IDS.slug)) || normalizeSlug(item.slug)
            const title = normalizeText(readField(data, FIELD_IDS.title))
            const sortValue = readFirstField(data, sortFieldIds) ?? readField(data, FIELD_IDS.number)
            return {
                title,
                number: normalizeNumber(sortValue, index + 1),
                slug,
                thumbnail: normalizeImage(readField(data, FIELD_IDS.thumbnail)),
                thumbnailVideoLink: readFirstMediaField(data, thumbnailVideoFieldIds),
                thumbnailStroke: normalizeBoolean(readField(data, FIELD_IDS.thumbnailStroke)),
                ...readTagFields(data, tagFieldIds),
                isHomepage: normalizeBoolean(readField(data, FIELD_IDS.isHomepage)),
            }
        })
        .filter((project) => project.title && project.slug)
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms))
}

async function loadProjectsWithRetry(
    collectionId: string,
    collectionModuleUrl: string,
    sortFieldIds: string,
    thumbnailVideoFieldIds: string,
    tagFieldIds: string
): Promise<Project[]> {
    let latest: Project[] = []

    for (let attempt = 0; attempt < 4; attempt++) {
        latest = await loadProjects(
            collectionId,
            collectionModuleUrl,
            sortFieldIds,
            thumbnailVideoFieldIds,
            tagFieldIds
        )
        if (latest.length > 0 || attempt === 3) return latest

        cmsModuleUrlCache.delete(collectionId)
        await delay(180 * (attempt + 1))
    }

    return latest
}

function getVisibleProjects(projects: Project[], maxItems: number): Project[] {
    if (projects.length === 0) return []
    const homepage = projects.filter((project) => project.isHomepage)
    return sortProjects(homepage.length > 0 ? homepage : projects).slice(0, maxItems)
}

function getProjectHref(project: Project): string {
    return `/case-studies/${project.slug}`
}

function getThumbnailVideoLink(project: Project): string {
    return normalizeMediaSource(project.thumbnailVideoLink)
}

function getProjectTags(project: Project): string[] {
    const tags: string[] = []
    const seen = new Set<string>()

    for (const raw of [project.category1, project.category2, project.category3]) {
        const value = normalizeTagText(raw)
        const key = value.toLowerCase()
        if (!value || seen.has(key)) continue
        seen.add(key)
        tags.push(value)
    }

    return tags
}

function isCanvasTarget(): boolean {
    try {
        return RenderTarget.current() === RenderTarget.canvas
    } catch {
        return false
    }
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

function preloadFramerRoute(router: FramerRouter | undefined, href: string) {
    const match = getFramerRouteMatch(router, href)
    if (!match) return

    try {
        router?.routes?.[match.routeId]?.page?.preload?.()
    } catch {
        // Preload is opportunistic; navigation can still handle the route.
    }
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

function shouldHandleRouteClick(event: React.MouseEvent<HTMLAnchorElement>, href: string): boolean {
    return !(
        isCanvasTarget() ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !href ||
        href === "#"
    )
}

function useFramerRouter(): FramerRouter | undefined {
    const maybeUseRouter = (Framer as unknown as { useRouter?: () => FramerRouter }).useRouter
    return typeof maybeUseRouter === "function" ? maybeUseRouter() : undefined
}

function ProjectCard({
    project,
    showTags,
    priority,
}: {
    project: Project
    showTags: boolean
    priority: boolean
}) {
    const router = useFramerRouter()
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const href = getProjectHref(project)
    const videoSrc = getThumbnailVideoLink(project)
    const hasVideo = Boolean(videoSrc)
    const imageSrc = project.thumbnail?.src || ""
    const imageSrcSet = project.thumbnail?.srcSet || ""
    const hasImage = Boolean(imageSrc)
    const hasMedia = hasVideo || Boolean(imageSrc)
    const mediaKey = hasVideo
        ? `video:${videoSrc}:${imageSrc}:${imageSrcSet}`
        : hasImage
          ? `image:${imageSrc}:${imageSrcSet}`
          : ""
    const [posterReady, setPosterReady] = React.useState(false)
    const [posterFailed, setPosterFailed] = React.useState(false)
    const [videoReady, setVideoReady] = React.useState(false)
    const [videoFailed, setVideoFailed] = React.useState(false)
    const [isNearViewport, setIsNearViewport] = React.useState(isCanvas)
    const [isVideoVisible, setIsVideoVisible] = React.useState(isCanvas)
    const [shouldLoadVideo, setShouldLoadVideo] = React.useState(isCanvas)
    const mediaRef = React.useRef<HTMLDivElement>(null)
    const videoRef = React.useRef<HTMLVideoElement | null>(null)
    const mediaAlt = project.thumbnail?.alt || project.title
    const tags = showTags ? getProjectTags(project) : []
    const hasReadyMedia = (hasVideo && videoReady) || (hasImage && posterReady)
    const hasFailedMedia = (!hasVideo || videoFailed) && (!hasImage || posterFailed)

    React.useEffect(() => {
        setPosterReady(false)
        setPosterFailed(false)
        setVideoReady(false)
        setVideoFailed(false)
    }, [mediaKey])

    React.useEffect(() => {
        if (!hasVideo || isCanvas) {
            setIsNearViewport(isCanvas)
            setIsVideoVisible(isCanvas)
            setShouldLoadVideo(isCanvas)
            return
        }

        const media = mediaRef.current
        if (!media || typeof IntersectionObserver === "undefined") {
            setIsNearViewport(true)
            setIsVideoVisible(true)
            setShouldLoadVideo(true)
            return
        }

        const mountObserver = new IntersectionObserver(
            ([entry]) => {
                const near = Boolean(entry?.isIntersecting)
                setIsNearViewport(near)
                if (near) setShouldLoadVideo(true)
            },
            {
                rootMargin: "50% 0px",
                threshold: 0.01,
            }
        )
        const visibilityObserver = new IntersectionObserver(
            ([entry]) => {
                setIsVideoVisible(Boolean(entry?.isIntersecting))
            },
            { threshold: 0.01 }
        )

        mountObserver.observe(media)
        visibilityObserver.observe(media)
        return () => {
            mountObserver.disconnect()
            visibilityObserver.disconnect()
        }
    }, [hasVideo, isCanvas, mediaKey])

    React.useEffect(() => {
        const video = videoRef.current
        if (!video || !shouldLoadVideo) return

        if (!isVideoVisible) {
            video.pause()
            return
        }

        video.muted = true
        const play = video.play()
        if (play && typeof play.catch === "function") {
            play.catch(() => {})
        }
    }, [isVideoVisible, shouldLoadVideo])

    const handleImageRef = React.useCallback(
        (image: HTMLImageElement | null) => {
            if (image?.complete && image.naturalWidth > 0) setPosterReady(true)
        },
        []
    )

    React.useEffect(() => {
        if (videoRef.current?.readyState && videoRef.current.readyState >= 2) {
            setVideoReady(true)
        }
    }, [mediaKey, shouldLoadVideo])

    const handleClick = React.useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            if (!shouldHandleRouteClick(event, href)) return

            const match = getFramerRouteMatch(router, href)
            if (!match) return

            event.preventDefault()
            event.stopPropagation()

            if (!navigateFramerRoute(router, match)) {
                const url = getSameOriginUrl(href)
                if (url) window.location.assign(url.href)
            }
        },
        [href, router]
    )

    const handleWarmRoute = React.useCallback(() => {
        preloadFramerRoute(router, href)
    }, [href, router])

    return (
        <a
            className="selected-work-card"
            href={href}
            onClick={handleClick}
            onFocus={handleWarmRoute}
            onMouseEnter={handleWarmRoute}
            aria-label={`${project.title} case study`}
        >
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
                ref={mediaRef}
                className="selected-work-media"
                data-has-media={hasMedia ? "true" : undefined}
                data-has-video={hasVideo ? "true" : undefined}
                data-video-mounted={shouldLoadVideo ? "true" : undefined}
                data-video-near={isNearViewport ? "true" : undefined}
                data-video-visible={isVideoVisible ? "true" : undefined}
                data-has-poster={hasImage ? "true" : undefined}
                data-media-ready={hasReadyMedia ? "true" : undefined}
                data-media-failed={hasFailedMedia ? "true" : undefined}
                data-video-ready={videoReady ? "true" : undefined}
                data-video-failed={videoFailed ? "true" : undefined}
                data-poster-ready={posterReady ? "true" : undefined}
                data-thumbnail-stroke={project.thumbnailStroke ? "true" : undefined}
            >
                {imageSrc ? (
                    <img
                        ref={handleImageRef}
                        className="selected-work-poster"
                        src={imageSrc}
                        srcSet={project.thumbnail?.srcSet}
                        alt={mediaAlt}
                        decoding="async"
                        loading={priority ? "eager" : "lazy"}
                        fetchPriority={priority ? "high" : "auto"}
                        sizes="(max-width: 809px) calc(100vw - 40px), calc(50vw - 30px)"
                        onError={() => setPosterFailed(true)}
                        onLoad={() => {
                            setPosterReady(true)
                            setPosterFailed(false)
                        }}
                    />
                ) : null}
                {hasVideo && shouldLoadVideo ? (
                    <video
                        ref={videoRef}
                        className="selected-work-video"
                        src={videoSrc}
                        autoPlay={isVideoVisible}
                        muted
                        loop
                        onCanPlay={() => {
                            setVideoReady(true)
                            setVideoFailed(false)
                        }}
                        onPlaying={() => {
                            setVideoReady(true)
                            setVideoFailed(false)
                        }}
                        onError={() => {
                            setVideoReady(false)
                            setVideoFailed(true)
                        }}
                        onLoadedData={() => {
                            setVideoReady(true)
                            setVideoFailed(false)
                        }}
                        playsInline
                        preload="none"
                    />
                ) : null}
            </div>
            {tags.length > 0 ? (
                <div
                    className="selected-work-tags"
                    aria-label={`${project.title} services`}
                >
                    {tags.map((tag) => (
                        <span className="selected-work-tag" key={tag}>
                            <span className="selected-work-tag-text">{tag}</span>
                        </span>
                    ))}
                </div>
            ) : null}
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
    sortFieldIds = DEFAULT_SORT_FIELD_IDS,
    thumbnailVideoFieldIds = DEFAULT_THUMBNAIL_VIDEO_FIELD_IDS,
    tagFieldIds = DEFAULT_TAG_FIELD_IDS,
    maxItems = 6,
    showTags = true,
    textColor = "rgb(35, 51, 36)",
    strokeColor = "rgb(151, 151, 151)",
    tagColor = "rgb(151, 151, 151)",
}: Partial<Props>) {
    const [projects, setProjects] = React.useState<Project[]>([])
    const [cmsSettled, setCmsSettled] = React.useState(!useCMS)

    React.useEffect(() => {
        if (!useCMS || typeof window === "undefined") {
            setProjects([])
            setCmsSettled(true)
            return
        }

        let disposed = false
        setCmsSettled(false)
        loadProjectsWithRetry(
            collectionId,
            collectionModuleUrl,
            sortFieldIds,
            thumbnailVideoFieldIds,
            tagFieldIds
        )
            .then((loaded) => {
                if (!disposed) {
                    setProjects(loaded)
                    setCmsSettled(true)
                }
            })
            .catch(() => {
                if (!disposed) {
                    setProjects([])
                    setCmsSettled(true)
                }
            })

        return () => {
            disposed = true
        }
    }, [
        useCMS,
        collectionId,
        collectionModuleUrl,
        sortFieldIds,
        thumbnailVideoFieldIds,
        tagFieldIds,
    ])

    const itemLimit = Math.max(1, Math.floor(Number(maxItems) || 6))
    const visibleProjects = React.useMemo(
        () => getVisibleProjects(projects, itemLimit),
        [projects, itemLimit]
    )
    const reserveLoadingLayout =
        Boolean(useCMS) && !cmsSettled && visibleProjects.length === 0

    return (
        <div
            className="selected-work-grid"
            aria-busy={reserveLoadingLayout ? true : undefined}
            style={
                {
                    "--selected-work-text": textColor,
                    "--selected-work-stroke": strokeColor,
                    "--selected-work-tag": tagColor || strokeColor,
                } as React.CSSProperties
            }
        >
            {reserveLoadingLayout
                ? Array.from({ length: itemLimit }, (_, index) => (
                      <div
                          aria-hidden="true"
                          className="selected-work-card selected-work-card-placeholder"
                          key={`selected-work-placeholder-${index}`}
                      >
                          <div className="selected-work-card-meta">
                              <span>00</span>
                              <span>/</span>
                              <span>Placeholder</span>
                          </div>
                          <div className="selected-work-media" />
                          {showTags ? (
                              <div className="selected-work-tags">
                                  <span className="selected-work-tag">
                                      Placeholder
                                  </span>
                              </div>
                          ) : null}
                      </div>
                  ))
                : null}
            {visibleProjects.map((project, index) => (
                <ProjectCard
                    key={project.slug}
                    project={project}
                    showTags={showTags}
                    priority={index === 0}
                />
            ))}
            <style suppressHydrationWarning>{`
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

                .selected-work-card-placeholder {
                    pointer-events: none;
                    user-select: none;
                    visibility: hidden;
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
                    transition: transform 420ms ${SNAPPY_EASE};
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

                .selected-work-media[data-has-media="true"]::before {
                    background: var(--selected-work-stroke);
                    content: "";
                    inset: 0;
                    opacity: 1;
                    pointer-events: none;
                    position: absolute;
                    transition: opacity 360ms ${SNAPPY_EASE};
                    z-index: 0;
                }

                .selected-work-media[data-media-ready="true"]::before {
                    opacity: 0;
                }

                .selected-work-media[data-media-failed="true"]::before {
                    opacity: 1;
                }

                .selected-work-media[data-thumbnail-stroke="true"]::after {
                    border: 1px solid var(--selected-work-stroke);
                    box-sizing: border-box;
                    content: "";
                    inset: 0;
                    pointer-events: none;
                    position: absolute;
                    z-index: 2;
                }

                .selected-work-media img,
                .selected-work-media video {
                    display: block;
                    height: 100%;
                    object-fit: cover;
                    left: 50%;
                    max-width: none;
                    opacity: 0;
                    position: absolute;
                    top: 0;
                    transform: translateX(-50%) scale(1);
                    transition:
                        opacity 420ms ${SNAPPY_EASE},
                        transform 420ms ${SNAPPY_EASE};
                    width: 101%;
                }

                .selected-work-media img {
                    z-index: 1;
                }

                .selected-work-media video {
                    z-index: 2;
                }

                .selected-work-media[data-poster-ready="true"] img,
                .selected-work-media:not([data-has-video="true"])[data-media-ready="true"] img {
                    opacity: 1;
                }

                .selected-work-media[data-has-video="true"][data-video-ready="true"] img,
                .selected-work-media[data-media-failed="true"] img {
                    opacity: 0;
                }

                .selected-work-media[data-has-video="true"][data-video-ready="true"] video {
                    opacity: 1;
                }

                .selected-work-media[data-has-video="true"][data-video-failed="true"][data-poster-ready="true"] img {
                    opacity: 1;
                }

                .selected-work-media[data-has-video="true"][data-video-failed="true"] video,
                .selected-work-media[data-media-failed="true"] video {
                    opacity: 0;
                }

                .selected-work-card:hover .selected-work-media img,
                .selected-work-card:focus-visible .selected-work-media img,
                .selected-work-card:hover .selected-work-media video,
                .selected-work-card:focus-visible .selected-work-media video {
                    transform: translateX(-50%) scale(1.02);
                }

                .selected-work-tags {
                    align-items: flex-start;
                    color: var(--selected-work-tag);
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    min-width: 0;
                    width: 100%;
                }

                .selected-work-tag {
                    align-items: center;
                    border: 1px solid var(--selected-work-tag);
                    border-radius: 250px;
                    box-sizing: border-box;
                    color: var(--selected-work-tag);
                    display: inline-flex;
                    flex: 0 1 auto;
                    font-family: "GT Standard Mono Trial", "GT Standard Mono", "Azeret Mono", monospace;
                    font-size: 13px;
                    font-weight: 400;
                    justify-content: center;
                    letter-spacing: 0;
                    line-height: 1;
                    max-width: 100%;
                    min-height: 24px;
                    min-width: 0;
                    padding: 5px 10px 6px;
                    text-transform: uppercase;
                }

                .selected-work-tag-text {
                    display: block;
                    min-width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                @media (max-width: 1199px) {
                    .selected-work-tags {
                        gap: 5px;
                    }

                    .selected-work-tag {
                        font-size: 12px;
                        min-height: 23px;
                        padding: 5px 9px 6px;
                    }
                }

                :is([data-framer-name="Section About"], [name="Section About"])
                :is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"]) {
                    clip-path: inset(0);
                    contain: paint;
                    isolation: isolate;
                    overflow: hidden !important;
                }

                :is([data-framer-name="Section About"], [name="Section About"])
                :is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"])
                :is([data-framer-name="Image"], [name="Image"]) {
                    backface-visibility: hidden;
                    transform: scale(1) !important;
                    transform-origin: center center;
                    transition: transform 420ms ${SNAPPY_EASE} !important;
                    will-change: transform;
                }

                :is([data-framer-name="Section About"], [name="Section About"])
                :is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"])
                :is([data-framer-name="Image"], [name="Image"]) img {
                    transform: none !important;
                    transition: none !important;
                }

                :is([data-framer-name="Section About"], [name="Section About"])
                :is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"]):hover
                :is([data-framer-name="Image"], [name="Image"]),
                :is([data-framer-name="Section About"], [name="Section About"])
                :is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"]):focus-visible
                :is([data-framer-name="Image"], [name="Image"]),
                :is([data-framer-name="Section About"], [name="Section About"])
                :is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"]):focus-within
                :is([data-framer-name="Image"], [name="Image"]),
                :is([data-framer-name="Section About"], [name="Section About"]):has(:is([data-framer-name="Text Link Black"], [name="Text Link Black"], [data-framer-name="TextLinkBlack"], [name="TextLinkBlack"], [data-framer-name="Text Link Black Hover"], [name="Text Link Black Hover"], [data-framer-name="TextLinkBlackHover"], [name="TextLinkBlackHover"]):hover)
                :is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"])
                :is([data-framer-name="Image"], [name="Image"]),
                :is([data-framer-name="Section About"], [name="Section About"]):has(:is([data-framer-name="Text Link Black"], [name="Text Link Black"], [data-framer-name="TextLinkBlack"], [name="TextLinkBlack"], [data-framer-name="Text Link Black Hover"], [name="Text Link Black Hover"], [data-framer-name="TextLinkBlackHover"], [name="TextLinkBlackHover"]):focus-within)
                :is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"])
                :is([data-framer-name="Image"], [name="Image"]),
                :is([data-framer-name="Section About"], [name="Section About"]):has(:is([data-framer-name="Button Wrapper"], [name="Button Wrapper"], [data-framer-name="ButtonWrapper"], [name="ButtonWrapper"]):hover)
                :is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"])
                :is([data-framer-name="Image"], [name="Image"]),
                :is([data-framer-name="Section About"], [name="Section About"]):has(:is([data-framer-name="Button Wrapper"], [name="Button Wrapper"], [data-framer-name="ButtonWrapper"], [name="ButtonWrapper"]):focus-within)
                :is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"])
                :is([data-framer-name="Image"], [name="Image"]) {
                    transform: scale(1.02) !important;
                }

                :is([data-framer-name="Section About"], [name="Section About"])
                :is([data-framer-name="Text Link Black"], [name="Text Link Black"], [data-framer-name="TextLinkBlack"], [name="TextLinkBlack"], [data-framer-name="Text Link Black Hover"], [name="Text Link Black Hover"], [data-framer-name="TextLinkBlackHover"], [name="TextLinkBlackHover"]) > * {
                    display: flex !important;
                    flex-direction: column !important;
                    transform: translateY(0);
                    transition: transform 420ms ${SNAPPY_EASE} !important;
                    will-change: transform;
                }

                :is([data-framer-name="Section About"], [name="Section About"]):has(:is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"]):hover)
                :is([data-framer-name="Text Link Black"], [name="Text Link Black"], [data-framer-name="TextLinkBlack"], [name="TextLinkBlack"], [data-framer-name="Text Link Black Hover"], [name="Text Link Black Hover"], [data-framer-name="TextLinkBlackHover"], [name="TextLinkBlackHover"]) > *,
                :is([data-framer-name="Section About"], [name="Section About"]):has(:is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"]):focus-visible)
                :is([data-framer-name="Text Link Black"], [name="Text Link Black"], [data-framer-name="TextLinkBlack"], [name="TextLinkBlack"], [data-framer-name="Text Link Black Hover"], [name="Text Link Black Hover"], [data-framer-name="TextLinkBlackHover"], [name="TextLinkBlackHover"]) > *,
                :is([data-framer-name="Section About"], [name="Section About"]):has(:is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"]):focus-within)
                :is([data-framer-name="Text Link Black"], [name="Text Link Black"], [data-framer-name="TextLinkBlack"], [name="TextLinkBlack"], [data-framer-name="Text Link Black Hover"], [name="Text Link Black Hover"], [data-framer-name="TextLinkBlackHover"], [name="TextLinkBlackHover"]) > *,
                :is([data-framer-name="Section About"], [name="Section About"]):has(:is([data-framer-name="Button Wrapper"], [name="Button Wrapper"], [data-framer-name="ButtonWrapper"], [name="ButtonWrapper"]):hover)
                :is([data-framer-name="Text Link Black"], [name="Text Link Black"], [data-framer-name="TextLinkBlack"], [name="TextLinkBlack"], [data-framer-name="Text Link Black Hover"], [name="Text Link Black Hover"], [data-framer-name="TextLinkBlackHover"], [name="TextLinkBlackHover"]) > *,
                :is([data-framer-name="Section About"], [name="Section About"]):has(:is([data-framer-name="Button Wrapper"], [name="Button Wrapper"], [data-framer-name="ButtonWrapper"], [name="ButtonWrapper"]):focus-within)
                :is([data-framer-name="Text Link Black"], [name="Text Link Black"], [data-framer-name="TextLinkBlack"], [name="TextLinkBlack"], [data-framer-name="Text Link Black Hover"], [name="Text Link Black Hover"], [data-framer-name="TextLinkBlackHover"], [name="TextLinkBlackHover"]) > *,
                :is([data-framer-name="Section About"], [name="Section About"])
                :is([data-framer-name="Text Link Black"], [name="Text Link Black"], [data-framer-name="TextLinkBlack"], [name="TextLinkBlack"], [data-framer-name="Text Link Black Hover"], [name="Text Link Black Hover"], [data-framer-name="TextLinkBlackHover"], [name="TextLinkBlackHover"]):hover > *,
                :is([data-framer-name="Section About"], [name="Section About"])
                :is([data-framer-name="Text Link Black"], [name="Text Link Black"], [data-framer-name="TextLinkBlack"], [name="TextLinkBlack"], [data-framer-name="Text Link Black Hover"], [name="Text Link Black Hover"], [data-framer-name="TextLinkBlackHover"], [name="TextLinkBlackHover"]):focus-within > * {
                    transform: translateY(-13px) !important;
                }

                @media (max-width: 809px) {
                    .selected-work-grid {
                        grid-template-columns: minmax(0, 1fr);
                    }

                    .selected-work-tags {
                        gap: 5px;
                    }

                    .selected-work-tag {
                        font-size: 11px;
                        min-height: 21px;
                        padding: 4px 8px 5px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .selected-work-title-stack,
                    .selected-work-media[data-has-media="true"]::before,
                    .selected-work-media img,
                    .selected-work-media video,
                    :is([data-framer-name="Section About"], [name="Section About"])
                    :is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"])
                    :is([data-framer-name="Image"], [name="Image"]),
                    :is([data-framer-name="Section About"], [name="Section About"])
                    :is([data-framer-name="Text Link Black"], [name="Text Link Black"], [data-framer-name="TextLinkBlack"], [name="TextLinkBlack"], [data-framer-name="Text Link Black Hover"], [name="Text Link Black Hover"], [data-framer-name="TextLinkBlackHover"], [name="TextLinkBlackHover"]) > * {
                        transition: none;
                    }

                    .selected-work-card:hover .selected-work-title-stack,
                    .selected-work-card:focus-visible .selected-work-title-stack {
                        transform: translateY(0);
                    }

                    .selected-work-card:hover .selected-work-media img,
                    .selected-work-card:focus-visible .selected-work-media img,
                    .selected-work-card:hover .selected-work-media video,
                    .selected-work-card:focus-visible .selected-work-media video {
                        transform: translateX(-50%) scale(1);
                    }

                    :is([data-framer-name="Section About"], [name="Section About"])
                    :is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"]):hover
                    :is([data-framer-name="Image"], [name="Image"]),
                    :is([data-framer-name="Section About"], [name="Section About"])
                    :is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"]):focus-visible
                    :is([data-framer-name="Image"], [name="Image"]),
                    :is([data-framer-name="Section About"], [name="Section About"])
                    :is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"]):focus-within
                    :is([data-framer-name="Image"], [name="Image"]),
                    :is([data-framer-name="Section About"], [name="Section About"]):has(:is([data-framer-name="Text Link Black"], [name="Text Link Black"], [data-framer-name="TextLinkBlack"], [name="TextLinkBlack"], [data-framer-name="Text Link Black Hover"], [name="Text Link Black Hover"], [data-framer-name="TextLinkBlackHover"], [name="TextLinkBlackHover"]):hover)
                    :is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"])
                    :is([data-framer-name="Image"], [name="Image"]),
                    :is([data-framer-name="Section About"], [name="Section About"]):has(:is([data-framer-name="Text Link Black"], [name="Text Link Black"], [data-framer-name="TextLinkBlack"], [name="TextLinkBlack"], [data-framer-name="Text Link Black Hover"], [name="Text Link Black Hover"], [data-framer-name="TextLinkBlackHover"], [name="TextLinkBlackHover"]):focus-within)
                    :is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"])
                    :is([data-framer-name="Image"], [name="Image"]),
                    :is([data-framer-name="Section About"], [name="Section About"]):has(:is([data-framer-name="Button Wrapper"], [name="Button Wrapper"], [data-framer-name="ButtonWrapper"], [name="ButtonWrapper"]):hover)
                    :is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"])
                    :is([data-framer-name="Image"], [name="Image"]),
                    :is([data-framer-name="Section About"], [name="Section About"]):has(:is([data-framer-name="Button Wrapper"], [name="Button Wrapper"], [data-framer-name="ButtonWrapper"], [name="ButtonWrapper"]):focus-within)
                    :is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"])
                    :is([data-framer-name="Image"], [name="Image"]) {
                        transform: scale(1) !important;
                    }

                    :is([data-framer-name="Section About"], [name="Section About"]):has(:is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"]):hover)
                    :is([data-framer-name="Text Link Black"], [name="Text Link Black"], [data-framer-name="TextLinkBlack"], [name="TextLinkBlack"], [data-framer-name="Text Link Black Hover"], [name="Text Link Black Hover"], [data-framer-name="TextLinkBlackHover"], [name="TextLinkBlackHover"]) > *,
                    :is([data-framer-name="Section About"], [name="Section About"]):has(:is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"]):focus-visible)
                    :is([data-framer-name="Text Link Black"], [name="Text Link Black"], [data-framer-name="TextLinkBlack"], [name="TextLinkBlack"], [data-framer-name="Text Link Black Hover"], [name="Text Link Black Hover"], [data-framer-name="TextLinkBlackHover"], [name="TextLinkBlackHover"]) > *,
                    :is([data-framer-name="Section About"], [name="Section About"]):has(:is([data-framer-name="Image Wrapper"], [name="Image Wrapper"], [data-framer-name="ImageWrapper"], [name="ImageWrapper"], [data-framer-name="Column Image"], [name="Column Image"], [data-framer-name="ColumnImage"], [name="ColumnImage"]):focus-within)
                    :is([data-framer-name="Text Link Black"], [name="Text Link Black"], [data-framer-name="TextLinkBlack"], [name="TextLinkBlack"], [data-framer-name="Text Link Black Hover"], [name="Text Link Black Hover"], [data-framer-name="TextLinkBlackHover"], [name="TextLinkBlackHover"]) > *,
                    :is([data-framer-name="Section About"], [name="Section About"]):has(:is([data-framer-name="Button Wrapper"], [name="Button Wrapper"], [data-framer-name="ButtonWrapper"], [name="ButtonWrapper"]):hover)
                    :is([data-framer-name="Text Link Black"], [name="Text Link Black"], [data-framer-name="TextLinkBlack"], [name="TextLinkBlack"], [data-framer-name="Text Link Black Hover"], [name="Text Link Black Hover"], [data-framer-name="TextLinkBlackHover"], [name="TextLinkBlackHover"]) > *,
                    :is([data-framer-name="Section About"], [name="Section About"]):has(:is([data-framer-name="Button Wrapper"], [name="Button Wrapper"], [data-framer-name="ButtonWrapper"], [name="ButtonWrapper"]):focus-within)
                    :is([data-framer-name="Text Link Black"], [name="Text Link Black"], [data-framer-name="TextLinkBlack"], [name="TextLinkBlack"], [data-framer-name="Text Link Black Hover"], [name="Text Link Black Hover"], [data-framer-name="TextLinkBlackHover"], [name="TextLinkBlackHover"]) > *,
                    :is([data-framer-name="Section About"], [name="Section About"])
                    :is([data-framer-name="Text Link Black"], [name="Text Link Black"], [data-framer-name="TextLinkBlack"], [name="TextLinkBlack"], [data-framer-name="Text Link Black Hover"], [name="Text Link Black Hover"], [data-framer-name="TextLinkBlackHover"], [name="TextLinkBlackHover"]):hover > *,
                    :is([data-framer-name="Section About"], [name="Section About"])
                    :is([data-framer-name="Text Link Black"], [name="Text Link Black"], [data-framer-name="TextLinkBlack"], [name="TextLinkBlack"], [data-framer-name="Text Link Black Hover"], [name="Text Link Black Hover"], [data-framer-name="TextLinkBlackHover"], [name="TextLinkBlackHover"]):focus-within > * {
                        transform: translateY(0) !important;
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
        placeholder: "Optional CMS module URL",
    },
    sortFieldIds: {
        type: ControlType.String,
        title: "Sort Fields",
        defaultValue: DEFAULT_SORT_FIELD_IDS,
        placeholder: "Sorting Number field ID",
        displayTextArea: true,
    },
    thumbnailVideoFieldIds: {
        type: ControlType.String,
        title: "Video Fields",
        defaultValue: DEFAULT_THUMBNAIL_VIDEO_FIELD_IDS,
        placeholder: "Thumbnail Video field ID",
        displayTextArea: true,
    },
    tagFieldIds: {
        type: ControlType.String,
        title: "Tag Fields",
        defaultValue: DEFAULT_TAG_FIELD_IDS,
        placeholder: "Category field IDs",
        displayTextArea: true,
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
    showTags: {
        type: ControlType.Boolean,
        title: "Show Tags",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
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
    tagColor: {
        type: ControlType.Color,
        title: "Tags",
        defaultValue: "rgb(151, 151, 151)",
    },
})
