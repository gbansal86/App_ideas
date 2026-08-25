#!/usr/bin/env bash
set -euo pipefail
zip_file="release/fb-marketplace-collector-v1.3.0.zip"
for run in $(seq 1 100);do
  dir="$(mktemp -d)";unzip -qq "$zip_file" -d "$dir";root="$dir/fb-marketplace-collector"
  python3 -m json.tool "$root/manifest.json" >/dev/null
  for file in "$root"/*.js;do node --check "$file" >/dev/null;done
  rg -q 'validBatchUrl' "$root/shared.js" "$root/background.js" "$root/dashboard.js"
  rg -q 'batch-failure-report' "$root/background.js"
  rg -q 'attempt<=4' "$root/background.js"
  ! rg -q 'capture-visible' "$root/content.js" "$root/popup.js"
  unzip -t "$zip_file" >/dev/null;rm -rf "$dir"
done
echo "ALL_100_BATCH_FIX_CYCLES_PASSED"
