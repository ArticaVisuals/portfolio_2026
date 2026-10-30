# Mobile navigation repair — 2026-10-29

Published site: https://micahhoang.com/

The mobile header follows the name/MENU → full-screen navigation pattern observed on https://jacob-turner.framer.website/ and https://www.micahtoddwoods.co/. It uses the portfolio's existing Forest Green, Cream, GT Standard, and GT Standard Mono styles.

## Changes

- Native **Hybrid** and **Black** template Phone variants now show the name and a 60×44 MENU slot. Height remains 53px; side gutters remain 20px. Desktop and Tablet variants retain their previous structure and attributes.
- `NavigationScrollGuard.tsx` enhances that slot with a semantic button and a native modal dialog. Work, Play, Index, and About use 42px mobile `type.display-m`; footer and control labels use 13px mono. Links have at least 44px height.
- Close, Escape, focus wrapping, background scroll locking, browser back, and crossing the 810px breakpoint clean up the menu. The menu's scroll lock uses its own CSS class, avoiding interference with preloader and gallery scroll state.
- Mobile header links bypass the desktop page-transition handler. Case-study links still respect the existing lightbox navigation guard, closing the menu before its router fallback completes.
- Mobile Home name, descriptor, and Selected/work headings render in place from the initial HTML. Desktop motion remains unchanged. The static stylesheet uses raw CSS output so Framer's server renderer does not escape selector quotes until hydration.
- `ResumeAssetHost.tsx` pins the updated navigation helper. No changes to PageTransition, Play, gallery content, or desktop link components were needed.

## Native Framer changes

Hybrid template `NHjR7pC8K`, Phone `tK8RS0Jye`:

- `mPjv55W1V` right stack: 60px, end distribution.
- `JjUJtDFce` Work wrapper and `bTyl8cjiq` instance: 60×44; label MENU.
- Hide `P1J41x1ds`, `jqBq37CMl`, `C48qH4tPN` only on Phone.

Black template `oCJITiF9X`, Phone `rzjQrYrtJ`:

- Navigation `yqHCNO5m7`: vertical padding 4.5px, horizontal padding 20px.
- Name `HptKKdT50`: 44px high.
- Right stack `YzVxt8gjS`: 60px; wrapper `S4QcwqEbS` and label `LG607Hxk5`: 60×44, MENU.
- Hide `cRome_BX7`, `LdIsyi8MW`, `qvMcuFD1Q` only on Phone.

Replica node IDs concatenate the Phone ID and source ID. The helper recognizes the native MENU label. Desktop snapshots are saved in `native-desktop-baselines.json`.

The connector's native component creation API was unavailable (`createComponentNode is not a function`). The existing native header and existing helper were extended; no new global component was introduced. The temporary hidden creation attempt was removed.

## Verification

All checks below passed on the published build. Every measured mobile heading had a 0px horizontal and vertical range across first load. All seven route/back checks ended with exactly one menu button, a closed dialog, no menu scroll lock, and no horizontal overflow. No uncaught JavaScript errors occurred. Desktop header pixels and link geometry were identical to the baseline.

See `mobile-results.json`, `desktop-final.json`, and `verify-mobile.js` for the published checks. Screenshots: `mobile-closed.png`, `mobile-open.png`, `desktop-before.png`, `desktop-after.png`.

- Home first-load positions sampled for 3.5 seconds at 320, 390, and 430px.
- Work → About → Play → Index → Work; Gaia and AirPods → About; browser back; menu close and scroll recovery; 810px breakpoint cleanup.
- Keyboard Tab wrapping and Escape/focus restoration.
- Desktop header geometry, links, and the first 53px of screenshot pixels compared at 1440px. Both native desktop template trees checked against their baselines.
- `npm test`: 35 Play performance checks and 56 continuity scenarios passed.

Browser coverage is Chromium with mobile touch emulation, not a physical iPhone/Safari test. The connector reports its existing missing Lenis URL-module type declaration; no new TypeScript diagnostics were introduced.

Existing unrelated Play media requests to files.catbox.moe returned DNS errors in this environment. Those asset references were not changed in this header repair.
