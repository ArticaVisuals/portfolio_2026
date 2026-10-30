async page=>{
 await page.addInitScript(()=>{window.__crxSamples=[];const start=performance.now();function sample(){const hs=[...document.querySelectorAll('h1')].filter(e=>e.getBoundingClientRect().width);if(hs.length===3){window.__crxSamples.push(hs.map(e=>({text:e.textContent,transform:getComputedStyle(e.parentElement).transform,opacity:getComputedStyle(e.parentElement).opacity})));}if(performance.now()-start<3500)requestAnimationFrame(sample);}requestAnimationFrame(sample);});
 const results=[];
 for(const reducedMotion of ['no-preference','reduce'])for(const width of [320,390,430]){
  await page.emulateMedia({reducedMotion});await page.setViewportSize({width,height:844});
  await page.goto('https://micahhoang.com/case-studies/optro',{waitUntil:'domcontentloaded'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(3000);
  results.push(await page.evaluate(({width,reducedMotion})=>{const heads=[...document.querySelectorAll('h1')].filter(e=>e.getBoundingClientRect().width);let defs=JSON.parse(document.getElementById('__framer__appearAnimationsContent').textContent);return {width,reducedMotion,overflow:document.documentElement.scrollWidth>innerWidth,rows:heads.map(e=>{let mask=e.parentElement.parentElement;while(mask&& !['hidden','clip'].includes(getComputedStyle(mask).overflow))mask=mask.parentElement;let er=e.getBoundingClientRect(),mr=mask.getBoundingClientRect();return {text:e.textContent,font:getComputedStyle(e).fontSize,rect:er.toJSON(),mask:mask.className,maskRect:mr.toJSON(),overflow:getComputedStyle(mask).overflow,within:er.left>=mr.left&&er.right<=mr.right+.1&&er.top>=mr.top-.1&&er.bottom<=mr.bottom+.1,animation:defs[e.parentElement.dataset.framerAppearId]};}),samples:window.__crxSamples.length,reducedBadSamples:reducedMotion==='reduce'?window.__crxSamples.filter(rows=>rows.some(r=>r.transform!=='none'||r.opacity!=='1')):[],firstSample:window.__crxSamples[0]};},{width,reducedMotion}));
  if(reducedMotion==='no-preference')await page.screenshot({path:'output/playwright/mobile-footer-crx-2026-10-30/crx-'+width+'.png'});
 }
 return results;
}
