import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { useInView } from "framer-motion"
import { useEffect, useState, useRef, type CSSProperties } from "react"
// import { useDencrypt } from "use-dencrypt-effect"

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
    characters?: string
    interval?: number
    activators?: Partial<Activators>
    fontColor?: string
    font?: CSSProperties
    textSelect?: boolean
    style?: CSSProperties
}

export default function TextEncryptionEffect(props: TextEncryptionEffectProps) {
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const text = props.text || ""
    const activators: Activators = {
        ...defaultActivators,
        ...props.activators,
    }
    const activatorTrigger = String(activators.trigger)
    const characters = props.characters || "!#%^&*[]{}=+\\/|;:"
    const interval = Number(props.interval ?? 0.05)

    const ref = useRef(null)
    const isInView = useInView(ref, {
        once: !activators.replay,
        amount: "some",
    })

    const [value, setValue] = useDencrypt(
        activatorTrigger === "none" ? text : "",
        {
            chars: [...characters],
            interval: interval * 1000,
        }
    )

    function runAnimation() {
        if (!isCanvas) {
            setValue(text)
        }
    }

    useEffect(() => {
        if (activatorTrigger === "appear") {
            runAnimation()
        }
    }, [])

    useEffect(() => {
        if (!isCanvas && activatorTrigger === "layerInView") {
            if (isInView) {
                runAnimation()
            }
        }
    }, [isInView])

    return (
        <p
            ref={ref}
            data-mh-scramble-component="true"
            onClick={() => {
                if (activators.press) {
                    setValue(text)
                }
            }}
            onFocus={() => {
                if (activators.hover) {
                    setValue(text)
                }
            }}
            onMouseEnter={() => {
                if (activators.hover) {
                    setValue(text)
                }
            }}
            style={{
                margin: 0,
                color: props.fontColor || "#000",
                userSelect: props.textSelect ? "auto" : "none",
                ...props.font,
                ...props.style,
            }}
        >
            {isCanvas ? text : value}
        </p>
    )
}

TextEncryptionEffect.displayName = "Text Encryption Effect"

addPropertyControls(TextEncryptionEffect, {
    text: {
        defaultValue: "Encrypted Text",
        type: ControlType.String,
    },
    characters: {
        type: ControlType.String,
        defaultValue: "!#%^&*[]{}=+\\/|;:",
        description:
            "[Character Presets](https://next-acknowledge-092743.framer.app/components/text-encryption-effect)",
    },
    interval: {
        type: ControlType.Number,
        defaultValue: 0.05,
        step: 0.001,
        unit: "s",
        title: "Interval",
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

/*
 * use-dencrypt-effect by Roman Vesely on GitHub
 * https://github.com/crazko/use-dencrypt-effect
 *
 * Modified by Framestack.co to use support emojis and other multi-codepoint characters.
 */

export type DencryptInitialOptions = {
    initialValue?: string
    callback: (value: string) => void
}
export type DencryptDefaultOptions = Partial<typeof defaultOptions>

const defaultOptions = {
    chars: [..."-./^*!}<~$012345abcdef"],
    interval: 50,
}

const getRandomChar = (chars: Array<String>) =>
    chars[Math.floor(Math.random() * chars.length)]

const getChar = (
    i: number,
    j: number,
    maxLength: number,
    oldValue: string,
    newValue: string,
    chars: Array<String>
) => {
    if (j > i) {
        return oldValue[j]
    }

    if (i >= maxLength && j < i - maxLength) {
        return newValue[j]
    }

    return getRandomChar(chars)
}

export const dencrypt = (
    options: DencryptInitialOptions & DencryptDefaultOptions
) => {
    const { chars, interval, callback, initialValue } = {
        ...defaultOptions,
        ...options,
    }

    let lastValue: string
    let isCrypting: ReturnType<typeof setInterval>

    if (initialValue) {
        lastValue = initialValue
        callback(lastValue)
    }

    function* calculateValues(nextValue: string, prevValue = "") {
        const nextLength = nextValue.length
        const prevLength = prevValue.length
        const maxLength = Math.max(nextLength, prevLength)
        const iterations = 2 * maxLength

        let i = 0

        yield prevValue

        while (i < iterations) {
            yield [...new Array(maxLength)]
                .map((_, j) =>
                    getChar(i, j, maxLength, prevValue, nextValue, chars)
                )
                .join("")

            i++
        }

        yield nextValue
    }

    const setValue = (value: string) => {
        clearInterval(isCrypting)
        const values = calculateValues(value, lastValue)

        return new Promise<string>((resolve) => {
            isCrypting = setInterval(() => {
                var next = values.next()

                if (next.done) {
                    clearInterval(isCrypting)
                    resolve(lastValue)
                } else {
                    lastValue = next.value
                    callback(lastValue)
                }
            }, interval)
        })
    }

    return setValue
}

type DencryptReturnType = ReturnType<typeof dencrypt>
type UseDencryptReturnType = [string, DencryptReturnType]

export function useDencrypt(): UseDencryptReturnType
export function useDencrypt(
    initialValue: Required<DencryptInitialOptions["initialValue"]>
): UseDencryptReturnType
export function useDencrypt(
    options: DencryptDefaultOptions
): UseDencryptReturnType
export function useDencrypt(
    initialValue: Required<DencryptInitialOptions["initialValue"]>,
    options: DencryptDefaultOptions
): UseDencryptReturnType
export function useDencrypt(
    v?: string | DencryptDefaultOptions,
    o?: DencryptDefaultOptions
) {
    let initialValue = ""
    let options: DencryptDefaultOptions = {}

    if (typeof v === "object") {
        options = v
    } else if (typeof v === "string") {
        initialValue = v
        options = o ? o : {}
    }

    const [result, setResult] = useState<string>()
    const [setValue, setSetValue] = useState(() =>
        dencrypt({
            ...options,
            initialValue,
            callback: setResult,
        })
    )

    return [result, setValue]
}
