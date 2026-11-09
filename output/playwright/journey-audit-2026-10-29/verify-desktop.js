async page => {
 page.setDefaultTimeout(6000);
 const report={pages:[],keyboard:[]};
 const diag=()=>{
  const vis=e=>e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})&&e.getBoundingClientRect().width>0;
  const style=e=>{const s=getComputedStyle(e);return {color:s.color,background:s.backgroundColor,font:s.fontSize,opacity:s.opacity,outline:s.outline,shadow:s.boxShadow}};
  return {url:location.href,overflow:document.documentElement.scrollWidth-innerWidth,h1:[...document.querySelectorAll('h1')].filter(vis).map(e=>e.textContent),headings:[...document.querySelectorAll('h1,h2,h3')].filter(vis).map(e=>({text:e.textContent,...style(e)})),
   anchors:[...document.querySelectorAll('a')].filter(vis).map(e=>({text:e.innerText,href:e.href,label:e.getAttribute('aria-label'),hidden:e.getAttribute('aria-hidden'),html:e.outerHTML.slice(0,700),...style(e),rect:{w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}})),
   imgs:[...document.images].filter(vis).map(e=>({alt:e.alt,src:e.currentSrc||e.src,loaded:e.complete&&e.naturalWidth>0})),
   videos:[...document.querySelectorAll('video')].filter(vis).map(e=>({src:e.currentSrc,ready:e.readyState,error:e.error?.code,paused:e.paused,controls:e.controls,poster:e.poster})),bodyBackground:getComputedStyle(document.body).backgroundColor};
 };
 for(const route of ['/about','/','/case-studies/airpods','/case-studies/gaia']){
  await page.goto('https://micahhoang.com'+route,{waitUntil:'domcontentloaded'});await page.waitForTimeout(2200);
  report.pages.push(await page.evaluate(diag));
  if(route==='/'){
   for(let i=0;i<9;i++){await page.keyboard.press('Tab');report.keyboard.push(await page.evaluate(()=>{const e=document.activeElement,s=getComputedStyle(e),r=e.getBoundingClientRect();return {tag:e.tagName,text:e.innerText,href:e.getAttribute('href'),focusVisible:e.matches(':focus-visible'),outline:s.outline,shadow:s.boxShadow,rect:{x:r.x,y:r.y,w:r.width,h:r.height}}}));}
   await page.screenshot({path:'output/playwright/journey-audit-2026-10-29/desktop-home-keyboard.png'});
  }
 }
 return report;
}
