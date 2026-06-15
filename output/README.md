# Output Artifacts

This folder holds generated audit, scrape, and browser/Playwright QA artifacts.
It is useful historical evidence, but it is not the live Framer source.

Keep existing paths stable unless a cleanup pass also updates documentation that
references them. Current docs point at many paths under `output/playwright/...`.

Suggested use:

- `output/playwright/` - browser QA runs, screenshots, traces, and result JSON.
- `output/media-compression-audit-*` - media optimization/compression audits.
- Other folders - one-off generated artifacts from previous portfolio work.

For the broader cleanup plan, see `../workspace-organization-plan.md`.
