import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
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
    lightboxVideos: boolean
    videoLookahead: number
    linkCollectionId: string
    linkTitleFieldId: string
}

export default function CaseStudyControllers(props: Props) {
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
