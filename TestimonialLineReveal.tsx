// Testimonial Line Reveal
//
// User request: Build a component like the Osmo "Line Reveal Testimonials"
// in Framer, but using MY existing type styles, color styles, and the motion
// ease curve already in MY system. No profile photo — just name and role.
// Be able to enable/disable the left/right arrow toggles. Usable as a one-off
// at the end of case studies AND possibly on the About page with the arrow
// toggle, using an arrow from MY GT Standard icon set.
//
// Follow-ups:
// - blank eyebrow hides it; colors / ease / sizing controls live behind an
//   "Advanced" toggle so the primary panel stays simple.
// - Responsive type: the quote scales DOWN at tablet/mobile widths (measured
//   from the component's own width, so it tracks the Framer breakpoint it sits
//   in) via tabletScale / mobileScale, with an 18px floor for legibility. The
//   small mono/name/role text stays at its set size (already mobile-safe), so
//   nothing drops below an accessible size. You can also still override
//   quoteSize per breakpoint in the Framer panel.
// - Long quotes on MOBILE get an optional "Read more" collapse (default on) so
//   a 12-line quote doesn't dominate a phone screen; desktop/tablet always show
//   the full quote.
//
// Notes on system fidelity:
// - Ease defaults to the site's canonical SMOOTH_EASE cubic-bezier(0.12,0.23,0.5,1).
// - Type is the GT Standard family stack (CUSTOMV2 custom font): quote = GT
//   Standard L Regular (/Heading 2 minus capitalize), name = GT Standard Trial
//   L Bd (/Heading 4), role = GT Standard L Regular, label = GT Standard Mono
//   (/Heading 5). Colors default to /Off-Black (#141414) and /Light Gray (#979797).
//
// Framer code file id: tpDdaaJ. Instance fJKupkZPa lives on /case-studies/airpods
// (arrows/counter off one-off). See code-components-map.md + framer-current-state.md.

import {
    addPropertyControls,
    ControlType,
    useIsStaticRenderer,
} from "framer"
import { useInView } from "framer-motion"
import {
    startTransition,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
} from "react"

// ---- System tokens -------------------------------------------------------

// Canonical site ease (matches the Image Carousel's SMOOTH_EASE).
const SITE_EASE = "cubic-bezier(0.12, 0.23, 0.5, 1)"

// GT Standard family stacks, mirroring the project's custom (CUSTOMV2) fonts.
const FONT_DISPLAY =
    '"GT Standard L Regular", "GT Standard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
const FONT_BOLD =
    '"GT Standard Trial L Bd", "GT Standard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
const FONT_MONO =
    '"GT Standard Mono Regular", "GT Standard Mono", ui-monospace, SFMono-Regular, Menlo, monospace'

// Width breakpoints, measured on the component's own root (so it tracks whatever
// Framer breakpoint it's placed in, not the raw viewport).
const TABLET_MAX = 860
const MOBILE_MAX = 520

type Testimonial = {
    quote?: string
    name?: string
    role?: string
}

type Props = {
    testimonials: Testimonial[]
    eyebrow: string
    showArrows: boolean
    showCounter: boolean
    autoplay: boolean
    interval: number
    align: "left" | "center"
    mobileReadMore: boolean
    mobileClampLines: number
    advanced: boolean
    contentMaxWidth: number
    quoteSize: number
    tabletScale: number
    mobileScale: number
    quoteLineHeight: number
    nameSize: number
    roleSize: number
    labelSize: number
    prevGlyph: string
    nextGlyph: string
    arrowSize: number
    duration: number
    stagger: number
    ease: string
    quoteColor: string
    nameColor: string
    roleColor: string
    labelColor: string
    counterColor: string
    arrowColor: string
    arrowBorderColor: string
    backgroundColor: string
    style?: CSSProperties
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
    {
        quote: "After a rough quarter, we needed hands fast. Their team jumped in with clear pricing and flexible coverage for weekend rushes and supplier delays. They've become our first call when operations get tight.",
        name: "Mara Kline",
        role: "Northbay Produce Co.",
    },
    {
        quote: "During our expansion, training and onboarding fell behind. They stepped in with consistent staffing, fair rates, and quick turnaround for urgent shifts.",
        name: "Devin Asher",
        role: "Harborline Logistics",
    },
    {
        quote: "What stood out was how little we had to manage. The work was thoughtful, the communication steady, and the results spoke for themselves.",
        name: "Priya Raman",
        role: "Studio Field",
    },
]

/**
 * Testimonial Line Reveal
 *
 * @framerIntrinsicWidth 900
 * @framerIntrinsicHeight 520
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function TestimonialLineReveal(props: Props) {
    const {
        testimonials = DEFAULT_TESTIMONIALS,
        eyebrow = "What our clients say:",
        showArrows = true,
        showCounter = true,
        autoplay = false,
        interval = 5,
        align = "left",
        mobileReadMore = true,
        mobileClampLines = 6,
        contentMaxWidth = 820,
        quoteSize = 48,
        tabletScale = 0.8,
        mobileScale = 0.62,
        quoteLineHeight = 1.12,
        nameSize = 20,
        roleSize = 16,
        labelSize = 13,
        prevGlyph = "←",
        nextGlyph = "→",
        arrowSize = 44,
        duration = 0.7,
        stagger = 0.08,
        ease = SITE_EASE,
        quoteColor = "#141414",
        nameColor = "#141414",
        roleColor = "#979797",
        labelColor = "#141414",
        counterColor = "#979797",
        arrowColor = "#141414",
        arrowBorderColor = "rgba(20,20,20,0.18)",
        backgroundColor = "rgba(0,0,0,0)",
        style,
    } = props

    const items =
        Array.isArray(testimonials) && testimonials.length > 0
            ? testimonials
            : DEFAULT_TESTIMONIALS
    const count = items.length
    const isStatic = useIsStaticRenderer()

    const [index, setIndex] = useState(0)
    // mode controls which way hidden lines sit: "in" → below the mask (slide up
    // to reveal), "out" → above the mask (slide up to clear).
    const [mode, setMode] = useState<"in" | "out">("in")
    const [shown, setShown] = useState(isStatic)
    const [lines, setLines] = useState<string[]>([])
    const [width, setWidth] = useState(0)
    const [expanded, setExpanded] = useState(false)

    const busyRef = useRef(false)
    const hasRevealedRef = useRef(false)
    const reducedMotion = useRef(false)

    const sectionRef = useRef<HTMLElement>(null)
    const columnRef = useRef<HTMLDivElement>(null)
    const measureRef = useRef<HTMLDivElement>(null)

    const inView = useInView(sectionRef as any, {
        once: true,
        margin: "-12% 0px -12% 0px",
    })

    const safeIndex = Math.min(index, count - 1)
    const current = items[safeIndex] || {}
    const quoteText = (current.quote || "").trim()

    // ---- Responsive sizing (driven by the component's own width) --------
    const breakpoint =
        width === 0
            ? "desktop"
            : width <= MOBILE_MAX
              ? "mobile"
              : width <= TABLET_MAX
                ? "tablet"
                : "desktop"
    const isMobile = breakpoint === "mobile"
    const quoteScale =
        breakpoint === "mobile"
            ? mobileScale
            : breakpoint === "tablet"
              ? tabletScale
              : 1
    // 18px floor keeps the quote legible no matter how aggressive the scale.
    const quoteSizeEff = Math.max(18, Math.round(quoteSize * quoteScale))
    const rhythm = quoteSizeEff

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return
        reducedMotion.current = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    }, [])

    // Reset the read-more collapse whenever the testimonial changes.
    useEffect(() => {
        setExpanded(false)
    }, [safeIndex])

    // ---- Measure the quote into visual lines ----------------------------
    const decorated = useMemo(
        () => (quoteText ? `“${quoteText}”` : ""),
        [quoteText]
    )
    const words = useMemo(
        () => (decorated ? decorated.split(/\s+/) : []),
        [decorated]
    )

    const measure = useCallback(() => {
        const el = measureRef.current
        if (!el) return
        const spans = el.querySelectorAll<HTMLElement>("[data-word]")
        const next: string[] = []
        let lineTop: number | null = null
        let buffer: string[] = []
        spans.forEach((span) => {
            const top = span.offsetTop
            if (lineTop === null || Math.abs(top - lineTop) > 1) {
                if (buffer.length) next.push(buffer.join(" "))
                buffer = []
                lineTop = top
            }
            buffer.push(span.textContent || "")
        })
        if (buffer.length) next.push(buffer.join(" "))
        setLines((prev) =>
            prev.length === next.length && prev.every((l, i) => l === next[i])
                ? prev
                : next
        )
    }, [])

    useLayoutEffect(() => {
        const root = sectionRef.current
        if (root) startTransition(() => setWidth(root.offsetWidth))
        measure()
        if (typeof window === "undefined") return
        let ro: ResizeObserver | undefined
        if ("ResizeObserver" in window && root) {
            ro = new ResizeObserver((entries) => {
                const w = entries[0]?.contentRect?.width
                if (typeof w === "number") startTransition(() => setWidth(w))
                measure()
            })
            ro.observe(root)
        }
        const fonts = (document as any).fonts
        if (fonts && fonts.ready && typeof fonts.ready.then === "function") {
            fonts.ready.then(() => measure())
        }
        return () => ro?.disconnect()
        // Re-measure when the rendered quote metrics change.
    }, [measure, decorated, quoteSizeEff, quoteLineHeight])

    // ---- Reveal orchestration -------------------------------------------
    const playIn = useCallback(() => {
        if (isStatic || reducedMotion.current) {
            setShown(true)
            return
        }
        setMode("in")
        setShown(false)
        let r1 = 0
        let r2 = 0
        r1 = requestAnimationFrame(() => {
            r2 = requestAnimationFrame(() => startTransition(() => setShown(true)))
        })
        return () => {
            cancelAnimationFrame(r1)
            cancelAnimationFrame(r2)
        }
    }, [isStatic])

    // First reveal — when the section scrolls into view (good for a one-off at
    // the end of a case study) or immediately in the static editor.
    useEffect(() => {
        if (isStatic) {
            setShown(true)
            hasRevealedRef.current = true
            return
        }
        if (inView && !hasRevealedRef.current) {
            hasRevealedRef.current = true
            return playIn()
        }
    }, [inView, isStatic, playIn])

    // Re-reveal when the displayed testimonial changes (navigation / autoplay).
    useEffect(() => {
        if (isStatic) return
        if (!hasRevealedRef.current) return
        const cleanup = playIn()
        const inMs =
            (duration + stagger * Math.max(0, lines.length - 1)) * 1000 + 60
        const t = window.setTimeout(() => {
            busyRef.current = false
        }, inMs)
        return () => {
            window.clearTimeout(t)
            if (cleanup) cleanup()
        }
        // Trigger on index changes only; lines settle from the measure pass.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [safeIndex])

    const navigate = useCallback(
        (dir: number) => {
            if (count < 2 || busyRef.current) return
            busyRef.current = true
            if (isStatic || reducedMotion.current) {
                setIndex((i) => (i + dir + count) % count)
                return
            }
            // Page the current lines out (upwards), then swap + page the next in.
            setMode("out")
            setShown(false)
            const outMs =
                (duration + stagger * Math.max(0, lines.length - 1)) * 1000
            window.setTimeout(() => {
                startTransition(() => setIndex((i) => (i + dir + count) % count))
            }, outMs)
        },
        [count, duration, isStatic, lines.length, stagger]
    )

    const goNext = useCallback(() => navigate(1), [navigate])
    const goPrev = useCallback(() => navigate(-1), [navigate])

    // Autoplay (paused while hovered / out of view / single item).
    const [hovered, setHovered] = useState(false)
    useEffect(() => {
        if (isStatic || !autoplay || count < 2 || hovered || !inView) return
        const id = window.setInterval(
            () => navigate(1),
            Math.max(2, interval) * 1000
        )
        return () => window.clearInterval(id)
    }, [autoplay, count, hovered, inView, interval, isStatic, navigate])

    // Keyboard support when arrows are enabled and there are multiple items.
    const onKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (!showArrows || count < 2) return
            if (e.key === "ArrowLeft") {
                e.preventDefault()
                goPrev()
            } else if (e.key === "ArrowRight") {
                e.preventDefault()
                goNext()
            }
        },
        [count, goNext, goPrev, showArrows]
    )

    // ---- Styles ----------------------------------------------------------
    const quoteTypeStyle: CSSProperties = {
        fontFamily: FONT_DISPLAY,
        fontSize: quoteSizeEff,
        lineHeight: quoteLineHeight,
        letterSpacing: "-0.02em",
        fontWeight: 400,
        color: quoteColor,
        margin: 0,
        textAlign: align,
    }

    const labelStyle: CSSProperties = {
        fontFamily: FONT_MONO,
        fontSize: labelSize,
        lineHeight: 1,
        letterSpacing: "-0.01em",
        textTransform: "uppercase",
        fontWeight: 400,
    }

    const hiddenTransform =
        mode === "out" ? "translateY(-115%)" : "translateY(115%)"

    const revealed = shown || isStatic

    const canNavigate = count > 1
    const showArrowRow = showArrows && canNavigate
    const showCounterEl = showCounter && canNavigate

    // ---- Read-more (mobile only, long quotes) ---------------------------
    const clampN = Math.max(2, Math.round(mobileClampLines))
    const clampable =
        isMobile && mobileReadMore && !isStatic && lines.length > clampN
    const collapsed = clampable && !expanded
    const visibleLines = collapsed ? lines.slice(0, clampN) : lines

    return (
        <section
            ref={sectionRef}
            onKeyDown={onKeyDown}
            tabIndex={showArrowRow ? 0 : -1}
            aria-roledescription="carousel"
            aria-label="Testimonials"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                ...style,
                position: "relative",
                width: "100%",
                height: style?.height,
                boxSizing: "border-box",
                background: backgroundColor,
                display: "flex",
                flexDirection: "column",
                gap: Math.round(rhythm * 0.9),
                padding: 0,
                outline: "none",
                userSelect: "none",
                WebkitFontSmoothing: "antialiased",
            }}
        >
            {showArrowRow && (
                <div style={{ display: "flex", gap: 10 }}>
                    <ArrowButton
                        glyph={prevGlyph}
                        label="Previous testimonial"
                        size={arrowSize}
                        color={arrowColor}
                        borderColor={arrowBorderColor}
                        ease={ease}
                        onClick={goPrev}
                    />
                    <ArrowButton
                        glyph={nextGlyph}
                        label="Next testimonial"
                        size={arrowSize}
                        color={arrowColor}
                        borderColor={arrowBorderColor}
                        ease={ease}
                        onClick={goNext}
                    />
                </div>
            )}

            <div
                ref={columnRef}
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: contentMaxWidth,
                    marginLeft: align === "center" ? "auto" : 0,
                    marginRight: align === "center" ? "auto" : 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: align === "center" ? "center" : "flex-start",
                }}
            >
                {/* Eyebrow + counter */}
                {(eyebrow || showCounterEl) && (
                    <div
                        style={{
                            display: "flex",
                            gap: 18,
                            marginBottom: Math.round(rhythm * 0.6),
                            color: labelColor,
                            justifyContent:
                                align === "center" ? "center" : "flex-start",
                            width: "100%",
                        }}
                    >
                        {showCounterEl && (
                            <span
                                aria-hidden="true"
                                style={{ ...labelStyle, color: counterColor }}
                            >
                                {safeIndex + 1} / {count}
                            </span>
                        )}
                        {eyebrow && <span style={labelStyle}>{eyebrow}</span>}
                    </div>
                )}

                {/* Measuring layer (mirrors the visible quote, never painted) */}
                <div
                    ref={measureRef}
                    aria-hidden="true"
                    style={{
                        ...quoteTypeStyle,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        visibility: "hidden",
                        pointerEvents: "none",
                        height: 0,
                        overflow: "hidden",
                    }}
                >
                    {words.map((word, i) => (
                        <span data-word key={i}>
                            {word}
                            {i < words.length - 1 ? " " : ""}
                        </span>
                    ))}
                </div>

                {/* Visible quote — masked, line-by-line reveal. Falls back to a
                    plain block before the measure pass runs (SSR / no-JS) so the
                    quote is never invisible. */}
                <blockquote
                    style={{
                        ...quoteTypeStyle,
                        width: "100%",
                        position: "relative",
                    }}
                >
                    {lines.length === 0
                        ? decorated && (
                              <span style={{ display: "block" }}>
                                  {decorated}
                              </span>
                          )
                        : visibleLines.map((line, i) => (
                              <span
                                  key={`${safeIndex}-${i}-${line}`}
                                  style={{
                                      display: "block",
                                      overflow: "hidden",
                                      paddingBottom: "0.14em",
                                      marginBottom: "-0.14em",
                                  }}
                              >
                                  <span
                                      style={{
                                          display: "block",
                                          willChange: "transform",
                                          transform: revealed
                                              ? "translateY(0%)"
                                              : hiddenTransform,
                                          transition:
                                              isStatic || reducedMotion.current
                                                  ? "none"
                                                  : mode === "out" || shown
                                                    ? `transform ${duration}s ${ease} ${i * stagger}s`
                                                    : "none",
                                      }}
                                  >
                                      {line}
                                  </span>
                              </span>
                          ))}
                </blockquote>

                {/* Mobile read-more toggle for long quotes */}
                {clampable && (
                    <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() => setExpanded((e) => !e)}
                        style={{
                            ...labelStyle,
                            marginTop: Math.round(rhythm * 0.45),
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "2px 0",
                            border: "none",
                            background: "transparent",
                            color: labelColor,
                            cursor: "pointer",
                            borderBottom: `1px solid ${arrowBorderColor}`,
                        }}
                    >
                        {expanded ? "Read less" : "Read more"}
                        <span aria-hidden="true" style={{ fontFamily: FONT_DISPLAY }}>
                            {expanded ? "↑" : "↓"}
                        </span>
                    </button>
                )}

                {/* Attribution — name + role, no photo */}
                {(current.name || current.role) && (
                    <div
                        style={{
                            marginTop: Math.round(rhythm * 0.7),
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                            alignItems:
                                align === "center" ? "center" : "flex-start",
                            textAlign: align,
                            transform: revealed
                                ? "translateY(0)"
                                : "translateY(12px)",
                            opacity: revealed ? 1 : 0,
                            transition:
                                isStatic || reducedMotion.current
                                    ? "none"
                                    : `transform ${duration}s ${ease} ${
                                          mode === "out"
                                              ? 0
                                              : Math.max(0, lines.length - 1) *
                                                stagger
                                      }s, opacity ${duration}s ${ease} ${
                                          mode === "out"
                                              ? 0
                                              : Math.max(0, lines.length - 1) *
                                                stagger
                                      }s`,
                        }}
                    >
                        {current.name && (
                            <span
                                style={{
                                    fontFamily: FONT_BOLD,
                                    fontSize: nameSize,
                                    lineHeight: 1.3,
                                    letterSpacing: "0em",
                                    color: nameColor,
                                    fontWeight: 700,
                                }}
                            >
                                {current.name}
                            </span>
                        )}
                        {current.role && (
                            <span
                                style={{
                                    fontFamily: FONT_DISPLAY,
                                    fontSize: roleSize,
                                    lineHeight: 1.3,
                                    letterSpacing: "0em",
                                    color: roleColor,
                                    fontWeight: 400,
                                }}
                            >
                                {current.role}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}

type ArrowButtonProps = {
    glyph: string
    label: string
    size: number
    color: string
    borderColor: string
    ease: string
    onClick: () => void
}

function ArrowButton({
    glyph,
    label,
    size,
    color,
    borderColor,
    ease,
    onClick,
}: ArrowButtonProps) {
    const [hovered, setHovered] = useState(false)
    return (
        <button
            type="button"
            aria-label={label}
            onClick={(e) => {
                e.stopPropagation()
                onClick()
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: size,
                height: size,
                display: "grid",
                placeItems: "center",
                padding: 0,
                borderRadius: 4,
                border: `1px solid ${borderColor}`,
                background: hovered ? "rgba(20,20,20,0.05)" : "transparent",
                color,
                cursor: "pointer",
                transition: `background 0.25s ${ease}`,
                fontFamily: FONT_DISPLAY,
                fontSize: Math.round(size * 0.42),
                lineHeight: 1,
            }}
        >
            <span aria-hidden="true" style={{ display: "block" }}>
                {glyph}
            </span>
        </button>
    )
}

// Hidden helpers keep the primary panel tidy; everything stylistic lives behind
// the "Advanced" toggle.
const hideUnlessAdvanced = ({ advanced }: Partial<Props>) => !advanced
const hideUnlessAdvancedArrows = ({ advanced, showArrows }: Partial<Props>) =>
    !advanced || !showArrows

addPropertyControls(TestimonialLineReveal, {
    testimonials: {
        type: ControlType.Array,
        title: "Testimonials",
        maxCount: 50,
        control: {
            type: ControlType.Object,
            controls: {
                quote: {
                    type: ControlType.String,
                    title: "Quote",
                    defaultValue: "",
                    displayTextArea: true,
                },
                name: {
                    type: ControlType.String,
                    title: "Name",
                    defaultValue: "",
                },
                role: {
                    type: ControlType.String,
                    title: "Role",
                    defaultValue: "",
                },
            },
        },
        defaultValue: DEFAULT_TESTIMONIALS,
    },
    eyebrow: {
        type: ControlType.String,
        title: "Eyebrow",
        defaultValue: "What our clients say:",
        placeholder: "Leave empty to hide",
    },
    showArrows: {
        type: ControlType.Boolean,
        title: "Arrows",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
    showCounter: {
        type: ControlType.Boolean,
        title: "Counter",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
    prevGlyph: {
        type: ControlType.String,
        title: "Prev Glyph",
        defaultValue: "←",
        hidden: ({ showArrows }) => !showArrows,
    },
    nextGlyph: {
        type: ControlType.String,
        title: "Next Glyph",
        defaultValue: "→",
        hidden: ({ showArrows }) => !showArrows,
    },
    autoplay: {
        type: ControlType.Boolean,
        title: "Autoplay",
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    interval: {
        type: ControlType.Number,
        title: "Delay",
        defaultValue: 5,
        min: 2,
        max: 15,
        step: 0.5,
        unit: "s",
        hidden: ({ autoplay }) => !autoplay,
    },
    align: {
        type: ControlType.Enum,
        title: "Align",
        options: ["left", "center"],
        optionTitles: ["Left", "Center"],
        defaultValue: "left",
        displaySegmentedControl: true,
    },
    mobileReadMore: {
        type: ControlType.Boolean,
        title: "Mobile Read More",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    mobileClampLines: {
        type: ControlType.Number,
        title: "Clamp Lines",
        defaultValue: 6,
        min: 3,
        max: 14,
        step: 1,
        hidden: ({ mobileReadMore }) => !mobileReadMore,
    },
    advanced: {
        type: ControlType.Boolean,
        title: "Advanced",
        defaultValue: false,
        enabledTitle: "Shown",
        disabledTitle: "Hidden",
    },
    contentMaxWidth: {
        type: ControlType.Number,
        title: "Max Width",
        defaultValue: 820,
        min: 320,
        max: 1400,
        step: 10,
        unit: "px",
        hidden: hideUnlessAdvanced,
    },
    quoteSize: {
        type: ControlType.Number,
        title: "Quote Size",
        defaultValue: 48,
        min: 20,
        max: 120,
        step: 1,
        unit: "px",
        hidden: hideUnlessAdvanced,
    },
    tabletScale: {
        type: ControlType.Number,
        title: "Tablet Scale",
        defaultValue: 0.8,
        min: 0.4,
        max: 1,
        step: 0.02,
        hidden: hideUnlessAdvanced,
    },
    mobileScale: {
        type: ControlType.Number,
        title: "Mobile Scale",
        defaultValue: 0.62,
        min: 0.4,
        max: 1,
        step: 0.02,
        hidden: hideUnlessAdvanced,
    },
    quoteLineHeight: {
        type: ControlType.Number,
        title: "Quote Leading",
        defaultValue: 1.12,
        min: 1,
        max: 1.6,
        step: 0.01,
        hidden: hideUnlessAdvanced,
    },
    nameSize: {
        type: ControlType.Number,
        title: "Name Size",
        defaultValue: 20,
        min: 12,
        max: 40,
        step: 1,
        unit: "px",
        hidden: hideUnlessAdvanced,
    },
    roleSize: {
        type: ControlType.Number,
        title: "Role Size",
        defaultValue: 16,
        min: 11,
        max: 32,
        step: 1,
        unit: "px",
        hidden: hideUnlessAdvanced,
    },
    labelSize: {
        type: ControlType.Number,
        title: "Label Size",
        defaultValue: 13,
        min: 10,
        max: 20,
        step: 1,
        unit: "px",
        hidden: hideUnlessAdvanced,
    },
    arrowSize: {
        type: ControlType.Number,
        title: "Arrow Size",
        defaultValue: 44,
        min: 28,
        max: 72,
        step: 1,
        unit: "px",
        hidden: hideUnlessAdvancedArrows,
    },
    duration: {
        type: ControlType.Number,
        title: "Duration",
        defaultValue: 0.7,
        min: 0.2,
        max: 1.6,
        step: 0.05,
        unit: "s",
        hidden: hideUnlessAdvanced,
    },
    stagger: {
        type: ControlType.Number,
        title: "Line Stagger",
        defaultValue: 0.08,
        min: 0,
        max: 0.3,
        step: 0.01,
        unit: "s",
        hidden: hideUnlessAdvanced,
    },
    ease: {
        type: ControlType.String,
        title: "Ease",
        defaultValue: SITE_EASE,
        hidden: hideUnlessAdvanced,
    },
    quoteColor: {
        type: ControlType.Color,
        title: "Quote",
        defaultValue: "#141414",
        hidden: hideUnlessAdvanced,
    },
    nameColor: {
        type: ControlType.Color,
        title: "Name",
        defaultValue: "#141414",
        hidden: hideUnlessAdvanced,
    },
    roleColor: {
        type: ControlType.Color,
        title: "Role",
        defaultValue: "#979797",
        hidden: hideUnlessAdvanced,
    },
    labelColor: {
        type: ControlType.Color,
        title: "Eyebrow",
        defaultValue: "#141414",
        hidden: hideUnlessAdvanced,
    },
    counterColor: {
        type: ControlType.Color,
        title: "Counter",
        defaultValue: "#979797",
        hidden: hideUnlessAdvanced,
    },
    arrowColor: {
        type: ControlType.Color,
        title: "Arrow",
        defaultValue: "#141414",
        hidden: hideUnlessAdvancedArrows,
    },
    arrowBorderColor: {
        type: ControlType.Color,
        title: "Arrow Border",
        defaultValue: "rgba(20,20,20,0.18)",
        hidden: hideUnlessAdvancedArrows,
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "rgba(0,0,0,0)",
        hidden: hideUnlessAdvanced,
    },
})
