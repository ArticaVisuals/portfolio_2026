import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

type Props = {
    enabled?: boolean
    selector?: string
    travel?: number
    duration?: number
    stagger?: number
    threshold?: number
    easing?: string
    style?: React.CSSProperties
}

const STYLE_ID = "case-study-reveal-tuner-style"
const REVEAL_ATTR = "data-case-study-reveal-tuned"
const VISIBLE_ATTR = "data-case-study-reveal-visible"
const OWNER_ATTR = "data-case-study-reveal-owner"

const DEFAULT_SELECTOR = [
    "[data-framer-name='ThumbnailVideo'] [data-framer-name='VideoWrapper']",
    "[data-framer-name='SectionImages'] > [data-framer-name='ImageRow']",
    "[data-framer-name='SectionNextProject'] [data-framer-name='OtherProjectCard']",
].join(", ")

function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value))
}

function removeOwnedAttributes(owner: string) {
    document
        .querySelectorAll<HTMLElement>(`[${OWNER_ATTR}="${owner}"]`)
        .forEach((element) => {
            element.removeAttribute(REVEAL_ATTR)
            element.removeAttribute(VISIBLE_ATTR)
            element.removeAttribute(OWNER_ATTR)
            element.style.removeProperty("--case-study-reveal-delay")
        })
}

/**
 * Case Study Reveal Tuner
 *
 * Page-scoped helper that softens media reveal motion on bespoke case-study pages.
 *
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function CaseStudyRevealTuner({
    enabled = true,
    selector = DEFAULT_SELECTOR,
    travel = 12,
    duration = 240,
    stagger = 50,
    threshold = 0.12,
    easing = "cubic-bezier(.22, 1, .36, 1)",
    style,
}: Props) {
    const rootRef = React.useRef<HTMLDivElement>(null)
    const owner = React.useId().replace(/[^a-zA-Z0-9_-]/g, "")
    const target = RenderTarget.current()
    const isCanvas = target === RenderTarget.canvas || target === RenderTarget.thumbnail

    React.useEffect(() => {
        const root = rootRef.current
        if (!enabled || isCanvas || !root || typeof window === "undefined" || typeof document === "undefined") {
            return
        }

        const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
        const travelPx = Math.max(0, Number(travel) || 0)
        const durationMs = Math.max(0, Number(duration) || 0)
        const staggerMs = Math.max(0, Number(stagger) || 0)
        const revealThreshold = clamp(Number(threshold) || 0, 0, 1)

        let styleElement = document.getElementById(STYLE_ID) as HTMLStyleElement | null
        if (!styleElement) {
            styleElement = document.createElement("style")
            styleElement.id = STYLE_ID
            document.head.appendChild(styleElement)
        }

        styleElement.textContent = `
            [${REVEAL_ATTR}="true"] {
                opacity: 0 !important;
                transform: translate3d(0, ${travelPx}px, 0) !important;
                transition:
                    opacity ${durationMs}ms ${easing} var(--case-study-reveal-delay, 0ms),
                    transform ${durationMs}ms ${easing} var(--case-study-reveal-delay, 0ms) !important;
                will-change: opacity, transform !important;
            }

            [${REVEAL_ATTR}="true"][${VISIBLE_ATTR}="true"] {
                opacity: 1 !important;
                transform: translate3d(0, 0, 0) !important;
            }

            @media (prefers-reduced-motion: reduce) {
                [${REVEAL_ATTR}="true"] {
                    opacity: 1 !important;
                    transform: none !important;
                    transition: none !important;
                    will-change: auto !important;
                }
            }
        `

        let observer: IntersectionObserver | null = null
        if (!prefersReduced && "IntersectionObserver" in window) {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting || entry.intersectionRatio > 0) {
                            const element = entry.target as HTMLElement
                            element.setAttribute(VISIBLE_ATTR, "true")
                            observer?.unobserve(element)
                        }
                    })
                },
                {
                    threshold: revealThreshold,
                    rootMargin: "0px 0px -8% 0px",
                }
            )
        }

        const sync = () => {
            const targets = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
                (element) => element !== root && !root.contains(element)
            )

            targets.forEach((element, index) => {
                element.setAttribute(REVEAL_ATTR, "true")
                element.setAttribute(OWNER_ATTR, owner)
                element.style.setProperty("--case-study-reveal-delay", `${Math.min(index, 8) * staggerMs}ms`)

                if (prefersReduced) {
                    element.setAttribute(VISIBLE_ATTR, "true")
                    return
                }

                const rect = element.getBoundingClientRect()
                if (rect.top < window.innerHeight * 0.94) {
                    element.setAttribute(VISIBLE_ATTR, "true")
                    return
                }

                observer?.observe(element)
            })
        }

        sync()
        const timeouts = [120, 500, 1200].map((delay) => window.setTimeout(sync, delay))
        const mutationObserver = new MutationObserver(sync)
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["data-framer-name", "name", "class", "style"],
        })
        window.addEventListener("resize", sync, { passive: true })

        return () => {
            timeouts.forEach((id) => window.clearTimeout(id))
            observer?.disconnect()
            mutationObserver.disconnect()
            window.removeEventListener("resize", sync)
            removeOwnedAttributes(owner)
            if (styleElement?.parentNode) styleElement.parentNode.removeChild(styleElement)
        }
    }, [enabled, selector, travel, duration, stagger, threshold, easing, owner, isCanvas])

    return (
        <div
            ref={rootRef}
            aria-hidden="true"
            style={{
                ...style,
                width: "100%",
                height: "100%",
                opacity: 0,
                pointerEvents: "none",
                overflow: "hidden",
            }}
        />
    )
}

addPropertyControls<Props>(CaseStudyRevealTuner, {
    enabled: {
        type: ControlType.Boolean,
        title: "Enabled",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    selector: {
        type: ControlType.String,
        title: "Targets",
        defaultValue: DEFAULT_SELECTOR,
        displayTextArea: true,
        hidden: ({ enabled }) => !enabled,
    },
    travel: {
        type: ControlType.Number,
        title: "Travel",
        defaultValue: 12,
        min: 0,
        max: 60,
        step: 1,
        unit: "px",
        hidden: ({ enabled }) => !enabled,
    },
    duration: {
        type: ControlType.Number,
        title: "Duration",
        defaultValue: 240,
        min: 0,
        max: 900,
        step: 20,
        unit: "ms",
        hidden: ({ enabled }) => !enabled,
    },
    stagger: {
        type: ControlType.Number,
        title: "Stagger",
        defaultValue: 50,
        min: 0,
        max: 180,
        step: 10,
        unit: "ms",
        hidden: ({ enabled }) => !enabled,
    },
    threshold: {
        type: ControlType.Number,
        title: "Threshold",
        defaultValue: 0.12,
        min: 0,
        max: 1,
        step: 0.01,
        hidden: ({ enabled }) => !enabled,
    },
    easing: {
        type: ControlType.String,
        title: "Easing",
        defaultValue: "cubic-bezier(.22, 1, .36, 1)",
        hidden: ({ enabled }) => !enabled,
    },
})
