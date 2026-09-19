#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
VAULT_DIR="${VAULT_DIR:-$PROJECT_DIR/source}"
NAMESPACE_DIR="${NAMESPACE_DIR:-$VAULT_DIR}"
MEDIA_DIR="${MEDIA_DIR:-$VAULT_DIR/Media}"
SITE_DIR="${SITE_DIR:-$PROJECT_DIR/site}"
QUARTZ_DIR="${QUARTZ_DIR:-/Users/skippy/Git/robot-ChartRoom/quartz}"
CONFIG_TEMPLATE="${CONFIG_TEMPLATE:-$SCRIPT_DIR/termiwiki.quartz.config.ts}"
LAYOUT_TEMPLATE="${LAYOUT_TEMPLATE:-$SCRIPT_DIR/termiwiki.quartz.layout.ts}"
JSONLD_TEMPLATE="${JSONLD_TEMPLATE:-$SCRIPT_DIR/termiwiki.jsonld.ts}"
HTACCESS_TEMPLATE="${HTACCESS_TEMPLATE:-$SCRIPT_DIR/termiwiki.htaccess}"
PROFILE_IMAGE="${PROFILE_IMAGE:-$PROJECT_DIR/source/Media/branding/termisoc_profile_image.png}"

STAGE_DIR="$(mktemp -d "${TMPDIR:-/private/tmp}/termiwiki-stage.XXXXXX")"
QUARTZ_BUILD_DIR="$(mktemp -d "${TMPDIR:-/private/tmp}/termiwiki-quartz.XXXXXX")"
cleanup() {
    rm -rf "$STAGE_DIR" "$QUARTZ_BUILD_DIR"
}
trap cleanup EXIT

echo "==> Building standalone TermiWiki"

for required in "$NAMESPACE_DIR" "$MEDIA_DIR" "$QUARTZ_DIR" "$CONFIG_TEMPLATE" "$LAYOUT_TEMPLATE" "$JSONLD_TEMPLATE" "$HTACCESS_TEMPLATE" "$PROFILE_IMAGE"; do
    if [ ! -e "$required" ]; then
        echo "ERROR: Required path not found: $required" >&2
        exit 1
    fi
done

if ! command -v node >/dev/null 2>&1; then
    echo "ERROR: TermiWiki requires Node.js." >&2
    exit 1
fi

if [ ! -d "$QUARTZ_DIR/node_modules" ]; then
    if ! command -v npm >/dev/null 2>&1; then
        echo "ERROR: Quartz dependencies are missing and npm is unavailable." >&2
        exit 1
    fi
    echo "==> Installing Quartz dependencies"
    npm --prefix "$QUARTZ_DIR" ci
fi

echo "==> Staging namespace notes"
rsync --archive --include='*/' --include='*.md' --exclude='start.md' --exclude='*' "$NAMESPACE_DIR/" "$STAGE_DIR/"
cp "$NAMESPACE_DIR/start.md" "$STAGE_DIR/index.md"
mkdir -p "$STAGE_DIR/Media"
rsync --archive "$MEDIA_DIR/" "$STAGE_DIR/Media/"

echo "==> Preparing isolated Quartz configuration"
cp -R "$QUARTZ_DIR/quartz" "$QUARTZ_BUILD_DIR/quartz"
ln -s "$QUARTZ_DIR/node_modules" "$QUARTZ_BUILD_DIR/node_modules"
cp "$QUARTZ_DIR/package.json" "$QUARTZ_BUILD_DIR/package.json"
cp "$CONFIG_TEMPLATE" "$QUARTZ_BUILD_DIR/quartz.config.ts"
cp "$LAYOUT_TEMPLATE" "$QUARTZ_BUILD_DIR/quartz.layout.ts"
cp "$JSONLD_TEMPLATE" "$QUARTZ_BUILD_DIR/termiwiki.jsonld.ts"

echo "==> Preparing TermiSoc icon assets"
mkdir -p "$QUARTZ_BUILD_DIR/quartz/static"
NODE_PATH="$QUARTZ_DIR/node_modules" node -e '
const sharp = require("sharp")
const input = process.argv[1]
const outputDir = process.argv[2]
const assets = {
  "icon.png": 400,
  "favicon-16.png": 16,
  "favicon-32.png": 32,
  "apple-touch-icon.png": 180,
  "icon-192.png": 192,
  "icon-512.png": 512,
}

Promise.all(
  Object.entries(assets).map(([name, size]) =>
    sharp(input).resize(size, size, { fit: "cover" }).png().toFile(`${outputDir}/${name}`),
  ),
).catch((error) => {
  console.error(error)
  process.exit(1)
})
' "$PROFILE_IMAGE" "$QUARTZ_BUILD_DIR/quartz/static"

echo "==> Generating static site"
rm -rf "$SITE_DIR"
(
    cd "$QUARTZ_BUILD_DIR"
    # The local JSON-LD transformer must run in the main process. Quartz's
    # worker-pool mode serialises built-in plugins but silently omits it.
    node ./quartz/bootstrap-cli.mjs build --concurrency 1 \
        --directory "$STAGE_DIR" \
        --output "$SITE_DIR"
)
cp "$HTACCESS_TEMPLATE" "$SITE_DIR/.htaccess"

echo "==> Standalone TermiWiki created"
echo "    Source: $NAMESPACE_DIR"
echo "    Media:  $MEDIA_DIR"
echo "    Output: $SITE_DIR"

echo "==> Deploying to termisoc.skippy.org.uk"
rsync -avhzP --delete "$SITE_DIR/" -e 'ssh -p 222' \
    philipas@www137.your-server.de:/usr/home/philipas/public_html/termisoc_skippy_org_uk/
echo "==> Deployment complete"
