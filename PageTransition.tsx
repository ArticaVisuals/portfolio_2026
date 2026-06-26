// @ts-nocheck
import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import PageTransitionV712 from "https://framerusercontent.com/modules/kWINdCIvJNyHW4g36u2k/Witnbh97hqwtM7YLb8Op/PageTransition.js"

// NOTE (2026-06-26): This file is the LIVE Framer code file `gmalnRr`
// (`PageTransition.tsx`). It is a THIN WRAPPER that imports the compiled v7.12
// runtime module from framerusercontent.com and layers on three custom
// behaviours: (1) Home Header Bottom appear recovery, (2) the /index hero title
// rise-on-arrival, and (3) the home hero rise-on-arrival. The full v7.12 runtime
// SOURCE (the ~2100-line integrated file that compiles to the imported module)
// is preserved alongside as `PageTransition.runtime-backup.tsx`.

const HOME_PATH = "/"
const HOME_HEADER_BOTTOM_SELECTOR = '[data-framer-name="Header Bottom"]'
const HOME_HEADER_BOTTOM_APPEAR_SELECTOR = `${HOME_HEADER_BOTTOM_SELECTOR} [data-framer-appear-id]`
const HOME_HEADER_BOTTOM_STYLE_ID = "mh-home-header-bottom-appear-recovery"
const HOME_HEADER_BOTTOM_RECOVERY_MS = 5200
const HOME_HEADER_BOTTOM_RECOVERY_INTERVAL_MS = 80
const HISTORY_PATCH_KEY = "__mhHomeHeaderBottomHistoryPatched"
let homeHeaderBottomRecoveryCleanup = null

function isHomePath() {
    try {
        const path = window.location.pathname.replace(/\/+$/, "") || "/"
        return path === HOME_PATH
    } catch (err) {
        return false
    }
}

function removeHomeHeaderBottomRecoveryStyle() {
    try {
        const style = document.getElementById(HOME_HEADER_BOTTOM_STYLE_ID)
        if (style) style.remove()
    } catch (err) {}
}

function ensureHomeHeaderBottomRecoveryStyle() {
    if (!isHomePath()) {
        removeHomeHeaderBottomRecoveryStyle()
        return
    }

    try {
        let style = document.getElementById(HOME_HEADER_BOTTOM_STYLE_ID)
        if (!style) {
            const parent =
                document.head || document.documentElement || document.body
            if (!parent) return
            style = document.createElement("style")
            style.id = HOME_HEADER_BOTTOM_STYLE_ID
            parent.appendChild(style)
        }

        style.textContent = `${HOME_HEADER_BOTTOM_APPEAR_SELECTOR}{opacity:1!important;transform:none!important;visibility:visible!important;}`
    } catch (err) {}
}

function getHomeHeaderBottomAppearEls() {
    if (!isHomePath()) return []
    try {
        return Array.from(
            document.querySelectorAll(HOME_HEADER_BOTTOM_APPEAR_SELECTOR)
        )
    } catch (err) {
        return []
    }
}

function isViewTransitionAnimation(animation) {
    try {
        const pseudo = animation.effect && animation.effect.pseudoElement
        return !!pseudo && pseudo.indexOf("::view-transition") === 0
    } catch (err) {
        return false
    }
}

function revealHomeHeaderBottomAppearEls() {
    if (!isHomePath()) {
        removeHomeHeaderBottomRecoveryStyle()
        return
    }

    ensureHomeHeaderBottomRecoveryStyle()

    const els = getHomeHeaderBottomAppearEls()
    if (!els.length) return
    els.forEach((el) => {
        try {
            el.getAnimations().forEach((animation) => {
                try {
                    if (!isViewTransitionAnimation(animation))
                        animation.cancel()
                } catch (err) {}
            })
        } catch (err) {}
        try {
            el.style.setProperty("opacity", "1", "important")
            el.style.setProperty("transform", "none", "important")
            el.style.setProperty("visibility", "visible", "important")
        } catch (err) {}
    })
}

function startHomeHeaderBottomRecovery() {
    if (typeof window === "undefined") return

    try {
        if (homeHeaderBottomRecoveryCleanup) homeHeaderBottomRecoveryCleanup()
    } catch (err) {}
    homeHeaderBottomRecoveryCleanup = null

    if (!isHomePath()) {
        removeHomeHeaderBottomRecoveryStyle()
        return
    }

    let stopped = false
    let raf = 0
    let interval = 0
    let observer = null
    const startedAt = Date.now()

    const stop = () => {
        if (stopped) return
        stopped = true
        if (raf) window.cancelAnimationFrame(raf)
        if (interval) window.clearInterval(interval)
        try {
            if (observer) observer.disconnect()
        } catch (err) {}
        if (homeHeaderBottomRecoveryCleanup === stop) {
            homeHeaderBottomRecoveryCleanup = null
        }
    }

    const tick = () => {
        if (stopped) return
        if (!isHomePath()) {
            stop()
            removeHomeHeaderBottomRecoveryStyle()
            return
        }

        revealHomeHeaderBottomAppearEls()

        if (Date.now() - startedAt < HOME_HEADER_BOTTOM_RECOVERY_MS) {
            raf = window.requestAnimationFrame(tick)
        }
    }

    const observe = () => {
        try {
            const root = document.body || document.documentElement
            if (!root || typeof MutationObserver === "undefined") return
            let pending = false
            observer = new MutationObserver(() => {
                if (pending || stopped) return
                pending = true
                window.requestAnimationFrame(() => {
                    pending = false
                    revealHomeHeaderBottomAppearEls()
                })
            })
            observer.observe(root, {
                subtree: true,
                childList: true,
                attributes: true,
                attributeFilter: ["style", "class"],
            })
        } catch (err) {}
    }

    revealHomeHeaderBottomAppearEls()
    raf = window.requestAnimationFrame(tick)
    interval = window.setInterval(() => {
        if (Date.now() - startedAt > HOME_HEADER_BOTTOM_RECOVERY_MS) {
            stop()
            return
        }
        revealHomeHeaderBottomAppearEls()
    }, HOME_HEADER_BOTTOM_RECOVERY_INTERVAL_MS)
    observe()

    homeHeaderBottomRecoveryCleanup = stop
}

function patchHistoryForHomeHeaderBottomRecovery() {
    try {
        if (window[HISTORY_PATCH_KEY]) return
        window[HISTORY_PATCH_KEY] = true

        const notify = () => {
            window.setTimeout(() => {
                try {
                    ;(window as any).__ptRevealedAt = Date.now()
                    window.dispatchEvent(new CustomEvent("pt:reveal"))
                } catch (err) {}
            }, 0)
        }

        const pushState = history.pushState
        const replaceState = history.replaceState
        history.pushState = function (...args) {
            const result = pushState.apply(this, args)
            notify()
            return result
        }
        history.replaceState = function (...args) {
            const result = replaceState.apply(this, args)
            notify()
            return result
        }
    } catch (err) {}
}

function useHomeHeaderBottomReveal() {
    React.useEffect(() => {
        if (typeof window === "undefined") return

        patchHistoryForHomeHeaderBottomRecovery()

        const restore = () => startHomeHeaderBottomRecovery()
        restore()

        window.addEventListener("pageshow", restore)
        window.addEventListener("popstate", restore)
        window.addEventListener("hashchange", restore)
        window.addEventListener("pt:reveal", restore)
        window.addEventListener("mh:locationchange", restore)
        return () => {
            window.removeEventListener("pageshow", restore)
            window.removeEventListener("popstate", restore)
            window.removeEventListener("hashchange", restore)
            window.removeEventListener("pt:reveal", restore)
            window.removeEventListener("mh:locationchange", restore)
            try {
                if (homeHeaderBottomRecoveryCleanup)
                    homeHeaderBottomRecoveryCleanup()
            } catch (err) {}
            homeHeaderBottomRecoveryCleanup = null
            removeHomeHeaderBottomRecoveryStyle()
        }
    }, [])
}

// ---------------------------------------------------------------------------
// Index hero title rise.
//
// The "Index" hero title is a native Framer element that DOES mount fast on a
// same-document /index nav (~100ms, during the slide). The reason it read as
// "late" is v7.12's data-pt-index-heading-hold: it pins the title at
// translateY(115%) through the slide and only releases it to Framer's native
// appear AFTER the view transition ends — so the title rose after the curtain.
// We instead drive the rise ourselves the moment the title mounts, so it is on
// its way up DURING the slide like the home / info titles. Framer's late native
// appear keeps trying to re-pin the title, and it overrides a plain WAAPI/CSS
// transition, so the rise is a MANUAL animation: a setInterval ticks ~60fps,
// cancels Framer's appear, and re-writes the eased transform with !important
// every tick (Framer can't win because we overwrite every frame), ending pinned
// at the final position. Chromium same-document /index navs only (detected via
// v7.12's data-pt-index-heading-hold arm).
// ---------------------------------------------------------------------------
const INDEX_HEADING_HOLD_ATTR = "data-pt-index-heading-hold"
const INDEX_HEADING_SELECTOR = '[data-framer-name="Index"][data-framer-appear-id]'
const INDEX_HEADING_RISE_FROM_PCT = 115
const INDEX_HEADING_REVEAL_DURATION_MS = 760

function revealIndexHeading() {
    const startedAt = Date.now()

    const tick = () => {
        const elapsed = Date.now() - startedAt
        const t = Math.min(1, elapsed / INDEX_HEADING_REVEAL_DURATION_MS)
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3)
        const y = (1 - eased) * INDEX_HEADING_RISE_FROM_PCT
        const transform =
            t >= 1
                ? "none"
                : "perspective(1200px) translateY(" + y.toFixed(2) + "%)"

        let els
        try {
            els = Array.from(
                document.querySelectorAll(INDEX_HEADING_SELECTOR)
            )
        } catch (err) {
            els = []
        }
        els.forEach((el) => {
            // Cancel Framer's late native appear so it can't fight us.
            try {
                el.getAnimations().forEach((animation) => {
                    try {
                        if (!isViewTransitionAnimation(animation))
                            animation.cancel()
                    } catch (err) {}
                })
            } catch (err) {}
            try {
                el.style.setProperty("transition", "none", "important")
                el.style.setProperty("transform", transform, "important")
                el.style.setProperty("opacity", "1", "important")
            } catch (err) {}
        })
        try {
            document.documentElement.removeAttribute(INDEX_HEADING_HOLD_ATTR)
        } catch (err) {}
    }

    tick()
    const iv = window.setInterval(tick, 16)
    // Keep enforcing a touch past the end so a late re-render still lands final.
    window.setTimeout(() => {
        tick()
        window.clearInterval(iv)
    }, INDEX_HEADING_REVEAL_DURATION_MS + 250)
    return true
}

function useIndexHeadingRiseOnArrival() {
    React.useEffect(() => {
        if (typeof window === "undefined") return

        let pollTimer = 0
        let observer = null
        let busy = false

        const begin = () => {
            if (busy) return
            busy = true
            let attempts = 0
            const poll = () => {
                attempts += 1
                if (document.querySelector(INDEX_HEADING_SELECTOR)) {
                    revealIndexHeading()
                    busy = false
                    return
                }
                if (attempts < 360) {
                    pollTimer = window.setTimeout(poll, 16)
                } else {
                    busy = false
                }
            }
            poll()
        }

        try {
            observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (
                        mutation.attributeName === INDEX_HEADING_HOLD_ATTR &&
                        document.documentElement.getAttribute(
                            INDEX_HEADING_HOLD_ATTR
                        ) === "true"
                    ) {
                        begin()
                    }
                }
            })
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: [INDEX_HEADING_HOLD_ATTR],
            })
        } catch (err) {}

        if (
            document.documentElement.getAttribute(INDEX_HEADING_HOLD_ATTR) ===
            "true"
        ) {
            begin()
        }

        return () => {
            try {
                if (observer) observer.disconnect()
            } catch (err) {}
            window.clearTimeout(pollTimer)
            busy = false
        }
    }, [])
}

// ---------------------------------------------------------------------------
// Home hero rise.
//
// Same problem as the index title, on the other side: arriving at "/" via a
// page transition, Framer parks the home hero appear elements (the "Micah
// Hoang" headline at translateY(110px), the tagline at ~90px, etc.) and only
// plays their upward rise AFTER the slide — so the headline reads as coming in
// late. We replay the rise ourselves, on time, by reading each element's own
// published appear-def (so the motion + stagger match the home design) and
// driving the transform manually, cancelling Framer's late appear every frame.
// Fires only on a real nav arrival at "/", never the first cold load; skips the
// nav and the Header Bottom recovery zone to avoid fighting other handlers.
// ---------------------------------------------------------------------------
const HOME_HERO_HEADLINE_SELECTOR = '[data-framer-name="art"][data-framer-appear-id]'
const HOME_HERO_REGION_MAX_TOP = 860
const HOME_HERO_DEFAULT_DURATION_MS = 1400
let homeHeroRiseAt = 0

function readAppearDefs() {
    try {
        const raw = (window as any).__framer__appearAnimationsContent
        if (typeof raw === "string" && raw) return JSON.parse(raw)
    } catch (err) {}
    return null
}

function currentTranslateY(el) {
    try {
        return new DOMMatrix(getComputedStyle(el).transform).m42
    } catch (err) {
        return 0
    }
}

function collectHomeHeroRisers() {
    const defs = readAppearDefs()
    const out = []
    let els
    try {
        els = Array.from(document.querySelectorAll("[data-framer-appear-id]"))
    } catch (err) {
        return out
    }
    els.forEach((el) => {
        try {
            if (el.closest("nav")) return
            if (el.closest(HOME_HEADER_BOTTOM_SELECTOR)) return
            const r = el.getBoundingClientRect()
            if (r.width <= 0 || r.top > HOME_HERO_REGION_MAX_TOP) return
            const curY = currentTranslateY(el)
            const id = el.getAttribute("data-framer-appear-id")
            const def = defs && id && defs[id] && defs[id].default
            const initY = def && def.initial ? Number(def.initial.y) || 0 : 0
            // Only elements that rise and are still parked below their final
            // spot. With no defs, fall back to "currently offset downward".
            if (Math.abs(curY) < 2 && initY === 0) return
            const fromY = Math.abs(curY) >= 2 ? curY : initY
            if (fromY <= 0) return
            const tr = def && def.animate ? def.animate.transition : null
            out.push({
                el,
                fromY,
                durationMs:
                    tr && tr.duration
                        ? tr.duration * 1000
                        : HOME_HERO_DEFAULT_DURATION_MS,
                delayMs: tr && tr.delay ? tr.delay * 1000 : 0,
            })
        } catch (err) {}
    })
    return out
}

function riseHomeHero() {
    if (Date.now() - homeHeroRiseAt < 1800) return false
    const targets = collectHomeHeroRisers()
    if (!targets.length) return false
    homeHeroRiseAt = Date.now()
    const startedAt = Date.now()
    const easeOutExpo = (p) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p))
    let maxEnd = 0
    targets.forEach((t) => {
        if (t.delayMs + t.durationMs > maxEnd) maxEnd = t.delayMs + t.durationMs
    })
    maxEnd += 250

    const tick = () => {
        const now = Date.now()
        targets.forEach((t) => {
            const local = now - startedAt - t.delayMs
            let y
            if (local <= 0) y = t.fromY
            else if (local >= t.durationMs) y = 0
            else y = (1 - easeOutExpo(local / t.durationMs)) * t.fromY
            try {
                t.el.getAnimations().forEach((animation) => {
                    try {
                        if (!isViewTransitionAnimation(animation))
                            animation.cancel()
                    } catch (err) {}
                })
            } catch (err) {}
            try {
                t.el.style.setProperty("transition", "none", "important")
                t.el.style.setProperty(
                    "transform",
                    Math.abs(y) < 0.1
                        ? "none"
                        : "perspective(1200px) translateY(" +
                              y.toFixed(2) +
                              "px)",
                    "important"
                )
                t.el.style.setProperty("opacity", "1", "important")
            } catch (err) {}
        })
    }

    tick()
    const iv = window.setInterval(tick, 16)
    window.setTimeout(() => {
        tick()
        window.clearInterval(iv)
    }, maxEnd)
    return true
}

function useHomeHeroRise() {
    React.useEffect(() => {
        if (typeof window === "undefined") return

        let pollTimer = 0
        let busy = false

        const begin = () => {
            if (busy) return
            if (!isHomePath()) return
            // Only on a real page-transition arrival (a recent nav), never the
            // first cold load — Framer's appear plays fine on a fresh document.
            const navAt = Number((window as any).__ptRevealedAt || 0)
            if (!(navAt > 0 && Date.now() - navAt < 2500)) return
            busy = true
            let attempts = 0
            const poll = () => {
                attempts += 1
                const headline = document.querySelector(
                    HOME_HERO_HEADLINE_SELECTOR
                )
                if (headline && Math.abs(currentTranslateY(headline)) >= 2) {
                    riseHomeHero()
                    busy = false
                    return
                }
                if (attempts < 180 && isHomePath()) {
                    pollTimer = window.setTimeout(poll, 16)
                } else {
                    busy = false
                }
            }
            poll()
        }

        const onArrive = () => {
            window.setTimeout(begin, 0)
        }

        window.addEventListener("pt:reveal", onArrive)
        window.addEventListener("popstate", onArrive)
        window.addEventListener("pageshow", onArrive)
        window.addEventListener("mh:locationchange", onArrive)
        return () => {
            window.removeEventListener("pt:reveal", onArrive)
            window.removeEventListener("popstate", onArrive)
            window.removeEventListener("pageshow", onArrive)
            window.removeEventListener("mh:locationchange", onArrive)
            window.clearTimeout(pollTimer)
            busy = false
        }
    }, [])
}

/**
 * PageTransition
 *
 * Active rollback to the exact PageTransition v7.12 module that was live before
 * the v7.13 pinned-nav experiment, plus a narrow Home Header Bottom recovery,
 * the /index hero title rise-on-arrival, and the home hero rise-on-arrival.
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function PageTransition(props) {
    useHomeHeaderBottomReveal()
    useIndexHeadingRiseOnArrival()
    useHomeHeroRise()
    return <PageTransitionV712 {...props} />
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
    skipCaseStudyTransitions: {
        type: ControlType.Boolean,
        title: "Case studies",
        defaultValue: true,
        enabledTitle: "Skip",
        disabledTitle: "Animate",
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
        hidden: (p) => !p.firstBoot,
    },
    bootColor: {
        type: ControlType.Color,
        title: "Boot color",
        defaultValue: "#233324",
        hidden: (p) => !p.firstBoot,
    },
    barColor: {
        type: ControlType.Color,
        title: "Bar color",
        defaultValue: "#F7F5F0",
        hidden: (p) => !p.firstBoot,
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
        hidden: (p) => !p.firstBoot,
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
        hidden: (p) => !p.firstBoot,
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
        hidden: (p) => !p.firstBoot,
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
        hidden: (p) => !p.firstBoot,
    },
    barHold: {
        type: ControlType.Number,
        title: "Bar hold",
        defaultValue: 0.86,
        min: 0.1,
        max: 1,
        step: 0.01,
        displayStepper: true,
        hidden: (p) => !p.firstBoot,
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
        hidden: (p) => !p.firstBoot,
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
        hidden: (p) => !p.firstBoot,
    },
})

PageTransition.displayName = "PageTransition"
