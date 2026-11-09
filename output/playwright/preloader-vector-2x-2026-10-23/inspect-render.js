async page=>{
 const context=await page.context().browser().newContext({viewport:{width:1440,height:1000},deviceScaleFactor:2});const p=await context.newPage();
 await p.goto('https://micahhoang.com/?vector-render-inspect=live',{waitUntil:'domcontentloaded'});
 await p.locator('#__pt-boot-label > svg').waitFor({state:'visible'});
 const result=await p.locator('#__pt-boot-label > svg').evaluate(svg=>{
  const read=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {tag:e.tagName,id:e.id,x:r.x,y:r.y,width:r.width,height:r.height,filter:s.filter,backdropFilter:s.backdropFilter,transform:s.transform,willChange:s.willChange,shapeRendering:s.shapeRendering,imageRendering:s.imageRendering,opacity:s.opacity,zIndex:s.zIndex};};
  const ancestry=[];for(let e=svg;e;e=e.parentElement)ancestry.push(read(e));
  const r=svg.getBoundingClientRect();
  return {devicePixelRatio,ancestry,firstPath:read(svg.querySelector('path')),topLayers:document.elementsFromPoint(r.x+r.width/2,r.y+r.height/2).slice(0,8).map(read),pathCount:svg.querySelectorAll('path').length,imageCount:svg.querySelectorAll('image').length};
 });await context.close();return result;
}
