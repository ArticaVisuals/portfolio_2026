#!/usr/bin/env node

import { execFileSync } from "node:child_process"
import { createServer } from "node:http"
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { extname, join, resolve } from "node:path"
import { pathToFileURL } from "node:url"

const ROOT = resolve(import.meta.dirname, "..")
const OUT_DIR = join(ROOT, "output", "playwright", "case-study-wip-gate-qa-2026-06-14")
const COMPONENT_PATH = join(ROOT, "CaseStudyWorkInProgressGate.tsx")
const BUNDLE_PATH = join(OUT_DIR, "CaseStudyWorkInProgressGate.bundle.mjs")
const HARNESS_PATH = join(OUT_DIR, "harness.html")
const FRAMER_STUB_PATH = join(OUT_DIR, "framer-stub.mjs")
const require = createRequire(import.meta.url)

const MIME = new Map([
    [".html", "text/html; charset=utf-8"],
    [".mjs", "text/javascript; charset=utf-8"],
    [".js", "text/javascript; charset=utf-8"],
    [".json", "application/json; charset=utf-8"],
    [".png", "image/png"],
])

function run(command, args, options = {}) {
    return execFileSync(command, args, {
        cwd: ROOT,
        encoding: "utf8",
        stdio: options.stdio || "pipe",
        ...options,
    })
}

function loadPlaywright() {
    if (process.env.PLAYWRIGHT_MODULE_PATH) {
        return require(process.env.PLAYWRIGHT_MODULE_PATH)
    }

    const npxRoot = join(process.env.HOME || "", ".npm", "_npx")
    if (!existsSync(npxRoot)) {
        throw new Error("Playwright is not cached under ~/.npm/_npx. Run `npx --yes playwright --version` once, then retry.")
    }

    const candidates = readdirSync(npxRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => join(npxRoot, entry.name, "node_modules", "playwright"))
        .filter((candidate) => existsSync(join(candidate, "package.json")))

    if (!candidates.length) {
        throw new Error("Could not find a cached Playwright package. Run `npx --yes playwright --version` once, then retry.")
    }

    return require(candidates[0])
}

function ensureArtifacts() {
    mkdirSync(OUT_DIR, { recursive: true })

    writeFileSync(
        FRAMER_STUB_PATH,
        `export function addPropertyControls() {}
export const ControlType = {
    Boolean: "Boolean",
    Color: "Color",
    Enum: "Enum",
    Number: "Number",
    String: "String",
}
export const RenderTarget = {
    canvas: "canvas",
    preview: "preview",
    export: "export",
    current() {
        return "preview"
    },
}
`,
        "utf8"
    )

    run("npx", [
        "--yes",
        "esbuild@0.25.5",
        COMPONENT_PATH,
        "--bundle",
        "--platform=browser",
        "--format=esm",
        "--external:react",
        "--external:react-dom",
        "--external:framer",
        `--outfile=${BUNDLE_PATH}`,
    ])

    writeFileSync(
        HARNESS_PATH,
        `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Case Study WIP Gate QA</title>
    <script type="importmap">
        {
            "imports": {
                "react": "https://esm.sh/react@18.2.0",
                "react-dom": "https://esm.sh/react-dom@18.2.0?external=react",
                "react-dom/client": "https://esm.sh/react-dom@18.2.0/client?external=react",
                "framer": "./framer-stub.mjs"
            }
        }
    </script>
    <style>
        html,
        body {
            margin: 0;
            min-height: 100%;
            background: #ffffff;
            color: #111111;
            font-family: Arial, sans-serif;
        }

        .unfinished-page {
            min-height: 220vh;
            padding: 32px;
            background: linear-gradient(#ffffff, #d8dde2);
        }

        .unfinished-page h1 {
            margin: 0 0 16px;
            font-size: 48px;
            line-height: 1;
        }

        .unfinished-page a {
            color: #233324;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="module">
        import * as React from "react"
        import { createRoot } from "react-dom/client"
        import Gate from "./CaseStudyWorkInProgressGate.bundle.mjs"

        const params = new URLSearchParams(window.location.search)
        const status = params.get("status") === "ready" ? "ready" : "wip"
        const label = params.get("label") || "Work in progress"

        function App() {
            return React.createElement(
                React.Fragment,
                null,
                React.createElement(
                    "main",
                    { className: "unfinished-page", "data-unfinished-content": "true" },
                    React.createElement("h1", null, "Unfinished Case Study Content"),
                    React.createElement("p", null, "This content should be covered when the gate is active."),
                    React.createElement("a", { href: "/case-studies" }, "Fallback index link")
                ),
                React.createElement(Gate, {
                    status,
                    label,
                    fallbackPath: "/case-studies",
                    backgroundColor: "#f6f6f6",
                    textColor: "#233324",
                    fontFamily: '"GT Standard Trial L", "GT Standard Trial", Manrope, sans-serif',
                    fontSizeDesktop: 30,
                    fontSizeTablet: 24,
                    fontSizeMobile: 19,
                    zIndex: 2147483590,
                    lockScroll: true,
                    showCanvasPreview: true,
                })
            )
        }

        createRoot(document.getElementById("root")).render(React.createElement(App))
    </script>
</body>
</html>
`,
        "utf8"
    )
}

function serveArtifacts() {
    const server = createServer((request, response) => {
        const requestUrl = new URL(request.url || "/", "http://127.0.0.1")

        if (requestUrl.pathname === "/favicon.ico") {
            response.writeHead(204)
            response.end()
            return
        }

        if (requestUrl.pathname === "/index") {
            response.writeHead(200, { "content-type": "text/html; charset=utf-8" })
            response.end("<!doctype html><title>Index</title><main data-index-arrived=\"true\">Project Index</main>")
            return
        }

        if (requestUrl.pathname === "/case-studies") {
            response.writeHead(200, { "content-type": "text/html; charset=utf-8" })
            response.end("<!doctype html><title>Case Studies</title><main data-fallback-arrived=\"true\">Case Studies Index</main>")
            return
        }

        if (requestUrl.pathname === "/referrer.html") {
            response.writeHead(200, { "content-type": "text/html; charset=utf-8" })
            response.end(
                '<!doctype html><title>Referrer</title><a data-referrer-link href="/harness.html?status=wip">Open WIP gate</a>'
            )
            return
        }

        const pathname = requestUrl.pathname === "/" ? "/harness.html" : requestUrl.pathname
        const safePath = resolve(OUT_DIR, `.${pathname}`)

        if (!safePath.startsWith(OUT_DIR)) {
            response.writeHead(403)
            response.end("Forbidden")
            return
        }

        try {
            const body = readFileSync(safePath)
            response.writeHead(200, { "content-type": MIME.get(extname(safePath)) || "application/octet-stream" })
            response.end(body)
        } catch {
            response.writeHead(404)
            response.end("Not found")
        }
    })

    return new Promise((resolveServer) => {
        server.listen(0, "127.0.0.1", () => {
            const address = server.address()
            if (!address || typeof address === "string") throw new Error("Could not start QA server")
            resolveServer({ server, port: address.port })
        })
    })
}

async function runVisualQa(port) {
    const baseUrl = `http://127.0.0.1:${port}`
    const { chromium } = loadPlaywright()
    const browser = await chromium.launch({ channel: "chrome", headless: true })
    const page = await browser.newPage()
    const pageErrors = []
    const consoleErrors = []
    const variants = [
    { name: "desktop-1200", width: 1200, height: 900, expectedFont: 40 },
    { name: "tablet-810", width: 810, height: 900, expectedFont: 34 },
    { name: "mobile-390", width: 390, height: 900, expectedFont: 22 },
]
    const results = []

    page.on("pageerror", (error) => pageErrors.push(error.message))
    page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text())
    })

    function assert(condition, message) {
        if (!condition) throw new Error(message)
    }

    try {
        for (const variant of variants) {
            await page.setViewportSize({ width: variant.width, height: variant.height })
            await page.goto(baseUrl + "/harness.html?status=wip", { waitUntil: "networkidle" })
            await page.waitForSelector('[data-case-study-work-in-progress="true"] .mh-wip-action')
            await page.waitForFunction(() => document.documentElement.style.overflow === "hidden")

            const metrics = await page.evaluate(() => {
                const overlay = document.querySelector('[data-case-study-work-in-progress="true"]')
                const button = document.querySelector(".mh-wip-action")
                const overlayRect = overlay.getBoundingClientRect()
                const buttonRect = button.getBoundingClientRect()
                const overlayStyle = getComputedStyle(overlay)
                const buttonStyle = getComputedStyle(button)

                return {
                    overlayRect: {
                        top: overlayRect.top,
                        left: overlayRect.left,
                        width: overlayRect.width,
                        height: overlayRect.height,
                    },
                    buttonRect: {
                        x: buttonRect.x,
                        y: buttonRect.y,
                        width: buttonRect.width,
                        height: buttonRect.height,
                    },
                    viewport: {
                        width: window.innerWidth,
                        height: window.innerHeight,
                    },
                    background: overlayStyle.backgroundColor,
                    color: overlayStyle.color,
                    fontSize: buttonStyle.fontSize,
                    overflow: document.documentElement.style.overflow,
                    scrollYBeforeWheel: window.scrollY,
                    label: button.textContent,
                }
            })

            await page.mouse.wheel(0, 900)
            await page.waitForTimeout(100)
            const scrollYAfterWheel = await page.evaluate(() => window.scrollY)

            const centerX = metrics.buttonRect.x + metrics.buttonRect.width / 2
            const centerY = metrics.buttonRect.y + metrics.buttonRect.height / 2
            assert(Math.abs(metrics.overlayRect.top) <= 1, variant.name + ": overlay top is not fixed to viewport")
            assert(Math.abs(metrics.overlayRect.left) <= 1, variant.name + ": overlay left is not fixed to viewport")
            assert(Math.abs(metrics.overlayRect.width - metrics.viewport.width) <= 1, variant.name + ": overlay width mismatch")
            assert(Math.abs(metrics.overlayRect.height - metrics.viewport.height) <= 1, variant.name + ": overlay height mismatch")
            assert(Math.abs(centerX - metrics.viewport.width / 2) <= 2, variant.name + ": label is not horizontally centered")
            // The action centers within the area below the nav bar, so it sits
            // a little below the exact viewport middle.
            assert(
                centerY > metrics.viewport.height * 0.4 && centerY < metrics.viewport.height * 0.75,
                variant.name + ": label is not in the central band (centerY=" + Math.round(centerY) + ")"
            )
            assert(
                metrics.background === "rgb(246, 246, 246)",
                variant.name + ": background color drifted to " + metrics.background
            )
            assert(metrics.color === "rgb(35, 51, 36)", variant.name + ": text color drifted to " + metrics.color)
            assert(
                parseFloat(metrics.fontSize) === variant.expectedFont,
                variant.name + ": expected font size " + variant.expectedFont + ", got " + metrics.fontSize
            )
            assert(metrics.overflow === "hidden", variant.name + ": scroll lock did not apply")
            assert(scrollYAfterWheel === 0, variant.name + ": wheel scroll moved hidden content")
            assert(
                String(metrics.label).replace(/\s+/g, " ").trim() === "Work in Progress",
                variant.name + ": label mismatch -> " + JSON.stringify(metrics.label)
            )

            await page.screenshot({ path: join(OUT_DIR, "wip-" + variant.name + ".png"), fullPage: false })
            results.push({ ...variant, screenshot: "wip-" + variant.name + ".png", metrics, scrollYAfterWheel })
        }

        await page.setViewportSize({ width: 1200, height: 900 })
        await page.goto(baseUrl + "/harness.html?status=ready", { waitUntil: "networkidle" })
        const readyMetrics = await page.evaluate(() => ({
            hasOverlay: Boolean(document.querySelector('[data-case-study-work-in-progress="true"]')),
            overflow: document.documentElement.style.overflow,
            contentVisible: Boolean(document.querySelector('[data-unfinished-content="true"]')),
            bodyHeight: document.body.scrollHeight,
            viewportHeight: window.innerHeight,
        }))
        assert(!readyMetrics.hasOverlay, "ready mode should not render the WIP overlay")
        assert(readyMetrics.overflow !== "hidden", "ready mode should not lock scroll")
        assert(readyMetrics.contentVisible, "ready mode should leave page content visible")
        assert(readyMetrics.bodyHeight > readyMetrics.viewportHeight, "ready mode fixture should remain scrollable")
        await page.screenshot({ path: join(OUT_DIR, "ready-desktop-1200.png"), fullPage: false })
        results.push({ name: "ready-desktop-1200", screenshot: "ready-desktop-1200.png", metrics: readyMetrics })

        await page.goto(baseUrl + "/harness.html?status=wip", { waitUntil: "networkidle" })
        await page.click(".mh-wip-action")
        await page.waitForURL(baseUrl + "/index")
        const directIndexArrived = await page.locator('[data-index-arrived="true"]').count()
        assert(directIndexArrived === 1, "direct WIP click did not redirect to /index")
        results.push({ name: "direct-index", url: page.url() })

        await page.goto(baseUrl + "/referrer.html", { waitUntil: "networkidle" })
        await page.click('[data-referrer-link]')
        await page.waitForSelector(".mh-wip-action")
        await page.click(".mh-wip-action")
        await page.waitForURL(baseUrl + "/index")
        const referrerIndexArrived = await page.locator('[data-index-arrived="true"]').count()
        assert(referrerIndexArrived === 1, "same-origin WIP click should also redirect to /index")
        results.push({ name: "same-origin-index", url: page.url() })

        await page.setViewportSize({ width: 1200, height: 900 })
        await page.goto(baseUrl + "/harness.html?status=wip", { waitUntil: "networkidle" })
        // The cover no longer inerts the page (it sits under the real nav on the
        // live site), so Tab through a few stops to reach the WIP action.
        let focusMetrics = null
        for (let i = 0; i < 6; i++) {
            await page.keyboard.press("Tab")
            const snap = await page.evaluate(() => {
                const active = document.activeElement
                if (!active || !active.classList.contains("mh-wip-action")) return null
                const style = getComputedStyle(active)
                return {
                    className: active.className,
                    outlineStyle: style.outlineStyle,
                    outlineWidth: style.outlineWidth,
                    outlineColor: style.outlineColor,
                    outlineOffset: style.outlineOffset,
                }
            })
            if (snap) {
                focusMetrics = snap
                break
            }
        }
        assert(focusMetrics, "WIP action should be reachable via keyboard Tab")
        assert(focusMetrics.outlineStyle !== "none", "focus-visible outline is missing")
        await page.screenshot({ path: join(OUT_DIR, "focus-desktop-1200.png"), fullPage: false })
        results.push({ name: "keyboard-focus", screenshot: "focus-desktop-1200.png", metrics: focusMetrics })

        assert(pageErrors.length === 0, "page errors detected: " + pageErrors.join(" | "))
        assert(consoleErrors.length === 0, "console errors detected: " + consoleErrors.join(" | "))

        const resultJson = JSON.stringify(results, null, 2)
        writeFileSync(join(OUT_DIR, "visual-qa-result.json"), resultJson, "utf8")
        return resultJson
    } finally {
        await browser.close()
    }
}

async function main() {
    ensureArtifacts()
    const { server, port } = await serveArtifacts()

    try {
        const output = await runVisualQa(port)
        console.log(output)
        console.log(`Artifacts: ${OUT_DIR}`)
        console.log(`Harness: ${pathToFileURL(HARNESS_PATH).href}`)
    } finally {
        server.close()
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
