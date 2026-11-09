const spec = {"targetId":"174:1639","pageId":"168:491","title":"Print Typography","fonts":{"regular":{"family":"GT Standard","style":"L Regular"},"heading":{"family":"GT Standard Trial","style":"L Rg"},"bold":{"family":"GT Standard Trial","style":"L Bd"},"mono":{"family":"GT Standard Mono","style":"Regular"}},"columns":[{"name":"Name","x":36,"w":230},{"name":"Size (pt)","x":290,"w":150},{"name":"Weight","x":480,"w":160},{"name":"Leading (pt)","x":664,"w":174},{"name":"Tracking","x":864,"w":160},{"name":"Sample (4×)","x":1064,"w":820}],"rows":[{"name":"Display","size":28,"weight":"700","leading":28,"tracking":0,"sample":"Micah Hoang","font":"bold","color":"#2C402D","height":172},{"name":"Heading","size":12,"weight":"700","leading":14,"tracking":0,"sample":"Experience","font":"bold","color":"#2C402D","height":136},{"name":"Body L","size":10,"weight":"400","leading":14,"tracking":0,"sample":"Dear Mackenzie,\nI’m Micah, a brand designer.","font":"regular","color":"#141414","height":168},{"name":"Title","size":8.5,"weight":"700","leading":10.5,"tracking":0,"sample":"Founder, National Park Playing Cards","font":"bold","color":"#141414","height":144},{"name":"Body M","size":8.5,"weight":"400","leading":10.5,"tracking":0,"sample":"Design and produce bespoke playing cards,\ndistributed across 220+ retail stores.","font":"regular","color":"#141414","height":164}],"notes":["Display: business cards · Heading: names / résumé sections · Body L: cover letter · Title: role names · Body M: résumé / contact details.","Sizes / leading in pt; samples at 4×. Refined scale: 28pt card display proposed; 8pt contacts consolidated to 8.5pt. Tracking 0% = InDesign 0."]};
if (!/Micah Hoang Personal Identity/.test(figma.root.name)) throw Error("Open the Micah Hoang Personal Identity file first.");
const target=await figma.getNodeByIdAsync(spec.targetId);
if(!target||target.parent.id!==spec.pageId)throw Error("Print target not found.");
for(const font of Object.values(spec.fonts))await figma.loadFontAsync(font);
const made=[],removed=[],mutated=[target.id];
const rgb=h=>({r:parseInt(h.slice(1,3),16)/255,g:parseInt(h.slice(3,5),16)/255,b:parseInt(h.slice(5,7),16)/255});
const fill=(h,o=1)=>[{type:"SOLID",color:rgb(h),opacity:o}];
const stage=figma.createFrame();stage.name="Print typography staging";stage.resize(1920,1080);stage.x=20000;stage.y=-1684;stage.fills=fill("#F7F5F0");stage.clipsContent=false;
function text(parent,name,value,x,y,w,size,font,color="#2C402D",line=18,tracking=0){
 const n=figma.createText();parent.appendChild(n);made.push(n.id);n.name=name;n.fontName=spec.fonts[font];n.fontSize=size;n.characters=value;n.lineHeight={unit:"PIXELS",value:line};n.letterSpacing={unit:"PERCENT",value:tracking};n.fills=fill(color);n.resize(w,Math.max(1,n.height));n.textAutoResize="HEIGHT";n.x=x;n.y=y;return n;
}
function rule(parent,w,opacity){const n=figma.createRectangle();parent.appendChild(n);made.push(n.id);n.name="Horizontal rule";n.resize(w,1);n.fills=fill("#2C402D",opacity);n.strokes=[];return n;}
try{
 text(stage,"Sheet title",spec.title,36,28,1280,32,"regular","#2C402D",40);
 const top=rule(stage,1848,.8);top.x=36;top.y=84;
 for(const c of spec.columns)text(stage,"Column / "+c.name,c.name,c.x,147,c.w,24,"heading","#2C402D",32);
 const table=figma.createFrame();stage.appendChild(table);made.push(table.id);table.name="Print hierarchy";table.layoutMode="VERTICAL";table.primaryAxisSizingMode="AUTO";table.counterAxisSizingMode="FIXED";table.itemSpacing=0;table.fills=[];table.clipsContent=false;table.resize(1848,790);table.x=36;table.y=197;
 rule(table,1848,.5);
 for(const r of spec.rows){
  const row=figma.createFrame();table.appendChild(row);made.push(row.id);row.name=r.name+" / Row";row.resize(1848,r.height);row.fills=[];row.clipsContent=false;
  const values=[r.name,String(r.size),r.weight,String(r.leading),"0%"];
  for(let i=0;i<5;i++)text(row,r.name+" / "+spec.columns[i].name,values[i],spec.columns[i].x-36,(r.height-18)/2,spec.columns[i].w,i===0?16:14,i===0?"regular":"mono");
  const sample=text(row,r.name+" / Specimen",r.sample,spec.columns[5].x-36,0,spec.columns[5].w,r.size*4,r.font,r.color,r.leading*4,r.tracking);
  sample.y=(r.height-sample.height)/2;
  rule(table,1848,.45);
 }
 text(stage,"Application guide",spec.notes[0],36,1020,1848,12,"regular","#525252",18);
 text(stage,"Scale convention",spec.notes[1],36,1044,1848,12,"mono","#525252",18);
 for(const n of [...target.children]){removed.push(n.id,...(n.findAll?n.findAll(()=>true).map(c=>c.id):[]));n.remove();}
 target.name="Typography / Print hierarchy";target.fills=fill("#F7F5F0");target.clipsContent=true;
 for(const n of [...stage.children])target.appendChild(n);
 stage.remove();
 target.exportSettings=[{format:"PNG",constraint:{type:"SCALE",value:1}}];
 figma.root.setSharedPluginData("micah_print_refinement","result",JSON.stringify({targetId:target.id,createdNodeIds:made,removedNodeIds:removed,mutatedNodeIds:mutated,rows:spec.rows.map(r=>({name:r.name,size:r.size,leading:r.leading}))}));
 figma.currentPage.selection=[target];figma.viewport.scrollAndZoomIntoView([target]);print({targetId:target.id,rows:spec.rows.length,created:made.length});
}catch(e){if(!stage.removed)stage.remove();throw e;}
