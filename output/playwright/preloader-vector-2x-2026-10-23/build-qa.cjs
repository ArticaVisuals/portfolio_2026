const fs=require('fs');
const head=fs.readFileSync('code/mirror/custom-code/Preloaders.html','utf8');
const svg=fs.readFileSync('assets/identity/micah-hoang-copyright.svg','utf8');
const paths=Array.from(svg.matchAll(/<path\b[^>]*\bd="([^"]*)"/g),m=>m[1]);
const qa=async page=>{
 const browser=page.context().browser(),results=[];
 for(const mode of ['desktop-1x','desktop-2x','tablet-2x','mobile','reduced']){
  const context=await browser.newContext({viewport:{width:mode==='tablet-2x'?810:mode==='mobile'?390:1440,height:1000},deviceScaleFactor:mode.endsWith('2x')?2:1,reducedMotion:mode==='reduced'?'reduce':'no-preference'});
  const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  if(!live) await p.route('https://micahhoang.com/**',async route=>{
   if(route.request().resourceType()!=='document')return route.continue();
   const response=await route.fetch();let html=await response.text();
   html=html.replace(/<script id="mh-head-first-paint-guard">[\s\S]*?<\/script>/,head.match(/<script id="mh-head-first-paint-guard">[\s\S]*?<\/script>/)[0]);
   await route.fulfill({response,body:html});
  });
  await p.addInitScript(expected=>{
   window.__vectorQA={frames:[],events:[],pathsMatch:false};
   window.addEventListener('mh:boot-complete',()=>window.__vectorQA.events.push('complete'));
   const frame=t=>{
    const label=document.getElementById('__pt-boot-label'),boot=document.getElementById('__pt-boot'),early=document.getElementById('__pt-first-paint');
    const root=boot&&getComputedStyle(boot).display!=='none'?label:early;
    const svg=root?.querySelector('svg');
    if(svg){
     window.__vectorQA.pathsMatch=JSON.stringify([...svg.querySelectorAll('path')].map(p=>p.getAttribute('d')))===JSON.stringify(expected);
     const r=svg.getBoundingClientRect(),s=getComputedStyle(svg);
     window.__vectorQA.frames.push({at:t,stage:root===early?'early':'runtime',width:r.width,height:r.height,paths:svg.querySelectorAll('path').length,images:svg.querySelectorAll('image').length,mask:s.maskImage,color:getComputedStyle(svg.querySelector('path')).fill,hold:window.__mhBootVideoHold});
    }
    if(t<6500)requestAnimationFrame(frame);
   };requestAnimationFrame(frame);
  },paths);
  await p.goto('https://micahhoang.com/?vector-2x-qa='+mode,{waitUntil:'domcontentloaded'});
  let geometry=null;
  if(mode!=='mobile'&&mode!=='reduced'){
   await p.waitForFunction(()=>{const l=document.getElementById('__pt-boot-label');return l?.querySelector('svg')&&getComputedStyle(l).opacity==='1'});
   geometry=await p.locator('#__pt-boot-label > svg').evaluate(s=>{const r=s.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,pathCount:s.querySelectorAll('path').length,bitmapCount:s.querySelectorAll('image').length,viewBox:s.getAttribute('viewBox')};});
   await p.screenshot({path:'output/playwright/preloader-vector-2x-2026-10-23/'+(live?'published-':'')+mode+'.png'});
  }
  await p.waitForTimeout(3600);
  const r=await p.evaluate(()=>({...window.__vectorQA,bootNow:!!document.getElementById('__pt-boot'),coverNow:!!document.getElementById('__pt-first-paint'),coverStyleNow:!!document.getElementById('__pt-first-paint-style'),holdNow:window.__mhBootVideoHold}));
  results.push({mode,geometry,errors,pathsExactlyMatchFigma:r.pathsMatch,widths:[...new Set(r.frames.map(f=>f.width))],colors:[...new Set(r.frames.map(f=>f.color))],outerMasks:[...new Set(r.frames.map(f=>f.mask))],earlyFrames:r.frames.filter(f=>f.stage==='early').length,runtimeFrames:r.frames.filter(f=>f.stage==='runtime').length,events:r.events,bootNow:r.bootNow,coverNow:r.coverNow,coverStyleNow:r.coverStyleNow,holdNow:r.holdNow});
  await context.close();
 }
 return results;
};
const setup='async page=>{\n const head='+JSON.stringify(head)+',paths='+JSON.stringify(paths)+',live=false;';
fs.writeFileSync('output/playwright/preloader-vector-2x-2026-10-23/qa.js',qa.toString().replace('async page=>{',setup));
