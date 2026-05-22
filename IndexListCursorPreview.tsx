import React, { useEffect } from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

const REGISTRY_KEY = "__articaIndexProjectsRegistry"
const CLEANUP_KEY = "__articaIndexListCursorPreviewCleanup"
const ROOT_ATTR = "data-artica-index-list-cursor-preview"
const STYLE_ATTR = "data-artica-index-list-cursor-preview-style"

type Project = {
    title: string
    thumbnail?: string
    thumbnailVideoLink?: string
}

type RegistryShape = {
    items?: Map<string, Record<string, unknown>>
}

type Props = {
    enabled?: boolean
    previewWidth?: number
    offsetX?: number
    offsetY?: number
    follow?: number
    radius?: number
}

const FALLBACK_PROJECTS: Project[] = [
    {
        title: "AirPods Pro 3",
        thumbnail:
            "https://framerusercontent.com/images/JITjBIRyOd5DdC7juV7X5RwU9I.jpg",
        thumbnailVideoLink:
            "https://freight.cargo.site/i/V2732716404789921262344304055829/AirPods-Pro-3-Introduction-1.mp4",
    },
    {
        title: "Simon & Schuster",
        thumbnail:
            "https://framerusercontent.com/images/ZViKn9ASVVsE90tOfnWU7sW0U.png",
    },
    {
        title: "Gaia",
        thumbnail:
            "https://framerusercontent.com/images/1a1LDlRx4V2kNoG7kX7hvWygUCg.jpg",
    },
    {
        title: "National Park Playing Cards",
        thumbnail:
            "https://framerusercontent.com/images/YdGKidrUlzOXfODfaQNqfCx5dM.png",
    },
    {
        title: "Motion Connect 2025",
        thumbnail:
            "https://framerusercontent.com/images/W592y16ERqrZ1qFuxRe3dcsv8I.jpg",
        thumbnailVideoLink:
            "https://freight.cargo.site/i/K2717924145885630584799912777237/Motion-Connect_1.mp4",
    },
    {
        title: "Yomo",
        thumbnail:
            "https://framerusercontent.com/images/PXsrzy7ezkkjSfUrVHhUuP2sk4k.jpg",
    },
    {
        title: "Karuna",
        thumbnail:
            "https://framerusercontent.com/images/Dj1KLsghEL5tCJkNgSjKFvuIMMU.png",
    },
    {
        title: "Weaponized Innocence",
        thumbnail:
            "https://framerusercontent.com/images/BRh73XzVlRBoYNh03pKXVIYYPw.png",
    },
    {
        title: "Cellular Symphony",
        thumbnail:
            "https://framerusercontent.com/images/j9uS8SZ6aEBOUihZfXOWVeSrVs8.jpg",
        thumbnailVideoLink:
            "https://freight.cargo.site/i/K1779235211065582686951637767701/cellular-symphony-Apple-Devices-HD-Best-Quality.m4v",
    },
    {
        title: "Neon Lights",
        thumbnail:
            "https://framerusercontent.com/images/TYPcX0xZpgwrY5Ezh0e7forig.jpg",
        thumbnailVideoLink: "https://player.vimeo.com/video/903963136",
    },
    {
        title: "Seek Truth",
        thumbnail:
            "https://framerusercontent.com/images/ZZz0tz3CmTn9Zwf1r21GPbcqFNk.png",
    },
    {
        title: "Independent Lens",
        thumbnail:
            "https://framerusercontent.com/images/2l7fi2HvjNmusO8H6tXWKotl8.jpg",
    },
]

function normalizeTitle(value: unknown): string {
    return String(value ?? "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/[^a-z0-9& ]/g, "")
        .trim()
}

function getImageUrl(raw: unknown): string {
    if (!raw) return ""
    if (typeof raw === "string") return raw
    if (typeof raw === "object") {
        const value = raw as Record<string, unknown>
        if (typeof value.src === "string") return value.src
    }
    return ""
}

function getDirectVideoUrl(raw: unknown): string {
    const value = typeof raw === "string" ? raw.trim() : ""
    return /\.(mp4|m4v|mov|webm|ogg)(\?|#|$)/i.test(value) ? value : ""
}

function getRegistryProjects(): Project[] {
    if (typeof window === "undefined") return []
    const registry = (window as unknown as Record<string, RegistryShape>)[
        REGISTRY_KEY
    ]
    const items = registry?.items
    if (!items || typeof items.forEach !== "function") return []

    const projects: Project[] = []
    items.forEach((item) => {
        const title = typeof item.title === "string" ? item.title : ""
        if (!title) return
        projects.push({
            title,
            thumbnail: getImageUrl(item.thumbnail),
            thumbnailVideoLink:
                typeof item.thumbnailVideoLink === "string"
                    ? item.thumbnailVideoLink
                    : "",
        })
    })
    return projects
}

function buildProjectMap(): Map<string, Project> {
    const map = new Map<string, Project>()
    for (const project of [...FALLBACK_PROJECTS, ...getRegistryProjects()]) {
        const key = normalizeTitle(project.title)
        if (!key) continue
        map.set(key, project)
    }
    return map
}

function getRowTitle(row: Element): string {
    const labelled = row.querySelector<HTMLElement>(".idx-flip-text")
    const aria = labelled?.getAttribute("aria-label")
    if (aria) return aria

    const cell = row.querySelector<HTMLElement>(".idx-title-cell")
    return cell?.textContent?.replace(/View Project/gi, "") ?? ""
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}

function setMedia(root: HTMLElement, project: Project | undefined): string {
    const image = getImageUrl(project?.thumbnail)
    const video = getDirectVideoUrl(project?.thumbnailVideoLink)
    const src = video || image
    if (!src) return ""
    if (root.dataset.src === src) return src

    root.dataset.src = src
    root.innerHTML = ""

    if (video) {
        const el = document.createElement("video")
        el.src = video
        if (image) el.poster = image
        el.muted = true
        el.loop = true
        el.playsInline = true
        el.autoplay = true
        el.preload = "metadata"
        el.className = "idx-cursor-preview-media"
        root.appendChild(el)
        el.play().catch(() => undefined)
        return src
    }

    const el = document.createElement("img")
    el.src = image
    el.alt = ""
    el.decoding = "async"
    el.className = "idx-cursor-preview-media"
    root.appendChild(el)
    return src
}

export default function IndexListCursorPreview({
    enabled = true,
    previewWidth = 320,
    offsetX = 26,
    offsetY = -20,
    follow = 0.22,
    radius = 0,
}: Props) {
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    useEffect(() => {
        if (!enabled || typeof window === "undefined") return

        const disabled =
            window.matchMedia("(hover: none)").matches ||
            window.matchMedia("(pointer: coarse)").matches ||
            window.matchMedia("(max-width: 899px)").matches
        if (disabled) return

        const w = window as unknown as Record<string, (() => void) | undefined>
        w[CLEANUP_KEY]?.()

        const style = document.createElement("style")
        style.setAttribute(STYLE_ATTR, "true")
        style.textContent = `
            [${ROOT_ATTR}] {
                position: fixed;
                top: 0;
                left: 0;
                width: ${previewWidth}px;
                aspect-ratio: 16 / 9;
                z-index: 2147483647;
                pointer-events: none;
                opacity: 0;
                transform: translate3d(-9999px, -9999px, 0) scale(0.97);
                transform-origin: center;
                transition:
                    opacity 180ms ease,
                    filter 260ms ease;
                will-change: transform, opacity;
                overflow: hidden;
                border-radius: ${radius}px;
                background: #eae8e3;
                filter: saturate(0.98);
                contain: layout paint style;
            }
            [${ROOT_ATTR}][data-active="true"] {
                opacity: 1;
                filter: saturate(1);
            }
            .idx-cursor-preview-media {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
                border: 0;
            }
        `
        document.head.appendChild(style)

        const root = document.createElement("div")
        root.setAttribute(ROOT_ATTR, "true")
        root.dataset.active = "false"
        document.body.appendChild(root)

        let projectMap = buildProjectMap()
        let activeRow: Element | null = null
        let raf = 0
        let targetX = -9999
        let targetY = -9999
        let currentX = -9999
        let currentY = -9999
        let lastRegistryRefresh = 0

        const height = previewWidth * 0.5625
        const speed = clamp(follow, 0.08, 1)

        function hide() {
            activeRow = null
            root.dataset.active = "false"
        }

        function moveFrame() {
            currentX += (targetX - currentX) * speed
            currentY += (targetY - currentY) * speed
            root.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`
            raf = activeRow ? window.requestAnimationFrame(moveFrame) : 0
        }

        function startFrame() {
            if (!raf) raf = window.requestAnimationFrame(moveFrame)
        }

        function updateTarget(event: PointerEvent) {
            targetX = clamp(
                event.clientX + offsetX,
                previewWidth / 2 + 12,
                window.innerWidth - previewWidth / 2 - 12
            )
            targetY = clamp(
                event.clientY + offsetY,
                height / 2 + 12,
                window.innerHeight - height / 2 - 12
            )
            if (currentX < -9000 || currentY < -9000) {
                currentX = targetX
                currentY = targetY
            }
        }

        function handlePointerMove(event: PointerEvent) {
            const target = event.target
            if (!(target instanceof Element)) {
                hide()
                return
            }

            const row = target.closest(".idx-list-view .idx-list-row")
            if (!row) {
                hide()
                return
            }

            if (Date.now() - lastRegistryRefresh > 1000) {
                projectMap = buildProjectMap()
                lastRegistryRefresh = Date.now()
            }

            updateTarget(event)

            if (row !== activeRow) {
                const title = normalizeTitle(getRowTitle(row))
                const project = projectMap.get(title)
                const src = setMedia(root, project)
                if (!src) {
                    hide()
                    return
                }
                activeRow = row
                root.dataset.active = "true"
            }

            startFrame()
        }

        function handleScroll() {
            hide()
        }

        document.addEventListener("pointermove", handlePointerMove, {
            passive: true,
            capture: true,
        })
        window.addEventListener("scroll", handleScroll, { passive: true })
        window.addEventListener("blur", hide)

        const cleanup = () => {
            document.removeEventListener(
                "pointermove",
                handlePointerMove,
                true
            )
            window.removeEventListener("scroll", handleScroll)
            window.removeEventListener("blur", hide)
            if (raf) window.cancelAnimationFrame(raf)
            root.remove()
            style.remove()
            if (w[CLEANUP_KEY] === cleanup) delete w[CLEANUP_KEY]
        }

        w[CLEANUP_KEY] = cleanup
        return cleanup
    }, [enabled, previewWidth, offsetX, offsetY, follow, radius])

    return (
        <div
            aria-hidden="true"
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                border: isCanvas ? "1px dashed rgba(38, 33, 31, 0.45)" : "0",
                background: isCanvas ? "rgba(247, 245, 240, 0.92)" : "transparent",
                color: "#26211f",
                fontFamily:
                    "'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace",
                fontSize: 10,
                lineHeight: "1",
                letterSpacing: 0,
                textTransform: "uppercase",
                pointerEvents: isCanvas ? "auto" : "none",
                opacity: isCanvas ? 1 : 0,
            }}
        >
            {isCanvas ? "List Preview" : null}
        </div>
    )
}

addPropertyControls(IndexListCursorPreview, {
    enabled: {
        type: ControlType.Boolean,
        title: "List Preview",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    previewWidth: {
        type: ControlType.Number,
        title: "Width",
        defaultValue: 320,
        min: 180,
        max: 520,
        step: 10,
        unit: "px",
    },
    offsetX: {
        type: ControlType.Number,
        title: "Offset X",
        defaultValue: 26,
        min: -160,
        max: 160,
        step: 1,
        unit: "px",
    },
    offsetY: {
        type: ControlType.Number,
        title: "Offset Y",
        defaultValue: -20,
        min: -160,
        max: 160,
        step: 1,
        unit: "px",
    },
    follow: {
        type: ControlType.Number,
        title: "Follow",
        defaultValue: 0.22,
        min: 0.08,
        max: 1,
        step: 0.01,
    },
    radius: {
        type: ControlType.Number,
        title: "Radius",
        defaultValue: 0,
        min: 0,
        max: 24,
        step: 1,
        unit: "px",
    },
})
