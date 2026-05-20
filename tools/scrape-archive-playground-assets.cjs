#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

const SOURCE_URL = "https://micahhoang.info/archive"
const OUT_DIR = path.resolve(process.cwd(), "case-study-assets", "current-site", "archive")

const MEDIA_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".mp4",
  ".m4v",
  ".mov",
  ".webm",
])

function log(message) {
  process.stdout.write(`${message}\n`)
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function slugify(value) {
  return String(value || "asset")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .toLowerCase()
}

function cleanExtension(value) {
  const ext = String(value || "").replace(/^\.+/, "").toLowerCase()
  return ext ? `.${ext}` : ""
}

function extensionFromUrl(url) {
  try {
    const ext = path.extname(decodeURIComponent(new URL(url).pathname)).toLowerCase()
    return MEDIA_EXTENSIONS.has(ext) ? ext : ""
  } catch {
    return ""
  }
}

function extensionForMedia(media) {
  const namedExt = path.extname(media.name || "").toLowerCase()
  if (MEDIA_EXTENSIONS.has(namedExt)) return namedExt
  return cleanExtension(media.file_type) || ".bin"
}

function mediaKind(media) {
  const ext = extensionForMedia(media)
  if (media.is_video || [".mp4", ".m4v", ".mov", ".webm"].includes(ext)) return "video"
  if (ext === ".gif" || media.file_type?.toLowerCase() === "gif") return "gif"
  if (ext === ".svg") return "svg"
  return "image"
}

function cargoOriginalUrl(media) {
  const name = encodeURIComponent(media.name || `${media.hash}${extensionForMedia(media)}`)
  return `https://freight.cargo.site/t/original/i/${media.hash}/${name}`
}

function parsePreloadedState(html) {
  const match = html.match(/window\.__PRELOADED_STATE__=(\{.*?\})<\/script>/s)
  if (!match) throw new Error("Could not find Cargo preloaded state")
  return JSON.parse(match[1])
}

function parseAttributes(tag) {
  const attrs = {}
  for (const match of tag.matchAll(/\s([:\w-]+)(?:="([^"]*)")?/g)) {
    attrs[match[1]] = match[2] ?? true
  }
  return attrs
}

function sourceItemsFromContent(content) {
  return [...String(content || "").matchAll(/<media-item\b[^>]*>/g)].map((match, index) => {
    const attrs = parseAttributes(match[0])
    return {
      order: index + 1,
      hash: attrs.hash,
      attrs,
    }
  }).filter((item) => item.hash)
}

function uniqueFilePath(folder, order, media, prefix = "") {
  const ext = extensionForMedia(media)
  const stem = slugify(path.parse(media.name || media.hash).name || media.hash)
  return path.join(folder, `${String(order).padStart(3, "0")}-${prefix}${stem}${ext}`)
}

async function fetchWithRetry(url, attempts = 3) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ArchivePlaygroundScraper/1.0",
        },
      })
      if (response.ok) return response
      lastError = new Error(`HTTP ${response.status} ${response.statusText}`)
    } catch (error) {
      lastError = error
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
  }
  throw lastError
}

async function downloadFile(url, filePath, declaredBytes) {
  if (fs.existsSync(filePath)) {
    const existingBytes = fs.statSync(filePath).size
    if (!declaredBytes || existingBytes === declaredBytes) {
      return { status: "skipped-existing", bytes: existingBytes }
    }
  }

  const response = await fetchWithRetry(url)
  const buffer = Buffer.from(await response.arrayBuffer())
  fs.writeFileSync(filePath, buffer)
  return {
    status: "downloaded",
    bytes: buffer.length,
    contentType: response.headers.get("content-type") || undefined,
  }
}

function resolvePlaygroundHref(href) {
  if (!href) return ""
  if (/^https?:\/\//i.test(href)) return href
  if (href.startsWith("/")) return href
  return `/case-studies/${href.replace(/^\/+/, "")}`
}

async function main() {
  ensureDir(OUT_DIR)

  log(`Fetching ${SOURCE_URL}`)
  const html = await (await fetchWithRetry(SOURCE_URL)).text()
  const state = parsePreloadedState(html)
  const archive = Object.values(state.pages?.byId || {}).find((page) => page.purl === "archive")
  if (!archive) throw new Error("Could not find archive page in Cargo state")

  const mediaByHash = new Map((archive.media || []).map((media) => [media.hash, media]))
  const items = []

  for (const sourceItem of sourceItemsFromContent(archive.content)) {
    const media = mediaByHash.get(sourceItem.hash)
    if (!media) {
      log(`Skipping missing media hash ${sourceItem.hash}`)
      continue
    }

    const originalUrl = cargoOriginalUrl(media)
    const filePath = uniqueFilePath(OUT_DIR, sourceItem.order, media)
    const result = await downloadFile(originalUrl, filePath, media.file_size)
    const poster = media.poster
      ? {
          hash: media.poster.hash,
          name: media.poster.name,
          width: media.poster.width,
          height: media.poster.height,
          fileType: media.poster.file_type,
          mimeType: media.poster.mime_type,
          originalUrl: cargoOriginalUrl(media.poster),
          localPath: path.relative(process.cwd(), uniqueFilePath(OUT_DIR, sourceItem.order, media.poster, "poster-")),
        }
      : undefined

    if (poster) {
      const posterDownload = await downloadFile(poster.originalUrl, path.resolve(process.cwd(), poster.localPath), media.poster.file_size)
      poster.bytes = posterDownload.bytes
      poster.downloadStatus = posterDownload.status
    }

    const item = {
      order: sourceItem.order,
      hash: media.hash,
      name: media.name,
      kind: mediaKind(media),
      width: media.width,
      height: media.height,
      fileType: media.file_type,
      mimeType: media.mime_type,
      declaredBytes: media.file_size,
      downloadedBytes: result.bytes,
      downloadStatus: result.status,
      originalUrl,
      localPath: path.relative(process.cwd(), filePath),
      sourceHref: sourceItem.attrs.href || "",
      playgroundHref: resolvePlaygroundHref(sourceItem.attrs.href),
      target: sourceItem.attrs.target || "",
      rel: sourceItem.attrs.rel || "",
      classes: sourceItem.attrs.class || "",
      autoplay: sourceItem.attrs.autoplay === "true" || sourceItem.attrs.autoplay === true,
      loop: sourceItem.attrs.loop === "true" || sourceItem.attrs.loop === true,
      muted: sourceItem.attrs.muted === "true" || sourceItem.attrs.muted === true,
      justifyRowEnd: sourceItem.attrs["justify-row-end"] || "",
      mediaStyle: sourceItem.attrs["media-style"] || "",
      poster,
    }

    items.push(item)
    log(`${String(item.order).padStart(2, "0")}. ${item.kind.padEnd(5)} ${item.width}x${item.height} ${item.name}`)
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    sourcePage: SOURCE_URL,
    pageTitle: archive.title,
    itemCount: items.length,
    countsByKind: items.reduce((acc, item) => {
      acc[item.kind] = (acc[item.kind] || 0) + 1
      return acc
    }, {}),
    items,
  }

  fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`)
  log(`Wrote ${path.relative(process.cwd(), path.join(OUT_DIR, "manifest.json"))}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
