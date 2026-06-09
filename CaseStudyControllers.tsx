import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { animate } from "framer-motion"
// Framer resolves these module URLs to the project's other code components at
// bundle time. The TS linter can't resolve URL imports, hence the suppressions.
// @ts-ignore
import CaseStudyLightbox from "https://framer.com/m/CaseStudyLightbox-yOYpGN.js"
// @ts-ignore
import CaseStudyVideoManager from "https://framer.com/m/CaseStudyVideoManager-L3xgEc.js"
// @ts-ignore
import CaseStudyLinkRepair from "https://framer.com/m/CaseStudyLinkRepair-xbwFmJ.js"

/**
 * Case Study Controllers — bundles the three invisible, page-level case-study
 * controllers into ONE instance, so a page only needs a single drop-in:
 *   • CaseStudyLightbox     — Cargo-style image/video zoom
 *   • CaseStudyVideoManager — pauses off-screen autoplay videos
 *   • CaseStudyLinkRepair   — CMS link repair
 *
 * Each sub-controller keeps its own window-level singleton guard, so this is
 * safe to run alongside any leftover standalone instances during migration
 * (only one of each will ever be active). Toggle any sub-controller off here.
 *
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */

type Props = {
    lightbox: boolean
    videoManager: boolean
    linkRepair: boolean
    imageFadeIn: boolean
    lightboxVideos: boolean
    videoLookahead: number
    linkCollectionId: string
    linkTitleFieldId: string
    imageFadeDuration: number
    imageFadeStagger: number
    imageFadeOffset: number
}

type ImageFadeConfig = {
    enabled: boolean
    duration: number
    stagger: number
    offset: number
}

const IMAGE_FADE_SELECTOR =
    "main img, img[data-framer-name], [data-framer-name] img"
const IMAGE_FADE_EXCLUDE_SELECTOR = [
    "[data-cslb-overlay]",
    "[data-no-image-fade]",
    "[data-casestudy-controllers]",
].join(",")
const IMAGE_FADE_ATTR = "data-case-study-image-fade"
const IMAGE_FADE_READY_ATTR = "data-case-study-image-fade-ready"
const IMAGE_FADE_EASE = [0.23, 0.98, 0.56, 1] as const
const IMAGE_FADE_SPECIFIC_TARGET_NAME =
    /image wrapper|image row|media wrapper|media row|gallery item|grid item|carousel item|slide/i
const IMAGE_FADE_FALLBACK_TARGET_NAME = /image|media/i
const IMAGE_FADE_TARGET_CLASS =
    /mh-other-project-media|gallery|grid|carousel|media/i

type InitialFadeStyles = {
    transform: string
    willChange: string
}

function prefersReducedMotion(): boolean {
    return (
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
}

function shouldFadeImage(img: HTMLImageElement): boolean {
    if (img.closest(IMAGE_FADE_EXCLUDE_SELECTOR)) return false
    const rect = img.getBoundingClientRect()
    if (rect.width < 24 || rect.height < 24) return false
    return Boolean(img.currentSrc || img.src || img.srcset)
}

function shouldFadeTarget(target: HTMLElement): boolean {
    if (target.closest(IMAGE_FADE_EXCLUDE_SELECTOR)) return false
    const rect = target.getBoundingClientRect()
    return rect.width >= 24 && rect.height >= 24
}

function buildRevealTransform(baseTransform: string, offset: number): string {
    const base = baseTransform.trim()
    const y = `translateY(${offset}px)`
    return base ? `${base} ${y}` : y
}

function getFadeTarget(img: HTMLImageElement): HTMLElement {
    let node: HTMLElement | null = img
    let fallback: HTMLElement = img

    for (let depth = 0; node && depth < 7; depth += 1) {
        const name = node.getAttribute("data-framer-name") || node.getAttribute("name") || ""
        const className = String(node.className || "")

        if (name && IMAGE_FADE_SPECIFIC_TARGET_NAME.test(name)) return node
        if (name && IMAGE_FADE_FALLBACK_TARGET_NAME.test(name)) fallback = node
        if (className && IMAGE_FADE_TARGET_CLASS.test(className)) fallback = node

        node = node.parentElement
    }

    return fallback
}

function isCaseStudyDetailPage(): boolean {
    if (typeof window === "undefined") return false
    const path = window.location.pathname.replace(/\/+$/, "")
    return path.startsWith("/case-studies/") && path.length > "/case-studies/".length
}

function useCaseStudyImageFadeIn(config: ImageFadeConfig) {
    const configRef = React.useRef(config)
    configRef.current = config

    React.useEffect(() => {
        if (!config.enabled) return
        if (RenderTarget.current() === RenderTarget.canvas) return
        if (typeof document === "undefined" || typeof window === "undefined") return
        if (!isCaseStudyDetailPage()) return

        const W = window as unknown as Record<string, unknown>
        if (W.__caseStudyImageFadeActive) return
        W.__caseStudyImageFadeActive = true

        const reduceMotion = prefersReducedMotion()
        const watched = new WeakSet<HTMLElement>()
        const animated = new WeakSet<HTMLElement>()
        const visible = new WeakSet<HTMLElement>()
        const pending = new Map<HTMLElement, HTMLImageElement>()
        const initialStyles = new WeakMap<HTMLElement, InitialFadeStyles>()
        const cleanupFns: Array<() => void> = []
        let frame = 0

        function finishReveal(target: HTMLElement) {
            const initial = initialStyles.get(target)
            target.style.opacity = "1"
            if (initial?.transform) target.style.transform = initial.transform
            else target.style.removeProperty("transform")
            if (initial?.willChange) target.style.willChange = initial.willChange
            else target.style.removeProperty("will-change")
            target.setAttribute(IMAGE_FADE_READY_ATTR, "true")
        }

        function revealImmediately(target: HTMLElement) {
            finishReveal(target)
        }

        function flushPending() {
            frame = 0
            const items = Array.from(pending.entries())
                .filter(
                    ([target, img]) =>
                        shouldFadeTarget(target) &&
                        shouldFadeImage(img) &&
                        !animated.has(target)
                )
                .sort(([a], [b]) => {
                    const pos = a.compareDocumentPosition(b)
                    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1
                    if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1
                    return 0
                })

            pending.clear()

            items.forEach(([target], index) => {
                animated.add(target)
                target.setAttribute(IMAGE_FADE_ATTR, "done")
                target.style.willChange = "opacity, transform"

                const c = configRef.current
                const delay = Math.min(index, 8) * Math.max(0, c.stagger)
                const offset = Math.max(0, c.offset)
                const initialTransform = initialStyles.get(target)?.transform || ""

                animate(
                    target,
                    offset > 0
                        ? {
                              opacity: [0, 1],
                              transform: [
                                  buildRevealTransform(initialTransform, offset),
                                  buildRevealTransform(initialTransform, 0),
                              ],
                          }
                        : {
                              opacity: [0, 1],
                          },
                    {
                        duration: Math.max(0.1, c.duration),
                        delay,
                        ease: IMAGE_FADE_EASE,
                    }
                ).then(() => {
                    finishReveal(target)
                })
            })
        }

        function scheduleFlush() {
            if (!frame) frame = window.requestAnimationFrame(flushPending)
        }

        function queue(target: HTMLElement, img: HTMLImageElement) {
            if (animated.has(target)) return
            if (!visible.has(target)) return

            if (reduceMotion) {
                animated.add(target)
                target.setAttribute(IMAGE_FADE_ATTR, "done")
                revealImmediately(target)
                return
            }

            if (!img.complete || img.naturalWidth === 0) return
            pending.set(target, img)
            scheduleFlush()
        }

        const observer =
            "IntersectionObserver" in window
                ? new IntersectionObserver(
                      (entries) => {
                          entries.forEach((entry) => {
                              const target = entry.target as HTMLElement
                              if (!entry.isIntersecting) return
                              visible.add(target)
                              const img =
                                  target.querySelector<HTMLImageElement>("img") ||
                                  (target as HTMLImageElement)
                              if (img instanceof HTMLImageElement) queue(target, img)
                              observer.unobserve(target)
                          })
                      },
                      {
                          root: null,
                          rootMargin: "0px 0px -8% 0px",
                          threshold: 0.01,
                      }
                  )
                : null

        function watch(img: HTMLImageElement) {
            if (!shouldFadeImage(img)) return

            const target = getFadeTarget(img)
            if (watched.has(target) || !shouldFadeTarget(target)) return
            watched.add(target)
            target.setAttribute(IMAGE_FADE_ATTR, "pending")

            if (reduceMotion) {
                visible.add(target)
                queue(target, img)
                return
            }

            initialStyles.set(target, {
                transform: target.style.transform,
                willChange: target.style.willChange,
            })

            target.style.opacity = "0"
            target.style.willChange = "opacity, transform"
            const offset = Math.max(0, configRef.current.offset)
            const initialTransform = initialStyles.get(target)?.transform || ""
            if (offset > 0) {
                target.style.transform = buildRevealTransform(initialTransform, offset)
            }

            const onLoad = () => queue(target, img)
            const onError = () => revealImmediately(target)
            img.addEventListener("load", onLoad)
            img.addEventListener("error", onError)
            cleanupFns.push(() => {
                img.removeEventListener("load", onLoad)
                img.removeEventListener("error", onError)
            })

            if (observer) {
                observer.observe(target)
            } else {
                visible.add(target)
                queue(target, img)
            }

            queue(target, img)
        }

        function scan() {
            document
                .querySelectorAll<HTMLImageElement>(IMAGE_FADE_SELECTOR)
                .forEach(watch)
        }

        scan()
        const scanDelays = [100, 300, 800, 1600, 3200]
        scanDelays.forEach((delay) => {
            const timeout = window.setTimeout(scan, delay)
            cleanupFns.push(() => window.clearTimeout(timeout))
        })

        const mutationObserver = new MutationObserver(() => {
            window.requestAnimationFrame(scan)
        })
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["src", "srcset"],
        })

        return () => {
            cleanupFns.forEach((cleanup) => cleanup())
            mutationObserver.disconnect()
            observer?.disconnect()
            if (frame) window.cancelAnimationFrame(frame)
            pending.clear()
            delete (window as unknown as Record<string, unknown>).__caseStudyImageFadeActive
        }
    }, [config.enabled])
}

export default function CaseStudyControllers(props: Props) {
    const Lightbox = CaseStudyLightbox as unknown as React.ComponentType<Record<string, unknown>>
    const VideoManager = CaseStudyVideoManager as unknown as React.ComponentType<Record<string, unknown>>
    const LinkRepair = CaseStudyLinkRepair as unknown as React.ComponentType<Record<string, unknown>>
    useCaseStudyImageFadeIn({
        enabled: props.imageFadeIn,
        duration: props.imageFadeDuration,
        stagger: props.imageFadeStagger,
        offset: props.imageFadeOffset,
    })

    return (
        <span
            data-casestudy-controllers=""
            style={{ display: "block", width: 1, height: 1, opacity: 0 }}
        >
            {props.lightbox ? <Lightbox enabled lightboxVideos={props.lightboxVideos} /> : null}
            {props.videoManager ? (
                <VideoManager enabled lookahead={props.videoLookahead} />
            ) : null}
            {props.linkRepair ? (
                <LinkRepair
                    enabled
                    mobileFooterLayout={!props.lightbox}
                    collectionId={props.linkCollectionId}
                    collectionModuleUrl=""
                    slugFieldId=""
                    titleFieldId={props.linkTitleFieldId}
                    urlOverrides=""
                />
            ) : null}
        </span>
    )
}

CaseStudyControllers.defaultProps = {
    lightbox: true,
    videoManager: true,
    linkRepair: true,
    imageFadeIn: true,
    lightboxVideos: true,
    videoLookahead: 100,
    linkCollectionId: "yTHrQWMIY",
    linkTitleFieldId: "oeXZcmPna",
    imageFadeDuration: 2,
    imageFadeStagger: 0.1,
    imageFadeOffset: 80,
}

addPropertyControls(CaseStudyControllers, {
    lightbox: {
        type: ControlType.Boolean,
        title: "Lightbox",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    videoManager: {
        type: ControlType.Boolean,
        title: "Video Mgr",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    linkRepair: {
        type: ControlType.Boolean,
        title: "Link Repair",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    imageFadeIn: {
        type: ControlType.Boolean,
        title: "Image Fade",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    lightboxVideos: {
        type: ControlType.Boolean,
        title: "LB Videos",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
        hidden: ({ lightbox }) => !lightbox,
    },
    videoLookahead: {
        type: ControlType.Number,
        title: "Lookahead",
        defaultValue: 100,
        min: 0,
        max: 300,
        step: 10,
        unit: "%vh",
        hidden: ({ videoManager }) => !videoManager,
    },
    linkCollectionId: {
        type: ControlType.String,
        title: "CMS Coll.",
        defaultValue: "yTHrQWMIY",
        hidden: ({ linkRepair }) => !linkRepair,
    },
    linkTitleFieldId: {
        type: ControlType.String,
        title: "Title Field",
        defaultValue: "oeXZcmPna",
        hidden: ({ linkRepair }) => !linkRepair,
    },
    imageFadeDuration: {
        type: ControlType.Number,
        title: "Fade Dur.",
        defaultValue: 2,
        min: 0.1,
        max: 2,
        step: 0.01,
        unit: "s",
        hidden: ({ imageFadeIn }) => !imageFadeIn,
    },
    imageFadeStagger: {
        type: ControlType.Number,
        title: "Fade Gap",
        defaultValue: 0.1,
        min: 0,
        max: 0.3,
        step: 0.01,
        unit: "s",
        hidden: ({ imageFadeIn }) => !imageFadeIn,
    },
    imageFadeOffset: {
        type: ControlType.Number,
        title: "Fade Y",
        defaultValue: 80,
        min: 0,
        max: 120,
        step: 1,
        unit: "px",
        hidden: ({ imageFadeIn }) => !imageFadeIn,
    },
})
