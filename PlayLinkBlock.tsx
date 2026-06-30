import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

/**
 * PlayLinkBlock
 * -------------
 * A CMS-bindable link block for the Play archive:
 *   • Title       → links to the item (nav-button text style + hover roll)
 *   • Description → muted supporting copy, part of the same item link
 *   • CTA         → optional, links anywhere (same nav-button style + roll)
 *
 * Text style and hover motion are lifted verbatim from the site nav buttons
 * (Info / Index) and the /play panel CLOSE button:
 *   - 'GT Standard Mono Trial', 13px, uppercase, letterSpacing 0, 1:1 line-height
 *   - two stacked identical lines clipped to one line-height; the inner column
 *     rolls up by one line on hover (transform 360ms cubic-bezier(0.16,1,0.3,1)).
 *
 * Bind `title`, `description`, `itemLink`, `ctaLabel` and `ctaLink` to Play
 * Archive CMS fields in the Framer UI.
 */

// ---- Tokens (matched to the site nav + /play panel) ----
const MONO = "'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace"
const BODY = "'GT Standard Trial', 'Inter', system-ui, sans-serif"
const SNAPPY_EASE = "cubic-bezier(0.16, 1, 0.3, 1)"
const ROLL_MS = 360
const BLACK = "rgb(20, 20, 20)"
const TEXT_GRAY = "rgb(110, 110, 110)"

const isCanvas = () =>
    RenderTarget.current() === RenderTarget.canvas ||
    RenderTarget.current() === RenderTarget.thumbnail

// Nav-button label: two stacked lines that roll up one line-height on hover.
function RollLabel({
    text,
    hovered,
    color,
    size,
}: {
    text: string
    hovered: boolean
    color: string
    size: number
}) {
    const lh = size // 1:1 line-height, exactly like the nav buttons
    const line: React.CSSProperties = {
        height: lh,
        lineHeight: `${lh}px`,
        whiteSpace: "nowrap",
    }
    return (
        <span
            aria-hidden="true"
            style={{
                display: "inline-block",
                height: lh,
                lineHeight: `${lh}px`,
                overflow: "hidden",
                fontFamily: MONO,
                fontSize: size,
                letterSpacing: 0,
                textTransform: "uppercase",
                color,
            }}
        >
            <span
                style={{
                    display: "flex",
                    flexDirection: "column",
                    transform: hovered ? `translateY(-${lh}px)` : "translateY(0)",
                    transition: `transform ${ROLL_MS}ms ${SNAPPY_EASE}`,
                    willChange: "transform",
                }}
            >
                <span style={line}>{text}</span>
                <span style={line}>{text}</span>
            </span>
        </span>
    )
}

// Renders an <a> when a real link exists (and we're not on the editor canvas),
// otherwise an inert <div> so the canvas never navigates.
function LinkBox({
    href,
    newTab,
    inert,
    ariaLabel,
    setHovered,
    style,
    children,
}: {
    href?: string
    newTab?: boolean
    inert: boolean
    ariaLabel: string
    setHovered: (v: boolean) => void
    style: React.CSSProperties
    children: React.ReactNode
}) {
    const handlers = {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        onFocus: () => setHovered(true),
        onBlur: () => setHovered(false),
    }
    if (href && !inert) {
        return (
            <a
                href={href}
                target={newTab ? "_blank" : undefined}
                rel={newTab ? "noopener noreferrer" : undefined}
                aria-label={ariaLabel}
                style={{ ...style, textDecoration: "none", cursor: "pointer" }}
                {...handlers}
            >
                {children}
            </a>
        )
    }
    return (
        <div aria-label={ariaLabel} style={style} {...handlers}>
            {children}
        </div>
    )
}

type Props = {
    title?: string
    description?: string
    itemLink?: string
    openItemInNewTab?: boolean
    showCta?: boolean
    ctaLabel?: string
    ctaLink?: string
    openCtaInNewTab?: boolean
    titleColor?: string
    descriptionColor?: string
    ctaColor?: string
    titleSize?: number
    descriptionSize?: number
    gap?: number
    ctaGap?: number
    style?: React.CSSProperties
}

export default function PlayLinkBlock(props: Props) {
    const {
        title = "Project Title",
        description = "",
        itemLink,
        openItemInNewTab = false,
        showCta = false,
        ctaLabel = "View project",
        ctaLink,
        openCtaInNewTab = true,
        titleColor = BLACK,
        descriptionColor = TEXT_GRAY,
        ctaColor = BLACK,
        titleSize = 13,
        descriptionSize = 16,
        gap = 10,
        ctaGap = 16,
        style,
    } = props

    const inert = isCanvas()
    const [itemHover, setItemHover] = React.useState(false)
    const [ctaHover, setCtaHover] = React.useState(false)

    const hasCta = Boolean(showCta && ctaLabel && (ctaLink || inert))

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap,
                width: "100%",
                maxWidth: "100%",
                fontFamily: MONO,
                ...style,
            }}
        >
            {/* Title + description → the item */}
            <LinkBox
                href={itemLink}
                newTab={openItemInNewTab}
                inert={inert}
                ariaLabel={title}
                setHovered={setItemHover}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap,
                    width: "fit-content",
                    maxWidth: "100%",
                }}
            >
                <RollLabel
                    text={title}
                    hovered={itemHover}
                    color={titleColor}
                    size={titleSize}
                />
                {description ? (
                    <div
                        style={{
                            fontFamily: BODY,
                            fontSize: descriptionSize,
                            lineHeight: "140%",
                            letterSpacing: 0,
                            color: descriptionColor,
                            maxWidth: "100%",
                            overflowWrap: "break-word",
                            textTransform: "none",
                        }}
                    >
                        {description}
                    </div>
                ) : null}
            </LinkBox>

            {/* Optional CTA → anywhere */}
            {hasCta ? (
                <LinkBox
                    href={ctaLink}
                    newTab={openCtaInNewTab}
                    inert={inert}
                    ariaLabel={ctaLabel}
                    setHovered={setCtaHover}
                    style={{
                        display: "inline-flex",
                        width: "fit-content",
                        marginTop: Math.max(0, ctaGap - gap),
                    }}
                >
                    <RollLabel
                        text={ctaLabel}
                        hovered={ctaHover}
                        color={ctaColor}
                        size={titleSize}
                    />
                </LinkBox>
            ) : null}
        </div>
    )
}

PlayLinkBlock.displayName = "Play Link Block"

const hideUnlessCta = ({ showCta }: Partial<Props>) => !showCta

addPropertyControls(PlayLinkBlock, {
    title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: "Project Title",
        placeholder: "Bind to CMS Title",
    },
    description: {
        type: ControlType.String,
        title: "Description",
        defaultValue: "",
        displayTextArea: true,
        placeholder: "Bind to CMS description",
    },
    itemLink: {
        type: ControlType.Link,
        title: "Item Link",
    },
    openItemInNewTab: {
        type: ControlType.Boolean,
        title: "Item Tab",
        defaultValue: false,
        enabledTitle: "New",
        disabledTitle: "Same",
    },
    showCta: {
        type: ControlType.Boolean,
        title: "CTA",
        defaultValue: false,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
    ctaLabel: {
        type: ControlType.String,
        title: "CTA Label",
        defaultValue: "View project",
        hidden: hideUnlessCta,
    },
    ctaLink: {
        type: ControlType.Link,
        title: "CTA Link",
        hidden: hideUnlessCta,
    },
    openCtaInNewTab: {
        type: ControlType.Boolean,
        title: "CTA Tab",
        defaultValue: true,
        enabledTitle: "New",
        disabledTitle: "Same",
        hidden: hideUnlessCta,
    },
    titleColor: {
        type: ControlType.Color,
        title: "Title Color",
        defaultValue: BLACK,
    },
    descriptionColor: {
        type: ControlType.Color,
        title: "Desc Color",
        defaultValue: TEXT_GRAY,
    },
    ctaColor: {
        type: ControlType.Color,
        title: "CTA Color",
        defaultValue: BLACK,
        hidden: hideUnlessCta,
    },
    titleSize: {
        type: ControlType.Number,
        title: "Label Size",
        defaultValue: 13,
        min: 10,
        max: 48,
        step: 1,
        unit: "px",
    },
    descriptionSize: {
        type: ControlType.Number,
        title: "Desc Size",
        defaultValue: 16,
        min: 10,
        max: 32,
        step: 1,
        unit: "px",
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        defaultValue: 10,
        min: 0,
        max: 60,
        step: 1,
        unit: "px",
    },
    ctaGap: {
        type: ControlType.Number,
        title: "CTA Gap",
        defaultValue: 16,
        min: 0,
        max: 80,
        step: 1,
        unit: "px",
        hidden: hideUnlessCta,
    },
})
