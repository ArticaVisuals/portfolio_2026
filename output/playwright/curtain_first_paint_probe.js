async (page) => {
    await page.setViewportSize({ width: 1350, height: 940 })
    const client = await page.context().newCDPSession(page)
    await client.send("Network.enable")
    await client.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 150,
        downloadThroughput: (1.5 * 1024 * 1024) / 8,
        uploadThroughput: (750 * 1024) / 8,
        connectionType: "cellular3g",
    })
    await client.send("Emulation.setCPUThrottlingRate", { rate: 4 })

    await page.addInitScript(() => {
        window.__curtainProbe = { events: [], states: [] }
        const startedAt = performance.now()
        const stamp = (type, extra = {}) => {
            window.__curtainProbe.events.push({
                type,
                at: performance.now() - startedAt,
                ...extra,
            })
        }

        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                stamp(entry.name, { startTime: entry.startTime })
            }
        }).observe({ type: "paint", buffered: true })

        let lastState = ""
        const sample = () => {
            const nav = document.querySelector("nav")
            const cover = document.getElementById("__pt-first-paint")
            const boot = document.getElementById("__pt-boot")
            const state = `${Boolean(nav)}:${Boolean(cover)}:${Boolean(boot)}`
            if (state !== lastState) {
                lastState = state
                window.__curtainProbe.states.push({
                    at: performance.now() - startedAt,
                    nav: Boolean(nav),
                    cover: Boolean(cover),
                    boot: Boolean(boot),
                })
            }
            requestAnimationFrame(sample)
        }
        requestAnimationFrame(sample)

        new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (!(node instanceof Element)) continue
                    if (node.matches("nav") || node.querySelector("nav"))
                        stamp("nav-added")
                    if (
                        node.id === "__pt-first-paint" ||
                        node.querySelector("#__pt-first-paint")
                    )
                        stamp("first-paint-cover-added")
                    if (
                        node.id === "__pt-boot" ||
                        node.querySelector("#__pt-boot")
                    )
                        stamp("boot-curtain-added")
                }
                for (const node of mutation.removedNodes) {
                    if (!(node instanceof Element)) continue
                    if (node.id === "__pt-first-paint")
                        stamp("first-paint-cover-removed")
                }
            }
        }).observe(document.documentElement, { childList: true, subtree: true })
    })

    await page.goto(
        `https://micahhoang.com/?curtain-probe=${Date.now()}`,
        { waitUntil: "load" }
    )
    await page.waitForTimeout(2600)

    const result = await page.evaluate(() => {
        const probe = window.__curtainProbe
        const paints = performance
            .getEntriesByType("paint")
            .map((entry) => ({ name: entry.name, startTime: entry.startTime }))
        return {
            events: probe.events,
            states: probe.states,
            paints,
            environment: {
                width: window.innerWidth,
                height: window.innerHeight,
                referrer: document.referrer,
                navigationType:
                    performance.getEntriesByType("navigation")[0]?.type,
            },
            final: {
                cover: Boolean(document.getElementById("__pt-first-paint")),
                boot: Boolean(document.getElementById("__pt-boot")),
                nav: Boolean(document.querySelector("nav")),
            },
        }
    })

    await client.send("Emulation.setCPUThrottlingRate", { rate: 1 })
    return result
}
