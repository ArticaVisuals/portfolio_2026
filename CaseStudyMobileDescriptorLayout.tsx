import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Props = {
    enabled: boolean
    breakpoint: number
    gap: number
}

const STYLE_ID = "case-study-mobile-descriptor-layout"
const ATTRS = {
    section: "data-case-study-mobile-descriptor-section",
    container: "data-case-study-mobile-descriptor-container",
    column: "data-case-study-mobile-descriptor-column",
    group: "data-case-study-mobile-descriptor-group",
    value: "data-case-study-mobile-descriptor-value",
} as const
const SECTION_INFO_NAMES = ["SectionInfo", "Section Info"]
const CREDITS_INFO_NAMES = ["CreditsInfo", "Credits & Info", "Credits Info"]
const LEFT_COLUMN_NAMES = ["LeftColumn", "Left Column"]
const RIGHT_COLUMN_NAMES = ["RightColumn", "Right Column"]
const WRAPPER_NAMES = ["IndustryWrapper", "Industry Wrapper", "YearWrapper", "Year Wrapper"]

function getStyle(breakpoint: number, gap: number): string {
    return `
@media (max-width: ${breakpoint}px) {
    [${ATTRS.section}="true"] {
        max-width: 100vw !important;
        overflow: visible !important;
        width: 100% !important;
    }

    [${ATTRS.container}="true"] {
        align-items: flex-start !important;
        box-sizing: border-box !important;
        display: flex !important;
        flex-direction: column !important;
        gap: ${gap}px !important;
        height: auto !important;
        justify-content: flex-start !important;
        max-width: 100% !important;
        min-width: 0 !important;
        overflow: visible !important;
        width: 100% !important;
    }

    [${ATTRS.column}="true"] {
        align-items: flex-start !important;
        align-self: stretch !important;
        box-sizing: border-box !important;
        display: flex !important;
        flex: 0 0 auto !important;
        flex-direction: column !important;
        max-width: 100% !important;
        min-width: 0 !important;
        width: 100% !important;
    }

    [${ATTRS.group}="true"] {
        align-items: flex-start !important;
        align-self: stretch !important;
        box-sizing: border-box !important;
        max-width: 100% !important;
        min-width: 0 !important;
        text-align: left !important;
        width: 100% !important;
    }

    [${ATTRS.value}="true"] {
        align-items: flex-start !important;
        justify-content: flex-start !important;
        text-align: left !important;
        width: 100% !important;
    }

    [${ATTRS.value}="true"] > * {
        max-width: 100% !important;
        min-width: 0 !important;
        text-align: left !important;
        width: 100% !important;
    }
}
`
}

function clampNumber(value: number, fallback: number, min: number, max: number): number {
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) return fallback
    return Math.max(min, Math.min(max, parsed))
}

function namedSelector(names: string | string[]): string {
    return (Array.isArray(names) ? names : [names])
        .flatMap((name) => [`[data-framer-name="${name}"]`, `[name="${name}"]`])
        .join(", ")
}

function hasName(element: Element, names: string | string[]): boolean {
    const values = Array.isArray(names) ? names : [names]
    const framerName = element.getAttribute("data-framer-name")
    const htmlName = element.getAttribute("name")
    return values.some((name) => framerName === name || htmlName === name)
}

function directNamedChild(parent: HTMLElement, names: string | string[]): HTMLElement | null {
    return (
        Array.from(parent.children).find(
            (child): child is HTMLElement =>
                child instanceof HTMLElement && hasName(child, names)
        ) || null
    )
}

function tagNamedDescendants(parent: HTMLElement, names: string[], attr: string) {
    names.forEach((name) => {
        parent.querySelectorAll<HTMLElement>(namedSelector(name)).forEach((element) => {
            element.setAttribute(attr, "true")
        })
    })
}

function tagDescriptorLayouts(): number {
    if (typeof document === "undefined") return 0

    let count = 0
    document.querySelectorAll<HTMLElement>(namedSelector(CREDITS_INFO_NAMES)).forEach((section) => {
        if (!section.closest(namedSelector(SECTION_INFO_NAMES))) return

        const container = directNamedChild(section, "Container")
        if (!container) return
        if (!container.querySelector(namedSelector("About"))) return

        const leftColumn = directNamedChild(container, LEFT_COLUMN_NAMES)
        const rightColumn = directNamedChild(container, RIGHT_COLUMN_NAMES)
        if (!leftColumn && !rightColumn) return

        section.setAttribute(ATTRS.section, "true")
        container.setAttribute(ATTRS.container, "true")
        ;[leftColumn, rightColumn].forEach((column) => {
            if (column) column.setAttribute(ATTRS.column, "true")
        })

        tagNamedDescendants(container, ["About", "Industry", "Credits", "Year"], ATTRS.group)
        tagNamedDescendants(container, WRAPPER_NAMES, ATTRS.value)
        count += 1
    })

    return count
}

function ensureStyles(breakpoint: number, gap: number) {
    if (typeof document === "undefined") return

    const normalizedBreakpoint = clampNumber(breakpoint, 809, 320, 1400)
    const normalizedGap = clampNumber(gap, 40, 0, 120)
    const css = getStyle(normalizedBreakpoint, normalizedGap)
    let style = document.getElementById(STYLE_ID)

    if (!style) {
        style = document.createElement("style")
        style.id = STYLE_ID
        document.head.appendChild(style)
    }

    if (style.textContent !== css) style.textContent = css
}

export default function CaseStudyMobileDescriptorLayout({
    enabled = true,
    breakpoint = 809,
    gap = 40,
}: Props) {
    React.useEffect(() => {
        if (!enabled || typeof window === "undefined") return

        ensureStyles(breakpoint, gap)

        let frame = 0
        const timeouts: number[] = []

        const run = () => {
            window.cancelAnimationFrame(frame)
            frame = window.requestAnimationFrame(tagDescriptorLayouts)
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
        }
    }, [enabled, breakpoint, gap])

    return (
        <span
            aria-hidden="true"
            style={{ display: "block", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
        />
    )
}

addPropertyControls(CaseStudyMobileDescriptorLayout, {
    enabled: {
        type: ControlType.Boolean,
        title: "Enabled",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    breakpoint: {
        type: ControlType.Number,
        title: "Breakpoint",
        defaultValue: 809,
        min: 320,
        max: 1400,
        step: 1,
        unit: "px",
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        defaultValue: 40,
        min: 0,
        max: 120,
        step: 1,
        unit: "px",
    },
})
