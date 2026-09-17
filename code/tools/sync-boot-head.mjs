import { readFile, mkdir, writeFile } from "node:fs/promises"
import { runInNewContext } from "node:vm"

// The Framer head entry must precede its SSR page components. Keep its loader
// script identical to the component fallback instead of maintaining two copies.
const component = new URL("../components/PageTransition.tsx", import.meta.url)
const destination = new URL("../mirror/custom-code/Preloaders.html", import.meta.url)
const source = await readFile(component, "utf8")
const start = source.indexOf('const HOME_PATH = "/"')
const end = source.indexOf("function ensureBootViewportStyle()")
if (start < 0 || end <= start) throw new Error("Boot script source markers missing")
const script = runInNewContext(
    `${source.slice(start, end)}\nBOOT_FIRST_PAINT_GUARD_JS`,
    {},
    { timeout: 1000 }
)
// Parse the generated script as well: a quoting error here breaks first paint.
new Function(script)
if (/<\/script/i.test(script)) throw new Error("Unsafe script terminator")
const html = `<link rel="preconnect" href="https://framerusercontent.com" crossorigin>\n\n<script id="mh-head-first-paint-guard">\n${script}\n</script>\n`
await mkdir(new URL(".", destination), { recursive: true })
await writeFile(destination, html)
console.log(`Updated ${destination.pathname} (${html.length} characters)`)
