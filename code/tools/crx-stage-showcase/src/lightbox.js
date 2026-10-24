const inline=document.querySelector('#inline-stage');
const host=document.querySelector('#inline-host');
const status=document.querySelector('#inline-status');
const viewerURL=new URL('./viewer.html?inline=1',location.href);
if(import.meta.env.DEV && new URLSearchParams(location.search).has('inspect'))viewerURL.searchParams.set('inspect','');
let frame,timeout,inView=false,loaded=false;
function visibility(){frame?.contentWindow?.postMessage({type:'crx-stage:visibility',visible:!document.hidden&&inView},viewerURL.origin);}
function load(){
  clearTimeout(timeout);loaded=true;host.replaceChildren();
  status.textContent='Opening the stage…';status.hidden=false;
  frame=document.createElement('iframe');
  frame.title='Explore the CRX 2026 stage';frame.allow='autoplay';
  frame.addEventListener('load',visibility);frame.src=viewerURL.href;host.append(frame);
  timeout=setTimeout(()=>{
    host.replaceChildren();frame=null;status.textContent='The stage is taking longer than expected.';
    const retry=document.createElement('button');retry.textContent='Try again';retry.addEventListener('click',load);status.append(retry);
  },25000);
}
new IntersectionObserver(entries=>{
  inView=entries[0].isIntersecting;
  if(inView&&!loaded)load();
  visibility();
},{threshold:0}).observe(inline);
window.addEventListener('message',e=>{
  if(!frame||e.source!==frame.contentWindow||e.origin!==viewerURL.origin)return;
  if(e.data?.type==='crx-stage:ready'){clearTimeout(timeout);status.hidden=true;visibility();}
  if(e.data?.type==='crx-stage:scroll'){
    const {deltaX,deltaY}=e.data;
    if(Number.isFinite(deltaX)&&Number.isFinite(deltaY))window.scrollBy({left:Math.max(-1000,Math.min(1000,deltaX)),top:Math.max(-1000,Math.min(1000,deltaY)),behavior:'instant'});
  }
});
document.addEventListener('visibilitychange',visibility);
