import{t as e}from"./rolldown-runtime.Dh6celcD.mjs";import{A as t,F as n,L as r,N as i,S as a,c as o,j as s,k as c,l,o as u,s as ee}from"./react.BpKPsBQp.mjs";import{C as d,H as f,mt as te,o as p,v as m}from"./framer.Dxmm4ztR.mjs";function h(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}function g(e,t){let n=e?.[t];return n&&typeof n==`object`&&`value`in n?n.value:n}function _(e){return String(e??``).trim()}function v(e){return _(e).toLowerCase().replace(/\s+/g,` `)}function y(e){return _(e).replace(/^\/+|\/+$/g,``)}function b(e){if(typeof e==`boolean`)return e;if(typeof e==`number`)return e!==0;let t=_(e).toLowerCase();return t===`true`||t===`yes`||t===`1`}function x(e){if(!e)return``;if(typeof e==`string`)return e.trim();if(Array.isArray(e))return e.map(x).find(Boolean)||``;if(typeof e==`object`){let t=e;if(`value`in t)return x(t.value);for(let e of[`src`,`url`,`href`,`file`]){let n=x(t[e]);if(n)return n}}return``}function S(e){return String(e||``).split(/[\n,]/).map(e=>e.trim()).filter(Boolean)}function C(e,t){for(let n of S(t)){let t=x(g(e,n));if(t)return t}return``}function w(e){return!!(e&&e!==`#`&&e!==`/`&&e!==`.`)}function T(e){if(typeof e==`string`)return e.trim();if(e&&typeof e==`object`){let t=e,n=t.href||t.url||t.path;if(typeof n==`string`)return n.trim()}return``}function ne(e,t,n){let r=T(e);if(w(r))return r;let i=T(t);return w(i)?i:Te[v(n)]||`#`}function re(e){if(!e||r===void 0)return``;try{return y(new URL(e,r.location.href).pathname.match(/\/case-studies\/([^/?#]+)/)?.[1])}catch{return``}}function E(){try{return m.current()===m.canvas}catch{return!1}}function ie(e,t){if(E()||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||!t||t===`#`||t===`/`||r===void 0)return!1;try{let e=new URL(t,r.location.href);return e.origin===r.location.origin&&e.pathname.startsWith(`/case-studies/`)}catch{return!1}}function D(e){return!e||e===`/`?`/`:e.replace(/\/+$/,``)||`/`}function ae(e){if(!e||e===`#`||r===void 0)return null;try{let t=new URL(e,r.location.href);return t.origin===r.location.origin?t:null}catch{return null}}function oe(e,t){let n=D(e),r=D(t);if(n===r)return{};let i=[],a=n.split(`/`).map(e=>e.startsWith(`:`)&&e.length>1?(i.push(e.slice(1)),`([^/]+)`):h(e)).join(`/`),o=r.match(RegExp(`^${a}$`));return o?i.reduce((e,t,n)=>{let r=o[n+1];return r!==void 0&&(e[t]=decodeURIComponent(r)),e},{}):null}function se(e){return[e.path,...Object.values(e.pathLocalized||{})].filter(Boolean)}function O(e,t){let n=ae(t),r=e?.routes;if(!n||!r)return null;let i=D(n.pathname),a=Object.entries(r).filter(e=>!!e[1]?.path).sort(([,e],[,t])=>{let n=(e.path||`/`).split(`/`).length;return(t.path||`/`).split(`/`).length-n});for(let[e,t]of a)for(let r of se(t)){let t=oe(r,i);if(t)return{routeId:e,hash:n.hash?decodeURIComponent(n.hash.slice(1)):void 0,pathVariables:t}}return null}function ce(e,t){let n=O(e,t);if(n)try{e?.routes?.[n.routeId]?.page?.preload?.()}catch{}}function le(e,t){if(typeof e?.navigate!=`function`)return!1;try{return e.routes?.[t.routeId]?.page?.preload?.(),e.navigate(t.routeId,t.hash,t.pathVariables,!1),!0}catch{return!1}}function ue(e,t){let n=h(t);return RegExp(`/${n}(?:\\.[^/?#]+)?\\.(?:js|mjs)(?:[?#].*)?$`).test(e)}function k(e,t){let n=h(t);return e.match(RegExp(`https://framerusercontent\\.com/(?:sites|modules)/[^"']+/${n}(?:\\.[^"'/]+)?\\.(?:js|mjs)`,`i`))?.[0]}function de(){if(typeof document>`u`)return[];let e=Array.from(document.querySelectorAll(`link[href], script[src], img[src], source[src]`)).map(e=>`href`in e&&e.href?e.href:`src`in e&&e.src?e.src:``),t=typeof performance<`u`&&typeof performance.getEntriesByType==`function`?performance.getEntriesByType(`resource`).map(e=>e.name):[];return Array.from(new Set([...e,...t].filter(Boolean)))}function fe(e){let t=de().find(t=>ue(t,e));if(t)return t;if(typeof document<`u`&&document.documentElement)return k(document.documentElement.outerHTML,e)}async function pe(e,t){let n=t.trim();if(n)return n;let r=z.get(e);if(r)return r;let i=fe(e);if(i)return z.set(e,i),i;for(let t of xe)try{let n=await fetch(t,{credentials:`same-origin`});if(!n.ok)continue;let r=k(await n.text(),e);if(r)return z.set(e,r),r}catch{}}function me(e){return typeof e==`object`&&!!e&&typeof e.collectionByLocaleId?.default?.scanItems==`function`}function he(e){let t=[e.a,e.r,e.default,...Object.values(e)];for(let e of t){let t=e;if(typeof t==`function`)try{t=t()}catch{t=void 0}if(me(t))return t.collectionByLocaleId?.default}}function ge(e){[e.t,e.r,e.default,...Object.values(e)].forEach(e=>{try{typeof e==`function`&&e()}catch{}})}async function _e(e,t,n){let r=`${e}:${t}:${n}`,i=B.get(r);if(i)return i;let a=V.get(r);if(a)return a;let o=(async()=>{let i=await pe(e,t);if(!i)return[];let a=await import(i);ge(a);let o=he(a);if(!o)return[];let s=(await o.scanItems()).map(e=>{let t=e.data;return{title:_(g(t,N.title)),slug:y(g(t,N.slug))||y(e.slug),thumbnailSrc:x(g(t,N.thumbnail)),thumbnailVideoSrc:C(t,n),thumbnailStroke:b(g(t,N.thumbnailStroke))}}).filter(e=>e.title||e.slug);return B.set(r,s),s})();return V.set(r,o),o}function ve(e,t,n){let r=re(n),i=v(t);return e.find(e=>r&&y(e.slug).toLowerCase()===r.toLowerCase()?!0:i&&v(e.title)===i)}function ye({enabled:e,collectionId:t,collectionModuleUrl:n,thumbnailVideoFieldIds:a,title:o,href:c}){let[l,u]=i();return s(()=>{if(!e||r===void 0){u(void 0);return}let i=!1;return _e(t,n,a).then(e=>{i||u(ve(e,o,c))}).catch(()=>{i||u(void 0)}),()=>{i=!0}},[e,t,n,a,o,c]),l}function be({title:e=`Title`,sortingNumber:n=0,projectLink:i=``,link:a=`#`,thumbnailSrc:s=``,thumbnailVideoSrc:c=``,useCMS:u=!0,collectionId:d=M,collectionModuleUrl:f=``,thumbnailVideoFieldIds:p=N.thumbnailVideo,textColor:m=A,strokeColor:h=j}){let g=String(e||`Title`).toUpperCase(),_=Number.isFinite(Number(n))?String(Number(n)):String(n||``),v=ne(i,a,e),y=te(),b=ye({enabled:!!u,collectionId:d,collectionModuleUrl:f,thumbnailVideoFieldIds:p,title:String(e||``),href:v}),S=b?.thumbnailSrc||x(s),C=b?.thumbnailVideoSrc||x(c),w=!!C,T=t(e=>{if(!ie(e,v))return;let t=O(y,v);if(t&&(e.preventDefault(),e.stopPropagation(),!le(y,t))){let e=ae(v);e&&r.location.assign(e.href)}},[v,y]),E=t(()=>{ce(y,v)},[v,y]);return l(ee,{children:[o(`style`,{suppressHydrationWarning:!0,children:`

                .mh-other-project-card {
                    width: 100%;
                    height: auto;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: flex-start;
                    gap: 16px;
                    overflow: visible;
                    padding: 0;
                    text-decoration: none;
                    cursor: pointer;
                }

                .mh-other-project-title {
                    width: 100%;
                    min-height: ${P}px;
                    display: flex;
                    align-items: flex-start;
                    justify-content: flex-start;
                    gap: 5px;
                    overflow: visible;
                    font-family: "Azeret Mono", monospace;
                    font-size: 13px;
                    line-height: ${P}px;
                    letter-spacing: 0;
                    text-transform: uppercase;
                    white-space: nowrap;
                }

                .mh-other-project-title__number,
                .mh-other-project-title__slash {
                    flex: 0 0 auto;
                    line-height: ${P}px;
                }

                .mh-other-project-title__copy {
                    flex: 1 1 auto;
                    min-width: 0;
                    height: ${P}px;
                    overflow: hidden;
                }

                .mh-other-project-title__track {
                    display: flex;
                    flex-direction: column;
                    transform: translateY(0);
                    transition: transform ${F}ms ${I};
                    will-change: transform;
                }

                .mh-other-project-title__line {
                    display: block;
                    height: ${P}px;
                    line-height: ${P}px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .mh-other-project-title__line--hover {
                    display: block;
                }

                .mh-other-project-card:hover .mh-other-project-title__track,
                .mh-other-project-card:focus-visible .mh-other-project-title__track,
                .mh-other-project-card:focus-within .mh-other-project-title__track {
                    transform: translateY(-${P}px);
                }

                .mh-other-project-media {
                    position: relative;
                    width: 100%;
                    aspect-ratio: ${Se};
                    flex: none;
                    overflow: hidden;
                    background: transparent;
                    clip-path: inset(0);
                    contain: paint;
                    isolation: isolate;
                }

                .mh-other-project-media::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    z-index: 2;
                    pointer-events: none;
                    box-shadow: inset 0 0 0 1px var(--mh-other-project-stroke, ${j});
                    opacity: 0;
                }

                .mh-other-project-media[data-thumbnail-stroke="true"]::after {
                    opacity: 1;
                }

                .mh-other-project-media img,
                .mh-other-project-media video {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    display: block;
                    object-fit: cover;
                    object-position: center;
                    scale: 1;
                    transform-origin: center center;
                    transition: scale ${F}ms ${I};
                    backface-visibility: hidden;
                    will-change: scale;
                }

                .mh-other-project-card:hover .mh-other-project-media img,
                .mh-other-project-card:hover .mh-other-project-media video,
                .mh-other-project-card:focus-visible .mh-other-project-media img,
                .mh-other-project-card:focus-visible .mh-other-project-media video,
                .mh-other-project-card:focus-within .mh-other-project-media img,
                .mh-other-project-card:focus-within .mh-other-project-media video {
                    scale: 1.02;
                }

                .mh-other-project-media video {
                    pointer-events: none;
                    z-index: 1;
                }

                @media (max-width: 809px) {
                    ${L} ${Ce} {
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        justify-content: flex-start !important;
                        gap: 0px !important;
                    }

                    ${L} ${R} {
                        width: 100% !important;
                        box-sizing: border-box !important;
                        display: flex !important;
                        flex-direction: row !important;
                        flex-wrap: wrap !important;
                        align-items: flex-start !important;
                        justify-content: center !important;
                        gap: 20px !important;
                        padding: 0px 20px 0px 20px !important;
                        overflow: hidden !important;
                    }

                    ${L} ${R} > ${we} {
                        flex: 1 1 220px !important;
                        min-width: 220px !important;
                        max-width: none !important;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .mh-other-project-title__track,
                    .mh-other-project-media img,
                    .mh-other-project-media video {
                        transition: none;
                        will-change: auto;
                    }

                    .mh-other-project-card:hover .mh-other-project-title__track,
                    .mh-other-project-card:focus-visible .mh-other-project-title__track,
                    .mh-other-project-card:focus-within .mh-other-project-title__track {
                        transform: none;
                    }

                    .mh-other-project-card:hover .mh-other-project-media img,
                    .mh-other-project-card:hover .mh-other-project-media video,
                    .mh-other-project-card:focus-visible .mh-other-project-media img,
                    .mh-other-project-card:focus-visible .mh-other-project-media video,
                    .mh-other-project-card:focus-within .mh-other-project-media img,
                    .mh-other-project-card:focus-within .mh-other-project-media video {
                        scale: 1;
                    }
                }
            `}),l(`a`,{"data-framer-name":`Other Project Card`,href:v,onClick:T,onFocus:E,onMouseEnter:E,"aria-label":`${g} project`,className:`mh-other-project-card`,"data-project-slug":b?.slug||re(v)||void 0,style:{color:m},children:[l(`div`,{"data-framer-name":`Title Wrapper`,className:`mh-other-project-title`,children:[o(`span`,{className:`mh-other-project-title__number`,children:_}),o(`span`,{className:`mh-other-project-title__slash`,children:`/`}),o(`span`,{className:`mh-other-project-title__copy`,children:l(`span`,{className:`mh-other-project-title__track`,children:[o(`span`,{className:`mh-other-project-title__line`,children:g}),o(`span`,{className:`mh-other-project-title__line mh-other-project-title__line--hover`,children:`VIEW PROJECT`})]})})]}),l(`div`,{"data-framer-name":`ImageWrapper`,className:`mh-other-project-media`,"data-thumbnail-stroke":b?.thumbnailStroke?`true`:void 0,style:{"--mh-other-project-stroke":h},children:[S?o(`img`,{"data-framer-name":`Image`,src:S,alt:``,loading:`lazy`,decoding:`async`}):null,w?o(`video`,{"data-framer-name":`Video`,src:C,poster:S||void 0,muted:!0,loop:!0,autoPlay:!0,playsInline:!0,preload:`metadata`}):null]})]})]})}var A,j,M,N,xe,Se,P,F,I,L,Ce,R,we,Te,z,B,V,Ee=e((()=>{n(),u(),a(),f(),A=`#233324`,j=`#979797`,M=`yTHrQWMIY`,N={title:`oeXZcmPna`,slug:`pdXVG_fBO`,thumbnail:`Jy7hBJady`,thumbnailVideo:`SvOqFqdby`,thumbnailStroke:`OHdUYs6Mo`},xe=[`/`,`/case-studies`,`/index`,`https://khaki-ship-257706.framer.app/`,`https://khaki-ship-257706.framer.app/case-studies`,`https://khaki-ship-257706.framer.app/index`],Se=`16 / 9`,P=13,F=420,I=`cubic-bezier(0.16, 1, 0.3, 1)`,L=`:is([data-framer-name="SectionNextProject"], [name="SectionNextProject"], [data-framer-name="Section Next Project"], [name="Section Next Project"])`,Ce=`:is([data-framer-name="Heading"], [name="Heading"])`,R=`:is([data-framer-name="NextProjectWrapper"], [name="NextProjectWrapper"], [data-framer-name="Next Project Wrapper"], [name="Next Project Wrapper"])`,we=`:is([data-framer-name="AllProjects"], [name="AllProjects"])`,Te={"airpods pro 3":`/case-studies/airpods`,"peak energy":`/case-studies/peak-energy`,"simon & schuster":`/case-studies/simon-schuster`,gaia:`/case-studies/gaia`,"national park playing cards":`/case-studies/national-park-cards`,"motion connect 2025":`/case-studies/motion-connect-2025`,yomo:`/case-studies/yomo`,"highland harvests":`/case-studies/highland-harvests`,"weaponized innocence":`/case-studies/weaponized-innocence`,typldn:`/case-studies/typldn`,"seek truth":`/case-studies/seek-truth`,"cellular symphony":`/case-studies/cellular-symphony`,"wolff olins x artcenter":`/case-studies/wolff-olins-x-artcenter`,"independent lens":`/case-studies/independent-lens`,rejuve:`/case-studies/rejuve`,"belly bar":`/case-studies/belly-bar`,whatsapp:`/case-studies/whatsapp`},z=new Map,B=new Map,V=new Map,d(be,{title:{type:p.String,title:`Title`,defaultValue:`Title`},sortingNumber:{type:p.Number,title:`Number`,defaultValue:0,min:0,step:1,displayStepper:!0},projectLink:{type:p.Link,title:`Link`},link:{type:p.Link,title:`Legacy Link`,hidden:()=>!0},thumbnailSrc:{type:p.String,title:`Image URL`,defaultValue:``},thumbnailVideoSrc:{type:p.String,title:`Video URL`,defaultValue:``},useCMS:{type:p.Boolean,title:`Use CMS`,defaultValue:!0},collectionId:{type:p.String,title:`Collection`,defaultValue:M,hidden:()=>!0},collectionModuleUrl:{type:p.String,title:`CMS Module`,defaultValue:``,hidden:()=>!0},thumbnailVideoFieldIds:{type:p.String,title:`Video Field`,defaultValue:N.thumbnailVideo,hidden:()=>!0},textColor:{type:p.Color,title:`Text`,defaultValue:A},strokeColor:{type:p.Color,title:`Stroke`,defaultValue:j}})})),De=e((()=>{Ee(),Ee()}));function Oe(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}function H(e,t){let n=e?.[t];return n&&typeof n==`object`&&`value`in n?n.value:n}function ke(e){return String(e??``).trim()}function U(e){return ke(e).replace(/^\/+|\/+$/g,``)}function W(e){return[...e].sort((e,t)=>e.order-t.order)}function Ae(e,t){let n=Oe(t);return RegExp(`/${n}(?:\\.[^/?#]+)?\\.(?:js|mjs)(?:[?#].*)?$`).test(e)}function je(e,t){let n=Oe(t);return e.match(RegExp(`https://framerusercontent\\.com/(?:sites|modules)/[^"']+/${n}(?:\\.[^"'/]+)?\\.(?:js|mjs)`,`i`))?.[0]}function Me(){if(typeof document>`u`)return[];let e=Array.from(document.querySelectorAll(`link[href], script[src]`)).map(e=>`href`in e&&e.href?e.href:`src`in e&&e.src?e.src:``),t=typeof performance<`u`&&typeof performance.getEntriesByType==`function`?performance.getEntriesByType(`resource`).map(e=>e.name):[];return Array.from(new Set([...e,...t].filter(Boolean)))}function Ne(e){let t=Me().find(t=>Ae(t,e));if(t)return t;if(typeof document<`u`&&document.documentElement)return je(document.documentElement.outerHTML,e)}async function Pe(e){let t=Z.get(e);if(t)return t;let n=Ne(e);if(n)return Z.set(e,n),n;for(let t of He)try{let n=await fetch(t,{credentials:`same-origin`});if(!n.ok)continue;let r=je(await n.text(),e);if(r)return Z.set(e,r),r}catch{}}function Fe(e){return typeof e==`object`&&!!e&&typeof e.collectionByLocaleId?.default?.scanItems==`function`}function Ie(e){let t=[e.a,e.r,e.default,...Object.values(e)];for(let e of t){let t=e;if(typeof t==`function`)try{t=t()}catch{t=void 0}if(Fe(t))return t.collectionByLocaleId?.default}}function Le(e){[e.t,e.r,e.default,...Object.values(e)].forEach(e=>{try{typeof e==`function`&&e()}catch{}})}async function Re(e){let t=Q.get(e);if(t)return t;let n=$.get(e);if(n)return n;let r=(async()=>{try{let t=await Pe(e);if(!t)return W(X);let n=await import(t);Le(n);let r=Ie(n);if(!r)return W(X);let i=(await r.scanItems()).map(e=>{let t=e.data,n=Number(H(t,q.order)),r=U(H(t,q.slug))||U(e.slug);return{title:ke(H(t,q.title)),slug:r,order:Number.isFinite(n)?n:1/0}}).filter(e=>e.slug),a=i.length>0?W(i):W(X);return Q.set(e,a),a}catch{return W(X)}})();return $.set(e,r),r}function ze(e){return U(e)||(r===void 0?``:U(r.location.pathname.match(/\/case-studies\/([^/?#]+)/)?.[1]))}function Be(e,t,n){if(e.length===0||n<=0)return[];let r=e.findIndex(e=>e.slug.toLowerCase()===t.toLowerCase());if(r===-1)return e.slice(0,n);let i=[],a=e.length;for(let t=1;t<=n&&t<a;t+=1)i.push(e[(r+t)%a]);return i}function Ve(e,t){let n=ze(e),[a,o]=i(()=>Q.get(K)??W(X));return s(()=>{if(r===void 0)return;let e=!1;return Re(K).then(t=>{!e&&t.length>0&&o(t)}).catch(()=>{}),()=>{e=!0}},[]),c(()=>Be(a,n,t),[a,n,t])}function G(e){let t=Math.max(1,Math.round(Number(e.count??3))),n=Number.isFinite(Number(e.gap))?Number(e.gap):20,r=e.textColor||J,i=e.strokeColor||Y,a=Ve(e.currentSlug||``,t),s=be;return l(ee,{children:[o(`style`,{suppressHydrationWarning:!0,children:`
                .mh-next-projects-row {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    align-items: flex-start;
                    justify-content: center;
                    width: 100%;
                    box-sizing: border-box;
                }

                .mh-next-projects-col {
                    flex: 1 1 220px;
                    min-width: 220px;
                    max-width: none;
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                }
            `}),o(`div`,{"data-framer-name":`NextProjectsSection`,className:`mh-next-projects-row`,style:{gap:n},children:a.map(e=>o(`div`,{"data-framer-name":`AllProjects`,className:`mh-next-projects-col`,children:o(s,{title:e.title,sortingNumber:e.order,projectLink:`/case-studies/${e.slug}`,useCMS:!0,collectionId:K,thumbnailVideoFieldIds:q.thumbnailVideo,textColor:r,strokeColor:i})},e.slug))})]})}var K,q,He,J,Y,X,Z,Q,$,Ue=e((()=>{n(),u(),a(),f(),De(),K=`yTHrQWMIY`,q={title:`oeXZcmPna`,slug:`pdXVG_fBO`,order:`DLBifmgp1`,thumbnailVideo:`SvOqFqdby`},He=[`/`,`/case-studies`,`/index`,`https://khaki-ship-257706.framer.app/`,`https://khaki-ship-257706.framer.app/case-studies`,`https://khaki-ship-257706.framer.app/index`],J=`rgb(35, 51, 36)`,Y=`rgb(151, 151, 151)`,X=[{title:`Gaia`,slug:`gaia`,order:1},{title:`AirPods Pro 3`,slug:`airpods`,order:2},{title:`Peak Energy`,slug:`peak-energy`,order:3},{title:`Motion Connect 2025`,slug:`motion-connect-2025`,order:4},{title:`Simon & Schuster`,slug:`simon-schuster`,order:5},{title:`National Park Playing Cards`,slug:`national-park-cards`,order:6},{title:`Yomo`,slug:`yomo`,order:7},{title:`Karuna`,slug:`highland-harvests`,order:8},{title:`Weaponized Innocence`,slug:`weaponized-innocence`,order:9},{title:`Wolff Olins x ArtCenter`,slug:`wolff-olins-x-artcenter`,order:10},{title:`Cellular Symphony`,slug:`cellular-symphony`,order:11},{title:`Seek Truth`,slug:`seek-truth`,order:12},{title:`Independent Lens`,slug:`independent-lens`,order:13},{title:`TYPLDN`,slug:`typldn`,order:14},{title:`WhatsApp`,slug:`whatsapp`,order:17}],Z=new Map,Q=new Map,$=new Map,G.defaultProps={count:3,gap:20,textColor:J,strokeColor:Y,currentSlug:``},d(G,{currentSlug:{type:p.String,title:`Page Slug`,defaultValue:``,placeholder:`e.g. gaia — set to THIS page's slug`},count:{type:p.Number,title:`Count`,defaultValue:3,min:1,max:6,step:1,displayStepper:!0},gap:{type:p.Number,title:`Gap`,defaultValue:20,min:0,max:80,step:1,unit:`px`},textColor:{type:p.Color,title:`Text`,defaultValue:J},strokeColor:{type:p.Color,title:`Stroke`,defaultValue:Y}}),G.displayName=`Next Projects Section`}));export{Ue as n,G as t};
//# sourceMappingURL=NextProjectsSection.CW3MpeNJ.mjs.map