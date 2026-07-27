import { execFile } from "node:child_process"
import { promisify } from "node:util"
import fs from "node:fs"
import path from "node:path"

const exec = promisify(execFile)
const cwd = process.cwd()
const route = process.argv[2]
const outputFile = process.argv[3]
if (!route || !outputFile) {
    throw new Error("Usage: node rerun-route.mjs <route> <output-file>")
}

const pwcli =
    "/Users/micahhoang/.codex/skills/playwright/scripts/playwright_cli.sh"
const auditScript = path.join(cwd, "audit-route.js")
const session = `full-site-perf-rerun-${Date.now()}`
const target = `https://micahhoang.com${route}`
const command = (args, timeout = 150000) =>
    exec(pwcli, args, {
        cwd,
        timeout,
        maxBuffer: 50 * 1024 * 1024,
    })

try {
    await command([
        "--session",
        session,
        "open",
        `about:blank#${encodeURIComponent(target)}`,
        "--browser",
        "chrome",
    ])
    const { stdout } = await command([
        "--raw",
        "--session",
        session,
        "run-code",
        "--filename",
        auditScript,
    ])
    const result = JSON.parse(stdout.trim())
    result.route = route
    result.artifactSlug = outputFile.replace(/^\d+-|\.json$/g, "")
    fs.writeFileSync(
        path.join(cwd, outputFile),
        `${JSON.stringify(result, null, 2)}\n`
    )
    process.stdout.write(
        `${route}: status ${result.status}, ${Math.round((result.network?.totalBytes || 0) / 1024)} KiB\n`
    )
} finally {
    try {
        await command(["--session", session, "close"], 30000)
    } catch {}
}
