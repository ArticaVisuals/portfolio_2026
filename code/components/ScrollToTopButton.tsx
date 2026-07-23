import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type ScrollToTopButtonProps = {
    label: string
    color: string
    scrollDuration: number
    animationDuration: number
    easing: string
}

const DEFAULT_COLOR = "#233324"
const DEFAULT_EASING = "cubic-bezier(0.16, 1, 0.3, 1)"
const DEFAULT_SCROLL_DURATION = 900
const ROW_HEIGHT = 16
const ROW_GAP = 4
const ROW_SHIFT = ROW_HEIGHT + ROW_GAP

function easeOutQuart(progress: number) {
    return 1 - Math.pow(1 - progress, 4)
}

/**
 * Scroll-to-top prompt using the same mono label and clipped arrow cadence
 * as the existing Scroll More component.
 *
 * @framerIntrinsicWidth 126
 * @framerIntrinsicHeight 16
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function ScrollToTopButton({
    label = "scroll to top",
    color = DEFAULT_COLOR,
    scrollDuration = DEFAULT_SCROLL_DURATION,
    animationDuration = 1.35,
    easing = DEFAULT_EASING,
}: Partial<ScrollToTopButtonProps>) {
    const frameRef = React.useRef<number | null>(null)

    React.useEffect(() => {
        return () => {
            if (frameRef.current === null || typeof window === "undefined") return
            window.cancelAnimationFrame(frameRef.current)
        }
    }, [])

    const handleClick = React.useCallback(() => {
        if (typeof window === "undefined") return

        const reduceMotion = window.matchMedia?.(
            "(prefers-reduced-motion: reduce)"
        )?.matches

        if (frameRef.current !== null) {
            window.cancelAnimationFrame(frameRef.current)
        }

        const startY = window.scrollY || document.documentElement.scrollTop || 0

        if (reduceMotion || startY <= 0) {
            window.scrollTo(0, 0)
            frameRef.current = null
            return
        }

        const duration = Math.max(250, scrollDuration)
        const startTime = window.performance.now()

        const tick = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easedProgress = easeOutQuart(progress)

            window.scrollTo(0, Math.round(startY * (1 - easedProgress)))

            if (progress < 1) {
                frameRef.current = window.requestAnimationFrame(tick)
            } else {
                frameRef.current = null
            }
        }

        frameRef.current = window.requestAnimationFrame(tick)
    }, [scrollDuration])

    return (
        <button
            className="mh-scroll-top-button"
            type="button"
            aria-label={label}
            onClick={handleClick}
            style={{
                width: "fit-content",
                height: `${ROW_HEIGHT}px`,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: 0,
                margin: 0,
                border: 0,
                background: "transparent",
                color,
                cursor: "pointer",
                fontFamily:
                    "'GT Standard Mono', 'GT Standard Mono Regular', 'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace",
                fontSize: "13px",
                fontWeight: 400,
                lineHeight: `${ROW_HEIGHT}px`,
                letterSpacing: "-0.01em",
                textTransform: "uppercase",
                WebkitFontSmoothing: "antialiased",
                MozOsxFontSmoothing: "grayscale",
            }}
        >
            <span
                className="mh-scroll-top-label-mask"
                style={{
                    height: `${ROW_HEIGHT}px`,
                    display: "inline-block",
                    overflow: "hidden",
                    lineHeight: `${ROW_HEIGHT}px`,
                    verticalAlign: "middle",
                }}
            >
                <span className="mh-scroll-top-label-rail">
                    <span>{label}</span>
                    <span>{label}</span>
                </span>
            </span>
            <span
                aria-hidden="true"
                style={{
                    width: "1em",
                    height: `${ROW_HEIGHT}px`,
                    display: "inline-block",
                    overflow: "hidden",
                    lineHeight: `${ROW_HEIGHT}px`,
                    textAlign: "center",
                    verticalAlign: "middle",
                }}
            >
                <span
                    className="mh-scroll-top-arrow-rail"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: `${ROW_GAP}px`,
                        animation: `mh-scroll-top-arrow ${animationDuration}s ${easing} infinite`,
                    }}
                >
                    <span>↑</span>
                    <span>↑</span>
                    <span>↑</span>
                </span>
            </span>
            <style>{`
                .mh-scroll-top-label-rail,
                .mh-scroll-top-arrow-rail {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .mh-scroll-top-label-rail {
                    gap: ${ROW_GAP}px;
                    transform: translateY(0);
                    transition: transform 500ms ${DEFAULT_EASING};
                }

                .mh-scroll-top-label-rail span,
                .mh-scroll-top-arrow-rail span {
                    height: ${ROW_HEIGHT}px;
                    flex: 0 0 ${ROW_HEIGHT}px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: ${ROW_HEIGHT}px;
                    white-space: nowrap;
                }

                .mh-scroll-top-button:hover .mh-scroll-top-label-rail,
                .mh-scroll-top-button:focus-visible .mh-scroll-top-label-rail {
                    transform: translateY(-${ROW_SHIFT}px);
                }

                .mh-scroll-top-button:focus-visible {
                    outline: 1px solid currentColor;
                    outline-offset: 4px;
                }

                @keyframes mh-scroll-top-arrow {
                    0%, 18% {
                        transform: translateY(-${ROW_SHIFT}px);
                    }
                    62%, 100% {
                        transform: translateY(-${ROW_SHIFT * 2}px);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .mh-scroll-top-label-rail,
                    .mh-scroll-top-arrow-rail {
                        animation: none !important;
                        transition: none !important;
                    }

                    .mh-scroll-top-label-rail {
                        transform: none !important;
                    }

                    .mh-scroll-top-arrow-rail {
                        transform: translateY(-${ROW_SHIFT}px) !important;
                    }
                }
            `}</style>
        </button>
    )
}

addPropertyControls(ScrollToTopButton, {
    label: {
        type: ControlType.String,
        title: "Label",
        defaultValue: "scroll to top",
    },
    color: {
        type: ControlType.Color,
        title: "Color",
        defaultValue: DEFAULT_COLOR,
    },
    scrollDuration: {
        type: ControlType.Number,
        title: "Scroll",
        defaultValue: DEFAULT_SCROLL_DURATION,
        min: 250,
        max: 1800,
        step: 50,
        unit: "ms",
    },
    animationDuration: {
        type: ControlType.Number,
        title: "Arrow",
        defaultValue: 1.35,
        min: 0.4,
        max: 3,
        step: 0.05,
        unit: "s",
    },
    easing: {
        type: ControlType.String,
        title: "Easing",
        defaultValue: DEFAULT_EASING,
    },
})
