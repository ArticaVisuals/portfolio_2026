async page => {
  const out = 'output/playwright/journey-polish-2026-10-29';
  const mobile = page.viewportSize().width < 810;
  const mode = mobile ? 'mobile' : 'desktop';
  const report = { mode, viewport: page.viewportSize(), pages: [] };
  page.setDefaultTimeout(10000);
  const inspect = () => {
    const shown = e => { const r=e.getBoundingClientRect(); return r.width>0 && r.height>0; };
    return {
      url:location.href, overflow:document.documentElement.scrollWidth-innerWidth,
      headings:[...document.querySelectorAll('h1,h2,h3')].filter(shown).map(e=>({tag:e.tagName,text:e.textContent.trim(),color:getComputedStyle(e).color})),
      nav:[...document.querySelectorAll('nav a')].filter(shown).map(e=>{const r=e.getBoundingClientRect();return {text:e.innerText,href:e.getAttribute('href'),x:r.x,y:r.y,w:r.width,h:r.height,hit:document.elementFromPoint(r.x+r.width/2,r.y+3)?.closest('a')===e}}),
      gray:[...document.querySelectorAll('p,span,button')].filter(shown).filter(e=>getComputedStyle(e).color==='rgb(112, 112, 112)').map(e=>({text:e.textContent.slice(0,80),color:getComputedStyle(e).color})).slice(0,15),
      links:[...document.querySelectorAll('a')].filter(shown).filter(e=>/RESUME|LINKEDIN|EMAIL|GITHUB|READ MORE/.test(e.textContent)).map(e=>{const r=e.getBoundingClientRect();return{text:e.innerText,href:e.getAttribute('href'),h:r.height,w:r.width}}),
      genericAlts:[...document.images].filter(e=>/Case study media|GaiaLogoAnimation/.test(e.alt)).map(e=>e.alt)
    };
  };
  for(const [name,path] of [['home','/'],['airpods','/case-studies/airpods'],['gaia','/case-studies/gaia'],['about','/about']]) {
    await page.goto('https://micahhoang.com'+path,{waitUntil:'domcontentloaded'});
    await page.waitForTimeout(2300);
    report.pages.push({name,...await page.evaluate(inspect)});
    await page.screenshot({path:`${out}/${mode}-${name}-top.png`,scale:'css'});
    if(name==='gaia') {
      await page.getByRole('heading',{name:'Interface',exact:true}).scrollIntoViewIfNeeded();
      await page.waitForTimeout(1800);
      report.gaiaImages=await page.locator('img').evaluateAll(es=>es.map(e=>({alt:e.alt,loaded:e.complete&&e.naturalWidth>0})).filter(e=>e.alt));
      await page.screenshot({path:`${out}/${mode}-gaia-interface.png`,scale:'css'});
    }
  }
  await page.goto('https://micahhoang.com/',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(1800);
  const more=page.locator('a').filter({hasText:'READ MORE'}).filter({visible:true});
  await more.scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
  report.readMore={href:await more.getAttribute('href'),box:await more.boundingBox()};
  await page.screenshot({path:`${out}/${mode}-read-more.png`,scale:'css'});
  if(mobile)await more.tap();else await more.click();
  await page.waitForTimeout(1800); report.readMore.destination=page.url();
  return report;
}
