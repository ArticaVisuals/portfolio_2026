#!/usr/bin/env node

const fs = require("fs")
const os = require("os")
const path = require("path")

const ROOT_DIR = path.resolve(process.cwd(), "case-study-assets")
const CURRENT_BASE = "https://micahhoang.info"
const FRAMER_BASE = "https://khaki-ship-257706.framer.app"

const CURRENT_EXCLUDED_PATHS = new Set([
  "/",
  "/info",
  "/archive",
  "/nav-\u2014-desktop",
  "/nav-\u2014-mobile",
  "/header---mobile",
])

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

const TYPE_BY_CONTENT_TYPE = new Map([
  ["image/jpeg", ".jpg"],
  ["image/jpg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/svg+xml", ".svg"],
  ["video/mp4", ".mp4"],
  ["video/quicktime", ".mov"],
  ["video/webm", ".webm"],
])

function log(message) {
  process.stdout.write(`${message}\n`)
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function xmlDecode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
}

function slugify(value) {
  return String(value || "untitled")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .toLowerCase()
}

function cleanFileName(value) {
  const parsed = path.parse(value || "asset")
  const base = slugify(parsed.name || "asset")
  const ext = slugify(parsed.ext || "")
  return `${base || "asset"}${ext ? `.${ext.replace(/^\.+/, "")}` : ""}`
}

function extensionFromUrl(url) {
  try {
    const pathname = new URL(url).pathname
    const ext = path.extname(decodeURIComponent(pathname)).toLowerCase()
    return MEDIA_EXTENSIONS.has(ext) ? ext : ""
  } catch {
    return ""
  }
}

function mediaKindFromExtension(ext) {
  if ([".mp4", ".m4v", ".mov", ".webm"].includes(ext)) return "video"
  if (ext === ".gif") return "gif"
  if (ext === ".svg") return "svg"
  return "image"
}

function stripQuery(url) {
  try {
    const parsed = new URL(url)
    parsed.search = ""
    parsed.hash = ""
    return parsed.href
  } catch {
    return url
  }
}

function cargoOriginalUrl(media) {
  const name = encodeURIComponent(media.name || `${media.hash}.${media.file_type || "bin"}`)
  return `https://freight.cargo.site/t/original/i/${media.hash}/${name}`
}

function parsePreloadedState(html) {
  const match = html.match(/window\.__PRELOADED_STATE__=(\{.*?\})<\/script>/s)
  if (!match) return null
  return JSON.parse(match[1])
}

async function fetchWithRetry(url, options = {}, attempts = 3) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs || 60000)
    try {
      const { timeoutMs, ...fetchOptions } = options
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 CaseStudyAssetScraper/1.0",
          ...(fetchOptions.headers || {}),
        },
      })
      if (response.ok) return response
      lastError = new Error(`HTTP ${response.status} ${response.statusText}`)
    } catch (error) {
      lastError = error
    } finally {
      clearTimeout(timeout)
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
  }
  throw lastError
}

async function fetchText(url) {
  const response = await fetchWithRetry(url, { timeoutMs: 60000 })
  return response.text()
}

function parseSitemap(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => {
    const block = match[1]
    const loc = xmlDecode((block.match(/<loc>([\s\S]*?)<\/loc>/) || [])[1] || "")
    const mediaUrls = [...block.matchAll(/<image:loc>([\s\S]*?)<\/image:loc>/g)].map((mediaMatch) =>
      xmlDecode(mediaMatch[1].trim())
    )
    return { loc, mediaUrls }
  })
}

function currentPageFromState(state, pathname) {
  const pages = Object.values(state?.pages?.byId || {})
  if (pathname === "/") return pages.find((page) => page.purl === "homepage")
  return pages.find((page) => `/${page.purl}` === pathname) || pages.find((page) => page.display)
}

function mediaHashesFromContent(content) {
  return [...String(content || "").matchAll(/<media-item[^>]*hash="([^"]+)"/g)].map((match) => match[1])
}

async function collectCurrentSite() {
  log("Collecting current Cargo site routes and original media...")
  const sitemap = parseSitemap(await fetchText(`${CURRENT_BASE}/sitemap.xml`))
  const pages = []

  for (const entry of sitemap) {
    const url = new URL(entry.loc)
    if (url.origin !== CURRENT_BASE) continue
    const pathname = decodeURIComponent(url.pathname)
    if (CURRENT_EXCLUDED_PATHS.has(pathname)) continue

    const slug = pathname.replace(/^\/+/, "") || "homepage"
    const html = await fetchText(entry.loc)
    const state = parsePreloadedState(html)
    const page = currentPageFromState(state, pathname)
    const mediaByHash = new Map((page?.media || []).map((media) => [media.hash, media]))
    const contentHashes = mediaHashesFromContent(page?.content)
    const externalHashes = new Set()
    const itemsByKey = new Map()
    const externalEmbeds = []

    contentHashes.forEach((hash, index) => {
      const media = mediaByHash.get(hash)
      if (!media) return
      if (media.is_url || media.url) {
        externalHashes.add(hash)
        externalEmbeds.push({
          url: media.url,
          kind: "external-video",
          provider: media.url_type,
          title: media.name,
          thumb: media.url_thumb,
          hash,
          evidence: "Cargo page state URL embed",
          order: index + 1,
        })
        return
      }
      const itemUrl = cargoOriginalUrl(media)
      const ext = `.${String(media.file_type || extensionFromUrl(itemUrl).replace(".", "bin")).toLowerCase()}`
      const originalName = media.name || `${hash}${ext}`
      itemsByKey.set(stripQuery(itemUrl), {
        url: itemUrl,
        kind: media.is_video ? "video" : media.file_type === "gif" ? "gif" : mediaKindFromExtension(ext),
        originalName,
        width: media.width,
        height: media.height,
        declaredBytes: media.file_size,
        mimeType: media.mime_type,
        hash,
        evidence: "Cargo page state media-item hash",
        order: index + 1,
      })
    })

    entry.mediaUrls.forEach((itemUrl, index) => {
      if ([...externalHashes].some((hash) => itemUrl.includes(hash))) return
      const key = stripQuery(itemUrl)
      if (itemsByKey.has(key)) return
      const ext = extensionFromUrl(itemUrl)
      itemsByKey.set(key, {
        url: itemUrl,
        kind: mediaKindFromExtension(ext),
        originalName: decodeURIComponent(path.basename(new URL(itemUrl).pathname)) || `${slug}-${index + 1}${ext}`,
        evidence: "Cargo sitemap original media URL",
        order: contentHashes.length + index + 1,
      })
    })

    const mediaItems = [...itemsByKey.values()].sort((a, b) => a.order - b.order)
    if (mediaItems.length === 0) continue

    pages.push({
      source: "current-site",
      sourceLabel: "Current micahhoang.info",
      baseUrl: CURRENT_BASE,
      route: pathname,
      pageUrl: entry.loc,
      title: page?.title || slug,
      slug,
      folderName: slugify(slug),
      media: mediaItems,
      externalEmbeds,
    })
  }

  return pages
}

function loadPlaywright() {
  try {
    return require("playwright")
  } catch {}

  const npxRoot = path.join(os.homedir(), ".npm", "_npx")
  const candidates = []
  function walk(dir, depth = 0) {
    if (depth > 5 || !fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const child = path.join(dir, entry.name)
      if (!entry.isDirectory()) continue
      if (entry.name === "playwright" && child.includes(`${path.sep}node_modules${path.sep}`)) {
        candidates.push(child)
      } else {
        walk(child, depth + 1)
      }
    }
  }
  walk(npxRoot)
  if (candidates.length === 0) {
    throw new Error("Playwright is not available. Run: npx --yes playwright install chromium")
  }
  candidates.sort((a, b) => {
    const aInstalled = installedPlaywrightBrowserScore(a)
    const bInstalled = installedPlaywrightBrowserScore(b)
    if (aInstalled !== bInstalled) return bInstalled - aInstalled
    return fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs
  })
  return require(candidates[0])
}

function installedPlaywrightBrowserScore(playwrightDir) {
  try {
    const nodeModulesDir = path.dirname(playwrightDir)
    const browsersJson = path.join(nodeModulesDir, "playwright-core", "browsers.json")
    const browsers = JSON.parse(fs.readFileSync(browsersJson, "utf8")).browsers || []
    const chromium = browsers.find((browser) => browser.name === "chromium-headless-shell")
    if (!chromium?.revision) return 0
    const cacheDir = path.join(os.homedir(), "Library", "Caches", "ms-playwright", `chromium_headless_shell-${chromium.revision}`)
    return fs.existsSync(cacheDir) ? 1 : 0
  } catch {
    return 0
  }
}

function parseFramerSearchIndexRoutes(index) {
  return Object.entries(index)
    .filter(([route]) => route.startsWith("/case-studies/"))
    .map(([route, data]) => ({
      route,
      title: String(data.h1?.[0] || data.title || route.split("/").pop()).replace(/\s+\u2014\s+Micah Hoang$/, ""),
      slug: route.split("/").pop(),
    }))
}

async function framerSearchIndexUrl() {
  const html = await fetchText(`${FRAMER_BASE}/case-studies`)
  const match = html.match(/<meta name="framer-search-index" content="([^"]+)"/)
  if (!match) throw new Error("Could not find Framer search index URL")
  return xmlDecode(match[1])
}

function parseSrcset(srcset) {
  return String(srcset || "")
    .split(",")
    .map((candidate) => candidate.trim().split(/\s+/)[0])
    .filter(Boolean)
}

function isDownloadableMediaUrl(url) {
  if (!/(framerusercontent\.com\/(images|assets|videos)\/|freight\.cargo\.site\/(t\/original\/)?i\/)/.test(url)) return false
  const ext = extensionFromUrl(url)
  return MEDIA_EXTENSIONS.has(ext)
}

async function scrollFullPage(page) {
  let lastHeight = 0
  for (let pass = 0; pass < 4; pass += 1) {
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y <= height; y += 900) {
      await page.evaluate((nextY) => window.scrollTo(0, nextY), y)
      await page.waitForTimeout(180)
    }
    if (height === lastHeight) break
    lastHeight = height
  }
  await page.evaluate(() => window.scrollTo(0, 0))
}

async function collectFramerSite() {
  log("Collecting Framer routes and rendered media...")
  const indexUrl = await framerSearchIndexUrl()
  const routes = parseFramerSearchIndexRoutes(await (await fetchWithRetry(indexUrl)).json())
  const { chromium } = loadPlaywright()
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1400 }, deviceScaleFactor: 2 })
  const pages = []

  try {
    for (const route of routes) {
      const pageUrl = `${FRAMER_BASE}${route.route}`
      log(`  Rendering ${route.route}`)
      await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 90000 })
      await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {})
      await page.waitForTimeout(1000)
      await scrollFullPage(page)

      const collected = await page.evaluate(
        ({ mediaPattern }) => {
          const urls = []
          const mediaRegex = new RegExp(mediaPattern, "i")

          function add(rawUrl, kind, detail = "") {
            if (!rawUrl) return
            try {
              const url = new URL(rawUrl, location.href).href
              if (mediaRegex.test(url)) urls.push({ url, kind, detail })
            } catch {}
          }

          document.querySelectorAll("img").forEach((img, index) => {
            add(img.currentSrc, "img-current", `img-${index}`)
            add(img.src, "img-src", `img-${index}`)
            parseSrcsetInPage(img.srcset).forEach((candidate) => add(candidate, "img-srcset", `img-${index}`))
          })

          document.querySelectorAll("picture source, source").forEach((source, index) => {
            add(source.src, "source-src", `source-${index}`)
            parseSrcsetInPage(source.srcset).forEach((candidate) => add(candidate, "source-srcset", `source-${index}`))
          })

          document.querySelectorAll("video").forEach((video, index) => {
            add(video.currentSrc, "video-current", `video-${index}`)
            add(video.src, "video-src", `video-${index}`)
            add(video.poster, "video-poster", `video-${index}`)
          })

          document.querySelectorAll("iframe").forEach((iframe, index) => {
            add(iframe.src, "iframe-src", `iframe-${index}`)
          })

          for (const element of document.querySelectorAll("*")) {
            const backgroundImage = getComputedStyle(element).backgroundImage
            if (!backgroundImage || !backgroundImage.includes("url(")) continue
            for (const match of backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
              add(match[1], "css-background")
            }
          }

          performance.getEntriesByType("resource").forEach((entry) => {
            add(entry.name, `resource-${entry.initiatorType}`)
          })

          return {
            title: document.title,
            h1: [...document.querySelectorAll("h1")].map((node) => node.textContent.trim()).filter(Boolean),
            urls,
          }

          function parseSrcsetInPage(srcset) {
            return String(srcset || "")
              .split(",")
              .map((candidate) => candidate.trim().split(/\s+/)[0])
              .filter(Boolean)
          }
        },
        {
          mediaPattern: String.raw`(framerusercontent\.com\/(images|assets|videos)\/|freight\.cargo\.site\/(t\/original\/)?i\/).*?\.(png|jpe?g|webp|gif|svg|mp4|webm|mov|m4v)(\?|$)|player\.vimeo\.com\/video\/`,
        }
      )

      const byUrl = new Map()
      const externalEmbeds = []
      collected.urls.forEach((candidate, index) => {
        if (/player\.vimeo\.com\/video\//.test(candidate.url)) {
          if (!externalEmbeds.some((embed) => embed.url === candidate.url)) {
            externalEmbeds.push({
              url: candidate.url,
              kind: "external-video",
              evidence: `Framer rendered ${candidate.kind}`,
            })
          }
          return
        }
        if (!isDownloadableMediaUrl(candidate.url)) return
        const originalUrl = stripQuery(candidate.url)
        const ext = extensionFromUrl(originalUrl)
        if (!MEDIA_EXTENSIONS.has(ext)) return
        if (byUrl.has(originalUrl)) {
          byUrl.get(originalUrl).evidence += `; ${candidate.kind}`
          return
        }
        byUrl.set(originalUrl, {
          url: originalUrl,
          kind: mediaKindFromExtension(ext),
          originalName: decodeURIComponent(path.basename(new URL(originalUrl).pathname)),
          evidence: `Framer rendered ${candidate.kind}`,
          order: index + 1,
        })
      })

      pages.push({
        source: "framer-staging",
        sourceLabel: "New Framer staging",
        baseUrl: FRAMER_BASE,
        route: route.route,
        pageUrl,
        title: collected.h1[0] || route.title,
        slug: route.slug,
        folderName: slugify(route.slug),
        media: [...byUrl.values()].sort((a, b) => a.order - b.order),
        externalEmbeds,
      })
    }
  } finally {
    await browser.close()
  }

  return pages
}

async function downloadItem(item, destinationDir, index) {
  const urlExt = extensionFromUrl(item.url)
  const sourceName = cleanFileName(item.originalName || path.basename(new URL(item.url).pathname))
  const sourceExt = path.extname(sourceName)
  const provisionalName = `${String(index).padStart(3, "0")}-${sourceName || `asset${urlExt || ""}`}`
  let destinationPath = path.join(destinationDir, provisionalName)

  if (!path.extname(destinationPath) && urlExt) {
    destinationPath += urlExt
  }

  if (fs.existsSync(destinationPath) && fs.statSync(destinationPath).size > 0) {
    return {
      ...item,
      file: path.relative(ROOT_DIR, destinationPath),
      bytes: fs.statSync(destinationPath).size,
      status: "skipped-existing",
    }
  }

  const response = await fetchWithRetry(item.url, { timeoutMs: 300000 })
  const contentType = response.headers.get("content-type")?.split(";")[0].toLowerCase() || ""
  const buffer = Buffer.from(await response.arrayBuffer())
  const contentExt = TYPE_BY_CONTENT_TYPE.get(contentType)

  if (!sourceExt && contentExt && !destinationPath.endsWith(contentExt)) {
    destinationPath += contentExt
  }

  fs.writeFileSync(destinationPath, buffer)
  return {
    ...item,
    file: path.relative(ROOT_DIR, destinationPath),
    bytes: buffer.length,
    contentType,
    status: "downloaded",
  }
}

async function runLimited(items, limit, worker) {
  const results = new Array(items.length)
  let cursor = 0
  async function next() {
    while (cursor < items.length) {
      const current = cursor
      cursor += 1
      results[current] = await worker(items[current], current)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, next))
  return results
}

async function downloadPages(pages) {
  for (const page of pages) {
    const pageDir = path.join(ROOT_DIR, page.source, page.folderName)
    ensureDir(pageDir)
    log(`Downloading ${page.source}/${page.folderName} (${page.media.length} assets)`)

    const uniqueItems = [...new Map(page.media.map((item) => [stripQuery(item.url), item])).values()]
    const downloaded = await runLimited(uniqueItems, 5, async (item, index) => {
      try {
        return await downloadItem(item, pageDir, index + 1)
      } catch (error) {
        return { ...item, status: "failed", error: error.message }
      }
    })

    page.downloaded = downloaded
    fs.writeFileSync(path.join(pageDir, "manifest.json"), JSON.stringify(page, null, 2))
  }
}

function writeSummary(pages) {
  const summary = {
    generatedAt: new Date().toISOString(),
    root: ROOT_DIR,
    sources: {
      currentSite: CURRENT_BASE,
      framerStaging: FRAMER_BASE,
    },
    totals: {
      pages: pages.length,
      assets: pages.reduce((sum, page) => sum + (page.downloaded || page.media).length, 0),
      downloaded: pages.reduce(
        (sum, page) => sum + (page.downloaded || []).filter((item) => item.status === "downloaded").length,
        0
      ),
      skippedExisting: pages.reduce(
        (sum, page) => sum + (page.downloaded || []).filter((item) => item.status === "skipped-existing").length,
        0
      ),
      failed: pages.reduce((sum, page) => sum + (page.downloaded || []).filter((item) => item.status === "failed").length, 0),
    },
    pages: pages.map((page) => ({
      source: page.source,
      title: page.title,
      route: page.route,
      folder: path.relative(ROOT_DIR, path.join(ROOT_DIR, page.source, page.folderName)),
      assets: (page.downloaded || page.media).length,
      failed: (page.downloaded || []).filter((item) => item.status === "failed").length,
    })),
  }

  fs.writeFileSync(path.join(ROOT_DIR, "manifest.json"), JSON.stringify(summary, null, 2))

  const lines = [
    "# Case Study Asset Scrape",
    "",
    `Generated: ${summary.generatedAt}`,
    "",
    `- Current site: ${CURRENT_BASE}`,
    `- Framer staging: ${FRAMER_BASE}`,
    `- Pages: ${summary.totals.pages}`,
    `- Assets: ${summary.totals.assets}`,
    `- Downloaded this run: ${summary.totals.downloaded}`,
    `- Already present: ${summary.totals.skippedExisting}`,
    `- Failed: ${summary.totals.failed}`,
    "",
    "## Folders",
    "",
    ...summary.pages.map((page) => `- ${page.folder} — ${page.assets} assets${page.failed ? `, ${page.failed} failed` : ""}`),
    "",
  ]

  fs.writeFileSync(path.join(ROOT_DIR, "README.md"), lines.join("\n"))
  return summary
}

async function main() {
  ensureDir(ROOT_DIR)
  const [currentPages, framerPages] = await Promise.all([collectCurrentSite(), collectFramerSite()])
  const pages = [...currentPages, ...framerPages]
  await downloadPages(pages)
  const summary = writeSummary(pages)
  log(`Done. ${summary.totals.assets} assets across ${summary.totals.pages} pages. Failed: ${summary.totals.failed}`)
  if (summary.totals.failed > 0) process.exitCode = 2
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
