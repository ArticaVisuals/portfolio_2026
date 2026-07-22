// @ts-nocheck
import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

const STYLE_ID = "mh-paragraph-pretty-wrap-style"
const ATTR = "data-mh-paragraph-pretty"
const IGNORE_ATTR = "data-mh-pretty-ignore"
const GLOBAL_KEY = "__mhParagraphPrettyWrap"
const PRELOAD_KEY = "__mhParagraphPrettyWrapPreload"
const DEFAULT_EXCLUDE_SELECTOR = [
    "header",
    "nav",
    "footer",
    "a[href]",
    "[role='link']",
    "button",
    "input",
    "textarea",
    "select",
    "option",
    "script",
    "style",
    "noscript",
    "svg",
    "canvas",
    `[${IGNORE_ATTR}]`,
    "[contenteditable='true']",
].join(", ")
const SCAN_DELAYS = [0, 80, 240, 700, 1600]
const TEXT_SELECTOR = "p, span, div, li, figcaption, blockquote"
const usePrePaintEffect =
    typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

function cssText(attributeName: string) {
    return `@supports (text-wrap: pretty) {
[${attributeName}="true"] {
    text-wrap: pretty !important;
    text-wrap-style: pretty !important;
}
}`
}

function preloadScript(maxFontSize: number, minWords: number) {
    const resolvedMaxFontSize = Math.max(maxFontSize, 23)
    const resolvedMinWords = Math.max(minWords, 1)

    return `(function(){try{var KEY=${JSON.stringify(PRELOAD_KEY)};var ATTR=${JSON.stringify(ATTR)};var IGNORE=${JSON.stringify(IGNORE_ATTR)};var STYLE_ID=${JSON.stringify(STYLE_ID)};var SELECTOR=${JSON.stringify(TEXT_SELECTOR)};var EXCLUDE=${JSON.stringify(DEFAULT_EXCLUDE_SELECTOR)};var MAX=${resolvedMaxFontSize};var MIN=${resolvedMinWords};var existing=window[KEY];if(existing){existing.max=Math.max(existing.max||0,MAX);existing.min=Math.min(existing.min||MIN,MIN);if(existing.run)existing.run(document.body||document.documentElement);return;}function normalize(value){return String(value||"").replace(/\\s+/g," ").trim()}function parsePx(value){var parsed=parseFloat(value);return isFinite(parsed)?parsed:0}function hasOwnText(el){for(var i=0;i<el.childNodes.length;i++){var node=el.childNodes[i];if(node.nodeType===3&&normalize(node.textContent))return true}return el.matches&&el.matches("p, span")}function hasBlockChild(el){for(var i=0;i<el.children.length;i++){var child=el.children[i];if(child instanceof HTMLElement&&/^(block|flex|grid|table|list-item)/.test(getComputedStyle(child).display))return true}return false}function candidate(el,state){if(!(el instanceof HTMLElement))return false;if(el.dataset&&el.dataset.mhPrettyIgnore==="true")return false;if(EXCLUDE&&el.closest&&el.closest(EXCLUDE))return false;var text=normalize(el.textContent);if(!text||text.split(/\\s+/).length<(state.min||MIN))return false;if(!hasOwnText(el)||hasBlockChild(el))return false;var style=getComputedStyle(el);if(style.display==="none"||style.visibility==="hidden")return false;if(style.whiteSpace.indexOf("nowrap")>-1||style.whiteSpace==="pre")return false;var fontSize=parsePx(style.fontSize);return fontSize>0&&fontSize<=(state.max||MAX)}function ensureStyle(){var parent=document.head||document.documentElement;var style=document.getElementById(STYLE_ID);if(!style&&parent){style=document.createElement("style");style.id=STYLE_ID;parent.appendChild(style)}if(style){var css='@supports (text-wrap: pretty) {[${ATTR}="true"]{text-wrap: pretty !important;text-wrap-style: pretty !important;}}';if(style.textContent!==css)style.textContent=css}}function scan(root){var state=window[KEY];if(!state)return;ensureStyle();var base=root&&root.nodeType===1?root:(document.body||document.documentElement);if(!base)return;var nodes=[];if(base.matches&&base.matches(SELECTOR))nodes.push(base);if(base.querySelectorAll)nodes=nodes.concat(Array.prototype.slice.call(base.querySelectorAll(SELECTOR)));for(var i=0;i<nodes.length;i++){var el=nodes[i];try{if(candidate(el,state))el.setAttribute(ATTR,"true");else if(el.getAttribute(ATTR)==="true")el.removeAttribute(ATTR)}catch(e){}}}var state=window[KEY]={max:MAX,min:MIN,run:scan};ensureStyle();scan(document.body||document.documentElement);var observer=new MutationObserver(function(mutations){for(var i=0;i<mutations.length;i++){var mutation=mutations[i];if(mutation.type==="childList"){scan(mutation.target);for(var j=0;j<mutation.addedNodes.length;j++)scan(mutation.addedNodes[j])}else{scan(mutation.target)}}});state.observer=observer;try{observer.observe(document.documentElement,{attributes:true,attributeFilter:["style","class","data-framer-name",IGNORE],childList:true,subtree:true,characterData:true})}catch(e){}window.addEventListener("DOMContentLoaded",function(){scan(document.body||document.documentElement)},{once:true});window.addEventListener("load",function(){scan(document.body||document.documentElement)},{once:true});[0,80,240,700,1600].forEach(function(delay){setTimeout(function(){scan(document.body||document.documentElement)},delay)});}catch(e){}})();`
}

function normalizeText(value: string) {
    return value.replace(/\s+/g, " ").trim()
}

function parsePx(value: string) {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : 0
}

function hasMeaningfulOwnText(element: HTMLElement) {
    for (const node of Array.from(element.childNodes)) {
        if (node.nodeType === Node.TEXT_NODE && normalizeText(node.textContent || "")) {
            return true
        }
    }
    return element.matches("p, span")
}

function hasBlockChild(element: HTMLElement) {
    return Array.from(element.children).some((child) => {
        if (!(child instanceof HTMLElement)) return false
        const display = window.getComputedStyle(child).display
        return /^(block|flex|grid|table|list-item)/.test(display)
    })
}

function isParagraphCandidate(
    element: HTMLElement,
    maxFontSize: number,
    minWords: number,
    excludeSelector: string
) {
    if (!element || element.dataset.mhPrettyIgnore === "true") return false
    if (excludeSelector && element.closest(excludeSelector)) return false
    if (element.matches("a, button, input, textarea, select, option")) return false

    const text = normalizeText(element.textContent || "")
    if (!text || text.split(/\s+/).length < minWords) return false
    if (!hasMeaningfulOwnText(element) || hasBlockChild(element)) return false

    const style = window.getComputedStyle(element)
    if (style.display === "none" || style.visibility === "hidden") return false
    if (style.whiteSpace.includes("nowrap") || style.whiteSpace === "pre") return false

    const fontSize = parsePx(style.fontSize)
    return fontSize > 0 && fontSize <= maxFontSize
}

function installStyle(attributeName: string) {
    const parent = document.head || document.documentElement
    let style = document.getElementById(STYLE_ID)
    if (!style) {
        style = document.createElement("style")
        style.id = STYLE_ID
        parent.appendChild(style)
    }

    const nextCss = cssText(attributeName)
    if (style.textContent !== nextCss) style.textContent = nextCss
}

function scanParagraphs(maxFontSize: number, minWords: number, excludeSelector: string) {
    const elements = Array.from(
        document.body.querySelectorAll(TEXT_SELECTOR)
    ).filter((element): element is HTMLElement => element instanceof HTMLElement)

    elements.forEach((element) => {
        if (isParagraphCandidate(element, maxFontSize, minWords, excludeSelector)) {
            element.setAttribute(ATTR, "true")
        } else if (element.getAttribute(ATTR) === "true") {
            element.removeAttribute(ATTR)
        }
    })
}

function getGlobalState() {
    const win = window as any
    if (!win[GLOBAL_KEY]) {
        win[GLOBAL_KEY] = {
            refs: 0,
            frame: 0,
            observer: null,
            timers: [],
            config: { maxFontSize: 23, minWords: 2, excludeSelector: DEFAULT_EXCLUDE_SELECTOR },
            run: null,
            resizeRun: null,
        }
    }
    return win[GLOBAL_KEY]
}

function useParagraphPrettyWrap(enabled: boolean, maxFontSize: number, minWords: number, excludeSelector: string) {
    usePrePaintEffect(() => {
        if (
            !enabled ||
            typeof window === "undefined" ||
            typeof document === "undefined" ||
            !document.body ||
            RenderTarget.current() === RenderTarget.thumbnail
        ) {
            return
        }

        const state = getGlobalState()
        state.refs += 1
        const resolvedMaxFontSize = Math.max(maxFontSize, state.config?.maxFontSize || 0, 23)
        state.config = { maxFontSize: resolvedMaxFontSize, minWords, excludeSelector }
        installStyle(ATTR)

        const run = () => {
            if (state.frame) window.cancelAnimationFrame(state.frame)
            state.frame = 0
            const config = state.config
            scanParagraphs(config.maxFontSize, config.minWords, config.excludeSelector)
        }
        state.run = run
        run()

        SCAN_DELAYS.forEach((delay) => {
            state.timers.push(window.setTimeout(run, delay))
        })

        if (!state.observer) {
            state.observer = new MutationObserver(() => state.run && state.run())
            state.observer.observe(document.body, {
                attributes: true,
                attributeFilter: ["style", "class", "data-framer-name", IGNORE_ATTR],
                childList: true,
                subtree: true,
                characterData: true,
            })
            state.resizeRun = run
            window.addEventListener("resize", state.resizeRun, { passive: true })
            window.addEventListener("orientationchange", state.resizeRun, { passive: true })
        }

        return () => {
            state.refs = Math.max(0, state.refs - 1)
            if (state.refs > 0) return

            if (state.frame) window.cancelAnimationFrame(state.frame)
            state.frame = 0
            state.timers.forEach((timer) => window.clearTimeout(timer))
            state.timers = []
            if (state.observer) state.observer.disconnect()
            state.observer = null
            if (state.resizeRun) {
                window.removeEventListener("resize", state.resizeRun)
                window.removeEventListener("orientationchange", state.resizeRun)
            }
            state.resizeRun = null
            document.querySelectorAll(`[${ATTR}="true"]`).forEach((element) => {
                element.removeAttribute(ATTR)
            })
        }
    }, [enabled, excludeSelector, maxFontSize, minWords])
}

/**
 * Site-wide helper for applying native pretty text wrapping only to paragraph-size text.
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function ParagraphPrettyWrap(props) {
    const {
        enabled = true,
        maxFontSize = 23,
        minWords = 2,
        excludeSelector = DEFAULT_EXCLUDE_SELECTOR,
        style,
    } = props
    const resolvedMaxFontSize = Math.max(maxFontSize, 23)
    const resolvedMinWords = Math.max(minWords, 1)

    useParagraphPrettyWrap(enabled, resolvedMaxFontSize, resolvedMinWords, excludeSelector)

    return (
        <>
            <style
                data-mh-paragraph-pretty-preload="true"
                dangerouslySetInnerHTML={{ __html: cssText(ATTR) }}
            />
            {enabled ? (
                <script
                    data-mh-paragraph-pretty-preload="true"
                    dangerouslySetInnerHTML={{
                        __html: preloadScript(resolvedMaxFontSize, resolvedMinWords),
                    }}
                />
            ) : null}
            <div
                aria-hidden="true"
                style={{
                    ...style,
                    width: 1,
                    height: 1,
                    opacity: 0,
                    overflow: "hidden",
                    pointerEvents: "none",
                }}
            />
        </>
    )
}

ParagraphPrettyWrap.displayName = "Paragraph Pretty Wrap"

addPropertyControls(ParagraphPrettyWrap, {
    enabled: {
        type: ControlType.Boolean,
        title: "Enabled",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    maxFontSize: {
        type: ControlType.Number,
        title: "Through",
        defaultValue: 23,
        min: 10,
        max: 40,
        step: 1,
        unit: "px",
        displayStepper: true,
    },
    minWords: {
        type: ControlType.Number,
        title: "Min words",
        defaultValue: 2,
        min: 1,
        max: 20,
        step: 1,
        displayStepper: true,
    },
    excludeSelector: {
        type: ControlType.String,
        title: "Exclude",
        defaultValue: DEFAULT_EXCLUDE_SELECTOR,
        displayTextArea: true,
    },
})
