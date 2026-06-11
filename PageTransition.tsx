import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

// Site-wide page transition (zitafernandez.com-style). v6.3 — dual-path View
// Transitions + first-boot loader + appear-effect restart.
//
// NAVIGATION — Framer's published runtime navigates internal links TWO
// ways: its SPA router (history.pushState) and real cross-document loads
// (e.g. on case-study pages where the lightbox click-guard stops the
// router's listener). @view-transition CSS covers the cross-document path;
// a module-scope capture listener wraps router clicks in
// document.startViewTransition() WITHOUT preventing default. Both paths
// share the same ::view-transition-* pseudo-elements: the outgoing page
// dims and drifts up while the ACTUAL incoming page slides up over it as a
// sheet; the nav (its own transition group) swipes out and back in.
//
// APPEAR-EFFECT RESTART (v6.3) — load-in animations (text fades, header
// slide-ups, line draws) must START when the cover ends, even if they
// already ran while preloaded. Two mechanisms: (1) HOLD — WAAPI entrance
// animations are frozen at frame zero while a transition is running;
// (2) REPLAY — Framer's own appear runtime (window.animator +
// window.__framer__appearAnimationsContent definitions) is re-invoked to
// restart every appear effect from its initial state. Transitions replay
// at finish (skipping elements whose held animations just resumed); the
// boot loader replays at swipe start, while the curtain still covers, so
// the reset is invisible and effects animate in as the page is revealed.
//
// FIRST BOOT — the SSR'd script injects a curtain + top progress bar before
// hydration, waits for window.load (bounded), then swipes up. "Auto" mode
// plays it on direct entries AND reloads and skips internal-link arrivals
// and back/forward (navigation timing type + same-origin referrer).

const STYLE_ID = "__pt-vt-style"
const BOOT_ID = "__pt-boot"
const PAGE_EASE = "cubic-bezier(0.6, 0, 0.18, 1)" // softer entry, silkier landing
const NAV_EASE = "cubic-bezier(0.22, 1, 0.36, 1)" // measured nav spring feel
const LOADER_EASE = "cubic-bezier(0.65, 0.01, 0.05, 0.99)" // Zita's loader
const NAV_NAME = "__pt-nav"
const Z = 2147483600
const COLOR_RE = /[<>"'\\{}]/g

// One-time hygiene: remove anything a previous version of this component
// may have left in storage or the DOM for returning visitors.
const LEGACY_IDS = ["__pt-curtain", "__pt-cover", "__pt-dim", "__pt-nav-style"]
const LEGACY_FLAGS = ["__ptCover", "__ptBootSeen:v2"]

let sdEnabled = false
let sdExclude = "[data-no-transition]"
let sdNavSelector = "nav"
let sdHoldAppear = true
let sdActive = false

function reducedMotion(): boolean {
    try {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    } catch (e) {
        return false
    }
}

function normPath(p: string): string {
    const out = p.replace(/\/+$/, "")
    return out === "" ? "/" : out
}

// Duplicate view-transition-names on one page silently disable the WHOLE
// transition (per spec). Keep the name on the first rendered nav only.
function dedupeNavNames(navSelector: string) {
    try {
        const els = Array.from(document.querySelectorAll(navSelector))
        const rendered = els.filter((el) => {
            try {
                return window.getComputedStyle(el).display !== "none"
            } catch (e) {
                return false
            }
        })
        for (let i = 1; i < rendered.length; i++) {
            ;(rendered[i] as HTMLElement).style.viewTransitionName = "none"
        }
    } catch (e) {}
}

// ------------------------------------------------------ appear hold/replay

// Re-run Framer's published appear effects from their definitions — a true
// restart from the initial state, even if they already played. Mirrors the
// inline starter script Framer ships. `skip` = elements whose held
// animations were just resumed (avoid double-starting those).
function replayAppearEffects(skip?: Set<Element>) {
    try {
        if (reducedMotion()) return
        const w: any = window
        const an = w.animator
        const defs = w.__framer__appearAnimationsContent
        if (!an || !an.animateAppearEffects || !defs || !defs.text) return
        let hash: any = undefined
        try {
            const bp = w.__framer__breakpoints
            if (bp && bp.text && an.getActiveVariantHash)
                hash = an.getActiveVariantHash(JSON.parse(bp.text))
        } catch (e) {}
        an.animateAppearEffects(
            JSON.parse(defs.text),
            (selector: string, keyframes: any, options: any) => {
                try {
                    const el = document.querySelector(selector)
                    if (!el) return
                    if (skip && skip.has(el)) return
                    for (const k in keyframes) {
                        try {
                            an.startOptimizedAppearAnimation(
                                el,
                                k,
                                keyframes[k],
                                options[k]
                            )
                        } catch (e) {}
                    }
                } catch (e) {}
            },
            "data-framer-appear-id",
            "__Appear_Animation_Transform__",
            false,
            hash
        )
    } catch (e) {}
}

if (typeof window !== "undefined") {
    // The SSR'd boot script calls this at swipe start (see installScript).
    ;(window as any).__ptReplayAppear = replayAppearEffects
}

function isVtAnim(a: any): boolean {
    try {
        const pe = a.effect && (a.effect as any).pseudoElement
        return !!pe && pe.indexOf("::view-transition") === 0
    } catch (e) {
        return false
    }
}

// Freeze just-started, finite entrance animations at frame zero until
// `until` settles (or the safety timeout fires), then let them play and
// replay any appear effects the hold missed. Nav animations are finished
// instantly instead — the nav has its own VT group.
function holdAppearAnimations(until: Promise<any> | null) {
    if (!sdHoldAppear || reducedMotion()) return
    const d: any = document
    if (typeof d.getAnimations !== "function") return
    const held: any[] = []
    const heldEls = new Set<Element>()
    const seen = new Set<any>()
    let released = false

    const collect = () => {
        if (released) return
        let list: any[] = []
        try {
            list = d.getAnimations()
        } catch (e) {
            return
        }
        for (let i = 0; i < list.length; i++) {
            const a: any = list[i]
            if (seen.has(a)) continue
            seen.add(a)
            if (isVtAnim(a)) continue
            try {
                if (
                    typeof (window as any).CSSTransition !== "undefined" &&
                    a instanceof (window as any).CSSTransition
                )
                    continue
                const timing =
                    a.effect && a.effect.getTiming ? a.effect.getTiming() : null
                if (timing && timing.iterations === Infinity) continue
                const ct = Number(a.currentTime) || 0
                if (ct > 1600) continue // long-running ambient animation
                a.currentTime = 0
                a.pause()
                held.push(a)
                const el = a.effect && a.effect.target
                if (el) heldEls.add(el)
            } catch (e) {}
        }
    }

    collect()
    const iv = window.setInterval(collect, 90)

    let navEls: Element[] = []
    try {
        navEls = Array.from(document.querySelectorAll(sdNavSelector))
    } catch (e) {}

    const release = () => {
        if (released) return
        released = true
        window.clearInterval(iv)
        for (let i = 0; i < held.length; i++) {
            const a: any = held[i]
            try {
                const el = a.effect && a.effect.target
                const inNav =
                    el &&
                    navEls.some(
                        (n) => n === el || (n.contains && n.contains(el))
                    )
                if (inNav) a.finish()
                else a.play()
            } catch (e) {
                try {
                    a.play()
                } catch (e2) {}
            }
        }
        // Anything the hold missed (e.g. effects that finished or were
        // handed off before collection) restarts from its initial state.
        replayAppearEffects(heldEls)
    }

    if (until && typeof until.then === "function") {
        until.then(release, release)
    } else {
        // No finished promise available — poll the active-transition state.
        const poll = () => {
            if (released) return
            let active = false
            try {
                active = document.documentElement.matches(
                    ":active-view-transition"
                )
            } catch (e) {
                active = false
            }
            if (!active) release()
            else window.setTimeout(poll, 100)
        }
        window.setTimeout(poll, 100)
    }
    window.setTimeout(release, 4000) // hard safety
}

// Cross-document arrivals: pagereveal carries the ViewTransition object.
if (typeof window !== "undefined" && !(window as any).__ptRevealBound) {
    ;(window as any).__ptRevealBound = true
    window.addEventListener("pagereveal", (e: any) => {
        if (e && e.viewTransition) {
            holdAppearAnimations(e.viewTransition.finished)
        }
    })
}

// ------------------------------------------------------- same-document path

function onClickCapture(e: MouseEvent) {
    if (!sdEnabled || sdActive) return
    const d: any = document
    if (typeof d.startViewTransition !== "function") return
    if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
    )
        return
    const t = e.target as Element | null
    if (!t || typeof (t as any).closest !== "function") return
    const a = (t as Element).closest("a[href]") as HTMLAnchorElement | null
    if (!a) return
    if (a.target && a.target !== "_self") return
    if (a.hasAttribute("download")) return
    try {
        if (sdExclude && a.closest(sdExclude)) return
    } catch (err) {}
    const raw = a.getAttribute("href") || ""
    if (
        !raw ||
        raw.charAt(0) === "#" ||
        raw.indexOf("mailto:") === 0 ||
        raw.indexOf("tel:") === 0
    )
        return
    let url: URL
    try {
        url = new URL(a.href, window.location.href)
    } catch (err) {
        return
    }
    if (url.origin !== window.location.origin) return
    if (normPath(url.pathname) === normPath(window.location.pathname)) return
    if (reducedMotion()) return

    sdActive = true
    dedupeNavNames(sdNavSelector) // guard right before the old-state capture
    const fromHref = window.location.href
    const fromTitle = document.title
    let mutated = false
    let mo: MutationObserver | null = null
    try {
        mo = new MutationObserver(() => {
            mutated = true
        })
        mo.observe(document.body, { childList: true, subtree: true })
    } catch (err) {}

    let contentReady = false
    // NOTE: rendering is paused during the update callback, so timers (not
    // rAF) drive the polling. Timers and MutationObserver still run.
    const vt = d.startViewTransition(
        () =>
            new Promise<void>((resolve) => {
                const t0 = Date.now()
                const poll = () => {
                    const urlChanged = window.location.href !== fromHref
                    const rendered = mutated || document.title !== fromTitle
                    if (urlChanged && rendered) {
                        contentReady = true
                        // New nav may have mounted — keep names unique
                        // before the new-state capture.
                        dedupeNavNames(sdNavSelector)
                        window.setTimeout(resolve, 90) // let React commit
                        return
                    }
                    if (Date.now() - t0 > 2500) {
                        resolve()
                        return
                    }
                    window.setTimeout(poll, 40)
                }
                poll()
            })
    )
    const settle = () => {
        sdActive = false
        if (mo) {
            try {
                mo.disconnect()
            } catch (err) {}
        }
    }
    try {
        vt.finished.then(settle, settle)
        vt.updateCallbackDone.then(
            () => {
                // Full-document load in flight or router never produced new
                // content — never animate a stale snapshot.
                if (!contentReady) {
                    try {
                        vt.skipTransition()
                    } catch (err) {}
                } else {
                    // New page's appear effects wait for the sheet to land.
                    holdAppearAnimations(vt.finished)
                }
            },
            () => {}
        )
    } catch (err) {
        settle()
    }
}

if (typeof window !== "undefined" && !(window as any).__ptSdBound) {
    ;(window as any).__ptSdBound = true
    window.addEventListener("click", onClickCapture, true)
}

// --------------------------------------------------------------------- css

function buildCss(
    duration: number,
    navDuration: number,
    drift: number,
    dim: number,
    navSelector: string
): string {
    const dimB = Math.max(0, Math.min(1, 1 - dim))
    const navScoped = navSelector
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .join(", ")
    return `
@view-transition { navigation: auto; }

${navScoped} { view-transition-name: ${NAV_NAME}; }

::view-transition { background-color: rgb(20, 20, 20); }

::view-transition-old(root) {
    animation: __pt-old-exit ${duration}ms ${PAGE_EASE} both;
}
::view-transition-new(root) {
    animation: __pt-new-enter ${duration}ms ${PAGE_EASE} both;
}
::view-transition-old(${NAV_NAME}) {
    animation: __pt-nav-out ${Math.round(navDuration * 0.85)}ms ${NAV_EASE} both;
}
::view-transition-new(${NAV_NAME}) {
    animation: __pt-nav-in ${navDuration}ms ${NAV_EASE} ${duration}ms both;
}
@keyframes __pt-new-enter {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}
@keyframes __pt-old-exit {
    from { transform: translateY(0); filter: brightness(1); }
    to { transform: translateY(-${drift}vh); filter: brightness(${dimB}); }
}
@keyframes __pt-nav-out {
    from { transform: translateY(0); }
    to { transform: translateY(-130%); }
}
@keyframes __pt-nav-in {
    from { transform: translateY(-130%); }
    to { transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
    ::view-transition-group(*),
    ::view-transition-image-pair(*),
    ::view-transition-old(*),
    ::view-transition-new(*) {
        animation: none !important;
    }
}
`
}

interface BootCfg {
    enabled: boolean
    auto: boolean
    color: string
    barColor: string
    barHeight: number
    minMs: number
    maxWaitMs: number
    barEaseMs: number
    barHold: number
    swipeMs: number
    swipeDelayMs: number
}

// Installs the CSS into <head> during HTML parse (idempotent by id) and, on
// direct entry, runs the first-boot loader before hydration.
function installScript(css: string, boot: BootCfg): string {
    const bootColor = String(boot.color).replace(COLOR_RE, "")
    const barColor = String(boot.barColor).replace(COLOR_RE, "")
    // Zita-style gating: play on reloads and fresh entries (no referrer or
    // external referrer); skip internal-link arrivals (the page transition
    // owns those), back/forward traversals, and prerender passes.
    const freshFn =
        "function __ptFresh(){try{" +
        "var n=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];" +
        "var t=n?n.type:'navigate';" +
        "if(t==='reload')return true;" +
        "if(t!=='navigate')return false;" +
        "var r=document.referrer;" +
        "if(!r)return true;" +
        "try{return new URL(r).origin!==location.origin}catch(e){return true}" +
        "}catch(e){return true}}"
    const bootJs = !boot.enabled
        ? ""
        : "try{" +
          "if(!window.matchMedia||!matchMedia('(prefers-reduced-motion: reduce)').matches){" +
          (boot.auto ? "if(__ptFresh())__ptBoot();" : "__ptBoot();") +
          "}" +
          "}catch(e){}" +
          freshFn +
          "function __ptBoot(){" +
          'if(document.getElementById("' +
          BOOT_ID +
          '"))return;' +
          'var w=document.createElement("div");' +
          'w.id="' +
          BOOT_ID +
          '";' +
          'w.setAttribute("aria-hidden","true");' +
          'w.style.cssText="position:fixed;top:0;left:0;width:100vw;height:100vh;background:' +
          bootColor +
          ";z-index:" +
          Z +
          ';pointer-events:none;will-change:transform;";' +
          'var b=document.createElement("div");' +
          'b.style.cssText="position:absolute;top:0;left:0;width:100%;height:' +
          boot.barHeight +
          "px;background:" +
          barColor +
          ';transform:scaleX(0);transform-origin:left center;will-change:transform;";' +
          "w.appendChild(b);" +
          "document.documentElement.appendChild(w);" +
          "var start=Date.now();" +
          "requestAnimationFrame(function(){requestAnimationFrame(function(){" +
          'b.style.transition="transform ' +
          boot.barEaseMs +
          "ms " +
          LOADER_EASE +
          '";' +
          'b.style.transform="scaleX(' +
          boot.barHold +
          ')";' +
          "})});" +
          "var done=false;" +
          "function fin(){" +
          "if(done)return;done=true;" +
          "var wait=Math.max(0," +
          boot.minMs +
          "-(Date.now()-start));" +
          "setTimeout(function(){" +
          'b.style.transition="transform 250ms ' +
          LOADER_EASE +
          '";' +
          'b.style.transform="scaleX(1)";' +
          "setTimeout(function(){" +
          // Restart all appear effects while still fully covered, so the
          // page is revealed mid-animation — cause and effect.
          "try{if(window.__ptReplayAppear)window.__ptReplayAppear()}catch(e){}" +
          'w.style.transition="transform ' +
          boot.swipeMs +
          "ms " +
          LOADER_EASE +
          '";' +
          'w.style.transform="translateY(-100.5%)";' +
          "setTimeout(function(){if(w.parentNode)w.parentNode.removeChild(w)}," +
          (boot.swipeMs + 120) +
          ");" +
          "}," +
          boot.swipeDelayMs +
          ");" +
          "},wait);" +
          "}" +
          'if(document.readyState==="complete"){fin()}' +
          'else{window.addEventListener("load",fin,{once:true})}' +
          "setTimeout(fin," +
          boot.maxWaitMs +
          ");" +
          "}"
    return (
        "(function(){try{" +
        "var c=" +
        JSON.stringify(css) +
        ";" +
        'var s=document.getElementById("' +
        STYLE_ID +
        '");' +
        "if(!s){" +
        's=document.createElement("style");' +
        's.id="' +
        STYLE_ID +
        '";' +
        "(document.head||document.documentElement).appendChild(s);" +
        "}" +
        "if(s.textContent!==c)s.textContent=c;" +
        "}catch(e){}" +
        bootJs +
        "})()"
    )
}

interface Props {
    enabled: boolean
    duration: number
    navDuration: number
    drift: number
    dim: number
    navSelector: string
    excludeSelector: string
    prefetch: boolean
    holdAppear: boolean
    firstBoot: boolean
    bootMode: string
    bootColor: string
    barColor: string
    barHeight: number
    bootMinMs: number
    bootMaxWaitMs: number
    barEaseMs: number
    barHold: number
    bootSwipeMs: number
    bootSwipeDelayMs: number
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function PageTransition(props: Props) {
    const {
        enabled = true,
        duration = 700,
        navDuration = 400,
        drift = 10,
        dim = 0.35,
        navSelector = 'nav[data-framer-name="Navigation"], nav',
        excludeSelector = "[data-no-transition]",
        prefetch = true,
        holdAppear = true,
        firstBoot = true,
        bootMode = "once",
        bootColor = "#233324",
        barColor = "#F7F5F0",
        barHeight = 8,
        bootMinMs = 1200,
        bootMaxWaitMs = 4500,
        barEaseMs = 3000,
        barHold = 0.86,
        bootSwipeMs = 1200,
        bootSwipeDelayMs = 300,
    } = props

    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const css = buildCss(duration, navDuration, drift, dim, navSelector)
    const boot: BootCfg = {
        enabled: firstBoot,
        // "once" (legacy value, now titled Auto) = entries + reloads only;
        // "always" = every document load.
        auto: bootMode !== "always",
        color: bootColor,
        barColor: barColor,
        barHeight: barHeight,
        minMs: bootMinMs,
        maxWaitMs: bootMaxWaitMs,
        barEaseMs: barEaseMs,
        barHold: barHold,
        swipeMs: bootSwipeMs,
        swipeDelayMs: bootSwipeDelayMs,
    }

    React.useEffect(() => {
        if (typeof window === "undefined") return
        if (isCanvas) return

        sdEnabled = enabled
        sdExclude = excludeSelector
        sdNavSelector = navSelector
        sdHoldAppear = holdAppear

        dedupeNavNames(navSelector)

        // Cross-document arrival fallback: if the module evaluated after
        // pagereveal already fired, a transition may be running right now.
        if (enabled && holdAppear) {
            let active = false
            try {
                active = document.documentElement.matches(
                    ":active-view-transition"
                )
            } catch (e) {}
            if (active) holdAppearAnimations(null)
        }

        // Hygiene: clear leftovers from previous implementations.
        LEGACY_FLAGS.forEach((k) => {
            try {
                window.sessionStorage.removeItem(k)
            } catch (e) {}
        })
        LEGACY_IDS.forEach((id) => {
            const el = document.getElementById(id)
            if (el && el.parentNode) el.parentNode.removeChild(el)
        })
        document.documentElement.removeAttribute("data-pt-nav")

        // Keep the installed CSS in sync with props.
        const styleEl = document.getElementById(STYLE_ID)
        if (!enabled) {
            if (styleEl && styleEl.parentNode)
                styleEl.parentNode.removeChild(styleEl)
        } else {
            if (styleEl) {
                if (styleEl.textContent !== css) styleEl.textContent = css
            } else {
                const s = document.createElement("style")
                s.id = STYLE_ID
                s.textContent = css
                document.head.appendChild(s)
            }
        }

        // Hover-prefetch internal pages so full-document swaps start fast.
        if (enabled && prefetch) {
            try {
                const HS: any = (window as any).HTMLScriptElement
                if (
                    HS &&
                    HS.supports &&
                    HS.supports("speculationrules") &&
                    !document.querySelector("script[data-pt-prefetch]")
                ) {
                    const s = document.createElement("script")
                    s.type = "speculationrules"
                    ;(s as any).dataset.ptPrefetch = "1"
                    s.text = JSON.stringify({
                        prefetch: [
                            {
                                where: { href_matches: "/*" },
                                eagerness: "moderate",
                            },
                        ],
                    })
                    document.head.appendChild(s)
                }
            } catch (e) {}
        }
    }, [
        enabled,
        prefetch,
        css,
        excludeSelector,
        navSelector,
        holdAppear,
        isCanvas,
    ])

    return (
        <div
            style={{
                width: 1,
                height: 1,
                opacity: 0,
                pointerEvents: "none",
            }}
        >
            {!isCanvas && enabled && (
                <script
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{
                        __html: installScript(css, boot),
                    }}
                />
            )}
        </div>
    )
}

addPropertyControls(PageTransition, {
    enabled: {
        type: ControlType.Boolean,
        title: "Enabled",
        defaultValue: true,
    },
    duration: {
        type: ControlType.Number,
        title: "Slide",
        defaultValue: 700,
        min: 200,
        max: 1500,
        step: 10,
        unit: "ms",
        displayStepper: true,
    },
    navDuration: {
        type: ControlType.Number,
        title: "Nav swipe",
        defaultValue: 400,
        min: 100,
        max: 1000,
        step: 10,
        unit: "ms",
        displayStepper: true,
    },
    drift: {
        type: ControlType.Number,
        title: "Old drift",
        defaultValue: 10,
        min: 0,
        max: 30,
        step: 1,
        unit: "vh",
        displayStepper: true,
    },
    dim: {
        type: ControlType.Number,
        title: "Old dim",
        defaultValue: 0.35,
        min: 0,
        max: 0.8,
        step: 0.05,
        displayStepper: true,
    },
    navSelector: {
        type: ControlType.String,
        title: "Nav selector",
        defaultValue: 'nav[data-framer-name="Navigation"], nav',
    },
    excludeSelector: {
        type: ControlType.String,
        title: "Exclude",
        defaultValue: "[data-no-transition]",
    },
    prefetch: {
        type: ControlType.Boolean,
        title: "Prefetch",
        defaultValue: true,
        enabledTitle: "Hover",
        disabledTitle: "Off",
    },
    holdAppear: {
        type: ControlType.Boolean,
        title: "Hold appear",
        defaultValue: true,
        enabledTitle: "Until done",
        disabledTitle: "Off",
    },
    firstBoot: {
        type: ControlType.Boolean,
        title: "First boot",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Off",
    },
    bootMode: {
        type: ControlType.Enum,
        title: "Boot mode",
        defaultValue: "once",
        options: ["once", "always"],
        optionTitles: ["Auto", "Always"],
        displaySegmentedControl: true,
        hidden: (p: any) => !p.firstBoot,
    },
    bootColor: {
        type: ControlType.Color,
        title: "Boot color",
        defaultValue: "#233324",
        hidden: (p: any) => !p.firstBoot,
    },
    barColor: {
        type: ControlType.Color,
        title: "Bar color",
        defaultValue: "#F7F5F0",
        hidden: (p: any) => !p.firstBoot,
    },
    barHeight: {
        type: ControlType.Number,
        title: "Bar height",
        defaultValue: 8,
        min: 1,
        max: 40,
        step: 1,
        unit: "px",
        displayStepper: true,
        hidden: (p: any) => !p.firstBoot,
    },
    bootMinMs: {
        type: ControlType.Number,
        title: "Boot min",
        defaultValue: 1200,
        min: 0,
        max: 6000,
        step: 100,
        unit: "ms",
        displayStepper: true,
        hidden: (p: any) => !p.firstBoot,
    },
    bootMaxWaitMs: {
        type: ControlType.Number,
        title: "Max wait",
        defaultValue: 4500,
        min: 500,
        max: 15000,
        step: 100,
        unit: "ms",
        displayStepper: true,
        hidden: (p: any) => !p.firstBoot,
    },
    barEaseMs: {
        type: ControlType.Number,
        title: "Bar ease",
        defaultValue: 3000,
        min: 300,
        max: 8000,
        step: 100,
        unit: "ms",
        displayStepper: true,
        hidden: (p: any) => !p.firstBoot,
    },
    barHold: {
        type: ControlType.Number,
        title: "Bar hold",
        defaultValue: 0.86,
        min: 0.1,
        max: 1,
        step: 0.01,
        displayStepper: true,
        hidden: (p: any) => !p.firstBoot,
    },
    bootSwipeMs: {
        type: ControlType.Number,
        title: "Boot swipe",
        defaultValue: 1200,
        min: 200,
        max: 3000,
        step: 50,
        unit: "ms",
        displayStepper: true,
        hidden: (p: any) => !p.firstBoot,
    },
    bootSwipeDelayMs: {
        type: ControlType.Number,
        title: "Swipe delay",
        defaultValue: 300,
        min: 0,
        max: 2000,
        step: 50,
        unit: "ms",
        displayStepper: true,
        hidden: (p: any) => !p.firstBoot,
    },
})
