async page => {
 const context = await page.context().browser().newContext({ viewport:{width:390,height:844},deviceScaleFactor:1 });
 const fresh=await context.newPage();
 const results=[];
 try {
  await fresh.goto('https://micahhoang.com/about',{waitUntil:'domcontentloaded'});
  await fresh.locator('a[data-framer-name="Social Link"]').first().waitFor();
  await fresh.evaluate(()=>document.fonts.ready);
  for(const width of [320,390,430,699,810,1440]) {
   await fresh.setViewportSize({width,height:1000});
   await fresh.waitForTimeout(1200);
   const data=await fresh.evaluate(()=>{
    const links=[...document.querySelectorAll('a[data-framer-name="Social Link"]')].filter(e=>e.getBoundingClientRect().width>0).slice(0,4);
    const image=[...document.querySelectorAll('img')].find(e=>e.getAttribute('src')?.includes('geBwSsIC1HJB3whFBU4BH2joXW8') && e.getBoundingClientRect().width>0);
    return {width:innerWidth,image:image?.getBoundingClientRect().toJSON(),links:links.map(e=>({label:e.textContent,href:e.getAttribute('href'),rect:e.getBoundingClientRect().toJSON(),text:e.querySelector('p')?.getBoundingClientRect().toJSON(),align:getComputedStyle(e).alignItems})),overflow:document.documentElement.scrollWidth>innerWidth};
   });
   data.baselineDifference=data.image.bottom-data.links[3].text.bottom;
   data.touchTargetsPass=width>=700 || data.links.every(l=>l.rect.height>=44 && l.rect.width>=44);
   results.push(data);
   if(width===390 || width===1440) await fresh.screenshot({path:'output/playwright/about-social-alignment-2026-10-29/'+width+'.png'});
  }
  return results;
 } finally {await context.close();}
}
