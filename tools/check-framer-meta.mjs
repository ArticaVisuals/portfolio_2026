#!/usr/bin/env node

const urls = process.argv.slice(2)

if (urls.length === 0) {
  console.error("Usage: node tools/check-framer-meta.mjs <url> [url...]")
  process.exit(1)
}

function firstMatch(html, patterns) {
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) return decodeEntities(match[1].trim())
  }
  return ""
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

function metaPatterns(attribute, value) {
  return [
    new RegExp(
      `<meta\\s+${attribute}=["']${value}["']\\s+content=["']([^"']*)`,
      "i"
    ),
    new RegExp(
      `<meta\\s+content=["']([^"']*)["']\\s+${attribute}=["']${value}["']`,
      "i"
    ),
    new RegExp(
      `<meta(?=[^>]*${attribute}=["']${value}["'])(?=[^>]*content=["']([^"']*)["'])[^>]*>`,
      "i"
    ),
  ]
}

for (const url of urls) {
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "codex-framer-meta-check/1.0",
      },
    })

    if (!response.ok) {
      console.log(JSON.stringify({ url, status: response.status }, null, 2))
      continue
    }

    const html = await response.text()
    const result = {
      url,
      title: firstMatch(html, [/<title>([\s\S]*?)<\/title>/i]),
      description: firstMatch(html, metaPatterns("name", "description")),
      ogTitle: firstMatch(html, metaPatterns("property", "og:title")),
      ogDescription: firstMatch(html, metaPatterns("property", "og:description")),
      ogImage: firstMatch(html, metaPatterns("property", "og:image")),
      twitterTitle: firstMatch(html, metaPatterns("name", "twitter:title")),
      twitterDescription: firstMatch(
        html,
        metaPatterns("name", "twitter:description")
      ),
      twitterImage: firstMatch(html, metaPatterns("name", "twitter:image")),
    }

    console.log(JSON.stringify(result, null, 2))
  } catch (error) {
    console.log(
      JSON.stringify(
        {
          url,
          error: error instanceof Error ? error.message : String(error),
        },
        null,
        2
      )
    )
  }
}
