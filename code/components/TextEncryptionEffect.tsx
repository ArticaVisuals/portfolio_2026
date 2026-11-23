import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { useEffect, useRef, type CSSProperties } from "react"

type ActivatorTrigger = "none" | "appear" | "layerInView"
type Activators = {
    hover: boolean
    press: boolean
    trigger: ActivatorTrigger
    replay: boolean
}

const defaultActivators: Activators = {
    hover: true,
    press: false,
    trigger: "none",
    replay: true,
}

type TextEncryptionEffectProps = {
    text?: string
    activators?: Partial<Activators>
    fontColor?: string
    font?: CSSProperties
    textSelect?: boolean
    style?: CSSProperties
}

const flipDuration = 420
const flipEase = "cubic-bezier(0.16, 1, 0.3, 1)"
const flipStyles = `
    .mh-flip-window, .mh-flip-track { display: block; }
    .mh-flip-window { overflow: hidden; }
    .mh-flip-track { position: relative; }
    .mh-flip-copy {
        position: absolute;
        inset: 100% 0 auto;
        user-select: none;
        pointer-events: none;
    }
    @media (prefers-reduced-motion: no-preference) {
        .mh-flip-track { transition: transform ${flipDuration}ms ${flipEase}; }
        a:focus-visible [data-mh-flip-hover] .mh-flip-track,
        [data-mh-flip-hover]:focus-visible .mh-flip-track {
            transform: translateY(-100%);
        }
        @media (hover: hover) {
            a:hover [data-mh-flip-hover] .mh-flip-track,
            [data-mh-flip-hover]:hover .mh-flip-track {
                transform: translateY(-100%);
            }
        }
    }
`

function playFlip(track: HTMLSpanElement | null) {
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    return track.animate(
        [{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }],
        { duration: flipDuration, easing: flipEase }
    )
}

export default function TextEncryptionEffect(props: TextEncryptionEffectProps) {
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const { hover, press, trigger, replay } = { ...defaultActivators, ...props.activators }
    const track = useRef<HTMLSpanElement>(null)
    const text = props.text ?? ""

    useEffect(() => {
        const element = track.current
        if (isCanvas || !element || trigger === "none") return
        if (trigger === "appear") {
            const animation = playFlip(element)
            return () => animation?.cancel()
        }
        // Observe the stationary mask while the label moves through it.
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return
            playFlip(element)
            if (!replay) observer.disconnect()
        })
        observer.observe(element.parentElement!)
        return () => observer.disconnect()
    }, [isCanvas, trigger, replay])

    return (
        <p
            data-mh-flip-hover={hover && !isCanvas ? "" : undefined}
            onClick={press && !isCanvas ? () => playFlip(track.current) : undefined}
            style={{
                margin: 0,
                color: props.fontColor || "#000",
                userSelect: props.textSelect ? "auto" : "none",
                ...props.font,
                ...props.style,
            }}
        >
            <style>{flipStyles}</style>
            <span className="mh-flip-window">
                <span className="mh-flip-track" ref={track}>
                    {text}
                    <span className="mh-flip-copy" aria-hidden="true">{text}</span>
                </span>
            </span>
        </p>
    )
}

TextEncryptionEffect.displayName = "Text Flip Up"

addPropertyControls(TextEncryptionEffect, {
    text: {
        defaultValue: "Link",
        type: ControlType.String,
    },
    activators: {
        type: ControlType.Object,
        buttonTitle: "Options",
        controls: {
            hover: {
                type: ControlType.Boolean,
                defaultValue: true,
            },
            press: {
                type: ControlType.Boolean,
                defaultValue: false,
            },
            trigger: {
                type: ControlType.Enum,
                defaultValue: "none",
                options: ["none", "appear", "layerInView"],
                optionTitles: ["None", "Appear", "Layer In View"],
                displaySegmentedControl: true,
                segmentedControlDirection: "vertical",
            },
            replay: {
                type: ControlType.Boolean,
                defaultValue: true,
                hidden: (props: { trigger?: string }) =>
                    props.trigger !== "layerInView",
            },
        },
    },
    fontColor: {
        type: ControlType.Color,
        defaultValue: "#000",
    },
    font: {
        type: "font" as any,
        controls: "extended",
    },
    textSelect: {
        type: ControlType.Boolean,
        defaultValue: true,
    },
})
