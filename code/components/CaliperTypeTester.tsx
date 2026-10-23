import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

const useBrowserLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

// Caliper Sans v1.003. Original metrics: 1000 UPM; OS/2 800 / 740 / 510 / -230.
// The small embedded webfont keeps the specimen independent of page font loading.
const FONT_DATA = "data:font/woff;base64,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"
const REGISTRATION_MARK = "data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGlkPSJXaW5kb3cgQ29udHJvbCI+CjxwYXRoIGlkPSJMaW5lIDEiIGQ9Ik0wIDEyLjVIMjQiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlPSIjRUVFRUVFIi8+CjxwYXRoIGlkPSJMaW5lIDIiIGQ9Ik0xMS41IDI0TDExLjUgMCIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2U9IiNFRUVFRUUiLz4KPC9nPgo8L3N2Zz4K"
const FONT_FAMILY = "Caliper Specimen 1003"
const DEMO_PHRASES = ["Type here", "Caliper Sans", "Hamburgefontsiv"]
const METRICS = { capHeight: 740, xHeight: 510, baseline: 0, descender: -230 }
// Figma Caliper editorial tokens, distinct from the surrounding portfolio chrome.
const COLORS = { blue: "#1C2440", white: "#EEEEEE" }

interface Props {
    initialText?: string
    maxSize?: number
    guides?: boolean
    background?: string
    foreground?: string
    outerBorder?: boolean
    style?: React.CSSProperties
}

const CSS = `
@font-face {
    font-family: "${FONT_FAMILY}";
    src: url("${FONT_DATA}") format("woff");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
    ascent-override: 97%;
    descent-override: 23%;
    line-gap-override: 0%;
}
.caliper-tester, .caliper-tester * { box-sizing: border-box; }
.caliper-tester {
    width: 100%; min-width: 0; padding: 20px;
    font: 400 12px/1.3 "${FONT_FAMILY}", sans-serif;
    font-synthesis: none; text-transform: none; letter-spacing: 0;
    container-type: inline-size;
}
.caliper-tester .caliper-sheet { border: 1px solid var(--caliper-rule); }
.caliper-tester .caliper-registration {
    display: flex; justify-content: space-between; padding: 24px 20px 16px;
}
.caliper-tester .caliper-mark {
    width: 24px; height: 24px; background: var(--caliper-rule);
    mask: var(--caliper-mark) center / contain no-repeat;
    -webkit-mask: var(--caliper-mark) center / contain no-repeat;
}
.caliper-tester .caliper-stage {
    position: relative; margin: 0 20px; border: 1px solid var(--caliper-rule);
    overflow: hidden; cursor: text;
}
.caliper-tester .caliper-stage[data-pointer-focus="false"]:focus-within { outline: 1px solid currentColor; outline-offset: 4px; }
.caliper-tester .caliper-input {
    position: absolute; display: block; margin: 0; padding: 0;
    border: 0; border-radius: 0; outline: none; box-shadow: none;
    background: transparent; color: inherit; caret-color: currentColor;
    font-family: inherit; font-weight: 400; font-style: normal; font-synthesis: none;
    line-height: 1.2; letter-spacing: 0; text-align: center;
    appearance: none; -webkit-appearance: none;
}
.caliper-tester .caliper-input::placeholder { color: inherit; opacity: .28; }
.caliper-tester ::selection {
    background: var(--caliper-ink); color: var(--caliper-bg); text-shadow: none;
}
.caliper-tester .caliper-guide {
    position: absolute; inset-inline: 0; border-top: 1px dashed var(--caliper-rule);
    pointer-events: none;
}
.caliper-tester .caliper-guide-value {
    position: absolute; bottom: 4px; white-space: nowrap;
    background: var(--caliper-bg); color: var(--caliper-rule);
}
.caliper-tester .caliper-sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@container (max-width: 440px) {
    .caliper-tester .caliper-registration { padding: 20px 12px 12px; }
    .caliper-tester .caliper-stage { margin-inline: 12px; }
}
`

/**
 * @framerIntrinsicWidth 1160
 * @framerIntrinsicHeight 560
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function CaliperTypeTester({
    initialText = "", maxSize = 320, guides = true,
    background = COLORS.blue,
    foreground = COLORS.white, outerBorder = false, style,
}: Props) {
    const id = React.useId()
    const input = React.useRef<HTMLInputElement>(null)
    const stage = React.useRef<HTMLDivElement>(null)
    const [text, setText] = React.useState(initialText)
    const [width, setWidth] = React.useState(1000)
    const [fontReady, setFontReady] = React.useState(false)
    const [fontFailed, setFontFailed] = React.useState(false)
    const [textWidth, setTextWidth] = React.useState(600)
    const [composing, setComposing] = React.useState(false)
    const [pointerFocus, setPointerFocus] = React.useState(false)
    const [interacted, setInteracted] = React.useState(false)
    const [inView, setInView] = React.useState(false)
    const [reducedMotion, setReducedMotion] = React.useState(true)
    const [demo, setDemo] = React.useState({ phrase: DEMO_PHRASES[0], text: "" })
    const measureCanvas = React.useRef<HTMLCanvasElement | null>(null)
    const demoActive = !interacted && !text && !reducedMotion && inView && fontReady
    const placeholder = demoActive ? (demo.text || " ") : "Type here"
    // Measure the complete demo phrase so its size stays steady while letters appear.
    const measuredText = text || (demoActive ? demo.phrase : "Type here")

    React.useEffect(() => { setText(initialText) }, [initialText])
    React.useEffect(() => {
        const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
        const update = () => setReducedMotion(preference.matches)
        update()
        preference.addEventListener("change", update)
        return () => preference.removeEventListener("change", update)
    }, [])
    React.useEffect(() => {
        if (!demoActive) return
        let phraseIndex = 0
        let count = 0
        let deleting = false
        let timer: ReturnType<typeof setTimeout>
        const tick = () => {
            const phrase = DEMO_PHRASES[phraseIndex]
            count += deleting ? -1 : 1
            setDemo({ phrase, text: phrase.slice(0, count) })
            let delay = deleting ? 55 : 125
            if (count === phrase.length) { deleting = true; delay = 1600 }
            else if (count === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % DEMO_PHRASES.length; delay = 450 }
            timer = setTimeout(tick, delay)
        }
        setDemo({ phrase: DEMO_PHRASES[0], text: "" })
        timer = setTimeout(tick, 350)
        return () => clearTimeout(timer)
    }, [demoActive])
    React.useEffect(() => {
        let cancelled = false
        document.fonts.load(`400 100px "${FONT_FAMILY}"`).then((faces) => {
            if (!cancelled) { setFontReady(faces.length > 0); setFontFailed(faces.length === 0) }
        }).catch(() => { if (!cancelled) setFontFailed(true) })
        return () => { cancelled = true }
    }, [])
    React.useEffect(() => {
        const el = stage.current
        if (!el) return
        const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
        observer.observe(el)
        const visibility = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .1 })
        visibility.observe(el)
        setWidth(el.clientWidth)
        return () => { observer.disconnect(); visibility.disconnect() }
    }, [])
    // Commit the fitted size before paint, avoiding a frame at the previous text width.
    useBrowserLayoutEffect(() => {
        if (!fontReady || composing) return
        measureCanvas.current ??= document.createElement("canvas")
        const context = measureCanvas.current.getContext("2d")
        if (!context) return
        context.font = `400 100px "${FONT_FAMILY}"`
        const metrics = context.measureText(measuredText)
        setTextWidth(Math.max(metrics.width, metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight, 1))
    }, [measuredText, fontReady, composing])

    const stageHeight = Math.max(300, Math.min(480, width * .4))
    const compact = width < 700
    const gutter = guides ? (compact ? 40 : 56) : (compact ? 16 : 24)
    const baseline = stageHeight * .72
    const heightLimit = (stageHeight - 106) / 1.2
    const size = Math.floor(Math.max(20, Math.min(maxSize, heightLimit, (width - gutter * 2 - 4) / textWidth * 100)))
    // 12px labels have a 15.6px line box; remove them before the closest lines meet.
    const numbersVisible = .23 * size >= 18
    const cssVariables = {
        ...style,
        background, color: foreground,
        border: `1px solid ${outerBorder ? "var(--caliper-rule)" : "transparent"}`,
        "--caliper-bg": background,
        "--caliper-ink": foreground,
        "--caliper-rule": `color-mix(in srgb, ${foreground} 40%, ${background})`,
        "--caliper-mark": `url("${REGISTRATION_MARK}")`,
    } as React.CSSProperties
    const marks = <div className="caliper-registration" aria-hidden="true"><span className="caliper-mark" /><span className="caliper-mark" /></div>

    return (
        <section className="caliper-tester" style={cssVariables} aria-label="Caliper Sans interactive type specimen" data-mh-pretty-ignore="true">
            <style>{CSS}</style>
            <div className="caliper-sheet">
                {marks}
                <div ref={stage} className="caliper-stage" style={{ height: stageHeight }}
                    data-pointer-focus={pointerFocus}
                    onPointerDownCapture={() => { setPointerFocus(true); setInteracted(true) }}
                    onBlur={() => setPointerFocus(false)}
                    onClick={(event) => { setPointerFocus(true); if (event.target !== input.current) input.current?.focus() }}>
                    {guides && fontReady && Object.entries(METRICS).map(([key, units]) => (
                        <div key={key} className="caliper-guide" data-metric={key} style={{ top: baseline - units / 1000 * size }} aria-hidden="true">
                            {numbersVisible && <>
                                <span className="caliper-guide-value" data-side="left" style={{ left: 8 }}>{units}</span>
                                <span className="caliper-guide-value" data-side="right" style={{ right: 8 }}>{units}</span>
                            </>}
                        </div>
                    ))}
                    <label className="caliper-sr-only" htmlFor={`${id}-text`}>Type your own text in Caliper Sans</label>
                    <input ref={input} id={`${id}-text`} className="caliper-input" type="text" value={text} placeholder={placeholder}
                        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} maxLength={160}
                        aria-busy={!fontReady && !fontFailed}
                        style={{ top: baseline - .97 * size, left: gutter, width: `calc(100% - ${gutter * 2}px)`, height: 1.2 * size, fontSize: size, opacity: fontReady ? 1 : 0 }}
                        onFocus={() => setInteracted(true)}
                        onChange={event => { setInteracted(true); setText(event.target.value) }}
                        onCompositionStart={() => setComposing(true)} onCompositionEnd={event => { setComposing(false); setText(event.currentTarget.value) }}
                    />
                    {!fontReady && <div role="status" style={{ position: "absolute", inset: "46% 20px auto", textAlign: "center" }}>{fontFailed ? "The font could not load. Please refresh to try again." : "Loading Caliper Sans…"}</div>}
                </div>
                {marks}
            </div>
        </section>
    )
}

addPropertyControls(CaliperTypeTester, {
    initialText: { type: ControlType.String, title: "Starting Text", defaultValue: "" },
    maxSize: { type: ControlType.Number, title: "Max Type Size", defaultValue: 320, min: 24, max: 400, step: 1, unit: "px" },
    guides: { type: ControlType.Boolean, title: "Guides", defaultValue: true },
    background: { type: ControlType.Color, title: "Paper", defaultValue: COLORS.blue },
    foreground: { type: ControlType.Color, title: "Ink", defaultValue: COLORS.white },
    outerBorder: { type: ControlType.Boolean, title: "Outer Border", defaultValue: false },
})
