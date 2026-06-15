import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Props = {
    arrowColor: string
}

const DEFAULT_ARROW_COLOR = "#FFFFFF"

/**
 * Page-scoped color correction for the /info hero Scroll More arrow.
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
