// Grain Overlay
//
// User request: add a subtle, crafty film-grain texture over the /play content
// (tested risk-free in a local "grain lab"). This is a toggleable, pointer-events:
// none overlay so it never blocks the draggable grid and can be removed instantly.
//
// Defaults are the recipe locked in from the lab:
//   technique SVG feTurbulence, opacity 0.10, blend multiply,
//   grainColor #501d07 (oxblood), exposure -0.58, contrast 2.35,
//   baseFrequency 1.14, octaves 4, animated @16fps, full-bleed (topInset 0).
//
// Notes:
// - Runtime: portals a position:fixed full-viewport layer to <body> so it's
//   immune to transformed Framer ancestors (a common fixed-positioning gotcha).
// - Editor/SSR (static renderer): renders an in-place preview filling the layer
//   so you can see the grain on the canvas; animation is frozen there.
// - Respects prefers-reduced-motion (freezes the shimmer).
// - `clearNav` (default on) measures the top nav bar and starts the grain just
//   below it, so the nav header stays clean WITHOUT z-index tuning. The detail
//   panel is already clean (its z-index sits far above this overlay). `topInset`
//   adds extra clearance below the nav; `zIndex` remains for advanced layering.
// - `grainOpacity` is named distinctly so it doesn't collide with Framer's
//   built-in node opacity.
//
// Framer code file id: MhR7Ukl. insertUrl GrainOverlay-qwnRd2.js.
import{jsx as _jsx,jsxs as _jsxs,Fragment as _Fragment}from"react/jsx-runtime";import{addPropertyControls,ControlType,useIsStaticRenderer}from"framer";import{createPortal}from"react-dom";import{useEffect,useId,useRef,useState}from"react";function hexToRGB01(hex){const m=/^#?([0-9a-f]{6})$/i.exec((hex||"").trim());if(!m)return[1,1,1];const n=parseInt(m[1],16);return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255];}function detectsWebKitRisk(){if(typeof navigator==="undefined")return false;const ua=navigator.userAgent||"";const iosLike=/iP(?:ad|hone|od)/.test(ua)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1;const desktopSafari=/Safari\//.test(ua)&&!/(?:Chrome|Chromium|CriOS|Edg|EdgiOS|OPR|FxiOS)\//.test(ua);return iosLike||desktopSafari;}/**
 * Grain Overlay
 *
 * @framerIntrinsicWidth 240
 * @framerIntrinsicHeight 240
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */export default function GrainOverlay(props){const{enabled=true,clearNav=true,navSelector="header, nav, [data-framer-name*='Navigation' i], [data-framer-name*='Nav' i]",grainOpacity=.1,blendMode="multiply",grainColor="#501d07",chromatic=false,exposure=-.58,contrast=2.35,baseFrequency=1.14,octaves=4,animated=true,fps=16,disableOnWebKit=true,topInset=0,zIndex=10,style}=props;const isStatic=useIsStaticRenderer();const filterId=useId().replace(/:/g,"");const turbRef=useRef(null);const grainLayerRef=useRef(null);const navBottomRef=useRef(56);const[reducedMotion,setReducedMotion]=useState(false);const webKitRisk=!isStatic&&detectsWebKitRisk();// Only portal after mount so SSR and the first client render agree (null),
// avoiding a hydration mismatch on the published site.
const[mounted,setMounted]=useState(false);const runtimeGrainEnabled=enabled&&(isStatic||!disableOnWebKit||!webKitRisk);useEffect(()=>setMounted(true),[]);// Keep the nav header clean by starting the grain at the nav's LIVE bottom
// edge (responsive, no z-index tuning). The grain boundary tracks the nav, so
// when the detail panel opens and the nav slides up & away, the boundary rides
// with it down to 0 (full coverage) — no exposed seam where the grain ends.
// Seeded with a fallback so the header is never grained on first paint.
useEffect(()=>{if(!runtimeGrainEnabled||!clearNav||isStatic||typeof document==="undefined")return;const nowMs=()=>typeof performance!=="undefined"?performance.now():Date.now();const measure=()=>{try{const vw=window.innerWidth||0;let found=false;let bottom=0;document.querySelectorAll(navSelector).forEach(el=>{const r=el.getBoundingClientRect();// top-anchored, full-ish width = the real nav bar (top can go
// negative as it slides up).
if(r.top<=8&&r.height>=8&&r.width>=vw*.5){found=true;bottom=Math.max(bottom,r.bottom);}});if(found){const next=Math.max(0,Math.round(bottom));if(navBottomRef.current===next)return;navBottomRef.current=next;if(grainLayerRef.current){grainLayerRef.current.style.top=`${next+Math.max(0,topInset)}px`;}}}catch(e){}};// Track the nav for a short window whenever something toggles (the nav
// show/hide is driven by a body class), so the boundary follows the slide.
let raf=0;let until=0;const frame=t=>{measure();raf=t<until?window.requestAnimationFrame(frame):0;};const startBurst=()=>{until=nowMs()+820// covers the ~560ms nav transition + buffer
;if(!raf)raf=window.requestAnimationFrame(frame);};measure();const timers=[150,500,1200].map(d=>window.setTimeout(measure,d));window.addEventListener("resize",measure);const mo=new MutationObserver(startBurst);mo.observe(document.body,{attributes:true,attributeFilter:["class"]});return()=>{timers.forEach(t=>window.clearTimeout(t));window.removeEventListener("resize",measure);mo.disconnect();if(raf)window.cancelAnimationFrame(raf);};},[clearNav,navSelector,isStatic,runtimeGrainEnabled,topInset]);useEffect(()=>{if(!runtimeGrainEnabled||!animated||isStatic||typeof window==="undefined"||!window.matchMedia)return;const mq=window.matchMedia("(prefers-reduced-motion: reduce)");const update=()=>setReducedMotion(mq.matches);update();mq.addEventListener?.("change",update);return()=>mq.removeEventListener?.("change",update);},[animated,isStatic,runtimeGrainEnabled]);// Film-grain shimmer: re-seed the turbulence imperatively (no React re-render).
useEffect(()=>{if(!runtimeGrainEnabled||!animated||isStatic||reducedMotion)return;if(typeof window==="undefined")return;let raf=0;let last=0;const interval=1e3/Math.max(1,Math.min(60,fps));const tick=t=>{if(t-last>=interval){last=t;turbRef.current?.setAttribute("seed",String(Math.random()*1e3|0));}raf=window.requestAnimationFrame(tick);};raf=window.requestAnimationFrame(tick);return()=>window.cancelAnimationFrame(raf);},[runtimeGrainEnabled,animated,isStatic,reducedMotion,fps]);if(!runtimeGrainEnabled)return null;const[cr,cg,cb]=hexToRGB01(grainColor);// Grain starts below the nav (when clearNav) plus any extra manual inset.
const grainTop=(clearNav?Math.max(0,navBottomRef.current):0)+Math.max(0,topInset);const grainSvg=/*#__PURE__*/_jsxs("svg",{"aria-hidden":"true",style:{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"},children:[/*#__PURE__*/_jsxs("filter",{id:filterId,x:"0",y:"0",width:"100%",height:"100%",colorInterpolationFilters:"sRGB",children:[/*#__PURE__*/_jsx("feTurbulence",{ref:turbRef,type:"fractalNoise",baseFrequency:baseFrequency,numOctaves:Math.round(octaves),stitchTiles:"stitch",seed:7}),/*#__PURE__*/_jsxs("feComponentTransfer",{children:[/*#__PURE__*/_jsx("feFuncR",{type:"linear",slope:contrast,intercept:exposure}),/*#__PURE__*/_jsx("feFuncG",{type:"linear",slope:contrast,intercept:exposure}),/*#__PURE__*/_jsx("feFuncB",{type:"linear",slope:contrast,intercept:exposure})]}),chromatic?/*#__PURE__*/_jsx("feColorMatrix",{type:"matrix",values:"1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0 1"}):/*#__PURE__*/_jsxs(_Fragment,{children:[/*#__PURE__*/_jsx("feColorMatrix",{type:"saturate",values:"0"}),/*#__PURE__*/_jsx("feColorMatrix",{type:"matrix",values:`${cr} 0 0 0 0 ${cg} 0 0 0 0 ${cb} 0 0 0 0 0 0 0 0 1`})]})]}),/*#__PURE__*/_jsx("rect",{width:"100%",height:"100%",filter:`url(#${filterId})`})]});// Editor canvas: show the grain in place (filling the layer) so it's visible
// while designing. Animation is frozen by the static guard above.
if(isStatic){return /*#__PURE__*/_jsx("div",{style:{...style,position:"relative",width:"100%",height:"100%",minWidth:80,minHeight:80,overflow:"hidden",opacity:grainOpacity,mixBlendMode:blendMode,pointerEvents:"none"},children:grainSvg});}// SSR + first client render: nothing (keeps hydration consistent).
if(!mounted||typeof document==="undefined")return null;// Runtime: full-viewport fixed layer portaled to <body>.
return /*#__PURE__*/createPortal(/*#__PURE__*/_jsxs("div",{ref:grainLayerRef,"aria-hidden":"true","data-mh-grain-clear-nav":clearNav?"true":undefined,style:{position:"fixed",left:0,right:0,bottom:0,top:grainTop,pointerEvents:"none",opacity:grainOpacity,mixBlendMode:blendMode,zIndex,overflow:"hidden","--mh-grain-top-inset":`${Math.max(0,topInset)}px`},children:[clearNav&&/*#__PURE__*/_jsx("style",{children:`
                    :root:active-view-transition [data-mh-grain-clear-nav="true"] {
                        top: var(--mh-grain-top-inset, 0px) !important;
                    }
                `}),grainSvg]}),document.body);}addPropertyControls(GrainOverlay,{enabled:{type:ControlType.Boolean,title:"Grain",defaultValue:true,enabledTitle:"On",disabledTitle:"Off"},clearNav:{type:ControlType.Boolean,title:"Clear Nav",defaultValue:true,enabledTitle:"On",disabledTitle:"Off"},navSelector:{type:ControlType.String,title:"Nav Selector",defaultValue:"header, nav, [data-framer-name*='Navigation' i], [data-framer-name*='Nav' i]",hidden:({clearNav})=>!clearNav},grainOpacity:{type:ControlType.Number,title:"Grain Opacity",defaultValue:.1,min:0,max:1,step:.005},blendMode:{type:ControlType.Enum,title:"Blend",options:["multiply","overlay","soft-light","screen","hard-light","color-burn","color-dodge","difference","normal"],defaultValue:"multiply"},grainColor:{type:ControlType.Color,title:"Color",defaultValue:"#501d07"},chromatic:{type:ControlType.Boolean,title:"Chromatic",defaultValue:false,enabledTitle:"RGB",disabledTitle:"Tint"},exposure:{type:ControlType.Number,title:"Exposure",defaultValue:-.58,min:-.8,max:.8,step:.01},contrast:{type:ControlType.Number,title:"Contrast",defaultValue:2.35,min:.2,max:6,step:.05},baseFrequency:{type:ControlType.Number,title:"Grain Size",defaultValue:1.14,min:.05,max:2,step:.01},octaves:{type:ControlType.Number,title:"Detail",defaultValue:4,min:1,max:6,step:1},animated:{type:ControlType.Boolean,title:"Animate",defaultValue:true,enabledTitle:"On",disabledTitle:"Off"},disableOnWebKit:{type:ControlType.Boolean,title:"Safari Grain",defaultValue:true,enabledTitle:"Disable",disabledTitle:"Keep"},fps:{type:ControlType.Number,title:"Shimmer FPS",defaultValue:16,min:4,max:40,step:1,hidden:({animated})=>!animated},topInset:{type:ControlType.Number,title:"Extra Inset",defaultValue:0,min:0,max:400,step:1,unit:"px"},zIndex:{type:ControlType.Number,title:"Z-Index",defaultValue:10,min:0,max:2147483e3,step:1}});
export const __FramerMetadata__ = {"exports":{"default":{"type":"reactComponent","name":"GrainOverlay","slots":[],"annotations":{"framerIntrinsicWidth":"240","framerIntrinsicHeight":"240","framerContractVersion":"1","framerSupportedLayoutWidth":"any","framerSupportedLayoutHeight":"any"}},"__FramerMetadata__":{"type":"variable"}}}
//# sourceMappingURL=./GrainOverlay.map