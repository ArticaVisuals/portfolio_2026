#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const { spawnSync } = require("child_process")

const ROOT_DIR = path.resolve(process.cwd(), "case-study-assets")

function slugify(value) {
  return String(value || "external-video")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .toLowerCase()
}

function pageManifestPaths() {
  const paths = []
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const child = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(child)
      if (entry.isFile() && entry.name === "manifest.json" && child !== path.join(ROOT_DIR, "manifest.json")) {
        paths.push(child)
      }
    }
  }
  walk(ROOT_DIR)
  return paths
}

function existingExternalFiles(folder, id) {
  return fs
    .readdirSync(folder)
    .filter((name) => name.startsWith("external-") && (!id || name.includes(`[${id}]`)))
    .map((name) => path.join(folder, name))
}

function idFromUrl(url) {
  const vimeo = url.match(/vimeo\.com\/video\/(\d+)/)
  if (vimeo) return vimeo[1]
  const youtube = url.match(/[?&]v=([^&]+)/)
  if (youtube) return youtube[1]
  return ""
}

function main() {
  const results = []

  for (const manifestPath of pageManifestPaths()) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
    const embeds = manifest.externalEmbeds || []
    if (embeds.length === 0) continue

    const folder = path.dirname(manifestPath)
    const externalDownloads = manifest.externalDownloads || []

    for (const [index, embed] of embeds.entries()) {
      const id = idFromUrl(embed.url)
      const already = existingExternalFiles(folder, id)
      if (already.length > 0) {
        const files = already.map((file) => path.relative(ROOT_DIR, file))
        const result = { ...embed, status: "skipped-existing", files }
        results.push({ page: manifest.route, source: manifest.source, ...result })
        externalDownloads.push(result)
        continue
      }

      const title = slugify(embed.title || embed.provider || "external-video")
      const output = path.join(folder, `external-${String(index + 1).padStart(2, "0")}-${title} [%(id)s].%(ext)s`)
      const args = [
        "-m",
        "yt_dlp",
        "--no-playlist",
        "--merge-output-format",
        "mp4",
        "-f",
        "bv*+ba/b",
        "-o",
        output,
        embed.url,
      ]

      const startedAt = Date.now()
      const run = spawnSync("python3", args, { encoding: "utf8", maxBuffer: 1024 * 1024 * 20 })
      const files = existingExternalFiles(folder, id).map((file) => path.relative(ROOT_DIR, file))
      const result = {
        ...embed,
        status: run.status === 0 && files.length > 0 ? "downloaded" : "failed",
        files,
        durationMs: Date.now() - startedAt,
        error: run.status === 0 ? undefined : `${run.stderr || run.stdout}`.trim(),
      }
      results.push({ page: manifest.route, source: manifest.source, ...result })
      externalDownloads.push(result)
    }

    manifest.externalDownloads = externalDownloads
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  }

  fs.writeFileSync(path.join(ROOT_DIR, "external-embeds.json"), JSON.stringify(results, null, 2))
  const failed = results.filter((result) => result.status === "failed")
  console.log(`External embeds processed: ${results.length}; failed: ${failed.length}`)
  if (failed.length) process.exitCode = 2
}

main()
