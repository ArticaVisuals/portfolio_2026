// @ts-nocheck
import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import PageTransitionV712 from "https://framer.com/m/PageTransitionRuntime-0yRcqO.js@nBkdxEuAmy8SV9MpeZjc"
import ParagraphPrettyWrap from "https://framer.com/m/ParagraphPrettyWrap-bvfOg4.js"

const HOME_PATH = "/"
const BOOT_ID = "__pt-boot"
const BOOT_LABEL_ID = "__pt-boot-label"
const BOOT_VIEWPORT_STYLE_ID = "mh-boot-viewport-guard"
const BOOT_VIEWPORT_GLOBAL_KEY = "__mhBootViewportGuardInit"
const BOOT_FIRST_PAINT_ID = "__pt-first-paint"
const PAGE_THEME_COLOR = "#F7F5F0"
const DEFAULT_BOOT_COLOR = "#233324"
// Below this width the boot curtain is hidden entirely (Framer's Phone
// breakpoint is < 810px). See BOOT DISABLED ON MOBILE note below.
const BOOT_DISABLE_MAX_WIDTH_PX = 809
const HOME_HEADER_BOTTOM_SELECTOR = '[data-framer-name="Header Bottom"]'
const HOME_HEADER_BOTTOM_APPEAR_SELECTOR = `${HOME_HEADER_BOTTOM_SELECTOR} [data-framer-appear-id]`
const HOME_HEADER_BOTTOM_STYLE_ID = "mh-home-header-bottom-appear-recovery"
const HOME_HEADER_BOTTOM_RECOVERY_MS = 5200
const HOME_HEADER_BOTTOM_RECOVERY_INTERVAL_MS = 80
const HISTORY_PATCH_KEY = "__mhHomeHeaderBottomHistoryPatched"
let homeHeaderBottomRecoveryCleanup = null

// Boot curtain (#__pt-boot, created by the compiled module).
//
// BOOT DISABLED ON MOBILE (2026-07-23): on iOS the curtain repeatedly left a
// hard-edged green bar across the bottom of the viewport that outlived the
// swipe-away. It was never reproducible outside a real iPhone, so rather than
// keep guessing we hide the curtain below BOOT_DISABLE_MAX_WIDTH_PX. Mobile
// loads straight into the page; desktop keeps the full curtain, which is
// verified working. To restore it on mobile, delete the `@media (max-width:...)`
// rule from BOTH css strings below.
//
// NO DOUBLE APPEAR ON MOBILE: the compiled module's boot sequence calls
// window.__ptReplayAppear() to RESTART every appear animation ("restart all
// appear effects while still fully covered, so the page is revealed
// mid-animation"). With the curtain up that first pass is hidden, so you only
// ever see the replay. With the curtain disabled on mobile you would see BOTH —
// the hero visibly animating in twice. So below the same breakpoint we install a
// no-op __ptReplayAppear (via a defineProperty getter/setter so the module's own
// assignment is swallowed), leaving exactly one appear pass. Desktop is
// untouched. If the hero ever fails to appear on mobile, this is the first thing
// to suspect — remove the suppression and the replay comes back.
//
// SIZING (desktop) — mirrors zitafernandez.com's loader EXACTLY, because that
// site has no bottom gap on iOS:
//     position: fixed; top:0; left:0; right:0; bottom:auto;
//     width:100%; height:100dvh; min-height:100dvh;
// The critical part is that the height is a CSS `dvh` unit, NOT a pixel value.
// `dvh` is the dynamic viewport unit: the engine re-evaluates it continuously as
// the iOS URL bar / toolbar animates, so the curtain always equals the visible
// area. An earlier version of this guard computed a PIXEL height in JS from
// window.innerHeight and wrote it inline — on iOS that is a snapshot taken while
// the toolbar is in one state and goes stale as it animates (re-syncs are
// event-driven and fire late), which is exactly what left the bottom gap.
// Do NOT reintroduce JS pixel heights, insets, or overscan here; let CSS dvh do
// it. `bottom:auto` is intentional (height alone defines the box).
//
// TINT: the bands behind Safari's status bar and bottom toolbar are browser
// chrome, not the page (this site's viewport meta has no viewport-fit=cover), so
// nothing can paint there. theme-color is pinned to the page colour so that
// chrome never flashes or lingers green.
const BOOT_VIEWPORT_GUARD_JS = `(function(){try{if(window.${BOOT_VIEWPORT_GLOBAL_KEY})return;window.${BOOT_VIEWPORT_GLOBAL_KEY}=true;try{if((window.innerWidth||document.documentElement.clientWidth||0)<=${BOOT_DISABLE_MAX_WIDTH_PX}){var __ptNoReplay=function(){};Object.defineProperty(window,"__ptReplayAppear",{configurable:true,get:function(){return __ptNoReplay},set:function(){}})}}catch(e){}var BOOT_ID=${JSON.stringify(BOOT_ID)};var LABEL_ID=${JSON.stringify(BOOT_LABEL_ID)};var STYLE_ID=${JSON.stringify(BOOT_VIEWPORT_STYLE_ID)};var PAGE_COLOR=${JSON.stringify(PAGE_THEME_COLOR)};function ensureStyle(){var s=document.getElementById(STYLE_ID);if(!s){s=document.createElement("style");s.id=STYLE_ID;(document.head||document.documentElement).appendChild(s)}var css="html{background:"+PAGE_COLOR+"!important;}html body{background:"+PAGE_COLOR+"!important;}#"+BOOT_ID+"{position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:auto!important;width:100%!important;height:100vh!important;min-height:100vh!important;}#"+LABEL_ID+"{top:0!important;bottom:auto!important;height:100vh!important;min-height:100vh!important;}@supports (height:100dvh){#"+BOOT_ID+"{height:100dvh!important;min-height:100dvh!important;}#"+LABEL_ID+"{height:100dvh!important;min-height:100dvh!important;}}@media (hover: none),(pointer: coarse){nav a[href]>*:nth-child(n+2){visibility:hidden!important;}}@media (max-width:${BOOT_DISABLE_MAX_WIDTH_PX}px){#"+BOOT_ID+",#"+LABEL_ID+"{display:none!important;}}";if(s.textContent!==css)s.textContent=css}function themeSync(){try{var m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement("meta");m.setAttribute("name","theme-color");(document.head||document.documentElement).appendChild(m)}if(m.getAttribute("content")!==PAGE_COLOR)m.setAttribute("content",PAGE_COLOR)}catch(e){}}function sync(){ensureStyle();themeSync()}sync();requestAnimationFrame(sync);setTimeout(sync,50);setTimeout(sync,250);window.addEventListener("resize",sync,{passive:true});window.addEventListener("orientationchange",sync,{passive:true});window.addEventListener("pageshow",sync,{passive:true});window.addEventListener("popstate",sync,{passive:true});window.addEventListener("hashchange",sync,{passive:true});window.addEventListener("pt:reveal",sync);window.addEventListener("mh:locationchange",sync);if(window.visualViewport){window.visualViewport.addEventListener("resize",sync,{passive:true});window.visualViewport.addEventListener("scroll",sync,{passive:true})}if(typeof MutationObserver!=="undefined"){new MutationObserver(sync).observe(document.documentElement,{childList:true,subtree:true})}}catch(e){}})();`

// Original Figma SVG, node 91:521, rendered as DOM vectors in both loader stages.
// The copyright uses its original outline with fill + stroke in one path.
// This avoids antialiasing seams from the export's masked outer-stroke layers.
// Roughly 2x the previous footprint, with whole-pixel desktop/tablet widths.
// Regenerate the Framer Preloaders head entry with `node code/tools/sync-boot-head.mjs`.
const BOOT_WORDMARK_SVG = "<svg preserveAspectRatio=\"none\" overflow=\"visible\" style=\"display: block;\" width=\"7682.3\" height=\"1025.01\" viewBox=\"0 0 7682.3 1025.01\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n<g id=\"Group 52\">\n<g id=\"Micah Hoang\">\n<path id=\"Vector\" d=\"M7394.23 1025.01C7234.32 1025.01 7124.3 942.219 7118.63 827.67H7253.6C7261.54 876.439 7317.11 912.731 7394.23 912.731C7487.23 912.731 7549.61 866.231 7549.61 767.561V708.585C7512.18 766.426 7440.73 799.317 7364.74 799.317C7200.29 799.317 7095.95 676.829 7095.95 510.109C7095.95 339.987 7201.43 219.768 7364.74 219.768C7443 219.768 7512.18 251.524 7549.61 309.365V236.78H7682.3V760.756C7682.3 936.549 7573.43 1025.01 7394.23 1025.01ZM7391.96 685.902C7484.96 685.902 7551.88 620.121 7551.88 508.975C7551.88 397.829 7483.83 332.048 7391.96 332.048C7297.83 332.048 7230.91 398.963 7230.91 508.975C7230.91 620.121 7297.83 685.902 7391.96 685.902Z\" fill=\"black\"/>\n<path id=\"Vector_2\" d=\"M6478.05 819.866V235.78H6606.21V306.097C6639.1 250.524 6707.15 218.768 6783.14 218.768C6907.89 218.768 6999.76 287.951 6999.76 454.671V819.866H6865.93V480.756C6865.93 390.024 6820.56 342.39 6744.58 342.39C6659.51 342.39 6611.88 400.232 6611.88 486.427V819.866H6478.05Z\" fill=\"black\"/>\n<path id=\"Vector_3\" d=\"M6026.36 836.878C5906.15 836.878 5819.95 768.829 5819.95 659.951C5819.95 553.341 5895.94 497.768 5996.88 479.622L6137.51 454.671C6178.34 447.866 6202.16 434.256 6202.16 397.963C6202.16 354.866 6165.86 326.512 6096.68 326.512C6033.17 326.512 5978.73 353.732 5973.06 416.11H5836.96C5844.9 293.622 5954.91 218.768 6095.55 218.768C6258.86 218.768 6334.85 299.292 6334.85 403.634V672.427C6334.85 704.183 6351.86 713.256 6371.15 713.256C6381.35 713.256 6390.43 712.122 6399.5 709.854V815.329C6377.95 824.403 6350.73 831.207 6316.71 831.207C6265.67 831.207 6225.97 811.927 6208.96 763.159C6174.94 798.317 6119.36 836.878 6026.36 836.878ZM6058.12 729.134C6140.91 729.134 6202.16 680.366 6202.16 611.183V529.524C6193.08 539.732 6163.6 548.805 6126.17 555.61L6041.11 571.488C5983.27 582.829 5956.05 608.915 5956.05 653.146C5956.05 703.049 5999.14 729.134 6058.12 729.134Z\" fill=\"black\"/>\n<path id=\"Vector_4\" d=\"M5451.58 836.878C5266.72 836.878 5146.5 709.854 5146.5 527.256C5146.5 345.793 5266.72 218.768 5451.58 218.768C5636.45 218.768 5756.67 345.793 5756.67 527.256C5756.67 709.854 5636.45 836.878 5451.58 836.878ZM5451.58 715.524C5553.66 715.524 5621.7 646.341 5621.7 527.256C5621.7 408.171 5552.52 340.122 5451.58 340.122C5350.64 340.122 5282.59 409.305 5282.59 527.256C5282.59 647.476 5350.64 715.524 5451.58 715.524Z\" fill=\"black\"/>\n<path id=\"Vector_5\" d=\"M4401.22 820.867V21.293H4540.72V339.988H4917.26V21.293H5056.76V820.867H4917.26V471.549H4540.72V820.867H4401.22Z\" fill=\"black\"/>\n<path id=\"Vector_6\" d=\"M3541.35 820.867V21.293H3675.18V300.293C3706.94 250.391 3773.85 219.769 3846.44 219.769C3971.19 219.769 4063.06 288.952 4063.06 455.671V820.867H3929.23V481.757C3929.23 391.025 3885 343.391 3809.01 343.391C3723.95 343.391 3675.18 401.232 3675.18 487.427V820.867H3541.35Z\" fill=\"black\"/>\n<path id=\"Vector_7\" d=\"M3078.67 837.878C2958.45 837.878 2872.25 769.829 2872.25 660.951C2872.25 554.341 2948.24 498.768 3049.18 480.622L3189.82 455.671C3230.65 448.866 3254.46 435.256 3254.46 398.963C3254.46 355.866 3218.17 327.512 3148.99 327.512C3085.47 327.512 3031.04 354.732 3025.36 417.11H2889.27C2897.21 294.622 3007.22 219.768 3147.85 219.768C3311.17 219.768 3387.16 300.292 3387.16 404.634V673.427C3387.16 705.183 3404.17 714.256 3423.45 714.256C3433.66 714.256 3442.73 713.122 3451.8 710.854V816.329C3430.26 825.403 3403.04 832.207 3369.01 832.207C3317.97 832.207 3278.28 812.927 3261.27 764.159C3227.24 799.317 3171.67 837.878 3078.67 837.878ZM3110.43 730.134C3193.22 730.134 3254.46 681.366 3254.46 612.183V530.524C3245.39 540.732 3215.9 549.805 3178.47 556.61L3093.41 572.488C3035.57 583.829 3008.35 609.915 3008.35 654.146C3008.35 704.049 3051.45 730.134 3110.43 730.134Z\" fill=\"black\"/>\n<path id=\"Vector_8\" d=\"M2517.66 837.878C2338.47 837.878 2219.38 707.451 2219.38 528.256C2219.38 349.061 2337.34 219.768 2522.2 219.768C2691.19 219.768 2792.13 332.049 2800.07 463.61H2663.97C2651.49 381.951 2591.38 341.122 2518.8 341.122C2418.99 341.122 2355.48 409.171 2355.48 528.256C2355.48 648.476 2420.13 716.524 2518.8 716.524C2591.38 716.524 2648.09 683.634 2663.97 596.305H2800.07C2787.59 726.732 2693.46 837.878 2517.66 837.878Z\" fill=\"black\"/>\n<path id=\"Vector_9\" d=\"M1992.02 820.866V236.781H2125.85V820.866H1992.02ZM2057.8 167.598C2011.3 167.598 1976.14 131.305 1976.14 84.8049C1976.14 37.1708 2011.3 2.01217 2057.8 2.01217C2105.44 2.01217 2141.73 38.3049 2141.73 84.8049C2141.73 132.439 2105.44 167.598 2057.8 167.598Z\" fill=\"black\"/>\n<path id=\"Vector_10\" d=\"M1012.07 820.867V21.293H1195.8L1372.73 477.22L1440.78 655.281L1507.69 477.22L1684.62 21.293H1869.49V820.867H1739.06V357.001V210.696L1682.35 357.001L1571.21 632.598L1498.62 820.867H1381.8L1309.22 632.598L1198.07 357.001L1142.5 210.696V357.001V820.867H1012.07Z\" fill=\"black\"/>\n</g>\n<g id=\"&#194;&#169;\">\n<path d=\"M428.122 843.387C351.927 843.387 281.764 825.291 217.632 789.098C153.501 752.905 102.704 703.061 65.2417 639.564C28.4139 576.068 10 504.953 10 426.217C10 347.482 28.4139 276.366 65.2417 212.87C102.704 149.374 153.501 99.847 217.632 64.2892C281.764 28.0964 351.927 10 428.122 10C503.683 10 573.211 28.0964 636.707 64.2892C700.838 100.482 751.318 150.327 788.145 213.823C825.608 277.319 844.339 348.117 844.339 426.217C844.339 504.953 825.608 576.386 788.145 640.517C751.318 704.013 701.156 753.54 637.659 789.098C574.163 825.291 504.318 843.387 428.122 843.387ZM428.122 776.716C491.618 776.716 549.717 761.477 602.419 730.999C655.121 700.521 696.711 658.613 727.189 605.276C757.667 551.305 772.906 491.618 772.906 426.217C772.906 360.181 757.667 300.812 727.189 248.111C696.711 194.774 655.121 152.866 602.419 122.388C549.717 91.91 491.618 76.671 428.122 76.671C363.991 76.671 305.575 91.91 252.873 122.388C200.171 152.231 158.581 193.821 128.103 247.158C97.6247 300.495 82.3856 360.181 82.3856 426.217C82.3856 492.253 97.6247 551.94 128.103 605.276C158.581 658.613 200.171 700.521 252.873 730.999C305.575 761.477 363.991 776.716 428.122 776.716ZM431.932 649.089C390.659 649.089 353.514 639.564 320.496 620.516C288.113 600.832 262.715 573.846 244.301 539.558C226.522 504.635 217.632 464.95 217.632 420.503C217.632 376.055 226.522 336.688 244.301 302.4C262.715 268.112 288.113 241.443 320.496 222.395C353.514 203.346 390.659 193.821 431.932 193.821C469.395 193.821 502.73 200.806 531.938 214.775C561.147 228.744 584.323 248.428 601.467 273.827C618.611 298.59 628.135 326.846 630.04 358.594H549.082C537.653 297.638 498.603 267.159 431.932 267.159C389.39 267.159 356.689 280.176 333.83 306.21C311.607 332.243 300.495 370.341 300.495 420.503C300.495 470.665 311.924 509.08 334.783 535.748C357.641 561.782 390.024 574.798 431.932 574.798C501.143 574.798 540.193 544.32 549.082 483.364H630.04C627.5 515.112 617.341 543.685 599.562 569.084C582.418 593.847 559.242 613.531 530.033 628.135C500.825 642.104 468.125 649.089 431.932 649.089Z\" stroke-width=\"20\" stroke=\"black\" fill=\"black\"/>\n</g>\n</g>\n</svg>"
const BOOT_PRESENTATION_CSS = `
html #${BOOT_LABEL_ID}{font-size:0!important;}
html #${BOOT_LABEL_ID}>svg,html #${BOOT_FIRST_PAINT_ID}>svg{display:block;width:556px;height:auto;max-width:calc(100vw - 64px);flex:none;}
html #${BOOT_LABEL_ID}>svg [fill="black"],html #${BOOT_FIRST_PAINT_ID}>svg [fill="black"]{fill:currentColor;}
html #${BOOT_LABEL_ID}>svg [stroke="black"],html #${BOOT_FIRST_PAINT_ID}>svg [stroke="black"]{stroke:currentColor;}
@media(max-width:1199px){html #${BOOT_LABEL_ID}>svg,html #${BOOT_FIRST_PAINT_ID}>svg{width:444px;}}
`
const BOOT_FIRST_PAINT_CSS = `
#${BOOT_FIRST_PAINT_ID}{position:fixed;top:0;right:0;bottom:auto;left:0;width:100%;height:100vh;min-height:100vh;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:32px;background:${DEFAULT_BOOT_COLOR};color:${PAGE_THEME_COLOR};z-index:2147483599;pointer-events:none;}
@supports(height:100dvh){#${BOOT_FIRST_PAINT_ID}{height:100dvh;min-height:100dvh;}}
@media(max-width:${BOOT_DISABLE_MAX_WIDTH_PX}px),(prefers-reduced-motion:reduce){#${BOOT_FIRST_PAINT_ID}{display:none;}}
`
const BOOT_FIRST_PAINT_GUARD_JS = `(function () {
  try {
    var path = (location.pathname || "/").replace(/\\/+$/, "") || "/";
    var width = window.innerWidth || document.documentElement.clientWidth || 0;
    var reduced = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    var nav = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
    var navType = nav ? nav.type : "navigate";
    var fresh = navType === "reload";
    if (!fresh && navType === "navigate") {
      var ref = document.referrer;
      fresh = !ref;
      try { if (ref) fresh = new URL(ref).origin !== location.origin; } catch (_) { fresh = true; }
    }
    if (path !== "/" || width <= ${BOOT_DISABLE_MAX_WIDTH_PX} || reduced || !fresh || document.prerendering) return;

    var parent = document.head || document.documentElement;
    var presentationId = "mh-boot-presentation";
    if (!document.getElementById(presentationId)) {
      var presentation = document.createElement("style");
      presentation.id = presentationId;
      presentation.textContent = ${JSON.stringify(BOOT_PRESENTATION_CSS)};
      parent.appendChild(presentation);
    }
    var wordmark = ${JSON.stringify(BOOT_WORDMARK_SVG)};
    var coverId = ${JSON.stringify(BOOT_FIRST_PAINT_ID)};
    var bootId = ${JSON.stringify(BOOT_ID)};
    var existingBoot = document.getElementById(bootId);
    if (existingBoot) { installWordmark(); holdBootVideos(existingBoot); return; }
    if (document.getElementById(coverId)) return;
    var coverStyle = document.createElement("style");
    coverStyle.id = coverId + "-style";
    coverStyle.textContent = ${JSON.stringify(BOOT_FIRST_PAINT_CSS)};
    parent.appendChild(coverStyle);
    var cover = document.createElement("div");
    cover.id = coverId;
    cover.setAttribute("aria-hidden", "true");
    cover.innerHTML = wordmark;
    document.documentElement.appendChild(cover);

    var observer = null;
    var released = false;
    var fallbackTimer = 0;
    function installWordmark() {
      var label = document.getElementById(${JSON.stringify(BOOT_LABEL_ID)});
      if (label && !label.querySelector("svg")) label.innerHTML = wordmark;
    }
    function holdBootVideos(boot) {
      if (typeof window.__mhBootVideoHold === "boolean") return;
      window.__mhBootVideoHold = true;
      var videoObserver = null;
      var videoTimer = 0;
      var videoSelector = "video.selected-work-video";
      function pauseVideo(event) {
        var video = event.target;
        if (video && video.matches && video.matches(videoSelector)) video.pause();
      }
      function resumeVideos() {
        if (!window.__mhBootVideoHold) return;
        window.__mhBootVideoHold = false;
        document.removeEventListener("play", pauseVideo, true);
        document.removeEventListener("playing", pauseVideo, true);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pagehide", resumeVideos);
        if (videoObserver) videoObserver.disconnect();
        clearTimeout(videoTimer);
        window.dispatchEvent(new Event("mh:boot-complete"));
      }
      function onResize() {
        if (window.innerWidth <= ${BOOT_DISABLE_MAX_WIDTH_PX}) resumeVideos();
      }
      // Native autoplay bypasses play() helpers. Hold its events too, so video
      // compositing cannot pull the curtain down to the media's 30fps cadence.
      document.addEventListener("play", pauseVideo, true);
      document.addEventListener("playing", pauseVideo, true);
      document.querySelectorAll(videoSelector).forEach(function (video) { video.pause(); });
      window.addEventListener("resize", onResize, {passive:true});
      window.addEventListener("pagehide", resumeVideos, {once:true});
      videoObserver = new MutationObserver(function () {
        if (!boot.isConnected) resumeVideos();
      });
      videoObserver.observe(document.documentElement, {childList:true});
      videoTimer = setTimeout(resumeVideos, 12000);
    }
    function release() {
      if (released) return;
      released = true;
      if (observer) observer.disconnect();
      document.removeEventListener("DOMContentLoaded", releaseAfterReady);
      clearTimeout(fallbackTimer);
      if (cover.parentNode) cover.parentNode.removeChild(cover);
      if (coverStyle.parentNode) coverStyle.parentNode.removeChild(coverStyle);
    }
    function handoff() {
      var boot = document.getElementById(bootId);
      if (!boot) return false;
      installWordmark();
      holdBootVideos(boot);
      release();
      return true;
    }
    function releaseAfterReady() {
      fallbackTimer = setTimeout(function () { if (!handoff()) release(); }, 0);
    }
    if (typeof MutationObserver !== "undefined") {
      observer = new MutationObserver(handoff);
      observer.observe(document.documentElement, {childList:true, subtree:true});
    }
    if (handoff()) return;
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", releaseAfterReady, {once:true});
    else releaseAfterReady();
  } catch (_) {
    var stale = document.getElementById(${JSON.stringify(BOOT_FIRST_PAINT_ID)});
    if (stale && stale.parentNode) stale.parentNode.removeChild(stale);
    var staleStyle = document.getElementById(${JSON.stringify(BOOT_FIRST_PAINT_ID)} + "-style");
    if (staleStyle && staleStyle.parentNode) staleStyle.parentNode.removeChild(staleStyle);
  }
})();`


function ensureBootViewportStyle() {
    try {
        let style = document.getElementById(BOOT_VIEWPORT_STYLE_ID)
        if (!style) {
            const parent = document.head || document.documentElement
            style = document.createElement("style")
            style.id = BOOT_VIEWPORT_STYLE_ID
            parent.appendChild(style)
        }
        const css = `html{background:${PAGE_THEME_COLOR}!important;}html body{background:${PAGE_THEME_COLOR}!important;}#${BOOT_ID}{position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:auto!important;width:100%!important;height:100vh!important;min-height:100vh!important;}#${BOOT_LABEL_ID}{top:0!important;bottom:auto!important;height:100vh!important;min-height:100vh!important;}@supports (height:100dvh){#${BOOT_ID}{height:100dvh!important;min-height:100dvh!important;}#${BOOT_LABEL_ID}{height:100dvh!important;min-height:100dvh!important;}}@media (hover: none),(pointer: coarse){nav a[href]>*:nth-child(n+2){visibility:hidden!important;}}@media (max-width:${BOOT_DISABLE_MAX_WIDTH_PX}px){#${BOOT_ID},#${BOOT_LABEL_ID}{display:none!important;}}`
        if (style.textContent !== css) style.textContent = css
    } catch (err) {}
}

// Pin Safari's chrome tint to the page colour so it never flashes/lingers green.
function syncBootThemeColor() {
    try {
        let meta = document.querySelector('meta[name="theme-color"]')
        if (!meta) {
            meta = document.createElement("meta")
            meta.setAttribute("name", "theme-color")
            ;(document.head || document.documentElement).appendChild(meta)
        }
        if (meta.getAttribute("content") !== PAGE_THEME_COLOR)
            meta.setAttribute("content", PAGE_THEME_COLOR)
    } catch (err) {}
}

// CSS-only sizing: no pixel writes, nothing to go stale.
function syncBootViewport() {
    if (typeof window === "undefined") return
    ensureBootViewportStyle()
    syncBootThemeColor()
}

function installBootViewportGuard() {
    if (typeof window === "undefined") return
    try {
        if (window[BOOT_VIEWPORT_GLOBAL_KEY]) {
            syncBootViewport()
            return
        }
        window[BOOT_VIEWPORT_GLOBAL_KEY] = true

        syncBootViewport()
        window.requestAnimationFrame(syncBootViewport)
        window.setTimeout(syncBootViewport, 50)
        window.setTimeout(syncBootViewport, 250)
        window.addEventListener("resize", syncBootViewport, { passive: true })
        window.addEventListener("orientationchange", syncBootViewport, {
            passive: true,
        })
        window.addEventListener("pageshow", syncBootViewport, { passive: true })
        window.addEventListener("popstate", syncBootViewport, { passive: true })
        window.addEventListener("hashchange", syncBootViewport, {
            passive: true,
        })
        window.addEventListener("pt:reveal", syncBootViewport)
        window.addEventListener("mh:locationchange", syncBootViewport)
        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", syncBootViewport, {
                passive: true,
            })
            window.visualViewport.addEventListener("scroll", syncBootViewport, {
                passive: true,
            })
        }
        if (typeof MutationObserver !== "undefined") {
            new MutationObserver(syncBootViewport).observe(
                document.documentElement,
                { childList: true, subtree: true }
            )
        }
    } catch (err) {}
}

const SELECTED_WORK_VIDEO_SELECTOR = "video.selected-work-video"
const SELECTED_WORK_VIDEO_GLOBAL_KEY = "__mhSelectedWorkVideoAutoplayInit"

// iOS blocks inline autoplay unless a video is provably muted + inline at play
// time, and it paints a play-button glyph over any paused inline video. The
// home thumbnail videos already carry the right React props and autoplay on
// desktop, but on iOS the muted attribute / first play() can be missed, so they
// sit paused with the glyph. Here we harden each selected-work video (muted +
// playsinline attributes set imperatively) and kick play() whenever it is on
// screen — on mount, on a short timer ladder, via an IntersectionObserver, and
// on the first touch (covers strict / low-power policies). Off-screen videos
// are left alone for HomeSelectedWorkGrid to pause.
function installSelectedWorkVideoAutoplay() {
    if (typeof window === "undefined" || typeof document === "undefined") return
    try {
        if (window[SELECTED_WORK_VIDEO_GLOBAL_KEY]) return
        window[SELECTED_WORK_VIDEO_GLOBAL_KEY] = true

        const inView = (el) => {
            const r = el.getBoundingClientRect()
            const h = window.innerHeight || document.documentElement.clientHeight
            const w = window.innerWidth || document.documentElement.clientWidth
            return r.bottom > 0 && r.right > 0 && r.top < h && r.left < w
        }
        const harden = (v) => {
            try {
                v.muted = true
                v.defaultMuted = true
                v.setAttribute("muted", "")
                v.setAttribute("playsinline", "")
                v.setAttribute("webkit-playsinline", "true")
                if (!v.hasAttribute("preload")) v.setAttribute("preload", "auto")
            } catch (err) {}
        }
        const play = (v) => {
            if (window.__mhBootVideoHold) return
            try {
                const p = v.play()
                if (p && typeof p.catch === "function") p.catch(() => {})
            } catch (err) {}
        }
        const kick = (v, force) => {
            harden(v)
            if (force || inView(v)) play(v)
        }
        const sweep = (force) => {
            try {
                document
                    .querySelectorAll(SELECTED_WORK_VIDEO_SELECTOR)
                    .forEach((v) => kick(v, force))
            } catch (err) {}
        }
        window.addEventListener("mh:boot-complete", () => {
            const resumeWhenVisible = () => {
                if (document.visibilityState === "hidden") return
                document.removeEventListener("visibilitychange", resumeWhenVisible)
                window.removeEventListener("pageshow", resumeWhenVisible)
                if (isHomePath()) sweep(false)
            }
            if (document.visibilityState === "hidden") {
                document.addEventListener("visibilitychange", resumeWhenVisible)
                window.addEventListener("pageshow", resumeWhenVisible)
            } else resumeWhenVisible()
        }, { once: true })

        let io = null
        if (typeof IntersectionObserver !== "undefined") {
            io = new IntersectionObserver(
                (entries) => {
                    entries.forEach((e) => {
                        if (e.isIntersecting) kick(e.target, true)
                    })
                },
                { threshold: 0.05 }
            )
        }
        const observed = new WeakSet()
        const observeAll = () => {
            try {
                document
                    .querySelectorAll(SELECTED_WORK_VIDEO_SELECTOR)
                    .forEach((v) => {
                        harden(v)
                        if (io && !observed.has(v)) {
                            observed.add(v)
                            io.observe(v)
                        }
                    })
            } catch (err) {}
        }

        sweep(false)
        observeAll()
        window.requestAnimationFrame(() => {
            sweep(false)
            observeAll()
        })
        ;[250, 1000, 2500].forEach((ms) =>
            window.setTimeout(() => {
                sweep(false)
                observeAll()
            }, ms)
        )

        if (typeof MutationObserver !== "undefined") {
            new MutationObserver(() => observeAll()).observe(document.body, {
                childList: true,
                subtree: true,
            })
        }

        const onFirstTouch = () => {
            sweep(false)
            window.removeEventListener("touchstart", onFirstTouch)
            window.removeEventListener("pointerdown", onFirstTouch)
        }
        window.addEventListener("touchstart", onFirstTouch, { passive: true })
        window.addEventListener("pointerdown", onFirstTouch, { passive: true })
    } catch (err) {}
}

function useBootViewportGuard() {
    React.useEffect(() => {
        installBootViewportGuard()
        installSelectedWorkVideoAutoplay()
    }, [])
}

function isHomePath() {
    try {
        const path = window.location.pathname.replace(/\/+$/, "") || "/"
        return path === HOME_PATH
    } catch (err) {
        return false
    }
}

function removeHomeHeaderBottomRecoveryStyle() {
    try {
        const style = document.getElementById(HOME_HEADER_BOTTOM_STYLE_ID)
        if (style) style.remove()
    } catch (err) {}
}

function ensureHomeHeaderBottomRecoveryStyle() {
    if (!isHomePath()) {
        removeHomeHeaderBottomRecoveryStyle()
        return
    }

    try {
        let style = document.getElementById(HOME_HEADER_BOTTOM_STYLE_ID)
        if (!style) {
            const parent =
                document.head || document.documentElement || document.body
            if (!parent) return
            style = document.createElement("style")
            style.id = HOME_HEADER_BOTTOM_STYLE_ID
            parent.appendChild(style)
        }

        const css = `${HOME_HEADER_BOTTOM_APPEAR_SELECTOR}{opacity:1!important;transform:none!important;visibility:visible!important;}`
        if (style.textContent !== css) style.textContent = css
    } catch (err) {}
}

function getHomeHeaderBottomAppearEls(roots = null) {
    if (!isHomePath()) return []
    try {
        if (roots) {
            return roots.flatMap((root) =>
                Array.from(root.querySelectorAll("[data-framer-appear-id]"))
            )
        }
        return Array.from(
            document.querySelectorAll(HOME_HEADER_BOTTOM_APPEAR_SELECTOR)
        )
    } catch (err) {
        return []
    }
}

function isViewTransitionAnimation(animation) {
    try {
        const pseudo = animation.effect && animation.effect.pseudoElement
        return !!pseudo && pseudo.indexOf("::view-transition") === 0
    } catch (err) {
        return false
    }
}

function revealHomeHeaderBottomAppearEls(els = getHomeHeaderBottomAppearEls()) {
    if (!isHomePath()) {
        removeHomeHeaderBottomRecoveryStyle()
        return
    }

    ensureHomeHeaderBottomRecoveryStyle()

    if (!els.length) return
    els.forEach((el) => {
        try {
            el.getAnimations().forEach((animation) => {
                try {
                    if (!isViewTransitionAnimation(animation))
                        animation.cancel()
                } catch (err) {}
            })
        } catch (err) {}
        try {
            ;[
                ["opacity", "1"],
                ["transform", "none"],
                ["visibility", "visible"],
            ].forEach(([property, value]) => {
                if (
                    el.style.getPropertyValue(property) !== value ||
                    el.style.getPropertyPriority(property) !== "important"
                ) {
                    el.style.setProperty(property, value, "important")
                }
            })
        } catch (err) {}
    })
}

function startHomeHeaderBottomRecovery() {
    if (typeof window === "undefined") return

    try {
        if (homeHeaderBottomRecoveryCleanup) homeHeaderBottomRecoveryCleanup()
    } catch (err) {}
    homeHeaderBottomRecoveryCleanup = null

    if (!isHomePath()) {
        removeHomeHeaderBottomRecoveryStyle()
        return
    }

    let stopped = false
    let raf = 0
    let interval = 0
    let discoveryObserver = null
    let headerObserver = null
    let roots = []
    let appearEls = []
    let targetsDirty = true
    const startedAt = Date.now()

    const stop = () => {
        if (stopped) return
        stopped = true
        if (raf) window.cancelAnimationFrame(raf)
        if (interval) window.clearInterval(interval)
        try {
            if (discoveryObserver) discoveryObserver.disconnect()
            if (headerObserver) headerObserver.disconnect()
        } catch (err) {}
        if (homeHeaderBottomRecoveryCleanup === stop) {
            homeHeaderBottomRecoveryCleanup = null
        }
    }

    const refreshTargets = () => {
        const nextRoots = Array.from(
            document.querySelectorAll(HOME_HEADER_BOTTOM_SELECTOR)
        )
        if (
            headerObserver &&
            (nextRoots.length !== roots.length ||
                nextRoots.some((root, index) => root !== roots[index]))
        ) {
            headerObserver.disconnect()
            nextRoots.forEach((root) =>
                headerObserver.observe(root, {
                    subtree: true,
                    childList: true,
                    attributes: true,
                    attributeFilter: ["style", "class", "data-framer-appear-id"],
                })
            )
        }
        roots = nextRoots
        appearEls = getHomeHeaderBottomAppearEls(roots)
        targetsDirty = false
    }

    const tick = () => {
        raf = 0
        if (stopped) return
        if (!isHomePath()) {
            stop()
            removeHomeHeaderBottomRecoveryStyle()
            return
        }

        if (targetsDirty) refreshTargets()
        revealHomeHeaderBottomAppearEls(appearEls)
    }

    const schedule = () => {
        if (!stopped && !raf) raf = window.requestAnimationFrame(tick)
    }

    try {
        if (typeof MutationObserver !== "undefined") {
            headerObserver = new MutationObserver((records) => {
                if (stopped) return
                if (
                    records.some(
                        (record) =>
                            record.type === "childList" ||
                            record.attributeName === "data-framer-appear-id"
                    )
                ) {
                    targetsDirty = true
                }
                schedule()
            })
            const root = document.body || document.documentElement
            if (root) {
                // Discover replaced/mounted headers without observing animated
                // style attributes across the entire page during the curtain.
                discoveryObserver = new MutationObserver((records) => {
                    if (stopped) return
                    const containsHeader = (node) =>
                        node.nodeType === 1 &&
                        (node.matches(HOME_HEADER_BOTTOM_SELECTOR) ||
                            node.querySelector(HOME_HEADER_BOTTOM_SELECTOR))
                    if (
                        records.some((record) =>
                            [...record.addedNodes, ...record.removedNodes].some(
                                containsHeader
                            )
                        )
                    ) {
                        targetsDirty = true
                        schedule()
                    }
                })
                discoveryObserver.observe(root, {
                    subtree: true,
                    childList: true,
                })
            }
        }
    } catch (err) {}

    tick()
    // Late WAAPI appear effects need a bounded check because starting an
    // animation need not mutate the DOM. All recovery work shares one frame.
    interval = window.setInterval(() => {
        if (Date.now() - startedAt > HOME_HEADER_BOTTOM_RECOVERY_MS) {
            stop()
            return
        }
        if (!headerObserver || !roots.length) targetsDirty = true
        schedule()
    }, HOME_HEADER_BOTTOM_RECOVERY_INTERVAL_MS)

    homeHeaderBottomRecoveryCleanup = stop
}

function patchHistoryForHomeHeaderBottomRecovery() {
    try {
        if (window[HISTORY_PATCH_KEY]) return
        window[HISTORY_PATCH_KEY] = true

        // History changes are route notifications, not reveal releases.
        // Keep the real reveal stamp singleton-owned beside this history patch
        // so late-mounted page intros can safely catch the current route.
        window.addEventListener("pt:reveal", () => {
            try {
                ;(window as any).__ptRevealedAt = Date.now()
                ;(window as any).__ptRevealedPath =
                    window.location.pathname
            } catch (err) {}
        })

        const notify = () => {
            window.setTimeout(() => {
                try {
                    window.dispatchEvent(
                        new CustomEvent("mh:locationchange")
                    )
                } catch (err) {}
            }, 0)
        }

        const pushState = history.pushState
        const replaceState = history.replaceState
        history.pushState = function (...args) {
            const result = pushState.apply(this, args)
            notify()
            return result
        }
        history.replaceState = function (...args) {
            const result = replaceState.apply(this, args)
            notify()
            return result
        }
    } catch (err) {}
}

function useHomeHeaderBottomReveal() {
    React.useEffect(() => {
        if (typeof window === "undefined") return

        patchHistoryForHomeHeaderBottomRecovery()

        const restore = () => startHomeHeaderBottomRecovery()
        restore()

        window.addEventListener("pageshow", restore)
        window.addEventListener("popstate", restore)
        window.addEventListener("hashchange", restore)
        window.addEventListener("pt:reveal", restore)
        window.addEventListener("mh:locationchange", restore)
        return () => {
            window.removeEventListener("pageshow", restore)
            window.removeEventListener("popstate", restore)
            window.removeEventListener("hashchange", restore)
            window.removeEventListener("pt:reveal", restore)
            window.removeEventListener("mh:locationchange", restore)
            try {
                if (homeHeaderBottomRecoveryCleanup)
                    homeHeaderBottomRecoveryCleanup()
            } catch (err) {}
            homeHeaderBottomRecoveryCleanup = null
            removeHomeHeaderBottomRecoveryStyle()
        }
    }, [])
}

// ---------------------------------------------------------------------------
// Index hero title rise. (Unchanged — see comments in git history.)
// ---------------------------------------------------------------------------
const INDEX_HEADING_HOLD_ATTR = "data-pt-index-heading-hold"
const INDEX_HEADING_SELECTOR = '[data-framer-name="Index"][data-framer-appear-id]'
const INDEX_HEADING_RISE_FROM_PCT = 115
const INDEX_HEADING_REVEAL_DURATION_MS = 760

function revealIndexHeading() {
    const startedAt = Date.now()

    const tick = () => {
        const elapsed = Date.now() - startedAt
        const t = Math.min(1, elapsed / INDEX_HEADING_REVEAL_DURATION_MS)
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3)
        const y = (1 - eased) * INDEX_HEADING_RISE_FROM_PCT
        const transform =
            t >= 1
                ? "none"
                : "perspective(1200px) translateY(" + y.toFixed(2) + "%)"

        let els
        try {
            els = Array.from(
                document.querySelectorAll(INDEX_HEADING_SELECTOR)
            )
        } catch (err) {
            els = []
        }
        els.forEach((el) => {
            // Cancel Framer's late native appear so it can't fight us.
            try {
                el.getAnimations().forEach((animation) => {
                    try {
                        if (!isViewTransitionAnimation(animation))
                            animation.cancel()
                    } catch (err) {}
                })
            } catch (err) {}
            try {
                el.style.setProperty("transition", "none", "important")
                el.style.setProperty("transform", transform, "important")
                el.style.setProperty("opacity", "1", "important")
            } catch (err) {}
        })
        try {
            document.documentElement.removeAttribute(INDEX_HEADING_HOLD_ATTR)
        } catch (err) {}
    }

    tick()
    const iv = window.setInterval(tick, 16)
    // Keep enforcing a touch past the end so a late re-render still lands final.
    window.setTimeout(() => {
        tick()
        window.clearInterval(iv)
    }, INDEX_HEADING_REVEAL_DURATION_MS + 250)
    return true
}

function useIndexHeadingRiseOnArrival() {
    React.useEffect(() => {
        if (typeof window === "undefined") return

        let pollTimer = 0
        let observer = null
        let busy = false

        const begin = () => {
            if (busy) return
            busy = true
            let attempts = 0
            const poll = () => {
                attempts += 1
                if (document.querySelector(INDEX_HEADING_SELECTOR)) {
                    revealIndexHeading()
                    busy = false
                    return
                }
                if (attempts < 360) {
                    pollTimer = window.setTimeout(poll, 16)
                } else {
                    busy = false
                }
            }
            poll()
        }

        try {
            observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (
                        mutation.attributeName === INDEX_HEADING_HOLD_ATTR &&
                        document.documentElement.getAttribute(
                            INDEX_HEADING_HOLD_ATTR
                        ) === "true"
                    ) {
                        begin()
                    }
                }
            })
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: [INDEX_HEADING_HOLD_ATTR],
            })
        } catch (err) {}

        if (
            document.documentElement.getAttribute(INDEX_HEADING_HOLD_ATTR) ===
            "true"
        ) {
            begin()
        }

        return () => {
            try {
                if (observer) observer.disconnect()
            } catch (err) {}
            window.clearTimeout(pollTimer)
            busy = false
        }
    }, [])
}

// ---------------------------------------------------------------------------
// Home hero on nav arrival — DOCUMENT-GLOBAL controller.
//
// SCOPE: acts on every internal arrival at "/" that came from another route.
// The compiled v7.12 pipeline still owns the sheet transition, but its Home
// appear replay can leave the headline/descriptor parked for ~700-850ms after
// /index, /play, or /info -> Home. This controller starts the existing Home
// rise as soon as the destination DOM mounts. Cold loads and Home -> Home
// clicks remain untouched.
//
// STYLESHEET AUTHORITY (2026-07-14): Framer's appear on high-refresh
// machines is JS-driven inline style writes every rAF — an inline-style
// tug-of-war is a last-writer race the controller can lose on every painted
// frame (120Hz displays). The rise is therefore driven through a <style>
// sheet: author-stylesheet !important declarations beat plain inline styles
// UNCONDITIONALLY, so Framer's writes simply never apply while the sheet is
// active. Each target gets a data-mh-rise attribute; the sheet holds one
// rule per target, rewritten every animation frame. WAAPI animations (which
// sit above stylesheets in the cascade) are cancelled each frame as before.
//
// MONOTONIC RULE: pre-paint start (click-armed observer) plays the full
// choreography from geometric offsets (element height = mask park offset);
// late start resumes each element from its CURRENT offset (settled → pinned,
// no replay; mid-rise → continues upward). Downward motion is impossible.
//
// The guard never expires on a timer — it runs until the visitor navigates
// away from "/". Once risen, the hero stays put.
// ---------------------------------------------------------------------------
const HOME_HERO_HEADLINE_SELECTOR = '[data-framer-name="art"][data-framer-appear-id]'
const HOME_HERO_REGION_MAX_TOP = 860
const HOME_HERO_RISE_DURATION_MS = 1150
const HOME_HERO_STAGGER_MS = 110
const HOME_HERO_MAX_FROM_Y = 220
const HOME_HERO_MIN_RESUME_MS = 250
const HOME_HERO_RISE_ATTR = "data-mh-rise"
const HOME_HERO_RISE_STYLE_ID = "mh-hero-rise-style"
const HOME_SETTLE_INIT_KEY = "__mhHomeHeroSettleInit"
const HOME_SETTLE_MODE_KEY = "__mhHomeHeroSettleMode"
const HOME_SETTLE_BUSY_AT_KEY = "__mhHomeHeroSettleBusyAt"
const HOME_ARRIVAL_AT_KEY = "__mhArrivalAt"
const HOME_NAV_FROM_KEY = "__mhNavFromPath"
const HOME_CUR_PATH_KEY = "__mhCurPath"
const HOME_BUSY_EXPIRY_MS = 6000
const HOME_ARRIVAL_FRESH_MS = 2500
const HOME_PREPIN_TIMEOUT_MS = 4000
let homeHeroRiseAt = 0
let prePinObserver = null
let prePinTimer = 0

function markArrival() {
    try {
        const w = window as any
        // Source = the last stable path (maintained by the watcher / init),
        // which at click time is the page the user is leaving.
        w[HOME_NAV_FROM_KEY] = w[HOME_CUR_PATH_KEY] || window.location.pathname
        w[HOME_ARRIVAL_AT_KEY] = Date.now()
    } catch (err) {}
}

function currentTranslateY(el) {
    try {
        return new DOMMatrix(getComputedStyle(el).transform).m42
    } catch (err) {
        return 0
    }
}

function clearRiseArtifacts() {
    try {
        const style = document.getElementById(HOME_HERO_RISE_STYLE_ID)
        if (style) style.remove()
    } catch (err) {}
    try {
        document
            .querySelectorAll("[" + HOME_HERO_RISE_ATTR + "]")
            .forEach((el) => el.removeAttribute(HOME_HERO_RISE_ATTR))
    } catch (err) {}
}

function ensureRiseStyleEl() {
    let style = document.getElementById(HOME_HERO_RISE_STYLE_ID)
    if (!style) {
        const parent = document.head || document.documentElement
        style = document.createElement("style")
        style.id = HOME_HERO_RISE_STYLE_ID
        parent.appendChild(style)
    }
    return style
}

// Every appear element in the hero region is a target, unconditionally.
// fresh=true: full choreography from the geometric park offset.
// fresh=false: resume from the element's CURRENT offset (monotonic — an
// element that is already up never comes back down).
function collectHomeHeroRisers(fresh) {
    const out = []
    let els
    try {
        els = Array.from(document.querySelectorAll("[data-framer-appear-id]"))
    } catch (err) {
        return out
    }
    let idx = 0
    els.forEach((el) => {
        try {
            if (el.closest("nav")) return
            if (el.closest(HOME_HEADER_BOTTOM_SELECTOR)) return
            const r = el.getBoundingClientRect()
            if (r.width <= 0 || r.height <= 0) return
            if (r.top > HOME_HERO_REGION_MAX_TOP) return
            const geomY = Math.min(
                Math.ceil(r.height) + 6,
                HOME_HERO_MAX_FROM_Y
            )
            const curY = Math.abs(currentTranslateY(el))
            let fromY, delayMs, durationMs
            if (fresh) {
                fromY = Math.min(
                    Math.max(curY, geomY),
                    HOME_HERO_MAX_FROM_Y
                )
                delayMs = idx * HOME_HERO_STAGGER_MS
                durationMs = HOME_HERO_RISE_DURATION_MS
            } else {
                // Resume from wherever the element is right now. Settled
                // elements (curY < 2) get fromY 0 = pin only, no replay.
                fromY = curY < 2 ? 0 : Math.min(curY, HOME_HERO_MAX_FROM_Y)
                delayMs = 0
                durationMs =
                    fromY <= 0
                        ? 0
                        : Math.max(
                              HOME_HERO_RISE_DURATION_MS * (fromY / geomY),
                              HOME_HERO_MIN_RESUME_MS
                          )
            }
            out.push({ el, fromY, durationMs, delayMs, idx })
            idx += 1
        } catch (err) {}
    })
    return out
}

function riseHomeHero(mode, fresh) {
    if (Date.now() - homeHeroRiseAt < 1800) return false
    const targets = collectHomeHeroRisers(fresh)
    if (!targets.length) return false
    homeHeroRiseAt = Date.now()
    const sessionStamp = homeHeroRiseAt
    const settle = mode === "settle"
    const startedAt = Date.now()
    const easeOutExpo = (p) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p))

    // Tag targets and drive them through a stylesheet: author-sheet
    // !important beats Framer's plain inline writes on every frame,
    // regardless of write order or display refresh rate.
    clearRiseArtifacts()
    targets.forEach((t) => {
        try {
            t.el.setAttribute(HOME_HERO_RISE_ATTR, String(t.idx))
        } catch (err) {}
    })

    let raf = 0
    const stopGuard = () => {
        if (raf) window.cancelAnimationFrame(raf)
        raf = 0
        clearRiseArtifacts()
    }

    const tick = () => {
        if (!isHomePath() || homeHeroRiseAt !== sessionStamp) {
            stopGuard()
            return
        }
        const now = Date.now()
        let css = ""
        targets.forEach((t) => {
            let y
            if (settle || t.fromY <= 0 || t.durationMs <= 0) {
                y = 0
            } else {
                const local = now - startedAt - t.delayMs
                if (local <= 0) y = t.fromY
                else if (local >= t.durationMs) y = 0
                else y = (1 - easeOutExpo(local / t.durationMs)) * t.fromY
            }
            const transform =
                Math.abs(y) < 0.1
                    ? "none"
                    : "perspective(1200px) translateY(" + y.toFixed(2) + "px)"
            css +=
                "[" +
                HOME_HERO_RISE_ATTR +
                '="' +
                t.idx +
                '"]{transform:' +
                transform +
                " !important;opacity:1 !important;transition:none !important;}"
            // WAAPI animations sit above stylesheets — cancel them.
            try {
                t.el.getAnimations().forEach((animation) => {
                    try {
                        if (!isViewTransitionAnimation(animation))
                            animation.cancel()
                    } catch (err) {}
                })
            } catch (err) {}
        })
        try {
            const style = ensureRiseStyleEl()
            if (style.textContent !== css) style.textContent = css
        } catch (err) {}
        raf = window.requestAnimationFrame(tick)
    }

    tick()
    return true
}

function stopPrePin() {
    try {
        if (prePinObserver) prePinObserver.disconnect()
    } catch (err) {}
    prePinObserver = null
    if (prePinTimer) window.clearTimeout(prePinTimer)
    prePinTimer = 0
}

// Armed at click time on any non-Home route whose link targets Home. Fires as
// a microtask when the Home DOM mounts — BEFORE the browser paints it — and
// pins the risers synchronously, so the settled hero can never flash.
function armPrePaintPin() {
    if (typeof window === "undefined") return
    if (typeof MutationObserver === "undefined") return
    stopPrePin()
    try {
        const w = window as any
        prePinObserver = new MutationObserver(() => {
            try {
                if (!isHomePath()) return
                const headline = document.querySelector(
                    HOME_HERO_HEADLINE_SELECTOR
                )
                if (!headline) return
                const mode = w[HOME_SETTLE_MODE_KEY] || "animate"
                if (riseHomeHero(mode, true)) stopPrePin()
            } catch (err) {}
        })
        prePinObserver.observe(document.documentElement, {
            childList: true,
            subtree: true,
        })
        prePinTimer = window.setTimeout(stopPrePin, HOME_PREPIN_TIMEOUT_MS)
    } catch (err) {}
}

function beginHomeHeroSettle() {
    if (typeof window === "undefined") return
    if (!isHomePath()) return
    const w = window as any
    // Internal route arrivals only. Cold loads have no source stamp, and a
    // Home -> Home click must not replay the hero.
    const sourcePath =
        String(w[HOME_NAV_FROM_KEY] || "").replace(/\/+$/, "") || HOME_PATH
    if (sourcePath === HOME_PATH) return
    // Only on a real arrival (a recent nav / nav intent), never a cold load.
    const navAt = Number(w[HOME_ARRIVAL_AT_KEY] || 0)
    if (!(navAt > 0 && Date.now() - navAt < HOME_ARRIVAL_FRESH_MS)) return
    // Busy flag is a timestamp so a wedged run can never disable the
    // controller for the rest of the session.
    const busyAt = Number(w[HOME_SETTLE_BUSY_AT_KEY] || 0)
    if (busyAt && Date.now() - busyAt < HOME_BUSY_EXPIRY_MS) return
    w[HOME_SETTLE_BUSY_AT_KEY] = Date.now()

    let attempts = 0
    const done = () => {
        w[HOME_SETTLE_BUSY_AT_KEY] = 0
    }
    const poll = () => {
        try {
            attempts += 1
            if (!isHomePath()) return done()
            if (Date.now() - homeHeroRiseAt < 1800) return done()
            const mode = w[HOME_SETTLE_MODE_KEY] || "animate"
            const headline = document.querySelector(
                HOME_HERO_HEADLINE_SELECTOR
            )
            // Late path: monotonic resume — never a restart.
            if (headline && riseHomeHero(mode, false)) return done()
            // The poll is window-owned: no component unmount can cancel it.
            if (attempts < 240) window.setTimeout(poll, 16)
            else done()
        } catch (err) {
            done()
        }
    }
    poll()
}

function initHomeHeroSettleController() {
    if (typeof window === "undefined") return
    const w = window as any
    if (w[HOME_SETTLE_INIT_KEY]) return
    w[HOME_SETTLE_INIT_KEY] = true
    w[HOME_CUR_PATH_KEY] = window.location.pathname

    const onArrive = () => {
        window.setTimeout(beginHomeHeroSettle, 0)
    }

    window.addEventListener("pt:reveal", onArrive)
    window.addEventListener("popstate", onArrive)
    window.addEventListener("mh:locationchange", onArrive)

    // Primary signal: an internal link click records the SOURCE path and
    // stamps nav intent BEFORE the router even processes the navigation.
    // If the click leaves any other route for Home, arm the pre-paint pin so
    // the hero starts with the destination mount instead of after v7.12's
    // delayed replay release.
    try {
        document.addEventListener(
            "click",
            (e) => {
                try {
                    const a =
                        e.target && e.target.closest
                            ? e.target.closest("a[href]")
                            : null
                    if (!a) return
                    const href = a.getAttribute("href") || ""
                    if (/^(https?:)?\/\//.test(href)) {
                        if (a.host && a.host !== window.location.host) return
                    }
                    if (/^(mailto:|tel:|#)/.test(href)) return
                    markArrival()
                    try {
                        const destPath = (a.pathname || "").replace(/\/+$/, "") || "/"
                        if (
                            destPath === HOME_PATH &&
                            !isHomePath()
                        ) {
                            armPrePaintPin()
                        }
                    } catch (err) {}
                } catch (err) {}
            },
            true
        )
    } catch (err) {}

    // Fallback: a lightweight pathname watcher. Records the source path on
    // any change (covers browser back too). Initialized with the cold-load
    // path, so a first document load never registers a change.
    try {
        window.setInterval(() => {
            try {
                const p = window.location.pathname
                if (p !== w[HOME_CUR_PATH_KEY]) {
                    const at = Number(w[HOME_ARRIVAL_AT_KEY] || 0)
                    if (!(at && Date.now() - at < 1500)) {
                        markArrival()
                    }
                    w[HOME_CUR_PATH_KEY] = p
                    window.setTimeout(beginHomeHeroSettle, 0)
                } else {
                    w[HOME_CUR_PATH_KEY] = p
                }
            } catch (err) {}
        }, 150)
    } catch (err) {}
}

function useHomeHeroRise(mode) {
    if (typeof window !== "undefined") {
        try {
            ;(window as any)[HOME_SETTLE_MODE_KEY] =
                mode === "settle" ? "settle" : "animate"
        } catch (err) {}
    }
    React.useEffect(() => {
        initHomeHeroSettleController()
        // Also check on mount: if this instance mounted as part of a nav
        // arrival at "/", the arrival stamp (usually from the link click)
        // is still fresh and the headline may just have appeared.
        if (typeof window !== "undefined") {
            window.setTimeout(beginHomeHeroSettle, 0)
        }
    }, [])
}

/**
 * PageTransition
 *
 * Uses the preserved v7.12 runtime with the Index arrival hold ownership fix,
 * plus a narrow Home Header Bottom recovery
 * and a document-global "home hero on route arrival" controller: pre-paint
 * pin, monotonic (never-downward) choreography driven through a stylesheet
 * (beats Framer's inline writes on any refresh rate), hold-until-navigation
 * guard; internal non-Home → Home navigations only.
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function PageTransition(props) {
    useBootViewportGuard()
    useHomeHeaderBottomReveal()
    useIndexHeadingRiseOnArrival()
    useHomeHeroRise(props.homeArrivalMode)
    return (
        <>
            <script
                dangerouslySetInnerHTML={{
                    __html: BOOT_FIRST_PAINT_GUARD_JS,
                }}
            />
            <script
                dangerouslySetInnerHTML={{ __html: BOOT_VIEWPORT_GUARD_JS }}
            />
            <PageTransitionV712 {...props} />
            <ParagraphPrettyWrap enabled={true} maxFontSize={23} minWords={2} />
        </>
    )
}

addPropertyControls(PageTransition, {
    enabled: {
        type: ControlType.Boolean,
        title: "Enabled",
        defaultValue: true,
    },
    homeArrivalMode: {
        type: ControlType.Enum,
        title: "Home arrival",
        defaultValue: "animate",
        options: ["animate", "settle"],
        optionTitles: ["Animate", "Settle"],
        displaySegmentedControl: true,
    },
    duration: {
        type: ControlType.Number,
        title: "Slide",
        defaultValue: 700,
        min: 200,
        max: 1500,
        step: 10,
        unit: "ms",
        displayStepper: true,
    },
    navDuration: {
        type: ControlType.Number,
        title: "Nav swipe",
        defaultValue: 400,
        min: 100,
        max: 1000,
        step: 10,
        unit: "ms",
        displayStepper: true,
    },
    drift: {
        type: ControlType.Number,
        title: "Old drift",
        defaultValue: 10,
        min: 0,
        max: 30,
        step: 1,
        unit: "vh",
        displayStepper: true,
    },
    dim: {
        type: ControlType.Number,
        title: "Old dim",
        defaultValue: 0.35,
        min: 0,
        max: 0.8,
        step: 0.05,
        displayStepper: true,
    },
    navSelector: {
        type: ControlType.String,
        title: "Nav selector",
        defaultValue: 'nav[data-framer-name="Navigation"], nav',
    },
    excludeSelector: {
        type: ControlType.String,
        title: "Exclude",
        defaultValue: "[data-no-transition]",
    },
    prefetch: {
        type: ControlType.Boolean,
        title: "Prefetch",
        defaultValue: true,
        enabledTitle: "Hover",
        disabledTitle: "Off",
    },
    holdAppear: {
        type: ControlType.Boolean,
        title: "Hold appear",
        defaultValue: true,
        enabledTitle: "Until done",
        disabledTitle: "Off",
    },
    skipCaseStudyTransitions: {
        type: ControlType.Boolean,
        title: "Case studies",
        defaultValue: true,
        enabledTitle: "Skip",
        disabledTitle: "Animate",
    },
    firstBoot: {
        type: ControlType.Boolean,
        title: "First boot",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Off",
    },
    bootMode: {
        type: ControlType.Enum,
        title: "Boot mode",
        defaultValue: "once",
        options: ["once", "always"],
        optionTitles: ["Auto", "Always"],
        displaySegmentedControl: true,
        hidden: (p) => !p.firstBoot,
    },
    bootColor: {
        type: ControlType.Color,
        title: "Boot color",
        defaultValue: "#233324",
        hidden: (p) => !p.firstBoot,
    },
    barColor: {
        type: ControlType.Color,
        title: "Bar color",
        defaultValue: "#F7F5F0",
        hidden: (p) => !p.firstBoot,
    },
    barHeight: {
        type: ControlType.Number,
        title: "Bar height",
        defaultValue: 8,
        min: 1,
        max: 40,
        step: 1,
        unit: "px",
        displayStepper: true,
        hidden: (p) => !p.firstBoot,
    },
    bootMinMs: {
        type: ControlType.Number,
        title: "Boot min",
        defaultValue: 1200,
        min: 0,
        max: 6000,
        step: 100,
        unit: "ms",
        displayStepper: true,
        hidden: (p) => !p.firstBoot,
    },
    bootMaxWaitMs: {
        type: ControlType.Number,
        title: "Max wait",
        defaultValue: 4500,
        min: 500,
        max: 15000,
        step: 100,
        unit: "ms",
        displayStepper: true,
        hidden: (p) => !p.firstBoot,
    },
    barEaseMs: {
        type: ControlType.Number,
        title: "Bar ease",
        defaultValue: 3000,
        min: 300,
        max: 8000,
        step: 100,
        unit: "ms",
        displayStepper: true,
        hidden: (p) => !p.firstBoot,
    },
    barHold: {
        type: ControlType.Number,
        title: "Bar hold",
        defaultValue: 0.86,
        min: 0.1,
        max: 1,
        step: 0.01,
        displayStepper: true,
        hidden: (p) => !p.firstBoot,
    },
    bootSwipeMs: {
        type: ControlType.Number,
        title: "Boot swipe",
        defaultValue: 1200,
        min: 200,
        max: 3000,
        step: 50,
        unit: "ms",
        displayStepper: true,
        hidden: (p) => !p.firstBoot,
    },
    bootSwipeDelayMs: {
        type: ControlType.Number,
        title: "Swipe delay",
        defaultValue: 300,
        min: 0,
        max: 2000,
        step: 50,
        unit: "ms",
        displayStepper: true,
        hidden: (p) => !p.firstBoot,
    },
})

PageTransition.displayName = "PageTransition"
