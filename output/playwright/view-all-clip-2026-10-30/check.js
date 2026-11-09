async page => {
  const results=[];
  for(const width of [320,390,430,1440]){
    await page.setViewportSize({width,height:844});
    await page.goto('https://micahhoang.com',{waitUntil:'domcontentloaded'});
    const link=page.locator('a[data-framer-name^="Text Link"]').filter({hasText:'VIEW ALL'}).first();
    await link.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const measure=()=>link.evaluate(e=>{
      const mask=e.firstElementChild, m=mask.getBoundingClientRect();
      return {name:e.dataset.framerName,href:e.getAttribute('href'),target:e.getBoundingClientRect().height,mask:m.height,overflow:getComputedStyle(mask).overflow,nested:e.querySelectorAll('[data-nested-link],a').length,lines:Array.from(mask.children).map(t=>{const r=t.getBoundingClientRect();return Math.max(0,Math.min(r.bottom,m.bottom)-Math.max(r.top,m.top));})};
    });
    const idle=await measure();
    if(width===390)await page.screenshot({path:'output/playwright/view-all-clip-2026-10-30/mobile-published.png'});
    await link.hover(); await page.waitForTimeout(500);
    results.push({width,idle,hover:await measure()});
  }
  return results;
}
