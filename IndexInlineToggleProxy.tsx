import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Props = {
    right: number
    verticalOffset: number
    gap: number
    fontSize: number
    activeOpacity: number
    inactiveOpacity: number
}

const STYLE_ID = "artica-index-inline-toggle-proxy-styles"
const PROXY_ATTR = "data-index-inline-toggle-proxy"
const HIDDEN_ATTR = "data-index-inline-toggle-hidden-original"
const TOKENS = {
    textPrimary: "#26211f",
    hover: "#979797",
    rule: "#979797",
    fontMono: "'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace",
}

function getOriginalButtons() {
    const root = document.querySelector<HTMLElement>(".idx-toggle-fixed")
    if (!root) return null

    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>("button"))
    const list = buttons.find((button) => button.textContent?.trim().toLowerCase() === "list")
    const grid = buttons.find((button) => button.textContent?.trim().toLowerCase() === "grid")
    if (!list || !grid) return null

    return { root, list, grid }
}

function hideOriginalToggle(root: HTMLElement) {
    if (!root.hasAttribute(HIDDEN_ATTR)) {
        root.setAttribute(HIDDEN_ATTR, "true")
        root.dataset.previousOpacity = root.style.opacity
        root.dataset.previousPointerEvents = root.style.pointerEvents
    }

    root.style.opacity = "0"
    root.style.pointerEvents = "none"
}

function restoreOriginalToggles() {
    document.querySelectorAll<HTMLElement>(`.idx-toggle-fixed[${HIDDEN_ATTR}="true"]`).forEach((root) => {
        root.style.opacity = root.dataset.previousOpacity || ""
        root.style.pointerEvents = root.dataset.previousPointerEvents || ""
        delete root.dataset.previousOpacity
        delete root.dataset.previousPointerEvents
        root.removeAttribute(HIDDEN_ATTR)
    })
}

function detectActiveView(container: HTMLElement) {
    if (container.querySelector(".idx-project-grid")) return "grid"
    if (container.querySelector(".idx-list-view")) return "list"
    return "list"
}

function ensureStyle() {
    let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null
    if (!style) {
        style = document.createElement("style")
        style.id = STYLE_ID
        document.head.appendChild(style)
    }

    style.textContent = `
        .idx-container {
            position: relative !important;
        }

        .idx-container .idx-rule,
        .idx-container .idx-row-divider,
        .idx-container .idx-grid-top-rule,
        .idx-container .idx-list-year-rule,
        .idx-container .idx-list-bottom-rule {
            background-color: ${TOKENS.rule} !important;
            border-color: ${TOKENS.rule} !important;
            opacity: 1 !important;
        }

        [${PROXY_ATTR}="true"] {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            color: ${TOKENS.textPrimary};
            font-family: ${TOKENS.fontMono};
            font-weight: 500;
            font-size: var(--idx-inline-toggle-font-size, 13px);
            line-height: 100%;
            letter-spacing: 0;
            text-transform: uppercase;
            z-index: 120;
            white-space: nowrap;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        [${PROXY_ATTR}="true"] button {
            appearance: none;
            border: 0;
            background: transparent;
            padding: 0;
            margin: 0;
            color: inherit;
            -webkit-text-fill-color: currentColor;
            font: inherit;
            line-height: inherit;
            letter-spacing: inherit;
            text-transform: inherit;
            text-decoration-line: none;
            text-decoration-color: transparent;
            text-decoration-thickness: 1px;
            text-underline-offset: 3px;
            cursor: pointer;
            transition: color 160ms ease, text-decoration-color 160ms ease;
        }

        [${PROXY_ATTR}="true"] button[aria-pressed="false"]:hover {
            color: ${TOKENS.hover} !important;
            -webkit-text-fill-color: ${TOKENS.hover} !important;
        }

        [${PROXY_ATTR}="true"] button[aria-pressed="true"] {
            color: ${TOKENS.textPrimary} !important;
            -webkit-text-fill-color: ${TOKENS.textPrimary} !important;
            text-decoration-line: underline;
            text-decoration-color: ${TOKENS.textPrimary};
            cursor: default;
        }

        [${PROXY_ATTR}="true"] button:focus-visible {
            outline: 1px solid ${TOKENS.textPrimary};
            outline-offset: 3px;
        }
    `
}

function setProxyPosition(proxy: HTMLElement, props: Props) {
    const container = proxy.closest<HTMLElement>(".idx-container")
    if (!container) return

    const taxonomy = container.firstElementChild as HTMLElement | null
    const top = taxonomy ? taxonomy.offsetTop + taxonomy.offsetHeight + props.verticalOffset : props.verticalOffset

    proxy.style.top = `${top}px`
    proxy.style.right = `${props.right}px`
    proxy.style.gap = `${props.gap}px`
    proxy.style.setProperty("--idx-inline-toggle-font-size", `${props.fontSize}px`)
}

function updateProxyState(proxy: HTMLElement, props: Props) {
    const container = proxy.closest<HTMLElement>(".idx-container")
    if (!container) return

    const activeView = detectActiveView(container)
    proxy.querySelectorAll<HTMLButtonElement>("button[data-view]").forEach((button) => {
        const isActive = button.dataset.view === activeView
        button.setAttribute("aria-pressed", String(isActive))
        button.style.opacity = String(isActive ? props.activeOpacity : props.inactiveOpacity)
        button.style.color = TOKENS.textPrimary
        button.style.setProperty("-webkit-text-fill-color", TOKENS.textPrimary)
        button.style.textDecorationLine = isActive ? "underline" : "none"
        button.style.textDecorationColor = isActive ? TOKENS.textPrimary : "transparent"
    })

    proxy.querySelectorAll<HTMLElement>("[data-toggle-separator]").forEach((separator) => {
        separator.style.color = TOKENS.textPrimary
        separator.style.setProperty("-webkit-text-fill-color", TOKENS.textPrimary)
    })
}

function createProxy(props: Props) {
    const container = document.querySelector<HTMLElement>(".idx-container")
    const original = getOriginalButtons()
    if (!container || !original) return null

    hideOriginalToggle(original.root)

    let proxy = container.querySelector<HTMLElement>(`:scope > [${PROXY_ATTR}="true"]`)
    if (!proxy) {
        proxy = document.createElement("div")
        proxy.setAttribute(PROXY_ATTR, "true")
        proxy.setAttribute("aria-label", "Project view toggle")

        const grid = document.createElement("button")
        grid.type = "button"
        grid.textContent = "GRID"
        grid.dataset.view = "grid"
        grid.addEventListener("click", () => {
            getOriginalButtons()?.grid.click()
            window.setTimeout(() => updateProxyState(proxy!, props), 0)
            window.setTimeout(() => updateProxyState(proxy!, props), 220)
            window.setTimeout(() => updateProxyState(proxy!, props), 420)
        })

        const slash = document.createElement("span")
        slash.textContent = "/"
        slash.setAttribute("aria-hidden", "true")
        slash.setAttribute("data-toggle-separator", "true")

        const list = document.createElement("button")
        list.type = "button"
        list.textContent = "LIST"
        list.dataset.view = "list"
        list.addEventListener("click", () => {
            getOriginalButtons()?.list.click()
            window.setTimeout(() => updateProxyState(proxy!, props), 0)
            window.setTimeout(() => updateProxyState(proxy!, props), 220)
            window.setTimeout(() => updateProxyState(proxy!, props), 420)
        })

        proxy.append(grid, slash, list)
        container.appendChild(proxy)
    }

    setProxyPosition(proxy, props)
    updateProxyState(proxy, props)
    return proxy
}

/**
 * Original-template style proxy for the /index List/Grid toggle.
 *
 * Hides the floating toggle on this page and renders a small GRID / LIST
 * control at the project header edge while delegating clicks to the existing
 * IndexPage toggle, preserving current view/filter behavior. It also keeps
 * index list/grid rules at the project Light Gray color.
 *
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function IndexInlineToggleProxy({
    right = 20,
    verticalOffset = 18,
    gap = 8,
    fontSize = 13,
    activeOpacity = 1,
    inactiveOpacity = 1,
}: Partial<Props>) {
    const props = React.useMemo<Props>(
        () => ({
            right,
            verticalOffset,
            gap,
            fontSize,
            activeOpacity,
            inactiveOpacity,
        }),
        [right, verticalOffset, gap, fontSize, activeOpacity, inactiveOpacity]
    )

    React.useEffect(() => {
        if (typeof window === "undefined") return

        ensureStyle()
        let disposed = false
        let frame = 0
        let proxy: HTMLElement | null = null

        const sync = () => {
            window.cancelAnimationFrame(frame)
            frame = window.requestAnimationFrame(() => {
                if (disposed) return
                proxy = createProxy(props)
            })
        }

        sync()
        const timeouts = [100, 350, 900, 1800, 3200].map((delay) => window.setTimeout(sync, delay))
        const observer = new MutationObserver(sync)
        observer.observe(document.body, { childList: true, subtree: true })
        window.addEventListener("resize", sync, { passive: true })

        return () => {
            disposed = true
            window.cancelAnimationFrame(frame)
            timeouts.forEach((id) => window.clearTimeout(id))
            observer.disconnect()
            window.removeEventListener("resize", sync)
            proxy?.remove()
            restoreOriginalToggles()
            document.getElementById(STYLE_ID)?.remove()
        }
    }, [props])

    return (
        <div
            aria-hidden="true"
            style={{ width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}
        />
    )
}

addPropertyControls(IndexInlineToggleProxy, {
    right: {
        type: ControlType.Number,
        title: "Right",
        defaultValue: 20,
        min: 0,
        max: 120,
        step: 1,
        unit: "px",
    },
    verticalOffset: {
        type: ControlType.Number,
        title: "Offset",
        defaultValue: 18,
        min: 0,
        max: 120,
        step: 1,
        unit: "px",
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        defaultValue: 8,
        min: 0,
        max: 32,
        step: 1,
        unit: "px",
    },
    fontSize: {
        type: ControlType.Number,
        title: "Size",
        defaultValue: 13,
        min: 10,
        max: 18,
        step: 1,
        unit: "px",
    },
    activeOpacity: {
        type: ControlType.Number,
        title: "Active",
        defaultValue: 1,
        min: 0.2,
        max: 1,
        step: 0.05,
    },
    inactiveOpacity: {
        type: ControlType.Number,
        title: "Inactive",
        defaultValue: 1,
        min: 0.2,
        max: 1,
        step: 0.05,
    },
})
