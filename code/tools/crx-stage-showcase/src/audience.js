const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function createAudienceControls({ camera, controls, data, canvas, invalidate, onInteractionStart, onInteractionEnd, onOverview, onHouseChange, reduceMotion }) {
  const $ = id => document.querySelector(id);
  const position = $('#view-position'), choose = $('#choose-seat'), panel = $('#seat-picker');
  const map = $('#seat-map'), status = $('#seat-map-status'), close = $('#seat-picker-close');
  const house = $('#house-light'), houseLevel = $('#house-level');
  const ctx = map.getContext('2d');
  const seats = data.seats;
  const coords = seats.map(s => ({ x:s[0], y:s[2] }));
  const xs = coords.map(p=>p.x), zs = coords.map(p=>p.y);
  const bounds = { minX:Math.min(...xs), maxX:Math.max(...xs), minZ:Math.min(...zs), maxZ:Math.max(...zs) };
  const nearest = (x,z) => seats.reduce((best,s,i) => Math.hypot(s[0]-x,s[2]-z) < Math.hypot(seats[best][0]-x,seats[best][2]-z) ? i : best, 0);
  const presets = {
    front:nearest(0,bounds.minZ), mid:nearest(0,(bounds.minZ+bounds.maxZ)/2), back:nearest(0,bounds.maxZ),
    left:nearest(bounds.minX,(bounds.minZ+bounds.maxZ)/2), right:nearest(bounds.maxX,(bounds.minZ+bounds.maxZ)/2),
  };
  const abort = new AbortController(), signal = abort.signal;
  let seated = false, seatIndex = -1, anim = null, yaw = 0, pitch = 0, drag = null, selected = -1, hover = -1, box = null, wheelTimer = 0;

  function draw() {
    const rect=map.getBoundingClientRect(), dpr=Math.min(2,devicePixelRatio||1);
    if (!rect.width || !rect.height) return;
    const w=Math.round(rect.width*dpr),h=Math.round(rect.height*dpr);
    if(map.width!==w||map.height!==h){map.width=w;map.height=h;}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,rect.width,rect.height);
    const pad=30, scale=Math.min((rect.width-pad*2)/Math.max(.1,bounds.maxX-bounds.minX),(rect.height-pad*2)/Math.max(.1,bounds.maxZ-bounds.minZ));
    const ox=(rect.width-(bounds.maxX-bounds.minX)*scale)/2, oy=(rect.height-(bounds.maxZ-bounds.minZ)*scale)/2;
    box={scale,ox,oy,pad};
    const sx=x=>ox+(x-bounds.minX)*scale, sy=z=>oy+(z-bounds.minZ)*scale;
    ctx.fillStyle='#182128';ctx.fillRect(0,0,rect.width,rect.height);
    ctx.fillStyle='#697780';ctx.font='11px system-ui';ctx.textAlign='center';ctx.fillText('STAGE',rect.width/2,12);
    ctx.fillStyle='#41515a';ctx.fillRect(rect.width/2-22,17,44,3);
    for(let i=0;i<seats.length;i++){
      const s=seats[i],r=selected===i?3.2:Math.min(2,.22*scale);
      ctx.beginPath();ctx.arc(sx(s[0]),sy(s[2]),r,0,Math.PI*2);
      ctx.fillStyle=i===selected?'#e5fe52':i===hover?'#b9d56a':'#71838d';ctx.fill();
    }
  }
  const resizeObserver=new ResizeObserver(draw);resizeObserver.observe(map);
  function showPicker(show=true){const restoreFocus=!show&&!panel.hidden&&panel.contains(document.activeElement);panel.hidden=!show;choose?.setAttribute('aria-expanded',String(show));if(show){draw();map.focus();}else if(restoreFocus)choose?.focus(); }
  function selectSeat(i, animate=true, label='custom'){
    if(i<0||i>=seats.length)return;
    selected=i;seatIndex=i;status.textContent=`Seat #${i+1} selected`;
    if(position)position.value=label;draw();
    sit(seats[i],animate);
    showPicker(false);
  }
  function clearMomentum(){
    const damping=controls.enableDamping;controls.enableDamping=false;controls.update();controls.enableDamping=damping;
  }
  function aim(){
    const cp=Math.cos(pitch), d={x:-Math.sin(yaw)*cp,y:Math.sin(pitch),z:-Math.cos(yaw)*cp};
    controls.target.set(camera.position.x+d.x,camera.position.y+d.y,camera.position.z+d.z);camera.up.set(0,1,0);camera.lookAt(controls.target);
  }
  function sit(seat,animate=true){
    onInteractionStart?.();if(!seated)clearMomentum();controls.enabled=false;seated=true;drag=null;
    const from=camera.position.clone(),to={x:seat[0],y:seat[1],z:seat[2]};
    const dirX=seat[3],dirZ=seat[4];
    const gaze={x:to.x+dirX,y:to.y,z:to.z+dirZ};
    const dur=animate&&!reduceMotion?700:0;
    if(!dur){camera.position.set(to.x,to.y,to.z);yaw=Math.atan2(-dirX,-dirZ);pitch=0;aim();anim=null;invalidate();onInteractionEnd?.();return;}
    anim={from,to,gaze,start:performance.now(),dur};invalidate();
  }
  function neighbor(index,dir){
    if(index<0)return -1;const cur=seats[index];let best=-1,bestScore=Infinity;
    for(let i=0;i<seats.length;i++){if(i===index)continue;const s=seats[i],dx=s[0]-cur[0],dz=s[2]-cur[2];
      const ok=(dir==='left'&&Math.abs(dz)<.45&&dx<-.2)||(dir==='right'&&Math.abs(dz)<.45&&dx>.2)||(dir==='up'&&dz<-.5)||(dir==='down'&&dz>.5);
      const score=(dir==='left'||dir==='right'?Math.abs(dx)+Math.abs(dz)*4:Math.abs(dz)+Math.abs(dx)*1.5);
      if(ok&&score<bestScore){best=i;bestScore=score;}
    }
    return best;
  }
  function step(dir){const best=neighbor(seatIndex,dir);if(best>=0)selectSeat(best);}
  function reset(){
    if(anim||drag||wheelTimer)onInteractionEnd?.();anim=null;seated=false;seatIndex=-1;if(drag){try{canvas.releasePointerCapture(drag.id);}catch{}}drag=null;controls.enabled=true;clearTimeout(wheelTimer);wheelTimer=0;
    if(position)position.value='overview';showPicker(false);
  }
  function changeView(){
    const value=position.value;
    if(value==='overview'){reset();onOverview?.();invalidate();}
    else if(value==='custom'){showPicker(true);}
    else if(presets[value]!==undefined)selectSeat(presets[value],true,value);
  }
  position?.addEventListener('change',changeView,{signal});
  choose?.addEventListener('click',()=>showPicker(true),{signal});
  close?.addEventListener('click',()=>showPicker(false),{signal});
  map.addEventListener('click',e=>{
    if(!box)return;const r=map.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
    const i=seats.reduce((best,s,n)=>{const px=box.ox+(s[0]-bounds.minX)*box.scale,py=box.oy+(s[2]-bounds.minZ)*box.scale;const d=Math.hypot(px-x,py-y);return d<best.d?{i:n,d}:{...best};},{i:-1,d:Infinity});
    if(i.d<=Math.max(7,Math.min(12,box.scale*.32)))selectSeat(i.i);
  },{signal});
  map.addEventListener('pointermove',e=>{
    const r=map.getBoundingClientRect();if(!box)return;const x=e.clientX-r.left,y=e.clientY-r.top;
    hover=seats.reduce((best,s,n)=>{const px=box.ox+(s[0]-bounds.minX)*box.scale,py=box.oy+(s[2]-bounds.minZ)*box.scale,d=Math.hypot(px-x,py-y);return d<best.d?{i:n,d}:best;},{i:-1,d:Infinity}).i;draw();
  },{signal});
  map.addEventListener('keydown',e=>{
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();e.stopPropagation();
      if(selected<0)selected=presets.mid;const next=neighbor(selected,({ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'})[e.key]);if(next>=0){selected=next;status.textContent=`Seat #${selected+1} highlighted; press Enter to choose`;draw();}
    } else if(e.key==='Enter'&&selected>=0){e.preventDefault();selectSeat(selected);}else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();showPicker(false);}
  },{signal});
  canvas.addEventListener('keydown',e=>{if(!seated||e.altKey||e.ctrlKey||e.metaKey)return;const dirs={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};if(dirs[e.key]){e.preventDefault();e.stopPropagation();step(dirs[e.key]);}},{signal});
  canvas.addEventListener('pointerdown',e=>{if(!seated||anim||(e.pointerType==='mouse'&&e.button!==0))return;onInteractionStart?.();drag={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture?.(e.pointerId);},{signal});
  canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const k=(camera.fov*Math.PI/180)/Math.max(1,canvas.clientHeight);yaw-=(e.clientX-drag.x)*k;pitch=clamp(pitch-(e.clientY-drag.y)*k,-1.55,1.55);drag.x=e.clientX;drag.y=e.clientY;aim();invalidate();},{signal});
  const endDrag=e=>{if(drag?.id===e.pointerId){drag=null;try{canvas.releasePointerCapture(e.pointerId);}catch{}onInteractionEnd?.();}};canvas.addEventListener('pointerup',endDrag,{signal});canvas.addEventListener('pointercancel',endDrag,{signal});
  canvas.addEventListener('wheel',e=>{if(!seated)return;e.preventDefault();onInteractionStart?.();clearTimeout(wheelTimer);wheelTimer=setTimeout(()=>{wheelTimer=0;if(!drag&&!anim)onInteractionEnd?.();},220);camera.fov=clamp(camera.fov*Math.exp(e.deltaY*.0012),12,80);camera.updateProjectionMatrix();aim();invalidate();},{passive:false,signal});
  house?.addEventListener('input',()=>{onInteractionStart?.();const n=Number(house.value);houseLevel.value=`${n}%`;houseLevel.textContent=`${n}%`;onHouseChange?.(n/100);if(!anim&&!drag)onInteractionEnd?.();},{signal});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.stopPropagation();showPicker(false);}},{signal});

  return {
    get isSeated(){return seated;},
    getAngle(){return yaw;},
    setAngle(value){yaw=value;aim();invalidate();},
    update(time){
      if(!anim)return false;const a=anim,k=Math.min(1,(time-a.start)/a.dur),t=ease(k);
      camera.position.set(a.from.x+(a.to.x-a.from.x)*t,a.from.y+(a.to.y-a.from.y)*t,a.from.z+(a.to.z-a.from.z)*t);
      if(k>=1){yaw=Math.atan2(-(a.gaze.x-a.to.x),-(a.gaze.z-a.to.z));pitch=0;anim=null;aim();onInteractionEnd?.();}
      else {const dx=a.gaze.x-a.to.x,dz=a.gaze.z-a.to.z;controls.target.set(camera.position.x+dx,camera.position.y,camera.position.z+dz);camera.lookAt(controls.target);}
      return true;
    },
    reset,
    dispose(){abort.abort();resizeObserver.disconnect();reset();},
  };
}
