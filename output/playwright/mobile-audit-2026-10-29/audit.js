async page => {
 const browser=page.context().browser();
 const out=[];
 const routes=['/','/about','/case-studies/gaia','/case-studies/airpods','/index','/play'];
 for(const route of routes) {
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  await context.addInitScript(()=>{
   window.__audit={shifts:[],lcp:[]};
   new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__audit.shifts.push({value:e.value,sources:e.sources?.map(s=>s.node?.getAttribute?.('data-framer-name')||s.node?.tagName)});})).observe({type:'layout-shift',buffered:true});
   new PerformanceObserver(l=>l.getEntries().forEach(e=>window.__audit.lcp.push({time:e.startTime,url:e.url,size:e.size}))).observe({type:'largest-contentful-paint',buffered:true});
  });
  const p=await context.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const failures=[];p.on('response',r=>{if(r.status()>=400)failures.push({status:r.status(),url:r.url().slice(0,200)});});
  try{
   await p.goto('https://micahhoang.com'+route,{waitUntil:'domcontentloaded',timeout:45000});
   await p.getByRole('button',{name:'Menu',exact:true}).waitFor({timeout:45000});
   await p.evaluate(()=>document.fonts.ready);
   await p.waitForTimeout(1500);
   const scan=()=>p.evaluate(()=>{
    const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};};
    const visible=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&!e.closest('[inert]');};
    const small=[...document.querySelectorAll('a,button,[role="button"]')].filter(visible).map(e=>({label:(e.getAttribute('aria-label')||e.textContent||'').trim().replace(/\s+/g,' ').slice(0,85),tag:e.tagName,href:e.getAttribute('href'),rect:rect(e),name:e.dataset.framerName})).filter(e=>e.rect.h<44||e.rect.w<44);
    return {width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,pageHeight:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth,smallTargets:small,headings:[...document.querySelectorAll('h1,h2,h3')].filter(visible).map(e=>({tag:e.tagName,text:e.textContent.slice(0,100)})),badImages:[...document.images].filter(visible).filter(e=>e.complete&&e.naturalWidth===0).map(e=>e.currentSrc),missingAlt:[...document.images].filter(visible).filter(e=>!e.alt).length,media:{images:document.images.length,videos:document.querySelectorAll('video').length,playing:[...document.querySelectorAll('video')].filter(e=>!e.paused).length},audit:window.__audit,resources:performance.getEntriesByType('resource').map(e=>({url:e.name,bytes:e.transferSize,decoded:e.decodedBodySize,duration:e.duration,kind:e.initiatorType})).sort((a,b)=>b.bytes-a.bytes).slice(0,8)};
   });
   const top=await scan(); await p.screenshot({path:'output/playwright/mobile-audit-2026-10-29/'+(route.replaceAll('/','-')||'home')+'-top.png'});
   const widths=[];
   for(const width of [320,430,699]) {await p.setViewportSize({width,height:844});await p.waitForTimeout(200);const s=await scan();widths.push({width,overflow:s.overflow,scrollWidth:s.scrollWidth});}
   await p.setViewportSize({width:390,height:844});
   await p.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await p.waitForTimeout(1000);
   const bottom=await scan();await p.screenshot({path:'output/playwright/mobile-audit-2026-10-29/'+(route.replaceAll('/','-')||'home')+'-bottom.png'});
   out.push({route,top,widths,bottom:{badImages:bottom.badImages,smallTargets:bottom.smallTargets,media:bottom.media},errors,failures});
  }catch(e){out.push({route,error:String(e),errors,failures});}
  finally{await context.close();}
 }
 return out;
}
