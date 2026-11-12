import { build } from 'esbuild'
import { createServer } from 'node:http'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { cmsRows } from './fixtures.mjs'
const here=path.dirname(fileURLToPath(import.meta.url))
const root=path.resolve(here,'../../..')
const baseline='8670d0b'
const port=Number(process.env.PORT||8766)
async function bundle(version, reduce=false){
 const source=async file=>version==='before'?execFileSync('git',['show',`${baseline}:code/components/${file}`],{cwd:root,encoding:'utf8'}):readFile(path.join(root,'code/components',file),'utf8')
 const result=await build({entryPoints:[path.join(here,'frame.tsx')],bundle:true,write:false,format:'esm',platform:'browser',target:'es2022',jsx:'automatic',nodePaths:[path.join(here,'node_modules')],plugins:[{
  name:'local-framer-component-preview',setup(b){
   b.onResolve({filter:/^preview-component$/},()=>({path:'IndexPageGridPreview.tsx',namespace:'portfolio-component'}))
   b.onResolve({filter:/^https:\/\/framer.com\/m\/IndexPage-msQHCf.js/},()=>({path:'IndexPage.tsx',namespace:'portfolio-component'}))
   b.onLoad({filter:/.*/,namespace:'portfolio-component'},async args=>{
    let contents=await source(args.path)
    // CSS media queries cannot be emulated by matchMedia. In this preview
    // bundle only, activate the component's own reduced-motion CSS blocks.
    if(reduce)contents=contents.replace(/(@media[^{}]*?)\(prefers-reduced-motion:\s*reduce\)/g,'$1(min-width: 0px)')
    return {contents,loader:'tsx',resolveDir:path.join(here)}
   })
   b.onResolve({filter:/^framer$/},()=>({path:'framer',namespace:'preview-shim'}))
   b.onLoad({filter:/.*/,namespace:'preview-shim'},()=>({contents:'export const addPropertyControls=()=>{}; export const ControlType=new Proxy({}, {get:(_,key)=>key}); export const RenderTarget={canvas:"canvas",preview:"preview",current:()=>"preview"};',loader:'js'}))
  }
 }]})
 return result.outputFiles[0].contents
}
if(process.argv.includes('--build')){
 await mkdir(path.join(here,'.generated'),{recursive:true})
 for(const version of ['before','after'])await writeFile(path.join(here,'.generated',version+'.js'),await bundle(version))
 console.log('Built baseline and proposed bundles from actual components.')
}else{
 const types={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.css':'text/css; charset=utf-8'}
 const server=createServer(async(req,res)=>{
  try{
   const u=new URL(req.url,'http://localhost')
   let body,type='text/javascript; charset=utf-8'
   if(u.pathname==='/after.js'||u.pathname==='/before.js')body=await bundle(u.pathname.includes('before')?'before':'after',u.searchParams.get('motion')==='reduce')
   else if(u.pathname==='/mock-cms.mjs'){
    const scenario=u.searchParams.get('scenario')
    const delay=u.searchParams.get('delay')==='8000'?8000:1800
    body=`export const a={collectionByLocaleId:{default:{async scanItems(){await new Promise(r=>setTimeout(r,${delay}));${scenario==='error'?'throw new Error("Preview-only CMS failure");':`return ${JSON.stringify(scenario==='empty'?[]:cmsRows())};`}}}}};`
   }else{
    const allowed={'/':'index.html','/index.html':'index.html','/frame.html':'frame.html'}
    let file
    if(allowed[u.pathname])file=path.join(here,allowed[u.pathname])
    else if(/^\/samples\/[a-z0-9-]+\.jpg$/.test(u.pathname))file=path.join(root,'code/design-system/assets',u.pathname.slice(1))
    else {res.writeHead(404);res.end('Not found');return}
    body=await readFile(file);type=types[path.extname(file)]||'application/octet-stream'
   }
   res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});res.end(body)
  }catch(error){console.error(error.message);res.writeHead(500,{'Content-Type':'text/plain'});res.end('Preview build failed: '+error.message)}
 })
 server.listen(port,'127.0.0.1',()=>console.log(`Index motion preview: http://127.0.0.1:${port}`))
}
