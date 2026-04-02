#!/bin/sh
# Entrypoint for the exchange container.
#
# If BRAND_PACKAGE is set (e.g. "@zooai/brand"), fetch brand.json from
# the npm package via jsdelivr CDN and write it to /app/public/brand.json.
#
# This means K8s deployments only need:
#   env:
#     - name: BRAND_PACKAGE
#       value: "@zooai/brand"
#
# No ConfigMap, no inlined JSON. Just the package name.
# The brand.json baked into the image (from @luxfi/brand) is the default.

set -e

if [ -n "$BRAND_PACKAGE" ]; then
  # Validate BRAND_PACKAGE: known scope + strict package name (no path traversal)
  if ! echo "$BRAND_PACKAGE" | grep -qE '^@(luxfi|zooai|hanzoai|l\.x)/[a-z0-9._-]+(@[a-z0-9._-]+)?$'; then
    echo "ERROR: BRAND_PACKAGE must be @luxfi/, @zooai/, @hanzoai/, or @l.x/ with valid package name"
    exit 1
  fi
  # BRAND_PACKAGE can be:
  #   @zooai/brand          -> latest version
  #   @zooai/brand@1.2.0    -> pinned version
  BRAND_URL="https://cdn.jsdelivr.net/npm/${BRAND_PACKAGE}/brand.json"
  echo "Fetching brand.json from ${BRAND_URL}"
  wget -q -O /app/public/brand.json "$BRAND_URL" || {
    echo "WARN: Failed to fetch brand.json from ${BRAND_URL}, using default"
  }
fi

exec "$@"
