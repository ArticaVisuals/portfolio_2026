async (page) => {
    await page.goto('about:blank')
    const browser=page.context().browser(), context=await browser.newContext({viewport:{width:1440,height:1000}})
    const p=await context.newPage(), errors=[]
    p.on('pageerror',e=>errors.push(e.message))
    await p.bringToFront()
    await p.route('**/*.woff2*',r=>r.abort())
    await p.addInitScript(()=>{
        window.__fontFrames=[]
        new PerformanceObserver(list=>{for(const e of list.getEntries())if(e.name==='first-contentful-paint')window.__fcp=e.startTime}).observe({type:'paint',buffered:true})
        function sample(t){const l=document.getElementById('__pt-boot-label');if(l){const r=document.createRange();r.selectNodeContents(l);window.__fontFrames.push({at:t,ready:document.fonts.check('30px "MH Boot Identity"'),width:r.getBoundingClientRect().width})}if(t<2200)requestAnimationFrame(sample)}requestAnimationFrame(sample)
    })
    await p.goto('https://micahhoang.com/?curtain-final-lifecycle=20260917',{waitUntil:'domcontentloaded'})
    await p.waitForSelector('#__pt-boot-label')
    await p.screenshot({path:'output/playwright/curtain-final-identity-2026-09-17.png'})
    await p.evaluate(()=>Object.defineProperty(document,'visibilityState',{configurable:true,get(){return 'hidden'}}))
    await p.waitForTimeout(4000)
    const hidden=await p.evaluate(()=>({hold:window.__mhBootVideoHold,boot:!!document.getElementById('__pt-boot'),playing:Array.from(document.querySelectorAll('video.selected-work-video')).filter(v=>!v.paused).length}))
    await p.evaluate(()=>{delete document.visibilityState;document.dispatchEvent(new Event('visibilitychange'))})
    await p.waitForTimeout(400)
    const visible=await p.evaluate(()=>({hold:window.__mhBootVideoHold,playing:Array.from(document.querySelectorAll('video.selected-work-video')).filter(v=>!v.paused).length,fontFrames:window.__fontFrames,fcp:window.__fcp}))
    await p.locator('nav a[href="./play"],nav a[href="/play"]').first().click()
    await p.waitForURL('**/play');await p.waitForTimeout(1200)
    const play=await p.evaluate(()=>({path:location.pathname,hold:window.__mhBootVideoHold,boot:!!document.getElementById('__pt-boot'),root:!!document.querySelector('[data-playground-root="true"]'),playing:Array.from(document.querySelectorAll('video')).filter(v=>!v.paused).length}))
    await context.close()
    return {hidden,visible,play,errors}
}
