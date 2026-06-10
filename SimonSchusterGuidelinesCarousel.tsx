import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type ResponsiveImage = {
    src?: string
    srcSet?: string
    alt?: string
}

type SlideItem = {
    image?: ResponsiveImage
    alt?: string
}

type NormalizedSlide = {
    src: string
    srcSet?: string
    alt: string
}

// Font family used for the prev/next glyphs. Matches the site typeface
// (GT Standard, uploaded to Framer as a custom font) so the arrow
// controls render in the same face as the rest of the site. Falls back
// to a system serif/sans that also carries the guillemet glyphs.
const GLYPH_FONT =
    '"GT Standard L Regular", "GT Standard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

type Props = {
    sourceMode: "manifest" | "images"
    slidesData: string
    slides: SlideItem[]
    autoplay: boolean
    interval: number
    transitionDuration: number
    showArrows: boolean
    showDots: boolean
    showCounter: boolean
    enableLightbox: boolean
    aspectRatio: number
    arrowColor: string
    controlBackground: string
    dotColor: string
    activeDotColor: string
    ariaLabel: string
    style?: React.CSSProperties
}

/**
 * Image Carousel
 *
 * Reusable fade carousel: supply slides either as a newline manifest
 * ("imageUrl|alt" per line) or via the Image Controls array. Includes
 * pause-on-hover autoplay, optional dots/counter, and GT Standard
 * guillemet arrows for inline browsing.
 *
 * Lightbox: this component no longer ships its own fullscreen overlay.
 * Instead it cooperates with the page-level CaseStudyLightbox so that
 * clicking a gallery slide opens the exact same lightbox as any other
 * image on the page. Only the *visible* slide is click-/hit-testable
 * (inactive slides are pointer-events:none), so a single click always
 * zooms the slide on screen — while every slide stays in the DOM so the
 * lightbox's ‹ › arrows can page through the whole gallery before
 * flowing on to the rest of the page's media. Set Lightbox = Off to mark
 * the slides [data-no-lightbox] and opt the gallery out entirely.
 *
 * @framerIntrinsicWidth 1160
 * @framerIntrinsicHeight 741
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function ImageCarousel(props: Props) {
    const {
        sourceMode = "manifest",
        slidesData = "",
        slides: slideControls = [],
        autoplay = true,
        interval = 2.5,
        transitionDuration = 0.3,
        showArrows = true,
        showDots = false,
        showCounter = false,
        enableLightbox = true,
        aspectRatio = 3014 / 1924,
        arrowColor = "rgba(255,255,255,0.9)",
        controlBackground = "rgba(87,87,87,0.35)",
        dotColor = "rgba(20,20,20,0.32)",
        activeDotColor = "#141414",
        ariaLabel = "Image carousel",
        style,
    } = props

    const slides = React.useMemo(() => {
        const customSlides = sourceMode === "images" ? normalizeImageControls(slideControls) : []
        if (customSlides.length > 0) return customSlides
        return parseManifest(slidesData)
    }, [slideControls, slidesData, sourceMode])

    const [index, setIndex] = React.useState(0)
    const [isHovered, setIsHovered] = React.useState(false)

    const slideCount = slides.length

    const goTo = React.useCallback(
        (nextIndex: number) => {
            if (slideCount === 0) return
            setIndex((nextIndex + slideCount) % slideCount)
        },
        [slideCount]
    )

    const advance = React.useCallback(() => {
        setIndex((current) => (slideCount === 0 ? 0 : (current + 1) % slideCount))
    }, [slideCount])

    const retreat = React.useCallback(() => {
        setIndex((current) => (slideCount === 0 ? 0 : (current - 1 + slideCount) % slideCount))
    }, [slideCount])

    React.useEffect(() => {
        if (slideCount === 0) return
        setIndex((current) => Math.min(current, slideCount - 1))
    }, [slideCount])

    React.useEffect(() => {
        if (!autoplay || isHovered || slideCount < 2) return
        const timer = window.setInterval(advance, Math.max(0.5, interval) * 1000)
        return () => window.clearInterval(timer)
    }, [advance, autoplay, interval, isHovered, slideCount])

    const transition = `opacity ${Math.max(0, transitionDuration)}s ease`
    const safeAspectRatio = Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : 3014 / 1924

    if (slideCount === 0) {
        return (
            <div
                style={{
                    ...style,
                    width: "100%",
                    aspectRatio: safeAspectRatio,
                    display: "grid",
                    placeItems: "center",
                    color: "#777",
                    background: "rgba(0,0,0,0.04)",
                    fontFamily: "sans-serif",
                    fontSize: 13,
                }}
            >
                Add carousel images
            </div>
        )
    }

    return (
        <div
            style={{
                ...style,
                position: "relative",
                width: "100%",
                height: "auto",
                aspectRatio: safeAspectRatio,
                overflow: "hidden",
                background: "transparent",
                borderRadius: 0,
                userSelect: "none",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-roledescription="carousel"
            aria-label={ariaLabel}
        >
            <div
                role="group"
                aria-label={ariaLabel}
                style={{
                    position: "absolute",
                    inset: 0,
                }}
            >
                {slides.map((slide, slideIndex) => {
                    const isActive = slideIndex === index
                    return (
                        <img
                            key={`${slide.src}-${slideIndex}`}
                            src={slide.src}
                            srcSet={slide.srcSet}
                            alt={slide.alt}
                            loading={slideIndex < 2 ? "eager" : "lazy"}
                            draggable={false}
                            // Mark every slide out when the lightbox is disabled.
                            data-no-lightbox={enableLightbox ? undefined : "true"}
                            style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                objectPosition: "center",
                                opacity: isActive ? 1 : 0,
                                transition,
                                background: "transparent",
                                // Only the visible slide receives the pointer, so a
                                // single click always opens the slide on screen — the
                                // page-level CaseStudyLightbox takes it from there.
                                pointerEvents: isActive && enableLightbox ? "auto" : "none",
                                cursor: isActive && enableLightbox ? "zoom-in" : "default",
                            }}
                        />
                    )
                })}
            </div>

            {showArrows && slideCount > 1 && (
                <>
                    <ArrowButton label="Previous slide" side="left" color={arrowColor} background={controlBackground} onClick={retreat} />
                    <ArrowButton label="Next slide" side="right" color={arrowColor} background={controlBackground} onClick={advance} />
                </>
            )}

            {showDots && slideCount > 1 && (
                <div
                    aria-label="Slide navigation"
                    style={{
                        position: "absolute",
                        left: 16,
                        right: 16,
                        bottom: 14,
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 5,
                        pointerEvents: "auto",
                    }}
                >
                    {slides.map((_, dotIndex) => (
                        <button
                            key={dotIndex}
                            type="button"
                            aria-label={`Go to slide ${dotIndex + 1}`}
                            onClick={(event) => {
                                event.stopPropagation()
                                goTo(dotIndex)
                            }}
                            style={{
                                width: dotIndex === index ? 16 : 5,
                                height: 5,
                                borderRadius: 999,
                                border: 0,
                                padding: 0,
                                background: dotIndex === index ? activeDotColor : dotColor,
                                cursor: "pointer",
                                transition: "width 0.2s ease, background 0.2s ease",
                            }}
                        />
                    ))}
                </div>
            )}

            {showCounter && (
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        right: 12,
                        top: 12,
                        color: arrowColor,
                        background: controlBackground,
                        borderRadius: 999,
                        padding: "5px 8px",
                        fontFamily: "monospace",
                        fontSize: 11,
                        lineHeight: 1,
                    }}
                >
                    {index + 1}/{slideCount}
                </div>
            )}
        </div>
    )
}

function parseManifest(manifest: string | undefined): NormalizedSlide[] {
    const source = manifest && manifest.trim().length > 0 ? manifest : ""
    return source
        .split("\n")
        .map((row, index) => {
            const [src, alt] = row.split("|")
            return {
                src: (src || "").trim(),
                alt: (alt || `Slide ${index + 1}`).trim(),
            }
        })
        .filter((slide) => slide.src.length > 0)
}

function normalizeImageControls(slides: SlideItem[] | undefined): NormalizedSlide[] {
    return (slides || [])
        .map((slide, index) => {
            const src = slide.image?.src || ""
            return {
                src,
                srcSet: slide.image?.srcSet,
                alt: slide.alt || slide.image?.alt || `Slide ${index + 1}`,
            }
        })
        .filter((slide) => slide.src.length > 0)
}

type ArrowButtonProps = {
    label: string
    side: "left" | "right"
    color: string
    background: string
    fixed?: boolean
    onClick: () => void
}

function ArrowButton({ label, side, color, background, fixed = false, onClick }: ArrowButtonProps) {
    const isLeft = side === "left"
    // Single guillemets from GT Standard (U+2039 / U+203A)
    const glyph = isLeft ? "‹" : "›"
    return (
        <button
            type="button"
            aria-label={label}
            onClick={(event) => {
                event.stopPropagation()
                onClick()
            }}
            style={{
                position: fixed ? "fixed" : "absolute",
                top: "50%",
                [side]: fixed ? 20 : 15,
                transform: "translateY(-50%)",
                width: 30,
                height: 30,
                border: 0,
                borderRadius: 999,
                background,
                color,
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                zIndex: fixed ? 10000 : 2,
            }}
        >
            <span
                aria-hidden="true"
                style={{
                    fontFamily: GLYPH_FONT,
                    fontSize: 24,
                    lineHeight: 1,
                    fontWeight: 400,
                    display: "block",
                    // Optical centering: GT Standard's guillemet ink center sits
                    // ~0.282em above the baseline, which lands ~2.6px below the
                    // circle's center at this size/line-height. The X nudge
                    // balances the glyph's left/right bias. Pure cosmetic.
                    transform: isLeft ? "translate(-1px, -2.6px)" : "translate(1px, -2.6px)",
                }}
            >
                {glyph}
            </span>
        </button>
    )
}

addPropertyControls(ImageCarousel, {
    sourceMode: {
        type: ControlType.Enum,
        title: "Source",
        options: ["manifest", "images"],
        optionTitles: ["Manifest", "Image Controls"],
        defaultValue: "manifest",
    },
    slidesData: {
        type: ControlType.String,
        title: "Manifest",
        defaultValue: "",
        placeholder: "imageUrl|alt text (one slide per line)",
        displayTextArea: true,
        hidden: ({ sourceMode }) => sourceMode === "images",
    },
    slides: {
        type: ControlType.Array,
        title: "Slides",
        maxCount: 200,
        control: {
            type: ControlType.Object,
            controls: {
                image: {
                    type: ControlType.ResponsiveImage,
                    title: "Image",
                },
                alt: {
                    type: ControlType.String,
                    title: "Alt",
                    defaultValue: "",
                },
            },
        },
        defaultValue: [],
        hidden: ({ sourceMode }) => sourceMode !== "images",
    },
    autoplay: {
        type: ControlType.Boolean,
        title: "Autoplay",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    interval: {
        type: ControlType.Number,
        title: "Delay",
        defaultValue: 2.5,
        min: 0.5,
        max: 10,
        step: 0.1,
        unit: "s",
    },
    transitionDuration: {
        type: ControlType.Number,
        title: "Fade",
        defaultValue: 0.3,
        min: 0,
        max: 2,
        step: 0.1,
        unit: "s",
    },
    showArrows: {
        type: ControlType.Boolean,
        title: "Arrows",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
    showDots: {
        type: ControlType.Boolean,
        title: "Dots",
        defaultValue: false,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
    showCounter: {
        type: ControlType.Boolean,
        title: "Counter",
        defaultValue: false,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
    enableLightbox: {
        type: ControlType.Boolean,
        title: "Lightbox",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    aspectRatio: {
        type: ControlType.Number,
        title: "Aspect",
        defaultValue: 3014 / 1924,
        min: 0.5,
        max: 3,
        step: 0.001,
    },
    arrowColor: {
        type: ControlType.Color,
        title: "Icon",
        defaultValue: "rgba(255,255,255,0.9)",
    },
    controlBackground: {
        type: ControlType.Color,
        title: "Control Bg",
        defaultValue: "rgba(87,87,87,0.35)",
    },
    dotColor: {
        type: ControlType.Color,
        title: "Dot",
        defaultValue: "rgba(20,20,20,0.32)",
    },
    activeDotColor: {
        type: ControlType.Color,
        title: "Active Dot",
        defaultValue: "#141414",
    },
    ariaLabel: {
        type: ControlType.String,
        title: "Aria Label",
        defaultValue: "Image carousel",
    },
})
