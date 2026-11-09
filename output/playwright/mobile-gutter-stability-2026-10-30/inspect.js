async page => {
 const ctx=await page.context().browser().newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}); const p=await ctx.newPage();const out=[];
 for(const path of ['/','/about','/case-studies/gaia','/case-studies/airpods']){
 await p.goto('https://micahhoang.com'+path,{waitUntil:'domcontentloaded'});await p.waitForTimeout(1800);
 out.push(await p.evaluate(()=>({path:location.pathname,padded:[...document.querySelectorAll('[data-framer-name]')].filter(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>=350&&r.height>0&&(parseFloat(s.paddingLeft)===15||parseFloat(s.paddingRight)===15)}).map(e=>({name:e.dataset.framerName,cls:e.className,pad:getComputedStyle(e).padding})),text:[...document.querySelectorAll('p,h1,h2,h3,[data-framer-name="CTA Row"]')].filter(e=>e.getBoundingClientRect().height>0).map(e=>{const s=getComputedStyle(e);return {text:e.textContent.slice(0,65),cls:e.className,name:e.parentElement.dataset.framerName,size:s.fontSize,line:s.lineHeight,spacing:s.letterSpacing,font:s.fontFamily,html:e.closest('[data-framer-name="CTA Row"]')?.outerHTML}})})));
 }await ctx.close();return out;
}
