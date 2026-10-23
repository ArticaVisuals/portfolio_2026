# Dive Club review pages

The review portfolio reuses native Framer duplicates of Home, About, Gaia,
AirPods Pro 3, Peak Energy, Motion Connect 2025, Simon & Schuster, and National
Park Playing Cards. `dive-routes.json` lists the eight retained Framer page IDs.
The surplus review copies were removed; original portfolio pages are separate.
The retired `/play-hover-preview` page was also removed with the user's explicit
approval; the retained public portfolio pages were not edited for this review.

`dive-head.html` is the exact published custom-code snippet extracted from
`https://micahhoang.com/dive` on October 8, 2026. `dive-navigation.js` is its
inline navigation-script body. The published script passed the VM suite before
replacing the authored local version. Deploy the snippet in the initial head of
exactly the eight review pages. Its final tag is the original scoped Inflight
script. Do not place this snippet on public pages or add a second widget tag.

The bridge keeps the eight review routes connected using full document loads.
Review navigation hides Index, Play, View All and excluded related projects;
service tags become plain labels. External links and downloads remain intact.
The bridge yields to Inflight element picking. During Inflight and native-control
clicks it temporarily excludes underlying media from the shared lightbox's hit
test, without cancelling those controls or changing normal media clicks.
Cloned PageTransition instances
are disabled; shared components are unchanged. Native Framer page settings own
noindex, sitemap exclusion and site-search exclusion.

Run `node --test code/review/dive-navigation.test.cjs` for the 14 navigation and
lightbox-interaction checks. All 14 passed against the final published script.
Run `python3 code/review/check-published-source.py` after publishing for one
read-only source audit of all eight review pages, three ordinary pages and the
sitemap. It saves raw HTML, extracted scripts and a JSON report under
`output/dive-qa/published-source/`.

To test an extracted candidate before updating the canonical files:

```sh
DIVE_NAVIGATION_SOURCE=output/dive-qa/published-source/published-navigation.js DIVE_HEAD_SOURCE=output/dive-qa/published-source/published-head.html node --test code/review/dive-navigation.test.cjs
```

Source checks do not replace browser checks of the widget, reviewer questions,
mobile layout, direct entry, and Back/Forward navigation. The source audit's
latest JSON report records any unresolved publication failures.

Four reviewer questions were saved as Inflight pins on the review Home and Gaia
pages. No Inflight queue-submission form was required for the widget.

Published browser QA also passed: ordinary homepage without Inflight or review
navigation, review Home and About, Gaia direct entry and related links, National
Park's empty related-project section, mobile Home/About/Gaia layouts, browser
Back/Forward, scroll-to-top, and Inflight pin/Send controls over case-study media.
The four questions cover positioning, project order, role/evidence, and mobile
case-study pacing. Final public review URL: https://micahhoang.com/dive.
