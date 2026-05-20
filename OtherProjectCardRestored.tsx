import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Props = {
    title: string
    sortingNumber: number
    link: string
    thumbnailSrc: string
    thumbnailVideoSrc: string
    textColor: string
}

const DEFAULT_TEXT_COLOR = "#233324"
const FLIP_DISTANCE = 18
const THUMBNAIL_ASPECT_RATIO = "1.674 / 1"
const EASING = "cubic-bezier(.22, 1, .36, 1)"

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
    link = "#",
    thumbnailSrc = "",
    thumbnailVideoSrc = "",
    textColor = DEFAULT_TEXT_COLOR,
}: Partial<Props>) {
    const titleText = String(title || "Title").toUpperCase()
    const numberText = Number.isFinite(Number(sortingNumber))
        ? String(Number(sortingNumber))
        : String(sortingNumber || "")
    const hasVideo = Boolean(thumbnailVideoSrc)

    return (
        <a
            data-framer-name="Other Project Card"
            href={link || "#"}
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
                    <img data-framer-name="Image" src={thumbnailSrc} alt="" loading="lazy" />
                ) : null}
                {hasVideo ? (
                    <video
                        data-framer-name="Video"
                        src={thumbnailVideoSrc}
                        muted
                        loop
                        autoPlay
                        playsInline
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
    link: {
        type: ControlType.Link,
        title: "Link",
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
