const fs = require('node:fs'); const {spawnSync}=require('node:child_process');
const script = async (page) => {
 await page.setViewportSize({width:1440,height:1000});
 const field=page.getByRole('textbox',{name:'Type your own text in Caliper Sans'});
 await field.click();await field.fill('Caliper');await page.waitForTimeout(100);
 await page.evaluate(()=>{
  const field=document.querySelector('.caliper-input');const stage=document.querySelector('.caliper-stage');
  const context=document.createElement('canvas').getContext('2d');context.font='400 100px "Caliper Specimen 1003"';
  window.__caliperFrames=[];window.__caliperFrameCheckRunning=true;
  function frame(time){
   const value=field.value||'Type here';const m=context.measureText(value);const textWidth=Math.max(m.width,m.actualBoundingBoxLeft+m.actualBoundingBoxRight,1);
   const width=stage.clientWidth;const height=Math.max(300,Math.min(480,width*.4));const gutter=width<700?40:56;
   const expected=Math.floor(Math.max(20,Math.min(320,(height-106)/1.2,(width-gutter*2-4)/textWidth*100)));
   const actual=parseFloat(getComputedStyle(field).fontSize);
   window.__caliperFrames.push({time,value,expected,actual,scrollLeft:field.scrollLeft});
   if(window.__caliperFrameCheckRunning)requestAnimationFrame(frame);
  }requestAnimationFrame(frame);
 });
 await field.press('End');await field.pressSequentially(' Sans — measured typography 0123456789 at every scale',{delay:42});
 await field.press('Backspace');await field.press('Backspace');await field.press('Backspace');
 await page.waitForTimeout(120);
 const results=await page.evaluate(()=>{window.__caliperFrameCheckRunning=false;return {frames:window.__caliperFrames.length,mismatches:window.__caliperFrames.filter(f=>f.actual!==f.expected),scrollingFrames:window.__caliperFrames.filter(f=>f.scrollLeft!==0)};});
 await field.fill('Caliper Sans');return results;
};
const result=spawnSync('/Users/micahhoang/.codex/skills/playwright/scripts/playwright_cli.sh',['-s=caliper-preview','run-code',script.toString()],{encoding:'utf8'});
fs.writeFileSync(require('node:path').join(__dirname,'caliper-frame-'+(process.argv[2]||'check')+'.txt'),result.stdout+result.stderr);console.log(result.stdout);console.error(result.stderr);process.exit(result.status);
