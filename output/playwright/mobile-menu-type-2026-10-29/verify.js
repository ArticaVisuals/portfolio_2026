async page => {
 const context=await page.context().browser().newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const p=await context.newPage();
 try {
  await p.goto('https://micahhoang.com/',{waitUntil:'domcontentloaded'});
  await p.getByRole('button',{name:'Menu',exact:true}).waitFor({timeout:45000});
  await p.evaluate(()=>document.fonts.ready);
  const reference=await p.evaluate(()=>{
   const e=[...document.querySelectorAll('[data-framer-name="Section Selected Works"] h2')].find(e=>e.textContent.toLowerCase()==='selected');
   return e ? {text:e.textContent,preset:e.getAttribute('data-styles-preset'),className:e.className,size:getComputedStyle(e).fontSize,family:getComputedStyle(e).fontFamily}:null;
  });
  const results=[];
  await p.getByRole('button',{name:'Menu',exact:true}).click();
  await p.getByRole('dialog',{name:'Main navigation'}).waitFor();
  for(const width of [320,390,430,809]) {
   await p.setViewportSize({width,height:844});
   await p.waitForTimeout(200);
   results.push(await p.evaluate(()=>{
    const root=document.querySelector('[role="dialog"][aria-label="Main navigation"]');
    return {width:innerWidth,links:[...root.querySelectorAll('[data-framer-name="Routes"] a')].map(a=>{
     const text=a.querySelector('[data-styles-preset]'); const s=getComputedStyle(text);
     return {label:a.textContent,preset:text.getAttribute('data-styles-preset'),size:s.fontSize,family:s.fontFamily,weight:s.fontWeight,lineHeight:s.lineHeight,transform:s.textTransform,rowHeight:a.getBoundingClientRect().height,href:a.getAttribute('href')};
    }),overflow:document.documentElement.scrollWidth>innerWidth};
   }));
   if(width===390) await p.screenshot({path:'output/playwright/mobile-menu-type-2026-10-29/mobile-menu.png'});
  }
  await p.keyboard.press('Escape');
  await p.getByRole('button',{name:'Menu',exact:true}).waitFor();
  const closed=true;
  return {reference,results,escapeCloses:closed};
 } finally {await context.close();}
}
