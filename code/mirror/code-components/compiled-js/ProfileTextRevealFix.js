import{jsx as _jsx}from"react/jsx-runtime";import{addPropertyControls,ControlType,RenderTarget}from"framer";import{useEffect,useLayoutEffect}from"react";const defaultTargets=["Micah Hoang","brand designer with","a systems mind.","SELECTED","BACKGROUND","RECOGNITION"];const styleId="profile-text-reveal-fix-style";const useIsoLayoutEffect=typeof window==="undefined"?useEffect:useLayoutEffect;function normalize(value){return value.replace(/\s+/g," ").trim();}function parseTargets(value){const parsed=value.split("\n").map(normalize).filter(Boolean);return parsed.length?parsed:defaultTargets;}function findTextElements(targets){const targetSet=new Set(targets);const allElements=Array.from(document.querySelectorAll("body *"));return allElements.filter(element=>{if(element.children.length>0)return false;return targetSet.has(normalize(element.textContent||""));});}function nearestMask(element){let parent=element.parentElement;while(parent&&parent!==document.body){const style=window.getComputedStyle(parent);const hidesOverflow=style.overflow==="hidden"||style.overflow==="clip"||style.overflowY==="hidden"||style.overflowY==="clip";if(hidesOverflow)return parent;parent=parent.parentElement;}return element.parentElement;}function ensureStyle(){if(document.getElementById(styleId))return;const style=document.createElement("style");style.id=styleId;style.textContent=`
[data-profile-reveal-mask="true"] {
    overflow: hidden !important;
}

[data-profile-reveal-fixed="pending"] {
    opacity: 1 !important;
    transform: translate3d(0, var(--profile-reveal-distance, 115%), 0) !important;
    transition: none !important;
    will-change: transform !important;
}

[data-profile-reveal-fixed="visible"] {
    opacity: 1 !important;
    transform: translate3d(0, 0, 0) !important;
    transition-property: transform !important;
    transition-duration: var(--profile-reveal-duration, 900ms) !important;
    transition-timing-function: var(--profile-reveal-easing, cubic-bezier(0.22, 1, 0.36, 1)) !important;
    transition-delay: var(--profile-reveal-delay, 0ms) !important;
    will-change: transform !important;
}
`;document.head.appendChild(style);}function prepareElement(element,index,distance,duration,stagger,easing){const mask=nearestMask(element);if(mask)mask.dataset.profileRevealMask="true";element.style.setProperty("--profile-reveal-distance",`${distance}%`);element.style.setProperty("--profile-reveal-duration",`${duration}ms`);element.style.setProperty("--profile-reveal-delay",`${index*stagger}ms`);element.style.setProperty("--profile-reveal-easing",easing);if(element.dataset.profileRevealFixed==="visible")return;element.dataset.profileRevealFixed="pending";}function revealPreparedElements(){const pending=Array.from(document.querySelectorAll('[data-profile-reveal-fixed="pending"]'));window.requestAnimationFrame(()=>{window.requestAnimationFrame(()=>{pending.forEach(element=>{element.dataset.profileRevealFixed="visible";});});});}/**
 * Profile Text Reveal Fix
 *
 * Forces selected Framer text layers to reveal from a fully masked-out vertical state.
 * Drop once on the profile page; it preserves the existing text layers and typography.
 *
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */export default function ProfileTextRevealFix(props){const{enabled=true,distance=115,duration=900,stagger=90,easing="cubic-bezier(0.22, 1, 0.36, 1)",targetText=defaultTargets.join("\n")}=props;useIsoLayoutEffect(()=>{if(!enabled||RenderTarget.current()===RenderTarget.thumbnail)return;ensureStyle();const targets=parseTargets(targetText);let hasRevealed=false;const apply=()=>{const elements=findTextElements(targets);elements.forEach((element,index)=>{prepareElement(element,index,distance,duration,stagger,easing);});if(!hasRevealed&&elements.length>0){hasRevealed=true;revealPreparedElements();}};apply();const retryTimer=window.setTimeout(apply,120);const observer=new MutationObserver(()=>apply());observer.observe(document.body,{childList:true,subtree:true});return()=>{window.clearTimeout(retryTimer);observer.disconnect();};},[enabled,distance,duration,stagger,easing,targetText]);return /*#__PURE__*/_jsx("div",{"aria-hidden":"true",style:{width:1,height:1,opacity:0,overflow:"hidden",pointerEvents:"none"}});}addPropertyControls(ProfileTextRevealFix,{enabled:{type:ControlType.Boolean,title:"Enabled",defaultValue:true,enabledTitle:"On",disabledTitle:"Off"},distance:{type:ControlType.Number,title:"Start Y",defaultValue:115,min:100,max:180,step:1,unit:"%"},duration:{type:ControlType.Number,title:"Duration",defaultValue:900,min:100,max:3e3,step:25,unit:"ms"},stagger:{type:ControlType.Number,title:"Stagger",defaultValue:90,min:0,max:500,step:10,unit:"ms"},easing:{type:ControlType.String,title:"Easing",defaultValue:"cubic-bezier(0.22, 1, 0.36, 1)"},targetText:{type:ControlType.String,title:"Targets",defaultValue:defaultTargets.join("\n"),displayTextArea:true}});
export const __FramerMetadata__ = {"exports":{"default":{"type":"reactComponent","name":"ProfileTextRevealFix","slots":[],"annotations":{"framerSupportedLayoutHeight":"fixed","framerContractVersion":"1","framerSupportedLayoutWidth":"fixed","framerIntrinsicHeight":"1","framerIntrinsicWidth":"1"}},"__FramerMetadata__":{"type":"variable"}}}
//# sourceMappingURL=./ProfileTextRevealFix.map