import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

/**
 * Case Study Video Manager — pauses off-screen videos to lighten media-heavy
 * pages, WITHOUT ever showing a frozen video where you can see it.
 *
 * Drop ONE invisible instance on a page. On every scroll frame it reconciles
 * each autoplay video against the viewport using a generous lookahead margin:
 * a video plays while it's within one viewport-height of entering view, and
 * pauses once it's farther away (above OR below). So everything visible — or
 * about to be — is always playing; only far-away videos pause, which is where
 * the CPU/GPU/decode savings come from.
 *
 * A direct scroll-reconcile (not IntersectionObserver) is used because IO's
 * "leave" callbacks proved unreliable for upward exits, leaving scrolled-past
 * videos playing. The reconcile is rAF-coalesced and only reads rects + toggles
 * play/pause (no layout writes), so it's cheap.
 *
 * - Only manages autoplay videos; never the lightbox's own video, videos with
 *   controls (unless opted in), [data-no-autopause], or the exclude selector.
 * - Read-only play/pause — no DOM mutation, safe around hydrated content.
 * - Runs only outside the Framer canvas.
 *
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */

type Config = {
    enabled: boolean
    lookahead: number
    manageControlsVideos: boolean
    excludeSelector: string
}

export default function CaseStudyVideoManager(props: Config) {
    const configRef = React.useRef<Config>(props)
    configRef.current = props

    React.useEffect(() => {
        if (RenderTarget.current() === RenderTarget.canvas) return
        if (typeof document === "undefined" || typeof window === "undefined") return
        const W = window as unknown as Record<string, unknown>
        if (W.__cslbVideoActive) return
        W.__cslbVideoActive = true

        const cfg = () => configRef.current

        function shouldManage(v: HTMLVideoElement): boolean {
            if (v.closest("[data-cslb-overlay]")) return false // lightbox's own video
            if (!v.hasAttribute("autoplay")) return false // only the looping clips
            if (!cfg().manageControlsVideos && v.controls) return false
            if (v.closest("[data-no-autopause]")) return false
            const sel = cfg().excludeSelector.trim()
            if (sel) {
                try {
                    if (v.closest(sel)) return false
                } catch {
                    /* bad selector — ignore */
                }
            }
            return true
        }

        let frame = 0
        function reconcile() {
            frame = 0
            const c = cfg()
            const vids = document.querySelectorAll<HTMLVideoElement>("video")
            const vh = window.innerHeight || 800
            const margin = Math.max(0, vh * (Number(c.lookahead) || 0) / 100)
            // Read phase: gather decisions (rect reads only).
            const actions: Array<[HTMLVideoElement, boolean]> = []
            vids.forEach((v) => {
                if (!shouldManage(v)) return
                const r = v.getBoundingClientRect()
                if (r.width < 4 || r.height < 4) return
                const near = r.bottom > -margin && r.top < vh + margin
                actions.push([v, c.enabled ? near : true])
            })
            // Write phase: toggle play/pause (no layout effect).
            for (const [v, near] of actions) {
                if (near) {
                    if (v.paused) {
                        const p = v.play()
                        if (p && typeof p.catch === "function") p.catch(() => {})
                    }
                } else if (!v.paused) {
                    v.pause()
                }
            }
        }
        function schedule() {
            if (!frame) frame = requestAnimationFrame(reconcile)
        }

        window.addEventListener("scroll", schedule, { passive: true })
        window.addEventListener("resize", schedule, { passive: true })
        const mo = new MutationObserver(schedule)
        mo.observe(document.body, { childList: true, subtree: true })

        // Initial + delayed passes to catch late hydration / lazy videos.
        reconcile()
        const t1 = window.setTimeout(reconcile, 800)
        const t2 = window.setTimeout(reconcile, 2000)
        const t3 = window.setTimeout(reconcile, 4000)

        return () => {
            window.removeEventListener("scroll", schedule)
            window.removeEventListener("resize", schedule)
            mo.disconnect()
            if (frame) cancelAnimationFrame(frame)
            window.clearTimeout(t1)
            window.clearTimeout(t2)
            window.clearTimeout(t3)
            delete (window as unknown as Record<string, unknown>).__cslbVideoActive
        }
    }, [])

    return (
        <span
            data-casestudy-videomanager=""
            style={{ display: "block", width: 1, height: 1, opacity: 0 }}
        />
    )
}

CaseStudyVideoManager.defaultProps = {
    enabled: true,
    lookahead: 100,
    manageControlsVideos: false,
    excludeSelector: "[data-no-autopause]",
}

addPropertyControls(CaseStudyVideoManager, {
    enabled: {
        type: ControlType.Boolean,
        title: "Manager",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    lookahead: {
        type: ControlType.Number,
        title: "Lookahead",
        defaultValue: 100,
        min: 0,
        max: 300,
        step: 10,
        unit: "%vh",
    },
    manageControlsVideos: {
        type: ControlType.Boolean,
        title: "Incl. Controls",
        defaultValue: false,
        enabledTitle: "Yes",
        disabledTitle: "No",
    },
    excludeSelector: {
        type: ControlType.String,
        title: "Exclude",
        defaultValue: "[data-no-autopause]",
    },
})
