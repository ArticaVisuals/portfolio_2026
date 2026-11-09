const fs=require('fs');
const p='code/components/PageTransition.tsx';let s=fs.readFileSync(p,'utf8');
const svg=fs.readFileSync('assets/identity/micah-hoang-copyright.svg','utf8').trim();
const a=s.indexOf('// Figma identity, node 91:521.');
const b=s.indexOf('const BOOT_FIRST_PAINT_GUARD_JS',a);
if(a<0||b<a)throw new Error('Missing presentation source markers');
const section='// Original Figma SVG, node 91:521, rendered as DOM vectors in both loader stages.\n'+
'// Geometry and internal copyright mask stay intact; CSS applies the existing color.\n'+
'// Roughly 2x the previous footprint, with whole-pixel desktop/tablet widths.\n'+
'// Regenerate the Framer Preloaders head entry with `node code/tools/sync-boot-head.mjs`.\n'+
'const BOOT_WORDMARK_SVG = '+JSON.stringify(svg)+'\n'+
'const BOOT_PRESENTATION_CSS = `\n'+
'html #${BOOT_LABEL_ID}{font-size:0!important;}\n'+
'html #${BOOT_LABEL_ID}>svg,html #${BOOT_FIRST_PAINT_ID}>svg{display:block;width:556px;height:auto;max-width:calc(100vw - 64px);flex:none;}\n'+
'html #${BOOT_LABEL_ID}>svg [fill="black"]:not(mask),html #${BOOT_FIRST_PAINT_ID}>svg [fill="black"]:not(mask){fill:currentColor;}\n'+
'html #${BOOT_LABEL_ID}>svg [stroke="black"],html #${BOOT_FIRST_PAINT_ID}>svg [stroke="black"]{stroke:currentColor;}\n'+
'@media(max-width:1199px){html #${BOOT_LABEL_ID}>svg,html #${BOOT_FIRST_PAINT_ID}>svg{width:444px;}}\n'+
'`\n'+
'const BOOT_FIRST_PAINT_CSS = `\n'+
'#${BOOT_FIRST_PAINT_ID}{position:fixed;top:0;right:0;bottom:auto;left:0;width:100%;height:100vh;min-height:100vh;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:32px;background:${DEFAULT_BOOT_COLOR};color:${PAGE_THEME_COLOR};z-index:2147483599;pointer-events:none;}\n'+
'@supports(height:100dvh){#${BOOT_FIRST_PAINT_ID}{height:100dvh;min-height:100dvh;}}\n'+
'@media(max-width:${BOOT_DISABLE_MAX_WIDTH_PX}px),(prefers-reduced-motion:reduce){#${BOOT_FIRST_PAINT_ID}{display:none;}}\n'+
'`\n';
s=s.slice(0,a)+section+s.slice(b);
s=s.replace('    var coverId = ${JSON.stringify(BOOT_FIRST_PAINT_ID)};','    var wordmark = ${JSON.stringify(BOOT_WORDMARK_SVG)};\n    var coverId = ${JSON.stringify(BOOT_FIRST_PAINT_ID)};');
s=s.replace('    if (existingBoot) { holdBootVideos(existingBoot); return; }','    if (existingBoot) { installWordmark(); holdBootVideos(existingBoot); return; }');
s=s.replace('    var cover = document.createElement("style");\n    cover.id = coverId;\n    cover.textContent = ${JSON.stringify(BOOT_FIRST_PAINT_CSS)};\n    parent.appendChild(cover);',
'    var coverStyle = document.createElement("style");\n'+
'    coverStyle.id = coverId + "-style";\n'+
'    coverStyle.textContent = ${JSON.stringify(BOOT_FIRST_PAINT_CSS)};\n'+
'    parent.appendChild(coverStyle);\n'+
'    var cover = document.createElement("div");\n'+
'    cover.id = coverId;\n'+
'    cover.setAttribute("aria-hidden", "true");\n'+
'    cover.innerHTML = wordmark;\n'+
'    document.documentElement.appendChild(cover);');
s=s.replace('    function holdBootVideos(boot) {','    function installWordmark() {\n'+
'      var label = document.getElementById(${JSON.stringify(BOOT_LABEL_ID)});\n'+
'      if (label && !label.querySelector("svg")) label.innerHTML = wordmark;\n'+
'    }\n'+
'    function holdBootVideos(boot) {');
s=s.replace('      if (cover.parentNode) cover.parentNode.removeChild(cover);','      if (cover.parentNode) cover.parentNode.removeChild(cover);\n      if (coverStyle.parentNode) coverStyle.parentNode.removeChild(coverStyle);');
s=s.replace('      if (!boot) return false;\n      holdBootVideos(boot);','      if (!boot) return false;\n      installWordmark();\n      holdBootVideos(boot);');
s=s.replace('    if (stale && stale.parentNode) stale.parentNode.removeChild(stale);','    if (stale && stale.parentNode) stale.parentNode.removeChild(stale);\n'+
'    var staleStyle = document.getElementById(${JSON.stringify(BOOT_FIRST_PAINT_ID)} + "-style");\n'+
'    if (staleStyle && staleStyle.parentNode) staleStyle.parentNode.removeChild(staleStyle);');
fs.writeFileSync(p,s);
console.log('Updated SVG presentation and handoff; original asset is unchanged.');
