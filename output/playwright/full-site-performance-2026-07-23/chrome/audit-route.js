async (page) => {
    const target = await page.evaluate(() =>
        decodeURIComponent(location.hash.slice(1))
    )
    const settleMs = /\/(?:404|case-studies\/(?:karuna|rejuve|belly-bar))$/.test(
        target
    )
        ? 1500
        : 6000
    const consoleErrors = []
    const consoleWarnings = []
    const pageErrors = []
    const failedRequests = []
    const requests = new Map()

    page.on("console", (message) => {
        const record = {
            type: message.type(),
            text: message.text().slice(0, 500),
        }
        if (message.type() === "error" && consoleErrors.length < 40) {
            consoleErrors.push(record)
        }
        if (message.type() === "warning" && consoleWarnings.length < 40) {
            consoleWarnings.push(record)
        }
    })
    page.on("pageerror", (error) => {
        if (pageErrors.length < 40) {
            pageErrors.push({
                name: error.name || "Error",
                message: String(error.message || error).slice(0, 800),
            })
        }
    })
    page.on("requestfailed", (request) => {
        if (failedRequests.length < 40) {
            failedRequests.push({
                url: request.url(),
                resourceType: request.resourceType(),
                error: request.failure()?.errorText || "request failed",
            })
        }
    })

    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.addInitScript(() => {
        window.__codexPerfAudit = {
            lcp: 0,
            lcpUrl: "",
            cls: 0,
            longTasks: [],
        }
        try {
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    window.__codexPerfAudit.lcp = entry.startTime
                    window.__codexPerfAudit.lcpUrl = entry.url || ""
                }
            }).observe({ type: "largest-contentful-paint", buffered: true })
        } catch {}
        try {
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        window.__codexPerfAudit.cls += entry.value
                    }
                }
            }).observe({ type: "layout-shift", buffered: true })
        } catch {}
        try {
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    window.__codexPerfAudit.longTasks.push({
                        startTime: entry.startTime,
                        duration: entry.duration,
                    })
                }
            }).observe({ type: "longtask", buffered: true })
        } catch {}
    })

    const cdp = await page.context().newCDPSession(page)
    await cdp.send("Network.enable")
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true })
    cdp.on("Network.requestWillBeSent", (event) => {
        requests.set(event.requestId, {
            requestId: event.requestId,
            url: event.request.url,
            method: event.request.method,
            type: event.type || "Other",
            start: event.timestamp,
            status: 0,
            mimeType: "",
            fromDiskCache: false,
            fromServiceWorker: false,
            encodedBytes: 0,
            durationMs: 0,
            failed: false,
        })
    })
    cdp.on("Network.responseReceived", (event) => {
        const request = requests.get(event.requestId)
        if (!request) return
        request.status = event.response.status
        request.mimeType = event.response.mimeType || ""
        request.fromDiskCache = Boolean(event.response.fromDiskCache)
        request.fromServiceWorker = Boolean(event.response.fromServiceWorker)
        request.protocol = event.response.protocol || ""
    })
    cdp.on("Network.loadingFinished", (event) => {
        const request = requests.get(event.requestId)
        if (!request) return
        request.encodedBytes = Math.max(
            0,
            Math.round(event.encodedDataLength || 0)
        )
        request.durationMs = Math.max(
            0,
            Math.round((event.timestamp - request.start) * 1000)
        )
    })
    cdp.on("Network.loadingFailed", (event) => {
        const request = requests.get(event.requestId)
        if (!request) return
        request.failed = true
        request.errorText = event.errorText || "loading failed"
        request.durationMs = Math.max(
            0,
            Math.round((event.timestamp - request.start) * 1000)
        )
    })

    const startedAt = Date.now()
    let mainResponse = null
    let navigationError = ""
    try {
        mainResponse = await page.goto(target, {
            waitUntil: "load",
            timeout: 60000,
        })
    } catch (error) {
        navigationError = String(error?.message || error).slice(0, 1000)
    }
    await page.waitForTimeout(settleMs)

    const documentMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType("navigation")[0]
        const paints = performance.getEntriesByType("paint")
        const firstPaint =
            paints.find((entry) => entry.name === "first-paint")?.startTime || 0
        const firstContentfulPaint =
            paints.find(
                (entry) => entry.name === "first-contentful-paint"
            )?.startTime || 0
        const audit = window.__codexPerfAudit || {
            lcp: 0,
            lcpUrl: "",
            cls: 0,
            longTasks: [],
        }
        const images = Array.from(document.images)
        const videos = Array.from(document.querySelectorAll("video"))
        const iframes = Array.from(document.querySelectorAll("iframe"))
        const longTasks = audit.longTasks || []
        const canonical =
            document.querySelector('link[rel="canonical"]')?.href || ""
        return {
            title: document.title,
            canonical,
            bodyTextLength: document.body?.innerText?.length || 0,
            domNodes: document.getElementsByTagName("*").length,
            runtimeMarkers: {
                videoManager: document.querySelectorAll(
                    "[data-casestudy-videomanager]"
                ).length,
                lightbox: document.querySelectorAll(
                    "[data-casestudy-lightbox]"
                ).length,
                controllers: document.querySelectorAll(
                    "[data-casestudy-controllers]"
                ).length,
            },
            timing: navigation
                ? {
                      ttfbMs: Math.max(
                          0,
                          navigation.responseStart - navigation.requestStart
                      ),
                      responseStartMs: navigation.responseStart,
                      domContentLoadedMs:
                          navigation.domContentLoadedEventEnd || 0,
                      loadMs:
                          navigation.loadEventEnd ||
                          navigation.duration ||
                          0,
                      firstPaintMs: firstPaint,
                      fcpMs: firstContentfulPaint,
                      lcpMs: audit.lcp || 0,
                      lcpUrl: audit.lcpUrl || "",
                      cls: audit.cls || 0,
                      longTaskCount: longTasks.length,
                      longTaskTotalMs: longTasks.reduce(
                          (sum, item) => sum + item.duration,
                          0
                      ),
                      longTaskMaxMs: longTasks.reduce(
                          (max, item) => Math.max(max, item.duration),
                          0
                      ),
                  }
                : null,
            media: {
                images: {
                    total: images.length,
                    withSource: images.filter(
                        (image) => Boolean(image.currentSrc || image.src)
                    ).length,
                    complete: images.filter((image) => image.complete).length,
                    ready: images.filter(
                        (image) => image.complete && image.naturalWidth > 0
                    ).length,
                    broken: images.filter(
                        (image) => image.complete && image.naturalWidth === 0
                    ).length,
                    incomplete: images.filter((image) => !image.complete)
                        .length,
                    lazy: images.filter(
                        (image) => image.loading === "lazy"
                    ).length,
                },
                videos: {
                    total: videos.length,
                    withSource: videos.filter((video) =>
                        Boolean(video.currentSrc || video.src)
                    ).length,
                    readyState0: videos.filter(
                        (video) => video.readyState === 0
                    ).length,
                    readyState1: videos.filter(
                        (video) => video.readyState === 1
                    ).length,
                    readyState2Plus: videos.filter(
                        (video) => video.readyState >= 2
                    ).length,
                    playing: videos.filter(
                        (video) => !video.paused && !video.ended
                    ).length,
                    autoplayTotal: videos.filter((video) => video.autoplay)
                        .length,
                    autoplayPlaying: videos.filter(
                        (video) =>
                            video.autoplay && !video.paused && !video.ended
                    ).length,
                    preloadNone: videos.filter(
                        (video) => video.preload === "none"
                    ).length,
                },
                iframes: {
                    total: iframes.length,
                    withSource: iframes.filter((frame) =>
                        Boolean(frame.src)
                    ).length,
                },
            },
        }
    })

    const requestList = Array.from(requests.values()).filter(
        (request) => request.url !== "about:blank"
    )
    const totalsByType = {}
    for (const request of requestList) {
        const type = request.type || "Other"
        if (!totalsByType[type]) {
            totalsByType[type] = { requests: 0, bytes: 0, failed: 0 }
        }
        totalsByType[type].requests += 1
        totalsByType[type].bytes += request.encodedBytes || 0
        if (request.failed) totalsByType[type].failed += 1
    }
    const totalBytes = requestList.reduce(
        (sum, request) => sum + (request.encodedBytes || 0),
        0
    )
    const largestAssets = [...requestList]
        .sort((left, right) => right.encodedBytes - left.encodedBytes)
        .slice(0, 20)
        .map((request) => ({
            url: request.url,
            type: request.type,
            status: request.status,
            mimeType: request.mimeType,
            bytes: request.encodedBytes,
            durationMs: request.durationMs,
            fromDiskCache: request.fromDiskCache,
            fromServiceWorker: request.fromServiceWorker,
        }))

    return {
        target,
        auditedAt: new Date().toISOString(),
        viewport: { width: 1440, height: 1000 },
        browser: "Google Chrome via Playwright CLI",
        cacheDisabled: true,
        settleMs,
        finalUrl: page.url(),
        status: mainResponse?.status() || 0,
        navigationError,
        wallClockMs: Date.now() - startedAt,
        ...documentMetrics,
        network: {
            requestCount: requestList.length,
            failedRequestCount: requestList.filter(
                (request) => request.failed
            ).length,
            totalBytes,
            totalsByType,
            largestAssets,
        },
        errors: {
            consoleErrors,
            consoleWarnings,
            pageErrors,
            failedRequests,
        },
    }
}
