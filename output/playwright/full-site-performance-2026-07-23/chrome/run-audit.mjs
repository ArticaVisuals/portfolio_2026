import { execFile } from "node:child_process"
import { promisify } from "node:util"
import fs from "node:fs"
import path from "node:path"

const exec = promisify(execFile)
const cwd = process.cwd()
const pwcli =
    "/Users/micahhoang/.codex/skills/playwright/scripts/playwright_cli.sh"
const auditScript = path.join(cwd, "audit-route.js")
const routes = [
    "/",
    "/home-alt",
    "/404",
    "/case-studies",
    "/index",
    "/play",
    "/info",
    "/case-studies/airpods",
    "/case-studies/simon-schuster",
    "/case-studies/motion-connect-2025",
    "/case-studies/national-park-cards",
    "/case-studies/yomo",
    "/case-studies/highland-harvests",
    "/case-studies/gaia",
    "/case-studies/weaponized-innocence",
    "/case-studies/typldn",
    "/case-studies/seek-truth",
    "/case-studies/cellular-symphony",
    "/case-studies/wolff-olins-x-artcenter",
    "/case-studies/independent-lens",
    "/case-studies/peak-energy",
    "/case-studies/whatsapp",
    "/case-studies/karuna",
    "/case-studies/rejuve",
    "/case-studies/belly-bar",
]

function slugForRoute(route) {
    if (route === "/") return "home"
    return route
        .replace(/^\/+|\/+$/g, "")
        .replace(/\//g, "--")
        .replace(/[^a-z0-9-]+/gi, "-")
}

async function command(args, timeout = 120000) {
    return exec(pwcli, args, {
        cwd,
        timeout,
        maxBuffer: 50 * 1024 * 1024,
        env: process.env,
    })
}

const results = []
for (let index = 0; index < routes.length; index += 1) {
    const route = routes[index]
    const slug = slugForRoute(route)
    const session = `full-site-perf-${String(index + 1).padStart(2, "0")}`
    const target = `https://micahhoang.com${route}`
    const encodedTarget = encodeURIComponent(target)
    const started = Date.now()
    process.stdout.write(
        `[${index + 1}/${routes.length}] ${route} — opening isolated Chrome session\n`
    )
    let result
    try {
        await command([
            "--session",
            session,
            "open",
            `about:blank#${encodedTarget}`,
            "--browser",
            "chrome",
        ])
        const { stdout } = await command(
            [
                "--raw",
                "--session",
                session,
                "run-code",
                "--filename",
                auditScript,
            ],
            150000
        )
        result = JSON.parse(stdout.trim())
    } catch (error) {
        result = {
            target,
            route,
            status: 0,
            finalUrl: "",
            fatalAuditError: String(
                error?.stderr || error?.stdout || error?.message || error
            ).slice(0, 5000),
        }
    } finally {
        try {
            await command(["--session", session, "close"], 30000)
        } catch {}
    }
    result.route = route
    result.artifactSlug = slug
    results.push(result)
    fs.writeFileSync(
        path.join(cwd, `${String(index + 1).padStart(2, "0")}-${slug}.json`),
        `${JSON.stringify(result, null, 2)}\n`
    )
    process.stdout.write(
        `[${index + 1}/${routes.length}] ${route} — status ${result.status || 0}, ${Math.round((result.network?.totalBytes || 0) / 1024)} KiB, ${Date.now() - started} ms\n`
    )
}

const aggregateAssets = new Map()
for (const result of results) {
    for (const asset of result.network?.largestAssets || []) {
        const key = asset.url
        if (!aggregateAssets.has(key)) {
            aggregateAssets.set(key, {
                url: key,
                type: asset.type,
                mimeType: asset.mimeType,
                routeCount: 0,
                weightedBytes: 0,
                maxBytes: 0,
                routes: [],
            })
        }
        const aggregate = aggregateAssets.get(key)
        aggregate.routeCount += 1
        aggregate.weightedBytes += asset.bytes || 0
        aggregate.maxBytes = Math.max(aggregate.maxBytes, asset.bytes || 0)
        aggregate.routes.push(result.route)
    }
}

const summary = {
    generatedAt: new Date().toISOString(),
    methodology: {
        browser: "Google Chrome via Playwright CLI",
        isolatedSessions: true,
        cacheDisabled: true,
        viewport: "1440x1000",
        settleMs: "6000 normally; 1500 for known 404 routes",
        measurement:
            "Cold browser context per route; initial viewport only; no scrolling or interaction.",
    },
    routeCount: results.length,
    results,
    rankings: {
        pagesByTransfer: [...results]
            .sort(
                (left, right) =>
                    (right.network?.totalBytes || 0) -
                    (left.network?.totalBytes || 0)
            )
            .map((result) => ({
                route: result.route,
                bytes: result.network?.totalBytes || 0,
                requests: result.network?.requestCount || 0,
            })),
        pagesByLcp: [...results]
            .sort(
                (left, right) =>
                    (right.timing?.lcpMs || 0) - (left.timing?.lcpMs || 0)
            )
            .map((result) => ({
                route: result.route,
                lcpMs: result.timing?.lcpMs || 0,
                lcpUrl: result.timing?.lcpUrl || "",
            })),
        pagesByLoad: [...results]
            .sort(
                (left, right) =>
                    (right.timing?.loadMs || 0) -
                    (left.timing?.loadMs || 0)
            )
            .map((result) => ({
                route: result.route,
                loadMs: result.timing?.loadMs || 0,
            })),
        assetsByWeightedTransfer: [...aggregateAssets.values()]
            .sort(
                (left, right) => right.weightedBytes - left.weightedBytes
            )
            .slice(0, 100),
    },
}

fs.writeFileSync(
    path.join(cwd, "summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`
)

const tableRows = results
    .map((result) => {
        const timing = result.timing || {}
        const media = result.media || {}
        return [
            result.route,
            result.status || 0,
            result.finalUrl || "",
            Math.round(timing.ttfbMs || 0),
            Math.round(timing.fcpMs || 0),
            Math.round(timing.lcpMs || 0),
            Math.round(timing.loadMs || 0),
            Number(timing.cls || 0).toFixed(3),
            timing.longTaskCount || 0,
            Math.round((result.network?.totalBytes || 0) / 1024),
            result.network?.requestCount || 0,
            `${media.images?.ready || 0}/${media.images?.total || 0}`,
            `${media.videos?.readyState2Plus || 0}/${media.videos?.total || 0}`,
            media.iframes?.total || 0,
            (result.errors?.consoleErrors?.length || 0) +
                (result.errors?.pageErrors?.length || 0),
        ]
    })
    .map(
        (cells) =>
            `| ${cells.map((cell) => String(cell).replace(/\|/g, "\\|")).join(" | ")} |`
    )
    .join("\n")

const markdown = `# Full-Site Desktop Chrome Performance Audit

Generated ${summary.generatedAt}.

- Browser: Google Chrome through the required Playwright CLI wrapper
- Isolation: fresh named browser session and disabled cache for every route
- Viewport: 1440×1000
- Scope: initial viewport load only; no scrolling or interaction
- Settle window: 6 seconds after load; 1.5 seconds for known 404 routes
- Transfer values: Chrome DevTools Protocol encoded transfer bytes

| Route | Status | Final URL | TTFB ms | FCP ms | LCP ms | Load ms | CLS | Long tasks | KiB | Requests | Images ready | Videos ready | Iframes | JS errors |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
${tableRows}
`

fs.writeFileSync(path.join(cwd, "README.md"), markdown)
process.stdout.write(`Completed ${results.length} routes. Wrote summary.json and README.md.\n`)
