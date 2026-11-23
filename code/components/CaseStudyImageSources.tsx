// Framer scales the longest edge. Width descriptors must match the delivered pixels.
export function caseStudyImageSrcSet(src: string): string | undefined {
    if (!src.startsWith("https://framerusercontent.com/images/")) return
    const url = new URL(src)
    const width = Number(url.searchParams.get("width"))
    const height = Number(url.searchParams.get("height"))
    if (!width || !height || !/\.(jpe?g|png)$/i.test(url.pathname)) return
    const longEdge = Math.max(width, height)
    const candidates: string[] = []
    for (const edge of [480, 800, 1200, 1800, 2400]) {
        if (edge >= longEdge) break
        url.searchParams.set("scale-down-to", String(edge))
        candidates.push(`${url.href} ${Math.round(edge * width / longEdge)}w`)
    }
    candidates.push(`${src} ${width}w`)
    return candidates.join(", ")
}
