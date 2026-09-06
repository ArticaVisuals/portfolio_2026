import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Props = {
    arrowColor: string
}

const DEFAULT_ARROW_COLOR = "#FFFFFF"
const RECOGNITION_HEADING = "/ RECOGNITION"
const RECOGNITION_MULTI_ROW_ATTRIBUTE =
    "data-info-recognition-multi-row"

function normalizedText(element: Element) {
    return (element.textContent || "").replace(/\s+/g, " ").trim()
}

function markRecognitionMultiRows() {
    if (typeof document === "undefined") return
    if (!/^\/info\/?$/.test(window.location.pathname)) return

    const heading = Array.from(document.querySelectorAll("p")).find(
        (element) => normalizedText(element) === RECOGNITION_HEADING
    )
    const section = heading?.parentElement?.parentElement
    const rows = section?.lastElementChild
    if (!(rows instanceof HTMLElement)) return

    document
        .querySelectorAll(`[${RECOGNITION_MULTI_ROW_ATTRIBUTE}]`)
        .forEach((element) =>
            element.removeAttribute(RECOGNITION_MULTI_ROW_ATTRIBUTE)
        )

    Array.from(rows.children).forEach((wrapper) => {
        const multiRow = Array.from(wrapper.children).find((element) => {
            if (!(element instanceof HTMLElement)) return false

            const style = window.getComputedStyle(element)
            return (
                style.display === "flex" &&
                style.flexDirection === "row" &&
                element.children.length === 2
            )
        })

        multiRow?.setAttribute(RECOGNITION_MULTI_ROW_ATTRIBUTE, "true")
    })
}

/**
 * Page-scoped /info fixes for the hero Scroll More arrow and tablet
 * Recognition column alignment.
 *
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function InfoScrollMoreColorOverride({
    arrowColor = DEFAULT_ARROW_COLOR,
}: Partial<Props>) {
    React.useEffect(() => {
        let frame = 0
        const scheduleScan = () => {
            window.cancelAnimationFrame(frame)
            frame = window.requestAnimationFrame(markRecognitionMultiRows)
        }

        scheduleScan()

        const observer = new MutationObserver(scheduleScan)
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        })
        window.addEventListener("resize", scheduleScan)

        return () => {
            window.cancelAnimationFrame(frame)
            observer.disconnect()
            window.removeEventListener("resize", scheduleScan)
        }
    }, [])

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
            <style suppressHydrationWarning>{`
                html body [data-framer-name="SectionHeading"] [data-framer-name="HeaderBottom"] [data-framer-name="ArrowWrapper"],
                html body [data-framer-name="SectionHeading"] [data-framer-name="HeaderBottom"] [data-framer-name="ArrowWrapper"] * {
                    color: ${arrowColor} !important;
                    -webkit-text-fill-color: ${arrowColor} !important;
                    fill: ${arrowColor} !important;
                }

                @media (min-width: 810px) and (max-width: 1199.98px) {
                    html body [${RECOGNITION_MULTI_ROW_ATTRIBUTE}="true"] {
                        display: grid !important;
                        grid-template-columns: calc(44.444444% - 7.111111px) minmax(0, 1fr) !important;
                        column-gap: 8px !important;
                        align-items: start !important;
                    }

                    html body [${RECOGNITION_MULTI_ROW_ATTRIBUTE}="true"] > * {
                        width: 100% !important;
                        min-width: 0 !important;
                    }
                }
            `}</style>
        </div>
    )
}

addPropertyControls(InfoScrollMoreColorOverride, {
    arrowColor: {
        type: ControlType.Color,
        title: "Arrow",
        defaultValue: DEFAULT_ARROW_COLOR,
    },
})
