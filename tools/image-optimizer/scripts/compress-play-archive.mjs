import { spawnSync } from "node:child_process"
import fs from "node:fs/promises"
import fssync from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, "../../..")
const manifestPath = path.join(repoRoot, "case-study-assets/current-site/archive/manifest.json")
const outputRoot = path.join(repoRoot, "case-study-assets/optimized/play-archive-under-1mb-2026-06-12")
const mediaOutputDir = path.join(outputRoot, "media")
const reportPath = path.join(outputRoot, "manifest.json")
const targetBytes = 950_000

const ffmpeg = process.env.FFMPEG || "ffmpeg"
const ffprobe = process.env.FFPROBE || "ffprobe"

function repoPath(absolutePath) {
    return path.relative(repoRoot, absolutePath).split(path.sep).join("/")
}

function assertOk(result, label) {
    if (result.status !== 0) {
        const stderr = result.stderr?.toString() || ""
        const stdout = result.stdout?.toString() || ""
        throw new Error(`${label} failed\n${stderr || stdout}`)
    }
}

function run(command, args, label) {
    const result = spawnSync(command, args, { encoding: "utf8" })
    assertOk(result, label)
    return result.stdout
}

async function fileSize(filePath) {
    return (await fs.stat(filePath)).size
}

function slugStem(sourcePath) {
    return path.basename(sourcePath).replace(/\.[^.]+$/, "")
}

async function copyUnderTarget(sourcePath, destinationPath) {
    await fs.mkdir(path.dirname(destinationPath), { recursive: true })
    await fs.copyFile(sourcePath, destinationPath)
    return destinationPath
}

function uniqueDescending(values) {
    return [...new Set(values.filter(Boolean).map((value) => Math.round(value)))].sort((a, b) => b - a)
}

function even(value) {
    const rounded = Math.max(2, Math.round(value))
    return rounded % 2 === 0 ? rounded : rounded - 1
}

async function optimizeStill(sourcePath, label) {
    const originalBytes = await fileSize(sourcePath)
    const sourceExt = path.extname(sourcePath).toLowerCase()
    const sourceName = slugStem(sourcePath)

    if (originalBytes <= targetBytes) {
        const destinationPath = path.join(mediaOutputDir, `${label}-${sourceName}${sourceExt}`)
        await copyUnderTarget(sourcePath, destinationPath)
        return {
            kind: "still",
            action: "kept-under-target",
            sourcePath: repoPath(sourcePath),
            outputPath: repoPath(destinationPath),
            outputFile: path.basename(destinationPath),
            originalBytes,
            outputBytes: originalBytes,
            format: sourceExt.replace(".", ""),
        }
    }

    const metadata = await sharp(sourcePath, { animated: false }).metadata()
    const hasAlpha = Boolean(metadata.hasAlpha)
    const sourceWidth = metadata.width || 1600
    const candidateWidths = uniqueDescending([
        Math.min(sourceWidth, 2400),
        Math.min(sourceWidth, 2200),
        Math.min(sourceWidth, 2000),
        Math.min(sourceWidth, 1800),
        Math.min(sourceWidth, 1600),
        Math.min(sourceWidth, 1400),
        Math.min(sourceWidth, 1200),
        Math.min(sourceWidth, 1000),
        Math.min(sourceWidth, 900),
        Math.min(sourceWidth, 800),
        Math.min(sourceWidth, 700),
        Math.min(sourceWidth, 600),
        Math.min(sourceWidth, 520),
        Math.min(sourceWidth, 460),
    ])
    const qualities = hasAlpha ? [82, 76, 70, 64, 58, 52, 46] : [84, 78, 72, 66, 60, 54, 48]
    const format = hasAlpha ? "webp" : "jpg"
    const destinationPath = path.join(mediaOutputDir, `${label}-${sourceName}.${format}`)

    let best = null

    for (const width of candidateWidths) {
        for (const quality of qualities) {
            let pipeline = sharp(sourcePath, { animated: false })
                .rotate()
                .resize({ width, withoutEnlargement: true, fit: "inside" })

            if (hasAlpha) {
                pipeline = pipeline.webp({ quality, effort: 6 })
            } else {
                pipeline = pipeline.jpeg({ quality, progressive: true, mozjpeg: true })
            }

            const buffer = await pipeline.toBuffer()
            const size = buffer.byteLength
            const score = width * (quality / 100)
            const candidate = { buffer, size, width, quality, score }

            if (size <= targetBytes && (!best || candidate.score > best.score)) {
                best = candidate
            }
        }
    }

    if (!best) {
        throw new Error(`No still-image candidate under ${targetBytes} bytes for ${sourcePath}`)
    }

    await fs.mkdir(path.dirname(destinationPath), { recursive: true })
    await fs.writeFile(destinationPath, best.buffer)

    return {
        kind: "still",
        action: "optimized",
        sourcePath: repoPath(sourcePath),
        outputPath: repoPath(destinationPath),
        outputFile: path.basename(destinationPath),
        originalBytes,
        outputBytes: best.size,
        format,
        width: best.width,
        quality: best.quality,
    }
}

function probeVideo(sourcePath) {
    const stdout = run(
        ffprobe,
        [
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height,r_frame_rate,avg_frame_rate,duration",
            "-show_entries",
            "format=duration,size,bit_rate",
            "-of",
            "json",
            sourcePath,
        ],
        `ffprobe ${sourcePath}`
    )
    const data = JSON.parse(stdout)
    const stream = data.streams?.[0] || {}
    const duration = Number(stream.duration || data.format?.duration || 1)
    return {
        width: Number(stream.width || 1280),
        height: Number(stream.height || 720),
        duration: Number.isFinite(duration) && duration > 0 ? duration : 1,
    }
}

function encodeVideo(sourcePath, destinationPath, options) {
    const passlog = path.join(os.tmpdir(), `play-archive-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`)
    const vf = `scale=${options.width}:${options.height}:flags=lanczos,fps=${options.fps}`
    const bitrate = `${options.bitrateKbps}k`
    const common = [
        "-y",
        "-i",
        sourcePath,
        "-an",
        "-vf",
        vf,
        "-c:v",
        "libx264",
        "-b:v",
        bitrate,
        "-maxrate",
        `${Math.round(options.bitrateKbps * 1.25)}k`,
        "-bufsize",
        `${Math.round(options.bitrateKbps * 2)}k`,
        "-pix_fmt",
        "yuv420p",
        "-preset",
        "medium",
        "-passlogfile",
        passlog,
    ]

    assertOk(
        spawnSync(ffmpeg, [...common, "-pass", "1", "-f", "mp4", os.platform() === "win32" ? "NUL" : "/dev/null"], {
            encoding: "utf8",
        }),
        `ffmpeg pass 1 ${sourcePath}`
    )
    assertOk(
        spawnSync(ffmpeg, [...common, "-pass", "2", "-movflags", "+faststart", destinationPath], { encoding: "utf8" }),
        `ffmpeg pass 2 ${sourcePath}`
    )

    for (const suffix of ["-0.log", "-0.log.mbtree"]) {
        try {
            fssync.unlinkSync(`${passlog}${suffix}`)
        } catch {}
    }
}

async function optimizeVideo(sourcePath, label) {
    const originalBytes = await fileSize(sourcePath)
    const sourceName = slugStem(sourcePath)
    const destinationPath = path.join(mediaOutputDir, `${label}-${sourceName}.mp4`)
    const probe = probeVideo(sourcePath)
    const maxWidths = uniqueDescending([
        Math.min(probe.width, 1280),
        Math.min(probe.width, 1080),
        Math.min(probe.width, 960),
        Math.min(probe.width, 854),
        Math.min(probe.width, 720),
        Math.min(probe.width, 640),
        Math.min(probe.width, 540),
        Math.min(probe.width, 480),
        Math.min(probe.width, 420),
        Math.min(probe.width, 360),
    ])
    const fpsCandidates = [24, 20, 18, 15, 12]
    const targetPayloadBytes = 880_000
    const baseKbps = Math.max(96, Math.floor(((targetPayloadBytes * 8) / probe.duration / 1000) * 0.9))
    const bitrateCandidates = uniqueDescending([
        Math.min(baseKbps, 2200),
        Math.min(baseKbps, 1800),
        Math.min(baseKbps, 1400),
        Math.min(baseKbps, 1000),
        Math.min(baseKbps, 800),
        Math.min(baseKbps, 600),
        Math.min(baseKbps, 420),
        Math.min(baseKbps, 300),
        Math.min(baseKbps, 220),
        Math.min(baseKbps, 160),
        120,
        96,
    ])

    let best = null

    for (const width of maxWidths) {
        const height = even((probe.height / probe.width) * width)
        for (const fps of fpsCandidates) {
            for (const bitrateKbps of bitrateCandidates) {
                await fs.mkdir(path.dirname(destinationPath), { recursive: true })
                encodeVideo(sourcePath, destinationPath, { width: even(width), height, fps, bitrateKbps })
                const size = await fileSize(destinationPath)
                const score = width * fps * Math.min(bitrateKbps, 1200)
                const candidate = { size, width: even(width), height, fps, bitrateKbps, score }
                if (size <= targetBytes && (!best || candidate.score > best.score)) {
                    best = candidate
                }
                if (size <= targetBytes && bitrateKbps === bitrateCandidates[0]) break
            }
            if (best?.width === even(width) && best?.fps === fps) break
        }
        if (best?.width === even(width)) break
    }

    if (!best) {
        throw new Error(`No video candidate under ${targetBytes} bytes for ${sourcePath}`)
    }

    encodeVideo(sourcePath, destinationPath, best)
    const outputBytes = await fileSize(destinationPath)

    return {
        kind: "video",
        action: originalBytes <= targetBytes ? "re-encoded-for-consistency" : "optimized",
        sourcePath: repoPath(sourcePath),
        outputPath: repoPath(destinationPath),
        outputFile: path.basename(destinationPath),
        originalBytes,
        outputBytes,
        width: best.width,
        height: best.height,
        fps: best.fps,
        bitrateKbps: best.bitrateKbps,
        duration: probe.duration,
    }
}

function encodeGif(sourcePath, destinationPath, options) {
    const vf = `fps=${options.fps},scale=${options.width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=${options.colors}:reserve_transparent=1[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5`
    assertOk(
        spawnSync(ffmpeg, ["-y", "-i", sourcePath, "-filter_complex", vf, "-loop", "0", destinationPath], {
            encoding: "utf8",
        }),
        `ffmpeg gif ${sourcePath}`
    )
}

async function optimizeGif(sourcePath, label) {
    const originalBytes = await fileSize(sourcePath)
    const sourceName = slugStem(sourcePath)
    const destinationPath = path.join(mediaOutputDir, `${label}-${sourceName}.gif`)
    const metadata = await sharp(sourcePath, { animated: true }).metadata()
    const sourceWidth = metadata.width || 600
    const widths = uniqueDescending([
        Math.min(sourceWidth, 720),
        Math.min(sourceWidth, 600),
        Math.min(sourceWidth, 520),
        Math.min(sourceWidth, 480),
        Math.min(sourceWidth, 420),
        Math.min(sourceWidth, 360),
        Math.min(sourceWidth, 320),
        Math.min(sourceWidth, 280),
    ])
    const fpsCandidates = [12, 10, 8, 6]
    const colorCandidates = [128, 96, 64, 48]
    let best = null

    for (const width of widths) {
        for (const fps of fpsCandidates) {
            for (const colors of colorCandidates) {
                await fs.mkdir(path.dirname(destinationPath), { recursive: true })
                encodeGif(sourcePath, destinationPath, { width, fps, colors })
                const size = await fileSize(destinationPath)
                const score = width * fps * colors
                const candidate = { size, width, fps, colors, score }
                if (size <= targetBytes && (!best || candidate.score > best.score)) {
                    best = candidate
                }
                if (best?.width === width && best?.fps === fps) break
            }
            if (best?.width === width) break
        }
        if (best?.width === width) break
    }

    if (!best) {
        throw new Error(`No GIF candidate under ${targetBytes} bytes for ${sourcePath}`)
    }

    encodeGif(sourcePath, destinationPath, best)
    const outputBytes = await fileSize(destinationPath)

    return {
        kind: "gif",
        action: "optimized",
        sourcePath: repoPath(sourcePath),
        outputPath: repoPath(destinationPath),
        outputFile: path.basename(destinationPath),
        originalBytes,
        outputBytes,
        width: best.width,
        fps: best.fps,
        colors: best.colors,
    }
}

async function optimizePrimary(item) {
    const label = String(item.order).padStart(3, "0")
    const sourcePath = path.join(repoRoot, item.localPath)
    if (item.kind === "video") return optimizeVideo(sourcePath, label)
    if (item.kind === "gif") return optimizeGif(sourcePath, label)
    return optimizeStill(sourcePath, label)
}

async function main() {
    const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"))
    await fs.rm(outputRoot, { recursive: true, force: true })
    await fs.mkdir(mediaOutputDir, { recursive: true })

    const items = []

    for (const item of manifest.items) {
        const order = String(item.order).padStart(3, "0")
        console.log(`Optimizing ${order} ${item.kind} ${item.name}`)
        const primary = await optimizePrimary(item)
        const poster = item.poster
            ? await optimizeStill(path.join(repoRoot, item.poster.localPath), `${order}-poster`)
            : null

        items.push({
            order: item.order,
            title: item.name.replace(/\.[^.]+$/, ""),
            kind: item.kind,
            width: item.width,
            height: item.height,
            originalUrl: item.originalUrl,
            posterOriginalUrl: item.poster?.originalUrl || "",
            primary,
            poster,
        })
    }

    const report = {
        generatedAt: new Date().toISOString(),
        sourceManifest: repoPath(manifestPath),
        outputDir: repoPath(outputRoot),
        targetBytes,
        itemCount: items.length,
        items,
        failures: items
            .flatMap((item) => [item.primary, item.poster].filter(Boolean))
            .filter((asset) => asset.outputBytes > targetBytes),
    }

    await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`)
    console.log(`Wrote ${repoPath(reportPath)}`)
    if (report.failures.length) {
        console.error("Some outputs are above target:")
        console.error(JSON.stringify(report.failures, null, 2))
        process.exitCode = 1
    }
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
