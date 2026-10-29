async page => {
 const mobile=page.viewportSize().width<810, mode=mobile?'mobile':'desktop';
 const out='output/playwright/journey-polish-2026-10-29';
 const result={mode,stops:[],errors:[]};
 const error=e=>result.errors.push(String(e));page.on('pageerror',error);
 const settle=()=>page.waitForTimeout(1800);
 const check=async label=>{
  await page.evaluate(()=>scrollTo(0,0));await settle();
  result.stops.push({label,...await page.evaluate(()=>({url:location.href,overflow:document.documentElement.scrollWidth-innerWidth,h1:[...document.querySelectorAll('h1')].filter(e=>e.getBoundingClientRect().height>0).map(e=>e.textContent),nav:[...document.querySelectorAll('nav a')].filter(e=>e.getBoundingClientRect().height>0).map(e=>{const r=e.getBoundingClientRect();return{text:e.innerText,w:r.width,h:r.height,edgeHit:document.elementFromPoint(r.x+r.width/2,r.top+2)?.closest('a')===e,dupes:e.querySelectorAll('[data-mh-roll-dupe]').length}}),nested:document.querySelectorAll('a a').length}))});
 };
 const activate=async link=>{await link.scrollIntoViewIfNeeded();if(mobile)await link.tap();else await link.click();await settle()};
 await page.goto('https://micahhoang.com/',{waitUntil:'domcontentloaded'});await check('Home');
 await activate(page.locator('a[href*="/case-studies/airpods"]').filter({visible:true}).first());await check('AirPods');
 await page.goBack();await settle();result.back=page.url();
 await activate(page.locator('a[href*="/case-studies/gaia"]').filter({visible:true}).first());await check('Gaia');
 await page.screenshot({path:`${out}/${mode}-gaia-final.png`,scale:'css'});
 const about=page.locator('nav a').filter({hasText:'ABOUT'}).filter({visible:true});
 if(mobile){const r=await about.boundingBox();await page.touchscreen.tap(r.x+r.width/2,r.y+2);await settle()}else await activate(about);
 await check('About via nav');
 await page.goto('https://micahhoang.com/',{waitUntil:'domcontentloaded'});await settle();
 const more=page.locator('a').filter({hasText:'READ MORE'}).filter({visible:true});await activate(more);result.readMore=page.url();
 const resume=page.locator('a').filter({hasText:/^RESUME$/}).filter({visible:true}).first();
 const href=await resume.getAttribute('href');const response=await page.request.get(href);result.resume={height:(await resume.boundingBox()).height,status:response.status(),type:response.headers()['content-type']};
 if(mobile){
  result.widths=[];
  for(const width of [320,375,390]){await page.setViewportSize({width,height:664});await settle();result.widths.push(await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth,navFits:[...document.querySelectorAll('nav a')].every(a=>{const r=a.getBoundingClientRect();return r.x>=0&&r.right<=innerWidth})})));}
 } else {
  const link=page.locator('nav a').filter({hasText:'ABOUT'}).filter({visible:true});await link.hover();await page.waitForTimeout(500);result.hover={href:await link.getAttribute('href'),box:await link.boundingBox()};await page.mouse.move(700,500);await page.waitForTimeout(500);
  await link.focus();result.focus=await link.evaluate(e=>({outline:getComputedStyle(e).outlineStyle,focused:document.activeElement===e}));
 }
 await page.screenshot({path:`${out}/${mode}-about-final.png`,scale:'css'});
 page.off('pageerror',error);return result;
}
