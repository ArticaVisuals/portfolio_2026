async page=>{
 const output=[];
 for(const path of ['/','/case-studies/optro','/case-studies/motion-connect-2025','/case-studies/seek-truth']) {
  for(const width of [320,390,430]){
   await page.setViewportSize({width,height:844});
   await page.goto('https://micahhoang.com'+path,{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>[...document.querySelectorAll('style')].some(s=>s.textContent.includes('--mh-footer-label-size')),{},{timeout:15000});
   await page.evaluate(()=>document.fonts.ready);
   const rows='[data-framer-name="Section CTA"] :is([data-framer-name="CTA Row"],a[data-framer-name="Row"])';
   await page.locator(rows).filter({visible:true}).first().scrollIntoViewIfNeeded();
   await page.waitForTimeout(250);
   output.push(await page.evaluate(({rows,path})=>({path,width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,rows:[...document.querySelectorAll(rows)].filter(e=>e.getBoundingClientRect().width).map(e=>({text:e.textContent,rect:e.getBoundingClientRect().toJSON(),gap:getComputedStyle(e.parentElement).rowGap,children:[...e.children].map(c=>({rect:c.getBoundingClientRect().toJSON(),font:getComputedStyle(c.querySelector('span,p')||c).fontSize})),hit:document.elementFromPoint(e.getBoundingClientRect().left+5,e.getBoundingClientRect().top+22)?.closest('a')===e}))}),{rows,path}));
   if(width===390)await page.screenshot({path:'output/playwright/mobile-footer-crx-2026-10-30/live-'+(path.split('/').pop()||'home')+'.png'});
  }
 }
 return output;
}
