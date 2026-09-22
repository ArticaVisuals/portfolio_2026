import{t as e}from"./rolldown-runtime.Dh6celcD.mjs";import{F as t,L as n,N as r,S as i,c as a,j as o,k as s,o as c}from"./react.BpKPsBQp.mjs";import{C as l,H as ee,o as u}from"./framer.Dxmm4ztR.mjs";function d(e){return String(e||``).trim().replace(/^\/+|\/+$/g,``)}function f(e){return String(e||``).toLowerCase().replace(/\s+/g,` `).trim()}function p(){return n===void 0?``:n.location.pathname.replace(/\/+$/,``)||`/`}function m(){let e=p();return e===`/`||e===`/case-studies`}function te(){let e=p();return e.startsWith(`/case-studies/`)&&e.length>14}function h(e,t){if(!t)return;let n=e?.[t];return n&&typeof n==`object`&&`value`in n?n.value:n}function g(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}function ne(e,t){let n=g(t);return RegExp(`/${n}(?:\\.[^/?#]+)?\\.(?:js|mjs)(?:[?#].*)?$`).test(e)}function _(e,t){let n=g(t);return e.match(RegExp(`https://framerusercontent\\.com/(?:sites|modules)/[^"']+/${n}(?:\\.[^"'/]+)?\\.(?:js|mjs)`,`i`))?.[0]}function re(){if(typeof document>`u`)return[];let e=Array.from(document.querySelectorAll(`link[href], script[src], img[src], source[src]`)).map(e=>`href`in e&&e.href?e.href:`src`in e&&e.src?e.src:``),t=typeof performance<`u`&&typeof performance.getEntriesByType==`function`?performance.getEntriesByType(`resource`).map(e=>e.name):[];return Array.from(new Set([...e,...t].filter(Boolean)))}function ie(e){let t=re().find(t=>ne(t,e));if(t)return t;if(typeof document<`u`&&document.documentElement)return _(document.documentElement.outerHTML,e)}async function ae(e,t){let n=t.trim();if(n)return n;let r=q.get(e);if(r)return r;let i=ie(e);if(i)return q.set(e,i),i;for(let t of G)try{let n=await fetch(t,{credentials:`same-origin`});if(!n.ok)continue;let r=_(await n.text(),e);if(r)return q.set(e,r),r}catch{}}function oe(e){return typeof e==`object`&&!!e&&typeof e.collectionByLocaleId?.default?.scanItems==`function`}function se(e){return[e.a,e.r,e.default,...Object.values(e)].find(oe)?.collectionByLocaleId?.default}function v(e){let t=[e.t,e.r,e.default,...Object.values(e)];try{t.forEach(e=>{typeof e==`function`&&e()})}catch{}}async function ce({collectionId:e,collectionModuleUrl:t,slugFieldId:n,titleFieldId:r}){let i=await ae(e,t);if(!i)return[];let a=await import(i);v(a);let o=se(a);return o?(await o.scanItems()).map(e=>{let t=e.data,i=h(t,r)||e.title,a=h(t,n)||e.slug;return{title:String(i||``).trim(),slug:d(a)}}).filter(e=>e.title&&e.slug):[]}function le(e){let t={};return String(e||``).split(/[\n,]/).map(e=>e.trim()).filter(Boolean).forEach(e=>{let n=e.indexOf(`=`);if(n<0)return;let r=d(e.slice(0,n)),i=e.slice(n+1).trim();r&&i&&(t[r]=i)}),t}function ue(e,t){let n=d(e);return!n||V.has(n)?``:t[n]||`/case-studies/${n}`}function y(e,t){let n=le(t),r=new Set;return(e.length?e:H).map(e=>({title:e.title,slug:d(e.slug)})).filter(e=>{let t=`${f(e.title)}
${e.slug}`;return!e.title||!e.slug||r.has(t)?!1:(r.add(t),!0)}).map(e=>{let t=ue(e.slug,n);return{...e,normalizedTitle:f(e.title),unavailable:!t,url:t}})}function b(e){return f(e.querySelector(W)?.textContent||e.textContent||``).replace(/^\d+\s*\/\s*/,``).replace(/view\s*project/g,``).trim()}function de(e,t){return!!(e&&t.normalizedTitle&&(e===t.normalizedTitle||e.includes(t.normalizedTitle)))}function x(e,t){let n=b(e);return t.find(e=>de(n,e))||null}function fe(e){if(typeof document>`u`)return[];let t=[],n=new Set;return document.querySelectorAll(U).forEach(r=>{let i=r.closest(`[data-framer-name="Card"], [name="Card"]`)||r;n.has(i)||!x(i,e)||(n.add(i),t.push(i))}),t}function pe(e){if(!e)return``;try{let t=new URL(e,n.location.href);return t.origin===n.location.origin?t.pathname.replace(/\/+$/,``)||`/`:t.href}catch{return e.split(`?`)[0].split(`#`)[0].replace(/\/+$/,``)||e}}function me(e,t){if(!t)return!1;let n=String(e||``).trim();if(!n||n===`#`||n===`.`||n===`./`||n.includes(`:slug`))return!0;let r=pe(n),i=p();return r===`/`||r===i||r.startsWith(`/case-studies/`)&&r!==t}function he(e){let t=new Set;e instanceof HTMLAnchorElement&&t.add(e),e.querySelectorAll(`a`).forEach(e=>t.add(e));let n=e.closest(`a`);return n&&t.add(n),Array.from(t)}function ge(e){let t=e.target;t instanceof Element&&t.closest(`[data-case-study-link-disabled="john-steinbeck"]`)&&(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation())}function _e(e,t){let n=!1;return he(e).forEach(e=>{if(t.unavailable){e.removeAttribute(`href`),e.removeAttribute(`data-framer-page-link-current`),e.removeAttribute(`aria-current`),e.setAttribute(`aria-disabled`,`true`),e.setAttribute(`aria-label`,`${t.title} case study unavailable`),e.setAttribute(`data-case-study-link-disabled`,t.slug),e.tabIndex=-1,e.style.cursor=`default`,e.addEventListener(`click`,ge,!0),n=!0;return}me(e.getAttribute(`href`),t.url)&&(e.setAttribute(`href`,t.url),e.removeAttribute(`aria-disabled`),e.removeAttribute(`aria-current`),e.removeAttribute(`data-framer-page-link-current`),e.removeAttribute(`data-case-study-link-disabled`),e.style.removeProperty(`cursor`),e.setAttribute(`data-case-study-link-repaired`,t.slug),n=!0)}),n}function S(e){if(!e||n===void 0)return!1;try{let t=new URL(e,n.location.href);return t.origin===n.location.origin&&t.pathname===n.location.pathname}catch{return e===`.`||e===`./`||e===n.location.pathname}}function C(e){if(!e)return!1;if(e.startsWith(`blob:`)||e.startsWith(`data:`))return!0;if(S(e))return!1;try{let t=new URL(e,n.location.href);return/\.(mp4|mov|m4v|webm)(?:$|[?#])/i.test(t.pathname)}catch{return/\.(mp4|mov|m4v|webm)(?:$|[?#])/i.test(e)}}function w(e){return[e.currentSrc,e.src,e.getAttribute(`src`)||``,...Array.from(e.querySelectorAll(`source`)).map(e=>e.src||e.getAttribute(`src`)||``)].map(e=>e.trim()).filter(Boolean)}function T(e){return e.parentElement?.querySelector(`img[${Y}="true"]`)||null}function E(e){let t=e.getAttribute(`poster`)||``,r=e.parentElement;if(!t||!r)return!1;n.getComputedStyle(r).position===`static`&&(r.style.position=`relative`);let i=T(e);return i||(i=document.createElement(`img`),i.setAttribute(Y,`true`),i.alt=``,i.decoding=`async`,i.loading=`eager`,Object.assign(i.style,{position:`absolute`,inset:`0`,width:`100%`,height:`100%`,objectFit:`cover`,display:`block`,pointerEvents:`none`,border:`0`,zIndex:`1`}),r.appendChild(i)),i.src!==t&&(i.src=t),i.style.display=`block`,e.pause(),e.removeAttribute(`src`),e.querySelectorAll(`source`).forEach(e=>e.removeAttribute(`src`)),e.load(),e.style.display=`none`,e.style.pointerEvents=`none`,e.setAttribute(J,`true`),!0}function D(e){T(e)?.remove(),e.getAttribute(J)===`true`&&(e.removeAttribute(J),e.style.display=``,e.style.pointerEvents=``)}function O(e){let t=!1;return e.querySelectorAll(`video`).forEach(e=>{let n=w(e),r=n.some(C),i=n.some(S);if(!r&&i){t=E(e)||t;return}D(e)}),t}function k(e){let t=0;return fe(e).forEach(n=>{let r=x(n,e);r&&(_e(n,r)&&(t+=1),O(n)&&(t+=1))}),t}function A({enabled:e,collectionId:t,collectionModuleUrl:i,slugFieldId:a,titleFieldId:s}){let[c,l]=r(H);return o(()=>{if(!e||n===void 0||!m()){l(H);return}let r=!1;return ce({collectionId:t,collectionModuleUrl:i,slugFieldId:a,titleFieldId:s}).then(e=>{r||l(e.length>0?e:H)}).catch(()=>{r||l(H)}),()=>{r=!0}},[e,t,i,a,s]),c}function j(e,t){o(()=>{if(!e||n===void 0||!m())return;let r=0,i=[],a=()=>{n.cancelAnimationFrame(r),r=n.requestAnimationFrame(()=>{k(t)})};a(),K.forEach(e=>{i.push(n.setTimeout(a,e))});let o=new MutationObserver(a);return o.observe(document.body,{attributes:!0,attributeFilter:[`href`,`src`,`poster`,`style`],childList:!0,subtree:!0}),n.addEventListener(`pageshow`,a),n.addEventListener(`popstate`,a),()=>{n.cancelAnimationFrame(r),i.forEach(e=>n.clearTimeout(e)),o.disconnect(),n.removeEventListener(`pageshow`,a),n.removeEventListener(`popstate`,a)}},[e,t])}function M(){if(typeof document>`u`)return 0;let e=0;return document.querySelectorAll(`[aria-label="About MIcah Hoang"]`).forEach(t=>{t.setAttribute(`aria-label`,`About Micah Hoang`),e+=1}),document.querySelectorAll(`img[alt]`).forEach(t=>{let n=t.alt,r=n.replace(/^Simon and Schuster\b/i,`Simon & Schuster`);/^Motion Connect print\b/i.test(r)&&(r=r.replace(/^Motion Connect\b/i,`Simon & Schuster`)),r!==n&&(t.alt=r,e+=1)}),e}function N(e){o(()=>{if(!e||n===void 0)return;let t=0,r=[],i=()=>{n.cancelAnimationFrame(t),t=n.requestAnimationFrame(M)};i(),K.forEach(e=>{r.push(n.setTimeout(i,e))});let a=new MutationObserver(i);return a.observe(document.body,{attributes:!0,attributeFilter:[`alt`,`aria-label`],childList:!0,subtree:!0}),n.addEventListener(`pageshow`,i),()=>{n.cancelAnimationFrame(t),r.forEach(e=>n.clearTimeout(e)),a.disconnect(),n.removeEventListener(`pageshow`,i)}},[e])}function P(e){return String(e||``).replace(/\s+/g,``).toUpperCase()}function F(e){let t=P(e.textContent||``);return t===`MICAH.HOANG@HEY.COM`?`email`:t===`LINKEDINCONNECT`?`linkedin`:t===`COSMOSINSPIRE`?`cosmos`:``}function I(){if(typeof document>`u`||document.getElementById(X))return;let e=document.createElement(`style`);e.id=X,e.textContent=$,document.head.appendChild(e)}function ve(){if(typeof document>`u`)return 0;let e=0;return document.querySelectorAll(`a`).forEach(t=>{let n=F(t);if(!n)return;let r=t.closest(`[data-framer-name="Section CTA"], [name="Section CTA"]`),i=t.parentElement,a=t.firstElementChild,o=t.children.length>1?t.children[1]:null;!r||!i||!(a instanceof HTMLElement)||(r.setAttribute(Q.section,`true`),i.setAttribute(Q.container,`true`),t.setAttribute(Q.row,n),a.setAttribute(Q.label,`true`),o instanceof HTMLElement&&o.setAttribute(Q.meta,`true`),e+=1)}),e}function ye(e){o(()=>{if(!e||n===void 0||!te())return;let t=n;if(t[Z])return;t[Z]=!0,I();let r=0,i=[],a=()=>{n.cancelAnimationFrame(r),r=n.requestAnimationFrame(ve)};a(),[75,200,500,1e3,2e3].forEach(e=>{i.push(n.setTimeout(a,e))});let o=new MutationObserver(a);return o.observe(document.body,{attributes:!0,attributeFilter:[`data-framer-name`,`name`,`style`],childList:!0,subtree:!0}),n.addEventListener(`pageshow`,a),n.addEventListener(`resize`,a),()=>{n.cancelAnimationFrame(r),i.forEach(e=>n.clearTimeout(e)),o.disconnect(),n.removeEventListener(`pageshow`,a),n.removeEventListener(`resize`,a),delete t[Z]}},[e])}function L({enabled:e=!0,mobileFooterLayout:t=!0,collectionId:n=R,collectionModuleUrl:r=``,slugFieldId:i=z,titleFieldId:o=B,urlOverrides:c=``}){let l=A({enabled:e,collectionId:n,collectionModuleUrl:r,slugFieldId:i,titleFieldId:o});return j(e,s(()=>y(l,c),[l,c])),N(e),ye(e&&t),e?a(`div`,{"aria-hidden":`true`,style:{width:0,height:0,overflow:`hidden`,pointerEvents:`none`}}):null}var R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$,be=e((()=>{t(),c(),i(),ee(),R=`yTHrQWMIY`,z=`pdXVG_fBO`,B=`oeXZcmPna`,V=new Set([`john-steinbeck`]),H=[{title:`AirPods Pro 3`,slug:`airpods`},{title:`Simon & Schuster`,slug:`simon-schuster`},{title:`Gaia`,slug:`gaia`},{title:`National Park Playing Cards`,slug:`national-park-cards`},{title:`Motion Connect 2025`,slug:`motion-connect-2025`},{title:`Yomo`,slug:`yomo`},{title:`Highland Harvests`,slug:`highland-harvests`},{title:`Weaponized Innocence`,slug:`weaponized-innocence`},{title:`Wolff Olins x ArtCenter`,slug:`wolff-olins-x-artcenter`},{title:`Aspen Valley Landscaping`,slug:`aspen-valley-landscaping`},{title:`Cellular Symphony`,slug:`cellular-symphony`},{title:`Neon Lights`,slug:`neon-lights`},{title:`John Steinbeck`,slug:`john-steinbeck`},{title:`Seek Truth`,slug:`seek-truth`},{title:`Independent Lens`,slug:`independent-lens`},{title:`TYPLDN`,slug:`typldn`}],U=[`[data-framer-name="Card"]`,`[name="Card"]`,`a[href="./"]`,`a[href="."]`,`a[href="#"]`,`a[href*="/case-studies/"]`,`a[href^="./case-studies/"]`,`a[href^="../case-studies/"]`].join(`,`),W=[`[data-framer-name="ProjectTitle"]`,`[name="ProjectTitle"]`,`[data-framer-name="Project Title"]`,`[name="Project Title"]`,`[data-framer-name="TitleWrapper"]`,`[name="TitleWrapper"]`,`[data-framer-name="Title Wrapper"]`,`[name="Title Wrapper"]`].join(`,`),G=[`/`,`/case-studies`,`https://khaki-ship-257706.framer.app/`,`https://khaki-ship-257706.framer.app/case-studies`],K=[75,200,500,1e3,2e3,4e3],q=new Map,J=`data-case-study-invalid-video`,Y=`data-case-study-poster-fallback`,X=`case-study-mobile-footer-layout`,Z=`__caseStudyMobileFooterLayoutActive`,Q={section:`data-case-study-mobile-cta-section`,container:`data-case-study-mobile-cta-container`,row:`data-case-study-mobile-cta-row`,label:`data-case-study-mobile-cta-label`,meta:`data-case-study-mobile-cta-meta`},$=`
@media (max-width: 809px) {
    [data-case-study-mobile-cta-section="true"] {
        max-width: 100vw !important;
        overflow-x: hidden !important;
        width: 100% !important;
    }

    [data-case-study-mobile-cta-container="true"] {
        align-items: flex-start !important;
        box-sizing: border-box !important;
        gap: 10px !important;
        height: auto !important;
        max-width: 100% !important;
        min-height: 0 !important;
        padding-left: 15px !important;
        padding-right: 15px !important;
        width: 100% !important;
    }

    [data-case-study-mobile-cta-row] {
        align-items: flex-start !important;
        align-self: flex-start !important;
        box-sizing: border-box !important;
        flex: 0 0 auto !important;
        gap: 10px !important;
        height: 32px !important;
        justify-content: flex-start !important;
        max-width: calc(100vw - 30px) !important;
        min-height: 32px !important;
        padding: 0 !important;
        width: auto !important;
    }

    [data-case-study-mobile-cta-row="email"] {
        height: 34px !important;
        min-height: 34px !important;
        padding-top: 2px !important;
    }

    [data-case-study-mobile-cta-label="true"] {
        display: block !important;
        flex: 0 0 auto !important;
        height: 32px !important;
        max-width: calc(100vw - 30px) !important;
        min-height: 32px !important;
        min-width: 0 !important;
        width: auto !important;
    }

    [data-case-study-mobile-cta-label="true"] * {
        font-family: "GT Standard Trial L Md", "GT Standard Trial L Md Placeholder", "GT Standard Trial", sans-serif !important;
        font-size: 32px !important;
        font-weight: 500 !important;
        height: 32px !important;
        letter-spacing: -2px !important;
        line-height: 32px !important;
        width: auto !important;
    }

    [data-case-study-mobile-cta-label="true"] > *,
    [data-case-study-mobile-cta-label="true"] span {
        display: inline-block !important;
    }

    [data-case-study-mobile-cta-meta="true"] {
        flex: 0 0 auto !important;
        height: 13px !important;
        width: auto !important;
    }

    [data-case-study-mobile-cta-meta="true"] * {
        font-size: 13px !important;
        height: 13px !important;
        letter-spacing: -0.13px !important;
        line-height: 13px !important;
        text-transform: uppercase !important;
        width: auto !important;
    }
}
`,l(L,{enabled:{type:u.Boolean,title:`Enabled`,defaultValue:!0,enabledTitle:`On`,disabledTitle:`Off`},mobileFooterLayout:{type:u.Boolean,title:`Mobile Footer`,defaultValue:!0,enabledTitle:`On`,disabledTitle:`Off`},collectionId:{type:u.String,title:`Collection`,defaultValue:R},collectionModuleUrl:{type:u.String,title:`Module URL`,defaultValue:``,placeholder:`Optional fallback`},slugFieldId:{type:u.String,title:`Slug Field`,defaultValue:z},titleFieldId:{type:u.String,title:`Title Field`,defaultValue:B},urlOverrides:{type:u.String,title:`URL Overrides`,defaultValue:``,displayTextArea:!0,placeholder:`slug=/case-studies/custom-slug`}}),L.displayName=`Case Study Link Repair`}));export{be as n,L as t};
//# sourceMappingURL=CaseStudyLinkRepair.DrNJ_pvP.mjs.map