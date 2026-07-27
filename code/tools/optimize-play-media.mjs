#!/usr/bin/env node

import { spawn } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "./image-optimizer/node_modules/sharp/lib/index.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, "../..")
const playRoot = path.join(workspaceRoot, "assets/Play")
const siteUrl = "https://micahhoang.com/play"
const auditDate = "2026-07-23"
const shouldOptimize = process.argv.includes("--optimize")
const shouldWriteReport =
    shouldOptimize || process.argv.includes("--write-report")

const POSTER_MAX_DIMENSION = 1600
const POSTER_QUALITY = 78
const VIDEO_MAX_DIMENSION = 900
const VIDEO_CRF = 26
const VIDEO_PRESET = "slow"

const folderAliases = {
    "motion-connect": "motion-connect-2025",
    "motion-connect-unused-concept": "motion-connect-2025",
    "babel-clip-1": "babel-short-film",
    "babel-clip-2": "babel-short-film",
    "babel-clip-3": "babel-short-film",
    "play-001": "meihao",
    "play-002": "root-growth",
    "play-004": "mental-models-playing-cards",
    "play-006": "visual-communication-arts-speaker-series",
    "play-007": "aspen-valley-landscaping",
    "play-008": "wolff-olins-x-artcenter",
    "play-009": "christmas-card-design",
    "play-010": "skycar-creative",
    "play-011": "rotating-cube",
    "play-012": "speedlab-screens",
    "play-013": "live-happy-be-healthy",
    "play-014": "flower",
    "play-016": "koru",
    "play-017": "independent-lens",
    "play-018": "audit-and-beyond",
    "play-019": "seek-truth",
    "play-021": "geometric-animals",
    "play-022": "devwars-rank-badges",
    "play-025": "neon-lights",
    "play-026": "hmct-email-blast",
    "play-027": "national-park-cards",
    "play-028": "photo-book",
    "play-029": "pop-talks-google",
    "play-031": "artcenter-mdes-micro-identity",
    "play-033": "redwood-estates",
    "rejuve-in-store": "rejuve",
    "image-gen-creations-landscape-43x24": "image-gen-creations",
    "image-gen-creations-square-1x1": "image-gen-creations",
    "image-gen-creations-portrait-29x36": "image-gen-creations",
}

const sourceOverrides = {
    "babel-clip-3": {
        video: "assets/Play/babel-short-film/source/Babel-Short-Film-Y744Jtrpbw1fTVEeKoCfbNuBw.mp4",
    },
    "babel-clip-2": {
        video: "assets/Play/babel-short-film/source/Babel-Short-Film-f3oRk3gwGCGCkODJKk9eXCYak.mp4",
    },
    "babel-clip-1": {
        video: "assets/Play/babel-short-film/source/Babel-Short-Film-Zu3O2vH66kRkPGKKxGBpXnnWQwE.mp4",
    },
    "play-001": {
        poster: "assets/Play/meihao/source/meihao-current-poster.png",
        video: "assets/Play/meihao/optimized/meihao-drink-packaging-flip-1220x1568-1000ms-bottom-preserved-crf25.mp4",
    },
    "play-002": {
        video: "assets/Play/root-growth/source/Root-Growth-nuV5bQ9xGFCXYBrg3DX1Cx8R8E.mp4",
    },
    "play-006": {
        poster: "assets/Play/visual-communication-arts-speaker-series/source/play-006-image-visart-com-fa24-poster-mockup.jpg",
    },
    "play-014": {
        video: "assets/Play/flower/source/play-014-video-flower-video.mp4",
    },
    "play-017": {
        poster: "assets/Play/independent-lens/source/play-017-image-independent-lens-poster-mockup.png",
    },
    "play-019": {
        video: "assets/by-project/seek-truth/main/source/D1559036843585192953673121256981__Seek-Truth-Promo-Video.mp4",
    },
    "play-026": {
        video: "assets/Play/hmct-email-blast/source/play-026-video-hmctemailblast-video.mp4",
    },
    "play-027": {
        poster: "assets/Play/national-park-cards/source/play-027-image-img-5149-edit-2.jpg",
    },
    "coin-experimental-music-poster": {
        poster: "assets/Play/coin-experimental-music-poster/coin-experimental-music-poster-poster-1080x1620.jpg",
        video: "assets/Play/coin-experimental-music-poster/coin-experimental-music-poster-loop-1080x1620.mp4",
    },
    "rejuve-in-store": {
        video: "assets/Play/rejuve/optimized/rejuve-in-store-1920x1080-1000ms-loop.gif",
    },
    "the-windmill-project": {
        poster: "assets/Play/the-windmill-project/optimized/the-windmill-project-poster-1800x1200-q3.jpg",
        video: "assets/Play/the-windmill-project/optimized/the-windmill-project-1800x1200-1000ms-loop-crf23.mp4",
    },
    dandelion: {
        poster: "assets/Play/dandelion/optimized/dandelion-poster-1920x1080-q3.jpg",
        video: "assets/Play/dandelion/optimized/dandelion-first-5s-1920x1080-crf23-noaudio.mp4",
    },
}

function relative(filePath) {
    return path.relative(workspaceRoot, filePath).split(path.sep).join("/")
}

function formatBytes(bytes) {
    if (!Number.isFinite(bytes)) return "unknown"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / 1024 ** 2).toFixed(2)} MB`
}

function assetId(url) {
    try {
        return path.basename(new URL(url).pathname, path.extname(new URL(url).pathname))
    } catch {
        return "unknown"
    }
}

function extensionFromUrl(url, fallback) {
    try {
        return path.extname(new URL(url).pathname).toLowerCase() || fallback
    } catch {
        return fallback
    }
}

function unwrap(field) {
    return field?.value ?? null
}

function decodeHandover(flat) {
    const cache = new Map()

    function dereference(index) {
        if (typeof index !== "number") return index
        if (cache.has(index)) return cache.get(index)

        const value = flat[index]
        if (Array.isArray(value)) {
            if (value[0] === "Map") {
                const output = new Map()
                cache.set(index, output)
                for (let position = 1; position < value.length; position += 2) {
                    output.set(
                        dereference(value[position]),
                        dereference(value[position + 1])
                    )
                }
                return output
            }

            const output = []
            cache.set(index, output)
            for (const reference of value) {
                output.push(dereference(reference))
            }
            return output
        }

        if (value && typeof value === "object") {
            const output = {}
            cache.set(index, output)
            for (const [key, reference] of Object.entries(value)) {
                output[key] = dereference(reference)
            }
            return output
        }

        cache.set(index, value)
        return value
    }

    return dereference(0)
}

function findCmsRows(value, seen = new Set()) {
    if (!value || typeof value !== "object" || seen.has(value)) return null
    seen.add(value)

    if (
        Array.isArray(value) &&
        value.length > 0 &&
        value.every(
            (item) =>
                item &&
                typeof item === "object" &&
                "mF2Cw292P" in item &&
                "XwW7XD5jI" in item &&
                "uqRtTdRM1" in item
        )
    ) {
        return value
    }

    if (value instanceof Map) {
        for (const [key, item] of value) {
            const inKey = findCmsRows(key, seen)
            if (inKey) return inKey
            const inValue = findCmsRows(item, seen)
            if (inValue) return inValue
        }
        return null
    }

    for (const item of Object.values(value)) {
        const found = findCmsRows(item, seen)
        if (found) return found
    }
    return null
}

async function getCmsRows() {
    const response = await fetch(`${siteUrl}?media-audit=${Date.now()}`)
    if (!response.ok) {
        throw new Error(`Could not fetch ${siteUrl}: HTTP ${response.status}`)
    }
    const html = await response.text()
    const match = html.match(
        /<script type="framer\/handover" id="__framer__handoverData">([\s\S]*?)<\/script>/
    )
    if (!match) throw new Error("Framer handover data was not found")

    const rows = findCmsRows(decodeHandover(JSON.parse(match[1])))
    if (!rows) throw new Error("Play Archive CMS rows were not found")

    return rows
        .map((row) => {
            const poster = unwrap(row.uqRtTdRM1)
            return {
                slug: unwrap(row.mF2Cw292P),
                title: unwrap(row.XwW7XD5jI),
                order: unwrap(row.c2qQhVGwP),
                posterUrl: poster?.src || poster || "",
                posterWidth: poster?.pixelWidth || null,
                posterHeight: poster?.pixelHeight || null,
                videoUrl: unwrap(row.KWCosE6Ef) || "",
                cmsId: unwrap(row.id),
            }
        })
        .sort((a, b) => a.order - b.order)
}

async function mapLimit(items, limit, worker) {
    const results = new Array(items.length)
    let nextIndex = 0

    async function runWorker() {
        while (true) {
            const index = nextIndex
            nextIndex += 1
            if (index >= items.length) return
            results[index] = await worker(items[index], index)
        }
    }

    await Promise.all(
        Array.from({ length: Math.min(limit, items.length) }, runWorker)
    )
    return results
}

async function remoteBytes(url, method = "GET") {
    const response = await fetch(url, { method })
    if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${url}`)
    }
    const declared = Number(response.headers.get("content-length"))
    if (method === "HEAD" && Number.isFinite(declared) && declared > 0) {
        return declared
    }
    return (await response.arrayBuffer()).byteLength
}

function run(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: workspaceRoot,
            stdio: options.stdio || ["ignore", "pipe", "pipe"],
        })
        const stdout = []
        const stderr = []
        child.stdout?.on("data", (chunk) => stdout.push(chunk))
        child.stderr?.on("data", (chunk) => stderr.push(chunk))
        child.on("error", reject)
        child.on("close", (code) => {
            if (code !== 0) {
                reject(
                    new Error(
                        `${command} failed (${code}): ${Buffer.concat(stderr).toString()}`
                    )
                )
                return
            }
            resolve(Buffer.concat(stdout).toString())
        })
    })
}

async function probeVideo(input) {
    const output = await run("ffprobe", [
        "-v",
        "error",
        "-show_entries",
        "stream=index,codec_type,codec_name,profile,pix_fmt,width,height,r_frame_rate:format=duration,size,bit_rate",
        "-of",
        "json",
        input,
    ])
    const parsed = JSON.parse(output)
    const video = parsed.streams?.find((stream) => stream.codec_type === "video")
    const audio = parsed.streams?.find((stream) => stream.codec_type === "audio")
    return {
        width: video?.width || null,
        height: video?.height || null,
        codec: video?.codec_name || null,
        profile: video?.profile || null,
        pixelFormat: video?.pix_fmt || null,
        frameRate: video?.r_frame_rate || null,
        hasAudio: Boolean(audio),
        audioCodec: audio?.codec_name || null,
        duration: Number(parsed.format?.duration) || null,
        probedBytes: Number(parsed.format?.size) || null,
        bitRate: Number(parsed.format?.bit_rate) || null,
    }
}

function posterScore(media) {
    const mb = (media.bytes || 0) / 1024 ** 2
    const maxDimension = Math.max(media.width || 0, media.height || 0)
    const extension = extensionFromUrl(media.url, "")
    let score = 0

    if (mb >= 5) score += 55
    else if (mb >= 2) score += 45
    else if (mb >= 1) score += 35
    else if (mb >= 0.5) score += 25
    else if (mb >= 0.25) score += 15
    else if (mb >= 0.1) score += 7

    if (maxDimension > 3200) score += 28
    else if (maxDimension > 2400) score += 23
    else if (maxDimension > 1800) score += 17
    else if (maxDimension > POSTER_MAX_DIMENSION) score += 12
    else if (maxDimension > 1200) score += 5

    if (extension === ".gif") score += 22
    else if (extension === ".png") score += 10

    return Math.min(100, score)
}

function videoScore(media) {
    const mb = (media.bytes || 0) / 1024 ** 2
    const maxDimension = Math.max(media.width || 0, media.height || 0)
    let score = 0

    if (mb >= 12) score += 50
    else if (mb >= 8) score += 43
    else if (mb >= 5) score += 36
    else if (mb >= 3) score += 29
    else if (mb >= 1.5) score += 21
    else if (mb >= 0.75) score += 12
    else if (mb >= 0.35) score += 6

    if (maxDimension > 1920) score += 42
    else if (maxDimension > 1280) score += 34
    else if (maxDimension > 1080) score += 28
    else if (maxDimension > VIDEO_MAX_DIMENSION) score += 22

    if (media.codec !== "h264") score += 10
    if (media.pixelFormat && media.pixelFormat !== "yuv420p") score += 7
    if (media.hasAudio) score += 5
    return Math.min(100, score)
}

function urgency(score) {
    if (score >= 70) return "Critical"
    if (score >= 45) return "High"
    if (score >= 25) return "Medium"
    return "Low"
}

async function auditRows(rows) {
    process.stdout.write(
        `Auditing ${rows.length} posters and ${rows.filter((row) => row.videoUrl).length} videos.\n`
    )

    const posterMedia = await mapLimit(rows, 6, async (row, index) => {
        const bytes = await remoteBytes(row.posterUrl)
        process.stdout.write(
            `Poster ${String(index + 1).padStart(2, "0")}/${rows.length}: ${row.slug} (${formatBytes(bytes)})\n`
        )
        return {
            kind: "poster",
            slug: row.slug,
            title: row.title,
            order: row.order,
            projectFolder: folderAliases[row.slug] || row.slug,
            url: row.posterUrl,
            width: row.posterWidth,
            height: row.posterHeight,
            bytes,
        }
    })

    const videoRows = rows.filter((row) => row.videoUrl)
    const videoMedia = await mapLimit(videoRows, 4, async (row, index) => {
        const [headBytes, probe] = await Promise.all([
            remoteBytes(row.videoUrl, "HEAD"),
            probeVideo(row.videoUrl),
        ])
        const bytes = headBytes || probe.probedBytes
        process.stdout.write(
            `Video ${String(index + 1).padStart(2, "0")}/${videoRows.length}: ${row.slug} (${probe.width}×${probe.height}, ${formatBytes(bytes)})\n`
        )
        return {
            kind: "video",
            slug: row.slug,
            title: row.title,
            order: row.order,
            projectFolder: folderAliases[row.slug] || row.slug,
            url: row.videoUrl,
            bytes,
            ...probe,
        }
    })

    const allMedia = [...posterMedia, ...videoMedia].map((media) => {
        const score =
            media.kind === "video" ? videoScore(media) : posterScore(media)
        return { ...media, score, urgency: urgency(score) }
    })

    const mediaBySlug = new Map()
    for (const media of allMedia) {
        if (!mediaBySlug.has(media.slug)) mediaBySlug.set(media.slug, [])
        mediaBySlug.get(media.slug).push(media)
    }

    const rankedItems = rows
        .map((row) => {
            const media = mediaBySlug.get(row.slug) || []
            const poster = media.find((item) => item.kind === "poster")
            const video = media.find((item) => item.kind === "video")
            const score = Math.min(
                100,
                Math.round(
                    Math.max(poster?.score || 0, video?.score || 0) +
                        Math.min(poster?.score || 0, video?.score || 0) * 0.25 +
                        Math.min(18, (video?.bytes || 0) / 1024 ** 2 * 2)
                )
            )
            return {
                ...row,
                projectFolder: folderAliases[row.slug] || row.slug,
                poster,
                video,
                originalBytes:
                    (poster?.bytes || 0) + (video?.bytes || 0),
                score,
                urgency: urgency(score),
            }
        })
        .sort(
            (a, b) =>
                b.score - a.score ||
                b.originalBytes - a.originalBytes ||
                a.order - b.order
        )

    return { allMedia, rankedItems }
}

function reportMarkdown(audit) {
    const totalBytes = audit.allMedia.reduce(
        (sum, media) => sum + (media.bytes || 0),
        0
    )
    const posters = audit.allMedia.filter((media) => media.kind === "poster")
    const videos = audit.allMedia.filter((media) => media.kind === "video")
    const oversizedVideos = videos.filter(
        (media) =>
            Math.max(media.width || 0, media.height || 0) > VIDEO_MAX_DIMENSION
    )
    const lines = [
        `# Play Media Optimization Audit — ${auditDate}`,
        "",
        `Live source: \`${siteUrl}\` / Framer CMS \`Play Archive\`.`,
        "",
        `- ${audit.rankedItems.length} CMS items`,
        `- ${posters.length} posters`,
        `- ${videos.length} videos`,
        `- ${oversizedVideos.length} videos exceed the ${VIDEO_MAX_DIMENSION}px maximum dimension`,
        `- ${formatBytes(totalBytes)} total original media transfer size`,
        "",
        "Ranking combines file size, dimensions, format/codec, pixel format, and unnecessary audio. The score ranks optimization urgency, not creative importance.",
        "",
        "| Rank | Urgency | Score | Order | Item | Project folder | Poster | Video | Total |",
        "|---:|---|---:|---:|---|---|---:|---:|---:|",
    ]

    audit.rankedItems.forEach((item, index) => {
        const posterLabel = item.poster
            ? `${item.poster.width}×${item.poster.height}, ${formatBytes(item.poster.bytes)}`
            : "—"
        const videoLabel = item.video
            ? `${item.video.width}×${item.video.height}, ${formatBytes(item.video.bytes)}`
            : "—"
        lines.push(
            `| ${index + 1} | ${item.urgency} | ${item.score} | ${item.order} | ${item.title} (\`${item.slug}\`) | \`assets/Play/${item.projectFolder}/\` | ${posterLabel} | ${videoLabel} | ${formatBytes(item.originalBytes)} |`
        )
    })

    lines.push(
        "",
        "## Output policy",
        "",
        `- Posters: WebP, maximum ${POSTER_MAX_DIMENSION}px on the long edge, quality ${POSTER_QUALITY}, no upscaling.`,
        `- Videos: H.264 MP4, maximum ${VIDEO_MAX_DIMENSION}px on both axes, CRF ${VIDEO_CRF}, ${VIDEO_PRESET} preset, yuv420p, muted/no audio, fast-start.`,
        "- Source downloads and derivatives stay inside each mapped project folder under `assets/Play/`.",
        ""
    )
    return `${lines.join("\n")}\n`
}

function writeAuditReport(audit) {
    const jsonPath = path.join(
        playRoot,
        `optimization-audit-${auditDate}.json`
    )
    const markdownPath = path.join(
        playRoot,
        `optimization-audit-${auditDate}.md`
    )
    fs.writeFileSync(
        jsonPath,
        `${JSON.stringify(
            {
                generatedAt: new Date().toISOString(),
                source: siteUrl,
                policy: {
                    posterMaxDimension: POSTER_MAX_DIMENSION,
                    posterQuality: POSTER_QUALITY,
                    videoMaxDimension: VIDEO_MAX_DIMENSION,
                    videoCrf: VIDEO_CRF,
                    videoPreset: VIDEO_PRESET,
                },
                ...audit,
            },
            null,
            2
        )}\n`
    )
    fs.writeFileSync(markdownPath, reportMarkdown(audit))
    process.stdout.write(`Wrote ${relative(markdownPath)}\n`)
    process.stdout.write(`Wrote ${relative(jsonPath)}\n`)
}

function walkFiles(folder) {
    if (!fs.existsSync(folder)) return []
    const output = []
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
        const fullPath = path.join(folder, entry.name)
        if (entry.isDirectory()) output.push(...walkFiles(fullPath))
        else if (entry.isFile()) output.push(fullPath)
    }
    return output
}

function findExistingAsset(projectFolder, id, kind) {
    const extensions =
        kind === "video"
            ? new Set([".mp4", ".mov", ".m4v", ".webm"])
            : new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"])
    return walkFiles(projectFolder)
        .filter(
            (filePath) =>
                path.basename(filePath).includes(id) &&
                extensions.has(path.extname(filePath).toLowerCase()) &&
                !path.basename(filePath).includes(`max${VIDEO_MAX_DIMENSION}`)
        )
        .sort((a, b) => {
            const priority = (filePath) => {
                if (filePath.includes(`${path.sep}source${path.sep}`)) return 0
                if (!filePath.includes(`${path.sep}optimized${path.sep}`)) return 1
                return 2
            }
            return priority(a) - priority(b)
        })[0]
}

function explicitSource(media) {
    const override = sourceOverrides[media.slug]?.[media.kind]
    if (!override) return null
    const fullPath = path.join(workspaceRoot, override)
    if (!fs.existsSync(fullPath)) {
        throw new Error(`Configured source does not exist: ${override}`)
    }
    return fullPath
}

async function ensureSource(media, projectFolder) {
    const configuredSource = explicitSource(media)
    if (configuredSource) return configuredSource

    const id = assetId(media.url)
    const existing = findExistingAsset(projectFolder, id, media.kind)
    if (existing) return existing

    const sourceFolder = path.join(projectFolder, "source")
    fs.mkdirSync(sourceFolder, { recursive: true })
    const extension = extensionFromUrl(
        media.url,
        media.kind === "video" ? ".mp4" : ".jpg"
    )
    const destination = path.join(
        sourceFolder,
        `play-${media.slug}-${media.kind}-${id}-original${extension}`
    )
    return download(media.url, destination)
}

async function download(url, destination) {
    if (fs.existsSync(destination) && fs.statSync(destination).size > 0) {
        return destination
    }
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Could not download ${url}: HTTP ${response.status}`)
    }
    const temporary = `${destination}.download`
    fs.writeFileSync(temporary, Buffer.from(await response.arrayBuffer()))
    fs.renameSync(temporary, destination)
    return destination
}

async function optimizePoster(media, sourcePath, optimizedFolder) {
    const id = assetId(media.url)
    const outputPath = path.join(
        optimizedFolder,
        `play-${media.slug}-poster-${id}-max${POSTER_MAX_DIMENSION}-q${POSTER_QUALITY}.webp`
    )
    if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size === 0) {
        await sharp(sourcePath, { pages: 1 })
            .rotate()
            .resize({
                width: POSTER_MAX_DIMENSION,
                height: POSTER_MAX_DIMENSION,
                fit: "inside",
                withoutEnlargement: true,
            })
            .webp({
                quality: POSTER_QUALITY,
                effort: 6,
                smartSubsample: true,
            })
            .toFile(outputPath)
    }
    const metadata = await sharp(outputPath).metadata()
    const outputBytes = fs.statSync(outputPath).size
    const originalMaxDimension = Math.max(
        media.width || 0,
        media.height || 0
    )
    if (
        media.bytes > 0 &&
        outputBytes >= media.bytes &&
        originalMaxDimension <= POSTER_MAX_DIMENSION
    ) {
        fs.unlinkSync(outputPath)
        return {
            action: "keep-current",
            outputPath: sourcePath,
            outputBytes: media.bytes,
            outputWidth: media.width,
            outputHeight: media.height,
            savingsBytes: 0,
            savingsPercent: 0,
        }
    }
    return {
        action: "optimized",
        outputPath,
        outputBytes,
        outputWidth: metadata.width,
        outputHeight: metadata.height,
        savingsBytes: (media.bytes || 0) - outputBytes,
        savingsPercent:
            media.bytes > 0
                ? ((media.bytes - outputBytes) / media.bytes) * 100
                : null,
    }
}

async function optimizeVideo(media, sourcePath, optimizedFolder) {
    const id = assetId(media.url)
    const outputPath = path.join(
        optimizedFolder,
        `play-${media.slug}-${id}-max${VIDEO_MAX_DIMENSION}-crf${VIDEO_CRF}-noaudio.mp4`
    )
    let needsEncoding =
        !fs.existsSync(outputPath) || fs.statSync(outputPath).size === 0
    if (!needsEncoding) {
        const existing = await probeVideo(outputPath)
        needsEncoding =
            Math.max(existing.width || 0, existing.height || 0) >
                VIDEO_MAX_DIMENSION ||
            existing.codec !== "h264" ||
            existing.pixelFormat !== "yuv420p" ||
            existing.hasAudio
    }
    if (needsEncoding) {
        await run("ffmpeg", [
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-i",
            sourcePath,
            "-map",
            "0:v:0",
            "-vf",
            `scale=${VIDEO_MAX_DIMENSION}:${VIDEO_MAX_DIMENSION}:force_original_aspect_ratio=decrease:force_divisible_by=2:reset_sar=1:in_range=auto:out_range=tv:flags=lanczos,format=yuv420p,setparams=range=limited`,
            "-c:v",
            "libx264",
            "-preset",
            VIDEO_PRESET,
            "-crf",
            String(VIDEO_CRF),
            "-profile:v",
            "high",
            "-level",
            "4.0",
            "-tag:v",
            "avc1",
            "-color_range",
            "tv",
            "-fps_mode",
            "passthrough",
            "-an",
            "-sn",
            "-dn",
            "-movflags",
            "+faststart",
            "-map_metadata",
            "-1",
            "-map_chapters",
            "-1",
            outputPath,
        ])
    }
    const probe = await probeVideo(outputPath)
    const outputBytes = fs.statSync(outputPath).size
    return {
        action: "optimized",
        outputPath,
        outputBytes,
        outputWidth: probe.width,
        outputHeight: probe.height,
        outputCodec: probe.codec,
        outputPixelFormat: probe.pixelFormat,
        outputHasAudio: probe.hasAudio,
        outputDuration: probe.duration,
        savingsBytes: (media.bytes || 0) - outputBytes,
        savingsPercent:
            media.bytes > 0
                ? ((media.bytes - outputBytes) / media.bytes) * 100
                : null,
    }
}

async function optimizeAudit(audit) {
    const itemsByFolder = new Map()
    for (const item of audit.rankedItems) {
        if (!itemsByFolder.has(item.projectFolder)) {
            itemsByFolder.set(item.projectFolder, [])
        }
        itemsByFolder.get(item.projectFolder).push(item)
    }

    let completed = 0
    const totalMedia = audit.allMedia.length
    const results = []

    for (const [folderName, items] of itemsByFolder) {
        const projectFolder = path.join(playRoot, folderName)
        const optimizedFolder = path.join(projectFolder, "optimized")
        fs.mkdirSync(optimizedFolder, { recursive: true })
        const projectResults = []

        for (const item of items.sort((a, b) => a.order - b.order)) {
            for (const media of [item.poster, item.video].filter(Boolean)) {
                const sourcePath = await ensureSource(media, projectFolder)
                const result =
                    media.kind === "poster"
                        ? await optimizePoster(
                              media,
                              sourcePath,
                              optimizedFolder
                          )
                        : await optimizeVideo(
                              media,
                              sourcePath,
                              optimizedFolder
                          )
                completed += 1
                const row = {
                    slug: media.slug,
                    title: media.title,
                    order: media.order,
                    kind: media.kind,
                    sourceUrl: media.url,
                    sourcePath: relative(sourcePath),
                    originalBytes: media.bytes,
                    originalWidth: media.width,
                    originalHeight: media.height,
                    outputPath: relative(result.outputPath),
                    ...Object.fromEntries(
                        Object.entries(result).filter(
                            ([key]) => key !== "outputPath"
                        )
                    ),
                }
                projectResults.push(row)
                results.push(row)
                process.stdout.write(
                    `[${completed}/${totalMedia}] ${media.kind} ${media.slug}: ${formatBytes(media.bytes)} → ${formatBytes(result.outputBytes)} (${result.outputWidth}×${result.outputHeight})\n`
                )
            }
        }

        const manifestPath = path.join(
            projectFolder,
            `play-media-optimization-${auditDate}.json`
        )
        fs.writeFileSync(
            manifestPath,
            `${JSON.stringify(
                {
                    generatedAt: new Date().toISOString(),
                    source: siteUrl,
                    folder: relative(projectFolder),
                    items: projectResults,
                },
                null,
                2
            )}\n`
        )
    }

    return results
}

function writeResultsSummary(results) {
    const originalBytes = results.reduce(
        (sum, row) => sum + (row.originalBytes || 0),
        0
    )
    const outputBytes = results.reduce(
        (sum, row) => sum + (row.outputBytes || 0),
        0
    )
    const oversizedOutputs = results.filter(
        (row) =>
            row.kind === "video" &&
            Math.max(row.outputWidth || 0, row.outputHeight || 0) >
                VIDEO_MAX_DIMENSION
    )
    const summaryPath = path.join(
        playRoot,
        `optimization-results-${auditDate}.json`
    )
    fs.writeFileSync(
        summaryPath,
        `${JSON.stringify(
            {
                generatedAt: new Date().toISOString(),
                source: siteUrl,
                counts: {
                    media: results.length,
                    posters: results.filter((row) => row.kind === "poster")
                        .length,
                    videos: results.filter((row) => row.kind === "video").length,
                    optimized: results.filter(
                        (row) => row.action === "optimized"
                    ).length,
                    keepCurrent: results.filter(
                        (row) => row.action === "keep-current"
                    ).length,
                    oversizedVideoOutputs: oversizedOutputs.length,
                },
                bytes: {
                    original: originalBytes,
                    optimized: outputBytes,
                    saved: originalBytes - outputBytes,
                    savingsPercent:
                        originalBytes > 0
                            ? ((originalBytes - outputBytes) / originalBytes) *
                              100
                            : null,
                },
                results,
            },
            null,
            2
        )}\n`
    )
    const rowsBySlug = new Map()
    for (const row of results) {
        if (!rowsBySlug.has(row.slug)) {
            rowsBySlug.set(row.slug, {
                slug: row.slug,
                title: row.title,
                order: row.order,
            })
        }
        rowsBySlug.get(row.slug)[row.kind] = row
    }
    const markdownLines = [
        `# Play Media Optimization Results — ${auditDate}`,
        "",
        `Generated from the live Framer Play Archive inventory at \`${siteUrl}\`. No CMS fields were changed.`,
        "",
        `- ${results.length} media decisions across ${rowsBySlug.size} CMS items`,
        `- ${results.filter((row) => row.action === "optimized").length} optimized derivatives`,
        `- ${results.filter((row) => row.action === "keep-current").length} current assets retained because a new derivative was not smaller`,
        `- ${formatBytes(originalBytes)} original media → ${formatBytes(outputBytes)} recommended media`,
        `- ${formatBytes(originalBytes - outputBytes)} saved (${(((originalBytes - outputBytes) / originalBytes) * 100).toFixed(1)}%)`,
        `- ${oversizedOutputs.length} video outputs exceed the ${VIDEO_MAX_DIMENSION}px maximum dimension`,
        "",
        "| Order | Item | Poster recommendation | Video recommendation |",
        "|---:|---|---|---|",
    ]
    const cell = (row) => {
        if (!row) return "—"
        const action =
            row.action === "keep-current" ? "Keep current" : "Optimized"
        const savings =
            row.savingsPercent > 0
                ? `; ${row.savingsPercent.toFixed(1)}% smaller`
                : row.savingsPercent < 0
                  ? `; ${Math.abs(row.savingsPercent).toFixed(1)}% larger but lower-resolution`
                  : ""
        return `${action}: \`${row.outputPath}\` (${row.outputWidth}×${row.outputHeight}, ${formatBytes(row.outputBytes)}${savings})`
    }
    for (const item of Array.from(rowsBySlug.values()).sort(
        (a, b) => a.order - b.order
    )) {
        markdownLines.push(
            `| ${item.order} | ${item.title.replace(/\|/g, "\\|")} (\`${item.slug}\`) | ${cell(item.poster)} | ${cell(item.video)} |`
        )
    }
    markdownLines.push("")
    const markdownPath = path.join(
        playRoot,
        `optimization-results-${auditDate}.md`
    )
    fs.writeFileSync(markdownPath, `${markdownLines.join("\n")}\n`)
    process.stdout.write(`Wrote ${relative(summaryPath)}\n`)
    process.stdout.write(`Wrote ${relative(markdownPath)}\n`)
}

async function main() {
    const rows = await getCmsRows()
    const audit = await auditRows(rows)

    process.stdout.write("\nRanked optimization priorities:\n")
    audit.rankedItems.forEach((item, index) => {
        process.stdout.write(
            `${String(index + 1).padStart(2, "0")}. ${item.urgency.padEnd(8)} ${String(item.score).padStart(3)}  ${item.title} (${item.slug}) — ${formatBytes(item.originalBytes)}\n`
        )
    })

    if (shouldWriteReport) writeAuditReport(audit)
    if (!shouldOptimize) return

    process.stdout.write("\nBuilding per-project optimized media.\n")
    const results = await optimizeAudit(audit)
    writeResultsSummary(results)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
