async (page) => {
    await page.bringToFront()
    const cdp = await page.context().newCDPSession(page)
    const events=[]
    cdp.on('Tracing.dataCollected', e => events.push(...e.value))
    await cdp.send('Tracing.start', {categories:'devtools.timeline,blink.user_timing,cc,benchmark', transferMode:'ReportEvents'})
    await page.reload({waitUntil:'domcontentloaded'})
    await page.waitForTimeout(6500)
    const complete=new Promise(resolve=>cdp.once('Tracing.tracingComplete',resolve))
    await cdp.send('Tracing.end')
    await complete
    const probe=await page.evaluate(()=>window.__bootDiagnostic)
    const nav=events.find(e=>e.name==='navigationStart')
    const navTs=nav?.ts || 0
    const reveal=probe.events.filter(e=>e.type==='pt:reveal').at(-1)?.at
    const end=probe.events.find(e=>e.type==='transitionend'&&e.id==='__pt-boot')?.at
    const during=events.filter(e=>(e.ts-navTs)/1000>=reveal&&(e.ts-navTs)/1000<=end)
    const counts={},totals={}
    for (const e of during) {counts[e.name]=(counts[e.name]||0)+1;if(e.dur)totals[e.name]=(totals[e.name]||0)+e.dur/1000}
    const tasks=during.filter(e=>['FunctionCall','UpdateLayoutTree','Layout','Paint','FireAnimationFrame','DrawFrame','BeginFrame','DroppedFrame'].includes(e.name)).map(e=>({name:e.name,at:(e.ts-navTs)/1000,duration:(e.dur||0)/1000,pid:e.pid,tid:e.tid,args:e.args}))
    return {navTs,reveal,end,counts,totals,tasks,probe}
}
