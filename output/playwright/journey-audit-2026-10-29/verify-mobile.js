async page => {
 page.setDefaultTimeout(6000);const out='output/playwright/journey-audit-2026-10-29';const report={engine:page.context().browser().browserType().name(),version:page.context().browser().version()};
 await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(2500);
 const nav=()=>({url:location.href,y:scrollY,nav:[...document.querySelectorAll('nav a')].map(e=>{const r=e.getBoundingClientRect();return {text:e.innerText,x:r.x,y:r.y,w:r.width,h:r.height,opacity:getComputedStyle(e).opacity,hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('a')===e}})});
 report.aboutArrival=await page.evaluate(nav);await page.screenshot({path:`${out}/mobile-about-arrival-settled.png`,scale:'css'});
 await page.goBack();await page.waitForTimeout(1200);await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(1500);report.gaiaArrival=await page.evaluate(nav);
 await page.getByRole('heading',{name:'Interface',exact:true}).scrollIntoViewIfNeeded();await page.waitForTimeout(2500);await page.screenshot({path:`${out}/mobile-gaia-interface-settled.png`,scale:'css'});
 report.gaiaMedia=await page.evaluate(()=>({videos:[...document.querySelectorAll('video')].filter(e=>{const r=e.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight}).map(e=>({src:e.currentSrc,ready:e.readyState,paused:e.paused,error:e.error?.code})),images:[...document.images].filter(e=>{const r=e.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight}).map(e=>({src:e.currentSrc,alt:e.alt,loaded:e.complete&&e.naturalWidth>0}))}));
 await page.goto('https://micahhoang.com/',{waitUntil:'domcontentloaded'});await page.waitForTimeout(1800);
 const more=page.locator('a').filter({hasText:'READ MORE'}).filter({visible:true});await more.scrollIntoViewIfNeeded();await page.waitForTimeout(1000);await page.screenshot({path:`${out}/mobile-home-read-more.png`,scale:'css'});
 report.beforeTap={url:page.url(),href:await more.getAttribute('href')};await more.tap();await page.waitForTimeout(1500);report.afterTap={url:page.url(),y:await page.evaluate(()=>scrollY)};
 await page.locator('a[aria-label="About MIcah Hoang"]').tap();await page.waitForTimeout(2000);report.portraitDestination=page.url();
 return report;
}
