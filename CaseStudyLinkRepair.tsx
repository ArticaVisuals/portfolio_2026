import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Props = {
    enabled: boolean
    collectionId: string
    collectionModuleUrl: string
    slugFieldId: string
    titleFieldId: string
    urlOverrides: string
}

type CMSValue = { value?: unknown }
type CMSItem = { data?: Record<string, CMSValue> }
type CMSScanCollection = { scanItems?: () => Promise<CMSItem[]> }
type CMSCollectionExport = { collectionByLocaleId?: { default?: CMSScanCollection } }
type CMSModule = {
    a?: CMSCollectionExport
    r?: CMSCollectionExport | (() => unknown)
    t?: () => unknown
    default?: CMSCollectionExport | (() => unknown)
    [key: string]: unknown
}
type ProjectRecord = { slug: string; title: string; url: string }

const LIVE_SCAN_PATHS = [
    "/",
    "/case-studies",
    "https://khaki-ship-257706.framer.app/",
    "https://khaki-ship-257706.framer.app/case-studies",
]

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function normalizeText(value: unknown): string {
    return String(value ?? "").trim()
}

function normalizeTitle(value: string): string {
    return value.toLowerCase().replace(/\s+/g, " ").trim()
}

function normalizeSlug(value: string): string {
    return value.trim().replace(/^\/+|\/+$/g, "")
}

function parseUrlOverrides(value: string): Record<string, string> {
    const overrides: Record<string, string> = {}

    String(value || "")
        .split(/[\n,]/)
        .map((line) => line.trim())
        .filter(Boolean)
        .forEach((line) => {
            const [rawSlug, rawUrl] = line.split("=").map((part) => part.trim())
            const slug = normalizeSlug(rawSlug || "")
            if (slug && rawUrl) overrides[slug] = rawUrl
        })

    return overrides
}

function getProjectUrl(slug: string, overrides: Record<string, string>): string {
    const normalized = normalizeSlug(slug)
    if (!normalized) return ""
    return overrides[normalized] || `/case-studies/${normalized}`
}

function readField(data: Record<string, CMSValue> | undefined, fieldId: string) {
    return data?.[fieldId]?.value
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

    const inDocument = findCMSModuleUrlInDocument(collectionId)
    if (inDocument) return inDocument

    for (const path of LIVE_SCAN_PATHS) {
        try {
            const response = await fetch(path, { credentials: "same-origin" })
            if (!response.ok) continue
            const found = findCMSModuleUrlInMarkup(await response.text(), collectionId)
            if (found) return found
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

async function loadProjectRecords({
    collectionId,
    collectionModuleUrl,
    slugFieldId,
    titleFieldId,
    urlOverrides,
}: Props): Promise<ProjectRecord[]> {
    const moduleUrl = await resolveCMSModuleUrl(collectionId, collectionModuleUrl)
    if (!moduleUrl) return []

    const module = (await import(/* @vite-ignore */ moduleUrl)) as CMSModule
    initializeCMSModule(module)

    const collection = getCMSCollection(module)
    if (!collection || typeof collection.scanItems !== "function") return []

    const overrides = parseUrlOverrides(urlOverrides)
    const items = (await collection.scanItems()) as CMSItem[]

    return items
        .map((item) => {
            const data = item.data
            const slug = normalizeSlug(normalizeText(readField(data, slugFieldId)))
            const title = normalizeText(readField(data, titleFieldId))
            return { slug, title, url: getProjectUrl(slug, overrides) }
        })
        .filter((record) => Boolean(record.slug && record.title && record.url))
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

function isBrokenProjectHref(href: string | null): boolean {
    if (!href) return true
    const value = href.trim()
    if (!value || value === "#" || value === "." || value === "./") return true

    try {
        const url = new URL(value, window.location.href)
        const path = url.pathname.replace(/\/+$/, "") || "/"
        if (path === "/") return true
        return path === "/case-studies/:slug" || path.endsWith("/case-studies/:slug")
    } catch {
        return value.includes(":slug")
    }
}

function handleRepairedProjectLinkClick(event: MouseEvent) {
    if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
    ) {
        return
    }

    const target = event.target
    if (!(target instanceof Element)) return

    const anchor = target.closest<HTMLAnchorElement>('a[data-case-study-link-repaired="true"][href]')
    if (!anchor || isBrokenProjectHref(anchor.getAttribute("href"))) return

    const url = new URL(anchor.href, window.location.href)
    if (url.origin !== window.location.origin || !url.pathname.startsWith("/case-studies/")) return

    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
    window.location.assign(url.href)
}

function getCardTitle(card: HTMLElement): string {
    const title = card.querySelector<HTMLElement>(
        [
            '[data-framer-name="ProjectTitle"]',
            '[data-framer-name="Project Title"]',
            '[data-framer-name="TitleWrapper"]',
            '[data-framer-name="Title Wrapper"]',
            '[data-framer-name="ViewProject"]',
            '[data-framer-name="View project"]',
            '[data-framer-name="View project "]',
        ].join(",")
    )
    return normalizeTitle(title?.textContent || card.textContent || "")
}

function findRecordForCard(card: HTMLElement, records: ProjectRecord[]): ProjectRecord | undefined {
    const slug = normalizeSlug(getSlugFromHref(card.getAttribute("href")))
    if (slug && slug !== ":slug") {
        const bySlug = records.find((record) => record.slug === slug)
        if (bySlug) return bySlug
    }

    const title = getCardTitle(card)
    return records.find((record) => {
        const recordTitle = normalizeTitle(record.title)
        return title === recordTitle || title.includes(recordTitle)
    })
}

function repairLinks(records: ProjectRecord[]) {
    if (records.length === 0) return

    document.querySelectorAll<HTMLAnchorElement>('a[data-framer-name="Card"], a[name="Card"]').forEach((card) => {
        if (!isBrokenProjectHref(card.getAttribute("href"))) return

        const record = findRecordForCard(card, records)
        if (!record?.url) return

        card.setAttribute("href", record.url)
        card.removeAttribute("data-framer-page-link-current")
        card.removeAttribute("aria-current")
        card.setAttribute("data-case-study-link-repaired", "true")
    })
}

/**
 * Repairs native Framer Case Study card links when CMS dynamic link controls
 * publish as the current page instead of the row's case-study URL.
 *
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function CaseStudyLinkRepair({
    enabled = true,
    collectionId = "yTHrQWMIY",
    collectionModuleUrl = "",
    slugFieldId = "pdXVG_fBO",
    titleFieldId = "oeXZcmPna",
    urlOverrides = "airpods-pro-3=/case-studies/airpods",
}: Partial<Props>) {
    React.useEffect(() => {
        if (!enabled || typeof window === "undefined") return

        let disposed = false
        let frame = 0
        let records: ProjectRecord[] = []

        const scheduleRepair = () => {
            window.cancelAnimationFrame(frame)
            frame = window.requestAnimationFrame(() => {
                if (!disposed) repairLinks(records)
            })
        }

        const refreshRecords = () => {
            loadProjectRecords({
                enabled,
                collectionId,
                collectionModuleUrl,
                slugFieldId,
                titleFieldId,
                urlOverrides,
            })
                .then((loaded) => {
                    if (disposed) return
                    records = loaded
                    scheduleRepair()
                })
                .catch(() => {
                    if (!disposed) records = []
                })
        }

        refreshRecords()

        const timeoutIds = [100, 350, 900, 1800, 3200].map((delay) =>
            window.setTimeout(scheduleRepair, delay)
        )
        const refreshIds = [1200, 3600].map((delay) => window.setTimeout(refreshRecords, delay))

        const observer = new MutationObserver(scheduleRepair)
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["href", "data-framer-name", "name", "class"],
        })
        document.addEventListener("click", handleRepairedProjectLinkClick, true)

        return () => {
            disposed = true
            window.cancelAnimationFrame(frame)
            timeoutIds.forEach((id) => window.clearTimeout(id))
            refreshIds.forEach((id) => window.clearTimeout(id))
            observer.disconnect()
            document.removeEventListener("click", handleRepairedProjectLinkClick, true)
        }
    }, [enabled, collectionId, collectionModuleUrl, slugFieldId, titleFieldId, urlOverrides])

    return (
        <div
            aria-hidden="true"
            style={{
                width: 0,
                height: 0,
                overflow: "hidden",
                pointerEvents: "none",
            }}
        />
    )
}

addPropertyControls(CaseStudyLinkRepair, {
    enabled: {
        type: ControlType.Boolean,
        title: "Enabled",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
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
    urlOverrides: {
        type: ControlType.String,
        title: "Overrides",
        defaultValue: "airpods-pro-3=/case-studies/airpods",
        displayTextArea: true,
    },
})
