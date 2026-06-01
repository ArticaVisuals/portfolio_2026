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

const INDEX_GRID_GAP = "var(--idx-grid-gap, 20px)"
const INDEX_GRID_TEMPLATE = "repeat(6, minmax(0, 1fr))"

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
    [key: string]: unknown
}

type Filters = {
    disciplines: string[]
    industries: string[]
    years: number[]
}

type FilterType = "disciplines" | "industries" | "years"

type ListTypographyVariant = "standard" | "mono13"
type ListHoverVariant = "flip" | "highlight"

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
    thumbnailVideoLink: "WG62tRjG8",
    year: "QZqSK_3OF",
    industry: "mBIilFqVM",
    isHomepage: "myUIfK0j7",
} as const
const INDEX_CMS_LIVE_SCAN_PATHS = [
    "/",
    "/case-studies",
    "https://khaki-ship-257706.framer.app/",
    "https://khaki-ship-257706.framer.app/case-studies",
]

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
        thumbnailVideoLink:
            "https://freight.cargo.site/i/V2732716404789921262344304055829/AirPods-Pro-3-Introduction-1.mp4",
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
        thumbnailVideoLink:
            "https://freight.cargo.site/i/K2717924145885630584799912777237/Motion-Connect_1.mp4",
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
        thumbnailVideoLink:
            "https://freight.cargo.site/i/K1779235211065582686951637767701/cellular-symphony-Apple-Devices-HD-Best-Quality.m4v",
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
        thumbnailVideoLink: "https://player.vimeo.com/video/903963136",
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
    return { ...p, category1, category2, category3 }
}

function getDisciplineDisplay(p: Project): string {
    return getDisciplines(p).join(", ")
}

function collectByProjectOrder(
    projects: Project[],
    extract: (p: Project) => string[]
): string[] {
    const items: string[] = []
    const seen = new Set<string>()

    ;[...projects]
        .sort((a, b) => {
            const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER
            const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER
            return aOrder - bOrder || a.title.localeCompare(b.title)
        })
        .forEach((p) => {
            for (const raw of extract(p)) {
                const value = typeof raw === "string" ? raw.trim() : ""
                if (!value || seen.has(value)) continue
                seen.add(value)
                items.push(value)
            }
        })

    return items
}

function getDisciplineNavItems(projects: Project[]): string[] {
    return sortTaxonomyLabels(collectByProjectOrder(projects, getDisciplines))
}

function getIndustryNavItems(projects: Project[]): string[] {
    return sortTaxonomyLabels(
        collectByProjectOrder(projects, (p) => [p.industry ?? ""])
    )
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

function isCMSModuleUrl(url: string, collectionId: string): boolean {
    const collectionPattern = escapeRegExp(collectionId)
    return new RegExp(
        `/${collectionPattern}\\.[^/]+\\.mjs(?:[?#].*)?$`
    ).test(url)
}

function findCMSModuleUrlInMarkup(
    markup: string,
    collectionId: string
): string | undefined {
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
    try {
        if (typeof module.r === "function") module.r()
    } catch {
        // Framer generated modules can be initialized already in preview.
    }
}

function getCMSCollection(module: CMSModule): CMSCollection | undefined {
    const legacyCollection = module.a?.collectionByLocaleId?.default
    if (legacyCollection && typeof legacyCollection.scanItems === "function") {
        return legacyCollection
    }

    const currentExport =
        module.r && typeof module.r === "object" ? module.r : undefined
    const currentCollection = currentExport?.collectionByLocaleId?.default
    if (currentCollection && typeof currentCollection.scanItems === "function") {
        return currentCollection
    }

    return undefined
}

function cmsItemToProject(item: CMSItem): Project | null {
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
        thumbnailVideoLink: normalizeCMSText(
            readCMSField(data, fields.thumbnailVideoLink)
        ),
        isHomepage: Boolean(readCMSField(data, fields.isHomepage)),
    }
}

async function loadCMSProjects(
    preferredModuleUrl?: string
): Promise<Project[]> {
    const moduleUrl = await resolveCMSModuleUrl(
        INDEX_CMS_COLLECTION_ID,
        preferredModuleUrl
    )
    if (!moduleUrl) return []

    const module = (await import(/* @vite-ignore */ moduleUrl)) as CMSModule
    initializeCMSModule(module)

    const collection = getCMSCollection(module)
    const scanItems = collection?.scanItems
    if (typeof scanItems !== "function") return []

    const items = await scanItems()
    return items
        .map(cmsItemToProject)
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
    return projects.filter((p) => {
        const pDisciplines = getDisciplines(p)
        const matchDiscipline =
            filters.disciplines.length === 0 ||
            filters.disciplines.every((d) => pDisciplines.includes(d))
        const matchIndustry =
            filters.industries.length === 0 ||
            filters.industries.includes(p.industry)
        const matchYear =
            filters.years.length === 0 ||
            filters.years.includes(normalizeYear(p.year))
        const matchSearch =
            !query || p.title.toLowerCase().includes(query.toLowerCase())
        return matchDiscipline && matchIndustry && matchYear && matchSearch
    })
}

function buildGlobalCss(): string {
    return `
  @keyframes idxFadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes idxRuleDraw {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  .idx-row { animation: idxFadeUp 300ms ease both; }

  .idx-rule {
    animation: idxRuleDraw 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
    transform-origin: left center;
    will-change: transform;
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
    margin-top: -28px;
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
    .idx-row,
    .idx-grid-card,
    .idx-rule {
      animation: none !important;
      transform: none !important;
    }
    .idx-flip-track {
      transition: none !important;
      transform: none !important;
    }
    .idx-grid-card-img,
    .idx-grid-card-video {
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
    animation: idxFadeUp 300ms ease both;
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
  .idx-grid-card-video {
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
  .idx-grid-card-video {
    pointer-events: none;
  }
  .idx-grid-card:hover .idx-grid-card-img,
  .idx-grid-card:focus-visible .idx-grid-card-img,
  .idx-grid-card:focus-within .idx-grid-card-img,
  .idx-grid-card:hover .idx-grid-card-video,
  .idx-grid-card:focus-visible .idx-grid-card-video,
  .idx-grid-card:focus-within .idx-grid-card-video {
    transform: scale(1.02);
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
    .idx-container { padding: 0 20px !important; }
    .idx-project-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    .idx-year-group { grid-template-columns: 1fr !important; row-gap: 8px !important; }
    .idx-year-label,
    .idx-list-content { grid-column: 1 / -1 !important; }
  }
  @media (max-width: 809px) {
    .idx-container { --idx-grid-gap: 12px; padding: 0 20px !important; }
    .idx-taxonomy-shell {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      column-gap: 16px !important;
      row-gap: 8px !important;
    }
    .idx-tax-label-year { grid-column: 1 / span 1 !important; grid-row: 1 !important; }
    .idx-tax-items-year { grid-column: 1 / span 1 !important; grid-row: 2 !important; }
    .idx-tax-label-discipline { grid-column: 2 / span 1 !important; grid-row: 1 !important; }
    .idx-tax-items-discipline { grid-column: 2 / span 1 !important; grid-row: 2 !important; }
    .idx-tax-label-industry { grid-column: 3 / span 1 !important; grid-row: 1 !important; }
    .idx-tax-items-industry { grid-column: 3 / span 1 !important; grid-row: 2 !important; }
    .idx-taxonomy-items { overflow: visible !important; }
    .idx-tax-item { white-space: normal !important; overflow-wrap: anywhere; }
    .idx-list-row-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      align-items: start !important;
      column-gap: 12px !important;
      row-gap: 2px !important;
      min-height: 0 !important;
      padding: 12px 0 10px !important;
    }
    .idx-list-title {
      grid-column: 1 / -1 !important;
      font-size: 18px !important;
    }
    .idx-list-discipline { grid-column: 1 / span 1 !important; }
    .idx-list-industry { grid-column: 2 / span 1 !important; }
    .idx-title-cell,
    .idx-col-discipline,
    .idx-col-industry {
      overflow: visible !important;
      text-overflow: clip !important;
      white-space: normal !important;
      overflow-wrap: anywhere;
    }
    .idx-list-standard .idx-title-cell > span,
    .idx-list-standard .idx-flip-copy {
      font-size: 18px !important;
      line-height: 1.18 !important;
    }
    .idx-flip-text {
      height: auto !important;
      line-height: 1.18 !important;
      overflow: visible !important;
    }
    .idx-flip-track {
      display: block !important;
      gap: 0 !important;
      transform: none !important;
      transition: none !important;
      will-change: auto !important;
    }
    .idx-hover-flip .idx-list-row:hover .idx-flip-track,
    .idx-hover-flip .idx-list-row:focus-visible .idx-flip-track {
      transform: none !important;
    }
    .idx-flip-copy {
      flex: initial !important;
      height: auto !important;
      line-height: inherit !important;
      overflow: visible !important;
      text-overflow: clip !important;
      white-space: normal !important;
    }
    .idx-flip-copy + .idx-flip-copy { display: none !important; }
    .idx-project-grid { grid-template-columns: 1fr !important; row-gap: 40px !important; }
    .idx-grid-card:hover .idx-flip-track,
    .idx-grid-card:focus-visible .idx-flip-track {
      transform: none !important;
    }
  }
  @media (max-width: 520px) {
    .idx-taxonomy-shell { grid-template-columns: 1fr !important; row-gap: 0 !important; }
    .idx-tax-label-discipline,
    .idx-tax-label-industry,
    .idx-tax-label-year,
    .idx-tax-items-discipline,
    .idx-tax-items-industry,
    .idx-tax-items-year {
      grid-column: 1 / -1 !important;
      grid-row: auto !important;
    }
    .idx-tax-label-discipline,
    .idx-tax-label-industry { margin-top: 20px; }
    .idx-list-row-grid { grid-template-columns: 1fr !important; row-gap: 0 !important; }
    .idx-list-discipline,
    .idx-list-industry { grid-column: 1 / -1 !important; }
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

    return (
        <div>
            <div className="idx-taxonomy-shell" style={shellStyle}>
                <div
                    className="idx-taxonomy-label idx-tax-label-year"
                    style={labelStyle}
                >
                    / Year
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
                        All
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
                            {y}
                        </button>
                    ))}
                </div>

                <div
                    className="idx-taxonomy-label idx-tax-label-discipline"
                    style={labelStyle}
                >
                    / Service
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
                        All
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
                            {d}
                        </button>
                    ))}
                </div>

                <div
                    className="idx-taxonomy-label idx-tax-label-industry"
                    style={labelStyle}
                >
                    / Industry
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
                        All
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
                            {i}
                        </button>
                    ))}
                </div>
            </div>

            {hasActive && (
                <button
                    type="button"
                    className="idx-tax-item"
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
                    Clear filters
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
    typographyVariant = "standard",
    hoverVariant = "flip",
}: {
    projects: Project[]
    typographyVariant?: ListTypographyVariant
    hoverVariant?: ListHoverVariant
}) {
    const groups = useMemo(() => groupByYear(projects), [projects])
    const isMono13 = typographyVariant === "mono13"
    const mono13TextStyle: React.CSSProperties = {
        fontFamily: tokens.fontMono,
        fontSize: 13,
        fontWeight: 400,
        lineHeight: "28px",
        textTransform: "uppercase",
        color: tokens.textPrimary,
        letterSpacing: 0,
    }
    const titleTextStyle: React.CSSProperties = isMono13
        ? mono13TextStyle
        : {
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
    const titleFlipHeight = isMono13 ? "28px" : "27px"

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

    const closingRuleDelay = Math.min(groups.length, 8) * 70
    return (
        <div
            className={`idx-list-view idx-list-${typographyVariant} idx-hover-${hoverVariant}`}
        >
            {groups.map(({ year, items }, groupIndex) => (
                <div
                    key={year}
                    className="idx-year-group"
                    style={indexGridStyle}
                >
                    <div
                        className="idx-rule idx-year-rule"
                        style={{
                            gridColumn: "1 / -1",
                            height: 1,
                            backgroundColor: tokens.dividerStrong,
                            animationDelay: `${Math.min(groupIndex, 8) * 70}ms`,
                        }}
                    />

                    <div
                        className="idx-year-label"
                        style={{
                            gridColumn: "1 / span 1",
                            minWidth: 0,
                            paddingTop: isMono13 ? 5 : 15,
                        }}
                    >
                        <div
                            className="idx-year-number"
                            style={
                                isMono13 ? mono13TextStyle : titleTextStyle
                            }
                        >
                            {year > 0 ? year : "—"}
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

                            return (
                                <div key={p.title}>
                                    <div
                                        className="idx-list-row idx-row idx-list-row-grid"
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(5, minmax(0, 1fr))",
                                            columnGap: INDEX_GRID_GAP,
                                            alignItems: "center",
                                            minHeight: isMono13 ? 38 : 56,
                                            padding: isMono13
                                                ? "5px 0"
                                                : "9px 0",
                                            cursor: url ? "pointer" : "default",
                                            animationDelay: `${Math.min(ri, 12) * 30}ms`,
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
                                                    height={titleFlipHeight}
                                                />
                                            ) : (
                                                <span style={titleTextStyle}>
                                                    {p.title}
                                                </span>
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
                                            <span style={mono13TextStyle}>
                                                {disciplineText}
                                            </span>
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
                                            <span style={mono13TextStyle}>
                                                {p.industry}
                                            </span>
                                        </div>
                                    </div>

                                    {ri < items.length - 1 && (
                                        <div
                                            className="idx-rule idx-row-divider"
                                            style={{
                                                height: 1,
                                                backgroundColor:
                                                    tokens.dividerSubtle,
                                                animationDelay: `${Math.min(groupIndex * 3 + ri, 16) * 35}ms`,
                                            }}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
            <div
                className="idx-rule idx-list-bottom-rule"
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: tokens.dividerStrong,
                    animationDelay: `${closingRuleDelay}ms`,
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
    const videoSrc = (project.thumbnailVideoLink || "").trim()
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
            style={{
                animationDelay: `${Math.min(index, 12) * 30}ms`,
            }}
        >
            <div className="idx-grid-card-media">
                {videoSrc ? (
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
                    />
                ) : null}
            </div>
            <div className="idx-grid-card-title">
                <HoverFlipText
                    text={project.title}
                    activeText={href ? "View Project →" : project.title}
                    style={titleStyle}
                    activeStyle={href ? projectCtaStyle : undefined}
                    height="27px"
                />
            </div>
            <div className="idx-grid-card-meta">
                {serviceText}
                {serviceText && metaLineTwo ? <br /> : null}
                {metaLineTwo}
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
            <div
                className="idx-rule idx-grid-top-rule"
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
                        key={project.title}
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
    const toggleOptions = ["grid", "list"] as const

    return (
        <div className="idx-view-toggle" aria-label="Project view">
            {toggleOptions.map((v, index) => {
                const active = activeView === v

                return (
                    <React.Fragment key={v}>
                        {index > 0 && (
                            <span
                                className="idx-view-toggle-divider"
                                aria-hidden="true"
                            >
                                /
                            </span>
                        )}
                        <button
                            type="button"
                            className="idx-view-toggle-option"
                            data-active={active ? "true" : "false"}
                            aria-pressed={active}
                            onClick={() => onViewChange(v)}
                        >
                            {v}
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
    defaultView = "list",
    listTypographyVariant = "standard",
    listHoverVariant = "flip",
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
    defaultView?: string
    listTypographyVariant?: ListTypographyVariant
    listHoverVariant?: ListHoverVariant
    textPrimary?: string
    textSecondary?: string
    textTertiary?: string
    bg?: string
    dividerStrong?: string
    dividerSubtle?: string
    surfaceActive?: string
}) {
    // Mirror the color props onto the module-scope `tokens` so module-level
    // sub-components and buildGlobalCss() see the live values.
    tokens.textPrimary = textPrimary || DEFAULT_TOKENS.textPrimary
    tokens.textSecondary = textSecondary || DEFAULT_TOKENS.textSecondary
    tokens.textTertiary = textTertiary || DEFAULT_TOKENS.textTertiary
    tokens.bg = bg || DEFAULT_TOKENS.bg
    tokens.dividerStrong = dividerStrong || DEFAULT_TOKENS.dividerStrong
    tokens.dividerSubtle = dividerSubtle || DEFAULT_TOKENS.dividerSubtle
    tokens.surfaceActive = surfaceActive || DEFAULT_TOKENS.surfaceActive

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

        loadCMSProjects(cmsModuleUrl)
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
    }, [useCMS, cmsModuleUrl])

    const allProjects = useMemo(() => {
        // Priority when Use CMS is on: live ProjectRegistrar registry > direct
        // generated CMS module > manual prop. Do not fall through to the baked
        // snapshot in CMS mode; stale fallback data should never masquerade as
        // current CMS content.
        const fromRegistry =
            useCMS && registeredProjects.size > 0
                ? Array.from(registeredProjects.values())
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
    const initialView = defaultView === "grid" ? "grid" : "list"

    const [activeView, setActiveView] = useState(initialView)
    const [transitioning, setTransitioning] = useState(false)
    const [renderKey, setRenderKey] = useState(0)
    const [filters, setFilters] = useState<Filters>({
        disciplines: [],
        industries: [],
        years: [],
    })
    const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const disciplineNavItems = useMemo(
        () => getDisciplineNavItems(allProjects),
        [allProjects]
    )
    const industryNavItems = useMemo(
        () => getIndustryNavItems(allProjects),
        [allProjects]
    )
    const yearNavItems = useMemo(
        () => getYearNavItems(allProjects),
        [allProjects]
    )

    const handleViewChange = useCallback(
        (v: string) => {
            if (v === activeView) return
            if (transitionTimer.current) clearTimeout(transitionTimer.current)
            setTransitioning(true)
            transitionTimer.current = setTimeout(() => {
                setActiveView(v)
                setRenderKey((k) => k + 1)
                setTransitioning(false)
                transitionTimer.current = null
            }, 150)
        },
        [activeView]
    )

    useEffect(
        () => () => {
            if (transitionTimer.current) clearTimeout(transitionTimer.current)
        },
        []
    )

    const handleFilterToggle = useCallback(
        (
            type: FilterType,
            value: string | number
        ) => {
            setFilters((prev) => {
                const arr = prev[type] as any[]
                return {
                    ...prev,
                    [type]: arr.includes(value)
                        ? arr.filter((x) => x !== value)
                        : [...arr, value],
                }
            })
        },
        []
    )

    const handleFilterClear = useCallback((type: FilterType) => {
        setFilters((prev) => ({ ...prev, [type]: [] }))
    }, [])

    const handleClearFilters = useCallback(
        () => setFilters({ disciplines: [], industries: [], years: [] }),
        []
    )

    const filteredProjects = useMemo(
        () => filterProjects(allProjects, filters, ""),
        [allProjects, filters]
    )
    const isCMSLoading =
        useCMS &&
        registeredProjects.size === 0 &&
        cmsModuleProjects.length === 0 &&
        !cmsModuleLoaded

    return (
        <>
            <style>{buildGlobalCss()}</style>

            <div
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
                        disciplineNavItems={disciplineNavItems}
                        industryNavItems={industryNavItems}
                        yearNavItems={yearNavItems}
                        onFilterToggle={handleFilterToggle}
                        onFilterClear={handleFilterClear}
                        onClearFilters={handleClearFilters}
                    />
                </div>

                <ViewToggle
                    activeView={activeView}
                    onViewChange={handleViewChange}
                />

                <div
                    key={renderKey}
                    style={{
                        opacity: transitioning ? 0 : 1,
                        transition: transitioning
                            ? "opacity 150ms ease"
                            : "opacity 250ms ease",
                    }}
                >
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
                            typographyVariant={listTypographyVariant}
                            hoverVariant={listHoverVariant}
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
    cmsModuleUrl: {
        type: ControlType.String,
        title: "CMS Module URL",
        defaultValue: "",
        hidden: (props) => !props.useCMS,
    },
    projects: {
        type: ControlType.Array,
        title: "Projects",
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
                    type: ControlType.String,
                    title: "Thumbnail Video Link",
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
    defaultView: {
        type: ControlType.Enum,
        title: "Default View",
        options: ["list", "grid"],
        defaultValue: "list",
    },
    listTypographyVariant: {
        type: ControlType.Enum,
        title: "List Type",
        options: ["standard", "mono13"],
        optionTitles: ["Standard", "Mono 13"],
        defaultValue: "standard",
        displaySegmentedControl: true,
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
        defaultValue: "#26211f",
    },
    textSecondary: {
        type: ControlType.Color,
        title: "Text Secondary",
        defaultValue: "#141414",
    },
    textTertiary: {
        type: ControlType.Color,
        title: "Text Tertiary",
        defaultValue: "#979797",
    },
    bg: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#F7F5F0",
    },
    dividerStrong: {
        type: ControlType.Color,
        title: "Divider Strong",
        defaultValue: "#141414",
    },
    dividerSubtle: {
        type: ControlType.Color,
        title: "Divider Subtle",
        defaultValue: "#141414",
    },
    surfaceActive: {
        type: ControlType.Color,
        title: "Surface Active",
        defaultValue: "#EAE8E3",
    },
})
