async page=>{
 const browser=page.context().browser(),out={coldLoads:[],menus:[],interactions:[]};
 for(const route of ['/case-studies/gaia','/case-studies/airpods','/index']){
  const c=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await c.addInitScript(()=>{window.__shifts=[];new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__shifts.push({time:e.startTime,value:e.value,sources:e.sources?.map(s=>({name:s.node?.getAttribute?.('data-framer-name'),previous:s.previousRect,current:s.currentRect}))});})).observe({type:'layout-shift',buffered:true});});
  const p=await c.newPage();
  try{
   await p.goto('https://micahhoang.com'+route,{waitUntil:'domcontentloaded'});
   await p.getByRole('button',{name:'Menu',exact:true}).waitFor();await p.waitForTimeout(4000);
   out.coldLoads.push(await p.evaluate(()=>({route:location.pathname,shifts:window.__shifts,mediaRequests:performance.getEntriesByType('resource').filter(e=>e.initiatorType==='video').map(e=>({url:e.name,bytes:e.transferSize,start:e.startTime,duration:e.duration})),videos:[...document.querySelectorAll('video')].map(e=>({src:e.currentSrc||e.src,y:e.getBoundingClientRect().y,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height,paused:e.paused,preload:e.preload,ready:e.readyState,deferred:e.getAttribute('data-video-source-deferred')}))})));
  }finally{await c.close();}
 }
 const c=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const p=await c.newPage();
 try{
  await p.goto('https://micahhoang.com/',{waitUntil:'domcontentloaded'});await p.getByRole('button',{name:'Menu',exact:true}).waitFor();
  for(const size of [{width:320,height:568},{width:667,height:375}]){
   await p.setViewportSize(size);await p.getByRole('button',{name:'Menu',exact:true}).tap();await p.getByRole('dialog',{name:'Main navigation'}).waitFor();
   out.menus.push(await p.evaluate(()=>{const d=document.querySelector('[role="dialog"]');return {width:innerWidth,height:innerHeight,scrollHeight:d.scrollHeight,clientHeight:d.clientHeight,links:[...d.querySelectorAll('a,[role="button"]')].map(e=>({text:e.textContent,y:e.getBoundingClientRect().y,bottom:e.getBoundingClientRect().bottom,height:e.getBoundingClientRect().height})),pageOverflow:document.documentElement.scrollWidth>innerWidth};}));
   if(size.height===375)await p.screenshot({path:'output/playwright/mobile-audit-2026-10-29/menu-landscape.png'});
   await p.getByRole('button',{name:'Close menu',exact:true}).tap();await p.getByRole('button',{name:'Menu',exact:true}).waitFor();
  }
  await p.setViewportSize({width:390,height:844});
  const read=p.getByRole('link',{name:/READ MORE/});await read.scrollIntoViewIfNeeded();await read.tap();await p.waitForURL('**/about');out.interactions.push({test:'Home Read more → About',pass:true});
  await p.goto('https://micahhoang.com/index');await p.getByRole('button',{name:'2026',exact:true}).waitFor();await p.getByRole('button',{name:'2026',exact:true}).tap();
  out.interactions.push({test:'Index year filter touch',url:p.url(),pressed:await p.getByRole('button',{name:'2026',exact:true}).getAttribute('aria-pressed')});
  await p.getByRole('button',{name:'list',exact:true}).tap();out.interactions.push({test:'Index list touch',pressed:await p.getByRole('button',{name:'list',exact:true}).getAttribute('aria-pressed')});
  await p.goto('https://micahhoang.com/play');await p.locator('[data-playground-root="true"]').waitFor();await p.waitForTimeout(1200);
  const cd=await c.newCDPSession(p);
  const before=await p.locator('[data-playground-root="true"]').evaluate(e=>[...e.querySelectorAll('[style]')].filter(n=>getComputedStyle(n).transform!=='none').slice(0,4).map(n=>getComputedStyle(n).transform));
  await cd.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:190,y:460}]});
  for(let i=1;i<=6;i++)await cd.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:190-i*12,y:460-i*20}]});
  await cd.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(500);
  const after=await p.locator('[data-playground-root="true"]').evaluate(e=>[...e.querySelectorAll('[style]')].filter(n=>getComputedStyle(n).transform!=='none').slice(0,4).map(n=>getComputedStyle(n).transform));
  await p.getByRole('button',{name:'Menu',exact:true}).tap();await p.getByRole('dialog',{name:'Main navigation'}).waitFor();
  out.interactions.push({test:'Play synthesized touch drag then Menu',dragChanged:JSON.stringify(before)!==JSON.stringify(after),menuOpens:true,before,after});
 }catch(e){out.interactionError=String(e);}finally{await c.close();}
 return out;
}
