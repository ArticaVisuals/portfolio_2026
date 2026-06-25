import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

type AssetObject = {
    src?: AssetValue
    srcSet?: string
    url?: AssetValue
    href?: AssetValue
    file?: AssetValue
    value?: AssetValue
    width?: number | string
    height?: number | string
    pixelWidth?: number
    pixelHeight?: number
}
type AssetValue = string | AssetObject | AssetValue[] | null | undefined
type AssetDimensions = { width: number; height: number }

type Props = {
    id?: string
    slug?: string
    title?: string
    order?: number
    image?: AssetValue
    video?: AssetValue
    content?: unknown
    stroke?: boolean
}

type RegistryRow = {
    id?: string
    slug?: string
    title?: string
    order?: number
    image?: AssetValue
    video?: AssetValue
    content?: unknown
    stroke?: boolean
    width?: number
    height?: number
    source: "play-archive-registrar-v1"
}

type Registry = {
    items: Map<string, RegistryRow>
    listeners: Set<(items: Map<string, RegistryRow>) => void>
    register: (id: string, data: RegistryRow) => void
    unregister: (id: string) => void
    subscribe: (fn: (items: Map<string, RegistryRow>) => void) => () => void
}

type RegistryWindow = typeof window & {
    __articaPlayArchiveRegistry?: Registry
}

const REGISTRY_KEY = "__articaPlayArchiveRegistry"

function getRegistry(): Registry | null {
    if (typeof window === "undefined") return null
    const w = window as RegistryWindow
    if (!w[REGISTRY_KEY]) {
        const items = new Map<string, RegistryRow>()
        const listeners = new Set<(items: Map<string, RegistryRow>) => void>()
        w[REGISTRY_KEY] = {
            items,
            listeners,
            register(id, data) {
                items.set(id, data)
                listeners.forEach((fn) => fn(items))
            },
            unregister(id) {
                items.delete(id)
                listeners.forEach((fn) => fn(items))
            },
            subscribe(fn) {
                listeners.add(fn)
                fn(items)
                return () => {
                    listeners.delete(fn)
                }
            },
        }
    }
    return w[REGISTRY_KEY] ?? null
}

function normalizeAssetSrc(value: AssetValue): string | undefined {
    if (!value) return undefined
    if (typeof value === "string") return value
    if (Array.isArray(value)) return value.map(normalizeAssetSrc).find(Boolean)
    return (
        normalizeAssetSrc(value.src) ||
        normalizeAssetSrc(value.url) ||
        normalizeAssetSrc(value.href) ||
        normalizeAssetSrc(value.file) ||
        normalizeAssetSrc(value.value)
    )
}

function positiveDimension(value: unknown) {
    const numberValue = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : 0
    return Number.isFinite(numberValue) && numberValue > 0 ? Math.round(numberValue) : 0
}

function assetDimensionsFromPair(width: unknown, height: unknown): AssetDimensions | undefined {
    const safeWidth = positiveDimension(width)
    const safeHeight = positiveDimension(height)
    return safeWidth && safeHeight ? { width: safeWidth, height: safeHeight } : undefined
}

function assetDimensionsFromUrl(src?: string): AssetDimensions | undefined {
    if (!src) return undefined
    try {
        const url = new URL(src, "https://framer.local")
        return assetDimensionsFromPair(url.searchParams.get("width"), url.searchParams.get("height"))
    } catch {
        return assetDimensionsFromPair(src.match(/[?&]width=(\d+(?:\.\d+)?)/)?.[1], src.match(/[?&]height=(\d+(?:\.\d+)?)/)?.[1])
    }
}

function assetDimensionsFromSrcSet(srcSet?: string): AssetDimensions | undefined {
    if (!srcSet) return undefined
    for (const candidate of srcSet.split(",")) {
        const dimensions = assetDimensionsFromUrl(candidate.trim().split(/\s+/)[0])
        if (dimensions) return dimensions
    }
    return undefined
}

function assetDimensions(value: AssetValue): AssetDimensions | undefined {
    if (!value) return undefined
    if (typeof value === "string") return assetDimensionsFromUrl(value)
    if (Array.isArray(value)) {
        for (const item of value) {
            const dimensions = assetDimensions(item)
            if (dimensions) return dimensions
        }
        return undefined
    }
    return (
        assetDimensionsFromPair(value.width ?? value.pixelWidth, value.height ?? value.pixelHeight) ||
        assetDimensionsFromUrl(normalizeAssetSrc(value)) ||
        assetDimensionsFromSrcSet(value.srcSet) ||
        assetDimensions(value.value) ||
        assetDimensions(value.src) ||
        assetDimensions(value.url) ||
        assetDimensions(value.href) ||
        assetDimensions(value.file)
    )
}

function assetWidth(value: AssetValue): number | undefined {
    return assetDimensions(value)?.width
}

function assetHeight(value: AssetValue): number | undefined {
    return assetDimensions(value)?.height
}

function stableKey(value: string) {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

function buildRegistryId(props: Props) {
    const slug = String(props.slug || "").trim()
    if (slug) return `slug:${slug}`
    const explicitId = String(props.id || "").trim()
    if (explicitId) return `id:${explicitId}`
    const title = String(props.title || "").trim()
    const order = typeof props.order === "number" && Number.isFinite(props.order) ? props.order : ""
    const media = normalizeAssetSrc(props.video) || normalizeAssetSrc(props.image) || ""
    const key = stableKey(`${order}-${title}-${media}`)
    return key ? `play:${key}` : `play:${Math.random().toString(36).slice(2)}`
}

/**
 * Registers one Play Archive CMS row for ArchivePlayground.
 *
 * Place this component inside the hidden Play Archive Collection List and bind
 * every prop to the matching CMS field. It renders nothing on the published site.
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function PlayArchiveRegistrar(props: Props) {
    const registryId = React.useMemo(
        () => buildRegistryId(props),
        [props.id, props.slug, props.title, props.order, props.image, props.video]
    )

    const row = React.useMemo<RegistryRow>(() => {
        const image = normalizeAssetSrc(props.image)
        const video = normalizeAssetSrc(props.video)
        return {
            id: props.id || registryId,
            slug: props.slug || "",
            title: props.title || "",
            order: typeof props.order === "number" ? props.order : undefined,
            image: image || undefined,
            video: video || undefined,
            content: props.content,
            stroke: !!props.stroke,
            width: assetWidth(props.image),
            height: assetHeight(props.image),
            source: "play-archive-registrar-v1",
        }
    }, [props.id, props.slug, props.title, props.order, props.image, props.video, props.content, props.stroke, registryId])

    React.useEffect(() => {
        const registry = getRegistry()
        if (!registry) return
        registry.register(registryId, row)
        return () => registry.unregister(registryId)
    }, [registryId, row])

    if (RenderTarget.current() !== RenderTarget.canvas) return null

    return (
        <div
            aria-hidden="true"
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                width: "fit-content",
                maxWidth: 260,
                height: 22,
                padding: "4px 8px",
                border: "1px dashed rgba(20, 20, 20, 0.35)",
                borderRadius: 3,
                background: "rgba(20, 20, 20, 0.06)",
                color: "rgba(20, 20, 20, 0.7)",
                fontFamily: "'GT Standard Mono', 'GT Standard Mono Trial', 'SF Mono', monospace",
                fontSize: 10,
                lineHeight: 1,
                overflow: "hidden",
                pointerEvents: "none",
                userSelect: "none",
                whiteSpace: "nowrap",
            }}
        >
            <span style={{ opacity: 0.6 }}>.</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{props.title || "PlayArchiveRegistrar"}</span>
        </div>
    )
}

addPropertyControls(PlayArchiveRegistrar, {
    id: { type: ControlType.String, title: "ID" },
    slug: { type: ControlType.String, title: "Slug" },
    title: { type: ControlType.String, title: "Title" },
    order: { type: ControlType.Number, title: "Order" },
    image: { type: ControlType.ResponsiveImage, title: "Image / Poster" },
    video: {
        type: ControlType.File,
        title: "Video",
        allowedFileTypes: ["mp4", "mov", "m4v", "webm"],
    },
    content: {
        type: ControlType.String,
        title: "Content",
        displayTextArea: true,
    },
    stroke: { type: ControlType.Boolean, title: "Stroke" },
})

PlayArchiveRegistrar.displayName = "Play Archive Registrar"
