// @ts-nocheck
import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

const STYLE_ID = "mh-paragraph-pretty-wrap-style"
const ATTR = "data-mh-paragraph-pretty"
const IGNORE_ATTR = "data-mh-pretty-ignore"
const GLOBAL_KEY = "__mhParagraphPrettyWrap"
const PRELOAD_KEY = "__mhParagraphPrettyWrapPreload"
const HOME_PATH = "/"
const PLAYGROUND_ROOT_SELECTOR = "[data-playground-root='true']"
const HOME_NAV_FROM_KEY = "__mhNavFromPath"
const HOME_ARRIVAL_AT_KEY = "__mhArrivalAt"
const HOME_ARRIVAL_FALLBACK_KEY = "__mhHomeArrivalIntentFallback"
const HOME_STATIC_PRESET_SELECTOR =
    'main [data-styles-preset="ZB3A5PLtS"]'
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
const TEXT_SELECTOR = "p, span, div, li, figcaption, blockquote"
const usePrePaintEffect =
    typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

function cssText(attributeName: string) {
    return `@supports (text-wrap: pretty) {
[${attributeName}="true"],
${HOME_STATIC_PRESET_SELECTOR} {
    text-wrap: pretty !important;
    text-wrap-style: pretty !important;
}
}`
}

function isHomePath() {
    try {
        return (window.location.pathname.replace(/\/+$/, "") || "/") === HOME_PATH
    } catch (err) {
        return false
    }
}

function normalizedPath(pathname: string) {
    return String(pathname || HOME_PATH).replace(/\/+$/, "") || HOME_PATH
}

// `/info` does not mount PageTransition, so a fresh Info document previously
// had no source-side listener to stamp the Home navigation intent. The Home
// controller would mount after the route change without a source path and fall
// back to Framer's delayed appear replay. Footer mounts this compatibility host
// on those routes; keep one capture-phase listener here so the destination
// PageTransition can start its all-route Home rise immediately.
function installHomeArrivalIntentFallback() {
    if (typeof window === "undefined" || typeof document === "undefined") {
        return () => {}
    }

    const win = window as any
    const state =
        win[HOME_ARRIVAL_FALLBACK_KEY] ||
        (win[HOME_ARRIVAL_FALLBACK_KEY] = {
            refs: 0,
            handler: null,
        })

    state.refs += 1
    if (!state.handler) {
        state.handler = (event: MouseEvent) => {
            try {
                const target = event.target as Element | null
                const anchor = target?.closest?.("a[href]") as HTMLAnchorElement
                if (!anchor) return

                const href = anchor.getAttribute("href") || ""
                if (/^(mailto:|tel:|#)/.test(href)) return

                const destination = new URL(anchor.href, window.location.href)
                if (destination.origin !== window.location.origin) return

                const sourcePath = normalizedPath(window.location.pathname)
                const destinationPath = normalizedPath(destination.pathname)
                if (
                    sourcePath === HOME_PATH ||
                    destinationPath !== HOME_PATH
                ) {
                    return
                }

                win[HOME_NAV_FROM_KEY] = sourcePath
                win[HOME_ARRIVAL_AT_KEY] = Date.now()
            } catch (err) {}
        }
        document.addEventListener("click", state.handler, true)
    }

    return () => {
        state.refs = Math.max(0, state.refs - 1)
        if (state.refs > 0 || !state.handler) return
        document.removeEventListener("click", state.handler, true)
        state.handler = null
    }
}

function preloadScript(maxFontSize = 23) {
    const resolvedMaxFontSize = Math.max(maxFontSize, 23)

    return `(function(){try{var path=(location.pathname||"/").replace(/\\/+$/,"")||"/";if(path==="/")return;var KEY=${JSON.stringify(PRELOAD_KEY)};var ATTR=${JSON.stringify(ATTR)};var IGNORE=${JSON.stringify(IGNORE_ATTR)};var PLAY=${JSON.stringify(PLAYGROUND_ROOT_SELECTOR)};var STYLE_ID=${JSON.stringify(STYLE_ID)};var SELECTOR=${JSON.stringify(TEXT_SELECTOR)};var EXCLUDE=${JSON.stringify(DEFAULT_EXCLUDE_SELECTOR)};var MAX=${resolvedMaxFontSize};var MIN=2;var existing=window[KEY];if(existing){existing.max=Math.max(existing.max||0,MAX);existing.min=Math.min(existing.min||MIN,MIN);if(existing.run)existing.run(document.body||document.documentElement);return;}function normalize(value){return String(value||"").replace(/\\s+/g," ").trim()}function parsePx(value){var parsed=parseFloat(value);return isFinite(parsed)?parsed:0}function hardExcluded(el){return !(el instanceof HTMLElement)||(el.dataset&&el.dataset.mhPrettyIgnore==="true")||(EXCLUDE&&el.closest&&el.closest(EXCLUDE))}function ignoredPlayStyle(mutation){var target=mutation.target;return mutation.type==="attributes"&&mutation.attributeName==="style"&&target&&target.nodeType===1&&target.closest&&target.closest(PLAY)}function hasOwnText(el){for(var i=0;i<el.childNodes.length;i++){var node=el.childNodes[i];if(node.nodeType===3&&normalize(node.textContent))return true}return el.matches&&el.matches("p, span")}function hasBlockChild(el){for(var i=0;i<el.children.length;i++){var child=el.children[i];if(child instanceof HTMLElement&&/^(block|flex|grid|table|list-item)/.test(getComputedStyle(child).display))return true}return false}function candidate(el,state){if(hardExcluded(el))return false;var text=normalize(el.textContent);if(!text||text.split(/\\s+/).length<(state.min||MIN))return false;if(!hasOwnText(el)||hasBlockChild(el))return false;var style=getComputedStyle(el);if(style.display==="none"||style.visibility==="hidden")return false;if(style.whiteSpace.indexOf("nowrap")>-1||style.whiteSpace==="pre")return false;var fontSize=parsePx(style.fontSize);return fontSize>0&&fontSize<=(state.max||MAX)}function ensureStyle(){var parent=document.head||document.documentElement;var style=document.getElementById(STYLE_ID);if(!style&&parent){style=document.createElement("style");style.id=STYLE_ID;parent.appendChild(style)}if(style){var css='@supports (text-wrap: pretty) {[${ATTR}="true"]{text-wrap: pretty !important;text-wrap-style: pretty !important;}}';if(style.textContent!==css)style.textContent=css}}function scan(root){var state=window[KEY];if(!state)return;ensureStyle();var base=root&&root.nodeType===1?root:(document.body||document.documentElement);if(!base)return;var nodes=[];if(base.matches&&base.matches(SELECTOR))nodes.push(base);if(base.querySelectorAll)nodes=nodes.concat(Array.prototype.slice.call(base.querySelectorAll(SELECTOR)));for(var i=0;i<nodes.length;i++){var el=nodes[i];try{if(hardExcluded(el)){if(el.getAttribute&&el.getAttribute(ATTR)==="true")el.removeAttribute(ATTR);continue}if(el.getAttribute(ATTR)==="true")continue;if(candidate(el,state))el.setAttribute(ATTR,"true")}catch(e){}}}var state=window[KEY]={max:MAX,min:MIN,run:scan};ensureStyle();scan(document.body||document.documentElement);var observer=new MutationObserver(function(mutations){for(var i=0;i<mutations.length;i++){var mutation=mutations[i];if(ignoredPlayStyle(mutation))continue;if(mutation.type==="childList"){scan(mutation.target);for(var j=0;j<mutation.addedNodes.length;j++)scan(mutation.addedNodes[j])}else{scan(mutation.target)}}});state.observer=observer;try{observer.observe(document.documentElement,{attributes:true,attributeFilter:["style","class","data-framer-name",IGNORE],childList:true,subtree:true,characterData:true})}catch(e){}window.addEventListener("DOMContentLoaded",function(){scan(document.body||document.documentElement)},{once:true});window.addEventListener("load",function(){scan(document.body||document.documentElement)},{once:true});[0,80,240,700,1600].forEach(function(delay){setTimeout(function(){scan(document.body||document.documentElement)},delay)});}catch(e){}})();`
}

function normalizeText(value: string) {
    return value.replace(/\s+/g, " ").trim()
}

function parsePx(value: string) {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : 0
}

function hasOwnText(element: HTMLElement) {
    for (const node of Array.from(element.childNodes)) {
        if (node.nodeType === Node.TEXT_NODE && normalizeText(node.textContent || "")) return true
    }
    return element.matches("p, span")
}

function hasBlockChild(element: HTMLElement) {
    return Array.from(element.children).some((child) => {
        if (!(child instanceof HTMLElement)) return false
        return /^(block|flex|grid|table|list-item)/.test(window.getComputedStyle(child).display)
    })
}

function isHardExcluded(element: HTMLElement) {
    if (!element || element.dataset.mhPrettyIgnore === "true") return true
    if (element.closest(DEFAULT_EXCLUDE_SELECTOR)) return true
    return element.matches("a, button, input, textarea, select, option")
}

// Play updates transforms while panning; those per-frame style writes must not
// trigger the site-wide paragraph scan.
function isIgnoredPlayStyleMutation(mutation: MutationRecord) {
    if (mutation.type !== "attributes" || mutation.attributeName !== "style") return false
    const target = mutation.target
    return target instanceof Element && Boolean(target.closest(PLAYGROUND_ROOT_SELECTOR))
}

function isCandidate(element: HTMLElement, maxFontSize: number) {
    if (isHardExcluded(element)) return false
    const text = normalizeText(element.textContent || "")
    if (!text || text.split(/\s+/).length < 2) return false
    if (!hasOwnText(element) || hasBlockChild(element)) return false
    const style = window.getComputedStyle(element)
    if (style.display === "none" || style.visibility === "hidden") return false
    if (style.whiteSpace.includes("nowrap") || style.whiteSpace === "pre") return false
    const fontSize = parsePx(style.fontSize)
    return fontSize > 0 && fontSize <= maxFontSize
}

function installPrettyWrapFallback(maxFontSize = 23) {
    if (
        typeof window === "undefined" ||
        typeof document === "undefined" ||
        !document.body ||
        RenderTarget.current() === RenderTarget.thumbnail
    ) {
        return () => {}
    }

    // Home has one qualifying paragraph. Its stable Framer text-style ID is
    // covered by the static rule above, so no hydration observer is needed.
    if (isHomePath()) return () => {}

    const win = window as any
    const state =
        win[GLOBAL_KEY] ||
        (win[GLOBAL_KEY] = {
            refs: 0,
            frame: 0,
            observer: null,
            timers: [],
            config: { maxFontSize },
            run: null,
            resizeRun: null,
        })

    state.refs += 1
    state.config = {
        ...state.config,
        maxFontSize: Math.max(maxFontSize, state.config?.maxFontSize || 0, 23),
    }

    let style = document.getElementById(STYLE_ID)
    if (!style) {
        style = document.createElement("style")
        style.id = STYLE_ID
        ;(document.head || document.documentElement).appendChild(style)
    }
    style.textContent = `@supports (text-wrap: pretty) {
[${ATTR}="true"] {
    text-wrap: pretty !important;
    text-wrap-style: pretty !important;
}
}`

    const run = () => {
        if (state.frame) window.cancelAnimationFrame(state.frame)
        state.frame = 0
        const limit = state.config?.maxFontSize || 23
        document.body.querySelectorAll(TEXT_SELECTOR).forEach((element) => {
            if (!(element instanceof HTMLElement)) return
            if (isHardExcluded(element)) {
                if (element.getAttribute(ATTR) === "true") element.removeAttribute(ATTR)
            } else if (element.getAttribute(ATTR) === "true") {
                return
            } else if (isCandidate(element, limit)) {
                element.setAttribute(ATTR, "true")
            }
        })
    }
    state.run = run
    run()

    ;[0, 80, 240, 700, 1600].forEach((delay) => state.timers.push(window.setTimeout(run, delay)))

    if (!state.observer) {
        state.observer = new MutationObserver((mutations) => {
            if (mutations.every(isIgnoredPlayStyleMutation)) return
            if (state.run) state.run()
        })
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
    }
}

/**
 * Footer compatibility host.
 *
 * The original resume-link side effect is retired, but Footer still mounts this
 * invisible component. It now also carries the paragraph pretty-wrap fallback so
 * routes without PageTransition still get site-wide orphan reduction, plus the
 * Home-arrival intent stamp needed for immediate `/info` → Home motion.
 *
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */

type ResumeAssetHostProps = {
    resumeFile?: string
    style?: React.CSSProperties
}

export default function ResumeAssetHost(props: ResumeAssetHostProps) {
    usePrePaintEffect(() => installPrettyWrapFallback(23), [])
    usePrePaintEffect(() => installHomeArrivalIntentFallback(), [])

    return (
        <>
            <style
                data-mh-paragraph-pretty-preload="true"
                dangerouslySetInnerHTML={{ __html: cssText(ATTR) }}
            />
            <script
                data-mh-paragraph-pretty-preload="true"
                dangerouslySetInnerHTML={{ __html: preloadScript(23) }}
            />
            <div
                aria-hidden="true"
                data-resume-file={props.resumeFile || ""}
                style={{
                    ...props.style,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    overflow: "hidden",
                    pointerEvents: "none",
                }}
            />
        </>
    )
}

addPropertyControls<ResumeAssetHostProps>(ResumeAssetHost, {
    resumeFile: {
        type: ControlType.File,
        title: "Resume PDF",
        allowedFileTypes: ["pdf"],
    },
})
