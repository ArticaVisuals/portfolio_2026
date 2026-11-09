async (page) => {
    await page.goto('about:blank')
    const browser = page.context().browser(), results = []
    for (const mode of ['desktop', 'tablet', 'mobile', 'reduced', 'background']) {
        const context = await browser.newContext({ viewport: {width: mode === 'tablet' ? 810 : mode === 'mobile' ? 390 : 1440, height: 1000}, reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' })
        const p = await context.newPage(), errors = []
        p.on('pageerror', e => errors.push(e.message))
        await p.bringToFront()
        await p.addInitScript(() => {
            window.__check = {frames:[],events:[]}
            const mark = type => window.__check.events.push({type,at:performance.now(),visibility:document.visibilityState})
            window.addEventListener('mh:boot-complete',()=>mark('complete'))
            document.addEventListener('visibilitychange',()=>mark('visibility'))
            for (const type of ['transitionrun','transitionend']) document.addEventListener(type,e=>{if(e.target.id==='__pt-boot'&&e.propertyName==='transform')mark(type)},true)
            let last=0
            function frame(t) {
                const b=document.getElementById('__pt-boot'), l=document.getElementById('__pt-boot-label')
                const r=l?document.createRange():null;if(r)r.selectNodeContents(l)
                window.__check.frames.push({at:t,dt:last?t-last:0,hold:window.__mhBootVideoHold,bootVisible:!!b&&getComputedStyle(b).display!=='none',width:r?.getBoundingClientRect().width,fontReady:document.fonts.check('30px "MH Boot Identity"'),playing:Array.from(document.querySelectorAll('video.selected-work-video')).filter(v=>!v.paused).length})
                last=t;if(t<10000)requestAnimationFrame(frame)
            }
            requestAnimationFrame(frame)
        })
        await p.goto('https://micahhoang.com/?curtain-final-matrix='+mode,{waitUntil:'domcontentloaded'})
        if(mode==='background') {
            const other=await context.newPage();await other.goto('about:blank');await other.bringToFront();await p.waitForTimeout(4300);await p.bringToFront();await other.close();await p.waitForTimeout(800)
        } else await p.waitForTimeout(4700)
        const result=await p.evaluate(()=>{
            const d=window.__check, start=d.events.find(e=>e.type==='transitionrun')?.at, end=d.events.find(e=>e.type==='transitionend')?.at
            const fs=d.frames.filter(f=>f.at>=start&&f.at<=end), ds=fs.map(f=>f.dt).sort((a,b)=>a-b)
            return {events:d.events,bootEverVisible:d.frames.some(f=>f.bootVisible),holdEver:d.frames.some(f=>f.hold),holdNow:window.__mhBootVideoHold,bootNow:!!document.getElementById('__pt-boot'),median:ds[Math.floor(ds.length/2)],max:ds.length?Math.max(...ds):null,over20:ds.filter(x=>x>20).length,widths:[...new Set(d.frames.filter(f=>f.width).map(f=>f.width))],playingDuringSweep:Math.max(0,...fs.map(f=>f.playing)),videos:Array.from(document.querySelectorAll('video.selected-work-video')).map(v=>({paused:v.paused,time:v.currentTime,visible:v.closest('.selected-work-media')?.getAttribute('data-video-visible')}))}
        })
        if(mode==='desktop') {
            await p.locator('nav a[href="./index"],nav a[href="/index"]').first().click()
            await p.waitForURL('**/index');await p.waitForTimeout(900)
            await p.locator('nav a[href="./"],nav a[href="/"]').first().click()
            await p.waitForURL('https://micahhoang.com/');await p.waitForTimeout(1500)
            result.homeReturn=await p.evaluate(()=>({path:location.pathname,boot:!!document.getElementById('__pt-boot'),hold:window.__mhBootVideoHold,hero:!!document.getElementById('mh-hero-rise-style'),headline:document.querySelector('h1')?.textContent,videos:Array.from(document.querySelectorAll('video.selected-work-video')).map(v=>v.paused)}))
        }
        results.push({mode,...result,errors})
        await context.close()
    }
    return results
}
