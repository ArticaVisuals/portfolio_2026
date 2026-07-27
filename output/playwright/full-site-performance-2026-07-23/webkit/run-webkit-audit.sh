#!/bin/zsh
set -u

audit_dir="$(cd "$(dirname "$0")" && pwd)"
pwcli="/Users/micahhoang/.codex/skills/playwright/scripts/playwright_cli.sh"

mkdir -p "$audit_dir/results" "$audit_dir/screenshots" "$audit_dir/console"

routes=(
  "/"
  "/home-alt"
  "/404"
  "/case-studies"
  "/index"
  "/play"
  "/info"
  "/case-studies/airpods"
  "/case-studies/simon-schuster"
  "/case-studies/motion-connect-2025"
  "/case-studies/national-park-cards"
  "/case-studies/yomo"
  "/case-studies/highland-harvests"
  "/case-studies/gaia"
  "/case-studies/weaponized-innocence"
  "/case-studies/typldn"
  "/case-studies/seek-truth"
  "/case-studies/cellular-symphony"
  "/case-studies/wolff-olins-x-artcenter"
  "/case-studies/independent-lens"
  "/case-studies/peak-energy"
  "/case-studies/whatsapp"
  "/case-studies/karuna"
  "/case-studies/rejuve"
  "/case-studies/belly-bar"
)

start_index="${1:-1}"
end_index="${2:-${#routes[@]}}"

for index in {$start_index..$end_index}; do
  route="${routes[$index]}"
  if [[ "$route" == "/" ]]; then
    slug="home"
  else
    slug="${route#/}"
    slug="${slug//\//__}"
  fi
  session="wk-audit-${index}"
  url="https://micahhoang.com${route}"

  printf '[%02d/%02d] %s\n' "$index" "${#routes[@]}" "$route"
  "$pwcli" --session "$session" open "$url" --browser webkit >/dev/null
  "$pwcli" --session "$session" resize 1440 1000 >/dev/null
  "$pwcli" --session "$session" sessionstorage-set auditTarget "$url" >/dev/null
  "$pwcli" --session "$session" --raw run-code --filename "$audit_dir/collector.js" \
    > "$audit_dir/results/${slug}.json"
  "$pwcli" --session "$session" screenshot \
    --filename "$audit_dir/screenshots/${slug}.png" >/dev/null
  "$pwcli" --session "$session" console warning \
    > "$audit_dir/console/${slug}.log" 2>&1 || true
  "$pwcli" --session "$session" close >/dev/null 2>&1 || true
done
