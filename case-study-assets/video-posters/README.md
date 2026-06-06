# Case-study video posters (generated 2026-06-06)

47 poster stills, one per case-study video, extracted at ~25% of each clip's
duration (so they're representative frames, not black first frames). Generated
with ffmpeg from the live videos on `khaki-ship-257706.framer.app`.

- `poster01.jpg` … `poster47.jpg` — the stills.
- `manifest.tsv` — tab-separated: `originalVideoUrl  ⇥  hostedPosterUrl  ⇥  localPosterPath  ⇥  WxH`.
  Match a video by its source URL to find its poster.

## Why these exist / how to use them

Framer's **API cannot set a poster image on a native `<Video>` node** (only a
`posterEnabled` boolean is exposed) — so most case-study videos (the ones built
with Framer's Video element inside VideoWrappers) can't be postered
programmatically. These stills are pre-made so you can drop them onto each
video's **Poster** slot in the Framer UI, ideally while you re-upload the video
files (the de-cargo step).

Videos rendered by **custom components with a poster field** CAN be postered via
the API and some already were:
- `CaseStudyJustifiedMediaGrid` (`c0iPrbN`) — poster is the 5th `|` field in
  `itemsData`. Motion-connect's video grid (`tbZz127bk`, 3 videos) was set this
  way on 2026-06-06 (currently pointing at the hosted poster URLs in the
  manifest; can be re-pointed at Framer-CDN copies later).
- `ResponsiveCaseStudyVideo` (`bsTLKCt`) — has a `poster` prop (cellular-symphony
  hero already uses one).
- `FixedHeightMediaRows` (`IthLMt_`) — check its itemsData format before relying
  on a poster field.

The hosted poster URLs in the manifest are interim (catbox). For a permanent,
fast home, re-host the chosen posters on Framer's CDN (drag into the editor, or
ingest an image via the backgroundImage trick) — or they'll naturally be set when
you re-upload the videos.
