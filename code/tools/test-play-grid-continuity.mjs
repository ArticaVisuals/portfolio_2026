#!/usr/bin/env node

import assert from "node:assert/strict"
import fs from "node:fs"
import { fileURLToPath } from "node:url"

// Exercise the renderer's actual positioning and recycling calculations without
// requiring Framer or a browser. A held clamp followed by a recycle must not
// turn a slow drift into a visible jump in a surviving card's screen position.
const sourcePath = process.argv[2] || fileURLToPath(
    new URL("../components/ArchivePlayground.tsx", import.meta.url)
)
const source = fs.readFileSync(sourcePath, "utf8")
const reconcileStart = source.indexOf("const reconcileGridFrame =")
const mathStart = source.indexOf("const rawLayerX =", reconcileStart)
const mathEnd = source.indexOf("const requestedWindow =", mathStart)
assert.ok(reconcileStart >= 0 && mathStart > reconcileStart && mathEnd > mathStart)
const positionFrame = new Function(
    "s", "runtime", "committedWindow", "webKitRiskRef", "worldLayer", "clamp",
    `${source.slice(mathStart, mathEnd)}\nreturn { layerX, layerY, rawLayerX, rawLayerY, desiredWindow }`
)
const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const viewports = [
    [390, 844], [810, 1080], [1200, 888], [1440, 1000],
    [1920, 1080], [2560, 1440], [3840, 2160],
]
let scenarios = 0

for (const [width, height] of viewports) {
    const cellSize = 190
    const step = 246
    const runtime = {
        cellX: step, cellY: step,
        centerX: width / 2, centerY: height / 2,
        viewportW: width, viewportH: height, extra: 2,
        gridWidth: (clamp(Math.ceil(width / step) + 2, 4, 20) - 1) * step + cellSize,
        gridHeight: (clamp(Math.ceil(height / step) + 2, 4, 12) - 1) * step + cellSize,
    }
    for (const webKit of [true, false]) {
        for (const direction of [-1, 1]) {
            for (const parallax of [-1, 1]) {
                const state = {
                    x: 0, y: 0,
                    mx: parallax * width * 0.03,
                    my: -parallax * height * 0.03,
                }
                const paint = (window) => positionFrame(
                    state, runtime, window, { current: webKit }, { style: {} }, clamp
                )
                let committed = paint({ startX: 0, startY: 0 }).desiredWindow
                let pending = null
                let previous = null
                for (let frame = 0; frame < 1800; frame++) {
                    state.x = frame * 0.5 * direction
                    state.y = frame * 0.5 * -direction
                    if (pending && frame >= pending.commitAt) {
                        committed = pending.window
                        pending = null
                    }
                    const result = paint(committed)
                    const screenX = result.layerX - committed.startX * step
                    const screenY = result.layerY - committed.startY * step
                    const label = `${width}x${height}, WebKit=${webKit}, frame=${frame}`
                    if (previous) {
                        assert.ok(Math.abs(screenX - previous.x - 0.5 * direction) < 1e-7,
                            `Horizontal idle jump: ${label}, delta=${screenX - previous.x}`)
                        assert.ok(Math.abs(screenY - previous.y + 0.5 * direction) < 1e-7,
                            `Vertical idle jump: ${label}, delta=${screenY - previous.y}`)
                    }
                    if (webKit) {
                        assert.ok(result.layerX <= 1e-7 && result.layerX + runtime.gridWidth >= width - 1e-7,
                            `Lost horizontal viewport coverage: ${label}`)
                        assert.ok(result.layerY <= 1e-7 && result.layerY + runtime.gridHeight >= height - 1e-7,
                            `Lost vertical viewport coverage: ${label}`)
                    }
                    previous = { x: screenX, y: screenY }
                    if (!pending && (
                        result.desiredWindow.startX !== committed.startX ||
                        result.desiredWindow.startY !== committed.startY
                    )) {
                        // Let the old DOM remain committed for three frames.
                        pending = { window: result.desiredWindow, commitAt: frame + 3 }
                    }
                }
                scenarios++
            }
        }
    }
}

// A large burst must still use Safari's coverage guard; Chromium stays raw.
const runtime = {
    cellX: 246, cellY: 246, centerX: 600, centerY: 444,
    viewportW: 1200, viewportH: 888, gridWidth: 1666, gridHeight: 1420, extra: 2,
}
for (const webKit of [true, false]) {
    const result = positionFrame(
        { x: -5000, y: 5000, mx: 0, my: 0 }, runtime,
        { startX: -4, startY: -3 }, { current: webKit }, { style: {} }, clamp
    )
    assert.equal(result.layerX, webKit ? -466 : result.rawLayerX)
    assert.equal(result.layerY, webKit ? 0 : result.rawLayerY)
}
console.log(`Play grid continuity passed (${scenarios} idle scenarios; Safari burst guard and Chromium raw transforms).`)
