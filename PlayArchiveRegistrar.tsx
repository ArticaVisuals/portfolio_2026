import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

type AssetObject = {
    src?: AssetValue
    url?: AssetValue
    href?: AssetValue
    file?: AssetValue
    value?: AssetValue
    pixelWidth?: number
    pixelHeight?: number
}
type AssetValue = string | AssetObject | AssetValue[] | null | undefined

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

function assetWidth(value: AssetValue): number | undefined {
    if (!value || typeof value === "string") return undefined
    if (Array.isArray(value)) return value.map(assetWidth).find(Boolean)
    return typeof value.pixelWidth === "number" ? value.pixelWidth : undefined
}

function assetHeight(value: AssetValue): number | undefined {
    if (!value || typeof value === "string") return undefined
    if (Array.isArray(value)) return value.map(assetHeight).find(Boolean)
    return typeof value.pixelHeight === "number" ? value.pixelHeight : undefined
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
