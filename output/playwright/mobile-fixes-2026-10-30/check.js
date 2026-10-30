async page => {
 const browser=page.context().browser(); const results=[];
 for(const width of [390,1200])for(const route of ['/case-studies/gaia','/case-studies/airpods','/']){
 const c=await browser.newContext({viewport:{width,height:844},isMobile:width<810,hasTouch:width<810});
 await c.addInitScript(()=>{window.__shifts=[];new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__shifts.push({v:e.value,t:e.startTime,s:e.sources?.map(s=>({name:s.node?.getAttribute?.('data-framer-name'),prev:s.previousRect,cur:s.currentRect}))})})).observe({type:'layout-shift',buffered:true});});
 const p=await c.newPage(); const errors=[]; p.on('pageerror',e=>errors.push(e.message));
 await p.goto('https://micahhoang.com'+route,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(5000);
 results.push(await p.evaluate(({width,route,errors})=>({width,route,errors,shifts:window.__shifts,videoBytes:performance.getEntriesByType('resource').filter(e=>e.initiatorType==='video').reduce((a,e)=>a+e.transferSize,0),videos:[...document.querySelectorAll('video')].map(e=>({src:e.currentSrc||e.src,rect:e.getBoundingClientRect().toJSON(),paused:e.paused,ready:e.readyState,deferred:e.dataset.videoSourceDeferred})),geometry:[...document.querySelectorAll('h1,header,[data-framer-name="Hero image"],[data-framer-name="Credits & Info"]')].map(e=>({name:e.getAttribute('data-framer-name')||e.tagName,text:e.tagName==='H1'?e.textContent:'',r:e.getBoundingClientRect().toJSON()}))}),{width,route,errors}));await c.close();
 }return results;
}
