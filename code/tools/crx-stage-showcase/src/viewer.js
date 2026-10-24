import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { createFixtureLighting } from './fixture-lighting.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { makeScreen, applyMedia, VANISH_CANVAS } from './screens.js';

const canvas = document.querySelector('#stage-canvas');
const loading = document.querySelector('#loading');
const failure = document.querySelector('#failure');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const inline = new URLSearchParams(location.search).has('inline');
const abort = new AbortController();
const videos = [], textures = new Set();
let renderer, scene, camera, controls, observer, fixtureLighting, frameID = 0, disposed = false;
let ready = false, parentVisible = true, playing = !reduceMotion;
let orbiting = !reduceMotion, orbitPhase = 0, orbitCenter = 0, lastOrbitTime = 0;
let orbitResumeTimer, orbitRamp = 1.5, interacting = false;
let startVideos = () => {};
let quality = Math.min(devicePixelRatio, innerWidth < 700 ? 1.25 : 1.5);
let slowFrames = 0;
let parentOrigin = null;
try { parentOrigin = document.referrer ? new URL(document.referrer).origin : null; } catch {}
const embedded = parent !== window;
const post = (type, data = {}) => { if (embedded) parent.postMessage({type,...data}, parentOrigin || '*'); };
const visible = () => !disposed && !document.hidden && parentVisible;
// Vite's output bundles move directories; public files are relative to the HTML entry.
const publicURL = path => new URL(path, document.baseURI).href;
let diagnostics, renderCount = 0;
if (import.meta.env.DEV && new URLSearchParams(location.search).has('inspect')) {
  const panel = document.createElement('div');
  panel.style.cssText = 'position:absolute;top:12px;left:12px;padding:12px;background:#080d12;color:white;font:12px sans-serif;z-index:2';
  diagnostics = document.createElement('output'); panel.append(diagnostics);
  const snapshot = document.createElement('button'); snapshot.textContent = 'Save stage poster';
  snapshot.style.cssText='display:block;margin-top:8px;padding:10px';
  snapshot.addEventListener('click', () => {
    fixtureLighting.update(camera);renderer.render(scene,camera);
    canvas.toBlob(blob => { const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='poster.jpg';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000); },'image/jpeg',.88);
  });
  panel.append(snapshot);document.body.append(panel);
}

function invalidate() {
  if (ready && visible() && !frameID) frameID = requestAnimationFrame(render);
}
function render(time) {
  frameID = 0;
  if (!visible()) return;
  if (orbiting && playing) {
    const delta = lastOrbitTime ? Math.min((time-lastOrbitTime)/1000,.05) : 0;
    lastOrbitTime = time;
    orbitRamp = Math.min(1.5, orbitRamp + delta);
    const ramp = orbitRamp / 1.5;
    orbitPhase += delta * .12 * ramp * ramp * (3 - 2 * ramp);
    const angle = orbitCenter + .08 * Math.sin(orbitPhase);
    {
      const offset = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
      offset.theta = angle;
      camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(offset));
    }
  }
  controls.update();
  const start = performance.now();
  fixtureLighting.update(camera);
  renderer.render(scene, camera);
  const cost = performance.now() - start;
  // CPU submission cost is only a conservative signal, not a GPU benchmark.
  if (cost > 22 && ++slowFrames > 12 && quality > 1) {
    quality = 1; renderer.setPixelRatio(quality); resize(); slowFrames = 0;
  } else if (cost < 16) slowFrames = Math.max(0, slowFrames - 1);
  if (diagnostics) { diagnostics.value = `Frames: ${++renderCount} · Draws: ${renderer.info.render.calls} · Triangles: ${renderer.info.render.triangles.toLocaleString()} · Playing: ${videos.filter(v=>!v.el.paused).length} · DPR: ${quality}`; }
  // Fallback for browsers without video-frame callbacks; stops completely on pause/hidden.
  if ((orbiting && playing) || videos.some(v => !v.el.paused && !v.el.requestVideoFrameCallback)) invalidate();
}
function resize() {
  if (!renderer || disposed) return;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  camera.aspect = w / Math.max(1,h); camera.updateProjectionMatrix();
  renderer.setSize(w,h,false); invalidate();
}
function takeControl() {
  clearTimeout(orbitResumeTimer);
  orbiting=false; lastOrbitTime=0;
}
function resumeOrbit() {
  if (!playing || disposed || interacting) return;
  const angle = controls.getAzimuthalAngle();
  orbitCenter=THREE.MathUtils.clamp(angle,-.67,.67);
  // Preserve the angle, target, elevation and zoom left by the visitor.
  orbitPhase=Math.asin(THREE.MathUtils.clamp((angle-orbitCenter)/.08,-1,1));
  orbitRamp=0; lastOrbitTime=0; orbiting=true; invalidate();
}
function scheduleOrbitResume() {
  clearTimeout(orbitResumeTimer);
  if (playing && !interacting && !disposed) orbitResumeTimer=setTimeout(resumeOrbit,1800);
}
function setMotion(value) {
  clearTimeout(orbitResumeTimer);
  playing=value; orbiting=false; lastOrbitTime=0;
  if(value){resumeOrbit();startVideos();}
  updatePlayback(); post('crx-stage:motion',{playing});
}
function updatePlayback() {
  for (const v of videos) {
    if (visible() && playing) v.el.play().catch(() => { /* Static poster stays visible when autoplay is blocked. */ });
    else v.el.pause();
  }
  if (!visible()) { cancelAnimationFrame(frameID); frameID = 0; lastOrbitTime=0; }
  else invalidate();
}
function makeImage(path) {
  return new Promise((resolve, reject) => {
    const image = new Image(); image.crossOrigin = 'anonymous';
    const cancel = () => { image.src = ''; reject(new DOMException('Aborted','AbortError')); };
    abort.signal.addEventListener('abort',cancel,{once:true});
    image.onload = () => {
      abort.signal.removeEventListener('abort',cancel);
      if (disposed) return reject(new DOMException('Aborted','AbortError'));
      const texture = new THREE.Texture(image); texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(4,renderer.capabilities.getMaxAnisotropy()); texture.needsUpdate = true;
      textures.add(texture); resolve({texture,size:[image.naturalWidth,image.naturalHeight]});
    };
    image.onerror = () => { abort.signal.removeEventListener('abort',cancel); reject(new Error(`Image unavailable: ${path}`)); };
    image.src = publicURL(path);
  });
}
function attachVideo(path, apply) {
  const el = document.createElement('video');
  el.muted = true; el.loop = true; el.playsInline = true; el.preload = 'auto'; el.crossOrigin = 'anonymous';
  const record = {el,texture:null,callback:0}; videos.push(record);
  el.addEventListener('loadeddata', () => {
    if (disposed) return;
    const texture = new THREE.VideoTexture(el); texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter; texture.generateMipmaps = false;
    record.texture = texture; textures.add(texture);
    apply({texture,size:[el.videoWidth,el.videoHeight]});
    const tick = () => {
      if (disposed) return;
      invalidate(); record.callback = el.requestVideoFrameCallback(tick);
    };
    if (el.requestVideoFrameCallback) record.callback = el.requestVideoFrameCallback(tick);
    updatePlayback(); invalidate();
  },{once:true,signal:abort.signal});
  el.addEventListener('error', () => { el.pause(); },{signal:abort.signal});
  el.src = publicURL(path); el.load();
}
function initialView() {
  const narrow = camera.aspect < 1;
  camera.fov = narrow ? 58 : 42;
  controls.target.set(0,3.6,-3);
  const horizontalFov = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect);
  // Portrait starts at audience level near the central stage; orbit/pan reveals the wings.
  const distance = narrow ? 44 : Math.min(62,22 / Math.tan(horizontalFov / 2));
  camera.position.set(0,narrow ? 5 : 5.8,distance-3);
  clearTimeout(orbitResumeTimer);
  orbitCenter=0;orbitPhase=0;lastOrbitTime=0;orbitRamp=1.5;orbiting=playing;
  controls.update(); camera.updateProjectionMatrix(); invalidate();
}
async function boot() {
  renderer = new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'default'});
  renderer.setPixelRatio(quality); renderer.setClearColor(0x080d12);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080d12,0.012);
  camera = new THREE.PerspectiveCamera(42,1,0.1,180);
  controls = new OrbitControls(camera,canvas);
  controls.enableDamping = !reduceMotion; controls.dampingFactor = .12;
  controls.rotateSpeed = .5; controls.zoomSpeed = .65; controls.panSpeed = .65;
  controls.minDistance = 12; controls.maxDistance = 72;
  controls.minAzimuthAngle = -.75; controls.maxAzimuthAngle = .75;
  controls.minPolarAngle = Math.PI * .30; controls.maxPolarAngle = Math.PI * .498;
  controls.cursor.set(0,3.6,-3); controls.maxTargetRadius = 7;
  controls.addEventListener('change',invalidate);
  controls.addEventListener('start', () => { interacting=true; takeControl(); });
  controls.addEventListener('end', () => { interacting=false; scheduleOrbitResume(); invalidate(); });
  const [data, buffer, config] = await Promise.all([
    fetch(publicURL('scene.json'),{signal:abort.signal}).then(r=>{if(!r.ok)throw new Error('Scene unavailable');return r.json();}),
    fetch(publicURL('stage.glb'),{signal:abort.signal}).then(async r=>{
      if(!r.ok)throw new Error('Model unavailable');
      const total=Number(r.headers.get('content-length')),reader=r.body.getReader(),chunks=[]; let loaded=0;
      for(;;){const {done,value}=await reader.read();if(done)break;chunks.push(value);loaded+=value.length;if(total)loading.querySelector('i').style.width=`${Math.min(90,loaded/total*90)}%`;}
      return new Blob(chunks).arrayBuffer();
    }),
    fetch(publicURL('showcase.json'),{signal:abort.signal}).then(r=>{if(!r.ok)throw new Error('Showcase unavailable');return r.json();}),
  ]);
  if(disposed)return;
  const venue = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(buffer,'');
  if(disposed){disposeObject(venue.scene);return;}
  fixtureLighting = createFixtureLighting(THREE,data,scene);
  const looks = {Production:0x30363c,Truss:0x656f79,GS_Stage:0x242b30,NNA_2_Seating:0x394550,'CT_Audio-2':0x13171c,CT_Flown_LED:0x14191f,CT_GS_LED:0x14191f,GS_Drape:0x151a1e,Ceiling:0x232b32};
  const oldMaterials = new Set();
  venue.scene.traverse(o=>{
    if(!o.isMesh)return;
    (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>oldMaterials.add(m));
    o.material = fixtureLighting.apply(new THREE.MeshStandardMaterial({color:looks[o.name]||0x30363c,roughness:.95,metalness:o.name==='Truss'?.25:0,flatShading:true,side:THREE.DoubleSide}));
  });
  oldMaterials.forEach(m=>m.dispose()); scene.add(venue.scene);
  // Ceiling is omitted from the showcase to permit elevated camera angles without occlusion.
  const ceiling = venue.scene.getObjectByName('Ceiling'); if(ceiling)ceiling.visible=false;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(100,110),new THREE.MeshStandardMaterial({color:0x161e24,roughness:1}));
  fixtureLighting.apply(floor.material);
  floor.rotation.x=-Math.PI/2;floor.position.set(0,-.48,7);scene.add(floor);
  const screens = data.screens.map(def=>{const mesh=makeScreen(def);scene.add(mesh);return {def,mesh};});
  const assign = (kind, media) => {
    for(const {def,mesh} of screens){
      if((kind==='center'&&def.id==='S02')||(kind==='side'&&def.kind==='tv')||(kind==='sideLeft'&&def.id==='S01')||(kind==='sideRight'&&def.id==='S03')){applyMedia(mesh,media.texture,media.size,'stretch',def.pixels);}
      if(kind==='vanish'&&def.kind==='mesh'){applyMedia(mesh,media.texture,media.size,'stretch',VANISH_CANVAS,{x:def.canvasColumn/VANISH_CANVAS[0],y:0,w:def.pixels[0]/VANISH_CANVAS[0],h:1});}
    }
    invalidate();
  };
  const media = await Promise.all(Object.keys(config.media).map(async kind=>[kind,await makeImage(config.media[kind].image)]));
  if(disposed)return;
  media.forEach(([kind,image])=>assign(kind,image));
  resize();initialView();ready=true;
  loading.hidden=true;
  observer=new ResizeObserver(resize);observer.observe(canvas);
  fixtureLighting.update(camera);renderer.render(scene,camera);post('crx-stage:ready');post('crx-stage:motion',{playing});
  // One decoder per source: all four Vanish panels share the full-canvas video.
  let videosStarted=false;
  startVideos=()=>{if(videosStarted)return;videosStarted=true;for(const [kind,media] of Object.entries(config.media)){if(media.video)attachVideo(media.video,v=>assign(kind,v));}};
  if(!reduceMotion)startVideos();
  canvas.addEventListener('keydown',e=>{
    if(e.altKey||e.ctrlKey||e.metaKey)return;
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Home',' '].includes(e.key)){
      e.preventDefault();takeControl();
      if(e.key==='Home')initialView();
      else if(e.key===' '){setMotion(!playing);}
      else if(e.key==='+'||e.key==='='||e.key==='-'){
        const offset=camera.position.clone().sub(controls.target);offset.setLength(THREE.MathUtils.clamp(offset.length()*(e.key==='-'?1.1:.9),controls.minDistance,controls.maxDistance));camera.position.copy(controls.target).add(offset);
      }else if(e.shiftKey){
        const v=new THREE.Vector3(e.key==='ArrowLeft'?-.7:e.key==='ArrowRight'?.7:0,e.key==='ArrowUp'?.5:e.key==='ArrowDown'?-.5:0,0).applyQuaternion(camera.quaternion);controls.target.add(v);camera.position.add(v);
      }else{
        const s=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
        if(e.key==='ArrowLeft')s.theta-=.035;if(e.key==='ArrowRight')s.theta+=.035;if(e.key==='ArrowUp')s.phi-=.025;if(e.key==='ArrowDown')s.phi+=.025;
        s.theta=THREE.MathUtils.clamp(s.theta,controls.minAzimuthAngle,controls.maxAzimuthAngle);s.phi=THREE.MathUtils.clamp(s.phi,controls.minPolarAngle,controls.maxPolarAngle);camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(s));
      }
      controls.update();
      invalidate();
      if(e.key!==' ' && e.key!=='Home')scheduleOrbitResume();
    }
  },{signal:abort.signal});
  invalidate();
}
function disposeObject(root){
  const geometries=new Set(),materials=new Set();
  root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));});
  geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
}
function dispose(){
  if(disposed)return;disposed=true;abort.abort();cancelAnimationFrame(frameID);clearTimeout(orbitResumeTimer);
  observer?.disconnect();controls?.dispose();
  for(const v of videos){if(v.callback)v.el.cancelVideoFrameCallback?.(v.callback);v.el.pause();v.el.removeAttribute('src');v.el.load();}
  textures.forEach(t=>t.dispose());if(scene)disposeObject(scene);renderer?.dispose();renderer?.forceContextLoss();
}
document.addEventListener('visibilitychange',updatePlayback,{signal:abort.signal});
window.addEventListener('message',e=>{if(!embedded||e.source!==parent||!parentOrigin||e.origin!==parentOrigin)return;if(e.data?.type==='crx-stage:visibility'){parentVisible=e.data.visible===true;updatePlayback();}if(ready&&e.data?.type==='crx-stage:motion'&&typeof e.data.playing==='boolean')setMotion(e.data.playing);},{signal:abort.signal});
window.addEventListener('pagehide',dispose,{once:true});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();dispose();loading.hidden=true;failure.hidden=false;},{signal:abort.signal});
document.querySelector('#retry').addEventListener('click',()=>location.reload());
if(inline){
  // Let trackpad/wheel movement scroll the case study; pinch remains available.
  canvas.addEventListener('wheel',e=>{
    if(e.ctrlKey)return;
    e.preventDefault();e.stopImmediatePropagation();
    const scale=e.deltaMode===1?16:e.deltaMode===2?innerHeight:1;
    post('crx-stage:scroll',{deltaX:e.deltaX*scale,deltaY:e.deltaY*scale});
  },{capture:true,passive:false,signal:abort.signal});
}
boot().catch(error=>{if(error.name==='AbortError')return;console.error('Stage viewer:',error);dispose();loading.hidden=true;failure.hidden=false;});
