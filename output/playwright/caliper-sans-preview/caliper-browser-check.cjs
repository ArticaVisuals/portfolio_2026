const fs = require('node:fs'); const {spawnSync}=require('node:child_process');
const script = async (page) => {
 const errors=[]; page.on('pageerror',error=>errors.push(error.message));
 const expect=(condition,message)=>{if(!condition)throw new Error(message)};
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.setViewportSize({width:1440,height:1000});
 await page.reload();
 await page.getByRole('button',{name:'A — Navy',exact:true}).click();
 const field=page.getByRole('textbox',{name:'Type your own text in Caliper Sans'});
 const root=page.getByRole('region',{name:'Caliper Sans interactive type specimen'});
 await page.waitForFunction(()=>{const p=document.querySelector('.caliper-input').placeholder.trim();return p.length>0&&p.length<9});
 const first=await field.getAttribute('placeholder');await page.waitForTimeout(180);
 expect(await field.getAttribute('placeholder')!==first,'Demo does not type');
 expect(await field.inputValue()==='','Demo polluted editable value');
 await page.waitForFunction(()=>document.querySelector('.caliper-input').placeholder==='Type here');
 expect(await field.evaluate(el=>getComputedStyle(el,'::placeholder').opacity)==='0.28','Placeholder not dimmed');
 await page.screenshot({path:'/tmp/caliper-ab-demo-navy.png',fullPage:true});
 await page.getByRole('button',{name:'B — Paper',exact:true}).click();
 const colors=await root.evaluate(el=>{const s=getComputedStyle(el);return {paper:s.backgroundColor,ink:s.color,border:s.borderTopColor,width:s.borderTopWidth,inner:getComputedStyle(el.querySelector('.caliper-sheet')).borderTopColor}});
 expect(colors.paper==='rgb(238, 238, 238)'&&colors.ink==='rgb(25, 25, 25)'&&colors.border===colors.inner&&colors.width==='1px','Paper palette/border incorrect');
 await page.screenshot({path:'/tmp/caliper-ab-demo-paper.png',fullPage:true});
 await field.click();await field.fill('Measured, not estimated.');await page.waitForTimeout(2600);
 expect(await field.inputValue()==='Measured, not estimated.','Demo overwrote user text');
 expect(await field.getAttribute('placeholder')==='Type here','Demo not stopped on interaction');
 await field.press('End');await field.press('Backspace');expect(await field.inputValue()==='Measured, not estimated','Native editing failed');
 expect(await root.getByRole('button').count()===0&&await root.getByRole('combobox').count()===0&&await root.getByRole('slider').count()===0,'Removed controls returned');
 expect(await page.locator('.caliper-stage').evaluate(el=>getComputedStyle(el).outlineStyle)==='none','Pointer outline returned');
 const checkNumbers=async()=>{
  const left=await page.locator('.caliper-guide-value[data-side=left]').allTextContents();
  const right=await page.locator('.caliper-guide-value[data-side=right]').allTextContents();
  expect(left.join(',')===right.join(','),'Metric sides differ');
  const overlap=await page.locator('.caliper-guide-value').evaluateAll(labels=>{const b=labels.map(el=>el.getBoundingClientRect());return b.some((a,i)=>b.slice(i+1).some(c=>a.left<c.right&&a.right>c.left&&a.top<c.bottom&&a.bottom>c.top))});
  expect(!overlap,'Metric numbers overlap');
 };
 await field.fill('H');await page.waitForTimeout(120);
 expect(await page.locator('.caliper-guide-value').count()===8,'Full set of metrics not mirrored at large size');
 for(const length of [6,12,20,30,50,90,150]){await field.fill('W'.repeat(length));await page.waitForTimeout(80);await checkNumbers();}
 expect(await page.locator('.caliper-guide-value').count()===0,'Crowded numbers did not disappear');
 expect(await page.locator('.caliper-guide').count()===4,'Guides disappeared with numbers');
 const states=[];
 for(const theme of ['A — Navy','B — Paper']){
  await page.getByRole('button',{name:theme,exact:true}).click();
  for(const width of [320,390,810,1200,1440]){
   await page.setViewportSize({width,height:1000});await field.fill('Caliper Sans');await page.waitForTimeout(120);
   const state=await root.evaluate(el=>({viewport:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,loaded:document.fonts.check('100px "Caliper Specimen 1003"'),size:getComputedStyle(el.querySelector('.caliper-input')).fontSize,color:getComputedStyle(el).color,detail:getComputedStyle(el.querySelector('.caliper-sheet')).borderTopColor}));
   expect(!state.overflow&&state.loaded,'Overflow/font failure '+theme+' '+width);await checkNumbers();
   const micro=await page.locator('.caliper-guide-value').evaluateAll(labels=>labels.map(el=>{const s=getComputedStyle(el);return {size:s.fontSize,color:s.color,opacity:s.opacity}}));
   expect(micro.every(s=>s.size==='12px'&&s.opacity==='1'&&s.color===state.detail),'Micro type differs');
   if(width===390||width===1440)await page.screenshot({path:'/tmp/caliper-ab-'+(theme.startsWith('A')?'navy':'paper')+'-'+width+'.png',fullPage:true});
   await field.fill('A long phrase with numerals 0123456789 and a tolerance of ±0.05. '.repeat(2));await page.waitForTimeout(100);
   expect(await page.locator('.caliper-guide-value').count()===0,'Long-text numbers remain');
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Long-text overflow');
   states.push({...state,theme});
  }
 }
 await field.fill('');await page.getByRole('button',{name:'B — Paper',exact:true}).click();await page.waitForTimeout(1800);
 expect(await field.getAttribute('placeholder')==='Type here','Demo restarted after user emptied field');
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await page.waitForTimeout(450);
 expect(await field.getAttribute('placeholder')==='Type here','Reduced-motion prompt not static');
 await page.waitForTimeout(650);expect(await field.getAttribute('placeholder')==='Type here','Reduced-motion animated');
 await page.emulateMedia({reducedMotion:'no-preference'});
 expect(errors.length===0,'Runtime errors: '+errors.join(', '));
 return {result:'passed',checks:['typing demo','dimmed placeholder','demo takeover/persistence','reduced motion','numeric mirroring and collision hiding','two colorways','light outer border','responsive typing','native editing','pointer focus','empty state'],states,errors};
};
const result=spawnSync('/Users/micahhoang/.codex/skills/playwright/scripts/playwright_cli.sh',['-s=caliper-preview','run-code',script.toString()],{encoding:'utf8'});
fs.writeFileSync(require('node:path').join(__dirname,'caliper-browser-check.txt'),result.stdout+result.stderr);console.log(result.stdout);console.error(result.stderr);process.exit(result.status);
