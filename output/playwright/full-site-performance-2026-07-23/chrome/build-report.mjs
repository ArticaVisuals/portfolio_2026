import fs from "node:fs"
import path from "node:path"

const cwd = process.cwd()
const files = fs
    .readdirSync(cwd)
    .filter((file) => /^\d{2}-.*\.json$/.test(file))
    .sort()
const results = files.map((file) =>
    JSON.parse(fs.readFileSync(path.join(cwd, file), "utf8"))
)

const bytes = (value) => Number(value || 0)
const mib = (value) => bytes(value) / 1024 / 1024
const fixed = (value, digits = 0) =>
    Number(value || 0).toFixed(digits).replace(/\.0+$/, "")
const escapeCell = (value) => String(value ?? "").replace(/\|/g, "\\|")
const tableRow = (cells) =>
    `| ${cells.map((cell) => escapeCell(cell)).join(" | ")} |`
const routePath = (url) => {
    try {
        const parsed = new URL(url)
        return `${parsed.pathname}${parsed.search}`
    } catch {
        return url || ""
    }
}
const typeBytes = (result, type) =>
    result.network?.totalsByType?.[type]?.bytes || 0

const assetMap = new Map()
for (const result of results) {
    for (const asset of result.network?.largestAssets || []) {
        const current = assetMap.get(asset.url) || {
            url: asset.url,
            type: asset.type,
            mimeType: asset.mimeType,
            requestOccurrences: 0,
            weightedBytes: 0,
            maxRequestBytes: 0,
            routes: new Set(),
        }
        current.requestOccurrences += 1
        current.weightedBytes += asset.bytes || 0
        current.maxRequestBytes = Math.max(
            current.maxRequestBytes,
            asset.bytes || 0
        )
        current.routes.add(result.route)
        assetMap.set(asset.url, current)
    }
}
const aggregateAssets = [...assetMap.values()]
    .map((asset) => ({ ...asset, routes: [...asset.routes] }))
    .sort((left, right) => right.weightedBytes - left.weightedBytes)

const pagesByTransfer = [...results].sort(
    (left, right) =>
        bytes(right.network?.totalBytes) - bytes(left.network?.totalBytes)
)
const pagesByLcp = [...results].sort(
    (left, right) =>
        Number(right.timing?.lcpMs || 0) - Number(left.timing?.lcpMs || 0)
)
const pagesByLoad = [...results].sort(
    (left, right) =>
        Number(right.timing?.loadMs || 0) - Number(left.timing?.loadMs || 0)
)
const pagesByCls = [...results].sort(
    (left, right) =>
        Number(right.timing?.cls || 0) - Number(left.timing?.cls || 0)
)

const summary = {
    generatedAt: new Date().toISOString(),
    methodology: {
        browser: "Google Chrome via the Playwright CLI wrapper",
        isolatedSessions: true,
        cacheDisabled: true,
        viewport: { width: 1440, height: 1000 },
        settleMs:
            "6000 after load; 1500 for /404 and documented 404 case-study routes",
        scope: "Cold initial viewport load only; no scrolling or interaction",
        transferSource:
            "Chrome DevTools Protocol Network.loadingFinished encodedDataLength",
    },
    routeCount: results.length,
    results,
    rankings: {
        pagesByTransfer: pagesByTransfer.map((result) => ({
            route: result.route,
            totalBytes: result.network?.totalBytes || 0,
            mediaBytes: typeBytes(result, "Media"),
            imageBytes: typeBytes(result, "Image"),
            requests: result.network?.requestCount || 0,
        })),
        pagesByLcp: pagesByLcp.map((result) => ({
            route: result.route,
            lcpMs: result.timing?.lcpMs || 0,
            lcpUrl: result.timing?.lcpUrl || "",
        })),
        pagesByLoad: pagesByLoad.map((result) => ({
            route: result.route,
            loadMs: result.timing?.loadMs || 0,
        })),
        pagesByCls: pagesByCls.map((result) => ({
            route: result.route,
            cls: result.timing?.cls || 0,
        })),
        assetsByWeightedTransfer: aggregateAssets,
    },
}
fs.writeFileSync(
    path.join(cwd, "summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`
)

const routeRows = results
    .map((result) => {
        const timing = result.timing || {}
        const image = result.media?.images || {}
        const video = result.media?.videos || {}
        const jsErrors =
            (result.errors?.consoleErrors?.length || 0) +
            (result.errors?.pageErrors?.length || 0)
        const final =
            routePath(result.finalUrl) === result.route
                ? ""
                : ` → ${routePath(result.finalUrl)}`
        return tableRow([
            `\`${result.route}\``,
            `${result.status || 0}${final}`,
            `${fixed(timing.ttfbMs)}/${fixed(timing.fcpMs)}/${fixed(timing.lcpMs)}/${fixed(timing.loadMs)}`,
            fixed(timing.cls, 3),
            `${timing.longTaskCount || 0}/${fixed(timing.longTaskTotalMs)}`,
            fixed(mib(result.network?.totalBytes), 2),
            `${fixed(mib(typeBytes(result, "Media")), 2)}/${fixed(mib(typeBytes(result, "Image")), 2)}/${fixed(mib(typeBytes(result, "Script")), 2)}/${fixed(mib(typeBytes(result, "Font")), 2)}/${fixed(mib(typeBytes(result, "Document")), 2)}`,
            `${result.network?.requestCount || 0}/${result.network?.failedRequestCount || 0}`,
            `${image.ready || 0}/${image.total || 0}`,
            `${video.readyState2Plus || 0}/${video.total || 0}`,
            jsErrors,
        ])
    })
    .join("\n")

const caseRows = results
    .filter((result) => result.route?.startsWith("/case-studies/"))
    .map((result) => {
        const marker = result.runtimeMarkers || {}
        const video = result.media?.videos || {}
        const markerStatus =
            result.status === 404
                ? "404"
                : `${marker.videoManager || 0}/${marker.lightbox || 0}/${marker.controllers || 0}`
        return tableRow([
            `\`${result.route}\``,
            result.status || 0,
            markerStatus,
            `${video.autoplayPlaying || 0}/${video.autoplayTotal || 0}`,
            `${video.playing || 0}/${video.total || 0}`,
            video.preloadNone || 0,
            `${video.readyState2Plus || 0}/${video.total || 0}`,
            fixed(mib(typeBytes(result, "Media")), 2),
            result.network?.failedRequestCount || 0,
        ])
    })
    .join("\n")

const topPageRows = pagesByTransfer
    .slice(0, 15)
    .map((result, index) =>
        tableRow([
            index + 1,
            `\`${result.route}\``,
            fixed(mib(result.network?.totalBytes), 2),
            fixed(mib(typeBytes(result, "Media")), 2),
            fixed(mib(typeBytes(result, "Image")), 2),
            result.network?.requestCount || 0,
            fixed(result.timing?.lcpMs),
            fixed(result.timing?.loadMs),
        ])
    )
    .join("\n")

const topAssetRows = aggregateAssets
    .slice(0, 20)
    .map((asset, index) =>
        tableRow([
            index + 1,
            asset.type,
            `[${asset.url.split("/").at(-1)?.split("?")[0]}](${asset.url})`,
            fixed(mib(asset.maxRequestBytes), 2),
            asset.requestOccurrences,
            fixed(mib(asset.weightedBytes), 2),
            asset.routes.map((route) => `\`${route}\``).join(", "),
        ])
    )
    .join("\n")

const liveResults = results.filter((result) => result.status === 200)
const true404s = results.filter((result) => result.status === 404)
const liveWithPageErrors = liveResults.filter(
    (result) => (result.errors?.pageErrors?.length || 0) > 0
)
const liveWithConsoleErrors = liveResults.filter(
    (result) => (result.errors?.consoleErrors?.length || 0) > 0
)
const catboxFailureRoutes = liveResults.filter((result) =>
    (result.errors?.failedRequests || []).some((request) =>
        request.url.includes("files.catbox.moe")
    )
)

const markdown = `# Full-Site Desktop Chrome Performance Audit

Generated ${summary.generatedAt}. Raw per-route JSON is stored alongside this report.

## Method

- Google Chrome driven through the required Playwright CLI wrapper.
- A fresh named browser session for every route, 1440×1000 viewport, browser cache disabled.
- Cold initial viewport load only; no scrolling or interaction.
- Metrics were captured after a 6-second settle window. Known 404 routes used 1.5 seconds.
- Transfer is CDP encoded network bytes. Media range/chunk requests are counted as Chrome reported them.
- DOM readiness is a post-settle snapshot; below-the-fold lazy assets may intentionally remain incomplete.

## Ranked Findings

1. **Media transfer dominates the heaviest pages.** Highland Harvests transferred **${fixed(mib(pagesByTransfer[0].network.totalBytes), 2)} MiB**, followed by Motion Connect at **${fixed(mib(pagesByTransfer[1].network.totalBytes), 2)} MiB**, Gaia at **${fixed(mib(pagesByTransfer[2].network.totalBytes), 2)} MiB**, Seek Truth at **${fixed(mib(pagesByTransfer[3].network.totalBytes), 2)} MiB**, and Peak Energy at **${fixed(mib(pagesByTransfer[4].network.totalBytes), 2)} MiB**. Media accounts for roughly 85–94% of the first, second, third, and fifth pages.
2. **Identical large media URLs are fetched repeatedly during one cold load.** Highland Harvests fetched the 23.43 MiB \`CuwjJC…mov\` four times (93.74 MiB weighted). Motion Connect fetched \`fB1U…mp4\` four times and \`bZzI…mp4\` four times. Seek Truth fetched its 8.43 MiB hero video three times, and Gaia fetched several large MP4s three times each.
3. **Runtime markers do not guarantee transfer gating.** Gaia has all three case-study markers but all 16 videos reached ready state and transferred 70.81 MiB. Peak Energy has all markers but all 10 videos became ready and transferred 34.24 MiB. Highland Harvests has all markers but all 3 videos became ready and transferred 104.82 MiB. Motion Connect is the clearest gated case: 21 of 27 videos use \`preload="none"\`, yet the six ready videos plus repeated requests still cost 86.19 MiB.
4. **Runtime coverage is incomplete on three live case studies.** WhatsApp and Wolff Olins expose none of the video-manager, lightbox, or controller markers. Cellular Symphony has video-manager and lightbox markers but no controller marker.
5. **CLS is the main Core Web Vitals failure.** Gaia measured **${fixed(pagesByCls[0].timing.cls, 3)} CLS** and Motion Connect **${fixed(pagesByCls[1].timing.cls, 3)}**. \`/index\`, the \`/case-studies → /index\` redirect target, and the home page also exceed 0.25. LCP stayed at or below ${fixed(pagesByLcp[0].timing.lcpMs)} ms on every route, with \`/play\` the slowest.
6. **Load completion is held open by media on six pages.** Gaia, Peak Energy, AirPods, Simon & Schuster, Motion Connect, and National Park Cards all report load-event completion around 7.0–7.6 seconds even though FCP/LCP arrive much earlier.
7. **Third-party fallback media is unreliable in this Chrome run.** \`files.catbox.moe\` poster/video requests failed with \`ERR_INVALID_HANDLE\` on ${catboxFailureRoutes.length} live pages. Numerous \`ERR_ABORTED\` video requests appear where source swapping or runtime gating cancels media; these are listed separately from page exceptions in raw JSON.
8. **No uncaught page exceptions were observed on live routes.** ${liveWithPageErrors.length} live pages emitted a Playwright \`pageerror\`; ${liveWithConsoleErrors.length} emitted console errors, mostly failed Catbox media plus Cellular Symphony's third-party Cloudflare/401 messages.
9. **Potential-route outcomes are now explicit.** \`/case-studies\` fully renders by redirecting to \`/index\`; \`/home-alt\` and \`/case-studies/typldn\` fully render in-browser. \`/404\`, \`/case-studies/karuna\`, \`/case-studies/rejuve\`, and \`/case-studies/belly-bar\` are true 404s (${true404s.length} audited 404 routes); the three case-study URLs retain the requested final URL but canonicalize to \`/404\`. The live Karuna content is \`/case-studies/highland-harvests\`.
10. **\`/play\` is material but not the site's largest page.** It transferred **${fixed(mib(results.find((result) => result.route === "/play")?.network.totalBytes), 2)} MiB**: **${fixed(mib(typeBytes(results.find((result) => result.route === "/play"), "Media")), 2)} MiB media** and **${fixed(mib(typeBytes(results.find((result) => result.route === "/play"), "Image")), 2)} MiB images**. All 94 DOM images and the current 16-video budget were ready after settling; LCP was ${fixed(results.find((result) => result.route === "/play")?.timing?.lcpMs)} ms.

## Heaviest Pages

| Rank | Route | Total MiB | Media MiB | Image MiB | Requests | LCP ms | Load ms |
|---:|---|---:|---:|---:|---:|---:|---:|
${topPageRows}

## Complete Route Results

Timing is TTFB/FCP/LCP/load in milliseconds. Transfer types are media/image/script/font/document in MiB. Long tasks are count/total milliseconds. Requests are total/failed.

| Route | Status / final | Timing ms | CLS | Long tasks | Total MiB | M/I/JS/F/Doc MiB | Requests | Images ready | Videos ready | Console + page errors |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
${routeRows}

## Case-Study Runtime Coverage

Markers are video-manager/lightbox/controllers. Autoplay is playing/declared; playing is all currently playing/all video elements.

| Route | Status | Markers VM/LB/C | Autoplay | Playing | Preload none | Ready | Media MiB | Failed requests |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
${caseRows}

## Top Weighted Assets

Weighted transfer sums repeated requests for the same URL across the audited cold loads. This ranking is aggregated from each route's 20 largest requests.

| Rank | Type | Asset | Max request MiB | Request occurrences | Weighted MiB | Routes |
|---:|---|---|---:|---:|---:|---|
${topAssetRows}

## Artifacts

- \`summary.json\` contains every result and all rankings.
- \`01-home.json\` through \`25-case-studies--belly-bar.json\` contain raw route metrics, transfer breakdowns, largest requests, readiness, console output, and request failures.
- \`audit-route.js\`, \`run-audit.mjs\`, \`rerun-route.mjs\`, and \`build-report.mjs\` preserve the reproducible Playwright workflow.
`

fs.writeFileSync(path.join(cwd, "README.md"), markdown)
process.stdout.write(
    `Built report for ${results.length} routes; ${aggregateAssets.length} weighted assets ranked.\n`
)
