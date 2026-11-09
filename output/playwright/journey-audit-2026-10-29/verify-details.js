async page => {
 const report={};page.setDefaultTimeout(6000);
 await page.getByRole('heading',{name:'Interface',exact:true}).scrollIntoViewIfNeeded();await page.waitForTimeout(2500);
 await page.screenshot({path:'output/playwright/journey-audit-2026-10-29/desktop-gaia-interface-settled.png',scale:'css'});
 report.gaia=await page.evaluate(()=>({headings:[...document.querySelectorAll('h3')].map(e=>({text:e.textContent,color:getComputedStyle(e).color,opacity:getComputedStyle(e).opacity})),body:[...document.querySelectorAll('p')].filter(e=>e.textContent.startsWith('A custom icon')).map(e=>({text:e.textContent,color:getComputedStyle(e).color,opacity:getComputedStyle(e).opacity})),images:[...document.images].filter(e=>{const r=e.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight}).map(e=>({src:e.currentSrc,alt:e.alt,loaded:e.complete&&e.naturalWidth>0})),videos:[...document.querySelectorAll('video')].filter(e=>{const r=e.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight}).map(e=>({src:e.currentSrc,ready:e.readyState,paused:e.paused,error:e.error?.code}))}));
 await page.goto('https://micahhoang.com/',{waitUntil:'domcontentloaded'});await page.waitForTimeout(1800);
 report.pills=await page.locator('a[href*="#service="]').evaluateAll(es=>es.slice(0,6).map(e=>({text:e.textContent,color:getComputedStyle(e).color,background:getComputedStyle(document.body).backgroundColor})));
 const card=page.getByRole('link',{name:'AirPods Pro 3 case study',exact:true});await card.scrollIntoViewIfNeeded();report.beforeBack=await page.evaluate(()=>scrollY);await card.click();await page.waitForTimeout(1500);await page.goBack();await page.waitForTimeout(1500);report.afterBack=await page.evaluate(()=>({url:location.href,y:scrollY,images:[...document.querySelectorAll('.selected-work-card img')].slice(0,2).map(e=>({complete:e.complete,width:e.naturalWidth,opacity:getComputedStyle(e).opacity}))}));
 const readMore=page.locator('a').filter({hasText:'READ MORE'}).filter({visible:true});report.desktopReadMore=await readMore.getAttribute('href');await readMore.click();await page.waitForTimeout(1500);report.desktopReadMoreDestination=page.url();
 const resume=page.locator('a[href$=".pdf"]').first();const url=await resume.getAttribute('href');const response=await page.request.get(url);report.resume={url,status:response.status(),contentType:response.headers()['content-type'],bytes:(await response.body()).length};report.mailto=await page.locator('a[href^="mailto:"]').first().getAttribute('href');
 await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(1200);
 await page.screenshot({path:'output/playwright/journey-audit-2026-10-29/desktop-about-arrival-settled.png',scale:'css'});
 return report;
}
