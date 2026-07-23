// @ts-nocheck
import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import PageTransitionV712 from "https://framerusercontent.com/modules/kWINdCIvJNyHW4g36u2k/Witnbh97hqwtM7YLb8Op/PageTransition.js"
import ParagraphPrettyWrap from "https://framer.com/m/ParagraphPrettyWrap-bvfOg4.js"

const HOME_PATH = "/"
const BOOT_ID = "__pt-boot"
const BOOT_LABEL_ID = "__pt-boot-label"
const BOOT_VIEWPORT_STYLE_ID = "mh-boot-viewport-guard"
const BOOT_VIEWPORT_GLOBAL_KEY = "__mhBootViewportGuardInit"
const BOOT_VIEWPORT_OVERSCAN_PX = 240
const HOME_HEADER_BOTTOM_SELECTOR = '[data-framer-name="Header Bottom"]'
const HOME_HEADER_BOTTOM_APPEAR_SELECTOR = `${HOME_HEADER_BOTTOM_SELECTOR} [data-framer-appear-id]`
const HOME_HEADER_BOTTOM_STYLE_ID = "mh-home-header-bottom-appear-recovery"
const HOME_HEADER_BOTTOM_RECOVERY_MS = 5200
const HOME_HEADER_BOTTOM_RECOVERY_INTERVAL_MS = 80
const HISTORY_PATCH_KEY = "__mhHomeHeaderBottomHistoryPatched"
let homeHeaderBottomRecoveryCleanup = null

const BOOT_VIEWPORT_GUARD_JS = `(function(){try{if(window.${BOOT_VIEWPORT_GLOBAL_KEY})return;window.${BOOT_VIEWPORT_GLOBAL_KEY}=true;var BOOT_ID=${JSON.stringify(BOOT_ID)};var LABEL_ID=${JSON.stringify(BOOT_LABEL_ID)};var STYLE_ID=${JSON.stringify(BOOT_VIEWPORT_STYLE_ID)};var OVERSCAN=${BOOT_VIEWPORT_OVERSCAN_PX};function viewportHeight(){var d=document.documentElement;var vv=window.visualViewport;return Math.ceil(Math.max(window.innerHeight||0,d&&d.clientHeight||0,vv&&vv.height||0,1));}function ensureStyle(){var s=document.getElementById(STYLE_ID);if(!s){s=document.createElement("style");s.id=STYLE_ID;(document.head||document.documentElement).appendChild(s)}var css="#"+BOOT_ID+"{position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:auto!important;width:100vw!important;height:var(--mh-boot-height,calc(100vh + "+OVERSCAN+"px))!important;min-height:var(--mh-boot-height,calc(100vh + "+OVERSCAN+"px))!important;}#"+LABEL_ID+"{top:0!important;bottom:auto!important;height:var(--mh-boot-vvh,100vh)!important;min-height:var(--mh-boot-vvh,100vh)!important;}@supports (height: 100dvh){#"+BOOT_ID+"{height:var(--mh-boot-height,calc(100dvh + "+OVERSCAN+"px))!important;min-height:var(--mh-boot-height,calc(100dvh + "+OVERSCAN+"px))!important;}#"+LABEL_ID+"{height:var(--mh-boot-vvh,100dvh)!important;min-height:var(--mh-boot-vvh,100dvh)!important;}}";if(s.textContent!==css)s.textContent=css}function sync(){var visibleH=viewportHeight();var curtainH=visibleH+OVERSCAN;try{document.documentElement.style.setProperty("--mh-boot-vvh",visibleH+"px");document.documentElement.style.setProperty("--mh-boot-height",curtainH+"px")}catch(e){}ensureStyle();var boot=document.getElementById(BOOT_ID);if(boot){boot.style.setProperty("position","fixed","important");boot.style.setProperty("top","0","important");boot.style.setProperty("left","0","important");boot.style.setProperty("right","0","important");boot.style.setProperty("bottom","auto","important");boot.style.setProperty("width","100vw","important");boot.style.setProperty("height",curtainH+"px","important");boot.style.setProperty("min-height",curtainH+"px","important")}var label=document.getElementById(LABEL_ID);if(label){label.style.setProperty("top","0","important");label.style.setProperty("bottom","auto","important");label.style.setProperty("height",visibleH+"px","important");label.style.setProperty("min-height",visibleH+"px","important")}}sync();requestAnimationFrame(sync);setTimeout(sync,50);setTimeout(sync,250);window.addEventListener("resize",sync,{passive:true});window.addEventListener("orientationchange",sync,{passive:true});if(window.visualViewport){window.visualViewport.addEventListener("resize",sync,{passive:true});window.visualViewport.addEventListener("scroll",sync,{passive:true})}if(typeof MutationObserver!=="undefined"){new MutationObserver(sync).observe(document.documentElement,{childList:true,subtree:true})}}catch(e){}})();`

function viewportHeight() {
    try {
        const visualViewportHeight =
            typeof window.visualViewport !== "undefined"
                ? window.visualViewport.height
                : 0
        return Math.ceil(
            Math.max(
                window.innerHeight || 0,
                document.documentElement?.clientHeight || 0,
                visualViewportHeight || 0,
                1
            )
        )
    } catch (err) {
        return 1
    }
}

function ensureBootViewportStyle() {
    try {
        let style = document.getElementById(BOOT_VIEWPORT_STYLE_ID)
        if (!style) {
            const parent = document.head || document.documentElement
            style = document.createElement("style")
            style.id = BOOT_VIEWPORT_STYLE_ID
            parent.appendChild(style)
        }
        const css = `#${BOOT_ID}{position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:auto!important;width:100vw!important;height:var(--mh-boot-height,calc(100vh + ${BOOT_VIEWPORT_OVERSCAN_PX}px))!important;min-height:var(--mh-boot-height,calc(100vh + ${BOOT_VIEWPORT_OVERSCAN_PX}px))!important;}#${BOOT_LABEL_ID}{top:0!important;bottom:auto!important;height:var(--mh-boot-vvh,100vh)!important;min-height:var(--mh-boot-vvh,100vh)!important;}@supports (height: 100dvh){#${BOOT_ID}{height:var(--mh-boot-height,calc(100dvh + ${BOOT_VIEWPORT_OVERSCAN_PX}px))!important;min-height:var(--mh-boot-height,calc(100dvh + ${BOOT_VIEWPORT_OVERSCAN_PX}px))!important;}#${BOOT_LABEL_ID}{height:var(--mh-boot-vvh,100dvh)!important;min-height:var(--mh-boot-vvh,100dvh)!important;}}`
        if (style.textContent !== css) style.textContent = css
    } catch (err) {}
}

function syncBootViewport() {
    if (typeof window === "undefined") return

    const visibleHeight = viewportHeight()
    const curtainHeight = visibleHeight + BOOT_VIEWPORT_OVERSCAN_PX
    try {
        document.documentElement.style.setProperty(
            "--mh-boot-vvh",
            `${visibleHeight}px`
        )
        document.documentElement.style.setProperty(
            "--mh-boot-height",
            `${curtainHeight}px`
        )
    } catch (err) {}

    ensureBootViewportStyle()

    try {
        const boot = document.getElementById(BOOT_ID)
        if (!boot) return
        boot.style.setProperty("position", "fixed", "important")
        boot.style.setProperty("top", "0", "important")
        boot.style.setProperty("left", "0", "important")
        boot.style.setProperty("right", "0", "important")
        boot.style.setProperty("bottom", "auto", "important")
        boot.style.setProperty("width", "100vw", "important")
        boot.style.setProperty("height", `${curtainHeight}px`, "important")
        boot.style.setProperty(
            "min-height",
            `${curtainHeight}px`,
            "important"
        )
        const label = document.getElementById(BOOT_LABEL_ID)
        if (label) {
            label.style.setProperty("top", "0", "important")
            label.style.setProperty("bottom", "auto", "important")
            label.style.setProperty(
                "height",
                `${visibleHeight}px`,
                "important"
            )
            label.style.setProperty(
                "min-height",
                `${visibleHeight}px`,
                "important"
            )
        }
    } catch (err) {}
}

function installBootViewportGuard() {
    if (typeof window === "undefined") return
    try {
        if (window[BOOT_VIEWPORT_GLOBAL_KEY]) {
            syncBootViewport()
            return
        }
        window[BOOT_VIEWPORT_GLOBAL_KEY] = true

        syncBootViewport()
        window.requestAnimationFrame(syncBootViewport)
        window.setTimeout(syncBootViewport, 50)
        window.setTimeout(syncBootViewport, 250)
        window.addEventListener("resize", syncBootViewport, { passive: true })
        window.addEventListener("orientationchange", syncBootViewport, {
            passive: true,
        })
        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", syncBootViewport, {
                passive: true,
            })
            window.visualViewport.addEventListener("scroll", syncBootViewport, {
                passive: true,
            })
        }
        if (typeof MutationObserver !== "undefined") {
            new MutationObserver(syncBootViewport).observe(
                document.documentElement,
                { childList: true, subtree: true }
            )
        }
    } catch (err) {}
}

function useBootViewportGuard() {
    React.useEffect(() => {
        installBootViewportGuard()
    }, [])
}

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
// Index hero title rise. (Unchanged — see comments in git history.)
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
// Home hero on nav arrival — DOCUMENT-GLOBAL controller.
//
// SCOPE: acts ONLY on arrivals at "/" that came FROM a case-study page (the
// curtain-skipped leg). All other routes into home use the v7.12 curtain +
// holdAppear pipeline and must never be touched.
//
// STYLESHEET AUTHORITY (2026-07-14): Framer's appear on high-refresh
// machines is JS-driven inline style writes every rAF — an inline-style
// tug-of-war is a last-writer race the controller can lose on every painted
// frame (120Hz displays). The rise is therefore driven through a <style>
// sheet: author-stylesheet !important declarations beat plain inline styles
// UNCONDITIONALLY, so Framer's writes simply never apply while the sheet is
// active. Each target gets a data-mh-rise attribute; the sheet holds one
// rule per target, rewritten every animation frame. WAAPI animations (which
// sit above stylesheets in the cascade) are cancelled each frame as before.
//
// MONOTONIC RULE: pre-paint start (click-armed observer) plays the full
// choreography from geometric offsets (element height = mask park offset);
// late start resumes each element from its CURRENT offset (settled → pinned,
// no replay; mid-rise → continues upward). Downward motion is impossible.
//
// The guard never expires on a timer — it runs until the visitor navigates
// away from "/". Once risen, the hero stays put.
// ---------------------------------------------------------------------------
const HOME_HERO_HEADLINE_SELECTOR = '[data-framer-name="art"][data-framer-appear-id]'
const HOME_HERO_REGION_MAX_TOP = 860
const HOME_HERO_RISE_DURATION_MS = 1150
const HOME_HERO_STAGGER_MS = 110
const HOME_HERO_MAX_FROM_Y = 220
const HOME_HERO_MIN_RESUME_MS = 250
const HOME_HERO_RISE_ATTR = "data-mh-rise"
const HOME_HERO_RISE_STYLE_ID = "mh-hero-rise-style"
const HOME_SETTLE_INIT_KEY = "__mhHomeHeroSettleInit"
const HOME_SETTLE_MODE_KEY = "__mhHomeHeroSettleMode"
const HOME_SETTLE_BUSY_AT_KEY = "__mhHomeHeroSettleBusyAt"
const HOME_ARRIVAL_AT_KEY = "__mhArrivalAt"
const HOME_NAV_FROM_KEY = "__mhNavFromPath"
const HOME_CUR_PATH_KEY = "__mhCurPath"
const HOME_BUSY_EXPIRY_MS = 6000
const HOME_ARRIVAL_FRESH_MS = 2500
const HOME_PREPIN_TIMEOUT_MS = 4000
const CASE_STUDY_SOURCE_RE = /^\/case-studies(\/|$)/
let homeHeroRiseAt = 0
let prePinObserver = null
let prePinTimer = 0

function markArrival() {
    try {
        const w = window as any
        // Source = the last stable path (maintained by the watcher / init),
        // which at click time is the page the user is leaving.
        w[HOME_NAV_FROM_KEY] = w[HOME_CUR_PATH_KEY] || window.location.pathname
        w[HOME_ARRIVAL_AT_KEY] = Date.now()
    } catch (err) {}
}

function currentTranslateY(el) {
    try {
        return new DOMMatrix(getComputedStyle(el).transform).m42
    } catch (err) {
        return 0
    }
}

function clearRiseArtifacts() {
    try {
        const style = document.getElementById(HOME_HERO_RISE_STYLE_ID)
        if (style) style.remove()
    } catch (err) {}
    try {
        document
            .querySelectorAll("[" + HOME_HERO_RISE_ATTR + "]")
            .forEach((el) => el.removeAttribute(HOME_HERO_RISE_ATTR))
    } catch (err) {}
}

function ensureRiseStyleEl() {
    let style = document.getElementById(HOME_HERO_RISE_STYLE_ID)
    if (!style) {
        const parent = document.head || document.documentElement
        style = document.createElement("style")
        style.id = HOME_HERO_RISE_STYLE_ID
        parent.appendChild(style)
    }
    return style
}

// Every appear element in the hero region is a target, unconditionally.
// fresh=true: full choreography from the geometric park offset.
// fresh=false: resume from the element's CURRENT offset (monotonic — an
// element that is already up never comes back down).
function collectHomeHeroRisers(fresh) {
    const out = []
    let els
    try {
        els = Array.from(document.querySelectorAll("[data-framer-appear-id]"))
    } catch (err) {
        return out
    }
    let idx = 0
    els.forEach((el) => {
        try {
            if (el.closest("nav")) return
            if (el.closest(HOME_HEADER_BOTTOM_SELECTOR)) return
            const r = el.getBoundingClientRect()
            if (r.width <= 0 || r.height <= 0) return
            if (r.top > HOME_HERO_REGION_MAX_TOP) return
            const geomY = Math.min(
                Math.ceil(r.height) + 6,
                HOME_HERO_MAX_FROM_Y
            )
            const curY = Math.abs(currentTranslateY(el))
            let fromY, delayMs, durationMs
            if (fresh) {
                fromY = Math.min(
                    Math.max(curY, geomY),
                    HOME_HERO_MAX_FROM_Y
                )
                delayMs = idx * HOME_HERO_STAGGER_MS
                durationMs = HOME_HERO_RISE_DURATION_MS
            } else {
                // Resume from wherever the element is right now. Settled
                // elements (curY < 2) get fromY 0 = pin only, no replay.
                fromY = curY < 2 ? 0 : Math.min(curY, HOME_HERO_MAX_FROM_Y)
                delayMs = 0
                durationMs =
                    fromY <= 0
                        ? 0
                        : Math.max(
                              HOME_HERO_RISE_DURATION_MS * (fromY / geomY),
                              HOME_HERO_MIN_RESUME_MS
                          )
            }
            out.push({ el, fromY, durationMs, delayMs, idx })
            idx += 1
        } catch (err) {}
    })
    return out
}

function riseHomeHero(mode, fresh) {
    if (Date.now() - homeHeroRiseAt < 1800) return false
    const targets = collectHomeHeroRisers(fresh)
    if (!targets.length) return false
    homeHeroRiseAt = Date.now()
    const sessionStamp = homeHeroRiseAt
    const settle = mode === "settle"
    const startedAt = Date.now()
    const easeOutExpo = (p) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p))

    // Tag targets and drive them through a stylesheet: author-sheet
    // !important beats Framer's plain inline writes on every frame,
    // regardless of write order or display refresh rate.
    clearRiseArtifacts()
    targets.forEach((t) => {
        try {
            t.el.setAttribute(HOME_HERO_RISE_ATTR, String(t.idx))
        } catch (err) {}
    })

    let raf = 0
    const stopGuard = () => {
        if (raf) window.cancelAnimationFrame(raf)
        raf = 0
        clearRiseArtifacts()
    }

    const tick = () => {
        if (!isHomePath() || homeHeroRiseAt !== sessionStamp) {
            stopGuard()
            return
        }
        const now = Date.now()
        let css = ""
        targets.forEach((t) => {
            let y
            if (settle || t.fromY <= 0 || t.durationMs <= 0) {
                y = 0
            } else {
                const local = now - startedAt - t.delayMs
                if (local <= 0) y = t.fromY
                else if (local >= t.durationMs) y = 0
                else y = (1 - easeOutExpo(local / t.durationMs)) * t.fromY
            }
            const transform =
                Math.abs(y) < 0.1
                    ? "none"
                    : "perspective(1200px) translateY(" + y.toFixed(2) + "px)"
            css +=
                "[" +
                HOME_HERO_RISE_ATTR +
                '="' +
                t.idx +
                '"]{transform:' +
                transform +
                " !important;opacity:1 !important;transition:none !important;}"
            // WAAPI animations sit above stylesheets — cancel them.
            try {
                t.el.getAnimations().forEach((animation) => {
                    try {
                        if (!isViewTransitionAnimation(animation))
                            animation.cancel()
                    } catch (err) {}
                })
            } catch (err) {}
        })
        try {
            const style = ensureRiseStyleEl()
            if (style.textContent !== css) style.textContent = css
        } catch (err) {}
        raf = window.requestAnimationFrame(tick)
    }

    tick()
    return true
}

function stopPrePin() {
    try {
        if (prePinObserver) prePinObserver.disconnect()
    } catch (err) {}
    prePinObserver = null
    if (prePinTimer) window.clearTimeout(prePinTimer)
    prePinTimer = 0
}

// Armed at click time (case-study page, link targeting home). Fires as a
// microtask when the home DOM mounts — BEFORE the browser paints it — and
// pins the risers synchronously, so the settled hero can never flash.
function armPrePaintPin() {
    if (typeof window === "undefined") return
    if (typeof MutationObserver === "undefined") return
    stopPrePin()
    try {
        const w = window as any
        prePinObserver = new MutationObserver(() => {
            try {
                if (!isHomePath()) return
                const headline = document.querySelector(
                    HOME_HERO_HEADLINE_SELECTOR
                )
                if (!headline) return
                const mode = w[HOME_SETTLE_MODE_KEY] || "animate"
                if (riseHomeHero(mode, true)) stopPrePin()
            } catch (err) {}
        })
        prePinObserver.observe(document.documentElement, {
            childList: true,
            subtree: true,
        })
        prePinTimer = window.setTimeout(stopPrePin, HOME_PREPIN_TIMEOUT_MS)
    } catch (err) {}
}

function beginHomeHeroSettle() {
    if (typeof window === "undefined") return
    if (!isHomePath()) return
    const w = window as any
    // ONLY the curtain-skipped path: arrivals coming from a case study.
    if (!CASE_STUDY_SOURCE_RE.test(String(w[HOME_NAV_FROM_KEY] || ""))) return
    // Only on a real arrival (a recent nav / nav intent), never a cold load.
    const navAt = Number(w[HOME_ARRIVAL_AT_KEY] || 0)
    if (!(navAt > 0 && Date.now() - navAt < HOME_ARRIVAL_FRESH_MS)) return
    // Busy flag is a timestamp so a wedged run can never disable the
    // controller for the rest of the session.
    const busyAt = Number(w[HOME_SETTLE_BUSY_AT_KEY] || 0)
    if (busyAt && Date.now() - busyAt < HOME_BUSY_EXPIRY_MS) return
    w[HOME_SETTLE_BUSY_AT_KEY] = Date.now()

    let attempts = 0
    const done = () => {
        w[HOME_SETTLE_BUSY_AT_KEY] = 0
    }
    const poll = () => {
        try {
            attempts += 1
            if (!isHomePath()) return done()
            if (Date.now() - homeHeroRiseAt < 1800) return done()
            const mode = w[HOME_SETTLE_MODE_KEY] || "animate"
            const headline = document.querySelector(
                HOME_HERO_HEADLINE_SELECTOR
            )
            // Late path: monotonic resume — never a restart.
            if (headline && riseHomeHero(mode, false)) return done()
            // The poll is window-owned: no component unmount can cancel it.
            if (attempts < 240) window.setTimeout(poll, 16)
            else done()
        } catch (err) {
            done()
        }
    }
    poll()
}

function initHomeHeroSettleController() {
    if (typeof window === "undefined") return
    const w = window as any
    if (w[HOME_SETTLE_INIT_KEY]) return
    w[HOME_SETTLE_INIT_KEY] = true
    w[HOME_CUR_PATH_KEY] = window.location.pathname

    const onArrive = () => {
        window.setTimeout(beginHomeHeroSettle, 0)
    }

    window.addEventListener("pt:reveal", onArrive)
    window.addEventListener("popstate", onArrive)
    window.addEventListener("mh:locationchange", onArrive)

    // Primary signal: an internal link click records the SOURCE path and
    // stamps nav intent BEFORE the router even processes the navigation.
    // If the click leaves a case study for home, also arm the pre-paint pin.
    try {
        document.addEventListener(
            "click",
            (e) => {
                try {
                    const a =
                        e.target && e.target.closest
                            ? e.target.closest("a[href]")
                            : null
                    if (!a) return
                    const href = a.getAttribute("href") || ""
                    if (/^(https?:)?\/\//.test(href)) {
                        if (a.host && a.host !== window.location.host) return
                    }
                    if (/^(mailto:|tel:|#)/.test(href)) return
                    markArrival()
                    try {
                        const destPath = (a.pathname || "").replace(/\/+$/, "") || "/"
                        if (
                            destPath === HOME_PATH &&
                            CASE_STUDY_SOURCE_RE.test(
                                window.location.pathname
                            )
                        ) {
                            armPrePaintPin()
                        }
                    } catch (err) {}
                } catch (err) {}
            },
            true
        )
    } catch (err) {}

    // Fallback: a lightweight pathname watcher. Records the source path on
    // any change (covers browser back too). Initialized with the cold-load
    // path, so a first document load never registers a change.
    try {
        window.setInterval(() => {
            try {
                const p = window.location.pathname
                if (p !== w[HOME_CUR_PATH_KEY]) {
                    const at = Number(w[HOME_ARRIVAL_AT_KEY] || 0)
                    if (!(at && Date.now() - at < 1500)) {
                        markArrival()
                    }
                    w[HOME_CUR_PATH_KEY] = p
                    window.setTimeout(beginHomeHeroSettle, 0)
                } else {
                    w[HOME_CUR_PATH_KEY] = p
                }
            } catch (err) {}
        }, 150)
    } catch (err) {}
}

function useHomeHeroRise(mode) {
    if (typeof window !== "undefined") {
        try {
            ;(window as any)[HOME_SETTLE_MODE_KEY] =
                mode === "settle" ? "settle" : "animate"
        } catch (err) {}
    }
    React.useEffect(() => {
        initHomeHeroSettleController()
        // Also check on mount: if this instance mounted as part of a nav
        // arrival at "/", the arrival stamp (usually from the link click)
        // is still fresh and the headline may just have appeared.
        if (typeof window !== "undefined") {
            window.setTimeout(beginHomeHeroSettle, 0)
        }
    }, [])
}

/**
 * PageTransition
 *
 * Active rollback to the exact PageTransition v7.12 module that was live before
 * the v7.13 pinned-nav experiment, plus a narrow Home Header Bottom recovery
 * and a document-global "home hero on case-study arrival" controller: pre-paint
 * pin, monotonic (never-downward) choreography driven through a stylesheet
 * (beats Framer's inline writes on any refresh rate), hold-until-navigation
 * guard; case-study → home navigations only.
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function PageTransition(props) {
    useBootViewportGuard()
    useHomeHeaderBottomReveal()
    useIndexHeadingRiseOnArrival()
    useHomeHeroRise(props.homeArrivalMode)
    return (
        <>
            <script
                dangerouslySetInnerHTML={{ __html: BOOT_VIEWPORT_GUARD_JS }}
            />
            <ParagraphPrettyWrap enabled={true} maxFontSize={23} minWords={2} />
            <PageTransitionV712 {...props} />
        </>
    )
}

addPropertyControls(PageTransition, {
    enabled: {
        type: ControlType.Boolean,
        title: "Enabled",
        defaultValue: true,
    },
    homeArrivalMode: {
        type: ControlType.Enum,
        title: "Home arrival",
        defaultValue: "animate",
        options: ["animate", "settle"],
        optionTitles: ["Animate", "Settle"],
        displaySegmentedControl: true,
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
