import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
// @ts-expect-error Framer resolves project code-component URL imports at runtime.
import CaseStudyJustifiedMediaGrid from "https://framer.com/m/CaseStudyJustifiedMediaGrid-9FvDJe.js"

type MediaKind = "image" | "video"
type SourceMode = "items" | "data"
type HeightMode = "row" | "gallery"
type MediaFit = "cover" | "contain"

type ResponsiveImageValue =
    | string
    | {
          src?: string
          srcSet?: string
          alt?: string
          width?: number | string
          height?: number | string
      }
    | null
    | undefined

type EditableMediaItem = {
    kind?: MediaKind
    image?: ResponsiveImageValue
    video?: string
    src?: string
    ratio?: number
    alt?: string
    poster?: ResponsiveImageValue
    breakAfter?: boolean
    fit?: MediaFit
    stroke?: boolean
}

type GridMediaItem = {
    kind?: MediaKind
    image?: ResponsiveImageValue
    video?: string
    src?: string
    alt?: string
    ratio?: number
    fit?: MediaFit
    poster?: ResponsiveImageValue
    stroke?: boolean
}

type Props = {
    sourceMode?: SourceMode
    items?: EditableMediaItem[] | string
    itemsData?: string
    showLegacyData?: boolean
    heightMode?: HeightMode
    galleryHeight?: number
    targetRowHeight?: number
    rowHeight?: number
    fitRows?: boolean
    minRowHeight?: number
    maxRowHeight?: number
    stackBelow?: number
    gap?: number
    mobileGap?: number
    objectFit?: MediaFit
    forceSingleRow?: boolean
    autoplay?: boolean
    loop?: boolean
    muted?: boolean
    controls?: boolean
    style?: React.CSSProperties
}

const DEFAULT_ITEMS: EditableMediaItem[] = []
const BREAK_TOKENS = new Set(["1", "true", "yes", "break", "break-after"])
const EMPTY_TOKENS = new Set(["", "0", "false", "no", "none", "null", "undefined"])

function normalizeFit(value: unknown, fallback: MediaFit): MediaFit {
    return value === "contain" || value === "cover" ? value : fallback
}

function normalizeKind(value: unknown): MediaKind {
    return value === "video" ? "video" : "image"
}

function responsiveImageSrc(value: ResponsiveImageValue) {
    if (!value) return ""
    if (typeof value === "string") return value
    return value.src || ""
}

function responsiveImageAlt(value: ResponsiveImageValue) {
    if (!value || typeof value === "string") return ""
    return value.alt || ""
}

function normalizePortfolioAlt(value: unknown): string {
    return String(value || "")
        .replace(/^Simon and Schuster\b/i, "Simon & Schuster")
        .replace(/^Motion Connect print\b/i, "Simon & Schuster print")
}

function parseItems(items: EditableMediaItem[] | string | undefined): EditableMediaItem[] {
    if (!items) return []
    if (Array.isArray(items)) return items

    try {
        const parsed = JSON.parse(items)
        return Array.isArray(parsed) ? (parsed as EditableMediaItem[]) : []
    } catch {
        return []
    }
}

function hasSource(item: EditableMediaItem) {
    if (!item) return false
    return Boolean(item.src || item.video || responsiveImageSrc(item.image))
}

function toGridItem(item: EditableMediaItem, fallbackFit: MediaFit): GridMediaItem {
    const kind = normalizeKind(item.kind)
    const imageAlt = responsiveImageAlt(item.image)

    return {
        kind,
        image: item.image,
        video: item.video,
        src: item.src,
        alt: normalizePortfolioAlt(item.alt || imageAlt || "Case study media"),
        ratio: item.ratio,
        poster: item.poster,
        fit: normalizeFit(item.fit, fallbackFit),
        stroke: Boolean(item.stroke),
    }
}

function field(value: unknown) {
    return String(value ?? "").replace(/[|]/g, "/").replace(/;;/g, ";")
}

function parseBreakFlag(value: string) {
    return BREAK_TOKENS.has(value.trim().toLowerCase())
}

function isEmptyToken(value: string) {
    return EMPTY_TOKENS.has(value.trim().toLowerCase())
}

function convertLegacyData(itemsData: string | undefined, fallbackFit: MediaFit) {
    if (!itemsData) return ""

    return itemsData
        .split(";;")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
            const parts = entry.split("|").map((part) => part.trim())
            const [rawKind, rawRatio, rawSrc, rawAlt] = parts
            const kind = normalizeKind(rawKind)
            const ratio = Number.parseFloat(rawRatio || "1")
            const safeRatio = Number.isFinite(ratio) && ratio > 0 ? ratio : 1

            if (parts.length >= 7) {
                const [, , , , rawPoster, rawStroke, rawFit] = parts
                return [
                    kind,
                    safeRatio,
                    field(rawSrc),
                    field(normalizePortfolioAlt(rawAlt || "Case study media")),
                    field(isEmptyToken(rawPoster || "") ? "" : rawPoster),
                    field(rawStroke || "false"),
                    normalizeFit(rawFit, fallbackFit),
                ].join("|")
            }

            const rawBreakOrPoster = parts[4] || ""
            const rawPoster = parts[5] || ""
            const breakAfter = parseBreakFlag(rawBreakOrPoster)
            const poster = rawPoster || (breakAfter || isEmptyToken(rawBreakOrPoster) ? "" : rawBreakOrPoster)

            return [
                kind,
                safeRatio,
                field(rawSrc),
                field(normalizePortfolioAlt(rawAlt || "Case study media")),
                field(poster),
                "false",
                fallbackFit,
            ].join("|")
        })
        .filter((entry) => entry.split("|")[2])
        .join(";;")
}

/**
 * Deprecated compatibility bridge for old FixedHeightMediaRows instances.
 * New galleries should use CaseStudyJustifiedMediaGrid directly.
 *
 * @framerIntrinsicWidth 1160
 * @framerIntrinsicHeight 520
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function FixedHeightMediaRows(props: Props) {
    const {
        sourceMode = "items",
        items = DEFAULT_ITEMS,
        itemsData = "",
        heightMode = "row",
        targetRowHeight,
        rowHeight,
        minRowHeight = 120,
        maxRowHeight = 900,
        stackBelow = 560,
        gap = 20,
        mobileGap = 10,
        objectFit = "cover",
        forceSingleRow = false,
        autoplay = true,
        loop = true,
        muted = true,
        controls = false,
        showLegacyData = false,
        style,
    } = props

    const fallbackFit = normalizeFit(objectFit, "cover")
    const editableItems = React.useMemo(
        () => parseItems(items).filter(hasSource).map((item) => toGridItem(item, fallbackFit)),
        [items, fallbackFit]
    )
    const fallbackItemsData = React.useMemo(
        () => convertLegacyData(itemsData, fallbackFit),
        [itemsData, fallbackFit]
    )
    const shouldUseItems = sourceMode !== "data" && editableItems.length > 0

    return (
        <CaseStudyJustifiedMediaGrid
            items={shouldUseItems ? editableItems : []}
            itemsData={shouldUseItems ? "" : fallbackItemsData}
            showLegacyData={showLegacyData}
            forceSingleRow={heightMode === "gallery" ? false : forceSingleRow}
            targetRowHeight={targetRowHeight ?? rowHeight ?? 300}
            minRowHeight={minRowHeight}
            maxRowHeight={maxRowHeight}
            gap={gap}
            mobileGap={mobileGap}
            stackBelow={stackBelow}
            autoplay={autoplay}
            loop={loop}
            muted={muted}
            controls={controls}
            style={style}
        />
    )
}

addPropertyControls(FixedHeightMediaRows, {
    sourceMode: {
        type: ControlType.Enum,
        title: "Source",
        options: ["items", "data"],
        optionTitles: ["Items", "Data"],
        defaultValue: "items",
    },
    items: {
        type: ControlType.Array,
        title: "Media",
        maxCount: 40,
        hidden: ({ sourceMode }) => sourceMode === "data",
        control: {
            type: ControlType.Object,
            buttonTitle: "Media Item",
            controls: {
                kind: {
                    type: ControlType.Enum,
                    title: "Type",
                    options: ["image", "video"],
                    optionTitles: ["Image", "Video"],
                    defaultValue: "image",
                },
                image: {
                    type: ControlType.ResponsiveImage,
                    title: "Image",
                    hidden: ({ kind }) => kind === "video",
                },
                video: {
                    type: ControlType.File,
                    title: "Video",
                    allowedFileTypes: ["mp4", "mov", "m4v", "webm", "gif"],
                    hidden: ({ kind }) => kind !== "video",
                },
                poster: {
                    type: ControlType.ResponsiveImage,
                    title: "Poster",
                    hidden: ({ kind }) => kind !== "video",
                },
                ratio: {
                    type: ControlType.Number,
                    title: "Fallback Ratio",
                    defaultValue: 1.7778,
                    min: 0.2,
                    max: 5,
                    step: 0.0001,
                },
                fit: {
                    type: ControlType.Enum,
                    title: "Fit",
                    options: ["contain", "cover"],
                    optionTitles: ["Resize", "Fill"],
                    defaultValue: "cover",
                    displaySegmentedControl: true,
                },
                alt: {
                    type: ControlType.String,
                    title: "Alt",
                    defaultValue: "Case study media",
                },
                stroke: {
                    type: ControlType.Boolean,
                    title: "Stroke",
                    defaultValue: false,
                    enabledTitle: "On",
                    disabledTitle: "Off",
                },
            },
        },
        defaultValue: DEFAULT_ITEMS,
    },
    showLegacyData: {
        type: ControlType.Boolean,
        title: "Fallback Data",
        defaultValue: false,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
    itemsData: {
        type: ControlType.String,
        title: "Fallback Items",
        displayTextArea: true,
        hidden: ({ sourceMode, showLegacyData }) => sourceMode !== "data" && !showLegacyData,
        defaultValue: "",
    },
    heightMode: {
        type: ControlType.Enum,
        title: "Height Mode",
        options: ["row", "gallery"],
        optionTitles: ["Rows", "Legacy Gallery"],
        defaultValue: "row",
    },
    targetRowHeight: {
        type: ControlType.Number,
        title: "Target H",
        defaultValue: 300,
        min: 80,
        max: 900,
        step: 1,
        unit: "px",
    },
    minRowHeight: {
        type: ControlType.Number,
        title: "Min H",
        defaultValue: 120,
        min: 40,
        max: 900,
        step: 1,
        unit: "px",
    },
    maxRowHeight: {
        type: ControlType.Number,
        title: "Max H",
        defaultValue: 900,
        min: 120,
        max: 1800,
        step: 1,
        unit: "px",
        hidden: () => true,
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        defaultValue: 20,
        min: 0,
        max: 80,
        step: 1,
        unit: "px",
    },
    mobileGap: {
        type: ControlType.Number,
        title: "Mobile Gap",
        defaultValue: 10,
        min: 0,
        max: 40,
        step: 1,
        unit: "px",
    },
    stackBelow: {
        type: ControlType.Number,
        title: "Stack Below",
        defaultValue: 560,
        min: 240,
        max: 900,
        step: 1,
        unit: "px",
    },
    objectFit: {
        type: ControlType.Enum,
        title: "Default Fit",
        options: ["cover", "contain"],
        optionTitles: ["Fill", "Resize"],
        defaultValue: "cover",
    },
    autoplay: {
        type: ControlType.Boolean,
        title: "Autoplay",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    loop: {
        type: ControlType.Boolean,
        title: "Loop",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    muted: {
        type: ControlType.Boolean,
        title: "Muted",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    controls: {
        type: ControlType.Boolean,
        title: "Controls",
        defaultValue: false,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
})

FixedHeightMediaRows.displayName = "Fixed Height Media Rows (Deprecated)"
