async (page) => {
    const cdp=await page.context().newCDPSession(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.setCacheDisabled',{cacheDisabled:true})
    await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:196608,uploadThroughput:96000,connectionType:'cellular3g'})
    await page.bringToFront()
    await page.goto('https://micahhoang.com/?curtain-visual=20260917',{waitUntil:'commit'})
    await page.waitForFunction(()=>document.getElementById('__pt-first-paint')&&!document.getElementById('__pt-boot'),null,{timeout:10000})
    await page.screenshot({path:'output/playwright/curtain-2026-09-17-01-early-green.png'})
    await page.waitForFunction(()=>document.getElementById('__pt-boot-label'),null,{timeout:10000})
    await page.screenshot({path:'output/playwright/curtain-2026-09-17-02-runtime-label.png'})
    await page.waitForTimeout(5000)
    const result=await page.evaluate(()=>({events:window.__bootDiagnostic.events,paints:window.__bootDiagnostic.paints,frames:window.__bootDiagnostic.frames.filter((f,i,a)=>i===0||f.fontReady!==a[i-1].fontReady||f.cover!==a[i-1].cover||f.boot!==a[i-1].boot)}))
    await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1})
    return result
}
