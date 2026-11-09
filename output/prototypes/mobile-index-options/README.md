# Mobile Index navigation prototypes

Local exploration only. Do not publish to Framer or commit/push without the user selecting a direction.

Run from the portfolio root:

```sh
python3 -m http.server 8768 --bind 127.0.0.1 --directory output/prototypes/mobile-index-options
```

Open http://127.0.0.1:8768/ for the comparison. Each phone has real filters and Grid/List views using a snapshot of 17 public portfolio projects. Project links open the production site in a new tab. Existing GT Standard fonts, cream/green palette, rules, spacing, and 44px targets are reused.

- A, collapsible categories: 204px closed controls, familiar rows, expanded options push work downward.
- B, category dropdowns (recommended): 106px closed controls, direct access to each category, popup overlays the work until closed.
- C, filter drawer: 56px closed controls, most compact, draft selections apply with Show Projects and cancel on dismissal.

Selections within a category use OR; categories combine using AND. Counts summarize selections; full selected values remain inside the controls. Filter state is temporary and does not affect production.

Verification at 320 and 390px: no horizontal overflow; filtering and Grid/List counts agree; drawer cancellation preserves applied state; empty results recover with Clear; no page errors. Focus-check results confirm Reset, Clear, Escape, and drawer dismissal focus restoration. Independent read-only review approved these for local prototype review.
