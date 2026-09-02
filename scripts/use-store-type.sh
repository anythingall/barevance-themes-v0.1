#!/usr/bin/env bash
#
# use-store-type.sh — Switch the homepage layout of this base theme in ONE command.
# Replaces the "paste JSON into templates/index.json" step at store setup.
#
# Usage:
#   scripts/use-store-type.sh <type> [--push]
#
#   <type>   one of:  v1 | one-product        (One Product store)
#                     v2 | multi-style        (Multi Style store)
#                     v3 | multi-product      (Multi Product store)
#   --push   after swapping, run `shopify theme push --only templates/index.json`
#            (otherwise just updates the local file; `shopify theme dev` hot-reloads it)
#
# Examples:
#   scripts/use-store-type.sh v2
#   scripts/use-store-type.sh multi-product --push
#
set -euo pipefail

# Resolve theme root (parent of this script's dir) so it works from anywhere.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TPL="$ROOT/templates"

c_green=$'\033[32m'; c_yellow=$'\033[33m'; c_red=$'\033[31m'; c_bold=$'\033[1m'; c_off=$'\033[0m'

usage() {
  echo "Usage: scripts/use-store-type.sh <v1|v2|v3 | one-product|multi-style|multi-product> [--push]"
  echo ""
  echo "  v1 / one-product   -> One Product store"
  echo "  v2 / multi-style   -> Multi Style store"
  echo "  v3 / multi-product -> Multi Product store"
}

# --- current type helper -------------------------------------------------------
current_type() {
  for t in one-product multi-style multi-product; do
    if [ -f "$TPL/index.$t.json" ] && diff -q "$TPL/index.json" "$TPL/index.$t.json" >/dev/null 2>&1; then
      echo "$t"; return
    fi
  done
  echo "custom/unknown"
}

if [ $# -lt 1 ]; then
  echo "${c_yellow}Homepage hiện tại: ${c_bold}$(current_type)${c_off}"
  echo ""
  usage
  exit 1
fi

# --- map alias -> template name -----------------------------------------------
case "${1:-}" in
  v1|one-product|oneproduct)     TYPE="one-product" ;;
  v2|multi-style|multistyle)     TYPE="multi-style" ;;
  v3|multi-product|multiproduct) TYPE="multi-product" ;;
  -h|--help)                     usage; exit 0 ;;
  *) echo "${c_red}✗ Loại không hợp lệ: '$1'${c_off}"; echo ""; usage; exit 1 ;;
esac

SRC="$TPL/index.$TYPE.json"
DST="$TPL/index.json"

if [ ! -f "$SRC" ]; then
  echo "${c_red}✗ Không tìm thấy $SRC${c_off}"; exit 1
fi

cp "$SRC" "$DST"
echo "${c_green}✓ Homepage đã set = ${c_bold}$TYPE${c_off}${c_green}  (templates/index.json)${c_off}"

# Map to the matching product template for the reminder below.
case "$TYPE" in
  one-product)   PROD_TPL="landing" ;;
  multi-style)   PROD_TPL="multi-style" ;;
  multi-product) PROD_TPL="multi-product" ;;
esac

if [ "${2:-}" = "--push" ]; then
  echo "${c_yellow}→ Pushing templates/index.json …${c_off}"
  ( cd "$ROOT" && shopify theme push --only templates/index.json )
  echo "${c_green}✓ Pushed.${c_off}"
else
  echo "${c_yellow}ℹ Chưa push. 'shopify theme dev' sẽ tự hot-reload; hoặc chạy lại với --push.${c_off}"
fi

echo ""
echo "${c_bold}Việc còn lại (làm trong Admin, click chuột — KHÔNG cần code):${c_off}"
echo "  1. Product page: Admin → Products → [product] → 'Theme template' → chọn '${PROD_TPL}'."
echo "  2. Gắn product/collection vào section trong Theme Editor."
echo "  3. Logo / màu / font / menu: Theme settings + Navigation."
echo "  (Xem docs/SETUP-NEW-STORE.md)"
