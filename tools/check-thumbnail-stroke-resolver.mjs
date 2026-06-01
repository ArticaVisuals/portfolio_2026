#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const helperPath = path.resolve(scriptDir, "../CaseStudyThumbnailStrokeStyles.tsx")
const source = fs.readFileSync(helperPath, "utf8")

const requiredPatterns = [
    ["default stroke color stays #979797", /DEFAULT_STROKE_COLOR\s*=\s*["']#979797["']/],
    ["uses the Thumbnail Stroke CMS field", /strokeFieldId\s*=\s*["']OHdUYs6Mo["']/],
    ["defines the shared CMS collection resolver", /function\s+getCMSCollection\s*\(/],
    ["keeps the legacy module.a fallback", /module\.a/],
    ["keeps the current module.r CMS export path", /module\.r/],
    ["scans object exports for Framer CMS collection shape", /Object\.values\(module\)/],
    [
        "checks the scanItems collection API",
        /collectionByLocaleId\?\.default\?\.scanItems/,
    ],
    ["uses the resolver in loadStrokeRecords", /const\s+collection\s*=\s*getCMSCollection\(module\)/],
]

const failures = requiredPatterns
    .filter(([, pattern]) => !pattern.test(source))
    .map(([label]) => label)

const legacyOnlyLookup =
    /const\s+collection\s*=\s*module\.a\?\.collectionByLocaleId\?\.default/

if (legacyOnlyLookup.test(source)) {
    failures.push("must not use module.a-only collection lookup")
}

if (failures.length > 0) {
    console.error("Thumbnail stroke CMS resolver guard failed:")
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
}

console.log("Thumbnail stroke CMS resolver guard passed.")
