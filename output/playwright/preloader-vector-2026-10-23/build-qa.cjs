const fs=require('fs');
const head=fs.readFileSync('code/mirror/custom-code/Preloaders.html','utf8');
const qa=async (page)=>{
 const browser=page.context().browser(),results=[];
 for(const mode of ['desktop','tablet','mobile','reduced']){
  const context=await browser.newContext({viewport:{width:mode==='tablet'?810:mode==='mobile'?390:1440,height:1000},reducedMotion:mode==='reduced'?'reduce':'no-preference'});
  const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.route('https://micahhoang.com/**',async route=>{
   if(route.request().resourceType()!=='document')return route.continue();
   const response=await route.fetch();let html=await response.text();
   html=html.replace(/<script id="mh-head-first-paint-guard">[\s\S]*?<\/script>/,head.match(/<script id="mh-head-first-paint-guard">[\s\S]*?<\/script>/)[0]);
   await route.fulfill({response,body:html});
  });
  await p.route('**/*.woff2*',route=>route.abort());
  await p.addInitScript(()=>{
   window.__vectorQA={frames:[],events:[]};
   const mark=type=>window.__vectorQA.events.push({type,at:performance.now()});
   window.addEventListener('mh:boot-complete',()=>mark('complete'));
   document.addEventListener('transitionend',e=>{if(e.target.id==='__pt-boot'&&e.propertyName==='transform')mark('lift-end');},true);
   const frame=t=>{
    const label=document.getElementById('__pt-boot-label'),boot=document.getElementById('__pt-boot');
    const early=getComputedStyle(document.documentElement,'::after'),runtime=label&&getComputedStyle(label,'::after');
    const stage=boot&&getComputedStyle(boot).display!=='none'?'runtime':early.content==='""'&&early.display!=='none'?'early':'none';
    const s=stage==='runtime'?runtime:early;
    window.__vectorQA.frames.push({at:t,stage,width:s?.width,height:s?.height,mask:!!s?.maskImage&&s.maskImage!=='none',color:s?.backgroundColor,fontSize:label&&getComputedStyle(label).fontSize,hold:window.__mhBootVideoHold,opacity:label&&getComputedStyle(label).opacity,playing:[...document.querySelectorAll('video.selected-work-video')].filter(v=>!v.paused).length});
    if(t<7500)requestAnimationFrame(frame);
   };requestAnimationFrame(frame);
  });
  await p.goto('https://micahhoang.com/?vector-preloader-qa='+mode,{waitUntil:'domcontentloaded'});
  if(mode==='desktop'||mode==='tablet'){
   await p.waitForFunction(()=>{const l=document.getElementById('__pt-boot-label');return l&&getComputedStyle(l).opacity==='1'&&getComputedStyle(l).fontSize==='0px'});
   await p.screenshot({path:'output/playwright/preloader-vector-2026-10-23/'+mode+'.png'});
  }
  await p.waitForTimeout(4500);
  const result=await p.evaluate(()=>({frames:window.__vectorQA.frames,events:window.__vectorQA.events,bootNow:!!document.getElementById('__pt-boot'),coverNow:!!document.getElementById('__pt-first-paint'),holdNow:window.__mhBootVideoHold}));
  const visible=result.frames.filter(f=>f.stage!=='none'),early=visible.filter(f=>f.stage==='early'),runtime=visible.filter(f=>f.stage==='runtime');
  results.push({mode,errors,earlyFrames:early.length,runtimeFrames:runtime.length,widths:[...new Set(visible.map(f=>f.width))],heights:[...new Set(visible.map(f=>f.height))],allMasked:visible.every(f=>f.mask),fontSizes:[...new Set(runtime.map(f=>f.fontSize))],events:result.events,bootNow:result.bootNow,coverNow:result.coverNow,holdNow:result.holdNow,maxPlayingDuringBoot:Math.max(0,...runtime.map(f=>f.playing))});
  await context.close();
 }
 return results;
};
fs.writeFileSync('output/playwright/preloader-vector-2026-10-23/qa.js',qa.toString().replace('async (page)=>{','async (page)=>{\n const head='+JSON.stringify(head)+';'));
