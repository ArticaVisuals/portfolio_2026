async (page) => {
  const before = await page.evaluate(() => {
    const videos = [...document.querySelectorAll("video")]
    return {
      total: videos.length,
      autoplay: videos.filter((video) => video.autoplay).length,
      playing: videos.filter((video) => !video.paused && video.readyState >= 2).length,
    }
  })

  const targetIndex = await page.evaluate(() => {
    const videos = [...document.querySelectorAll("video")]
    const index = videos.findIndex((video) => video.autoplay && video.paused)
    if (index >= 0) {
      videos[index].scrollIntoView({ block: "center" })
    }
    return index
  })

  await page.waitForTimeout(1800)
  const after = await page.evaluate((index) => {
    const videos = [...document.querySelectorAll("video")]
    const target = videos[index]
    return {
      total: videos.length,
      autoplay: videos.filter((video) => video.autoplay).length,
      playing: videos.filter((video) => !video.paused && video.readyState >= 2).length,
      target: target
        ? {
            paused: target.paused,
            readyState: target.readyState,
            error: target.error?.message || null,
            src: target.currentSrc || target.src,
          }
        : null,
    }
  }, targetIndex)

  return { before, targetIndex, after }
}
