// @ts-nocheck
import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

// Site-wide page transition (zitafernandez.com-style). v7.12 — dual-path View
// Transitions + first-boot loader + appear-effect restart + /play blank-hold
// + case-study bypass + load-time PREFETCH of native legs (NO prerender —
// see the speculation-rules block for the hard-won why).
//
// v7.12 — /index hero heading hold on the SAME-DOCUMENT path. home -> /index
// is a router (same-document) nav: no new document loads, so the SSR install
// script never runs there and Framer never re-fires the heading's load-in
// appear. The hero "Index" heading (data-framer-appear-id, data-framer-name
// "Index") therefore painted at its final state instantly while the rest of
// the page was held — "Index comes in way too early / no animation". Fix:
// arm the existing data-pt-index-heading-hold CSS pin at click time for
// /index router navs (the previously-dead goingToIndex branch), so the
// heading is held through the slide, then released back to Framer's native
// appear owner so the title is not animated by two systems.
//
// NAV-MODE MAP (live-probed 2026-06-12): Framer's router takes untrusted
// re-fired clicks on its own Link components (nav links → SPA), but its
// global anchor listener is trusted-only, so custom DOM anchors (the
// Selected Work cards) fall through to NATIVE navigation; case-study exits
// are native too (lightbox click-guard). Native legs ride the cross-doc
// @view-transition, but v7.9 deliberately opts case-study legs OUT of page
// transitions because that surface is too hydration/media heavy to animate
// reliably. Case-study navigation is now plain browser/Framer navigation.
//
// NAVIGATION — Framer's published runtime navigates internal links TWO
// ways: its SPA router (history.pushState) and real cross-document loads
// (e.g. on case-study pages where the lightbox click-guard stops the
// router's listener). @view-transition CSS covers the cross-document path;
// a module-scope capture listener wraps router clicks in
// document.startViewTransition(). v7.4 restores v7.1's DETERMINISTIC
// OLD-CAPTURE (v7.2 had reverted it and the pre-transition flash of the
// blank destination came back on warm caches, where the router can swap
// the DOM before the browser snapshots the old page): the original click
// is swallowed (preventDefault + stopImmediatePropagation) and re-fired
// via anchor.click() INSIDE the update callback — after the old capture,
// with rendering frozen. The serialization cost is ~one frame; the flash
// it prevents is far worse. Router pages take the re-fired click as
// pushState; guard pages fall through to native nav + the cross-doc VT;
// a 1.2s href-unchanged fallback assigns directly. Both paths share the
// same ::view-transition-* pseudo-elements: the outgoing page dims and
// drifts up while the ACTUAL incoming page slides up over it as a sheet;
// the nav (its own transition group) swipes out and back in.
//
// APPEAR-EFFECT SYSTEM (one motion system):
// 1. PREPLAY AT ARM — when a transition arms, the replay animations for
//    every appear-def element are created immediately, PAUSED at frame
//    zero. WAAPI overrides Framer Motion's inline styles, so SPA mount
//    animations can never show final-state content inside the moving sheet
//    (the old "already visible, then re-animates" jump).
// 2. RELEASE MID-SLIDE — held + preplayed animations play at RELEASE_AT
//    (~40%, v7.4; was 55%) of the slide duration, early in the sheet's
//    deceleration. Frame analysis showed the sheet sliding for ~450ms as a
//    completely blank cream surface at 55% — long enough to read as a
//    white flash on case studies. Home re-entry is still the exception:
//    the big "Micah Hoang" hero reveal and nearby rules use longer Framer
//    appear timings, so home releases even earlier and caps those replay
//    timings so the hero does not lag behind the rest of the page.
// 3. Framer's startOptimizedAppearAnimation no-ops post-hydration-handoff
//    (verified live), so all replay animations are built directly from the
//    published defs (__framer__appearAnimationsContent) with el.animate().
//    Each release dispatches ONE "pt:reveal" CustomEvent for custom code
//    components (e.g. the /play views). /play additionally gets a
//    force-blank hold on its gallery while transitioning in.
//
// SMOOTHNESS — compositor-only properties everywhere: the old-page dim is
// an opacity fade over the dark ::view-transition backdrop (not a filter);
// the hold's collection poll runs at 150ms; and every playing video is
// paused while a transition runs — video decode was the main main-thread
// cost stuttering the slide into heavy case studies — and resumed only
// when the transition fully ENDS (v7.2; resuming at the mid-slide release
// caused a decode burst that janked the slide's deceleration). v7.4 also
// WARMS IMAGE DECODE during the hold (img.decode() on appear-held
// subtrees + video posters): releasing dozens of opacity-0 images at once
// forced a raster/decode burst that stalled the compositor ~70ms right at
// the release moment — decoding them while the sheet is still covered
// makes the release start on time. The appear-defs JSON is parsed once
// per page, not on every replay pass.
//
// FIRST BOOT — the SSR'd script injects a curtain + top progress bar before
// hydration, waits for window.load (bounded), then swipes up. "Auto" mode
// plays it only on home direct entries/reloads and skips other route reloads,
// internal-link arrivals, and back/forward (route + navigation timing type +
// same-origin referrer).

const STYLE_ID = "__pt-vt-style"
const CASE_BYPASS_STYLE_ID = "__pt-case-study-vt-bypass"
const BOOT_ID = "__pt-boot"
const PAGE_EASE = "cubic-bezier(0.6, 0, 0.18, 1)" // softer entry, silkier landing
const RELEASE_AT = 0.4 // load-ins start at this fraction of the slide (v7.4: 0.55 left the sheet blank too long)
const HOME_RELEASE_AT = 0.22 // home hero has long masked reveals; start it earlier on re-entry
const SAME_DOC_COMMIT_BUFFER_MS = 90
const TYPE_REVEAL_MIN_Y = 70
const TYPE_REVEAL_MIN_DURATION_S = 1
const TYPE_REVEAL_DELAY_S = 0.09
const TYPE_REVEAL_STAGGER_S = 0.09
const TYPE_REVEAL_DURATION_S = 0.9
const TYPE_REVEAL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)"
const TYPE_REVEAL_DIRECT_REPLAY_MS = 40
const SAME_DOC_REPLAY_SUPPRESS_MS = 5000
const HOME_FADE_DELAY_S = 0.14
const HOME_FADE_DURATION_S = 0.45
const INDEX_HEADING_HOLD_ATTR = "data-pt-index-heading-hold"
const INDEX_HEADING_PATH_RELEASE_DELAY_MS = 140
const INDEX_HEADING_SELECTOR =
    '[data-framer-name="Index"][data-framer-appear-id]'
const INDEX_HEADING_HIDDEN_TRANSFORM = "perspective(1200px) translateY(115%)"
const INDEX_LOCAL_MASK_CLASS = "idx-mask-reveal-text"
const HOME_HEADER_BOTTOM_SELECTOR = '[data-framer-name="Header Bottom"]'
const HOME_HEADER_BOTTOM_RESTORE_DELAYS = [60, 240, 700, 1400, 3200]
const SAME_DOC_HOLD_CAPTURE_BUFFER_MS = 24
const NAV_EASE = "cubic-bezier(0.22, 1, 0.36, 1)" // measured nav spring feel
const LOADER_EASE = "cubic-bezier(0.65, 0.01, 0.05, 0.99)" // Zita's loader
const NAV_NAME = "__pt-nav"
const Z = 2147483600
const COLOR_RE = /[<>"'\\{}]/g
const BOOT_LABEL = "Micah Hoang ©2026"
const BOOT_LABEL_ID = "__pt-boot-label"
const BOOT_LABEL_FADE_MS = 260
const HOME_PATH = "/"
const INDEX_PATH = "/index"
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
let sdSkipCaseStudyTransitions = true
let sdActive = false
let sdHoldActive = false
let sdDuration = 700
let sdSynth = false // re-dispatched click in flight (see onClickCapture)
let sdDefsText = ""
let sdDefs: any = null // parsed appear defs, cached per published page
let indexHeadingRevealToken = 0
let indexHeadingPathReleaseTimer = 0
let indexHeadingPathReleasePollTimer = 0

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

function isHomePath(pathname: string): boolean {
    return normPath(pathname) === HOME_PATH
}

function isIndexPath(pathname: string): boolean {
    return normPath(pathname) === INDEX_PATH
}

function isCaseStudyPath(pathname: string): boolean {
    const path = normPath(pathname)
    return path === "/case-studies" || path.indexOf("/case-studies/") === 0
}

function isCaseStudyUrl(value: unknown): boolean {
    if (typeof value !== "string" || !value) return false
    try {
        return isCaseStudyPath(new URL(value, window.location.href).pathname)
    } catch (e) {
        return false
    }
}

function pageswapDestinationIsCaseStudy(e: any): boolean {
    try {
        const activation = e && e.activation
        return [
            activation && activation.entry && activation.entry.url,
            activation && activation.to && activation.to.url,
            activation && activation.destination && activation.destination.url,
        ].some(isCaseStudyUrl)
    } catch (err) {
        return false
    }
}

function armCaseStudyTransitionBypass() {
    try {
        document.documentElement.setAttribute(
            "data-pt-case-study-transition",
            "off"
        )
        let s = document.getElementById(
            CASE_BYPASS_STYLE_ID
        ) as HTMLStyleElement | null
        if (!s) {
            s = document.createElement("style")
            s.id = CASE_BYPASS_STYLE_ID
            document.head.appendChild(s)
        }
        s.textContent = "@view-transition { navigation: none; }"
        window.setTimeout(() => {
            try {
                if (isCaseStudyPath(window.location.pathname)) return
                const current = document.getElementById(CASE_BYPASS_STYLE_ID)
                if (current && current.parentNode)
                    current.parentNode.removeChild(current)
                document.documentElement.removeAttribute(
                    "data-pt-case-study-transition"
                )
            } catch (err) {}
        }, 2500)
    } catch (err) {}
}

function transitionReleaseMs(duration: number, quickHomeReentry: boolean) {
    return Math.round(duration * (quickHomeReentry ? HOME_RELEASE_AT : RELEASE_AT))
}

function markSameDocumentTransition() {
    try {
        ;(window as any).__ptSameDocumentTransitionUntil =
            Date.now() + SAME_DOC_REPLAY_SUPPRESS_MS
    } catch (e) {}
}

function hasRecentSameDocumentTransition(): boolean {
    try {
        const until = Number((window as any).__ptSameDocumentTransitionUntil || 0)
        return Number.isFinite(until) && until > Date.now()
    } catch (e) {
        return false
    }
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

function typeRevealHiddenTransform(from: any): string {
    return appearTransform({ ...(from || {}), y: "115%" })
}

function appearEasing(e: any): string {
    if (Array.isArray(e)) return `cubic-bezier(${e.join(",")})`
    if (e === "linear") return "linear"
    if (e === "easeIn") return "cubic-bezier(0.42,0,1,1)"
    if (e === "easeInOut") return "cubic-bezier(0.42,0,0.58,1)"
    return "cubic-bezier(0,0,0.58,1)" // easeOut default
}

interface AppearReplayOptions {
    quickHomeReentry?: boolean
    normalizeTypeReveals?: boolean
    onlyTypeReveals?: boolean
    skipIndexHeading?: boolean
    skipHomeHeaderBottom?: boolean
}

function isTypeReveal(from: any, duration: number): boolean {
    const initialY = Math.abs(Number((from && from.y) || 0))
    return initialY >= TYPE_REVEAL_MIN_Y && duration >= TYPE_REVEAL_MIN_DURATION_S
}

function appearTiming(
    t: any,
    from: any,
    options?: AppearReplayOptions,
    typeRevealIndex = 0
) {
    let delay = Number(t.delay || 0)
    let duration = Math.max(0.001, Number(t.duration || 0.8))
    const typeReveal = isTypeReveal(from, duration)
    if (options && options.normalizeTypeReveals && typeReveal) {
        delay = TYPE_REVEAL_DELAY_S + typeRevealIndex * TYPE_REVEAL_STAGGER_S
        duration = TYPE_REVEAL_DURATION_S
    } else if (options && options.quickHomeReentry) {
        if (delay >= 0.45 && duration <= 0.8) {
            delay = Math.min(delay, HOME_FADE_DELAY_S)
            duration = Math.min(duration, HOME_FADE_DURATION_S)
        }
    }
    return { delay, duration, typeReveal }
}

// Build a WAAPI animation per appear-def element from the published
// definitions and hand it to onCreate (running). Shared by the autoplay
// replay (stragglers) and the paused preplay (transition arm).
function buildAppearAnimations(
    skip: Set<Element> | null,
    onCreate: (el: Element, anim: any) => void,
    options?: AppearReplayOptions
) {
    try {
        const w: any = window
        const defsEl = w.__framer__appearAnimationsContent
        if (!defsEl || !defsEl.text) return
        if (defsEl.text !== sdDefsText) {
            sdDefsText = defsEl.text
            sdDefs = null // broken JSON must not leave the previous page's defs
            sdDefs = JSON.parse(defsEl.text)
        }
        const defs = sdDefs
        if (!defs) return
        let hash: string | undefined
        try {
            const bps = JSON.parse(w.__framer__breakpoints.text)
            const m = bps.find(
                (b: any) =>
                    b.mediaQuery && window.matchMedia(b.mediaQuery).matches
            )
            if (m) hash = m.hash
        } catch (e) {}
        let typeRevealIndex = 0
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
                if (
                    isIndexPath(window.location.pathname) &&
                    isIndexHeadingEl(el)
                )
                    continue
                if (options && options.skipIndexHeading && isIndexHeadingEl(el))
                    continue
                if (
                    options &&
                    options.skipHomeHeaderBottom &&
                    isHomeHeaderBottomAppearEl(el)
                )
                    continue
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
                const baseDuration = Math.max(0.001, Number(t.duration || 0.8))
                const typeReveal = isTypeReveal(from, baseDuration)
                if (options && options.onlyTypeReveals && !typeReveal) continue
                const tFrom =
                    options && options.normalizeTypeReveals && typeReveal
                        ? typeRevealHiddenTransform(from)
                        : appearTransform(from)
                const tTo = appearTransform(animate)
                if (tFrom !== tTo) {
                    kfFrom.transform = tFrom
                    kfTo.transform = tTo
                }
                if (!Object.keys(kfFrom).length) continue
                const timing = appearTiming(
                    t,
                    from,
                    options,
                    typeReveal ? typeRevealIndex++ : 0
                )
                if (options && options.onlyTypeReveals) {
                    try {
                        ;(el as HTMLElement)
                            .getAnimations()
                            .forEach((animation: any) => animation.cancel())
                    } catch (e) {}
                }
                const anim = (el as HTMLElement).animate([kfFrom, kfTo], {
                    duration: Math.max(1, timing.duration * 1000),
                    delay: timing.delay * 1000,
                    easing:
                        options && options.normalizeTypeReveals && timing.typeReveal
                            ? TYPE_REVEAL_EASE
                            : appearEasing(t.ease),
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
function replayAppearEffects(skip?: Set<Element>, options?: AppearReplayOptions) {
    try {
        window.dispatchEvent(new CustomEvent("pt:reveal"))
    } catch (e) {}
    if (reducedMotion()) return
    buildAppearAnimations(skip || null, () => {}, options)
}

function disarmIndexHeadingHold() {
    try {
        window.clearTimeout(indexHeadingPathReleaseTimer)
        window.clearTimeout(indexHeadingPathReleasePollTimer)
        indexHeadingPathReleaseTimer = 0
        indexHeadingPathReleasePollTimer = 0
        document.documentElement.removeAttribute(INDEX_HEADING_HOLD_ATTR)
    } catch (err) {}
}

function clearIndexHeadingHold() {
    disarmIndexHeadingHold()
    indexHeadingRevealToken++
}

function activeViewTransition(): boolean {
    try {
        return document.documentElement.matches(":active-view-transition")
    } catch (e) {
        return false
    }
}

function getIndexHeadingEls(): HTMLElement[] {
    try {
        return Array.from(
            document.querySelectorAll<HTMLElement>(INDEX_HEADING_SELECTOR)
        )
    } catch (err) {
        return []
    }
}

function isIndexHeadingEl(el: any): el is Element {
    try {
        return !!(
            el &&
            el instanceof Element &&
            el.matches &&
            el.matches(INDEX_HEADING_SELECTOR)
        )
    } catch (err) {
        return false
    }
}

function isHomeHeaderBottomAppearEl(el: any): el is HTMLElement {
    try {
        return !!(
            isHomePath(window.location.pathname) &&
            el &&
            el instanceof HTMLElement &&
            el.matches &&
            el.matches("[data-framer-appear-id]") &&
            el.closest &&
            el.closest(HOME_HEADER_BOTTOM_SELECTOR)
        )
    } catch (err) {
        return false
    }
}

// The Home header-bottom social/scroll/year items are persistent chrome, not
// page content. Letting the global appear replay own them can leave their
// nested Framer appear nodes parked at opacity .001 after history restores.
function getHomeHeaderBottomAppearEls(): HTMLElement[] {
    if (!isHomePath(window.location.pathname)) return []
    try {
        return Array.from(
            document.querySelectorAll<HTMLElement>(
                `${HOME_HEADER_BOTTOM_SELECTOR} [data-framer-appear-id]`
            )
        )
    } catch (err) {
        return []
    }
}

function revealHomeHeaderBottomAppearEls() {
    const els = getHomeHeaderBottomAppearEls()
    if (!els.length) return
    els.forEach((el) => {
        try {
            el.getAnimations().forEach((animation: any) => {
                try {
                    if (!isVtAnim(animation)) animation.cancel()
                } catch (err) {}
            })
        } catch (err) {}
        try {
            el.style.opacity = "1"
            el.style.transform = "none"
            el.style.visibility = "visible"
        } catch (err) {}
    })
}

function scheduleHomeHeaderBottomReveal() {
    if (!isHomePath(window.location.pathname)) return
    HOME_HEADER_BOTTOM_RESTORE_DELAYS.forEach((delay) => {
        window.setTimeout(revealHomeHeaderBottomAppearEls, delay)
    })
}

function releaseIndexHeadingHold(existingEls?: Iterable<Element>): Set<Element> {
    window.clearTimeout(indexHeadingPathReleaseTimer)
    window.clearTimeout(indexHeadingPathReleasePollTimer)
    indexHeadingPathReleaseTimer = 0
    indexHeadingPathReleasePollTimer = 0
    const els = new Set<Element>()
    const headingEls = existingEls
        ? Array.from(existingEls).filter(
              (el): el is HTMLElement => el instanceof HTMLElement
          )
        : getIndexHeadingEls()

    headingEls.forEach((el) => els.add(el))
    if (!isIndexPath(window.location.pathname)) {
        clearIndexHeadingHold()
        return els
    }
    if (!document.documentElement.hasAttribute(INDEX_HEADING_HOLD_ATTR)) {
        return els
    }
    // The Index heading already has a native Framer appear animation. This
    // release only removes the route-level CSS hold and returns the heading
    // as a skip target so the fallback replay system cannot animate it twice.
    clearIndexHeadingHold()
    return els
}

function scheduleIndexHeadingPathRelease(attempt = 0) {
    try {
        window.clearTimeout(indexHeadingPathReleasePollTimer)
        if (!isIndexPath(window.location.pathname)) {
            if (attempt > 160) return
            indexHeadingPathReleasePollTimer = window.setTimeout(
                () => scheduleIndexHeadingPathRelease(attempt + 1),
                50
            )
            return
        }
        if (!document.documentElement.hasAttribute(INDEX_HEADING_HOLD_ATTR)) {
            clearIndexHeadingHold()
            return
        }
        const headingEls = getIndexHeadingEls()
        if (!headingEls.length) {
            if (attempt > 160) return
            indexHeadingPathReleasePollTimer = window.setTimeout(
                () => scheduleIndexHeadingPathRelease(attempt + 1),
                50
            )
            return
        }
        if (headingEls.some((el) => el.getAnimations().length > 0)) {
            disarmIndexHeadingHold()
            return
        }
        if (sdHoldActive || activeViewTransition()) {
            if (attempt > 160) return
            indexHeadingPathReleasePollTimer = window.setTimeout(
                () => scheduleIndexHeadingPathRelease(attempt + 1),
                50
            )
            return
        }
        if (indexHeadingPathReleaseTimer) return
        indexHeadingPathReleaseTimer = window.setTimeout(() => {
            indexHeadingPathReleaseTimer = 0
            if (
                !isIndexPath(window.location.pathname) ||
                !document.documentElement.hasAttribute(INDEX_HEADING_HOLD_ATTR) ||
                sdHoldActive ||
                activeViewTransition()
            )
                return
            releaseIndexHeadingHold()
        }, INDEX_HEADING_PATH_RELEASE_DELAY_MS)
    } catch (err) {}
}

// Pin the hero "Index" heading hidden only for same-document router navs.
// Fresh /index documents rely on the normal appear/direct replay path; carrying
// this hold in the SSR install script was what let the title get stuck. On
// home -> /index, no new document loads, so the click path arms the hold until
// Framer's heading appear animation has been collected/released. The fallback
// release intentionally does not animate the heading; it only prevents a stuck
// hidden state and keeps the replay layer from owning the title twice.
function armIndexHeadingHold() {
    try {
        document.documentElement.setAttribute(INDEX_HEADING_HOLD_ATTR, "true")
        scheduleIndexHeadingPathRelease()
        window.setTimeout(() => {
            if (document.documentElement.hasAttribute(INDEX_HEADING_HOLD_ATTR)) {
                clearIndexHeadingHold()
            }
        }, 4000)
    } catch (err) {}
}

function normalizeIndexMaskDelay(delayMs: number): number {
    if (!Number.isFinite(delayMs)) return TYPE_REVEAL_DELAY_S * 1000
    if (delayMs < 100) return Math.max(delayMs, TYPE_REVEAL_DELAY_S * 1000)
    return TYPE_REVEAL_DELAY_S * 1000 + ((delayMs - 100) / 70) * 90
}

function normalizeIndexMaskKeyframes(keyframes: any) {
    if (!Array.isArray(keyframes) || !keyframes.length) return keyframes
    const first = keyframes[0]
    if (!first || typeof first !== "object" || !("transform" in first)) {
        return keyframes
    }
    return [
        { ...first, transform: "translate3d(0, 115px, 0)" },
        ...keyframes.slice(1),
    ]
}

function installIndexMaskRevealNormalizer() {
    try {
        const w: any = window
        if (w.__ptIndexMaskRevealNormalizer) return
        const proto: any = Element && Element.prototype
        const nativeAnimate = proto && proto.animate
        if (typeof nativeAnimate !== "function") return
        w.__ptIndexMaskRevealNormalizer = true
        proto.animate = function (keyframes: any, options?: any) {
            try {
                const el = this as Element
                if (
                    el &&
                    el.classList &&
                    el.classList.contains(INDEX_LOCAL_MASK_CLASS)
                ) {
                    const timing =
                        typeof options === "number"
                            ? { duration: options }
                            : { ...(options || {}) }
                    timing.duration = TYPE_REVEAL_DURATION_S * 1000
                    timing.delay = normalizeIndexMaskDelay(
                        Number(timing.delay || 0)
                    )
                    timing.easing = TYPE_REVEAL_EASE
                    return nativeAnimate.call(
                        this,
                        normalizeIndexMaskKeyframes(keyframes),
                        timing
                    )
                }
            } catch (err) {}
            return nativeAnimate.call(this, keyframes, options)
        }
    } catch (err) {}
}

function replayDirectTypeReveals() {
    if (sdActive || activeViewTransition() || hasRecentSameDocumentTransition()) {
        return
    }
    if (reducedMotion()) {
        clearIndexHeadingHold()
        return
    }
    const indexHeadingEls = new Set<Element>()
    if (isIndexPath(window.location.pathname)) {
        const headingEls = getIndexHeadingEls()
        headingEls.forEach((el) => indexHeadingEls.add(el))
        if (
            headingEls.length &&
            document.documentElement.hasAttribute(INDEX_HEADING_HOLD_ATTR)
        ) {
                releaseIndexHeadingHold(headingEls).forEach((el) =>
                indexHeadingEls.add(el)
            )
        }
    }
    try {
        window.dispatchEvent(new CustomEvent("pt:reveal"))
    } catch (err) {
    }
    try {
        buildAppearAnimations(indexHeadingEls, () => {}, {
            normalizeTypeReveals: true,
            onlyTypeReveals: true,
        })
    } catch (err) {
    } finally {
        if (!document.documentElement.hasAttribute(INDEX_HEADING_HOLD_ATTR)) {
            clearIndexHeadingHold()
        }
    }
}

if (typeof window !== "undefined") {
    installIndexMaskRevealNormalizer()
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
    releaseAfterMs?: number,
    options?: AppearReplayOptions
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

    // Pause every playing video for the WHOLE transition — video decode is
    // the main main-thread cost stuttering the slide on heavy case studies.
    // Videos mounted mid-slide are caught by a dedicated tick. Resume only
    // when the transition fully ends (finished promise / 4s safety) — NOT at
    // the mid-slide release, where a simultaneous decode burst would jank
    // the slide's deceleration.
    const pausedVideos: any[] = []
    let videosResumed = false
    const pauseVideosTick = () => {
        if (videosResumed) return
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
    pauseVideosTick()
    const vIv = window.setInterval(pauseVideosTick, 200)
    const resumeVideos = () => {
        if (videosResumed) return
        videosResumed = true
        window.clearInterval(vIv)
        for (let i = 0; i < pausedVideos.length; i++) {
            try {
                const p = pausedVideos[i].play()
                if (p && p.catch) p.catch(() => {})
            } catch (e) {}
        }
    }
    if (until && typeof until.then === "function") {
        until.then(resumeVideos, resumeVideos)
    }
    window.setTimeout(resumeVideos, 4000)

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
    }, options)

    // Warm raster caches while the sheet still covers the content: images
    // inside appear-held subtrees are at opacity 0, so the browser defers
    // their decode until the release makes them visible — dozens decoding
    // in one frame stalled the compositor ~70ms mid-slide. decode() is
    // async and off-main-thread; a second pass catches late mounts.
    const warmDecode = () => {
        try {
            const decodeImg = (im: any) => {
                try {
                    if (im && typeof im.decode === "function") {
                        const p = im.decode()
                        if (p && p.catch) p.catch(() => {})
                    }
                } catch (e) {}
            }
            preplayEls.forEach((root: any) => {
                try {
                    if (root.tagName === "IMG") decodeImg(root)
                    root.querySelectorAll("img").forEach(decodeImg)
                } catch (e) {}
            })
            document.querySelectorAll("video[poster]").forEach((v: any) => {
                try {
                    const src = v.getAttribute("poster")
                    if (!src) return
                    const im = new Image()
                    im.src = src
                    decodeImg(im)
                } catch (e) {}
            })
        } catch (e) {}
    }
    warmDecode()
    window.setTimeout(warmDecode, 180)

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
                const el = a.effect && a.effect.target
                if (
                    options &&
                    options.skipHomeHeaderBottom &&
                    isHomeHeaderBottomAppearEl(el)
                )
                    continue
                // Framer often has its own optimized appear animation running
                // on the same element we already preplayed. Cancel that
                // duplicate so stale native delays do not override the replay.
                if (el && preplayEls.has(el)) {
                    try {
                        a.cancel()
                    } catch (e) {}
                    continue
                }
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
        const indexHeadingReplayEls = new Set<Element>()
        if (document.documentElement.hasAttribute(INDEX_HEADING_HOLD_ATTR)) {
            preplayEls.forEach((el) => {
                if (isIndexHeadingEl(el)) indexHeadingReplayEls.add(el)
            })
            heldEls.forEach((el) => {
                if (isIndexHeadingEl(el)) indexHeadingReplayEls.add(el)
            })
        }
        const explicitIndexHeadingEls =
            document.documentElement.hasAttribute(INDEX_HEADING_HOLD_ATTR) &&
            !indexHeadingReplayEls.size
                ? releaseIndexHeadingHold()
                : new Set<Element>()
        if (indexHeadingReplayEls.size) {
            disarmIndexHeadingHold()
        }
        const playAll = (list: any[]) => {
            for (let i = 0; i < list.length; i++) {
                const a: any = list[i]
                try {
                    const target = a.effect && a.effect.target
                    if (target && explicitIndexHeadingEls.has(target)) {
                        a.cancel()
                    } else if (inNav(target)) a.finish()
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
        // Stragglers the arm missed (e.g. elements that mounted after the
        // preplay pass) restart from their initial state; single pt:reveal.
        const skipUnion = new Set<Element>()
        heldEls.forEach((el) => skipUnion.add(el))
        preplayEls.forEach((el) => skipUnion.add(el))
        indexHeadingReplayEls.forEach((el) => skipUnion.add(el))
        explicitIndexHeadingEls.forEach((el) => skipUnion.add(el))
        replayAppearEffects(skipUnion, options)
        if (options && options.skipHomeHeaderBottom) {
            scheduleHomeHeaderBottomReveal()
        }
    }

    // Primary: release mid-slide (RELEASE_AT of the duration), during the
    // sheet's deceleration — content is visibly animating as it lands, so a
    // light page never reads as a blank flash. Home uses the earlier
    // HOME_RELEASE_AT path because its masked hero reveal is much longer.
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
            if (!active) {
                release()
                resumeVideos()
            } else window.setTimeout(poll, 100)
        }
        window.setTimeout(poll, 100)
    }
    window.setTimeout(release, 4000) // hard safety
}

if (typeof window !== "undefined" && !(window as any).__ptHomeHeaderRevealBound) {
    ;(window as any).__ptHomeHeaderRevealBound = true
    window.addEventListener("pageshow", () => {
        scheduleHomeHeaderBottomReveal()
    })
    window.addEventListener("popstate", () => {
        scheduleHomeHeaderBottomReveal()
    })
    window.addEventListener("pt:reveal", () => {
        scheduleHomeHeaderBottomReveal()
    })
}

// Cross-document arrivals: pagereveal carries the ViewTransition object.
if (typeof window !== "undefined" && !(window as any).__ptRevealBound) {
    ;(window as any).__ptRevealBound = true
    window.addEventListener("pageswap", (e: any) => {
        if (!sdSkipCaseStudyTransitions || !e || !e.viewTransition) return
        if (
            isCaseStudyPath(window.location.pathname) ||
            pageswapDestinationIsCaseStudy(e)
        ) {
            try {
                e.viewTransition.skipTransition()
            } catch (err) {}
        }
    })
    window.addEventListener("pagereveal", (e: any) => {
        const arrivingAtPlay = isPlayPath(window.location.pathname)
        const arrivingAtCaseStudy = isCaseStudyPath(window.location.pathname)
        const quickHomeReentry = isHomePath(window.location.pathname)
        if (sdSkipCaseStudyTransitions && arrivingAtCaseStudy) return
        if (arrivingAtPlay) setPlayBlank(true)
        if (e && e.viewTransition) {
            holdAppearAnimations(
                e.viewTransition.finished,
                transitionReleaseMs(sdDuration, quickHomeReentry),
                {
                    quickHomeReentry,
                    normalizeTypeReveals: true,
                    skipHomeHeaderBottom: quickHomeReentry,
                }
            )
            if (quickHomeReentry) scheduleHomeHeaderBottomReveal()
            if (arrivingAtPlay) releasePlayBlankWhenSettled(e.viewTransition.finished)
        } else {
            if (quickHomeReentry) scheduleHomeHeaderBottomReveal()
            if (arrivingAtPlay) releasePlayBlankWhenSettled(null)
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
    const caseStudyLeg =
        sdSkipCaseStudyTransitions &&
        (isCaseStudyPath(window.location.pathname) ||
            isCaseStudyPath(url.pathname))
    if (caseStudyLeg) {
        armCaseStudyTransitionBypass()
        return
    }

    // Swallow the original click completely: the router must not start
    // swapping DOM before the old page is captured (that race painted a
    // flash of the blank destination before the transition — visible on
    // warm caches, where the destination chunk renders within the click
    // task). The click is re-fired inside the update callback, after the
    // capture, with rendering frozen.
    e.preventDefault()
    e.stopImmediatePropagation()
    markSameDocumentTransition()

    const goingToPlay = isPlayPath(url.pathname)
    const goingToHome = isHomePath(url.pathname)
    const goingToIndex = isIndexPath(url.pathname)
    if (goingToPlay) setPlayBlank(true)
    // Same-document nav to /index: pin the hero heading hidden NOW (before the
    // route subtree mounts) so it is held through the slide and revealed with
    // the rest of the page at release, matching /info. No SSR script runs on a
    // router nav, so this is the only place the hold gets armed for this path.
    if (goingToIndex && sdHoldAppear) armIndexHeadingHold()
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
            transitionReleaseMs(sdDuration, goingToHome) +
                SAME_DOC_HOLD_CAPTURE_BUFFER_MS,
            {
                quickHomeReentry: goingToHome,
                normalizeTypeReveals: true,
                skipIndexHeading: goingToIndex,
                skipHomeHeaderBottom: goingToHome,
            }
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
                        window.setTimeout(() => {
                            // New nav may have mounted — keep names unique
                            // before the new-state capture.
                            dedupeNavNames(sdNavSelector)
                            // Arm the global appear hold after the route commit
                            // and just before resolving the update callback, so
                            // incoming load-ins are frozen for the new-state
                            // capture without racing the destination DOM.
                            startIncomingHold()
                            window.setTimeout(
                                resolve,
                                SAME_DOC_HOLD_CAPTURE_BUFFER_MS
                            )
                        }, SAME_DOC_COMMIT_BUFFER_MS)
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
    navSelector: string,
    crossDocumentNavigation = true
): string {
    const dimB = Math.max(0, Math.min(1, 1 - dim))
    const navScoped = navSelector
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .join(", ")
    const crossDocumentRule = crossDocumentNavigation
        ? "@view-transition { navigation: auto; }"
        : "@view-transition { navigation: none; }"
    return `
${crossDocumentRule}

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

	html[${INDEX_HEADING_HOLD_ATTR}="true"] ${INDEX_HEADING_SELECTOR} {
	    transform: ${INDEX_HEADING_HIDDEN_TRANSFORM} !important;
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
function installScript(
    css: string,
    caseStudyCss: string,
    boot: BootCfg,
    skipCaseStudyTransitions: boolean
): string {
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
    const caseStudyPathJs =
        "function __ptCaseStudy(){try{var p=location.pathname.replace(/\\/+$/,'')||'/';return p==='/case-studies'||p.indexOf('/case-studies/')===0}catch(e){return false}}"
    const indexHeadingHoldJs = ""
    const caseStudyCssJs = skipCaseStudyTransitions
        ? caseStudyPathJs +
          "var __ptCaseOff=__ptCaseStudy();" +
          "try{if(__ptCaseOff)document.documentElement.setAttribute('data-pt-case-study-transition','off');else document.documentElement.removeAttribute('data-pt-case-study-transition')}catch(e){}"
        : "var __ptCaseOff=false;"
    const bootJs = !boot.enabled
        ? ""
        : "try{" +
          "if(!window.matchMedia||!matchMedia('(prefers-reduced-motion: reduce)').matches){" +
          "if(!window.__ptBootContextSeen){" +
          "window.__ptBootContextSeen=true;" +
          (boot.auto
              ? "if(__ptHome()&&__ptFresh())__ptBoot();"
              : "if(__ptHome())__ptBoot();") +
          "}" +
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
        "var __ptNormalCss=" +
        JSON.stringify(css) +
        ";" +
        "var __ptCaseCss=" +
        JSON.stringify(caseStudyCss) +
        ";" +
        caseStudyCssJs +
        "var c=__ptCaseOff?__ptCaseCss:__ptNormalCss;" +
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
        indexHeadingHoldJs +
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
    skipCaseStudyTransitions: boolean
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
        skipCaseStudyTransitions = true,
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
    const css = buildCss(duration, navDuration, drift, dim, navSelector, true)
    const caseStudyCss = buildCss(
        duration,
        navDuration,
        drift,
        dim,
        navSelector,
        false
    )
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
        sdSkipCaseStudyTransitions = skipCaseStudyTransitions
        sdDuration = duration

        dedupeNavNames(navSelector)

        // Cross-document arrival fallback: if the module evaluated after
        // pagereveal already fired, a transition may be running right now.
        // Also release /play's pre-paint blank on direct refreshes now that
        // the full boot curtain is intentionally home-only.
        const onPlayPath = isPlayPath(window.location.pathname)
        const onHomePath = isHomePath(window.location.pathname)
        const onIndexPath = isIndexPath(window.location.pathname)
        const skipCurrentCaseStudy =
            skipCaseStudyTransitions &&
            isCaseStudyPath(window.location.pathname)
        let active = false
        try {
            active = document.documentElement.matches(":active-view-transition")
        } catch (e) {}
        if (skipCurrentCaseStudy) {
            document.documentElement.setAttribute(
                "data-pt-case-study-transition",
                "off"
            )
        } else {
            document.documentElement.removeAttribute(
                "data-pt-case-study-transition"
            )
        }
        if (enabled && holdAppear && !skipCurrentCaseStudy) {
            if (active)
                holdAppearAnimations(null, undefined, {
                    quickHomeReentry: onHomePath,
                    normalizeTypeReveals: true,
                    skipIndexHeading: onIndexPath,
                    skipHomeHeaderBottom: onHomePath,
                })
        }
        if (onHomePath) scheduleHomeHeaderBottomReveal()
        if (
            enabled &&
            holdAppear &&
            (onHomePath || onIndexPath) &&
            !active &&
            !skipCurrentCaseStudy
        ) {
            window.setTimeout(replayDirectTypeReveals, TYPE_REVEAL_DIRECT_REPLAY_MS)
        } else if (!onIndexPath) {
            clearIndexHeadingHold()
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
            const desiredCss = skipCurrentCaseStudy ? caseStudyCss : css
            if (styleEl) {
                if (styleEl.textContent !== desiredCss)
                    styleEl.textContent = desiredCss
            } else {
                const s = document.createElement("style")
                s.id = STYLE_ID
                s.textContent = desiredCss
                document.head.appendChild(s)
            }
        }

        // PREFETCH internal pages (v7.7). Case-study navigations are real
        // document loads (custom card anchors + the lightbox click guard
        // bypass the SPA router), and the fetch gap between documents is
        // where the brief white flash before the swipe lives — Chrome only
        // paint-holds the old page for so long, and a cold fetch of a heavy
        // case-study document blows past it.
        //
        // PRERENDER IS DELIBERATELY NOT USED. v7.5/v7.6 tried it (it does
        // make activation instant and the cross-doc VT survives) but
        // Framer pages are hydration- and IntersectionObserver-dependent:
        // activating a prerender that has not finished hydrating slides in
        // a half-built page — scrambled Selected Work grid, footer rows
        // floating above the fold, white blocks behind the sheet (all
        // user-reported on published v7.6, reproduced on film). Prefetch
        // only caches the HTML response — no rendering, no side effects —
        // and with the document already cached, commit-to-first-paint is
        // short enough for paint-holding to bridge, which removes the
        // white gap. Flash-prone legs prefetch at load time (first clicks
        // were beating hover-triggered warming): from home, every
        // case-study card destination; from a case-study page, the four
        // nav destinations (every exit there is native because of the
        // lightbox guard) plus sibling case studies. Everything else
        // prefetches on hover. Unsupported browsers ignore the script.
        if (enabled && prefetch) {
            try {
                const HS: any = (window as any).HTMLScriptElement
                if (HS && HS.supports && HS.supports("speculationrules")) {
                    const path = normPath(window.location.pathname)
                    const rules: any = {
                        prefetch: [
                            {
                                where: { href_matches: "/*" },
                                eagerness: "moderate",
                            },
                        ],
                    }
                    if (!skipCaseStudyTransitions && isHomePath(path)) {
                        rules.prefetch.push({
                            where: { href_matches: "/case-studies/*" },
                            eagerness: "eager",
                        })
                    } else if (
                        !skipCaseStudyTransitions &&
                        path.indexOf("/case-studies/") === 0
                    ) {
                        rules.prefetch.push({
                            urls: ["/", "/index", "/play", "/info"],
                            eagerness: "immediate",
                        })
                        rules.prefetch.push({
                            where: { href_matches: "/case-studies/*" },
                            eagerness: "eager",
                        })
                    }
                    const desired = JSON.stringify(rules)
                    document
                        .querySelectorAll("script[data-pt-prerender]")
                        .forEach((old) => {
                            if (old.parentNode) old.parentNode.removeChild(old)
                        })
                    let s = document.querySelector(
                        "script[data-pt-prefetch]"
                    ) as HTMLScriptElement | null
                    // Speculation-rules scripts are immutable once inserted;
                    // remove + re-add to swap rule sets after an SPA nav.
                    if (s && s.text !== desired) {
                        if (s.parentNode) s.parentNode.removeChild(s)
                        s = null
                    }
                    if (!s) {
                        s = document.createElement("script")
                        s.type = "speculationrules"
                        ;(s as any).dataset.ptPrefetch = "1"
                        s.text = desired
                        document.head.appendChild(s)
                    }
                }
            } catch (e) {}
        }
    }, [
        enabled,
        prefetch,
        css,
        caseStudyCss,
        excludeSelector,
        navSelector,
        holdAppear,
        skipCaseStudyTransitions,
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
                        __html: installScript(
                            css,
                            caseStudyCss,
                            boot,
                            skipCaseStudyTransitions
                        ),
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
