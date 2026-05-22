// @ts-nocheck
import React, { useEffect, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"
// @ts-ignore Framer code component module URL supplied by getComponentInsertUrlAndTypes.
import IndexPage from "https://framer.com/m/IndexPage-msQHCf.js"
type ListTypographyVariant = "standard" | "mono13"
type ListHoverVariant = "flip" | "highlight"

const PROJECT_META: Record<
    string,
    { services: string; industry: string; year: string }
> = {
    "AirPods Pro 3": {
        services: "Visual Identity, 2D Motion, 3D Motion",
        industry: "Technology",
        year: "2025",
    },
    "Simon & Schuster": {
        services: "Brand Strategy, Visual Identity, Editorial",
        industry: "Literature",
        year: "2025",
    },
    Gaia: {
        services: "Visual Identity, UX/UI, Brand Strategy",
        industry: "Nature & Outdoors",
        year: "2026",
    },
    "National Park Playing Cards": {
        services: "Product, Packaging, Visual Identity",
        industry: "Nature & Outdoors",
        year: "2019",
    },
    "Motion Connect 2025": {
        services: "Visual Identity, 2D Motion, Social Media",
        industry: "Design Education",
        year: "2025",
    },
    Yomo: {
        services: "Visual Identity, UX/UI",
        industry: "Health & Wellness",
        year: "2025",
    },
    Karuna: {
        services: "Visual Identity, Packaging, Product",
        industry: "Nature & Outdoors",
        year: "2025",
    },
    "Weaponized Innocence": {
        services: "Editorial, UX/UI, Visual Identity",
        industry: "Human Rights",
        year: "2024",
    },
    "Wolff Olins x ArtCenter": {
        services: "Visual Identity, 2D Motion, Social Media",
        industry: "Design Education",
        year: "2024",
    },
    "Aspen Valley Landscaping": {
        services: "Visual Identity, Brand Strategy",
        industry: "Nature & Outdoors",
        year: "2024",
    },
    "Cellular Symphony": {
        services: "3D Motion",
        industry: "Science",
        year: "2024",
    },
    "Neon Lights": {
        services: "2D Motion",
        industry: "Music",
        year: "2024",
    },
    "John Steinbeck": {
        services: "Editorial, Visual Identity",
        industry: "Literature",
        year: "2023",
    },
    "Seek Truth": {
        services: "Editorial, Visual Identity",
        industry: "Human Rights",
        year: "2024",
    },
    "Independent Lens": {
        services: "Editorial, Visual Identity",
        industry: "Human Rights",
        year: "2024",
    },
}

const breakpointCss = `
  .idx-view-toggle {
    font-family: 'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace !important;
    font-size: 13px !important;
    font-weight: 400 !important;
    line-height: 28px !important;
    text-transform: uppercase !important;
    letter-spacing: 0 !important;
    color: #636363 !important;
    align-items: baseline !important;
    margin-top: 12px !important;
    margin-bottom: 24px !important;
  }

  .idx-taxonomy-shell + .idx-tax-item {
    display: block !important;
    margin-top: 12px !important;
    line-height: 28px !important;
  }

  .idx-view-toggle-option,
  .idx-view-toggle-divider {
    font: inherit !important;
    line-height: inherit !important;
    text-transform: inherit !important;
    letter-spacing: inherit !important;
    color: #636363 !important;
    -webkit-text-fill-color: #636363 !important;
  }

  .idx-view-toggle-option[data-active="true"] {
    color: #636363 !important;
    text-decoration: underline !important;
    text-underline-offset: 3px !important;
  }

  .idx-view-toggle-option[data-active="false"]:hover {
    color: #636363 !important;
    opacity: 0.55 !important;
  }

  .idx-container:has(.idx-tax-item[aria-pressed="true"]) .idx-view-toggle {
    margin-top: -28px !important;
  }

  @media (max-width: 1199px) {
    .idx-container {
      --idx-grid-gap: 16px !important;
      padding: 0 20px !important;
    }

    .idx-project-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
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

    .idx-tax-label-discipline,
    .idx-tax-items-discipline {
      grid-row: 1 !important;
    }

    .idx-tax-label-industry,
    .idx-tax-items-industry {
      grid-row: 2 !important;
    }

    .idx-tax-label-year,
    .idx-tax-items-year {
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

    .idx-project-grid {
      grid-template-columns: 1fr !important;
      row-gap: 40px !important;
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

    .idx-tax-label-discipline,
    .idx-tax-items-discipline {
      grid-row: 1 !important;
    }

    .idx-tax-label-industry,
    .idx-tax-items-industry {
      grid-row: 2 !important;
    }

    .idx-tax-label-year,
    .idx-tax-items-year {
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

const css = `
  .idx-functional-draft .idx-taxonomy-label::before {
    content: "/ ";
  }

  .idx-functional-draft .idx-taxonomy-label,
  .idx-functional-draft .idx-taxonomy-items,
  .idx-functional-draft .idx-taxonomy-items .idx-tax-item,
  .idx-functional-draft .idx-all-filter {
    line-height: 24px !important;
  }

  .idx-functional-draft .idx-tax-label-year {
    grid-column: 1 / span 1 !important;
    grid-row: 1 !important;
  }

  .idx-functional-draft .idx-tax-items-year {
    grid-column: 2 / span 1 !important;
    grid-row: 1 !important;
  }

  .idx-functional-draft .idx-tax-label-discipline {
    grid-column: 3 / span 1 !important;
    grid-row: 1 !important;
  }

  .idx-functional-draft .idx-tax-items-discipline {
    grid-column: 4 / span 1 !important;
    grid-row: 1 !important;
  }

  .idx-functional-draft .idx-tax-label-industry {
    grid-column: 5 / span 1 !important;
    grid-row: 1 !important;
  }

  .idx-functional-draft .idx-tax-items-industry {
    grid-column: 6 / span 1 !important;
    grid-row: 1 !important;
  }

  .idx-functional-draft .idx-all-filter {
    display: block;
    width: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    appearance: none;
    -webkit-appearance: none;
    font: inherit;
    letter-spacing: inherit;
    text-align: left;
    text-transform: inherit;
    color: inherit;
    cursor: pointer;
    text-decoration: none;
    text-underline-offset: 3px;
    transition: opacity 150ms ease;
  }

  .idx-functional-draft .idx-all-filter:hover {
    opacity: 0.55;
  }

  .idx-functional-draft .idx-all-filter:focus-visible {
    outline: 1px solid #26211f;
    outline-offset: 3px;
  }

  .idx-functional-draft .idx-all-filter[data-active="true"] {
    text-decoration: underline;
  }

  .idx-functional-draft .idx-grid-card {
    gap: 10px !important;
  }

  .idx-functional-draft .idx-grid-card-media {
    position: relative !important;
    overflow: hidden !important;
    clip-path: inset(0);
    contain: paint;
    isolation: isolate;
  }

  .idx-functional-draft .idx-grid-card-img,
  .idx-functional-draft .idx-grid-card-video {
    transform: scale(1) !important;
    transform-origin: center center !important;
    transition: transform 420ms cubic-bezier(.22, 1, .36, 1) !important;
    backface-visibility: hidden !important;
    will-change: transform !important;
  }

  .idx-functional-draft .idx-grid-card:hover .idx-grid-card-img,
  .idx-functional-draft .idx-grid-card:focus-visible .idx-grid-card-img,
  .idx-functional-draft .idx-grid-card:focus-within .idx-grid-card-img,
  .idx-functional-draft .idx-grid-card:hover .idx-grid-card-video,
  .idx-functional-draft .idx-grid-card:focus-visible .idx-grid-card-video,
  .idx-functional-draft .idx-grid-card:focus-within .idx-grid-card-video {
    transform: scale(1.02) !important;
  }

  .idx-functional-draft .idx-grid-card-meta {
    margin: -2px 0 2px;
    font-family: 'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace;
    font-size: 13px;
    line-height: 20px;
    letter-spacing: 0;
    text-transform: uppercase;
    color: #979797;
  }

  @media (max-width: 899px) {
    .idx-functional-draft .idx-tax-label-year,
    .idx-functional-draft .idx-tax-label-discipline,
    .idx-functional-draft .idx-tax-label-industry {
      grid-column: 1 / span 1 !important;
      min-width: 0 !important;
      margin-top: 0 !important;
    }

    .idx-functional-draft .idx-tax-items-year,
    .idx-functional-draft .idx-tax-items-discipline,
    .idx-functional-draft .idx-tax-items-industry {
      grid-column: 2 / span 1 !important;
      min-width: 0 !important;
      overflow: visible !important;
    }

    .idx-functional-draft .idx-tax-label-year,
    .idx-functional-draft .idx-tax-items-year {
      grid-row: 1 !important;
    }

    .idx-functional-draft .idx-tax-label-discipline,
    .idx-functional-draft .idx-tax-items-discipline {
      grid-row: 2 !important;
    }

    .idx-functional-draft .idx-tax-label-industry,
    .idx-functional-draft .idx-tax-items-industry {
      grid-row: 3 !important;
    }

    .idx-functional-draft .idx-taxonomy-items {
      align-items: flex-start !important;
      overflow: visible !important;
    }

    .idx-functional-draft .idx-tax-item,
    .idx-functional-draft .idx-all-filter {
      white-space: normal !important;
      overflow-wrap: break-word !important;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .idx-functional-draft .idx-grid-card-img,
    .idx-functional-draft .idx-grid-card-video {
      transform: scale(1) !important;
      transition: none !important;
      will-change: auto !important;
    }
  }
`

const filterGroups = [
    { key: "year", selector: ".idx-tax-items-year", sort: false },
    { key: "service", selector: ".idx-tax-items-discipline", sort: true },
    { key: "industry", selector: ".idx-tax-items-industry", sort: true },
] as const

function compareLabels(a: HTMLButtonElement, b: HTMLButtonElement) {
    return (a.textContent ?? "").trim().localeCompare(
        (b.textContent ?? "").trim(),
        undefined,
        {
            numeric: true,
            sensitivity: "base",
        }
    )
}

function sortTaxonomyButtons(container: HTMLElement) {
    const buttons = Array.from(
        container.querySelectorAll<HTMLButtonElement>("button.idx-tax-item")
    )
    const sorted = [...buttons].sort(compareLabels)
    const alreadySorted = buttons.every(
        (button, index) => button === sorted[index]
    )

    if (alreadySorted) return
    sorted.forEach((button) => container.appendChild(button))
}

function syncTaxonomyCopy(root: HTMLElement) {
    const serviceLabel = root.querySelector<HTMLElement>(
        ".idx-tax-label-discipline"
    )
    if (serviceLabel && serviceLabel.textContent?.trim() !== "Service") {
        serviceLabel.textContent = "Service"
    }
}

function syncAllFilters(root: HTMLElement) {
    for (const group of filterGroups) {
        const container = root.querySelector<HTMLElement>(group.selector)
        if (!container) continue

        let allButton = container.querySelector<HTMLButtonElement>(
            `[data-idx-all-filter="${group.key}"]`
        )

        if (!allButton) {
            allButton = document.createElement("button")
            allButton.type = "button"
            allButton.className = "idx-all-filter"
            allButton.dataset.idxAllFilter = group.key
            allButton.textContent = "All"
            allButton.setAttribute(
                "aria-label",
                group.key === "service"
                    ? "Show all services"
                    : `Show all ${group.key}`
            )
            container.prepend(allButton)
        }

        if (group.sort) sortTaxonomyButtons(container)

        const activeButtons = Array.from(
            container.querySelectorAll<HTMLButtonElement>(
                "button.idx-tax-item[aria-pressed='true']"
            )
        )
        const isAll = activeButtons.length === 0
        const nextActive = isAll ? "true" : "false"
        if (allButton.dataset.active !== nextActive) {
            allButton.dataset.active = nextActive
        }
        if (allButton.getAttribute("aria-pressed") !== nextActive) {
            allButton.setAttribute("aria-pressed", nextActive)
        }
        allButton.onclick = () => {
            activeButtons.forEach((button) => button.click())
        }
    }
}

function syncGridMetadata(root: HTMLElement) {
    root.querySelectorAll<HTMLAnchorElement>(".idx-grid-card").forEach((card) => {
        const title = card.getAttribute("aria-label")?.trim()
        if (!title) return

        const meta = PROJECT_META[title]
        if (!meta) return

        const mediaEl = card.querySelector<HTMLElement>(".idx-grid-card-media")
        if (!mediaEl) return

        let metaEl = card.querySelector<HTMLElement>(".idx-grid-card-meta")
        if (!metaEl) {
            metaEl = document.createElement("div")
            metaEl.className = "idx-grid-card-meta"
            mediaEl.insertAdjacentElement("afterend", metaEl)
        }

        if (metaEl.dataset.title === title) return
        metaEl.dataset.title = title
        metaEl.textContent = ""
        metaEl.append(document.createTextNode(meta.services))
        metaEl.append(document.createElement("br"))
        metaEl.append(document.createTextNode(`${meta.industry} / ${meta.year}`))
    })
}

function syncEnhancements(root: HTMLElement) {
    syncTaxonomyCopy(root)
    syncAllFilters(root)
    syncGridMetadata(root)
}

export default function IndexFilterNavDraftPage({
    useCMS = false,
    defaultView = "list",
    listTypographyVariant = "standard",
    listHoverVariant = "flip",
}: {
    useCMS?: boolean
    defaultView?: string
    listTypographyVariant?: ListTypographyVariant
    listHoverVariant?: ListHoverVariant
}) {
    const rootRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const root = rootRef.current
        if (!root) return

        let raf = 0
        const scheduleSync = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(() => syncEnhancements(root))
        }

        scheduleSync()
        const observer = new MutationObserver(scheduleSync)
        observer.observe(root, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["aria-pressed"],
        })

        return () => {
            cancelAnimationFrame(raf)
            observer.disconnect()
        }
    }, [])

    return (
        <div ref={rootRef} className="idx-functional-draft">
            <IndexPage
                useCMS={useCMS}
                defaultView={defaultView}
                listTypographyVariant={listTypographyVariant}
                listHoverVariant={listHoverVariant}
            />
            <style>{breakpointCss}</style>
            <style>{css}</style>
        </div>
    )
}

addPropertyControls(IndexFilterNavDraftPage, {
    useCMS: {
        type: ControlType.Boolean,
        title: "Use CMS",
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    defaultView: {
        type: ControlType.Enum,
        title: "Default View",
        options: ["list", "grid"],
        defaultValue: "list",
        displaySegmentedControl: true,
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
