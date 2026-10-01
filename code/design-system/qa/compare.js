/*
 * Landmark geometry for the Home page. Paste into a browser console (or run
 * through a browser tool) on BOTH https://micahhoang.com/ and qa/home.html at
 * the same viewport width (1200, 810, 390), then diff the two outputs.
 *
 * Values are relative so the fixture doesn't need the live page's boot
 * curtain or scroll position: hero landmarks from the hero top, section
 * landmarks from the rule, footer landmarks from the footer top.
 * On the live site, run it after the hero type has finished revealing.
 */
;(() => {
    const live = location.hostname.endsWith("micahhoang.com")
    const text = (t, root = document) =>
        [...root.querySelectorAll("h1,h2,h3,p,a,span")].find((e) => e.children.length === 0 && e.textContent.trim() === t)
    const byName = (n) => document.querySelector(`[data-framer-name="${n}"]`)
    const qa = (k) => document.querySelector(`[data-qa="${k}"]`)
    const box = (e) => {
        if (!e) return null
        const r = e.getBoundingClientRect()
        return { x: r.left, y: r.top + scrollY, w: r.width, h: r.height, b: r.bottom + scrollY }
    }

    const el = live
        ? {
              hero: byName("Section Hero"),
              name: byName("Heading Row Wrapper")?.querySelector("h1, p"),
              descriptor: text("Brand designer with a systems mind."),
              heroLink: text("LINKEDIN"),
              heroYear: [...document.querySelectorAll("p")].find((p) => p.textContent.trim() === "©2026"),
              rule: byName("Heading Wrapper"),
              title: text("Selected"),
              title2: text("work"),
              grid: byName("Projects"),
              navRole: text("BRAND DESIGNER"),
              navLoc: text("LOS ANGELES, CALIFORNIA"),
              navWork: text("Work"),
              footer: byName("Section CTA"),
              eyebrow: text("GET IN TOUCH"),
              row1: byName("Section CTA")?.querySelectorAll('[data-framer-name="Cta Row"], a')[0],
              footLinks: [...document.querySelectorAll("p")].filter((p) => p.textContent.trim() === "LINKEDIN").pop(),
          }
        : {
              hero: qa("hero"),
              name: qa("hero-name"),
              descriptor: qa("hero-descriptor"),
              heroLink: qa("hero-links"),
              heroYear: qa("hero-year"),
              rule: qa("work-rule"),
              title: qa("work-title").firstElementChild,
              title2: qa("work-title-2"),
              grid: qa("work-grid"),
              navRole: qa("nav-role"),
              navLoc: qa("nav-location"),
              navWork: qa("nav-links"),
              footer: qa("footer"),
              eyebrow: qa("footer-eyebrow"),
              row1: qa("footer-row-1"),
              footLinks: qa("footer-links"),
          }

    const b = Object.fromEntries(Object.entries(el).map(([k, v]) => [k, box(v)]))
    const r = (n) => Math.round(n)
    return {
        width: innerWidth,
        "hero.height": r(b.hero.h),
        "hero.nameTop": r(b.name.y - b.hero.y),
        "hero.nameX": r(b.name.x),
        "hero.descriptorTop": r(b.descriptor.y - b.hero.y),
        "hero.descriptorWidth": r(b.descriptor.w),
        "hero.linkRowTop": r(b.heroLink.y - b.hero.y),
        "hero.linkRowX": r(b.heroLink.x),
        "hero.yearRight": r(innerWidth - (b.heroYear.x + b.heroYear.w)),
        "work.ruleFromHeroBottom": r(b.rule.y - b.hero.b),
        "work.titleFromRule": r(b.title.y - b.rule.y),
        "work.wordGap": r(b.title2.x - (b.title.x + b.title.w)),
        "work.gridFromTitle": r(b.grid.y - b.title.b),
        "nav.roleX": b.navRole ? r(b.navRole.x) : "hidden",
        "nav.locationX": b.navLoc ? r(b.navLoc.x) : "hidden",
        "nav.linksX": r(b.navWork.x),
        "footer.height": r(b.footer.h),
        "footer.eyebrowTop": r(b.eyebrow.y - b.footer.y),
        "footer.row1Top": r(b.row1.y - b.footer.y),
        "footer.linksX": r(b.footLinks.x),
        "footer.linksFromBottom": r(b.footer.b - b.footLinks.y),
    }
})()
