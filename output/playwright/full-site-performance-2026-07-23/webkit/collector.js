async (page) => {
  const target = await page.evaluate(() => sessionStorage.getItem("auditTarget") || location.href)
  const consoleMessages = []
  const pageErrors = []
  const requestFailures = []
  const requestCounts = {
    total: 0,
    document: 0,
    stylesheet: 0,
    image: 0,
    media: 0,
    font: 0,
    script: 0,
    xhr: 0,
    fetch: 0,
    iframe: 0,
    other: 0,
  }
  const responseErrors = []

  page.on("console", (message) => {
    const type = message.type()
    if (type === "error" || type === "warning") {
      consoleMessages.push({
        type,
        text: message.text().slice(0, 800),
      })
    }
  })
  page.on("pageerror", (error) => {
    pageErrors.push(String(error?.message || error).slice(0, 1200))
  })
  page.on("request", (request) => {
    const type = request.resourceType()
    requestCounts.total += 1
    if (Object.hasOwn(requestCounts, type)) {
      requestCounts[type] += 1
    } else {
      requestCounts.other += 1
    }
  })
  page.on("requestfailed", (request) => {
    requestFailures.push({
      type: request.resourceType(),
      url: request.url().slice(0, 500),
      error: request.failure()?.errorText || "unknown",
    })
  })
  page.on("response", (response) => {
    const status = response.status()
    if (status >= 400) {
      responseErrors.push({
        status,
        url: response.url().slice(0, 500),
      })
    }
  })

  await page.addInitScript(() => {
    window.__webkitAuditVitals = {
      lcp: 0,
      lcpSize: 0,
      cls: 0,
      observerErrors: [],
    }
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const last = entries[entries.length - 1]
        if (last) {
          window.__webkitAuditVitals.lcp = last.startTime || 0
          window.__webkitAuditVitals.lcpSize = last.size || 0
        }
      }).observe({ type: "largest-contentful-paint", buffered: true })
    } catch (error) {
      window.__webkitAuditVitals.observerErrors.push(`lcp:${error}`)
    }
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__webkitAuditVitals.cls += entry.value || 0
        }
      }).observe({ type: "layout-shift", buffered: true })
    } catch (error) {
      window.__webkitAuditVitals.observerErrors.push(`cls:${error}`)
    }
  })

  let response = null
  let navigationError = null
  try {
    response = await page.goto(target, {
      waitUntil: "load",
      timeout: 45000,
    })
  } catch (error) {
    navigationError = String(error?.message || error).slice(0, 1500)
  }

  const isKnownMissing = /\/case-studies\/(karuna|rejuve|belly-bar)\/?(?:[?#].*)?$/.test(
    target
  )
  await page.waitForTimeout(isKnownMissing ? 1200 : 4000)
  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ])
    }
  })

  const documentData = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0]
    const paints = performance.getEntriesByType("paint")
    const fcp = paints.find((entry) => entry.name === "first-contentful-paint")
    const resources = performance.getEntriesByType("resource")
    const resourceInitiators = {}
    for (const entry of resources) {
      const key = entry.initiatorType || "other"
      resourceInitiators[key] = (resourceInitiators[key] || 0) + 1
    }

    const images = [...document.images]
    const imageFailures = images
      .filter((image) => image.complete && image.naturalWidth === 0)
      .slice(0, 12)
      .map((image) => ({
        src: (image.currentSrc || image.src || "").slice(0, 500),
        alt: (image.alt || "").slice(0, 200),
      }))
    const lazyPending = images.filter(
      (image) => image.loading === "lazy" && !image.complete
    ).length
    const zeroSizedImages = images.filter((image) => {
      const rect = image.getBoundingClientRect()
      return image.complete && image.naturalWidth > 0 && (rect.width < 1 || rect.height < 1)
    }).length

    const videos = [...document.querySelectorAll("video")]
    const videoDetails = videos.slice(0, 20).map((video) => ({
      src: (video.currentSrc || video.src || "").slice(0, 500),
      poster: (video.poster || "").slice(0, 500),
      readyState: video.readyState,
      networkState: video.networkState,
      paused: video.paused,
      autoplay: video.autoplay,
      muted: video.muted,
      loop: video.loop,
      dimensions: `${video.videoWidth || 0}x${video.videoHeight || 0}`,
      rendered: `${Math.round(video.getBoundingClientRect().width)}x${Math.round(
        video.getBoundingClientRect().height
      )}`,
      error: video.error
        ? {
            code: video.error.code,
            message: video.error.message || "",
          }
        : null,
    }))

    const iframes = [...document.querySelectorAll("iframe")]
    const iframeDetails = iframes.slice(0, 20).map((iframe) => {
      const rect = iframe.getBoundingClientRect()
      return {
        src: (iframe.src || "").slice(0, 500),
        title: (iframe.title || "").slice(0, 200),
        visible: rect.width > 0 && rect.height > 0,
        rendered: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
      }
    })

    const viewportWidth = window.innerWidth
    const overflowElements = [...document.querySelectorAll("body *")]
      .filter((element) => {
        const style = getComputedStyle(element)
        if (style.position === "fixed" && style.pointerEvents === "none") return false
        const rect = element.getBoundingClientRect()
        return rect.right > viewportWidth + 2 || rect.left < -2
      })
      .slice(0, 15)
      .map((element) => {
        const rect = element.getBoundingClientRect()
        return {
          element: `${element.tagName.toLowerCase()}${
            element.id ? `#${element.id}` : ""
          }${
            element.classList.length
              ? `.${[...element.classList].slice(0, 3).join(".")}`
              : ""
          }`.slice(0, 300),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        }
      })

    const vitals = window.__webkitAuditVitals || {}
    return {
      title: document.title,
      canonical:
        document.querySelector('link[rel="canonical"]')?.href || null,
      language: document.documentElement.lang || null,
      textCharacters: (document.body?.innerText || "").trim().length,
      domNodes: document.querySelectorAll("*").length,
      landmarks: {
        main: document.querySelectorAll("main").length,
        header: document.querySelectorAll("header").length,
        nav: document.querySelectorAll("nav").length,
        footer: document.querySelectorAll("footer").length,
        h1: document.querySelectorAll("h1").length,
      },
      timings: nav
        ? {
            ttfb: nav.responseStart,
            domContentLoaded: nav.domContentLoadedEventEnd,
            load: nav.loadEventEnd,
            fcp: fcp?.startTime || null,
            lcp: vitals.lcp || null,
            cls: vitals.cls || 0,
          }
        : null,
      observerErrors: vitals.observerErrors || [],
      navigationTransfer: nav
        ? {
            transferSize: nav.transferSize,
            encodedBodySize: nav.encodedBodySize,
            decodedBodySize: nav.decodedBodySize,
          }
        : null,
      performanceResourceCount: resources.length,
      resourceInitiators,
      images: {
        total: images.length,
        ready: images.filter((image) => image.complete && image.naturalWidth > 0)
          .length,
        failed: imageFailures.length,
        lazyPending,
        zeroSized: zeroSizedImages,
        failures: imageFailures,
      },
      videos: {
        total: videos.length,
        metadataReady: videos.filter((video) => video.readyState >= 1).length,
        frameReady: videos.filter((video) => video.readyState >= 2).length,
        errors: videos.filter((video) => video.error).length,
        autoplayTotal: videos.filter((video) => video.autoplay).length,
        autoplayPlaying: videos.filter(
          (video) => video.autoplay && !video.paused && video.readyState >= 2
        ).length,
        details: videoDetails,
      },
      mediaContracts: {
        videoManager: document.querySelectorAll("[data-casestudy-videomanager]").length,
        lightbox: document.querySelectorAll("[data-casestudy-lightbox]").length,
        controllers: document.querySelectorAll("[data-casestudy-controllers]").length,
      },
      iframes: {
        total: iframes.length,
        visible: iframeDetails.filter((iframe) => iframe.visible).length,
        details: iframeDetails,
      },
      layout: {
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        document: `${document.documentElement.scrollWidth}x${document.documentElement.scrollHeight}`,
        horizontalOverflow:
          document.documentElement.scrollWidth > window.innerWidth + 2,
        overflowAmount: Math.max(
          0,
          document.documentElement.scrollWidth - window.innerWidth
        ),
        overflowElements,
      },
    }
  })

  return {
    requestedUrl: target,
    finalUrl: page.url(),
    status: response?.status() || null,
    responseUrl: response?.url() || null,
    navigationError,
    requestCounts,
    requestFailures,
    responseErrors,
    consoleMessages,
    pageErrors,
    ...documentData,
  }
}
