import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useInView } from "framer-motion"

type LineVariant = "Line Animation" | "Line Animation Active"
type TriggerMode = "Viewport Once" | "Variant"

type Props = {
    variant: LineVariant
    background: string
    trigger: TriggerMode
    style?: React.CSSProperties
}

const HIDDEN_VARIANT: LineVariant = "Line Animation"
const VISIBLE_VARIANT: LineVariant = "Line Animation Active"
const LINE_TRANSITION = {
    delay: 0.2,
    duration: 2,
    ease: [0.25, 1, 0.5, 1],
    type: "tween",
} as const
const DEFAULT_BACKGROUND =
    "var(--token-5561bb3f-a718-41fb-9058-813f188fd34f, rgb(55, 43, 41))"

/**
 * Border-rendered replacement for the native Line Animation component.
 *
 * @framerIntrinsicWidth 787
 * @framerIntrinsicHeight 1
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight fixed
 */
export default function LineAnimationBorder({
    variant = HIDDEN_VARIANT,
    background = DEFAULT_BACKGROUND,
    trigger = "Viewport Once",
    style,
}: Partial<Props>) {
    const ref = React.useRef<HTMLDivElement | null>(null)
    const isStatic = useIsStaticRenderer()
    const inView = useInView(ref, {
        amount: 0.5,
        once: trigger === "Viewport Once",
    })
    const isVariantActive = variant === VISIBLE_VARIANT
    const shouldDraw =
        trigger === "Variant" ? isVariantActive : isStatic || inView

    return (
        <div
            ref={ref}
            data-framer-name={shouldDraw ? VISIBLE_VARIANT : HIDDEN_VARIANT}
            style={{
                ...style,
                width: "100%",
                height: "100%",
                minHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                overflow: "hidden",
                padding: 0,
                background: "transparent",
            }}
        >
            <motion.div
                data-framer-name="Border Frame"
                initial={false}
                animate={{ width: shouldDraw ? "100%" : "0%" }}
                transition={LINE_TRANSITION}
                style={{
                    flex: "0 0 auto",
                    height: 0,
                    minWidth: 0,
                    borderBottom: `1px solid ${background}`,
                    boxSizing: "border-box",
                    background: "transparent",
                }}
            />
        </div>
    )
}

addPropertyControls(LineAnimationBorder, {
    variant: {
        type: ControlType.Enum,
        title: "Variant",
        options: [HIDDEN_VARIANT, VISIBLE_VARIANT],
        optionTitles: [HIDDEN_VARIANT, VISIBLE_VARIANT],
        defaultValue: HIDDEN_VARIANT,
    },
    background: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: DEFAULT_BACKGROUND,
    },
    trigger: {
        type: ControlType.Enum,
        title: "Trigger",
        options: ["Viewport Once", "Variant"],
        optionTitles: ["Viewport Once", "Variant"],
        defaultValue: "Viewport Once",
    },
})
