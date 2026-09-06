#!/usr/bin/env node

import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { mkdir, readFile, stat, writeFile } from "node:fs/promises"
import { basename, dirname, extname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const toolDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(toolDirectory, "../..")
const slug = process.argv[2] || "gaia"
const snapshotDate =
    process.argv[3] || new Intl.DateTimeFormat("en-CA").format(new Date())
const pageUrl = `https://micahhoang.com/case-studies/${slug}`
const outputRoot = join(
    repositoryRoot,
    "assets",
    "by-project",
    slug,
    `live-site-${snapshotDate}`
)
const playwrightCli =
    process.env.PWCLI ||
    join(
        process.env.HOME,
        ".codex",
        "skills",
        "playwright",
        "scripts",
        "playwright_cli.sh"
    )

const viewports = [
    { name: "desktop", width: 1200, height: 900 },
    { name: "tablet", width: 810, height: 900 },
    { name: "mobile", width: 390, height: 844 },
]

const mediaExpression = `() => {
    const previousHeading = element => Array.from(document.querySelectorAll("h1,h2,h3"))
        .filter(heading => heading.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING)
        .at(-1)?.textContent?.trim() || null

    const media = Array.from(document.querySelectorAll("img,video,source")).map((element, index) => ({
        index,
        tag: element.tagName.toLowerCase(),
        alt: element.getAttribute("alt"),
        src: element.getAttribute("src"),
        currentSrc: element.currentSrc || null,
        srcset: element.getAttribute("srcset"),
        poster: element.getAttribute("poster"),
        link: element.closest("a")?.href || null,
        section: previousHeading(element),
    }))

    const metadata = Array.from(document.querySelectorAll(
        'meta[property="og:image"],meta[name="twitter:image"]'
    )).map(element => ({
        property: element.getAttribute("property") || element.getAttribute("name"),
        url: element.getAttribute("content"),
    }))

    return { media, metadata, title: document.title, url: location.href }
}`

function runPlaywright(argumentsList) {
    return execFileSync(playwrightCli, argumentsList, {
        cwd: repositoryRoot,
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
        stdio: ["ignore", "pipe", "pipe"],
    })
}

function parseEvaluation(output) {
    const envelope = JSON.parse(output)
    return JSON.parse(envelope.result)
}

function normalizeUrl(value) {
    if (!value) return null
    try {
        const url = new URL(value)
        if (
            url.hostname !== "framerusercontent.com" &&
            url.hostname !== "files.catbox.moe"
        ) {
            return null
        }
        if (url.hostname === "framerusercontent.com") url.search = ""
        return url.href
    } catch {
        return null
    }
}

function urlsFromSrcset(srcset) {
    if (!srcset) return []
    return srcset
        .split(",")
        .map(candidate => candidate.trim().split(/\s+/)[0])
        .filter(Boolean)
}

function isOtherProjectLink(value) {
    if (!value) return false
    try {
        const path = new URL(value, pageUrl).pathname.replace(/\/$/, "")
        return (
            path.startsWith("/case-studies/") &&
            path !== `/case-studies/${slug}`
        )
    } catch {
        return false
    }
}

function classify(url, role) {
    const extension = extname(new URL(url).pathname).toLowerCase()
    if (role === "poster") return "poster"
    if (role === "social-image") return "metadata"
    if ([".mp4", ".mov", ".webm"].includes(extension)) return "video"
    return "image"
}

function addAsset(assetMap, rawUrl, details) {
    const sourceUrl = normalizeUrl(rawUrl)
    if (!sourceUrl) return
    const key = sourceUrl
    const existing = assetMap.get(key) || {
        sourceUrl,
        kind: classify(sourceUrl, details.role),
        roles: new Set(),
        sections: new Set(),
        viewports: new Set(),
        renderedUrls: new Set(),
    }
    existing.roles.add(details.role)
    if (details.section) existing.sections.add(details.section)
    if (details.viewport) existing.viewports.add(details.viewport)
    if (rawUrl) existing.renderedUrls.add(rawUrl)
    assetMap.set(key, existing)
}

async function downloadAsset(asset, index) {
    const sourceName = basename(new URL(asset.sourceUrl).pathname)
    const folder =
        asset.kind === "video"
            ? "videos"
            : asset.kind === "poster"
              ? "posters"
              : asset.kind === "metadata"
                ? "metadata"
                : "images"
    const outputPath = join(outputRoot, folder, sourceName)
    await mkdir(dirname(outputPath), { recursive: true })

    let status = "downloaded"
    try {
        const existing = await stat(outputPath)
        if (existing.size > 0) status = "skipped-existing"
    } catch {
        // Missing files are downloaded below.
    }

    let contentType = null
    if (status === "downloaded") {
        const response = await fetch(asset.sourceUrl, { redirect: "follow" })
        if (!response.ok) {
            throw new Error(
                `${response.status} ${response.statusText}: ${asset.sourceUrl}`
            )
        }
        contentType = response.headers.get("content-type")
        const bytes = Buffer.from(await response.arrayBuffer())
        await writeFile(outputPath, bytes)
    }

    const bytes = await readFile(outputPath)
    if (!contentType) {
        const response = await fetch(asset.sourceUrl, {
            method: "HEAD",
            redirect: "follow",
        })
        if (response.ok) contentType = response.headers.get("content-type")
    }

    process.stdout.write(
        `${String(index + 1).padStart(2, "0")} ${status.padEnd(16)} ${folder}/${sourceName} (${bytes.length} bytes)\n`
    )

    return {
        order: index + 1,
        kind: asset.kind,
        roles: [...asset.roles].sort(),
        sections: [...asset.sections],
        viewports: [...asset.viewports],
        sourceUrl: asset.sourceUrl,
        renderedUrls: [...asset.renderedUrls].sort(),
        file: relative(outputRoot, outputPath),
        bytes: bytes.length,
        sha256: createHash("sha256").update(bytes).digest("hex"),
        contentType,
        status,
    }
}

runPlaywright(["goto", pageUrl])

const captures = []
const assetMap = new Map()

for (const viewport of viewports) {
    runPlaywright(["resize", String(viewport.width), String(viewport.height)])
    runPlaywright([
        "run-code",
        `async page => {
            await page.evaluate(async () => {
                for (
                    let y = 0;
                    y < document.documentElement.scrollHeight;
                    y += Math.max(600, innerHeight * 0.75)
                ) {
                    scrollTo(0, y)
                    await new Promise(resolve => setTimeout(resolve, 180))
                }
                scrollTo(0, 0)
            })
            await page.waitForTimeout(900)
        }`,
    ])

    const capture = parseEvaluation(
        runPlaywright(["--json", "--raw", "eval", mediaExpression])
    )
    captures.push({ ...viewport, title: capture.title, url: capture.url })

    for (const item of capture.media) {
        if (isOtherProjectLink(item.link)) continue

        if (item.tag === "video") {
            addAsset(assetMap, item.src || item.currentSrc, {
                role: "video",
                section: item.section,
                viewport: viewport.name,
            })
            addAsset(assetMap, item.poster, {
                role: "poster",
                section: item.section,
                viewport: viewport.name,
            })
            continue
        }

        if (item.tag === "source") {
            const candidates = [
                item.src,
                item.currentSrc,
                ...urlsFromSrcset(item.srcset),
            ]
            for (const candidate of candidates) {
                addAsset(assetMap, candidate, {
                    role: "responsive-source",
                    section: item.section,
                    viewport: viewport.name,
                })
            }
            continue
        }

        addAsset(assetMap, item.src || item.currentSrc, {
            role: "image",
            section: item.section,
            viewport: viewport.name,
        })
        for (const candidate of urlsFromSrcset(item.srcset)) {
            addAsset(assetMap, candidate, {
                role: "responsive-source",
                section: item.section,
                viewport: viewport.name,
            })
        }
    }

    for (const item of capture.metadata) {
        addAsset(assetMap, item.url, {
            role: "social-image",
            section: item.property,
            viewport: viewport.name,
        })
    }
}

await mkdir(outputRoot, { recursive: true })
const pageResponse = await fetch(pageUrl, { redirect: "follow" })
if (!pageResponse.ok) {
    throw new Error(
        `${pageResponse.status} ${pageResponse.statusText}: ${pageUrl}`
    )
}
const pageHtml = await pageResponse.text()
await writeFile(join(outputRoot, "page.html"), pageHtml)

const assets = [...assetMap.values()]
const downloaded = []
for (let index = 0; index < assets.length; index += 1) {
    downloaded.push(await downloadAsset(assets[index], index))
}

const counts = downloaded.reduce(
    (summary, asset) => {
        summary.total += 1
        summary.bytes += asset.bytes
        summary[asset.kind] = (summary[asset.kind] || 0) + 1
        return summary
    },
    { total: 0, bytes: 0, image: 0, video: 0, poster: 0, metadata: 0 }
)

const manifest = {
    source: "canonical-published-site",
    pageUrl,
    capturedAt: new Date().toISOString(),
    snapshotDate,
    title: captures[0]?.title || null,
    scope: {
        included:
            "Gaia case-study images, videos, video posters, responsive media sources, and the page-specific social-share image.",
        excluded:
            "Global fonts, JavaScript, site icons, resume PDF, search indexes, and media linked to the Other Projects cards.",
    },
    viewports: captures,
    pageHtml: "page.html",
    counts,
    assets: downloaded,
}

await writeFile(
    join(outputRoot, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`
)

process.stdout.write(
    `Saved ${counts.total} assets (${counts.bytes} bytes) to ${relative(
        repositoryRoot,
        outputRoot
    )}\n`
)
