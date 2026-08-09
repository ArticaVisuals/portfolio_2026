#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, "../..")

const sources = new Map()
const failures = []
let checkCount = 0

function source(relativePath) {
    if (!sources.has(relativePath)) {
        sources.set(
            relativePath,
            fs.readFileSync(path.join(repoRoot, relativePath), "utf8")
        )
    }
    return sources.get(relativePath)
}

function requirePattern(relativePath, label, pattern) {
    checkCount += 1
    if (!pattern.test(source(relativePath))) {
        failures.push(`${relativePath}: ${label}`)
    }
}

function requireCount(relativePath, label, pattern, expected) {
    checkCount += 1
    const matches = source(relativePath).match(pattern) || []
    if (matches.length !== expected) {
        failures.push(
            `${relativePath}: ${label} (expected ${expected}, found ${matches.length})`
        )
    }
}

const playPath = "code/components/Play.tsx"
requirePattern(
    playPath,
    "keeps the desktop Chromium/Arc decoder cap at six",
    /const\s+CHROMIUM_MAX_CONCURRENT_VIDEOS\s*=\s*6\b/
)
requirePattern(
    playPath,
    "keeps the Chromium cap authorable",
    /chromiumMaxConcurrentVideos\?:\s*number/
)
requirePattern(
    playPath,
    "detects desktop Chromium without treating mobile Chrome as desktop",
    /!\s*\/\(\?:Android\|Mobile\|CriOS\|EdgiOS\|OPiOS\)\/\.test\(ua\)/
)
requireCount(
    playPath,
    "applies the Chromium budget during initialization and resize updates",
    /isDesktopChromium\(\)/g,
    2
)
requirePattern(
    playPath,
    "keeps the Chrome Videos property control tied to the protected cap",
    /chromiumMaxConcurrentVideos:\s*\{[\s\S]*?defaultValue:\s*CHROMIUM_MAX_CONCURRENT_VIDEOS/
)

const archivePath = "code/components/ArchivePlayground.tsx"
requirePattern(
    archivePath,
    "keeps video reconciliation outside the frame rate",
    /const\s+VIDEO_RECONCILE_INTERVAL_MS\s*=\s*180\b/
)
requirePattern(
    archivePath,
    "detects drag and throw motion before reallocating videos",
    /const\s+userMotionActive\s*=[\s\S]*?s\.down[\s\S]*?s\.dragging[\s\S]*?Math\.hypot\(s\.vx,\s*s\.vy\)\s*>\s*VIDEO_MOTION_SPEED_THRESHOLD/
)
requirePattern(
    archivePath,
    "detects edge-scroll motion before reallocating videos",
    /Math\.hypot\(s\.edgeX,\s*s\.edgeY\)\s*>\s*VIDEO_EDGE_SCROLL_THRESHOLD/
)
requirePattern(
    archivePath,
    "freezes the active video pool while user motion is active",
    /if\s*\(\s*!\(canAllocateCenterVideos\s*&&\s*userMotionActive\)\s*\)\s*\{[\s\S]*?nextActiveVideoKeys\s*=\s*new Set<string>\(\)/
)
requirePattern(
    archivePath,
    "reconciles center videos only after motion settles",
    /if\s*\(\s*canAllocateCenterVideos\s*&&\s*!userMotionActive\s*\)/
)
requirePattern(
    archivePath,
    "retains already-active videos while their cells remain buffered",
    /\.filter\(\(\{\s*key\s*\}\)\s*=>\s*previousActiveVideoKeys\.has\(key\)\)/
)
requirePattern(
    archivePath,
    "fills only the video slots left vacant after retention",
    /runtime\.videoBudget\s*-\s*nextActiveVideoKeys\.size/
)
requirePattern(
    archivePath,
    "keeps panning on the direct world-layer transform",
    /worldLayer\.style\.transform\s*=\s*`translate3d\(/
)
requirePattern(
    archivePath,
    "limits horizontal coverage clamping to WebKit and keeps Chromium raw",
    /const\s+layerX\s*=\s*webKitRiskRef\.current\s*\?\s*clamp\([\s\S]*?\)\s*:\s*rawLayerX/
)
requirePattern(
    archivePath,
    "limits vertical coverage clamping to WebKit and keeps Chromium raw",
    /const\s+layerY\s*=\s*webKitRiskRef\.current\s*\?\s*clamp\([\s\S]*?\)\s*:\s*rawLayerY/
)
requireCount(
    archivePath,
    "does not introduce another active-video state write path",
    /setActiveVideoKeys/g,
    2
)

for (const relativePath of [
    "code/components/ParagraphPrettyWrap.tsx",
    "code/components/ResumeAssetHost.tsx",
]) {
    requirePattern(
        relativePath,
        "keeps the Play root selector available to both observer paths",
        /const\s+PLAYGROUND_ROOT_SELECTOR\s*=\s*"\[data-playground-root='true'\]"/
    )
    requirePattern(
        relativePath,
        "keeps the pre-hydration Play style-mutation exclusion",
        /function ignoredPlayStyle\(mutation\)[\s\S]*?mutation\.attributeName==="style"[\s\S]*?target\.closest\(PLAY\)/
    )
    requirePattern(
        relativePath,
        "keeps the hydrated Play style-mutation exclusion",
        /function\s+isIgnoredPlayStyleMutation\(mutation:\s*MutationRecord\)[\s\S]*?mutation\.attributeName\s*!==\s*"style"[\s\S]*?target\.closest\(PLAYGROUND_ROOT_SELECTOR\)/
    )
    requirePattern(
        relativePath,
        "short-circuits batches containing only ignored Play style mutations",
        /mutations\.every\(isIgnoredPlayStyleMutation\)/
    )
}

if (failures.length > 0) {
    console.error("Play panning performance guard failed:")
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
}

console.log(`Play panning performance guard passed (${checkCount} checks).`)
