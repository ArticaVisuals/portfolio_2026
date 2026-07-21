import { spawnSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, "..")
const currentDir = path.join(
  workspaceRoot,
  "case-study-assets/current-site/motion-connect-2025"
)
const stagingDir = path.join(
  workspaceRoot,
  "case-study-assets/framer-staging/motion-connect-2025"
)
const outputDir = path.join(
  workspaceRoot,
  "case-study-assets/optimized/motion-connect-2025"
)
const posterDir = path.join(outputDir, "posters")
const imageDir = path.join(outputDir, "images")

const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".m4v"])
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"])
const GIF_EXTENSIONS = new Set([".gif"])
const MEDIA_EXTENSIONS = new Set([
  ...VIDEO_EXTENSIONS,
  ...IMAGE_EXTENSIONS,
  ...GIF_EXTENSIONS,
])

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: workspaceRoot,
    encoding: "utf8",
    stdio: options.stdio || "pipe",
  })
  if (result.status !== 0) {
    const detail = [result.stderr, result.stdout].filter(Boolean).join("\n")
    throw new Error(`${command} failed: ${detail}`)
  }
  return result.stdout || ""
}

function tryRun(command, args) {
  const result = spawnSync(command, args, {
    cwd: workspaceRoot,
    encoding: "utf8",
    stdio: "pipe",
  })
  return {
    ok: result.status === 0,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
  }
}

function rel(filePath) {
  return path.relative(workspaceRoot, filePath).split(path.sep).join("/")
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

function readManifest(folder) {
  const filePath = path.join(folder, "manifest.json")
  return fs.existsSync(filePath) ? readJson(filePath) : null
}

function keyForFile(filePath) {
  return rel(filePath).toLowerCase()
}

function buildMetadataMap(folder) {
  const manifest = readManifest(folder)
  const map = new Map()
  if (!manifest) return map
  for (const item of manifest.downloaded || []) {
    if (!item.file) continue
    const fullPath = path.join(workspaceRoot, "case-study-assets", item.file)
    map.set(keyForFile(fullPath), item)
  }
  return map
}

function listMediaFiles(folder) {
  return fs
    .readdirSync(folder, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(folder, entry.name))
    .filter((filePath) => MEDIA_EXTENSIONS.has(path.extname(filePath).toLowerCase()))
    .sort((a, b) => rel(a).localeCompare(rel(b)))
}

function safeBaseName(filePath) {
  return path
    .basename(filePath, path.extname(filePath))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function prefixForFolder(filePath) {
  if (filePath.startsWith(currentDir)) return "current"
  if (filePath.startsWith(stagingDir)) return "staging"
  return "media"
}

function uniqueOutputPath(folder, filePath, suffix, extension) {
  const prefix = prefixForFolder(filePath)
  const candidate = path.join(folder, `${prefix}-${safeBaseName(filePath)}${suffix}${extension}`)
  if (!fs.existsSync(candidate)) return candidate
  let index = 2
  while (true) {
    const next = path.join(
      folder,
      `${prefix}-${safeBaseName(filePath)}${suffix}-${index}${extension}`
    )
    if (!fs.existsSync(next)) return next
    index += 1
  }
}

function ffprobeDuration(filePath) {
  const result = tryRun("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    filePath,
  ])
  if (!result.ok) return null
  const duration = Number.parseFloat(result.stdout.trim())
  return Number.isFinite(duration) ? duration : null
}

function imageSize(filePath) {
  const result = tryRun("sips", ["-g", "pixelWidth", "-g", "pixelHeight", filePath])
  if (!result.ok) return { width: null, height: null }
  const width = Number(result.stdout.match(/pixelWidth:\s*(\d+)/)?.[1])
  const height = Number(result.stdout.match(/pixelHeight:\s*(\d+)/)?.[1])
  return {
    width: Number.isFinite(width) ? width : null,
    height: Number.isFinite(height) ? height : null,
  }
}

function hasAlpha(filePath) {
  const result = tryRun("sips", ["-g", "hasAlpha", filePath])
  return result.ok && /hasAlpha:\s*yes/i.test(result.stdout)
}

function bytes(filePath) {
  return fs.statSync(filePath).size
}

function formatBytes(size) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / (1024 * 1024)).toFixed(2)} MB`
}

function posterForAnimatedMedia(filePath) {
  const outPath = uniqueOutputPath(posterDir, filePath, "-poster", ".jpg")
  const duration = ffprobeDuration(filePath)
  const seek = Math.max(0, Math.min(duration ? duration * 0.25 : 0.2, 4))
  const scale =
    "scale='if(gt(iw,ih),min(1600,iw),-2)':'if(gt(iw,ih),-2,min(1600,ih))':flags=lanczos,format=yuvj420p"

  let result = tryRun("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-ss",
    String(seek),
    "-i",
    filePath,
    "-frames:v",
    "1",
    "-vf",
    scale,
    "-q:v",
    "4",
    outPath,
  ])

  if (!result.ok || !fs.existsSync(outPath) || bytes(outPath) === 0) {
    result = tryRun("ffmpeg", [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      filePath,
      "-frames:v",
      "1",
      "-vf",
      scale,
      "-q:v",
      "4",
      outPath,
    ])
  }

  if (!result.ok || !fs.existsSync(outPath) || bytes(outPath) === 0) {
    throw new Error(`Could not create poster for ${rel(filePath)}: ${result.stderr}`)
  }

  return {
    outputPath: outPath,
    duration,
    timestamp: seek,
    ...imageSize(outPath),
  }
}

function optimizedImage(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const sourceSize = imageSize(filePath)
  const sourceMaxSide = Math.max(sourceSize.width || 0, sourceSize.height || 0)
  const targetMaxSide = sourceMaxSide > 0 ? Math.min(1800, sourceMaxSide) : 1800
  const sourceHasAlpha = hasAlpha(filePath)
  const outPath = uniqueOutputPath(imageDir, filePath, "-web", ".jpg")
  const args = [
    "-s",
    "format",
    "jpeg",
    "-s",
    "formatOptions",
    "82",
    "-Z",
    String(targetMaxSide),
    filePath,
    "--out",
    outPath,
  ]

  run("sips", args)
  if (bytes(outPath) > bytes(filePath)) {
    fs.rmSync(outPath, { force: true })
    const copyExtension = ext === ".jpeg" ? ".jpg" : ext
    const copyPath = uniqueOutputPath(imageDir, filePath, "-web", copyExtension)
    fs.copyFileSync(filePath, copyPath)
    return {
      outputPath: copyPath,
      format: copyExtension.replace(".", ""),
      hasAlpha: sourceHasAlpha,
      keptOriginal: true,
      ...imageSize(copyPath),
    }
  }

  return {
    outputPath: outPath,
    format: "jpg",
    hasAlpha: sourceHasAlpha,
    keptOriginal: false,
    ...imageSize(outPath),
  }
}

function maybeDownloadExternalPoster(url, outPath) {
  const result = tryRun("curl", ["-L", "--fail", "--silent", "--show-error", url, "-o", outPath])
  return result.ok && fs.existsSync(outPath) && bytes(outPath) > 0
}

function writeTsv(rows, outPath) {
  const header = [
    "sourcePath",
    "kind",
    "sourceUrl",
    "posterPath",
    "optimizedPath",
    "originalBytes",
    "outputBytes",
    "dimensions",
  ]
  const lines = rows.map((row) =>
    [
      row.sourcePath,
      row.kind,
      row.sourceUrl || "",
      row.posterPath || "",
      row.optimizedPath || "",
      row.originalBytes,
      row.outputBytes,
      row.width && row.height ? `${row.width}x${row.height}` : "",
    ]
      .map((value) => String(value).replace(/\t/g, " "))
      .join("\t")
  )
  fs.writeFileSync(outPath, `${header.join("\t")}\n${lines.join("\n")}\n`)
}

fs.rmSync(outputDir, { recursive: true, force: true })
fs.mkdirSync(posterDir, { recursive: true })
fs.mkdirSync(imageDir, { recursive: true })

const metadataMap = new Map([
  ...buildMetadataMap(currentDir),
  ...buildMetadataMap(stagingDir),
])

const sourceFiles = [...listMediaFiles(currentDir), ...listMediaFiles(stagingDir)]
const rows = []

for (const filePath of sourceFiles) {
  const ext = path.extname(filePath).toLowerCase()
  const metadata = metadataMap.get(keyForFile(filePath)) || {}
  const originalBytes = bytes(filePath)

  if (VIDEO_EXTENSIONS.has(ext) || GIF_EXTENSIONS.has(ext)) {
    const poster = posterForAnimatedMedia(filePath)
    rows.push({
      sourcePath: rel(filePath),
      sourceUrl: metadata.url || "",
      originalName: metadata.originalName || path.basename(filePath),
      kind: GIF_EXTENSIONS.has(ext) ? "gif-poster" : "video-poster",
      posterPath: rel(poster.outputPath),
      originalBytes,
      originalBytesLabel: formatBytes(originalBytes),
      outputBytes: bytes(poster.outputPath),
      outputBytesLabel: formatBytes(bytes(poster.outputPath)),
      width: poster.width,
      height: poster.height,
      duration: poster.duration,
      posterTimestamp: poster.timestamp,
    })
    continue
  }

  if (IMAGE_EXTENSIONS.has(ext)) {
    const optimized = optimizedImage(filePath)
    rows.push({
      sourcePath: rel(filePath),
      sourceUrl: metadata.url || "",
      originalName: metadata.originalName || path.basename(filePath),
      kind: "image-optimized",
      optimizedPath: rel(optimized.outputPath),
      originalBytes,
      originalBytesLabel: formatBytes(originalBytes),
      outputBytes: bytes(optimized.outputPath),
      outputBytesLabel: formatBytes(bytes(optimized.outputPath)),
      width: optimized.width,
      height: optimized.height,
      outputFormat: optimized.format,
      hasAlpha: optimized.hasAlpha,
      keptOriginal: optimized.keptOriginal,
    })
  }
}

const currentManifest = readManifest(currentDir)
for (const embed of currentManifest?.externalEmbeds || []) {
  if (!embed.thumb) continue
  const rawPath = path.join(posterDir, `external-${safeBaseName(embed.title || embed.provider || "embed")}.jpg`)
  const optimizedPath = path.join(posterDir, `external-${safeBaseName(embed.title || embed.provider || "embed")}-poster.jpg`)
  if (maybeDownloadExternalPoster(embed.thumb, rawPath)) {
    run("sips", [
      "-s",
      "format",
      "jpeg",
      "-s",
      "formatOptions",
      "82",
      "-Z",
      "1600",
      rawPath,
      "--out",
      optimizedPath,
    ])
    fs.rmSync(rawPath, { force: true })
    rows.push({
      sourcePath: embed.url,
      sourceUrl: embed.url,
      originalName: embed.title || embed.provider || "External video",
      kind: "external-video-poster",
      posterPath: rel(optimizedPath),
      originalBytes: "",
      originalBytesLabel: "",
      outputBytes: bytes(optimizedPath),
      outputBytesLabel: formatBytes(bytes(optimizedPath)),
      ...imageSize(optimizedPath),
      externalThumb: embed.thumb,
    })
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  sourceFolders: [rel(currentDir), rel(stagingDir)],
  outputFolder: rel(outputDir),
  posterPolicy:
    "Animated media gets a JPG poster capped at 1600px on the long edge, extracted around 25% of duration and never upscaled. Static case-study images get optimized JPG derivatives capped at 1800px, with smaller originals kept when conversion would increase file size.",
  counts: rows.reduce(
    (acc, row) => {
      acc.total += 1
      acc[row.kind] = (acc[row.kind] || 0) + 1
      return acc
    },
    { total: 0 }
  ),
  rows,
}

fs.writeFileSync(path.join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`)
writeTsv(rows, path.join(outputDir, "manifest.tsv"))

const originalTotal = rows.reduce(
  (sum, row) => sum + (Number.isFinite(row.originalBytes) ? row.originalBytes : 0),
  0
)
const outputTotal = rows.reduce((sum, row) => sum + row.outputBytes, 0)
console.log(`Prepared ${rows.length} Motion Connect media derivatives.`)
console.log(`Output: ${rel(outputDir)}`)
console.log(`Original bytes represented: ${formatBytes(originalTotal)}`)
console.log(`Derivative bytes: ${formatBytes(outputTotal)}`)
