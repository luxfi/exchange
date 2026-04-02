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
