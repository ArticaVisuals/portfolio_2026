import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

type Props = {
    enabled?: boolean
    selector?: string
    topThreshold?: number
    style?: React.CSSProperties
}

const DEFAULT_SELECTOR =
    'nav[data-framer-name="Navigation"], nav[name="Navigation"], [data-framer-name="Navigation"], [name="Navigation"]'
const ROOT_CLASS = "mh-nav-at-page-top"
const STYLE_ID = "mh-navigation-scroll-guard-style"
const INFO_ROUTE = "/info"

function canUseDOM() {
    return typeof window !== "undefined" && typeof document !== "undefined"
}

function scopedSelector(selector: string) {
    return selector
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => `html.${ROOT_CLASS} body:not(.playground-nav-exit-hidden) ${part}`)
}

function ensureStyle(selector: string) {
    const scoped = scopedSelector(selector)
    if (!scoped.length) return

    let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null
    if (!style) {
        style = document.createElement("style")
        style.id = STYLE_ID
        document.head.appendChild(style)
    }

    style.textContent = `
${scoped.join(",\n")} {
    transform: translate3d(0, 0, 0) !important;
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: auto !important;
}

${scoped
    .map(
        (part) =>
            `${part} :where(a, button, [href], [role="link"], [role="button"], [tabindex])`
    )
    .join(",\n")} {
    pointer-events: auto !important;
}
`
}

function labelText(element: Element) {
    return (element.textContent || "").replace(/\s+/g, "").toUpperCase()
}

function isInfoLink(anchor: HTMLAnchorElement) {
    return /^(INFO)+$/.test(labelText(anchor))
}

function normalizeInfoLinks(selector: string) {
    document.querySelectorAll(selector).forEach((root) => {
        root.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((anchor) => {
            if (!isInfoLink(anchor)) return
            if (anchor.getAttribute("href") === INFO_ROUTE) return

            anchor.setAttribute("href", INFO_ROUTE)
        })
    })
}

/**
 * Navigation Scroll Guard
 *
 * Keeps the native Framer navigation hit-testable when its scroll-hide
 * transform gets stranded after returning to the top of the page.
 *
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function NavigationScrollGuard({
    enabled = true,
    selector = DEFAULT_SELECTOR,
    topThreshold = 4,
    style,
}: Props) {
    React.useEffect(() => {
        if (!enabled || !canUseDOM()) return
        if (RenderTarget.current() === RenderTarget.canvas) return

        ensureStyle(selector)
        normalizeInfoLinks(selector)

        let frame = 0
        let linkFrame = 0
        const update = () => {
            frame = 0
            const scrollY =
                window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
            document.documentElement.classList.toggle(
                ROOT_CLASS,
                scrollY <= Math.max(0, topThreshold)
            )
        }
        const schedule = () => {
            if (!frame) frame = window.requestAnimationFrame(update)
        }
        const scheduleLinkNormalize = () => {
            if (!linkFrame) {
                linkFrame = window.requestAnimationFrame(() => {
                    linkFrame = 0
                    normalizeInfoLinks(selector)
                })
            }
        }

        const observer =
            typeof MutationObserver !== "undefined"
                ? new MutationObserver(scheduleLinkNormalize)
                : null
        observer?.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["href"],
        })

        update()
        window.addEventListener("scroll", schedule, { passive: true })
        window.addEventListener("resize", schedule)
        window.addEventListener("pageshow", schedule)
        window.addEventListener("popstate", schedule)
        window.addEventListener("pageshow", scheduleLinkNormalize)
        window.addEventListener("popstate", scheduleLinkNormalize)

        return () => {
            window.cancelAnimationFrame(frame)
            window.cancelAnimationFrame(linkFrame)
            observer?.disconnect()
            window.removeEventListener("scroll", schedule)
            window.removeEventListener("resize", schedule)
            window.removeEventListener("pageshow", schedule)
            window.removeEventListener("popstate", schedule)
            window.removeEventListener("pageshow", scheduleLinkNormalize)
            window.removeEventListener("popstate", scheduleLinkNormalize)
            document.documentElement.classList.remove(ROOT_CLASS)

            const style = document.getElementById(STYLE_ID)
            if (style?.parentNode) style.parentNode.removeChild(style)
        }
    }, [enabled, selector, topThreshold])

    return (
        <div
            aria-hidden="true"
            style={{
                ...style,
                width: 1,
                height: 1,
                opacity: 0,
                pointerEvents: "none",
            }}
        />
    )
}

addPropertyControls<Partial<Props>>(NavigationScrollGuard, {
    enabled: {
        type: ControlType.Boolean,
        title: "Enabled",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    selector: {
        type: ControlType.String,
        title: "Selector",
        defaultValue: DEFAULT_SELECTOR,
    },
    topThreshold: {
        type: ControlType.Number,
        title: "Top",
        defaultValue: 4,
        min: 0,
        max: 64,
        step: 1,
        unit: "px",
    },
})

NavigationScrollGuard.displayName = "Navigation Scroll Guard"
