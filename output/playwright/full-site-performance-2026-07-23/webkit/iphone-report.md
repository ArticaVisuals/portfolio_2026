# iPhone WebKit spot check

Device emulation: Playwright iPhone 15 WebKit, 393×659 CSS-pixel visual viewport.
Each route used an isolated cold session and the same observer as the desktop
matrix.

| Requested route | Status / final route | TTFB | FCP | LCP | Load | Requests total (JS/img/media/other/font/fetch) | Images ready/total (failed/lazy) | Videos frame/meta/total; autoplay playing/total | Iframes visible/total | Contracts VM/LB/CTL | H-overflow | Console err/warn | Page errors | Hard/all request failures |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| / | 200 / | 50 | 263 | 600 | 352 | 57 (29/8/0/10/6/2) | 7/7 (0/0) | 4/4/4; 4/4 | 0/1 | 0/0/0 | no | 0/0 | 0 | 0/0 |
| /play | 200 /play | 82 | 196 | 196 | 212 | 90 (21/41/0/24/2/0) | 45/45 (0/0) | 11/11/11; 11/11 | 0/1 | 0/0/0 | no | 0/0 | 0 | 0/0 |
| /case-studies/motion-connect-2025 | 200 /case-studies/motion-connect-2025 | 143 | 543 | 1446 | 2783 | 141 (40/40/0/36/6/7) | 9/9 (0/0) | 6/6/27; 1/6 | 1/2 | 1/1/1 | no | 3/2 | 0 | 3/7 |
| /case-studies/highland-harvests | 200 /case-studies/highland-harvests | 104 | 472 | 844 | 10674 | 156 (34/27/0/80/6/7) | 25/25 (0/0) | 3/3/3; 0/3 | 0/1 | 1/1/1 | no | 0/0 | 0 | 0/11 |
| /case-studies/gaia | 200 /case-studies/gaia | 100 | 619 | 980 | 6187 | 186 (34/44/0/93/6/7) | 22/22 (0/0) | 15/15/15; 1/15 | 0/1 | 1/1/1 | no | 11/0 | 0 | 11/15 |
