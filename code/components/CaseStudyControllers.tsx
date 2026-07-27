import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
// Framer resolves these module URLs to the project's other code components at
// bundle time. The TS linter can't resolve URL imports, hence the suppressions.
// @ts-ignore
import CaseStudyLightbox from "https://framer.com/m/CaseStudyLightbox-yOYpGN.js@qS53TFbO3xwEMqj7FPzY"
// @ts-ignore
import CaseStudyVideoManager from "https://framer.com/m/CaseStudyVideoManager-L3xgEc.js"
// @ts-ignore
import CaseStudyLinkRepair from "https://framer.com/m/CaseStudyLinkRepair-xbwFmJ.js"

const SKELETON_RATIO_STYLE_ID = "case-study-media-skeleton-ratio-v1"
const VIDEO_FALLBACK_RATIO = 4 / 5
const MOTION_CONNECT_PATH = "/case-studies/motion-connect-2025"
const FEATURED_PROJECT_PATHS = new Set([
    "/case-studies/gaia",
    "/case-studies/airpods",
    "/case-studies/peak-energy",
    MOTION_CONNECT_PATH,
    "/case-studies/simon-schuster",
    "/case-studies/national-park-cards",
])
const MOTION_CONNECT_VIDEO_POSTERS: Record<string, string> = {
    "https://freight.cargo.site/t/original/i/K2717924145885630584799912777237/Motion-Connect_1.mp4":
        "https://files.catbox.moe/lbj5h4.jpg",
    "https://freight.cargo.site/i/K2717924145885630584799912777237/Motion-Connect_1.mp4":
        "https://files.catbox.moe/lbj5h4.jpg",
    "https://freight.cargo.site/t/original/i/K2732700628673220824093023262229/Clip1.mp4":
        "https://files.catbox.moe/up3pny.jpg",
    "https://freight.cargo.site/t/original/i/I2732696893392013338645916538389/Clip2.mp4":
        "https://files.catbox.moe/yfr2td.jpg",
    "https://freight.cargo.site/t/original/i/Z2732698972764345559407703348757/Clip3.mp4":
        "https://files.catbox.moe/s23ptb.jpg",
    "https://freight.cargo.site/t/original/i/U2732702395557708436215005697557/Clip4.mp4":
        "https://files.catbox.moe/v0iri9.jpg",
    "https://freight.cargo.site/t/original/i/R2732705807744193470639315867157/Clip5.mp4":
        "https://files.catbox.moe/71qh4e.jpg",
    "https://freight.cargo.site/t/original/i/J2732708139228176946789544613397/Clip6.mp4":
        "https://files.catbox.moe/7iuahu.jpg",
    "https://freight.cargo.site/t/original/i/Q2732712482809217006882825426453/Clip7.mp4":
        "https://files.catbox.moe/zii6ko.jpg",
    "https://freight.cargo.site/t/original/i/D2732712483178151888357016458773/Clip8.mp4":
        "https://files.catbox.moe/pksn36.jpg",
    "https://freight.cargo.site/t/original/i/T2732712483196598632430726010389/Clip9.mp4":
        "https://files.catbox.moe/jpbkp9.jpg",
    "https://freight.cargo.site/t/original/i/F2709619893073297860162562020885/Untitled8.mp4":
        "https://files.catbox.moe/pxz3vi.jpg",
    "https://freight.cargo.site/t/original/i/T2709612322123701640140968678933/Slide-2_2.mp4":
        "https://files.catbox.moe/xq1p86.jpg",
    "https://freight.cargo.site/t/original/i/A2709612322142148384214678230549/Slide-3_2.mp4":
        "https://files.catbox.moe/0hvkup.jpg",
    "https://freight.cargo.site/t/original/i/P2709618310453336800325290677781/Untitled7.mp4":
        "https://files.catbox.moe/iafdb7.jpg",
    "https://freight.cargo.site/t/original/i/V2717868598736281181345024300565/Slide-5_2.mp4":
        "https://files.catbox.moe/ukrr20.jpg",
    "https://files.catbox.moe/odr4xy.mp4":
        "https://files.catbox.moe/hn4jmi.jpg",
    "https://freight.cargo.site/t/original/i/B2709612322179041872362097333781/Slide-7_2.mp4":
        "https://files.catbox.moe/2uz7r3.jpg",
    "https://freight.cargo.site/t/original/i/X2709615829845874232307046667797/Untitled4.mp4":
        "https://files.catbox.moe/xgwo0t.jpg",
    "https://freight.cargo.site/t/original/i/K2717876083281328160111077873173/Slide-9_2.mp4":
        "https://files.catbox.moe/1ryung.jpg",
    "https://freight.cargo.site/t/original/i/M2717884687488400180825785882133/TrimmedSandman.mp4":
        "https://files.catbox.moe/4cw5pa.jpg",
    "https://freight.cargo.site/t/original/i/B2709612322215935360509516437013/Slide-11_2.mp4":
        "https://files.catbox.moe/f1jd2w.jpg",
    "https://freight.cargo.site/t/original/i/Z2709612322234382104583225988629/Slide-12_2.mp4":
        "https://files.catbox.moe/bkm3p4.jpg",
}
const FEATURED_PROJECT_VIDEO_POSTERS: Record<string, string> = {
    ...MOTION_CONNECT_VIDEO_POSTERS,
    "https://framerusercontent.com/assets/UbkFFOnZrDDwQdrF7N6r3CEjeo.mp4":
        "https://files.catbox.moe/5rxz22.jpg",
    "https://framerusercontent.com/assets/iYVJWra2W8xywBIJLyzKocplcos.mp4":
        "https://files.catbox.moe/8acqhu.jpg",
    "https://framerusercontent.com/assets/BTL3ADwYE4N6rw7MvS4uh4Lz81g.mp4":
        "https://files.catbox.moe/iu77tt.jpg",
    "https://framerusercontent.com/assets/yd1uleBFnnm2f9VC5nMYSxUNmpY.mp4":
        "https://files.catbox.moe/0mlgee.jpg",
    "https://framerusercontent.com/assets/OAAidiFb2iiIPJ717ZpYgWubqQ.mp4":
        "https://files.catbox.moe/5uwndr.jpg",
    "https://framerusercontent.com/assets/T9GPPyKBoYiR0uJ0qkpbCCyTQ.mp4":
        "https://files.catbox.moe/lyw1is.jpg",
    "https://framerusercontent.com/assets/gFR7q15nPC48QC7ap45JjG12riY.mp4":
        "https://files.catbox.moe/50xion.jpg",
    "https://framerusercontent.com/assets/8wpcnCpwA1XpzCHePxtSgME1E.mp4":
        "https://files.catbox.moe/pzd7q9.jpg",
    "https://framerusercontent.com/assets/TNpc8c5YNncEarPZc27ldVMU.mp4":
        "https://files.catbox.moe/00tm9g.jpg",
    "https://framerusercontent.com/assets/dpqOPTuyEtCuEw9TsvIGBZULM.mp4":
        "https://files.catbox.moe/7iwwxa.jpg",
    "https://framerusercontent.com/assets/EeZjqzoE1D0NFtLGsMSjIr3PPE.mp4":
        "https://files.catbox.moe/aq8akp.jpg",
    "https://framerusercontent.com/assets/IdWfQ1KiQZOMK9ZEa4e4E8TmjSY.mp4":
        "https://files.catbox.moe/k7hoi0.jpg",
    "https://framerusercontent.com/assets/BTLOyDlC22T6zdTexVcfRIi1sSM.mp4":
        "https://files.catbox.moe/n0n3jb.jpg",
    "https://framerusercontent.com/assets/iEdEhtbqCl66mHv5MKpCclJeb0.mp4":
        "https://files.catbox.moe/7qmv8t.jpg",
    "https://framerusercontent.com/assets/JmkOmLQq5rmvERShZfiFP7M.mp4":
        "https://files.catbox.moe/sa6pkl.jpg",
    "https://framerusercontent.com/assets/HflTOYDNzce3QfCEbZ0bji7HCU.mp4":
        "https://files.catbox.moe/10d33l.jpg",
    "https://framerusercontent.com/assets/ynObrP88oTyxGe9M0RFDnyidpM.mp4":
        "https://files.catbox.moe/fuo78s.jpg",
    "https://framerusercontent.com/assets/Kwt4oi40ORaRFxzAIQujvjGXMk.mp4":
        "https://files.catbox.moe/7rnbww.jpg",
    "https://framerusercontent.com/assets/7PuYs1APbgGwIxd227rdUCzCF00.mp4":
        "https://files.catbox.moe/dg9t8p.jpg",
    "https://framerusercontent.com/assets/D6e9MQJzqxMfkIqWM3IYl2x9A.mp4":
        "https://files.catbox.moe/29v8tp.jpg",
    "https://framerusercontent.com/assets/cTVYsNQBRzQD3HMzG5jD1JbXGHs.mp4":
        "https://files.catbox.moe/aii1k9.jpg",
    "https://framerusercontent.com/assets/rmXYG0OmltnEUJJr0GIfDKaoLU.mp4":
        "https://files.catbox.moe/kznvpv.jpg",
    "https://framerusercontent.com/assets/QAYMhu4B0xdHJxnySBuabHtks.mp4":
        "https://files.catbox.moe/cr7y9x.jpg",
    "https://framerusercontent.com/assets/ebURoH5YNfEa6FCrcr6l6QFS68Q.mp4":
        "https://files.catbox.moe/evo0n9.jpg",
    "https://framerusercontent.com/assets/HHTkUi7SKOAAtY1MmzC0Q1b54Q.mp4":
        "https://files.catbox.moe/g35zqa.jpg",
    "https://framerusercontent.com/assets/o0EK9YezE48hWm1UC3BcEme8ifY.mp4":
        "https://files.catbox.moe/j1fq56.jpg",
    "https://framerusercontent.com/assets/9Z12PCxBfwmh6gJITSSks4qYGLM.mp4":
        "https://files.catbox.moe/e7rz0t.jpg",
    "https://framerusercontent.com/assets/7MFleSRgo8r2lOEcs94tDjD41TI.mp4":
        "https://files.catbox.moe/w1od7p.jpg",
    "https://framerusercontent.com/assets/YTha6qQtYqtUuIUE9g1ffdEVKc.mp4":
        "https://files.catbox.moe/km22rw.jpg",
    "https://framerusercontent.com/assets/vkN4eGEAUSjfMw2lXOgnL5wcSo.mp4":
        "https://files.catbox.moe/d6r530.jpg",
    "https://framerusercontent.com/assets/qmBGS9TepzZYV60oqT58TCaPs.mp4":
        "https://files.catbox.moe/vpsbqe.jpg",
    "https://framerusercontent.com/assets/dCRutmC1dwoz5Zq4iytCOHvrt8.mp4":
        "https://files.catbox.moe/lfhxki.jpg",
    "https://framerusercontent.com/assets/fB1UokXRbC9y9v6p4jHE2sdVw.mp4":
        "https://files.catbox.moe/2sjcee.jpg",
    "https://framerusercontent.com/assets/bZzIGGcdr27KAso8g1l9AEnulCo.mp4":
        "https://files.catbox.moe/v76dix.jpg",
    "https://framerusercontent.com/assets/1C2aMBrHIm6dxQeXcdJcqDx0xs0.mp4":
        "https://files.catbox.moe/3cw8yw.jpg",
    "https://framerusercontent.com/assets/qCignb1pMHKPdwRrDTF57gpagSo.mp4":
        "https://files.catbox.moe/dk1l9v.jpg",
    "https://framerusercontent.com/assets/WBfSwlJMaWbkJMRpHfYzlbZPLl4.mp4":
        "https://files.catbox.moe/y08ijz.jpg",
    "https://freight.cargo.site/t/original/i/K1752285800188626851517885044245/S-S-Logo-Animation-2.mp4":
        "https://files.catbox.moe/fwvx3b.jpg",
    "https://framerusercontent.com/assets/npEWAtDub3QRSPyGSrWh42ns6H8.mp4":
        "https://files.catbox.moe/dvr4eq.jpg",
    "https://framerusercontent.com/assets/b9f0GkZjSgHCSTkQ6p5mSRBOFRo.mp4":
        "https://files.catbox.moe/e2530s.jpg",
    "https://freight.cargo.site/t/original/i/J1542517319778170274194483566101/All-Cards-Animation_1.mp4":
        "https://files.catbox.moe/nxw2yy.jpg",
    "https://freight.cargo.site/t/original/i/J1543046243473909932978774201877/Joker-Animation-2.mp4":
        "https://files.catbox.moe/d3cxx4.jpg",
    "https://freight.cargo.site/t/original/i/G1540917371720490845266153559573/National-Park-Reel.mp4":
        "https://files.catbox.moe/omeb2s.jpg",
    "https://framerusercontent.com/assets/bAgMXouDBARz3iQbZ7hg5ZwlC4.mp4":
        "https://files.catbox.moe/6l4nr3.jpg",
    "https://freight.cargo.site/t/original/i/L1543258461716816171227936970261/SnapTik_App_7063886141824683311-HD.mp4":
        "https://files.catbox.moe/4qx5vs.jpg",
    "https://freight.cargo.site/t/original/i/S1544927208271577561383525668373/IMG_1174.mov":
        "https://files.catbox.moe/mh254h.jpg",
    "https://freight.cargo.site/t/original/i/Z2116629357142052312463249233429/By-the-Numbers.mp4":
        "https://files.catbox.moe/rotdax.jpg",
}
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
    videoUnloadFar: boolean
    linkCollectionId: string
    linkTitleFieldId: string
}

function isCaseStudyDetailPage(): boolean {
    if (typeof window === "undefined") return false
    const path = window.location.pathname.replace(/\/+$/, "")
    return path.startsWith("/case-studies/") && path.length > "/case-studies/".length
}

function isFeaturedProjectPage(): boolean {
    if (typeof window === "undefined") return false
    return FEATURED_PROJECT_PATHS.has(window.location.pathname.replace(/\/+$/, ""))
}

function normalizeMediaUrl(src: string): string {
    if (!src) return ""
    try {
        const url = new URL(src, window.location.href)
        url.hash = ""
        url.search = ""
        return url.toString()
    } catch {
        return src.split("#")[0].split("?")[0]
    }
}

function getFeaturedProjectPoster(video: HTMLVideoElement): string {
    const candidates = [
        video.currentSrc,
        video.src,
        video.getAttribute("src") || "",
        ...Array.from(video.querySelectorAll("source")).map(
            (source) => source.src || source.getAttribute("src") || ""
        ),
    ]

    for (const candidate of candidates) {
        const poster = FEATURED_PROJECT_VIDEO_POSTERS[normalizeMediaUrl(candidate)]
        if (poster) return poster
    }

    return ""
}

function syncFeaturedProjectVideoPosters() {
    if (typeof document === "undefined") return

    document.querySelectorAll("video").forEach((video) => {
        const poster = getFeaturedProjectPoster(video)
        if (!poster) return

        if (!video.getAttribute("poster")) {
            video.setAttribute("poster", poster)
        }
        if (video.getAttribute("preload") !== "metadata") {
            video.setAttribute("preload", "metadata")
        }
        video.setAttribute("data-featured-project-poster", "true")
    })
}

function useFeaturedProjectPosterPatch() {
    React.useEffect(() => {
        if (typeof document === "undefined" || typeof window === "undefined") return
        if (!isFeaturedProjectPage()) return

        let frame = 0
        const schedule = () => {
            window.cancelAnimationFrame(frame)
            frame = window.requestAnimationFrame(syncFeaturedProjectVideoPosters)
        }
        const timeouts: number[] = []

        schedule()
        ;[75, 200, 500, 1000, 2000, 3500].forEach((delay) => {
            timeouts.push(window.setTimeout(schedule, delay))
        })

        const observer = new MutationObserver(schedule)
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["src", "poster"],
            childList: true,
            subtree: true,
        })

        window.addEventListener("pageshow", schedule)

        return () => {
            window.cancelAnimationFrame(frame)
            timeouts.forEach((timeout) => window.clearTimeout(timeout))
            observer.disconnect()
            window.removeEventListener("pageshow", schedule)
        }
    }, [])
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
    useFeaturedProjectPosterPatch()
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
                <VideoManager
                    enabled
                    lookahead={props.videoLookahead}
                    unloadFarVideos={props.videoUnloadFar}
                />
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
    videoUnloadFar: true,
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
    videoUnloadFar: {
        type: ControlType.Boolean,
        title: "Unload Far",
        defaultValue: true,
        enabledTitle: "Yes",
        disabledTitle: "No",
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
