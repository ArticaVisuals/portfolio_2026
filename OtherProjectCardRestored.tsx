import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

type Props = {
    title: string
    sortingNumber: number
    projectLink: string
    link: string
    thumbnailSrc: string
    thumbnailVideoSrc: string
    textColor: string
}

const DEFAULT_TEXT_COLOR = "#233324"
const FLIP_DISTANCE = 18
const THUMBNAIL_ASPECT_RATIO = "1.674 / 1"
const EASING = "cubic-bezier(.22, 1, .36, 1)"
const KNOWN_PROJECT_LINKS: Record<string, string> = {
    "airpods pro 3": "/case-studies/airpods",
    "simon & schuster": "/case-studies/simon-schuster",
    gaia: "/case-studies/gaia",
    "national park playing cards": "/case-studies/national-park-cards",
    "motion connect 2025": "/case-studies/motion-connect-2025",
    yomo: "/case-studies/yomo",
    karuna: "/case-studies/karuna",
    "weaponized innocence": "/case-studies/weaponized-innocence",
    typldn: "/case-studies/typldn",
    "seek truth": "/case-studies/seek-truth",
    "cellular symphony": "/case-studies/cellular-symphony",
    "wolff olins x artcenter": "/case-studies/wolff-olins-x-artcenter",
    "independent lens": "/case-studies/independent-lens",
    "neon lights": "/case-studies/neon-lights",
    "aspen valley landscaping": "/case-studies/aspen-valley-landscaping",
}

function normalizeTitleKey(value: unknown): string {
    return String(value ?? "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim()
}

function isUsableProjectHref(value: string): boolean {
    return Boolean(value && value !== "#" && value !== "/" && value !== ".")
}

function normalizeLinkValue(value: unknown): string {
    if (typeof value === "string") return value.trim()

    if (value && typeof value === "object") {
        const record = value as Record<string, unknown>
        const candidate = record.href || record.url || record.path
        if (typeof candidate === "string") return candidate.trim()
    }

    return ""
}

function normalizeMediaSource(value: unknown): string {
    if (!value) return ""
    if (typeof value === "string") return value.trim()
    if (Array.isArray(value)) {
        return value.map(normalizeMediaSource).find(Boolean) || ""
    }
    if (typeof value === "object") {
        const record = value as Record<string, unknown>
        if ("value" in record) return normalizeMediaSource(record.value)

        for (const key of ["src", "url", "href", "file"]) {
            const source = normalizeMediaSource(record[key])
            if (source) return source
        }
    }
    return ""
}

function resolveProjectHref(projectLink: unknown, link: unknown, title: unknown): string {
    const configuredHref = normalizeLinkValue(projectLink)
    if (isUsableProjectHref(configuredHref)) return configuredHref

    const legacyHref = normalizeLinkValue(link)
    if (isUsableProjectHref(legacyHref)) return legacyHref

    return KNOWN_PROJECT_LINKS[normalizeTitleKey(title)] || "#"
}

function shouldHandleNavigation(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (
        RenderTarget.current() === RenderTarget.canvas ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !href ||
        href === "#" ||
        href === "/"
    ) {
        return false
    }

    if (typeof window === "undefined") return false

    try {
        const url = new URL(href, window.location.href)
        return url.origin === window.location.origin && url.pathname.startsWith("/case-studies/")
    } catch {
        return false
    }
}

/**
 * Restored template-style Other Projects card.
 *
 * @framerIntrinsicWidth 373.5
 * @framerIntrinsicHeight 250
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function OtherProjectCardRestored({
    title = "Title",
    sortingNumber = 0,
    projectLink = "",
    link = "#",
    thumbnailSrc = "",
    thumbnailVideoSrc = "",
    textColor = DEFAULT_TEXT_COLOR,
}: Partial<Props>) {
    const titleText = String(title || "Title").toUpperCase()
    const numberText = Number.isFinite(Number(sortingNumber))
        ? String(Number(sortingNumber))
        : String(sortingNumber || "")
    const href = resolveProjectHref(projectLink, link, title)
    const videoSrc = normalizeMediaSource(thumbnailVideoSrc)
    const hasVideo = Boolean(videoSrc)

    const handleClick = React.useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            if (!shouldHandleNavigation(event, href)) return

            event.preventDefault()
            event.stopPropagation()
            window.location.assign(new URL(href, window.location.href).href)
        },
        [href]
    )

    return (
        <a
            data-framer-name="Other Project Card"
            href={href}
            onClick={handleClick}
            aria-label={`${titleText} project`}
            className="mh-other-project-card"
            style={{ color: textColor }}
        >
            <style>{`
                .mh-other-project-card {
                    width: 100%;
                    height: auto;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: flex-start;
                    gap: 16px;
                    overflow: hidden;
                    padding: 0;
                    text-decoration: none;
                    cursor: pointer;
                }

                .mh-other-project-title {
                    width: 100%;
                    min-height: 13px;
                    display: flex;
                    align-items: flex-start;
                    justify-content: flex-start;
                    gap: 5px;
                    overflow: hidden;
                    font-family: "Azeret Mono", monospace;
                    font-size: 13px;
                    line-height: 1;
                    letter-spacing: -0.01em;
                    text-transform: uppercase;
                    white-space: nowrap;
                }

                .mh-other-project-title__copy {
                    flex: 1 0 0;
                    min-width: 0;
                    height: 13px;
                    overflow: hidden;
                }

                .mh-other-project-title__track {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    transform: translateY(0);
                    transition: transform 420ms ${EASING};
                }

                .mh-other-project-title__line {
                    height: 13px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .mh-other-project-card:hover .mh-other-project-title__track,
                .mh-other-project-card:focus-visible .mh-other-project-title__track {
                    transform: translateY(-${FLIP_DISTANCE}px);
                }

                .mh-other-project-media {
                    position: relative;
                    width: 100%;
                    aspect-ratio: ${THUMBNAIL_ASPECT_RATIO};
                    flex: none;
                    overflow: hidden;
                    background: transparent;
                }

                .mh-other-project-media img,
                .mh-other-project-media video {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    display: block;
                    object-fit: cover;
                    object-position: center;
                }

                .mh-other-project-media video {
                    pointer-events: none;
                    z-index: 1;
                }

                @media (prefers-reduced-motion: reduce) {
                    .mh-other-project-title__track {
                        transition: none;
                    }

                    .mh-other-project-card:hover .mh-other-project-title__track,
                    .mh-other-project-card:focus-visible .mh-other-project-title__track {
                        transform: translateY(0);
                    }
                }
            `}</style>
            <div data-framer-name="Title Wrapper" className="mh-other-project-title">
                <span>{numberText}</span>
                <span>/</span>
                <span className="mh-other-project-title__copy">
                    <span className="mh-other-project-title__track">
                        <span className="mh-other-project-title__line">{titleText}</span>
                        <span className="mh-other-project-title__line">VIEW PROJECT</span>
                    </span>
                </span>
            </div>
            <div data-framer-name="ImageWrapper" className="mh-other-project-media">
                {thumbnailSrc ? (
                    <img
                        data-framer-name="Image"
                        src={thumbnailSrc}
                        alt=""
                        loading="lazy"
                        decoding="async"
                    />
                ) : null}
                {hasVideo ? (
                    <video
                        data-framer-name="Video"
                        src={videoSrc}
                        poster={thumbnailSrc || undefined}
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="metadata"
                    />
                ) : null}
            </div>
        </a>
    )
}

addPropertyControls(OtherProjectCardRestored, {
    title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: "Title",
    },
    sortingNumber: {
        type: ControlType.Number,
        title: "Number",
        defaultValue: 0,
        min: 0,
        step: 1,
        displayStepper: true,
    },
    projectLink: {
        type: ControlType.Link,
        title: "Link",
    },
    link: {
        type: ControlType.Link,
        title: "Legacy Link",
        hidden: () => true,
    },
    thumbnailSrc: {
        type: ControlType.String,
        title: "Image URL",
        defaultValue: "",
    },
    thumbnailVideoSrc: {
        type: ControlType.String,
        title: "Video URL",
        defaultValue: "",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text",
        defaultValue: DEFAULT_TEXT_COLOR,
    },
})
