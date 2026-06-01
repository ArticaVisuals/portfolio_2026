# Karuna FixedHeightMediaRows Snapshot

**Date:** June 1, 2026  
**Framer project:** Micah Hoang Portfolio  
**Page:** `/case-studies/karuna`  
**Gallery wrapper node:** `J0UPJEHoL`  
**Active gallery component node:** `niVxmfMHW`  
**Code component:** `FixedHeightMediaRows.tsx` (`IthLMt_`)

## Purpose

This snapshot records the Karuna process gallery state after rebuilding the section as a single dynamic, Cargo-style justified media gallery instead of separate stacked row sections.

## Confirmed Framer State

`J0UPJEHoL` contains one `FixedHeightMediaRows` component instance and no extra manual row stacks.

Active instance settings:

```text
sourceMode="items"
heightMode="gallery"
galleryHeight="767"
targetRowHeight="360"
minRowHeight="160"
maxRowHeight="900"
gap="20"
mobileGap="10"
stackBelow="560"
objectFit="cover"
autoplay="true"
loop="true"
muted="true"
controls="false"
```

The migrated fallback media data contains seven Karuna process items. With the current aspect ratios and a 1160px content width, the dynamic gallery solver resolves to:

```text
Row 1: 4 items, ~419px tall
Row 2: 3 items, ~328px tall
Total gallery block: ~767px including the 20px row gap
```

## Component Behavior

`FixedHeightMediaRows.tsx` now:

- Reads actual loaded image/video dimensions at runtime.
- Falls back to provided ratios only until the browser can measure the media.
- Supports dynamic row packing from target row height.
- Supports `Gallery` height mode, where the component chooses the most balanced row breaks for a target total gallery height.
- Keeps each row filling the full container width.
- Exposes Framer `ResponsiveImage` and `File` controls in the `Media` array for future native image/video additions.
- Supports `Break After` per media item for manual row control.

## Media Sources

Current migrated fallback media:

```text
video|0.5625|https://freight.cargo.site/t/original/i/F2143215706599293770059626042901/IMG_0581.MOV|Karuna process video
video|0.563|https://freight.cargo.site/t/original/i/L2147338474191386712346829510165/IMG_0694-Apple-Devices-HD-Best-Quality.m4v|Karuna package video
image|0.75|https://framerusercontent.com/images/P8Va3qQpXe60Xp3J8Fc5btBuc0.jpg|Karuna process photo
image|0.75|https://framerusercontent.com/images/lWhohMtqXt0QEjYQEPuEDbw.jpg|Karuna process photo
image|1.3333|https://framerusercontent.com/images/l6TAIcU0M8tPLu2LiDkvg1kJy98.jpg|Karuna process photo
image|0.75|https://framerusercontent.com/images/znLwUPVvKVqMglOkpzOb9kPEvGM.jpg|Karuna process photo
image|1.3333|https://framerusercontent.com/images/GmqmdRcnDCML0GnNJdcQRJgEqQ.jpg|Karuna process photo
```

Downloaded local video source files for native re-upload:

```text
Framer Assets/Karuna Process/IMG_0581.MOV
Framer Assets/Karuna Process/IMG_0694-Apple-Devices-HD-Best-Quality.m4v
```

## Publish Status

Framer MCP reported an optimized production/staging deployment at:

```text
2026-06-01T19:10:59.744Z
https://khaki-ship-257706.framer.app/case-studies/karuna
```

This deployment timestamp predates the final `FixedHeightMediaRows` rebuild in this session. The current project state is saved in Framer, but the exposed MCP toolset does not include a publish command. Publishing must be done from the logged-in Framer editor UI.

## Known Limitation

The Framer MCP does not expose `framer.uploadFile(...)` or an equivalent native video upload operation. The two Cargo videos were downloaded locally and the component exposes native `File` controls, but the actual Framer-hosted video upload has to be completed through the Framer UI or a future tool that exposes Framer file upload.
