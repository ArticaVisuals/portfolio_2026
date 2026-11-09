#!/usr/bin/env node
// Builds the Micah Hoang design system from its two sources of truth:
//   tokens/tokens.json  -> tokens/tokens.css
//   content/**/*.md     -> site/**/*.html, llms.txt, llms-full.txt, components.json
// No dependencies. Run from anywhere: `node code/design-system/build.mjs`.

import { readFileSync, writeFileSync, readdirSync, mkdirSync, statSync } from "node:fs"
import { join, dirname, relative, basename } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = dirname(fileURLToPath(import.meta.url))
const CONTENT = join(ROOT, "content")
const SITE = join(ROOT, "site")
const SECTIONS = ["Foundations", "Components", "Patterns"]
const BREAKPOINTS = { tablet: "(max-width: 1199px)", mobile: "(max-width: 809px)" }

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

const tokens = JSON.parse(readFileSync(join(ROOT, "tokens/tokens.json"), "utf8"))

const refToVar = (value) =>
    typeof value === "string"
        ? value.replace(/\{([^}]+)\}/g, (_, path) => `var(${pathToVar(path)})`)
        : value

function pathToVar(path) {
    const p = path.split(".")
    if (p[0] === "color" && p[1] === "primitive") return `--mh-color-${p[2]}`
    if (p[0] === "font" && p[1] === "family") return `--mh-font-${p[2]}`
    return `--mh-${p.join("-")}`
}

const fontStack = (list) => list.map((f) => (/[\s]/.test(f) && !/^ui-|serif$|monospace$/.test(f) ? `"${f}"` : f)).join(", ")

function buildTokensCss() {
    const root = []
    const tablet = []
    const mobile = []
    const t = tokens

    root.push("  /* Primitive colors: reference these only through the semantic roles below. */")
    for (const [k, v] of Object.entries(t.color.primitive)) if (!k.startsWith("$")) root.push(`  --mh-color-${k}: ${v.$value};`)

    const surfaceBlock = (name) => {
        const out = []
        for (const [group, roles] of Object.entries(t.color[name])) {
            if (group.startsWith("$")) continue
            for (const [role, v] of Object.entries(roles)) out.push(`  --mh-${group}-${role}: ${refToVar(v.$value)};`)
        }
        return out
    }

    root.push("", "  /* Fonts */")
    for (const [k, v] of Object.entries(t.font.family)) if (!k.startsWith("$")) root.push(`  --mh-font-${k}: ${fontStack(v.$value)};`)
    for (const [k, v] of Object.entries(t.font.weight)) if (!k.startsWith("$")) root.push(`  --mh-weight-${k}: ${v.$value};`)

    root.push("", "  /* Type styles: desktop values here, tablet/mobile overrides in media queries below. */")
    for (const [name, style] of Object.entries(t.type)) {
        if (name.startsWith("$")) continue
        const v = style.$value
        root.push(`  --mh-type-${name}-family: ${refToVar(v.fontFamily)};`)
        root.push(`  --mh-type-${name}-weight: ${v.fontWeight};`)
        for (const [prop, cssName] of [["fontSize", "size"], ["lineHeight", "leading"], ["letterSpacing", "tracking"]]) {
            const val = v[prop]
            if (val && typeof val === "object") {
                root.push(`  --mh-type-${name}-${cssName}: ${val.desktop};`)
                if (val.tablet !== val.desktop) tablet.push(`    --mh-type-${name}-${cssName}: ${val.tablet};`)
                if (val.mobile !== val.tablet) mobile.push(`    --mh-type-${name}-${cssName}: ${val.mobile};`)
            } else if (val !== undefined) {
                root.push(`  --mh-type-${name}-${cssName}: ${val};`)
            }
        }
        root.push(`  --mh-type-${name}-case: ${v.textTransform || "none"};`)
    }

    root.push("", "  /* Space scale */")
    for (const [k, v] of Object.entries(t.space)) if (!k.startsWith("$")) root.push(`  --mh-space-${k}: ${v.$value};`)

    root.push("", "  /* Layout */")
    for (const [k, v] of Object.entries(t.layout)) {
        if (k.startsWith("$")) continue
        if (typeof v.$value === "object") {
            root.push(`  --mh-${k}: ${v.$value.desktop};`)
            if (v.$value.tablet !== v.$value.desktop) tablet.push(`    --mh-${k}: ${v.$value.tablet};`)
            if (v.$value.mobile !== v.$value.tablet) mobile.push(`    --mh-${k}: ${v.$value.mobile};`)
        } else root.push(`  --mh-${k}: ${v.$value};`)
    }

    root.push("", "  /* Shape */")
    for (const [k, v] of Object.entries(t.radius)) if (!k.startsWith("$")) root.push(`  --mh-radius-${k}: ${v.$value};`)
    for (const [k, v] of Object.entries(t.border)) if (!k.startsWith("$")) root.push(`  --mh-border-${k}: ${v.$value};`)
    root.push(`  --mh-elevation-none: none;`)

    root.push("", "  /* Motion */")
    for (const [k, v] of Object.entries(t.motion.ease)) if (!k.startsWith("$")) root.push(`  --mh-ease-${k}: cubic-bezier(${v.$value.join(", ")});`)
    for (const [k, v] of Object.entries(t.motion.duration)) if (!k.startsWith("$")) root.push(`  --mh-duration-${k}: ${v.$value};`)
    for (const [k, v] of Object.entries(t.motion.stagger)) if (!k.startsWith("$")) root.push(`  --mh-stagger-${k}: ${v.$value};`)
    for (const [k, v] of Object.entries(t.motion.distance)) if (!k.startsWith("$")) root.push(`  --mh-distance-${k}: ${v.$value};`)
    root.push(`  --mh-scale-hover: ${t.motion.scale.hover.$value};`)
    root.push("", "  /* Springs (new gesture UI only; read by JS spring libraries) */")
    for (const [k, v] of Object.entries(t.motion.spring)) {
        if (k.startsWith("$")) continue
        root.push(`  --mh-spring-${k}-damping: ${v.$value.damping};`, `  --mh-spring-${k}-response: ${v.$value.response}s;`)
    }
    for (const [k, v] of Object.entries(t.motion.gesture)) if (!k.startsWith("$")) root.push(`  --mh-gesture-${k}: ${v.$value};`)

    root.push("", "  /* Texture */")
    for (const [k, v] of Object.entries(t.texture.grain)) root.push(`  --mh-grain-${k}: ${refToVar(v.$value)};`)

    root.push("", "  /* Stacking */")
    for (const [k, v] of Object.entries(t.z)) if (!k.startsWith("$")) root.push(`  --mh-z-${k}: ${v.$value};`)

    const css = [
        "/* GENERATED by build.mjs from tokens/tokens.json. Do not edit by hand. */",
        "",
        ":root {",
        ...root,
        "}",
        "",
        "/* Surfaces. Cream is the default; add data-surface=\"green\" to invert any block. */",
        ":root,",
        '[data-surface="cream"] {',
        ...surfaceBlock("cream"),
        "}",
        "",
        '[data-surface="green"] {',
        ...surfaceBlock("green"),
        "}",
        "",
        `@media ${BREAKPOINTS.tablet} {`,
        "  :root {",
        ...tablet,
        "  }",
        "}",
        "",
        `@media ${BREAKPOINTS.mobile} {`,
        "  :root {",
        ...mobile,
        "  }",
        "}",
        "",
    ].join("\n")
    writeFileSync(join(ROOT, "tokens/tokens.css"), css)
}

// One utility class per type style, so markup can say `mh-text-heading`
// instead of restating five properties.
function buildTypeCss() {
    const out = ["/* GENERATED by build.mjs from tokens/tokens.json. Do not edit by hand. */", ""]
    for (const name of Object.keys(tokens.type)) {
        if (name.startsWith("$")) continue
        out.push(
            `.mh-text-${name} {`,
            `    font-family: var(--mh-type-${name}-family);`,
            `    font-weight: var(--mh-type-${name}-weight);`,
            `    font-size: var(--mh-type-${name}-size);`,
            `    line-height: var(--mh-type-${name}-leading);`,
            `    letter-spacing: var(--mh-type-${name}-tracking);`,
            `    text-transform: var(--mh-type-${name}-case);`,
            `}`,
            "",
        )
    }
    writeFileSync(join(ROOT, "css/type.css"), out.join("\n"))
}

// ---------------------------------------------------------------------------
// Markdown (a deliberately small subset: what content/ uses, nothing more)
// ---------------------------------------------------------------------------

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const slugify = (s) => s.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

function inline(text) {
    const codes = []
    let s = text.replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(c) - 1}\u0000`)
    s = esc(s)
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
        // content/ and site/ mirror each other, so page links swap .md for .html;
        // root files (agents.md, README.md) sit one level up from both and stay as-is.
        const h = /(^|\/)(agents|README)\.md$/.test(href) ? href : href.replace(/\.md(#|$)/, ".html$1")
        const ext = /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : ""
        return `<a href="${h}"${ext}>${label}</a>`
    })
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>")
    return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[+i])}</code>`)
}

function parseFrontMatter(src) {
    const m = src.match(/^---\n([\s\S]*?)\n---\n?/)
    if (!m) return { data: {}, body: src }
    const data = {}
    for (const line of m[1].split("\n")) {
        const kv = line.match(/^([\w-]+):\s*(.*)$/)
        if (!kv) continue
        let v = kv[2].trim()
        if (/^\[.*\]$/.test(v)) v = v.slice(1, -1).split(",").map((x) => x.trim().replace(/^"|"$/g, "")).filter(Boolean)
        else v = v.replace(/^"|"$/g, "")
        data[kv[1]] = v
    }
    return { data, body: src.slice(m[0].length) }
}

function renderMarkdown(body, ctx) {
    const lines = body.split("\n")
    const out = []
    const toc = []
    let i = 0
    let exampleCount = 0
    const para = []
    const flush = () => {
        if (para.length) out.push(`<p>${inline(para.join(" "))}</p>`)
        para.length = 0
    }

    while (i < lines.length) {
        const line = lines[i]

        const fence = line.match(/^```(\w*)\s*(.*)$/)
        if (fence) {
            flush()
            const lang = fence[1]
            const meta = fence[2]
            const code = []
            i++
            while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++])
            i++
            const src = code.join("\n")
            if (lang === "html" && /\bexample\b/.test(meta)) {
                const surface = (meta.match(/surface=(\w+)/) || [])[1] || "cream"
                const pad = /\bbleed\b/.test(meta) ? " ds-preview--bleed" : ""
                const id = `ex-${++exampleCount}`
                out.push(
                    `<figure class="ds-example" id="${id}">` +
                        `<div class="ds-example__bar"><span>Example ${exampleCount}</span>` +
                        `<div class="ds-example__surfaces" role="group" aria-label="Preview surface">` +
                        `<button type="button" data-set-surface="cream" aria-pressed="${surface === "cream"}">Cream</button>` +
                        `<button type="button" data-set-surface="green" aria-pressed="${surface === "green"}">Green</button>` +
                        `</div></div>` +
                        `<div class="ds-preview${pad}" data-surface="${surface}">${src}</div>` +
                        `<details class="ds-code"><summary>Code</summary><button type="button" class="ds-copy">Copy</button><pre><code class="language-html">${esc(src)}</code></pre></details>` +
                        `</figure>`,
                )
            } else {
                out.push(`<div class="ds-codeblock"><button type="button" class="ds-copy">Copy</button><pre><code class="language-${lang || "text"}">${esc(src)}</code></pre></div>`)
            }
            continue
        }

        const directive = line.match(/^<!--\s*ds:([\w-]+)\s*(.*?)\s*-->$/)
        if (directive) {
            flush()
            out.push(renderDirective(directive[1], directive[2]))
            i++
            continue
        }

        const h = line.match(/^(#{1,4})\s+(.*)$/)
        if (h) {
            flush()
            const level = h[1].length
            if (level === 1) {
                i++
                continue // the page title comes from front matter
            }
            const id = slugify(h[2])
            if (level === 2) toc.push({ id, text: h[2] })
            out.push(`<h${level} id="${id}"><a class="ds-anchor" href="#${id}">${inline(h[2])}</a></h${level}>`)
            i++
            continue
        }

        if (/^\|.*\|\s*$/.test(line)) {
            flush()
            const rows = []
            while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) rows.push(lines[i++])
            const cells = (r) => r.trim().slice(1, -1).split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, "|"))
            const head = cells(rows[0])
            const bodyRows = rows.slice(2).map(cells)
            out.push(
                `<div class="ds-table"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>` +
                    bodyRows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("") +
                    `</tbody></table></div>`,
            )
            continue
        }

        if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
            flush()
            const ordered = /^\s*\d+\./.test(line)
            const items = []
            while (i < lines.length && (/^\s*[-*]\s+/.test(lines[i]) || /^\s*\d+\.\s+/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
                if (/^\s{2,}\S/.test(lines[i]) && !/^\s*([-*]|\d+\.)\s+/.test(lines[i])) items[items.length - 1] += " " + lines[i].trim()
                else items.push(lines[i].replace(/^\s*([-*]|\d+\.)\s+/, ""))
                i++
            }
            const tag = ordered ? "ol" : "ul"
            out.push(`<${tag}>${items.map((it) => `<li>${inline(it)}</li>`).join("")}</${tag}>`)
            continue
        }

        if (/^>\s?/.test(line)) {
            flush()
            const q = []
            while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ""))
            out.push(`<blockquote>${inline(q.join(" "))}</blockquote>`)
            continue
        }

        if (/^---\s*$/.test(line)) {
            flush()
            out.push('<hr class="mh-rule">')
            i++
            continue
        }

        if (!line.trim()) {
            flush()
            i++
            continue
        }

        para.push(line.trim())
        i++
    }
    flush()
    return { html: out.join("\n"), toc }
}

// Directives render token-driven visuals in the HTML site only. In markdown they
// are HTML comments, so agents read the token tables instead of preview markup.
function renderDirective(name, args) {
    const t = tokens
    if (name === "swatches") {
        const group = args.trim() || "primitive"
        if (group === "primitive") {
            return `<div class="ds-swatches">${Object.entries(t.color.primitive)
                .filter(([k]) => !k.startsWith("$"))
                .map(([k, v]) => `<div class="ds-swatch"><div class="ds-swatch__chip" style="background:var(--mh-color-${k})"></div><div class="ds-swatch__meta"><span class="mh-label">${k.replace(/-/g, " ")}</span><code>${v.$value}</code><code>--mh-color-${k}</code></div></div>`)
                .join("")}</div>`
        }
        const roles = []
        for (const [g, rs] of Object.entries(t.color.cream)) {
            if (g.startsWith("$")) continue
            for (const r of Object.keys(rs)) roles.push(`${g}-${r}`)
        }
        const col = (surface) =>
            `<div class="ds-roles" data-surface="${surface}"><span class="mh-label ds-roles__title">${surface} surface</span>${roles
                .map((r) => `<div class="ds-role"><div class="ds-role__chip" style="background:var(--mh-${r})"></div><code>--mh-${r}</code></div>`)
                .join("")}</div>`
        return `<div class="ds-roles-wrap">${col("cream")}${col("green")}</div>`
    }
    if (name === "type-specimens") {
        return `<div class="ds-specimens">${Object.entries(t.type)
            .filter(([k]) => !k.startsWith("$"))
            .map(([k, v]) => {
                const sample = k.startsWith("label") ? "Selected work / 2026" : k.startsWith("display") ? "Micah Hoang" : k === "title" ? "AirPods Pro 3" : k === "heading" ? "Brand designer with a systems mind." : "A photograph becomes a data point. A data point becomes a record."
                const size = typeof v.$value.fontSize === "object" ? Object.values(v.$value.fontSize).join(" / ") : v.$value.fontSize
                return `<div class="ds-specimen"><div class="ds-specimen__meta"><span class="mh-label">${k}</span><span class="mh-label mh-text-muted">${size} · ${v.$value.fontWeight}</span></div><div class="mh-text-${k} ds-specimen__sample">${sample}</div></div>`
            })
            .join("")}</div>`
    }
    if (name === "space-scale") {
        return `<div class="ds-space">${Object.entries(t.space)
            .filter(([k]) => !k.startsWith("$"))
            .map(([k, v]) => `<div class="ds-space__row"><code>--mh-space-${k}</code><span class="mh-label">${v.$value}</span><span class="ds-space__bar" style="width:${v.$value}"></span></div>`)
            .join("")}</div>`
    }
    if (name === "easing") {
        return `<div class="ds-ease">${Object.entries(t.motion.ease)
            .filter(([k]) => !k.startsWith("$"))
            .map(([k, v]) => `<button type="button" class="ds-ease__row" data-ease="${k}"><span class="mh-label">${k}</span><code>cubic-bezier(${v.$value.join(", ")})</code><span class="ds-ease__track"><span class="ds-ease__dot" style="transition-timing-function:var(--mh-ease-${k})"></span></span></button>`)
            .join("")}<p class="mh-label mh-text-muted">Click a row to play it at 900ms.</p></div>`
    }
    return `<!-- unknown directive ${esc(name)} -->`
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

function walk(dir) {
    return readdirSync(dir).flatMap((f) => {
        const p = join(dir, f)
        return statSync(p).isDirectory() ? walk(p) : f.endsWith(".md") ? [p] : []
    })
}

const pages = walk(CONTENT)
    .map((file) => {
        const src = readFileSync(file, "utf8")
        const { data, body } = parseFrontMatter(src)
        const rel = relative(CONTENT, file).replace(/\\/g, "/")
        return { file, rel, src, body, data, htmlPath: rel.replace(/\.md$/, ".html"), slug: basename(rel, ".md") }
    })
    .sort((a, b) => SECTIONS.indexOf(a.data.section) - SECTIONS.indexOf(b.data.section) || (+a.data.order || 99) - (+b.data.order || 99) || a.data.title.localeCompare(b.data.title))

for (const p of pages) for (const key of ["title", "section", "description"]) if (!p.data[key]) throw new Error(`${p.rel}: front matter is missing "${key}"`)

function nav(current, prefix) {
    const overview = pages.find((p) => p.rel === "index.md")
    const parts = [`<a class="ds-nav__link${current === overview ? " is-current" : ""}" href="${prefix}index.html">Overview</a>`]
    for (const section of SECTIONS) {
        const items = pages.filter((p) => p.data.section === section)
        if (!items.length) continue
        parts.push(`<p class="ds-nav__section mh-label">${section}</p>`)
        for (const p of items) parts.push(`<a class="ds-nav__link${p === current ? " is-current" : ""}" href="${prefix}${p.htmlPath}">${p.data.title}</a>`)
    }
    parts.push(`<p class="ds-nav__section mh-label">For agents</p>`)
    for (const [label, href] of [["agents.md", "agents.md"], ["llms.txt", "llms.txt"], ["llms-full.txt", "llms-full.txt"], ["components.json", "components.json"], ["tokens.json", "tokens/tokens.json"]])
        parts.push(`<a class="ds-nav__link ds-nav__link--file" href="${prefix}../${href}">${label}</a>`)
    return parts.join("\n")
}

function pageHtml(page) {
    const depth = page.htmlPath.split("/").length - 1
    const prefix = "../".repeat(depth) // to site/
    const root = prefix + "../" // to design-system/
    const { html, toc } = renderMarkdown(page.body, page)
    const d = page.data
    const meta = []
    if (d.status) meta.push(`<span class="mh-tag" data-size="sm">${d.status}</span>`)
    if (d.framer) meta.push(`<span class="mh-label mh-text-muted">Framer: ${esc(d.framer)}</span>`)
    const tocHtml = toc.length > 1 ? `<nav class="ds-toc" aria-label="On this page"><p class="mh-label mh-text-muted">On this page</p>${toc.map((t) => `<a href="#${t.id}">${inline(t.text)}</a>`).join("")}</nav>` : ""

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(d.title)} – Micah Hoang Design System</title>
<meta name="description" content="${esc(d.description)}">
<link rel="alternate" type="text/markdown" href="${root}content/${page.rel}">
<link rel="stylesheet" href="${root}css/fonts.css">
<link rel="stylesheet" href="${root}tokens/tokens.css">
<link rel="stylesheet" href="${root}css/type.css">
<link rel="stylesheet" href="${root}css/base.css">
<link rel="stylesheet" href="${root}css/components.css">
<link rel="stylesheet" href="${prefix}assets/docs.css">
</head>
<body data-surface="cream" class="ds-body">
<a class="ds-skip mh-label" href="#main">Skip to content</a>
<header class="ds-header">
  <button type="button" class="ds-menu mh-label" aria-expanded="false" aria-controls="ds-sidebar">Menu</button>
  <a class="ds-brand mh-label" href="${prefix}index.html">Micah Hoang <span class="mh-text-muted">/ Design System</span></a>
  <label class="ds-search"><span class="ds-visually-hidden">Search</span><input type="search" placeholder="Search" autocomplete="off" data-ds-search><kbd class="mh-label">⌘K</kbd></label>
  <div class="ds-search-results" data-ds-results hidden></div>
  <button type="button" class="ds-theme mh-label" data-ds-theme aria-pressed="false">Green</button>
  <a class="ds-live mh-label" href="https://micahhoang.com" target="_blank" rel="noopener">micahhoang.com ↗</a>
</header>
<div class="ds-shell">
  <aside class="ds-sidebar" id="ds-sidebar"><nav class="ds-nav" aria-label="Design system">${nav(page, prefix)}</nav></aside>
  <main class="ds-main" id="main">
    <header class="ds-page-head">
      <p class="mh-label mh-text-muted">${d.section === "Overview" ? "Micah Hoang" : d.section}</p>
      <div class="ds-page-head__row">
        <h1 class="mh-text-display-m">${esc(d.title)}</h1>
        <a class="mh-action" data-variant="pill" href="${root}content/${page.rel}" title="This page as markdown, for agents">Markdown</a>
      </div>
      <p class="ds-lede mh-text-heading">${inline(d.description)}</p>
      ${meta.length ? `<div class="ds-page-meta">${meta.join("")}</div>` : ""}
      <hr class="mh-rule">
    </header>
    <article class="ds-prose">${html}</article>
    <footer class="ds-page-foot"><span class="mh-label mh-text-muted">Source: content/${page.rel}</span><span class="mh-label mh-text-muted">©2026</span></footer>
  </main>
  ${tocHtml}
</div>
<script src="${prefix}assets/search-index.js"></script>
<script src="${root}js/components.js"></script>
<script src="${prefix}assets/docs.js"></script>
</body>
</html>
`
}

// ---------------------------------------------------------------------------
// Agent artifacts
// ---------------------------------------------------------------------------

const stripDirectives = (s) => s.replace(/^<!--\s*ds:.*-->\s*$/gm, "").replace(/\n{3,}/g, "\n\n")

function buildLlms() {
    const lines = [
        "# Micah Hoang Design System",
        "",
        "> The brand foundations, components and page patterns behind micahhoang.com: a brand designer's portfolio built in Framer. Cream and Forest Green, GT Standard and GT Standard Mono, flat surfaces, 1px rules, quiet motion.",
        "",
        "Every page is plain markdown under `content/`. Read `agents.md` first. Tokens live in `tokens/tokens.json` (CSS: `tokens/tokens.css`). A machine-readable component manifest is in `components.json`. The whole system in one file: `llms-full.txt`.",
        "",
    ]
    for (const section of ["Overview", ...SECTIONS]) {
        const items = pages.filter((p) => p.data.section === section)
        if (!items.length) continue
        lines.push(`## ${section}`, "")
        for (const p of items) lines.push(`- [${p.data.title}](content/${p.rel}): ${p.data.description}`)
        lines.push("")
    }
    writeFileSync(join(ROOT, "llms.txt"), lines.join("\n"))

    const full = [readFileSync(join(ROOT, "agents.md"), "utf8").trim(), ""]
    for (const p of pages) full.push("", "---", "", `<!-- content/${p.rel} -->`, "", stripDirectives(p.src).trim())
    full.push("", "---", "", "<!-- tokens/tokens.json -->", "", "```json", readFileSync(join(ROOT, "tokens/tokens.json"), "utf8").trim(), "```", "")
    writeFileSync(join(ROOT, "llms-full.txt"), full.join("\n"))
}

function buildManifest() {
    const list = (v) => (Array.isArray(v) ? v : v ? [v] : [])
    const manifest = {
        $description: "Generated by build.mjs from content/**/*.md front matter. One entry per documented page. Read the `doc` file before using a component.",
        name: "Micah Hoang Design System",
        site: "https://micahhoang.com",
        css: ["css/fonts.css", "tokens/tokens.css", "css/type.css", "css/base.css", "css/components.css"],
        js: "js/components.js",
        surfaces: ["cream", "green"],
        breakpoints: { desktop: ">=1200px", tablet: "810-1199px", mobile: "<810px" },
        pages: pages
            .filter((p) => p.data.section !== "Overview")
            .map((p) => ({
                title: p.data.title,
                slug: p.slug,
                section: p.data.section,
                description: p.data.description,
                status: p.data.status || null,
                doc: `content/${p.rel}`,
                classes: list(p.data.classes),
                tokens: list(p.data.tokens),
                framer: p.data.framer || null,
                codeFileId: p.data.codeFileId || null,
            })),
    }
    writeFileSync(join(ROOT, "components.json"), JSON.stringify(manifest, null, 2) + "\n")
}

function buildSearchIndex() {
    const idx = pages.map((p) => ({ t: p.data.title, s: p.data.section, d: p.data.description, h: p.htmlPath }))
    mkdirSync(join(SITE, "assets"), { recursive: true })
    writeFileSync(join(SITE, "assets/search-index.js"), `/* GENERATED by build.mjs */\nwindow.DS_INDEX = ${JSON.stringify(idx)};\n`)
}

// ---------------------------------------------------------------------------

buildTokensCss()
buildTypeCss()
for (const p of pages) {
    const out = join(SITE, p.htmlPath)
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, pageHtml(p))
}
buildSearchIndex()
buildLlms()
buildManifest()
console.log(`Built ${pages.length} pages, tokens.css, type.css, llms.txt, llms-full.txt, components.json`)
