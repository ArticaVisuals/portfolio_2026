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
 * - Far-off and hidden breakpoint copies can release their source while keeping
 *   the poster visible. The source is restored inside the lookahead window.
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
    unloadFarVideos: boolean
    manageControlsVideos: boolean
    excludeSelector: string
}

type StoredVideoSource = {
    src: string | null
    preload: string | null
    sources: Array<{ element: HTMLSourceElement; src: string | null }>
}

export default function CaseStudyVideoManager(props: Config) {
    const configRef = React.useRef<Config>(props)
    const scheduleRef = React.useRef<() => void>(() => {})
    configRef.current = props

    React.useEffect(() => {
        if (RenderTarget.current() === RenderTarget.canvas) return
        if (typeof document === "undefined" || typeof window === "undefined") return
        const W = window as unknown as Record<string, unknown>
        if (W.__cslbVideoActive) return
        W.__cslbVideoActive = true

        const cfg = () => configRef.current
        const storedSources = new WeakMap<HTMLVideoElement, StoredVideoSource>()
        const unloadedVideos = new Set<HTMLVideoElement>()
        const suppressedAttributeMutations = new WeakMap<Element, Set<string>>()

        function suppressAttributeMutation(element: Element, attribute: string) {
            const attributes =
                suppressedAttributeMutations.get(element) || new Set<string>()
            attributes.add(attribute)
            suppressedAttributeMutations.set(element, attributes)
        }

        function consumeSuppressedAttributeMutation(
            element: Element,
            attribute: string
        ) {
            const attributes = suppressedAttributeMutations.get(element)
            if (!attributes?.has(attribute)) return false
            attributes.delete(attribute)
            if (attributes.size === 0) suppressedAttributeMutations.delete(element)
            return true
        }

        function setAttributeWithoutRecapture(
            element: Element,
            attribute: string,
            value: string
        ) {
            if (element.getAttribute(attribute) === value) return
            suppressAttributeMutation(element, attribute)
            element.setAttribute(attribute, value)
        }

        function removeAttributeWithoutRecapture(
            element: Element,
            attribute: string
        ) {
            if (!element.hasAttribute(attribute)) return
            suppressAttributeMutation(element, attribute)
            element.removeAttribute(attribute)
        }

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

        function unloadSource(video: HTMLVideoElement) {
            if (unloadedVideos.has(video)) return

            const sourceElements = Array.from(
                video.querySelectorAll<HTMLSourceElement>("source")
            )
            const stored: StoredVideoSource = {
                src: video.getAttribute("src"),
                preload: video.getAttribute("preload"),
                sources: sourceElements.map((element) => ({
                    element,
                    src: element.getAttribute("src"),
                })),
            }
            const hasSource =
                Boolean(stored.src) || stored.sources.some(({ src }) => Boolean(src))
            if (!hasSource) return

            storedSources.set(video, stored)
            unloadedVideos.add(video)
            video.pause()
            setAttributeWithoutRecapture(video, "preload", "none")
            removeAttributeWithoutRecapture(video, "src")
            stored.sources.forEach(({ element }) => {
                removeAttributeWithoutRecapture(element, "src")
            })
            video.load()
            video.setAttribute("data-video-source-deferred", "true")
        }

        function restoreSource(video: HTMLVideoElement) {
            if (!unloadedVideos.has(video)) return
            const stored = storedSources.get(video)
            if (!stored) return

            if (stored.src) {
                setAttributeWithoutRecapture(video, "src", stored.src)
            } else {
                removeAttributeWithoutRecapture(video, "src")
            }
            stored.sources.forEach(({ element, src }) => {
                if (!video.contains(element)) return
                if (src) {
                    setAttributeWithoutRecapture(element, "src", src)
                } else {
                    removeAttributeWithoutRecapture(element, "src")
                }
            })
            if (stored.preload) {
                setAttributeWithoutRecapture(video, "preload", stored.preload)
            } else {
                removeAttributeWithoutRecapture(video, "preload")
            }

            unloadedVideos.delete(video)
            storedSources.delete(video)
            video.removeAttribute("data-video-source-deferred")
            video.load()
        }

        function captureDeferredSourceMutation(
            mutation: MutationRecord
        ): HTMLVideoElement | null {
            if (mutation.type !== "attributes" || !mutation.attributeName) return null
            const target = mutation.target
            if (!(target instanceof HTMLVideoElement || target instanceof HTMLSourceElement)) {
                return null
            }

            const video =
                target instanceof HTMLVideoElement ? target : target.closest("video")
            if (!video || !unloadedVideos.has(video)) return null
            const stored = storedSources.get(video)
            if (!stored) return null

            if (target instanceof HTMLVideoElement) {
                if (mutation.attributeName === "src") {
                    stored.src = target.getAttribute("src")
                    if (stored.src) {
                        removeAttributeWithoutRecapture(target, "src")
                    }
                } else if (mutation.attributeName === "preload") {
                    stored.preload = target.getAttribute("preload")
                    setAttributeWithoutRecapture(target, "preload", "none")
                }
                return video
            }

            if (mutation.attributeName === "src") {
                const nextSource = target.getAttribute("src")
                const current = stored.sources.find(({ element }) => element === target)
                if (current) {
                    current.src = nextSource
                } else {
                    stored.sources.push({ element: target, src: nextSource })
                }
                if (nextSource) {
                    removeAttributeWithoutRecapture(target, "src")
                }
                return video
            }

            return null
        }

        function isManagerOwnedAttributeState(
            element: Element,
            attribute: string
        ) {
            if (attribute === "src") return !element.hasAttribute("src")
            if (attribute === "preload" && element instanceof HTMLVideoElement) {
                return element.getAttribute("preload") === "none"
            }
            return false
        }

        function captureDeferredSourceChildren(video: HTMLVideoElement) {
            const stored = storedSources.get(video)
            if (!stored) return false
            const sources = new Map(
                stored.sources.map(({ element, src }) => [element, src] as const)
            )
            let changed = false
            video.querySelectorAll<HTMLSourceElement>("source").forEach((element) => {
                const attachedSource = element.getAttribute("src")
                const src =
                    attachedSource !== null
                        ? attachedSource
                        : sources.get(element) ?? null
                sources.set(element, src)
                if (attachedSource) {
                    removeAttributeWithoutRecapture(element, "src")
                    changed = true
                }
            })
            stored.sources = Array.from(sources, ([element, src]) => ({
                element,
                src,
            }))
            return changed
        }

        let frame = 0
        function reconcile() {
            frame = 0
            const c = cfg()
            unloadedVideos.forEach((video) => {
                if (!video.isConnected) {
                    restoreSource(video)
                    return
                }
                if (!c.unloadFarVideos || !shouldManage(video)) {
                    restoreSource(video)
                }
            })
            const vids = document.querySelectorAll<HTMLVideoElement>("video")
            const vh = window.innerHeight || 800
            const margin = Math.max(0, vh * (Number(c.lookahead) || 0) / 100)
            const pageVisible = document.visibilityState !== "hidden"
            // Read phase: gather decisions (rect reads only).
            const actions: Array<[HTMLVideoElement, boolean]> = []
            vids.forEach((v) => {
                if (!shouldManage(v)) return
                const r = v.getBoundingClientRect()
                const rendered = r.width >= 4 && r.height >= 4
                const near =
                    pageVisible && rendered && r.bottom > -margin && r.top < vh + margin
                actions.push([v, c.enabled ? near : true])
            })
            // Write phase: restore nearby sources and release hidden/far copies.
            for (const [v, near] of actions) {
                if (near) {
                    if (c.unloadFarVideos) restoreSource(v)
                    if (v.paused) {
                        const p = v.play()
                        if (p && typeof p.catch === "function") p.catch(() => {})
                    }
                } else {
                    if (!v.paused) v.pause()
                    if (c.unloadFarVideos) unloadSource(v)
                }
            }
        }
        function schedule() {
            if (!frame) frame = requestAnimationFrame(reconcile)
        }
        scheduleRef.current = schedule

        window.addEventListener("scroll", schedule, { passive: true })
        window.addEventListener("resize", schedule, { passive: true })
        window.addEventListener("pageshow", schedule)
        document.addEventListener("visibilitychange", schedule)
        const mo = new MutationObserver((mutations) => {
            const videosToReload = new Set<HTMLVideoElement>()
            let hasChildListMutation = false
            const latestAttributeMutations = new Map<
                Element,
                Map<string, MutationRecord>
            >()
            mutations.forEach((mutation) => {
                if (mutation.type === "childList") {
                    hasChildListMutation = true
                    return
                }
                if (!mutation.attributeName || !(mutation.target instanceof Element)) {
                    return
                }
                const byAttribute =
                    latestAttributeMutations.get(mutation.target) ||
                    new Map<string, MutationRecord>()
                byAttribute.set(mutation.attributeName, mutation)
                latestAttributeMutations.set(mutation.target, byAttribute)
            })
            latestAttributeMutations.forEach((byAttribute, element) => {
                byAttribute.forEach((mutation, attribute) => {
                    const wasSuppressed = consumeSuppressedAttributeMutation(
                        element,
                        attribute
                    )
                    if (
                        wasSuppressed &&
                        isManagerOwnedAttributeState(element, attribute)
                    ) {
                        return
                    }
                    const video = captureDeferredSourceMutation(mutation)
                    if (video) videosToReload.add(video)
                })
            })
            if (hasChildListMutation) {
                unloadedVideos.forEach((video) => {
                    if (captureDeferredSourceChildren(video)) {
                        videosToReload.add(video)
                    }
                })
            }
            videosToReload.forEach((video) => video.load())
            schedule()
        })
        mo.observe(document.body, {
            attributes: true,
            attributeFilter: [
                "autoplay",
                "class",
                "controls",
                "data-no-autopause",
                "id",
                "preload",
                "src",
            ],
            childList: true,
            subtree: true,
        })

        // Initial + delayed passes to catch late hydration / lazy videos.
        reconcile()
        const t1 = window.setTimeout(reconcile, 800)
        const t2 = window.setTimeout(reconcile, 2000)
        const t3 = window.setTimeout(reconcile, 4000)

        return () => {
            window.removeEventListener("scroll", schedule)
            window.removeEventListener("resize", schedule)
            window.removeEventListener("pageshow", schedule)
            document.removeEventListener("visibilitychange", schedule)
            mo.disconnect()
            if (frame) cancelAnimationFrame(frame)
            window.clearTimeout(t1)
            window.clearTimeout(t2)
            window.clearTimeout(t3)
            unloadedVideos.forEach((video) => restoreSource(video))
            scheduleRef.current = () => {}
            delete (window as unknown as Record<string, unknown>).__cslbVideoActive
        }
    }, [])

    React.useEffect(() => {
        scheduleRef.current()
    }, [
        props.enabled,
        props.excludeSelector,
        props.lookahead,
        props.manageControlsVideos,
        props.unloadFarVideos,
    ])

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
    unloadFarVideos: true,
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
    unloadFarVideos: {
        type: ControlType.Boolean,
        title: "Unload Far",
        defaultValue: true,
        enabledTitle: "Yes",
        disabledTitle: "No",
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
