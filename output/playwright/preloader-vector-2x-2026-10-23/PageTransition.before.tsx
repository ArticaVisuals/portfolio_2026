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

// Figma identity, node 91:521. Embed the original SVG unchanged so both
// first paint and the runtime curtain render without a font or image request.
// Keep the previous ~278px desktop / ~222px tablet footprint.
// Regenerate the Framer Preloaders head entry with `node code/tools/sync-boot-head.mjs`.
const BOOT_WORDMARK_SOURCE = "data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9Ijc2ODIuMyIgaGVpZ2h0PSIxMDI1LjAxIiB2aWV3Qm94PSIwIDAgNzY4Mi4zIDEwMjUuMDEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgo8ZyBpZD0iR3JvdXAgNTIiPgo8ZyBpZD0iTWljYWggSG9hbmciPgo8cGF0aCBpZD0iVmVjdG9yIiBkPSJNNzM5NC4yMyAxMDI1LjAxQzcyMzQuMzIgMTAyNS4wMSA3MTI0LjMgOTQyLjIxOSA3MTE4LjYzIDgyNy42N0g3MjUzLjZDNzI2MS41NCA4NzYuNDM5IDczMTcuMTEgOTEyLjczMSA3Mzk0LjIzIDkxMi43MzFDNzQ4Ny4yMyA5MTIuNzMxIDc1NDkuNjEgODY2LjIzMSA3NTQ5LjYxIDc2Ny41NjFWNzA4LjU4NUM3NTEyLjE4IDc2Ni40MjYgNzQ0MC43MyA3OTkuMzE3IDczNjQuNzQgNzk5LjMxN0M3MjAwLjI5IDc5OS4zMTcgNzA5NS45NSA2NzYuODI5IDcwOTUuOTUgNTEwLjEwOUM3MDk1Ljk1IDMzOS45ODcgNzIwMS40MyAyMTkuNzY4IDczNjQuNzQgMjE5Ljc2OEM3NDQzIDIxOS43NjggNzUxMi4xOCAyNTEuNTI0IDc1NDkuNjEgMzA5LjM2NVYyMzYuNzhINzY4Mi4zVjc2MC43NTZDNzY4Mi4zIDkzNi41NDkgNzU3My40MyAxMDI1LjAxIDczOTQuMjMgMTAyNS4wMVpNNzM5MS45NiA2ODUuOTAyQzc0ODQuOTYgNjg1LjkwMiA3NTUxLjg4IDYyMC4xMjEgNzU1MS44OCA1MDguOTc1Qzc1NTEuODggMzk3LjgyOSA3NDgzLjgzIDMzMi4wNDggNzM5MS45NiAzMzIuMDQ4QzcyOTcuODMgMzMyLjA0OCA3MjMwLjkxIDM5OC45NjMgNzIzMC45MSA1MDguOTc1QzcyMzAuOTEgNjIwLjEyMSA3Mjk3LjgzIDY4NS45MDIgNzM5MS45NiA2ODUuOTAyWiIgZmlsbD0iYmxhY2siLz4KPHBhdGggaWQ9IlZlY3Rvcl8yIiBkPSJNNjQ3OC4wNSA4MTkuODY2VjIzNS43OEg2NjA2LjIxVjMwNi4wOTdDNjYzOS4xIDI1MC41MjQgNjcwNy4xNSAyMTguNzY4IDY3ODMuMTQgMjE4Ljc2OEM2OTA3Ljg5IDIxOC43NjggNjk5OS43NiAyODcuOTUxIDY5OTkuNzYgNDU0LjY3MVY4MTkuODY2SDY4NjUuOTNWNDgwLjc1NkM2ODY1LjkzIDM5MC4wMjQgNjgyMC41NiAzNDIuMzkgNjc0NC41OCAzNDIuMzlDNjY1OS41MSAzNDIuMzkgNjYxMS44OCA0MDAuMjMyIDY2MTEuODggNDg2LjQyN1Y4MTkuODY2SDY0NzguMDVaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBpZD0iVmVjdG9yXzMiIGQ9Ik02MDI2LjM2IDgzNi44NzhDNTkwNi4xNSA4MzYuODc4IDU4MTkuOTUgNzY4LjgyOSA1ODE5Ljk1IDY1OS45NTFDNTgxOS45NSA1NTMuMzQxIDU4OTUuOTQgNDk3Ljc2OCA1OTk2Ljg4IDQ3OS42MjJMNjEzNy41MSA0NTQuNjcxQzYxNzguMzQgNDQ3Ljg2NiA2MjAyLjE2IDQzNC4yNTYgNjIwMi4xNiAzOTcuOTYzQzYyMDIuMTYgMzU0Ljg2NiA2MTY1Ljg2IDMyNi41MTIgNjA5Ni42OCAzMjYuNTEyQzYwMzMuMTcgMzI2LjUxMiA1OTc4LjczIDM1My43MzIgNTk3My4wNiA0MTYuMTFINTgzNi45NkM1ODQ0LjkgMjkzLjYyMiA1OTU0LjkxIDIxOC43NjggNjA5NS41NSAyMTguNzY4QzYyNTguODYgMjE4Ljc2OCA2MzM0Ljg1IDI5OS4yOTIgNjMzNC44NSA0MDMuNjM0VjY3Mi40MjdDNjMzNC44NSA3MDQuMTgzIDYzNTEuODYgNzEzLjI1NiA2MzcxLjE1IDcxMy4yNTZDNjM4MS4zNSA3MTMuMjU2IDYzOTAuNDMgNzEyLjEyMiA2Mzk5LjUgNzA5Ljg1NFY4MTUuMzI5QzYzNzcuOTUgODI0LjQwMyA2MzUwLjczIDgzMS4yMDcgNjMxNi43MSA4MzEuMjA3QzYyNjUuNjcgODMxLjIwNyA2MjI1Ljk3IDgxMS45MjcgNjIwOC45NiA3NjMuMTU5QzYxNzQuOTQgNzk4LjMxNyA2MTE5LjM2IDgzNi44NzggNjAyNi4zNiA4MzYuODc4Wk02MDU4LjEyIDcyOS4xMzRDNjE0MC45MSA3MjkuMTM0IDYyMDIuMTYgNjgwLjM2NiA2MjAyLjE2IDYxMS4xODNWNTI5LjUyNEM2MTkzLjA4IDUzOS43MzIgNjE2My42IDU0OC44MDUgNjEyNi4xNyA1NTUuNjFMNjA0MS4xMSA1NzEuNDg4QzU5ODMuMjcgNTgyLjgyOSA1OTU2LjA1IDYwOC45MTUgNTk1Ni4wNSA2NTMuMTQ2QzU5NTYuMDUgNzAzLjA0OSA1OTk5LjE0IDcyOS4xMzQgNjA1OC4xMiA3MjkuMTM0WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggaWQ9IlZlY3Rvcl80IiBkPSJNNTQ1MS41OCA4MzYuODc4QzUyNjYuNzIgODM2Ljg3OCA1MTQ2LjUgNzA5Ljg1NCA1MTQ2LjUgNTI3LjI1NkM1MTQ2LjUgMzQ1Ljc5MyA1MjY2LjcyIDIxOC43NjggNTQ1MS41OCAyMTguNzY4QzU2MzYuNDUgMjE4Ljc2OCA1NzU2LjY3IDM0NS43OTMgNTc1Ni42NyA1MjcuMjU2QzU3NTYuNjcgNzA5Ljg1NCA1NjM2LjQ1IDgzNi44NzggNTQ1MS41OCA4MzYuODc4Wk01NDUxLjU4IDcxNS41MjRDNTU1My42NiA3MTUuNTI0IDU2MjEuNyA2NDYuMzQxIDU2MjEuNyA1MjcuMjU2QzU2MjEuNyA0MDguMTcxIDU1NTIuNTIgMzQwLjEyMiA1NDUxLjU4IDM0MC4xMjJDNTM1MC42NCAzNDAuMTIyIDUyODIuNTkgNDA5LjMwNSA1MjgyLjU5IDUyNy4yNTZDNTI4Mi41OSA2NDcuNDc2IDUzNTAuNjQgNzE1LjUyNCA1NDUxLjU4IDcxNS41MjRaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBpZD0iVmVjdG9yXzUiIGQ9Ik00NDAxLjIyIDgyMC44NjdWMjEuMjkzSDQ1NDAuNzJWMzM5Ljk4OEg0OTE3LjI2VjIxLjI5M0g1MDU2Ljc2VjgyMC44NjdINDkxNy4yNlY0NzEuNTQ5SDQ1NDAuNzJWODIwLjg2N0g0NDAxLjIyWiIgZmlsbD0iYmxhY2siLz4KPHBhdGggaWQ9IlZlY3Rvcl82IiBkPSJNMzU0MS4zNSA4MjAuODY3VjIxLjI5M0gzNjc1LjE4VjMwMC4yOTNDMzcwNi45NCAyNTAuMzkxIDM3NzMuODUgMjE5Ljc2OSAzODQ2LjQ0IDIxOS43NjlDMzk3MS4xOSAyMTkuNzY5IDQwNjMuMDYgMjg4Ljk1MiA0MDYzLjA2IDQ1NS42NzFWODIwLjg2N0gzOTI5LjIzVjQ4MS43NTdDMzkyOS4yMyAzOTEuMDI1IDM4ODUgMzQzLjM5MSAzODA5LjAxIDM0My4zOTFDMzcyMy45NSAzNDMuMzkxIDM2NzUuMTggNDAxLjIzMiAzNjc1LjE4IDQ4Ny40MjdWODIwLjg2N0gzNTQxLjM1WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggaWQ9IlZlY3Rvcl83IiBkPSJNMzA3OC42NyA4MzcuODc4QzI5NTguNDUgODM3Ljg3OCAyODcyLjI1IDc2OS44MjkgMjg3Mi4yNSA2NjAuOTUxQzI4NzIuMjUgNTU0LjM0MSAyOTQ4LjI0IDQ5OC43NjggMzA0OS4xOCA0ODAuNjIyTDMxODkuODIgNDU1LjY3MUMzMjMwLjY1IDQ0OC44NjYgMzI1NC40NiA0MzUuMjU2IDMyNTQuNDYgMzk4Ljk2M0MzMjU0LjQ2IDM1NS44NjYgMzIxOC4xNyAzMjcuNTEyIDMxNDguOTkgMzI3LjUxMkMzMDg1LjQ3IDMyNy41MTIgMzAzMS4wNCAzNTQuNzMyIDMwMjUuMzYgNDE3LjExSDI4ODkuMjdDMjg5Ny4yMSAyOTQuNjIyIDMwMDcuMjIgMjE5Ljc2OCAzMTQ3Ljg1IDIxOS43NjhDMzMxMS4xNyAyMTkuNzY4IDMzODcuMTYgMzAwLjI5MiAzMzg3LjE2IDQwNC42MzRWNjczLjQyN0MzMzg3LjE2IDcwNS4xODMgMzQwNC4xNyA3MTQuMjU2IDM0MjMuNDUgNzE0LjI1NkMzNDMzLjY2IDcxNC4yNTYgMzQ0Mi43MyA3MTMuMTIyIDM0NTEuOCA3MTAuODU0VjgxNi4zMjlDMzQzMC4yNiA4MjUuNDAzIDM0MDMuMDQgODMyLjIwNyAzMzY5LjAxIDgzMi4yMDdDMzMxNy45NyA4MzIuMjA3IDMyNzguMjggODEyLjkyNyAzMjYxLjI3IDc2NC4xNTlDMzIyNy4yNCA3OTkuMzE3IDMxNzEuNjcgODM3Ljg3OCAzMDc4LjY3IDgzNy44NzhaTTMxMTAuNDMgNzMwLjEzNEMzMTkzLjIyIDczMC4xMzQgMzI1NC40NiA2ODEuMzY2IDMyNTQuNDYgNjEyLjE4M1Y1MzAuNTI0QzMyNDUuMzkgNTQwLjczMiAzMjE1LjkgNTQ5LjgwNSAzMTc4LjQ3IDU1Ni42MUwzMDkzLjQxIDU3Mi40ODhDMzAzNS41NyA1ODMuODI5IDMwMDguMzUgNjA5LjkxNSAzMDA4LjM1IDY1NC4xNDZDMzAwOC4zNSA3MDQuMDQ5IDMwNTEuNDUgNzMwLjEzNCAzMTEwLjQzIDczMC4xMzRaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBpZD0iVmVjdG9yXzgiIGQ9Ik0yNTE3LjY2IDgzNy44NzhDMjMzOC40NyA4MzcuODc4IDIyMTkuMzggNzA3LjQ1MSAyMjE5LjM4IDUyOC4yNTZDMjIxOS4zOCAzNDkuMDYxIDIzMzcuMzQgMjE5Ljc2OCAyNTIyLjIgMjE5Ljc2OEMyNjkxLjE5IDIxOS43NjggMjc5Mi4xMyAzMzIuMDQ5IDI4MDAuMDcgNDYzLjYxSDI2NjMuOTdDMjY1MS40OSAzODEuOTUxIDI1OTEuMzggMzQxLjEyMiAyNTE4LjggMzQxLjEyMkMyNDE4Ljk5IDM0MS4xMjIgMjM1NS40OCA0MDkuMTcxIDIzNTUuNDggNTI4LjI1NkMyMzU1LjQ4IDY0OC40NzYgMjQyMC4xMyA3MTYuNTI0IDI1MTguOCA3MTYuNTI0QzI1OTEuMzggNzE2LjUyNCAyNjQ4LjA5IDY4My42MzQgMjY2My45NyA1OTYuMzA1SDI4MDAuMDdDMjc4Ny41OSA3MjYuNzMyIDI2OTMuNDYgODM3Ljg3OCAyNTE3LjY2IDgzNy44NzhaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBpZD0iVmVjdG9yXzkiIGQ9Ik0xOTkyLjAyIDgyMC44NjZWMjM2Ljc4MUgyMTI1Ljg1VjgyMC44NjZIMTk5Mi4wMlpNMjA1Ny44IDE2Ny41OThDMjAxMS4zIDE2Ny41OTggMTk3Ni4xNCAxMzEuMzA1IDE5NzYuMTQgODQuODA0OUMxOTc2LjE0IDM3LjE3MDggMjAxMS4zIDIuMDEyMTcgMjA1Ny44IDIuMDEyMTdDMjEwNS40NCAyLjAxMjE3IDIxNDEuNzMgMzguMzA0OSAyMTQxLjczIDg0LjgwNDlDMjE0MS43MyAxMzIuNDM5IDIxMDUuNDQgMTY3LjU5OCAyMDU3LjggMTY3LjU5OFoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGlkPSJWZWN0b3JfMTAiIGQ9Ik0xMDEyLjA3IDgyMC44NjdWMjEuMjkzSDExOTUuOEwxMzcyLjczIDQ3Ny4yMkwxNDQwLjc4IDY1NS4yODFMMTUwNy42OSA0NzcuMjJMMTY4NC42MiAyMS4yOTNIMTg2OS40OVY4MjAuODY3SDE3MzkuMDZWMzU3LjAwMVYyMTAuNjk2TDE2ODIuMzUgMzU3LjAwMUwxNTcxLjIxIDYzMi41OThMMTQ5OC42MiA4MjAuODY3SDEzODEuOEwxMzA5LjIyIDYzMi41OThMMTE5OC4wNyAzNTcuMDAxTDExNDIuNSAyMTAuNjk2VjM1Ny4wMDFWODIwLjg2N0gxMDEyLjA3WiIgZmlsbD0iYmxhY2siLz4KPC9nPgo8ZyBpZD0iJiMxOTQ7JiMxNjk7Ij4KPHVzZSB4bGluazpocmVmPSIjc3Ryb2tlMF8wXzQiIGZpbGw9ImJsYWNrIi8+CjxtYXNrIGlkPSJzdHJva2UxXzBfNCIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iLTMuMjkwNDhlLTA3IiB5PSIwIiB3aWR0aD0iODU1IiBoZWlnaHQ9Ijg1NCIgZmlsbD0iYmxhY2siPgo8cmVjdCBmaWxsPSJ3aGl0ZSIgeD0iLTMuMjkwNDhlLTA3IiB3aWR0aD0iODU1IiBoZWlnaHQ9Ijg1NCIvPgo8dXNlIHhsaW5rOmhyZWY9IiNzdHJva2UwXzBfNCIvPgo8L21hc2s+CjxwYXRoIGQ9Ik00MjguMTIyIDg0My4zODdDMzUxLjkyNyA4NDMuMzg3IDI4MS43NjQgODI1LjI5MSAyMTcuNjMyIDc4OS4wOThDMTUzLjUwMSA3NTIuOTA1IDEwMi43MDQgNzAzLjA2MSA2NS4yNDE3IDYzOS41NjRDMjguNDEzOSA1NzYuMDY4IDEwIDUwNC45NTMgMTAgNDI2LjIxN0MxMCAzNDcuNDgyIDI4LjQxMzkgMjc2LjM2NiA2NS4yNDE3IDIxMi44N0MxMDIuNzA0IDE0OS4zNzQgMTUzLjUwMSA5OS44NDcgMjE3LjYzMiA2NC4yODkyQzI4MS43NjQgMjguMDk2NCAzNTEuOTI3IDEwIDQyOC4xMjIgMTBDNTAzLjY4MyAxMCA1NzMuMjExIDI4LjA5NjQgNjM2LjcwNyA2NC4yODkyQzcwMC44MzggMTAwLjQ4MiA3NTEuMzE4IDE1MC4zMjcgNzg4LjE0NSAyMTMuODIzQzgyNS42MDggMjc3LjMxOSA4NDQuMzM5IDM0OC4xMTcgODQ0LjMzOSA0MjYuMjE3Qzg0NC4zMzkgNTA0Ljk1MyA4MjUuNjA4IDU3Ni4zODYgNzg4LjE0NSA2NDAuNTE3Qzc1MS4zMTggNzA0LjAxMyA3MDEuMTU2IDc1My41NCA2MzcuNjU5IDc4OS4wOThDNTc0LjE2MyA4MjUuMjkxIDUwNC4zMTggODQzLjM4NyA0MjguMTIyIDg0My4zODdaTTQyOC4xMjIgNzc2LjcxNkM0OTEuNjE4IDc3Ni43MTYgNTQ5LjcxNyA3NjEuNDc3IDYwMi40MTkgNzMwLjk5OUM2NTUuMTIxIDcwMC41MjEgNjk2LjcxMSA2NTguNjEzIDcyNy4xODkgNjA1LjI3NkM3NTcuNjY3IDU1MS4zMDUgNzcyLjkwNiA0OTEuNjE4IDc3Mi45MDYgNDI2LjIxN0M3NzIuOTA2IDM2MC4xODEgNzU3LjY2NyAzMDAuODEyIDcyNy4xODkgMjQ4LjExMUM2OTYuNzExIDE5NC43NzQgNjU1LjEyMSAxNTIuODY2IDYwMi40MTkgMTIyLjM4OEM1NDkuNzE3IDkxLjkxIDQ5MS42MTggNzYuNjcxIDQyOC4xMjIgNzYuNjcxQzM2My45OTEgNzYuNjcxIDMwNS41NzUgOTEuOTEgMjUyLjg3MyAxMjIuMzg4QzIwMC4xNzEgMTUyLjIzMSAxNTguNTgxIDE5My44MjEgMTI4LjEwMyAyNDcuMTU4Qzk3LjYyNDcgMzAwLjQ5NSA4Mi4zODU2IDM2MC4xODEgODIuMzg1NiA0MjYuMjE3QzgyLjM4NTYgNDkyLjI1MyA5Ny42MjQ3IDU1MS45NCAxMjguMTAzIDYwNS4yNzZDMTU4LjU4MSA2NTguNjEzIDIwMC4xNzEgNzAwLjUyMSAyNTIuODczIDczMC45OTlDMzA1LjU3NSA3NjEuNDc3IDM2My45OTEgNzc2LjcxNiA0MjguMTIyIDc3Ni43MTZaTTQzMS45MzIgNjQ5LjA4OUMzOTAuNjU5IDY0OS4wODkgMzUzLjUxNCA2MzkuNTY0IDMyMC40OTYgNjIwLjUxNkMyODguMTEzIDYwMC44MzIgMjYyLjcxNSA1NzMuODQ2IDI0NC4zMDEgNTM5LjU1OEMyMjYuNTIyIDUwNC42MzUgMjE3LjYzMiA0NjQuOTUgMjE3LjYzMiA0MjAuNTAzQzIxNy42MzIgMzc2LjA1NSAyMjYuNTIyIDMzNi42ODggMjQ0LjMwMSAzMDIuNEMyNjIuNzE1IDI2OC4xMTIgMjg4LjExMyAyNDEuNDQzIDMyMC40OTYgMjIyLjM5NUMzNTMuNTE0IDIwMy4zNDYgMzkwLjY1OSAxOTMuODIxIDQzMS45MzIgMTkzLjgyMUM0NjkuMzk1IDE5My44MjEgNTAyLjczIDIwMC44MDYgNTMxLjkzOCAyMTQuNzc1QzU2MS4xNDcgMjI4Ljc0NCA1ODQuMzIzIDI0OC40MjggNjAxLjQ2NyAyNzMuODI3QzYxOC42MTEgMjk4LjU5IDYyOC4xMzUgMzI2Ljg0NiA2MzAuMDQgMzU4LjU5NEg1NDkuMDgyQzUzNy42NTMgMjk3LjYzOCA0OTguNjAzIDI2Ny4xNTkgNDMxLjkzMiAyNjcuMTU5QzM4OS4zOSAyNjcuMTU5IDM1Ni42ODkgMjgwLjE3NiAzMzMuODMgMzA2LjIxQzMxMS42MDcgMzMyLjI0MyAzMDAuNDk1IDM3MC4zNDEgMzAwLjQ5NSA0MjAuNTAzQzMwMC40OTUgNDcwLjY2NSAzMTEuOTI0IDUwOS4wOCAzMzQuNzgzIDUzNS43NDhDMzU3LjY0MSA1NjEuNzgyIDM5MC4wMjQgNTc0Ljc5OCA0MzEuOTMyIDU3NC43OThDNTAxLjE0MyA1NzQuNzk4IDU0MC4xOTMgNTQ0LjMyIDU0OS4wODIgNDgzLjM2NEg2MzAuMDRDNjI3LjUgNTE1LjExMiA2MTcuMzQxIDU0My42ODUgNTk5LjU2MiA1NjkuMDg0QzU4Mi40MTggNTkzLjg0NyA1NTkuMjQyIDYxMy41MzEgNTMwLjAzMyA2MjguMTM1QzUwMC44MjUgNjQyLjEwNCA0NjguMTI1IDY0OS4wODkgNDMxLjkzMiA2NDkuMDg5WiIgc3Ryb2tlLXdpZHRoPSIyMCIgc3Ryb2tlPSJibGFjayIgbWFzaz0idXJsKCNzdHJva2UxXzBfNCkiLz4KPC9nPgo8L2c+CjxkZWZzPgo8cGF0aCBpZD0ic3Ryb2tlMF8wXzQiIGQ9Ik00MjguMTIyIDg0My4zODdDMzUxLjkyNyA4NDMuMzg3IDI4MS43NjQgODI1LjI5MSAyMTcuNjMyIDc4OS4wOThDMTUzLjUwMSA3NTIuOTA1IDEwMi43MDQgNzAzLjA2MSA2NS4yNDE3IDYzOS41NjRDMjguNDEzOSA1NzYuMDY4IDEwIDUwNC45NTMgMTAgNDI2LjIxN0MxMCAzNDcuNDgyIDI4LjQxMzkgMjc2LjM2NiA2NS4yNDE3IDIxMi44N0MxMDIuNzA0IDE0OS4zNzQgMTUzLjUwMSA5OS44NDcgMjE3LjYzMiA2NC4yODkyQzI4MS43NjQgMjguMDk2NCAzNTEuOTI3IDEwIDQyOC4xMjIgMTBDNTAzLjY4MyAxMCA1NzMuMjExIDI4LjA5NjQgNjM2LjcwNyA2NC4yODkyQzcwMC44MzggMTAwLjQ4MiA3NTEuMzE4IDE1MC4zMjcgNzg4LjE0NSAyMTMuODIzQzgyNS42MDggMjc3LjMxOSA4NDQuMzM5IDM0OC4xMTcgODQ0LjMzOSA0MjYuMjE3Qzg0NC4zMzkgNTA0Ljk1MyA4MjUuNjA4IDU3Ni4zODYgNzg4LjE0NSA2NDAuNTE3Qzc1MS4zMTggNzA0LjAxMyA3MDEuMTU2IDc1My41NCA2MzcuNjU5IDc4OS4wOThDNTc0LjE2MyA4MjUuMjkxIDUwNC4zMTggODQzLjM4NyA0MjguMTIyIDg0My4zODdaTTQyOC4xMjIgNzc2LjcxNkM0OTEuNjE4IDc3Ni43MTYgNTQ5LjcxNyA3NjEuNDc3IDYwMi40MTkgNzMwLjk5OUM2NTUuMTIxIDcwMC41MjEgNjk2LjcxMSA2NTguNjEzIDcyNy4xODkgNjA1LjI3NkM3NTcuNjY3IDU1MS4zMDUgNzcyLjkwNiA0OTEuNjE4IDc3Mi45MDYgNDI2LjIxN0M3NzIuOTA2IDM2MC4xODEgNzU3LjY2NyAzMDAuODEyIDcyNy4xODkgMjQ4LjExMUM2OTYuNzExIDE5NC43NzQgNjU1LjEyMSAxNTIuODY2IDYwMi40MTkgMTIyLjM4OEM1NDkuNzE3IDkxLjkxIDQ5MS42MTggNzYuNjcxIDQyOC4xMjIgNzYuNjcxQzM2My45OTEgNzYuNjcxIDMwNS41NzUgOTEuOTEgMjUyLjg3MyAxMjIuMzg4QzIwMC4xNzEgMTUyLjIzMSAxNTguNTgxIDE5My44MjEgMTI4LjEwMyAyNDcuMTU4Qzk3LjYyNDcgMzAwLjQ5NSA4Mi4zODU2IDM2MC4xODEgODIuMzg1NiA0MjYuMjE3QzgyLjM4NTYgNDkyLjI1MyA5Ny42MjQ3IDU1MS45NCAxMjguMTAzIDYwNS4yNzZDMTU4LjU4MSA2NTguNjEzIDIwMC4xNzEgNzAwLjUyMSAyNTIuODczIDczMC45OTlDMzA1LjU3NSA3NjEuNDc3IDM2My45OTEgNzc2LjcxNiA0MjguMTIyIDc3Ni43MTZaTTQzMS45MzIgNjQ5LjA4OUMzOTAuNjU5IDY0OS4wODkgMzUzLjUxNCA2MzkuNTY0IDMyMC40OTYgNjIwLjUxNkMyODguMTEzIDYwMC44MzIgMjYyLjcxNSA1NzMuODQ2IDI0NC4zMDEgNTM5LjU1OEMyMjYuNTIyIDUwNC42MzUgMjE3LjYzMiA0NjQuOTUgMjE3LjYzMiA0MjAuNTAzQzIxNy42MzIgMzc2LjA1NSAyMjYuNTIyIDMzNi42ODggMjQ0LjMwMSAzMDIuNEMyNjIuNzE1IDI2OC4xMTIgMjg4LjExMyAyNDEuNDQzIDMyMC40OTYgMjIyLjM5NUMzNTMuNTE0IDIwMy4zNDYgMzkwLjY1OSAxOTMuODIxIDQzMS45MzIgMTkzLjgyMUM0NjkuMzk1IDE5My44MjEgNTAyLjczIDIwMC44MDYgNTMxLjkzOCAyMTQuNzc1QzU2MS4xNDcgMjI4Ljc0NCA1ODQuMzIzIDI0OC40MjggNjAxLjQ2NyAyNzMuODI3QzYxOC42MTEgMjk4LjU5IDYyOC4xMzUgMzI2Ljg0NiA2MzAuMDQgMzU4LjU5NEg1NDkuMDgyQzUzNy42NTMgMjk3LjYzOCA0OTguNjAzIDI2Ny4xNTkgNDMxLjkzMiAyNjcuMTU5QzM4OS4zOSAyNjcuMTU5IDM1Ni42ODkgMjgwLjE3NiAzMzMuODMgMzA2LjIxQzMxMS42MDcgMzMyLjI0MyAzMDAuNDk1IDM3MC4zNDEgMzAwLjQ5NSA0MjAuNTAzQzMwMC40OTUgNDcwLjY2NSAzMTEuOTI0IDUwOS4wOCAzMzQuNzgzIDUzNS43NDhDMzU3LjY0MSA1NjEuNzgyIDM5MC4wMjUgNTc0Ljc5OCA0MzEuOTMyIDU3NC43OThDNTAxLjE0MyA1NzQuNzk4IDU0MC4xOTMgNTQ0LjMyIDU0OS4wODIgNDgzLjM2NEg2MzAuMDRDNjI3LjUgNTE1LjExMiA2MTcuMzQxIDU0My42ODUgNTk5LjU2MiA1NjkuMDg0QzU4Mi40MTggNTkzLjg0NyA1NTkuMjQyIDYxMy41MzEgNTMwLjAzNCA2MjguMTM1QzUwMC44MjUgNjQyLjEwNCA0NjguMTI1IDY0OS4wODkgNDMxLjkzMiA2NDkuMDg5WiIvPgo8L2RlZnM+Cjwvc3ZnPgo="
const BOOT_WORDMARK_CSS = `display:block;width:277.74px;max-width:calc(100vw - 64px);aspect-ratio:7682.3 / 1025.01;background:currentColor;-webkit-mask:var(--mh-boot-wordmark) center / contain no-repeat;mask:var(--mh-boot-wordmark) center / contain no-repeat;`
const BOOT_PRESENTATION_CSS = `
html{--mh-boot-wordmark:url("${BOOT_WORDMARK_SOURCE}");}
html #${BOOT_LABEL_ID}{font-size:0!important;}
html #${BOOT_LABEL_ID}::after{content:"";${BOOT_WORDMARK_CSS}}
@media(max-width:1199px){html #${BOOT_LABEL_ID}::after{width:222.192px;}}
`
const BOOT_FIRST_PAINT_CSS = `
html::before{content:"";position:fixed;top:0;right:0;bottom:auto;left:0;width:100%;height:100vh;min-height:100vh;background:${DEFAULT_BOOT_COLOR};z-index:2147483599;pointer-events:none;}
html::after{content:"";position:fixed;top:50vh;left:50%;transform:translate(-50%,-50%);color:${PAGE_THEME_COLOR};${BOOT_WORDMARK_CSS}z-index:2147483599;pointer-events:none;}
@supports(height:100dvh){html::before{height:100dvh;min-height:100dvh;}html::after{top:50dvh;}}
@media(max-width:1199px){html::after{width:222.192px;}}
@media(max-width:${BOOT_DISABLE_MAX_WIDTH_PX}px),(prefers-reduced-motion:reduce){html::before,html::after{display:none;}}
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
    var coverId = ${JSON.stringify(BOOT_FIRST_PAINT_ID)};
    var bootId = ${JSON.stringify(BOOT_ID)};
    var existingBoot = document.getElementById(bootId);
    if (existingBoot) { holdBootVideos(existingBoot); return; }
    if (document.getElementById(coverId)) return;
    var cover = document.createElement("style");
    cover.id = coverId;
    cover.textContent = ${JSON.stringify(BOOT_FIRST_PAINT_CSS)};
    parent.appendChild(cover);

    var observer = null;
    var released = false;
    var fallbackTimer = 0;
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
    }
    function handoff() {
      var boot = document.getElementById(bootId);
      if (!boot) return false;
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

