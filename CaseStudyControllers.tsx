import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
// Framer resolves these module URLs to the project's other code components at
// bundle time. The TS linter can't resolve URL imports, hence the suppressions.
// @ts-ignore
import CaseStudyLightbox from "https://framer.com/m/CaseStudyLightbox-yOYpGN.js@Cphhu4ZJ1CxHLPy7kC6e"
// @ts-ignore
import CaseStudyVideoManager from "https://framer.com/m/CaseStudyVideoManager-L3xgEc.js"
// @ts-ignore
import CaseStudyLinkRepair from "https://framer.com/m/CaseStudyLinkRepair-xbwFmJ.js"

const SKELETON_RATIO_STYLE_ID = "case-study-media-skeleton-ratio-v1"
const VIDEO_FALLBACK_RATIO = 4 / 5
const SKELETON_RATIO_STYLE = `
[data-case-study-media-skeleton-ratio="true"]:not([data-case-study-media-ready="true"]) {
    aspect-ratio: var(--case-study-media-skeleton-aspect-ratio) !important;
}
`

/**
 * Case Study Controllers — bundles the three invisible, page-level case-study
 * controllers into ONE instance, so a page only needs a single drop-in:
 *   • CaseStudyLightbox     — Cargo-style image/video zoom + nav click guard
 *   • CaseStudyVideoManager — pauses off-screen autoplay videos
 *   • CaseStudyLinkRepair   — CMS link repair
 *
 * Each sub-controller keeps its own window-level singleton guard, so this is
 * safe to run alongside any leftover standalone instances during migration
 * (only one of each will ever be active). Toggle any sub-controller off here.
 *
 * NOTE: the nav click guard (which stops a nav click over media from opening
 * the lightbox) lives entirely inside CaseStudyLightbox now — it is a pure
 * event guard with NO nav CSS mutation, so it cannot affect the nav's hover /
 * flip-text behavior. The lightbox import below is PINNED to a specific
 * version; bump the @hash whenever CaseStudyLightbox is republished so this
 * wrapper picks up the new code (an unpinned import can resolve stale on some
 * page bundles).
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
    lightboxVideos: boolean
    videoLookahead: number
    linkCollectionId: string
    linkTitleFieldId: string
}

function isCaseStudyDetailPage(): boolean {
    if (typeof window === "undefined") return false
    const path = window.location.pathname.replace(/\/+$/, "")
    return path.startsWith("/case-studies/") && path.length > "/case-studies/".length
}

function ratioFromDimensions(width: unknown, height: unknown): number {
    const safeWidth = Number(width)
    const safeHeight = Number(height)
    return Number.isFinite(safeWidth) && Number.isFinite(safeHeight) && safeWidth > 0 && safeHeight > 0
        ? safeWidth / safeHeight
        : 0
}

function getUrlRatio(src: string): number {
    if (!src) return 0

    try {
        const url = new URL(src, window.location.href)
        return ratioFromDimensions(
            url.searchParams.get("width"),
            url.searchParams.get("height")
        )
    } catch {
        const width = src.match(/[?&]width=(\d+(?:\.\d+)?)/)?.[1]
        const height = src.match(/[?&]height=(\d+(?:\.\d+)?)/)?.[1]
        return ratioFromDimensions(width, height)
    }
}

function getVideoSkeletonRatio(video: HTMLVideoElement): number {
    return (
        ratioFromDimensions(video.videoWidth, video.videoHeight) ||
        ratioFromDimensions(video.getAttribute("width"), video.getAttribute("height")) ||
        getUrlRatio(video.currentSrc || video.src || "") ||
        VIDEO_FALLBACK_RATIO
    )
}

function ensureSkeletonRatioStyle() {
    if (typeof document === "undefined") return

    let style = document.getElementById(SKELETON_RATIO_STYLE_ID)
    if (!style) {
        style = document.createElement("style")
        style.id = SKELETON_RATIO_STYLE_ID
    }

    if (style.textContent !== SKELETON_RATIO_STYLE) {
        style.textContent = SKELETON_RATIO_STYLE
    }

    document.head.appendChild(style)
}

function getElementArea(element: HTMLElement): number {
    const rect = element.getBoundingClientRect()
    return Math.max(0, rect.width) * Math.max(0, rect.height)
}

function isLayoutMediaSkeletonHost(host: HTMLElement, media: HTMLElement): boolean {
    const directChildren = Array.from(host.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement && getElementArea(child) >= 1024
    )

    return directChildren.length > 1 && !directChildren.includes(media)
}

function syncNestedReadySkeletonHosts() {
    if (typeof document === "undefined") return

    document
        .querySelectorAll<HTMLElement>(
            "[data-case-study-media-skeleton='true']:not([data-case-study-media-ready='true'])"
        )
        .forEach((host) => {
            const hasReadyNestedMedia = Boolean(
                host.querySelector("[data-case-study-media-state='ready'], [data-case-study-media-ready='true']")
            )

            if (!hasReadyNestedMedia) return

            host.setAttribute("data-case-study-media-ready", "true")
            host.removeAttribute("data-case-study-media-failed")
            host.removeAttribute("data-case-study-media-skeleton-ratio")
            host.style.removeProperty("--case-study-media-skeleton-aspect-ratio")
        })
}

function syncSkeletonAspectRatios() {
    if (typeof document === "undefined") return

    ensureSkeletonRatioStyle()

    document.querySelectorAll<HTMLElement>("[data-case-study-media-skeleton='true']").forEach((host) => {
        if (host.getAttribute("data-case-study-media-ready") === "true") {
            host.removeAttribute("data-case-study-media-skeleton-ratio")
            host.style.removeProperty("--case-study-media-skeleton-aspect-ratio")
            return
        }

        const unresolvedVideo = Array.from(host.querySelectorAll("video")).find(
            (video) => video.getAttribute("data-case-study-media-state") !== "ready"
        )
        if (!(unresolvedVideo instanceof HTMLVideoElement) || isLayoutMediaSkeletonHost(host, unresolvedVideo)) {
            host.removeAttribute("data-case-study-media-skeleton-ratio")
            host.style.removeProperty("--case-study-media-skeleton-aspect-ratio")
            return
        }

        host.setAttribute("data-case-study-media-skeleton-ratio", "true")
        host.style.setProperty(
            "--case-study-media-skeleton-aspect-ratio",
            `${getVideoSkeletonRatio(unresolvedVideo)}`
        )
    })
}

function syncCaseStudySkeletonGuards() {
    syncNestedReadySkeletonHosts()
    syncSkeletonAspectRatios()
}

function useCaseStudySkeletonAspectGuard() {
    React.useEffect(() => {
        if (typeof document === "undefined" || typeof window === "undefined") return
        if (!isCaseStudyDetailPage()) return

        let frame = 0
        const timeouts: number[] = []
        const schedule = () => {
            window.cancelAnimationFrame(frame)
            frame = window.requestAnimationFrame(syncCaseStudySkeletonGuards)
        }

        schedule()
        ;[75, 200, 500, 1000, 2000, 3500].forEach((delay) => {
            timeouts.push(window.setTimeout(schedule, delay))
        })

        const observer = new MutationObserver(schedule)
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: [
                "data-case-study-media-ready",
                "data-case-study-media-failed",
                "data-case-study-media-state",
                "src",
                "poster",
            ],
            childList: true,
            subtree: true,
        })

        window.addEventListener("pageshow", schedule)
        window.addEventListener("resize", schedule)

        return () => {
            window.cancelAnimationFrame(frame)
            timeouts.forEach((timeout) => window.clearTimeout(timeout))
            observer.disconnect()
            window.removeEventListener("pageshow", schedule)
            window.removeEventListener("resize", schedule)
        }
    }, [])
}

export default function CaseStudyControllers(props: Props) {
    useCaseStudySkeletonAspectGuard()
    const Lightbox = CaseStudyLightbox as unknown as React.ComponentType<Record<string, unknown>>
    const VideoManager = CaseStudyVideoManager as unknown as React.ComponentType<Record<string, unknown>>
    const LinkRepair = CaseStudyLinkRepair as unknown as React.ComponentType<Record<string, unknown>>
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
    lightboxVideos: true,
    videoLookahead: 100,
    linkCollectionId: "yTHrQWMIY",
    linkTitleFieldId: "oeXZcmPna",
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
})
