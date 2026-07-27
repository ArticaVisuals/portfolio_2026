#!/bin/zsh
set -u

audit_dir="$(cd "$(dirname "$0")" && pwd)"
pwcli="/Users/micahhoang/.codex/skills/playwright/scripts/playwright_cli.sh"
iphone_dir="$audit_dir/iphone"

mkdir -p "$iphone_dir/results" "$iphone_dir/screenshots" "$iphone_dir/console"

routes=(
  "/"
  "/play"
  "/case-studies/motion-connect-2025"
  "/case-studies/highland-harvests"
  "/case-studies/gaia"
)

for index in {1..${#routes[@]}}; do
  route="${routes[$index]}"
  if [[ "$route" == "/" ]]; then
    slug="home"
  else
    slug="${route#/}"
    slug="${slug//\//__}"
  fi
  session="wk-iphone-${index}"
  url="https://micahhoang.com${route}"

  printf '[%02d/%02d] %s\n' "$index" "${#routes[@]}" "$route"
  "$pwcli" --session "$session" open "$url" --browser webkit --device "iPhone 15" \
    >/dev/null
  "$pwcli" --session "$session" sessionstorage-set auditTarget "$url" >/dev/null
  "$pwcli" --session "$session" --raw run-code --filename "$audit_dir/collector.js" \
    > "$iphone_dir/results/${slug}.json"
  "$pwcli" --session "$session" screenshot \
    --filename "$iphone_dir/screenshots/${slug}.png" >/dev/null
  "$pwcli" --session "$session" console warning \
    > "$iphone_dir/console/${slug}.log" 2>&1 || true
  "$pwcli" --session "$session" close >/dev/null 2>&1 || true
done
