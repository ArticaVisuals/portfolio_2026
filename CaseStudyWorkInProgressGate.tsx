import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

type Props = {
    status: "ready" | "wip"
    redirectPath: string
    backgroundColor: string
    textColor: string
    lockScroll: boolean
    showCanvasPreview: boolean
    style?: React.CSSProperties
}

// Heading text matched to the project's /Heading 3 style (GT Standard L
// Regular, -0.01em tracking, 1.2em line-height) so the letters breathe.
const WIP_TEXT = "Work in Progress"
const DEFAULT_BACKGROUND = "#f6f6f6"
const DEFAULT_TEXT = "#233324"
const DEFAULT_REDIRECT_PATH = "/index"
// The cover sits just under the site nav (which is position:fixed z-index:8),
// matching the PageTransition "wipe under nav" convention. This keeps the real
// Navigation component visible and clickable on top of the cover, while all
// case-study content (z <= 6, plus the off-screen footer while scroll is
// locked) stays hidden.
const OVERLAY_Z = 7

const HEADING_STACK =
    '"GT Standard L Regular", "GT Standard L Regular Placeholder", "GT Standard Trial L", Manrope, sans-serif'

const OVERLAY_ID = "mh-wip-overlay"
const STYLE_ID = "mh-wip-overlay-style"
const SCROLL_PREV_KEY = "__mhWipPrevOverflow"
const REMOVE_RAF_KEY = "__mhWipRemoveRaf"

const OVERLAY_CSS = `
#${OVERLAY_ID}{position:fixed;inset:0;display:grid;place-items:center;box-sizing:border-box;width:100vw;min-width:100vw;height:100dvh;min-height:100vh;padding:16px;overscroll-behavior:none;pointer-events:auto;}
#${OVERLAY_ID} .mh-wip-action{color:inherit;text-decoration:none;cursor:pointer;font-family:${HEADING_STACK};font-weight:400;font-size:40px;line-height:1.2em;letter-spacing:-0.01em;text-align:center;text-transform:none;white-space:pre;max-width:calc(100vw - 32px);}
#${OVERLAY_ID} .mh-wip-action:focus-visible{outline:1px solid currentColor;outline-offset:10px;}
@media (max-width:1199px){#${OVERLAY_ID} .mh-wip-action{font-size:34px;}}
@media (max-width:809px){#${OVERLAY_ID} .mh-wip-action{font-size:27px;}}
@media (max-width:479px){#${OVERLAY_ID} .mh-wip-action{font-size:22px;}}
`

function canUseDOM() {
    return typeof window !== "undefined" && typeof document !== "undefined"
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
}

function buildOverlayHTML(redirect: string) {
    return (
        `<a class="mh-wip-action" href="${escapeHtml(redirect || DEFAULT_REDIRECT_PATH)}" aria-label="${escapeHtml(
            `${WIP_TEXT}. Go to index`
        )}">${escapeHtml(WIP_TEXT)}</a>`
    )
}

// ---------------------------------------------------------------------------
// Imperative, body-level overlay. Kept outside React so it can be painted at
// the earliest possible moment — at HTML parse time via the seed script on a
// hard load, and pre-paint via a layout effect on SPA navigation.
// ---------------------------------------------------------------------------

function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return
    const style = document.createElement("style")
    style.id = STYLE_ID
    style.textContent = OVERLAY_CSS
    ;(document.head || document.documentElement).appendChild(style)
}

function lockScrollNow() {
    const win = window as any
    if (win[SCROLL_PREV_KEY] === undefined) {
        win[SCROLL_PREV_KEY] = document.documentElement.style.overflow
    }
    document.documentElement.style.overflow = "hidden"
}

function unlockScroll() {
    const win = window as any
    if (win[SCROLL_PREV_KEY] !== undefined) {
        document.documentElement.style.overflow = String(win[SCROLL_PREV_KEY] || "")
        delete win[SCROLL_PREV_KEY]
    }
}

function cancelPendingRemoval() {
    const win = window as any
    if (win[REMOVE_RAF_KEY]) {
        cancelAnimationFrame(win[REMOVE_RAF_KEY])
        delete win[REMOVE_RAF_KEY]
    }
}

function paintOverlay(bg: string, color: string, redirect: string, lockScroll: boolean) {
    if (!canUseDOM()) return
    cancelPendingRemoval()

    let overlay = document.getElementById(OVERLAY_ID) as HTMLElement | null
    if (!overlay) {
        ensureStyle()
        overlay = document.createElement("div")
        overlay.id = OVERLAY_ID
        overlay.setAttribute("data-case-study-work-in-progress", "true")
        overlay.setAttribute("role", "region")
        overlay.setAttribute("aria-label", WIP_TEXT)
        overlay.innerHTML = buildOverlayHTML(redirect)
        ;(document.body || document.documentElement).appendChild(overlay)

        if (lockScroll) lockScrollNow()
    } else {
        const action = overlay.querySelector(".mh-wip-action") as HTMLAnchorElement | null
        if (action) action.setAttribute("href", redirect || DEFAULT_REDIRECT_PATH)
    }

    overlay.style.background = bg
    overlay.style.color = color
    overlay.style.zIndex = String(OVERLAY_Z)
}

function scheduleRemoval() {
    if (!canUseDOM()) return
    const win = window as any
    cancelPendingRemoval()
    // Defer one frame so a WIP -> WIP navigation (cleanup then re-paint in the
    // same commit) keeps the overlay on screen seamlessly.
    win[REMOVE_RAF_KEY] = requestAnimationFrame(() => {
        delete win[REMOVE_RAF_KEY]
        const overlay = document.getElementById(OVERLAY_ID)
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay)
        unlockScroll()
    })
}

// Seed script: runs at HTML parse time on a hard load / refresh / direct visit,
// before hydration, so the cover is on screen before the unfinished case study
// can paint. Mirrors paintOverlay() imperatively as a string.
function buildSeedScript(bg: string, color: string, redirect: string, lockScroll: boolean) {
    const q = JSON.stringify
    return (
        "(function(){try{" +
        "var d=document;" +
        "if(d.getElementById(" +
        q(OVERLAY_ID) +
        "))return;" +
        "if(!d.getElementById(" +
        q(STYLE_ID) +
        ")){var s=d.createElement('style');s.id=" +
        q(STYLE_ID) +
        ";s.textContent=" +
        q(OVERLAY_CSS) +
        ";(d.head||d.documentElement).appendChild(s);}" +
        "var o=d.createElement('div');o.id=" +
        q(OVERLAY_ID) +
        ";o.setAttribute('data-case-study-work-in-progress','true');o.setAttribute('role','region');o.setAttribute('aria-label'," +
        q(WIP_TEXT) +
        ");o.style.background=" +
        q(bg) +
        ";o.style.color=" +
        q(color) +
        ";o.style.zIndex=" +
        q(String(OVERLAY_Z)) +
        ";o.innerHTML=" +
        q(buildOverlayHTML(redirect)) +
        ";(d.body||d.documentElement).appendChild(o);" +
        (lockScroll
            ? "try{var w=window;if(w[" +
              q(SCROLL_PREV_KEY) +
              "]===undefined){w[" +
              q(SCROLL_PREV_KEY) +
              "]=d.documentElement.style.overflow;}d.documentElement.style.overflow='hidden';}catch(e){}"
            : "") +
        "}catch(e){}})()"
    )
}

const useIsomorphicLayoutEffect = canUseDOM() ? React.useLayoutEffect : React.useEffect

/**
 * Case Study Work In Progress Gate
 *
 * Drop this onto any bespoke case-study page and switch Status to
 * "Work in Progress" to replace the published page with the 404-style
 * cream/forest screen. The cover sits just under the real site Navigation
 * (z-index 8) so the existing nav stays visible and usable, and the centered
 * "Work in Progress" text links to the Index page. The cover is painted at
 * HTML parse time on hard loads and pre-paint on SPA navigation, so the
 * unfinished page never flashes.
 *
 * @framerIntrinsicWidth 180
 * @framerIntrinsicHeight 60
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function CaseStudyWorkInProgressGate(props: Props) {
    const enabled = props.status === "wip"
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    const redirect = props.redirectPath || DEFAULT_REDIRECT_PATH
    const bg = props.backgroundColor || DEFAULT_BACKGROUND
    const color = props.textColor || DEFAULT_TEXT
    const lockScroll = props.lockScroll !== false

    useIsomorphicLayoutEffect(() => {
        if (!enabled || isCanvas || !canUseDOM()) return
        paintOverlay(bg, color, redirect, lockScroll)
        return () => {
            scheduleRemoval()
        }
    }, [enabled, isCanvas, bg, color, redirect, lockScroll])

    if (isCanvas) {
        return props.showCanvasPreview ? (
            <div
                style={{
                    ...props.style,
                    width: "100%",
                    height: "100%",
                    minWidth: 180,
                    minHeight: 60,
                    display: "grid",
                    placeItems: "center",
                    boxSizing: "border-box",
                    padding: 12,
                    background: bg,
                    color,
                    border: `1px solid ${color}`,
                    fontFamily: HEADING_STACK,
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: "1.2em",
                    letterSpacing: "-0.01em",
                    textAlign: "center",
                }}
            >
                {enabled ? WIP_TEXT : "Ready"}
            </div>
        ) : (
            <div
                aria-hidden="true"
                style={{ ...props.style, width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
            />
        )
    }

    // Live site. The visible overlay is imperative (see effect / seed script);
    // React only emits the parse-time seed script plus a hidden 1px helper.
    return (
        <>
            {enabled && (
                <script
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{ __html: buildSeedScript(bg, color, redirect, lockScroll) }}
                />
            )}
            <div
                aria-hidden="true"
                style={{ ...props.style, width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
            />
        </>
    )
}

CaseStudyWorkInProgressGate.defaultProps = {
    status: "ready",
    redirectPath: DEFAULT_REDIRECT_PATH,
    backgroundColor: DEFAULT_BACKGROUND,
    textColor: DEFAULT_TEXT,
    lockScroll: true,
    showCanvasPreview: true,
} as Partial<Props>

addPropertyControls(CaseStudyWorkInProgressGate, {
    status: {
        type: ControlType.Enum,
        title: "Status",
        defaultValue: "ready",
        options: ["ready", "wip"],
        optionTitles: ["Ready", "Work in Progress"],
        displaySegmentedControl: true,
    },
    redirectPath: {
        type: ControlType.String,
        title: "Link",
        defaultValue: DEFAULT_REDIRECT_PATH,
        hidden: ({ status }) => status !== "wip",
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "BG",
        defaultValue: DEFAULT_BACKGROUND,
        hidden: ({ status }) => status !== "wip",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text",
        defaultValue: DEFAULT_TEXT,
        hidden: ({ status }) => status !== "wip",
    },
    lockScroll: {
        type: ControlType.Boolean,
        title: "Scroll",
        defaultValue: true,
        enabledTitle: "Lock",
        disabledTitle: "Allow",
        hidden: ({ status }) => status !== "wip",
    },
    showCanvasPreview: {
        type: ControlType.Boolean,
        title: "Canvas",
        defaultValue: true,
        enabledTitle: "Preview",
        disabledTitle: "Hide",
        hidden: ({ status }) => status !== "wip",
    },
})

CaseStudyWorkInProgressGate.displayName = "Case Study Work In Progress Gate"
