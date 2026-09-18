async (page) => {
  const results = [];
  for (const mode of ['desktop', 'mobile']) {
    const context = await page.context().browser().newContext({viewport: {width: mode==='mobile'?390:1200, height:917}});
    const p = await context.newPage(), errors=[];
    p.on('pageerror', e=>errors.push(e.message));
    await p.bringToFront();
    await p.addInitScript(()=>{window.__bootSamples=[];function sample(t){window.__bootSamples.push({t,hold:window.__mhBootVideoHold,boot:!!document.getElementById('__pt-boot'),playing:[...document.querySelectorAll('video.selected-work-video')].filter(v=>!v.paused).length});if(t<3500)requestAnimationFrame(sample)}requestAnimationFrame(sample)});
    await p.goto('https://micahhoang.com/', {waitUntil:'domcontentloaded'});
    await p.waitForSelector('.selected-work-card-link[href]');
    await p.waitForTimeout(3500);
    const initial = await p.evaluate(()=>({bootSamples:window.__bootSamples,posters:[...document.querySelectorAll('.selected-work-poster')].map(i=>({complete:i.complete,opacity:getComputedStyle(i).opacity})),hold:window.__mhBootVideoHold,playing:[...document.querySelectorAll('video.selected-work-video')].filter(v=>!v.paused).length}));
    for (const method of ['logo','back','slow-video']) {
      await p.locator('.selected-work-card-link').first().click();
      await p.waitForURL('**/case-studies/gaia');
      await p.waitForTimeout(500);
      if(method==='slow-video') {
        await p.route('**/*.mp4*',async route=>{try{await p.waitForTimeout(700);await route.continue()}catch{}});
        // Playwright routing disables every HTTP cache. Restore it to isolate video delay.
        const cdp=await context.newCDPSession(p);
        await cdp.send('Network.setCacheDisabled',{cacheDisabled:false});
      }
      await p.evaluate(()=>{
        window.__thumbFrames=[];
        const start=performance.now();
        function frame(t){
          if(location.pathname==='/') window.__thumbFrames.push({t:Math.round(t-start),busy:!!document.querySelector('.selected-work-grid[aria-busy]'),cards:[...document.querySelectorAll('.selected-work-media')].map(m=>{const i=m.querySelector('img'),v=m.querySelector('video'),r=m.getBoundingClientRect();return {y:r.y,visible:r.bottom>0&&r.top<innerHeight,imgReady:!!(i?.complete&&i.naturalWidth),imgOpacity:i&&getComputedStyle(i).opacity,videoReady:v?.readyState,videoOpacity:v&&getComputedStyle(v).opacity,paused:v?.paused,skeleton:!!m.closest('[data-case-study-media-skeleton]')}})});
          if(t-start<1600)requestAnimationFrame(frame);
        }requestAnimationFrame(frame);
      });
      if(method==='back') await p.goBack();
      else await p.locator('nav a').filter({hasText:'Micah Hoang'}).first().click();
      await p.waitForURL('https://micahhoang.com/');
      await p.waitForTimeout(1700);
      const frames=await p.evaluate(()=>window.__thumbFrames);
      results.push({mode,method,initial,frames,errors:[...errors]});
      if(method==='logo') await p.screenshot({path:`output/playwright/home-thumbnail-return-2026-09-18/${mode}-after.png`});
    }
    await context.close();
  }
  return results;
}
