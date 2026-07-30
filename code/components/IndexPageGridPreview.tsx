// @ts-nocheck
import React from "react"
import { addPropertyControls, ControlType } from "framer"
import BaseIndexPage from "https://framer.com/m/IndexPage-msQHCf.js"

const PREVIEW_ADVANCED_DEFAULT = {
    defaultView: "list",
    listHoverVariant: "flip",
    gridLayoutVariant: "figma",
    textPrimary: "#141414",
    textSecondary: "#141414",
    textTertiary: "#979797",
    bg: "#F7F5F0",
    dividerStrong: "#141414",
    dividerSubtle: "#141414",
    surfaceActive: "#EAE8E3",
}

const GRID_LOCK_CSS = `
.idx-grid-preview-locked {
    container-type: inline-size;
}

.idx-grid-preview-locked .idx-project-grid[data-grid-layout="figma"] {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    justify-content: stretch !important;
    max-width: none !important;
    row-gap: 52px !important;
}

.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"] {
    gap: 14px !important;
}

.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"] .idx-grid-card-heading,
.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"] .idx-grid-card-title {
    color: #141414 !important;
    display: grid !important;
    font-family: 'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace !important;
    font-size: 13px !important;
    font-weight: 400 !important;
    grid-template-columns: 24px 11px minmax(0, 1fr) !important;
    letter-spacing: 0 !important;
    line-height: 13px !important;
    margin: 0 !important;
    min-height: 13px !important;
    overflow: hidden !important;
    text-transform: uppercase !important;
    white-space: nowrap !important;
    width: 100% !important;
}

.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"] .idx-grid-card-heading *,
.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"] .idx-grid-card-title * {
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    letter-spacing: inherit !important;
    line-height: inherit !important;
    text-transform: inherit !important;
}

.idx-grid-preview-locked .idx-grid-title-frame,
.idx-grid-preview-locked .idx-grid-title-stack > span {
    height: 13px !important;
    line-height: 13px !important;
}

.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"]:hover .idx-grid-title-stack,
.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"]:focus-visible .idx-grid-title-stack {
    transform: translate3d(0, -18px, 0) !important;
}

.idx-grid-preview-locked .idx-grid-card-tag {
    font-size: 12px !important;
    line-height: 1 !important;
    min-height: 23px !important;
    padding: 5px 10px 6px !important;
}

.idx-grid-preview-locked .idx-list-row-grid {
    min-height: 56px !important;
    padding: 9px 0 !important;
}

.idx-grid-preview-locked .idx-year-label {
    padding-top: 15px !important;
}

.idx-grid-preview-locked .idx-list-standard .idx-flip-text {
    --idx-flip-height: 27px !important;
    height: 27px !important;
    line-height: 27px !important;
}

.idx-grid-preview-locked .idx-list-standard .idx-flip-copy {
    flex: 0 0 var(--idx-flip-height) !important;
    height: var(--idx-flip-height) !important;
    line-height: var(--idx-flip-height) !important;
}

@container (max-width: 1199px) {
    .idx-grid-preview-locked .idx-project-grid[data-grid-layout="figma"] {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        max-width: none !important;
    }
}

@container (max-width: 899px) {
    .idx-grid-preview-locked .idx-project-grid[data-grid-layout="figma"] {
        grid-template-columns: 1fr !important;
        max-width: none !important;
        row-gap: 52px !important;
    }
}

@container (max-width: 899px) {
    .idx-grid-preview-locked .idx-list-view .idx-year-group {
        grid-template-columns: 1fr !important;
        column-gap: 0 !important;
    }

    .idx-grid-preview-locked .idx-list-view .idx-year-label,
    .idx-grid-preview-locked .idx-list-view .idx-list-discipline,
    .idx-grid-preview-locked .idx-list-view .idx-col-discipline,
    .idx-grid-preview-locked .idx-list-view .idx-list-industry,
    .idx-grid-preview-locked .idx-list-view .idx-col-industry {
        display: none !important;
    }

    .idx-grid-preview-locked .idx-list-view .idx-list-content,
    .idx-grid-preview-locked .idx-list-view .idx-list-title {
        grid-column: 1 / -1 !important;
        min-width: 0 !important;
        width: 100% !important;
    }

    .idx-grid-preview-locked .idx-list-view .idx-list-row-grid {
        grid-template-columns: minmax(0, 1fr) !important;
        column-gap: 0 !important;
    }

    .idx-grid-preview-locked .idx-list-view .idx-title-cell {
        justify-self: stretch !important;
        text-align: left !important;
    }

    .idx-grid-preview-locked .idx-list-view .idx-year-rule,
    .idx-grid-preview-locked .idx-list-view .idx-row-divider,
    .idx-grid-preview-locked .idx-list-view .idx-list-bottom-rule {
        grid-column: 1 / -1 !important;
        width: 100% !important;
    }
}
`

/**
 * Wrapper for previewing or publishing the Figma index grid layout while
 * preserving the CMS-backed IndexPage implementation.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 900
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export function IndexPage(props) {
    const { view, advanced, projects, useCMS = true, ...baseProps } = props
    const selectedView = view === "grid" ? "grid" : "list"

    return (
        <div
            className="idx-grid-preview-locked"
            data-cms-source={useCMS ? "cms" : "manual"}
            data-media-priority="video"
            style={{ width: "100%" }}
        >
            <style
                data-index-grid-preview-css="true"
                suppressHydrationWarning
            >
                {GRID_LOCK_CSS}
            </style>
            <BaseIndexPage
                key={`index-${selectedView}`}
                {...baseProps}
                useCMS={useCMS}
                // CMS mode must not receive hidden manual project rows from the canvas.
                projects={useCMS ? [] : projects}
                defaultView={selectedView}
                gridLayoutVariant="figma"
                advanced={{
                    ...advanced,
                    defaultView: selectedView,
                    gridLayoutVariant: "figma",
                }}
            />
        </div>
    )
}

IndexPage.displayName = "IndexPage"

export default IndexPage

addPropertyControls(IndexPage, {
    view: {
        type: ControlType.Enum,
        title: "View",
        options: ["grid", "list"],
        optionTitles: ["Grid", "List"],
        defaultValue: "list",
        displaySegmentedControl: true,
    },
    useCMS: {
        type: ControlType.Boolean,
        title: "Use CMS",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    cmsModuleUrl: {
        type: ControlType.String,
        title: "CMS Module",
        defaultValue: "",
        placeholder: "Optional module URL",
    },
    thumbnailVideoFieldIds: {
        type: ControlType.String,
        title: "Video Field",
        defaultValue: "SvOqFqdby",
    },
    projects: {
        type: ControlType.Array,
        title: "Projects",
        hidden: (props) => props.useCMS === true,
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title" },
                category1: { type: ControlType.String, title: "Service 1" },
                category2: { type: ControlType.String, title: "Service 2" },
                category3: { type: ControlType.String, title: "Service 3" },
                industry: { type: ControlType.String, title: "Industry" },
                year: { type: ControlType.String, title: "Year" },
                thumbnail: { type: ControlType.Image, title: "Thumbnail" },
                thumbnailVideoLink: {
                    type: ControlType.File,
                    title: "Thumbnail Video",
                    allowedFileTypes: ["mp4", "mov", "m4v", "webm"],
                },
                thumbnailStroke: {
                    type: ControlType.Boolean,
                    title: "Thumbnail Stroke",
                    defaultValue: false,
                },
                slug: { type: ControlType.String, title: "Slug" },
                sortOrder: {
                    type: ControlType.Number,
                    title: "Sorting Number",
                },
                isHomepage: { type: ControlType.Boolean, title: "Is Homepage" },
            },
        },
    },
    advanced: {
        type: ControlType.Object,
        title: "Advanced",
        buttonTitle: "Edit",
        icon: "effect",
        defaultValue: PREVIEW_ADVANCED_DEFAULT,
        controls: {
            textPrimary: {
                type: ControlType.Color,
                title: "Text Primary",
                defaultValue: PREVIEW_ADVANCED_DEFAULT.textPrimary,
            },
            textSecondary: {
                type: ControlType.Color,
                title: "Text Secondary",
                defaultValue: PREVIEW_ADVANCED_DEFAULT.textSecondary,
            },
            textTertiary: {
                type: ControlType.Color,
                title: "Text Tertiary",
                defaultValue: PREVIEW_ADVANCED_DEFAULT.textTertiary,
            },
            bg: {
                type: ControlType.Color,
                title: "Background",
                defaultValue: PREVIEW_ADVANCED_DEFAULT.bg,
            },
            dividerStrong: {
                type: ControlType.Color,
                title: "Divider Strong",
                defaultValue: PREVIEW_ADVANCED_DEFAULT.dividerStrong,
            },
            dividerSubtle: {
                type: ControlType.Color,
                title: "Divider Subtle",
                defaultValue: PREVIEW_ADVANCED_DEFAULT.dividerSubtle,
            },
            surfaceActive: {
                type: ControlType.Color,
                title: "Surface Active",
                defaultValue: PREVIEW_ADVANCED_DEFAULT.surfaceActive,
            },
        },
    },
})
