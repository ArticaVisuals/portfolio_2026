async (page) => {
    await page.goto('about:blank')
    const browser=page.context().browser(), results=[]
    for(const mode of ['baseline','no-media','no-replay','no-lenis','content-hidden']) {
        const context=await browser.newContext({viewport:{width:1440,height:1000}})
        const p=await context.newPage()
        await p.bringToFront()
        await p.addInitScript(mode=>{
            window.__ab={frames:[],events:[],mode}
            if(mode==='no-media') HTMLMediaElement.prototype.play=function(){return Promise.resolve()}
            if(mode==='no-replay') Object.defineProperty(window,'__ptReplayAppear',{configurable:true,get(){return function(){}},set(){}})
            if(mode==='content-hidden') {
                const install=()=>{const s=document.createElement('style');s.textContent='body{visibility:hidden!important}';(document.head||document.documentElement).append(s)}
                document.documentElement?install():document.addEventListener('DOMContentLoaded',install)
            }
            if(mode==='no-lenis') {
                let timer=setInterval(()=>{const l=window.__mhLenis;if(l){l.destroy?.();clearInterval(timer)}},10)
                setTimeout(()=>clearInterval(timer),6000)
            }
            document.addEventListener('transitionrun',e=>{if(e.target.id==='__pt-boot')window.__ab.events.push({type:'start',at:performance.now()})},true)
            document.addEventListener('transitionend',e=>{if(e.target.id==='__pt-boot')window.__ab.events.push({type:'end',at:performance.now()})},true)
            let last=0
            const frame=t=>{const b=document.getElementById('__pt-boot');window.__ab.frames.push({at:t,dt:last?t-last:0,transform:b?getComputedStyle(b).transform:null});last=t;if(t<6500)requestAnimationFrame(frame)}
            requestAnimationFrame(frame)
        },mode)
        await p.goto('https://micahhoang.com/?curtain-ab='+mode,{waitUntil:'domcontentloaded'})
        await p.waitForTimeout(5200)
        const result=await p.evaluate(()=>{
            const d=window.__ab,start=d.events.find(e=>e.type==='start')?.at,end=d.events.find(e=>e.type==='end')?.at
            const f=d.frames.filter(f=>f.at>=start&&f.at<=end),ds=f.map(f=>f.dt).sort((a,b)=>a-b)
            return {mode:d.mode,start,end,count:f.length,median:ds[Math.floor(ds.length/2)],max:Math.max(...ds),over20:ds.filter(x=>x>20).length,videos:Array.from(document.querySelectorAll('video')).map(v=>({paused:v.paused,readyState:v.readyState,src:v.currentSrc,rect:v.getBoundingClientRect().toJSON()})),globals:Object.keys(window).filter(k=>/lenis/i.test(k))}
        })
        results.push(result)
        await context.close()
    }
    return results
}
