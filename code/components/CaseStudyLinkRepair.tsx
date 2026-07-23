import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Props = {
    enabled: boolean
    mobileFooterLayout: boolean
    collectionId: string
    collectionModuleUrl: string
    slugFieldId: string
    titleFieldId: string
    urlOverrides: string
}

type ProjectRoute = {
    title: string
    slug: string
}

type ProjectRecord = ProjectRoute & {
    url: string
    normalizedTitle: string
    unavailable: boolean
}

const PROJECT_ROUTES: ProjectRoute[] = [
    { title: "AirPods Pro 3", slug: "airpods" },
    { title: "Simon & Schuster", slug: "simon-schuster" },
    { title: "Gaia", slug: "gaia" },
    { title: "National Park Playing Cards", slug: "national-park-cards" },
    { title: "Motion Connect 2025", slug: "motion-connect-2025" },
    { title: "Yomo", slug: "yomo" },
    { title: "Karuna", slug: "karuna" },
    { title: "Weaponized Innocence", slug: "weaponized-innocence" },
    { title: "Wolff Olins x ArtCenter", slug: "wolff-olins-x-artcenter" },
    { title: "Aspen Valley Landscaping", slug: "aspen-valley-landscaping" },
    { title: "Cellular Symphony", slug: "cellular-symphony" },
    { title: "Neon Lights", slug: "neon-lights" },
    { title: "John Steinbeck", slug: "john-steinbeck" },
    { title: "Seek Truth", slug: "seek-truth" },
    { title: "Independent Lens", slug: "independent-lens" },
    { title: "TYPLDN", slug: "typldn" },
]

const UNAVAILABLE_PROJECT_SLUGS = new Set(["john-steinbeck"])
const CARD_SELECTOR = [
    '[data-framer-name="Card"]',
    '[name="Card"]',
    'a[href="./"]',
    'a[href="."]',
    'a[href="#"]',
    'a[href*="/case-studies/"]',
    'a[href^="./case-studies/"]',
    'a[href^="../case-studies/"]',
].join(",")

const INVALID_VIDEO_ATTR = "data-case-study-invalid-video"
const POSTER_FALLBACK_ATTR = "data-case-study-poster-fallback"
const MOBILE_FOOTER_STYLE_ID = "case-study-mobile-footer-layout"
const MOBILE_FOOTER_ACTIVE_KEY = "__caseStudyMobileFooterLayoutActive"
const MOBILE_FOOTER_ATTRS = {
    section: "data-case-study-mobile-cta-section",
    container: "data-case-study-mobile-cta-container",
    row: "data-case-study-mobile-cta-row",
    label: "data-case-study-mobile-cta-label",
    meta: "data-case-study-mobile-cta-meta",
} as const
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
        padding-left: 15px !important;
        padding-right: 15px !important;
        width: 100% !important;
    }

    [data-case-study-mobile-cta-row] {
        align-items: flex-start !important;
        align-self: flex-start !important;
        box-sizing: border-box !important;
        flex: 0 0 auto !important;
        gap: 10px !important;
        height: 32px !important;
        justify-content: flex-start !important;
        max-width: calc(100vw - 30px) !important;
        min-height: 32px !important;
        padding: 0 !important;
        width: auto !important;
    }

    [data-case-study-mobile-cta-row="email"] {
        height: 34px !important;
        min-height: 34px !important;
        padding-top: 2px !important;
    }

    [data-case-study-mobile-cta-label="true"] {
        display: block !important;
        flex: 0 0 auto !important;
        height: 32px !important;
        max-width: calc(100vw - 30px) !important;
        min-height: 32px !important;
        min-width: 0 !important;
        width: auto !important;
    }

    [data-case-study-mobile-cta-label="true"] * {
        font-family: "GT Standard Trial L Md", "GT Standard Trial L Md Placeholder", "GT Standard Trial", sans-serif !important;
        font-size: 32px !important;
        font-weight: 500 !important;
        height: 32px !important;
        letter-spacing: -2px !important;
        line-height: 32px !important;
        width: auto !important;
    }

    [data-case-study-mobile-cta-label="true"] > * {
        display: inline-block !important;
    }

    [data-case-study-mobile-cta-label="true"] span {
        display: inline-block !important;
    }

    [data-case-study-mobile-cta-meta="true"] {
        flex: 0 0 auto !important;
        height: 13px !important;
        width: auto !important;
    }

    [data-case-study-mobile-cta-meta="true"] * {
        font-size: 13px !important;
        height: 13px !important;
        letter-spacing: -0.13px !important;
        line-height: 13px !important;
        text-transform: uppercase !important;
        width: auto !important;
    }
}
`

function normalizeSlug(value: string): string {
    return String(value || "")
        .trim()
        .replace(/^\/+|\/+$/g, "")
}

function normalizeTitle(value: string): string {
    return String(value || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim()
}

function getHomePath(): string {
    if (typeof window === "undefined") return ""
    return window.location.pathname.replace(/\/+$/, "") || "/"
}

function isProjectListingPage(): boolean {
    const path = getHomePath()
    return path === "/" || path === "/case-studies"
}

function isCaseStudyDetailPage(): boolean {
    const path = getHomePath()
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
    if (overrides[normalized]) return overrides[normalized]
    if (UNAVAILABLE_PROJECT_SLUGS.has(normalized)) return ""
    return `/case-studies/${normalized}`
}

function getProjectRecords(urlOverrides: string): ProjectRecord[] {
    const overrides = parseUrlOverrides(urlOverrides)

    return PROJECT_ROUTES.map((route) => {
        const url = getProjectUrl(route.slug, overrides)

        return {
            ...route,
            normalizedTitle: normalizeTitle(route.title),
            url,
            unavailable: !url,
        }
    })
}

function getCardTitle(card: HTMLElement): string {
    return normalizeTitle(card.textContent || "")
        .replace(/^\d+\s*\/\s*/, "")
        .replace(/view\s*project/g, "")
        .trim()
}

function titleMatches(cardTitle: string, record: ProjectRecord): boolean {
    return Boolean(
        cardTitle &&
            record.normalizedTitle &&
            (cardTitle === record.normalizedTitle ||
                cardTitle.includes(record.normalizedTitle))
    )
}

function getCardRecord(card: HTMLElement, records: ProjectRecord[]): ProjectRecord | null {
    const title = getCardTitle(card)
    return records.find((record) => titleMatches(title, record)) || null
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

function shouldRepairHref(href: string | null, expectedUrl: string): boolean {
    if (!expectedUrl) return false

    const value = String(href || "").trim()
    if (!value || value === "#" || value === "." || value === "./") return true
    if (value.includes(":slug")) return true

    const path = getSameOriginPath(value)
    return path === "/" || (path.startsWith("/case-studies/") && path !== expectedUrl)
}

function getAnchors(card: HTMLElement): HTMLAnchorElement[] {
    const anchors = new Set<HTMLAnchorElement>()

    if (card instanceof HTMLAnchorElement) anchors.add(card)

    card.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((anchor) => anchors.add(anchor))

    const closestAnchor = card.closest<HTMLAnchorElement>("a[href]")
    if (closestAnchor) anchors.add(closestAnchor)

    return Array.from(anchors)
}

function repairCardLink(card: HTMLElement, record: ProjectRecord): boolean {
    let didRepair = false

    getAnchors(card).forEach((anchor) => {
        if (record.unavailable) {
            anchor.removeAttribute("href")
            anchor.removeAttribute("data-framer-page-link-current")
            anchor.removeAttribute("aria-current")
            anchor.setAttribute("aria-disabled", "true")
            anchor.setAttribute("data-case-study-link-disabled", record.slug)
            anchor.setAttribute("aria-label", `${record.title} case study unavailable`)
            anchor.tabIndex = -1
            anchor.style.cursor = "default"
            anchor.addEventListener("click", preventDisabledProjectLinkClick, true)
            didRepair = true
            return
        }

        if (!shouldRepairHref(anchor.getAttribute("href"), record.url)) return

        anchor.setAttribute("href", record.url)
        anchor.removeAttribute("aria-disabled")
        anchor.removeAttribute("data-case-study-link-disabled")
        anchor.removeAttribute("data-framer-page-link-current")
        anchor.removeAttribute("aria-current")
        anchor.style.removeProperty("cursor")
        anchor.setAttribute("data-case-study-link-repaired", record.slug)
        didRepair = true
    })

    return didRepair
}

function preventDisabledProjectLinkClick(event: MouseEvent) {
    const target = event.target
    if (!(target instanceof Element)) return

    const anchor = target.closest<HTMLAnchorElement>(
        'a[data-case-study-link-disabled="john-steinbeck"]'
    )
    if (!anchor) return

    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
}

function isCurrentPageUrl(value: string): boolean {
    if (!value || typeof window === "undefined") return false

    try {
        const url = new URL(value, window.location.href)
        return url.origin === window.location.origin && url.pathname === window.location.pathname
    } catch {
        return value === "." || value === "./" || value === window.location.pathname
    }
}

function isUsableMediaUrl(value: string): boolean {
    if (!value) return false
    if (value.startsWith("blob:") || value.startsWith("data:")) return true
    if (isCurrentPageUrl(value)) return false

    try {
        const url = new URL(value, window.location.href)
        return /\.(mp4|mov|m4v|webm)(?:$|[?#])/i.test(url.pathname)
    } catch {
        return /\.(mp4|mov|m4v|webm)(?:$|[?#])/i.test(value)
    }
}

function getVideoSources(video: HTMLVideoElement): string[] {
    const sources = [
        video.currentSrc,
        video.src,
        video.getAttribute("src") || "",
        ...Array.from(video.querySelectorAll<HTMLSourceElement>("source")).map(
            (source) => source.src || source.getAttribute("src") || ""
        ),
    ]

    return sources.map((source) => source.trim()).filter(Boolean)
}

function getFallbackImage(video: HTMLVideoElement): HTMLImageElement | null {
    return video.parentElement?.querySelector<HTMLImageElement>(
        `img[${POSTER_FALLBACK_ATTR}="true"]`
    ) || null
}

function ensurePosterFallback(video: HTMLVideoElement): boolean {
    const poster = video.getAttribute("poster") || ""
    const parent = video.parentElement
    if (!poster || !parent) return false

    const computedPosition = window.getComputedStyle(parent).position
    if (computedPosition === "static") parent.style.position = "relative"

    let image = getFallbackImage(video)
    if (!image) {
        image = document.createElement("img")
        image.setAttribute(POSTER_FALLBACK_ATTR, "true")
        image.alt = ""
        image.decoding = "async"
        image.loading = "eager"
        image.style.position = "absolute"
        image.style.inset = "0"
        image.style.width = "100%"
        image.style.height = "100%"
        image.style.objectFit = "cover"
        image.style.display = "block"
        image.style.pointerEvents = "none"
        image.style.border = "0"
        image.style.zIndex = "1"
        parent.appendChild(image)
    }

    if (image.src !== poster) image.src = poster
    image.style.display = "block"

    video.pause()
    video.removeAttribute("src")
    video.querySelectorAll<HTMLSourceElement>("source").forEach((source) => {
        source.removeAttribute("src")
    })
    video.load()
    video.style.display = "none"
    video.style.pointerEvents = "none"
    video.setAttribute(INVALID_VIDEO_ATTR, "true")

    return true
}

function removePosterFallback(video: HTMLVideoElement) {
    const image = getFallbackImage(video)
    if (image) image.remove()

    if (video.getAttribute(INVALID_VIDEO_ATTR) === "true") {
        video.removeAttribute(INVALID_VIDEO_ATTR)
        video.style.display = ""
        video.style.pointerEvents = ""
    }
}

function repairThumbnailMedia(card: HTMLElement): boolean {
    let didRepair = false

    card.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
        const sources = getVideoSources(video)
        const hasUsableSource = sources.some(isUsableMediaUrl)
        const hasBrokenCurrentPageSource = sources.some(isCurrentPageUrl)

        if (!hasUsableSource && hasBrokenCurrentPageSource) {
            didRepair = ensurePosterFallback(video) || didRepair
            return
        }

        removePosterFallback(video)
    })

    return didRepair
}

function getCards(records: ProjectRecord[]): HTMLElement[] {
    if (typeof document === "undefined") return []

    const seen = new Set<HTMLElement>()
    const cards: HTMLElement[] = []

    document.querySelectorAll<HTMLElement>(CARD_SELECTOR).forEach((candidate) => {
        const card = candidate.closest<HTMLElement>('[data-framer-name="Card"], [name="Card"]') || candidate
        if (seen.has(card)) return
        if (!getCardRecord(card, records)) return

        seen.add(card)
        cards.push(card)
    })

    return cards
}

function repairHomeCards(records: ProjectRecord[]): number {
    let repairs = 0

    getCards(records).forEach((card) => {
        const record = getCardRecord(card, records)
        if (!record) return

        if (repairCardLink(card, record)) repairs += 1
        if (repairThumbnailMedia(card)) repairs += 1
    })

    return repairs
}

function useProjectCardRepair(enabled: boolean, urlOverrides: string) {
    React.useEffect(() => {
        if (!enabled || typeof window === "undefined" || !isProjectListingPage()) return

        const records = getProjectRecords(urlOverrides)
        let frame = 0
        const timeouts: number[] = []

        const run = () => {
            window.cancelAnimationFrame(frame)
            frame = window.requestAnimationFrame(() => {
                repairHomeCards(records)
            })
        }

        run()
        ;[75, 200, 500, 1000, 2000, 4000].forEach((delay) => {
            timeouts.push(window.setTimeout(run, delay))
        })

        const observer = new MutationObserver(run)
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["href", "src", "poster", "style"],
            childList: true,
            subtree: true,
        })

        window.addEventListener("pageshow", run)
        window.addEventListener("popstate", run)

        return () => {
            window.cancelAnimationFrame(frame)
            timeouts.forEach((timeout) => window.clearTimeout(timeout))
            observer.disconnect()
            window.removeEventListener("pageshow", run)
            window.removeEventListener("popstate", run)
        }
    }, [enabled, urlOverrides])
}

function ensureMobileFooterStyles() {
    if (typeof document === "undefined") return
    if (document.getElementById(MOBILE_FOOTER_STYLE_ID)) return

    const style = document.createElement("style")
    style.id = MOBILE_FOOTER_STYLE_ID
    style.textContent = MOBILE_FOOTER_STYLE
    document.head.appendChild(style)
}

function tagMobileFooterCta(): number {
    if (typeof document === "undefined") return 0

    let count = 0
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

        section.setAttribute(MOBILE_FOOTER_ATTRS.section, "true")
        container.setAttribute(MOBILE_FOOTER_ATTRS.container, "true")
        anchor.setAttribute(MOBILE_FOOTER_ATTRS.row, type)
        label.setAttribute(MOBILE_FOOTER_ATTRS.label, "true")
        if (meta instanceof HTMLElement) meta.setAttribute(MOBILE_FOOTER_ATTRS.meta, "true")
        count += 1
    })

    return count
}

function useCaseStudyMobileFooterLayout(enabled: boolean) {
    React.useEffect(() => {
        if (!enabled || typeof window === "undefined" || !isCaseStudyDetailPage()) return
        const W = window as unknown as Record<string, unknown>
        if (W[MOBILE_FOOTER_ACTIVE_KEY]) return
        W[MOBILE_FOOTER_ACTIVE_KEY] = true

        ensureMobileFooterStyles()

        let frame = 0
        const timeouts: number[] = []

        const run = () => {
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
            delete W[MOBILE_FOOTER_ACTIVE_KEY]
        }
    }, [enabled])
}

export default function CaseStudyLinkRepair({
    enabled = true,
    mobileFooterLayout = true,
    collectionId = "yTHrQWMIY",
    collectionModuleUrl = "",
    slugFieldId = "QmM3yYVVK",
    titleFieldId = "oeXZcmPna",
    urlOverrides = "",
}: Props) {
    void collectionId
    void collectionModuleUrl
    void slugFieldId
    void titleFieldId

    useProjectCardRepair(enabled, urlOverrides)
    useCaseStudyMobileFooterLayout(enabled && mobileFooterLayout)
    return null
}

addPropertyControls(CaseStudyLinkRepair, {
    enabled: {
        type: ControlType.Boolean,
        title: "Enabled",
        defaultValue: true,
    },
    mobileFooterLayout: {
        type: ControlType.Boolean,
        title: "Mobile Footer",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    collectionId: {
        type: ControlType.String,
        title: "Collection",
        defaultValue: "yTHrQWMIY",
        hidden: () => true,
    },
    collectionModuleUrl: {
        type: ControlType.String,
        title: "Module URL",
        defaultValue: "",
        hidden: () => true,
    },
    slugFieldId: {
        type: ControlType.String,
        title: "Slug Field",
        defaultValue: "QmM3yYVVK",
        hidden: () => true,
    },
    titleFieldId: {
        type: ControlType.String,
        title: "Title Field",
        defaultValue: "oeXZcmPna",
        hidden: () => true,
    },
    urlOverrides: {
        type: ControlType.String,
        title: "URL Overrides",
        defaultValue: "",
        displayTextArea: true,
        placeholder: "slug=/case-studies/custom-slug",
    },
})
