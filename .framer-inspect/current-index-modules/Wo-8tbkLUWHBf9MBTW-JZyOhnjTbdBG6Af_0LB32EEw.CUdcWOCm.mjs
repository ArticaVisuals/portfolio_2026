import{t as e}from"./rolldown-runtime.BDzL3ECc.mjs";import{A as t,E as n,F as r,L as i,M as a,N as o,O as s,S as c,_ as l,c as u,h as d,j as f,k as p,l as m,o as h,s as g,y as _}from"./react.DsErKZ3P.mjs";import{S as v,a as y,r as b,t as x}from"./motion.DU_WqCOV.mjs";import{C as S,D as C,F as w,I as T,L as E,U as D,X as O,_ as k,a as A,at as ee,bt as j,c as M,ft as te,g as ne,gt as N,i as P,it as F,lt as I,n as re,nt as ie,o as L,p as ae,st as R,u as oe,ut as se,w as z,x as ce,y as le}from"./framer.CsE1h2BW.mjs";import{i as ue,n as de,r as fe,t as pe}from"./cxLS4itsr.BCbjwAXC.mjs";import{r as me,t as he}from"./yTHrQWMIY.CCyXNSI0.mjs";import{n as ge,t as _e}from"./CaseStudyThumbnailStrokeStyles.ClpefT8N.mjs";import{i as ve,n as ye,r as be,t as xe}from"./ZB3A5PLtS.BqSvSrxH.mjs";import{n as Se,r as Ce}from"./u2LOaBT5q.BYX-DIcm.mjs";function we(e){let t=e.target;t instanceof Element&&t.closest(`[${V}="true"]`)&&(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation())}function Te(){if(typeof document>`u`)return 0;let e=0;return document.querySelectorAll(De).forEach(t=>{t.setAttribute(`aria-hidden`,`true`),t.querySelectorAll(Oe).forEach(t=>{t.setAttribute(`tabindex`,`-1`),t.setAttribute(`aria-hidden`,`true`),t.setAttribute(V,`true`),t.addEventListener(`click`,we,!0),e+=1})}),e}function Ee(e){f(()=>{if(!e||i===void 0)return;let t=0,n=[],r=()=>{i.cancelAnimationFrame(t),t=i.requestAnimationFrame(Te)};r(),[100,350,900,1800,3200].forEach(e=>{n.push(i.setTimeout(r,e))});let a=new MutationObserver(r);return a.observe(document.body,{attributes:!0,attributeFilter:[`href`,`role`,`tabindex`,`data-framer-name`,`name`],childList:!0,subtree:!0}),()=>{i.cancelAnimationFrame(t),n.forEach(e=>i.clearTimeout(e)),a.disconnect()}},[e])}function B({enabled:e=!0,hoverScale:t=1.02}){if(Ee(e),!e)return null;let n=Math.max(1,Number(t)||1.02);return u(`div`,{"aria-hidden":`true`,style:{width:0,height:0,overflow:`hidden`,pointerEvents:`none`},children:u(`style`,{children:`
                .idx-grid-card-media > video,
                .idx-grid-card-media > img {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    border: 0;
                    transform: scale(1);
                    transform-origin: center center;
                    transition: transform 420ms cubic-bezier(.22, 1, .36, 1);
                    backface-visibility: hidden;
                    will-change: transform;
                }

                .idx-grid-card-media > video {
                    pointer-events: none;
                }

                @media (prefers-reduced-motion: no-preference) {
                    .idx-grid-card:hover .idx-grid-card-media > video,
                    .idx-grid-card:focus-visible .idx-grid-card-media > video,
                    .idx-grid-card:focus-within .idx-grid-card-media > video,
                    .idx-grid-card:hover .idx-grid-card-media > img,
                    .idx-grid-card:focus-visible .idx-grid-card-media > img,
                    .idx-grid-card:focus-within .idx-grid-card-media > img {
                        transform: scale(${n}) !important;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .idx-grid-card-media > video,
                    .idx-grid-card-media > img,
                    .idx-grid-card:hover .idx-grid-card-media > video,
                    .idx-grid-card:focus-visible .idx-grid-card-media > video,
                    .idx-grid-card:focus-within .idx-grid-card-media > video,
                    .idx-grid-card:hover .idx-grid-card-media > img,
                    .idx-grid-card:focus-visible .idx-grid-card-media > img,
                    .idx-grid-card:focus-within .idx-grid-card-media > img {
                        transform: scale(1) !important;
                        transition: none !important;
                        will-change: auto !important;
                    }
                }
            `})})}var De,Oe,V,ke=e((()=>{r(),h(),c(),D(),De=`[data-framer-name="CmsLink"], [name="CmsLink"]`,Oe=`a[href], [role="link"], [tabindex]`,V=`data-index-hidden-cms-link-inert`,z(B,{enabled:{type:L.Boolean,title:`Enabled`,defaultValue:!0,enabledTitle:`On`,disabledTitle:`Off`},hoverScale:{type:L.Number,title:`Scale`,defaultValue:1.02,min:1,max:1.12,step:.005,hidden:({enabled:e})=>!e}})}));function Ae(){if(i===void 0)return null;let e=i;if(!e[q]){let t=new Map,n=new Set;e[q]={items:t,listeners:n,register(e,r){t.set(e,r),n.forEach(e=>e(t))},unregister(e){t.delete(e),n.forEach(e=>e(t))},subscribe(e){return n.add(e),e(t),()=>{n.delete(e)}}}}return e[q]}function H(e){let t=new Set,n=[];for(let r of[e.category1,e.category2,e.category3]){if(typeof r!=`string`)continue;let e=r.trim();!e||t.has(e)||(t.add(e),n.push(e))}return n}function je(e){let[t=``,n=``,r=``]=H(e);return e.category1===t&&(e.category2??``)===n&&(e.category3??``)===r?e:{...e,category1:t,category2:n,category3:r}}function Me(e){return H(e).join(`, `)}function Ne(e){return[...e].sort((e,t)=>(e.sortOrder??2**53-1)-(t.sortOrder??2**53-1)||e.title.localeCompare(t.title))}function Pe(e){let t=[],n=[],r=new Set,i=new Set;for(let a of Ne(e)){for(let e of H(a)){let n=e.trim();!n||r.has(n)||(r.add(n),t.push(n))}let e=String(a.industry??``).trim();e&&!i.has(e)&&(i.add(e),n.push(e))}return{disciplines:Ie(t),industries:Ie(n),years:Fe(e)}}function Fe(e){let t=new Set;for(let n of e){let e=U(n.year);e>0&&t.add(e)}return Array.from(t).sort((e,t)=>t-e)}function Ie(e){return[...e].sort((e,t)=>e.localeCompare(t,void 0,{numeric:!0,sensitivity:`base`}))}function Le(e){return e.slug?`/case-studies/${e.slug}`:``}function Re(e){return W(e.thumbnailVideoLink)}function U(e){if(e==null)return 0;if(typeof e==`number`)return Number.isFinite(e)&&e>1900?Math.floor(e):0;if(typeof e==`object`){if(e instanceof Date){let t=e.getFullYear();return Number.isFinite(t)&&t>1900?t:0}let t=e;return`value`in t?U(t.value):`year`in t?U(t.year):0}let t=String(e).trim();if(!t)return 0;let n=Number(t);if(Number.isFinite(n)&&n>1900)return Math.floor(n);let r=t.match(/(?:19|20)\d{2}/);return r?Number(r[0]):0}function ze(e){if(e){if(typeof e==`string`)return e||void 0;if(typeof e==`object`){let t=e;if(typeof t.src==`string`)return t.src||void 0;if(typeof t.url==`string`)return t.url||void 0}}}function W(e){if(!e)return``;if(typeof e==`string`)return e.trim();if(Array.isArray(e))return e.map(W).find(Boolean)||``;if(typeof e==`object`){let t=e;if(`value`in t)return W(t.value);for(let e of[`src`,`url`,`href`,`file`]){let n=W(t[e]);if(n)return n}}return``}function Be(e){return String(e||``).split(/[\n,]/).map(e=>e.trim()).filter(Boolean)}function Ve(e,t){for(let n of Be(t)){let t=W(G(e,n));if(t)return t}return``}function He(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}function Ue(e){return Array.from(new Set(e.filter(Boolean)))}function G(e,t){let n=e?.[t];return n&&typeof n==`object`&&`value`in n?n.value:n}function K(e){return String(e??``).trim()}function We(e){let t=typeof e==`number`?e:Number(e);return Number.isFinite(t)?t:void 0}function Ge(e,t){let n=He(t);return RegExp(`/${n}(?:\\.[^/?#]+)?\\.(?:js|mjs)(?:[?#].*)?$`).test(e)}function Ke(e,t){let n=He(t);return e.match(RegExp(`https://framerusercontent\\.com/(?:sites|modules)/[^"']+/${n}(?:\\.[^"'/]+)?\\.(?:js|mjs)`,`i`))?.[0]}function qe(){if(typeof document>`u`)return[];let e=Array.from(document.querySelectorAll(`link[href], script[src], img[src], source[src]`)).map(e=>`href`in e&&e.href?e.href:`src`in e&&e.src?e.src:``),t=typeof performance<`u`&&typeof performance.getEntriesByType==`function`?performance.getEntriesByType(`resource`).map(e=>e.name):[];return Ue([...e,...t])}function Je(e){let t=qe().find(t=>Ge(t,e));if(t)return t;if(typeof document<`u`&&document.documentElement)return Ke(document.documentElement.outerHTML,e)}async function Ye(e,t){let n=K(t);if(n)return n;let r=Je(e);if(r)return r;for(let t of _t)try{let n=await fetch(t,{credentials:`same-origin`});if(!n.ok)continue;let r=Ke(await n.text(),e);if(r)return r}catch{}}function Xe(e){try{typeof e.r==`function`&&e.r()}catch{}}function Ze(e){let t=e.a?.collectionByLocaleId?.default;if(t&&typeof t.scanItems==`function`)return t;let n=(e.r&&typeof e.r==`object`?e.r:void 0)?.collectionByLocaleId?.default;if(n&&typeof n.scanItems==`function`)return n}function Qe(e,t){let n=e.data,r=gt,i=K(G(n,r.title));return i?{title:i,slug:K(G(n,r.slug))||K(e.slug),sortOrder:We(G(n,r.sortOrder)),category1:K(G(n,r.category1)),category2:K(G(n,r.category2)),category3:K(G(n,r.category3)),industry:K(G(n,r.industry)),year:K(G(n,r.year)),thumbnail:ze(G(n,r.thumbnail))||``,thumbnailVideoLink:Ve(n,t),isHomepage:!!G(n,r.isHomepage)}:null}async function $e(e,t=Z){let n=await Ye(ht,e);if(!n)return[];let r=await import(n);Xe(r);let i=Ze(r)?.scanItems;return typeof i==`function`?(await i()).map(e=>Qe(e,t)).filter(e=>!!e):[]}function et(e){let t=new Map;for(let n of e){let e=U(n.year),r=t.get(e);r?r.push(n):t.set(e,[n])}return Array.from(t.entries()).sort(([e],[t])=>e===0?1:t===0?-1:t-e).map(([e,t])=>({year:e,items:[...t].sort((e,t)=>e.title.localeCompare(t.title))}))}function tt(e,t,n){let r=n.trim().toLowerCase(),i=t.disciplines.length>0,a=t.industries.length>0,o=t.years.length>0;if(!i&&!a&&!o&&!r)return e;let s=i?new Set(t.disciplines):null,c=a?new Set(t.industries):null,l=o?new Set(t.years):null;return e.filter(e=>{let n=H(e),i=!s||t.disciplines.every(e=>n.includes(e)),a=!c||c.has(e.industry),o=!l||l.has(U(e.year)),u=!r||e.title.toLowerCase().includes(r);return i&&a&&o&&u})}function nt(e,t){return e.includes(t)?e.filter(e=>e!==t):[...e,t]}function rt(){return`
  @keyframes idxFadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes idxRuleDraw {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  .idx-row { animation: idxFadeUp 300ms ease both; }

  .idx-rule {
    animation: idxRuleDraw 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
    transform-origin: left center;
    will-change: transform;
  }

  .idx-tax-item {
    cursor: pointer;
    transition: opacity 150ms ease;
    user-select: none;
  }
  .idx-tax-item:hover { opacity: 0.55; }
  .idx-tax-item:focus-visible {
    outline: 1px solid ${Y.textPrimary};
    outline-offset: 3px;
  }


  .idx-list-row {
    transition: background 150ms ease;
    border-radius: 2px;
  }
  .idx-hover-highlight .idx-list-row:hover { background: rgba(20, 20, 20, 0.035); }

  .idx-flip-text {
    display: block;
    width: 100%;
    min-width: 0;
    height: var(--idx-flip-height);
    line-height: var(--idx-flip-height);
    overflow: hidden;
    color: inherit;
  }
  .idx-flip-track {
    display: flex;
    flex-direction: column;
    gap: 5px;
    transform: translateY(0);
    transition: transform 620ms cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform;
  }
  .idx-flip-copy {
    display: block;
    flex: 0 0 var(--idx-flip-height);
    height: var(--idx-flip-height);
    line-height: var(--idx-flip-height);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .idx-hover-flip .idx-list-row:hover .idx-flip-track,
  .idx-hover-flip .idx-list-row:focus-visible .idx-flip-track {
    transform: translateY(calc((var(--idx-flip-height) + 5px) * -1));
  }

  .idx-rule,
  .idx-row-divider,
  .idx-year-rule,
  .idx-grid-top-rule,
  .idx-list-bottom-rule {
    background-color: ${Y.dividerSubtle} !important;
    border-color: ${Y.dividerSubtle} !important;
    opacity: 1 !important;
  }

  .idx-view-toggle {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    gap: 8px;
    width: 100%;
    margin: 12px 0 24px;
    font-family: ${Y.fontMono};
    font-size: 13px;
    font-weight: 400;
    line-height: 28px;
    text-transform: uppercase;
    letter-spacing: 0;
    color: ${Y.textPrimary} !important;
    -webkit-text-fill-color: ${Y.textPrimary} !important;
    opacity: 1 !important;
  }

  .idx-taxonomy-shell + .idx-tax-item {
    display: block;
    margin-top: 12px !important;
    line-height: 28px !important;
  }

  .idx-container:has(.idx-tax-value[aria-pressed="true"]) .idx-view-toggle {
    margin-top: -28px;
  }

  .idx-view-toggle-option {
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    appearance: none;
    -webkit-appearance: none;
    font: inherit;
    line-height: inherit;
    text-transform: inherit;
    letter-spacing: inherit;
    color: ${Y.textPrimary} !important;
    -webkit-text-fill-color: ${Y.textPrimary} !important;
    cursor: pointer;
    text-decoration: none;
    text-underline-offset: 3px;
    transition:
      color 150ms ease,
      -webkit-text-fill-color 150ms ease;
  }

  .idx-view-toggle-option[data-active="true"] {
    text-decoration: underline;
    color: ${Y.textPrimary} !important;
    -webkit-text-fill-color: ${Y.textPrimary} !important;
    opacity: 1 !important;
  }

  .idx-view-toggle-option:hover {
    color: ${Y.textTertiary} !important;
    -webkit-text-fill-color: ${Y.textTertiary} !important;
    opacity: 1;
  }

  .idx-view-toggle-option:focus-visible {
    outline: 1px solid ${Y.textPrimary};
    outline-offset: 3px;
  }

  .idx-view-toggle-divider {
    font: inherit;
    line-height: inherit;
    color: ${Y.textPrimary} !important;
    -webkit-text-fill-color: ${Y.textPrimary} !important;
    opacity: 1 !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .idx-row,
    .idx-grid-card,
    .idx-rule {
      animation: none !important;
      transform: none !important;
    }
    .idx-flip-track {
      transition: none !important;
      transform: none !important;
    }
    .idx-grid-card-img,
    .idx-grid-card-video {
      transform: scale(1) !important;
      transition: none !important;
      will-change: auto !important;
    }
  }

  .idx-project-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: var(--idx-grid-gap, 20px);
    row-gap: 56px;
    width: 100%;
  }
  .idx-grid-card {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    animation: idxFadeUp 300ms ease both;
  }
  .idx-grid-card-title {
    width: 100%;
    min-width: 0;
  }
  .idx-grid-card-media {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    clip-path: inset(0);
    contain: paint;
    isolation: isolate;
    background: ${Y.surfaceActive};
  }
  .idx-grid-card-meta {
    margin-top: -2px;
    font-family: ${Y.fontMono};
    font-size: 13px;
    line-height: 20px;
    letter-spacing: 0;
    text-transform: uppercase;
    color: ${Y.textTertiary};
  }
  .idx-grid-card-img,
  .idx-grid-card-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border: 0;
    transform: scale(1);
    transform-origin: center center;
    transition: transform 420ms cubic-bezier(.22, 1, .36, 1);
    backface-visibility: hidden;
    will-change: transform;
  }
  .idx-grid-card-video {
    pointer-events: none;
  }
  .idx-grid-card:hover .idx-grid-card-img,
  .idx-grid-card:focus-visible .idx-grid-card-img,
  .idx-grid-card:focus-within .idx-grid-card-img,
  .idx-grid-card:hover .idx-grid-card-video,
  .idx-grid-card:focus-visible .idx-grid-card-video,
  .idx-grid-card:focus-within .idx-grid-card-video {
    transform: scale(1.02);
  }
  .idx-grid-card:hover .idx-flip-track,
  .idx-grid-card:focus-visible .idx-flip-track {
    transform: translateY(calc((var(--idx-flip-height) + 5px) * -1));
  }

  .idx-tax-label-year { grid-column: 1 / span 1; grid-row: 1; }
  .idx-tax-items-year { grid-column: 2 / span 1; grid-row: 1; }
  .idx-tax-label-discipline { grid-column: 3 / span 1; grid-row: 1; }
  .idx-tax-items-discipline { grid-column: 4 / span 1; grid-row: 1; }
  .idx-tax-label-industry { grid-column: 5 / span 1; grid-row: 1; }
  .idx-tax-items-industry { grid-column: 6 / span 1; grid-row: 1; }

  .idx-list-title { grid-column: 1 / span 2; }
  .idx-list-discipline { grid-column: 3 / span 2; }
  .idx-list-industry { grid-column: 5 / span 1; }

  @media (max-width: 1199px) {
    .idx-container { padding: 0 20px !important; }
    .idx-project-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    .idx-year-group { grid-template-columns: 1fr !important; row-gap: 8px !important; }
    .idx-year-label,
    .idx-list-content { grid-column: 1 / -1 !important; }
  }
  @media (max-width: 809px) {
    .idx-container { --idx-grid-gap: 12px; padding: 0 20px !important; }
    .idx-taxonomy-shell {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      column-gap: 16px !important;
      row-gap: 8px !important;
    }
    .idx-tax-label-year { grid-column: 1 / span 1 !important; grid-row: 1 !important; }
    .idx-tax-items-year { grid-column: 1 / span 1 !important; grid-row: 2 !important; }
    .idx-tax-label-discipline { grid-column: 2 / span 1 !important; grid-row: 1 !important; }
    .idx-tax-items-discipline { grid-column: 2 / span 1 !important; grid-row: 2 !important; }
    .idx-tax-label-industry { grid-column: 3 / span 1 !important; grid-row: 1 !important; }
    .idx-tax-items-industry { grid-column: 3 / span 1 !important; grid-row: 2 !important; }
    .idx-taxonomy-items { overflow: visible !important; }
    .idx-tax-item { white-space: normal !important; overflow-wrap: anywhere; }
    .idx-list-row-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      align-items: start !important;
      column-gap: 12px !important;
      row-gap: 2px !important;
      min-height: 0 !important;
      padding: 12px 0 10px !important;
    }
    .idx-list-title {
      grid-column: 1 / -1 !important;
      font-size: 18px !important;
    }
    .idx-list-discipline { grid-column: 1 / span 1 !important; }
    .idx-list-industry { grid-column: 2 / span 1 !important; }
    .idx-title-cell,
    .idx-col-discipline,
    .idx-col-industry {
      overflow: visible !important;
      text-overflow: clip !important;
      white-space: normal !important;
      overflow-wrap: anywhere;
    }
    .idx-list-standard .idx-title-cell > span,
    .idx-list-standard .idx-flip-copy {
      font-size: 18px !important;
      line-height: 1.18 !important;
    }
    .idx-flip-text {
      height: auto !important;
      line-height: 1.18 !important;
      overflow: visible !important;
    }
    .idx-flip-track {
      display: block !important;
      gap: 0 !important;
      transform: none !important;
      transition: none !important;
      will-change: auto !important;
    }
    .idx-hover-flip .idx-list-row:hover .idx-flip-track,
    .idx-hover-flip .idx-list-row:focus-visible .idx-flip-track {
      transform: none !important;
    }
    .idx-flip-copy {
      flex: initial !important;
      height: auto !important;
      line-height: inherit !important;
      overflow: visible !important;
      text-overflow: clip !important;
      white-space: normal !important;
    }
    .idx-flip-copy + .idx-flip-copy { display: none !important; }
    .idx-project-grid { grid-template-columns: 1fr !important; row-gap: 40px !important; }
    .idx-grid-card:hover .idx-flip-track,
    .idx-grid-card:focus-visible .idx-flip-track {
      transform: none !important;
    }
  }
  @media (max-width: 520px) {
    .idx-taxonomy-shell { grid-template-columns: 1fr !important; row-gap: 0 !important; }
    .idx-tax-label-discipline,
    .idx-tax-label-industry,
    .idx-tax-label-year,
    .idx-tax-items-discipline,
    .idx-tax-items-industry,
    .idx-tax-items-year {
      grid-column: 1 / -1 !important;
      grid-row: auto !important;
    }
    .idx-tax-label-discipline,
    .idx-tax-label-industry { margin-top: 20px; }
    .idx-list-row-grid { grid-template-columns: 1fr !important; row-gap: 0 !important; }
    .idx-list-discipline,
    .idx-list-industry { grid-column: 1 / -1 !important; }
  }

  @media (max-width: 1199px) {
    .idx-container {
      --idx-grid-gap: 16px !important;
      padding: 0 20px !important;
    }

    .idx-year-group {
      grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
      column-gap: var(--idx-grid-gap, 16px) !important;
      row-gap: 0 !important;
    }

    .idx-year-label {
      grid-column: 1 / span 1 !important;
      padding-top: 10px !important;
    }

    .idx-list-content {
      grid-column: 2 / span 5 !important;
      min-width: 0 !important;
    }

    .idx-list-row-grid {
      grid-template-columns: minmax(0, 1fr) max-content !important;
      align-items: center !important;
      column-gap: var(--idx-grid-gap, 16px) !important;
      row-gap: 0 !important;
      min-height: 45px !important;
      padding: 3px 0 !important;
    }

    .idx-list-title {
      grid-column: 1 / span 1 !important;
      font-size: inherit !important;
    }

    .idx-list-discipline,
    .idx-col-discipline {
      display: none !important;
    }

    .idx-list-industry {
      grid-column: 2 / span 1 !important;
      justify-self: end !important;
      text-align: right !important;
      max-width: min(180px, 34vw) !important;
    }

    .idx-title-cell {
      min-width: 0 !important;
      overflow: hidden !important;
      overflow-wrap: normal !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }

    .idx-col-industry {
      min-width: 0 !important;
      overflow: visible !important;
      overflow-wrap: normal !important;
      text-overflow: clip !important;
      white-space: normal !important;
    }

    .idx-year-number,
    .idx-list-standard .idx-title-cell > span,
    .idx-list-standard .idx-flip-copy {
      font-size: 22px !important;
      line-height: 1.2 !important;
    }

    .idx-list-standard .idx-flip-text {
      --idx-flip-height: 27px !important;
      height: 27px !important;
      line-height: 27px !important;
      overflow: hidden !important;
    }

    .idx-list-standard .idx-flip-copy {
      flex: 0 0 var(--idx-flip-height) !important;
      height: var(--idx-flip-height) !important;
      line-height: var(--idx-flip-height) !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }

    .idx-col-industry span {
      display: block !important;
      font-size: 12px !important;
      line-height: 14px !important;
      overflow: visible !important;
      text-overflow: clip !important;
      white-space: normal !important;
    }
  }

  @media (max-width: 899px) {
    .idx-taxonomy-shell {
      grid-template-columns: minmax(112px, 24%) minmax(0, 1fr) !important;
      column-gap: 20px !important;
      row-gap: 28px !important;
      align-items: start !important;
    }

    .idx-tax-label-discipline,
    .idx-tax-label-industry,
    .idx-tax-label-year {
      grid-column: 1 / span 1 !important;
      margin-top: 0 !important;
      min-width: 0 !important;
    }

    .idx-tax-items-discipline,
    .idx-tax-items-industry,
    .idx-tax-items-year {
      grid-column: 2 / span 1 !important;
      min-width: 0 !important;
      overflow: visible !important;
    }

    .idx-tax-label-year,
    .idx-tax-items-year {
      grid-row: 1 !important;
    }

    .idx-tax-label-discipline,
    .idx-tax-items-discipline {
      grid-row: 2 !important;
    }

    .idx-tax-label-industry,
    .idx-tax-items-industry {
      grid-row: 3 !important;
    }

    .idx-taxonomy-items {
      align-items: flex-start !important;
      overflow: visible !important;
    }

    .idx-tax-item {
      white-space: normal !important;
      overflow-wrap: break-word !important;
    }
  }

  @media (max-width: 809px) {
    .idx-container {
      --idx-grid-gap: 10px !important;
      padding: 0 20px !important;
    }

    .idx-taxonomy-shell {
      grid-template-columns: minmax(96px, 28%) minmax(0, 1fr) !important;
      column-gap: 18px !important;
      row-gap: 28px !important;
    }

    .idx-year-group {
      grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
      column-gap: var(--idx-grid-gap, 10px) !important;
      row-gap: 0 !important;
    }

    .idx-year-label {
      grid-column: 1 / span 1 !important;
      padding-top: 10px !important;
    }

    .idx-list-content {
      grid-column: 2 / span 5 !important;
    }

    .idx-list-row-grid {
      grid-template-columns: minmax(0, 1fr) max-content !important;
      align-items: center !important;
      column-gap: var(--idx-grid-gap, 10px) !important;
      row-gap: 0 !important;
      min-height: 45px !important;
      padding: 3px 0 !important;
    }

    .idx-list-title {
      grid-column: 1 / span 1 !important;
    }

    .idx-list-discipline,
    .idx-col-discipline {
      display: none !important;
    }

    .idx-list-industry {
      grid-column: 2 / span 1 !important;
      max-width: min(150px, 34vw) !important;
    }

    .idx-flip-text {
      --idx-flip-height: 20px !important;
      height: 20px !important;
      line-height: 20px !important;
      overflow: hidden !important;
    }

    .idx-flip-track {
      display: flex !important;
      flex-direction: column !important;
      gap: 5px !important;
      transform: translateY(0) !important;
      transition: transform 620ms cubic-bezier(0.16, 1, 0.3, 1) !important;
      will-change: transform !important;
    }

    .idx-flip-copy,
    .idx-flip-copy + .idx-flip-copy {
      display: block !important;
      flex: 0 0 var(--idx-flip-height) !important;
      height: var(--idx-flip-height) !important;
      line-height: var(--idx-flip-height) !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }
  }

  @media (max-width: 520px) {
    .idx-container {
      --idx-grid-gap: 8px !important;
      padding: 0 14px !important;
    }

    .idx-taxonomy-shell {
      grid-template-columns: minmax(84px, 32%) minmax(0, 1fr) !important;
      column-gap: 16px !important;
      row-gap: 26px !important;
      align-items: start !important;
    }

    .idx-tax-label-discipline,
    .idx-tax-label-industry,
    .idx-tax-label-year {
      grid-column: 1 / span 1 !important;
      margin-top: 0 !important;
      min-width: 0 !important;
    }

    .idx-tax-items-discipline,
    .idx-tax-items-industry,
    .idx-tax-items-year {
      grid-column: 2 / span 1 !important;
      min-width: 0 !important;
      overflow: visible !important;
    }

    .idx-tax-label-year,
    .idx-tax-items-year {
      grid-row: 1 !important;
    }

    .idx-tax-label-discipline,
    .idx-tax-items-discipline {
      grid-row: 2 !important;
    }

    .idx-tax-label-industry,
    .idx-tax-items-industry {
      grid-row: 3 !important;
    }

    .idx-tax-item {
      white-space: normal !important;
      overflow-wrap: break-word !important;
    }

    .idx-year-group {
      grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
      column-gap: var(--idx-grid-gap, 8px) !important;
    }

    .idx-year-label {
      grid-column: 1 / span 1 !important;
    }

    .idx-list-content {
      grid-column: 2 / span 5 !important;
    }

    .idx-list-row-grid {
      grid-template-columns: minmax(0, 1fr) max-content !important;
      column-gap: var(--idx-grid-gap, 8px) !important;
    }

    .idx-list-title {
      grid-column: 1 / span 1 !important;
    }

    .idx-list-discipline,
    .idx-list-industry {
      grid-column: auto !important;
    }

    .idx-list-industry {
      grid-column: 2 / span 1 !important;
      max-width: min(132px, 36vw) !important;
    }
  }
`}function it({filters:e,disciplineNavItems:t,industryNavItems:n,yearNavItems:r,onFilterToggle:i,onFilterClear:a,onClearFilters:o}){let s=e.disciplines.length>0||e.industries.length>0||e.years.length>0,c={...mt,alignItems:`flex-start`,fontFamily:Y.fontMono,fontSize:13,lineHeight:X,textTransform:`uppercase`,color:Y.textPrimary,letterSpacing:0},l={minWidth:0,font:`inherit`,lineHeight:X,color:Y.textPrimary,whiteSpace:`nowrap`},d={display:`flex`,flexDirection:`column`,alignItems:`flex-start`,minWidth:0,overflow:`hidden`},f=e=>({display:`block`,width:`100%`,margin:0,padding:0,border:`none`,background:`transparent`,font:`inherit`,lineHeight:X,textAlign:`left`,textTransform:`inherit`,color:Y.textPrimary,letterSpacing:0,fontWeight:400,textDecoration:e?`underline`:`none`,textUnderlineOffset:`3px`,cursor:`pointer`,appearance:`none`,WebkitAppearance:`none`});return m(`div`,{children:[m(`div`,{className:`idx-taxonomy-shell`,style:c,children:[u(`div`,{className:`idx-taxonomy-label idx-tax-label-year`,style:l,children:`/ Year`}),m(`div`,{className:`idx-taxonomy-items idx-tax-items-year`,style:d,children:[u(`button`,{type:`button`,className:`idx-tax-item`,style:f(e.years.length===0),"aria-pressed":e.years.length===0,"aria-label":`Show all years`,onClick:()=>a(`years`),children:`All`}),r.map(t=>u(`button`,{type:`button`,className:`idx-tax-item idx-tax-value`,style:f(e.years.includes(t)),"aria-pressed":e.years.includes(t),onClick:()=>i(`years`,t),children:t},t))]}),u(`div`,{className:`idx-taxonomy-label idx-tax-label-discipline`,style:l,children:`/ Service`}),m(`div`,{className:`idx-taxonomy-items idx-tax-items-discipline`,style:d,children:[u(`button`,{type:`button`,className:`idx-tax-item`,style:f(e.disciplines.length===0),"aria-pressed":e.disciplines.length===0,"aria-label":`Show all services`,onClick:()=>a(`disciplines`),children:`All`}),t.map(t=>u(`button`,{type:`button`,className:`idx-tax-item idx-tax-value`,style:f(e.disciplines.includes(t)),"aria-pressed":e.disciplines.includes(t),onClick:()=>i(`disciplines`,t),children:t},t))]}),u(`div`,{className:`idx-taxonomy-label idx-tax-label-industry`,style:l,children:`/ Industry`}),m(`div`,{className:`idx-taxonomy-items idx-tax-items-industry`,style:d,children:[u(`button`,{type:`button`,className:`idx-tax-item`,style:f(e.industries.length===0),"aria-pressed":e.industries.length===0,"aria-label":`Show all industries`,onClick:()=>a(`industries`),children:`All`}),n.map(t=>u(`button`,{type:`button`,className:`idx-tax-item idx-tax-value`,style:f(e.industries.includes(t)),"aria-pressed":e.industries.includes(t),onClick:()=>i(`industries`,t),children:t},t))]})]}),s&&u(`button`,{type:`button`,className:`idx-tax-item`,onClick:o,style:{marginTop:4,padding:0,border:`none`,background:`transparent`,fontFamily:Y.fontMono,fontSize:13,lineHeight:`28px`,textTransform:`uppercase`,color:Y.textSecondary,letterSpacing:0,cursor:`pointer`,textDecoration:`underline`,textUnderlineOffset:`3px`,appearance:`none`,WebkitAppearance:`none`},children:`Clear filters`})]})}function at({text:e,activeText:t,style:n,activeStyle:r,height:i}){return u(`span`,{className:`idx-flip-text`,style:{...n,"--idx-flip-height":i},"aria-label":e,children:m(`span`,{className:`idx-flip-track`,"aria-hidden":`true`,children:[u(`span`,{className:`idx-flip-copy`,children:e}),u(`span`,{className:`idx-flip-copy`,style:r,children:t??e})]})})}function ot({projects:e,typographyVariant:t=`standard`,hoverVariant:n=`flip`}){let r=p(()=>et(e),[e]),a=t===`mono13`,o={fontFamily:Y.fontMono,fontSize:13,fontWeight:400,lineHeight:`28px`,textTransform:`uppercase`,color:Y.textPrimary,letterSpacing:0},s=a?o:{fontFamily:Y.fontHeading,fontSize:22,fontWeight:500,textTransform:`uppercase`,color:Y.textPrimary,lineHeight:1.2},c={...s,fontFamily:Y.fontProjectCta,fontWeight:400,color:Y.textTertiary,WebkitTextFillColor:Y.textTertiary},l=a?`28px`:`27px`;if(r.length===0)return u(`div`,{style:{padding:`64px 0`,textAlign:`center`,fontFamily:Y.fontMono,fontSize:13,lineHeight:`28px`,textTransform:`uppercase`,color:Y.textTertiary},children:`No work matches those filters.`});let d=Math.min(r.length,8)*70;return m(`div`,{className:`idx-list-view idx-list-${t} idx-hover-${n}`,children:[r.map(({year:e,items:t},r)=>m(`div`,{className:`idx-year-group`,style:mt,children:[u(`div`,{className:`idx-rule idx-year-rule`,style:{gridColumn:`1 / -1`,height:1,backgroundColor:Y.dividerStrong,animationDelay:`${Math.min(r,8)*70}ms`}}),u(`div`,{className:`idx-year-label`,style:{gridColumn:`1 / span 1`,minWidth:0,paddingTop:a?5:15},children:u(`div`,{className:`idx-year-number`,style:a?o:s,children:e>0?e:`—`})}),u(`div`,{className:`idx-list-content`,style:{gridColumn:`2 / span 5`,minWidth:0},children:t.map((e,d)=>{let f=Le(e),p=Me(e),h=n===`flip`;return m(`div`,{children:[m(`div`,{className:`idx-list-row idx-row idx-list-row-grid`,style:{display:`grid`,gridTemplateColumns:`repeat(5, minmax(0, 1fr))`,columnGap:dt,alignItems:`center`,minHeight:a?38:56,padding:a?`5px 0`:`9px 0`,cursor:f?`pointer`:`default`,animationDelay:`${Math.min(d,12)*30}ms`},onClick:()=>{f&&(i.location.href=f)},children:[u(`div`,{className:`idx-title-cell idx-list-title`,style:{minWidth:0,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:h?u(at,{text:e.title,activeText:f?`View Project →`:e.title,style:s,activeStyle:f?c:void 0,height:l}):u(`span`,{style:s,children:e.title})}),u(`div`,{className:`idx-col-discipline idx-list-discipline`,style:{minWidth:0,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:u(`span`,{style:o,children:p})}),u(`div`,{className:`idx-col-industry idx-list-industry`,style:{minWidth:0,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:u(`span`,{style:o,children:e.industry})})]}),d<t.length-1&&u(`div`,{className:`idx-rule idx-row-divider`,style:{height:1,backgroundColor:Y.dividerSubtle,animationDelay:`${Math.min(r*3+d,16)*35}ms`}})]},e.slug||e.title)})})]},e)),u(`div`,{className:`idx-rule idx-list-bottom-rule`,style:{height:1,width:`100%`,backgroundColor:Y.dividerStrong,animationDelay:`${d}ms`}})]})}function st({project:e,index:t}){let n=Le(e),r=ze(e.thumbnail),i=Re(e),a=Me(e),o=U(e.year),s=[e.industry,o>0?String(o):``].filter(Boolean).join(` / `),c={fontFamily:Y.fontHeading,fontSize:22,fontWeight:500,textTransform:`uppercase`,color:Y.textPrimary,lineHeight:1.2},l={...c,fontFamily:Y.fontProjectCta,fontWeight:400,color:Y.textTertiary,WebkitTextFillColor:Y.textTertiary};return m(`a`,{className:`idx-grid-card`,href:n||void 0,"aria-label":e.title,style:{animationDelay:`${Math.min(t,12)*30}ms`},children:[u(`div`,{className:`idx-grid-card-media`,children:i?u(`video`,{className:`idx-grid-card-video`,src:i,poster:r,muted:!0,loop:!0,playsInline:!0,autoPlay:!0,preload:`metadata`}):r?u(`img`,{className:`idx-grid-card-img`,src:r,alt:`${e.title} thumbnail`,loading:`lazy`,decoding:`async`}):null}),u(`div`,{className:`idx-grid-card-title`,children:u(at,{text:e.title,activeText:n?`View Project →`:e.title,style:c,activeStyle:n?l:void 0,height:`27px`})}),m(`div`,{className:`idx-grid-card-meta`,children:[a,a&&s?u(`br`,{}):null,s]})]})}function ct({projects:e}){return e.length===0?u(`div`,{style:{padding:`64px 0`,textAlign:`center`,fontFamily:Y.fontMono,fontSize:13,lineHeight:`28px`,textTransform:`uppercase`,color:Y.textTertiary},children:`No work matches those filters.`}):m(g,{children:[u(`div`,{className:`idx-rule idx-grid-top-rule`,style:{height:1,width:`100%`,backgroundColor:Y.dividerStrong,marginBottom:24}}),u(`div`,{className:`idx-project-grid`,"aria-label":`Filtered project grid`,children:e.map((e,t)=>u(st,{project:e,index:t},e.slug||e.title))})]})}function lt({activeView:e,onViewChange:t}){return u(`div`,{className:`idx-view-toggle`,"aria-label":`Project view`,children:pt.map((n,r)=>{let i=e===n;return m(_.Fragment,{children:[r>0&&u(`span`,{className:`idx-view-toggle-divider`,"aria-hidden":`true`,children:`/`}),u(`button`,{type:`button`,className:`idx-view-toggle-option`,"data-active":i?`true`:`false`,"aria-pressed":i,onClick:()=>t(n),children:n})]},n)})})}function ut({projects:e,useCMS:r=!1,cmsModuleUrl:i=``,thumbnailVideoFieldIds:a=Z,defaultView:s=`list`,listTypographyVariant:c=`standard`,listHoverVariant:l=`flip`,textPrimary:d,textSecondary:h,textTertiary:_,bg:v,dividerStrong:y,dividerSubtle:b,surfaceActive:x}){Y.textPrimary=d||J.textPrimary,Y.textSecondary=h||J.textSecondary,Y.textTertiary=_||J.textTertiary,Y.bg=v||J.bg,Y.dividerStrong=y||J.dividerStrong,Y.dividerSubtle=b||J.dividerSubtle,Y.surfaceActive=x||J.surfaceActive;let S=p(()=>rt(),[d,h,_,v,y,b,x]),[C,w]=o(()=>new Map),[T,E]=o([]),[D,O]=o(!1);f(()=>{if(!r)return;let e=Ae();if(e)return e.subscribe(e=>{w(new Map(e))})},[r]),f(()=>{if(!r){E([]),O(!1);return}let e=!1;return O(!1),$e(i,a).then(t=>{e||(E(t),O(!0))}).catch(()=>{e||(E([]),O(!0))}),()=>{e=!0}},[r,i,a]);let k=p(()=>{let t=r&&C.size>0?Array.from(C.values()):null,n=r&&T.length>0?T:null,i=e&&e.length>0?e:null;return(r?t??n??i??[]:i??vt).map(je)},[r,C,T,e]),[A,ee]=o(s===`grid`?`grid`:`list`),[j,M]=o(!1),[te,ne]=o(0),[N,P]=o({disciplines:[],industries:[],years:[]}),F=n(null),I=p(()=>Pe(k),[k]),re=t(e=>{e!==A&&(F.current&&clearTimeout(F.current),M(!0),F.current=setTimeout(()=>{ee(e),ne(e=>e+1),M(!1),F.current=null},150))},[A]);f(()=>()=>{F.current&&clearTimeout(F.current)},[]);let ie=t((e,t)=>{P(n=>e===`years`?{...n,years:nt(n.years,Number(t))}:e===`industries`?{...n,industries:nt(n.industries,String(t))}:{...n,disciplines:nt(n.disciplines,String(t))})},[]),L=t(e=>{P(t=>t[e].length===0?t:{...t,[e]:[]})},[]),ae=t(()=>P(e=>e.disciplines.length===0&&e.industries.length===0&&e.years.length===0?e:{disciplines:[],industries:[],years:[]}),[]),R=p(()=>tt(k,N,``),[k,N]),oe=r&&C.size===0&&T.length===0&&!D;return m(g,{children:[u(`style`,{children:S}),m(`div`,{className:`idx-container`,style:{width:`100%`,color:Y.textPrimary,fontFamily:Y.fontMono,boxSizing:`border-box`,minHeight:`60vh`,padding:`0 20px`,WebkitFontSmoothing:`antialiased`,MozOsxFontSmoothing:`grayscale`},children:[u(`div`,{style:{opacity:1,pointerEvents:`auto`,transition:`opacity 200ms ease`,marginBottom:18},children:u(it,{filters:N,disciplineNavItems:I.disciplines,industryNavItems:I.industries,yearNavItems:I.years,onFilterToggle:ie,onFilterClear:L,onClearFilters:ae})}),u(lt,{activeView:A,onViewChange:re}),u(`div`,{style:{opacity:j?0:1,transition:j?`opacity 150ms ease`:`opacity 250ms ease`},children:oe?u(`div`,{style:{padding:`64px 0`,textAlign:`center`,fontFamily:Y.fontMono,fontSize:13,lineHeight:`28px`,textTransform:`uppercase`,color:Y.textTertiary},children:`Loading work...`}):A===`grid`?u(ct,{projects:R}):u(ot,{projects:R,typographyVariant:c,hoverVariant:l})},te),m(`div`,{style:{marginTop:16,paddingBottom:160,fontFamily:Y.fontMono,fontSize:13,lineHeight:`28px`,textTransform:`uppercase`,color:Y.textPrimary},children:[R.length,` `,R.length===1?`Project`:`Projects`]})]})]})}var q,dt,ft,pt,mt,J,Y,X,ht,gt,_t,Z,vt,yt=e((()=>{r(),h(),c(),D(),q=`__articaIndexProjectsRegistry`,dt=`var(--idx-grid-gap, 20px)`,ft=`repeat(6, minmax(0, 1fr))`,pt=[`grid`,`list`],mt={display:`grid`,gridTemplateColumns:ft,columnGap:dt,width:`100%`},J={textPrimary:`#26211f`,textSecondary:`#141414`,textTertiary:`#979797`,bg:`#F7F5F0`,dividerStrong:`#141414`,dividerSubtle:`#141414`,surfaceOverlay:`rgba(215, 213, 207, 0.72)`,surfaceActive:`#EAE8E3`,fontDisplay:`'GT Standard Trial', 'Inter', sans-serif`,fontHeading:`'GT Standard Trial', 'Inter', sans-serif`,fontProjectCta:`'GT Standard', 'GT Standard L Regular', 'GT Standard Trial', 'Inter', sans-serif`,fontMono:`'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace`},Y={...J},X=`24px`,ht=`yTHrQWMIY`,gt={title:`oeXZcmPna`,slug:`pdXVG_fBO`,sortOrder:`DLBifmgp1`,category1:`kuvJcmOFr`,category2:`VV1CggU2J`,category3:`E6OpH0hSs`,thumbnail:`Jy7hBJady`,thumbnailVideoLink:`SvOqFqdby`,year:`QZqSK_3OF`,industry:`mBIilFqVM`,isHomepage:`myUIfK0j7`},_t=[`/`,`/case-studies`,`https://khaki-ship-257706.framer.app/`,`https://khaki-ship-257706.framer.app/case-studies`],Z=gt.thumbnailVideoLink,vt=[{title:`AirPods Pro 3`,category1:`Visual Identity`,category2:`2D Motion`,category3:`3D Motion`,industry:`Technology`,year:`2025`,thumbnail:`https://framerusercontent.com/images/JITjBIRyOd5DdC7juV7X5RwU9I.jpg`,thumbnailVideoLink:``,slug:`airpods`,sortOrder:1,isHomepage:!0},{title:`Simon & Schuster`,category1:`Brand Strategy`,category2:`Visual Identity`,category3:`Experience Design`,industry:`Publishing, Literature, Media`,year:`2025`,thumbnail:`https://framerusercontent.com/images/ZViKn9ASVVsE90tOfnWU7sW0U.png`,thumbnailVideoLink:``,slug:`simon-schuster`,sortOrder:2,isHomepage:!0},{title:`Gaia`,category1:`Visual Identity`,category2:`UX/UI`,category3:`Brand Strategy`,industry:`Nature`,year:`2026`,thumbnail:`https://framerusercontent.com/images/1a1LDlRx4V2kNoG7kX7hvWygUCg.jpg`,thumbnailVideoLink:``,slug:`gaia`,sortOrder:3,isHomepage:!0},{title:`National Park Playing Cards`,category1:`Product Design`,category2:`Package Design`,category3:`Marketing`,industry:`Outdoors, Travel`,year:`2019`,thumbnail:`https://framerusercontent.com/images/YdGKidrUlzOXfODfaQNqfCx5dM.png`,thumbnailVideoLink:``,slug:`national-park-cards`,sortOrder:4,isHomepage:!0},{title:`Motion Connect 2025`,category1:`Visual Identity`,category2:`2D Motion`,category3:`Social Media`,industry:`Education, Motion Design`,year:`2025`,thumbnail:`https://framerusercontent.com/images/W592y16ERqrZ1qFuxRe3dcsv8I.jpg`,thumbnailVideoLink:``,slug:`motion-connect-2025`,sortOrder:5,isHomepage:!0},{title:`Yomo`,category1:`Visual Identity`,category2:`User Interface`,category3:`User Experience`,industry:`Food, Health, Technology`,year:`2025`,thumbnail:`https://framerusercontent.com/images/PXsrzy7ezkkjSfUrVHhUuP2sk4k.jpg`,thumbnailVideoLink:``,slug:`yomo`,sortOrder:6,isHomepage:!0},{title:`Karuna`,category1:`Brand Identity`,category2:`Packaging Design`,category3:``,industry:`Consumer Goods, Sustainability, Social Enterprise`,year:`2025`,thumbnail:`https://framerusercontent.com/images/Dj1KLsghEL5tCJkNgSjKFvuIMMU.png`,thumbnailVideoLink:``,slug:`karuna`,sortOrder:7,isHomepage:!1},{title:`Weaponized Innocence`,category1:`Editorial`,category2:`UX/UI`,category3:`Visual Identity`,industry:`Human Rights`,year:`2024`,thumbnail:`https://framerusercontent.com/images/BRh73XzVlRBoYNh03pKXVIYYPw.png`,thumbnailVideoLink:``,slug:`weaponized-innocence`,sortOrder:8,isHomepage:!0},{title:`Wolff Olins x ArtCenter`,category1:`Visual Identity`,category2:`2D Motion`,category3:`Social Media`,industry:`Education`,year:`2024`,thumbnail:``,thumbnailVideoLink:``,slug:`wolff-olins-x-artcenter`,sortOrder:9,isHomepage:!1},{title:`Aspen Valley Landscaping`,category1:`Visual Identity`,category2:`Brand Strategy`,category3:``,industry:`Nature`,year:`2024`,thumbnail:``,thumbnailVideoLink:``,slug:`aspen-valley-landscaping`,sortOrder:10,isHomepage:!1},{title:`Cellular Symphony`,category1:`3D Motion`,category2:``,category3:``,industry:`Science`,year:`2024`,thumbnail:`https://framerusercontent.com/images/j9uS8SZ6aEBOUihZfXOWVeSrVs8.jpg`,thumbnailVideoLink:``,slug:`cellular-symphony`,sortOrder:11,isHomepage:!1},{title:`Neon Lights`,category1:`2D Motion`,category2:``,category3:``,industry:`Music`,year:`2024`,thumbnail:`https://framerusercontent.com/images/TYPcX0xZpgwrY5Ezh0e7forig.jpg`,thumbnailVideoLink:``,slug:`neon-lights`,sortOrder:12,isHomepage:!1},{title:`John Steinbeck`,category1:`Editorial`,category2:`Visual Identity`,category3:``,industry:`Literature`,year:`2023`,thumbnail:``,thumbnailVideoLink:``,slug:`john-steinbeck`,sortOrder:13,isHomepage:!1},{title:`Seek Truth`,category1:`Editorial`,category2:`Visual Identity`,category3:``,industry:`Human Rights`,year:`2024`,thumbnail:`https://framerusercontent.com/images/ZZz0tz3CmTn9Zwf1r21GPbcqFNk.png`,thumbnailVideoLink:``,slug:`seek-truth`,sortOrder:14,isHomepage:!1},{title:`Independent Lens`,category1:`Editorial`,category2:`Visual Identity`,category3:``,industry:`Human Rights`,year:`2024`,thumbnail:`https://framerusercontent.com/images/2l7fi2HvjNmusO8H6tXWKotl8.jpg`,thumbnailVideoLink:``,slug:`independent-lens`,sortOrder:15,isHomepage:!1}],z(ut,{useCMS:{type:L.Boolean,title:`Use CMS`,defaultValue:!1,enabledTitle:`On`,disabledTitle:`Off`},cmsModuleUrl:{type:L.String,title:`CMS Module URL`,defaultValue:``,hidden:e=>!e.useCMS},thumbnailVideoFieldIds:{type:L.String,title:`Video Fields`,defaultValue:Z,placeholder:`Thumbnail Video field ID`,displayTextArea:!0,hidden:e=>!e.useCMS},projects:{type:L.Array,title:`Projects`,control:{type:L.Object,controls:{title:{type:L.String,title:`Title`},category1:{type:L.String,title:`Service 1`},category2:{type:L.String,title:`Service 2`},category3:{type:L.String,title:`Service 3`},industry:{type:L.String,title:`Industry`},year:{type:L.String,title:`Year`},thumbnail:{type:L.Image,title:`Thumbnail`},thumbnailVideoLink:{type:L.File,title:`Thumbnail Video`,allowedFileTypes:[`mp4`,`mov`,`m4v`,`webm`]},slug:{type:L.String,title:`Slug`},sortOrder:{type:L.Number,title:`Sorting Number`},isHomepage:{type:L.Boolean,title:`Is Homepage`}}}},defaultView:{type:L.Enum,title:`Default View`,options:[`list`,`grid`],defaultValue:`list`},listTypographyVariant:{type:L.Enum,title:`List Type`,options:[`standard`,`mono13`],optionTitles:[`Standard`,`Mono 13`],defaultValue:`standard`,displaySegmentedControl:!0},listHoverVariant:{type:L.Enum,title:`List Hover`,options:[`flip`,`highlight`],optionTitles:[`Flip`,`Highlight`],defaultValue:`flip`,displaySegmentedControl:!0},textPrimary:{type:L.Color,title:`Text Primary`,defaultValue:`#26211f`},textSecondary:{type:L.Color,title:`Text Secondary`,defaultValue:`#141414`},textTertiary:{type:L.Color,title:`Text Tertiary`,defaultValue:`#979797`},bg:{type:L.Color,title:`Background`,defaultValue:`#F7F5F0`},dividerStrong:{type:L.Color,title:`Divider Strong`,defaultValue:`#141414`},dividerSubtle:{type:L.Color,title:`Divider Subtle`,defaultValue:`#141414`},surfaceActive:{type:L.Color,title:`Surface Active`,defaultValue:`#EAE8E3`}})}));function bt({enabled:e=!0}){return e?u(`style`,{children:xt}):null}var xt,St=e((()=>{h(),D(),xt=`
  .idx-view-toggle {
    font-family: 'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace !important;
    font-size: 13px !important;
    font-weight: 400 !important;
    line-height: 28px !important;
    text-transform: uppercase !important;
    letter-spacing: 0 !important;
    color: #141414 !important;
    -webkit-text-fill-color: #141414 !important;
    opacity: 1 !important;
    align-items: baseline !important;
    margin-top: 12px !important;
    margin-bottom: 24px !important;
  }

  .idx-taxonomy-shell + .idx-tax-item {
    display: block !important;
    margin-top: 12px !important;
    line-height: 28px !important;
  }

  .idx-view-toggle-option,
  .idx-view-toggle-divider {
    font: inherit !important;
    line-height: inherit !important;
    text-transform: inherit !important;
    letter-spacing: inherit !important;
    color: #141414 !important;
    -webkit-text-fill-color: #141414 !important;
  }

  .idx-view-toggle-option[data-active="true"] {
    color: #141414 !important;
    -webkit-text-fill-color: #141414 !important;
    opacity: 1 !important;
    text-decoration: underline !important;
    text-underline-offset: 3px !important;
  }

  .idx-view-toggle-option:hover {
    color: #979797 !important;
    -webkit-text-fill-color: #979797 !important;
    opacity: 1 !important;
  }

  .idx-container:has(.idx-tax-value[aria-pressed="true"]) .idx-view-toggle {
    margin-top: -28px !important;
  }

  @media (max-width: 1199px) {
    .idx-container {
      --idx-grid-gap: 16px !important;
      padding: 0 20px !important;
    }

    .idx-year-group {
      grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
      column-gap: var(--idx-grid-gap, 16px) !important;
      row-gap: 0 !important;
    }

    .idx-year-label {
      grid-column: 1 / span 1 !important;
      padding-top: 10px !important;
    }

    .idx-list-content {
      grid-column: 2 / span 5 !important;
      min-width: 0 !important;
    }

    .idx-list-row-grid {
      grid-template-columns: minmax(0, 1fr) max-content !important;
      align-items: center !important;
      column-gap: var(--idx-grid-gap, 16px) !important;
      row-gap: 0 !important;
      min-height: 45px !important;
      padding: 3px 0 !important;
    }

    .idx-list-title {
      grid-column: 1 / span 1 !important;
      font-size: inherit !important;
    }

    .idx-list-discipline,
    .idx-col-discipline {
      display: none !important;
    }

    .idx-list-industry {
      grid-column: 2 / span 1 !important;
      justify-self: end !important;
      text-align: right !important;
      max-width: min(180px, 34vw) !important;
    }

    .idx-title-cell {
      min-width: 0 !important;
      overflow: hidden !important;
      overflow-wrap: normal !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }

    .idx-col-industry {
      min-width: 0 !important;
      overflow: visible !important;
      overflow-wrap: normal !important;
      text-overflow: clip !important;
      white-space: normal !important;
    }

    .idx-year-number,
    .idx-list-standard .idx-title-cell > span,
    .idx-list-standard .idx-flip-copy {
      font-size: 22px !important;
      line-height: 1.2 !important;
    }

    .idx-list-standard .idx-flip-text {
      --idx-flip-height: 27px !important;
      height: 27px !important;
      line-height: 27px !important;
      overflow: hidden !important;
    }

    .idx-list-standard .idx-flip-copy {
      flex: 0 0 var(--idx-flip-height) !important;
      height: var(--idx-flip-height) !important;
      line-height: var(--idx-flip-height) !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }

    .idx-col-industry span {
      display: block !important;
      font-size: 12px !important;
      line-height: 14px !important;
      overflow: visible !important;
      text-overflow: clip !important;
      white-space: normal !important;
    }
  }

  @media (max-width: 899px) {
    .idx-taxonomy-shell {
      grid-template-columns: minmax(112px, 24%) minmax(0, 1fr) !important;
      column-gap: 20px !important;
      row-gap: 28px !important;
      align-items: start !important;
    }

    .idx-tax-label-discipline,
    .idx-tax-label-industry,
    .idx-tax-label-year {
      grid-column: 1 / span 1 !important;
      margin-top: 0 !important;
      min-width: 0 !important;
    }

    .idx-tax-items-discipline,
    .idx-tax-items-industry,
    .idx-tax-items-year {
      grid-column: 2 / span 1 !important;
      min-width: 0 !important;
      overflow: visible !important;
    }

    .idx-tax-label-year,
    .idx-tax-items-year {
      grid-row: 1 !important;
    }

    .idx-tax-label-discipline,
    .idx-tax-items-discipline {
      grid-row: 2 !important;
    }

    .idx-tax-label-industry,
    .idx-tax-items-industry {
      grid-row: 3 !important;
    }

    .idx-taxonomy-items {
      align-items: flex-start !important;
      overflow: visible !important;
    }

    .idx-tax-item {
      white-space: normal !important;
      overflow-wrap: break-word !important;
    }
  }

  @media (max-width: 809px) {
    .idx-container {
      --idx-grid-gap: 10px !important;
      padding: 0 20px !important;
    }

    .idx-taxonomy-shell {
      grid-template-columns: minmax(96px, 28%) minmax(0, 1fr) !important;
      column-gap: 18px !important;
      row-gap: 28px !important;
    }

    .idx-year-group {
      grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
      column-gap: var(--idx-grid-gap, 10px) !important;
      row-gap: 0 !important;
    }

    .idx-year-label {
      grid-column: 1 / span 1 !important;
      padding-top: 10px !important;
    }

    .idx-list-content {
      grid-column: 2 / span 5 !important;
    }

    .idx-list-row-grid {
      grid-template-columns: minmax(0, 1fr) max-content !important;
      align-items: center !important;
      column-gap: var(--idx-grid-gap, 10px) !important;
      row-gap: 0 !important;
      min-height: 45px !important;
      padding: 3px 0 !important;
    }

    .idx-list-title {
      grid-column: 1 / span 1 !important;
    }

    .idx-list-discipline,
    .idx-col-discipline {
      display: none !important;
    }

    .idx-list-industry {
      grid-column: 2 / span 1 !important;
      max-width: min(150px, 34vw) !important;
    }

    .idx-flip-text {
      --idx-flip-height: 20px !important;
      height: 20px !important;
      line-height: 20px !important;
      overflow: hidden !important;
    }

    .idx-flip-track {
      display: flex !important;
      flex-direction: column !important;
      gap: 5px !important;
      transform: translateY(0) !important;
      transition: transform 620ms cubic-bezier(0.16, 1, 0.3, 1) !important;
      will-change: transform !important;
    }

    .idx-flip-copy,
    .idx-flip-copy + .idx-flip-copy {
      display: block !important;
      flex: 0 0 var(--idx-flip-height) !important;
      height: var(--idx-flip-height) !important;
      line-height: var(--idx-flip-height) !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }
  }

  @media (max-width: 520px) {
    .idx-container {
      --idx-grid-gap: 8px !important;
      padding: 0 14px !important;
    }

    .idx-taxonomy-shell {
      grid-template-columns: minmax(84px, 32%) minmax(0, 1fr) !important;
      column-gap: 16px !important;
      row-gap: 26px !important;
      align-items: start !important;
    }

    .idx-tax-label-discipline,
    .idx-tax-label-industry,
    .idx-tax-label-year {
      grid-column: 1 / span 1 !important;
      margin-top: 0 !important;
      min-width: 0 !important;
    }

    .idx-tax-items-discipline,
    .idx-tax-items-industry,
    .idx-tax-items-year {
      grid-column: 2 / span 1 !important;
      min-width: 0 !important;
      overflow: visible !important;
    }

    .idx-tax-label-year,
    .idx-tax-items-year {
      grid-row: 1 !important;
    }

    .idx-tax-label-discipline,
    .idx-tax-items-discipline {
      grid-row: 2 !important;
    }

    .idx-tax-label-industry,
    .idx-tax-items-industry {
      grid-row: 3 !important;
    }

    .idx-tax-item {
      white-space: normal !important;
      overflow-wrap: break-word !important;
    }

    .idx-year-group {
      grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
      column-gap: var(--idx-grid-gap, 8px) !important;
    }

    .idx-year-label {
      grid-column: 1 / span 1 !important;
    }

    .idx-list-content {
      grid-column: 2 / span 5 !important;
    }

    .idx-list-row-grid {
      grid-template-columns: minmax(0, 1fr) max-content !important;
      column-gap: var(--idx-grid-gap, 8px) !important;
    }

    .idx-list-title {
      grid-column: 1 / span 1 !important;
    }

    .idx-list-discipline,
    .idx-list-industry {
      grid-column: auto !important;
    }

    .idx-list-industry {
      grid-column: 2 / span 1 !important;
      max-width: min(132px, 36vw) !important;
    }
  }
`,z(bt,{enabled:{type:L.Boolean,title:`Enabled`,defaultValue:!0,enabledTitle:`On`,disabledTitle:`Off`}})}));function Ct(){if(i===void 0)return null;let e=i;if(!e.__articaIndexProjectsRegistry){let t=new Map,n=new Set;e.__articaIndexProjectsRegistry={items:t,listeners:n,register(e,r){t.set(e,r),n.forEach(e=>e(t))},unregister(e){t.delete(e),n.forEach(e=>e(t))},subscribe(e){return n.add(e),e(t),()=>{n.delete(e)}}}}return e.__articaIndexProjectsRegistry??null}function Q(e){if(e)return typeof e==`string`?e:Array.isArray(e)?e.map(Q).find(Boolean):Q(e.src)||Q(e.url)||Q(e.href)||Q(e.file)||Q(e.value)}function wt(e){return e.slug&&typeof e.slug==`string`&&e.slug.trim()?`slug:${e.slug.trim()}`:e.title&&typeof e.title==`string`&&e.title.trim()?`title:${e.title.trim().toLowerCase()}`:`pr_${Math.random().toString(36).slice(2)}_${Date.now()}`}function Tt(e){let t=p(()=>wt(e),[e.slug,e.title]),n=p(()=>{let t=Q(e.thumbnail),n=Q(e.thumbnailVideoLink);return{title:e.title||``,category1:e.category1||``,category2:e.category2||``,category3:e.category3||``,industry:e.industry||``,year:e.year||``,thumbnail:t||void 0,thumbnailVideoLink:n||``,thumbnailStroke:!!e.thumbnailStroke,slug:e.slug||``,sortOrder:typeof e.sortOrder==`number`?e.sortOrder:void 0,isHomepage:!!e.isHomepage}},[e.title,e.category1,e.category2,e.category3,e.industry,e.year,e.thumbnail,e.thumbnailVideoLink,e.thumbnailStroke,e.slug,e.sortOrder,e.isHomepage]);if(f(()=>{let e=Ct();if(e)return e.register(t,n),()=>{e.unregister(t)}},[t,n]),le.current()!==le.canvas)return null;let r=e.title?String(e.title):`ProjectRegistrar`;return m(`div`,{"aria-hidden":`true`,style:{display:`inline-flex`,alignItems:`center`,gap:6,padding:`4px 8px`,width:`fit-content`,maxWidth:240,height:22,fontFamily:`'GT Standard Mono', 'GT Standard Mono Trial', 'SF Mono', 'Menlo', monospace`,fontSize:10,lineHeight:1,color:`rgba(20, 20, 20, 0.7)`,background:`rgba(20, 20, 20, 0.06)`,border:`1px dashed rgba(20, 20, 20, 0.35)`,borderRadius:3,whiteSpace:`nowrap`,overflow:`hidden`,textOverflow:`ellipsis`,pointerEvents:`none`,userSelect:`none`},children:[u(`span`,{style:{opacity:.6},children:`.`}),u(`span`,{style:{overflow:`hidden`,textOverflow:`ellipsis`},children:r})]})}var Et=e((()=>{r(),h(),D(),c(),z(Tt,{title:{type:L.String,title:`Title`},category1:{type:L.String,title:`Category 1`},category2:{type:L.String,title:`Category 2`},category3:{type:L.String,title:`Category 3`},industry:{type:L.String,title:`Industry`},year:{type:L.String,title:`Year`},thumbnail:{type:L.Image,title:`Thumbnail`},thumbnailVideoLink:{type:L.File,title:`Thumbnail Video`,allowedFileTypes:[`mp4`,`webm`,`mov`]},thumbnailStroke:{type:L.Boolean,title:`Thumbnail Stroke`},slug:{type:L.String,title:`Slug`},sortOrder:{type:L.Number,title:`Sorting Number`},isHomepage:{type:L.Boolean,title:`Is Homepage`}})})),Dt,Ot,kt,At,jt,Mt,Nt,Pt,Ft,It,Lt,Rt,zt,Bt,Vt,Ht,Ut,Wt,Gt,Kt,$,qt,Jt;e((()=>{h(),D(),x(),c(),ge(),ke(),yt(),St(),Et(),he(),ue(),ve(),Se(),Dt=w(Tt),Ot=j(ce),kt=w(ut),At=w(_e),jt=w(B),Mt=w(bt),Nt={aezamcJ1c:`(min-width: 1200px)`,G55AqW3_8:`(min-width: 810px) and (max-width: 1199.98px)`,SHlGJIu9v:`(max-width: 809.98px)`},Pt=[],Ft=`framer-5kqWi`,It={aezamcJ1c:`framer-v-1yp9f7e`,G55AqW3_8:`framer-v-8p6f3u`,SHlGJIu9v:`framer-v-8in89w`},Lt=(e,t,n)=>e&&t?`position`:n,Rt=e=>typeof e==`object`&&e&&typeof e.src==`string`?e:typeof e==`string`?{src:e}:void 0,zt=e=>typeof e==`object`&&e&&typeof e.src==`string`?e.src:typeof e==`string`?e:void 0,Bt=()=>({from:{alias:`AwTGGhR7I`,data:me,type:`Collection`},limit:{type:`LiteralValue`,value:15},select:[{collection:`AwTGGhR7I`,name:`pdXVG_fBO`,type:`Identifier`},{collection:`AwTGGhR7I`,name:`Jy7hBJady`,type:`Identifier`},{collection:`AwTGGhR7I`,name:`oeXZcmPna`,type:`Identifier`},{collection:`AwTGGhR7I`,name:`kuvJcmOFr`,type:`Identifier`},{collection:`AwTGGhR7I`,name:`VV1CggU2J`,type:`Identifier`},{collection:`AwTGGhR7I`,name:`E6OpH0hSs`,type:`Identifier`},{collection:`AwTGGhR7I`,name:`mBIilFqVM`,type:`Identifier`},{collection:`AwTGGhR7I`,name:`QZqSK_3OF`,type:`Identifier`},{collection:`AwTGGhR7I`,name:`DLBifmgp1`,type:`Identifier`},{collection:`AwTGGhR7I`,name:`myUIfK0j7`,type:`Identifier`},{collection:`AwTGGhR7I`,name:`id`,type:`Identifier`}]}),Vt=({query:e,pageSize:t,children:n})=>n(te(e)),Ht={opacity:1,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,transformPerspective:1200,transition:{delay:.1,duration:1.5,ease:[.16,1,.3,1],type:`tween`},x:0,y:0},Ut={opacity:1,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,transformPerspective:1200,x:0,y:90},Wt={Desktop:`aezamcJ1c`,Phone:`SHlGJIu9v`,Tablet:`G55AqW3_8`},Gt=({value:e})=>R()?null:u(`style`,{dangerouslySetInnerHTML:{__html:e},"data-framer-html-style":``}),Kt=({height:e,id:t,width:n,...r})=>({...r,variant:Wt[r.variant]??r.variant??`aezamcJ1c`}),$=N(d(function(e,t){let r=n(null),i=t??r,o=l(),{activeLocale:c,setLocale:d}=I();ie();let{style:f,className:h,layoutId:_,variant:x,...S}=Kt(e);se(p(()=>Ce({},c),[c]));let[w,T]=ee(x,Nt,!1),D=C(Ft,xe,pe),O=s(M)?.isLayoutTemplate,j=Lt(O,!!s(y)?.transition?.layout);return F({}),u(M.Provider,{value:{activeVariantId:w,humanReadableVariantMap:Wt,primaryVariantId:`aezamcJ1c`,variantClassNames:It},children:m(b,{id:_??o,children:[u(Gt,{value:`html body { background: var(--token-faf217ee-812d-4474-8131-b934f8e4dc1f, rgb(246, 243, 236)); }`}),m(v.div,{...S,className:C(D,`framer-1yp9f7e`,h),ref:i,style:{...f},children:[u(v.div,{className:`framer-unwxb4`,"data-framer-name":`CMS Link`,layout:j,children:u(re,{children:u(Vt,{query:Bt(),children:(e,t,n)=>u(g,{children:e?.map(({DLBifmgp1:e,E6OpH0hSs:t,id:n,Jy7hBJady:r,kuvJcmOFr:i,mBIilFqVM:o,myUIfK0j7:s,oeXZcmPna:c,pdXVG_fBO:l,QZqSK_3OF:d,VV1CggU2J:f},p)=>(l??=``,c??=``,i??=``,f??=``,t??=``,o??=``,d??=``,e??=0,s??=!0,u(b,{id:`AwTGGhR7I-${n}`,children:u(ne.Provider,{value:{pdXVG_fBO:l},children:u(ae,{href:{pathVariables:{pdXVG_fBO:l},webPageId:`UlQco8cYi`},motionChild:!0,nodeId:`XLQXxoBPL`,scopeId:`u2LOaBT5q`,children:m(v.a,{className:`framer-wqb5zs framer-11aflm3`,children:[u(oe,{background:{alt:``,fit:`fill`,loading:E(1525.5),pixelHeight:900,pixelWidth:1600,sizes:`30px`,...Rt(r)},className:`framer-1am7lwi`}),u(ce,{__fromCanvasComponent:!0,children:u(a,{children:u(`p`,{className:`framer-styles-preset-1dmv8xw`,"data-styles-preset":`ZB3A5PLtS`,dir:`auto`,children:`Title`})}),className:`framer-begyn5`,"data-framer-name":`Title`,fonts:[`Inter`],text:c,verticalAlignment:`top`,withExternalLayout:!0}),u(P,{children:u(A,{className:`framer-l2x7iy-container`,isAuthoredByUser:!0,nodeId:`I063adJ_h`,scopeId:`u2LOaBT5q`,children:u(Tt,{category1:i,category2:f,category3:t,height:`100%`,id:`I063adJ_h`,industry:o,isHomepage:s,layoutId:`I063adJ_h`,slug:l,sortOrder:e,thumbnail:zt(r),thumbnailStroke:!0,title:c,width:`100%`,year:d})})})]})})})},n)))})})})}),u(v.section,{className:`framer-loe8yt`,"data-framer-name":`Section Hero`,layout:j,children:u(`div`,{className:`framer-8f5wsi`,children:u(`div`,{className:`framer-krk5s5`,"data-framer-name":`Heading Row Wrapper`,children:u(k,{breakpoint:w,overrides:{SHlGJIu9v:{children:u(a,{children:u(`h1`,{dir:`auto`,style:{"--font-selector":`Q1VTVE9NVjI7R1QgU3RhbmRhcmQgVHJpYWwgTCBCZA==`,"--framer-font-family":`"GT Standard Trial L Bd", "GT Standard Trial L Bd Placeholder", sans-serif`,"--framer-font-size":`72px`,"--framer-font-weight":`700`,"--framer-letter-spacing":`-0.01em`,"--framer-line-height":`114%`,"--framer-text-color":`var(--token-0e64c98e-2e3d-4034-8a86-e95f1a065f27, rgb(35, 51, 36))`,"--framer-text-transform":`capitalize`},children:`Index`})}),fonts:[`CUSTOMV2;GT Standard Trial L Bd`]}},children:u(Ot,{__fromCanvasComponent:!0,animate:Ht,children:u(a,{children:u(`h1`,{className:`framer-styles-preset-zw7hg5`,"data-styles-preset":`cxLS4itsr`,dir:`auto`,style:{"--framer-text-color":`var(--token-0e64c98e-2e3d-4034-8a86-e95f1a065f27, rgb(35, 51, 36))`},children:`Index`})}),className:`framer-1nuoem9`,"data-framer-appear-id":`1nuoem9`,"data-framer-name":`Index`,fonts:[`Inter`],initial:Ut,optimized:!0,style:{transformPerspective:1200},verticalAlignment:`top`,withExternalLayout:!0})})})})}),u(P,{children:u(A,{className:`framer-f4p2a3-container`,isAuthoredByUser:!0,layout:j,nodeId:`DPNhA5Hve`,scopeId:`u2LOaBT5q`,children:u(ut,{bg:`rgb(247, 245, 240)`,cmsModuleUrl:``,defaultView:`list`,dividerStrong:`rgb(20, 20, 20)`,dividerSubtle:`rgb(20, 20, 20)`,height:`100%`,id:`DPNhA5Hve`,layoutId:`DPNhA5Hve`,listHoverVariant:`flip`,listTypographyVariant:`standard`,projects:[],style:{width:`100%`},surfaceActive:`rgb(234, 232, 227)`,textPrimary:`rgb(20, 20, 20)`,textSecondary:`rgb(20, 20, 20)`,textTertiary:`rgb(151, 151, 151)`,thumbnailVideoFieldIds:`SvOqFqdby,WG62tRjG8`,useCMS:!0,width:`100%`})})}),u(P,{children:u(A,{className:`framer-h9tnr8-container`,"data-code-component-plugin-id":`mcp001`,isAuthoredByUser:!0,layout:j,layoutScroll:!0,nodeId:`szF9sZNWA`,scopeId:`u2LOaBT5q`,children:u(_e,{applyHoverZoomToIndexGrid:!0,collectionId:`yTHrQWMIY`,collectionModuleUrl:``,enableHoverZoom:!0,height:`100%`,hoverImageScale:1.02,id:`szF9sZNWA`,imageWrapperNames:`ImageWrapper
Image Wrapper
VideoWrapper
Video Wrapper`,layoutId:`szF9sZNWA`,slugFieldId:`pdXVG_fBO`,strokeColor:`rgb(151, 151, 151)`,strokeFieldId:`OHdUYs6Mo`,strokeWidth:1,style:{height:`100%`,width:`100%`},syncThumbnailVideos:!0,thumbnailFieldId:`Jy7hBJady`,titleFieldId:`oeXZcmPna`,videoFieldId:`SvOqFqdby`,width:`100%`})})}),u(P,{children:u(A,{className:`framer-1u8dhv0-container`,"data-code-component-plugin-id":`mcp001`,isAuthoredByUser:!0,layout:j,layoutScroll:!0,nodeId:`JvCNoMs41`,scopeId:`u2LOaBT5q`,children:u(B,{enabled:!0,height:`100%`,hoverScale:1.02,id:`JvCNoMs41`,layoutId:`JvCNoMs41`,style:{height:`100%`,width:`100%`},width:`100%`})})}),u(P,{children:u(A,{className:`framer-16jj81o-container`,"data-code-component-plugin-id":`mcp001`,isAuthoredByUser:!0,layout:j,nodeId:`ATfvwee86`,scopeId:`u2LOaBT5q`,children:u(bt,{enabled:!0,height:`100%`,id:`ATfvwee86`,layoutId:`ATfvwee86`,style:{height:`100%`,width:`100%`},width:`100%`})})})]}),u(`div`,{id:`overlay`})]})})}),[`@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }`,`.framer-5kqWi.framer-11aflm3, .framer-5kqWi .framer-11aflm3 { display: block; }`,`.framer-5kqWi.framer-1yp9f7e { align-content: center; align-items: center; background-color: var(--token-faf217ee-812d-4474-8131-b934f8e4dc1f, #f6f3ec); display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: visible; padding: 0px; position: relative; width: 1200px; }`,`.framer-5kqWi .framer-unwxb4 { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 20px; height: 1px; justify-content: center; left: -202px; opacity: 0; overflow: hidden; padding: 0px; position: fixed; top: 0px; width: 1px; }`,`.framer-5kqWi .framer-wqb5zs { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: flex-start; padding: 0px; position: relative; text-decoration: none; width: min-content; }`,`.framer-5kqWi .framer-1am7lwi { border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; border-top-left-radius: 8px; border-top-right-radius: 8px; flex: none; height: 30px; position: relative; width: 30px; }`,`.framer-5kqWi .framer-begyn5 { flex: none; height: auto; position: relative; white-space: pre; width: auto; }`,`.framer-5kqWi .framer-l2x7iy-container { flex: none; height: auto; position: relative; width: auto; }`,`.framer-5kqWi .framer-loe8yt { align-content: center; align-items: center; background-color: var(--token-faf217ee-812d-4474-8131-b934f8e4dc1f, #f6f3ec); display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 1px; height: 47.75vh; justify-content: flex-start; overflow: hidden; padding: 150px 20px 0px 20px; position: relative; width: 100%; z-index: 3; }`,`.framer-5kqWi .framer-8f5wsi { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 15px; height: min-content; justify-content: center; overflow: var(--overflow-clip-fallback, clip); padding: 0px; position: relative; width: 100%; }`,`.framer-5kqWi .framer-krk5s5 { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 113px; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 100%; }`,`.framer-5kqWi .framer-1nuoem9 { flex: none; height: auto; position: relative; white-space: pre; width: auto; will-change: var(--framer-will-change-effect-override, transform); }`,`.framer-5kqWi .framer-f4p2a3-container { flex: none; height: auto; position: relative; width: 100%; }`,`.framer-5kqWi .framer-h9tnr8-container, .framer-5kqWi .framer-1u8dhv0-container { flex: none; height: 1px; left: -202px; opacity: 0; position: fixed; top: 0px; width: 1px; }`,`.framer-5kqWi .framer-16jj81o-container { flex: none; height: 1px; left: -202px; opacity: 0; position: absolute; top: 0px; width: 1px; }`,...ye,...de,`@media (min-width: 810px) and (max-width: 1199.98px) { .framer-5kqWi.framer-1yp9f7e { width: 810px; } .framer-5kqWi .framer-loe8yt { height: 35vh; }}`,`@media (max-width: 809.98px) { .framer-5kqWi.framer-1yp9f7e { width: 390px; } .framer-5kqWi .framer-loe8yt { height: 44vh; }}`],`framer-5kqWi`),qt=$,$.displayName=`Page`,$.defaultProps={height:1587,width:1200},S($,[{explicitInter:!0,fonts:[{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F`,url:`https://framerusercontent.com/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116`,url:`https://framerusercontent.com/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+1F00-1FFF`,url:`https://framerusercontent.com/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0370-03FF`,url:`https://framerusercontent.com/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF`,url:`https://framerusercontent.com/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD`,url:`https://framerusercontent.com/assets/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB`,url:`https://framerusercontent.com/assets/b6Y37FthZeALduNqHicBT6FutY.woff2`,weight:`400`},{cssFamilyName:`GT Standard Trial L Bd`,source:`custom`,style:`normal`,uiFamilyName:`GT Standard Trial`,url:`https://framerusercontent.com/assets/crhfNLaqXfVV61Bkd6ep2NhowE.woff2`,weight:`700`}]},...Dt,...kt,...At,...jt,...Mt,...T(be),...T(fe)],{supportsExplicitInterCodegen:!0}),$.loader={load:(e,t)=>{let n=t.locale,r=O.get(Bt(),n);return Promise.allSettled([r.preload()])}},Jt={exports:{Props:{type:`tsType`,annotations:{framerContractVersion:`1`}},queryParamNames:{type:`variable`,annotations:{framerContractVersion:`1`}},default:{type:`reactComponent`,name:`Frameru2LOaBT5q`,slots:[],annotations:{framerIntrinsicHeight:`1587`,framerScrollSections:`false`,framerColorSyntax:`true`,framerComponentViewportWidth:`true`,framerAcceptsLayoutTemplate:`true`,framerDisplayContentsDiv:`false`,framerAutoSizeImages:`true`,framerLayoutTemplateFlowEffect:`true`,framerResponsiveScreen:`true`,framerIntrinsicWidth:`1200`,framerCanvasComponentVariantDetails:`{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"G55AqW3_8":{"layout":["fixed","auto"]},"SHlGJIu9v":{"layout":["fixed","auto"]}}}`,framerContractVersion:`1`,framerImmutableVariables:`true`}},__FramerMetadata__:{type:`variable`}}}}))();export{Jt as __FramerMetadata__,qt as default,Pt as queryParamNames};
//# sourceMappingURL=Wo-8tbkLUWHBf9MBTW-JZyOhnjTbdBG6Af_0LB32EEw.CUdcWOCm.mjs.map