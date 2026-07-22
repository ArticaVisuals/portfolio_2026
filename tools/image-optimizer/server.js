import fs from "node:fs/promises"
import fss from "node:fs"
import os from "node:os"
import path from "node:path"
import crypto from "node:crypto"
import { fileURLToPath } from "node:url"
import express from "express"
import multer from "multer"
import sharp from "sharp"
import archiver from "archiver"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, "../..")
const publicDir = path.join(__dirname, "public")
const tempRoot = path.join(__dirname, ".tmp")
const outputRoot = path.join(__dirname, "output")

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".tif",
  ".tiff",
  ".gif",
])

const PRESETS = {
  "case-study": {
    label: "Case study",
    maxWidth: 1800,
    quality: 82,
    format: "auto",
    effort: 5,
  },
  thumbnail: {
    label: "Thumbnail",
    maxWidth: 1600,
    quality: 82,
    format: "auto",
    effort: 5,
  },
  poster: {
    label: "Poster",
    maxWidth: 1800,
    quality: 80,
    format: "jpeg",
    effort: 4,
  },
  detail: {
    label: "Detail",
    maxWidth: 2400,
    quality: 85,
    format: "auto",
    effort: 5,
  },
}

const sessions = new Map()

const app = express()
const upload = multer({
  dest: path.join(os.tmpdir(), "portfolio-image-optimizer-uploads"),
  limits: {
    fileSize: 250 * 1024 * 1024,
    files: 500,
  },
})

app.use(express.json({ limit: "2mb" }))
app.use(express.static(publicDir))

function sessionId() {
  return crypto.randomBytes(8).toString("hex")
}

function asRelativePath(input, fallback) {
  const value = String(input || fallback || "")
    .replaceAll("\\", "/")
    .replace(/^\/+/, "")
  const normalized = path.posix.normalize(value)
  if (!normalized || normalized === "." || normalized.startsWith("../")) {
    return fallback
  }
  return normalized.replace(/^(\.\.\/)+/, "")
}

function safeJoin(root, child) {
  const resolved = path.resolve(root, child || ".")
  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    throw new Error("Path must stay inside the portfolio workspace.")
  }
  return resolved
}

function bytesLabel(bytes) {
  if (!Number.isFinite(bytes)) return ""
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function sha1File(filePath) {
  const hash = crypto.createHash("sha1")
  const stream = fss.createReadStream(filePath)

  await new Promise((resolve, reject) => {
    stream.on("data", (chunk) => hash.update(chunk))
    stream.on("error", reject)
    stream.on("end", resolve)
  })

  return hash.digest("hex")
}

function inferProject(relativePath) {
  const parts = relativePath.split("/")
  const currentSiteIndex = parts.indexOf("current-site")
  const stagingIndex = parts.indexOf("framer-staging")
  if (currentSiteIndex >= 0 && parts[currentSiteIndex + 1]) return parts[currentSiteIndex + 1]
  if (stagingIndex >= 0 && parts[stagingIndex + 1]) return parts[stagingIndex + 1]
  return parts.length > 1 ? parts[0] : "loose-assets"
}

function inferUse(relativePath, metadata) {
  const lower = relativePath.toLowerCase()
  if (lower.includes("thumbnail") || lower.match(/(^|[-_/])thumb([-_.]|$)/)) return "thumbnail"
  if (lower.includes("poster") || lower.includes("video-posters")) return "poster"
  if (lower.includes("hero") || lower.includes("cover")) return "hero"
  if (metadata.width && metadata.width >= 2800) return "large-media"
  return "case-study"
}

function recommendedPreset(relativePath, metadata) {
  const use = inferUse(relativePath, metadata)
  if (use === "thumbnail") return "thumbnail"
  if (use === "poster") return "poster"
  if (use === "hero" || use === "large-media") return "detail"
  return "case-study"
}

function formatFromMetadata(metadata, fallbackPath) {
  if (metadata.format) return metadata.format
  const ext = path.extname(fallbackPath).slice(1).toLowerCase()
  return ext === "jpg" ? "jpeg" : ext
}

async function inspectImage(sourcePath, relativePath, itemId) {
  const stat = await fs.stat(sourcePath)
  const sha1 = await sha1File(sourcePath)
  const metadata = await sharp(sourcePath, {
    animated: true,
    limitInputPixels: false,
  }).metadata()
  const format = formatFromMetadata(metadata, relativePath)
  const animated = Number(metadata.pages || 1) > 1
  const warnings = []

  if (animated && format === "gif") {
    warnings.push("Animated GIF: keep as review-only unless you intentionally want animated WebP output.")
  }

  if (metadata.width && metadata.width > 3200) {
    warnings.push("Very wide source; good candidate for a detail preset cap.")
  }

  if (format === "png" && !metadata.hasAlpha && stat.size > 1024 * 1024) {
    warnings.push("Large opaque PNG; likely strong WebP/JPEG savings.")
  }

  return {
    id: itemId,
    sourcePath,
    relativePath,
    fileName: path.basename(relativePath),
    project: inferProject(relativePath),
    suggestedUse: inferUse(relativePath, metadata),
    recommendedPreset: recommendedPreset(relativePath, metadata),
    format,
    width: metadata.width || null,
    height: metadata.height || null,
    pages: metadata.pages || 1,
    animated,
    hasAlpha: Boolean(metadata.hasAlpha),
    aspectRatio:
      metadata.width && metadata.height ? Number((metadata.width / metadata.height).toFixed(4)) : null,
    sha1,
    duplicateGroupId: null,
    originalBytes: stat.size,
    originalLabel: bytesLabel(stat.size),
    warnings,
    skipped: false,
  }
}

function assignDuplicateGroups(items) {
  const groups = new Map()
  for (const item of items) {
    if (!item.sha1) continue
    if (!groups.has(item.sha1)) groups.set(item.sha1, [])
    groups.get(item.sha1).push(item)
  }

  let duplicateIndex = 1
  for (const group of groups.values()) {
    if (group.length < 2) continue
    const duplicateGroupId = `dup-${String(duplicateIndex).padStart(3, "0")}`
    duplicateIndex += 1
    for (const item of group) {
      item.duplicateGroupId = duplicateGroupId
      item.warnings = item.warnings || []
      item.warnings.push(`Duplicate bytes: ${duplicateGroupId}`)
    }
  }

  return items
}

async function walkImages(root, limit = 500) {
  const results = []

  async function walk(dir) {
    if (results.length >= limit) return
    const entries = await fs.readdir(dir, { withFileTypes: true })
    entries.sort((a, b) => a.name.localeCompare(b.name))

    for (const entry of entries) {
      if (results.length >= limit) return
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".git" || entry.name === ".tmp") continue
        await walk(fullPath)
        continue
      }
      if (!entry.isFile()) continue
      if (!IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) continue
      results.push(fullPath)
    }
  }

  await walk(root)
  return results
}

function createSession(mode, items, extra = {}) {
  const id = sessionId()
  const session = {
    id,
    mode,
    createdAt: new Date().toISOString(),
    items,
    optimizedItems: [],
    outputDir: null,
    outputZip: null,
    ...extra,
  }
  sessions.set(id, session)
  return session
}

async function loadItemSource(session, item) {
  if (session.mode === "upload") {
    return item.sourcePath
  }
  return item.sourcePath
}

function normalizeSettings(input = {}) {
  const presetName = PRESETS[input.preset] ? input.preset : "case-study"
  const preset = PRESETS[presetName]
  const maxWidth = Math.max(320, Math.min(6000, Number(input.maxWidth || preset.maxWidth)))
  const quality = Math.max(45, Math.min(95, Number(input.quality || preset.quality)))
  const format = ["auto", "jpeg", "png", "webp", "avif"].includes(input.format)
    ? input.format
    : preset.format
  const effort = Math.max(1, Math.min(9, Number(input.effort || preset.effort)))

  return {
    preset: presetName,
    maxWidth,
    quality,
    format,
    effort,
    stripMetadata: input.stripMetadata !== false,
    preventLarger: input.preventLarger !== false,
    includeAnimatedGif: Boolean(input.includeAnimatedGif),
  }
}

function chooseOutputFormat(item, settings) {
  if (settings.format !== "auto") return settings.format
  if (item.hasAlpha) return "png"
  return "jpeg"
}

function outputExtension(format) {
  if (format === "jpeg") return ".jpg"
  return `.${format}`
}

async function optimizeOne(session, item, settings, outputDir) {
  const sourcePath = await loadItemSource(session, item)
  const sourceBuffer = await fs.readFile(sourcePath)
  const sourceMetadata = await sharp(sourceBuffer, {
    animated: true,
    limitInputPixels: false,
  }).metadata()
  const animated = Number(sourceMetadata.pages || 1) > 1

  if (animated && item.format === "gif" && !settings.includeAnimatedGif) {
    return {
      ...item,
      skipped: true,
      skipReason: "Animated GIF left untouched.",
      outputBytes: item.originalBytes,
      outputLabel: item.originalLabel,
      savingsBytes: 0,
      savingsPercent: 0,
      outputRelativePath: null,
    }
  }

  const selectedFormat = chooseOutputFormat(item, settings)
  const sourceWidth = sourceMetadata.width || item.width || 0
  const shouldResize = sourceWidth > settings.maxWidth
  const targetWidth = shouldResize ? settings.maxWidth : sourceWidth
  const parsed = path.parse(item.relativePath)
  const suffixPreset = settings.preset === "case-study" ? "case" : settings.preset
  const suffix = `__${suffixPreset}-${targetWidth || settings.maxWidth}w`
  const outputRelativePath = path
    .join(parsed.dir, `${parsed.name}${suffix}${outputExtension(selectedFormat)}`)
    .replaceAll("\\", "/")
  const outputPath = safeJoin(outputDir, outputRelativePath)
  await fs.mkdir(path.dirname(outputPath), { recursive: true })

  let pipeline = sharp(sourceBuffer, {
    animated,
    limitInputPixels: false,
  }).rotate()

  if (shouldResize) {
    pipeline = pipeline.resize({
      width: settings.maxWidth,
      withoutEnlargement: true,
    })
  }

  if (!settings.stripMetadata) {
    pipeline = pipeline.keepMetadata()
  }

  if (selectedFormat === "jpeg") {
    pipeline = pipeline.jpeg({
      quality: settings.quality,
      mozjpeg: true,
      progressive: true,
    })
  } else if (selectedFormat === "png") {
    pipeline = pipeline.png({
      compressionLevel: 9,
      palette: !item.hasAlpha,
      effort: Math.min(settings.effort, 10),
    })
  } else if (selectedFormat === "avif") {
    pipeline = pipeline.avif({
      quality: settings.quality,
      effort: settings.effort,
    })
  } else {
    pipeline = pipeline.webp({
      quality: settings.quality,
      effort: settings.effort,
      smartSubsample: true,
    })
  }

  let outputBuffer = await pipeline.toBuffer()
  let keptOriginal = false
  let finalOutputRelativePath = outputRelativePath
  let finalOutputPath = outputPath

  if (settings.preventLarger && outputBuffer.length > item.originalBytes) {
    keptOriginal = true
    finalOutputRelativePath = item.relativePath
    finalOutputPath = safeJoin(outputDir, finalOutputRelativePath)
    await fs.mkdir(path.dirname(finalOutputPath), { recursive: true })
    outputBuffer = sourceBuffer
  }

  await fs.writeFile(finalOutputPath, outputBuffer)
  const outputMetadata = await sharp(outputBuffer, {
    animated,
    limitInputPixels: false,
  }).metadata()
  const savingsBytes = item.originalBytes - outputBuffer.length
  const savingsPercent = item.originalBytes > 0 ? (savingsBytes / item.originalBytes) * 100 : 0

  return {
    ...item,
    skipped: false,
    keptOriginal,
    outputFormat: keptOriginal ? item.format : selectedFormat,
    outputRelativePath: finalOutputRelativePath,
    outputPath: finalOutputPath,
    outputBytes: outputBuffer.length,
    outputLabel: bytesLabel(outputBuffer.length),
    outputWidth: outputMetadata.width || targetWidth || item.width,
    outputHeight: outputMetadata.height || item.height,
    savingsBytes,
    savingsLabel: bytesLabel(Math.abs(savingsBytes)),
    savingsPercent,
    settings,
  }
}

async function writeManifest(session, optimizedItems, outputDir, settings) {
  const totals = optimizedItems.reduce(
    (acc, item) => {
      acc.originalBytes += item.originalBytes || 0
      acc.outputBytes += item.outputBytes || item.originalBytes || 0
      if (item.skipped) acc.skipped += 1
      return acc
    },
    { originalBytes: 0, outputBytes: 0, skipped: 0 },
  )

  const manifest = {
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    sessionId: session.id,
    sourceMode: session.mode,
    settings,
    totals: {
      ...totals,
      originalLabel: bytesLabel(totals.originalBytes),
      outputLabel: bytesLabel(totals.outputBytes),
      savingsBytes: totals.originalBytes - totals.outputBytes,
      savingsLabel: bytesLabel(Math.max(0, totals.originalBytes - totals.outputBytes)),
      savingsPercent:
        totals.originalBytes > 0
          ? ((totals.originalBytes - totals.outputBytes) / totals.originalBytes) * 100
          : 0,
    },
    items: optimizedItems.map((item) => ({
      sourcePath: item.relativePath,
      outputPath: item.outputRelativePath,
      kind: "image",
      project: item.project,
      slug: item.project,
      suggestedUse: item.suggestedUse,
      role: item.suggestedUse,
      preset: item.settings?.preset || settings.preset,
      originalFormat: item.format,
      outputFormat: item.outputFormat,
      width: item.width,
      height: item.height,
      aspectRatio: item.aspectRatio,
      sha1: item.sha1,
      duplicateGroupId: item.duplicateGroupId,
      hasAlpha: item.hasAlpha,
      pages: item.pages,
      outputWidth: item.outputWidth,
      outputHeight: item.outputHeight,
      originalBytes: item.originalBytes,
      outputBytes: item.outputBytes,
      savingsPercent: Number((item.savingsPercent || 0).toFixed(2)),
      quality: item.settings?.quality || settings.quality,
      maxLongEdge: item.settings?.maxWidth || settings.maxWidth,
      needsRehost: Boolean(item.outputRelativePath),
      framerFieldTargets: {
        thumbnail: "Jy7hBJady",
        thumbnailVideo: "SvOqFqdby",
        image1: "QF3AEVk8r",
        video1: "xOL69akmU",
        videoPoster1: "FwLb0MrAN",
      },
      skipped: item.skipped,
      skipReason: item.skipReason,
      keptOriginal: item.keptOriginal,
      slidesDataLine: item.outputRelativePath
        ? `${item.outputRelativePath}|${path.parse(item.fileName).name.replace(/[-_]+/g, " ")}`
        : "",
      framerManifestLine: item.outputRelativePath
        ? `${item.outputRelativePath}|${path.parse(item.fileName).name.replace(/[-_]+/g, " ")}`
        : "",
    })),
  }

  const jsonPath = path.join(outputDir, "manifest.json")
  const tsvPath = path.join(outputDir, "manifest.tsv")

  const tsvRows = [
    [
      "sourcePath",
      "outputPath",
      "project",
      "suggestedUse",
      "originalFormat",
      "outputFormat",
      "dimensions",
      "outputDimensions",
      "originalBytes",
      "outputBytes",
      "savingsPercent",
      "sha1",
      "duplicateGroupId",
      "hasAlpha",
      "framerManifestLine",
    ].join("\t"),
    ...manifest.items.map((item) =>
      [
        item.sourcePath,
        item.outputPath || "",
        item.project,
        item.suggestedUse,
        item.originalFormat,
        item.outputFormat || "",
        `${item.width || ""}x${item.height || ""}`,
        `${item.outputWidth || ""}x${item.outputHeight || ""}`,
        item.originalBytes,
        item.outputBytes || "",
        item.savingsPercent,
        item.sha1 || "",
        item.duplicateGroupId || "",
        item.hasAlpha ? "yes" : "no",
        item.framerManifestLine,
      ].join("\t"),
    ),
  ].join("\n")

  await fs.writeFile(jsonPath, JSON.stringify(manifest, null, 2))
  await fs.writeFile(tsvPath, `${tsvRows}\n`)

  return manifest
}

async function zipOutput(outputDir, zipPath) {
  await fs.mkdir(path.dirname(zipPath), { recursive: true })

  return new Promise((resolve, reject) => {
    const output = fss.createWriteStream(zipPath)
    const archive = archiver("zip", { zlib: { level: 9 } })

    output.on("close", resolve)
    archive.on("error", reject)
    archive.pipe(output)
    archive.directory(outputDir, false)
    archive.finalize()
  })
}

app.get("/api/presets", (_req, res) => {
  res.json({ presets: PRESETS, workspaceRoot })
})

app.post("/api/scan", async (req, res) => {
  try {
    const sourceDirInput = String(req.body.sourceDir || "assets/by-project")
    const sourceDir = safeJoin(workspaceRoot, sourceDirInput)
    const limit = Math.max(1, Math.min(1000, Number(req.body.limit || 500)))
    const files = await walkImages(sourceDir, limit)
    const items = []

    for (const file of files) {
      try {
        const relativePath = path.relative(workspaceRoot, file).replaceAll("\\", "/")
        items.push(await inspectImage(file, relativePath, crypto.randomUUID()))
      } catch (error) {
        items.push({
          id: crypto.randomUUID(),
          sourcePath: file,
          relativePath: path.relative(workspaceRoot, file).replaceAll("\\", "/"),
          fileName: path.basename(file),
          skipped: true,
          warnings: [error.message],
        })
      }
    }

    assignDuplicateGroups(items)

    const session = createSession("workspace", items, {
      sourceDir: path.relative(workspaceRoot, sourceDir).replaceAll("\\", "/"),
    })

    res.json({
      sessionId: session.id,
      mode: session.mode,
      sourceDir: session.sourceDir,
      items,
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post("/api/upload", upload.array("images"), async (req, res) => {
  try {
    const paths = Array.isArray(req.body.paths)
      ? req.body.paths
      : req.body.paths
        ? [req.body.paths]
        : []
    const uploadSessionId = sessionId()
    const sessionDir = path.join(tempRoot, uploadSessionId)
    await fs.mkdir(sessionDir, { recursive: true })

    const items = []

    for (let index = 0; index < req.files.length; index += 1) {
      const file = req.files[index]
      const ext = path.extname(file.originalname).toLowerCase()
      if (!IMAGE_EXTENSIONS.has(ext)) {
        await fs.rm(file.path, { force: true })
        continue
      }

      const relativePath = asRelativePath(paths[index] || file.originalname, file.originalname)
      const targetPath = safeJoin(sessionDir, relativePath)
      await fs.mkdir(path.dirname(targetPath), { recursive: true })
      await fs.rename(file.path, targetPath)
      items.push(await inspectImage(targetPath, relativePath, crypto.randomUUID()))
    }

    assignDuplicateGroups(items)

    const session = createSession("upload", items, { uploadSessionId, sessionDir })
    res.json({
      sessionId: session.id,
      mode: session.mode,
      items,
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post("/api/optimize/:sessionId", async (req, res) => {
  try {
    const session = sessions.get(req.params.sessionId)
    if (!session) {
      res.status(404).json({ error: "Session not found." })
      return
    }

    const settings = normalizeSettings(req.body)
    const selectedIds = new Set(Array.isArray(req.body.selectedIds) ? req.body.selectedIds : [])
    const outputDir = path.join(outputRoot, session.id, "optimized")
    await fs.rm(path.join(outputRoot, session.id), { recursive: true, force: true })
    await fs.mkdir(outputDir, { recursive: true })

    const sourceItems = selectedIds.size
      ? session.items.filter((item) => selectedIds.has(item.id))
      : session.items

    const optimizedItems = []
    for (const item of sourceItems) {
      if (item.skipped && !item.sourcePath) continue
      try {
        optimizedItems.push(await optimizeOne(session, item, settings, outputDir))
      } catch (error) {
        optimizedItems.push({
          ...item,
          skipped: true,
          skipReason: error.message,
          outputBytes: item.originalBytes,
          outputLabel: item.originalLabel,
          savingsBytes: 0,
          savingsPercent: 0,
        })
      }
    }

    const manifest = await writeManifest(session, optimizedItems, outputDir, settings)
    const zipPath = path.join(outputRoot, session.id, "portfolio-optimized-images.zip")
    await zipOutput(outputDir, zipPath)

    session.optimizedItems = optimizedItems
    session.outputDir = outputDir
    session.outputZip = zipPath
    session.manifest = manifest

    res.json({
      sessionId: session.id,
      outputDir: path.relative(workspaceRoot, outputDir).replaceAll("\\", "/"),
      downloadUrl: `/api/download/${session.id}`,
      manifestUrl: `/api/manifest/${session.id}`,
      items: optimizedItems,
      totals: manifest.totals,
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get("/api/source/:sessionId/:itemId", async (req, res) => {
  const session = sessions.get(req.params.sessionId)
  if (!session) {
    res.status(404).send("Session not found.")
    return
  }

  const item = session.items.find((entry) => entry.id === req.params.itemId)
  if (!item) {
    res.status(404).send("Item not found.")
    return
  }

  res.sendFile(item.sourcePath)
})

app.get("/api/output/:sessionId/:itemId", async (req, res) => {
  const session = sessions.get(req.params.sessionId)
  if (!session) {
    res.status(404).send("Session not found.")
    return
  }

  const item = session.optimizedItems.find((entry) => entry.id === req.params.itemId)
  if (!item?.outputPath) {
    res.status(404).send("Output not found.")
    return
  }

  res.sendFile(item.outputPath)
})

app.get("/api/download/:sessionId", (req, res) => {
  const session = sessions.get(req.params.sessionId)
  if (!session?.outputZip) {
    res.status(404).send("ZIP not found.")
    return
  }

  res.download(session.outputZip, "portfolio-optimized-images.zip")
})

app.get("/api/manifest/:sessionId", (req, res) => {
  const session = sessions.get(req.params.sessionId)
  if (!session?.manifest) {
    res.status(404).json({ error: "Manifest not found." })
    return
  }

  res.json(session.manifest)
})

app.get("/api/health", (_req, res) => {
  res.json({ ok: true })
})

const port = Number(process.env.PORT || 4177)

await fs.mkdir(tempRoot, { recursive: true })
await fs.mkdir(outputRoot, { recursive: true })

app.listen(port, () => {
  console.log(`Portfolio image optimizer running at http://localhost:${port}`)
  console.log(`Workspace: ${workspaceRoot}`)
})
