import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import { addPropertyControls, ControlType } from "framer"

// Shared registry the ProjectRegistrar code component writes into. State is
// shared via a window-level singleton (identified by REGISTRY_KEY) so the two
// code files don't have to import from each other. ProjectRegistrar instances
// live inside a Framer Collection List placed anywhere on the canvas. Keep that
// list mounted, then move it visually out of sight; using Framer's hidden/eye
// toggle unmounts it and stops registration. Each registrar calls register()
// with one CMS row, and IndexPage subscribes when its Use CMS prop is on.
const REGISTRY_KEY = "__articaIndexProjectsRegistry"
const HIDDEN_CMS_LINK_SELECTOR = '[data-framer-name="CmsLink"], [name="CmsLink"]'
const HIDDEN_CMS_INTERACTIVE_SELECTOR = 'a[href], [role="link"], [tabindex]'
const HIDDEN_CMS_LINK_INERT_ATTR = "data-index-hidden-cms-link-inert"

type RegistryShape = {
    items: Map<string, Record<string, unknown>>
    listeners: Set<(items: Map<string, Record<string, unknown>>) => void>
    register: (id: string, data: Record<string, unknown>) => void
    unregister: (id: string) => void
    subscribe: (
        fn: (items: Map<string, Record<string, unknown>>) => void
    ) => () => void
}

function getRegistry(): RegistryShape | null {
    if (typeof window === "undefined") return null
    const w = window as unknown as Record<string, RegistryShape>
    if (!w[REGISTRY_KEY]) {
        const items = new Map<string, Record<string, unknown>>()
        const listeners = new Set<
            (items: Map<string, Record<string, unknown>>) => void
        >()
        w[REGISTRY_KEY] = {
            items,
            listeners,
            register(id, data) {
                items.set(id, data)
                listeners.forEach((fn) => fn(items))
            },
            unregister(id) {
                items.delete(id)
                listeners.forEach((fn) => fn(items))
            },
            subscribe(fn) {
                listeners.add(fn)
                fn(items)
                return () => {
                    listeners.delete(fn)
                }
            },
        }
    }
    return w[REGISTRY_KEY]
}

function preventHiddenCMSLinkClick(event: MouseEvent) {
    const target = event.target
    if (!(target instanceof Element)) return
    if (!target.closest(`[${HIDDEN_CMS_LINK_INERT_ATTR}="true"]`)) return

    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
}

function inertHiddenCMSLinks(): number {
    if (typeof document === "undefined") return 0

    let count = 0
    document.querySelectorAll<HTMLElement>(HIDDEN_CMS_LINK_SELECTOR).forEach((container) => {
        container.setAttribute("aria-hidden", "true")

        container
            .querySelectorAll<HTMLElement>(HIDDEN_CMS_INTERACTIVE_SELECTOR)
            .forEach((element) => {
                if (element.getAttribute(HIDDEN_CMS_LINK_INERT_ATTR) !== "true") {
                    element.addEventListener("click", preventHiddenCMSLinkClick, true)
                }
                element.setAttribute("tabindex", "-1")
                element.setAttribute("aria-hidden", "true")
                element.setAttribute(HIDDEN_CMS_LINK_INERT_ATTR, "true")
                count += 1
            })
    })

    return count
}

function useHiddenCMSLinkInerting(enabled: boolean) {
    useEffect(() => {
        if (!enabled || typeof window === "undefined") return

        let frame = 0
        const timeouts: number[] = []

        const run = () => {
            window.cancelAnimationFrame(frame)
            frame = window.requestAnimationFrame(inertHiddenCMSLinks)
        }

        run()
        ;[100, 350, 900, 1800, 3200].forEach((delay) => {
            timeouts.push(window.setTimeout(run, delay))
        })

        const observer = new MutationObserver(run)
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["href", "role", "tabindex", "data-framer-name", "name"],
            childList: true,
            subtree: true,
        })

        return () => {
            window.cancelAnimationFrame(frame)
            timeouts.forEach((timeout) => window.clearTimeout(timeout))
            observer.disconnect()
        }
    }, [enabled])
}

const INDEX_GRID_GAP = "var(--idx-grid-gap, 20px)"
const INDEX_GRID_TEMPLATE = "repeat(6, minmax(0, 1fr))"
const VIEW_TOGGLE_OPTIONS = ["grid", "list"] as const
const INDEX_APPEAR_PRESET = {
    durationMs: 620,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    ruleDurationMs: 2200,
    ruleEasing: "cubic-bezier(0.33, 0, 0.67, 1)",
    staggerMs: 70,
    maxStaggerIndex: 12,
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.01,
} as const
const INDEX_MASK_REVEAL_PRESET = {
    durationMs: 1500,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    baseDelayMs: 100,
    staggerMs: 70,
    distancePx: 90,
} as const

const indexGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: INDEX_GRID_TEMPLATE,
    columnGap: INDEX_GRID_GAP,
    width: "100%",
}

const DEFAULT_TOKENS = {
    textPrimary: "#26211f",
    textSecondary: "#141414",
    textTertiary: "#979797",
    bg: "#F7F5F0",
    dividerStrong: "#141414",
    dividerSubtle: "#141414",
    surfaceOverlay: "rgba(215, 213, 207, 0.72)",
    surfaceActive: "#EAE8E3",
    fontDisplay: "'GT Standard Trial', 'Inter', sans-serif",
    fontHeading: "'GT Standard Trial', 'Inter', sans-serif",
    fontProjectCta:
        "'GT Standard', 'GT Standard L Regular', 'GT Standard Trial', 'Inter', sans-serif",
    fontMono: "'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace",
}

// Mutable copy that IndexPage rewrites from props on every render so the
// module-scope sub-components and the global CSS template see the live
// values without needing to thread tokens through every prop.
const tokens: Record<keyof typeof DEFAULT_TOKENS, string> = { ...DEFAULT_TOKENS }

type Project = {
    title: string
    category1: string
    category2?: string
    category3?: string
    industry: string
    year: number | string
    thumbnail?: string
    thumbnailVideoLink?: string
    thumbnailStroke?: boolean
    slug?: string
    sortOrder?: number
    isHomepage?: boolean
}

type CMSFieldValue = { value?: unknown }
type CMSItem = {
    data?: Record<string, CMSFieldValue | unknown>
    slug?: unknown
    [key: string]: unknown
}
type CMSCollection = {
    scanItems: () => Promise<CMSItem[]>
}
type CMSCollectionExport = {
    collectionByLocaleId?: {
        default?: CMSCollection
    }
}
type CMSModule = {
    a?: CMSCollectionExport
    r?: CMSCollectionExport | (() => unknown)
    t?: () => unknown
    default?: CMSCollectionExport | (() => unknown)
    [key: string]: unknown
}

type Filters = {
    disciplines: string[]
    industries: string[]
    years: number[]
}

type FilterType = "disciplines" | "industries" | "years"

type ListHoverVariant = "flip" | "highlight"
type AdvancedSettings = {
    defaultView?: string
    listHoverVariant?: ListHoverVariant
    textPrimary?: string
    textSecondary?: string
    textTertiary?: string
    bg?: string
    dividerStrong?: string
    dividerSubtle?: string
    surfaceActive?: string
}

const TAXONOMY_LINE_HEIGHT = "24px"
const INDEX_CMS_COLLECTION_ID = "yTHrQWMIY"
const INDEX_CMS_FIELD_IDS = {
    title: "oeXZcmPna",
    slug: "pdXVG_fBO",
    sortOrder: "DLBifmgp1",
    category1: "kuvJcmOFr",
    category2: "VV1CggU2J",
    category3: "E6OpH0hSs",
    thumbnail: "Jy7hBJady",
    thumbnailVideoLink: "SvOqFqdby",
    thumbnailStroke: "OHdUYs6Mo",
    year: "QZqSK_3OF",
    industry: "mBIilFqVM",
    isHomepage: "myUIfK0j7",
} as const
const INDEX_CMS_LIVE_SCAN_PATHS = [
    "/",
    "/case-studies",
    "/index",
    "https://khaki-ship-257706.framer.app/",
    "https://khaki-ship-257706.framer.app/case-studies",
    "https://khaki-ship-257706.framer.app/index",
]
const DEFAULT_THUMBNAIL_VIDEO_FIELD_IDS = INDEX_CMS_FIELD_IDS.thumbnailVideoLink
const DEFAULT_ADVANCED_SETTINGS: AdvancedSettings = {
    defaultView: "list",
    listHoverVariant: "flip",
    textPrimary: "#141414",
    textSecondary: "#141414",
    textTertiary: "#979797",
    bg: "#F7F5F0",
    dividerStrong: "#141414",
    dividerSubtle: "#141414",
    surfaceActive: "#EAE8E3",
}

// Snapshot of the "All Projects" CMS collection. Used only when Use CMS is off.
// In CMS mode, stale fallback rows should never appear as if they are live CMS.
const DEFAULT_PROJECTS: Project[] = [
    {
        title: "AirPods Pro 3",
        category1: "Visual Identity",
        category2: "2D Motion",
        category3: "3D Motion",
        industry: "Technology",
        year: "2025",
        thumbnail:
            "https://framerusercontent.com/images/JITjBIRyOd5DdC7juV7X5RwU9I.jpg",
        thumbnailVideoLink: "",
        thumbnailStroke: true,
        slug: "airpods",
        sortOrder: 1,
        isHomepage: true,
    },
    {
        title: "Simon & Schuster",
        category1: "Brand Strategy",
        category2: "Visual Identity",
        category3: "Experience Design",
        industry: "Publishing, Literature, Media",
        year: "2025",
        thumbnail:
            "https://framerusercontent.com/images/ZViKn9ASVVsE90tOfnWU7sW0U.png",
        thumbnailVideoLink: "",
        slug: "simon-schuster",
        sortOrder: 2,
        isHomepage: true,
    },
    {
        title: "Gaia",
        category1: "Visual Identity",
        category2: "UX/UI",
        category3: "Brand Strategy",
        industry: "Nature",
        year: "2026",
        thumbnail:
            "https://framerusercontent.com/images/1a1LDlRx4V2kNoG7kX7hvWygUCg.jpg",
        thumbnailVideoLink: "",
        slug: "gaia",
        sortOrder: 3,
        isHomepage: true,
    },
    {
        title: "National Park Playing Cards",
        category1: "Product Design",
        category2: "Package Design",
        category3: "Marketing",
        industry: "Outdoors, Travel",
        year: "2019",
        thumbnail:
            "https://framerusercontent.com/images/YdGKidrUlzOXfODfaQNqfCx5dM.png",
        thumbnailVideoLink: "",
        slug: "national-park-cards",
        sortOrder: 4,
        isHomepage: true,
    },
    {
        title: "Motion Connect 2025",
        category1: "Visual Identity",
        category2: "2D Motion",
        category3: "Social Media",
        industry: "Education, Motion Design",
        year: "2025",
        thumbnail:
            "https://framerusercontent.com/images/W592y16ERqrZ1qFuxRe3dcsv8I.jpg",
        thumbnailVideoLink: "",
        slug: "motion-connect-2025",
        sortOrder: 5,
        isHomepage: true,
    },
    {
        title: "Yomo",
        category1: "Visual Identity",
        category2: "User Interface",
        category3: "User Experience",
        industry: "Food, Health, Technology",
        year: "2025",
        thumbnail:
            "https://framerusercontent.com/images/PXsrzy7ezkkjSfUrVHhUuP2sk4k.jpg",
        thumbnailVideoLink: "",
        slug: "yomo",
        sortOrder: 6,
        isHomepage: true,
    },
    {
        title: "Karuna",
        category1: "Brand Identity",
        category2: "Packaging Design",
        category3: "",
        industry: "Consumer Goods, Sustainability, Social Enterprise",
        year: "2025",
        thumbnail:
            "https://framerusercontent.com/images/Dj1KLsghEL5tCJkNgSjKFvuIMMU.png",
        thumbnailVideoLink: "",
        slug: "karuna",
        sortOrder: 7,
        isHomepage: false,
    },
    {
        title: "Weaponized Innocence",
        category1: "Editorial",
        category2: "UX/UI",
        category3: "Visual Identity",
        industry: "Human Rights",
        year: "2024",
        thumbnail:
            "https://framerusercontent.com/images/BRh73XzVlRBoYNh03pKXVIYYPw.png",
        thumbnailVideoLink: "",
        slug: "weaponized-innocence",
        sortOrder: 8,
        isHomepage: true,
    },
    {
        title: "Wolff Olins x ArtCenter",
        category1: "Visual Identity",
        category2: "2D Motion",
        category3: "Social Media",
        industry: "Education",
        year: "2024",
        thumbnail: "",
        thumbnailVideoLink: "",
        slug: "wolff-olins-x-artcenter",
        sortOrder: 9,
        isHomepage: false,
    },
    {
        title: "Aspen Valley Landscaping",
        category1: "Visual Identity",
        category2: "Brand Strategy",
        category3: "",
        industry: "Nature",
        year: "2024",
        thumbnail: "",
        thumbnailVideoLink: "",
        slug: "aspen-valley-landscaping",
        sortOrder: 10,
        isHomepage: false,
    },
    {
        title: "Cellular Symphony",
        category1: "3D Motion",
        category2: "",
        category3: "",
        industry: "Science",
        year: "2024",
        thumbnail:
            "https://framerusercontent.com/images/j9uS8SZ6aEBOUihZfXOWVeSrVs8.jpg",
        thumbnailVideoLink: "",
        slug: "cellular-symphony",
        sortOrder: 11,
        isHomepage: false,
    },
    {
        title: "Neon Lights",
        category1: "2D Motion",
        category2: "",
        category3: "",
        industry: "Music",
        year: "2024",
        thumbnail:
            "https://framerusercontent.com/images/TYPcX0xZpgwrY5Ezh0e7forig.jpg",
        thumbnailVideoLink: "",
        slug: "neon-lights",
        sortOrder: 12,
        isHomepage: false,
    },
    {
        title: "John Steinbeck",
        category1: "Editorial",
        category2: "Visual Identity",
        category3: "",
        industry: "Literature",
        year: "2023",
        thumbnail: "",
        thumbnailVideoLink: "",
        slug: "john-steinbeck",
        sortOrder: 13,
        isHomepage: false,
    },
    {
        title: "Seek Truth",
        category1: "Editorial",
        category2: "Visual Identity",
        category3: "",
        industry: "Human Rights",
        year: "2024",
        thumbnail:
            "https://framerusercontent.com/images/ZZz0tz3CmTn9Zwf1r21GPbcqFNk.png",
        thumbnailVideoLink: "",
        slug: "seek-truth",
        sortOrder: 14,
        isHomepage: false,
    },
    {
        title: "Independent Lens",
        category1: "Editorial",
        category2: "Visual Identity",
        category3: "",
        industry: "Human Rights",
        year: "2024",
        thumbnail:
            "https://framerusercontent.com/images/2l7fi2HvjNmusO8H6tXWKotl8.jpg",
        thumbnailVideoLink: "",
        slug: "independent-lens",
        sortOrder: 15,
        isHomepage: false,
    },
]

function getDisciplines(p: Project): string[] {
    const seen = new Set<string>()
    const out: string[] = []
    for (const raw of [p.category1, p.category2, p.category3]) {
        if (typeof raw !== "string") continue
        const value = raw.trim()
        if (!value || seen.has(value)) continue
        seen.add(value)
        out.push(value)
    }
    return out
}

function normalizeProjectDisciplines(p: Project): Project {
    const [category1 = "", category2 = "", category3 = ""] = getDisciplines(p)
    if (
        p.category1 === category1 &&
        (p.category2 ?? "") === category2 &&
        (p.category3 ?? "") === category3
    ) {
        return p
    }
    return { ...p, category1, category2, category3 }
}

function getDisciplineDisplay(p: Project): string {
    return getDisciplines(p).join(", ")
}

function sortProjectsByDisplayOrder(projects: Project[]): Project[] {
    return [...projects].sort((a, b) => {
        const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER
        const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER
        return aOrder - bOrder || a.title.localeCompare(b.title)
    })
}

function getTaxonomyNavItems(projects: Project[]) {
    const disciplineItems: string[] = []
    const industryItems: string[] = []
    const seenDisciplines = new Set<string>()
    const seenIndustries = new Set<string>()

    for (const p of sortProjectsByDisplayOrder(projects)) {
        for (const raw of getDisciplines(p)) {
            const value = raw.trim()
            if (!value || seenDisciplines.has(value)) continue
            seenDisciplines.add(value)
            disciplineItems.push(value)
        }

        const industry = String(p.industry ?? "").trim()
        if (industry && !seenIndustries.has(industry)) {
            seenIndustries.add(industry)
            industryItems.push(industry)
        }
    }

    return {
        disciplines: sortTaxonomyLabels(disciplineItems),
        industries: sortTaxonomyLabels(industryItems),
        years: getYearNavItems(projects),
    }
}

function getYearNavItems(projects: Project[]): number[] {
    const seen = new Set<number>()
    for (const p of projects) {
        const y = normalizeYear(p.year)
        if (y > 0) seen.add(y)
    }
    return Array.from(seen).sort((a, b) => b - a)
}

function sortTaxonomyLabels(items: string[]): string[] {
    return [...items].sort((a, b) =>
        a.localeCompare(b, undefined, {
            numeric: true,
            sensitivity: "base",
        })
    )
}

function getCaseStudyUrl(p: Project): string {
    return p.slug ? `/case-studies/${p.slug}` : ""
}

function getThumbnailVideoLink(project: Project): string {
    return normalizeMediaSource(project.thumbnailVideoLink)
}

function isLoopingImageMediaSource(source: string): boolean {
    const cleanSource = source.split(/[?#]/)[0]?.toLowerCase() || ""
    return /\.(gif|webp|apng)$/.test(cleanSource)
}

function getProjectLookupKey(project: Project): string {
    const slug = String(project.slug ?? "")
        .trim()
        .replace(/^\/+|\/+$/g, "")
        .toLowerCase()
    if (slug) return `slug:${slug}`

    const title = String(project.title ?? "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase()
    return title ? `title:${title}` : ""
}

function buildProjectLookup(projects: Project[]): Map<string, Project> {
    const lookup = new Map<string, Project>()
    projects.forEach((project) => {
        const key = getProjectLookupKey(project)
        if (key) lookup.set(key, project)
    })
    return lookup
}

function hydrateProjectFromCMSModule(
    project: Project,
    cmsLookup: Map<string, Project>
): Project {
    const key = getProjectLookupKey(project)
    const cmsProject = key ? cmsLookup.get(key) : undefined
    if (!cmsProject) {
        return project.thumbnailStroke
            ? { ...project, thumbnailStroke: false }
            : project
    }

    const cmsVideo = cmsProject ? getThumbnailVideoLink(cmsProject) : ""
    const cmsThumbnail = normalizeThumbnailUrl(cmsProject.thumbnail as unknown) || ""
    const currentThumbnail = normalizeThumbnailUrl(project.thumbnail as unknown) || ""
    const cmsStroke = Boolean(cmsProject.thumbnailStroke)
    let changed = false
    const nextProject: Project = { ...project }

    if (cmsProject.thumbnail !== undefined && currentThumbnail !== cmsThumbnail) {
        nextProject.thumbnail = cmsThumbnail
        changed = true
    }

    if (!getThumbnailVideoLink(project) && cmsVideo) {
        nextProject.thumbnailVideoLink = cmsVideo
        changed = true
    }

    if (project.thumbnailStroke !== cmsStroke) {
        nextProject.thumbnailStroke = cmsStroke
        changed = true
    }

    return changed ? nextProject : project
}

function normalizeYear(raw: unknown): number {
    if (raw === null || raw === undefined) return 0

    if (typeof raw === "number") {
        return Number.isFinite(raw) && raw > 1900 ? Math.floor(raw) : 0
    }

    if (typeof raw === "object") {
        if (raw instanceof Date) {
            const y = raw.getFullYear()
            return Number.isFinite(y) && y > 1900 ? y : 0
        }
        const r = raw as Record<string, unknown>
        if ("value" in r) return normalizeYear(r.value)
        if ("year" in r) return normalizeYear(r.year)
        return 0
    }

    const str = String(raw).trim()
    if (!str) return 0

    const direct = Number(str)
    if (Number.isFinite(direct) && direct > 1900) return Math.floor(direct)

    const match = str.match(/(?:19|20)\d{2}/)
    return match ? Number(match[0]) : 0
}

function normalizeThumbnailUrl(raw: unknown): string | undefined {
    if (!raw) return undefined
    if (typeof raw === "string") return raw || undefined
    if (typeof raw === "object") {
        const r = raw as Record<string, unknown>
        if (typeof r.src === "string") return r.src || undefined
        if (typeof r.url === "string") return r.url || undefined
    }
    return undefined
}

function normalizeMediaSource(raw: unknown): string {
    if (!raw) return ""
    if (typeof raw === "string") return raw.trim()
    if (Array.isArray(raw)) {
        return raw.map(normalizeMediaSource).find(Boolean) || ""
    }
    if (typeof raw === "object") {
        const record = raw as Record<string, unknown>
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

function readFirstCMSMediaField(
    data: Record<string, CMSFieldValue | unknown> | undefined,
    fieldIds: string
): string {
    for (const fieldId of splitFieldIds(fieldIds)) {
        const source = normalizeMediaSource(readCMSField(data, fieldId))
        if (source) return source
    }
    return ""
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function uniqueStrings(values: string[]): string[] {
    return Array.from(new Set(values.filter(Boolean)))
}

function readCMSField(
    data: Record<string, CMSFieldValue | unknown> | undefined,
    fieldId: string
) {
    const field = data?.[fieldId]
    if (field && typeof field === "object" && "value" in field) {
        return (field as CMSFieldValue).value
    }
    return field
}

function normalizeCMSText(value: unknown): string {
    return String(value ?? "").trim()
}

function normalizeCMSNumber(value: unknown): number | undefined {
    const parsed = typeof value === "number" ? value : Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
}

function normalizeCMSBoolean(value: unknown): boolean {
    if (value && typeof value === "object" && "value" in value) {
        return normalizeCMSBoolean((value as CMSFieldValue).value)
    }
    if (typeof value === "boolean") return value
    if (typeof value === "number") return value !== 0
    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase()
        if (!normalized || normalized === "false" || normalized === "0") return false
        return true
    }
    return Boolean(value)
}

function isCMSModuleUrl(url: string, collectionId: string): boolean {
    const collectionPattern = escapeRegExp(collectionId)
    return new RegExp(
        `/${collectionPattern}(?:\\.[^/?#]+)?\\.(?:js|mjs)(?:[?#].*)?$`
    ).test(url)
}

function findCMSModuleUrlInMarkup(
    markup: string,
    collectionId: string
): string | undefined {
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
        document.querySelectorAll<
            | HTMLLinkElement
            | HTMLScriptElement
            | HTMLImageElement
            | HTMLSourceElement
        >("link[href], script[src], img[src], source[src]")
    ).map((element) => {
        if ("href" in element && element.href) return element.href
        if ("src" in element && element.src) return element.src
        return ""
    })

    const performanceUrls =
        typeof performance !== "undefined" &&
        typeof performance.getEntriesByType === "function"
            ? performance.getEntriesByType("resource").map((entry) => entry.name)
            : []

    return uniqueStrings([...elementUrls, ...performanceUrls])
}

function findCMSModuleUrlInDocument(collectionId: string): string | undefined {
    const fromResources = getDocumentResourceUrls().find((url) =>
        isCMSModuleUrl(url, collectionId)
    )
    if (fromResources) return fromResources

    if (typeof document !== "undefined" && document.documentElement) {
        return findCMSModuleUrlInMarkup(
            document.documentElement.outerHTML,
            collectionId
        )
    }

    return undefined
}

async function resolveCMSModuleUrl(
    collectionId: string,
    preferredModuleUrl?: string
) {
    const preferred = normalizeCMSText(preferredModuleUrl)
    if (preferred) return preferred

    const inDocument = findCMSModuleUrlInDocument(collectionId)
    if (inDocument) return inDocument

    for (const path of INDEX_CMS_LIVE_SCAN_PATHS) {
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
    const candidates = [module.t, module.r, module.default, ...Object.values(module)]
    candidates.forEach((candidate) => {
        try {
            if (typeof candidate === "function") candidate()
        } catch {
            // Framer generated modules can be initialized already in preview.
        }
    })
}

function isCMSCollectionExport(value: unknown): value is CMSCollectionExport {
    const collection = (value as CMSCollectionExport | undefined)
        ?.collectionByLocaleId?.default
    return !!collection && typeof collection.scanItems === "function"
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

function cmsItemToProject(item: CMSItem, thumbnailVideoFieldIds: string): Project | null {
    const data = item.data
    const fields = INDEX_CMS_FIELD_IDS
    const title = normalizeCMSText(readCMSField(data, fields.title))
    if (!title) return null
    const slug =
        normalizeCMSText(readCMSField(data, fields.slug)) ||
        normalizeCMSText(item.slug)

    return {
        title,
        slug,
        sortOrder: normalizeCMSNumber(readCMSField(data, fields.sortOrder)),
        category1: normalizeCMSText(readCMSField(data, fields.category1)),
        category2: normalizeCMSText(readCMSField(data, fields.category2)),
        category3: normalizeCMSText(readCMSField(data, fields.category3)),
        industry: normalizeCMSText(readCMSField(data, fields.industry)),
        year: normalizeCMSText(readCMSField(data, fields.year)),
        thumbnail:
            normalizeThumbnailUrl(readCMSField(data, fields.thumbnail)) || "",
        thumbnailVideoLink: readFirstCMSMediaField(data, thumbnailVideoFieldIds),
        thumbnailStroke: normalizeCMSBoolean(readCMSField(data, fields.thumbnailStroke)),
        isHomepage: Boolean(readCMSField(data, fields.isHomepage)),
    }
}

async function loadCMSProjects(
    preferredModuleUrl?: string,
    thumbnailVideoFieldIds: string = DEFAULT_THUMBNAIL_VIDEO_FIELD_IDS
): Promise<Project[]> {
    const moduleUrl = await resolveCMSModuleUrl(
        INDEX_CMS_COLLECTION_ID,
        preferredModuleUrl
    )
    if (!moduleUrl) return []

    const module = (await import(/* @vite-ignore */ moduleUrl)) as CMSModule
    initializeCMSModule(module)

    const collection = getCMSCollection(module)
    if (typeof collection?.scanItems !== "function") return []

    const items = await collection.scanItems()
    return items
        .map((item) => cmsItemToProject(item, thumbnailVideoFieldIds))
        .filter((project): project is Project => Boolean(project))
}

function groupByYear(projects: Project[]) {
    const map = new Map<number, Project[]>()
    for (const p of projects) {
        const year = normalizeYear(p.year)
        const bucket = map.get(year)
        if (bucket) bucket.push(p)
        else map.set(year, [p])
    }
    return Array.from(map.entries())
        .sort(([a], [b]) => {
            if (a === 0) return 1
            if (b === 0) return -1
            return b - a
        })
        .map(([year, items]) => ({
            year,
            items: [...items].sort((a, b) => a.title.localeCompare(b.title)),
        }))
}

function filterProjects(
    projects: Project[],
    filters: Filters,
    query: string
): Project[] {
    const normalizedQuery = query.trim().toLowerCase()
    const hasDisciplineFilters = filters.disciplines.length > 0
    const hasIndustryFilters = filters.industries.length > 0
    const hasYearFilters = filters.years.length > 0

    if (
        !hasDisciplineFilters &&
        !hasIndustryFilters &&
        !hasYearFilters &&
        !normalizedQuery
    ) {
        return projects
    }

    const disciplineFilters = hasDisciplineFilters
        ? new Set(filters.disciplines)
        : null
    const industryFilters = hasIndustryFilters
        ? new Set(filters.industries)
        : null
    const yearFilters = hasYearFilters ? new Set(filters.years) : null

    return projects.filter((p) => {
        const pDisciplines = getDisciplines(p)
        const matchDiscipline =
            !disciplineFilters ||
            filters.disciplines.every((d) => pDisciplines.includes(d))
        const matchIndustry =
            !industryFilters || industryFilters.has(p.industry)
        const matchYear =
            !yearFilters || yearFilters.has(normalizeYear(p.year))
        const matchSearch =
            !normalizedQuery ||
            p.title.toLowerCase().includes(normalizedQuery)
        return matchDiscipline && matchIndustry && matchYear && matchSearch
    })
}

function toggleFilterValue<T>(items: T[], value: T): T[] {
    return items.includes(value)
        ? items.filter((item) => item !== value)
        : [...items, value]
}

function prefersReducedIndexMotion(): boolean {
    if (typeof window === "undefined") return false
    return (
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
        false
    )
}

function indexViewTransitionActive(): boolean {
    try {
        return (
            typeof document !== "undefined" &&
            document.documentElement.matches(":active-view-transition")
        )
    } catch (error) {
        return false
    }
}

function getIndexStaggerIndex(index: number): number {
    return Math.max(0, Math.min(index, INDEX_APPEAR_PRESET.maxStaggerIndex))
}

function getIndexMaskRevealDelayMs(index: number): number {
    return (
        INDEX_MASK_REVEAL_PRESET.baseDelayMs +
        getIndexStaggerIndex(index) * INDEX_MASK_REVEAL_PRESET.staggerMs
    )
}

function getIndexFadeDelayMs(index: number): number {
    return getIndexStaggerIndex(index) * INDEX_APPEAR_PRESET.staggerMs
}

function useIndexAppearTrigger<T extends HTMLElement>() {
    const ref = useRef<T | null>(null)
    const [appeared, setAppeared] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element || typeof window === "undefined") return

        const shouldReduce = prefersReducedIndexMotion()

        if (shouldReduce || !("IntersectionObserver" in window)) {
            setAppeared(true)
            return
        }

        let firstFrame = 0
        let secondFrame = 0
        let transitionPoll = 0
        let revealed = false
        let waitingForTransition = false
        let observer: IntersectionObserver | null = null

        const isVisible = () => {
            const rect = element.getBoundingClientRect()
            const viewportHeight =
                window.innerHeight || document.documentElement.clientHeight
            return rect.bottom >= 0 && rect.top <= viewportHeight
        }

        const reveal = () => {
            if (revealed) return
            revealed = true
            waitingForTransition = false
            window.clearTimeout(transitionPoll)
            window.cancelAnimationFrame(firstFrame)
            window.cancelAnimationFrame(secondFrame)
            observer?.disconnect()
            setAppeared(false)
            firstFrame = window.requestAnimationFrame(() => {
                secondFrame = window.requestAnimationFrame(() => {
                    setAppeared(true)
                })
            })
        }

        const waitForTransitionThenReveal = () => {
            if (revealed || waitingForTransition) return
            waitingForTransition = true

            const poll = () => {
                if (revealed) return
                if (indexViewTransitionActive()) {
                    transitionPoll = window.setTimeout(poll, 50)
                    return
                }
                waitingForTransition = false
                if (isVisible()) reveal()
            }

            transitionPoll = window.setTimeout(poll, 50)
        }

        const revealIfVisible = () => {
            if (revealed || !isVisible()) return
            if (indexViewTransitionActive()) {
                waitForTransitionThenReveal()
                return
            }
            observer?.disconnect()
            reveal()
        }

        observer = new IntersectionObserver(
            (entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) return
                revealIfVisible()
            },
            {
                rootMargin: INDEX_APPEAR_PRESET.rootMargin,
                threshold: INDEX_APPEAR_PRESET.threshold,
            }
        )

        observer.observe(element)
        window.addEventListener("pt:reveal", revealIfVisible)

        return () => {
            window.clearTimeout(transitionPoll)
            window.cancelAnimationFrame(firstFrame)
            window.cancelAnimationFrame(secondFrame)
            observer?.disconnect()
            window.removeEventListener("pt:reveal", revealIfVisible)
        }
    }, [])

    return { ref, appeared }
}

function buildGlobalCss(): string {
    return `
  .idx-fade-appear {
    display: inline-block;
    max-width: 100%;
    opacity: 0;
    will-change: opacity;
  }

  .idx-fade-appear-block {
    display: block;
    width: 100%;
  }

  .idx-fade-appear[data-idx-appeared="true"] {
    opacity: 1;
  }

  .idx-mask-appear {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    vertical-align: top;
    line-height: inherit;
  }

  .idx-mask-appear-block {
    display: block;
    width: 100%;
  }

  .idx-mask-reveal-text {
    display: inline-block;
    max-width: 100%;
    transform: translate3d(0, var(--idx-mask-distance, ${INDEX_MASK_REVEAL_PRESET.distancePx}px), 0);
    will-change: transform;
    line-height: inherit;
    color: inherit;
    -webkit-text-fill-color: inherit;
    text-decoration: inherit;
    text-underline-offset: inherit;
    text-transform: inherit;
  }

  .idx-mask-appear-block > .idx-mask-reveal-text {
    display: block;
    width: 100%;
  }

  .idx-mask-appear[data-idx-appeared="true"] > .idx-mask-reveal-text {
    transform: translate3d(0, 0, 0);
  }

  .idx-rule {
    transform: scaleX(0);
    transform-origin: left center;
    will-change: transform;
  }

  .idx-rule[data-idx-appeared="true"] {
    transform: scaleX(1);
  }

  .idx-tax-item {
    cursor: pointer;
    transition: opacity 150ms ease;
    user-select: none;
  }
  .idx-tax-item:hover { opacity: 0.55; }
  .idx-tax-item:focus-visible {
    outline: 1px solid ${tokens.textPrimary};
    outline-offset: 3px;
  }

  .idx-tax-item[aria-pressed="true"] .idx-mask-reveal-text,
  .idx-tax-item[aria-pressed="true"] .idx-fade-appear,
  .idx-clear-filters .idx-mask-reveal-text,
  .idx-clear-filters .idx-fade-appear,
  .idx-view-toggle-option[data-active="true"] .idx-mask-reveal-text,
  .idx-view-toggle-option[data-active="true"] .idx-fade-appear {
    text-decoration: underline;
    text-underline-offset: 3px;
  }


  .idx-list-row {
    transition: background 150ms ease;
    border-radius: 2px;
  }
  .idx-hover-highlight .idx-list-row:hover { background: rgba(20, 20, 20, 0.035); }

  .idx-flip-text {
    display: block;
    width: 100%;
    min-width: 0;
    height: var(--idx-flip-height);
    line-height: var(--idx-flip-height);
    overflow: hidden;
    color: inherit;
  }
  .idx-flip-track {
    display: flex;
    flex-direction: column;
    gap: 5px;
    transform: translateY(0);
    transition: transform 620ms cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform;
  }
  .idx-flip-copy {
    display: block;
    flex: 0 0 var(--idx-flip-height);
    height: var(--idx-flip-height);
    line-height: var(--idx-flip-height);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .idx-hover-flip .idx-list-row:hover .idx-flip-track,
  .idx-hover-flip .idx-list-row:focus-visible .idx-flip-track {
    transform: translateY(calc((var(--idx-flip-height) + 5px) * -1));
  }

  .idx-rule,
  .idx-row-divider,
  .idx-year-rule,
  .idx-grid-top-rule,
  .idx-list-bottom-rule {
    background-color: ${tokens.dividerSubtle} !important;
    border-color: ${tokens.dividerSubtle} !important;
    opacity: 1 !important;
  }

  .idx-view-toggle {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    gap: 8px;
    width: 100%;
    margin: 12px 0 24px;
    font-family: ${tokens.fontMono};
    font-size: 13px;
    font-weight: 400;
    line-height: 28px;
    text-transform: uppercase;
    letter-spacing: 0;
    color: ${tokens.textPrimary} !important;
    -webkit-text-fill-color: ${tokens.textPrimary} !important;
    opacity: 1 !important;
  }

  .idx-taxonomy-shell + .idx-tax-item {
    display: block;
    margin-top: 12px !important;
    line-height: 28px !important;
  }

  .idx-container:has(.idx-tax-value[aria-pressed="true"]) .idx-view-toggle {
    margin-top: -28px !important;
  }

  .idx-view-toggle-option {
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    appearance: none;
    -webkit-appearance: none;
    font: inherit;
    line-height: inherit;
    text-transform: inherit;
    letter-spacing: inherit;
    color: ${tokens.textPrimary} !important;
    -webkit-text-fill-color: ${tokens.textPrimary} !important;
    cursor: pointer;
    text-decoration: none;
    text-underline-offset: 3px;
    transition:
      color 150ms ease,
      -webkit-text-fill-color 150ms ease;
  }

  .idx-view-toggle-option[data-active="true"] {
    text-decoration: underline;
    color: ${tokens.textPrimary} !important;
    -webkit-text-fill-color: ${tokens.textPrimary} !important;
    opacity: 1 !important;
  }

  .idx-view-toggle-option:hover {
    color: ${tokens.textTertiary} !important;
    -webkit-text-fill-color: ${tokens.textTertiary} !important;
    opacity: 1;
  }

  .idx-view-toggle-option:focus-visible {
    outline: 1px solid ${tokens.textPrimary};
    outline-offset: 3px;
  }

  .idx-view-toggle-divider {
    font: inherit;
    line-height: inherit;
    color: ${tokens.textPrimary} !important;
    -webkit-text-fill-color: ${tokens.textPrimary} !important;
    opacity: 1 !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .idx-fade-appear,
    .idx-fade-appear[data-idx-appeared="true"],
    .idx-mask-appear,
    .idx-mask-appear[data-idx-appeared="true"],
    .idx-mask-reveal-text,
    .idx-row,
    .idx-grid-card,
    .idx-rule {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
      will-change: auto !important;
    }
    .idx-flip-track {
      transition: none !important;
      transform: none !important;
    }
    .idx-grid-card-img,
    .idx-grid-card-video,
    .idx-grid-card-media > img,
    .idx-grid-card-media > video {
      transform: scale(1) !important;
      transition: none !important;
      will-change: auto !important;
    }
  }

  .idx-project-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: var(--idx-grid-gap, 20px);
    row-gap: 56px;
    width: 100%;
  }
  .idx-grid-card {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }
  .idx-grid-card-title {
    width: 100%;
    min-width: 0;
  }
  .idx-grid-card-media {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    clip-path: inset(0);
    contain: paint;
    isolation: isolate;
    background: ${tokens.surfaceActive};
  }
  .idx-grid-card-media[data-thumbnail-stroke="true"]::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 3;
    box-sizing: border-box;
    border: 1px solid ${tokens.textTertiary};
    border-radius: inherit;
    pointer-events: none;
    background: transparent;
  }
  .idx-grid-card-meta {
    margin-top: -2px;
    font-family: ${tokens.fontMono};
    font-size: 13px;
    line-height: 20px;
    letter-spacing: 0;
    text-transform: uppercase;
    color: ${tokens.textTertiary};
  }
  .idx-grid-card-img,
  .idx-grid-card-video,
  .idx-grid-card-media > img,
  .idx-grid-card-media > video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border: 0;
    transform: scale(1);
    transform-origin: center center;
    transition: transform 420ms cubic-bezier(.22, 1, .36, 1);
    backface-visibility: hidden;
    will-change: transform;
  }
  .idx-grid-card-video,
  .idx-grid-card-media > video {
    pointer-events: none;
  }
  @media (prefers-reduced-motion: no-preference) {
    .idx-grid-card:hover .idx-grid-card-img,
    .idx-grid-card:focus-visible .idx-grid-card-img,
    .idx-grid-card:focus-within .idx-grid-card-img,
    .idx-grid-card:hover .idx-grid-card-video,
    .idx-grid-card:focus-visible .idx-grid-card-video,
    .idx-grid-card:focus-within .idx-grid-card-video,
    .idx-grid-card:hover .idx-grid-card-media > img,
    .idx-grid-card:focus-visible .idx-grid-card-media > img,
    .idx-grid-card:focus-within .idx-grid-card-media > img,
    .idx-grid-card:hover .idx-grid-card-media > video,
    .idx-grid-card:focus-visible .idx-grid-card-media > video,
    .idx-grid-card:focus-within .idx-grid-card-media > video {
      transform: scale(1.02) !important;
    }
  }
  .idx-grid-card:hover .idx-flip-track,
  .idx-grid-card:focus-visible .idx-flip-track {
    transform: translateY(calc((var(--idx-flip-height) + 5px) * -1));
  }

  .idx-tax-label-year { grid-column: 1 / span 1; grid-row: 1; }
  .idx-tax-items-year { grid-column: 2 / span 1; grid-row: 1; }
  .idx-tax-label-discipline { grid-column: 3 / span 1; grid-row: 1; }
  .idx-tax-items-discipline { grid-column: 4 / span 1; grid-row: 1; }
  .idx-tax-label-industry { grid-column: 5 / span 1; grid-row: 1; }
  .idx-tax-items-industry { grid-column: 6 / span 1; grid-row: 1; }

  .idx-list-title { grid-column: 1 / span 2; }
  .idx-list-discipline { grid-column: 3 / span 2; }
  .idx-list-industry { grid-column: 5 / span 1; }

  @media (max-width: 1199px) {
    .idx-project-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
  }
  @media (max-width: 809px) {
    .idx-project-grid { grid-template-columns: 1fr !important; row-gap: 40px !important; }
    .idx-grid-card:hover .idx-flip-track,
    .idx-grid-card:focus-visible .idx-flip-track {
      transform: none !important;
    }
  }

  @media (max-width: 1199px) {
    .idx-container {
      --idx-grid-gap: 16px !important;
      padding: 0 20px !important;
    }

    .idx-year-group {
      grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
      column-gap: var(--idx-grid-gap, 16px) !important;
      row-gap: 0 !important;
    }

    .idx-year-label {
      grid-column: 1 / span 1 !important;
      padding-top: 10px !important;
    }

    .idx-list-content {
      grid-column: 2 / span 5 !important;
      min-width: 0 !important;
    }

    .idx-list-row-grid {
      grid-template-columns: minmax(0, 1fr) max-content !important;
      align-items: center !important;
      column-gap: var(--idx-grid-gap, 16px) !important;
      row-gap: 0 !important;
      min-height: 45px !important;
      padding: 3px 0 !important;
    }

    .idx-list-title {
      grid-column: 1 / span 1 !important;
      font-size: inherit !important;
    }

    .idx-list-discipline,
    .idx-col-discipline {
      display: none !important;
    }

    .idx-list-industry {
      grid-column: 2 / span 1 !important;
      justify-self: end !important;
      text-align: right !important;
      max-width: min(180px, 34vw) !important;
    }

    .idx-title-cell {
      min-width: 0 !important;
      overflow: hidden !important;
      overflow-wrap: normal !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }

    .idx-col-industry {
      min-width: 0 !important;
      overflow: visible !important;
      overflow-wrap: normal !important;
      text-overflow: clip !important;
      white-space: normal !important;
    }

    .idx-year-number,
    .idx-list-standard .idx-title-cell > span,
    .idx-list-standard .idx-flip-copy {
      font-size: 22px !important;
      line-height: 1.2 !important;
    }

    .idx-list-standard .idx-flip-text {
      --idx-flip-height: 27px !important;
      height: 27px !important;
      line-height: 27px !important;
      overflow: hidden !important;
    }

    .idx-list-standard .idx-flip-copy {
      flex: 0 0 var(--idx-flip-height) !important;
      height: var(--idx-flip-height) !important;
      line-height: var(--idx-flip-height) !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }

    .idx-col-industry span {
      display: block !important;
      font-size: 12px !important;
      line-height: 14px !important;
      overflow: visible !important;
      text-overflow: clip !important;
      white-space: normal !important;
    }
  }

  @media (max-width: 899px) {
    .idx-taxonomy-shell {
      grid-template-columns: minmax(112px, 24%) minmax(0, 1fr) !important;
      column-gap: 20px !important;
      row-gap: 28px !important;
      align-items: start !important;
    }

    .idx-tax-label-discipline,
    .idx-tax-label-industry,
    .idx-tax-label-year {
      grid-column: 1 / span 1 !important;
      margin-top: 0 !important;
      min-width: 0 !important;
    }

    .idx-tax-items-discipline,
    .idx-tax-items-industry,
    .idx-tax-items-year {
      grid-column: 2 / span 1 !important;
      min-width: 0 !important;
      overflow: visible !important;
    }

    .idx-tax-label-year,
    .idx-tax-items-year {
      grid-row: 1 !important;
    }

    .idx-tax-label-discipline,
    .idx-tax-items-discipline {
      grid-row: 2 !important;
    }

    .idx-tax-label-industry,
    .idx-tax-items-industry {
      grid-row: 3 !important;
    }

    .idx-taxonomy-items {
      align-items: flex-start !important;
      overflow: visible !important;
    }

    .idx-tax-item {
      white-space: normal !important;
      overflow-wrap: break-word !important;
    }
  }

  @media (max-width: 809px) {
    .idx-container {
      --idx-grid-gap: 10px !important;
      padding: 0 20px !important;
    }

    .idx-taxonomy-shell {
      grid-template-columns: minmax(96px, 28%) minmax(0, 1fr) !important;
      column-gap: 18px !important;
      row-gap: 28px !important;
    }

    .idx-year-group {
      grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
      column-gap: var(--idx-grid-gap, 10px) !important;
      row-gap: 0 !important;
    }

    .idx-year-label {
      grid-column: 1 / span 1 !important;
      padding-top: 10px !important;
    }

    .idx-list-content {
      grid-column: 2 / span 5 !important;
    }

    .idx-list-row-grid {
      grid-template-columns: minmax(0, 1fr) max-content !important;
      align-items: center !important;
      column-gap: var(--idx-grid-gap, 10px) !important;
      row-gap: 0 !important;
      min-height: 45px !important;
      padding: 3px 0 !important;
    }

    .idx-list-title {
      grid-column: 1 / span 1 !important;
    }

    .idx-list-discipline,
    .idx-col-discipline {
      display: none !important;
    }

    .idx-list-industry {
      grid-column: 2 / span 1 !important;
      max-width: min(150px, 34vw) !important;
    }

    .idx-flip-text {
      --idx-flip-height: 20px !important;
      height: 20px !important;
      line-height: 20px !important;
      overflow: hidden !important;
    }

    .idx-flip-track {
      display: flex !important;
      flex-direction: column !important;
      gap: 5px !important;
      transform: translateY(0) !important;
      transition: transform 620ms cubic-bezier(0.16, 1, 0.3, 1) !important;
      will-change: transform !important;
    }

    .idx-flip-copy,
    .idx-flip-copy + .idx-flip-copy {
      display: block !important;
      flex: 0 0 var(--idx-flip-height) !important;
      height: var(--idx-flip-height) !important;
      line-height: var(--idx-flip-height) !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }
  }

  @media (max-width: 809px) and (prefers-reduced-motion: reduce) {
    .idx-flip-track {
      transition: none !important;
      transform: none !important;
      will-change: auto !important;
    }
  }

  @media (max-width: 520px) {
    .idx-container {
      --idx-grid-gap: 8px !important;
      padding: 0 14px !important;
    }

    .idx-taxonomy-shell {
      grid-template-columns: minmax(84px, 32%) minmax(0, 1fr) !important;
      column-gap: 16px !important;
      row-gap: 26px !important;
      align-items: start !important;
    }

    .idx-tax-label-discipline,
    .idx-tax-label-industry,
    .idx-tax-label-year {
      grid-column: 1 / span 1 !important;
      margin-top: 0 !important;
      min-width: 0 !important;
    }

    .idx-tax-items-discipline,
    .idx-tax-items-industry,
    .idx-tax-items-year {
      grid-column: 2 / span 1 !important;
      min-width: 0 !important;
      overflow: visible !important;
    }

    .idx-tax-label-year,
    .idx-tax-items-year {
      grid-row: 1 !important;
    }

    .idx-tax-label-discipline,
    .idx-tax-items-discipline {
      grid-row: 2 !important;
    }

    .idx-tax-label-industry,
    .idx-tax-items-industry {
      grid-row: 3 !important;
    }

    .idx-tax-item {
      white-space: normal !important;
      overflow-wrap: break-word !important;
    }

    .idx-year-group {
      grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
      column-gap: var(--idx-grid-gap, 8px) !important;
    }

    .idx-year-label {
      grid-column: 1 / span 1 !important;
    }

    .idx-list-content {
      grid-column: 2 / span 5 !important;
    }

    .idx-list-row-grid {
      grid-template-columns: minmax(0, 1fr) max-content !important;
      column-gap: var(--idx-grid-gap, 8px) !important;
    }

    .idx-list-title {
      grid-column: 1 / span 1 !important;
    }

    .idx-list-discipline,
    .idx-list-industry {
      grid-column: auto !important;
    }

    .idx-list-industry {
      grid-column: 2 / span 1 !important;
      max-width: min(132px, 36vw) !important;
    }
  }
`
}

function MaskedSlideText({
    children,
    index,
    block = false,
    className,
    style,
}: {
    children: React.ReactNode
    index: number
    block?: boolean
    className?: string
    style?: React.CSSProperties
}) {
    const { ref, appeared } = useIndexAppearTrigger<HTMLSpanElement>()
    const textRef = useRef<HTMLSpanElement | null>(null)

    useEffect(() => {
        const element = textRef.current
        if (!element || typeof window === "undefined") return

        const hiddenTransform = `translate3d(0, ${INDEX_MASK_REVEAL_PRESET.distancePx}px, 0)`
        element.getAnimations().forEach((animation) => animation.cancel())

        if (!appeared) {
            element.style.transform = hiddenTransform
            return
        }

        if (prefersReducedIndexMotion() || typeof element.animate !== "function") {
            element.style.transform = "translate3d(0, 0, 0)"
            return
        }

        element.style.transform = hiddenTransform
        const animation = element.animate(
            [
                { transform: hiddenTransform },
                { transform: "translate3d(0, 0, 0)" },
            ],
            {
                duration: INDEX_MASK_REVEAL_PRESET.durationMs,
                delay: getIndexMaskRevealDelayMs(index),
                easing: INDEX_MASK_REVEAL_PRESET.easing,
                fill: "both",
            }
        )

        return () => {
            animation.cancel()
        }
    }, [appeared, index])

    return (
        <span
            ref={ref}
            className={[
                "idx-mask-appear",
                block ? "idx-mask-appear-block" : "",
                className ?? "",
            ]
                .filter(Boolean)
                .join(" ")}
            data-idx-appeared={appeared ? "true" : "false"}
            style={style}
        >
            <span ref={textRef} className="idx-mask-reveal-text">
                {children}
            </span>
        </span>
    )
}

function FadeInText({
    children,
    index = 0,
    block = false,
    className,
    style,
}: {
    children: React.ReactNode
    index?: number
    block?: boolean
    className?: string
    style?: React.CSSProperties
}) {
    const { ref, appeared } = useIndexAppearTrigger<HTMLSpanElement>()

    useEffect(() => {
        const element = ref.current
        if (!element || typeof window === "undefined") return

        element.getAnimations().forEach((animation) => animation.cancel())

        if (!appeared) {
            element.style.opacity = "0"
            return
        }

        if (prefersReducedIndexMotion() || typeof element.animate !== "function") {
            element.style.opacity = "1"
            return
        }

        element.style.opacity = "0"
        const animation = element.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: INDEX_APPEAR_PRESET.durationMs,
            delay: getIndexFadeDelayMs(index),
            easing: INDEX_APPEAR_PRESET.easing,
            fill: "both",
        })

        return () => {
            animation.cancel()
        }
    }, [appeared, index])

    return (
        <span
            ref={ref}
            className={[
                "idx-fade-appear",
                block ? "idx-fade-appear-block" : "",
                className ?? "",
            ]
                .filter(Boolean)
                .join(" ")}
            data-idx-appeared={appeared ? "true" : "false"}
            style={style}
        >
            {children}
        </span>
    )
}

function IndexRule({
    className,
    style,
    delayMs = 0,
}: {
    className?: string
    style?: React.CSSProperties
    delayMs?: number
}) {
    const { ref, appeared } = useIndexAppearTrigger<HTMLDivElement>()

    useEffect(() => {
        const element = ref.current
        if (!element || typeof window === "undefined") return

        element.getAnimations().forEach((animation) => animation.cancel())

        if (!appeared) {
            element.style.transform = "scaleX(0)"
            return
        }

        if (prefersReducedIndexMotion() || typeof element.animate !== "function") {
            element.style.transform = "scaleX(1)"
            return
        }

        element.style.transform = "scaleX(0)"
        const animation = element.animate(
            [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
            {
                duration: INDEX_APPEAR_PRESET.ruleDurationMs,
                delay: delayMs,
                easing: INDEX_APPEAR_PRESET.ruleEasing,
                fill: "both",
            }
        )

        return () => {
            animation.cancel()
        }
    }, [appeared, delayMs])

    return (
        <div
            ref={ref}
            className={["idx-rule", className ?? ""].filter(Boolean).join(" ")}
            data-idx-appeared={appeared ? "true" : "false"}
            style={style}
        />
    )
}

function TaxonomySection({
    filters,
    disciplineNavItems,
    industryNavItems,
    yearNavItems,
    onFilterToggle,
    onFilterClear,
    onClearFilters,
}: {
    filters: Filters
    disciplineNavItems: string[]
    industryNavItems: string[]
    yearNavItems: number[]
    onFilterToggle: (type: FilterType, value: string | number) => void
    onFilterClear: (type: FilterType) => void
    onClearFilters: () => void
}) {
    const hasActive =
        filters.disciplines.length > 0 ||
        filters.industries.length > 0 ||
        filters.years.length > 0

    const shellStyle: React.CSSProperties = {
        ...indexGridStyle,
        alignItems: "flex-start",
        fontFamily: tokens.fontMono,
        fontSize: 13,
        lineHeight: TAXONOMY_LINE_HEIGHT,
        textTransform: "uppercase",
        color: tokens.textPrimary,
        letterSpacing: 0,
    }

    const labelStyle: React.CSSProperties = {
        minWidth: 0,
        font: "inherit",
        lineHeight: TAXONOMY_LINE_HEIGHT,
        color: tokens.textPrimary,
        whiteSpace: "nowrap",
    }

    const itemsStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        minWidth: 0,
        overflow: "hidden",
    }

    const itemStyle = (active: boolean): React.CSSProperties => ({
        display: "block",
        width: "100%",
        margin: 0,
        padding: 0,
        border: "none",
        background: "transparent",
        font: "inherit",
        lineHeight: TAXONOMY_LINE_HEIGHT,
        textAlign: "left",
        textTransform: "inherit",
        color: tokens.textPrimary,
        letterSpacing: 0,
        fontWeight: 400,
        textDecoration: active ? "underline" : "none",
        textUnderlineOffset: "3px",
        cursor: "pointer",
        appearance: "none",
        WebkitAppearance: "none",
    })

    let navRevealIndex = 0

    return (
        <div>
            <div className="idx-taxonomy-shell" style={shellStyle}>
                <div
                    className="idx-taxonomy-label idx-tax-label-year"
                    style={labelStyle}
                >
                    <FadeInText index={navRevealIndex++}>
                        / Year
                    </FadeInText>
                </div>
                <div
                    className="idx-taxonomy-items idx-tax-items-year"
                    style={itemsStyle}
                >
                    <button
                        type="button"
                        className="idx-tax-item"
                        style={itemStyle(filters.years.length === 0)}
                        aria-pressed={filters.years.length === 0}
                        aria-label="Show all years"
                        onClick={() => onFilterClear("years")}
                    >
                        <FadeInText index={navRevealIndex++}>
                            All
                        </FadeInText>
                    </button>
                    {yearNavItems.map((y) => (
                        <button
                            key={y}
                            type="button"
                            className="idx-tax-item idx-tax-value"
                            style={itemStyle(filters.years.includes(y))}
                            aria-pressed={filters.years.includes(y)}
                            onClick={() => onFilterToggle("years", y)}
                        >
                            <FadeInText index={navRevealIndex++}>
                                {y}
                            </FadeInText>
                        </button>
                    ))}
                </div>

                <div
                    className="idx-taxonomy-label idx-tax-label-discipline"
                    style={labelStyle}
                >
                    <FadeInText index={navRevealIndex++}>
                        / Service
                    </FadeInText>
                </div>
                <div
                    className="idx-taxonomy-items idx-tax-items-discipline"
                    style={itemsStyle}
                >
                    <button
                        type="button"
                        className="idx-tax-item"
                        style={itemStyle(filters.disciplines.length === 0)}
                        aria-pressed={filters.disciplines.length === 0}
                        aria-label="Show all services"
                        onClick={() => onFilterClear("disciplines")}
                    >
                        <FadeInText index={navRevealIndex++}>
                            All
                        </FadeInText>
                    </button>
                    {disciplineNavItems.map((d) => (
                        <button
                            key={d}
                            type="button"
                            className="idx-tax-item idx-tax-value"
                            style={itemStyle(filters.disciplines.includes(d))}
                            aria-pressed={filters.disciplines.includes(d)}
                            onClick={() => onFilterToggle("disciplines", d)}
                        >
                            <FadeInText index={navRevealIndex++}>
                                {d}
                            </FadeInText>
                        </button>
                    ))}
                </div>

                <div
                    className="idx-taxonomy-label idx-tax-label-industry"
                    style={labelStyle}
                >
                    <FadeInText index={navRevealIndex++}>
                        / Industry
                    </FadeInText>
                </div>
                <div
                    className="idx-taxonomy-items idx-tax-items-industry"
                    style={itemsStyle}
                >
                    <button
                        type="button"
                        className="idx-tax-item"
                        style={itemStyle(filters.industries.length === 0)}
                        aria-pressed={filters.industries.length === 0}
                        aria-label="Show all industries"
                        onClick={() => onFilterClear("industries")}
                    >
                        <FadeInText index={navRevealIndex++}>
                            All
                        </FadeInText>
                    </button>
                    {industryNavItems.map((i) => (
                        <button
                            key={i}
                            type="button"
                            className="idx-tax-item idx-tax-value"
                            style={itemStyle(filters.industries.includes(i))}
                            aria-pressed={filters.industries.includes(i)}
                            onClick={() => onFilterToggle("industries", i)}
                        >
                            <FadeInText index={navRevealIndex++}>
                                {i}
                            </FadeInText>
                        </button>
                    ))}
                </div>
            </div>

            {hasActive && (
                <button
                    type="button"
                    className="idx-tax-item idx-clear-filters"
                    onClick={onClearFilters}
                    style={{
                        marginTop: 4,
                        padding: 0,
                        border: "none",
                        background: "transparent",
                        fontFamily: tokens.fontMono,
                        fontSize: 13,
                        lineHeight: "28px",
                        textTransform: "uppercase",
                        color: tokens.textSecondary,
                        letterSpacing: 0,
                        cursor: "pointer",
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",
                        appearance: "none",
                        WebkitAppearance: "none",
                    }}
                >
                    <FadeInText index={navRevealIndex++}>
                        Clear filters
                    </FadeInText>
                </button>
            )}
        </div>
    )
}

function HoverFlipText({
    text,
    activeText,
    style,
    activeStyle,
    height,
}: {
    text: string
    activeText?: string
    style: React.CSSProperties
    activeStyle?: React.CSSProperties
    height: string
}) {
    const flipStyle = {
        ...style,
        ["--idx-flip-height" as string]: height,
    } as React.CSSProperties

    return (
        <span className="idx-flip-text" style={flipStyle} aria-label={text}>
            <span className="idx-flip-track" aria-hidden="true">
                <span className="idx-flip-copy">{text}</span>
                <span className="idx-flip-copy" style={activeStyle}>
                    {activeText ?? text}
                </span>
            </span>
        </span>
    )
}

function ListView({
    projects,
    hoverVariant = "flip",
}: {
    projects: Project[]
    hoverVariant?: ListHoverVariant
}) {
    const groups = useMemo(() => groupByYear(projects), [projects])
    const metaTextStyle: React.CSSProperties = {
        fontFamily: tokens.fontMono,
        fontSize: 13,
        fontWeight: 400,
        lineHeight: "28px",
        textTransform: "uppercase",
        color: tokens.textPrimary,
        letterSpacing: 0,
    }
    const titleTextStyle: React.CSSProperties = {
        fontFamily: tokens.fontHeading,
        fontSize: 22,
        fontWeight: 500,
        textTransform: "uppercase",
        color: tokens.textPrimary,
        lineHeight: 1.2,
    }
    const projectCtaTextStyle: React.CSSProperties = {
        ...titleTextStyle,
        fontFamily: tokens.fontProjectCta,
        fontWeight: 400,
        color: tokens.textTertiary,
        WebkitTextFillColor: tokens.textTertiary,
    }

    if (groups.length === 0) {
        return (
            <div
                style={{
                    padding: "64px 0",
                    textAlign: "center",
                    fontFamily: tokens.fontMono,
                    fontSize: 13,
                    lineHeight: "28px",
                    textTransform: "uppercase",
                    color: tokens.textTertiary,
                }}
            >
                No work matches those filters.
            </div>
        )
    }

    const closingRuleDelay = Math.min(groups.length, 8) * 120
    let rowRevealIndex = 0

    return (
        <div
            className={`idx-list-view idx-list-standard idx-hover-${hoverVariant}`}
        >
            {groups.map(({ year, items }, groupIndex) => {
                const yearRevealIndex = rowRevealIndex++

                return (
                    <div
                        key={year}
                        className="idx-year-group"
                        style={indexGridStyle}
                    >
                    <IndexRule
                        className="idx-year-rule"
                        delayMs={Math.min(groupIndex, 8) * 120}
                        style={{
                            gridColumn: "1 / -1",
                            height: 1,
                            backgroundColor: tokens.dividerStrong,
                        }}
                    />

                    <div
                        className="idx-year-label"
                        style={{
                            gridColumn: "1 / span 1",
                            minWidth: 0,
                            paddingTop: 15,
                        }}
                    >
                        <div
                            className="idx-year-number"
                            style={titleTextStyle}
                        >
                            <MaskedSlideText index={yearRevealIndex} block>
                                {year > 0 ? year : "—"}
                            </MaskedSlideText>
                        </div>
                    </div>

                    <div
                        className="idx-list-content"
                        style={{ gridColumn: "2 / span 5", minWidth: 0 }}
                    >
                        {items.map((p, ri) => {
                            const url = getCaseStudyUrl(p)
                            const disciplineText = getDisciplineDisplay(p)
                            const useFlipHover = hoverVariant === "flip"
                            const titleRevealIndex = rowRevealIndex++
                            const metaRevealIndex = rowRevealIndex++

                            return (
                                <div key={p.slug || p.title}>
                                    <div
                                        className="idx-list-row idx-row idx-list-row-grid"
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(5, minmax(0, 1fr))",
                                            columnGap: INDEX_GRID_GAP,
                                            alignItems: "center",
                                            minHeight: 56,
                                            padding: "9px 0",
                                            cursor: url ? "pointer" : "default",
                                        }}
                                        onClick={() => {
                                            if (url) window.location.href = url
                                        }}
                                    >
                                        <div
                                            className="idx-title-cell idx-list-title"
                                            style={{
                                                minWidth: 0,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {useFlipHover ? (
                                                <MaskedSlideText
                                                    index={titleRevealIndex}
                                                    block
                                                >
                                                    <HoverFlipText
                                                        text={p.title}
                                                        activeText={
                                                            url
                                                                ? "View Project →"
                                                                : p.title
                                                        }
                                                        style={titleTextStyle}
                                                        activeStyle={
                                                            url
                                                                ? projectCtaTextStyle
                                                                : undefined
                                                        }
                                                        height="27px"
                                                    />
                                                </MaskedSlideText>
                                            ) : (
                                                <MaskedSlideText
                                                    index={titleRevealIndex}
                                                    block
                                                    style={titleTextStyle}
                                                >
                                                    {p.title}
                                                </MaskedSlideText>
                                            )}
                                        </div>

                                        <div
                                            className="idx-col-discipline idx-list-discipline"
                                            style={{
                                                minWidth: 0,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            <FadeInText
                                                index={metaRevealIndex}
                                                block
                                                style={metaTextStyle}
                                            >
                                                {disciplineText}
                                            </FadeInText>
                                        </div>

                                        <div
                                            className="idx-col-industry idx-list-industry"
                                            style={{
                                                minWidth: 0,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            <FadeInText
                                                index={metaRevealIndex + 1}
                                                block
                                                style={metaTextStyle}
                                            >
                                                {p.industry}
                                            </FadeInText>
                                        </div>
                                    </div>

                                    {ri < items.length - 1 && (
                                        <IndexRule
                                            className="idx-row-divider"
                                            delayMs={
                                                Math.min(
                                                    groupIndex * 3 + ri,
                                                    16
                                                ) * 70
                                            }
                                            style={{
                                                height: 1,
                                                backgroundColor:
                                                    tokens.dividerSubtle,
                                            }}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    </div>
                )
            })}
            <IndexRule
                className="idx-list-bottom-rule"
                delayMs={closingRuleDelay}
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: tokens.dividerStrong,
                }}
            />
        </div>
    )
}

function GridProjectCard({
    project,
    index,
}: {
    project: Project
    index: number
}) {
    const href = getCaseStudyUrl(project)
    const thumbSrc = normalizeThumbnailUrl(project.thumbnail as unknown)
    const videoSrc = getThumbnailVideoLink(project)
    const usesLoopingImage = isLoopingImageMediaSource(videoSrc)
    const serviceText = getDisciplineDisplay(project)
    const yearText = normalizeYear(project.year)
    const metaLineTwo = [project.industry, yearText > 0 ? String(yearText) : ""]
        .filter(Boolean)
        .join(" / ")

    const titleStyle: React.CSSProperties = {
        fontFamily: tokens.fontHeading,
        fontSize: 22,
        fontWeight: 500,
        textTransform: "uppercase",
        color: tokens.textPrimary,
        lineHeight: 1.2,
    }
    const projectCtaStyle: React.CSSProperties = {
        ...titleStyle,
        fontFamily: tokens.fontProjectCta,
        fontWeight: 400,
        color: tokens.textTertiary,
        WebkitTextFillColor: tokens.textTertiary,
    }

    return (
        <a
            className="idx-grid-card"
            href={href || undefined}
            aria-label={project.title}
        >
            <div
                className="idx-grid-card-media"
                data-thumbnail-stroke={project.thumbnailStroke ? "true" : undefined}
            >
                {videoSrc && usesLoopingImage ? (
                    <img
                        className="idx-grid-card-img"
                        src={videoSrc}
                        alt={`${project.title} motion thumbnail`}
                        loading="lazy"
                        decoding="async"
                    />
                ) : videoSrc ? (
                    <video
                        className="idx-grid-card-video"
                        src={videoSrc}
                        poster={thumbSrc}
                        muted
                        loop
                        playsInline
                        autoPlay
                        preload="metadata"
                    />
                ) : thumbSrc ? (
                    <img
                        className="idx-grid-card-img"
                        src={thumbSrc}
                        alt={`${project.title} thumbnail`}
                        loading="lazy"
                        decoding="async"
                    />
                ) : null}
            </div>
            <div className="idx-grid-card-title">
                <MaskedSlideText index={index} block>
                    <HoverFlipText
                        text={project.title}
                        activeText={href ? "View Project →" : project.title}
                        style={titleStyle}
                        activeStyle={href ? projectCtaStyle : undefined}
                        height="27px"
                    />
                </MaskedSlideText>
            </div>
            <div className="idx-grid-card-meta">
                <FadeInText index={index + 1} block>
                    {serviceText}
                    {serviceText && metaLineTwo ? <br /> : null}
                    {metaLineTwo}
                </FadeInText>
            </div>
        </a>
    )
}

function GridView({ projects }: { projects: Project[] }) {
    if (projects.length === 0) {
        return (
            <div
                style={{
                    padding: "64px 0",
                    textAlign: "center",
                    fontFamily: tokens.fontMono,
                    fontSize: 13,
                    lineHeight: "28px",
                    textTransform: "uppercase",
                    color: tokens.textTertiary,
                }}
            >
                No work matches those filters.
            </div>
        )
    }

    return (
        <>
            <IndexRule
                className="idx-grid-top-rule"
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: tokens.dividerStrong,
                    marginBottom: 24,
                }}
            />
            <div
                className="idx-project-grid"
                aria-label="Filtered project grid"
            >
                {projects.map((project, index) => (
                    <GridProjectCard
                        key={project.slug || project.title}
                        project={project}
                        index={index}
                    />
                ))}
            </div>
        </>
    )
}

function ViewToggle({
    activeView,
    onViewChange,
}: {
    activeView: string
    onViewChange: (v: string) => void
}) {
    return (
        <div className="idx-view-toggle" aria-label="Project view">
            {VIEW_TOGGLE_OPTIONS.map((v, index) => {
                const active = activeView === v
                const revealIndex = index * 2

                return (
                    <React.Fragment key={v}>
                        {index > 0 && (
                            <span
                                className="idx-view-toggle-divider"
                                aria-hidden="true"
                            >
                                <FadeInText index={revealIndex - 1}>
                                    /
                                </FadeInText>
                            </span>
                        )}
                        <button
                            type="button"
                            className="idx-view-toggle-option"
                            data-active={active ? "true" : "false"}
                            aria-pressed={active}
                            onClick={() => onViewChange(v)}
                        >
                            <FadeInText index={revealIndex}>
                                {v}
                            </FadeInText>
                        </button>
                    </React.Fragment>
                )
            })}
        </div>
    )
}

export default function IndexPage({
    projects: projectsProp,
    useCMS = false,
    cmsModuleUrl = "",
    thumbnailVideoFieldIds = DEFAULT_THUMBNAIL_VIDEO_FIELD_IDS,
    defaultView = "list",
    listHoverVariant = "flip",
    advanced,
    textPrimary,
    textSecondary,
    textTertiary,
    bg,
    dividerStrong,
    dividerSubtle,
    surfaceActive,
}: {
    projects?: Project[]
    useCMS?: boolean
    cmsModuleUrl?: string
    thumbnailVideoFieldIds?: string
    defaultView?: string
    listHoverVariant?: ListHoverVariant
    advanced?: AdvancedSettings
    textPrimary?: string
    textSecondary?: string
    textTertiary?: string
    bg?: string
    dividerStrong?: string
    dividerSubtle?: string
    surfaceActive?: string
}) {
    const resolvedCmsModuleUrl = cmsModuleUrl
    const resolvedThumbnailVideoFieldIds =
        thumbnailVideoFieldIds ??
        DEFAULT_THUMBNAIL_VIDEO_FIELD_IDS
    const resolvedDefaultView = advanced?.defaultView ?? defaultView
    const resolvedListHoverVariant =
        advanced?.listHoverVariant ?? listHoverVariant

    // Mirror the color props onto the module-scope `tokens` so module-level
    // sub-components and buildGlobalCss() see the live values.
    tokens.textPrimary =
        advanced?.textPrimary || textPrimary || DEFAULT_TOKENS.textPrimary
    tokens.textSecondary =
        advanced?.textSecondary || textSecondary || DEFAULT_TOKENS.textSecondary
    tokens.textTertiary =
        advanced?.textTertiary || textTertiary || DEFAULT_TOKENS.textTertiary
    tokens.bg = advanced?.bg || bg || DEFAULT_TOKENS.bg
    tokens.dividerStrong =
        advanced?.dividerStrong || dividerStrong || DEFAULT_TOKENS.dividerStrong
    tokens.dividerSubtle =
        advanced?.dividerSubtle || dividerSubtle || DEFAULT_TOKENS.dividerSubtle
    tokens.surfaceActive =
        advanced?.surfaceActive || surfaceActive || DEFAULT_TOKENS.surfaceActive
    const globalCss = useMemo(
        () => buildGlobalCss(),
        [
            advanced,
            textPrimary,
            textSecondary,
            textTertiary,
            bg,
            dividerStrong,
            dividerSubtle,
            surfaceActive,
        ]
    )
    useHiddenCMSLinkInerting(useCMS)

    // Mirror of the window registry. ProjectRegistrar instances placed inside
    // a Framer Collection List anywhere on the page push CMS rows into the
    // window-level registry; this state mirrors that so React re-renders.
    const [registeredProjects, setRegisteredProjects] = useState<
        Map<string, Project>
    >(() => new Map())
    const [cmsModuleProjects, setCMSModuleProjects] = useState<Project[]>([])
    const [cmsModuleLoaded, setCMSModuleLoaded] = useState(false)

    useEffect(() => {
        if (!useCMS) return
        const reg = getRegistry()
        if (!reg) return
        return reg.subscribe((items) => {
            setRegisteredProjects(
                new Map(items as Map<string, Project>)
            )
        })
    }, [useCMS])

    useEffect(() => {
        if (!useCMS) {
            setCMSModuleProjects([])
            setCMSModuleLoaded(false)
            return
        }

        let cancelled = false
        setCMSModuleLoaded(false)

        loadCMSProjects(resolvedCmsModuleUrl, resolvedThumbnailVideoFieldIds)
            .then((items) => {
                if (!cancelled) {
                    setCMSModuleProjects(items)
                    setCMSModuleLoaded(true)
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setCMSModuleProjects([])
                    setCMSModuleLoaded(true)
                }
            })

        return () => {
            cancelled = true
        }
    }, [useCMS, resolvedCmsModuleUrl, resolvedThumbnailVideoFieldIds])

    const allProjects = useMemo(() => {
        // Priority when Use CMS is on: live ProjectRegistrar registry > direct
        // generated CMS module > manual prop. The generated CMS module can
        // still hydrate media fields omitted by the mounted registry bridge.
        // Do not fall through to the baked snapshot in CMS mode; stale fallback
        // data should never masquerade as current CMS content.
        const cmsModuleLookup = buildProjectLookup(cmsModuleProjects)
        const registryProjects = Array.from(
            registeredProjects.values()
        ) as Project[]
        const fromRegistry =
            useCMS && registryProjects.length > 0
                ? registryProjects.map((project) =>
                      hydrateProjectFromCMSModule(project, cmsModuleLookup)
                  )
                : null
        const fromCMSModule =
            useCMS && cmsModuleProjects.length > 0 ? cmsModuleProjects : null
        const fromProps =
            projectsProp && projectsProp.length > 0 ? projectsProp : null
        const sourceProjects: Project[] = useCMS
            ? (fromRegistry ?? fromCMSModule ?? fromProps ?? [])
            : (fromProps ?? DEFAULT_PROJECTS)
        return sourceProjects.map(normalizeProjectDisciplines)
    }, [useCMS, registeredProjects, cmsModuleProjects, projectsProp])
    const initialView = resolvedDefaultView === "grid" ? "grid" : "list"

    const [activeView, setActiveView] = useState(initialView)
    const [renderKey, setRenderKey] = useState(0)
    const [filters, setFilters] = useState<Filters>({
        disciplines: [],
        industries: [],
        years: [],
    })
    const indexContainerRef = useRef<HTMLDivElement | null>(null)
    const taxonomyNavItems = useMemo(
        () => getTaxonomyNavItems(allProjects),
        [allProjects]
    )

    const handleViewChange = useCallback(
        (v: string) => {
            if (v === activeView) return
            setActiveView(v)
            setRenderKey((k) => k + 1)
        },
        [activeView]
    )

    const handleFilterToggle = useCallback(
        (
            type: FilterType,
            value: string | number
        ) => {
            setFilters((prev) => {
                if (type === "years") {
                    return {
                        ...prev,
                        years: toggleFilterValue(prev.years, Number(value)),
                    }
                }

                if (type === "industries") {
                    return {
                        ...prev,
                        industries: toggleFilterValue(
                            prev.industries,
                            String(value)
                        ),
                    }
                }

                return {
                    ...prev,
                    disciplines: toggleFilterValue(
                        prev.disciplines,
                        String(value)
                    ),
                }
            })
        },
        []
    )

    const handleFilterClear = useCallback((type: FilterType) => {
        setFilters((prev) => {
            if (prev[type].length === 0) return prev
            return { ...prev, [type]: [] }
        })
    }, [])

    const handleClearFilters = useCallback(
        () =>
            setFilters((prev) => {
                if (
                    prev.disciplines.length === 0 &&
                    prev.industries.length === 0 &&
                    prev.years.length === 0
                ) {
                    return prev
                }
                return { disciplines: [], industries: [], years: [] }
            }),
        []
    )

    const filteredProjects = useMemo(
        () => filterProjects(allProjects, filters, ""),
        [allProjects, filters]
    )
    const hasActiveFilters =
        filters.disciplines.length > 0 ||
        filters.industries.length > 0 ||
        filters.years.length > 0
    const isCMSLoading =
        useCMS &&
        registeredProjects.size === 0 &&
        cmsModuleProjects.length === 0 &&
        !cmsModuleLoaded

    return (
        <>
            <style>{globalCss}</style>

            <div
                ref={indexContainerRef}
                className="idx-container"
                style={
                    {
                        width: "100%",
                        color: tokens.textPrimary,
                        fontFamily: tokens.fontMono,
                        boxSizing: "border-box",
                        minHeight: "60vh",
                        padding: "0 20px",
                        WebkitFontSmoothing: "antialiased",
                        MozOsxFontSmoothing: "grayscale",
                    } as React.CSSProperties
                }
            >
                <div className="idx-index-nav">
                    <div
                        style={{
                            opacity: 1,
                            pointerEvents: "auto",
                            transition: "opacity 200ms ease",
                            marginBottom: 18,
                        }}
                    >
                        <TaxonomySection
                            filters={filters}
                            disciplineNavItems={taxonomyNavItems.disciplines}
                            industryNavItems={taxonomyNavItems.industries}
                            yearNavItems={taxonomyNavItems.years}
                            onFilterToggle={handleFilterToggle}
                            onFilterClear={handleFilterClear}
                            onClearFilters={handleClearFilters}
                        />
                    </div>

                    <ViewToggle
                        activeView={activeView}
                        onViewChange={handleViewChange}
                    />
                </div>

                <div key={renderKey}>
                    {isCMSLoading ? (
                        <div
                            style={{
                                padding: "64px 0",
                                textAlign: "center",
                                fontFamily: tokens.fontMono,
                                fontSize: 13,
                                lineHeight: "28px",
                                textTransform: "uppercase",
                                color: tokens.textTertiary,
                            }}
                        >
                            Loading work...
                        </div>
                    ) : activeView === "grid" ? (
                        <GridView projects={filteredProjects} />
                    ) : (
                        <ListView
                            projects={filteredProjects}
                            hoverVariant={resolvedListHoverVariant}
                        />
                    )}
                </div>

                <div
                    style={{
                        marginTop: 16,
                        paddingBottom: 160,
                        fontFamily: tokens.fontMono,
                        fontSize: 13,
                        lineHeight: "28px",
                        textTransform: "uppercase",
                        color: tokens.textPrimary,
                    }}
                >
                    {filteredProjects.length}{" "}
                    {filteredProjects.length === 1 ? "Project" : "Projects"}
                </div>
            </div>
        </>
    )
}

addPropertyControls(IndexPage, {
    useCMS: {
        type: ControlType.Boolean,
        title: "Use CMS",
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    projects: {
        type: ControlType.Array,
        title: "Projects",
        hidden: (props) => props.useCMS === true,
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title" },
                category1: { type: ControlType.String, title: "Service 1" },
                category2: { type: ControlType.String, title: "Service 2" },
                category3: { type: ControlType.String, title: "Service 3" },
                industry: { type: ControlType.String, title: "Industry" },
                year: { type: ControlType.String, title: "Year" },
                thumbnail: { type: ControlType.Image, title: "Thumbnail" },
                thumbnailVideoLink: {
                    type: ControlType.File,
                    title: "Thumbnail Video",
                    allowedFileTypes: ["mp4", "mov", "m4v", "webm"],
                },
                thumbnailStroke: {
                    type: ControlType.Boolean,
                    title: "Thumbnail Stroke",
                    defaultValue: false,
                },
                slug: { type: ControlType.String, title: "Slug" },
                sortOrder: {
                    type: ControlType.Number,
                    title: "Sorting Number",
                },
                isHomepage: { type: ControlType.Boolean, title: "Is Homepage" },
            },
        },
    },
    advanced: {
        type: ControlType.Object,
        title: "Advanced",
        buttonTitle: "Edit",
        icon: "effect",
        defaultValue: DEFAULT_ADVANCED_SETTINGS,
        controls: {
            defaultView: {
                type: ControlType.Enum,
                title: "Default View",
                options: ["list", "grid"],
                optionTitles: ["List", "Grid"],
                defaultValue: "list",
            },
            listHoverVariant: {
                type: ControlType.Enum,
                title: "List Hover",
                options: ["flip", "highlight"],
                optionTitles: ["Flip", "Highlight"],
                defaultValue: "flip",
                displaySegmentedControl: true,
            },
            textPrimary: {
                type: ControlType.Color,
                title: "Text Primary",
                defaultValue: DEFAULT_ADVANCED_SETTINGS.textPrimary,
            },
            textSecondary: {
                type: ControlType.Color,
                title: "Text Secondary",
                defaultValue: DEFAULT_ADVANCED_SETTINGS.textSecondary,
            },
            textTertiary: {
                type: ControlType.Color,
                title: "Text Tertiary",
                defaultValue: DEFAULT_ADVANCED_SETTINGS.textTertiary,
            },
            bg: {
                type: ControlType.Color,
                title: "Background",
                defaultValue: DEFAULT_ADVANCED_SETTINGS.bg,
            },
            dividerStrong: {
                type: ControlType.Color,
                title: "Divider Strong",
                defaultValue: DEFAULT_ADVANCED_SETTINGS.dividerStrong,
            },
            dividerSubtle: {
                type: ControlType.Color,
                title: "Divider Subtle",
                defaultValue: DEFAULT_ADVANCED_SETTINGS.dividerSubtle,
            },
            surfaceActive: {
                type: ControlType.Color,
                title: "Surface Active",
                defaultValue: DEFAULT_ADVANCED_SETTINGS.surfaceActive,
            },
        },
    },
})
