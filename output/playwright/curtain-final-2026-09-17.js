async (page) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.bringToFront()
    const cdp = await page.context().newCDPSession(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
    await page.addInitScript(() => {
        const p = window.__bootDiagnostic = { frames: [], events: [], longtasks: [], longframes: [], paints: [], mutations: {} }
        const record = (type, extra = {}) => p.events.push({ type, at: performance.now(), ...extra })
        for (const type of ['longtask', 'long-animation-frame', 'paint']) {
            try { new PerformanceObserver(list => list.getEntries().forEach(e => {
                const target = type === 'paint' ? p.paints : type === 'longtask' ? p.longtasks : p.longframes
                target.push(e.toJSON())
            })).observe({ type, buffered: true }) } catch {}
        }
        window.addEventListener('pt:reveal', () => record('pt:reveal'))
        window.addEventListener('mh:boot-complete', () => record('mh:boot-complete'))
        document.addEventListener('DOMContentLoaded', () => record('DOMContentLoaded'))
        window.addEventListener('load', () => record('load'))
        document.fonts.addEventListener('loadingdone', e => record('fonts-loaded', {fonts: e.fontfaces.map(f => f.family)}))
        document.addEventListener('transitionrun', e => { if (e.target.id.startsWith('__pt-')) record('transitionrun', {id:e.target.id, property:e.propertyName}) }, true)
        document.addEventListener('transitionend', e => { if (e.target.id.startsWith('__pt-')) record('transitionend', {id:e.target.id, property:e.propertyName}) }, true)
        const observer = new MutationObserver(ms => {
            for (const m of ms) {
                if (m.target.id) p.mutations[m.target.id] = (p.mutations[m.target.id] || 0) + 1
                for (const n of m.addedNodes) if(n.nodeType === 1 && ['__pt-first-paint','__pt-boot','__pt-boot-label'].includes(n.id)) record('added', {id:n.id,text:n.textContent})
                for (const n of m.removedNodes) if(n.nodeType === 1 && ['__pt-first-paint','__pt-boot','__pt-boot-label'].includes(n.id)) record('removed', {id:n.id})
            }
        })
        observer.observe(document, { childList:true, subtree:true })
        let lastState = '', last = 0
        function sample(t) {
            const cover=document.getElementById('__pt-first-paint'), boot=document.getElementById('__pt-boot'), label=document.getElementById('__pt-boot-label')
            const state=[!!cover, !!boot, !!label, document.fonts.status].join(':')
            if (state !== lastState) { record('state', {state, visible:document.visibilityState}); lastState=state }
            let opacity=null, transform=null, fontReady=null, width=null
            if (boot) transform=getComputedStyle(boot).transform
            if (label) { opacity=getComputedStyle(label).opacity; fontReady=document.fonts.check('30px "MH Boot Identity"'); const range=document.createRange(); range.selectNodeContents(label); width=range.getBoundingClientRect().width }
            p.frames.push({hold:window.__mhBootVideoHold,playing:document.querySelectorAll('video.selected-work-video').length?Array.from(document.querySelectorAll('video.selected-work-video')).filter(v=>!v.paused).length:0,coverContent:cover?getComputedStyle(document.documentElement,'::before').content:null,family:label?getComputedStyle(label).fontFamily:null,ease:boot?getComputedStyle(boot).transitionTimingFunction:null,at:t,delta:last?t-last:0,cover:!!cover,boot:!!boot,label:!!label,opacity,transform,fontReady,textWidth:width})
            last=t
            if(t<16000)requestAnimationFrame(sample);else observer.disconnect()
        }
        requestAnimationFrame(sample)
    })
    await page.goto('https://micahhoang.com/?curtain-final=20260917', {waitUntil:'domcontentloaded'})
    await page.waitForTimeout(8000)
    return await page.evaluate(() => ({ ...window.__bootDiagnostic, headGuardMatches: document.querySelector('#mh-head-first-paint-guard')?.textContent.includes('MH Boot Identity'), scripts:Array.from(document.scripts).filter(s=>s.src).map(s=>s.src), visible:document.visibilityState }))
}
