import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import { addPropertyControls, ControlType } from "framer"

type FramerResponsiveImage = {
    src: string
    srcSet?: string
    alt?: string
    width?: number
    height?: number
}

const INDEX_GRID_GAP = "var(--idx-grid-gap, 20px)"
const INDEX_GRID_TEMPLATE = "repeat(6, minmax(0, 1fr))"
const FALLBACK_THUMBNAIL_ASPECT_RATIO = 16 / 9
const LIGHT_GRAY = "#979797"

const indexGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: INDEX_GRID_TEMPLATE,
    columnGap: INDEX_GRID_GAP,
    width: "100%",
}

const tokens = {
    textPrimary: "#26211f",
    textSecondary: "#636363",
    textTertiary: "#979797",
    bg: "#F7F5F0",
    dividerStrong: LIGHT_GRAY,
    dividerSubtle: LIGHT_GRAY,
    surfaceOverlay: "rgba(215, 213, 207, 0.72)",
    surfaceActive: "#EAE8E3",
    fontDisplay: "'GT Standard Trial', 'Inter', sans-serif",
    fontHeading: "'GT Standard Trial', 'Inter', sans-serif",
    fontMono: "'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace",
}

type Project = {
    title: string
    category1: string
    category2?: string
    category3?: string
    industry: string
    year: string | number
    thumbnail?: string | FramerResponsiveImage
    thumbnailVideoLink?: string
    slug?: string
    sortOrder?: number
    isHomepage?: boolean
}

type Filters = {
    disciplines: string[]
    industries: string[]
    years: string[]
}

type ListTypographyVariant = "standard" | "mono13"
type ListHoverVariant = "flip" | "highlight"

const DISCIPLINE_NAV_ITEMS = [
    "Visual Identity",
    "Brand Strategy",
    "UX/UI",
    "2D Motion",
    "3D Motion",
    "Packaging",
    "Product",
    "Editorial",
]

const DISCIPLINE_NAV_SET = new Set<string>(DISCIPLINE_NAV_ITEMS)

const INDUSTRY_NAV_ITEMS = [
    "Consumer Electronics / Technology",
    "Publishing",
    "Citizen Science / Biodiversity",
    "Outdoor Retail / Consumer Goods",
    "Design Education / Motion Design",
    "Food Tech / Health & Wellness",
    "Social Enterprise / Consumer Goods",
    "Human Rights / Editorial",
    "Design Education / Brand Consulting",
    "Landscaping / Home Services",
    "Science Communication / Experimental Motion",
    "Music / Experimental Motion",
    "Literature / Publishing / Education",
    "Politics / Protest",
    "Film / Documentary / Public Media",
]

const YEAR_NAV_ITEMS = ["2026", "2025", "2024", "2023", "2019-ongoing"]

const DISCIPLINE_ALIASES: Record<string, string> = {
    "Brand Identity": "Visual Identity",
    "Visual Systems": "Visual Identity",
    "Event Identity": "Visual Identity",
    "Art Direction": "Visual Identity",
    Illustration: "Visual Identity",
    "UI/UX Design": "UX/UI",
    "Interface Design": "UX/UI",
    "Experience Design": "UX/UI",
    "AI Prototyping": "UX/UI",
    "Archive Design": "UX/UI",
    "Data Visualization": "UX/UI",
    "Motion Design": "2D Motion",
    Motion: "2D Motion",
    "3D / Cinematic": "3D Motion",
    Cinematic: "3D Motion",
    "Packaging Design": "Packaging",
    "Product Design": "Product",
    Prototyping: "Product",
    "Publication Design": "Editorial",
    "Editorial Design": "Editorial",
    "Book Design": "Editorial",
    "Poster Design": "Editorial",
    Typography: "Editorial",
    "Type Specimen": "Editorial",
}

const DEFAULT_PROJECTS: Project[] = [
    {
        title: "AirPods Pro 3",
        category1: "Visual Identity",
        category2: "2D Motion",
        category3: "3D Motion",
        industry: "Consumer Electronics / Technology",
        year: "2025",
        thumbnail: "https://framerusercontent.com/images/JITjBIRyOd5DdC7juV7X5RwU9I.jpg",
        thumbnailVideoLink:
            "https://freight.cargo.site/i/V2732716404789921262344304055829/AirPods-Pro-3-Introduction-1.mp4",
        isHomepage: true,
        slug: "airpods-pro-3",
        sortOrder: 1,
    },
    {
        title: "Simon & Schuster",
        category1: "Brand Strategy",
        category2: "Visual Identity",
        category3: "UX/UI",
        industry: "Publishing",
        year: "2025",
        thumbnail: "https://framerusercontent.com/images/ZViKn9ASVVsE90tOfnWU7sW0U.png",
        thumbnailVideoLink: "",
        isHomepage: true,
        slug: "simon-schuster",
        sortOrder: 2,
    },
    {
        title: "Gaia",
        category1: "Brand Strategy",
        category2: "UX/UI",
        category3: "Product",
        industry: "Citizen Science / Biodiversity",
        year: "2026",
        thumbnail: "https://framerusercontent.com/images/1a1LDlRx4V2kNoG7kX7hvWygUCg.jpg",
        thumbnailVideoLink: "",
        isHomepage: true,
        slug: "gaia",
        sortOrder: 3,
    },
    {
        title: "National Park Playing Cards",
        category1: "Product",
        category2: "Packaging",
        category3: "Visual Identity",
        industry: "Outdoor Retail / Consumer Goods",
        year: "2019-ongoing",
        thumbnail: "https://framerusercontent.com/images/YdGKidrUlzOXfODfaQNqfCx5dM.png",
        thumbnailVideoLink: "",
        isHomepage: true,
        slug: "national-park-cards",
        sortOrder: 4,
    },
    {
        title: "Motion Connect 2025",
        category1: "Visual Identity",
        category2: "2D Motion",
        category3: "Editorial",
        industry: "Design Education / Motion Design",
        year: "2025",
        thumbnail: "https://framerusercontent.com/images/W592y16ERqrZ1qFuxRe3dcsv8I.jpg",
        thumbnailVideoLink:
            "https://freight.cargo.site/i/K2717924145885630584799912777237/Motion-Connect_1.mp4",
        isHomepage: true,
        slug: "motion-connect-2025",
        sortOrder: 5,
    },
    {
        title: "Yomo",
        category1: "Visual Identity",
        category2: "UX/UI",
        category3: "Product",
        industry: "Food Tech / Health & Wellness",
        year: "2025",
        thumbnail: "https://framerusercontent.com/images/PXsrzy7ezkkjSfUrVHhUuP2sk4k.jpg",
        thumbnailVideoLink: "",
        isHomepage: true,
        slug: "yomo",
        sortOrder: 6,
    },
    {
        title: "Karuna",
        category1: "Visual Identity",
        category2: "Packaging",
        category3: "Product",
        industry: "Social Enterprise / Consumer Goods",
        year: "2025",
        thumbnail: "https://framerusercontent.com/images/Dj1KLsghEL5tCJkNgSjKFvuIMMU.png",
        thumbnailVideoLink: "",
        isHomepage: false,
        slug: "karuna",
        sortOrder: 7,
    },
    {
        title: "Weaponized Innocence",
        category1: "Editorial",
        category2: "UX/UI",
        category3: "Visual Identity",
        industry: "Human Rights / Editorial",
        year: "2024",
        thumbnail: "https://framerusercontent.com/images/BRh73XzVlRBoYNh03pKXVIYYPw.png",
        thumbnailVideoLink: "",
        isHomepage: true,
        slug: "weaponized-innocence",
        sortOrder: 8,
    },
    {
        title: "Wolff Olins x ArtCenter",
        category1: "Visual Identity",
        category2: "",
        category3: "",
        industry: "Design Education / Brand Consulting",
        year: "2024",
        thumbnail: "",
        thumbnailVideoLink: "",
        isHomepage: false,
        slug: "wolff-olins-x-artcenter",
        sortOrder: 9,
    },
    {
        title: "Aspen Valley Landscaping",
        category1: "Visual Identity",
        category2: "Brand Strategy",
        category3: "",
        industry: "Landscaping / Home Services",
        year: "2024",
        thumbnail: "",
        thumbnailVideoLink: "",
        isHomepage: false,
        slug: "aspen-valley-landscaping",
        sortOrder: 10,
    },
    {
        title: "Cellular Symphony",
        category1: "3D Motion",
        category2: "",
        category3: "",
        industry: "Science Communication / Experimental Motion",
        year: "2024",
        thumbnail: "https://framerusercontent.com/images/j9uS8SZ6aEBOUihZfXOWVeSrVs8.jpg",
        thumbnailVideoLink:
            "https://freight.cargo.site/i/K1779235211065582686951637767701/cellular-symphony-Apple-Devices-HD-Best-Quality.m4v",
        isHomepage: false,
        slug: "cellular-symphony",
        sortOrder: 11,
    },
    {
        title: "Neon Lights",
        category1: "2D Motion",
        category2: "",
        category3: "",
        industry: "Music / Experimental Motion",
        year: "2024",
        thumbnail: "",
        thumbnailVideoLink: "https://player.vimeo.com/video/903963136",
        isHomepage: false,
        slug: "neon-lights",
        sortOrder: 12,
    },
    {
        title: "John Steinbeck",
        category1: "Editorial",
        category2: "Visual Identity",
        category3: "",
        industry: "Literature / Publishing / Education",
        year: "2023",
        thumbnail: "",
        thumbnailVideoLink: "",
        isHomepage: false,
        slug: "john-steinbeck",
        sortOrder: 13,
    },
    {
        title: "Seek Truth",
        category1: "Editorial",
        category2: "Visual Identity",
        category3: "",
        industry: "Politics / Protest",
        year: "2024",
        thumbnail: "https://framerusercontent.com/images/ZZz0tz3CmTn9Zwf1r21GPbcqFNk.png",
        thumbnailVideoLink: "",
        isHomepage: false,
        slug: "seek-truth",
        sortOrder: 14,
    },
    {
        title: "Independent Lens",
        category1: "Editorial",
        category2: "Visual Identity",
        category3: "",
        industry: "Film / Documentary / Public Media",
        year: "2024",
        thumbnail: "https://framerusercontent.com/images/2l7fi2HvjNmusO8H6tXWKotl8.jpg",
        thumbnailVideoLink: "",
        isHomepage: false,
        slug: "independent-lens",
        sortOrder: 15,
    },
]

function canonicalDiscipline(value: string): string | undefined {
    const trimmed = value.trim()
    const canonical = DISCIPLINE_ALIASES[trimmed] ?? trimmed
    return DISCIPLINE_NAV_SET.has(canonical) ? canonical : undefined
}

function getDisciplines(p: Project): string[] {
    const disciplines = [p.category1, p.category2, p.category3]
        .filter((c): c is string => !!c && c.trim() !== "")
        .map(canonicalDiscipline)
        .filter((c): c is string => !!c)

    return Array.from(new Set(disciplines))
}

function normalizeProjectDisciplines(p: Project): Project {
    const [category1 = "", category2 = "", category3 = ""] = getDisciplines(p)
    return { ...p, category1, category2, category3 }
}

function getDisciplineDisplay(p: Project): string {
    return getDisciplines(p).join(", ")
}

function normalizeYearValue(year: Project["year"]): string {
    return String(year ?? "").trim()
}

function getYearSortValue(year: Project["year"]): number {
    const match = normalizeYearValue(year).match(/\d{4}/)
    return match ? Number(match[0]) : Number.NEGATIVE_INFINITY
}

function sortProjects(a: Project, b: Project): number {
    const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER
    const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER
    return aOrder - bOrder || a.title.localeCompare(b.title)
}

function getIndustryNavItems(projects?: Project[]): string[] {
    if (!projects || projects.length === 0) return INDUSTRY_NAV_ITEMS

    const items: string[] = []
    const seen = new Set<string>()

    ;[...projects].sort(sortProjects).forEach((p) => {
        const industry = p.industry?.trim()
        if (!industry || seen.has(industry)) return
        seen.add(industry)
        items.push(industry)
    })

    return items.length > 0 ? items : INDUSTRY_NAV_ITEMS
}

function getYearNavItems(projects?: Project[]): string[] {
    if (!projects || projects.length === 0) return YEAR_NAV_ITEMS

    const items: string[] = []
    const seen = new Set<string>()

    ;[...projects]
        .sort((a, b) => getYearSortValue(b.year) - getYearSortValue(a.year) || sortProjects(a, b))
        .forEach((p) => {
            const year = normalizeYearValue(p.year)
            if (!year || seen.has(year)) return
            seen.add(year)
            items.push(year)
        })

    return items.length > 0 ? items : YEAR_NAV_ITEMS
}

function getCaseStudyUrl(p: Project): string {
    return p.slug ? `/case-studies/${p.slug}` : ""
}

function normalizeResponsiveImage(
    image: Project["thumbnail"],
    fallbackAlt: string
): FramerResponsiveImage | undefined {
    if (!image) return undefined

    if (typeof image === "string") {
        const src = image.trim()
        return src ? { src, alt: fallbackAlt } : undefined
    }

    if (typeof image === "object" && typeof image.src === "string") {
        const src = image.src.trim()
        if (!src) return undefined
        return {
            ...image,
            src,
            alt: image.alt || fallbackAlt,
        }
    }

    return undefined
}

function getIntrinsicAspectRatio(image?: FramerResponsiveImage): number | undefined {
    if (!image?.width || !image?.height || image.height <= 0) return undefined

    const ratio = image.width / image.height
    return Number.isFinite(ratio) && ratio > 0 ? ratio : undefined
}

function isEmbeddableVideoUrl(url?: string): boolean {
    if (!url) return false
    return /player\.vimeo\.com|youtube\.com\/embed/i.test(url)
}

function isDirectVideoUrl(url?: string): boolean {
    if (!url) return false
    return /\.(mp4|m4v|mov|webm)(\?|$)/i.test(url)
}

function groupByYear(projects: Project[]) {
    const map: Record<string, Project[]> = {}
    for (const p of projects) {
        const year = normalizeYearValue(p.year)
        if (!year) continue
        if (!map[year]) map[year] = []
        map[year].push(p)
    }
    return Object.entries(map)
        .sort(([a], [b]) => getYearSortValue(b) - getYearSortValue(a) || b.localeCompare(a))
        .map(([year, items]) => ({ year, items: items.sort(sortProjects) }))
}

function filterProjects(projects: Project[], filters: Filters, query: string): Project[] {
    return projects.filter((p) => {
        const pDisciplines = getDisciplines(p)
        const year = normalizeYearValue(p.year)
        const matchDiscipline =
            filters.disciplines.length === 0 ||
            filters.disciplines.some((d) => pDisciplines.includes(d))
        const matchIndustry =
            filters.industries.length === 0 || filters.industries.includes(p.industry)
        const matchYear = filters.years.length === 0 || filters.years.includes(year)
        const matchSearch = !query || p.title.toLowerCase().includes(query.toLowerCase())
        return matchDiscipline && matchIndustry && matchYear && matchSearch
    })
}

const GLOBAL_CSS = `
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
    background-color: ${tokens.dividerStrong} !important;
    border-color: ${tokens.dividerStrong} !important;
    opacity: 1 !important;
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

  .idx-toggle-fixed,
  .idx-toggle-fixed *,
  .idx-toggle-fixed button {
    color: ${tokens.textPrimary} !important;
    -webkit-text-fill-color: ${tokens.textPrimary} !important;
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

  .idx-row-divider {
    background-color: ${tokens.dividerSubtle} !important;
    border-color: ${tokens.dividerSubtle} !important;
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
  }

  .idx-project-grid {
    display: flex;
    flex-direction: column;
    gap: 120px;
    width: 100%;
  }
  .idx-project-grid-row {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    width: 100%;
  }
  .idx-grid-card {
    min-width: 0;
    display: block;
    animation: idxFadeUp 300ms ease both;
  }
  .idx-grid-card-link {
    display: block;
    width: 100%;
    color: inherit;
    text-decoration: none;
  }
  .idx-grid-card-link:focus-visible {
    outline: 1px solid ${tokens.textPrimary};
    outline-offset: 4px;
  }
  .idx-grid-card-meta {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
    min-width: 0;
    margin-bottom: 16px;
    font-family: ${tokens.fontMono};
    font-size: 13px;
    line-height: 1;
    letter-spacing: 0;
    text-transform: uppercase;
    color: ${tokens.textPrimary};
  }
  .idx-grid-card-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .idx-grid-card-media {
    position: relative;
    width: 100%;
    overflow: hidden;
    background: ${tokens.surfaceActive};
  }
  .idx-grid-card-image {
    display: block;
    width: 100%;
    height: auto;
  }
  .idx-grid-card-media.has-known-ratio .idx-grid-card-image {
    height: 100%;
    object-fit: cover;
  }
  .idx-grid-card-video,
  .idx-grid-card-embed {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 0;
  }

  .idx-tax-label-discipline { grid-column: 1 / span 1; }
  .idx-tax-items-discipline { grid-column: 2 / span 1; }
  .idx-tax-label-industry { grid-column: 3 / span 1; }
  .idx-tax-items-industry { grid-column: 4 / span 1; }
  .idx-tax-label-year { grid-column: 5 / span 1; }
  .idx-tax-items-year { grid-column: 6 / span 1; }

  .idx-list-title { grid-column: 1 / span 2; }
  .idx-list-discipline { grid-column: 3 / span 2; }
  .idx-list-industry { grid-column: 5 / span 1; }

  @media (max-width: 1199px) {
    .idx-container { padding: 0 20px !important; }
  }
  @media (max-width: 809px) {
    .idx-container { --idx-grid-gap: 12px; padding: 0 20px !important; }
    .idx-taxonomy-shell { grid-template-columns: max-content minmax(0, 1fr) !important; column-gap: 20px !important; row-gap: 28px !important; }
    .idx-tax-label-discipline,
    .idx-tax-label-industry,
    .idx-tax-label-year { grid-column: 1 / span 1; }
    .idx-tax-items-discipline,
    .idx-tax-items-industry,
    .idx-tax-items-year { grid-column: 2 / span 1; }
    .idx-taxonomy-items { overflow: visible !important; }
    .idx-tax-item { white-space: normal !important; overflow-wrap: anywhere; }
    .idx-toggle-fixed { left: 50% !important; transform: translateX(-50%) !important; }
    .idx-list-standard .idx-year-number { font-size: 28px !important; }
    .idx-year-group { grid-template-columns: 1fr !important; row-gap: 8px !important; }
    .idx-year-label,
    .idx-list-content { grid-column: 1 / -1 !important; }
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
    .idx-project-grid { gap: 48px !important; }
    .idx-project-grid-row { flex-direction: column !important; gap: 48px !important; }
    .idx-grid-card { flex: 1 1 auto !important; width: 100% !important; }
    .idx-grid-card-title { white-space: normal !important; overflow-wrap: anywhere; }
  }
  @media (max-width: 520px) {
    .idx-taxonomy-shell { grid-template-columns: 1fr !important; row-gap: 0 !important; }
    .idx-tax-label-discipline,
    .idx-tax-label-industry,
    .idx-tax-label-year,
    .idx-tax-items-discipline,
    .idx-tax-items-industry,
    .idx-tax-items-year { grid-column: 1 / -1 !important; }
    .idx-tax-label-industry,
    .idx-tax-label-year { margin-top: 20px; }
    .idx-list-row-grid { grid-template-columns: 1fr !important; row-gap: 0 !important; }
    .idx-list-discipline,
    .idx-list-industry { grid-column: 1 / -1 !important; }
  }
`

function TaxonomySection({
    filters,
    industryNavItems,
    yearNavItems,
    onFilterToggle,
    onClearFilters,
}: {
    filters: Filters
    industryNavItems: string[]
    yearNavItems: string[]
    onFilterToggle: (type: "disciplines" | "industries" | "years", value: string) => void
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
        lineHeight: "28px",
        textTransform: "uppercase",
        color: tokens.textPrimary,
        letterSpacing: 0,
    }

    const labelStyle: React.CSSProperties = {
        minWidth: 0,
        font: "inherit",
        lineHeight: "28px",
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
        lineHeight: "28px",
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
                <div className="idx-taxonomy-label idx-tax-label-discipline" style={labelStyle}>
                    Discipline
                </div>
                <div className="idx-taxonomy-items idx-tax-items-discipline" style={itemsStyle}>
                    {DISCIPLINE_NAV_ITEMS.map((d) => (
                        <button
                            key={d}
                            type="button"
                            className="idx-tax-item"
                            style={itemStyle(filters.disciplines.includes(d))}
                            aria-pressed={filters.disciplines.includes(d)}
                            onClick={() => onFilterToggle("disciplines", d)}
                        >
                            {d}
                        </button>
                    ))}
                </div>

                <div className="idx-taxonomy-label idx-tax-label-industry" style={labelStyle}>
                    Industry
                </div>
                <div className="idx-taxonomy-items idx-tax-items-industry" style={itemsStyle}>
                    {industryNavItems.map((i) => (
                        <button
                            key={i}
                            type="button"
                            className="idx-tax-item"
                            style={itemStyle(filters.industries.includes(i))}
                            aria-pressed={filters.industries.includes(i)}
                            onClick={() => onFilterToggle("industries", i)}
                        >
                            {i}
                        </button>
                    ))}
                </div>

                <div className="idx-taxonomy-label idx-tax-label-year" style={labelStyle}>
                    Year
                </div>
                <div className="idx-taxonomy-items idx-tax-items-year" style={itemsStyle}>
                    {yearNavItems.map((y) => (
                        <button
                            key={y}
                            type="button"
                            className="idx-tax-item"
                            style={itemStyle(filters.years.includes(y))}
                            aria-pressed={filters.years.includes(y)}
                            onClick={() => onFilterToggle("years", y)}
                        >
                            {y}
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
    height,
}: {
    text: string
    activeText?: string
    style: React.CSSProperties
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
                <span className="idx-flip-copy">{activeText ?? text}</span>
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

    return (
        <div className={`idx-list-view idx-list-${typographyVariant} idx-hover-${hoverVariant}`}>
            {groups.map(({ year, items }, groupIndex) => (
                <div key={year} className="idx-year-group" style={indexGridStyle}>
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
                        style={{ gridColumn: "1 / span 1", minWidth: 0, paddingTop: isMono13 ? 5 : 6 }}
                    >
                        <div
                            className="idx-year-number"
                            style={
                                isMono13
                                    ? mono13TextStyle
                                    : {
                                          fontFamily: tokens.fontDisplay,
                                          fontSize: 40,
                                          fontWeight: 300,
                                          color: tokens.textPrimary,
                                          lineHeight: 1.3,
                                      }
                            }
                        >
                            {year}
                        </div>
                    </div>

                    <div className="idx-list-content" style={{ gridColumn: "2 / span 5", minWidth: 0 }}>
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
                                            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                                            columnGap: INDEX_GRID_GAP,
                                            alignItems: "center",
                                            minHeight: isMono13 ? 38 : 56,
                                            padding: isMono13 ? "5px 0" : "9px 0",
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
                                                    activeText={url ? "View Project" : p.title}
                                                    style={titleTextStyle}
                                                    height={titleFlipHeight}
                                                />
                                            ) : (
                                                <span style={titleTextStyle}>{p.title}</span>
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
                                            <span style={mono13TextStyle}>{disciplineText}</span>
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
                                            <span style={mono13TextStyle}>{p.industry}</span>
                                        </div>
                                    </div>

                                    {ri < items.length - 1 && (
                                        <div
                                            className="idx-rule idx-row-divider"
                                            style={{
                                                height: 1,
                                                backgroundColor: tokens.dividerSubtle,
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
        </div>
    )
}

const GRID_ROW_PATTERNS = [
    [2, 1, 1],
    [1, 2, 1],
    [1, 1, 2],
    [1, 2, 1],
]

function getGridRows(projects: Project[]): Project[][] {
    const rows: Project[][] = []
    for (let i = 0; i < projects.length; i += 3) {
        rows.push(projects.slice(i, i + 3))
    }
    return rows
}

function GridProjectCard({
    project,
    index,
    weight,
}: {
    project: Project
    index: number
    weight: number
}) {
    const href = getCaseStudyUrl(project)
    const thumbnail = normalizeResponsiveImage(
        project.thumbnail,
        `${project.title} thumbnail`
    )
    const intrinsicAspectRatio = getIntrinsicAspectRatio(thumbnail)
    const hasKnownRatio = !!intrinsicAspectRatio
    const videoUrl = project.thumbnailVideoLink?.trim()
    const directVideoUrl = isDirectVideoUrl(videoUrl) ? videoUrl : undefined
    const mediaClassName = [
        "idx-grid-card-media",
        "ImageWrapper",
        directVideoUrl ? "VideoWrapper uses-video-thumbnail" : "",
        hasKnownRatio ? "has-known-ratio" : "",
    ]
        .filter(Boolean)
        .join(" ")
    const mediaStyle: React.CSSProperties = {
        aspectRatio:
            intrinsicAspectRatio ??
            (directVideoUrl || !thumbnail
                ? FALLBACK_THUMBNAIL_ASPECT_RATIO
                : undefined),
    }

    const cardContent = (
        <>
            <div className="idx-grid-card-meta">
                <span>{project.sortOrder ?? index + 1}</span>
                <span aria-hidden="true">/</span>
                <span className="idx-grid-card-title">{project.title}</span>
            </div>

            <div
                className={mediaClassName}
                data-framer-name={directVideoUrl ? "VideoWrapper" : "ImageWrapper"}
                style={mediaStyle}
            >
                {thumbnail && !directVideoUrl ? (
                    <img
                        className="idx-grid-card-image"
                        src={thumbnail.src}
                        srcSet={thumbnail.srcSet}
                        alt={thumbnail.alt || `${project.title} thumbnail`}
                        loading="lazy"
                        decoding="async"
                    />
                ) : !directVideoUrl ? (
                    <div aria-hidden="true" style={{ width: "100%", height: "100%" }} />
                ) : null}

                {directVideoUrl && (
                    <video
                        className="idx-grid-card-video idx-grid-card-video-thumbnail ThumbnailVideo"
                        data-framer-name="ThumbnailVideo"
                        src={directVideoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                    />
                )}

                {!thumbnail && isEmbeddableVideoUrl(videoUrl) && (
                    <iframe
                        className="idx-grid-card-embed ThumbnailVideo"
                        data-framer-name="ThumbnailVideo"
                        src={videoUrl}
                        title={`${project.title} video thumbnail`}
                        loading="lazy"
                        allow="autoplay; fullscreen; picture-in-picture"
                    />
                )}
            </div>
        </>
    )

    return (
        <div
            className="idx-grid-card"
            style={{
                flex: `${weight} 1 0`,
                animationDelay: `${Math.min(index, 12) * 30}ms`,
            }}
        >
            {href ? (
                <a className="idx-grid-card-link" href={href} aria-label={`View ${project.title}`}>
                    {cardContent}
                </a>
            ) : (
                <div className="idx-grid-card-link" role="article" aria-label={project.title}>
                    {cardContent}
                </div>
            )}
        </div>
    )
}

function GridView({ projects }: { projects: Project[] }) {
    const rows = useMemo(() => getGridRows(projects), [projects])

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
        <div className="idx-project-grid" aria-label="Filtered project grid">
            {rows.map((row, rowIndex) => {
                const pattern = GRID_ROW_PATTERNS[rowIndex % GRID_ROW_PATTERNS.length]
                return (
                    <div className="idx-project-grid-row" key={row.map((p) => p.title).join("-")}>
                        {row.map((project, columnIndex) => (
                            <GridProjectCard
                                key={project.title}
                                project={project}
                                index={rowIndex * 3 + columnIndex}
                                weight={pattern[columnIndex] ?? 1}
                            />
                        ))}
                    </div>
                )
            })}
        </div>
    )
}

function ViewToggle({
    activeView,
    onViewChange,
}: {
    activeView: string
    onViewChange: (v: string) => void
}) {
    const toggleOptions = ["list", "grid"] as const

    const btnBase = (active: boolean): React.CSSProperties => ({
        padding: "6px 10px",
        width: "100%",
        fontFamily: tokens.fontMono,
        fontSize: 14,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: tokens.textPrimary,
        WebkitTextFillColor: tokens.textPrimary,
        cursor: "pointer",
        border: "none",
        background: active ? tokens.surfaceActive : "none",
        borderRadius: 4,
        transition: "all 200ms ease",
        lineHeight: 1,
        textAlign: "center",
    })

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${toggleOptions.length}, minmax(0, 1fr))`,
                alignItems: "center",
                width: 148,
                padding: 3,
                borderRadius: 4,
                color: tokens.textPrimary,
                background: tokens.surfaceOverlay,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
            }}
        >
            {toggleOptions.map((v) => (
                <button key={v} style={btnBase(activeView === v)} onClick={() => onViewChange(v)}>
                    {v}
                </button>
            ))}
        </div>
    )
}

export default function IndexPage({
    projects: projectsProp,
    defaultView = "list",
    listTypographyVariant = "standard",
    listHoverVariant = "flip",
}: {
    projects?: Project[]
    defaultView?: string
    listTypographyVariant?: ListTypographyVariant
    listHoverVariant?: ListHoverVariant
}) {
    const hasBoundProjects = !!projectsProp && projectsProp.length > 0
    const allProjects = useMemo(() => {
        const sourceProjects = hasBoundProjects ? projectsProp! : DEFAULT_PROJECTS
        return sourceProjects.map(normalizeProjectDisciplines).sort(sortProjects)
    }, [hasBoundProjects, projectsProp])
    const initialView = defaultView === "grid" ? "grid" : "list"

    const [activeView, setActiveView] = useState(initialView)
    const [transitioning, setTransitioning] = useState(false)
    const [renderKey, setRenderKey] = useState(0)
    const [filters, setFilters] = useState<Filters>({ disciplines: [], industries: [], years: [] })
    const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const industryNavItems = useMemo(() => getIndustryNavItems(allProjects), [allProjects])
    const yearNavItems = useMemo(() => getYearNavItems(allProjects), [allProjects])
    const handleViewChange = useCallback((v: string) => {
        if (v === activeView) return
        if (transitionTimer.current) clearTimeout(transitionTimer.current)
        setTransitioning(true)
        transitionTimer.current = setTimeout(() => {
            setActiveView(v)
            setRenderKey((k) => k + 1)
            setTransitioning(false)
            transitionTimer.current = null
        }, 150)
    }, [activeView])

    useEffect(() => () => {
        if (transitionTimer.current) clearTimeout(transitionTimer.current)
    }, [])

    const handleFilterToggle = useCallback(
        (type: "disciplines" | "industries" | "years", value: string) => {
            setFilters((prev) => {
                const arr = prev[type]
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

    const handleClearFilters = useCallback(
        () => setFilters({ disciplines: [], industries: [], years: [] }),
        []
    )

    const filteredProjects = useMemo(
        () => filterProjects(allProjects, filters, ""),
        [allProjects, filters]
    )

    return (
        <>
            <style>{GLOBAL_CSS}</style>

            <div
                className="idx-container"
                style={{
                    width: "100%",
                    color: tokens.textPrimary,
                    fontFamily: tokens.fontMono,
                    boxSizing: "border-box",
                    minHeight: "60vh",
                    padding: "0 20px",
                    WebkitFontSmoothing: "antialiased",
                    MozOsxFontSmoothing: "grayscale",
                } as React.CSSProperties}
            >
                <div
                    style={{
                        opacity: 1,
                        pointerEvents: "auto",
                        transition: "opacity 200ms ease",
                        marginBottom: 40,
                    }}
                >
                    <TaxonomySection
                        filters={filters}
                        industryNavItems={industryNavItems}
                        yearNavItems={yearNavItems}
                        onFilterToggle={handleFilterToggle}
                        onClearFilters={handleClearFilters}
                    />
                </div>

                <div
                    key={renderKey}
                    style={{
                        opacity: transitioning ? 0 : 1,
                        transition: transitioning ? "opacity 150ms ease" : "opacity 250ms ease",
                    }}
                >
                    {activeView === "grid" ? (
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
                        marginTop: 48,
                        paddingBottom: 80,
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

            <div
                className="idx-toggle-fixed"
                style={{
                    position: "fixed",
                    bottom: 20,
                    left: 20,
                    zIndex: 100,
                }}
            >
                <ViewToggle activeView={activeView} onViewChange={handleViewChange} />
            </div>
        </>
    )
}

addPropertyControls(IndexPage, {
    projects: {
        type: ControlType.Array,
        title: "Projects",
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title" },
                category1: { type: ControlType.String, title: "Category 1" },
                category2: { type: ControlType.String, title: "Category 2" },
                category3: { type: ControlType.String, title: "Category 3" },
                industry: { type: ControlType.String, title: "Industry" },
                year: { type: ControlType.String, title: "Year" },
                thumbnail: { type: ControlType.ResponsiveImage, title: "Thumbnail" },
                thumbnailVideoLink: { type: ControlType.String, title: "Thumbnail Video Link" },
                slug: { type: ControlType.String, title: "Slug" },
                sortOrder: { type: ControlType.Number, title: "Sorting Number" },
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
})
