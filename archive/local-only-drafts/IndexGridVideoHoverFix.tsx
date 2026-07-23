import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Props = {
    enabled: boolean
    hoverScale: number
}

const HIDDEN_CMS_LINK_SELECTOR = '[data-framer-name="CmsLink"], [name="CmsLink"]'
const HIDDEN_CMS_INTERACTIVE_SELECTOR = 'a[href], [role="link"], [tabindex]'
const HIDDEN_CMS_LINK_INERT_ATTR = "data-index-hidden-cms-link-inert"

function preventHiddenCMSLinkClick(event: MouseEvent) {
    const target = event.target
    if (!(target instanceof Element)) return
    if (!target.closest(`[${HIDDEN_CMS_LINK_INERT_ATTR}="true"]`)) return

    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
}

function inertHiddenCMSLinks(): number {
    if (typeof document === "undefined") return 0

    let count = 0
    document.querySelectorAll<HTMLElement>(HIDDEN_CMS_LINK_SELECTOR).forEach((container) => {
        container.setAttribute("aria-hidden", "true")

        container
            .querySelectorAll<HTMLElement>(HIDDEN_CMS_INTERACTIVE_SELECTOR)
            .forEach((element) => {
                element.setAttribute("tabindex", "-1")
                element.setAttribute("aria-hidden", "true")
                element.setAttribute(HIDDEN_CMS_LINK_INERT_ATTR, "true")
                element.addEventListener("click", preventHiddenCMSLinkClick, true)
                count += 1
            })
    })

    return count
}

function useHiddenCMSLinkInerting(enabled: boolean) {
    React.useEffect(() => {
        if (!enabled || typeof window === "undefined") return

        let frame = 0
        const timeouts: number[] = []

        const run = () => {
            window.cancelAnimationFrame(frame)
            frame = window.requestAnimationFrame(inertHiddenCMSLinks)
        }

        run()
        ;[100, 350, 900, 1800, 3200].forEach((delay) => {
            timeouts.push(window.setTimeout(run, delay))
        })

        const observer = new MutationObserver(run)
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["href", "role", "tabindex", "data-framer-name", "name"],
            childList: true,
            subtree: true,
        })

        return () => {
            window.cancelAnimationFrame(frame)
            timeouts.forEach((timeout) => window.clearTimeout(timeout))
            observer.disconnect()
        }
    }, [enabled])
}

/**
 * Index grid video hover fix.
 *
 * Ensures helper-injected CMS thumbnail videos in the /index grid receive the
 * same hover/focus zoom as native IndexPage media, while respecting reduced motion.
 *
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function IndexGridVideoHoverFix({
    enabled = true,
    hoverScale = 1.02,
}: Partial<Props>) {
    useHiddenCMSLinkInerting(enabled)

    if (!enabled) return null

    const scale = Math.max(1, Number(hoverScale) || 1.02)

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
                .idx-grid-card-media > video,
                .idx-grid-card-media > img {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    border: 0;
                    transform: scale(1);
                    transform-origin: center center;
                    transition: transform 420ms cubic-bezier(.22, 1, .36, 1);
                    backface-visibility: hidden;
                    will-change: transform;
                }

                .idx-grid-card-media > video {
                    pointer-events: none;
                }

                @media (prefers-reduced-motion: no-preference) {
                    .idx-grid-card:hover .idx-grid-card-media > video,
                    .idx-grid-card:focus-visible .idx-grid-card-media > video,
                    .idx-grid-card:focus-within .idx-grid-card-media > video,
                    .idx-grid-card:hover .idx-grid-card-media > img,
                    .idx-grid-card:focus-visible .idx-grid-card-media > img,
                    .idx-grid-card:focus-within .idx-grid-card-media > img {
                        transform: scale(${scale}) !important;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .idx-grid-card-media > video,
                    .idx-grid-card-media > img,
                    .idx-grid-card:hover .idx-grid-card-media > video,
                    .idx-grid-card:focus-visible .idx-grid-card-media > video,
                    .idx-grid-card:focus-within .idx-grid-card-media > video,
                    .idx-grid-card:hover .idx-grid-card-media > img,
                    .idx-grid-card:focus-visible .idx-grid-card-media > img,
                    .idx-grid-card:focus-within .idx-grid-card-media > img {
                        transform: scale(1) !important;
                        transition: none !important;
                        will-change: auto !important;
                    }
                }
            `}</style>
        </div>
    )
}

addPropertyControls(IndexGridVideoHoverFix, {
    enabled: {
        type: ControlType.Boolean,
        title: "Enabled",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    hoverScale: {
        type: ControlType.Number,
        title: "Scale",
        defaultValue: 1.02,
        min: 1,
        max: 1.12,
        step: 0.005,
        hidden: ({ enabled }) => !enabled,
    },
})
