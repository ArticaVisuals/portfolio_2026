import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

// Site-wide page transition (zitafernandez.com-style). v7.1 — dual-path View
// Transitions + first-boot loader + appear-effect restart + /play blank-hold.
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
// APPEAR-EFFECT RESTART (v6.4) — load-in animations must START when the
// cover ends, even if they already ran while preloaded. Framer's
// startOptimizedAppearAnimation no-ops when re-invoked after the hydration
// handoff (verified live), so the replay builds WAAPI animations DIRECTLY
// from the published appear definitions (__framer__appearAnimationsContent)
// with el.animate(). The boot loader replays at swipe start (still fully
// covered → invisible reset); transitions replay at finish, skipping
// elements whose frame-zero-held animations just resumed. Each replay also
// dispatches a "pt:reveal" CustomEvent on window so custom code components
// (e.g. the /play views) can restart their own internal intros. /play
// additionally gets a force-blank hold on its gallery while transitioning
// in, released once the transition settles.
//
// v6.8 — SINGLE-ARM HOLD GUARD: on transition arrivals, both the navigation
// path AND the mount effect's :active-view-transition fallback could arm
// holdAppearAnimations, double-firing pt:reveal and restarting every appear
// effect twice (~100ms apart). A module-level sdHoldActive flag ensures only
// one hold runs at a time, so load-ins replay exactly once, after the
// transition finishes.
//
// FIRST BOOT — the SSR'd script injects a curtain + top progress bar before
// hydration, waits for window.load (bounded), then swipes up. "Auto" mode
// plays it only on home direct entries/reloads and skips other route reloads,
// internal-link arrivals, and back/forward (route + navigation timing type +
// same-origin referrer).

const STYLE_ID = "__pt-vt-style"
const BOOT_ID = "__pt-boot"
const PAGE_EASE = "cubic-bezier(0.6, 0, 0.18, 1)" // softer entry, silkier landing
const RELEASE_AT = 0.55 // load-ins start at this fraction of the slide (Zita: ~0.4 of her wipe)
const NAV_EASE = "cubic-bezier(0.22, 1, 0.36, 1)" // measured nav spring feel
const LOADER_EASE = "cubic-bezier(0.65, 0.01, 0.05, 0.99)" // Zita's loader
const NAV_NAME = "__pt-nav"
const Z = 2147483600
const COLOR_RE = /[<>"'\\{}]/g
const BOOT_LABEL = "Micah Hoang ©2026"
const BOOT_LABEL_ID = "__pt-boot-label"
const BOOT_LABEL_FADE_MS = 260
const HOME_PATH = "/"
const PLAY_PATH = "/play"
const PLAY_FORCE_BLANK_ATTR = "data-playground-force-blank"
const PLAY_LOAD_IN_DELAY_MS = 70
const PLAY_DIRECT_BLANK_SAFETY_MS = 1800
const PLAY_BLANK_COLOR = "rgb(247, 245, 240)"
const PLAY_CARD_FADE_MS = 960
const PLAY_CARD_TRANSFORM_MS = 790
const PLAY_CARD_EASE = "cubic-bezier(0.16, 1, 0.3, 1)"
const FRAMER_EDITORBAR_SELECTOR =
    "#__framer-editorbar-container, #__framer-editorbar-label"

// One-time hygiene: remove anything a previous version of this component
// may have left in storage or the DOM for returning visitors.
const LEGACY_IDS = ["__pt-curtain", "__pt-cover", "__pt-dim", "__pt-nav-style"]
const LEGACY_FLAGS = ["__ptCover", "__ptBootSeen:v2"]

let sdEnabled = false
let sdExclude = "[data-no-transition]"
let sdNavSelector = "nav"
let sdHoldAppear = true
let sdActive = false
let sdHoldActive = false
let sdDuration = 700
let sdSynth = false // re-dispatched click in flight (see onClickCapture)

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

function isPlayPath(pathname: string): boolean {
    return normPath(pathname) === PLAY_PATH
}

function setPlayBlank(active: boolean) {
    try {
        if (active) document.documentElement.setAttribute(PLAY_FORCE_BLANK_ATTR, "true")
        else document.documentElement.removeAttribute(PLAY_FORCE_BLANK_ATTR)
    } catch (e) {}
}

function releasePlayBlank(delayMs = PLAY_LOAD_IN_DELAY_MS) {
    if (reducedMotion()) {
        setPlayBlank(false)
        return
    }
    window.setTimeout(() => setPlayBlank(false), Math.max(0, delayMs))
}

function releasePlayBlankWhenSettled(until: Promise<any> | null) {
    const release = () => releasePlayBlank()
    if (until && typeof until.then === "function") {
        until.then(release, release)
    } else {
        const poll = () => {
            let active = false
            try {
                active = document.documentElement.matches(":active-view-transition")
            } catch (e) {
                active = false
            }
            if (!active) release()
            else window.setTimeout(poll, 100)
        }
        window.setTimeout(poll, 100)
    }
    window.setTimeout(() => setPlayBlank(false), 4000)
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

function appearTransform(v: any): string {
    const parts: string[] = []
    if (v.transformPerspective)
        parts.push(`perspective(${v.transformPerspective}px)`)
    const x = v.x || 0
    const y = v.y || 0
    if (x || y)
        parts.push(
            `translateX(${typeof x === "number" ? x + "px" : x}) translateY(${
                typeof y === "number" ? y + "px" : y
            })`
        )
    if (v.scale !== undefined && v.scale !== 1) parts.push(`scale(${v.scale})`)
    if (v.rotate) parts.push(`rotate(${v.rotate}deg)`)
    if (v.rotateX) parts.push(`rotateX(${v.rotateX}deg)`)
    if (v.rotateY) parts.push(`rotateY(${v.rotateY}deg)`)
    if (v.skewX) parts.push(`skewX(${v.skewX}deg)`)
    if (v.skewY) parts.push(`skewY(${v.skewY}deg)`)
    return parts.length ? parts.join(" ") : "none"
}

function appearEasing(e: any): string {
    if (Array.isArray(e)) return `cubic-bezier(${e.join(",")})`
    if (e === "linear") return "linear"
    if (e === "easeIn") return "cubic-bezier(0.42,0,1,1)"
    if (e === "easeInOut") return "cubic-bezier(0.42,0,0.58,1)"
    return "cubic-bezier(0,0,0.58,1)" // easeOut default
}

// Build a WAAPI animation per appear-def element from the published
// definitions and hand it to onCreate (running). Shared by the autoplay
// replay (stragglers) and the paused preplay (transition arm).
function buildAppearAnimations(
    skip: Set<Element> | null,
    onCreate: (el: Element, anim: any) => void
) {
    try {
        const w: any = window
        const defsEl = w.__framer__appearAnimationsContent
        if (!defsEl || !defsEl.text) return
        const defs = JSON.parse(defsEl.text)
        let hash: string | undefined
        try {
            const bps = JSON.parse(w.__framer__breakpoints.text)
            const m = bps.find(
                (b: any) =>
                    b.mediaQuery && window.matchMedia(b.mediaQuery).matches
            )
            if (m) hash = m.hash
        } catch (e) {}
        for (const id in defs) {
            try {
                const def = defs[id]
                const variant =
                    (hash && def[hash]) ||
                    def.default ||
                    def[Object.keys(def)[0]]
                if (!variant || !variant.initial || !variant.animate) continue
                const el = document.querySelector(
                    `[data-framer-appear-id="${id}"]`
                )
                if (!el) continue
                if (skip && skip.has(el)) continue
                const animate = variant.animate
                const from = variant.initial
                const t = animate.transition || {}
                const kfFrom: any = {}
                const kfTo: any = {}
                if (
                    from.opacity !== undefined &&
                    from.opacity !== animate.opacity
                ) {
                    kfFrom.opacity = String(from.opacity)
                    kfTo.opacity = String(
                        animate.opacity === undefined ? 1 : animate.opacity
                    )
                }
                const tFrom = appearTransform(from)
                const tTo = appearTransform(animate)
                if (tFrom !== tTo) {
                    kfFrom.transform = tFrom
                    kfTo.transform = tTo
                }
                if (!Object.keys(kfFrom).length) continue
                const anim = (el as HTMLElement).animate([kfFrom, kfTo], {
                    duration: Math.max(1, (t.duration || 0.8) * 1000),
                    delay: (t.delay || 0) * 1000,
                    easing: appearEasing(t.ease),
                    fill: "both",
                })
                // cancel on finish so the element's own styles (and hover
                // effects) take back over cleanly
                anim.onfinish = () => {
                    try {
                        anim.cancel()
                    } catch (e) {}
                }
                onCreate(el, anim)
            } catch (e) {}
        }
    } catch (e) {}
}

// Restart appear effects immediately (boot path + release stragglers).
// Dispatches ONE "pt:reveal" so custom code components restart their intros.
function replayAppearEffects(skip?: Set<Element>) {
    try {
        window.dispatchEvent(new CustomEvent("pt:reveal"))
    } catch (e) {}
    if (reducedMotion()) return
    buildAppearAnimations(skip || null, () => {})
}

if (typeof window !== "undefined") {
    // The SSR'd boot script calls this at swipe start (see installScript).
    ;(window as any).__ptReplayAppear = replayAppearEffects
    if (isPlayPath(window.location.pathname)) {
        setPlayBlank(true)
        releasePlayBlankWhenSettled(null)
    }
}

function isVtAnim(a: any): boolean {
    try {
        const pe = a.effect && (a.effect as any).pseudoElement
        return !!pe && pe.indexOf("::view-transition") === 0
    } catch (e) {
        return false
    }
}

// Arm the appear system for a transition arrival. Preplays every appear-def
// element paused at frame zero (pinning it at its initial state for the
// whole slide), freezes any other just-started entrance animations, then
// releases everything at sheet-land (releaseAfterMs) — with the transition's
// finished promise, an :active-view-transition poll, and a 4s timeout as
// fallbacks. Nav-subtree animations are finished instantly (the nav has its
// own VT group). Single-armed via sdHoldActive.
function holdAppearAnimations(
    until: Promise<any> | null,
    releaseAfterMs?: number
) {
    if (!sdHoldAppear || reducedMotion()) return
    if (sdHoldActive) return // a hold is already running for this arrival
    const d: any = document
    if (typeof d.getAnimations !== "function") return
    sdHoldActive = true
    const held: any[] = []
    const heldEls = new Set<Element>()
    const seen = new Set<any>()
    let released = false

    // Pause every playing video for the duration of the transition — video
    // decode is the main main-thread cost stuttering the slide on heavy
    // case studies. Videos mounted mid-slide are caught by the collect
    // ticks below; everything recorded resumes at release.
    const pausedVideos: any[] = []
    const pauseVideos = () => {
        try {
            document.querySelectorAll("video").forEach((v: any) => {
                try {
                    if (!v.paused && !v.ended) {
                        v.pause()
                        pausedVideos.push(v)
                    }
                } catch (e) {}
            })
        } catch (e) {}
    }
    pauseVideos()

    // PREPLAY: create the replay animations now, paused at frame zero.
    const preplayed: any[] = []
    const preplayEls = new Set<Element>()
    buildAppearAnimations(null, (el, anim) => {
        try {
            anim.pause()
            anim.currentTime = 0
        } catch (e) {}
        preplayed.push(anim)
        preplayEls.add(el)
        seen.add(anim) // never re-collected by the hold below
    })

    const collect = () => {
        if (released) return
        pauseVideos()
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
    const iv = window.setInterval(collect, 150)

    let navEls: Element[] = []
    try {
        navEls = Array.from(document.querySelectorAll(sdNavSelector))
    } catch (e) {}
    const inNav = (el: any) =>
        !!el && navEls.some((n) => n === el || (n.contains && n.contains(el)))

    const release = () => {
        if (released) return
        released = true
        sdHoldActive = false
        window.clearInterval(iv)
        const playAll = (list: any[]) => {
            for (let i = 0; i < list.length; i++) {
                const a: any = list[i]
                try {
                    if (inNav(a.effect && a.effect.target)) a.finish()
                    else a.play()
                } catch (e) {
                    try {
                        a.play()
                    } catch (e2) {}
                }
            }
        }
        playAll(preplayed)
        playAll(held)
        for (let i = 0; i < pausedVideos.length; i++) {
            try {
                const p = pausedVideos[i].play()
                if (p && p.catch) p.catch(() => {})
            } catch (e) {}
        }
        // Stragglers the arm missed (e.g. elements that mounted after the
        // preplay pass) restart from their initial state; single pt:reveal.
        const skipUnion = new Set<Element>()
        heldEls.forEach((el) => skipUnion.add(el))
        preplayEls.forEach((el) => skipUnion.add(el))
        replayAppearEffects(skipUnion)
    }

    // Primary: release mid-slide (RELEASE_AT of the duration), during the
    // sheet's deceleration — content is visibly animating as it lands, so a
    // light page never reads as a blank flash; identical on every page/path.
    if (typeof releaseAfterMs === "number" && releaseAfterMs > 0) {
        window.setTimeout(release, releaseAfterMs)
    }
    if (until && typeof until.then === "function") {
        until.then(release, release)
    } else if (!(typeof releaseAfterMs === "number" && releaseAfterMs > 0)) {
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
        const arrivingAtPlay = isPlayPath(window.location.pathname)
        if (arrivingAtPlay) setPlayBlank(true)
        if (e && e.viewTransition) {
            holdAppearAnimations(e.viewTransition.finished, Math.round(sdDuration * RELEASE_AT))
            if (arrivingAtPlay) releasePlayBlankWhenSettled(e.viewTransition.finished)
        } else if (arrivingAtPlay) {
            releasePlayBlankWhenSettled(null)
        }
    })
}

// ------------------------------------------------------- same-document path

function onClickCapture(e: MouseEvent) {
    if (sdSynth) return // our own re-dispatched click — let it through
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

    // Swallow the original click completely: the router must not start
    // swapping DOM before the old page is captured (that race painted a
    // one-frame snippet of the destination before the transition). The
    // click is re-fired inside the update callback, after the capture.
    e.preventDefault()
    e.stopImmediatePropagation()

    const goingToPlay = isPlayPath(url.pathname)
    if (goingToPlay) setPlayBlank(true)
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

    const dest = url.href
    let fired = false
    const fire = () => {
        if (fired) return
        fired = true
        try {
            sdSynth = true
            if (a.isConnected) a.click()
            else window.location.assign(dest)
        } catch (err) {
            try {
                window.location.assign(dest)
            } catch (err2) {}
        } finally {
            sdSynth = false
        }
        // If neither the router nor native navigation took the click
        // (e.g. a listener swallowed it), navigate directly.
        window.setTimeout(() => {
            try {
                if (window.location.href === fromHref)
                    window.location.assign(dest)
            } catch (err) {}
        }, 1200)
    }

    let contentReady = false
    let vt: any = null
    let holdStarted = false
    let pendingHoldStart = false
    const startIncomingHold = () => {
        if (holdStarted) return
        if (!vt) {
            pendingHoldStart = true
            return
        }
        pendingHoldStart = false
        holdStarted = true
        // Sheet animation starts ~90ms after this arm (the commit buffer
        // below), so the land timer accounts for it.
        holdAppearAnimations(
            vt.finished,
            Math.round(sdDuration * RELEASE_AT) + 90
        )
    }

    // NOTE: rendering is paused during the update callback, so timers (not
    // rAF) drive the polling. Timers and MutationObserver still run.
    vt = d.startViewTransition(
        () =>
            new Promise<void>((resolve) => {
                // Old state is captured by now — hand the click to the
                // router (or native navigation) with the screen frozen.
                fire()
                const t0 = Date.now()
                const poll = () => {
                    const urlChanged = window.location.href !== fromHref
                    const rendered = mutated || document.title !== fromTitle
                    if (urlChanged && rendered) {
                        contentReady = true
                        // New nav may have mounted — keep names unique
                        // before the new-state capture.
                        dedupeNavNames(sdNavSelector)
                        // Arm the global appear hold before resolving the
                        // update callback so incoming load-ins are frozen
                        // before the browser captures the new state.
                        startIncomingHold()
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
    if (pendingHoldStart) startIncomingHold()
    const settle = () => {
        sdActive = false
        if (mo) {
            try {
                mo.disconnect()
            } catch (err) {}
        }
        if (goingToPlay) releasePlayBlank()
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
                    // The incoming appear hold was armed before the new-state
                    // capture, so nothing should start until the sheet lands.
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

	${FRAMER_EDITORBAR_SELECTOR} {
	    display: none !important;
	    visibility: hidden !important;
	    pointer-events: none !important;
	}

	#${BOOT_LABEL_ID} {
	    font-family: "GT Standard L Regular", "GT Standard L Regular Placeholder", "GT Standard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
	    font-size: 30px !important;
	    line-height: 120% !important;
	    font-weight: 400 !important;
	    letter-spacing: -0.01em !important;
	}

	@media (max-width: 1199px) {
	    #${BOOT_LABEL_ID} {
	        font-size: 24px !important;
	    }
	}

	@media (max-width: 809px) {
	    #${BOOT_LABEL_ID} {
	        font-size: 19px !important;
	    }
	}

	html[${PLAY_FORCE_BLANK_ATTR}="true"] [data-playground-root="true"] [data-playground-gallery="true"] {
    opacity: 0 !important;
    pointer-events: none !important;
    transition: none !important;
}
html[${PLAY_FORCE_BLANK_ATTR}="true"] [data-playground-root="true"] [data-playground-card="true"] {
    opacity: 0 !important;
    pointer-events: none !important;
    transition: none !important;
}
html:not([${PLAY_FORCE_BLANK_ATTR}="true"]) [data-playground-root="true"] [data-playground-card="true"] {
    transition-property: opacity, transform !important;
    transition-duration: ${PLAY_CARD_FADE_MS}ms, ${PLAY_CARD_TRANSFORM_MS}ms !important;
    transition-timing-function: ${PLAY_CARD_EASE}, ${PLAY_CARD_EASE} !important;
}
html[${PLAY_FORCE_BLANK_ATTR}="true"] [data-playground-root="true"] {
    background: ${PLAY_BLANK_COLOR} !important;
    cursor: default !important;
}

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
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(-${drift}vh); opacity: ${dimB}; }
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
// qualifying home entries, runs the first-boot loader before hydration.
function installScript(css: string, boot: BootCfg): string {
    const bootColor = String(boot.color).replace(COLOR_RE, "")
    const barColor = String(boot.barColor).replace(COLOR_RE, "")
    const playBlankJs =
        "try{var __ptp=location.pathname.replace(/\\/+$/,'')||'/';if(__ptp===" +
        JSON.stringify(PLAY_PATH) +
        "){document.documentElement.setAttribute('" +
        PLAY_FORCE_BLANK_ATTR +
        "','true');setTimeout(function(){try{document.documentElement.removeAttribute('" +
        PLAY_FORCE_BLANK_ATTR +
        "')}catch(e){}}," +
        PLAY_DIRECT_BLANK_SAFETY_MS +
        ")}}catch(e){}"
    // Zita-style gating: in Auto mode, play only on home reloads and fresh
    // home entries (no referrer or external referrer); skip non-home route
    // reloads, internal-link arrivals (the page transition owns those),
    // back/forward traversals, and prerender passes.
    const homeFn =
        "function __ptHome(){try{" +
        "return (location.pathname.replace(/\\/+$/,'')||'/')===" +
        JSON.stringify(HOME_PATH) +
        "}catch(e){return false}}"
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
          (boot.auto
              ? "if(__ptHome()&&__ptFresh())__ptBoot();"
              : "if(__ptHome())__ptBoot();") +
          "}" +
          "}catch(e){}" +
          homeFn +
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
          'var m=document.createElement("div");' +
          'm.id="' +
          BOOT_LABEL_ID +
          '";' +
          "m.textContent=" +
          JSON.stringify(BOOT_LABEL) +
          ";" +
          'm.style.cssText="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:32px;text-align:center;color:' +
          barColor +
          ';white-space:normal;will-change:opacity;";' +
          "w.appendChild(b);" +
          "w.appendChild(m);" +
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
          'm.style.transition="opacity ' +
          BOOT_LABEL_FADE_MS +
          "ms " +
          LOADER_EASE +
          '";' +
          'm.style.opacity="0";' +
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
        playBlankJs +
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
        // "once" (legacy value, now titled Auto) = home entries/reloads only;
        // "always" = every home document load.
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
        sdDuration = duration

        dedupeNavNames(navSelector)

        // Cross-document arrival fallback: if the module evaluated after
        // pagereveal already fired, a transition may be running right now.
        // Also release /play's pre-paint blank on direct refreshes now that
        // the full boot curtain is intentionally home-only.
        const onPlayPath = isPlayPath(window.location.pathname)
        if (enabled && holdAppear) {
            let active = false
            try {
                active = document.documentElement.matches(
                    ":active-view-transition"
                )
            } catch (e) {}
            if (active) holdAppearAnimations(null)
        }
        if (enabled && onPlayPath) releasePlayBlankWhenSettled(null)

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
        duration,
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
