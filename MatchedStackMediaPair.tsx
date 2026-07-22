import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type MediaFit = "contain" | "cover"
type MediaKind = "image" | "video"

type Props = {
    leftKind?: MediaKind
    leftSrc?: string
    leftPoster?: string
    topKind?: MediaKind
    topSrc?: string
    topPoster?: string
    bottomKind?: MediaKind
    bottomSrc?: string
    bottomPoster?: string
    leftAlt?: string
    topAlt?: string
    bottomAlt?: string
    leftRatio?: number
    topRatio?: number
    bottomRatio?: number
    gap?: number
    stackGap?: number
    mobileGap?: number
    mobileBelow?: number
    fit?: MediaFit
    backgroundColor?: string
    placeholderColor?: string
    placeholderLineColor?: string
    leftStroke?: boolean
    topStroke?: boolean
    bottomStroke?: boolean
    strokeColor?: string
    strokeWidth?: number
    autoplay?: boolean
    loop?: boolean
    muted?: boolean
    controls?: boolean
    style?: React.CSSProperties
}

const DEFAULT_LEFT_SRC =
    "https://framerusercontent.com/images/v938nyGlyF1ROhv9CvXY6l0ydTg.png"
const DEFAULT_TOP_SRC =
    "https://framerusercontent.com/images/hBYK4b6zozsrrdygBAvLvas7A.gif"
const DEFAULT_BOTTOM_SRC = ""

const DEFAULT_LEFT_RATIO = 2360 / 3711
const DEFAULT_GIF_RATIO = 600 / 338
const DEFAULT_GAP = 20
const DEFAULT_MOBILE_GAP = 10
const DEFAULT_MOBILE_BELOW = 600
const DEFAULT_PLACEHOLDER_COLOR = "rgb(229, 229, 225)"
const DEFAULT_PLACEHOLDER_LINE_COLOR = "rgba(255, 255, 255, 0.95)"

function getPositiveNumber(value: unknown, fallback: number) {
    const number = Number(value)
    return Number.isFinite(number) && number > 0 ? number : fallback
}

function getNonNegativeNumber(value: unknown, fallback: number) {
    const number = Number(value)
    return Number.isFinite(number) && number >= 0 ? number : fallback
}

function getSource(value: string | undefined, fallback: string) {
    return typeof value === "string" && value.trim() ? value.trim() : fallback
}

function isVideoSource(src: string) {
    return /\.(mp4|m4v|mov|webm|ogv|ogg)$/i.test(src.split(/[?#]/)[0] || "")
}

function getColumnTemplate({
    gap,
    stackGap,
    leftRatio,
    topRatio,
    bottomRatio,
}: {
    gap: number
    stackGap: number
    leftRatio: number
    topRatio: number
    bottomRatio: number
}) {
    const leftReciprocal = 1 / leftRatio
    const stackRatioSum = 1 / topRatio + 1 / bottomRatio
    const denominator = stackRatioSum + leftReciprocal
    const rightPercent = (leftReciprocal / denominator) * 100
    const rightOffset = (gap * leftReciprocal + stackGap) / denominator
    const leftPercent = 100 - rightPercent
    const leftOffset = gap - rightOffset

    return `minmax(0, calc(${leftPercent}% - ${leftOffset}px)) minmax(0, calc(${rightPercent}% - ${rightOffset}px))`
}

function MediaFrame({
    kind,
    src,
    poster,
    alt,
    aspectRatio,
    fit,
    backgroundColor,
    placeholderColor,
    placeholderLineColor,
    stroke,
    strokeColor,
    strokeWidth,
    autoplay,
    loop,
    muted,
    controls,
}: {
    kind: MediaKind
    src: string
    poster: string
    alt: string
    aspectRatio: number
    fit: MediaFit
    backgroundColor: string
    placeholderColor: string
    placeholderLineColor: string
    stroke: boolean
    strokeColor: string
    strokeWidth: number
    autoplay: boolean
    loop: boolean
    muted: boolean
    controls: boolean
}) {
    const renderVideo = Boolean(src) && (kind === "video" || isVideoSource(src))

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                aspectRatio: `${aspectRatio}`,
                overflow: "hidden",
                backgroundColor,
                border: stroke ? `${strokeWidth}px solid ${strokeColor}` : "none",
                boxSizing: "border-box",
            }}
        >
            {renderVideo ? (
                <video
                    src={src}
                    poster={poster || undefined}
                    aria-label={alt}
                    autoPlay={autoplay}
                    loop={loop}
                    muted={muted}
                    controls={controls}
                    playsInline
                    preload="metadata"
                    style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: fit,
                    }}
                />
            ) : src ? (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    draggable={false}
                    style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: fit,
                    }}
                />
            ) : (
                <div
                    aria-label={alt}
                    role="img"
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: placeholderColor,
                        backgroundImage: `repeating-linear-gradient(135deg, transparent 0px, transparent 13px, ${placeholderLineColor} 14px, ${placeholderLineColor} 15px)`,
                    }}
                />
            )}
        </div>
    )
}

/**
 * Matched Stack Media Pair
 *
 * Pairs one portrait media item with two stacked landscape media items. On
 * tablet and desktop, the column widths are solved from the measured container
 * width so the top and bottom edges align exactly. On mobile, all media stack.
 *
 * @framerIntrinsicWidth 1160
 * @framerIntrinsicHeight 760
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function MatchedStackMediaPair(props: Props) {
    const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "")

    const leftKind: MediaKind = props.leftKind === "video" ? "video" : "image"
    const topKind: MediaKind = props.topKind === "video" ? "video" : "image"
    const bottomKind: MediaKind =
        props.bottomKind === "video" ? "video" : "image"
    const leftSrc = getSource(props.leftSrc, DEFAULT_LEFT_SRC)
    const leftPoster = getSource(props.leftPoster, "")
    const topSrc = getSource(props.topSrc, DEFAULT_TOP_SRC)
    const topPoster = getSource(props.topPoster, "")
    const bottomSrc = getSource(props.bottomSrc, DEFAULT_BOTTOM_SRC)
    const bottomPoster = getSource(props.bottomPoster, "")
    const leftRatio = getPositiveNumber(props.leftRatio, DEFAULT_LEFT_RATIO)
    const topRatio = getPositiveNumber(props.topRatio, DEFAULT_GIF_RATIO)
    const bottomRatio = getPositiveNumber(props.bottomRatio, DEFAULT_GIF_RATIO)
    const gap = getNonNegativeNumber(props.gap, DEFAULT_GAP)
    const stackGap = getNonNegativeNumber(props.stackGap, gap)
    const mobileGap = getNonNegativeNumber(props.mobileGap, DEFAULT_MOBILE_GAP)
    const mobileBelow = getPositiveNumber(props.mobileBelow, DEFAULT_MOBILE_BELOW)
    const fit: MediaFit = props.fit === "cover" ? "cover" : "contain"
    const backgroundColor = props.backgroundColor || "rgba(0, 0, 0, 0)"
    const placeholderColor = props.placeholderColor || DEFAULT_PLACEHOLDER_COLOR
    const placeholderLineColor =
        props.placeholderLineColor || DEFAULT_PLACEHOLDER_LINE_COLOR
    const strokeColor = props.strokeColor || "rgb(151, 151, 151)"
    const strokeWidth = getNonNegativeNumber(props.strokeWidth, 0.5)
    const autoplay = props.autoplay ?? true
    const loop = props.loop ?? true
    const muted = props.muted ?? true
    const controls = props.controls ?? false

    const rootClass = `matched-stack-media-pair-${id}`
    const columnTemplate = getColumnTemplate({
        gap,
        stackGap,
        leftRatio,
        topRatio,
        bottomRatio,
    })

    const sharedFrameProps = {
        fit,
        backgroundColor,
        placeholderColor,
        placeholderLineColor,
        strokeColor,
        strokeWidth,
        autoplay,
        loop,
        muted,
        controls,
    }
    const rootStyle: React.CSSProperties = {
        ...props.style,
        width: "100%",
        height: "auto",
        overflow: "visible",
    }
    ;(rootStyle as any).containerType = "inline-size"

    return (
        <div
            className={rootClass}
            style={rootStyle}
            data-matched-stack-media-pair="true"
        >
            <style>{`
                .${rootClass} .matched-stack-media-pair-grid {
                    align-items: start;
                    display: grid;
                    gap: ${gap}px;
                    grid-template-columns: ${columnTemplate};
                    width: 100%;
                }

                .${rootClass} .matched-stack-media-pair-right {
                    display: grid;
                    gap: ${stackGap}px;
                    grid-template-columns: minmax(0, 1fr);
                    width: 100%;
                }

                @container (max-width: ${mobileBelow}px) {
                    .${rootClass} .matched-stack-media-pair-grid {
                        gap: ${mobileGap}px;
                        grid-template-columns: minmax(0, 1fr);
                    }

                    .${rootClass} .matched-stack-media-pair-right {
                        gap: ${mobileGap}px;
                    }
                }

                @media (max-width: ${mobileBelow}px) {
                    .${rootClass} .matched-stack-media-pair-grid {
                        gap: ${mobileGap}px;
                        grid-template-columns: minmax(0, 1fr);
                    }

                    .${rootClass} .matched-stack-media-pair-right {
                        gap: ${mobileGap}px;
                    }
                }
            `}</style>
            <div className="matched-stack-media-pair-grid">
                <MediaFrame
                    kind={leftKind}
                    src={leftSrc}
                    poster={leftPoster}
                    alt={props.leftAlt || "Wolff Olins poster composition"}
                    aspectRatio={leftRatio}
                    stroke={props.leftStroke ?? true}
                    {...sharedFrameProps}
                />
                <div className="matched-stack-media-pair-right">
                    <MediaFrame
                        kind={topKind}
                        src={topSrc}
                        poster={topPoster}
                        alt={props.topAlt || "Animated Wolff Olins process frame"}
                        aspectRatio={topRatio}
                        stroke={props.topStroke ?? false}
                        {...sharedFrameProps}
                    />
                    <MediaFrame
                        kind={bottomKind}
                        src={bottomSrc}
                        poster={bottomPoster}
                        alt={
                            props.bottomAlt ||
                            "Animated Wolff Olins process detail"
                        }
                        aspectRatio={bottomRatio}
                        stroke={props.bottomStroke ?? false}
                        {...sharedFrameProps}
                    />
                </div>
            </div>
        </div>
    )
}

addPropertyControls(MatchedStackMediaPair, {
    leftKind: {
        type: ControlType.Enum,
        title: "Left Type",
        options: ["image", "video"],
        optionTitles: ["Image", "Video"],
        defaultValue: "image",
        displaySegmentedControl: true,
    },
    leftSrc: {
        type: ControlType.File,
        title: "Left Media",
        allowedFileTypes: [
            "jpg",
            "jpeg",
            "png",
            "webp",
            "gif",
            "mp4",
            "mov",
            "m4v",
            "webm",
        ],
    },
    leftPoster: {
        type: ControlType.File,
        title: "Left Poster",
        allowedFileTypes: ["jpg", "jpeg", "png", "webp"],
    },
    topKind: {
        type: ControlType.Enum,
        title: "Top Type",
        options: ["image", "video"],
        optionTitles: ["Image", "Video"],
        defaultValue: "image",
        displaySegmentedControl: true,
    },
    topSrc: {
        type: ControlType.File,
        title: "Top Media",
        allowedFileTypes: [
            "jpg",
            "jpeg",
            "png",
            "webp",
            "gif",
            "mp4",
            "mov",
            "m4v",
            "webm",
        ],
    },
    topPoster: {
        type: ControlType.File,
        title: "Top Poster",
        allowedFileTypes: ["jpg", "jpeg", "png", "webp"],
    },
    bottomKind: {
        type: ControlType.Enum,
        title: "Bottom Type",
        options: ["image", "video"],
        optionTitles: ["Image", "Video"],
        defaultValue: "image",
        displaySegmentedControl: true,
    },
    bottomSrc: {
        type: ControlType.File,
        title: "Bottom Media",
        allowedFileTypes: [
            "jpg",
            "jpeg",
            "png",
            "webp",
            "gif",
            "mp4",
            "mov",
            "m4v",
            "webm",
        ],
    },
    bottomPoster: {
        type: ControlType.File,
        title: "Bottom Poster",
        allowedFileTypes: ["jpg", "jpeg", "png", "webp"],
    },
    leftAlt: {
        type: ControlType.String,
        title: "Left Alt",
        defaultValue: "Wolff Olins poster composition",
    },
    topAlt: {
        type: ControlType.String,
        title: "Top Alt",
        defaultValue: "Animated Wolff Olins process frame",
    },
    bottomAlt: {
        type: ControlType.String,
        title: "Bottom Alt",
        defaultValue: "Animated Wolff Olins process detail",
    },
    leftRatio: {
        type: ControlType.Number,
        title: "Left Ratio",
        defaultValue: DEFAULT_LEFT_RATIO,
        min: 0.1,
        max: 4,
        step: 0.001,
    },
    topRatio: {
        type: ControlType.Number,
        title: "Top Ratio",
        defaultValue: DEFAULT_GIF_RATIO,
        min: 0.1,
        max: 4,
        step: 0.001,
    },
    bottomRatio: {
        type: ControlType.Number,
        title: "Bottom Ratio",
        defaultValue: DEFAULT_GIF_RATIO,
        min: 0.1,
        max: 4,
        step: 0.001,
    },
    gap: {
        type: ControlType.Number,
        title: "Column Gap",
        defaultValue: DEFAULT_GAP,
        min: 0,
        max: 80,
        step: 1,
        unit: "px",
    },
    stackGap: {
        type: ControlType.Number,
        title: "Stack Gap",
        defaultValue: DEFAULT_GAP,
        min: 0,
        max: 80,
        step: 1,
        unit: "px",
    },
    mobileGap: {
        type: ControlType.Number,
        title: "Mobile Gap",
        defaultValue: DEFAULT_MOBILE_GAP,
        min: 0,
        max: 40,
        step: 1,
        unit: "px",
    },
    mobileBelow: {
        type: ControlType.Number,
        title: "Stack Below",
        defaultValue: DEFAULT_MOBILE_BELOW,
        min: 320,
        max: 810,
        step: 1,
        unit: "px",
    },
    fit: {
        type: ControlType.Enum,
        title: "Fit",
        options: ["contain", "cover"],
        optionTitles: ["Resize", "Fill"],
        defaultValue: "contain",
        displaySegmentedControl: true,
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Media BG",
        defaultValue: "rgba(0, 0, 0, 0)",
    },
    placeholderColor: {
        type: ControlType.Color,
        title: "Placeholder",
        defaultValue: DEFAULT_PLACEHOLDER_COLOR,
    },
    placeholderLineColor: {
        type: ControlType.Color,
        title: "Lines",
        defaultValue: DEFAULT_PLACEHOLDER_LINE_COLOR,
    },
    leftStroke: {
        type: ControlType.Boolean,
        title: "Left Stroke",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    topStroke: {
        type: ControlType.Boolean,
        title: "Top Stroke",
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    bottomStroke: {
        type: ControlType.Boolean,
        title: "Bottom Stroke",
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    strokeColor: {
        type: ControlType.Color,
        title: "Stroke",
        defaultValue: "rgb(151, 151, 151)",
    },
    strokeWidth: {
        type: ControlType.Number,
        title: "Stroke W",
        defaultValue: 0.5,
        min: 0,
        max: 8,
        step: 0.5,
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

MatchedStackMediaPair.displayName = "Matched Stack Media Pair"
