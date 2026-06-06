import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

/**
 * Case Study Lightbox — a single, page-level Cargo-style media zoom.
 *
 * Drop ONE instance on a page. Event delegation + click-point hit testing opens
 * a full-screen lightbox for any content image/video, with a FLIP zoom, white
 * backdrop, GT Standard ‹ › × controls, keyboard nav, and touch swipe.
 *
 * Hardened against timing races (rapid open/close/open, interrupted zooms):
 * - Every deferred callback is token-guarded so a stale one can't clobber a
 *   newer session.
 * - Navigation shows the new media synchronously via showOnly() (single source
 *   of truth) — no deferred swap that could strand or double-render.
 * - Animations use fill:"none" so NO transform ever persists; the resting state
 *   is always the CSS-centered position. A short recenter watchdog enforces it.
 * - A window-level singleton guard ensures only one controller runs even if two
 *   instances render (e.g. a standalone + a Footer-embedded one).
 *
 * Runs only outside the Framer canvas. Test in Preview, not the editor.
 *
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */

type Config = {
    enabled: boolean
    lightboxVideos: boolean
    videoControls: boolean
    backgroundColor: string
    chromeColor: string
    iconWeight: number
    iconSize: number
    showArrows: boolean
    showClose: boolean
    showCounter: boolean
    clickImageAdvances: boolean
    loopNavigation: boolean
    duration: number
    viewportPadding: number
    minSize: number
    excludeSelector: string
}

type MediaType = "image" | "video"
type Candidate = { el: HTMLElement; type: MediaType; src: string; hires: string; poster: string; ratio: number }

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"
const Z = 2147483000
const GLYPH_FONT =
    '"GT Standard L Regular", "GT Standard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

function setStyles(el: HTMLElement, styles: Record<string, string>) {
    const t = el.style as unknown as Record<string, string>
    for (const k in styles) t[k] = styles[k]
}
function prefersReducedMotion(): boolean {
    return (
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
}
function largestFromSrcset(srcset: string): string {
    if (!srcset) return ""
    let best = "", bestW = -1
    for (const part of srcset.split(",")) {
        const seg = part.trim().split(/\s+/)
        const url = seg[0]; if (!url) continue
        const d = seg[1] || ""
        let w = 0
        if (d.endsWith("w")) w = parseInt(d, 10)
        else if (d.endsWith("x")) w = parseFloat(d) * 10000
        else w = 1
        if (w > bestW) { bestW = w; best = url }
    }
    return best
}
function buildCursorCSS(exclude: string): string {
    const rules: string[] = ["img,video{cursor:zoom-in!important}"]
    exclude.split(",").map((t) => t.trim()).filter(Boolean).forEach((t) => {
        const c = t === "a" || t === "button" ? "pointer" : "auto"
        rules.push(`${t}{cursor:${c}!important}`)
        rules.push(`${t} img,${t} video{cursor:${c}!important}`)
    })
    rules.push("[data-cslb-overlay] img{cursor:zoom-out!important}")
    rules.push("[data-cslb-overlay] video{cursor:auto!important}")
    return rules.join("")
}
function nextFrame(cb: () => void) {
    requestAnimationFrame(() => requestAnimationFrame(cb))
}
function canAnimate(el: Element): boolean {
    return typeof (el as HTMLElement).animate === "function"
}
function clearAnims(el: HTMLElement | null) {
    if (el && typeof el.getAnimations === "function") el.getAnimations().forEach((a) => a.cancel())
}

export default function CaseStudyLightbox(props: Config) {
    const configRef = React.useRef<Config>(props)
    configRef.current = props

    React.useEffect(() => {
        if (RenderTarget.current() === RenderTarget.canvas) return
        if (typeof document === "undefined" || typeof window === "undefined") return
        // Singleton: if another instance already owns the lightbox, bail.
        const W = window as unknown as Record<string, unknown>
        if (W.__cslbActive) return
        W.__cslbActive = true

        let overlay: HTMLDivElement | null = null
        let imgEl: HTMLImageElement | null = null
        let videoEl: HTMLVideoElement | null = null
        let prevBtn: HTMLButtonElement | null = null
        let nextBtn: HTMLButtonElement | null = null
        let closeBtn: HTMLButtonElement | null = null
        let counterEl: HTMLDivElement | null = null

        let list: Candidate[] = []
        let index = -1
        let isOpen = false
        let token = 0 // bumped on every open() AND close()
        let hiddenEl: HTMLElement | null = null
        let prevBodyOverflow = ""

        const cfg = () => configRef.current
        const padCSS = () => `clamp(20px, 5vw, ${cfg().viewportPadding}px)`

        const cursorStyle = document.createElement("style")
        cursorStyle.setAttribute("data-cslb-cursor", "")
        cursorStyle.textContent = buildCursorCSS(cfg().excludeSelector)
        document.head.appendChild(cursorStyle)

        // ---- Media inspection -------------------------------------------
        function srcOf(el: HTMLElement, type: MediaType) {
            if (type === "video") {
                const v = el as HTMLVideoElement
                const s = v.currentSrc || v.src || ""
                return { src: s, hires: s }
            }
            const img = el as HTMLImageElement
            const big = largestFromSrcset(img.srcset)
            const src = img.currentSrc || img.src || big
            return { src: src || big, hires: big || src }
        }
        function naturalRatio(el: HTMLElement, type: MediaType): number {
            if (type === "video") {
                const v = el as HTMLVideoElement
                if (v.videoWidth && v.videoHeight) return v.videoWidth / v.videoHeight
            } else {
                const img = el as HTMLImageElement
                if (img.naturalWidth && img.naturalHeight) return img.naturalWidth / img.naturalHeight
                const w = parseFloat(img.getAttribute("width") || "")
                const h = parseFloat(img.getAttribute("height") || "")
                if (w && h) return w / h
            }
            const r = el.getBoundingClientRect()
            return r.height > 0 ? r.width / r.height : 1
        }
        function typeOf(el: HTMLElement): MediaType | null {
            if (el.tagName === "IMG") return "image"
            if (el.tagName === "VIDEO") return "video"
            return null
        }
        function isExcluded(el: HTMLElement): boolean {
            if (el.closest("[data-no-lightbox]")) return true
            const sel = cfg().excludeSelector.trim()
            if (sel) { try { if (el.closest(sel)) return true } catch { /* bad selector */ } }
            return false
        }
        function qualifies(el: HTMLElement): boolean {
            if (overlay && overlay.contains(el)) return false
            const type = typeOf(el)
            if (!type) return false
            if (type === "video" && !cfg().lightboxVideos) return false
            if (isExcluded(el)) return false
            const r = el.getBoundingClientRect()
            const min = cfg().minSize
            if (r.width < min || r.height < min) return false
            return Boolean(srcOf(el, type).src)
        }
        function toCandidate(el: HTMLElement): Candidate | null {
            const type = typeOf(el); if (!type) return null
            const { src, hires } = srcOf(el, type); if (!src) return null
            const poster = type === "video" ? (el as HTMLVideoElement).poster || "" : ""
            return { el, type, src, hires, poster, ratio: naturalRatio(el, type) }
        }
        function collect(): Candidate[] {
            const out: Candidate[] = []
            const seen = new Set<HTMLElement>()
            document.querySelectorAll<HTMLElement>("img, video").forEach((el) => {
                if (seen.has(el) || !qualifies(el)) return
                const c = toCandidate(el); if (!c) return
                seen.add(el); out.push(c)
            })
            out.sort((a, b) => {
                const pos = a.el.compareDocumentPosition(b.el)
                if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1
                if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1
                return 0
            })
            return out
        }
        function resolveTarget(e: MouseEvent): HTMLElement | null {
            const direct = e.target as HTMLElement | null
            if (direct) {
                const via = (direct.closest("img") as HTMLElement | null) || (direct.closest("video") as HTMLElement | null)
                if (via && qualifies(via)) return via
            }
            if (typeof document.elementsFromPoint === "function") {
                for (const node of document.elementsFromPoint(e.clientX, e.clientY)) {
                    const el = node as HTMLElement
                    if (overlay && overlay.contains(el)) continue
                    const media = (el.closest("img") as HTMLElement | null) || (el.closest("video") as HTMLElement | null)
                    if (media && qualifies(media)) return media
                }
            }
            return null
        }

        // ---- Overlay construction ---------------------------------------
        function glyphButton(glyph: string, label: string, nudgeX: number): HTMLButtonElement {
            const btn = document.createElement("button")
            btn.type = "button"
            btn.setAttribute("aria-label", label)
            setStyles(btn, {
                position: "fixed", zIndex: String(Z + 2), display: "flex",
                alignItems: "center", justifyContent: "center", width: "40px", height: "40px",
                padding: "0", margin: "0", border: "none", background: "transparent",
                color: cfg().chromeColor, cursor: "pointer", opacity: "0",
                transition: "opacity 200ms ease", WebkitTapHighlightColor: "transparent",
            })
            const span = document.createElement("span")
            span.textContent = glyph
            span.setAttribute("aria-hidden", "true")
            setStyles(span, {
                fontFamily: GLYPH_FONT, fontSize: `${cfg().iconSize}px`, lineHeight: "1",
                fontWeight: String(cfg().iconWeight), display: "block",
                transform: `translate(${nudgeX}px, -1px)`,
            })
            btn.appendChild(span)
            return btn
        }
        function build() {
            overlay = document.createElement("div")
            overlay.setAttribute("data-cslb-overlay", "")
            setStyles(overlay, {
                position: "fixed", inset: "0", zIndex: String(Z), display: "none",
                alignItems: "center", justifyContent: "center", boxSizing: "border-box",
                padding: padCSS(), background: cfg().backgroundColor, cursor: "zoom-out",
                opacity: "0", overscrollBehavior: "contain",
            })
            const base: Record<string, string> = {
                display: "none", maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto",
                objectFit: "contain", transform: "none", transformOrigin: "center center",
                willChange: "transform, opacity", backfaceVisibility: "hidden",
                userSelect: "none", pointerEvents: "auto",
            }
            imgEl = document.createElement("img")
            imgEl.decoding = "async"; imgEl.draggable = false
            setStyles(imgEl, base)
            videoEl = document.createElement("video")
            videoEl.setAttribute("playsinline", "")
            videoEl.controls = false; videoEl.loop = true
            setStyles(videoEl, base)
            overlay.appendChild(imgEl); overlay.appendChild(videoEl)

            prevBtn = glyphButton("‹", "Previous", -1)
            nextBtn = glyphButton("›", "Next", 1)
            closeBtn = glyphButton("×", "Close", 0)
            prevBtn.style.left = "16px"; prevBtn.style.top = "50%"; prevBtn.style.transform = "translateY(-50%)"
            nextBtn.style.right = "16px"; nextBtn.style.top = "50%"; nextBtn.style.transform = "translateY(-50%)"
            closeBtn.style.right = "18px"; closeBtn.style.top = "18px"

            counterEl = document.createElement("div")
            setStyles(counterEl, {
                position: "fixed", left: "50%", bottom: "20px", transform: "translateX(-50%)",
                zIndex: String(Z + 2), fontFamily: GLYPH_FONT, fontSize: "13px", lineHeight: "1",
                letterSpacing: "0.04em", color: cfg().chromeColor, opacity: "0",
                transition: "opacity 200ms ease", pointerEvents: "none",
            })
            overlay.appendChild(prevBtn); overlay.appendChild(nextBtn)
            overlay.appendChild(closeBtn); overlay.appendChild(counterEl)
            document.body.appendChild(overlay)

            overlay.addEventListener("click", () => close())
            imgEl.addEventListener("click", (e) => { e.stopPropagation(); if (cfg().clickImageAdvances) go(1) })
            videoEl.addEventListener("click", (e) => e.stopPropagation())
            prevBtn.addEventListener("click", (e) => { e.stopPropagation(); go(-1) })
            nextBtn.addEventListener("click", (e) => { e.stopPropagation(); go(1) })
            closeBtn.addEventListener("click", (e) => { e.stopPropagation(); close() })

            let downX = 0, downY = 0, tracking = false
            imgEl.addEventListener("pointerdown", (e) => { tracking = true; downX = e.clientX; downY = e.clientY }, { passive: true })
            imgEl.addEventListener("pointerup", (e) => {
                if (!tracking) return
                tracking = false
                const dx = e.clientX - downX, dy = e.clientY - downY
                if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { e.stopPropagation(); go(dx < 0 ? 1 : -1) }
            })
        }

        function activeEl(): HTMLElement | null {
            const item = list[index]; if (!item) return null
            return item.type === "video" ? videoEl : imgEl
        }
        function setChromeVisible(v: boolean) {
            const c = cfg(); const o = v ? "1" : "0"
            if (prevBtn) prevBtn.style.opacity = c.showArrows && v ? o : "0"
            if (nextBtn) nextBtn.style.opacity = c.showArrows && v ? o : "0"
            if (closeBtn) closeBtn.style.opacity = c.showClose && v ? o : "0"
            if (counterEl) counterEl.style.opacity = c.showCounter && v ? o : "0"
        }
        function updateChrome() {
            const c = cfg(); const single = list.length <= 1
            if (prevBtn) prevBtn.style.display = c.showArrows && !single ? "flex" : "none"
            if (nextBtn) nextBtn.style.display = c.showArrows && !single ? "flex" : "none"
            if (closeBtn) closeBtn.style.display = c.showClose ? "flex" : "none"
            if (counterEl) {
                counterEl.style.display = c.showCounter ? "block" : "none"
                counterEl.textContent = `${index + 1} / ${list.length}`
            }
        }
        function applySizing(el: HTMLElement, type: MediaType, ratio: number) {
            if (type === "video" && ratio > 0) el.style.aspectRatio = String(ratio)
            else el.style.aspectRatio = ""
        }
        function hideUnderlying(el: HTMLElement | null) {
            if (hiddenEl && hiddenEl !== el) hiddenEl.style.visibility = ""
            hiddenEl = el
            if (hiddenEl) hiddenEl.style.visibility = "hidden"
        }
        function wrap(i: number): number {
            const n = list.length
            if (n === 0) return 0
            if (cfg().loopNavigation) return (i + n) % n
            return Math.max(0, Math.min(n - 1, i))
        }
        function preloadNeighbors() {
            ;[index - 1, index + 1].forEach((i) => {
                const item = list[wrap(i)]
                if (item && item.type === "image") { const im = new Image(); im.src = item.hires || item.src }
            })
        }

        // Single source of truth: show exactly one media element, centered,
        // transform/opacity reset, all stray animations cancelled.
        function showOnly(item: Candidate): HTMLElement | null {
            if (!imgEl || !videoEl) return null
            clearAnims(imgEl); clearAnims(videoEl)
            imgEl.style.transform = "none"; videoEl.style.transform = "none"
            imgEl.style.opacity = "1"; videoEl.style.opacity = "1"
            if (item.type === "video") {
                imgEl.style.display = "none"; imgEl.removeAttribute("src")
                videoEl.style.display = "block"
                videoEl.controls = cfg().videoControls
                if (videoEl.src !== item.src) videoEl.src = item.src
                if (item.poster) videoEl.poster = item.poster
                videoEl.muted = true
                try { videoEl.currentTime = 0 } catch { /* not ready */ }
                const p = videoEl.play(); if (p && typeof p.catch === "function") p.catch(() => {})
                applySizing(videoEl, "video", item.ratio)
                return videoEl
            }
            try { videoEl.pause() } catch { /* noop */ }
            videoEl.removeAttribute("src"); videoEl.load()
            videoEl.style.display = "none"
            imgEl.style.display = "block"; imgEl.src = item.src
            applySizing(imgEl, "image", item.ratio)
            return imgEl
        }
        function upgradeHires(item: Candidate, tk: number) {
            if (item.type !== "image" || !item.hires || item.hires === item.src) return
            const pre = new Image()
            pre.onload = () => { if (imgEl && tk === token && list[index] === item) imgEl.src = item.hires }
            pre.src = item.hires
        }
        // Safety net: across a few frames after a transition, force the active
        // media back to identity transform whenever no animation is running.
        function recenterSoon(tk: number) {
            let n = 0
            const tick = () => {
                if (tk !== token) return
                const el = activeEl()
                if (el) {
                    const anims = typeof el.getAnimations === "function" ? el.getAnimations() : []
                    const running = anims.some((a) => a.playState === "running")
                    if (!running && el.style.transform !== "none") el.style.transform = "none"
                }
                if (++n < 5) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
        }

        // ---- Open / navigate / close ------------------------------------
        function open(start: HTMLElement, rect: DOMRect) {
            if (!overlay) build()
            if (!overlay) return
            token += 1
            const tk = token
            clearAnims(overlay); clearAnims(imgEl); clearAnims(videoEl)

            list = collect()
            index = list.findIndex((c) => c.el === start)
            if (index < 0) { const c = toCandidate(start); if (!c) return; list.unshift(c); index = 0 }

            isOpen = true
            prevBodyOverflow = document.body.style.overflow
            document.body.style.overflow = "hidden"
            overlay.style.padding = padCSS()
            overlay.style.background = cfg().backgroundColor
            overlay.style.display = "flex"
            overlay.style.opacity = "0"
            updateChrome()
            setChromeVisible(false)

            const item = list[index]
            const media = showOnly(item)
            if (!media) return
            hideUnderlying(item.el)
            preloadNeighbors()

            const reduce = prefersReducedMotion()
            const duration = cfg().duration

            nextFrame(() => {
                if (tk !== token || !isOpen || !overlay) return
                const to = media.getBoundingClientRect()
                overlay.style.opacity = "1"
                overlay.animate([{ opacity: 0 }, { opacity: 1 }], { duration: Math.round(duration * 0.75), easing: "ease-out", fill: "none" })
                if (reduce || !rect || !canAnimate(media) || to.width < 2) {
                    setChromeVisible(true); upgradeHires(item, tk); return
                }
                const s = Math.max(0.02, Math.min(rect.width / Math.max(1, to.width), rect.height / Math.max(1, to.height)))
                const tx = rect.left + rect.width / 2 - (to.left + to.width / 2)
                const ty = rect.top + rect.height / 2 - (to.top + to.height / 2)
                media.animate(
                    [{ transform: `translate(${tx}px, ${ty}px) scale(${s})` }, { transform: "translate(0px, 0px) scale(1)" }],
                    { duration, easing: EASE, fill: "none" }
                )
                media.animate([{ opacity: 0 }, { opacity: 1 }], { duration: Math.round(duration * 0.45), easing: "ease-out", fill: "none" })
                window.setTimeout(() => { if (tk === token && isOpen) setChromeVisible(true) }, duration)
                recenterSoon(tk)
                upgradeHires(item, tk)
            })
        }

        // Navigation is synchronous: show the new item centered immediately,
        // fade it in. No deferred swap, so no race can strand or double-render.
        function go(dir: number) {
            if (!isOpen || list.length <= 1) return
            const next = wrap(index + dir)
            if (next === index) return
            index = next
            const tk = token
            const item = list[index]
            updateChrome()
            preloadNeighbors()
            const media = showOnly(item)
            if (!media) return
            hideUnderlying(item.el)
            if (canAnimate(media)) media.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 190, easing: "ease-out", fill: "none" })
            upgradeHires(item, tk)
            recenterSoon(tk)
        }

        function close() {
            if (!isOpen || !overlay) return
            token += 1
            const tk = token
            const media = activeEl()
            isOpen = false
            setChromeVisible(false)

            const finish = () => {
                // A newer open() bumped the token — do NOT clobber it.
                if (tk !== token) return
                if (videoEl) { try { videoEl.pause(); videoEl.removeAttribute("src"); videoEl.load() } catch { /* noop */ } }
                if (imgEl) imgEl.style.transform = "none"
                if (videoEl) videoEl.style.transform = "none"
                if (overlay) { overlay.style.display = "none"; overlay.style.opacity = "0" }
                document.body.style.overflow = prevBodyOverflow
                hideUnderlying(null)
            }

            const current = list[index]
            const reduce = prefersReducedMotion()
            const duration = cfg().duration
            const targetRect = current ? current.el.getBoundingClientRect() : null
            const inView = targetRect && targetRect.bottom > 0 && targetRect.top < window.innerHeight && targetRect.width > 0

            if (reduce || !inView || !targetRect || !media || !canAnimate(media)) {
                const fade = overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "linear", fill: "both" })
                fade.onfinish = finish
                return
            }
            const from = media.getBoundingClientRect()
            const s = Math.max(0.02, Math.min(targetRect.width / Math.max(1, from.width), targetRect.height / Math.max(1, from.height)))
            const tx = targetRect.left + targetRect.width / 2 - (from.left + from.width / 2)
            const ty = targetRect.top + targetRect.height / 2 - (from.top + from.height / 2)
            overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing: EASE, fill: "both" })
            media.animate([{ opacity: 1 }, { opacity: 0 }], { duration: Math.round(duration * 0.7), easing: "ease-in", fill: "both" })
            const anim = media.animate(
                [{ transform: "translate(0px, 0px) scale(1)" }, { transform: `translate(${tx}px, ${ty}px) scale(${s})` }],
                { duration, easing: EASE, fill: "both" }
            )
            anim.onfinish = finish
        }

        // ---- Global listeners -------------------------------------------
        function onDocClick(e: MouseEvent) {
            if (!cfg().enabled || isOpen) return
            if (e.defaultPrevented || e.button !== 0) return
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
            const target = e.target as HTMLElement | null
            if (overlay && target && overlay.contains(target)) return
            const media = resolveTarget(e)
            if (!media) return
            e.preventDefault(); e.stopPropagation()
            open(media, media.getBoundingClientRect())
        }
        function onKey(e: KeyboardEvent) {
            if (!isOpen) return
            if (e.key === "Escape") { e.preventDefault(); close() }
            else if (e.key === "ArrowRight") { e.preventDefault(); go(1) }
            else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1) }
        }
        document.addEventListener("click", onDocClick, true)
        window.addEventListener("keydown", onKey)

        return () => {
            document.removeEventListener("click", onDocClick, true)
            window.removeEventListener("keydown", onKey)
            if (cursorStyle.parentNode) cursorStyle.parentNode.removeChild(cursorStyle)
            if (hiddenEl) hiddenEl.style.visibility = ""
            if (isOpen) document.body.style.overflow = prevBodyOverflow
            if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay)
            delete (window as unknown as Record<string, unknown>).__cslbActive
        }
    }, [])

    return <span data-casestudy-lightbox="" style={{ display: "block", width: 1, height: 1, opacity: 0 }} />
}

CaseStudyLightbox.defaultProps = {
    enabled: true,
    lightboxVideos: true,
    videoControls: false,
    backgroundColor: "rgb(255, 255, 255)",
    chromeColor: "rgb(20, 20, 20)",
    iconWeight: 300,
    iconSize: 24,
    showArrows: true,
    showClose: true,
    showCounter: false,
    clickImageAdvances: true,
    loopNavigation: true,
    duration: 360,
    viewportPadding: 72,
    minSize: 100,
    excludeSelector: "nav, header, footer, a, button, video[controls], [data-no-lightbox]",
}

addPropertyControls(CaseStudyLightbox, {
    enabled: { type: ControlType.Boolean, title: "Lightbox", defaultValue: true, enabledTitle: "On", disabledTitle: "Off" },
    lightboxVideos: { type: ControlType.Boolean, title: "Videos", defaultValue: true, enabledTitle: "On", disabledTitle: "Off" },
    videoControls: { type: ControlType.Boolean, title: "Video Controls", defaultValue: false, enabledTitle: "Show", disabledTitle: "Hide" },
    backgroundColor: { type: ControlType.Color, title: "Background", defaultValue: "rgb(255, 255, 255)" },
    chromeColor: { type: ControlType.Color, title: "Arrows / X", defaultValue: "rgb(20, 20, 20)" },
    iconWeight: { type: ControlType.Number, title: "Icon Weight", defaultValue: 300, min: 100, max: 700, step: 50 },
    iconSize: { type: ControlType.Number, title: "Icon Size", defaultValue: 24, min: 12, max: 48, step: 1, unit: "px" },
    showArrows: { type: ControlType.Boolean, title: "Arrows", defaultValue: true, enabledTitle: "Show", disabledTitle: "Hide" },
    showClose: { type: ControlType.Boolean, title: "Close X", defaultValue: true, enabledTitle: "Show", disabledTitle: "Hide" },
    showCounter: { type: ControlType.Boolean, title: "Counter", defaultValue: false, enabledTitle: "Show", disabledTitle: "Hide" },
    clickImageAdvances: { type: ControlType.Boolean, title: "Tap = Next", defaultValue: true, enabledTitle: "On", disabledTitle: "Off" },
    loopNavigation: { type: ControlType.Boolean, title: "Loop", defaultValue: true, enabledTitle: "On", disabledTitle: "Off" },
    duration: { type: ControlType.Number, title: "Zoom ms", defaultValue: 360, min: 120, max: 800, step: 10, unit: "ms" },
    viewportPadding: { type: ControlType.Number, title: "Padding", defaultValue: 72, min: 0, max: 160, step: 2, unit: "px" },
    minSize: { type: ControlType.Number, title: "Min Size", defaultValue: 100, min: 0, max: 400, step: 10, unit: "px" },
    excludeSelector: { type: ControlType.String, title: "Exclude", defaultValue: "nav, header, footer, a, button, video[controls], [data-no-lightbox]", displayTextArea: true },
})
