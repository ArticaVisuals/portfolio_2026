// ARCHIVED 2026-05-20 — structurally identical to the original override
// shape so Framer's analyzer recognizes the exports. Original was already
// no-op pass-throughs.
import type { ComponentType } from "react"

export function External(Component): ComponentType {
    return (props) => {
        return <Component {...props} />
    }
}

export function Noop(Component): ComponentType {
    return (props) => {
        return <Component {...props} />
    }
}

export function withExternal(Component): ComponentType {
    return (props) => {
        return <Component {...props} />
    }
}

export function withOverride(Component): ComponentType {
    return (props) => {
        return <Component {...props} />
    }
}

export function AutoCopyrightStatement(Component): ComponentType {
    return (props) => {
        return <Component {...props} />
    }
}
