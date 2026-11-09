async page=>{
 const c=await page.context().browser().newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const p=await c.newPage();const out=[];
 try{for(const route of ['/','/index','/about']){
 await p.goto('https://micahhoang.com'+route,{waitUntil:'domcontentloaded'});await p.waitForTimeout(2000);
 for(const width of [320,390,430]){await p.setViewportSize({width,height:844});await p.waitForTimeout(150);
 out.push(await p.evaluate(({route,width})=>({route,width,overflow:document.documentElement.scrollWidth>innerWidth,targets:[...document.querySelectorAll('a[data-framer-name="Social Link"],a[data-framer-name^="Text Link"],.selected-work-tag,.idx-tax-item,.idx-view-toggle-option,.mh-scroll-top-button')].filter(e=>e.getBoundingClientRect().width).map(e=>{const r=e.getBoundingClientRect();return {text:e.getAttribute('aria-label')||e.innerText,w:r.width,h:r.height,cls:e.className}})}),{route,width}));
 }await p.setViewportSize({width:390,height:844});
 if(route==='/index'){await p.getByRole('button',{name:'2026',exact:true}).tap();out.push({filter:p.url(),pressed:await p.getByRole('button',{name:'2026',exact:true}).getAttribute('aria-pressed')});await p.getByRole('button',{name:'list',exact:true}).tap();out.push({list:await p.getByRole('button',{name:'list',exact:true}).getAttribute('aria-pressed')});}
 if(route==='/'){await p.locator('a[data-framer-name="Text Link Black"]').filter({hasText:'VIEW ALL'}).scrollIntoViewIfNeeded();await p.screenshot({path:'output/playwright/mobile-fixes-2026-10-30/home-view-all.png'});await p.locator('a[data-framer-name="Text Link Black"]').filter({hasText:'VIEW ALL'}).tap();await p.waitForURL('**/index');out.push({viewAll:true});}
 if(route==='/about'){await p.screenshot({path:'output/playwright/mobile-fixes-2026-10-30/about-top.png'});}
 }
 await p.goto('https://micahhoang.com/case-studies/airpods');await p.waitForTimeout(2000);
 const gallery=p.locator('video[src*="lpU1"]').first();out.push({galleryExists:await gallery.count()});
 if(await gallery.count()){await gallery.scrollIntoViewIfNeeded();await p.waitForTimeout(1500);out.push({gallery:await gallery.evaluate(e=>({paused:e.paused,ready:e.readyState,height:e.getBoundingClientRect().height}))});}
 await p.getByRole('button',{name:'Menu',exact:true}).tap();await p.getByRole('dialog',{name:'Main navigation'}).waitFor();out.push({menu:true});await p.getByRole('button',{name:'Close menu',exact:true}).tap();
 }finally{await c.close();}return out;
}
