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

function createCubicBezierEasing(
    x1: number,
    y1: number,
    x2: number,
    y2: number
) {
    const sampleCurveX = (t: number) =>
        ((1.0 - 3.0 * x2 + 3.0 * x1) * t + (3.0 * x2 - 6.0 * x1)) * t * t +
        3.0 * x1 * t
    const sampleCurveY = (t: number) =>
        ((1.0 - 3.0 * y2 + 3.0 * y1) * t + (3.0 * y2 - 6.0 * y1)) * t * t +
        3.0 * y1 * t
    const sampleCurveDerivativeX = (t: number) =>
        (3.0 * (1.0 - 3.0 * x2 + 3.0 * x1) * t + 2.0 * (3.0 * x2 - 6.0 * x1)) *
            t +
        3.0 * x1

    const solveCurveX = (x: number) => {
        let t2 = x
        for (let i = 0; i < 8; i++) {
            const x2 = sampleCurveX(t2) - x
            if (Math.abs(x2) < 1e-6) return t2
            const d2 = sampleCurveDerivativeX(t2)
            if (Math.abs(d2) < 1e-6) break
            t2 -= x2 / d2
        }

        let t0 = 0
        let t1 = 1
        t2 = x
        while (t0 < t1) {
            const x2 = sampleCurveX(t2)
            if (Math.abs(x2 - x) < 1e-6) return t2
            if (x > x2) t0 = t2
            else t1 = t2
            t2 = (t1 - t0) * 0.5 + t0
            if (Math.abs(t1 - t0) < 1e-6) break
        }
        return t2
    }

    return (x: number) => sampleCurveY(solveCurveX(Math.min(Math.max(x, 0), 1)))
}

function resolveScrollEasing(easing: string) {
    const match = easing
        .trim()
        .match(
            /^cubic-bezier\(\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*\)$/i
        )

    if (!match) return easeOutQuart

    const [, sx1, sy1, sx2, sy2] = match
    const x1 = Number(sx1)
    const y1 = Number(sy1)
    const x2 = Number(sx2)
    const y2 = Number(sy2)

    if ([x1, y1, x2, y2].some((n) => Number.isNaN(n))) return easeOutQuart
    if (x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1) return easeOutQuart

    return createCubicBezierEasing(x1, y1, x2, y2)
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
    const easingFunction = React.useMemo(() => resolveScrollEasing(easing), [easing])

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
        const lenis = (window as any).__mhLenis

        if (lenis && typeof lenis.scrollTo === "function") {
            lenis.scrollTo(0, {
                duration: duration / 1000,
                easing: easingFunction,
                force: true,
            })
            frameRef.current = null
            return
        }

        const startTime = window.performance.now()
        const startScrollY = startY

        const tick = (now: number) => {
            const elapsed = now - startTime
            const linearProgress = Math.min(Math.max(elapsed / duration, 0), 1)
            const easedProgress = easingFunction(linearProgress)
            const nextY = Math.max(
                0,
                Math.round(startScrollY - startScrollY * easedProgress)
            )

            window.scrollTo({ top: nextY, behavior: "auto" })

            if (linearProgress < 1 && nextY > 0) {
                frameRef.current = window.requestAnimationFrame(tick)
            } else {
                window.scrollTo({ top: 0, behavior: "auto" })
                frameRef.current = null
            }
        }

        frameRef.current = window.requestAnimationFrame(tick)
    }, [scrollDuration, easingFunction])

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
