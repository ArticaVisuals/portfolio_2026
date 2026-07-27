async (page) => {
    await page.setViewportSize({ width: 1350, height: 940 })

    const pageErrors = []
    page.on("pageerror", (error) => {
        pageErrors.push({
            message: error.message,
            stack: error.stack,
        })
    })

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
        window.__curtainFinalProbe = {
            paints: [],
            states: [],
        }

        const startedAt = performance.now()
        const recordPaints = (list) => {
            for (const entry of list.getEntries()) {
                window.__curtainFinalProbe.paints.push({
                    name: entry.name,
                    at: performance.now() - startedAt,
                    startTime: entry.startTime,
                })
            }
        }

        new PerformanceObserver(recordPaints).observe({
            type: "paint",
            buffered: true,
        })

        let lastState = ""
        const sample = () => {
            const nav = document.querySelector("nav")
            const cover = document.getElementById("__pt-first-paint")
            const boot = document.getElementById("__pt-boot")
            const state = `${Boolean(nav)}:${Boolean(cover)}:${Boolean(boot)}`

            if (state !== lastState) {
                lastState = state
                window.__curtainFinalProbe.states.push({
                    at: performance.now() - startedAt,
                    nav: Boolean(nav),
                    cover: Boolean(cover),
                    coverTag: cover?.tagName ?? null,
                    boot: Boolean(boot),
                })
            }

            requestAnimationFrame(sample)
        }

        requestAnimationFrame(sample)
    })

    await page.goto(
        `https://micahhoang.com/?curtain-final-probe=${Date.now()}`,
        { waitUntil: "load" }
    )
    await page.waitForTimeout(800)

    const result = await page.evaluate((capturedErrors) => {
        const guardScripts = Array.from(
            document.querySelectorAll(
                "script#mh-head-first-paint-guard"
            )
        )

        return {
            pageErrors: capturedErrors,
            paints: window.__curtainFinalProbe.paints,
            states: window.__curtainFinalProbe.states,
            guardScripts: guardScripts.map((script) => ({
                length: script.textContent.length,
                invalidContentQuote:
                    script.textContent.includes('content:""'),
                usesEightSeconds: script.textContent.includes("8000"),
                usesDOMContentLoaded:
                    script.textContent.includes("DOMContentLoaded"),
            })),
            final: {
                guardScriptCount: guardScripts.length,
                cover: Boolean(
                    document.getElementById("__pt-first-paint")
                ),
                boot: Boolean(document.getElementById("__pt-boot")),
                nav: Boolean(document.querySelector("nav")),
            },
        }
    }, pageErrors)

    await client.send("Emulation.setCPUThrottlingRate", { rate: 1 })
    return result
}
