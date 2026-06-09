import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

type Props = {
    enabled: boolean
}

const EDITOR_LABEL_ID = "__framer-editorbar-label"
const HIDDEN_ATTR = "data-public-editor-control-hidden"
const SCAN_DELAYS = [0, 100, 350, 900, 1800, 3200]

function shouldRunOnCurrentTarget(): boolean {
    const target = RenderTarget.current()
    return target !== RenderTarget.canvas && target !== RenderTarget.thumbnail
}

function isLikelyEditorControl(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect()
    const style = window.getComputedStyle(element)
    const text = (element.textContent || "").trim().toLowerCase()
    const labelledBy = element.getAttribute("aria-labelledby") || ""

    const isFixedOverlay =
        style.position === "fixed" ||
        style.position === "sticky" ||
        Number.parseInt(style.zIndex || "0", 10) >= 100
    const isCompact = rect.width <= 180 && rect.height <= 90
    const namesEditorLabel = labelledBy
        .split(/\s+/)
        .includes(EDITOR_LABEL_ID)

    return isCompact && isFixedOverlay && (text.includes("edit content") || namesEditorLabel)
}

function hideEditorControl(): number {
    if (typeof document === "undefined" || typeof window === "undefined") return 0

    const label = document.getElementById(EDITOR_LABEL_ID)
    if (!label) return 0

    const candidates: HTMLElement[] = []
    let node: HTMLElement | null = label
    for (let depth = 0; node && depth < 8; depth += 1) {
        candidates.push(node)
        node = node.parentElement
    }

    const control =
        candidates.find(isLikelyEditorControl) ||
        label.closest<HTMLElement>(`[aria-labelledby~="${EDITOR_LABEL_ID}"]`) ||
        label.parentElement ||
        label

    ;[control, label].forEach((element) => {
        element.setAttribute(HIDDEN_ATTR, "true")
        element.setAttribute("aria-hidden", "true")
        element.setAttribute("inert", "")
        element.style.setProperty("display", "none", "important")
        element.style.setProperty("visibility", "hidden", "important")
        element.style.setProperty("pointer-events", "none", "important")
    })

    return 1
}

function usePublicEditorControlGuard(enabled: boolean) {
    React.useEffect(() => {
        if (!enabled || !shouldRunOnCurrentTarget()) return
        if (typeof document === "undefined" || typeof window === "undefined") return

        let frame = 0
        const timeouts: number[] = []

        const run = () => {
            window.cancelAnimationFrame(frame)
            frame = window.requestAnimationFrame(hideEditorControl)
        }

        SCAN_DELAYS.forEach((delay) => {
            if (delay === 0) run()
            else timeouts.push(window.setTimeout(run, delay))
        })

        const observer = new MutationObserver(run)
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["id", "aria-labelledby", "style", "class"],
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
 * Hides Framer's public editorbar control from published/preview pages.
 *
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function PublicEditorControlGuard({
    enabled = true,
}: Partial<Props>) {
    usePublicEditorControlGuard(enabled)

    if (!enabled || !shouldRunOnCurrentTarget()) return null

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
                #${EDITOR_LABEL_ID},
                #${EDITOR_LABEL_ID} *,
                [${HIDDEN_ATTR}="true"],
                [aria-labelledby~="${EDITOR_LABEL_ID}"],
                :where(button, a, div, aside, section):has(> #${EDITOR_LABEL_ID}) {
                    display: none !important;
                    visibility: hidden !important;
                    pointer-events: none !important;
                }
            `}</style>
        </div>
    )
}

addPropertyControls(PublicEditorControlGuard, {
    enabled: {
        type: ControlType.Boolean,
        title: "Enabled",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
})
