async page => {
    const results = { motion: [], routes: [], controls: {}, errors: [] }
    try {
    page.on('pageerror', error => results.errors.push(error.message))
    const ready = () => page.getByRole('button', { name: 'MENU', exact: true }).waitFor({ timeout: 15000 })
    const open = async () => {
        await page.getByRole('button', { name: 'MENU', exact: true }).click()
        await page.getByRole('dialog', { name: 'Main navigation' }).waitFor()
    }
    const summary = () => page.evaluate(() => ({
        path: location.pathname,
        menuCount: document.querySelectorAll('nav[data-framer-name="Navigation"] .mh-mobile-menu-button').length,
        nav: document.querySelector('nav[data-framer-name="Navigation"]').getBoundingClientRect().toJSON(),
        horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
        bodyOverflow: document.body.style.overflow,
        menuOpen: !!document.querySelector('dialog[open]'),
        menuScrollLock: document.documentElement.classList.contains('mh-mobile-menu-open'),
    }))
    await page.addInitScript(() => {
        window.__mhColdFrames = []
        const start = performance.now()
        const selectors = [
            'nav[data-framer-name="Navigation"] [data-framer-name="Micah Hoang"]',
            'h1', 'h3', '[data-framer-name="SELECTED"]', '[data-framer-name="WORK"]',
        ]
        function sample() {
            window.__mhColdFrames.push({ t: performance.now() - start, positions: selectors.map(s => {
                const e = document.querySelector(s)
                if (!e) return null
                const r = e.getBoundingClientRect()
                return [r.x, r.y, r.width, r.height]
            }) })
            if (performance.now() - start < 3500) requestAnimationFrame(sample)
        }
        requestAnimationFrame(sample)
    })
    for (const width of [390, 320, 430]) {
        await page.setViewportSize({ width, height: 664 })
        await page.goto('https://micahhoang.com/', { waitUntil: 'domcontentloaded' })
        await ready()
        await page.waitForTimeout(3700)
        results.motion.push(await page.evaluate(() => ({
            width: innerWidth,
            frames: window.__mhColdFrames.length,
            elements: ['header name', 'hero name', 'descriptor', 'Selected', 'work'].map((name, index) => {
                const values = window.__mhColdFrames.map(f => f.positions[index]).filter(v => v && v[2] > 0 && v[3] > 0)
                return { name, samples: values.length, xRange: Math.max(...values.map(v => v[0])) - Math.min(...values.map(v => v[0])), yRange: Math.max(...values.map(v => v[1])) - Math.min(...values.map(v => v[1])) }
            }),
        })))
        await open()
        results.controls['viewport-' + width] = await page.evaluate(() => {
            const dialog = document.querySelector('dialog')
            return { open: dialog.open, width: dialog.clientWidth, height: dialog.clientHeight, horizontalOverflow: dialog.scrollWidth > dialog.clientWidth, targets: Array.from(dialog.querySelectorAll('a,button')).map(e => ({ text: e.textContent, height: e.getBoundingClientRect().height })) }
        })
        await page.keyboard.press('Escape')
    }
    await page.setViewportSize({ width: 390, height: 664 })
    await page.evaluate(() => window.scrollTo(0, 500))
    await open()
    const focus = []
    for (let i = 0; i < 12; i++) {
        await page.keyboard.press('Tab')
        focus.push(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)))
    }
    await page.keyboard.press('Escape')
    results.controls.keyboard = { focusStayedInside: focus.every(Boolean), ...await page.evaluate(() => ({ restoredFocus: document.activeElement.textContent, scrollY, overflow: document.body.style.overflow, open: document.querySelector('dialog').open })) }
    await open()
    await page.getByRole('dialog').getByRole('link', { name: 'Work', exact: true }).click()
    results.controls.samePageWork = await page.evaluate(() => ({ scrollY, open: document.querySelector('dialog').open, overflow: document.body.style.overflow }))
    for (const [label, path] of [['About', '/about'], ['Play', '/play'], ['Index', '/index'], ['Work', '/']]) {
        await open()
        await Promise.all([page.waitForURL('https://micahhoang.com' + path, { waitUntil: 'domcontentloaded' }), page.getByRole('dialog').getByRole('link', { name: label, exact: true }).click()])
        await page.waitForLoadState('domcontentloaded')
        await ready()
        await page.waitForFunction(() => !document.querySelector('dialog[open]') && !document.documentElement.classList.contains('mh-mobile-menu-open'))
        results.routes.push({ via: label, ...await summary() })
    }
    for (const slug of ['gaia', 'airpods']) {
        await page.goto('https://micahhoang.com/case-studies/' + slug, { waitUntil: 'domcontentloaded' })
        await ready()
        await open()
        await Promise.all([page.waitForURL('https://micahhoang.com/about', { waitUntil: 'domcontentloaded' }), page.getByRole('dialog').getByRole('link', { name: 'About', exact: true }).click()])
        await page.waitForLoadState('domcontentloaded')
        await ready()
        await page.waitForFunction(() => !document.querySelector('dialog[open]') && !document.documentElement.classList.contains('mh-mobile-menu-open'))
        results.routes.push({ via: slug + ' → About', ...await summary() })
    }
    await page.goBack({ waitUntil: 'domcontentloaded' })
    await ready()
    results.routes.push({ via: 'browser back', ...await summary() })
    await open()
    await page.setViewportSize({ width: 810, height: 1000 })
    await page.waitForTimeout(300)
    results.controls.desktopBoundary = await page.evaluate(() => ({ dialogCount: document.querySelectorAll('.mh-mobile-menu-dialog').length, menuCount: document.querySelectorAll('.mh-mobile-menu-button').length, overflow: document.body.style.overflow, navText: document.querySelector('nav[data-framer-name="Navigation"]').textContent }))
    await page.setViewportSize({ width: 390, height: 664 })
    await ready()
    results.controls.returnToMobile = await summary()
    await page.goto('https://micahhoang.com/', { waitUntil: 'domcontentloaded' })
    await ready()
    return results
    } catch (error) {
        results.failure = { message: error.message, url: page.url() }
        return results
    }
}
