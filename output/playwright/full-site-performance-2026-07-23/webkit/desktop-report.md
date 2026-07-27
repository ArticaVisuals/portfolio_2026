# Desktop WebKit full-site audit

Viewport: 1440×1000 CSS pixels. Timings are milliseconds from one isolated cold
WebKit session per route, with a 4-second post-load observation window (1.2
seconds for known missing routes). Transfer bytes are intentionally omitted
because WebKit does not expose them reliably.

| Requested route | Status / final route | TTFB | FCP | LCP | Load | Requests total (JS/img/media/other/font/fetch) | Images ready/total (failed/lazy) | Videos frame/meta/total; autoplay playing/total | Iframes visible/total | Contracts VM/LB/CTL | H-overflow | Console err/warn | Page errors | Hard/all request failures |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| / | 200 / | 58 | 289 | 668 | 388 | 57 (29/8/0/10/6/2) | 7/7 (0/0) | 4/4/4; 4/4 | 0/1 | 0/0/0 | no | 0/0 | 0 | 0/0 |
| /home-alt | 200 /home-alt | 65 | 287 | 620 | 378 | 54 (27/8/0/10/5/2) | 7/7 (0/0) | 4/4/4; 4/4 | 0/1 | 0/0/0 | no | 0/0 | 0 | 0/0 |
| /404 | 404 /404 | 73 | 220 | 220 | 236 | 31 (22/0/0/2/5/0) | 0/0 (0/0) | 0/0/0; 0/0 | 0/1 | 0/0/0 | no | 1/0 | 0 | 0/0 |
| /case-studies | 200 /index | 0 | 124 | 170 | 188 | 62 (40/1/0/4/10/4) | 1/15 (0/14) | 0/0/0; 0/0 | 0/1 | 0/0/0 | no | 0/5 | 6 | 0/4 |
| /index | 200 /index | 127 | 252 | 295 | 311 | 35 (24/1/0/2/4/2) | 1/15 (0/14) | 0/0/0; 0/0 | 0/1 | 0/0/0 | no | 0/3 | 0 | 0/0 |
| /play | 200 /play | 55 | 174 | 2380 | 190 | 114 (21/41/0/48/2/0) | 94/94 (0/0) | 16/16/16; 16/16 | 0/1 | 0/0/0 | no | 0/0 | 0 | 0/0 |
| /info | 200 /info | 82 | 156 | 352 | 371 | 35 (24/1/0/2/6/0) | 1/1 (0/0) | 0/0/0; 0/0 | 0/1 | 0/0/0 | no | 0/0 | 0 | 0/0 |
| /case-studies/airpods | 200 /case-studies/airpods | 52 | 481 | 832 | 1625 | 109 (32/31/0/32/5/7) | 8/8 (0/0) | 3/11/11; 1/3 | 0/1 | 1/1/1 | no | 0/0 | 0 | 0/8 |
| /case-studies/simon-schuster | 200 /case-studies/simon-schuster | 53 | 487 | 768 | 786 | 113 (42/49/0/8/5/7) | 41/96 (0/55) | 0/3/3; 0/0 | 0/1 | 1/1/1 | no | 3/0 | 0 | 3/6 |
| /case-studies/motion-connect-2025 | 200 /case-studies/motion-connect-2025 | 80 | 498 | 1387 | 3434 | 141 (40/41/0/36/5/7) | 9/9 (0/0) | 6/6/27; 1/6 | 1/2 | 1/1/1 | no | 9/2 | 0 | 9/13 |
| /case-studies/national-park-cards | 200 /case-studies/national-park-cards | 99 | 478 | 764 | 969 | 91 (34/26/0/17/5/7) | 19/24 (0/5) | 0/7/7; 0/0 | 0/1 | 1/1/1 | no | 0/0 | 0 | 0/2 |
| /case-studies/yomo | 200 /case-studies/yomo | 50 | 400 | 652 | 648 | 76 (34/26/0/2/5/7) | 26/26 (0/0) | 0/0/2; 0/0 | 0/1 | 1/1/1 | no | 0/0 | 0 | 0/0 |
| /case-studies/highland-harvests | 200 /case-studies/highland-harvests | 54 | 401 | 744 | 10716 | 176 (34/28/0/100/5/7) | 25/25 (0/0) | 3/3/3; 0/3 | 0/1 | 1/1/1 | no | 0/0 | 0 | 0/9 |
| /case-studies/gaia | 200 /case-studies/gaia | 50 | 603 | 988 | 3243 | 176 (34/49/0/79/5/7) | 17/24 (0/7) | 16/16/16; 1/16 | 0/1 | 1/1/1 | no | 8/0 | 0 | 8/8 |
| /case-studies/weaponized-innocence | 200 /case-studies/weaponized-innocence | 52 | 415 | 664 | 11516 | 113 (35/57/0/7/5/7) | 44/56 (0/12) | 2/2/2; 0/2 | 0/1 | 1/1/1 | no | 0/0 | 0 | 0/2 |
| /case-studies/typldn | 200 /case-studies/typldn | 91 | 210 | 352 | 1246 | 71 (32/19/0/6/5/7) | 9/14 (0/5) | 2/2/6; 0/2 | 0/1 | 1/1/1 | no | 0/0 | 0 | 0/0 |
| /case-studies/seek-truth | 200 /case-studies/seek-truth | 107 | 190 | 532 | 1439 | 143 (35/76/0/17/6/7) | 73/86 (0/13) | 3/3/3; 0/3 | 0/1 | 1/1/1 | no | 0/0 | 0 | 0/1 |
| /case-studies/cellular-symphony | 200 /case-studies/cellular-symphony | 154 | 225 | 401 | 464 | 79 (37/22/0/4/5/7) | 18/22 (0/4) | 1/1/1; 0/1 | 1/2 | 1/1/0 | no | 0/0 | 0 | 0/0 |
| /case-studies/wolff-olins-x-artcenter | 200 /case-studies/wolff-olins-x-artcenter | 54 | 181 | 336 | 3143 | 85 (31/19/0/21/5/7) | 15/15 (0/0) | 5/5/10; 5/5 | 0/1 | 0/0/0 | no | 0/0 | 0 | 0/1 |
| /case-studies/independent-lens | 200 /case-studies/independent-lens | 87 | 442 | 732 | 1165 | 69 (34/17/0/4/5/7) | 17/17 (0/0) | 1/1/1; 0/1 | 0/1 | 1/1/1 | no | 0/0 | 0 | 0/0 |
| /case-studies/peak-energy | 200 /case-studies/peak-energy | 54 | 386 | 578 | 2302 | 182 (38/56/0/59/5/7) | 8/8 (0/0) | 10/10/10; 1/10 | 2/3 | 1/1/1 | no | 11/0 | 0 | 11/14 |
| /case-studies/whatsapp | 200 /case-studies/whatsapp | 132 | 321 | 468 | 410 | 67 (27/11/0/15/5/7) | 3/3 (0/0) | 6/6/11; 6/7 | 0/1 | 0/0/0 | no | 1/0 | 0 | 1/1 |
| /case-studies/karuna | 404 /case-studies/karuna | 50 | 206 | 206 | 222 | 31 (22/0/0/2/5/0) | 0/0 (0/0) | 0/0/0; 0/0 | 0/1 | 0/0/0 | no | 1/0 | 0 | 0/0 |
| /case-studies/rejuve | 404 /case-studies/rejuve | 131 | 273 | 273 | 289 | 31 (22/0/0/2/5/0) | 0/0 (0/0) | 0/0/0; 0/0 | 0/1 | 0/0/0 | no | 1/0 | 0 | 0/0 |
| /case-studies/belly-bar | 404 /case-studies/belly-bar | 47 | 266 | 266 | 282 | 31 (22/0/0/2/5/0) | 0/0 (0/0) | 0/0/0; 0/0 | 0/1 | 0/0/0 | no | 1/0 | 0 | 0/0 |

Legend:

- Video readiness is frame-ready / metadata-ready / total, followed by autoplay
  playing / autoplay total.
- Contracts are `data-casestudy-videomanager` /
  `data-casestudy-lightbox` / `data-casestudy-controllers`.
- Request failures marked "hard" exclude intentional/canceled requests.
- Lazy images are not counted as failed.
