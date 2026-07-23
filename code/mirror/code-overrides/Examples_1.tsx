// ARCHIVED 2026-05-20 — original behavior removed; structurally identical
// to the original override shape so Framer's analyzer recognizes the export.
import type { ComponentType } from "react"

export function withRotate(Component): ComponentType {
    return (props) => {
        return <Component {...props} />
    }
}

export function withHover(Component): ComponentType {
    return (props) => {
        return <Component {...props} />
    }
}

export function withRandomColor(Component): ComponentType {
    return (props) => {
        return <Component {...props} />
    }
}
