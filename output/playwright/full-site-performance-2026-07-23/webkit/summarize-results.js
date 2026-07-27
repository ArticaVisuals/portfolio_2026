const fs = require("fs")
const path = require("path")

const auditDir = __dirname
const routes = [
  "/",
  "/home-alt",
  "/404",
  "/case-studies",
  "/index",
  "/play",
  "/info",
  "/case-studies/airpods",
  "/case-studies/simon-schuster",
  "/case-studies/motion-connect-2025",
  "/case-studies/national-park-cards",
  "/case-studies/yomo",
  "/case-studies/highland-harvests",
  "/case-studies/gaia",
  "/case-studies/weaponized-innocence",
  "/case-studies/typldn",
  "/case-studies/seek-truth",
  "/case-studies/cellular-symphony",
  "/case-studies/wolff-olins-x-artcenter",
  "/case-studies/independent-lens",
  "/case-studies/peak-energy",
  "/case-studies/whatsapp",
  "/case-studies/karuna",
  "/case-studies/rejuve",
  "/case-studies/belly-bar",
]
const iphoneRoutes = [
  "/",
  "/play",
  "/case-studies/motion-connect-2025",
  "/case-studies/highland-harvests",
  "/case-studies/gaia",
]

function slug(route) {
  return route === "/" ? "home" : route.slice(1).replaceAll("/", "__")
}

function readResult(directory, route) {
  return JSON.parse(
    fs.readFileSync(path.join(directory, `${slug(route)}.json`), "utf8")
  )
}

function rounded(value) {
  return value == null ? "—" : String(Math.round(value))
}

function finalPath(url) {
  try {
    return new URL(url).pathname
  } catch {
    return url
  }
}

function videoAutoplay(data) {
  const details = data.videos?.details || []
  return {
    total:
      data.videos?.autoplayTotal ??
      details.filter((video) => video.autoplay).length,
    playing:
      data.videos?.autoplayPlaying ??
      details.filter(
        (video) => video.autoplay && !video.paused && video.readyState >= 2
      ).length,
  }
}

function row(data) {
  const errors = (data.consoleMessages || []).filter(
    (message) => message.type === "error"
  ).length
  const warnings = (data.consoleMessages || []).filter(
    (message) => message.type === "warning"
  ).length
  const hardFailures = (data.requestFailures || []).filter(
    (failure) => failure.error !== "cancelled"
  ).length
  const autoplay = videoAutoplay(data)
  const contracts = data.mediaContracts || {
    videoManager: 0,
    lightbox: 0,
    controllers: 0,
  }
  const requestCounts = data.requestCounts || {}

  return [
    finalPath(data.requestedUrl),
    `${data.status ?? "—"} ${finalPath(data.finalUrl)}`,
    rounded(data.timings?.ttfb),
    rounded(data.timings?.fcp),
    rounded(data.timings?.lcp),
    rounded(data.timings?.load),
    `${requestCounts.total || 0} (${requestCounts.script || 0}/${
      requestCounts.image || 0
    }/${requestCounts.media || 0}/${requestCounts.other || 0}/${
      requestCounts.font || 0
    }/${requestCounts.fetch || 0})`,
    `${data.images?.ready || 0}/${data.images?.total || 0} (${
      data.images?.failed || 0
    }/${data.images?.lazyPending || 0})`,
    `${data.videos?.frameReady || 0}/${data.videos?.metadataReady || 0}/${
      data.videos?.total || 0}; ${autoplay.playing}/${autoplay.total}`,
    `${data.iframes?.visible || 0}/${data.iframes?.total || 0}`,
    `${contracts.videoManager}/${contracts.lightbox}/${contracts.controllers}`,
    data.layout?.horizontalOverflow
      ? `yes +${data.layout.overflowAmount || 0}px`
      : "no",
    `${errors}/${warnings}`,
    String(data.pageErrors?.length || 0),
    `${hardFailures}/${data.requestFailures?.length || 0}`,
  ]
}

function markdownTable(resultDirectory, routeList) {
  const header = [
    "Requested route",
    "Status / final route",
    "TTFB",
    "FCP",
    "LCP",
    "Load",
    "Requests total (JS/img/media/other/font/fetch)",
    "Images ready/total (failed/lazy)",
    "Videos frame/meta/total; autoplay playing/total",
    "Iframes visible/total",
    "Contracts VM/LB/CTL",
    "H-overflow",
    "Console err/warn",
    "Page errors",
    "Hard/all request failures",
  ]
  const lines = [
    `| ${header.join(" | ")} |`,
    `|${header.map(() => "---").join("|")}|`,
  ]
  for (const route of routeList) {
    lines.push(`| ${row(readResult(resultDirectory, route)).join(" | ")} |`)
  }
  return lines.join("\n")
}

const desktopReport = `# Desktop WebKit full-site audit

Viewport: 1440×1000 CSS pixels. Timings are milliseconds from one isolated cold
WebKit session per route, with a 4-second post-load observation window (1.2
seconds for known missing routes). Transfer bytes are intentionally omitted
because WebKit does not expose them reliably.

${markdownTable(path.join(auditDir, "results"), routes)}

Legend:

- Video readiness is frame-ready / metadata-ready / total, followed by autoplay
  playing / autoplay total.
- Contracts are \`data-casestudy-videomanager\` /
  \`data-casestudy-lightbox\` / \`data-casestudy-controllers\`.
- Request failures marked "hard" exclude intentional/canceled requests.
- Lazy images are not counted as failed.
`

const iphoneReport = `# iPhone WebKit spot check

Device emulation: Playwright iPhone 15 WebKit, 393×659 CSS-pixel visual viewport.
Each route used an isolated cold session and the same observer as the desktop
matrix.

${markdownTable(path.join(auditDir, "iphone", "results"), iphoneRoutes)}
`

const desktopJson = routes.map((route) =>
  readResult(path.join(auditDir, "results"), route)
)
const iphoneJson = iphoneRoutes.map((route) =>
  readResult(path.join(auditDir, "iphone", "results"), route)
)

fs.writeFileSync(path.join(auditDir, "desktop-report.md"), desktopReport)
fs.writeFileSync(path.join(auditDir, "iphone-report.md"), iphoneReport)
fs.writeFileSync(
  path.join(auditDir, "desktop-results.json"),
  `${JSON.stringify(desktopJson, null, 2)}\n`
)
fs.writeFileSync(
  path.join(auditDir, "iphone-results.json"),
  `${JSON.stringify(iphoneJson, null, 2)}\n`
)
