async page => {
  const results = { routes: [], errors: [] }
  page.on('pageerror', error => results.errors.push(error.message))
  const ready = () => page.getByRole('button', {name:'Menu',exact:true}).waitFor({timeout:45000})
  const open = async () => { await page.getByRole('button',{name:'Menu',exact:true}).click(); await page.getByRole('dialog',{name:'Main navigation'}).waitFor() }
  try {
    await page.setViewportSize({width:390,height:664})
    for (const slug of ['gaia','airpods']) {
      const source = 'https://micahhoang.com/case-studies/' + slug
      await page.goto(source,{waitUntil:'domcontentloaded'})
      await ready()
      await open()
      await Promise.all([page.waitForURL('https://micahhoang.com/about',{waitUntil:'domcontentloaded'}),page.getByRole('dialog').getByRole('link',{name:'ABOUT',exact:true}).click()])
      await page.goBack({waitUntil:'domcontentloaded'})
      await ready()
      await page.waitForTimeout(1500)
      const returned = await page.evaluate(() => ({path:location.pathname, menu:document.querySelector('[data-framer-name="Menu Button"]')?.textContent, locked:document.documentElement.classList.contains('mh-mobile-menu-open')}))
      if (returned.path !== '/case-studies/' + slug) throw new Error('Back replayed: ' + returned.path)
      await open()
      await page.setViewportSize({width:810,height:1000})
      await page.waitForTimeout(300)
      await page.setViewportSize({width:390,height:664})
      await ready()
      await page.waitForTimeout(1200)
      if (page.url() !== source) throw new Error('Resize replayed: ' + page.url())
      results.routes.push({slug, ...returned, stableAfterResize:true})
    }
    await page.goto('https://micahhoang.com/',{waitUntil:'domcontentloaded'})
    await ready()
    await open()
    await page.keyboard.press('Escape')
    await ready()
    await page.getByRole('button',{name:'Menu',exact:true}).focus()
    await page.keyboard.press('Enter')
    await page.getByRole('dialog').waitFor()
    await page.keyboard.press('Space')
    await ready()
    results.keyboard = true
    results.spacing = []
    for (const width of [320,390,430,809]) {
      await page.setViewportSize({width,height:664})
      await ready(); await open()
      results.spacing.push(await page.evaluate(() => {
        const links = [...document.querySelectorAll('[data-framer-name="Routes"] a')]
        const rows = links.map(link => {const p=link.querySelector('p');return {label:p.textContent,rowHeight:link.getBoundingClientRect().height,textHeight:p.getBoundingClientRect().height,paddingTop:getComputedStyle(link).paddingTop,paddingBottom:getComputedStyle(link).paddingBottom}})
        return {width:innerWidth,rows,overflow:document.documentElement.scrollWidth>innerWidth}
      }))
      if(width===390) await page.screenshot({path:'output/playwright/mobile-menu-authoring-2026-10-29/mobile-open.png'})
      await page.keyboard.press('Escape'); await ready()
    }
    await page.setViewportSize({width:390,height:664})
    results.singleClippedLabel = await page.evaluate(() => { const button=document.querySelector('[data-framer-name="Menu Button"]'); const mask=button.querySelector('[data-framer-name="Label Mask"]'); return {text:button.textContent,count:button.querySelectorAll('p').length,overflow:getComputedStyle(mask).overflow,height:mask.offsetHeight}; })
    await page.getByRole('button',{name:'Menu',exact:true}).evaluate(e=>e.blur())
    await page.screenshot({path:'output/playwright/mobile-menu-authoring-2026-10-29/mobile-closed.png'})
    return results
  } catch (error) { return {...results,failure:{message:error.message,url:page.url()}} }
}
