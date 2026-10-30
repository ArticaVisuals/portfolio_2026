async page=>{
 const c=await page.context().browser().newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const p=await c.newPage();const results=[];
 for(const route of ['/','/index']){
 await p.goto('https://micahhoang.com'+route,{waitUntil:'domcontentloaded'});
 await p.waitForTimeout(2000);
 if(route==='/index'){await p.getByRole('button',{name:'grid',exact:true}).click();await p.locator('.idx-grid-card-tag').first().waitFor();}else await p.locator('.selected-work-tag').first().waitFor();
 const selector=route==='/'?'.selected-work-tags':'.idx-grid-card-tags';
 for(const width of [320,390,430,1200]){
 await p.setViewportSize({width,height:844});await p.waitForTimeout(100);
 results.push(await p.evaluate(({route,selector})=>({route,width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,rows:[...document.querySelectorAll(selector)].map(e=>({h:e.clientHeight,w:e.clientWidth,scrollWidth:e.scrollWidth,wrap:getComputedStyle(e).flexWrap,tags:[...e.children].map(t=>({text:t.textContent,w:t.getBoundingClientRect().width,h:t.getBoundingClientRect().height,y:t.getBoundingClientRect().y,color:getComputedStyle(t).color,padding:getComputedStyle(t).paddingInline}))}))}),{route,selector}));
 }
 await p.setViewportSize({width:390,height:844});await p.locator(selector).first().scrollIntoViewIfNeeded();await p.waitForTimeout(500);await p.screenshot({path:'output/playwright/pill-refinement-2026-10-30/'+(route==='/'?'home':'index')+'.png'});
 const row=p.locator(selector).first();results.push({route,scroll:await row.evaluate(e=>{e.scrollLeft=1000;return {left:e.scrollLeft,max:e.scrollWidth-e.clientWidth}})});
 }
 await p.locator('.idx-grid-card-tag').first().click();await p.waitForTimeout(400);results.push({active:await p.locator('.idx-grid-card-tag[data-active="true"]').first().evaluate(e=>({color:getComputedStyle(e).color,pressed:e.getAttribute('aria-pressed')}))});
 await c.close();return results;
}
