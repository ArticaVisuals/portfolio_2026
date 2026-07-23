async page => {
    const base = "https://khaki-ship-257706.framer.app"
    const outDir = "output/playwright/visual-qa-2026-05-20"

    const routes = [
        { path: "/", name: "home", scrolls: [0, 900, 1800] },
        { path: "/play", name: "play", scrolls: [0] },
        { path: "/index", name: "index", scrolls: [0, 900] },
        { path: "/case-studies", name: "case-studies", scrolls: [0, 900] },
        { path: "/info", name: "info", scrolls: [0, 900, 1800, 2700] },
        { path: "/contact", name: "contact", scrolls: [0] },
        { path: "/case-studies/airpods", name: "airpods", scrolls: [0, 900, 1800, 2700] },
    ]

    const viewports = [
        { name: "desktop", width: 1440, height: 1000 },
        { name: "tablet", width: 810, height: 1100 },
        { name: "mobile", width: 390, height: 900 },
    ]

    const report = {
        base,
        outDir,
        routeChecks: [],
        playChecks: [],
        console: [],
        pageErrors: [],
        failedRequests: [],
    }

    page.on("console", message => {
        if (["error", "warning"].includes(message.type())) {
            report.console.push({
                type: message.type(),
                text: message.text().slice(0, 500),
                url: page.url(),
            })
        }
    })
    page.on("pageerror", error => {
        report.pageErrors.push({ message: String(error.message || error).slice(0, 500), url: page.url() })
    })
    page.on("requestfailed", request => {
        const url = request.url()
        if (url.startsWith("data:") || url.includes("favicon")) return
        report.failedRequests.push({
            url: url.slice(0, 500),
            failure: request.failure()?.errorText || "",
            page: page.url(),
        })
    })

    const waitForSettle = async () => {
        await page.waitForLoadState("domcontentloaded").catch(() => {})
        await page.waitForTimeout(2200)
        await page.evaluate(async () => {
            const media = Array.from(document.querySelectorAll("img, video"))
            await Promise.all(media.slice(0, 80).map(element => {
                if (element instanceof HTMLImageElement) {
                    if (element.complete) return Promise.resolve()
                    return new Promise(resolve => {
                        element.addEventListener("load", resolve, { once: true })
                        element.addEventListener("error", resolve, { once: true })
                        setTimeout(resolve, 1200)
                    })
                }
                if (element instanceof HTMLVideoElement) {
                    if (element.readyState >= 1) return Promise.resolve()
                    return new Promise(resolve => {
                        element.addEventListener("loadedmetadata", resolve, { once: true })
                        element.addEventListener("error", resolve, { once: true })
                        setTimeout(resolve, 1200)
                    })
                }
                return Promise.resolve()
            }))
        }).catch(() => {})
    }

    const pageDiagnostics = async () => page.evaluate(() => {
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const doc = document.documentElement
        const body = document.body
        const visible = element => {
            const style = window.getComputedStyle(element)
            const rect = element.getBoundingClientRect()
            return rect.width > 1 && rect.height > 1 && style.visibility !== "hidden" && style.display !== "none" && Number(style.opacity || 1) > 0.01
        }
        const overflowers = Array.from(document.querySelectorAll("body *")).map(element => {
            const rect = element.getBoundingClientRect()
            if (!visible(element)) return null
            if (rect.right <= viewportWidth + 2 && rect.left >= -2) return null
            const label = element.getAttribute("data-framer-name") || element.getAttribute("aria-label") || element.tagName
            return { label, tag: element.tagName, left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) }
        }).filter(Boolean).slice(0, 12)
        const brokenImages = Array.from(document.images).filter(img => visible(img) && img.complete && img.naturalWidth === 0).map(img => img.currentSrc || img.src).slice(0, 12)
        const visibleVideos = Array.from(document.querySelectorAll("video")).filter(visible).map(video => ({
            src: video.currentSrc || video.getAttribute("src") || "",
            paused: video.paused,
            controls: video.controls,
            muted: video.muted,
            loop: video.loop,
            readyState: video.readyState,
            rect: (() => { const r = video.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) } })(),
        })).slice(0, 12)
        const overlaps = []
        const mediaNodes = Array.from(document.querySelectorAll("img, video, [style*='background-image']")).filter(visible).slice(0, 80)
        for (let i = 0; i < mediaNodes.length; i++) {
            const a = mediaNodes[i].getBoundingClientRect()
            if (a.width < 30 || a.height < 30) continue
            for (let j = i + 1; j < mediaNodes.length; j++) {
                const b = mediaNodes[j].getBoundingClientRect()
                if (b.width < 30 || b.height < 30) continue
                const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
                const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))
                const area = x * y
                const minArea = Math.min(a.width * a.height, b.width * b.height)
                if (area > 0 && area / minArea > 0.35) {
                    overlaps.push({ ratio: Number((area / minArea).toFixed(2)), a: mediaNodes[i].tagName, b: mediaNodes[j].tagName })
                    if (overlaps.length >= 8) break
                }
            }
            if (overlaps.length >= 8) break
        }
        return {
            title: document.title,
            url: location.href,
            scrollWidth: doc.scrollWidth,
            clientWidth: doc.clientWidth,
            bodyHeight: Math.max(body.scrollHeight, doc.scrollHeight),
            horizontalOverflow: doc.scrollWidth > viewportWidth + 2,
            overflowers,
            brokenImages,
            visibleVideos,
            overlaps,
            footerVisible: Boolean(Array.from(document.querySelectorAll("footer, [data-framer-name*='Footer' i]")).find(visible)),
            blankish: body.innerText.trim().length < 30,
            viewportWidth,
            viewportHeight,
        }
    })

    for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        for (const route of routes) {
            await page.goto(`${base}${route.path}`, { waitUntil: "domcontentloaded", timeout: 45000 })
            await waitForSettle()
            const diag = await pageDiagnostics()
            const entry = { route: route.path, routeName: route.name, viewport: viewport.name, diagnostics: diag, screenshots: [] }
            for (const y of route.scrolls) {
                await page.evaluate(scrollY => window.scrollTo(0, scrollY), y)
                await page.waitForTimeout(450)
                const file = `${viewport.name}-${route.name}-y${y}.png`
                const filePath = `${outDir}/${file}`
                await page.screenshot({ path: filePath, fullPage: false })
                entry.screenshots.push(filePath)
            }
            report.routeChecks.push(entry)
        }
    }

    // Interaction checks for the playground on the published route.
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto(`${base}/play`, { waitUntil: "domcontentloaded", timeout: 45000 })
    await waitForSettle()
    await page.mouse.move(720, 500)
    await page.waitForTimeout(500)

    const initialPlay = await pageDiagnostics()
    await page.screenshot({ path: `${outDir}/desktop-play-interaction-initial.png`, fullPage: false })
    report.playChecks.push({ name: "initial", diagnostics: initialPlay })

    const cardBox = await page.locator("[data-playground-card='true']").first().boundingBox().catch(() => null)
    if (cardBox) {
        await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2)
        await page.waitForTimeout(650)
        const hoverDiag = await page.evaluate(() => {
            const overlays = Array.from(document.querySelectorAll("[data-playground-media-stroke-generated='true']")).map(overlay => {
                const container = overlay.parentElement
                const media = container?.querySelector("img, video")
                const o = overlay.getBoundingClientRect()
                const c = container?.getBoundingClientRect()
                const m = media?.getBoundingClientRect()
                const style = container ? window.getComputedStyle(container) : null
                return {
                    overlay: { left: Math.round(o.left), top: Math.round(o.top), right: Math.round(o.right), bottom: Math.round(o.bottom), w: Math.round(o.width), h: Math.round(o.height) },
                    container: c ? { left: Math.round(c.left), top: Math.round(c.top), right: Math.round(c.right), bottom: Math.round(c.bottom), w: Math.round(c.width), h: Math.round(c.height) } : null,
                    media: m ? { left: Math.round(m.left), top: Math.round(m.top), right: Math.round(m.right), bottom: Math.round(m.bottom), w: Math.round(m.width), h: Math.round(m.height) } : null,
                    clipPath: style?.clipPath || "",
                    overflow: style?.overflow || "",
                    border: window.getComputedStyle(overlay).borderWidth,
                }
            })
            return {
                overlayCount: overlays.length,
                overlays: overlays.slice(0, 8),
                helperPresent: Boolean(document.querySelector("[data-playground-panel='true']")),
            }
        })
        await page.screenshot({ path: `${outDir}/desktop-play-interaction-hover.png`, fullPage: false })
        report.playChecks.push({ name: "hover-stroke", hoverDiag })

        await page.mouse.click(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2)
        await page.waitForTimeout(1000)
        await page.screenshot({ path: `${outDir}/desktop-play-sidebar-open.png`, fullPage: false })
        const openDiag = await page.evaluate(() => {
            const panel = document.querySelector("[data-playground-panel='true']")
            const panelRect = panel?.getBoundingClientRect()
            const videos = Array.from(panel?.querySelectorAll("video") || []).map(video => ({ paused: video.paused, controls: video.controls, muted: video.muted, loop: video.loop, readyState: video.readyState }))
            return {
                panelOpen: Boolean(panel && getComputedStyle(panel).pointerEvents !== "none"),
                panelTextLength: panel?.textContent?.trim().length || 0,
                panelRect: panelRect ? { left: Math.round(panelRect.left), right: Math.round(panelRect.right), width: Math.round(panelRect.width) } : null,
                videos,
            }
        })
        report.playChecks.push({ name: "sidebar-open", openDiag })

        await page.mouse.click(120, 500)
        await page.waitForTimeout(250)
        await page.screenshot({ path: `${outDir}/desktop-play-sidebar-close-250ms.png`, fullPage: false })
        const close250 = await page.evaluate(() => {
            const panel = document.querySelector("[data-playground-panel='true']")
            const snapshot = document.querySelector("[data-playground-exit-snapshot='true']")
            const rect = panel?.getBoundingClientRect()
            return {
                panelPresent: Boolean(panel),
                snapshotPresent: Boolean(snapshot),
                textLength: panel?.textContent?.trim().length || 0,
                panelRect: rect ? { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) } : null,
            }
        })
        await page.waitForTimeout(450)
        await page.screenshot({ path: `${outDir}/desktop-play-sidebar-close-700ms.png`, fullPage: false })
        const close700 = await page.evaluate(() => {
            const panel = document.querySelector("[data-playground-panel='true']")
            const snapshot = document.querySelector("[data-playground-exit-snapshot='true']")
            const rect = panel?.getBoundingClientRect()
            return {
                panelPresent: Boolean(panel),
                snapshotPresent: Boolean(snapshot),
                textLength: panel?.textContent?.trim().length || 0,
                panelRect: rect ? { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) } : null,
            }
        })
        report.playChecks.push({ name: "sidebar-close", close250, close700 })
    }

    return {
        outDir,
        routeChecks: report.routeChecks.length,
        consoleCount: report.console.length,
        pageErrorCount: report.pageErrors.length,
        failedRequestCount: report.failedRequests.length,
        playChecks: report.playChecks,
        suspiciousRoutes: report.routeChecks
            .filter(item => item.diagnostics.horizontalOverflow || item.diagnostics.brokenImages.length || item.diagnostics.blankish || item.diagnostics.overlaps.length)
            .map(item => ({ route: item.route, viewport: item.viewport, diagnostics: item.diagnostics })),
    }
}
