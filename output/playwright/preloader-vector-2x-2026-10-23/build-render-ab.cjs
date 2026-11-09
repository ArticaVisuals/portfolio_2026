const fs=require('fs');const svg=fs.readFileSync('assets/identity/micah-hoang-copyright.svg','utf8');
const fn=async page=>{
 const ctx=await page.context().browser().newContext({viewport:{width:800,height:220},deviceScaleFactor:2});const p=await ctx.newPage();
 await p.setContent('<!doctype html><style>html,body{margin:0;width:100%;height:100%;background:#233324}#container{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;color:#f7f5f0}svg{display:block;width:556px;height:auto}svg [fill="black"]:not(mask){fill:currentColor}svg [stroke="black"]{stroke:currentColor}</style><div id="container"><div id="label">'+svg+'</div></div>');
 for(const mode of ['normal','composited','precision']){
  await p.evaluate(mode=>{document.getElementById('container').style.willChange=mode==='composited'?'transform':'auto';document.getElementById('label').style.willChange=mode==='composited'?'opacity':'auto';document.querySelector('svg').style.shapeRendering=mode==='precision'?'geometricPrecision':'auto';},mode);
  await p.screenshot({path:'output/playwright/preloader-vector-2x-2026-10-23/render-ab-'+mode+'.png'});
 }
 await ctx.close();return {screenshotsSaved:true};
};fs.writeFileSync('output/playwright/preloader-vector-2x-2026-10-23/render-ab.js',fn.toString().replace('async page=>{','async page=>{const svg='+JSON.stringify(svg)+';'));
