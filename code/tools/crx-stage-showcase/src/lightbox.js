const opener=document.querySelector('#inline-stage');
const dialog=document.querySelector('#stage-dialog');
const inline=document.querySelector('#inline-stage');
const inlineHost=document.querySelector('#inline-host');
const modalHost=document.querySelector('#frame-host');
const inlineStatus=document.querySelector('#inline-status');
const modalStatus=document.querySelector('#stage-status');
const close=document.querySelector('#close-stage');
const viewerURL=new URL('./viewer.html',location.href);
const motionButtons=[...document.querySelectorAll('[data-motion]')];
let frame,timeout,previousOverflow,inView=false,loaded=false;
let playing=!matchMedia('(prefers-reduced-motion: reduce)').matches;
let explicitMotion=false;
function send(type,data={}){frame?.contentWindow?.postMessage({type,...data},viewerURL.origin);}
function visibility(){send('crx-stage:visibility',{visible:!document.hidden&&(dialog.open||inView)});}
function updateMotion(){
  for(const button of motionButtons){
    button.setAttribute('aria-label',playing?'Pause motion':'Play motion');
    button.title=playing?'Pause motion':'Play motion';
    const path=button.querySelector('path');
    if(path)path.setAttribute('d',playing?'M9 6v12M15 6v12':'m8 5 11 7-11 7Z');
    else button.textContent=playing?'Pause motion':'Play motion';
  }
}
function load(){
  clearTimeout(timeout);loaded=true;
  // Keep one active renderer across inline and expanded modes.
  inlineHost.replaceChildren();modalHost.replaceChildren();frame=null;
  const host=dialog.open?modalHost:inlineHost;
  const status=dialog.open?modalStatus:inlineStatus;
  inlineStatus.hidden=true;modalStatus.hidden=true;
  status.textContent='Opening the stage…';status.hidden=false;
  frame=document.createElement('iframe');
  frame.title='Explore the CRX 2026 stage';frame.allow='autoplay';
  const url=new URL(viewerURL);if(!dialog.open)url.searchParams.set('inline','1');
  frame.addEventListener('load',visibility);frame.src=url.href;host.append(frame);
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
function openStage(){
  previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
  dialog.showModal();close.focus();load();
}
opener.addEventListener('click',openStage);
opener.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();openStage();}});
close.addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
dialog.addEventListener('close',()=>{
  document.body.style.overflow=previousOverflow;load();opener.focus({preventScroll:true});
});
for(const button of motionButtons)button.addEventListener('click',()=>{
  playing=!playing;explicitMotion=true;updateMotion();send('crx-stage:motion',{playing});
});
window.addEventListener('message',e=>{
  if(!frame||e.source!==frame.contentWindow||e.origin!==viewerURL.origin)return;
  if(e.data?.type==='crx-stage:ready'){
    clearTimeout(timeout);inlineStatus.hidden=true;modalStatus.hidden=true;visibility();
    if(explicitMotion)send('crx-stage:motion',{playing});
  }
  if(e.data?.type==='crx-stage:expand'&&!dialog.open)openStage();
  if(e.data?.type==='crx-stage:close'&&dialog.open)dialog.close();
  if(e.data?.type==='crx-stage:motion'&&typeof e.data.playing==='boolean'){playing=e.data.playing;updateMotion();}
  if(e.data?.type==='crx-stage:scroll'&&!dialog.open){
    const {deltaX,deltaY}=e.data;
    if(Number.isFinite(deltaX)&&Number.isFinite(deltaY))window.scrollBy({left:Math.max(-1000,Math.min(1000,deltaX)),top:Math.max(-1000,Math.min(1000,deltaY)),behavior:'instant'});
  }
});
document.addEventListener('visibilitychange',visibility);updateMotion();
