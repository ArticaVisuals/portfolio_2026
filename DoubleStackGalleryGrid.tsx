import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type MediaKind = "image" | "video"
type MediaFit = "contain" | "cover"

type ResponsiveImageValue =
    | string
    | {
          src?: string
          srcSet?: string
          alt?: string
      }
    | null
    | undefined

type MediaSlot = {
    kind?: MediaKind
    image?: ResponsiveImageValue
    video?: string
    poster?: ResponsiveImageValue
    alt?: string
}

type Props = {
    topLeft?: MediaSlot
    bottomLeft?: MediaSlot
    right?: MediaSlot
    gap?: number
    mobileGap?: number
    aspectWidth?: number
    aspectHeight?: number
    mobileBelow?: number
    fit?: MediaFit
    autoplay?: boolean
    loop?: boolean
    muted?: boolean
    controls?: boolean
    backgroundColor?: string
    placeholderColor?: string
    placeholderLineColor?: string
    stroke?: boolean
    strokeColor?: string
    strokeWidth?: number
    style?: React.CSSProperties
}

type ResolvedSlot = {
    kind: MediaKind
    src: string
    poster: string
    srcSet?: string
    alt: string
}

const DEFAULT_ASPECT_WIDTH = 16
const DEFAULT_ASPECT_HEIGHT = 9
const DEFAULT_GAP = 20
const DEFAULT_MOBILE_GAP = 10
const DEFAULT_MOBILE_BELOW = 600

function getPositiveNumber(value: unknown, fallback: number) {
    const number = Number(value)
    return Number.isFinite(number) && number > 0 ? number : fallback
}

function getNonNegativeNumber(value: unknown, fallback: number) {
    const number = Number(value)
    return Number.isFinite(number) && number >= 0 ? number : fallback
}

function getImageSrc(value: ResponsiveImageValue) {
    if (!value) return ""
    if (typeof value === "string") return value
    return value.src || ""
}

function getImageSrcSet(value: ResponsiveImageValue) {
    if (!value || typeof value === "string") return undefined
    return value.srcSet || undefined
}

function getImageAlt(value: ResponsiveImageValue) {
    if (!value || typeof value === "string") return ""
    return value.alt || ""
}

function resolveSlot(slot: MediaSlot | undefined, fallbackAlt: string): ResolvedSlot {
    const kind: MediaKind = slot?.kind === "video" ? "video" : "image"
    const imageSrc = getImageSrc(slot?.image)
    const poster = getImageSrc(slot?.poster)
    const videoSrc = typeof slot?.video === "string" ? slot.video : ""

    return {
        kind,
        src: kind === "video" ? videoSrc : imageSrc,
        poster,
        srcSet: kind === "image" ? getImageSrcSet(slot?.image) : undefined,
        alt: slot?.alt || getImageAlt(slot?.image) || fallbackAlt,
    }
}

function renderPlaceholder(
    label: string,
    placeholderColor: string,
    placeholderLineColor: string
) {
    return (
        <div
            aria-label={label}
            role="img"
            style={{
                position: "absolute",
                inset: 0,
                backgroundColor: placeholderColor,
                backgroundImage: `repeating-linear-gradient(135deg, transparent 0px, transparent 13px, ${placeholderLineColor} 14px, ${placeholderLineColor} 15px)`,
            }}
        />
    )
}

function MediaFrame({
    slot,
    label,
    aspect,
    fit,
    autoplay,
    loop,
    muted,
    controls,
    backgroundColor,
    placeholderColor,
    placeholderLineColor,
    stroke,
    strokeColor,
    strokeWidth,
}: {
    slot: ResolvedSlot
    label: string
    aspect: number
    fit: MediaFit
    autoplay: boolean
    loop: boolean
    muted: boolean
    controls: boolean
    backgroundColor: string
    placeholderColor: string
    placeholderLineColor: string
    stroke: boolean
    strokeColor: string
    strokeWidth: number
}) {
    const frameStyle: React.CSSProperties = {
        position: "relative",
        width: "100%",
        aspectRatio: `${aspect}`,
        overflow: "hidden",
        backgroundColor,
        boxSizing: "border-box",
        border: stroke ? `${strokeWidth}px solid ${strokeColor}` : "none",
    }
    const mediaStyle: React.CSSProperties = {
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: fit,
    }

    let media: React.ReactNode = null
    if (slot.kind === "video" && slot.src) {
        media = (
            <video
                src={slot.src}
                poster={slot.poster || undefined}
                aria-label={slot.alt || label}
                autoPlay={autoplay}
                loop={loop}
                muted={muted}
                controls={controls}
                playsInline
                preload="metadata"
                style={mediaStyle}
            />
        )
    } else if (slot.src) {
        media = (
            <img
                src={slot.src}
                srcSet={slot.srcSet}
                alt={slot.alt || label}
                loading="lazy"
                draggable={false}
                style={mediaStyle}
            />
        )
    } else if (slot.poster) {
        media = (
            <img
                src={slot.poster}
                alt={slot.alt || label}
                loading="lazy"
                draggable={false}
                style={mediaStyle}
            />
        )
    }

    return (
        <div style={frameStyle}>
            {media ||
                renderPlaceholder(slot.alt || label, placeholderColor, placeholderLineColor)}
        </div>
    )
}

/**
 * Double Stack Gallery Grid
 *
 * Two same-ratio media frames stack on the left while one same-ratio media frame
 * sits on the right. The right column width is calculated so its 16:9 height
 * matches the two left frames plus the vertical gap.
 *
 * @framerIntrinsicWidth 1160
 * @framerIntrinsicHeight 435
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function DoubleStackGalleryGrid(props: Props) {
    const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "")
    const gap = getNonNegativeNumber(props.gap, DEFAULT_GAP)
    const mobileGap = getNonNegativeNumber(props.mobileGap, DEFAULT_MOBILE_GAP)
    const aspectWidth = getPositiveNumber(props.aspectWidth, DEFAULT_ASPECT_WIDTH)
    const aspectHeight = getPositiveNumber(props.aspectHeight, DEFAULT_ASPECT_HEIGHT)
    const aspect = aspectWidth / aspectHeight
    const stackCompensation = gap * aspect
    const mobileBelow = getPositiveNumber(props.mobileBelow, DEFAULT_MOBILE_BELOW)
    const fit: MediaFit = props.fit === "cover" ? "cover" : "contain"
    const strokeWidth = getNonNegativeNumber(props.strokeWidth, 0.5)
    const topLeft = resolveSlot(props.topLeft, "Top left media")
    const bottomLeft = resolveSlot(props.bottomLeft, "Bottom left media")
    const right = resolveSlot(props.right, "Right media")

    const rootClass = `double-stack-gallery-${id}`
    const gridTemplateColumns = `minmax(0, calc((100% - ${gap}px - ${stackCompensation}px) / 3)) minmax(0, calc((200% - ${gap * 2}px + ${stackCompensation}px) / 3))`
    const sharedFrameProps = {
        aspect,
        fit,
        autoplay: props.autoplay ?? true,
        loop: props.loop ?? true,
        muted: props.muted ?? true,
        controls: props.controls ?? false,
        backgroundColor: props.backgroundColor || "rgba(0, 0, 0, 0)",
        placeholderColor: props.placeholderColor || "rgb(229, 229, 225)",
        placeholderLineColor: props.placeholderLineColor || "rgba(255, 255, 255, 0.95)",
        stroke: Boolean(props.stroke),
        strokeColor: props.strokeColor || "rgb(151, 151, 151)",
        strokeWidth,
    }

    return (
        <div style={{ width: "100%", ...props.style }}>
            <style>{`
                .${rootClass} {
                    align-items: start;
                    display: grid;
                    gap: ${gap}px;
                    grid-template-columns: ${gridTemplateColumns};
                    width: 100%;
                }

                .${rootClass} .double-stack-gallery-left {
                    display: grid;
                    gap: ${gap}px;
                    grid-template-columns: minmax(0, 1fr);
                    width: 100%;
                }

                @media (max-width: ${mobileBelow}px) {
                    .${rootClass} {
                        gap: ${mobileGap}px;
                        grid-template-columns: minmax(0, 1fr);
                    }

                    .${rootClass} .double-stack-gallery-left {
                        gap: ${mobileGap}px;
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                }
            `}</style>
            <div className={rootClass} data-double-stack-gallery-grid="true">
                <div className="double-stack-gallery-left">
                    <MediaFrame slot={topLeft} label="Top left media" {...sharedFrameProps} />
                    <MediaFrame
                        slot={bottomLeft}
                        label="Bottom left media"
                        {...sharedFrameProps}
                    />
                </div>
                <MediaFrame slot={right} label="Right media" {...sharedFrameProps} />
            </div>
        </div>
    )
}

const mediaSlotControls: Record<string, any> = {
    kind: {
        type: ControlType.Enum,
        title: "Type",
        options: ["image", "video"],
        optionTitles: ["Image", "Video"],
        defaultValue: "image",
        displaySegmentedControl: true,
    },
    image: {
        type: ControlType.ResponsiveImage,
        title: "Image",
        hidden: ({ kind }: { kind?: MediaKind }) => kind === "video",
    },
    video: {
        type: ControlType.File,
        title: "Video",
        allowedFileTypes: ["mp4", "mov", "m4v", "webm"],
        hidden: ({ kind }: { kind?: MediaKind }) => kind !== "video",
    },
    poster: {
        type: ControlType.ResponsiveImage,
        title: "Poster",
        hidden: ({ kind }: { kind?: MediaKind }) => kind !== "video",
    },
    alt: {
        type: ControlType.String,
        title: "Alt",
        defaultValue: "",
    },
}

addPropertyControls(DoubleStackGalleryGrid, {
    topLeft: {
        type: ControlType.Object,
        title: "Top Left",
        controls: mediaSlotControls,
        defaultValue: { kind: "image", alt: "Top left media" },
    },
    bottomLeft: {
        type: ControlType.Object,
        title: "Bottom Left",
        controls: mediaSlotControls,
        defaultValue: { kind: "image", alt: "Bottom left media" },
    },
    right: {
        type: ControlType.Object,
        title: "Right",
        controls: mediaSlotControls,
        defaultValue: { kind: "video", alt: "Right media" },
    },
    fit: {
        type: ControlType.Enum,
        title: "Fit",
        options: ["contain", "cover"],
        optionTitles: ["Resize", "Fill"],
        defaultValue: "contain",
        displaySegmentedControl: true,
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
    aspectWidth: {
        type: ControlType.Number,
        title: "Aspect W",
        defaultValue: 16,
        min: 1,
        max: 40,
        step: 1,
    },
    aspectHeight: {
        type: ControlType.Number,
        title: "Aspect H",
        defaultValue: 9,
        min: 1,
        max: 40,
        step: 1,
    },
    mobileBelow: {
        type: ControlType.Number,
        title: "Stack Below",
        defaultValue: 600,
        min: 320,
        max: 810,
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
    backgroundColor: {
        type: ControlType.Color,
        title: "Media BG",
        defaultValue: "rgba(0, 0, 0, 0)",
    },
    placeholderColor: {
        type: ControlType.Color,
        title: "Placeholder",
        defaultValue: "rgb(229, 229, 225)",
    },
    placeholderLineColor: {
        type: ControlType.Color,
        title: "Lines",
        defaultValue: "rgba(255, 255, 255, 0.95)",
    },
    stroke: {
        type: ControlType.Boolean,
        title: "Stroke",
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    strokeColor: {
        type: ControlType.Color,
        title: "Stroke",
        defaultValue: "rgb(151, 151, 151)",
        hidden: ({ stroke }) => !stroke,
    },
    strokeWidth: {
        type: ControlType.Number,
        title: "Stroke W",
        defaultValue: 0.5,
        min: 0,
        max: 8,
        step: 0.5,
        unit: "px",
        hidden: ({ stroke }) => !stroke,
    },
})

DoubleStackGalleryGrid.displayName = "Double Stack Gallery Grid"
