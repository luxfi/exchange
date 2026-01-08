#!/bin/bash
# Fix react-native-reanimated for React 19 compatibility
# This patches the getCurrentReactOwner() function to handle React 19 internals

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

FIX_CONTENT=''"'"'use strict'"'"';

import React, { forwardRef } from '"'"'react'"'"';
import { isReact19 } from "./PlatformChecker.js";
const IS_REACT_19 = isReact19();
function getCurrentReactOwner() {
  try {
    // Prefer the client internals getOwner when available
    // @ts-expect-error React secret internals are not typed
    const clientInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    const ownerFromClient = typeof (clientInternals?.A?.getOwner) === '"'"'function'"'"'
      ? clientInternals.A.getOwner()
      : null;
    if (ownerFromClient) return ownerFromClient;
    // Fallback to secret internals current owner
    // @ts-expect-error React secret internals are not typed
    const secretCurrent = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactCurrentOwner?.current ?? null;
    if (secretCurrent) return secretCurrent;
    // Server internals fallback (SSR)
    // @ts-expect-error React secret internals are not typed
    const serverCurrent = React.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?.ReactCurrentOwner?.current ?? null;
    return serverCurrent ?? null;
  } catch (_err) {
    return null;
  }
}
export function isReactRendering() {
  return !!getCurrentReactOwner();
}
export function isFirstReactRender() {
  const currentOwner = getCurrentReactOwner();
  // alternate is not null only after the first render and stores all the
  // data from the previous component render
  return currentOwner && !currentOwner?.alternate;
}

// This is an adjusted version of https://github.com/adobe/react-spectrum/issues/7494#issuecomment-2546940052
// eslint-disable-next-line @typescript-eslint/ban-types
export function componentWithRef(render) {
  if (IS_REACT_19) {
    return ({
      ref,
      ...props
    }) => render(props, ref);
  }
  return forwardRef(render);
}
//# sourceMappingURL=reactUtils.js.map'

PATCHED=0
while IFS= read -r file; do
  if ! grep -q "try {" "$file" 2>/dev/null; then
    echo "$FIX_CONTENT" > "$file"
    echo "Patched: $file"
    PATCHED=$((PATCHED + 1))
  fi
done < <(find "$ROOT_DIR/node_modules/.pnpm" -path "*react-native-reanimated*/lib/module/reactUtils.js" 2>/dev/null)

if [ $PATCHED -gt 0 ]; then
  echo "Fixed $PATCHED react-native-reanimated files for React 19 compatibility"
else
  echo "All react-native-reanimated files already patched"
fi
