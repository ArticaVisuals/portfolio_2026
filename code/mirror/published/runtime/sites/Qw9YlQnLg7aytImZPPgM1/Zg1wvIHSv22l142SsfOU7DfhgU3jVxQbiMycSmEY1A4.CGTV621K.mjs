import{t as e}from"./rolldown-runtime.Dh6celcD.mjs";import{A as t,E as n,F as r,L as i,M as a,N as o,O as s,S as c,_ as l,c as u,h as d,j as f,k as p,l as m,o as h,s as g,y as _}from"./react.BpKPsBQp.mjs";import{a as v,r as y,t as ee,x as b}from"./motion.BXeQGXz9.mjs";import{C as x,E as te,F as S,H as ne,I as re,J as ie,P as ae,S as oe,a as C,at as se,b as w,bt as T,c as ce,ct as E,dt as D,f as le,ft as ue,g as de,gt as O,h as fe,i as k,n as A,o as j,ot as pe,rt as M,u as me,ut as he,v as N}from"./framer.Dxmm4ztR.mjs";import{n as ge,t as _e}from"./PageTransition.B5XQ0_ih.mjs";import{i as ve,n as ye,r as be,t as xe}from"./cxLS4itsr.DrbdE3-m.mjs";import{i as Se,n as P,r as F,t as I}from"./ZB3A5PLtS.C4Yco8En.mjs";import{n as Ce,t as we}from"./yTHrQWMIY.BSv3m1Wm.mjs";import Te,{t as Ee}from"./c28OF-MNdEOXSHPW0Z6LZwdzMMQA-yv74jqBELWOYc0.BQmKExNI.mjs";function De(e){let t=e.target;t instanceof Element&&t.closest(`[${Kt}="true"]`)&&(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation())}function Oe(){if(typeof document>`u`)return 0;let e=0;return document.querySelectorAll(Ut).forEach(t=>{t.setAttribute(`aria-hidden`,`true`),t.querySelectorAll(Gt).forEach(e=>{e instanceof HTMLVideoElement?(e.hasAttribute(`src`)||e.hasAttribute(`poster`)||e.querySelector(`source[src]`))&&(e.pause(),e.setAttribute(`preload`,`none`),e.removeAttribute(`src`),e.removeAttribute(`poster`),e.querySelectorAll(`source`).forEach(e=>e.removeAttribute(`src`)),e.load()):(e.removeAttribute(`src`),e.removeAttribute(`srcset`)),e.setAttribute(qt,`true`)}),t.querySelectorAll(Wt).forEach(t=>{t.getAttribute(Kt)!==`true`&&t.addEventListener(`click`,De,!0),t.setAttribute(`tabindex`,`-1`),t.setAttribute(`aria-hidden`,`true`),t.setAttribute(Kt,`true`),e+=1})}),e}function ke(e){f(()=>{if(!e||i===void 0)return;let t=0,n=[],r=()=>{i.cancelAnimationFrame(t),t=i.requestAnimationFrame(Oe)};r(),[100,350,900,1800,3200].forEach(e=>{n.push(i.setTimeout(r,e))});let a=new MutationObserver(r);return a.observe(document.body,{attributes:!0,attributeFilter:[`href`,`role`,`tabindex`,`data-framer-name`,`name`,`poster`,`preload`,`src`,`srcset`],childList:!0,subtree:!0}),()=>{i.cancelAnimationFrame(t),n.forEach(e=>i.clearTimeout(e)),a.disconnect()}},[e])}function Ae(e){let t=new Set,n=[];for(let r of[e.category1,e.category2,e.category3]){if(typeof r!=`string`)continue;let e=r.trim();!e||t.has(e)||(t.add(e),n.push(e))}return n}function je(e){let[t=``,n=``,r=``]=Ae(e);return e.category1===t&&(e.category2??``)===n&&(e.category3??``)===r?e:{...e,category1:t,category2:n,category3:r}}function Me(e){return Ae(e).join(`, `)}function Ne(e){return[...e].sort((e,t)=>(e.sortOrder??2**53-1)-(t.sortOrder??2**53-1)||e.title.localeCompare(t.title))}function Pe(e){let t=[],n=[],r=new Set,i=new Set;for(let a of Ne(e)){for(let e of Ae(a)){let n=e.trim();!n||r.has(n)||(r.add(n),t.push(n))}let e=String(a.industry??``).trim();e&&!i.has(e)&&(i.add(e),n.push(e))}return{disciplines:Ie(t),industries:Ie(n),years:Fe(e)}}function Fe(e){let t=new Set;for(let n of e){let e=L(n.year);e>0&&t.add(e)}return Array.from(t).sort((e,t)=>t-e)}function Ie(e){return[...e].sort((e,t)=>e.localeCompare(t,void 0,{numeric:!0,sensitivity:`base`}))}function Le(e){return e.slug?`/case-studies/${e.slug}`:``}function Re(e){return He(e.thumbnailVideoLink)}function ze(e){let t=e.split(/[?#]/)[0]?.toLowerCase()||``;return/\.(gif|webp|apng)$/.test(t)}function L(e){if(e==null)return 0;if(typeof e==`number`)return Number.isFinite(e)&&e>1900?Math.floor(e):0;if(typeof e==`object`){if(e instanceof Date){let t=e.getFullYear();return Number.isFinite(t)&&t>1900?t:0}let t=e;return`value`in t?L(t.value):`year`in t?L(t.year):0}let t=String(e).trim();if(!t)return 0;let n=Number(t);if(Number.isFinite(n)&&n>1900)return Math.floor(n);let r=t.match(/(?:19|20)\d{2}/);return r?Number(r[0]):0}function Be(e){if(e){if(typeof e==`string`)return e||void 0;if(typeof e==`object`){let t=e;if(typeof t.src==`string`)return t.src||void 0;if(typeof t.url==`string`)return t.url||void 0}}}function Ve(e){if(!e)return``;if(typeof e==`string`)return e.trim();if(Array.isArray(e))return e.map(Ve).find(Boolean)||``;if(typeof e==`object`){let t=e;if(`value`in t)return Ve(t.value);for(let e of[`src`,`url`,`href`,`file`]){let n=Ve(t[e]);if(n)return n}}return``}function He(e){return Ve(e)}function Ue(e){return Ve(e)||Be(e)||``}function We(e){return String(e||``).split(/[\n,]/).map(e=>e.trim()).filter(Boolean)}function Ge(e,t){for(let n of We(t)){let t=He(R(e,n));if(t)return t}return``}function Ke(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}function qe(e){return Array.from(new Set(e.filter(Boolean)))}function R(e,t){let n=e?.[t];return n&&typeof n==`object`&&`value`in n?n.value:n}function z(e){return String(e??``).trim()}function Je(e){let t=typeof e==`number`?e:Number(e);return Number.isFinite(t)?t:void 0}function Ye(e){if(e&&typeof e==`object`&&`value`in e)return Ye(e.value);if(typeof e==`boolean`)return e;if(typeof e==`number`)return e!==0;if(typeof e==`string`){let t=e.trim().toLowerCase();return!(!t||t===`false`||t===`0`)}return!!e}function Xe(e,t){let n=Ke(t);return RegExp(`/${n}(?:\\.[^/?#]+)?\\.(?:js|mjs)(?:[?#].*)?$`).test(e)}function Ze(e,t){let n=Ke(t);return e.match(RegExp(`https://framerusercontent\\.com/(?:sites|modules)/[^"']+/${n}(?:\\.[^"'/]+)?\\.(?:js|mjs)`,`i`))?.[0]}function Qe(){if(typeof document>`u`)return[];let e=Array.from(document.querySelectorAll(`link[href], script[src], img[src], source[src]`)).map(e=>`href`in e&&e.href?e.href:`src`in e&&e.src?e.src:``),t=typeof performance<`u`&&typeof performance.getEntriesByType==`function`?performance.getEntriesByType(`resource`).map(e=>e.name):[];return qe([...e,...t])}function $e(e){let t=Qe().find(t=>Xe(t,e));if(t)return t;if(typeof document<`u`&&document.documentElement)return Ze(document.documentElement.outerHTML,e)}function et(){return i===void 0||!i.location?``:i.location.pathname||``}async function tt(e,t){for(let n of e)if(n)try{let e=await fetch(n,{credentials:`same-origin`,cache:`no-store`});if(!e.ok)continue;let r=Ze(await e.text(),t);if(r)return r}catch{}}async function nt(e,t){let n=z(t);if(n)return n;let r=cn.get(e);if(r)return r;let i=await tt(qe([et(),...on]),e);if(i)return cn.set(e,i),i;let a=$e(e);if(a)return cn.set(e,a),a}function rt(e){[e.t,e.r,e.default,...Object.values(e)].forEach(e=>{try{typeof e==`function`&&e()}catch{}})}function it(e){let t=e?.collectionByLocaleId?.default;return!!t&&typeof t.scanItems==`function`}function at(e){let t=[e.a,e.r,e.default,...Object.values(e)];for(let e of t){let t=e;if(typeof t==`function`)try{t=t()}catch{t=void 0}if(it(t))return t.collectionByLocaleId?.default}}function ot(e,t){let n=e.data,r=an,i=z(R(n,r.title));return i?{title:i,slug:z(R(n,r.slug))||z(e.slug),sortOrder:Je(R(n,r.sortOrder)),category1:z(R(n,r.category1)),category2:z(R(n,r.category2)),category3:z(R(n,r.category3)),industry:z(R(n,r.industry)),year:z(R(n,r.year)),thumbnail:Ue(R(n,r.thumbnail)),thumbnailVideoLink:Ge(n,t),thumbnailStroke:Ye(R(n,r.thumbnailStroke)),isHomepage:!!R(n,r.isHomepage)}:null}async function st(e,t=sn){let n=await nt(rn,e);if(!n)return[];let r=await import(n);rt(r);let i=at(r);return typeof i?.scanItems==`function`?(await i.scanItems()).map(e=>ot(e,t)).filter(e=>!!e):[]}function ct(e){let t=new Map;for(let n of e){let e=L(n.year),r=t.get(e);r?r.push(n):t.set(e,[n])}return Array.from(t.entries()).sort(([e],[t])=>e===0?1:t===0?-1:t-e).map(([e,t])=>({year:e,items:[...t].sort((e,t)=>e.title.localeCompare(t.title))}))}function lt(e,t,n){let r=n.trim().toLowerCase(),i=t.disciplines.length>0,a=t.industries.length>0,o=t.years.length>0;if(!i&&!a&&!o&&!r)return e;let s=i?new Set(t.disciplines):null,c=a?new Set(t.industries):null,l=o?new Set(t.years):null;return e.filter(e=>{let n=Ae(e),i=!s||t.disciplines.every(e=>n.includes(e)),a=!c||c.has(e.industry),o=!l||l.has(L(e.year)),u=!r||e.title.toLowerCase().includes(r);return i&&a&&o&&u})}function ut(e,t){return e.includes(t)?e.filter(e=>e!==t):[...e,t]}function dt(e){return String(e??``).trim().toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``)}function ft(){try{if(i===void 0)return null;let e=String(i.location.hash||``).replace(/^#/,``),t=e.includes(`=`)?e:String(i.location.search||``).replace(/^\?/,``);return t?new URLSearchParams(t):null}catch{return null}}function pt(){try{let e=ft();if(!e)return null;let t=t=>String(e.get(t)??``).split(`,`).map(e=>e.trim()).filter(Boolean),n={disciplines:t(X.disciplines),industries:t(X.industries),years:t(X.years)};return n.disciplines.length===0&&n.industries.length===0&&n.years.length===0?null:n}catch{return null}}function mt(e,t){let n=new Map;for(let e of t){let t=dt(e);t&&!n.has(t)&&n.set(t,e)}let r=[];for(let t of e){let e=n.get(dt(t));e&&!r.includes(e)&&r.push(e)}return r}function ht(e,t){let n=new Set(t),r=[];for(let t of e){let e=Number.parseInt(String(t).trim(),10);Number.isFinite(e)&&(!n.has(e)||r.includes(e)||r.push(e))}return r}function gt(e){let t=[],n=(e,n)=>{n.length!==0&&t.push(`${e}=${n.join(`,`)}`)};return n(X.disciplines,e.disciplines.map(dt).filter(Boolean)),n(X.industries,e.industries.map(dt).filter(Boolean)),n(X.years,e.years.map(e=>String(e)).filter(Boolean)),t.join(`&`)}function _t(e){try{if(i===void 0||typeof i.history?.replaceState!=`function`)return;let t=gt(e),n=`${i.location.pathname}${t?`?${t}`:``}`;if(n===`${i.location.pathname}${i.location.search}`&&!i.location.hash)return;i.history.replaceState(i.history.state,``,n)}catch{}}function vt(){try{return N.current()!==N.canvas}catch{return!0}}function yt(){if(i===void 0)return!0;try{return N.current()!==N.canvas}catch{return!0}}function bt(){return i===void 0?!1:i.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1}function xt(){try{return typeof document<`u`&&document.documentElement.matches(`:active-view-transition`)}catch{return!1}}function St(e){return Math.max(0,Math.min(e,U.maxStaggerIndex))}function Ct(e){return K.baseDelayMs+St(e)*K.staggerMs}function wt(e){return St(e)*U.staggerMs}function Tt(e,t=0){let n=Math.max(0,Math.min(e,W.maxRowIndex)),r=Math.max(0,t);return W.baseDelayMs+n*W.rowStaggerMs+r*W.columnStaggerMs}function Et(e,t=0){let n=Math.max(0,Math.min(e,$t.maxRowIndex)),r=Math.max(0,t);return $t.baseDelayMs+n*$t.rowStaggerMs+r*$t.columnStaggerMs}function Dt(e){return G.baseDelayMs+Math.max(0,Math.min(e,G.maxItemIndex))*G.itemStaggerMs}function Ot(){let e=n(null),[t,r]=o(!1);return f(()=>{let t=e.current;if(!t||i===void 0)return;if(bt()||!(`IntersectionObserver`in i)){r(!0);return}let n=0,a=0,o=0,s=0,c=!1,l=!1,u=!0,d=null,f=()=>{let e=t.getBoundingClientRect(),n=i.innerHeight||document.documentElement.clientHeight;return e.bottom>=0&&e.top<=n},p=()=>{c||(c=!0,l=!1,i.clearTimeout(o),i.cancelAnimationFrame(n),i.cancelAnimationFrame(a),d?.disconnect(),r(!1),n=i.requestAnimationFrame(()=>{a=i.requestAnimationFrame(()=>{r(!0)})}))},m=e=>{if(c)return;if(l){u&&=e;return}l=!0,u=e;let t=()=>{if(c)return;if(xt()){o=i.setTimeout(t,50);return}let e=u;l=!1,(!e||f())&&p()};o=i.setTimeout(t,50)},h=()=>{if(!(c||!f())){if(xt()){m(!0);return}d?.disconnect(),p()}},g=()=>{c||(i.clearTimeout(s),d?.disconnect(),p())};d=new IntersectionObserver(e=>{e.some(e=>e.isIntersecting)&&h()},{rootMargin:U.rootMargin,threshold:U.threshold}),d.observe(t),i.addEventListener(`pt:reveal`,g),s=i.setTimeout(()=>{if(!c){if(d?.disconnect(),xt()){m(!1);return}p()}},220);let _=Number(i.__ptRevealedAt||0);return String(i.__ptRevealedPath||``)===i.location.pathname&&_>0&&Date.now()-_<2e3&&g(),()=>{i.clearTimeout(o),i.clearTimeout(s),i.cancelAnimationFrame(n),i.cancelAnimationFrame(a),d?.disconnect(),i.removeEventListener(`pt:reveal`,g)}},[]),{ref:e,appeared:t}}function kt(){return`
  ${Ut} {
    position: fixed !important;
    left: -10000px !important;
    top: 0 !important;
    width: 1px !important;
    height: 1px !important;
    max-width: 1px !important;
    max-height: 1px !important;
    opacity: 0 !important;
    overflow: hidden !important;
    pointer-events: none !important;
    visibility: hidden !important;
    clip-path: inset(50%) !important;
  }

  ${Ut} * {
    pointer-events: none !important;
  }

  .idx-fade-appear {
    display: inline-block;
    max-width: 100%;
    opacity: 0;
    will-change: opacity;
  }

  .idx-fade-appear-block {
    display: block;
    width: 100%;
  }

  .idx-fade-appear[data-idx-appeared="true"] {
    opacity: 1;
  }

  .idx-mask-appear {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    vertical-align: top;
    line-height: inherit;
  }

  .idx-mask-appear-block {
    display: block;
    width: 100%;
  }

  .idx-mask-reveal-text {
    display: inline-block;
    max-width: 100%;
    transform: translate3d(0, var(--idx-mask-distance, ${K.distancePx}px), 0);
    will-change: transform;
    line-height: inherit;
    color: inherit;
    -webkit-text-fill-color: inherit;
    text-decoration: inherit;
    text-underline-offset: inherit;
    text-transform: inherit;
  }

  .idx-mask-appear-block > .idx-mask-reveal-text {
    display: block;
    width: 100%;
  }

  .idx-mask-appear[data-idx-appeared="true"] > .idx-mask-reveal-text {
    transform: translate3d(0, 0, 0);
  }

  .idx-rule {
    transform: scaleX(0);
    transform-origin: left center;
    will-change: transform;
  }

  .idx-rule[data-idx-appeared="true"] {
    transform: scaleX(1);
  }

  .idx-tax-item {
    cursor: pointer;
    transition: opacity 150ms ${H};
    user-select: none;
  }
  .idx-tax-item:hover { opacity: 0.55; }
  .idx-tax-item:focus-visible {
    outline: 1px solid ${J.textPrimary};
    outline-offset: 3px;
  }

  .idx-tax-item[aria-pressed="true"] .idx-mask-reveal-text,
  .idx-tax-item[aria-pressed="true"] .idx-fade-appear,
  .idx-clear-filters .idx-mask-reveal-text,
  .idx-clear-filters .idx-fade-appear,
  .idx-view-toggle-option[data-active="true"] .idx-mask-reveal-text,
  .idx-view-toggle-option[data-active="true"] .idx-fade-appear {
    text-decoration: underline;
    text-underline-offset: 3px;
  }


  .idx-list-row {
    transition: background 150ms ${H};
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
    background-color: ${J.dividerSubtle} !important;
    border-color: ${J.dividerSubtle} !important;
    opacity: 1 !important;
  }

  .idx-view-toggle {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    gap: 8px;
    width: 100%;
    margin: -46px 0 24px;
    font-family: ${J.fontMono};
    font-size: 13px;
    font-weight: 400;
    line-height: 28px;
    text-transform: uppercase;
    letter-spacing: 0;
    color: ${J.textPrimary} !important;
    -webkit-text-fill-color: ${J.textPrimary} !important;
    opacity: 1 !important;
  }

  .idx-taxonomy-shell + .idx-tax-item {
    display: block;
    margin-top: 12px !important;
    line-height: 28px !important;
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
    color: ${J.textPrimary} !important;
    -webkit-text-fill-color: ${J.textPrimary} !important;
    cursor: pointer;
    text-decoration: none;
    text-underline-offset: 3px;
    transition:
      color 150ms ${H},
      -webkit-text-fill-color 150ms ${H};
  }

  .idx-view-toggle-option[data-active="true"] {
    text-decoration: underline;
    color: ${J.textPrimary} !important;
    -webkit-text-fill-color: ${J.textPrimary} !important;
    opacity: 1 !important;
  }

  .idx-view-toggle-option:hover {
    color: ${J.textTertiary} !important;
    -webkit-text-fill-color: ${J.textTertiary} !important;
    opacity: 1;
  }

  .idx-view-toggle-option:focus-visible {
    outline: 1px solid ${J.textPrimary};
    outline-offset: 3px;
  }

  .idx-view-toggle-divider {
    font: inherit;
    line-height: inherit;
    color: ${J.textPrimary} !important;
    -webkit-text-fill-color: ${J.textPrimary} !important;
    opacity: 1 !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .idx-fade-appear,
    .idx-fade-appear[data-idx-appeared="true"],
    .idx-mask-appear,
    .idx-mask-appear[data-idx-appeared="true"],
	    .idx-mask-reveal-text,
	    .idx-row,
	    .idx-grid-card,
	    .idx-grid-card-media,
	    .idx-rule {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
      will-change: auto !important;
    }
    .idx-flip-track {
      transition: none !important;
      transform: none !important;
    }
    .idx-grid-title-stack {
      transition: none !important;
      transform: none !important;
    }
    .idx-grid-card-img,
    .idx-grid-card-video,
    .idx-grid-card-media > img,
    .idx-grid-card-media > video {
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
  .idx-project-grid[data-grid-layout="figma"] {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    justify-content: stretch;
    max-width: none;
    row-gap: 52px;
  }
  .idx-grid-card {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    text-decoration: none;
    color: inherit;
  }
  .idx-grid-card-link {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }
  .idx-grid-card[data-grid-layout="figma"],
  .idx-grid-card[data-grid-layout="figma"] .idx-grid-card-link {
    gap: 14px;
  }
  .idx-grid-card-link:focus-visible {
    outline: 1px solid ${J.textPrimary};
    outline-offset: 4px;
  }
  .idx-grid-card-heading {
    align-items: start;
    color: ${J.textPrimary};
    display: grid;
    font-family: ${J.fontMono};
    font-size: 13px;
    font-weight: 400;
    grid-template-columns: 24px 11px minmax(0, 1fr);
    letter-spacing: 0;
    line-height: 100%;
    min-height: 13px;
    overflow: hidden;
    text-transform: uppercase;
    white-space: nowrap;
    width: 100%;
  }
  .idx-grid-card-order {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .idx-grid-title-frame {
    display: block;
    height: 13px;
    min-width: 0;
    overflow: hidden;
  }
  .idx-grid-title-stack {
    display: flex;
    flex-direction: column;
    gap: 5px;
    transform: translateY(0);
    transition: transform 420ms ${V};
    will-change: transform;
  }
  .idx-grid-title-stack > span {
    display: block;
    height: 13px;
    line-height: 100%;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    background: ${J.surfaceActive};
    opacity: 0;
    will-change: opacity;
  }
  .idx-grid-card-media[data-idx-media-appeared="true"] {
    opacity: 1;
  }
  .idx-grid-card-media[data-thumbnail-stroke="true"]::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 3;
    box-sizing: border-box;
    border: 1px solid ${J.textTertiary};
    border-radius: inherit;
    pointer-events: none;
    background: transparent;
  }
  .idx-grid-card-meta {
    margin-top: -2px;
    font-family: ${J.fontMono};
    font-size: 13px;
    line-height: 20px;
    letter-spacing: 0;
    text-transform: uppercase;
    color: ${J.textTertiary};
  }
  .idx-grid-card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    min-width: 0;
    width: 100%;
  }
  .idx-grid-card-tag {
    appearance: none;
    -webkit-appearance: none;
    align-items: center;
    background: transparent;
    border: 1px solid ${J.textTertiary};
    border-radius: 999px;
    box-sizing: border-box;
    color: ${J.textTertiary};
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    font-family: ${J.fontMono};
    font-size: 12px;
    font-weight: 400;
    justify-content: center;
    letter-spacing: 0;
    line-height: 1;
    margin: 0;
    max-width: 100%;
    min-height: 23px;
    overflow: hidden;
    padding: 5px 10px 6px;
    text-overflow: ellipsis;
    text-transform: uppercase;
    transition:
      color 250ms ${H},
      border-color 250ms ${H};
    white-space: nowrap;
  }
  @media (hover: hover) {
    .idx-grid-card-tag:hover {
      color: #25593a;
      border-color: #25593a;
    }
  }
  .idx-grid-card-tag[data-active="true"] {
    color: #25593a;
    border-color: #25593a;
  }
  .idx-grid-card-tag:focus-visible {
    outline: 1px solid #25593a;
    outline-offset: 3px;
  }
  .idx-grid-card-img,
  .idx-grid-card-video,
  .idx-grid-card-media > img,
  .idx-grid-card-media > video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border: 0;
    transform: scale(1);
    transform-origin: center center;
    transition: transform 420ms ${V};
    backface-visibility: hidden;
    will-change: transform;
  }
  .idx-grid-card-video,
  .idx-grid-card-media > video {
    pointer-events: none;
  }
  @media (prefers-reduced-motion: no-preference) {
    .idx-grid-card-link:hover .idx-grid-card-img,
    .idx-grid-card-link:focus-visible .idx-grid-card-img,
    .idx-grid-card-link:focus-within .idx-grid-card-img,
    .idx-grid-card-link:hover .idx-grid-card-video,
    .idx-grid-card-link:focus-visible .idx-grid-card-video,
    .idx-grid-card-link:focus-within .idx-grid-card-video,
    .idx-grid-card-link:hover .idx-grid-card-media > img,
    .idx-grid-card-link:focus-visible .idx-grid-card-media > img,
    .idx-grid-card-link:focus-within .idx-grid-card-media > img,
    .idx-grid-card-link:hover .idx-grid-card-media > video,
    .idx-grid-card-link:focus-visible .idx-grid-card-media > video,
    .idx-grid-card-link:focus-within .idx-grid-card-media > video {
      transform: scale(1.02) !important;
    }
  }
  .idx-grid-card-link:hover .idx-flip-track,
  .idx-grid-card-link:focus-visible .idx-flip-track {
    transform: translateY(calc((var(--idx-flip-height) + 5px) * -1));
  }
  .idx-grid-card-link:hover .idx-grid-title-stack,
  .idx-grid-card-link:focus-visible .idx-grid-title-stack {
    transform: translateY(-18px);
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
    .idx-project-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    .idx-project-grid[data-grid-layout="figma"] {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      max-width: none !important;
    }
  }
  @media (max-width: 899px) {
    .idx-project-grid[data-grid-layout="figma"] {
      grid-template-columns: 1fr !important;
      row-gap: 52px !important;
    }
  }
  @media (max-width: 809px) {
    .idx-project-grid { grid-template-columns: 1fr !important; row-gap: 40px !important; }
    .idx-project-grid[data-grid-layout="figma"] {
      grid-template-columns: 1fr !important;
      row-gap: 52px !important;
    }
    .idx-grid-card-link:hover .idx-flip-track,
    .idx-grid-card-link:focus-visible .idx-flip-track,
    .idx-grid-card-link:hover .idx-grid-title-stack,
    .idx-grid-card-link:focus-visible .idx-grid-title-stack {
      transform: none !important;
    }
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
      padding-top: 15px !important;
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
      min-height: 56px !important;
      padding: 9px 0 !important;
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
      padding-top: 15px !important;
    }

    .idx-list-content {
      grid-column: 2 / span 5 !important;
    }

    .idx-list-row-grid {
      grid-template-columns: minmax(0, 1fr) max-content !important;
      align-items: center !important;
      column-gap: var(--idx-grid-gap, 10px) !important;
      row-gap: 0 !important;
      min-height: 56px !important;
      padding: 9px 0 !important;
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
      --idx-flip-height: 27px !important;
      height: 27px !important;
      line-height: 27px !important;
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

  @media (max-width: 809px) and (prefers-reduced-motion: reduce) {
    .idx-flip-track {
      transition: none !important;
      transform: none !important;
      will-change: auto !important;
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
      grid-template-columns: 1fr !important;
      column-gap: 0 !important;
    }

    .idx-year-label {
      display: none !important;
    }

    .idx-list-content {
      grid-column: 1 / -1 !important;
      width: 100% !important;
    }

    .idx-list-row-grid {
      grid-template-columns: minmax(0, 1fr) !important;
      column-gap: 0 !important;
    }

    .idx-list-title {
      grid-column: 1 / -1 !important;
      justify-self: stretch !important;
      text-align: left !important;
      width: 100% !important;
    }

    .idx-list-discipline,
    .idx-col-discipline,
    .idx-list-industry,
    .idx-col-industry {
      display: none !important;
    }

    .idx-list-view .idx-year-rule,
    .idx-list-view .idx-row-divider,
    .idx-list-bottom-rule {
      grid-column: 1 / -1 !important;
      width: 100% !important;
    }
  }
`}function At({children:e,index:t,delayMs:r,block:a=!1,className:o,style:s}){let{ref:c,appeared:l}=Ot(),d=n(null);return f(()=>{let e=d.current;if(!e||i===void 0)return;let n=`translate3d(0, ${K.distancePx}px, 0)`;if(e.getAnimations().forEach(e=>e.cancel()),!l){e.style.transform=n;return}if(bt()||typeof e.animate!=`function`){e.style.transform=`translate3d(0, 0, 0)`;return}e.style.transform=n;let a=e.animate([{transform:n},{transform:`translate3d(0, 0, 0)`}],{duration:K.durationMs,delay:r??Ct(t),easing:K.easing,fill:`both`});return()=>{a.cancel()}},[l,r,t]),u(`span`,{ref:c,className:[`idx-mask-appear`,a?`idx-mask-appear-block`:``,o??``].filter(Boolean).join(` `),"data-idx-appeared":l?`true`:`false`,style:s,children:u(`span`,{ref:d,className:`idx-mask-reveal-text`,children:e})})}function B({children:e,index:t=0,delayMs:n,durationMs:r,easing:a,block:o=!1,className:s,style:c}){let{ref:l,appeared:d}=Ot();return f(()=>{let e=l.current;if(!e||i===void 0)return;if(e.getAnimations().forEach(e=>e.cancel()),!d){e.style.opacity=`0`;return}if(bt()||typeof e.animate!=`function`){e.style.opacity=`1`;return}e.style.opacity=`0`;let o=e.animate([{opacity:0},{opacity:1}],{duration:r??U.durationMs,delay:n??wt(t),easing:a??U.easing,fill:`both`});return()=>{o.cancel()}},[d,n,r,a,t]),u(`span`,{ref:l,className:[`idx-fade-appear`,o?`idx-fade-appear-block`:``,s??``].filter(Boolean).join(` `),"data-idx-appeared":d?`true`:`false`,style:c,children:e})}function jt({className:e,style:t,delayMs:n=0}){let{ref:r,appeared:a}=Ot();return f(()=>{let e=r.current;if(!e||i===void 0)return;if(e.getAnimations().forEach(e=>e.cancel()),!a){e.style.transform=`scaleX(0)`;return}if(bt()||typeof e.animate!=`function`){e.style.transform=`scaleX(1)`;return}e.style.transform=`scaleX(0)`;let t=e.animate([{transform:`scaleX(0)`},{transform:`scaleX(1)`}],{duration:U.ruleDurationMs,delay:n,easing:U.ruleEasing,fill:`both`});return()=>{t.cancel()}},[a,n]),u(`div`,{ref:r,className:[`idx-rule`,e??``].filter(Boolean).join(` `),"data-idx-appeared":a?`true`:`false`,style:t})}function Mt({filters:e,disciplineNavItems:t,industryNavItems:n,yearNavItems:r,onFilterToggle:i,onFilterClear:a,onClearFilters:o}){let s=e.disciplines.length>0||e.industries.length>0||e.years.length>0,c={...en,alignItems:`flex-start`,fontFamily:J.fontMono,fontSize:13,lineHeight:nn,textTransform:`uppercase`,color:J.textPrimary,letterSpacing:0},l={minWidth:0,font:`inherit`,lineHeight:nn,color:J.textPrimary,whiteSpace:`nowrap`},d={display:`flex`,flexDirection:`column`,alignItems:`flex-start`,minWidth:0,overflow:`hidden`},f=e=>({display:`block`,width:`100%`,margin:0,padding:0,border:`none`,background:`transparent`,font:`inherit`,lineHeight:nn,textAlign:`left`,textTransform:`inherit`,color:J.textPrimary,letterSpacing:0,fontWeight:400,textDecoration:e?`underline`:`none`,textUnderlineOffset:`3px`,cursor:`pointer`,appearance:`none`,WebkitAppearance:`none`}),p=(e,t=0)=>({delayMs:Tt(e,t),durationMs:W.durationMs,easing:W.easing}),h=Math.max(r.length,t.length,n.length)+2;return m(`div`,{children:[m(`div`,{className:`idx-taxonomy-shell`,style:c,children:[u(`div`,{className:`idx-taxonomy-label idx-tax-label-year`,style:l,children:u(B,{...p(0,0),children:`/ Year`})}),m(`div`,{className:`idx-taxonomy-items idx-tax-items-year`,style:d,children:[u(`button`,{type:`button`,className:`idx-tax-item`,style:f(e.years.length===0),"aria-pressed":e.years.length===0,"aria-label":`Show all years`,onClick:()=>a(`years`),children:u(B,{...p(0,0),children:`All`})}),r.map((t,n)=>u(`button`,{type:`button`,className:`idx-tax-item idx-tax-value`,style:f(e.years.includes(t)),"aria-pressed":e.years.includes(t),onClick:()=>i(`years`,t),children:u(B,{...p(n+1,0),children:t})},t))]}),u(`div`,{className:`idx-taxonomy-label idx-tax-label-discipline`,style:l,children:u(B,{...p(0,1),children:`/ Service`})}),m(`div`,{className:`idx-taxonomy-items idx-tax-items-discipline`,style:d,children:[u(`button`,{type:`button`,className:`idx-tax-item`,style:f(e.disciplines.length===0),"aria-pressed":e.disciplines.length===0,"aria-label":`Show all services`,onClick:()=>a(`disciplines`),children:u(B,{...p(0,1),children:`All`})}),t.map((t,n)=>u(`button`,{type:`button`,className:`idx-tax-item idx-tax-value`,style:f(e.disciplines.includes(t)),"aria-pressed":e.disciplines.includes(t),onClick:()=>i(`disciplines`,t),children:u(B,{...p(n+1,1),children:t})},t))]}),u(`div`,{className:`idx-taxonomy-label idx-tax-label-industry`,style:l,children:u(B,{...p(0,2),children:`/ Industry`})}),m(`div`,{className:`idx-taxonomy-items idx-tax-items-industry`,style:d,children:[u(`button`,{type:`button`,className:`idx-tax-item`,style:f(e.industries.length===0),"aria-pressed":e.industries.length===0,"aria-label":`Show all industries`,onClick:()=>a(`industries`),children:u(B,{...p(0,2),children:`All`})}),n.map((t,n)=>u(`button`,{type:`button`,className:`idx-tax-item idx-tax-value`,style:f(e.industries.includes(t)),"aria-pressed":e.industries.includes(t),onClick:()=>i(`industries`,t),children:u(B,{...p(n+1,2),children:t})},t))]})]}),u(`button`,{type:`button`,className:`idx-tax-item idx-clear-filters`,onClick:o,"aria-hidden":s?void 0:`true`,tabIndex:s?void 0:-1,style:{marginTop:4,padding:0,border:`none`,background:`transparent`,fontFamily:J.fontMono,fontSize:13,lineHeight:`28px`,textTransform:`uppercase`,color:J.textSecondary,letterSpacing:0,cursor:`pointer`,textDecoration:`underline`,textUnderlineOffset:`3px`,appearance:`none`,WebkitAppearance:`none`,visibility:s?`visible`:`hidden`,pointerEvents:s?`auto`:`none`},children:u(B,{...p(h,0),children:`Clear filters`})})]})}function Nt({text:e,activeText:t,style:n,activeStyle:r,height:i}){return u(`span`,{className:`idx-flip-text`,style:{...n,"--idx-flip-height":i},"aria-label":e,children:m(`span`,{className:`idx-flip-track`,"aria-hidden":`true`,children:[u(`span`,{className:`idx-flip-copy`,children:e}),u(`span`,{className:`idx-flip-copy`,style:r,children:t??e})]})})}function Pt({projects:e,hoverVariant:t=`flip`,progressiveMounting:n=!1}){let r=p(()=>ct(e),[e]),a={fontFamily:J.fontMono,fontSize:13,fontWeight:400,lineHeight:`28px`,textTransform:`uppercase`,color:J.textPrimary,letterSpacing:0},o={fontFamily:J.fontHeading,fontSize:22,fontWeight:500,textTransform:`uppercase`,color:J.textPrimary,lineHeight:1.2},s={...o,fontFamily:J.fontProjectCta,fontWeight:400,color:J.textTertiary,WebkitTextFillColor:J.textTertiary};if(r.length===0)return u(`div`,{style:{padding:`64px 0`,textAlign:`center`,fontFamily:J.fontMono,fontSize:13,lineHeight:`28px`,textTransform:`uppercase`,color:J.textTertiary},children:`No work matches those filters.`});let c=r.reduce((e,t)=>e+1+t.items.length,0),l=n?0:Et(c,0),d=0,f=0;return m(`div`,{className:`idx-list-view idx-list-standard idx-hover-${t}`,children:[r.map(({year:e,items:r})=>{let c=d++,l=n&&f>=Xt?0:Et(c,0);return m(`div`,{className:`idx-year-group`,style:en,children:[u(jt,{className:`idx-year-rule`,delayMs:l,style:{gridColumn:`1 / -1`,height:1,backgroundColor:J.dividerStrong}}),u(`div`,{className:`idx-year-label`,style:{gridColumn:`1 / span 1`,minWidth:0,paddingTop:15},children:u(`div`,{className:`idx-year-number`,style:o,children:u(At,{index:c,delayMs:l,block:!0,children:e>0?e:`—`})})}),u(`div`,{className:`idx-list-content`,style:{gridColumn:`2 / span 5`,minWidth:0},children:r.map((e,c)=>{let l=Le(e),p=Me(e),h=t===`flip`,g=d++,_=f++,v=n&&_>=Xt,y=v?0:Et(g,0),ee=v?0:Et(g,1),b=v?0:Et(g,2);return m(`div`,{children:[m(`div`,{className:`idx-list-row idx-row idx-list-row-grid`,style:{display:`grid`,gridTemplateColumns:`repeat(5, minmax(0, 1fr))`,columnGap:Jt,alignItems:`center`,minHeight:56,padding:`9px 0`,cursor:l?`pointer`:`default`},onClick:()=>{l&&(i.location.href=l)},children:[u(`div`,{className:`idx-title-cell idx-list-title`,style:{minWidth:0,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:h?u(At,{index:g,delayMs:y,block:!0,children:u(Nt,{text:e.title,activeText:l?`View Project →`:e.title,style:o,activeStyle:l?s:void 0,height:`27px`})}):u(At,{index:g,delayMs:y,block:!0,style:o,children:e.title})}),u(`div`,{className:`idx-col-discipline idx-list-discipline`,style:{minWidth:0,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:u(B,{index:g,delayMs:ee,block:!0,style:a,children:p})}),u(`div`,{className:`idx-col-industry idx-list-industry`,style:{minWidth:0,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:u(B,{index:g,delayMs:b,block:!0,style:a,children:e.industry})})]}),c<r.length-1&&u(jt,{className:`idx-row-divider`,delayMs:n?0:y,style:{height:1,backgroundColor:J.dividerSubtle}})]},e.slug||e.title)})})]},e)}),u(jt,{className:`idx-list-bottom-rule`,delayMs:l,style:{height:1,width:`100%`,backgroundColor:J.dividerStrong}})]})}function Ft({children:e,index:t,delayMs:n,thumbnailStroke:r}){let{ref:a,appeared:o}=Ot();return f(()=>{let e=a.current;if(!e||i===void 0)return;if(e.getAnimations().forEach(e=>e.cancel()),!o){e.style.opacity=`0`;return}if(bt()||typeof e.animate!=`function`){e.style.opacity=`1`;return}e.style.opacity=`0`;let r=e.animate([{opacity:0},{opacity:1}],{duration:G.durationMs,delay:n??Dt(t),easing:G.easing,fill:`both`});return()=>{r.cancel()}},[o,n,t]),u(`div`,{ref:a,className:`idx-grid-card-media`,"data-thumbnail-stroke":r?`true`:void 0,"data-idx-media-appeared":o?`true`:`false`,children:e})}function It({project:e}){let t=Ue(e.thumbnail),n=Re(e),r=ze(n);return n&&r?u(`img`,{className:`idx-grid-card-img`,src:n,alt:`${e.title} motion thumbnail`,loading:`lazy`,decoding:`async`}):n?u(`video`,{className:`idx-grid-card-video`,src:n,poster:t||void 0,muted:!0,loop:!0,playsInline:!0,autoPlay:!0,preload:`metadata`}):t?u(`img`,{className:`idx-grid-card-img`,src:t,alt:`${e.title} thumbnail`,loading:`lazy`,decoding:`async`}):null}function Lt(e,t){let n=Number(e.sortOrder);return String(Number.isFinite(n)&&n>0?Math.floor(n):t+1)}function Rt({project:e,index:t,skipRevealDelay:n=!1}){let r=Le(e),i=Me(e),a=L(e.year),o=[e.industry,a>0?String(a):``].filter(Boolean).join(` / `),s={fontFamily:J.fontHeading,fontSize:22,fontWeight:500,textTransform:`uppercase`,color:J.textPrimary,lineHeight:1.2},c={...s,fontFamily:J.fontProjectCta,fontWeight:400,color:J.textTertiary,WebkitTextFillColor:J.textTertiary};return m(`a`,{className:`idx-grid-card`,href:r||void 0,"aria-label":e.title,children:[u(Ft,{index:t,delayMs:n?0:void 0,thumbnailStroke:e.thumbnailStroke,children:u(It,{project:e})}),u(`div`,{className:`idx-grid-card-title`,children:u(At,{index:t,delayMs:n?0:void 0,block:!0,children:u(Nt,{text:e.title,activeText:r?`View Project →`:e.title,style:s,activeStyle:r?c:void 0,height:`27px`})})}),u(`div`,{className:`idx-grid-card-meta`,children:m(B,{index:t+1,delayMs:n?0:void 0,block:!0,children:[i,i&&o?u(`br`,{}):null,o]})})]})}function zt({project:e,index:t,skipRevealDelay:n=!1}){let r=Le(e),i=Ae(e).slice(0,3),a=Lt(e,t),o=_.useContext(tn);return m(`div`,{className:`idx-grid-card`,"data-grid-layout":`figma`,children:[m(`a`,{className:`idx-grid-card-link`,href:r||void 0,"aria-label":e.title,children:[m(`div`,{className:`idx-grid-card-heading`,"aria-label":`${a} / ${e.title}`,children:[u(`span`,{className:`idx-grid-card-order`,children:a}),u(`span`,{"aria-hidden":`true`,children:`/`}),u(`span`,{className:`idx-grid-title-frame`,children:m(`span`,{className:`idx-grid-title-stack`,"aria-hidden":`true`,children:[u(`span`,{children:e.title}),u(`span`,{children:`VIEW PROJECT`})]})})]}),u(Ft,{index:t,delayMs:n?0:void 0,thumbnailStroke:e.thumbnailStroke,children:u(It,{project:e})})]}),i.length>0&&u(`div`,{className:`idx-grid-card-tags`,"aria-label":`${e.title} services`,children:i.map(e=>{if(!o)return u(`span`,{className:`idx-grid-card-tag`,children:e},e);let t=o.disciplines.includes(e);return u(`button`,{type:`button`,className:`idx-grid-card-tag`,"data-active":t?`true`:void 0,"aria-pressed":t,onClick:()=>o.onToggleDiscipline(e),children:e},e)})})]})}function Bt({projects:e,layoutVariant:t=`classic`,progressiveMounting:n=!1}){if(e.length===0)return u(`div`,{style:{padding:`64px 0`,textAlign:`center`,fontFamily:J.fontMono,fontSize:13,lineHeight:`28px`,textTransform:`uppercase`,color:J.textTertiary},children:`No work matches those filters.`});let r=t===`figma`;return m(g,{children:[!r&&u(jt,{className:`idx-grid-top-rule`,style:{height:1,width:`100%`,backgroundColor:J.dividerStrong,marginBottom:24}}),u(`div`,{className:`idx-project-grid`,"data-grid-layout":t,"aria-label":`Filtered project grid`,children:e.map((e,t)=>u(r?zt:Rt,{project:e,index:t,skipRevealDelay:n&&t>=Xt},e.slug||e.title))})]})}function Vt({activeView:e,onViewChange:t,revealStartRow:n=0}){let r=(e,t=0)=>({delayMs:Tt(e,t),durationMs:W.durationMs,easing:W.easing});return u(`div`,{className:`idx-view-toggle`,"aria-label":`Project view`,children:Qt.map((i,a)=>{let o=e===i,s=a*2;return m(_.Fragment,{children:[a>0&&u(`span`,{className:`idx-view-toggle-divider`,"aria-hidden":`true`,children:u(B,{...r(n,s-1),children:`/`})}),u(`button`,{type:`button`,className:`idx-view-toggle-option`,"data-active":o?`true`:`false`,"aria-pressed":o,onClick:()=>t(i),children:u(B,{...r(n,s),children:i})})]},i)})})}function Ht({projects:e,useCMS:r=!0,cmsModuleUrl:a=``,thumbnailVideoFieldIds:s=sn,defaultView:c=`list`,listHoverVariant:l=`flip`,gridLayoutVariant:d=`classic`,advanced:h,textPrimary:g,textSecondary:_,textTertiary:v,bg:y,dividerStrong:ee,dividerSubtle:b,surfaceActive:x}){let te=a,S=s??sn,ne=h?.defaultView??c,re=h?.listHoverVariant??l,ie=h?.gridLayoutVariant??d;J.textPrimary=h?.textPrimary||g||q.textPrimary,J.textSecondary=h?.textSecondary||_||q.textSecondary,J.textTertiary=h?.textTertiary||v||q.textTertiary,J.bg=h?.bg||y||q.bg,J.dividerStrong=h?.dividerStrong||ee||q.dividerStrong,J.dividerSubtle=h?.dividerSubtle||b||q.dividerSubtle,J.surfaceActive=h?.surfaceActive||x||q.surfaceActive;let ae=p(()=>kt(),[h,g,_,v,y,ee,b,x]);ke(r);let[oe,C]=o([]),[se,w]=o(!1);f(()=>{if(!r){C([]),w(!1);return}let e=!1;return w(!1),st(te,S).then(t=>{e||(C(t),w(!0))}).catch(()=>{e||(C([]),w(!0))}),()=>{e=!0}},[r,te,S]);let T=p(()=>{let t=r&&oe.length>0?oe:null,n=e&&e.length>0?e:null;return(r?t??[]:n??[]).map(je)},[r,oe,e]),ce=ne===`grid`?`grid`:`list`,E=yt(),[D,le]=o(ce),[ue,de]=o(0),[O,fe]=o({projects:null,view:ce,count:0}),k=n(!E);E||(k.current=!0);let[A,j]=o({disciplines:[],industries:[],years:[]}),pe=n(null),M=p(()=>Pe(T),[T]),me=n(null),[he,N]=o(0),[ge,_e]=o(!1);f(()=>{if(!vt())return;let e=()=>{_e(!1),me.current=pt(),N(e=>e+1)};return e(),i.addEventListener(`hashchange`,e),()=>i.removeEventListener(`hashchange`,e)},[]),f(()=>{if(!vt()||he===0)return;let e=me.current;if(!e){_e(!0);return}if(!(M.disciplines.length>0||M.industries.length>0||M.years.length>0))return;me.current=null,_e(!0);let t={disciplines:mt(e.disciplines,M.disciplines),industries:mt(e.industries,M.industries),years:ht(e.years,M.years)};t.disciplines.length===0&&t.industries.length===0&&t.years.length===0||j(t)},[he,M]),f(()=>{!vt()||!ge||_t(A)},[A,he,ge]);let ve=t(e=>{e!==D&&(le(e),de(e=>e+1))},[D]),ye=t((e,t)=>{j(n=>e===`years`?{...n,years:ut(n.years,Number(t))}:e===`industries`?{...n,industries:ut(n.industries,String(t))}:{...n,disciplines:ut(n.disciplines,String(t))})},[]),be=p(()=>({disciplines:A.disciplines,onToggleDiscipline:e=>ye(`disciplines`,e)}),[A.disciplines,ye]),xe=t(e=>{j(t=>t[e].length===0?t:{...t,[e]:[]})},[]),Se=t(()=>j(e=>e.disciplines.length===0&&e.industries.length===0&&e.years.length===0?e:{disciplines:[],industries:[],years:[]}),[]),P=p(()=>lt(T,A,``),[T,A]);A.disciplines.length>0||A.industries.length>0||A.years.length;let F=r&&!se,I=p(()=>D===`list`?ct(P).flatMap(e=>e.items):P,[D,P]);!k.current&&O.projects!==null&&(O.projects!==I||O.view!==D)&&(k.current=!0);let Ce=E&&!k.current,we=Ce&&O.projects===I&&O.view===D?O.count:Ce?0:I.length,Te=we>=I.length?I:I.slice(0,we),Ee=Ce&&!F&&P.length>0&&Te.length===0;f(()=>{if(k.current||!E||F||P.length===0||i===void 0)return;let e=I,t=D,n=e.length,r=!1,a=0,o=0,s=0,c=()=>{r||(s=Math.min(n,s===0?Xt:s+Zt),s>=n&&(k.current=!0),fe({projects:e,view:t,count:s}),s<n&&l())},l=()=>{a=i.requestAnimationFrame(()=>{if(a=0,!r){if(typeof i.requestIdleCallback==`function`){o=i.requestIdleCallback(()=>{o=0,c()},{timeout:100});return}c()}})};return a=i.requestAnimationFrame(()=>{a=0,c()}),()=>{r=!0,a&&i.cancelAnimationFrame(a),o&&typeof i.cancelIdleCallback==`function`&&i.cancelIdleCallback(o)}},[D,F,I,E]);let De=Math.max(10,Math.max(M.years.length,M.disciplines.length,M.industries.length)+2);return m(tn.Provider,{value:be,children:[u(`style`,{"data-index-global-css":`true`,suppressHydrationWarning:!0,children:ae}),m(`div`,{ref:pe,className:`idx-container`,"data-media-priority":`video`,style:{width:`100%`,color:J.textPrimary,fontFamily:J.fontMono,boxSizing:`border-box`,minHeight:`60vh`,padding:`0 20px`,WebkitFontSmoothing:`antialiased`,MozOsxFontSmoothing:`grayscale`},children:[m(`div`,{className:`idx-index-nav`,children:[u(`div`,{style:{opacity:1,pointerEvents:`auto`,transition:`opacity 200ms ${H}`,marginBottom:18},children:u(Mt,{filters:A,disciplineNavItems:M.disciplines,industryNavItems:M.industries,yearNavItems:M.years,onFilterToggle:ye,onFilterClear:xe,onClearFilters:Se})}),u(Vt,{activeView:D,onViewChange:ve,revealStartRow:De})]}),u(`div`,{children:F?u(`div`,{style:{padding:`64px 0`,textAlign:`center`,fontFamily:J.fontMono,fontSize:13,lineHeight:`28px`,textTransform:`uppercase`,color:J.textTertiary},children:`Loading work...`}):Ee?null:D===`grid`?u(Bt,{projects:Te,layoutVariant:ie,progressiveMounting:E}):u(Pt,{projects:Te,hoverVariant:re,progressiveMounting:E})},ue),m(`div`,{style:{marginTop:16,paddingBottom:160,fontFamily:J.fontMono,fontSize:13,lineHeight:`28px`,textTransform:`uppercase`,color:J.textPrimary},children:[P.length,` `,P.length===1?`Project`:`Projects`]})]})]})}var Ut,Wt,Gt,Kt,qt,Jt,Yt,Xt,Zt,Qt,V,H,U,W,$t,G,K,en,q,J,tn,nn,rn,an,on,sn,Y,cn,X,ln=e((()=>{r(),h(),c(),ne(),Ut=`[data-framer-name="CmsLink"], [name="CmsLink"]`,Wt=`a[href], [role="link"], [tabindex]`,Gt=`img, video, source`,Kt=`data-index-hidden-cms-link-inert`,qt=`data-index-hidden-cms-media-inert`,Jt=`var(--idx-grid-gap, 20px)`,Yt=`repeat(6, minmax(0, 1fr))`,Xt=6,Zt=12,Qt=[`grid`,`list`],V=`cubic-bezier(0.16, 1, 0.3, 1)`,H=`cubic-bezier(0.12, 0.23, 0.5, 1)`,U={durationMs:620,easing:V,ruleDurationMs:2200,ruleEasing:H,staggerMs:70,maxStaggerIndex:12,rootMargin:`0px 0px -8% 0px`,threshold:.01},W={durationMs:820,easing:V,baseDelayMs:120,rowStaggerMs:92,columnStaggerMs:0,maxRowIndex:12},$t={baseDelayMs:130,rowStaggerMs:64,columnStaggerMs:24,maxRowIndex:16},G={durationMs:620,easing:V,baseDelayMs:140,itemStaggerMs:58,maxItemIndex:24},K={durationMs:900,easing:V,baseDelayMs:90,staggerMs:90,distancePx:115},en={display:`grid`,gridTemplateColumns:Yt,columnGap:Jt,width:`100%`},q={textPrimary:`#26211f`,textSecondary:`#141414`,textTertiary:`#979797`,bg:`#F7F5F0`,dividerStrong:`#141414`,dividerSubtle:`#141414`,surfaceOverlay:`rgba(215, 213, 207, 0.72)`,surfaceActive:`#EAE8E3`,fontDisplay:`'GT Standard Trial', 'Inter', sans-serif`,fontHeading:`'GT Standard Trial', 'Inter', sans-serif`,fontProjectCta:`'GT Standard', 'GT Standard L Regular', 'GT Standard Trial', 'Inter', sans-serif`,fontMono:`'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace`},J={...q},tn=_.createContext(null),nn=`24px`,rn=`yTHrQWMIY`,an={title:`oeXZcmPna`,slug:`pdXVG_fBO`,sortOrder:`DLBifmgp1`,category1:`kuvJcmOFr`,category2:`VV1CggU2J`,category3:`E6OpH0hSs`,thumbnail:`Jy7hBJady`,thumbnailVideoLink:`SvOqFqdby`,thumbnailStroke:`OHdUYs6Mo`,year:`QZqSK_3OF`,industry:`mBIilFqVM`,isHomepage:`myUIfK0j7`},on=[`/`,`/case-studies`,`/index`],sn=an.thumbnailVideoLink,Y={defaultView:`list`,listHoverVariant:`flip`,gridLayoutVariant:`classic`,textPrimary:`#141414`,textSecondary:`#141414`,textTertiary:`#979797`,bg:`#F7F5F0`,dividerStrong:`#141414`,dividerSubtle:`#141414`,surfaceActive:`#EAE8E3`},cn=new Map,X={disciplines:`service`,industries:`industry`,years:`year`},x(Ht,{useCMS:{type:j.Boolean,title:`Use CMS`,defaultValue:!0,enabledTitle:`On`,disabledTitle:`Off`},projects:{type:j.Array,title:`Projects`,hidden:e=>e.useCMS===!0,control:{type:j.Object,controls:{title:{type:j.String,title:`Title`},category1:{type:j.String,title:`Service 1`},category2:{type:j.String,title:`Service 2`},category3:{type:j.String,title:`Service 3`},industry:{type:j.String,title:`Industry`},year:{type:j.String,title:`Year`},thumbnail:{type:j.Image,title:`Thumbnail`},thumbnailVideoLink:{type:j.File,title:`Thumbnail Video`,allowedFileTypes:[`mp4`,`mov`,`m4v`,`webm`]},thumbnailStroke:{type:j.Boolean,title:`Thumbnail Stroke`,defaultValue:!1},slug:{type:j.String,title:`Slug`},sortOrder:{type:j.Number,title:`Sorting Number`},isHomepage:{type:j.Boolean,title:`Is Homepage`}}}},advanced:{type:j.Object,title:`Advanced`,buttonTitle:`Edit`,icon:`effect`,defaultValue:Y,controls:{defaultView:{type:j.Enum,title:`Default View`,options:[`list`,`grid`],optionTitles:[`List`,`Grid`],defaultValue:`list`},listHoverVariant:{type:j.Enum,title:`List Hover`,options:[`flip`,`highlight`],optionTitles:[`Flip`,`Highlight`],defaultValue:`flip`,displaySegmentedControl:!0},gridLayoutVariant:{type:j.Enum,title:`Grid Layout`,options:[`classic`,`figma`],optionTitles:[`Current`,`Figma`],defaultValue:`classic`,displaySegmentedControl:!0},textPrimary:{type:j.Color,title:`Text Primary`,defaultValue:Y.textPrimary},textSecondary:{type:j.Color,title:`Text Secondary`,defaultValue:Y.textSecondary},textTertiary:{type:j.Color,title:`Text Tertiary`,defaultValue:Y.textTertiary},bg:{type:j.Color,title:`Background`,defaultValue:Y.bg},dividerStrong:{type:j.Color,title:`Divider Strong`,defaultValue:Y.dividerStrong},dividerSubtle:{type:j.Color,title:`Divider Subtle`,defaultValue:Y.dividerSubtle},surfaceActive:{type:j.Color,title:`Surface Active`,defaultValue:Y.surfaceActive}}}})})),un=e((()=>{ln(),ln()}));function dn(e){let{view:t,advanced:n,projects:r,useCMS:i=!0,...a}=e,o=t===`grid`?`grid`:`list`;return m(`div`,{className:`idx-grid-preview-locked`,"data-cms-source":i?`cms`:`manual`,"data-media-priority":`video`,style:{width:`100%`},children:[u(`style`,{"data-index-grid-preview-css":`true`,suppressHydrationWarning:!0,children:fn}),u(Ht,{...a,useCMS:i,projects:i?[]:r,defaultView:o,gridLayoutVariant:`figma`,advanced:{...n,defaultView:o,gridLayoutVariant:`figma`}},`index-${o}`)]})}var Z,fn,pn=e((()=>{h(),ne(),un(),Z={defaultView:`list`,listHoverVariant:`flip`,gridLayoutVariant:`figma`,textPrimary:`#141414`,textSecondary:`#141414`,textTertiary:`#979797`,bg:`#F7F5F0`,dividerStrong:`#141414`,dividerSubtle:`#141414`,surfaceActive:`#EAE8E3`},fn=`
.idx-grid-preview-locked {
    container-type: inline-size;
}

.idx-grid-preview-locked .idx-project-grid[data-grid-layout="figma"] {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    justify-content: stretch !important;
    max-width: none !important;
    row-gap: 52px !important;
}

.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"] {
    gap: 14px !important;
}

.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"] .idx-grid-card-heading,
.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"] .idx-grid-card-title {
    color: #141414 !important;
    display: grid !important;
    font-family: 'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace !important;
    font-size: 13px !important;
    font-weight: 400 !important;
    grid-template-columns: 24px 11px minmax(0, 1fr) !important;
    letter-spacing: 0 !important;
    line-height: 13px !important;
    margin: 0 !important;
    min-height: 13px !important;
    overflow: hidden !important;
    text-transform: uppercase !important;
    white-space: nowrap !important;
    width: 100% !important;
}

.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"] .idx-grid-card-heading *,
.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"] .idx-grid-card-title * {
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    letter-spacing: inherit !important;
    line-height: inherit !important;
    text-transform: inherit !important;
}

.idx-grid-preview-locked .idx-grid-title-frame,
.idx-grid-preview-locked .idx-grid-title-stack > span {
    height: 13px !important;
    line-height: 13px !important;
}

.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"] .idx-grid-card-link:hover .idx-grid-title-stack,
.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"] .idx-grid-card-link:focus-visible .idx-grid-title-stack {
    transform: translate3d(0, -18px, 0) !important;
}

.idx-grid-preview-locked .idx-grid-card-tag {
    font-size: 12px !important;
    line-height: 1 !important;
    min-height: 23px !important;
    padding: 5px 10px 6px !important;
}

.idx-grid-preview-locked .idx-list-row-grid {
    min-height: 56px !important;
    padding: 9px 0 !important;
}

.idx-grid-preview-locked .idx-year-label {
    padding-top: 15px !important;
}

.idx-grid-preview-locked .idx-list-standard .idx-flip-text {
    --idx-flip-height: 27px !important;
    height: 27px !important;
    line-height: 27px !important;
}

.idx-grid-preview-locked .idx-list-standard .idx-flip-copy {
    flex: 0 0 var(--idx-flip-height) !important;
    height: var(--idx-flip-height) !important;
    line-height: var(--idx-flip-height) !important;
}

@container (max-width: 1199px) {
    .idx-grid-preview-locked .idx-project-grid[data-grid-layout="figma"] {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        max-width: none !important;
    }
}

@container (max-width: 899px) {
    .idx-grid-preview-locked .idx-project-grid[data-grid-layout="figma"] {
        grid-template-columns: 1fr !important;
        max-width: none !important;
        row-gap: 52px !important;
    }
}

@container (max-width: 899px) {
    .idx-grid-preview-locked .idx-list-view .idx-year-group {
        grid-template-columns: 1fr !important;
        column-gap: 0 !important;
    }

    .idx-grid-preview-locked .idx-list-view .idx-year-label,
    .idx-grid-preview-locked .idx-list-view .idx-list-discipline,
    .idx-grid-preview-locked .idx-list-view .idx-col-discipline,
    .idx-grid-preview-locked .idx-list-view .idx-list-industry,
    .idx-grid-preview-locked .idx-list-view .idx-col-industry {
        display: none !important;
    }

    .idx-grid-preview-locked .idx-list-view .idx-list-content,
    .idx-grid-preview-locked .idx-list-view .idx-list-title {
        grid-column: 1 / -1 !important;
        min-width: 0 !important;
        width: 100% !important;
    }

    .idx-grid-preview-locked .idx-list-view .idx-list-row-grid {
        grid-template-columns: minmax(0, 1fr) !important;
        column-gap: 0 !important;
    }

    .idx-grid-preview-locked .idx-list-view .idx-title-cell {
        justify-self: stretch !important;
        text-align: left !important;
    }

    .idx-grid-preview-locked .idx-list-view .idx-year-rule,
    .idx-grid-preview-locked .idx-list-view .idx-row-divider,
    .idx-grid-preview-locked .idx-list-view .idx-list-bottom-rule {
        grid-column: 1 / -1 !important;
        width: 100% !important;
    }
}
`,dn.displayName=`IndexPage`,x(dn,{view:{type:j.Enum,title:`View`,options:[`grid`,`list`],optionTitles:[`Grid`,`List`],defaultValue:`list`,displaySegmentedControl:!0},useCMS:{type:j.Boolean,title:`Use CMS`,defaultValue:!0,enabledTitle:`On`,disabledTitle:`Off`},cmsModuleUrl:{type:j.String,title:`CMS Module`,defaultValue:``,placeholder:`Optional module URL`},thumbnailVideoFieldIds:{type:j.String,title:`Video Field`,defaultValue:`SvOqFqdby`},projects:{type:j.Array,title:`Projects`,hidden:e=>e.useCMS===!0,control:{type:j.Object,controls:{title:{type:j.String,title:`Title`},category1:{type:j.String,title:`Service 1`},category2:{type:j.String,title:`Service 2`},category3:{type:j.String,title:`Service 3`},industry:{type:j.String,title:`Industry`},year:{type:j.String,title:`Year`},thumbnail:{type:j.Image,title:`Thumbnail`},thumbnailVideoLink:{type:j.File,title:`Thumbnail Video`,allowedFileTypes:[`mp4`,`mov`,`m4v`,`webm`]},thumbnailStroke:{type:j.Boolean,title:`Thumbnail Stroke`,defaultValue:!1},slug:{type:j.String,title:`Slug`},sortOrder:{type:j.Number,title:`Sorting Number`},isHomepage:{type:j.Boolean,title:`Is Homepage`}}}},advanced:{type:j.Object,title:`Advanced`,buttonTitle:`Edit`,icon:`effect`,defaultValue:Z,controls:{textPrimary:{type:j.Color,title:`Text Primary`,defaultValue:Z.textPrimary},textSecondary:{type:j.Color,title:`Text Secondary`,defaultValue:Z.textSecondary},textTertiary:{type:j.Color,title:`Text Tertiary`,defaultValue:Z.textTertiary},bg:{type:j.Color,title:`Background`,defaultValue:Z.bg},dividerStrong:{type:j.Color,title:`Divider Strong`,defaultValue:Z.dividerStrong},dividerSubtle:{type:j.Color,title:`Divider Subtle`,defaultValue:Z.dividerSubtle},surfaceActive:{type:j.Color,title:`Surface Active`,defaultValue:Z.surfaceActive}}}})}));function mn(){if(i===void 0)return null;let e=i;if(!e.__articaIndexProjectsRegistry){let t=new Map,n=new Set;e.__articaIndexProjectsRegistry={items:t,listeners:n,register(e,r){t.set(e,r),n.forEach(e=>e(t))},unregister(e){t.delete(e),n.forEach(e=>e(t))},subscribe(e){return n.add(e),e(t),()=>{n.delete(e)}}}}return e.__articaIndexProjectsRegistry??null}function Q(e){if(e)return typeof e==`string`?e:Array.isArray(e)?e.map(Q).find(Boolean):Q(e.src)||Q(e.url)||Q(e.href)||Q(e.file)||Q(e.value)}function hn(e){return e.slug&&typeof e.slug==`string`&&e.slug.trim()?`slug:${e.slug.trim()}`:e.title&&typeof e.title==`string`&&e.title.trim()?`title:${e.title.trim().toLowerCase()}`:`pr_${Math.random().toString(36).slice(2)}_${Date.now()}`}function gn(e){let t=p(()=>hn(e),[e.slug,e.title]),n=p(()=>{let t=Q(e.thumbnail),n=Q(e.thumbnailVideoLink);return{title:e.title||``,category1:e.category1||``,category2:e.category2||``,category3:e.category3||``,industry:e.industry||``,year:e.year||``,thumbnail:t||void 0,thumbnailVideoLink:n||``,thumbnailStroke:!!e.thumbnailStroke,slug:e.slug||``,sortOrder:typeof e.sortOrder==`number`?e.sortOrder:void 0,isHomepage:!!e.isHomepage}},[e.title,e.category1,e.category2,e.category3,e.industry,e.year,e.thumbnail,e.thumbnailVideoLink,e.thumbnailStroke,e.slug,e.sortOrder,e.isHomepage]);if(f(()=>{let e=mn();if(e)return e.register(t,n),()=>{e.unregister(t)}},[t,n]),N.current()!==N.canvas)return null;let r=e.title?String(e.title):`ProjectRegistrar`;return m(`div`,{"aria-hidden":`true`,style:{display:`inline-flex`,alignItems:`center`,gap:6,padding:`4px 8px`,width:`fit-content`,maxWidth:240,height:22,fontFamily:`'GT Standard Mono', 'GT Standard Mono Trial', 'SF Mono', 'Menlo', monospace`,fontSize:10,lineHeight:1,color:`rgba(20, 20, 20, 0.7)`,background:`rgba(20, 20, 20, 0.06)`,border:`1px dashed rgba(20, 20, 20, 0.35)`,borderRadius:3,whiteSpace:`nowrap`,overflow:`hidden`,textOverflow:`ellipsis`,pointerEvents:`none`,userSelect:`none`},children:[u(`span`,{style:{opacity:.6},children:`.`}),u(`span`,{style:{overflow:`hidden`,textOverflow:`ellipsis`},children:r})]})}var _n=e((()=>{r(),h(),ne(),c(),x(gn,{title:{type:j.String,title:`Title`},category1:{type:j.String,title:`Category 1`},category2:{type:j.String,title:`Category 2`},category3:{type:j.String,title:`Category 3`},industry:{type:j.String,title:`Industry`},year:{type:j.String,title:`Year`},thumbnail:{type:j.Image,title:`Thumbnail`},thumbnailVideoLink:{type:j.File,title:`Thumbnail Video`,allowedFileTypes:[`mp4`,`webm`,`mov`]},thumbnailStroke:{type:j.Boolean,title:`Thumbnail Stroke`},slug:{type:j.String,title:`Slug`},sortOrder:{type:j.Number,title:`Sorting Number`},isHomepage:{type:j.Boolean,title:`Is Homepage`}})})),vn,yn,bn,xn,Sn,Cn,wn,Tn,En,Dn,On,kn,An,jn,Mn,Nn,Pn,Fn,$,In;e((()=>{h(),ne(),ee(),c(),pn(),ge(),_n(),Ce(),ve(),Se(),Ee(),vn=ae(_e),yn=ae(gn),bn=T(w),xn=ae(dn),Sn={aezamcJ1c:`(min-width: 1200px)`,G55AqW3_8:`(min-width: 810px) and (max-width: 1199.98px)`,SHlGJIu9v:`(max-width: 809.98px)`},Cn=[],wn=`framer-vSVCE`,Tn={aezamcJ1c:`framer-v-1yp9f7e`,G55AqW3_8:`framer-v-8p6f3u`,SHlGJIu9v:`framer-v-8in89w`},En=(e,t,n)=>e&&t?`position`:n,Dn=e=>typeof e==`object`&&e&&typeof e.src==`string`?e:typeof e==`string`?{src:e}:void 0,On=e=>typeof e==`object`&&e&&typeof e.src==`string`?e.src:typeof e==`string`?e:void 0,kn=()=>({from:{alias:`AwTGGhR7I`,data:we,type:`Collection`},limit:{type:`LiteralValue`,value:25},select:[{collection:`AwTGGhR7I`,name:`pdXVG_fBO`,type:`Identifier`},{collection:`AwTGGhR7I`,name:`Jy7hBJady`,type:`Identifier`},{collection:`AwTGGhR7I`,name:`oeXZcmPna`,type:`Identifier`},{collection:`AwTGGhR7I`,name:`kuvJcmOFr`,type:`Identifier`},{collection:`AwTGGhR7I`,name:`VV1CggU2J`,type:`Identifier`},{collection:`AwTGGhR7I`,name:`E6OpH0hSs`,type:`Identifier`},{collection:`AwTGGhR7I`,name:`mBIilFqVM`,type:`Identifier`},{collection:`AwTGGhR7I`,name:`QZqSK_3OF`,type:`Identifier`},{collection:`AwTGGhR7I`,name:`DLBifmgp1`,type:`Identifier`},{collection:`AwTGGhR7I`,name:`myUIfK0j7`,type:`Identifier`},{collection:`AwTGGhR7I`,name:`id`,type:`Identifier`}]}),An=({query:e,pageSize:t,children:n})=>n(ue(e)),jn={opacity:1,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,transformPerspective:1200,transition:{delay:.1,duration:1.5,ease:[.16,1,.3,1],type:`tween`},x:0,y:0},Mn={opacity:1,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,transformPerspective:1200,x:0,y:93},Nn={Desktop:`aezamcJ1c`,Phone:`SHlGJIu9v`,Tablet:`G55AqW3_8`},Pn=({value:e})=>E()?null:u(`style`,{dangerouslySetInnerHTML:{__html:e},"data-framer-html-style":``}),Fn=({height:e,id:t,width:n,...r})=>({...r,variant:Nn[r.variant]??r.variant??`aezamcJ1c`}),$=O(d(function(e,t){let r=n(null),i=t??r,o=l(),{activeLocale:c,setLocale:d}=he();M();let{style:f,className:h,layoutId:_,variant:ee,...x}=Fn(e);D(p(()=>Te({},c),[c]));let[S,ne]=pe(ee,Sn,!1),ie=te(wn,I,xe),ae=s(ce)?.isLayoutTemplate,oe=!!s(v)?.transition?.layout,T=En(ae,oe);return se({}),u(ce.Provider,{value:{activeVariantId:S,humanReadableVariantMap:Nn,primaryVariantId:`aezamcJ1c`,variantClassNames:Tn},children:m(y,{id:_??o,children:[u(Pn,{value:`html body { background: var(--token-faf217ee-812d-4474-8131-b934f8e4dc1f, rgb(246, 243, 236)); }`}),m(b.div,{...x,className:te(ie,`framer-1yp9f7e`,h),ref:i,style:{...f},children:[u(k,{children:u(C,{className:`framer-nnfxny-container`,"data-code-component-plugin-id":`mcp001`,isAuthoredByUser:!0,layout:T,nodeId:`N9qkGczrN`,scopeId:`u2LOaBT5q`,children:u(_e,{barColor:`rgb(247, 245, 240)`,barEaseMs:3e3,barHeight:8,barHold:.86,bootColor:`rgb(35, 51, 36)`,bootMaxWaitMs:4500,bootMinMs:1200,bootMode:`once`,bootSwipeDelayMs:300,bootSwipeMs:1200,dim:.35,drift:10,duration:700,enabled:!0,excludeSelector:`[data-no-transition]`,firstBoot:!0,height:`100%`,holdAppear:!0,homeArrivalMode:`animate`,id:`N9qkGczrN`,layoutId:`N9qkGczrN`,navDuration:400,navSelector:`nav[data-framer-name="Navigation"], nav`,prefetch:!0,skipCaseStudyTransitions:!0,style:{height:`100%`,width:`100%`},width:`100%`})})}),u(b.div,{className:`framer-unwxb4`,"data-framer-name":`CMS Link`,layout:T,children:u(A,{children:u(An,{query:kn(),children:(e,t,n)=>u(g,{children:e?.map(({DLBifmgp1:e,E6OpH0hSs:t,id:n,Jy7hBJady:r,kuvJcmOFr:i,mBIilFqVM:o,myUIfK0j7:s,oeXZcmPna:c,pdXVG_fBO:l,QZqSK_3OF:d,VV1CggU2J:f},p)=>(l??=``,c??=``,i??=``,f??=``,t??=``,o??=``,d??=``,e??=0,s??=!0,u(y,{id:`AwTGGhR7I-${n}`,children:u(fe.Provider,{value:{pdXVG_fBO:l},children:u(le,{href:{pathVariables:{pdXVG_fBO:l},webPageId:`UlQco8cYi`},motionChild:!0,nodeId:`XLQXxoBPL`,scopeId:`u2LOaBT5q`,children:m(b.a,{className:`framer-wqb5zs framer-11aflm3`,children:[u(de,{breakpoint:S,overrides:{SHlGJIu9v:{background:{alt:``,fit:`fill`,loading:re(1525.5),sizes:`30px`,...Dn(r)}}},children:u(me,{background:{alt:``,fit:`fill`,loading:re(1525.5),pixelHeight:1810,pixelWidth:3236,sizes:`30px`,...Dn(r)},className:`framer-1am7lwi`})}),u(w,{__fromCanvasComponent:!0,children:u(a,{children:u(`p`,{className:`framer-styles-preset-1dmv8xw`,"data-styles-preset":`ZB3A5PLtS`,dir:`auto`,children:`Title`})}),className:`framer-begyn5`,"data-framer-name":`Title`,fonts:[`Inter`],text:c,verticalAlignment:`top`,withExternalLayout:!0}),u(k,{children:u(C,{className:`framer-l2x7iy-container`,isAuthoredByUser:!0,nodeId:`I063adJ_h`,scopeId:`u2LOaBT5q`,children:u(gn,{category1:i,category2:f,category3:t,height:`100%`,id:`I063adJ_h`,industry:o,isHomepage:s,layoutId:`I063adJ_h`,slug:l,sortOrder:e,thumbnail:On(r),thumbnailStroke:!0,title:c,width:`100%`,year:d})})})]})})})},n)))})})})}),u(b.section,{className:`framer-loe8yt`,"data-framer-name":`Section Hero`,layout:T,children:u(`div`,{className:`framer-8f5wsi`,children:u(`div`,{className:`framer-krk5s5`,"data-framer-name":`Heading Row Wrapper`,children:u(de,{breakpoint:S,overrides:{SHlGJIu9v:{children:u(a,{children:u(`h1`,{dir:`auto`,style:{"--font-selector":`Q1VTVE9NVjI7R1QgU3RhbmRhcmQgVHJpYWwgTCBCZA==`,"--framer-font-family":`"GT Standard Trial L Bd", "GT Standard Trial L Bd Placeholder", sans-serif`,"--framer-font-size":`72px`,"--framer-font-weight":`700`,"--framer-letter-spacing":`-0.01em`,"--framer-line-height":`114%`,"--framer-text-color":`var(--token-0e64c98e-2e3d-4034-8a86-e95f1a065f27, rgb(35, 51, 36))`,"--framer-text-transform":`capitalize`},children:`Index`})}),fonts:[`CUSTOMV2;GT Standard Trial L Bd`]}},children:u(bn,{__fromCanvasComponent:!0,animate:jn,children:u(a,{children:u(`h1`,{className:`framer-styles-preset-zw7hg5`,"data-styles-preset":`cxLS4itsr`,dir:`auto`,style:{"--framer-text-color":`var(--token-0e64c98e-2e3d-4034-8a86-e95f1a065f27, rgb(35, 51, 36))`},children:`Index`})}),className:`framer-1nuoem9`,"data-framer-appear-id":`1nuoem9`,"data-framer-name":`Index`,fonts:[`Inter`],initial:Mn,optimized:!0,style:{transformPerspective:1200},verticalAlignment:`top`,withExternalLayout:!0})})})})}),u(k,{children:u(C,{className:`framer-33qxx5-container`,"data-code-component-plugin-id":`mcp001`,isAuthoredByUser:!0,layout:T,nodeId:`LpHsIkKp7`,scopeId:`u2LOaBT5q`,children:u(dn,{advanced:{bg:`rgb(247, 245, 240)`,dividerStrong:`rgb(20, 20, 20)`,dividerSubtle:`rgb(20, 20, 20)`,surfaceActive:`rgb(234, 232, 227)`,textPrimary:`rgb(20, 20, 20)`,textSecondary:`rgb(20, 20, 20)`,textTertiary:`rgb(151, 151, 151)`},cmsModuleUrl:``,height:`100%`,id:`LpHsIkKp7`,layoutId:`LpHsIkKp7`,projects:[],style:{width:`100%`},thumbnailVideoFieldIds:`SvOqFqdby`,useCMS:!0,view:`list`,width:`100%`})})})]}),u(`div`,{id:`overlay`})]})})}),[`.framer-vSVCE.framer-11aflm3, .framer-vSVCE .framer-11aflm3 { display: block; }`,`.framer-vSVCE.framer-1yp9f7e { align-content: center; align-items: center; background-color: var(--token-faf217ee-812d-4474-8131-b934f8e4dc1f, #f6f3ec); display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: visible; padding: 0px; position: relative; width: 1200px; }`,`.framer-vSVCE .framer-nnfxny-container { flex: none; height: 1px; opacity: 0; position: relative; width: 1px; }`,`.framer-vSVCE .framer-unwxb4 { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 20px; height: 1px; justify-content: center; left: -202px; opacity: 0; overflow: hidden; padding: 0px; position: fixed; top: 0px; width: 1px; }`,`.framer-vSVCE .framer-wqb5zs { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: flex-start; padding: 0px; position: relative; text-decoration: none; width: min-content; }`,`.framer-vSVCE .framer-1am7lwi { border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; border-top-left-radius: 8px; border-top-right-radius: 8px; flex: none; height: 30px; position: relative; width: 30px; }`,`.framer-vSVCE .framer-begyn5 { flex: none; height: auto; position: relative; white-space: pre; width: auto; }`,`.framer-vSVCE .framer-l2x7iy-container { flex: none; height: auto; position: relative; width: auto; }`,`.framer-vSVCE .framer-loe8yt { align-content: center; align-items: center; background-color: var(--token-faf217ee-812d-4474-8131-b934f8e4dc1f, #f6f3ec); display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 1px; height: 40vh; justify-content: flex-start; overflow: hidden; padding: 150px 20px 0px 20px; position: relative; width: 100%; z-index: 3; }`,`.framer-vSVCE .framer-8f5wsi { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 15px; height: min-content; justify-content: center; overflow: var(--overflow-clip-fallback, clip); padding: 0px; position: relative; width: 100%; }`,`.framer-vSVCE .framer-krk5s5 { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 113px; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 100%; }`,`.framer-vSVCE .framer-1nuoem9 { flex: none; height: auto; position: relative; white-space: pre; width: auto; will-change: var(--framer-will-change-effect-override, transform); }`,`.framer-vSVCE .framer-33qxx5-container { flex: none; height: auto; position: relative; width: 100%; }`,...P,...ye,`@media (min-width: 810px) and (max-width: 1199.98px) { .framer-vSVCE.framer-1yp9f7e { width: 810px; } .framer-vSVCE .framer-loe8yt { height: 30vh; }}`,`@media (max-width: 809.98px) { .framer-vSVCE.framer-1yp9f7e { width: 390px; } .framer-vSVCE .framer-loe8yt { height: 30vh; padding: 100px 20px 0px 20px; }}`],`framer-vSVCE`),$.displayName=`Page`,$.defaultProps={height:1691,width:1200},oe($,[{explicitInter:!0,fonts:[{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F`,url:`https://framerusercontent.com/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116`,url:`https://framerusercontent.com/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+1F00-1FFF`,url:`https://framerusercontent.com/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0370-03FF`,url:`https://framerusercontent.com/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF`,url:`https://framerusercontent.com/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD`,url:`https://framerusercontent.com/assets/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB`,url:`https://framerusercontent.com/assets/b6Y37FthZeALduNqHicBT6FutY.woff2`,weight:`400`},{cssFamilyName:`GT Standard Trial L Bd`,source:`custom`,style:`normal`,uiFamilyName:`GT Standard Trial`,url:`https://framerusercontent.com/assets/crhfNLaqXfVV61Bkd6ep2NhowE.woff2`,weight:`700`}]},...vn,...yn,...xn,...S(F),...S(be)],{supportsExplicitInterCodegen:!0}),$.loader={load:(e,t)=>{let n=t.locale,r=ie.get(kn(),n);return Promise.allSettled([r.preload()])}},In={exports:{default:{type:`reactComponent`,name:`Frameru2LOaBT5q`,slots:[],annotations:{framerResponsiveScreen:`true`,framerContractVersion:`1`,framerIntrinsicHeight:`1691`,framerScrollSections:`false`,framerImmutableVariables:`true`,framerIntrinsicWidth:`1200`,framerLayoutTemplateFlowEffect:`true`,framerAcceptsLayoutTemplate:`true`,framerDisplayContentsDiv:`false`,framerColorSyntax:`true`,framerComponentViewportWidth:`true`,framerAutoSizeImages:`true`,framerCanvasComponentVariantDetails:`{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"G55AqW3_8":{"layout":["fixed","auto"]},"SHlGJIu9v":{"layout":["fixed","auto"]}}}`}},Props:{type:`tsType`,annotations:{framerContractVersion:`1`}},queryParamNames:{type:`variable`,annotations:{framerContractVersion:`1`}},__FramerMetadata__:{type:`variable`}}}}))();export{In as __FramerMetadata__,$ as default,Cn as queryParamNames};
//# sourceMappingURL=Zg1wvIHSv22l142SsfOU7DfhgU3jVxQbiMycSmEY1A4.CGTV621K.mjs.map