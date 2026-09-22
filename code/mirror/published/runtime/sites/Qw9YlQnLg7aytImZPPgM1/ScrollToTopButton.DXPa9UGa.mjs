import{t as e}from"./rolldown-runtime.Dh6celcD.mjs";import{A as t,E as n,F as r,L as i,S as a,c as o,j as s,k as c,l,o as u}from"./react.BpKPsBQp.mjs";import{C as d,H as f,o as p}from"./framer.Dxmm4ztR.mjs";function m(e){return 1-(1-e)**4}function h(e,t,n,r){let i=t=>((1-3*n+3*e)*t+(3*n-6*e))*t*t+3*e*t,a=e=>((1-3*r+3*t)*e+(3*r-6*t))*e*e+3*t*e,o=t=>(3*(1-3*n+3*e)*t+2*(3*n-6*e))*t+3*e,s=e=>{let t=e;for(let n=0;n<8;n++){let n=i(t)-e;if(Math.abs(n)<1e-6)return t;let r=o(t);if(Math.abs(r)<1e-6)break;t-=n/r}let n=0,r=1;for(t=e;n<r;){let a=i(t);if(Math.abs(a-e)<1e-6)return t;if(e>a?n=t:r=t,t=(r-n)*.5+n,Math.abs(r-n)<1e-6)break}return t};return e=>a(s(Math.min(Math.max(e,0),1)))}function g(e){let t=e.trim().match(/^cubic-bezier\(\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*\)$/i);if(!t)return m;let[,n,r,i,a]=t,o=Number(n),s=Number(r),c=Number(i),l=Number(a);return[o,s,c,l].some(e=>Number.isNaN(e))||o<0||o>1||c<0||c>1?m:h(o,s,c,l)}function _({label:e=`scroll to top`,color:r=v,scrollDuration:a=b,animationDuration:u=1.35,easing:d=y}){let f=n(null),p=c(()=>g(d),[d]);return s(()=>()=>{f.current===null||i===void 0||i.cancelAnimationFrame(f.current)},[]),l(`button`,{className:`mh-scroll-top-button`,type:`button`,"aria-label":e,onClick:t(()=>{if(i===void 0)return;let e=i.matchMedia?.(`(prefers-reduced-motion: reduce)`)?.matches;f.current!==null&&i.cancelAnimationFrame(f.current);let t=i.scrollY||document.documentElement.scrollTop||0;if(e||t<=0){i.scrollTo(0,0),f.current=null;return}let n=Math.max(250,a),r=i.__mhLenis;if(r&&typeof r.scrollTo==`function`){r.scrollTo(0,{duration:n/1e3,easing:p,force:!0}),f.current=null;return}let o=i.performance.now(),s=t,c=e=>{let t=e-o,r=Math.min(Math.max(t/n,0),1),a=p(r),l=Math.max(0,Math.round(s-s*a));i.scrollTo({top:l,behavior:`auto`}),r<1&&l>0?f.current=i.requestAnimationFrame(c):(i.scrollTo({top:0,behavior:`auto`}),f.current=null)};f.current=i.requestAnimationFrame(c)},[a,p]),style:{width:`fit-content`,height:`${x}px`,display:`inline-flex`,alignItems:`center`,justifyContent:`center`,gap:`6px`,padding:0,margin:0,border:0,background:`transparent`,color:r,cursor:`pointer`,fontFamily:`'GT Standard Mono', 'GT Standard Mono Regular', 'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace`,fontSize:`13px`,fontWeight:400,lineHeight:`${x}px`,letterSpacing:`-0.01em`,textTransform:`uppercase`,WebkitFontSmoothing:`antialiased`,MozOsxFontSmoothing:`grayscale`},children:[o(`span`,{className:`mh-scroll-top-label-mask`,style:{height:`${x}px`,display:`inline-block`,overflow:`hidden`,lineHeight:`${x}px`,verticalAlign:`middle`},children:l(`span`,{className:`mh-scroll-top-label-rail`,children:[o(`span`,{children:e}),o(`span`,{children:e})]})}),o(`span`,{"aria-hidden":`true`,style:{width:`1em`,height:`${x}px`,display:`inline-block`,overflow:`hidden`,lineHeight:`${x}px`,textAlign:`center`,verticalAlign:`middle`},children:l(`span`,{className:`mh-scroll-top-arrow-rail`,style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`${S}px`,animation:`mh-scroll-top-arrow ${u}s ${d} infinite`},children:[o(`span`,{children:`↑`}),o(`span`,{children:`↑`}),o(`span`,{children:`↑`})]})}),o(`style`,{children:`
                .mh-scroll-top-label-rail,
                .mh-scroll-top-arrow-rail {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .mh-scroll-top-label-rail {
                    gap: ${S}px;
                    transform: translateY(0);
                    transition: transform 500ms ${y};
                }

                .mh-scroll-top-label-rail span,
                .mh-scroll-top-arrow-rail span {
                    height: ${x}px;
                    flex: 0 0 ${x}px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: ${x}px;
                    white-space: nowrap;
                }

                .mh-scroll-top-button:hover .mh-scroll-top-label-rail,
                .mh-scroll-top-button:focus-visible .mh-scroll-top-label-rail {
                    transform: translateY(-${C}px);
                }

                .mh-scroll-top-button:focus-visible {
                    outline: 1px solid currentColor;
                    outline-offset: 4px;
                }

                @keyframes mh-scroll-top-arrow {
                    0%, 18% {
                        transform: translateY(-${C}px);
                    }
                    62%, 100% {
                        transform: translateY(-${C*2}px);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .mh-scroll-top-label-rail,
                    .mh-scroll-top-arrow-rail {
                        animation: none !important;
                        transition: none !important;
                    }

                    .mh-scroll-top-label-rail {
                        transform: none !important;
                    }

                    .mh-scroll-top-arrow-rail {
                        transform: translateY(-${C}px) !important;
                    }
                }
            `})]})}var v,y,b,x,S,C,w=e((()=>{r(),u(),a(),f(),v=`#233324`,y=`cubic-bezier(0.16, 1, 0.3, 1)`,b=900,x=16,S=4,C=20,d(_,{label:{type:p.String,title:`Label`,defaultValue:`scroll to top`},color:{type:p.Color,title:`Color`,defaultValue:v},scrollDuration:{type:p.Number,title:`Scroll`,defaultValue:b,min:250,max:1800,step:50,unit:`ms`},animationDuration:{type:p.Number,title:`Arrow`,defaultValue:1.35,min:.4,max:3,step:.05,unit:`s`},easing:{type:p.String,title:`Easing`,defaultValue:y}})}));export{w as n,_ as t};
//# sourceMappingURL=ScrollToTopButton.DXPa9UGa.mjs.map