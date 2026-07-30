#!/usr/bin/env node

const urls = process.argv.slice(2)

if (urls.length === 0) {
  console.error("Usage: node code/tools/check-framer-meta.mjs <url> [url...]")
  process.exit(1)
}

function firstMatch(html, patterns) {
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) return decodeEntities(match[1].trim())
  }
  return ""
}

function attributesFromTag(tag) {
  const attributes = {}
  const pattern = /([:@\w-]+)\s*=\s*(["'])([\s\S]*?)\2/g
  let match

  while ((match = pattern.exec(tag))) {
    attributes[match[1].toLowerCase()] = decodeEntities(match[3].trim())
  }

  return attributes
}

function metaContent(html, attribute, value) {
  const normalizedAttribute = attribute.toLowerCase()
  const normalizedValue = value.toLowerCase()

  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = attributesFromTag(match[0])
    if (
      attributes[normalizedAttribute]?.toLowerCase() === normalizedValue &&
      attributes.content
    ) {
      return attributes.content
    }
  }

  return ""
}

function canonicalHref(html) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const attributes = attributesFromTag(match[0])
    const relationships = (attributes.rel || "")
      .toLowerCase()
      .split(/\s+/)

    if (relationships.includes("canonical") && attributes.href) {
      return attributes.href
    }
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
      status: response.status,
      canonical: canonicalHref(html),
      robots: metaContent(html, "name", "robots"),
      title: firstMatch(html, [/<title>([\s\S]*?)<\/title>/i]),
      description: metaContent(html, "name", "description"),
      ogType: metaContent(html, "property", "og:type"),
      ogUrl: metaContent(html, "property", "og:url"),
      ogTitle: metaContent(html, "property", "og:title"),
      ogDescription: metaContent(html, "property", "og:description"),
      ogImage: metaContent(html, "property", "og:image"),
      twitterCard: metaContent(html, "name", "twitter:card"),
      twitterTitle: metaContent(html, "name", "twitter:title"),
      twitterDescription: metaContent(html, "name", "twitter:description"),
      twitterImage: metaContent(html, "name", "twitter:image"),
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
