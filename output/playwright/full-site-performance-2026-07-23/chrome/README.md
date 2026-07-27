# Full-Site Desktop Chrome Performance Audit

Generated 2026-07-23T20:01:43.154Z. Raw per-route JSON is stored alongside this report.

## Method

- Google Chrome driven through the required Playwright CLI wrapper.
- A fresh named browser session for every route, 1440×1000 viewport, browser cache disabled.
- Cold initial viewport load only; no scrolling or interaction.
- Metrics were captured after a 6-second settle window. Known 404 routes used 1.5 seconds.
- Transfer is CDP encoded network bytes. Media range/chunk requests are counted as Chrome reported them.
- DOM readiness is a post-settle snapshot; below-the-fold lazy assets may intentionally remain incomplete.

## Ranked Findings

1. **Media transfer dominates the heaviest pages.** Highland Harvests transferred **111.31 MiB**, followed by Motion Connect at **101.46 MiB**, Gaia at **78.62 MiB**, Seek Truth at **44.52 MiB**, and Peak Energy at **36.86 MiB**. Media accounts for roughly 85–94% of the first, second, third, and fifth pages.
2. **Identical large media URLs are fetched repeatedly during one cold load.** Highland Harvests fetched the 23.43 MiB `CuwjJC…mov` four times (93.74 MiB weighted). Motion Connect fetched `fB1U…mp4` four times and `bZzI…mp4` four times. Seek Truth fetched its 8.43 MiB hero video three times, and Gaia fetched several large MP4s three times each.
3. **Runtime markers do not guarantee transfer gating.** Gaia has all three case-study markers but all 16 videos reached ready state and transferred 70.81 MiB. Peak Energy has all markers but all 10 videos became ready and transferred 34.24 MiB. Highland Harvests has all markers but all 3 videos became ready and transferred 104.82 MiB. Motion Connect is the clearest gated case: 21 of 27 videos use `preload="none"`, yet the six ready videos plus repeated requests still cost 86.19 MiB.
4. **Runtime coverage is incomplete on three live case studies.** WhatsApp and Wolff Olins expose none of the video-manager, lightbox, or controller markers. Cellular Symphony has video-manager and lightbox markers but no controller marker.
5. **CLS is the main Core Web Vitals failure.** Gaia measured **1.452 CLS** and Motion Connect **1.439**. `/index`, the `/case-studies → /index` redirect target, and the home page also exceed 0.25. LCP stayed at or below 2432 ms on every route, with `/play` the slowest.
6. **Load completion is held open by media on six pages.** Gaia, Peak Energy, AirPods, Simon & Schuster, Motion Connect, and National Park Cards all report load-event completion around 7.0–7.6 seconds even though FCP/LCP arrive much earlier.
7. **Third-party fallback media is unreliable in this Chrome run.** `files.catbox.moe` poster/video requests failed with `ERR_INVALID_HANDLE` on 7 live pages. Numerous `ERR_ABORTED` video requests appear where source swapping or runtime gating cancels media; these are listed separately from page exceptions in raw JSON.
8. **No uncaught page exceptions were observed on live routes.** 0 live pages emitted a Playwright `pageerror`; 8 emitted console errors, mostly failed Catbox media plus Cellular Symphony's third-party Cloudflare/401 messages.
9. **Potential-route outcomes are now explicit.** `/case-studies` fully renders by redirecting to `/index`; `/home-alt` and `/case-studies/typldn` fully render in-browser. `/404`, `/case-studies/karuna`, `/case-studies/rejuve`, and `/case-studies/belly-bar` are true 404s (4 audited 404 routes); the three case-study URLs retain the requested final URL but canonicalize to `/404`. The live Karuna content is `/case-studies/highland-harvests`.
10. **`/play` is material but not the site's largest page.** It transferred **11.82 MiB**: **9.63 MiB media** and **1.74 MiB images**. All 94 DOM images and the current 16-video budget were ready after settling; LCP was 2432 ms.

## Heaviest Pages

| Rank | Route | Total MiB | Media MiB | Image MiB | Requests | LCP ms | Load ms |
|---:|---|---:|---:|---:|---:|---:|---:|
| 1 | `/case-studies/highland-harvests` | 111.31 | 104.82 | 5.75 | 106 | 864 | 3803 |
| 2 | `/case-studies/motion-connect-2025` | 101.46 | 86.19 | 14.52 | 113 | 1368 | 7123 |
| 3 | `/case-studies/gaia` | 78.62 | 70.81 | 7.07 | 129 | 1240 | 7643 |
| 4 | `/case-studies/seek-truth` | 44.52 | 28.48 | 15.23 | 129 | 696 | 1639 |
| 5 | `/case-studies/peak-energy` | 36.86 | 34.24 | 1.89 | 108 | 424 | 7336 |
| 6 | `/case-studies/simon-schuster` | 21.05 | 0 | 20.30 | 127 | 948 | 7141 |
| 7 | `/case-studies/weaponized-innocence` | 15.56 | 2.15 | 12.66 | 92 | 1044 | 1084 |
| 8 | `/case-studies/wolff-olins-x-artcenter` | 13.43 | 9.91 | 2.80 | 80 | 668 | 849 |
| 9 | `/play` | 11.82 | 9.63 | 1.74 | 104 | 2432 | 1106 |
| 10 | `/case-studies/airpods` | 11.29 | 9.78 | 0.78 | 104 | 884 | 7278 |
| 11 | `/case-studies/whatsapp` | 9.02 | 7.60 | 0.72 | 73 | 1072 | 4306 |
| 12 | `/home-alt` | 7.51 | 5.88 | 1.10 | 55 | 500 | 754 |
| 13 | `/` | 7.50 | 5.88 | 1.10 | 51 | 576 | 749 |
| 14 | `/case-studies/national-park-cards` | 4.98 | 0.04 | 4.20 | 92 | 892 | 6991 |
| 15 | `/case-studies/yomo` | 3.86 | 0 | 3.13 | 82 | 1104 | 1082 |

## Complete Route Results

Timing is TTFB/FCP/LCP/load in milliseconds. Transfer types are media/image/script/font/document in MiB. Long tasks are count/total milliseconds. Requests are total/failed.

| Route | Status / final | Timing ms | CLS | Long tasks | Total MiB | M/I/JS/F/Doc MiB | Requests | Images ready | Videos ready | Console + page errors |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `/` | 200 | 62/444/576/749 | 0.291 | 1/121 | 7.50 | 5.88/1.10/0.32/0.13/0.03 | 51/0 | 7/7 | 4/4 | 0 |
| `/home-alt` | 200 | 55/384/500/754 | 0.148 | 1/109 | 7.51 | 5.88/1.10/0.35/0.12/0.03 | 55/0 | 7/7 | 4/4 | 0 |
| `/404` | 404 | 56/408/408/732 | 0.003 | 0/0 | 0.48 | 0/0/0.37/0.07/0.02 | 47/0 | 0/0 | 0/0 | 1 |
| `/case-studies` | 200 → /index | 53/296/296/412 | 0.326 | 2/199 | 1.30 | 0/0.38/0.63/0.19/0.05 | 82/0 | 15/15 | 0/0 | 0 |
| `/index` | 200 | 95/416/492/718 | 0.327 | 2/142 | 0.96 | 0/0.38/0.36/0.14/0.03 | 60/0 | 15/15 | 0/0 | 0 |
| `/play` | 200 | 79/616/2432/1106 | 0 | 0/0 | 11.82 | 9.63/1.74/0.36/0.04/0.03 | 104/0 | 94/94 | 16/16 | 0 |
| `/info` | 200 | 97/440/548/731 | 0 | 0/0 | 0.57 | 0/0.04/0.36/0.13/0.03 | 47/0 | 1/1 | 0/0 | 0 |
| `/case-studies/airpods` | 200 | 54/380/884/7278 | 0 | 1/253 | 11.29 | 9.78/0.78/0.41/0.13/0.03 | 104/19 | 5/8 | 11/11 | 7 |
| `/case-studies/simon-schuster` | 200 | 51/424/948/7141 | 0 | 1/244 | 21.05 | 0/20.30/0.42/0.13/0.04 | 127/6 | 21/96 | 3/3 | 3 |
| `/case-studies/motion-connect-2025` | 200 | 55/436/1368/7123 | 1.439 | 1/241 | 101.46 | 86.19/14.52/0.41/0.13/0.03 | 113/7 | 4/9 | 6/27 | 6 |
| `/case-studies/national-park-cards` | 200 | 55/376/892/6991 | 0 | 1/212 | 4.98 | 0.04/4.20/0.41/0.13/0.03 | 92/10 | 14/24 | 7/7 | 2 |
| `/case-studies/yomo` | 200 | 51/448/1104/1082 | 0 | 1/179 | 3.86 | 0/3.13/0.41/0.13/0.03 | 82/0 | 23/26 | 0/2 | 0 |
| `/case-studies/highland-harvests` | 200 | 59/340/864/3803 | 0 | 2/209 | 111.31 | 104.82/5.75/0.42/0.13/0.03 | 106/12 | 13/25 | 3/3 | 0 |
| `/case-studies/gaia` | 200 | 52/564/1240/7643 | 1.452 | 1/269 | 78.62 | 70.81/7.07/0.41/0.13/0.03 | 129/9 | 8/24 | 16/16 | 6 |
| `/case-studies/weaponized-innocence` | 200 | 59/316/1044/1084 | 0.001 | 1/194 | 15.56 | 2.15/12.66/0.42/0.13/0.03 | 92/2 | 15/56 | 2/2 | 0 |
| `/case-studies/typldn` | 200 | 50/376/716/693 | 0 | 0/0 | 3.39 | 1.11/1.56/0.41/0.13/0.03 | 69/0 | 6/14 | 2/6 | 0 |
| `/case-studies/seek-truth` | 200 | 49/416/696/1639 | 0 | 0/0 | 44.52 | 28.48/15.23/0.41/0.19/0.03 | 129/0 | 43/86 | 3/3 | 0 |
| `/case-studies/cellular-symphony` | 200 | 49/328/328/1096 | 0 | 1/123 | 2.97 | 1.94/0.30/0.40/0.13/0.03 | 79/0 | 9/22 | 1/1 | 3 |
| `/case-studies/wolff-olins-x-artcenter` | 200 | 54/400/668/849 | 0 | 0/0 | 13.43 | 9.91/2.80/0.39/0.13/0.03 | 80/2 | 5/15 | 5/10 | 0 |
| `/case-studies/independent-lens` | 200 | 55/424/876/923 | 0 | 1/152 | 2.87 | 0.70/1.45/0.40/0.13/0.03 | 74/0 | 9/17 | 1/1 | 0 |
| `/case-studies/peak-energy` | 200 | 63/424/424/7336 | 0 | 1/167 | 36.86 | 34.24/1.89/0.40/0.13/0.03 | 108/12 | 1/8 | 10/10 | 6 |
| `/case-studies/whatsapp` | 200 | 137/804/1072/4306 | 0.078 | 1/69 | 9.02 | 7.60/0.72/0.38/0.13/0.03 | 73/1 | 3/3 | 6/11 | 1 |
| `/case-studies/karuna` | 404 | 58/316/340/644 | 0.005 | 0/0 | 0.48 | 0/0/0.37/0.07/0.02 | 47/0 | 0/0 | 0/0 | 1 |
| `/case-studies/rejuve` | 404 | 51/376/376/597 | 0.004 | 0/0 | 0.48 | 0/0/0.37/0.07/0.02 | 47/0 | 0/0 | 0/0 | 1 |
| `/case-studies/belly-bar` | 404 | 120/436/436/631 | 0.006 | 0/0 | 0.48 | 0/0/0.37/0.07/0.02 | 47/0 | 0/0 | 0/0 | 1 |

## Case-Study Runtime Coverage

Markers are video-manager/lightbox/controllers. Autoplay is playing/declared; playing is all currently playing/all video elements.

| Route | Status | Markers VM/LB/C | Autoplay | Playing | Preload none | Ready | Media MiB | Failed requests |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `/case-studies/airpods` | 200 | 1/1/1 | 1/3 | 1/11 | 0 | 11/11 | 9.78 | 19 |
| `/case-studies/simon-schuster` | 200 | 1/1/1 | 0/0 | 0/3 | 0 | 3/3 | 0 | 6 |
| `/case-studies/motion-connect-2025` | 200 | 1/1/1 | 1/6 | 1/27 | 21 | 6/27 | 86.19 | 7 |
| `/case-studies/national-park-cards` | 200 | 1/1/1 | 0/0 | 0/7 | 0 | 7/7 | 0.04 | 10 |
| `/case-studies/yomo` | 200 | 1/1/1 | 0/0 | 0/2 | 2 | 0/2 | 0 | 0 |
| `/case-studies/highland-harvests` | 200 | 1/1/1 | 0/3 | 0/3 | 0 | 3/3 | 104.82 | 12 |
| `/case-studies/gaia` | 200 | 1/1/1 | 1/16 | 1/16 | 0 | 16/16 | 70.81 | 9 |
| `/case-studies/weaponized-innocence` | 200 | 1/1/1 | 0/2 | 0/2 | 0 | 2/2 | 2.15 | 2 |
| `/case-studies/typldn` | 200 | 1/1/1 | 0/2 | 0/6 | 4 | 2/6 | 1.11 | 0 |
| `/case-studies/seek-truth` | 200 | 1/1/1 | 0/3 | 0/3 | 0 | 3/3 | 28.48 | 0 |
| `/case-studies/cellular-symphony` | 200 | 1/1/0 | 0/1 | 0/1 | 0 | 1/1 | 1.94 | 0 |
| `/case-studies/wolff-olins-x-artcenter` | 200 | 0/0/0 | 0/5 | 0/10 | 5 | 5/10 | 9.91 | 2 |
| `/case-studies/independent-lens` | 200 | 1/1/1 | 0/1 | 0/1 | 0 | 1/1 | 0.70 | 0 |
| `/case-studies/peak-energy` | 200 | 1/1/1 | 1/10 | 1/10 | 0 | 10/10 | 34.24 | 12 |
| `/case-studies/whatsapp` | 200 | 0/0/0 | 3/7 | 3/11 | 4 | 6/11 | 7.60 | 1 |
| `/case-studies/karuna` | 404 | 404 | 0/0 | 0/0 | 0 | 0/0 | 0 | 0 |
| `/case-studies/rejuve` | 404 | 404 | 0/0 | 0/0 | 0 | 0/0 | 0 | 0 |
| `/case-studies/belly-bar` | 404 | 404 | 0/0 | 0/0 | 0 | 0/0 | 0 | 0 |

## Top Weighted Assets

Weighted transfer sums repeated requests for the same URL across the audited cold loads. This ranking is aggregated from each route's 20 largest requests.

| Rank | Type | Asset | Max request MiB | Request occurrences | Weighted MiB | Routes |
|---:|---|---|---:|---:|---:|---|
| 1 | Media | [CuwjJC6XqPPJiccUNiIeQJWp9e8.mov](https://framerusercontent.com/assets/CuwjJC6XqPPJiccUNiIeQJWp9e8.mov) | 23.43 | 4 | 93.74 | `/case-studies/highland-harvests` |
| 2 | Media | [fB1UokXRbC9y9v6p4jHE2sdVw.mp4](https://framerusercontent.com/assets/fB1UokXRbC9y9v6p4jHE2sdVw.mp4) | 6.76 | 4 | 27.06 | `/case-studies/motion-connect-2025` |
| 3 | Media | [XDoK5oZ8u2z7XAaiilHvljfEHBE.mp4](https://framerusercontent.com/assets/XDoK5oZ8u2z7XAaiilHvljfEHBE.mp4) | 8.43 | 3 | 25.30 | `/case-studies/seek-truth` |
| 4 | Media | [bZzIGGcdr27KAso8g1l9AEnulCo.mp4](https://framerusercontent.com/assets/bZzIGGcdr27KAso8g1l9AEnulCo.mp4) | 6.13 | 4 | 24.53 | `/case-studies/motion-connect-2025` |
| 5 | Media | [gFR7q15nPC48QC7ap45JjG12riY.mp4](https://framerusercontent.com/assets/gFR7q15nPC48QC7ap45JjG12riY.mp4) | 7.13 | 3 | 21.40 | `/case-studies/gaia` |
| 6 | Media | [MwQgxBbaiEE9PyqwTShCkltEUY.mp4](https://framerusercontent.com/assets/MwQgxBbaiEE9PyqwTShCkltEUY.mp4) | 3.77 | 5 | 18.85 | `/`, `/home-alt`, `/case-studies/airpods`, `/case-studies/gaia`, `/case-studies/peak-energy` |
| 7 | Media | [YTha6qQtYqtUuIUE9g1ffdEVKc.mp4](https://framerusercontent.com/assets/YTha6qQtYqtUuIUE9g1ffdEVKc.mp4) | 8.54 | 2 | 17.08 | `/case-studies/peak-energy` |
| 8 | Media | [WBfSwlJMaWbkJMRpHfYzlbZPLl4.mp4](https://framerusercontent.com/assets/WBfSwlJMaWbkJMRpHfYzlbZPLl4.mp4) | 7.38 | 2 | 14.77 | `/case-studies/motion-connect-2025` |
| 9 | Media | [dpqOPTuyEtCuEw9TsvIGBZULM.mp4](https://framerusercontent.com/assets/dpqOPTuyEtCuEw9TsvIGBZULM.mp4) | 3.94 | 3 | 11.82 | `/case-studies/gaia` |
| 10 | Media | [N7B0pGK0GOo6vmomtmkS3tBriiU.m4v](https://framerusercontent.com/assets/N7B0pGK0GOo6vmomtmkS3tBriiU.m4v) | 5.35 | 2 | 10.70 | `/case-studies/highland-harvests` |
| 11 | Image | [AssBcap80PiboGZcCTvZdBzxMI.png](https://framerusercontent.com/images/AssBcap80PiboGZcCTvZdBzxMI.png) | 10.37 | 1 | 10.37 | `/case-studies/motion-connect-2025` |
| 12 | Media | [TnTBiMq8cIakgl5VM28aQcE2gbE.mp4](https://framerusercontent.com/assets/TnTBiMq8cIakgl5VM28aQcE2gbE.mp4) | 3.31 | 3 | 9.94 | `/case-studies/gaia` |
| 13 | Media | [1C2aMBrHIm6dxQeXcdJcqDx0xs0.mp4](https://framerusercontent.com/assets/1C2aMBrHIm6dxQeXcdJcqDx0xs0.mp4) | 2.23 | 4 | 8.92 | `/case-studies/motion-connect-2025` |
| 14 | Media | [xFNYAo0QzdwSajgUHI3bDjcOf38.mp4](https://framerusercontent.com/assets/xFNYAo0QzdwSajgUHI3bDjcOf38.mp4) | 2.58 | 3 | 7.75 | `/case-studies/gaia` |
| 15 | Media | [dCRutmC1dwoz5Zq4iytCOHvrt8.mp4](https://framerusercontent.com/assets/dCRutmC1dwoz5Zq4iytCOHvrt8.mp4) | 7.30 | 1 | 7.30 | `/case-studies/motion-connect-2025` |
| 16 | Media | [6kI8ukCrbvBwM7zCO08wjY5pyo.mp4](https://framerusercontent.com/assets/6kI8ukCrbvBwM7zCO08wjY5pyo.mp4) | 1.94 | 3 | 5.83 | `/case-studies/weaponized-innocence`, `/case-studies/cellular-symphony`, `/case-studies/wolff-olins-x-artcenter` |
| 17 | Media | [Wolff-Olins-Slide-10.mp4](https://freight.cargo.site/t/original/i/N1655931692761862119294608070165/Wolff-Olins-Slide-10.mp4) | 2.57 | 2 | 5.13 | `/case-studies/wolff-olins-x-artcenter` |
| 18 | Media | [h3NSQj4n1g74pvOIvpgW19h1Qk.mp4](https://framerusercontent.com/assets/h3NSQj4n1g74pvOIvpgW19h1Qk.mp4) | 1 | 5 | 5 | `/`, `/home-alt`, `/case-studies/airpods`, `/case-studies/gaia`, `/case-studies/whatsapp` |
| 19 | Media | [iEdEhtbqCl66mHv5MKpCclJeb0.mp4](https://framerusercontent.com/assets/iEdEhtbqCl66mHv5MKpCclJeb0.mp4) | 4.89 | 1 | 4.89 | `/case-studies/airpods` |
| 20 | Image | [bcJChy8t259iDTbBLlhHmVm5pK0.jpg](https://framerusercontent.com/images/bcJChy8t259iDTbBLlhHmVm5pK0.jpg) | 4.28 | 1 | 4.28 | `/case-studies/simon-schuster` |

## Artifacts

- `summary.json` contains every result and all rankings.
- `01-home.json` through `25-case-studies--belly-bar.json` contain raw route metrics, transfer breakdowns, largest requests, readiness, console output, and request failures.
- `audit-route.js`, `run-audit.mjs`, `rerun-route.mjs`, and `build-report.mjs` preserve the reproducible Playwright workflow.
