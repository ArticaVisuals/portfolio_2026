import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

const DEFAULT_RULE_COLOR = "#233324"

type Props = {
    ruleColor: string
    adjustCaseStudiesGrid: boolean
    sectionName: string
    gridName: string
    cardName: string
    imageWrapperName: string
}

type RatioSettings = Pick<
    Props,
    "sectionName" | "gridName" | "cardName" | "imageWrapperName"
>

function getImageRatio(img: HTMLImageElement): number | undefined {
    const widthAttr = Number(img.getAttribute("width"))
    const heightAttr = Number(img.getAttribute("height"))
    const width = img.naturalWidth || widthAttr
    const height = img.naturalHeight || heightAttr
    const ratio = width / height

    return Number.isFinite(ratio) && ratio > 0 ? ratio : undefined
}

function getSections(sectionName: string): HTMLElement[] {
    return Array.from(
        document.querySelectorAll<HTMLElement>(
            `[data-framer-name="${sectionName}"], [name="${sectionName}"]`
        )
    )
}

function getCards(settings: RatioSettings): HTMLElement[] {
    return getSections(settings.sectionName).flatMap((section) =>
        Array.from(
            section.querySelectorAll<HTMLElement>(
                `[data-framer-name="${settings.gridName}"] [data-framer-name="${settings.cardName}"]`
            )
        )
    )
}

function unlockHeight(element: HTMLElement | null | undefined) {
    if (!element) return
    element.style.height = "auto"
    element.style.minHeight = "0"
}

function applyCardRatio(card: HTMLElement, imageWrapperName: string) {
    const wrapper = card.querySelector<HTMLElement>(
        `[data-framer-name="${imageWrapperName}"]`
    )
    const img = wrapper?.querySelector<HTMLImageElement>(
        `[data-framer-background-image-wrapper="true"] img`
    )

    if (!wrapper || !img) return

    const ratio = getImageRatio(img)
    const width = wrapper.getBoundingClientRect().width || card.getBoundingClientRect().width

    if (!ratio || !width) return

    const mediaHeight = width / ratio
    const componentContainer = card.parentElement as HTMLElement | null
    const gridCell = componentContainer?.parentElement as HTMLElement | null
    const thumbnail = wrapper.querySelector<HTMLElement>(`[data-framer-name="Thumbnail"]`)
    const backgroundWrapper = wrapper.querySelector<HTMLElement>(
        `[data-framer-background-image-wrapper="true"]`
    )
    const videoContainer = wrapper.querySelector("video")?.parentElement as HTMLElement | null

    unlockHeight(gridCell)
    unlockHeight(componentContainer)
    unlockHeight(card)

    wrapper.style.width = "100%"
    wrapper.style.height = `${mediaHeight}px`
    wrapper.style.aspectRatio = `${ratio}`
    wrapper.style.minHeight = "0"
    wrapper.style.overflow = "hidden"

    ;[thumbnail, backgroundWrapper, videoContainer].forEach((element) => {
        if (!element) return
        element.style.width = "100%"
        element.style.height = "100%"
    })

    img.style.width = "100%"
    img.style.height = "100%"
    img.style.objectFit = "cover"
}

function applyGridRatios(settings: RatioSettings) {
    getCards(settings).forEach((card) => {
        applyCardRatio(card, settings.imageWrapperName)
    })
}

export default function IndexRuleColorOverride({
    ruleColor = DEFAULT_RULE_COLOR,
    adjustCaseStudiesGrid = true,
    sectionName = "Section Case Study (Filter)",
    gridName = "Grid View Wrapper",
    cardName = "Card",
    imageWrapperName = "Image Wrapper",
}: Partial<Props>) {
    React.useEffect(() => {
        if (!adjustCaseStudiesGrid || typeof window === "undefined") return

        const settings = { sectionName, gridName, cardName, imageWrapperName }
        let frame = 0

        const schedule = () => {
            window.cancelAnimationFrame(frame)
            frame = window.requestAnimationFrame(() => applyGridRatios(settings))
        }

        schedule()
        const timeoutIds = [80, 300, 900, 1800].map((delay) =>
            window.setTimeout(schedule, delay)
        )

        const images = getCards(settings)
            .map((card) =>
                card.querySelector<HTMLImageElement>(
                    `[data-framer-name="${imageWrapperName}"] [data-framer-background-image-wrapper="true"] img`
                )
            )
            .filter((img): img is HTMLImageElement => !!img)

        images.forEach((img) => img.addEventListener("load", schedule, { passive: true }))

        const resizeObserver = new ResizeObserver(schedule)
        getSections(sectionName).forEach((section) => resizeObserver.observe(section))
        document
            .querySelectorAll<HTMLElement>(
                `[data-framer-name="${gridName}"], [data-framer-name="${imageWrapperName}"]`
            )
            .forEach((element) => resizeObserver.observe(element))

        const mutationObserver = new MutationObserver(schedule)
        getSections(sectionName).forEach((section) => {
            mutationObserver.observe(section, { childList: true, subtree: true })
        })

        window.addEventListener("resize", schedule, { passive: true })

        return () => {
            window.cancelAnimationFrame(frame)
            timeoutIds.forEach((id) => window.clearTimeout(id))
            window.removeEventListener("resize", schedule)
            resizeObserver.disconnect()
            mutationObserver.disconnect()
            images.forEach((img) => img.removeEventListener("load", schedule))
        }
    }, [adjustCaseStudiesGrid, sectionName, gridName, cardName, imageWrapperName])

    return (
        <div
            aria-hidden="true"
            style={{
                width: 0,
                height: 0,
                overflow: "hidden",
                pointerEvents: "none",
            }}
        >
            <style>{`
                html body .idx-rule,
                html body .idx-row-divider {
                    background-color: ${ruleColor} !important;
                    border-color: ${ruleColor} !important;
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    )
}

addPropertyControls(IndexRuleColorOverride, {
    ruleColor: {
        type: ControlType.Color,
        title: "Rule Color",
        defaultValue: DEFAULT_RULE_COLOR,
    },
    adjustCaseStudiesGrid: {
        type: ControlType.Boolean,
        title: "Grid Ratios",
        defaultValue: true,
    },
    sectionName: {
        type: ControlType.String,
        title: "Section",
        defaultValue: "Section Case Study (Filter)",
        hidden: ({ adjustCaseStudiesGrid }) => !adjustCaseStudiesGrid,
    },
    gridName: {
        type: ControlType.String,
        title: "Grid",
        defaultValue: "Grid View Wrapper",
        hidden: ({ adjustCaseStudiesGrid }) => !adjustCaseStudiesGrid,
    },
    cardName: {
        type: ControlType.String,
        title: "Card",
        defaultValue: "Card",
        hidden: ({ adjustCaseStudiesGrid }) => !adjustCaseStudiesGrid,
    },
    imageWrapperName: {
        type: ControlType.String,
        title: "Image Wrapper",
        defaultValue: "Image Wrapper",
        hidden: ({ adjustCaseStudiesGrid }) => !adjustCaseStudiesGrid,
    },
})
