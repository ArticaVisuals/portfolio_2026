import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Props = {
    enabled: boolean
    imageScale: number
    duration: number
    targetCardNames: string
    mediaFrameNames: string
}

const CARD_ATTR = "data-related-project-hover-card"
const FRAME_ATTR = "data-related-project-hover-frame"
const MEDIA_ATTR = "data-related-project-hover-media"
const OWNER_ATTR = "data-related-project-hover-owner"
const DEFAULT_TARGET_CARD_NAMES = "OtherProjectCard\nOther Project Card"
const DEFAULT_MEDIA_FRAME_NAMES = "ImageWrapper\nImage Wrapper"
const DEFAULT_IMAGE_SCALE = 1.02
const DEFAULT_DURATION = 420
const EASING = "cubic-bezier(.22, 1, .36, 1)"

function splitNames(value: string): string[] {
    return String(value || "")
        .split(/[\n,]/)
        .map((name) => name.trim())
        .filter(Boolean)
}

function escapeAttr(value: string): string {
    return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
}

function nameSelector(name: string) {
    const value = escapeAttr(name)
    return `:is([data-framer-name="${value}"], [name="${value}"])`
}

function selectorsFromNames(value: string): string {
    return splitNames(value).map(nameSelector).join(",")
}

function getScopeSelector(): string {
    return `${nameSelector("NextProjectWrapper")}, ${nameSelector("Next Project Wrapper")}`
}

function getScopes(root: HTMLElement): HTMLElement[] {
    const closestScope = root.closest<HTMLElement>(getScopeSelector())
    if (closestScope) return [closestScope]

    const pageScopes = Array.from(document.querySelectorAll<HTMLElement>(getScopeSelector()))
    return pageScopes.length > 0 ? pageScopes : [document.body]
}

function clearScope(scope: ParentNode, owner: string) {
    scope.querySelectorAll<HTMLElement>(`[${OWNER_ATTR}="${owner}"]`).forEach((element) => {
        element.removeAttribute(OWNER_ATTR)
        element.removeAttribute(CARD_ATTR)
        element.removeAttribute(FRAME_ATTR)
        element.removeAttribute(MEDIA_ATTR)
    })
}

function isGeneratedOverlay(element: HTMLElement): boolean {
    return element.hasAttribute("data-framer-cms-thumbnail-stroke-overlay")
}

function applyHoverZoom(root: HTMLElement, owner: string, targetCardNames: string, mediaFrameNames: string) {
    const cardSelector = selectorsFromNames(targetCardNames)
    const frameSelector = selectorsFromNames(mediaFrameNames)
    if (!cardSelector || !frameSelector) return

    const scopes = getScopes(root)
    scopes.forEach((scope) => clearScope(scope, owner))

    scopes.forEach((scope) => {
        scope.querySelectorAll<HTMLElement>(cardSelector).forEach((card) => {
            const frame = card.querySelector<HTMLElement>(frameSelector)
            if (!frame) return

            card.setAttribute(CARD_ATTR, "true")
            card.setAttribute(OWNER_ATTR, owner)
            frame.setAttribute(FRAME_ATTR, "true")
            frame.setAttribute(OWNER_ATTR, owner)

            frame
                .querySelectorAll<HTMLElement>(
                    [
                        "img",
                        "video",
                        "[data-framer-background-image-wrapper=\"true\"]",
                        "[style*=\"background-image\"]",
                        nameSelector("Image"),
                        nameSelector("Video"),
                    ].join(",")
                )
                .forEach((media) => {
                    if (media === frame || isGeneratedOverlay(media)) return
                    media.setAttribute(MEDIA_ATTR, "true")
                    media.setAttribute(OWNER_ATTR, owner)
                })
        })
    })
}

/**
 * Scoped hover zoom for bottom related-project cards.
 *
 * Mount this invisible helper on a case-study page. It scans only
 * NextProjectWrapper sections, then scales media inside Other Project Card
 * thumbnails.
 *
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function RelatedProjectHoverZoom({
    enabled = true,
    imageScale = DEFAULT_IMAGE_SCALE,
    duration = DEFAULT_DURATION,
    targetCardNames = DEFAULT_TARGET_CARD_NAMES,
    mediaFrameNames = DEFAULT_MEDIA_FRAME_NAMES,
}: Partial<Props>) {
    const rootRef = React.useRef<HTMLDivElement>(null)
    const owner = React.useId().replace(/[^a-zA-Z0-9_-]/g, "")
    const scale = Math.max(1, Number(imageScale) || 1)
    const transitionDuration = Math.max(0, Number(duration) || 0)
    const shouldApply = enabled && scale > 1

    React.useEffect(() => {
        const root = rootRef.current
        if (!root || typeof window === "undefined") return

        if (!shouldApply) {
            getScopes(root).forEach((scope) => clearScope(scope, owner))
            return
        }

        let disposed = false
        let frame = 0

        const scheduleApply = () => {
            window.cancelAnimationFrame(frame)
            frame = window.requestAnimationFrame(() => {
                if (!disposed) applyHoverZoom(root, owner, targetCardNames, mediaFrameNames)
            })
        }

        scheduleApply()
        const timeoutIds = [100, 350, 900, 1800, 3200].map((delay) =>
            window.setTimeout(scheduleApply, delay)
        )

        const observer = new MutationObserver(scheduleApply)
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["class", "data-framer-name", "name", "style"],
        })
        window.addEventListener("resize", scheduleApply, { passive: true })

        return () => {
            disposed = true
            window.cancelAnimationFrame(frame)
            timeoutIds.forEach((id) => window.clearTimeout(id))
            observer.disconnect()
            window.removeEventListener("resize", scheduleApply)
            getScopes(root).forEach((scope) => clearScope(scope, owner))
        }
    }, [shouldApply, owner, targetCardNames, mediaFrameNames])

    return (
        <div
            ref={rootRef}
            aria-hidden="true"
            style={{
                width: 0,
                height: 0,
                overflow: "hidden",
                pointerEvents: "none",
            }}
        >
            <style>{`
                [${FRAME_ATTR}="true"] {
                    border: 0 !important;
                    box-shadow: none !important;
                    overflow: hidden !important;
                    clip-path: inset(0);
                    contain: paint;
                    isolation: isolate;
                }

                [${FRAME_ATTR}="true"] > * {
                    border: 0 !important;
                    box-shadow: none !important;
                }

                [${MEDIA_ATTR}="true"] {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: contain !important;
                    object-position: center center !important;
                    background-size: contain !important;
                    background-position: center center !important;
                    background-repeat: no-repeat !important;
                    scale: 1 !important;
                    transform-origin: center center !important;
                    transition: scale ${transitionDuration}ms ${EASING} !important;
                    backface-visibility: hidden !important;
                    will-change: scale !important;
                }

                [${CARD_ATTR}="true"]:hover [${MEDIA_ATTR}="true"],
                [${CARD_ATTR}="true"]:focus-visible [${MEDIA_ATTR}="true"],
                [${CARD_ATTR}="true"]:focus-within [${MEDIA_ATTR}="true"] {
                    scale: ${scale} !important;
                }

                @media (prefers-reduced-motion: reduce) {
                    [${MEDIA_ATTR}="true"] {
                        scale: 1 !important;
                        transition: none !important;
                        will-change: auto !important;
                    }
                }
            `}</style>
        </div>
    )
}

addPropertyControls(RelatedProjectHoverZoom, {
    enabled: {
        type: ControlType.Boolean,
        title: "Enabled",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    imageScale: {
        type: ControlType.Number,
        title: "Scale",
        defaultValue: DEFAULT_IMAGE_SCALE,
        min: 1,
        max: 1.12,
        step: 0.005,
        hidden: ({ enabled }) => !enabled,
    },
    duration: {
        type: ControlType.Number,
        title: "Duration",
        defaultValue: DEFAULT_DURATION,
        min: 0,
        max: 1200,
        step: 20,
        unit: "ms",
        hidden: ({ enabled }) => !enabled,
    },
    targetCardNames: {
        type: ControlType.String,
        title: "Cards",
        defaultValue: DEFAULT_TARGET_CARD_NAMES,
        displayTextArea: true,
    },
    mediaFrameNames: {
        type: ControlType.String,
        title: "Media",
        defaultValue: DEFAULT_MEDIA_FRAME_NAMES,
        displayTextArea: true,
    },
})
