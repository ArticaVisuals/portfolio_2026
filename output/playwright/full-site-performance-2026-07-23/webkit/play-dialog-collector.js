async (page) => {
  return await page.evaluate(() => {
    const dialog = document.querySelector("[role=dialog]")
    const video = dialog?.querySelector("video")
    const image = dialog?.querySelector("img")
    const videoRect = video?.getBoundingClientRect()
    const imageRect = image?.getBoundingClientRect()
    return {
      dialog: Boolean(dialog),
      title: dialog?.querySelector("h2")?.textContent || null,
      video: video
        ? {
            src: video.currentSrc || video.src,
            readyState: video.readyState,
            paused: video.paused,
            error: video.error?.message || null,
            dimensions: `${video.videoWidth}x${video.videoHeight}`,
            rendered: `${Math.round(videoRect.width)}x${Math.round(videoRect.height)}`,
          }
        : null,
      image: image
        ? {
            src: image.currentSrc || image.src,
            ready: image.complete && image.naturalWidth > 0,
            natural: `${image.naturalWidth}x${image.naturalHeight}`,
            rendered: `${Math.round(imageRect.width)}x${Math.round(imageRect.height)}`,
          }
        : null,
    }
  })
}
