#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_DIR="$ROOT_DIR/dist"
VERSION="$(node -e "process.stdout.write(require('$ROOT_DIR/manifest.source.json').version)")"

COMMON_FILES=(
  "content.js"
  "styles.css"
  "assets/icon-16.png"
  "assets/icon-32.png"
  "assets/icon-48.png"
  "assets/icon-128.png"
)

generate_icons() {
  local size

  if ! command -v rsvg-convert >/dev/null 2>&1 && ! command -v magick >/dev/null 2>&1; then
    echo "Either 'rsvg-convert' or ImageMagick 'magick' is required to generate icon PNGs." >&2
    exit 1
  fi

  for size in 16 32 48 128; do
    if command -v rsvg-convert >/dev/null 2>&1; then
      rsvg-convert -w "$size" -h "$size" "$ROOT_DIR/assets/icon.svg" -o "$ROOT_DIR/assets/icon-${size}.png"
    else
      magick -background none "$ROOT_DIR/assets/icon.svg" -resize "${size}x${size}" "$ROOT_DIR/assets/icon-${size}.png"
    fi
  done
}

build_package() {
  local browser="$1"
  local source_manifest="$2"
  local package_name="gmail-search-in-inbox-${browser}-v${VERSION}.zip"
  local package_dir

  package_dir="$(mktemp -d)"
  trap 'rm -rf "$package_dir"' RETURN

  cp "$ROOT_DIR/$source_manifest" "$package_dir/manifest.json"

  for file in "${COMMON_FILES[@]}"; do
    mkdir -p "$package_dir/$(dirname "$file")"
    cp "$ROOT_DIR/$file" "$package_dir/$file"
  done

  (
    cd "$package_dir"
    zip -qr "$DIST_DIR/$package_name" manifest.json "${COMMON_FILES[@]}"
  )

  echo "$DIST_DIR/$package_name"
}

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"
generate_icons
node "$ROOT_DIR/scripts/render-manifest.mjs" firefox "$DIST_DIR/manifest.firefox.json"
node "$ROOT_DIR/scripts/render-manifest.mjs" chrome "$DIST_DIR/manifest.chrome.json"

build_package "firefox" "dist/manifest.firefox.json"
build_package "chrome" "dist/manifest.chrome.json"
