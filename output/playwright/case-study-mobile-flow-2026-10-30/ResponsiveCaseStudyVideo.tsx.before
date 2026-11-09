import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

interface ResponsiveCaseStudyVideoProps {
    src: string
    poster?: string
    ratio: number
    autoplay: boolean
    loop: boolean
    muted: boolean
    controls: boolean
    title: string
    style?: React.CSSProperties
}

function getYouTubeId(src: string) {
    if (!src) return ""

    try {
        const url = new URL(src)
        const host = url.hostname.replace(/^www\./, "")

        if (host === "youtu.be") {
            return url.pathname.split("/").filter(Boolean)[0] || ""
        }

        if (host === "youtube.com" || host === "m.youtube.com") {
            if (url.pathname === "/watch") return url.searchParams.get("v") || ""

            const parts = url.pathname.split("/").filter(Boolean)
            if (["embed", "shorts", "live"].includes(parts[0])) return parts[1] || ""
        }
    } catch {
        const match = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([^?&#/]+)/)
        return match?.[1] || ""
    }

    return ""
}

function getVimeoData(src: string) {
    if (!src) return null

    try {
        const url = new URL(src)
        const host = url.hostname.replace(/^www\./, "")
        const parts = url.pathname.split("/").filter(Boolean)

        if (host === "player.vimeo.com" && parts[0] === "video" && parts[1]) {
            return {
                videoId: parts[1],
                privacyHash: url.searchParams.get("h") || "",
            }
        }

        if (host === "vimeo.com" || host === "m.vimeo.com") {
            const videoIdIndex = parts.findIndex((part) => /^\d+$/.test(part))
            if (videoIdIndex >= 0) {
                return {
                    videoId: parts[videoIdIndex],
                    privacyHash: url.searchParams.get("h") || parts[videoIdIndex + 1] || "",
                }
            }
        }
    } catch {
        const match = src.match(/(?:player\.vimeo\.com\/video\/|vimeo\.com\/)(\d+)(?:\/([A-Za-z0-9]+))?[^\s]*/)
        if (match?.[1]) {
            const hashMatch = src.match(/[?&]h=([^&#]+)/)
            return {
                videoId: match[1],
                privacyHash: hashMatch?.[1] || match[2] || "",
            }
        }
    }

    return null
}

function buildYouTubeEmbedUrl(src: string, props: ResponsiveCaseStudyVideoProps) {
    const videoId = getYouTubeId(src)
    if (!videoId) return ""

    const params = new URLSearchParams({
        autoplay: props.autoplay ? "1" : "0",
        controls: props.controls ? "1" : "0",
        loop: props.loop ? "1" : "0",
        playsinline: "1",
        rel: "0",
    })

    if (props.loop) params.set("playlist", videoId)
    if (props.muted) params.set("mute", "1")

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}

function buildVimeoEmbedUrl(src: string, props: ResponsiveCaseStudyVideoProps) {
    const vimeo = getVimeoData(src)
    if (!vimeo?.videoId) return ""

    const params = new URLSearchParams({
        autoplay: props.autoplay ? "1" : "0",
        controls: props.controls ? "1" : "0",
        loop: props.loop ? "1" : "0",
        muted: props.muted ? "1" : "0",
        playsinline: "1",
        dnt: "1",
    })

    if (vimeo.privacyHash) params.set("h", vimeo.privacyHash)

    return `https://player.vimeo.com/video/${vimeo.videoId}?${params.toString()}`
}

/**
 * Responsive Case Study Video
 *
 * @framerIntrinsicWidth 1600
 * @framerIntrinsicHeight 900
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function ResponsiveCaseStudyVideo(props: ResponsiveCaseStudyVideoProps) {
    const {
        src,
        poster,
        ratio,
        autoplay,
        loop,
        muted,
        controls,
        title,
        style,
    } = props

    const isImageSource = /\.(gif|jpe?g|png|webp|avif|svg)(\?.*)?$/i.test(src)
    const youtubeEmbedUrl = buildYouTubeEmbedUrl(src, props)
    const vimeoEmbedUrl = youtubeEmbedUrl ? "" : buildVimeoEmbedUrl(src, props)

    return (
        <div
            style={{
                ...style,
                width: "100%",
                height: "auto",
                aspectRatio: ratio,
                display: "block",
                overflow: "hidden",
                background: "transparent",
            }}
        >
            {isImageSource ? (
                <img
                    src={src}
                    alt={title || "Case study media"}
                    loading="lazy"
                    style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        background: "transparent",
                    }}
                />
            ) : youtubeEmbedUrl ? (
                <iframe
                    src={youtubeEmbedUrl}
                    title={title || "YouTube video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        border: 0,
                        background: "transparent",
                    }}
                />
            ) : vimeoEmbedUrl ? (
                <iframe
                    src={vimeoEmbedUrl}
                    title={title || "Vimeo video"}
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        border: 0,
                        background: "transparent",
                    }}
                />
            ) : (
                <video
                    src={src}
                    poster={poster || undefined}
                    autoPlay={autoplay}
                    loop={loop}
                    muted={muted}
                    controls={controls}
                    playsInline
                    preload="metadata"
                    style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        background: "transparent",
                    }}
                />
            )}
        </div>
    )
}

addPropertyControls(ResponsiveCaseStudyVideo, {
    src: {
        type: ControlType.String,
        title: "Source",
        defaultValue: "",
    },
    poster: {
        type: ControlType.String,
        title: "Poster",
        defaultValue: "",
    },
    ratio: {
        type: ControlType.Number,
        title: "Ratio",
        defaultValue: 1.7777777778,
        min: 0.2,
        max: 4,
        step: 0.01,
    },
    autoplay: {
        type: ControlType.Boolean,
        title: "Autoplay",
        defaultValue: true,
    },
    loop: {
        type: ControlType.Boolean,
        title: "Loop",
        defaultValue: true,
    },
    muted: {
        type: ControlType.Boolean,
        title: "Muted",
        defaultValue: true,
    },
    controls: {
        type: ControlType.Boolean,
        title: "Controls",
        defaultValue: false,
    },
    title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: "Case study video",
    },
})

