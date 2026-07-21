import { spawnSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, "..")
const outputDir = path.join(
  workspaceRoot,
  "case-study-assets/optimized/featured-project-video-posters"
)
const posterDir = path.join(outputDir, "posters")
const siteOrigin = "https://khaki-ship-257706.framer.app"
const pages = [
  { slug: "gaia", path: "/case-studies/gaia" },
  { slug: "airpods", path: "/case-studies/airpods" },
  { slug: "peak-energy", path: "/case-studies/peak-energy" },
  { slug: "motion-connect-2025", path: "/case-studies/motion-connect-2025" },
  { slug: "simon-schuster", path: "/case-studies/simon-schuster" },
  { slug: "national-park-cards", path: "/case-studies/national-park-cards" },
]

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

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

function parseAttributes(tag) {
  const attributes = new Map()
  const pattern = /([^\s=<>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g
  for (const match of tag.matchAll(pattern)) {
    const key = match[1].toLowerCase()
    if (key === "video") continue
    attributes.set(key, decodeHtml(match[2] ?? match[3] ?? match[4] ?? ""))
  }
  return attributes
}

async function getHtml(pagePath) {
  const response = await fetch(`${siteOrigin}${pagePath}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${pagePath}: ${response.status}`)
  }
  return response.text()
}

function getMissingPosterVideos(html, slug) {
  const videos = []
  for (const match of html.matchAll(/<video\b[^>]*>/gi)) {
    const tag = match[0]
    const attrs = parseAttributes(tag)
    const src = attrs.get("src") || ""
    if (!src || attrs.has("poster")) continue

    videos.push({
      slug,
      src,
      preload: attrs.get("preload") || "",
      autoplay: attrs.has("autoplay"),
      loop: attrs.has("loop"),
    })
  }
  return videos
}

function uniqueVideos(videos) {
  const bySrc = new Map()
  for (const video of videos) {
    if (!bySrc.has(video.src)) {
      bySrc.set(video.src, { ...video, tagCount: 0, pages: new Set() })
    }
    const current = bySrc.get(video.src)
    current.tagCount += 1
    current.pages.add(video.slug)
  }

  return Array.from(bySrc.values()).map((video) => ({
    ...video,
    pages: Array.from(video.pages),
  }))
}

function safeName(video, index) {
  const parsed = new URL(video.src)
  const basename = path
    .basename(parsed.pathname)
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return `${String(index + 1).padStart(2, "0")}-${video.slug}-${basename || "video"}-poster.jpg`
}

function getDuration(src) {
  const result = tryRun("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    src,
  ])
  if (!result.ok) return 0
  const duration = Number.parseFloat(result.stdout.trim())
  return Number.isFinite(duration) && duration > 0 ? duration : 0
}

function posterTimestamp(duration) {
  if (!duration) return 0.5
  return Math.min(Math.max(duration * 0.25, 0.25), Math.max(duration - 0.1, 0.25))
}

function extractPoster(video, posterPath) {
  const duration = getDuration(video.src)
  const timestamp = posterTimestamp(duration)

  run("ffmpeg", [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-ss",
    String(timestamp),
    "-i",
    video.src,
    "-frames:v",
    "1",
    "-vf",
    "scale=w='min(1600,iw)':h='min(1600,ih)':force_original_aspect_ratio=decrease",
    "-q:v",
    "5",
    posterPath,
  ])

  return { duration, timestamp }
}

async function main() {
  fs.rmSync(outputDir, { recursive: true, force: true })
  fs.mkdirSync(posterDir, { recursive: true })

  const allMissing = []
  for (const page of pages) {
    const html = await getHtml(page.path)
    allMissing.push(...getMissingPosterVideos(html, page.slug))
  }

  const videos = uniqueVideos(allMissing)
  const rows = []

  videos.forEach((video, index) => {
    const posterPath = path.join(posterDir, safeName(video, index))
    const { duration, timestamp } = extractPoster(video, posterPath)
    const stats = fs.statSync(posterPath)
    rows.push({
      sourceUrl: video.src,
      pages: video.pages,
      tagCount: video.tagCount,
      posterPath: rel(posterPath),
      outputBytes: stats.size,
      outputBytesLabel:
        stats.size >= 1024 * 1024
          ? `${(stats.size / 1024 / 1024).toFixed(2)} MB`
          : `${Math.round(stats.size / 1024)} KB`,
      duration,
      posterTimestamp: timestamp,
    })
  })

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: siteOrigin,
    pages,
    outputFolder: rel(outputDir),
    posterPolicy:
      "Published featured-project video tags without poster attributes get JPG stills capped at 1600px on the long edge, extracted around 25% of duration and never upscaled.",
    counts: {
      missingPosterVideoSources: rows.length,
      missingPosterVideoTags: allMissing.length,
    },
    rows,
  }

  fs.writeFileSync(
    path.join(outputDir, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`
  )
  fs.writeFileSync(
    path.join(outputDir, "manifest.tsv"),
    [
      "sourceUrl\tpages\ttagCount\tposterPath\toutputBytesLabel\tduration\tposterTimestamp",
      ...rows.map((row) =>
        [
          row.sourceUrl,
          row.pages.join(","),
          row.tagCount,
          row.posterPath,
          row.outputBytesLabel,
          row.duration,
          row.posterTimestamp,
        ].join("\t")
      ),
    ].join("\n") + "\n"
  )

  const totalBytes = rows.reduce((sum, row) => sum + row.outputBytes, 0)
  console.log(`Prepared ${rows.length} featured-project video posters.`)
  console.log(`Missing poster video tags represented: ${allMissing.length}.`)
  console.log(`Poster bytes: ${(totalBytes / 1024 / 1024).toFixed(2)} MB.`)
  console.log(`Manifest: ${rel(path.join(outputDir, "manifest.tsv"))}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
