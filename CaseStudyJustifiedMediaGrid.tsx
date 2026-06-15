import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type MediaKind = "image" | "video"
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
    alt?: string
    ratio?: number
    fit?: MediaFit
    poster?: ResponsiveImageValue
    stroke?: boolean
}

type MediaItem = {
    src: string
    alt: string
    ratio: number
    kind: MediaKind
    poster?: string
    srcSet?: string
    fit: MediaFit
    stroke: boolean
}

type Props = {
    preset?: string
    items?: EditableMediaItem[] | string
    itemsData?: string
    showLegacyData?: boolean
    forceSingleRow?: boolean
    targetRowHeight?: number
    minRowHeight?: number
    maxRowHeight?: number
    gap?: number
    mobileGap?: number
    stackBelow?: number
    autoplay?: boolean
    loop?: boolean
    muted?: boolean
    controls?: boolean
    style?: React.CSSProperties
}

type JustifiedRow = {
    items: MediaItem[]
    height: number
}

const STROKE_COLOR = "rgb(151, 151, 151)"
const STROKE_WIDTH = 0.5
const COMPACT_GAP_BREAKPOINT = 810

function getRatio(item: Pick<MediaItem, "ratio">) {
    const ratio = Number(item.ratio)
    return Number.isFinite(ratio) && ratio > 0 ? ratio : 1
}

function getPositiveNumber(value: unknown) {
    const number = Number(value)
    return Number.isFinite(number) && number > 0 ? number : 0
}

function ratioFromDimensions(width: unknown, height: unknown) {
    const safeWidth = getPositiveNumber(width)
    const safeHeight = getPositiveNumber(height)
    return safeWidth > 0 && safeHeight > 0 ? safeWidth / safeHeight : 0
}

function getMediaUrlRatio(src: string) {
    if (!src) return 0

    try {
        const url = new URL(src, "https://framer.local")
        return ratioFromDimensions(
            url.searchParams.get("width"),
            url.searchParams.get("height")
        )
    } catch {
        const width = src.match(/[?&]width=(\d+(?:\.\d+)?)/)?.[1]
        const height = src.match(/[?&]height=(\d+(?:\.\d+)?)/)?.[1]
        return ratioFromDimensions(width, height)
    }
}

function getMediaSrcSetRatio(srcSet?: string) {
    if (!srcSet) return 0

    for (const candidate of srcSet.split(",")) {
        const src = candidate.trim().split(/\s+/)[0]
        const ratio = getMediaUrlRatio(src)
        if (ratio > 0) return ratio
    }

    return 0
}

function getResponsiveImageRatio(value: ResponsiveImageValue) {
    if (!value) return 0
    if (typeof value === "string") return getMediaUrlRatio(value)

    return (
        ratioFromDimensions(value.width, value.height) ||
        getMediaUrlRatio(value.src || "") ||
        getMediaSrcSetRatio(value.srcSet)
    )
}

function getMediaFit(value: unknown): MediaFit {
    return value === "cover" ? "cover" : "contain"
}

function getResponsiveImageSrc(value: ResponsiveImageValue) {
    if (!value) return ""
    if (typeof value === "string") return value
    return value.src || ""
}

function getResponsiveImageSrcSet(value: ResponsiveImageValue) {
    if (!value || typeof value === "string") return undefined
    return value.srcSet || undefined
}

function getResponsiveImageAlt(value: ResponsiveImageValue) {
    if (!value || typeof value === "string") return ""
    return value.alt || ""
}

function normalizeEditableItem(item: EditableMediaItem): MediaItem | null {
    if (!item) return null

    const kind: MediaKind = item.kind === "video" ? "video" : "image"
    const imageSrc = getResponsiveImageSrc(item.image)
    const videoSrc = typeof item.video === "string" ? item.video : ""
    const fallbackSrc = typeof item.src === "string" ? item.src : ""
    const src =
        kind === "video"
            ? videoSrc || fallbackSrc || imageSrc
            : imageSrc || fallbackSrc || videoSrc

    if (!src) return null

    const ratio = Number(item.ratio)
    const imageRatio =
        kind === "image"
            ? getResponsiveImageRatio(item.image) || getMediaUrlRatio(src)
            : 0
    const poster = getResponsiveImageSrc(item.poster)
    const alt = item.alt || getResponsiveImageAlt(item.image) || "Case study media"

    return {
        kind,
        src,
        srcSet: kind === "image" ? getResponsiveImageSrcSet(item.image) : undefined,
        alt,
        poster: poster || undefined,
        ratio: imageRatio || (Number.isFinite(ratio) && ratio > 0 ? ratio : 1),
        fit: getMediaFit(item.fit),
        stroke: Boolean(item.stroke),
    }
}

function normalizeEditableItems(items: EditableMediaItem[] | string): MediaItem[] {
    let parsedItems: unknown = items

    if (typeof items === "string") {
        try {
            parsedItems = JSON.parse(items)
        } catch {
            return []
        }
    }

    if (!Array.isArray(parsedItems)) return []

    return parsedItems
        .map((item) => normalizeEditableItem(item as EditableMediaItem))
        .filter((item): item is MediaItem => Boolean(item))
}

function parseItemsData(itemsData: string): MediaItem[] {
    if (!itemsData) return []

    return itemsData
        .split(";;")
        .map((rawItem) => rawItem.trim())
        .filter(Boolean)
        .map((rawItem) => {
            const [rawKind, rawRatio, rawSrc, rawAlt, rawPoster, rawStroke, rawFit] = rawItem
                .split("|")
                .map((part) => part.trim())
            const kind: MediaKind = rawKind === "video" ? "video" : "image"
            const ratio = Number.parseFloat(rawRatio || "1")
            const imageRatio = kind === "image" ? getMediaUrlRatio(rawSrc || "") : 0
            const stroke = ["1", "true", "yes", "on", "stroke"].includes(
                (rawStroke || "").toLowerCase()
            )

            return {
                kind,
                ratio: imageRatio || (Number.isFinite(ratio) && ratio > 0 ? ratio : 1),
                src: rawSrc || "",
                alt: rawAlt || "Case study media",
                poster: rawPoster || undefined,
                fit: getMediaFit(rawFit),
                stroke,
            }
        })
        .filter((item) => item.src)
}

function fittedRowHeight(items: MediaItem[], containerWidth: number, gap: number) {
    const ratioTotal = items.reduce((sum, item) => sum + getRatio(item), 0)
    const totalGap = Math.max(0, items.length - 1) * gap
    return ratioTotal > 0
        ? Math.max(1, (containerWidth - totalGap) / ratioTotal)
        : 1
}

function rowHeightFor(
    items: MediaItem[],
    containerWidth: number,
    gap: number,
    fallbackHeight: number
) {
    return containerWidth > 0
        ? fittedRowHeight(items, containerWidth, gap)
        : fallbackHeight
}

function buildRows(
    items: MediaItem[],
    containerWidth: number,
    targetRowHeight: number,
    minRowHeight: number,
    gap: number,
    forceSingleRow: boolean
): JustifiedRow[] {
    if (!items.length) return []
    if (containerWidth <= 0) return [{ items, height: targetRowHeight }]

    if (forceSingleRow) {
        return [
            {
                items,
                height: rowHeightFor(items, containerWidth, gap, targetRowHeight),
            },
        ]
    }

    const rows: JustifiedRow[] = []
    let current: MediaItem[] = []

    const flush = () => {
        if (!current.length) return
        const rowItems = current
        rows.push({
            items: rowItems,
            height: rowHeightFor(rowItems, containerWidth, gap, targetRowHeight),
        })
        current = []
    }

    for (const item of items) {
        if (current.length) {
            const nextHeight = fittedRowHeight([...current, item], containerWidth, gap)
            if (nextHeight < minRowHeight) flush()
        }

        current.push(item)

        if (
            current.length > 1 &&
            fittedRowHeight(current, containerWidth, gap) <= targetRowHeight
        ) {
            flush()
        }
    }

    flush()
    return rows
}

function justifiedWidth(
    ratio: number,
    totalRatio: number,
    totalGap: number,
    availableWidth: number,
    containerWidth: number
) {
    if (totalRatio <= 0) return "100%"
    if (containerWidth > 0) return (availableWidth * ratio) / totalRatio

    const percentage = (ratio / totalRatio) * 100
    const gapShare = (totalGap * ratio) / totalRatio
    return `calc(${percentage}% - ${gapShare}px)`
}

/**
 * Cargo-style mixed image/video rows for case-study media.
 *
 * The editable Media array is the primary authoring path. Legacy URL data is
 * kept as a hidden fallback so existing MCP-populated rows stay visible until
 * their files are replaced through Framer uploads.
 *
 * @framerIntrinsicWidth 1160
 * @framerIntrinsicHeight 520
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function CaseStudyJustifiedMediaGrid(props: Props) {
    const {
        items = [],
        itemsData = "",
        forceSingleRow = false,
        targetRowHeight = 420,
        minRowHeight = 160,
        gap = 20,
        mobileGap = 10,
        stackBelow = 560,
        autoplay = true,
        loop = true,
        muted = true,
        controls = false,
        style,
    } = props

    const rootRef = React.useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = React.useState(0)
    const [measuredRatios, setMeasuredRatios] = React.useState<Record<string, number>>({})

    React.useLayoutEffect(() => {
        const root = rootRef.current
        if (!root || typeof ResizeObserver === "undefined") return

        const updateWidth = () => setContainerWidth(root.clientWidth)
        updateWidth()

        const resizeObserver = new ResizeObserver(updateWidth)
        resizeObserver.observe(root)
        return () => resizeObserver.disconnect()
    }, [])

    const rememberRatio = React.useCallback((src: string, width?: number, height?: number) => {
        if (!src || !width || !height) return
        const ratio = width / height
        if (!Number.isFinite(ratio) || ratio <= 0) return

        setMeasuredRatios((current) => {
            const previous = current[src]
            if (previous && Math.abs(previous - ratio) < 0.0001) return current
            return { ...current, [src]: ratio }
        })
    }, [])

    const editableItems = normalizeEditableItems(items)
    const legacyItems = parseItemsData(itemsData)
    const selectedItems = editableItems.length > 0 ? editableItems : legacyItems
    const safeItems = selectedItems
        .filter((item) => item?.src)
        .map((item) => ({
            ...item,
            ratio: measuredRatios[item.src] || getRatio(item),
        }))
    const safeGap = Math.max(0, Number(gap) || 0)
    const safeMobileGap = Math.max(0, Number(mobileGap) || 0)
    const safeTargetHeight = Math.max(1, Number(targetRowHeight) || 420)
    const safeMinHeight = Math.max(1, Number(minRowHeight) || 160)
    const safeStackBelow = Math.max(0, Number(stackBelow) || 0)
    const shouldStack = containerWidth > 0 && containerWidth < safeStackBelow
    const useCompactGap =
        containerWidth > 0 && containerWidth < COMPACT_GAP_BREAKPOINT
    const activeGap = useCompactGap ? safeMobileGap : safeGap
    const rows = shouldStack
        ? safeItems.map((item) => ({
              items: [item],
              height: containerWidth > 0 ? containerWidth / getRatio(item) : safeTargetHeight,
          }))
        : buildRows(
              safeItems,
              containerWidth,
              safeTargetHeight,
              safeMinHeight,
              activeGap,
              forceSingleRow
          )

    return (
        <div
            ref={rootRef}
            style={{
                ...style,
                width: "100%",
                height: "auto",
                display: "flex",
                flexDirection: "column",
                gap: activeGap,
                overflow: "visible",
                background: "transparent",
            }}
        >
            {rows.map((row, rowIndex) => {
                const totalRatio = row.items.reduce(
                    (sum, item) => sum + getRatio(item),
                    0
                )
                const totalGap = Math.max(0, row.items.length - 1) * activeGap
                const availableWidth = Math.max(1, containerWidth - totalGap)
                const rowHeight = Math.max(1, row.height)

                return (
                    <div
                        key={rowIndex}
                        style={{
                            width: "100%",
                            height: rowHeight,
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            gap: activeGap,
                            overflow: "visible",
                            background: "transparent",
                        }}
                    >
                        {row.items.map((item, itemIndex) => {
                            const ratio = getRatio(item)
                            const itemWidth = shouldStack
                                ? "100%"
                                : justifiedWidth(
                                      ratio,
                                      totalRatio,
                                      totalGap,
                                      availableWidth,
                                      containerWidth
                                  )
                            const numericItemWidth =
                                typeof itemWidth === "number"
                                    ? itemWidth
                                    : shouldStack && containerWidth > 0
                                      ? containerWidth
                                      : undefined
                            const frameRatio =
                                numericItemWidth && rowHeight > 0
                                    ? numericItemWidth / rowHeight
                                    : ratio
                            const containsMedia =
                                item.fit === "contain" && numericItemWidth
                            const containedWidth =
                                containsMedia && frameRatio > ratio
                                    ? rowHeight * ratio
                                    : numericItemWidth
                            const containedHeight =
                                containsMedia && frameRatio <= ratio
                                    ? numericItemWidth / ratio
                                    : rowHeight
                            const shellWidth =
                                containsMedia && containedWidth
                                    ? containedWidth
                                    : "100%"
                            const shellHeight =
                                containsMedia && containedHeight
                                    ? containedHeight
                                    : "100%"
                            const frameStyle: React.CSSProperties = {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: itemWidth,
                                height: rowHeight,
                                position: "relative",
                                flex: "0 0 auto",
                                boxSizing: "border-box",
                                maxWidth: shouldStack ? "100%" : undefined,
                                background: "transparent",
                                borderRadius: 0,
                                overflow: "visible",
                            }
                            const mediaShellStyle: React.CSSProperties = {
                                width: shellWidth,
                                height: shellHeight,
                                position: "relative",
                                flex: "0 0 auto",
                                borderRadius: "inherit",
                                overflow: "hidden",
                            }
                            const mediaStyle: React.CSSProperties = {
                                display: "block",
                                width: "100%",
                                height: "100%",
                                objectFit: item.fit,
                                objectPosition: "center",
                                background: "transparent",
                                borderRadius: "inherit",
                            }
                            const strokeStyle: React.CSSProperties = {
                                position: "absolute",
                                inset: 0,
                                boxSizing: "border-box",
                                border: `${STROKE_WIDTH}px solid ${STROKE_COLOR}`,
                                borderRadius: "inherit",
                                pointerEvents: "none",
                            }

                            const media =
                                item.kind === "video" ? (
                                    <video
                                        src={item.src}
                                        poster={item.poster || undefined}
                                        autoPlay={autoplay}
                                        loop={loop}
                                        muted={muted}
                                        controls={controls}
                                        playsInline
                                        preload="metadata"
                                        ref={(video) => {
                                            if (!video || video.readyState < 1) return
                                            rememberRatio(
                                                item.src,
                                                video.videoWidth,
                                                video.videoHeight
                                            )
                                        }}
                                        onLoadedMetadata={(event) => {
                                            const video = event.currentTarget
                                            rememberRatio(
                                                item.src,
                                                video.videoWidth,
                                                video.videoHeight
                                            )
                                        }}
                                        style={mediaStyle}
                                    />
                                ) : (
                                    <img
                                        src={item.src}
                                        srcSet={item.srcSet}
                                        alt={item.alt || "Case study image"}
                                        loading="lazy"
                                        decoding="async"
                                        draggable={false}
                                        ref={(image) => {
                                            if (!image?.complete) return
                                            rememberRatio(
                                                item.src,
                                                image.naturalWidth,
                                                image.naturalHeight
                                            )
                                        }}
                                        onLoad={(event) => {
                                            const image = event.currentTarget
                                            rememberRatio(
                                                item.src,
                                                image.naturalWidth,
                                                image.naturalHeight
                                            )
                                        }}
                                        style={mediaStyle}
                                    />
                                )

                            return (
                                <div key={`${item.src}-${itemIndex}`} style={frameStyle}>
                                    <div style={mediaShellStyle}>
                                        {media}
                                        {item.stroke ? (
                                            <div aria-hidden="true" style={strokeStyle} />
                                        ) : null}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

addPropertyControls(CaseStudyJustifiedMediaGrid, {
    items: {
        type: ControlType.Array,
        title: "Media",
        maxCount: 40,
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
                src: {
                    type: ControlType.String,
                    title: "URL",
                    defaultValue: "",
                    placeholder: "Optional fallback URL",
                    hidden: () => true,
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
                    defaultValue: "contain",
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
        defaultValue: [],
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
        hidden: ({ showLegacyData }) => !showLegacyData,
        defaultValue: "",
    },
    forceSingleRow: {
        type: ControlType.Boolean,
        title: "Single Row",
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    targetRowHeight: {
        type: ControlType.Number,
        title: "Target H",
        defaultValue: 420,
        min: 80,
        max: 900,
        step: 1,
        unit: "px",
    },
    minRowHeight: {
        type: ControlType.Number,
        title: "Min H",
        defaultValue: 160,
        min: 40,
        max: 500,
        step: 1,
        unit: "px",
    },
    maxRowHeight: {
        type: ControlType.Number,
        title: "Max H",
        defaultValue: 620,
        min: 120,
        max: 1200,
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
